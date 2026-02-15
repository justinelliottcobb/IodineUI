import { registerPresets } from './presets'

registerPresets({
  // New parameterized effects
  aurora: {
    effect: 'aurora',
    speed: 0.4,
    palette: ['#10b981', '#06b6d4', '#8b5cf6'],
    glow: true,
  },
  nebula: {
    effect: 'nebula',
    speed: 0.3,
    palette: ['#8b5cf6', '#ef4444', '#06b6d4'],
    glow: true,
  },
  electric: {
    effect: 'electric',
    speed: 1.2,
    palette: ['#06b6d4', '#8b5cf6'],
    glow: true,
  },

  // Aliases for existing effects with their default palettes
  plasma: {
    effect: 'plasma',
    palette: ['#8b5cf6', '#06b6d4'],
    glow: true,
  },
  fire: {
    effect: 'fire',
    palette: ['#ef4444', '#fbbf24'],
    glow: true,
  },
  vortex: {
    effect: 'vortex',
    palette: ['#7c3aed', '#06b6d4'],
    glow: true,
  },
  octograms: {
    effect: 'octograms',
    palette: ['#3b82f6', '#8b5cf6'],
    glow: true,
  },
  spinner: {
    effect: 'spinner',
    palette: ['#8b5cf6', '#06b6d4'],
    glow: true,
  },
})
