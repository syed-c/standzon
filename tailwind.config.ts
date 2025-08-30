import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Tinos', 'serif'],
        'body': ['Lato', 'sans-serif'],
        'sans': ['Lato', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['Tinos', 'ui-serif', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Premium Gradients using the new color palette
        'hero-gradient': 'linear-gradient(135deg, #0B0033 0%, #370031 50%, #832232 100%)',
        'premium-gradient': 'linear-gradient(45deg, #0B0033 0%, #370031 100%)',
        'smart-gradient': 'linear-gradient(135deg, #0B0033 0%, #832232 100%)',
        'ai-gradient': 'linear-gradient(135deg, #0B0033 0%, #370031 50%, #CE8964 100%)',
        'neural-gradient': 'linear-gradient(45deg, #0B0033 0%, #370031 25%, #832232 50%, #CE8964 75%, #0B0033 100%)',
        'cosmic-gradient': 'linear-gradient(135deg, #0B0033 0%, #370031 25%, #832232 50%, #CE8964 75%, #0B0033 100%)',
        // Premium specific gradients
        'premium-primary': 'linear-gradient(135deg, #0B0033 0%, #370031 100%)',
        'premium-secondary': 'linear-gradient(135deg, #370031 0%, #832232 100%)',
        'premium-accent': 'linear-gradient(135deg, #832232 0%, #CE8964 100%)',
        'premium-warm': 'linear-gradient(135deg, #CE8964 0%, #832232 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Premium Color Palette - 55% Russian Violet, 25% Dark Purple, 15% Claret, 5% Persian Orange
        'russian-violet': {
          DEFAULT: '#0B0033',
          50: '#F0F0F5',
          100: '#E1E1EB',
          200: '#C3C3D7',
          300: '#A5A5C3',
          400: '#8787AF',
          500: '#0B0033',
          600: '#090029',
          700: '#07001F',
          800: '#050015',
          900: '#03000B',
          950: '#0B0033',
        },
        'dark-purple': {
          DEFAULT: '#370031',
          50: '#F7F0F6',
          100: '#EFE1ED',
          200: '#DFC3DB',
          300: '#CFA5C9',
          400: '#BF87B7',
          500: '#370031',
          600: '#2C0027',
          700: '#21001D',
          800: '#160013',
          900: '#0B0009',
          950: '#370031',
        },
        'claret': {
          DEFAULT: '#832232',
          50: '#F7F0F1',
          100: '#EFE1E3',
          200: '#DFC3C7',
          300: '#CFA5AB',
          400: '#BF878F',
          500: '#832232',
          600: '#681B28',
          700: '#4D141E',
          800: '#320D14',
          900: '#17060A',
          950: '#832232',
        },
        'persian-orange': {
          DEFAULT: '#CE8964',
          50: '#FDF8F5',
          100: '#FBF1EB',
          200: '#F7E3D7',
          300: '#F3D5C3',
          400: '#EFC7AF',
          500: '#CE8964',
          600: '#A56E50',
          700: '#7C523C',
          800: '#523728',
          900: '#291B14',
          950: '#CE8964',
        },
        // Legacy colors for backward compatibility - Updated to new palette
        'primary-blue': '#0B0033', // Russian violet (55%)
        'industry-green': '#370031', // Dark purple (25%)
        'warning-orange': '#F59E0B',
        'deep-navy': '#0B0033', // Russian violet
        'background-gray': '#F8FAFC',
        theme: {
          50: '#F7F0F6', // Dark purple 50
          100: '#EFE1ED', // Dark purple 100
          200: '#DFC3DB', // Dark purple 200
          300: '#CFA5C9', // Dark purple 300
          400: '#BF87B7', // Dark purple 400
          500: '#370031', // Dark purple (25%)
          600: '#2C0027', // Dark purple 600
          700: '#21001D', // Dark purple 700
          800: '#160013', // Dark purple 800
          900: '#0B0009', // Dark purple 900
          950: '#370031', // Dark purple 950
        },
        blue: {
          primary: '#0B0033', // Russian violet (55%)
          light: '#370031', // Dark purple (25%)
          dark: '#832232', // Claret (15%)
          50: '#F0F0F5', // Russian violet 50
          100: '#E1E1EB', // Russian violet 100
          200: '#C3C3D7', // Russian violet 200
          300: '#A5A5C3', // Russian violet 300
          400: '#8787AF', // Russian violet 400
          500: '#0B0033', // Russian violet (55%)
          600: '#090029', // Russian violet 600
          700: '#07001F', // Russian violet 700
          800: '#050015', // Russian violet 800
          900: '#03000B', // Russian violet 900
          950: '#0B0033', // Russian violet 950
        },
        purple: {
          50: '#F7F0F6', // Dark purple 50
          100: '#EFE1ED', // Dark purple 100
          200: '#DFC3DB', // Dark purple 200
          300: '#CFA5C9', // Dark purple 300
          400: '#BF87B7', // Dark purple 400
          500: '#370031', // Dark purple (25%)
          600: '#2C0027', // Dark purple 600
          700: '#21001D', // Dark purple 700
          800: '#160013', // Dark purple 800
          900: '#0B0009', // Dark purple 900
          950: '#370031', // Dark purple 950
        },
        indigo: {
          50: '#F0F0F5', // Russian violet 50
          100: '#E1E1EB', // Russian violet 100
          200: '#C3C3D7', // Russian violet 200
          300: '#A5A5C3', // Russian violet 300
          400: '#8787AF', // Russian violet 400
          500: '#0B0033', // Russian violet (55%)
          600: '#090029', // Russian violet 600
          700: '#07001F', // Russian violet 700
          800: '#050015', // Russian violet 800
          900: '#03000B', // Russian violet 900
          950: '#0B0033', // Russian violet 950
        },
        violet: {
          50: '#F7F0F6', // Dark purple 50
          100: '#EFE1ED', // Dark purple 100
          200: '#DFC3DB', // Dark purple 200
          300: '#CFA5C9', // Dark purple 300
          400: '#BF87B7', // Dark purple 400
          500: '#370031', // Dark purple (25%)
          600: '#2C0027', // Dark purple 600
          700: '#21001D', // Dark purple 700
          800: '#160013', // Dark purple 800
          900: '#0B0009', // Dark purple 900
          950: '#370031', // Dark purple 950
        },
        emerald: {
          50: '#F7F0F1', // Claret 50
          100: '#EFE1E3', // Claret 100
          200: '#DFC3C7', // Claret 200
          300: '#CFA5AB', // Claret 300
          400: '#BF878F', // Claret 400
          500: '#832232', // Claret (15%)
          600: '#681B28', // Claret 600
          700: '#4D141E', // Claret 700
          800: '#320D14', // Claret 800
          900: '#17060A', // Claret 900
          950: '#832232', // Claret 950
        },
        green: {
          50: '#F7F0F1', // Claret 50
          100: '#EFE1E3', // Claret 100
          200: '#DFC3C7', // Claret 200
          300: '#CFA5AB', // Claret 300
          400: '#BF878F', // Claret 400
          500: '#832232', // Claret (15%)
          600: '#681B28', // Claret 600
          700: '#4D141E', // Claret 700
          800: '#320D14', // Claret 800
          900: '#17060A', // Claret 900
          950: '#832232', // Claret 950
        },
        gold: {
          primary: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        gray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: '#DB2777', // Pink-600
          50: '#FCF2F8',
          100: '#FAE8F1',
          200: '#F5D0E1',
          300: '#EDB4CE',
          400: '#E287B1',
          500: '#DB2777', // Main brand color
          600: '#BE185D',
          700: '#9D174D',
          800: '#831843',
          900: '#701A75',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#EC4899', // Rose-500
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899', // Secondary brand color
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        pink: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777', // Primary brand color
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          950: '#701A75',
        },
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },
        // Location highlight color
        'location-highlight': '#dd9568',
        'location-highlight-50': '#fdf8f3',
        'location-highlight-100': '#faf0e6',
        'location-highlight-200': '#f5e1cc',
        'location-highlight-300': '#eec9a3',
        'location-highlight-400': '#e4ac7a',
        'location-highlight-500': '#dd9568',
        'location-highlight-600': '#d17d4f',
        'location-highlight-700': '#b8643f',
        'location-highlight-800': '#955036',
        'location-highlight-900': '#7a4330',
        'location-highlight-950': '#422218',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;