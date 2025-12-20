/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/App.jsx", // Forçando diretamente o arquivo principal
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}