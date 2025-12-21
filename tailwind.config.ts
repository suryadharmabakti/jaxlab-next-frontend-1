import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // palette tuned to match the screenshots
        jax: {
          bg: '#F6F7FB',
          surface: '#FFFFFF',
          line: '#E5E7EB',
          lime: '#B7D600',
          limeDark: '#9FBC00',
        },
      },
    },
  },
  plugins: [],
}
export default config
