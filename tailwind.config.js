/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./static/**/*.{html,js}",
    "./views/**/*.{html,js}",
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        lora: ['Lora', 'serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        gold: '#D4AF37',
        brightGold: '#FFD700',
        roseGold: '#f0bf7c',
        teal: '#2AA198',
        softTeal: '#48C9B0',
        rose: '#B76E79',
        softRose: '#F5EBE0',
        softWhite: '#F9F9F9',
        slateGray: '#2E2E2E',
        lightGray: '#E5E5E5',
      },
    },
  },
  plugins: [
  ]
}
