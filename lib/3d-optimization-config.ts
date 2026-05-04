/**
 * 3D Optimization Configuration
 * Handles device detection, quality settings, and performance optimization
 */

export interface QualitySettings {
  textureQuality: number
  shadowQuality: "off" | "low" | "medium" | "high"
  antialias: boolean
  pixelRatio: number
  maxLights: number
  enablePostProcessing: boolean
  lodDistances: [number, number, number]
}

export interface DeviceCapabilities {
  isMobile: boolean
  isTablet: boolean
  isLowEnd: boolean
  gpu: string
  memory: number
}

// Detect device capabilities
export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isTablet: false,
      isLowEnd: false,
      gpu: "unknown",
      memory: 8,
    }
  }

  const ua = navigator.userAgent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua)

  // Check for low-end devices
  const isLowEnd =
    isMobile && (/Android [1-4]\./i.test(ua) || /iPhone OS [1-9]_/i.test(ua) || navigator.hardwareConcurrency <= 2)

  // @ts-ignore - WebGL context for GPU detection
  const canvas = document.createElement("canvas")
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
  // @ts-ignore
  const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info")
  // @ts-ignore
  const gpu = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown"

  // @ts-ignore - Memory detection
  const memory = (navigator as any).deviceMemory || 8

  return { isMobile, isTablet, isLowEnd, gpu, memory }
}

// Get quality settings based on device
export function getQualitySettings(forceQuality?: "low" | "medium" | "high"): QualitySettings {
  const device = detectDeviceCapabilities()

  // Mobile-first: prioritize speed over quality
  if (forceQuality === "low" || device.isLowEnd || (device.isMobile && device.memory < 4)) {
    return {
      textureQuality: 0.5,
      shadowQuality: "off",
      antialias: false,
      pixelRatio: 1,
      maxLights: 2,
      enablePostProcessing: false,
      lodDistances: [5, 15, 30], // Aggressive LOD for mobile
    }
  }

  if (forceQuality === "medium" || device.isMobile || device.memory < 6) {
    return {
      textureQuality: 0.75,
      shadowQuality: "low",
      antialias: true,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      maxLights: 3,
      enablePostProcessing: false,
      lodDistances: [10, 25, 50],
    }
  }

  // Desktop: high quality with smooth experience
  return {
    textureQuality: 1,
    shadowQuality: "high",
    antialias: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    maxLights: 5,
    enablePostProcessing: true,
    lodDistances: [15, 40, 80],
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 60
  private fpsHistory: number[] = []

  update() {
    this.frameCount++
    const currentTime = performance.now()
    const delta = currentTime - this.lastTime

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta)
      this.fpsHistory.push(this.fps)
      if (this.fpsHistory.length > 60) this.fpsHistory.shift()

      this.frameCount = 0
      this.lastTime = currentTime
    }
  }

  getFPS(): number {
    return this.fps
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60
    return Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
  }

  isPerformanceGood(): boolean {
    return this.getAverageFPS() >= 30
  }
}

// Draco loader configuration
export const DRACO_DECODER_CONFIG = {
  decoderPath: "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
  decoderConfig: {
    type: "js",
  },
}

// Model caching configuration
export const MODEL_CACHE_CONFIG = {
  maxSize: 50 * 1024 * 1024, // 50MB
  maxAge: 30 * 60 * 1000, // 30 minutes
}

// Performance targets and memory monitoring
export const PERFORMANCE_TARGETS = {
  MOBILE_FIRST_LOAD_MS: 5000, // 5 seconds max for mobile first load
  DESKTOP_FIRST_LOAD_MS: 3000, // 3 seconds max for desktop first load
  TARGET_FPS_MOBILE: 30,
  TARGET_FPS_DESKTOP: 60,
  MAX_MEMORY_MB_MOBILE: 200,
  MAX_MEMORY_MB_DESKTOP: 500,
}

export function getMemoryUsage(): number {
  if (typeof window === "undefined") return 0
  // @ts-ignore
  const memory = (performance as any).memory
  if (memory) {
    return Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
  }
  return 0
}
