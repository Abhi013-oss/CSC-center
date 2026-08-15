# CSC Center Automation & Operator Work Queue Architecture (Phase 11)

## Overview
This document describes the operational automation rules, idempotency controls, and work queue aggregation logic.

---

## 1. Prioritized Daily Work Queue
- Endpoint: `GET /api/admin/tasks/work-queue`
- Aggregates 3 operational streams:
  1. **Pending Applications**: Applications with status `pending`, `under_review`, or `document_required`.
  2. **Urgent Support Tickets**: Open help desk tickets sorted by priority and age.
  3. **Staff Tasks**: Internal follow-up tasks sorted by due date.

---

## 2. Automation Logging & Safety
- Table: `automation_logs` (`id`, `event_type`, `entity_type`, `entity_id`, `action`, `status`, `error_message`, `created_at`).
- Safety Rules:
  - Automations execute asynchronously without blocking main customer transactions.
  - Failures recorded cleanly with status `'failed'`.
