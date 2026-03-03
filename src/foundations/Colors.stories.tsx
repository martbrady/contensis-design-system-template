import type { Meta, StoryObj } from '@storybook/react-vite';
import '../styles/design-tokens.css';

const ColorSwatch = ({ name, token, value }: { name: string; token: string; value: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
    <div
      style={{
        width: 'var(--space-8)',
        height: 'var(--space-8)',
        backgroundColor: `var(${token})`,
        border: 'var(--border-width-thin) solid var(--color-type-secondary)',
        borderRadius: 'var(--radius-2)',
      }}
    />
    <div>
      <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-type-primary)' }}>{name}</div>
      <code style={{ fontSize: 'var(--body-small-font-size)', color: 'var(--color-type-secondary)' }}>{token}</code>
      <div style={{ fontSize: 'var(--body-small-font-size)', color: 'var(--color-type-secondary)' }}>{value}</div>
    </div>
  </div>
);

const ColorGroup = ({ title, colors }: { title: string; colors: { name: string; token: string; value: string }[] }) => (
  <div style={{ marginBottom: 'var(--space-6)' }}>
    <h3 style={{ marginBottom: 'var(--space-4)', borderBottom: 'var(--border-width-thin) solid var(--color-type-secondary)', paddingBottom: 'var(--space-2)', color: 'var(--color-type-primary)' }}>{title}</h3>
    {colors.map((color) => (
      <ColorSwatch key={color.token} {...color} />
    ))}
  </div>
);

const ColorsPage = () => (
  <div style={{ fontFamily: 'var(--font-primary)' }}>
    <h1 style={{ marginBottom: 'var(--space-6)', color: 'var(--color-type-primary)' }}>Colors</h1>
    <p style={{ marginBottom: 'var(--space-6)', color: 'var(--color-type-secondary)' }}>
      Color tokens from the design system. Use these CSS variables instead of hardcoded color values.
      Toggle the theme in the toolbar to see light and dark mode values.
    </p>

    <ColorGroup
      title="Surface"
      colors={[
        { name: 'Primary', token: '--color-surface-primary', value: '#FFFFFF' },
        { name: 'Secondary', token: '--color-surface-secondary', value: '#F4F4F4' },
        { name: 'Tertiary', token: '--color-surface-tertiary', value: '#222222' },
      ]}
    />

    <ColorGroup
      title="Typography"
      colors={[
        { name: 'Primary', token: '--color-type-primary', value: '#333333' },
        { name: 'Secondary', token: '--color-type-secondary', value: '#666666' },
        { name: 'Tertiary', token: '--color-type-tertiary', value: '#FFFFFF' },
      ]}
    />

    <ColorGroup
      title="Links"
      colors={[
        { name: 'Default', token: '--color-type-link-default', value: '#1853AC' },
        { name: 'Hover', token: '--color-type-link-hover', value: '#00304D' },
        { name: 'Visited', token: '--color-type-link-visited', value: '#5128C3' },
      ]}
    />

    <ColorGroup
      title="Accent"
      colors={[
        { name: 'Blue', token: '--color-accent-blue', value: '#256FDD' },
        { name: 'Green', token: '--color-accent-green', value: '#159382' },
        { name: 'Yellow', token: '--color-accent-yellow', value: '#FFF646' },
        { name: 'Orange', token: '--color-accent-orange', value: '#EAAC1D' },
        { name: 'Red', token: '--color-accent-red', value: '#EC2222' },
        { name: 'White', token: '--color-accent-white', value: '#FFFFFF' },
      ]}
    />

    <ColorGroup
      title="Overlay"
      colors={[
        { name: 'Dark', token: '--color-overlay-dark', value: 'rgba(0, 0, 0, 0.5)' },
      ]}
    />

    <ColorGroup
      title="Button Primary"
      colors={[
        { name: 'Default', token: '--color-button-primary-default', value: '#222222' },
        { name: 'Hover', token: '--color-button-primary-hover', value: '#000000' },
        { name: 'Label', token: '--color-button-primary-label', value: '#FFFFFF' },
      ]}
    />

    <ColorGroup
      title="Button Secondary"
      colors={[
        { name: 'Default', token: '--color-button-secondary-default', value: '#FFFFFF' },
        { name: 'Hover', token: '--color-button-secondary-hover', value: '#DADADA' },
        { name: 'Label', token: '--color-button-secondary-label', value: '#333333' },
      ]}
    />
  </div>
);

const meta: Meta = {
  title: 'Foundations/Colors',
  component: ColorsPage,
};

export default meta;
type Story = StoryObj;

export const Colors: Story = {};
