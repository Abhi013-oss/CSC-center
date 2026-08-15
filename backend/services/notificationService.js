import { supabase } from '../config/supabase.js';
import { sendEmail } from './emailService.js';
import { getApplicationSubmittedEmail } from '../templates/emails/applicationSubmitted.js';
import { getStatusChangedEmail } from '../templates/emails/statusChanged.js';
import { getPaymentSuccessEmail } from '../templates/emails/paymentSuccess.js';
import { getPaymentFailedEmail } from '../templates/emails/paymentFailed.js';

/**
 * Decoupled Notification Dispatcher
 * Email failures strictly DO NOT roll back database transactions or application updates.
 */

export const createNotificationAndSend = async ({ userId, applicationId, type, recipient, subject, htmlBody }) => {
  if (!recipient) return null;

  try {
    // 1. Log notification record in 'notifications' table (status: 'pending')
    const { data: notifRecord, error: insertErr } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId || null,
          application_id: applicationId || null,
          type,
          channel: 'email',
          recipient,
          subject,
          status: 'pending'
        }
      ])
      .select()
      .single();

    const notifId = notifRecord?.id;

    // 2. Dispatch email via emailService
    try {
      const result = await sendEmail({ to: recipient, subject, html: htmlBody });

      if (notifId) {
        await supabase
          .from('notifications')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            provider_message_id: result.messageId || null
          })
          .eq('id', notifId);
      }
      return { success: true, notifId };
    } catch (sendErr) {
      console.warn(`[notificationService] Email delivery failed for ${recipient}:`, sendErr.message);

      if (notifId) {
        await supabase
          .from('notifications')
          .update({
            status: 'failed',
            error_message: sendErr.message || 'SMTP delivery failed',
            retry_count: 1
          })
          .eq('id', notifId);
      }
      return { success: false, error: sendErr.message };
    }
  } catch (err) {
    console.error('[notificationService] Notification logging error:', err.message);
    return null;
  }
};

/**
 * Convenience Event Notification Handlers
 */
export const notifyApplicationSubmitted = async (appRecord, serviceRecord) => {
  if (!appRecord.email) return;

  const template = getApplicationSubmittedEmail({
    fullName: appRecord.full_name,
    applicationId: appRecord.application_id,
    serviceTitle: serviceRecord?.title || 'Digital Service'
  });

  return createNotificationAndSend({
    userId: appRecord.user_id,
    applicationId: appRecord.id,
    type: 'application_submitted',
    recipient: appRecord.email,
    subject: template.subject,
    htmlBody: template.html
  });
};

export const notifyStatusChanged = async (appRecord, oldStatus, newStatus, note) => {
  if (!appRecord.email) return;

  const typeMap = {
    under_review: 'application_under_review',
    document_required: 'document_required',
    approved: 'application_approved',
    completed: 'application_completed',
    rejected: 'application_rejected'
  };

  const template = getStatusChangedEmail({
    fullName: appRecord.full_name,
    applicationId: appRecord.application_id,
    serviceTitle: appRecord.services?.title || 'Digital Service',
    oldStatus,
    newStatus,
    note
  });

  return createNotificationAndSend({
    userId: appRecord.user_id,
    applicationId: appRecord.id,
    type: typeMap[newStatus] || 'status_changed',
    recipient: appRecord.email,
    subject: template.subject,
    htmlBody: template.html
  });
};

export const notifyPaymentSuccess = async (appRecord, paymentRecord) => {
  if (!appRecord.email) return;

  const template = getPaymentSuccessEmail({
    fullName: appRecord.full_name,
    applicationId: appRecord.application_id,
    serviceTitle: appRecord.services?.title || 'Digital Service',
    transactionId: paymentRecord.transaction_id || paymentRecord.id,
    amount: paymentRecord.amount,
    paidAt: paymentRecord.paid_at || new Date()
  });

  return createNotificationAndSend({
    userId: appRecord.user_id,
    applicationId: appRecord.id,
    type: 'payment_success',
    recipient: appRecord.email,
    subject: template.subject,
    htmlBody: template.html
  });
};

export const notifyPaymentFailed = async (appRecord, amount) => {
  if (!appRecord.email) return;

  const template = getPaymentFailedEmail({
    fullName: appRecord.full_name,
    applicationId: appRecord.application_id,
    serviceTitle: appRecord.services?.title || 'Digital Service',
    amount
  });

  return createNotificationAndSend({
    userId: appRecord.user_id,
    applicationId: appRecord.id,
    type: 'payment_failed',
    recipient: appRecord.email,
    subject: template.subject,
    htmlBody: template.html
  });
};
