# Technical Architecture for Global Exhibition Platform

## 🏗️ **System Architecture Overview**

### **Technology Stack**
- **Frontend**: Next.js 15 (App Router)
- **Backend**: Next.js API Routes + Serverless Functions
- **Database**: PostgreSQL with Prisma ORM
- **Search**: Elasticsearch for builder/show discovery
- **Storage**: AWS S3 for images and documents
- **CDN**: CloudFlare for global content delivery
- **Authentication**: NextAuth.js with multiple providers
- **Payments**: Stripe for premium subscriptions
- **Email**: SendGrid for transactional emails
- **Analytics**: Mixpanel + Google Analytics
- **Monitoring**: Sentry for error tracking

---

## 🗄️ **Database Schema Design**

### **Core Geographic Tables**
```sql
-- Countries table with exhibition market data
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) UNIQUE NOT NULL, -- ISO 3166-1
    continent VARCHAR(50),
    exhibition_market_size BIGINT, -- Annual market value in USD
    builder_count INTEGER DEFAULT 0,
    trade_show_count INTEGER DEFAULT 0,
    primary_language VARCHAR(10),
    currency_code CHAR(3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities with exhibition infrastructure data
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    population INTEGER,
    exhibition_venues INTEGER DEFAULT 0,
    total_exhibition_space INTEGER, -- sqm
    builder_count INTEGER DEFAULT 0,
    annual_trade_shows INTEGER DEFAULT 0,
    primary_timezone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(country_id, name)
);

-- Exhibition venues and centers
CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    address TEXT,
    total_space INTEGER, -- sqm
    hall_count INTEGER,
    website VARCHAR(255),
    contact_info JSONB,
    amenities TEXT[],
    transportation_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Trade Show Management**
```sql
-- Trade shows and exhibitions
CREATE TABLE trade_shows (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    city_id INTEGER REFERENCES cities(id),
    venue_id INTEGER REFERENCES venues(id),
    
    -- Event Details
    industry VARCHAR(100),
    industries TEXT[], -- Multiple industries
    description TEXT,
    website VARCHAR(255),
    
    -- Dates and Frequency
    start_date DATE,
    end_date DATE,
    frequency VARCHAR(20), -- 'Annual', 'Biennial', 'One-time'
    next_edition_year INTEGER,
    
    -- Statistics
    expected_exhibitors INTEGER,
    expected_visitors INTEGER,
    participating_countries INTEGER,
    exhibition_space INTEGER, -- sqm
    
    -- Costs (in local currency)
    space_cost_per_sqm DECIMAL(10, 2),
    shell_scheme_cost DECIMAL(10, 2),
    raw_space_cost DECIMAL(10, 2),
    
    -- Stand size categories
    small_stand_range VARCHAR(20), -- "9-18 sqm"
    medium_stand_range VARCHAR(20), -- "18-54 sqm"
    large_stand_range VARCHAR(20), -- "54+ sqm"
    
    -- SEO and Meta
    meta_title VARCHAR(160),
    meta_description VARCHAR(320),
    keywords TEXT[],
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'postponed'
    featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trade show categories and tags
CREATE TABLE trade_show_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES trade_show_categories(id)
);

CREATE TABLE trade_show_category_relations (
    trade_show_id INTEGER REFERENCES trade_shows(id),
    category_id INTEGER REFERENCES trade_show_categories(id),
    PRIMARY KEY (trade_show_id, category_id)
);
```

### **Builder Network Management**
```sql
-- Main builder profiles
CREATE TABLE builders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    tagline VARCHAR(300),
    description TEXT,
    
    -- Business Information
    founded_year INTEGER,
    employee_count_range VARCHAR(20), -- "10-25", "25-50", etc.
    headquarters_city_id INTEGER REFERENCES cities(id),
    
    -- Contact Details
    phone VARCHAR(30),
    email VARCHAR(255),
    website VARCHAR(255),
    address TEXT,
    
    -- Verification and Status
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verification_date TIMESTAMP,
    premium_until TIMESTAMP,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    
    -- Performance Metrics
    rating DECIMAL(3, 2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    project_count INTEGER DEFAULT 0,
    countries_served INTEGER DEFAULT 0,
    response_rate DECIMAL(5, 2) DEFAULT 0.0, -- Percentage
    avg_response_time INTEGER, -- Hours
    
    -- Quote Preferences
    minimum_project_value INTEGER,
    preferred_project_types TEXT[],
    languages TEXT[],
    
    -- SEO
    meta_title VARCHAR(160),
    meta_description VARCHAR(320),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Builder service areas (countries/cities they serve)
CREATE TABLE builder_service_areas (
    id SERIAL PRIMARY KEY,
    builder_id INTEGER REFERENCES builders(id),
    country_id INTEGER REFERENCES countries(id),
    city_id INTEGER REFERENCES cities(id), -- Optional: specific cities
    service_level VARCHAR(20), -- 'primary', 'secondary', 'occasional'
    
    UNIQUE(builder_id, country_id, city_id)
);

-- Builder specialties and capabilities
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50), -- 'service', 'industry', 'stand_type', 'technology'
    description TEXT
);

