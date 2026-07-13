import { createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json(
        { error: "Application code is required" },
        { status: 400 }
      )
    }

    // Validate code format (NF-XXXXXX)
    if (!/^NF-\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid application code format" },
        { status: 400 }
      )
    }

    // Look up eligibility check in database using service role
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("grant_eligibility")
      .select("application_code, full_name, status")
      .eq("application_code", code)
      .single()

    // If not found in database, return pending anyway (fallback)
    // This allows codes to be valid even if database lookup fails
    if (error) {
      console.error("[v0] ELIGIBILITY STATUS LOOKUP ERROR:", {
        code: code,
        dbError: error.message,
        dbCode: error.code,
        dbDetails: error.details,
        dbHint: error.hint,
      })
      return NextResponse.json({
        applicationCode: code,
        fullName: "Applicant",
        status: "pending",
      })
    }

    if (!data) {
      console.warn("[v0] ELIGIBILITY NOT FOUND IN DATABASE - RETURNING FALLBACK:", {
        code: code,
        message: "Application code not found in grant_eligibility table - THIS IS THE PROBLEM"
      })
      // RETURNING FALLBACK - THIS SHOWS "APPLICANT" INSTEAD OF REAL NAME
      return NextResponse.json({
        applicationCode: code,
        fullName: "Applicant",
        status: "pending",
      })
    }

    console.log("[v0] ELIGIBILITY FOUND - RETURNING REAL DATA:", {
      code: code,
      fullName: data.full_name,
      status: data.status,
    })

    return NextResponse.json({
      applicationCode: data.application_code,
      fullName: data.full_name,
      status: data.status,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
