import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Siren } from "lucide-react";
import { useIncidents } from "../api/incidents";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Field";
import { ListSkeleton, ErrorPanel, EmptyState } from "../components/ui/States";
import { SeverityBadge, IncidentStatusBadge } from "../components/incidents/badges";
import { Gauge } from "../components/ui/Gauge";
import { IncidentFormModal } from "../components/incidents/IncidentFormModal";
import { timeAgo } from "../lib/format";
import { confidenceColor, severityTheme } from "../lib/theme";
import type { Service } from "../types";

export default function IncidentsPage() {
  const { data: incidents, isLoading, isError, refetch } = useIncidents();
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!incidents) return [];
    return [...incidents]
      .filter((i) => statusFilter === "all" || i.status === statusFilter)
      .sort((a, b) => {
        const sevDiff = severityTheme[b.severity].order - severityTheme[a.severity].order;
        if (sevDiff !== 0) return sevDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [incidents, statusFilter]);

  return (
    <div>
      <PageHeader
        eyebrow="RESPONSE"
        title="Incidents"
        description="Everything Sentinel has flagged, sorted by severity."
        action={
          <Button variant="primary" icon={<Plus size={13} />} onClick={() => setFormOpen(true)}>
            Open Incident
          </Button>
        }
      />

      <div className="mb-4 w-44">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </Select>
      </div>

      <Panel noPadding>
        {isLoading ? (
          <ListSkeleton rows={6} />
        ) : isError ? (
          <ErrorPanel message="Couldn't load incidents." onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Siren size={18} />}
            title={incidents && incidents.length > 0 ? "No matches" : "No incidents"}
            description={incidents && incidents.length > 0 ? "Try a different filter." : "Nothing flagged yet — that's a good thing."}
          />
        ) : (
          <div className="divide-y divide-border-soft">
            {filtered.map((inc) => (
              <Link
                key={inc._id}
                to={`/incidents/${inc._id}`}
                className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-raised/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={inc.severity} />
                    <IncidentStatusBadge status={inc.status} />
                  </div>
                  <div className="truncate text-sm font-medium text-ink">{inc.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-ink-faint">
                    <span>{timeAgo(inc.createdAt)}</span>
                    {Array.isArray(inc.services) && inc.services.length > 0 && (
                      <>
                        <span>·</span>
                        <span>
                          {(inc.services as Service[])
                            .map((s) => (typeof s === "object" ? s.name : s))
                            .join(", ")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {inc.confidence !== undefined && (
                  <Gauge value={inc.confidence} color={confidenceColor(inc.confidence)} size={84} label="" />
                )}
              </Link>
            ))}
          </div>
        )}
      </Panel>

      <IncidentFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
