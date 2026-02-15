// Register built-in presets (side-effect import)
import './builtinPresets'

// Types
export type {
  VfxConfig,
  VfxProp,
  VfxColor,
  ResolvedVfxConfig,
} from './types'

// Color utilities
export { hexToVec3, vec3ToRgba } from './color'

// Preset system
export {
  createShaderPreset,
  registerPresets,
  getPreset,
  presetRegistry,
} from './presets'

// Resolution
export { resolveVfxConfig } from './resolve'
