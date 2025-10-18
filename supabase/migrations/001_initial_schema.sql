-- Supabase Migration: Initial Schema for ExhibitBay Marketplace
-- This migration creates all tables to match existing data models from Prisma, Convex, and file storage

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types and enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'BUILDER', 'CLIENT');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'BANNED');
CREATE TYPE lead_status AS ENUM ('NEW', 'ASSIGNED', 'CONTACTED', 'QUOTED', 'CONVERTED', 'LOST', 'CANCELLED');
CREATE TYPE lead_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE service_category AS ENUM ('CUSTOM_DESIGN', 'MODULAR_SYSTEMS', 'PORTABLE_DISPLAYS', 'INSTALLATION', 'TRANSPORTATION', 'STORAGE', 'GRAPHICS', 'LIGHTING', 'FURNITURE', 'AV_EQUIPMENT');
CREATE TYPE note_type AS ENUM ('GENERAL', 'PHONE_CALL', 'EMAIL', 'MEETING', 'FOLLOW_UP', 'IMPORTANT');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID');
CREATE TYPE subscription_plan AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE');

-- Users table (from Prisma schema)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    email_verified TIMESTAMP WITH TIME ZONE,
    image TEXT,
    role user_role DEFAULT 'CLIENT',
    status user_status DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Authentication tables (from Prisma schema)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(50),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Builder Profile Management (from Prisma schema)
CREATE TABLE builder_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo TEXT,
    established_year INTEGER,
    headquarters_city VARCHAR(100),
    headquarters_country VARCHAR(100),
    headquarters_country_code VARCHAR(2),
    headquarters_address TEXT,
    headquarters_latitude DECIMAL(10, 8),
    headquarters_longitude DECIMAL(11, 8),
    primary_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    contact_person VARCHAR(255),
    position VARCHAR(100),
    emergency_contact VARCHAR(255),
    support_email VARCHAR(255),
    team_size INTEGER,
    projects_completed INTEGER,
    rating DECIMAL(3, 2),
    review_count INTEGER DEFAULT 0,
    response_time VARCHAR(50),
    languages TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    premium_member BOOLEAN DEFAULT FALSE,
    claimed BOOLEAN DEFAULT FALSE,
    claim_status VARCHAR(20) DEFAULT 'unclaimed',
    claimed_at TIMESTAMP WITH TIME ZONE,
    claimed_by UUID REFERENCES users(id),
    company_description TEXT,
    business_license VARCHAR(255),
    basic_stand_min DECIMAL(10, 2),
    basic_stand_max DECIMAL(10, 2),
    custom_stand_min DECIMAL(10, 2),
    custom_stand_max DECIMAL(10, 2),
    premium_stand_min DECIMAL(10, 2),
    premium_stand_max DECIMAL(10, 2),
    average_project DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    gmb_imported BOOLEAN DEFAULT FALSE,
    imported_from_gmb BOOLEAN DEFAULT FALSE,
    gmb_place_id VARCHAR(255),
    source VARCHAR(100),
    imported_at TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Countries table (from Convex schema)
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    country_slug VARCHAR(255) NOT NULL,
    continent VARCHAR(100),
    currency VARCHAR(3),
    timezone VARCHAR(100),
    language VARCHAR(10),
    active BOOLEAN DEFAULT TRUE,
    builder_count INTEGER DEFAULT 0,
    exhibition_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities table (from Convex schema)
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_name VARCHAR(255) NOT NULL,
    city_slug VARCHAR(255) NOT NULL,
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    country_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    state VARCHAR(100),
    timezone VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    population INTEGER,
    active BOOLEAN DEFAULT TRUE,
    builder_count INTEGER DEFAULT 0,
    exhibition_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Builder Service Locations (from Convex schema)
CREATE TABLE builder_service_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    builder_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    country_code VARCHAR(2),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_headquarters BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Builder Services (from Prisma schema)
CREATE TABLE builder_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    builder_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category service_category NOT NULL,
    price_from DECIMAL(10, 2),
    currency VARCHAR(3),
    unit VARCHAR(50),
    popular BOOLEAN DEFAULT FALSE,
    turnover_time VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Builder Specializations (from Convex schema)
CREATE TABLE builder_specializations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    builder_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
    industry_name VARCHAR(255) NOT NULL,
    industry_slug VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Items (from Prisma schema)
CREATE TABLE portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    builder_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    trade_show VARCHAR(255),
    year INTEGER,
    city VARCHAR(255),
    country VARCHAR(255),
    stand_size INTEGER,
    industry VARCHAR(255),
    client_name VARCHAR(255),
    description TEXT,
    images TEXT[],
    budget VARCHAR(50),
    featured BOOLEAN DEFAULT FALSE,
    project_type VARCHAR(50),
    technologies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Management System (from Prisma schema)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    trade_show_name VARCHAR(255) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE,
    venue VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    stand_size INTEGER NOT NULL,
    budget VARCHAR(100) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    stand_type TEXT[],
    special_requests TEXT,
    needs_installation BOOLEAN DEFAULT TRUE,
    needs_transportation BOOLEAN DEFAULT FALSE,
    needs_storage BOOLEAN DEFAULT FALSE,
    needs_av_equipment BOOLEAN DEFAULT FALSE,
    needs_lighting BOOLEAN DEFAULT FALSE,
    needs_furniture BOOLEAN DEFAULT FALSE,
    needs_graphics BOOLEAN DEFAULT FALSE,
    lead_score INTEGER DEFAULT 50,
    estimated_value INTEGER,
    status lead_status DEFAULT 'NEW',
    priority lead_priority DEFAULT 'MEDIUM',
    source VARCHAR(100) DEFAULT 'website',
    source_details TEXT,
    referrer VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted_at TIMESTAMP WITH TIME ZONE
);

