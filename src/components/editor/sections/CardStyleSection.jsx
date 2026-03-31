"use client";

import { useState } from 'react';
import useTokenStore from '@/lib/tokens/store';
import ScaleStepPicker from '../controls/ScaleStepPicker';
import SliderControl from '../controls/SliderControl';
import { SHADOW_PRESETS } from '@/lib/tokens/defaults';

const SHADOW_OPTIONS = Object.keys(SHADOW_PRESETS);

const COLOR_FIELDS = [
  { key: 'bg', label: 'Background' },
  { key: 'borderColor', label: 'Border Color' },
  { key: 'titleColor', label: 'Title Color' },
  { key: 'bodyColor', label: 'Body Color' },
];

export default function CardStyleSection() {
  const [mode, setMode] = useState('light');
  const cardTokens = useTokenStore((s) => s.cardTokens);
  const cardTokensDark = useTokenStore((s) => s.cardTokensDark);
  const setCardToken = useTokenStore((s) => s.setCardToken);
  const setCardTokenDark = useTokenStore((s) => s.setCardTokenDark);
  const gradients = useTokenStore((s) => s.gradients);
  const scales = useTokenStore((s) => s.scales);

  const tokens = mode === 'light' ? cardTokens : cardTokensDark;
  const setToken = mode === 'light' ? setCardToken : setCardTokenDark;

  return (
    <div className="space-y-3">
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

      {/* Color fields */}
      {COLOR_FIELDS.map(({ key, label }) => {
        const ref = tokens[key];
        // Support gradient for bg
        if (key === 'bg' && ref && ref.startsWith('gradient-')) {
          const gradNames = Object.keys(gradients || {});
          const grad = gradients[ref];
          const resolvedStops = grad ? grad.stops.map((s) => scales[s] || '#ff00ff') : [];
          const swatchBg = grad ? `linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')})` : '#333';
          return (
            <div key={key} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded border border-editor-border" style={{ background: swatchBg }} />
              <select
                value={ref}
                onChange={(e) => setToken(key, e.target.value)}
                className="flex-1 bg-editor-bg border border-editor-border rounded px-1 py-0.5 text-[10px] text-editor-text outline-none"
              >
                {gradNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <button onClick={() => setToken(key, 'accent-50')} className="text-[9px] text-editor-text-muted hover:text-editor-text">Solid</button>
            </div>
          );
        }
        if (ref === null) {
          return (
            <div key={key} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded border border-editor-border bg-editor-bg flex items-center justify-center">
                <span className="text-[8px] text-editor-text-muted">—</span>
              </div>
              <span className="text-[10px] font-mono text-editor-text-muted flex-1">{label}</span>
              <button onClick={() => setToken(key, 'neutral-500')} className="text-[9px] text-editor-accent">Set</button>
            </div>
          );
        }
        return (
          <div key={key} className="flex items-center gap-2">
            <ScaleStepPicker currentRef={ref} onSelect={(v) => setToken(key, v)} />
            <span className="text-[10px] font-mono text-editor-text flex-1">{label}</span>
            {key === 'bg' && (
              <button
                onClick={() => { const g = Object.keys(gradients || {}); setToken(key, g[0] || 'gradient-primary'); }}
                className="text-[9px] text-editor-accent"
              >
                Grad
              </button>
            )}
            {key === 'borderColor' && (
              <button onClick={() => setToken(key, null)} className="text-[9px] text-editor-text-muted hover:text-red-400">✕</button>
            )}
          </div>
        );
      })}

      {/* Border width */}
      <SliderControl
        label="Border Width"
        value={tokens.borderWidth ?? 1}
        min={0} max={4} step={1} unit="px"
        onChange={(v) => setToken('borderWidth', v)}
      />

      {/* Shadow */}
      <div>
        <label className="text-[10px] text-editor-text-muted block mb-1">Shadow</label>
        <div className="flex gap-1">
          {SHADOW_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setToken('shadow', opt)}
              className={`text-[9px] px-1.5 py-0.5 rounded capitalize transition-colors ${
                tokens.shadow === opt
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
  );
}
