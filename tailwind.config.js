// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        paper: '#F5F1E8',
        gold: '#D4A017',
        olive: '#4A5D3A',
        blush: '#E8A0BF',
        risk: '#C6432B',
        safe: '#7A9B5C',
      },
    },
  },
  plugins: [],
}