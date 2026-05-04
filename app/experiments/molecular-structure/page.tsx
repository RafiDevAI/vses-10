"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Play, Pause, Maximize, Minimize } from "lucide-react"
import Link from "next/link"
import * as THREE from "three"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Atom {
  element: string
  position: [number, number, number]
  color: string
  size: number
}

interface Bond {
  from: number
  to: number
  type: "single" | "double" | "triple"
}

interface MoleculeData {
  name: string
  formula: string
  description: string
  atoms: Atom[]
  bonds: Bond[]
  geometry: string
}

const molecules: MoleculeData[] = [
  {
    name: "Water",
    formula: "H₂O",
    description: "Water molecule with bent geometry due to lone pairs on oxygen",
    geometry: "Bent (104.5° bond angle)",
    atoms: [
      { element: "O", position: [0, 0, 0], color: "#ff4444", size: 0.8 },
      { element: "H", position: [-0.8, 0.6, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [0.8, 0.6, 0], color: "#ffffff", size: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
    ],
  },
  {
    name: "Methane",
    formula: "CH₄",
    description: "Methane with tetrahedral geometry - perfect 109.5° bond angles",
    geometry: "Tetrahedral (109.5° bond angles)",
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#444444", size: 0.7 },
      { element: "H", position: [0.6, 0.6, 0.6], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-0.6, -0.6, 0.6], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-0.6, 0.6, -0.6], color: "#ffffff", size: 0.4 },
      { element: "H", position: [0.6, -0.6, -0.6], color: "#ffffff", size: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" },
    ],
  },
  {
    name: "Ammonia",
    formula: "NH₃",
    description: "Ammonia with trigonal pyramidal shape due to lone pair on nitrogen",
    geometry: "Trigonal Pyramidal (107° bond angles)",
    atoms: [
      { element: "N", position: [0, 0, 0], color: "#4444ff", size: 0.7 },
      { element: "H", position: [0.8, 0.5, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-0.4, 0.5, 0.7], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-0.4, 0.5, -0.7], color: "#ffffff", size: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
    ],
  },
  {
    name: "Ethene",
    formula: "C₂H₄",
    description: "Ethene with C=C double bond and planar geometry",
    geometry: "Planar (120° bond angles)",
    atoms: [
      { element: "C", position: [-0.7, 0, 0], color: "#444444", size: 0.7 },
      { element: "C", position: [0.7, 0, 0], color: "#444444", size: 0.7 },
      { element: "H", position: [-1.2, 0.8, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-1.2, -0.8, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [1.2, 0.8, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [1.2, -0.8, 0], color: "#ffffff", size: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 1, to: 4, type: "single" },
      { from: 1, to: 5, type: "single" },
    ],
  },
  {
    name: "Carbon Dioxide",
    formula: "CO₂",
    description: "Linear CO₂ molecule with two C=O double bonds",
    geometry: "Linear (180° bond angle)",
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#444444", size: 0.7 },
      { element: "O", position: [-1.2, 0, 0], color: "#ff4444", size: 0.8 },
      { element: "O", position: [1.2, 0, 0], color: "#ff4444", size: 0.8 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" },
    ],
  },
]

function Atom({
  position,
  color,
  size,
  element,
  showLabels,
}: {
  position: [number, number, number]
  color: string
  size: number
  element: string
  showLabels: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {showLabels && (
        <Html distanceFactor={10}>
          <div className="bg-white px-2 py-1 rounded shadow text-sm font-medium">{element}</div>
        </Html>
      )}
    </group>
  )
}

function Bond({
  from,
  to,
  atoms,
  type,
}: {
  from: number
  to: number
  atoms: Atom[]
  type: "single" | "double" | "triple"
}) {
  const { length, midpoint, offsets, quaternion } = useMemo(() => {
    const fromPos = new THREE.Vector3(...atoms[from].position)
    const toPos = new THREE.Vector3(...atoms[to].position)
    const direction = new THREE.Vector3().subVectors(toPos, fromPos)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5)

    const bondCount = type === "single" ? 1 : type === "double" ? 2 : 3
    const bondSpacing = 0.1

    const normalizedDir = direction.clone().normalize()
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalizedDir)

    const offsets = Array.from({ length: bondCount }, (_, i) => {
      return (i - (bondCount - 1) / 2) * bondSpacing
    })

    return { length, midpoint, offsets, quaternion }
  }, [from, to, atoms, type])

  return (
    <group position={midpoint.toArray()} quaternion={quaternion}>
      {offsets.map((offset, i) => (
        <mesh key={i} position={[offset, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, length, 8]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      ))}
    </group>
  )
}
function MoleculeViewer({
  molecule,
  showLabels,
  isRotating,
}: {
  molecule: MoleculeData
  showLabels: boolean
  isRotating: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {molecule.atoms.map((atom, index) => (
        <Atom
          key={index}
          position={atom.position}
          color={atom.color}
          size={atom.size}
          element={atom.element}
          showLabels={showLabels}
        />
      ))}
      {molecule.bonds.map((bond, index) => (
        <Bond key={index} from={bond.from} to={bond.to} atoms={molecule.atoms} type={bond.type} />
      ))}
    </group>
  )
}

function MolecularStructurePage() {
  const [selectedMolecule, setSelectedMolecule] = useState(molecules[0])
  const [showLabels, setShowLabels] = useState(true)
  const [isRotating, setIsRotating] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

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

  return (
    <div ref={containerRef} className="w-full min-h-screen flex flex-col bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/experiments">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("nav.backToExperiments")}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{t("mol.title")}</h1>
              <p className="text-slate-400 mt-1">{t("mol.desc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-900 text-blue-300 border-blue-700">
              {t("sidebar.chemistry")}
            </Badge>
            <Button onClick={toggleFullscreen} variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800">
              {isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
              {isFullscreen ? t("exp.close") : t("nav.fullscreen")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Viewer */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="h-[560px] bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-700">
                <div>
                  <CardTitle className="text-xl text-white">{selectedMolecule.name}</CardTitle>
                  <CardDescription className="text-lg font-mono text-blue-400">
                    {selectedMolecule.formula}
                  </CardDescription>
                  <p className="text-sm text-slate-400 mt-1">{selectedMolecule.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="labels" checked={showLabels} onCheckedChange={(c) => setShowLabels(c === true)} />
                    <label htmlFor="labels" className="text-sm font-medium text-slate-300">
                      {t("mol.showLabels")}
                    </label>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsRotating(!isRotating)} className="border-slate-600 text-slate-200 hover:bg-slate-700">
                    {isRotating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isRotating ? t("exp.pause") : t("exp.play")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[460px] p-0">
                <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <pointLight position={[-10, -10, -5]} intensity={0.5} />
                  <MoleculeViewer molecule={selectedMolecule} showLabels={showLabels} isRotating={isRotating} />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={false} />
                </Canvas>
              </CardContent>
            </Card>

            {/* Molecule Selection */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-700">
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-sm">⚛</span>
                  </div>
                  {t("mol.select")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {molecules.map((molecule) => (
                    <div
                      key={molecule.name}
                      className={`cursor-pointer transition-all rounded-xl border p-3 ${selectedMolecule.name === molecule.name
                        ? "ring-2 ring-blue-500 bg-blue-900/30 border-blue-600"
                        : "border-slate-700 hover:bg-slate-700/60 hover:border-slate-500"
                        }`}
                      onClick={() => setSelectedMolecule(molecule)}
                    >
                      <div className="text-base font-bold text-white">{molecule.name}</div>
                      <div className="text-sm font-mono text-blue-400">{molecule.formula}</div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{molecule.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs border-slate-600 text-slate-400">
                        {molecule.geometry}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side — Molecule Info Panel */}
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-700">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <span className="text-blue-400">⚗️</span> {t("mol.details")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="rounded-lg bg-blue-900/30 border border-blue-700/40 p-3">
                  <div className="text-xs text-blue-400 font-semibold mb-1">{t("mol.formula")}</div>
                  <div className="text-xl font-mono font-bold text-white">{selectedMolecule.formula}</div>
                </div>
                <div className="rounded-lg bg-slate-700/50 border border-slate-600 p-3">
                  <div className="text-xs text-slate-400 font-semibold mb-1">{t("mol.geometry")}</div>
                  <div className="text-sm font-semibold text-slate-200">{selectedMolecule.geometry}</div>
                </div>
                <div className="rounded-lg bg-slate-700/50 border border-slate-600 p-3">
                  <div className="text-xs text-slate-400 font-semibold mb-1">{t("mol.atoms")}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMolecule.atoms.map((atom: any, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: atom.color }}
                      >
                        {atom.element}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-700/50 border border-slate-600 p-3">
                  <div className="text-xs text-slate-400 font-semibold mb-1">{t("mol.about")}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedMolecule.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white">{t("mol.controls")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">🖱️</span> {t("mol.drag")}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🔍</span> {t("mol.zoom")}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🖱️</span> {t("mol.pan")}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(MolecularStructurePage), { ssr: false })
