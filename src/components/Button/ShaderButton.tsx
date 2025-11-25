import { useRef, useEffect, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import { vertexShader, shaderRegistry, type ShaderVariant } from '../../shaders'
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const effect = shaderRegistry[variant]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !effect) return

    const renderer = new Renderer({
      canvas,
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: false,
    })
    rendererRef.current = renderer

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 1)

    const geometry = new Triangle(gl)

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: effect.fragment,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: intensity },
        uResolution: { value: [canvas.offsetWidth, canvas.offsetHeight] },
        uMouse: { value: [0.5, 0.5] },
      },
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry, program })

    const handleResize = () => {
      if (!canvas || !renderer) return
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = [width, height]
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(canvas)

    let startTime = performance.now()

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000
      program.uniforms.uTime.value = elapsed
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y]
      program.uniforms.uIntensity.value = intensity
      renderer.render({ scene: mesh })
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
      resizeObserver.disconnect()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [variant, intensity, effect])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height,
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current = { x: 0.5, y: 0.5 }
  }

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
