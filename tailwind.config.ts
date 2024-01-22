import type { Config } from 'tailwindcss';
const plugin = require('tailwindcss/plugin');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    plugin(function ({ addBase, theme }: { addBase: (o: object) => void, theme: (classNames: string) => string }) {
      const darkBlockquote = {
        borderColor: 'white',
      }
      addBase({
        'h1': { fontSize: theme('fontSize.2xl'), fontWeight: 600 },
        'h2': { fontSize: theme('fontSize.lg'), },
        'h3': { fontSize: theme('fontSize.lg'), },
        'hr': { border: 'solid 1px black' },
        'blockquote': { padding: '10px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' },
        '.dark': {
          'blockquote': darkBlockquote
        },
        '@media (prefers-color-scheme: dark)': {
          'blockquote': darkBlockquote
        },
        // 'ol': { listStyleType: 'upper-alpha', listStylePosition: 'inside' },
      })
    })
  ],
  darkMode: 'class',
}
export default config
