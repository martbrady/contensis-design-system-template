import type { Meta, StoryObj } from '@storybook/react-vite';
import '../styles/design-tokens.css';

const RadiusRow = ({ token, value }: { token: string; value: string }) => (
  <tr>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}><code>{token}</code></td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{value}</td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>
      <div
        style={{
          width: 'var(--space-8)',
          height: 'var(--space-8)',
          backgroundColor: 'var(--color-accent-blue)',
          borderRadius: value,
        }}
      />
    </td>
  </tr>
);

const RadiusPage = () => (
  <div style={{ fontFamily: 'var(--font-primary)', padding: 'var(--space-4)' }}>
    <h1 style={{ marginBottom: 'var(--space-6)' }}>Radius</h1>
    <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-type-secondary)' }}>
      Border radius tokens for consistent rounded corners throughout components.
    </p>

    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Token</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Value</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left', width: '200px' }}>Visual</th>
        </tr>
      </thead>
      <tbody>
        <RadiusRow token="--radius-0" value="0px" />
        <RadiusRow token="--radius-1" value="2px" />
        <RadiusRow token="--radius-2" value="4px" />
        <RadiusRow token="--radius-3" value="8px" />
        <RadiusRow token="--radius-4" value="12px" />
        <RadiusRow token="--radius-5" value="16px" />
        <RadiusRow token="--radius-full" value="9999px" />
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Usage</h2>
    <pre style={{ backgroundColor: 'var(--color-surface-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-2)', overflow: 'auto' }}>
{`.button {
  border-radius: var(--radius-0);
}

.card {
  border-radius: var(--radius-3);
}

.avatar {
  border-radius: var(--radius-full);
}`}
    </pre>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Radius',
  component: RadiusPage,
};

export default meta;
type Story = StoryObj;

export const Radius: Story = {};
