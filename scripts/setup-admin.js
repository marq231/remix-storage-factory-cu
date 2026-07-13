#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Simple SHA-256 hash function (matching the backend)
function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

async function setupAdmin() {
  try {
    const adminEmail = 'admin@nextfundus.com';
    const adminPassword = 'Admin@123456'; // Default password - CHANGE THIS IN PRODUCTION
    const passwordHash = hashPassword(adminPassword);

    // Check if admin already exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', adminEmail)
      .single();

    if (existing) {
      console.log('Admin user already exists');
      return;
    }

    // Insert new admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        email: adminEmail,
        password_hash: passwordHash,
      })
      .select();

    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }

    console.log('Admin user created successfully!');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPassword);
    console.log('\n⚠️  IMPORTANT: Change the password immediately after first login!');
  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

setupAdmin();
