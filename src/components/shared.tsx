import type { ReactNode } from "react";
import { BadgeCheck, Sparkles, SearchX, ShieldAlert, FlaskConical } from "lucide-react";
import { useApp } from "@/lib/app-context";
import type { Cite } from "@/data/content";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: ReactNode; children?: ReactNode }) {
  return (
    <section className="border-b bg-card bg-hero">
      <div className="container-page py-10 md:py-14 animate-fade-up">
        <div className="flex items-start gap-4">
          {icon && <div className="hidden sm:grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy text-navy-foreground">{icon}</div>}
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-navy">{title}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground md:text-lg">{subtitle}</p>}
          </div>
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function DemoTag({ className, label }: { className?: string; label?: string }) {
  const { t } = useApp();
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-warning", className)}>
      <FlaskConical className="h-3 w-3" /> {label ?? t("common.demo")}
    </span>
  );
}

export function StatusBadge({ status }: { status: Cite["status"] }) {
  const { t } = useApp();
  const map = {
    verified: { icon: BadgeCheck, cls: "bg-success-soft text-success border-success/20", label: t("common.verified") },
    ai: { icon: Sparkles, cls: "bg-info-soft text-primary border-primary/20", label: t("common.aiLabel") },
    missing: { icon: SearchX, cls: "bg-destructive-soft text-destructive border-destructive/20", label: t("common.notFound") },
    confirm: { icon: ShieldAlert, cls: "bg-warning-soft text-warning border-warning/30", label: t("common.confirm") },
  }[status];
  const Icon = map.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", map.cls)}>
      <Icon className="h-3 w-3" /> {map.label}
    </span>
  );
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-success">{eyebrow}</p>}
      <h2 className="mt-1 text-2xl md:text-3xl font-bold text-navy">{title}</h2>
      {sub && <p className="mt-2 text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="card-surface flex flex-col items-center p-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">{icon}</div>
      <h3 className="mt-4 font-semibold text-lg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
