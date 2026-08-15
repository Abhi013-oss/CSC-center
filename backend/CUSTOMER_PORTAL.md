# CSC Center Customer Self-Service Portal Architecture (Phase 12)

## Overview
This document specifies the routing structure, security boundaries, next action prompts, and document workflow for the Customer Self-Service Portal (`/account/*`).

---

## 1. Customer Subroutes
- `/account`: Portal Dashboard (`Dashboard.jsx` & `GET /api/account/dashboard`).
- `/account/applications`: Applications listing & search (`Applications.jsx`).
- `/account/applications/:applicationId`: Application details, document checklist, status timeline.
- `/account/documents`: Document manager & replacement uploads (`Documents.jsx`).
- `/account/payments`: Payment receipts & printable invoice modal (`Payments.jsx`).
- `/account/notifications`: Notification inbox (`Notifications.jsx`).
- `/account/support`: Customer support help desk & thread (`CustomerSupport.jsx`).
- `/account/appointments`: In-person assistance appointment booking (`Appointments.jsx`).
- `/account/profile`: Contact details profile edit (`Profile.jsx`).
- `/account/security`: Password change & session management (`Security.jsx`).

---

## 2. Customer Security & Ownership Isolation
- Every `/api/account/*` and `/api/appointments/*` endpoint derives `user_id` strictly from `req.user.id` authenticated via JWT token.
- Zero customer input trusted for user identity (`userId`).
- Internal admin notes, staff tasks, global statistics, and other customers' applications are strictly EXCLUDED from customer responses.
