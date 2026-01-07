# IodineUI Project Context

## Overview

IodineUI is a React component library featuring WebGL shader-powered UI elements. It uses OGL for WebGL rendering and Radix UI primitives as a foundation.

## Current State

**Version:** 0.0.0 (Early development)
**License:** MIT

### Completeness

- ✅ Core ShaderButton component fully functional
- ✅ 4 shader effects implemented (plasma, fire, vortex, octograms)
- ✅ Storybook setup with comprehensive stories
- ✅ Responsive design with ResizeObserver
- ✅ Mouse interaction handling
- ✅ CSS Module styling
- ✅ TypeScript strict mode
- ✅ Build configuration (ES + CJS)
- ✅ Development preview app
- ✅ Vitest + Playwright testing integration

### Ready For

- ✅ Local development and testing
- ✅ Storybook visual documentation
- ✅ Component testing with Vitest
- ✅ NPM package distribution
- ✅ Integration into other React projects

## Tech Stack

- **React 18/19** - UI framework (peer dependency)
- **Vite 7.2** - Build tool (library mode)
- **OGL 1.0** - Minimal WebGL library for shader rendering
- **Radix UI** - Accessible component primitives
- **TypeScript 5.9** - Type safety (strict mode)
- **CSS Modules** - Scoped styling
- **Storybook 10** - Component documentation and development
- **Vitest 4** - Unit testing framework
- **Playwright** - Browser testing (Chromium, headless)
- **Chromatic** - Visual regression testing integration

## Project Structure

```
src/
├── index.ts                    # Library entry point
├── components/
│   └── Button/
│       ├── ShaderButton.tsx    # Main shader button component
│       ├── ShaderButton.stories.tsx
│       ├── Button.module.css
│       └── index.tsx           # Exports + variant button factories
├── shaders/
│   ├── index.ts                # Re-exports from registry
│   ├── registry.ts             # Auto-discovery + types
│   └── effects/                # Shader effect files
│       ├── plasma.ts
│       ├── fire.ts
│       ├── vortex.ts
│       └── octograms.ts
└── style.css                   # Dev preview styles
```

## Architecture

### Shader Registry Pattern

Shaders are auto-discovered using Vite's `import.meta.glob`. To add a new shader effect:

1. Create a file in `src/shaders/effects/`:

