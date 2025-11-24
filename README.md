# iodine-ui

A React component library featuring WebGL shader-powered UI elements built with OGL and Radix primitives.

## Installation

```bash
npm install iodine-ui
```

## Components

### Shader Buttons

Animated buttons with real-time GLSL shader backgrounds that respond to mouse movement.

```tsx
import { PlasmaButton, FireButton, VortexButton } from 'iodine-ui'

function App() {
  return (
    <>
      <PlasmaButton onClick={handleSubmit}>Submit</PlasmaButton>
      <FireButton onClick={handleDelete}>Delete</FireButton>
      <VortexButton onClick={handleAction}>Action</VortexButton>
    </>
  )
}
```

**Variants:**
- `PlasmaButton` - Animated RGB plasma waves
- `FireButton` - Rising flame effect with procedural noise
- `VortexButton` - Spiraling vortex with pulsing glow

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'plasma' \| 'fire' \| 'vortex'` | `'plasma'` | Shader effect type |
| `intensity` | `number` | `1.0` | Effect intensity (0-1) |
| `children` | `ReactNode` | - | Button content |
| `...props` | `ButtonHTMLAttributes` | - | Standard button props |

You can also use the base `ShaderButton` component directly:

```tsx
import { ShaderButton } from 'iodine-ui'

<ShaderButton variant="fire" intensity={0.7}>
  Custom
</ShaderButton>
```

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Build library
```

## Tech Stack

- React 18/19
- OGL (WebGL)
- Radix UI primitives
- Vite (library mode)
- CSS Modules

## License

MIT
