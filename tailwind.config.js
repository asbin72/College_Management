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
          DEFAULT: '#0b1d3a',
          dark: '#071326',
          light: '#183059',
          accent: '#234478',
        },
        gold: {
          DEFAULT: '#c59b27',
          hover: '#b0881e',
          light: '#f9f5e8',
          border: '#e5d7ad',
        },
        cream: {
          DEFAULT: '#fcfcf9',
          dark: '#f3f4f6'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        num: ['"Wix Madefor Display"', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'academic': '0 10px 30px -10px rgba(11, 29, 58, 0.1)',
        'academic-hover': '0 20px 40px -15px rgba(11, 29, 58, 0.18)',
      }
    },
  },
  plugins: [],
}
