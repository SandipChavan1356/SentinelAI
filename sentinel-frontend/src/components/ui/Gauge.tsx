interface GaugeProps {
  value: number | undefined;
  color: string;
  size?: number;
  label?: string;
}

export function Gauge({ value, color, size = 128, label = "CONFIDENCE" }: GaugeProps) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  const width = size;
  const height = size * 0.62;

  return (
    <div className="flex flex-col items-center" style={{ width }}>
      <svg viewBox="0 0 120 70" width={width} height={height}>
        <path
          d="M10,62 A50,50 0 0 1 110,62"
          fill="none"
          stroke="#332E24"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {value !== undefined && (
          <path
            d="M10,62 A50,50 0 0 1 110,62"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 - v}
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
          />
        )}
        <text
          x="60"
          y="52"
          textAnchor="middle"
          className="font-mono font-semibold"
          fontSize="22"
          fill="#EDE7D8"
        >
          {value !== undefined ? Math.round(v) : "—"}
        </text>
      </svg>
      <div className="eyebrow text-[10px] text-ink-faint -mt-1">{label}</div>
    </div>
  );
}
