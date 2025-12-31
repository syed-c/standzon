# Refactoring Checklist - Route Separation & Multi-Tenant Theming

## Phase 1: Structure & Organization ✅ COMPLETED

### Route Groups Created
- [x] Create `/app/(admin)/` route group
- [x] Create `/app/(builder)/` route group
- [x] Create `/app/(public)/` route group
- [x] Create `/app/(auth)/` route group

### Component Directories Created
- [x] Create `/components/admin/` directory
- [x] Create `/components/builder/` directory
- [x] Create `/components/public/` directory
- [x] Create `/components/shared/` directory

### Layouts Created
- [x] Create `/app/(admin)/layout.tsx` with theme provider
- [x] Create `/app/(builder)/layout.tsx` with theme provider
- [x] Create `/app/(public)/layout.tsx` with theme provider
- [x] Create `/app/(auth)/layout.tsx` for auth flows

### Theme Infrastructure
- [x] Create `/app/theme-provider.tsx` global theme provider
- [x] Implement admin theme (blue colors)
- [x] Implement builder theme (green colors)
- [x] Implement public theme (blue colors)
- [x] Add brand color customization support

### OTP Flow Abstractions
- [x] Create `/app/(auth)/flows/use-otp-generation.ts`
- [x] Create `/app/(auth)/flows/use-otp-verification.ts`
- [x] Create `/app/(auth)/flows/use-registration.ts`
- [x] Create `/app/(auth)/flows/use-login.ts`

### Component Reorganization
- [x] Move admin components to `/components/admin/` (32 files)
- [x] Move builder components to `/components/builder/` (8 files)
- [x] Move public components to `/components/public/` (13 files)
- [x] Move shared components to `/components/shared/` (11 files)

### Route Organization
- [x] Copy admin routes to `/app/(admin)/`
- [x] Copy builder routes to `/app/(builder)/`
- [x] Copy auth routes to `/app/(auth)/`
- [x] Copy public routes to `/app/(public)/`
  - [x] locations/
  - [x] exhibition-stands/
  - [x] builders/
  - [x] trade-shows/
  - [x] services/
  - [x] about/
  - [x] contact/
  - [x] legal/
  - [x] exhibitions/
  - [x] booth-rental/
  - [x] custom-booth/
  - [x] companies/
  - [x] blog/
  - [x] quote/
  - [x] 3d-rendering-and-concept-development/
  - [x] trade-show-graphics-printing/
  - [x] trade-show-installation-and-dismantle/
  - [x] trade-show-project-management/

### Documentation
- [x] Create REFACTORING_REPORT.md with full details
- [x] Create REFACTORING_SUMMARY.md with overview
- [x] Document all moved files
- [x] Document theme infrastructure

---

## Phase 2: Import Updates & Migration ⏳ PENDING

### Update Component Imports
- [ ] Update imports in `/app/(admin)/*` pages to use `/components/admin/*`
- [ ] Update imports in `/app/(builder)/*` pages to use `/components/builder/*`
- [ ] Update imports in `/app/(public)/*` pages to use `/components/public/*`
- [ ] Update imports in `/app/(auth)/*` pages to use `/components/shared/*`

### Update Auth Flow Usage
- [ ] Update `/app/(auth)/login/page.tsx` to use `useLogin` hook
- [ ] Update `/app/(auth)/register/page.tsx` to use `useRegistration` hook
- [ ] Update OTP usage to use `useOTPGeneration` and `useOTPVerification` hooks
- [ ] Refactor `AuthPage.tsx` to use new flow hooks
- [ ] Test all auth flows with new hooks

### Type Checking
- [ ] Run TypeScript type checking: `npm run type-check`
- [ ] Fix any import path errors
- [ ] Fix any missing type definitions
- [ ] Ensure no circular dependencies

### Build Verification
- [ ] Run build: `npm run build`
- [ ] Fix any build errors
- [ ] Verify all routes compile successfully
- [ ] Check for runtime errors

