/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          surface: 'rgba(15, 23, 42, 0.85)',
          border: 'rgba(148, 163, 184, 0.2)',
        }
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'waveform': 'waveform-pulse 0.8s ease-in-out infinite alternate',
        'card-enter': 'card-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.25s ease both',
        'chip-pop': 'chip-pop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      keyframes: {
        'waveform-pulse': {
          '0%': { transform: 'scaleY(0.2)' },
          '100%': { transform: 'scaleY(1.0)' },
        },
        'card-enter': {
          'from': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'chip-pop': {
          'from': { opacity: '0', transform: 'scale(0) rotate(-8deg)' },
          'to': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
};
