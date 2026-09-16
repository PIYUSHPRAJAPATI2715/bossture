/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d97706',
          light: '#f59e0b',
          dark: '#b45309',
          glow: 'rgba(217, 119, 6, 0.25)'
        },
        royal: {
          DEFAULT: '#1e293b',
          dark: '#0f172a',
          light: '#334155'
        },
        dark: {
          bg: '#f8fafc',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0',
          borderHover: '#cbd5e1'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
