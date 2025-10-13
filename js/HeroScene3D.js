/**
 * HeroScene3D - Interactive 3D Hero Scene
 * Full hero section with ball+puck model, mouse tracking, floating animation, and 3D text labels
 */

import { createRenderer, handleResize, createAnimationLoop, prefersReducedMotion } from './three-setup.js';
import { createSilverMaterial, createGlassMaterial, createLighting, applyMicroTexture, PARAMS, TOKENS } from './materials.js';

export class HeroScene3D {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.model = null;
    this.ball = null;
    this.puck = null;
    this.textLabels = [];
    this.labelLines = [];
    this.THREE = null;
    this.animationLoop = null;
    this.clock = null;
    
    // Mouse tracking
    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    
    // Animation settings
    this.floatSpeed = 0.8;
    this.floatAmount = 0.15;
    this.rotationSpeed = 0.002;
    this.mouseDamping = 0.05;
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
      this.clock = new THREE.Clock();

      // Setup scene
      this.scene = new THREE.Scene();
      this.scene.background = null; // Transparent

      // Setup camera based on container dimensions
      const container = this.canvas.parentElement;
      const aspect = container.clientWidth / container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
      this.camera.position.set(1, 0, 12);
      this.camera.lookAt(1, 0, 0);

      // Load GLB model
      await this.loadModel();

      // Setup lighting
      createLighting(THREE, this.scene);

      // Create 3D text labels
      // await this.createTextLabels(); // DISABLED: Labels hidden for cleaner view

      // Apply 3x zoom using bounding-box framing
      if (this.model) {
        // Fit camera to object with moderate framing
        this.fitCameraToObject(this.model, 4.4);
        
        // Optional: Apply additional camera zoom for extra punch
        // this.camera.zoom = 1.2;
        // this.camera.updateProjectionMatrix();
      }

      // Setup post-processing
      await this.setupPostProcessing();

      // Setup mouse tracking
      this.setupMouseTracking();

      // Handle resize
      this.handleResize();
      window.addEventListener('resize', () => this.handleResize());

      // Start animation
      this.animationLoop = createAnimationLoop(() => this.animate());
      this.animationLoop.start();

