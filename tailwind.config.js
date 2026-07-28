/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: 'var(--color-page-background)',
        panel: 'var(--color-surface)',
        panelSoft: 'var(--color-surface-secondary)',
        line: 'var(--color-border)',
        signal: 'var(--color-primary)',
        amber: 'var(--color-medium-text)',
        danger: 'var(--color-critical-text)',
        critical: 'var(--color-unassigned-text)'
      },
      boxShadow: {
        glow: 'var(--shadow-card)'
      }
    }
  },
  plugins: []
};
