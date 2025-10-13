# Deepline Theme System

## Overview

The Deepline theme system provides two distinct visual themes based on the Metal-Glass Style Language:

1. **Cool Silver** (default) - High-gloss metallic with surgical precision
2. **Warm Matte** - Warm dark silver with Applied-style restraint

Both themes share the same foundational design tokens but differ in material properties, color temperature, and finish characteristics.

---

## Architecture

### Token System (`ui/foundation/tokens.css`)

**Shared Foundation (theme-agnostic):**
- Radii: 8px → 16px scale
- Shadows: Inner, edge, depth, glow variations
- Strokes: Subtle → strong opacity levels
- Transitions: Fast (0.12s) → slow (0.6s)
- Spacing: 8px → 64px scale
- Typography: Font families, sizes, line heights

**Theme-Specific Tokens:**
- Color palette (highlights, silvers, shadows)
- Material properties (metalness, roughness, IOR, etc.)
- Bloom parameters (threshold, strength, radius)
- Lighting intensities (rim, counter-rim, fill)
- Gradients (surface, card, button, shimmer)

---

## Theme Comparison

| Property | Cool Silver | Warm Matte |
|----------|-------------|------------|
| **Body Color** | #9CAFB9 (cool) | #8F8A83 (warm) |
| **Highlights** | #E9F1F6 (cool) | #E9F1F6 (cool) |
| **Metalness** | 0.95 (high) | 0.12 (low) |
| **Roughness** | 0.12 (glossy) | 0.28 (matte) |
| **Transmission** | 0.30 | 0.16 |
| **Clearcoat** | 0.25 | 0.08 |
| **Bloom Threshold** | 0.94 | 0.96 (higher) |
| **Bloom Strength** | 0.28 | 0.22 (weaker) |
| **Rim Intensity** | 0.85 | 0.72 (softer) |

---

## Usage

### HTML Setup

Include tokens and switcher CSS in `<head>`:

```html
<link rel="stylesheet" href="ui/foundation/tokens.css">
<link rel="stylesheet" href="ui/foundation/theme-switcher.css">
```

Set initial theme on `<html>` element:

```html
<html lang="en" data-theme="cool-silver">
```

Load theme switcher (before closing `</body>`):

```html
<script type="module" src="js/theme-switcher.js"></script>
```

### JavaScript API

```javascript
import { 
  setTheme, 
  toggleTheme, 
  getCurrentTheme,
  getThemeProperties,
  createThemeSwitcher 
} from './js/theme-switcher.js';

// Set specific theme
setTheme('warm-matte');

// Toggle between themes
toggleTheme();

// Get current theme
const current = getCurrentTheme(); // 'cool-silver' or 'warm-matte'

// Get theme properties for Three.js
const props = getThemeProperties();
console.log(props.material.metalness); // 0.95 or 0.12

// Create UI control
const navLinks = document.querySelector('.nav-links');
createThemeSwitcher(navLinks, 'button'); // or 'toggle'
```

### Listening to Theme Changes

```javascript
window.addEventListener('theme-change', (e) => {
  const { theme, prevTheme } = e.detail;
  console.log(`Theme changed: ${prevTheme} → ${theme}`);
  
  // Update Three.js materials
  if (myThreeScene) {
    myThreeScene.updateMaterials(theme);
  }
});
```

---

## CSS Usage

### Using Token Variables

```css
.my-card {
  background: var(--mg-bg-surface);
  background-image: var(--mg-gradient-card);
  border-radius: var(--mg-radius-lg);
  box-shadow: 
    var(--mg-shadow-inner),
    var(--mg-shadow-edge),
    var(--mg-shadow-depth);
  color: var(--mg-text-primary);
}

.my-button {
  background: var(--mg-gradient-button);
  padding: var(--mg-space-md) var(--mg-space-lg);
  border-radius: var(--mg-radius-md);
  transition: var(--mg-transition-fast);
}
```

### Helper Classes

