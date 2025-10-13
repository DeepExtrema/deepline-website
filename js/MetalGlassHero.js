/**
 * Metal-Glass Hero Scene
 * Main 3D infinity symbol with subtle animation
 */

import { createRenderer, handleResize, createAnimationLoop, prefersReducedMotion } from './three-setup.js';
import { createSilverMaterial, createLighting, applyMicroTexture, PARAMS } from './materials.js';

export class MetalGlassHero {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.mesh = null;
    this.THREE = null;
    this.animationLoop = null;
    this.rotationSpeed = prefersReducedMotion() ? 0 : 0.15; // ≤0.2 rad/s
  }

  async init() {
    try {
      // Initialize renderer and get THREE reference
      const { THREE, renderer } = await createRenderer(this.canvas, {
        antialias: true,
        alpha: true
      });
      
      this.THREE = THREE;
      this.renderer = renderer;

      // Setup scene
      this.scene = new THREE.Scene();
      this.scene.background = null; // Transparent

      // Setup camera (35-50mm FOV equivalent)
      const aspect = this.canvas.parentElement.clientWidth / this.canvas.parentElement.clientHeight;
      this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
      this.camera.position.set(0, -0.5, 5); // Object slightly below center
      this.camera.lookAt(0, 0, 0);

      // Create infinity symbol geometry
      this.mesh = this.createInfinitySymbol();
      this.scene.add(this.mesh);

      // Setup lighting
      createLighting(THREE, this.scene);

      // Setup post-processing
      await this.setupPostProcessing();

      // Handle resize
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());

      // Start animation
      this.animationLoop = createAnimationLoop(() => this.animate());
      this.animationLoop.start();

      return true;
    } catch (error) {
      console.error('Failed to initialize MetalGlassHero:', error);
      return false;
    }
  }

  createInfinitySymbol() {
    // Create infinity symbol using two torus geometries
    const group = new THREE.Group();
    
    // Parameters for elliptical ribbon cross-section
    const tubeRadius = 0.12;
    const torusRadius = 0.8;
    const radialSegments = 64;
    const tubularSegments = 128;

    // Left loop
    const leftTorus = new THREE.Mesh(
      new THREE.TorusGeometry(torusRadius, tubeRadius, radialSegments, tubularSegments),
      createSilverMaterial(this.THREE)
    );
    leftTorus.position.x = -0.9;
    leftTorus.rotation.y = Math.PI / 2;
    
    // Right loop
    const rightTorus = new THREE.Mesh(
      new THREE.TorusGeometry(torusRadius, tubeRadius, radialSegments, tubularSegments),
      createSilverMaterial(this.THREE)
    );
    rightTorus.position.x = 0.9;
    rightTorus.rotation.y = Math.PI / 2;

    // Apply micro-texture
    applyMicroTexture(leftTorus.material, this.THREE, 0.08);
    applyMicroTexture(rightTorus.material, this.THREE, 0.08);

    group.add(leftTorus);
    group.add(rightTorus);

    // Scale to appropriate size
    group.scale.setScalar(0.7);

    return group;
  }

  async setupPostProcessing() {
    // Dynamically import post-processing modules
    const { EffectComposer } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js');
    const { UnrealBloomPass } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js');

    // Create composer
    this.composer = new EffectComposer(this.renderer);

    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Add bloom pass (restrained, surgical)
    const bloomPass = new UnrealBloomPass(
      new this.THREE.Vector2(
        this.canvas.parentElement.clientWidth,
        this.canvas.parentElement.clientHeight
      ),
      PARAMS.BLOOM_STRENGTH,   // strength: 0.2-0.35
      PARAMS.BLOOM_RADIUS,     // radius: 0.4-0.6
      PARAMS.BLOOM_THRESHOLD   // threshold: 0.92-0.96 (only brightest curves)
    );

    this.composer.addPass(bloomPass);
  }

  animate() {
    if (!this.mesh || !this.composer) return;

    // Slow orbit animation (respects reduced motion)
    if (this.rotationSpeed > 0) {
      this.mesh.rotation.y += this.rotationSpeed * 0.01;
    }

    // Render with post-processing
    this.composer.render();
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    handleResize(this.renderer, this.camera, this.composer);
  }

  dispose() {
    if (this.animationLoop) {
      this.animationLoop.stop();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.composer) {
      this.composer.renderTarget1.dispose();
      this.composer.renderTarget2.dispose();
    }

    // Dispose geometries and materials
    if (this.mesh) {
      this.mesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }
  }
}

