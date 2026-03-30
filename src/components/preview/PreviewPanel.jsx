"use client";

import useTokenStore from '@/lib/tokens/store';
import { TYPE_SCALE } from '@/lib/tokens/defaults';
import Button from './atoms/Button';
import Input from './atoms/Input';
import Badge from './atoms/Badge';
import Toggle from './atoms/Toggle';
import ProofCard from './ProofCard';
import NavBar from './molecules/NavBar';
import FeatureBlock from './molecules/FeatureBlock';
import StatsBlock from './molecules/StatsBlock';
import Testimonial from './molecules/Testimonial';
import PricingCard from './molecules/PricingCard';

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
    <div>
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: 'var(--bb-font-body)',
          fontSize: 'var(--bb-text-xs)',
          fontWeight: 600,
          color: 'var(--bb-action-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 'var(--bb-space-2)',
        }}
      >
        Eyebrow Label
      </div>
      <div
        style={{
          fontFamily: 'var(--bb-font-heading)',
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
          fontFamily: 'var(--bb-font-heading)',
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
          fontFamily: 'var(--bb-font-heading)',
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
      <div
        style={{
          fontFamily: 'var(--bb-font-body)',
          fontSize: 'var(--bb-text-sm)',
          color: 'var(--bb-text-secondary)',
          marginTop: 'var(--bb-space-2)',
        }}
      >
        Small / caption text for labels and secondary content.
      </div>
      <code
        style={{
          fontFamily: 'var(--bb-font-mono)',
          fontSize: 'var(--bb-text-sm)',
          color: 'var(--bb-text-secondary)',
          display: 'block',
          marginTop: 'var(--bb-space-3)',
          backgroundColor: 'var(--bb-bg-card)',
          padding: 'var(--bb-space-3)',
          borderRadius: 'var(--bb-radius)',
          border: '1px solid var(--bb-border-faint)',
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

function ComponentLabel({ children }) {
  return <div className="text-[10px] font-mono text-gray-400 mb-3 mt-6 first:mt-0">{children}</div>;
}

function ComponentShowcase() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bb-bg-primary)',
        padding: 'var(--bb-container-padding)',
        borderRadius: 'var(--bb-container-radius)',
      }}
    >
      {/* Buttons — Variants */}
      <ComponentLabel>Button Variants</ComponentLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bb-space-3)', alignItems: 'center' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      {/* Buttons — Sizes */}
      <ComponentLabel>Button Sizes</ComponentLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bb-space-3)', alignItems: 'center' }}>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>

      {/* Buttons — States */}
      <ComponentLabel>Button States</ComponentLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bb-space-3)', alignItems: 'center' }}>
        <Button variant="primary">Default</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </div>

      {/* Inputs */}
      <ComponentLabel>Inputs</ComponentLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--bb-component-gap)' }}>
        <Input label="Email" placeholder="you@example.com" type="email" />
        <Input label="Full Name" placeholder="Jane Doe" hint="As it appears on your ID" />
        <Input label="Password" placeholder="••••••••" type="password" error="Password must be at least 8 characters" />
        <Input label="Bio" placeholder="Tell us about yourself..." textarea />
      </div>

      {/* Badges */}
      <ComponentLabel>Badges</ComponentLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bb-space-2)', alignItems: 'center' }}>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="error">Error</Badge>
      </div>

      {/* Toggles */}
      <ComponentLabel>Toggles</ComponentLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bb-space-3)' }}>
        <Toggle label="Email notifications" defaultChecked />
        <Toggle label="Marketing emails" />
        <Toggle label="Push notifications" defaultChecked />
      </div>

      {/* Cards */}
      <ComponentLabel>Cards</ComponentLabel>
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

        <SectionTitle>Atoms</SectionTitle>
        <ComponentShowcase />

        <SectionTitle>Molecules</SectionTitle>
        <MoleculeShowcase />
      </div>
    </main>
  );
}

function MoleculeShowcase() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bb-bg-primary)',
        padding: 'var(--bb-container-padding)',
        borderRadius: 'var(--bb-container-radius)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--bb-space-8)',
      }}
    >
      {/* Nav Bar */}
      <div>
        <ComponentLabel>Navigation Bar</ComponentLabel>
        <NavBar />
      </div>

      {/* Feature Grid */}
      <div>
        <ComponentLabel>Feature Grid</ComponentLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--bb-component-gap)' }}>
          <FeatureBlock icon="⚡" title="Lightning Fast" description="Optimized for speed with sub-second load times across all devices." />
          <FeatureBlock icon="🎨" title="Fully Themeable" description="Every color, font, and spacing value is driven by design tokens." />
          <FeatureBlock icon="📦" title="Export Anywhere" description="Generate CSS, Tailwind, or Figma variables from your design system." />
        </div>
      </div>

      {/* Stats */}
      <div>
        <ComponentLabel>Stats Block</ComponentLabel>
        <StatsBlock stats={[
          { value: '12K+', label: 'Active Users' },
          { value: '450', label: 'Projects Shipped' },
          { value: '99%', label: 'Uptime' },
          { value: '4.9', label: 'Average Rating' },
        ]} />
      </div>

      {/* Testimonials */}
      <div>
        <ComponentLabel>Testimonials</ComponentLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--bb-component-gap)' }}>
          <Testimonial
            quote="This design system saved us weeks of work. The token cascade means we change one color and the whole brand updates."
            name="Sarah Chen"
            role="Design Lead, Acme Corp"
          />
          <Testimonial
            quote="Finally a tool that bridges the gap between design and code. The Figma export is a game changer for our workflow."
            name="Marcus Rivera"
            role="Frontend Engineer, Startup Co"
          />
        </div>
      </div>

      {/* Pricing */}
      <div>
        <ComponentLabel>Pricing Cards</ComponentLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--bb-component-gap)' }}>
          <PricingCard
            name="Starter"
            price="$0"
            period="month"
            features={['5 design tokens', 'CSS export', 'Basic components']}
          />
          <PricingCard
            name="Pro"
            price="$29"
            period="month"
            features={['Unlimited tokens', 'All export formats', 'Full component library', 'Figma sync']}
            highlighted
          />
          <PricingCard
            name="Team"
            price="$79"
            period="month"
            features={['Everything in Pro', 'Team collaboration', 'Version history', 'Priority support']}
          />
        </div>
      </div>
    </div>
  );
}
