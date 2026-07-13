import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      loanTier,
      loanAmount,
      interestRate,
      fullName,
      homeAddress,
      state,
      city,
      country,
      idNumber,
      bankField1,
      bankField2,
      dateOfBirth,
      phone,
      email,
      isImmigrant,
      maritalStatus,
      annualIncome,
      reasonForLoan,
      collateral,
      idType,
      idDocumentUrl,
    } = body

    // Validate required fields
    if (!loanTier || !loanAmount || !fullName || !homeAddress || !city || !country || !dateOfBirth || !phone || !email || !maritalStatus || !annualIncome || !reasonForLoan || !collateral || !idType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate country-specific requirements
    if (country === "US" && !state) {
      return NextResponse.json(
        { error: "State is required for US applicants" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Parse annual income (remove currency formatting)
    const parsedIncome = typeof annualIncome === 'string' 
      ? parseFloat(annualIncome.replace(/[^0-9.]/g, ""))
      : annualIncome

    // Insert loan application
    const { error } = await supabase
      .from("loan_applications")
      .insert({
        loan_tier: loanTier,
        loan_amount: loanAmount,
        interest_rate: interestRate,
        full_name: fullName,
        home_address: homeAddress,
        state: state,
        city: city,
        country: country || "US",
        id_number: idNumber,
        bank_field1: bankField1,
        bank_field2: bankField2,
        date_of_birth: dateOfBirth,
        phone: phone,
        email: email,
        is_immigrant: isImmigrant === "yes",
        marital_status: maritalStatus,
        annual_income: parsedIncome,
        reason_for_loan: reasonForLoan,
        collateral: collateral,
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
      message: "Loan application submitted successfully",
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
