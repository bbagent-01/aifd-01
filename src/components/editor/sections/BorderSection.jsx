"use client";

import useTokenStore from '@/lib/tokens/store';
import SliderControl from '../controls/SliderControl';

const SHADOW_OPTIONS = ['none', 'subtle', 'medium', 'strong'];

function MultiplierSlider({ label, value, base, onChange }) {
  const computed = Math.round(base * value);
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-editor-text-muted">{label}</span>
        <span className="text-[10px] font-mono text-editor-accent">
          {value}x → {computed}px
        </span>
      </div>
      <input
        type="range"
        min={0} max={3} step={0.25}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-editor-accent h-1"
      />
    </div>
  );
}

export default function BorderSection() {
  const borders = useTokenStore((s) => s.borders);
  const setBorders = useTokenStore((s) => s.setBorders);

  const r = borders.radius;

  return (
    <div className="space-y-3">
      <SliderControl
        label="Base Radius"
        value={borders.radius}
        min={0} max={24} step={1} unit="px"
        onChange={(v) => setBorders('radius', v)}
      />

      <div className="text-[10px] font-semibold uppercase tracking-wider text-editor-text-muted mt-2 mb-1">
        Multipliers
      </div>

      <MultiplierSlider
        label="Card"
        value={borders.cardMult || 1.5}
        base={r}
        onChange={(v) => setBorders('cardMult', v)}
      />
      <MultiplierSlider
        label="Container"
        value={borders.containerMult || 2}
        base={r}
        onChange={(v) => setBorders('containerMult', v)}
      />
      <MultiplierSlider
        label="Button"
        value={borders.buttonMult || 0.75}
        base={r}
        onChange={(v) => setBorders('buttonMult', v)}
      />
      <MultiplierSlider
        label="Input"
        value={borders.inputMult || 0.75}
        base={r}
        onChange={(v) => setBorders('inputMult', v)}
      />

      <div>
        <label className="text-xs text-editor-text-muted block mb-1">Shadow</label>
        <div className="flex gap-1">
          {SHADOW_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setBorders('shadow', opt)}
              className={`text-[10px] px-2 py-1 rounded capitalize transition-colors ${
                borders.shadow === opt
                  ? 'bg-editor-accent text-white'
                  : 'bg-editor-bg text-editor-text-muted border border-editor-border hover:text-editor-text'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-editor-text-muted mb-2">
          Preview
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <div
            className="w-20 h-14 bg-editor-bg border border-editor-border flex items-center justify-center text-[8px] text-editor-text-muted"
            style={{ borderRadius: `${Math.round(r * (borders.containerMult || 2))}px` }}
          >
            Container
          </div>
          <div
            className="w-14 h-10 bg-editor-bg border border-editor-border flex items-center justify-center text-[8px] text-editor-text-muted"
            style={{ borderRadius: `${Math.round(r * (borders.cardMult || 1.5))}px` }}
          >
            Card
          </div>
          <div
            className="px-3 py-1.5 bg-editor-accent text-white text-[10px] font-medium"
            style={{ borderRadius: `${Math.round(r * (borders.buttonMult || 0.75))}px` }}
          >
            Button
          </div>
          <div
            className="px-2.5 py-1 bg-editor-bg border border-editor-border text-[10px] text-editor-text-muted"
            style={{ borderRadius: `${Math.round(r * (borders.inputMult || 0.75))}px` }}
          >
            Input
          </div>
        </div>
      </div>
    </div>
  );
}
