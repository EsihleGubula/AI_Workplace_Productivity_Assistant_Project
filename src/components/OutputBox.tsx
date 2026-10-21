import { useState } from "react";
import { Copy, Check, Loader2, AlertCircle } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" disabled={!text}
      onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50">
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{done ? "Copied" : "Copy"}
    </button>
  );
}

export function OutputBox({ value, onChange, loading, error, placeholder }: { value: string; onChange: (v: string) => void; loading: boolean; error: string | null; placeholder: string }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold">Result <span className="text-xs font-normal text-muted-foreground">(editable)</span></h2>
        <CopyButton text={value} />
      </div>
      {error && <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      {loading ? (
        <div className="flex min-h-80 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />AI is writing…</div>
      ) : (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field min-h-80 flex-1 font-mono text-sm leading-relaxed" />
      )}
    </div>
  );
}