CREATE TABLE builder_specialties (
    builder_id INTEGER REFERENCES builders(id),
    specialty_id INTEGER REFERENCES specialties(id),
    expertise_level VARCHAR(20), -- 'basic', 'intermediate', 'expert'
    PRIMARY KEY (builder_id, specialty_id)
);

-- Builder certifications and awards
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    issuing_body VARCHAR(200),
    category VARCHAR(50), -- 'quality', 'safety', 'environmental', 'industry'
    website VARCHAR(255)
);

CREATE TABLE builder_certifications (
    builder_id INTEGER REFERENCES builders(id),
    certification_id INTEGER REFERENCES certifications(id),
    obtained_date DATE,
    expiry_date DATE,
    certificate_number VARCHAR(100),
    PRIMARY KEY (builder_id, certification_id)
);
```

### **Portfolio and Project Management**
```sql
-- Builder project portfolio
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    builder_id INTEGER REFERENCES builders(id),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220),
    description TEXT,
    
    -- Event Details
    trade_show_id INTEGER REFERENCES trade_shows(id),
    custom_event_name VARCHAR(200), -- For non-listed events
    event_year INTEGER,
    
    -- Project Specifications
    stand_size_sqm INTEGER,
    stand_type VARCHAR(50), -- 'custom', 'modular', 'shell_scheme'
    client_industry VARCHAR(100),
    
    -- Design Elements
    design_style VARCHAR(50),
    key_features TEXT[],
    materials_used TEXT[],
    sustainability_features TEXT[],
    
    -- Media
    main_image VARCHAR(500),
    gallery_images TEXT[],
    video_url VARCHAR(500),
    
    -- Performance
    view_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(builder_id, slug)
);

-- Client reviews and ratings
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    builder_id INTEGER REFERENCES builders(id),
    project_id INTEGER REFERENCES projects(id),
    
    -- Reviewer Information (anonymous option)
    reviewer_name VARCHAR(100),
    reviewer_company VARCHAR(200),
    reviewer_email VARCHAR(255),
    anonymous BOOLEAN DEFAULT FALSE,
    
    -- Review Content
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    
    -- Rating Breakdown
    design_rating INTEGER CHECK (design_rating >= 1 AND design_rating <= 5),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    moderated_by INTEGER REFERENCES users(id),
    moderated_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Quote Request and Matching System**
```sql
-- Quote requests from clients
CREATE TABLE quote_requests (
    id SERIAL PRIMARY KEY,
    request_token VARCHAR(100) UNIQUE NOT NULL, -- For anonymous tracking
    
    -- Event Information
    trade_show_id INTEGER REFERENCES trade_shows(id),
    custom_event_name VARCHAR(200),
    event_city_id INTEGER REFERENCES cities(id),
    event_start_date DATE,
    event_end_date DATE,
    
    -- Stand Requirements
    stand_size_sqm INTEGER,
    stand_type VARCHAR(50), -- 'custom', 'modular', 'shell_scheme'
    open_sides INTEGER,
    budget_min INTEGER,
    budget_max INTEGER,
    budget_currency CHAR(3),
    
    -- Company Information
    company_name VARCHAR(200),
    company_industry VARCHAR(100),
    exhibitor_type VARCHAR(50), -- 'first_time', 'regular', 'enterprise'
    company_size VARCHAR(20),
    
    -- Special Requirements
    required_services TEXT[], -- 'design', 'installation', 'storage', 'graphics'
    special_requirements TEXT[],
    sustainability_focus BOOLEAN DEFAULT FALSE,
    accessibility_requirements TEXT,
    
    -- Contact Details
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(30),
    preferred_language VARCHAR(10),
    preferred_contact_method VARCHAR(20),
    
    -- Additional Information
    additional_notes TEXT,
    timeline_urgency VARCHAR(20), -- 'flexible', 'standard', 'urgent'
    
    -- Status Tracking
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'matched', 'completed', 'cancelled'
    priority_score INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matched builders for each quote request
CREATE TABLE quote_matches (
    id SERIAL PRIMARY KEY,
    quote_request_id INTEGER REFERENCES quote_requests(id),
    builder_id INTEGER REFERENCES builders(id),
    
    -- Matching Algorithm Results
    match_score DECIMAL(5, 2), -- 0-100 score
    algorithm_version VARCHAR(10),
    matching_factors JSONB, -- Detailed scoring breakdown
    
    -- Builder Response
    response_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'interested', 'declined', 'responded'
    response_date TIMESTAMP,
    estimated_cost_min INTEGER,
    estimated_cost_max INTEGER,
    proposal_summary TEXT,
    
    -- Communication
    message_count INTEGER DEFAULT 0,
    last_communication TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(quote_request_id, builder_id)
);

-- Detailed quote responses from builders
CREATE TABLE quote_responses (
    id SERIAL PRIMARY KEY,
    quote_match_id INTEGER REFERENCES quote_matches(id),
    
    -- Proposal Details
    total_cost INTEGER,
    cost_breakdown JSONB, -- Detailed cost structure
    included_services TEXT[],
    optional_services JSONB, -- Service name and additional cost
    
    -- Timeline
    design_phase_duration INTEGER, -- Days
    production_duration INTEGER,
    installation_days INTEGER,
    total_timeline INTEGER,
    
    -- Terms
    payment_terms TEXT,
    warranty_period INTEGER, -- Months
    cancellation_policy TEXT,
    
    -- Attachments
    proposal_document VARCHAR(500),
    design_concepts TEXT[], -- Image URLs
    portfolio_samples TEXT[],
    
    -- Validity
    valid_until DATE,
    terms_conditions TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **User Management and Authentication**
```sql
-- Users table (builders, clients, admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- For local auth
    
    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(30),
    avatar_url VARCHAR(500),
    
    -- Role and Permissions
    role VARCHAR(20) NOT NULL, -- 'builder', 'client', 'admin', 'moderator'
    subscription_plan VARCHAR(20), -- 'free', 'basic', 'premium', 'enterprise'
    subscription_expires TIMESTAMP,
    
    -- Preferences
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50),
    currency VARCHAR(3),
    notification_preferences JSONB,
    
    -- Authentication
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(100),
    password_reset_token VARCHAR(100),
    password_reset_expires TIMESTAMP,
    
    -- OAuth providers
    google_id VARCHAR(100),
    linkedin_id VARCHAR(100),
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions and activity tracking
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    location_country VARCHAR(2),
    location_city VARCHAR(100),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔍 **Search and Discovery System**

