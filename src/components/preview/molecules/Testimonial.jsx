"use client";

export default function Testimonial({ quote, name, role }) {
  return (
    <div className="bb-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bb-space-4)' }}>
      <p
        style={{
          fontFamily: 'var(--bb-font-body)',
          fontSize: 'var(--bb-text-base)',
          color: 'var(--bb-text-primary)',
          lineHeight: 'var(--bb-line-height)',
          fontStyle: 'italic',
          margin: 0,
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div>
        <div
          style={{
            fontFamily: 'var(--bb-font-heading)',
            fontWeight: 'var(--bb-heading-weight)',
            fontSize: 'var(--bb-text-sm)',
            color: 'var(--bb-text-primary)',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: 'var(--bb-font-body)',
            fontSize: 'var(--bb-text-xs)',
            color: 'var(--bb-text-secondary)',
          }}
        >
          {role}
        </div>
      </div>
    </div>
  );
}
