"use client";

import { useState } from 'react';
import useTokenStore from '@/lib/tokens/store';
import ScaleStepPicker from '../controls/ScaleStepPicker';
import SliderControl from '../controls/SliderControl';

export default function GradientSection() {
  const gradients = useTokenStore((s) => s.gradients);
  const scales = useTokenStore((s) => s.scales);
  const setGradient = useTokenStore((s) => s.setGradient);
  const addGradient = useTokenStore((s) => s.addGradient);
  const removeGradient = useTokenStore((s) => s.removeGradient);

  const [newName, setNewName] = useState('');

  const handleAddStop = (name, grad) => {
    setGradient(name, { ...grad, stops: [...grad.stops, 'neutral-500'] });
  };

  const handleRemoveStop = (name, grad, idx) => {
    if (grad.stops.length <= 2) return; // minimum 2 stops
    const stops = grad.stops.filter((_, i) => i !== idx);
    setGradient(name, { ...grad, stops });
  };

  const handleSetStop = (name, grad, idx, ref) => {
    const stops = [...grad.stops];
    stops[idx] = ref;
    setGradient(name, { ...grad, stops });
  };

  return (
    <div className="space-y-4">
      {Object.entries(gradients).map(([name, grad]) => {
        // Resolve stops to hex for swatch preview
        const resolvedStops = grad.stops.map((ref) => scales[ref] || '#ff00ff');
        const gradientCSS = `linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')})`;

        return (
          <div key={name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-editor-text truncate">{name}</span>
              <button
                onClick={() => removeGradient(name)}
                className="text-editor-text-muted hover:text-red-400 text-[10px] transition-colors"
                title="Remove gradient"
              >
                ✕
              </button>
            </div>

            {/* Gradient swatch */}
            <div
              className="w-full h-8 rounded-md border border-editor-border"
              style={{ background: gradientCSS }}
            />

            {/* Angle */}
            <SliderControl
              label="Angle"
              value={grad.angle}
              min={0} max={360} step={5} unit="°"
              onChange={(v) => setGradient(name, { ...grad, angle: v })}
            />

            {/* Stops */}
            <div>
              <div className="text-[9px] font-mono text-editor-text-muted uppercase tracking-wider mb-1">
                Stops
              </div>
              <div className="space-y-1">
                {grad.stops.map((stopRef, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <ScaleStepPicker
                      currentRef={stopRef}
                      onSelect={(ref) => handleSetStop(name, grad, idx, ref)}
                    />
                    <span className="text-[10px] font-mono text-editor-text flex-1 truncate">{stopRef}</span>
                    {grad.stops.length > 2 && (
                      <button
                        onClick={() => handleRemoveStop(name, grad, idx)}
                        className="text-editor-text-muted hover:text-red-400 text-[10px] transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleAddStop(name, grad)}
                className="text-[10px] text-editor-accent hover:text-editor-accent-hover mt-1 transition-colors"
              >
                + Add stop
              </button>
            </div>
          </div>
        );
      })}

      {/* Add gradient */}
      <div className="flex gap-1 mt-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          placeholder="gradient-name"
          className="flex-1 bg-editor-bg border border-editor-border rounded px-2 py-1 text-xs text-editor-text outline-none focus:border-editor-accent"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newName) {
              const fullName = newName.startsWith('gradient-') ? newName : `gradient-${newName}`;
              if (!gradients[fullName]) {
                addGradient(fullName);
                setNewName('');
              }
            }
          }}
        />
        <button
          onClick={() => {
            if (newName) {
              const fullName = newName.startsWith('gradient-') ? newName : `gradient-${newName}`;
              if (!gradients[fullName]) {
                addGradient(fullName);
                setNewName('');
              }
            }
          }}
          className="bg-editor-accent text-white text-xs px-2 py-1 rounded hover:bg-editor-accent-hover transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
