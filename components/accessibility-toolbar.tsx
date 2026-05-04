"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Type, Palette, Volume2, Settings2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState([16])
  const [contrast, setContrast] = useState([1])
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize[0]}px`
    document.documentElement.style.filter = `contrast(${contrast[0]})`

    if (reducedMotion) {
      document.documentElement.style.setProperty("--animation-duration", "0s")
    } else {
      document.documentElement.style.removeProperty("--animation-duration")
    }

    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [fontSize, contrast, reducedMotion, highContrast])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "a") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl z-[60] font-semibold text-sm shadow-lg"
      >
        Skip to main content
      </a>

      {/* FAB toggle */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-5 right-5 z-40 rounded-2xl w-12 h-12 p-0 shadow-lg shadow-primary/25 transition-all duration-200",
          "hover:scale-105 hover:shadow-primary/40",
          isOpen && "rotate-45",
        )}
        aria-label="Open accessibility settings (Alt + A)"
        title="Accessibility Settings (Alt + A)"
      >
        <Settings2 className="w-5 h-5" />
      </Button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-40 w-72 animate-scale-in">
          <div className="glass-card rounded-2xl border border-border/60 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <h3 className="font-bold text-sm">Accessibility Settings</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                aria-label="Close accessibility settings"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-5">
              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Type className="w-3.5 h-3.5 text-primary" />
                    Font Size
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {fontSize[0]}px
                  </span>
                </div>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                  aria-label="Adjust font size"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Palette className="w-3.5 h-3.5 text-primary" />
                    Contrast
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {Math.round(contrast[0] * 100)}%
                  </span>
                </div>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                  aria-label="Adjust contrast"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    High Contrast
                  </div>
                  <Switch
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                    aria-label="Toggle high contrast mode"
                  />
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Volume2 className="w-3.5 h-3.5 text-primary" />
                    Reduce Motion
                  </div>
                  <Switch
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                    aria-label="Toggle reduced motion"
                  />
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="rounded-xl h-9 text-sm border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-xl border-border/60 hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive transition-colors text-xs font-semibold"
                onClick={() => {
                  setFontSize([16])
                  setContrast([1])
                  setReducedMotion(false)
                  setHighContrast(false)
                  setLanguage("en")
                }}
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
