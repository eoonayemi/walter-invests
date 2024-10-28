import tailwindScrollbar from "tailwind-scrollbar";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "my-blue": "#0080FF",
        "my-t-blue": "rgba(0, 90, 180, 0.3)",
        "my-t-white-1": "rgba(255, 255, 255, 0.1)",
        "my-t-white-2": "rgba(255, 255, 255, 0.5)"
      },
      boxShadow: {
        "my-shadow":
          "3px 2px 5px 0 rgba(0, 0, 0, 0.05), -2px -3px 5px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [tailwindScrollbar({ nocompatible: true, preferredStrategy: 'pseudoelements' })],
};
