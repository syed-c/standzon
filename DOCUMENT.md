# Standszon – Project Documentation and Change Log

## Overview
This document captures the current architecture, key pages/components, and all edits performed in this session: unifying country pages, adding a shared banner, hardening APIs and persistence, admin UX and layout changes, a new Pages Editor (admin), and live content rendering hooks.

## Tech Stack and Structure (high level)
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Backend: Next.js API routes
- Data helpers: in-memory storage API with optional file persistence
- Real-time updates: On-demand revalidation and client event broadcast

Key directories:
- `app/` – Next routes (server + client pages)
- `components/` – Shared UI and feature components
- `lib/` – Data utilities and storage
- `app/api/` – API routes

## Major Features Added/Updated

### 1) Unified Country Pages to India-style Template
- Kept dynamic route: `app/exhibition-stands/[country]/page.tsx` using `components/CountryCityPage.tsx` and `components/EnhancedLocationPage.tsx`.
- Removed country-specific overrides so all routes share the same layout/design.
- Result: consistent design and content structure for all country pages.

Files touched earlier (removals):
- Removed multiple `app/exhibition-stands/<country>/page.tsx` overrides to fall back to dynamic `[country]` page.

### 2) Banner Unification
- New reusable banner component: `components/TradeStyleBanner.tsx`.
- Applied on:
  - `app/builders/page.tsx` via `components/BuildersDirectoryContent.tsx`
  - `app/exhibition-stands/page.tsx` via `components/ExhibitionStandsContent.tsx`
  - `app/custom-booth/page.tsx` via `components/CustomBoothPageContent.tsx`
  - `app/about/page.tsx` via `components/AboutPageContent.tsx`
  - `app/quote/page.tsx` via `components/QuoteRequestContent.tsx`

### 3) Admin UX Improvements
- Background unified to `#f9fafb`, consistent inner paddings and scrollable lists.
- Pages updated:
  - `app/admin/profile-claims/page.tsx`
  - `app/admin/leads/page.tsx`
  - `app/admin/global-pages/page.tsx`
  - `app/admin/settings/page.tsx`
- `components/GlobalPagesManager.tsx` – list card made scrollable: fixed height with `overflow-auto`.
- Admin Dashboard theming updates applied in `components/SuperAdminDashboard.tsx` (sidebar palette, card accents), matching the provided JSON theme.

### 4) Global Pages Manager Disabled and Hidden
- Page content replaced by a disabled notice: `app/admin/global-pages/page.tsx`.
- Link removed from nav logic to prevent discovery: `components/Navigation.tsx` (admin links filtered; no Global Pages entry).

### 5) Hardening Builders API and Persistence
- `app/api/admin/builders/route.ts`
  - Quieted verbose logs unless `VERBOSE_LOGS=true`.
  - Fallback to static builders if persistent storage empty or fails.
- `lib/database/persistenceAPI.ts`
  - Auto-backups disabled by default; only when `ENABLE_BACKUPS=true`.
  - Opt-in persistence with `ENABLE_PERSISTENCE=true`.

### 6) Page Content Save Flow and Error Prevention
- `lib/data/storage.ts`
  - `savePageContent` hardened (defensive checks) to avoid undefined access.
  - Storage interface `PageContent` expanded with `content.extra.sectionHeading`, `content.extra.personalizedHtml`, and later `content.extra.rawHtml`.
- `app/api/admin/global-pages/route.ts` (existing admin API)
  - PUT `action=update-content`: normalizes payload; stores content + seo + design.

### 7) Real-time Updates and Revalidation
- New route: `app/api/revalidate/route.ts` (POST)
  - Accepts `{ path | paths[] }`, calls `revalidatePath` for on-demand ISR.
- `components/GlobalPagesManager.tsx`
  - After save: triggers POST `/api/revalidate`, dispatches browser event `global-pages:updated` with `{ pageId }`.
- `components/CountryCityPage.tsx`
  - Listens to `global-pages:updated` to refetch saved content for the current page without manual reload.

### 8) Infinite Loop Fix in Location Pages
- `components/EnhancedLocationPage.tsx`
  - Stabilized sort effect dependency via `useMemo` key.
  - Guarded state updates to avoid unnecessary setState loops.

### 9) Button Styling – Remove White Backgrounds Globally
- Explicit white button backgrounds replaced with transparent in key components.
- Global CSS rules added to strip white backgrounds and preserve hover states:
  - `app/globals.css`: rules to override `bg-white` on buttons to transparent + hover states.

### 10) Country Page SEO Content Section
- Inserted an SEO-friendly section between “Verified Builders” grid and the bottom CTA.
- File: `components/EnhancedLocationPage.tsx` (new section with guidance content).

### 11) Admin – Pages Editor (New)
A new admin tool to list pages, view, edit SEO, H1, and editable “Detected Page Content” blocks. Persists changes and revalidates live pages.

- UI: `app/admin/pages-editor/page.tsx`
  - Lists pages (static + those detected in storage).
  - View and Edit actions.
  - Edit modal fields:
    - SEO: Meta Title, Meta Description, Meta Keywords
    - H1 (main heading)
    - Detected Page Content (editable): block list with tag type (H1/H2/H3/H4/P/LI) and text.
  - On Save: serializes edited content to HTML and sends to API.
  - Load priority: tries saved content first (via API), falls back to scraping the live page if nothing saved.

