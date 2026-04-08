/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'ecto-green': '#39ff14',
        'ghost-white': '#f8f8ff',
        'trap-black': '#1a1a1a',
        'plasma-purple': '#b026ff',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'beam': 'beam 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        beam: {
          '0%': { opacity: '0.3', height: '0%' },
          '50%': { opacity: '1', height: '100%' },
          '100%': { opacity: '0.3', height: '0%' },
        }
      }
    }
  },
  plugins: [],
}
