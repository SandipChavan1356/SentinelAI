import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { SideNav } from "./SideNav";
import { FleetStrip } from "./FleetStrip";

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-bg/95 px-4 backdrop-blur-sm md:px-5">
        <div className="flex items-center gap-3">
          <button
            className="rounded p-1.5 text-ink-muted hover:bg-raised md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" className="shrink-0">
              <rect width="32" height="32" rx="4" fill="#1D1A15" />
              <rect x="13" y="7" width="6" height="6" fill="#D9A441" />
              <rect x="8" y="16" width="6" height="6" fill="#5E9271" />
              <rect x="18" y="16" width="6" height="6" fill="#BD4433" />
            </svg>
            <span className="stencil text-xl leading-none tracking-wide">SENTINEL</span>
          </Link>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="eyebrow text-[10px] text-ink-faint">FLEET</span>
          <FleetStrip />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-56 shrink-0 border-r border-border md:block">
          <SideNav />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 border-r border-border bg-bg">
              <div className="flex h-14 items-center justify-between border-b border-border px-4">
                <span className="stencil text-xl">SENTINEL</span>
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-ink-muted" aria-label="Close menu">
                  <X size={18} />
                </button>
              </div>
              <div className="border-b border-border px-4 py-3">
                <div className="eyebrow mb-2 text-[10px] text-ink-faint">FLEET</div>
                <FleetStrip />
              </div>
              <SideNav onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
