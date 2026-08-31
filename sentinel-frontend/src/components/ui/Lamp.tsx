interface LampProps {
  color: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const sizes = {
  sm: "w-1.5 h-1.5",
  md: "w-2.5 h-2.5",
  lg: "w-3.5 h-3.5",
};

export function Lamp({ color, size = "md", pulse = false, className = "" }: LampProps) {
  return (
    <span
      className={`inline-block shrink-0 rounded-[2px] shadow-lamp ${sizes[size]} ${pulse ? "animate-blink" : ""} ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

interface LampLabelProps extends LampProps {
  label: string;
  mono?: boolean;
}

export function LampLabel({ label, mono = false, ...lampProps }: LampLabelProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Lamp {...lampProps} />
      <span className={mono ? "font-mono text-xs tracking-wide" : "text-sm"}>{label}</span>
    </span>
  );
}
