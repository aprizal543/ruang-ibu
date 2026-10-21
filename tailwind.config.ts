import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: 'var(--ri-forest)',
        ink: 'var(--ri-ink)',
        terra: 'var(--ri-terra)',
        paper: 'var(--ri-paper)',
        ivory: 'var(--ri-ivory)',
        peach: 'var(--ri-peach)',
      },
      fontFamily: {
        display: ['var(--ri-font-display)'],
        body: ['var(--ri-font-body)'],
      },
    },
  },
  plugins: [],
} satisfies Config
