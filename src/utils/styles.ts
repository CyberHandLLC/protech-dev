/**
 * Shared styles using Tailwind CSS classes
 * This file provides backward compatibility with the existing codebase
 * while also importing from the new theme system
 */
import theme from '@/theme';

// Colors
export const colors = {
  primary: 'text-dark-blue',
  secondary: 'text-teal',
  accent: 'text-yellow-500',
  light: 'text-ivory',
  subtle: 'text-white/70',
  subtler: 'text-white/50',
  dark: 'text-gray-800',
  muted: 'text-gray-600',
};

// Background colors
export const bgColors = {
  primary: 'bg-dark-blue',
  secondary: 'bg-teal',
  light: 'bg-ivory',
  white: 'bg-white',
  transparent: 'bg-transparent',
  translucent: 'bg-white/10 backdrop-blur-sm',
};

// Gradients
export const gradients = {
  primary: 'bg-gradient-to-br from-dark-blue to-teal',
  overlay: 'bg-gradient-to-br from-dark-blue/90 via-dark-blue/80 to-teal/70',
};

// Text sizes
export const heading = {
  h1: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold',
  h2: 'text-3xl md:text-4xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
};

export const text = {
  base: 'text-base',
  lg: 'text-lg md:text-xl',
  sm: 'text-sm',
  xs: 'text-xs',
};

// Layout
export const container = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
export const section = 'py-16 md:py-20 px-4 md:px-8';

// Flex
export const flex = {
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  col: 'flex flex-col',
};

// Grids
export const grid = {
  cols1: 'grid grid-cols-1 gap-6',
  cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
};

// Effects
export const transitions = {
  all: 'transition-all duration-300',
  colors: 'transition-colors',
  transform: 'transition-transform',
};

export const hover = {
  scale: 'hover:scale-105',
  scaleSmall: 'hover:scale-110',
  grow: 'hover:transform hover:-translate-y-1',
  brighten: 'hover:brightness-110',
};

// Components
export const card = 'bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all';
export const cardInverted = 'bg-dark-blue text-ivory rounded-xl shadow-md p-6 hover:shadow-lg transition-all';
export const cardTranslucent = 'bg-white/20 backdrop-blur-sm rounded-xl p-6';

export const buttons = {
  primary: 'px-6 py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal/90 transition-colors',
  secondary: 'px-6 py-3 bg-white text-dark-blue rounded-lg font-medium hover:bg-white/90 transition-colors',
  outline: 'px-6 py-3 bg-transparent border border-teal text-teal rounded-lg font-medium hover:bg-teal/10 transition-colors',
  ghost: 'px-6 py-3 bg-white/20 text-white border border-white/40 rounded-lg font-medium hover:bg-white/30 transition-colors',
  link: 'font-medium text-teal hover:text-teal/80 transition-colors',
};

// Forms
export const input = 'w-full px-4 py-3 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal';
export const label = 'block text-sm font-medium mb-1';

// Dividers
export const divider = 'border-t border-ivory/20 my-8';

// Animations
export const animations = {
  fadeIn: 'animate-fade-in',
  fadeInDelay: 'animate-fade-in delay-75',
  fadeInDelayLonger: 'animate-fade-in delay-150',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
};

// Navigation
export const navItem = {
  base: 'transition-colors',
  active: 'text-teal font-medium',
  inactive: 'text-ivory/90 hover:text-teal',
  inactiveDark: 'text-dark-blue hover:text-teal',
};

// Social Media Icons
export const socialIcon = 'w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-teal transition-colors';

// Export theme directly for components that want to use the new system
export { theme };