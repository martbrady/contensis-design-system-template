import type { Preview, Decorator } from '@storybook/react-vite'
import '../src/styles/design-tokens.css'
import '../src/styles/theme-dark.css'
import { DocsPage } from './DocsPage'

// Theme decorator that wraps stories with a themed container
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';
  const isFullscreen = context.parameters.layout === 'fullscreen';

  return (
    <div
      data-theme={theme}
      style={{
        padding: isFullscreen ? 0 : 'var(--space-4)',
        backgroundColor: 'var(--color-surface-primary)',
        minHeight: '100%',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    docs: {
      source: {
        type: 'dynamic',
      },
      page: DocsPage,
    },

    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
    },

    a11y: {
      test: 'todo'
    },

    options: {
      storySort: {
        order: [
          'Canvas',
          'Foundations', ['Colors', 'Radius', 'Shadows', 'Spacing', 'Typography'],
          'Components',
        ],
      },
    },
  },
};

export default preview;
