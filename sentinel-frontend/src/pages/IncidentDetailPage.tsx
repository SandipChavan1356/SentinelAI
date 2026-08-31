import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, ChevronDown, Clock } from "lucide-react";
import { useIncident, useAnalyzeIncident, useUpdateIncidentStatus } from "../api/incidents";
import { Panel, PanelHeader } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { ErrorPanel, Skeleton } from "../components/ui/States";
import { SeverityBadge, IncidentStatusBadge } from "../components/incidents/badges";
import { Gauge } from "../components/ui/Gauge";
import { useToast } from "../components/ui/Toast";
import { duration, fullTimestamp, timeAgo } from "../lib/format";
import { confidenceColor, incidentStatusTheme } from "../lib/theme";
import type { IncidentStatus, Service } from "../types";

const statusOrder: IncidentStatus[] = ["open", "investigating", "resolved"];

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: incident, isLoading, isError, refetch } = useIncident(id);
  const analyzeMutation = useAnalyzeIncident(id ?? "");
  const statusMutation = useUpdateIncidentStatus(id ?? "");
  const { push } = useToast();
  const [reasoningOpen, setReasoningOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !incident) {
    return <ErrorPanel message="Couldn't load this incident. It may not exist." onRetry={() => refetch()} />;
  }

  const hasAnalysis = Boolean(incident.aiAnalysis?.summary || incident.rootCause);
  const services = (incident.services as Service[]).filter((s) => typeof s === "object");

  const runAnalysis = async () => {
    try {
      await analyzeMutation.mutateAsync();
      push("success", "AI analysis complete.");
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Analysis failed.");
    }
  };

  const setStatus = async (status: IncidentStatus) => {
    if (status === incident.status) return;
    try {
      await statusMutation.mutateAsync(status);
      push("success", `Marked as ${incidentStatusTheme[status].label.toLowerCase()}.`);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Couldn't update status.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/incidents" className="eyebrow mb-4 inline-flex items-center gap-1.5 text-[11px] text-ink-muted hover:text-brass">
        <ArrowLeft size={12} /> Back to Incidents
      </Link>

      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={incident.severity} />
            <IncidentStatusBadge status={incident.status} />
          </div>
          <h1 className="stencil text-3xl leading-tight text-ink sm:text-4xl">{incident.title}</h1>
          {incident.description && <p className="mt-2 max-w-xl text-sm text-ink-muted">{incident.description}</p>}
        </div>
      </div>

      <Panel className="mb-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="eyebrow mb-1.5 text-[10px] text-ink-faint">MARK AS</div>
            <div className="flex gap-1.5">
              {statusOrder.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  disabled={statusMutation.isPending}
                  className={`eyebrow rounded-sm border px-3 py-1.5 text-[10px] transition-colors disabled:opacity-50 ${
                    incident.status === s
                      ? "border-brass bg-brass/15 text-brass"
                      : "border-border text-ink-muted hover:text-ink"
                  }`}
                >
                  {incidentStatusTheme[s].label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-ink-faint">
            <Clock size={12} />
            started {timeAgo(incident.startedAt || incident.createdAt)}
            {incident.resolvedAt && (
              <>
                <span>·</span>
                <span>resolved in {duration(incident.startedAt || incident.createdAt, incident.resolvedAt)}</span>
              </>
            )}
          </div>
        </div>
        {services.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-soft pt-3">
            <span className="eyebrow text-[10px] text-ink-faint">SERVICES</span>
            {services.map((s) => (
              <span key={s._id} className="rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-ink-muted">
                {s.name}
              </span>
            ))}
          </div>
        )}
      </Panel>

      <Panel noPadding>
        <PanelHeader
          eyebrow="SENTINEL AI"
          title="Root Cause Analysis"
          action={
            hasAnalysis && (
              <Button size="sm" variant="outline" icon={<Sparkles size={12} />} loading={analyzeMutation.isPending} onClick={runAnalysis}>
                Re-analyze
              </Button>
            )
          }
        />
        <div className="p-5">
          {!hasAnalysis ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded border border-brass/40 text-brass">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="stencil text-xl text-ink">Not yet analyzed</div>
                <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-muted">
                  Sentinel will review logs from the linked services, recall similar past incidents, and propose a root cause.
                </p>
              </div>
              <Button variant="primary" icon={<Sparkles size={13} />} loading={analyzeMutation.isPending} onClick={runAnalysis}>
                {analyzeMutation.isPending ? "Analyzing…" : "Run AI Analysis"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
              <div className="space-y-5">
                {incident.aiAnalysis?.summary && (
                  <div>
                    <div className="eyebrow mb-1.5 text-[10px] text-brass">SUMMARY</div>
                    <p className="text-sm leading-relaxed text-ink">{incident.aiAnalysis.summary}</p>
                  </div>
                )}
                {(incident.rootCause || incident.aiAnalysis?.rootCause) && (
                  <div>
                    <div className="eyebrow mb-1.5 text-[10px] text-brass">ROOT CAUSE</div>
                    <p className="text-sm leading-relaxed text-ink">{incident.rootCause || incident.aiAnalysis?.rootCause}</p>
                  </div>
                )}
                {incident.aiAnalysis?.suggestedFix && (
                  <div className="rounded border border-signal-good/30 bg-signal-good/5 p-3.5">
                    <div className="eyebrow mb-1.5 text-[10px] text-signal-good">SUGGESTED FIX</div>
                    <p className="text-sm leading-relaxed text-ink">{incident.aiAnalysis.suggestedFix}</p>
                  </div>
                )}
                {incident.aiAnalysis?.reasoning && (
                  <div>
                    <button
                      onClick={() => setReasoningOpen((v) => !v)}
                      className="eyebrow flex items-center gap-1.5 text-[10px] text-ink-muted hover:text-ink"
                    >
                      <ChevronDown size={12} className={`transition-transform ${reasoningOpen ? "rotate-180" : ""}`} />
                      {reasoningOpen ? "Hide reasoning" : "Show reasoning"}
                    </button>
                    {reasoningOpen && (
                      <p className="mt-2 whitespace-pre-wrap rounded border border-border-soft bg-bg p-3 font-mono text-xs leading-relaxed text-ink-muted">
                        {incident.aiAnalysis.reasoning}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-start justify-center md:justify-end">
                <Gauge value={incident.confidence} color={confidenceColor(incident.confidence)} size={140} />
              </div>
            </div>
          )}
        </div>
      </Panel>

      <div className="mt-3 text-center font-mono text-[10px] text-ink-faint">
        opened {fullTimestamp(incident.createdAt)} · id {incident._id}
      </div>
    </div>
  );
}
