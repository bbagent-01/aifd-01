import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateAllScales } from '@/lib/color/scales';
import {
  DEFAULT_FOUNDATION_COLORS,
  DEFAULT_SEMANTIC,
  DEFAULT_SEMANTIC_KEYS,
  DEFAULT_TYPOGRAPHY,
  DEFAULT_SPACING,
  DEFAULT_BORDERS,
  DEFAULT_GRADIENTS,
  DEFAULT_ELEMENT_GRADIENTS,
  DEFAULT_BUTTON_TOKENS,
  DEFAULT_BUTTON_TOKENS_DARK,
  DEFAULT_BUTTON_TRANSITION,
  generateDefaultGradients,
} from './defaults';

/**
 * Central token store.
 * Flat key-value maps for simplicity.
 * DTCG conversion happens only on export.
 */
const useTokenStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      foundationColors: { ...DEFAULT_FOUNDATION_COLORS },
      scales: generateAllScales(DEFAULT_FOUNDATION_COLORS),
      semantic: { ...DEFAULT_SEMANTIC },
      typography: { ...DEFAULT_TYPOGRAPHY },
      spacing: { ...DEFAULT_SPACING },
      borders: { ...DEFAULT_BORDERS },
      gradients: { ...DEFAULT_GRADIENTS },
      elementGradients: { ...DEFAULT_ELEMENT_GRADIENTS },
      buttonTokens: { ...DEFAULT_BUTTON_TOKENS },
      buttonTokensDark: { ...DEFAULT_BUTTON_TOKENS_DARK },
      buttonTransition: { ...DEFAULT_BUTTON_TRANSITION },

      // Undo history (simple implementation)
      _history: [],
      _future: [],

      // --- Private: snapshot for undo ---
      _snapshot: () => {
        const s = get();
        return {
          foundationColors: { ...s.foundationColors },
          scales: { ...s.scales },
          semantic: { ...s.semantic },
          typography: { ...s.typography },
          spacing: { ...s.spacing },
          borders: { ...s.borders },
          gradients: JSON.parse(JSON.stringify(s.gradients)),
          elementGradients: { ...s.elementGradients },
          buttonTokens: JSON.parse(JSON.stringify(s.buttonTokens)),
          buttonTokensDark: JSON.parse(JSON.stringify(s.buttonTokensDark)),
          buttonTransition: { ...s.buttonTransition },
        };
      },

      _pushHistory: () => {
        const snapshot = get()._snapshot();
        set((s) => ({
          _history: [...s._history.slice(-50), snapshot],
          _future: [],
        }));
      },

      // --- Actions: Foundation Colors ---
      setFoundationColor: (name, hex) => {
        get()._pushHistory();
        set((s) => {
          const updated = { ...s.foundationColors, [name]: hex };
          return {
            foundationColors: updated,
            scales: generateAllScales(updated),
          };
        });
      },

      addFoundationColor: (name, hex) => {
        get()._pushHistory();
        set((s) => {
          const updated = { ...s.foundationColors, [name]: hex };
          return {
            foundationColors: updated,
            scales: generateAllScales(updated),
            gradients: { ...s.gradients, [`gradient-${name}`]: { angle: 180, stops: [`${name}-300`, `${name}-600`] } },
          };
        });
      },

      removeFoundationColor: (name) => {
        get()._pushHistory();
        set((s) => {
          const updated = { ...s.foundationColors };
          delete updated[name];
          // Clean up semantic refs pointing to removed color
          const cleanSemantic = { ...s.semantic };
          for (const [key, ref] of Object.entries(cleanSemantic)) {
            if (ref.startsWith(name + '-')) {
              cleanSemantic[key] = 'neutral-500'; // fallback
            }
          }
          // Remove matching gradient
          const cleanGradients = { ...s.gradients };
          delete cleanGradients[`gradient-${name}`];
          // Clean element gradient refs
          const cleanElementGradients = { ...s.elementGradients };
          for (const [el, gradName] of Object.entries(cleanElementGradients)) {
            if (gradName === `gradient-${name}`) cleanElementGradients[el] = null;
          }
          return {
            foundationColors: updated,
            scales: generateAllScales(updated),
            semantic: cleanSemantic,
            gradients: cleanGradients,
            elementGradients: cleanElementGradients,
          };
        });
      },

      // --- Actions: Semantic Tokens ---
      setSemanticRef: (tokenName, scaleKey) => {
        get()._pushHistory();
        set((s) => ({
          semantic: { ...s.semantic, [tokenName]: scaleKey },
        }));
      },

      addSemanticToken: (name, defaultRef) => {
        get()._pushHistory();
        set((s) => ({
          semantic: { ...s.semantic, [name]: defaultRef },
        }));
      },

      removeSemanticToken: (name) => {
        if (DEFAULT_SEMANTIC_KEYS.includes(name)) return; // protect defaults
        get()._pushHistory();
        set((s) => {
          const updated = { ...s.semantic };
          delete updated[name];
          return { semantic: updated };
        });
      },

      // --- Actions: Gradients ---
      setGradient: (name, value) => {
        get()._pushHistory();
        set((s) => ({
          gradients: { ...s.gradients, [name]: value },
        }));
      },

      addGradient: (name) => {
        get()._pushHistory();
        set((s) => ({
          gradients: { ...s.gradients, [name]: { angle: 180, stops: ['primary-300', 'primary-600'] } },
        }));
      },

      removeGradient: (name) => {
        get()._pushHistory();
        set((s) => {
          const updated = { ...s.gradients };
          delete updated[name];
          return { gradients: updated };
        });
      },

      // --- Actions: Element Gradients ---
      setElementGradient: (element, gradientName) => {
        get()._pushHistory();
        set((s) => ({
          elementGradients: { ...s.elementGradients, [element]: gradientName },
        }));
      },

      // --- Actions: Button Tokens ---
      setButtonToken: (variant, key, ref) => {
        get()._pushHistory();
        set((s) => ({
          buttonTokens: {
            ...s.buttonTokens,
            [variant]: { ...s.buttonTokens[variant], [key]: ref },
          },
        }));
      },

      setButtonTokenDark: (variant, key, ref) => {
        get()._pushHistory();
        set((s) => ({
          buttonTokensDark: {
            ...s.buttonTokensDark,
            [variant]: { ...s.buttonTokensDark[variant], [key]: ref },
          },
        }));
      },

      setButtonTransition: (key, value) => {
        get()._pushHistory();
        set((s) => ({
          buttonTransition: { ...s.buttonTransition, [key]: value },
        }));
      },

      // --- Actions: Typography ---
      setTypography: (key, value) => {
        get()._pushHistory();
        set((s) => ({
          typography: { ...s.typography, [key]: value },
        }));
      },

      // --- Actions: Spacing ---
      setSpacing: (key, value) => {
        get()._pushHistory();
        set((s) => ({
          spacing: { ...s.spacing, [key]: value },
        }));
      },

      // --- Actions: Borders ---
      setBorders: (key, value) => {
        get()._pushHistory();
        set((s) => ({
          borders: { ...s.borders, [key]: value },
        }));
      },

      // --- Actions: Undo / Redo ---
      undo: () => {
        const { _history } = get();
        if (_history.length === 0) return;
        const current = get()._snapshot();
        const prev = _history[_history.length - 1];
        set({
          ...(prev),
          _history: _history.slice(0, -1),
          _future: [current, ...get()._future],
        });
      },

      redo: () => {
        const { _future } = get();
        if (_future.length === 0) return;
        const current = get()._snapshot();
        const next = _future[0];
        set({
          ...(next),
          _history: [...get()._history, current],
          _future: _future.slice(1),
        });
      },

      // --- Actions: Quick Start ---
      quickStart: (hexArray, fontName) => {
        get()._pushHistory();
        const names = ['primary', 'secondary', 'accent'];
        const colors = { ...DEFAULT_FOUNDATION_COLORS };
        hexArray.forEach((hex, i) => {
          if (names[i]) colors[names[i]] = hex;
        });
        set({
          foundationColors: colors,
          scales: generateAllScales(colors),
          semantic: { ...DEFAULT_SEMANTIC },
          typography: {
            ...DEFAULT_TYPOGRAPHY,
            headingFont: fontName || DEFAULT_TYPOGRAPHY.headingFont,
          },
        });
      },

      // --- Actions: Reset / Import / Export ---
      resetToDefaults: () => {
        get()._pushHistory();
        set({
          foundationColors: { ...DEFAULT_FOUNDATION_COLORS },
          scales: generateAllScales(DEFAULT_FOUNDATION_COLORS),
          semantic: { ...DEFAULT_SEMANTIC },
          typography: { ...DEFAULT_TYPOGRAPHY },
          spacing: { ...DEFAULT_SPACING },
          borders: { ...DEFAULT_BORDERS },
          gradients: { ...DEFAULT_GRADIENTS },
          elementGradients: { ...DEFAULT_ELEMENT_GRADIENTS },
          buttonTokens: { ...DEFAULT_BUTTON_TOKENS },
          buttonTokensDark: { ...DEFAULT_BUTTON_TOKENS_DARK },
          buttonTransition: { ...DEFAULT_BUTTON_TRANSITION },
        });
      },

      loadConfig: (config) => {
        get()._pushHistory();
        const colors = config.foundationColors || DEFAULT_FOUNDATION_COLORS;
        set({
          foundationColors: colors,
          scales: generateAllScales(colors),
          semantic: config.semantic || DEFAULT_SEMANTIC,
          typography: config.typography || DEFAULT_TYPOGRAPHY,
          spacing: config.spacing || DEFAULT_SPACING,
          borders: config.borders || DEFAULT_BORDERS,
          gradients: config.gradients || generateDefaultGradients(colors),
          elementGradients: config.elementGradients || DEFAULT_ELEMENT_GRADIENTS,
          buttonTokens: config.buttonTokens || DEFAULT_BUTTON_TOKENS,
          buttonTokensDark: config.buttonTokensDark || DEFAULT_BUTTON_TOKENS_DARK,
          buttonTransition: config.buttonTransition || DEFAULT_BUTTON_TRANSITION,
        });
      },

      getExportConfig: () => {
        const s = get();
        return {
          foundationColors: s.foundationColors,
          semantic: s.semantic,
          typography: s.typography,
          spacing: s.spacing,
          borders: s.borders,
          gradients: s.gradients,
          elementGradients: s.elementGradients,
          buttonTokens: s.buttonTokens,
          buttonTokensDark: s.buttonTokensDark,
          buttonTransition: s.buttonTransition,
        };
      },

      // --- Resolver: get the actual hex for a semantic token ---
      resolveSemanticColor: (tokenName) => {
        const { semantic, scales } = get();
        const ref = semantic[tokenName];
        return scales[ref] || '#ff00ff'; // magenta = broken ref
      },
    }),
    {
      name: 'bb-ds-config',
      // Bump this when defaults change to force a reset for existing users
      version: 6,
      // Don't persist undo history or computed scales
      partialize: (state) => ({
        foundationColors: state.foundationColors,
        semantic: state.semantic,
        typography: state.typography,
        spacing: state.spacing,
        borders: state.borders,
        gradients: state.gradients,
        elementGradients: state.elementGradients,
        buttonTokens: state.buttonTokens,
        buttonTokensDark: state.buttonTokensDark,
        buttonTransition: state.buttonTransition,
      }),
      // Migrate persisted state to current schema
      migrate: (persisted) => {
        const state = {
          foundationColors: persisted?.foundationColors || { ...DEFAULT_FOUNDATION_COLORS },
          semantic: persisted?.semantic || { ...DEFAULT_SEMANTIC },
          typography: persisted?.typography || { ...DEFAULT_TYPOGRAPHY },
          spacing: persisted?.spacing || { ...DEFAULT_SPACING },
          borders: persisted?.borders || { ...DEFAULT_BORDERS },
          elementGradients: persisted?.elementGradients || { ...DEFAULT_ELEMENT_GRADIENTS },
          buttonTokens: persisted?.buttonTokens || { ...DEFAULT_BUTTON_TOKENS },
          buttonTokensDark: persisted?.buttonTokensDark || { ...DEFAULT_BUTTON_TOKENS_DARK },
          buttonTransition: persisted?.buttonTransition || { ...DEFAULT_BUTTON_TRANSITION },
        };
        // Always regenerate gradients from foundation colors (ensures per-color coverage)
        state.gradients = generateDefaultGradients(state.foundationColors);
        // Migrate v2 flat radius → v3 multiplier system
        if (state.borders.cardRadius !== undefined && state.borders.cardMult === undefined) {
          const r = state.borders.radius || 8;
          state.borders = {
            radius: r,
            cardMult: r > 0 ? Math.round((state.borders.cardRadius / r) * 4) / 4 : 1.5,
            containerMult: r > 0 ? Math.round((state.borders.containerRadius / r) * 4) / 4 : 2,
            buttonMult: r > 0 ? Math.round((state.borders.buttonRadius / r) * 4) / 4 : 0.75,
            inputMult: r > 0 ? Math.round((state.borders.inputRadius / r) * 4) / 4 : 0.75,
            shadow: state.borders.shadow || 'subtle',
          };
        }
        return state;
      },
      // Recompute scales on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.scales = generateAllScales(state.foundationColors);
        }
      },
    }
  )
);

export default useTokenStore;
