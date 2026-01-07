export type ThemeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error'
export type ThemeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IodineTheme {
  /** Color palette */
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    secondary: string
    secondaryLight: string
    secondaryDark: string
    success: string
    warning: string
    error: string
    background: {
      default: string
      paper: string
      subtle: string
    }
    text: {
      primary: string
      secondary: string
      disabled: string
      inverse: string
    }
    border: {
      default: string
      subtle: string
      focus: string
    }
  }

  /** Spacing scale */
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }

  /** Border radius values */
  radius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }

  /** Typography */
  typography: {
    fontFamily: {
      base: string
      mono: string
    }
    fontSize: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
    fontWeight: {
      normal: number
      medium: number
      semibold: number
      bold: number
    }
  }

  /** Shadows */
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
  }

  /** Transitions */
  transitions: {
    fast: string
    normal: string
    slow: string
  }

  /** Shader-specific settings */
  shader: {
    defaultIntensity: number
    glowMultiplier: number
    animationSpeed: number
  }
}

export type ColorScheme = 'dark' | 'light'

export interface ThemeContextValue {
  theme: IodineTheme
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}
