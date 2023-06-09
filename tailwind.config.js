/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        screens: {
            "2xl": "1633px",
            // => @media (min-width: 1633px) { ... }
        },
        extend: {},
    },
    plugins: [],
}