```ts
// src/shaders/effects/myeffect.ts
import type { ShaderEffect } from '../registry'

const effect: ShaderEffect = {
  name: 'myeffect',
  glow: 'rgba(R, G, B, 0.4)',  // Optional glow color
  fragment: /* glsl */`
    precision highp float;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    varying vec2 vUv;

    void main() {
      // Your shader code here
      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export default effect
```

That's it - the registry auto-discovers new effects.

### Shader Uniforms

All shaders receive these uniforms:
- `uTime` - Elapsed time in seconds
- `uIntensity` - Effect intensity (0-1), controlled by prop
- `uResolution` - Canvas dimensions in pixels
- `uMouse` - Normalized mouse position (0-1), Y is inverted

### Converting Shadertoy Shaders

Shadertoy shaders need conversion:
- Replace `mainImage(out vec4, in vec2)` with `void main()`
- Replace `iTime` with `uTime`
- Replace `iResolution` with `uResolution`
- Replace `fragCoord` with `vUv * uResolution`
- Output to `gl_FragColor` instead of `fragColor`
- Add the standard uniform declarations

## Components

### ShaderButton

Base component with WebGL canvas background.

```tsx
<ShaderButton variant="plasma" intensity={0.8}>
  Click me
</ShaderButton>
```

Props:
- `variant` - Shader effect name (auto-typed from registry)
- `intensity` - Effect intensity 0-1 (default: 1.0)
- All standard button HTML attributes

### Variant Buttons

Convenience components for each effect:
- `PlasmaButton`
- `FireButton`
- `VortexButton`
- `OctogramButton`

## Scripts

```bash
npm run dev              # Start Vite dev server (port 3000)
npm run storybook        # Start Storybook dev server
npm run build            # Build library (ES + CJS) + TypeScript declarations
npm run preview          # Preview production build
npm run build-storybook  # Build static Storybook site
```

## Configuration Notes

### Storybook

- Configured for remote host access via `viteFinal` in `.storybook/main.ts`
- Dark background default for shader visibility
- Variant control auto-populates from `shaderVariants`

### Vite

- Library mode outputs ES and CJS formats
- React is externalized (peer dependency)
- `resolve.dedupe` configured for React to prevent multiple instances

### TypeScript

- JSX mode: `react-jsx`
- Declarations generated on build
- Strict mode enabled

## Known Issues / Notes

- Storybook cache may need clearing after shader changes: `rm -rf node_modules/.cache/storybook`
- OGL errors about "forEach undefined" usually indicate shader compilation failure
- The dev preview (`src/main.tsx`) is separate from the library build

## Library Exports

```ts
// Components
export { ShaderButton, PlasmaButton, FireButton, VortexButton, OctogramButton }

// Registry access
export { shaderRegistry, shaderVariants, variantButtons }

// Types
export type { ShaderButtonProps, ShaderVariant, ShaderEffect }
```

## Implemented Shader Effects

| Effect | Description | Glow Color |
|--------|-------------|------------|
| **plasma** | RGB plasma waves with sine-based animation, mouse adds ripple effects | Purple `rgba(147, 51, 234, 0.4)` |
| **fire** | Perlin noise-based rising flames with FBM complexity | Red `rgba(239, 68, 68, 0.4)` |
| **vortex** | Polar coordinate spiral with pulsing glow, purple-to-cyan gradient | Cyan `rgba(6, 182, 212, 0.4)` |
| **octograms** | 3D ray marching with rotating geometric boxes (most GPU intensive) | Blue `rgba(59, 130, 246, 0.4)` |

## Recent Development History

| Commit | Description |
|--------|-------------|
| 505ce2e | Refactored shader architecture for easy effect extensibility |
| 953c77f | Storybook setup, moved shaders to external assets |
| ffb0701 | Initial Storybook v10 setup with Vite builder |
| bdb8b21 | Added OGL-powered ShaderButton with plasma, fire, vortex effects |
| 5b25f2c | Initial configuration setup |

## Key Architectural Decisions

1. **Shader Registry Pattern** - Uses Vite's `import.meta.glob` for zero-config shader discovery
2. **WebGL Abstraction** - OGL (lightweight WebGL wrapper) instead of raw WebGL
3. **Type Generation** - `ShaderVariant` type auto-generated from registry
4. **Mouse Tracking** - Normalized coordinates (0-1) for resolution-independent shaders
5. **Memory Safety** - Proper cleanup with WebGL context loss handling
6. **Responsive Canvas** - ResizeObserver for dynamic sizing
7. **Component Factory Pattern** - Auto-generates variant buttons to reduce boilerplate

---

## Roadmap: Mantine UI Component Equivalence

Target: Achieve feature parity with Mantine UI core components, prioritizing components that benefit most from shader effects.

### Phase 1: Foundation & High-Impact Components

**Infrastructure:**
- [ ] Create shared `ShaderContainer` base component for consistent canvas integration
- [ ] Implement theme system (color tokens, spacing, typography)
- [ ] Add `Box` primitive (base layout component)
- [ ] Add `Paper` component (shader-enhanced surface)

**Buttons (Expand):**
- [x] Button - base shader button ✅
- [ ] ActionIcon - icon-only shader button
- [ ] CloseButton - dismissal button with subtle shader
- [ ] UnstyledButton - base for custom implementations

**Feedback (High shader impact):**
- [ ] Loader - animated shader loading spinners
- [ ] Progress - shader-powered progress bar
- [ ] RingProgress - circular progress with shader fill
- [ ] Skeleton - shimmer loading placeholder

### Phase 2: Form Inputs

**Text Inputs:**
- [ ] TextInput - shader focus/hover states
- [ ] Textarea - multiline with shader border effects
- [ ] PasswordInput - with visibility toggle
- [ ] NumberInput - with increment/decrement controls
- [ ] PinInput - segmented code input

**Selection Inputs:**
- [ ] Checkbox - shader-animated check state
- [ ] Radio - shader-animated selection
- [ ] Switch - shader transition between states
- [ ] SegmentedControl - shader-highlighted segments
- [ ] Slider / RangeSlider - shader-powered track

**Specialized Inputs:**
- [ ] Select - dropdown with shader highlights
- [ ] MultiSelect - multi-value selection
- [ ] ColorInput / ColorPicker - shader color preview
- [ ] Rating - star rating with shader glow
- [ ] FileInput - drag-drop zone

### Phase 3: Navigation

- [ ] Tabs - shader-animated active indicator
- [ ] NavLink - navigation links with shader hover
- [ ] Breadcrumbs - path navigation
- [ ] Pagination - page controls
- [ ] Stepper - multi-step progress with shader states
- [ ] Burger - animated menu toggle
- [ ] Anchor - styled links

### Phase 4: Data Display

**Cards & Containers:**
- [ ] Card - shader background surfaces
- [ ] Accordion - collapsible sections
- [ ] Spoiler - show/hide content

**Visual Elements:**
- [ ] Badge - shader-glowing labels
- [ ] Avatar - user images with shader borders
- [ ] ThemeIcon - icon containers with shader backgrounds
- [ ] Indicator - notification dots with shader pulse
- [ ] Timeline - vertical timeline with shader connectors

**Content:**
- [ ] Image - with shader overlay effects
- [ ] BackgroundImage - shader-enhanced backgrounds
- [ ] Kbd - keyboard shortcut display
- [ ] Code - syntax highlighting containers

### Phase 5: Overlays & Modals

- [ ] Modal - dialog with shader backdrop
- [ ] Drawer - slide-in panel
- [ ] Popover - floating content
- [ ] Tooltip - hover information
- [ ] Menu - dropdown menus
- [ ] HoverCard - hover-triggered cards
- [ ] Dialog - simple dialogs
- [ ] Overlay - shader dimming layer
- [ ] LoadingOverlay - full-area loader

### Phase 6: Layout & Typography

**Layout:**
- [ ] Stack - vertical flex layout
- [ ] Group - horizontal flex layout
- [ ] Grid / SimpleGrid - grid layouts
- [ ] Flex - flexbox wrapper
- [ ] Center - centering container
- [ ] Container - max-width wrapper
- [ ] Space - spacing utility
- [ ] Divider - visual separator

**Typography:**
- [ ] Text - styled text
- [ ] Title - heading text
- [ ] Highlight - text highlighting
- [ ] Mark - marker highlight
- [ ] Blockquote - quotation styling
- [ ] List - styled lists
- [ ] Table - data tables

### Phase 7: Extended Components

**Dates (separate package):**
- [ ] DatePicker / DatePickerInput
- [ ] Calendar
- [ ] TimeInput / TimePicker

**Utilities:**
- [ ] Notification system
- [ ] Spotlight (command palette)
- [ ] ScrollArea - custom scrollbars
- [ ] Collapse - animated show/hide
- [ ] Transition - animation wrapper

---

### Component Priority Matrix

Components ranked by shader enhancement potential:

| Priority | Components | Shader Value |
|----------|------------|--------------|
| **Critical** | Loader, Progress, RingProgress, Switch | Animated states are core to shader appeal |
| **High** | Card, Badge, ActionIcon, Tabs, Slider | Strong visual enhancement opportunity |
| **Medium** | Inputs, Select, Modal, Tooltip | Focus/hover states benefit from shaders |
| **Lower** | Layout, Typography, Table | Functional but less shader-dependent |

### Mantine Parity Checklist

**@mantine/core equivalents:**

| Category | Mantine | IodineUI | Status |
|----------|---------|----------|--------|
| **Buttons** | Button | ShaderButton | ✅ |
| | ActionIcon | - | 🔲 |
| | CloseButton | - | 🔲 |
| **Feedback** | Loader | - | 🔲 |
| | Progress | - | 🔲 |
| | Skeleton | - | 🔲 |
| **Inputs** | TextInput | - | 🔲 |
| | Checkbox | - | 🔲 |
| | Switch | - | 🔲 |
| | Select | - | 🔲 |
| **Navigation** | Tabs | - | 🔲 |
| | NavLink | - | 🔲 |
| **Display** | Card | - | 🔲 |
| | Badge | - | 🔲 |
| | Avatar | - | 🔲 |
| **Overlays** | Modal | - | 🔲 |
| | Tooltip | - | 🔲 |
| **Layout** | Stack | - | 🔲 |
| | Group | - | 🔲 |

Legend: ✅ Complete | 🚧 In Progress | 🔲 Planned
