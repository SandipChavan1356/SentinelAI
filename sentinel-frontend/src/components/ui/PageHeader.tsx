import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="eyebrow mb-1 text-[11px] text-brass">{eyebrow}</div>
        <h1 className="stencil text-3xl leading-none text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
