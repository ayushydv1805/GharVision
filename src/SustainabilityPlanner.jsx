import { useMemo, useState } from 'react'
import { Download, Leaf, Sun, Droplets, CheckCircle2, Circle, Sprout, Zap, RotateCcw } from 'lucide-react'

const KEY = 'gharvision-sustainability-v1'
const ACTIONS = [
  { id: 'led', title: 'Replace frequently used bulbs with LEDs', category: 'Energy', impact: 'Lower lighting electricity use' },
  { id: 'standby', title: 'Switch off standby devices and unused chargers', category: 'Energy', impact: 'Reduce avoidable daily power draw' },
  { id: 'thermostat', title: 'Set AC around 24–26°C and clean filters', category: 'Energy', impact: 'Improve cooling efficiency' },
  { id: 'leaks', title: 'Check taps, flush tanks and visible pipe leaks', category: 'Water', impact: 'Prevent hidden water waste' },
  { id: 'aerators', title: 'Fit tap aerators or a low-flow shower head', category: 'Water', impact: 'Reduce water used per minute' },
  { id: 'rain', title: 'Assess rainwater collection and safe storage', category: 'Water', impact: 'Make seasonal rainfall more useful' },
  { id: 'waste', title: 'Separate wet, dry and recyclable waste', category: 'Waste', impact: 'Make recycling and composting easier' },
  { id: 'plants', title: 'Choose native plants and water them early', category: 'Garden', impact: 'Support local biodiversity and reduce evaporation' },
]
const defaults = { monthlyKwh: '300', tariff: '8', roofArea: '100', sunlight: '5', panelKw: '0.55', costPerKw: '65000', rainfall: '800' }
const read = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return { inputs: { ...defaults, ...(value.inputs || {}) }, checked: Array.isArray(value.checked) ? value.checked : [] } } catch { return { inputs: defaults, checked: [] } } }
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0)
const number = value => Math.max(0, Number(value) || 0)

