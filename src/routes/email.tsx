import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { OutputBox } from "@/components/OutputBox";
import { Disclaimer } from "@/components/AppShell";
import { useAI, logActivity } from "@/lib/useAI";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      { name: "description", content: "Generate context-specific professional emails in formal, friendly or persuasive tones." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "AI-written professional emails tailored to your purpose." },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
const SYSTEM = `You are an expert business communication writer. Write one complete, ready-to-send email.
Rules:
- Output format exactly: first line "Subject: <subject>", blank line, then the email body with greeting and sign-off ("[Your Name]" as signature placeholder).
- Use every key detail the user provides concretely; never invent facts, figures or dates. Use [brackets] for missing specifics.
- Match the requested tone precisely: Formal = polished, respectful, concise; Friendly = warm, conversational yet professional; Persuasive = benefit-led, confident, with a clear call to action.
- Keep it focused (typically 120-220 words). Plain text only, no markdown.`;

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [out, setOut] = useState("");
  const { run, loading, error } = useAI();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = await run(SYSTEM, [{ role: "user", content: `Recipient: ${recipient}\nPurpose: ${purpose}\nTone: ${tone}\nKey details:\n${details || "(none provided)"}` }]);
    if (text) { setOut(text.trim()); logActivity(`Email drafted: ${purpose.slice(0, 40)}`); }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="card flex flex-col gap-4">
        <h2 className="font-display font-semibold">Email details</h2>
        <label className="label">Recipient<input required className="field" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah Lee, Head of Procurement at Acme" /></label>
        <label className="label">Purpose<input required className="field" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Request a 2-week extension on the Q4 proposal" /></label>
        <label className="label">Key details<textarea className="field min-h-36" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Facts, dates, numbers, context to include…" /></label>
        <div className="label">Tone
          <div className="grid grid-cols-3 gap-2">
            {TONES.map((t) => (
              <button type="button" key={t} onClick={() => setTone(t)} className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${tone === t ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{t}</button>
            ))}
          </div>
        </div>
        <button disabled={loading} className="btn-primary"><Wand2 className="h-4 w-4" />{loading ? "Generating…" : "Generate email"}</button>
        <Disclaimer />
      </form>
      <OutputBox value={out} onChange={setOut} loading={loading} error={error} placeholder="Your generated email will appear here." />
    </div>
  );
}
