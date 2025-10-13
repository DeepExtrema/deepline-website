# Deepline Repository Inventory

**Generated:** 2025-01-11  
**Purpose:** Complete inventory of components, tokens, modules, and design references for Metal-Glass Warm/Dark Matte Initiative

---

## 1. Card/Box/Tile Components

### 1.1 Problem Items (`.problem-item`)
- **Location:** `index.html` lines 59-87
- **Count:** 4 instances
- **Variants:** None (inline HTML, no component abstraction)
- **Props (implicit):**
  - Icon (infinity symbol image)
  - Heading (h3)
  - Description (p)
- **Where Used:** Problem section
- **Current Styling:**
  ```css
  .problem-item {
    text-align: center;
    padding: 24px 16px;
    border-radius: 12px;
    background-image: radial gradients;
    box-shadow: inset border + depth shadow;
  }
  ```
- **Status:** ⚠️ **DUPLICATE** - No shared component, inline repetition

### 1.2 Capability Cards (`.capability-card`)
- **Location:** `index.html` lines 89-112
- **Count:** 4 instances
- **Variants:** None
- **Props (implicit):**
  - Heading (h3) - with accent color
  - Description (p)
- **Where Used:** Capabilities/Product section
- **Current Styling:**
  ```css
  .capability-card {
    background: var(--bg-surface);
    padding: 32px;
    border-radius: 16px;
    box-shadow: multi-layer (inset + depth);
    background-image: radial gradients;
  }
  ```
- **Status:** ⚠️ **DUPLICATE** - Similar to problem-item but different padding/shadow

### 1.3 Playbook Cards (`.playbook-card`)
- **Location:** `index.html` lines 141-181
- **Count:** 3 instances
- **Variants:** None
- **Props (implicit):**
  - Heading (h3)
  - Subtitle/prevents (p.playbook-prevents, italic)
  - Bullets (ul.playbook-bullets with custom arrows)
  - Badge (span.badge)
  - CTA (a.btn.btn-outline)
- **Where Used:** Agent Playbooks section
- **Current Styling:**
  ```css
  .playbook-card {
    /* Same base as capability-card */
    display: flex;
    flex-direction: column;
  }
  .playbook-bullets li::before { content: "→"; color: var(--accent); }
  ```
- **Status:** ⚠️ **DUPLICATE** - Most complex card variant, flex layout

### 1.4 Step Cards (`.step`)
- **Location:** `index.html` lines 114-139
- **Count:** 3 instances
- **Variants:** None
- **Props (implicit):**
  - Number (div.step-number with gradient background)
  - Heading (h3)
  - Description (p)
- **Where Used:** How It Works section
- **Current Styling:**
  ```css
  .step {
    text-align: center;
    padding: 24px 16px;
    border-radius: 12px;
    /* Similar surface treatment to problem-item */
  }
  .step-number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent-alt));
  }
  ```
- **Status:** ⚠️ **DUPLICATE** - Unique numbered variant

### 1.5 Security Items (`.security-item`)
- **Location:** `index.html` lines 194-212
- **Count:** 3 instances
- **Variants:** None
- **Props (implicit):**
  - Heading (h3) - with accent color
  - Description (p)
- **Where Used:** Security & Compliance section
- **Current Styling:**
  ```css
  .security-item {
    text-align: center;
    padding: 24px 16px;
    border-radius: 12px;
    /* Similar to step/problem-item */
  }
  .security-item h3 { color: var(--accent); }
  ```
- **Status:** ✅ **Closest to target style** (per design notes)

### 1.6 Install Footprint Card (`.card`)
- **Location:** `index.html` lines 214-225
- **Count:** 1 instance
- **Variants:** None
- **Props (implicit):**
  - Heading (h3) - with accent color
  - Bullets (ul with custom arrows)
- **Where Used:** Install Footprint section
- **Current Styling:**
  ```css
  .install-footprint .card {
    background: var(--bg-surface);
    border-radius: 16px;
    padding: 32px;
    box-shadow: multi-layer;
    background-image: radial gradients;
    max-width: 800px;
    margin: 0 auto;
  }
  .card li::before { content: "→"; color: var(--accent); }
  ```
