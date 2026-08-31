import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
  icon?: ReactNode;
}

const base =
  "eyebrow inline-flex items-center justify-center gap-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";

const variants: Record<string, string> = {
  primary: "bg-brass text-bg hover:bg-brass-strong",
  outline: "border border-border text-ink hover:border-brass/60 hover:text-brass",
  ghost: "text-ink-muted hover:text-ink hover:bg-raised",
  danger: "border border-signal-bad/50 text-signal-bad hover:bg-signal-bad/10",
};

const sizes: Record<string, string> = {
  sm: "text-[10px] px-2.5 py-1.5",
  md: "text-xs px-4 py-2.5",
};

export function Button({
  children,
  variant = "outline",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}
