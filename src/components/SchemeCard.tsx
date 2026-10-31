import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Building2, MapPin, CheckCircle2, CalendarClock } from "lucide-react";
import type { Scheme } from "@/data/schemes";
import { useApp } from "@/lib/app-context";
import { pick } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function SchemeCard({ s, compact }: { s: Scheme; compact?: boolean }) {
  const { lang, t, isSaved, toggleSave } = useApp();
  const saved = isSaved(s.id);
  return (
    <article className="card-surface card-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{s.category}</span>
          <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">{s.level === "Central" ? t("schemes.central") : t("schemes.stateGov")}</span>
        </div>
        <button
          onClick={() => toggleSave(s.id)}
          aria-label={saved ? t("common.saved") : t("common.save")}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"
        >
          {saved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-navy">{pick(s.name, lang)}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{pick(s.short, lang)}</p>
      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{s.department}</p>
        <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{s.state}</p>
      </div>
      {!compact && (
        <>
          <ul className="mt-3 space-y-1">
            {s.benefits.slice(0, 2).map((b) => (
              <li key={b} className="flex items-start gap-1.5 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{b}</li>
            ))}
          </ul>
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs"><span className="font-semibold">{t("common.eligibility")}: </span>{s.eligibilitySummary}</p>
        </>
      )}
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" />{t("common.updated")}: {s.updated}*</span>
        <Button asChild size="sm"><Link to="/schemes/$id" params={{ id: s.id }}>{t("common.viewDetails")}</Link></Button>
      </div>
    </article>
  );
}
