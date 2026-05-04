/**
 * Centralized Draco Loader Configuration
 * Provides singleton Draco loader for efficient model compression
 */

// @ts-ignore
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

let dracoLoader: DRACOLoader | null = null
let gltfLoader: GLTFLoader | null = null

/**
 * Get or create singleton Draco loader
 */
export function getDracoLoader(): DRACOLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/")
    dracoLoader.setDecoderConfig({ type: "js" })
    dracoLoader.preload()
  }
  return dracoLoader
}

/**
 * Get or create singleton GLTF loader with Draco support
 */
export function getGLTFLoader(): GLTFLoader {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(getDracoLoader())
  }
  return gltfLoader
}

/**
 * Dispose loaders (call on unmount if needed)
 */
export function disposeLoaders() {
  if (dracoLoader) {
    dracoLoader.dispose()
    dracoLoader = null
  }
  gltfLoader = null
}
