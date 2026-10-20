import { useMemo, useState } from 'react'
import { CalendarDays, Plus, Download, Trash2, CheckCircle2, Circle, Clock, Wrench, Filter, RotateCcw, Save, Home, IndianRupee, AlertTriangle } from 'lucide-react'

const starterTasks = [
  {id:'m1',title:'Check smoke alarms and safety devices',room:'Whole home',category:'Safety',frequency:'Monthly',due:dateAfter(2),cost:0,priority:'High',status:'Upcoming',notes:'Test alarms and replace batteries if needed.'},
  {id:'m2',title:'Clean AC filters',room:'Living room',category:'HVAC',frequency:'Monthly',due:dateAfter(4),cost:300,priority:'Medium',status:'Upcoming',notes:'Check the filter instructions for your model.'},
  {id:'m3',title:'Inspect taps and visible pipe joints',room:'Kitchen',category:'Plumbing',frequency:'Monthly',due:dateAfter(7),cost:0,priority:'Medium',status:'Upcoming',notes:'Look for drips, damp patches and unusual smells.'},
  {id:'m4',title:'Check roof and terrace drainage',room:'Terrace / roof',category:'Exterior',frequency:'Seasonal',due:dateAfter(12),cost:500,priority:'High',status:'Upcoming',notes:'Only inspect areas that are safely accessible.'},
  {id:'m5',title:'Deep clean kitchen exhaust hood',room:'Kitchen',category:'Cleaning',frequency:'Quarterly',due:dateAfter(18),cost:250,priority:'Low',status:'Upcoming',notes:'Follow appliance cleaning guidance.'},
  {id:'m6',title:'Inspect doors, windows and seals',room:'Whole home',category:'Repairs',frequency:'Quarterly',due:dateAfter(25),cost:0,priority:'Low',status:'Upcoming',notes:'Look for sticking hinges, damaged seals and drafts.'},
]
function dateAfter(days){const d=new Date();d.setDate(d.getDate()+days);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
const readTasks=()=>{try{const s=localStorage.getItem('gharvision-maintenance');if(!s)return starterTasks;const p=JSON.parse(s);return Array.isArray(p)?p:starterTasks}catch{return starterTasks}}
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Math.max(0,Number(n)||0))
const categories=['Safety','Cleaning','Plumbing','Electrical','HVAC','Appliances','Exterior','Repairs','Garden','Other']
const rooms=['Whole home','Living room','Bedroom','Kitchen','Bathroom','Terrace / roof','Garden','Garage','Other']
export default function MaintenancePlanner(){
 const [tasks,setTasks]=useState(readTasks)
 const [filter,setFilter]=useState('All')
 const [query,setQuery]=useState('')
 const [showForm,setShowForm]=useState(false)
 const [notice,setNotice]=useState('')
 const [form,setForm]=useState({title:'',room:'Whole home',category:'Repairs',frequency:'One-time',due:dateAfter(7),cost:'',priority:'Medium',notes:''})
 const today=dateAfter(0)
 const visible=useMemo(()=>tasks.filter(t=>(filter==='All'||t.status===filter)&&(t.title+' '+t.room+' '+t.category+' '+t.notes).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>a.due.localeCompare(b.due)),[tasks,filter,query])
 const pending=tasks.filter(t=>t.status!=='Done')
 const overdue=pending.filter(t=>t.due<today)
 const upcoming=pending.filter(t=>t.due>=today)
 const totalCost=pending.reduce((s,t)=>s+(Number(t.cost)||0),0)
 const persist=next=>{setTasks(next);try{localStorage.setItem('gharvision-maintenance',JSON.stringify(next));setNotice('Maintenance plan saved on this device.')}catch{setNotice('Changes are in this session; browser storage is unavailable.')}}
 const changeStatus=(id,status)=>persist(tasks.map(t=>t.id===id?{...t,status}:t))
 const submit=e=>{e.preventDefault();if(!form.title.trim())return;const next=[...tasks,{...form,id:'m'+Date.now(),title:form.title.trim(),cost:Math.max(0,Number(form.cost)||0),status:'Upcoming'}];persist(next);setForm({title:'',room:'Whole home',category:'Repairs',frequency:'One-time',due:dateAfter(7),cost:'',priority:'Medium',notes:''});setShowForm(false)}
 const remove=id=>persist(tasks.filter(t=>t.id!==id))
 const reset=()=>{persist(starterTasks);setFilter('All');setQuery('')}
 const exportCsv=()=>{const rows=[['Task','Room','Category','Frequency','Due date','Priority','Status','Estimated cost INR','Notes'],...tasks.map(t=>[t.title,t.room,t.category,t.frequency,t.due,t.priority,t.status,t.cost,t.notes])];const csv=rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='gharvision-maintenance-plan.csv';a.click();URL.revokeObjectURL(url);setNotice('Maintenance plan exported as CSV.')}
 return <div className="maintenance-page">
  <section className="maintenance-heading"><div><p className="eyebrow"><CalendarDays size={14}/> PHASE 12 · CARE FOR YOUR HOME</p><h1>Home maintenance planner</h1><p className="heading-subtitle">Keep small home-care jobs visible before they become expensive surprises.</p></div><div className="maintenance-head-actions"><button className="filter-button" onClick={reset}><RotateCcw size={15}/> Restore sample plan</button><button className="primary-button" onClick={()=>setShowForm(v=>!v)}><Plus size={16}/> Add a task</button></div></section>
  <section className="maintenance-stats">
   <article className="maintenance-stat maintenance-stat-main"><span className="maintenance-stat-icon"><Wrench size={17}/></span><small>Tasks still to do</small><strong>{pending.length}</strong><span>Across your home</span></article>
   <article className="maintenance-stat"><span className="maintenance-stat-icon warning"><AlertTriangle size={17}/></span><small>Past due</small><strong>{overdue.length}</strong><span>Review these first</span></article>
   <article className="maintenance-stat"><span className="maintenance-stat-icon"><CalendarDays size={17}/></span><small>Upcoming</small><strong>{upcoming.length}</strong><span>Due today or later</span></article>
   <article className="maintenance-stat"><span className="maintenance-stat-icon"><IndianRupee size={17}/></span><small>Planned spend</small><strong>{money(totalCost)}</strong><span>Editable estimates</span></article>
  </section>
  {showForm&&<section className="maintenance-panel maintenance-new-task"><div className="maintenance-panel-head"><div><h2>Add a maintenance task</h2><p>Choose a due date and an optional cost estimate.</p></div><button className="filter-button" onClick={()=>setShowForm(false)}>Cancel</button></div>
   <form className="maintenance-form" onSubmit={submit}>
    <label className="maintenance-field maintenance-field-wide">Task name<input required maxLength={100} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Service water purifier"/></label>
    <label className="maintenance-field">Room / area<select value={form.room} onChange={e=>setForm({...form,room:e.target.value})}>{rooms.map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="maintenance-field">Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="maintenance-field">Frequency<select value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})}>{['One-time','Weekly','Monthly','Quarterly','Half-yearly','Yearly','Seasonal'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="maintenance-field">Due date<input type="date" value={form.due} onChange={e=>setForm({...form,due:e.target.value})} required/></label>
    <label className="maintenance-field">Priority<select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{['Low','Medium','High'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="maintenance-field">Estimated cost (₹)<input type="number" min="0" max="10000000" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="0"/></label>
    <label className="maintenance-field maintenance-field-wide">Notes (optional)<textarea rows="2" maxLength="300" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="What needs checking or which materials are needed?"/></label>
    <div className="maintenance-field-wide"><button className="primary-button" type="submit"><Save size={15}/> Save task</button></div>
   </form>
  </section>}
  <section className="maintenance-panel">
   <div className="maintenance-panel-head"><div><h2>Your maintenance checklist</h2><p>Mark jobs done, filter by status, and keep a record for later.</p></div><span className="maintenance-count">{tasks.filter(t=>t.status==='Done').length} / {tasks.length} done</span></div>
   <div className="maintenance-toolbar"><label className="maintenance-search"><Filter size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks, rooms, categories…"/></label><div className="maintenance-filters">{['All','Upcoming','Done'].map(x=><button key={x} className={filter===x?'maintenance-filter-active':''} onClick={()=>setFilter(x)}>{x}</button>)}</div></div>
   <div className="maintenance-list">{visible.map(task=>{const late=task.status!=='Done'&&task.due<today;return <article className={'maintenance-task '+(task.status==='Done'?'maintenance-task-done':'')} key={task.id}>
    <button className="maintenance-check" onClick={()=>changeStatus(task.id,task.status==='Done'?'Upcoming':'Done')} aria-label={task.status==='Done'?'Mark task not done':'Mark task done'}>{task.status==='Done'?<CheckCircle2 size={21}/>:<Circle size={21}/>}</button>
    <div className="maintenance-task-content"><div className="maintenance-task-title"><h3>{task.title}</h3>{late&&<span className="maintenance-overdue">OVERDUE</span>}</div><p>{task.room} <span>·</span> {task.category} <span>·</span> {task.frequency}</p>{task.notes&&<small>{task.notes}</small>}<div className="maintenance-task-meta"><span><CalendarDays size={12}/>{task.due||'No due date'}</span><span className={'maintenance-priority priority-'+task.priority.toLowerCase()}>{task.priority} priority</span></div></div>
    <div className="maintenance-task-end"><strong>{money(task.cost)}</strong><span>{task.status}</span><button onClick={()=>remove(task.id)} aria-label={'Delete '+task.title} title="Delete task"><Trash2 size={15}/></button></div>
   </article>})}{visible.length===0&&<div className="maintenance-empty"><Home size={24}/><strong>No matching tasks</strong><span>Try another search or add a maintenance task.</span></div>}</div>
   <div className="maintenance-list-footer"><span>{visible.length} task{visible.length===1?'':'s'} shown</span><button className="filter-button" onClick={exportCsv}><Download size={15}/> Export all tasks (CSV)</button></div>
  </section>
  <div className="maintenance-note"><AlertTriangle size={17}/><p><strong>Safety note:</strong> This checklist is a general reminder, not a professional inspection schedule. Follow manufacturer instructions and local regulations. Do not climb onto roofs or attempt electrical, gas or structural work yourself; use a qualified professional for hazardous or specialist tasks.</p></div>
  {notice&&<div className="maintenance-toast" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss message">×</button></div>}
 </div>
}
