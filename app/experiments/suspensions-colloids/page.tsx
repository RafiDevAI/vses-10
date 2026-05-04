"use client"
import { useState, useRef, useMemo, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, Cylinder, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Grid2x2, Shuffle, Lightbulb, RotateCcw, Eye, Box, ArrowLeft, Maximize } from "lucide-react"
import * as THREE from "three"
import Link from "next/link"
import dynamic from "next/dynamic"

// ===== PARTICLES 3D COMPONENT =====
interface Particles3DProps {
  type: "suspension" | "colloid"
  beakerPosition: [number, number, number]
  isStirring: boolean
  isLightOn: boolean
  isRealisticMode: boolean
}

interface ParticleData {
  position: THREE.Vector3
  velocity: THREE.Vector3
  settled: boolean
  initialY: number
}

const Particles3D = ({ type, isStirring, isLightOn, isRealisticMode }: Particles3DProps) => {
  const particlesRef = useRef<THREE.InstancedMesh>(null)
  const particlesDataRef = useRef<ParticleData[]>([])
  const timeRef = useRef(0)

  const isSuspension = type === "suspension"
  const particleCount = isRealisticMode ? (isSuspension ? 80 : 150) : isSuspension ? 50 : 80
  const particleSize = isRealisticMode ? (isSuspension ? 0.06 : 0.025) : isSuspension ? 0.08 : 0.04

  useEffect(() => {
    particlesDataRef.current = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 1.2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = Math.random() * 2.5 + 0.5

      return {
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, 0, 0),
        settled: false,
        initialY: y,
      }
    })
  }, [particleCount])

  const particleMaterial = useMemo(() => {
    if (isRealisticMode) {
      return new THREE.MeshStandardMaterial({
        color: isSuspension ? 0xc9b59a : 0xfffffa,
        roughness: isSuspension ? 0.95 : 0.2,
        metalness: isSuspension ? 0 : 0.05,
        emissive: isLightOn && !isSuspension ? 0xfffff0 : 0x000000,
        emissiveIntensity: isLightOn && !isSuspension ? 0.5 : 0,
        opacity: isSuspension ? 1 : 0.95,
        transparent: !isSuspension,
      })
    }
    return new THREE.MeshStandardMaterial({
      color: isSuspension ? 0xa0826d : 0xfff8dc,
      roughness: isSuspension ? 0.8 : 0.3,
      metalness: 0,
      emissive: isLightOn && !isSuspension ? 0xfff8dc : 0x000000,
      emissiveIntensity: isLightOn && !isSuspension ? 0.3 : 0,
    })
  }, [isSuspension, isLightOn, isRealisticMode])

  useFrame((state, delta) => {
    if (!particlesRef.current) return

    const dummy = new THREE.Object3D()
    timeRef.current += delta

    particlesDataRef.current.forEach((particle, i) => {
      if (isStirring) {
        particle.velocity.x = (Math.random() - 0.5) * 2
        particle.velocity.y = Math.random() * 1.5
        particle.velocity.z = (Math.random() - 0.5) * 2
        particle.settled = false
      } else if (isSuspension && !particle.settled) {
        particle.velocity.y -= 0.3 * delta
        particle.velocity.x *= 0.98
        particle.velocity.z *= 0.98

        if (particle.position.y <= 0.5) {
          particle.position.y = 0.5
          particle.velocity.set(0, 0, 0)
          particle.settled = true
        }
      } else if (!isSuspension) {
        const time = timeRef.current + i * 0.37
        const randAcc = new THREE.Vector3(
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6,
        )
        const drift = new THREE.Vector3(
          Math.sin(time * 0.3 + i * 0.73) * 0.15,
          Math.cos(time * 0.27 + i * 0.61) * 0.12,
          Math.sin(time * 0.31 + i * 0.53) * 0.15,
        )
        const toCenter = new THREE.Vector3(
          -particle.position.x,
          -particle.position.y + 2,
          -particle.position.z,
        ).multiplyScalar(0.05)
        particle.velocity
          .add(randAcc.multiplyScalar(delta))
          .add(drift.multiplyScalar(delta))
          .add(toCenter.multiplyScalar(delta))
        const maxSpeed = isRealisticMode ? 0.8 : 1.1
        if (particle.velocity.lengthSq() > maxSpeed * maxSpeed) {
          particle.velocity.setLength(maxSpeed)
        }
        particle.velocity.multiplyScalar(0.985)
      }

      particle.position.add(particle.velocity.clone().multiplyScalar(delta))

      const radius = Math.sqrt(particle.position.x ** 2 + particle.position.z ** 2)
      if (radius > 1.2) {
        const angle = Math.atan2(particle.position.z, particle.position.x)
        particle.position.x = Math.cos(angle) * 1.2
        particle.position.z = Math.sin(angle) * 1.2
        particle.velocity.x *= -0.5
        particle.velocity.z *= -0.5
      }

      particle.position.y = Math.max(0.5, Math.min(3.5, particle.position.y))

      dummy.position.copy(particle.position)
      dummy.rotation.set(
        timeRef.current * particle.position.x,
        timeRef.current * particle.position.y,
        timeRef.current * particle.position.z,
      )
      dummy.updateMatrix()
      particlesRef.current!.setMatrixAt(i, dummy.matrix)
    })

    particlesRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]} castShadow receiveShadow>
      {isRealisticMode && isSuspension ? (
        <boxGeometry args={[particleSize * 1.2, particleSize * 0.8, particleSize]} />
      ) : (
        <sphereGeometry args={[particleSize, isRealisticMode ? 12 : 8, isRealisticMode ? 12 : 8]} />
      )}
      <primitive object={particleMaterial} attach="material" />
    </instancedMesh>
  )
}

