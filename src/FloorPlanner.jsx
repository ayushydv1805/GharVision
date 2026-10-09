import { useEffect, useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, ArrowRight, Bath, BedDouble, Check, ChevronDown, DoorOpen, Grid2X2, Minus, Plus, RotateCcw, Save, Sofa, Trash2, Utensils, WandSparkles } from 'lucide-react'

const GRID = 20
const CANVAS_W = 900
const CANVAS_H = 560
const STARTER_ROOMS = [
  { id: 'living', name: 'Living room', type: 'living', x: 60, y: 60, w: 240, h: 160, fill: '#dce8d4' },
  { id: 'kitchen', name: 'Kitchen', type: 'kitchen', x: 320, y: 60, w: 160, h: 120, fill: '#f2dfc8' },
  { id: 'bedroom', name: 'Bedroom 1', type: 'bedroom', x: 60, y: 240, w: 180, h: 140, fill: '#dce4f4' },
  { id: 'bathroom', name: 'Bathroom', type: 'bathroom', x: 260, y: 240, w: 100, h: 100, fill: '#d5e9e8' },
]
const ROOM_TYPES = [
  { type: 'living', name: 'Living room', w: 12, h: 8, fill: '#dce8d4', Icon: Sofa },
  { type: 'bedroom', name: 'Bedroom', w: 10, h: 10, fill: '#dce4f4', Icon: BedDouble },
  { type: 'kitchen', name: 'Kitchen', w: 8, h: 7, fill: '#f2dfc8', Icon: Utensils },
  { type: 'bathroom', name: 'Bathroom', w: 6, h: 6, fill: '#d5e9e8', Icon: Bath },
  { type: 'dining', name: 'Dining room', w: 9, h: 8, fill: '#f0dce8', Icon: Utensils },
  { type: 'study', name: 'Study', w: 8, h: 7, fill: '#e6def5', Icon: DoorOpen },
]
const freshRooms = () => STARTER_ROOMS.map(r => ({ ...r }))

