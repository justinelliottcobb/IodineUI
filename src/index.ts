// iodine-ui component library

// Components
export {
  ShaderButton,
  PlasmaButton,
  FireButton,
  VortexButton,
  OctogramButton,
  variantButtons,
  shaderRegistry,
  shaderVariants,
} from './components/Button'

export { Loader } from './components/Loader'
export { Progress } from './components/Progress'
export { RingProgress } from './components/RingProgress'

// Hooks
export { useShaderCanvas } from './hooks'

// Theme
export {
  IodineProvider,
  useIodineTheme,
  useCssVar,
  getThemeGlow,
  createGlowStyle,
  defaultTheme,
  getGlowColor,
  sizeMap,
} from './theme'

// Types
export type { ShaderButtonProps } from './components/Button'
export type { LoaderProps } from './components/Loader'
export type { ProgressProps } from './components/Progress'
export type { RingProgressProps } from './components/RingProgress'
export type { ShaderVariant, ShaderEffect } from './shaders'
export type { UseShaderCanvasOptions, UseShaderCanvasReturn } from './hooks'
export type {
  IodineTheme,
  ThemeColor,
  ThemeSize,
  ColorScheme,
  ThemeContextValue,
  IodineProviderProps,
} from './theme'
