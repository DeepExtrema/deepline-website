# Test Plan
**Deepline Metal-Glass Integration**  
**Theme**: Cool Silver (Locked)  
**Last Updated**: 2025-10-12

---

## A. Features & Interactions to Test

### 1. Three.js Hero Rendering

#### 1.1 Initial Load
**Given**: Page loads with `#metal-glass-hero` canvas present  
**When**: Hero initialization begins  
**Then**:
- Default hero variant loaded from localStorage (or fallback to `lemniscate`)
- Canvas transitions from loading state to loaded (`.loading` → `.loaded`)
- Hero animates smoothly at 60fps target
- Canvas opacity fades in to 1

**Edge Cases**:
- localStorage unavailable → uses `LEMNISCATE` default
- Invalid variant in localStorage → uses `LEMNISCATE` default
- Canvas element missing → fails gracefully, no initialization
- WebGL unavailable → shows static fallback image

**Test Priority**: P0 (critical)

---

#### 1.2 Hero Variant Switching
**Given**: A hero is already initialized  
**When**: `switchHero(variant)` called via dev console  
**Then**:
- Current hero `dispose()` called successfully
- Geometries, materials, renderer disposed
- New hero initializes after 100ms delay
- localStorage updated with new variant
- `hero-variant-change` custom event dispatched

**Edge Cases**:
- Switch to same variant → no-op, returns true
- Invalid variant name → logs error, returns false
- Dispose fails → warns, proceeds with new init
- Canvas removed from DOM → initialization fails gracefully

**Test Priority**: P1 (important)

**Manual Test**:
```javascript
// In browser console
import('./js/metal-glass-init.js').then(m => {
  m.switchHero(m.HERO_VARIANTS.ORB); // Switch to orb
  setTimeout(() => m.switchHero(m.HERO_VARIANTS.LEMNISCATE), 3000); // Back to lemniscate
});
```

---

#### 1.3 Animation Smoothness
**Given**: Hero is initialized and animating  
**When**: Page is in viewport  
**Then**:
- Maintains 60fps on desktop (1080p)
- Maintains 30fps+ on mobile
- Respects `prefers-reduced-motion` (no animation if true)
- Rotation speed ≤0.2 rad/s (0.15 actual)

**Edge Cases**:
- Tab backgrounded → animation continues (RAF)
- Window resized → animation continues smoothly
- Low-power mode → performance may degrade (acceptable)

**Test Priority**: P0 (critical)

**Measurement**:
- Chrome DevTools Performance tab
- FPS meter overlay
- `prefers-reduced-motion: reduce` media query test

---

#### 1.4 Resize Responsiveness
**Given**: Hero is initialized at 1920x1080  
**When**: Window resized to 375x667 (mobile)  
**Then**:
- Camera aspect ratio updates
- Renderer size updates
- Composer size updates (if present)
- Pixel ratio capped at 2x
- No visual artifacts or clipping

**Edge Cases**:
- Rapid resize events → debounced via RAF
- Extreme aspect ratios (21:9, 9:21) → geometry still visible
- Zero-size container → handled gracefully

**Test Priority**: P0 (critical)

---

#### 1.5 WebGL Fallback Display
**Given**: WebGL is unavailable (disabled, old browser, etc.)  
**When**: Page loads  
**Then**:
- `isWebGLAvailable()` returns false
- `.fallback-image` displayed
- Canvas hidden (`display: none`)
- Container has `.fallback` class
- No JavaScript errors

**Edge Cases**:
- WebGL context lost during runtime → TBD (not currently handled)

**Test Priority**: P1 (important)

**Manual Test**:
- Chrome: `chrome://flags/#disable-webgl`
- Firefox: `about:config → webgl.disabled = true`

---

### 2. Metal Glyph Icons

#### 2.1 Lazy Loading on Scroll
**Given**: Page loads with `[data-metal-glyph]` elements below fold  
**When**: User scrolls element into viewport (with 100px margin)  
**Then**:
- IntersectionObserver triggers initialization
- Glyph initializes asynchronously
- Canvas opacity fades in to 1
- Observer disconnects after trigger

