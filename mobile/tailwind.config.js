/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#e17055",
        textPrimary: "#784e2d",
        textSecondary: "#a58e7c",
        textDark: "#50372a",
        placeholderText: "#767676",
        background: "#ede1d1",
        cardBackground: "#faf5eb",
        inputBackground: "#f7f2ea",
        border: "#e2d6c1",
      },
    },
  },
  plugins: [],
};
