# IodineUI Project Context

## Overview

IodineUI is a React component library featuring WebGL shader-powered UI elements. It uses OGL for WebGL rendering and Radix UI primitives as a foundation.

## Current State

**Version:** 0.0.0 (Early development)
**License:** MIT

### Completeness

- ✅ Core ShaderButton component fully functional
- ✅ 7 shader effects implemented (plasma, fire, vortex, octograms, spinner, progress-linear, progress-ring)
- ✅ useShaderCanvas hook for reusable WebGL logic
- ✅ Theme system with IodineProvider and CSS variables
- ✅ Loader, Progress, RingProgress feedback components
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
├── index.ts                    # Library entry point (all public exports)
├── components/
│   ├── Button/
│   │   ├── ShaderButton.tsx    # Main shader button component
│   │   ├── ShaderButton.stories.tsx
│   │   ├── Button.module.css
│   │   └── index.tsx           # Exports + variant button factories
│   ├── Loader/
│   │   ├── Loader.tsx          # Spinner/loading indicator component
│   │   ├── Loader.stories.tsx
│   │   ├── Loader.module.css
│   │   └── index.ts
│   ├── Progress/
│   │   ├── Progress.tsx        # Linear progress bar component
│   │   ├── Progress.stories.tsx
│   │   ├── Progress.module.css
│   │   └── index.ts
│   └── RingProgress/
│       ├── RingProgress.tsx    # Circular progress ring component
│       ├── RingProgress.stories.tsx
│       ├── RingProgress.module.css
│       └── index.ts
├── hooks/
│   ├── index.ts                # Hook exports
│   └── useShaderCanvas.ts      # Reusable WebGL canvas hook
├── shaders/
│   ├── index.ts                # Re-exports from registry
│   ├── registry.ts             # Auto-discovery + types
│   └── effects/                # Shader effect files
│       ├── plasma.ts
│       ├── fire.ts
│       ├── vortex.ts
│       ├── octograms.ts
│       ├── spinner.ts
│       ├── progress-linear.ts
│       └── progress-ring.ts
├── theme/
│   ├── index.ts                # Theme exports
│   ├── types.ts                # IodineTheme, ThemeColor, ThemeSize types
│   ├── defaultTheme.ts         # Default dark theme + utility functions
│   ├── ThemeContext.tsx         # IodineProvider + useIodineTheme hook
│   └── theme.css               # CSS custom properties
├── main.tsx                    # Dev preview app (not part of library build)
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

All shaders receive these base uniforms:
- `uTime` - Elapsed time in seconds
- `uIntensity` - Effect intensity (0-1), controlled by prop
- `uResolution` - Canvas dimensions in pixels
- `uMouse` - Normalized mouse position (0-1), Y is inverted

Custom uniforms can be passed via `useShaderCanvas({ customUniforms })`:
- `uProgress` - Used by `progress-linear` and `progress-ring` shaders (0-1)

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

### Loader

Shader-powered loading spinner.

```tsx
<Loader variant="spinner" size="md" color="primary" />
```

Props:
- `variant` - Shader effect name (default: `'spinner'`)
- `size` - `ThemeSize` or number in px (default: `'md'` = 32px)
- `color` - Theme color for glow (default: `'primary'`)
- `intensity` - Effect intensity 0-1 (default: 1.0)
- All standard div HTML attributes

### Progress

Linear progress bar with shader-animated fill.

```tsx
<Progress value={65} animated label />
```

Props:
- `value` - Progress 0-100 (required)
- `animated` - Whether to animate the shader (default: `true`)
- `color` - Theme color (default: `'primary'`)
- `size` - Height as `ThemeSize` or number (default: `'md'` = 12px)
- `intensity` - Effect intensity 0-1 (default: 1.0)
- `label` - `true` for percentage, or custom string
- `radius` - Border radius as `ThemeSize` (default: `'md'`)

### RingProgress

Circular progress ring with shader fill.

```tsx
<RingProgress value={75} size="lg" label={true} />
```

