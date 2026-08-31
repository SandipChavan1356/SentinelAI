import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Field, Input, Textarea, Select } from "../ui/Field";
import { Button } from "../ui/Button";
import { useCreateService } from "../../api/services";
import { useToast } from "../ui/Toast";
import type { ServiceStatus } from "../../types";

export function ServiceFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ServiceStatus>("healthy");
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateService();
  const { push } = useToast();

  const reset = () => {
    setName("");
    setDescription("");
    setStatus("healthy");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await mutateAsync({ name, description: description || undefined, status });
      push("success", `Service "${name}" registered.`);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Register Service">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="payments-api" required />
        </Field>
        <Field label="Description" hint="What does this service do?">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Handles checkout and payment processing"
          />
        </Field>
        <Field label="Initial status">
          <Select value={status} onChange={(e) => setStatus(e.target.value as ServiceStatus)}>
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="down">Down</option>
          </Select>
        </Field>
        {error && <p className="text-sm text-signal-bad">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            Register
          </Button>
        </div>
      </form>
    </Modal>
  );
}
