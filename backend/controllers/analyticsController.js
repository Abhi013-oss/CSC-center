import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

const getDateBoundary = (range) => {
  const now = new Date();
  if (range === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return start.toISOString();
  }
  if (range === '7days') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (range === '30days') {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (range === '90days') {
    return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (range === 'this_year') {
    return new Date(now.getFullYear(), 0, 1).toISOString();
  }
  return null;
};

/**
 * GET /api/admin/analytics/overview
 * Real-time Business Intelligence KPIs
 */
export const getAnalyticsOverview = asyncHandler(async (req, res) => {
  const { range = '30days' } = req.query;
  const since = getDateBoundary(range);

  try {
    // 1. Applications Count & Distribution
    let appQuery = supabase.from('applications').select('id, status, payment_status, created_at, updated_at');
    if (since) appQuery = appQuery.gte('created_at', since);
    const { data: apps } = await appQuery;

    const totalApps = apps ? apps.length : 0;
    let completedApps = 0;
    let pendingApps = 0;
    let rejectedApps = 0;
    let paidApps = 0;

    (apps || []).forEach(a => {
      if (a.status === 'completed') completedApps++;
      if (a.status === 'pending' || a.status === 'under_review') pendingApps++;
      if (a.status === 'rejected') rejectedApps++;
      if (a.payment_status === 'paid') paidApps++;
    });

    // 2. Verified Revenue Calculation (Strictly from paid payments)
    let payQuery = supabase.from('payments').select('amount, status, created_at').eq('status', 'paid');
    if (since) payQuery = payQuery.gte('created_at', since);
    const { data: payments } = await payQuery;

    let totalRevenue = 0;
    (payments || []).forEach(p => {
      totalRevenue += parseFloat(p.amount || 0);
    });

    // 3. Customers Count
    let userQuery = supabase.from('users').select('id', { count: 'exact' }).eq('role', 'customer');
    if (since) userQuery = userQuery.gte('created_at', since);
    const { count: customerCount } = await userQuery;

    // 4. Open Support Tickets Count
    const { count: openTickets } = await supabase
      .from('support_tickets')
      .select('id', { count: 'exact' })
      .in('status', ['open', 'in_progress', 'waiting_customer']);

    const completionRate = totalApps > 0 ? Math.round((completedApps / totalApps) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        range,
        summary: {
          totalApplications: totalApps,
          completedApplications: completedApps,
          pendingApplications: pendingApps,
          rejectedApplications: rejectedApps,
          paidApplications: paidApps,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCustomers: customerCount || 0,
          openSupportTickets: openTickets || 0,
          completionRate: `${completionRate}%`
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving analytics overview.' });
  }
});

/**
 * GET /api/admin/analytics/funnel
 * Real Conversion Funnel Analysis
 */
export const getFunnelAnalytics = asyncHandler(async (req, res) => {
  try {
    const { count: totalUsers } = await supabase.from('users').select('id', { count: 'exact' }).eq('role', 'customer');
    const { count: totalApps } = await supabase.from('applications').select('id', { count: 'exact' });
    const { count: paidApps } = await supabase.from('applications').select('id', { count: 'exact' }).eq('payment_status', 'paid');
    const { count: completedApps } = await supabase.from('applications').select('id', { count: 'exact' }).eq('status', 'completed');

    return res.status(200).json({
      success: true,
      data: [
        { stage: 'Registered Customers', count: totalUsers || 0 },
        { stage: 'Submitted Applications', count: totalApps || 0 },
        { stage: 'Paid Applications', count: paidApps || 0 },
        { stage: 'Completed Applications', count: completedApps || 0 }
      ]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to generate conversion funnel.' });
  }
});

/**
 * GET /api/admin/analytics/services
 * Service Performance Ranking
 */
export const getServiceAnalytics = asyncHandler(async (req, res) => {
  try {
    const { data: services } = await supabase
      .from('services')
      .select('id, title, category, service_fee, applications(id, status, payment_status)');

    const result = (services || []).map(s => {
      const apps = s.applications || [];
      const total = apps.length;
      let completed = 0;
      let paid = 0;

      apps.forEach(a => {
        if (a.status === 'completed') completed++;
        if (a.payment_status === 'paid') paid++;
      });

      const fee = parseFloat(s.service_fee || 0);
      const revenue = paid * fee;

      return {
        id: s.id,
        title: s.title,
        category: s.category,
        totalApplications: total,
        completedApplications: completed,
        revenue: Math.round(revenue * 100) / 100,
        completionRate: total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%'
      };
    });

    result.sort((a, b) => b.totalApplications - a.totalApplications);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to calculate service analytics.' });
  }
});
