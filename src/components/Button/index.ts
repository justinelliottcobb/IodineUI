export { ShaderButton } from './ShaderButton'
export type { ShaderButtonProps } from './ShaderButton'

import { ShaderButton, type ShaderButtonProps } from './ShaderButton'

type VariantButtonProps = Omit<ShaderButtonProps, 'variant'>

export function PlasmaButton(props: VariantButtonProps) {
  return <ShaderButton variant="plasma" {...props} />
}

export function FireButton(props: VariantButtonProps) {
  return <ShaderButton variant="fire" {...props} />
}

export function VortexButton(props: VariantButtonProps) {
  return <ShaderButton variant="vortex" {...props} />
}
