import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/users
 * Paginated User Account Listing for Administrator Desk
 */
export const getAdminUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('users')
      .select('id, full_name, email, mobile, role, is_active, created_at, updated_at', { count: 'exact' });

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,mobile.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error || !data) {
      return res.status(200).json({
        success: true,
        count: 0,
        page: pageNum,
        limit: limitNum,
        totalPages: 0,
        data: []
      });
    }

    const totalCount = count || data.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const formattedUsers = data.map(u => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      mobile: u.mobile,
      role: u.role,
      isActive: u.is_active,
      createdAt: u.created_at,
      updatedAt: u.updated_at
    }));

    return res.status(200).json({
      success: true,
      count: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: formattedUsers
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      count: 0,
      page: pageNum,
      limit: limitNum,
      totalPages: 0,
      data: []
    });
  }
});

/**
 * GET /api/admin/users/:userId
 */
export const getAdminUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: userRecord, error } = await supabase
      .from('users')
      .select('id, full_name, email, mobile, role, is_active, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !userRecord) {
      return res.status(404).json({ success: false, message: 'User record not found.' });
    }

    // Fetch user's application count
    const { count: appCount } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    return res.status(200).json({
      success: true,
      data: {
        id: userRecord.id,
        fullName: userRecord.full_name,
        email: userRecord.email,
        mobile: userRecord.mobile,
        role: userRecord.role,
        isActive: userRecord.is_active,
        applicationCount: appCount || 0,
        createdAt: userRecord.created_at,
        updatedAt: userRecord.updated_at
      }
    });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'User record not found.' });
  }
});

/**
 * PATCH /api/admin/users/:userId/status
 * Toggle Customer Account Activation (isActive: boolean)
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Please supply a boolean value for isActive.' });
  }

  // Prevent self-deactivation of current admin account
  if (req.user.id === userId && isActive === false) {
    return res.status(400).json({ success: false, message: 'You cannot deactivate your own administrative account.' });
  }

  const { data, error } = await supabase
    .from('users')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('id, full_name, email, is_active')
    .single();

  if (error || !data) {
    return res.status(400).json({ success: false, message: 'Failed to update user status.' });
  }

  return res.status(200).json({
    success: true,
    message: `User account for "${data.full_name}" has been ${isActive ? 'activated' : 'deactivated'}.`,
    data: {
      id: data.id,
      fullName: data.full_name,
      isActive: data.is_active
    }
  });
});
