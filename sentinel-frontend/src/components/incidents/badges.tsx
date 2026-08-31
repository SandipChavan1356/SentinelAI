import { Circle, CircleDot, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { severityTheme, incidentStatusTheme, serviceStatusTheme } from "../../lib/theme";
import type { IncidentSeverity, IncidentStatus, ServiceStatus } from "../../types";

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  const t = severityTheme[severity];
  return <Badge color={t.color}>{t.label}</Badge>;
}

const statusIcon: Record<IncidentStatus, typeof Circle> = {
  open: Circle,
  investigating: CircleDot,
  resolved: CheckCircle2,
};

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const t = incidentStatusTheme[status];
  const Icon = statusIcon[status];
  return (
    <Badge color={t.color} icon={<Icon size={11} />}>
      {t.label}
    </Badge>
  );
}

export function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  const t = serviceStatusTheme[status];
  return <Badge color={t.color}>{t.label}</Badge>;
}
