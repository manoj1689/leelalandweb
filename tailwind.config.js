/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    
        fontFamily: {
          'charm': ['Charm', 'cursive'], // Adding "Charm" font family
        },
        fontWeight: {
          regular: 400,
          bold: 700,
        },
      },
    
  },
  plugins: [],
}

