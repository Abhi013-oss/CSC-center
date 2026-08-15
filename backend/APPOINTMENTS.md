# CSC Center Appointment System Architecture (Phase 11 & 12)

## Overview
This document outlines the time slot availability engine, double-booking prevention, and appointment lifecycle management.

---

## 1. Time Slot Engine & Availability
- Endpoints: `GET /api/appointments/slots?date=YYYY-MM-DD`
- Default operating slots: 10:00 AM, 11:00 AM, 12:00 PM, 02:00 PM, 03:00 PM, 04:00 PM.
- Availability check verifies existing active bookings (`status` in `['scheduled', 'confirmed']`).

---

## 2. Double-Booking Concurrency Protection
- Booking Endpoint: `POST /api/account/appointments`
- Atomic SQL check executes before insertion:
```sql
SELECT id FROM appointments WHERE date = $1 AND start_time = $2 AND status IN ('scheduled', 'confirmed');
```
- If a slot is already taken, returns `409 Conflict`: `"Selected appointment slot is no longer available."`

---

## 3. Appointment Lifecycle States
- `scheduled`: Booked by customer.
- `confirmed`: Verified by center admin operator.
- `completed`: Customer visited center and received assistance.
- `cancelled`: Cancelled by customer or admin.
- `no_show`: Customer did not attend appointment.
