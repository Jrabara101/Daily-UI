import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "hero-blue": "#1e40af",
                "hero-green": "#22c55e",
                "hero-purple": "#7e22ce",
                "hero-gold": "#fbbf24",
                "comic-black": "#1a1a1a",
            },
            fontFamily: {
                "comic": ["Bangers", "system-ui"],
                "action": ["Luckiest Guy", "cursive"]
            },
        },
    },
    plugins: [
        typography,
        forms,
        aspectRatio,
        containerQueries,
    ],
}
