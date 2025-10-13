# Module Dependency Map
**Deepline Metal-Glass Integration**  
**Status**: Cool Silver Theme (Locked)  
**Last Updated**: 2025-10-12

---

## Module Initialization Order

```
1. main.js (DOM ready)
   └─> initParticleBackground() [SKIPPED - THREE not available]

2. js/metal-glass-init.js (DOM ready)
   ├─> js/three-setup.js (utilities)
   ├─> js/MetalGlassHero.js (legacy variant)
   ├─> js/MetalGlassLemniscate.js (default variant)
   ├─> js/MetalGlassOrb.js (orb variant)
   └─> js/MetalGlyph.js (icon renderer)
       └─> Lazy loaded via IntersectionObserver
```

---

## File-by-File Audit

### `main.js`
**Type**: Non-module script  
**Dependencies**: 
- Expects global `THREE` (NOT AVAILABLE - causes error, now guarded)

**Exports**: None  
**Initialization**: `DOMContentLoaded`

**Functions**:
- `initParticleBackground()` - **DEAD CODE** - THREE not available, now safely skipped
- `track(eventName, props)` - Analytics logging (console only)
- Event listener setup for `data-event` attributes

**Global Variables**:
- None

**Issues**:
- ⚠️ **DEAD CODE**: `initParticleBackground()` never executes (THREE undefined)
- ⚠️ **RECOMMENDATION**: Remove particle background code or convert to ES module

**DOM Integration**:
- `#particle-canvas` (unused)
- `[data-event]` elements (click tracking)
- `.waitlist-form` (form submit)
- `[data-calendly]` button (Calendly trigger)

---

