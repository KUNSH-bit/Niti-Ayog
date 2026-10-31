import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, CheckCircle2, XCircle, HelpCircle, ArrowLeft, ArrowRight, RotateCcw, FileText, Quote } from "lucide-react";
import { SCHEMES, getScheme } from "@/data/schemes";
import { useApp } from "@/lib/app-context";
import { pick } from "@/lib/i18n";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { evaluate } from "@/lib/eligibility";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/eligibility")({
  validateSearch: (s: Record<string, unknown>): { scheme?: string } => ({ scheme: typeof s["scheme"] === "string" ? (s["scheme"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Eligibility Checker – JanSathi AI" },
      { name: "description", content: "Answer a few simple questions to see if you may qualify for a government scheme." },
      { property: "og:title", content: "Eligibility Checker – JanSathi AI" },
      { property: "og:description", content: "Preliminary, privacy-friendly scheme eligibility checks." },
    ],
  }),
  component: Eligibility,
});

function Eligibility() {
  const { t, lang } = useApp();
  const sp = Route.useSearch();
  const [schemeId, setSchemeId] = useState(sp.scheme && getScheme(sp.scheme) ? sp.scheme : "");
  const [started, setStarted] = useState(!!(sp.scheme && getScheme(sp.scheme)));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const scheme = getScheme(schemeId);
  const qs = scheme?.questions ?? [];
  const done = started && idx >= qs.length;

  const restart = () => { setIdx(0); setAnswers({}); setErr(""); };

  if (!started || !scheme) {
    return (
      <>
        <PageHeader title={t("elig.title")} subtitle={t("elig.subtitle")} icon={<ListChecks className="h-6 w-6" />} />
        <div className="container-page py-8">
          <h2 className="mb-4 font-bold text-navy">{t("elig.choose")}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCHEMES.map((s) => (
              <button key={s.id} onClick={() => setSchemeId(s.id)} className={cn("card-surface card-hover p-4 text-left", schemeId === s.id && "ring-2 ring-primary")}>
                <p className="text-xs font-semibold text-success">{s.category}</p>
                <p className="mt-1 font-bold text-navy">{pick(s.name, lang)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.questions.length} questions · {s.state}</p>
              </button>
            ))}
          </div>
          <Button size="lg" className="mt-6" disabled={!schemeId} onClick={() => { restart(); setStarted(true); }}>{t("elig.start")}<ArrowRight /></Button>
        </div>
      </>
    );
  }

  if (done) {
    const r = evaluate(scheme, answers);
    const head = { eligible: { icon: CheckCircle2, cls: "bg-success-soft text-success", label: t("elig.yes") }, not: { icon: XCircle, cls: "bg-destructive-soft text-destructive", label: t("elig.no") }, more: { icon: HelpCircle, cls: "bg-warning-soft text-warning", label: t("elig.more") } }[r.status];
    return (
      <div className="container-page max-w-4xl py-10 animate-fade-up">
        <p className="text-sm text-muted-foreground">{t("elig.result")} · {pick(scheme.name, lang)}</p>
        <div className={cn("mt-2 flex items-center gap-4 rounded-3xl p-6", head.cls)}>
          <head.icon className="h-12 w-12 shrink-0" />
          <h1 className="text-2xl font-extrabold md:text-3xl">{head.label}</h1>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {([["Conditions satisfied", r.satisfied, CheckCircle2, "text-success"], ["Conditions not satisfied", r.failed, XCircle, "text-destructive"], ["Missing information", r.missing, HelpCircle, "text-warning"]] as const).map(([title, list, Icon, c]) => (
            <section key={title} className="card-surface p-5">
              <h2 className={cn("flex items-center gap-2 font-bold", c)}><Icon className="h-5 w-5" />{title} ({list.length})</h2>
              <ul className="mt-3 space-y-3 text-sm">
                {list.length === 0 && <li className="text-muted-foreground">None</li>}
                {list.map((q) => (
                  <li key={q.id}>
                    <p className="font-medium">{pick(q.q, lang)}</p>
                    <p className="text-muted-foreground">{q.explain}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-primary"><Quote className="h-3 w-3" />{q.source}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <section className="card-surface mt-4 p-5">
          <h2 className="flex items-center gap-2 font-bold"><FileText className="h-5 w-5 text-primary" />Documents you will need</h2>
          <ul className="mt-3 flex flex-wrap gap-2">{scheme.documents.map((d) => <li key={d} className="rounded-full bg-secondary px-3 py-1 text-sm">{d}</li>)}</ul>
        </section>
        <p className="mt-4 rounded-xl bg-warning-soft p-4 text-sm text-warning">{t("elig.disclaimer")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={restart} variant="outline"><RotateCcw />Check again</Button>
          <Button onClick={() => setStarted(false)} variant="outline">Choose another scheme</Button>
          <Button asChild><Link to="/schemes/$id" params={{ id: scheme.id }}>{t("common.viewDetails")}</Link></Button>
        </div>
      </div>
    );
  }

  const q = qs[idx]!;
  return (
    <div className="container-page max-w-2xl py-10">
      <button onClick={() => setStarted(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />{t("elig.choose")}</button>
      <p className="mt-4 text-sm font-semibold text-success">{pick(scheme.name, lang)}</p>
      <div className="mt-2 flex items-center gap-3"><Progress value={(idx / qs.length) * 100} className="h-2" /><span className="text-sm text-muted-foreground whitespace-nowrap">{idx + 1} / {qs.length}</span></div>
      <div key={q.id} className="card-surface mt-6 p-6 animate-fade-up">
        <h1 className="text-2xl font-bold text-navy">{pick(q.q, lang)}</h1>
        <div className="mt-5 grid gap-2" role="radiogroup">
          {q.options.map((o) => (
            <button key={o.value} role="radio" aria-checked={answers[q.id] === o.value} onClick={() => { setAnswers((a) => ({ ...a, [q.id]: o.value })); setErr(""); }}
              className={cn("rounded-xl border-2 px-4 py-3.5 text-left text-base font-medium transition-colors", answers[q.id] === o.value ? "border-primary bg-info-soft text-primary" : "hover:border-primary/40 hover:bg-secondary")}>
              {pick(o.label, lang)}
            </button>
          ))}
        </div>
        {err && <p role="alert" className="mt-3 text-sm text-destructive">{err}</p>}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}><ArrowLeft />{t("common.back")}</Button>
          <Button onClick={() => (answers[q.id] ? setIdx((i) => i + 1) : setErr(t("elig.required")))}>{t("common.next")}<ArrowRight /></Button>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">{t("elig.disclaimer")}</p>
    </div>
  );
}
