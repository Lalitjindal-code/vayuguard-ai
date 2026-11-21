/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#060A0F',
        surface: '#0B111A',
        elevated: '#121A27',
        subtle: '#1E293B',
        brutal: {
          dark: '#060A0F',
          card: '#0B111A',
          border: '#334155',
          black: '#000000',
          emerald: '#10B981',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          orange: '#F97316',
          crimson: '#EF4444',
          purple: '#A855F7',
        },
        accent: {
          emerald: '#10B981',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          orange: '#F97316',
          crimson: '#EF4444',
          purple: '#A855F7',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-emerald': '4px 4px 0px 0px #10B981',
        'brutal-cyan': '4px 4px 0px 0px #06B6D4',
        'brutal-amber': '4px 4px 0px 0px #F59E0B',
        'brutal-red': '4px 4px 0px 0px #EF4444',
        'brutal-purple': '4px 4px 0px 0px #A855F7',
      }
    },
  },
  plugins: [],
}
