import { TYPE_SCALE, SHADOW_PRESETS } from '@/lib/tokens/defaults';

/**
 * Generate CSS custom properties from token store state.
 * @param {object} state - The full store state
 * @param {string} mode - 'resolved' (flat values) or 'referenced' (var() chains)
 */
export function generateCSS(state, mode = 'resolved') {
  const { scales, semantic, typography, spacing, borders, gradients } = state;
  const lines = [':root {'];

  if (mode === 'referenced') {
    // Scale colors
    for (const [key, hex] of Object.entries(scales)) {
      lines.push(`  --bb-scale-${key}: ${hex};`);
    }
    lines.push('');
    // Semantic colors reference scale vars
    for (const [name, ref] of Object.entries(semantic)) {
      lines.push(`  --bb-${name}: var(--bb-scale-${ref});`);
    }
  } else {
    // Resolved: semantic tokens get final hex values directly
    for (const [name, ref] of Object.entries(semantic)) {
      lines.push(`  --bb-${name}: ${scales[ref] || '#ff00ff'};`);
    }
  }

  lines.push('');

  // Typography
  lines.push(`  --bb-font-heading: '${typography.headingFont}', sans-serif;`);
  lines.push(`  --bb-font-body: '${typography.bodyFont}', sans-serif;`);
  lines.push(`  --bb-font-mono: '${typography.monoFont}', monospace;`);
  lines.push(`  --bb-text-base: ${typography.baseSize}px;`);
  lines.push(`  --bb-heading-weight: ${typography.headingWeight};`);
  lines.push(`  --bb-body-weight: ${typography.bodyWeight};`);
  lines.push(`  --bb-line-height: ${typography.lineHeight};`);
  lines.push(`  --bb-heading-line-height: ${typography.headingLineHeight};`);

  for (const [name, ratio] of Object.entries(TYPE_SCALE)) {
    lines.push(`  --bb-text-${name}: ${Math.round(typography.baseSize * ratio)}px;`);
  }

  lines.push('');

  // Spacing
  lines.push(`  --bb-space-base: ${spacing.base}px;`);
  for (let i = 1; i <= 16; i++) {
    lines.push(`  --bb-space-${i}: ${spacing.base * i}px;`);
  }
  lines.push(`  --bb-section-padding: ${spacing.sectionPadding}px;`);
  lines.push(`  --bb-container-padding: ${spacing.containerPadding}px;`);
  lines.push(`  --bb-component-gap: ${spacing.componentGap}px;`);
  lines.push(`  --bb-max-width: ${spacing.maxWidth}px;`);

  lines.push('');

  // Borders (derived from base radius × multiplier)
  const r = borders.radius;
  lines.push(`  --bb-radius: ${r}px;`);
  lines.push(`  --bb-card-radius: ${Math.round(r * (borders.cardMult || 1.5))}px;`);
  lines.push(`  --bb-container-radius: ${Math.round(r * (borders.containerMult || 2))}px;`);
  lines.push(`  --bb-button-radius: ${Math.round(r * (borders.buttonMult || 0.75))}px;`);
  lines.push(`  --bb-input-radius: ${Math.round(r * (borders.inputMult || 0.75))}px;`);
  lines.push(`  --bb-shadow: ${SHADOW_PRESETS[borders.shadow] || 'none'};`);

  // Gradients
  if (gradients) {
    lines.push('');
    for (const [name, grad] of Object.entries(gradients)) {
      const resolvedStops = grad.stops.map((ref) => scales[ref] || '#ff00ff');
      lines.push(`  --bb-${name}: linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')});`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}
