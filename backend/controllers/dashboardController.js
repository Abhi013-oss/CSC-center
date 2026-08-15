import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/dashboard/stats
 * Real Database Counts for Admin Dashboard Overview Cards
 * Query Params: range (today, 7days, 30days, all)
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { range = 'all' } = req.query;

  let dateFilter = null;
  const now = new Date();

  if (range === 'today') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateFilter = today.toISOString();
  } else if (range === '7days') {
    const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = d7.toISOString();
  } else if (range === '30days') {
    const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = d30.toISOString();
  }

  try {
    // 1. Applications Count Query
    let appQuery = supabase.from('applications').select('status', { count: 'exact' });
    if (dateFilter) {
      appQuery = appQuery.gte('created_at', dateFilter);
    }
    const { data: appsData, count: totalApps } = await appQuery;

    const statusCounts = {
      totalApplications: totalApps || 0,
      pendingApplications: 0,
      underReviewApplications: 0,
      documentRequiredApplications: 0,
      approvedApplications: 0,
      completedApplications: 0,
      rejectedApplications: 0
    };

    if (appsData && appsData.length > 0) {
      appsData.forEach(app => {
        if (app.status === 'pending') statusCounts.pendingApplications++;
        else if (app.status === 'under_review') statusCounts.underReviewApplications++;
        else if (app.status === 'document_required') statusCounts.documentRequiredApplications++;
        else if (app.status === 'approved') statusCounts.approvedApplications++;
        else if (app.status === 'completed') statusCounts.completedApplications++;
        else if (app.status === 'rejected') statusCounts.rejectedApplications++;
      });
    }

    // 2. Registered Customers Count Query
    const { count: totalUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'customer');

    // 3. Active Services Count Query
    const { count: activeServices } = await supabase
      .from('services')
      .select('id', { count: 'exact', head: true })
      .eq('available', true);

    // 4. Unread Messages Count Query
    const { count: unreadMessages } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new');

    return res.status(200).json({
      success: true,
      data: {
        ...statusCounts,
        totalUsers: totalUsers || 0,
        activeServices: activeServices || 0,
        unreadMessages: unreadMessages || 0
      }
    });
  } catch (err) {
    console.error('[dashboardController] Stats calculation error:', err.message);
    return res.status(200).json({
      success: true,
      data: {
        totalApplications: 0,
        pendingApplications: 0,
        underReviewApplications: 0,
        documentRequiredApplications: 0,
        approvedApplications: 0,
        completedApplications: 0,
        rejectedApplications: 0,
        totalUsers: 0,
        activeServices: 0,
        unreadMessages: 0
      }
    });
  }
});

/**
 * GET /api/admin/dashboard/status-distribution
 */
export const getStatusDistribution = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('status');

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    const distributionMap = {};
    data.forEach(app => {
      const st = app.status || 'pending';
      distributionMap[st] = (distributionMap[st] || 0) + 1;
    });

    const formatted = Object.keys(distributionMap).map(status => ({
      status,
      count: distributionMap[status]
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * GET /api/admin/dashboard/service-performance
 */
export const getServicePerformance = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('services(title)');

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    const performanceMap = {};
    data.forEach(app => {
      const title = app.services?.title || 'Other Service';
      performanceMap[title] = (performanceMap[title] || 0) + 1;
    });

    const sorted = Object.keys(performanceMap)
      .map(title => ({ service: title, count: performanceMap[title] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: sorted
    });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * GET /api/admin/dashboard/application-trend
 */
export const getApplicationTrend = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    const trendMap = {};
    data.forEach(app => {
      const dateStr = new Date(app.created_at).toISOString().split('T')[0];
      trendMap[dateStr] = (trendMap[dateStr] || 0) + 1;
    });

    const formatted = Object.keys(trendMap).map(date => ({
      date,
      count: trendMap[date]
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});
