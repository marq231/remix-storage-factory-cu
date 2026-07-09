import { createClient } from "@/lib/supabase/server"
import { getCountryIdentification } from "@/lib/country-identification"
import { NextRequest, NextResponse } from "next/server"

function generateApplicationCode(): string {
  // Generate a 6-digit number (100000-999999)
  const number = Math.floor(100000 + Math.random() * 900000)
  return `NF-${number}`
}

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

    // Generate unique application code
    const applicationCode = generateApplicationCode()

    const supabase = await createClient()

    // Insert eligibility check as a grant application with eligibility_check flag
    // Using grants_applications table which we know exists
    const { error } = await supabase
      .from("grants_applications")
      .insert({
        application_code: applicationCode,
        full_name: fullName,
        country: country,
        phone: phone,
        email: email,
        status: "pending",
        is_eligibility_check: true,  // Flag to indicate this is just an eligibility check
      })

    if (error) {
      console.error("[v0] Grant eligibility database error:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      })
      return NextResponse.json(
        { error: "Failed to submit application. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      applicationCode: applicationCode,
      message: "Eligibility check submitted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Server error in eligibility:", error?.message || error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
