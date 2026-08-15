import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/staff
 * Staff Roster & Workload Overview
 */
export const getStaffRoster = asyncHandler(async (req, res) => {
  try {
    const { data: staffList, error } = await supabase
      .from('users')
      .select('id, full_name, email, mobile, role, is_active, created_at')
      .in('role', ['staff', 'admin'])
      .order('created_at', { ascending: false });

    if (error || !staffList) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Fetch Workload Counts for each staff member
    const formatted = await Promise.all(staffList.map(async (s) => {
      const { count: assignedApps } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('assigned_to', s.id)
        .in('status', ['pending', 'under_review', 'document_required']);

      const { count: openTasks } = await supabase
        .from('tasks')
        .select('id', { count: 'exact' })
        .eq('assigned_to', s.id)
        .in('status', ['todo', 'in_progress']);

      return {
        id: s.id,
        fullName: s.full_name || 'N/A',
        email: s.email,
        mobile: s.mobile || 'N/A',
        role: s.role,
        isActive: s.is_active,
        createdAt: s.created_at,
        assignedApplications: assignedApps || 0,
        openTasks: openTasks || 0
      };
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load staff roster.' });
  }
});

/**
 * POST /api/admin/staff/invite
 * Create Cryptographically Secure Single-Use Staff Invitation Token
 */
export const createStaffInvitation = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { email, fullName, role = 'staff' } = req.body;

  if (!email || !fullName) {
    return res.status(400).json({ success: false, message: 'Email and full name are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48-hour expiration

  try {
    const { data, error } = await supabase
      .from('staff_invitations')
      .insert([
        {
          token,
          email: cleanEmail,
          full_name: fullName.trim(),
          role: role === 'admin' ? 'admin' : 'staff',
          invited_by: adminId,
          status: 'pending',
          expires_at: expiresAt
        }
      ])
      .select()
      .single();

    if (error) throw error;

    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-staff-invite?token=${token}`;

    return res.status(201).json({
      success: true,
      message: `Staff invitation link generated for ${cleanEmail}.`,
      data: {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        role: data.role,
        inviteLink,
        expiresAt: data.expires_at
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create staff invitation.' });
  }
});

/**
 * POST /api/auth/staff/activate
 * Activate Staff Account via Invitation Token
 */
export const acceptStaffInvitation = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Invitation token and password are required.' });
  }

  try {
    // 1. Verify Invitation Token
    const { data: invite, error: inviteErr } = await supabase
      .from('staff_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (inviteErr || !invite || new Date(invite.expires_at) < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired staff invitation token.' });
    }

    // 2. Create User Record or Update Role
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', invite.email)
      .single();

    let userId;
    if (existingUser) {
      userId = existingUser.id;
      await supabase
        .from('users')
        .update({ role: invite.role, is_active: true, updated_at: new Date().toISOString() })
        .eq('id', userId);
    } else {
      const { data: newUser, error: createErr } = await supabase
        .from('users')
        .insert([
          {
            email: invite.email,
            full_name: invite.full_name,
            role: invite.role,
            is_active: true
          }
        ])
        .select()
        .single();

      if (createErr) throw createErr;
      userId = newUser.id;
    }

    // Mark invitation token as accepted
    await supabase.from('staff_invitations').update({ status: 'accepted' }).eq('id', invite.id);

    return res.status(200).json({
      success: true,
      message: 'Staff account activated successfully. You can now sign in.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to activate staff account.' });
  }
});

/**
 * PATCH /api/admin/staff/:staffId/status
 * Staff Status & Role Update with Last Admin Protection
 */
export const updateStaffRoleStatus = asyncHandler(async (req, res) => {
  const { staffId } = req.params;
  const { role, isActive } = req.body;

  try {
    const { data: targetUser, error: fetchErr } = await supabase
      .from('users')
      .select('id, role, is_active')
      .eq('id', staffId)
      .single();

    if (fetchErr || !targetUser) {
      return res.status(404).json({ success: false, message: 'Staff member not found.' });
    }

    // LAST ADMIN PROTECTION: Ensure system does not deactivate or demote the last active admin
    if (targetUser.role === 'admin' && (isActive === false || role === 'staff')) {
      const { count: activeAdmins } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('role', 'admin')
        .eq('is_active', true);

      if (activeAdmins <= 1) {
        return res.status(400).json({
          success: false,
          message: '[SECURITY SAFETY BLOCK] Cannot deactivate or demote the last active system administrator.'
        });
      }
    }

    const updates = { updated_at: new Date().toISOString() };
    if (role) updates.role = role;
    if (typeof isActive === 'boolean') updates.is_active = isActive;

    const { data: updated, error: updateErr } = await supabase
      .from('users')
      .update(updates)
      .eq('id', staffId)
      .select('id, full_name, email, role, is_active')
      .single();

    if (updateErr) throw updateErr;

    return res.status(200).json({
      success: true,
      message: 'Staff member role/status updated.',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update staff record.' });
  }
});
