import { useState } from "react";
import { generateAI } from "./ai.functions";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run(system: string, messages: { role: "user" | "assistant"; content: string }[]) {
    setLoading(true); setError(null);
    try {
      const r = await generateAI({ data: { system, messages } });
      if (!r.ok) { setError(r.error); return null; }
      return r.text;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      return null;
    } finally { setLoading(false); }
  }
  return { run, loading, error };
}

export function logActivity(label: string) {
  try {
    const list = JSON.parse(localStorage.getItem("activity") ?? "[]");
    list.unshift({ label, at: Date.now() });
    localStorage.setItem("activity", JSON.stringify(list.slice(0, 8)));
  } catch {}
}