- **Status:** ⚠️ **DUPLICATE** - Single instance but similar pattern

---

## 2. Current Color Tokens

### 2.1 CSS Variables (`:root`)
**Location:** `styles.css` lines 7-17

```css
:root {
  --bg-primary: #0B0B0C;    /* Near-black background */
  --bg-surface: #15161A;    /* Graphite surface */
  --text-primary: #ECEFF4;  /* Silver-white text */
  --text-secondary: #A9B0BA; /* Secondary text */
  --accent: #00B5D8;        /* Cyan accent */
  --accent-alt: #2E7CF6;    /* Ultramarine alternative */
  --success: #4ADE80;       /* Success green */
  --warning: #FBBF24;       /* Warning yellow */
  --danger: #F87171;        /* Danger red */
}
```

### 2.2 Token Usage Patterns
- **Backgrounds:** Primarily `--bg-primary` and `--bg-surface`
- **Text:** `--text-primary` for headings, `--text-secondary` for body
- **Interactive:** `--accent` for CTAs, hover states, highlights
- **Gradients:** Hardcoded rgba values (not tokenized)
- **Shadows:** Hardcoded rgba values (not tokenized)

### 2.3 Missing Tokens
- ❌ Metal-glass specific tokens (highlights, silver midtones, shadows, bloom)
- ❌ Material property tokens (metalness, roughness, IOR, etc.)
- ❌ Radius tokens (currently hardcoded: 8px, 12px, 16px)
- ❌ Shadow presets (currently inline multi-layer definitions)
- ❌ Stroke/border tokens
- ❌ Theme variants (no data-attribute system)

---

## 3. Three.js Modules

### 3.1 `js/three-setup.js`
**Lines:** 1-122  
**Purpose:** WebGL detection, renderer initialization, animation helpers  
**Exports:**
- `isWebGLAvailable()` - WebGL capability check
- `prefersReducedMotion()` - Accessibility check
- `createRenderer(canvas, options)` - Three.js renderer factory
- `lazyLoadThree(element, callback)` - Intersection Observer lazy loading
- `handleResize(renderer, camera, composer)` - Responsive canvas sizing
- `createAnimationLoop(callback)` - RAF loop manager

**Features:**
- ✅ WebGL detection
- ✅ sRGB color space
- ✅ ACES Filmic tone mapping
- ✅ Lazy loading via Intersection Observer
- ✅ Pixel ratio capping (2x max)
- ❌ **DOES NOT EXIST:** RoomEnvironment/PMREM setup

### 3.2 `js/materials.js`
**Lines:** 1-161  
**Purpose:** Token-driven PBR material presets, lighting setup  
**Exports:**
- `TOKENS` - Design color palette (cool silver theme)
- `PARAMS` - Tweakable material parameters
- `createSilverMaterial(THREE)` - Cool silver MeshPhysicalMaterial
- `createGlassMaterial(THREE)` - Glass variant material
- `createMicroTextureNormal(THREE, strength)` - Subtle noise normal map
- `applyMicroTexture(material, THREE, strength)` - Apply texture to material
- `createLighting(THREE, scene)` - 4-light setup (key, counter, fill, hemi)

**Current Tokens:**
```javascript
export const TOKENS = {
  highlight1: 0xE9F1F6,
  highlight2: 0xCFE0EA,
  silver1: 0xA6B7C3,
  silver2: 0x8C9AA6,
  shadow1: 0x47525B,
  shadow2: 0x2B3238,
  bloom: 0xDDEAF3,
  silverBase: 0x9CAFB9,
  glassBase: 0xCFE0EA,
  bg: 0x000000
};
```

**Current Params (Cool Silver):**
```javascript
SILVER_METALNESS: 0.95,
SILVER_ROUGHNESS: 0.12,
SILVER_CLEARCOAT: 0.25,
SILVER_CLEARCOAT_ROUGHNESS: 0.03,
BLOOM_THRESHOLD: 0.94,
BLOOM_STRENGTH: 0.28,
BLOOM_RADIUS: 0.5,
RIM_INTENSITY: 0.85,
COUNTER_RIM_INTENSITY: 0.42,
FILL_INTENSITY: 0.15
```

