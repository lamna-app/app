import type { Config } from "tailwindcss";

export default {
  darkMode: "selector",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-bg": "#e4e4e7" /* Light Mode */,
        "dark-bg": "#0a0a0a" /* Dark Mode */,
        "night-bg": "#000000" /* AMOLED (or Midnight) Mode*/,
        "light-bg-text": "#171717",
        "dark-bg-text": "#a1a1aa",
        "night-bg-text": "#d4d4d4",
      },
    },
  },
  plugins: [],
} satisfies Config;
