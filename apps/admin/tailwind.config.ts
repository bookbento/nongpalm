import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171512',
        paper: '#faf8f4',
        surface: '#ffffff',
        line: '#e7e2d8',
        muted: '#8a8377',
        accent: '#5B2424',
        'accent-soft': '#f0e4e4',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
