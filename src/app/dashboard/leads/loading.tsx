export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted animate-pulse rounded" />
      <div className="flex gap-4">
        <div className="h-10 bg-muted animate-pulse rounded flex-1 max-w-sm" />
        <div className="h-10 bg-muted animate-pulse rounded w-[180px]" />
        <div className="h-10 bg-muted animate-pulse rounded w-[180px]" />
        <div className="h-10 bg-muted animate-pulse rounded w-[120px]" />
      </div>
      <div className="h-[400px] bg-muted animate-pulse rounded" />
    </div>
  )
}