**Edge Cases**:
- Element already in viewport on load → initializes immediately
- Element never enters viewport → never initializes (correct)
- Multiple glyphs → each initializes independently

**Test Priority**: P1 (important)

---

#### 2.2 Intersection Observer Triggers
**Given**: Glyph canvas exists with `data-metal-glyph` attribute  
**When**: Element enters viewport  
**Then**:
- `MetalGlyph` constructor called
- `init()` called asynchronously
- Success: canvas visible, animating
- Failure: fallback image shown

**Edge Cases**:
- `rootMargin: '100px'` → triggers 100px before visible
- IntersectionObserver unsupported → TBD (not currently polyfilled)

**Test Priority**: P1 (important)

---

#### 2.3 Render Quality on Different DPRs
**Given**: Glyph initialized  
**When**: Tested on 1x, 2x, 3x DPR displays  
**Then**:
- Pixel ratio capped at 2x (`Math.min(devicePixelRatio, 2)`)
- No aliasing on edges at 2x
- Acceptable aliasing at 1x (standard)
- No excessive memory usage at 3x (still capped at 2x)

**Edge Cases**:
- DPR changes during runtime (external monitor) → handled on next resize

**Test Priority**: P2 (nice to have)

---

### 3. Form Functionality

#### 3.1 Waitlist Form Validation
**Given**: Waitlist form visible  
**When**: User enters email and submits  
**Then**:
- HTML5 validation checks email format
- Invalid email → browser tooltip shown
- Valid email → form submits
- Submit button disabled during processing

**Edge Cases**:
- Empty email → HTML5 required attribute prevents submit
- Invalid format → HTML5 type="email" prevents submit
- Network failure → TBD (needs error handling)

**Test Priority**: P0 (critical)

**Test Cases**:
- Valid: `user@example.com` ✅
- Invalid: `userexample.com` ❌
- Invalid: `user@` ❌
- Invalid: `@example.com` ❌
- Empty: `` ❌

---

#### 3.2 Email Input Validation
**Given**: Email input field focused  
**When**: User types  
**Then**:
- Real-time browser validation (`:invalid` pseudo-class)
- No custom JavaScript validation (relies on HTML5)

**Test Priority**: P1 (important)

---

#### 3.3 Submit Button States
**Given**: Form valid  
**When**: User clicks submit  
**Then**:
- Button disabled immediately
- Button text/style may change (TBD - needs implementation)
- Form POST sent
- On success: confirmation shown
- On error: button re-enabled (TBD - needs error handling)

**Edge Cases**:
- Double-click → second click ignored (button disabled)
- Network timeout → TBD (needs timeout handling)

**Test Priority**: P1 (important)

---

#### 3.4 Success/Error Messaging
**Given**: Form submitted  
**When**: Response received  
**Then**:
- **Success**: Confirmation message shown
- **Error**: Error message shown, form re-enabled

**Current Status**: ⚠️ **NOT IMPLEMENTED** - Needs error handling

**Test Priority**: P1 (important)

---

#### 3.5 Calendly Integration
**Given**: `[data-calendly]` button present  
**When**: User clicks button  
**Then**:
- Calendly popup opens (external script)
- Event tracked (`data-event` attribute)

**Edge Cases**:
- Calendly script fails to load → button does nothing (TBD)

**Test Priority**: P2 (nice to have)

---

### 4. Visual Fidelity

#### 4.1 Cool Silver Material Appearance
**Given**: Hero rendered  
**When**: Viewed under standard lighting  
**Then**:
- Base color: `#9CAFB9` (cool silver blue)
- Metalness: 0.95 (very metallic)
- Roughness: 0.12 (high gloss)
- Clearcoat: 0.25 / 0.03 (sharp rim reflections)
- IOR: 1.5 (glass-like refraction)
- Transmission: 0.30 (subtle translucency)

**Visual Characteristics**:
- Cool, silvery appearance (not warm/golden)
- High contrast between lit edges and dark mids
- Subtle micro-texture (barely perceptible, 6-8%)
- No color banding

