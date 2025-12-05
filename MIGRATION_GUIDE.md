# Supabase Migration Guide

This guide will help you migrate all your data from the current multi-database setup (Convex, Prisma/SQLite, and file-based storage) to Supabase as the single source of truth.

## Overview

Your application currently uses:
- **Convex** for real-time data and authentication
- **Prisma/SQLite** for structured data
- **File-based storage** for persistent data

We're migrating everything to **Supabase** for a unified, scalable database solution.

## Prerequisites

1. **Supabase Project Setup**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Get your project URL and API keys

2. **Environment Variables**
   Add these to your `.env.local` file:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Keep existing Convex URL for migration
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```

3. **Install Dependencies**
   ```bash
   npm install ts-node @types/node
   ```

## Migration Steps

### Step 1: Run Database Schema Migration

First, apply the Supabase schema:

```bash
# Apply the migration to your Supabase project
# You can do this through the Supabase dashboard or CLI
```

The schema file is located at `supabase/migrations/001_initial_schema.sql` and includes all tables from your existing data models.

### Step 2: Run Data Migration

Execute the comprehensive migration script:

```bash
npm run migrate:supabase
```

This will:
- ✅ Migrate all Convex data to Supabase
- ✅ Migrate all Prisma/SQLite data to Supabase  
- ✅ Migrate all file-based storage data to Supabase
- ✅ Update relationships and references
- ✅ Generate a detailed migration report

### Step 3: Update Application Code

After migration, update your application to use the new Supabase database:

1. **Replace Database Imports**
   ```typescript
   // Old imports
   import { api } from "convex/_generated/api";
   import { useQuery } from "convex/react";
   import { prisma } from "./lib/database/client";
   
   // New imports
   import { db } from "./lib/supabase/database";
   ```

2. **Update Data Fetching**
   ```typescript
   // Old Convex queries
   const builders = useQuery(api.builders.getAll);
   
   // New Supabase queries
   const builders = await db.getBuilders();
   ```

3. **Update API Routes**
   ```typescript
   // Old Prisma usage
   const users = await prisma.user.findMany();
   
   // New Supabase usage
   const users = await db.getUsers();
   ```

### Step 4: Remove Old Dependencies

After confirming everything works with Supabase:

1. **Remove Convex**
   ```bash
   npm uninstall convex @convex-dev/auth
   ```

2. **Remove Prisma**
   ```bash
   npm uninstall @prisma/client prisma
   ```

3. **Remove File Storage Dependencies**
   ```bash
   npm uninstall sqlite3
   ```

4. **Clean Up Files**
   - Remove `convex/` directory
   - Remove `prisma/` directory  
   - Remove `lib/database/` directory
   - Remove `data/` directory (after backing up)

## Migration Details

### Data Sources Migrated

#### 1. Convex Data
- **Users** → `users` table
- **Countries** → `countries` table
- **Cities** → `cities` table
- **Builders** → `builder_profiles` table
- **Exhibitions** → `exhibitions` table
- **Site Settings** → `site_settings` table
- **Quote Requests** → `quote_requests` table

#### 2. Prisma Data
- **Users** → `users` table
- **Builder Profiles** → `builder_profiles` table
- **Leads** → `leads` table
- **Quotes** → `quotes` table
- **Quote Items** → `quote_items` table
- **Lead Notes** → `lead_notes` table
- **Subscriptions** → `subscriptions` table
- **Reviews** → `reviews` table
- **Notifications** → `notifications` table

#### 3. File Storage Data
- **Page Contents** → `site_settings` table
- **Builder Data** → `builder_profiles` table
- **Other JSON Data** → `site_settings` table

### Database Schema

The new Supabase schema includes:

- **Core Tables**: `users`, `builder_profiles`, `countries`, `cities`
- **Business Logic**: `leads`, `quotes`, `exhibitions`, `trade_shows`
- **Content Management**: `site_settings`, `notifications`
- **Relationships**: Proper foreign keys and indexes

### Performance Optimizations

- **Indexes**: Created on frequently queried columns
- **Triggers**: Auto-update `updated_at` timestamps
- **Constraints**: Data integrity with foreign keys
- **Types**: Proper enum types for status fields

## Testing the Migration

### 1. Verify Data Integrity

```bash
# Check record counts
npm run migrate:supabase
```

The migration script will show a detailed report of migrated records.

### 2. Test Application Functionality

1. **User Authentication**
   - Login/logout functionality
   - User profile management

2. **Builder Directory**
   - Browse builders
   - Search and filter
   - Builder profiles

3. **Lead Management**
   - Create new leads
   - View lead dashboard
   - Update lead status

4. **Admin Functions**
   - Site settings
   - User management
   - Data administration

### 3. Performance Testing

- Test page load times
- Check database query performance
- Monitor memory usage

## Rollback Plan

If issues arise, you can rollback by:

1. **Restore Environment Variables**
   ```env
   # Re-enable old database connections
   ENABLE_PERSISTENCE=true
   ENABLE_BACKUPS=true
   ```

2. **Revert Code Changes**
   ```bash
   git checkout HEAD~1
   ```

3. **Restore Data**
   - Convex data is preserved in your Convex project
   - Prisma data is in your SQLite file
   - File data is in your `data/` directory

## Post-Migration Cleanup

After successful migration:

1. **Update Documentation**
   - Update API documentation
   - Update deployment guides
   - Update environment variable lists

2. **Remove Old Code**
   - Delete unused database files
   - Remove old import statements
   - Clean up unused dependencies

3. **Update Deployment**
   - Update environment variables in production
   - Update database connection strings
   - Test production deployment

## Support

If you encounter issues during migration:

1. **Check Migration Logs**
   - Review the migration report
   - Check for error messages
   - Verify data counts

2. **Common Issues**
   - Missing environment variables
   - Supabase permissions
   - Data type mismatches

3. **Get Help**
   - Check Supabase documentation
   - Review migration script logs
   - Contact support if needed

## Benefits of Supabase Migration

- **Unified Database**: Single source of truth
- **Better Performance**: Optimized queries and indexes
- **Scalability**: Handle more users and data
- **Real-time Features**: Built-in real-time subscriptions
- **Authentication**: Integrated auth system
- **Admin Interface**: Built-in database management
- **Backup & Recovery**: Automated backups
- **Security**: Row-level security policies

---

**Next Steps**: After completing the migration, your application will have a robust, scalable database foundation with Supabase as the single source of truth.
