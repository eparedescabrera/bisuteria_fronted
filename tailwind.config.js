/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef4fb',
          100: '#d5e4f5',
          500: '#2f6fed',
          600: '#1f57c8',
          700: '#1a3f8a',
          800: '#142f66',
          900: '#0f234c'
        }
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', 'sans-serif']
      }
    }
  }
};
