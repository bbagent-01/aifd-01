import { TYPE_SCALE, SHADOW_PRESETS } from '@/lib/tokens/defaults';

/**
 * Generate CSS custom properties from token store state.
 * @param {object} state - The full store state
 * @param {string} mode - 'resolved' (flat values) or 'referenced' (var() chains)
 */
export function generateCSS(state, mode = 'resolved') {
  const { scales, semantic, typography, spacing, borders, gradients, elementGradients, buttonTokens, buttonTokensDark, buttonTransition, cardTokens, cardTokensDark, inputTokens, inputTokensDark } = state;
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
  lines.push(`  --bb-tracking-eyebrow: ${typography.eyebrowTracking ?? 0.1}em;`);
  lines.push(`  --bb-tracking-heading: ${typography.headingTracking ?? -0.02}em;`);
  lines.push(`  --bb-tracking-body: ${typography.bodyTracking ?? 0}em;`);

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

  // Element gradients
  if (elementGradients) {
    for (const [el, gradName] of Object.entries(elementGradients)) {
      if (gradName && gradients && gradients[gradName]) {
        const grad = gradients[gradName];
        const resolvedStops = grad.stops.map((ref) => scales[ref] || '#ff00ff');
        lines.push(`  --bb-${el}-gradient: linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')});`);
      }
    }
  }

  // Resolve helpers
  const resolve = (ref) => {
    if (!ref || ref === 'transparent') return ref || 'transparent';
    if (scales[ref]) return scales[ref];
    const semRef = semantic[ref];
    if (semRef && scales[semRef]) return scales[semRef];
    return ref;
  };
  const resolveBg = (ref) => {
    if (!ref || ref === 'transparent') return ref || 'transparent';
    if (ref.startsWith('gradient-') && gradients && gradients[ref]) {
      const grad = gradients[ref];
      const resolvedStops = grad.stops.map((s) => scales[s] || '#ff00ff');
      return `linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')})`;
    }
    return resolve(ref);
  };

  // Button transition
  if (buttonTransition) {
    lines.push('');
    lines.push(`  --bb-btn-transition-duration: ${buttonTransition.duration}s;`);
    lines.push(`  --bb-btn-transition-easing: ${buttonTransition.easing};`);
  }

  // Button tokens (light + dark)
  const emitBtnTokens = (tokens, prefix) => {
    if (!tokens) return;
    lines.push('');
    for (const [variant, t] of Object.entries(tokens)) {
      lines.push(`  --bb-btn-${prefix}${variant}-bg: ${resolveBg(t.bg)};`);
      lines.push(`  --bb-btn-${prefix}${variant}-text: ${resolve(t.text)};`);
      lines.push(`  --bb-btn-${prefix}${variant}-border: ${t.border ? '1px solid ' + resolve(t.border) : 'none'};`);
      lines.push(`  --bb-btn-${prefix}${variant}-hover-bg: ${resolveBg(t.hoverBg || t.bg)};`);
      lines.push(`  --bb-btn-${prefix}${variant}-hover-text: ${t.hoverText ? resolve(t.hoverText) : resolve(t.text)};`);
      lines.push(`  --bb-btn-${prefix}${variant}-hover-border: ${t.hoverBorder ? '1px solid ' + resolve(t.hoverBorder) : (t.border ? '1px solid ' + resolve(t.border) : 'none')};`);
    }
  };
  emitBtnTokens(buttonTokens, '');
  emitBtnTokens(buttonTokensDark, 'dark-');

  // Card tokens
  const emitCardTokens = (t, prefix) => {
    if (!t) return;
    lines.push('');
    lines.push(`  --bb-card-${prefix}bg: ${resolveBg(t.bg)};`);
    lines.push(`  --bb-card-${prefix}border-color: ${t.borderColor ? resolve(t.borderColor) : 'transparent'};`);
    lines.push(`  --bb-card-${prefix}border-width: ${t.borderWidth ?? 1}px;`);
    lines.push(`  --bb-card-${prefix}shadow-value: ${SHADOW_PRESETS[t.shadow] || 'none'};`);
    lines.push(`  --bb-card-${prefix}title-color: ${resolve(t.titleColor)};`);
    lines.push(`  --bb-card-${prefix}body-color: ${resolve(t.bodyColor)};`);
  };
  emitCardTokens(cardTokens, '');
  emitCardTokens(cardTokensDark, 'dark-');

  // Input tokens
  const emitInputTokens = (t, prefix) => {
    if (!t) return;
    lines.push('');
    lines.push(`  --bb-input-${prefix}bg: ${resolve(t.bg)};`);
    lines.push(`  --bb-input-${prefix}text: ${resolve(t.text)};`);
    lines.push(`  --bb-input-${prefix}border-color: ${t.borderColor ? resolve(t.borderColor) : 'transparent'};`);
    lines.push(`  --bb-input-${prefix}border-width: ${t.borderWidth ?? 1}px;`);
    lines.push(`  --bb-input-${prefix}focus-border: ${resolve(t.focusBorderColor)};`);
    lines.push(`  --bb-input-${prefix}placeholder: ${resolve(t.placeholderColor)};`);
    lines.push(`  --bb-input-${prefix}label-color: ${resolve(t.labelColor)};`);
  };
  emitInputTokens(inputTokens, '');
  emitInputTokens(inputTokensDark, 'dark-');

  lines.push('}');
  return lines.join('\n');
}
