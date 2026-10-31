import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeftRight, Languages, Loader2, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { TRANSLATION_SAMPLE, SAMPLE_DOC } from "@/data/content";
import { PageHeader, DemoTag } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/AudioPlayer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/translate")({
  head: () => ({
    meta: [
      { title: "Regional Language Translation – JanSathi AI" },
      { name: "description", content: "Translate government explanations into Assamese, Bengali, Hindi or English while preserving amounts, dates and conditions." },
      { property: "og:title", content: "Regional Language Translation – JanSathi AI" },
      { property: "og:description", content: "Side-by-side translations of government information." },
    ],
  }),
  component: Translate,
});

// Highlight protected tokens: amounts, dates, numbers
const protect = (s: string) => s.split(/(₹[\d,]+|\d{1,2}\s?\S+\s?\d{4}|[\d০-৯०-९]+)/g).map((p, i) => i % 2 ? <mark key={i} className="rounded bg-info-soft px-0.5 text-primary">{p}</mark> : p);

function Translate() {
  const [from, setFrom] = useState<Lang>("en");
  const [to, setTo] = useState<Lang>("as");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<Lang | null>("as");
  const [showOriginal, setShowOriginal] = useState(false);
  const [section, setSection] = useState("all");

  const run = () => {
    if (from === to) { toast.error("Please choose two different languages."); return; }
    setLoading(true);
    setTimeout(() => { setOut(to); setLoading(false); toast.success("Translated (demo)"); }, 1100);
  };

  return (
    <>
      <PageHeader title="Regional Language Translation" subtitle="See the original and translated text side by side. Names, amounts, dates and conditions are preserved." icon={<Languages className="h-6 w-6" />} />
      <div className="container-page space-y-6 py-8">
        <div className="card-surface flex flex-wrap items-end gap-3 p-5">
          <label className="text-sm font-medium">Original language
            <select value={from} onChange={(e) => setFrom(e.target.value as Lang)} className="mt-1 block h-10 rounded-lg border bg-card px-3">{LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}</select>
          </label>
          <Button variant="ghost" size="icon" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap languages"><ArrowLeftRight /></Button>
          <label className="text-sm font-medium">Output language
            <select value={to} onChange={(e) => setTo(e.target.value as Lang)} className="mt-1 block h-10 rounded-lg border bg-card px-3">{LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}</select>
          </label>
          <label className="text-sm font-medium">Section
            <select value={section} onChange={(e) => setSection(e.target.value)} className="mt-1 block h-10 rounded-lg border bg-card px-3">
              <option value="all">Complete explanation</option>
              {SAMPLE_DOC.sections.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}
            </select>
          </label>
          <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : <Languages />}Translate</Button>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span>Show</span>
            <div className="flex rounded-lg border p-0.5">
              {["Translated", "Original"].map((v, i) => <button key={v} onClick={() => setShowOriginal(i === 1)} className={cn("rounded-md px-3 py-1 text-xs font-semibold", showOriginal === (i === 1) ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>{v}</button>)}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="card-surface p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Original · {LANGUAGES.find((l) => l.code === from)?.native}</p>
            <p className="mt-3 text-lg leading-relaxed">{protect(TRANSLATION_SAMPLE[from])}</p>
          </section>
          <section className="card-surface border-primary/30 p-5">
            <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase text-muted-foreground">{showOriginal ? "Original" : "Translation"} · {LANGUAGES.find((l) => l.code === (showOriginal ? from : out ?? to))?.native}</p><DemoTag label="AI translation (demo)" /></div>
            {loading ? <div className="mt-6 space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-4 animate-pulse rounded bg-muted" />)}</div> :
              <p className="mt-3 text-lg leading-relaxed">{protect(TRANSLATION_SAMPLE[showOriginal ? from : out ?? to])}</p>}
            <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
              <Button size="sm" variant="outline" onClick={() => toast.success("Thanks! Marked as correct.")}><ThumbsUp />Translation is correct</Button>
              <Button size="sm" variant="outline" onClick={() => toast("Noted — a native-language reviewer will improve it.")}><ThumbsDown />Needs improvement</Button>
              <Button size="sm" variant="outline" onClick={() => toast.error("Reported. Our review team will check it.")}><Flag />Report incorrect</Button>
            </div>
          </section>
        </div>
        <p className="text-sm text-muted-foreground"><mark className="rounded bg-info-soft px-1 text-primary">Highlighted</mark> values (amounts, dates, numbers) are locked and must match the original exactly.</p>
        <div className="max-w-2xl"><AudioPlayer texts={TRANSLATION_SAMPLE} title="Listen to translation" /></div>
      </div>
    </>
  );
}
