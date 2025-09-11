"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Copy, Trash2, MessageSquare, Sparkles, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const messageTemplates = [
  {
    id: 1,
    name: "Tech Leader Connection",
    type: "connection_request",
    subject: "",
    preview:
      "Hi {{firstName}}, I noticed your work at {{company}} in the {{industry}} space. Would love to connect and share insights about scaling engineering teams.",
    aiEnabled: true,
    personalizationTokens: ["firstName", "company", "industry"],
    usageCount: 45,
    successRate: 28.5,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Follow-up After Connection",
    type: "follow_up",
    subject: "",
    preview:
      "Thanks for connecting, {{firstName}}! I saw your recent post about {{recentPost}}. Our platform helps companies like {{company}} achieve similar results.",
    aiEnabled: true,
    personalizationTokens: ["firstName", "recentPost", "company"],
    usageCount: 32,
    successRate: 22.1,
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    name: "SaaS Decision Maker Outreach",
    type: "inmail",
    subject: "Quick question about {{company}}'s growth strategy",
    preview:
      "Hi {{firstName}}, I've been following {{company}}'s impressive growth in the {{industry}} sector. I have a quick question about your current challenges with...",
    aiEnabled: false,
    personalizationTokens: ["firstName", "company", "industry"],
    usageCount: 18,
    successRate: 15.7,
    createdAt: "2024-01-08",
  },
  {
    id: 4,
    name: "Second Follow-up",
    type: "follow_up",
    subject: "",
    preview:
      "Hi {{firstName}}, following up on my previous message about helping {{company}} with {{painPoint}}. Would you be open to a brief 15-minute call this week?",
    aiEnabled: true,
    personalizationTokens: ["firstName", "company", "painPoint"],
    usageCount: 28,
    successRate: 18.9,
    createdAt: "2024-01-10",
  },
]

const typeColors = {
  connection_request: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  follow_up: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inmail: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

const typeLabels = {
  connection_request: "Connection Request",
  follow_up: "Follow-up Message",
  inmail: "InMail",
}

export function MessageTemplatesList() {
  return (
    <div className="space-y-4">
      {messageTemplates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline" className={typeColors[template.type as keyof typeof typeColors]}>
                    {typeLabels[template.type as keyof typeof typeLabels]}
                  </Badge>
                  {template.aiEnabled && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Enhanced
                    </Badge>
                  )}
                </div>
                {template.subject && <CardDescription>Subject: {template.subject}</CardDescription>}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Message Preview */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Message Preview</h4>
                <div className="p-3 bg-muted rounded-lg text-sm">{template.preview}</div>
              </div>

              {/* Personalization Tokens */}
              {template.personalizationTokens.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Personalization Tokens</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.personalizationTokens.map((token) => (
                      <Badge key={token} variant="outline" className="text-xs">
                        {`{{${token}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Template Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{template.usageCount}</div>
                    <div className="text-xs text-muted-foreground">Times Used</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <div className="text-sm font-medium">{template.successRate}%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Created</div>
                    <div className="text-sm font-medium">{template.createdAt}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {template.aiEnabled ? <Sparkles className="h-4 w-4 text-purple-600" /> : <div className="h-4 w-4" />}
                  <div>
                    <div className="text-xs text-muted-foreground">AI Status</div>
                    <div className="text-sm font-medium">{template.aiEnabled ? "Enabled" : "Disabled"}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
