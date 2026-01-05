/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFC700', // Tu amarillo icónico
          dark: '#1A1A1A',   // Fondo principal oscuro
          surface: '#252525', // Para tarjetas (ligeramente más claro)
          gray: '#B0B0B0',   // Texto secundario
        }
      },
      fontFamily: {
        // Quicksand para textos largos
        sans: ['Quicksand', 'sans-serif'],
        // Anton para títulos impactantes
        display: ['Anton', 'sans-serif'],
      },
      boxShadow: {
        // Un resplandor dorado sutil para botones y tarjetas destacadas
        'neon': '0 0 15px rgba(255, 199, 0, 0.4)',
      },
      backgroundImage: {
        // Un degradado sutil para fondos premium
        'dark-gradient': 'linear-gradient(to bottom, #1A1A1A, #111111)',
      }
    },
  },
  plugins: [],
}