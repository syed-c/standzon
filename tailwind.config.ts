import type { Config } from 'tailwindcss';

/**
 * Brand palette — 3 colours only:
 *   surface = cool porcelain white (#F5F6F7), cards a touch lighter
 *   RED     = #E03A3A  (single highlight / accent / CTA)
 *   INK     = #252525  (text + all dark sections)
 * Semantic greens (verified/active) and ambers (rating stars) are kept as-is.
 */
const RED = {
  50: '#FEF2F2', 100: '#FDE3E3', 200: '#FAC5C5', 300: '#F49B9B', 400: '#EC6A6A',
  500: '#E03A3A', 600: '#CC2E2E', 700: '#AC2424', 800: '#8C1F1F', 900: '#741C1C',
  950: '#400C0C', primary: '#E03A3A', light: '#EC6A6A', dark: '#CC2E2E',
  DEFAULT: '#E03A3A', foreground: '#FFFFFF',
} as const;

const INK = {
  50: '#F5F6F7', 100: '#E9EAEB', 200: '#D6D7D8', 300: '#B4B5B6', 400: '#828384',
  500: '#5B5C5D', 600: '#434444', 700: '#333434', 800: '#2B2B2B', 900: '#252525',
  950: '#1A1A1A', primary: '#252525', light: '#434444', dark: '#1A1A1A',
  DEFAULT: '#252525', foreground: '#FFFFFF',
} as const;

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'font-helvetica',
    'font-inter',
    'font-poppins',
    'font-roboto',
    'font-montserrat',
    'font-trebuchet',
  ],
  theme: {
    screens: {
      'xs': '360px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 2vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'fluid-base': 'clamp(1rem, 3.2vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3.5vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 4vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 5vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.875rem, 6vw, 2.25rem)',
        'fluid-4xl': 'clamp(2.25rem, 7vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 8vw, 3.75rem)',
        'fluid-6xl': 'clamp(3.75rem, 9vw, 4.5rem)',
        'fluid-7xl': 'clamp(4.5rem, 10vw, 6rem)',
        'h1': ['clamp(24px, 6vw, 48px)', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['clamp(20px, 5vw, 36px)', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['clamp(18px, 4vw, 24px)', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['clamp(16px, 3.5vw, 20px)', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['clamp(14px, 3.2vw, 18px)', { lineHeight: '1.5', fontWeight: '600' }],
        'h6': ['clamp(12px, 3vw, 16px)', { lineHeight: '1.6', fontWeight: '500' }],
        'body': ['clamp(14px, 3.2vw, 18px)', { lineHeight: '1.6' }],
      },
      spacing: {
        'fluid-xs': 'clamp(4px, 1vw, 8px)',
        'fluid-sm': 'clamp(8px, 2vw, 12px)',
        'fluid-md': 'clamp(12px, 2.5vw, 16px)',
        'fluid-lg': 'clamp(16px, 3vw, 24px)',
        'fluid-xl': 'clamp(24px, 4vw, 32px)',
        'fluid-2xl': 'clamp(32px, 5vw, 48px)',
        'fluid-3xl': 'clamp(48px, 6vw, 64px)',
        'fluid-4xl': 'clamp(64px, 8vw, 96px)',
        'container-padding': 'clamp(16px, 4vw, 32px)',
      },
      maxWidth: {
        'container': '1280px',
        'desktop': '1140px',
        'desktop-lg': '1280px',
        'desktop-xl': '1400px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: 'clamp(16px, 4vw, 32px)',
          'xs': '16px',
          'sm': '16px',
          'md': '24px',
          'lg': '32px',
          'xl': '32px',
          '2xl': '32px',
        },
        screens: {
          'sm': '100%',
          'md': '100%',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1400px',
        },
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'sans': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'display': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'geist': ['Geist Sans', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'Poppins', 'Inter', 'system-ui', 'sans-serif'],
        'helvetica': ['Helvetica', 'Arial', 'Trebuchet MS', 'sans-serif'],
        'roboto': ['var(--font-roboto)', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'montserrat': ['var(--font-montserrat)', 'Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
        'trebuchet': ['Trebuchet MS', 'Arial', 'Helvetica', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #252525 0%, #3a1414 55%, #E03A3A 100%)',
        'premium-gradient': 'linear-gradient(45deg, #252525 0%, #E03A3A 100%)',
        'smart-gradient': 'linear-gradient(135deg, #252525 0%, #CC2E2E 100%)',
        'ai-gradient': 'linear-gradient(135deg, #252525 0%, #AC2424 50%, #EC6A6A 100%)',
        'neural-gradient': 'linear-gradient(45deg, #252525 0%, #AC2424 40%, #E03A3A 70%, #EC6A6A 100%)',
        'cosmic-gradient': 'linear-gradient(135deg, #252525 0%, #AC2424 30%, #E03A3A 60%, #252525 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // 3-colour brand system
        surface: '#F5F6F7',
        'surface-card': '#FCFCFD',
        ink: INK,
        'primary-blue': '#E03A3A',
        'industry-green': '#10B981',
        'warning-orange': '#F59E0B',
        'deep-navy': '#252525',
        'background-gray': '#F5F6F7',
        // every former "brand" / accent hue now resolves to the single red
        theme: RED,
        red: RED,
        blue: RED,
        purple: RED,
        indigo: RED,
        violet: RED,
        pink: RED,
        rose: RED,
        fuchsia: RED,
        sky: RED,
        cyan: RED,
        orange: RED,
        // neutrals de-blued onto the charcoal scale
        gray: INK,
        slate: INK,
        navy: INK,
        // kept semantic colours
        emerald: {
          50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
          500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B', 950: '#022C22',
        },
        gold: { primary: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: { ...RED, DEFAULT: '#E03A3A', foreground: '#FFFFFF' },
        secondary: { ...RED, DEFAULT: '#E03A3A', foreground: '#FFFFFF' },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#E03A3A',
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
          '1': '#E03A3A',
          '2': '#252525',
          '3': '#EC6A6A',
          '4': '#828384',
          '5': '#AC2424',
        },
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