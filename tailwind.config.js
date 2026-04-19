/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'esports-gold': '#FFD700',
        'esports-gold-alt': '#F5C542',
        'esports-blue': '#00CFFF',
        'esports-green': '#39FF14',
        'esports-orange': '#FF4500',
        'navy-deep': '#0b0f2a',
        'navy-darker': '#050816',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(to bottom, #0b0f2a, #050816)',
      },
      boxShadow: {
        'neon-gold': '0 0 15px rgba(255, 215, 0, 0.4)',
        'neon-blue': '0 0 15px rgba(0, 207, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
