import type { HTMLAttributes, ReactNode } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  raised?: boolean;
  noPadding?: boolean;
}

export function Panel({ children, raised = false, noPadding = false, className = "", ...rest }: PanelProps) {
  return (
    <div
      className={`border border-border rounded shadow-panel ${raised ? "bg-raised" : "bg-panel"} ${noPadding ? "" : "p-4"} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
      <div>
        {eyebrow && <div className="eyebrow text-[10px] text-brass mb-0.5">{eyebrow}</div>}
        <div className="stencil text-lg leading-none">{title}</div>
      </div>
      {action}
    </div>
  );
}
