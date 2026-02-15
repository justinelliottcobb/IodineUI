import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import { vertexShader, shaderRegistry, type ShaderVariant, type ShaderEffect } from '../shaders'
import type { ResolvedVfxConfig } from '../vfx/types'

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
  /** Resolved VFX configuration (overrides variant/intensity/speed/mouseTracking when present) */
  vfxConfig?: ResolvedVfxConfig | null
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
  /** Glow CSS color from VFX config or effect default, or false if disabled */
  glowColor: string | false
}

export function useShaderCanvas({
  variant,
  intensity = 1.0,
  enableMouseTracking = true,
  autoStart = true,
  customUniforms,
  speed = 1.0,
  maxDpr = 2,
  vfxConfig,
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

  // Derive effective values from vfxConfig or props
  const effectiveVariant = (vfxConfig?.effect ?? variant) as ShaderVariant
  const effectiveIntensity = vfxConfig?.intensity ?? intensity
  const effectiveSpeed = vfxConfig?.speed ?? speed
  const effectiveMouseTracking = vfxConfig?.mouseTracking ?? enableMouseTracking

  const effect = shaderRegistry[effectiveVariant]

  // Derive tilt settings
  const tiltFromMouse = vfxConfig?.tiltFromMouse ?? false

  // Build VFX uniforms from resolved config
  const vfxUniforms = useMemo(() => {
    if (!vfxConfig) {
      // Default VFX uniforms when no config present
      return {
        uSpeed: { value: effectiveSpeed },
        uScale: { value: 1.0 },
        uColor1: { value: [0.545, 0.361, 0.965] }, // #8b5cf6
        uColor2: { value: [0.024, 0.714, 0.831] }, // #06b6d4
        uColor3: { value: [0.545, 0.361, 0.965] }, // #8b5cf6
        uTilt: { value: [0, 0] },
      }
    }

    const palette = vfxConfig.palette
    return {
      uSpeed: { value: vfxConfig.speed },
      uScale: { value: vfxConfig.scale },
      uColor1: { value: palette[0] ? [...palette[0]] : [0.545, 0.361, 0.965] },
      uColor2: { value: palette[1] ? [...palette[1]] : [0.024, 0.714, 0.831] },
      uColor3: { value: palette[2] ? [...palette[2]] : [0.545, 0.361, 0.965] },
      uTilt: { value: vfxConfig.tiltFromMouse ? [0, 0] : [...vfxConfig.tilt] },
      ...vfxConfig.customUniforms,
    }
  }, [vfxConfig, effectiveSpeed])

  // Stable key for vfxConfig to use as dependency
  const vfxConfigKey = useMemo(
    () => (vfxConfig ? JSON.stringify(vfxConfig) : ''),
    [vfxConfig],
  )

  // Glow color: vfxConfig takes priority, then effect default
  const glowColor = useMemo((): string | false => {
    if (vfxConfig) {
      return vfxConfig.glow
    }
    return effect?.glow ?? false
  }, [vfxConfig, effect])

  // Animation loop — uTime advances at wall-clock rate, shaders use uSpeed internally
  const animate = useCallback(() => {
    if (isPausedRef.current) return

    const program = programRef.current
    const renderer = rendererRef.current
    const mesh = meshRef.current

    if (!program || !renderer || !mesh) return

    const elapsed = (performance.now() - startTimeRef.current) / 1000
    program.uniforms.uTime.value = elapsed

    if (effectiveMouseTracking) {
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y]
    }

    program.uniforms.uIntensity.value = effectiveIntensity

    // Update tilt from mouse position when mouse-driven tilt is active
    if (tiltFromMouse && program.uniforms.uTilt) {
      program.uniforms.uTilt.value = [
        (mouseRef.current.x - 0.5) * 0.3,
        (mouseRef.current.y - 0.5) * 0.3,
      ]
    }

    renderer.render({ scene: mesh })
    animationRef.current = requestAnimationFrame(animate)
  }, [effectiveIntensity, effectiveMouseTracking, tiltFromMouse])

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

    // Merge default uniforms with VFX uniforms and custom uniforms
    const uniforms: Record<string, { value: number | number[] }> = {
      uTime: { value: 0 },
      uIntensity: { value: effectiveIntensity },
      uResolution: { value: [canvas.offsetWidth || 100, canvas.offsetHeight || 100] },
      uMouse: { value: [0.5, 0.5] },
      ...vfxUniforms,
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
  }, [effectiveVariant, effect, maxDpr, autoStart, animate, vfxConfigKey, customUniforms, effectiveIntensity])

  // Update intensity when it changes
  useEffect(() => {
    if (programRef.current) {
      programRef.current.uniforms.uIntensity.value = effectiveIntensity
    }
  }, [effectiveIntensity])

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
    if (!effectiveMouseTracking) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height,
    }
  }, [effectiveMouseTracking])

  const handleMouseLeave = useCallback(() => {
    if (!effectiveMouseTracking) return
    mouseRef.current = { x: 0.5, y: 0.5 }
  }, [effectiveMouseTracking])

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
    glowColor,
  }
}
