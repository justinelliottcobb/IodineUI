import { useEffect, useMemo, type HTMLAttributes } from 'react'
import { useShaderCanvas, useSmoothValue } from '../../hooks'
import { type ThemeSize, type ThemeColor, getThemeGlow, useIodineTheme } from '../../theme'
import { resolveVfxConfig } from '../../vfx'
import type { VfxProp } from '../../vfx/types'
import styles from './Progress.module.css'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value: number
  /** Whether to animate the shader fill */
  animated?: boolean
  /** Color theme */
  color?: ThemeColor
  /** Size (height) of the progress bar */
  size?: ThemeSize | number
  /** Effect intensity 0-1 */
  intensity?: number
  /** Show percentage label */
  label?: boolean | string
  /** Border radius */
  radius?: ThemeSize
  /** VFX configuration — overrides variant/intensity when provided */
  vfx?: VfxProp
}

const sizeHeightMap: Record<ThemeSize, number> = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
}

const radiusMap: Record<ThemeSize, string> = {
  xs: 'var(--iodine-radius-sm)',
  sm: 'var(--iodine-radius-sm)',
  md: 'var(--iodine-radius-md)',
  lg: 'var(--iodine-radius-lg)',
  xl: 'var(--iodine-radius-xl)',
}

function getHeight(size: ThemeSize | number): number {
  if (typeof size === 'number') return size
  return sizeHeightMap[size] ?? sizeHeightMap.md
}

export function Progress({
  value,
  animated = true,
  color = 'primary',
  size = 'md',
  intensity = 1.0,
  label,
  radius = 'md',
  vfx,
  className,
  style,
  'aria-label': ariaLabel = 'Progress',
  ...props
}: ProgressProps) {
  const { theme } = useIodineTheme()
  const normalizedValue = Math.max(0, Math.min(100, value)) / 100

  // Smooth progress animation
  const smooth = useSmoothValue({ initial: normalizedValue, blendFactor: 0.1 })
  const progressValue = animated ? smooth.value : normalizedValue

  // Update smooth target when value changes
  useEffect(() => {
    if (animated) {
      smooth.setTarget(normalizedValue)
    }
  }, [normalizedValue, animated, smooth.setTarget])

  const vfxConfig = useMemo(
    () => (vfx !== undefined ? resolveVfxConfig(vfx, theme) : null),
    [vfx, theme],
  )

  const {
    canvasRef,
    setUniform,
    glowColor,
  } = useShaderCanvas({
    variant: 'progress-linear',
    intensity: animated ? intensity : intensity * 0.7,
    enableMouseTracking: false,
    customUniforms: {
      uProgress: { value: progressValue },
    },
    vfxConfig,
  })

  // Update progress uniform when value changes
  useEffect(() => {
    setUniform('uProgress', progressValue)
  }, [progressValue, setUniform])

  const height = getHeight(size)
  const effectGlow = glowColor || getThemeGlow(color)

  const progressStyle: React.CSSProperties = {
    height,
    borderRadius: typeof radius === 'string' && radius in radiusMap
      ? radiusMap[radius as ThemeSize]
      : radius,
    ...(effectGlow
      ? {
          boxShadow: `0 0 ${Math.max(4, height / 2)}px ${effectGlow}`,
        }
      : {}),
    ...style,
  }

  const showLabel = label === true ? `${Math.round(value)}%` : label

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={`${styles.progress} ${className || ''}`}
      style={progressStyle}
      {...props}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {showLabel && (
        <span className={styles.label}>{showLabel}</span>
      )}
    </div>
  )
}
