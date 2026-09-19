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
      fontFamily: {
        display: ['"Archivo Black"', '"Avenir Next"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Yellowtail', 'cursive'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0px #0A0A0A',
        'brutal': '6px 6px 0px #0A0A0A',
        'brutal-lg': '10px 10px 0px #0A0A0A',
        'brutal-gold': '6px 6px 0px #D4A017',
      },
      borderWidth: {
        '3': '3px',
      },
      letterSpacing: {
        'brutal': '-0.03em',
        'tech': '0.12em',
      },
    },
  },
  plugins: [],
}