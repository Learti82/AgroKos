export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="skeleton h-7 w-64" />
        <div className="skeleton h-4 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-3 p-5"><div className="skeleton h-6 w-6 rounded-full" /><div className="skeleton h-7 w-20" /><div className="skeleton h-3 w-24" /></div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card h-64" /><div className="card h-64" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-48" />)}
      </div>
    </div>
  );
}
