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
          DEFAULT: '#d4af37',
          light: '#f4e4a6',
          dark: '#aa8c2c',
          glow: 'rgba(212, 175, 55, 0.4)'
        },
        dark: {
          bg: '#0a0a0a',
          surface: '#121212',
          card: '#181818',
          border: 'rgba(212, 175, 55, 0.2)',
          borderHover: 'rgba(212, 175, 55, 0.6)'
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
