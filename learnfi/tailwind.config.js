/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#4c51bf',
        'game-secondary': '#6b46c1',
        'game-dark': '#1a202c',
        'game-light': '#e2e8f0',
      },
      animation: {
        'battle-shake': 'battleShake 0.5s ease-in-out',
      },
      keyframes: {
        battleShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      }
    },
  },
  plugins: [],
}
