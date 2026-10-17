import { useMemo, useState } from 'react'
import { WandSparkles, Home, BedDouble, Bath, ChefHat, Sofa, Check, ArrowRight, RefreshCw, Download, Info } from 'lucide-react'

const palette = { living: '#dce8d4', bedroom: '#dce4f4', kitchen: '#f2dfc8', bathroom: '#d5e9e8', dining: '#f0dce8', study: '#e6def5' }
const labels = { living: 'Living room', bedroom: 'Bedroom', kitchen: 'Kitchen', bathroom: 'Bathroom', dining: 'Dining', study: 'Study' }
const GRID = 20
const CANVAS_W = 900
const CANVAS_H = 560

function makeLayout({ bedrooms, bathrooms, plotWidth, plotDepth, style }, variant) {
  const pad = 24
  const usableW = Math.max(360, Math.min(900, plotWidth * GRID) - pad * 2)
  const usableH = Math.max(280, Math.min(560, plotDepth * GRID) - pad * 2)
  const roomSpecs = [
    { type: 'living', name: 'Living room' },
    { type: 'kitchen', name: 'Kitchen' },
    { type: 'dining', name: 'Dining' },
    ...Array.from({ length: bedrooms }, (_, i) => ({ type: 'bedroom', name: 'Bedroom ' + (i + 1) })),
    ...Array.from({ length: bathrooms }, (_, i) => ({ type: 'bathroom', name: 'Bathroom ' + (i + 1) })),
  ]
  if (style === 'compact') roomSpecs.splice(3, 0, { type: 'study', name: 'Study nook' })
  const columns = [3, 2, 4][variant]
  const rows = Math.ceil(roomSpecs.length / columns)
  const gap = 8
  const cellW = (usableW - gap * (columns - 1)) / columns
  const cellH = (usableH - gap * (rows - 1)) / rows
  const rooms = roomSpecs.map((spec, index) => {
    const row = Math.floor(index / columns)
    const column = variant === 1 && row % 2 === 1 ? columns - 1 - (index % columns) : index % columns
    const aspect = spec.type === 'living' ? 1.12 : spec.type === 'bedroom' ? 1.0 : 0.92
    const w = Math.min(cellW, cellH * aspect * (variant === 2 ? 1.05 : 1))
    const h = Math.min(cellH, cellW / aspect)
    const x = pad + column * (cellW + gap) + (cellW - w) / 2
    const y = pad + row * (cellH + gap) + (cellH - h) / 2
    return { id: spec.type + '-' + index, type: spec.type, name: spec.name, x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h), fill: palette[spec.type] || '#e6def5' }
  })
  const title = ['Balanced family layout', 'Open social layout', 'Bedroom-wing layout'][variant]
  const note = ['Rooms are arranged in a balanced grid for straightforward circulation planning.', 'A compact two-column arrangement keeps the concept easy to read and compare.', 'A wider four-column arrangement groups rooms into a more segmented layout.'][variant]
  return { id: 'layout-' + variant, title, style, rooms, area: rooms.reduce((sum, r) => sum + (r.w / GRID) * (r.h / GRID), 0), plotWidth, plotDepth, note }
}

