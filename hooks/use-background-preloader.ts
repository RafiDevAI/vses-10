"use client"

import { useEffect, useState, useCallback } from "react"
import { useGLTF } from "@react-three/drei"

interface PreloadConfig {
  models: string[]
  priority?: "high" | "low"
  onProgress?: (loaded: number, total: number) => void
  onComplete?: () => void
}

/**
 * Background preloader hook for 3D models
 * Preloads models in the background using requestIdleCallback
 */
export function useBackgroundPreloader(config: PreloadConfig) {
  const [isPreloading, setIsPreloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)

  const preloadModels = useCallback(() => {
    if (typeof window === "undefined") return

    setIsPreloading(true)
    let loaded = 0
    const total = config.models.length

    const preloadNext = (index: number) => {
      if (index >= total) {
        setIsPreloading(false)
        config.onComplete?.()
        return
      }

      const preloadFn = () => {
        try {
          // Preload using useGLTF's preload method
          useGLTF.preload(config.models[index])
          loaded++
          setLoadedCount(loaded)
          setProgress((loaded / total) * 100)
          config.onProgress?.(loaded, total)

          // Preload next model
          if (config.priority === "high") {
            // High priority: preload immediately
            preloadNext(index + 1)
          } else {
            // Low priority: use requestIdleCallback
            if ("requestIdleCallback" in window) {
              requestIdleCallback(() => preloadNext(index + 1), { timeout: 2000 })
            } else {
              setTimeout(() => preloadNext(index + 1), 100)
            }
          }
        } catch (error) {
          console.error(`[v0] Failed to preload model: ${config.models[index]}`, error)
          preloadNext(index + 1)
        }
      }

      if (config.priority === "high" || index === 0) {
        preloadFn()
      } else {
        if ("requestIdleCallback" in window) {
          requestIdleCallback(preloadFn, { timeout: 2000 })
        } else {
          setTimeout(preloadFn, 100)
        }
      }
    }

    preloadNext(0)
  }, [config])

  useEffect(() => {
    // Start preloading after initial render
    const timer = setTimeout(() => {
      preloadModels()
    }, 100)

    return () => clearTimeout(timer)
  }, [preloadModels])

  return {
    isPreloading,
    progress,
    loadedCount,
    totalCount: config.models.length,
  }
}
