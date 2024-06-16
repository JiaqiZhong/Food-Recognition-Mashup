/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customColor: '#1c1c1e',
      },
      fontFamily: {
        snell: ['"Brush Script MT"', 'Brush Script Std', 'cursive'],
        georgia: ['"Georgia"', 'serif'],
        serif: ['"serif"']
      },
      backgroundImage: {
        'original': "url('/src/Images/wooden-tray.jpg')",
        'wooden-tray-only': "url('/src/Images/wooden-tray-only.jpg')",
        'button': "url('/src/Images/paper.png')",
      },
      height: {
        custom: 'calc(100vh - 20px)'
      },
      boxShadow: {
        custom: '6px 6px 3px 0px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}

