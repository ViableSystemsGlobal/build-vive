/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1c1c1c",
        primary: "#ff4c00", // Your brand orange!
        muted: "#6b7280",
        border: "#e5e7eb",
        input: "#ffffff",
        ring: "#ff4c00",
      },
    },
  },
  plugins: [],
}
