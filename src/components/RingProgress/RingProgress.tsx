import { useEffect, type HTMLAttributes, type ReactNode } from 'react'
import { useShaderCanvas } from '../../hooks'
import { type ThemeSize, type ThemeColor, sizeMap, getThemeGlow } from '../../theme'
import styles from './RingProgress.module.css'

export interface RingProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value: number
  /** Size of the ring */
  size?: ThemeSize | number
  /** Color theme */
  color?: ThemeColor
  /** Content to render in the center */
  label?: ReactNode
  /** Effect intensity 0-1 */
  intensity?: number
}

function getSize(size: ThemeSize | number): number {
  if (typeof size === 'number') return size
  return sizeMap[size] ?? sizeMap.md
}

export function RingProgress({
  value,
  size = 'lg',
  color = 'primary',
  label,
  intensity = 1.0,
  className,
  style,
  'aria-label': ariaLabel = 'Progress',
  ...props
}: RingProgressProps) {
  const normalizedValue = Math.max(0, Math.min(100, value)) / 100

  const {
    canvasRef,
    setUniform,
    effect,
  } = useShaderCanvas({
    variant: 'progress-ring',
    intensity,
    enableMouseTracking: false,
    customUniforms: {
      uProgress: { value: normalizedValue },
    },
  })

  // Update progress uniform when value changes
  useEffect(() => {
    setUniform('uProgress', normalizedValue)
  }, [normalizedValue, setUniform])

  const pixelSize = getSize(size)
  const glowColor = getThemeGlow(color)

  const ringStyle: React.CSSProperties = {
    width: pixelSize,
    height: pixelSize,
    ...(effect?.glow || glowColor
      ? {
          filter: `drop-shadow(0 0 ${Math.max(4, pixelSize / 10)}px ${effect?.glow || glowColor})`,
        }
      : {}),
    ...style,
  }

  const defaultLabel = `${Math.round(value)}%`

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={`${styles.ringProgress} ${className || ''}`}
      style={ringStyle}
      {...props}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {label !== undefined && (
        <span className={styles.label}>
          {label === true ? defaultLabel : label}
        </span>
      )}
    </div>
  )
}
