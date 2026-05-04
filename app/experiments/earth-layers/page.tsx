"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Maximize2, Minimize2, RotateCw, Eye, Scissors } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface LayerInfo {
  name: string
  thickness: string
  state: string
  temperature: string
  composition: string
  facts: string[]
  color: string
}

function createEarthTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 4096
  canvas.height = 2048
  const ctx = canvas.getContext("2d")!

  const oceanGradient = ctx.createRadialGradient(2048, 1024, 100, 2048, 1024, 2048)
  oceanGradient.addColorStop(0, "#0a4a7a")
  oceanGradient.addColorStop(0.3, "#1e5a8a")
  oceanGradient.addColorStop(0.6, "#2563eb")
  oceanGradient.addColorStop(1, "#1e3a8a")
  ctx.fillStyle = oceanGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    ctx.fillStyle = `rgba(30, 90, 138, ${Math.random() * 0.3})`
    ctx.fillRect(x, y, 2, 2)
  }

  ctx.fillStyle = "#1a5c2e"
  ctx.beginPath()
  ctx.moveTo(600, 400)
  ctx.bezierCurveTo(500, 300, 550, 250, 700, 300)
  ctx.bezierCurveTo(800, 320, 850, 400, 900, 500)
  ctx.bezierCurveTo(880, 600, 800, 700, 700, 750)
  ctx.bezierCurveTo(600, 720, 550, 650, 600, 400)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(850, 850)
  ctx.bezierCurveTo(900, 800, 950, 850, 980, 950)
  ctx.bezierCurveTo(1000, 1100, 950, 1250, 900, 1350)
  ctx.bezierCurveTo(850, 1320, 820, 1200, 850, 850)
  ctx.fill()

  ctx.fillStyle = "#2d5016"
  ctx.beginPath()
  ctx.moveTo(1900, 600)
  ctx.bezierCurveTo(2100, 550, 2200, 650, 2250, 800)
  ctx.bezierCurveTo(2280, 950, 2250, 1100, 2150, 1200)
  ctx.bezierCurveTo(2050, 1250, 1950, 1200, 1900, 1050)
  ctx.bezierCurveTo(1880, 900, 1850, 750, 1900, 600)
  ctx.fill()

  ctx.fillStyle = "#1a5c2e"
  ctx.beginPath()
  ctx.moveTo(2300, 300)
  ctx.bezierCurveTo(2800, 250, 3200, 350, 3500, 500)
  ctx.bezierCurveTo(3600, 650, 3550, 800, 3400, 850)
  ctx.bezierCurveTo(3100, 900, 2800, 850, 2500, 750)
  ctx.bezierCurveTo(2350, 650, 2250, 500, 2300, 300)
  ctx.fill()

  ctx.beginPath()
  ctx.ellipse(3400, 1350, 160, 120, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "#3a7c1f"
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    if (Math.random() > 0.7) {
      ctx.fillRect(x, y, 3, 3)
    }
  }

  const polarGradient = ctx.createLinearGradient(0, 0, 0, 150)
  polarGradient.addColorStop(0, "#ffffff")
  polarGradient.addColorStop(0.6, "#e0f2fe")
  polarGradient.addColorStop(1, "rgba(224, 242, 254, 0)")

  ctx.fillStyle = polarGradient
  ctx.fillRect(0, 0, canvas.width, 150)

  const polarGradient2 = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height)
  polarGradient2.addColorStop(0, "rgba(224, 242, 254, 0)")
  polarGradient2.addColorStop(0.4, "#e0f2fe")
  polarGradient2.addColorStop(1, "#ffffff")

  ctx.fillStyle = polarGradient2
  ctx.fillRect(0, canvas.height - 150, canvas.width, 150)

  ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const size = 20 + Math.random() * 40
    ctx.beginPath()
    ctx.ellipse(x, y, size, size * 0.6, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

function EarthLayers({
  isCut,
  cutProgress,
  onLayerClick,
  hoveredLayer,
  layerVisibility,
  rotationSpeed,
  localizedData,
}: {
  isCut: boolean
  cutProgress: number
  onLayerClick: (layer: string) => void
  hoveredLayer: string | null
  layerVisibility: Record<string, boolean>
  rotationSpeed: number
  localizedData: Record<string, LayerInfo>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const earthTexture = useMemo(() => createEarthTexture(), [])

  useFrame(() => {
    if (groupRef.current && !isCut) {
      groupRef.current.rotation.y += 0.003 * rotationSpeed
    }
  })

  const clippingPlanes = useMemo(() => {
    if (!isCut || cutProgress === 0) return []

    const offset = (1 - cutProgress) * 8
    const plane1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), offset)
    const plane2 = new THREE.Plane(new THREE.Vector3(0, 0, -1), offset)

    return [plane1, plane2]
  }, [isCut, cutProgress])

  return (
    <group ref={groupRef}>
      {/* Inner Core */}
      {layerVisibility.innerCore && (
        <mesh
          onClick={() => isCut && onLayerClick("innerCore")}
          onPointerOver={(e) => {
            e.stopPropagation()
          }}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshPhongMaterial
            color={hoveredLayer === "innerCore" ? "#FFFFBB" : localizedData.innerCore.color}
            emissive="#FFFF66"
            emissiveIntensity={hoveredLayer === "innerCore" ? 0.6 : 0.4}
            side={THREE.DoubleSide}
            clippingPlanes={clippingPlanes}
            clipIntersection={true}
          />
        </mesh>
      )}

      {isCut && cutProgress > 0.5 && layerVisibility.innerCore && (
        <mesh>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshBasicMaterial
            color="#000000"
            side={THREE.BackSide}
            clippingPlanes={clippingPlanes}
            clipIntersection={true}
          />
        </mesh>
      )}

      {/* Outer Core */}
      {layerVisibility.outerCore && (
        <mesh
          onClick={() => isCut && onLayerClick("outerCore")}
          onPointerOver={(e) => {
            e.stopPropagation()
          }}
        >
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshPhongMaterial
            color={hoveredLayer === "outerCore" ? "#FFBB66" : localizedData.outerCore.color}
            emissiveIntensity={hoveredLayer === "outerCore" ? 0.3 : 0.1}
            side={THREE.DoubleSide}
            clippingPlanes={clippingPlanes}
            clipIntersection={true}
          />
        </mesh>
      )}

      {isCut && cutProgress > 0.5 && layerVisibility.outerCore && (
        <mesh>
          <sphereGeometry args={[1.32, 32, 32]} />
          <meshBasicMaterial
            color="#000000"
            side={THREE.BackSide}
            clippingPlanes={clippingPlanes}
            clipIntersection={true}
          />
        </mesh>
      )}

      {/* Mantle */}
      {layerVisibility.mantle && (
        <mesh
          onClick={() => isCut && onLayerClick("mantle")}
          onPointerOver={(e) => {
            e.stopPropagation()
          }}
        >
          <sphereGeometry args={[3.7, 32, 32]} />
          <meshStandardMaterial
            color={hoveredLayer === "mantle" ? "#FF6633" : localizedData.mantle.color}
            emissiveIntensity={hoveredLayer === "mantle" ? 0.2 : 0}
            roughness={0.6}
            side={THREE.DoubleSide}
            clippingPlanes={clippingPlanes}
            clipIntersection={true}
          />
        </mesh>
      )}

      {isCut && cutProgress > 0.5 && layerVisibility.mantle && (
        <mesh>
          <sphereGeometry args={[3.72, 32, 32]} />
          <meshBasicMaterial
            color="#000000"
            side={THREE.BackSide}
            clippingPlanes={clippingPlanes}
            clipIntersection={true}
          />
        </mesh>
      )}

      {/* Crust */}
      {layerVisibility.crust && (
        <mesh
          onClick={() => isCut && onLayerClick("crust")}
          onPointerOver={(e) => {
            e.stopPropagation()
          }}
        >
          <sphereGeometry args={[3.85, 32, 32]} />
          <meshStandardMaterial
            color={hoveredLayer === "crust" ? "#A0613A" : localizedData.crust.color}
            emissiveIntensity={hoveredLayer === "crust" ? 0.2 : 0}
            roughness={0.9}
            side={THREE.DoubleSide}
            clippingPlanes={clippingPlanes}
            clipIntersection={true}
          />
        </mesh>
      )}

      {/* Earth Surface */}
      <mesh>
        <sphereGeometry args={[3.9, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          side={THREE.DoubleSide}
          clippingPlanes={clippingPlanes}
          clipIntersection={true}
        />
      </mesh>
    </group>
  )
}

function Scene({
  isCut,
  cutProgress,
  onLayerClick,
  onLayerHover,
  layerVisibility,
  rotationSpeed,
  localizedData,
}: {
  isCut: boolean
  cutProgress: number
  onLayerClick: (layer: string) => void
  onLayerHover: (layer: string | null) => void
  layerVisibility: Record<string, boolean>
  rotationSpeed: number
  localizedData: Record<string, LayerInfo>
}) {
  const { camera } = useThree()
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null)

  useEffect(() => {
    const startPos = new THREE.Vector3(0, 0, 12)
    const endPos = new THREE.Vector3(6, 4, 6)
    const duration = 1000
    const startTime = Date.now()

    if (isCut && cutProgress === 0) return

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (isCut) {
        camera.position.lerpVectors(startPos, endPos, progress)
      } else {
        camera.position.lerpVectors(endPos, startPos, progress)
      }

      camera.lookAt(0, 0, 0)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [isCut, camera])

  const handlePointerMove = (e: any) => {
    if (!isCut) return

    const intersections = e.intersections
    if (intersections.length > 0) {
      const object = intersections[0].object
      const radius = (object.geometry as THREE.SphereGeometry).parameters.radius

      let layer = null
      if (radius < 0.6) layer = "innerCore"
      else if (radius < 1.4) layer = "outerCore"
      else if (radius < 3.8) layer = "mantle"
      else if (radius < 3.9) layer = "crust"

      setHoveredLayer(layer)
      onLayerHover(layer)
    } else {
      setHoveredLayer(null)
      onLayerHover(null)
    }
  }

  return (
    <group
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        setHoveredLayer(null)
        onLayerHover(null)
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <EarthLayers
        isCut={isCut}
        cutProgress={cutProgress}
        onLayerClick={onLayerClick}
        hoveredLayer={hoveredLayer}
        layerVisibility={layerVisibility}
        rotationSpeed={rotationSpeed}
        localizedData={localizedData}
      />
      <OrbitControls enableZoom={true} enablePan={true} minDistance={8} maxDistance={20} />
    </group>
  )
}

function EarthLayersPage() {
  const { t } = useLanguage()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCut, setIsCut] = useState(false)
  const [cutProgress, setCutProgress] = useState(0)
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null)
  const [layerVisibility, setLayerVisibility] = useState({
    crust: true,
    mantle: true,
    outerCore: true,
    innerCore: true,
  })
  const [rotationSpeed, setRotationSpeed] = useState(1)

  const layerData = useMemo<Record<string, LayerInfo>>(() => ({
    crust: {
      name: "Crust",
      thickness: "5-70 km",
      state: "Solid rock",
      temperature: "0°C to 900°C",
      composition: "Silicate rocks (granite, basalt)",
      facts: ["Thinnest layer of Earth", "Where we live", "Contains all mountains and oceans"],
      color: "#8B4513",
    },
    mantle: {
      name: "Mantle",
      thickness: "2,900 km",
      state: "Semi-solid (flows very slowly)",
      temperature: "1,000°C to 3,700°C",
      composition: "Hot, dense silicate rocks",
      facts: ["Largest layer (84% of Earth's volume)", "Causes plate tectonics and volcanoes", "Moves about 2-10 cm per year"],
      color: "#FF4500",
    },
    outerCore: {
      name: "Outer Core",
      thickness: "2,300 km",
      state: "Liquid",
      temperature: "4,500°C to 5,500°C",
      composition: "Liquid iron and nickel",
      facts: ["Creates Earth's magnetic field", "Protects us from solar radiation", "Constantly moving and flowing"],
      color: "#FFA500",
    },
    innerCore: {
      name: "Inner Core",
      thickness: "1,220 km radius",
      state: "Solid (despite extreme heat)",
      temperature: "5,200°C to 6,000°C (hot as Sun's surface)",
      composition: "Solid iron and nickel",
      facts: ["Hottest part of Earth", "Solid due to extreme pressure"],
      color: "#FFFF00",
    },
  }), [t])

  const handleCutToggle = (checked: boolean) => {
    if (checked) {
      setIsCut(true)
      let progress = 0
      const interval = setInterval(() => {
        progress += 0.02
        setCutProgress(progress)
        if (progress >= 1) {
          clearInterval(interval)
        }
      }, 20)
    } else {
      setIsCut(false)
      setCutProgress(0)
      setSelectedLayer(null)
    }
  }

  const toggleLayerVisibility = (layer: keyof typeof layerVisibility) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }))
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {!isFullscreen && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/experiments">
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Experiments
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-700" />
              <div>
                <h1 className="text-xl font-bold text-white">Earth's Layers</h1>
                <p className="text-sm text-slate-400">
                  {isCut
                    ? hoveredLayer
                      ? t("earth.hoverPrompt", { name: layerData[hoveredLayer]?.name })
                      : "Click layers to explore"
                    : "Interactive 3D exploration"}
                </p>
              </div>
            </div>
            <Button
              onClick={setIsFullscreen.bind(null, true)}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
      )}

      {isFullscreen && (
        <Button
          onClick={setIsFullscreen.bind(null, false)}
          className="absolute top-4 right-4 z-20 bg-slate-800/90 hover:bg-slate-700 text-cyan-400 border border-slate-600"
          size="sm"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}

      <Card className="absolute left-6 top-24 z-10 bg-slate-900/90 backdrop-blur-md border-slate-700 p-4 w-72 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Cut Open Earth
            </h3>
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-300">Show Internal Layers</label>
              <Switch checked={isCut} onCheckedChange={handleCutToggle} />
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Layer Visibility
            </h3>
            <div className="space-y-3">
              {Object.entries(layerData).map(([key, data]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-slate-300 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                    {data.name}
                  </label>
                  <Switch
                    checked={layerVisibility[key as keyof typeof layerVisibility]}
                    onCheckedChange={() => toggleLayerVisibility(key as keyof typeof layerVisibility)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <RotateCw className="h-4 w-4" />
              Rotation Speed
            </h3>
            <Slider
              value={[rotationSpeed]}
              onValueChange={(value) => setRotationSpeed(value[0])}
              min={0}
              max={3}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {selectedLayer && (
            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layerData[selectedLayer].color }} />
                  {layerData[selectedLayer].name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedLayer(null)}
                  className="h-6 w-6 text-slate-400 hover:text-cyan-400"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-800/50 rounded p-2">
                  <span className="font-semibold text-cyan-300">Thickness:</span>
                  <p className="text-slate-200 mt-1">{layerData[selectedLayer].thickness}</p>
                </div>
                <div className="bg-slate-800/50 rounded p-2">
                  <span className="font-semibold text-cyan-300">State:</span>
                  <p className="text-slate-200 mt-1">{layerData[selectedLayer].state}</p>
                </div>
                <div className="bg-slate-800/50 rounded p-2">
                  <span className="font-semibold text-cyan-300">Temperature:</span>
                  <p className="text-slate-200 mt-1">{layerData[selectedLayer].temperature}</p>
                </div>
                <div className="bg-slate-800/50 rounded p-2">
                  <span className="font-semibold text-cyan-300">Composition:</span>
                  <p className="text-slate-200 mt-1">{layerData[selectedLayer].composition}</p>
                </div>
                <div className="bg-slate-800/50 rounded p-2">
                  <span className="font-semibold text-cyan-300">Facts:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-200">
                    {layerData[selectedLayer].facts.map((fact, i) => (
                      <li key={i}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ localClippingEnabled: true }}
        className={isFullscreen ? "" : "mt-20"}
      >
        <Scene
          isCut={isCut}
          cutProgress={cutProgress}
          onLayerClick={setSelectedLayer}
          onLayerHover={setHoveredLayer}
          layerVisibility={layerVisibility}
          rotationSpeed={rotationSpeed}
          localizedData={layerData}
        />
      </Canvas>
    </div>
  )
}

export default dynamic(() => Promise.resolve(EarthLayersPage), { ssr: false })
