/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customColor: '#1c1c1e',
      },
      fontFamily: {
        customFont: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

