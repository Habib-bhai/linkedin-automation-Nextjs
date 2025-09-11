import { SettingsForm } from "@/components/settings/SettingsForm"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>
      <SettingsForm />
    </div>
  )
}
