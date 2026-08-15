# CSC Center Database Schema Documentation (Phases 10–13)

## Overview
PostgreSQL relational database schema managed via Supabase SQL Migrations (001 through 009).

---

## 1. Schema Tables (Phase 13 Additions)

### `staff_invitations`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `token` VARCHAR(255) UNIQUE NOT NULL
- `email` VARCHAR(255) NOT NULL
- `full_name` VARCHAR(255) NOT NULL
- `role` VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('admin', 'staff'))
- `invited_by` UUID REFERENCES users(id) ON DELETE SET NULL
- `status` VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled'))
- `expires_at` TIMESTAMPTZ NOT NULL
- `created_at` TIMESTAMPTZ DEFAULT NOW()

### `staff_service_access`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `staff_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `service_id` UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE
- `created_at` TIMESTAMPTZ DEFAULT NOW()
- UNIQUE(`staff_id`, `service_id`)

### `application_assignment_history`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `application_id` UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE
- `assigned_to` UUID REFERENCES users(id) ON DELETE SET NULL
- `assigned_by` UUID REFERENCES users(id) ON DELETE SET NULL
- `reason` TEXT
- `created_at` TIMESTAMPTZ DEFAULT NOW()

### `center_holidays`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `date` DATE UNIQUE NOT NULL
- `name` VARCHAR(255) NOT NULL
- `active` BOOLEAN DEFAULT true
- `created_by` UUID REFERENCES users(id)
- `created_at` TIMESTAMPTZ DEFAULT NOW()

### `email_templates`
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `template_key` VARCHAR(100) UNIQUE NOT NULL
- `subject` VARCHAR(255) NOT NULL
- `body_html` TEXT NOT NULL
- `updated_at` TIMESTAMPTZ DEFAULT NOW()
