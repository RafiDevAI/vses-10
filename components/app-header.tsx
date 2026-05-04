"use client"

import type React from "react"
import { Search, Moon, Sun, Menu, Maximize2, X, Atom } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { experimentsData } from "@/lib/experiments-data"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarNav } from "@/components/sidebar-nav"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const categoryColors: Record<string, string> = {
  Physics: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Chemistry: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Astronomy: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  "Earth Science": "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Biology: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
}

export function AppHeader() {
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const searchRef = useRef<HTMLDivElement>(null)
  const { language, setLanguage, t } = useLanguage()

  const isOnExperimentsPage = pathname === "/experiments"

  useEffect(() => {
    const query = searchParams.get("search")
    if (query) setSearchQuery(query)
  }, [searchParams])

  // Close results when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const searchResults = searchQuery
    ? experimentsData.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/experiments?search=${encodeURIComponent(searchQuery)}`)
      setShowResults(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowResults(value.length > 0)
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleBackToExperimentsFullscreen = () => {
    router.push("/experiments")
    setTimeout(() => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {})
      }
    }, 100)
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <header className="border-b border-border/60 glass sticky top-0 z-50">
      <div className="flex items-center gap-3 px-4 md:px-6 py-3">
        {/* Mobile menu */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0 hover:bg-primary/8 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <SidebarNav onClose={() => setIsSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Mobile logo (only shown on mobile) */}
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sidebar-logo-gradient rounded-lg flex items-center justify-center">
            <Atom className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Fullscreen button on experiments page */}
        {isOnExperimentsPage && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToExperimentsFullscreen}
            className="gap-2 hidden sm:flex bg-transparent border-border/60 hover:bg-primary/8 hover:border-primary/30 hover:text-primary rounded-xl transition-all duration-200"
            title="View experiments in fullscreen mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-sm font-medium">Fullscreen</span>
          </Button>
        )}

        {/* Search bar */}
        <div ref={searchRef} className="flex-1 max-w-xl mx-auto relative">
          <form onSubmit={handleSearch}>
            <div
              className={cn(
                "relative flex items-center rounded-xl border transition-all duration-200",
                isFocused
                  ? "border-primary/40 bg-background shadow-sm shadow-primary/10 ring-2 ring-primary/10"
                  : "border-border/60 bg-background/60 hover:border-border",
              )}
            >
              <Search className={cn(
                "absolute left-3 w-4 h-4 transition-colors duration-200",
                isFocused ? "text-primary" : "text-muted-foreground",
              )} />
              <Input
                placeholder={t("nav.search")}
                className="pl-10 pr-8 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm h-9"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => { setIsFocused(true); searchQuery && setShowResults(true) }}
                onBlur={() => setIsFocused(false)}
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-7 w-7 hover:bg-muted rounded-lg"
                  onClick={() => {
                    setSearchQuery("")
                    setShowResults(false)
                    router.push("/experiments")
                  }}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </form>

          {/* Search results dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass-card rounded-2xl overflow-hidden border border-border/50 shadow-2xl z-50 animate-scale-in">
              <div className="p-1.5">
                {searchResults.slice(0, 5).map((exp) => (
                  <Link
                    key={exp.id}
                    href={`/experiments/${exp.id}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-start gap-3 p-3 hover:bg-primary/5 rounded-xl transition-colors duration-150 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                        {exp.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {exp.description}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "mt-0.5 text-[10px] uppercase tracking-wider font-bold border-0 shrink-0",
                        categoryColors[exp.category] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {exp.category}
                    </Badge>
                  </Link>
                ))}
                {searchResults.length > 5 && (
                  <button
                    className="w-full mt-1 py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors"
                    onClick={() => {
                      router.push(`/experiments?search=${encodeURIComponent(searchQuery)}`)
                      setShowResults(false)
                    }}
                  >
                    {t("nav.results", { n: searchResults.length })}
                  </button>
                )}
              </div>
            </div>
          )}

          {showResults && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full glass-card rounded-2xl border border-border/50 shadow-xl z-50 animate-scale-in">
              <div className="px-4 py-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">{t("nav.noResults")}</p>
                <p className="text-sm font-bold text-foreground mt-1">"{searchQuery}"</p>
              </div>
            </div>
          )}
        </div>


        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="shrink-0 rounded-xl hover:bg-primary/8 transition-all duration-200"
          title={isDark ? t("theme.light") : t("theme.dark")}
        >
          <div className="relative w-5 h-5">
            <Sun
              className={cn(
                "absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300",
                isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50",
              )}
            />
            <Moon
              className={cn(
                "absolute inset-0 w-5 h-5 text-slate-600 dark:text-slate-300 transition-all duration-300",
                isDark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100",
              )}
            />
          </div>
        </Button>
      </div>
    </header>
  )
}
