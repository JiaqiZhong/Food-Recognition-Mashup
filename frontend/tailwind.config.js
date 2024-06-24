/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        secondaryButtonColor: '#D0C6BD',
        gridColor: '#4C3228',
      },
      fontFamily: {
        snell: ['"Brush Script MT"', 'Brush Script Std', 'cursive'],
        georgia: ['"Georgia"', 'serif'],
        serif: ['"serif"']
      },
      backgroundImage: {
        'original': "url('/src/Images/wooden-tray.jpg')",
        'wooden-tray-only': "url('/src/Images/wooden-tray-only.jpg')",
        'button': "url('/src/Images/sticker.png')",
        'notebook': "url('/src/Images/notebook.png')",
        'paper': "url('/src/Images/paper.png')",
      },
      backgroundSize: {
        '100': '100% 100%',
      },
      height: {
        custom: 'calc(100vh - 20px)'
      },
      boxShadow: {
        custom: '6px 6px 3px 0px rgba(0, 0, 0, 0.5)',
        image: '20px 20px 0px 0px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ]
}