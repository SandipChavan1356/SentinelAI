import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Field, Input, Textarea, Select } from "../ui/Field";
import { Button } from "../ui/Button";
import { useCreateIncident } from "../../api/incidents";
import { useServices } from "../../api/services";
import { useToast } from "../ui/Toast";
import type { IncidentSeverity } from "../../types";

export function IncidentFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: services } = useServices();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<IncidentSeverity>("medium");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateIncident();
  const { push } = useToast();

  const reset = () => {
    setTitle("");
    setDescription("");
    setSeverity("medium");
    setSelectedServices([]);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const incident = await mutateAsync({
        title,
        description: description || undefined,
        severity,
        services: selectedServices,
        startedAt: new Date().toISOString(),
      });
      push("success", `Incident "${incident.title}" opened.`);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create incident.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Open Incident">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Checkout failing for EU users" required />
        </Field>
        <Field label="Description">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's happening?" />
        </Field>
        <Field label="Severity">
          <Select value={severity} onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
        </Field>
        <Field label="Affected services" hint={services?.length ? undefined : "No services registered yet."}>
          <div className="flex flex-wrap gap-2">
            {services?.map((s) => {
              const active = selectedServices.includes(s._id);
              return (
                <button
                  type="button"
                  key={s._id}
                  onClick={() => toggleService(s._id)}
                  className={`eyebrow rounded-sm border px-2.5 py-1.5 text-[10px] transition-colors ${
                    active ? "border-brass bg-brass/15 text-brass" : "border-border text-ink-muted hover:text-ink"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </Field>
        {error && <p className="text-sm text-signal-bad">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            Open Incident
          </Button>
        </div>
      </form>
    </Modal>
  );
}
