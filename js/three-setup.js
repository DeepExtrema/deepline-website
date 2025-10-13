/**
 * Three.js WebGL Setup & Detection
 * Deepline Metal-Glass Implementation
 */

// WebGL Detection
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Check for reduced motion preference
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Initialize WebGL Renderer
export function createRenderer(canvas, options = {}) {
  const {
    antialias = true,
    alpha = true,
    powerPreference = 'high-performance'
  } = options;

  // Dynamically import Three.js
  return import('three')
    .then(THREE => {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias,
        alpha,
        powerPreference
      });

      // sRGB output encoding for correct color space
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      
      // ACES Filmic Tone Mapping for cinematic look
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1; // 1.0-1.2 range

      // Enable shadows if needed
      renderer.shadowMap.enabled = false; // Disabled for performance

      return { THREE, renderer };
    });
}

// Lazy load Three.js when element is in viewport
export function lazyLoadThree(element, callback) {
  if (!isWebGLAvailable()) {
    console.log('WebGL not available, using fallback');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(element);
        }
      });
    },
    { rootMargin: '100px' }
  );

  observer.observe(element);
}

// Handle resize events
export function handleResize(renderer, camera, composer = null) {
  const width = renderer.domElement.parentElement.clientWidth;
  const height = renderer.domElement.parentElement.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance

  if (composer) {
    composer.setSize(width, height);
  }
}

// Animation loop helper
export function createAnimationLoop(callback) {
  let animationId = null;
  let isRunning = false;

  const start = () => {
    if (isRunning) return;
    isRunning = true;
    
    const animate = () => {
      if (!isRunning) return;
      animationId = requestAnimationFrame(animate);
      callback();
    };
    animate();
  };

  const stop = () => {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  return { start, stop };
}

