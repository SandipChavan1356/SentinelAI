import { useState } from "react";
import { Plus, Server } from "lucide-react";
import { useServices } from "../api/services";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { ListSkeleton, ErrorPanel, EmptyState } from "../components/ui/States";
import { Lamp } from "../components/ui/Lamp";
import { ServiceStatusBadge } from "../components/incidents/badges";
import { ServiceFormModal } from "../components/services/ServiceFormModal";
import { timeAgo } from "../lib/format";
import { serviceStatusTheme } from "../lib/theme";

export default function ServicesPage() {
  const { data: services, isLoading, isError, refetch } = useServices();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <PageHeader
        eyebrow="FLEET REGISTRY"
        title="Services"
        description="Every service Sentinel watches, and its current health."
        action={
          <Button variant="primary" icon={<Plus size={13} />} onClick={() => setFormOpen(true)}>
            Register Service
          </Button>
        }
      />

      {isLoading ? (
        <Panel noPadding>
          <ListSkeleton rows={5} />
        </Panel>
      ) : isError ? (
        <ErrorPanel message="Couldn't load services." onRetry={() => refetch()} />
      ) : !services || services.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<Server size={18} />}
            title="No services registered"
            description="Register your first service so Sentinel knows what to watch."
            action={
              <Button variant="primary" icon={<Plus size={13} />} onClick={() => setFormOpen(true)}>
                Register Service
              </Button>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Panel key={s._id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lamp color={serviceStatusTheme[s.status].color} size="lg" pulse={s.status === "down"} />
                  <span className="stencil text-lg leading-none">{s.name}</span>
                </div>
                <ServiceStatusBadge status={s.status} />
              </div>
              {s.description && <p className="text-sm text-ink-muted">{s.description}</p>}
              <div className="mt-auto border-t border-border-soft pt-2.5 font-mono text-[10px] text-ink-faint">
                registered {timeAgo(s.createdAt)}
              </div>
            </Panel>
          ))}
        </div>
      )}

      <ServiceFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
