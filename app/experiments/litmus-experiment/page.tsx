"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Beaker, Maximize, Minimize } from "lucide-react"
import Link from "next/link"
import ChemistryLab from "@/components/chemistry-lab"

export default function LitmusExperimentPage() {
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
              <div className="flex items-center gap-4">
                <Link href="/experiments">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Experiments
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Beaker className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">2D Chemistry Litmus Test</h1>
                    <p className="text-sm text-muted-foreground">Interactive pH Testing Simulation</p>
                  </div>
                </div>
              </div>
              <Button onClick={toggleFullscreen} variant="outline" size="sm">
                <Maximize className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </div>
        </header>
      )}

      {!isFullscreen ? (
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="rounded-lg overflow-hidden border border-border">
                <ChemistryLab />
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Students will:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Understand pH scale and indicators</li>
                      <li>• Identify acids and bases</li>
                      <li>• Test various substances with litmus paper</li>
                      <li>• Interpret color changes in pH tests</li>
                      <li>• Learn about chemical reactions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2 text-muted-foreground">
                    <p>1. Drag chemicals from the sidebar into the beaker</p>
                    <p>2. Watch the mixture change color</p>
                    <p>3. Test with red or blue litmus paper</p>
                    <p>4. Observe the color change to identify acid/base</p>
                    <p>5. Click Reset to start a new experiment</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Standards Alignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div>
                      <Badge variant="outline" className="text-xs mb-1">
                        NGSS MS-PS1-2
                      </Badge>
                      <p className="text-muted-foreground">Chemical reactions and properties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="h-screen w-screen">
          <ChemistryLab />
        </div>
      )}

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