**Test Priority**: P0 (critical)

**Manual Test**: Visual inspection against design mockup

---

#### 4.2 Edge Highlights / Rim Lighting
**Given**: Hero rendered with lighting  
**When**: Viewed head-on  
**Then**:
- **Key rim** (UL/front): Bright cool highlight (`#E9F1F6`, 85% intensity)
- **Counter rim** (UR/back): Softer highlight (`#CFE0EA`, 42% intensity)
- **Fill light**: Subtle ambient (`#8C9AA6`, 15% intensity)
- Rim lights visible on grazing edges only (Fresnel effect)

**Test Priority**: P0 (critical)

---

#### 4.3 Bloom Effect (Only on Top 1-2% Highlights)
**Given**: Hero rendered with UnrealBloomPass  
**When**: Viewed in motion  
**Then**:
- Bloom threshold: 0.94 (only brightest 6% pixels affected)
- Bloom strength: 0.28 (subtle glow)
- Bloom radius: 0.5 (tight, no excessive spread)
- Bloom visible on sharpest edge highlights only
- No bloom on midtones or shadows

**Test Priority**: P0 (critical)

**Visual Check**: Bloom should be surgical, not hazy/washed out

---

#### 4.4 Typography Hierarchy
**Given**: Page content loaded  
**When**: Viewed at 1920x1080  
**Then**:
- H1: 56px, tight leading (1.15)
- H2: 40px
- H3: 32px
- Body: 16px, relaxed leading (1.6)
- Small: 14px
- Mono: `SF Mono`, `Cascadia Code`, `Roboto Mono`

**Test Priority**: P1 (important)

---

#### 4.5 Card Styling Consistency
**Given**: Multiple cards/tiles on page  
**When**: Viewed side-by-side  
**Then**:
- All cards use token variables (`--mg-*`)
- Consistent border-radius (`--mg-radius-lg: 16px`)
- Consistent shadows (`--mg-shadow-inner`, `--mg-shadow-depth`)
- Consistent stroke (`--mg-stroke-subtle`)

**Test Priority**: P1 (important)

**Manual Test**: Visual inspection of "features", "playbooks", "security" sections

---

#### 4.6 Color Contrast (6:1 Minimum)
**Given**: Text on background  
**When**: Measured with contrast checker  
**Then**:
- Primary text on primary bg: ≥6:1 (`#ECEFF4` on `#0B0B0C` = 17.8:1 ✅)
- Secondary text on primary bg: ≥4.5:1 (`#A9B0BA` on `#0B0B0C` = 8.2:1 ✅)
- Button text: ≥4.5:1 (accent gradients)

**Test Priority**: P0 (critical - WCAG AA compliance)

**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

### 5. Navigation & Scroll

#### 5.1 Smooth Scrolling
**Given**: Anchor links in navigation (`<a href="#section">`)  
**When**: User clicks link  
**Then**:
- Page scrolls smoothly to target (CSS `scroll-behavior: smooth` or JS)
- Target section visible

**Test Priority**: P2 (nice to have)

---

#### 5.2 Anchor Links
**Given**: Nav links point to `#product`, `#playbooks`, etc.  
**When**: User clicks link  
**Then**:
- Scrolls to corresponding section
- URL hash updates

**Test Priority**: P1 (important)

---

#### 5.3 Scroll-Based Animations
**Given**: Elements with scroll-triggered animations (TBD)  
**When**: Element enters viewport  
**Then**:
- Animation triggers (fade in, slide in, etc.)

**Current Status**: ⚠️ **NOT IMPLEMENTED** (glyphs use IntersectionObserver, but no other scroll animations defined)

**Test Priority**: P2 (nice to have)

---

#### 5.4 Sticky Navigation
**Given**: User scrolls past hero  
**When**: Hero scrolls out of view  
**Then**:
- Navigation may become sticky (TBD)

**Current Status**: ⚠️ **NOT IMPLEMENTED**

**Test Priority**: P2 (nice to have)

