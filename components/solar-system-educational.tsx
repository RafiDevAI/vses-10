"use client"

import React, { useRef, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text, Stars } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, ZoomIn, Maximize, Minimize, ChevronDown, ChevronUp } from "lucide-react"

interface PlanetData {
  name: string
  distance: number
  size: number
  color: string
  temperature: string
  composition: string
  facts: string[]
  orbitSpeed: number
}

const planetsData: PlanetData[] = [
  {
    name: "Mercury",
    distance: 4,
    size: 0.3,
    color: "#8C7853",
    temperature: "-173°C to 427°C",
    composition: "Rocky, iron core",
    facts: ["Closest to Sun", "No atmosphere", "Extreme temps"],
    orbitSpeed: 4.15,
  },
  {
    name: "Venus",
    distance: 6,
    size: 0.4,
    color: "#FFC649",
    temperature: "462°C",
    composition: "Rocky, dense CO2 atmosphere",
    facts: ["Hottest planet", "Thick clouds", "Rotates backwards"],
    orbitSpeed: 1.62,
  },
  {
    name: "Earth",
    distance: 8,
    size: 0.5,
    color: "#6B93D6",
    temperature: "-89°C to 58°C",
    composition: "Rocky, water, oxygen",
    facts: ["Only known life", "71% water", "One moon"],
    orbitSpeed: 1.0,
  },
  {
    name: "Mars",
    distance: 10,
    size: 0.4,
    color: "#CD5C5C",
    temperature: "-87°C to -5°C",
    composition: "Rocky, iron oxide",
    facts: ["Red Planet", "Ice caps", "Olympus Mons volcano"],
    orbitSpeed: 0.53,
  },
  {
    name: "Jupiter",
    distance: 14,
    size: 1.2,
    color: "#D8CA9D",
    temperature: "-108°C",
    composition: "Gas giant, H2/He",
    facts: ["Largest planet", "Great Red Spot", "79 moons"],
    orbitSpeed: 0.084,
  },
  {
    name: "Saturn",
    distance: 18,
    size: 1.0,
    color: "#FAD5A5",
    temperature: "-139°C",
    composition: "Gas giant, H2/He",
    facts: ["Famous rings", "Low density", "83 moons"],
    orbitSpeed: 0.034,
  },
  {
    name: "Uranus",
    distance: 22,
    size: 0.8,
    color: "#4FD0E7",
    temperature: "-197°C",
    composition: "Ice giant, water/methane/ammonia",
    facts: ["Tilted sideways", "Faint rings", "27 moons"],
    orbitSpeed: 0.012,
  },
  {
    name: "Neptune",
    distance: 26,
    size: 0.8,
    color: "#4B70DD",
    temperature: "-201°C",
    composition: "Ice giant, water/methane/ammonia",
    facts: ["Windiest planet", "Deep blue", "14 moons"],
    orbitSpeed: 0.006,
  },
]

interface SunProps {
  intensity?: number
}

const Sun: React.FC<SunProps> = ({ intensity = 3 }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      {/* Main sun light - brighter, longer reach */}
      <pointLight position={[0, 0, 0]} intensity={intensity * 4} distance={200} decay={1.2} color="#FFE08A" />
      {/* Secondary warm fill so far planets stay lit */}
      <pointLight position={[0, 0, 0]} intensity={intensity * 1.5} distance={300} decay={0.8} color="#FDB813" />

      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#FDB813" emissive="#FFD700" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.5} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.25} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

interface OrbitRingProps {
  radius: number
}

const OrbitRing: React.FC<OrbitRingProps> = ({ radius }) => {
  const geometry = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      pts.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3))
    return geo
  }, [radius])

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="#38bdf8" opacity={0.45} transparent />
    </lineLoop>
  )
}

interface PlanetProps {
  data: PlanetData
  isPlaying: boolean
  speedMultiplier: number
  showLabels: boolean
  showDistance: boolean
  realTimeSpeed: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
}