// ===== LIGHT BEAM 3D COMPONENT =====
interface LightBeam3DProps {
  type: "suspension" | "colloid"
  position: [number, number, number]
}

const LightBeam3D = ({ type, position }: LightBeam3DProps) => {
  const beamRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const isSuspension = type === "suspension"

  useFrame((state) => {
    if (beamRef.current && !isSuspension) {
      const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
        ; (beamRef.current.material as THREE.MeshBasicMaterial).opacity = intensity
    }
    if (glowRef.current && !isSuspension) {
      glowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })

  return (
    <group position={position}>
      <mesh ref={beamRef} position={[-3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.5, 6, 16, 1, true]} />
        <meshBasicMaterial
          color={isSuspension ? 0xffffcc : 0xffff66}
          transparent
          opacity={isSuspension ? 0.1 : 0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {!isSuspension && (
        <>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 6, 16]} />
            <meshBasicMaterial color={0xffff88} transparent opacity={0.25} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight ref={glowRef} position={[0, 0, 0]} color={0xffffaa} intensity={1} distance={4} />
        </>
      )}
      <mesh position={[-3.5, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={0xffffee} />
      </mesh>
      <pointLight position={[-3.5, 0, 0]} color={0xffffee} intensity={2} distance={8} />
    </group>
  )
}

// ===== BEAKER 3D COMPONENT =====
interface Beaker3DProps {
  type: "suspension" | "colloid"
  position: [number, number, number]
  isStirring: boolean
  isLightOn: boolean
  isRealisticMode: boolean
}

const Beaker3D = ({ type, position, isStirring, isLightOn, isRealisticMode }: Beaker3DProps) => {
  const beakerRef = useRef<THREE.Group>(null)
  const waterRef = useRef<THREE.Mesh>(null)
  const isSuspension = type === "suspension"

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xccddff,
        transparent: true,
        opacity: 0.15,
        roughness: 0,
        metalness: 0,
        transmission: 0.95,
        thickness: 0.5,
        envMapIntensity: 1,
      }),
    [],
  )

  const waterMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: isRealisticMode ? (isSuspension ? 0xc8dce8 : 0xfafaf8) : isSuspension ? 0xb8d4e8 : 0xe8f4f8,
        transparent: true,
        opacity: isRealisticMode ? (isSuspension ? 0.5 : 0.92) : isSuspension ? 0.7 : 0.8,
        roughness: isRealisticMode && !isSuspension ? 0.3 : 0.1,
        metalness: 0,
        clearcoat: isRealisticMode && !isSuspension ? 0.4 : 0,
        clearcoatRoughness: 0.25,
        emissive: isRealisticMode && !isSuspension ? 0xffffff : 0x000000,
        emissiveIntensity: isRealisticMode && !isSuspension ? 0.2 : 0,
        side: THREE.DoubleSide,
      }),
    [isSuspension, isRealisticMode],
  )

  return (
    <group ref={beakerRef} position={position}>
      <Cylinder
        args={[1.5, 1.5, 4, 32, 1, true]}
        position={[0, 2, 0]}
        material={glassMaterial}
        castShadow
        receiveShadow
      />
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshPhysicalMaterial
          color={0xccddff}
          transparent={true}
          opacity={0.15}
          roughness={0}
          metalness={0}
          transmission={0.95}
        />
      </mesh>
      <mesh ref={waterRef} position={[0, 2, 0]} receiveShadow>
        <cylinderGeometry args={[1.4, 1.4, 3.5, 32]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>
      <Particles3D
        type={type}
        beakerPosition={position}
        isStirring={isStirring}
        isLightOn={isLightOn}
        isRealisticMode={isRealisticMode}
      />
      <mesh position={[0, 3.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.4, 32]} />
        <meshPhysicalMaterial
          color={isSuspension ? 0xadd8e6 : 0xfafafa}
          transparent={true}
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {isLightOn && <LightBeam3D type={type} position={[0, 2, 0]} />}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.4}
        color={isSuspension ? "#3b82f6" : "#0891b2"}
        anchorX="center"
        anchorY="middle"
      >
        {isSuspension ? "🧱 Suspension" : "☁️ Colloid"}
      </Text>
      <Text
        position={[0, -1.3, 0]}
        fontSize={0.25}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {isSuspension ? "Sand + Water" : "Milk + Water"}
      </Text>
    </group>
  )
}

