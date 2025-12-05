-- Migration: Add builder and location context fields to leads table
-- This tracks which builder(s) a lead was sent to and where the user is looking for builders

-- Add builder targeting fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS targeted_builder_id UUID REFERENCES builder_profiles(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS targeted_builder_name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_general_inquiry BOOLEAN DEFAULT true;

-- Add location context fields (where user is looking for builders, not where event is)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS search_location_city VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS search_location_country VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS search_location_country_code VARCHAR(2);

-- Add form metadata
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_design_files BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS uploaded_files_count INTEGER DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_targeted_builder ON leads(targeted_builder_id);
CREATE INDEX IF NOT EXISTS idx_leads_is_general_inquiry ON leads(is_general_inquiry);
CREATE INDEX IF NOT EXISTS idx_leads_search_location_country ON leads(search_location_country);
CREATE INDEX IF NOT EXISTS idx_leads_search_location_city ON leads(search_location_city);

-- Add comments for documentation
COMMENT ON COLUMN leads.targeted_builder_id IS 'Specific builder this lead was sent to (NULL if general inquiry)';
COMMENT ON COLUMN leads.targeted_builder_name IS 'Name of the targeted builder for quick reference';
COMMENT ON COLUMN leads.is_general_inquiry IS 'TRUE if sent to multiple builders, FALSE if sent to specific builder';
COMMENT ON COLUMN leads.search_location_city IS 'City where user is searching for builders (not event location)';
COMMENT ON COLUMN leads.search_location_country IS 'Country where user is searching for builders (not event location)';
COMMENT ON COLUMN leads.search_location_country_code IS 'Country code where user is searching for builders';
COMMENT ON COLUMN leads.has_design_files IS 'Whether user indicated they have design files';
COMMENT ON COLUMN leads.uploaded_files_count IS 'Number of files uploaded with the quote request';
