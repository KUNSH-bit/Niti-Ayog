import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell, Globe, Menu, X, Landmark, User, LogOut, Settings, LayoutDashboard, Bookmark, ShieldCheck,
  ChevronDown, Facebook, Twitter, Youtube, Instagram, Languages, Scale, GitCompare, MessageSquareWarning,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { LANGUAGES, type Lang, type TKey } from "@/lib/i18n";
import { NOTIFICATIONS } from "@/data/content";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MAIN: { to: string; k: TKey }[] = [
  { to: "/", k: "nav.home" },
  { to: "/schemes", k: "nav.schemes" },
  { to: "/upload", k: "nav.upload" },
  { to: "/assistant", k: "nav.assistant" },
  { to: "/eligibility", k: "nav.eligibility" },
  { to: "/about", k: "nav.about" },
];
const MORE: { to: string; k: TKey; icon: typeof Languages }[] = [
  { to: "/translate", k: "nav.translate", icon: Languages },
  { to: "/rights", k: "nav.rights", icon: Scale },
  { to: "/compare", k: "nav.compare", icon: GitCompare },
  { to: "/notifications", k: "nav.notifications", icon: Bell },
  { to: "/saved", k: "nav.saved", icon: Bookmark },
  { to: "/feedback", k: "nav.feedback", icon: MessageSquareWarning },
  { to: "/privacy", k: "nav.privacy", icon: ShieldCheck },
  { to: "/admin", k: "nav.admin", icon: LayoutDashboard },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-primary-foreground shadow"><Landmark className="h-5 w-5" /></span>
      <span className="text-lg font-extrabold text-navy">JanSathi <span className="text-success">AI</span></span>
    </Link>
  );
}

