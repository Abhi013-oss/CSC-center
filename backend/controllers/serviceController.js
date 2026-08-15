import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

// Fallback services catalog data if database server is in placeholder mode during local dev
import { servicesData as fallbackServices } from '../../frontend/src/data/servicesData.js';

/**
 * GET /api/services
 * Query Params: category, search, featured, available, page, limit
 */
export const getServices = asyncHandler(async (req, res) => {
  const { category, search, featured, available, page = 1, limit = 50 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  // Query Supabase PostgreSQL database
  try {
    let query = supabase.from('services').select('*', { count: 'exact' });

    if (category && category !== 'All Services' && category !== 'all') {
      query = query.eq('category', category);
    }

    if (featured !== undefined) {
      query = query.eq('featured', featured === 'true');
    }

    if (available !== undefined) {
      query = query.eq('available', available === 'true');
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    // Deterministic ordering: featured services first, then by title
    query = query.order('featured', { ascending: false }).order('title', { ascending: true });
    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error || !data || data.length === 0) {
      // If DB query returns empty or fallback is needed, filter fallback catalog gracefully
      let filtered = [...fallbackServices];

      if (category && category !== 'All Services' && category !== 'all') {
        filtered = filtered.filter(s => s.category.toLowerCase() === category.toLowerCase() || s.category === category);
      }
      if (featured === 'true') {
        filtered = filtered.filter(s => s.featured);
      }
      if (available === 'true') {
        filtered = filtered.filter(s => s.available);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.shortDescription && s.shortDescription.toLowerCase().includes(q))
        );
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered
      });
    }

    // Map database snake_case fields to camelCase for frontend consistency
    const formattedData = data.map(s => ({
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
      serviceFee: s.service_fee ? `₹${s.service_fee}` : 'Service fee: Contact center',
      documents: s.documents,
      process: s.process_steps,
      notes: s.notes
    }));

    return res.status(200).json({
      success: true,
      count: count || formattedData.length,
      page: pageNum,
      limit: limitNum,
      data: formattedData
    });
  } catch (err) {
    console.error('[serviceController] Error fetching services:', err.message);
    // Fallback to static catalog on connection failure
    return res.status(200).json({
      success: true,
      count: fallbackServices.length,
      data: fallbackServices
    });
  }
});

/**
 * GET /api/services/:slug
 */
export const getServiceBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (error || !data) {
      // Check fallback data
      const fallback = fallbackServices.find(s => s.slug === slug || s.id === slug);
      if (fallback) {
        return res.status(200).json({
          success: true,
          data: fallback
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Requested service catalog item not found.'
      });
    }

    const formattedService = {
      id: data.id,
      slug: data.slug,
      title: data.title,
      shortDescription: data.short_description,
      description: data.description,
      category: data.category,
      iconName: data.icon,
      featured: data.featured,
      available: data.available,
      estimatedTime: data.estimated_time,
      serviceFee: data.service_fee ? `₹${data.service_fee}` : 'Service fee: Contact center',
      documents: data.documents,
      process: data.process_steps,
      notes: data.notes
    };

    return res.status(200).json({
      success: true,
      data: formattedService
    });
  } catch (err) {
    const fallback = fallbackServices.find(s => s.slug === slug || s.id === slug);
    if (fallback) {
      return res.status(200).json({
        success: true,
        data: fallback
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Requested service catalog item not found.'
    });
  }
});
