import { useCallback, useMemo, useState } from 'react'
import { Activity, AlertTriangle, CalendarClock, CheckCircle2, ClipboardCheck, FileText, RefreshCw, ShieldCheck, Download, ArrowRight, BellRing } from 'lucide-react'

const SOURCES = [
  { key: 'gharvision-home-maintenance-log-v1', label: 'Home care log', area: 'Maintenance', date: 'dueDate', status: 'status', done: ['Completed'], route: 'Home care log' },
  { key: 'gharvision-insurance-policies-v1', label: 'Insurance & renewals', area: 'Insurance', date: 'renewalDate', status: 'status', active: ['Active'], route: 'Insurance & renewals', title: x => x.provider },
  { key: 'gharvision-document-vault-v1', label: 'Home document vault', area: 'Documents', date: 'expiry', status: 'status', done: ['Archived'], route: 'Home document vault' },
  { key: 'gharvision-handover-checklist-v1', label: 'Handover & snag list', area: 'Handover', date: 'due', status: 'status', done: ['Resolved', 'Accepted / deferred'], route: 'Handover & snag list' },
]

const todayString = () => {
  const now = new Date()
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-')
}
const dayOffset = (date, today) => Math.ceil((new Date(date + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime()) / 86400000)
const readArray = key => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null')
    return Array.isArray(parsed) ? parsed : null
  } catch { return null }
}
const readProjectTasks = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem('gharvision-home-projects-v1') || 'null')
    return parsed && Array.isArray(parsed.tasks) ? parsed.tasks : null
  } catch { return null }
}

