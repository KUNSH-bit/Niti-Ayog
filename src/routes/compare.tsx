import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GitCompare, Loader2, Lightbulb, CalendarDays } from "lucide-react";
import { COMPARISON } from "@/data/content";
import { PageHeader, DemoTag } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Policy Comparison & Change Tracker – JanSathi AI" },
      { name: "description", content: "Compare two versions of a government policy and see what was added, removed or changed." },
      { property: "og:title", content: "Policy Change Tracker – JanSathi AI" },
      { property: "og:description", content: "See exactly what changed in a government notification." },
    ],
  }),
  component: Compare,
});

const tone: Record<string, string> = {
  Added: "bg-success-soft text-success",
  Removed: "bg-destructive-soft text-destructive",
  Modified: "bg-warning-soft text-warning",
  Unchanged: "bg-muted text-muted-foreground",
};

function Compare() {
  const [state, setState] = useState<"idle" | "loading" | "done">("done");
  const [filter, setFilter] = useState("All");
  const rows = COMPARISON.rows.filter((r) => filter === "All" || r.status === filter);
  return (
    <>
      <PageHeader title="Policy Changes" subtitle="Compare an older and newer version of a policy to see what changed for you." icon={<GitCompare className="h-6 w-6" />} />
      <div className="container-page space-y-6 py-8">
        <div className="card-surface grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
          {[["Previous policy document", COMPARISON.old], ["Updated policy document", COMPARISON.new]].map(([l, v]) => (
            <label key={l} className="text-sm font-medium">{l}
              <select defaultValue={v} className="mt-1 block h-10 w-full rounded-lg border bg-card px-3"><option>{v}</option><option>Upload a file…</option></select>
            </label>
          ))}
          <Button onClick={() => { setState("loading"); setTimeout(() => setState("done"), 1200); }} disabled={state === "loading"}>{state === "loading" ? <Loader2 className="animate-spin" /> : <GitCompare />}Compare</Button>
        </div>

        {state === "loading" ? <div className="card-surface p-10 text-center text-muted-foreground"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /><p className="mt-2">Comparing documents…</p></div> : (
          <>
            <section className="rounded-3xl bg-brand-gradient p-6 text-primary-foreground">
              <h2 className="flex items-center gap-2 text-xl font-bold"><Lightbulb />What does this change mean for citizens?</h2>
              <ul className="mt-3 space-y-1.5">{COMPARISON.meaning.map((m) => <li key={m}>• {m}</li>)}</ul>
              <p className="mt-3 flex items-center gap-2 text-sm opacity-90"><CalendarDays className="h-4 w-4" />Effective from {COMPARISON.effective}</p>
            </section>
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Added", "Removed", "Modified", "Unchanged"].map((f) => <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full border px-3 py-1 text-sm font-medium", filter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary")}>{f}</button>)}
              <DemoTag className="ml-auto" />
            </div>
            <div className="space-y-3">
              <div className="hidden grid-cols-[180px_1fr_1fr_110px] gap-4 px-5 text-xs font-semibold uppercase text-muted-foreground md:grid"><span>Area</span><span>{COMPARISON.old}</span><span>{COMPARISON.new}</span><span>Status</span></div>
              {rows.map((r) => (
                <div key={r.area} className="card-surface grid gap-3 p-5 md:grid-cols-[180px_1fr_1fr_110px] md:items-center md:gap-4">
                  <p className="font-bold text-navy">{r.area}</p>
                  <p className={cn("text-sm", r.status === "Removed" && "line-through text-destructive")}><span className="md:hidden text-xs text-muted-foreground">Before: </span>{r.oldText}</p>
                  <p className={cn("text-sm", r.status !== "Unchanged" && "font-medium")}><span className="md:hidden text-xs text-muted-foreground">After: </span>{r.newText}</p>
                  <span className={cn("w-fit rounded-full px-3 py-1 text-xs font-bold", tone[r.status])}>{r.status}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
