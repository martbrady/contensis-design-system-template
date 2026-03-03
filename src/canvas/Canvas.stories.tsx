import type { Meta, StoryObj } from '@storybook/react';
import { useDevice } from '../hooks/useDevice';

const CanvasPage = () => {
  const device = useDevice();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'var(--color-surface-primary)',
        padding: 'var(--space-4)',
        boxSizing: 'border-box',
      }}
    >
      {/* Add components here as you build them. */}
      {/* Import from '../components/{ComponentName}' and pass device={device} */}
      <p style={{ color: 'var(--color-type-secondary)', fontFamily: 'var(--font-primary)' }}>
        Canvas — add components here as you build them.
      </p>
    </div>
  );
};

const meta: Meta = {
  title: 'Canvas',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Responsive: Story = {
  render: () => <CanvasPage />,
};
