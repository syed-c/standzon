# 🚨 URGENT FIX: Builder Dashboard Not Showing Leads

## Problem
You submitted a lead but it's not showing in the builder dashboard at `/builder/dashboard`.

## Root Causes Found

### 1. ❌ **Migration Not Run** (CRITICAL)
The new lead context columns don't exist in your Supabase database yet!

Your lead has these fields:
```json
{
  "targeted_builder_id": "32a91e7f-6781-41f0-accf-007aa54a111c",
  "is_general_inquiry": false,
  "search_location_city": "Berlin",
  "search_location_country": "Germany"
}
```

But these columns don't exist in Supabase yet because you haven't run the migration!

### 2. ❌ **Wrong API Endpoint**
The [`NewBuilderDashboard`](file://d:\Projects\standzon\components\NewBuilderDashboard.tsx#L217) was calling `/api/builder/leads` (doesn't exist) instead of `/api/builders/leads`.

### 3. ❌ **Builder ID Mismatch (Possible)**
Need to verify the logged-in builder ID matches the lead's `targeted_builder_id`.

## ✅ SOLUTION - Follow These Steps EXACTLY

### STEP 1: Run Supabase Migration (REQUIRED!)

**Go to your Supabase Dashboard:**
1. Open https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Paste this SQL:

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

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN (
  'targeted_builder_id',
  'is_general_inquiry',
  'search_location_city',
  'search_location_country'
);
```

6. Click "Run" (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"
8. Scroll down to see the verification query results showing the new columns

### STEP 2: Verify the Lead Was Saved Correctly

Run this query in Supabase SQL Editor:

```sql
SELECT 
  id,
  company_name,
  contact_email,
  targeted_builder_id,
  targeted_builder_name,
  is_general_inquiry,
  search_location_city,
  search_location_country,
  city as event_city,
  country as event_country,
  created_at
FROM leads
WHERE id = 'fd9a8fa2-bda3-4de7-8c8c-e4164d9857bc';
```

**Expected Result:**
- `targeted_builder_id`: `32a91e7f-6781-41f0-accf-007aa54a111c`
- `is_general_inquiry`: `false`
- `search_location_city`: `Berlin`
- `search_location_country`: `Germany`

### STEP 3: Find the Correct Builder ID

Check which builder "Zon Media" is:

```sql
SELECT 
  id,
  company_name,
  headquarters_city,
  headquarters_country,
  primary_email
FROM builder_profiles
WHERE company_name LIKE '%Zon%Media%'
   OR id = '32a91e7f-6781-41f0-accf-007aa54a111c'
LIMIT 5;
```

**Copy the `id` value** - this is Zon Media's builder ID.

### STEP 4: Test the API Endpoint

Open your browser and go to:

```
http://localhost:3001/api/builders/leads?builderId=32a91e7f-6781-41f0-accf-007aa54a111c
```

(Replace the builderId with the actual ID from Step 3)

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "fd9a8fa2-bda3-4de7-8c8c-e4164d9857bc",
        "company_name": "Syed Rayyan",
        "contact_email": "syedrayyan7117@gmail.com",
        "search_location_city": "Berlin",
        "search_location_country": "Germany",
        ...
      }
    ],
    "stats": {
      "total": 1,
      "targeted": 1,
      "locationMatched": 0
    }
  }
}
```

### STEP 5: Check Builder Dashboard localStorage

Open browser console (F12) and run:

```javascript
// Check logged-in builder
const userData = JSON.parse(localStorage.getItem('builderUserData') || '{}');
console.log('Logged-in Builder ID:', userData.profile?.id);
console.log('Logged-in Builder Name:', userData.profile?.companyName || userData.profile?.company_name);

// Check if it matches the lead
const expectedBuilderId = '32a91e7f-6781-41f0-accf-007aa54a111c';
console.log('Does it match lead target?', userData.profile?.id === expectedBuilderId);
```

**If the IDs DON'T match:**
- You're logged in as a different builder
- You need to log in as the correct builder (Zon Media)

### STEP 6: Refresh the Dashboard

1. Make sure dev server is running: `npm run dev`
2. Go to http://localhost:3001/builder/dashboard
3. Open browser console (F12)
4. Look for these logs:
   ```
   🔍 Fetching leads for builder: 32a91e7f-6781-41f0-accf-007aa54a111c
   📊 Leads API response: {...}
   ✅ Found 1 leads for builder
   ```

5. The lead should now appear in the "Incoming Leads" section!

## 🧪 Complete Testing Checklist

✅ **Migration ran successfully** (Step 1)  
✅ **Columns exist in database** (Step 1 verification query)  
✅ **Lead was saved with correct fields** (Step 2)  
✅ **Builder ID matches** (Step 3 & 5)  
✅ **API returns leads** (Step 4)  
✅ **Dashboard shows leads** (Step 6)

## 🐛 Troubleshooting

### "Still no leads showing"

**Check 1: Migration**
```sql
-- Verify columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'targeted_builder_id';
```
Should return 1 row. If empty, migration didn't run.

**Check 2: API Response**
Open http://localhost:3001/api/builders/leads?builderId=YOUR_BUILDER_ID

If you see `"error": "Builder profile not found"`:
- The builder ID doesn't exist in `builder_profiles` table
- Use the query from Step 3 to find the correct ID

**Check 3: Builder Login**
```javascript
// In browser console
console.log(localStorage.getItem('builderUserData'));
```

If `null` or doesn't have `profile.id`:
- You're not logged in as a builder
- Go to `/auth/login?type=builder` and log in

**Check 4: Leads Table**
```sql
-- Check if lead exists
SELECT COUNT(*) FROM leads WHERE targeted_builder_id = 'YOUR_BUILDER_ID';
```

Should return at least 1.

### "API returns 0 leads but lead exists"

**Possible causes:**

1. **Builder ID mismatch**
   ```sql
   SELECT targeted_builder_id FROM leads WHERE id = 'fd9a8fa2-bda3-4de7-8c8c-e4164d9857bc';
   ```
   Compare with the logged-in builder's ID.

2. **Service locations not matching**
   The API also matches general inquiries by location:
   ```sql
   SELECT headquarters_city, headquarters_country 
   FROM builder_profiles 
   WHERE id = 'YOUR_BUILDER_ID';
   ```
   
   Should match the lead's `search_location_city` or `search_location_country`.

3. **`is_general_inquiry` flag**
   ```sql
   SELECT is_general_inquiry FROM leads WHERE id = 'fd9a8fa2-bda3-4de7-8c8c-e4164d9857bc';
   ```
   
   - If `false`: Only shows to `targeted_builder_id`
   - If `true`: Shows to all builders in that location

## 📋 Summary of Fixes Applied

✅ **Created [`/api/builders/leads/route.ts`](file://d:\Projects\standzon\app\api\builders\leads\route.ts)** - New API endpoint  
✅ **Updated [`NewBuilderDashboard.tsx`](file://d:\Projects\standzon\components\NewBuilderDashboard.tsx)** - Fixed API call  
✅ **Created migration SQL** - Adds required columns  
✅ **Enhanced logging** - Better debugging

## ⚡ Quick Fix (If migration already run)

If you've already run the migration and leads still don't show:

1. **Check browser console** - Look for API errors
2. **Hard refresh** - Ctrl+Shift+R (clears cache)
3. **Check builder ID**:
   ```javascript
   JSON.parse(localStorage.getItem('builderUserData')).profile.id
   ```
4. **Manually test API**:
   ```
   http://localhost:3001/api/builders/leads?builderId=YOUR_ID
   ```

## 🎯 Expected Outcome

After completing all steps:

1. ✅ Migration adds 8 new columns to `leads` table
2. ✅ API endpoint `/api/builders/leads` works
3. ✅ Dashboard calls correct API
4. ✅ Leads appear in "Incoming Leads" section
5. ✅ Stats show correct count (e.g., "Active Leads: 1")

## 📞 Still Not Working?

If you've completed all steps and leads still don't show:

1. **Share browser console output** (F12 → Console tab)
2. **Share Supabase query results** (from Step 2 & 3)
3. **Share API response** (from Step 4)

I'll help debug further!
