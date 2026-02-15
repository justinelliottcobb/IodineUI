# IodineUI Roadmap

> A shader-powered React component library with Mantine-level functionality and WebGL-driven visual effects.

**Current progress: 6 / ~120 core components (5%) | 2 / ~73 hooks | 0 / 10 extension packages**

---

## Vision

IodineUI aims to achieve component-functionality parity with [Mantine UI](https://mantine.dev) (~120 components across core + extension packages), differentiated by:

1. **Shader-driven VFX** — Every component can have WebGL shader backgrounds, borders, glows, and transitions
2. **VFX customization** — Users configure visual effects declaratively, not by writing GLSL
3. **Geometric animation** — [cliffy-tsukoshi](https://github.com/nicholasclifford/cliffy-tsukoshi) provides smooth interpolation, SLERP rotations, and physics-based motion
4. **Drop-in Mantine alternative** — Same component API surface, visually supercharged

---

## Completed Work

| Component | Description | Commit |
|-----------|-------------|--------|
| `ShaderButton` | WebGL canvas background button with variant system | bdb8b21 |
| `PlasmaButton`, `FireButton`, `VortexButton`, `OctogramButton` | Pre-configured variant buttons | 505ce2e |
| `Loader` | Shader-powered loading spinner | fb1491d |
| `Progress` | Linear progress bar with shader fill | 4441b69 |
| `RingProgress` | Circular progress ring with shader fill | 4441b69 |
| `useShaderCanvas` | Reusable WebGL lifecycle hook | 5199d47 |
| `IodineProvider` + theme system | React context, CSS variables, color scheme | 3eee6cc |
| Shader registry | Auto-discovery via `import.meta.glob` | 505ce2e |
| 7 shader effects | plasma, fire, vortex, octograms, spinner, progress-linear, progress-ring | various |
| Storybook 10 | Component documentation and development | ffb0701 |
| **Phase 0: VFX Engine** | Shader parameterization, presets, `vfx` prop, rotor library | ee50fee |
| VFX type system | `VfxConfig`, `VfxProp`, `ResolvedVfxConfig`, `resolveVfxConfig()` | ee50fee |
| Color bridge | `hexToVec3()`, `vec3ToRgba()` — theme colors to GLSL vec3 uniforms | ee50fee |
| Preset system | `createShaderPreset()`, `registerPresets()`, `getPreset()` | ee50fee |
| Shader parameterization | `uColor1/2/3`, `uSpeed`, `uScale` uniforms on all 10 effects | ee50fee |
| 3 new effects | aurora, nebula, electric | ee50fee |
| GLSL rotor library | Cl(3,0) rotors — `rotor_apply`, `rotor_slerp`, `rotor_multiply`, etc. | ee50fee |
| Rotor tilt system | `uTilt` uniform on all shaders, mouse-driven or static perspective tilt | ee50fee |
| `useSmoothValue` hook | cliffy-tsukoshi `GeometricState.blend()` for smooth scalar interpolation | ee50fee |
| `vfx` prop on all components | ShaderButton, Loader, Progress, RingProgress — backward-compatible | ee50fee |

---

## Phase 0: VFX Engine & Customization Tooling

**Status:** Core complete ✅ | Remaining: effect targets, intensity presets, Storybook playground
**Priority:** Critical path — must ship before mass component work

_The differentiator. Build the tooling that makes shader effects accessible to non-shader developers._

### 0.1 Shader Parameterization System ✅

- [x] Define `VfxConfig` / `VfxProp` / `ResolvedVfxConfig` types
- [x] Implement `createShaderPreset()` — factory for user-defined presets
- [x] Add per-component `vfx` prop — declarative VFX configuration
- [x] Implement color extraction — `hexToVec3()` bridges theme palette to GLSL uniforms
- [x] All 10 shaders parameterized with `uColor1/2/3`, `uSpeed`, `uScale`
- [x] 3 new effects: aurora, nebula, electric
- [ ] Theme-level VFX defaults via `IodineProvider`

**Developer experience (working today):**

```tsx
// Per-component configuration
<ShaderButton vfx={{ effect: 'plasma', speed: 0.5, palette: ['#8b5cf6', '#06b6d4'], glow: true }}>
  Click me
</ShaderButton>

// Custom preset
const myPreset = createShaderPreset('neon-fire', {
  effect: 'fire',
  speed: 0.3,
  palette: ['#ff6b6b', '#ffd93d'],
})
<ShaderButton vfx={myPreset}>Custom look</ShaderButton>

// Rotor-based perspective tilt (mouse-driven)
<ShaderButton vfx={{ effect: 'plasma', tilt: true }}>Tilts with mouse</ShaderButton>

// Static tilt
<ShaderButton vfx={{ effect: 'octograms', tilt: { x: 0.2, y: 0.1 } }}>Tilted</ShaderButton>

// Opt-out entirely
<ShaderButton vfx="none">Plain button</ShaderButton>
```

### 0.2 Shader Effect Targets (not started)

- [ ] `background` — full canvas behind content (current default behavior)
- [ ] `border` — shader renders only along element edges
- [ ] `glow` — shader drives drop-shadow/box-shadow dynamically
- [ ] `underline` / `indicator` — thin shader strip for text links and navigation
- [ ] `fill` — for progress-style components

### 0.3 Preset Library (partially complete)

- [x] 10 named presets: plasma, fire, vortex, octograms, spinner, aurora, nebula, electric, progress-linear, progress-ring
- [ ] Categorize presets by intensity level (subtle, moderate, vivid)
- [x] `vfx="none"` to opt-out of all shader effects per component
- [ ] Document GPU performance characteristics per preset

### 0.4 VFX Storybook Playground (not started)

- [ ] Interactive Storybook controls for all shader parameters
- [ ] Live GLSL preview panel
- [ ] "Export preset" — copy config as code
- [ ] Side-by-side comparison view
- [ ] Performance metrics overlay

### 0.5 cliffy-tsukoshi Integration (partially complete)

- [x] Add `cliffy-tsukoshi` as dependency (npm link)
- [x] `useSmoothValue()` hook — smooth scalar interpolation via `GeometricState.blend()`
- [x] Progress/RingProgress use `useSmoothValue` for animated value changes
- [x] GLSL rotor library — GA rotors on the GPU side (complements JS-side cliffy-tsukoshi)
- [ ] `useGeometricState()` hook — wraps ReactiveState for React lifecycle
- [ ] `useSmoothPosition([x, y], options)` — smooth 2D position
- [ ] `useSmoothRotation(angle, options)` — smooth rotation via SLERP
- [ ] `useSmoothTransform({ position, rotation }, options)` — combined transform
- [ ] `<Motion>` wrapper component

---

## Phase 1: Foundation Components

**Status:** Partially complete
**Depends on:** Phase 0 (VFX engine) for full `vfx` prop support, but base components can start in parallel

_Complete the base primitives that all other components build on._

### 1.1 Infrastructure (done)

- [x] `useShaderCanvas` hook
- [x] Theme system (`IodineProvider`, CSS variables, color scheme)
- [x] Shader registry with `import.meta.glob` auto-discovery

### 1.2 Base Primitives

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Box` | Polymorphic base (renders any element, style props, optional `vfx`) | Optional background/border |
| `Paper` | Surface container with elevation | Shader-enhanced background/border |
| `VisuallyHidden` | Accessible screen-reader-only content | None |
| `Portal` | Render children outside parent DOM hierarchy | None |
| `FocusTrap` | Trap keyboard focus within container | None |
| `Transition` | CSS/shader transition for mount/unmount | cliffy-tsukoshi interpolation |
| `Collapse` | Animated expand/collapse | Geometric state for smooth height |

### 1.3 Buttons (expand existing)

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `ShaderButton` | Base shader button | **Done** |
| `ActionIcon` | Icon-only shader button | Background + glow |
| `CloseButton` | Dismissal button | Subtle glow on hover |
| `UnstyledButton` | Style-reset base for custom buttons | Opt-in `vfx` prop |
| `CopyButton` | Render-prop clipboard helper | None (logic only) |
| `FileButton` | Wraps children to open file picker | None (logic only) |

### 1.4 Feedback (expand existing)

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Loader` | Loading spinner | **Done** |
| `Progress` | Linear progress bar | **Done** |
| `RingProgress` | Circular progress ring | **Done** |
| `SemiCircleProgress` | Half-arc progress indicator | New shader: `progress-semi` |
| `Skeleton` | Shimmer loading placeholder | Shader-driven shimmer effect |
| `Alert` | Contextual feedback message | Shader accent border/icon glow |
| `Notification` | Notification banner | Shader glow pulse on appearance |
| `NavigationProgress` | Top-of-page route progress bar | Thin shader fill strip |

---

## Phase 2: Form Inputs

**Status:** Not started
**Depends on:** Phase 0 (VFX effect targets, especially `border`), Phase 1 (`Box`, `Input` base)

_Every input gets shader-driven focus/hover/active states via the `vfx` prop. The `border` effect target is key here — shaders animate along input edges during focus transitions._

### 2.1 Text Inputs

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Input` | Base input primitive (building block) | Border shader on focus |
| `TextInput` | Single-line text input | Inherits Input VFX |
| `Textarea` | Multi-line text input | Inherits Input VFX |
| `PasswordInput` | Text input with visibility toggle | Inherits Input VFX |
| `NumberInput` | Numeric with increment/decrement | Inherits Input VFX |
| `PinInput` | Segmented code input | Shader on active segment |
| `JsonInput` | JSON-validating textarea | Inherits Input VFX |

### 2.2 Selection Inputs

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Checkbox` | Standard checkbox | Shader-animated check state |
| `Radio` | Radio button | Shader-animated selection dot |
| `Switch` | On/off toggle | **High impact** — shader trail between states |
| `SegmentedControl` | Mutually exclusive toggles | Shader-highlighted active segment |
| `Chip` | Toggle pill | Shader selected state glow |
| `Slider` | Single-thumb slider | Shader-powered track fill |
| `RangeSlider` | Dual-thumb slider | Shader fill between thumbs |
| `AngleSlider` | Circular angle selector | Ring shader similar to RingProgress |
| `Rating` | Star rating | Shader glow on filled stars |

### 2.3 Combobox Family

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Combobox` | Headless base for all dropdown selectors | Foundation only |
| `Select` | Single-value dropdown | Shader highlight on hovered option |
| `MultiSelect` | Multi-value dropdown | Shader-tagged pills |
| `Autocomplete` | Search-filtered dropdown | Shader highlight on match |
| `TagsInput` | Free-form tag entry | Shader pill glow |
| `Pill` / `PillsInput` | Removable tag primitives | Subtle shader border |

### 2.4 Specialized Inputs

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `ColorInput` / `ColorPicker` | Color selection | Shader preview swatch |
| `FileInput` | File selector input | Focus border |
| `Fieldset` | Form grouping with legend | Optional border shader |

### 2.5 Form Management

| Export | Description |
|--------|-------------|
| `useForm` hook | Form state, validation, dirty checking, errors (equivalent to `@mantine/form`) |
| Validators | `isNotEmpty`, `isEmail`, `hasLength`, `matches`, `matchesField`, `isInRange` |

---

## Phase 3: Data Display

**Status:** Not started
**Depends on:** Phase 1 (`Box`, `Paper`)

### 3.1 Cards & Containers

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Card` | Content container with sections | Shader background surface, 3D tilt on hover (cliffy-tsukoshi Rotor) |
| `Accordion` | Collapsible sections | Shader expand/collapse indicator |
| `Spoiler` | Show/hide long content | Shader gradient fade at cutoff |

### 3.2 Visual Elements

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Badge` | Status label/tag | Shader glow, pulsing variants |
| `Avatar` | User image or initials | Shader border ring |
| `ThemeIcon` | Icon in styled container | Shader background |
| `Indicator` | Notification dot | Shader pulse animation |
| `Timeline` | Vertical event timeline | Shader connectors between nodes |
| `ColorSwatch` | Color preview circle | Shader shimmer overlay |
| `NumberFormatter` | Locale-aware number display | None (logic only) |

### 3.3 Content

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Image` | Image with fallback | Shader loading/overlay effects |
| `BackgroundImage` | Div with background image | Shader overlay blend |
| `Kbd` | Keyboard shortcut display | Subtle glow |
| `Code` | Code display | Syntax-aware shader accents |

---

## Phase 4: Navigation

**Status:** Not started
**Depends on:** Phase 1 (`Box`), Phase 0 (`underline`/`indicator` effect targets)

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Tabs` | Tabbed interface | Shader-animated active indicator (FloatingIndicator) |
| `NavLink` | Sidebar navigation link | Shader hover trail effect |
| `Breadcrumbs` | Path navigation with separators | Subtle shader separators |
| `Pagination` | Page controls | Shader active page state |
| `Stepper` | Multi-step progress | Shader state transitions between steps |
| `Burger` | Hamburger menu toggle | Shader glow on active state |
| `Anchor` | Styled link (inherits Text) | Shader underline on hover |
| `TableOfContents` | Heading-based TOC with scroll spy | Shader active indicator |
| `Tree` | Hierarchical tree view | Shader on expanded/selected nodes |

---

## Phase 5: Overlays & Modals

**Status:** Not started
**Depends on:** Phase 1 (`Portal`, `FocusTrap`, `Transition`)

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Overlay` | Dimming/blur layer | Shader dimming effect |
| `Modal` | Accessible dialog | Shader backdrop, entry/exit animation |
| `Drawer` | Slide-in side panel | Shader edge glow |
| `Dialog` | Non-modal corner dialog | Subtle shader border |
| `Popover` | Floating anchored content | Shader border glow |
| `Tooltip` | Hover information popup | Shader background shimmer |
| `Menu` | Dropdown menu | Shader item highlight on hover |
| `HoverCard` | Hover-triggered card | Shader background surface |
| `LoadingOverlay` | Full-area loader | Full shader canvas overlay |
| `Affix` | Fixed-position element | None (positioning only) |
| `FloatingIndicator` | Animated indicator between items | Shader-filled indicator element |
| ModalsManager | Programmatic `modals.open()` / `modals.close()` | Inherits Modal VFX |

---

## Phase 6: Layout & Typography

**Status:** Not started
**Depends on:** Phase 1 (`Box`)

_Most layout and typography components are functional wrappers with minimal VFX integration. Exceptions noted._

### 6.1 Layout

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Stack` | Vertical flex layout | None |
| `Group` | Horizontal flex layout | None |
| `Grid` / `SimpleGrid` | Responsive grid system | None |
| `Flex` | Flexbox wrapper | None |
| `Center` | Centering container | None |
| `Container` | Max-width wrapper | None |
| `Space` | Spacing utility | None |
| `Divider` | Visual separator | **Optional shader gradient line** |
| `AspectRatio` | Width/height ratio container | None |
| `AppShell` | App layout (header, navbar, aside, footer) | Shader accents on sections |
| `ScrollArea` | Custom scrollbars | Shader scrollbar track |

### 6.2 Typography

| Component | Description | VFX Integration |
|-----------|-------------|-----------------|
| `Text` | General purpose text | None (base component) |
| `Title` | Heading (h1-h6) | Optional shader text glow |
| `Highlight` | Highlight substrings | Shader highlight effect |
| `Mark` | Marker highlight | Shader marker glow |
| `Blockquote` | Quotation with icon | Shader accent bar |
| `List` | Ordered/unordered list | None |
| `Table` | Styled data table | None |
| `TypographyStylesProvider` | Apply Iodine styles to raw HTML | None |

---

## Phase 7: Hooks Library (`@iodine-ui/hooks`)

**Status:** Not started
**Depends on:** Can start in parallel with any phase

_Utility hooks matching `@mantine/hooks` (~73 hooks). Prioritize hooks that directly support shader/animation features._

### 7.1 High Priority — Shader-Relevant

These hooks directly support VFX, performance, and accessibility features.

| Hook | Description | Why High Priority |
|------|-------------|-------------------|
| `useHover` | Hover state detection | Drives shader hover intensity |
| `useMouse` | Mouse position tracking | Feeds shader `uMouse` uniform |
| `useMove` | Drag position tracking | Smooth drag with cliffy-tsukoshi |
| `useResizeObserver` | Element size changes | Shader canvas resize |
| `useInViewport` | Visibility detection | **Pause off-screen shaders for performance** |
| `useReducedMotion` | Detect `prefers-reduced-motion` | **Disable/simplify shaders for a11y** |
| `useMediaQuery` | Responsive breakpoints | Adjust VFX intensity by device |
| `useColorScheme` | System dark/light preference | Theme-aware shader palettes |
| `useHotkeys` | Keyboard shortcut registration | Spotlight, modals |
| `useClickOutside` | Dismiss overlays on outside click | Overlays, menus, popovers |
| `useFocusTrap` | Focus management | Modal/drawer focus containment |
| `useDisclosure` | Boolean toggle (open/close) | Modals, drawers, accordions |
| `useClipboard` | Copy to clipboard | CopyButton helper |

### 7.2 Medium Priority — State & Lifecycle

| Hook | Description |
|------|-------------|
| `useLocalStorage` / `useSessionStorage` | Persisted state |
| `useDebouncedValue` / `useDebouncedCallback` | Input debouncing |
| `useToggle`, `useCounter`, `useListState`, `useSetState` | Common state patterns |
| `usePagination`, `useSelection` | Collection UI state |
| `useId`, `useMergedRef`, `useUncontrolled` | Component internals |
| `useInterval`, `useTimeout`, `useIdle` | Timing utilities |
| `useScrollIntoView`, `useWindowScroll`, `useHeadroom` | Scroll behavior |
| `useDocumentTitle`, `useFavicon`, `useDocumentVisibility` | Document metadata |
| `useNetwork`, `useOs`, `useOrientation`, `useViewportSize` | Environment detection |
| `useForceUpdate`, `useMounted`, `usePrevious`, `useStateHistory` | Lifecycle utilities |
| `useEyeDropper`, `useFullscreen`, `usePageLeave`, `useTextSelection` | Browser APIs |
| `useFetch`, `useHash` | Data & routing |

---

## Phase 8: Extension Packages

**Status:** Not started
**Depends on:** Core library maturity (Phases 0-6)

_Each extension is a separate npm package. Build after the core component library is solid._

### `@iodine-ui/dates`

15 components for date/time selection.

| Component | Description |
|-----------|-------------|
| `DatesProvider` | Locale/settings context |
| `Calendar` | Full-featured base calendar |
| `MiniCalendar` | Compact date picker |
| `DatePicker` / `DatePickerInput` | Inline and input date selection |
| `DateInput` | Typed date input with parsing |
| `DateTimePicker` | Combined date + time |
| `MonthPicker` / `MonthPickerInput` | Month selection |
| `YearPicker` / `YearPickerInput` | Year selection |
| `TimeInput` / `TimePicker` / `TimeGrid` / `TimeValue` | Time selection |

### `@iodine-ui/charts` (shader-enhanced)

13 chart types. Unlike Mantine (built on recharts), IodineUI charts can leverage WebGL shaders for glow effects on data points, animated gradient fills, and plasma-style area fills.

| Component | Description |
|-----------|-------------|
| `AreaChart` | Filled area chart (shader gradient fill) |
| `BarChart` | Vertical/horizontal bar chart (shader glow on bars) |
| `LineChart` | Line graph (shader glow on data points) |
| `CompositeChart` | Multiple chart types combined |
| `DonutChart` | Ring-shaped proportional chart |
| `PieChart` | Circular proportional chart |
| `FunnelChart` | Conversion funnel |
| `RadarChart` | Spider/radar chart |
| `ScatterChart` | Scatter plot |
| `BubbleChart` | Variable-size scatter |
| `RadialBarChart` | Circular bar chart |
| `Sparkline` | Minimal inline chart |
| `Heatmap` | Color-coded matrix (natural shader fit) |

### Other Extension Packages

| Package | Description |
|---------|-------------|
| `@iodine-ui/notifications` | Notification system with `notifications.show()` API |
| `@iodine-ui/modals` | Modals manager with `modals.open()` / `modals.close()` |
| `@iodine-ui/spotlight` | Command palette (Ctrl+K) with shader-highlighted results |
| `@iodine-ui/dropzone` | Drag-and-drop file upload with shader accept/reject states |
| `@iodine-ui/carousel` | Slide-based carousel with shader transition effects |
| `@iodine-ui/code-highlight` | Syntax highlighting with optional shader accents |
| `@iodine-ui/tiptap` | Tiptap-based WYSIWYG rich text editor |
| `@iodine-ui/form` | `useForm` hook with validation (if not shipped in core) |

---

## Priority Matrix

| Priority | Items | Rationale |
|----------|-------|-----------|
| **Critical** | ~~Phase 0: VFX engine, presets, `vfx` prop~~ ✅ | Core differentiator — everything else depends on this |
| **Critical** | Switch, Slider, Skeleton, Tabs | Peak shader appeal — animated state transitions |
| **High** | cliffy-tsukoshi hooks (`useSmoothValue`, etc.) | Foundation for the premium animation feel |
| **High** | Card, Badge, ActionIcon, Modal, Tooltip | Most commonly used components in real apps |
| **Medium** | TextInput, Checkbox, Select, Menu | Large API surface, moderate VFX impact |
| **Medium** | Notification, Stepper, Timeline | Animated state transitions |
| **Lower** | Layout primitives, Typography, Table | Functional wrappers, minimal shader integration |
| **Deferred** | Dates, Charts, RichTextEditor, Carousel | Complex, separate packages — build after core is solid |

---

## Mantine Parity Checklist

### `@mantine/core` (~102 components)

| Category | Mantine Component | IodineUI Equivalent | Status |
|----------|------------------|---------------------|--------|
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

### Extension Packages

| Package | Scope | Status |
|---------|-------|--------|
| `@iodine-ui/hooks` | ~73 utility hooks (2 shipped: `useShaderCanvas`, `useSmoothValue`) | 🚧 |
| `@iodine-ui/dates` | 15 date/time components | 🔲 |
| `@iodine-ui/charts` | 13 chart components | 🔲 |
| `@iodine-ui/notifications` | Notification system | 🔲 |
| `@iodine-ui/modals` | Modals manager | 🔲 |
| `@iodine-ui/spotlight` | Command palette | 🔲 |
| `@iodine-ui/dropzone` | File upload zone | 🔲 |
| `@iodine-ui/carousel` | Slide carousel | 🔲 |
| `@iodine-ui/code-highlight` | Syntax highlighting | 🔲 |
| `@iodine-ui/tiptap` | Rich text editor | 🔲 |
| `@iodine-ui/form` | Form state management | 🔲 |

---

Legend: ✅ Complete | 🚧 In Progress | 🔲 Planned