-- Lead Assignments (from Prisma schema)
CREATE TABLE lead_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    builder_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'assigned',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote Management (from Prisma schema)
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    builder_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    valid_until TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft',
    terms TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE
);

-- Quote Items (from Prisma schema)
CREATE TABLE quote_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Notes (from Prisma schema)
CREATE TABLE lead_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    type note_type DEFAULT 'GENERAL',
    is_internal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions (from Prisma schema)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan subscription_plan NOT NULL,
    status subscription_status DEFAULT 'ACTIVE',
    price_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255),
    subscription_id VARCHAR(255),
    lead_credits INTEGER DEFAULT 0,
    featured_listings INTEGER DEFAULT 0,
    portfolio_items INTEGER DEFAULT 10,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Reviews (from Prisma schema)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    builder_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications (from Prisma schema)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trade Shows (from Convex schema)
CREATE TABLE trade_shows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    venue VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    website VARCHAR(255),
    industry VARCHAR(100),
    expected_attendees INTEGER,
    booth_sizes TEXT[],
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive Exhibitions (from Convex schema)
CREATE TABLE exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    city_id UUID REFERENCES cities(id),
    country_id UUID REFERENCES countries(id),
    city_name VARCHAR(255) NOT NULL,
    country_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    venue VARCHAR(255),
    venue_address TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    year INTEGER,
    month INTEGER,
    frequency VARCHAR(20),
    industry VARCHAR(100),
    category VARCHAR(50),
    expected_attendees INTEGER,
    expected_exhibitors INTEGER,
    booth_sizes TEXT[],
    website VARCHAR(255),
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    organizer_phone VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    source_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote Requests (from Convex schema)
CREATE TABLE quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    trade_show VARCHAR(255) NOT NULL,
    trade_show_slug VARCHAR(255),
    stand_size INTEGER,
    budget VARCHAR(100),
    timeline VARCHAR(100),
    requirements TEXT[],
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    contact_person VARCHAR(255) NOT NULL,
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'Open',
    priority VARCHAR(20) DEFAULT 'Standard',
    matched_builders UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote Responses (from Convex schema)
CREATE TABLE quote_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_request_id UUID REFERENCES quote_requests(id) ON DELETE CASCADE,
    builder_id UUID REFERENCES builder_profiles(id) ON DELETE CASCADE,
    builder_name VARCHAR(255) NOT NULL,
    estimated_cost DECIMAL(10, 2),
    currency VARCHAR(3),
    timeline VARCHAR(100),
    proposal TEXT,
    inclusions TEXT[],
    status VARCHAR(50) DEFAULT 'Pending',
    viewed_by_client BOOLEAN DEFAULT FALSE,
    response_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings (from Convex schema)
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_by UUID REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_builder_profiles_slug ON builder_profiles(slug);
CREATE INDEX idx_builder_profiles_email ON builder_profiles(primary_email);
CREATE INDEX idx_builder_profiles_country ON builder_profiles(headquarters_country);
CREATE INDEX idx_builder_profiles_city ON builder_profiles(headquarters_city);
CREATE INDEX idx_builder_profiles_verified ON builder_profiles(verified);
CREATE INDEX idx_builder_profiles_claimed ON builder_profiles(claimed);
CREATE INDEX idx_builder_profiles_rating ON builder_profiles(rating);

CREATE INDEX idx_countries_code ON countries(country_code);
CREATE INDEX idx_countries_slug ON countries(country_slug);
CREATE INDEX idx_countries_active ON countries(active);

CREATE INDEX idx_cities_slug ON cities(city_slug);
CREATE INDEX idx_cities_country_id ON cities(country_id);
CREATE INDEX idx_cities_country_code ON cities(country_code);
CREATE INDEX idx_cities_active ON cities(active);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(contact_email);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_created_at ON leads(created_at);

CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_lead_id ON quotes(lead_id);
CREATE INDEX idx_quotes_builder_id ON quotes(builder_id);

CREATE INDEX idx_exhibitions_slug ON exhibitions(slug);
CREATE INDEX idx_exhibitions_country_code ON exhibitions(country_code);
CREATE INDEX idx_exhibitions_city_name ON exhibitions(city_name);
CREATE INDEX idx_exhibitions_active ON exhibitions(active);
CREATE INDEX idx_exhibitions_featured ON exhibitions(featured);

CREATE INDEX idx_quote_requests_status ON quote_requests(status);
CREATE INDEX idx_quote_requests_email ON quote_requests(contact_email);
CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at);

CREATE INDEX idx_site_settings_key ON site_settings(key);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_builder_profiles_updated_at BEFORE UPDATE ON builder_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trade_shows_updated_at BEFORE UPDATE ON trade_shows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exhibitions_updated_at BEFORE UPDATE ON exhibitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
