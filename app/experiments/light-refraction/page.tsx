"use client"

import { useState, useEffect, useRef } from "react"
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
  Droplets,
  Diamond,
  BookOpen,
  Calculator,
  Maximize,
  Minimize,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function LightRefractionPage() {
  const { t, language } = useLanguage()
  const [currentSegment, setCurrentSegment] = useState("snells-law")
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [incidentAngle, setIncidentAngle] = useState([30])
  const [medium1, setMedium1] = useState("air")
  const [medium2, setMedium2] = useState("water")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const materials = {
    air: { 
      name: language === "en" ? "Air (STP)" : "বাতাস (STP)", 
      refractiveIndex: 1.000293, 
      color: "#e0f2fe", 
      density: language === "en" ? "1.225 kg/m³" : "১.২২৫ কেজি/মি³" 
    },
    water: { 
      name: language === "en" ? "Water (20°C)" : "পানি (২০°সে)", 
      refractiveIndex: 1.333, 
      color: "#0ea5e9", 
      density: language === "en" ? "998 kg/m³" : "৯৯৮ কেজি/মি³" 
    },
    glass: { 
      name: language === "en" ? "Crown Glass" : "ক্রাউন গ্লাস", 
      refractiveIndex: 1.52, 
      color: "#64748b", 
      density: language === "en" ? "2500 kg/m³" : "২৫০০ কেজি/মি³" 
    },
    diamond: { 
      name: language === "en" ? "Diamond" : "হীরা (Diamond)", 
      refractiveIndex: 2.417, 
      color: "#a855f7", 
      density: language === "en" ? "3520 kg/m³" : "৩৫২০ কেজি/মি³" 
    },
    flint: { 
      name: language === "en" ? "Flint Glass" : "ফ্লিন্ট গ্লাস", 
      refractiveIndex: 1.62, 
      color: "#7c3aed", 
      density: language === "en" ? "3600 kg/m³" : "৩৬০০ কেজি/মি³" 
    },
    quartz: { 
      name: language === "en" ? "Fused Silica" : "ফিউজড সিলিকা", 
      refractiveIndex: 1.458, 
      color: "#06b6d4", 
      density: language === "en" ? "2200 kg/m³" : "২২০০ কেজি/মি³" 
    },
  }

  const segments = [
    {
      id: "snells-law",
      title: "Snell's Law",
      description: "Fundamental law governing electromagnetic wave refraction",
      completed: false,
    },
    {
      id: "critical-angle",
      title: "Total Internal Reflection",
      description: "Critical angle phenomena and waveguide principles",
      completed: false,
    },
    {
      id: "applications",
      title: "Optical Engineering",
      description: "Industrial applications of refractive optics",
      completed: false,
    },
  ]

  const calculateRefractedAngle = (incidentAngle: number, n1: number, n2: number) => {
    const incidentRad = (incidentAngle * Math.PI) / 180
    const sinRefracted = (n1 * Math.sin(incidentRad)) / n2

    if (sinRefracted > 1) return null

    const refractedRad = Math.asin(sinRefracted)
    return (refractedRad * 180) / Math.PI
  }

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
      const interfaceY = centerY

      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(50, interfaceY)
      ctx.lineTo(canvas.width - 50, interfaceY)
      ctx.moveTo(centerX, 50)
      ctx.lineTo(centerX, canvas.height - 50)
      ctx.stroke()

      const material1 = materials[medium1 as keyof typeof materials]
      const material2 = materials[medium2 as keyof typeof materials]

      const gradient1 = ctx.createLinearGradient(0, 0, 0, interfaceY)
      gradient1.addColorStop(0, material1.color + "20")
      gradient1.addColorStop(1, material1.color + "40")
      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, interfaceY)

      const gradient2 = ctx.createLinearGradient(0, interfaceY, 0, canvas.height)
      gradient2.addColorStop(0, material2.color + "40")
      gradient2.addColorStop(1, material2.color + "20")
      ctx.fillStyle = gradient2
      ctx.fillRect(0, interfaceY, canvas.width, canvas.height - interfaceY)

      ctx.beginPath()
      ctx.moveTo(0, interfaceY)
      ctx.lineTo(canvas.width, interfaceY)
      ctx.strokeStyle = "#1f2937"
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.beginPath()
      ctx.setLineDash([10, 5])
      ctx.moveTo(centerX, interfaceY - 120)
      ctx.lineTo(centerX, interfaceY + 120)
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.setLineDash([])

      const n1 = material1.refractiveIndex
      const n2 = material2.refractiveIndex
      const refractedAngle = calculateRefractedAngle(incidentAngle[0], n1, n2)

      const incidentRad = (incidentAngle[0] * Math.PI) / 180
      const rayLength = 120

      const incidentStartX = centerX - Math.sin(incidentRad) * rayLength
      const incidentStartY = interfaceY - Math.cos(incidentRad) * rayLength

      ctx.beginPath()
      ctx.moveTo(incidentStartX, incidentStartY)
      ctx.lineTo(centerX, interfaceY)
      ctx.strokeStyle = "#dc2626"
      ctx.lineWidth = 4
      ctx.stroke()

      const arrowSize = 8
      const arrowAngle = Math.atan2(interfaceY - incidentStartY, centerX - incidentStartX)
      ctx.beginPath()
      ctx.moveTo(centerX - 15 * Math.cos(arrowAngle), interfaceY - 15 * Math.sin(arrowAngle))
      ctx.lineTo(
        centerX - 15 * Math.cos(arrowAngle) - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
        interfaceY - 15 * Math.sin(arrowAngle) - arrowSize * Math.sin(arrowAngle - Math.PI / 6),
      )
      ctx.moveTo(centerX - 15 * Math.cos(arrowAngle), interfaceY - 15 * Math.sin(arrowAngle))
      ctx.lineTo(
        centerX - 15 * Math.cos(arrowAngle) - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
        interfaceY - 15 * Math.sin(arrowAngle) - arrowSize * Math.sin(arrowAngle + Math.PI / 6),
      )
      ctx.strokeStyle = "#dc2626"
      ctx.lineWidth = 3
      ctx.stroke()

      if (refractedAngle !== null) {
        const refractedRad = (refractedAngle * Math.PI) / 180
        const refractedEndX = centerX + Math.sin(refractedRad) * rayLength
        const refractedEndY = interfaceY + Math.cos(refractedRad) * rayLength

        ctx.beginPath()
        ctx.moveTo(centerX, interfaceY)
        ctx.lineTo(refractedEndX, refractedEndY)
        ctx.strokeStyle = "#059669"
        ctx.lineWidth = 4
        ctx.stroke()

        const refractedArrowAngle = Math.atan2(refractedEndY - interfaceY, refractedEndX - centerX)
        ctx.beginPath()
        ctx.moveTo(centerX + 15 * Math.cos(refractedArrowAngle), interfaceY + 15 * Math.sin(refractedArrowAngle))
        ctx.lineTo(
          centerX + 15 * Math.cos(refractedArrowAngle) + arrowSize * Math.cos(refractedArrowAngle - Math.PI / 6),
          interfaceY + 15 * Math.sin(refractedArrowAngle) + arrowSize * Math.sin(refractedArrowAngle - Math.PI / 6),
        )
        ctx.moveTo(centerX + 15 * Math.cos(refractedArrowAngle), interfaceY + 15 * Math.sin(refractedArrowAngle))
        ctx.lineTo(
          centerX + 15 * Math.cos(refractedArrowAngle) + arrowSize * Math.cos(refractedArrowAngle + Math.PI / 6),
          interfaceY + 15 * Math.sin(refractedArrowAngle) + arrowSize * Math.sin(refractedArrowAngle + Math.PI / 6),
        )
        ctx.strokeStyle = "#059669"
        ctx.lineWidth = 3
        ctx.stroke()

        if (currentSegment === "snells-law") {
          ctx.fillStyle = "#1f2937"
          ctx.font = "16px 'Inter', sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(`θ₁ = ${incidentAngle[0].toFixed(1)}°`, centerX - 80, interfaceY - 30)
          ctx.fillText(`θ₂ = ${refractedAngle.toFixed(1)}°`, centerX + 80, interfaceY + 50)

          const snellLeft = (n1 * Math.sin(incidentRad)).toFixed(3)
          const snellRight = (n2 * Math.sin((refractedAngle * Math.PI) / 180)).toFixed(3)
          ctx.font = "12px 'Inter', sans-serif"
          ctx.fillText(`n₁sin θ₁ = ${snellLeft}`, centerX - 80, interfaceY - 10)
          ctx.fillText(`n₂sin θ₂ = ${snellRight}`, centerX + 80, interfaceY + 70)
        }
      } else {
        const reflectedEndX = centerX + Math.sin(incidentRad) * rayLength
        const reflectedEndY = interfaceY - Math.cos(incidentRad) * rayLength

        ctx.beginPath()
        ctx.moveTo(centerX, interfaceY)
        ctx.lineTo(reflectedEndX, reflectedEndY)
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 4
        ctx.stroke()

        ctx.fillStyle = "#f59e0b"
        ctx.font = "16px 'Inter', sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Total Internal Reflection", centerX, interfaceY + 140)
        ctx.font = "12px 'Inter', sans-serif"
        ctx.fillText(`$Critical Angle: ${((Math.asin(n2 / n1) * 180) / Math.PI).toFixed(1)}°`, centerX, interfaceY + 160)
      }

      if (isAnimating) {
        const particleCount = 6
        for (let i = 0; i < particleCount; i++) {
          const t = (animationTime + i * 0.2) % 2
          let particleX, particleY

          if (t < 1) {
            particleX = incidentStartX + (centerX - incidentStartX) * t
            particleY = incidentStartY + (interfaceY - incidentStartY) * t
          } else if (refractedAngle !== null) {
            const refractedT = t - 1
            const refractedRad = (refractedAngle * Math.PI) / 180
            const refractedEndX = centerX + Math.sin(refractedRad) * rayLength
            const refractedEndY = interfaceY + Math.cos(refractedRad) * rayLength

            particleX = centerX + (refractedEndX - centerX) * refractedT
            particleY = interfaceY + (refractedEndY - interfaceY) * refractedT
          } else {
            const reflectedT = t - 1
            const reflectedEndX = centerX + Math.sin(incidentRad) * rayLength
            const reflectedEndY = interfaceY - Math.cos(incidentRad) * rayLength

            particleX = centerX + (reflectedEndX - centerX) * reflectedT
            particleY = interfaceY + (reflectedEndY - interfaceY) * reflectedT
          }

          ctx.beginPath()
          ctx.arc(particleX, particleY, 6, 0, 2 * Math.PI)
          ctx.fillStyle = "#fbbf24"
          ctx.fill()

          ctx.beginPath()
          ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI)
          ctx.fillStyle = "#ffffff"
          ctx.fill()
        }

        animationTime += 0.012
        setProgress((prev) => Math.min(prev + 0.06, 100))
      }

      ctx.fillStyle = "#1f2937"
      ctx.font = "16px 'Inter', sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(material1.name, 20, 30)
      ctx.font = "12px 'Inter', sans-serif"
      ctx.fillText(`n = ${material1.refractiveIndex}`, 20, 50)
      ctx.fillText(`ρ = ${material1.density}`, 20, 65)

      ctx.font = "16px 'Inter', sans-serif"
      ctx.fillText(material2.name, 20, interfaceY + 30)
      ctx.font = "12px 'Inter', sans-serif"
      ctx.fillText(`n = ${material2.refractiveIndex}`, 20, interfaceY + 50)
      ctx.fillText(`ρ = ${material2.density}`, 20, interfaceY + 65)

      ctx.font = "14px 'Inter', sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Normal (N)", centerX + 15, interfaceY - 100)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [currentSegment, isAnimating, incidentAngle, medium1, medium2, t, language])

  const handleAnimation = () => {
    setIsAnimating(!isAnimating)
    if (!isAnimating) {
      setProgress(0)
    }
  }

  const criticalAngle = () => {
    const n1 = materials[medium1 as keyof typeof materials].refractiveIndex
    const n2 = materials[medium2 as keyof typeof materials].refractiveIndex
    if (n1 <= n2) return null
    return Math.asin(n2 / n1) * (180 / Math.PI)
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
                  <h1 className="text-lg font-bold text-foreground">Geometric Optics: Refraction</h1>
                  <p className="text-xs text-muted-foreground">Snell's law and electromagnetic wave propagation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Physics</Badge>
              <Badge variant="outline">Optics</Badge>
              <Badge variant="outline">Advanced</Badge>
              <Button onClick={toggleFullscreen} variant="outline" size="sm">
                {isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
                {isFullscreen ? (language === "en" ? "Exit" : "বন্ধ করুন") : (language === "en" ? "Fullscreen" : "পূর্ণ পর্দা")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
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

              <TabsContent value="snells-law" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Snell's Law: n₁ sin θ₁ = n₂ sin θ₂
                    </CardTitle>
                    <CardDescription>
                      Fundamental law governing electromagnetic wave refraction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Learning Objectives:</h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Apply Snell's law to calculate refraction angles</li>
                        <li>• Understand the relationship between refractive index and wave velocity</li>
                        <li>• Analyze electromagnetic wave behavior at dielectric interfaces</li>
                        <li>• Calculate critical angles for total internal reflection</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-900 p-6 rounded-lg mb-6">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="w-full h-auto max-w-full border rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Incident Angle (θ₁): {incidentAngle[0].toFixed(1)}°
                        </label>
                        <Slider
                          value={incidentAngle}
                          onValueChange={setIncidentAngle}
                          max={85}
                          min={5}
                          step={0.5}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">{language === "en" ? "Measured from interface normal" : "ইন্টারফেস অভিলম্ব থেকে পরিমাপ করা হয়েছে"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Incident Medium</label>
                        <Select value={medium1} onValueChange={setMedium1}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(materials).map(([key, material]) => (
                              <SelectItem key={key} value={key}>
                                {material.name} (n = {material.refractiveIndex})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Refracting Medium</label>
                        <Select value={medium2} onValueChange={setMedium2}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(materials).map(([key, material]) => (
                              <SelectItem key={key} value={key}>
                                {material.name} (n = {material.refractiveIndex})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Button onClick={handleAnimation}>
                          {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {isAnimating ? "Pause" : "Start Wave Propagation"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAnimating(false)
                            setProgress(0)
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          {t("refr.resetSimulation")}
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">{"Simulation Progress: {n}%".replace("{n}", Math.round(progress).toString())}</div>
                    </div>

                    <Progress value={progress} className="mb-6" />

                    <div className="bg-muted/50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Snell's Law: n₁ sin θ₁ = n₂ sin θ₂
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Current Calculation:</h5>
                          <div className="text-sm space-y-1">
                            <p>n₁ = {materials[medium1 as keyof typeof materials].refractiveIndex}</p>
                            <p>θ₁ = {incidentAngle[0].toFixed(1)}°</p>
                            <p>n₂ = {materials[medium2 as keyof typeof materials].refractiveIndex}</p>
                            {calculateRefractedAngle(
                              incidentAngle[0],
                              materials[medium1 as keyof typeof materials].refractiveIndex,
                              materials[medium2 as keyof typeof materials].refractiveIndex,
                            ) !== null ? (
                              <p>
                                θ₂ ={" "}
                                {calculateRefractedAngle(
                                  incidentAngle[0],
                                  materials[medium1 as keyof typeof materials].refractiveIndex,
                                  materials[medium2 as keyof typeof materials].refractiveIndex,
                                )!.toFixed(1)}
                                °
                              </p>
                            ) : (
                              <p className="text-orange-600">Total Internal Reflection</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Physical Interpretation:</h5>
                          <p className="text-sm text-muted-foreground">
                            Refractive index relates to the speed of light in the medium: n = c/v, where c is the speed of light in vacuum and v is the phase velocity in the medium.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="critical-angle" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Internal Reflection</CardTitle>
                    <CardDescription>Critical angle phenomena and waveguide principles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-lg mb-6">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="w-full h-auto max-w-full border rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>

                    {criticalAngle() && (
                      <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                          Critical Angle: {Math.round(criticalAngle()!)}°
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          The incident angle exceeds the critical angle
                        </p>
                      </div>
                    )}

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Total Internal Reflection occurs when:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Light travels from a denser to a less dense medium</li>
                        <li>• The incident angle exceeds the critical angle</li>
                        <li>• All light is reflected back into the first medium</li>
                        <li>• Used in optical fibers and prisms</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Optical Engineering</CardTitle>
                    <CardDescription>Industrial applications of refractive optics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Vision & Lenses</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Eye className="w-5 h-5 text-blue-500 mt-1" />
                            <div>
                              <h4 className="font-medium">Human Eye</h4>
                              <p className="text-sm text-muted-foreground">
                                The cornea and lens refract light to focus images on the retina
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Diamond className="w-5 h-5 text-purple-500 mt-1" />
                            <div>
                              <h4 className="font-medium">Eyeglasses</h4>
                              <p className="text-sm text-muted-foreground">
                                Corrective lenses use refraction to fix vision problems
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Technology</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Droplets className="w-5 h-5 text-cyan-500 mt-1" />
                            <div>
                              <h4 className="font-medium">Optical Fibers</h4>
                              <p className="text-sm text-muted-foreground">
                                Use total internal reflection to transmit light signals
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-yellow-500 mt-1" />
                            <div>
                              <h4 className="font-medium">Prisms</h4>
                              <p className="text-sm text-muted-foreground">
                                Separate white light into its component colors
                              </p>
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
                  Material Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {Object.entries(materials).map(([key, material]) => (
                    <div key={key} className="p-2 rounded border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{material.name}</span>
                        <span className="font-mono text-xs">n = {material.refractiveIndex}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{material.density}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Formulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className="font-medium">Snell's Law: n₁ sin θ₁ = n₂ sin θ₂</h5>
                    <p className="text-muted-foreground font-mono">n₁ sin θ₁ = n₂ sin θ₂</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Critical Angle:</h5>
                    <p className="text-muted-foreground font-mono">θc = arcsin(n₂/n₁)</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Refractive Index</h5>
                    <p className="text-muted-foreground font-mono">n = c/v</p>
                  </div>
                  {criticalAngle() && (
                    <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded">
                      <h5 className="font-medium text-orange-800 dark:text-orange-200">{language === "en" ? "Current Critical Angle" : "বর্তমান সংকট কোণ"}</h5>
                      <p className="text-orange-700 dark:text-orange-300 font-mono">{criticalAngle()!.toFixed(1)}°</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
