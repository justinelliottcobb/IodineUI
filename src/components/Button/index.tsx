export { ShaderButton } from './ShaderButton'
export type { ShaderButtonProps } from './ShaderButton'

// Re-export shader types for convenience
export { shaderRegistry, shaderVariants, type ShaderVariant } from '../../shaders'

import { ShaderButton, type ShaderButtonProps } from './ShaderButton'
import { shaderRegistry } from '../../shaders'

type VariantButtonProps = Omit<ShaderButtonProps, 'variant'>

// Create a typed button component for a specific variant
function createVariantButton(variant: string) {
  const VariantButton = (props: VariantButtonProps) => (
    <ShaderButton variant={variant} {...props} />
  )
  VariantButton.displayName = `${variant.charAt(0).toUpperCase() + variant.slice(1)}Button`
  return VariantButton
}

// Auto-generate variant buttons from registry
export const variantButtons = Object.fromEntries(
  Object.keys(shaderRegistry).map((variant) => [
    `${variant.charAt(0).toUpperCase() + variant.slice(1)}Button`,
    createVariantButton(variant),
  ])
) as Record<string, React.FC<VariantButtonProps>>

// Named exports for common variants (for better DX and tree-shaking)
export const PlasmaButton = createVariantButton('plasma')
export const FireButton = createVariantButton('fire')
export const VortexButton = createVariantButton('vortex')
export const OctogramButton = createVariantButton('octograms')
