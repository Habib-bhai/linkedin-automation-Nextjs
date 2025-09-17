"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Target, MessageSquare, TrendingUp, Download } from "lucide-react"
import { useState } from "react"

const overallStats = [
  {
    title: "Total Leads",
    value: "3,247",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Campaigns",
    value: "12",
    change: "+3",
    icon: Target,
    color: "text-green-600",
  },
  {
    title: "Messages Sent",
    value: "1,856",
    change: "+18.2%",
    icon: MessageSquare,
    color: "text-purple-600",
  },
  {
    title: "Avg Connection Rate",
    value: "26.8%",
    change: "+4.1%",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

const campaignPerformance = [
  {
    id: 1,
    name: "Tech Leads Q4",
    leads: 245,
    connectionRate: 24.5,
    replyRate: 18.2,
    status: "active",
  },
  {
    id: 2,
    name: "SaaS Decision Makers",
    leads: 156,
    connectionRate: 31.2,
    replyRate: 22.1,
    status: "active",
  },
  {
    id: 3,
    name: "Startup Founders",
    leads: 89,
    connectionRate: 28.9,
    replyRate: 15.7,
    status: "paused",
  },
  {
    id: 4,
    name: "Enterprise CTOs",
    leads: 234,
    connectionRate: 19.8,
    replyRate: 12.4,
    status: "active",
  },
]

const weeklyData = [
  { week: "Week 1", connections: 45, messages: 89, replies: 12 },
  { week: "Week 2", connections: 52, messages: 94, replies: 18 },
  { week: "Week 3", connections: 38, messages: 76, replies: 15 },
  { week: "Week 4", connections: 61, messages: 112, replies: 24 },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overallStats.map((stat) => (
          <Card key={stat.title} className="bg-[#eef9ff]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Campaign Performance */}
        <Card className="bg-[#eef9ff]">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Connection and reply rates by campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignPerformance.map((campaign) => (
                <div key={campaign.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium">{campaign.name}</h4>
                      <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{campaign.leads} leads</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connection Rate:</span>
                      <span className="font-medium">{campaign.connectionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reply Rate:</span>
                      <span className="font-medium">{campaign.replyRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card className="bg-[#eef9ff]">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Connections, messages, and replies over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((week, index) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{week.week}</h4>
                    <div className="text-xs text-muted-foreground">{week.replies} replies</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                      <div className="font-medium text-blue-700 dark:text-blue-300">{week.connections}</div>
                      <div className="text-blue-600 dark:text-blue-400">Connections</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 dark:bg-purple-950 rounded">
                      <div className="font-medium text-purple-700 dark:text-purple-300">{week.messages}</div>
                      <div className="text-purple-600 dark:text-purple-400">Messages</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded">
                      <div className="font-medium text-green-700 dark:text-green-300">{week.replies}</div>
                      <div className="text-green-600 dark:text-green-400">Replies</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Account Health Overview</CardTitle>
          <CardDescription>Monitor the health and usage of your LinkedIn accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-muted-foreground">Healthy Accounts</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-muted-foreground">Accounts with Warnings</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-muted-foreground">Restricted Accounts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
