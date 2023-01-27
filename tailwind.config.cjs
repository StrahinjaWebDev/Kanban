module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        "main-bg": "#f4f5f7",
      },
      keyframes: {
        openDropdown: {
          "0%": {
            opacity: "0",
            scale: "0"
          },
          "100%": {
            opacity: "1",
            scale: "1"
          }
        },
        closeDropdown: {
          "0%": {
            opacity: "1",
            scale: "1"
          },
          "100%": {
            opacity: "0",
            scale: "0"
          }
        }
      }
    },
  },
  plugins: [],
};
