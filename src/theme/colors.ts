/**
 * Core color palette for the ProTech HVAC website
 * These values should be synchronized with the tailwind.config.js
 */

// Primary brand colors
export const brand = {
  primary: {
    darkBlue: '#0d3b66',
    teal: '#20a39e',
    ivory: '#fff8e1',
  },
  
  // Color variations (lighter and darker shades)
  variations: {
    darkBlue: {
      light: '#1a4d7c',
      DEFAULT: '#0d3b66',
      dark: '#092c4d',
    },
    teal: {
      light: '#27bdb7',
      DEFAULT: '#20a39e',
      dark: '#188a85',
    },
    ivory: {
      light: '#fffbf0',
      DEFAULT: '#fff8e1',
      dark: '#f5ecce',
    },
  },
};

// Semantic colors for specific purposes
export const semantic = {
  text: {
    primary: brand.variations.darkBlue.DEFAULT,
    secondary: brand.variations.teal.DEFAULT,
    light: brand.variations.ivory.DEFAULT,
    subtle: 'rgba(255, 248, 225, 0.7)',
    subtler: 'rgba(255, 248, 225, 0.5)',
    dark: '#333333',
    muted: '#6b7280',
  },
  background: {
    primary: brand.variations.darkBlue.DEFAULT,
    secondary: brand.variations.teal.DEFAULT,
    light: brand.variations.ivory.DEFAULT,
    white: '#ffffff',
    transparent: 'transparent',
    translucentDark: 'rgba(13, 59, 102, 0.1)',
    translucentLight: 'rgba(255, 255, 255, 0.2)',
  },
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

// Gradients
export const gradients = {
  primary: 'from-dark-blue to-teal',
  primaryReverse: 'from-teal to-dark-blue',
  overlay: 'from-dark-blue/90 via-dark-blue/80 to-teal/70',
  subtle: 'from-dark-blue/10 to-teal/10',
};

// Color opacity values
export const opacity = {
  full: '1',
  semiOpaque: '0.95',
  high: '0.9',
  medium: '0.7',
  low: '0.5',
  subtle: '0.2',
  faint: '0.1',
};

// Export a default object with all color values
export default {
  brand,
  semantic,
  gradients,
  opacity,
};