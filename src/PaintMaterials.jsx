import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, Download, Heart, Layers3, Paintbrush, Ruler, Sparkles } from 'lucide-react'

const paints = [
  { name: 'Oat Milk', hex: '#E8E0D2', family: 'Neutral', mood: 'Calm and airy', light: 'Any light', finish: 'Matte', price: 520 },
  { name: 'Sage Leaf', hex: '#AAB7A0', family: 'Green', mood: 'Grounded and restful', light: 'Bright room', finish: 'Matte', price: 590 },
  { name: 'Clay Pot', hex: '#C9876B', family: 'Earthy', mood: 'Warm and expressive', light: 'Warm light', finish: 'Eggshell', price: 610 },
  { name: 'Cloud White', hex: '#F5F2EA', family: 'Neutral', mood: 'Clean and open', light: 'Any light', finish: 'Silk', price: 480 },
  { name: 'Misty Blue', hex: '#A8BBC8', family: 'Blue', mood: 'Quiet and fresh', light: 'Bright room', finish: 'Matte', price: 575 },
  { name: 'Olive Grove', hex: '#747B56', family: 'Green', mood: 'Rich and natural', light: 'Warm light', finish: 'Eggshell', price: 640 },
  { name: 'Rose Dust', hex: '#D5ADA2', family: 'Earthy', mood: 'Soft and welcoming', light: 'Any light', finish: 'Matte', price: 600 },
  { name: 'Midnight Ink', hex: '#353D42', family: 'Blue', mood: 'Bold accent wall', light: 'Bright room', finish: 'Silk', price: 690 },
]
const materials = [
  { id: 'oak', name: 'Natural oak', type: 'Flooring', look: 'Warm wood grain', cost: 180, unit: 'sq. ft.', durability: 'Medium-high', note: 'A warm base for bedrooms and living spaces.', color: '#B88B5B' },
  { id: 'terrazzo', name: 'Soft terrazzo', type: 'Flooring', look: 'Fine stone chips', cost: 145, unit: 'sq. ft.', durability: 'High', note: 'Works well in bright, contemporary rooms.', color: '#D5C9B8' },
  { id: 'limestone', name: 'Limestone look', type: 'Wall finish', look: 'Quiet mineral texture', cost: 95, unit: 'sq. ft.', durability: 'Medium', note: 'Adds subtle depth without visual clutter.', color: '#C7BBA7' },
  { id: 'quartz', name: 'Warm white quartz', type: 'Countertop', look: 'Soft, fine veining', cost: 310, unit: 'sq. ft.', durability: 'High', note: 'A practical, bright surface for kitchens.', color: '#E9E2D6' },
  { id: 'charcoal', name: 'Charcoal slate', type: 'Countertop', look: 'Deep natural stone', cost: 260, unit: 'sq. ft.', durability: 'High', note: 'Creates contrast with light cabinetry.', color: '#5D625F' },
  { id: 'microcement', name: 'Warm microcement', type: 'Wall finish', look: 'Seamless matte surface', cost: 125, unit: 'sq. ft.', durability: 'Medium-high', note: 'A clean backdrop for modern interiors.', color: '#B9B0A2' },
]
const readSaved = (key, fallback) => { try { const value = localStorage.getItem(key); const parsed = value ? JSON.parse(value) : fallback; return Array.isArray(parsed) && parsed.every(item => typeof item === 'string') ? parsed : fallback } catch { return fallback } }

