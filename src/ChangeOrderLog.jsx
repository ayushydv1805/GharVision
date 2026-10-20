import { useEffect, useMemo, useState } from 'react'
import { ClipboardList, Plus, Trash2, Download, Search, CircleDollarSign, CalendarClock, CheckCircle2, FileText } from 'lucide-react'

const KEY='gharvision-change-orders-v1'
const CATEGORIES=['Design change','Material substitution','Additional work','Omission / credit','Site condition','Schedule change','Other']
const STATUSES=['Proposed','Under review','Approved','Rejected','Implemented']
const SAMPLE=[
 {id:'change-example-1',title:'Example: Upgrade kitchen countertop',category:'Material substitution',status:'Proposed',requestedBy:'Homeowner',date:'',cost:18000,days:2,notes:'Example only — replace or delete this sample.'},
 {id:'change-example-2',title:'Example: Add extra outdoor light point',category:'Additional work',status:'Under review',requestedBy:'Contractor',date:'',cost:4500,days:1,notes:'Confirm scope, materials and timeline before approval.'}
]
const money=n=>'₹'+(Number(n)||0).toLocaleString('en-IN',{maximumFractionDigits:2})
const csvCell=v=>'"'+String(v??'').replaceAll('"','""')+'"'

export default function ChangeOrderLog(){
 const [items,setItems]=useState(()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?x.filter(i=>i&&typeof i.title==='string'):SAMPLE}catch{return SAMPLE}})
 const [draft,setDraft]=useState({title:'',category:'Design change',status:'Proposed',requestedBy:'',date:'',cost:'0',days:'0',notes:''})
 const [query,setQuery]=useState('')
 const [filter,setFilter]=useState('All')
 const [notice,setNotice]=useState('')
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch{setNotice('Browser storage is unavailable. Export a CSV backup before leaving this page.')}},[items])
 const filtered=useMemo(()=>items.filter(i=>(filter==='All'||i.status===filter)&&[i.title,i.category,i.requestedBy,i.notes].join(' ').toLowerCase().includes(query.toLowerCase())),[items,filter,query])
 const pending=items.filter(i=>['Proposed','Under review'].includes(i.status))
 const approved=items.filter(i=>['Approved','Implemented'].includes(i.status))
 const exposure=items.filter(i=>!['Rejected'].includes(i.status)).reduce((s,i)=>s+(Number(i.cost)||0),0)
 const approvedCost=approved.reduce((s,i)=>s+(Number(i.cost)||0),0)
 const delay=items.filter(i=>!['Rejected'].includes(i.status)).reduce((s,i)=>s+(Number(i.days)||0),0)
 const update=(id,patch)=>setItems(prev=>prev.map(i=>i.id===id?{...i,...patch}:i))
 const add=e=>{e.preventDefault();if(!draft.title.trim()){setNotice('Add a clear change description first.');return}const cost=Number(draft.cost),days=Number(draft.days);if(!Number.isFinite(cost)||cost<0||!Number.isFinite(days)||days<0){setNotice('Cost and schedule impact must be zero or positive.');return}setItems(prev=>[{...draft,id:'change-'+Date.now(),title:draft.title.trim(),requestedBy:draft.requestedBy.trim(),notes:draft.notes.trim(),cost,days},...prev]);setDraft({title:'',category:'Design change',status:'Proposed',requestedBy:'',date:'',cost:'0',days:'0',notes:''});setNotice('Change request added on this device.')}
 const exportCsv=()=>{const cols=['title','category','status','requestedBy','date','cost','days','notes'];const data=[cols.join(','),...items.map(i=>cols.map(k=>csvCell(i[k])).join(','))].join('\n');const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='gharvision-change-order-log.csv';document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return <section className="change-page">
  <div className="change-heading"><div><p className="eyebrow">PHASE 27 · MAKE SCOPE CHANGES VISIBLE</p><h1>Change order & decision log</h1><p className="heading-subtitle">Keep design changes, extra work and material substitutions documented before they quietly affect your budget or timeline.</p></div><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button></div>
  <div className="change-stats">
   <article><span><FileText size={18}/></span><div><small>TOTAL CHANGE REQUESTS</small><strong>{items.length}</strong><p>Items in the change register</p></div></article>
   <article><span><CalendarClock size={18}/></span><div><small>AWAITING DECISION</small><strong>{pending.length}</strong><p>Proposed or under review</p></div></article>
   <article><span><CircleDollarSign size={18}/></span><div><small>APPROVED / IMPLEMENTED</small><strong>{money(approvedCost)}</strong><p>Recorded cost impact</p></div></article>
   <article className={exposure>0?'change-stat-alert':''}><span><ClipboardList size={18}/></span><div><small>NON-REJECTED EXPOSURE</small><strong>{money(exposure)}</strong><p>Includes proposals not yet decided</p></div></article>
  </div>
  <div className="change-impact-strip"><div><span>Potential schedule impact</span><strong>{delay} day{delay===1?'':'s'}</strong><small>Sum of non-rejected requests; not a forecast of the final completion date.</small></div><div><span>Decision discipline</span><strong>Document before work</strong><small>Confirm scope, cost, schedule and approval with the relevant parties before authorising a change.</small></div></div>
  <div className="change-layout">
   <form className="change-form" onSubmit={add}><div className="change-form-title"><Plus size={18}/><div><h2>Record a change</h2><p>Capture the request and its estimated impact.</p></div></div>
    <label>Change description<input required maxLength={160} value={draft.title} onChange={e=>setDraft(p=>({...p,title:e.target.value}))} placeholder="e.g. Replace floor tile in living room"/></label>
    <label>Change type<select value={draft.category} onChange={e=>setDraft(p=>({...p,category:e.target.value}))}>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></label>
    <div className="change-two"><label>Initial status<select value={draft.status} onChange={e=>setDraft(p=>({...p,status:e.target.value}))}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></label><label>Request date<input type="date" value={draft.date} onChange={e=>setDraft(p=>({...p,date:e.target.value}))}/></label></div>
    <div className="change-two"><label>Cost impact (₹)<input type="number" min="0" step="0.01" value={draft.cost} onChange={e=>setDraft(p=>({...p,cost:e.target.value}))}/></label><label>Schedule impact (days)<input type="number" min="0" step="1" value={draft.days} onChange={e=>setDraft(p=>({...p,days:e.target.value}))}/></label></div>
    <label>Requested by (optional)<input maxLength={100} value={draft.requestedBy} onChange={e=>setDraft(p=>({...p,requestedBy:e.target.value}))} placeholder="Homeowner / designer / contractor"/></label>
    <label>Decision notes / reference<textarea rows="3" maxLength={1200} value={draft.notes} onChange={e=>setDraft(p=>({...p,notes:e.target.value}))} placeholder="Reason, quote reference, agreed scope or conditions"/></label>
    <button className="primary-button change-submit" type="submit"><Plus size={16}/> Add change request</button>
    <p className="change-note">Amounts and days are estimates entered by you. The log does not issue contractual approvals or replace your signed agreement.</p>
   </form>
   <div className="change-list-panel"><div className="change-list-head"><div><h2>Change register</h2><p>{filtered.length} of {items.length} requests</p></div><button className="filter-button" onClick={()=>{setQuery('');setFilter('All')}}>Clear filters</button></div>
    <div className="change-tools"><label className="change-search"><Search size={15}/><input aria-label="Search change requests" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search request, type, person"/></label><select aria-label="Filter change requests by status" value={filter} onChange={e=>setFilter(e.target.value)}>{['All',...STATUSES].map(x=><option key={x}>{x}</option>)}</select></div>
    {notice&&<p className="change-notice" role="status">{notice}</p>}
    {!filtered.length?<div className="change-empty"><ClipboardList size={26}/><strong>No matching change requests</strong><span>Clear the filters or add a new request.</span></div>:<div className="change-items">{filtered.map(item=><article className="change-item" key={item.id}><div className="change-item-main"><div className="change-item-title"><h3>{item.title}</h3><span className={'change-status status-'+item.status.toLowerCase().replaceAll(' ','-')}>{item.status}</span></div><p>{item.category}{item.requestedBy?' · Requested by '+item.requestedBy:''}{item.date?' · '+item.date:''}</p><div className="change-impact-values"><span>Cost impact <strong>{money(item.cost)}</strong></span><span>Schedule <strong>{Number(item.days)||0} day(s)</strong></span></div>{item.notes&&<small>{item.notes}</small>}<div className="change-item-controls"><label>Status<select aria-label={'Status for '+item.title} value={item.status} onChange={e=>update(item.id,{status:e.target.value})}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></label><label>Cost impact (₹)<input aria-label={'Cost impact for '+item.title} type="number" min="0" step="0.01" value={item.cost??0} onChange={e=>update(item.id,{cost:Math.max(0,Number(e.target.value)||0)})}/></label><label>Days<input aria-label={'Schedule impact for '+item.title} type="number" min="0" step="1" value={item.days??0} onChange={e=>update(item.id,{days:Math.max(0,Number(e.target.value)||0)})}/></label></div></div><button type="button" className="change-delete" aria-label={'Delete '+item.title} onClick={()=>setItems(prev=>prev.filter(x=>x.id!==item.id))}><Trash2 size={16}/></button></article>)}</div>}
    <p className="change-disclaimer">Stored in this browser on this device. Export CSV for a backup. No contractor is contacted, no quote is verified, and no notification or cloud sync is provided.</p>
   </div>
  </div>
 </section>
}
