import { NavLink } from "react-router-dom";
import { LayoutGrid, Server, ScrollText, Siren, BookOpen, Radar } from "lucide-react";
import { useIncidents } from "../../api/incidents";

const items = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/services", label: "Services", icon: Server },
  { to: "/logs", label: "Logs", icon: ScrollText },
  { to: "/incidents", label: "Incidents", icon: Siren },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
  { to: "/recall", label: "Recall", icon: Radar },
];

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { data: incidents } = useIncidents();
  const openCount = incidents?.filter((i) => i.status !== "resolved").length ?? 0;

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `eyebrow group flex items-center justify-between gap-2 rounded border-l-2 px-3 py-2.5 text-xs transition-colors ${
              isActive
                ? "border-brass bg-raised text-brass"
                : "border-transparent text-ink-muted hover:border-border hover:bg-raised/50 hover:text-ink"
            }`
          }
        >
          <span className="flex items-center gap-2.5">
            <Icon size={14} />
            {label}
          </span>
          {label === "Incidents" && openCount > 0 && (
            <span className="rounded-sm bg-signal-bad/15 px-1.5 py-0.5 font-mono text-[10px] text-signal-bad">
              {openCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
