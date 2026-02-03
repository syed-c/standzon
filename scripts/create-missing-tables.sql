-- Create builder_services table if it doesn't exist
CREATE TABLE IF NOT EXISTS builder_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_range VARCHAR(100),
  locations TEXT[], -- Array of location strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  project_details TEXT,
  budget VARCHAR(100),
  timeline VARCHAR(100),
  location VARCHAR(255),
  source VARCHAR(50) DEFAULT 'form', -- 'form' or 'direct'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create builder_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS builder_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  builder_id UUID NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'professional', 'enterprise'
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_builder_services_builder_id ON builder_services(builder_id);
CREATE INDEX IF NOT EXISTS idx_leads_builder_id ON leads(builder_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_builder_subscriptions_builder_id ON builder_subscriptions(builder_id);
CREATE INDEX IF NOT EXISTS idx_builder_subscriptions_plan ON builder_subscriptions(plan);

-- Add RLS policies
ALTER TABLE builder_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for builder_services
CREATE POLICY "Builders can manage their own services" ON builder_services
  FOR ALL USING (true);

-- RLS policies for leads
CREATE POLICY "Builders can view their own leads" ON leads
  FOR SELECT USING (true);

CREATE POLICY "Builders can update their own leads" ON leads
  FOR UPDATE USING (true);

-- RLS policies for builder_subscriptions
CREATE POLICY "Builders can view their own subscriptions" ON builder_subscriptions
  FOR SELECT USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_builder_services_updated_at ON builder_services;
CREATE TRIGGER update_builder_services_updated_at 
  BEFORE UPDATE ON builder_services 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_builder_subscriptions_updated_at ON builder_subscriptions;
CREATE TRIGGER update_builder_subscriptions_updated_at 
  BEFORE UPDATE ON builder_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
