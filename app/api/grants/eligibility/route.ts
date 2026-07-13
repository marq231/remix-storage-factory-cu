import { createServiceClient } from "@/lib/supabase/server"
import { getCountryIdentification } from "@/lib/country-identification"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, country, idNumber, ssn, bankField1, bankField2, phone, email } = body

    // Validate required fields
    if (!fullName || !phone || !email || !country) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Get country-specific identification requirements
    const countryInfo = getCountryIdentification(country)
    if (!countryInfo) {
      return NextResponse.json(
        { error: "Invalid country selected" },
        { status: 400 }
      )
    }

    // For US, idNumber contains the SSN
    const finalSsn = country === "US" ? idNumber : ssn

    // Validate country-specific identifiers
    if (country === "US" && !finalSsn) {
      return NextResponse.json(
        { error: "SSN is required for US residents" },
        { status: 400 }
      )
    }

    // Validate international applicants have required bank fields
    if (country !== "US" && !bankField1) {
      return NextResponse.json(
        { error: `${countryInfo.bankField1?.label} is required for ${countryInfo.name} residents` },
        { status: 400 }
      )
    }

    // If country requires a second bank field, validate it
    if (country !== "US" && countryInfo.bankField2 && !bankField2) {
      return NextResponse.json(
        { error: `${countryInfo.bankField2?.label} is required for ${countryInfo.name} residents` },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Generate unique application code with retry logic
    const supabase = createServiceClient()
    const ssnForDb = idNumber || finalSsn || "0000000000"
    
    let applicationCode = ""
    let dbError = null
    let maxRetries = 5
    let attempt = 0

    while (attempt < maxRetries) {
      applicationCode = `NF-${Math.floor(100000 + Math.random() * 900000)}`
      
      const { error } = await supabase
        .from("grant_eligibility")
        .insert({
          application_code: applicationCode,
          full_name: fullName,
          country: countryInfo.name,
          ssn: ssnForDb,
          phone: phone,
          email: email,
          status: "pending",
        })

      if (!error) {
        // Success - break out of retry loop
        console.log("[v0] ELIGIBILITY SAVED SUCCESSFULLY:", {
          applicationCode: applicationCode,
          fullName: fullName,
          email: email,
          attempt: attempt + 1,
        })
        dbError = null
        break
      } else if (error.code === "23505") {
        // Unique constraint violation - try again with new code
        console.warn("[v0] Duplicate code generated, retrying:", {
          code: applicationCode,
          attempt: attempt + 1,
        })
        attempt++
      } else {
        // Other database error - log and break
        console.error("[v0] ELIGIBILITY DATABASE ERROR - CRITICAL:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        dbError = error
        break
      }
    }

    if (attempt >= maxRetries) {
      console.error("[v0] ELIGIBILITY MAX RETRIES EXCEEDED:", {
        maxRetries: maxRetries,
        applicant: fullName,
      })
      return NextResponse.json(
        { error: "Failed to generate unique application code. Please try again." },
        { status: 500 }
      )
    }

    if (dbError) {
      console.error("[v0] ELIGIBILITY SAVE FAILED - RETURNING ERROR:", {
        message: dbError.message,
        code: dbError.code,
        details: dbError.details,
        hint: dbError.hint,
        fullError: JSON.stringify(dbError),
      })
      return NextResponse.json(
        { 
          error: "Failed to save eligibility application to database",
          details: dbError.message,
          code: dbError.code
        },
        { status: 500 }
      )
    }

    // Return success with eligibility check results
    return NextResponse.json({
      success: true,
      apiVersion: "intl-country-fix-v2",
      applicationCode: applicationCode,
      country: country,
      fullName: fullName,
      email: email,
      message: "Eligibility check completed successfully! Your application code is: " + applicationCode + ". You may now proceed with a full grant application using this code.",
    })
  } catch (error: any) {
    console.error("[v0] Server error in eligibility:", error?.message || error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