const Planet: React.FC<PlanetProps> = ({
  data,
  isPlaying,
  speedMultiplier,
  showLabels,
  showDistance,
  realTimeSpeed,
  onClick,
  onHover,
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (groupRef.current && isPlaying) {
      const speed = realTimeSpeed ? data.orbitSpeed : 1.0
      angleRef.current += delta * 0.1 * speedMultiplier * speed

      const x = Math.cos(angleRef.current) * data.distance
      const z = Math.sin(angleRef.current) * data.distance

      groupRef.current.position.x = x
      groupRef.current.position.z = z
      groupRef.current.position.y = 0
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
    if (glowRef.current) {
      const targetOpacity = hovered ? 0.4 : 0.2
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity += (targetOpacity - material.opacity) * 0.1
    }
  })

  const scale = hovered ? 1.2 : 1.0

  return (
    <group ref={groupRef}>
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[data.size, 24, 24]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>

      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => {
          setHovered(true)
          onHover(true)
        }}
        onPointerOut={() => {
          setHovered(false)
          onHover(false)
        }}
        scale={scale}
      >
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          metalness={0.15}
          roughness={0.6}
          emissive={data.color}
          emissiveIntensity={0.35}
        />
      </mesh>

      {showLabels && (
        <Text
          position={[0, data.size + 0.5, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {data.name}
        </Text>
      )}
      {showDistance && (
        <Text
          position={[0, data.size + 0.8, 0]}
          fontSize={0.2}
          color="#22d3ee"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {(data.distance * 0.1).toFixed(1)} AU
        </Text>
      )}
    </group>
  )
}

interface MoonProps {
  parentDistance: number
  parentSize: number
  isPlaying: boolean
  speedMultiplier: number
}

const Moon: React.FC<MoonProps> = ({ parentDistance, parentSize, isPlaying, speedMultiplier }) => {
  const groupRef = useRef<THREE.Group>(null)
  const angleRef = useRef(0)

  useFrame((state, delta) => {
    if (groupRef.current && isPlaying) {
      angleRef.current += delta * 0.5 * speedMultiplier
      const earthAngle = state.clock.elapsedTime * 0.1 * speedMultiplier
      const earthX = Math.cos(earthAngle) * parentDistance
      const earthZ = Math.sin(earthAngle) * parentDistance

      groupRef.current.position.x = earthX + Math.cos(angleRef.current) * 0.6
      groupRef.current.position.z = earthZ + Math.sin(angleRef.current) * 0.6
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#C9C0BB" />
      </mesh>
    </group>
  )
}

interface SaturnRingsProps {
  innerRadius: number
  outerRadius: number
}

const SaturnRings: React.FC<SaturnRingsProps> = ({ innerRadius, outerRadius }) => {
  return (
    <group rotation={[Math.PI / 2.2, 0, 0]}>
      <mesh>
        <ringGeometry args={[innerRadius, outerRadius, 64]} />
        <meshStandardMaterial
          color="#C4A777"
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
          metalness={0.5}
          roughness={0.5}
          emissive="#C4A777"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[outerRadius + 0.1, outerRadius + 0.3, 64]} />
        <meshStandardMaterial
          color="#D4B787"
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[outerRadius + 0.4, outerRadius + 0.6, 64]} />
        <meshStandardMaterial
          color="#C4A777"
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}

interface SaturnWithRingsProps {
  data: PlanetData
  isPlaying: boolean
  speedMultiplier: number
  showLabels: boolean
  showDistance: boolean
  realTimeSpeed: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
}

const SaturnWithRings: React.FC<SaturnWithRingsProps> = (props) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (groupRef.current && props.isPlaying) {
      const speed = props.realTimeSpeed ? props.data.orbitSpeed : 1.0
      angleRef.current += delta * 0.1 * props.speedMultiplier * speed

      const x = Math.cos(angleRef.current) * props.data.distance
      const z = Math.sin(angleRef.current) * props.data.distance

      groupRef.current.position.x = x
      groupRef.current.position.z = z
      groupRef.current.position.y = 0
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  const scale = hovered ? 1.2 : 1.0

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={props.onClick}
        onPointerOver={() => {
          setHovered(true)
          props.onHover(true)
        }}
        onPointerOut={() => {
          setHovered(false)
          props.onHover(false)
        }}
        scale={scale}
      >
        <sphereGeometry args={[props.data.size, 24, 24]} />
        <meshStandardMaterial color={props.data.color} />
      </mesh>
      <SaturnRings innerRadius={props.data.size + 0.2} outerRadius={props.data.size + 0.5} />
      {props.showLabels && (
        <Text
          position={[0, props.data.size + 0.5, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {props.data.name}
        </Text>
      )}
      {props.showDistance && (
        <Text position={[0, props.data.size + 0.8, 0]} fontSize={0.2} color="#aaaaaa" anchorX="center" anchorY="middle">
          {(props.data.distance * 0.1).toFixed(1)} AU
        </Text>
      )}
    </group>
  )
}

interface AsteroidBeltProps {
  isPlaying: boolean
  speedMultiplier: number
}

const AsteroidBelt: React.FC<AsteroidBeltProps> = ({ isPlaying, speedMultiplier }) => {
  const asteroids = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      angle: (i / 50) * Math.PI * 2,
      distance: 12 + Math.random() * 1,
      size: 0.05 + Math.random() * 0.1,
      speed: 0.5 + Math.random() * 0.5,
    }))
  }, [])

  return (
    <group>
      {asteroids.map((asteroid, i) => (
        <Asteroid
          key={i}
          angle={asteroid.angle}
          distance={asteroid.distance}
          size={asteroid.size}
          speed={asteroid.speed}
          isPlaying={isPlaying}
          speedMultiplier={speedMultiplier}
        />
      ))}
    </group>
  )
}

