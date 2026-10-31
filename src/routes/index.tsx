import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Upload, ListChecks, Headphones, MessageCircle, Scale, FileSearch, ArrowRight, BrainCircuit,
  Languages, BookOpenCheck, FileText, Quote, BadgeCheck, CalendarCheck, Sparkles, AlertTriangle, Globe2, Compass,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { useApp } from "@/lib/app-context";
import { pick } from "@/lib/i18n";
import { SCHEMES } from "@/data/schemes";
import { SchemeCard } from "@/components/SchemeCard";
import { Button } from "@/components/ui/button";
import { DemoTag, SectionTitle } from "@/components/shared";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JanSathi AI – Government Information, Made Simple" },
      { name: "description", content: "Understand government schemes, policies and your rights in English, Hindi, Assamese or Bengali with AI explanations and voice." },
      { property: "og:title", content: "JanSathi AI – Government Information, Made Simple" },
      { property: "og:description", content: "Multilingual AI explanations of government schemes for Assam & Northeast India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function HeroSearch() {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const suggestions = ["PM-KISAN", "Orunodoi", "Scholarship", "Healthcare", "Assam", "Housing", "Ministry of Agriculture"];
  const matches = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return SCHEMES.filter((x) => [pick(x.name, lang), x.name.en, x.department, x.category, x.state, x.short.en].join(" ").toLowerCase().includes(s)).slice(0, 5);
  }, [q, lang]);
  const go = (query: string) => navigate({ to: "/schemes", search: { q: query } });

  return (
    <form onSubmit={(e) => { e.preventDefault(); go(q); }} className="relative mt-8 max-w-xl">
      <div className="flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-card focus-within:ring-2 focus-within:ring-ring">
        <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          placeholder={t("search.placeholder")}
          className="h-11 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          aria-label={t("search.placeholder")}
        />
        <Button type="submit" size="lg" className="h-11">{t("search.button")}</Button>
      </div>
      {focus && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border bg-popover p-3 shadow-lift animate-fade-up">
          {matches.length > 0 ? (
            <ul>
              {matches.map((m) => (
                <li key={m.id}>
                  <Link to="/schemes/$id" params={{ id: m.id }} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-secondary">
                    <span className="font-medium">{pick(m.name, lang)}</span>
                    <span className="text-xs text-muted-foreground">{m.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("search.suggestions")}</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button type="button" key={s} onMouseDown={() => go(s)} className="rounded-full bg-secondary px-3 py-1 text-sm hover:bg-accent">{s}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
}

function Home() {
  const { t } = useApp();
  const quick = [
    { icon: Compass, k: "quick.find", to: "/schemes" },
    { icon: FileSearch, k: "quick.policy", to: "/upload" },
    { icon: ListChecks, k: "quick.elig", to: "/eligibility" },
    { icon: Headphones, k: "quick.listen", to: "/translate" },
    { icon: MessageCircle, k: "quick.ask", to: "/assistant" },
    { icon: Scale, k: "quick.rights", to: "/rights" },
  ] as const;
  const steps = [
    { icon: Upload, k: "how.1" },
    { icon: BrainCircuit, k: "how.2" },
    { icon: Languages, k: "how.3" },
    { icon: Headphones, k: "how.4" },
  ] as const;
  const problems = [
    ["Complicated government language", "Plain, everyday explanations anyone can follow"],
    ["Regional language barriers", "Assamese, Bengali, Hindi and English — more coming"],
    ["Lack of scheme awareness", "One place to discover schemes that fit you"],
    ["Confusing eligibility conditions", "A simple question-by-question eligibility checker"],
    ["Difficult application procedures", "Step-by-step instructions and document checklists"],
    ["Limited access to voice", "Listen to every explanation at your own speed"],
    ["Scattered and outdated information", "Last-verified dates and update alerts"],
  ];
  const trust = [
    { icon: Quote, h: "Official source references", d: "Every answer points back to the original document." },
    { icon: FileText, h: "Original document access", d: "Open the source PDF with one click." },
    { icon: BookOpenCheck, h: "Page-level citations", d: "See the exact page and section used." },
    { icon: CalendarCheck, h: "Updated information", d: "Last verified dates on every scheme." },
    { icon: Sparkles, h: "AI explanation labels", d: "AI text is always clearly marked." },
    { icon: AlertTriangle, h: "Honest warnings", d: "We tell you when information is missing." },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium text-success shadow-soft"><Globe2 className="h-4 w-4" />{t("hero.badge")}</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-navy md:text-5xl lg:text-6xl">{t("hero.title")}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/schemes"><Compass />{t("hero.cta1")}</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/upload"><Upload />{t("hero.cta2")}</Link></Button>
            </div>
            <HeroSearch />
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-brand-gradient opacity-10 blur-2xl" aria-hidden />
            <img src={hero} alt="A citizen using a smartphone to understand government documents in her language" width={1200} height={1008} className="relative w-full rounded-[2rem] border bg-card shadow-lift" />
            <div className="absolute -bottom-4 left-4 hidden sm:flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-success-soft text-success"><BadgeCheck className="h-5 w-5" /></span>
              <div><p className="text-sm font-semibold">Source-backed answers</p><p className="text-xs text-muted-foreground">Page-level citations</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionTitle title={t("quick.title")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map((q) => (
            <Link key={q.k} to={q.to} className="group card-surface card-hover flex items-start gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><q.icon className="h-6 w-6" /></span>
              <div>
                <h3 className="font-bold text-navy">{t(q.k)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${q.k}.d` as never)}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-card border-y">
        <div className="container-page py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3"><SectionTitle title={t("popular.title")} /></div>
            <div className="mb-8 flex items-center gap-3"><DemoTag label={t("common.sample")} /><Button asChild variant="outline"><Link to="/schemes">{t("popular.viewAll")}<ArrowRight /></Link></Button></div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...SCHEMES].sort((a, b) => b.views - a.views).slice(0, 6).map((s) => <SchemeCard key={s.id} s={s} />)}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionTitle title={t("how.title")} />
        <ol className="grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.k} className="card-surface relative p-6">
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-secondary">{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground"><s.icon className="h-6 w-6" /></span>
              <p className="relative mt-4 font-semibold text-navy">{t(s.k)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-navy-gradient text-navy-foreground">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-3">
          <div>
            <h2 className="text-3xl font-bold">{t("problem.title")}</h2>
            <p className="mt-3 opacity-80">Government information is long, scattered and often not in your language. JanSathi AI fixes that.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
            {problems.map(([p, s]) => (
              <li key={p} className="rounded-2xl bg-navy-foreground/10 p-4">
                <p className="text-sm line-through opacity-60">{p}</p>
                <p className="mt-1 flex items-start gap-2 font-medium"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />{s}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionTitle eyebrow="Trust" title={t("trust.title")} sub="JanSathi AI helps you understand — it is not a government authority. We always show where information comes from." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trust.map((x) => (
            <div key={x.h} className="card-surface flex gap-4 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success-soft text-success"><x.icon className="h-5 w-5" /></span>
              <div><h3 className="font-semibold">{x.h}</h3><p className="text-sm text-muted-foreground">{x.d}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-gradient p-8 text-primary-foreground md:flex-row md:items-center">
          <div><h3 className="text-2xl font-bold">Have a confusing government notice?</h3><p className="opacity-90">Upload it and get a simple explanation in your language.</p></div>
          <Button asChild size="lg" variant="secondary"><Link to="/upload"><Upload />{t("hero.cta2")}</Link></Button>
        </div>
      </section>
    </>
  );
}
