import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { useKnowledge } from "../api/knowledge";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ListSkeleton, ErrorPanel, EmptyState } from "../components/ui/States";
import { KnowledgeFormModal } from "../components/knowledge/KnowledgeFormModal";
import { timeAgo } from "../lib/format";

export default function KnowledgePage() {
  const { data: entries, isLoading, isError, refetch } = useKnowledge();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <PageHeader
        eyebrow="INSTITUTIONAL MEMORY"
        title="Knowledge"
        description="Playbook entries Sentinel recalls when investigating new incidents."
        action={
          <Button variant="primary" icon={<Plus size={13} />} onClick={() => setFormOpen(true)}>
            Add Entry
          </Button>
        }
      />

      {isLoading ? (
        <Panel noPadding>
          <ListSkeleton rows={4} />
        </Panel>
      ) : isError ? (
        <ErrorPanel message="Couldn't load the knowledge base." onRetry={() => refetch()} />
      ) : !entries || entries.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<BookOpen size={18} />}
            title="Nothing recorded yet"
            description="Add a playbook entry so Sentinel can recall it during future investigations."
            action={
              <Button variant="primary" icon={<Plus size={13} />} onClick={() => setFormOpen(true)}>
                Add Entry
              </Button>
            }
          />
        </Panel>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Panel key={entry._id}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="stencil text-xl leading-none">{entry.title}</span>
                <div className="flex items-center gap-2">
                  <Badge color={entry.source === "incident" ? "#C97A3B" : "#7E8791"}>{entry.source}</Badge>
                  <span className="font-mono text-[10px] text-ink-faint">{timeAgo(entry.createdAt)}</span>
                </div>
              </div>
              <p className="text-sm text-ink-muted">{entry.content}</p>
              <div className="mt-3 rounded border border-signal-good/25 bg-signal-good/5 p-3">
                <div className="eyebrow mb-1 text-[10px] text-signal-good">SOLUTION</div>
                <p className="text-sm text-ink">{entry.solution}</p>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <KnowledgeFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
