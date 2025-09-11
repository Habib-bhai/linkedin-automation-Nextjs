import type React from "react"
import type { Metadata } from "next"
// import { Analytics } from "@vercel/analytics/next"
// import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"
import { LinkedInAccountsProvider } from "@/lib/linkedinAccountsStore"
import { LeadsProvider } from "@/lib/leadsStore"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { WorkflowProvider } from "@/lib/workflowStore"
import { WorkflowRunnerProvider } from "@/lib/workflowRunnerContext"

export const metadata: Metadata = {
  title: "GTM LinkedIn Automation",
  description: "AI-powered LinkedIn automation platform with workflow builder",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <LinkedInAccountsProvider>
          <LeadsProvider>
            <WorkflowRunnerProvider>


              <Suspense fallback={null}>

                <main className="p-6">{children}</main>

              </Suspense>
            </WorkflowRunnerProvider>
          </LeadsProvider>
        </LinkedInAccountsProvider>
      </body>
    </html>
  )
}
