import { useMemo, useState } from 'react'
import { AlertTriangle, Download, ShieldCheck, Plus, Trash2, CheckCircle2, Circle, Phone, House, MapPin, Flame, Droplets, Zap, HeartPulse, ClipboardCheck, Printer, RotateCcw } from 'lucide-react'

const KEY = 'gharvision-home-safety-v1'
const starterTasks = [
  { id: 'smoke', group: 'Fire safety', title: 'Test smoke alarms and replace batteries when needed' },
  { id: 'extinguisher', group: 'Fire safety', title: 'Know the location and correct use of a suitable fire extinguisher' },
  { id: 'escape', group: 'Evacuation', title: 'Plan two ways out where possible and keep exits clear' },
  { id: 'meeting', group: 'Evacuation', title: 'Choose an outdoor family meeting point away from the building' },
  { id: 'firstaid', group: 'First aid', title: 'Keep a stocked first-aid kit and check expiry dates' },
  { id: 'medicines', group: 'First aid', title: 'Keep essential medicines and emergency medical information accessible' },
  { id: 'electric', group: 'Utilities', title: 'Label the electrical main switch and keep access clear' },
  { id: 'water', group: 'Utilities', title: 'Know where the main water shutoff is, if applicable' },
  { id: 'gas', group: 'Utilities', title: 'Know the gas shutoff location and supplier emergency instructions' },
  { id: 'numbers', group: 'Communication', title: 'Save local emergency numbers and an out-of-area contact' },
  { id: 'documents', group: 'Communication', title: 'Keep copies of key documents and insurance details safely backed up' },
  { id: 'pets', group: 'Evacuation', title: 'Include children, older adults, people needing assistance and pets in the plan' },
]
const blankPlan = {
  homeName: '', address: '', meetingPoint: '', outOfAreaContact: '', specialNeeds: '',
  electricLocation: '', waterLocation: '', gasLocation: '', extinguisherLocation: '', firstAidLocation: '',
  contacts: [{ id: 'local-emergency', label: 'Local emergency number', name: '', phone: '' }],
  checked: [], lastReview: ''
}
const readPlan = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { ...blankPlan, ...saved, contacts: Array.isArray(saved.contacts) && saved.contacts.length ? saved.contacts : blankPlan.contacts, checked: Array.isArray(saved.checked) ? saved.checked : [] }
  } catch { return { ...blankPlan, contacts: [...blankPlan.contacts], checked: [] } }
}
const GROUPS = ['All', ...new Set(starterTasks.map(task => task.group))]
const inputFields = [
  { key: 'homeName', label: 'Plan name / household', placeholder: 'e.g. Home emergency plan' },
  { key: 'address', label: 'Home address (optional)', placeholder: 'Address for your private reference' },
  { key: 'meetingPoint', label: 'Outdoor meeting point', placeholder: 'A safe spot away from the building' },
  { key: 'outOfAreaContact', label: 'Out-of-area contact', placeholder: 'Name and phone, if useful' },
  { key: 'electricLocation', label: 'Electrical main switch', placeholder: 'Where to find it' },
  { key: 'waterLocation', label: 'Main water shutoff', placeholder: 'Where to find it' },
  { key: 'gasLocation', label: 'Gas shutoff / supplier instructions', placeholder: 'Location or safe instructions' },
  { key: 'extinguisherLocation', label: 'Fire extinguisher / blanket', placeholder: 'Location and type' },
  { key: 'firstAidLocation', label: 'First-aid kit', placeholder: 'Location' },
  { key: 'specialNeeds', label: 'Assistance notes (optional)', placeholder: 'Mobility, communication, children, pets or other needs' },
]
export default function HomeSafetyPlan() {
  const initial = useMemo(readPlan, [])
  const [plan, setPlan] = useState(initial)
  const [filter, setFilter] = useState('All')
  const [notice, setNotice] = useState('')
  const [showAddContact, setShowAddContact] = useState(false)
  const [contactDraft, setContactDraft] = useState({ label: 'Emergency contact', name: '', phone: '' })
  const save = next => {
    setPlan(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)); setNotice('Saved on this device') }
    catch { setNotice('Could not save in this browser. Export a backup.') }
  }
  const updateField = (key, value) => save({ ...plan, [key]: value })
  const toggleTask = id => save({ ...plan, checked: plan.checked.includes(id) ? plan.checked.filter(item => item !== id) : [...plan.checked, id] })
  const addContact = () => {
    if (!contactDraft.label.trim() && !contactDraft.name.trim() && !contactDraft.phone.trim()) return
    save({ ...plan, contacts: [...plan.contacts, { ...contactDraft, id: 'contact-' + Date.now() }] })
    setContactDraft({ label: 'Emergency contact', name: '', phone: '' }); setShowAddContact(false)
  }
  const updateContact = (id, key, value) => save({ ...plan, contacts: plan.contacts.map(contact => contact.id === id ? { ...contact, [key]: value } : contact) })
  const removeContact = id => save({ ...plan, contacts: plan.contacts.filter(contact => contact.id !== id) })
  const exportPlan = () => {
    const payload = { exportedAt: new Date().toISOString(), plan, checklist: starterTasks.map(task => ({ ...task, completed: plan.checked.includes(task.id) })) }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'gharvision-home-safety-plan.json'; link.click(); URL.revokeObjectURL(url)
  }
  const reset = () => { const next = { ...blankPlan, contacts: [...blankPlan.contacts], checked: [] }; save(next); setNotice('Plan reset') }
  const visibleTasks = starterTasks.filter(task => filter === 'All' || task.group === filter)
  const completion = Math.round(plan.checked.length / starterTasks.length * 100)
  return <section className="safety-page">
    <header className="safety-heading"><div><p className="eyebrow"><ShieldCheck size={13}/> PHASE 18 · PREPARE BEFORE IT MATTERS</p><h1>Home safety & emergency plan</h1><p className="heading-subtitle">Keep household contacts, utility shutoff locations and preparedness checks in one private plan.</p></div><div className="safety-actions"><button className="filter-button" onClick={reset}><RotateCcw size={15}/> Reset</button><button className="primary-button" onClick={exportPlan}><Download size={15}/> Export backup</button><button className="filter-button" onClick={() => window.print()}><Printer size={15}/> Print</button></div></header>
    <div className="safety-alert"><AlertTriangle size={18}/><div><strong>If there is immediate danger, leave the unsafe area and contact local emergency services.</strong><span>This planner is not a substitute for emergency services, official instructions, or professional safety advice. Do not delay evacuation to collect belongings.</span></div></div>
    <div className="safety-metrics"><article><span><ClipboardCheck size={18}/></span><small>PREPAREDNESS CHECKS</small><strong>{plan.checked.length} / {starterTasks.length}</strong><div className="safety-progress"><i style={{ width: completion + '%' }}/></div><p>{completion}% of starter checks completed</p></article><article><span><Phone size={18}/></span><small>CONTACT RECORDS</small><strong>{plan.contacts.length}</strong><p>Keep numbers verified and accessible offline</p></article><article><span><MapPin size={18}/></span><small>MEETING POINT</small><strong className="safety-text-metric">{plan.meetingPoint.trim() ? 'Added' : 'Not set'}</strong><p>Choose a safe place outside the building</p></article><article><span><House size={18}/></span><small>UTILITY LOCATIONS</small><strong>{[plan.electricLocation, plan.waterLocation, plan.gasLocation].filter(value => value.trim()).length} / 3</strong><p>Record locations only when known and safe</p></article></div>
    <div className="safety-grid">
      <section className="safety-panel"><div className="safety-panel-title"><div><h3>Household details</h3><p>Use only information you are comfortable storing in this browser.</p></div><House size={19}/></div><div className="safety-fields">{inputFields.map(field => <label key={field.key} className={field.key === 'specialNeeds' ? 'safety-wide' : ''}>{field.label}<input value={plan[field.key] || ''} onChange={event => updateField(field.key, event.target.value)} placeholder={field.placeholder}/></label>)}</div><label className="safety-review">Last plan review date<input type="date" value={plan.lastReview} onChange={event => updateField('lastReview', event.target.value)}/></label></section>
      <section className="safety-panel"><div className="safety-panel-title"><div><h3>Emergency contacts</h3><p>Verify all contact details and local emergency numbers.</p></div><Phone size={19}/></div><div className="safety-contacts">{plan.contacts.map(contact => <div className="safety-contact" key={contact.id}><div className="safety-contact-fields"><label>Type<input value={contact.label} onChange={event => updateContact(contact.id, 'label', event.target.value)} placeholder="Emergency service / doctor"/></label><label>Name or organisation<input value={contact.name} onChange={event => updateContact(contact.id, 'name', event.target.value)} placeholder="Contact name"/></label><label>Phone number<input type="tel" value={contact.phone} onChange={event => updateContact(contact.id, 'phone', event.target.value)} placeholder="Enter verified number"/></label></div><button className="safety-icon-button" onClick={() => removeContact(contact.id)} aria-label="Remove contact"><Trash2 size={15}/></button></div>)}</div>{showAddContact ? <div className="safety-add-contact"><label>Type<input value={contactDraft.label} onChange={event => setContactDraft({ ...contactDraft, label: event.target.value })}/></label><label>Name or organisation<input value={contactDraft.name} onChange={event => setContactDraft({ ...contactDraft, name: event.target.value })}/></label><label>Phone number<input type="tel" value={contactDraft.phone} onChange={event => setContactDraft({ ...contactDraft, phone: event.target.value })}/></label><div><button className="filter-button" onClick={() => setShowAddContact(false)}>Cancel</button><button className="primary-button" onClick={addContact}>Add contact</button></div></div> : <button className="filter-button safety-add-button" onClick={() => setShowAddContact(true)}><Plus size={15}/> Add contact</button>}<p className="safety-disclaimer">This is a private reference list, not a monitored emergency service. It cannot place calls or send alerts.</p></section>
    </div>
    <section className="safety-panel safety-checklist"><div className="safety-panel-title"><div><h3>Preparedness checklist</h3><p>Complete checks at a safe time and follow local authority guidance.</p></div><span className="safety-progress-label">{completion}% complete</span></div><div className="safety-filters">{GROUPS.map(group => <button key={group} className={filter === group ? 'safety-filter-active' : ''} onClick={() => setFilter(group)}>{group}</button>)}</div><div className="safety-task-list">{visibleTasks.map(task => <button key={task.id} className={'safety-task ' + (plan.checked.includes(task.id) ? 'safety-task-done' : '')} onClick={() => toggleTask(task.id)}><span>{plan.checked.includes(task.id) ? <CheckCircle2 size={19}/> : <Circle size={19}/>}</span><div><strong>{task.title}</strong><small>{task.group}</small></div><b>{plan.checked.includes(task.id) ? 'Done' : 'Mark done'}</b></button>)}</div></section>
    <div className="safety-bottom-note"><HeartPulse size={17}/><p>Review this plan with everyone in the household. Practise the exit plan, keep paths clear, and adapt it for children, older adults, people with disabilities and pets. Store an exported copy somewhere safe and accessible.</p></div>
  </section>
}
