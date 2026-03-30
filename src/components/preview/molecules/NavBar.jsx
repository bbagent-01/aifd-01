"use client";

export default function NavBar() {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--bb-space-4) var(--bb-container-padding)',
        backgroundColor: 'var(--bb-bg-card)',
        borderRadius: 'var(--bb-card-radius)',
        border: '1px solid var(--bb-border-faint)',
        fontFamily: 'var(--bb-font-body)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--bb-font-heading)',
          fontWeight: 'var(--bb-heading-weight)',
          fontSize: 'var(--bb-text-lg)',
          color: 'var(--bb-text-primary)',
        }}
      >
        Brandname
      </div>
      <div style={{ display: 'flex', gap: 'var(--bb-space-6)', alignItems: 'center' }}>
        {['Features', 'Pricing', 'About'].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              fontSize: 'var(--bb-text-sm)',
              color: 'var(--bb-text-secondary)',
              textDecoration: 'none',
            }}
          >
            {item}
          </a>
        ))}
        <button className="bb-btn bb-btn-primary bb-btn-sm">Get Started</button>
      </div>
    </nav>
  );
}
