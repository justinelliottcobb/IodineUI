import { type HTMLAttributes } from 'react'
import { useShaderCanvas } from '../../hooks'
import { type ShaderVariant } from '../../shaders'
import { type ThemeSize, type ThemeColor, sizeMap, getThemeGlow } from '../../theme'
import styles from './Loader.module.css'

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Shader variant for the loader (default: 'spinner') */
  variant?: ShaderVariant
  /** Size of the loader */
  size?: ThemeSize | number
  /** Color theme (affects glow) */
  color?: ThemeColor
  /** Effect intensity 0-1 */
  intensity?: number
}

function getSize(size: ThemeSize | number): number {
  if (typeof size === 'number') return size
  return sizeMap[size] ?? sizeMap.md
}

export function Loader({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  intensity = 1.0,
  className,
  style,
  'aria-label': ariaLabel = 'Loading',
  ...props
}: LoaderProps) {
  const { canvasRef, effect } = useShaderCanvas({
    variant,
    intensity,
    enableMouseTracking: false,
  })

  const pixelSize = getSize(size)
  const glowColor = getThemeGlow(color)

  const loaderStyle: React.CSSProperties = {
    width: pixelSize,
    height: pixelSize,
    ...(effect?.glow || glowColor
      ? {
          filter: `drop-shadow(0 0 ${Math.max(4, pixelSize / 8)}px ${effect?.glow || glowColor})`,
        }
      : {}),
    ...style,
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      className={`${styles.loader} ${className || ''}`}
      style={loaderStyle}
      {...props}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.srOnly}>{ariaLabel}</span>
    </div>
  )
}
