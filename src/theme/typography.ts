/**
 * Typography configurations for the ProTech HVAC website
 * Defines font families, sizes, weights, and line heights
 */

// Font families
export const fontFamily = {
  primary: 'var(--font-inter), sans-serif',
  heading: 'var(--font-inter), sans-serif',
  monospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

// Font sizes
export const fontSize = {
  xs: 'text-xs',     // 0.75rem (12px)
  sm: 'text-sm',     // 0.875rem (14px)
  base: 'text-base', // 1rem (16px)
  lg: 'text-lg',     // 1.125rem (18px)
  xl: 'text-xl',     // 1.25rem (20px)
  '2xl': 'text-2xl', // 1.5rem (24px)
  '3xl': 'text-3xl', // 1.875rem (30px)
  '4xl': 'text-4xl', // 2.25rem (36px)
  '5xl': 'text-5xl', // 3rem (48px)
  '6xl': 'text-6xl', // 3.75rem (60px)
  '7xl': 'text-7xl', // 4.5rem (72px)
};

// Responsive font sizes
export const responsiveFontSize = {
  heading1: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
  heading2: 'text-3xl md:text-4xl lg:text-5xl',
  heading3: 'text-2xl md:text-3xl',
  heading4: 'text-xl md:text-2xl',
  paragraph: 'text-base md:text-lg',
  small: 'text-sm',
};

// Font weights
export const fontWeight = {
  thin: 'font-thin',         // 100
  extralight: 'font-extralight', // 200
  light: 'font-light',       // 300
  normal: 'font-normal',     // 400
  medium: 'font-medium',     // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',         // 700
  extrabold: 'font-extrabold', // 800
  black: 'font-black',       // 900
};

// Line heights
export const lineHeight = {
  none: 'leading-none',     // 1
  tight: 'leading-tight',   // 1.25
  snug: 'leading-snug',     // 1.375
  normal: 'leading-normal', // 1.5
  relaxed: 'leading-relaxed', // 1.625
  loose: 'leading-loose',   // 2
};

// Letter spacing
export const letterSpacing = {
  tighter: 'tracking-tighter', // -0.05em
  tight: 'tracking-tight',     // -0.025em
  normal: 'tracking-normal',   // 0em
  wide: 'tracking-wide',       // 0.025em
  wider: 'tracking-wider',     // 0.05em
  widest: 'tracking-widest',   // 0.1em
};

// Text transform
export const textTransform = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  normalCase: 'normal-case',
};

// Text styles for different semantic elements
export const textStyles = {
  h1: `${responsiveFontSize.heading1} ${fontWeight.bold} ${lineHeight.tight} ${fontFamily.heading}`,
  h2: `${responsiveFontSize.heading2} ${fontWeight.bold} ${lineHeight.tight} ${fontFamily.heading}`,
  h3: `${responsiveFontSize.heading3} ${fontWeight.bold} ${lineHeight.snug} ${fontFamily.heading}`,
  h4: `${responsiveFontSize.heading4} ${fontWeight.bold} ${lineHeight.snug} ${fontFamily.heading}`,
  bodyLg: `${fontSize.lg} ${fontWeight.normal} ${lineHeight.relaxed}`,
  body: `${fontSize.base} ${fontWeight.normal} ${lineHeight.relaxed}`,
  bodySm: `${fontSize.sm} ${fontWeight.normal} ${lineHeight.relaxed}`,
  caption: `${fontSize.xs} ${fontWeight.normal} ${lineHeight.normal}`,
  button: `${fontSize.base} ${fontWeight.medium} ${lineHeight.tight}`,
  overline: `${fontSize.xs} ${fontWeight.medium} ${letterSpacing.wider} ${textTransform.uppercase}`,
};

export default {
  fontFamily,
  fontSize,
  responsiveFontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textTransform,
  textStyles,
};