**Missing:**
- ❌ Warm matte material variant
- ❌ Theme-aware material selection
- ❌ RoomEnvironment setup function
- ❌ PMREM generator integration

### 3.3 `js/MetalGlassHero.js`
**Lines:** 1-174  
**Purpose:** Main hero 3D infinity symbol (dual torus approach)  
**Class:** `MetalGlassHero`  
**Methods:**
- `constructor(canvasElement)`
- `async init()` - Setup scene, camera, geometry, post-processing
- `createInfinitySymbol()` - Two TorusGeometry positioned as ∞
- `setupPostProcessing()` - EffectComposer + UnrealBloomPass
- `animate()` - Rotation loop
- `handleResize()` - Responsive sizing
- `dispose()` - Cleanup

**Geometry:**
- **Current:** Two `TorusGeometry` (radius 0.8, tube 0.12, 64/128 segments)
- **Positioned:** Left at x=-0.9, right at x=0.9, both rotated 90° on Y
- **Material:** Cool silver (metalness 0.95, roughness 0.12)
- **Animation:** Slow rotation (0.15 rad/s, or 0 if prefers-reduced-motion)

**Missing:**
- ❌ True lemniscate curve (using torus approximation instead)
- ❌ TubeGeometry with custom curve
- ❌ Theme-aware material
- ❌ RoomEnvironment/PMREM reflections

### 3.4 `js/MetalGlyph.js`
**Lines:** 1-152  
**Purpose:** Lightweight renderer for icons/small logos  
**Class:** `MetalGlyph`  
**Options:**
- `size` - 'small', 'medium', 'large'
- `animate` - Boolean (default true)
- `hover` - Boolean (default true)

**Geometry:** Simplified `TorusKnotGeometry` (performance optimized)  
**Usage:** ❌ **NOT CURRENTLY USED** in site (no `[data-metal-glyph]` elements)

### 3.5 `js/metal-glass-init.js`
**Lines:** 1-107  
**Purpose:** Integration layer, orchestrates hero/glyph initialization  
**Exports:**
- `initHero()` - Initialize hero canvas
- `initGlyphs()` - Initialize glyph canvases (if any)
- Auto-executes `init()` on DOMContentLoaded

**Features:**
- ✅ WebGL availability check
- ✅ Loading states (`.loading`, `.loaded`, `.fallback`)
- ✅ Graceful fallback to static images
- ✅ Lazy loading via viewport intersection
- ❌ **DOES NOT EXIST:** Hero variant switcher
- ❌ **DOES NOT EXIST:** Theme synchronization

---

## 4. Main JavaScript (`main.js`)

**Lines:** 1-256  
**Purpose:** Particle background, form handling, scroll effects, analytics

**Functions:**
- `initParticleBackground()` - Three.js particle network (150 particles, connection lines)
- `track(eventName, props)` - Analytics logging
- Intersection Observer for reveal-on-scroll
- Nav auto-hide on scroll
- Form validation and submission
- Smooth scroll for anchor links

**Particle System:**
- 150 particles with velocity drift
- Connection lines when distance < 150 units
- Fades lines based on distance
- Independent from hero Three.js scene

---

## 5. Design References (Attached Assets)

### 5.1 Metal-Glass Style Language (`Deepline Metal-Glass Style Language.txt`)
**Source of truth for visual design:**
- Mood: Cold, surgical, quiet power (zero warmth)
- Material: Smoked chrome glass-metal hybrid
- Contrast target: ~6:1 (peak to average)
- Finish: High gloss, roughness 0.08–0.14
- Micro-texture: 6–12% visibility
- Lighting: Key rim (UL/front) + counter rim (UR/back, 40-60%) + soft fill
- Bloom: Top 1-2% brightest pixels only