export default function HomeActionCenter({ onNavigate }) {
  const [version, setVersion] = useState(0)
  const [filter, setFilter] = useState('All')
  const today = todayString()
  const snapshot = useMemo(() => {
    const rows = []
    SOURCES.forEach(source => {
      const stored = source.key === 'gharvision-home-projects-v1' ? readProjectTasks() : readArray(source.key)
      if (!stored) return
      stored.forEach((record, index) => {
        if (!record || typeof record !== 'object') return
        const status = String(record[source.status] || '')
        if (source.done?.includes(status) || (source.active && !source.active.includes(status))) return
        const due = String(record[source.date] || '')
        if (!due || !/^\d{4}-\d{2}-\d{2}$/.test(due)) return
        const delta = dayOffset(due, today)
        if (delta > 30) return
        const title = source.title ? source.title(record) : record.title || record.name || record.vendor || 'Untitled item'
        rows.push({
          id: source.key + '-' + String(record.id ?? index),
          title: String(title),
          source: source.label,
          area: source.area,
          due,
          delta,
          status: status || 'Needs review',
          route: source.route,
          urgency: delta < 0 ? 'Overdue' : delta <= 7 ? 'Due this week' : 'Due within 30 days',
        })
      })
    })
    const tasks = readProjectTasks()
    const projectTasks = tasks && Array.isArray(tasks.tasks) ? tasks.tasks : []
    projectTasks.forEach((task, index) => {
      if (!task || !task.due || task.status === 'Complete' || !/^\d{4}-\d{2}-\d{2}$/.test(task.due)) return
      const delta = dayOffset(task.due, today)
      if (delta > 30) return
      rows.push({ id: 'project-task-' + String(task.id ?? index), title: String(task.title || 'Untitled project task'), source: 'Home project tracker', area: 'Project task', due: task.due, delta, status: task.status || 'Not started', route: 'Home project tracker', urgency: delta < 0 ? 'Overdue' : delta <= 7 ? 'Due this week' : 'Due within 30 days' })
    })
    const orders = readArray('gharvision-change-orders-v1') || []
    orders.forEach((order, index) => {
      if (!order || !['Proposed', 'Under review'].includes(order.status)) return
      rows.push({ id: 'change-order-' + String(order.id ?? index), title: String(order.title || 'Untitled change request'), source: 'Change order & decision log', area: 'Decision', due: '', delta: null, status: order.status, route: 'Change order & decision log', urgency: 'Decision pending' })
    })
    const snags = readArray('gharvision-handover-checklist-v1') || []
    snags.forEach((snag, index) => {
      if (!snag || !['High', 'Critical'].includes(snag.severity) || ['Resolved', 'Accepted / deferred'].includes(snag.status)) return
      const hasUpcomingDeadline = snag.due && /^\\d{4}-\\d{2}-\\d{2}$/.test(snag.due) && dayOffset(snag.due, today) <= 30
      if (hasUpcomingDeadline) return
      rows.push({ id: 'priority-snag-' + String(snag.id ?? index), title: String(snag.title || 'High-priority snag'), source: 'Handover & snag list', area: 'Priority issue', due: snag.due || '', delta: snag.due && /^\\d{4}-\\d{2}-\\d{2}$/.test(snag.due) ? dayOffset(snag.due, today) : null, status: snag.status || 'Open', route: 'Handover & snag list', urgency: snag.severity + ' severity' })
    })
    const rank = row => row.urgency === 'Overdue' ? 0 : row.urgency === 'Critical severity' ? 1 : row.urgency === 'High severity' ? 2 : row.urgency === 'Due this week' ? 3 : row.urgency === 'Decision pending' ? 4 : 5
    return rows.sort((a, b) => rank(a) - rank(b) || (a.due || '9999').localeCompare(b.due || '9999'))
  }, [today, version])
  const visible = useMemo(() => snapshot.filter(item => filter === 'All' || (filter === 'Overdue' && item.urgency === 'Overdue') || (filter === 'Upcoming' && ['Due this week', 'Due within 30 days'].includes(item.urgency)) || (filter === 'Needs decision' && item.urgency === 'Decision pending') || (filter === 'Priority issues' && /severity/.test(item.urgency))), [snapshot, filter])
  const overdue = snapshot.filter(x => x.urgency === 'Overdue').length
  const upcoming = snapshot.filter(x => ['Due this week', 'Due within 30 days'].includes(x.urgency)).length
  const decisions = snapshot.filter(x => x.urgency === 'Decision pending').length
  const priorities = snapshot.filter(x => /severity/.test(x.urgency)).length
  const exportCsv = () => {
    const keys = ['title', 'source', 'area', 'due', 'status', 'urgency']
    const cell = value => '"' + String(value ?? '').replaceAll('"', '""') + '"'
    const csv = [keys.join(','), ...visible.map(row => keys.map(key => cell(row[key])).join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a'); a.href = url; a.download = 'gharvision-action-center.csv'; document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <section className="action-center">
    <div className="action-center-heading"><div><p className="eyebrow">PHASE 29 · ONE CLEAR NEXT STEP</p><h1>Home action center</h1><p className="heading-subtitle">A cross-tool view of deadlines, decisions and high-priority home issues saved in this browser.</p></div><div className="action-center-head-actions"><button className="filter-button" onClick={() => setVersion(v => v + 1)}><RefreshCw size={15}/> Refresh</button><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button></div></div>
    <div className="action-center-stats">
      <article className={overdue ? 'action-stat-alert' : ''}><span><AlertTriangle size={18}/></span><div><small>OVERDUE</small><strong>{overdue}</strong><p>Dates that have passed</p></div></article>
      <article><span><CalendarClock size={18}/></span><div><small>COMING UP</small><strong>{upcoming}</strong><p>Next 30 days</p></div></article>
      <article><span><ClipboardCheck size={18}/></span><div><small>DECISIONS</small><strong>{decisions}</strong><p>Change orders awaiting review</p></div></article>
      <article className={priorities ? 'action-stat-alert' : ''}><span><ShieldCheck size={18}/></span><div><small>PRIORITY ISSUES</small><strong>{priorities}</strong><p>High / critical open snags</p></div></article>
    </div>
    <div className="action-center-panel">
      <div className="action-center-list-head"><div><h2>What needs your attention</h2><p>{visible.length} items shown · checked {today}</p></div><select aria-label="Filter action items" value={filter} onChange={e => setFilter(e.target.value)}>{['All','Overdue','Upcoming','Needs decision','Priority issues'].map(x => <option key={x}>{x}</option>)}</select></div>
      {visible.length ? <div className="action-center-items">{visible.map(item => <article className="action-center-item" key={item.id}><div className={'action-center-item-icon ' + (item.urgency === 'Overdue' || /severity/.test(item.urgency) ? 'action-icon-alert' : '')}><Activity size={17}/></div><div className="action-center-item-main"><div className="action-center-item-title"><h3>{item.title}</h3><span className={'action-center-pill ' + (item.urgency === 'Overdue' || /Critical|High/.test(item.urgency) ? 'action-pill-alert' : '')}>{item.urgency}</span></div><p>{item.source} · {item.status}{item.due ? ' · Due ' + item.due : ''}</p></div><button className="action-center-open" onClick={() => onNavigate(item.route)} aria-label={'Open ' + item.source}>Open <ArrowRight size={14}/></button></article>)}</div> : <div className="action-center-empty"><CheckCircle2 size={28}/><strong>Nothing in this view</strong><span>Either there are no matching items, or your other trackers have not saved any dated actions yet.</span></div>}
      <p className="action-center-disclaimer"><BellRing size={14}/> This page reads existing browser-local tracker data; it does not change those records, sync across devices, or send push/email notifications. Refresh after editing another tracker. Example records may appear if they have due dates.</p>
    </div>
  </section>
}