```css
/* Pre-styled surface with gradient */
.mg-surface {
  /* Applies bg-surface + card gradient + shadows */
}

/* Subtle surface without gradients */
.mg-surface-subtle {
  /* Applies bg-surface + inner shadow only */
}

/* Glass effect with blur */
.mg-glass-effect {
  /* Applies backdrop-filter blur + translucent bg */
}

/* Animated shimmer effect */
.mg-shimmer {
  /* Applies sliding shimmer gradient */
}

/* Micro-texture overlay (≤10% visibility) */
.mg-micro-texture {
  /* Adds subtle noise texture via ::before pseudo */
}

/* Gradient text */
.mg-text-gradient {
  /* Applies gradient from highlight1 to silver1 */
}
```

---

## Three.js Integration

### Material Creation

```javascript
import { createThemeMaterial } from './js/materials.js';

// Automatically uses current theme
const material = createThemeMaterial(THREE);

// Or create specific theme material
import { createSilverMaterial, createWarmMatteMaterial } from './js/materials.js';

const coolMaterial = createSilverMaterial(THREE);
const warmMaterial = createWarmMatteMaterial(THREE);
```

### Sync Three.js with Theme Changes

```javascript
import { getThemeProperties } from './js/theme-switcher.js';

window.addEventListener('theme-change', () => {
  const props = getThemeProperties();
  
  // Update material properties
  myMaterial.metalness = props.material.metalness;
  myMaterial.roughness = props.material.roughness;
  myMaterial.ior = props.material.ior;
  myMaterial.transmission = props.material.transmission;
  myMaterial.clearcoat = props.material.clearcoat;
  myMaterial.clearcoatRoughness = props.material.clearcoatRoughness;
  myMaterial.envMapIntensity = props.material.envMapIntensity;
  myMaterial.needsUpdate = true;
  
  // Update bloom pass
  if (bloomPass) {
    bloomPass.threshold = props.bloom.threshold;
    bloomPass.strength = props.bloom.strength;
    bloomPass.radius = props.bloom.radius;
  }
  
  // Update lighting
  keyRimLight.intensity = props.lighting.rimIntensity;
  counterRimLight.intensity = props.lighting.counterRimIntensity;
  fillLight.intensity = props.lighting.fillIntensity;
});
```

---

## Adding New Themes

To add a third theme (e.g., "dark-obsidian"):

### 1. Define tokens in `tokens.css`

```css
[data-theme="dark-obsidian"] {
  --mg-base: #1A1A1C;
  --mg-highlight-1: #8A8C8F;
  /* ... other tokens ... */
  --mg-metalness: 0.75;
  --mg-roughness: 0.18;
  /* ... material properties ... */
}
```

### 2. Update theme switcher

```javascript
// In js/theme-switcher.js
const THEMES = {
  COOL_SILVER: 'cool-silver',
  WARM_MATTE: 'warm-matte',
  DARK_OBSIDIAN: 'dark-obsidian' // Add new theme
};
```

### 3. Create Three.js material

```javascript
// In js/materials.js
export function createDarkObsidianMaterial(THREE) {
  return new THREE.MeshPhysicalMaterial({
    color: 0x1A1A1C,
    metalness: 0.75,
    roughness: 0.18,
    // ... properties
  });
}
```

---

## Theme Persistence

Themes automatically persist to `localStorage`:

```javascript
// Key: 'deepline-theme'
// Value: 'cool-silver' | 'warm-matte'

// Clear saved theme (resets to default)
localStorage.removeItem('deepline-theme');
```

---

## Keyboard Shortcut

Press **`Ctrl + Shift + T`** to toggle themes quickly.

---

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 15+)
- Graceful fallback to default theme if localStorage unavailable
- CSS transitions disabled when `prefers-reduced-motion` is set
- High contrast mode adjustments included

---

## Best Practices

### 1. Always Use Tokens

❌ **Bad:**
```css
.card {
  background: #15161A;
  padding: 24px;
  border-radius: 16px;
}
```

✅ **Good:**
```css
.card {
  background: var(--mg-bg-surface);
  padding: var(--mg-space-lg);
  border-radius: var(--mg-radius-lg);
}
```

