-- ============================================================================
-- CSC CENTER DATABASE MIGRATION 005: PHASE 8 PAYMENTS & NOTIFICATIONS
-- Database System: PostgreSQL (Supabase)
-- ============================================================================

-- 1. PAYMENT WEBHOOK EVENTS TABLE (Idempotency Guard)
CREATE TABLE IF NOT EXISTS payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'razorpay',
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT true,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT payment_webhook_events_provider_event_id_unique UNIQUE (provider, event_id)
);

-- 2. NOTIFICATIONS TABLE (Decoupled Email & Messaging Audit Log)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    application_id UUID NULL REFERENCES applications(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN (
        'application_submitted',
        'application_under_review',
        'document_required',
        'application_approved',
        'application_rejected',
        'application_completed',
        'payment_success',
        'payment_failed'
    )),
    channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'whatsapp')),
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    provider_message_id TEXT NULL,
    error_message TEXT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_application_id ON notifications (application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications (status);
