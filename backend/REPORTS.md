# CSC Center Exportable Reports Architecture (Phase 11)

## Overview
This document specifies the server-side CSV report generation, field allowlists, date boundaries, and download security.

---

## 1. Supported CSV Export Types
1. **Applications Report** (`GET /api/admin/reports/applications/export`): Includes Application Ref ID, Applicant Name, Mobile, Email, Service Title, Status, Payment Status, Submission Date.
2. **Payments Report** (`GET /api/admin/reports/payments/export`): Includes Transaction ID, Application Ref ID, Applicant Name, Service Title, Amount, Currency, Paid Date.
3. **Customers Report** (`GET /api/admin/reports/customers`): Includes Customer Name, Contact Email, Mobile, Total Applications, Registered Date.

---

## 2. CSV Safety & Field Sanitization
- Values wrapped in quotes with double-quote escaping (`"..."`).
- Passwords, access tokens, auth hashes, and payment secrets are strictly EXCLUDED from report exports.
