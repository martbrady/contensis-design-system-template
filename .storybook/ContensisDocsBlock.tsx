import React from 'react';
import type { ContensisContentModelSpec, ContensisField } from '../src/content-models/types';

interface ContensisDocsBlockProps {
  componentName: string;
  spec: ContensisContentModelSpec | undefined;
  contensisJson?: Record<string, unknown>;
}

const styles = {
  section: {
    marginTop: '40px',
    borderTop: '1px solid #e6e6e6',
    paddingTop: '24px',
  } as React.CSSProperties,
  heading: {
    fontSize: '20px',
    fontWeight: 700,
    margin: '0 0 8px 0',
    color: '#2E3438',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    color: '#73828C',
    margin: '0 0 16px 0',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px',
    lineHeight: '20px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '10px 16px',
    borderBottom: '2px solid #e6e6e6',
    fontWeight: 600,
    color: '#2E3438',
    whiteSpace: 'nowrap' as const,
  },
  td: {
    padding: '10px 16px',
    borderBottom: '1px solid #f0f0f0',
    color: '#2E3438',
    verticalAlign: 'top' as const,
  },
  required: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: '3px',
    backgroundColor: '#FFF3CD',
    color: '#856404',
  } as React.CSSProperties,
  optional: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 600,
    padding: '1px 6px',
    borderRadius: '3px',
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  } as React.CSSProperties,
  typeBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontFamily: 'monospace',
    padding: '2px 8px',
    borderRadius: '3px',
    backgroundColor: '#F5F5F5',
    color: '#555',
  } as React.CSSProperties,
  componentRefBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontFamily: 'monospace',
    padding: '2px 8px',
    borderRadius: '3px',
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
  } as React.CSSProperties,
  notes: {
    fontSize: '12px',
    color: '#73828C',
    marginTop: '4px',
  } as React.CSSProperties,
  emptyMessage: {
    fontSize: '14px',
    color: '#73828C',
    fontStyle: 'italic',
  } as React.CSSProperties,
  variantHeading: {
    fontSize: '16px',
    fontWeight: 600,
    margin: '24px 0 8px 0',
    color: '#2E3438',
  } as React.CSSProperties,
  details: {
    marginTop: '24px',
    border: '1px solid #e6e6e6',
    borderRadius: '4px',
    overflow: 'hidden',
  } as React.CSSProperties,
  summary: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#2E3438',
    cursor: 'pointer',
    backgroundColor: '#FAFAFA',
    userSelect: 'none' as const,
  } as React.CSSProperties,
  codeBlock: {
    margin: 0,
    padding: '16px',
    fontSize: '12px',
    lineHeight: '18px',
    fontFamily: 'monospace',
    backgroundColor: '#F5F5F5',
    overflow: 'auto',
    maxHeight: '500px',
    whiteSpace: 'pre' as const,
  } as React.CSSProperties,
};

function FieldTable({ fields }: { fields: ContensisField[] }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Field</th>
          <th style={styles.th}>Toolbox</th>
          <th style={styles.th}>Required</th>
          <th style={styles.th}>Description</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <tr key={field.name}>
            <td style={styles.td}>
              <code>{field.name}</code>
            </td>
            <td style={styles.td}>
              {field.componentRef ? (
                <span style={styles.componentRefBadge}>Component: {field.componentRef}</span>
              ) : (
                <span style={styles.typeBadge}>{field.contensisType}</span>
              )}
            </td>
            <td style={styles.td}>
              {field.required ? (
                <span style={styles.required}>Required</span>
              ) : (
                <span style={styles.optional}>Optional</span>
              )}
            </td>
            <td style={styles.td}>
              {field.description}
              {field.notes && <div style={styles.notes}>{field.notes}</div>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ContensisDocsBlock({ componentName, spec, contensisJson }: ContensisDocsBlockProps) {
  if (!spec) {
    return null;
  }

  const hasFields = spec.fields.length > 0;
  const hasVariants = spec.variants && Object.keys(spec.variants).length > 0;

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Contensis content model</h2>
      <p style={styles.subtitle}>
        CMS field mapping for the {componentName} component
      </p>
      {hasFields ? (
        <FieldTable fields={spec.fields} />
      ) : (
        <p style={styles.emptyMessage}>
          This component has no CMS-managed content fields. All configuration is handled through UI props.
        </p>
      )}
      {hasVariants &&
        Object.entries(spec.variants!).map(([variantName, variantFields]) => (
          <div key={variantName}>
            <h3 style={styles.variantHeading}>Variant: {variantName}</h3>
            <FieldTable fields={variantFields} />
          </div>
        ))}
      {contensisJson && (
        <details style={styles.details}>
          <summary style={styles.summary}>Contensis JSON export</summary>
          <pre style={styles.codeBlock}>
            <code>{JSON.stringify(contensisJson, null, 2)}</code>
          </pre>
        </details>
      )}
    </div>
  );
}
