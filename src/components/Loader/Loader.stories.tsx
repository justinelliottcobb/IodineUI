import type { Meta, StoryObj } from '@storybook/react'
import { Loader } from './Loader'
import { shaderVariants } from '../../shaders'

const meta: Meta<typeof Loader> = {
  title: 'Feedback/Loader',
  component: Loader,
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
    variant: {
      control: 'select',
      options: shaderVariants,
      description: 'The shader effect variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the loader',
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
  },
}

export default meta
type Story = StoryObj<typeof Loader>

export const Default: Story = {
  args: {
    variant: 'spinner',
    size: 'md',
    intensity: 1.0,
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size="xs" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>xs (16px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="sm" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>sm (24px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="md" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>md (32px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>lg (48px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="xl" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>xl (64px)</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const CustomSize: Story = {
  args: {
    size: 80,
    variant: 'spinner',
  },
}

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" color="primary" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>primary</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" color="secondary" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>secondary</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" color="success" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>success</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" color="warning" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>warning</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" color="error" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>error</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const WithOtherVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" variant="spinner" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>spinner</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" variant="plasma" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>plasma</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" variant="vortex" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>vortex</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" variant="fire" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>fire</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const LowIntensity: Story = {
  args: {
    variant: 'spinner',
    size: 'lg',
    intensity: 0.4,
  },
}

export const VfxEffects: Story = {
  name: 'VFX Effects',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" vfx="aurora" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>aurora</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" vfx="nebula" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>nebula</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" vfx="electric" />
        <div style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>electric</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const CustomPalette: Story = {
  name: 'Custom Palette',
  args: {
    size: 'lg',
    vfx: { effect: 'spinner', palette: ['#ef4444', '#f59e0b'] },
  },
}

export const VfxNone: Story = {
  name: 'VFX Disabled',
  args: {
    size: 'lg',
    vfx: 'none',
  },
}
