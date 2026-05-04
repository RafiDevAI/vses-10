"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState, useCallback } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

// ── Types ──────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; r: number; a: number; dr: number; da: number; sx: number; sy: number; }
interface Sparkle { x: number; y: number; sz: number; ph: number; sp: number; }
interface Burst { x: number; y: number; vx: number; vy: number; a: number; r: number; }
interface Rain { x: number; y: number; vy: number; len: number; a: number; }

const W = 800, H = 450;
const TURB_DEFS = [{ cx: 508, by: 382, bl: 58, sp: 1.0 }, { cx: 555, by: 382, bl: 68, sp: .82 }, { cx: 600, by: 382, bl: 60, sp: 1.18 }];
const SMOKE_SRC: ([number, number, number])[] = [[188, 216, 24], [230, 246, 17], [262, 270, 13]];

function mkSmoke(sx: number, sy: number): Particle {
  return { sx, sy, x: sx + (Math.random() - .5) * 5, y: sy, vx: (Math.random() - .5) * .45, vy: -(0.55 + Math.random() * .55), r: 7 + Math.random() * 6, a: .45 + Math.random() * .2, dr: .11 + Math.random() * .12, da: .004 + Math.random() * .002 };
}
function resetSmoke(p: Particle) {
  p.x = p.sx + (Math.random() - .5) * 5; p.y = p.sy;
  p.vx = (Math.random() - .5) * .45; p.vy = -(0.55 + Math.random() * .55);
  p.r = 7 + Math.random() * 6; p.a = .45 + Math.random() * .2;
  p.dr = .11 + Math.random() * .12; p.da = .004 + Math.random() * .002;
}
function tickSmoke(p: Particle) { p.x += p.vx; p.y += p.vy; p.r += p.dr; p.a -= p.da; if (p.a <= 0) resetSmoke(p); }

function mkSparkle(): Sparkle {
  return { x: W / 2 + 25 + Math.random() * (W / 2 - 55), y: 65 + Math.random() * 280, sz: 1.8 + Math.random() * 2.8, ph: Math.random() * Math.PI * 2, sp: .022 + Math.random() * .028 };
}
function mkBurst(x: number, y: number): Burst {
  const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 3;
  return { x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, a: 1, r: 2 + Math.random() * 3 };
}
function mkRain(): Rain {
  return { x: Math.random() * W / 2, y: -10, vy: 6 + Math.random() * 4, len: 10 + Math.random() * 8, a: .3 + Math.random() * .3 };
}

