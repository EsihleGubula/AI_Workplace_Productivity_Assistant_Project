import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Mail, NotebookPen, MessageSquare, Settings, Menu, X, Bell } from "lucide-react";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/chatbot", label: "AI Chatbot", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const title = NAV.find((n) => n.to === path)?.label ?? "Workplace Assistant";

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active = path === n.to;
        return (
          <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
            <n.icon className="h-4 w-4" />{n.label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="mb-8 flex items-center gap-2 px-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display font-bold text-primary-foreground">W</div>
      <div className="leading-tight"><p className="font-display font-semibold text-sidebar-foreground">Workplace</p><p className="text-xs text-sidebar-foreground/60">AI Productivity</p></div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar p-5 lg:flex">
        {brand}{nav}
        <p className="mt-auto rounded-xl bg-sidebar-accent p-3 text-xs text-sidebar-foreground/70">AI outputs can be inaccurate. Always review before sending.</p>
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 bg-sidebar p-5">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-4 top-5 text-sidebar-foreground"><X className="h-5 w-5" /></button>
            {brand}{nav}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur md:px-8">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="lg:hidden"><Menu className="h-5 w-5" /></button>
          <h1 className="font-display text-lg font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Bell className="h-4 w-4" /></button>
            <Link to="/settings" aria-label="Profile" className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">EG</Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function Disclaimer() {
  return <p className="text-xs text-muted-foreground">Responsible AI: responses are AI-generated and may contain errors. Review, edit, and verify before use. Avoid pasting confidential data.</p>;
}
