"use client";

import useTokenStore from '@/lib/tokens/store';
import { TYPE_SCALE, SEMANTIC_GROUPS } from '@/lib/tokens/defaults';
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

  // Group all semantic tokens by category
  const getGroupTokens = (group) => {
    const prefix = group.prefix + '-';
    const defaultKeys = group.keys.filter((k) => semantic[k]);
    const customKeys = Object.keys(semantic).filter(
      (k) => k.startsWith(prefix) && !group.keys.includes(k)
    );
    return [...defaultKeys, ...customKeys];
  };

  return (
    <div className="space-y-4">
      {SEMANTIC_GROUPS.map((group) => {
        const tokens = getGroupTokens(group);
        if (tokens.length === 0) return null;
        return (
          <div key={group.label}>
            <div className="text-[10px] font-mono text-gray-400 mb-2">{group.label}</div>
            <div className="grid grid-cols-5 gap-2">
              {tokens.map((name) => {
                const ref = semantic[name];
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
          </div>
        );
      })}
    </div>
  );
}

const PANGRAM = 'The quick brown fox jumps over the lazy dog';

function GradientSwatches() {
  const gradients = useTokenStore((s) => s.gradients);
  const scales = useTokenStore((s) => s.scales);

  if (!gradients || Object.keys(gradients).length === 0) {
    return <div className="text-sm text-gray-400">No gradients defined</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.entries(gradients).map(([name, grad]) => {
        const resolvedStops = grad.stops.map((ref) => scales[ref] || '#ff00ff');
        const gradientCSS = `linear-gradient(${grad.angle}deg, ${resolvedStops.join(', ')})`;
        return (
          <div key={name} className="text-center">
            <div
              className="w-full h-16 rounded-lg border border-gray-200"
              style={{ background: gradientCSS }}
            />
            <div className="text-[9px] font-mono text-gray-500 mt-1 truncate">{name}</div>
            <div className="text-[8px] font-mono text-gray-400 truncate">{grad.angle}° · {grad.stops.join(' → ')}</div>
          </div>
        );
      })}
    </div>
  );
}

function TypeLabel({ font, weight, size }) {
  return (
    <div style={{
      fontFamily: 'var(--bb-font-mono)',
      fontSize: '10px',
      color: 'var(--bb-text-secondary)',
      opacity: 0.6,
      marginTop: '2px',
    }}>
      {font} · {weight} · {size}
    </div>
  );
}

function TypeSpecimen() {
  const typography = useTokenStore((s) => s.typography);
  const headingSizes = [
    { label: '5xl', var: 'var(--bb-text-5xl)', size: `${Math.round(typography.baseSize * TYPE_SCALE['5xl'])}px` },
    { label: '3xl', var: 'var(--bb-text-3xl)', size: `${Math.round(typography.baseSize * TYPE_SCALE['3xl'])}px` },
    { label: 'xl', var: 'var(--bb-text-xl)', size: `${Math.round(typography.baseSize * TYPE_SCALE.xl)}px` },
  ];

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
          letterSpacing: 'var(--bb-tracking-eyebrow)',
          marginBottom: 'var(--bb-space-2)',
        }}
      >
        Eyebrow Label
      </div>
      <TypeLabel font={typography.bodyFont} weight="600" size={`${Math.round(typography.baseSize * TYPE_SCALE.xs)}px`} />

      {/* Headings */}
      {headingSizes.map((h, i) => (
        <div key={h.label} style={{ marginTop: i === 0 ? 'var(--bb-space-3)' : 'var(--bb-space-2)' }}>
          <div
            style={{
              fontFamily: 'var(--bb-font-heading)',
              fontSize: h.var,
              fontWeight: 'var(--bb-heading-weight)',
              color: 'var(--bb-text-primary)',
              lineHeight: 'var(--bb-heading-line-height)',
              letterSpacing: 'var(--bb-tracking-heading)',
            }}
          >
            {PANGRAM}
          </div>
          <TypeLabel font={typography.headingFont} weight={typography.headingWeight} size={h.size} />
        </div>
      ))}

      {/* Body */}
      <p
        style={{
          fontFamily: 'var(--bb-font-body)',
          fontSize: 'var(--bb-text-base)',
          fontWeight: 'var(--bb-body-weight)',
          color: 'var(--bb-text-secondary)',
          lineHeight: 'var(--bb-line-height)',
          letterSpacing: 'var(--bb-tracking-body)',
          marginTop: 'var(--bb-space-4)',
          maxWidth: '600px',
        }}
      >
        {PANGRAM}. Body text at base size — this paragraph demonstrates the body font, weight, line height, and secondary text color. All values are driven by design tokens.
      </p>
      <TypeLabel font={typography.bodyFont} weight={typography.bodyWeight} size={`${typography.baseSize}px`} />

      {/* Caption */}
      <div
        style={{
          fontFamily: 'var(--bb-font-body)',
          fontSize: 'var(--bb-text-sm)',
          color: 'var(--bb-text-secondary)',
          marginTop: 'var(--bb-space-2)',
        }}
      >
        {PANGRAM}. Small / caption text for labels and secondary content.
      </div>
      <TypeLabel font={typography.bodyFont} weight={typography.bodyWeight} size={`${Math.round(typography.baseSize * TYPE_SCALE.sm)}px`} />

      {/* Code */}
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
        const mono = &quot;{typography.monoFont}&quot;;
      </code>
      <TypeLabel font={typography.monoFont} weight="400" size={`${Math.round(typography.baseSize * TYPE_SCALE.sm)}px`} />

      {/* Running font specimens */}
      <div style={{ marginTop: 'var(--bb-space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--bb-space-2)' }}>
        <div className="text-[10px] font-mono text-gray-400 mb-1">Font Specimens</div>
        {[
          { name: typography.headingFont, cssVar: 'var(--bb-font-heading)', weight: 'var(--bb-heading-weight)' },
          { name: typography.bodyFont, cssVar: 'var(--bb-font-body)', weight: 'var(--bb-body-weight)' },
          { name: typography.monoFont, cssVar: 'var(--bb-font-mono)', weight: '400' },
        ].map((font) => (
          <div key={font.name} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span style={{
              fontFamily: font.cssVar,
              fontSize: 'var(--bb-text-lg)',
              fontWeight: font.weight,
              color: 'var(--bb-text-primary)',
            }}>
              {font.name} — {PANGRAM} {PANGRAM}
            </span>
          </div>
        ))}
      </div>
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

