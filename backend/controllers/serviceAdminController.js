import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/admin/services
 */
export const getAdminServices = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('title', { ascending: true });

    if (error || !data) {
      return res.status(200).json({ success: true, data: [] });
    }

    const formatted = data.map(s => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      shortDescription: s.short_description,
      description: s.description,
      category: s.category,
      iconName: s.icon,
      featured: s.featured,
      available: s.available,
      estimatedTime: s.estimated_time,
      serviceFee: s.service_fee,
      documents: s.documents,
      process: s.process_steps,
      notes: s.notes,
      createdAt: s.created_at,
      updatedAt: s.updated_at
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
});

/**
 * POST /api/admin/services
 */
export const createService = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    category,
    shortDescription,
    description,
    estimatedTime,
    serviceFee,
    documents = [],
    processSteps = [],
    notes,
    featured = false,
    available = true
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Service title is required.' });
  }

  const generatedSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
  const validCategory = category || 'other';

  const { data, error } = await supabase
    .from('services')
    .insert([
      {
        title: title.trim(),
        slug: generatedSlug,
        category: validCategory,
        short_description: shortDescription || null,
        description: description || null,
        estimated_time: estimatedTime || null,
        service_fee: serviceFee ? parseFloat(serviceFee) : null,
        documents: documents || [],
        process_steps: processSteps || [],
        notes: notes || null,
        featured: Boolean(featured),
        available: Boolean(available)
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to create service.' });
  }

  return res.status(201).json({
    success: true,
    message: 'Service catalog item created successfully.',
    data
  });
});

/**
 * PUT /api/admin/services/:id
 */
export const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    category,
    shortDescription,
    description,
    estimatedTime,
    serviceFee,
    documents,
    processSteps,
    notes,
    featured,
    available
  } = req.body;

  const updateFields = { updated_at: new Date().toISOString() };
  if (title) updateFields.title = title.trim();
  if (category) updateFields.category = category;
  if (shortDescription !== undefined) updateFields.short_description = shortDescription;
  if (description !== undefined) updateFields.description = description;
  if (estimatedTime !== undefined) updateFields.estimated_time = estimatedTime;
  if (serviceFee !== undefined) updateFields.service_fee = serviceFee ? parseFloat(serviceFee) : null;
  if (documents !== undefined) updateFields.documents = documents;
  if (processSteps !== undefined) updateFields.process_steps = processSteps;
  if (notes !== undefined) updateFields.notes = notes;
  if (featured !== undefined) updateFields.featured = Boolean(featured);
  if (available !== undefined) updateFields.available = Boolean(available);

  const { data, error } = await supabase
    .from('services')
    .update(updateFields)
    .or(`id.eq.${id},slug.eq.${id}`)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update service.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Service updated successfully.',
    data
  });
});

/**
 * PATCH /api/admin/services/:id/status
 */
export const toggleServiceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { available, featured } = req.body;

  const updateFields = { updated_at: new Date().toISOString() };
  if (available !== undefined) updateFields.available = Boolean(available);
  if (featured !== undefined) updateFields.featured = Boolean(featured);

  const { data, error } = await supabase
    .from('services')
    .update(updateFields)
    .or(`id.eq.${id},slug.eq.${id}`)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ success: false, message: 'Failed to update service status.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Service status updated.',
    data
  });
});
