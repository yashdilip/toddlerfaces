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
        narrow: { raw: '(max-aspect-ratio: 3 / 2)' },
        wide: { raw: '(min-aspect-ratio: 3 / 2)' },
        'taller-than-854': { raw: '(min-height: 854px)' },
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