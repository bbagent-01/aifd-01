"use client";

import { useState } from 'react';
import useTokenStore from '@/lib/tokens/store';
import ScaleStepPicker from '../controls/ScaleStepPicker';
import { getContrastInfo } from '@/lib/color/contrast';
import { DEFAULT_SEMANTIC_KEYS, SEMANTIC_GROUPS } from '@/lib/tokens/defaults';
import SliderControl from '../controls/SliderControl';

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Pairs to check contrast on (text token, bg token)
const CONTRAST_PAIRS = [
  ['text-primary', 'bg-primary'],
  ['text-secondary', 'bg-primary'],
  ['text-on-action', 'action-primary'],
];

export default function ColorSection() {
  const foundationColors = useTokenStore((s) => s.foundationColors);
  const scales = useTokenStore((s) => s.scales);
  const semantic = useTokenStore((s) => s.semantic);
  const setFoundationColor = useTokenStore((s) => s.setFoundationColor);
  const addFoundationColor = useTokenStore((s) => s.addFoundationColor);
  const removeFoundationColor = useTokenStore((s) => s.removeFoundationColor);
  const setSemanticRef = useTokenStore((s) => s.setSemanticRef);
  const addSemanticToken = useTokenStore((s) => s.addSemanticToken);
  const removeSemanticToken = useTokenStore((s) => s.removeSemanticToken);
  const gradients = useTokenStore((s) => s.gradients);
  const setGradient = useTokenStore((s) => s.setGradient);
  const addGradient = useTokenStore((s) => s.addGradient);
  const removeGradient = useTokenStore((s) => s.removeGradient);

  const [newColorName, setNewColorName] = useState('');
  const [newGradientName, setNewGradientName] = useState('');
  const [addingGroup, setAddingGroup] = useState(null); // which group is showing the add input
  const [newTokenName, setNewTokenName] = useState('');

  const protectedColors = ['primary', 'neutral', 'dark'];

  // Build the list of tokens per group dynamically from the semantic map
  const getGroupTokens = (group) => {
    const prefix = group.prefix + '-';
    const exclude = group.excludePrefix ? group.excludePrefix + '-' : null;
    // Start with the group's default keys that exist in semantic
    const defaultKeys = group.keys.filter((k) => semantic[k]);
    // Find any custom tokens with the same prefix (excluding sub-prefixes)
    const prefixes = [prefix, ...(group.extraPrefixes || []).map((p) => p + '-')];
    const customKeys = Object.keys(semantic).filter(
      (k) => prefixes.some((p) => k.startsWith(p)) && !group.keys.includes(k) && (!exclude || !k.startsWith(exclude))
    );
    return [...defaultKeys, ...customKeys];
  };

  const handleAddToken = (group) => {
    const name = newTokenName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!name) return;
    const fullName = `${group.prefix}-${name}`;
    if (semantic[fullName]) return; // already exists
    addSemanticToken(fullName, group.defaultRef);
    setNewTokenName('');
    setAddingGroup(null);
  };

  return (
    <div className="space-y-5">
      {/* Foundation Colors — large swatches */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-editor-text-muted mb-2">
          Foundation
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(foundationColors).map(([name, hex]) => (
            <div key={name} className="relative group">
              <div className="relative">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setFoundationColor(name, e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-full h-16 rounded-lg border border-editor-border cursor-pointer"
                  style={{ backgroundColor: hex }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <div className="text-[10px] text-editor-text capitalize leading-tight">{name}</div>
                  <div className="text-[9px] font-mono text-editor-text-muted uppercase">{hex}</div>
                </div>
                {!protectedColors.includes(name) && (
                  <button
                    onClick={() => removeFoundationColor(name)}
                    className="opacity-0 group-hover:opacity-100 text-editor-text-muted hover:text-red-400 text-xs transition-opacity"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Add color */}
        <div className="flex gap-1 mt-3">
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
            placeholder="color name"
            className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-editor-text outline-none focus:border-editor-accent"
          />
          <button
            onClick={() => {
              if (newColorName && !foundationColors[newColorName]) {
                addFoundationColor(newColorName, '#6366f1');
                setNewColorName('');
              }
            }}
            className="bg-editor-accent text-white text-xs px-2 py-1 rounded hover:bg-editor-accent-hover transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Generated Scales */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-editor-text-muted mb-2">
          Scales
        </div>
        <div className="space-y-2">
          {Object.keys(foundationColors).map((name) => (
            <div key={name}>
              <div className="text-[9px] font-mono text-editor-text-muted mb-0.5">{name}</div>
              <div className="flex gap-px rounded overflow-hidden">
                {STEPS.map((step) => {
                  const hex = scales[`${name}-${step}`];
                  return (
                    <div
                      key={step}
                      className="flex-1 h-5"
                      style={{ backgroundColor: hex }}
                      title={`${name}-${step}: ${hex}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Assignments — grouped by category */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-editor-text-muted mb-2">
          Semantic Tokens
        </div>
        <div className="space-y-3">
          {SEMANTIC_GROUPS.map((group) => {
            const tokens = getGroupTokens(group);
            return (
              <div key={group.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[9px] font-mono text-editor-text-muted/60 uppercase tracking-wider">
                    {group.label}
                  </div>
                  <button
                    onClick={() => {
                      if (addingGroup === group.label) {
                        setAddingGroup(null);
                        setNewTokenName('');
                      } else {
                        setAddingGroup(group.label);
                        setNewTokenName('');
                      }
                    }}
                    className="text-[10px] text-editor-accent hover:text-editor-accent-hover transition-colors"
                    title={`Add ${group.label.toLowerCase()} token`}
                  >
                    +
                  </button>
                </div>

                {/* Add token input */}
                {addingGroup === group.label && (
                  <div className="flex gap-1 mb-2">
                    <span className="text-[10px] text-editor-text-muted py-1">{group.prefix}-</span>
                    <input
                      type="text"
                      value={newTokenName}
                      onChange={(e) => setNewTokenName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="name"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddToken(group);
                        if (e.key === 'Escape') { setAddingGroup(null); setNewTokenName(''); }
                      }}
                      className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1 text-[10px] text-editor-text outline-none focus:border-editor-accent"
                    />
                    <button
                      onClick={() => handleAddToken(group)}
                      className="bg-editor-accent text-white text-[10px] px-2 py-1 rounded hover:bg-editor-accent-hover transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}

                <div className="space-y-1">
                  {tokens.map((name) => {
                    const ref = semantic[name];
                    if (!ref) return null;
                    const isCustom = !DEFAULT_SEMANTIC_KEYS.includes(name);
                    const pair = CONTRAST_PAIRS.find(([fg]) => fg === name);
                    let contrastInfo = null;
                    if (pair) {
                      const fgHex = scales[semantic[pair[0]]] || '#000';
                      const bgHex = scales[semantic[pair[1]]] || '#fff';
                      contrastInfo = getContrastInfo(fgHex, bgHex);
                    }

                    return (
                      <div key={name} className="flex items-center gap-2">
                        <ScaleStepPicker
                          currentRef={ref}
                          onSelect={(key) => setSemanticRef(name, key)}
                        />
                        <span className="text-[10px] font-mono text-editor-text flex-1 truncate">{name}</span>
                        {contrastInfo && (
                          <span
                            className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                              contrastInfo.level === 'AAA' ? 'bg-green-900/40 text-green-400' :
                              contrastInfo.level === 'AA' ? 'bg-yellow-900/40 text-yellow-400' :
                              'bg-red-900/40 text-red-400'
                            }`}
                            title={`Contrast ratio: ${contrastInfo.ratio}:1`}
                          >
                            {contrastInfo.ratio} {contrastInfo.level}
                          </span>
                        )}
                        {isCustom && (
                          <button
                            onClick={() => removeSemanticToken(name)}
                            className="text-editor-text-muted hover:text-red-400 text-[10px] transition-colors"
                            title="Remove token"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradients */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-editor-text-muted mb-2">
          Gradients
        </div>
        <div className="space-y-3">
          {Object.entries(gradients || {}).map(([name, grad]) => {
            const resolvedStops = grad.stops.map((ref) => scales[ref] || '#ff00ff');
            const gradientCSS = `linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')})`;
            return (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-editor-text truncate">{name}</span>
                  <button
                    onClick={() => removeGradient(name)}
                    className="text-editor-text-muted hover:text-red-400 text-[10px] transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div
                  className="w-full h-18 rounded border border-editor-border"
                  style={{ background: gradientCSS }}
                />
                <SliderControl
                  label="Angle"
                  value={grad.angle}
                  min={0} max={360} step={5} unit="°"
                  onChange={(v) => setGradient(name, { ...grad, angle: v })}
                />
                <div className="space-y-1">
                  {grad.stops.map((stopRef, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ScaleStepPicker
                        currentRef={stopRef}
                        onSelect={(ref) => {
                          const stops = [...grad.stops];
                          stops[idx] = ref;
                          setGradient(name, { ...grad, stops });
                        }}
                      />
                      <span className="text-[10px] font-mono text-editor-text flex-1 truncate">{stopRef}</span>
                      {grad.stops.length > 2 && (
                        <button
                          onClick={() => setGradient(name, { ...grad, stops: grad.stops.filter((_, i) => i !== idx) })}
                          className="text-editor-text-muted hover:text-red-400 text-[10px]"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setGradient(name, { ...grad, stops: [...grad.stops, 'neutral-500'] })}
                    className="text-[10px] text-editor-accent hover:text-editor-accent-hover"
                  >
                    + Add stop
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Add gradient */}
        <div className="flex gap-1 mt-2">
          <input
            type="text"
            value={newGradientName}
            onChange={(e) => setNewGradientName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="name"
            className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-editor-text outline-none focus:border-editor-accent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newGradientName) {
                const fullName = newGradientName.startsWith('gradient-') ? newGradientName : `gradient-${newGradientName}`;
                if (!gradients[fullName]) { addGradient(fullName); setNewGradientName(''); }
              }
            }}
          />
          <button
            onClick={() => {
              if (newGradientName) {
                const fullName = newGradientName.startsWith('gradient-') ? newGradientName : `gradient-${newGradientName}`;
                if (!gradients[fullName]) { addGradient(fullName); setNewGradientName(''); }
              }
            }}
            className="bg-editor-accent text-white text-xs px-2 py-1 rounded hover:bg-editor-accent-hover transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
