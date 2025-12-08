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
        // Primary brand colors from logo
        red: {
          DEFAULT: "#DC2626", // Vibrant red from logo
          dark: "#B91C1C",
          light: "#EF4444",
          bg: "#DC2626", // Solid red background
        },
        gold: {
          DEFAULT: "#FFD700", // Bright gold/yellow from logo
          light: "#FFE44D",
          dark: "#B8860B",
          accent: "#FFC107", // Yellow accent
        },
        emerald: {
          DEFAULT: "#046D5E", // Keep for accents
          dark: "#035048",
          light: "#0A8A77",
        },
        diamond: {
          DEFAULT: "#FFFFFF", // Pure white from logo
          light: "#F8F8F8",
          cream: "#FDFBF6",
        },
        charcoal: {
          DEFAULT: "#141414", // Dark text
          light: "#2A2A2A",
        },
        cream: {
          DEFAULT: "#FDFBF6", // Light background
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        sparkle: "sparkle 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-in",
        "slide-up": "slideUp 0.6s ease-out",
        "parallax": "parallax 20s linear infinite",
      },
      keyframes: {
        sparkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        parallax: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;

