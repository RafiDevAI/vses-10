"use client"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Home, Globe, Beaker, Leaf, Mountain, FlaskConical, Atom } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import { TranslationKey } from "@/lib/i18n/translations"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const dashboardItems = [{ icon: Home, labelKey: "Home" as const, href: "/" }]

const categories = [
  {
    icon: Globe,
    labelKey: "sidebar.physics" as TranslationKey,
    href: "/experiments?category=physics",
    count: 5,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10 dark:bg-blue-500/15",
    dotClass: "bg-blue-500",
  },
  {
    icon: FlaskConical,
    labelKey: "sidebar.chemistry" as TranslationKey,
    href: "/experiments?category=chemistry",
    count: 6,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
    dotClass: "bg-emerald-500",
  },
  {
    icon: Globe,
    labelKey: "sidebar.astronomy" as TranslationKey,
    href: "/experiments?category=astronomy",
    count: 1,
    colorClass: "text-violet-500",
    bgClass: "bg-violet-500/10 dark:bg-violet-500/15",
    dotClass: "bg-violet-500",
  },
  {
    icon: Mountain,
    labelKey: "sidebar.earthScience" as TranslationKey,
    href: "/experiments?category=earth-science",
    count: 1,
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500/10 dark:bg-orange-500/15",
    dotClass: "bg-orange-500",
  },
  {
    icon: Leaf,
    labelKey: "sidebar.biology" as TranslationKey,
    href: "/experiments?category=biology",
    count: 1,
    colorClass: "text-teal-500",
    bgClass: "bg-teal-500/10 dark:bg-teal-500/15",
    dotClass: "bg-teal-500",
  },
]

interface SidebarNavProps {
  onClose?: () => void
}

function SidebarNavInner({ onClose }: SidebarNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get("category")
  const { t } = useLanguage()

  const isCategoryActive = (href: string) => {
    const cat = href.split("category=")[1]
    if (!cat) return false
    return urlCategory === cat
  }

  return (
    <aside className="w-64 border-r border-border/60 bg-sidebar h-screen sticky top-0 flex flex-col overflow-hidden">
      {/* Logo / Brand area */}
      <div className="sidebar-logo-gradient px-5 py-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shadow-inner ring-1 ring-white/30">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Virtual Science</p>
            <p className="text-white/70 text-[11px] font-medium tracking-wide leading-tight">Experiments & Simulations</p>
          </div>
        </div>
      </div>

      {/* Thin accent bar */}
      <div className="h-px bg-gradient-to-r from-primary/30 via-accent/30 to-transparent shrink-0" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Dashboard */}
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            Dashboard
          </p>
          <div className="space-y-0.5">
            {dashboardItems.map((item) => {
              const isActive = pathname === item.href && !urlCategory
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground sidebar-active-glow"
                      : "text-muted-foreground hover:bg-primary/8 hover:text-primary",
                  )}
                >
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive && "drop-shadow-sm")} />
                  {item.labelKey === "Home" ? "Home" : t(item.labelKey)}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Categories */}
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            {"Explore"}
          </p>
          <div className="space-y-0.5">
            {categories.map((category) => {
              const isActive = isCategoryActive(category.href)
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground sidebar-active-glow"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Category dot indicator */}
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                      isActive ? "bg-white/20" : category.bgClass,
                    )}>
                      <category.icon className={cn(
                        "w-3.5 h-3.5 transition-all duration-200",
                        isActive ? "text-primary-foreground" : category.colorClass,
                      )} />
                    </div>
                    <span className="truncate">{t(category.labelKey)}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full min-w-[22px] h-5 px-1.5 text-[10px] font-bold flex items-center justify-center border-0 shrink-0 transition-all duration-200",
                      isActive
                        ? "bg-white/25 text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                    )}
                  >
                    {category.count}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/50 shrink-0">
        <p className="text-[10px] text-muted-foreground/50 text-center font-medium tracking-wide">
          Free · Open Source · WCAG 2.1 AA
        </p>
      </div>
    </aside>
  )
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  return (
    <Suspense fallback={
      <aside className="w-64 border-r border-border/60 bg-sidebar h-screen sticky top-0 flex flex-col">
        <div className="sidebar-logo-gradient px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl" />
            <div className="space-y-1">
              <div className="h-3 w-24 bg-white/20 rounded" />
              <div className="h-2 w-16 bg-white/15 rounded" />
            </div>
          </div>
        </div>
      </aside>
    }>
      <SidebarNavInner onClose={onClose} />
    </Suspense>
  )
}
