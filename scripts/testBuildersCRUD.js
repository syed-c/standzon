const { getAllBuilders, createBuilder, updateBuilder, deleteBuilder } = require('../lib/supabase/builders');

async function testBuildersCRUD() {
  console.log('=== Testing Builders CRUD Operations ===\n');
  
  try {
    // Test 1: Get all builders
    console.log('1. Fetching all builders...');
    const builders = await getAllBuilders();
    console.log(`   Found ${builders.length} builders`);
    
    if (builders.length > 0) {
      console.log(`   Sample builder: ${builders[0].company_name} (${builders[0].id})`);
    }
    
    // Test 2: Create a new builder (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n2. Creating a test builder...');
      const testBuilder = {
        company_name: 'Test Builder Co',
        slug: 'test-builder-co',
        primary_email: 'test@example.com',
        phone: '+1234567890',
        website: 'https://testbuilder.com',
        headquarters_city: 'Test City',
        headquarters_country: 'Test Country',
        contact_person: 'Test Person',
        position: 'Test Position',
        company_description: 'This is a test builder for development purposes',
        team_size: 10,
        projects_completed: 5,
        rating: 4.5,
        verified: true,
        premium_member: false
      };
      
      const createdBuilder = await createBuilder(testBuilder);
      console.log(`   Created builder: ${createdBuilder.company_name} (${createdBuilder.id})`);
      
      // Test 3: Update the builder
      console.log('\n3. Updating the test builder...');
      const updates = {
        team_size: 15,
        projects_completed: 8,
        rating: 4.8
      };
      
      const updatedBuilder = await updateBuilder(createdBuilder.id, updates);
      console.log(`   Updated builder: ${updatedBuilder.team_size} team members, ${updatedBuilder.projects_completed} projects`);
      
      // Test 4: Delete the builder
      console.log('\n4. Deleting the test builder...');
      await deleteBuilder(createdBuilder.id);
      console.log('   Test builder deleted successfully');
    } else {
      console.log('\n2-4. Skipping create/update/delete tests in production environment');
    }
    
    console.log('\n=== All tests completed successfully ===');
    
  } catch (error) {
    console.error('Error during tests:', error);
    process.exit(1);
  }
}

// Run the tests
testBuildersCRUD();