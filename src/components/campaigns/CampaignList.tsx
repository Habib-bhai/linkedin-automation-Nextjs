"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Users, MessageSquare, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useWorkflowRunner } from "@/lib/workflowRunnerContext"

interface CampaignsListProps {
  searchQuery?: string
  statusFilter?: string
  senderFilter?: string
}

export function CampaignsList({ searchQuery = "", statusFilter = "all", senderFilter = "all" }: CampaignsListProps) {
  const {
    campaigns,
    runs,
    deleteCampaign,
  } = useWorkflowRunner()

  // simple derived performance/progress from runs (demo)
  const campaignRows = campaigns.map((c) => {
    const campaignRuns = runs.filter((r) => r.campaignId === c.id)
    const latestRun = campaignRuns[0]
    const perf = {
      connections: 0,
      messages: 0,
      replies: 0,
    }
    const progress = {
      total: 0,
      inProgress: 0,
      completed: campaignRuns.filter((r) => r.status === "completed").length,
    }
    return { campaign: c, latestRun, perf, progress }
  })

  const filtered = campaignRows.filter(({ campaign }) => {
    const matchesSearch = campaign.name?.toLowerCase().includes(searchQuery.toLowerCase() ?? "") ?? true
    const matchesStatus = statusFilter === "all" || (campaign.meta?.status ?? "draft") === statusFilter
    const matchesSender = senderFilter === "all" || (campaign.meta?.sender ?? "").toLowerCase().includes(senderFilter.toLowerCase() ?? "")
    return matchesSearch && matchesStatus && matchesSender
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "draft":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-6 font-medium">Status</th>
                  <th className="text-left py-4 px-6 font-medium">Name</th>
                  <th className="text-left py-4 px-6 font-medium">Performance</th>
                  <th className="text-left py-4 px-6 font-medium">Progress</th>
                  <th className="text-left py-4 px-6 font-medium">Senders</th>
                  <th className="text-right py-4 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ campaign, latestRun, perf, progress }) => (
                  <tr key={campaign.id} className="border-b last:border-b-0 hover:bg-muted/25">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusDot((campaign.meta?.status as string) || "draft")}`}></div>
                        <span className="capitalize font-medium">{(campaign.meta?.status as string) || "draft"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <Link href={`/dashboard/campaigns/${campaign.id}`} className="font-medium hover:underline">
                          {campaign.name || campaign.id}
                        </Link>
                        <div className="text-sm text-muted-foreground">{new Date(campaign.createdAt).toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{perf.connections}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-3 w-3 text-muted-foreground" />
                          <span>{perf.messages}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          <span>{perf.replies}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{progress.total}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                          <span>{progress.inProgress}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                          <span>{progress.completed}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <img
                        src={campaign.meta?.sender?.avatar || "/placeholder.svg"}
                        alt={campaign.meta?.sender?.name || "Sender"}
                        className="w-8 h-8 rounded-full"
                      />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/dashboard/campaigns/${campaign.id}`}>View details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/dashboard/campaigns/${campaign.id}/edit`}>Edit campaign</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              if (confirm("Delete campaign? This will remove its runs/logs from local state.")) {
                                deleteCampaign(campaign.id);
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No campaigns found. Create your first campaign to get started.
            </div>
          )}

          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing 1-{filtered.length} of {filtered.length}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
