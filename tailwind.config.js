/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/*.{js,ejs,html}", "./src/**/*.{js,ejs,html}"],
    theme: {
        extend: {
            screens: {
                '3xl': '1700px',
            }
        },
    },
    plugins: [],
}

