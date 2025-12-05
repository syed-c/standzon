# Lead Context Enhancement Guide

## Problem
Leads saved to Supabase were missing important context:
- Which builder(s) the lead was sent to
- Whether it's a general inquiry or builder-specific request
- Where the user is searching for builders (vs. where the event is)
- Design file information

## Solution

### Step 1: Run Database Migration

**Go to your Supabase Dashboard:**
https://supabase.com/dashboard → Your Project → SQL Editor → New Query

**Paste and run this SQL:**

```sql
-- Add builder targeting fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS targeted_builder_id UUID REFERENCES builder_profiles(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS targeted_builder_name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_general_inquiry BOOLEAN DEFAULT true;

-- Add location context fields
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
```

### Step 2: Verify Migration

After running the migration, verify the new columns exist:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN (
    'targeted_builder_id',
    'targeted_builder_name',
    'is_general_inquiry',
    'search_location_city',
    'search_location_country',
    'search_location_country_code',
    'has_design_files',
    'uploaded_files_count'
)
ORDER BY column_name;
```

### Step 3: Test the New Fields

After migration, submit a test lead from your app. The API code has been updated to save these fields automatically.

**Example test (in PowerShell):**

```powershell
$testLead = @{
  companyName = "Test Company"
  email = "test@company.com"
  phone = "+1-555-1234"
  exhibitionName = "CES 2025"
  city = "Las Vegas"
  country = "United States"
  standSize = 100
  budget = "$25,000 - $50,000"
  timeline = "3-4 months"
  message = "Test message"
  builderId = "builder_xyz"
  builderName = "Test Builder Inc"
  builderLocation = "New York, United States"
  cityName = "New York"
  location = "United States"
  countryCode = "US"
  hasDesign = $true
  uploadedFilesCount = 2
  source = "test"
  urgency = "medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/leads/submit" -Method POST -Body $testLead -ContentType "application/json"
```

## New Database Schema

### Added Columns

| Column Name | Type | Description | Example |
|------------|------|-------------|---------|
| `targeted_builder_id` | UUID | ID of specific builder (NULL if general) | `773f473b-9d4b-49e5...` |
| `targeted_builder_name` | VARCHAR(255) | Builder's company name | "Emirates Stand Builders" |
| `is_general_inquiry` | BOOLEAN | TRUE = sent to multiple builders | `false` |
| `search_location_city` | VARCHAR(255) | City where user searches builders | "Dubai" |
| `search_location_country` | VARCHAR(255) | Country where user searches builders | "United Arab Emirates" |
| `search_location_country_code` | VARCHAR(2) | Country code | "AE" |
| `has_design_files` | BOOLEAN | User indicated they have designs | `true` |
| `uploaded_files_count` | INTEGER | Number of files uploaded | `3` |

### Understanding the Fields

**Event Location vs. Search Location:**
- `city` / `country` = Where the exhibition/event will take place (e.g., "Las Vegas, USA")
- `search_location_city` / `search_location_country` = Where the user is looking for builders (e.g., "Dubai, UAE")

These can be different! A company in Dubai might attend CES in Las Vegas.

**General vs. Specific Inquiries:**
- `is_general_inquiry = TRUE` → Lead sent to multiple builders
- `is_general_inquiry = FALSE` → Lead sent to specific builder (check `targeted_builder_id`)

## API Response Example

After migration, leads will include full context:

```json
{
  "id": "773f473b-9d4b-49e5-b1b9-827cf4e62c5e",
  "company_name": "werepair",
  "contact_email": "info@werepair.ae",
  "contact_phone": "+971508705003",
  
  "trade_show_name": "GITEX Dubai 2025",
  "city": "Dubai",
  "country": "United Arab Emirates",
  
  "targeted_builder_id": "builder_123",
  "targeted_builder_name": "Emirates Stand Builders",
  "is_general_inquiry": false,
  
  "search_location_city": "Dubai",
  "search_location_country": "United Arab Emirates",
  "search_location_country_code": "AE",
  
  "has_design_files": true,
  "uploaded_files_count": 3,
  
  "budget": "$50,000 - $100,000",
  "timeline": "3-4 months",
  "priority": "HIGH",
  "source": "unified_quote_request"
}
```

## Query Examples

### Get all general inquiries:
```sql
SELECT * FROM leads WHERE is_general_inquiry = true;
```

### Get leads for specific builder:
```sql
SELECT * FROM leads WHERE targeted_builder_id = 'builder_uuid_here';
```

### Get leads by search location:
```sql
SELECT * FROM leads 
WHERE search_location_country = 'United Arab Emirates'
AND search_location_city = 'Dubai';
```

### Get leads with design files:
```sql
SELECT * FROM leads 
WHERE has_design_files = true 
AND uploaded_files_count > 0;
```

### Find leads where event and search locations differ:
```sql
SELECT 
  company_name,
  city as event_city,
  country as event_country,
  search_location_city,
  search_location_country
FROM leads
WHERE city != search_location_city 
   OR country != search_location_country;
```

## Testing Checklist

- [ ] Run the SQL migration in Supabase dashboard
- [ ] Verify new columns exist in the table
- [ ] Submit a test lead from the website
- [ ] Check that all new fields are populated
- [ ] Query leads with `action=with-context` parameter
- [ ] Verify builder-specific leads have `targeted_builder_id`
- [ ] Verify general inquiries have `is_general_inquiry = true`

## Troubleshooting

**If migration fails:**
- Check if columns already exist: `\d leads` in SQL editor
- Make sure you're using the Service Role key, not Anon key
- Check for FK constraint errors (builder_profiles table must exist)

**If fields are NULL after submission:**
- Check console logs for API errors
- Verify the form is sending `builderId`, `builderName`, `builderLocation`
- Check that `body` parameter includes the new fields

## Files Modified

- `supabase/migrations/005_add_lead_context_fields.sql` - New migration
- `app/api/leads/submit/route.ts` - Updated to save new fields
- `app/api/admin/leads/route.ts` - New endpoint to view leads with context

## Next Steps

After migration is complete:
1. Update builder dashboard to filter by `targeted_builder_id`
2. Create analytics on general vs. specific inquiries
3. Add location-based lead routing improvements
4. Display design file indicators in admin panel