### 5.2 Content & Messaging (`Pasted--Deepline-dev-Purpose...txt`)
**Marketing copy source:**
- ICP: ML engineers, technical founders, Heads of ML
- Hero H1: "Secure Overmind early access. Let AI command your ML ops."
- Value prop: Vendor-agnostic MLOps control plane
- Sections: Hero, Problem→Outcome, What is, How it works, Playbooks, Why now, Security, Early Access

### 5.3 Quick Reference (`Pasted-Quick-Reference-One-pager...txt`)
**Material/finish specs:**
- Color swatches with exact hex values
- PBR shader targets (Blender Principled BSDF equivalent)
- 2D execution rules (Photoshop/Figma layer stack)
- QA checklist (midtones, Fresnel, bloom, texture)
- Wordmark treatment (matte silver, quieter than symbol)

### 5.4 Polish Punchlist (`Pasted-Perfect-Here-s-a-tight...txt`)
**Implementation tasks (some already done):**
- ✅ Enlarge logo (currently 56px, spec calls for 44/36/32)
- ✅ Hero copy tightened
- ✅ Integrations logo strip (partially - logos exist in assets)
- ✅ Install footprint card
- ✅ Form validation
- ⚠️ Infinity icons (using PNG from assets)
- ⚠️ Analytics event tracking (partial implementation)

### 5.5 Replit Instructions (`Pasted-Below-is-a-complete...txt` × 3)
**Build/deploy guidance:**
- Stack: Vanilla HTML/CSS/JS on port 5000
- Assets: Logo, infinity PNG, Overmind diagram, integration logos
- Styling: Dark graphite, silver text, cyan accents
- Form: Formspree/Google Form backend
- Analytics: PostHog/Umami/GA4 ready
- Performance: <80KB CSS/JS budget

### 5.6 Design Tokens from Attached Assets

**Confirmed Color Palette:**
```
Background: #0B0B0C (near-black)
Surface: #15161A (graphite)
Text Primary: #ECEFF4 (silver-white)
Text Secondary: #A9B0BA
Accent: #00B5D8 (cyan) or #2E7CF6 (ultramarine)
Success: #4ADE80
Warning: #FBBF24
Danger: #F87171
```

**Metal-Glass Tokens (from style guide):**
```
Highlight 1: #E9F1F6
Highlight 2: #CFE0EA
Silver 1: #A6B7C3
Silver 2: #8C9AA6
Shadow 1: #47525B
Shadow 2: #2B3238
Bloom: #DDEAF3 @ 10-18%
```

**Warm Matte Variant (from initiative):**
```
Base: #8F8A83 (warm dark silver)
Keep highlights cool (no warm bloom)
Metalness: 0.12
Roughness: 0.28
IOR: 1.45
Transmission: 0.16
Thickness: 0.36
Specular Intensity: 0.55
Clearcoat: 0.08
Clearcoat Roughness: 0.12
```

---

## 6. Asset Inventory

### 6.1 Images
- `attached_assets/deepline_silver_logo_with_back-removebg-preview.png` - Nav logo
- `attached_assets/Infinity_No_Back-removebg-preview.png` - Icon (used 4x in problem section)
- `attached_assets/Overmind-circle-schema.png` - Hero fallback image
- Integration logos: AWS, Azure, GCP, MLflow, W&B, Jenkins, Prometheus, PagerDuty, Slack (all PNG, "No_Back" variants)
- `attached_assets/isometric-overmind_1760149751513.png` - OG/meta image

### 6.2 Documents
- `Deepline Metal-Glass Style Language.txt` - Design system source of truth
- `METAL-GLASS-INTEGRATION.md` - Three.js implementation guide
- `PR-SUMMARY.md` - Pull request documentation
- `QA-CHECKLIST.md` - Visual QA checklist
- `favicon.svg` - Site favicon

---

## 7. Component Abstraction Needs

