# QA Checklist
**Deepline Metal-Glass Integration**  
**Theme**: Cool Silver (Locked)  
**Last Updated**: 2025-10-12

---

## Pre-Testing Setup

### Environment
- [ ] Local dev server running (`http://localhost:5000` or equivalent)
- [ ] Browser DevTools open (Console + Network tabs)
- [ ] No console errors on page load

### Test Browsers
- [ ] Chrome 90+ (desktop)
- [ ] Firefox 88+ (desktop)
- [ ] Safari 15+ (macOS/iOS)
- [ ] Chrome (Android)
- [ ] Safari (iOS)

### Test Devices
- [ ] Desktop 1920x1080
- [ ] Laptop 1440x900
- [ ] Tablet 768x1024 (iPad)
- [ ] Mobile 375x667 (iPhone SE)
- [ ] Mobile 390x844 (iPhone 12/13)

---

## Phase 4.1: Visual QA

### Cool Silver Material Rendering

#### Hero Geometry
- [ ] Infinity symbol (∞) visible and recognizable
- [ ] Smooth curves, no faceting/polygons visible
- [ ] Symbol centered in canvas
- [ ] Symbol size ~70-75% of canvas width
- [ ] Ribbon thickness consistent throughout

#### Material Properties
- [ ] **Base color**: Cool silver-blue (not warm/golden)
- [ ] **Metalness**: Very high (mirror-like reflections visible)
- [ ] **Roughness**: Low (high gloss, sharp reflections)
- [ ] **Clearcoat**: Visible rim highlights on edges
- [ ] **Transmission**: Subtle translucency (light passes through slightly)

#### Lighting
- [ ] **Key rim** (upper-left/front): Bright cool highlight
- [ ] **Counter rim** (upper-right/back): Softer secondary highlight
- [ ] **Fill light**: Subtle ambient glow
- [ ] Rim lights only visible on grazing edges (Fresnel effect)
- [ ] Dark midtones (not washed out)

#### Bloom Effect
- [ ] Bloom visible ONLY on sharpest edge highlights
- [ ] No bloom on midtones or flat surfaces
- [ ] Bloom color cool/white (not colored halos)
- [ ] Bloom tight and surgical (not hazy/excessive)

#### Micro-Texture
- [ ] Very subtle surface texture (barely perceptible, 6-8%)
- [ ] Texture does not overpower smooth appearance
- [ ] Texture visible in turns/cavities only (not flat surfaces)

#### Color Banding
- [ ] No visible banding in gradients
- [ ] Smooth transitions from highlight to shadow

### Midtones Dark Enough
- [ ] Mids are subdued (not bright/washed out)
- [ ] High contrast between edges and center
- [ ] Silhouette readable against black background

### Edge Highlights Visible (Fresnel Rim)
- [ ] Highlights only on edges facing camera
- [ ] Highlights disappear on flat surfaces facing camera
- [ ] Highlights intensify at glancing angles

### Bloom Only on Brightest Edges
- [ ] Bloom threshold high (only top 1-2% of brightness)
- [ ] No "fog" or "haze" over entire symbol
- [ ] Bloom follows edge contours tightly

### No Artifacts
- [ ] No z-fighting (flickering)
- [ ] No clipping (geometry cut off)
- [ ] No texture seams
- [ ] No unexpected transparency

### Typography Legible
- [ ] All text readable at 16px base size
- [ ] Heading hierarchy clear (H1 > H2 > H3)
- [ ] Line height comfortable (not cramped)
- [ ] Letter spacing appropriate

### Card Shadows Consistent
- [ ] All cards have same shadow depth
- [ ] Shadows match design tokens
- [ ] No mismatched inline styles

### Button Hover States Work
- [ ] Primary button: Hover effect visible
- [ ] Secondary button: Hover effect visible
- [ ] Cursor changes to pointer
- [ ] Transition smooth (0.3s ease)

---

## Phase 4.2: Browser Testing

### Chrome (Desktop)
- [ ] Page loads without errors
- [ ] Hero renders correctly
- [ ] Hero animates at 60fps
- [ ] Form validation works
- [ ] No console warnings

