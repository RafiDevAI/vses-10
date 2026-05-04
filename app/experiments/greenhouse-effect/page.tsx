"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function GreenhouseEffectPage() {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const simAreaRef = useRef<HTMLDivElement>(null)
  const [co2, setCo2] = useState(280)
  const [ch4, setCh4] = useState(0.7)
  const [solarIntensity, setSolarIntensity] = useState(100)
  const [otherGHG, setOtherGHG] = useState(20)
  const [temperature, setTemperature] = useState(15.0)
  const [trappedHeat, setTrappedHeat] = useState(0)
  const [currentDate, setCurrentDate] = useState("")

  // State for the simulation logic (not just UI state)
  const stateRef = useRef({
    co2: 280,
    ch4: 0.7,
    solarIntensity: 100,
    otherGHG: 20,
    temperature: 15.0,
    particles: [] as any[],
    trappedHeat: 0
  })

  const earthSystemRef = useRef<HTMLDivElement>(null)
  const sunRaysRef = useRef<HTMLDivElement>(null)
  const starsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    stateRef.current.co2 = co2
    stateRef.current.ch4 = ch4
    stateRef.current.solarIntensity = solarIntensity
    stateRef.current.otherGHG = otherGHG
  }, [co2, ch4, solarIntensity, otherGHG])

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split('T')[0])

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const simArea = simAreaRef.current
    if (!simArea) return

    let EARTH = { cx: 0, cy: 0, rSurface: 100, rAtmoInner: 115, rAtmoOuter: 160 }
    let SUN = { cx: 90, cy: 70, r: 38 }

    const resizeCanvas = () => {
      if (!simArea) return
      canvas.width = simArea.offsetWidth
      canvas.height = simArea.offsetHeight
    }

    const recalcGeometry = () => {
      if (!simArea || !earthSystemRef.current) return
      const rect = simArea.getBoundingClientRect()
      const esRect = earthSystemRef.current.getBoundingClientRect()

      EARTH.cx = esRect.left - rect.left + esRect.width / 2
      EARTH.cy = esRect.top - rect.top + esRect.height / 2
      EARTH.rSurface = 100
      EARTH.rAtmoInner = 118
      EARTH.rAtmoOuter = 160

      const sunWrap = simArea.querySelector('.sun-wrap')
      if (!sunWrap) return
      const swRect = sunWrap.getBoundingClientRect()
      SUN.cx = swRect.left - rect.left + swRect.width / 2
      SUN.cy = swRect.top - rect.top + swRect.height / 2
      SUN.r = 38
    }

    class Particle {
      type: string
      x: number
      y: number
      life: number
      maxLife: number
      trail: { x: number, y: number }[]
      angle: number
      radius: number
      speed: number
      orbitDir: number
      vx: number = 0
      vy: number = 0
      size: number
      color: string
      glow: string

      constructor(type: string, x: number, y: number) {
        this.type = type
        this.x = x
        this.y = y
        this.life = 100
        this.maxLife = 100
        this.trail = []
        this.angle = 0
        this.radius = 0
        this.speed = 0
        this.orbitDir = 1
        this.size = 2
        this.color = "#fff"
        this.glow = "#fff"

        if (type === 'solar') {
          const targetAngle = Math.PI + (Math.random() - 0.5) * 1.0
          const targetR = EARTH.rSurface * (0.7 + Math.random() * 0.3)
          const tx = EARTH.cx + Math.cos(targetAngle) * targetR
          const ty = EARTH.cy + Math.sin(targetAngle) * targetR
          const angle = Math.atan2(ty - y, tx - x)
          const speed = 2.5 + Math.random() * 2
          this.vx = Math.cos(angle) * speed
          this.vy = Math.sin(angle) * speed
          this.size = 2.5 + Math.random() * 1.5
          this.color = '#ffd54f'
          this.glow = '#ff9800'
        }
        else if (type === 'infrared') {
          const angle = Math.random() * Math.PI * 2
          const speed = 1.2 + Math.random() * 0.8
          this.vx = Math.cos(angle) * speed
          this.vy = Math.sin(angle) * speed
          this.size = 2.5
          this.color = '#ff5252'
          this.glow = '#ff1744'
        }
        else if (type === 'trapped') {
          this.angle = Math.atan2(y - EARTH.cy, x - EARTH.cx)
          this.radius = EARTH.rAtmoInner + 5 + Math.random() * 30
          this.speed = 0.008 + Math.random() * 0.012
          this.orbitDir = Math.random() < 0.5 ? 1 : -1
          this.x = EARTH.cx + Math.cos(this.angle) * this.radius
          this.y = EARTH.cy + Math.sin(this.angle) * this.radius
          this.size = 3 + Math.random() * 1.5
          this.color = '#ff6e40'
          this.glow = '#ff3d00'
          this.life = 400
          this.maxLife = 400
        }
        else if (type === 'reflected') {
          const angle = Math.random() * Math.PI * 2
          const speed = 2 + Math.random()
          this.vx = Math.cos(angle) * speed
          this.vy = Math.sin(angle) * speed
          this.size = 2
          this.color = '#fff176'
          this.glow = '#ffd54f'
        }
      }

      update() {
        if (this.type === 'trapped') {
          this.angle += this.speed * this.orbitDir
          this.radius += (Math.random() - 0.5) * 0.4
          if (this.radius > EARTH.rAtmoOuter - 8) this.radius = EARTH.rAtmoOuter - 8
          if (this.radius < EARTH.rAtmoInner + 5) this.radius = EARTH.rAtmoInner + 5
          this.x = EARTH.cx + Math.cos(this.angle) * this.radius
          this.y = EARTH.cy + Math.sin(this.angle) * this.radius
          this.life--
          return this.life > 0
        }

        this.x += this.vx
        this.y += this.vy
        this.life--

        const distFromEarth = Math.hypot(this.x - EARTH.cx, this.y - EARTH.cy)

        if (this.type === 'solar') {
          this.trail.push({ x: this.x, y: this.y })
          if (this.trail.length > 8) this.trail.shift()

          if (distFromEarth >= EARTH.rAtmoOuter - 5 && distFromEarth <= EARTH.rAtmoOuter + 10) {
            if (Math.random() < 0.1) {
              this.type = 'reflected'
              const normalAngle = Math.atan2(this.y - EARTH.cy, this.x - EARTH.cx)
              const speed = Math.hypot(this.vx, this.vy)
              this.vx = Math.cos(normalAngle) * speed * 1.2
              this.vy = Math.sin(normalAngle) * speed * 1.2
              this.color = '#fff176'
              this.glow = '#ffd54f'
            }
          }

          if (distFromEarth <= EARTH.rSurface) {
            this.life = 0
            for (let i = 0; i < 2; i++) {
              stateRef.current.particles.push(new Particle('infrared', this.x, this.y))
            }
            return false
          }

          if (!canvas || this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
            this.life = 0
            return false
          }
        }
        else if (this.type === 'infrared') {
          if (distFromEarth >= EARTH.rAtmoInner - 3) {
            const trapChance = getTrapChance()
            if (Math.random() < trapChance) {
              this.type = 'trapped'
              this.color = '#ff6e40'
              this.glow = '#ff3d00'
              this.life = 350 + Math.random() * 150
              this.maxLife = this.life
              this.angle = Math.atan2(this.y - EARTH.cy, this.x - EARTH.cx)
              this.radius = EARTH.rAtmoInner + 8 + Math.random() * 25
              this.speed = 0.01 + Math.random() * 0.015
              this.orbitDir = Math.random() < 0.5 ? 1 : -1
            } else {
              this.life = 0
              return false
            }
          }

          if (distFromEarth <= EARTH.rSurface) {
            this.life = 0
            stateRef.current.particles.push(new Particle('infrared', this.x, this.y))
            return false
          }
        }
        else if (this.type === 'reflected') {
          if (!canvas || this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
            this.life = 0
            return false
          }
        }

        return this.life > 0
      }

      draw(ctx: CanvasRenderingContext2D) {
        const alpha = this.life / this.maxLife

        if (this.type === 'solar' && this.trail.length > 1) {
          ctx.strokeStyle = `rgba(255, 213, 79, ${alpha * 0.35})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          for (let i = 0; i < this.trail.length; i++) {
            if (i === 0) ctx.moveTo(this.trail[i].x, this.trail[i].y)
            else ctx.lineTo(this.trail[i].x, this.trail[i].y)
          }
          ctx.stroke()
        }

        ctx.shadowBlur = 12
        ctx.shadowColor = this.glow
        ctx.fillStyle = this.color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
      }
    }

    const getTrapChance = () => {
      const co2Factor = (stateRef.current.co2 - 180) / 620
      const ch4Factor = (stateRef.current.ch4 - 0.3) / 3.7
      const otherFactor = stateRef.current.otherGHG / 100
      const baseChance = 0.3
      const extraChance = co2Factor * 0.5 + ch4Factor * 0.25 + otherFactor * 0.15
      return Math.min(0.95, baseChance + extraChance)
    }

    const emitSolarRadiation = () => {
      const count = Math.floor(stateRef.current.solarIntensity / 18)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const dist = SUN.r * (0.4 + Math.random() * 0.6)
        const sx = SUN.cx + Math.cos(angle) * dist
        const sy = SUN.cy + Math.sin(angle) * dist
        stateRef.current.particles.push(new Particle('solar', sx, sy))
      }
    }

    const emitInfraredFromSurface = () => {
      const angle = Math.random() * Math.PI * 2
      const sx = EARTH.cx + Math.cos(angle) * (EARTH.rSurface - 2)
      const sy = EARTH.cy + Math.sin(angle) * (EARTH.rSurface - 2)
      stateRef.current.particles.push(new Particle('infrared', sx, sy))
    }

    const drawHeatTrappingArcs = () => {
      if (stateRef.current.trappedHeat < 15) return
      const intensity = Math.min(0.5, stateRef.current.trappedHeat / 100)
      ctx.strokeStyle = `rgba(255, 60, 30, ${intensity})`
      ctx.lineWidth = 2.5
      ctx.setLineDash([6, 6])

      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        const r = EARTH.rAtmoInner + 10 + i * 12
        ctx.arc(EARTH.cx, EARTH.cy, r, Math.PI * 0.4, Math.PI * 1.6)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(255, 140, 50, 0.15)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(EARTH.cx, EARTH.cy, EARTH.rAtmoOuter, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255, 100, 50, 0.1)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(EARTH.cx, EARTH.cy, EARTH.rAtmoInner, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(100, 180, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(EARTH.cx, EARTH.cy, EARTH.rSurface, 0, Math.PI * 2)
      ctx.stroke()

      const trappedCount = stateRef.current.particles.filter(p => p.type === 'trapped').length
      if (trappedCount > 0) {
        const glowIntensity = Math.min(0.6, trappedCount / 150)
        ctx.fillStyle = `rgba(255, 50, 20, ${glowIntensity * 0.3})`
        ctx.beginPath()
        ctx.arc(EARTH.cx, EARTH.cy, EARTH.rAtmoOuter - 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(255, 80, 30, ${glowIntensity * 0.2})`
        ctx.beginPath()
        ctx.arc(EARTH.cx, EARTH.cy, EARTH.rAtmoInner + 20, 0, Math.PI * 2)
        ctx.fill()
      }

      stateRef.current.particles = stateRef.current.particles.filter(p => {
        const alive = p.update()
        if (alive) p.draw(ctx)
        return alive
      })

      drawHeatTrappingArcs()
      requestAnimationFrame(animate)
    }

    const calculateTemperature = () => {
      const baseTemp = -18
      const co2Factor = Math.log(stateRef.current.co2 / 180) / Math.log(2)
      const co2Warming = co2Factor * 15
      const ch4Factor = stateRef.current.ch4 / 0.7
      const ch4Warming = (ch4Factor - 1) * 3
      const otherWarming = (stateRef.current.otherGHG / 20) * 2
      const solarFactor = stateRef.current.solarIntensity / 100
      let temp = baseTemp + (co2Warming + ch4Warming + otherWarming) * solarFactor
      temp += (Math.random() - 0.5) * 0.1
      stateRef.current.temperature = temp
      stateRef.current.trappedHeat = Math.max(0, (temp - baseTemp) * 2.5)

      setTemperature(temp)
      setTrappedHeat(stateRef.current.trappedHeat)
    }

    resizeCanvas()
    setTimeout(recalcGeometry, 500) // Small delay for rendering
    animate()

    const solarInterval = setInterval(emitSolarRadiation, 120)
    const infraredInterval = setInterval(emitInfraredFromSurface, 180)
    const tempInterval = setInterval(calculateTemperature, 500)

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('resize', recalcGeometry)

    // Stars
    if (starsContainerRef.current) {
      starsContainerRef.current.innerHTML = ''
      for (let i = 0; i < 80; i++) {
        const s = document.createElement('div')
        s.className = 'star'
        s.style.left = Math.random() * 100 + '%'
        s.style.top = Math.random() * 55 + '%'
        s.style.animationDelay = Math.random() * 4 + 's'
        const sz = Math.random() * 2.5 + 0.5
        s.style.width = sz + 'px'
        s.style.height = sz + 'px'
        starsContainerRef.current.appendChild(s)
      }
    }

    // Sun rays
    if (sunRaysRef.current) {
      sunRaysRef.current.innerHTML = ''
      for (let i = 0; i < 16; i++) {
        const ray = document.createElement('div')
        ray.className = 'sun-ray'
        ray.style.transform = `rotate(${i * 22.5}deg) translateY(-55px)`
        sunRaysRef.current.appendChild(ray)
      }
    }

    return () => {
      clearInterval(solarInterval)
      clearInterval(infraredInterval)
      clearInterval(tempInterval)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('resize', recalcGeometry)
    }
  }, [])

  const getInfoText = () => {
    const tempStr = temperature.toFixed(1);
    if (co2 <= 300) {
      return t("gh.info.stable").replace("{co2}", co2.toString()).replace("{temp}", tempStr);
    } else if (co2 <= 420) {
      return t("gh.info.modern").replace("{co2}", co2.toString()).replace("{temp}", tempStr);
    } else if (co2 <= 600) {
      return t("gh.info.danger").replace("{co2}", co2.toString()).replace("{temp}", tempStr);
    } else {
      return t("gh.info.extreme").replace("{co2}", co2.toString()).replace("{temp}", tempStr);
    }
  }

  const getTempClass = () => {
    if (temperature < 5) return 'cool';
    if (temperature < 16) return 'normal';
    if (temperature < 20) return 'warm';
    if (temperature < 25) return 'hot';
    return 'extreme';
  }

  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-4 text-white font-sans overflow-x-hidden">
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.9; }
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(255,215,0,0.6), 0 0 120px rgba(255,140,0,0.3); }
          50% { transform: scale(1.06); box-shadow: 0 0 80px rgba(255,215,0,0.8), 0 0 150px rgba(255,140,0,0.5); }
        }
        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.4;
          animation: twinkle 4s ease-in-out infinite;
        }
        .sun-ray {
          position: absolute;
          top: 50%; left: 50%;
          width: 3px; height: 22px;
          background: linear-gradient(to bottom, #ffd54f, transparent);
          transform-origin: center top;
          border-radius: 2px;
        }
        .temp-value.cool { color: #4dd0e1; }
        .temp-value.normal { color: #81c784; }
        .temp-value.warm { color: #ffb74d; }
        .temp-value.hot { color: #ef5350; }
        .temp-value.extreme { color: #d32f2f; text-shadow: 0 0 15px rgba(211,47,47,0.6); }
        
        .atmosphere.high-ghg {
          background: radial-gradient(circle at 30% 30%,
              rgba(255, 60, 20, 0.4) 0%,
              rgba(255, 100, 30, 0.25) 40%,
              rgba(255, 80, 40, 0.12) 70%,
              rgba(80, 120, 220, 0.06) 100%) !important;
          box-shadow: 
              0 0 90px rgba(255, 60, 20, 0.3),
              inset 0 0 60px rgba(255, 80, 30, 0.15) !important;
        }
      `}</style>

      <Link href="/experiments" className="absolute top-4 left-4 z-50">
        <Button variant="outline" size="sm" className="bg-slate-900/80 border-slate-700 text-cyan-400 hover:bg-slate-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("nav.backToExperiments")}
        </Button>
      </Link>

      <div className="container max-w-[950px] w-full bg-[#0a0a1a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden border border-[#1a1a3a]">
        <div className="header px-8 py-5 bg-gradient-to-r from-[#0f0f2e] to-[#1a1a4a] border-b border-[#2a2a5a] flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#ffd700] uppercase tracking-widest">☀️ {t("gh.title")}</h1>
          <div className="text-xs text-gray-500">{currentDate}</div>
        </div>

        <div className="simulation-area relative h-[520px] bg-gradient-to-b from-[#02020a] to-[#0a0a20] overflow-hidden" ref={simAreaRef}>
          <canvas id="particleCanvas" ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
          <div className="stars absolute inset-0 pointer-events-none z-[1]" ref={starsContainerRef} />

          <div className="sun-wrap absolute top-[30px] left-[50px] w-[100px] h-[100px] z-[2]">
            <div className="sun relative w-[75px] h-[75px] bg-[radial-gradient(circle_at_35%_35%,#fff176,#ffd700,#ff8f00,#e65100)] rounded-full shadow-[0_0_60px_rgba(255,215,0,0.6),0_0_120px_rgba(255,140,0,0.3),0_0_200px_rgba(255,87,34,0.1)] animate-[sunPulse_3s_ease-in-out_infinite] z-[3]">
              <div className="sun-rays absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] animate-[rotate_20s_linear_infinite] z-[2]" ref={sunRaysRef} />
            </div>
          </div>
          <div className="solar-label absolute top-[110px] left-[130px] color-[#ffd54f] text-[13px] font-bold rotate-[20deg] shadow-[0_0_10px_rgba(255,213,79,0.5)] z-[2]">Solar Radiation</div>

          <div className="earth-system absolute right-20 top-1/2 -translate-y-1/2 w-80 h-80 z-[2]" ref={earthSystemRef}>
            <div className={`atmosphere absolute inset-0 rounded-full transition-all duration-700 z-1 bg-[radial-gradient(circle_at_30%_30%,rgba(255,100,40,0.2)_0%,rgba(255,140,50,0.12)_40%,rgba(100,150,255,0.08)_70%,rgba(50,80,180,0.04)_100%)] shadow-[0_0_60px_rgba(255,100,50,0.1),inset_0_0_50px_rgba(255,140,50,0.06)] ${(co2 > 400 || ch4 > 2) ? 'high-ghg' : ''}`} id="atmosphere">
              <div className="absolute top-[8%] left-[20%] text-[11px] font-extrabold text-[#ffab76] drop-shadow-md z-10">CO₂</div>
              <div className="absolute top-[22%] left-[12%] text-[11px] font-extrabold text-[#ffe082] drop-shadow-md z-10">CH₄</div>
              <div className="absolute top-[38%] left-[18%] text-[11px] font-extrabold text-[#81d4fa] drop-shadow-md z-10">H₂O</div>
              <div className="absolute top-[54%] left-[12%] text-[11px] font-extrabold text-[#ce93d8] drop-shadow-md z-10">N₂O</div>
              <div className="absolute top-[70%] left-[20%] text-[11px] font-extrabold text-[#ef9a9a] drop-shadow-md z-10">CFC</div>
            </div>
            <div className="earth absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-[radial-gradient(circle_at_25%_25%,#5ab5e8_0%,#2a7ab8_40%,#1a5a98_70%,#0d3d70_100%)] overflow-hidden shadow-[inset_-25px_-25px_50px_rgba(0,0,0,0.5),inset_10px_10px_30px_rgba(255,255,255,0.1),0_0_30px_rgba(0,0,0,0.4)]">
              {/* Continents */}
              <div className="absolute w-[45px] h-[70px] top-[30%] left-[48%] rounded-[50%_40%_45%_55%] rotate-[-5deg] bg-gradient-to-br from-[#4a9a3a] to-[#3a7a2a] opacity-90" />
              <div className="absolute w-[35px] h-[28px] top-[22%] left-[45%] rounded-[60%_40%_50%_50%] bg-gradient-to-br from-[#4a9a3a] to-[#3a7a2a] opacity-90" />
              <div className="absolute w-[70px] h-[55px] top-[15%] left-[52%] rounded-[40%_60%_50%_40%] bg-gradient-to-br from-[#4a9a3a] to-[#3a7a2a] opacity-90" />
              <div className="absolute w-[45px] h-[50px] top-[18%] left-[12%] rounded-[50%_40%_45%_55%] rotate-[10deg] bg-gradient-to-br from-[#4a9a3a] to-[#3a7a2a] opacity-90" />
              <div className="absolute w-[30px] h-[55px] top-[45%] left-[22%] rounded-[45%_55%_50%_50%] rotate-[15deg] bg-gradient-to-br from-[#4a9a3a] to-[#3a7a2a] opacity-90" />
              <div className="absolute w-[30px] h-[22px] top-[62%] left-[65%] rounded-full bg-gradient-to-br from-[#4a9a3a] to-[#3a7a2a] opacity-90" />
              {/* Clouds */}
              <div className="absolute w-10 h-[18px] top-[25%] left-[35%] rounded-full bg-white/25" />
              <div className="absolute w-[30px] h-3.5 top-[45%] left-[55%] rounded-full bg-white/25" />
              <div className="absolute w-[35px] h-4 top-[60%] left-[30%] rounded-full bg-white/25" />
              <div className="absolute w-[25px] h-3 top-[35%] left-[70%] rounded-full bg-white/25" />
            </div>
          </div>

          <div className="temp-display absolute bottom-5 right-5 bg-black/60 p-4 rounded-[14px] border border-white/10 backdrop-blur-md z-[6]">
            <div className="text-[11px] text-gray-500 mb-1.5 uppercase tracking-wider">{t("gh.earthTemp")}</div>
            <div className={`temp-value text-4xl font-extrabold transition-colors duration-500 ${getTempClass()}`}>
              <span>{temperature.toFixed(1)}</span><span className="text-lg text-gray-500">°C</span>
            </div>
          </div>
        </div>

        <div className="controls p-7 bg-[#121230] border-t border-[#1e1e4a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="slider-group">
              <div className="flex justify-between mb-2 text-sm text-gray-400">
                <span className="font-semibold">🌡️ {t("gh.co2")}</span>
                <span className="text-[#ffd54f] font-bold">{co2} ppm</span>
              </div>
              <input type="range" min="180" max="800" value={co2} onChange={(e) => setCo2(parseInt(e.target.value))} step="10" className="w-full h-2 bg-gradient-to-r from-[#1e1e4a] to-[#3e3e8a] rounded-lg appearance-none cursor-pointer accent-[#ffd54f]" />
            </div>
            <div className="slider-group">
              <div className="flex justify-between mb-2 text-sm text-gray-400">
                <span className="font-semibold">🔥 {t("gh.methane")}</span>
                <span className="text-[#ffd54f] font-bold">{ch4.toFixed(1)} ppm</span>
              </div>
              <input type="range" min="0.3" max="4.0" value={ch4} onChange={(e) => setCh4(parseFloat(e.target.value))} step="0.1" className="w-full h-2 bg-gradient-to-r from-[#1e1e4a] to-[#3e3e8a] rounded-lg appearance-none cursor-pointer accent-[#ffd54f]" />
            </div>
            <div className="slider-group">
              <div className="flex justify-between mb-2 text-sm text-gray-400">
                <span className="font-semibold">☀️ {t("gh.solarIntensity")}</span>
                <span className="text-[#ffd54f] font-bold">{solarIntensity}%</span>
              </div>
              <input type="range" min="50" max="150" value={solarIntensity} onChange={(e) => setSolarIntensity(parseInt(e.target.value))} step="5" className="w-full h-2 bg-gradient-to-r from-[#1e1e4a] to-[#3e3e8a] rounded-lg appearance-none cursor-pointer accent-[#ffd54f]" />
            </div>
            <div className="slider-group">
              <div className="flex justify-between mb-2 text-sm text-gray-400">
                <span className="font-semibold">🏭 {t("gh.otherGHG")}</span>
                <span className="text-[#ffd54f] font-bold">
                  {[t("gh.level.vlow"), t("gh.level.low"), t("gh.level.medium"), t("gh.level.high"), t("gh.level.vhigh")][Math.min(Math.floor(otherGHG / 25), 4)]}
                </span>
              </div>
              <input type="range" min="0" max="100" value={otherGHG} onChange={(e) => setOtherGHG(parseInt(e.target.value))} step="5" className="w-full h-2 bg-gradient-to-r from-[#1e1e4a] to-[#3e3e8a] rounded-lg appearance-none cursor-pointer accent-[#ffd54f]" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <div className="stat-card bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] text-center hover:bg-white/[0.06] transition-all duration-300 border-l-[rgba(255,150,50,0.2)]">
              <div className="text-[10px] text-gray-600 uppercase tracking-[1.5px] mb-2">{t("gh.co2Level")}</div>
              <div className="text-2xl font-bold text-[#ffab76]">{co2}</div>
              <div className="text-[11px] text-gray-400">ppm</div>
            </div>
            <div className="stat-card bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] text-center hover:bg-white/[0.06] transition-all duration-300 border-l-[rgba(255,200,50,0.2)]">
              <div className="text-[10px] text-gray-600 uppercase tracking-[1.5px] mb-2">{t("gh.methane")}</div>
              <div className="text-2xl font-bold text-[#ffe082]">{ch4.toFixed(1)}</div>
              <div className="text-[11px] text-gray-400">ppm</div>
            </div>
            <div className="stat-card bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] text-center hover:bg-white/[0.06] transition-all duration-300 border-l-[rgba(255,68,68,0.2)]">
              <div className="text-[10px] text-gray-600 uppercase tracking-[1.5px] mb-2">{t("gh.heatTrapped")}</div>
              <div className="text-2xl font-bold text-[#ef5350]">{Math.min(95, Math.round(trappedHeat))}%</div>
              <div className="text-[11px] text-gray-800">{t("gh.ofRadiation")}</div>
            </div>
            <div className="stat-card bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] text-center hover:bg-white/[0.06] transition-all duration-300 border-l-[rgba(255,215,0,0.2)]">
              <div className="text-[10px] text-gray-600 uppercase tracking-[1.5px] mb-2">{t("gh.solarInput")}</div>
              <div className="text-2xl font-bold text-[#ffd54f]">{Math.round(340 * solarIntensity / 100)}</div>
              <div className="text-[11px] text-gray-800">W/m²</div>
            </div>
          </div>

          <div className="info-panel bg-black/20 p-5 rounded-xl mt-4 border-l-4 border-[#ffd54f]">
            <div className="text-sm font-bold text-[#ffd54f] mb-2">{t("gh.howItWorks")}</div>
            <div className="text-sm text-gray-300 leading-relaxed">
              {getInfoText()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
