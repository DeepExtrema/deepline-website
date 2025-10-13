/**
 * Overmind Orb Prototype
 * For JSFiddle: https://jsfiddle.net/boilerplate/threejs
 * 
 * INSTRUCTIONS:
 * 1. Go to https://jsfiddle.net/
 * 2. Use Three.js boilerplate or add Three.js CDN
 * 3. Copy this code to JavaScript panel
 * 4. Run to see warm matte orb with connection lines
 */

// ============================================================================
// SCENE SETUP
// ============================================================================

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 6);
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
// WARM MATTE MATERIAL
// ============================================================================

const warmMatteMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x8F8A83,              // Warm dark silver
  metalness: 0.12,
  roughness: 0.28,
  ior: 1.45,
  transmission: 0.16,
  thickness: 0.36,
  specularIntensity: 0.55,
  clearcoat: 0.08,
  clearcoatRoughness: 0.12,
  envMapIntensity: 0.9,
  side: THREE.DoubleSide
});

// ============================================================================
// CENTRAL SPHERE (Overmind Hub)
// ============================================================================

const sphereGeometry = new THREE.SphereGeometry(0.8, 64, 64);
const sphere = new THREE.Mesh(sphereGeometry, warmMatteMaterial);
scene.add(sphere);

// ============================================================================
// EQUATOR RING
// ============================================================================

const ringGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 64);
const ring = new THREE.Mesh(ringGeometry, warmMatteMaterial);
ring.rotation.x = Math.PI / 2; // Horizontal ring
scene.add(ring);

// ============================================================================
// CONNECTION NODES (pulsing points)
// ============================================================================

const connections = [
  { label: 'deployment', angle: 0, radius: 2.5 },
  { label: 'monitoring', angle: Math.PI / 2, radius: 2.5 },
  { label: 'testing', angle: Math.PI, radius: 2.5 },
  { label: 'version control', angle: Math.PI * 1.5, radius: 2.5 }
];

const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
const nodeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x00B5D8,              // Accent color
  emissive: 0x00B5D8,
  emissiveIntensity: 0.5,
  metalness: 0.8,
  roughness: 0.2
});

const nodes = [];
const lines = [];

connections.forEach((conn, i) => {
  // Create node sphere
  const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
  const x = Math.cos(conn.angle) * conn.radius;
  const z = Math.sin(conn.angle) * conn.radius;
  node.position.set(x, 0, z);
  scene.add(node);
  nodes.push(node);
  
  // Create connection line from sphere to node
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00B5D8,
    transparent: true,
    opacity: 0.3,
    linewidth: 2  // Note: linewidth doesn't work on most platforms, use Line2 for thick lines
  });
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),  // Center of sphere
    new THREE.Vector3(x, 0, z)   // Node position
  ]);
  
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  lines.push(line);
});

// ============================================================================
// LABELS (using CSS3DRenderer or HTML overlay)
// ============================================================================

// For JSFiddle, we'll use HTML divs positioned via screen coordinates
// In production, use CSS3DRenderer or troika-three-text

const labelContainer = document.createElement('div');
labelContainer.style.position = 'absolute';
labelContainer.style.top = '0';
labelContainer.style.left = '0';
labelContainer.style.width = '100%';
labelContainer.style.height = '100%';
labelContainer.style.pointerEvents = 'none';
labelContainer.style.color = '#A9B0BA';
labelContainer.style.fontFamily = 'Arial, sans-serif';
labelContainer.style.fontSize = '14px';
document.body.appendChild(labelContainer);

const labels = connections.map((conn, i) => {
  const label = document.createElement('div');
  label.textContent = conn.label;
  label.style.position = 'absolute';
  label.style.transform = 'translate(-50%, -50%)';
  labelContainer.appendChild(label);
  return label;
});

function updateLabels() {
  nodes.forEach((node, i) => {
    // Project 3D position to 2D screen coordinates
    const vector = node.position.clone();
    vector.project(camera);
    
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
    
    labels[i].style.left = `${x}px`;
    labels[i].style.top = `${y}px`;
  });
}

// ============================================================================
// LIGHTING SETUP
// ============================================================================

// Key Rim Light
const keyRim = new THREE.DirectionalLight(0xE9F1F6, 0.72);
keyRim.position.set(-3, 4, 2);
scene.add(keyRim);

// Counter Rim
const counterRim = new THREE.DirectionalLight(0xCFE0EA, 0.38);
counterRim.position.set(3, 3, -2);
scene.add(counterRim);

// Soft fill
const fillLight = new THREE.AmbientLight(0x78736D, 0.18);
scene.add(fillLight);

// Hemisphere light
const hemiLight = new THREE.HemisphereLight(0xCFE0EA, 0x252320, 0.25);
scene.add(hemiLight);

// ============================================================================
// ENVIRONMENT (simplified)
// ============================================================================

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
scene.environment = pmremGenerator.fromScene(scene).texture;

// ============================================================================
// ANIMATION LOOP
// ============================================================================

let time = 0;
const rotationSpeed = 0.15;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;
  
  // Slow rotation of entire scene
  sphere.rotation.y += rotationSpeed * 0.008;
  ring.rotation.z += rotationSpeed * 0.005;
  
  // Pulse connection nodes (±5% intensity)
  nodes.forEach((node, i) => {
    const pulsePhase = time + (i * Math.PI / 2); // Stagger pulses
    const pulseIntensity = 0.5 + Math.sin(pulsePhase) * 0.05;
    node.material.emissiveIntensity = pulseIntensity;
    
    // Slight scale pulse
    const scale = 1 + Math.sin(pulsePhase) * 0.1;
    node.scale.setScalar(scale);
  });
  
  // Pulse line opacity
  lines.forEach((line, i) => {
    const pulsePhase = time + (i * Math.PI / 2);
    line.material.opacity = 0.3 + Math.sin(pulsePhase) * 0.1;
  });
  
  // Update label positions
  updateLabels();
  
  // Render
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
// NOTES & ENHANCEMENTS
// ============================================================================

/*
PRODUCTION ENHANCEMENTS:

1. Use CSS3DRenderer or troika-three-text for better labels
2. Use Line2 (LineGeometry + LineMaterial) for thick connection lines
3. Add bloom post-processing (UnrealBloomPass)
4. Add more connection nodes (8-12 total in radial pattern)
5. Add vertical rings or orbital paths
6. Add particle effects at connection points
7. Add hover interactions (highlight node + label on mouseover)
8. Add data flow animation (particles traveling along lines)

MATERIAL TWEAKS:
- Make sphere more transparent: transmission 0.16 → 0.30
- Add inner glow: Add emissive 0x78736D with low intensity
- Layered materials: Outer glass shell + inner core

ANIMATION TWEAKS:
- Add subtle wobble: sphere.rotation.x = Math.sin(time * 0.3) * 0.05
- Rotate node positions: nodes orbit around sphere
- Add camera drift: camera slowly orbits scene

CONNECTION LINE TWEAKS:
- Gradient opacity (bright at sphere, fade at nodes)
- Animated dashes (shader-based)
- Bezier curves instead of straight lines
*/

