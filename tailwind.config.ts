import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Yankees brand colors
        navy: {
          DEFAULT: "#0C2340",
          50: "#E8EBF0",
          100: "#C5CDD9",
          200: "#8A9AB3",
          300: "#4F678D",
          400: "#1E3A5F",
          500: "#0C2340",
          600: "#0A1D36",
          700: "#08172B",
          800: "#061121",
          900: "#040B16",
        },
        gold: {
          DEFAULT: "#C4A747",
          50: "#FAF6E8",
          100: "#F3EAC8",
          200: "#E6D591",
          300: "#D9C05A",
          400: "#C4A747",
          500: "#A68B2E",
          600: "#876F24",
          700: "#68531A",
          800: "#493710",
          900: "#2A1B06",
        },
        pinstripe: "#E5E5E5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
