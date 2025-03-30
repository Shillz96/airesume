import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'DM Sans', ...defaultTheme.fontFamily.sans],
        heading: ['Space Grotesk', 'Poppins', ...defaultTheme.fontFamily.sans],
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
        'space-grotesk': ['Space Grotesk', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        h1: ['48px', { lineHeight: '1.2', fontWeight: '800' }],
        h2: ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        h3: ['28px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.5' }],
        button: ['14px', { letterSpacing: '0.5px' }],
      },
      spacing: {
        '32': '32px',
        '24': '24px',
        '16': '16px',
        '80': '80px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: '#0a0a0a',
        foreground: "rgb(var(--color-text) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--color-card) / <alpha-value>)",
          foreground: "rgb(var(--color-text) / <alpha-value>)",
        },
        primary: {
          DEFAULT: '#00F260',
          dark: '#0575E6',
          foreground: "white",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          foreground: "white",
        },
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-text) / 0.7)",
        },
        accent: {
          DEFAULT: '#00F260',
          hover: '#0575E6',
          foreground: "white",
        },
        destructive: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
          foreground: "white",
        },
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-card) / <alpha-value>)",
        ring: "rgb(var(--color-primary) / <alpha-value>)",
        slate: colors.slate,
        gray: colors.gray,
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        neon: {
          blue: '#00F260',
          purple: '#8A2BE2',
          teal: '#20B2AA',
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "glow-slow": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "pulse-soft": {
          "0%, 100%": {
            opacity: "0.6",
          },
          "50%": {
            opacity: "0.8",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-slow": "glow-slow 2s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      maxWidth: {
        container: '1440px',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
