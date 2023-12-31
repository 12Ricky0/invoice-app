/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0px 10px 20px #47549f40',
        'dark': '0px 10px 20px #00000040'
      },
      backgroundImage: {
        'image-avatar': "url('/assets/image-avatar.jpg')",
        'logo': "url('/assets/logo.svg')",
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        '2': 'repeat(auto-fit, minmax(0, 1fr))'
      },
      colors: {
        'primary': {
          'violet': '#7C5DFA',
          'light-violet': '#9277FF',
          'very-dark-blue': '#1E2139',
          'dark-blue': '#252945',
          'gray': '#373B53'
        },
        'secondary': {
          'light-greyish-blue': '#DFE3FA',
          'greyish-blue': '#888EB0',
          'light-blue': '#7E88C3',
          'black': '#0C0E16'
        },
        'tetiary': {
          'red': '#EC5757',
          'light-red': '#FF9797',
          'light-gray': '#F8F8FB',
          'dark-russian': '#141625',
          'paid': '#33d69f',
          'pending': '#FF8F00'
        }
      }
    },
  },
  plugins: [],
}
