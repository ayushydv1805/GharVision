import { useEffect, useMemo, useState } from 'react'
import { CalendarClock, Plus, Trash2, Download, Search, CheckCircle2, Circle, AlertTriangle } from 'lucide-react'

const KEY = 'gharvision-home-maintenance-log-v1'
const SEED = [
  { id: 'm1', title: 'Example: Service air conditioner', area: 'HVAC', dueDate: '', frequency: 'Every 6 months', priority: 'Medium', status: 'Planned', notes: 'Example only — replace with your own task.' },
  { id: 'm2', title: 'Example: Check smoke alarms', area: 'Safety', dueDate: '', frequency: 'Every 3 months', priority: 'High', status: 'Planned', notes: 'Example only — verify the manufacturer instructions.' },
]
const today = (date = new Date()) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
const nextDue = task => task.dueDate && task.status !== 'Completed' && task.dueDate < today()
  ? 'Overdue'
  : task.dueDate && task.status !== 'Completed' && task.dueDate <= today(new Date(Date.now() + 14 * 86400000))
    ? 'Due soon'
    : task.status === 'Completed' ? 'Completed' : 'On track'

export default function HomeCareLog() {
  const [tasks, setTasks] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || 'null')
      return Array.isArray(parsed) ? parsed.filter(t => t && typeof t === 'object' && typeof t.title === 'string') : SEED
    } catch { return SEED }
  })
  const [draft, setDraft] = useState({ title: '', area: 'General', dueDate: '', frequency: 'One-time', priority: 'Medium', status: 'Planned', notes: '' })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [notice, setNotice] = useState('')
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(tasks)) } catch { setNotice('Browser storage is unavailable; changes may not persist after closing this page.') } }, [tasks])
  const visible = useMemo(() => tasks.filter(t => (statusFilter === 'All' || nextDue(t) === statusFilter || t.status === statusFilter) && (t.title + ' ' + t.area + ' ' + t.notes + ' ' + t.frequency).toLowerCase().includes(search.toLowerCase())), [tasks, search, statusFilter])
  const overdue = tasks.filter(t => nextDue(t) === 'Overdue').length
  const dueSoon = tasks.filter(t => nextDue(t) === 'Due soon').length
  const completed = tasks.filter(t => t.status === 'Completed').length
  const addTask = e => {
    e.preventDefault()
    if (!draft.title.trim()) { setNotice('Add a task name first.'); return }
    setTasks(prev => [{ ...draft, id: 'm' + Date.now(), title: draft.title.trim(), notes: draft.notes.trim() }, ...prev])
    setDraft({ title: '', area: 'General', dueDate: '', frequency: 'One-time', priority: 'Medium', status: 'Planned', notes: '' })
    setNotice('Maintenance task added.')
  }
  const update = (id, patch) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  const exportCsv = () => {
    const cols = ['title', 'area', 'dueDate', 'frequency', 'priority', 'status', 'notes']
    const csv = [cols.join(','), ...tasks.map(t => cols.map(k => '"' + String(t[k] ?? '').replaceAll('"', '""') + '"').join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a'); a.href = url; a.download = 'gharvision-home-care-log.csv'; document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <section className="care-log">
    <div className="care-log-heading"><div><p className="eyebrow">PHASE 23 · HOME CARE</p><h1>Home care log</h1><p className="heading-subtitle">Keep maintenance history, upcoming work and recurring care in one practical list.</p></div><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button></div>
    <div className="care-log-stats">
      <div><span>Total tasks</span><strong>{tasks.length}</strong><small>Planned and completed</small></div>
      <div className={overdue ? 'care-alert' : ''}><span>Overdue</span><strong>{overdue}</strong><small>Needs attention</small></div>
      <div><span>Due soon</span><strong>{dueSoon}</strong><small>Next 14 days</small></div>
      <div><span>Completed</span><strong>{completed}</strong><small>Marked done</small></div>
    </div>
    <div className="care-log-layout">
      <form className="care-log-form" onSubmit={addTask}>
        <div className="care-log-form-title"><CalendarClock size={18}/><div><h2>Add maintenance task</h2><p>Use dates and notes to keep a useful home-care history.</p></div></div>
        <label>Task name<input value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Clean water tank" required maxLength={100}/></label>
        <div className="care-log-form-grid"><label>Area<select value={draft.area} onChange={e => setDraft(p => ({ ...p, area: e.target.value }))}>{['General','Electrical','Plumbing','HVAC','Roof & exterior','Kitchen','Bathroom','Safety','Garden','Appliances'].map(x => <option key={x}>{x}</option>)}</select></label><label>Priority<select value={draft.priority} onChange={e => setDraft(p => ({ ...p, priority: e.target.value }))}>{['Low','Medium','High'].map(x => <option key={x}>{x}</option>)}</select></label></div>
        <div className="care-log-form-grid"><label>Due date<input type="date" value={draft.dueDate} onChange={e => setDraft(p => ({ ...p, dueDate: e.target.value }))}/></label><label>Repeat<select value={draft.frequency} onChange={e => setDraft(p => ({ ...p, frequency: e.target.value }))}>{['One-time','Weekly','Monthly','Every 3 months','Every 6 months','Yearly'].map(x => <option key={x}>{x}</option>)}</select></label></div>
        <label>Notes<textarea rows="3" value={draft.notes} onChange={e => setDraft(p => ({ ...p, notes: e.target.value }))} placeholder="Service details, parts, costs or contractor notes" maxLength={1000}/></label>
        <button className="primary-button care-log-submit" type="submit"><Plus size={16}/> Add task</button>
      </form>
      <div className="care-log-list-panel">
        <div className="care-log-list-head"><div><h2>Maintenance schedule</h2><p>{visible.length} of {tasks.length} tasks</p></div><div className="care-log-actions"><label className="care-log-search"><Search size={15}/><input aria-label="Search maintenance tasks" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks"/></label><select aria-label="Filter maintenance tasks" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>{['All','Overdue','Due soon','On track','Completed','Planned','In progress'].map(x => <option key={x}>{x}</option>)}</select></div></div>
        {notice && <p className="care-log-notice" role="status">{notice}</p>}
        {visible.length === 0 ? <div className="care-log-empty"><CalendarClock size={24}/><strong>No matching tasks</strong><span>Add a task or adjust your search/filter.</span></div> : <div className="care-log-items">{visible.map(task => {
          const due = nextDue(task)
          return <article className="care-log-item" key={task.id}>
            <button type="button" className="care-log-complete" aria-label={task.status === 'Completed' ? 'Mark task as planned' : 'Mark task completed'} onClick={() => update(task.id, { status: task.status === 'Completed' ? 'Planned' : 'Completed' })}>{task.status === 'Completed' ? <CheckCircle2 size={20}/> : <Circle size={20}/>}</button>
            <div className="care-log-item-main"><div className="care-log-item-title"><h3>{task.title}</h3><span className={'care-pill care-' + due.toLowerCase().replaceAll(' ', '-')}>{due}</span></div><p>{task.area} · {task.frequency} · <span className={'care-priority-' + task.priority.toLowerCase()}>{task.priority} priority</span></p>{task.notes && <small>{task.notes}</small>}<div className="care-log-item-meta"><label>Due <input aria-label={'Due date for ' + task.title} type="date" value={task.dueDate || ''} onChange={e => update(task.id, { dueDate: e.target.value })}/></label><label>Status <select aria-label={'Status for ' + task.title} value={task.status} onChange={e => update(task.id, { status: e.target.value })}>{['Planned','In progress','Completed'].map(x => <option key={x}>{x}</option>)}</select></label></div></div>
            <button type="button" className="care-log-delete" aria-label={'Delete ' + task.title} onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))}><Trash2 size={16}/></button>
          </article>
        })}</div>}
        <p className="care-log-footnote"><AlertTriangle size={14}/> Example tasks are placeholders. Dates and recurrence are reminders only; this tool does not send notifications or automatically schedule the next occurrence.</p>
      </div>
    </div>
  </section>
}
