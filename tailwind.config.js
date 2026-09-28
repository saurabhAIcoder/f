/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070a12',
          900: '#0b0f19',
          850: '#111726',
          800: '#172033',
          700: '#23304a',
          600: '#34466b',
        },
        brand: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          accent: '#6366f1',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
