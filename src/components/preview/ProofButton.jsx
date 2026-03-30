"use client";

/**
 * Proof-of-concept Button component.
 * Uses ONLY --bb-* CSS variables — zero hardcoded values.
 * Validates that the token cascade works end-to-end.
 */
export default function ProofButton({ children, variant = 'primary', size = 'md' }) {
  const sizeClass = {
    sm: 'bb-btn-sm',
    md: 'bb-btn-md',
    lg: 'bb-btn-lg',
  }[size];

  return (
    <button className={`bb-btn bb-btn-${variant} ${sizeClass}`}>
      {children}
    </button>
  );
}
