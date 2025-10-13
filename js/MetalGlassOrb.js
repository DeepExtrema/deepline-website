/**
 * Metal-Glass Overmind Orb Hero
 * Spherical hub with connection nodes and labels
 * Theme-aware material with pulsing animations
 */

import { createRenderer, handleResize, createAnimationLoop, prefersReducedMotion } from './three-setup.js';
import { createSilverMaterial, createLighting, createEnvironment, TOKENS } from './materials.js';

export class MetalGlassOrb {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.sphere = null;
    this.ring = null;
    this.nodes = [];
    this.lines = [];
    this.labels = [];
    this.labelElements = [];
    this.THREE = null;
    this.animationLoop = null;
    this.rotationSpeed = prefersReducedMotion() ? 0 : 0.15;
    this.envMap = null;
    this.time = 0;
    this.labelContainer = null;
    
    // Connection configuration
    this.connections = [
      { label: 'deployment', angle: 0, radius: 2.5 },
      { label: 'monitoring', angle: Math.PI / 2, radius: 2.5 },
      { label: 'testing', angle: Math.PI, radius: 2.5 },
      { label: 'version control', angle: Math.PI * 1.5, radius: 2.5 }
    ];
  }

  async init() {
    try {
      // Initialize renderer
      const { THREE, renderer } = await createRenderer(this.canvas, {
        antialias: true,
        alpha: true
      });
      
      this.THREE = THREE;
      this.renderer = renderer;

      // Setup scene
      this.scene = new THREE.Scene();
      this.scene.background = null;

      // Setup camera
      const aspect = this.canvas.parentElement.clientWidth / this.canvas.parentElement.clientHeight;
      this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
      this.camera.position.set(0, 0, 6);
      this.camera.lookAt(0, 0, 0);

      // Create orb components
      await this.createOrb();
      
      // Setup lighting
      createLighting(THREE, this.scene);

      // Setup environment map
      await this.setupEnvironment();

      // Setup post-processing
      await this.setupPostProcessing();

      // Setup HTML labels
      this.setupLabels();

      // Handle resize
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());

      // Start animation
      this.animationLoop = createAnimationLoop(() => this.animate());
      this.animationLoop.start();

      return true;
    } catch (error) {
      console.error('Failed to initialize MetalGlassOrb:', error);
      return false;
    }
  }

  async createOrb() {
    // Central sphere
    const sphereGeometry = new this.THREE.SphereGeometry(0.8, 64, 64);
    const sphereMaterial = createSilverMaterial(this.THREE);
    this.sphere = new this.THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(this.sphere);

    // Equator ring
    const ringGeometry = new this.THREE.TorusGeometry(1.2, 0.05, 16, 64);
    const ringMaterial = createSilverMaterial(this.THREE);
    this.ring = new this.THREE.Mesh(ringGeometry, ringMaterial);
    this.ring.rotation.x = Math.PI / 2; // Horizontal
    this.scene.add(this.ring);

    // Create connection nodes and lines
    this.createConnections();
  }

  createConnections() {
    // Node geometry and materials
    const nodeGeometry = new this.THREE.SphereGeometry(0.08, 16, 16);
    
    // Get accent color from tokens
    const accentColor = TOKENS.bloom; // Use bloom color for nodes
    
    this.connections.forEach((conn, i) => {
      // Create pulsing node material
      const nodeMaterial = new this.THREE.MeshPhysicalMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 0.8
      });
      
      // Create node mesh
      const node = new this.THREE.Mesh(nodeGeometry, nodeMaterial);
      const x = Math.cos(conn.angle) * conn.radius;
      const z = Math.sin(conn.angle) * conn.radius;
      node.position.set(x, 0, z);
      node.userData = { originalScale: 1, pulsePhase: i * Math.PI / 2 };
      this.scene.add(node);
      this.nodes.push(node);
      
      // Create connection line
      const lineMaterial = new this.THREE.LineBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.3
      });
      
      const lineGeometry = new this.THREE.BufferGeometry().setFromPoints([
        new this.THREE.Vector3(0, 0, 0),  // Sphere center
        new this.THREE.Vector3(x, 0, z)    // Node position
      ]);
      
      const line = new this.THREE.Line(lineGeometry, lineMaterial);
      line.userData = { pulsePhase: i * Math.PI / 2 };
      this.scene.add(line);
      this.lines.push(line);
    });
  }

  setupLabels() {
    // Create label container overlay
    this.labelContainer = document.createElement('div');
    this.labelContainer.className = 'orb-label-container';
    this.labelContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      color: var(--mg-text-secondary);
      font-family: var(--mg-font-sans);
      font-size: var(--mg-text-sm);
      font-weight: 500;
      z-index: 1;
    `;
    
    // Insert after canvas
    this.canvas.parentElement.style.position = 'relative';
    this.canvas.parentElement.appendChild(this.labelContainer);
    
    // Create label elements
    this.connections.forEach((conn) => {
      const label = document.createElement('div');
      label.textContent = conn.label;
      label.style.cssText = `
        position: absolute;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        opacity: 0.8;
        transition: opacity 0.3s ease;
      `;
      this.labelContainer.appendChild(label);
      this.labelElements.push(label);
    });
  }

  updateLabels() {
    if (!this.labelElements || this.labelElements.length === 0) return;
    
    this.nodes.forEach((node, i) => {
      // Project 3D position to 2D screen coordinates
      const vector = node.position.clone();
      vector.project(this.camera);
      
      // Convert to screen coordinates
      const canvasRect = this.canvas.getBoundingClientRect();
      const x = (vector.x * 0.5 + 0.5) * canvasRect.width;
      const y = (-(vector.y * 0.5) + 0.5) * canvasRect.height;
      
      // Update label position
      if (this.labelElements[i]) {
        this.labelElements[i].style.left = `${x}px`;
        this.labelElements[i].style.top = `${y}px`;
        
        // Fade out labels behind the camera
        const opacity = vector.z < 1 ? 0.8 : 0.2;
        this.labelElements[i].style.opacity = opacity;
      }
    });
  }

  async setupEnvironment() {
    try {
      this.envMap = await createEnvironment(this.THREE, this.renderer, this.scene);
      if (this.envMap) {
        console.log('Orb: Environment map created successfully');
      }
    } catch (error) {
      console.warn('Orb: Failed to create environment map:', error);
    }
  }

  async setupPostProcessing() {
    const { EffectComposer } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js');
    const { UnrealBloomPass } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js');

    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Cool silver bloom parameters (locked)
    const bloomThreshold = 0.94;
    const bloomStrength = 0.28;
    const bloomRadius = 0.5;

    const bloomPass = new UnrealBloomPass(
      new this.THREE.Vector2(
        this.canvas.parentElement.clientWidth,
        this.canvas.parentElement.clientHeight
      ),
      bloomStrength,
      bloomRadius,
      bloomThreshold
    );

    this.composer.addPass(bloomPass);
  }

  animate() {
    if (!this.sphere || !this.composer) return;

    this.time += 0.01;

    // Slow rotation (respects reduced motion)
    if (this.rotationSpeed > 0) {
      this.sphere.rotation.y += this.rotationSpeed * 0.008;
      this.ring.rotation.z += this.rotationSpeed * 0.005;
    }

    // Pulse connection nodes
    this.nodes.forEach((node) => {
      const pulsePhase = this.time + node.userData.pulsePhase;
      
      // Emissive intensity pulse (±5%)
      node.material.emissiveIntensity = 0.5 + Math.sin(pulsePhase) * 0.05;
      
      // Scale pulse
      const scale = node.userData.originalScale * (1 + Math.sin(pulsePhase) * 0.1);
      node.scale.setScalar(scale);
    });

    // Pulse connection lines
    this.lines.forEach((line) => {
      const pulsePhase = this.time + line.userData.pulsePhase;
      line.material.opacity = 0.3 + Math.sin(pulsePhase) * 0.1;
    });

    // Update label positions
    this.updateLabels();

    // Render with post-processing
    this.composer.render();
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    handleResize(this.renderer, this.camera, this.composer);
    
    // Labels will auto-update on next animation frame
  }

  dispose() {
    if (this.animationLoop) {
      this.animationLoop.stop();
    }
    
    // Remove label container
    if (this.labelContainer && this.labelContainer.parentNode) {
      this.labelContainer.parentNode.removeChild(this.labelContainer);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.composer) {
      this.composer.renderTarget1.dispose();
      this.composer.renderTarget2.dispose();
    }

    // Dispose geometries and materials
    const allObjects = [this.sphere, this.ring, ...this.nodes, ...this.lines];
    allObjects.forEach(obj => {
      if (obj) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      }
    });
    
    if (this.envMap) {
      this.envMap.dispose();
    }
  }
}

