import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a2e' },
        { name: 'darker', value: '#0f0f1a' },
        { name: 'light', value: '#f5f5f5' },
      ],
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
