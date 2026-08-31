import { useState } from "react";
import { Radar, Search, Wifi } from "lucide-react";
import { useVectorSearch } from "../api/incidents";
import { useEmbeddingTest } from "../api/embedding";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel, PanelHeader } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { EmptyState } from "../components/ui/States";
import { useToast } from "../components/ui/Toast";
import { fullTimestamp } from "../lib/format";

export default function RecallPage() {
  const [query, setQuery] = useState("");
  const searchMutation = useVectorSearch();
  const embeddingMutation = useEmbeddingTest();
  const { push } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      await searchMutation.mutateAsync(query.trim());
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Search failed.");
    }
  };

  const handlePing = async () => {
    try {
      const res = await embeddingMutation.mutateAsync("sentinel connectivity check");
      push("success", `Embedding service responding — ${res.dimensions} dimensions.`);
    } catch (err) {
      push("error", err instanceof Error ? err.message : "Embedding service unreachable.");
    }
  };

  const results = searchMutation.data?.results ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="SEMANTIC MEMORY"
        title="Recall"
        description="Search logs and knowledge by meaning, not keywords — the same recall Sentinel uses during analysis."
        action={
          <Button variant="outline" icon={<Wifi size={13} />} loading={embeddingMutation.isPending} onClick={handlePing}>
            Test Connection
          </Button>
        }
      />

      <Panel className="mb-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. database connection pool exhausted under load"
            />
          </div>
          <Button type="submit" variant="primary" icon={<Search size={13} />} loading={searchMutation.isPending}>
            Recall
          </Button>
        </form>
      </Panel>

      <Panel noPadding>
        <PanelHeader eyebrow="RESULTS" title={searchMutation.isSuccess ? `Nearest matches for "${searchMutation.data?.query}"` : "Nearest Matches"} />
        {!searchMutation.isSuccess ? (
          <EmptyState
            icon={<Radar size={18} />}
            title="No query yet"
            description="Describe a symptom or error and Sentinel will surface the closest matching signal from its memory."
          />
        ) : results.length === 0 ? (
          <EmptyState title="No matches found" description="Nothing in memory is close enough to this query yet." />
        ) : (
          <div className="divide-y divide-border-soft">
            {results.map((r) => (
              <div key={r._id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-ink">{r.message || r.title || r.content}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] text-ink-faint">
                    {r.service && <span className="text-brass">{r.service}</span>}
                    {r.level && <span>{r.level}</span>}
                    {r.createdAt && <span>{fullTimestamp(r.createdAt)}</span>}
                  </div>
                </div>
                <div className="shrink-0 rounded-sm border border-border px-2 py-1 font-mono text-xs text-brass">
                  {(r.score * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
