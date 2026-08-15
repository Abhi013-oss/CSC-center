# CSC Center Role-Based Access Control (RBAC) Architecture (Phase 13)

## Overview
Centralized permission enforcement layer preventing hardcoded checks and securing API endpoints across customer, staff, and admin tiers.

---

## 1. Roles & Permissions Matrix

| Permission Key | Customer | Staff Operator | Admin |
|---|---|---|---|
| `applications.read` | Own | Assigned/All | All |
| `applications.update` | No | Yes | Yes |
| `applications.assign` | No | Yes | Yes |
| `documents.read` | Own | Yes | Yes |
| `documents.review` | No | Yes | Yes |
| `customers.read` | No | Yes | Yes |
| `support.read` | Own | Yes | Yes |
| `support.manage` | No | Yes | Yes |
| `tasks.read` | No | Yes | Yes |
| `tasks.manage` | No | Yes | Yes |
| `appointments.read` | Own | Yes | Yes |
| `appointments.manage` | Own (Book/Cancel) | Yes | Yes |
| `reports.read` | No | Yes | Yes |
| `staff.manage` | No | No | Yes |
| `settings.manage` | No | No | Yes |

---

## 2. Middleware Implementation
```js
import { requirePermission } from '../middleware/permissionMiddleware.js';

router.get('/staff', requireAuth, requirePermission('staff.read'), getStaffRoster);
router.post('/staff/invite', requireAuth, requireAdmin, createStaffInvitation);
```
