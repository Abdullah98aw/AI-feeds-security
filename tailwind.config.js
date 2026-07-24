/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#1b2229',
        panel: '#25303a',
        panelSoft: '#303c47',
        line: '#46525e',
        signal: '#39d7b4',
        amber: '#f6b846',
        danger: '#ff5c7a',
        critical: '#b84dff'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.05), 0 18px 45px rgba(0,0,0,0.24)'
      }
    }
  },
  plugins: []
};
