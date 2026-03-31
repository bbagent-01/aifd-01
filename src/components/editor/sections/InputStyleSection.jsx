"use client";

import { useState } from 'react';
import useTokenStore from '@/lib/tokens/store';
import ScaleStepPicker from '../controls/ScaleStepPicker';
import SliderControl from '../controls/SliderControl';

const COLOR_FIELDS = [
  { key: 'bg', label: 'Background' },
  { key: 'text', label: 'Text' },
  { key: 'borderColor', label: 'Border' },
  { key: 'focusBorderColor', label: 'Focus Border' },
  { key: 'placeholderColor', label: 'Placeholder' },
  { key: 'labelColor', label: 'Label' },
];

export default function InputStyleSection() {
  const [mode, setMode] = useState('light');
  const inputTokens = useTokenStore((s) => s.inputTokens);
  const inputTokensDark = useTokenStore((s) => s.inputTokensDark);
  const setInputToken = useTokenStore((s) => s.setInputToken);
  const setInputTokenDark = useTokenStore((s) => s.setInputTokenDark);

  const tokens = mode === 'light' ? inputTokens : inputTokensDark;
  const setToken = mode === 'light' ? setInputToken : setInputTokenDark;

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
        return (
          <div key={key} className="flex items-center gap-2">
            <ScaleStepPicker currentRef={ref} onSelect={(v) => setToken(key, v)} />
            <span className="text-[10px] font-mono text-editor-text flex-1">{label}</span>
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
    </div>
  );
}
