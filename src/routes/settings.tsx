import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Disclaimer } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Assistant" },
      { name: "description", content: "Manage your profile and local app data." },
      { property: "og:title", content: "Settings — AI Workplace Assistant" },
      { property: "og:description", content: "Manage your profile and local app data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => { setName(localStorage.getItem("name") ?? ""); }, []);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <form className="card flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); localStorage.setItem("name", name); setSaved(true); setTimeout(() => setSaved(false), 1500); }}>
        <h2 className="font-display font-semibold">Profile</h2>
        <label className="label">Display name<input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" /></label>
        <button className="btn-primary self-start">{saved ? "Saved" : "Save"}</button>
      </form>
      <div className="card flex flex-col gap-3">
        <h2 className="font-display font-semibold">Data & AI</h2>
        <p className="text-sm text-muted-foreground">Your name and recent activity are stored only in this browser. Nothing you generate is saved by the app.</p>
        <button onClick={() => localStorage.removeItem("activity")} className="self-start rounded-xl border px-4 py-2 text-sm hover:bg-muted">Clear recent activity</button>
        <Disclaimer />
      </div>
    </div>
  );
}
