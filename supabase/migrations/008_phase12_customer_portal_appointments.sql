-- CSC Center Phase 12: Customer Portal, Document Workflow & Appointments Migration

-- 1. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ
);

-- 2. Appointment Availability Slots Table
CREATE TABLE IF NOT EXISTS appointment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT true
);

-- 3. Customer Saved Services Table
CREATE TABLE IF NOT EXISTS saved_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, service_id)
);

-- 4. Application Document Versions Table
CREATE TABLE IF NOT EXISTS application_document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES application_documents(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    storage_path TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'under_review' CHECK (status IN ('required', 'uploaded', 'under_review', 'approved', 'rejected', 'replacement_required')),
    rejection_reason TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Performance Composite Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date, status);
CREATE INDEX IF NOT EXISTS idx_saved_services_user_id ON saved_services(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_versions_doc_id ON application_document_versions(document_id);
