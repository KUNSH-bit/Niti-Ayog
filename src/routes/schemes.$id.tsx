import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, Headphones, Languages, ListChecks, Target, Users, CheckCircle2,
  IndianRupee, FileText, ClipboardList, CalendarDays, ExternalLink, Building2, BadgeCheck, Sparkles, Gift,
} from "lucide-react";
import { getScheme } from "@/data/schemes";
import { useApp } from "@/lib/app-context";
import { LANGUAGES, pick, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DemoTag, StatusBadge } from "@/components/shared";
import { toast } from "sonner";

export const Route = createFileRoute("/schemes/$id")({
  loader: ({ params }) => {
    const s = getScheme(params.id);
    if (!s) throw notFound();
    return { id: s.id, name: s.name.en, short: s.short.en };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} – JanSathi AI` },
          { name: "description", content: loaderData.short },
          { property: "og:title", content: `${loaderData.name} – JanSathi AI` },
          { property: "og:description", content: loaderData.short },
        ]
      : [{ title: "Scheme unavailable – JanSathi AI" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center"><h1 className="text-2xl font-bold">Scheme not found</h1><Link to="/schemes" className="text-primary underline">Back to schemes</Link></div>
  ),
  component: Detail,
});

function Block({ icon: Icon, title, children }: { icon: typeof Target; title: string; children: React.ReactNode }) {
  return (
    <section className="card-surface p-5">
      <h2 className="mb-3 flex items-center gap-2 font-bold text-navy"><span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-4 w-4" /></span>{title}</h2>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

function Detail() {
  const { id } = Route.useLoaderData();
  const s = getScheme(id)!;
  const { lang, t, isSaved, toggleSave } = useApp();
  const [explainLang, setExplainLang] = useState<Lang>(lang);
  const [showAudio, setShowAudio] = useState(false);
  const saved = isSaved(s.id);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: s.name.en, url }); } catch { /* cancelled */ } }
    else { await navigator.clipboard.writeText(url); toast.success(t("toast.copied")); }
  };

  return (
    <div className="container-page py-8">
      <Link to="/schemes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />{t("common.back")}</Link>

      <header className="mt-4 rounded-3xl bg-navy-gradient p-6 text-navy-foreground md:p-10">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-navy-foreground/15 px-3 py-1">{s.category}</span>
          <span className="rounded-full bg-navy-foreground/15 px-3 py-1">{s.state}</span>
          <span className="rounded-full bg-navy-foreground/15 px-3 py-1">{s.level === "Central" ? t("schemes.central") : t("schemes.stateGov")}</span>
          <DemoTag label={t("common.sample")} />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">{pick(s.name, lang)}</h1>
        <p className="mt-3 max-w-3xl text-lg opacity-90">{pick(s.short, lang)}</p>
        <p className="mt-3 flex items-center gap-2 text-sm opacity-80"><Building2 className="h-4 w-4" />{s.department}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => { setExplainLang(lang); document.getElementById("ai-explain")?.scrollIntoView({ behavior: "smooth" }); }}><Languages />{t("detail.explainLang")}</Button>
          <Button variant="secondary" onClick={() => { setShowAudio(true); setTimeout(() => document.getElementById("ai-explain")?.scrollIntoView({ behavior: "smooth" }), 50); }}><Headphones />{t("detail.listen")}</Button>
          <Button asChild variant="success"><Link to="/eligibility" search={{ scheme: s.id }}><ListChecks />{t("detail.check")}</Link></Button>
          <Button variant="secondary" onClick={() => toggleSave(s.id)}>{saved ? <BookmarkCheck /> : <Bookmark />}{saved ? t("common.saved") : t("common.save")}</Button>
          <Button variant="secondary" onClick={share}><Share2 />{t("common.share")}</Button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <section id="ai-explain" className="card-surface scroll-mt-24 border-primary/30 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-bold text-navy"><Sparkles className="h-5 w-5 text-primary" />Simple explanation</h2>
              <div className="flex rounded-lg border p-0.5">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => setExplainLang(l.code)} className={`rounded-md px-2.5 py-1 text-xs font-semibold ${explainLang === l.code ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{l.native}</button>
                ))}
              </div>
            </div>
            <div className="mt-2"><StatusBadge status="ai" /></div>
            <p className="mt-3 text-lg leading-relaxed">{pick(s.aiSimple, explainLang)}</p>
            {!s.aiSimple[explainLang] && <p className="mt-2 text-xs text-warning">Translation for this language will be generated by the AI translation service (not yet connected). Showing English.</p>}
            {showAudio && <div className="mt-4"><AudioPlayer texts={s.aiSimple} title={`Listen: ${s.name.en}`} /></div>}
          </section>

          <Block icon={Target} title="Overview & purpose"><p>{s.purpose}</p></Block>
          <Block icon={Users} title="Who can benefit"><p>{s.whoBenefits}</p><div className="mt-2 flex flex-wrap gap-1.5">{s.beneficiaries.map((b) => <span key={b} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{b}</span>)}</div></Block>
          <Block icon={CheckCircle2} title="Eligibility requirements"><ul className="space-y-2">{s.eligibility.map((e) => <li key={e} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{e}</li>)}</ul></Block>
          <Block icon={Gift} title="Benefits provided"><ul className="list-disc space-y-1 pl-5">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul></Block>
          {s.financial && <Block icon={IndianRupee} title="Financial assistance"><p>{s.financial}</p></Block>}
          <Block icon={FileText} title="Required documents"><ul className="grid gap-2 sm:grid-cols-2">{s.documents.map((d) => <li key={d} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm"><FileText className="h-4 w-4 text-primary" />{d}</li>)}</ul></Block>
          <Block icon={ClipboardList} title="How to apply – step by step">
            <ol className="space-y-3">{s.steps.map((st, i) => <li key={st} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span><span className="pt-0.5">{st}</span></li>)}</ol>
          </Block>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 h-fit">
          <section className="card-surface p-5">
            <h3 className="flex items-center gap-2 font-bold"><CalendarDays className="h-4 w-4 text-primary" />Important dates</h3>
            <ul className="mt-3 space-y-2 text-sm">{s.dates.map((d) => <li key={d.label} className="flex justify-between gap-2 border-b pb-2 last:border-0"><span className="text-muted-foreground">{d.label}</span><span className="font-semibold text-right">{d.date}</span></li>)}</ul>
            <div className="mt-2"><StatusBadge status="confirm" /></div>
          </section>
          <section className="card-surface p-5 text-sm space-y-3">
            <h3 className="flex items-center gap-2 font-bold text-base"><BadgeCheck className="h-4 w-4 text-success" />Source & verification</h3>
            <p><span className="text-muted-foreground">Department:</span><br /><span className="font-medium">{s.department}</span></p>
            <p><span className="text-muted-foreground">Source document:</span><br /><span className="font-medium">{s.sourceDoc}</span></p>
            <p><span className="text-muted-foreground">Last verified:</span> <span className="font-medium">{s.verified} (illustrative)</span></p>
            {s.officialUrl ? (
              <Button asChild variant="outline" className="w-full"><a href={s.officialUrl} target="_blank" rel="noreferrer"><ExternalLink />Official website</a></Button>
            ) : (
              <p className="rounded-lg bg-warning-soft p-3 text-xs text-warning">Official application link pending verification. Please contact the department.</p>
            )}
            <Button asChild variant="soft" className="w-full"><Link to="/explanation/$id" params={{ id: "orunodoi-guidelines" }}><FileText />View document explanation</Link></Button>
          </section>
          <section className="rounded-2xl bg-success-soft p-5 text-sm">
            <p className="font-semibold text-success">Not sure if you qualify?</p>
            <p className="mt-1 text-muted-foreground">Answer a few quick questions — no Aadhaar or bank details needed.</p>
            <Button asChild variant="success" className="mt-3 w-full"><Link to="/eligibility" search={{ scheme: s.id }}>{t("detail.check")}</Link></Button>
          </section>
        </aside>
      </div>
    </div>
  );
}
