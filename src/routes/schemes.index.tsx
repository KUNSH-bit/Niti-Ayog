import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Compass, Search, SlidersHorizontal, SearchX } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { pick } from "@/lib/i18n";
import { SCHEMES, CATEGORIES, STATES, DISTRICTS, BENEFICIARIES } from "@/data/schemes";
import { SchemeCard } from "@/components/SchemeCard";
import { PageHeader, DemoTag, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schemes/")({
  validateSearch: (s: Record<string, unknown>): { q?: string; category?: string } => ({
    q: typeof s["q"] === "string" ? (s["q"] as string) : undefined,
    category: typeof s["category"] === "string" ? (s["category"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore Government Schemes – JanSathi AI" },
      { name: "description", content: "Search and filter central and Assam government schemes by category, state, department and beneficiary." },
      { property: "og:title", content: "Explore Government Schemes – JanSathi AI" },
      { property: "og:description", content: "Find schemes for farmers, students, women, workers and small businesses." },
    ],
  }),
  component: Schemes,
});

const sel = "h-10 w-full rounded-lg border bg-card px-3 text-sm";

function Schemes() {
  const { t, lang } = useApp();
  const sp = Route.useSearch();
  const [q, setQ] = useState(sp.q ?? "");
  const [cat, setCat] = useState(sp.category ?? "");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [dept, setDept] = useState("");
  const [ben, setBen] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("relevant");
  const [showFilters, setShowFilters] = useState(false);
  const depts = [...new Set(SCHEMES.map((s) => s.department))];

  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    let r = SCHEMES.filter((x) => {
      if (s && ![pick(x.name, lang), x.name.en, x.short.en, pick(x.short, lang), x.department, x.category, x.state].join(" ").toLowerCase().includes(s)) return false;
      if (cat && x.category !== cat) return false;
      if (state && !(x.state === state || x.state === "All India")) return false;
      if (dept && x.department !== dept) return false;
      if (ben && !x.beneficiaries.includes(ben)) return false;
      if (level && x.level !== level) return false;
      return true;
    });
    if (sort === "recent") r = [...r].sort((a, b) => b.updated.localeCompare(a.updated));
    else if (sort === "category") r = [...r].sort((a, b) => a.category.localeCompare(b.category));
    else r = [...r].sort((a, b) => b.views - a.views);
    return r;
  }, [q, cat, state, dept, ben, level, sort, lang]);

  const reset = () => { setQ(""); setCat(""); setState(""); setDistrict(""); setDept(""); setBen(""); setLevel(""); };

  return (
    <>
      <PageHeader title={t("schemes.title")} subtitle={t("schemes.subtitle")} icon={<Compass className="h-6 w-6" />}>
        <div className="flex max-w-2xl items-center gap-2 rounded-2xl border bg-card p-2 shadow-card">
          <Search className="ml-2 h-5 w-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("schemes.searchPh")} className="h-10 w-full bg-transparent outline-none" aria-label={t("schemes.searchPh")} />
          {q && <Button variant="ghost" size="sm" onClick={() => setQ("")}>{t("common.clear")}</Button>}
        </div>
      </PageHeader>

      <div className="container-page py-8">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {["", ...CATEGORIES].map((c) => (
            <button key={c || "all"} onClick={() => setCat(c)} className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors", cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary")}>{c || t("common.all")}</button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className={cn("card-surface h-fit space-y-4 p-5 lg:sticky lg:top-20", !showFilters && "hidden lg:block")}>
            <div className="flex items-center justify-between"><h2 className="font-semibold">Filters</h2><button onClick={reset} className="text-sm text-primary hover:underline">{t("common.reset")}</button></div>
            <label className="block text-sm font-medium">{t("common.state")}
              <select className={sel} value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); }}>
                <option value="">{t("common.all")}</option>{STATES.filter((s) => s !== "All India").map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">{t("schemes.district")}
              <select className={sel} value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!DISTRICTS[state]}>
                <option value="">{DISTRICTS[state] ? t("common.all") : "Select a state first"}</option>{(DISTRICTS[state] ?? []).map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">{t("common.department")}
              <select className={sel} value={dept} onChange={(e) => setDept(e.target.value)}>
                <option value="">{t("common.all")}</option>{depts.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">{t("schemes.beneficiary")}
              <select className={sel} value={ben} onChange={(e) => setBen(e.target.value)}>
                <option value="">{t("common.all")}</option>{BENEFICIARIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <fieldset><legend className="text-sm font-medium">{t("schemes.level")}</legend>
              <div className="mt-1 grid grid-cols-3 gap-1 rounded-lg border p-1 text-xs">
                {[["", t("common.all")], ["Central", t("schemes.central")], ["State", t("schemes.stateGov")]].map(([v, l]) => (
                  <button key={v} onClick={() => setLevel(v ?? "")} className={cn("rounded-md px-1 py-1.5 font-medium", level === v ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>{l}</button>
                ))}
              </div>
            </fieldset>
            {district && <p className="text-xs text-muted-foreground">District-level filtering is shown for demo; all listed schemes apply statewide.</p>}
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{list.length}</span> {t("common.results")} <DemoTag className="ml-2" label={t("common.sample")} /></p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}><SlidersHorizontal />Filters</Button>
                <label className="flex items-center gap-2 text-sm">{t("schemes.sort")}
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-lg border bg-card px-2">
                    <option value="relevant">{t("schemes.sort.relevant")}</option>
                    <option value="recent">{t("schemes.sort.recent")}</option>
                    <option value="category">{t("schemes.sort.category")}</option>
                  </select>
                </label>
              </div>
            </div>
            {list.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{list.map((s) => <SchemeCard key={s.id} s={s} />)}</div>
            ) : (
              <EmptyState icon={<SearchX />} title="Nothing found" text={t("common.noResults")} action={<Button onClick={reset}>{t("common.reset")}</Button>} />
            )}
            <p className="mt-6 text-xs text-muted-foreground">* Dates and details are illustrative sample data, pending verification against official sources.</p>
          </div>
        </div>
      </div>
    </>
  );
}
