import asyncHandler from './asyncHandler.js';

/**
 * Role-Based Permission Control Middleware
 * Centralized authorization check for admin/staff operational routes.
 */
export const requirePermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { role } = req.user;

    // Admin role has full system permissions
    if (role === 'admin') {
      return next();
    }

    // Staff role permission checks
    if (role === 'staff') {
      const allowedStaffPermissions = [
        'applications.read',
        'applications.update',
        'applications.assign',
        'documents.read',
        'documents.review',
        'customers.read',
        'support.read',
        'support.manage',
        'tasks.read',
        'tasks.manage',
        'appointments.read',
        'appointments.manage',
        'reports.read'
      ];

      if (allowedStaffPermissions.includes(permission)) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Permission "${permission}" is required.`
    });
  });
};
