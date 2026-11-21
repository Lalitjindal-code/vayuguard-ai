/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#090E14',
        surface: '#111822',
        elevated: '#192332',
        subtle: '#263447',
        accent: {
          emerald: '#10B981',
          cyan: '#38BDF8',
          amber: '#F59E0B',
          orange: '#F97316',
          crimson: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