export default function SustainabilityPlanner() {
  const initial = useMemo(read, [])
  const [inputs, setInputs] = useState(initial.inputs)
  const [checked, setChecked] = useState(initial.checked)
  const [filter, setFilter] = useState('All')
  const [notice, setNotice] = useState('')
  const update = (key, value) => { const next = { ...inputs, [key]: value }; setInputs(next); persist(next, checked) }
  const persist = (nextInputs, nextChecked) => { try { localStorage.setItem(KEY, JSON.stringify({ inputs: nextInputs, checked: nextChecked })); setNotice('Saved on this device') } catch { setNotice('Storage unavailable — export your checklist to keep a copy') } }
  const toggle = id => { const next = checked.includes(id) ? checked.filter(item => item !== id) : [...checked, id]; setChecked(next); persist(inputs, next) }
  const monthlyKwh = number(inputs.monthlyKwh)
  const tariff = number(inputs.tariff)
  const sunlight = Math.max(1, number(inputs.sunlight))
  const panelKw = Math.max(0.1, number(inputs.panelKw))
  const systemKw = monthlyKwh / 30 / (sunlight * 0.78)
  const panels = Math.ceil(systemKw / panelKw)
  const roofNeeded = panels * 1.8
  const solarDaily = Math.min(monthlyKwh / 30, systemKw * sunlight * 0.78)
  const annualSavings = solarDaily * 30 * tariff * 12
  const installCost = systemKw * number(inputs.costPerKw)
  const payback = annualSavings > 0 ? installCost / annualSavings : 0
  const rainLitres = number(inputs.roofArea) * number(inputs.rainfall) * 0.8
  const categories = ['All', 'Energy', 'Water', 'Waste', 'Garden']
  const visibleActions = ACTIONS.filter(action => filter === 'All' || action.category === filter)
  const exportCsv = () => {
    const rows = [['Category', 'Action', 'Potential benefit', 'Completed'], ...ACTIONS.map(action => [action.category, action.title, action.impact, checked.includes(action.id) ? 'Yes' : 'No'])]
    const blob = new Blob(['\uFEFF' + rows.map(row => row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'gharvision-sustainability-checklist.csv'; link.click(); URL.revokeObjectURL(url)
  }
  const reset = () => { setInputs(defaults); setChecked([]); persist(defaults, []); setNotice('Planner reset to starter values') }
  return <section className="sustain-page">
    <header className="sustain-heading"><div><p className="eyebrow"><Leaf size={13}/> PHASE 17 · PLAN A LIGHTER FOOTPRINT</p><h1>Home sustainability planner</h1><p className="heading-subtitle">Explore solar sizing, rainwater potential and practical changes for a more efficient home.</p></div><div className="sustain-actions"><button className="filter-button" onClick={reset}><RotateCcw size={15}/> Reset</button><button className="primary-button" onClick={exportCsv}><Download size={15}/> Export checklist</button></div></header>
    <div className="sustain-notice"><Sprout size={16}/><span>Planning estimates only. Check roof structure, shade, local rules, installer quotes and water safety before making changes.</span>{notice && <strong>{notice}</strong>}</div>
    <div className="sustain-metrics"><article><span><Sun size={18}/></span><small>ESTIMATED SOLAR SIZE</small><strong>{systemKw.toFixed(2)} kW</strong><p>About {panels} panels at {panelKw.toFixed(2)} kW each</p></article><article><span><Zap size={18}/></span><small>ILLUSTRATIVE YEARLY SAVINGS</small><strong>{money(annualSavings)}</strong><p>Assumes solar offsets recorded grid use</p></article><article><span><Droplets size={18}/></span><small>RAINWATER POTENTIAL</small><strong>{Math.round(rainLitres).toLocaleString('en-IN')} L/year</strong><p>Roof area × rainfall × 80% collection</p></article><article><span><CheckCircle2 size={18}/></span><small>HABITS COMPLETED</small><strong>{checked.length} / {ACTIONS.length}</strong><p>{Math.round(checked.length / ACTIONS.length * 100)}% of starter checklist</p></article></div>
    <div className="sustain-layout">
      <section className="sustain-panel"><div className="sustain-panel-title"><div><h3>Solar planning calculator</h3><p>Change the assumptions to explore a rough system size and payback.</p></div><Sun size={19}/></div>
        <div className="sustain-fields"><label>Monthly electricity use (kWh)<input type="number" min="0" max="100000" value={inputs.monthlyKwh} onChange={e => update('monthlyKwh', e.target.value)}/></label><label>Electricity tariff (₹/kWh)<input type="number" min="0" max="1000" value={inputs.tariff} onChange={e => update('tariff', e.target.value)}/></label><label>Peak-sun hours per day<input type="number" min="1" max="10" step="0.5" value={inputs.sunlight} onChange={e => update('sunlight', e.target.value)}/></label><label>Panel size (kW each)<input type="number" min="0.1" max="2" step="0.05" value={inputs.panelKw} onChange={e => update('panelKw', e.target.value)}/></label><label>Installed cost per kW (₹)<input type="number" min="0" max="1000000" value={inputs.costPerKw} onChange={e => update('costPerKw', e.target.value)}/></label></div>
        <div className="sustain-result"><div><span>Indicative installed cost</span><strong>{money(installCost)}</strong></div><div><span>Simple payback estimate</span><strong>{annualSavings > 0 ? payback.toFixed(1) + ' years' : '—'}</strong></div><div><span>Roof area for panels</span><strong>{roofNeeded.toFixed(1)} m²</strong></div></div><p className="sustain-disclaimer">Uses a simplified 78% performance factor and constant tariff. It excludes subsidies, financing, maintenance, degradation, export credits, roof shading and seasonal variation. Actual output and payback can differ substantially.</p>
      </section>
      <section className="sustain-panel"><div className="sustain-panel-title"><div><h3>Rainwater harvesting potential</h3><p>A rough annual collection estimate from roof catchment.</p></div><Droplets size={19}/></div><div className="sustain-fields"><label>Usable roof area (m²)<input type="number" min="0" max="100000" value={inputs.roofArea} onChange={e => update('roofArea', e.target.value)}/></label><label>Annual rainfall (mm)<input type="number" min="0" max="10000" value={inputs.rainfall} onChange={e => update('rainfall', e.target.value)}/></label></div><div className="rain-result"><Droplets size={24}/><div><small>THEORETICAL COLLECTION</small><strong>{Math.round(rainLitres).toLocaleString('en-IN')} litres / year</strong><p>Before storage overflow, first-flush losses and local restrictions.</p></div></div><p className="sustain-disclaimer">Roof area (m²) × rainfall (mm) gives litres before losses. This estimate assumes 80% collection efficiency; rainfall varies by location and year. Use safe filtration and local guidance for any intended use.</p></section>
    </div>
    <section className="sustain-panel sustain-checklist"><div className="sustain-panel-title"><div><h3>Small changes, meaningful impact</h3><p>Tick actions as you complete them. Your checklist stays in this browser.</p></div><span className="sustain-progress">{checked.length} done</span></div><div className="sustain-filter">{categories.map(category => <button key={category} className={filter === category ? 'sustain-filter-active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="sustain-actions-list">{visibleActions.map(action => <button key={action.id} className={'sustain-action ' + (checked.includes(action.id) ? 'sustain-action-done' : '')} onClick={() => toggle(action.id)}><span className="sustain-action-check">{checked.includes(action.id) ? <CheckCircle2 size={19}/> : <Circle size={19}/>}</span><span className="sustain-action-copy"><strong>{action.title}</strong><small>{action.category} · {action.impact}</small></span><span className="sustain-action-state">{checked.includes(action.id) ? 'Done' : 'Mark done'}</span></button>)}</div></section>
    <p className="sustain-footnote">This planner is an educational estimate, not an energy audit, engineering design, financial guarantee or water-quality assessment. Confirm all decisions with qualified local professionals.</p>
  </section>
}
