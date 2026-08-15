import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/reports/:type
 * Tabular Report Data Generator
 */
export const getAdminReportData = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { range = '30days' } = req.query;

  try {
    if (type === 'applications') {
      const { data } = await supabase
        .from('applications')
        .select('id, application_id, full_name, mobile, email, status, payment_status, created_at, services(title)')
        .order('created_at', { ascending: false })
        .limit(100);

      const rows = (data || []).map(a => ({
        applicationId: a.application_id,
        applicantName: a.full_name,
        mobile: a.mobile,
        serviceTitle: a.services?.title || 'Digital Service',
        status: a.status,
        paymentStatus: a.payment_status,
        createdAt: new Date(a.created_at).toLocaleDateString('en-IN')
      }));

      return res.status(200).json({ success: true, type, data: rows });
    }

    if (type === 'payments') {
      const { data } = await supabase
        .from('payments')
        .select('id, transaction_id, amount, currency, status, paid_at, created_at, applications(application_id, full_name, services(title))')
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(100);

      const rows = (data || []).map(p => ({
        transactionId: p.transaction_id || 'N/A',
        applicationId: p.applications?.application_id || 'N/A',
        applicantName: p.applications?.full_name || 'N/A',
        serviceTitle: p.applications?.services?.title || 'Digital Service',
        amount: p.amount,
        currency: p.currency || 'INR',
        paidAt: p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-IN') : 'N/A'
      }));

      return res.status(200).json({ success: true, type, data: rows });
    }

    if (type === 'customers') {
      const { data } = await supabase
        .from('users')
        .select('id, full_name, email, mobile, created_at, applications(id)')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })
        .limit(100);

      const rows = (data || []).map(c => ({
        customerName: c.full_name || 'N/A',
        email: c.email,
        mobile: c.mobile || 'N/A',
        totalApplications: (c.applications || []).length,
        registeredAt: new Date(c.created_at).toLocaleDateString('en-IN')
      }));

      return res.status(200).json({ success: true, type, data: rows });
    }

    return res.status(400).json({ success: false, message: `Unsupported report type "${type}".` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to generate report data.' });
  }
});

/**
 * GET /api/admin/reports/:type/export
 * Server-Side CSV Export Stream
 */
export const exportReportCsv = asyncHandler(async (req, res) => {
  const { type } = req.params;

  try {
    let filename = `CSC_${type}_report_${Date.now()}.csv`;
    let csvHeader = '';
    let csvRows = [];

    if (type === 'applications') {
      const { data } = await supabase
        .from('applications')
        .select('application_id, full_name, mobile, email, status, payment_status, created_at, services(title)')
        .order('created_at', { ascending: false })
        .limit(500);

      csvHeader = 'Application Ref ID,Applicant Name,Mobile,Email,Service Title,Status,Payment Status,Submission Date\n';
      csvRows = (data || []).map(a => {
        const name = `"${(a.full_name || '').replace(/"/g, '""')}"`;
        const service = `"${(a.services?.title || '').replace(/"/g, '""')}"`;
        const date = new Date(a.created_at).toISOString().split('T')[0];
        return `${a.application_id},${name},${a.mobile},${a.email || ''},${service},${a.status},${a.payment_status},${date}`;
      });
    } else if (type === 'payments') {
      const { data } = await supabase
        .from('payments')
        .select('transaction_id, amount, currency, status, paid_at, created_at, applications(application_id, full_name, services(title))')
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(500);

      csvHeader = 'Transaction ID,Application Ref ID,Applicant Name,Service Title,Amount,Currency,Paid Date\n';
      csvRows = (data || []).map(p => {
        const name = `"${(p.applications?.full_name || '').replace(/"/g, '""')}"`;
        const service = `"${(p.applications?.services?.title || '').replace(/"/g, '""')}"`;
        const date = p.paid_at ? new Date(p.paid_at).toISOString().split('T')[0] : '';
        return `${p.transaction_id || ''},${p.applications?.application_id || ''},${name},${service},${p.amount},${p.currency || 'INR'},${date}`;
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid CSV export report type.' });
    }

    const csvContent = csvHeader + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to generate CSV export.' });
  }
});
