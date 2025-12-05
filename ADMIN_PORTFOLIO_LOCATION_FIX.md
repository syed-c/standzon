# Admin Portfolio Location Selection Fix

## Problem
The admin portfolio page was not showing all available locations in the country and city selection dropdowns. Previously, it was only showing a limited set of locations from the static `globalCities` data instead of fetching from the actual "page_contents" table in the database which contains around 200-215 pages.

## Solution Implemented
Modified the admin portfolio page to fetch location data directly from the "page_contents" table in Supabase, which contains all the actual pages that have been created in the system.

### Changes Made

1. **Data Source Update**: 
   - Replaced static `globalCities` data loading with dynamic fetching from Supabase `page_contents` table
   - Used `getSupabaseAdminClient()` to access the database with admin privileges

2. **Path Parsing Logic**:
   - Implemented regex pattern matching to extract country and city information from page paths
   - Country paths: `/exhibition-stands/{country}`
   - City paths: `/exhibition-stands/{country}/{city}`
   - Converted slugs to readable names (e.g., "united-states" → "United States")

3. **Data Organization**:
   - Created structured data for countries and cities
   - Sorted countries alphabetically for better UX
   - Grouped cities by their respective countries

4. **Error Handling**:
   - Added proper error handling and user feedback via toast notifications
   - Graceful fallback in case Supabase client is not available

### Key Benefits

1. **Complete Location Coverage**: Now shows all 200+ locations that actually exist in the system
2. **Real-time Data**: Fetches current page data directly from the database
3. **Accurate Representation**: Only shows locations that have actual pages created
4. **Better UX**: Sorted country list and properly grouped cities
5. **Scalable**: Automatically includes new locations as pages are created

### Technical Details

The implementation parses the `path` field from the `page_contents` table:
- Extracts country slugs from paths like `/exhibition-stands/germany`
- Extracts city slugs from paths like `/exhibition-stands/germany/berlin`
- Converts slugs to human-readable names by capitalizing words
- Builds structured data for the dropdown selectors

This ensures that the admin can manage gallery images for ALL locations that have been created in the system, not just a predefined static list.