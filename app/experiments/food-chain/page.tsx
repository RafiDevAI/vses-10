"use client"

import { useRef, useEffect, useCallback, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// ── Types ────────────────────────────────────────────
interface Entity {
  x: number; y: number; alive: boolean;
  ang: number; spd: number; tt: number;
}
interface Herb extends Entity { }
interface Hare extends Entity { energy: number; age: number; }
interface Wolf extends Entity { energy: number; age: number; }
interface History { h: number[]; r: number[]; w: number[]; }

// ── Constants ────────────────────────────────────────
const W = 500, H = 460, GW = 248, GH = 268, PAD = 14;

// ── Helpers ──────────────────────────────────────────
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const ri = (a: number, b: number) => Math.floor(rnd(a, b + 1));
const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const dst = (a: Entity, b: Entity) => Math.hypot(a.x - b.x, a.y - b.y);

function makeHerb(x?: number, y?: number): Herb {
  return {
    x: x ?? rnd(PAD, W - PAD), y: y ?? rnd(PAD, H - PAD), alive: true,
    ang: Math.random() * Math.PI * 2, spd: rnd(0.18, 0.42), tt: ri(20, 55)
  };
}
function makeHare(x?: number, y?: number): Hare {
  return {
    x: x ?? rnd(PAD, W - PAD), y: y ?? rnd(PAD, H - PAD), alive: true,
    energy: rnd(80, 120), age: 0, ang: Math.random() * Math.PI * 2,
    spd: rnd(1.0, 1.7), tt: ri(8, 24)
  };
}
function makeWolf(x?: number, y?: number): Wolf {
  return {
    x: x ?? rnd(PAD, W - PAD), y: y ?? rnd(PAD, H - PAD), alive: true,
    energy: rnd(120, 160), age: 0, ang: Math.random() * Math.PI * 2,
    spd: rnd(1.4, 2.0), tt: ri(10, 28)
  };
}

function wander(e: Entity) {
  e.tt--;
  if (e.tt <= 0) { e.ang += (Math.random() - 0.5) * 1.7; e.tt = ri(10, 38); }
  const nx = e.x + Math.cos(e.ang) * e.spd;
  const ny = e.y + Math.sin(e.ang) * e.spd;
  if (nx < PAD || nx > W - PAD) e.ang = Math.PI - e.ang;
  if (ny < PAD || ny > H - PAD) e.ang = -e.ang;
  e.x = cl(nx, PAD, W - PAD); e.y = cl(ny, PAD, H - PAD);
}

function makeInitialState() {
  return {
    herbs: Array.from({ length: 42 }, () => makeHerb()),
    hares: Array.from({ length: 18 }, () => makeHare()),
    wolves: Array.from({ length: 6 }, () => makeWolf()),
    hist: { h: [], r: [], w: [] } as History,
    tick: 0,
  };
}

// ── Step ─────────────────────────────────────────────
function step(
  herbs: Herb[], hares: Hare[], wolves: Wolf[],
  hist: History, tick: number
) {
  tick++;
  const hN = hares.length, wN = wolves.length, gN = herbs.length;

  // Herbs
  const minG = gN < 10 ? 3 : gN < 25 ? 2 : 1;
  for (let i = 0; i < minG; i++) if (herbs.length < 115) herbs.push(makeHerb());
  if (herbs.length < 115 && Math.random() < 0.07) herbs.push(makeHerb());
  for (const g of herbs) wander(g);

  // Hares
  const nH: Hare[] = [];
  for (const h of hares) {
    if (!h.alive) continue;
    h.age++;
    h.energy -= h.energy < 40 ? 0.15 : 0.38;

    let fw: Wolf | null = null, fd = 9999;
    for (const w of wolves) { const d = dst(h, w); if (d < 120 && d < fd) { fd = d; fw = w; } }
    if (fw) {
      h.ang = Math.atan2(h.y - fw.y, h.x - fw.x) + (Math.random() - 0.5) * 0.5;
      h.x = cl(h.x + Math.cos(h.ang) * h.spd * 1.5, PAD, W - PAD);
      h.y = cl(h.y + Math.sin(h.ang) * h.spd * 1.5, PAD, H - PAD);
    } else {
      let bg: Herb | null = null, bd = 9999;
      for (const g of herbs) { const d = dst(h, g); if (d < 90 && d < bd) { bd = d; bg = g; } }
      if (bg) h.ang = Math.atan2(bg.y - h.y, bg.x - h.x);
      wander(h);
    }

    let eg: Herb | null = null, ed = 9999;
    for (const g of herbs) { const d = dst(h, g); if (d < ed) { ed = d; eg = g; } }
    if (eg && ed < 20) { eg.alive = false; h.energy = Math.min(210, h.energy + 50); }

    const reproThresh = hN < 8 ? 120 : 168;
    const reproCost = hN < 8 ? 55 : 78;
    if (h.energy > reproThresh && hN + nH.length < 160) {
      h.energy -= reproCost;
      nH.push(makeHare(h.x + rnd(-22, 22), h.y + rnd(-22, 22)));
    }
    if (h.energy <= 0 || h.age > 580) h.alive = false;
  }
  const nextHares = hares.filter(h => h.alive).concat(nH);
  const nextHerbs = herbs.filter(g => g.alive);

  // Wolves
  const nW: Wolf[] = [];
  for (const w of wolves) {
    if (!w.alive) continue;
    w.age++;
    w.energy -= (wN <= 3 || w.energy < 60) ? 0.28 : 0.62;

    const huntChance = hN <= 2 ? 0.15 : hN <= 5 ? 0.35 : hN <= 10 ? 0.60 : hN <= 20 ? 0.80 : 0.95;
    const sightRange = hN <= 5 ? W * 0.22 : hN <= 15 ? W * 0.55 : W;

    let tg: Hare | null = null, td = 9999;
    for (const h of nextHares) { const d = dst(w, h); if (d < sightRange && d < td) { td = d; tg = h; } }

    if (tg) {
      w.ang = Math.atan2(tg.y - w.y, tg.x - w.x);
      w.x = cl(w.x + Math.cos(w.ang) * w.spd, PAD, W - PAD);
      w.y = cl(w.y + Math.sin(w.ang) * w.spd, PAD, H - PAD);
      if (td < 22 && Math.random() < huntChance) { tg.alive = false; w.energy = Math.min(260, w.energy + 90); }
    } else { wander(w); }

    const wRT = wN <= 3 ? 165 : 224;
    const wRC = wN <= 3 ? 80 : 108;
    if (w.energy > wRT && wN + nW.length < 50) {
      w.energy -= wRC;
      nW.push(makeWolf(w.x + rnd(-24, 24), w.y + rnd(-24, 24)));
    }
    if (w.energy <= 0 || w.age > 950) w.alive = false;
  }
  const nextWolves = wolves.filter(w => w.alive).concat(nW);
  const finalHares = nextHares.filter(h => h.alive);

  if (tick % 3 === 0) {
    hist.h.push(nextHerbs.length); hist.r.push(finalHares.length); hist.w.push(nextWolves.length);
    if (hist.h.length > 320) { hist.h.shift(); hist.r.shift(); hist.w.shift(); }
  }

  return { herbs: nextHerbs, hares: finalHares, wolves: nextWolves, hist, tick };
}

// ── Draw helpers ─────────────────────────────────────
function ebar(sx: CanvasRenderingContext2D, x: number, y: number, w: number, e: number, mx: number) {
  sx.fillStyle = '#ccc'; sx.fillRect(x, y, w, 3.5);
  const p = cl(e / mx, 0, 1);
  sx.fillStyle = p > 0.55 ? '#3db53d' : p > 0.28 ? '#f5a623' : '#e53935';
  sx.fillRect(x, y, w * p, 3.5);
}

function drawSim(sx: CanvasRenderingContext2D, herbs: Herb[], hares: Hare[], wolves: Wolf[]) {
  sx.fillStyle = '#dfc99a'; sx.fillRect(0, 0, W, H);
  sx.strokeStyle = 'rgba(0,0,0,0.04)'; sx.lineWidth = 1;
  for (let i = 0; i < W; i += 44) { sx.beginPath(); sx.moveTo(i, 0); sx.lineTo(i, H); sx.stroke(); }
  for (let j = 0; j < H; j += 44) { sx.beginPath(); sx.moveTo(0, j); sx.lineTo(W, j); sx.stroke(); }

  sx.font = '16px serif';
  for (const g of herbs) sx.fillText('🌿', g.x - 8, g.y + 6);
  sx.font = '18px serif';
  for (const h of hares) { sx.fillText('🐇', h.x - 9, h.y + 7); ebar(sx, h.x - 10, h.y + 9, 20, h.energy, 210); }
  sx.font = '22px serif';
  for (const w of wolves) { sx.fillText('🦊', w.x - 11, w.y + 8); ebar(sx, w.x - 12, w.y + 11, 24, w.energy, 260); }
}

function drawGraph(gx: CanvasRenderingContext2D, hist: History) {
  gx.fillStyle = '#fff'; gx.fillRect(0, 0, GW, GH);
  const P = { t: 8, b: 24, l: 28, r: 6 };
  const gw = GW - P.l - P.r, gh = GH - P.t - P.b;
  const n = hist.h.length;
  const mx = Math.max(20, ...hist.h, ...hist.r, ...hist.w);

  gx.strokeStyle = '#999'; gx.lineWidth = 1.2;
  gx.beginPath(); gx.moveTo(P.l, P.t); gx.lineTo(P.l, P.t + gh); gx.lineTo(P.l + gw, P.t + gh); gx.stroke();
  for (let i = 0; i <= 4; i++) {
    const y = P.t + (gh / 4) * i;
    gx.strokeStyle = '#eee'; gx.lineWidth = 0.8;
    gx.beginPath(); gx.moveTo(P.l + 1, y); gx.lineTo(P.l + gw, y); gx.stroke();
    gx.fillStyle = '#aaa'; gx.font = '8px sans-serif'; gx.textAlign = 'right';
    gx.fillText(String(Math.round(mx * (1 - i / 4))), P.l - 2, y + 3);
  }
  if (n < 2) return;
  const line = (data: number[], color: string) => {
    gx.beginPath(); gx.strokeStyle = color; gx.lineWidth = 1.8;
    data.forEach((v, i) => {
      const x = P.l + (i / (n - 1)) * gw;
      const y = P.t + gh - (v / mx) * gh;
      i === 0 ? gx.moveTo(x, y) : gx.lineTo(x, y);
    });
    gx.stroke();
  };
  line(hist.h, '#3db53d');
  line(hist.r, '#888');
  line(hist.w, '#b84a10');
}

// ── Component ─────────────────────────────────────────
export default function EcosystemSim() {
  const simRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(makeInitialState());
  const runningRef = useRef(false);
  const animRef = useRef<number>(0);

  const [counts, setCounts] = useState({ h: 42, r: 18, w: 6, tick: 0 });
  const [running, setRunning] = useState(false);
  const { t } = useLanguage();

  const render = useCallback(() => {
    const s = stateRef.current;
    const sx = simRef.current?.getContext('2d');
    const gx = graphRef.current?.getContext('2d');
    if (sx) drawSim(sx, s.herbs, s.hares, s.wolves);
    if (gx) drawGraph(gx, s.hist);
    setCounts({ h: s.herbs.length, r: s.hares.length, w: s.wolves.length, tick: s.tick });
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    const next = step(s.herbs, s.hares, s.wolves, s.hist, s.tick);
    stateRef.current = next;
    render();
    if (runningRef.current) animRef.current = requestAnimationFrame(loop);
  }, [render]);

  const toggleRun = useCallback((val: boolean) => {
    runningRef.current = val;
    setRunning(val);
    if (val) animRef.current = requestAnimationFrame(loop);
    else cancelAnimationFrame(animRef.current);
  }, [loop]);

  const reset = useCallback(() => {
    toggleRun(false);
    stateRef.current = makeInitialState();
    render();
  }, [toggleRun, render]);

  const eraseGraph = useCallback(() => {
    stateRef.current.hist = { h: [], r: [], w: [] };
    render();
  }, [render]);

  const addHare = () => { stateRef.current.hares.push(makeHare()); render(); };
  const remHare = () => { if (stateRef.current.hares.length > 1) { stateRef.current.hares.splice(ri(0, stateRef.current.hares.length - 1), 1); render(); } };
  const addWolf = () => { stateRef.current.wolves.push(makeWolf()); render(); };
  const remWolf = () => { if (stateRef.current.wolves.length > 1) { stateRef.current.wolves.splice(ri(0, stateRef.current.wolves.length - 1), 1); render(); } };

  useEffect(() => { render(); return () => cancelAnimationFrame(animRef.current); }, [render]);

  const btn = "px-4 py-2 border border-gray-400 bg-white rounded text-sm font-semibold hover:bg-gray-100 cursor-pointer";

  return (
    <div className="flex flex-col items-center p-3" style={{ background: '#c8c8c8', minHeight: '100vh' }}>
      <div style={{ width: 775 }}>

        {/* Main canvas + legend + graph */}
        <div className="flex" style={{ border: '2px solid #aaa', background: '#fff' }}>
          <canvas ref={simRef} width={W} height={H} style={{ display: 'block', flexShrink: 0 }} />
          <div className="flex flex-col gap-5 p-5" style={{ flex: 1, borderLeft: '2px solid #ccc', minWidth: 0 }}>
            {/* Legend */}
            <div className="flex flex-col gap-5">
              {[
                { color: '#3db53d', emoji: '🌿', count: counts.h },
                { color: '#888', emoji: '🐇', count: counts.r },
                { color: '#b84a10', emoji: '🦊', count: counts.w },
              ].map(({ color, emoji, count }) => (
                <div key={emoji} className="flex items-center gap-3">
                  <div style={{ width: 46, height: 3, background: color, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '1.35rem' }}>{emoji}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{count}</span>
                </div>
              ))}
            </div>
            <canvas ref={graphRef} width={GW} height={GH} style={{ border: '1px solid #bbb', display: 'block' }} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap px-3 py-2"
          style={{ background: '#efefef', border: '2px solid #aaa', borderTop: 'none' }}>
          <button className={btn} onClick={remHare}>{t("eco.hare")} −</button>
          <button className={btn} onClick={addHare}>{t("eco.hare")} +</button>
          <button className={btn} onClick={remWolf}>{t("eco.wolf")} −</button>
          <button className={btn} onClick={addWolf}>{t("eco.wolf")} +</button>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm px-3 py-2"
            style={{ border: '2px solid #1a73e8', borderRadius: 3, background: '#fff', userSelect: 'none' }}>
            <input type="checkbox" checked={running}
              onChange={e => toggleRun(e.target.checked)}
              style={{ accentColor: '#1a73e8', width: 16, height: 16, cursor: 'pointer' }} />
            {t("eco.run")}
          </label>

          <button className={btn} onClick={eraseGraph}>{t("eco.graphErase")}</button>
          <button className={btn} onClick={reset}>{t("exp.reset")}</button>

          <span className="ml-auto text-xs text-gray-500">
            {t("eco.tick")}: <b>{counts.tick}</b>
          </span>
        </div>
      </div>
    </div>
  );
}
