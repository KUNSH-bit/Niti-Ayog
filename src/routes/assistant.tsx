import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Trash2, User, Quote, Sparkles, BadgeCheck, MessageCircle } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { LANGUAGES, type Lang } from "@/lib/i18n";
import { CHAT_SEED, SUGGESTED_QUESTIONS } from "@/data/content";
import { PageHeader, DemoTag } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Citizen Assistant – JanSathi AI" },
      { name: "description", content: "Ask questions about government schemes, rights and procedures in your language and get source-backed answers." },
      { property: "og:title", content: "AI Citizen Assistant – JanSathi AI" },
      { property: "og:description", content: "Chat with an assistant that explains government information simply." },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "ai"; text: string; facts?: string[]; cites?: { doc: string; page: number; section: string }[]; missing?: boolean };

// Demo answer engine — replace with FastAPI + Gemini RAG endpoint.
function demoAnswer(q: string, lang: Lang): Msg {
  const s = q.toLowerCase();
  const cite = (page: number, section: string) => [{ doc: "Orunodoi 2.0 Guidelines", page, section }];
  if (/document|paper|কাগজ|নথি|दस्तावेज़/.test(s)) return { role: "ai", text: "You will need: Aadhaar card, ration card, a bank passbook in the woman's name, and an income certificate.", facts: ["4 documents listed in Section 7"], cites: cite(6, "7. Documents") };
  if (/apply|how do|আবেদন|आवेदन/.test(s)) return { role: "ai", text: "Collect the form from your Gaon Panchayat or Ward office, fill in family and income details, attach documents and submit it. Keep the acknowledgement slip.", cites: cite(7, "8. Procedure") };
  if (/benefit|receive|সুবিধা|लाभ/.test(s)) return { role: "ai", text: "A fixed amount is sent every month directly to the woman's bank account to buy medicines and food items.", facts: ["Direct Benefit Transfer, monthly"], cites: cite(5, "6. Benefits") };
  if (/right|অধিকাৰ|अधिकार/.test(s)) return { role: "ai", text: "You have the right to receive payment on time once approved and to file a grievance if payment stops. You must give correct information.", cites: cite(10, "11. Grievance") };
  if (/last date|deadline|শেষ|अंतिम/.test(s)) return { role: "ai", text: "The sample document mentions an enrolment window of 15 Nov – 15 Dec 2026. Please confirm this date with your local office, as it may change.", cites: cite(8, "9. Timeline") };
  if (/assamese|অসমীয়া/.test(s) || lang === "as") return { role: "ai", text: "অৰুণোদই আঁচনিৰ জৰিয়তে অসমৰ কম আয়ৰ পৰিয়ালৰ মহিলাগৰাকীয়ে প্ৰতিমাহে বেংক একাউণ্টত ধন পায়। চৰকাৰী কৰ্মচাৰী থকা পৰিয়াল বাদ পৰে।", cites: cite(4, "4. Eligibility") };
  if (/who|eligible|apply for|যোগ্য|पात्र/.test(s)) return CHAT_SEED[1] as Msg;
  if (/about|what is/.test(s)) return { role: "ai", text: "Orunodoi is an Assam Government scheme that gives monthly money to women of low-income families for basic needs like medicine and food.", cites: cite(1, "1. Introduction") };
  if (/income|limit/.test(s)) return { role: "ai", text: "The exact income limit is not clearly stated in this copy of the document. Please check the latest official notification or ask your Gaon Panchayat office.", missing: true };
  return { role: "ai", text: "Could you tell me which scheme or document you are asking about? For example: “Who can apply for PM-KISAN?” or “What documents are needed for Orunodoi?”" };
}

function Assistant() {
  const { t, lang } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>(CHAT_SEED as Msg[]);
  const [input, setInput] = useState("");
  const [chatLang, setChatLang] = useState<Lang>(lang);
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim() || typing) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, demoAnswer(text, chatLang)]); setTyping(false); }, 900);
  };

  return (
    <>
      <PageHeader title={t("assistant.title")} subtitle="Ask in English, हिन्दी, অসমীয়া or বাংলা. Answers point to the source document." icon={<MessageCircle className="h-6 w-6" />} />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_300px]">
        <div className="card-surface flex h-[70vh] min-h-[520px] flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-primary-foreground"><Bot className="h-5 w-5" /></span><div><p className="font-semibold leading-tight">JanSathi Assistant</p><DemoTag label="Demo responses" /></div></div>
            <div className="flex items-center gap-2">
              <select value={chatLang} onChange={(e) => setChatLang(e.target.value as Lang)} className="h-9 rounded-lg border bg-card px-2 text-sm" aria-label="Chat language">{LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}</select>
              <Button variant="ghost" size="sm" onClick={() => setMsgs([])}><Trash2 />{t("common.clear")}</Button>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto bg-background p-4">
            {msgs.length === 0 && <p className="mt-20 text-center text-muted-foreground">Ask your first question, or choose a suggestion.</p>}
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "ai" && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-primary"><Bot className="h-4 w-4" /></span>}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] ${m.role === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border bg-card"}`}>
                  {m.role === "ai" && <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-primary"><Sparkles className="h-3 w-3" />{t("common.aiLabel")}</p>}
                  <p>{m.text}</p>
                  {m.facts && <ul className="mt-2 space-y-1">{m.facts.map((f) => <li key={f} className="flex items-center gap-1.5 text-xs text-success"><BadgeCheck className="h-3.5 w-3.5" />Official fact: {f}</li>)}</ul>}
                  {m.cites?.map((c) => <p key={c.section} className="mt-2 flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground"><Quote className="h-3 w-3 text-primary" />{c.doc} · Page {c.page} · {c.section}</p>)}
                  {m.missing && <p className="mt-2 rounded-lg bg-destructive-soft px-2 py-1 text-xs text-destructive">{t("common.notFound")}</p>}
                </div>
                {m.role === "user" && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-navy-foreground"><User className="h-4 w-4" /></span>}
              </div>
            ))}
            {typing && <div className="flex gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-primary"><Bot className="h-4 w-4" /></span><div className="flex gap-1 rounded-2xl border bg-card px-4 py-4">{[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d * 0.15}s` }} />)}</div></div>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("assistant.ph")} className="h-11 flex-1 rounded-xl border bg-card px-4 outline-none focus:ring-2 focus:ring-ring" aria-label={t("assistant.ph")} />
            <Button type="submit" size="lg" className="h-11" disabled={!input.trim() || typing}><Send /><span className="hidden sm:inline">Send</span></Button>
          </form>
        </div>
        <aside className="space-y-4">
          <div className="card-surface p-5">
            <h2 className="font-bold">{t("assistant.suggested")}</h2>
            <div className="mt-3 flex flex-col gap-2">
              {SUGGESTED_QUESTIONS.map((q) => <button key={q} onClick={() => send(q)} className="rounded-xl border bg-card px-3 py-2 text-left text-sm hover:border-primary hover:bg-secondary">{q}</button>)}
            </div>
          </div>
          <p className="rounded-xl bg-warning-soft p-4 text-xs text-warning">{t("assistant.disclaimer")}</p>
        </aside>
      </div>
    </>
  );
}
