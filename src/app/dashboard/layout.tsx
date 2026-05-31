import { auth, currentUser } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { DataProvider } from "@/components/DataProvider";
import { SWRegister } from "@/components/SWRegister";
import { getFarmData } from "@/lib/data/repository";
import type { FarmProfile } from "@/lib/data/farm";
import { farmHealthScore } from "@/lib/metrics";
import { hasClerk, DEMO_USER_ID } from "@/lib/config";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Identify the farmer (Clerk) or fall back to the shared demo user.
  let userId: string | null = DEMO_USER_ID;
  let seed: Partial<FarmProfile> | undefined;
  if (hasClerk) {
    try {
      userId = (await auth()).userId ?? DEMO_USER_ID;
      const user = await currentUser();
      if (user) {
        const name =
          user.fullName ||
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username ||
          user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
          "Fermer i ri";
        seed = { full_name: name, phone: user.primaryPhoneNumber?.phoneNumber ?? "" };
      }
    } catch {
      userId = DEMO_USER_ID;
    }
  }

  const data = await getFarmData(userId, seed);
  const score = farmHealthScore(data);

  return (
    <DataProvider value={data}>
      <SWRegister />
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
