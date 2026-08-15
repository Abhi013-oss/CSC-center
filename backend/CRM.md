# CSC Center Customer CRM & Unified Timeline Architecture (Phase 11)

## Overview
This document details the Customer Relationship Management (CRM) layer, internal customer notes, and unified real event timeline construction.

---

## 1. CRM Search & Pagination
- Endpoints: `GET /api/admin/customers`
- Search parameters: Name (`full_name`), Contact Email (`email`), Mobile Number (`mobile`).
- Pagination: Server-side `range(offset, limit)` with `count: 'exact'`.

---

## 2. Unified Customer Timeline Events
The customer profile view (`GET /api/admin/customers/:customerId`) aggregates real events in chronological order:
1. **Account Registration**: Captured from `users.created_at`.
2. **Application Submissions**: Captured from `applications.created_at`.
3. **Support Help Tickets**: Captured from `support_tickets.created_at`.

---

## 3. Internal Customer Notes Security
- Table: `customer_notes` (`id`, `user_id`, `note`, `created_by`, `created_at`).
- Scope: Accessible ONLY by authorized staff and admins via `/api/admin/customers/:customerId/notes`.
- Isolation: Customers can NEVER view internal CRM notes.
