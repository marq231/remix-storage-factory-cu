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

    // For eligibility checks, we return results without saving to database
    // The eligibility check is just an informational tool
    // Users can submit a full grant application later if they're eligible
    const checkCode = `EC-${Math.floor(100000 + Math.random() * 900000)}`

    return NextResponse.json({
      success: true,
      checkCode: checkCode,
      country: country,
      fullName: fullName,
      email: email,
      message: "Eligibility check completed successfully. You may now proceed with a full grant application.",
    })
  } catch (error: any) {
    console.error("[v0] Server error in eligibility:", error?.message || error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
