"use client"

import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"
const SolarSystemEducational = dynamic(() => import("@/components/solar-system-educational"), { ssr: false })
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Globe,
  Maximize,
  Minimize,
  Sparkles,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SolarSystemPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const backToExperimentsFullscreen = () => {
    router.push("/experiments")
    setTimeout(() => {
      document.documentElement.requestFullscreen()
    }, 100)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-purple-950/20 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      {!isFullscreen && (
        <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/experiments">
                  <Button variant="ghost" size="sm" className="gap-2 text-white/90 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </Link>
                <Button
                  onClick={backToExperimentsFullscreen}
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30"
                  title="Return to experiments overview in fullscreen mode"
                >
                  <Maximize className="w-4 h-4" />
                  <span className="hidden lg:inline">Back to Experiments, full screen</span>
                  <span className="hidden md:inline lg:hidden">Experiments ⛶</span>
                </Button>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                    <Globe className="w-6 h-6 text-white relative z-10" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                      Interactive Solar System
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </h1>
                    <p className="text-sm text-white/60">Click any planet to explore — drag to rotate — scroll to zoom</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="hidden sm:flex bg-purple-500/20 text-purple-300 border-purple-500/30"
                >
                  Astronomy
                </Badge>
                <Badge variant="outline" className="hidden sm:flex bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  3D Simulation
                </Badge>
                <Button
                  onClick={toggleFullscreen}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Maximize className="w-4 h-4" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {isFullscreen && (
        <Button
          onClick={backToExperimentsFullscreen}
          variant="outline"
          size="sm"
          className="fixed top-6 left-6 z-50 bg-black/80 backdrop-blur-sm border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.4)] gap-2"
          title="Return to experiments overview in fullscreen mode"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Experiments, full screen</span>
          <span className="sm:hidden">Experiments ⛶</span>
        </Button>
      )}

      {!isFullscreen ? (
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* 3D Model — spans 3 cols */}
            <div className="lg:col-span-3">
              <div
                className="h-[600px] rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)] relative"
                style={{ background: '#000' }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none z-10" />
                <div className="w-full h-full" style={{ background: '#000' }}>
                  <SolarSystemEducational onPlanetSelect={setSelectedPlanet} />
                </div>
              </div>
            </div>

            {/* Right sidebar — planet info card only */}
            <div className="space-y-4">
              {/* Hint when no planet selected */}
              {!selectedPlanet && (
                <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 text-center">
                  <Globe className="w-10 h-10 text-cyan-400/60 mx-auto mb-3" />
                  <p className="text-white/70 text-sm font-medium">Click any planet</p>
                  <p className="text-white/40 text-xs mt-1">to view its details here</p>
                </div>
              )}

              {/* Planet Info Card */}
              {selectedPlanet && (
                <Card className="border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.3)] bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-purple-900/40 backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                          style={{
                            background: `linear-gradient(135deg, ${selectedPlanet.color}, ${selectedPlanet.color}dd)`,
                          }}
                        >
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{selectedPlanet.name}</CardTitle>
                          <p className="text-xs text-white/60 mt-0.5">Planet Information</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedPlanet(null)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <h3 className="text-xs font-semibold text-cyan-300 mb-1">Temperature</h3>
                      <p className="text-sm text-white/90">{selectedPlanet.temperature}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <h3 className="text-xs font-semibold text-purple-300 mb-1">Composition</h3>
                      <p className="text-sm text-white/90">{selectedPlanet.composition}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                      <h3 className="text-xs font-semibold text-pink-300 mb-1.5">Interesting Facts</h3>
                      <ul className="space-y-1.5">
                        {selectedPlanet.facts.map((fact: string, i: number) => (
                          <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                            <span className="text-pink-400 mt-0.5">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="h-screen w-screen bg-black">
          <SolarSystemEducational />
        </div>
      )}

      {isFullscreen && (
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="fixed bottom-6 right-6 z-50 bg-black/80 backdrop-blur-sm border-purple-500/30 text-white hover:bg-black/90 shadow-[0_0_30px_rgba(139,92,246,0.4)] gap-2"
        >
          <Minimize className="w-4 h-4" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}
