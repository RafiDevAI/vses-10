"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Thermometer, Snowflake, Droplet, Wind, Info, Maximize, Minimize } from "lucide-react"
import Link from "next/link"

import * as THREE from "three"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"

const FREEZING_POINT = 0 // 0°C
const BOILING_POINT = 100 // 100°C

function GlassContainer() {
  return (
    <group>
      {/* Glass beaker shape */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.8, 1.5, 4, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          thickness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glass bottom */}
      <mesh position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>
      {/* Glass rim */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[1.8, 0.08, 16, 32]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.3} roughness={0.05} metalness={0.2} />
      </mesh>
    </group>
  )
}

function GasParticle({ index, speed, temperature }: { index: number; speed: number; temperature: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const velocity = useRef(
    new THREE.Vector3((Math.random() - 0.5) * speed, Math.random() * speed * 0.8 + 0.3, (Math.random() - 0.5) * speed),
  )
  const [opacity, setOpacity] = useState(0.8)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Move particle with realistic speed
    meshRef.current.position.x += velocity.current.x * delta * 4
    meshRef.current.position.y += velocity.current.y * delta * 4
    meshRef.current.position.z += velocity.current.z * delta * 4

    // Bounce off cylindrical container walls
    const distance = Math.sqrt(meshRef.current.position.x ** 2 + meshRef.current.position.z ** 2)
    if (distance > 1.6) {
      const normal = new THREE.Vector3(meshRef.current.position.x, 0, meshRef.current.position.z).normalize()
      velocity.current.reflect(normal)
      velocity.current.multiplyScalar(0.98) // Slight energy loss
      meshRef.current.position.x = normal.x * 1.6
      meshRef.current.position.z = normal.z * 1.6
    }

    // Bounce off top with energy loss
    if (meshRef.current.position.y > 1.4) {
      velocity.current.y *= -0.9
      meshRef.current.position.y = 1.4
    }

    // Bounce off bottom
    if (meshRef.current.position.y < -2.2) {
      velocity.current.y *= -0.9
      meshRef.current.position.y = -2.2
    }

    // Slight gravity effect
    velocity.current.y -= delta * 0.8

    // Fade out near top of container (steam escaping)
    const fadeHeight = 1.0
    if (meshRef.current.position.y > fadeHeight) {
      setOpacity(Math.max(0, 0.8 - (meshRef.current.position.y - fadeHeight) * 2))
    } else {
      setOpacity(0.8)
    }

    // Gentle rotation for visual effect
    meshRef.current.rotation.x += delta * 2
    meshRef.current.rotation.y += delta * 3
  })

  const initialY = Math.random() * 3 - 2
  const initialX = (Math.random() - 0.5) * 2.5
  const initialZ = (Math.random() - 0.5) * 2.5

  return (
    <mesh ref={meshRef} position={[initialX, initialY, initialZ]}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial color="#81d4fa" emissive="#64b5f6" emissiveIntensity={0.4} transparent opacity={opacity} />
    </mesh>
  )
}

