/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'warm-bg': '#fefcf6',
        'warm-bg-dark': '#f7f3eb',
        'accent': 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'warm-text': '#5c4a3d',
        'warm-text-muted': '#a09080',
        'warm-border': '#e8ddd0',
        'warm-panel': '#f5efe6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
