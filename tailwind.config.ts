import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f0f13',
          alt: '#13131a',
        },
        surface: {
          DEFAULT: '#1e1e2e',
          alt: '#2a2a3e',
        },
        primary: {
          DEFAULT: '#a78bfa',
          dark: '#7c3aed',
        },
        success: {
          DEFAULT: '#4ade80',
          dark: '#22c55e',
        },
        error: {
          DEFAULT: '#f87171',
          dark: '#ef4444',
        },
        blue: '#38bdf8',
        orange: '#fb923c',
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        'card-lg': '16px',
      },
    },
  },
  plugins: [],
}

export default config
