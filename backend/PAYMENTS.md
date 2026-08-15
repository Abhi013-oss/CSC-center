# CSC Center Payment Integration Documentation (Phase 8)

## Overview
Phase 8 implements a production-ready, server-controlled payment layer with Razorpay provider abstraction, HMAC-SHA256 signature verification, and webhook handling.

---

## Environment Configuration
Configure backend environment variables in `backend/.env`:
```env
PAYMENT_PROVIDER_KEY_ID=rzp_test_your_key_id
PAYMENT_PROVIDER_KEY_SECRET=your_key_secret
PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

Expose only the public key to frontend (`frontend/.env`):
```env
VITE_PAYMENT_PROVIDER_KEY_ID=rzp_test_your_key_id
```

---

## Payment Flow & Architecture

1. **Order Creation (`POST /api/payments/order`)**:
   - Accepts `{ applicationId }`.
   - Verifies application ownership (`applications.user_id = req.user.id`).
   - Calculates fee server-side from `services.service_fee`.
   - Creates order in smallest currency unit (paise) and returns order ID & public key ID.

2. **Customer Checkout (`frontend/src/pages/Payment.jsx`)**:
   - Launches Razorpay Checkout SDK with order ID and public key.
   - User completes payment in gateway modal.

3. **Backend Signature Verification (`POST /api/payments/verify`)**:
   - Accepts `{ applicationId, providerOrderId, providerPaymentId, providerSignature }`.
   - Calculates HMAC-SHA256(`orderId + "|" + paymentId`, `secret`).
   - Synchronizes database state: `payments.status = 'paid'` & `applications.payment_status = 'paid'`.
   - Triggers `payment_success` email notification.

4. **Webhook Handling (`POST /api/payments/webhook`)**:
   - Unauthenticated webhook listener with HMAC-SHA256 raw body signature verification.
   - Idempotency guard backed by `payment_webhook_events` (`provider` + `event_id`).
