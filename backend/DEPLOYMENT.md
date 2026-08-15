# CSC Center Production Deployment Guide (Phase 10)

## Overview
This document outlines the step-by-step production deployment strategy for the CSC Center full-stack application (React frontend + Express Node.js backend + Supabase PostgreSQL & Auth).

---

## 1. System Architecture & Prerequisites
- **Frontend Host**: Vercel / Netlify / AWS CloudFront + S3 (Vite SPA static build).
- **Backend Host**: AWS EC2 / Render / Railway / DigitalOcean Droplet (Node.js LTS >= 18.0.0).
- **Database & Auth**: Supabase PostgreSQL + Supabase Auth.
- **Domain & SSL**: Production domain configured with TLS 1.3 / HTTPS certificates.

---

## 2. Environment Variables Configuration

### Backend Environment Variables (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://csccenter.in

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=your_production_jwt_secret_key

PAYMENT_PROVIDER_KEY_ID=rzp_live_your_live_key_id
PAYMENT_PROVIDER_KEY_SECRET=your_live_payment_secret
PAYMENT_WEBHOOK_SECRET=your_live_webhook_secret

EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
EMAIL_FROM="CSC Center" <support@csccenter.in>
```

### Frontend Environment Variables (`frontend/.env`)
```env
VITE_API_URL=https://api.csccenter.in/api
VITE_PAYMENT_PROVIDER_KEY_ID=rzp_live_your_live_key_id
```

> [!CAUTION]
> NEVER expose `SUPABASE_SERVICE_ROLE_KEY`, `PAYMENT_PROVIDER_KEY_SECRET`, or `EMAIL_PASSWORD` to frontend VITE_ variables!

---

## 3. Database Migration Sequence
Execute SQL migrations in strict numerical order using Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_indexes.sql`
3. `supabase/migrations/003_rls_policies.sql`
4. `supabase/migrations/004_seed_services.sql`
5. `supabase/migrations/005_phase8_payments_notifications.sql`
6. `supabase/migrations/006_phase10_production_hardening.sql`

---

## 4. Webhook & Auth URL Configuration
- **Supabase Auth Redirect URLs**: Configure `https://csccenter.in`, `https://csccenter.in/reset-password`, `https://csccenter.in/login` under Authentication -> URL Configuration.
- **Payment Provider Webhook URL**: Configure `https://api.csccenter.in/api/payments/webhook` in Razorpay Dashboard for `payment.captured` & `order.paid` events.

---

## 5. Rollback Plan
1. **Frontend Rollback**: Revert deployment commit on hosting provider (Vercel/Netlify).
2. **Backend Rollback**: Revert Node process to previous release tag.
3. **Database Schema Safety**: Schema changes are append-only. Never drop production columns or tables without backup.
