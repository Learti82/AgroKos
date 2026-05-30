import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { DataProvider } from "@/components/DataProvider";
import { getFarmData } from "@/lib/data/repository";
import { farmHealthScore } from "@/lib/metrics";
import { hasClerk, DEMO_USER_ID } from "@/lib/config";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Identify the farmer (Clerk) or fall back to the shared demo user.
  let userId: string | null = DEMO_USER_ID;
  if (hasClerk) {
    try {
      userId = (await auth()).userId ?? DEMO_USER_ID;
    } catch {
      userId = DEMO_USER_ID;
    }
  }

  const data = await getFarmData(userId);
  const score = farmHealthScore(data);

  return (
    <DataProvider value={data}>
      <div className="min-h-screen">
        <Sidebar />
        <div className="lg:pl-60">
          <Topbar healthScore={score} />
          <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </DataProvider>
  );
}
