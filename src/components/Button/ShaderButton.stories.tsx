import type { Meta, StoryObj } from '@storybook/react'
import { ShaderButton, PlasmaButton, FireButton, VortexButton, OctogramButton, shaderVariants } from './index'

const meta: Meta<typeof ShaderButton> = {
  title: 'Components/ShaderButton',
  component: ShaderButton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a2e' },
        { name: 'darker', value: '#0f0f1a' },
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
    intensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Effect intensity (0-1)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
}

export default meta
type Story = StoryObj<typeof ShaderButton>

export const Plasma: Story = {
  args: {
    variant: 'plasma',
    children: 'Plasma',
    intensity: 1.0,
  },
}

export const Fire: Story = {
  args: {
    variant: 'fire',
    children: 'Fire',
    intensity: 1.0,
  },
}

export const Vortex: Story = {
  args: {
    variant: 'vortex',
    children: 'Vortex',
    intensity: 1.0,
  },
}

export const Octograms: Story = {
  args: {
    variant: 'octograms',
    children: 'Octograms',
    intensity: 1.0,
  },
}

export const LowIntensity: Story = {
  args: {
    variant: 'plasma',
    children: 'Subtle',
    intensity: 0.3,
  },
}

export const Disabled: Story = {
  args: {
    variant: 'fire',
    children: 'Disabled',
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <PlasmaButton>Plasma</PlasmaButton>
      <FireButton>Fire</FireButton>
      <VortexButton>Vortex</VortexButton>
      <OctogramButton>Octograms</OctogramButton>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const IntensityComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ShaderButton variant="plasma" intensity={0.2}>0.2</ShaderButton>
      <ShaderButton variant="plasma" intensity={0.5}>0.5</ShaderButton>
      <ShaderButton variant="plasma" intensity={0.8}>0.8</ShaderButton>
      <ShaderButton variant="plasma" intensity={1.0}>1.0</ShaderButton>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}
