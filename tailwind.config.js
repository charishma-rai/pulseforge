/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#07070B',
        canvas: '#0B0B11',
        surface: {
          DEFAULT: '#111118',
          raised: '#16161F',
          inset: '#0E0E14',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          default: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.18)',
        },
        fg: {
          primary: '#F5F5F7',
          secondary: '#8A8A94',
          tertiary: '#52525B',
        },
        accent: {
          glow: '#6366F1',
          soft: 'rgba(99, 102, 241, 0.15)',
        },
        success: { DEFAULT: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
        danger:  { DEFAULT: '#F43F5E', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.25)' },
        warning: { DEFAULT: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
        info:    { DEFAULT: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-hero': ['4.5rem', { lineHeight: '1.0',  letterSpacing: '-0.03em',  fontWeight: '800' }],
        'display-lg':   ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md':   ['2.5rem', { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '700' }],
        'display-sm':   ['2rem',   { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h2':           ['1.5rem', { lineHeight: '1.3',  letterSpacing: '-0.01em',  fontWeight: '600' }],
        'h3':           ['1.25rem',{ lineHeight: '1.4',  letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg':      ['1rem',   { lineHeight: '1.6',  letterSpacing: '0',        fontWeight: '400' }],
        'body':         ['0.875rem',{ lineHeight: '1.6', letterSpacing: '0',        fontWeight: '400' }],
        'label':        ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '500' }],
        'micro':        ['0.625rem',  { lineHeight: '1.2', letterSpacing: '0.06em', fontWeight: '600' }],
        'caption':      ['0.75rem',   { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '400' }],
      },
      borderRadius: {
        'xl':  '1.125rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'cosmic-glow': 'radial-gradient(ellipse 700px 350px at 50% -100px, rgba(99,102,241,0.20), rgba(99,102,241,0) 70%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 50%)',
        'dot-grid': 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      boxShadow: {
        'card':   '0 1px 2px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)',
        'raised': '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.10)',
        'focus':  '0 0 0 3px rgba(99,102,241,0.30)',
        'glow':   '0 0 24px rgba(99,102,241,0.18)',
        'glow-lg':'0 0 60px rgba(99,102,241,0.15)',
      },
      keyframes: {
        shine: {
          '0%':   { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'shine':      'shine 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
