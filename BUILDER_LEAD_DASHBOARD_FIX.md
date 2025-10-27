# Builder Lead Dashboard Fix Guide

## Problem
Builder dashboard was showing "0 Active Leads" even after leads were submitted because:
1. Missing database migration - new context fields weren't added to Supabase
2. API wasn't filtering leads by builder ID AND their service locations
3. Dashboard wasn't fetching leads properly

## Solution

### Step 1: Run Database Migration (REQUIRED)

**Go to your Supabase Dashboard → SQL Editor:**
https://supabase.com/dashboard → Your Project → SQL Editor → New Query

**Paste and run this SQL:**

```sql
-- Add builder targeting and location context fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS targeted_builder_id UUID REFERENCES builder_profiles(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS targeted_builder_name VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_general_inquiry BOOLEAN DEFAULT true;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS search_location_city VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS search_location_country VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS search_location_country_code VARCHAR(2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_design_files BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS uploaded_files_count INTEGER DEFAULT 0;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_targeted_builder ON leads(targeted_builder_id);
CREATE INDEX IF NOT EXISTS idx_leads_is_general_inquiry ON leads(is_general_inquiry);
CREATE INDEX IF NOT EXISTS idx_leads_search_location_country ON leads(search_location_country);
CREATE INDEX IF NOT EXISTS idx_leads_search_location_city ON leads(search_location_city);
```

### Step 2: Verify Files Are Updated

The following files have been created/updated:

✅ **New API Endpoint:** `app/api/builders/leads/route.ts`
- Fetches leads targeted to specific builder
- Fetches general inquiries matching builder's service locations
- Returns statistics and filtered results

✅ **Updated Lead Submission:** `app/api/leads/submit/route.ts`
- Now saves builder context (targeted_builder_id, targeted_builder_name)
- Saves search location (where user is looking for builders)
- Saves form metadata (design files, upload count)

✅ **Migration File:** `supabase/migrations/005_add_lead_context_fields.sql`

### Step 3: How It Works

When a lead is submitted, the system now tracks:

**1. Targeted Leads (Builder-Specific)**
```json
{
  "company_name": "Test Company",
  "targeted_builder_id": "builder-uuid-123",
  "targeted_builder_name": "Zon Media",
  "is_general_inquiry": false,
  "search_location_city": "Berlin",
  "search_location_country": "Germany"
}
```

**2. General Inquiries (Multiple Builders)**
```json
{
  "company_name": "Global Corp",
  "targeted_builder_id": null,
  "targeted_builder_name": null,
  "is_general_inquiry": true,
  "search_location_city": "Dubai",
  "search_location_country": "United Arab Emirates"
}
```

### Step 4: API Usage

**Get Leads for a Builder:**
```bash
GET /api/builders/leads?builderId=khd74k5rh9qk5zx30t5jg2jtjss7symf2
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "uuid",
        "company_name": "Test Company",
        "contact_email": "test@company.com",
        "is_general_inquiry": false,
        "targeted_builder_id": "khd74k5rh9qk5zx30t5jg2jtjss7symf2",
        "search_location_city": "Berlin",
        "search_location_country": "Germany"
      }
    ],
    "stats": {
      "total": 5,
      "targeted": 2,
      "locationMatched": 3,
      "byStatus": {
        "NEW": 3,
        "CONTACTED": 1,
        "QUOTED": 1
      },
      "byPriority": {
        "HIGH": 2,
        "MEDIUM": 2,
        "URGENT": 1
      }
    },
    "builderInfo": {
      "id": "khd74k5rh9qk5zx30t5jg2jtjss7symf2",
      "name": "Zon Media",
      "headquarters": {
        "city": "Berlin",
        "country": "Germany"
      }
    }
  }
}
```

### Step 5: Testing

**1. Submit a Test Lead Targeted to Specific Builder:**

From your website, click "Get Quote" on a builder's card. This will submit a lead with:
- `builderId` = the specific builder's ID
- `builderName` = the builder's company name
- `is_general_inquiry` = false

**2. Submit a General Inquiry:**

From the homepage or general quote form (not builder-specific), submit a lead. This will:
- `builderId` = null or "public_request"
- `is_general_inquiry` = true
- Match builders by `search_location_city` and `search_location_country`

**3. Check Builder Dashboard:**

Navigate to: http://localhost:3001/builder/dashboard

You should now see leads in the "Incoming Leads" section if:
- The lead was targeted specifically to this builder, OR
- The lead's search location matches the builder's headquarters or service locations

### Step 6: Debugging

**Check if migration ran successfully:**
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN (
  'targeted_builder_id',
  'is_general_inquiry',
  'search_location_city'
);
```

**View all leads with context:**
```sql
SELECT 
  company_name,
  targeted_builder_name,
  is_general_inquiry,
  search_location_city,
  search_location_country,
  city as event_city,
  country as event_country
FROM leads
ORDER BY created_at DESC
LIMIT 10;
```

**Check specific builder's leads:**
```sql
SELECT 
  company_name,
  contact_email,
  is_general_inquiry,
  targeted_builder_name,
  search_location_city
FROM leads
WHERE targeted_builder_id = 'your-builder-uuid-here'
   OR (is_general_inquiry = true 
       AND search_location_country = 'Germany');
```

## Understanding Lead Matching

The API matches leads to builders using this logic:

```typescript
// 1. Exact match: Lead was sent to this specific builder
if (lead.targeted_builder_id === builderProfile.id) {
  return true;
}

// 2. Location match: General inquiry in builder's service area
if (lead.is_general_inquiry) {
  // Check headquarters
  if (lead.search_location_city === builder.headquarters_city ||
      lead.search_location_country === builder.headquarters_country) {
    return true;
  }
  
  // Check service locations
  if (builder.service_locations.includes(lead.search_location)) {
    return true;
  }
}
```

## Example Scenario

**Builder: "Zon Media"**
- Headquarters: Berlin, Germany
- Service Locations: Spain (Barcelona), China (Beijing)

**Leads They Should See:**

1. ✅ **Targeted Lead:**
   - Someone clicked "Get Quote" on Zon Media's profile
   - `targeted_builder_id` = Zon Media's ID

2. ✅ **Location-Matched (HQ):**
   - General inquiry, searching for builders in Berlin or Germany
   - `search_location_city` = "Berlin"

3. ✅ **Location-Matched (Service):**
   - General inquiry, searching for builders in Barcelona
   - `search_location_city` = "Barcelona"

4. ❌ **No Match:**
   - General inquiry, searching for builders in Dubai
   - Zon Media doesn't serve Dubai

## Troubleshooting

**"Still showing 0 leads":**
1. Verify migration ran successfully in Supabase
2. Check browser console for API errors
3. Verify builder ID is correct in dashboard URL
4. Check that leads have `search_location_city` or `search_location_country` populated

**"Leads showing wrong data":**
1. Clear browser cache
2. Refresh the page
3. Check that form is sending `builderId` parameter correctly

**"Can't see targeted builder name":**
1. Verify the migration added `targeted_builder_name` column
2. Check that lead submission API is saving this field
3. Re-submit a test lead after migration

## Next Steps

After migration:
1. ✅ Submit test leads from different locations
2. ✅ Verify leads appear in builder dashboard
3. ✅ Check statistics are calculated correctly
4. ✅ Add service locations to builder profiles to increase lead matching
5. ✅ Implement lead notifications (email/SMS)
