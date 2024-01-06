import { defineConfig } from "@pandacss/dev";
import { createPreset } from '@park-ui/panda-preset'

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: 'orange',
      grayColor: 'neutral',
      borderRadius: 'sm',
    })
  ],
  jsxFramework: 'react',

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],
  globalCss: {
    ':root': {
      fontFamily: 'Nunito, sans-serif'
    }
  },

  // Useful for theme customization
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          bg: {
            canvas: { "value": { "base": "#ffe5d4" } },
            default: { "value": { "base": "#fff1e0" } },
            subtle: { "value": { "base": "#ffe4d5" } },
            muted: { "value": { "base": "#ffd7ca" } },
            emphasized: { "value": { "base": "#ffcfca" } },
            disabled: { "value": { "base": "#fde9d5" } },
          }
        }
      }
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
