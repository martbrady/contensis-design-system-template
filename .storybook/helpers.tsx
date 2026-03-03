import type { CSSProperties, ReactNode } from 'react';

export const PLACEHOLDER_IMAGE = '/images/placeholder-img.jpg';

export const sectionHeadingStyle: CSSProperties = {
  margin: '0 0 var(--space-3) 0',
  fontFamily: 'var(--font-primary)',
  fontSize: 'var(--heading-h5-font-size)',
  fontWeight: 'var(--font-weight-semibold)',
  lineHeight: 'var(--heading-h5-line-height)',
};

export const allVariantsStack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-8)',
};

export const PreviewSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div>
    <h4 style={sectionHeadingStyle}>{title}</h4>
    {children}
  </div>
);
