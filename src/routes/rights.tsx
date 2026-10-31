import { createFileRoute } from "@tanstack/react-router";
import { Scale, Gift, ClipboardCheck, Landmark, AlertTriangle, Quote } from "lucide-react";
import { RIGHTS } from "@/data/content";
import { PageHeader, DemoTag } from "@/components/shared";
import { AudioPlayer } from "@/components/AudioPlayer";

export const Route = createFileRoute("/rights")({
  head: () => ({
    meta: [
      { title: "Rights and Responsibilities Explainer – JanSathi AI" },
      { name: "description", content: "Understand what you are entitled to, what you must do, and what the government must do under public policies." },
      { property: "og:title", content: "Rights and Responsibilities – JanSathi AI" },
      { property: "og:description", content: "Simple, source-grounded explanations of citizen rights." },
    ],
  }),
  component: Rights,
});

function Rights() {
  const cards = [
    { icon: Gift, h: "What you are entitled to", items: RIGHTS.entitled, cls: "bg-success-soft text-success" },
    { icon: ClipboardCheck, h: "What you must do", items: RIGHTS.must, cls: "bg-info-soft text-primary" },
    { icon: Landmark, h: "What the government must do", items: RIGHTS.government, cls: "bg-secondary text-navy" },
    { icon: AlertTriangle, h: "Conditions & exceptions", items: RIGHTS.conditions, cls: "bg-warning-soft text-warning" },
  ];
  return (
    <>
      <PageHeader title="Understand Your Rights" subtitle="Know your entitlements and duties in simple words — with the exact legal source." icon={<Scale className="h-6 w-6" />} />
      <div className="container-page py-8">
        <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-navy">{RIGHTS.title}</h2><DemoTag /></div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <section key={c.h} className="card-surface overflow-hidden">
              <h3 className={`flex items-center gap-2 px-5 py-3 font-bold ${c.cls}`}><c.icon className="h-5 w-5" />{c.h}</h3>
              <ul className="space-y-2 p-5">{c.items.map((i) => <li key={i} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />{i}</li>)}</ul>
            </section>
          ))}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="card-surface p-5">
            <h3 className="font-bold">Relevant source sections</h3>
            <ul className="mt-3 space-y-2">{RIGHTS.sources.map((s) => <li key={s} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm"><Quote className="h-4 w-4 text-primary" />{s}</li>)}</ul>
          </section>
          <AudioPlayer texts={{ en: `You are entitled to: ${RIGHTS.entitled.join(". ")}. You must: ${RIGHTS.must.join(". ")}.` }} title="Listen to your rights" />
        </div>
        <p className="mt-6 rounded-xl bg-warning-soft p-4 text-sm text-warning">This is a simplified explanation, not legal advice. For legal matters, consult the official Act or a legal aid centre (e.g. District Legal Services Authority).</p>
      </div>
    </>
  );
}
