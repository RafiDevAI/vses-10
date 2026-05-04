/**
 * Texture Optimization Utilities
 * Compresses and optimizes textures based on device capabilities
 */

import * as THREE from "three"
import { detectDeviceCapabilities } from "./3d-optimization-config"

export interface TextureOptimizationOptions {
  maxSize?: number
  quality?: number
  format?: THREE.CompressedPixelFormat
  generateMipmaps?: boolean
}

/**
 * Optimize texture based on device capabilities
 */
export function optimizeTexture(texture: THREE.Texture, options?: TextureOptimizationOptions): THREE.Texture {
  const device = detectDeviceCapabilities()

  // Default options based on device
  const maxSize = options?.maxSize || (device.isMobile ? 1024 : 2048)
  const quality = options?.quality || (device.isMobile ? 0.7 : 0.9)

  // Set texture properties for optimization
  texture.minFilter = device.isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = options?.generateMipmaps ?? !device.isMobile
  texture.anisotropy = device.isMobile ? 1 : 4

  // Compress texture if possible
  if (texture.image) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const image = texture.image as any

    if (ctx && image.width && image.height) {
      // Resize if needed
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
      canvas.width = image.width * scale
      canvas.height = image.height * scale

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      texture.image = canvas
      texture.needsUpdate = true
    }
  }

  return texture
}

/**
 * Create optimized texture from URL
 */
export async function loadOptimizedTexture(url: string, options?: TextureOptimizationOptions): Promise<THREE.Texture> {
  const loader = new THREE.TextureLoader()
  const texture = await loader.loadAsync(url)
  return optimizeTexture(texture, options)
}

/**
 * Batch optimize multiple textures
 */
export function optimizeTextures(textures: THREE.Texture[], options?: TextureOptimizationOptions): THREE.Texture[] {
  return textures.map((texture) => optimizeTexture(texture, options))
}
