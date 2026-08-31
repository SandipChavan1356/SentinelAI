import type { ReactNode } from "react";

interface BadgeProps {
  color: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Badge({ color, children, icon }: BadgeProps) {
  return (
    <span
      className="eyebrow inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[10px]"
      style={{ borderColor: `${color}55`, color, backgroundColor: `${color}14` }}
    >
      {icon}
      {children}
    </span>
  );
}
