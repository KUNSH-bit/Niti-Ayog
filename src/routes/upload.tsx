import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileText, X, Link2, Check, Loader2, Lock, Trash2, ImageIcon, Sparkles } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { PageHeader, DemoTag } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload & Explain a Government Document – JanSathi AI" },
      { name: "description", content: "Upload a government PDF or image and get a simple explanation with eligibility, benefits and source citations." },
      { property: "og:title", content: "Upload & Explain a Government Document – JanSathi AI" },
      { property: "og:description", content: "Turn long government documents into simple explanations." },
    ],
  }),
  component: UploadPage,
});

const STEPS = ["Document uploaded", "Extracting text", "Identifying policy information", "Simplifying language", "Preparing regional-language explanation", "Preparing audio"];
const MAX = 20 * 1024 * 1024;
const fmtSize = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);

function UploadPage() {
  const { t } = useApp();
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [url, setUrl] = useState("");
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const [upPct, setUpPct] = useState(0);
  const [step, setStep] = useState(-1);

  const accept = (f: { name: string; size: number; type: string }) => {
    setErr("");
    if (!/pdf|jpe?g|png/i.test(f.type || f.name)) return setErr(t("upload.errType"));
    if (f.size > MAX) return setErr(t("upload.errSize"));
    setFile(f); setStep(-1); setUpPct(0);
  };

  useEffect(() => {
    if (!file || upPct >= 100) return;
    const id = setTimeout(() => setUpPct((p) => Math.min(100, p + 12)), 90);
    return () => clearTimeout(id);
  }, [file, upPct]);

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const id = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(id);
  }, [step]);

  useEffect(() => {
    if (step === STEPS.length) {
      toast.success("Explanation ready!");
      const id = setTimeout(() => navigate({ to: "/explanation/$id", params: { id: "orunodoi-guidelines" } }), 700);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [step, navigate]);

  const start = () => {
    if (!file && !url.trim()) return setErr("Please choose a file or paste a link first.");
    if (!file && url && !/^https?:\/\//.test(url)) return setErr("Please enter a full link starting with http:// or https://");
    if (!file) { setFile({ name: url.split("/").pop() || "document-from-link.pdf", size: 1_240_000, type: "pdf" }); setUpPct(100); }
    setStep(0);
  };
  const processing = step >= 0;

  return (
    <>
      <PageHeader title={t("upload.title")} subtitle={t("upload.subtitle")} icon={<UploadCloud className="h-6 w-6" />} />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) accept(f); }}
            className={cn("card-surface flex flex-col items-center border-2 border-dashed p-10 text-center transition-colors", drag ? "border-primary bg-info-soft" : "border-input")}
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary"><UploadCloud className="h-8 w-8" /></span>
            <p className="mt-4 text-lg font-semibold">{t("upload.drop")}</p>
            <p className="text-sm text-muted-foreground">{t("upload.or")}</p>
            <Button className="mt-3" onClick={() => input.current?.click()} disabled={processing}>{t("upload.browse")}</Button>
            <input ref={input} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) accept(f); e.target.value = ""; }} />
            <p className="mt-3 text-xs text-muted-foreground">{t("upload.formats")}</p>
          </div>

          {err && <p role="alert" className="rounded-lg bg-destructive-soft px-4 py-3 text-sm text-destructive">{err}</p>}

          {file && (
            <div className="card-surface flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">{/pdf/i.test(file.type || file.name) ? <FileText /> : <ImageIcon />}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{fmtSize(file.size)} · {upPct < 100 ? `Uploading ${upPct}%` : "Ready"}</p>
                <Progress value={upPct} className="mt-2 h-1.5" />
              </div>
              {!processing && <button onClick={() => { setFile(null); setUpPct(0); }} aria-label="Remove file" className="rounded-lg p-2 hover:bg-secondary"><X className="h-4 w-4" /></button>}
            </div>
          )}

          <div className="card-surface p-5">
            <label htmlFor="docurl" className="flex items-center gap-2 text-sm font-semibold"><Link2 className="h-4 w-4 text-primary" />{t("upload.url")}</label>
            <input id="docurl" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://assam.gov.in/notification.pdf" className="mt-2 h-11 w-full rounded-lg border bg-card px-3 outline-none focus:ring-2 focus:ring-ring" disabled={processing} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={start} disabled={processing || (!!file && upPct < 100)}><Sparkles />{t("upload.process")}</Button>
            <Button size="lg" variant="outline" disabled={processing} onClick={() => { accept({ name: "Orunodoi-2.0-Guidelines.pdf", size: 2_480_000, type: "application/pdf" }); setUpPct(100); setTimeout(() => setStep(0), 50); }}>{t("upload.sample")}</Button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card-surface p-5">
            <div className="flex items-center justify-between"><h2 className="font-bold">Processing</h2><DemoTag label="Simulated" /></div>
            <ol className="mt-4 space-y-3">
              {STEPS.map((s, i) => {
                const done = step > i; const active = step === i;
                return (
                  <li key={s} className="flex items-center gap-3">
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold", done && "border-success bg-success text-success-foreground", active && "border-primary text-primary")}>
                      {done ? <Check className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : i + 1}
                    </span>
                    <span className={cn("text-sm", done || active ? "font-medium" : "text-muted-foreground")}>{s}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">This is a demonstration. Real text extraction and AI simplification will run once the backend is connected.</p>
          </div>
          <div className="rounded-2xl bg-success-soft p-5 text-sm">
            <p className="flex items-center gap-2 font-semibold text-success"><Lock className="h-4 w-4" />Your document stays private</p>
            <p className="mt-1 text-muted-foreground">Uploads are only for creating your explanation and will be visible only to you. You can delete them any time.</p>
            {file && !processing && <Button variant="outline" size="sm" className="mt-3" onClick={() => { setFile(null); toast("Document deleted"); }}><Trash2 />Delete document</Button>}
          </div>
        </aside>
      </div>
    </>
  );
}
