/**
 * Lemniscate (Infinity ∞) Prototype
 * For JSFiddle: https://jsfiddle.net/boilerplate/threejs
 * 
 * INSTRUCTIONS:
 * 1. Go to https://jsfiddle.net/
 * 2. Use Three.js boilerplate or add Three.js CDN
 * 3. Copy this code to JavaScript panel
 * 4. Run to see warm matte infinity ribbon
 */

// ============================================================================
// PARAMETRIC LEMNISCATE CURVE
// ============================================================================

class LemniscateCurve extends THREE.Curve {
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }
  
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const angle = t * Math.PI * 2;
    const divisor = 3 - Math.cos(2 * angle);
    const scale = (2 * this.scale) / divisor;
    
    const x = scale * Math.cos(angle);
    const y = scale * Math.sin(2 * angle) / 2;
    const z = 0;
    
    return optionalTarget.set(x, y, z);
  }
}

// ============================================================================
// SCENE SETUP
// ============================================================================

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  42,                           // FOV
  window.innerWidth / window.innerHeight,  // Aspect
  0.1,                         // Near
  100                          // Far
);
camera.position.set(0, -0.5, 5);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

// ============================================================================
// LEMNISCATE GEOMETRY
// ============================================================================

const curve = new LemniscateCurve(0.9);
const geometry = new THREE.TubeGeometry(
  curve,      // Path curve
  128,        // Tubular segments (resolution along path)
  0.12,       // Radius (thin ribbon)
  16,         // Radial segments (cross-section resolution)
  false       // Not closed
);

// ============================================================================
// WARM MATTE MATERIAL
// ============================================================================

const material = new THREE.MeshPhysicalMaterial({
  color: 0x8F8A83,              // Warm dark silver body
  metalness: 0.12,              // Low metalness (matte)
  roughness: 0.28,              // Higher roughness
  ior: 1.45,
  transmission: 0.16,           // Subtle translucency
  thickness: 0.36,
  specularIntensity: 0.55,      // Reduced specular
  clearcoat: 0.08,              // Minimal clearcoat
  clearcoatRoughness: 0.12,     // Rough clearcoat
  envMapIntensity: 0.9,         // Subtle reflections
  side: THREE.DoubleSide        // Visible from both sides
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ============================================================================
// LIGHTING SETUP
// ============================================================================

// Key Rim Light (upper-left/front, grazing angle)
const keyRim = new THREE.DirectionalLight(0xE9F1F6, 0.72);
keyRim.position.set(-3, 4, 2);
scene.add(keyRim);

// Counter Rim (upper-right/back, 40-60% of key)
const counterRim = new THREE.DirectionalLight(0xCFE0EA, 0.38);
counterRim.position.set(3, 3, -2);
scene.add(counterRim);

// Soft fill (below/center)
const fillLight = new THREE.AmbientLight(0x78736D, 0.18);
scene.add(fillLight);

// Hemisphere light (cool above, warm below)
const hemiLight = new THREE.HemisphereLight(0xCFE0EA, 0x252320, 0.25);
scene.add(hemiLight);

// ============================================================================
// ROOM ENVIRONMENT (PMREM)
// ============================================================================

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Note: RoomEnvironment requires import
// For JSFiddle, you can skip this or use a simple environment
// Uncomment if using ES modules:
/*
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js';

const roomEnvironment = new RoomEnvironment();
const envScene = new THREE.Scene();
envScene.add(roomEnvironment);
const envMap = pmremGenerator.fromScene(envScene).texture;
scene.environment = envMap;

pmremGenerator.dispose();
roomEnvironment.dispose();
*/

// Simple fallback: use scene as environment
scene.environment = pmremGenerator.fromScene(scene).texture;

// ============================================================================
// POST-PROCESSING (BLOOM)
// ============================================================================

// Note: UnrealBloomPass requires imports
// For JSFiddle without modules, this is simplified
// Full implementation would use EffectComposer

// To add bloom in full setup:
/*
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.22,   // Strength (warm matte: weaker)
  0.4,    // Radius (tight)
  0.96    // Threshold (higher = less bloom)
);
composer.addPass(bloomPass);
*/

// ============================================================================
// ANIMATION LOOP
// ============================================================================

let rotationSpeed = 0.15; // ≤0.2 rad/s

function animate() {
  requestAnimationFrame(animate);
  
  // Slow rotation
  mesh.rotation.y += rotationSpeed * 0.01;
  
  // Render
  // Use composer.render() if bloom is enabled
  renderer.render(scene, camera);
}

animate();

// ============================================================================
// RESPONSIVE RESIZE
// ============================================================================

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // If using composer:
  // composer.setSize(width, height);
});

// ============================================================================
// CONTROLS (OPTIONAL)
// ============================================================================

// Add OrbitControls for interactive testing
/*
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// In animate loop: controls.update();
*/

// ============================================================================
// NOTES & TWEAKS
// ============================================================================

/*
MATERIAL TWEAKS:
- Increase metalness (0.12 → 0.20) for shinier look
- Decrease roughness (0.28 → 0.18) for more gloss
- Increase transmission (0.16 → 0.25) for more translucency

BLOOM TWEAKS:
- Lower threshold (0.96 → 0.94) for more bloom
- Increase strength (0.22 → 0.28) for brighter glow
- Increase radius (0.4 → 0.5) for softer spread

GEOMETRY TWEAKS:
- Increase tube radius (0.12 → 0.15) for thicker ribbon
- Increase tubular segments (128 → 256) for smoother curves
- Increase radial segments (16 → 32) for rounder cross-section

ANIMATION TWEAKS:
- Increase rotationSpeed (0.15 → 0.25) for faster rotation
- Add wobble: mesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
*/

