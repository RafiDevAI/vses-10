"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { RotateCcw, Droplet, Beaker } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

type ChemicalType = "acid" | "base" | "neutral" | "element" | "compound"

interface Chemical {
  id: string
  name: string
  fullName: string
  color: string
  type: ChemicalType
  element?: string
}

interface ReactionResult {
  product: string
  productName: string
  equation: string
  color: string
  description: string
}

const ChemicalReactionLab = () => {
  const { t, language } = useLanguage()
  const [droppedChemicals, setDroppedChemicals] = useState<Chemical[]>([])
  const [jarColor, setJarColor] = useState("#e0f2fe")
  const [jarLiquidHeight, setJarLiquidHeight] = useState(20)
  const [reactionResult, setReactionResult] = useState<ReactionResult | null>(null)
  const [isMixing, setIsMixing] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Chemical | null>(null)

  const chemicals = useMemo<Chemical[]>(
    () => [
      // Elements
      { id: "hydrogen", name: "H₂", fullName: "Hydrogen Gas", color: "#fef9ff", type: "element", element: "H" },
      { id: "oxygen", name: "O₂", fullName: "Oxygen Gas", color: "#e0f2fe", type: "element", element: "O" },
      { id: "nitrogen", name: "N₂", fullName: "Nitrogen Gas", color: "#f0f9ff", type: "element", element: "N" },
      { id: "carbon", name: "C", fullName: "Carbon", color: "#a3a3a3", type: "element", element: "C" },
      { id: "chlorine", name: "Cl₂", fullName: "Chlorine Gas", color: "#dcfce7", type: "element", element: "Cl" },
      { id: "sulfur", name: "S", fullName: "Sulfur", color: "#fef08a", type: "element", element: "S" },
      { id: "sodium", name: "Na", fullName: "Sodium Metal", color: "#fbbf24", type: "element", element: "Na" },
      { id: "calcium", name: "Ca", fullName: "Calcium", color: "#f3f4f6", type: "element", element: "Ca" },
      { id: "iron", name: "Fe", fullName: "Iron", color: "#78716c", type: "element", element: "Fe" },
      { id: "copper", name: "Cu", fullName: "Copper", color: "#ea580c", type: "element", element: "Cu" },

      // Common Compounds
      { id: "water", name: "H₂O", fullName: "Water", color: "#e0f2fe", type: "compound" },
      { id: "hcl", name: "HCl", fullName: "Hydrochloric Acid", color: "#fef08a", type: "acid" },
      { id: "h2so4", name: "H₂SO₄", fullName: "Sulfuric Acid", color: "#fde047", type: "acid" },
      { id: "naoh", name: "NaOH", fullName: "Sodium Hydroxide", color: "#93c5fd", type: "base" },
      { id: "nacl", name: "NaCl", fullName: "Sodium Chloride (Salt)", color: "#f3f4f6", type: "neutral" },
      { id: "caco3", name: "CaCO₃", fullName: "Calcium Carbonate", color: "#fafafa", type: "neutral" },
      { id: "co2", name: "CO₂", fullName: "Carbon Dioxide", color: "#f0f9ff", type: "compound" },
      { id: "nh3", name: "NH₃", fullName: "Ammonia", color: "#bfdbfe", type: "base" },
      { id: "ch4", name: "CH₄", fullName: "Methane", color: "#fef3c7", type: "compound" },
      { id: "feo", name: "FeO", fullName: "Iron Oxide (Rust)", color: "#dc2626", type: "compound" },
    ],
    [t],
  )

  const determineReaction = useCallback((chems: Chemical[]): ReactionResult | null => {
    if (chems.length === 0) return null

    const chemIds = chems.map((c) => c.id).sort()

    // H₂ + O₂ → H₂O (Water)
    if (chemIds.includes("hydrogen") && chemIds.includes("oxygen") && chems.length === 2) {
      return {
        product: "H₂O",
        productName: "Water",
        equation: "2H₂ + O₂ → 2H₂O",
        color: "#e0f2fe",
        description: "Hydrogen and oxygen combine to form water!",
      }
    }

    // H₂ + Cl₂ → HCl (Hydrochloric Acid)
    if (chemIds.includes("hydrogen") && chemIds.includes("chlorine") && chems.length === 2) {
      return {
        product: "HCl",
        productName: "Hydrochloric Acid",
        equation: "H₂ + Cl₂ → 2HCl",
        color: "#fef08a",
        description: "Hydrogen and chlorine form hydrochloric acid!",
      }
    }

    // Na + H₂O → NaOH + H₂ (Sodium Hydroxide)
    if (chemIds.includes("sodium") && chemIds.includes("water") && chems.length === 2) {
      return {
        product: "NaOH + H₂",
        productName: "Sodium Hydroxide + Hydrogen Gas",
        equation: "2Na + 2H₂O → 2NaOH + H₂↑",
        color: "#93c5fd",
        description: "Sodium reacts vigorously with water to form sodium hydroxide and hydrogen gas!",
      }
    }

    // Na + Cl₂ → NaCl (Salt)
    if (chemIds.includes("sodium") && chemIds.includes("chlorine") && chems.length === 2) {
      return {
        product: "NaCl",
        productName: "Sodium Chloride (Table Salt)",
        equation: "2Na + Cl₂ → 2NaCl",
        color: "#f3f4f6",
        description: "Sodium and chlorine combine to form table salt!",
      }
    }

    // HCl + NaOH → NaCl + H₂O (Neutralization)
    if (chemIds.includes("hcl") && chemIds.includes("naoh") && chems.length === 2) {
      return {
        product: "NaCl + H₂O",
        productName: "Salt + Water",
        equation: "HCl + NaOH → NaCl + H₂O",
        color: "#d1fae5",
        description: "Acid and base neutralize to form salt and water!",
      }
    }

    // C + O₂ → CO₂ (Carbon Dioxide)
    if (chemIds.includes("carbon") && chemIds.includes("oxygen") && chems.length === 2) {
      return {
        product: "CO₂",
        productName: "Carbon Dioxide",
        equation: "C + O₂ → CO₂",
        color: "#f0f9ff",
        description: "Carbon burns in oxygen to form carbon dioxide!",
      }
    }

    // N₂ + H₂ → NH₃ (Ammonia - Haber Process)
    if (chemIds.includes("nitrogen") && chemIds.includes("hydrogen") && chems.length === 2) {
      return {
        product: "NH₃",
        productName: "Ammonia",
        equation: "N₂ + 3H₂ → 2NH₃",
        color: "#bfdbfe",
        description: "Nitrogen and hydrogen combine to form ammonia (Haber Process)!",
      }
    }

    // Fe + O₂ → FeO (Rust)
    if (chemIds.includes("iron") && chemIds.includes("oxygen") && chems.length === 2) {
      return {
        product: "FeO",
        productName: "Iron Oxide (Rust)",
        equation: "2Fe + O₂ → 2FeO",
        color: "#dc2626",
        description: "Iron oxidizes to form rust!",
      }
    }

    // S + O₂ → SO₂ (Sulfur Dioxide)
    if (chemIds.includes("sulfur") && chemIds.includes("oxygen") && chems.length === 2) {
      return {
        product: "SO₂",
        productName: "Sulfur Dioxide",
        equation: "S + O₂ → SO₂",
        color: "#fde68a",
        description: "Sulfur burns in oxygen to form sulfur dioxide!",
      }
    }

    // Ca + O₂ → CaO (Calcium Oxide)
    if (chemIds.includes("calcium") && chemIds.includes("oxygen") && chems.length === 2) {
      return {
        product: "CaO",
        productName: "Calcium Oxide (Quicklime)",
        equation: "2Ca + O₂ → 2CaO",
        color: "#fafafa",
        description: "Calcium reacts with oxygen to form calcium oxide!",
      }
    }

    // CaCO₃ + HCl → CaCl₂ + H₂O + CO₂
    if (chemIds.includes("caco3") && chemIds.includes("hcl") && chems.length === 2) {
      return {
        product: "CaCl₂ + H₂O + CO₂",
        productName: "Calcium Chloride + Water + Carbon Dioxide",
        equation: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑",
        color: "#f0f9ff",
        description: "Calcium carbonate reacts with acid to produce carbon dioxide bubbles!",
      }
    }

    // C + H₂ → CH₄ (Methane)
    if (chemIds.includes("carbon") && chemIds.includes("hydrogen") && chems.length === 2) {
      return {
        product: "CH₄",
        productName: "Methane",
        equation: "C + 2H₂ → CH₄",
        color: "#fef3c7",
        description: "Carbon and hydrogen combine to form methane gas!",
      }
    }

    // Default: No specific reaction
    return {
      product: "Mixture",
      productName: "Chemical Mixture",
      equation: chems.map((c) => c.name).join(" + ") + " → " + "Mixture",
      color: "#e5e7eb",
      description: "These chemicals form a mixture but don't react to form a new compound.",
    }
  }, [t])

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
        setReactionResult(null)

        setTimeout(() => {
          const reaction = determineReaction(newChemicals)
          if (reaction) {
            setJarColor(reaction.color)
            setReactionResult(reaction)
          }
          setJarLiquidHeight(Math.min(20 + newChemicals.length * 20, 75))
          setIsMixing(false)
        }, 800)
      }
      setDraggedItem(null)
    },
    [draggedItem, droppedChemicals, determineReaction],
  )

  const reset = useCallback(() => {
    setDroppedChemicals([])
    setJarColor("#e0f2fe")
    setJarLiquidHeight(20)
    setReactionResult(null)
    setIsMixing(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-2 border-yellow-600 p-4">
        <h1 className="text-3xl font-bold text-white text-center drop-shadow-lg">Virtual Chemical Reactions Lab</h1>
        <p className="text-center text-sm text-blue-200 mt-2">
          Mix chemicals to discover reactions and create new compounds!
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE - BEAKER & RESULTS */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
          <div className="w-full max-w-lg mx-auto">
            {/* Beaker Section */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-4 md:p-8 border-2 border-yellow-600 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">Reaction Beaker</h2>
                <p className="text-xs md:text-sm text-blue-200">
                  {"Drop chemicals here to see reactions ({count} added)".replace("{count}", droppedChemicals.length.toString())}
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
                        {idx + 1}. {chem.fullName} ({chem.name})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={reset}
                className="w-full py-2 md:py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg text-sm md:text-base"
              >
                <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
                Reset Experiment
              </button>
            </div>

            {reactionResult && (
              <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-4 md:p-6 border-2 border-green-500 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <Beaker className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
                  <h3 className="text-lg md:text-xl font-bold text-green-400">Reaction Result</h3>
                </div>

                {/* Product */}
                <div className="bg-slate-700 rounded-xl p-4 md:p-6 mb-4">
                  <div className="text-center mb-3">
                    <div
                      className="inline-block px-6 py-3 rounded-lg text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                      style={{ backgroundColor: reactionResult.color }}
                    >
                      {reactionResult.product}
                    </div>
                    <p className="text-lg md:text-xl text-white font-semibold">{reactionResult.productName}</p>
                  </div>

                  {/* Chemical Equation */}
                  <div className="bg-slate-800 rounded-lg p-3 md:p-4 mb-3">
                    <p className="text-xs md:text-sm text-gray-400 mb-1">Chemical Equation:</p>
                    <p className="text-base md:text-lg text-yellow-300 font-mono font-bold text-center">
                      {reactionResult.equation}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="bg-blue-900/30 rounded-lg p-3 md:p-4 border border-blue-500/30">
                    <p className="text-sm md:text-base text-blue-100">{reactionResult.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-56 md:w-72 flex-shrink-0 bg-gradient-to-b from-slate-900 to-slate-800 border-l-2 border-yellow-600 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b-2 border-yellow-600">
            <h2 className="text-lg md:text-xl font-bold text-yellow-400">Chemicals</h2>
          </div>

          {/* Tubes grid */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            <div className="grid grid-cols-2 gap-3">
              {chemicals.map((chem) => (
                <div
                  key={chem.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, chem)}
                  className={`cursor-move transition-all hover:scale-105 ${
                    droppedChemicals.find((c) => c.id === chem.id) ? "opacity-30 pointer-events-none" : ""
                  }`}
                  title={chem.fullName}
                >
                  <div className="relative">
                    {/* Test Tube */}
                    <div
                      className="w-10 h-24 mx-auto bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-b-full relative overflow-hidden"
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
                            height: "60px",
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
                    </div>
                    {/* Label */}
                    <p className="text-center text-xs font-bold text-white mt-1 leading-tight">{chem.name}</p>
                    <p className="text-center text-[10px] text-gray-400 truncate px-1">{chem.fullName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChemicalReactionLab
