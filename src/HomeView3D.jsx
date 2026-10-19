import { useMemo, useState } from 'react'
import { Box, RefreshCw, PanelsTopLeft, Download, Eye, EyeOff, RotateCcw, Info } from 'lucide-react'

const FALLBACK_ROOMS = [
  { id: 'living', name: 'Living room', type: 'living', x: 60, y: 60, w: 240, h: 160, fill: '#dce8d4' },
  { id: 'kitchen', name: 'Kitchen', type: 'kitchen', x: 320, y: 60, w: 160, h: 120, fill: '#f2dfc8' },
  { id: 'bedroom', name: 'Bedroom 1', type: 'bedroom', x: 60, y: 240, w: 180, h: 140, fill: '#dce4f4' },
  { id: 'bathroom', name: 'Bathroom', type: 'bathroom', x: 260, y: 240, w: 100, h: 100, fill: '#d5e9e8' },
]
const validRooms = value => Array.isArray(value) && value.length > 0 && value.length <= 100 && value.every(r =>
  r && typeof r.id === 'string' && typeof r.name === 'string' &&
  Number.isFinite(Number(r.x)) && Number.isFinite(Number(r.y)) &&
  Number.isFinite(Number(r.w)) && Number.isFinite(Number(r.h)) &&
  Number(r.w) > 0 && Number(r.h) > 0
)
const readRooms = () => {
  try {
    const value = JSON.parse(localStorage.getItem('gharvision-floorplan') || 'null')
    return validRooms(value) ? value : FALLBACK_ROOMS.map(room => ({ ...room }))
  } catch {
    return FALLBACK_ROOMS.map(room => ({ ...room }))
  }
}
const point = (x, y, lift = 0) => [130 + (x - y) * 0.58, 75 + (x + y) * 0.29 - lift]
const points = coords => coords.map(([x, y]) => x + ',' + y).join(' ')
const safeColor = color => typeof color === 'string' && /^#[0-9a-f]{3,8}$/i.test(color) ? color : '#dce8d4'

function IsometricRoom({ room, height, labels, selected, onSelect }) {
  const x = Math.max(0, Math.min(900, Number(room.x) || 0))
  const y = Math.max(0, Math.min(560, Number(room.y) || 0))
  const w = Math.max(30, Math.min(900, Number(room.w) || 60))
  const h = Math.max(30, Math.min(560, Number(room.h) || 60))
  const a = point(x, y), b = point(x + w, y), c = point(x + w, y + h), d = point(x, y + h)
  const at = point(x, y, height), bt = point(x + w, y, height), ct = point(x + w, y + h, height), dt = point(x, y + h, height)
  const fill = safeColor(room.fill)
  return <g className={`home3d-room ${selected ? 'home3d-room-selected' : ''}`} onClick={() => onSelect(room.id)} role="button" tabIndex="0" aria-label={`Select ${room.name}`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(room.id) } }}>
    <polygon points={points([d, c, ct, dt])} fill="#64745e" stroke="#ffffff" strokeOpacity=".6" strokeWidth="1.2"/>
    <polygon points={points([b, c, ct, bt])} fill="#879782" stroke="#ffffff" strokeOpacity=".6" strokeWidth="1.2"/>
    <polygon points={points([at, bt, ct, dt])} fill={fill} stroke={selected ? '#456c3d' : '#ffffff'} strokeWidth={selected ? 3 : 1.5} />
    <polygon points={points([point(x + w * .14, y + h * .16, height + 1), point(x + w * .86, y + h * .16, height + 1), point(x + w * .86, y + h * .84, height + 1), point(x + w * .14, y + h * .84, height + 1)])} fill="none" stroke="#52644e" strokeOpacity=".35" strokeDasharray="4 4"/>
    {labels && <text x={(at[0] + bt[0] + ct[0] + dt[0]) / 4} y={(at[1] + bt[1] + ct[1] + dt[1]) / 4 + 4} textAnchor="middle" fontSize={Math.max(9, Math.min(14, Math.min(w, h) / 10))} fontWeight="700" fill="#29352a" pointerEvents="none">{room.name.length > 18 ? room.name.slice(0, 17) + '…' : room.name}</text>}
  </g>
}