function IceCube({ temperature }: { temperature: number }) {
  const meshRef = useRef<THREE.Group>(null)
  const [opacity, setOpacity] = useState(1)
  const [scale, setScale] = useState(1)
  const [crackOpacity, setCrackOpacity] = useState(0)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += 0.002
    meshRef.current.rotation.x += (Math.abs(temperature) / 100) * 0.0005

    // Gentle bobbing when transitioning
    if (temperature > -5 && temperature < 5) {
      meshRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }

    if (temperature > FREEZING_POINT && temperature < 40) {
      const meltProgress = temperature / 40
      setCrackOpacity(Math.min(0.5, meltProgress * 0.8))
    } else {
      setCrackOpacity(0)
    }
  })

  useEffect(() => {
    if (temperature < FREEZING_POINT) {
      setOpacity(1)
      setScale(1)
    } else if (temperature < 40) {
      const meltProgress = temperature / 40
      setOpacity(Math.max(0, 1 - meltProgress * 0.8))
      setScale(Math.max(0.2, 1 - meltProgress * 0.6))
    } else {
      setOpacity(0)
      setScale(0.2)
    }
  }, [temperature])

  if (opacity === 0) return null

  return (
    <group ref={meshRef} position={[0, -1, 0]} scale={scale}>
      {/* Main ice cube with rounded edges */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshPhysicalMaterial
          color="#e1f5fe"
          transparent
          opacity={opacity * 0.85}
          roughness={0.05}
          metalness={0}
          transmission={0.8}
          thickness={1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          ior={1.31}
        />
      </mesh>

      {/* Inner glow effect */}
      <mesh scale={0.9}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial color="#b3e5fc" transparent opacity={opacity * 0.3} />
      </mesh>

      {/* Frost effect on surface */}
      {temperature < 0 && (
        <>
          <mesh position={[0.61, 0, 0]}>
            <planeGeometry args={[1.2, 1.2]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={0.8} />
          </mesh>
          <mesh position={[-0.61, 0, 0]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.2, 1.2]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={0.8} />
          </mesh>
        </>
      )}

      {temperature > FREEZING_POINT && crackOpacity > 0 && (
        <>
          <mesh position={[0, 0.61, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.2, 0.05]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={crackOpacity * 0.6} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.4, 0.61]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[0.8, 0.03]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={crackOpacity * 0.5} roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  )
}

function WaterBlob({ temperature }: { temperature: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const surfaceRef = useRef<THREE.Mesh>(null)
  const [opacity, setOpacity] = useState(0)
  const [height, setHeight] = useState(0)
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; z: number; size: number }>>([])

  useFrame((state, delta) => {
    if (!meshRef.current || !surfaceRef.current) return

    // Gentle wave motion on surface
    if (temperature >= FREEZING_POINT && temperature < BOILING_POINT) {
      const time = state.clock.elapsedTime
      surfaceRef.current.position.y = -2.5 + height + Math.sin(time * 1.5) * 0.02
      surfaceRef.current.rotation.y += delta * 0.05
    }

    // Vigorous boiling animation
    if (temperature >= BOILING_POINT) {
      const time = state.clock.elapsedTime
      meshRef.current.position.y = -2.5 + height / 2 + Math.sin(time * 4) * 0.06
      surfaceRef.current.position.y = -2.5 + height + Math.sin(time * 5) * 0.08
    }

    // Update bubbles - move upward
    setBubbles((prev) =>
      prev.map((b) => ({ ...b, y: b.y + delta * (1 + b.size * 2) })).filter((b) => b.y < height - 0.5),
    )

    // Generate new bubbles when approaching/at boiling
    if (temperature >= 90 && Math.random() < (temperature >= BOILING_POINT ? 0.5 : 0.2)) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 1.1
      setBubbles((prev) => [
        ...prev.slice(-30), // Keep max 30 bubbles
        {
          id: Math.random(),
          x: Math.cos(angle) * radius,
          y: -2.3,
          z: Math.sin(angle) * radius,
          size: Math.random() * 0.03 + 0.02,
        },
      ])
    }
  })

  useEffect(() => {
    if (temperature < FREEZING_POINT) {
      setOpacity(0)
      setHeight(0)
    } else if (temperature < BOILING_POINT) {
      // Liquid phase - water rises as ice melts
      const liquidProgress = Math.min((temperature - FREEZING_POINT) / 30, 1)
      setOpacity(liquidProgress * 0.85)
      setHeight(liquidProgress * 3.5)
    } else {
      // Boiling - water level decreases as it evaporates
      const boilProgress = Math.min((temperature - BOILING_POINT) / 50, 1)
      setOpacity(Math.max(0.3, 0.85 - boilProgress * 0.6))
      setHeight(Math.max(0.8, 3.5 - boilProgress * 2.5))
    }
  }, [temperature])

  if (opacity === 0) return null

  return (
    <group>
      {/* Main water body */}
      <mesh ref={meshRef} position={[0, -2.5 + height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.35, height, 32]} />
        <meshPhysicalMaterial
          color="#1976d2"
          transparent
          opacity={opacity}
          roughness={0.05}
          metalness={0.05}
          transmission={0.3}
          thickness={0.5}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Water surface with reflection */}
      <mesh ref={surfaceRef} position={[0, -2.5 + height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 32]} />
        <meshPhysicalMaterial
          color="#2196f3"
          transparent
          opacity={opacity * 0.9}
          roughness={temperature >= BOILING_POINT ? 0.3 : 0.05}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Rising bubbles */}
      {bubbles.map((bubble) => (
        <mesh key={bubble.id} position={[bubble.x, bubble.y, bubble.z]} castShadow>
          <sphereGeometry args={[bubble.size, 16, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.5}
            roughness={0.1}
            transmission={0.9}
            thickness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function GasParticles({ temperature }: { temperature: number }) {
  const particleCount = Math.max(0, Math.floor((temperature - BOILING_POINT) / 2))
  const speed = Math.min((temperature - BOILING_POINT) / 30, 2)

  if (temperature < BOILING_POINT) return null

  return (
    <>
      {Array.from({ length: Math.min(particleCount, 40) }).map((_, i) => (
        <GasParticle key={i} index={i} speed={speed} temperature={temperature} />
      ))}
    </>
  )
}

function PhaseTransitionScene({ temperature }: { temperature: number }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 1, 4]} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={8} maxPolarAngle={Math.PI / 2} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#64b5f6" />
      <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.5} />

      {/* Glass container */}
      <GlassContainer />

      {/* Phase components inside glass */}
      <IceCube temperature={temperature} />
      <WaterBlob temperature={temperature} />
      <GasParticles temperature={temperature} />

      {/* Environment */}
      <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </>
  )
}

function PhaseTransitionsPage() {
  const [temperature, setTemperature] = useState(-10)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
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

  const getPhaseState = () => {
    if (temperature < FREEZING_POINT) return { name: "Solid (Ice)", icon: Snowflake, color: "cyan" }
    if (temperature < BOILING_POINT) return { name: "Liquid (Water)", icon: Droplet, color: "blue" }
    return { name: "Gas (Vapor)", icon: Wind, color: "sky" }
  }

  const getPhaseDescription = () => {
    if (temperature < FREEZING_POINT) {
      return "Water molecules are locked in a crystalline structure. Particles vibrate in place but cannot move freely. The ice cube maintains its rigid shape."
    }
    if (temperature < BOILING_POINT) {
      return "Molecules have enough energy to move and flow past each other while remaining close. Water takes the shape of its container."
    }
    return "Molecules have high kinetic energy and move rapidly in all directions. Steam rises as individual molecules escape the liquid surface."
  }

  const phase = getPhaseState()
  const PhaseIcon = phase.icon
  const progressValue = ((temperature + 20) / 170) * 100

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <SidebarNav />
      </div>

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Link href="/experiments">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Experiments
                    </Button>
                  </Link>
                  <div className="h-8 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Phase Transitions</h1>
                      <p className="text-sm text-muted-foreground">States of Matter Experiment</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Chemistry</Badge>
                  <Badge variant="outline">3D Interactive</Badge>

                </div>
              </div>
            </div>

            <div ref={containerRef} className="grid lg:grid-cols-3 gap-6">
              {/* Main 3D View */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="overflow-hidden">
                  <div className="h-[600px] bg-gradient-to-br from-muted/30 to-muted/10">
                    <Canvas shadows>
                      <PhaseTransitionScene temperature={temperature} />
                    </Canvas>
                  </div>
                </Card>

                {/* Temperature Control */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-destructive" />
                      Heat Control
                    </CardTitle>
                    <CardDescription>Adjust temperature to observe phase changes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Thermometer visualization */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-12 h-48 bg-gradient-to-t from-destructive via-amber-500 to-primary rounded-full border-2 border-border relative overflow-hidden">
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-destructive to-amber-500 transition-all duration-500"
                            style={{ height: `${progressValue}%` }}
                          />
                        </div>
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-destructive rounded-full border-2 border-background" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-foreground">{temperature}°C</div>
                          <div className="text-sm text-muted-foreground mt-1">Current Temperature</div>
                        </div>

                        <div className="space-y-2">
                          <Slider
                            value={[temperature]}
                            onValueChange={(value) => setTemperature(value[0])}
                            min={-20}
                            max={150}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>-20°C</span>
                            <span className="text-primary">0°C</span>
                            <span className="text-amber-600">100°C</span>
                            <span>150°C</span>
                          </div>
                        </div>

                        {/* Progress indicator */}
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    </div>

                    {/* Quick preset buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <Button onClick={() => setTemperature(-10)} variant="outline" size="sm" className="gap-2">
                        <Snowflake className="w-4 h-4 text-cyan-500" />
                        Frozen
                      </Button>
                      <Button onClick={() => setTemperature(25)} variant="outline" size="sm" className="gap-2">
                        <Droplet className="w-4 h-4 text-blue-500" />
                        Room Temp
                      </Button>
                      <Button onClick={() => setTemperature(120)} variant="outline" size="sm" className="gap-2">
                        <Wind className="w-4 h-4 text-sky-500" />
                        Boiling
                      </Button>
                    </div>

                    {/* Phase transition markers */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="text-xs text-muted-foreground mb-1">Melting Point</div>
                        <div className="text-lg font-bold text-primary">0°C</div>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <div className="text-xs text-muted-foreground mb-1">Boiling Point</div>
                        <div className="text-lg font-bold text-amber-600">100°C</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Current Phase */}
                <Card className={`border-${phase.color}-500/40 bg-${phase.color}-500/5`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <PhaseIcon className={`w-5 h-5 text-${phase.color}-500`} />
                      <CardTitle className="text-lg">Current Phase</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold text-${phase.color}-600 dark:text-${phase.color}-400 mb-3`}>
                      {phase.name}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{getPhaseDescription()}</p>
                  </CardContent>
                </Card>

                {/* How It Works */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">How It Works</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Snowflake className="w-4 h-4 text-cyan-500" />
                        <h4 className="font-semibold text-cyan-700 dark:text-cyan-300">Solid State</h4>
                      </div>
                      <p className="text-muted-foreground">
                        Below 0°C, molecules form rigid ice crystals with fixed positions.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplet className="w-4 h-4 text-blue-500" />
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300">Liquid State</h4>
                      </div>
                      <p className="text-muted-foreground">
                        0°C to 100°C, molecules flow freely while staying close together.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-sky-500" />
                        <h4 className="font-semibold text-sky-700 dark:text-sky-300">Gas State</h4>
                      </div>
                      <p className="text-muted-foreground">
                        Above 100°C, molecules escape as steam with high kinetic energy.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Key Concept
                      </h4>
                      <p className="text-muted-foreground">
                        <strong>Heating adds kinetic energy to particles,</strong> causing them to move faster and
                        transition between states. Cooling reverses this process by removing energy.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Fullscreen button */}
                <Button onClick={toggleFullscreen} variant="outline" className="w-full gap-2 bg-transparent">
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  {isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(PhaseTransitionsPage), { ssr: false })
