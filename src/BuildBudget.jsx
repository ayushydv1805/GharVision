import { useEffect, useMemo, useState } from 'react'
import { Calculator, Download, RotateCcw, Save, IndianRupee, Info, CheckCircle2, Copy, House, Hammer, Paintbrush, Wrench } from 'lucide-react'

const defaults = [
  { id:'structure', name:'Civil structure & masonry', group:'Core construction', rate:1250, share:1, unit:'sq. ft.', note:'Foundation, columns, slab and brickwork' },
  { id:'finishes', name:'Flooring & wall finishes', group:'Finishes', rate:260, share:1, unit:'sq. ft.', note:'Tiles, basic wall finish and installation' },
  { id:'electrical', name:'Electrical work', group:'Services', rate:120, share:1, unit:'sq. ft.', note:'Wiring, switches and standard points' },
  { id:'plumbing', name:'Plumbing & sanitary', group:'Services', rate:140, share:1, unit:'sq. ft.', note:'Pipes, fittings and standard sanitaryware' },
  { id:'doors', name:'Doors & windows', group:'Openings', rate:180, share:1, unit:'sq. ft.', note:'Standard doors, window frames and glazing' },
  { id:'kitchen', name:'Kitchen & storage', group:'Interiors', rate:220, share:1, unit:'sq. ft.', note:'Basic modular kitchen and selected storage allowance' },
  { id:'paint', name:'Painting & final finish', group:'Finishes', rate:85, share:1, unit:'sq. ft.', note:'Interior and exterior paint allowance' },
  { id:'exterior', name:'Exterior & site works', group:'Site works', rate:110, share:1, unit:'sq. ft.', note:'Boundary, basic paving and site finishing allowance' },
]
const tiers = {
  economy: { label:'Economy', multiplier:0.82, desc:'Simple materials and practical finishes' },
  standard: { label:'Standard', multiplier:1, desc:'Mid-range materials and common specifications' },
  premium: { label:'Premium', multiplier:1.48, desc:'Higher-grade finishes and upgraded fittings' },
}
const money = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number.isFinite(value)?value:0)
const safeRead = () => { try { const raw=localStorage.getItem('gharvision-build-budget'); return raw ? JSON.parse(raw) : null } catch { return null } }

