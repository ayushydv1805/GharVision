import { useEffect, useMemo, useState } from 'react'
import { HardHat, Plus, Trash2, Download, Search, CheckCircle2, ClipboardList } from 'lucide-react'

const KEY = 'gharvision-vendor-quotes-v1'
const seed = [
  { id: 'v1', vendor: 'Example: Local contractor', trade: 'General contractor', contact: '', quote: 250000, timeline: 30, status: 'Considering', notes: 'Replace these sample details with an actual quote.' },
  { id: 'v2', vendor: 'Example: Flooring supplier', trade: 'Flooring', contact: '', quote: 68000, timeline: 7, status: 'Requested', notes: 'Sample entry — confirm taxes, delivery and installation.' },
]
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0)

export default function VendorQuoteTracker() {
  const [items, setItems] = useState(() => { try { const saved = localStorage.getItem(KEY); const parsed = saved ? JSON.parse(saved) : seed; return Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && typeof item.vendor === 'string') : seed } catch { return seed } })
  const [search, setSearch] = useState('')
  const [tradeFilter, setTradeFilter] = useState('All trades')
  const [draft, setDraft] = useState({ vendor: '', trade: 'General contractor', contact: '', quote: '', timeline: '', status: 'Requested', notes: '' })
  const [notice, setNotice] = useState('')
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { setNotice('Browser storage unavailable; changes may not persist after closing this page.') } }, [items])
  const trades = useMemo(() => ['All trades', ...new Set(items.map(i => i.trade).filter(Boolean))], [items])
  const visible = items.filter(i => (tradeFilter === 'All trades' || i.trade === tradeFilter) && (i.vendor + ' ' + i.trade + ' ' + i.contact + ' ' + i.notes).toLowerCase().includes(search.toLowerCase()))
  const total = items.reduce((sum, i) => sum + (Number(i.quote) || 0), 0)
  const accepted = items.filter(i => i.status === 'Selected')
  const add = e => {
    e.preventDefault()
    if (!draft.vendor.trim() || !draft.trade.trim() || draft.quote === '' || Number(draft.quote) < 0) { setNotice('Enter a vendor name, trade and valid quote amount.'); return }
    setItems(prev => [{ ...draft, id: 'v' + Date.now(), quote: Number(draft.quote), timeline: Number(draft.timeline) || 0 }, ...prev])
    setDraft({ vendor: '', trade: 'General contractor', contact: '', quote: '', timeline: '', status: 'Requested', notes: '' })
    setNotice('Quote added. Compare scope and exclusions before selecting a vendor.')
  }
  const update = (id, patch) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  const exportCsv = () => {
    const cols = ['vendor','trade','contact','quote','timeline','status','notes']
    const csv = [cols.join(','), ...items.map(i => cols.map(k => '"' + String(i[k] ?? '').replaceAll('"','""') + '"').join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a'); a.href = url; a.download = 'gharvision-vendor-quotes.csv'; document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="vendor-tracker">
    <header className="vendor-heading"><div><p className="eyebrow"><HardHat size={14}/> HOME OPERATIONS · PHASE 22</p><h1>Vendor & quote tracker <span className="wave">✳</span></h1><p className="heading-subtitle">Keep contractor details, estimates and timelines together before you commit to home work.</p></div><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button></header>
    <div className="vendor-metrics"><article><span>Vendors / quotes</span><strong>{items.length}</strong><small>All saved entries</small></article><article><span>Combined quoted value</span><strong>{money(total)}</strong><small>Not a final project cost</small></article><article><span>Selected vendors</span><strong>{accepted.length}</strong><small>Marked by you</small></article></div>
    <form className="vendor-add-form" onSubmit={add}><div className="vendor-form-title"><div><span className="eyebrow">ADD A QUOTE</span><h2>Vendor details</h2></div><Plus size={18}/></div>
      <div className="vendor-form-grid"><label>Vendor / business name<input value={draft.vendor} onChange={e=>setDraft({...draft,vendor:e.target.value})} placeholder="e.g. ABC Builders" required maxLength={100}/></label><label>Trade / service<input value={draft.trade} onChange={e=>setDraft({...draft,trade:e.target.value})} placeholder="e.g. Electrical" required maxLength={80}/></label><label>Phone / email (optional)<input value={draft.contact} onChange={e=>setDraft({...draft,contact:e.target.value})} placeholder="Contact details" maxLength={120}/></label><label>Quoted amount (₹)<input type="number" min="0" step="1" value={draft.quote} onChange={e=>setDraft({...draft,quote:e.target.value})} placeholder="0" required/></label><label>Estimated duration (days)<input type="number" min="0" max="3650" value={draft.timeline} onChange={e=>setDraft({...draft,timeline:e.target.value})} placeholder="e.g. 14"/></label><label>Decision status<select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})}><option>Requested</option><option>Considering</option><option>Selected</option><option>Not selected</option><option>Work completed</option></select></label><label className="vendor-notes-field">Scope, exclusions & notes<textarea rows="2" value={draft.notes} onChange={e=>setDraft({...draft,notes:e.target.value})} placeholder="Materials included, taxes, warranty, payment milestones…"/></label></div><button className="primary-button" type="submit"><Plus size={15}/> Add quote</button></form>
    <section className="vendor-list-section"><div className="vendor-list-heading"><div><span className="eyebrow">YOUR SHORTLIST</span><h2>Compare quotes</h2></div><div className="vendor-list-controls"><label className="vendor-search"><Search size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vendors"/></label><select value={tradeFilter} onChange={e=>setTradeFilter(e.target.value)} aria-label="Filter by trade">{trades.map(t=><option key={t}>{t}</option>)}</select></div></div>
      {visible.length===0?<div className="vendor-empty"><ClipboardList size={26}/><p>No quotes match. Add a quote or change your search.</p></div>:<div className="vendor-cards">{visible.map(item=><article className="vendor-card" key={item.id}><div className="vendor-card-top"><div className="vendor-avatar"><HardHat size={18}/></div><div className="vendor-name"><h3>{item.vendor}</h3><p>{item.trade}</p></div><button className="vendor-delete" onClick={()=>setItems(prev=>prev.filter(x=>x.id!==item.id))} aria-label={'Delete '+item.vendor}><Trash2 size={15}/></button></div><div className="vendor-quote-value">{money(item.quote)}<span>quoted</span></div><div className="vendor-detail-row"><span>Duration</span><strong>{item.timeline ? item.timeline+' days' : 'Not specified'}</strong></div><div className="vendor-detail-row"><span>Contact</span><strong>{item.contact || 'Not added'}</strong></div><label className="vendor-status-label">Status<select value={item.status} onChange={e=>update(item.id,{status:e.target.value})}><option>Requested</option><option>Considering</option><option>Selected</option><option>Not selected</option><option>Work completed</option></select></label>{item.notes&&<p className="vendor-notes">{item.notes}</p>}{item.status==='Selected'&&<span className="vendor-selected"><CheckCircle2 size={13}/> Selected by you</span>}</article>)}</div>}
    </section>{notice&&<p className="vendor-notice">{notice}</p>}<p className="planner-disclaimer">Sample entries are clearly illustrative. Quotes and vendor details are stored only in this browser on this device; they are not verified or synced to an account. Confirm licensing, references, written scope, taxes, insurance, warranties and payment terms independently. Do not treat the lowest quote as automatically best.</p>
  </div>
}
