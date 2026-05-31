"use client";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[50vh] place-items-center text-center">
      <div>
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-brand-amber/20 text-3xl">🌾</div>
        <h2 className="font-display text-xl font-semibold text-brand-charcoal">Diçka shkoi keq</h2>
        <p className="mt-1 text-sm text-brand-charcoal/55">Provoni përsëri ose rifreskoni faqen.</p>
        <button onClick={reset} className="btn-primary mt-4">Provo përsëri</button>
      </div>
    </div>
  );
}
