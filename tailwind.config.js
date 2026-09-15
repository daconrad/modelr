/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        formal: {
          light: '#3b82f6',
          DEFAULT: '#1d4ed8',
          dark: '#1e40af',
        },
        functional: {
          light: '#10b981',
          DEFAULT: '#059669',
          dark: '#047857',
        }
      }
    },
  },
  plugins: [],
}
