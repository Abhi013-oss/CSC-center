import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/customers
 * Paginated CRM Customer Search
 */
export const getAdminCustomers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, search } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('users')
      .select('id, full_name, email, mobile, is_active, role, created_at, applications(id, status, payment_status)', { count: 'exact' })
      .eq('role', 'customer');

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,mobile.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error || !data) {
      return res.status(200).json({ success: true, count: 0, page: pageNum, limit: limitNum, totalPages: 0, data: [] });
    }

    const totalCount = count || data.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const formatted = data.map(c => {
      const apps = c.applications || [];
      const totalApps = apps.length;
      let completedApps = 0;
      apps.forEach(a => { if (a.status === 'completed') completedApps++; });

      return {
        id: c.id,
        fullName: c.full_name || 'N/A',
        email: c.email,
        mobile: c.mobile || 'N/A',
        isActive: c.is_active,
        totalApplications: totalApps,
        completedApplications: completedApps,
        createdAt: c.created_at
      };
    });

    return res.status(200).json({
      success: true,
      count: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: formatted
    });
  } catch (err) {
    return res.status(200).json({ success: true, count: 0, page: pageNum, limit: limitNum, totalPages: 0, data: [] });
  }
});

/**
 * GET /api/admin/customers/:customerId
 * Customer CRM Profile & Unified Event Timeline
 */
export const getAdminCustomerDetails = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  try {
    // 1. Fetch User Record
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, full_name, email, mobile, is_active, role, created_at')
      .eq('id', customerId)
      .single();

    if (userErr || !user) {
      return res.status(404).json({ success: false, message: 'Customer record not found.' });
    }

    // 2. Fetch Customer Applications
    const { data: applications } = await supabase
      .from('applications')
      .select('id, application_id, status, payment_status, created_at, services(title)')
      .eq('user_id', customerId)
      .order('created_at', { ascending: false });

    // 3. Fetch Support Tickets
    const { data: tickets } = await supabase
      .from('support_tickets')
      .select('id, ticket_number, subject, category, priority, status, created_at')
      .eq('user_id', customerId)
      .order('created_at', { ascending: false });

    // 4. Fetch Internal Notes
    const { data: notes } = await supabase
      .from('customer_notes')
      .select('*')
      .eq('user_id', customerId)
      .order('created_at', { ascending: false });

    // 5. Build Unified Real Timeline Events
    const timeline = [];

    timeline.push({
      type: 'account_created',
      title: 'Customer Registration',
      description: `Account registered with email ${user.email}`,
      date: user.created_at
    });

    (applications || []).forEach(a => {
      timeline.push({
        type: 'application_submitted',
        title: `Application Submitted (${a.application_id})`,
        description: `Applied for ${a.services?.title || 'Digital Service'} - Status: ${a.status}`,
        date: a.created_at
      });
    });

    (tickets || []).forEach(t => {
      timeline.push({
        type: 'support_ticket',
        title: `Support Ticket Opened (${t.ticket_number})`,
        description: `${t.subject} - Priority: ${t.priority}`,
        date: t.created_at
      });
    });

    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          mobile: user.mobile,
          isActive: user.is_active,
          createdAt: user.created_at
        },
        applications: (applications || []).map(a => ({
          id: a.id,
          applicationId: a.application_id,
          serviceTitle: a.services?.title || 'Digital Service',
          status: a.status,
          paymentStatus: a.payment_status,
          createdAt: a.created_at
        })),
        tickets: (tickets || []).map(t => ({
          id: t.id,
          ticketNumber: t.ticket_number,
          subject: t.subject,
          category: t.category,
          priority: t.priority,
          status: t.status,
          createdAt: t.created_at
        })),
        notes: (notes || []).map(n => ({
          id: n.id,
          note: n.note,
          createdBy: n.created_by,
          createdAt: n.created_at
        })),
        timeline
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load customer profile.' });
  }
});

/**
 * POST /api/admin/customers/:customerId/notes
 * Add Internal CRM Customer Note
 */
export const createCustomerNote = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { customerId } = req.params;
  const { note } = req.body;

  if (!note || !note.trim()) {
    return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
  }

  try {
    const { data, error } = await supabase
      .from('customer_notes')
      .insert([
        {
          user_id: customerId,
          note: note.trim(),
          created_by: adminId
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Internal customer note logged.',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to log customer note.' });
  }
});
