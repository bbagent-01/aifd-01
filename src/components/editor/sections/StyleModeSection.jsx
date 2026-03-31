"use client";

import useTokenStore from '@/lib/tokens/store';
import { STYLE_MODES } from '@/lib/tokens/defaults';

const MODE_ICONS = {
  rectilinear: '▬',
  bento: '▢',
  soft: '◯',
  rounded: '◉',
};

export default function StyleModeSection() {
  const applyStyleMode = useTokenStore((s) => s.applyStyleMode);
  const borders = useTokenStore((s) => s.borders);

  // Detect which mode (if any) matches current borders
  const activeMode = Object.entries(STYLE_MODES).find(([, mode]) => {
    const t = mode.tokens.borders;
    return t && t.radius === borders.radius && t.shadow === borders.shadow;
  })?.[0] || null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(STYLE_MODES).map(([key, mode]) => {
        const isActive = activeMode === key;
        return (
          <button
            key={key}
            onClick={() => applyStyleMode(key)}
            className={`text-left p-3 rounded-lg border transition-colors ${
              isActive
                ? 'border-editor-accent bg-editor-accent/10'
                : 'border-editor-border bg-editor-bg hover:border-editor-text-muted'
            }`}
          >
            <div className="text-lg mb-1">{MODE_ICONS[key] || '●'}</div>
            <div className={`text-[11px] font-semibold ${isActive ? 'text-editor-accent' : 'text-editor-text'}`}>
              {mode.label}
            </div>
            <div className="text-[9px] text-editor-text-muted leading-tight mt-0.5">
              {mode.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
