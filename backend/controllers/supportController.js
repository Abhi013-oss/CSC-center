import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

const generateTicketNumber = () => {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SUP-${year}-${randomHex}`;
};

/**
 * POST /api/support
 * Customer Support Ticket Creation
 */
export const createSupportTicket = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { subject, description, category = 'General', applicationId } = req.body;

  if (!subject || !subject.trim()) {
    return res.status(400).json({ success: false, message: 'Ticket subject is required.' });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, message: 'Ticket description is required.' });
  }

  const ticketNumber = generateTicketNumber();

  try {
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          ticket_number: ticketNumber,
          user_id: userId,
          application_id: applicationId || null,
          subject: subject.trim(),
          description: description.trim(),
          category,
          priority: 'normal',
          status: 'open'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Log initial customer message in support_messages thread
    await supabase.from('support_messages').insert([
      {
        ticket_id: ticket.id,
        sender_id: userId,
        sender_type: 'customer',
        message: description.trim()
      }
    ]);

    return res.status(201).json({
      success: true,
      message: 'Support ticket created successfully.',
      data: {
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        subject: ticket.subject,
        status: ticket.status,
        createdAt: ticket.created_at
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create support ticket.' });
  }
});

/**
 * GET /api/support
 * Customer Support Tickets Listing (IDOR Protected)
 */
export const getMyTickets = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('id, ticket_number, subject, category, priority, status, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formatted = data.map(t => ({
      id: t.id,
      ticketNumber: t.ticket_number,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      createdAt: t.created_at,
      updatedAt: t.updated_at
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * GET /api/support/:ticketId
 * Customer Ticket Details & Thread Messages (IDOR Protected)
 */
export const getTicketDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { ticketId } = req.params;

  try {
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .select('*, support_messages(*, users(full_name))')
      .eq('id', ticketId)
      .single();

    if (error || !ticket || ticket.user_id !== userId) {
      return res.status(404).json({ success: false, message: 'Support ticket not found or access denied.' });
    }

    const messages = (ticket.support_messages || []).map(m => ({
      id: m.id,
      senderType: m.sender_type,
      senderName: m.users?.full_name || (m.sender_type === 'admin' ? 'Support Operator' : 'Customer'),
      message: m.message,
      createdAt: m.created_at
    }));

    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return res.status(200).json({
      success: true,
      data: {
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.created_at,
        messages
      }
    });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'Support ticket not found.' });
  }
});

/**
 * GET /api/admin/support
 * Paginated Admin Support Desk Listing
 */
export const getAdminTickets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, status, priority } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('support_tickets')
      .select('id, ticket_number, subject, category, priority, status, created_at, updated_at, users(full_name, email)', { count: 'exact' });

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
      ticketNumber: t.ticket_number,
      customerName: t.users?.full_name || 'N/A',
      customerEmail: t.users?.email || 'N/A',
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      createdAt: t.created_at,
      updatedAt: t.updated_at
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
 * POST /api/support/:ticketId/messages
 * Send Thread Message in Ticket (Supports customer & admin)
 */
export const addSupportMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { ticketId } = req.params;
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
  }

  const { data: ticket, error: ticketErr } = await supabase
    .from('support_tickets')
    .select('id, user_id, status')
    .eq('id', ticketId)
    .single();

  if (ticketErr || !ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found.' });
  }

  const senderType = req.user.role === 'admin' ? 'admin' : 'customer';

  // Customer IDOR check
  if (senderType === 'customer' && ticket.user_id !== userId) {
    return res.status(404).json({ success: false, message: 'Ticket access denied.' });
  }

  try {
    const { data: newMsg, error: msgErr } = await supabase
      .from('support_messages')
      .insert([
        {
          ticket_id: ticketId,
          sender_id: userId,
          sender_type: senderType,
          message: message.trim()
        }
      ])
      .select()
      .single();

    if (msgErr) throw msgErr;

    // Update ticket status to in_progress if customer replies or waiting_customer if admin replies
    const newStatus = senderType === 'admin' ? 'waiting_customer' : 'in_progress';
    await supabase.from('support_tickets').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', ticketId);

    return res.status(201).json({
      success: true,
      message: 'Support message sent.',
      data: newMsg
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

/**
 * PATCH /api/admin/support/:ticketId/status
 * Admin Support Ticket Status & Priority Update
 */
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { status, priority } = req.body;

  const updates = { updated_at: new Date().toISOString() };
  if (status) updates.status = status;
  if (priority) updates.priority = priority;
  if (status === 'resolved' || status === 'closed') updates.resolved_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Support ticket updated.',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update ticket.' });
  }
});
