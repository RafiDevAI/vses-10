# 3D Optimization Implementation Guide

## Overview
This guide provides ready-to-use code snippets and patterns for optimizing 3D experiments in the Virtual Science Lab.

## Table of Contents
1. [Draco Compression Setup](#draco-compression)
2. [Lazy Loading Pattern](#lazy-loading)
3. [Background Preloading](#background-preloading)
4. [LOD Implementation](#lod-implementation)
5. [Component Memoization](#component-memoization)
6. [Performance Monitoring](#performance-monitoring)

---

## 1. Draco Compression Setup {#draco-compression}

### Basic Usage
\`\`\`typescript
import { useGLTF } from '@react-three/drei'
import { getDracoLoader } from '@/lib/3d-draco-loader'

function Model({ url }: { url: string }) {
  // useGLTF automatically uses Draco if the model is compressed
  const { scene } = useGLTF(url)
  
  return <primitive object={scene} />
}

// Preload models with Draco support
useGLTF.preload('/models/solar-system.glb')
\`\`\`

### Advanced: Custom Loader
\`\`\`typescript
import { getGLTFLoader } from '@/lib/3d-draco-loader'

async function loadModelManually(url: string) {
  const loader = getGLTFLoader()
  const gltf = await loader.loadAsync(url)
  return gltf.scene
}
\`\`\`

---

## 2. Lazy Loading Pattern {#lazy-loading}

### Component-Level Lazy Loading
\`\`\`typescript
import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'

// Lazy load heavy 3D component
const SolarSystem = lazy(() => import('@/components/solar-system-educational'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-black">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      <p className="ml-2 text-white">Loading 3D scene...</p>
    </div>
  )
}

export function ExperimentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SolarSystem />
    </Suspense>
  )
}
\`\`\`

### Model-Level Lazy Loading
\`\`\`typescript
import { Suspense } from 'react'
import { OptimizedModel } from '@/components/3d/optimized-model'

function Scene() {
  return (
    <Suspense fallback={null}>
      <OptimizedModel url="/models/planet.glb" position={[0, 0, 0]} />
    </Suspense>
  )
}
\`\`\`

---

## 3. Background Preloading {#background-preloading}

### Using the Background Preloader Hook
\`\`\`typescript
import { useBackgroundPreloader } from '@/hooks/use-background-preloader'

function App() {
  const { isPreloading, progress, loadedCount, totalCount } = useBackgroundPreloader({
    models: [
      '/models/mercury.glb',
      '/models/venus.glb',
      '/models/earth.glb',
      '/models/mars.glb',
    ],
    priority: 'low', // 'high' for immediate, 'low' for background
    onProgress: (loaded, total) => {
      console.log(`Loaded ${loaded}/${total} models`)
    },
    onComplete: () => {
      console.log('All models preloaded!')
    },
  })

  return (
    <div>
      {isPreloading && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded">
          Preloading: {loadedCount}/{totalCount} ({progress.toFixed(0)}%)
        </div>
      )}
      {/* Your 3D scene */}
    </div>
  )
}
\`\`\`

### Manual Preloading
\`\`\`typescript
import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

function preloadModels() {
  const models = [
    '/models/model1.glb',
    '/models/model2.glb',
    '/models/model3.glb',
  ]

  if (typeof window !== 'undefined') {
    requestIdleCallback(() => {
      models.forEach(url => useGLTF.preload(url))
    }, { timeout: 2000 })
  }
}

// Call in layout or main component
useEffect(() => {
  preloadModels()
}, [])
\`\`\`

---

## 4. LOD Implementation {#lod-implementation}

### Using the LOD Component
\`\`\`typescript
import { LODModel } from '@/components/3d/lod-model'
import { OptimizedModel } from '@/components/3d/optimized-model'

function Planet() {
  return (
    <LODModel position={[10, 0, 0]}>
      {[
        // High detail (close)
        <OptimizedModel url="/models/planet-high.glb" />,
        
        // Medium detail (medium distance)
        <OptimizedModel url="/models/planet-medium.glb" />,
        
        // Low detail (far)
        <OptimizedModel url="/models/planet-low.glb" />,
      ]}
    </LODModel>
  )
}
\`\`\`

### Custom LOD Logic
\`\`\`typescript
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

function CustomLOD({ position = [0, 0, 0] }) {
  const groupRef = useRef()
  const [lod, setLod] = useState(0)
  
  useFrame(({ camera }) => {
    if (!groupRef.current) return
    
    const distance = camera.position.distanceTo(new Vector3(...position))
    
    // Adjust LOD based on distance
    if (distance < 10) setLod(0)      // High detail
    else if (distance < 25) setLod(1) // Medium detail
    else setLod(2)                     // Low detail
  })

  return (
    <group ref={groupRef} position={position}>
      {lod === 0 && <HighDetailModel />}
      {lod === 1 && <MediumDetailModel />}
      {lod === 2 && <LowDetailModel />}
    </group>
  )
}
\`\`\`

---

## 5. Component Memoization {#component-memoization}

### Memoizing 3D Components
\`\`\`typescript
import { memo } from 'react'

const Planet = memo(function Planet({ position, color, size, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.position[0] === nextProps.position[0] &&
    prevProps.position[1] === nextProps.position[1] &&
    prevProps.position[2] === nextProps.position[2] &&
    prevProps.color === nextProps.color &&
    prevProps.size === nextProps.size
  )
})
\`\`\`

### Memoizing Expensive Calculations
\`\`\`typescript
import { useMemo } from 'react'

function OrbitRing({ radius }) {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      pts.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
    }
    return new Float32Array(pts)
  }, [radius]) // Only recalculate when radius changes

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={points.length / 3} 
          array={points} 
          itemSize={3} 
        />
      </bufferGeometry>
      <lineBasicMaterial color="#22d3ee" opacity={0.2} transparent />
    </lineLoop>
  )
}
\`\`\`

---

## 6. Performance Monitoring {#performance-monitoring}

### Using the Optimization Hook
\`\`\`typescript
import { use3DOptimization } from '@/hooks/use-3d-optimization'

function Scene() {
  const { qualitySettings, fps, deviceCapabilities, adjustQuality } = use3DOptimization()

  // Automatically adjust quality based on FPS
  useEffect(() => {
    if (fps < 30 && qualitySettings) {
      adjustQuality('low')
    }
  }, [fps, qualitySettings, adjustQuality])

  return (
    <div>
      {/* FPS Monitor */}
      <div className="fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded">
        FPS: {fps}
      </div>
      
      {/* Your 3D scene */}
    </div>
  )
}
\`\`\`

### Custom Performance Monitoring
\`\`\`typescript
import { useEffect, useRef } from 'react'
import { PerformanceMonitor } from '@/lib/3d-optimization-config'

function usePerformanceMonitor() {
  const monitor = useRef(new PerformanceMonitor())
  const [fps, setFps] = useState(60)

  useEffect(() => {
    let animationFrameId: number
    
    const updateFPS = () => {
      monitor.current.update()
      setFps(monitor.current.getFPS())
      animationFrameId = requestAnimationFrame(updateFPS)
    }
    
    updateFPS()
    
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return {
    fps,
    averageFPS: monitor.current.getAverageFPS(),
    isPerformanceGood: monitor.current.isPerformanceGood(),
  }
}
\`\`\`

---

## Best Practices Summary

### Desktop Optimization
1. ✅ Load high-quality textures (up to 2048x2048)
2. ✅ Enable shadows and post-processing
3. ✅ Use lazy loading for secondary scenes
4. ✅ Preload models in background after first scene
5. ✅ Target 60 FPS after initial load

### Mobile Optimization
1. ✅ Prioritize speed over quality
2. ✅ Use compressed textures (max 1024x1024)
3. ✅ Disable shadows and post-processing
4. ✅ Implement aggressive LOD
5. ✅ Target < 5 second first load
6. ✅ Target 30+ FPS
7. ✅ Cache models aggressively
8. ✅ Memoize all components

### General Tips
- Always use Draco-compressed models
- Remove unused code and imports
- Test on real devices, not just emulators
- Monitor memory usage
- Use Suspense for all 3D components
- Implement proper error boundaries
