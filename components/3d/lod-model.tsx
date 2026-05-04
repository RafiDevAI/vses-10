"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"
import { use3DOptimization } from "@/hooks/use-3d-optimization"

interface LODModelProps {
  children: [React.ReactNode, React.ReactNode, React.ReactNode] // [high, medium, low]
  position?: [number, number, number]
}

export function LODModel({ children, position = [0, 0, 0] }: LODModelProps) {
  const groupRef = useRef<any>(null)
  const { qualitySettings } = use3DOptimization()
  const [highDetail, mediumDetail, lowDetail] = children

  const lodDistances = qualitySettings?.lodDistances || [15, 40, 80]

  const [currentLOD, setCurrentLOD] = useState(0)

  useFrame(({ camera }) => {
    if (!groupRef.current) return

    const distance = camera.position.distanceTo(new Vector3(...position))

    let newLOD = 0
    if (distance > lodDistances[2]) {
      newLOD = 2 // Low detail
    } else if (distance > lodDistances[1]) {
      newLOD = 1 // Medium detail
    } else {
      newLOD = 0 // High detail
    }

    if (newLOD !== currentLOD) {
      setCurrentLOD(newLOD)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {currentLOD === 0 && highDetail}
      {currentLOD === 1 && mediumDetail}
      {currentLOD === 2 && lowDetail}
    </group>
  )
}
