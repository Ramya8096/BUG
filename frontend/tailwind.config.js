/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        'status-open': '#3b82f6',
        'status-in-progress': '#eab308',
        'status-resolved': '#22c55e',
        'status-closed': '#6b7280',
        'priority-low': '#22c55e',
        'priority-medium': '#3b82f6',
        'priority-high': '#ef4444',
      }
    },
  },
  plugins: [],
}
