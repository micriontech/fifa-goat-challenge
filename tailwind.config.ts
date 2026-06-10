import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#EF9F27",
        "gold-light": "#F5BC5C",
        "gold-dark": "#C8851F",
        bg: "#0a0a1a",
        "bg-card": "#12122a",
        "bg-card2": "#1a1a35",
      },
      animation: {
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 10px #EF9F27" },
          "50%": { boxShadow: "0 0 30px #EF9F27, 0 0 60px #EF9F27" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          from: { textShadow: "0 0 10px #EF9F27" },
          to: { textShadow: "0 0 20px #EF9F27, 0 0 40px #EF9F27" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
