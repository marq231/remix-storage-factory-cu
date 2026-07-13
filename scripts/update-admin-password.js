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

function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

async function updateAdminPassword() {
  try {
    const adminEmail = 'admin@nextfundus.com';
    const adminPassword = 'Admin@123456';
    const passwordHash = hashPassword(adminPassword);

    console.log('Updating admin password...');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPassword);
    console.log('Hash: ' + passwordHash);

    // Update admin user password
    const { data, error } = await supabase
      .from('admin_users')
      .update({
        password_hash: passwordHash,
      })
      .eq('email', adminEmail)
      .select();

    if (error) {
      console.error('Error updating admin password:', error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.error('Admin user not found');
      process.exit(1);
    }

    console.log('Admin password updated successfully!');
    console.log('You can now login with:');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPassword);
  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

updateAdminPassword();
