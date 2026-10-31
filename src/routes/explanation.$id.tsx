import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, ExternalLink, Download, Share2, Bookmark, MessageCircle, ListChecks, Languages, Star, Quote } from "lucide-react";
import { SAMPLE_DOC, TRANSLATION_SAMPLE } from "@/data/content";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DemoTag, StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useApp } from "@/lib/app-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explanation/$id")({
  head: () => ({
    meta: [
      { title: "Document Explanation – JanSathi AI" },
      { name: "description", content: "Simple explanation of a government document with eligibility, benefits, documents, dates and page-level citations." },
      { property: "og:title", content: "Document Explanation – JanSathi AI" },
      { property: "og:description", content: "Source-verified simple explanation of a government document." },
    ],
  }),
  component: Explanation,
});

function Explanation() {
  const { t, toggleSave, isSaved } = useApp();
  const d = SAMPLE_DOC;
  const [docOpen, setDocOpen] = useState<null | { page: number; section: string }>(null);
  const [rating, setRating] = useState(0);

  const download = () => {
    const txt = [d.title, "", ...d.sections.map((s) => `## ${s.title}\n${s.body ?? (s.list ?? []).map((l) => `- ${l}`).join("\n")}\n(Source: p.${s.cite.page}, ${s.cite.section})`)].join("\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    a.download = "jansathi-explanation.txt";
    a.click();
    toast.success("Explanation downloaded");
  };

  return (
    <div className="container-page py-8">
      <div className="card-surface flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy text-navy-foreground"><FileText /></span>
          <div>
            <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold text-navy md:text-2xl">{d.title}</h1><DemoTag /></div>
            <p className="text-sm text-muted-foreground">{d.source} · {d.pages} pages · processed {d.uploaded}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setDocOpen({ page: 1, section: "Cover" })}><ExternalLink />View original</Button>
          <Button variant="outline" size="sm" onClick={() => toggleSave("orunodoi")}><Bookmark />{isSaved("orunodoi") ? t("common.saved") : t("common.save")}</Button>
          <Button variant="outline" size="sm" onClick={download}><Download />Download</Button>
          <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(window.location.href); toast.success(t("toast.copied")); }}><Share2 />{t("common.share")}</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          {d.sections.map((s, i) => (
            <section key={s.key} className={cn("card-surface p-5", i === 0 && "md:col-span-2 border-primary/30")}>
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-bold text-navy"><span className="mr-2 text-primary">{String.fromCharCode(65 + i)}.</span>{s.title}</h2>
              </div>
              <div className="mt-1"><StatusBadge status={s.cite.status} /></div>
              {s.body && <p className={cn("mt-3 leading-relaxed", i === 0 && "text-lg")}>{s.body}</p>}
              {s.list && <ul className="mt-3 space-y-1.5 text-[15px]">{s.list.map((l) => <li key={l} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{l}</li>)}</ul>}
              <button onClick={() => setDocOpen({ page: s.cite.page, section: s.cite.section })} className="mt-4 flex w-full items-center gap-2 rounded-lg bg-muted px-3 py-2 text-left text-xs text-muted-foreground hover:bg-secondary">
                <Quote className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate">{s.cite.doc} · Page {s.cite.page} · {s.cite.section}</span>
              </button>
            </section>
          ))}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 h-fit">
          <AudioPlayer texts={{ en: TRANSLATION_SAMPLE.en, hi: TRANSLATION_SAMPLE.hi, as: TRANSLATION_SAMPLE.as, bn: TRANSLATION_SAMPLE.bn }} title="Listen to summary" />
          <div className="card-surface space-y-2 p-5">
            <h3 className="font-bold">Next steps</h3>
            <Button asChild variant="soft" className="w-full justify-start"><Link to="/translate"><Languages />Translate full explanation</Link></Button>
            <Button asChild variant="soft" className="w-full justify-start"><Link to="/assistant"><MessageCircle />Ask a question about this</Link></Button>
            <Button asChild variant="success" className="w-full justify-start"><Link to="/eligibility" search={{ scheme: "orunodoi" }}><ListChecks />Check my eligibility</Link></Button>
          </div>
          <div className="card-surface p-5">
            <h3 className="font-bold">Was this explanation useful?</h3>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => { setRating(n); toast.success(t("toast.feedback")); }} aria-label={`${n} stars`}>
                  <Star className={cn("h-7 w-7", n <= rating ? "fill-warning text-warning" : "text-input")} />
                </button>
              ))}
            </div>
            <Link to="/feedback" className="mt-2 inline-block text-sm text-primary hover:underline">Report a problem</Link>
          </div>
          <p className="rounded-xl bg-warning-soft p-4 text-xs text-warning">JanSathi AI is not a government authority. Always confirm important details with the official source.</p>
        </aside>
      </div>

      <Dialog open={!!docOpen} onOpenChange={(o) => !o && setDocOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{d.title}</DialogTitle>
            <DialogDescription>Page {docOpen?.page} · {docOpen?.section} — sample preview (original PDF viewer will load here)</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted p-6 font-serif text-sm leading-7">
            <p className="text-center font-bold">GOVERNMENT OF ASSAM · FINANCE DEPARTMENT</p>
            <p className="mt-4 font-semibold">{docOpen?.section}</p>
            <p className="mt-2"><mark className="rounded bg-success-soft px-1">{TRANSLATION_SAMPLE.en}</mark></p>
            <p className="mt-2 opacity-60">Further clauses of this section continue in the original document…</p>
          </div>
          <p className="text-xs text-muted-foreground">Highlighted text = directly supports the explanation.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
