import { useEffect, useMemo, useState } from 'react'
import { ClipboardCheck, Plus, Trash2, Download, Search, CheckCircle2, AlertTriangle, Clock3, CircleDot } from 'lucide-react'

const KEY = 'gharvision-handover-checklist-v1'
const AREAS = ['Whole home','Living room','Kitchen','Bedroom','Bathroom','Balcony / terrace','Exterior','Electrical','Plumbing','Doors & windows','Flooring','Paint & finish','Other']
const SEVERITIES = ['Low','Medium','High','Critical']
const STATUSES = ['Open','In progress','Ready to verify','Resolved','Accepted / deferred']
const SAMPLE = [
  {id:'snag-example-1',title:'Example: Check paint finish near doorway',area:'Paint & finish',severity:'Low',status:'Open',due:'',assigned:'',notes:'Example only — replace or delete this item.'},
  {id:'snag-example-2',title:'Example: Test all kitchen sockets',area:'Electrical',severity:'High',status:'Open',due:'',assigned:'',notes:'Have electrical work checked by a qualified professional.'}
]
const today = () => { const d = new Date(); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-') }
const escapeCsv = v => '"' + String(v ?? '').replaceAll('"','""') + '"'

export default function HandoverChecklist() {
 const [items,setItems] = useState(()=>{try{const value=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(value)?value.filter(x=>x&&typeof x.title==='string'):SAMPLE}catch{return SAMPLE}})
 const [draft,setDraft] = useState({title:'',area:'Whole home',severity:'Medium',status:'Open',due:'',assigned:'',notes:''})
 const [query,setQuery] = useState('')
 const [filter,setFilter] = useState('All')
 const [notice,setNotice] = useState('')
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch{setNotice('Browser storage is unavailable. Export a CSV backup before leaving this page.')}},[items])
 const filtered=useMemo(()=>items.filter(x=>(filter==='All'||x.status===filter||x.severity===filter)&&[x.title,x.area,x.assigned,x.notes].join(' ').toLowerCase().includes(query.toLowerCase())),[items,filter,query])
 const unresolved=items.filter(x=>!['Resolved','Accepted / deferred'].includes(x.status))
 const critical=unresolved.filter(x=>['High','Critical'].includes(x.severity))
 const overdue=unresolved.filter(x=>x.due&&x.due<today())
 const resolved=items.filter(x=>x.status==='Resolved')
 const add=e=>{e.preventDefault();if(!draft.title.trim()){setNotice('Enter a clear issue or inspection item.');return}setItems(prev=>[{...draft,id:'snag-'+Date.now(),title:draft.title.trim(),assigned:draft.assigned.trim(),notes:draft.notes.trim()},...prev]);setDraft({title:'',area:'Whole home',severity:'Medium',status:'Open',due:'',assigned:'',notes:''});setNotice('Inspection item added on this device.')}
 const update=(id,patch)=>setItems(prev=>prev.map(x=>x.id===id?{...x,...patch}:x))
 const exportCsv=()=>{const cols=['title','area','severity','status','due','assigned','notes'];const csv=[cols.join(','),...items.map(x=>cols.map(k=>escapeCsv(x[k])).join(','))].join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='gharvision-handover-checklist.csv';document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return <section className="handover-page">
  <div className="handover-heading"><div><p className="eyebrow">PHASE 26 · INSPECT BEFORE YOU ACCEPT</p><h1>Home handover & snag list</h1><p className="heading-subtitle">Capture unfinished work, defects and checks room by room before signing off a new build or renovation.</p></div><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button></div>
  <div className="handover-stats"><article><span><ClipboardCheck size={18}/></span><div><small>TOTAL ITEMS</small><strong>{items.length}</strong><p>Recorded inspection points</p></div></article><article><span><CircleDot size={18}/></span><div><small>STILL OPEN</small><strong>{unresolved.length}</strong><p>Need action or a decision</p></div></article><article className={critical.length?'handover-stat-alert':''}><span><AlertTriangle size={18}/></span><div><small>HIGH PRIORITY</small><strong>{critical.length}</strong><p>High or critical and unresolved</p></div></article><article className={overdue.length?'handover-stat-alert':''}><span><Clock3 size={18}/></span><div><small>PAST DUE</small><strong>{overdue.length}</strong><p>Unresolved items past due date</p></div></article></div>
  <div className="handover-progress"><div><span>Inspection close-out</span><strong>{items.length?Math.round(resolved.length/items.length*100):0}% resolved</strong></div><div className="handover-progress-track"><span style={{width:(items.length?resolved.length/items.length*100:0)+'%'}}/></div><small>Only items marked “Resolved” count as complete. Accepted / deferred items remain visible in the register.</small></div>
  <div className="handover-layout">
   <form className="handover-form" onSubmit={add}><div className="handover-form-title"><Plus size={18}/><div><h2>Add inspection item</h2><p>Describe one issue clearly so it can be verified later.</p></div></div>
    <label>Issue / check description<input value={draft.title} onChange={e=>setDraft(p=>({...p,title:e.target.value}))} maxLength={140} placeholder="e.g. Bathroom tap is leaking" required/></label>
    <label>Area or trade<select value={draft.area} onChange={e=>setDraft(p=>({...p,area:e.target.value}))}>{AREAS.map(x=><option key={x}>{x}</option>)}</select></label>
    <div className="handover-two"><label>Severity<select value={draft.severity} onChange={e=>setDraft(p=>({...p,severity:e.target.value}))}>{SEVERITIES.map(x=><option key={x}>{x}</option>)}</select></label><label>Target date<input type="date" value={draft.due} onChange={e=>setDraft(p=>({...p,due:e.target.value}))}/></label></div>
    <label>Assigned to (optional)<input value={draft.assigned} onChange={e=>setDraft(p=>({...p,assigned:e.target.value}))} maxLength={100} placeholder="Contractor / person"/></label>
    <label>Notes / evidence reference<textarea rows="3" maxLength={1000} value={draft.notes} onChange={e=>setDraft(p=>({...p,notes:e.target.value}))} placeholder="Location, measurements, photo filename or promised fix"/></label>
    <button className="primary-button handover-submit" type="submit"><Plus size={16}/> Add inspection item</button>
    <p className="handover-note">For structural, electrical, gas or water-safety concerns, use a qualified professional. This checklist is a record-keeping aid, not a technical inspection.</p>
   </form>
   <div className="handover-list-panel"><div className="handover-list-head"><div><h2>Inspection register</h2><p>{filtered.length} of {items.length} items</p></div><button className="filter-button" onClick={()=>{setQuery('');setFilter('All')}}>Clear filters</button></div>
    <div className="handover-tools"><label className="handover-search"><Search size={15}/><input aria-label="Search inspection items" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search issue, area or person"/></label><select aria-label="Filter inspection items" value={filter} onChange={e=>setFilter(e.target.value)}>{['All',...STATUSES,...SEVERITIES].map(x=><option key={x}>{x}</option>)}</select></div>
    {notice&&<p className="handover-notice" role="status">{notice}</p>}
    {!filtered.length?<div className="handover-empty"><ClipboardCheck size={26}/><strong>No matching inspection items</strong><span>Try clearing filters or add a new item.</span></div>:<div className="handover-items">{filtered.map(item=><article className="handover-item" key={item.id}><div className="handover-item-main"><div className="handover-item-title"><h3>{item.title}</h3><span className={'handover-severity severity-'+item.severity.toLowerCase()}>{item.severity}</span></div><p>{item.area}{item.assigned?' · Assigned: '+item.assigned:''}{item.due?' · Due '+item.due:''}</p>{item.notes&&<small>{item.notes}</small>}<div className="handover-item-controls"><label>Status<select aria-label={'Status for '+item.title} value={item.status} onChange={e=>update(item.id,{status:e.target.value})}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></label><label>Severity<select aria-label={'Severity for '+item.title} value={item.severity} onChange={e=>update(item.id,{severity:e.target.value})}>{SEVERITIES.map(x=><option key={x}>{x}</option>)}</select></label><label>Target date<input aria-label={'Target date for '+item.title} type="date" value={item.due||''} onChange={e=>update(item.id,{due:e.target.value})}/></label></div></div><button type="button" className="handover-delete" aria-label={'Delete '+item.title} onClick={()=>setItems(prev=>prev.filter(x=>x.id!==item.id))}><Trash2 size={16}/></button></article>)}</div>}
    <p className="handover-disclaimer">Data stays in this browser on this device. Use CSV export for a backup or to share the list. This tool does not contact contractors, send reminders, store photos, or certify that a home is safe or compliant.</p>
   </div>
  </div>
 </section>
}
