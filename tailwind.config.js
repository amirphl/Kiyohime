/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f2',   // Very light red/pink
          100: '#ffe4e6', // Light red/pink
          200: '#fecdd3', // Soft red/pink
          300: '#fda4af', // Muted coral
          400: '#fb7185', // Soft coral
          500: '#f43f5e', // Main soft red
          600: '#e11d48', // Deeper red
          700: '#be123c', // Rich red
          800: '#9f1239', // Dark red
          900: '#881337', // Very dark red
        },
        lightGreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
} 