### Remove Old Directories (AFTER VERIFICATION)
- [ ] Remove `/app/admin/` directory
- [ ] Remove `/app/builder/` directory
- [ ] Remove `/app/auth/` directory
- [ ] Remove `/app/locations/` directory
- [ ] Remove `/app/exhibition-stands/` directory
- [ ] Remove `/app/builders/` directory
- [ ] Remove `/app/trade-shows/` directory
- [ ] Remove `/app/services/` directory
- [ ] Remove `/app/about/` directory
- [ ] Remove `/app/contact/` directory
- [ ] Remove `/app/legal/` directory
- [ ] Remove `/app/exhibitions/` directory
- [ ] Remove `/app/booth-rental/` directory
- [ ] Remove `/app/custom-booth/` directory
- [ ] Remove `/app/companies/` directory
- [ ] Remove `/app/blog/` directory
- [ ] Remove `/app/quote/` directory
- [ ] Remove `/app/3d-rendering-and-concept-development/` directory
- [ ] Remove `/app/trade-show-graphics-printing/` directory
- [ ] Remove `/app/trade-show-installation-and-dismantle/` directory
- [ ] Remove `/app/trade-show-project-management/` directory

---

## Phase 3: Server Component Conversion ⏳ PENDING

### Public Pages
- [ ] Convert `/app/(public)/locations/[country]/page.tsx` to Server Component
- [ ] Convert `/app/(public)/locations/[country]/[city]/page.tsx` to Server Component
- [ ] Convert `/app/(public)/exhibition-stands/*/page.tsx` to Server Component
- [ ] Convert `/app/(public)/builders/page.tsx` to Server Component
- [ ] Convert `/app/(public)/builders/[slug]/page.tsx` to Server Component
- [ ] Convert `/app/(public)/trade-shows/*/page.tsx` to Server Component
- [ ] Convert `/app/(public)/services/page.tsx` to Server Component
- [ ] Convert `/app/(public)/about/page.tsx` to Server Component
- [ ] Convert `/app/(public)/contact/page.tsx` to Server Component

### Admin Pages (Read-Only)
- [ ] Identify read-only admin dashboard pages
- [ ] Convert read-only pages to Server Components
- [ ] Keep interactive pages as Client Components

### Builder Pages (Read-Only)
- [ ] Identify read-only builder dashboard pages
- [ ] Convert read-only pages to Server Components
- [ ] Keep interactive pages as Client Components

### Data Fetching
- [ ] Ensure public pages use server-side data fetching
- [ ] Add proper caching headers
- [ ] Optimize database queries for server components
- [ ] Implement revalidation strategies where needed

---

## Phase 4: Enhanced Features ⏳ PENDING

### Access Control
- [ ] Add role-based access control in admin layout
- [ ] Add builder verification in builder layout
- [ ] Protect admin routes at the layout level
- [ ] Protect builder routes at the layout level

### Navigation Components
- [ ] Create admin navigation component
- [ ] Create builder navigation component
- [ ] Create public navigation component
- [ ] Integrate navigation into respective layouts

### Error Boundaries
- [ ] Add error boundary for admin routes
- [ ] Add error boundary for builder routes
- [ ] Add error boundary for public routes
- [ ] Add error boundary for auth routes

### Enhanced Theming
- [ ] Add more theme variants
- [ ] Implement theme switching
- [ ] Add dark mode support per theme
- [ ] Create theme documentation

---

## Testing Checklist ⏳ PENDING

### Functionality Tests
- [ ] Admin routes load correctly
- [ ] Builder routes load correctly
- [ ] Public routes load correctly
- [ ] Auth routes load correctly
- [ ] Login flow works with new hooks
- [ ] Register flow works with new hooks
- [ ] OTP generation works
- [ ] OTP verification works

### Navigation Tests
- [ ] All route paths still work
- [ ] No broken links
- [ ] Redirects work correctly
- [ ] Dynamic routes work correctly

### Theme Tests
- [ ] Admin theme loads correctly
- [ ] Builder theme loads correctly
- [ ] Public theme loads correctly
- [ ] Brand colors apply correctly
- [ ] Theme switching works (if implemented)

