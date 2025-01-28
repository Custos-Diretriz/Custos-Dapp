/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
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
      fontFamily: {
        sans: ['var(--font-outfit)'],
      },
      fontSize: {
        'h6': ['14px', {
          lineHeight: '20px',
          fontWeight: '400',
        }],
      }
    },
  },
  plugins: [
    require("tailwindcss-border-gradient-radius"),
    require("daisyui"), // Ensure the plugin is placed correctly
  ],
};
