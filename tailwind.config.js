/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./web/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