export default function BuildBudget() {
  const saved = useMemo(() => safeRead(), [])
  const [projectName,setProjectName] = useState(saved?.projectName || 'My dream home')
  const [area,setArea] = useState(saved?.area ?? 1500)
  const [floors,setFloors] = useState(saved?.floors ?? 1)
  const [tier,setTier] = useState(saved?.tier || 'standard')
  const [city,setCity] = useState(saved?.city || 'Tier 2 city')
  const [contingency,setContingency] = useState(saved?.contingency ?? 10)
  const [items,setItems] = useState(saved?.items || defaults)
  const [savedAt,setSavedAt] = useState(saved?.savedAt || '')
  const [message,setMessage] = useState('')
  const builtArea = Math.max(0,Number(area)||0) * Math.max(1,Number(floors)||1)
  const locationFactor = city === 'Metro city' ? 1.18 : city === 'Small town' ? 0.9 : 1
  const subtotal = items.reduce((sum,item)=>sum+Math.max(0,Number(item.rate)||0)*builtArea*tiers[tier].multiplier*locationFactor,0)
  const reserve = subtotal * Math.max(0,Number(contingency)||0)/100
  const total = subtotal + reserve
  const perSqft = builtArea ? total/builtArea : 0
  const grouped = items.reduce((acc,item)=>{acc[item.group]=(acc[item.group]||0)+Math.max(0,Number(item.rate)||0)*builtArea*tiers[tier].multiplier*locationFactor;return acc},{})
  useEffect(()=>{ if(!message)return; const id=window.setTimeout(()=>setMessage(''),3000); return ()=>window.clearTimeout(id) },[message])
  const updateItem=(id,rate)=>setItems(prev=>prev.map(item=>item.id===id?{...item,rate:Math.max(0,Number(rate)||0)}:item))
  const save=()=>{ const data={projectName,area:Number(area)||0,floors:Number(floors)||1,tier,city,contingency:Number(contingency)||0,items,savedAt:new Date().toISOString()}; try {localStorage.setItem('gharvision-build-budget',JSON.stringify(data));setSavedAt(data.savedAt);setMessage('Budget saved on this device.')}catch{setMessage('Browser storage is unavailable; export a copy instead.')} }
  const reset=()=>{setProjectName('My dream home');setArea(1500);setFloors(1);setTier('standard');setCity('Tier 2 city');setContingency(10);setItems(defaults);setSavedAt('');try{localStorage.removeItem('gharvision-build-budget')}catch{}setMessage('Estimate reset to sample values.')}
  const report=()=>[
    'GHARVISION — HOME BUILD BUDGET (INDICATIVE)',
    'Project: '+projectName,
    'Built-up area: '+builtArea.toLocaleString('en-IN')+' sq. ft.',
    'Specification: '+tiers[tier].label+' | Location: '+city+' | Contingency: '+contingency+'%',
    '',
    ...items.map(item=>item.name+': '+money(Math.max(0,Number(item.rate)||0)*builtArea*tiers[tier].multiplier*locationFactor)),
    '',
    'Estimated subtotal: '+money(subtotal),
    'Contingency reserve: '+money(reserve),
    'Planning total: '+money(total),
    'Indicative rate: '+money(perSqft)+' / sq. ft.',
    '',
    'Planning estimate only. Validate quantities, taxes, labour and supplier quotes locally.'
  ].join('\n')
  const exportCsv=()=>{const rows=[['Category','Rate per sq ft','Estimated amount INR'],...items.map(item=>[item.name,item.rate,Math.round(Math.max(0,Number(item.rate)||0)*builtArea*tiers[tier].multiplier*locationFactor)]),['Subtotal','',Math.round(subtotal)],['Contingency',''+contingency+'%',Math.round(reserve)],['Planning total','',Math.round(total)]];const csv=rows.map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='gharvision-build-budget.csv';a.click();URL.revokeObjectURL(url);setMessage('Budget CSV exported.')}
  const copy=async()=>{try{await navigator.clipboard.writeText(report());setMessage('Budget summary copied.')}catch{setMessage('Copy is unavailable in this browser. Use Export CSV instead.')}}
  return <div className="budget-page">
    <section className="budget-heading"><div><p className="eyebrow"><Calculator size={14}/> PHASE 11 · PLAN WITH CONFIDENCE</p><h1>Home build budget</h1><p className="heading-subtitle">Build a practical first estimate before you commit to materials or contractors.</p></div><div className="budget-heading-actions"><button className="filter-button" onClick={reset}><RotateCcw size={15}/> Reset</button><button className="primary-button" onClick={save}><Save size={15}/> Save estimate</button></div></section>
    <section className="budget-summary">
      <article className="budget-total-card"><div className="budget-total-top"><span className="budget-total-icon"><House size={18}/></span><span className="budget-status"><CheckCircle2 size={12}/> LIVE ESTIMATE</span></div><p>Indicative project budget</p><strong>{money(total)}</strong><div className="budget-total-bottom"><span>{money(perSqft)} / sq. ft.</span><span>{builtArea.toLocaleString('en-IN')} sq. ft. built-up</span></div></article>
      <article className="budget-metric"><span className="budget-metric-icon"><Hammer size={17}/></span><small>Construction subtotal</small><strong>{money(subtotal)}</strong><span>Before contingency reserve</span></article>
      <article className="budget-metric"><span className="budget-metric-icon"><IndianRupee size={17}/></span><small>Contingency reserve</small><strong>{money(reserve)}</strong><span>{contingency}% safety allowance</span></article>
    </section>
    <div className="budget-layout">
      <div className="budget-main">
        <section className="budget-panel">
          <div className="budget-panel-title"><span className="budget-panel-icon"><House size={17}/></span><div><h2>Project basics</h2><p>Change these values to tailor the estimate.</p></div></div>
          <div className="budget-form-grid">
            <label className="budget-field budget-field-wide">Project name<input value={projectName} maxLength={80} onChange={e=>setProjectName(e.target.value)} placeholder="e.g. Family home in Chandigarh"/></label>
            <label className="budget-field">Built-up area per floor (sq. ft.)<input type="number" min="100" max="100000" value={area} onChange={e=>setArea(Math.min(100000,Math.max(0,Number(e.target.value)||0)))}/></label>
            <label className="budget-field">Number of floors<select value={floors} onChange={e=>setFloors(Number(e.target.value))}><option value={1}>Ground floor only</option><option value={2}>Ground + 1</option><option value={3}>Ground + 2</option><option value={4}>Ground + 3</option></select></label>
            <label className="budget-field">Location cost band<select value={city} onChange={e=>setCity(e.target.value)}><option>Small town</option><option>Tier 2 city</option><option>Metro city</option></select></label>
            <label className="budget-field">Finish level<select value={tier} onChange={e=>setTier(e.target.value)}>{Object.entries(tiers).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}</select><small>{tiers[tier].desc}</small></label>
          </div>
          <div className="budget-area-note"><Info size={15}/><span>Built-up area is calculated as area per floor × number of floors: <strong>{builtArea.toLocaleString('en-IN')} sq. ft.</strong></span></div>
        </section>
        <section className="budget-panel">
          <div className="budget-panel-title"><span className="budget-panel-icon"><Wrench size={17}/></span><div><h2>Cost breakdown</h2><p>Edit sample rates to match local quotes (INR per built-up sq. ft.).</p></div></div>
          <div className="budget-cost-table"><div className="budget-cost-header"><span>Work category</span><span>Rate / sq. ft.</span><span>Estimated amount</span></div>{items.map(item=><div className="budget-cost-row" key={item.id}><div className="budget-cost-name"><strong>{item.name}</strong><small>{item.note}</small></div><label className="budget-rate-field"><span className="budget-mobile-label">Rate / sq. ft.</span><span>₹</span><input type="number" min="0" max="100000" value={item.rate} onChange={e=>updateItem(item.id,Math.min(100000,Number(e.target.value)||0))} aria-label={item.name+' rate per square foot'}/></label><strong className="budget-line-total">{money(Math.max(0,Number(item.rate)||0)*builtArea*tiers[tier].multiplier*locationFactor)}</strong></div>)}</div>
          <div className="budget-contingency-row"><label htmlFor="budget-contingency">Contingency reserve</label><div><input id="budget-contingency" type="number" min="0" max="40" value={contingency} onChange={e=>setContingency(Math.min(40,Math.max(0,Number(e.target.value)||0)))}/><span>%</span></div></div>
        </section>
      </div>
      <aside className="budget-side">
        <section className="budget-panel budget-breakdown-panel"><div className="budget-panel-title"><span className="budget-panel-icon"><Calculator size={17}/></span><div><h2>Estimate summary</h2><p>Where your money may go</p></div></div>
          <div className="budget-donut" role="img" aria-label="Illustrative breakdown of construction costs"><div><strong>{money(subtotal)}</strong><span>base estimate</span></div></div>
          <div className="budget-group-list">{Object.entries(grouped).map(([group,value])=><div className="budget-group-row" key={group}><span><i style={{width:(subtotal?value/subtotal*100:0)+'%'}}/>{group}</span><strong>{money(value)}</strong></div>)}</div>
          <div className="budget-final-total"><span>Estimated subtotal</span><strong>{money(subtotal)}</strong><span>Contingency reserve</span><strong>{money(reserve)}</strong><div/><span>Planning total</span><strong>{money(total)}</strong></div>
          <button className="primary-button budget-action-button" onClick={save}><Save size={15}/> Save on this device</button><button className="filter-button budget-action-button" onClick={exportCsv}><Download size={15}/> Export CSV</button><button className="filter-button budget-action-button" onClick={copy}><Copy size={15}/> Copy summary</button>
          {savedAt&&<p className="budget-saved-note">Last saved {new Date(savedAt).toLocaleString('en-IN')}</p>}
        </section>
      </aside>
    </div>
    <div className="budget-disclaimer"><Info size={17}/><p><strong>Important:</strong> This is an early planning estimate using editable sample rates—not a contractor quotation. Actual costs vary by soil and foundation, structural design, city, material brands, labour, taxes, approvals, site conditions and specification. Land cost, professional fees, financing and major utility connections are not included. Get an architect/engineer and local contractors to validate the design and rates before spending.</p></div>
    {message&&<div className="budget-message" role="status">{message}<button onClick={()=>setMessage('')} aria-label="Dismiss message">×</button></div>}
  </div>
}
