import { useEffect, type HTMLAttributes } from 'react'
import { useShaderCanvas } from '../../hooks'
import { type ThemeSize, type ThemeColor, getThemeGlow } from '../../theme'
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
  className,
  style,
  'aria-label': ariaLabel = 'Progress',
  ...props
}: ProgressProps) {
  const normalizedValue = Math.max(0, Math.min(100, value)) / 100

  const {
    canvasRef,
    setUniform,
    effect,
  } = useShaderCanvas({
    variant: 'progress-linear',
    intensity: animated ? intensity : intensity * 0.7,
    enableMouseTracking: false,
    customUniforms: {
      uProgress: { value: normalizedValue },
    },
  })

  // Update progress uniform when value changes
  useEffect(() => {
    setUniform('uProgress', normalizedValue)
  }, [normalizedValue, setUniform])

  const height = getHeight(size)
  const glowColor = getThemeGlow(color)

  const progressStyle: React.CSSProperties = {
    height,
    borderRadius: typeof radius === 'string' && radius in radiusMap
      ? radiusMap[radius as ThemeSize]
      : radius,
    ...(effect?.glow || glowColor
      ? {
          boxShadow: `0 0 ${Math.max(4, height / 2)}px ${effect?.glow || glowColor}`,
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
