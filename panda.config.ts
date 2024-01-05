import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],
  globalCss: {
    ':root': {
      background: 'fill.primary',
      fontFamily: 'Nunito, sans-serif'
    }
  },

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          brand: {
            "primary": { "value": { "base": "#FF6F40" } },
            "secondary": { "value": { "base": "#dc5226" } },
            "tertiary": { "value": { "base": "#8d0000" } }
          },
          fill: {
            "primary": { "value": { "base": "#FFE5D4" } },
            "secondary": { "value": { "base": "#f5dbca" } },
            "tertiary": { "value": { "base": "#ccb3a3" } }
          },
          accent: {
            "primary": { "value": { "base": "#FFC94D" } },
            "secondary": { "value": { "base": "#936b00" } }
          },
          text: {
            "primary": { "value": { "base": "#333333" } },
            "secondary": { "value": { "base": "#5c5c5c" } }
          }
        }
      },
      textStyles: {
        body: {
          description: 'The body text style - used in paragraphs',
          value: {
            fontWeight: 'medium',
            fontSize: 'md',
            lineHeight: '1.5rem'
          }
        },
        'heading/L1': {
          value: {
            fontWeight: 'bold',
            fontSize: '5xl'
          }
        },
        'heading/L2': {
          value: {
            fontWeight: 'bold',
            fontSize: '4xl'
          }
        }
      }
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