### Firefox (Desktop)
- [ ] Page loads without errors
- [ ] Hero renders correctly
- [ ] Hero animates at 60fps
- [ ] Form validation works
- [ ] No console warnings
- [ ] ES modules load correctly

### Safari (macOS)
- [ ] Page loads without errors
- [ ] Hero renders correctly
- [ ] Hero animates at 60fps (check for Safari-specific issues)
- [ ] Form validation works
- [ ] No console warnings
- [ ] ES modules load correctly

### Chrome (Android)
- [ ] Page loads without errors
- [ ] Hero renders correctly
- [ ] Hero animates at 30fps+ (mobile acceptable)
- [ ] Touch interactions work
- [ ] Form validation works (native keyboard)
- [ ] Page scrolls smoothly

### Safari (iOS)
- [ ] Page loads without errors
- [ ] Hero renders correctly
- [ ] Hero animates at 30fps+ (iOS acceptable)
- [ ] Touch interactions work
- [ ] Form validation works (native keyboard)
- [ ] Page scrolls smoothly (no bounce issues)
- [ ] Address bar hide/show doesn't break layout

---

## Phase 4.3: Performance Profiling

### FPS Testing (Chrome DevTools)

#### Desktop (1920x1080)
1. Open DevTools > More Tools > Rendering > FPS Meter
2. Navigate to page
3. Watch hero animation for 30 seconds
4. **Expected**: Steady 60fps, minimal drops
5. [ ] FPS ≥ 58fps consistently
6. [ ] No frame drops during resize
7. [ ] No frame drops during scroll

#### Mobile (Simulated, 4x CPU Slowdown)
1. Open DevTools > Performance > CPU: 4x slowdown
2. Navigate to page
3. Watch hero animation for 30 seconds
4. **Expected**: 30fps+, some drops acceptable
5. [ ] FPS ≥ 25fps consistently
6. [ ] Hero still recognizable/smooth

### Performance Timeline Recording
1. Open DevTools > Performance tab
2. Click Record (●)
3. Reload page
4. Wait for hero to load fully (~3 seconds)
5. Stop recording
6. **Analyze**:
   - [ ] FCP (First Contentful Paint) < 1.5s
   - [ ] LCP (Largest Contentful Paint) < 2.5s
   - [ ] TTI (Time to Interactive) < 3s
   - [ ] Main thread not blocked for >500ms
   - [ ] Animation loop cost < 16ms/frame

### Bundle Size Analysis
1. Open DevTools > Network tab
2. Reload page with cache disabled
3. **Measure**:
   - [ ] HTML: _____KB (target: <20KB)
   - [ ] CSS: _____KB (target: <50KB)
   - [ ] JS (first-party): _____KB (target: <50KB)
   - [ ] Three.js CDN: ~600KB (expected, external)
   - [ ] Total (excl. Three.js): _____KB (target: <120KB)

### Coverage Analysis
1. Open DevTools > More Tools > Coverage
2. Click Record (●)
3. Reload page
4. Interact with page (scroll, click, etc.)
5. Stop recording
6. **Check**:
   - [ ] CSS coverage ≥ 60% (unused styles acceptable)
   - [ ] JS coverage ≥ 70% (some Three.js unused)
   - [ ] No large unused chunks

### CPU Throttling Test
1. Open DevTools > Performance > CPU: 4x slowdown
2. Navigate to page
3. Interact with hero (resize, scroll)
4. **Expected**: Slower but still functional
5. [ ] Hero renders (may take longer)
6. [ ] Animation slower but still smooth
7. [ ] No crashes or freezes

### Memory Usage (Chrome DevTools)
1. Open DevTools > Memory tab
2. Take heap snapshot ("Snapshot 1")
3. Wait 2 minutes while hero animates
4. Take another heap snapshot ("Snapshot 2")
5. **Compare**:
   - [ ] Snapshot 1 size: _____MB (target: <100MB)
   - [ ] Snapshot 2 size: _____MB (should be similar, ±10MB)
   - [ ] No memory leaks (growth rate ~0MB/min)

