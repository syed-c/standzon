-- Create profile_views table for tracking profile page visits
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID NOT NULL REFERENCES builder_profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_views_builder_id ON profile_views(builder_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_profile_views_builder_viewed ON profile_views(builder_id, viewed_at);

-- Add a unique constraint to prevent duplicate views from same IP within 1 hour
-- This helps prevent spam but still allows legitimate repeat visits
CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_views_unique_ip 
ON profile_views(builder_id, ip_address, DATE_TRUNC('hour', viewed_at));
