import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight } from "lucide-react";

// Demo-mode auth card. In production this is replaced by Clerk's <SignIn/> / <SignUp/>.
export function AuthCard({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isUp = mode === "sign-up";
  return (
    <div className="grid min-h-screen place-items-center bg-brand-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="card p-6">
          <h1 className="font-display text-2xl font-semibold text-brand-charcoal">
            {isUp ? "Krijo llogari" : "Mirë se u ktheve"}
          </h1>
          <p className="mt-1 text-sm text-brand-charcoal/55">
            {isUp ? "Fillo falas me AgroKos." : "Hyr për të vazhduar në panel."}
          </p>
          <div className="mt-5 space-y-3">
            <div><label className="label">Email</label><input className="input" placeholder="ti@shembull.com" /></div>
            <div><label className="label">Fjalëkalimi</label><input className="input" type="password" placeholder="••••••••" /></div>
          </div>
          <Link href={isUp ? "/onboarding" : "/dashboard"} className="btn-primary mt-5 w-full">
            {isUp ? "Regjistrohu" : "Hyr"} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-center text-xs text-brand-charcoal/55">
            {isUp ? "Ke llogari? " : "Nuk ke llogari? "}
            <Link href={isUp ? "/sign-in" : "/sign-up"} className="font-semibold text-brand-green hover:underline">
              {isUp ? "Hyr" : "Regjistrohu"}
            </Link>
          </p>
          <p className="mt-3 rounded-lg bg-brand-lime/30 p-2 text-center text-[11px] text-brand-charcoal/60">
            🔓 Demo: kliko butonin për të hyrë me të dhëna të mbjella.
          </p>
        </div>
      </div>
    </div>
  );
}
