/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1a202c', // Dark navy blue from screenshot
        'dark-blue-light': '#2d3748', // Lighter version of dark blue
        'teal': '#20a39e',
        'ivory': '#f8f9fa',
        'red': '#e53e3e', // Red for emergency button
        'navy': '#131b2c', // Even darker navy for backgrounds
        'navy-light': '#1c2639', // Lighter version of navy for borders and accents
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out',
        'bounce': 'bounce 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        }
      },
    },
  },
  plugins: [],
}