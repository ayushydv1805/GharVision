import { useEffect, useMemo, useState } from 'react'
import { Wallet, Plus, Trash2, Download, Search, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

const KEY = 'gharvision-home-budget-v1'
const CATEGORIES = ['Construction','Interior design','Furniture','Appliances','Electrical','Plumbing','Flooring & tiles','Paint & finishes','Landscaping','Labour','Permits & fees','Repairs','Other']
const SAMPLE = [
 {id:'budget-example-1',name:'Example: Initial consultation',category:'Construction',planned:5000,actual:0,status:'Planned',date:'',vendor:'',notes:'Example only — replace or delete this entry.'}
]
const cash = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(value)||0)
const safeNum = value => Number.isFinite(Number(value)) && Number(value)>=0 ? Number(value) : 0

export default function HomeBudgetPlanner() {
 const [items,setItems] = useState(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(v)?v.filter(x=>x&&typeof x.name==='string'):SAMPLE}catch{return SAMPLE}})
 const [draft,setDraft] = useState({name:'',category:'Construction',planned:'',actual:'0',status:'Planned',date:'',vendor:'',notes:''})
 const [query,setQuery] = useState('')
 const [filter,setFilter] = useState('All')
 const [notice,setNotice] = useState('')
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch{setNotice('Browser storage is unavailable. Export a CSV backup before leaving this page.')}},[items])
 const filtered=useMemo(()=>items.filter(x=>(filter==='All'||x.status===filter||x.category===filter)&&[x.name,x.category,x.vendor,x.notes].join(' ').toLowerCase().includes(query.toLowerCase())),[items,filter,query])
 const planned=items.reduce((s,x)=>s+safeNum(x.planned),0)
 const actual=items.reduce((s,x)=>s+safeNum(x.actual),0)
 const remaining=planned-actual
 const over=items.filter(x=>safeNum(x.actual)>safeNum(x.planned)).length
 const update=(id,patch)=>setItems(prev=>prev.map(x=>x.id===id?{...x,...patch}:x))
 const add=e=>{e.preventDefault();if(!draft.name.trim()){setNotice('Add a name for this budget item.');return}if(draft.planned===''||!Number.isFinite(Number(draft.planned))||Number(draft.planned)<0||draft.actual===''||!Number.isFinite(Number(draft.actual))||Number(draft.actual)<0){setNotice('Planned and actual costs must be valid non-negative amounts.');return}setItems(prev=>[{...draft,id:'budget-'+Date.now(),name:draft.name.trim(),planned:Number(draft.planned),actual:Number(draft.actual),vendor:draft.vendor.trim(),notes:draft.notes.trim()},...prev]);setDraft({name:'',category:'Construction',planned:'',actual:'0',status:'Planned',date:'',vendor:'',notes:''});setNotice('Budget item added in this browser.')}
 const exportCsv=()=>{const cols=['name','category','planned','actual','status','date','vendor','notes'];const q=v=>'"'+String(v??'').replaceAll('"','""')+'"';const csv=[cols.join(','),...items.map(x=>cols.map(k=>q(x[k])).join(','))].join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='gharvision-home-budget.csv';document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return <section className="budget-page">
  <div className="budget-heading"><div><p className="eyebrow">PHASE 25 · PLAN YOUR SPENDING</p><h1>Home budget planner</h1><p className="heading-subtitle">Compare planned costs with actual spending across your build, renovation or furnishing project.</p></div><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button></div>
  <div className="budget-stats"><div><span>Planned budget</span><strong>{cash(planned)}</strong><small>Across all budget items</small></div><div><span>Actual spending</span><strong>{cash(actual)}</strong><small>Amounts you have entered</small></div><div className={remaining<0?'budget-negative':''}><span>{remaining<0?'Over budget':'Remaining budget'}</span><strong>{cash(Math.abs(remaining))}</strong><small>{remaining<0?'Spending exceeds planned total':'Planned minus actual'}</small></div><div><span>Items over estimate</span><strong>{over}</strong><small>Actual cost exceeds planned</small></div></div>
  <div className="budget-progress" aria-label="Overall budget usage"><div className="budget-progress-copy"><span>Overall budget used</span><strong>{planned>0?Math.round(actual/planned*100):0}%</strong></div><div className="budget-progress-track"><div style={{width:Math.min(100,planned>0?actual/planned*100:0)+'%'}}/></div><small>{planned===0?'Add planned amounts to calculate budget usage.':actual>planned?'Spending is above the planned total.':'Actual spending compared with planned budget.'}</small></div>
  <div className="budget-layout">
   <form className="budget-form" onSubmit={add}><div className="budget-form-title"><Wallet size={19}/><div><h2>Add budget item</h2><p>Track a cost estimate, invoice or purchase.</p></div></div>
    <label>Item / expense name<input value={draft.name} onChange={e=>setDraft(p=>({...p,name:e.target.value}))} maxLength={120} placeholder="e.g. Living room flooring" required/></label>
    <label>Category<select value={draft.category} onChange={e=>setDraft(p=>({...p,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
    <div className="budget-two"><label>Planned cost (₹)<input type="number" min="0" step="0.01" value={draft.planned} onChange={e=>setDraft(p=>({...p,planned:e.target.value}))} placeholder="Estimated amount" required/></label><label>Actual cost (₹)<input type="number" min="0" step="0.01" value={draft.actual} onChange={e=>setDraft(p=>({...p,actual:e.target.value}))} required/></label></div>
    <div className="budget-two"><label>Status<select value={draft.status} onChange={e=>setDraft(p=>({...p,status:e.target.value}))}>{['Planned','Quoted','Approved','Paid','On hold','Cancelled'].map(x=><option key={x}>{x}</option>)}</select></label><label>Date<input type="date" value={draft.date} onChange={e=>setDraft(p=>({...p,date:e.target.value}))}/></label></div>
    <label>Vendor / supplier (optional)<input value={draft.vendor} onChange={e=>setDraft(p=>({...p,vendor:e.target.value}))} maxLength={120} placeholder="Contractor or shop"/></label>
    <label>Notes (optional)<textarea rows="3" maxLength={1000} value={draft.notes} onChange={e=>setDraft(p=>({...p,notes:e.target.value}))} placeholder="Scope, invoice reference or details"/></label>
    <button className="primary-button budget-submit" type="submit"><Plus size={16}/> Add expense</button>
   </form>
   <div className="budget-list-panel"><div className="budget-list-head"><div><h2>Budget breakdown</h2><p>{filtered.length} of {items.length} items</p></div><div className="budget-actions"><label className="budget-search"><Search size={15}/><input aria-label="Search budget items" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search costs"/></label><select aria-label="Filter budget items" value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Planned','Quoted','Approved','Paid','On hold','Cancelled',...CATEGORIES].map(x=><option key={x}>{x}</option>)}</select></div></div>
    {notice&&<p className="budget-notice" role="status">{notice}</p>}
    {filtered.length===0?<div className="budget-empty"><Wallet size={25}/><strong>No matching budget items</strong><span>Try a different search or add an expense.</span></div>:<div className="budget-items">{filtered.map(item=>{const delta=safeNum(item.actual)-safeNum(item.planned);return <article className="budget-item" key={item.id}><div className="budget-item-main"><div className="budget-item-title"><h3>{item.name}</h3><span className={'budget-status budget-'+item.status.toLowerCase().replaceAll(' ','-')}>{item.status}</span></div><p>{item.category}{item.vendor?' · '+item.vendor:''}{item.date?' · '+item.date:''}</p>{item.notes&&<small>{item.notes}</small>}<div className="budget-cost-grid"><label>Planned ₹<input aria-label={'Planned cost for '+item.name} type="number" min="0" step="0.01" value={item.planned} onChange={e=>update(item.id,{planned:e.target.value===''?'':Number(e.target.value)})}/></label><label>Actual ₹<input aria-label={'Actual cost for '+item.name} type="number" min="0" step="0.01" value={item.actual} onChange={e=>update(item.id,{actual:e.target.value===''?'':Number(e.target.value)})}/></label><label>Status<select aria-label={'Status for '+item.name} value={item.status} onChange={e=>update(item.id,{status:e.target.value})}>{['Planned','Quoted','Approved','Paid','On hold','Cancelled'].map(x=><option key={x}>{x}</option>)}</select></label></div><div className="budget-delta"><span>{delta>0?<><AlertCircle size={13}/> Over estimate</>:delta<0?<><TrendingUp size={13}/> Under estimate</>:<><CheckCircle2 size={13}/> On estimate</>}</span><strong className={delta>0?'budget-delta-negative':''}>{cash(Math.abs(delta))} {delta>0?'over':delta<0?'under':'difference'}</strong></div></div><button type="button" className="budget-delete" aria-label={'Delete '+item.name} onClick={()=>setItems(prev=>prev.filter(x=>x.id!==item.id))}><Trash2 size={16}/></button></article>})}</div>}
    <p className="budget-disclaimer">Estimates are user-entered and do not include taxes, financing or unexpected work unless you add them. Records stay in this browser; export CSV for backup. INR (₹) is used for display.</p>
   </div>
  </div>
 </section>
}
