/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#66CCFF',
      },
      fontFamily: {
        roboto: ['Roboto_400Regular'],
        robotoMedium: ['Roboto_500Medium'],
        robotoBold: ['Roboto_700Bold'],
        inter: ['Inter_400Regular'],
        interMedium: ['Inter_500Medium'],
        interSemiBold: ['Inter_600SemiBold'],
      },
    },
  },
  plugins: [],
};
