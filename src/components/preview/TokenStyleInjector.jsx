"use client";

import { useEffect } from 'react';
import useTokenStore from '@/lib/tokens/store';
import { TYPE_SCALE, SHADOW_PRESETS } from '@/lib/tokens/defaults';

/**
 * Bridge between Zustand store and CSS custom properties.
 * Injects a <style> tag with all --bb-* variables.
 * Preview components read these vars — no React re-render needed downstream.
 */
export default function TokenStyleInjector() {
  const scales = useTokenStore((s) => s.scales);
  const semantic = useTokenStore((s) => s.semantic);
  const typography = useTokenStore((s) => s.typography);
  const spacing = useTokenStore((s) => s.spacing);
  const borders = useTokenStore((s) => s.borders);
  const gradients = useTokenStore((s) => s.gradients);
  const elementGradients = useTokenStore((s) => s.elementGradients);
  const buttonTokens = useTokenStore((s) => s.buttonTokens);
  const buttonTokensDark = useTokenStore((s) => s.buttonTokensDark);
  const buttonTransition = useTokenStore((s) => s.buttonTransition);
  const cardTokens = useTokenStore((s) => s.cardTokens);
  const cardTokensDark = useTokenStore((s) => s.cardTokensDark);
  const inputTokens = useTokenStore((s) => s.inputTokens);
  const inputTokensDark = useTokenStore((s) => s.inputTokensDark);

  useEffect(() => {
    const lines = [':root {'];

    // Scale colors (option tokens)
    for (const [key, hex] of Object.entries(scales)) {
      lines.push(`  --bb-scale-${key}: ${hex};`);
    }

    // Semantic colors (resolved to final values)
    for (const [name, ref] of Object.entries(semantic)) {
      const resolved = scales[ref] || '#ff00ff';
      lines.push(`  --bb-${name}: ${resolved};`);
    }

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

    // Type scale (derived from base size)
    for (const [name, ratio] of Object.entries(TYPE_SCALE)) {
      lines.push(`  --bb-text-${name}: ${Math.round(typography.baseSize * ratio)}px;`);
    }

    // Spacing
    lines.push(`  --bb-space-base: ${spacing.base}px;`);
    for (let i = 1; i <= 16; i++) {
      lines.push(`  --bb-space-${i}: ${spacing.base * i}px;`);
    }
    lines.push(`  --bb-section-padding: ${spacing.sectionPadding}px;`);
    lines.push(`  --bb-container-padding: ${spacing.containerPadding}px;`);
    lines.push(`  --bb-component-gap: ${spacing.componentGap}px;`);
    lines.push(`  --bb-max-width: ${spacing.maxWidth}px;`);

    // Borders & shadows (derived from base radius × multiplier)
    const r = borders.radius;
    lines.push(`  --bb-radius: ${r}px;`);
    lines.push(`  --bb-card-radius: ${Math.round(r * (borders.cardMult || 1.5))}px;`);
    lines.push(`  --bb-container-radius: ${Math.round(r * (borders.containerMult || 2))}px;`);
    lines.push(`  --bb-button-radius: ${Math.round(r * (borders.buttonMult || 0.75))}px;`);
    lines.push(`  --bb-input-radius: ${Math.round(r * (borders.inputMult || 0.75))}px;`);
    lines.push(`  --bb-shadow: ${SHADOW_PRESETS[borders.shadow] || 'none'};`);

    // Gradients (resolve scale refs to hex)
    if (gradients) {
      for (const [name, grad] of Object.entries(gradients)) {
        const resolvedStops = grad.stops.map((ref) => scales[ref] || '#ff00ff');
        lines.push(`  --bb-${name}: linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')});`);
      }
    }

    // Element gradients (only emit when set)
    if (elementGradients) {
      for (const [el, gradName] of Object.entries(elementGradients)) {
        if (gradName && gradients[gradName]) {
          const grad = gradients[gradName];
          const resolvedStops = grad.stops.map((ref) => scales[ref] || '#ff00ff');
          lines.push(`  --bb-${el}-gradient: linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')});`);
        }
      }
    }

    // Resolve helper: scale ref, semantic ref, gradient ref, or literal
    const resolve = (ref) => {
      if (!ref || ref === 'transparent') return ref || 'transparent';
      if (scales[ref]) return scales[ref];
      const semRef = semantic[ref];
      if (semRef && scales[semRef]) return scales[semRef];
      return ref;
    };

    // Resolve bg — may be gradient ref or color ref
    const resolveBg = (ref) => {
      if (!ref || ref === 'transparent') return ref || 'transparent';
      if (ref.startsWith('gradient-') && gradients[ref]) {
        const grad = gradients[ref];
        const resolvedStops = grad.stops.map((s) => scales[s] || '#ff00ff');
        return `linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')})`;
      }
      return resolve(ref);
    };

    // Button transition
    if (buttonTransition) {
      lines.push(`  --bb-btn-transition-duration: ${buttonTransition.duration}s;`);
      lines.push(`  --bb-btn-transition-easing: ${buttonTransition.easing};`);
    }

    // Button component tokens (light)
    const emitButtonTokens = (tokens, prefix) => {
      for (const [variant, t] of Object.entries(tokens)) {
        lines.push(`  --bb-btn-${prefix}${variant}-bg: ${resolveBg(t.bg)};`);
        lines.push(`  --bb-btn-${prefix}${variant}-text: ${resolve(t.text)};`);
        lines.push(`  --bb-btn-${prefix}${variant}-border: ${t.border ? '1px solid ' + resolve(t.border) : 'none'};`);
        lines.push(`  --bb-btn-${prefix}${variant}-hover-bg: ${resolveBg(t.hoverBg || t.bg)};`);
        lines.push(`  --bb-btn-${prefix}${variant}-hover-text: ${t.hoverText ? resolve(t.hoverText) : resolve(t.text)};`);
        lines.push(`  --bb-btn-${prefix}${variant}-hover-border: ${t.hoverBorder ? '1px solid ' + resolve(t.hoverBorder) : (t.border ? '1px solid ' + resolve(t.border) : 'none')};`);
      }
    };

    if (buttonTokens) emitButtonTokens(buttonTokens, '');
    if (buttonTokensDark) emitButtonTokens(buttonTokensDark, 'dark-');

    // Card component tokens
    const emitCardTokens = (t, prefix) => {
      if (!t) return;
      lines.push(`  --bb-card-${prefix}bg: ${resolveBg(t.bg)};`);
      lines.push(`  --bb-card-${prefix}border-color: ${t.borderColor ? resolve(t.borderColor) : 'transparent'};`);
      lines.push(`  --bb-card-${prefix}border-width: ${t.borderWidth ?? 1}px;`);
      lines.push(`  --bb-card-${prefix}shadow-value: ${SHADOW_PRESETS[t.shadow] || 'none'};`);
      lines.push(`  --bb-card-${prefix}title-color: ${resolve(t.titleColor)};`);
      lines.push(`  --bb-card-${prefix}body-color: ${resolve(t.bodyColor)};`);
    };
    emitCardTokens(cardTokens, '');
    emitCardTokens(cardTokensDark, 'dark-');

    // Input component tokens
    const emitInputTokens = (t, prefix) => {
      if (!t) return;
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

    // Inject or update style tag
    let styleEl = document.getElementById('bb-token-vars');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'bb-token-vars';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = lines.join('\n');

    return () => {
      // Don't remove on unmount — persist until page unload
    };
  }, [scales, semantic, typography, spacing, borders, gradients, elementGradients, buttonTokens, buttonTokensDark, buttonTransition, cardTokens, cardTokensDark, inputTokens, inputTokensDark]);

  return null;
}
