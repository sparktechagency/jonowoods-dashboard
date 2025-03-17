/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4E9DAB",
        secondary: "#336C79",
        baseBg: "#FAF2DF",
      },
    },
  },
  plugins: [],
};