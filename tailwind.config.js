const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      boxShadow: {
        highlight: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      screens: {
        'mobile': '475px',
        'tablet': '640px',  
        'laptop': '1024px',  
        'desktop': '1280px',
        'narrow': { raw: '(max-aspect-ratio: 13/20)' },
        'wide': { raw: '(min-aspect-ratio: 3/2)' },
        'taller-than-854': { raw: '(min-height: 854px)' },
      },
      keyframes: {
        'open-menu': {
          '0%': { transform: 'scaleY(0)'},
          '80%': { transform: 'scaleY(1.2)'},
          '100%': { transform: 'scaleY(1)'},
        }
      },
      animation: {
        'open-menu': 'open-menu 0.5s ease-in-out forwards',
      },
      fontFamily: {
        sans: [
          'Inter',
          ...defaultTheme.fontFamily.sans
        ]
      }
    },
  },
  variants: {},
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: { removeViewBox: false },
      },
    },
  ],
  darkMode: "class"
}