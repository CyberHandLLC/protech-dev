/**
 * Effects configurations for the ProTech HVAC website
 * Defines transitions, animations, shadows, and other visual effects
 */

// Transitions
export const transitions = {
  // Duration
  duration: {
    fast: 'duration-150',
    default: 'duration-300',
    slow: 'duration-500',
    slower: 'duration-700',
    slowest: 'duration-1000',
  },
  
  // Property
  property: {
    all: 'transition-all',
    colors: 'transition-colors',
    opacity: 'transition-opacity',
    shadow: 'transition-shadow',
    transform: 'transition-transform',
  },
  
  // Timing functions
  timing: {
    default: 'ease-in-out',
    linear: 'linear',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
  
  // Complete transitions
  default: 'transition-all duration-300 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  color: 'transition-colors duration-300 ease-in-out',
  transform: 'transition-transform duration-300 ease-in-out',
  opacity: 'transition-opacity duration-300 ease-in-out',
};

// Animations
export const animations = {
  // Predefined animations
  fadeIn: 'animate-fade-in',
  fadeInDelay: 'animate-fade-in delay-75',
  fadeInDelayLonger: 'animate-fade-in delay-150',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  
  // Delays
  delay: {
    none: '',
    75: 'delay-75',
    100: 'delay-100',
    150: 'delay-150',
    200: 'delay-200',
    300: 'delay-300',
    500: 'delay-500',
    700: 'delay-700',
    1000: 'delay-1000',
  },
};

// Shadows
export const shadows = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  
  // Custom shadows
  card: 'shadow-md hover:shadow-lg',
  button: 'shadow-md hover:shadow-lg',
  header: 'shadow-md',
};

// Border radius
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
  
  // Component-specific
  button: 'rounded-lg',
  card: 'rounded-xl',
  input: 'rounded-lg',
  badge: 'rounded-full',
};

// Hover effects
export const hover = {
  scale: 'hover:scale-105',
  scaleSmall: 'hover:scale-102',
  lift: 'hover:-translate-y-1',
  grow: 'hover:transform hover:-translate-y-1',
  brighten: 'hover:brightness-110',
  darken: 'hover:brightness-90',
  fadeIn: 'hover:opacity-100',
  fadeOut: 'hover:opacity-80',
};

// Focus effects
export const focus = {
  ring: {
    default: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    primary: 'focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2',
    secondary: 'focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2',
    white: 'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
    danger: 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  },
};

// Background effects
export const backgroundEffects = {
  noRepeat: 'bg-no-repeat',
  cover: 'bg-cover',
  contain: 'bg-contain',
  center: 'bg-center',
  fixed: 'bg-fixed',
  local: 'bg-local',
  scroll: 'bg-scroll',
  
  // Gradients
  gradients: {
    primary: 'bg-gradient-to-br from-dark-blue to-teal',
    reverse: 'bg-gradient-to-br from-teal to-dark-blue',
    overlay: 'bg-gradient-to-br from-dark-blue/90 via-dark-blue/80 to-teal/70',
    light: 'bg-gradient-to-br from-white to-ivory',
  },
  
  // Blurs
  blurs: {
    backdrop: 'backdrop-blur-sm',
    backdropMd: 'backdrop-blur-md',
    backdropLg: 'backdrop-blur-lg',
  },
};

export default {
  transitions,
  animations,
  shadows,
  borderRadius,
  hover,
  focus,
  backgroundEffects,
};