      return true;
    } catch (error) {
      console.error('Failed to initialize HeroScene3D:', error);
      return false;
    }
  }

  async loadModel() {
    // Dynamically import GLTFLoader
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    
    const loader = new GLTFLoader();
    
    return new Promise((resolve, reject) => {
      loader.load(
        '/3D%20ball%20and%20puck/base_basic_pbr.glb',
        (gltf) => {
          this.model = gltf.scene;
          
          // Apply custom materials to model
          this.model.traverse((child) => {
            if (child.isMesh) {
              // Identify ball vs puck by position or name
              const isBall = child.position.y > 0 || child.name.toLowerCase().includes('ball') || child.name.toLowerCase().includes('sphere');
              
              if (isBall) {
                this.ball = child;
                // Apply silver metal-glass material to ball
                const silverMat = createSilverMaterial(this.THREE);
                applyMicroTexture(silverMat, this.THREE, 0.08);
                child.material = silverMat;
              } else {
                this.puck = child;
                // Apply slightly darker glass material to puck
                const glassMat = createGlassMaterial(this.THREE);
                child.material = glassMat;
              }
              
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          // If we didn't identify ball/puck by name, use the first mesh as ball
          if (!this.ball && this.model.children.length > 0) {
            this.ball = this.model.children.find(c => c.isMesh) || this.model.children[0];
          }
          
          // Scale model down to about 1/4 size and position it slightly to the right
          this.model.scale.setScalar(0.35);
          this.model.position.set(1, 0, 0);
          
          this.scene.add(this.model);
          resolve();
        },
        (progress) => {
          console.log('Loading model:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
        },
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  }

  fitCameraToObject(object, offset = 1.2) {
    const box = new this.THREE.Box3().setFromObject(object);
    const size = box.getSize(new this.THREE.Vector3());
    const center = box.getCenter(new this.THREE.Vector3());

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeight = maxSize / (2 * Math.tan(this.THREE.MathUtils.degToRad(this.camera.fov * 0.5)));
    const fitWidth = fitHeight / this.camera.aspect;
    const distance = offset * Math.max(fitHeight, fitWidth);

    const dir = new this.THREE.Vector3()
      .subVectors(this.camera.position, center)
      .normalize();

    this.camera.position.copy(center).add(dir.multiplyScalar(distance));
    
    // Clamp near/far for depth precision
    this.camera.near = Math.max(0.01, distance / 100);
    this.camera.far = Math.min(2000, distance * 100);
    this.camera.updateProjectionMatrix();
    
    this.camera.lookAt(center);
  }

  async createTextLabels() {
    const labels = [
      { text: 'deployment', position: { x: -0.5, y: 1.5, z: 0 } },
      { text: 'monitoring', position: { x: 3, y: 0.8, z: 0 } },
      { text: 'testing', position: { x: -1, y: -1, z: 0 } },
      { text: 'version control', position: { x: 3.2, y: -1.3, z: 0 } }
    ];

    try {
      // Dynamically import FontLoader and TextGeometry
      const { FontLoader } = await import('three/addons/loaders/FontLoader.js');
      const { TextGeometry } = await import('three/addons/geometries/TextGeometry.js');
      
      const loader = new FontLoader();
      
      // Load font
      const font = await new Promise((resolve, reject) => {
        loader.load(
          'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
          resolve,
          undefined,
          reject
        );
      });

      // Create matte-silver material for text
      const textMaterial = new this.THREE.MeshPhysicalMaterial({
        color: TOKENS.silver1,
        metalness: 0.05,
        roughness: 0.20,
        clearcoat: 0.1,
        clearcoatRoughness: 0.1
      });

      // Create line material for connections
      const lineMaterial = new this.THREE.LineBasicMaterial({
        color: TOKENS.highlight1,
        transparent: true,
        opacity: 0.3
      });

      for (const label of labels) {
        // Create text geometry
        const textGeometry = new TextGeometry(label.text, {
          font: font,
          size: 0.12,
          height: 0.01,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.003,
          bevelSize: 0.003,
          bevelSegments: 3
        });

        textGeometry.computeBoundingBox();
        const centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);

        const textMesh = new this.THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(
          label.position.x + centerOffset,
          label.position.y,
          label.position.z
        );

        // Make text always face camera (billboard effect)
        textMesh.userData.isBillboard = true;

        this.scene.add(textMesh);
        this.textLabels.push(textMesh);

        // Create connecting line from label to model center (at 1, 0, 0)
        const lineGeometry = new this.THREE.BufferGeometry().setFromPoints([
          new this.THREE.Vector3(label.position.x, label.position.y, label.position.z),
          new this.THREE.Vector3(1, 0, 0)
        ]);
        
        const line = new this.THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(line);
        this.labelLines.push({ line, start: label.position });
      }

    } catch (error) {
      console.warn('Failed to create 3D text labels:', error);
      // If 3D text fails, we could fallback to sprites here
    }
  }

  setupMouseTracking() {
    const onMouseMove = (event) => {
      // Convert to normalized device coordinates (-1 to +1)
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Convert to target rotation
      this.targetRotation.x = this.mouse.y * 0.3;
      this.targetRotation.y = this.mouse.x * 0.3;
    };

    window.addEventListener('mousemove', onMouseMove, false);
  }

  async setupPostProcessing() {
    // Dynamically import post-processing modules
    const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
    const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js');

    // Create composer
    this.composer = new EffectComposer(this.renderer);

    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Add bloom pass
    const container = this.canvas.parentElement;
    const bloomPass = new UnrealBloomPass(
      new this.THREE.Vector2(container.clientWidth, container.clientHeight),
      PARAMS.BLOOM_STRENGTH,
      PARAMS.BLOOM_RADIUS,
      PARAMS.BLOOM_THRESHOLD
    );

    this.composer.addPass(bloomPass);
  }

  animate() {
    if (!this.model || !this.composer) return;

    const time = this.clock.getElapsedTime();

    // Floating animation
    if (this.ball) {
      const baseY = this.ball.userData.baseY !== undefined ? this.ball.userData.baseY : this.ball.position.y;
      if (this.ball.userData.baseY === undefined) {
        this.ball.userData.baseY = baseY;
      }
      
      this.ball.position.y = baseY + Math.sin(time * this.floatSpeed) * this.floatAmount;
    }

    // Slow rotation
    if (!prefersReducedMotion()) {
      this.model.rotation.y += this.rotationSpeed;
    }

    // Mouse tracking with lerp smoothing
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * this.mouseDamping;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * this.mouseDamping;

    if (this.model) {
      this.model.rotation.x = this.currentRotation.x;
      // Combine manual rotation with mouse rotation
      this.model.rotation.y += this.currentRotation.y * 0.01;
    }

    // Update billboard text labels to face camera (only if labels exist)
    if (this.textLabels.length > 0) {
      this.textLabels.forEach(label => {
        if (label.userData.isBillboard) {
          label.lookAt(this.camera.position);
        }
      });
    }

    // Update connecting lines (only if lines exist)
    if (this.labelLines.length > 0) {
      this.labelLines.forEach(({ line, start }) => {
        const positions = line.geometry.attributes.position.array;
        // Update end point to follow ball position if it exists
        if (this.ball) {
          const ballWorldPos = new this.THREE.Vector3();
          this.ball.getWorldPosition(ballWorldPos);
          positions[3] = ballWorldPos.x;
          positions[4] = ballWorldPos.y;
          positions[5] = ballWorldPos.z;
        }
        line.geometry.attributes.position.needsUpdate = true;
      });
    }

    // Render with post-processing
    this.composer.render();
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;

    const container = this.canvas.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance

    if (this.composer) {
      this.composer.setSize(width, height);
    }
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
    if (this.model) {
      this.model.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }

    this.textLabels.forEach(label => {
      if (label.geometry) label.geometry.dispose();
      if (label.material) label.material.dispose();
    });

    this.labelLines.forEach(({ line }) => {
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
  }
}

