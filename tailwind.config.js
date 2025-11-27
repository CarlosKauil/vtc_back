import colors from 'tailwindcss/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    
  ],
  theme: {
    extend: {
      colors,

      fontFamily: {
        // Fuente base del sitio
        orbitron: ['Orbitron', 'Montserrat', 'sans-serif'],

        // Fuente específica
        'zen-dots': ['"Zen Dots"', 'sans-serif'],
      },

      animation: {
        'fade-in': 'fadeIn 1.1s ease',
        'spin-slow': 'spin 6s linear infinite',
        'bounce': 'bounce 1.2s',
        'text-gradient': 'textGradient 2s linear infinite',
        'pulse': 'pulse 1.5s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(15px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        textGradient: {
          '0%,100%': { color: '#00fff3' },
          '50%': { color: colors.cyan[400] },
        },
      },
    },
  },
  plugins: [],
};
