import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder"

export default function WorkflowBuilderPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="h-screen">
      <WorkflowBuilder campaignId={params.id} />
    </div>
  )
}
