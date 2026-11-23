/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fbf8f5',
          100: '#f6ece1',
          200: '#edd8c3',
          300: '#dfbc9b',
          400: '#ce9a6f',
          500: '#b87b47',
          600: '#9b5f33',
          700: '#7e4729',
          800: '#5c331e',
          900: '#3a1e12',
          950: '#231109',
        },
        espresso: {
          800: '#23130d',
          850: '#1c0f0a',
          900: '#140a06',
          950: '#0c0603',
        },
        caramel: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        crema: '#fbf4ea',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0.4' },
          '50%': { transform: 'translateY(-10px) scaleX(1.1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-20px) scaleX(1.2)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'steam-slow': 'steam 3s ease-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-up': 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
