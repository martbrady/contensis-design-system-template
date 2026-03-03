import type { Meta, StoryObj } from '@storybook/react-vite';
import '../styles/design-tokens.css';

const ShadowRow = ({ token, value }: { token: string; value: string }) => (
  <tr>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}><code>{token}</code></td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)', color: 'var(--color-type-secondary)', fontSize: '13px' }}>{value}</td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>
      <div
        style={{
          width: '80px',
          height: '48px',
          backgroundColor: 'var(--color-surface-primary)',
          borderRadius: 'var(--radius-2)',
          boxShadow: value,
        }}
      />
    </td>
  </tr>
);

const ShadowsPage = () => (
  <div style={{ fontFamily: 'var(--font-primary)', padding: 'var(--space-4)' }}>
    <h1 style={{ marginBottom: 'var(--space-6)' }}>Shadows</h1>
    <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-type-secondary)' }}>
      Box shadow tokens for elevation and depth across components.
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
        <ShadowRow token="--shadow-card" value="0px 4px 12px 0px rgba(0, 48, 77, 0.08)" />
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Usage</h2>
    <pre style={{ backgroundColor: 'var(--color-surface-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-2)', overflow: 'auto' }}>
{`.card {
  box-shadow: var(--shadow-card);
}`}
    </pre>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Shadows',
  component: ShadowsPage,
};

export default meta;
type Story = StoryObj;

export const Shadows: Story = {};
