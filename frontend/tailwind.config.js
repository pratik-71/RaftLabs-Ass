/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        primaryHover: '#EA580C',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        textMain: '#1A1A1A',
        textMuted: '#666666',
        border: '#EAEAEA',
        success: '#10B981',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
