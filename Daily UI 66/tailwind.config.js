/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,html}",
  ],
  theme: {
    extend: {
      colors: {
        'chart-pink': '#EC4899',
        'chart-blue': '#3B82F6',
        'chart-yellow': '#EAB308',
        'gauge-blue': '#3B82F6',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}

