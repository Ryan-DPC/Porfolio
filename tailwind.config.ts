import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Dark theme colors
                'dark-bg': '#0A1929',
                'dark-surface': '#132F4C',
                'dark-border': '#1E3A5F',

                // Accent colors
                'electric-blue': '#0EA5E9',
                'electric-blue-dark': '#0284C7',

                // Light theme colors
                'light-bg': '#FFFFFF',
                'light-surface': '#F3F4F6',
                'light-border': '#E5E7EB',

                // Text colors
                'text-primary': '#1F2937',
                'text-secondary': '#6B7280',
                'text-dark-primary': '#F9FAFB',
                'text-dark-secondary': '#D1D5DB',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
