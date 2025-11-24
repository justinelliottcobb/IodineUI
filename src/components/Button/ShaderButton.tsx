import { useRef, useEffect, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import styles from './Button.module.css'

export interface ShaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'plasma' | 'fire' | 'vortex'
  intensity?: number
}

interface ShaderConfig {
  fragment: string
  uniforms?: Record<string, { value: number | number[] }>
}

const vertexShader = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const plasmaFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 4.0 - 2.0;

    float t = uTime * 0.5;

    float v1 = sin(p.x * 2.0 + t);
    float v2 = sin(p.y * 2.0 + t * 0.7);
    float v3 = sin((p.x + p.y) * 1.5 + t * 0.5);
    float v4 = sin(length(p) * 3.0 - t);

    float v = (v1 + v2 + v3 + v4) * 0.25;

    // Mouse interaction
    float mouseDist = length(uv - uMouse);
    v += sin(mouseDist * 10.0 - uTime * 2.0) * 0.3 * (1.0 - mouseDist);

    vec3 col = vec3(
      sin(v * 3.14159 + 0.0) * 0.5 + 0.5,
      sin(v * 3.14159 + 2.094) * 0.5 + 0.5,
      sin(v * 3.14159 + 4.188) * 0.5 + 0.5
    );

    col = mix(vec3(0.1, 0.0, 0.2), col, uIntensity);

    gl_FragColor = vec4(col, 1.0);
  }
`

const fireFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * smoothNoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Fire rises from bottom
    vec2 q = uv;
    q.y -= uTime * 0.3;

    float n = fbm(q * 4.0 + uTime * 0.5);
    n += fbm(q * 8.0 - uTime * 0.3) * 0.5;

    // Shape fire - stronger at bottom
    float shape = 1.0 - uv.y;
    shape = pow(shape, 0.8);

    // Mouse interaction - fire follows mouse
    float mouseDist = length(uv - uMouse);
    float mouseInfluence = exp(-mouseDist * 3.0) * 0.5;
    n += mouseInfluence;

    float fire = n * shape * uIntensity;

    // Fire colors
    vec3 col = vec3(0.0);
    col = mix(col, vec3(0.1, 0.0, 0.0), smoothstep(0.0, 0.3, fire));
    col = mix(col, vec3(0.8, 0.2, 0.0), smoothstep(0.3, 0.5, fire));
    col = mix(col, vec3(1.0, 0.6, 0.0), smoothstep(0.5, 0.7, fire));
    col = mix(col, vec3(1.0, 1.0, 0.6), smoothstep(0.7, 1.0, fire));

    gl_FragColor = vec4(col, 1.0);
  }
`

const vortexFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;

    // Apply mouse offset to vortex center
    vec2 center = (uMouse - 0.5) * 0.3;
    uv -= center;

    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    // Spiral distortion
    float spiral = angle + radius * 8.0 - uTime * 2.0;

    // Create bands
    float bands = sin(spiral * 3.0) * 0.5 + 0.5;
    bands = pow(bands, 2.0);

    // Radial fade
    float fade = 1.0 - radius * 1.5;
    fade = clamp(fade, 0.0, 1.0);

    // Pulsing glow
    float pulse = sin(uTime * 3.0) * 0.1 + 0.9;

    float v = bands * fade * pulse * uIntensity;

    // Colors - deep purple to cyan
    vec3 col1 = vec3(0.2, 0.0, 0.4);
    vec3 col2 = vec3(0.0, 0.8, 1.0);
    vec3 col3 = vec3(1.0, 1.0, 1.0);

    vec3 col = mix(col1, col2, v);
    col = mix(col, col3, pow(v, 3.0));

    // Add subtle rotation highlight
    float highlight = sin(angle * 2.0 + uTime) * 0.5 + 0.5;
    col += highlight * 0.1 * fade;

    gl_FragColor = vec4(col, 1.0);
  }
`

const shaderConfigs: Record<string, ShaderConfig> = {
  plasma: { fragment: plasmaFragment },
  fire: { fragment: fireFragment },
  vortex: { fragment: vortexFragment },
}

export function ShaderButton({
  children,
  variant = 'plasma',
  intensity = 1.0,
  className,
  ...props
}: ShaderButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const programRef = useRef<Program | null>(null)
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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

    const config = shaderConfigs[variant]
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: config.fragment,
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
  }, [variant, intensity])

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

  return (
    <button
      className={`${styles.shaderButton} ${styles[variant]} ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.content}>{children}</span>
    </button>
  )
}
