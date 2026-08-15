# CSC Center Application Security Architecture (Phase 10)

## Overview
This document details security architecture, identity management, row-level security (RLS), private document storage, payment verification, and incident response procedures.

---

## 1. Identity & Authorization Boundary
- **Authentication**: Supabase Auth (JWT tokens). User identity and hashed passwords managed securely by Supabase.
- **Authorization Boundary**: Node.js/Express backend acts as the strict authorization boundary (`requireAuth` & `requireAdmin` middleware).
- **IDOR Protection**: All customer endpoints (`/api/my-applications`, `/api/payments/my-payments`, document URLs) verify `applications.user_id = req.user.id`.

---

## 2. Document Storage & Private Buckets
- Storage Bucket: `application-documents` (PRIVATE bucket).
- No permanent public URLs allowed.
- Access granted exclusively through short-lived signed URLs (120-second expiration) after backend authorization checks.

---

## 3. Payment Gateway Security
- Zero storage of card numbers, CVVs, UPI PINs, or banking passwords.
- Server-calculated order amounts from trusted `services.service_fee`.
- Server-side HMAC-SHA256 signature verification (`crypto.createHmac('sha256', secret)`).
- Webhook signature verification and idempotency guard via `payment_webhook_events`.

---

## 4. Rate Limiting & Brute-Force Protection
- Global Rate Limiter: 200 requests / 15 mins.
- Auth Limiter (`/api/auth/*`): 15 attempts / 15 mins for brute-force protection.
- Contact Limiter (`/api/contact`): 10 requests / 15 mins.
- Payment Limiter (`/api/payments/*`): 20 requests / 15 mins.

---

## 5. Secret Rotation Procedure
If a key is compromised:
1. Generate new credentials in Supabase / Payment Provider / SMTP console.
2. Update backend environment variables in deployment environment.
3. Restart Node server.
4. Verify system readiness (`GET /api/ready`).