---

### 6. Analytics Tracking

#### 6.1 `data-event` Attribute Tracking
**Given**: Element has `data-event="event_name"` attribute  
**When**: User clicks element  
**Then**:
- `track(eventName, props)` function called
- Event logged to console: `event: event_name {}`

**Current Status**: ⚠️ **CONSOLE ONLY** - No real analytics integration

**Test Priority**: P2 (nice to have)

**Example Elements**:
- `data-event="nav_early_access"`
- `data-event="cta_early_access"`
- `data-event="form_submit"`

---

#### 6.2 Click Events Logged Correctly
**Given**: Analytics setup complete  
**When**: User interacts with tracked elements  
**Then**:
- All clicks logged with correct event names
- Properties captured (TBD)

**Test Priority**: P2 (nice to have)

---

#### 6.3 Form Submission Tracking
**Given**: User submits waitlist form  
**When**: Form POST succeeds  
**Then**:
- `data-event` tracked
- Email address NOT logged (privacy)

**Test Priority**: P2 (nice to have)

---

## B. Expected Behaviors (Given/When/Then)

See detailed scenarios in **Section A** above for each feature.

---

## C. Browser/Device Matrix

| Browser      | Versions | Desktop | Mobile | Priority | Notes |
|--------------|----------|---------|--------|----------|-------|
| **Chrome**   | 90+      | ✓       | ✓      | **P0**   | Primary dev/test browser |
| **Firefox**  | 88+      | ✓       | ✓      | **P0**   | ES modules, WebGL support |
| **Safari**   | 15+      | ✓       | ✓      | **P0**   | iOS required, macOS primary |
| **Edge**     | 90+      | ✓       | -      | **P1**   | Chromium-based, similar to Chrome |
| **Samsung Internet** | 14+ | - | ✓ | **P2** | Android default browser |

### Minimum Requirements
- **WebGL 1.0** support
- **ES Modules** support (`type="module"`)
- **IntersectionObserver** support (glyph lazy loading)
- **CSS Custom Properties** support (design tokens)

### Fallback Strategy
- **No WebGL**: Static fallback images
- **No ES Modules**: Site won't load (acceptable for modern browsers only)
- **No IntersectionObserver**: Glyphs won't lazy load (render immediately or not at all)

---

## D. Performance Benchmarks

### Hero Animation
| Metric | Target | Measurement |
|--------|--------|-------------|
| Desktop FPS (1080p) | **60fps** | Chrome DevTools Performance > FPS meter |
| Mobile FPS (720p) | **30fps+** | Chrome DevTools > CPU throttling 4x |
| Animation loop cost | **<16ms/frame** | Performance > Main thread |

### Page Load
| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Contentful Paint (FCP)** | <1.5s | Lighthouse |
| **Time to Interactive (TTI)** | <3s | Lighthouse |
| **Largest Contentful Paint (LCP)** | <2.5s | Lighthouse |

### Bundle Size
| Asset | Target | Actual | Notes |
|-------|--------|--------|-------|
| HTML | <20KB | TBD | Including inline SVG |
| CSS | <50KB | TBD | Tokens + styles |
| JS (first-party) | <50KB | TBD | Excluding Three.js CDN |
| Three.js CDN | ~600KB | 600KB | External, cached |
| Total (excl. Three.js) | **<120KB** | TBD | Gzipped |

### WebGL Initialization
| Metric | Target | Measurement |
|--------|--------|-------------|
| Renderer creation | <100ms | `performance.mark()` around `createRenderer()` |
| Hero init (total) | <500ms | Canvas visible → `.loaded` class added |

### Memory Usage
| Metric | Target | Measurement |
|--------|--------|-------------|
| Idle (hero animating) | <100MB | Chrome DevTools > Memory > Heap snapshot |
| After hero switch | <150MB | Switch 5x, check for leaks |
| Leak rate | **0MB/min** | Record heap over 5 min |

---

## E. Accessibility Criteria

### ARIA Labels
- [ ] All interactive elements have `aria-label` or visible text
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated `<label>` elements

