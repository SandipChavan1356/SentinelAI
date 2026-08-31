import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { clockTime } from "../../lib/format";

type ToastKind = "success" | "error" | "info";

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  push: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const kindColor: Record<ToastKind, string> = {
  success: "#5E9271",
  error: "#BD4433",
  info: "#7E8791",
};

const kindIcon: Record<ToastKind, ReactNode> = {
  success: <CheckCircle2 size={15} />,
  error: <XCircle size={15} />,
  info: <Info size={15} />,
};

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="animate-rise pointer-events-auto flex items-start gap-2.5 rounded border border-border bg-raised px-3.5 py-3 shadow-2xl"
              style={{ borderLeftColor: kindColor[t.kind], borderLeftWidth: "3px" }}
            >
              <span style={{ color: kindColor[t.kind] }} className="mt-0.5">
                {kindIcon[t.kind]}
              </span>
              <div className="flex-1">
                <div className="font-mono text-[10px] text-ink-faint">{clockTime(new Date().toISOString())}</div>
                <div className="text-sm text-ink">{t.message}</div>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
