import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // InfoFrankrijk huisstijl
        'ifr': {
          DEFAULT: '#800000',
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#facece',
          300: '#f5abab',
          400: '#ed7a7a',
          500: '#e04f4f',
          600: '#cc3131',
          700: '#ab2525',
          800: '#800000', // Primary
          900: '#6b1c1c',
          950: '#3d0a0a',
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'mulish': ['Mulish', 'sans-serif'],
      },
      lineHeight: {
        'relaxed': '1.8',
      },
    },
  },
  plugins: [],
}
export default config
