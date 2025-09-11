"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Target,
  Users,
  BarChart3,
  Workflow,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  Construction
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Target },
  { name: "Leads", href: "/dashboard/leads", icon: Database },
  { name: "Accounts", href: "/dashboard/linkedin-accounts", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Workflows", href: "/dashboard/workflows", icon: Workflow },
  { name: "Logs", href: "/dashboard/workflowLogs", icon: Construction },
  { name: "Templates", href: "/dashboard/templates", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && <h2 className="text-lg font-semibold text-sidebar-foreground">GTM LinkedIn</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Button
                  key={item.name}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                    collapsed && "px-2",
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}
