/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",   // 👈 move this outside theme
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./main.jsx", // Add this since main.jsx is in root
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
