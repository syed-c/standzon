const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDubaiContent() {
  try {
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('id', 'united-arab-emirates-dubai')
      .single();
    
    if (error) {
      console.log('Error fetching data:', error);
      return;
    }
    
    if (!data) {
      console.log('No data found for united-arab-emirates-dubai');
      return;
    }
    
    console.log('Content structure:');
    console.log(JSON.stringify(data.content, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkDubaiContent();