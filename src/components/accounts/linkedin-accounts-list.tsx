"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Settings, Trash2, Activity, Clock, Shield, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const accounts = [
  {
    id: 1,
    email: "john@company.com",
    name: "John Smith",
    username: "johnsmith",
    profileImage: "/professional-headshot.png",
    status: "healthy",
    dailyLimits: {
      messages: { used: 12, limit: 20 },
      connections: { used: 5, limit: 15 },
      profileViews: { used: 23, limit: 50 },
    },
    activeCampaigns: 3,
    totalLeads: 456,
    lastActivity: "2 hours ago",
    workingHours: "Mon-Fri 9AM-5PM PST",
  },
  {
    id: 2,
    email: "sarah@company.com",
    name: "Sarah Johnson",
    username: "sarahjohnson",
    profileImage: "/professional-woman-headshot.png",
    status: "warning",
    dailyLimits: {
      messages: { used: 18, limit: 20 },
      connections: { used: 14, limit: 15 },
      profileViews: { used: 47, limit: 50 },
    },
    activeCampaigns: 2,
    totalLeads: 234,
    lastActivity: "1 hour ago",
    workingHours: "Mon-Fri 8AM-6PM EST",
  },
  {
    id: 3,
    email: "mike@company.com",
    name: "Mike Chen",
    username: "mikechen",
    profileImage: "/professional-asian-man-headshot.png",
    status: "restricted",
    dailyLimits: {
      messages: { used: 0, limit: 10 },
      connections: { used: 0, limit: 5 },
      profileViews: { used: 0, limit: 25 },
    },
    activeCampaigns: 0,
    totalLeads: 89,
    lastActivity: "2 days ago",
    workingHours: "Mon-Fri 10AM-4PM PST",
  },
]

export function LinkedInAccountsList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "restricted":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <Shield className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "restricted":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={account.profileImage || "/placeholder.svg"} alt={account.name} />
                  <AvatarFallback>
                    {account.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <CardDescription>
                    @{account.username} • {account.email}
                  </CardDescription>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(account.status)}
                    <Badge
                      variant={
                        account.status === "healthy"
                          ? "default"
                          : account.status === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {account.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Daily Usage */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Daily Usage</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Messages</span>
                      <span>
                        {account.dailyLimits.messages.used}/{account.dailyLimits.messages.limit}
                      </span>
                    </div>
                    <Progress
                      value={(account.dailyLimits.messages.used / account.dailyLimits.messages.limit) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connections</span>
                      <span>
                        {account.dailyLimits.connections.used}/{account.dailyLimits.connections.limit}
                      </span>
                    </div>
                    <Progress
                      value={(account.dailyLimits.connections.used / account.dailyLimits.connections.limit) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Views</span>
                      <span>
                        {account.dailyLimits.profileViews.used}/{account.dailyLimits.profileViews.limit}
                      </span>
                    </div>
                    <Progress
                      value={(account.dailyLimits.profileViews.used / account.dailyLimits.profileViews.limit) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{account.activeCampaigns}</div>
                  <div className="text-xs text-muted-foreground">Active Campaigns</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{account.totalLeads}</div>
                  <div className="text-xs text-muted-foreground">Total Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {account.lastActivity}
                  </div>
                  <div className="text-xs text-muted-foreground">Last Activity</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{account.workingHours}</div>
                  <div className="text-xs text-muted-foreground">Working Hours</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
