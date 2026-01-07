import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import type { IodineTheme, ColorScheme, ThemeContextValue, ThemeColor } from './types'
import { defaultTheme } from './defaultTheme'
import './theme.css'

const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface IodineProviderProps {
  children: ReactNode
  /** Custom theme overrides */
  theme?: Partial<IodineTheme>
  /** Initial color scheme (default: 'dark') */
  defaultColorScheme?: ColorScheme
  /** Whether to respect system preference */
  respectSystemPreference?: boolean
}

function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target }
  for (const key in source) {
    if (
      source[key] !== undefined &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      source[key] !== null
    ) {
      result[key] = deepMerge(
        target[key] as object,
        source[key] as object
      ) as T[Extract<keyof T, string>]
    } else if (source[key] !== undefined) {
      result[key] = source[key] as T[Extract<keyof T, string>]
    }
  }
  return result
}

export function IodineProvider({
  children,
  theme: themeOverrides,
  defaultColorScheme = 'dark',
  respectSystemPreference = false,
}: IodineProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    if (respectSystemPreference && typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return defaultColorScheme
  })

  // Merge default theme with overrides
  const theme = useMemo(
    () => (themeOverrides ? deepMerge(defaultTheme, themeOverrides) : defaultTheme),
    [themeOverrides]
  )

  // Listen for system preference changes
  useEffect(() => {
    if (!respectSystemPreference || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [respectSystemPreference])

  // Apply data attribute to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-iodine-theme', colorScheme)
    }
  }, [colorScheme])

  const value = useMemo(
    () => ({ theme, colorScheme, setColorScheme }),
    [theme, colorScheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

/** Hook to access theme context */
export function useIodineTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    // Return default values if used outside provider
    return {
      theme: defaultTheme,
      colorScheme: 'dark',
      setColorScheme: () => {
        console.warn('useIodineTheme: No IodineProvider found in tree')
      },
    }
  }
  return context
}

/** Hook to get a CSS variable value */
export function useCssVar(varName: string): string {
  if (typeof window === 'undefined') return ''
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName)
  return value.trim()
}

/** Get glow style for a theme color */
export function getThemeGlow(color: ThemeColor): string {
  const glowMap: Record<ThemeColor, string> = {
    primary: 'var(--iodine-glow-primary)',
    secondary: 'var(--iodine-glow-secondary)',
    success: 'var(--iodine-glow-success)',
    warning: 'var(--iodine-glow-warning)',
    error: 'var(--iodine-glow-error)',
  }
  return glowMap[color]
}

/** Generate box-shadow glow effect */
export function createGlowStyle(color: ThemeColor): React.CSSProperties {
  const glow = getThemeGlow(color)
  return {
    boxShadow: `0 4px 15px ${glow}, 0 0 30px ${glow}`,
  }
}
