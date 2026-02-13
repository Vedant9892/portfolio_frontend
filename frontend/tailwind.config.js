/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: 'var(--link)',
        surface: 'var(--surface)',
        background: 'var(--bg)',
        'text': 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
};
