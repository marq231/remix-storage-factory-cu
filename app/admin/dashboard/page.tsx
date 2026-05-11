import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/dashboard"

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get("admin_session")
  const adminId = cookieStore.get("admin_id")

  if (!adminSession || !adminId) {
    redirect("/admin")
  }

  const supabase = await createClient()

  // Fetch all applications
  const [
    { data: grantEligibility },
    { data: grantApplications },
    { data: loanApplications },
  ] = await Promise.all([
    supabase
      .from("grant_eligibility")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("grant_applications")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("loan_applications")
      .select("*")
      .order("created_at", { ascending: false }),
  ])

  return (
    <AdminDashboard
      grantEligibility={grantEligibility || []}
      grantApplications={grantApplications || []}
      loanApplications={loanApplications || []}
    />
  )
}
