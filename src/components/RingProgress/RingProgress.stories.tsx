import { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RingProgress } from './RingProgress'

const meta: Meta<typeof RingProgress> = {
  title: 'Feedback/RingProgress',
  component: RingProgress,
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
      description: 'Size of the ring',
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
    label: {
      control: 'boolean',
      description: 'Show percentage label in center',
    },
  },
}

export default meta
type Story = StoryObj<typeof RingProgress>

export const Default: Story = {
  args: {
    value: 65,
    size: 'lg',
  },
}

export const WithLabel: Story = {
  args: {
    value: 75,
    size: 'xl',
    label: true,
  },
}

export const CustomLabel: Story = {
  args: {
    value: 80,
    size: 'xl',
    label: '4/5',
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={65} size="xs" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>xs (16px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={65} size="sm" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>sm (24px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={65} size="md" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>md (32px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={65} size="lg" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>lg (48px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={65} size="xl" label />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>xl (64px)</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const LargeCustomSize: Story = {
  args: {
    value: 72,
    size: 120,
    label: true,
  },
}

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={70} size="lg" color="primary" label />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>primary</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={70} size="lg" color="secondary" label />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>secondary</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={70} size="lg" color="success" label />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>success</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={70} size="lg" color="warning" label />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>warning</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <RingProgress value={70} size="lg" color="error" label />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>error</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const Animated: Story = {
  render: function AnimatedRingProgress() {
    const [value, setValue] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setValue((prev) => (prev >= 100 ? 0 : prev + 1))
      }, 50)
      return () => clearInterval(interval)
    }, [])

    return <RingProgress value={value} size={100} label />
  },
  parameters: {
    controls: { disable: true },
  },
}

export const ZeroProgress: Story = {
  args: {
    value: 0,
    size: 'lg',
    label: true,
  },
}

export const FullProgress: Story = {
  args: {
    value: 100,
    size: 'lg',
    label: true,
  },
}
