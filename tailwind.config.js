/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#4361ee',
        correct: '#2ecc71',
        wrong: '#e74c3c',
        'dark-blue': '#0c2d6e',
        'bright-red': '#c62828',
        'light-blue': '#1976d2',
      },
    },
  },
  plugins: [],
};
