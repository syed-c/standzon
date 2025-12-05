-- Create page_contents table for CMS functionality
CREATE TABLE page_contents (
    id VARCHAR(255) PRIMARY KEY,
    path VARCHAR(500),
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_page_contents_path ON page_contents(path);
CREATE INDEX idx_page_contents_updated_at ON page_contents(updated_at);

-- Add RLS (Row Level Security) policies if needed
-- For now, we'll allow all operations (adjust based on your security requirements)
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations on page_contents" ON page_contents
    FOR ALL USING (true);
