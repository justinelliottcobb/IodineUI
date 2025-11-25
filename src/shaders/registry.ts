export interface ShaderEffect {
  name: string
  fragment: string
  glow?: string
}

// Common vertex shader for all effects
export const vertexShader = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// Auto-import all effect files
const effectModules = import.meta.glob<{ default: ShaderEffect }>('./effects/*.ts', {
  eager: true,
})

// Build registry from effect modules
export const shaderRegistry: Record<string, ShaderEffect> = {}

for (const path in effectModules) {
  const effect = effectModules[path].default
  if (effect?.name) {
    shaderRegistry[effect.name] = effect
  }
}

// Extract variant names as a type
export type ShaderVariant = keyof typeof shaderRegistry

// Get all available variant names
export const shaderVariants = Object.keys(shaderRegistry) as ShaderVariant[]
