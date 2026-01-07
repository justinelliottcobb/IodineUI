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
