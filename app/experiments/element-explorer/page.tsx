"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Eye,
  AtomIcon,
  ChevronRight,
  ChevronLeft,
  Minimize,
  Maximize,
  Search,
  Grid3x3,
  List,
  Droplet,
  Wind,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

import * as THREE from "three"
import type { JSX } from "react/jsx-runtime"

const elements = [
  {
    symbol: "H",
    name: "Hydrogen",
    atomicNumber: 1,
    atomicWeight: 1.008,
    category: "Nonmetals",
    electronConfig: "1s¹",
    shells: [1],
    protons: 1,
    neutrons: 0,
    color: "#ffffff",
    state: "Gas",
    meltingPoint: -259.14,
    boilingPoint: -252.87,
    discoverer: "Henry Cavendish",
    yearDiscovered: 1766,
    uses: "Fuel cells, ammonia production, petroleum refining, and as rocket fuel",
    description: "The lightest and most abundant element in the universe, making up about 75% of all matter.",
    funFact: "Hydrogen is the fuel that powers the sun through nuclear fusion reactions.",
  },
  {
    symbol: "He",
    name: "Helium",
    atomicNumber: 2,
    atomicWeight: 4.003,
    category: "Noble Gases",
    electronConfig: "1s²",
    shells: [2],
    protons: 2,
    neutrons: 2,
    color: "#d9ffff",
    state: "Gas",
    meltingPoint: -272.2,
    boilingPoint: -268.93,
    discoverer: "Pierre Janssen & Norman Lockyer",
    yearDiscovered: 1868,
    uses: "Balloons, airships, cryogenics, and as a protective gas in welding",
    description: "The second most abundant element in the universe, helium is a colorless, odorless noble gas.",
    funFact: "Helium was first discovered in the sun's spectrum before being found on Earth!",
  },
  {
    symbol: "Li",
    name: "Lithium",
    atomicNumber: 3,
    atomicWeight: 6.941,
    category: "Alkali Metals",
    electronConfig: "1s² 2s¹",
    shells: [2, 1],
    protons: 3,
    neutrons: 4,
    color: "#cc80ff",
    state: "Solid",
    meltingPoint: 180.5,
    boilingPoint: 1342,
    discoverer: "Johan August Arfwedson",
    yearDiscovered: 1817,
    uses: "Rechargeable batteries, psychiatric medication, and ceramics",
    description: "The lightest metal and least dense solid element, lithium is highly reactive and flammable.",
    funFact: "Lithium batteries power everything from smartphones to electric vehicles!",
  },
  {
    symbol: "Be",
    name: "Beryllium",
    atomicNumber: 4,
    atomicWeight: 9.012,
    category: "Alkaline Earth Metals",
    electronConfig: "1s² 2s²",
    shells: [2, 2],
    protons: 4,
    neutrons: 5,
    color: "#c2ff00",
    state: "Solid",
    meltingPoint: 1287,
    boilingPoint: 2470,
    discoverer: "Louis Nicolas Vauquelin",
    yearDiscovered: 1798,
    uses: "Aerospace materials, X-ray windows, and nuclear reactors",
    description: "A steel-gray, strong, lightweight metal that is toxic in its powdered form.",
    funFact: "Beryllium is used in the James Webb Space Telescope's mirrors!",
  },
  {
    symbol: "B",
    name: "Boron",
    atomicNumber: 5,
    atomicWeight: 10.811,
    category: "Metalloids",
    electronConfig: "1s² 2s² 2p¹",
    shells: [2, 3],
    protons: 5,
    neutrons: 6,
    color: "#ffb5b5",
    state: "Solid",
    meltingPoint: 2075,
    boilingPoint: 4000,
    discoverer: "Joseph Louis Gay-Lussac & Louis Jacques Thénard",
    yearDiscovered: 1808,
    uses: "Glass and ceramics, detergents, and as a semiconductor dopant",
    description: "A metalloid element that is essential for plant growth and has unique chemical properties.",
    funFact: "Boron compounds give fireworks their green color!",
  },
  {
    symbol: "C",
    name: "Carbon",
    atomicNumber: 6,
    atomicWeight: 12.011,
    category: "Nonmetals",
    electronConfig: "1s² 2s² 2p²",
    shells: [2, 4],
    protons: 6,
    neutrons: 6,
    color: "#909090",
    state: "Solid",
    meltingPoint: 3550,
    boilingPoint: 4027,
    discoverer: "Known since ancient times",
    yearDiscovered: -3750,
    uses: "Steel production, plastics, fuels, and the basis of all organic life",
    description: "The foundation of all known life, carbon can form more compounds than any other element.",
    funFact: "Diamonds and graphite are both pure carbon, just arranged differently!",
  },
  {
    symbol: "N",
    name: "Nitrogen",
    atomicNumber: 7,
    atomicWeight: 14.007,
    category: "Nonmetals",
    electronConfig: "1s² 2s² 2p³",
    shells: [2, 5],
    protons: 7,
    neutrons: 7,
    color: "#3050f8",
    state: "Gas",
    meltingPoint: -210.0,
    boilingPoint: -195.79,
    discoverer: "Daniel Rutherford",
    yearDiscovered: 1772,
    uses: "Fertilizers, explosives, food preservation, and creating inert atmospheres",
    description: "Makes up 78% of Earth's atmosphere and is essential for all living organisms.",
    funFact: "Liquid nitrogen is so cold it can freeze almost anything instantly!",
  },
  {
    symbol: "O",
    name: "Oxygen",
    atomicNumber: 8,
    atomicWeight: 15.999,
    category: "Nonmetals",
    electronConfig: "1s² 2s² 2p⁴",
    shells: [2, 6],
    protons: 8,
    neutrons: 8,
    color: "#ff0d0d",
    state: "Gas",
    meltingPoint: -218.79,
    boilingPoint: -182.96,
    discoverer: "Carl Wilhelm Scheele & Joseph Priestley",
    yearDiscovered: 1774,
    uses: "Respiration, combustion, steel production, and medical applications",
    description: "Essential for life, oxygen makes up 21% of Earth's atmosphere and is highly reactive.",
    funFact: "Oxygen is the third most abundant element in the universe!",
  },
  {
    symbol: "F",
    name: "Fluorine",
    atomicNumber: 9,
    atomicWeight: 18.998,
    category: "Halogens",
    electronConfig: "1s² 2s² 2p⁵",
    shells: [2, 7],
    protons: 9,
    neutrons: 10,
    color: "#90e050",
    state: "Gas",
    meltingPoint: -219.62,
    boilingPoint: -188.12,
    discoverer: "Henri Moissan",
    yearDiscovered: 1886,
    uses: "Toothpaste, Teflon, refrigerants, and uranium enrichment",
    description: "The most reactive and electronegative element, fluorine is a pale yellow gas.",
    funFact: "Fluorine is so reactive it can make water burn!",
  },
  {
    symbol: "Ne",
    name: "Neon",
    atomicNumber: 10,
    atomicWeight: 20.18,
    category: "Noble Gases",
    electronConfig: "1s² 2s² 2p⁶",
    shells: [2, 8],
    protons: 10,
    neutrons: 10,
    color: "#b3e3f5",
    state: "Gas",
    meltingPoint: -248.59,
    boilingPoint: -246.08,
    discoverer: "William Ramsay & Morris Travers",
    yearDiscovered: 1898,
    uses: "Neon signs, high-voltage indicators, and cryogenic refrigerant",
    description: "A colorless, odorless noble gas that glows reddish-orange in electric discharge tubes.",
    funFact: "Neon signs don't actually contain neon - they use various gases for different colors!",
  },
  {
    symbol: "Na",
    name: "Sodium",
    atomicNumber: 11,
    atomicWeight: 22.99,
    category: "Alkali Metals",
    electronConfig: "[Ne] 3s¹",
    shells: [2, 8, 1],
    protons: 11,
    neutrons: 12,
    color: "#ab5cf2",
    state: "Solid",
    meltingPoint: 97.72,
    boilingPoint: 883,
    discoverer: "Humphry Davy",
    yearDiscovered: 1807,
    uses: "Table salt, soap, street lights, and as a coolant in nuclear reactors",
    description: "A soft, silvery-white metal that reacts violently with water and is essential for life.",
    funFact: "Sodium is so soft you can cut it with a butter knife!",
  },
  {
    symbol: "Mg",
    name: "Magnesium",
    atomicNumber: 12,
    atomicWeight: 24.305,
    category: "Alkaline Earth Metals",
    electronConfig: "[Ne] 3s²",
    shells: [2, 8, 2],
    protons: 12,
    neutrons: 12,
    color: "#8aff00",
    state: "Solid",
    meltingPoint: 650,
    boilingPoint: 1090,
    discoverer: "Joseph Black",
    yearDiscovered: 1755,
    uses: "Alloys, fireworks, flares, and dietary supplements",
    description: "A shiny gray metal that burns with a brilliant white light and is essential for life.",
    funFact: "Magnesium is the eighth most abundant element in Earth's crust!",
  },
  {
    symbol: "Al",
    name: "Aluminum",
    atomicNumber: 13,
    atomicWeight: 26.982,
    category: "Post-transition Metals",
    electronConfig: "[Ne] 3s² 3p¹",
    shells: [2, 8, 3],
    protons: 13,
    neutrons: 14,
    color: "#bfa6a6",
    state: "Solid",
    meltingPoint: 660.32,
    boilingPoint: 2519,
    discoverer: "Hans Christian Ørsted",
    yearDiscovered: 1825,
    uses: "Packaging, construction, transportation, and electrical transmission",
    description: "The most abundant metal in Earth's crust, aluminum is lightweight and corrosion-resistant.",
    funFact: "Aluminum was once more valuable than gold!",
  },
  {
    symbol: "Si",
    name: "Silicon",
    atomicNumber: 14,
    atomicWeight: 28.086,
    category: "Metalloids",
    electronConfig: "[Ne] 3s² 3p²",
    shells: [2, 8, 4],
    protons: 14,
    neutrons: 14,
    color: "#f0c8a0",
    state: "Solid",
    meltingPoint: 1414,
    boilingPoint: 3265,
    discoverer: "Jöns Jacob Berzelius",
    yearDiscovered: 1824,
    uses: "Computer chips, solar cells, glass, and ceramics",
    description: "The second most abundant element in Earth's crust, silicon is the basis of modern electronics.",
    funFact: "Silicon Valley is named after this element used in computer chips!",
  },
  {
    symbol: "P",
    name: "Phosphorus",
    atomicNumber: 15,
    atomicWeight: 30.974,
    category: "Nonmetals",
    electronConfig: "[Ne] 3s² 3p³",
    shells: [2, 8, 5],
    protons: 15,
    neutrons: 16,
    color: "#ff8000",
    state: "Solid",
    meltingPoint: 44.15,
    boilingPoint: 280.5,
    discoverer: "Hennig Brand",
    yearDiscovered: 1669,
    uses: "Fertilizers, detergents, matches, and fireworks",
    description: "Essential for life, phosphorus exists in several forms including white, red, and black.",
    funFact: "White phosphorus glows in the dark and can spontaneously ignite!",
  },
  {
    symbol: "S",
    name: "Sulfur",
    atomicNumber: 16,
    atomicWeight: 32.065,
    category: "Nonmetals",
    electronConfig: "[Ne] 3s² 3p⁴",
    shells: [2, 8, 6],
    protons: 16,
    neutrons: 16,
    color: "#ffff30",
    state: "Solid",
    meltingPoint: 115.21,
    boilingPoint: 444.6,
    discoverer: "Known since ancient times",
    yearDiscovered: -2000,
    uses: "Sulfuric acid, fertilizers, gunpowder, and vulcanizing rubber",
    description: "A bright yellow solid with a distinctive smell, sulfur is essential for life.",
    funFact: "The smell of rotten eggs comes from hydrogen sulfide gas!",
  },
  {
    symbol: "Cl",
    name: "Chlorine",
    atomicNumber: 17,
    atomicWeight: 35.453,
    category: "Halogens",
    electronConfig: "[Ne] 3s² 3p⁵",
    shells: [2, 8, 7],
    protons: 17,
    neutrons: 18,
    color: "#1ff01f",
    state: "Gas",
    meltingPoint: -101.5,
    boilingPoint: -34.04,
    discoverer: "Carl Wilhelm Scheele",
    yearDiscovered: 1774,
    uses: "Water purification, bleach, PVC plastic, and disinfectants",
    description: "A toxic yellow-green gas that is essential for water treatment and sanitation.",
    funFact: "Chlorine gas was used as a chemical weapon in World War I!",
  },
  {
    symbol: "Ar",
    name: "Argon",
    atomicNumber: 18,
    atomicWeight: 39.948,
    category: "Noble Gases",
    electronConfig: "[Ne] 3s² 3p⁶",
    shells: [2, 8, 8],
    protons: 18,
    neutrons: 22,
    color: "#80d1e3",
    state: "Gas",
    meltingPoint: -189.35,
    boilingPoint: -185.85,
    discoverer: "Lord Rayleigh & William Ramsay",
    yearDiscovered: 1894,
    uses: "Light bulbs, welding, and as an inert atmosphere for sensitive processes",
    description: "The third most abundant gas in Earth's atmosphere, argon is colorless and odorless.",
    funFact: "Argon makes up about 1% of Earth's atmosphere!",
  },
  {
    symbol: "K",
    name: "Potassium",
    atomicNumber: 19,
    atomicWeight: 39.098,
    category: "Alkali Metals",
    electronConfig: "[Ar] 4s¹",
    shells: [2, 8, 8, 1],
    protons: 19,
    neutrons: 20,
    color: "#8f40d4",
    state: "Solid",
    meltingPoint: 63.38,
    boilingPoint: 759,
    discoverer: "Humphry Davy",
    yearDiscovered: 1807,
    uses: "Fertilizers, soap, glass, and essential for nerve and muscle function",
    description: "A soft, silvery-white metal that reacts violently with water and is essential for life.",
    funFact: "Bananas are famous for their potassium content!",
  },
  {
    symbol: "Ca",
    name: "Calcium",
    atomicNumber: 20,
    atomicWeight: 40.078,
    category: "Alkaline Earth Metals",
    electronConfig: "[Ar] 4s²",
    shells: [2, 8, 8, 2],
    protons: 20,
    neutrons: 20,
    color: "#3dff00",
    state: "Solid",
    meltingPoint: 842,
    boilingPoint: 1484,
    discoverer: "Humphry Davy",
    yearDiscovered: 1808,
    uses: "Bones and teeth, cement, steel production, and dietary supplements",
    description: "The fifth most abundant element in Earth's crust, calcium is essential for life.",
    funFact: "Your body contains about 1 kg of calcium, mostly in bones and teeth!",
  },
  {
    symbol: "Fe",
    name: "Iron",
    atomicNumber: 26,
    atomicWeight: 55.845,
    category: "Transition Metals",
    electronConfig: "[Ar] 3d⁶ 4s²",
    shells: [2, 8, 14, 2],
    protons: 26,
    neutrons: 30,
    color: "#e06633",
    state: "Solid",
    meltingPoint: 1538,
    boilingPoint: 2862,
    discoverer: "Known since ancient times",
    yearDiscovered: -3500,
    uses: "Steel production, construction, machinery, and essential for blood",
    description: "The most common element on Earth by mass, iron is essential for life and civilization.",
    funFact: "Iron is what makes your blood red!",
  },
  {
    symbol: "Cu",
    name: "Copper",
    atomicNumber: 29,
    atomicWeight: 63.546,
    category: "Transition Metals",
    electronConfig: "[Ar] 3d¹⁰ 4s¹",
    shells: [2, 8, 18, 1],
    protons: 29,
    neutrons: 35,
    color: "#c88033",
    state: "Solid",
    meltingPoint: 1084.62,
    boilingPoint: 2562,
    discoverer: "Known since ancient times",
    yearDiscovered: -9000,
    uses: "Electrical wiring, plumbing, coins, and antimicrobial surfaces",
    description: "A reddish-orange metal with excellent electrical and thermal conductivity.",
    funFact: "Copper is naturally antibacterial and kills germs on contact!",
  },
  {
    symbol: "Zn",
    name: "Zinc",
    atomicNumber: 30,
    atomicWeight: 65.38,
    category: "Transition Metals",
    electronConfig: "[Ar] 3d¹⁰ 4s²",
    shells: [2, 8, 18, 2],
    protons: 30,
    neutrons: 35,
    color: "#7d80b0",
    state: "Solid",
    meltingPoint: 419.53,
    boilingPoint: 907,
    discoverer: "Known since ancient times",
    yearDiscovered: -1000,
    uses: "Galvanizing steel, batteries, alloys, and dietary supplements",
    description: "A bluish-white metal that is essential for life and protects steel from corrosion.",
    funFact: "Zinc is essential for your immune system and wound healing!",
  },
  {
    symbol: "Ag",
    name: "Silver",
    atomicNumber: 47,
    atomicWeight: 107.868,
    category: "Transition Metals",
    electronConfig: "[Kr] 4d¹⁰ 5s¹",
    shells: [2, 8, 18, 18, 1],
    protons: 47,
    neutrons: 61,
    color: "#c0c0c0",
    state: "Solid",
    meltingPoint: 961.78,
    boilingPoint: 2162,
    discoverer: "Known since ancient times",
    yearDiscovered: -5000,
    uses: "Jewelry, coins, photography, electronics, and antimicrobial applications",
    description: "The best conductor of electricity and heat, silver is a lustrous white metal.",
    funFact: "Silver has the highest electrical conductivity of all elements!",
  },
  {
    symbol: "Au",
    name: "Gold",
    atomicNumber: 79,
    atomicWeight: 196.967,
    category: "Transition Metals",
    electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
    shells: [2, 8, 18, 32, 18, 1],
    protons: 79,
    neutrons: 118,
    color: "#ffd123",
    state: "Solid",
    meltingPoint: 1064.18,
    boilingPoint: 2856,
    discoverer: "Known since ancient times",
    yearDiscovered: -6000,
    uses: "Jewelry, currency, electronics, dentistry, and aerospace",
    description: "A dense, soft, shiny yellow metal that is highly valued and doesn't tarnish.",
    funFact: "All the gold ever mined would fit in a cube about 21 meters on each side!",
  },
  {
    symbol: "Hg",
    name: "Mercury",
    atomicNumber: 80,
    atomicWeight: 200.592,
    category: "Transition Metals",
    electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s²",
    shells: [2, 8, 18, 32, 18, 2],
    protons: 80,
    neutrons: 121,
    color: "#b8b8d0",
    state: "Liquid",
    meltingPoint: -38.83,
    boilingPoint: 356.73,
    discoverer: "Known since ancient times",
    yearDiscovered: -1500,
    uses: "Thermometers, barometers, fluorescent lights, and dental amalgams",
    description: "The only metal that is liquid at room temperature, mercury is toxic and dense.",
    funFact: "Mercury is the only metal that's liquid at room temperature!",
  },
  {
    symbol: "Pb",
    name: "Lead",
    atomicNumber: 82,
    atomicWeight: 207.2,
    category: "Post-transition Metals",
    electronConfig: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²",
    shells: [2, 8, 18, 32, 18, 4],
    protons: 82,
    neutrons: 125,
    color: "#575961",
    state: "Solid",
    meltingPoint: 327.46,
    boilingPoint: 1749,
    discoverer: "Known since ancient times",
    yearDiscovered: -7000,
    uses: "Batteries, radiation shielding, and historically in pipes and paint",
    description: "A heavy, soft, malleable metal that is toxic and was widely used in the past.",
    funFact: "Lead is so dense it's used to shield against radiation!",
  },
  {
    symbol: "U",
    name: "Uranium",
    atomicNumber: 92,
    atomicWeight: 238.029,
    category: "Actinides",
    electronConfig: "[Rn] 5f³ 6d¹ 7s²",
    shells: [2, 8, 18, 32, 21, 9, 2],
    protons: 92,
    neutrons: 146,
    color: "#008fff",
    state: "Solid",
    meltingPoint: 1135,
    boilingPoint: 4131,
    discoverer: "Martin Heinrich Klaproth",
    yearDiscovered: 1789,
    uses: "Nuclear power, nuclear weapons, and dating rocks",
    description: "A radioactive metal that is the primary fuel for nuclear reactors and weapons.",
    funFact: "Uranium glows green under UV light and powers nuclear submarines!",
  },
  {
    symbol: "Xe",
    name: "Xenon",
    atomicNumber: 54,
    atomicWeight: 131.293,
    category: "Noble Gases",
    electronConfig: "[Kr] 4d¹⁰ 5s² 5p⁶",
    shells: [2, 8, 18, 18, 8],
    protons: 54,
    neutrons: 77,
    color: "#429eb0",
    state: "Gas",
    meltingPoint: -111.75,
    boilingPoint: -108.04,
    discoverer: "William Ramsay & Morris Travers",
    yearDiscovered: 1898,
    uses: "Flash lamps, arc lamps, anesthesia, and ion propulsion",
    description: "A heavy, colorless noble gas that produces a brilliant white light when electrified.",
    funFact: "Xenon is used in spacecraft ion engines for deep space missions!",
  },
  {
    symbol: "Kr",
    name: "Krypton",
    atomicNumber: 36,
    atomicWeight: 83.798,
    category: "Noble Gases",
    electronConfig: "[Ar] 3d¹⁰ 4s² 4p⁶",
    shells: [2, 8, 18, 8],
    protons: 36,
    neutrons: 48,
    color: "#5cb8d1",
    state: "Gas",
    meltingPoint: -157.36,
    boilingPoint: -153.22,
    discoverer: "William Ramsay & Morris Travers",
    yearDiscovered: 1898,
    uses: "High-performance light bulbs, lasers, and window insulation",
    description: "A colorless, odorless noble gas that produces a bright white light in discharge tubes.",
    funFact: "Krypton is named after the Greek word for 'hidden'!",
  },
]

