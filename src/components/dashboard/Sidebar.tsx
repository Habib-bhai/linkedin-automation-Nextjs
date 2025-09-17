"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  MessageSquare,
  Linkedin,
  Users,
  Network,
  Target,
  Inbox as Unbox,
  Database,
  Search,
  TrendingUp,
  Settings,
  Construction,
  ToolCaseIcon,
  ChevronLeft,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "LinkedIn", href: "/dashboard/linkedin-accounts", icon: Linkedin },
  { name: "Accounts", href: "/dashboard/accounts", icon: User },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: Network },
  { name: "Logs", href: "/dashboard/workflowLogs", icon: Construction },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Target },
  { name: "Workflows", href: "/dashboard/workflows", icon:  ToolCaseIcon},
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-[#eef9ff] border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-12 items-center justify-end px-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <p className="h-[1px] w-full bg-gray-300 "></p>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Button
                  key={item.name}
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-700 hover:bg-gray-100 h-10",
                    collapsed && "px-2",
                    isActive && "bg-blue-100 text-blue-600 hover:bg-blue-100",
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className={cn("h-4 w-4", isActive && "text-blue-600")} />
                    {!collapsed && <span className="ml-3 text-sm">{item.name}</span>}
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
