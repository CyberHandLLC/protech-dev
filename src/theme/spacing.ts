/**
 * Spacing and layout configurations for the ProTech HVAC website
 */

// Standard spacing units (matched to Tailwind's default scale)
export const spacing = {
  px: 'px',           // 1px
  0: '0px',
  0.5: '0.125rem',    // 2px
  1: '0.25rem',       // 4px
  1.5: '0.375rem',    // 6px
  2: '0.5rem',        // 8px
  2.5: '0.625rem',    // 10px
  3: '0.75rem',       // 12px
  3.5: '0.875rem',    // 14px
  4: '1rem',          // 16px
  5: '1.25rem',       // 20px
  6: '1.5rem',        // 24px
  7: '1.75rem',       // 28px
  8: '2rem',          // 32px
  9: '2.25rem',       // 36px
  10: '2.5rem',       // 40px
  11: '2.75rem',      // 44px
  12: '3rem',         // 48px
  14: '3.5rem',       // 56px
  16: '4rem',         // 64px
  20: '5rem',         // 80px
  24: '6rem',         // 96px
  28: '7rem',         // 112px
  32: '8rem',         // 128px
  36: '9rem',         // 144px
  40: '10rem',        // 160px
  44: '11rem',        // 176px
  48: '12rem',        // 192px
  52: '13rem',        // 208px
  56: '14rem',        // 224px
  60: '15rem',        // 240px
  64: '16rem',        // 256px
  72: '18rem',        // 288px
  80: '20rem',        // 320px
  96: '24rem',        // 384px
};

// Semantic spacing for specific use cases
export const semanticSpacing = {
  container: {
    padding: 'px-4 md:px-6 lg:px-8',
    maxWidth: 'max-w-7xl',
    centered: 'mx-auto',
  },
  section: {
    padding: 'py-16 md:py-20 px-4 md:px-8',
    marginBottom: 'mb-16 md:mb-20',
  },
  card: {
    padding: 'p-4 md:p-6',
    gap: 'gap-4',
  },
  button: {
    padding: 'px-6 py-3',
    small: 'px-4 py-2',
    large: 'px-8 py-4',
  },
  input: {
    padding: 'px-4 py-3',
  },
  gap: {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
    xl: 'gap-8',
  },
  margin: {
    small: {
      top: 'mt-2',
      right: 'mr-2',
      bottom: 'mb-2',
      left: 'ml-2',
      x: 'mx-2',
      y: 'my-2',
    },
    medium: {
      top: 'mt-4',
      right: 'mr-4',
      bottom: 'mb-4',
      left: 'ml-4',
      x: 'mx-4',
      y: 'my-4',
    },
    large: {
      top: 'mt-6',
      right: 'mr-6',
      bottom: 'mb-6',
      left: 'ml-6',
      x: 'mx-6',
      y: 'my-6',
    },
    xl: {
      top: 'mt-8',
      right: 'mr-8',
      bottom: 'mb-8',
      left: 'ml-8',
      x: 'mx-8',
      y: 'my-8',
    },
  },
};

// Layout grid configurations
export const grid = {
  cols1: 'grid grid-cols-1 gap-6',
  cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  responsive: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6',
};

// Flex layouts
export const flex = {
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  start: 'flex items-start justify-start',
  end: 'flex items-end justify-end',
  column: 'flex flex-col',
  row: 'flex flex-row',
  wrap: 'flex flex-wrap',
  inline: 'inline-flex',
};

export default {
  spacing,
  semanticSpacing,
  grid,
  flex,
};