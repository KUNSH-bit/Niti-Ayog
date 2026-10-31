import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, Headphones } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { Slider } from "@/components/ui/slider";
import { DemoTag } from "./shared";
import { cn } from "@/lib/utils";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Demo audio player. Simulates playback timing and read-along highlighting.
 * Future: swap the timer for a real <audio> source from the text-to-speech backend.
 */
export function AudioPlayer({ texts, title }: { texts: Partial<Record<Lang, string>> & { en: string }; title?: string }) {
  const { voiceLang, setPref, speed } = useApp();
  const [lang, setLang] = useState<Lang>(voiceLang);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [rate, setRate] = useState(speed);
  const [vol, setVol] = useState(80);
  const text = texts[lang] ?? texts.en;
  const sentences = useMemo(() => text.split(/(?<=[.।?!])\s+/).filter(Boolean), [text]);
  const duration = Math.max(8, Math.round(text.length / 14));
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => setLang(voiceLang), [voiceLang]);
  useEffect(() => { setPos(0); setPlaying(false); }, [lang]);

  useEffect(() => {
    if (!playing) return;
    tick.current = setInterval(() => {
      setPos((p) => {
        const n = p + 0.25 * rate;
        if (n >= duration) { setPlaying(false); return duration; }
        return n;
      });
    }, 250);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [playing, rate, duration]);

  // read-along: which sentence is active, by character proportion
  const progress = pos / duration;
  let acc = 0;
  const activeIdx = sentences.findIndex((s) => { acc += s.length; return acc / text.length >= progress; });

  return (
    <div className="card-surface overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-navy-gradient px-4 py-3 text-navy-foreground">
        <div className="flex items-center gap-2 font-semibold"><Headphones className="h-4 w-4" />{title ?? "Voice explanation"}</div>
        <DemoTag label="Demo audio · TTS not connected" />
      </div>
      <div className="p-4 space-y-4">
        <p className="text-[15px] leading-relaxed" aria-live="polite">
          {sentences.map((s, i) => (
            <span key={i} className={cn("rounded px-0.5 transition-colors", (playing || pos > 0) && i === activeIdx && "bg-success-soft text-success font-medium")}>{s} </span>
          ))}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (pos >= duration) setPos(0); setPlaying((p) => !p); }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90"
            aria-label={playing ? "Pause" : pos > 0 ? "Resume" : "Play"}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <button onClick={() => { setPos(0); setPlaying(true); }} aria-label="Replay" className="rounded-full p-2 text-muted-foreground hover:bg-secondary"><RotateCcw className="h-4 w-4" /></button>
          <div className="flex-1">
            <Slider value={[pos]} max={duration} step={0.25} onValueChange={([v]) => setPos(v ?? 0)} aria-label="Audio progress" />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>{fmt(pos)}</span><span>{fmt(duration)}</span></div>
          </div>
          <div className="hidden sm:flex items-end gap-0.5 h-6" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={cn("w-1 rounded bg-success h-full", playing ? "animate-wave" : "scale-y-[0.3] origin-bottom")} style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <select value={lang} onChange={(e) => { setLang(e.target.value as Lang); setPref("voiceLang", e.target.value as Lang); }} className="h-9 rounded-lg border bg-card px-2" aria-label="Voice language">
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}{!texts[l.code] ? " (EN fallback)" : ""}</option>)}
          </select>
          <div className="flex rounded-lg border p-0.5" role="group" aria-label="Playback speed">
            {[0.75, 1, 1.25, 1.5].map((r) => (
              <button key={r} onClick={() => setRate(r)} className={cn("rounded-md px-2 py-1 text-xs font-semibold", rate === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary")}>{r}x</button>
            ))}
          </div>
          <div className="flex items-center gap-2 min-w-32 flex-1 max-w-48">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider value={[vol]} max={100} onValueChange={([v]) => setVol(v ?? 0)} aria-label="Volume" />
          </div>
        </div>
      </div>
    </div>
  );
}
