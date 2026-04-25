/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fcf9ed', 100: '#f9f1d2', 200: '#f2e2a8', 300: '#e9cb72',
          400: '#e0b043', 500: '#d4af37', 600: '#c08d2b', 700: '#a36c25',
          800: '#865522', 900: '#71461f', 950: '#41250f',
        },
        accent: {
          50: '#f3f6f4', 100: '#e4ebe6', 200: '#cbdad1', 300: '#a5beb1',
          400: '#799a89', 500: '#556b2f', 600: '#4a5d4e', 700: '#3d4b40',
          800: '#333e35', 900: '#2b342d',
        },
        dark: {
          950: '#050605', 900: '#0a0c0b', 800: '#121513', 750: '#1a1f1b',
          700: '#222823', 600: '#2d352e', 500: '#3d473e', 400: '#5a685b',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0a0c0b 0%, #121513 50%, #1a1f1b 100%)',
        'gold-glow': 'radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.15)',
        'luxury': '0 10px 40px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
