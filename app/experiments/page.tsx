"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { experimentsData } from "@/lib/experiments-data"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Beaker, Clock, Play, Globe, Zap, Leaf, Atom, Flame, Droplets,
  Layers, Thermometer, FlaskConical, Search
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, any> = {
  Planet: Globe,
  Beaker: FlaskConical,
  Atom: Atom,
  Globe: Globe,
  Zap: Zap,
  Leaf: Leaf,
  Flame: Flame,
  Droplets: Droplets,
  Layers: Layers,
  Thermometer: Thermometer,
  Molecule: Atom,
}

const categoryConfig: Record<string, {
  tab: string
  color: string
  bgColor: string
  lightBg: string
  border: string
}> = {
  all: { tab: "All", color: "text-foreground", bgColor: "bg-primary", lightBg: "bg-primary/10", border: "border-primary/20" },
  Astronomy: { tab: "Astronomy", color: "text-violet-600 dark:text-violet-400", bgColor: "bg-violet-600", lightBg: "bg-violet-500/10", border: "border-violet-500/20" },
  Physics: { tab: "Physics", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-600", lightBg: "bg-blue-500/10", border: "border-blue-500/20" },
  Chemistry: { tab: "Chemistry", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-600", lightBg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  "Earth Science": { tab: "Earth Science", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-600", lightBg: "bg-orange-500/10", border: "border-orange-500/20" },
  Biology: { tab: "Biology", color: "text-teal-600 dark:text-teal-400", bgColor: "bg-teal-600", lightBg: "bg-teal-500/10", border: "border-teal-500/20" },
}

const difficultyConfig: Record<string, { label: string; color: string; dot: string }> = {
  Beginner: { label: "Beginner", color: "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40", dot: "bg-green-500" },
  Intermediate: { label: "Intermediate", color: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40", dot: "bg-amber-500" },
  Advanced: { label: "Advanced", color: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40", dot: "bg-red-500" },
}

const categories = ["all", "Astronomy", "Physics", "Chemistry", "Earth Science", "Biology"]

function ExperimentsContent() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("search") || ""
  const urlCategory = searchParams.get("category")

  useEffect(() => {
    if (urlCategory) {
      const formattedCategory =
        urlCategory.toLowerCase() === "earth-science" || urlCategory.toLowerCase() === "geology"
          ? "Earth Science"
          : urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1).toLowerCase()
      if (categories.includes(formattedCategory)) {
        setSelectedCategory(formattedCategory)
      }
    } else if (!searchQuery) {
      setSelectedCategory("all")
    }
  }, [urlCategory, searchQuery])

  const filteredExperiments = experimentsData.filter((exp) => {
    const matchesCategory = selectedCategory === "all" || exp.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="flex-1 bg-gradient-mesh" id="main-content">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Virtual Experiments</h2>
            <p className="text-muted-foreground mt-1.5 text-base">
              {searchQuery
                ? <><span className="font-semibold text-foreground">{filteredExperiments.length}</span> result{filteredExperiments.length !== 1 ? "s" : ""} for "<span className="font-semibold text-primary">{searchQuery}</span>"</>
                : <><span className="font-semibold text-foreground">{filteredExperiments.length}</span> interactive {filteredExperiments.length === 1 ? "experiment" : "experiments"} available</>
              }
            </p>
          </div>

          {/* Category tabs — custom styled */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((category) => {
              const isActive = selectedCategory === category
              const cfg = categoryConfig[category] ?? categoryConfig.all
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    if (category === "all") {
                      router.push("/experiments")
                    } else {
                      router.push(
                        `/experiments?category=${category.toLowerCase() === "earth science" ? "earth-science" : category.toLowerCase()}`
                      )
                    }
                  }}
                  className={cn(
                    "relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200",
                    isActive
                      ? `${cfg.bgColor} text-white shadow-md`
                      : "text-muted-foreground bg-muted/60 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {category === "all" ? "All" : category}
                </button>
              )
            })}
          </div>
        </div>

        {/* Empty state */}
        {filteredExperiments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-1">No experiments found</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Try a different search term or browse by category
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl"
              onClick={() => { router.push("/experiments"); setSelectedCategory("all") }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {filteredExperiments.map((experiment) => {
              const IconComponent = iconMap[experiment.icon as string] || Beaker
              const catCfg = categoryConfig[experiment.category] ?? categoryConfig.all
              const difCfg = difficultyConfig[experiment.difficulty] ?? difficultyConfig.Beginner

              return (
                <Link
                  key={experiment.id}
                  href={`/experiments/${experiment.id}`}
                  className="block animate-fade-up"
                >
                  <Card className="group experiment-card overflow-hidden h-full border border-border/60 bg-card/80 backdrop-blur-sm relative p-0">
                    {/* Category color strip */}
                    <div className={cn("h-1 w-full", catCfg.bgColor)} />

                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-muted">
                      <Image
                        src={experiment.image || "/placeholder.svg"}
                        alt={experiment.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />

                      {/* Difficulty badge — floating on image */}
                      <div className="absolute top-3 right-3">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm",
                          difCfg.color,
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", difCfg.dot)} />
                          {experiment.difficulty}
                        </span>
                      </div>
                    </div>

                    <CardHeader className="pt-4 pb-2 px-5">
                      <div className="flex items-center justify-between mb-2">
                        {/* Icon */}
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          catCfg.lightBg,
                          `group-hover:${catCfg.bgColor}`,
                        )}>
                          <IconComponent className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            catCfg.color,
                            "group-hover:text-white",
                          )} />
                        </div>
                        {/* Category badge */}
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] uppercase tracking-wider font-bold border px-2.5 py-0.5",
                            catCfg.lightBg, catCfg.color, catCfg.border,
                          )}
                        >
                          {experiment.category}
                        </Badge>
                      </div>

                      <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors duration-200">
                        {experiment.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed line-clamp-2 mt-1">
                        {experiment.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="px-5 pb-5 pt-0">
                      <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-primary/60" />
                          <span>{experiment.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {experiment.segments?.slice(0, 2).map((seg) => (
                            <span key={seg} className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium">
                              {seg}
                            </span>
                          ))}
                          {(experiment.segments?.length ?? 0) > 2 && (
                            <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium">
                              +{(experiment.segments?.length ?? 0) - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        className={cn(
                          "w-full h-9 font-semibold text-sm rounded-xl btn-interactive",
                          "bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20 hover:shadow-primary/30",
                        )}
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                        Start Experiment
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default function ExperimentsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <SidebarNav />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />

        <Suspense
          fallback={
            <main className="flex-1 p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border/60 overflow-hidden bg-card">
                    <div className="h-1 shimmer" />
                    <div className="h-44 shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 shimmer rounded-full w-2/3" />
                      <div className="h-3 shimmer rounded-full w-full" />
                      <div className="h-3 shimmer rounded-full w-4/5" />
                      <div className="h-9 shimmer rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          }
        >
          <ExperimentsContent />
        </Suspense>
      </div>
    </div>
  )
}
