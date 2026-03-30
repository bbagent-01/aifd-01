"use client";

export default function PricingCard({ name, price, period, features, highlighted }) {
  return (
    <div
      className="bb-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--bb-space-4)',
        ...(highlighted ? {
          borderColor: 'var(--bb-action-primary)',
          borderWidth: '2px',
        } : {}),
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--bb-font-body)',
            fontSize: 'var(--bb-text-xs)',
            fontWeight: 600,
            color: highlighted ? 'var(--bb-action-primary)' : 'var(--bb-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {name}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--bb-space-1)', marginTop: 'var(--bb-space-2)' }}>
          <span
            style={{
              fontFamily: 'var(--bb-font-heading)',
              fontWeight: 'var(--bb-heading-weight)',
              fontSize: 'var(--bb-text-4xl)',
              color: 'var(--bb-text-primary)',
              lineHeight: 1,
            }}
          >
            {price}
          </span>
          {period && (
            <span style={{ fontSize: 'var(--bb-text-sm)', color: 'var(--bb-text-secondary)' }}>
              /{period}
            </span>
          )}
        </div>
      </div>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--bb-space-2)',
        }}
      >
        {features.map((f, i) => (
          <li
            key={i}
            style={{
              fontFamily: 'var(--bb-font-body)',
              fontSize: 'var(--bb-text-sm)',
              color: 'var(--bb-text-secondary)',
              lineHeight: 'var(--bb-line-height)',
            }}
          >
            ✓ {f}
          </li>
        ))}
      </ul>
      <button className={`bb-btn bb-btn-md ${highlighted ? 'bb-btn-primary' : 'bb-btn-secondary'}`} style={{ width: '100%' }}>
        {highlighted ? 'Get Started' : 'Choose Plan'}
      </button>
    </div>
  );
}
