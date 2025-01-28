/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode using the class strategy
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        "max-md": { max: "768px" },
        "max-sm": { max: "640px" },
      },
      borderImage: {
        'gradient-radial': 'radial-gradient(13.75% 27.94% at 50% 50%, rgba(39, 73, 98, 0.7) 0%, rgba(45, 72, 92, 0.7) 100%)',
      },
    },
  },
  plugins: [
    require("tailwindcss-border-gradient-radius"),
    require("daisyui"), 
  ],
};
