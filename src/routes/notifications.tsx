import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, BellRing, Settings2 } from "lucide-react";
import { NOTIFICATIONS } from "@/data/content";
import { CATEGORIES, STATES } from "@/data/schemes";
import { LANGUAGES } from "@/lib/i18n";
import { useApp } from "@/lib/app-context";
import { PageHeader, DemoTag, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications & Updates – JanSathi AI" },
      { name: "description", content: "New schemes, policy changes, eligibility updates and deadlines for Assam and Northeast India." },
      { property: "og:title", content: "Notifications & Updates – JanSathi AI" },
      { property: "og:description", content: "Stay updated on government schemes and deadlines." },
    ],
  }),
  component: Notifications,
});

const sel = "h-10 rounded-lg border bg-card px-3 text-sm";

function Notifications() {
  const { t, lang, setPref } = useApp();
  const [state, setState] = useState("");
  const [cat, setCat] = useState("");
  const [dept, setDept] = useState("");
  const [range, setRange] = useState("all");
  const [read, setRead] = useState<number[]>([]);
  const [prefCats, setPrefCats] = useState<string[]>(["Education", "Agriculture"]);
  const depts = [...new Set(NOTIFICATIONS.map((n) => n.dept))];

  const list = useMemo(() => NOTIFICATIONS.filter((n) => {
    if (state && n.state !== state) return false;
    if (cat && n.category !== cat) return false;
    if (dept && n.dept !== dept) return false;
    if (range !== "all") {
      const days = (new Date("2026-10-31").getTime() - new Date(n.date).getTime()) / 864e5;
      if (days > Number(range)) return false;
    }
    return true;
  }), [state, cat, dept, range]);

  return (
    <>
      <PageHeader title={t("nav.notifications")} subtitle="New schemes, policy updates, eligibility changes and deadlines." icon={<Bell className="h-6 w-6" />} />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <select className={sel} value={state} onChange={(e) => setState(e.target.value)} aria-label="State"><option value="">All states</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
            <select className={sel} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="">All categories</option>{CATEGORIES.map((s) => <option key={s}>{s}</option>)}</select>
            <select className={sel} value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department"><option value="">All departments</option>{depts.map((s) => <option key={s}>{s}</option>)}</select>
            <select className={sel} value={range} onChange={(e) => setRange(e.target.value)} aria-label="Date"><option value="all">Any date</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select>
            <Button variant="ghost" size="sm" className="h-10" onClick={() => setRead(NOTIFICATIONS.map((n) => n.id))}>Mark all read</Button>
          </div>
          <div className="space-y-3">
            {list.length === 0 && <EmptyState icon={<Bell />} title="No updates" text="No notifications match these filters." />}
            {list.map((n) => {
              const unread = n.unread && !read.includes(n.id);
              return (
                <article key={n.id} onClick={() => setRead((r) => [...r, n.id])} className={cn("card-surface flex cursor-pointer gap-4 p-5", unread && "border-l-4 border-l-primary")}>
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", unread ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}><BellRing className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success">{n.type}</span>
                      <span className="text-muted-foreground">{n.state} · {n.category}</span>
                    </div>
                    <h3 className="mt-1 font-semibold">{n.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Source: {n.source} · {n.dept} · Published {n.date}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <DemoTag className="mt-4" label="Sample notifications — official feeds not yet connected" />
        </div>
        <aside className="card-surface h-fit space-y-4 p-5">
          <h2 className="flex items-center gap-2 font-bold"><Settings2 className="h-5 w-5 text-primary" />Notification preferences</h2>
          <label className="block text-sm font-medium">Preferred language
            <select className={cn(sel, "mt-1 w-full")} value={lang} onChange={(e) => setPref("lang", e.target.value as never)}>{LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}</select>
          </label>
          <label className="block text-sm font-medium">State<select className={cn(sel, "mt-1 w-full")} defaultValue="Assam">{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="block text-sm font-medium">District<select className={cn(sel, "mt-1 w-full")} defaultValue="Kamrup Metro">{["Kamrup Metro", "Dibrugarh", "Jorhat", "Nagaon", "Cachar"].map((s) => <option key={s}>{s}</option>)}</select></label>
          <fieldset><legend className="text-sm font-medium">Categories</legend>
            <div className="mt-2 max-h-48 space-y-2 overflow-y-auto">
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm"><Checkbox checked={prefCats.includes(c)} onCheckedChange={(v) => setPrefCats((p) => v ? [...p, c] : p.filter((x) => x !== c))} />{c}</label>
              ))}
            </div>
          </fieldset>
          <Button className="w-full" onClick={() => toast.success("Preferences saved")}>Save preferences</Button>
        </aside>
      </div>
    </>
  );
}
