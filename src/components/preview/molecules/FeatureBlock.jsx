"use client";

export default function FeatureBlock({ icon, title, description }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--bb-space-6)',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--bb-radius)',
          backgroundColor: 'color-mix(in srgb, var(--bb-action-primary) 12%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--bb-space-4)',
          fontSize: '24px',
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: 'var(--bb-font-heading)',
          fontWeight: 'var(--bb-heading-weight)',
          fontSize: 'var(--bb-text-base)',
          color: 'var(--bb-text-primary)',
          lineHeight: 'var(--bb-heading-line-height)',
          margin: '0 0 var(--bb-space-2) 0',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--bb-font-body)',
          fontSize: 'var(--bb-text-sm)',
          color: 'var(--bb-text-secondary)',
          lineHeight: 'var(--bb-line-height)',
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
