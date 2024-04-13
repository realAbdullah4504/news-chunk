/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily:{
      robo:['Roboto', 'sans-serif'],
      ply:['Playfair Display', 'serif' ],
      rail:['Raleway', 'sans-serif'],
      ptm:['PT Mono' , ' monospace'],
      mon:['Montserrat' , 'sans-serif']
    }
  },
  plugins: [],
}

