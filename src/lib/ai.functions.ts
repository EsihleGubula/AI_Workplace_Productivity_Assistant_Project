import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant"; content: string };

export const generateAI = createServerFn({ method: "POST" })
  .inputValidator((d: { system: string; messages: Msg[] }) => {
    if (!d?.system || !Array.isArray(d.messages) || d.messages.length === 0) throw new Error("Invalid input");
    return d;
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false as const, error: "AI is not configured (missing API key)." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: data.system,
        input: data.messages.map((m) => ({ role: m.role, content: m.content })),
        reasoning: { effort: "low" },
        store: false,
        stream: true,
      }),
    });
    if (!res.ok || !res.body) {
      let msg = `AI request failed (${res.status}).`;
      if (res.status === 429) msg = "Too many requests right now. Please wait a moment and try again.";
      if (res.status === 402) msg = "AI credits are exhausted for this workspace. Add credits to continue.";
      try {
        const j = await res.json();
        if (j?.error?.message || j?.message) msg = j.error?.message ?? j.message;
      } catch {}
      return { ok: false as const, error: msg };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta") text += ev.delta;
          if (ev.type === "error" || ev.type === "response.failed")
            return { ok: false as const, error: ev.error?.message ?? ev.response?.error?.message ?? "AI error" };
        } catch {}
      }
    }
    if (!text.trim()) return { ok: false as const, error: "The AI returned an empty response. Please try again." };
    return { ok: true as const, text };
  });