const categoryColors: Record<string, string> = {
  Nonmetals: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
  "Noble Gases": "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
  "Alkali Metals": "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
  "Alkaline Earth Metals": "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
  "Transition Metals": "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
  "Post-transition Metals": "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
  Metalloids: "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30",
  Halogens: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
  Actinides: "bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30",
}

const stateIcons: Record<string, any> = {
  Gas: Wind,
  Liquid: Droplet,
  Solid: Sparkles,
}

function OrbitalLine({ radius, showLines }: { radius: number; showLines: boolean }) {
  if (!showLines) return null

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Add a subtle glow effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius + 0.05, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Atom3D({
  element,
  viewMode,
  isAnimating,
  showOrbitalLines,
}: {
  element: any
  viewMode: string
  isAnimating: boolean
  showOrbitalLines: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const electronsRef = useRef<THREE.Group[]>([])
  const neutronRingRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!isAnimating || !groupRef.current) return

    groupRef.current.rotation.y += 0.008

    if (neutronRingRef.current) {
      neutronRingRef.current.rotation.y += 0.02
      neutronRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }

    electronsRef.current.forEach((electronGroup, shellIndex) => {
      if (electronGroup) {
        electronGroup.rotation.y += 0.03 - shellIndex * 0.005
      }
    })
  })

  const renderNucleus = () => {
    const nucleusParticles: JSX.Element[] = []
    const particleRadius = 0.08
    const totalParticles = element.protons + element.neutrons

    // Use fibonacci sphere distribution for even packing
    const positions: { position: THREE.Vector3; isProton: boolean }[] = []

    // Generate positions using fibonacci sphere for dense, even distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const angleIncrement = Math.PI * 2 * goldenRatio

    for (let i = 0; i < totalParticles; i++) {
      // Fibonacci sphere algorithm for even distribution
      const t = i / totalParticles
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = angleIncrement * i

      // Calculate radius based on particle index to create layers
      const layerRadius = Math.cbrt(i / totalParticles) * particleRadius * 3.5

      const x = layerRadius * Math.sin(inclination) * Math.cos(azimuth)
      const y = layerRadius * Math.sin(inclination) * Math.sin(azimuth)
      const z = layerRadius * Math.cos(inclination)

      // Determine if this particle is a proton or neutron
      // Mix them randomly but maintain the correct count
      const isProton = i < element.protons

      positions.push({
        position: new THREE.Vector3(x, y, z),
        isProton: isProton,
      })
    }

    // Shuffle positions to randomize proton/neutron placement while keeping dense packing
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = positions[i].isProton
      positions[i].isProton = positions[j].isProton
      positions[j].isProton = temp
    }

    // Render all nucleus particles
    positions.forEach((particle, index) => {
      const color = particle.isProton ? "#ff4757" : "#3742fa" // Red for protons, Blue for neutrons
      const emissive = particle.isProton ? "#ff3742" : "#2f3542"
      const emissiveIntensity = particle.isProton ? 1.0 : 0.9

      nucleusParticles.push(
        <mesh key={`nucleus-${index}`} position={[particle.position.x, particle.position.y, particle.position.z]}>
          <sphereGeometry args={[particleRadius, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            metalness={0.4}
            roughness={0.1}
          />
        </mesh>,
      )
    })

    return (
      <group>
        {nucleusParticles}
        {/* Central lighting for nucleus */}
        <pointLight color="#ff6b6b" intensity={5} distance={3} />
        <pointLight color="#4169e1" intensity={3} distance={3} />
      </group>
    )
  }

  const renderOrbitalRings = () => {
    const rings: JSX.Element[] = []

    element.shells.forEach((electronCount: number, shellIndex: number) => {
      const radius = 2 + shellIndex * 1.8

      rings.push(<OrbitalLine key={`orbital-line-${shellIndex}`} radius={radius} showLines={showOrbitalLines} />)

      const electronElements: JSX.Element[] = []
      for (let i = 0; i < electronCount; i++) {
        const angle = (i / electronCount) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        electronElements.push(
          <mesh key={`electron-${shellIndex}-${i}`} position={[x, 0, z]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#ffb300"
              emissiveIntensity={1.0}
              metalness={0.9}
              roughness={0.1}
            />
            <pointLight color="#ffd700" intensity={0.8} distance={1} />
          </mesh>,
        )
      }

      rings.push(
        <group
          key={`electron-group-${shellIndex}`}
          ref={(el) => {
            if (el) electronsRef.current[shellIndex] = el
          }}
        >
          {electronElements}
        </group>,
      )
    })

    return rings
  }

  return (
    <group ref={groupRef}>
      <Environment preset="night" />
      <ambientLight intensity={0.05} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#4169e1" />

      <fog attach="fog" args={["#0a0a0a", 6, 18]} />

      {renderNucleus()}
      {renderOrbitalRings()}
    </group>
  )
}

function ElementExplorerPage() {
  const [selectedElement, setSelectedElement] = useState(elements[0])
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d")
  const [isAnimating, setIsAnimating] = useState(true)
  const [currentSegment, setCurrentSegment] = useState(0)
  const [showOrbitalLines, setShowOrbitalLines] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredElements = elements.filter((element) => {
    const matchesSearch =
      element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || element.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["All", ...Array.from(new Set(elements.map((e) => e.category)))]

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

  const segments = [
    {
      title: "Atomic Orbitals",
      description: "Explore electron shells and orbital structures with visible paths in 3D space",
    },
    {
      title: "Nucleus Structure",
      description: "Understand proton (red) and neutron (blue) arrangement in the nucleus",
    },
    {
      title: "Electron Configuration",
      description: "Learn how electrons (golden) fill orbitals following quantum rules",
    },
  ]

  const StateIcon = stateIcons[selectedElement.state] || Sparkles

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/experiments"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Experiments
              </Link>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <AtomIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Element Explorer</h1>
                  <p className="text-xs text-muted-foreground">Discover 30 Elements with Detailed Information</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">

              <Button onClick={toggleFullscreen} variant="outline" size="sm">
                {isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
                {isFullscreen ? "Exit" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div ref={containerRef} className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 shadow-lg"
                      style={{
                        backgroundColor: `${selectedElement.color}20`,
                        borderColor: selectedElement.color,
                      }}
                    >
                      <div className="text-xs text-muted-foreground">{selectedElement.atomicNumber}</div>
                      <div className="text-3xl font-bold" style={{ color: selectedElement.color }}>
                        {selectedElement.symbol}
                      </div>
                      <div className="text-xs text-muted-foreground">{selectedElement.atomicWeight}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-3xl">{selectedElement.name}</CardTitle>
                        <StateIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={categoryColors[selectedElement.category] || ""}>
                          {selectedElement.category}
                        </Badge>
                        <Badge variant="outline">{selectedElement.state}</Badge>
                        <Badge variant="outline">{selectedElement.electronConfig}</Badge>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-red-500 font-medium">⚛ {selectedElement.protons} Protons</span>
                        <span className="text-blue-500 font-medium">⚛ {selectedElement.neutrons} Neutrons</span>
                        <span className="text-yellow-500 font-medium">
                          ⚛ {selectedElement.shells.reduce((a, b) => a + b, 0)} Electrons
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "2d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("2d")}
                    >
                      2D
                    </Button>
                    <Button
                      variant={viewMode === "3d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("3d")}
                    >
                      3D
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="uses">Uses</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedElement.description}</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Fun Fact
                      </h3>
                      <p className="text-muted-foreground">{selectedElement.funFact}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="properties" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Melting Point</div>
                        <div className="text-2xl font-bold">{selectedElement.meltingPoint}°C</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Boiling Point</div>
                        <div className="text-2xl font-bold">{selectedElement.boilingPoint}°C</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Atomic Weight</div>
                        <div className="text-2xl font-bold">{selectedElement.atomicWeight}</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">State at Room Temp</div>
                        <div className="text-2xl font-bold">{selectedElement.state}</div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-2">Electron Configuration</div>
                      <div className="text-lg font-mono font-bold">{selectedElement.electronConfig}</div>
                    </div>
                  </TabsContent>
                  <TabsContent value="uses" className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-3">Common Applications</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedElement.uses}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="history" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Discovered By</div>
                        <div className="text-lg font-semibold">{selectedElement.discoverer}</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Year Discovered</div>
                        <div className="text-lg font-semibold">
                          {selectedElement.yearDiscovered > 0
                            ? selectedElement.yearDiscovered
                            : `${Math.abs(selectedElement.yearDiscovered)} BCE`}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 3D Visualization */}
            <Card className="h-[500px] bg-gradient-to-br from-gray-900 to-black">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Atomic Structure with Orbital Paths</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2 mr-4">
                      <Checkbox id="orbital-lines" checked={showOrbitalLines} onCheckedChange={(c) => setShowOrbitalLines(c === true)} />
                      <label htmlFor="orbital-lines" className="text-sm font-medium text-white cursor-pointer">
                        Show Orbital Lines
                      </label>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsAnimating(!isAnimating)}>
                      {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isAnimating ? "Pause" : "Play"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </div>
                <div className="flex gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Protons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Neutrons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Electrons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-white rounded-full"></div>
                    <span>Orbital Paths</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] p-0">
                <Canvas
                  camera={{ position: [0, 0, 8], fov: 50 }}
                  style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)" }}
                >
                  <Atom3D
                    element={selectedElement}
                    viewMode={viewMode}
                    isAnimating={isAnimating}
                    showOrbitalLines={showOrbitalLines}
                  />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                </Canvas>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Browse Elements ({filteredElements.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={displayMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDisplayMode("grid")}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={displayMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDisplayMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search elements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {displayMode === "grid" ? (
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {filteredElements.map((element) => (
                      <button
                        key={element.symbol}
                        onClick={() => setSelectedElement(element)}
                        className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105 ${selectedElement.symbol === element.symbol
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50"
                          }`}
                        style={{
                          backgroundColor: selectedElement.symbol === element.symbol ? `${element.color}20` : undefined,
                        }}
                      >
                        <div className="text-[10px] text-muted-foreground">{element.atomicNumber}</div>
                        <div className="text-lg font-bold" style={{ color: element.color }}>
                          {element.symbol}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredElements.map((element) => (
                      <button
                        key={element.symbol}
                        onClick={() => setSelectedElement(element)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${selectedElement.symbol === element.symbol
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded flex flex-col items-center justify-center border"
                            style={{
                              backgroundColor: `${element.color}20`,
                              borderColor: element.color,
                            }}
                          >
                            <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
                            <div className="text-lg font-bold" style={{ color: element.color }}>
                              {element.symbol}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{element.name}</div>
                            <div className="text-sm text-muted-foreground">{element.category}</div>
                          </div>
                          <Badge className={categoryColors[element.category] || ""}>{element.state}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Elements</span>
                  <span className="font-bold">{elements.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <span className="font-bold">{categories.length - 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Viewing</span>
                  <span className="font-bold">{selectedElement.name}</span>
                </div>
              </CardContent>
            </Card>

            {/* Element Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Element Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground mb-0.5">Atomic Number</div>
                  <div className="text-xl font-bold" style={{ color: selectedElement.color }}>{selectedElement.atomicNumber}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground mb-0.5">Symbol</div>
                  <div className="text-xl font-bold" style={{ color: selectedElement.color }}>{selectedElement.symbol}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground mb-0.5">State at Room Temp</div>
                  <div className="text-sm font-semibold">{selectedElement.state}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground mb-0.5">Electron Config</div>
                  <div className="text-xs font-mono font-bold break-all">{selectedElement.electronConfig}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ElementExplorerPage), {
  ssr: false,
})
