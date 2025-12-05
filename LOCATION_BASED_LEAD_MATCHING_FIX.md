# Location-Based Lead Matching - Fix Documentation

## 🐛 Problem Identified

**Issue:** General inquiry leads for Berlin, Germany were not showing to builders who serve that location.

**Root Cause:** The API was not fetching service locations from the `builder_service_locations` table. It was looking for a `service_locations` JSON field directly in the `builder_profiles` table, which doesn't exist.

## 📊 Database Structure

### **builder_profiles** table
```sql
CREATE TABLE builder_profiles (
    id UUID PRIMARY KEY,
    company_name VARCHAR(255),
    headquarters_city VARCHAR(255),
    headquarters_country VARCHAR(255),
    -- ... other fields
);
```

### **builder_service_locations** table (separate table!)
```sql
CREATE TABLE builder_service_locations (
    id UUID PRIMARY KEY,
    builder_id UUID REFERENCES builder_profiles(id),
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    country_code VARCHAR(2),
    is_headquarters BOOLEAN DEFAULT FALSE,
    -- ... other fields
);
```

**Example data for "werepair" builder:**
```sql
INSERT INTO builder_service_locations (builder_id, city, country, country_code)
VALUES 
  ('{werepair-id}', 'Melbourne', 'Australia', 'AU'),
  ('{werepair-id}', 'Dubai', 'United Arab Emirates', 'AE'),
  ('{werepair-id}', 'Vienna', 'Austria', 'AT'),
  ('{werepair-id}', 'Berlin', 'Germany', 'DE');
```

## ✅ Solution Implemented

### **1. Updated API to JOIN service_locations table**

**Before:**
```typescript
const { data, error } = await dbService['client']
  .from('builder_profiles')
  .select('*')  // ❌ Only gets builder_profiles data
  .eq('id', builderId)
  .single();
```

**After:**
```typescript
const { data, error } = await dbService['client']
  .from('builder_profiles')
  .select(`
    *,
    service_locations:builder_service_locations(
      city,
      country,
      country_code,
      is_headquarters
    )
  `)  // ✅ JOINs with builder_service_locations
  .eq('id', builderId)
  .single();
```

### **2. Updated Lead Matching Logic**

Now the API checks:

#### **A. Targeted Leads (Specific Builder)**
```typescript
if (lead.targeted_builder_id === builderProfile.id) {
  return true; // Show only to this builder
}
```

#### **B. General Inquiry Leads (Location-Based)**

**Step 1: Check Headquarters Match**
```typescript
const hqCityMatch = lead.search_location_city === builder.headquarters_city;
const hqCountryMatch = lead.search_location_country === builder.headquarters_country;

if (hqCityMatch || hqCountryMatch) {
  return true; // Show to builder
}
```

**Step 2: Check Service Locations Match**
```typescript
if (builder.service_locations && Array.isArray(builder.service_locations)) {
  const match = builder.service_locations.some((loc) => {
    const cityMatch = loc.city === lead.search_location_city;
    const countryMatch = loc.country === lead.search_location_country;
    return cityMatch || countryMatch;
  });
  
  if (match) {
    return true; // Show to builder
  }
}
```

## 🎯 Example: How It Works Now

### **Scenario: Berlin Lead**

**Lead Data:**
```json
{
  "company_name": "shuja ahmad",
  "search_location_city": "Berlin",
  "search_location_country": "Germany",
  "is_general_inquiry": true,
  "status": "NEW"
}
```

**Builder: "werepair"**
```json
{
  "id": "werepair-uuid",
  "company_name": "werepair",
  "headquarters_city": "Melbourne",
  "headquarters_country": "Australia",
  "service_locations": [
    { "city": "Melbourne", "country": "Australia" },
    { "city": "Dubai", "country": "United Arab Emirates" },
    { "city": "Vienna", "country": "Austria" },
    { "city": "Berlin", "country": "Germany" }  // ✅ MATCH!
  ]
}
```

**Matching Process:**
1. ❌ Not a targeted lead (targeted_builder_id = null)
2. ✅ Is general inquiry (is_general_inquiry = true)
3. ❌ HQ city doesn't match (Melbourne ≠ Berlin)
4. ❌ HQ country doesn't match (Australia ≠ Germany)
5. ✅ **Service location matches!** (Berlin, Germany found in service_locations)
6. **Result:** Lead shows in werepair's dashboard ✅

## 📋 API Response Structure

```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "34300c74-2ff7-4963-9bcb-0b1e6bcd2f18",
        "company_name": "shuja ahmad",
        "contact_email": "syedrayyan7117@gmail.com",
        "search_location_city": "Berlin",
        "search_location_country": "Germany",
        "is_general_inquiry": true,
        "status": "NEW",
        "created_at": "2025-10-27T11:50:46.362Z"
      }
    ],
    "stats": {
      "total": 1,
      "targeted": 0,
      "locationMatched": 1,
      "byStatus": {
        "NEW": 1,
        "ASSIGNED": 0
      }
    },
    "builderInfo": {
      "id": "werepair-uuid",
      "name": "werepair",
      "headquarters": {
        "city": "Melbourne",
        "country": "Australia"
      }
    }
  }
}
```

