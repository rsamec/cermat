import type { Config } from 'tailwindcss';
const plugin = require('tailwindcss/plugin');


const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist:[
    'text-red-600',
    'dark:text-red-100'
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
      
      // const darkDetailsSummary = {
      //   backgroundColor: theme("colors.gray.600")
      // }
      addBase({
        'blockquote p': { textIndent: '0.5rem' },
        'details > summary': {          
          //backgroundColor: theme("colors.gray.600"),
          //color: theme("colors.white"),
          borderColor: theme("colors.gray.600"),
          borderWidth: "1px",
          cursor: 'pointer',
          padding: '.5rem 1rem',
        },
        // '@media (prefers-color-scheme: dark) details > summary': darkDetailsSummary,
        // '.dark details > summary': darkDetailsSummary,
        'details > section': {
          borderWidth: "0px 1px 1px 1px",
          borderColor: theme("colors.gray.600"),
          marginTop: 0,
          padding: "1rem"
        },
        'details > section p:has(+ blockquote)': {
          borderBottomWidth: "1px",
          borderBottomColor: theme("colors.gray.600"),
        },
        'h1': { fontSize: theme('fontSize.xl'), fontWeight: 600 },
        'h2': { fontSize: theme('fontSize.lg') },
        'h3': { fontSize: theme('fontSize.lg'), },
        'hr': { border: 'solid 1px black' },
        //'blockquote': { padding: '5px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'black' },
        '.dark': {
          'blockquote': darkBlockquote
        },
        '@media (prefers-color-scheme: dark)': {
          'blockquote': darkBlockquote
        },
        // 'ol': { listStyleType: 'upper-alpha', listStylePosition: 'inside' },
      })
    }),
    require('tailwindcss-unimportant'),
  ],
  //darkMode: 'class',
}
export default config
