import type { ReactNode } from 'react';

// ============================================================
// Shared story layout primitives
// Use in all component AllVariants stories for consistent
// layout and token-driven styling.
// ============================================================

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family-body)',
  fontSize: 'var(--font-size-12)',
  color: 'var(--color-type-secondary)',
  marginBottom: 'var(--space-3)',
  marginTop: 0,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-3)',
  alignItems: 'center',
};

/** Outer canvas — vertical stack of variant groups */
export const StoryCanvas = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
    {children}
  </div>
);

/** Labelled row of component variants */
export const VariantGroup = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <p style={labelStyle}>{label}</p>
    <div style={rowStyle}>{children}</div>
  </div>
);

/** Dark surface wrapper — use when previewing components on a dark background */
export const DarkSurface = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      backgroundColor: 'var(--color-theme-surface-secondary)',
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-2)',
      display: 'inline-flex',
    }}
  >
    {children}
  </div>
);
