/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Meti Tejidos (Tonos Tierra y Naturales)
        primary: {
          DEFAULT: '#8D6E63', // Marrón suave (Botones principales, acentos)
          hover: '#6D4C41',    // Marrón más oscuro para hovers
          light: '#D7CCC8',    // Beige rosado pálido (Fondos secundarios)
        },
        secondary: {
          DEFAULT: '#A1887F', // Marrón grisáceo (Texto secundario, bordes)
        },
        background: {
          DEFAULT: '#FDFBF7', // Blanco roto / Crema (Fondo general de la web)
          paper: '#FFFFFF',   // Blanco puro (Tarjetas)
        },
        accent: '#EFEBE9',    // Gris muy cálido (Fondos de secciones alternas)
      },
      fontFamily: {
        // Usamos 'Lora' como la fuente principal para todo
        sans: ['Lora', 'serif'],
        // Opcional: Si algun dia quieres una fuente diferente para titulos
        // heading: ['Montserrat', 'sans-serif'], 
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}