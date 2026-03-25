/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7f9fb",
        surface: "#f7f9fb",
        primary: "#00647c",
        "primary-container": "#007f9d",
        "primary-fixed": "#b7eaff",
        secondary: "#505f76",
        "secondary-container": "#d0e1fb",
        tertiary: "#006947",
        "tertiary-container": "#00855b",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#191c1e",
        "on-surface-variant": "#414754",
        outline: "#717786",
        "outline-variant": "#c1c6d7",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        ambient: "0 20px 48px rgba(25, 28, 30, 0.06)",
        glass: "0 10px 36px rgba(0, 100, 124, 0.10)",
      },
      borderRadius: {
        editorial: "2rem",
      },
      backgroundImage: {
        signature: "linear-gradient(135deg, #00647c 0%, #007f9d 100%)",
      },
    },
  },
  plugins: [],
};
