import { CampaignsList } from "@/components/campaigns/CampaignList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Campaigns</h1>
          <p className="text-muted-foreground">Manage your LinkedIn automation campaigns</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>
      <CampaignsList />
    </div>
  )
}
