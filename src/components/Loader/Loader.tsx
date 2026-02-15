import { useMemo, type HTMLAttributes } from 'react'
import { useShaderCanvas } from '../../hooks'
import { type ShaderVariant } from '../../shaders'
import { type ThemeSize, type ThemeColor, sizeMap, getThemeGlow, useIodineTheme } from '../../theme'
import { resolveVfxConfig } from '../../vfx'
import type { VfxProp } from '../../vfx/types'
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
  /** VFX configuration — overrides variant/intensity when provided */
  vfx?: VfxProp
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
  vfx,
  className,
  style,
  'aria-label': ariaLabel = 'Loading',
  ...props
}: LoaderProps) {
  const { theme } = useIodineTheme()

  const vfxConfig = useMemo(
    () => (vfx !== undefined ? resolveVfxConfig(vfx, theme) : null),
    [vfx, theme],
  )

  const { canvasRef, glowColor } = useShaderCanvas({
    variant,
    intensity,
    enableMouseTracking: false,
    vfxConfig,
  })

  const pixelSize = getSize(size)
  const effectGlow = glowColor || getThemeGlow(color)

  const loaderStyle: React.CSSProperties = {
    width: pixelSize,
    height: pixelSize,
    ...(effectGlow
      ? {
          filter: `drop-shadow(0 0 ${Math.max(4, pixelSize / 8)}px ${effectGlow})`,
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
