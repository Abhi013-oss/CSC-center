# CSC Center Database & Supabase Configuration Guide

This directory contains the production-ready PostgreSQL relational schema, performance indexes, Row Level Security (RLS) policies, storage bucket configurations, and seed data scripts for the **CSC Center (Digital Service Center)** application.

## Migration Structure

All SQL migrations are organized in [`supabase/migrations/`](file:///c:/Users/Abhinav/OneDrive/Desktop/CSC-Center/supabase/migrations):

1. **`001_initial_schema.sql`**: Defines core tables (`users`, `admin_users`, `services`, `applications`, `application_documents`, `application_status_history`, `payments`, `notices`, `contact_messages`), UUID primary keys, foreign key constraints, CHECK constraints, and automated `updated_at` triggers.
2. **`002_indexes.sql`**: Performance B-Tree indexes for frequent queries on mobile numbers, slugs, categories, application reference IDs, user IDs, and timestamps.
3. **`003_rls_policies.sql`**: Row Level Security (RLS) configuration enabling RLS on all 9 tables, public read policies for active services and published notices, and creating the **private** `application-documents` storage bucket.
4. **`004_seed_services.sql`**: Idempotent `INSERT INTO services ... ON CONFLICT (slug) DO UPDATE ...` populating 25+ services with JSONB document checklists, process steps, notes, and fees.

Alternatively, the single consolidated [`supabase/schema.sql`](file:///c:/Users/Abhinav/OneDrive/Desktop/CSC-Center/supabase/schema.sql) file contains the unified database schema.

---

## How to Apply Migrations in Supabase

### Option A: Via Supabase Dashboard (Recommended)
1. Open your [Supabase Project Dashboard](https://app.supabase.com).
2. Navigate to **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Copy and paste the contents of `001_initial_schema.sql`, `002_indexes.sql`, `003_rls_policies.sql`, and `004_seed_services.sql` in order (or `schema.sql`), and click **Run**.

### Option B: Via Supabase CLI
```bash
supabase db push
```

---

## Database Tables & Schema Overview

| Table Name | Primary Key | Key Foreign Keys & Constraints | Purpose |
|---|---|---|---|
| `users` | UUID | Mobile unique, nullable email partial unique index | Customer & operator accounts |
| `admin_users` | UUID | `user_id` -> `users(id)` | Identifies authorized administrators |
| `services` | UUID | `slug` UNIQUE, category CHECK constraint | Dynamic service catalog & checklists |
| `applications` | UUID | `application_id` UNIQUE, `user_id` -> `users(id)`, `service_id` -> `services(id)` | Citizen service applications |
| `application_documents` | UUID | `application_id` -> `applications(id)` | Metadata for uploaded documents (<5MB, PDF/JPG/PNG) |
| `application_status_history` | UUID | `application_id` -> `applications(id)` | Append-only audit trail for status changes |
| `payments` | UUID | `application_id` -> `applications(id)` | Payment logs (NO card/CVV/PIN credentials stored!) |
| `notices` | UUID | `created_by` -> `users(id)` | Active announcement banners |
| `contact_messages` | UUID | `status` CHECK constraint | Customer contact desk inquiries |

---

## Storage Buckets Security Policy

- **Bucket**: `application-documents`
- **Visibility**: **PRIVATE** (`public = false`)
- **File Limits**: Max 5 MB per file.
- **Allowed MIME Types**: `application/pdf`, `image/jpeg`, `image/jpg`, `image/png`.
- **Security Strategy**: Identity and certificate documents (Aadhaar, PAN, marksheets) are protected from public access and must be accessed via signed URLs or server-side authorized Express API endpoints.

---

## Environment Configuration

Backend Environment Variables required in `backend/.env`:
```env
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> [!CAUTION]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend (`VITE_*`) or commit `.env` files to Git repositories.
