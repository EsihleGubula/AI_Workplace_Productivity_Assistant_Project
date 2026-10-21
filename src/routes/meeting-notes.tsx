import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { OutputBox } from "@/components/OutputBox";
import { Disclaimer } from "@/components/AppShell";
import { useAI, logActivity } from "@/lib/useAI";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      { name: "description", content: "Turn long meeting notes into key points, decisions, action items, owners and deadlines." },
      { property: "og:title", content: "AI Meeting Notes Summarizer" },
      { property: "og:description", content: "Key points, decisions and action items from your notes." },
    ],
  }),
  component: NotesPage,
});

const SYSTEM = `You are a meticulous executive assistant summarizing meeting notes.
Base everything strictly on the provided notes; never invent people, decisions or dates. If something is unspecified write "Not specified".
Output plain text in exactly this structure:

SUMMARY
<2-3 sentence overview>

KEY POINTS
- ...

DECISIONS
- ... (or "None recorded")

ACTION ITEMS
- <task> | Owner: <name> | Deadline: <date>

OPEN QUESTIONS
- ... (or "None")`;

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState("");
  const { run, loading, error } = useAI();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = await run(SYSTEM, [{ role: "user", content: `Meeting notes:\n"""\n${notes}\n"""` }]);
    if (text) { setOut(text.trim()); logActivity("Meeting summarized"); }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
      <form onSubmit={submit} className="card flex flex-col gap-4">
        <h2 className="font-display font-semibold">Paste your notes</h2>
        <textarea required minLength={20} className="field min-h-96 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste raw meeting notes or a transcript — long text is fine." />
        <p className="text-xs text-muted-foreground">{notes.length.toLocaleString()} characters</p>
        <button disabled={loading} className="btn-primary"><Wand2 className="h-4 w-4" />{loading ? "Summarizing…" : "Summarize notes"}</button>
        <Disclaimer />
      </form>
      <OutputBox value={out} onChange={setOut} loading={loading} error={error} placeholder="Key points, decisions, action items, owners and deadlines will appear here." />
    </div>
  );
}
