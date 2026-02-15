import { useEffect, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { useShaderCanvas, useSmoothValue } from '../../hooks'
import { type ThemeSize, type ThemeColor, sizeMap, getThemeGlow, useIodineTheme } from '../../theme'
import { resolveVfxConfig } from '../../vfx'
import type { VfxProp } from '../../vfx/types'
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
  /** Whether to animate progress changes smoothly */
  animated?: boolean
  /** VFX configuration — overrides variant/intensity when provided */
  vfx?: VfxProp
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
  animated = true,
  vfx,
  className,
  style,
  'aria-label': ariaLabel = 'Progress',
  ...props
}: RingProgressProps) {
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
    variant: 'progress-ring',
    intensity,
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

  const pixelSize = getSize(size)
  const effectGlow = glowColor || getThemeGlow(color)

  const ringStyle: React.CSSProperties = {
    width: pixelSize,
    height: pixelSize,
    ...(effectGlow
      ? {
          filter: `drop-shadow(0 0 ${Math.max(4, pixelSize / 10)}px ${effectGlow})`,
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