### 7.1 **DOES NOT EXIST:**
- ❌ Unified InfoCard component (all cards are inline HTML)
- ❌ Token-based design system (CSS variables exist but limited)
- ❌ Theme switcher (no data-attribute theme system)
- ❌ RoomEnvironment/PMREM in Three.js setup
- ❌ Warm matte material variant
- ❌ Theme-aware material selection
- ❌ Lemniscate curve geometry
- ❌ Overmind orb hero variant
- ❌ Hero variant switcher
- ❌ Component documentation system

### 7.2 **DUPLICATE PATTERNS:**
- ⚠️ 6 different card styles (problem-item, capability-card, playbook-card, step, security-item, card)
- ⚠️ Similar box-shadow definitions (inset borders + depth shadows)
- ⚠️ Similar radial gradient backgrounds
- ⚠️ Custom list bullet styling (→ arrows) repeated 2x
- ⚠️ Border-radius values hardcoded throughout (8px, 12px, 16px)

### 7.3 **Refactor Targets:**
All card variants should consolidate into single `InfoCard` component with:
- Variant prop: `default | feature | playbook | step`
- Icon/image support
- Optional numbered badge
- Optional bullet list
- Optional CTA
- Token-driven styling

---

## 8. Browser/Environment Notes

### 8.1 Current Support
- **Three.js:** v0.160.0 (CDN)
- **Target Browsers:** Chrome 90+, Firefox 88+, Safari 15+, Edge 90+
- **Mobile:** iOS 14+, Android Chrome 90+
- **Fallback:** Static images when WebGL unavailable

### 8.2 Performance Metrics
- **Current Hero:** ~32K triangles (dual torus @ 64×128 segments each)
- **Target FPS:** 60fps desktop, 30fps+ mobile
- **Current Load:** ~635KB Three.js + modules (lazy loaded)
- **CSS/JS Budget:** <80KB (main.js + styles.css)

---

## 9. Gaps & Priorities

### 9.1 Critical for Warm/Dark Matte Initiative
1. ✅ **P0:** Create token system (`ui/foundation/tokens.css`)
2. ✅ **P0:** Build theme switcher (`js/theme-switcher.js`)
3. ✅ **P0:** Add warm matte material to `js/materials.js`
4. ✅ **P0:** Create unified InfoCard component
5. ✅ **P0:** Prototype lemniscate geometry (JSFiddle)
6. ✅ **P0:** Prototype Overmind orb (JSFiddle)

### 9.2 High Priority
7. ✅ **P1:** Port lemniscate to production (`js/MetalGlassLemniscate.js`)
8. ✅ **P1:** Port orb to production (`js/MetalGlassOrb.js`)
9. ✅ **P1:** Add RoomEnvironment/PMREM to `js/materials.js`
10. ✅ **P1:** Update hero init to support variants

### 9.3 Medium Priority
11. ✅ **P2:** Replace all inline cards with InfoCard instances
12. ✅ **P2:** Migrate hardcoded colors to CSS variables
13. ✅ **P2:** Document theme system (`docs/theme-system.md`)
14. ✅ **P2:** Update integration guide

---

## 10. Cross-Reference Map

| Component | Location | Token Dependencies | Three.js Dependencies | Status |
|-----------|----------|-------------------|----------------------|--------|
| `.problem-item` | index.html:59-87 | bg-surface, text, accent | None | Replace with InfoCard |
| `.capability-card` | index.html:89-112 | bg-surface, text, accent | None | Replace with InfoCard |
| `.playbook-card` | index.html:141-181 | bg-surface, text, accent | None | Replace with InfoCard |
| `.step` | index.html:114-139 | bg-surface, accent, accent-alt | None | Replace with InfoCard |
| `.security-item` | index.html:194-212 | bg-surface, text, accent | None | Replace with InfoCard |
| `.card` | index.html:214-225 | bg-surface, text, accent | None | Replace with InfoCard |
| `MetalGlassHero` | js/MetalGlassHero.js | TOKENS, PARAMS | three-setup, materials | Update to theme-aware |
| Particle BG | main.js:142-255 | accent | Three.js core | Keep separate |

---

**End of Inventory**  
Next steps: Proceed to Phase 2 (Token System Creation)

