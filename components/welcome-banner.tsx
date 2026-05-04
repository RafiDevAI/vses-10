"use client"

import { Atom, FlaskConical, Globe, Zap } from "lucide-react"

export function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 text-primary-foreground shadow-xl shadow-primary/20">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Floating science icons */}
      <div className="absolute right-6 top-4 opacity-10">
        <Atom className="w-28 h-28" />
      </div>
      <div className="absolute right-32 bottom-4 opacity-8">
        <FlaskConical className="w-16 h-16" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            <Zap className="w-3 h-3" />
            Free · Open Access
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-1.5">
          Explore Virtual Science
        </h2>
        <p className="text-primary-foreground/80 text-base leading-relaxed max-w-sm">
          Interactive experiments in Physics, Chemistry, Astronomy, and more — no equipment required.
        </p>
      </div>
    </div>
  )
}
