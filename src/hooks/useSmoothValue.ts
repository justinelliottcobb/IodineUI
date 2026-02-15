import { useRef, useCallback, useState, useEffect } from 'react'
import { GeometricState } from 'cliffy-tsukoshi'

export interface UseSmoothValueOptions {
  /** Starting value (default: 0) */
  initial?: number
  /** Blend factor per frame, 0-1. Higher = faster convergence (default: 0.1) */
  blendFactor?: number
  /** Stop animating when distance to target is below this (default: 0.001) */
  epsilon?: number
}

export interface UseSmoothValueReturn {
  /** Current interpolated value */
  value: number
  /** Set a new target to animate toward */
  setTarget: (n: number) => void
  /** Jump immediately to a value (no animation) */
  jumpTo: (n: number) => void
  /** Whether the value is currently animating toward a target */
  isAnimating: boolean
}

export function useSmoothValue(options?: UseSmoothValueOptions): UseSmoothValueReturn {
  const { initial = 0, blendFactor = 0.1, epsilon = 0.001 } = options ?? {}

  const currentRef = useRef(GeometricState.fromScalar(initial))
  const targetRef = useRef(GeometricState.fromScalar(initial))
  const animFrameRef = useRef<number>(0)
  const isAnimatingRef = useRef(false)

  const [value, setValue] = useState(initial)
  const [isAnimating, setIsAnimating] = useState(false)

  const tick = useCallback(() => {
    const current = currentRef.current
    const target = targetRef.current

    const blended = current.blend(target, blendFactor)
    currentRef.current = blended

    const currentScalar = blended.asScalar()
    const targetScalar = target.asScalar()

    setValue(currentScalar)

    if (Math.abs(currentScalar - targetScalar) < epsilon) {
      // Snap to target
      currentRef.current = GeometricState.fromScalar(targetScalar)
      setValue(targetScalar)
      isAnimatingRef.current = false
      setIsAnimating(false)
      return
    }

    animFrameRef.current = requestAnimationFrame(tick)
  }, [blendFactor, epsilon])

  const startAnimating = useCallback(() => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    setIsAnimating(true)
    animFrameRef.current = requestAnimationFrame(tick)
  }, [tick])

  const setTarget = useCallback((n: number) => {
    targetRef.current = GeometricState.fromScalar(n)
    startAnimating()
  }, [startAnimating])

  const jumpTo = useCallback((n: number) => {
    cancelAnimationFrame(animFrameRef.current)
    isAnimatingRef.current = false
    setIsAnimating(false)
    currentRef.current = GeometricState.fromScalar(n)
    targetRef.current = GeometricState.fromScalar(n)
    setValue(n)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return { value, setTarget, jumpTo, isAnimating }
}
