"use client";

/**
 * Proof-of-concept Card component.
 * Uses ONLY --bb-* CSS variables via .bb-card classes.
 * Validates that the token cascade works for container components.
 */
export default function ProofCard({ title, children }) {
  return (
    <div className="bb-card">
      {title && <h3 className="bb-card-title">{title}</h3>}
      <div className="bb-card-body">{children}</div>
    </div>
  );
}
