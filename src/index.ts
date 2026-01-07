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
export type {
  IodineTheme,
  ThemeColor,
  ThemeSize,
  ColorScheme,
  ThemeContextValue,
  IodineProviderProps,
} from './theme'
