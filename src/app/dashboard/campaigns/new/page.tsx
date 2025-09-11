"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CampaignCreationWizard } from "@/components/campaigns/CampaignCreationWizard"

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/campaigns">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-balance">Create Campaign</h1>
      </div>
      <CampaignCreationWizard />
    </div>
  )
}
