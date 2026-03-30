/**
 * Default token values for a fresh design system.
 * Flat key-value maps — simple to work with in UI.
 * DTCG conversion happens only on export.
 */

export const DEFAULT_FOUNDATION_COLORS = {
  primary: '#6366f1',
  secondary: '#10b981',
  accent: '#f59e0b',
  neutral: '#6b7280',
  dark: '#111827',
};

export const DEFAULT_SEMANTIC = {
  'bg-primary': 'neutral-100',
  'bg-surface': 'neutral-50',
  'bg-card': 'neutral-50',
  'text-primary': 'dark-900',
  'text-secondary': 'neutral-700',
  'text-on-action': 'neutral-50',
  'action-primary': 'primary-500',
  'action-primary-hover': 'primary-600',
  'border-default': 'neutral-200',
  'border-faint': 'neutral-100',
};

export const DEFAULT_TYPOGRAPHY = {
  headingFont: 'DM Sans',
  bodyFont: 'Inter',
  monoFont: 'JetBrains Mono',
  baseSize: 16,
  headingWeight: 600,
  bodyWeight: 400,
  lineHeight: 1.5,
  headingLineHeight: 1.2,
};

export const DEFAULT_SPACING = {
  base: 4,
  sectionPadding: 80,
  containerPadding: 24,
  componentGap: 16,
  maxWidth: 1200,
};

export const DEFAULT_BORDERS = {
  radius: 8,
  buttonRadius: 6,
  shadow: 'subtle',
};

// Type scale — derived from baseSize using a ratio
export const TYPE_SCALE = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  '2xl': 1.5,
  '3xl': 1.875,
  '4xl': 2.25,
  '5xl': 3,
};

// Shadow presets
export const SHADOW_PRESETS = {
  none: 'none',
  subtle: '0 1px 2px rgba(0,0,0,0.05)',
  medium: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  strong: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
};

// Font options available in the editor
export const FONT_OPTIONS = [
  'DM Sans',
  'Inter',
  'Plus Jakarta Sans',
  'Space Grotesk',
  'Manrope',
  'Outfit',
  'Sora',
];

export const MONO_FONT_OPTIONS = [
  'JetBrains Mono',
];
