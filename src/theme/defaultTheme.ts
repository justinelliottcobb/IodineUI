import type { IodineTheme } from './types'

export const defaultTheme: IodineTheme = {
  colors: {
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
    secondary: '#06b6d4',
    secondaryLight: '#22d3ee',
    secondaryDark: '#0891b2',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: {
      default: '#0f0f1a',
      paper: '#1a1a2e',
      subtle: '#252540',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
      disabled: '#52525b',
      inverse: '#0f0f1a',
    },
    border: {
      default: '#3f3f46',
      subtle: '#27272a',
      focus: '#8b5cf6',
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },

  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      base: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  },

  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },

  shader: {
    defaultIntensity: 1.0,
    glowMultiplier: 1.0,
    animationSpeed: 1.0,
  },
}

/** Get the glow color for a theme color */
export function getGlowColor(color: string, intensity = 0.4): string {
  return color.startsWith('#')
    ? `${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`
    : color
}

/** Size values in pixels for components */
export const sizeMap: Record<string, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}
