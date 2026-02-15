import type { VfxConfig } from './types'

/** Registry of named presets */
export const presetRegistry: Record<string, VfxConfig> = {}

/**
 * Create and register a named shader preset.
 *
 * @example
 * createShaderPreset('cyber-plasma', {
 *   effect: 'plasma',
 *   speed: 0.3,
 *   palette: ['#06b6d4', '#8b5cf6'],
 *   glow: true,
 * })
 *
 * // Then use it:
 * <ShaderButton vfx="cyber-plasma">Click</ShaderButton>
 */
export function createShaderPreset(name: string, config: VfxConfig): VfxConfig {
  const preset = { ...config }
  presetRegistry[name] = preset
  return preset
}

/**
 * Register multiple presets at once.
 */
export function registerPresets(presets: Record<string, VfxConfig>): void {
  for (const [name, config] of Object.entries(presets)) {
    presetRegistry[name] = { ...config }
  }
}

/**
 * Get a preset by name. Returns undefined if not found.
 */
export function getPreset(name: string): VfxConfig | undefined {
  return presetRegistry[name]
}
