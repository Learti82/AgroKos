import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CROPS } from "@/lib/data/crops";
import {
  Map, CloudSun, HandHelping, TrendingUp, FlaskConical, ClipboardList, ArrowRight, Check,
} from "lucide-react";

const FEATURES = [
  { icon: Map, title: "Hartëzim i Fushave", desc: "Vizato fushat në hartë satelitore dhe llogarit sipërfaqen automatikisht." },
  { icon: CloudSun, title: "Paralajmërime Moti", desc: "Njoftime për ngrica, thatësirë dhe shi i dendur — para se të ndodhin." },
  { icon: HandHelping, title: "Këshillim Bujqësor", desc: "Udhëzues për kushtet e Kosovës: mbjellje, plehërim, sëmundje." },
  { icon: TrendingUp, title: "Çmimet e Tregut", desc: "Ndiq çmimet e kulturave në tregjet e Kosovës dhe shit në kohën e duhur." },
  { icon: FlaskConical, title: "Analiza e Tokës", desc: "Regjistro rezultatet e laboratorit dhe merr rekomandime plehërimi." },
  { icon: ClipboardList, title: "Ditari i Punëve", desc: "Regjistro çdo aktivitet, kosto dhe input — me shënime zanore në shqip." },
];

const TESTIMONIALS = [
  { name: "Agron Berisha", place: "Pejë", quote: "Me AgroKos kam ulur shpenzimet e plehrave 20% dhe e di saktë kur të ujis domatet." },
  { name: "Vlora Gashi", place: "Rahovec", quote: "Paralajmërimi i ngricës më shpëtoi pemishten e mollëve vjet. Vlen çdo cent." },
  { name: "Bekim Krasniqi", place: "Prizren", quote: "Çmimet e tregut në një vend — tani shes mjedrën kur çmimi është më i lartë." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-ghost hidden sm:inline-flex">Demo</Link>
          <Link href="/dashboard" className="btn-primary">
            Fillo Falas <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-green to-brand-sky" />
        <div className="grain absolute inset-0 opacity-[0.12] mix-blend-overlay" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-green-light/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-brand-amber/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center lg:px-8 lg:py-28">
          <span className="badge mx-auto bg-white/15 text-brand-lime backdrop-blur">
            🇽🇰 Ndërtuar për fermerët e Kosovës
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">
            Bujqësia e Kosovës,<br />
            <span className="text-brand-lime">E Dixhitalizuar</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">
            Menaxho fushat, monitoro mbjelljet, dhe rrit fitimet me AgroKos — platforma e parë
            agroteknologjike e dizajnuar për realitetin e fermave të vogla në Kosovë.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn bg-white px-6 py-3 text-brand-green hover:bg-brand-lime">
              Fillo Falas <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="btn border border-white/30 px-6 py-3 text-white hover:bg-white/10">
              Shiko Demo
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/50">Pa kartë krediti · Demo me të dhëna reale të Kosovës</p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-brand-charcoal">Gjithçka për fermën tënde</h2>
          <p className="mt-3 text-brand-charcoal/60">Një platformë e vetme për të menaxhuar çdo aspekt të punës bujqësore.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 transition hover:shadow-card-hover">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-lime/50 text-brand-green">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-charcoal">{f.title}</h3>
              <p className="mt-1.5 text-sm text-brand-charcoal/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crop carousel */}
      <section className="overflow-hidden bg-white py-14">
        <h2 className="mb-8 text-center font-display text-2xl font-semibold text-brand-charcoal">
          Kulturat e Kosovës
        </h2>
        <div className="relative">
          <div className="flex w-max animate-scroll-x gap-4">
            {[...CROPS, ...CROPS].map((c, i) => (
              <div key={i} className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-card border border-line bg-brand-cream p-4">
                <span className="text-3xl">{c.icon_emoji}</span>
                <span className="text-sm font-semibold text-brand-charcoal">{c.name_sq}</span>
                <span className="text-xs text-brand-charcoal/50">€{c.market_price_eur_kg.toFixed(2)}/kg</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold text-brand-charcoal">
          Çfarë thonë fermerët
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card flex flex-col p-6">
              <p className="flex-1 text-brand-charcoal/80">“{t.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-green text-sm font-bold text-white">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-charcoal">{t.name}</p>
                  <p className="text-xs text-brand-charcoal/50">{t.place}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-green p-10 text-center text-white lg:p-16">
          <div className="grain absolute inset-0 opacity-10" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold">Gati për të dixhitalizuar fermën tënde?</h2>
            <ul className="mx-auto mt-5 flex max-w-md flex-col gap-2 text-left text-sm text-white/85 sm:flex-row sm:justify-center sm:gap-6">
              {["Falas për të filluar", "Në gjuhën shqipe", "Të dhëna të Kosovës"].map((x) => (
                <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-lime" /> {x}</li>
              ))}
            </ul>
            <Link href="/dashboard" className="btn mt-8 bg-white px-6 py-3 text-brand-green hover:bg-brand-lime">
              Hyr në Panel <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-8">
          <Logo />
          <p className="text-xs text-brand-charcoal/50">© {new Date().getFullYear()} AgroKos · Bujqësia e Kosovës, E Dixhitalizuar</p>
          <div className="flex gap-4 text-xs text-brand-charcoal/60">
            <Link href="/dashboard" className="hover:text-brand-green">Paneli</Link>
            <Link href="/dashboard/advisory" className="hover:text-brand-green">Këshillim</Link>
            <Link href="/dashboard/market" className="hover:text-brand-green">Tregu</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
