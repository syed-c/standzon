# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `exhibitbay` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Keep existing Convex URL for migration
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

## Step 4: Apply Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the schema

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your project
supabase link --project-ref your-project-id

# Apply migrations
supabase db push
```

## Step 5: Run Data Migration

Once your schema is set up and environment variables are configured:

```bash
npm run migrate:supabase
```

This will migrate all your existing data to Supabase.

## Step 6: Verify Migration

After running the migration:

1. Check your Supabase dashboard → **Table Editor**
2. Verify that all tables have been created
3. Check that data has been migrated correctly
4. Test your application to ensure everything works

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure your `.env.local` file has the correct variables
   - Restart your development server after adding environment variables

2. **"Permission denied" errors**
   - Make sure you're using the `service_role` key, not the `anon` key
   - Check that your Supabase project is active

3. **"Table doesn't exist" errors**
   - Make sure you've applied the database schema first
   - Check that the migration script ran successfully

4. **"Connection failed" errors**
   - Verify your Supabase URL is correct
   - Check your internet connection
   - Ensure your Supabase project is not paused

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the migration logs for specific error messages
- Contact support if you need assistance

## Next Steps

After successful migration:

1. **Update your application code** to use the new Supabase database
2. **Test all functionality** to ensure everything works
3. **Remove old database connections** when ready
4. **Deploy your updated application**

---

**Note**: Keep your old database connections active until you've fully tested the migration and are confident everything works with Supabase.
