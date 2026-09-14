import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        gray: {
          50: "rgb(var(--g50) / <alpha-value>)",
          100: "rgb(var(--g100) / <alpha-value>)",
          200: "rgb(var(--g200) / <alpha-value>)",
          300: "rgb(var(--g300) / <alpha-value>)",
          400: "rgb(var(--g400) / <alpha-value>)",
          500: "rgb(var(--g500) / <alpha-value>)",
          600: "rgb(var(--g600) / <alpha-value>)",
          700: "rgb(var(--g700) / <alpha-value>)",
          800: "rgb(var(--g800) / <alpha-value>)",
          900: "rgb(var(--g900) / <alpha-value>)",
          950: "rgb(var(--g950) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'Geist Mono'", "ui-monospace", "monospace"],
        pixel: ["'Geist Pixel'", "'Geist Mono'", "monospace"],
        serif: ["'Source Serif 4'", "Georgia", "serif"],
      },
      boxShadow: {
        "bryl-card": "0 8px 22px -14px rgba(10, 10, 10, 0.25)",
        "bryl-card-hover": "0 18px 36px -20px rgba(10, 10, 10, 0.40)",
        "bryl-modal": "0 40px 90px -20px rgba(10, 10, 10, 0.35)",
        "deck-center": "0 26px 55px -22px rgba(10, 10, 10, 0.30)",
        "deck-side": "0 16px 32px -18px rgba(10, 10, 10, 0.25)",
      },
      borderRadius: {
        card: "16px",
        item: "12px",
        sub: "8px",
        minimal: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
