import { Link } from "react-router-dom";
import { useServices } from "../api/services";
import { useIncidents } from "../api/incidents";
import { useLogs } from "../api/logs";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel, PanelHeader } from "../components/ui/Panel";
import { ListSkeleton, ErrorPanel, EmptyState } from "../components/ui/States";
import { Lamp } from "../components/ui/Lamp";
import { SeverityBadge } from "../components/incidents/badges";
import { levelTheme, serviceStatusTheme } from "../lib/theme";
import { clockTime, timeAgo } from "../lib/format";
import type { Service } from "../types";
import { ArrowRight } from "lucide-react";

function StatReadout({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="border border-border bg-panel px-4 py-3">
      <div className="eyebrow text-[10px] text-ink-faint">{label}</div>
      <div className="font-mono text-3xl font-semibold" style={color ? { color } : undefined}>
        {value}
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { data: services, isLoading: loadingServices, isError: servicesError, refetch: refetchServices } = useServices();
  const { data: incidents, isLoading: loadingIncidents, isError: incidentsError, refetch: refetchIncidents } = useIncidents();
  const { data: logs, isLoading: loadingLogs, isError: logsError, refetch: refetchLogs } = useLogs(10000);

  const servicesDown = services?.filter((s) => s.status === "down").length ?? 0;
  const servicesDegraded = services?.filter((s) => s.status === "degraded").length ?? 0;
  const openIncidents = incidents?.filter((i) => i.status !== "resolved").length ?? 0;
  const criticalIncidents = incidents?.filter((i) => i.severity === "critical" && i.status !== "resolved").length ?? 0;

  const recentIncidents = [...(incidents ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const recentLogs = [...(logs ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 14);

  return (
    <div>
      <PageHeader
        eyebrow="CONTROL ROOM"
        title="Overview"
        description="Fleet health, open incidents, and the live signal feed — at a glance."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatReadout label="OPEN INCIDENTS" value={loadingIncidents ? "—" : openIncidents} color={openIncidents > 0 ? "#BD4433" : undefined} />
        <StatReadout label="CRITICAL" value={loadingIncidents ? "—" : criticalIncidents} color={criticalIncidents > 0 ? "#BD4433" : undefined} />
        <StatReadout label="SERVICES DOWN" value={loadingServices ? "—" : servicesDown} color={servicesDown > 0 ? "#BD4433" : undefined} />
        <StatReadout label="DEGRADED" value={loadingServices ? "—" : servicesDegraded} color={servicesDegraded > 0 ? "#C9A227" : undefined} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Panel noPadding className="xl:col-span-3">
          <PanelHeader
            eyebrow="LATEST"
            title="Recent Incidents"
            action={
              <Link to="/incidents" className="eyebrow flex items-center gap-1 text-[10px] text-ink-muted hover:text-brass">
                View all <ArrowRight size={12} />
              </Link>
            }
          />
          {loadingIncidents ? (
            <ListSkeleton rows={4} />
          ) : incidentsError ? (
            <ErrorPanel message="Couldn't load incidents." onRetry={() => refetchIncidents()} />
          ) : recentIncidents.length === 0 ? (
            <EmptyState title="All quiet" description="No incidents have been logged yet." />
          ) : (
            <div className="divide-y divide-border-soft">
              {recentIncidents.map((inc) => (
                <Link
                  key={inc._id}
                  to={`/incidents/${inc._id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-raised/60"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm text-ink">{inc.title}</div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-ink-faint">
                      {timeAgo(inc.createdAt)}
                    </div>
                  </div>
                  <SeverityBadge severity={inc.severity} />
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel noPadding className="xl:col-span-2">
          <PanelHeader
            eyebrow="TELEMETRY"
            title="Live Log Feed"
            action={
              <Link to="/logs" className="eyebrow flex items-center gap-1 text-[10px] text-ink-muted hover:text-brass">
                View all <ArrowRight size={12} />
              </Link>
            }
          />
          {loadingLogs ? (
            <ListSkeleton rows={6} />
          ) : logsError ? (
            <ErrorPanel message="Couldn't load logs." onRetry={() => refetchLogs()} />
          ) : recentLogs.length === 0 ? (
            <EmptyState title="No signal yet" description="Logs will appear here as services report in." />
          ) : (
            <div className="max-h-[420px] overflow-y-auto font-mono text-xs">
              {recentLogs.map((log) => {
                const t = levelTheme(log.level);
                const svc = typeof log.service === "object" ? log.service.name : "unknown";
                return (
                  <div key={log._id} className="flex items-start gap-2 border-b border-border-soft px-4 py-2 last:border-0">
                    <span className="mt-0.5 shrink-0 text-ink-faint">{clockTime(log.createdAt)}</span>
                    <Lamp color={t.color} size="sm" className="mt-1" />
                    <span className="shrink-0 text-ink-muted">{svc}</span>
                    <span className="min-w-0 flex-1 truncate text-ink">{log.message}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-4">
        <Panel noPadding>
          <PanelHeader eyebrow="FLEET" title="Services" />
          {loadingServices ? (
            <ListSkeleton rows={3} />
          ) : servicesError ? (
            <ErrorPanel message="Couldn't load services." onRetry={() => refetchServices()} />
          ) : !services || services.length === 0 ? (
            <EmptyState
              title="No services yet"
              description="Register a service from the Services page to start collecting signal."
            />
          ) : (
            <div className="grid grid-cols-1 divide-y divide-border-soft sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
              {services.map((s: Service) => (
                <div key={s._id} className="flex items-center gap-2.5 px-4 py-3 sm:border-b sm:border-border-soft lg:border-r lg:last:border-r-0">
                  <Lamp color={serviceStatusTheme[s.status].color} />
                  <span className="truncate text-sm text-ink">{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
