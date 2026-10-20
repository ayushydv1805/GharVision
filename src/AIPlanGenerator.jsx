import { useMemo, useState } from 'react'
import { WandSparkles, Home, BedDouble, Bath, ChefHat, Sofa, Check, ArrowRight, RefreshCw, Download, Info, CarFront, BookOpen, Flower2, Utensils, Sparkles } from 'lucide-react'

const palette = { living: '#dce8d4', bedroom: '#dce4f4', kitchen: '#f2dfc8', bathroom: '#d5e9e8', dining: '#f0dce8', study: '#e6def5', parking: '#e4e7eb', puja: '#f4e4c9', store: '#e9e2d9' }
const GRID = 20, CANVAS_W = 900, CANVAS_H = 900
const ROOM_LIBRARY = {
  living: { label: 'Living room', w: 12, h: 12, fill: palette.living },
  kitchen: { label: 'Kitchen', w: 8, h: 8, fill: palette.kitchen },
  dining: { label: 'Dining room', w: 9, h: 8, fill: palette.dining },
  bedroom: { label: 'Bedroom', w: 10, h: 10, fill: palette.bedroom },
  bathroom: { label: 'Bathroom', w: 5, h: 7, fill: palette.bathroom },
  study: { label: 'Study', w: 7, h: 8, fill: palette.study },
  parking: { label: 'Parking', w: 9, h: 16, fill: palette.parking },
  puja: { label: 'Puja room', w: 4, h: 5, fill: palette.puja },
  store: { label: 'Store room', w: 5, h: 6, fill: palette.store },
}
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

function buildLayout({ plotWidth, plotDepth, bedrooms, bathrooms, study, dining, parking, puja, store, preference, name }, variant) {
  const width = plotWidth, depth = plotDepth
  const rooms = []
  const specs = [
    { type: 'living', name: 'Living room', w: 12, h: 10 },
    { type: 'kitchen', name: 'Kitchen', w: 8, h: 8 },
    ...(dining ? [{ type: 'dining', name: 'Dining room', w: 9, h: 8 }] : []),
    ...Array.from({ length: bedrooms }, (_, i) => ({ type: 'bedroom', name: 'Bedroom ' + (i + 1), w: i === 0 ? 11 : 10, h: 10 })),
    ...Array.from({ length: bathrooms }, (_, i) => ({ type: 'bathroom', name: 'Bathroom ' + (i + 1), w: 5, h: 7 })),
    ...(study ? [{ type: 'study', name: 'Study', w: 7, h: 8 }] : []),
    ...(parking ? [{ type: 'parking', name: 'Parking', w: 9, h: 15 }] : []),
    ...(puja ? [{ type: 'puja', name: 'Puja room', w: 4, h: 5 }] : []),
    ...(store ? [{ type: 'store', name: 'Store room', w: 5, h: 6 }] : []),
  ]
  // A deterministic, editable concept arrangement; rooms are packed into rows and scaled down only when the requested plot is small.
  const margin = 1
  const gap = preference === 'compact' ? 0 : 0.5
  const usableW = width - margin * 2
  let x = margin, y = margin, rowH = 0, row = 0
  const ordered = variant === 1 ? [...specs].sort((a,b) => (['living','dining','kitchen'].includes(a.type) ? -1 : 1) - (['living','dining','kitchen'].includes(b.type) ? -1 : 1)) : variant === 2 ? [...specs].reverse() : specs
  const minScale = Math.min(1, (usableW / Math.max(...ordered.map(s => s.w))) || 1, (depth - 2) / (Math.ceil(ordered.length / 2) * 10))
  const scale = clamp(minScale, 0.52, 1)
  const cellGap = gap
  const placed = []
  ordered.forEach((spec, index) => {
    let w = spec.w * scale, h = spec.h * scale
    if (w > usableW) w = usableW
    if (x + w > width - margin + 0.001) { x = margin; y += rowH + cellGap; rowH = 0; row += 1 }
    if (y + h > depth - margin) {
      // Keep every room within the plot. Smaller later rooms share remaining vertical space.
      h = Math.max(3, depth - margin - y)
      w = Math.min(w, usableW)
    }
    const px = x * GRID, py = y * GRID, pw = w * GRID, ph = h * GRID
    placed.push({ id: spec.type + '-' + index, type: spec.type, name: spec.name, x: Math.round(px), y: Math.round(py), w: Math.round(pw), h: Math.round(ph), fill: palette[spec.type], widthFt: Number(w.toFixed(1)), lengthFt: Number(h.toFixed(1)) })
    x += w + cellGap
    rowH = Math.max(rowH, h)
  })
  const roomsArea = placed.reduce((sum, r) => sum + (r.w / GRID) * (r.h / GRID), 0)
  const title = ['Balanced family layout', 'Open social layout', 'Alternative room arrangement'][variant]
  const notes = [
    'A balanced starter arrangement prioritises everyday rooms and a clear, editable room list.',
    'The social-room option brings the living, dining and kitchen areas earlier in the plan.',
    'An alternate room sequence for comparing different starting arrangements.',
  ]
  return { id: 'layout-' + variant, title, style: preference, rooms: placed, area: roomsArea, plotWidth: width, plotDepth: depth, note: notes[variant], name }
}

