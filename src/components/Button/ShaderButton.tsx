import { useMemo, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { useShaderCanvas } from '../../hooks'
import { type ShaderVariant } from '../../shaders'
import { useIodineTheme } from '../../theme'
import { resolveVfxConfig } from '../../vfx'
import type { VfxProp } from '../../vfx/types'
import styles from './Button.module.css'

export interface ShaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ShaderVariant
  intensity?: number
  /** VFX configuration — overrides variant/intensity when provided */
  vfx?: VfxProp
}

export function ShaderButton({
  children,
  variant = 'plasma',
  intensity = 1.0,
  vfx,
  className,
  style,
  ...props
}: ShaderButtonProps) {
  const { theme } = useIodineTheme()

  const vfxConfig = useMemo(
    () => (vfx !== undefined ? resolveVfxConfig(vfx, theme) : null),
    [vfx, theme],
  )

  const {
    canvasRef,
    handleMouseMove,
    handleMouseLeave,
    glowColor,
  } = useShaderCanvas({
    variant,
    intensity,
    enableMouseTracking: true,
    vfxConfig,
  })

  // Apply glow from VFX config or effect default
  const glowStyle = glowColor
    ? {
        boxShadow: `0 4px 15px ${glowColor}, 0 0 30px ${typeof glowColor === 'string' ? glowColor.replace('0.4', '0.2') : glowColor}`,
        ...style,
      }
    : style

  return (
    <button
      className={`${styles.shaderButton} ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={glowStyle}
      {...props}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.content}>{children}</span>
    </button>
  )
}
