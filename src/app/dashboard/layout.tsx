import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { farmHealthScore } from "@/lib/metrics";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const score = farmHealthScore();
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-60">
        <Topbar healthScore={score} />
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
