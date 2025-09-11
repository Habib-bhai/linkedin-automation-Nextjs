import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Analytics</h1>
        <p className="text-muted-foreground">Track performance across all your campaigns</p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}
