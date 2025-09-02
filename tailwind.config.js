/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Updated default font family to Nunito
                sans: ['Inter', 'sans-serif'], // Sets Inter as the default body font
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Your old palette
        primary: '#0077be',
        'primary-dark': '#005a8e',
        secondary: '#f0f9ff',
        accent: '#ffb703',

        'brand-navy': '#0D1B2A',
        'brand-gold': '#C09A58',
        'brand-cream': '#F1E9DB',

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

        // New water park palette
        'water-blue': {
          light: '#67e8f9', // cyan-300
          DEFAULT: '#06b6d4', // cyan-500
          dark: '#0891b2', // cyan-600
        },
        'sun-yellow': '#fde047', // yellow-300
        'deep-blue': '#0c4a6e', // sky-900
        'foam': '#f0f9ff', // sky-50
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
         backgroundImage: {
        'gold-gradient': 'linear-gradient(145deg, #E6C68A, #B48B4D)',
      }
    },
  },
  plugins: [],
};
