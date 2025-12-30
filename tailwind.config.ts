import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple System Colors
        apple: {
          blue: 'var(--system-blue)',
          green: 'var(--system-green)',
          indigo: 'var(--system-indigo)',
          orange: 'var(--system-orange)',
          pink: 'var(--system-pink)',
          purple: 'var(--system-purple)',
          red: 'var(--system-red)',
          teal: 'var(--system-teal)',
          yellow: 'var(--system-yellow)',
        },
        // Gray Scale
        gray: {
          DEFAULT: 'var(--system-gray)',
          2: 'var(--system-gray2)',
          3: 'var(--system-gray3)',
          4: 'var(--system-gray4)',
          5: 'var(--system-gray5)',
          6: 'var(--system-gray6)',
        },
        // Semantic Colors
        label: {
          primary: 'var(--label-primary)',
          secondary: 'var(--label-secondary)',
          tertiary: 'var(--label-tertiary)',
          quaternary: 'var(--label-quaternary)',
        },
        // Backgrounds
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        // Separators
        separator: {
          DEFAULT: 'var(--separator)',
          opaque: 'var(--separator-opaque)',
        },
      },
      fontFamily: {
        system: ['var(--font-system)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        'caption2': ['11px', { lineHeight: '1.2' }],
        'caption1': ['12px', { lineHeight: '1.2' }],
        'footnote': ['13px', { lineHeight: '1.3' }],
        'subhead': ['15px', { lineHeight: '1.4' }],
        'body': ['17px', { lineHeight: '1.5' }],
        'headline': ['17px', { lineHeight: '1.3', fontWeight: '600' }],
        'title3': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'title2': ['22px', { lineHeight: '1.2', fontWeight: '700' }],
        'title1': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'large-title': ['34px', { lineHeight: '1.1', fontWeight: '700' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '44': '44px', // Touch target
        '49': '49px', // Tab bar height
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        'full': '9999px',
        'card': '10px', // iOS grouped list
      },
      boxShadow: {
        'apple': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 4px 6px rgba(0, 0, 0, 0.02), 0 12px 24px rgba(0, 0, 0, 0.04)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        'instant': '100ms',
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      minHeight: {
        '44': '44px', // Touch target
        '49': '49px', // Tab bar
      },
      minWidth: {
        '44': '44px', // Touch target
      },
    },
  },
  plugins: [],
};

export default config;
