/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0077be',
        'primary-dark': '#005a8e',
        secondary: '#f0f9ff',
        accent: '#ffb703',
        blue: {
          400: '#38b6ff',
          500: '#0077be',
          600: '#005a8e',
          700: '#004068',
        },
        teal: {
          400: '#48d1cc',
          500: '#20c997',
          600: '#00a896',
          700: '#00877a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
 
}