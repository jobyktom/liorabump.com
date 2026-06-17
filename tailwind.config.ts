import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAF7F2",
        surface: "#ffffff",
        mist: "#F5E6D3",
        navy: "#1E293B",
        navySoft: "#334155",
        ink: "#1E293B",
        slate: "#6B7280",
        peach: "#F5E6D3",
        peachDeep: "#C76F5D",
        lavender: "#E8D5E0",
        lavenderDeep: "#A975A7",
        rose: "#E8C4C4",
        sage: "#C5D5C0",
        blue: "#D4E5F0",
        coral: "#E07A5F",
        gold: "#D4AF37",
        safe: "#D4E5F0",
        warning: "#ffdad6"
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(3, 22, 50, 0.08)",
        card: "0 4px 20px rgba(3, 22, 50, 0.05)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
