import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

// Default in-memory site settings fallback
let memorySettings = {
  centerName: 'CSC Center - Digital Service Assistant',
  phone: '+91 9876543210',
  email: 'support@csccenter.in',
  address: 'Shop No. 12, Main Market Road, Near Bus Stand',
  workingHours: 'Mon - Sat: 9:30 AM - 7:00 PM',
  whatsapp: '+91 9876543210'
};

/**
 * GET /api/admin/payments
 * Read-Only Logged Payment Transactions View
 */
export const getAdminPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('payments')
      .select('*, applications(application_id, full_name, services(title))', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`transaction_id.ilike.%${search}%`);
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

    const formatted = data.map(p => ({
      id: p.id,
      transactionId: p.transaction_id || 'N/A',
      applicationId: p.applications?.application_id || 'N/A',
      applicantName: p.applications?.full_name || 'Customer',
      serviceTitle: p.applications?.services?.title || 'Digital Service',
      amount: p.amount,
      currency: p.currency || 'INR',
      paymentMethod: p.payment_method || 'UPI/Cash',
      status: p.status,
      paidAt: p.paid_at,
      createdAt: p.created_at
    }));

    return res.status(200).json({
      success: true,
      count: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: formatted
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
 * GET /api/admin/settings
 */
export const getAdminSettings = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: memorySettings
  });
});

/**
 * PUT /api/admin/settings
 */
export const updateAdminSettings = asyncHandler(async (req, res) => {
  const { centerName, phone, email, address, workingHours, whatsapp } = req.body;

  if (centerName) memorySettings.centerName = centerName.trim();
  if (phone) memorySettings.phone = phone.trim();
  if (email) memorySettings.email = email.trim();
  if (address) memorySettings.address = address.trim();
  if (workingHours) memorySettings.workingHours = workingHours.trim();
  if (whatsapp) memorySettings.whatsapp = whatsapp.trim();

  return res.status(200).json({
    success: true,
    message: 'Center settings updated successfully.',
    data: memorySettings
  });
});
