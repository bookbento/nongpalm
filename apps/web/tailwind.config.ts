import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0E0D0B',
        paper: '#F5F1EA',
        cream: '#EBE3D5',
        stone: '#D9D1C2',
        taupe: '#8B7E6A',
        bronze: '#8B6F47',
        oxblood: '#5B2424',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.35em',
        editorial: '0.2em',
      },
    },
  },
  plugins: [],
};

export default config;
