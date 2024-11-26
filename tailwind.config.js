module.exports = {
  mode: 'jit',
  content: ["./**/*.{html,js}"],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}
