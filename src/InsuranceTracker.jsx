import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, Plus, Trash2, Download, Search, CalendarDays, AlertTriangle } from 'lucide-react'

const KEY = 'gharvision-insurance-policies-v1'
const EXAMPLES = [
  { id: 'policy-example-1', provider: 'Example provider', type: 'Home insurance', policyNumber: '', premium: '', frequency: 'Yearly', renewalDate: '', coverage: '', contact: '', status: 'Active', notes: 'Example only. Replace with your actual policy details.' },
]
const dateToday = () => new Date().toISOString().slice(0, 10)
const renewalState = p => {
  if (p.status !== 'Active') return p.status
  if (!p.renewalDate) return 'No renewal date'
  const days = Math.ceil((new Date(p.renewalDate + 'T00:00:00').getTime() - new Date(dateToday() + 'T00:00:00').getTime()) / 86400000)
  return days < 0 ? 'Overdue' : days <= 30 ? 'Due soon' : 'Current'
}
const money = value => value === '' || value == null || !Number.isFinite(Number(value)) ? '—' : new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value))

export default function InsuranceTracker() {
  const [policies, setPolicies] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || 'null')
      return Array.isArray(data) ? data.filter(p => p && typeof p === 'object' && typeof p.provider === 'string') : EXAMPLES
    } catch { return EXAMPLES }
  })
  const [draft, setDraft] = useState({ provider: '', type: 'Home insurance', policyNumber: '', premium: '', frequency: 'Yearly', renewalDate: '', coverage: '', contact: '', status: 'Active', notes: '' })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [notice, setNotice] = useState('')
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(policies)) } catch { setNotice('Browser storage is unavailable. Export a backup to avoid losing changes.') } }, [policies])
  const filtered = useMemo(() => policies.filter(p => (filter === 'All' || renewalState(p) === filter || p.type === filter || p.status === filter) && [p.provider,p.type,p.policyNumber,p.coverage,p.contact,p.notes].join(' ').toLowerCase().includes(search.toLowerCase())), [policies,filter,search])
  const active = policies.filter(p => p.status === 'Active')
  const overdue = active.filter(p => renewalState(p) === 'Overdue').length
  const soon = active.filter(p => renewalState(p) === 'Due soon').length
  const annualCost = active.reduce((sum,p) => { const n = Number(p.premium); if (!Number.isFinite(n) || n < 0 || p.frequency === 'One-time') return sum; return sum + n * (p.frequency === 'Monthly' ? 12 : p.frequency === 'Quarterly' ? 4 : p.frequency === 'Half-yearly' ? 2 : 1) }, 0)
  const update = (id, patch) => setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
  const add = e => {
    e.preventDefault()
    if (!draft.provider.trim()) { setNotice('Enter an insurer or provider name first.'); return }
    if (draft.premium !== '' && (!Number.isFinite(Number(draft.premium)) || Number(draft.premium) < 0)) { setNotice('Premium must be a valid non-negative amount.'); return }
    setPolicies(prev => [{ ...draft, id: 'policy-' + Date.now(), provider: draft.provider.trim(), premium: draft.premium === '' ? '' : Number(draft.premium), policyNumber: draft.policyNumber.trim(), coverage: draft.coverage.trim(), contact: draft.contact.trim(), notes: draft.notes.trim() }, ...prev])
    setDraft({ provider: '', type: 'Home insurance', policyNumber: '', premium: '', frequency: 'Yearly', renewalDate: '', coverage: '', contact: '', status: 'Active', notes: '' })
    setNotice('Policy added to this browser.')
  }
  const exportCsv = () => {
    const cols = ['provider','type','policyNumber','premium','frequency','renewalDate','coverage','contact','status','notes']
    const csv = [cols.join(','), ...policies.map(p => cols.map(k => '"' + String(p[k] ?? '').replaceAll('"','""') + '"').join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a'); a.href = url; a.download = 'gharvision-insurance-renewals.csv'; document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <section className="insurance-page">
    <div className="insurance-heading"><div><p className="eyebrow">PHASE 24 · PROTECT YOUR HOME</p><h1>Insurance & renewals</h1><p className="heading-subtitle">Keep policy details, renewal dates and premiums together so important cover is easier to manage.</p></div><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button></div>
    <div className="insurance-stats">
      <div><span>Policies tracked</span><strong>{policies.length}</strong><small>{active.length} active</small></div>
      <div className={overdue ? 'insurance-alert' : ''}><span>Renewals overdue</span><strong>{overdue}</strong><small>Check policy status with provider</small></div>
      <div><span>Due in 30 days</span><strong>{soon}</strong><small>Renewal date approaching</small></div>
      <div><span>Estimated annual premiums</span><strong>{money(annualCost)}</strong><small>Based on active policies entered</small></div>
    </div>
    <div className="insurance-layout">
      <form className="insurance-form" onSubmit={add}>
        <div className="insurance-form-title"><ShieldCheck size={19}/><div><h2>Add a policy</h2><p>Store only details you are comfortable keeping in this browser.</p></div></div>
        <label>Insurer / provider<input value={draft.provider} onChange={e=>setDraft(p=>({...p,provider:e.target.value}))} placeholder="e.g. Insurance company" maxLength={100} required /></label>
        <div className="insurance-grid-two"><label>Policy type<select value={draft.type} onChange={e=>setDraft(p=>({...p,type:e.target.value}))}>{['Home insurance','Home contents','Fire & property','Natural disaster','Landlord insurance','Other'].map(x=><option key={x}>{x}</option>)}</select></label><label>Status<select value={draft.status} onChange={e=>setDraft(p=>({...p,status:e.target.value}))}>{['Active','Pending','Expired','Cancelled'].map(x=><option key={x}>{x}</option>)}</select></label></div>
        <label>Policy number (optional)<input value={draft.policyNumber} onChange={e=>setDraft(p=>({...p,policyNumber:e.target.value}))} placeholder="Avoid sensitive account details" maxLength={100}/></label>
        <div className="insurance-grid-two"><label>Premium amount (₹)<input type="number" min="0" step="0.01" value={draft.premium} onChange={e=>setDraft(p=>({...p,premium:e.target.value}))} placeholder="e.g. 12000"/></label><label>Payment frequency<select value={draft.frequency} onChange={e=>setDraft(p=>({...p,frequency:e.target.value}))}>{['Monthly','Quarterly','Half-yearly','Yearly','One-time'].map(x=><option key={x}>{x}</option>)}</select></label></div>
        <label>Renewal / expiry date<input type="date" value={draft.renewalDate} onChange={e=>setDraft(p=>({...p,renewalDate:e.target.value}))}/></label>
        <label>Coverage summary<input value={draft.coverage} onChange={e=>setDraft(p=>({...p,coverage:e.target.value}))} placeholder="e.g. Building and contents" maxLength={180}/></label>
        <label>Provider contact (optional)<input value={draft.contact} onChange={e=>setDraft(p=>({...p,contact:e.target.value}))} placeholder="Phone, email or agent name" maxLength={180}/></label>
        <label>Notes<textarea rows="3" value={draft.notes} onChange={e=>setDraft(p=>({...p,notes:e.target.value}))} placeholder="Claim references or questions to ask" maxLength={1000}/></label>
        <button className="primary-button insurance-submit" type="submit"><Plus size={16}/> Add policy</button>
      </form>
      <div className="insurance-list-panel">
        <div className="insurance-list-head"><div><h2>Your policies</h2><p>{filtered.length} of {policies.length} policies</p></div><div className="insurance-actions"><label className="insurance-search"><Search size={15}/><input aria-label="Search policies" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search policies"/></label><select aria-label="Filter policies" value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Overdue','Due soon','Current','No renewal date','Active','Pending','Expired','Cancelled','Home insurance','Home contents','Fire & property','Natural disaster','Landlord insurance','Other'].map(x=><option key={x}>{x}</option>)}</select></div></div>
        {notice && <p className="insurance-notice" role="status">{notice}</p>}
        {filtered.length===0 ? <div className="insurance-empty"><CalendarDays size={25}/><strong>No matching policies</strong><span>Add a policy or change your search/filter.</span></div> : <div className="insurance-policy-list">{filtered.map(policy=>{const state=renewalState(policy);return <article className="insurance-policy" key={policy.id}><div className="insurance-policy-icon"><ShieldCheck size={18}/></div><div className="insurance-policy-body"><div className="insurance-policy-title"><h3>{policy.provider}</h3><span className={'insurance-pill insurance-'+state.toLowerCase().replaceAll(' ','-')}>{state}</span></div><p>{policy.type} · {policy.status}{policy.policyNumber ? ' · Policy ' + policy.policyNumber : ''}</p><div className="insurance-facts"><span><strong>Premium:</strong> {money(policy.premium)} / {policy.frequency.toLowerCase()}</span><span><strong>Renewal:</strong> {policy.renewalDate || 'Not set'}</span>{policy.coverage && <span><strong>Coverage:</strong> {policy.coverage}</span>}{policy.contact && <span><strong>Contact:</strong> {policy.contact}</span>}</div>{policy.notes && <small>{policy.notes}</small>}<div className="insurance-inline-edit"><label>Status<select aria-label={'Status for '+policy.provider} value={policy.status} onChange={e=>update(policy.id,{status:e.target.value})}>{['Active','Pending','Expired','Cancelled'].map(x=><option key={x}>{x}</option>)}</select></label><label>Renewal<input aria-label={'Renewal date for '+policy.provider} type="date" value={policy.renewalDate||''} onChange={e=>update(policy.id,{renewalDate:e.target.value})}/></label><label>Premium ₹<input aria-label={'Premium for '+policy.provider} type="number" min="0" step="0.01" value={policy.premium??''} onChange={e=>update(policy.id,{premium:e.target.value===''?'':Number(e.target.value)})}/></label></div></div><button className="insurance-delete" type="button" aria-label={'Delete policy '+policy.provider} onClick={()=>setPolicies(prev=>prev.filter(p=>p.id!==policy.id))}><Trash2 size={16}/></button></article>})}</div>}
        <p className="insurance-disclaimer"><AlertTriangle size={14}/> This is a personal record, not an insurer service. Renewal dates are not notifications; verify cover, terms and renewal status directly with your provider. Avoid storing passwords or payment-card details here.</p>
      </div>
    </div>
  </section>
}