export default function HomeView3D({ onEditPlan }) {
  const [rooms, setRooms] = useState(readRooms)
  const [height, setHeight] = useState(34)
  const [labels, setLabels] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [message, setMessage] = useState('')
  const selected = rooms.find(room => room.id === selectedId)
  const area = useMemo(() => rooms.reduce((sum, room) => sum + (Number(room.w) / 20) * (Number(room.h) / 20), 0), [rooms])
  const refresh = () => {
    const next = readRooms()
    setRooms(next)
    setSelectedId(null)
    setMessage('View refreshed from your saved 2D floor plan.')
  }
  const exportModel = () => {
    const payload = { app: 'GharVision', feature: 'Phase 08 3D-style home view', note: 'Conceptual isometric visualization; not a construction-ready 3D model.', wallHeight: height, rooms }
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'gharvision-home-view.json'
    document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Concept view data exported.')
  }
  return <div className="home3d-page">
    <header className="home3d-heading"><div><p className="eyebrow"><Box size={14}/> DESIGN STUDIO · PHASE 08</p><h1>3D home view <span className="wave">✳</span></h1><p className="heading-subtitle">See your floor plan as an isometric home concept. Adjust wall height, inspect rooms, and export your model data.</p></div><div className="home3d-heading-actions"><button className="filter-button" onClick={refresh}><RefreshCw size={15}/> Sync floor plan</button><button className="primary-button" onClick={onEditPlan}><PanelsTopLeft size={15}/> Edit 2D plan</button></div></header>
    <section className="home3d-summary"><div><span className="home3d-summary-icon"><Box size={17}/></span><div><small>ROOMS SHOWN</small><strong>{rooms.length}</strong></div></div><div><span className="home3d-summary-icon"><PanelsTopLeft size={17}/></span><div><small>EST. FLOOR AREA</small><strong>{Math.round(area).toLocaleString('en-IN')} <em>sq. ft.</em></strong></div></div><div><span className="home3d-summary-icon"><Eye size={17}/></span><div><small>VIEW MODE</small><strong>Isometric concept</strong></div></div></section>
    <div className="home3d-layout"><section className="home3d-preview"><div className="home3d-toolbar"><div><strong>Home concept model</strong><span>Illustrative 3D-style view · Select a room</span></div><button className="icon-button small-icon" onClick={() => setLabels(v => !v)} aria-label={labels ? 'Hide room labels' : 'Show room labels'} title={labels ? 'Hide labels' : 'Show labels'}>{labels ? <Eye size={17}/> : <EyeOff size={17}/>}</button></div>
      <div className="home3d-canvas"><svg viewBox="0 0 1000 620" role="img" aria-label="Isometric conceptual home model showing room floors and walls"><defs><pattern id="home3d-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="var(--line)" strokeOpacity=".55" strokeWidth="1"/></pattern><linearGradient id="home3d-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--panel)"/><stop offset="100%" stopColor="var(--panel-soft)"/></linearGradient></defs><rect width="1000" height="620" fill="url(#home3d-bg)"/><rect width="1000" height="620" fill="url(#home3d-grid)"/><ellipse cx="500" cy="390" rx="340" ry="170" fill="#71816a" opacity=".08"/>{rooms.map(room => <IsometricRoom key={room.id} room={room} height={height} labels={labels} selected={room.id === selectedId} onSelect={setSelectedId}/>)}<text x="28" y="590" fill="var(--muted)" fontSize="12">CONCEPT VIEW · NOT TO SCALE</text></svg></div>
      <div className="home3d-view-controls"><label htmlFor="wall-height">Wall height <strong>{height} concept units</strong><input id="wall-height" type="range" min="12" max="58" step="2" value={height} onChange={e => setHeight(Number(e.target.value))}/></label><button className="filter-button" onClick={() => { setHeight(34); setLabels(true); setSelectedId(null) }}><RotateCcw size={14}/> Reset view</button></div>
    </section>
    <aside className="home3d-inspector"><div className="home3d-inspector-title"><div><span className="eyebrow">MODEL INSPECTOR</span><h3>{selected ? selected.name : 'Explore your rooms'}</h3></div><span className="home3d-count">{rooms.length} rooms</span></div>
      {selected ? <><div className="home3d-room-chip" style={{background:safeColor(selected.fill)}}><Box size={21}/><div><strong>{selected.name}</strong><span>{String(selected.type || 'room').toUpperCase()}</span></div></div><div className="home3d-detail-row"><span>Concept width</span><strong>{(Number(selected.w) / 20).toFixed(1)} ft</strong></div><div className="home3d-detail-row"><span>Concept length</span><strong>{(Number(selected.h) / 20).toFixed(1)} ft</strong></div><div className="home3d-detail-row"><span>Estimated area</span><strong>{Math.round((Number(selected.w) / 20) * (Number(selected.h) / 20)).toLocaleString('en-IN')} sq. ft.</strong></div><button className="filter-button home3d-full-button" onClick={() => setSelectedId(null)}>Clear selection</button></> : <div className="home3d-empty"><Box size={27}/><p>Select any room in the model to inspect its name, type and approximate dimensions.</p></div>}
      <div className="home3d-room-list"><strong>Rooms in this view</strong>{rooms.map(room => <button key={room.id} className={`home3d-room-list-item ${room.id === selectedId ? 'selected' : ''}`} onClick={() => setSelectedId(room.id)}><span className="home3d-room-dot" style={{background:safeColor(room.fill)}}/><span>{room.name}</span><span>{(Number(room.w)/20).toFixed(0)} × {(Number(room.h)/20).toFixed(0)} ft</span></button>)}</div>
      <button className="primary-button home3d-export" onClick={exportModel}><Download size={15}/> Export model data</button>
    </aside></div>
    <div className="home3d-disclaimer"><Info size={16}/><p><strong>Concept only.</strong> This is an interactive isometric illustration built from your saved 2D room rectangles, not a full 3D renderer or construction drawing. It does not model doors, windows, roofs, furniture, structural elements or real-world wall thickness. Use a qualified architect for build-ready plans.</p></div>
    {message && <div className="home3d-message" role="status">{message}<button onClick={() => setMessage('')} aria-label="Dismiss message">×</button></div>}
  </div>
}
