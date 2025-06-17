/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      fontFamily: {
        sans: ['GoogleSans-Regular'],
        medium: ['GoogleSans-Medium'],
        bold: ['GoogleSans-Bold'],
        italic: ['GoogleSans-Italic'],
        'medium-italic': ['GoogleSans-MediumItalic'],
        'bold-italic': ['GoogleSans-BoldItalic'],
      },
    },
  },
  plugins: ['nativewind/babel'],
};