### Memory Leak Test (Hero Switching)
1. Open DevTools > Memory tab
2. Take heap snapshot ("Before")
3. Open console, run:
   ```javascript
   import('./js/metal-glass-init.js').then(async m => {
     for (let i = 0; i < 5; i++) {
       await m.switchHero(m.HERO_VARIANTS.ORB);
       await new Promise(r => setTimeout(r, 2000));
       await m.switchHero(m.HERO_VARIANTS.LEMNISCATE);
       await new Promise(r => setTimeout(r, 2000));
     }
   });
   ```
4. Take heap snapshot ("After")
5. **Compare**:
   - [ ] Heap growth < 50MB (some growth acceptable)
   - [ ] No "Detached DOM tree" leaks
   - [ ] No "Leaked EventListener" warnings

---

## Phase 4.4: Accessibility Audit

### Lighthouse Audit
1. Open DevTools > Lighthouse tab
2. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
3. Click "Analyze page load"
4. **Expected Scores**:
   - [ ] Performance: ≥ 85
   - [ ] Accessibility: **≥ 90** (required)
   - [ ] Best Practices: ≥ 85
   - [ ] SEO: ≥ 85

### Accessibility Checks

#### Keyboard Navigation
- [ ] **Tab** key moves focus through interactive elements
- [ ] Focus indicator visible (outline, highlight, etc.)
- [ ] **Enter** key activates buttons/links
- [ ] **Enter** key submits form
- [ ] **Esc** key closes modals (if any)
- [ ] No keyboard traps (can Tab out of everything)

#### Focus Order
- [ ] Focus order follows visual/logical order
- [ ] Nav links focusable in order (Product → Playbooks → Security → Docs → Early Access)
- [ ] Form inputs focusable in order
- [ ] No unexpected focus jumps

#### ARIA Labels
- [ ] All icon-only buttons have `aria-label`
- [ ] Hero canvas has `aria-hidden="true"` (decorative)
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages have `role="alert"` (if implemented)

#### Semantic HTML
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skips)
- [ ] `<nav>` for navigation
- [ ] `<main>` for main content
- [ ] `<footer>` for footer
- [ ] `<section>` for content sections

#### Alt Text
- [ ] All images have `alt` attributes
- [ ] Alt text descriptive (not "image" or filename)
- [ ] Decorative images have `alt=""` or `aria-hidden="true"`
- [ ] Fallback images have meaningful alt text

#### Color Contrast (WCAG AA)
Test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/):

- [ ] Primary text on primary bg: ≥ 4.5:1  
  - `#ECEFF4` on `#0B0B0C` = **17.8:1** ✅

- [ ] Secondary text on primary bg: ≥ 4.5:1  
  - `#A9B0BA` on `#0B0B0C` = **8.2:1** ✅

- [ ] Accent button text: ≥ 4.5:1  
  - Test with actual gradient colors

- [ ] Link text: ≥ 4.5:1  
  - `#00B5D8` on `#0B0B0C` = **____:1** (calculate)

#### Reduced Motion
1. Enable reduced motion:
   - **macOS**: System Preferences > Accessibility > Display > Reduce motion
   - **Windows**: Settings > Ease of Access > Display > Show animations
   - **Chrome DevTools**: Rendering > Emulate CSS media > `prefers-reduced-motion: reduce`

2. Test:
   - [ ] Hero animation stops (rotation disabled)
   - [ ] Glyph animation stops
   - [ ] CSS transitions disabled (or very short)
   - [ ] Page still functional

### Screen Reader Testing (NVDA/JAWS/VoiceOver)

#### General Navigation
- [ ] Page title announced on load
- [ ] Heading hierarchy navigable (H key)
- [ ] Landmarks navigable (D key for NVDA/JAWS)
- [ ] Links navigable and descriptive

#### Hero Canvas
- [ ] Canvas skipped (decorative, `aria-hidden="true"`)
- [ ] Fallback image announced if WebGL disabled

