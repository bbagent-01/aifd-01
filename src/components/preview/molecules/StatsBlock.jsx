"use client";

export default function StatsBlock({ stats }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: 'var(--bb-component-gap)',
        textAlign: 'center',
        padding: 'var(--bb-space-8) 0',
      }}
    >
      {stats.map((stat, i) => (
        <div key={i}>
          <div
            style={{
              fontFamily: 'var(--bb-font-heading)',
              fontWeight: 'var(--bb-heading-weight)',
              fontSize: 'var(--bb-text-4xl)',
              color: 'var(--bb-action-primary)',
              lineHeight: 1,
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontFamily: 'var(--bb-font-body)',
              fontSize: 'var(--bb-text-sm)',
              color: 'var(--bb-text-secondary)',
              marginTop: 'var(--bb-space-2)',
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
