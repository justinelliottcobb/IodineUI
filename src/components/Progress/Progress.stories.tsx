import { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a2e' },
        { name: 'darker', value: '#0f0f1a' },
        { name: 'light', value: '#f5f5f5' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size (height) of the progress bar',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Color theme for glow',
    },
    intensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Effect intensity (0-1)',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate the shader',
    },
    label: {
      control: 'boolean',
      description: 'Show percentage label',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: {
    value: 65,
    animated: true,
  },
}

export const WithLabel: Story = {
  args: {
    value: 75,
    label: true,
    size: 'lg',
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '300px' }}>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>xs (4px)</div>
        <Progress value={60} size="xs" />
      </div>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>sm (8px)</div>
        <Progress value={60} size="sm" />
      </div>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>md (12px)</div>
        <Progress value={60} size="md" />
      </div>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>lg (16px)</div>
        <Progress value={60} size="lg" />
      </div>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>xl (24px)</div>
        <Progress value={60} size="xl" label />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>primary</div>
        <Progress value={70} color="primary" size="md" />
      </div>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>secondary</div>
        <Progress value={70} color="secondary" size="md" />
      </div>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>success</div>
        <Progress value={70} color="success" size="md" />
      </div>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>warning</div>
        <Progress value={70} color="warning" size="md" />
      </div>
      <div>
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.5rem' }}>error</div>
        <Progress value={70} color="error" size="md" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const Animated: Story = {
  render: function AnimatedProgress() {
    const [value, setValue] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setValue((prev) => (prev >= 100 ? 0 : prev + 1))
      }, 50)
      return () => clearInterval(interval)
    }, [])

    return (
      <div style={{ width: '300px' }}>
        <Progress value={value} size="lg" label />
      </div>
    )
  },
  parameters: {
    controls: { disable: true },
  },
}

export const Static: Story = {
  args: {
    value: 50,
    animated: false,
    size: 'md',
  },
}

export const ZeroProgress: Story = {
  args: {
    value: 0,
    size: 'md',
  },
}

export const FullProgress: Story = {
  args: {
    value: 100,
    size: 'lg',
    label: true,
  },
}
