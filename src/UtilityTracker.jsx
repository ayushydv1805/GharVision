import { useMemo, useState } from 'react'
import { Activity, CalendarDays, Download, Droplets, Flame, Lightbulb, Plus, ReceiptText, Trash2, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

const KEY = 'gharvision-utility-tracker'
const TYPES = [
  { id: 'Electricity', icon: Lightbulb, unit: 'kWh', color: 'electric' },
  { id: 'Water', icon: Droplets, unit: 'kL', color: 'water' },
  { id: 'Gas', icon: Flame, unit: 'units', color: 'gas' },
  { id: 'Internet', icon: Activity, unit: 'months', color: 'internet' },
  { id: 'Other', icon: ReceiptText, unit: 'units', color: 'other' },
]
const seed = [
  { id: 'sample-electricity', type: 'Electricity', provider: 'Sample provider', period: '2026-09', amount: 1850, usage: 245, dueDate: '', paid: true, notes: 'Example entry — replace with your actual bill' },
  { id: 'sample-water', type: 'Water', provider: 'Sample provider', period: '2026-09', amount: 420, usage: 12, dueDate: '', paid: true, notes: 'Illustrative amount only' },
  { id: 'sample-internet', type: 'Internet', provider: 'Sample provider', period: '2026-09', amount: 799, usage: 1, dueDate: '', paid: false, notes: '' },
]
const empty = { type: 'Electricity', provider: '', period: new Date().toISOString().slice(0, 7), amount: '', usage: '', dueDate: '', paid: false, notes: '' }
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0)
const monthName = value => { if (!value) return 'Period not set'; const [y, m] = value.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) }
const csv = value => '"' + String(value ?? '').replace(/"/g, '""') + '"'
const read = () => { try { const saved = localStorage.getItem(KEY); return saved ? JSON.parse(saved) : seed } catch { return seed } }

export default function UtilityTracker() {
  const [bills, setBills] = useState(read)
  const [form, setForm] = useState(empty)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [budget, setBudget] = useState(() => { try { return localStorage.getItem(KEY + '-budget') || '5000' } catch { return '5000' } })
  const [message, setMessage] = useState('')
  const persist = next => { setBills(next); try { localStorage.setItem(KEY, JSON.stringify(next)); setMessage('Saved on this device') } catch { setMessage('Browser storage unavailable — export a backup') } }
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const thisMonth = new Date().toISOString().slice(0, 7)
  const current = bills.filter(b => b.period === thisMonth)
  const monthlySpend = current.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
  const unpaid = bills.filter(b => !b.paid).reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
  const previousPeriod = (() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 7) })()
  const previousSpend = bills.filter(b => b.period === previousPeriod).reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
  const change = previousSpend && current.length ? Math.round(((monthlySpend - previousSpend) / previousSpend) * 100) : null
  const monthlyHistory = useMemo(() => {
    const periods = Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - (5 - i)); return d.toISOString().slice(0, 7) })
    return periods.map(period => ({ period, total: bills.filter(b => b.period === period).reduce((sum, b) => sum + (Number(b.amount) || 0), 0) }))
  }, [bills])
  const visible = bills.filter(b => {
    const hay = [b.type, b.provider, b.period, b.notes].join(' ').toLowerCase()
    return hay.includes(query.toLowerCase()) && (filter === 'all' || filter === 'unpaid' && !b.paid || filter === 'paid' && b.paid || filter === b.type)
  }).sort((a, b) => b.period.localeCompare(a.period))
  const submit = e => {
    e.preventDefault()
    if (!form.period || form.amount === '' || Number(form.amount) < 0) return
    const item = { ...form, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), amount: Number(form.amount) || 0, usage: form.usage === '' ? '' : Number(form.usage), provider: form.provider.trim(), notes: form.notes.trim() }
    persist([item, ...bills]); setForm({ ...empty, period: thisMonth }); setShowForm(false)
  }
  const exportCsv = () => {
    const headers = ['Utility', 'Provider', 'Billing period', 'Amount INR', 'Usage', 'Due date', 'Paid', 'Notes']
    const rows = bills.map(b => [b.type, b.provider, b.period, b.amount, b.usage, b.dueDate, b.paid ? 'Yes' : 'No', b.notes])
    const blob = new Blob(['\uFEFF' + [headers, ...rows].map(row => row.map(csv).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'gharvision-utility-bills.csv'; a.click(); URL.revokeObjectURL(url)
  }
  const saveBudget = value => { setBudget(value); try { localStorage.setItem(KEY + '-budget', value) } catch { /* Current session remains usable. */ } }
  return <section className="utility-page">
    <header className="utility-heading"><div><p className="eyebrow"><ReceiptText size={13}/> PHASE 16 · KEEP THE HOUSEHOLD ON TRACK</p><h1>Home utility & bill tracker</h1><p className="heading-subtitle">Record monthly bills, monitor household spend and keep unpaid amounts visible.</p></div><div className="utility-actions"><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button><button className="primary-button" onClick={() => setShowForm(v => !v)}><Plus size={16}/>{showForm ? 'Close form' : 'Add bill'}</button></div></header>
    <div className="utility-stats"><article><span><Wallet size={17}/></span><div><small>THIS MONTH</small><strong>{money(monthlySpend)}</strong><p>{monthName(thisMonth)}</p></div></article><article><span><ReceiptText size={17}/></span><div><small>UNPAID BILLS</small><strong>{money(unpaid)}</strong><p>Across all recorded periods</p></div></article><article><span><CalendarDays size={17}/></span><div><small>BILLS THIS MONTH</small><strong>{current.length}</strong><p>Recorded entries</p></div></article><article><span>{change !== null && change > 0 ? <TrendingUp size={17}/> : <TrendingDown size={17}/>}</span><div><small>VS LAST MONTH</small><strong>{change === null ? '—' : `${change > 0 ? '+' : ''}${change}%`}</strong><p>{previousSpend ? money(previousSpend) + ' last month' : 'Add last month to compare'}</p></div></article></div>
    <div className="utility-top-grid"><section className="utility-panel utility-budget"><div className="utility-panel-title"><div><h3>Monthly household budget</h3><p>Set a target for your utility bills.</p></div><Wallet size={18}/></div><label className="utility-budget-input">Monthly target (₹)<input type="number" min="0" max="100000000" value={budget} onChange={e => saveBudget(e.target.value)}/></label><div className="utility-budget-numbers"><strong>{money(monthlySpend)} <span>spent</span></strong><strong>{money(Math.max(0, (Number(budget) || 0) - monthlySpend))} <span>remaining</span></strong></div><div className="utility-progress"><span style={{ width: `${Number(budget) > 0 ? Math.min(100, monthlySpend / Number(budget) * 100) : monthlySpend > 0 ? 100 : 0}%` }}/></div><p className={monthlySpend > Number(budget) && Number(budget) > 0 ? 'utility-budget-alert' : 'utility-muted'}>{Number(budget) > 0 ? monthlySpend > Number(budget) ? `Over budget by ${money(monthlySpend - Number(budget))}` : `${Math.round(monthlySpend / Number(budget) * 100)}% of your target used` : 'Set a budget above ₹0 to track progress.'}</p></section>
    <section className="utility-panel utility-history"><div className="utility-panel-title"><div><h3>Six-month spending</h3><p>Recorded bill totals by month.</p></div><Activity size={18}/></div><div className="utility-bars">{monthlyHistory.map(item => { const max = Math.max(1, ...monthlyHistory.map(x => x.total)); return <div className="utility-bar-column" key={item.period}><div className="utility-bar-track"><span style={{ height: `${item.total ? Math.max(5, item.total / max * 100) : 0}%` }} title={money(item.total)}/></div><strong>{item.total ? (item.total >= 1000 ? `${(item.total / 1000).toFixed(1)}k` : item.total) : '—'}</strong><small>{new Date(Number(item.period.slice(0,4)), Number(item.period.slice(5))-1, 1).toLocaleDateString('en-IN', { month: 'short' })}</small></div> })}</div><p className="utility-muted">Only bills you enter are included. Missing months are not treated as zero usage.</p></section></div>
    {showForm && <form className="utility-panel utility-form" onSubmit={submit}><div className="utility-panel-title"><div><h3>Add a utility bill</h3><p>Enter the amount from your actual bill or receipt.</p></div></div><div className="utility-fields"><label>Utility type<select value={form.type} onChange={e => update('type', e.target.value)}>{TYPES.map(t => <option key={t.id}>{t.id}</option>)}</select></label><label>Billing month<input type="month" required value={form.period} onChange={e => update('period', e.target.value)}/></label><label>Bill amount (₹)<input type="number" min="0" max="100000000" step="0.01" required value={form.amount} onChange={e => update('amount', e.target.value)} placeholder="e.g. 1850"/></label><label>Usage / units (optional)<input type="number" min="0" max="100000000" step="0.01" value={form.usage} onChange={e => update('usage', e.target.value)} placeholder={TYPES.find(t => t.id === form.type)?.unit}/></label><label>Provider / biller<input maxLength="100" value={form.provider} onChange={e => update('provider', e.target.value)} placeholder="Electricity board, ISP…"/></label><label>Payment due date<input type="date" value={form.dueDate} onChange={e => update('dueDate', e.target.value)}/></label><label className="utility-notes-field">Notes<input maxLength="400" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Optional reference or note"/></label><label className="utility-paid-field"><input type="checkbox" checked={form.paid} onChange={e => update('paid', e.target.checked)}/> Mark as paid</label></div><div className="utility-form-actions"><button type="button" className="filter-button" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={15}/> Save bill</button></div></form>}
    <section className="utility-panel utility-bills"><div className="utility-panel-title"><div><h3>Bill register</h3><p>Search bills and update their payment status.</p></div><span className="material-count">{visible.length} bills</span></div><div className="utility-tools"><input aria-label="Search bills" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search provider, utility, notes…"/><select aria-label="Filter bills" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All bills</option><option value="unpaid">Unpaid</option><option value="paid">Paid</option>{TYPES.map(t => <option key={t.id} value={t.id}>{t.id}</option>)}</select></div><div className="utility-table-wrap"><table className="utility-table"><thead><tr><th>Utility / provider</th><th>Period</th><th>Amount</th><th>Due date</th><th>Status</th><th aria-label="Actions"/></tr></thead><tbody>{visible.map(b => <tr key={b.id}><td><strong>{b.type}</strong><small>{b.provider || 'Provider not set'}{b.usage !== '' && b.usage != null ? ` · ${b.usage} ${TYPES.find(t => t.id === b.type)?.unit || 'units'}` : ''}</small>{b.notes && <small>{b.notes}</small>}</td><td>{monthName(b.period)}</td><td className="utility-amount">{money(b.amount)}</td><td>{b.dueDate ? new Date(b.dueDate + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td><td><button className={`utility-status ${b.paid ? 'is-paid' : 'is-unpaid'}`} onClick={() => persist(bills.map(x => x.id === b.id ? { ...x, paid: !x.paid } : x))}>{b.paid ? '✓ Paid' : 'Mark paid'}</button></td><td><button className="utility-delete" aria-label={`Delete ${b.type} bill for ${b.period}`} onClick={() => { if (window.confirm(`Delete ${b.type} bill for ${monthName(b.period)}?`)) persist(bills.filter(x => x.id !== b.id)) }}><Trash2 size={14}/></button></td></tr>)}</tbody></table>{!visible.length && <div className="utility-empty"><ReceiptText size={24}/><strong>No bills found</strong><span>Add a bill or change your search and filters.</span></div>}</div></section>
    <div className="utility-disclaimer"><ReceiptText size={17}/><p><strong>Personal bill log, not a utility-provider connection</strong>Entries and budget targets stay in this browser on this device. Amounts are not fetched automatically from providers. Sample entries are illustrative; replace them with your real bills. Export CSV regularly to keep a backup.</p></div><p className="utility-save-note">{message || 'Your bill register is stored locally in this browser.'}</p>
  </section>
}