### Performance Tests
- [ ] Build time is acceptable
- [ ] Page load times are acceptable
- [ ] Server components improve performance
- [ ] Bundle size is optimized

### SEO Tests
- [ ] Public pages have correct metadata
- [ ] Server-side rendering works
- [ ] Robots meta tags present
- [ ] Sitemap generation works

---

## Acceptance Criteria

### Must Have ✅ / ⏳
- [x] No circular imports between domains
- [x] Auth screens and OTP flows isolated under (auth)
- [x] Public content routes organized under (public)
- [x] Components separated by domain
- [x] Theme boundaries created
- [ ] Route groups compile without type errors
- [ ] App still builds successfully
- [ ] All routes accessible
- [ ] All imports updated
- [ ] Old directories removed

### Should Have
- [ ] Public pages use Server Components
- [ ] Public pages fetch data server-side and cache correctly
- [ ] Performance improvements visible
- [ ] Code is easier to maintain
- [ ] Multi-tenant theming possible

### Nice to Have
- [ ] Dark mode support
- [ ] Theme switcher
- [ ] Comprehensive documentation
- [ ] Migration guide for developers
- [ ] Automated tests for refactored code

---

## Known Issues

### Pending Resolution
1. **Import paths need updating** - All component imports reference old locations
2. **Old directories still exist** - Need to verify before removing
3. **Type checking not yet run** - May reveal issues
4. **Build not yet tested** - May reveal issues

### Potential Issues
1. **Auth flow integration** - New hooks need to be integrated with existing auth pages
2. **Component dependencies** - Some components may have cross-domain dependencies
3. **Server component conversion** - May require significant refactoring of some pages

---

## Migration Guide for Developers

### Import Path Changes

**Before:**
```typescript
import { AdminBuilderManager } from '@/components/AdminBuilderManager';
import { BuilderDashboard } from '@/components/BuilderDashboard';
import { CountryCityPage } from '@/components/CountryCityPage';
import { AuthPage } from '@/components/AuthPage';
```

**After:**
```typescript
import { AdminBuilderManager } from '@/components/admin/AdminBuilderManager';
import { BuilderDashboard } from '@/components/builder/BuilderDashboard';
import { CountryCityPage } from '@/components/public/CountryCityPage';
import { AuthPage } from '@/components/shared/AuthPage';
```

### Auth Flow Usage

**Before (direct API calls in component):**
```typescript
const handleOTPRequest = async () => {
  const response = await fetch("/api/auth/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "generate", email, userType }),
  });
  // handle response...
};
```

**After (using flow hooks):**
```typescript
const { generateOTP, isLoading, error } = useOTPGeneration();

const handleOTPRequest = async () => {
  const result = await generateOTP({ email, userType });
  if (result.success) {
    // success handling
  } else {
    // error handling
  }
};
```

### Theme Usage

**Using default theme:**
```typescript
<ThemeProvider theme="admin">
  <AdminDashboard />
</ThemeProvider>
```

**Using custom brand colors:**
```typescript
<ThemeProvider 
  theme="admin" 
  brandColors={{
    primary: "#FF0000",
    secondary: "#00FF00",
    accent: "#0000FF"
  }}
>
  <AdminDashboard />
</ThemeProvider>
```

---

## Progress Summary

### Overall Progress: 35% Complete

- **Phase 1**: 100% ✅
- **Phase 2**: 0% ⏳
- **Phase 3**: 0% ⏳
- **Phase 4**: 0% ⏳

### Next Immediate Actions

1. Start Phase 2 by updating component imports
2. Test auth flows with new hooks
3. Run type checking and fix errors
4. Verify build succeeds
5. Remove old directories

### Estimated Time Remaining

- **Phase 2**: 4-6 hours
- **Phase 3**: 6-8 hours (if converting all public pages)
- **Phase 4**: 4-6 hours
- **Testing**: 2-4 hours

**Total**: 16-24 hours of work remaining
