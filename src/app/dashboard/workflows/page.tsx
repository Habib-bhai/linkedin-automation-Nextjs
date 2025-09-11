import { WorkflowTemplatesList } from "@/components/workflows/WorkflowsTemplateList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Workflow Templates</h1>
          <p className="text-muted-foreground">Create and manage reusable workflow templates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      <WorkflowTemplatesList />
    </div>
  )
}