export default function FloorPlanner() {
  const [rooms, setRooms] = useState(() => {
    try { const saved = localStorage.getItem('gharvision-floorplan'); return saved ? JSON.parse(saved) : freshRooms() } catch { return freshRooms() }
  })
  const [selectedId, setSelectedId] = useState('living')
  const [plotWidth, setPlotWidth] = useState(40)
  const [plotHeight, setPlotHeight] = useState(28)
  const [dragging, setDragging] = useState(null)
  const [saved, setSaved] = useState(false)
  const selected = rooms.find(room => room.id === selectedId) || rooms[0]
  const totalArea = useMemo(() => rooms.reduce((sum, room) => sum + (room.w / 20 * 12) * (room.h / 20 * 12), 0), [rooms])
  const roomArea = room => Math.round((room.w / 20 * 12) * (room.h / 20 * 12))
  useEffect(() => { localStorage.setItem('gharvision-floorplan', JSON.stringify(rooms)) }, [rooms])

  const addRoom = preset => {
    const count = rooms.filter(r => r.type === preset.type).length
    const room = {
      id: `${preset.type}-${Date.now()}`, name: preset.type === 'bedroom' ? `Bedroom ${count + 1}` : preset.name,
      type: preset.type, x: 400 + (rooms.length % 3) * 35, y: 210 + (rooms.length % 3) * 35,
      w: preset.w * (GRID / 12), h: preset.h * (GRID / 12), fill: preset.fill,
    }
    setRooms(prev => [...prev, room]); setSelectedId(room.id); setSaved(false)
  }
  const updateSelected = patch => { if (!selected) return; setRooms(prev => prev.map(room => room.id === selected.id ? { ...room, ...patch } : room)); setSaved(false) }
  const removeSelected = () => { if (!selected) return; const next = rooms.filter(room => room.id !== selected.id); setRooms(next); setSelectedId(next[0]?.id || null); setSaved(false) }
  const resetPlan = () => { setRooms(freshRooms()); setSelectedId('living'); setSaved(false) }
  const savePlan = () => { localStorage.setItem('gharvision-floorplan', JSON.stringify(rooms)); setSaved(true) }
  const pointFromEvent = event => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - bounds.left) * CANVAS_W / bounds.width, y: (event.clientY - bounds.top) * CANVAS_H / bounds.height }
  }
  const startDrag = (event, room) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    const point = pointFromEvent(event)
    setSelectedId(room.id)
    setDragging({ id: room.id, dx: point.x - room.x, dy: point.y - room.y })
  }
  const moveDrag = event => {
    if (!dragging) return
    const point = pointFromEvent(event)
    const target = rooms.find(r => r.id === dragging.id)
    if (!target) return
    const x = Math.max(0, Math.min(CANVAS_W - target.w, Math.round((point.x - dragging.dx) / GRID) * GRID))
    const y = Math.max(0, Math.min(CANVAS_H - target.h, Math.round((point.y - dragging.dy) / GRID) * GRID))
    setRooms(prev => prev.map(room => room.id === dragging.id ? { ...room, x, y } : room))
    setSaved(false)
  }
  const exportPlan = () => {
    const payload = { app: 'GharVision', version: 1, plot: { widthFeet: plotWidth, heightFeet: plotHeight }, rooms: rooms.map(({ id, name, type, x, y, w, h }) => ({ id, name, type, x, y, widthPixels: w, heightPixels: h, areaSqFt: roomArea({ w, h }) })) }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a'); link.href = url; link.download = 'gharvision-floor-plan.json'; link.click(); URL.revokeObjectURL(url)
  }

  return <div className="planner-page">
    <div className="planner-heading"><div><p className="eyebrow"><Grid2X2 size={13}/> DESIGN STUDIO · PHASE 02</p><h1>Floor planner<span className="wave">✳</span></h1><p className="heading-subtitle">Sketch your space, one room at a time. Drag rooms around to find your flow.</p></div><div className="planner-heading-actions"><button className="filter-button" onClick={resetPlan}><RotateCcw size={15}/> Reset plan</button><button className="primary-button" onClick={savePlan}><Save size={16}/>{saved ? 'Saved' : 'Save plan'}{saved && <Check size={14}/>}</button></div></div>
    <div className="planner-summary"><div><span className="planner-summary-icon"><Grid2X2 size={17}/></span><div><small>ROOMS IN PLAN</small><strong>{rooms.length}</strong></div></div><div><span className="planner-summary-icon"><RulerIcon/></span><div><small>EST. DESIGNED AREA</small><strong>{Math.round(totalArea).toLocaleString('en-IN')} <em>sq. ft.</em></strong></div></div><div><span className="planner-summary-icon"><WandSparkles size={17}/></span><div><small>CANVAS GRID</small><strong>Snap to grid</strong></div></div></div>
    <div className="planner-layout">
      <aside className="planner-sidebar">
        <div className="planner-panel-heading"><div><span className="eyebrow">BUILD YOUR PLAN</span><h3>Add a room</h3></div><span className="planner-count">{rooms.length} placed</span></div>
        <div className="room-presets">{ROOM_TYPES.map(preset => { const Icon = preset.Icon; return <button className="room-preset" key={preset.type} onClick={() => addRoom(preset)}><span className="preset-icon" style={{ background: preset.fill }}><Icon size={17}/></span><span><strong>{preset.name}</strong><small>{preset.w} × {preset.h} ft</small></span><Plus size={15}/></button> })}</div>
        <div className="planner-divider"/>
        <div className="planner-panel-heading"><div><span className="eyebrow">PLOT SETTINGS</span><h3>Plot dimensions</h3></div></div>
        <div className="plot-fields"><label>Width <span>ft</span><input type="number" min="10" max="200" value={plotWidth} onChange={e => setPlotWidth(Math.max(10, Math.min(200, Number(e.target.value) || 10)))}/></label><label>Depth <span>ft</span><input type="number" min="10" max="200" value={plotHeight} onChange={e => setPlotHeight(Math.max(10, Math.min(200, Number(e.target.value) || 10)))}/></label></div>
        <div className="plot-area-note"><span className="live-dot"/><span>Plot area: <strong>{(plotWidth * plotHeight).toLocaleString('en-IN')} sq. ft.</strong></span></div>
        <div className="planner-tip"><WandSparkles size={16}/><p><strong>Designer tip</strong> Keep circulation space between rooms and group kitchens near dining areas for a practical layout.</p></div>
      </aside>
      <section className="planner-canvas-panel">
        <div className="canvas-toolbar"><div><strong>Untitled floor plan</strong><span>2D top view · Concept sketch</span></div><div className="canvas-toolbar-actions"><span className="grid-status"><span/> Grid on</span><button className="icon-button small-icon" title="Export plan as JSON" aria-label="Export plan" onClick={exportPlan}><ArrowDownToLine size={17}/></button></div></div>
        <div className="floor-canvas-wrap"><svg className="floor-canvas" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} role="img" aria-label="Interactive 2D floor plan canvas" onPointerMove={moveDrag} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}>
          <defs><pattern id="floor-grid" width={GRID} height={GRID} patternUnits="userSpaceOnUse"><path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="var(--planner-grid)" strokeWidth=".8"/></pattern></defs>
          <rect width={CANVAS_W} height={CANVAS_H} fill="var(--planner-canvas)"/><rect width={CANVAS_W} height={CANVAS_H} fill="url(#floor-grid)"/>
          <rect x="16" y="16" width={CANVAS_W - 32} height={CANVAS_H - 32} rx="2" fill="none" stroke="var(--planner-border)" strokeDasharray="5 5"/>
          {rooms.map(room => <g key={room.id} className={`floor-room ${selectedId === room.id ? 'floor-room-selected' : ''}`} onPointerDown={event => startDrag(event, room)} style={{ cursor: dragging?.id === room.id ? 'grabbing' : 'grab', touchAction: 'none' }}>
            <rect x={room.x} y={room.y} width={room.w} height={room.h} rx="3" fill={room.fill} fillOpacity=".92" stroke={selectedId === room.id ? 'var(--planner-selected)' : '#ffffff'} strokeWidth={selectedId === room.id ? 3 : 2}/>
            <rect x={room.x + 7} y={room.y + 7} width={Math.max(0, room.w - 14)} height={Math.max(0, room.h - 14)} rx="2" fill="none" stroke="#65715f" strokeOpacity=".35" strokeDasharray="3 3"/>
            <text x={room.x + room.w / 2} y={room.y + room.h / 2 - 4} textAnchor="middle" fontSize={Math.max(10, Math.min(15, room.w / 13))} fontWeight="600" fill="#344136" pointerEvents="none">{room.name.length > 18 ? room.name.slice(0, 17) + '…' : room.name}</text>
            <text x={room.x + room.w / 2} y={room.y + room.h / 2 + 14} textAnchor="middle" fontSize="11" fill="#4d5b4b" pointerEvents="none">{roomArea(room).toLocaleString('en-IN')} sq ft</text>
            {selectedId === room.id && <rect x={room.x + room.w - 5} y={room.y - 5} width="10" height="10" rx="2" fill="var(--planner-selected)" stroke="white" strokeWidth="1.5" pointerEvents="none"/>}
          </g>)}
        </svg></div>
        <div className="canvas-foot"><span><span className="canvas-foot-dot"/> Drag any room to move it. Rooms snap to the grid.</span><span>{rooms.length} rooms · {plotWidth} × {plotHeight} ft plot</span></div>
      </section>
      <aside className="planner-inspector">
        <div className="planner-panel-heading"><div><span className="eyebrow">ROOM DETAILS</span><h3>{selected ? selected.name : 'Select a room'}</h3></div><ChevronDown size={16}/></div>
        {selected ? <><div className="inspector-room-preview" style={{ background: selected.fill }}><div className="inspector-room-lines"/><span>{selected.name}</span><small>{selected.type.toUpperCase()}</small></div>
          <label className="field-label" htmlFor="room-name">Room name</label><input id="room-name" className="inspector-input" value={selected.name} maxLength={28} onChange={e => updateSelected({ name: e.target.value })}/>
          <div className="inspector-size-heading"><strong>Room dimensions</strong><span>feet</span></div>
          <div className="inspector-dimensions"><label>Width<input type="number" min="4" max="30" value={Math.round(selected.w / GRID * 12)} onChange={e => updateSelected({ w: Math.max(4, Math.min(30, Number(e.target.value) || 4)) * GRID / 12 })}/></label><span>×</span><label>Length<input type="number" min="4" max="30" value={Math.round(selected.h / GRID * 12)} onChange={e => updateSelected({ h: Math.max(4, Math.min(30, Number(e.target.value) || 4)) * GRID / 12 })}/></label></div>
          <div className="room-area-total"><span>Estimated room area</span><strong>{roomArea(selected).toLocaleString('en-IN')} sq. ft.</strong></div>
          <button className="remove-room-button" onClick={removeSelected}><Trash2 size={15}/> Remove room</button>
        </> : <div className="inspector-empty"><Grid2X2 size={25}/><p>Add a room to start shaping your layout.</p></div>}
        <button className="export-plan-button" onClick={exportPlan}><ArrowDownToLine size={15}/> Export plan data <ArrowRight size={14}/></button>
      </aside>
    </div>
    <p className="planner-disclaimer">Concept planning tool for early ideas only. This is not a construction-ready architectural drawing; confirm dimensions, structure, setbacks and local building rules with a qualified professional.</p>
  </div>
}

function RulerIcon() {
  return <span className="ruler-icon">↔</span>
}
