"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Maximize, Minimize } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ChemicalReactionLab from "@/components/chemical-reaction-lab"


export default function ChemicalReactionsPage() {
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

  return (
    <div className="min-h-screen bg-background">
      {!isFullscreen && (
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/experiments">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Experiments
                </Button>
              </Link>
              <div className="flex items-center gap-2">

                <Button onClick={toggleFullscreen} variant="outline" size="sm">
                  <Maximize className="w-4 h-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <div ref={containerRef} className={isFullscreen ? "h-screen" : ""}>
        <ChemicalReactionLab />
      </div>

      {isFullscreen && (
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <Minimize className="w-4 h-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}
