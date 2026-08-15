-- ============================================================================
-- CSC CENTER DATABASE MIGRATION 002: PERFORMANCE INDEXES
-- Database System: PostgreSQL (Supabase)
-- ============================================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Services table indexes
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_available ON services(available);

-- Applications table indexes
CREATE INDEX IF NOT EXISTS idx_applications_application_id ON applications(application_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_service_id ON applications(service_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- Application Documents indexes
CREATE INDEX IF NOT EXISTS idx_app_documents_application_id ON application_documents(application_id);

-- Application Status History audit trail index
CREATE INDEX IF NOT EXISTS idx_status_history_application_id ON application_status_history(application_id);

-- Payments table indexes
CREATE INDEX IF NOT EXISTS idx_payments_application_id ON payments(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

-- Notices table active notice composite index
CREATE INDEX IF NOT EXISTS idx_notices_active ON notices(is_published, starts_at, expires_at);

-- Contact Messages status index
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
