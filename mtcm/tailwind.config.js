/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",   // adjust if you keep code elsewhere
  ],

  darkMode: "class",               // toggle by adding/removing `.dark` on <html> or <body>

  theme: {
    extend: {
      /* ----------  Palette  ---------- */
      colors: {
        "brand-black":  "#000000",
        "brand-purple": "#7400b8",
        "brand-violet": "#3c096c",
        "brand-navy":   "#240046",
        "brand-oxford": "#10002b",
        "brand-sky":    "#4895ef",
        "brand-white":  "#ffffff",
      },

      /* ----------  Typography  ---------- */
      fontFamily: {
        garamond:   ['"EB Garamond"', "serif"],
        tinos:      ['"Tinos"', "serif"],
        tangerine:  ['"Tangerine"', "cursive"],
      },
    },
  },

  plugins: [],                      // add official plugins here if needed
};
