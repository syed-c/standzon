# Supabase Migration Instructions

## Step 1: Run the SQL Migration

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `scripts/create-missing-tables.sql`
5. Click **Run** to execute the migration

## Step 2: Verify Tables Created

After running the migration, you should see these tables in your database:
- `builder_services`
- `leads` 
- `builder_subscriptions`

## Step 3: Test the Dashboard

1. Go to `http://localhost:3000/builder/dashboard`
2. The dashboard should now load without "Builder profile not found" error
3. You should see the builder's information displayed

## Step 4: Add Sample Data (Optional)

If you want to test the dashboard with sample data, you can run these SQL commands:

```sql
-- Add a sample service
INSERT INTO builder_services (builder_id, name, description, price_range, locations)
VALUES ('77836f44-6832-4866-81f2-74c84303aa7c', 'Exhibition Stand Design', 'Custom exhibition stand design and build', '$5,000 - $15,000', ARRAY['New York', 'Los Angeles']);

-- Add a sample lead
INSERT INTO leads (builder_id, name, email, phone, company, project_details, budget, timeline, location, source, status)
VALUES ('77836f44-6832-4866-81f2-74c84303aa7c', 'John Smith', 'john@example.com', '+1234567890', 'Tech Corp', 'Need exhibition stand for tech conference', '$10,000 - $15,000', '2 months', 'New York, USA', 'form', 'pending');

-- Add a sample subscription
INSERT INTO builder_subscriptions (builder_id, plan, status, start_date, end_date)
VALUES ('77836f44-6832-4866-81f2-74c84303aa7c', 'professional', 'active', NOW(), NOW() + INTERVAL '1 year');
```

## Troubleshooting

If you still see "Builder profile not found":
1. Check that the builder ID `77836f44-6832-4866-81f2-74c84303aa7c` exists in your `builder_profiles` table
2. Verify the builder has the required fields populated
3. Check the browser console for any API errors
