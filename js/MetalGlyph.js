/**
 * Lightweight Metal-Glass Glyph Renderer
 * For icons and small logos
 */

import { createRenderer, handleResize, createAnimationLoop, prefersReducedMotion } from './three-setup.js';
import { createSilverMaterial, PARAMS } from './materials.js';

export class MetalGlyph {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.options = {
      size: options.size || 'small', // 'small', 'medium', 'large'
      animate: options.animate !== false,
      hover: options.hover !== false,
      ...options
    };
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mesh = null;
    this.THREE = null;
    this.animationLoop = null;
    this.isHovered = false;
  }

  async init() {
    try {
      // Initialize renderer
      const { THREE, renderer } = await createRenderer(this.canvas, {
        antialias: true,
        alpha: true,
        powerPreference: 'low-power' // Lightweight
      });
      
      this.THREE = THREE;
      this.renderer = renderer;

      // Setup scene
      this.scene = new THREE.Scene();
      this.scene.background = null;

      // Setup camera
      const aspect = this.canvas.width / this.canvas.height;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 10);
      this.camera.position.z = 2;

      // Create glyph geometry (simplified infinity)
      this.mesh = this.createGlyphGeometry();
      this.scene.add(this.mesh);

      // Simplified lighting (no bloom for performance)
      this.setupLighting();

      // Handle resize
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());

      // Setup hover interaction
      if (this.options.hover) {
        this.setupHoverInteraction();
      }

      // Start animation if enabled
      if (this.options.animate && !prefersReducedMotion()) {
        this.animationLoop = createAnimationLoop(() => this.animate());
        this.animationLoop.start();
      } else {
        // Single render for static
        this.renderer.render(this.scene, this.camera);
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize MetalGlyph:', error);
      return false;
    }
  }

  createGlyphGeometry() {
    // Simplified infinity - single torus knot for performance
    const geometry = new THREE.TorusKnotGeometry(0.4, 0.08, 64, 16, 2, 3);
    const material = createSilverMaterial(this.THREE);
    
    // Reduce reflectivity slightly for icons
    material.metalness = PARAMS.SILVER_METALNESS * 0.9;
    material.envMapIntensity = 0.8;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 6;
    
    return mesh;
  }

  setupLighting() {
    // Key rim only (minimal for performance)
    const keyLight = new this.THREE.DirectionalLight(0xE9F1F6, PARAMS.RIM_INTENSITY * 0.8);
    keyLight.position.set(-2, 2, 2);
    this.scene.add(keyLight);

    // Fill
    const fillLight = new this.THREE.AmbientLight(0xA6B7C3, 0.2);
    this.scene.add(fillLight);
  }

  setupHoverInteraction() {
    this.canvas.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isHovered = false;
    });
  }

  animate() {
    if (!this.mesh || !this.renderer) return;

    // Micro-rotation on hover (parallax effect ≤2px equivalent)
    if (this.isHovered) {
      this.mesh.rotation.y += 0.02;
    } else if (this.options.animate) {
      // Very subtle idle rotation
      this.mesh.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    handleResize(this.renderer, this.camera);
  }

  dispose() {
    if (this.animationLoop) {
      this.animationLoop.stop();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.mesh) {
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      if (this.mesh.material) this.mesh.material.dispose();
    }
  }
}

