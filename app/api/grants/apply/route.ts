import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      applicationCode,
      fullName,
      homeAddress,
      state,
      city,
      country,
      dateOfBirth,
      phone,
      email,
      isImmigrant,
      maritalStatus,
      annualIncome,
      reasonForGrant,
      idType,
      idDocumentUrl,
    } = body

    // Validate required fields
    if (!applicationCode || !fullName || !homeAddress || !state || !city || !dateOfBirth || !phone || !email || !maritalStatus || !annualIncome || !reasonForGrant || !idType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify eligibility was approved
    const { data: eligibility, error: eligibilityError } = await supabase
      .from("grant_eligibility")
      .select("status")
      .eq("application_code", applicationCode)
      .single()

    if (eligibilityError || !eligibility) {
      return NextResponse.json(
        { error: "Invalid application code" },
        { status: 400 }
      )
    }

    if (eligibility.status !== "approved") {
      return NextResponse.json(
        { error: "Your eligibility has not been approved" },
        { status: 400 }
      )
    }

    // Parse annual income (remove currency formatting)
    const parsedIncome = parseFloat(annualIncome.replace(/[^0-9.]/g, ""))

    // Insert grant application
    const { error } = await supabase
      .from("grant_applications")
      .insert({
        application_code: applicationCode,
        full_name: fullName,
        home_address: homeAddress,
        state: state,
        city: city,
        country: country || "United States",
        date_of_birth: dateOfBirth,
        phone: phone,
        email: email,
        is_immigrant: isImmigrant === "yes",
        marital_status: maritalStatus,
        annual_income: parsedIncome,
        reason_for_grant: reasonForGrant,
        id_type: idType,
        id_document_url: idDocumentUrl || null,
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
      message: "Grant application submitted successfully",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
