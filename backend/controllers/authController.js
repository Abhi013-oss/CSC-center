import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * POST /api/auth/register
 * Customer Account Registration
 */
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password } = req.body;

  const regName = (fullName || '').trim();
  const regEmail = (email || '').trim().toLowerCase();
  const regMobile = (mobile || '').trim();
  const regPassword = password || '';

  // 1. Validation
  if (!regName) {
    return res.status(400).json({ success: false, message: 'Full name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regEmail || !emailRegex.test(regEmail)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!regMobile || !phoneRegex.test(regMobile)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number.' });
  }

  if (!regPassword || regPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
  }

  // 2. Check for duplicate mobile or email in users table
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, email, mobile')
    .or(`mobile.eq.${regMobile},email.eq.${regEmail}`)
    .maybeSingle();

  if (existingUser) {
    if (existingUser.mobile === regMobile) {
      return res.status(409).json({ success: false, message: 'An account with this mobile number already exists.' });
    }
    if (existingUser.email === regEmail) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }
  }

  // 3. Register User in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: regEmail,
    password: regPassword,
    options: {
      data: {
        full_name: regName,
        mobile: regMobile,
      }
    }
  });

  if (authError || !authData || !authData.user) {
    return res.status(400).json({
      success: false,
      message: authError?.message || 'Registration failed. Please check your credentials.'
    });
  }

  const authUserId = authData.user.id;

  // 4. Create Profile in public.users table (ENFORCE role = 'customer')
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .upsert([
      {
        id: authUserId,
        full_name: regName,
        email: regEmail,
        mobile: regMobile,
        role: 'customer', // Self-promotion prevention: ALWAYS customer!
        is_active: true
      }
    ])
    .select()
    .single();

  if (profileError) {
    console.error('[authController] Profile creation error:', profileError.message);
  }

  const session = authData.session;
  const isEmailConfirmationRequired = !session;

  return res.status(201).json({
    success: true,
    message: isEmailConfirmationRequired
      ? 'Registration successful! Please check your email to verify your account.'
      : 'Account registered successfully.',
    data: {
      accessToken: session?.access_token || null,
      refreshToken: session?.refresh_token || null,
      isEmailConfirmationRequired,
      user: {
        id: authUserId,
        fullName: regName,
        email: regEmail,
        mobile: regMobile,
        role: 'customer'
      }
    }
  });
});

/**
 * POST /api/auth/login
 * User Authentication & Token Generation
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const loginEmail = (email || '').trim().toLowerCase();
  const loginPassword = password || '';

  if (!loginEmail || !loginPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  // 1. Authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: loginPassword
  });

  if (authError || !authData || !authData.session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  const authUserId = authData.user.id;

  // 2. Fetch User Profile
  const { data: profile } = await supabase
    .from('users')
    .select('id, full_name, email, mobile, role, is_active')
    .eq('id', authUserId)
    .single();

  if (profile && profile.is_active === false) {
    return res.status(403).json({
      success: false,
      message: 'Your account is currently inactive. Please contact customer support.'
    });
  }

  const userRole = profile?.role || 'customer';
  const fullName = profile?.full_name || authData.user.user_metadata?.full_name || 'User';
  const mobile = profile?.mobile || authData.user.user_metadata?.mobile || '';

  return res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      user: {
        id: authUserId,
        fullName,
        email: loginEmail,
        mobile,
        role: userRole
      }
    }
  });
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    // Ignore signout errors on server side
  }

  return res.status(200).json({
    success: true,
    message: 'Signed out successfully.'
  });
});

/**
 * GET /api/auth/me
 * Return authenticated user's profile
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      id: req.user.id,
      fullName: req.user.fullName,
      email: req.user.email,
      mobile: req.user.mobile,
      role: req.user.role,
      isActive: true
    }
  });
});

/**
 * PUT /api/auth/profile
 * Update profile details (fullName, mobile)
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, mobile } = req.body;

  const updateFields = {};
  if (fullName && fullName.trim()) updateFields.full_name = fullName.trim();
  if (mobile && mobile.trim()) {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(mobile.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number.' });
    }
    updateFields.mobile = mobile.trim();
  }

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ success: false, message: 'No valid profile fields provided for update.' });
  }

  const { data: updated, error } = await supabase
    .from('users')
    .update(updateFields)
    .eq('id', req.user.id)
    .select('id, full_name, email, mobile, role')
    .single();

  if (error) {
    return res.status(400).json({ success: false, message: 'Failed to update profile.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: {
      id: updated.id,
      fullName: updated.full_name,
      email: updated.email,
      mobile: updated.mobile,
      role: updated.role
    }
  });
});

/**
 * POST /api/auth/forgot-password
 * Anti-enumeration password recovery request
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const targetEmail = (email || '').trim().toLowerCase();

  if (targetEmail) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
      await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${frontendUrl}/reset-password`
      });
    } catch (err) {
      // Ignore errors for anti-enumeration
    }
  }

  return res.status(200).json({
    success: true,
    message: 'If an account exists for this email, password reset instructions will be sent.'
  });
});

/**
 * POST /api/auth/reset-password
 * Password update via valid recovery session
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long.'
    });
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update password.'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Password updated successfully. You can now sign in with your new password.'
  });
});
