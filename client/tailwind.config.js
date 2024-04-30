/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B0C10",
        text: "#C5C6C7",
        icon: "#66FCF1",
        background: "#1F2833",
        effect: "#45A29E",
      },
    },
  },
  plugins: [],
};
