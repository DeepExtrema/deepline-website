/**
 * Token-Driven Material Presets
 * Deepline Metal-Glass Style Language
 */

// Design Tokens from style guide
export const TOKENS = {
  // Highlights
  highlight1: 0xE9F1F6,
  highlight2: 0xCFE0EA,
  
  // Silver midtones
  silver1: 0xA6B7C3,
  silver2: 0x8C9AA6,
  
  // Shadows (cool)
  shadow1: 0x47525B,
  shadow2: 0x2B3238,
  
  // Bloom/Rim
  bloom: 0xDDEAF3,
  
  // Base for materials
  silverBase: 0x9CAFB9,
  glassBase: 0xCFE0EA,
  
  // Background
  bg: 0x000000
};

// Tweakable parameters
export const PARAMS = {
  // Silver material
  SILVER_METALNESS: 0.85,
  SILVER_ROUGHNESS: 0.18,
  SILVER_CLEARCOAT: 0.15,
  SILVER_CLEARCOAT_ROUGHNESS: 0.08,
  SILVER_REFLECTIVITY: 0.7,
  
  // Glass material
  GLASS_METALNESS: 0.15,
  GLASS_ROUGHNESS: 0.15,
  GLASS_TRANSMISSION: 0.20,
  GLASS_THICKNESS: 0.3,
  GLASS_IOR: 1.47,
  
  // Bloom post-processing
  BLOOM_THRESHOLD: 0.94,
  BLOOM_STRENGTH: 0.28,
  BLOOM_RADIUS: 0.5,
  
  // Lighting
  RIM_INTENSITY: 0.85,
  COUNTER_RIM_INTENSITY: 0.42, // 50% of key rim
  FILL_INTENSITY: 0.15
};

/**
 * Create Silver Metal-Glass Material (Cool Silver theme)
 * High metalness, low roughness, strong Fresnel
 */
export function createSilverMaterial(THREE) {
  return new THREE.MeshPhysicalMaterial({
    color: TOKENS.silverBase,
    metalness: PARAMS.SILVER_METALNESS,
    roughness: PARAMS.SILVER_ROUGHNESS,
    clearcoat: PARAMS.SILVER_CLEARCOAT,
    clearcoatRoughness: PARAMS.SILVER_CLEARCOAT_ROUGHNESS,
    reflectivity: PARAMS.SILVER_REFLECTIVITY,
    ior: 1.5,
    envMapIntensity: 1.2,
    // Micro-texture applied via normalMap if provided
  });
}

/**
 * Create Glass Material
 * Lower metalness, with transmission for translucency
 */
export function createGlassMaterial(THREE) {
  return new THREE.MeshPhysicalMaterial({
    color: TOKENS.glassBase,
    metalness: PARAMS.GLASS_METALNESS,
    roughness: PARAMS.GLASS_ROUGHNESS,
    transmission: PARAMS.GLASS_TRANSMISSION,
    thickness: PARAMS.GLASS_THICKNESS,
    ior: PARAMS.GLASS_IOR,
    clearcoat: 0.2,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.0,
  });
}

/**
 * Create subtle noise normal map for micro-texture
 * Strength: 6-12% (0.06-0.12)
 */
export function createMicroTextureNormal(THREE, strength = 0.08) {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  
  for (let i = 0; i < size * size; i++) {
    const stride = i * 4;
    // Very subtle noise - barely perceptible
    const noise = (Math.random() - 0.5) * strength;
    const value = Math.floor((128 + noise * 127));
    
    data[stride] = value;     // R
    data[stride + 1] = value; // G
    data[stride + 2] = 255;   // B (up direction)
    data[stride + 3] = 255;   // A
  }
  
  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat
  );
  
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  
  return texture;
}

/**
 * Apply micro-texture to material
 */
export function applyMicroTexture(material, THREE, strength = 0.08, renderer = null) {
  material.normalMap = createMicroTextureNormal(THREE, strength);
  material.normalScale = new THREE.Vector2(0.1, 0.1); // Very subtle
  
  // Apply anisotropic filtering for sharper textures
  if (renderer && material.normalMap) {
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    material.normalMap.anisotropy = maxAnisotropy;
  }
  
  material.needsUpdate = true;
}

/**
 * Create environment lighting setup
 */
export function createLighting(THREE, scene) {
  // Key Rim Light (upper-left/front, grazing angle) - reduced intensity
  const keyRim = new THREE.DirectionalLight(TOKENS.highlight1, PARAMS.RIM_INTENSITY * 0.7);
  keyRim.position.set(-3, 4, 2);
  scene.add(keyRim);
  
  // Counter Rim (upper-right/back, 40-50% of key) - reduced intensity
  const counterRim = new THREE.DirectionalLight(TOKENS.highlight2, PARAMS.COUNTER_RIM_INTENSITY * 0.6);
  counterRim.position.set(3, 3, -2);
  scene.add(counterRim);
  
  // Softer fill light
  const fillLight = new THREE.AmbientLight(TOKENS.silver2, PARAMS.FILL_INTENSITY * 1.5);
  scene.add(fillLight);
  
  // Hemisphere light for subtle gradient (cool above, neutral below) - reduced intensity
  const hemiLight = new THREE.HemisphereLight(TOKENS.highlight2, TOKENS.shadow2, 0.2);
  scene.add(hemiLight);
  
  return { keyRim, counterRim, fillLight, hemiLight };
}

/**
 * Create PMREM environment map using RoomEnvironment
 * Provides realistic reflections for MeshPhysicalMaterial
 * @param {THREE} THREE - Three.js instance
 * @param {THREE.WebGLRenderer} renderer - WebGL renderer
 * @param {THREE.Scene} scene - Scene to apply environment to
 */
export async function createEnvironment(THREE, renderer, scene) {
  try {
    // Dynamically import RoomEnvironment
    const { RoomEnvironment } = await import(
      'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js'
    );
    
    // Create PMREM generator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    // Create room environment
    const environment = new RoomEnvironment();
    const envScene = new THREE.Scene();
    envScene.add(environment);
    
    // Generate environment map
    const envMap = pmremGenerator.fromScene(envScene).texture;
    
    // Apply to scene
    scene.environment = envMap;
    
    // Cleanup
    pmremGenerator.dispose();
    environment.dispose();
    envScene.clear();
    
    return envMap;
  } catch (error) {
    console.error('Failed to create environment map:', error);
    return null;
  }
}

