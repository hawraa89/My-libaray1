/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Noto Sans Arabic', 'sans-serif'],
      },
      colors: {
        'wood': '#2c1810',
        'wood-dark': '#1a0e08',
        'gold': '#d4af37',
        'gold-light': '#f4e5c2',
        'parchment': '#f4e8d0',
      },
      backgroundImage: {
        'wood-texture': "url('/wood-texture.jpg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
