"use client";

import useTokenStore from '@/lib/tokens/store';
import { TYPE_SCALE } from '@/lib/tokens/defaults';
import ProofButton from './ProofButton';
import ProofCard from './ProofCard';

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 mt-10 first:mt-0">
      {children}
    </h2>
  );
}

function ColorPalette() {
  const foundationColors = useTokenStore((s) => s.foundationColors);
  const scales = useTokenStore((s) => s.scales);

  return (
    <div className="space-y-3">
      {Object.keys(foundationColors).map((name) => (
        <div key={name}>
          <div className="text-[10px] font-mono text-gray-500 mb-1">{name}</div>
          <div className="flex rounded-lg overflow-hidden">
            {STEPS.map((step) => {
              const hex = scales[`${name}-${step}`];
              return (
                <div key={step} className="flex-1 group relative">
                  <div className="h-10" style={{ backgroundColor: hex }} />
                  <div className="text-[8px] text-center py-0.5 text-gray-400 font-mono">{step}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SemanticGrid() {
  const semantic = useTokenStore((s) => s.semantic);
  const scales = useTokenStore((s) => s.scales);

  return (
    <div className="grid grid-cols-5 gap-2">
      {Object.entries(semantic).map(([name, ref]) => {
        const hex = scales[ref] || '#ff00ff';
        return (
          <div key={name} className="text-center">
            <div
              className="w-full h-10 rounded border border-gray-200"
              style={{ backgroundColor: hex }}
            />
            <div className="text-[9px] font-mono text-gray-500 mt-1 truncate">{name}</div>
          </div>
        );
      })}
    </div>
  );
}

function TypeSpecimen() {
  return (
    <div style={{ fontFamily: 'var(--bb-font-heading)' }}>
      <div
        style={{
          fontSize: 'var(--bb-text-5xl)',
          fontWeight: 'var(--bb-heading-weight)',
          color: 'var(--bb-text-primary)',
          lineHeight: 'var(--bb-heading-line-height)',
        }}
      >
        Heading 5XL
      </div>
      <div
        style={{
          fontSize: 'var(--bb-text-3xl)',
          fontWeight: 'var(--bb-heading-weight)',
          color: 'var(--bb-text-primary)',
          lineHeight: 'var(--bb-heading-line-height)',
          marginTop: 'var(--bb-space-2)',
        }}
      >
        Heading 3XL
      </div>
      <div
        style={{
          fontSize: 'var(--bb-text-xl)',
          fontWeight: 'var(--bb-heading-weight)',
          color: 'var(--bb-text-primary)',
          lineHeight: 'var(--bb-heading-line-height)',
          marginTop: 'var(--bb-space-2)',
        }}
      >
        Heading XL
      </div>
      <p
        style={{
          fontFamily: 'var(--bb-font-body)',
          fontSize: 'var(--bb-text-base)',
          fontWeight: 'var(--bb-body-weight)',
          color: 'var(--bb-text-secondary)',
          lineHeight: 'var(--bb-line-height)',
          marginTop: 'var(--bb-space-4)',
          maxWidth: '600px',
        }}
      >
        Body text at base size. This paragraph demonstrates the body font, weight, line height, and secondary text color. All values are driven by design tokens and update in real time.
      </p>
      <code
        style={{
          fontFamily: 'var(--bb-font-mono)',
          fontSize: 'var(--bb-text-sm)',
          color: 'var(--bb-text-secondary)',
          display: 'block',
          marginTop: 'var(--bb-space-3)',
        }}
      >
        const mono = &quot;JetBrains Mono&quot;;
      </code>
    </div>
  );
}

function SpacingVis() {
  const spacing = useTokenStore((s) => s.spacing);
  const steps = [1, 2, 3, 4, 6, 8, 12, 16];

  return (
    <div className="space-y-1">
      {steps.map((i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-400 w-6 text-right">{i}</span>
          <div
            className="h-3 rounded-sm"
            style={{
              width: `${spacing.base * i}px`,
              backgroundColor: 'var(--bb-action-primary)',
              opacity: 0.6,
            }}
          />
          <span className="text-[10px] font-mono text-gray-400">{spacing.base * i}px</span>
        </div>
      ))}
    </div>
  );
}

function ProofComponents() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bb-bg-primary)',
        padding: 'var(--bb-section-padding) var(--bb-container-padding)',
        borderRadius: 'var(--bb-radius)',
      }}
    >
      {/* Buttons */}
      <div style={{ marginBottom: 'var(--bb-component-gap)' }}>
        <div className="text-[10px] font-mono text-gray-400 mb-3">Buttons</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bb-component-gap)', alignItems: 'center' }}>
          <ProofButton variant="primary" size="sm">Small</ProofButton>
          <ProofButton variant="primary" size="md">Primary</ProofButton>
          <ProofButton variant="primary" size="lg">Large</ProofButton>
          <ProofButton variant="secondary" size="md">Secondary</ProofButton>
          <ProofButton variant="ghost" size="md">Ghost</ProofButton>
        </div>
      </div>

      {/* Cards */}
      <div>
        <div className="text-[10px] font-mono text-gray-400 mb-3">Cards</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--bb-component-gap)' }}>
          <ProofCard title="Design Tokens">
            Foundation colors cascade through semantic assignments to every component automatically.
          </ProofCard>
          <ProofCard title="Typography">
            Font families, sizes, weights, and line heights all respond to token changes in real time.
          </ProofCard>
          <ProofCard title="Spacing">
            A base unit drives the entire spacing scale, keeping proportions consistent throughout.
          </ProofCard>
        </div>
      </div>
    </div>
  );
}

export default function PreviewPanel() {
  return (
    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bb-bg-surface, #f9fafb)' }}>
      <div style={{ padding: 'var(--bb-container-padding)', maxWidth: 'var(--bb-max-width)', margin: '0 auto' }}>
        <SectionTitle>Color Palette</SectionTitle>
        <ColorPalette />

        <SectionTitle>Semantic Colors</SectionTitle>
        <SemanticGrid />

        <SectionTitle>Typography</SectionTitle>
        <TypeSpecimen />

        <SectionTitle>Spacing Scale</SectionTitle>
        <SpacingVis />

        <SectionTitle>Proof Components</SectionTitle>
        <ProofComponents />
      </div>
    </main>
  );
}
