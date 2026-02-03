# Production Builder Display Fix

## Problem
Builders were not displaying on location pages in production, while content was loading correctly. This happened because:

1. Content was fetched using server-side Supabase calls that work at build time
2. Builders were fetched using client-side API calls that depend on runtime data
3. During static generation, the builder data wasn't available, causing the section to be permanently removed from the HTML

## Root Cause
The pages were being statically generated at build time, but builders depend on runtime data that isn't available during static generation.

## Solution Applied
Added `export const dynamic = 'force-dynamic'` to all location page components to force dynamic rendering and prevent build-time evaluation.

## Files Modified

### 1. Dynamic Route Files
- `/app/exhibition-stands/[country]/[city]/page.tsx` - City pages
- `/app/exhibition-stands/[country]/page.tsx` - Country pages

### 2. Specific Country Page Files
- `/app/exhibition-stands/de/page.tsx` - Germany
- `/app/exhibition-stands/gb/page.tsx` - United Kingdom
- `/app/exhibition-stands/at/page.tsx` - Austria
- `/app/exhibition-stands/au/page.tsx` - Australia
- `/app/exhibition-stands/es/page.tsx` - Spain
- `/app/exhibition-stands/ch/page.tsx` - Switzerland
- `/app/exhibition-stands/pl/page.tsx` - Poland

### 3. Specific City Page Files
- `/app/exhibition-stands/de/berlin/page.tsx` - Berlin, Germany
- `/app/exhibition-stands/gb/london/page.tsx` - London, UK
- `/app/exhibition-stands/us/boston/page.tsx` - Boston, USA
- `/app/exhibition-stands/nl/rotterdam/page.tsx` - Rotterdam, Netherlands

All other specific country and city page files in the `/app/exhibition-stands/` directory have also been updated with the same fix using an automated script.

## Script Used
A script was created at `/scripts/apply-dynamic-fix.js` to automatically apply the fix to all relevant files:
- Finds all `.tsx` files in the `/app/exhibition-stands/` directory
- Checks if the file is a server component page (has `export default async function`)
- Skips files that already have dynamic exports or are client components
- Inserts `export const dynamic = 'force-dynamic'` after the import statements

## Why This Fix Works
By adding `export const dynamic = 'force-dynamic'`, we ensure that:

1. All pages are rendered dynamically at request time, not at build time
2. Builders data is available when the page renders
3. Conditional rendering based on builder data works correctly
4. RLS-protected data can be accessed with proper auth context

## Alternative Solutions (Not Used)
1. Adding `{ cache: 'no-store' }` to individual fetch calls
2. Making builder components client-only with `'use client'` directive
3. Using `export const revalidate = 0` to disable static generation

The chosen solution is the simplest and most comprehensive fix that addresses the root cause.