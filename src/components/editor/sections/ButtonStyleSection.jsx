"use client";

import { useState } from 'react';
import useTokenStore from '@/lib/tokens/store';
import ScaleStepPicker from '../controls/ScaleStepPicker';
import SliderControl from '../controls/SliderControl';

const VARIANTS = ['primary', 'secondary', 'ghost', 'destructive'];
const EASING_OPTIONS = ['ease', 'ease-in-out', 'ease-in', 'ease-out', 'linear'];

const TOKEN_FIELDS = [
  { key: 'bg', label: 'Background' },
  { key: 'text', label: 'Text' },
  { key: 'border', label: 'Border' },
];

const HOVER_FIELDS = [
  { key: 'hoverBg', label: 'Hover Bg' },
  { key: 'hoverText', label: 'Hover Text' },
  { key: 'hoverBorder', label: 'Hover Border' },
];

function TokenField({ variant, field, tokens, setToken, gradients, scales }) {
  const { key, label } = field;
  const ref = tokens[key];

  // Gradient bg support
  if (key === 'bg' || key === 'hoverBg') {
    const isGradient = ref && ref.startsWith('gradient-');
    if (isGradient) {
      const gradNames = Object.keys(gradients || {});
      const grad = gradients[ref];
      const resolvedStops = grad ? grad.stops.map((s) => scales[s] || '#ff00ff') : [];
      const swatchBg = grad ? `linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')})` : '#333';
      return (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded border border-editor-border" style={{ background: swatchBg }} />
          <select
            value={ref}
            onChange={(e) => setToken(variant, key, e.target.value)}
            className="flex-1 bg-editor-bg border border-editor-border rounded px-1 py-0.5 text-[10px] text-editor-text outline-none"
          >
            {gradNames.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button
            onClick={() => setToken(variant, key, 'primary-500')}
            className="text-[9px] text-editor-text-muted hover:text-editor-text"
            title="Switch to solid color"
          >
            Solid
          </button>
        </div>
      );
    }
  }

  // Null / transparent
  if (ref === 'transparent' || ref === null) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded border border-editor-border bg-editor-bg flex items-center justify-center">
          <span className="text-[8px] text-editor-text-muted">—</span>
        </div>
        <span className="text-[10px] font-mono text-editor-text-muted flex-1">{label}</span>
        <button
          onClick={() => setToken(variant, key, 'neutral-500')}
          className="text-[9px] text-editor-accent hover:text-editor-accent-hover"
        >
          Set
        </button>
      </div>
    );
  }

  // Scale/semantic ref with ScaleStepPicker
  return (
    <div className="flex items-center gap-2">
      <ScaleStepPicker
        currentRef={ref}
        onSelect={(newRef) => setToken(variant, key, newRef)}
      />
      <span className="text-[10px] font-mono text-editor-text flex-1">{label}</span>
      {(key === 'bg' || key === 'hoverBg') && (
        <button
          onClick={() => {
            const gradNames = Object.keys(gradients || {});
            setToken(variant, key, gradNames[0] || 'gradient-primary');
          }}
          className="text-[9px] text-editor-accent hover:text-editor-accent-hover"
          title="Use gradient"
        >
          Grad
        </button>
      )}
      {(key === 'bg' || key === 'hoverBg') && (
        <button
          onClick={() => setToken(variant, key, 'transparent')}
          className="text-[9px] text-editor-text-muted hover:text-red-400"
        >
          ✕
        </button>
      )}
      {(key === 'border' || key === 'hoverBorder') && (
        <button
          onClick={() => setToken(variant, key, null)}
          className="text-[9px] text-editor-text-muted hover:text-red-400"
          title="Remove"
        >
          ✕
        </button>
      )}
      {(key === 'hoverText') && (
        <button
          onClick={() => setToken(variant, key, null)}
          className="text-[9px] text-editor-text-muted hover:text-red-400"
          title="No change on hover"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function ButtonStyleSection() {
  const [mode, setMode] = useState('light'); // 'light' or 'dark'
  const buttonTokens = useTokenStore((s) => s.buttonTokens);
  const buttonTokensDark = useTokenStore((s) => s.buttonTokensDark);
  const setButtonToken = useTokenStore((s) => s.setButtonToken);
  const setButtonTokenDark = useTokenStore((s) => s.setButtonTokenDark);
  const buttonTransition = useTokenStore((s) => s.buttonTransition);
  const setButtonTransition = useTokenStore((s) => s.setButtonTransition);
  const gradients = useTokenStore((s) => s.gradients);
  const scales = useTokenStore((s) => s.scales);

  const tokens = mode === 'light' ? buttonTokens : buttonTokensDark;
  const setToken = mode === 'light' ? setButtonToken : setButtonTokenDark;

  return (
    <div className="space-y-4">
      {/* Transition controls */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-editor-text-muted mb-1">
          Transition
        </div>
        <SliderControl
          label="Duration"
          value={buttonTransition.duration}
          min={0.05} max={0.5} step={0.05} unit="s"
          onChange={(v) => setButtonTransition('duration', v)}
        />
        <div className="mt-1">
          <label className="text-[10px] text-editor-text-muted block mb-0.5">Easing</label>
          <div className="flex gap-1 flex-wrap">
            {EASING_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setButtonTransition('easing', opt)}
                className={`text-[9px] px-1.5 py-0.5 rounded transition-colors ${
                  buttonTransition.easing === opt
                    ? 'bg-editor-accent text-white'
                    : 'bg-editor-bg text-editor-text-muted border border-editor-border hover:text-editor-text'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Light / Dark toggle */}
      <div className="flex border border-editor-border rounded overflow-hidden">
        <button
          onClick={() => setMode('light')}
          className={`flex-1 text-[10px] py-1.5 font-semibold transition-colors ${
            mode === 'light' ? 'bg-editor-accent text-white' : 'bg-editor-bg text-editor-text-muted hover:text-editor-text'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setMode('dark')}
          className={`flex-1 text-[10px] py-1.5 font-semibold transition-colors ${
            mode === 'dark' ? 'bg-editor-accent text-white' : 'bg-editor-bg text-editor-text-muted hover:text-editor-text'
          }`}
        >
          Dark
        </button>
      </div>

      {/* Per-variant controls */}
      {VARIANTS.map((variant) => {
        const vTokens = tokens[variant];
        if (!vTokens) return null;
        return (
          <div key={variant}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-editor-text-muted capitalize">
                {variant}
              </div>
              <button
                className={`bb-btn bb-btn-${variant} bb-btn-sm`}
                style={{ fontSize: '9px', padding: '2px 6px', pointerEvents: 'none' }}
              >
                {variant}
              </button>
            </div>

            {/* Default state */}
            <div className="text-[9px] text-editor-text-muted/60 uppercase tracking-wider mb-1">Default</div>
            <div className="space-y-1 mb-2">
              {TOKEN_FIELDS.map((field) => (
                <TokenField
                  key={field.key}
                  variant={variant}
                  field={field}
                  tokens={vTokens}
                  setToken={setToken}
                  gradients={gradients}
                  scales={scales}
                />
              ))}
            </div>

            {/* Hover state */}
            <div className="text-[9px] text-editor-text-muted/60 uppercase tracking-wider mb-1">Hover</div>
            <div className="space-y-1">
              {HOVER_FIELDS.map((field) => (
                <TokenField
                  key={field.key}
                  variant={variant}
                  field={field}
                  tokens={vTokens}
                  setToken={setToken}
                  gradients={gradients}
                  scales={scales}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
