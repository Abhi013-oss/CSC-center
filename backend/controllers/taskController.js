import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/tasks
 * Paginated Staff Tasks Listing
 */
export const getAdminTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, status, priority } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error || !data) {
      return res.status(200).json({ success: true, count: 0, page: pageNum, limit: limitNum, totalPages: 0, data: [] });
    }

    const totalCount = count || data.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const formatted = data.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      dueAt: t.due_at,
      completedAt: t.completed_at,
      createdAt: t.created_at
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
    return res.status(200).json({ success: true, count: 0, page: pageNum, limit: limitNum, totalPages: 0, data: [] });
  }
});

/**
 * POST /api/admin/tasks
 * Create Staff Internal Task
 */
export const createTask = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { title, description, priority = 'normal', dueAt, applicationId, customerId } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Task title is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          description: description ? description.trim() : null,
          created_by: adminId,
          assigned_to: adminId,
          application_id: applicationId || null,
          customer_id: customerId || null,
          priority,
          status: 'todo',
          due_at: dueAt || null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
});

/**
 * PATCH /api/admin/tasks/:id/status
 * Update Task Status
 */
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updates = { status };
  if (status === 'completed') updates.completed_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Task status updated.',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
});

/**
 * GET /api/admin/work-queue
 * Prioritized Operator Work Queue Aggregation
 */
export const getWorkQueue = asyncHandler(async (req, res) => {
  try {
    // 1. Pending Application Reviews
    const { data: pendingApps } = await supabase
      .from('applications')
      .select('id, application_id, full_name, status, created_at, services(title)')
      .in('status', ['pending', 'under_review', 'document_required'])
      .order('created_at', { ascending: true })
      .limit(10);

    // 2. Urgent Support Tickets
    const { data: urgentTickets } = await supabase
      .from('support_tickets')
      .select('id, ticket_number, subject, priority, status, created_at')
      .in('status', ['open', 'in_progress'])
      .order('created_at', { ascending: true })
      .limit(10);

    // 3. High Priority Tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title, priority, status, due_at, created_at')
      .in('status', ['todo', 'in_progress'])
      .order('created_at', { ascending: true })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: {
        pendingApplications: (pendingApps || []).map(a => ({
          id: a.id,
          applicationId: a.application_id,
          applicantName: a.full_name,
          serviceTitle: a.services?.title || 'Digital Service',
          status: a.status,
          createdAt: a.created_at
        })),
        urgentTickets: (urgentTickets || []).map(t => ({
          id: t.id,
          ticketNumber: t.ticket_number,
          subject: t.subject,
          priority: t.priority,
          status: t.status,
          createdAt: t.created_at
        })),
        pendingTasks: (tasks || []).map(t => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
          status: t.status,
          dueAt: t.due_at,
          createdAt: t.created_at
        }))
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to aggregate work queue.' });
  }
});
