import { MessageTemplatesList } from "@/components/templates/MessageTemplateLists"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Message Templates</h1>
          <p className="text-muted-foreground">Create and manage your message templates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      <MessageTemplatesList />
    </div>
  )
}
