# CSC Center Support Help Desk Architecture (Phase 11)

## Overview
This document specifies customer help ticket creation, server ticket ID generation, threaded messaging, and status transitions.

---

## 1. Ticket Number Generation
- Ticket numbers are generated server-side in `supportController.js`: `SUP-YYYY-HEXHEX`.
- Guarantees format consistency and unique indexing.

---

## 2. Customer vs Admin Support Boundaries
- **Customer Endpoints**:
  - `POST /api/support`: Create ticket.
  - `GET /api/support/my-tickets`: List owned tickets (`user_id = req.user.id`).
  - `GET /api/support/my-tickets/:ticketId`: Read thread details with IDOR verification.
  - `POST /api/support/:ticketId/messages`: Send thread reply. Automatically shifts status to `in_progress`.
- **Admin Support Desk**:
  - `GET /api/support/admin`: Filter by `status` (`open`, `in_progress`, `waiting_customer`, `resolved`) and `priority` (`urgent`, `high`, `normal`, `low`).
  - `PATCH /api/support/admin/:ticketId/status`: Update ticket status or priority.
