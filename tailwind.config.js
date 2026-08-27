/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        invion: {
          dark: '#0D1B2A',
          navy: '#102A43',
          turquoise: '#16B3B0',
          mint: '#7FD9D6',
          grayLight: '#F2F4F7',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}