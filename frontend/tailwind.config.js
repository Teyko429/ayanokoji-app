/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayanokoji: {
          dark: '#0a0a0a',
          red: '#8b0000',
          gold: '#c9a84c',
          gray: '#2a2a2a',
        }
      }
    },
  },
  plugins: [],
}
