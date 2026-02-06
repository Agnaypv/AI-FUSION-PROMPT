"use client"

import { useAuth } from "@/lib/nexus/auth-context"
import { RightNowDashboard } from "@/components/nexus/right-now-dashboard"
import { FacultyDashboard } from "@/components/nexus/faculty-dashboard"

/**
 * Main dashboard page -- role-aware routing.
 * Faculty sees FacultyDashboard, students see RightNowDashboard.
 * Admin sees the student dashboard (has full access via nav).
 * Auth is handled globally -- this page NEVER redirects to login.
 */
export default function HomePage() {
  const { user } = useAuth()

  if (user?.role === "faculty") {
    return <FacultyDashboard />
  }

  return <RightNowDashboard />
}