- API: `app/api/admin/pages-editor/route.ts`
  - `GET?action=list` – returns pages: static list + any pages from storage (country/city).
  - `GET?action=get-content&path=/...` – returns saved `PageContent` for the given path (loads from file then from in-memory storage).
  - `PUT` with body `{ action:'update', path, seo, h1, contentHtml }`:
    - Derives `pageId` from `path`.
    - Loads existing from storage (if any) or bootstraps a new `PageContent` object.
    - Updates SEO, H1, and stores `contentHtml` to `content.introduction` AND `content.extra.rawHtml`.
    - Saves to in-memory storage and to disk at `data/page-contents.json`.
    - Calls `revalidatePath(path)`.

- Persistence for Editor
  - The API writes `data/page-contents.json` and reads from it to survive serverless restarts.

### 12) Live Rendering of Saved Content
- Country pages: `components/CountryCityPage.tsx`
  - Renders saved HTML from `content.extra.personalizedHtml` or `content.extra.rawHtml` or `content.introduction`.
- About page: `components/AboutPageContent.tsx`
  - Fetches `/api/admin/pages-editor?action=get-content&path=/about` and renders saved HTML (same priority order) within the Mission section.

## Important Files and Responsibilities
- `app/exhibition-stands/[country]/page.tsx` – Dynamic country page shell; forwards to `CountryCityPage`.
- `components/CountryCityPage.tsx` – Main country (and city) page component; loads saved content and builders, listens for updates.
- `components/EnhancedLocationPage.tsx` – Country/city layout and sections; includes SEO info section and verified builders grid.
- `components/TradeStyleBanner.tsx` – Reusable hero banner used on multiple pages.
- `components/GlobalPagesManager.tsx` – Legacy manager (now disabled in admin route), still supports save hooks for country/city content.
- `app/api/revalidate/route.ts` – Revalidation endpoint.
- `lib/data/storage.ts` – In-memory storage for builders and page content; expanded `PageContent` typing.
- `app/api/admin/pages-editor/route.ts` – New: list/get/update page content (disk + memory), revalidate path.
- `app/admin/pages-editor/page.tsx` – New: Admin UI for listing pages and editing SEO, H1, and content blocks.
- `components/AboutPageContent.tsx` – Now reads saved content for /about from the Pages Editor API.

## Environment Variables (recommended)
- `VERBOSE_LOGS=false` – Silence logs by default.
- `ENABLE_BACKUPS=false` – Disable hourly backups by default.
- `ENABLE_PERSISTENCE=false` (or true only if file-based persistence is desired in other subsystems).

Pages Editor writes to `data/page-contents.json` regardless, to ensure edits persist.

## How to Use the Pages Editor
1. Open `/admin/pages-editor`.
2. Find a page (e.g., `/about`) and click Edit.
3. Update SEO fields, H1, and edit the content blocks in “Detected Page Content (Editable)”.
4. Save. The API updates storage and writes to `data/page-contents.json`, then revalidates the path.
5. Refresh the public page to see changes.

For country pages, updates also propagate via `global-pages:updated` events when using the legacy Global Pages Manager.

## Known Behaviors and Notes
- Dynamic content rendering requires pages to read from storage/API:
  - Country pages and About page are wired; other static pages can be wired similarly (ask to enable specific pages).
- If running on a platform without persistent filesystem, `data/page-contents.json` may not survive deployments; keep this in mind for production (use a real DB or KV store if needed).
- Revalidation works via `/api/revalidate` and direct `revalidatePath` calls in APIs.

## Summary of Key Changes by File
- Added: `components/TradeStyleBanner.tsx`
- Edited banner usage in:
  - `components/BuildersDirectoryContent.tsx`
  - `components/ExhibitionStandsContent.tsx`
  - `components/CustomBoothPageContent.tsx`
  - `components/AboutPageContent.tsx`
  - `components/QuoteRequestContent.tsx`
- Admin theming and spacing in `app/admin/*/page.tsx` and `components/SuperAdminDashboard.tsx`.
- Disabled Global Pages Manager route: `app/admin/global-pages/page.tsx`, removed link in `components/Navigation.tsx`.
- Hardened storage and admin global pages API: `lib/data/storage.ts`, `app/api/admin/global-pages/route.ts`.
- New revalidation API: `app/api/revalidate/route.ts`.
- Country/city loop and sorting fixes: `components/EnhancedLocationPage.tsx`.
- Global CSS overrides for white buttons: `app/globals.css`.
- SEO section inserted before CTA in `components/EnhancedLocationPage.tsx`.
- New Pages Editor admin:
  - `app/admin/pages-editor/page.tsx`
  - `app/api/admin/pages-editor/route.ts`
  - Reads/writes `data/page-contents.json` and in-memory storage.
- About page now renders saved content: `components/AboutPageContent.tsx`.

## Next Steps (optional)
- Wire more pages (e.g., `/builders`, `/exhibition-stands`, `/custom-booth`, `/quote`) to also consume saved HTML from the Pages Editor.
- Replace file-based persistence with a durable store (Convex/Prisma/db/KV) for production.
- Add preview mode in Pages Editor to open a temporary preview URL/tab before saving.
