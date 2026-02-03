/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                'xs': '480px',
            },
            colors: {
                // Zendesk-inspired warm neutral + purple brand palette
                zd: {
                    canvas: "#F8F4EF",   // warm off-white background
                    surface: "#FFFFFF",  // cards/nav
                    surface2: "#FBF8F4", // subtle elevated surface
                    ink: "#1F1B1A",      // near-black text
                    muted: "#6E6661",    // secondary text
                    border: "#E6DED6",   // soft borders
                    brand: "#7D59FF",    // purple CTA
                    brand2: "#6B44F7",   // hover/deeper purple
                    brandSoft: "#F1ECFF" // soft purple background
                },
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
            }
        },
    },
    plugins: [],
}
