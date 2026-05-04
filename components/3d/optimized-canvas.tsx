"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import { Suspense, type ReactNode } from "react"
import { use3DOptimization } from "@/hooks/use-3d-optimization"
import { Loader2 } from "lucide-react"

interface OptimizedCanvasProps {
  children: ReactNode
  camera?: any
  className?: string
  style?: React.CSSProperties
  shadows?: boolean
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
      </div>
    </div>
  )
}

export function OptimizedCanvas({
  children,
  camera = { position: [0, 0, 5], fov: 50 },
  className = "",
  style,
  shadows = false,
}: OptimizedCanvasProps) {
  const { qualitySettings, isLoading, fps } = use3DOptimization()

  if (isLoading || !qualitySettings) {
    return <LoadingFallback />
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <Canvas
        camera={camera}
        dpr={qualitySettings.pixelRatio}
        gl={{
          antialias: qualitySettings.antialias,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows={shadows && qualitySettings.shadowQuality !== "off"}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>

      {/* FPS Monitor - only show in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
          FPS: {fps}
        </div>
      )}
    </div>
  )
}
