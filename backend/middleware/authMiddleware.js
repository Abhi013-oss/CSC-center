import { supabase } from '../config/supabase.js';

/**
 * Authentication Middleware
 * Reads Bearer token, verifies identity via Supabase Auth, fetches profile from users table,
 * checks account activation status, and attaches req.user = { id, email, role, fullName, mobile }.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 1. Verify token with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData || !authData.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid, expired, or revoked authentication session.'
      });
    }

    const authUserId = authData.user.id;
    const authEmail = authData.user.email;

    // 2. Fetch application user profile from users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, full_name, email, mobile, role, is_active')
      .eq('id', authUserId)
      .single();

    if (profileError || !userProfile) {
      // If profile is missing, fallback to auth claims for safe customer identity
      req.user = {
        id: authUserId,
        email: authEmail,
        role: 'customer',
        fullName: authData.user.user_metadata?.full_name || 'Customer',
        mobile: authData.user.user_metadata?.mobile || ''
      };
      return next();
    }

    // 3. Account Activation Check (Requirement 41)
    if (userProfile.is_active === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact support.'
      });
    }

    // 4. Attach verified server identity to req.user
    req.user = {
      id: userProfile.id,
      email: userProfile.email || authEmail,
      role: userProfile.role || 'customer',
      fullName: userProfile.full_name,
      mobile: userProfile.mobile
    };

    next();
  } catch (error) {
    console.error('[authMiddleware] Authentication exception:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication verification failed.'
    });
  }
};
