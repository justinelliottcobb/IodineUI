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

export const Aurora: Story = {
  args: {
    vfx: 'aurora',
    children: 'Aurora',
  },
}

export const Nebula: Story = {
  args: {
    vfx: 'nebula',
    children: 'Nebula',
  },
}

export const Electric: Story = {
  args: {
    vfx: 'electric',
    children: 'Electric',
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
      <ShaderButton vfx="aurora">Aurora</ShaderButton>
      <ShaderButton vfx="nebula">Nebula</ShaderButton>
      <ShaderButton vfx="electric">Electric</ShaderButton>
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

export const CustomPalette: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ShaderButton vfx={{ effect: 'plasma', palette: ['#ef4444', '#f59e0b'] }}>
        Red/Orange
      </ShaderButton>
      <ShaderButton vfx={{ effect: 'plasma', palette: ['#10b981', '#06b6d4'] }}>
        Green/Cyan
      </ShaderButton>
      <ShaderButton vfx={{ effect: 'fire', palette: ['#3b82f6', '#8b5cf6'] }}>
        Blue Fire
      </ShaderButton>
      <ShaderButton vfx={{ effect: 'electric', palette: ['#f59e0b', '#ef4444'] }}>
        Orange Lightning
      </ShaderButton>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const SpeedVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ShaderButton vfx={{ effect: 'plasma', speed: 0.3 }}>Slow</ShaderButton>
      <ShaderButton vfx={{ effect: 'plasma', speed: 1.0 }}>Normal</ShaderButton>
      <ShaderButton vfx={{ effect: 'plasma', speed: 3.0 }}>Fast</ShaderButton>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const MouseTilt: Story = {
  name: 'Mouse-Driven Tilt',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ShaderButton vfx={{ effect: 'plasma', tilt: true }}>
        Plasma Tilt
      </ShaderButton>
      <ShaderButton vfx={{ effect: 'nebula', tilt: true }}>
        Nebula Tilt
      </ShaderButton>
      <ShaderButton vfx={{ effect: 'electric', tilt: true }}>
        Electric Tilt
      </ShaderButton>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const StaticTilt: Story = {
  name: 'Static Tilt Angles',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ShaderButton vfx={{ effect: 'aurora', tilt: { x: 0.2, y: 0.0 } }}>
        X Tilt
      </ShaderButton>
      <ShaderButton vfx={{ effect: 'aurora', tilt: { x: 0.0, y: 0.2 } }}>
        Y Tilt
      </ShaderButton>
      <ShaderButton vfx={{ effect: 'aurora', tilt: { x: 0.15, y: 0.15 } }}>
        XY Tilt
      </ShaderButton>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const VfxNone: Story = {
  name: 'VFX Disabled',
  args: {
    vfx: 'none',
    children: 'No Shader',
  },
}
