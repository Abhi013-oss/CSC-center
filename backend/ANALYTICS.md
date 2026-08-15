# CSC Center Analytics & Business Intelligence Architecture (Phase 11)

## Overview
This document defines the mathematical formulas, database query strategies, date filtering rules, and permission boundaries governing the Analytics Engine.

---

## 1. Metric Definitions & Formulas

### Total Revenue
- **Definition**: Sum of all verified payments with `status = 'paid'` within the selected date range.
- **Formula**: `\sum \text{amount} \quad \text{where } \text{status} = \text{'paid'}`.
- **Data Source**: `payments` table. Zero reliance on client-side values.

### Completion Rate
- **Definition**: Percentage of submitted applications that reach status `'completed'`.
- **Formula**: `\frac{\text{Completed Applications}}{\text{Total Applications}} \times 100`.
- **Handling Zero Denominator**: If total applications = 0, returns `0%`.

### Conversion Funnel Stages
1. **Registered Customers**: Count of records in `users` where `role = 'customer'`.
2. **Submitted Applications**: Count of records in `applications`.
3. **Paid Applications**: Count of records in `applications` where `payment_status = 'paid'`.
4. **Completed Applications**: Count of records in `applications` where `status = 'completed'`.

---

## 2. Supported Date Range Filters
- `today`: Calendar day from `00:00:00` to current time.
- `7days`: Previous 7 calendar days.
- `30days`: Previous 30 calendar days (default).
- `90days`: Previous 90 calendar days.
- `this_year`: Start of current year `YYYY-01-01T00:00:00.000Z`.
- `all`: Full database timeline.

---

## 3. Privacy & Security Boundary
- Endpoints (`/api/admin/analytics/*`) require strict `requireAuth` + `requireAdmin` middleware.
- Zero analytics data is exposed to public or customer endpoints.
