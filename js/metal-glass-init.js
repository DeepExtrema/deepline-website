/**
 * Metal-Glass Three.js Integration
 * Main initialization and fallback handling
 * Supports multiple hero variants
 */

import { isWebGLAvailable, lazyLoadThree } from './three-setup.js';
import { MetalGlassHero } from './MetalGlassHero.js';
import { MetalGlassLemniscate } from './MetalGlassLemniscate.js';
import { MetalGlassOrb } from './MetalGlassOrb.js';
import { MetalGlyph } from './MetalGlyph.js';

// Hero variants
const HERO_VARIANTS = {
  LEGACY: 'legacy-torus',      // Original dual-torus approach
  LEMNISCATE: 'lemniscate',    // True infinity curve
  ORB: 'orb'                   // Overmind sphere
};

const STORAGE_KEY_HERO = 'deepline-hero-variant';
const DEFAULT_HERO = HERO_VARIANTS.LEMNISCATE;

let currentHeroInstance = null;
let currentHeroVariant = null;

/**
 * Get current hero variant from localStorage or default
 */
function getCurrentHeroVariant() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_HERO);
    return stored && Object.values(HERO_VARIANTS).includes(stored)
      ? stored
      : DEFAULT_HERO;
  } catch (e) {
    return DEFAULT_HERO;
  }
}

/**
 * Set hero variant and persist
 */
function setHeroVariant(variant) {
  if (!Object.values(HERO_VARIANTS).includes(variant)) {
    console.error(`Invalid hero variant: ${variant}`);
    return false;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY_HERO, variant);
  } catch (e) {
    console.warn('Could not persist hero variant to localStorage');
  }
  
  return true;
}

/**
 * Initialize hero scene with specified variant
 */
async function initHero(variant = null) {
  const heroCanvas = document.getElementById('metal-glass-hero');
  if (!heroCanvas) return;

  const heroContainer = heroCanvas.parentElement;
  
  // Determine which variant to use
  const selectedVariant = variant || getCurrentHeroVariant();
  
  // Show loading state
  heroContainer.classList.add('loading');

  try {
    let hero;
    
    switch (selectedVariant) {
      case HERO_VARIANTS.LEMNISCATE:
        hero = new MetalGlassLemniscate(heroCanvas);
        break;
        
      case HERO_VARIANTS.ORB:
        hero = new MetalGlassOrb(heroCanvas);
        break;
        
      case HERO_VARIANTS.LEGACY:
      default:
        hero = new MetalGlassHero(heroCanvas);
        break;
    }
    
    const success = await hero.init();
    
    if (success) {
      heroContainer.classList.remove('loading');
      heroContainer.classList.add('loaded');
      heroCanvas.style.opacity = '1';
      
      // Store current instance and variant
      currentHeroInstance = hero;
      currentHeroVariant = selectedVariant;
      
      // Persist variant choice
      setHeroVariant(selectedVariant);
      
      console.log(`Hero initialized: ${selectedVariant}`);
    } else {
      throw new Error('Failed to initialize hero');
    }
  } catch (error) {
    console.error('Hero initialization failed, using fallback:', error);
    useFallback(heroContainer);
  }
}

/**
 * Switch to a different hero variant
 * Disposes current hero and initializes new one
 */
async function switchHero(variant) {
  if (!Object.values(HERO_VARIANTS).includes(variant)) {
    console.error(`Invalid hero variant: ${variant}`);
    return false;
  }
  
  if (currentHeroVariant === variant) {
    console.log(`Already using ${variant}`);
    return true;
  }
  
  const heroCanvas = document.getElementById('metal-glass-hero');
  const heroContainer = heroCanvas?.parentElement;
  
  if (!heroCanvas || !heroContainer) {
    console.error('Hero canvas not found');
    return false;
  }
  
  // Show loading state
  heroContainer.classList.remove('loaded');
  heroContainer.classList.add('loading');
  
  // Dispose current hero
  if (currentHeroInstance) {
    try {
      currentHeroInstance.dispose();
      currentHeroInstance = null;
      currentHeroVariant = null;
      console.log('Previous hero disposed');
    } catch (e) {
      console.warn('Error disposing hero:', e);
    }
  }
  
  // Small delay to ensure cleanup
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Initialize new hero
  await initHero(variant);
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('hero-variant-change', {
    detail: { variant }
  }));
  
  return true;
}

// Initialize glyph renderers
async function initGlyphs() {
  const glyphCanvases = document.querySelectorAll('[data-metal-glyph]');
  
  for (const canvas of glyphCanvases) {
    try {
      const glyph = new MetalGlyph(canvas, {
        animate: canvas.dataset.animate !== 'false',
        hover: canvas.dataset.hover !== 'false'
      });
      
      await glyph.init();
      canvas.style.opacity = '1';
    } catch (error) {
      console.error('Glyph initialization failed, using fallback:', error);
      useFallback(canvas.parentElement);
    }
  }
}

// Fallback to static images
function useFallback(container) {
  container.classList.remove('loading');
  container.classList.add('fallback');
  
  // Hide canvas, show fallback image
  const canvas = container.querySelector('canvas');
  const fallback = container.querySelector('.fallback-image');
  
  if (canvas) canvas.style.display = 'none';
  if (fallback) fallback.style.display = 'block';
}

// Main initialization
function init() {
  // Check WebGL support
  if (!isWebGLAvailable()) {
    console.log('WebGL not available, using fallbacks');
    document.querySelectorAll('.metal-glass-container').forEach(useFallback);
    return;
  }

  // Lazy load hero scene when in viewport
  const heroContainer = document.querySelector('#metal-glass-hero')?.parentElement;
  if (heroContainer) {
    lazyLoadThree(heroContainer, initHero);
  }

  // Lazy load glyphs
  const glyphContainers = document.querySelectorAll('[data-metal-glyph]');
  glyphContainers.forEach(canvas => {
    lazyLoadThree(canvas.parentElement, () => {
      const glyph = new MetalGlyph(canvas);
      glyph.init().catch(error => {
        console.error('Glyph failed:', error);
        useFallback(canvas.parentElement);
      });
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for manual initialization if needed
export { initHero, initGlyphs, switchHero, HERO_VARIANTS, getCurrentHeroVariant };

