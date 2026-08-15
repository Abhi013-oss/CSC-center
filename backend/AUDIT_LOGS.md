# CSC Center Audit Trail & Logging (Phase 13)

## Overview
Immutable audit log recording sensitive operational events, administrative overrides, and staff status transitions.

---

## 1. Audit Log Schema (`admin_audit_logs`)
- `id`: UUID Primary Key
- `user_id`: Operator UUID
- `action`: Event identifier string (e.g. `STAFF_INVITED`, `STATUS_UPDATED`, `BULK_ASSIGNED`)
- `target_resource`: Resource collection name (`users`, `applications`)
- `target_id`: Target record UUID
- `details`: JSONB payload containing metadata (excluding secrets and PII)
- `created_at`: Timestamp

---

## 2. Security Exclusions
- Passwords, JWT secrets, payment API keys, and document file contents are strictly EXCLUDED from audit log payloads.
