"use client"

import { memo, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { use3DOptimization } from "@/hooks/use-3d-optimization"
import * as THREE from "three"

interface OptimizedModelProps {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  onClick?: () => void
  onHover?: (hovered: boolean) => void
}

/**
 * Optimized 3D Model Component
 * - Memoized to prevent unnecessary re-renders
 * - Automatically applies quality settings
 * - Supports Draco compression
 */
export const OptimizedModel = memo(
  function OptimizedModel({
    url,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    onClick,
    onHover,
  }: OptimizedModelProps) {
    const { scene } = useGLTF(url)
    const { qualitySettings } = use3DOptimization()

    // Clone and optimize scene
    const optimizedScene = useMemo(() => {
      const clonedScene = scene.clone()

      // Apply quality settings to materials
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial

          if (material) {
            // Adjust material based on quality
            if (qualitySettings?.shadowQuality === "off") {
              material.shadowSide = THREE.FrontSide
            }

            // Optimize textures for mobile
            if (qualitySettings?.textureQuality && qualitySettings.textureQuality < 1) {
              if (material.map) {
                material.map.minFilter = THREE.LinearFilter
                material.map.generateMipmaps = false
              }
            }
          }
        }
      })

      return clonedScene
    }, [scene, qualitySettings])

    return (
      <primitive
        object={optimizedScene}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={onClick}
        onPointerOver={() => onHover?.(true)}
        onPointerOut={() => onHover?.(false)}
      />
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
      prevProps.url === nextProps.url &&
      prevProps.position?.[0] === nextProps.position?.[0] &&
      prevProps.position?.[1] === nextProps.position?.[1] &&
      prevProps.position?.[2] === nextProps.position?.[2] &&
      prevProps.scale === nextProps.scale
    )
  },
)

// Preload function
;(OptimizedModel as any).preload = (url: string) => {
  useGLTF.preload(url)
}