#### Form
- [ ] Label announced with input focus
- [ ] Required fields announced as "required"
- [ ] Validation errors announced
- [ ] Submit button announced correctly

---

## Additional Manual Tests

### Resize Responsiveness
1. Start at 1920x1080
2. Slowly resize to 375x667 (mobile)
3. **Check**:
   - [ ] Hero resizes smoothly
   - [ ] No clipping or overflow
   - [ ] Aspect ratio maintained
   - [ ] Text wraps correctly
   - [ ] Cards stack vertically on mobile

### Scroll Behavior
1. Scroll from top to bottom
2. **Check**:
   - [ ] Smooth scrolling (if enabled)
   - [ ] No janky/laggy scrolling
   - [ ] Hero lazy-loads if below fold
   - [ ] Glyphs lazy-load on scroll into viewport

### Form Validation
1. Try submitting empty form
   - [ ] Browser blocks submission (HTML5 required)

2. Try invalid email formats:
   - [ ] `userexample.com` → blocked
   - [ ] `user@` → blocked
   - [ ] `@example.com` → blocked

3. Submit valid email:
   - [ ] Form submits successfully
   - [ ] Confirmation shown (or redirect)

### Hero Variant Switching (Dev Console)
1. Open console
2. Run:
   ```javascript
   import('./js/metal-glass-init.js').then(m => {
     console.log('Current variant:', m.getCurrentHeroVariant());
     m.switchHero(m.HERO_VARIANTS.ORB);
   });
   ```
3. **Check**:
   - [ ] Previous hero disposed (no double render)
   - [ ] New hero initializes after 100ms
   - [ ] localStorage updated
   - [ ] `hero-variant-change` event dispatched

### WebGL Fallback
1. Disable WebGL:
   - **Chrome**: `chrome://flags/#disable-webgl` → Disabled
   - **Firefox**: `about:config` → `webgl.disabled = true`

2. Reload page
3. **Check**:
   - [ ] Hero canvas hidden
   - [ ] Fallback image shown
   - [ ] No console errors
   - [ ] Rest of page functional

### localStorage Persistence
1. Set hero variant via console:
   ```javascript
   import('./js/metal-glass-init.js').then(m => {
     m.switchHero(m.HERO_VARIANTS.LEGACY);
   });
   ```
2. Reload page
3. **Check**:
   - [ ] Same hero variant loads (legacy torus)
   - [ ] localStorage key present: `deepline-hero-variant = "legacy-torus"`

---

## Bug Reporting Template

When you find an issue, use this format:

```markdown
### Bug: [Short Description]

**Severity**: Critical / High / Medium / Low

**Environment**:
- Browser: Chrome 120.0.6099.109
- OS: Windows 11
- Device: Desktop 1920x1080
- URL: http://localhost:5000

**Steps to Reproduce**:
1. Navigate to page
2. Scroll to hero
3. Resize window to 800x600
4. Observe clipping

**Expected Behavior**:
Hero should resize to fit container without clipping.

**Actual Behavior**:
Hero is cut off on right side.

**Screenshots**:
[Attach screenshot]

**Console Errors**:
```
Error: Cannot read property 'dispose' of undefined
  at MetalGlassHero.dispose (MetalGlassHero.js:152)
```

**Additional Context**:
Only happens when resizing below 800px width.
```

---

## Summary

### Checklist Stats
- **Visual QA**: 21 checks
- **Browser Testing**: 30 checks (5 browsers × 6 checks)
- **Performance**: 20 checks
- **Accessibility**: 35 checks
- **Manual Tests**: 15 checks

**Total**: ~121 manual QA checks

### Estimated Time
- Visual QA: 20 minutes
- Browser Testing: 45 minutes
- Performance: 30 minutes
- Accessibility: 40 minutes
- Manual Tests: 15 minutes

**Total**: ~2.5 hours for comprehensive manual QA

---

## Sign-Off

**Tester**: ___________________________  
**Date**: ___________________________  
**Build/Commit**: ___________________________  

**Overall Status**: ☐ Pass  ☐ Pass with Minor Issues  ☐ Fail

**Notes**:
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________

