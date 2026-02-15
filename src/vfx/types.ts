import type { ThemeColor } from '../theme/types'

/** A color that can be a hex string or a ThemeColor name */
export type VfxColor = string | ThemeColor

/** Full VFX configuration object */
export interface VfxConfig {
  /** Base effect name from shader registry */
  effect: string
  /** Animation speed multiplier (default: 1.0) */
  speed?: number
  /** Visual scale/zoom multiplier (default: 1.0) */
  scale?: number
  /** Palette of 2-3 colors; hex strings or ThemeColor names. Defaults to [primary, secondary] */
  palette?: VfxColor[]
  /** Whether to render CSS glow. true=auto from palette, string=explicit CSS color, false=off */
  glow?: boolean | string
  /** Effect intensity 0-1 */
  intensity?: number
  /** Enable mouse tracking */
  mouseTracking?: boolean
  /** Extra uniforms to pass through to the shader */
  customUniforms?: Record<string, { value: number | number[] }>
  /** Rotor-based perspective tilt. true=mouse-driven, {x,y}=static angles in radians, false/omitted=off */
  tilt?: { x: number; y: number } | boolean
}

/** The vfx prop accepts a full config, a preset/effect name string, or "none" to disable */
export type VfxProp = VfxConfig | string

/** Resolved internal config after merging with theme defaults and converting colors */
export interface ResolvedVfxConfig {
  effect: string
  speed: number
  scale: number
  palette: [number, number, number][]
  glow: string | false
  intensity: number
  mouseTracking: boolean
  customUniforms: Record<string, { value: number | number[] }>
  tilt: [number, number]
  tiltFromMouse: boolean
}
