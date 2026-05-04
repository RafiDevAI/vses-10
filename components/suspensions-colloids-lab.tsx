"use client"

import { useState, useCallback } from "react"
import { Lightbulb, RotateCcw, Beaker, Eye, Sparkles } from "lucide-react"

type MixtureType = "solution" | "suspension" | "colloid"

interface Mixture {
  id: string
  name: string
  type: MixtureType
  particleSize: string
  examples: string
  color: string
  particleColor: string
  tyndallEffect: boolean
  settles: boolean
  description: string
}

const SuspensionsColloidsLab = () => {
  const [selectedMixture, setSelectedMixture] = useState<Mixture | null>(null)
  const [showLight, setShowLight] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const mixtures: Mixture[] = [
    {
      id: "saltwater",
      name: "Salt Water",
      type: "solution",
      particleSize: "< 1 nm",
      examples: "Sugar water, vinegar, air",
      color: "#e0f2fe",
      particleColor: "#3b82f6",
      tyndallEffect: false,
      settles: false,
      description: "Particles are so small they dissolve completely. The mixture is clear and homogeneous.",
    },
    {
      id: "milk",
      name: "Milk",
      type: "colloid",
      particleSize: "1-1000 nm",
      examples: "Fog, whipped cream, jelly",
      color: "#fef3c7",
      particleColor: "#f59e0b",
      tyndallEffect: true,
      settles: false,
      description: "Medium-sized particles remain suspended. Shows the Tyndall effect when light passes through.",
    },
    {
      id: "mudwater",
      name: "Muddy Water",
      type: "suspension",
      particleSize: "> 1000 nm",
      examples: "Sand in water, chalk in water",
      color: "#d4a574",
      particleColor: "#78350f",
      tyndallEffect: true,
      settles: true,
      description: "Large particles that eventually settle at the bottom. Appears cloudy and heterogeneous.",
    },
    {
      id: "gelatin",
      name: "Gelatin",
      type: "colloid",
      particleSize: "1-1000 nm",
      examples: "Butter, mayonnaise, paint",
      color: "#fecaca",
      particleColor: "#dc2626",
      tyndallEffect: true,
      settles: false,
      description: "A gel colloid where particles form a semi-solid network. Shows Tyndall effect.",
    },
    {
      id: "sugarwater",
      name: "Sugar Water",
      type: "solution",
      particleSize: "< 1 nm",
      examples: "Salt water, alcohol in water",
      color: "#f0f9ff",
      particleColor: "#0ea5e9",
      tyndallEffect: false,
      settles: false,
      description: "Sugar molecules dissolve completely, creating a clear, homogeneous solution.",
    },
    {
      id: "smoke",
      name: "Smoke",
      type: "colloid",
      particleSize: "1-1000 nm",
      examples: "Fog, aerosol spray, clouds",
      color: "#e5e7eb",
      particleColor: "#6b7280",
      tyndallEffect: true,
      settles: false,
      description: "Solid particles suspended in gas. Demonstrates strong Tyndall effect.",
    },
  ]

  const selectMixture = useCallback((mixture: Mixture) => {
    setSelectedMixture(mixture)
    setShowLight(false)
    setShowInfo(false)
  }, [])

  const toggleLight = useCallback(() => {
    setShowLight((prev) => !prev)
  }, [])

  const reset = useCallback(() => {
    setSelectedMixture(null)
    setShowLight(false)
    setShowInfo(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-yellow-600 rounded-2xl p-6 mb-6 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
            Suspensions vs Colloids vs Solutions
          </h1>
          <p className="text-center text-blue-200 text-sm md:text-base">
            Explore particle behavior and the Tyndall effect in different mixtures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - Mixture Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-yellow-600 rounded-2xl p-4 shadow-2xl">
              <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <Beaker className="w-6 h-6" />
                Select Mixture
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {mixtures.map((mixture) => (
                  <button
                    key={mixture.id}
                    onClick={() => selectMixture(mixture)}
                    className={`w-full p-4 rounded-xl transition-all text-left ${
                      selectedMixture?.id === mixture.id
                        ? "bg-yellow-600 shadow-lg scale-105"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        style={{ backgroundColor: mixture.color, border: "2px solid rgba(255,255,255,0.3)" }}
                      />
                      <div>
                        <p className="font-bold text-white text-sm md:text-base">{mixture.name}</p>
                        <p className="text-xs text-gray-300 capitalize">{mixture.type}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Particle size: {mixture.particleSize}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER - Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-yellow-600 rounded-2xl p-6 shadow-2xl mb-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">
                {selectedMixture ? selectedMixture.name : "Select a mixture to begin"}
              </h2>

              {selectedMixture ? (
                <div className="space-y-6">
                  {/* Beaker Visualization */}
                  <div className="relative mx-auto w-64 md:w-80 h-80 md:h-96">
                    {/* Light Beam */}
                    {showLight && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                        <div
                          className={`w-64 md:w-80 h-16 ${
                            selectedMixture.tyndallEffect
                              ? "bg-gradient-to-r from-yellow-300 via-yellow-200 to-transparent opacity-70"
                              : "bg-gradient-to-r from-yellow-300 to-transparent opacity-30"
                          } transition-all duration-500`}
                          style={{
                            filter: selectedMixture.tyndallEffect ? "blur(8px)" : "blur(2px)",
                          }}
                        />
                        <Lightbulb className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-yellow-400 animate-pulse" />
                      </div>
                    )}

                    {/* Beaker */}
                    <div className="absolute inset-0 flex items-end justify-center">
                      <div
                        className="relative w-56 md:w-72 h-72 md:h-88 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-b-3xl overflow-hidden"
                        style={{
                          border: "4px solid rgba(255,255,255,0.3)",
                          boxShadow:
                            "inset 4px 0 15px rgba(255,255,255,0.2), inset -4px 0 15px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.7)",
                          clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                        }}
                      >
                        {/* Liquid with Particles */}
                        <div
                          className="absolute bottom-0 w-full h-[85%] transition-all duration-700"
                          style={{
                            backgroundColor: selectedMixture.color,
                            boxShadow: "inset 0 -5px 25px rgba(0,0,0,0.5)",
                          }}
                        >
                          {/* Particles */}
                          {selectedMixture.type === "solution" ? (
                            // Very small particles (barely visible)
                            <div className="relative w-full h-full">
                              {[...Array(20)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-1 h-1 rounded-full opacity-40"
                                  style={{
                                    backgroundColor: selectedMixture.particleColor,
                                    left: `${Math.random() * 90 + 5}%`,
                                    top: `${Math.random() * 90 + 5}%`,
                                  }}
                                />
                              ))}
                            </div>
                          ) : selectedMixture.type === "colloid" ? (
                            // Medium particles
                            <div className="relative w-full h-full">
                              {[...Array(15)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-2 md:w-3 h-2 md:h-3 rounded-full animate-float"
                                  style={{
                                    backgroundColor: selectedMixture.particleColor,
                                    left: `${Math.random() * 85 + 5}%`,
                                    top: `${Math.random() * 85 + 5}%`,
                                    animationDelay: `${i * 0.2}s`,
                                    opacity: 0.7,
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            // Large particles (settling)
                            <div className="relative w-full h-full">
                              {[...Array(12)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-3 md:w-4 h-3 md:h-4 rounded-full"
                                  style={{
                                    backgroundColor: selectedMixture.particleColor,
                                    left: `${Math.random() * 80 + 10}%`,
                                    top: selectedMixture.settles
                                      ? `${70 + Math.random() * 20}%`
                                      : `${Math.random() * 80}%`,
                                    opacity: 0.8,
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Glass shine */}
                        <div
                          className="absolute top-0 left-4 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-30"
                          style={{ filter: "blur(4px)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={toggleLight}
                      className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        showLight
                          ? "bg-yellow-500 text-gray-900 shadow-lg"
                          : "bg-slate-700 text-white hover:bg-slate-600"
                      }`}
                    >
                      <Lightbulb className="w-5 h-5" />
                      {showLight ? "Light On" : "Test Tyndall Effect"}
                    </button>
                    <button
                      onClick={() => setShowInfo(!showInfo)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      {showInfo ? "Hide" : "Show"} Info
                    </button>
                    <button
                      onClick={reset}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </button>
                  </div>

                  {/* Tyndall Effect Result */}
                  {showLight && (
                    <div
                      className={`p-4 rounded-xl border-2 ${
                        selectedMixture.tyndallEffect
                          ? "bg-green-900/30 border-green-500"
                          : "bg-blue-900/30 border-blue-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <p className="font-bold text-white">Tyndall Effect Test:</p>
                      </div>
                      <p className="text-sm text-gray-200">
                        {selectedMixture.tyndallEffect
                          ? "✓ Light beam is visible! Particles scatter the light (Tyndall effect present)"
                          : "✗ Light beam passes through clearly. Particles are too small to scatter light"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-400">
                  <p className="text-lg">Select a mixture from the left to begin exploring</p>
                </div>
              )}
            </div>

            {/* Information Panel */}
            {selectedMixture && showInfo && (
              <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-green-500 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-green-400 mb-4 capitalize">{selectedMixture.type} Properties</h3>
                <div className="space-y-3 text-sm md:text-base">
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Description:</p>
                    <p className="text-white">{selectedMixture.description}</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Particle Size:</p>
                    <p className="text-white font-semibold">{selectedMixture.particleSize}</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Tyndall Effect:</p>
                    <p className="text-white font-semibold">{selectedMixture.tyndallEffect ? "Yes ✓" : "No ✗"}</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Settles Over Time:</p>
                    <p className="text-white font-semibold">{selectedMixture.settles ? "Yes" : "No"}</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Other Examples:</p>
                    <p className="text-white">{selectedMixture.examples}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default SuspensionsColloidsLab
