import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { useShaderCanvas } from '../../hooks'
import { type ShaderVariant } from '../../shaders'
import styles from './Button.module.css'

export interface ShaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ShaderVariant
  intensity?: number
}

export function ShaderButton({
  children,
  variant = 'plasma',
  intensity = 1.0,
  className,
  style,
  ...props
}: ShaderButtonProps) {
  const {
    canvasRef,
    handleMouseMove,
    handleMouseLeave,
    effect,
  } = useShaderCanvas({
    variant,
    intensity,
    enableMouseTracking: true,
  })

  // Apply glow from effect config
  const glowStyle = effect?.glow
    ? {
        boxShadow: `0 4px 15px ${effect.glow}, 0 0 30px ${effect.glow.replace('0.4', '0.2')}`,
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
