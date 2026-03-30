import chroma from 'chroma-js';

/**
 * Generate an 11-step color scale from a single hex value.
 * Uses Oklch color space for perceptual uniformity.
 * Steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 * 500 is the input color. 50 is near-white, 950 is near-black.
 *
 * We use explicit lightness targets in Oklch to get well-distributed steps
 * rather than simple interpolation which clusters too much.
 */
export function generateScale(hex) {
  const base = chroma(hex);

  // Target lightness values (Oklch L, 0-1 range)
  // Designed so 50 is very light and 950 is very dark
  const lightnessTargets = {
    50: 0.97,
    100: 0.93,
    200: 0.87,
    300: 0.78,
    400: 0.68,
    500: null, // use the actual input color
    600: 0.45,
    700: 0.37,
    800: 0.29,
    900: 0.21,
    950: 0.14,
  };

  const colors = {};

  for (const [step, targetL] of Object.entries(lightnessTargets)) {
    if (targetL === null) {
      colors[step] = hex;
      continue;
    }

    try {
      // Get the base color's hue and chroma in Oklch
      const [, c, h] = base.oklch();

      // Scale chroma based on distance from 500
      // Light steps get less chroma, dark steps get moderate chroma
      const stepNum = parseInt(step);
      let chromaScale;
      if (stepNum < 500) {
        // Light end: progressively desaturate toward white
        chromaScale = (stepNum / 500) * 0.8 + 0.2;
      } else {
        // Dark end: moderate desaturation
        chromaScale = 1 - ((stepNum - 500) / 500) * 0.5;
      }

      const adjustedChroma = (c || 0) * chromaScale;
      colors[step] = chroma.oklch(targetL, adjustedChroma, h || 0).hex();
    } catch {
      // Fallback: simple interpolation
      const stepNum = parseInt(step);
      const t = stepNum / 1000;
      colors[step] = chroma.mix('#ffffff', hex, t, 'oklch').hex();
    }
  }

  return colors;
}

/**
 * Generate all scales from a foundation colors map.
 * Returns flat map: { 'primary-50': '#...', 'primary-100': '#...', ... }
 */
export function generateAllScales(foundationColors) {
  const scales = {};

  for (const [name, hex] of Object.entries(foundationColors)) {
    const scale = generateScale(hex);
    for (const [step, color] of Object.entries(scale)) {
      scales[`${name}-${step}`] = color;
    }
  }

  return scales;
}
