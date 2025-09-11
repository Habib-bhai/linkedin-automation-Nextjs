import { LinkedInAccountsList } from "@/components/accounts/linkedin-accounts-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">LinkedIn Accounts</h1>
          <p className="text-muted-foreground">Manage your connected LinkedIn accounts</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>
      <LinkedInAccountsList />
    </div>
  )
}