### Keyboard Navigation
- [ ] All interactive elements focusable via Tab
- [ ] Focus indicators visible (outline)
- [ ] Skip to main content link (TBD)
- [ ] Form submittable via Enter key

### Screen Reader Compatibility
- [ ] Hero canvas has `aria-hidden="true"` (decorative)
- [ ] Fallback images have descriptive `alt` text
- [ ] Semantic HTML (`<nav>`, `<main>`, `<section>`)
- [ ] Heading hierarchy correct (h1 → h2 → h3)

### `prefers-reduced-motion` Support
- [x] Hero animation stops if `prefers-reduced-motion: reduce`
- [x] Glyph animation stops if `prefers-reduced-motion: reduce`
- [x] CSS transitions disabled via media query

**Implementation Status**: ✅ **COMPLETE**

### Color Contrast Compliance (WCAG AA)
- [x] Primary text: ≥4.5:1 (17.8:1 actual ✅)
- [x] Secondary text: ≥4.5:1 (8.2:1 actual ✅)
- [ ] Accent colors: ≥3:1 for large text (TBD)
- [ ] Button text: ≥4.5:1 (TBD)

---

## F. Automated Test Scenarios

### Framework Recommendations
- **Unit Tests**: [Vitest](https://vitest.dev/) (fast, ES modules)
- **Integration Tests**: [Playwright](https://playwright.dev/) (E2E)
- **Visual Regression**: [Percy](https://percy.io/) or [Chromatic](https://www.chromatic.com/)

---

### Unit Tests (Vitest)

```javascript
// tests/unit/three-setup.test.js
import { describe, test, expect, vi } from 'vitest';
import { isWebGLAvailable, prefersReducedMotion, createAnimationLoop } from '../../js/three-setup.js';

describe('three-setup.js', () => {
  test('isWebGLAvailable returns boolean', () => {
    const result = isWebGLAvailable();
    expect(typeof result).toBe('boolean');
  });

  test('prefersReducedMotion respects media query', () => {
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const result = prefersReducedMotion();
    expect(result).toBe(true);
  });

  test('createAnimationLoop starts and stops', () => {
    const callback = vi.fn();
    const loop = createAnimationLoop(callback);

    loop.start();
    // Wait for RAF
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      loop.stop();
    }, 100);
  });
});
```

```javascript
// tests/unit/materials.test.js
import { describe, test, expect } from 'vitest';
import { TOKENS, PARAMS, createSilverMaterial } from '../../js/materials.js';

describe('materials.js', () => {
  test('TOKENS defined correctly', () => {
    expect(TOKENS.silverBase).toBe(0x9CAFB9);
    expect(TOKENS.highlight1).toBe(0xE9F1F6);
  });

  test('createSilverMaterial returns MeshPhysicalMaterial', async () => {
    // Mock THREE.js
    const mockTHREE = {
      MeshPhysicalMaterial: class {
        constructor(props) {
          Object.assign(this, props);
        }
      }
    };

    const material = createSilverMaterial(mockTHREE);
    expect(material.color).toBe(TOKENS.silverBase);
    expect(material.metalness).toBe(PARAMS.SILVER_METALNESS);
  });
});
```

```javascript
// tests/unit/metal-glass-init.test.js
import { describe, test, expect, beforeEach } from 'vitest';
import { HERO_VARIANTS, getCurrentHeroVariant, setHeroVariant } from '../../js/metal-glass-init.js';

describe('metal-glass-init.js', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('HERO_VARIANTS defined', () => {
    expect(HERO_VARIANTS.LEMNISCATE).toBe('lemniscate');
    expect(HERO_VARIANTS.ORB).toBe('orb');
    expect(HERO_VARIANTS.LEGACY).toBe('legacy-torus');
  });

  test('getCurrentHeroVariant returns default when localStorage empty', () => {
    const variant = getCurrentHeroVariant();
    expect(variant).toBe(HERO_VARIANTS.LEMNISCATE);
  });

  test('setHeroVariant persists to localStorage', () => {
    const success = setHeroVariant(HERO_VARIANTS.ORB);
    expect(success).toBe(true);

    const stored = localStorage.getItem('deepline-hero-variant');
    expect(stored).toBe(HERO_VARIANTS.ORB);
  });

  test('setHeroVariant rejects invalid variant', () => {
    const success = setHeroVariant('invalid-variant');
    expect(success).toBe(false);
  });
});
```

---

### Integration Tests (Playwright)

```javascript
// tests/e2e/hero-rendering.spec.js
import { test, expect } from '@playwright/test';

test.describe('Hero Rendering', () => {
  test('hero initializes and animates', async ({ page }) => {
    await page.goto('http://localhost:5000');

    // Wait for hero canvas
    const heroCanvas = page.locator('#metal-glass-hero');
    await expect(heroCanvas).toBeVisible();

    // Check container classes
    const container = page.locator('#metal-glass-hero').locator('..');
    await expect(container).toHaveClass(/loaded/);

    // Check canvas opacity (should be 1 after load)
    const opacity = await heroCanvas.evaluate(el => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test('hero respects prefers-reduced-motion', async ({ page, context }) => {
    // Emulate reduced motion
    await context.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://localhost:5000');

    // Hero should still render but not animate
    const heroCanvas = page.locator('#metal-glass-hero');
    await expect(heroCanvas).toBeVisible();
  });

  test('WebGL fallback shows static image', async ({ page, context }) => {
    // Disable WebGL (complex - may need to mock or use specific browser)
    // Alternatively, test the fallback function directly
    
    await page.goto('http://localhost:5000');
    
    // Inject script to disable WebGL
    await page.evaluate(() => {
      HTMLCanvasElement.prototype.getContext = () => null;
    });
    
    await page.reload();
    
    // Check for fallback
    const fallback = page.locator('.fallback-image');
    await expect(fallback).toBeVisible();
  });
});
```

```javascript
// tests/e2e/form-submission.spec.js
import { test, expect } from '@playwright/test';

test.describe('Waitlist Form', () => {
  test('validates email format', async ({ page }) => {
    await page.goto('http://localhost:5000');

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    // Try invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Browser validation should prevent submission
    const isValid = await emailInput.evaluate(el => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('submits valid email', async ({ page }) => {
    await page.goto('http://localhost:5000');

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]');

    await emailInput.fill('test@example.com');
    await submitButton.click();

    // Check for success message or redirection
    // (Depends on backend implementation)
    await expect(page).toHaveURL(/success/); // Example
  });
});
```

---

### Visual Regression Tests (Percy CLI)

```javascript
// tests/visual/hero-variants.spec.js
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Hero Visual Regression', () => {
  test('lemniscate hero appearance', async ({ page }) => {
    await page.goto('http://localhost:5000');
    
    // Wait for hero to load
    await page.waitForSelector('#metal-glass-hero.loaded');
    
    // Wait for animation to settle (1 frame)
    await page.waitForTimeout(100);
    
    await percySnapshot(page, 'Hero - Lemniscate');
  });

  test('cool silver material consistency', async ({ page }) => {
    await page.goto('http://localhost:5000');
    await page.waitForSelector('#metal-glass-hero.loaded');
    
    // Capture after 2 seconds of animation
    await page.waitForTimeout(2000);
    
    await percySnapshot(page, 'Hero - Cool Silver Material');
  });
});
```

---

## G. Manual QA Checklist

See [`QA-CHECKLIST.md`](./QA-CHECKLIST.md) for detailed manual testing steps.

---

## Summary

- **Total Features to Test**: 6 major categories
- **Total Test Scenarios**: 23 detailed scenarios
- **Automated Tests**: 15+ unit + integration tests
- **Visual Regression**: 2+ snapshots
- **Manual QA**: See QA checklist

**Recommended Test Execution Order**:
1. Unit tests (fast, run on every commit)
2. Integration tests (slower, run on PR)
3. Visual regression (slowest, run on staging deploy)
4. Manual QA (before production deploy)

