/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0A101C',
          raised: '#101828',
          panel: '#141F30',
          line: '#22314A'
        },
        paper: {
          DEFAULT: '#F7F9FB',
          muted: '#EEF2F6'
        },
        moss: {
          400: '#4ADE9C',
          500: '#2FBE84',
          600: '#1F9C6B'
        },
        tide: {
          400: '#3FD4E0',
          500: '#22B8C7'
        },
        ink: {
          DEFAULT: '#0C1420',
          soft: '#5B6B84'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        float: '0 12px 40px -12px rgba(4, 10, 20, 0.55)',
        card: '0 1px 2px rgba(12, 20, 32, 0.06), 0 8px 24px -8px rgba(12, 20, 32, 0.12)'
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.55' },
          '70%': { transform: 'scale(2.1)', opacity: '0' },
          '100%': { transform: 'scale(2.1)', opacity: '0' }
        }
      }
    }
  },
  plugins: []
}
