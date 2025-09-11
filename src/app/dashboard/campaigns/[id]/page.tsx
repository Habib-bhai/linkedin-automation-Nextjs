import { CampaignDetails } from "@/components/campaigns/CampaignDetails"

export default function CampaignDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="space-y-6">
      <CampaignDetails campaignId={params.id} />
    </div>
  )
}
