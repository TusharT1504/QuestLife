/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom black-and-white color palette
        'jet-black': '#000000',      // Primary Black - Main text, headings, primary buttons
        'charcoal': '#1A1A1A',       // Soft Black - Backgrounds, cards, dark UI elements
        'onyx': '#2E2E2E',           // Dark Gray - Secondary text, dividers, footer
        'dim-gray': '#6E6E6E',       // Medium Gray - Descriptions, placeholders, outlines
        'gainsboro': '#DCDCDC',      // Light Gray - Backgrounds, borders, hover effects
        'smoke': '#F5F5F5',          // Very Light Gray - Section backgrounds, form inputs
        'white': '#FFFFFF',          // Pure White - Main background, text on dark backgrounds
        'snow': '#FAFAFA',           // Off White - Soft backgrounds, minimal design accents
      },
    },
  },
  plugins: [],
} 