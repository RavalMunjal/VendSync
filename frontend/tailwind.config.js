/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        dark: {
          bg: '#0F1117',
          card: '#1A1D27',
          border: '#2A2D3E',
          muted: '#6B7280',
        },
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
    },
  },
  plugins: [],
}
