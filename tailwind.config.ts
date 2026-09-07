import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          primary: "#5865f2",
          "primary-hover": "#4752c4",
          green: "#35ed7e",
          "green-hover": "#2ecc71",
          magenta: "#ec48bd",
          "magenta-hover": "#d83aab",
          yellow: "#fee75c",
          red: "#ed4245",
          "red-hover": "#c03537",
          link: "#00b0f4",
          canvas: "#0a0d3a",
          "surface-indigo": "#1e2353",
          "surface-onyx": "#23272a",
          "surface-black": "#000000",
          "surface-darker": "#111214",
          "surface-dark": "#1e1f22",
          "surface-medium": "#2b2d31",
          "surface-light": "#313338",
          ink: "#ffffff",
          "ink-dark": "#000000",
          muted: "#949ba4",
          hairline: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Changa One"', '"Impact"', 'system-ui', 'sans-serif'],
        ginto: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xs: "6px",
        sm: "12px",
        md: "14px",
        lg: "16px",
        xl: "40px",
        pill: "50px",
        jumbo: "120px",
      },
      boxShadow: {
        float: "0 8px 32px rgba(88, 101, 242, 0.25)",
        glow: "0 0 24px rgba(236, 72, 189, 0.35)",
        card: "0 4px 20px rgba(0, 0, 0, 0.35)",
      },
      animation: {
        "mesh-slow": "mesh 12s ease-in-out infinite alternate",
        "pulse-glow": "pulseGlow 2.5s infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        mesh: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
