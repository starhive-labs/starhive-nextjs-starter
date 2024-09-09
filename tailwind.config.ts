import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5BC0BE', // Light blue
        secondary: '#3A506B', // Darker blue
        completed: '#a5e4c5', // Green for completed
        uncompleted: '#B0BEC5', // Grey for uncompleted
        step: '#e3ebee', // Grey for uncompleted
      },
    },
  },
  plugins: [],
};
export default config;