interface AsteroidProps {
  angle: number
  distance: number
  size: number
  speed: number
  isPlaying: boolean
  speedMultiplier: number
}

const Asteroid: React.FC<AsteroidProps> = ({ angle, distance, size, speed, isPlaying, speedMultiplier }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const angleRef = useRef(angle)

  useFrame((state, delta) => {
    if (meshRef.current && isPlaying) {
      angleRef.current += delta * 0.05 * speed * speedMultiplier
      meshRef.current.position.x = Math.cos(angleRef.current) * distance
      meshRef.current.position.z = Math.sin(angleRef.current) * distance
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  )
}

interface PlutoProps {
  isPlaying: boolean
  speedMultiplier: number
  showLabels: boolean
}

const Pluto: React.FC<PlutoProps> = ({ isPlaying, speedMultiplier, showLabels }) => {
  const groupRef = useRef<THREE.Group>(null)
  const angleRef = useRef(0)

  useFrame((state, delta) => {
    if (groupRef.current && isPlaying) {
      angleRef.current += delta * 0.1 * speedMultiplier * 0.004
      groupRef.current.position.x = Math.cos(angleRef.current) * 30
      groupRef.current.position.z = Math.sin(angleRef.current) * 30
    }
  })

  return (
    <group ref={groupRef} position={[30, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#A0826D" />
      </mesh>
      {showLabels && (
        <Text
          position={[0, 0.7, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          Pluto
        </Text>
      )}
    </group>
  )
}

interface SceneProps {
  isPlaying: boolean
  speedMultiplier: number
  showLabels: boolean
  showDistance: boolean
  showMoon: boolean
  showAsteroidBelt: boolean
  showDwarfPlanets: boolean
  realTimeSpeed: boolean
  onPlanetClick: (planet: PlanetData) => void
  cameraPosition: [number, number, number]
}

const Scene: React.FC<SceneProps> = ({
  isPlaying,
  speedMultiplier,
  showLabels,
  showDistance,
  showMoon,
  showAsteroidBelt,
  showDwarfPlanets,
  realTimeSpeed,
  onPlanetClick,
  cameraPosition,
}) => {
  const { camera } = useThree()
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)

  React.useEffect(() => {
    camera.position.set(...cameraPosition)
    camera.lookAt(0, 0, 0)
  }, [cameraPosition, camera])

  return (
    <>
      {/* Rich starfield - more stars, brighter */}
      <Stars radius={300} depth={60} count={12000} factor={5} saturation={0.8} fade speed={0.3} />

      {/* Base ambient - enough to see planet dark sides */}
      <ambientLight intensity={0.55} color="#c8d8f0" />

      {/* Cool blue-purple hemisphere for space feel */}
      <hemisphereLight args={['#1a2a4a', '#0a0a14', 0.4]} />

      <Sun />

      {planetsData.map((planet) => (
        <React.Fragment key={planet.name}>
          <OrbitRing radius={planet.distance} />
          {planet.name === "Saturn" ? (
            <SaturnWithRings
              data={planet}
              isPlaying={isPlaying}
              speedMultiplier={speedMultiplier}
              showLabels={showLabels}
              showDistance={showDistance}
              realTimeSpeed={realTimeSpeed}
              onClick={() => onPlanetClick(planet)}
              onHover={(hovered) => setHoveredPlanet(hovered ? planet.name : null)}
            />
          ) : (
            <Planet
              data={planet}
              isPlaying={isPlaying}
              speedMultiplier={speedMultiplier}
              showLabels={showLabels}
              showDistance={showDistance}
              realTimeSpeed={realTimeSpeed}
              onClick={() => onPlanetClick(planet)}
              onHover={(hovered) => setHoveredPlanet(hovered ? planet.name : null)}
            />
          )}
        </React.Fragment>
      ))}

      {showMoon && <Moon parentDistance={8} parentSize={0.5} isPlaying={isPlaying} speedMultiplier={speedMultiplier} />}

      {showAsteroidBelt && <AsteroidBelt isPlaying={isPlaying} speedMultiplier={speedMultiplier} />}

      {showDwarfPlanets && (
        <>
          <OrbitRing radius={30} />
          <Pluto isPlaying={isPlaying} speedMultiplier={speedMultiplier} showLabels={showLabels} />
        </>
      )}

      <OrbitControls enablePan enableZoom enableRotate />
    </>
  )
}

export default function SolarSystemEducational({
  onPlanetSelect,
}: { onPlanetSelect?: (planet: PlanetData | null) => void }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [showDistance, setShowDistance] = useState(false)
  const [showMoon, setShowMoon] = useState(true)
  const [showAsteroidBelt, setShowAsteroidBelt] = useState(false)
  const [showDwarfPlanets, setShowDwarfPlanets] = useState(false)
  const [realTimeSpeed, setRealTimeSpeed] = useState(false)
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 40, 40])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isControlsExpanded, setIsControlsExpanded] = useState(true)
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

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handleReset = () => {
    setCameraPosition([0, 40, 40])
    setSpeedMultiplier(1)
    setIsPlaying(true)
  }

  const handleZoomToFit = () => {
    setCameraPosition([0, 50, 50])
  }

  const handleZoomToPlanet = (planet: PlanetData) => {
    const distance = planet.distance + planet.size * 3
    setCameraPosition([distance, distance * 0.5, distance])
  }

  const handlePlanetClick = (planet: PlanetData) => {
    onPlanetSelect?.(planet)
    handleZoomToPlanet(planet)
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-black relative" style={{ background: '#000', minHeight: '100%' }}>
      <Canvas
        camera={{ position: [0, 40, 40], fov: 60 }}
        gl={{ antialias: true }}
        style={{ background: '#000' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000', 1)
        }}
      >
        <Scene
          isPlaying={isPlaying}
          speedMultiplier={speedMultiplier}
          showLabels={showLabels}
          showDistance={showDistance}
          showMoon={showMoon}
          showAsteroidBelt={showAsteroidBelt}
          showDwarfPlanets={showDwarfPlanets}
          realTimeSpeed={realTimeSpeed}
          onPlanetClick={handlePlanetClick}
          cameraPosition={cameraPosition}
        />
      </Canvas>

      <Button
        onClick={toggleFullscreen}
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 bg-black/80 backdrop-blur border-purple-500/30 text-white hover:bg-black/90 shadow-[0_0_20px_rgba(139,92,246,0.3)] z-50"
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </Button>

      <Card className="absolute top-16 left-4 w-72 bg-black/80 backdrop-blur-xl border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] overflow-hidden transition-all duration-300">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-purple-500/10"
          onClick={() => setIsControlsExpanded(!isControlsExpanded)}
        >
          <h2 className="text-lg font-bold text-white">Solar System Controls</h2>
          {isControlsExpanded ? (
            <ChevronUp className="w-5 h-5 text-cyan-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-cyan-400" />
          )}
        </div>

        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{
            maxHeight: isControlsExpanded ? "600px" : "0px",
            opacity: isControlsExpanded ? 1 : 0,
          }}
        >
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="labels"
                  checked={showLabels}
                  onCheckedChange={(checked) => setShowLabels(checked as boolean)}
                  className="border-purple-500/50 data-[state=checked]:bg-purple-500"
                />
                <label htmlFor="labels" className="text-sm text-white/90 cursor-pointer">
                  Show Planet Labels
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="distance"
                  checked={showDistance}
                  onCheckedChange={(checked) => setShowDistance(checked as boolean)}
                  className="border-cyan-500/50 data-[state=checked]:bg-cyan-500"
                />
                <label htmlFor="distance" className="text-sm text-white/90 cursor-pointer">
                  Show Distance Info
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="moon"
                  checked={showMoon}
                  onCheckedChange={(checked) => setShowMoon(checked as boolean)}
                  className="border-blue-500/50 data-[state=checked]:bg-blue-500"
                />
                <label htmlFor="moon" className="text-sm text-white/90 cursor-pointer">
                  Show Earth's Moon
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="asteroid"
                  checked={showAsteroidBelt}
                  onCheckedChange={(checked) => setShowAsteroidBelt(checked as boolean)}
                  className="border-pink-500/50 data-[state=checked]:bg-pink-500"
                />
                <label htmlFor="asteroid" className="text-sm text-white/90 cursor-pointer">
                  Show Asteroid Belt
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dwarf"
                  checked={showDwarfPlanets}
                  onCheckedChange={(checked) => setShowDwarfPlanets(checked as boolean)}
                  className="border-indigo-500/50 data-[state=checked]:bg-indigo-500"
                />
                <label htmlFor="dwarf" className="text-sm text-white/90 cursor-pointer">
                  Show Dwarf Planets
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="realtime"
                  checked={realTimeSpeed}
                  onCheckedChange={(checked) => setRealTimeSpeed(checked as boolean)}
                  className="border-purple-500/50 data-[state=checked]:bg-purple-500"
                />
                <label htmlFor="realtime" className="text-sm text-white/90 cursor-pointer">
                  Real-time Orbital Speeds
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-purple-500/20 border-purple-500/30 text-white hover:bg-purple-500/30"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="bg-cyan-500/20 border-cyan-500/30 text-white hover:bg-cyan-500/30"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleZoomToFit}
                variant="outline"
                size="sm"
                className="w-full bg-blue-500/20 border-blue-500/30 text-white hover:bg-blue-500/30"
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                Zoom to Fit
              </Button>

              <div className="space-y-2">
                <label className="text-sm text-white/90">Orbital Speed: {speedMultiplier.toFixed(1)}x</label>
                <Slider
                  value={[speedMultiplier]}
                  onValueChange={(value) => setSpeedMultiplier(value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
