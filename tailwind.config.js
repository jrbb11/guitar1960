/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          darkGray: '#1f2937',
          gray: '#6b7280',
          lightGray: '#d1d5db',
          white: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}
