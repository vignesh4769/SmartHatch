/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  /* 🔹 tell Tailwind to use the class strategy */
  darkMode: "class",          //  ←  add this line

  theme: {
    extend: {},
  },

  plugins: [require("daisyui")],

  /* daisyUI can still supply its own light & dark palettes */
  daisyui: {
    themes: ["light", "dark"],
  },
};
