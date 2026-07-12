#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    // Read the RLS migration file
    const rlsSQL = fs.readFileSync(path.join(__dirname, '002_enable_rls.sql'), 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('execute_sql', {
      query: rlsSQL
    }).catch(() => {
      // If execute_sql doesn't exist, try with a direct query using the internal connection
      return supabase.query(rlsSQL);
    });

    if (error) {
      console.error('Migration error:', error);
      process.exit(1);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error.message);
    process.exit(1);
  }
}

runMigration();
