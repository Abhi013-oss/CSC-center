# CSC Center Notification System Documentation (Phase 8)

## Overview
Phase 8 establishes a decoupled email notification system using Nodemailer and branded HTML email templates.

---

## Environment Configuration
Configure SMTP credentials in `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="CSC Center" <support@csccenter.in>
```

---

## Notification Audit Log & Database Decoupling
- Notification logs are stored in `notifications` (`user_id`, `application_id`, `type`, `channel`, `recipient`, `subject`, `status`, `provider_message_id`, `error_message`, `retry_count`).
- **Decoupled Architecture**: Email delivery failures NEVER roll back or abort application database updates or payment transactions.

---

## Supported Notification Types
- `application_submitted`: Triggers on application creation.
- `application_under_review`, `document_required`, `application_approved`, `application_rejected`, `application_completed`: Triggers on admin status updates.
- `payment_success`: Triggers on verified payment receipt.
- `payment_failed`: Triggers on payment verification failure.

---

## Admin Monitoring & Retry APIs
- `GET /api/notifications/admin`: Paginated notification audit logs.
- `POST /api/notifications/admin/:id/retry`: Re-attempts delivery of failed notification logs up to 5 attempts.
