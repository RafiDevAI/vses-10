"use client"

import React, { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Zap,
  CheckCircle,
  Circle,
  Info,
  Eye,
  Carrot as Mirror,
  Sun,
  Lightbulb,
  BookOpen,
  Calculator,
  Maximize,
  Minimize,
} from "lucide-react"
import Link from "next/link"

export default function LightReflectionPage() {
  const { t } = useLanguage()
  const [currentSegment, setCurrentSegment] = useState("law")
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [incidentAngle, setIncidentAngle] = useState([30])
  const [mirrorType, setMirrorType] = useState("plane")
  const [lightSource, setLightSource] = useState("laser")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const segments = [
    {
      id: "law",
      title: "Laws of Reflection",
      description: "Fundamental principles governing specular reflection",
      completed: false,
    },
    {
      id: "mirrors",
      title: "Mirror Optics",
      description: "Spherical and planar mirror systems analysis",
      completed: false,
    },
    {
      id: "applications",
      title: "Optical Applications",
      description: "Engineering applications in optical systems",
      completed: false,
    },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationTime = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const mirrorLength = 200

      // Draw coordinate system
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(50, centerY)
      ctx.lineTo(canvas.width - 50, centerY)
      ctx.moveTo(centerX, 50)
      ctx.lineTo(centerX, canvas.height - 50)
      ctx.stroke()

      // Draw mirror surface with enhanced precision
      ctx.beginPath()
      if (mirrorType === "plane") {
        ctx.moveTo(centerX - mirrorLength / 2, centerY)
        ctx.lineTo(centerX + mirrorLength / 2, centerY)
      } else if (mirrorType === "concave") {
        ctx.arc(centerX, centerY + 100, 100, Math.PI, 0, true)
      } else if (mirrorType === "convex") {
        ctx.arc(centerX, centerY - 100, 100, 0, Math.PI, false)
      }
      ctx.strokeStyle = "#1f2937"
      ctx.lineWidth = 6
      ctx.stroke()

      // Draw normal line with proper labeling
      ctx.beginPath()
      ctx.setLineDash([8, 4])
      ctx.moveTo(centerX, centerY - 120)
      ctx.lineTo(centerX, centerY + 120)
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.setLineDash([])

      // Calculate precise ray positions
      const angleRad = (incidentAngle[0] * Math.PI) / 180
      const rayLength = 140

      // Incident ray with enhanced visualization
      const incidentStartX = centerX - Math.sin(angleRad) * rayLength
      const incidentStartY = centerY - Math.cos(angleRad) * rayLength

      ctx.beginPath()
      ctx.moveTo(incidentStartX, incidentStartY)
      ctx.lineTo(centerX, centerY)
      ctx.strokeStyle = "#dc2626"
      ctx.lineWidth = 4
      ctx.stroke()

      // Reflected ray
      const reflectedEndX = centerX + Math.sin(angleRad) * rayLength
      const reflectedEndY = centerY - Math.cos(angleRad) * rayLength

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(reflectedEndX, reflectedEndY)
      ctx.strokeStyle = "#059669"
      ctx.lineWidth = 4
      ctx.stroke()

      // Enhanced angle measurements and labels
      if (currentSegment === "law") {
        // Incident angle arc
        ctx.beginPath()
        ctx.arc(centerX, centerY, 50, -Math.PI / 2, -Math.PI / 2 + angleRad, false)
        ctx.strokeStyle = "#dc2626"
        ctx.lineWidth = 3
        ctx.stroke()

        // Reflected angle arc
        ctx.beginPath()
        ctx.arc(centerX, centerY, 50, -Math.PI / 2, -Math.PI / 2 - angleRad, true)
        ctx.strokeStyle = "#059669"
        ctx.lineWidth = 3
        ctx.stroke()

        // Professional angle labels
        ctx.fillStyle = "#1f2937"
        ctx.font = "16px 'Inter', sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`θᵢ = ${incidentAngle[0]}°`, centerX - 80, centerY - 60)
        ctx.fillText(`θᵣ = ${incidentAngle[0]}°`, centerX + 80, centerY - 60)

        // Normal label
        ctx.fillText("N", centerX + 10, centerY - 100)
      }

      // Enhanced light particle animation
      if (isAnimating) {
        const particleCount = 8
        for (let i = 0; i < particleCount; i++) {
          const t = (animationTime + i * 0.15) % 2
          let particleX, particleY

          if (t < 1) {
            particleX = incidentStartX + (centerX - incidentStartX) * t
            particleY = incidentStartY + (centerY - incidentStartY) * t
          } else {
            const reflectedT = t - 1
            particleX = centerX + (reflectedEndX - centerX) * reflectedT
            particleY = centerY + (reflectedEndY - centerY) * reflectedT
          }

          // Enhanced particle with glow effect
          ctx.beginPath()
          ctx.arc(particleX, particleY, 6, 0, 2 * Math.PI)
          ctx.fillStyle = "#fbbf24"
          ctx.fill()

          ctx.beginPath()
          ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI)
          ctx.fillStyle = "#ffffff"
          ctx.fill()
        }

        animationTime += 0.015
        setProgress((prev) => Math.min(prev + 0.08, 100))
      }

      // Enhanced light source visualization
      ctx.beginPath()
      ctx.arc(incidentStartX, incidentStartY, 12, 0, 2 * Math.PI)
      ctx.fillStyle = lightSource === "laser" ? "#dc2626" : "#fbbf24"
      ctx.fill()
      ctx.strokeStyle = "#1f2937"
      ctx.lineWidth = 2
      ctx.stroke()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [currentSegment, isAnimating, incidentAngle, mirrorType, lightSource])

  const handleAnimation = () => {
    setIsAnimating(!isAnimating)
    if (!isAnimating) {
      setProgress(0)
    }
  }

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
    <div ref={containerRef} className="min-h-screen bg-background">
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
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Geometric Optics: Reflection</h1>
                  <p className="text-xs text-muted-foreground">Ray optics and mirror systems</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Physics</Badge>
              <Badge variant="outline">Optics</Badge>
              <Badge variant="outline">Advanced</Badge>
              <Button onClick={toggleFullscreen} variant="outline" size="sm">
                {isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
                {isFullscreen ? "Close" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Simulation Area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={currentSegment} onValueChange={setCurrentSegment}>
              <TabsList className="grid w-full grid-cols-3">
                {segments.map((segment) => (
                  <TabsTrigger key={segment.id} value={segment.id}>
                    {segment.completed ? <CheckCircle className="w-4 h-4 mr-1" /> : <Circle className="w-4 h-4 mr-1" />}
                    {segment.title.split(" ")[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="law" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Laws of Reflection
                    </CardTitle>
                    <CardDescription>Fundamental principles governing specular reflection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Learning Objectives:</h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Understand the two fundamental laws of reflection</li>
                        <li>• Apply geometric principles to ray tracing</li>
                        <li>• Analyze the relationship between incident and reflected rays</li>
                        <li>• Calculate reflection angles using vector analysis</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 p-6 rounded-lg mb-6">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="w-full h-auto max-w-full border rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Incident Angle (θᵢ): {incidentAngle[0]}°
                        </label>
                        <Slider
                          value={incidentAngle}
                          onValueChange={setIncidentAngle}
                          max={85}
                          min={5}
                          step={1}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Where angles are measured from the normal vector</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Radiation Source</label>
                        <Select value={lightSource} onValueChange={setLightSource}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="laser">
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-red-500" />
                                Coherent Laser (λ = 632.8 nm)
                              </div>
                            </SelectItem>
                            <SelectItem value="bulb">
                              <div className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-500" />
                                Incandescent Source
                              </div>
                            </SelectItem>
                            <SelectItem value="sun">
                              <div className="flex items-center gap-2">
                                <Sun className="w-4 h-4 text-orange-500" />
                                Solar Radiation
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Button onClick={handleAnimation}>
                          {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {isAnimating ? "Pause" : "Play"} Start Ray Tracing
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAnimating(false)
                            setProgress(0)
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset Simulation
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("refl.progress", { n: Math.round(progress) })}
                      </div>
                    </div>

                    <Progress value={progress} className="mb-6" />

                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Laws of Reflection
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">First Law:</h5>
                          <p className="text-sm text-muted-foreground mb-3">The incident ray, reflected ray, and normal to the surface all lie in the same plane (plane of incidence).</p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Second Law:</h5>
                          <p className="text-sm text-muted-foreground mb-3">The angle of incidence equals the angle of reflection: θᵢ = θᵣ</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-background rounded border">
                        <h5 className="font-medium mb-2">Mathematical Expression:</h5>
                        <p className="text-sm font-mono">θᵢ = θᵣ = {incidentAngle[0]}°</p>
                        <p className="text-xs text-muted-foreground mt-1">Where angles are measured from the normal vector</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mirrors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mirror className="w-5 h-5" />
                      Mirror Optics
                    </CardTitle>
                    <CardDescription>Spherical and planar mirror systems analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <label className="text-sm font-medium text-foreground mb-2 block">Mirror Configuration</label>
                      <Select value={mirrorType} onValueChange={setMirrorType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plane">Planar Mirror (R = ∞)</SelectItem>
                          <SelectItem value="concave">Concave Mirror (R &gt; 0)</SelectItem>
                          <SelectItem value="convex">Convex Mirror (R &lt; 0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 p-6 rounded-lg mb-6">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="w-full h-auto max-w-full border rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Planar Mirror</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">Flat reflective surface with infinite radius of curvature</p>
                          <ul className="text-xs space-y-1">
                            <li>• Virtual, erect images</li>
                            <li>• Magnification: m = +1</li>
                            <li>• Lateral inversion occurs</li>
                            <li>• Object distance = Image distance</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 dark:border-green-800">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Concave Mirror</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">Converging mirror with positive focal length</p>
                          <ul className="text-xs space-y-1">
                            <li>• Real/virtual image formation</li>
                            <li>• f = R/2 (positive)</li>
                            <li>• Used in reflecting telescopes</li>
                            <li>• Variable magnification</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200 dark:border-orange-800">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Convex Mirror</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">Diverging mirror with negative focal length</p>
                          <ul className="text-xs space-y-1">
                            <li>• Always virtual images</li>
                            <li>• f = R/2 (negative)</li>
                            <li>• Wide field of view</li>
                            <li>• Magnification: 0 &lt; |m| &lt; 1</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engineering Applications</CardTitle>
                    <CardDescription>Engineering applications in optical systems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Precision Instruments</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Eye className="w-5 h-5 text-blue-500 mt-1" />
                            <div>
                              <h4 className="font-medium">Reflecting Telescopes</h4>
                              <p className="text-sm text-muted-foreground">Primary mirrors with focal lengths of 1-10 meters collect and focus electromagnetic radiation</p>
                              <p className="text-xs text-muted-foreground mt-1">Examples: Hubble (f = 57.6m), James Webb (f = 131.4m)</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Mirror className="w-5 h-5 text-green-500 mt-1" />
                            <div>
                              <h4 className="font-medium">Laser Interferometry</h4>
                              <p className="text-sm text-muted-foreground">High-precision mirrors in LIGO detect gravitational waves with 10⁻¹৯ m sensitivity</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Industrial Applications</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-orange-500 mt-1" />
                            <div>
                              <h4 className="font-medium">Automotive Safety</h4>
                              <p className="text-sm text-muted-foreground">Convex mirrors provide 2-3x wider field of view with controlled distortion</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Sun className="w-5 h-5 text-yellow-500 mt-1" />
                            <div>
                              <h4 className="font-medium">Solar Concentrators</h4>
                              <p className="text-sm text-muted-foreground">Parabolic mirrors achieve concentration ratios of 1000:1 for thermal applications</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="w-5 h-5" />
                  Fundamental Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="font-medium">Geometric Optics</h5>
                    <p className="text-muted-foreground">Light propagates as rays in homogeneous media</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Specular Reflection</h5>
                    <p className="text-muted-foreground">Mirror-like reflection from smooth surfaces</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Mirror Equation</h5>
                    <p className="text-muted-foreground font-mono">1/f = 1/do + 1/di</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Magnification</h5>
                    <p className="text-muted-foreground font-mono">m = -di/do = hi/ho</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Experimental Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">Current Configuration:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Incident Angle: {incidentAngle[0]}°</li>
                    <li>• Reflected Angle: {incidentAngle[0]}°</li>
                    <li>• Mirror Configuration: {t(`refl.${mirrorType}`)}</li>
                    <li>• Source: {t(`refl.${lightSource}`)}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