Props:
- `value` - Progress 0-100 (required)
- `size` - `ThemeSize` or number in px (default: `'lg'` = 48px)
- `color` - Theme color (default: `'primary'`)
- `label` - `true` for percentage, or custom ReactNode
- `intensity` - Effect intensity 0-1 (default: 1.0)

### useShaderCanvas Hook

Reusable hook for embedding WebGL shader canvases in any component.

```tsx
const { canvasRef, handleMouseMove, handleMouseLeave, effect } = useShaderCanvas({
  variant: 'plasma',
  intensity: 0.8,
  enableMouseTracking: true,
})
```

Returns: `canvasRef`, `start`, `pause`, `resume`, `reset`, `setUniform`, mouse handlers, `isAnimating`, `effect`

### Theme System

`IodineProvider` wraps the app with theme context and CSS custom properties.

```tsx
<IodineProvider defaultColorScheme="dark" theme={{ colors: { primary: '#ff0000' } }}>
  <App />
</IodineProvider>
```

- `useIodineTheme()` - access theme + color scheme
- `useCssVar(name)` - read computed CSS variable
- `getThemeGlow(color)` / `createGlowStyle(color)` - glow utilities
- Deep-merges custom theme overrides with `defaultTheme`
- Supports system preference detection via `respectSystemPreference`
- Theme colors: `primary`, `secondary`, `success`, `warning`, `error`
- Theme sizes: `xs`, `sm`, `md`, `lg`, `xl`

## Scripts

```bash
npm run dev              # Start Vite dev server (host 0.0.0.0:3000)
npm run storybook        # Start Storybook dev server (port 3000)
npm run build            # Build library (ES + CJS) + TypeScript declarations
npm run preview          # Preview production build
npm run build-storybook  # Build static Storybook site
```

Note: `dev` and `storybook` both default to port 3000 — run one at a time.

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
export { Loader }
export { Progress }
export { RingProgress }

// Registry access
export { shaderRegistry, shaderVariants, variantButtons }

// Hooks
export { useShaderCanvas }

// Theme
export { IodineProvider, useIodineTheme, useCssVar, getThemeGlow, createGlowStyle }
export { defaultTheme, getGlowColor, sizeMap }