function chimney(ctx: CanvasRenderingContext2D, cx: number, y: number, w: number, h: number, striped: boolean) {
  const x = cx - w / 2;
  if (striped) { const sh = h / 7; for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 === 0 ? '#c0392b' : '#ecf0f1'; ctx.fillRect(x, y + i * sh, w, sh); } }
  else { ctx.fillStyle = '#616161'; ctx.fillRect(x, y, w, h); }
  ctx.fillStyle = '#424242'; ctx.fillRect(x - 2, y - 4, w + 4, 5);
}
function deadTree(ctx: CanvasRenderingContext2D, x: number, y: number, sc: number) {
  ctx.strokeStyle = '#6d4c41'; ctx.lineCap = 'round';
  ctx.lineWidth = 3 * sc; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 58 * sc); ctx.stroke();
  ctx.lineWidth = 1.8 * sc;
  ([[-20, .38, -13], [18, .46, -11], [-12, .55, -8], [14, .65, -7]] as [number, number, number][]).forEach(([dx, p, dy]) => {
    ctx.beginPath(); ctx.moveTo(x, y - 58 * sc * p); ctx.lineTo(x + dx * sc, y - 58 * sc * p + dy * sc); ctx.stroke();
  });
}
function gTree(ctx: CanvasRenderingContext2D, x: number, y: number, sc: number) {
  ctx.fillStyle = '#4e342e'; ctx.fillRect(x - 4 * sc, y, 8 * sc, 22 * sc);
  ctx.fillStyle = '#1b5e20'; ctx.beginPath(); ctx.arc(x, y - 14 * sc, 26 * sc, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2e7d32'; ctx.beginPath(); ctx.arc(x - 12 * sc, y - 7 * sc, 19 * sc, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 12 * sc, y - 7 * sc, 19 * sc, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#43a047'; ctx.beginPath(); ctx.arc(x, y - 19 * sc, 21 * sc, 0, Math.PI * 2); ctx.fill();
}
function solar(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#0d47a1'; ctx.fillRect(x, y, 22, 36);
  ctx.strokeStyle = '#5c6bc0'; ctx.lineWidth = .7;
  ctx.beginPath(); ctx.moveTo(x + 11, y); ctx.lineTo(x + 11, y + 36); ctx.stroke();
  for (let r = 1; r < 3; r++) { ctx.beginPath(); ctx.moveTo(x, y + r * 12); ctx.lineTo(x + 22, y + r * 12); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(x + 2, y + 2, 7, 5);
}
function drawTurbine(ctx: CanvasRenderingContext2D, idx: number, tAng: number, bal: number, windBoost: number, hovTurb: number, night: boolean) {
  const { cx, by, bl, sp } = TURB_DEFS[idx];
  const ci = bal / 100;
  const spd = (0.3 + ci * 1.7) * (windBoost > 0 ? 2.5 : 1) * (hovTurb === idx ? 2 : 1);
  ctx.fillStyle = night ? '#9e9e9e' : '#bdbdbd'; ctx.fillRect(cx - 3, by - 145, 6, 145);
  ctx.fillStyle = night ? '#616161' : '#e0e0e0';
  ctx.beginPath(); (ctx as any).roundRect(cx - 9, by - 153, 18, 13, 4); ctx.fill();
  for (let j = 0; j < 3; j++) {
    const a = tAng * sp * spd + j * (Math.PI * 2 / 3);
    ctx.save(); ctx.translate(cx, by - 147); ctx.rotate(a);
    ctx.fillStyle = hovTurb === idx ? '#b9f6ca' : '#66bb6a'; ctx.strokeStyle = '#388e3c'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(7, -9, 5, -bl * .65, 2, -bl); ctx.bezierCurveTo(-2, -bl, -7, -9, 0, 0);
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  ctx.fillStyle = '#9e9e9e'; ctx.beginPath(); ctx.arc(cx, by - 147, 5.5, 0, Math.PI * 2); ctx.fill();
}

function EnergySimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    bal: 50, factOn: true, night: false, windBoost: 0, rain: false,
    smokes: [] as Particle[], sparks: [] as Sparkle[],
    bursts: [] as Burst[], rainDrops: [] as Rain[],
    tAng: 0, hovTurb: -1,
  });
  const [bal, setBal] = useState(50);
  const [factOn, setFactOn] = useState(true);
  const [night, setNight] = useState(false);
  const [rain, setRain] = useState(false);
  const [windAct, setWindAct] = useState(false);
  const [co2, setCo2] = useState(380);

  useEffect(() => {
    const s = stateRef.current;
    SMOKE_SRC.forEach(([sx, sy, n]) => {
      for (let i = 0; i < n; i++) { const p = mkSmoke(sx, sy); for (let j = 0; j < Math.floor(Math.random() * 90); j++)tickSmoke(p); s.smokes.push(p); }
    });
    for (let i = 0; i < 22; i++) s.sparks.push(mkSparkle());
  }, []);

  useEffect(() => { stateRef.current.bal = bal; updateCo2(bal, stateRef.current.factOn); }, [bal]);
  useEffect(() => { stateRef.current.factOn = factOn; updateCo2(stateRef.current.bal, factOn); }, [factOn]);
  useEffect(() => { stateRef.current.night = night; }, [night]);
  useEffect(() => { stateRef.current.rain = rain; }, [rain]);

  function updateCo2(b: number, f: boolean) {
    const base = 450 - (b / 100) * 170;
    setCo2(Math.round(Math.max(280, Math.min(450, base - (f ? 0 : 30)))));
  }

  const resize = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return;
    const s = Math.min(window.innerWidth * .97 / W, (window.innerHeight - 140) * .95 / H);
    cv.style.width = (W * s) + 'px'; cv.style.height = (H * s) + 'px';
  }, []);
  useEffect(() => { resize(); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, [resize]);

  const getXY = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return [(e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height)];
  };
  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const [mx, my] = getXY(e);
    let hov = -1;
    TURB_DEFS.forEach(({ cx, by, bl }, i) => { if (Math.abs(mx - cx) < bl + 10 && my > by - 145 - bl && my < by) hov = i; });
    stateRef.current.hovTurb = hov;
    canvasRef.current!.style.cursor = (hov >= 0 || mx < W / 2) ? 'pointer' : 'default';
  };
  const onLeave = () => { stateRef.current.hovTurb = -1; };
  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const [x] = getXY(e);
    if (x < W / 2) { setFactOn(p => !p); }
    else { const [bx, by] = getXY(e); for (let i = 0; i < 25; i++) stateRef.current.bursts.push(mkBurst(bx, by)); }
  };

  const toggleRain = () => {
    const s = stateRef.current;
    if (!s.rain) { s.rain = true; setRain(true); for (let i = 0; i < 80; i++) { const d = mkRain(); d.y = Math.random() * H; s.rainDrops.push(d); } }
    else { s.rain = false; setRain(false); s.rainDrops = []; }
  };
  const doWindBoost = () => {
    stateRef.current.windBoost = 200; setWindAct(true); setTimeout(() => setWindAct(false), 2000);
    for (let i = 0; i < 35; i++) stateRef.current.bursts.push(mkBurst(W / 2 + 50 + Math.random() * (W / 2 - 100), 80 + Math.random() * 260));
  };

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    let af = 0;
    function frame() {
      const s = stateRef.current;
      const { bal, factOn: fOn, night: nt, windBoost: wb } = s;
      const si = fOn ? (1 - bal / 100) : 0, ci = bal / 100;
      ctx.clearRect(0, 0, W, H);

      let g = ctx.createLinearGradient(0, 0, 0, H);
      if (nt) { g.addColorStop(0, si > .4 ? '#2e1010' : '#1a1020'); g.addColorStop(1, '#120808'); }
      else { g.addColorStop(0, `rgb(${232 - si * 25},${168 - si * 35},${156 - si * 20})`); g.addColorStop(1, '#ca7b70'); }
      ctx.fillStyle = g; ctx.fillRect(0, 0, W / 2, H);
      ctx.fillStyle = nt ? '#3a1a10' : '#8d6e63'; ctx.fillRect(0, 390, W / 2, 60);
      ctx.fillStyle = nt ? '#2a1008' : '#795548'; ctx.fillRect(0, 390, W / 2, 8);
      ctx.fillStyle = nt ? 'rgba(160,120,110,.5)' : 'rgba(255,255,255,.9)';
      ctx.beginPath(); ctx.ellipse(200, 305, 162, 108, 0, 0, Math.PI * 2); ctx.fill();
      deadTree(ctx, 82, 388, .78); deadTree(ctx, 108, 386, .57); deadTree(ctx, 325, 386, .82); deadTree(ctx, 350, 387, .62);

      ctx.save(); ctx.globalAlpha = fOn ? 1 : .45;
      ctx.fillStyle = '#e53935'; ctx.fillRect(128, 342, 24, 50); ctx.fillRect(285, 355, 20, 37);
      ctx.fillStyle = '#ef5350'; ctx.fillRect(148, 318, 138, 74);
      ctx.fillStyle = '#d32f2f'; ctx.fillRect(148, 318, 138, 8);
      ctx.fillStyle = 'rgba(255,228,210,.82)';
      for (let r = 0; r < 2; r++)for (let c = 0; c < 3; c++)ctx.fillRect(160 + c * 40, 330 + r * 26, 26, 17);
      ctx.fillStyle = '#b71c1c'; ctx.fillRect(200, 360, 24, 32);
      ctx.restore();

      chimney(ctx, 188, 216, 22, 102, true); chimney(ctx, 230, 248, 16, 70, false); chimney(ctx, 262, 270, 12, 48, false);

      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2, H); ctx.clip();
      s.smokes.forEach(p => { tickSmoke(p); const a = Math.max(0, p.a) * si; if (a > 0.01) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#7a7a7a'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } });
      if (s.rain) { s.rainDrops.forEach(d => { d.y += d.vy; if (d.y > H + 20) { d.x = Math.random() * W / 2; d.y = -10; } ctx.save(); ctx.globalAlpha = d.a; ctx.strokeStyle = '#90caf9'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 2, d.y + d.len); ctx.stroke(); ctx.restore(); }); }
      ctx.restore();

      const hz = ctx.createLinearGradient(0, 0, 0, 260); hz.addColorStop(0, `rgba(120,60,50,${si * .25})`); hz.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = hz; ctx.fillRect(0, 0, W / 2, 260);
      if (nt) { for (let i = 0; i < 12; i++) { ctx.fillStyle = `rgba(255,240,200,${.3 + Math.sin(Date.now() * .001 + i) * .2})`; ctx.beginPath(); ctx.arc((i * 97) % 180 + 10, (i * 61) % 120 + 20, 1, 0, Math.PI * 2); ctx.fill(); } }

      ctx.textAlign = 'center';
      ctx.fillStyle = nt ? '#ffcdd2' : '#5d1f1f'; ctx.font = 'bold 17px "Segoe UI",sans-serif'; ctx.fillText("POLLUTION ENERGY", 200, 34);
      ctx.font = '600 12px "Segoe UI",sans-serif'; ctx.fillStyle = nt ? '#ef9a9a' : '#7b3030'; ctx.fillText("NON-RENEWABLE SOURCE", 200, 51);
      ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '11px sans-serif'; ctx.fillText("Click left to toggle factory", 200, 434);

      g = ctx.createLinearGradient(W / 2, 0, W / 2, H);
      if (nt) { g.addColorStop(0, '#0d2010'); g.addColorStop(1, '#0a180c'); }
      else { g.addColorStop(0, '#c8e6c0'); g.addColorStop(1, '#a5d6a7'); }
      ctx.fillStyle = g; ctx.fillRect(W / 2, 0, W / 2, H);
      ctx.fillStyle = nt ? '#1a4020' : '#388e3c'; ctx.fillRect(W / 2, 385, W / 2, 65);
      ctx.fillStyle = nt ? '#122e18' : '#2e7d32'; ctx.fillRect(W / 2, 385, W / 2, 9);
      ctx.fillStyle = nt ? 'rgba(60,100,60,.55)' : 'rgba(255,255,255,.88)'; ctx.beginPath(); ctx.ellipse(600, 305, 162, 108, 0, 0, Math.PI * 2); ctx.fill();

      for (let i = 0; i < 3; i++) drawTurbine(ctx, i, s.tAng, bal, wb, s.hovTurb, nt);

      ctx.fillStyle = nt ? '#2e5e32' : '#81c784'; ctx.fillRect(620, 315, 95, 70);
      ctx.fillStyle = nt ? '#1a4020' : '#66bb6a'; ctx.fillRect(620, 308, 95, 10);
      ctx.fillStyle = nt ? 'rgba(255,230,100,.55)' : 'rgba(255,255,255,.72)';
      for (let r = 0; r < 2; r++)for (let c = 0; c < 3; c++)ctx.fillRect(628 + c * 28, 323 + r * 22, 21, 14);
      solar(ctx, 718, 328); solar(ctx, 744, 328); solar(ctx, 770, 328);
      gTree(ctx, 440, 357, .88); gTree(ctx, 466, 353, 1.02); gTree(ctx, 748, 353, .92); gTree(ctx, 774, 358, .76);

      s.sparks.forEach(sp => { sp.ph += sp.sp * (0.5 + ci); const a = (Math.sin(sp.ph) + 1) / 2 * ci; if (a > .05) { ctx.save(); ctx.globalAlpha = a * .9; ctx.fillStyle = '#fff9c4'; ctx.translate(sp.x, sp.y); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sp.sz * .35, sp.sz * .3); ctx.lineTo(0, sp.sz * 2.8); ctx.lineTo(-sp.sz * .35, sp.sz * .3); ctx.closePath(); ctx.fill(); ctx.rotate(Math.PI / 2); } ctx.restore(); } });

      if (nt) {
        for (let i = 0; i < 16; i++) { ctx.fillStyle = `rgba(180,255,180,${.3 + Math.sin(Date.now() * .001 + i * 1.3) * .2})`; ctx.beginPath(); ctx.arc(W / 2 + 20 + (i * 113) % 360, (i * 73) % 130 + 15, 1.2, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,255,210,.9)'; ctx.beginPath(); ctx.arc(658, 36, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0d2010'; ctx.beginPath(); ctx.arc(667, 31, 14, 0, Math.PI * 2); ctx.fill();
      }

      s.bursts = s.bursts.filter(p => p.a > 0);
      s.bursts.forEach(p => { p.x += p.vx; p.y += p.vy; p.a -= .025; ctx.save(); ctx.globalAlpha = p.a; ctx.fillStyle = '#e8f5e9'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });

      if (s.hovTurb >= 0) { const { cx, by } = TURB_DEFS[s.hovTurb]; ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.beginPath(); (ctx as any).roundRect(cx - 50, by - 178, 100, 24, 6); ctx.fill(); ctx.fillStyle = '#b9f6ca'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText("⚡ Speed boosted!", cx, by - 162); }

      ctx.textAlign = 'center';
      ctx.fillStyle = nt ? '#c8e6c9' : '#1a5e1e'; ctx.font = 'bold 17px "Segoe UI",sans-serif'; ctx.fillText("CLEAN ENERGY", 600, 34);
      ctx.font = '600 12px "Segoe UI",sans-serif'; ctx.fillStyle = nt ? '#a5d6a7' : '#2e7d32'; ctx.fillText("RENEWABLE SOURCE", 600, 51);
      ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '11px sans-serif'; ctx.fillText("Click right for burst · Hover turbines", 600, 434);

      ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();

      s.tAng += .013;
      if (s.windBoost > 0) s.windBoost--;
      af = requestAnimationFrame(frame);
    }
    af = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(af);
  }, []);

  const co2Pct = ((co2 - 280) / (450 - 280)) * 100;
  const barColor = `hsl(${120 - co2Pct * 1.2},80%,45%)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <canvas ref={canvasRef} width={W} height={H}
        style={{ borderRadius: '12px 12px 0 0', maxWidth: '100%', display: 'block' }}
        onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} />
      <div style={{ background: '#1e1e2e', borderRadius: '0 0 12px 12px', padding: '14px 20px', width: '100%', maxWidth: canvasRef.current?.style.width || `${W}px`, display: 'flex', flexDirection: 'column', gap: 11, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Atmospheric CO₂</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              {co2} <span style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>ppm</span>
            </div>
            <div style={{ height: 7, background: '#2a2a3a', borderRadius: 4, marginTop: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${co2Pct}%`, background: barColor, borderRadius: 4, transition: 'width .35s,background .35s' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: factOn ? "🏭 Factory ON" : "🏭 Factory OFF", bg: factOn ? '#ef5350' : '#555', fn: () => setFactOn(p => !p) },
              { label: windAct ? "💨 Boosted!" : "💨 Wind Boost", bg: '#1976d2', fn: doWindBoost },
              { label: rain ? "☀️ Clear" : "🌧 Rain", bg: '#00838f', fn: toggleRain },
              { label: night ? "☀️ Day" : "🌙 Night", bg: '#4527a0', fn: () => setNight(p => !p) },
            ].map((b, i) => (
              <button key={i} onClick={b.fn} style={{ padding: '7px 13px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, background: b.bg, color: '#fff', whiteSpace: 'nowrap' }}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>🏭 Polluted</span>
          <input type="range" min={0} max={100} value={bal} onChange={e => setBal(+e.target.value)}
            style={{ flex: 1, accentColor: '#66bb6a', cursor: 'pointer', height: 4 }} />
          <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>🌱 Clean</span>
        </div>
      </div>
    </div>
  );
}

function RenewableEnergyPage() {

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/experiments">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experiments
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Renewable Energy Simulator</h1>
              <p className="text-slate-400 mt-1">Compare clean vs polluting energy sources interactively</p>
            </div>
          </div>
          <div
            className="hidden sm:flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.4)', color: '#4ade80' }}
          >
            Environmental Science
          </div>
        </div>

        {/* Two-column layout: simulation + info panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Simulation — spans 3 cols */}
          <div className="lg:col-span-3">
            <EnergySimulation />
          </div>

          {/* Right Info Panel */}
          <div className="space-y-4">
            {/* What is happening */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                🌱 How It Works
              </h3>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  <span className="text-red-400 font-semibold">Left side</span> shows a fossil fuel factory emitting CO₂ through chimneys. Toggle it on/off by clicking.
                </p>
                <p>
                  <span className="text-green-400 font-semibold">Right side</span> shows wind turbines and solar panels producing clean, renewable electricity.
                </p>
                <p>
                  Use the slider to shift the balance between polluting and clean energy sources.
                </p>
              </div>
            </div>

            {/* Controls guide */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="text-sm font-bold text-cyan-400 mb-3">🎮 Interactive Controls</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-slate-200 font-semibold w-20 shrink-0">🏭 Factory</span>
                  <span>Toggle factory on/off to see CO₂ changes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-200 font-semibold w-20 shrink-0">💨 Wind</span>
                  <span>Boost turbine speed with a wind surge</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-200 font-semibold w-20 shrink-0">🌧 Rain</span>
                  <span>Toggle rain effect over the factory</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-200 font-semibold w-20 shrink-0">🌙 Night</span>
                  <span>Switch to night mode to see lighting</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-200 font-semibold w-20 shrink-0">🖱 Click</span>
                  <span>Click turbines to boost them individually</span>
                </div>
              </div>
            </div>

            {/* Key facts */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
              <h3 className="text-sm font-bold text-yellow-400 mb-3">⚡ Key Facts</h3>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>🌬️ Wind power produces zero direct emissions.</p>
                <p>☀️ Solar panels work even on cloudy days.</p>
                <p>🏭 CO₂ levels above 420 ppm exceed safe planetary limits.</p>
                <p>🌍 Renewable energy could power 80% of the world by 2050.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(RenewableEnergyPage), { ssr: false })
