import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      <DashboardSidebar />
      <div className="ml-64 pt-16">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
