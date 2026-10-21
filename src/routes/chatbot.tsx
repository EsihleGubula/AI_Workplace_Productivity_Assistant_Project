import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Loader2, AlertCircle, Briefcase, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/OutputBox";
import { Disclaimer } from "@/components/AppShell";
import { useAI, logActivity } from "@/lib/useAI";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — AI Workplace Assistant" },
      { name: "description", content: "Chat with an AI assistant about planning, writing and workplace tasks." },
      { property: "og:title", content: "AI Workplace Chatbot" },
      { property: "og:description", content: "Contextual AI help for everyday workplace tasks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatPage,
});

const SYSTEM = `You are a sharp, practical workplace productivity assistant. Help with planning, prioritization, writing, communication, meetings and problem solving.
Give specific, actionable answers tailored to the user's situation and prior messages. Ask one clarifying question when the request is ambiguous. Use concise markdown (short headings, bullets, numbered steps). Never fabricate facts; say when you're unsure.`;

type Msg = { role: "user" | "assistant"; content: string };
const SUGGESTIONS = ["Help me prioritize 6 tasks due this week", "How do I give constructive feedback to a peer?", "Draft an agenda for a 30-min project kickoff"];

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const { run, loading, error } = useAI();
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next); setInput("");
    const reply = await run(SYSTEM, next);
    if (reply) { setMsgs([...next, { role: "assistant", content: reply }]); logActivity(`Chat: ${text.slice(0, 40)}`); }
  }

  return (
    <div className="card mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col p-0">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Briefcase className="h-4 w-4" /></div><span className="font-display font-semibold">Workplace Assistant</span></div>
        {msgs.length > 0 && <button onClick={() => setMsgs([])} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Trash2 className="h-3.5 w-3.5" />Clear</button>}
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {msgs.length === 0 && (
          <div className="py-10 text-center">
            <p className="font-display text-xl font-semibold">How can I help at work today?</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border px-4 py-2 text-sm hover:border-primary hover:bg-primary/10">{s}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => m.role === "user" ? (
          <div key={i} className="flex justify-end"><div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-sidebar px-4 py-2.5 text-sm text-sidebar-foreground">{m.content}</div></div>
        ) : (
          <div key={i} className="max-w-[95%]">
            <div className="prose-chat text-sm"><ReactMarkdown>{m.content}</ReactMarkdown></div>
            <div className="mt-2"><CopyButton text={m.content} /></div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Thinking…</div>}
        {error && <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4" />{error}</div>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t p-3">
        <div className="flex items-end gap-2">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={1}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask about a workplace task…" className="field max-h-40 min-h-11 flex-1 resize-none text-sm" />
          <button disabled={loading || !input.trim()} aria-label="Send" className="btn-primary h-11 w-11 p-0"><Send className="h-4 w-4" /></button>
        </div>
        <div className="mt-2"><Disclaimer /></div>
      </form>
    </div>
  );
}