// ===== LAB TABLE 3D COMPONENT =====
const LabTable3D = () => {
  return (
    <group>
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[15, 0.3, 8]} />
        <meshStandardMaterial color={0x8899aa} roughness={0.3} metalness={0.5} />
      </mesh>
      {[
        [-6, -2, 3],
        [6, -2, 3],
        [-6, -2, -3],
        [6, -2, -3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
          <meshStandardMaterial color={0x667788} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, -4, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={0x2a2a2a} roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 2, -5]} receiveShadow>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color={0x1a1a1a} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ===== SCENE 3D COMPONENT =====
interface Scene3DProps {
  viewMode: "side-by-side" | "single"
  activeBeaker: "suspension" | "colloid"
  isStirring: boolean
  isLightOn: boolean
  isRealisticMode: boolean
}

const Scene3D = ({ viewMode, activeBeaker, isStirring, isLightOn, isRealisticMode }: Scene3DProps) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg bg-gray-900 flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Loading 3D Laboratory...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-b from-gray-900 to-black">
      <Canvas shadows gl={{ alpha: false }} style={{ background: "#1a1a1a" }}>
        <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={50} />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-5, 5, -5]} intensity={0.3} />
          <Environment preset="apartment" />
          <LabTable3D />
          {viewMode === "side-by-side" ? (
            <>
              <Beaker3D
                type="suspension"
                position={[-2.5, 0, 0]}
                isStirring={isStirring}
                isLightOn={isLightOn}
                isRealisticMode={isRealisticMode}
              />
              <Beaker3D
                type="colloid"
                position={[2.5, 0, 0]}
                isStirring={isStirring}
                isLightOn={isLightOn}
                isRealisticMode={isRealisticMode}
              />
            </>
          ) : (
            <Beaker3D
              type={activeBeaker}
              position={[0, 0, 0]}
              isStirring={isStirring}
              isLightOn={isLightOn}
              isRealisticMode={isRealisticMode}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

// ===== CONTROL PANEL COMPONENT =====
interface ControlPanelProps {
  viewMode: "side-by-side" | "single"
  onToggleMode: () => void
  onStir: () => void
  onLight: () => void
  onReset: () => void
  isLightOn: boolean
  isRealisticMode: boolean
  onToggleRealistic: () => void
  is2DView: boolean
  onToggle2D: () => void
}

const ControlPanel = ({
  viewMode,
  onToggleMode,
  onStir,
  onLight,
  onReset,
  isLightOn,
  isRealisticMode,
  onToggleRealistic,
  is2DView,
  onToggle2D,
}: ControlPanelProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-foreground mb-4 text-center">Experiment Controls</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <Button
          onClick={onToggleMode}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
        >
          {viewMode === "side-by-side" ? <Grid2x2 className="w-6 h-6" /> : <LayoutGrid className="w-6 h-6" />}
          <span className="text-xs font-medium">{viewMode === "side-by-side" ? "Single View" : "Side-by-Side"}</span>
        </Button>
        <Button
          onClick={onStir}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-secondary hover:text-secondary-foreground transition-all bg-transparent"
        >
          <Shuffle className="w-6 h-6" />
          <span className="text-xs font-medium">Stir Mixture</span>
        </Button>
        <Button
          onClick={onLight}
          variant={isLightOn ? "default" : "outline"}
          className={`flex flex-col items-center gap-2 h-auto py-4 transition-all ${isLightOn ? "bg-accent text-accent-foreground shadow-glow" : "hover:bg-accent hover:text-accent-foreground"
            }`}
        >
          <Lightbulb className="w-6 h-6" />
          <span className="text-xs font-medium">{isLightOn ? "Light On" : "Shine Light"}</span>
        </Button>
        <Button
          onClick={onToggle2D}
          variant={is2DView ? "default" : "outline"}
          className={`flex flex-col items-center gap-2 h-auto py-4 transition-all ${is2DView
            ? "bg-secondary text-secondary-foreground shadow-lg"
            : "hover:bg-secondary hover:text-secondary-foreground"
            }`}
        >
          <Box className="w-6 h-6" />
          <span className="text-xs font-medium">{is2DView ? "2D View" : "3D View"}</span>
        </Button>
        <Button
          onClick={onToggleRealistic}
          variant={isRealisticMode ? "default" : "outline"}
          className={`flex flex-col items-center gap-2 h-auto py-4 transition-all ${isRealisticMode
            ? "bg-primary text-primary-foreground shadow-lg"
            : "hover:bg-primary hover:text-primary-foreground"
            }`}
        >
          <Eye className="w-6 h-6" />
          <span className="text-xs font-medium">{isRealisticMode ? "Realistic" : "Simple"}</span>
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-destructive hover:text-destructive-foreground transition-all bg-transparent"
        >
          <RotateCcw className="w-6 h-6" />
          <span className="text-xs font-medium">Reset</span>
        </Button>
      </div>
    </div>
  )
}

// ===== MAIN APP COMPONENT (DEFAULT EXPORT) =====
function SuspensionsVsColloidsPage() {
  const [viewMode, setViewMode] = useState<"side-by-side" | "single">("side-by-side")
  const [activeBeaker, setActiveBeaker] = useState<"suspension" | "colloid">("suspension")
  const [isStirring, setIsStirring] = useState(false)
  const [isLightOn, setIsLightOn] = useState(false)
  const [isRealisticMode, setIsRealisticMode] = useState(false)
  const [is2DView, setIs2DView] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleStir = () => {
    setIsStirring(true)
    setTimeout(() => setIsStirring(false), 3000)
  }

  const handleReset = () => {
    setIsStirring(false)
    setIsLightOn(false)
    setViewMode("side-by-side")
    setActiveBeaker("suspension")
    setIsRealisticMode(false)
    setIs2DView(false)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/experiments"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Experiments</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-foreground">Suspensions vs Colloids</h1>
            </div>
            <Button onClick={toggleFullscreen} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Maximize className="w-4 h-4" />
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Interactive Lab: Suspensions vs Colloids</h2>
            <p className="text-muted-foreground">Explore the Tyndall effect and particle behavior in 3D</p>
          </div>

          <Scene3D
            viewMode={viewMode}
            activeBeaker={activeBeaker}
            isStirring={isStirring}
            isLightOn={isLightOn}
            isRealisticMode={isRealisticMode}
          />

          <ControlPanel
            viewMode={viewMode}
            onToggleMode={() => setViewMode(viewMode === "side-by-side" ? "single" : "side-by-side")}
            onStir={handleStir}
            onLight={() => setIsLightOn(!isLightOn)}
            onReset={handleReset}
            isLightOn={isLightOn}
            isRealisticMode={isRealisticMode}
            onToggleRealistic={() => setIsRealisticMode(!isRealisticMode)}
            is2DView={is2DView}
            onToggle2D={() => setIs2DView(!is2DView)}
          />

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border/40">
            <h3 className="text-xl font-bold text-foreground mb-4">Key Observations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  <span className="text-2xl">🧱</span>
                  Suspension (Sand + Water)
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Large particles settle quickly due to gravity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Weak Tyndall effect - light passes through easily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Becomes cloudy and separates over time</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-accent flex items-center gap-2">
                  <span className="text-2xl">☁️</span>
                  Colloid (Milk + Water)
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Tiny particles stay suspended indefinitely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Strong Tyndall effect - light scatters visibly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Remains uniformly mixed and stable</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(SuspensionsVsColloidsPage), { ssr: false })
