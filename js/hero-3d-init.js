/**
 * Hero 3D Initialization
 * Loads and manages the 3D hero scene with loading states
 */

import { HeroScene3D } from './HeroScene3D.js';

document.addEventListener('DOMContentLoaded', async function() {
  const canvas = document.getElementById('hero-3d-canvas');
  const container = document.querySelector('.hero-3d-container');
  const fallbackImg = container?.querySelector('.fallback-image');
  
  if (!canvas || !container) {
    console.error('Hero 3D canvas or container not found');
    return;
  }

  // Set aspect ratio from fallback image to match original layout
  function setAspectFromImage() {
    if (!fallbackImg || !fallbackImg.naturalWidth || !fallbackImg.naturalHeight) return;
    container.style.setProperty(
      '--hero-aspect',
      `${fallbackImg.naturalWidth} / ${fallbackImg.naturalHeight}`
    );
  }

  if (fallbackImg) {
    if (fallbackImg.complete) {
      setAspectFromImage();
    } else {
      fallbackImg.addEventListener('load', setAspectFromImage);
    }
  }

  // Add loading state
  container.classList.add('loading');

  try {
    // Create and initialize 3D scene
    const heroScene = new HeroScene3D(canvas);
    const success = await heroScene.init();

    if (success) {
      // Remove loading, add loaded state
      container.classList.remove('loading');
      container.classList.add('loaded');
      
      console.log('Hero 3D scene loaded successfully');
    } else {
      throw new Error('Scene initialization returned false');
    }

  } catch (error) {
    console.error('Failed to initialize Hero 3D scene:', error);
    
    // Remove loading, add fallback state
    container.classList.remove('loading');
    container.classList.add('fallback');
  }
});

