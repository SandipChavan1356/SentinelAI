import { useMemo, useState } from "react";
import { Plus, ScrollText } from "lucide-react";
import { useLogs } from "../api/logs";
import { useServices } from "../api/services";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Field";
import { ListSkeleton, ErrorPanel, EmptyState } from "../components/ui/States";
import { Lamp } from "../components/ui/Lamp";
import { LogFormModal } from "../components/logs/LogFormModal";
import { levelTheme } from "../lib/theme";
import { fullTimestamp } from "../lib/format";

export default function LogsPage() {
  const { data: logs, isLoading, isError, refetch } = useLogs();
  const { data: services } = useServices();
  const [serviceFilter, setServiceFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!logs) return [];
    return logs
      .filter((l) => serviceFilter === "all" || (typeof l.service === "object" ? l.service._id : l.service) === serviceFilter)
      .filter((l) => levelFilter === "all" || l.level?.toLowerCase() === levelFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [logs, serviceFilter, levelFilter]);

  return (
    <div>
      <PageHeader
        eyebrow="TELEMETRY"
        title="Logs"
        description="Raw signal from every registered service."
        action={
          <Button variant="primary" icon={<Plus size={13} />} onClick={() => setFormOpen(true)}>
            Ingest Log
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-44">
          <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
            <option value="all">All services</option>
            {services?.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-36">
          <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
            <option value="all">All levels</option>
            <option value="debug">debug</option>
            <option value="info">info</option>
            <option value="warn">warn</option>
            <option value="error">error</option>
          </Select>
        </div>
      </div>

      <Panel noPadding>
        {isLoading ? (
          <ListSkeleton rows={8} />
        ) : isError ? (
          <ErrorPanel message="Couldn't load logs." onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ScrollText size={18} />}
            title="No logs match"
            description={logs && logs.length > 0 ? "Try clearing your filters." : "Ingest a log entry to see it here."}
          />
        ) : (
          <div className="divide-y divide-border-soft font-mono text-xs">
            {filtered.map((log) => {
              const t = levelTheme(log.level);
              const svc = typeof log.service === "object" ? log.service.name : "unknown";
              return (
                <div key={log._id} className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-start sm:gap-3">
                  <span className="shrink-0 text-ink-faint">{fullTimestamp(log.createdAt)}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <Lamp color={t.color} size="sm" />
                    <span style={{ color: t.color }}>{t.label}</span>
                  </span>
                  <span className="shrink-0 text-brass">{svc}</span>
                  <span className="min-w-0 flex-1 break-words text-ink">{log.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <LogFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
