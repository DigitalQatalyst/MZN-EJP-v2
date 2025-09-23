/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Colors for map markers and categories
    "bg-blue-100",
    "bg-blue-500",
    "bg-blue-700",
    "text-blue-500",
    "text-blue-700",
    "bg-purple-100",
    "bg-purple-500",
    "bg-purple-700",
    "text-purple-500",
    "text-purple-700",
    "bg-green-100",
    "bg-green-500",
    "bg-green-700",
    "text-green-500",
    "text-green-700",
    "bg-yellow-100",
    "bg-yellow-500",
    "bg-yellow-700",
    "text-yellow-500",
    "text-yellow-700",
    "bg-red-100",
    "bg-red-500",
    "bg-red-700",
    "text-red-500",
    "text-red-700",
    "bg-gray-100",
    "bg-gray-500",
    "bg-gray-700",
    "text-gray-500",
    "text-gray-700",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0030E3",
          dark: "#002080",
          light: "#99B2FF",
        },
        teal: {
          DEFAULT: "#00E5D1",
          dark: "#00665C",
          light: "#99FFF5",
        },
        purple: {
          DEFAULT: "#954BF9",
          dark: "#4F2E80",
          light: "#C499FF",
        },
      },
      fontFamily: {
        display: ["Palatino", "serif"],
        body: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      zIndex: {
        400: 400,
      },
    },
  },
  plugins: [],
};
