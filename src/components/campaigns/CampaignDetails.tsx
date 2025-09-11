"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Edit, BarChart3, Users, MessageSquare, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface CampaignDetailsProps {
  campaignId: string
}

// Mock data - in real app this would come from API
const campaignData = {
  id: 1,
  name: "Tech Leads Q4 2024",
  description: "Targeting CTOs and VPs of Engineering at mid-size tech companies",
  status: "active",
  progress: 68,
  totalLeads: 245,
  inSequence: 89,
  pending: 67,
  paused: 12,
  failed: 8,
  finished: 69,
  connectionsSent: 156,
  connectionsAccepted: 38,
  messagesSent: 89,
  repliesReceived: 18,
  connectionRate: 24.4,
  replyRate: 20.2,
  linkedinAccount: "john@company.com",
  createdAt: "2024-01-15",
  startedAt: "2024-01-16",
}

const recentLeads = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "VP Engineering",
    company: "TechCorp",
    status: "replied",
    currentStep: "Follow-up Message",
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    name: "Mike Chen",
    title: "CTO",
    company: "StartupXYZ",
    status: "connected",
    currentStep: "Connection Accepted",
    lastActivity: "4 hours ago",
  },
  {
    id: 3,
    name: "Emily Davis",
    title: "Engineering Director",
    company: "BigTech Inc",
    status: "pending",
    currentStep: "Connection Request",
    lastActivity: "1 day ago",
  },
]

export function CampaignDetails({ campaignId }: CampaignDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-balance">{campaignData.name}</h1>
          <p className="text-muted-foreground">{campaignData.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={campaignData.status === "active" ? "default" : "secondary"}>{campaignData.status}</Badge>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm">
            {campaignData.status === "active" ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignData.totalLeads}</div>
            <p className="text-xs text-muted-foreground">{campaignData.inSequence} in sequence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignData.connectionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {campaignData.connectionsAccepted}/{campaignData.connectionsSent} accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reply Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignData.replyRate}%</div>
            <p className="text-xs text-muted-foreground">{campaignData.repliesReceived} replies received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignData.progress}%</div>
            <Progress value={campaignData.progress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Lead Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Status</CardTitle>
                <CardDescription>Current status of all leads in this campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">In Sequence</span>
                    </div>
                    <span className="text-sm font-medium">{campaignData.inSequence}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="text-sm font-medium">{campaignData.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm">Paused</span>
                    </div>
                    <span className="text-sm font-medium">{campaignData.paused}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Finished</span>
                    </div>
                    <span className="text-sm font-medium">{campaignData.finished}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Failed</span>
                    </div>
                    <span className="text-sm font-medium">{campaignData.failed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {lead.status === "replied" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {lead.status === "connected" && <CheckCircle className="h-4 w-4 text-blue-600" />}
                        {lead.status === "pending" && <Clock className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.title} at {lead.company}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lead.currentStep} • {lead.lastActivity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Leads</CardTitle>
              <CardDescription>All leads in this campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Leads management interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Detailed performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics charts and metrics would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Workflow</CardTitle>
              <CardDescription>View and edit the automation workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Workflow builder would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
