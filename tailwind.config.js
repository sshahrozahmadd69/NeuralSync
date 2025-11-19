/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neural: {
                    bg: '#05050A', // Ultra dark blue/black
                    card: 'rgba(20, 20, 30, 0.6)',
                    border: 'rgba(255, 255, 255, 0.1)',
                    text: '#E2E8F0',
                    muted: '#94A3B8',
                },
                neon: {
                    teal: '#00F0FF', // Cyberpunk teal
                    purple: '#BD00FF', // Electric purple
                    blue: '#2D5BFF', // Deep electric blue
                    green: '#00FF94', // Matrix green
                    red: '#FF0055', // Warning red
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'], // You'll need to import this
            },
            backgroundImage: {
                'mesh-gradient': 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
                'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.00) 100%)',
            },
            boxShadow: {
                'neon-teal': '0 0 20px rgba(0, 240, 255, 0.3)',
                'neon-purple': '0 0 20px rgba(189, 0, 255, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
