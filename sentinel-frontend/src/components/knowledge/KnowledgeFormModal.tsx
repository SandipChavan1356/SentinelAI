import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Field, Input, Textarea } from "../ui/Field";
import { Button } from "../ui/Button";
import { useCreateKnowledge } from "../../api/knowledge";
import { useToast } from "../ui/Toast";

export function KnowledgeFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [solution, setSolution] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateKnowledge();
  const { push } = useToast();

  const reset = () => {
    setTitle("");
    setContent("");
    setSolution("");
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
      await mutateAsync({ title, content, solution });
      push("success", "Knowledge entry saved.");
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Knowledge Entry">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Redis connection pool exhaustion" required />
        </Field>
        <Field label="Context" required hint="What's the problem or situation this covers?">
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </Field>
        <Field label="Solution" required hint="How was it fixed, or how should it be fixed?">
          <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} required />
        </Field>
        {error && <p className="text-sm text-signal-bad">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            Save Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
}
