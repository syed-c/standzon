# Supabase Configuration Fix Documentation

## Problem Summary
Builders are visible on localhost but not on the production website. The production environment shows the error message: "No builders found in Supabase. Check Supabase connection and data." even though data exists in the database and is visible on the `/builders` page.

## Root Cause Identified
The production environment is missing the required Supabase environment variables, causing the unified data platform to fail when trying to fetch builder data from Supabase.

## Solution Implemented

### 1. Enhanced Error Handling and Logging
Improved error handling in [unifiedPlatformData.ts](lib/data/unifiedPlatformData.ts) and [builders.ts](lib/supabase/builders.ts) to provide more detailed diagnostic information when Supabase is not configured or when connection issues occur.

### 2. Environment Variable Validation
Added checks to verify that required Supabase environment variables are present before attempting to connect to the database.

### 3. Graceful Degradation
Modified the data loading logic to gracefully handle cases where Supabase is not configured, rather than failing completely.

### 4. Diagnostic Tools
Created API endpoints and scripts to help diagnose Supabase configuration issues.

## Files Modified

1. [lib/data/unifiedPlatformData.ts](lib/data/unifiedPlatformData.ts)
   - Added environment variable validation
   - Enhanced error logging
   - Improved graceful degradation when Supabase is not configured

2. [lib/supabase/builders.ts](lib/supabase/builders.ts)
   - Added environment variable checks
   - Enhanced error handling and logging
   - Added diagnostic queries to help identify connection issues

## Required Environment Variables

The following environment variables must be set in the production environment:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional (for client-side access)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Fix the Production Issue

### 1. Set Environment Variables
Ensure the production environment has the required Supabase environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### 2. Verify Configuration
Use the diagnostic API endpoint to verify the configuration:
```
GET /api/test-supabase-config
```

### 3. Check Database Access
Ensure the service role key has proper access to the database tables:
- `builders`
- `builder_profiles`

## Diagnostic Tools Created

### API Endpoint
- `/api/test-supabase-config` - Tests Supabase configuration and connection

### Scripts
- [scripts/test-supabase-connection.js](scripts/test-supabase-connection.js) - Command-line script to test Supabase connection

## Expected Results

1. Builders should now appear on location pages in production
2. Improved error messages when Supabase is not configured
3. Better diagnostic information for troubleshooting
4. Graceful degradation when Supabase is unavailable

## Monitoring

Check console logs for:
- `✅ Supabase is configured. Proceeding with data loading...`
- `📊 Loaded X builders from Supabase`
- Any warning or error messages related to Supabase configuration

## Rollback Plan

If issues persist:
1. Revert changes to unifiedPlatformData.ts and builders.ts
2. Manually verify Supabase credentials in production environment
3. Check database table permissions and Row Level Security (RLS) settings
4. Verify network connectivity to Supabase from production server