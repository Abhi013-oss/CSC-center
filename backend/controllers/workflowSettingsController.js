import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/workflows
 * Service Workflow Configurations Summary
 */
export const getWorkflowSettings = asyncHandler(async (req, res) => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('id, title, category, service_fee, available');

    if (error || !services) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formatted = services.map(s => ({
      id: s.id,
      title: s.title,
      category: s.category,
      serviceFee: s.service_fee,
      requiresPayment: parseFloat(s.service_fee || 0) > 0,
      requiresDocuments: true,
      requiresAppointment: false,
      available: s.available
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load workflow settings.' });
  }
});

/**
 * GET /api/admin/settings/email-templates
 * Centralized Email Templates List
 */
export const getEmailTemplates = asyncHandler(async (req, res) => {
  try {
    const defaultTemplates = [
      {
        templateKey: 'application_submitted',
        subject: 'Application Received - CSC Center',
        bodyHtml: '<p>Dear {{customer_name}},</p><p>Your application {{application_id}} for {{service_name}} has been received.</p>'
      },
      {
        templateKey: 'application_status_changed',
        subject: 'Application Status Update - CSC Center',
        bodyHtml: '<p>Dear {{customer_name}},</p><p>Status for application {{application_id}} updated to {{status}}.</p>'
      },
      {
        templateKey: 'appointment_confirmed',
        subject: 'Appointment Confirmed - CSC Center',
        bodyHtml: '<p>Dear {{customer_name}},</p><p>Your appointment on {{appointment_date}} at {{appointment_time}} is confirmed.</p>'
      }
    ];

    const { data } = await supabase.from('email_templates').select('*');

    const result = defaultTemplates.map(def => {
      const dbMatch = (data || []).find(d => d.template_key === def.templateKey);
      return dbMatch ? {
        id: dbMatch.id,
        templateKey: dbMatch.template_key,
        subject: dbMatch.subject,
        bodyHtml: dbMatch.body_html
      } : def;
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to load email templates.' });
  }
});

/**
 * GET /api/admin/settings/holidays
 * Center Holiday Calendar Management
 */
export const getCenterHolidays = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('center_holidays')
      .select('*')
      .order('date', { ascending: true });

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * POST /api/admin/settings/holidays
 * Add Center Holiday
 */
export const createCenterHoliday = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { date, name } = req.body;

  if (!date || !name) {
    return res.status(400).json({ success: false, message: 'Date and holiday name are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('center_holidays')
      .insert([
        {
          date,
          name: name.trim(),
          active: true,
          created_by: adminId
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: 'Holiday for this date already exists.' });
      }
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Center holiday added.',
      data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add holiday.' });
  }
});
