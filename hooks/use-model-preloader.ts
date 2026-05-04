"use client"

import { useState, useCallback, useEffect } from "react"
import { MODEL_CACHE_CONFIG } from "@/lib/3d-optimization-config"
import { useGLTF } from "@react-three/drei"

interface ModelCache {
  [key: string]: {
    data: any
    timestamp: number
    size: number
  }
}

const modelCache: ModelCache = {}
let totalCacheSize = 0

export function useModelPreloader(modelUrls: string[]) {
  const [loadedModels, setLoadedModels] = useState<Set<string>>(new Set())
  const [isPreloading, setIsPreloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const preloadModel = useCallback(async (url: string) => {
    // Check cache first
    if (modelCache[url]) {
      const cached = modelCache[url]
      // Check if cache is still valid
      if (Date.now() - cached.timestamp < MODEL_CACHE_CONFIG.maxAge) {
        return cached.data
      } else {
        // Remove expired cache
        totalCacheSize -= cached.size
        delete modelCache[url]
      }
    }

    try {
      // Use useGLTF's preload method with Draco support
      useGLTF.preload(url)

      // Mark as loaded
      setLoadedModels((prev) => new Set([...prev, url]))

      // Cache the model reference
      modelCache[url] = {
        data: true,
        timestamp: Date.now(),
        size: 0, // Size tracking would require actual model data
      }

      return true
    } catch (error) {
      console.error(`[v0] Failed to preload model: ${url}`, error)
      setError(`Failed to load: ${url}`)
      return null
    }
  }, [])

  const preloadAll = useCallback(async () => {
    setIsPreloading(true)
    setProgress(0)
    setError(null)

    for (let i = 0; i < modelUrls.length; i++) {
      await preloadModel(modelUrls[i])
      setProgress(((i + 1) / modelUrls.length) * 100)
    }

    setIsPreloading(false)
  }, [modelUrls, preloadModel])

  const clearCache = useCallback(() => {
    Object.keys(modelCache).forEach((key) => delete modelCache[key])
    totalCacheSize = 0
    setLoadedModels(new Set())
  }, [])

  useEffect(() => {
    if (modelUrls.length > 0) {
      // Use requestIdleCallback for background preloading
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => preloadAll(), { timeout: 2000 })
      } else {
        setTimeout(preloadAll, 100)
      }
    }
  }, [modelUrls, preloadAll])

  return {
    preloadAll,
    isPreloading,
    progress,
    loadedModels,
    clearCache,
    error,
    cacheSize: totalCacheSize,
  }
}
