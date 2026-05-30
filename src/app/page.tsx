import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CROPS } from "@/lib/data/crops";
import {
  Map, CloudSun, HandHelping, TrendingUp, FlaskConical, ClipboardList,
  ArrowRight, Check, Star,
} from "lucide-react";

// Real, royalty-free photography (Unsplash CDN) + real faces (pravatar).
const IMG = {
  hero: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=70",
  field: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=70",
  land: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=70",
  weather: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=70",
  market: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=70",
};

const FEATURES = [
  { icon: Map, title: "Hartëzim i Fushave", desc: "Vizato fushat në hartë dhe llogarit sipërfaqen automatikisht." },
  { icon: CloudSun, title: "Paralajmërime Moti", desc: "Njoftime për ngrica, thatësirë dhe shi — para se të ndodhin." },
  { icon: HandHelping, title: "Këshillim Bujqësor", desc: "Udhëzues për kushtet e Kosovës: mbjellje, plehërim, sëmundje." },
  { icon: TrendingUp, title: "Çmimet e Tregut", desc: "Ndiq çmimet dhe shit në kohën më të mirë." },
  { icon: FlaskConical, title: "Analiza e Tokës", desc: "Regjistro rezultatet dhe merr rekomandime plehërimi." },
  { icon: ClipboardList, title: "Ditari i Punëve", desc: "Regjistro çdo aktivitet, kosto dhe input." },
];

const STORY = [
  { img: IMG.land, tag: "Fushat", title: "Të gjitha fushat në një hartë", desc: "Vizato kufijtë e fushave, ndiq kulturën aktuale dhe shëndetin e secilës parcelë. Sipërfaqja llogaritet automatikisht — pa metër, pa letra.", points: ["Hartë interaktive e fushave", "Sipërfaqja automatike në hektarë", "Statusi i shëndetit me ngjyra"] },
  { img: IMG.weather, tag: "Moti", title: "Moti i Kosovës, fushë për fushë", desc: "Parashikim 7-ditor për çdo komunë dhe parcelë, me paralajmërime automatike për ngrica e thatësirë dhe dritare optimale spërkatjeje.", points: ["Parashikim për koordinatat e fushës", "Alarme ngrice & thatësire", "Sugjerime për ujitje dhe spërkatje"] },
  { img: IMG.market, tag: "Tregu", title: "Shit kur çmimi është më i mirë", desc: "Ndiq çmimet e kulturave në tregjet kryesore të Kosovës, shiko trendet 12-mujore dhe merr këshillë kur është koha e duhur për shitje.", points: ["Çmime për 17 kultura", "Histori 12-mujore", "Këshilltar i kohës së shitjes"] },
];

const TESTIMONIALS = [
  { name: "Agron Berisha", place: "Pejë", img: "https://i.pravatar.cc/120?img=12", quote: "Me AgroKos kam ulur shpenzimet e plehrave 20% dhe e di saktë kur të ujis domatet." },
  { name: "Vlora Gashi", place: "Rahovec", img: "https://i.pravatar.cc/120?img=47", quote: "Paralajmërimi i ngricës më shpëtoi pemishten e mollëve vjet. Vlen çdo cent." },
  { name: "Bekim Krasniqi", place: "Prizren", img: "https://i.pravatar.cc/120?img=33", quote: "Çmimet e tregut në një vend — tani shes mjedrën kur çmimi është më i lartë." },
];

