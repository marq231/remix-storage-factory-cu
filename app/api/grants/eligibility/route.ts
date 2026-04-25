import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

function generateApplicationCode(): string {
  // Generate a 6-digit number (100000-999999)
  const number = Math.floor(100000 + Math.random() * 900000)
  return `NF-${number}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, ssn, phone, email } = body

    // Validate required fields
    if (!fullName || !ssn || !phone || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    // Insert eligibility application
    const { error } = await supabase
      .from("grant_eligibility")
      .insert({
        application_code: applicationCode,
        full_name: fullName,
        ssn: ssn,
        phone: phone,
        email: email,
        status: "pending",
      })

    if (error) {
      console.error("Database error:", error)
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
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
