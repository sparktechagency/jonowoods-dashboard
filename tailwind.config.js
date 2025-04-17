/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#CA3939",
        secondary: "#DE5555",
        baseBg: "#fff",
      },
    },
  },
  plugins: [],
};

// CA3939 + DE5555