export default function PaintMaterials() {
  const [room, setRoom] = useState('Living room')
  const [family, setFamily] = useState('All')
  const [selectedPaints, setSelectedPaints] = useState(() => readSaved('gharvision-paint-board', ['Oat Milk', 'Sage Leaf']))
  const [savedMaterials, setSavedMaterials] = useState(() => readSaved('gharvision-material-board', []))
  const [materialType, setMaterialType] = useState('All')
  const [area, setArea] = useState('400')
  const [coats, setCoats] = useState('2')
  const [copied, setCopied] = useState(false)
  useEffect(() => { try { localStorage.setItem('gharvision-paint-board', JSON.stringify(selectedPaints)) } catch {} }, [selectedPaints])
  useEffect(() => { try { localStorage.setItem('gharvision-material-board', JSON.stringify(savedMaterials)) } catch {} }, [savedMaterials])
  const visiblePaints = paints.filter(p => family === 'All' || p.family === family)
  const visibleMaterials = materials.filter(m => materialType === 'All' || m.type === materialType)
  const selected = paints.filter(p => selectedPaints.includes(p.name))
  const selectedMaterialList = materials.filter(m => savedMaterials.includes(m.id))
  const litres = Math.ceil((Math.max(0, Number(area) || 0) * Math.max(1, Number(coats) || 1)) / 100)
  const paintCost = selected.length ? Math.round(litres * selected.reduce((sum, p) => sum + p.price, 0) / selected.length) : 0
  const boardText = useMemo(() => [
    'GHARVISION — PAINT & MATERIAL BOARD',
    'Room: ' + room,
    'Wall area estimate: ' + (Number(area) || 0) + ' sq. ft. | Coats: ' + coats,
    'Estimated paint quantity: ' + litres + ' litre(s) (assumes about 100 sq. ft. per litre per coat)',
    'Indicative paint cost: ₹' + paintCost.toLocaleString('en-IN') + ' (paint only; prices vary by brand and finish)',
    '',
    'PAINT COLOURS',
    ...(selected.length ? selected.map(p => p.name + ' — ' + p.hex + ' — ' + p.finish) : ['No paint colours selected']),
    '',
    'MATERIALS',
    ...(selectedMaterialList.length ? selectedMaterialList.map(m => m.name + ' — ₹' + m.cost + '/' + m.unit + ' — ' + m.type) : ['No materials saved']),
    '',
    'Planning estimates only. Confirm coverage, rates, and suitability with suppliers before purchase.'
  ].join('\n'), [room, area, coats, litres, paintCost, selected, selectedMaterialList])
  const togglePaint = name => setSelectedPaints(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name])
  const toggleMaterial = id => setSavedMaterials(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const exportBoard = () => {
    const blob = new Blob([boardText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'gharvision-material-board.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const copyBoard = async () => {
    try {
      await navigator.clipboard.writeText(boardText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      const blob = new Blob([boardText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'gharvision-material-board.txt'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }
  return <div className="materials-page">
    <section className="planner-heading materials-heading"><div><p className="eyebrow"><Sparkles size={13}/> PHASE 06 · FINISHING TOUCHES</p><h1>Paint & materials</h1><p className="heading-subtitle">Build a palette, compare finishes, and bring the details together.</p></div><div className="planner-heading-actions"><button className="filter-button" onClick={copyBoard}><Copy size={15}/>{copied ? 'Copied board' : 'Copy board'}</button><button className="primary-button" onClick={exportBoard}><Download size={15}/> Export board</button></div></section>
    <section className="materials-summary"><div><span className="materials-summary-icon"><Paintbrush size={17}/></span><div><small>PAINT COLOURS</small><strong>{selectedPaints.length} selected</strong></div></div><div><span className="materials-summary-icon"><Layers3 size={17}/></span><div><small>MATERIALS</small><strong>{savedMaterials.length} saved</strong></div></div><div><span className="materials-summary-icon"><Ruler size={17}/></span><div><small>PAINT ESTIMATE</small><strong>{litres} L <em>approx.</em></strong></div></div></section>
    <section className="materials-section"><div className="materials-section-heading"><div><p className="eyebrow">01 / COLOUR STORY</p><h2>Find your wall colour</h2><p>Choose up to as many shades as you need for a simple room palette.</p></div><label className="materials-room-select">Room<select value={room} onChange={e => setRoom(e.target.value)}><option>Living room</option><option>Bedroom</option><option>Kitchen</option><option>Bathroom</option><option>Home office</option><option>Exterior</option></select></label></div>
      <div className="materials-filter-row">{['All', 'Neutral', 'Green', 'Earthy', 'Blue'].map(f => <button key={f} className={family === f ? 'materials-filter active' : 'materials-filter'} onClick={() => setFamily(f)}>{f}</button>)}</div>
      <div className="paint-swatches">{visiblePaints.map(p => { const isSelected = selectedPaints.includes(p.name); return <button key={p.name} className={'paint-swatch-card ' + (isSelected ? 'paint-swatch-selected' : '')} onClick={() => togglePaint(p.name)} aria-pressed={isSelected}><span className="paint-swatch" style={{ background: p.hex }}><span className="paint-swatch-check">{isSelected && <Check size={18}/>}</span><span className="paint-hex">{p.hex}</span></span><span className="paint-swatch-info"><strong>{p.name}</strong><small>{p.family} · {p.finish}</small><em>{p.mood}</em></span><span className="paint-select-mark">{isSelected ? 'Selected' : 'Add to board'}</span></button> })}</div>
      <div className="selected-palette"><div><strong>Your palette</strong><span>{selected.length ? selected.map(p => p.name).join(' · ') : 'Select one or more colours above'}</span></div><div className="palette-dots">{selected.map(p => <span key={p.name} title={p.name} style={{ background: p.hex }}/>)}</div></div>
    </section>
    <section className="materials-layout"><div className="materials-section materials-library"><div className="materials-section-heading"><div><p className="eyebrow">02 / SURFACES & FINISHES</p><h2>Materials library</h2><p>Save options to your board to compare them later.</p></div></div><div className="materials-filter-row">{['All', 'Flooring', 'Wall finish', 'Countertop'].map(f => <button key={f} className={materialType === f ? 'materials-filter active' : 'materials-filter'} onClick={() => setMaterialType(f)}>{f}</button>)}</div><div className="material-cards">{visibleMaterials.map(m => { const isSaved = savedMaterials.includes(m.id); return <article className="material-card" key={m.id}><div className="material-preview" style={{ background: 'linear-gradient(135deg, ' + m.color + ', ' + m.color + 'cc)' }}><span>{m.type}</span><button onClick={() => toggleMaterial(m.id)} aria-label={(isSaved ? 'Remove ' : 'Save ') + m.name} aria-pressed={isSaved} className={isSaved ? 'material-heart saved' : 'material-heart'}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'}/></button><div className="material-texture-lines"/></div><div className="material-card-body"><h3>{m.name}</h3><p>{m.look}</p><div className="material-cost"><strong>₹{m.cost.toLocaleString('en-IN')}</strong><span>/ {m.unit}</span><span className="material-durability">{m.durability} durability</span></div><p className="material-note">{m.note}</p><button className={isSaved ? 'material-save saved' : 'material-save'} onClick={() => toggleMaterial(m.id)}>{isSaved ? <Check size={14}/> : <Heart size={14}/>} {isSaved ? 'Saved to board' : 'Save material'}</button></div></article> })}</div></div>
      <aside className="paint-estimator"><p className="eyebrow">03 / QUICK ESTIMATE</p><h2>Paint calculator</h2><p>Get a rough quantity for your walls. Actual coverage depends on the surface and product.</p><label>Wall area (sq. ft.)<input type="number" min="0" max="100000" value={area} onChange={e => setArea(e.target.value)}/></label><label>Number of coats<select value={coats} onChange={e => setCoats(e.target.value)}><option value="1">1 coat</option><option value="2">2 coats</option><option value="3">3 coats</option></select></label><div className="paint-estimate-result"><span>Estimated paint needed</span><strong>{litres} litres</strong><small>Assumes ~100 sq. ft. per litre per coat, rounded up.</small></div><div className="paint-estimate-result estimate-cost"><span>Indicative paint cost</span><strong>₹{paintCost.toLocaleString('en-IN')}</strong><small>Based on selected colours' sample rates; excludes primer, labour and tools.</small></div><p className="estimate-disclaimer">Use this as an early planning guide, not a supplier quote. Measure openings and check the paint tin's coverage before buying.</p></aside></section>
    <p className="materials-disclaimer">Sample material rates are illustrative Indian-rupee estimates, not live market prices. Compare supplier quotes and verify slip resistance, moisture suitability, and installation costs before purchasing.</p>
  </div>
}
