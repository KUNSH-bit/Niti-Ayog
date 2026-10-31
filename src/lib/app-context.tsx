import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { translate, type Lang, type TKey } from "./i18n";

type Prefs = {
  lang: Lang;
  voiceLang: Lang;
  speed: number;
  largeText: boolean;
  highContrast: boolean;
  simpleMode: boolean;
};

type User = { name: string; email: string } | null;

type Ctx = Prefs & {
  t: (k: TKey) => string;
  setPref: <K extends keyof Prefs>(k: K, v: Prefs[K]) => void;
  saved: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  user: User;
  login: (name: string, email: string) => void;
  logout: () => void;
};

const defaults: Prefs = {
  lang: "en",
  voiceLang: "en",
  speed: 1,
  largeText: false,
  highContrast: false,
  simpleMode: false,
};

const AppCtx = createContext<Ctx | null>(null);
const KEY = "jansathi.v1";

export function AppProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(defaults);
  const [saved, setSaved] = useState<string[]>(["pm-kisan", "orunodoi"]);
  const [user, setUser] = useState<User>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.prefs) setPrefs({ ...defaults, ...d.prefs });
        if (d.saved) setSaved(d.saved);
        if (d.user !== undefined) setUser(d.user);
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KEY, JSON.stringify({ prefs, saved, user }));
    const root = document.documentElement;
    root.classList.toggle("hc", prefs.highContrast);
    root.classList.toggle("large-text", prefs.largeText);
    root.classList.toggle("simple-mode", prefs.simpleMode);
    root.lang = prefs.lang;
  }, [prefs, saved, user, loaded]);

  const t = useCallback((k: TKey) => translate(prefs.lang, k), [prefs.lang]);

  const toggleSave = (id: string) => {
    setSaved((s) => {
      if (s.includes(id)) {
        toast(translate(prefs.lang, "toast.removed"));
        return s.filter((x) => x !== id);
      }
      toast.success(translate(prefs.lang, "toast.saved"));
      return [...s, id];
    });
  };

  return (
    <AppCtx.Provider
      value={{
        ...prefs,
        t,
        setPref: (k, v) => setPrefs((p) => ({ ...p, [k]: v })),
        saved,
        toggleSave,
        isSaved: (id) => saved.includes(id),
        user,
        login: (name, email) => setUser({ name, email }),
        logout: () => setUser(null),
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}
