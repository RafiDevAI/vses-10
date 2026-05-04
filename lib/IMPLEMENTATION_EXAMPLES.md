# 3D Optimization Implementation Examples

This document provides complete, copy-paste ready examples for implementing 3D optimizations in your experiments.

## Table of Contents
1. [Converting Existing Experiment to Optimized Version](#converting-experiment)
2. [Creating New Optimized Experiment](#new-experiment)
3. [Adding Preloading to Experiment Page](#adding-preloading)
4. [Implementing LOD for Complex Models](#implementing-lod)
5. [Mobile-Specific Optimizations](#mobile-optimizations)

---

## 1. Converting Existing Experiment to Optimized Version {#converting-experiment}

### Before: Standard Implementation
\`\`\`typescript
// app/experiments/my-experiment/page.tsx
"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import MyModel from "@/components/my-model"

export default function MyExperiment() {
  return (
    <div className="h-screen">
      <Canvas>
        <ambientLight />
        <MyModel />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
\`\`\`

### After: Optimized Implementation
\`\`\`typescript
// app/experiments/my-experiment/page.tsx
"use client"

import { Suspense, lazy } from "react"
import { OptimizedCanvas } from "@/components/3d/optimized-canvas"
import { useBackgroundPreloader } from "@/hooks/use-background-preloader"
import { Loader2 } from 'lucide-react'

// Lazy load the 3D component
const MyModel = lazy(() => import("@/components/my-model"))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-black">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      <p className="ml-2 text-white">Loading experiment...</p>
    </div>
  )
}

export default function MyExperiment() {
  // Preload additional models in background
  const { progress, isPreloading } = useBackgroundPreloader({
    models: [
      '/models/model1.glb',
      '/models/model2.glb',
    ],
    priority: 'low',
  })

  return (
    <div className="h-screen relative">
      <OptimizedCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <MyModel />
        </Suspense>
      </OptimizedCanvas>

      {/* Preload indicator */}
      {isPreloading && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded text-sm">
          Preloading: {progress.toFixed(0)}%
        </div>
      )}
    </div>
  )
}
\`\`\`

---

## 2. Creating New Optimized Experiment {#new-experiment}

### Complete Example: Optimized Molecule Viewer

\`\`\`typescript
// app/experiments/molecule-viewer/page.tsx
"use client"

import { Suspense, lazy, useState } from "react"
import { OptimizedCanvas } from "@/components/3d/optimized-canvas"
import { useBackgroundPreloader } from "@/hooks/use-background-preloader"
import { use3DOptimization } from "@/hooks/use-3d-optimization"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

// Lazy load 3D components
const MoleculeModel = lazy(() => import("@/components/3d/molecule-model"))

const MOLECULES = [
  { id: 'water', name: 'Water (H₂O)', model: '/models/water.glb' },
  { id: 'co2', name: 'Carbon Dioxide (CO₂)', model: '/models/co2.glb' },
  { id: 'methane', name: 'Methane (CH₄)', model: '/models/methane.glb' },
]

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
    </div>
  )
}

export default function MoleculeViewer() {
  const [selectedMolecule, setSelectedMolecule] = useState(MOLECULES[0])
  const { fps, deviceCapabilities } = use3DOptimization()

  // Preload all molecule models
  const { isPreloading, progress } = useBackgroundPreloader({
    models: MOLECULES.map(m => m.model),
    priority: 'high',
  })

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl p-4">
        <h1 className="text-2xl font-bold text-white">Molecule Viewer</h1>
        <p className="text-sm text-white/60">
          Device: {deviceCapabilities.isMobile ? 'Mobile' : 'Desktop'} | FPS: {fps}
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-6 p-6">
        {/* 3D Viewer */}
        <div className="lg:col-span-3">
          <div className="h-[600px] rounded-2xl overflow-hidden border border-cyan-500/30 bg-black relative">
            <OptimizedCanvas 
              camera={{ position: [0, 0, 5], fov: 50 }}
              shadows={!deviceCapabilities.isMobile}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <MoleculeModel url={selectedMolecule.model} />
              </Suspense>
            </OptimizedCanvas>

            {isPreloading && (
              <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded">
                Loading: {progress.toFixed(0)}%
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <Card className="p-4 bg-black/60 border-cyan-500/30">
            <h3 className="font-semibold text-white mb-3">Select Molecule</h3>
            <div className="space-y-2">
              {MOLECULES.map(molecule => (
                <Button
                  key={molecule.id}
                  onClick={() => setSelectedMolecule(molecule)}
                  variant={selectedMolecule.id === molecule.id ? "default" : "outline"}
                  className="w-full"
                >
                  {molecule.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// components/3d/molecule-model.tsx
"use client"

import { memo } from "react"
import { OptimizedModel } from "@/components/3d/optimized-model"
import { OrbitControls } from "@react-three/drei"

interface MoleculeModelProps {
  url: string
}

export default memo(function MoleculeModel({ url }: MoleculeModelProps) {
  return (
    <>
      <OptimizedModel 
        url={url} 
        position={[0, 0, 0]} 
        scale={1}
      />
      <OrbitControls 
        enablePan 
        enableZoom 
        enableRotate 
        autoRotate
        autoRotateSpeed={2}
      />
    </>
  )
})
\`\`\`

---

## 3. Adding Preloading to Experiment Page {#adding-preloading}

### Step-by-Step Implementation

\`\`\`typescript
// Step 1: Import the hook
import { useBackgroundPreloader } from "@/hooks/use-background-preloader"

// Step 2: Define your models
const EXPERIMENT_MODELS = [
  '/models/primary-model.glb',
  '/models/secondary-model.glb',
  '/models/tertiary-model.glb',
]

// Step 3: Use the hook in your component
export default function ExperimentPage() {
  const { isPreloading, progress, loadedCount, totalCount } = useBackgroundPreloader({
    models: EXPERIMENT_MODELS,
    priority: 'low', // Use 'high' for critical models
    onProgress: (loaded, total) => {
      console.log(`Preloaded ${loaded}/${total} models`)
    },
    onComplete: () => {
      console.log('All models ready!')
    },
  })

  // Step 4: Show preload status (optional)
  return (
    <div>
      {isPreloading && (
        <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              Loading models: {loadedCount}/{totalCount}
            </span>
          </div>
          <div className="mt-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Your 3D scene */}
    </div>
  )
}
\`\`\`

---

## 4. Implementing LOD for Complex Models {#implementing-lod}

### Creating LOD Versions of Your Model

\`\`\`typescript
// components/3d/planet-with-lod.tsx
"use client"

import { memo } from "react"
import { LODModel } from "@/components/3d/lod-model"
import { OptimizedModel } from "@/components/3d/optimized-model"

interface PlanetWithLODProps {
  position: [number, number, number]
  planetName: string
}

export const PlanetWithLOD = memo(function PlanetWithLOD({ 
  position, 
  planetName 
}: PlanetWithLODProps) {
  return (
    <LODModel position={position}>
      {[
        // High detail - shown when camera is close (< 15 units)
        <OptimizedModel 
          key="high"
          url={`/models/${planetName}-high.glb`}
          scale={1}
        />,
        
        // Medium detail - shown at medium distance (15-40 units)
        <OptimizedModel 
          key="medium"
          url={`/models/${planetName}-medium.glb`}
          scale={1}
        />,
        
        // Low detail - shown when far away (> 40 units)
        <OptimizedModel 
          key="low"
          url={`/models/${planetName}-low.glb`}
          scale={1}
        />,
      ]}
    </LODModel>
  )
})

// Preload all LOD versions
PlanetWithLOD.preload = (planetName: string) => {
  OptimizedModel.preload(`/models/${planetName}-high.glb`)
  OptimizedModel.preload(`/models/${planetName}-medium.glb`)
  OptimizedModel.preload(`/models/${planetName}-low.glb`)
}
\`\`\`

### Using LOD in Your Scene

\`\`\`typescript
// app/experiments/solar-system/page.tsx
import { PlanetWithLOD } from "@/components/3d/planet-with-lod"

function SolarSystemScene() {
  return (
    <>
      <PlanetWithLOD position={[10, 0, 0]} planetName="earth" />
      <PlanetWithLOD position={[20, 0, 0]} planetName="mars" />
      <PlanetWithLOD position={[30, 0, 0]} planetName="jupiter" />
    </>
  )
}

// Preload all planets
useEffect(() => {
  PlanetWithLOD.preload('earth')
  PlanetWithLOD.preload('mars')
  PlanetWithLOD.preload('jupiter')
}, [])
\`\`\`

---

## 5. Mobile-Specific Optimizations {#mobile-optimizations}

### Detecting and Adapting to Mobile

\`\`\`typescript
"use client"

import { use3DOptimization } from "@/hooks/use-3d-optimization"
import { OptimizedCanvas } from "@/components/3d/optimized-canvas"

export default function AdaptiveExperiment() {
  const { deviceCapabilities, qualitySettings } = use3DOptimization()

  return (
    <div className="h-screen">
      <OptimizedCanvas
        camera={{ 
          position: [0, 0, deviceCapabilities.isMobile ? 8 : 5],
          fov: deviceCapabilities.isMobile ? 60 : 50 
        }}
        shadows={!deviceCapabilities.isMobile}
      >
        {/* Conditional rendering based on device */}
        {deviceCapabilities.isMobile ? (
          <MobileOptimizedScene />
        ) : (
          <DesktopScene />
        )}
      </OptimizedCanvas>

      {/* Show quality indicator */}
      {deviceCapabilities.isMobile && (
        <div className="fixed top-4 left-4 bg-black/80 text-white px-3 py-2 rounded text-xs">
          Mobile Mode: Optimized for speed
        </div>
      )}
    </div>
  )
}

function MobileOptimizedScene() {
  return (
    <>
      {/* Fewer lights for mobile */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Simpler models */}
      <OptimizedModel url="/models/simple-model.glb" />
    </>
  )
}

function DesktopScene() {
  return (
    <>
      {/* More lights for desktop */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />
      
      {/* Detailed models with LOD */}
      <LODModel position={[0, 0, 0]}>
        {[
          <OptimizedModel key="high" url="/models/detailed-high.glb" />,
          <OptimizedModel key="med" url="/models/detailed-medium.glb" />,
          <OptimizedModel key="low" url="/models/detailed-low.glb" />,
        ]}
      </LODModel>
    </>
  )
}
\`\`\`

### Progressive Enhancement Pattern

\`\`\`typescript
"use client"

import { useState, useEffect } from "react"
import { use3DOptimization } from "@/hooks/use-3d-optimization"

export default function ProgressiveExperiment() {
  const [enhancementsLoaded, setEnhancementsLoaded] = useState(false)
  const { deviceCapabilities, fps } = use3DOptimization()

  useEffect(() => {
    // Load enhancements only if performance is good
    if (fps > 45 && !deviceCapabilities.isLowEnd) {
      setTimeout(() => {
        setEnhancementsLoaded(true)
      }, 2000) // Wait 2 seconds after initial load
    }
  }, [fps, deviceCapabilities])

  return (
    <OptimizedCanvas>
      {/* Core experience - always loaded */}
      <CoreScene />

      {/* Enhanced features - loaded progressively */}
      {enhancementsLoaded && (
        <>
          <ParticleEffects />
          <AdvancedLighting />
          <DetailedTextures />
        </>
      )}
    </OptimizedCanvas>
  )
}
\`\`\`

---

## Performance Testing Snippet

\`\`\`typescript
// utils/performance-test.ts
export function logPerformanceMetrics() {
  if (typeof window === 'undefined') return

  // Log FPS
  let frameCount = 0
  let lastTime = performance.now()

  function measureFPS() {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      console.log(`[Performance] FPS: ${fps}`)
      frameCount = 0
      lastTime = currentTime
    }
    
    requestAnimationFrame(measureFPS)
  }
  
  measureFPS()

  // Log memory usage
  setInterval(() => {
    // @ts-ignore
    const memory = (performance as any).memory
    if (memory) {
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
      console.log(`[Performance] Memory: ${usedMB}MB / ${totalMB}MB`)
    }
  }, 5000)

  // Log load times
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    console.log(`[Performance] DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`)
    console.log(`[Performance] Load Complete: ${perfData.loadEventEnd - perfData.loadEventStart}ms`)
  })
}

// Use in development
if (process.env.NODE_ENV === 'development') {
  logPerformanceMetrics()
}
\`\`\`

---

## Quick Reference: Common Patterns

### Pattern 1: Simple Optimized Scene
\`\`\`typescript
<OptimizedCanvas>
  <Suspense fallback={null}>
    <OptimizedModel url="/model.glb" />
  </Suspense>
</OptimizedCanvas>
\`\`\`

### Pattern 2: With Preloading
\`\`\`typescript
const { isPreloading } = useBackgroundPreloader({
  models: ['/model1.glb', '/model2.glb'],
  priority: 'low'
})
\`\`\`

### Pattern 3: With LOD
\`\`\`typescript
<LODModel position={[0, 0, 0]}>
  {[<High />, <Medium />, <Low />]}
</LODModel>
\`\`\`

### Pattern 4: Memoized Component
\`\`\`typescript
const MyComponent = memo(({ prop }) => (
  <mesh><sphereGeometry /></mesh>
), (prev, next) => prev.prop === next.prop)
\`\`\`

---

## Troubleshooting

### Issue: Models not loading
**Solution**: Check browser console for CORS errors, verify model paths, ensure Draco decoder is accessible

### Issue: Low FPS on mobile
**Solution**: Reduce texture quality, disable shadows, implement LOD, reduce polygon count

### Issue: High memory usage
**Solution**: Dispose unused geometries/materials, implement model caching with limits, use texture compression

### Issue: Slow initial load
**Solution**: Reduce first model size, implement progressive loading, show loading indicator, preload in background
