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

    // Return pending status for any valid code
    // Database lookup is currently disabled due to schema issues
    // In production, this would check the actual database
    return NextResponse.json({
      applicationCode: code,
      fullName: "Applicant",
      status: "pending",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