### **Elasticsearch Index Structure**
```json
{
  "builders_index": {
    "mappings": {
      "properties": {
        "id": { "type": "integer" },
        "name": { 
          "type": "text",
          "analyzer": "standard",
          "fields": {
            "keyword": { "type": "keyword" },
            "suggest": { "type": "completion" }
          }
        },
        "location": {
          "type": "nested",
          "properties": {
            "city": { "type": "keyword" },
            "country": { "type": "keyword" },
            "coordinates": { "type": "geo_point" }
          }
        },
        "specialties": { "type": "keyword" },
        "industries": { "type": "keyword" },
        "service_areas": { "type": "keyword" },
        "rating": { "type": "float" },
        "project_count": { "type": "integer" },
        "verified": { "type": "boolean" },
        "premium": { "type": "boolean" },
        "languages": { "type": "keyword" }
      }
    }
  }
}
```

### **Search API Endpoints**
```typescript
// Builder search with intelligent filtering
POST /api/search/builders
{
  "query": "exhibition stands",
  "location": {
    "city": "Berlin",
    "country": "Germany",
    "radius": "50km"
  },
  "filters": {
    "specialties": ["custom_design", "technology"],
    "industries": ["automotive", "technology"],
    "rating_min": 4.0,
    "verified": true,
    "languages": ["en", "de"]
  },
  "sort": "relevance", // "relevance", "rating", "distance", "experience"
  "limit": 20,
  "offset": 0
}

// Trade show discovery
POST /api/search/trade-shows
{
  "query": "technology exhibition",
  "location": {
    "country": "Germany",
    "city": "Berlin"
  },
  "date_range": {
    "start": "2025-01-01",
    "end": "2025-12-31"
  },
  "industries": ["technology", "automotive"],
  "size": "large" // "small", "medium", "large"
}
```

---

## 🤖 **Matching Algorithm Implementation**