### 2. Keep Midtones Dark

Per the Metal-Glass Style Language, **midtones should stay subdued** so edges carry the sheen. Avoid raising midtone brightness above token values.

### 3. Cool Highlights Only

Even in warm-matte theme, highlights remain cool (#E9F1F6). **Never add warm glows or bloom.**

### 4. Micro-Texture ≤10%

Texture should be barely perceptible at arm's length. Use `.mg-micro-texture` helper class rather than custom implementations.

### 5. Bloom Restraint

Bloom should be **surgical, not neon**. Only the top 1-2% brightest pixels should glow.

### 6. Theme-Aware Components

Components should respond to theme changes via:
- CSS custom properties (automatic)
- JavaScript event listener (for Three.js, canvas, etc.)

---

## Debugging

### Visual Debug Indicator

Add this to test theme switching:

```html
<div class="theme-debug"></div>
```

This fixed indicator shows current theme in bottom-right corner.

### Check Computed Tokens

```javascript
// In browser console
const root = getComputedStyle(document.documentElement);
console.log('Base color:', root.getPropertyValue('--mg-base'));
console.log('Metalness:', root.getPropertyValue('--mg-metalness'));
```

### Force Theme (for testing)

```javascript
// Bypass localStorage for testing
document.documentElement.setAttribute('data-theme', 'warm-matte');
```

---

## Performance

- Theme transitions use GPU-accelerated properties (opacity, transform)
- Transition duration: 0.3s (configurable via `--mg-transition-base`)
- No layout thrashing (only color/shadow changes)
- Three.js material updates batched via `needsUpdate` flag
- PMREM environment maps cached (not regenerated on theme switch)

---

## Examples

### Complete Theme-Aware Card

```html
<div class="info-card mg-surface mg-micro-texture">
  <h3 style="color: var(--mg-text-primary)">Title</h3>
  <p style="color: var(--mg-text-secondary)">Description</p>
  <a href="#" class="btn" style="background: var(--mg-gradient-button)">CTA</a>
</div>
```

### Complete Three.js Integration

```javascript
import { createThemeMaterial, createEnvironment } from './js/materials.js';
import { getThemeProperties } from './js/theme-switcher.js';

// Initial setup
const material = createThemeMaterial(THREE);
const mesh = new THREE.Mesh(geometry, material);
await createEnvironment(THREE, renderer, scene);

// Listen for theme changes
window.addEventListener('theme-change', () => {
  const props = getThemeProperties();
  
  // Update material
  material.metalness = props.material.metalness;
  material.roughness = props.material.roughness;
  material.color.setHex(props.colors.base);
  material.needsUpdate = true;
  
  // Update bloom
  bloomPass.threshold = props.bloom.threshold;
  bloomPass.strength = props.bloom.strength;
});
```

---

## Troubleshooting

### Theme Not Switching

1. Check console for errors
2. Verify `data-theme` attribute on `<html>`
3. Ensure tokens.css is loaded before other styles
4. Check localStorage permissions (may be blocked in private mode)

### Colors Look Wrong

1. Verify token definitions in tokens.css
2. Check for hardcoded hex values overriding tokens
3. Ensure `data-theme` attribute matches theme name exactly
4. Check browser DevTools → Computed styles for actual token values

### Three.js Materials Not Updating

1. Ensure `material.needsUpdate = true` after property changes
2. Check for theme-change event listener
3. Verify `getThemeProperties()` returns correct values
4. Ensure material references aren't stale (recreated materials)

---

## Next Steps

- **For Designers:** Review token values in `ui/foundation/tokens.css`
- **For Developers:** Integrate theme switcher UI into nav/footer
- **For QA:** Test theme switching across all sections and components
- **For Three.js:** Update hero scenes to use `createThemeMaterial()`

**See also:**
- `METAL-GLASS-INTEGRATION.md` - Three.js implementation guide
- `QA-CHECKLIST.md` - Visual QA checklist
- `docs/repo-inventory.md` - Component inventory