export default function AIPlanGenerator({ onOpenPlanner }) {
  const [plotWidth, setPlotWidth] = useState(40)
  const [plotDepth, setPlotDepth] = useState(28)
  const [bedrooms, setBedrooms] = useState(2)
  const [bathrooms, setBathrooms] = useState(2)
  const [style, setStyle] = useState('balanced')
  const [layouts, setLayouts] = useState(() => [0,1,2].map(v => makeLayout({ bedrooms: 2, bathrooms: 2, plotWidth: 40, plotDepth: 28, style: 'balanced' }, v)))
  const [selected, setSelected] = useState(0)
  const [generated, setGenerated] = useState(false)
  const generate = () => { setLayouts([0,1,2].map(v => makeLayout({ bedrooms, bathrooms, plotWidth, plotDepth, style }, v))); setSelected(0); setGenerated(true) }
  const active = layouts[selected]
  const exportLayout = () => {
    const data = { app: 'GharVision', feature: 'Phase 04 AI Floor Plan Generator', method: 'rule-based concept generator (not a trained AI model)', plot: { widthFeet: plotWidth, depthFeet: plotDepth }, layout: active }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = 'gharvision-generated-layout.json'; document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="ai-planner-page">
    <header className="ai-planner-heading"><div><p className="eyebrow"><WandSparkles size={14}/> DESIGN STUDIO · PHASE 04</p><h1>AI floor plan generator <span className="wave">✳</span></h1><p className="heading-subtitle">Explore three concept layouts, compare their flow, then open your favourite in the editable floor planner.</p></div><button className="filter-button" onClick={generate}><RefreshCw size={15}/> Regenerate</button></header>
    <section className="ai-planner-controls">
      <div><label>Plot width <span>ft</span><input type="number" min="20" max="45" value={plotWidth} onChange={e => setPlotWidth(Math.max(20, Math.min(45, Number(e.target.value) || 20)))}/></label><label>Plot depth <span>ft</span><input type="number" min="18" max="28" value={plotDepth} onChange={e => setPlotDepth(Math.max(18, Math.min(28, Number(e.target.value) || 18)))}/></label></div>
      <div><label>Bedrooms<select value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))}><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option></select></label><label>Bathrooms<select value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))}><option value="1">1 bathroom</option><option value="2">2 bathrooms</option><option value="3">3 bathrooms</option></select></label></div>
      <div><label>Layout preference<select value={style} onChange={e => setStyle(e.target.value)}><option value="balanced">Balanced family</option><option value="open">Open and social</option><option value="compact">Compact footprint</option></select></label><button className="primary-button" onClick={generate}><WandSparkles size={16}/> Generate 3 layouts</button></div>
    </section>
    <div className="ai-planner-results"><section className="ai-layout-preview"><div className="ai-layout-title"><div><span className="eyebrow">SELECTED CONCEPT</span><h2>{active.title}</h2></div><span className="ai-layout-count">{active.rooms.length} rooms</span></div>
      <div className="ai-canvas-wrap"><svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-label="Generated concept floor plan"><defs><pattern id="ai-grid" width={GRID} height={GRID} patternUnits="userSpaceOnUse"><path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="var(--planner-grid)" strokeWidth=".8"/></pattern></defs><rect width={CANVAS_W} height={CANVAS_H} fill="var(--planner-canvas)"/><rect width={CANVAS_W} height={CANVAS_H} fill="url(#ai-grid)"/>{active.rooms.map(r => <g key={r.id}><rect x={r.x} y={r.y} width={r.w} height={r.h} rx="3" fill={r.fill} stroke="#fff" strokeWidth="2"/><text x={r.x+r.w/2} y={r.y+r.h/2-4} fontSize="13" textAnchor="middle" fill="#344136" fontWeight="600">{r.name}</text><text x={r.x+r.w/2} y={r.y+r.h/2+13} fontSize="10" textAnchor="middle" fill="#4d5b4b">{Math.round((r.w/GRID)*(r.h/GRID))} sq ft</text></g>)}</svg></div>
      <div className="ai-layout-note"><Info size={15}/><span>{active.note} Estimated room area: <strong>{Math.round(active.area).toLocaleString('en-IN')} sq ft</strong>.</span></div>
      <div className="ai-actions"><button className="primary-button" onClick={() => onOpenPlanner(active.rooms, { width: plotWidth, depth: plotDepth })}><ArrowRight size={16}/> Edit this layout in Floor Planner</button><button className="filter-button" onClick={exportLayout}><Download size={15}/> Export JSON</button></div>
    </section>
    <aside className="ai-layout-options"><div className="planner-panel-heading"><div><span className="eyebrow">COMPARE OPTIONS</span><h3>Choose a layout</h3></div></div>{layouts.map((layout, index) => <button key={layout.id} className={selected === index ? 'ai-layout-option selected' : 'ai-layout-option'} onClick={() => setSelected(index)}><div className="ai-option-top"><span className="ai-option-number">0{index+1}</span><span className="ai-option-check">{selected === index ? <Check size={14}/> : null}</span></div><strong>{layout.title}</strong><p>{layout.note}</p><span className="ai-option-meta">{layout.rooms.length} rooms · {Math.round(layout.area)} sq ft</span></button>)}</aside></div>
    <p className="planner-disclaimer">Important: this is a rule-based concept generator, not a trained AI model or construction-ready plan. It does not verify structural engineering, doors, windows, plumbing, setbacks or local building codes. Have a qualified architect review any design before building.</p>
    {generated && <p className="ai-generated-status"><Check size={14}/> Three layouts generated from your latest settings.</p>}
  </div>
}
