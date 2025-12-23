/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contents/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px'
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        md: '2.5rem'
      },
      center: true
    },
    extend: {
      fontFamily: {
        manrope: ['Manrope']
      },
      colors: {
        'brand-black': '#444444',
        'brand-darker': '#232323',
        'brand-royal-blue': '#173D7B',
        'brand-teal': '#2DABC4',
        'brand-warning': '#EB0000',
        'brand-blue': '#90C6E9',
        'brand-saffron': '#ECC046',
        'brand-green': '#BDD358',
        'brand-neutral': '#F5F5F5',
        'brand-neutral-2': '#DCEDF9',
        'brand-neutral-3': '#F9F9F9',
        'brand-neutral-5': '#D9D7DD',
        'brand-neutral-6': '#C2C2C2',
        'brand-neutral-7': '#F6F6F6',
        'brand-neutral-8': '#f3f4f6',
        'brand-blue-sky': '#3395D7',
        'brand-dark-grey': '#646464',
        'brand-dark-grey-1': '#6C6C6C',
        'brand-grey-dark': '#646464',
        'brand-black-200': '#232323',
        'brand-white': '#FFF',
        white: '#FFFFFF',
        'brand-orange': '#F9A02E',
        'brand-blue-hover': '#48BED5',
        'brand-green-hover': '#CBDD7E',
      },

      fontSize: {
        oversized: ['6.25rem', '6.75rem'], // 100,108,
        large: ['3.75rem', '4.5rem'], // 60,72,
        h1: ['3.125rem', '3.75rem'], // 50/60
        h2: ['2.5rem', '3.125rem'], // 40/50
        h3: ['2rem', '2.5rem'], // 32/40
        h4: ['1.5rem', '1.875rem'], //24/30
        p1: ['1.5rem', '2.375rem'], // 24/38
        p2: ['1.25rem', '1.875rem'], // 20/30
        p3: ['1.125rem', '1.625rem'], // 18/26
        p4: ['1rem', '1.5rem'], // 16/24
        l1: ['0.875rem', '1.375rem'] // 14/22
      },

      boxShadow: {
        event: '0px 0px 20px 0px rgba(0, 0, 0, 0.07)',
        calendar: '0px 0px 55px 3px rgba(21, 47, 96, 0.07)',
        popup: '0px 4px 30px 3px rgba(21, 47, 96, 0.05)'
      }
    }
  },
  safelist: [
    {
      pattern:
        /(bg|text|border|hover:bg)-(brand-green-hover|brand-blue-hover|brand-grey-dark|brand-black-200|brand-white|brand-black|brand-dark-gray|brand-pink|brand-sky-blue|brand-bright-yellow|brand-yellow|brand-blue|brand-green|brand-neutral|brand-neutral-2|brand-neutral-3|brand-neutral-4|brand-neutral-5)/,
      variants: ['hover']
    }
  ],
  plugins: [
    require('tailwindcss'),
    require('precss'),
    require('autoprefixer'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar')
  ]
};
