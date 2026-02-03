-- Track which builder accepted a general inquiry lead
-- This prevents multiple builders from working on the same lead

ALTER TABLE leads ADD COLUMN IF NOT EXISTS accepted_by_builder_id UUID REFERENCES builder_profiles(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS accepted_by_builder_name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE;

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_leads_accepted_by_builder ON leads(accepted_by_builder_id);

-- Add comments
COMMENT ON COLUMN leads.accepted_by_builder_id IS 'Builder who accepted this lead (for general inquiries)';
COMMENT ON COLUMN leads.accepted_by_builder_name IS 'Name of the builder who accepted, for quick reference';
COMMENT ON COLUMN leads.accepted_at IS 'Timestamp when the lead was accepted';
