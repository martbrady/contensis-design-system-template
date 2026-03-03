import type { Meta, StoryObj } from '@storybook/react-vite';
import '../styles/design-tokens.css';

const TypeRow = ({ style, desktop, mobile, lineHeight, weight }: { style: string; desktop: string; mobile: string; lineHeight: string; weight: string }) => (
  <tr>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{style}</td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{desktop}</td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{mobile}</td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{lineHeight}</td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{weight}</td>
  </tr>
);

const TokenRow = ({ token, value, usage }: { token: string; value: string; usage?: string }) => (
  <tr>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}><code>{token}</code></td>
    <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)' }}>{value}</td>
    {usage !== undefined && <td style={{ padding: 'var(--space-2) var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-surface-secondary)', color: 'var(--color-type-secondary)' }}>{usage}</td>}
  </tr>
);

const TypographyPage = () => (
  <div style={{ fontFamily: 'var(--font-primary)', padding: 'var(--space-4)' }}>
    <h1 style={{ marginBottom: 'var(--space-6)' }}>Typography</h1>
    <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-type-secondary)' }}>
      Typography tokens from the design system. Inter is the primary font family, with Libre Caslon Text used for quotes. All styles have device-specific sizes.
    </p>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Font Families</h2>
    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Token</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Value</th>
        </tr>
      </thead>
      <tbody>
        <TokenRow token="--font-primary" value="'Inter', sans-serif" />
        <TokenRow token="--font-secondary" value="'Libre Caslon Text', serif" />
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Font Weights</h2>
    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Token</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Value</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Usage</th>
        </tr>
      </thead>
      <tbody>
        <TokenRow token="--font-weight-regular" value="400" usage="Body text, links" />
        <TokenRow token="--font-weight-semibold" value="600" usage="All headings (H1-H6), Body Lead" />
        <TokenRow token="--font-weight-bold" value="700" usage="Numbered List numbers" />
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Headings</h2>
    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Style</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Desktop</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Mobile</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Line Height</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Weight</th>
        </tr>
      </thead>
      <tbody>
        <TypeRow style="H1" desktop="72px" mobile="42px" lineHeight="80px / 56px" weight="Semibold (600)" />
        <TypeRow style="H2" desktop="64px" mobile="32px" lineHeight="80px / 48px" weight="Semibold (600)" />
        <TypeRow style="H3" desktop="44px" mobile="28px" lineHeight="56px / 40px" weight="Semibold (600)" />
        <TypeRow style="H4" desktop="28px" mobile="24px" lineHeight="40px / 32px" weight="Semibold (600)" />
        <TypeRow style="H5" desktop="22px" mobile="20px" lineHeight="32px" weight="Semibold (600)" />
        <TypeRow style="H6" desktop="18px" mobile="16px" lineHeight="24px" weight="Semibold (600)" />
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Body Text</h2>
    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Style</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Desktop</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Mobile</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Line Height</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Weight</th>
        </tr>
      </thead>
      <tbody>
        <TypeRow style="Body Lead" desktop="22px" mobile="18px" lineHeight="32px" weight="Semibold (600)" />
        <TypeRow style="Body Large" desktop="18px" mobile="16px" lineHeight="32px" weight="Regular (400)" />
        <TypeRow style="Body Medium" desktop="16px" mobile="17px" lineHeight="28px" weight="Regular (400)" />
        <TypeRow style="Body Small" desktop="14px" mobile="14px" lineHeight="24px" weight="Regular (400)" />
        <TypeRow style="Body Quote" desktop="28px" mobile="20px" lineHeight="48px / 32px" weight="Regular (400)" />
      </tbody>
    </table>

    <h2 style={{ marginBottom: 'var(--space-4)' }}>Body Links</h2>
    <table style={{ borderCollapse: 'collapse', marginBottom: 'var(--space-6)', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Style</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Desktop</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Mobile</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Line Height</th>
          <th style={{ padding: 'var(--space-2) var(--space-4)', textAlign: 'left' }}>Weight</th>
        </tr>
      </thead>
      <tbody>
        <TypeRow style="Link Large" desktop="18px" mobile="18px" lineHeight="32px" weight="Regular (400)" />
        <TypeRow style="Link Medium" desktop="16px" mobile="17px" lineHeight="28px" weight="Regular (400)" />
        <TypeRow style="Link Small" desktop="14px" mobile="14px" lineHeight="24px" weight="Regular (400)" />
      </tbody>
    </table>

  </div>
);

const meta: Meta = {
  title: 'Foundations/Typography',
  component: TypographyPage,
};

export default meta;
type Story = StoryObj;

export const Typography: Story = {};
