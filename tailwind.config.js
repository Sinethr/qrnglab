/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./public/components/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'quantum': {
          'darkest': '#020202',
          'dark': '#0d2818',
          'medium': '#04471c',
          'light': '#058c42',
          'bright': '#16db65',
        },
        'primary': {
          DEFAULT: '#058c42',
          50: '#e6f7ee',
          100: '#b3e6cc',
          200: '#80d5aa',
          300: '#4dc488',
          400: '#1ab366',
          500: '#058c42',
          600: '#047035',
          700: '#035428',
          800: '#02381b',
          900: '#011c0e',
        },
        'accent': {
          DEFAULT: '#16db65',
          light: '#5fe894',
          dark: '#04471c',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(0deg, rgba(5, 140, 66, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(5, 140, 66, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '30px 30px',
      },
    },
  },
  plugins: [],
}
