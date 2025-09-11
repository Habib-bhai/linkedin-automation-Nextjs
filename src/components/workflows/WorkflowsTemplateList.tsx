"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Copy, Trash2, Eye, Users, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const workflowTemplates = [
  {
    id: 1,
    name: "Connection + Follow-up",
    description: "Send connection request, then follow-up message after acceptance",
    category: "Basic",
    steps: 3,
    estimatedDuration: "5 days",
    usageCount: 12,
    isPublic: false,
    createdAt: "2024-01-15",
    steps_detail: ["Connection Request", "Wait 2 days", "Follow-up Message"],
  },
  {
    id: 2,
    name: "Multi-touch Sequence",
    description: "Connection request with 3 follow-up messages over 2 weeks",
    category: "Advanced",
    steps: 7,
    estimatedDuration: "14 days",
    usageCount: 8,
    isPublic: false,
    createdAt: "2024-01-10",
    steps_detail: [
      "Connection Request",
      "Wait 3 days",
      "Message 1",
      "Wait 5 days",
      "Message 2",
      "Wait 7 days",
      "Message 3",
    ],
  },
  {
    id: 3,
    name: "Profile View + Connect",
    description: "View profile first, then send connection request",
    category: "Warm Outreach",
    steps: 4,
    estimatedDuration: "4 days",
    usageCount: 15,
    isPublic: true,
    createdAt: "2024-01-05",
    steps_detail: ["View Profile", "Wait 1 day", "Connection Request", "Wait 3 days", "Follow-up Message"],
  },
  {
    id: 4,
    name: "InMail Sequence",
    description: "Premium InMail outreach with follow-up messages",
    category: "Premium",
    steps: 5,
    estimatedDuration: "10 days",
    usageCount: 3,
    isPublic: false,
    createdAt: "2024-01-20",
    steps_detail: ["InMail Message", "Wait 5 days", "Follow-up InMail", "Wait 5 days", "Final Follow-up"],
  },
]

const categoryColors = {
  Basic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "Warm Outreach": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Premium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
}

export function WorkflowTemplatesList() {
  return (
    <div className="space-y-4">
      {workflowTemplates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline" className={categoryColors[template.category as keyof typeof categoryColors]}>
                    {template.category}
                  </Badge>
                  {template.isPublic && <Badge variant="secondary">Public</Badge>}
                </div>
                <CardDescription>{template.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
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
              {/* Workflow Steps */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Workflow Steps</h4>
                <div className="flex flex-wrap gap-2">
                  {template.steps_detail.map((step, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {index + 1}. {step}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Template Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">{template.steps}</div>
                  <div className="text-xs text-muted-foreground">Steps</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium">{template.estimatedDuration}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium">{template.usageCount} campaigns</div>
                </div>
                <div className="text-sm text-muted-foreground">Created {template.createdAt}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
