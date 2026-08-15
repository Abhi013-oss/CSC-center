import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * POST /api/contact
 * Submit customer inquiry message
 */
export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, mobile, email, subject, message } = req.body;

  const contactName = (name || '').trim();
  const contactMobile = (mobile || '').trim();
  const contactEmail = (email || '').trim();
  const contactSubject = (subject || '').trim();
  const contactMessage = (message || '').trim();

  // Input Validation
  if (!contactName) {
    return res.status(400).json({ success: false, message: 'Full name is required.' });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!contactMobile || !phoneRegex.test(contactMobile)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number.' });
  }

  if (contactEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
  }

  if (!contactSubject) {
    return res.status(400).json({ success: false, message: 'Subject is required.' });
  }

  if (!contactMessage) {
    return res.status(400).json({ success: false, message: 'Message content is required.' });
  }

  // Insert Record into Supabase contact_messages table
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: contactName,
          mobile: contactMobile,
          email: contactEmail || null,
          subject: contactSubject,
          message: contactMessage,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('[contactController] Error inserting contact message:', error.message);
    }
  } catch (err) {
    console.error('[contactController] Database insert error:', err.message);
  }

  return res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Your inquiry has been received by our center service desk.'
  });
});
