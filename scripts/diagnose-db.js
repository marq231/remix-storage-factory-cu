import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("[DIAGNOSIS] Missing environment variables");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "SET" : "MISSING");
  console.error("SUPABASE_SERVICE_ROLE_KEY:", serviceRoleKey ? "SET" : "MISSING");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function diagnose() {
  console.log("\n========== DATABASE DIAGNOSIS ==========\n");

  // Check 1: Can we connect to the database?
  console.log("1. Testing database connection...");
  try {
    const { data: testData, error: testError } = await supabase
      .from("grant_eligibility")
      .select("count(*)", { count: "exact", head: true });

    if (testError) {
      console.error("❌ Database connection failed:", testError.message);
      process.exit(1);
    }
    console.log("✓ Database connection successful");
  } catch (e) {
    console.error("❌ Exception connecting to database:", e.message);
    process.exit(1);
  }

  // Check 2: How many records are in grant_eligibility?
  console.log("\n2. Checking grant_eligibility table...");
  try {
    const { data, error, count } = await supabase
      .from("grant_eligibility")
      .select("*", { count: "exact" });

    if (error) {
      console.error("❌ Error querying table:", error.message);
      return;
    }
    console.log(`✓ Total records in grant_eligibility: ${count}`);
    console.log(`  Last 5 records:`);
    data.slice(-5).forEach((record, i) => {
      console.log(`  ${i + 1}. Code: ${record.application_code} | Name: ${record.full_name} | Status: ${record.status}`);
    });
  } catch (e) {
    console.error("❌ Exception querying table:", e.message);
  }

  // Check 3: Check specific codes that should exist
  console.log("\n3. Checking specific application codes...");
  const codesToCheck = ["NF-188878", "NF-749819", "NF-625728"];
  
  for (const code of codesToCheck) {
    try {
      const { data, error } = await supabase
        .from("grant_eligibility")
        .select("*")
        .eq("application_code", code)
        .single();

      if (error) {
        console.log(`  ❌ ${code}: NOT FOUND (${error.message})`);
      } else if (!data) {
        console.log(`  ❌ ${code}: NOT FOUND (no data returned)`);
      } else {
        console.log(`  ✓ ${code}: FOUND - Name: ${data.full_name}`);
      }
    } catch (e) {
      console.log(`  ❌ ${code}: ERROR - ${e.message}`);
    }
  }

  // Check 4: Check if there are any RLS policy issues
  console.log("\n4. Checking table structure...");
  try {
    const { data, error } = await supabase
      .from("grant_eligibility")
      .select("*")
      .limit(1);

    if (error && error.code === "PGRST116") {
      console.log("❌ RLS policies might be blocking queries");
    } else if (error) {
      console.log(`❌ Error: ${error.message}`);
    } else {
      console.log("✓ Table structure appears normal");
    }
  } catch (e) {
    console.log(`❌ Exception: ${e.message}`);
  }

  // Check 5: Test insert and read
  console.log("\n5. Testing insert and read cycle...");
  const testCode = `NF-${Math.floor(Math.random() * 900000 + 100000)}`;
  
  try {
    // Insert
    const { error: insertError } = await supabase
      .from("grant_eligibility")
      .insert({
        application_code: testCode,
        full_name: "TEST DIAGNOSTIC USER",
        ssn: "000000000",
        phone: "0000000000",
        email: "diagnostic@test.com",
        status: "pending",
      });

    if (insertError) {
      console.log(`❌ Insert failed: ${insertError.message} (code: ${insertError.code})`);
      return;
    }
    console.log(`✓ Insert successful: ${testCode}`);

    // Read back
    const { data, error: readError } = await supabase
      .from("grant_eligibility")
      .select("*")
      .eq("application_code", testCode)
      .single();

    if (readError) {
      console.log(`❌ Read failed: ${readError.message}`);
    } else if (!data) {
      console.log(`❌ Read returned no data for ${testCode}`);
    } else {
      console.log(`✓ Read successful: ${data.full_name}`);
    }
  } catch (e) {
    console.log(`❌ Exception in insert/read test: ${e.message}`);
  }

  console.log("\n========== DIAGNOSIS COMPLETE ==========\n");
}

diagnose().catch(console.error);
