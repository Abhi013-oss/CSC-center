# CSC Center Staff & Operator Management (Phase 13)

## Overview
This document specifies the staff onboarding, invitation lifecycle, workload balancing, and deactivation procedures.

---

## 1. Staff Roster & Roles
- Endpoint: `GET /api/admin/staff`
- Role values: `customer`, `staff`, `admin`.
- Workload metrics: Calculated dynamically for each operator (Active Assigned Applications, Open Tasks).

---

## 2. Secure Staff Invitation Flow
- Invitation Endpoint: `POST /api/admin/staff/invite`
- Generates a cryptographically secure 32-byte token expiring in 48 hours.
- Invitation link: `https://csccenter.in/accept-staff-invite?token=<32_byte_hex>`
- Activation Endpoint: `POST /api/auth/staff/activate`
- Public staff registration is strictly DISABLED.

---

## 3. Last Admin Protection Rule
- Endpoint: `PATCH /api/admin/staff/:staffId/status`
- The system enforces `COUNT(active_admins) > 1` before allowing deactivation or demotion of any admin account.
- Rejects requests attempting to deactivate the last system administrator with HTTP `400 Bad Request`.
