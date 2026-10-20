import { useEffect, useMemo, useState } from 'react'
import { FileText, Plus, Search, Download, Trash2, CalendarClock, AlertTriangle, Archive, CheckCircle2 } from 'lucide-react'

const KEY='gharvision-document-vault-v1'
const TYPES=['Property papers','Floor plan / drawings','Permit / approval','Invoice / receipt','Warranty','Insurance','Contract / quote','Maintenance record','Utility document','Other']
const STATUSES=['Active','Needs review','Archived']
const SAMPLE=[
 {id:'doc-example-1',title:'Example: Property purchase papers',type:'Property papers',reference:'Example reference only',issued:'',expiry:'',status:'Active',notes:'Record where the original is stored; do not enter sensitive ID numbers.'},
 {id:'doc-example-2',title:'Example: Kitchen appliance invoice',type:'Invoice / receipt',reference:'Example reference only',issued:'',expiry:'',status:'Active',notes:'Keep the original invoice and warranty terms in a secure location.'}
]
const localDateString=(date=new Date())=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')
const today=()=>localDateString()
const dateAfter=days=>{const d=new Date();d.setDate(d.getDate()+days);return localDateString(d)}
const csvCell=v=>'"'+String(v??'').replaceAll('"','""')+'"'
export default function HomeDocumentVault(){
 const [docs,setDocs]=useState(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(v)?v.filter(x=>x&&typeof x.title==='string'):SAMPLE}catch{return SAMPLE}})
 const [draft,setDraft]=useState({title:'',type:'Property papers',reference:'',issued:'',expiry:'',status:'Active',notes:''})
 const [query,setQuery]=useState('')
 const [filter,setFilter]=useState('All')
 const [notice,setNotice]=useState('')
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(docs))}catch{setNotice('Browser storage is unavailable. Export a CSV backup before leaving this page.')}},[docs])
 const expiryState=d=>{if(!d.expiry)return 'No expiry date';if(d.expiry<today())return 'Expired / review';const days=Math.ceil((new Date(d.expiry+'T00:00:00')-new Date(today()+'T00:00:00'))/86400000);if(days<=30)return 'Due within 30 days';return 'Not due soon'}
 const active=docs.filter(d=>d.status!=='Archived')
 const expired=active.filter(d=>d.expiry&&d.expiry<today())
 const upcoming=active.filter(d=>d.expiry&&d.expiry>=today()&&d.expiry<=dateAfter(30))
 const filtered=useMemo(()=>docs.filter(d=>(filter==='All'||(filter==='Expiring soon'&&d.expiry&&d.expiry>=today()&&d.expiry<=new Date(Date.now()+30*86400000).toISOString().slice(0,10))||(filter==='Expired'&&d.expiry&&d.expiry<today())||d.type===filter||d.status===filter)&&[d.title,d.type,d.reference,d.notes].join(' ').toLowerCase().includes(query.toLowerCase())),[docs,filter,query])
 const add=e=>{e.preventDefault();if(!draft.title.trim())return;setDocs(p=>[{...draft,id:'doc-'+Date.now(),title:draft.title.trim(),reference:draft.reference.trim(),notes:draft.notes.trim()},...p]);setDraft({title:'',type:'Property papers',reference:'',issued:'',expiry:'',status:'Active',notes:''});setNotice('Document record added on this device.')}
 const update=(id,patch)=>setDocs(p=>p.map(d=>d.id===id?{...d,...patch}:d))
 const exportCsv=()=>{const keys=['title','type','reference','issued','expiry','status','notes'];const csv=[keys.join(','),...docs.map(d=>keys.map(k=>csvCell(d[k])).join(','))].join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='gharvision-document-register.csv';document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return <section className="docvault-page">
  <div className="docvault-heading"><div><p className="eyebrow">PHASE 28 · KEEP HOME RECORDS ORGANISED</p><h1>Home document vault</h1><p className="heading-subtitle">Keep a searchable register of property papers, drawings, permits, invoices, warranties and renewals.</p></div><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button></div>
  <div className="docvault-stats"><article><span><Archive size={18}/></span><div><small>ALL RECORDS</small><strong>{docs.length}</strong><p>Document entries</p></div></article><article><span><CheckCircle2 size={18}/></span><div><small>ACTIVE RECORDS</small><strong>{active.length}</strong><p>Not archived</p></div></article><article className={upcoming.length?'docvault-alert':''}><span><CalendarClock size={18}/></span><div><small>DUE IN 30 DAYS</small><strong>{upcoming.length}</strong><p>Expiry dates to review</p></div></article><article className={expired.length?'docvault-alert':''}><span><AlertTriangle size={18}/></span><div><small>PAST EXPIRY</small><strong>{expired.length}</strong><p>Active records to check</p></div></article></div>
  <div className="docvault-layout">
   <form className="docvault-form" onSubmit={add}><div className="docvault-form-title"><Plus size={18}/><div><h2>Add a document record</h2><p>Store metadata and a reminder—not the private file itself.</p></div></div>
    <label>Document name<input required maxLength={140} value={draft.title} onChange={e=>setDraft(p=>({...p,title:e.target.value}))} placeholder="e.g. Water purifier warranty"/></label>
    <label>Document type<select value={draft.type} onChange={e=>setDraft(p=>({...p,type:e.target.value}))}>{TYPES.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>File location / safe reference<input maxLength={140} value={draft.reference} onChange={e=>setDraft(p=>({...p,reference:e.target.value}))} placeholder="e.g. Folder name or cabinet location"/></label>
    <div className="docvault-two"><label>Issue / purchase date<input type="date" value={draft.issued} onChange={e=>setDraft(p=>({...p,issued:e.target.value}))}/></label><label>Expiry / renewal date<input type="date" value={draft.expiry} onChange={e=>setDraft(p=>({...p,expiry:e.target.value}))}/></label></div>
    <label>Record status<select value={draft.status} onChange={e=>setDraft(p=>({...p,status:e.target.value}))}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Notes<textarea rows="3" maxLength={1000} value={draft.notes} onChange={e=>setDraft(p=>({...p,notes:e.target.value}))} placeholder="What it covers, where originals are kept, follow-up needed"/></label>
    <button className="primary-button docvault-submit" type="submit"><Plus size={16}/> Add record</button>
    <p className="docvault-note">Do not store passwords, full identity numbers, bank details or other secrets here.</p>
   </form>
   <div className="docvault-list-panel"><div className="docvault-list-head"><div><h2>Document register</h2><p>{filtered.length} of {docs.length} records</p></div><button className="filter-button" onClick={()=>{setQuery('');setFilter('All')}}>Clear filters</button></div>
    <div className="docvault-tools"><label className="docvault-search"><Search size={15}/><input aria-label="Search documents" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title, type or notes"/></label><select aria-label="Filter documents" value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Expiring soon','Expired',...TYPES,...STATUSES].map(x=><option key={x}>{x}</option>)}</select></div>
    {notice&&<p role="status" className="docvault-notice">{notice}</p>}
    {!filtered.length?<div className="docvault-empty"><FileText size={27}/><strong>No matching records</strong><span>Clear filters or add a document record.</span></div>:<div className="docvault-items">{filtered.map(d=><article className="docvault-item" key={d.id}><div className="docvault-item-icon"><FileText size={18}/></div><div className="docvault-item-main"><div className="docvault-item-title"><h3>{d.title}</h3><span className={'docvault-status docvault-'+d.status.toLowerCase().replace(/[^a-z]+/g,'-')}>{d.status}</span></div><p>{d.type}{d.reference?' · '+d.reference:''}</p>{d.issued&&<small>Issued / purchased: {d.issued}</small>}{d.expiry&&<small className={expiryState(d)==='Expired / review'?'docvault-expired':''}>Expiry / renewal: {d.expiry} · {expiryState(d)}</small>}{d.notes&&<small>{d.notes}</small>}<div className="docvault-inline"><label>Status<select aria-label={'Status for '+d.title} value={d.status} onChange={e=>update(d.id,{status:e.target.value})}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></label><label>Expiry / renewal<input aria-label={'Expiry date for '+d.title} type="date" value={d.expiry||''} onChange={e=>update(d.id,{expiry:e.target.value})}/></label></div></div><button className="docvault-delete" type="button" aria-label={'Delete '+d.title} onClick={()=>setDocs(p=>p.filter(x=>x.id!==d.id))}><Trash2 size={16}/></button></article>)}</div>}
    <p className="docvault-disclaimer">Entries are stored in this browser on this device. The vault does not upload or encrypt documents, verify legal validity, send alerts, or sync across devices. Export a CSV backup and keep actual files in a secure location.</p>
   </div>
  </div>
 </section>
}