// Types
export type { ShaderButtonProps, ShaderVariant, ShaderEffect }
export type { LoaderProps, ProgressProps, RingProgressProps }
export type { UseShaderCanvasOptions, UseShaderCanvasReturn }
export type { IodineTheme, ThemeColor, ThemeSize, ColorScheme, ThemeContextValue, IodineProviderProps }
```

## Implemented Shader Effects

| Effect | Description | Glow Color |
|--------|-------------|------------|
| **plasma** | RGB plasma waves with sine-based animation, mouse adds ripple effects | Purple `rgba(147, 51, 234, 0.4)` |
| **fire** | Perlin noise-based rising flames with FBM complexity | Red `rgba(239, 68, 68, 0.4)` |
| **vortex** | Polar coordinate spiral with pulsing glow, purple-to-cyan gradient | Cyan `rgba(6, 182, 212, 0.4)` |
| **octograms** | 3D ray marching with rotating geometric boxes (most GPU intensive) | Blue `rgba(59, 130, 246, 0.4)` |
| **spinner** | Circular loading animation with rotating arc and gradient tail | Purple `rgba(139, 92, 246, 0.4)` |
| **progress-linear** | Linear progress bar with wave animation and shimmer effects | Purple `rgba(139, 92, 246, 0.4)` |
| **progress-ring** | Circular progress ring starting from top, clockwise fill | Purple `rgba(139, 92, 246, 0.4)` |

## Recent Development History

| Commit | Description |
|--------|-------------|
| 4441b69 | Added Progress and RingProgress components |
| fb1491d | Added Loader component with spinner shader |
| 547d509 | Merged theme system into develop |
| 3eee6cc | Added theme system with React context and CSS variables |
| 5199d47 | Extracted WebGL logic into useShaderCanvas hook |
| f6d46ce | Added Claude CONTEXT.md |
| 505ce2e | Refactored shader architecture for easy effect extensibility |
| 953c77f | Storybook setup, moved shaders to external assets |
| ffb0701 | Initial Storybook v10 setup with Vite builder |
| bdb8b21 | Added OGL-powered ShaderButton with plasma, fire, vortex effects |
| 5b25f2c | Initial configuration setup |

## Development Workflow

This project follows a Gitflow-like branching strategy:

```
feature/* ──PR──> develop ──PR──> main
```

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready releases only |
| `develop` | Integration branch for features |
| `feature/*` | Individual feature development |

**Process:**
1. Create feature branch from `develop`: `git checkout -b feature/component-name develop`
2. Develop and commit changes
3. Open PR against `develop` for review
4. Merge to `develop` after approval
5. When ready for release, open PR from `develop` to `main`
6. Merge to `main` and tag release

## Key Architectural Decisions

1. **Shader Registry Pattern** - Uses Vite's `import.meta.glob` for zero-config shader discovery
2. **WebGL Abstraction** - OGL (lightweight WebGL wrapper) instead of raw WebGL
3. **Type Generation** - `ShaderVariant` type auto-generated from registry
4. **Mouse Tracking** - Normalized coordinates (0-1) for resolution-independent shaders
5. **Memory Safety** - Proper cleanup with WebGL context loss handling
6. **Responsive Canvas** - ResizeObserver for dynamic sizing
7. **Component Factory Pattern** - Auto-generates variant buttons to reduce boilerplate
8. **Theme via CSS Variables** - `IodineProvider` sets CSS custom properties (`--iodine-*`), theme is deep-merged with defaults
9. **Graceful Provider-Optional** - `useIodineTheme` returns defaults when used outside `IodineProvider` (with console warning)
10. **Shared Hook Architecture** - `useShaderCanvas` centralizes all WebGL lifecycle, resize, animation, and uniform management

---

## Roadmap

Target: Achieve component-functionality parity with Mantine UI (~120 components across core + extension packages), differentiated by WebGL shader-driven visual effects with user-customizable VFX. Integrate cliffy-tsukoshi geometric state library for smooth, physics-aware animations.

### What Sets IodineUI Apart

1. **Shader-driven VFX** — Every component can have WebGL shader backgrounds, borders, glows, and transitions
2. **VFX customization** — Users configure visual effects declaratively, not by writing GLSL
3. **Geometric animation** — cliffy-tsukoshi provides smooth interpolation, SLERP rotations, and physics-based motion
4. **Drop-in Mantine alternative** — Same component API surface, visually supercharged

---

### Phase 0: VFX Engine & Customization Tooling

_The differentiator. Build the tooling that makes shader effects accessible to non-shader developers._

**Shader Parameterization System:**
- [ ] `ShaderPreset` type — named, parameterized shader configs (colors, speed, intensity, pattern scale)
- [ ] `createShaderPreset()` — factory for user-defined presets from base effects
- [ ] Per-component `vfx` prop — declarative VFX configuration object instead of raw `variant` string
- [ ] Theme-level VFX defaults — `IodineProvider` accepts `vfx` config applied to all components
- [ ] Color extraction — shaders auto-derive colors from theme palette (no hardcoded RGBA in GLSL)

**VFX Prop API (target DX):**
```tsx
<ShaderButton vfx={{ effect: 'plasma', speed: 0.5, palette: ['#8b5cf6', '#06b6d4'], glow: true }}>
  Click me
</ShaderButton>

<Card vfx={{ effect: 'subtle-gradient', intensity: 0.3, target: 'border' }}>
  Content
</Card>
```

**Shader Effect Targets:**
- [ ] `background` — full canvas behind content (current behavior)
- [ ] `border` — shader renders only along element edges
- [ ] `glow` — shader drives the glow/shadow effect
- [ ] `underline` / `indicator` — for text and navigation components
- [ ] `fill` — for progress-style components

**Preset Library:**
- [ ] Ship 10+ named presets: `plasma`, `fire`, `vortex`, `octograms`, `aurora`, `nebula`, `electric`, `holographic`, `crystalline`, `void`
- [ ] Presets categorized by intensity: `subtle` (borders/glows only), `moderate` (backgrounds at low opacity), `vivid` (full effect)
- [ ] `vfx="none"` to opt-out of all shader effects per component

**VFX Storybook Addon / Playground:**
- [ ] Interactive controls for all shader parameters (speed, colors, scale, intensity)
- [ ] Live GLSL preview panel
- [ ] Export preset config as JSON/code
- [ ] Side-by-side comparison of presets on the same component

**cliffy-tsukoshi Integration — Animation Layer:**
- [ ] Add `cliffy-tsukoshi` as dependency
- [ ] `useGeometricState()` hook — wraps ReactiveState for React lifecycle
- [ ] `useSmoothValue(target, blendFactor)` hook — smooth scalar interpolation for progress, opacity, scale
- [ ] `useSmoothTransform()` hook — smooth position/rotation for drag, pan, parallax
- [ ] Smooth uniform updates — shader uniforms interpolated via `.blend()` instead of snapping
- [ ] Physics-based VFX — spring/damping behaviors for hover states, click responses, mount/unmount
- [ ] `<Motion>` wrapper component — applies geometric interpolation to children's transforms

---

### Phase 1: Foundation Components

_Complete the base primitives that all other components build on._

**Infrastructure (done):**
- [x] `useShaderCanvas` hook ✅
- [x] Theme system (IodineProvider, CSS variables) ✅
- [x] Shader registry with auto-discovery ✅

**Base Primitives:**
- [ ] `Box` — polymorphic base component (renders any element, accepts style props + optional `vfx`)
- [ ] `Paper` — surface container with shader-enhanced background/border
- [ ] `VisuallyHidden` — accessible hidden content
- [ ] `Portal` — render children outside parent DOM hierarchy
- [ ] `FocusTrap` — trap keyboard focus within container
- [ ] `Transition` — CSS/shader transition wrapper for mount/unmount (integrate cliffy-tsukoshi for smooth interpolation)
- [ ] `Collapse` — animated expand/collapse using geometric state for smooth height interpolation

**Buttons (expand):**
- [x] Button (ShaderButton) ✅
- [ ] `ActionIcon` — icon-only shader button
- [ ] `CloseButton` — dismissal button with subtle VFX
- [ ] `UnstyledButton` — style-reset base for custom buttons
- [ ] `CopyButton` — render-prop clipboard helper
- [ ] `FileButton` — wraps children to open file picker

**Feedback (expand):**
- [x] Loader ✅
- [x] Progress ✅
- [x] RingProgress ✅
- [ ] `SemiCircleProgress` — half-arc progress indicator
- [ ] `Skeleton` — shimmer loading placeholder (shader-driven shimmer effect)
- [ ] `Alert` — contextual message with shader accent
- [ ] `Notification` — styled notification with shader glow pulse
- [ ] `NavigationProgress` — top-of-page route progress bar

---

### Phase 2: Form Inputs

_Every input gets shader-driven focus/hover/active states via the `vfx` prop._

**Text Inputs:**
- [ ] `Input` — base input primitive (building block)
- [ ] `TextInput` — single-line text with shader focus border
- [ ] `Textarea` — multiline with shader border effects
- [ ] `PasswordInput` — with visibility toggle + shader states
- [ ] `NumberInput` — with increment/decrement controls
- [ ] `PinInput` — segmented code input with shader active segment
- [ ] `JsonInput` — JSON-validating textarea

**Selection Inputs:**
- [ ] `Checkbox` — shader-animated check state
- [ ] `Radio` — shader-animated selection dot
- [ ] `Switch` — shader transition between on/off (high VFX impact — trail effect)
- [ ] `SegmentedControl` — shader-highlighted active segment
- [ ] `Chip` — toggle pill with shader selected state
- [ ] `Slider` — shader-powered track fill
- [ ] `RangeSlider` — dual-thumb shader track
- [ ] `AngleSlider` — circular angle selector
- [ ] `Rating` — star rating with shader glow

**Combobox Family:**
- [ ] `Combobox` — headless base for all dropdown selectors
- [ ] `Select` — single-value dropdown with shader highlights
- [ ] `MultiSelect` — multi-value with shader-tagged pills
- [ ] `Autocomplete` — search-filtered dropdown
- [ ] `TagsInput` — free-form tag entry
- [ ] `Pill` / `PillsInput` — removable tag primitives

**Specialized:**
- [ ] `ColorInput` / `ColorPicker` — shader color preview in the swatch
- [ ] `FileInput` — file selector input
- [ ] `Fieldset` — form grouping with legend

**Form Management:**
- [ ] `useForm` hook — form state, validation, dirty checking, errors (equivalent to @mantine/form)
- [ ] Built-in validators: `isNotEmpty`, `isEmail`, `hasLength`, `matches`, `isInRange`

---

### Phase 3: Data Display

**Cards & Containers:**
- [ ] `Card` — shader background surfaces with sections (Card.Section compound pattern)
- [ ] `Accordion` — collapsible sections with shader expand/collapse indicator
- [ ] `Spoiler` — show/hide content

**Visual Elements:**
- [ ] `Badge` — shader-glowing status labels
- [ ] `Avatar` — user images with shader border ring
- [ ] `ThemeIcon` — icon containers with shader backgrounds
- [ ] `Indicator` — notification dots with shader pulse animation
- [ ] `Timeline` — vertical timeline with shader connectors
- [ ] `ColorSwatch` — color preview circle
- [ ] `NumberFormatter` — locale-aware number display

**Content:**
- [ ] `Image` — with shader overlay/loading effects
- [ ] `BackgroundImage` — shader-enhanced background
- [ ] `Kbd` — keyboard shortcut display
- [ ] `Code` — syntax highlighting containers

---

### Phase 4: Navigation

- [ ] `Tabs` — shader-animated active indicator (FloatingIndicator)
- [ ] `NavLink` — navigation links with shader hover trail
- [ ] `Breadcrumbs` — path navigation with separators
- [ ] `Pagination` — page controls with shader active state
- [ ] `Stepper` — multi-step progress with shader state transitions
- [ ] `Burger` — animated hamburger toggle
- [ ] `Anchor` — styled links inheriting Text props
- [ ] `TableOfContents` — heading-based TOC with scroll spy
- [ ] `Tree` — hierarchical tree view

---

### Phase 5: Overlays & Modals

- [ ] `Overlay` — shader dimming/blur layer
- [ ] `Modal` — dialog with shader backdrop effect
- [ ] `Drawer` — slide-in panel with shader edge glow
- [ ] `Dialog` — non-modal corner dialog
- [ ] `Popover` — floating anchored content
- [ ] `Tooltip` — hover information popup
- [ ] `Menu` — dropdown menus with shader item highlights
- [ ] `HoverCard` — hover-triggered card
- [ ] `LoadingOverlay` — full-area shader loader
- [ ] `Affix` — fixed-position element
- [ ] `FloatingIndicator` — animated indicator between active items
- [ ] ModalsManager — programmatic `modals.open()` / `modals.close()` API

---

### Phase 6: Layout & Typography

**Layout:**
- [ ] `Stack` — vertical flex layout
- [ ] `Group` — horizontal flex layout
- [ ] `Grid` / `SimpleGrid` — responsive grid system
- [ ] `Flex` — flexbox wrapper
- [ ] `Center` — centering container
- [ ] `Container` — max-width wrapper
- [ ] `Space` — spacing utility
- [ ] `Divider` — visual separator (optional shader gradient)
- [ ] `AspectRatio` — maintain width/height ratio
- [ ] `AppShell` — application layout with header, navbar, aside, footer (compound component)
- [ ] `ScrollArea` — custom scrollbars

**Typography:**
- [ ] `Text` — styled text with size, weight, color, truncation
- [ ] `Title` — heading component (h1-h6)
- [ ] `Highlight` — highlight substrings within text
- [ ] `Mark` — marker highlight
- [ ] `Blockquote` — quotation with icon
- [ ] `List` — ordered/unordered with custom icons
- [ ] `Table` — styled table with sticky header, striped rows, sorting
- [ ] `TypographyStylesProvider` — apply Iodine styles to raw HTML

---

### Phase 7: Hooks Library (`@iodine-ui/hooks`)

_Utility hooks matching @mantine/hooks (~73 hooks). Prioritize hooks that pair with shader/animation features._

**High Priority (shader-relevant):**
- [ ] `useHover` — hover state detection
- [ ] `useMouse` — mouse position tracking
- [ ] `useMove` — drag position tracking
- [ ] `useResizeObserver` — element size changes
- [ ] `useInViewport` — visibility detection (pause off-screen shaders for perf)
- [ ] `useReducedMotion` — respect `prefers-reduced-motion` (disable/simplify shaders)
- [ ] `useMediaQuery` — responsive breakpoints
- [ ] `useColorScheme` — system dark/light preference
- [ ] `useHotkeys` — keyboard shortcut registration
- [ ] `useClickOutside` — dismiss overlays
- [ ] `useFocusTrap` — focus management
- [ ] `useDisclosure` — boolean toggle state
- [ ] `useClipboard` — copy to clipboard

**Medium Priority (state/lifecycle):**
- [ ] `useLocalStorage` / `useSessionStorage`
- [ ] `useDebouncedValue` / `useDebouncedCallback`
- [ ] `useToggle`, `useCounter`, `useListState`, `useSetState`
- [ ] `usePagination`, `useSelection`
- [ ] `useId`, `useMergedRef`, `useUncontrolled`
- [ ] `useInterval`, `useTimeout`, `useIdle`
- [ ] `useScrollIntoView`, `useWindowScroll`, `useHeadroom`
- [ ] `useDocumentTitle`, `useFavicon`, `useDocumentVisibility`
- [ ] `useNetwork`, `useOs`, `useOrientation`, `useViewportSize`
- [ ] `useForceUpdate`, `useMounted`, `usePrevious`, `useStateHistory`
- [ ] `useEyeDropper`, `useFullscreen`, `usePageLeave`, `useTextSelection`
- [ ] `useFetch`, `useHash`

---

### Phase 8: Extension Packages

**`@iodine-ui/dates`:**
- [ ] `DatesProvider` — locale/settings context
- [ ] `Calendar` — base calendar component
- [ ] `DatePicker` / `DatePickerInput` — inline and input date selection
- [ ] `DateInput` — typed date input with parsing
- [ ] `DateTimePicker` — combined date + time
- [ ] `MonthPicker` / `MonthPickerInput`
- [ ] `YearPicker` / `YearPickerInput`
- [ ] `TimeInput` / `TimePicker` / `TimeGrid`

**`@iodine-ui/charts` (shader-enhanced):**
- [ ] `AreaChart`, `BarChart`, `LineChart`, `CompositeChart`
- [ ] `DonutChart`, `PieChart`, `FunnelChart`
- [ ] `RadarChart`, `ScatterChart`, `BubbleChart`
- [ ] `RadialBarChart`, `Sparkline`, `Heatmap`
- [ ] Shader integration: glow on data points, animated fills, plasma-style area fills

**`@iodine-ui/spotlight`:**
- [ ] `Spotlight` — command palette (Ctrl+K) with shader-highlighted results

**`@iodine-ui/dropzone`:**
- [ ] `Dropzone` — drag-and-drop file upload with shader accept/reject states

**`@iodine-ui/carousel`:**
- [ ] `Carousel` — slide-based carousel with shader transition effects

**`@iodine-ui/code-highlight`:**
- [ ] `CodeHighlight` / `CodeHighlightTabs` — syntax highlighting with optional shader accents

**`@iodine-ui/tiptap`:**
- [ ] `RichTextEditor` — Tiptap-based WYSIWYG editor

---

### cliffy-tsukoshi Integration Points

The [`cliffy-tsukoshi`](/home/elliotthall/working/rust/cliffy/cliffy-tsukoshi) library provides geometric algebra-based state management with smooth interpolation. Key integration:

| IodineUI Feature | cliffy-tsukoshi Capability | Benefit |
|-----------------|---------------------------|---------|
| Shader uniform updates | `GeometricState.blend()` | Smooth value transitions instead of snapping |
| Progress/RingProgress | Scalar `ReactiveState` | Animated value changes with damping |
| Drag interactions | `Transform` + `ReactiveState` | Smooth position tracking with momentum |
| 3D card effects | `Rotor.slerp()` | Gimbal-lock-free tilt/rotation on hover |
| Page transitions | `Transform.interpolate()` | Combined rotation + translation animations |
| Hover states | `useSmoothValue()` | Frame-rate independent intensity blending |
| Particle effects | `GeometricState` arrays | Position + velocity state for GPU particles |
| Reduced motion | Bypass `.blend()`, snap to target | Respects accessibility preferences |

**Planned Hooks (wrapping cliffy-tsukoshi):**

```ts
// Smooth scalar interpolation
const smoothProgress = useSmoothValue(targetValue, { blend: 0.1, threshold: 0.001 })

// Smooth 2D position (for drag, parallax)
const smoothPos = useSmoothPosition([x, y], { blend: 0.15, damping: 0.95 })

// Smooth rotation (gimbal-lock-free)
const smoothRotation = useSmoothRotation(angleRad, { slerp: 0.1 })

// Combined transform
const smoothTransform = useSmoothTransform({ position, rotation }, { blend: 0.12 })
```

---

### Component Priority Matrix

| Priority | Components | Shader Value | Notes |
|----------|------------|-------------|-------|
| **Critical** | VFX engine, presets, `vfx` prop | **Core differentiator** | Must ship before mass component work |
| **Critical** | Switch, Slider, Skeleton, Tabs | Animated states are peak shader appeal | High visual impact |
| **High** | Card, Badge, ActionIcon, Modal, Tooltip | Strong VFX enhancement | Common in every app |
| **High** | cliffy-tsukoshi hooks | Smooth everything | Foundation for premium feel |
| **Medium** | TextInput, Checkbox, Select, Menu | Focus/hover shader borders | Large surface area |
| **Medium** | Notification, Stepper, Timeline | Animated state transitions | Moderate VFX impact |
| **Lower** | Layout, Typography, Table | Functional, less shader-dependent | Divider is the exception |
| **Deferred** | Dates, Charts, RichTextEditor | Complex, separate packages | Build after core is solid |

---

### Mantine Parity Checklist

**@mantine/core equivalents (~102 components):**

| Category | Mantine Component | IodineUI | Status |
|----------|------------------|----------|--------|
| **Buttons** | Button | ShaderButton | ✅ |
| | ActionIcon | - | 🔲 |
| | CloseButton | - | 🔲 |
| | UnstyledButton | - | 🔲 |
| | CopyButton | - | 🔲 |
| | FileButton | - | 🔲 |
| **Feedback** | Loader | Loader | ✅ |
| | Progress | Progress | ✅ |
| | RingProgress | RingProgress | ✅ |
| | SemiCircleProgress | - | 🔲 |
| | Skeleton | - | 🔲 |
| | Alert | - | 🔲 |
| | Notification | - | 🔲 |
| **Inputs** | Input | - | 🔲 |
| | TextInput | - | 🔲 |
| | Textarea | - | 🔲 |
| | PasswordInput | - | 🔲 |
| | NumberInput | - | 🔲 |
| | PinInput | - | 🔲 |
| | JsonInput | - | 🔲 |
| | Checkbox | - | 🔲 |
| | Radio | - | 🔲 |
| | Switch | - | 🔲 |
| | SegmentedControl | - | 🔲 |
| | Chip | - | 🔲 |
| | Slider | - | 🔲 |
| | RangeSlider | - | 🔲 |
| | AngleSlider | - | 🔲 |
| | Rating | - | 🔲 |
| | ColorInput | - | 🔲 |
| | ColorPicker | - | 🔲 |
| | FileInput | - | 🔲 |
| | Fieldset | - | 🔲 |
| **Combobox** | Combobox | - | 🔲 |
| | Select | - | 🔲 |
| | MultiSelect | - | 🔲 |
| | Autocomplete | - | 🔲 |
| | TagsInput | - | 🔲 |
| | Pill / PillsInput | - | 🔲 |
| **Navigation** | Tabs | - | 🔲 |
| | NavLink | - | 🔲 |
| | Breadcrumbs | - | 🔲 |
| | Pagination | - | 🔲 |
| | Stepper | - | 🔲 |
| | Burger | - | 🔲 |
| | Anchor | - | 🔲 |
| | TableOfContents | - | 🔲 |
| | Tree | - | 🔲 |
| **Data Display** | Card | - | 🔲 |
| | Accordion | - | 🔲 |
| | Spoiler | - | 🔲 |
| | Badge | - | 🔲 |
| | Avatar | - | 🔲 |
| | ThemeIcon | - | 🔲 |
| | Indicator | - | 🔲 |
| | Timeline | - | 🔲 |
| | ColorSwatch | - | 🔲 |
| | NumberFormatter | - | 🔲 |
| | Image | - | 🔲 |
| | BackgroundImage | - | 🔲 |
| | Kbd | - | 🔲 |
| | Code | - | 🔲 |
| **Overlays** | Overlay | - | 🔲 |
| | Modal | - | 🔲 |
| | Drawer | - | 🔲 |
| | Dialog | - | 🔲 |
| | Popover | - | 🔲 |
| | Tooltip | - | 🔲 |
| | Menu | - | 🔲 |
| | HoverCard | - | 🔲 |
| | LoadingOverlay | - | 🔲 |
| | Affix | - | 🔲 |
| | FloatingIndicator | - | 🔲 |
| **Layout** | Box | - | 🔲 |
| | Paper | - | 🔲 |
| | Stack | - | 🔲 |
| | Group | - | 🔲 |
| | Grid / SimpleGrid | - | 🔲 |
| | Flex | - | 🔲 |
| | Center | - | 🔲 |
| | Container | - | 🔲 |
| | Space | - | 🔲 |
| | Divider | - | 🔲 |
| | AspectRatio | - | 🔲 |
| | AppShell | - | 🔲 |
| | ScrollArea | - | 🔲 |
| **Typography** | Text | - | 🔲 |
| | Title | - | 🔲 |
| | Highlight | - | 🔲 |
| | Mark | - | 🔲 |
| | Blockquote | - | 🔲 |
| | List | - | 🔲 |
| | Table | - | 🔲 |
| | TypographyStylesProvider | - | 🔲 |
| **Misc** | Transition | - | 🔲 |
| | Collapse | - | 🔲 |
| | FocusTrap | - | 🔲 |
| | Portal | - | 🔲 |
| | VisuallyHidden | - | 🔲 |

**Extension packages:**

| Package | Components | Status |
|---------|-----------|--------|
| `@iodine-ui/hooks` | ~73 hooks | 🔲 |
| `@iodine-ui/dates` | 15 components | 🔲 |
| `@iodine-ui/charts` | 13 components | 🔲 |
| `@iodine-ui/notifications` | Notification system | 🔲 |
| `@iodine-ui/modals` | Modals manager | 🔲 |
| `@iodine-ui/spotlight` | Command palette | 🔲 |
| `@iodine-ui/dropzone` | File upload zone | 🔲 |
| `@iodine-ui/carousel` | Slide carousel | 🔲 |
| `@iodine-ui/code-highlight` | Syntax highlighting | 🔲 |
| `@iodine-ui/tiptap` | Rich text editor | 🔲 |
| `@iodine-ui/form` | Form state management | 🔲 |

**Progress: 6 / ~120 core components (5%) | 0 / ~73 hooks | 0 / 10 extension packages**

Legend: ✅ Complete | 🚧 In Progress | 🔲 Planned
