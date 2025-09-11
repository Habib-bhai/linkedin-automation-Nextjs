"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Info, Settings, Linkedin } from "lucide-react"

// Dummy data for LinkedIn accounts
const linkedinAccounts = [
  {
    id: 1,
    name: "Habib Ullah",
    email: "habib@example.com",
    status: "Available",
    avatar: "/placeholder.svg?height=32&width=32",
    limits: {
      connections: { current: 0, max: 25, period: "day" },
      messages: { current: 0, max: 40, period: "day" },
      inmails: { current: 0, max: 40, period: "day" },
    },
    connectedAt: "2025-01-15",
  },
]

export default function LinkedInAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAccounts = linkedinAccounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || account.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">LinkedIn Accounts</h1>
      </div>

      {/* Info Banner */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The LinkedIn accounts are called senders when put in a campaign. Connect multiple LinkedIn sending accounts on
          one campaign to increase your daily sending volume.
        </AlertDescription>
      </Alert>

      {/* Unlimited seats notice */}
      <div className="flex justify-end">
        <span className="text-sm text-green-600 font-medium">Unlimited seats available</span>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search senders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Purchase seats</Button>
          <Button>
            <Linkedin className="h-4 w-4 mr-2" />
            Connect account
          </Button>
        </div>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-6 font-medium">LinkedIn Account</th>
                  <th className="text-left py-4 px-6 font-medium">Status</th>
                  <th className="text-left py-4 px-6 font-medium">Sending limits</th>
                  <th className="text-right py-4 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="border-b last:border-b-0 hover:bg-muted/25">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={account.avatar || "/placeholder.svg"}
                          alt={account.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-muted-foreground">{account.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        ✓ {account.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">🔗</span>
                          <span>
                            {account.limits.connections.max}/{account.limits.connections.period}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">✉️</span>
                          <span>
                            {account.limits.messages.max}/{account.limits.messages.period}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">📧</span>
                          <span>
                            {account.limits.inmails.max}/{account.limits.inmails.period}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure limits
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No LinkedIn accounts found. Connect your first account to get started.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing 1-{filteredAccounts.length} of {filteredAccounts.length}
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
