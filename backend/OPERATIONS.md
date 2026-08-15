# CSC Center Operations Manual (Phase 10)

## Overview
This document guides administrators and support operators on managing daily CSC Center operations, application state transitions, failed payment reconciliations, and notification retries.

---

## 1. Initial Admin Account Provisioning
1. Register a user account via `/register` or Supabase Auth console.
2. In Supabase SQL Editor, promote the user to admin role:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@csccenter.in';
```
3. Login via `/login` and access the secure Admin Panel at `/admin`.

---

## 2. Application State Transitions & Audit Rules
Supported Application Statuses:
- `pending`: Application submitted by customer.
- `under_review`: Operator is inspecting details & proof documents.
- `document_required`: Operator requested additional document scans.
- `approved`: Application verified and accepted by operator.
- `completed`: Official document delivered or service completed.
- `rejected`: Application rejected due to invalid proofs or false data.

State Machine Rules:
- Transitions must follow: `pending` -> `under_review` -> `document_required` / `approved` / `rejected` -> `completed`.
- Every transition automatically logs an audit trail in `application_status_history`.

---

## 3. Failed Payment Handling & Reconciliation
- Read-only transaction receipts are available under Admin Payments (`/admin/payments`).
- Revenue analytics are calculated strictly from verified `paid` transactions.
- If a customer experiences signature verification failure, verify the bank transaction in provider dashboard before manually updating payment status.

---

## 4. Email Notification Delivery & Retry
- Notification delivery logs are monitored under `/admin/notifications`.
- If an email delivery status shows `failed`, click "Retry Email" (`POST /api/notifications/admin/:id/retry`) to attempt redelivery up to 5 times.
