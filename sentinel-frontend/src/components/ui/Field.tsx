import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded border border-border bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-brass/70";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-1.5 block text-[10px] text-ink-muted">
        {label}
        {required && <span className="text-brass"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldBase} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldBase} resize-none`} rows={3} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${fieldBase} appearance-none cursor-pointer`} {...props}>
      {props.children}
    </select>
  );
}
