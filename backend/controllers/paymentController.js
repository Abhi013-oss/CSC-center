import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { paymentService } from '../services/paymentService.js';
import { notifyPaymentSuccess, notifyPaymentFailed } from '../services/notificationService.js';

/**
 * POST /api/payments/order
 * Create a Payment Order for an Application
 * Server-calculated fee derivation from trusted database record.
 */
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId } = req.body;

  if (!applicationId) {
    return res.status(400).json({ success: false, message: 'Application reference ID is required.' });
  }

  const formattedAppId = (applicationId || '').trim().toUpperCase();

  // 1. Fetch application and related service fee from database
  const { data: appRecord, error: appErr } = await supabase
    .from('applications')
    .select('id, application_id, user_id, status, payment_status, full_name, email, services(id, title, service_fee)')
    .eq('application_id', formattedAppId)
    .single();

  if (appErr || !appRecord) {
    return res.status(404).json({ success: false, message: `Application "${formattedAppId}" not found.` });
  }

  // 2. IDOR Ownership Check (Requirement 30 & 80)
  if (appRecord.user_id && appRecord.user_id !== userId) {
    return res.status(404).json({ success: false, message: `Application "${formattedAppId}" not found.` });
  }

  // 3. Verify Payment Status Eligibility
  if (appRecord.payment_status === 'paid') {
    return res.status(409).json({ success: false, message: 'Payment for this application has already been completed.' });
  }

  const service = appRecord.services;
  if (!service || service.service_fee === null || service.service_fee === undefined) {
    return res.status(400).json({ success: false, message: 'Online payment is not configured for this service.' });
  }

  const feeAmount = parseFloat(service.service_fee);
  if (isNaN(feeAmount) || feeAmount <= 0) {
    return res.status(400).json({ success: false, message: 'This service item has no payable center fee.' });
  }

  try {
    // 4. Generate Order via paymentService
    const orderData = await paymentService.createOrder(appRecord, service);

    // 5. Store / Reuse Pending Payment Record in Supabase
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('application_id', appRecord.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (!existingPayment) {
      await supabase.from('payments').insert([
        {
          application_id: appRecord.id,
          amount: feeAmount,
          currency: 'INR',
          status: 'pending',
          transaction_id: orderData.orderId,
          gateway_response: { provider_order_id: orderData.orderId }
        }
      ]);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment order created successfully.',
      data: {
        orderId: orderData.orderId,
        amount: orderData.amount, // Amount in paise for Razorpay Checkout SDK
        displayAmount: feeAmount,
        currency: 'INR',
        keyId: paymentService.getPublicKey(),
        applicationId: formattedAppId,
        serviceTitle: service.title
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to create payment order.' });
  }
});

/**
 * POST /api/payments/verify
 * Server-Side HMAC-SHA256 Payment Verification & Database State Sync
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { applicationId, providerOrderId, providerPaymentId, providerSignature } = req.body;

  if (!applicationId || !providerOrderId || !providerPaymentId) {
    return res.status(400).json({ success: false, message: 'Missing required payment verification payload.' });
  }

  const formattedAppId = (applicationId || '').trim().toUpperCase();

  // 1. Fetch application record
  const { data: appRecord, error: appErr } = await supabase
    .from('applications')
    .select('*, services(title)')
    .eq('application_id', formattedAppId)
    .single();

  if (appErr || !appRecord || (appRecord.user_id && appRecord.user_id !== userId)) {
    return res.status(404).json({ success: false, message: 'Application record not found or access denied.' });
  }

  // 2. Perform Backend Signature Verification
  const isValid = paymentService.verifyPaymentSignature({
    providerOrderId,
    providerPaymentId,
    providerSignature
  });

  if (!isValid) {
    // Log payment failure
    await supabase
      .from('payments')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('application_id', appRecord.id);

    notifyPaymentFailed(appRecord, appRecord.services?.service_fee || 0).catch(() => {});

    return res.status(400).json({
      success: false,
      message: 'Payment signature verification failed. Transaction was not confirmed.'
    });
  }

  try {
    // 3. Mark Payment & Application as PAID in a synchronized database update (Requirement 23)
    const paidTimestamp = new Date().toISOString();

    const { data: updatedPayment, error: payErr } = await supabase
      .from('payments')
      .update({
        status: 'paid',
        transaction_id: providerPaymentId,
        paid_at: paidTimestamp,
        gateway_response: {
          provider_order_id: providerOrderId,
          provider_payment_id: providerPaymentId,
          verified_at: paidTimestamp
        },
        updated_at: paidTimestamp
      })
      .eq('application_id', appRecord.id)
      .select()
      .single();

    await supabase
      .from('applications')
      .update({ payment_status: 'paid', updated_at: paidTimestamp })
      .eq('id', appRecord.id);

    // 4. Trigger Payment Success Email Notification Asynchronously
    notifyPaymentSuccess(appRecord, updatedPayment || { transaction_id: providerPaymentId, amount: appRecord.services?.service_fee, paid_at: paidTimestamp }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      data: {
        paymentId: updatedPayment?.id || providerPaymentId,
        transactionId: providerPaymentId,
        applicationId: formattedAppId,
        status: 'paid',
        paidAt: paidTimestamp
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Database state synchronization failed.' });
  }
});

/**
 * POST /api/payments/webhook
 * Isolated Provider Webhook Handler with Signature Verification & Idempotency Guard
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'] || req.headers['x-webhook-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  // 1. Verify Webhook Signature
  if (!paymentService.verifyWebhookSignature(rawBody, signature)) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
  }

  const payload = req.body || {};
  const eventType = payload.event || 'payment.captured';
  const eventId = payload.event_id || payload.id || crypto.randomUUID();

  try {
    // 2. Idempotency Check against payment_webhook_events
    const { data: existingEvent } = await supabase
      .from('payment_webhook_events')
      .select('id')
      .eq('provider', 'razorpay')
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingEvent) {
      return res.status(200).json({ success: true, message: 'Webhook event already processed.' });
    }

    // 3. Process Payment Event
    const paymentObj = payload.payload?.payment?.entity || {};
    const orderId = paymentObj.order_id;
    const paymentId = paymentObj.id;

    if (orderId && paymentId) {
      const { data: paymentRecord } = await supabase
        .from('payments')
        .select('*, applications(*)')
        .eq('transaction_id', orderId)
        .single();

      if (paymentRecord) {
        const paidAt = new Date().toISOString();
        await supabase
          .from('payments')
          .update({ status: 'paid', paid_at: paidAt, transaction_id: paymentId, updated_at: paidAt })
          .eq('id', paymentRecord.id);

        if (paymentRecord.applications) {
          await supabase
            .from('applications')
            .update({ payment_status: 'paid', updated_at: paidAt })
            .eq('id', paymentRecord.applications.id);

          notifyPaymentSuccess(paymentRecord.applications, { transaction_id: paymentId, amount: paymentRecord.amount, paid_at: paidAt }).catch(() => {});
        }
      }
    }

    // 4. Log Processed Webhook Event
    await supabase.from('payment_webhook_events').insert([
      {
        provider: 'razorpay',
        event_id: eventId,
        event_type: eventType,
        processed: true
      }
    ]);

    return res.status(200).json({ success: true, message: 'Webhook processed successfully.' });
  } catch (err) {
    return res.status(200).json({ success: true, message: 'Webhook event logged.' });
  }
});

/**
 * GET /api/my-payments
 * Customer Payment History List (IDOR Protected)
 */
export const getMyPayments = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  try {
    const { data, error, count } = await supabase
      .from('payments')
      .select('id, amount, currency, payment_method, transaction_id, status, paid_at, created_at, applications!inner(user_id, application_id, services(title))', { count: 'exact' })
      .eq('applications.user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error || !data) {
      return res.status(200).json({ success: true, count: 0, page: pageNum, limit: limitNum, totalPages: 0, data: [] });
    }

    const totalCount = count || data.length;
    const totalPages = Math.ceil(totalCount / limitNum);

    const formatted = data.map(p => ({
      id: p.id,
      applicationId: p.applications?.application_id || 'N/A',
      serviceTitle: p.applications?.services?.title || 'Digital Service',
      amount: p.amount,
      currency: p.currency || 'INR',
      paymentMethod: p.payment_method || 'Online',
      transactionId: p.transaction_id || 'N/A',
      status: p.status,
      paidAt: p.paid_at,
      createdAt: p.created_at
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
 * GET /api/my-payments/:paymentId
 * Customer Receipt View (IDOR Protected)
 */
export const getMyPaymentDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { paymentId } = req.params;

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*, applications!inner(user_id, application_id, full_name, email, mobile, services(title))')
      .eq('id', paymentId)
      .single();

    if (error || !data || (data.applications?.user_id && data.applications.user_id !== userId)) {
      return res.status(404).json({ success: false, message: 'Receipt not found or access denied.' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: data.id,
        transactionId: data.transaction_id || 'N/A',
        applicationId: data.applications?.application_id,
        applicantName: data.applications?.full_name,
        serviceTitle: data.applications?.services?.title || 'Digital Service',
        amount: data.amount,
        currency: data.currency || 'INR',
        paymentMethod: data.payment_method || 'Online Payment',
        status: data.status,
        paidAt: data.paid_at,
        createdAt: data.created_at
      }
    });
  } catch (err) {
    return res.status(404).json({ success: false, message: 'Receipt not found.' });
  }
});

/**
 * GET /api/admin/payments/stats
 * Admin Real Revenue Analytics (Calculated strictly from verified paid transactions)
 */
export const getAdminPaymentStats = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, status');

    if (error || !data) {
      return res.status(200).json({
        success: true,
        data: { totalRevenue: 0, paidTransactions: 0, pendingTransactions: 0 }
      });
    }

    let totalRevenue = 0;
    let paidTransactions = 0;
    let pendingTransactions = 0;

    data.forEach(p => {
      if (p.status === 'paid') {
        paidTransactions++;
        totalRevenue += parseFloat(p.amount || 0);
      } else if (p.status === 'pending') {
        pendingTransactions++;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        paidTransactions,
        pendingTransactions
      }
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      data: { totalRevenue: 0, paidTransactions: 0, pendingTransactions: 0 }
    });
  }
});
