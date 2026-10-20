import { useMemo, useState } from 'react'
import { CalendarCheck, CheckCircle2, Circle, Download, Plus, Search, Trash2, RotateCcw, Sparkles, Clock3 } from 'lucide-react'

const KEY = 'gharvision-cleaning-scheduler-v1'
const today = () => new Date().toISOString().slice(0, 10)
const addDays = days => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10) }
const starterTasks = [
  { id: 'kitchen-counter', title: 'Wipe kitchen counters and table', room: 'Kitchen', frequency: 'Daily', dueDate: today(), assignee: '', notes: '' },
  { id: 'dishes', title: 'Wash dishes and clean the sink', room: 'Kitchen', frequency: 'Daily', dueDate: today(), assignee: '', notes: '' },
  { id: 'living-floor', title: 'Sweep or vacuum living areas', room: 'Living room', frequency: 'Weekly', dueDate: addDays(1), assignee: '', notes: '' },
  { id: 'bathroom', title: 'Clean bathroom surfaces and mirror', room: 'Bathroom', frequency: 'Weekly', dueDate: addDays(2), assignee: '', notes: '' },
  { id: 'bedding', title: 'Change bed sheets and pillowcases', room: 'Bedroom', frequency: 'Weekly', dueDate: addDays(3), assignee: '', notes: '' },
  { id: 'fridge', title: 'Check fridge shelves and expired food', room: 'Kitchen', frequency: 'Weekly', dueDate: addDays(4), assignee: '', notes: '' },
  { id: 'laundry', title: 'Wash and put away laundry', room: 'Laundry', frequency: 'Weekly', dueDate: addDays(2), assignee: '', notes: '' },
  { id: 'windows', title: 'Clean reachable windows and sills', room: 'Whole home', frequency: 'Monthly', dueDate: addDays(7), assignee: '', notes: '' },
  { id: 'filters', title: 'Check and clean reusable AC filters as instructed', room: 'Whole home', frequency: 'Monthly', dueDate: addDays(10), assignee: '', notes: '' },
  { id: 'declutter', title: 'Declutter one drawer or shelf', room: 'Whole home', frequency: 'Monthly', dueDate: addDays(5), assignee: '', notes: '' },
]
const blankDraft = { title: '', room: 'Kitchen', frequency: 'Weekly', dueDate: today(), assignee: '', notes: '' }
const readSaved = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { tasks: Array.isArray(saved.tasks) ? saved.tasks : starterTasks.map(task => ({ ...task })), completed: Array.isArray(saved.completed) ? saved.completed : [] }
  } catch { return { tasks: starterTasks.map(task => ({ ...task })), completed: [] } }
}
const escapeCsv = value => '"' + String(value ?? '').replace(/"/g, '""') + '"'

export default function CleaningScheduler() {
  const initial = useMemo(readSaved, [])
  const [tasks, setTasks] = useState(initial.tasks)
  const [completed, setCompleted] = useState(initial.completed)
  const [filter, setFilter] = useState('All')
  const [roomFilter, setRoomFilter] = useState('All rooms')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState(blankDraft)
  const [adding, setAdding] = useState(false)
  const [notice, setNotice] = useState('')
  const persist = (nextTasks, nextCompleted) => {
    setTasks(nextTasks); setCompleted(nextCompleted)
    try { localStorage.setItem(KEY, JSON.stringify({ tasks: nextTasks, completed: nextCompleted })); setNotice('Saved on this device') }
    catch { setNotice('Browser storage unavailable — export a backup') }
  }
  const toggle = id => persist(tasks, completed.includes(id) ? completed.filter(item => item !== id) : [...completed, id])
  const updateTask = (id, key, value) => persist(tasks.map(task => task.id === id ? { ...task, [key]: value } : task), completed)
  const addTask = event => {
    event.preventDefault()
    if (!draft.title.trim()) return
    const task = { ...draft, id: 'task-' + Date.now() }
    persist([...tasks, task], completed)
    setDraft({ ...blankDraft, dueDate: today() }); setAdding(false)
  }
  const removeTask = id => persist(tasks.filter(task => task.id !== id), completed.filter(item => item !== id))
  const exportCsv = () => {
    const rows = [['Task', 'Room', 'Frequency', 'Due date', 'Assigned to', 'Notes', 'Status'], ...tasks.map(task => [task.title, task.room, task.frequency, task.dueDate, task.assignee, task.notes, completed.includes(task.id) ? 'Complete' : 'Pending'])]
    const blob = new Blob(['\uFEFF' + rows.map(row => row.map(escapeCsv).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'gharvision-cleaning-schedule.csv'; a.click(); URL.revokeObjectURL(url)
  }
  const reset = () => { const next = starterTasks.map(task => ({ ...task })); persist(next, []); setFilter('All'); setRoomFilter('All rooms'); setQuery(''); setNotice('Starter schedule restored') }
  const rooms = ['All rooms', ...new Set(tasks.map(task => task.room).filter(Boolean))]
  const visible = tasks.filter(task => {
    const statusMatch = filter === 'All' || (filter === 'Pending' && !completed.includes(task.id)) || (filter === 'Complete' && completed.includes(task.id)) || (filter === 'Overdue' && !completed.includes(task.id) && task.dueDate && task.dueDate < today())
    const roomMatch = roomFilter === 'All rooms' || task.room === roomFilter
    const searchMatch = (task.title + ' ' + task.room + ' ' + task.assignee + ' ' + task.notes).toLowerCase().includes(query.toLowerCase())
    return statusMatch && roomMatch && searchMatch
  }).sort((a,b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))
  const done = tasks.filter(task => completed.includes(task.id)).length
  const overdue = tasks.filter(task => !completed.includes(task.id) && task.dueDate && task.dueDate < today()).length
  const dueToday = tasks.filter(task => !completed.includes(task.id) && task.dueDate === today()).length
  const progress = tasks.length ? Math.round(done / tasks.length * 100) : 0
  return <section className="clean-page">
    <header className="clean-heading"><div><p className="eyebrow"><CalendarCheck size={13}/> PHASE 19 · MAKE HOME CARE EASIER</p><h1>Cleaning & chore scheduler</h1><p className="heading-subtitle">Build a realistic routine, share responsibilities and keep recurring household jobs from slipping through the cracks.</p></div><div className="clean-actions"><button className="filter-button" onClick={reset}><RotateCcw size={15}/> Reset</button><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export CSV</button><button className="primary-button" onClick={() => setAdding(!adding)}><Plus size={15}/> Add chore</button></div></header>
    <div className="clean-notice"><Sparkles size={16}/><span>Start with the sample routine, then edit it to match your household. Due dates are reminders only; the app does not send notifications.</span>{notice && <strong>{notice}</strong>}</div>
    <div className="clean-metrics"><article><span><CalendarCheck size={18}/></span><small>ROUTINE PROGRESS</small><strong>{done} / {tasks.length}</strong><div className="clean-progress"><i style={{width: progress + '%'}}/></div><p>{progress}% of scheduled chores complete</p></article><article><span><Clock3 size={18}/></span><small>DUE TODAY</small><strong>{dueToday}</strong><p>Pending tasks scheduled for today</p></article><article><span><CalendarCheck size={18}/></span><small>OVERDUE</small><strong>{overdue}</strong><p>Pending tasks with past due dates</p></article><article><span><CheckCircle2 size={18}/></span><small>OPEN TASKS</small><strong>{tasks.length - done}</strong><p>Tasks left in your current routine</p></article></div>
    {adding && <form className="clean-panel clean-add-form" onSubmit={addTask}><div className="clean-panel-title"><div><h3>Add a household chore</h3><p>Give the task a clear name and a practical due date.</p></div></div><div className="clean-fields"><label className="clean-wide">Chore name<input required autoFocus value={draft.title} onChange={e => setDraft({...draft,title:e.target.value})} placeholder="e.g. Mop kitchen floor"/></label><label>Room<select value={draft.room} onChange={e => setDraft({...draft,room:e.target.value})}>{['Kitchen','Bathroom','Bedroom','Living room','Laundry','Outdoor','Whole home','Other'].map(room => <option key={room}>{room}</option>)}</select></label><label>Frequency<select value={draft.frequency} onChange={e => setDraft({...draft,frequency:e.target.value})}>{['Daily','Weekly','Monthly','Seasonal','One-time'].map(freq => <option key={freq}>{freq}</option>)}</select></label><label>Due date<input type="date" value={draft.dueDate} onChange={e => setDraft({...draft,dueDate:e.target.value})}/></label><label>Assigned to (optional)<input value={draft.assignee} onChange={e => setDraft({...draft,assignee:e.target.value})} placeholder="Name"/></label><label className="clean-wide">Notes (optional)<input value={draft.notes} onChange={e => setDraft({...draft,notes:e.target.value})} placeholder="Supplies, steps or reminders"/></label></div><div className="clean-form-actions"><button type="button" className="filter-button" onClick={() => setAdding(false)}>Cancel</button><button className="primary-button" type="submit">Save chore</button></div></form>}
    <section className="clean-panel"><div className="clean-panel-title"><div><h3>Your household routine</h3><p>Edit assignments, due dates and notes directly in the schedule.</p></div><span className="clean-count">{visible.length} shown</span></div><div className="clean-toolbar"><div className="clean-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search chores, rooms or people"/></div><select aria-label="Filter by room" value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>{rooms.map(room => <option key={room}>{room}</option>)}</select></div><div className="clean-filters">{['All','Pending','Complete','Overdue'].map(item => <button key={item} className={filter===item?'clean-filter-active':''} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="clean-task-list">{visible.length ? visible.map(task => <article className={'clean-task '+(completed.includes(task.id)?'clean-task-done':'')} key={task.id}><button className="clean-task-check" aria-label={completed.includes(task.id)?'Mark pending':'Mark complete'} onClick={() => toggle(task.id)}>{completed.includes(task.id)?<CheckCircle2 size={20}/>:<Circle size={20}/>}</button><div className="clean-task-main"><strong>{task.title}</strong><div className="clean-task-meta"><span>{task.room}</span><span>{task.frequency}</span>{task.dueDate && <span className={!completed.includes(task.id)&&task.dueDate<today()?'clean-overdue':''}>{task.dueDate===today()?'Due today':task.dueDate}</span>}{task.assignee && <span>Assigned: {task.assignee}</span>}</div>{task.notes && <p>{task.notes}</p>}<div className="clean-inline-edit"><label>Due<input aria-label={'Due date for '+task.title} type="date" value={task.dueDate||''} onChange={e=>updateTask(task.id,'dueDate',e.target.value)}/></label><label>Assigned to<input aria-label={'Assignee for '+task.title} value={task.assignee||''} onChange={e=>updateTask(task.id,'assignee',e.target.value)} placeholder="Add name"/></label><label>Notes<input aria-label={'Notes for '+task.title} value={task.notes||''} onChange={e=>updateTask(task.id,'notes',e.target.value)} placeholder="Optional note"/></label></div></div><button className="clean-delete" aria-label={'Delete '+task.title} onClick={() => removeTask(task.id)}><Trash2 size={15}/></button></article>) : <div className="clean-empty">No chores match these filters. Try another filter or add a chore.</div>}</div></section>
    <p className="clean-footnote">This is a browser-based schedule, not a shared household account. It does not send reminders, sync between devices or automatically reschedule recurring tasks; adjust due dates after each completion.</p>
  </section>
}
