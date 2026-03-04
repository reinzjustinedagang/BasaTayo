
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Baloo 2"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        basa: {
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          success: '#95E1D3',
          bg: '#F7FFF7',
          text: '#2C3E50',
        }
      },
      boxShadow: {
        'bouncy': '0 8px 0 0 rgba(0,0,0,0.15)',
        'bouncy-active': '0 2px 0 0 rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