const STATS = [
  { n: "17", l: "kultura të Kosovës" },
  { n: "7", l: "komuna me parashikim moti" },
  { n: "2.560+", l: "produkte me qasje në BE" },
  { n: "100%", l: "në gjuhën shqipe" },
];

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // Brand-tinted backdrop so the layout holds even if an image is slow/blocked.
  return (
    <div className={`overflow-hidden bg-brand-lime ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-line/60 bg-brand-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-8">
          <Logo tagline />
          <nav className="flex items-center gap-2">
            <Link href="/sign-in" className="btn-ghost hidden sm:inline-flex">Hyr</Link>
            <Link href="/sign-up" className="btn-primary">
              Fillo Falas <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="animate-fade-up">
          <span className="badge bg-brand-lime/60 text-brand-green">🇽🇰 Ndërtuar për fermerët e Kosovës</span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-brand-charcoal sm:text-6xl">
            Bujqësia e Kosovës,<br /><span className="text-brand-green">e dixhitalizuar</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-brand-charcoal/65">
            Menaxho fushat, monitoro motin dhe rrit fitimet — gjithçka në një platformë të vetme,
            të ndërtuar për realitetin e fermave të vogla në Kosovë.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="btn-primary px-6 py-3 text-base">
              Fillo Falas <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary px-6 py-3 text-base">Shiko Demo</Link>
          </div>
          <div className="mt-7 flex items-center gap-3">
            <div className="flex -space-x-2">
              {TESTIMONIALS.map((t) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={t.name} src={t.img} alt={t.name} className="h-9 w-9 rounded-full border-2 border-brand-cream object-cover" />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex text-brand-amber">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              <p className="text-brand-charcoal/55">Të besuar nga fermerë në mbarë Kosovën</p>
            </div>
          </div>
        </div>

        {/* Hero image + floating cards */}
        <div className="relative animate-fade-up">
          <Photo src={IMG.hero} alt="Fusha bujqësore në Kosovë" className="aspect-[4/3] rounded-3xl shadow-card-hover" />
          <div className="absolute -left-4 bottom-6 hidden rounded-2xl border border-line bg-white/95 p-3 shadow-card-hover backdrop-blur sm:block">
            <p className="text-[10px] font-semibold uppercase text-brand-charcoal/45">Shëndeti i fermës</p>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold text-brand-green">92</span>
              <span className="badge bg-brand-green/10 text-brand-green">Shkëlqyeshëm</span>
            </div>
          </div>
          <div className="absolute -right-3 top-6 hidden items-center gap-2 rounded-2xl border border-line bg-white/95 p-3 shadow-card-hover backdrop-blur sm:flex">
            <span className="text-2xl">🌤️</span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-brand-charcoal">18°C</p>
              <p className="text-[10px] text-brand-charcoal/50">Pejë · Sot</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-3xl font-bold text-brand-green">{s.n}</p>
              <p className="text-xs text-brand-charcoal/55">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge bg-brand-lime/60 text-brand-green">Çfarë ofron AgroKos</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-brand-charcoal sm:text-4xl">Gjithçka për fermën tënde</h2>
          <p className="mt-3 text-brand-charcoal/60">Një platformë e vetme për të menaxhuar çdo aspekt të punës bujqësore.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 transition hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-lime/50 text-brand-green">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-charcoal">{f.title}</h3>
              <p className="mt-1.5 text-sm text-brand-charcoal/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial story rows with real photos */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl space-y-20 px-4 lg:px-8">
          {STORY.map((s, i) => (
            <div key={s.title} className="grid items-center gap-10 lg:grid-cols-2">
              <Photo
                src={s.img}
                alt={s.title}
                className={`aspect-[5/4] rounded-3xl shadow-card ${i % 2 === 1 ? "lg:order-2" : ""}`}
              />
              <div>
                <span className="badge bg-brand-lime/60 text-brand-green">{s.tag}</span>
                <h3 className="mt-4 font-display text-3xl font-semibold text-brand-charcoal">{s.title}</h3>
                <p className="mt-3 text-brand-charcoal/65">{s.desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-brand-charcoal/80">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-green/10 text-brand-green"><Check className="h-3 w-3" /></span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Crop showcase */}
      <section className="overflow-hidden py-16">
        <div className="mx-auto mb-8 max-w-2xl px-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-brand-charcoal">Kulturat e Kosovës</h2>
          <p className="mt-2 text-brand-charcoal/55">Nga gruri te mjedra — me të dhëna reale çmimesh.</p>
        </div>
        <div className="relative">
          <div className="flex w-max animate-scroll-x gap-4">
            {[...CROPS, ...CROPS].map((c, i) => (
              <div key={i} className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-card border border-line bg-white p-4 shadow-card">
                <span className="text-3xl">{c.icon_emoji}</span>
                <span className="text-sm font-semibold text-brand-charcoal">{c.name_sq}</span>
                <span className="badge bg-brand-lime/50 text-brand-green">€{c.market_price_eur_kg.toFixed(2)}/kg</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold text-brand-charcoal">Çfarë thonë fermerët</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card flex flex-col p-6">
              <div className="mb-3 flex text-brand-amber">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="flex-1 text-brand-charcoal/80">“{t.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
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
        <div className="relative overflow-hidden rounded-3xl">
          <Photo src={IMG.field} alt="" className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal/90 to-brand-green/85" />
          <div className="grain absolute inset-0 opacity-10" />
          <div className="relative p-10 text-center text-white lg:p-16">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Gati për të dixhitalizuar fermën tënde?</h2>
            <ul className="mx-auto mt-5 flex max-w-md flex-col gap-2 text-left text-sm text-white/85 sm:flex-row sm:justify-center sm:gap-6">
              {["Falas për të filluar", "Në gjuhën shqipe", "Të dhëna të Kosovës"].map((x) => (
                <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-lime" /> {x}</li>
              ))}
            </ul>
            <Link href="/sign-up" className="btn mt-8 bg-white px-6 py-3 text-brand-green hover:bg-brand-lime">
              Krijo llogari falas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row lg:px-8">
          <Logo />
          <p className="text-xs text-brand-charcoal/50">© {new Date().getFullYear()} AgroKos · Bujqësia Dixhitale</p>
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
