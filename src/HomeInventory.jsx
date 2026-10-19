import { useMemo, useState } from 'react'
import { Archive, CalendarClock, Check, Download, Plus, Search, ShieldCheck, Trash2, TriangleAlert } from 'lucide-react'

const KEY = 'gharvision-home-inventory'
const seedItems = [
  { id: 'sample-fridge', name: 'Refrigerator', room: 'Kitchen', category: 'Appliance', brand: 'Sample brand', purchaseDate: '', cost: 42000, warrantyMonths: 24, serial: '', notes: 'Example entry — replace with your details', favourite: false },
  { id: 'sample-ac', name: 'Air conditioner', room: 'Bedroom', category: 'Appliance', brand: 'Sample brand', purchaseDate: '', cost: 38000, warrantyMonths: 12, serial: '', notes: 'Keep the invoice and installation receipt', favourite: true },
  { id: 'sample-sofa', name: 'Living room sofa', room: 'Living room', category: 'Furniture', brand: '', purchaseDate: '', cost: 28000, warrantyMonths: 36, serial: '', notes: '', favourite: false },
]
const emptyForm = { name: '', room: 'Living room', category: 'Appliance', brand: '', purchaseDate: '', cost: '', warrantyMonths: '12', serial: '', notes: '', favourite: false }
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0)
const readItems = () => { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : seedItems } catch { return seedItems } }
const warrantyEnd = item => {
  if (!item.purchaseDate || item.warrantyMonths === '' || item.warrantyMonths == null) return null
  const d = new Date(item.purchaseDate + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return null
  d.setMonth(d.getMonth() + Number(item.warrantyMonths))
  return d
}
const dateLabel = value => value ? new Date(value + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not recorded'
const csvCell = value => '"' + String(value ?? '').replace(/"/g, '""') + '"'

export default function HomeInventory() {
  const [items, setItems] = useState(readItems)
  const [form, setForm] = useState(emptyForm)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const persist = next => { setItems(next); try { localStorage.setItem(KEY, JSON.stringify(next)); setMessage('Saved on this device') } catch { setMessage('Storage unavailable — export a backup') } }
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const enriched = useMemo(() => items.map(item => {
    const end = warrantyEnd(item)
    const days = end ? Math.ceil((end.getTime() - now.getTime()) / 86400000) : null
    return { ...item, warrantyEnd: end, days, warrantyStatus: days == null ? 'unknown' : days < 0 ? 'expired' : days <= 60 ? 'soon' : 'active' }
  }), [items])
  const filtered = enriched.filter(item => {
    const haystack = [item.name, item.room, item.category, item.brand, item.serial, item.notes].join(' ').toLowerCase()
    return haystack.includes(query.toLowerCase()) && (filter === 'all' || (filter === 'starred' ? item.favourite : item.warrantyStatus === filter))
  }).sort((a, b) => (a.warrantyEnd?.getTime() ?? Infinity) - (b.warrantyEnd?.getTime() ?? Infinity))
  const totalValue = items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
  const soonCount = enriched.filter(i => i.warrantyStatus === 'soon').length
  const expiredCount = enriched.filter(i => i.warrantyStatus === 'expired').length
  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const submit = e => {
    e.preventDefault()
    if (!form.name.trim()) return
    const item = { ...form, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name: form.name.trim(), cost: Number(form.cost) || 0, warrantyMonths: form.warrantyMonths === '' ? '' : Number(form.warrantyMonths), favourite: Boolean(form.favourite) }
    persist([item, ...items]); setForm(emptyForm); setShowForm(false)
  }
  const exportCsv = () => {
    const headers = ['Item', 'Room', 'Category', 'Brand', 'Purchase date', 'Cost INR', 'Warranty months', 'Warranty end', 'Warranty status', 'Serial number', 'Notes', 'Starred']
    const rows = enriched.map(i => [i.name, i.room, i.category, i.brand, i.purchaseDate, i.cost, i.warrantyMonths, i.warrantyEnd ? i.warrantyEnd.toISOString().slice(0, 10) : '', i.warrantyStatus, i.serial, i.notes, i.favourite ? 'Yes' : 'No'])
    const blob = new Blob([[headers, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'gharvision-home-inventory.csv'; a.click(); URL.revokeObjectURL(url)
  }
  const statusText = item => item.warrantyStatus === 'unknown' ? 'Add purchase date' : item.warrantyStatus === 'expired' ? 'Warranty expired' : item.warrantyStatus === 'soon' ? `Expires in ${item.days} day${item.days === 1 ? '' : 's'}` : 'Warranty active'
  return <section className="inventory-page">
    <header className="inventory-heading"><div><p className="eyebrow"><Archive size={13}/> PHASE 15 · KNOW WHAT YOU OWN</p><h1>Home inventory & warranty vault</h1><p className="heading-subtitle">Keep your household assets, purchase details and warranty dates in one tidy place.</p></div><div className="inventory-actions"><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button><button className="primary-button" onClick={() => setShowForm(v => !v)}><Plus size={16}/>{showForm ? 'Close form' : 'Add item'}</button></div></header>
    <div className="inventory-stats"><article><span><Archive size={17}/></span><div><small>REGISTERED ITEMS</small><strong>{items.length}</strong><p>Items in your vault</p></div></article><article><span><ShieldCheck size={17}/></span><div><small>RECORDED VALUE</small><strong>{money(totalValue)}</strong><p>Based on your entries</p></div></article><article><span><CalendarClock size={17}/></span><div><small>EXPIRING SOON</small><strong>{soonCount}</strong><p>Within the next 60 days</p></div></article><article><span><TriangleAlert size={17}/></span><div><small>EXPIRED WARRANTIES</small><strong>{expiredCount}</strong><p>Review your coverage</p></div></article></div>
    {showForm && <form className="inventory-form panel" onSubmit={submit}><div className="inventory-form-head"><div><h3>Add a household item</h3><p>Store only the details you need. Never enter passwords or payment-card data.</p></div></div><div className="inventory-fields">
      <label>Item name *<input required maxLength={90} value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="e.g. Washing machine"/></label>
      <label>Room<select value={form.room} onChange={e => updateForm('room', e.target.value)}>{['Living room','Bedroom','Kitchen','Bathroom','Balcony','Garage / store','Whole home','Other'].map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Category<select value={form.category} onChange={e => updateForm('category', e.target.value)}>{['Appliance','Furniture','Electronics','Lighting','Plumbing','Security','Tool / equipment','Other'].map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Brand / seller<input maxLength={90} value={form.brand} onChange={e => updateForm('brand', e.target.value)} placeholder="Optional"/></label>
      <label>Purchase date<input type="date" value={form.purchaseDate} onChange={e => updateForm('purchaseDate', e.target.value)}/></label>
      <label>Purchase cost (₹)<input type="number" min="0" max="100000000" step="1" value={form.cost} onChange={e => updateForm('cost', e.target.value)} placeholder="0"/></label>
      <label>Warranty (months)<input type="number" min="0" max="600" value={form.warrantyMonths} onChange={e => updateForm('warrantyMonths', e.target.value)}/></label>
      <label>Serial / model number<input maxLength={120} value={form.serial} onChange={e => updateForm('serial', e.target.value)} placeholder="Optional"/></label>
      <label className="inventory-notes-field">Notes<textarea maxLength={800} rows={2} value={form.notes} onChange={e => updateForm('notes', e.target.value)} placeholder="Service contact, invoice location (not sensitive details), maintenance notes…"/></label>
      <label className="inventory-star-field"><input type="checkbox" checked={form.favourite} onChange={e => updateForm('favourite', e.target.checked)}/> Star for quick reference</label>
    </div><div className="inventory-form-actions"><button type="button" className="filter-button" onClick={() => { setForm(emptyForm); setShowForm(false) }}>Cancel</button><button type="submit" className="primary-button"><Check size={15}/> Save item</button></div></form>}
    <section className="inventory-list panel"><div className="inventory-list-head"><div><h3>Your household register</h3><p>Warranty dates are calculated from purchase date and duration.</p></div><span className="material-count">{filtered.length} items</span></div><div className="inventory-tools"><label className="inventory-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search items, rooms, brands…"/></label><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter inventory"><option value="all">All items</option><option value="active">Warranty active</option><option value="soon">Expiring within 60 days</option><option value="expired">Warranty expired</option><option value="unknown">Date not recorded</option><option value="starred">Starred items</option></select></div>
    <div className="inventory-grid">{filtered.map(item => <article className="inventory-card" key={item.id}><div className="inventory-card-top"><span className="inventory-category">{item.category}</span><button className={`inventory-star ${item.favourite ? 'is-starred' : ''}`} onClick={() => persist(items.map(i => i.id === item.id ? { ...i, favourite: !i.favourite } : i))} aria-label={item.favourite ? 'Remove star' : 'Star item'}>{item.favourite ? '★' : '☆'}</button></div><h4>{item.name}</h4><p className="inventory-room">{item.room}{item.brand ? ` · ${item.brand}` : ''}</p><div className="inventory-value"><div><small>Purchase cost</small><strong>{money(item.cost)}</strong></div><div><small>Warranty</small><strong>{item.warrantyMonths === '' ? 'Not set' : `${item.warrantyMonths} months`}</strong></div></div><div className={`inventory-warranty inventory-warranty-${item.warrantyStatus}`}><span>{item.warrantyStatus === 'expired' || item.warrantyStatus === 'soon' ? <TriangleAlert size={14}/> : <ShieldCheck size={14}/>}</span><div><strong>{statusText(item)}</strong><small>{item.warrantyEnd ? `Until ${item.warrantyEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Enter purchase date to calculate'}</small></div></div><div className="inventory-meta"><span>Purchased: {dateLabel(item.purchaseDate)}</span>{item.serial && <span>Model / serial: {item.serial}</span>}{item.notes && <p>{item.notes}</p>}</div><div className="inventory-card-actions"><button className="filter-button" onClick={() => { const updated = window.prompt('Update notes for ' + item.name, item.notes || ''); if (updated !== null) persist(items.map(i => i.id === item.id ? { ...i, notes: updated.slice(0, 800) } : i)) }}>Edit notes</button><button className="inventory-delete" onClick={() => { if (window.confirm('Delete ' + item.name + ' from your inventory?')) persist(items.filter(i => i.id !== item.id)) }} aria-label={`Delete ${item.name}`}><Trash2 size={15}/></button></div></article>)}{!filtered.length && <div className="inventory-empty"><Archive size={26}/><strong>No items match this view</strong><span>Add an item or adjust your search and filter.</span></div>}</div></section>
    <div className="inventory-disclaimer"><ShieldCheck size={17}/><p><strong>Private, device-local register</strong>Your entries stay in this browser on this device; they are not uploaded or synced. Export CSV for a backup. Warranty dates are estimates based on the dates and durations you enter—check your invoice and manufacturer terms for the actual coverage. Avoid storing sensitive personal or payment information.</p></div><p className="inventory-save-note">{message || 'Your inventory is stored locally in this browser.'}</p>
  </section>
}
