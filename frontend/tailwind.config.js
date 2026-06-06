/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // indigo
        success: "#10B981", // emerald
        warning: "#F59E0B", // amber
        danger: "#EF4444",  // red
      }
    },
  },
  plugins: [],
}
