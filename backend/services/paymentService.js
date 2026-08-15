import crypto from 'crypto';

/**
 * Payment Service Abstraction (Razorpay Provider Integration)
 * Server-side order creation & HMAC-SHA256 signature verification.
 */

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.PAYMENT_PROVIDER_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_PROVIDER_KEY_SECRET || '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET || 'csc_center_webhook_secret';

export const paymentService = {
  /**
   * Get public payment key ID for frontend Razorpay Checkout SDK
   */
  getPublicKey() {
    return RAZORPAY_KEY_ID || 'rzp_test_public_csc_center';
  },

  /**
   * Server-calculated Payment Order Creation
   * Converts service fee to smallest currency unit (INR Paise = Fee * 100)
   */
  async createOrder(application, service) {
    if (!service || service.service_fee === null || service.service_fee === undefined) {
      throw new Error('Payment is not configured for this service catalog item.');
    }

    const feeNumber = parseFloat(service.service_fee);
    if (isNaN(feeNumber) || feeNumber <= 0) {
      throw new Error('This service has zero fee or does not require online payment.');
    }

    // Amount in smallest unit (paise for INR)
    const amountInPaise = Math.round(feeNumber * 100);
    const currency = 'INR';
    const receipt = application.application_id;

    // Real Razorpay API call if credentials present in environment
    if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency,
            receipt,
            notes: {
              applicationId: application.application_id,
              serviceTitle: service.title
            }
          })
        });

        const data = await response.json();
        if (data && data.id) {
          return {
            orderId: data.id,
            amount: amountInPaise,
            currency: data.currency || 'INR',
            keyId: RAZORPAY_KEY_ID
          };
        }
      } catch (err) {
        console.warn('[paymentService] Razorpay API order creation warning:', err.message);
      }
    }

    // Secure Test-Mode Order Generation (Requirement 64 & 107)
    const mockOrderId = `order_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    return {
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID || 'rzp_test_public_csc_center'
    };
  },

  /**
   * Server-Side Payment Signature Verification
   * HMAC-SHA256(orderId + "|" + paymentId, keySecret)
   */
  verifyPaymentSignature({ providerOrderId, providerPaymentId, providerSignature }) {
    if (!providerOrderId || !providerPaymentId) return false;

    // Allow test-mode signature in dev if secret not configured
    if (!RAZORPAY_KEY_SECRET) {
      return true;
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${providerOrderId}|${providerPaymentId}`)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'utf-8'),
        Buffer.from(providerSignature || '', 'utf-8')
      );
    } catch (err) {
      console.error('[paymentService] Signature verification error:', err.message);
      return false;
    }
  },

  /**
   * Webhook Signature Verification
   */
  verifyWebhookSignature(rawBody, signature) {
    if (!rawBody || !signature) return false;
    if (!RAZORPAY_KEY_SECRET && !WEBHOOK_SECRET) return true;

    try {
      const secret = WEBHOOK_SECRET || RAZORPAY_KEY_SECRET;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(signature, 'utf-8')
      );
    } catch (err) {
      return false;
    }
  }
};
