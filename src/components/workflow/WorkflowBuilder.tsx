"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw, Settings, Plus } from "lucide-react"

interface WorkflowBuilderProps {
  campaignId: string
}

export function WorkflowBuilder({ campaignId }: WorkflowBuilderProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-2xl font-bold">Workflow Builder</h1>
          <p className="text-muted-foreground">Design your LinkedIn automation sequence</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Workflow
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Node Palette */}
        <div className="w-64 border-r bg-muted/30 p-4">
          <h3 className="font-medium mb-4">Workflow Nodes</h3>
          <div className="space-y-2">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Connection Request</p>
                    <p className="text-xs text-muted-foreground">Send connection</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Send Message</p>
                    <p className="text-xs text-muted-foreground">Follow-up message</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Delay</p>
                    <p className="text-xs text-muted-foreground">Wait period</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Conditional</p>
                    <p className="text-xs text-muted-foreground">If/then logic</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Profile View</p>
                    <p className="text-xs text-muted-foreground">View profile</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative bg-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Start Building Your Workflow</h3>
                <p className="text-muted-foreground">Drag nodes from the sidebar to create your automation sequence</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Node
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l bg-muted/30 p-4">
          <h3 className="font-medium mb-4">Node Properties</h3>
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Select a node to edit its properties</p>
          </div>
        </div>
      </div>
    </div>
  )
}
