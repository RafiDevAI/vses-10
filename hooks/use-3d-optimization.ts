"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
  getQualitySettings,
  detectDeviceCapabilities,
  PerformanceMonitor,
  type QualitySettings,
} from "@/lib/3d-optimization-config"

export function use3DOptimization() {
  const [qualitySettings, setQualitySettings] = useState<QualitySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fps, setFps] = useState(60)
  const performanceMonitor = useRef<PerformanceMonitor | null>(null)

  useEffect(() => {
    // Initialize on client side only
    const settings = getQualitySettings()
    setQualitySettings(settings)
    setIsLoading(false)

    performanceMonitor.current = new PerformanceMonitor()

    // Monitor FPS
    let animationFrameId: number
    const updateFPS = () => {
      if (performanceMonitor.current) {
        performanceMonitor.current.update()
        setFps(performanceMonitor.current.getFPS())
      }
      animationFrameId = requestAnimationFrame(updateFPS)
    }
    updateFPS()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const adjustQuality = useCallback((quality: "low" | "medium" | "high") => {
    const newSettings = getQualitySettings(quality)
    setQualitySettings(newSettings)
  }, [])

  return {
    qualitySettings,
    isLoading,
    fps,
    adjustQuality,
    deviceCapabilities: detectDeviceCapabilities(),
  }
}
