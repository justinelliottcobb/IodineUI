import type { IodineTheme, ThemeColor } from '../theme/types'
import type { VfxProp, VfxConfig, ResolvedVfxConfig } from './types'
import { shaderRegistry } from '../shaders/registry'
import { defaultTheme } from '../theme/defaultTheme'
import { hexToVec3, vec3ToRgba } from './color'
import { presetRegistry } from './presets'

const THEME_COLOR_KEYS: readonly string[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
]

function isThemeColor(color: string): color is ThemeColor {
  return THEME_COLOR_KEYS.includes(color)
}

function resolveColor(
  color: string,
  theme: IodineTheme,
): [number, number, number] {
  if (isThemeColor(color)) {
    return hexToVec3(theme.colors[color])
  }
  return hexToVec3(color)
}

function resolveGlow(
  glow: boolean | string | undefined,
  effectGlow: string | undefined,
  palette: [number, number, number][],
  theme: IodineTheme,
): string | false {
  if (glow === false) return false
  if (typeof glow === 'string') return glow
  // glow is true or undefined (default to true)
  if (effectGlow) return effectGlow
  // Auto-generate from first palette color
  const alpha = 0.4 * theme.shader.glowMultiplier
  return vec3ToRgba(palette[0], alpha)
}

/**
 * Resolve a VfxProp into a fully resolved config with vec3 palette colors,
 * merged defaults from the effect and theme.
 *
 * Returns null if vfx is "none" or undefined (no effect).
 */
export function resolveVfxConfig(
  vfx: VfxProp | undefined,
  theme: IodineTheme = defaultTheme,
): ResolvedVfxConfig | null {
  if (vfx === 'none' || vfx === undefined) return null

  let config: VfxConfig

  if (typeof vfx === 'string') {
    const preset = presetRegistry[vfx]
    config = preset ?? { effect: vfx }
  } else {
    config = vfx
  }

  const effect = shaderRegistry[config.effect]
  const effectDefaults = effect?.defaults ?? {}

  // Resolve palette colors
  const rawPalette =
    config.palette ?? effectDefaults.palette ?? [theme.colors.primary, theme.colors.secondary]

  const palette = rawPalette.map((c) => resolveColor(c, theme))

  // Pad to at least 3 colors
  while (palette.length < 3) {
    palette.push(palette[palette.length - 1])
  }

  const typedPalette = palette as [number, number, number][]

  return {
    effect: config.effect,
    speed:
      config.speed ?? effectDefaults.speed ?? theme.shader.animationSpeed,
    scale: config.scale ?? effectDefaults.scale ?? 1.0,
    palette: typedPalette,
    glow: resolveGlow(config.glow, effect?.glow, typedPalette, theme),
    intensity: config.intensity ?? theme.shader.defaultIntensity,
    mouseTracking: config.mouseTracking ?? true,
    customUniforms: config.customUniforms ?? {},
    tilt: typeof config.tilt === 'object' ? [config.tilt.x, config.tilt.y] : [0, 0],
    tiltFromMouse: config.tilt === true,
  }
}