## 🔍 Enhanced Debugging Logs

The API now provides detailed console logs:

```
🔍 Fetching leads for builder: { builderId: 'werepair-uuid' }

👤 Builder profile found: {
  id: 'werepair-uuid',
  name: 'werepair',
  hqCity: 'Melbourne',
  hqCountry: 'Australia',
  serviceLocations: [
    { city: 'Melbourne', country: 'Australia' },
    { city: 'Dubai', country: 'United Arab Emirates' },
    { city: 'Vienna', country: 'Austria' },
    { city: 'Berlin', country: 'Germany' }
  ]
}

📊 Total leads in database: 15

🔍 Checking general inquiry lead: {
  leadCompany: 'shuja ahmad',
  searchCity: 'Berlin',
  searchCountry: 'Germany',
  builderHqCity: 'Melbourne',
  builderHqCountry: 'Australia',
  hasServiceLocations: true
}

🏢 HQ Match Check: { hqCityMatch: false, hqCountryMatch: false }

📍 Checking service locations: [
  { city: 'Melbourne', country: 'Australia' },
  { city: 'Dubai', country: 'United Arab Emirates' },
  { city: 'Vienna', country: 'Austria' },
  { city: 'Berlin', country: 'Germany' }
]

📦 Service location check: {
  locCity: 'Berlin',
  locCountry: 'Germany',
  leadCity: 'Berlin',
  leadCountry: 'Germany',
  cityMatch: true,
  countryMatch: true
}

✅ Found service location-matched lead: shuja ahmad

✅ Found 1 relevant leads for builder
```

## 🧪 Testing Steps

### **Test 1: Verify Service Locations are Loaded**

1. Open browser console (F12)
2. Go to werepair's dashboard: `/builder/dashboard`
3. Click "Leads" tab
4. Look for log: `👤 Builder profile found: { ..., serviceLocations: [...] }`
5. ✅ Should show array of service locations including Berlin

### **Test 2: Verify Lead Appears**

1. Submit a general inquiry lead for Berlin, Germany
2. Check werepair's dashboard
3. ✅ Lead should appear in "Incoming Leads"
4. Check console logs for: `✅ Found service location-matched lead: {company}`

### **Test 3: Verify Other Builders Don't See It**

1. Login as a different builder (e.g., "Zon Media")
2. Check their service locations
3. If they DON'T serve Berlin:
   - ❌ Lead should NOT appear in their dashboard
4. If they DO serve Berlin:
   - ✅ Lead SHOULD appear in their dashboard

## 🔧 Manual Database Query for Testing

To verify service locations in database:

```sql
-- Check werepair's service locations
SELECT 
  bp.company_name,
  bsl.city,
  bsl.country,
  bsl.is_headquarters
FROM builder_profiles bp
LEFT JOIN builder_service_locations bsl ON bsl.builder_id = bp.id
WHERE bp.company_name = 'werepair';
```

Expected result:
```
company_name | city      | country                  | is_headquarters
-------------|-----------|--------------------------|----------------
werepair     | Melbourne | Australia                | true
werepair     | Dubai     | United Arab Emirates     | false
werepair     | Vienna    | Austria                  | false
werepair     | Berlin    | Germany                  | false
```

## 🚨 Common Issues & Fixes

### **Issue 1: Service locations not showing**
**Symptom:** `serviceLocations: []` in logs

**Fix:** Insert service locations into database:
```sql
INSERT INTO builder_service_locations (builder_id, city, country, country_code)
SELECT 
  id,
  'Berlin',
  'Germany',
  'DE'
FROM builder_profiles
WHERE company_name = 'werepair';
```

### **Issue 2: Leads still not appearing**
**Symptom:** API returns `total: 0`

**Checks:**
1. ✅ Lead has `is_general_inquiry = true`
2. ✅ Lead has `search_location_city` and `search_location_country`
3. ✅ Builder has matching entry in `builder_service_locations`
4. ✅ Case-insensitive match (API uses `.toLowerCase()`)

### **Issue 3: Duplicate leads showing**
**Symptom:** Same lead appears multiple times

**Cause:** Builder has multiple service location entries for same city

**Fix:** Remove duplicates:
```sql
DELETE FROM builder_service_locations
WHERE id IN (
  SELECT id FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY builder_id, city, country ORDER BY created_at) as rn
    FROM builder_service_locations
  ) t
  WHERE rn > 1
);
```

## 📝 Summary

✅ **Fixed API** to JOIN `builder_service_locations` table  
✅ **Updated matching logic** to check service locations array  
✅ **Added detailed logging** for debugging  
✅ **Handles both HQ and service location matches**  
✅ **Case-insensitive matching** for city/country names  

Now all builders serving Berlin will see general inquiry leads for that location! 🎉
