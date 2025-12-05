# Remove Rich Text Tools Outside Admin Pages

## Problem
The rich text formatting features (Bold, Link, Preview, Ctrl+B, Ctrl+K) were appearing on textareas outside of admin pages, which was not desired. These features should only appear on admin pages.

## Solution Implemented

### 1. Updated Textarea Component Behavior
Modified the Textarea component (`components/ui/textarea.tsx`) to disable rich text tools by default:
- Rich text tools are now disabled by default unless explicitly enabled
- Added `enableRichTools` prop to explicitly enable rich text tools for admin pages
- Added `disableRichTools` prop to explicitly disable rich text tools (already existed)

### 2. Updated Admin Pages
Updated several admin pages to explicitly enable rich text tools using the `enableRichTools={true}` prop:
- `app/admin/pages-editor/page.tsx`
- `app/admin/content-management/page.tsx`
- `app/admin/content/editor/page.tsx`

### 3. Verified Non-Admin Pages
Confirmed that non-admin pages already disable rich text tools:
- `components/BuilderSignupForm.tsx` (already had `disableRichTools={true}`)
- Other builder components (already had `disableRichTools={true}`)

## Files Modified
1. `components/ui/textarea.tsx` - Updated default behavior to disable rich tools
2. `app/admin/pages-editor/page.tsx` - Added `enableRichTools={true}` to key Textarea components
3. `app/admin/content-management/page.tsx` - Added `enableRichTools={true}` to key Textarea components
4. `app/admin/content/editor/page.tsx` - Added `enableRichTools={true}` to key Textarea components

## Result
- Rich text tools (Bold, Link, Preview, Ctrl+B, Ctrl+K) are now only visible on admin pages
- All textareas outside of admin pages have rich text tools disabled by default
- Admin pages continue to have full rich text editing capabilities