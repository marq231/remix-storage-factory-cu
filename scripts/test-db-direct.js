import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ ERROR: Missing environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓ Set' : '✗ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testDatabase() {
  console.log('\n===== DATABASE TEST SCRIPT =====\n');

  // Test 1: Insert a test record
  console.log('TEST 1: INSERT TEST RECORD');
  const testCode = `NF-${Math.floor(100000 + Math.random() * 900000)}`;
  const testName = `Test_${Date.now()}`;
  
  console.log(`Attempting to insert:`);
  console.log(`  Code: ${testCode}`);
  console.log(`  Name: ${testName}`);

  const { data: insertData, error: insertError } = await supabase
    .from('grant_eligibility')
    .insert({
      application_code: testCode,
      full_name: testName,
      ssn: '123456789',
      phone: '5551234567',
      email: 'test@example.com',
      status: 'pending',
    })
    .select();

  if (insertError) {
    console.error(`❌ INSERT FAILED:`);
    console.error(`  Error: ${insertError.message}`);
    console.error(`  Code: ${insertError.code}`);
    console.error(`  Details: ${insertError.details}`);
    console.error(`  Hint: ${insertError.hint}`);
  } else {
    console.log(`✓ INSERT SUCCESS`);
    console.log(`  Inserted: ${JSON.stringify(insertData, null, 2)}`);
  }

  // Test 2: Query the record back
  console.log('\nTEST 2: QUERY TEST RECORD');
  console.log(`Attempting to query code: ${testCode}`);

  const { data: queryData, error: queryError } = await supabase
    .from('grant_eligibility')
    .select('application_code, full_name, status')
    .eq('application_code', testCode)
    .single();

  if (queryError) {
    console.error(`❌ QUERY FAILED:`);
    console.error(`  Error: ${queryError.message}`);
    console.error(`  Code: ${queryError.code}`);
  } else if (!queryData) {
    console.error(`❌ QUERY RETURNED NO DATA`);
    console.error(`  The record was not found in the database`);
  } else {
    console.log(`✓ QUERY SUCCESS`);
    console.log(`  Retrieved: ${JSON.stringify(queryData, null, 2)}`);
  }

  // Test 3: Check table schema
  console.log('\nTEST 3: CHECK TABLE SCHEMA');
  const { data: schemaData, error: schemaError } = await supabase
    .from('grant_eligibility')
    .select('*')
    .limit(1);

  if (schemaError) {
    console.error(`❌ SCHEMA CHECK FAILED:`);
    console.error(`  Error: ${schemaError.message}`);
  } else {
    console.log(`✓ TABLE EXISTS AND IS ACCESSIBLE`);
    if (schemaData && schemaData.length > 0) {
      console.log(`  Sample record columns:`, Object.keys(schemaData[0]));
    }
  }

  // Test 4: Count total records
  console.log('\nTEST 4: COUNT TOTAL RECORDS');
  const { count, error: countError } = await supabase
    .from('grant_eligibility')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error(`❌ COUNT FAILED:`);
    console.error(`  Error: ${countError.message}`);
  } else {
    console.log(`✓ TOTAL RECORDS: ${count}`);
  }

  console.log('\n===== TEST COMPLETE =====\n');
}

testDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
