import type { ReactNode } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-[8vh] backdrop-blur-[2px]">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`animate-rise relative w-full ${width} rounded border border-border bg-panel shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
          <h2 className="stencil text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-ink-faint transition-colors hover:bg-raised hover:text-ink"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}
