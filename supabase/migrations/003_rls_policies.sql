-- ============================================================================
-- CSC CENTER DATABASE MIGRATION 003: ROW LEVEL SECURITY & STORAGE POLICIES
-- Database System: PostgreSQL (Supabase)
-- ============================================================================

-- Enable RLS on all 9 tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. PUBLIC READ POLICIES (Anonymous / Public Visitor Access)
-- ----------------------------------------------------------------------------

-- Public can view active services
CREATE POLICY "Public Read Active Services" ON services
    FOR SELECT
    USING (available = true);

-- Public can view active published notices
CREATE POLICY "Public Read Active Notices" ON notices
    FOR SELECT
    USING (
        is_published = true 
        AND starts_at <= NOW() 
        AND (expires_at IS NULL OR expires_at > NOW())
    );

-- ----------------------------------------------------------------------------
-- 2. SERVER-SIDE SERVICE ROLE POLICIES (Backend API Server Access)
-- Note: Supabase service_role key automatically bypasses RLS in backend Node.js/Express,
-- but explicit policies ensure defense-in-depth when authenticated tokens are evaluated.
-- ----------------------------------------------------------------------------

-- Service role full access to users table
CREATE POLICY "Service Role Full Access Users" ON users
    FOR ALL
    USING (auth.role() = 'service_role');

-- Service role full access to applications table
CREATE POLICY "Service Role Full Access Applications" ON applications
    FOR ALL
    USING (auth.role() = 'service_role');

-- Service role full access to documents metadata table
CREATE POLICY "Service Role Full Access Application Documents" ON application_documents
    FOR ALL
    USING (auth.role() = 'service_role');

-- Service role full access to status history
CREATE POLICY "Service Role Full Access Status History" ON application_status_history
    FOR ALL
    USING (auth.role() = 'service_role');

-- Service role full access to payments
CREATE POLICY "Service Role Full Access Payments" ON payments
    FOR ALL
    USING (auth.role() = 'service_role');

-- Service role full access to contact messages
CREATE POLICY "Service Role Full Access Contact Messages" ON contact_messages
    FOR ALL
    USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- 3. PRIVATE SUPABASE STORAGE BUCKET CONFIGURATION
-- Document security: Bucket MUST be private (public = false)
-- Sensitive identity documents (Aadhaar, PAN, certificates) must NOT be public!
-- ----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'application-documents',
    'application-documents',
    false, -- PRIVATE BUCKET
    5242880, -- 5MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

-- Storage Security Policy: Only server-side service role can manage private bucket objects
CREATE POLICY "Service Role Private Storage Bucket Access" ON storage.objects
    FOR ALL
    USING (bucket_id = 'application-documents' AND auth.role() = 'service_role');
