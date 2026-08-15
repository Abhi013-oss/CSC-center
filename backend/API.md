# CSC Center Production API Reference (Phases 10–13)

## Overview
Complete API specification for the CSC Center Node.js / Express backend.

---

## 1. System & Health Endpoints
- `GET /api`: Public API metadata description.
- `GET /api/health`: System health check (`{ success: true, status: 'healthy' }`).
- `GET /api/ready`: System readiness check (`{ success: true, status: 'ready', database: 'connected' }`).
- `GET /api/site-settings/public`: Public allowlisted business settings.

---

## 2. Staff Management & Invitation Endpoints (`/api/admin/staff/*`)
- `GET /api/admin/staff`: Paginated staff roster search with workload metrics.
- `POST /api/admin/staff/invite`: Create 48-hour single-use staff invitation token (`admin` only).
- `POST /api/auth/staff/activate`: Public endpoint for invited staff to set password and activate account.
- `PATCH /api/admin/staff/:staffId/status`: Toggle staff role/status with Last Admin Protection check.

---

## 3. Workflow Settings & Holidays Endpoints (`/api/admin/workflows/*`)
- `GET /api/admin/workflows`: Get service workflow requirements and SLA targets.
- `GET /api/admin/workflows/email-templates`: Centralized notification email templates list.
- `GET /api/admin/workflows/holidays`: Center holiday calendar entries.
- `POST /api/admin/workflows/holidays`: Create center holiday.

---

## 4. Bulk Operations & Audit Trail Endpoints (`/api/admin/*`)
- `POST /api/admin/applications/bulk-assign`: Bulk application assignment to staff operator.
- `GET /api/admin/audit-logs`: Read immutable system audit log trail.
