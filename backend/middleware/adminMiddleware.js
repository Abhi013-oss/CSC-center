import { supabase } from '../config/supabase.js';

/**
 * Admin Authorization Middleware
 * Verifies that the authenticated user has role = 'admin' AND has a record in admin_users.
 * Never trusts frontend-supplied roles or client parameters.
 */
export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required prior to administrative authorization.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privileges required.'
    });
  }

  try {
    // Verify existence in admin_users table (Requirement 40)
    const { data: adminRecord, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (error || !adminRecord) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Unverified administrative credentials.'
      });
    }

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Administrative authorization check failed.'
    });
  }
};