function DarkComponentShowcase() {
  return (
    <div
      className="bb-dark"
      style={{
        backgroundColor: 'var(--bb-bg-dark-primary)',
        padding: 'var(--bb-container-padding)',
        borderRadius: 'var(--bb-container-radius)',
      }}
    >
      <ComponentLabel>
        <span style={{ color: 'var(--bb-text-dark-secondary)' }}>Button Variants (Dark)</span>
      </ComponentLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bb-space-3)', alignItems: 'center' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <ComponentLabel>
        <span style={{ color: 'var(--bb-text-dark-secondary)' }}>Button Sizes (Dark)</span>
      </ComponentLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bb-space-3)', alignItems: 'center' }}>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>

      <ComponentLabel>
        <span style={{ color: 'var(--bb-text-dark-secondary)' }}>Text on Dark</span>
      </ComponentLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bb-space-2)' }}>
        <div style={{ fontFamily: 'var(--bb-font-heading)', fontSize: 'var(--bb-text-xl)', fontWeight: 'var(--bb-heading-weight)', color: 'var(--bb-text-dark-primary)' }}>
          Heading on dark background
        </div>
        <div style={{ fontFamily: 'var(--bb-font-body)', fontSize: 'var(--bb-text-base)', color: 'var(--bb-text-dark-secondary)' }}>
          Body text on dark background — this shows how typography adapts to dark sections like hero areas, footers, and dark cards.
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

        <SectionTitle>Gradients</SectionTitle>
        <GradientSwatches />

        <SectionTitle>Typography</SectionTitle>
        <TypeSpecimen />

        <SectionTitle>Spacing Scale</SectionTitle>
        <SpacingVis />

        <SectionTitle>Atoms — Light</SectionTitle>
        <ComponentShowcase />

        <SectionTitle>Atoms — Dark</SectionTitle>
        <DarkComponentShowcase />

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
