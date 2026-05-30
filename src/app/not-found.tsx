import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-brand-cream px-4 text-center">
      <div>
        <div className="mb-6 flex justify-center"><Logo /></div>
        <p className="font-display text-6xl font-semibold text-brand-green">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-brand-charcoal">Faqja nuk u gjet</h1>
        <p className="mt-1 text-sm text-brand-charcoal/55">Kjo arë duket bosh. Kthehuni në panel.</p>
        <Link href="/dashboard" className="btn-primary mt-5">Kthehu te Paneli</Link>
      </div>
    </div>
  );
}
