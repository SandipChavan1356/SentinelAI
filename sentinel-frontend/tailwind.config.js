/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#16140F",
        panel: "#1D1A15",
        raised: "#262119",
        border: {
          DEFAULT: "#332E24",
          soft: "#26221A",
        },
        ink: {
          DEFAULT: "#EDE7D8",
          muted: "#9A9284",
          faint: "#655D50",
        },
        brass: {
          DEFAULT: "#D9A441",
          strong: "#EFC066",
          dim: "#8C6B2C",
        },
        signal: {
          good: "#5E9271",
          warn: "#C9A227",
          high: "#C97A3B",
          bad: "#BD4433",
          info: "#7E8791",
        },
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', "sans-serif"],
        cond: ['"Big Shoulders"', "sans-serif"],
        sans: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
      },
      boxShadow: {
        lamp: "inset 0 1px 1px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.08)",
        panel: "0 1px 0 rgba(0,0,0,0.3)",
      },
      keyframes: {
        blink: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
        rise: { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
      animation: {
        blink: "blink 1.6s ease-in-out infinite",
        rise: "rise 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