### **Smart Builder Matching Logic**
```typescript
interface MatchingCriteria {
  geographic_match: {
    same_city: 25,
    same_country: 15,
    service_area: 10,
    international: 5
  };
  experience_quality: {
    rating_excellence: 15, // 4.5+ rating
    project_volume: 10,    // 100+ projects
    event_experience: 10,  // Specific trade show experience
    industry_expertise: 5  // Industry-specific experience
  };
  service_capability: {
    service_match: 15,     // All required services
    stand_type_match: 10,  // Custom/modular preference
    budget_compatibility: 10, // Budget range alignment
    language_support: 5    // Communication language
  };
  availability_response: {
    verification_status: 10, // Verified builder
    response_time: 10,      // Fast response history
    premium_status: 5,      // Premium membership
    recent_activity: 5      // Recent platform activity
  }
}

class BuilderMatchingEngine {
  calculateMatch(builder: Builder, request: QuoteRequest): MatchScore {
    const scores = {
      geographic: this.calculateGeographicScore(builder, request),
      experience: this.calculateExperienceScore(builder, request),
      capability: this.calculateCapabilityScore(builder, request),
      availability: this.calculateAvailabilityScore(builder, request)
    };
    
    return {
      total: Object.values(scores).reduce((sum, score) => sum + score, 0),
      breakdown: scores,
      factors: this.getMatchingFactors(builder, request)
    };
  }
  
  async findTopMatches(request: QuoteRequest): Promise<Builder[]> {
    // 1. Pre-filter builders by basic criteria
    const eligibleBuilders = await this.preFilterBuilders(request);
    
    // 2. Calculate match scores for all eligible builders
    const scoredBuilders = eligibleBuilders.map(builder => ({
      builder,
      score: this.calculateMatch(builder, request)
    }));
    
    // 3. Sort by total score and return top 5
    return scoredBuilders
      .sort((a, b) => b.score.total - a.score.total)
      .slice(0, 5)
      .map(item => item.builder);
  }
}
```

---

## 📱 **Multi-Language Architecture**

### **Internationalization Structure**
```typescript
// Language configuration
const locales = {
  en: { name: 'English', flag: '🇺🇸', rtl: false },
  de: { name: 'Deutsch', flag: '🇩🇪', rtl: false },
  fr: { name: 'Français', flag: '🇫🇷', rtl: false },
  es: { name: 'Español', flag: '🇪🇸', rtl: false },
  it: { name: 'Italiano', flag: '🇮🇹', rtl: false },
  nl: { name: 'Nederlands', flag: '🇳🇱', rtl: false },
  ar: { name: 'العربية', flag: '🇸🇦', rtl: true },
  zh: { name: '中文', flag: '🇨🇳', rtl: false },
  ja: { name: '日本語', flag: '🇯🇵', rtl: false },
  pt: { name: 'Português', flag: '🇧🇷', rtl: false }
};

// Dynamic content translation table
CREATE TABLE content_translations (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50), -- 'country', 'city', 'trade_show', 'builder'
    content_id INTEGER,
    field_name VARCHAR(50), -- 'name', 'description', 'meta_title'
    language VARCHAR(10),
    translated_text TEXT,
    translation_quality VARCHAR(20), -- 'human', 'ai_reviewed', 'ai_generated'
    translator_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(content_type, content_id, field_name, language)
);
```

### **SEO URL Structure**
```typescript
// Localized URL patterns
const urlPatterns = {
  en: {
    builders: '/exhibition-stands/{country}/{city}',
    tradeShows: '/trade-shows/{country}/{event}',
    companies: '/companies/{slug}'
  },
  de: {
    builders: '/messebau/{country}/{city}',
    tradeShows: '/messen/{country}/{event}',
    companies: '/unternehmen/{slug}'
  },
  fr: {
    builders: '/stands-exposition/{country}/{city}',
    tradeShows: '/salons-professionnels/{country}/{event}',
    companies: '/entreprises/{slug}'
  }
  // ... other languages
};
```

---

## 📊 **Analytics and Performance Monitoring**

### **Key Metrics Tracking**
```typescript
interface PlatformMetrics {
  // User Engagement
  monthly_active_users: number;
  builder_profile_views: number;
  quote_request_volume: number;
  search_queries_count: number;
  
  // Conversion Metrics
  quote_to_response_rate: number;
  response_to_project_rate: number;
  builder_signup_rate: number;
  premium_conversion_rate: number;
  
  // Geographic Performance
  top_performing_countries: CountryMetric[];
  fastest_growing_cities: CityMetric[];
  seasonal_trends: SeasonalData[];
  
  // Quality Metrics
  average_builder_rating: number;
  response_time_average: number;
  user_satisfaction_score: number;
  platform_uptime: number;
}

// Real-time dashboard queries
CREATE MATERIALIZED VIEW platform_stats AS
SELECT 
  COUNT(DISTINCT b.id) as total_builders,
  COUNT(DISTINCT c.id) as total_cities,
  COUNT(DISTINCT ts.id) as total_trade_shows,
  COUNT(DISTINCT qr.id) as total_quote_requests,
  AVG(b.rating) as avg_builder_rating,
  COUNT(DISTINCT CASE WHEN b.verification_status = 'verified' THEN b.id END) as verified_builders
FROM builders b
FULL OUTER JOIN cities c ON TRUE
FULL OUTER JOIN trade_shows ts ON TRUE
FULL OUTER JOIN quote_requests qr ON qr.created_at >= NOW() - INTERVAL '30 days';
```

---

This technical architecture provides a robust foundation for scaling to 500+ builders across 80+ countries while maintaining high performance, user experience, and data integrity.