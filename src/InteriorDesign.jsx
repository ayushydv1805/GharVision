import { useEffect, useMemo, useState } from 'react'
import { Armchair, BedDouble, Check, Copy, Download, Lamp, Leaf, Plus, Sofa, Sparkles, Trash2, WandSparkles } from 'lucide-react'

const styles = {
  'Warm minimal': { colors:['#E9E0D3','#B5A18A','#6E7966','#F7F3EB'], description:'Soft neutrals, tactile linen, natural wood and calm silhouettes.' },
  'Modern Indian': { colors:['#D9B69A','#A75D42','#E9D9C5','#3F5447'], description:'Earthy colours, handcrafted details, layered textures and contemporary lines.' },
  'Scandinavian': { colors:['#F1EFE7','#C6D1C1','#D6B99A','#66756B'], description:'Light woods, practical pieces, gentle contrast and uncluttered spaces.' },
  'Modern luxury': { colors:['#D8D0C2','#343B37','#B6A17A','#F6F2E9'], description:'Refined shapes, deep accents, warm metals and balanced statement pieces.' },
  'Rustic natural': { colors:['#C9B398','#8D684C','#737B5B','#E6D9C5'], description:'Organic materials, visible grain, plants and relaxed, lived-in character.' },
}
const roomPresets = {
  'Living room': [{name:'Three-seat sofa',icon:'sofa',zone:'Seating',price:42000},{name:'Coffee table',icon:'table',zone:'Center',price:8500},{name:'Floor lamp',icon:'lamp',zone:'Lighting',price:4800},{name:'Area rug',icon:'rug',zone:'Textiles',price:6500},{name:'Media console',icon:'cabinet',zone:'Storage',price:12500},{name:'Indoor plant',icon:'plant',zone:'Decor',price:1800}],
  Bedroom: [{name:'Queen bed frame',icon:'bed',zone:'Sleep',price:28000},{name:'Bedside table',icon:'table',zone:'Storage',price:4200},{name:'Bedside lamp',icon:'lamp',zone:'Lighting',price:2200},{name:'Wardrobe',icon:'cabinet',zone:'Storage',price:32000},{name:'Area rug',icon:'rug',zone:'Textiles',price:5500},{name:'Indoor plant',icon:'plant',zone:'Decor',price:1500}],
  Kitchen: [{name:'Dining table',icon:'table',zone:'Dining',price:18000},{name:'Dining chair',icon:'chair',zone:'Seating',price:3500},{name:'Pendant light',icon:'lamp',zone:'Lighting',price:4200},{name:'Storage cabinet',icon:'cabinet',zone:'Storage',price:14500},{name:'Counter stools',icon:'chair',zone:'Seating',price:6800},{name:'Herb planter',icon:'plant',zone:'Decor',price:900}],
  'Home office': [{name:'Work desk',icon:'table',zone:'Work',price:9500},{name:'Ergonomic chair',icon:'chair',zone:'Seating',price:11500},{name:'Desk lamp',icon:'lamp',zone:'Lighting',price:1800},{name:'Bookcase',icon:'cabinet',zone:'Storage',price:7800},{name:'Area rug',icon:'rug',zone:'Textiles',price:3500},{name:'Indoor plant',icon:'plant',zone:'Decor',price:1200}],
}
const formatINR = n => '₹' + Number(n).toLocaleString('en-IN')
const loadSaved = () => { try { const raw=localStorage.getItem('gharvision-interior-board'); const parsed=raw?JSON.parse(raw):null; if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}; return Object.fromEntries(Object.entries(parsed).filter(([key,value]) => typeof key === 'string' && Array.isArray(value) && value.every(item => typeof item === 'string'))) } catch { return {} } }
function ItemIcon({type,size=17}) {
  const common={size,strokeWidth:1.7}
  if(type==='sofa') return <Sofa {...common}/>
  if(type==='bed') return <BedDouble {...common}/>
  if(type==='lamp') return <Lamp {...common}/>
  if(type==='plant') return <Leaf {...common}/>
  return <Armchair {...common}/>
}
export default function InteriorDesign() {
  const [room,setRoom]=useState('Living room')
  const [style,setStyle]=useState('Warm minimal')
  const [budget,setBudget]=useState('Mid-range')
  const [saved,setSaved]=useState(loadSaved)
  const [checked,setChecked]=useState({})
  const [toast,setToast]=useState('')
  const items=roomPresets[room]
  const styleData=styles[style]
  const savedIds=saved[room+'|'+style]||[]
  const selectedItems=items.filter(item=>savedIds.includes(item.name))
  const budgetMultiplier=budget==='Budget-friendly'?0.65:budget==='Premium'?1.7:1
  const estimate=selectedItems.reduce((sum,item)=>sum+item.price,0)*budgetMultiplier
  const boardText=useMemo(()=>[
    'GHARVISION — INTERIOR DESIGN BOARD',
    'Room: '+room,
    'Design style: '+style,
    'Budget level: '+budget,
    'Design direction: '+styleData.description,
    'Palette: '+styleData.colors.join(' · '),
    '',
    'SELECTED FURNITURE & DECOR',
    ...(selectedItems.length?selectedItems.map(item=>item.name+' ('+item.zone+') — indicative '+formatINR(item.price*budgetMultiplier)):['No furniture or decor selected yet']),
    '',
    'Indicative selected-items estimate: '+formatINR(estimate),
    'Prices are illustrative planning estimates, not live quotes. Measure your room and verify product prices before buying.'
  ].join('\n'),[room,style,budget,styleData,selectedItems,budgetMultiplier,estimate])
  useEffect(()=>{try{localStorage.setItem('gharvision-interior-board',JSON.stringify(saved))}catch{}},[saved])
  const toggleItem=name=>setSaved(prev=>{const key=room+'|'+style;const current=prev[key]||[];return {...prev,[key]:current.includes(name)?current.filter(x=>x!==name):[...current,name]}})
  const exportBoard=()=>{const blob=new Blob([boardText],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='gharvision-interior-board.txt';document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000)}
  const copyBoard=async()=>{try{await navigator.clipboard.writeText(boardText);setToast('Design board copied to clipboard.')}catch{exportBoard();setToast('Clipboard unavailable — downloaded your board instead.')}window.setTimeout(()=>setToast(''),2800)}
  const clearBoard=()=>setSaved(prev=>({...prev,[room+'|'+style]:[]} ))
  return <div className="interior-page">
    <section className="planner-heading interior-heading"><div><p className="eyebrow"><Sparkles size={13}/> PHASE 07 · MAKE THE ROOM YOURS</p><h1>Interior design studio</h1><p className="heading-subtitle">Choose a mood, curate the pieces, and shape a room that feels like home.</p></div><div className="planner-heading-actions"><button className="filter-button" onClick={copyBoard}><Copy size={15}/> Copy board</button><button className="primary-button" onClick={exportBoard}><Download size={15}/> Export board</button></div></section>
    <section className="interior-controls"><label>Room to design<select value={room} onChange={e=>setRoom(e.target.value)}><option>Living room</option><option>Bedroom</option><option>Kitchen</option><option>Home office</option></select></label><label>Design style<select value={style} onChange={e=>setStyle(e.target.value)}>{Object.keys(styles).map(s=><option key={s}>{s}</option>)}</select></label><label>Budget range<select value={budget} onChange={e=>setBudget(e.target.value)}><option>Budget-friendly</option><option>Mid-range</option><option>Premium</option></select></label></section>
    <section className="interior-hero"><div className="interior-hero-copy"><p className="eyebrow">YOUR ROOM, REIMAGINED</p><h2>{style}<br/><em>{room.toLowerCase()}</em></h2><p>{styleData.description}</p><div className="interior-palette">{styleData.colors.map((c,i)=><span key={c} title={c} style={{background:c}}><small>{['01','02','03','04'][i]}</small></span>)}</div><small className="interior-palette-caption">A starting palette — test samples in your own light.</small></div><div className="interior-room-visual" aria-label={'Illustrative room concept for '+room}><div className="interior-wall"><div className="interior-art"><span/><span/><span/></div><div className="interior-window"><i/><i/><i/></div></div><div className="interior-floor"/><div className="interior-rug"/><div className="interior-sofa"><i/><i/><i/></div><div className="interior-side-table"/><div className="interior-plant"><i/><i/><i/><b/></div><div className="interior-lamp"><i/><b/></div><span className="interior-visual-label">CONCEPTUAL MOODBOARD · NOT TO SCALE</span></div></section>
    <section className="interior-library"><div className="interior-section-heading"><div><p className="eyebrow">01 / CURATE YOUR ROOM</p><h2>Furniture & decor</h2><p>Save the pieces you want in this room and style combination.</p></div><button className="filter-button" onClick={clearBoard}><Trash2 size={14}/> Clear selection</button></div><div className="interior-items-grid">{items.map(item=>{const active=savedIds.includes(item.name);return <article className={'interior-item '+(active?'interior-item-active':'')} key={item.name}><div className={'interior-item-icon interior-icon-'+item.icon}><ItemIcon type={item.icon} size={21}/></div><div className="interior-item-content"><span>{item.zone}</span><h3>{item.name}</h3><strong>{formatINR(item.price)}</strong><small>Indicative item budget</small></div><button className={active?'interior-add interior-added':'interior-add'} onClick={()=>toggleItem(item.name)} aria-label={(active?'Remove ':'Add ')+item.name} aria-pressed={active}>{active?<Check size={16}/>:<Plus size={16}/>}</button></article>})}</div></section>
    <section className="interior-bottom-grid"><div className="interior-library interior-board"><div className="interior-section-heading"><div><p className="eyebrow">02 / YOUR SHORTLIST</p><h2>Saved for this room</h2><p>{selectedItems.length} pieces selected for your {room.toLowerCase()}.</p></div><span className="interior-count">{selectedItems.length} items</span></div>{selectedItems.length?<div className="interior-saved-list">{selectedItems.map(item=><div key={item.name} className="interior-saved-item"><span className="interior-saved-icon"><ItemIcon type={item.icon} size={16}/></span><span>{item.name}<small>{item.zone}</small></span><strong>{formatINR(item.price*budgetMultiplier)}</strong><button onClick={()=>toggleItem(item.name)} aria-label={'Remove '+item.name}><Trash2 size={14}/></button></div>)}</div>:<div className="interior-empty"><Armchair size={25}/><strong>Your shortlist starts here</strong><p>Add a few pieces above to build your room board.</p></div>}</div>
      <aside className="interior-estimate"><p className="eyebrow">03 / PLAN YOUR SPEND</p><h2>Room budget</h2><p>Selected furniture and decor, using sample prices and your chosen budget level.</p><div className="interior-estimate-total"><span>Indicative total</span><strong>{formatINR(estimate)}</strong><small>{selectedItems.length} selected items · {budget}</small></div><div className="interior-checklist-title">Before you buy</div>{['Measure doorways and room dimensions','Check delivery and assembly charges','Confirm fabric and finish samples','Leave clear walking paths'].map((task,i)=><label className="interior-check-row" key={task}><input type="checkbox" checked={!!checked[room+'|'+task]} onChange={e=>setChecked(prev=>({...prev,[room+'|'+task]:e.target.checked}))}/><span>{task}</span></label>)}<p className="interior-disclaimer">Planning only: sample rates are not supplier quotes. No products are purchased or reserved by this tool.</p></aside></section>
    {toast&&<div className="interior-toast"><Check size={14}/>{toast}<button onClick={()=>setToast('')} aria-label="Dismiss notification">×</button></div>}
  </div>
}
