import { useRef, useEffect, useCallback, useState } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import { vertexShader, shaderRegistry, type ShaderVariant, type ShaderEffect } from '../shaders'

export interface UseShaderCanvasOptions {
  /** Shader effect variant name */
  variant: ShaderVariant
  /** Effect intensity 0-1 (default: 1.0) */
  intensity?: number
  /** Whether to enable mouse tracking (default: true) */
  enableMouseTracking?: boolean
  /** Whether to auto-start animation (default: true) */
  autoStart?: boolean
  /** Custom uniforms to pass to shader */
  customUniforms?: Record<string, { value: number | number[] }>
  /** Animation speed multiplier (default: 1.0) */
  speed?: number
  /** Device pixel ratio cap (default: 2) */
  maxDpr?: number
}

export interface UseShaderCanvasReturn {
  /** Ref to attach to canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  /** Manually start the animation */
  start: () => void
  /** Pause the animation */
  pause: () => void
  /** Resume a paused animation */
  resume: () => void
  /** Reset time to 0 */
  reset: () => void
  /** Update a uniform value at runtime */
  setUniform: (name: string, value: number | number[]) => void
  /** Handle mouse move event (call from parent) */
  handleMouseMove: (e: React.MouseEvent) => void
  /** Handle mouse leave event (call from parent) */
  handleMouseLeave: () => void
  /** Current animation state */
  isAnimating: boolean
  /** The resolved shader effect */
  effect: ShaderEffect | undefined
}

export function useShaderCanvas({
  variant,
  intensity = 1.0,
  enableMouseTracking = true,
  autoStart = true,
  customUniforms,
  speed = 1.0,
  maxDpr = 2,
}: UseShaderCanvasOptions): UseShaderCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const isPausedRef = useRef(!autoStart)

  const [isAnimating, setIsAnimating] = useState(autoStart)

  const effect = shaderRegistry[variant]

  // Animation loop
  const animate = useCallback(() => {
    if (isPausedRef.current) return

    const program = programRef.current
    const renderer = rendererRef.current
    const mesh = meshRef.current

    if (!program || !renderer || !mesh) return

    const elapsed = ((performance.now() - startTimeRef.current) / 1000) * speed
    program.uniforms.uTime.value = elapsed

    if (enableMouseTracking) {
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y]
    }

    program.uniforms.uIntensity.value = intensity

    renderer.render({ scene: mesh })
    animationRef.current = requestAnimationFrame(animate)
  }, [intensity, enableMouseTracking, speed])

  // Setup WebGL
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !effect) return

    const renderer = new Renderer({
      canvas,
      width: canvas.offsetWidth || 100,
      height: canvas.offsetHeight || 100,
      dpr: Math.min(window.devicePixelRatio, maxDpr),
      alpha: true,
    })
    rendererRef.current = renderer

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 1)

    const geometry = new Triangle(gl)

    // Merge default uniforms with custom uniforms
    const uniforms: Record<string, { value: number | number[] }> = {
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uResolution: { value: [canvas.offsetWidth || 100, canvas.offsetHeight || 100] },
      uMouse: { value: [0.5, 0.5] },
      ...customUniforms,
    }

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: effect.fragment,
      uniforms,
    })
    programRef.current = program

    const mesh = new Mesh(gl, { geometry, program })
    meshRef.current = mesh

    // Handle resize
    const handleResize = () => {
      if (!canvas || !renderer || !program) return
      const width = canvas.offsetWidth || 100
      const height = canvas.offsetHeight || 100
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = [width, height]
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(canvas)

    // Start animation
    startTimeRef.current = performance.now()
    isPausedRef.current = !autoStart
    setIsAnimating(autoStart)

    if (autoStart) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
      resizeObserver.disconnect()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      rendererRef.current = null
      programRef.current = null
      meshRef.current = null
    }
  }, [variant, effect, maxDpr, autoStart, animate, customUniforms, intensity])

  // Update intensity when it changes
  useEffect(() => {
    if (programRef.current) {
      programRef.current.uniforms.uIntensity.value = intensity
    }
  }, [intensity])

  // Control functions
  const start = useCallback(() => {
    if (!isPausedRef.current) return
    startTimeRef.current = performance.now() - pausedTimeRef.current
    isPausedRef.current = false
    setIsAnimating(true)
    animationRef.current = requestAnimationFrame(animate)
  }, [animate])

  const pause = useCallback(() => {
    if (isPausedRef.current) return
    pausedTimeRef.current = performance.now() - startTimeRef.current
    isPausedRef.current = true
    setIsAnimating(false)
    cancelAnimationFrame(animationRef.current)
  }, [])

  const resume = useCallback(() => {
    start()
  }, [start])

  const reset = useCallback(() => {
    startTimeRef.current = performance.now()
    pausedTimeRef.current = 0
    if (programRef.current) {
      programRef.current.uniforms.uTime.value = 0
    }
  }, [])

  const setUniform = useCallback((name: string, value: number | number[]) => {
    if (programRef.current && programRef.current.uniforms[name]) {
      programRef.current.uniforms[name].value = value
    }
  }, [])

  // Mouse handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableMouseTracking) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height,
    }
  }, [enableMouseTracking])

  const handleMouseLeave = useCallback(() => {
    if (!enableMouseTracking) return
    mouseRef.current = { x: 0.5, y: 0.5 }
  }, [enableMouseTracking])

  return {
    canvasRef,
    start,
    pause,
    resume,
    reset,
    setUniform,
    handleMouseMove,
    handleMouseLeave,
    isAnimating,
    effect,
  }
}
