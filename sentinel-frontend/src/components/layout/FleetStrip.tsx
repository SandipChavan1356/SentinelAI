import { Link } from "react-router-dom";
import { useServices } from "../../api/services";
import { Lamp } from "../ui/Lamp";
import { serviceStatusTheme } from "../../lib/theme";

export function FleetStrip() {
  const { data: services } = useServices();

  if (!services || services.length === 0) {
    return <span className="font-mono text-xs text-ink-faint">no services registered</span>;
  }

  return (
    <div className="flex items-center gap-1.5">
      {services.slice(0, 24).map((s) => (
        <Link
          key={s._id}
          to="/services"
          className="group relative"
          title={`${s.name} — ${serviceStatusTheme[s.status].label}`}
        >
          <Lamp color={serviceStatusTheme[s.status].color} size="sm" />
          <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-border bg-raised px-2 py-1 font-mono text-[10px] text-ink shadow-xl group-hover:block">
            {s.name}
          </span>
        </Link>
      ))}
      {services.length > 24 && (
        <span className="font-mono text-[10px] text-ink-faint">+{services.length - 24}</span>
      )}
    </div>
  );
}