### `js/three-setup.js`
**Type**: ES Module  
**Dependencies**: 
- External: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`

**Exports**:
- `isWebGLAvailable()` - WebGL detection
- `prefersReducedMotion()` - Accessibility check
- `createRenderer(canvas, options)` - THREE.js renderer factory
- `lazyLoadThree(element, callback)` - IntersectionObserver lazy loader
- `handleResize(renderer, camera, composer?)` - Resize handler
- `createAnimationLoop(callback)` - RAF abstraction

**Initialization**: N/A (utility module)

**Circular Dependencies**: None

**Issues**: None ✅

---

### `js/materials.js`
**Type**: ES Module  
**Dependencies**: None (THREE passed as parameter)

**Exports**:
- `TOKENS` - Color palette constants
- `PARAMS` - PBR material parameters
- `createSilverMaterial(THREE)` - Cool silver MeshPhysicalMaterial
- `createGlassMaterial(THREE)` - Glass material variant
- `createMicroTextureNormal(THREE, strength)` - Noise normal map generator
- `applyMicroTexture(material, THREE, strength)` - Texture applicator
- `createLighting(THREE, scene)` - Rim/fill light setup
- `createEnvironment(THREE, renderer, scene)` - PMREM + RoomEnvironment

**Initialization**: N/A (factory functions)

**Circular Dependencies**: None

**Issues**: None ✅

**Removed (Phase 1)**:
- ~~`createWarmMatteMaterial(THREE)`~~ ✅ Deleted
- ~~`createThemeMaterial(THREE)`~~ ✅ Deleted

---

### `js/MetalGlassHero.js`
**Type**: ES Module (Class)  
**Dependencies**:
- `./three-setup.js`
- `./materials.js`
- External: EffectComposer, RenderPass, UnrealBloomPass

**Exports**:
- `MetalGlassHero` class

**Initialization**: `await hero.init()`

**Constructor Parameters**:
- `canvasElement` - Target canvas DOM element

**Methods**:
- `init()` - Async initialization
- `createInfinitySymbol()` - Dual-torus geometry
- `setupPostProcessing()` - Bloom pass
- `animate()` - Animation loop
- `handleResize()` - Resize handler
- `dispose()` - Cleanup (geometry, materials, renderer, composer)

**Hero Variant**: **LEGACY** (dual-torus approximation of ∞)

**Theme Awareness**: None (locked to cool silver) ✅

**Issues**: None ✅

---

### `js/MetalGlassLemniscate.js`
**Type**: ES Module (Class)  
**Dependencies**:
- `./three-setup.js`
- `./materials.js`
- External: EffectComposer, RenderPass, UnrealBloomPass, RoomEnvironment

**Exports**:
- `MetalGlassLemniscate` class

**Initialization**: `await lemniscate.init()`

**Constructor Parameters**:
- `canvasElement` - Target canvas DOM element

**Methods**:
- `init()` - Async initialization
- `createLemniscate()` - True parametric lemniscate via TubeGeometry
- `setupEnvironment()` - PMREM environment map
- `setupPostProcessing()` - Bloom pass
- `animate()` - Animation loop
- `handleResize()` - Resize handler
- `dispose()` - Cleanup (geometry, materials, renderer, composer, envMap)

**Hero Variant**: **LEMNISCATE** (default, mathematically correct ∞)

**Theme Awareness**: None (locked to cool silver) ✅

**Internal Helpers**:
- `createLemniscateCurve(THREE)` - Factory for THREE.Curve subclass

**Issues**: None ✅

**Removed (Phase 1)**:
- ~~`updateTheme()` method~~ ✅ Deleted
- ~~Theme change event listener~~ ✅ Deleted

---

### `js/MetalGlassOrb.js`
**Type**: ES Module (Class)  
**Dependencies**:
- `./three-setup.js`
- `./materials.js`
- External: EffectComposer, RenderPass, UnrealBloomPass, RoomEnvironment

**Exports**:
- `MetalGlassOrb` class

**Initialization**: `await orb.init()`

**Constructor Parameters**:
- `canvasElement` - Target canvas DOM element

**Methods**:
- `init()` - Async initialization
- `createOrb()` - Sphere + ring + connection nodes
- `createConnections()` - 4 pulsing connection nodes + lines
- `setupLabels()` - HTML overlay labels for connections
- `updateLabels()` - 3D→2D projection for label positioning
- `setupEnvironment()` - PMREM environment map
- `setupPostProcessing()` - Bloom pass
- `animate()` - Animation loop with pulsing nodes
- `handleResize()` - Resize handler
- `dispose()` - Cleanup (geometry, materials, renderer, composer, envMap, labels)

**Hero Variant**: **ORB** (Overmind sphere with connections)

**Theme Awareness**: None (locked to cool silver) ✅

**DOM Integration**:
- Creates `.orb-label-container` overlay div
- Creates 4 label elements (positioned via projection)

**Issues**: None ✅

**Removed (Phase 1)**:
- ~~`updateTheme()` method~~ ✅ Deleted
- ~~Theme change event listener~~ ✅ Deleted

---

### `js/MetalGlyph.js`
**Type**: ES Module (Class)  
**Dependencies**:
- `./three-setup.js`
- `./materials.js`

**Exports**:
- `MetalGlyph` class

**Initialization**: `await glyph.init()`

**Constructor Parameters**:
- `canvasElement` - Target canvas DOM element
- `options` - { size, animate, hover }

**Methods**:
- `init()` - Async initialization
- `createGlyphGeometry()` - Simplified TorusKnot for icons
- `setupLighting()` - Minimal lighting (key + fill only, no bloom)
- `setupHoverInteraction()` - Mouse enter/leave listeners
- `animate()` - Micro-rotation on hover
- `handleResize()` - Resize handler
- `dispose()` - Cleanup (geometry, material, renderer)

**Hero Variant**: N/A (icon/logo renderer)

**Theme Awareness**: None (locked to cool silver) ✅

**Performance**: Optimized for low power (`powerPreference: 'low-power'`)

**Issues**: None ✅

---

### `js/metal-glass-init.js`
**Type**: ES Module (Orchestrator)  
**Dependencies**:
- `./three-setup.js`
- `./MetalGlassHero.js`
- `./MetalGlassLemniscate.js`
- `./MetalGlassOrb.js`
- `./MetalGlyph.js`

**Exports**:
- `initHero` - Initialize hero variant
- `initGlyphs` - Initialize all glyphs
- `switchHero` - Switch between hero variants
- `HERO_VARIANTS` - Variant constants
- `getCurrentHeroVariant` - Get active variant from localStorage

**Initialization**: Auto-runs on `DOMContentLoaded` or immediately if already loaded

**Constants**:
- `HERO_VARIANTS = { LEGACY, LEMNISCATE, ORB }`
- `STORAGE_KEY_HERO = 'deepline-hero-variant'`
- `DEFAULT_HERO = HERO_VARIANTS.LEMNISCATE`

**Functions**:
- `getCurrentHeroVariant()` - Read from localStorage or return default
- `setHeroVariant(variant)` - Persist to localStorage
- `initHero(variant?)` - Initialize specified hero variant
- `switchHero(variant)` - Dispose current + init new hero
- `initGlyphs()` - Initialize all `[data-metal-glyph]` canvases
- `useFallback(container)` - Show static image on WebGL failure
- `init()` - Main entry point (lazy load via IntersectionObserver)

**Global State**:
- `currentHeroInstance` - Active hero instance
- `currentHeroVariant` - Active variant name

**DOM Integration**:
- `#metal-glass-hero` canvas
- `[data-metal-glyph]` canvases
- `.metal-glass-container` fallback containers

