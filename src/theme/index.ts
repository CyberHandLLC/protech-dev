/**
 * Main theme export file
 * Centralizes all theme-related configurations in a single export
 */

import colors from './colors';
import typography from './typography';
import spacing from './spacing';
import components from './components';
import effects from './effects';

// Re-export all theme modules
export { colors, typography, spacing, components, effects };

// Default export with all theme configurations
const theme = {
  colors,
  typography,
  spacing,
  components,
  effects,
};

export default theme;