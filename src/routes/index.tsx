import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, NotebookPen, MessageSquare, Clock, Sparkle, ArrowRight } from "lucide-react";
import { Disclaimer } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, meeting notes and workplace questions with AI." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Automate emails, meeting notes and workplace questions with AI." },
    ],
  }),
  component: Dashboard,
});

const actions = [
  { to: "/email", label: "Write an email", desc: "Formal, friendly or persuasive", icon: Mail },
  { to: "/meeting-notes", label: "Summarize a meeting", desc: "Decisions, owners, deadlines", icon: NotebookPen },
  { to: "/chatbot", label: "Ask the assistant", desc: "Plan, draft, prioritize", icon: MessageSquare },
] as const;

function Dashboard() {
  const [activity, setActivity] = useState<{ label: string; at: number }[]>([]);
  const [name, setName] = useState("there");
  useEffect(() => {
    try { setActivity(JSON.parse(localStorage.getItem("activity") ?? "[]")); } catch {}
    setName(localStorage.getItem("name") || "there");
  }, []);
  const count = (k: string) => activity.filter((a) => a.label.startsWith(k)).length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <section className="hero rounded-3xl p-6 md:p-10">
        <p className="text-sm text-primary">Welcome back</p>
        <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Hi {name}, let's get work done.</h2>
        <p className="mt-2 max-w-xl opacity-75">Draft emails, condense meetings and get answers in seconds — powered by real AI.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Emails drafted", v: count("Email"), i: Mail },
          { l: "Meetings summarized", v: count("Meeting"), i: NotebookPen },
          { l: "Chat questions", v: count("Chat"), i: MessageSquare },
          { l: "Est. minutes saved", v: count("Email") * 10 + count("Meeting") * 20 + count("Chat") * 5, i: Clock },
        ].map((s) => (
          <div key={s.l} className="card">
            <div className="flex items-center justify-between text-sm text-muted-foreground">{s.l}<s.i className="h-4 w-4 text-primary" /></div>
            <p className="mt-3 font-display text-3xl font-bold">{s.v}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <h3 className="font-display font-semibold">Quick actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {actions.map((a) => (
              <Link key={a.to} to={a.to} className="group rounded-2xl border p-4 transition hover:border-primary hover:bg-primary/10">
                <a.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 font-medium">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
                <ArrowRight className="mt-3 h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
        <section className="card">
          <h3 className="font-display font-semibold">Recent activity</h3>
          {activity.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No activity yet. Try a quick action.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><Sparkle className="mt-0.5 h-3.5 w-3.5 text-primary" /><div><p>{a.label}</p><p className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</p></div></li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <Disclaimer />
    </div>
  );
}