**Theme Awareness**: None (theme switching removed) ✅

**Issues**: None ✅

**Removed (Phase 1)**:
- ~~Theme change event listeners~~ ✅ N/A (never existed here)

---

## Dead Code Summary

| Location | Code | Status | Recommendation |
|----------|------|--------|----------------|
| `main.js` | `initParticleBackground()` | DEAD - THREE undefined | ❌ Remove or convert to ES module |
| `main.js` | `#particle-canvas` lookup | DEAD - unused | ❌ Remove |

---

## Missing Error Handling

| Location | Issue | Severity | Recommendation |
|----------|-------|----------|----------------|
| `main.js` | Form submit has no error recovery | Low | Add try/catch around fetch |
| `js/metal-glass-init.js` | `switchHero()` doesn't handle localStorage errors | Low | Already wrapped in try/catch ✅ |

---

## Circular Dependency Risks

**None detected** ✅

All modules follow unidirectional dependency flow:
```
metal-glass-init.js
    ↓
Hero Classes (MetalGlassHero, MetalGlassLemniscate, MetalGlassOrb, MetalGlyph)
    ↓
Utilities (three-setup.js, materials.js)
    ↓
External (Three.js CDN)
```

---

## Global Variable Usage

| Variable | Location | Type | Scope | Issue |
|----------|----------|------|-------|-------|
| `THREE` (expected) | `main.js:146` | Undefined | ❌ ERROR | Guarded with check now ✅ |
| `currentHeroInstance` | `js/metal-glass-init.js` | Module-private | ✅ OK | None |
| `currentHeroVariant` | `js/metal-glass-init.js` | Module-private | ✅ OK | None |

---

## External CDN Dependencies

| Resource | Version | Usage | Fallback |
|----------|---------|-------|----------|
| `three@0.160.0/build/three.module.js` | 0.160.0 | Core library | ❌ None - show static fallback |
| `three@0.160.0/examples/jsm/postprocessing/EffectComposer.js` | 0.160.0 | Post-processing | ❌ None - hero init fails gracefully |
| `three@0.160.0/examples/jsm/postprocessing/RenderPass.js` | 0.160.0 | Post-processing | ❌ None |
| `three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js` | 0.160.0 | Bloom effect | ❌ None |
| `three@0.160.0/examples/jsm/environments/RoomEnvironment.js` | 0.160.0 | PMREM env | ⚠️ Warns, continues without envMap |

**Recommendation**: Consider bundling Three.js for production to avoid CDN dependency.

---

## Asset Dependencies

### Local Assets
- `Deepline logos NO BACK/*.png` - Logo images
- `attached_assets/*.png, *.jpg` - Design mockups
- `favicon.svg` - Site favicon

### Textures
- Micro-texture: Generated procedurally (no external file) ✅

### Environment Maps
- Generated via `RoomEnvironment` (no external file) ✅

---

## Summary

✅ **All modules properly isolated**  
✅ **No circular dependencies**  
✅ **Warm-matte theme code fully removed**  
✅ **Cool silver locked as single theme**  
⚠️ **Dead code in main.js (particle background)**  
✅ **Error handling adequate**  
✅ **Graceful fallbacks in place**

**Total Modules**: 7  
**Total Classes**: 4  
**Total Utility Functions**: 15  
**Lines of Code**: ~1,200 (excluding comments)

