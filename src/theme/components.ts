/**
 * Component style configurations for the ProTech HVAC website
 * Defines reusable styles for common UI components
 */

// Button styles
export const buttons = {
  base: 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  
  // Button variants
  primary: 'bg-teal text-white hover:bg-teal/90 focus:ring-teal',
  secondary: 'bg-white text-dark-blue hover:bg-white/90 focus:ring-dark-blue',
  outline: 'bg-transparent border border-teal text-teal hover:bg-teal/10 focus:ring-teal',
  ghost: 'bg-white/20 text-white border border-white/40 hover:bg-white/30 focus:ring-white',
  link: 'bg-transparent text-teal hover:text-teal/80 underline-offset-2 hover:underline focus:ring-teal',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  
  // Button sizes
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
  
  // Button states
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'relative !text-transparent transition-none hover:!text-transparent',
  
  // Full compositions
  primaryButton: 'rounded-lg font-medium transition-colors bg-teal text-white hover:bg-teal/90 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 px-6 py-3',
  secondaryButton: 'rounded-lg font-medium transition-colors bg-white text-dark-blue hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2 px-6 py-3',
  outlineButton: 'rounded-lg font-medium transition-colors bg-transparent border border-teal text-teal hover:bg-teal/10 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 px-6 py-3',
  ghostButton: 'rounded-lg font-medium transition-colors bg-white/20 text-white border border-white/40 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 px-6 py-3',
};

// Card styles
export const cards = {
  base: 'rounded-xl transition-all',
  
  // Card variants
  default: 'bg-white shadow-md hover:shadow-lg',
  flat: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg',
  colored: 'bg-ivory',
  transparent: 'bg-white/10 backdrop-blur-sm',
  
  // Card padding
  padding: {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  },
  
  // Full compositions
  defaultCard: 'bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all',
  flatCard: 'bg-white rounded-xl border border-gray-200 p-6 transition-all',
  coloredCard: 'bg-ivory rounded-xl shadow-md p-6 hover:shadow-lg transition-all',
  translucentCard: 'bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all',
  darkCard: 'bg-dark-blue text-ivory rounded-xl shadow-md p-6 hover:shadow-lg transition-all',
};

// Input styles
export const inputs = {
  base: 'rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
  
  // Input variants
  default: 'border-gray-300 focus:border-teal focus:ring-teal',
  dark: 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white focus:ring-white',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  
  // Input padding
  padding: 'px-4 py-3',
  
  // Full compositions
  defaultInput: 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal',
  darkInput: 'w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-white',
  errorInput: 'w-full px-4 py-3 rounded-lg border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500',
};

// Navigation styles
export const navigation = {
  base: 'transition-colors',
  
  // Nav item states
  active: 'text-teal font-medium',
  inactive: {
    light: 'text-ivory hover:text-teal',
    dark: 'text-dark-blue hover:text-teal',
  },
  
  // Mobile nav
  mobile: {
    menu: 'bg-white absolute w-full shadow-lg transition-all duration-300',
    item: 'border-b border-gray-100 py-3',
  },
  
  // Dropdown
  dropdown: {
    container: 'absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 transform origin-top-right',
    item: 'block px-4 py-2 text-sm hover:bg-ivory hover:text-dark-blue',
  },
};

// Social media icon styles
export const socialIcons = {
  base: 'flex items-center justify-center transition-colors',
  
  // Size variants
  sm: 'w-8 h-8 rounded-full',
  md: 'w-10 h-10 rounded-full',
  lg: 'w-12 h-12 rounded-full',
  
  // Color variants
  light: 'bg-white/20 text-white hover:bg-teal',
  dark: 'bg-dark-blue/10 text-dark-blue hover:bg-teal hover:text-white',
  
  // Full composition
  default: 'w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-teal transition-colors',
};

export default {
  buttons,
  cards,
  inputs,
  navigation,
  socialIcons,
};