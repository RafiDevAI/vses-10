"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { RotateCcw, Droplet, Menu, X } from "lucide-react"

type ChemicalType = "acid" | "base" | "neutral" | "weak-base" | "weak-acid" | "element"

interface Chemical {
  id: string
  name: string
  fullName: string
  color: string
  type: ChemicalType
  element?: string
}

interface Reaction {
  type: ChemicalType
  color: string
}

const ChemistryLab = () => {
  const [droppedChemicals, setDroppedChemicals] = useState<Chemical[]>([])
  const [jarColor, setJarColor] = useState("#e0f2fe")
  const [jarLiquidHeight, setJarLiquidHeight] = useState(20)
  const [redLitmusColor, setRedLitmusColor] = useState("#ef4444")
  const [blueLitmusColor, setBlueLitmusColor] = useState("#3b82f6")
  const [result, setResult] = useState("")
  const [isMixing, setIsMixing] = useState(false)
  const [testingLitmus, setTestingLitmus] = useState<"red" | "blue" | null>(null)
  const [draggedItem, setDraggedItem] = useState<Chemical | null>(null)
  const [showLitmusTest, setShowLitmusTest] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const chemicals = useMemo<Chemical[]>(
    () => [
      // Acids
      { id: "hcl", name: "HCl", fullName: "Hydrochloric Acid", color: "#fef08a", type: "acid" },
      { id: "h2so4", name: "H₂SO₄", fullName: "Sulfuric Acid", color: "#fde047", type: "acid" },
      { id: "vinegar", name: "Vinegar", fullName: "Acetic Acid", color: "#fef3c7", type: "acid" },
      { id: "lemon", name: "Lemon", fullName: "Citric Acid", color: "#fef9c3", type: "acid" },

      // Bases/Alkalis
      { id: "naoh", name: "NaOH", fullName: "Sodium Hydroxide", color: "#93c5fd", type: "base" },
      { id: "koh", name: "KOH", fullName: "Potassium Hydroxide", color: "#7dd3fc", type: "base" },
      { id: "nh4oh", name: "NH₄OH", fullName: "Ammonium Hydroxide", color: "#bfdbfe", type: "base" },
      { id: "soap", name: "Soap", fullName: "Soap Water", color: "#ddd6fe", type: "base" },

      // Salts
      { id: "nacl", name: "NaCl", fullName: "Sodium Chloride", color: "#f3f4f6", type: "neutral" },
      { id: "nahco3", name: "NaHCO₃", fullName: "Baking Soda", color: "#fef3c7", type: "weak-base" },
      { id: "caco3", name: "CaCO₃", fullName: "Calcium Carbonate", color: "#fafafa", type: "weak-base" },

      // Base Elements
      { id: "oxygen", name: "O₂", fullName: "Oxygen", color: "#e0f2fe", type: "element", element: "O" },
      { id: "carbon", name: "C", fullName: "Carbon", color: "#a3a3a3", type: "element", element: "C" },
      { id: "nitrogen", name: "N₂", fullName: "Nitrogen", color: "#f0f9ff", type: "element", element: "N" },
      { id: "hydrogen", name: "H₂", fullName: "Hydrogen", color: "#fef9ff", type: "element", element: "H" },
      { id: "chlorine", name: "Cl₂", fullName: "Chlorine", color: "#dcfce7", type: "element", element: "Cl" },
      { id: "sulfur", name: "S", fullName: "Sulfur", color: "#fef08a", type: "element", element: "S" },
      { id: "sodium", name: "Na", fullName: "Sodium", color: "#fbbf24", type: "element", element: "Na" },

      // Others
      { id: "water", name: "H₂O", fullName: "Water", color: "#e0f2fe", type: "neutral" },
      { id: "sugar", name: "Sugar", fullName: "Sugar Solution", color: "#fef3c7", type: "neutral" },
      { id: "alcohol", name: "Alcohol", fullName: "Alcohol", color: "#f0f9ff", type: "neutral" },
    ],
    [],
  )

  const determineReaction = useCallback((chems: Chemical[]): Reaction => {
    if (chems.length === 0) return { type: "neutral", color: "#e0f2fe" }

    const types = chems.map((c) => c.type)
    const elements = chems.filter((c) => c.type === "element").map((c) => c.element)

    // Check for element combinations that form acids
    if (elements.includes("H") && elements.includes("Cl")) {
      return { type: "acid", color: "#fef08a" }
    }
    if (elements.includes("H") && elements.includes("S") && elements.includes("O")) {
      return { type: "acid", color: "#fde047" }
    }
    if (elements.includes("C") && elements.includes("O")) {
      return { type: "weak-acid", color: "#fde68a" }
    }
    if (elements.includes("Na") && chems.some((c) => c.id === "water")) {
      return { type: "base", color: "#93c5fd" }
    }

    const hasAcid = types.includes("acid")
    const hasBase = types.includes("base")
    const hasWeakAcid = types.includes("weak-acid")
    const hasWeakBase = types.includes("weak-base")

    if (hasAcid && hasBase) {
      return { type: "neutral", color: "#d1fae5" }
    }

    if (hasAcid && !hasBase) {
      return { type: "acid", color: "#fef08a" }
    }

    if (hasBase && !hasAcid) {
      return { type: "base", color: "#93c5fd" }
    }

    if (hasWeakAcid && !hasBase) {
      return { type: "weak-acid", color: "#fde68a" }
    }

    if (hasWeakBase && !hasAcid) {
      return { type: "weak-base", color: "#bfdbfe" }
    }

    return { type: "neutral", color: "#e0f2fe" }
  }, [])

  const handleDragStart = useCallback((e: React.DragEvent, chemical: Chemical) => {
    setDraggedItem(chemical)
    e.dataTransfer.effectAllowed = "copy"
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (draggedItem && !droppedChemicals.find((c) => c.id === draggedItem.id)) {
        const newChemicals = [...droppedChemicals, draggedItem]
        setDroppedChemicals(newChemicals)
        setIsMixing(true)

        setTimeout(() => {
          const reaction = determineReaction(newChemicals)
          setJarColor(reaction.color)
          setJarLiquidHeight(Math.min(20 + newChemicals.length * 20, 75))
          setIsMixing(false)

          const hasNonElement = newChemicals.some((c) => c.type !== "element")
          if (newChemicals.length >= 2 || (newChemicals.length === 1 && hasNonElement)) {
            setShowLitmusTest(true)
          }
        }, 600)
      }
      setDraggedItem(null)
    },
    [draggedItem, droppedChemicals, determineReaction],
  )

  const testLitmus = useCallback(
    (type: "red" | "blue") => {
      const hasNonElement = droppedChemicals.some((c) => c.type !== "element")
      if (droppedChemicals.length === 0 || (droppedChemicals.length === 1 && !hasNonElement)) return

      setTestingLitmus(type)
      const reaction = determineReaction(droppedChemicals)

      setTimeout(() => {
        if (type === "red") {
          if (reaction.type === "base" || reaction.type === "weak-base") {
            setRedLitmusColor("#3b82f6")
            setResult("This is an Alkali!")
          } else if (reaction.type === "acid" || reaction.type === "weak-acid") {
            setRedLitmusColor("#ef4444")
            setResult("This is an Acid!")
          } else {
            setRedLitmusColor("#ef4444")
            setResult("This is Neutral!")
          }
        } else {
          if (reaction.type === "acid" || reaction.type === "weak-acid") {
            setBlueLitmusColor("#ef4444")
            setResult("This is an Acid!")
          } else if (reaction.type === "base" || reaction.type === "weak-base") {
            setBlueLitmusColor("#3b82f6")
            setResult("This is an Alkali!")
          } else {
            setBlueLitmusColor("#3b82f6")
            setResult("This is Neutral!")
          }
        }

        setTestingLitmus(null)
      }, 600)
    },
    [droppedChemicals, determineReaction],
  )

  const reset = useCallback(() => {
    setDroppedChemicals([])
    setJarColor("#e0f2fe")
    setJarLiquidHeight(20)
    setRedLitmusColor("#ef4444")
    setBlueLitmusColor("#3b82f6")
    setResult("")
    setIsMixing(false)
    setTestingLitmus(null)
    setShowLitmusTest(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-yellow-600 p-4">
        <h1 className="text-3xl font-bold text-white text-center drop-shadow-lg">Virtual Litmus Paper Experiment</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE - BEAKER & LITMUS */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Beaker Section */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-4 md:p-8 border-2 border-yellow-600 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">Mixing Beaker</h2>
                <p className="text-xs md:text-sm text-blue-200">
                  Drop chemicals here ({droppedChemicals.length} added)
                </p>
              </div>

              {/* Drop Zone with Beaker */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative mx-auto w-48 md:w-64 h-64 md:h-80 mb-6"
              >
                {/* Beaker Container */}
                <div className="absolute inset-0 flex flex-col items-center justify-end">
                  {/* Beaker */}
                  <div
                    className="relative w-44 md:w-56 h-56 md:h-72 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-b-3xl overflow-hidden"
                    style={{
                      border: "4px solid rgba(255,255,255,0.3)",
                      boxShadow:
                        "inset 4px 0 15px rgba(255,255,255,0.2), inset -4px 0 15px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.7)",
                      clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
                    }}
                  >
                    {/* Measurement lines */}
                    <div className="absolute top-20 left-2 right-2 h-0.5 bg-white opacity-20" />
                    <div className="absolute top-32 left-2 right-2 h-0.5 bg-white opacity-20" />
                    <div className="absolute top-44 left-2 right-2 h-0.5 bg-white opacity-20" />

                    {/* Liquid */}
                    <div
                      className={`absolute bottom-0 w-full transition-all duration-700 ${isMixing ? "animate-pulse" : ""}`}
                      style={{
                        height: `${jarLiquidHeight}%`,
                        backgroundColor: jarColor,
                        boxShadow: "inset 0 -5px 25px rgba(0,0,0,0.5), inset 4px 0 15px rgba(255,255,255,0.15)",
                      }}
                    >
                      {isMixing && (
                        <div className="flex items-center justify-center h-full">
                          <Droplet className="w-8 md:w-12 h-8 md:h-12 text-white animate-bounce" />
                        </div>
                      )}
                    </div>

                    {/* Glass shine */}
                    <div
                      className="absolute top-0 left-3 w-3 h-full bg-gradient-to-r from-white to-transparent opacity-30"
                      style={{ filter: "blur(3px)" }}
                    />
                    <div
                      className="absolute top-0 right-3 w-3 h-full bg-gradient-to-l from-black to-transparent opacity-30"
                      style={{ filter: "blur(3px)" }}
                    />

                    {/* Drop indicator */}
                    {draggedItem && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-20 border-4 border-dashed border-blue-400 animate-pulse">
                        <p className="text-white text-sm md:text-lg font-bold drop-shadow-lg">Drop Here!</p>
                      </div>
                    )}
                  </div>

                  {/* Base */}
                  <div
                    className="w-48 md:w-60 h-2 bg-gray-600 rounded-full mt-1"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                  />
                </div>
              </div>

              {/* Chemicals List */}
              {droppedChemicals.length > 0 && (
                <div className="bg-slate-700 rounded-xl p-3 md:p-4 mb-4">
                  <p className="text-yellow-400 font-semibold mb-2 text-sm md:text-base">Mixed Chemicals:</p>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {droppedChemicals.map((chem, idx) => (
                      <div key={idx} className="text-xs md:text-sm text-white flex items-center gap-2">
                        <div
                          className="w-3 md:w-4 h-3 md:h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: chem.color }}
                        />
                        {idx + 1}. {chem.fullName}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="bg-gradient-to-r from-yellow-400 to-green-400 rounded-xl p-3 md:p-4 mb-4 shadow-lg">
                  <p className="text-center text-lg md:text-xl font-bold text-gray-900">{result}</p>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={reset}
                className="w-full py-2 md:py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg text-sm md:text-base"
              >
                <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
                Reset
              </button>
            </div>

            {/* Litmus Test */}
            {showLitmusTest && (
              <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-4 md:p-6 border-2 border-yellow-600">
                <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-4 text-center">Litmus Paper Test</h3>
                <div className="space-y-4">
                  {/* Red Litmus */}
                  <button
                    onClick={() => testLitmus("red")}
                    disabled={!!testingLitmus}
                    className="w-full p-3 md:p-4 bg-slate-700 rounded-xl hover:bg-slate-600 disabled:opacity-50 transition-all"
                  >
                    <p className="text-white font-semibold mb-2 text-sm md:text-base">Red Litmus Paper</p>
                    <div className="relative w-full h-20 md:h-24 bg-white rounded-lg overflow-hidden border-4 border-gray-300">
                      <div
                        className={`w-full h-full transition-all duration-500 ${testingLitmus === "red" ? "scale-110" : ""}`}
                        style={{ backgroundColor: redLitmusColor }}
                      />
                      {testingLitmus === "red" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Droplet className="w-6 md:w-8 h-6 md:h-8 text-white animate-bounce" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Blue Litmus */}
                  <button
                    onClick={() => testLitmus("blue")}
                    disabled={!!testingLitmus}
                    className="w-full p-3 md:p-4 bg-slate-700 rounded-xl hover:bg-slate-600 disabled:opacity-50 transition-all"
                  >
                    <p className="text-white font-semibold mb-2 text-sm md:text-base">Blue Litmus Paper</p>
                    <div className="relative w-full h-20 md:h-24 bg-white rounded-lg overflow-hidden border-4 border-gray-300">
                      <div
                        className={`w-full h-full transition-all duration-500 ${testingLitmus === "blue" ? "scale-110" : ""}`}
                        style={{ backgroundColor: blueLitmusColor }}
                      />
                      {testingLitmus === "blue" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Droplet className="w-6 md:w-8 h-6 md:h-8 text-white animate-bounce" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - SIDEBAR */}
        <div
          className={`fixed right-0 top-0 h-full transition-all duration-300 z-50 ${sidebarOpen ? "w-64 md:w-80" : "w-0"}`}
        >
          <div className="h-full bg-gradient-to-b from-slate-900 to-slate-800 border-l-2 border-yellow-600 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b-2 border-yellow-600">
              <h2 className="text-lg md:text-xl font-bold text-yellow-400">Chemicals</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                aria-label="Close sidebar"
              >
                <X className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </button>
            </div>

            {/* Tubes */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
              {chemicals.map((chem) => (
                <div
                  key={chem.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, chem)}
                  className={`cursor-move transition-all hover:scale-105 ${droppedChemicals.find((c) => c.id === chem.id) ? "opacity-30 pointer-events-none" : ""
                    }`}
                  title={chem.fullName}
                >
                  <div className="relative">
                    {/* Test Tube */}
                    <div
                      className="w-16 md:w-20 h-32 md:h-40 mx-auto bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-b-full relative overflow-hidden"
                      style={{
                        border: "3px solid rgba(255,255,255,0.25)",
                        boxShadow:
                          "inset 3px 0 10px rgba(255,255,255,0.15), inset -3px 0 10px rgba(0,0,0,0.3), 0 6px 15px rgba(0,0,0,0.6)",
                      }}
                    >
                      {/* Liquid */}
                      <div className="absolute bottom-0 w-full">
                        <div
                          className="w-full rounded-b-full transition-all"
                          style={{
                            height: "90px",
                            backgroundColor: chem.color,
                            boxShadow: "inset 0 -4px 20px rgba(0,0,0,0.4), inset 3px 0 8px rgba(255,255,255,0.2)",
                          }}
                        />
                      </div>
                      {/* Shine */}
                      <div
                        className="absolute top-0 left-1 w-2 h-full bg-gradient-to-r from-white to-transparent opacity-30"
                        style={{ filter: "blur(2px)" }}
                      />
                      <div
                        className="absolute top-0 right-1 w-2 h-full bg-gradient-to-l from-black to-transparent opacity-20"
                        style={{ filter: "blur(2px)" }}
                      />
                    </div>
                    {/* Label */}
                    <p className="text-center text-xs font-bold text-white mt-2">{chem.name}</p>
                    <p className="text-center text-xs text-gray-300 truncate px-1">{chem.fullName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed right-0 top-20 z-40 p-2 md:p-3 bg-yellow-600 hover:bg-yellow-700 rounded-l-lg transition-all"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 md:w-6 h-5 md:h-6 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ChemistryLab

