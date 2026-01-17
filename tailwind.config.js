const animate = require('tailwindcss-animate')

/** @type {import('tailwindcss').Config} */
module.exports = {
darkMode: ["class"],
  safelist: ["dark"],
  content: [
    "./app/app.vue",
    "./app/components/**/*.{vue,js,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [animate],
}
