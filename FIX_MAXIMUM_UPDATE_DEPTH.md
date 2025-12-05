# Fix Maximum Update Depth Exceeded Error

## Problem
The admin pages editor component was throwing a "Maximum update depth exceeded" error. This React error occurs when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render, causing an infinite loop.

## Root Cause
The issue was in the useEffect hooks in `app/admin/pages-editor/page.tsx`:
1. Two useEffect hooks were missing proper cleanup mechanisms
2. Async operations in useEffect hooks could potentially cause state updates after the component unmounted
3. No protection against state updates when component is no longer mounted

## Solution Implemented

### 1. Added Cleanup Mechanisms
Added `isMounted` flags to both useEffect hooks to prevent state updates after component unmount:
- First useEffect (loading country/city options)
- Second useEffect (loading pages and other data)

### 2. Improved Error Handling
Added proper error handling and logging to identify any issues during data loading.

### 3. Ensured Proper Async Handling
Wrapped async operations in proper try/catch blocks and ensured state updates only happen when component is still mounted.

## Files Modified
- `app/admin/pages-editor/page.tsx` - Fixed useEffect hooks to prevent infinite loops

## Changes Made
1. Added `isMounted` flag to track component mount status
2. Added cleanup functions to set `isMounted = false` when component unmounts
3. Wrapped all state updates in `if (isMounted)` checks
4. Added proper error handling for async operations
5. Ensured all fetch operations have proper error handling

## Result
The "Maximum update depth exceeded" error has been resolved. The component now properly handles:
- Component unmounting during async operations
- State updates only when component is still mounted
- Proper cleanup of resources
- Error handling for failed data loading