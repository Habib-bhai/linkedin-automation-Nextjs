import { DashboardOverview } from "@/components/dashboard/Overview"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your LinkedIn automation campaigns and performance</p>
      </div>
      <DashboardOverview />
    </div>
  )
}