function LangSelect({ className }: { className?: string }) {
  const { lang, setPref } = useApp();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-1.5 h-9", className)} aria-label="Select language">
          <Globe className="h-4 w-4 text-primary" />
          {LANGUAGES.find((l) => l.code === lang)?.native}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setPref("lang", l.code as Lang)} className={cn(lang === l.code && "bg-secondary font-semibold")}>
            <span className="w-20">{l.native}</span><span className="text-xs text-muted-foreground">{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const a = useApp();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{a.t("settings.title")}</DialogTitle>
          <DialogDescription>Your choices are remembered on this device.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {([["lang", "settings.reading"], ["voiceLang", "settings.voice"]] as const).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between gap-4">
              <Label>{a.t(label)}</Label>
              <select value={a[k]} onChange={(e) => a.setPref(k, e.target.value as Lang)} className="h-9 rounded-lg border bg-card px-2 text-sm">
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
              </select>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4">
            <Label>{a.t("settings.speed")}</Label>
            <select value={a.speed} onChange={(e) => a.setPref("speed", Number(e.target.value))} className="h-9 rounded-lg border bg-card px-2 text-sm">
              {[0.75, 1, 1.25, 1.5].map((r) => <option key={r} value={r}>{r}x</option>)}
            </select>
          </div>
          {([["largeText", "settings.large"], ["highContrast", "settings.contrast"], ["simpleMode", "settings.simple"]] as const).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between">
              <Label htmlFor={k}>{a.t(label)}</Label>
              <Switch id={k} checked={a[k]} onCheckedChange={(v) => a.setPref(k, v)} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Welcome to JanSathi AI</DialogTitle>
          <DialogDescription>Demo sign-in — accounts will connect to a secure backend later.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setErr("Please enter your name and a valid email."); return; }
            login(name.trim(), email.trim());
            toast.success(`Welcome, ${name.trim()}!`);
            onOpenChange(false);
          }}
        >
          <div><Label htmlFor="n">Name</Label><Input id="n" value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Das" /></div>
          <div><Label htmlFor="e">Email</Label><Input id="e" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="priya@example.com" /></div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Navbar() {
  const { t, user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  const linkCls = "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-navy transition-colors";
  const activeCls = "!text-primary bg-secondary";

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-3">
        <Logo />
        <nav className="ml-4 hidden xl:flex items-center gap-0.5" aria-label="Main">
          {MAIN.map((m) => (
            <Link key={m.to} to={m.to} className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: m.to === "/" }}>{t(m.k)}</Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(linkCls, "flex items-center gap-1")}>{t("nav.more")}<ChevronDown className="h-3 w-3" /></DropdownMenuTrigger>
            <DropdownMenuContent>
              {MORE.map((m) => (
                <DropdownMenuItem key={m.to} onClick={() => navigate({ to: m.to })}><m.icon className="h-4 w-4 mr-2" />{t(m.k)}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <LangSelect className="hidden sm:inline-flex" />
          <Link to="/notifications" className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label={t("nav.notifications")}>
            <Bell className="h-5 w-5" />
            {unread > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">{unread}</span>}
          </Link>
          <button onClick={() => setSettings(true)} className="hidden sm:block rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label={t("nav.settings")}><Settings className="h-5 w-5" /></button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border p-0.5 pr-2 hover:bg-secondary" aria-label="Profile menu">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-sm font-bold text-navy-foreground">{user.name[0]?.toUpperCase()}</span>
                <span className="hidden md:block text-sm font-medium max-w-24 truncate">{user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}><LayoutDashboard className="h-4 w-4 mr-2" />{t("nav.dashboard")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/saved" })}><Bookmark className="h-4 w-4 mr-2" />{t("nav.saved")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSettings(true)}><Settings className="h-4 w-4 mr-2" />{t("nav.settings")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); toast("Logged out"); }}><LogOut className="h-4 w-4 mr-2" />{t("nav.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="hidden sm:inline-flex h-9" onClick={() => setLoginOpen(true)}><User className="h-4 w-4" />{t("nav.login")}</Button>
          )}
          <button className="xl:hidden rounded-lg p-2 hover:bg-secondary" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="xl:hidden border-t bg-card animate-fade-up">
          <nav className="container-page grid gap-1 py-4 sm:grid-cols-2" aria-label="Mobile">
            {[...MAIN, ...MORE, { to: "/dashboard", k: "nav.dashboard" as TKey }].map((m) => (
              <Link key={m.to} to={m.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary" activeProps={{ className: "bg-secondary text-primary" }} activeOptions={{ exact: m.to === "/" }}>{t(m.k)}</Link>
            ))}
            <div className="flex flex-wrap gap-2 pt-3 sm:col-span-2">
              <LangSelect />
              <Button variant="outline" size="sm" className="h-9" onClick={() => setSettings(true)}><Settings className="h-4 w-4" />{t("nav.settings")}</Button>
              {!user && <Button size="sm" className="h-9" onClick={() => { setOpen(false); setLoginOpen(true); }}>{t("nav.login")}</Button>}
            </div>
          </nav>
        </div>
      )}
      <SettingsDialog open={settings} onOpenChange={setSettings} />
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  );
}

function Footer() {
  const { t } = useApp();
  const cols: { h: string; l: [string, string][] }[] = [
    { h: "JanSathi AI", l: [["/about", "About JanSathi AI"], ["/about", "Features"], ["/schemes", "Explore Schemes"], ["/assistant", "Ask AI"]] },
    { h: "Help", l: [["/feedback", "Contact"], ["/feedback", "Feedback"], ["/notifications", "Updates"], ["/admin", "Admin portal"]] },
    { h: "Legal", l: [["/privacy", "Privacy Policy"], ["/privacy", "Terms and Conditions"], ["/privacy", "Disclaimer"]] },
  ];
  return (
    <footer className="mt-20 bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-lg font-extrabold"><Landmark className="h-5 w-5" /> JanSathi AI</div>
          <p className="mt-3 max-w-sm text-sm opacity-80">{t("footer.tag")}</p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Twitter, Youtube, Instagram].map((I, i) => (
              <a key={i} href="#" onClick={(e) => { e.preventDefault(); toast("Social channels launching soon"); }} className="grid h-9 w-9 place-items-center rounded-lg bg-navy-foreground/10 hover:bg-navy-foreground/20" aria-label="Social link"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h4 className="font-semibold">{c.h}</h4>
            <ul className="mt-3 space-y-2 text-sm opacity-80">
              {c.l.map(([to, label]) => <li key={label}><Link to={to} className="hover:underline">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-navy-foreground/15">
        <p className="container-page py-5 text-xs opacity-70">© 2026 JanSathi AI · {t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
