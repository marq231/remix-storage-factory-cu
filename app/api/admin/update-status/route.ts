import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check admin session
    const cookieStore = await cookies()
    const adminSession = cookieStore.get("admin_session")
    
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, type, status } = body

    if (!id || !type || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    let table: string
    switch (type) {
      case "eligibility":
        table = "grant_eligibility"
        break
      case "grant":
        table = "grant_applications"
        break
      case "loan":
        table = "loan_applications"
        break
      default:
        return NextResponse.json(
          { error: "Invalid type" },
          { status: 400 }
        )
    }

    const { error } = await supabase
      .from(table)
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to update status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status}`,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
