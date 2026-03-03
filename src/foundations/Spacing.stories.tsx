import type { Meta, StoryObj } from '@storybook/react-vite';
import '../styles/design-tokens.css';

/* Token definitions - single source of truth for foundations display */
const spacingTokens = [
  { token: '--space-0', value: '0px' },
  { token: '--space-1', value: '4px' },
  { token: '--space-2', value: '8px' },
  { token: '--space-3', value: '12px' },
  { token: '--space-4', value: '16px' },
  { token: '--space-5', value: '20px' },
  { token: '--space-6', value: '24px' },
  { token: '--space-7', value: '28px' },
  { token: '--space-8', value: '32px' },
  { token: '--space-10', value: '40px' },
  { token: '--space-12', value: '48px' },
  { token: '--space-14', value: '56px' },
  { token: '--space-16', value: '64px' },
  { token: '--space-18', value: '72px' },
  { token: '--space-20', value: '80px' },
  { token: '--space-24', value: '96px' },
  { token: '--space-30', value: '120px' },
];

const borderTokens = [
  { token: '--border-width-thin', value: '1px', usage: 'Default borders, inputs' },
  { token: '--border-width-medium', value: '2px', usage: 'Focus rings inner' },
  { token: '--border-width-thick', value: '6px', usage: 'Panel accent borders' },
  { token: '--focus-ring-width', value: '3px', usage: 'Focus ring outer width' },
];

const maxWidthTokens = [
  { token: '--max-width-xs', value: '320px' },
  { token: '--max-width-mobile', value: '328px' },
  { token: '--max-width-form', value: '344px' },
  { token: '--max-width-sm', value: '480px' },
  { token: '--max-width-md', value: '640px' },
  { token: '--max-width-content', value: '720px' },
  { token: '--max-width-lg', value: '800px' },
  { token: '--max-width-xl', value: '1024px' },
  { token: '--max-width-2xl', value: '1280px' },
];

const SpaceRow = ({ token, value }: { token: string; value: string }) => (
  <tr>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}><code>{token}</code></td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{value}</td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>
      <div
        style={{
          width: `var(${token})`,
          height: 'var(--space-4)',
          backgroundColor: 'var(--color-accent-blue)',
          borderRadius: 'var(--radius-1)',
        }}
      />
    </td>
  </tr>
);

const BorderRow = ({ token, value, usage }: { token: string; value: string; usage: string }) => (
  <tr>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}><code>{token}</code></td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{value}</td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{usage}</td>
  </tr>
);

const MaxWidthRow = ({ token, value }: { token: string; value: string }) => (
  <tr>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}><code>{token}</code></td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{value}</td>
  </tr>
);

const SpacingPage = () => (
  <div style={{ fontFamily: 'var(--font-primary)', padding: 'var(--space-4)' }}>
    <h1 style={{ marginBottom: 'var(--space-6)' }}>Spacing</h1>
    <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-type-secondary)' }}>
      Spacing tokens based on a 4px grid. Use these CSS variables for consistent spacing throughout components.
    </p>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Spacing Scale</h2>
    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Token</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Value</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left', width: '200px' }}>Visual</th>
        </tr>
      </thead>
      <tbody>
        {spacingTokens.map((t) => (
          <SpaceRow key={t.token} token={t.token} value={t.value} />
        ))}
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Border Widths</h2>
    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Token</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Value</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Usage</th>
        </tr>
      </thead>
      <tbody>
        {borderTokens.map((t) => (
          <BorderRow key={t.token} token={t.token} value={t.value} usage={t.usage} />
        ))}
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Max Width</h2>
    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Token</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {maxWidthTokens.map((t) => (
          <MaxWidthRow key={t.token} token={t.token} value={t.value} />
        ))}
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Usage</h2>
    <pre style={{ backgroundColor: 'var(--color-surface-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-2)', overflow: 'auto' }}>
{`.component {
  padding: var(--space-4);
  padding: var(--space-6) var(--space-4);
}

.container {
  display: flex;
  gap: var(--space-2);
  max-width: var(--max-width-md);
}

.checkbox-box {
  width: var(--space-8);
  height: var(--space-8);
}`}
    </pre>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Spacing',
  component: SpacingPage,
};

export default meta;
type Story = StoryObj;

export const Spacing: Story = {};