export default function AIPlanGenerator({ onOpenPlanner }) {
  const [plotWidth, setPlotWidth] = useState(30)
  const [plotDepth, setPlotDepth] = useState(40)
  const [bedrooms, setBedrooms] = useState(2)
  const [bathrooms, setBathrooms] = useState(2)
  const [study, setStudy] = useState(false)
  const [dining, setDining] = useState(true)
  const [parking, setParking] = useState(false)
  const [puja, setPuja] = useState(false)
  const [store, setStore] = useState(false)
  const [preference, setPreference] = useState('balanced')
  const [name, setName] = useState('My home')
  const [layouts, setLayouts] = useState(() => [0,1,2].map(v => buildLayout({ plotWidth: 30, plotDepth: 40, bedrooms: 2, bathrooms: 2, study: false, dining: true, parking: false, puja: false, store: false, preference: 'balanced', name: 'My home' }, v)))
  const [selected, setSelected] = useState(0)
  const [generated, setGenerated] = useState(false)
  const [notice, setNotice] = useState('')
  const request = useMemo(() => ({ plotWidth, plotDepth, bedrooms, bathrooms, study, dining, parking, puja, store, preference, name }), [plotWidth, plotDepth, bedrooms, bathrooms, study, dining, parking, puja, store, preference, name])
  const generate = () => {
    const next = [0,1,2].map(v => buildLayout(request, v))
    setLayouts(next); setSelected(0); setGenerated(true)
    setNotice('Three editable concept layouts generated from your requirements.')
  }
  const active = layouts[selected]
  const exportLayout = () => {
    const data = { app: 'GharVision', feature: 'Editable floor-plan concept generator', generator: 'local rule-based layout generator; no external AI service is connected', plot: { widthFeet: active.plotWidth, depthFeet: active.plotDepth }, requirements: request, layout: active }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = 'gharvision-generated-layout.json'; document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="ai-planner-page">
    <header className="ai-planner-heading"><div><p className="eyebrow"><WandSparkles size={14}/> DESIGN STUDIO · AI FLOOR PLAN</p><h1>Generate your floor plan <span className="wave">✳</span></h1><p className="heading-subtitle">Enter your plot dimensions and room requirements, compare three concepts, then drag, resize and rename rooms by hand.</p></div><button className="filter-button" onClick={generate}><RefreshCw size={15}/> Regenerate</button></header>
    <section className="ai-planner-controls ai-requirements">
      <div className="ai-input-pair"><label>Plot width (ft)<input type="number" min="15" max="43" value={plotWidth} onChange={e => setPlotWidth(clamp(Number(e.target.value)||15,15,43))}/></label><label>Plot depth (ft)<input type="number" min="15" max="43" value={plotDepth} onChange={e => setPlotDepth(clamp(Number(e.target.value)||15,15,43))}/></label></div>
      <div className="ai-input-pair"><label>Bedrooms<select value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} bedroom{n>1?'s':''}</option>)}</select></label><label>Bathrooms<select value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))}>{[1,2,3,4].map(n=><option key={n} value={n}>{n} bathroom{n>1?'s':''}</option>)}</select></label></div>
      <div className="ai-input-pair"><label>Layout style<select value={preference} onChange={e => setPreference(e.target.value)}><option value="balanced">Balanced family</option><option value="open">Open social areas</option><option value="compact">Compact layout</option></select></label><label>Plan name<input value={name} maxLength={60} onChange={e => setName(e.target.value)} placeholder="My home"/></label></div>
      <div className="ai-room-options">
        <span>Include in the plan</span>
        <label><input type="checkbox" checked={dining} onChange={e => setDining(e.target.checked)}/> Dining room</label>
        <label><input type="checkbox" checked={study} onChange={e => setStudy(e.target.checked)}/> Study</label>
        <label><input type="checkbox" checked={parking} onChange={e => setParking(e.target.checked)}/> Parking</label>
        <label><input type="checkbox" checked={puja} onChange={e => setPuja(e.target.checked)}/> Puja room</label>
        <label><input type="checkbox" checked={store} onChange={e => setStore(e.target.checked)}/> Store room</label>
      </div>
      <button className="primary-button ai-generate-button" onClick={generate}><Sparkles size={16}/> Generate floor plan</button>
    </section>
    <div className="ai-planner-results"><section className="ai-layout-preview"><div className="ai-layout-title"><div><span className="eyebrow">SELECTED CONCEPT</span><h2>{active.title}</h2></div><span className="ai-layout-count">{active.rooms.length} rooms</span></div>
      <div className="ai-canvas-wrap"><svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-label="Generated concept floor plan"><defs><pattern id="ai-grid" width={GRID} height={GRID} patternUnits="userSpaceOnUse"><path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="var(--planner-grid)" strokeWidth=".8"/></pattern></defs><rect width={CANVAS_W} height={CANVAS_H} fill="var(--planner-canvas)"/><rect width={CANVAS_W} height={CANVAS_H} fill="url(#ai-grid)"/><rect x="20" y="20" width={plotWidth*GRID} height={plotDepth*GRID} fill="none" stroke="var(--planner-border)" strokeWidth="2" strokeDasharray="6 4"/>{active.rooms.map(r=><g key={r.id}><rect x={r.x} y={r.y} width={r.w} height={r.h} rx="3" fill={r.fill} stroke="#fff" strokeWidth="2"/><text x={r.x+r.w/2} y={r.y+r.h/2-4} fontSize="13" textAnchor="middle" fill="#344136" fontWeight="600">{r.name}</text><text x={r.x+r.w/2} y={r.y+r.h/2+13} fontSize="10" textAnchor="middle" fill="#4d5b4b">{Math.round((r.w/GRID)*(r.h/GRID))} sq ft</text></g>)}</svg></div>
      <div className="ai-layout-note"><Info size={15}/><span>{active.note} Approximate room area: <strong>{Math.round(active.area).toLocaleString('en-IN')} sq ft</strong>. Plot: {plotWidth} × {plotDepth} ft.</span></div>
      <div className="ai-actions"><button className="primary-button" onClick={() => onOpenPlanner(active.rooms, { width: plotWidth, depth: plotDepth })}><ArrowRight size={16}/> Edit this layout by hand</button><button className="filter-button" onClick={exportLayout}><Download size={15}/> Export JSON</button></div>
    </section>
    <aside className="ai-layout-options"><div className="planner-panel-heading"><div><span className="eyebrow">COMPARE OPTIONS</span><h3>Choose a layout</h3></div></div>{layouts.map((layout, index)=><button key={layout.id} className={selected===index?'ai-layout-option selected':'ai-layout-option'} onClick={()=>setSelected(index)}><div className="ai-option-top"><span className="ai-option-number">0{index+1}</span><span className="ai-option-check">{selected===index?<Check size={14}/>:null}</span></div><strong>{layout.title}</strong><p>{layout.note}</p><span className="ai-option-meta">{layout.rooms.length} rooms · {Math.round(layout.area)} sq ft</span></button>)}</aside></div>
    {notice&&<p className="ai-generated-status"><Check size={14}/>{notice}</p>}
    <p className="planner-disclaimer">Transparency: this version generates editable concepts locally from rules; it does not call a trained AI model or external AI API. It is a starting layout, not a construction drawing. It does not validate walls, doors, windows, ventilation, setbacks, structure or local codes. Ask a qualified architect to review before building.</p>
  </div>
}
