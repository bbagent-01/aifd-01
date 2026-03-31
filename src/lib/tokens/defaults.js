/**
 * Default token values — Brightbase theme.
 * Flat key-value maps — simple to work with in UI.
 * DTCG conversion happens only on export.
 */

export const DEFAULT_FOUNDATION_COLORS = {
  primary: '#FE4E18',
  secondary: '#34474E',
  accent: '#e8e4dd',
  neutral: '#6b7280',
  dark: '#0D1E24',
};

export const DEFAULT_SEMANTIC = {
  // Backgrounds
  'bg-primary': 'accent-50',
  'bg-surface': 'accent-100',
  'bg-card': 'accent-50',
  // Dark Backgrounds
  'bg-dark-primary': 'dark-900',
  'bg-dark-surface': 'dark-800',
  'bg-dark-card': 'dark-700',
  // Text
  'text-primary': 'dark-900',
  'text-secondary': 'secondary-700',
  'text-on-action': 'accent-50',
  // Dark Text
  'text-dark-primary': 'accent-50',
  'text-dark-secondary': 'neutral-300',
  // Actions
  'action-primary': 'primary-500',
  'action-primary-hover': 'primary-600',
  'action-secondary': 'secondary-500',
  'action-secondary-hover': 'secondary-600',
  'action-destructive': 'primary-700',
  'action-destructive-hover': 'primary-800',
  // Borders
  'border-default': 'neutral-200',
  'border-faint': 'neutral-100',
  'border-focus': 'primary-400',
  // Feedback
  'feedback-success': 'secondary-500',
  'feedback-error': 'primary-600',
};

export const DEFAULT_TYPOGRAPHY = {
  headingFont: 'DM Sans',
  bodyFont: 'Inter',
  monoFont: 'JetBrains Mono',
  baseSize: 16,
  headingWeight: 600,
  bodyWeight: 400,
  lineHeight: 1.5,
  headingLineHeight: 1.15,
  eyebrowTracking: 0.1,
  headingTracking: -0.02,
  bodyTracking: 0,
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
  cardMult: 1.5,
  containerMult: 2,
  buttonMult: 0.75,
  inputMult: 0.75,
  shadow: 'subtle',
};

// Protected semantic token keys (cannot be removed)
export const DEFAULT_SEMANTIC_KEYS = Object.keys(DEFAULT_SEMANTIC);

// Semantic token groups — for UI organization
export const SEMANTIC_GROUPS = [
  { label: 'Backgrounds', prefix: 'bg', keys: ['bg-primary', 'bg-surface', 'bg-card'], defaultRef: 'neutral-100' },
  { label: 'Dark Backgrounds', prefix: 'bg-dark', keys: ['bg-dark-primary', 'bg-dark-surface', 'bg-dark-card'], defaultRef: 'dark-800' },
  { label: 'Text', prefix: 'text', keys: ['text-primary', 'text-secondary', 'text-on-action'], defaultRef: 'dark-800' },
  { label: 'Dark Text', prefix: 'text-dark', keys: ['text-dark-primary', 'text-dark-secondary'], defaultRef: 'accent-50' },
  { label: 'Actions', prefix: 'action', keys: ['action-primary', 'action-primary-hover', 'action-secondary', 'action-secondary-hover', 'action-destructive', 'action-destructive-hover'], defaultRef: 'primary-500' },
  { label: 'Borders', prefix: 'border', keys: ['border-default', 'border-faint', 'border-focus'], defaultRef: 'neutral-200' },
  { label: 'Feedback', prefix: 'feedback', keys: ['feedback-success', 'feedback-error'], defaultRef: 'neutral-500' },
];

// Auto-generate one gradient per foundation color (subtle tint-to-shade, vertical)
export function generateDefaultGradients(foundationColors) {
  const gradients = {};
  for (const name of Object.keys(foundationColors)) {
    gradients[`gradient-${name}`] = { angle: 180, stops: [`${name}-300`, `${name}-600`] };
  }
  return gradients;
}

export const DEFAULT_GRADIENTS = generateDefaultGradients(DEFAULT_FOUNDATION_COLORS);

// Element gradient assignments (null = no gradient, string = gradient name)
export const DEFAULT_ELEMENT_GRADIENTS = {
  card: null,
  container: null,
};

// Button component tokens — per-variant, full hover states
// bg can be a scale ref, 'transparent', or gradient ref like 'gradient-primary'
export const DEFAULT_BUTTON_TOKENS = {
  primary:     { bg: 'primary-500',   text: 'accent-50',      border: null,          hoverBg: 'primary-600',     hoverText: null,        hoverBorder: null },
  secondary:   { bg: 'transparent',   text: 'secondary-500',  border: 'neutral-200', hoverBg: 'secondary-500',   hoverText: 'accent-50', hoverBorder: 'secondary-500' },
  ghost:       { bg: 'transparent',   text: 'dark-900',       border: null,          hoverBg: 'accent-100',      hoverText: null,        hoverBorder: null },
  destructive: { bg: 'primary-700',   text: 'accent-50',      border: null,          hoverBg: 'primary-800',     hoverText: null,        hoverBorder: null },
};

// Button dark mode variants
export const DEFAULT_BUTTON_TOKENS_DARK = {
  primary:     { bg: 'primary-400',   text: 'dark-900',       border: null,          hoverBg: 'primary-300',     hoverText: null,        hoverBorder: null },
  secondary:   { bg: 'transparent',   text: 'accent-100',     border: 'neutral-600', hoverBg: 'neutral-700',     hoverText: 'accent-50', hoverBorder: 'neutral-500' },
  ghost:       { bg: 'transparent',   text: 'accent-50',      border: null,          hoverBg: 'dark-700',        hoverText: null,        hoverBorder: null },
  destructive: { bg: 'primary-600',   text: 'accent-50',      border: null,          hoverBg: 'primary-500',     hoverText: null,        hoverBorder: null },
};

// Global button transition config
export const DEFAULT_BUTTON_TRANSITION = {
  duration: 0.15,
  easing: 'ease',
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
