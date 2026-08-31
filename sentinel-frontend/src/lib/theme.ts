import type { IncidentSeverity, IncidentStatus, ServiceStatus } from "../types";

export const severityTheme: Record<IncidentSeverity, { color: string; label: string; order: number }> = {
  low: { color: "#5E9271", label: "Low", order: 0 },
  medium: { color: "#C9A227", label: "Medium", order: 1 },
  high: { color: "#C97A3B", label: "High", order: 2 },
  critical: { color: "#BD4433", label: "Critical", order: 3 },
};

export const serviceStatusTheme: Record<ServiceStatus, { color: string; label: string }> = {
  healthy: { color: "#5E9271", label: "Healthy" },
  degraded: { color: "#C9A227", label: "Degraded" },
  down: { color: "#BD4433", label: "Down" },
};

export const incidentStatusTheme: Record<IncidentStatus, { color: string; label: string }> = {
  open: { color: "#BD4433", label: "Open" },
  investigating: { color: "#C9A227", label: "Investigating" },
  resolved: { color: "#5E9271", label: "Resolved" },
};

export const logLevelTheme: Record<string, { color: string; label: string }> = {
  debug: { color: "#655D50", label: "DEBUG" },
  info: { color: "#7E8791", label: "INFO" },
  warn: { color: "#C9A227", label: "WARN" },
  error: { color: "#BD4433", label: "ERROR" },
};

export function levelTheme(level: string) {
  return logLevelTheme[level?.toLowerCase()] ?? { color: "#7E8791", label: level?.toUpperCase() || "LOG" };
}

export function confidenceColor(value: number | undefined) {
  if (value === undefined) return "#655D50";
  if (value >= 80) return "#5E9271";
  if (value >= 50) return "#C9A227";
  if (value >= 25) return "#C97A3B";
  return "#BD4433";
}
