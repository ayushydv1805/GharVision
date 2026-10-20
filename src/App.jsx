import { useEffect, useRef, useState } from 'react'
import FloorPlanner from './FloorPlanner.jsx'
import AIPlanGenerator from './AIPlanGenerator.jsx'
import RoomMakeover from './RoomMakeover.jsx'
import PaintMaterials from './PaintMaterials.jsx'
import InteriorDesign from './InteriorDesign.jsx'
import HomeView3D from './HomeView3D.jsx'
import ExteriorDesign from './ExteriorDesign.jsx'
import BuildBudget from './BuildBudget.jsx'
import MaintenancePlanner from './MaintenancePlanner.jsx'
import RenovationTracker from './RenovationTracker.jsx'
import MaterialEstimator from './MaterialEstimator.jsx'
import HomeInventory from './HomeInventory.jsx'
import UtilityTracker from './UtilityTracker.jsx'
import SustainabilityPlanner from './SustainabilityPlanner.jsx'
import HomeSafetyPlan from './HomeSafetyPlan.jsx'
import CleaningScheduler from './CleaningScheduler.jsx'
import MovePlanner from './MovePlanner.jsx'
import HomeProjectTracker from './HomeProjectTracker.jsx'
import VendorQuoteTracker from './VendorQuoteTracker.jsx'
import HomeCareLog from './HomeCareLog.jsx'
import InsuranceTracker from './InsuranceTracker.jsx'
import HomeBudgetPlanner from './HomeBudgetPlanner.jsx'
import HandoverChecklist from './HandoverChecklist.jsx'
import {
  House, HardHat, CalendarClock, ShieldCheck, Wallet, LayoutDashboard, FolderKanban, Compass, PanelsTopLeft, Palette, ImagePlus, Calculator, CalendarDays, ClipboardList, Archive, ReceiptText, Leaf, CalendarCheck, Truck, ClipboardCheck,
  Box, Ruler, Sparkles, Settings, Sun, Moon, Plus, Search, Bell, ChevronDown,
  ArrowUpRight, ArrowRight, MoreHorizontal, Clock3, MapPin, Check, X,
  Menu, SlidersHorizontal, WandSparkles, Sofa, Paintbrush, Grid2X2, Layers3,
  CircleHelp, Command, MoveUpRight, Heart, Home, Building2, Trees, Lightbulb
} from 'lucide-react'

const initialProjects = [
  { id: 1, name: 'The Willow Residence', type: 'Family home', location: 'Chandigarh, India', updated: 'Edited 2 hours ago', progress: 68, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85', color: 'sage' },
  { id: 2, name: 'Sunday House', type: 'Weekend retreat', location: 'Kasauli, Himachal', updated: 'Edited yesterday', progress: 34, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85', color: 'sand' },
  { id: 3, name: 'Urban Nest', type: 'Apartment', location: 'Gurugram, India', updated: 'Edited 3 days ago', progress: 82, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85', color: 'blue' },
]

const navGroups = [
  { label: 'WORKSPACE', items: [
    { id: 'Overview', icon: LayoutDashboard },
    { id: 'My projects', icon: FolderKanban, count: '03' },
    { id: 'Explore ideas', icon: Compass },
  ]},
  { label: 'DESIGN STUDIO', items: [
    { id: 'Floor planner', icon: PanelsTopLeft },
    { id: 'AI floor plan', icon: WandSparkles, tag: 'NEW' },
    { id: 'Room makeover', icon: ImagePlus, tag: 'NEW' },
    { id: 'Interior design', icon: Sofa, tag: 'NEW' },
    { id: 'Paint & materials', icon: Palette, tag: 'NEW' },
    { id: '3D home view', icon: Box, tag: 'NEW' },
    { id: 'Exterior design', icon: Building2, tag: 'NEW' },
    { id: 'Build budget', icon: Calculator, tag: 'NEW' },
    { id: 'Maintenance planner', icon: CalendarDays, tag: 'NEW' },
    { id: 'Renovation tracker', icon: ClipboardList, tag: 'NEW' },
    { id: 'Material estimator', icon: Layers3, tag: 'NEW' },
    { id: 'Home inventory', icon: Archive, tag: 'NEW' },
    { id: 'Utility tracker', icon: ReceiptText, tag: 'NEW' },
    { id: 'Sustainability planner', icon: Leaf, tag: 'NEW' },
    { id: 'Home safety plan', icon: ShieldCheck, tag: 'NEW' },
    { id: 'Cleaning scheduler', icon: CalendarCheck, tag: 'NEW' },
    { id: 'Moving planner', icon: Truck, tag: 'NEW' },
    { id: 'Home project tracker', icon: ClipboardCheck, tag: 'NEW' },
    { id: 'Vendor & quote tracker', icon: HardHat, tag: 'NEW' },
    { id: 'Home care log', icon: CalendarClock, tag: 'NEW' },
    { id: 'Insurance & renewals', icon: ShieldCheck, tag: 'NEW' },
    { id: 'Home budget planner', icon: Wallet, tag: 'NEW' },
    { id: 'Handover & snag list', icon: ClipboardCheck, tag: 'NEW' },
  ]},
]

const toolCards = [
  { icon: PanelsTopLeft, title: 'Floor planner', desc: 'Bring your layout to life', tone: 'green', badge: 'READY TO USE' },
  { icon: Sofa, title: 'Interior studio', desc: 'Make every room feel like you', tone: 'peach', badge: 'READY TO USE' },
  { icon: Paintbrush, title: 'Paint & materials', desc: 'Find your perfect finish', tone: 'lavender', badge: 'READY TO USE' },
  { icon: Box, title: '3D home view', desc: 'See the bigger picture', tone: 'blue', badge: 'READY TO USE' },
  { icon: Building2, title: 'Exterior design', desc: 'Design the first impression', tone: 'green', badge: 'READY TO USE' },
  { icon: Calculator, title: 'Build budget', desc: 'Estimate the cost before you build', tone: 'lavender', badge: 'READY TO USE' },
  { icon: CalendarDays, title: 'Maintenance planner', desc: 'Stay ahead of home-care jobs', tone: 'blue', badge: 'READY TO USE' },
  { icon: ClipboardList, title: 'Renovation tracker', desc: 'Coordinate tasks, dates and real spend', tone: 'peach', badge: 'READY TO USE' },
  { icon: Layers3, title: 'Material estimator', desc: 'Compare finish options and estimate quantities', tone: 'green', badge: 'READY TO USE' },
  { icon: Archive, title: 'Home inventory', desc: 'Track household items and warranty dates', tone: 'blue', badge: 'READY TO USE' },
  { icon: ReceiptText, title: 'Utility tracker', desc: 'Track monthly bills and household utility spend', tone: 'lavender', badge: 'PHASE 16' },
  { icon: Leaf, title: 'Sustainability planner', desc: 'Explore solar, rainwater and practical eco-actions', tone: 'green', badge: 'PHASE 17' },
  { icon: ShieldCheck, title: 'Home safety plan', desc: 'Prepare emergency contacts, utility locations and safety checks', tone: 'blue', badge: 'PHASE 18' },
  { icon: CalendarCheck, title: 'Cleaning scheduler', desc: 'Organise recurring chores, assignments and due dates', tone: 'green', badge: 'PHASE 19' },
  { icon: Truck, title: 'Moving planner', desc: 'Organise moving tasks, dates and your relocation budget', tone: 'blue', badge: 'PHASE 20' },
  { icon: ClipboardCheck, title: 'Home project tracker', desc: 'Track improvements, milestones and project spending', tone: 'green', badge: 'NEW IN PHASE 21' },
  { icon: HardHat, title: 'Vendor & quote tracker', desc: 'Compare contractors, quotes, timelines and scope notes', tone: 'peach', badge: 'NEW IN PHASE 22' },
  { icon: CalendarClock, title: 'Home care log', desc: 'Record maintenance tasks, due dates and completed work', tone: 'blue', badge: 'NEW IN PHASE 23' },
  { icon: ShieldCheck, title: 'Insurance & renewals', desc: 'Keep home policy details, premiums and renewal dates together', tone: 'green', badge: 'NEW IN PHASE 24' },
  { icon: Wallet, title: 'Home budget planner', desc: 'Compare planned costs with actual home project spending', tone: 'peach', badge: 'NEW IN PHASE 25' },
  { icon: ClipboardCheck, title: 'Handover & snag list', desc: 'Record defects, assign fixes and track inspection close-out', tone: 'blue', badge: 'NEW IN PHASE 26' },
]

function Logo() {
  return <div className="brand-mark"><House size={19} strokeWidth={2.1} /><span className="brand-spark">✳</span></div>
}

function Sidebar({ active, setActive, onCreate, mobileOpen, setMobileOpen }) {
  return <>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><Logo /><span>ghar<span className="brand-vision">vision</span></span><button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
      <button className="workspace-switch"><div className="workspace-avatar">G</div><div className="workspace-copy"><strong>My workspace</strong><span>Personal plan</span></div><ChevronDown size={15} /></button>
      <button className="new-project-button" onClick={() => { onCreate(); setMobileOpen(false) }}><Plus size={17}/><span>New project</span><span className="shortcut">⌘ K</span></button>
      <nav className="side-nav">
        {navGroups.map(group => <div className="nav-group" key={group.label}><p className="nav-label">{group.label}</p>{group.items.map(item => {
          const Icon = item.icon
          return <button key={item.id} className={`nav-item ${active === item.id ? 'nav-active' : ''}`} onClick={() => { setActive(item.id); setMobileOpen(false) }}><Icon size={17} strokeWidth={1.8}/><span>{item.id}</span>{item.count && <span className="nav-count">{item.count}</span>}{item.tag && <span className="soon-tag">{item.tag}</span>}</button>
        })}</div>)}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-tip"><div className="tip-icon"><Sparkles size={16}/></div><strong>A home that feels like you.</strong><p>Your ideas deserve a space of their own.</p><button onClick={() => setActive('Explore ideas')}>Get inspired <ArrowRight size={13}/></button><div className="tip-orbit orbit-one"/><div className="tip-orbit orbit-two"/></div>
      <button className={`nav-item bottom-nav ${active === 'Settings' ? 'nav-active' : ''}`} onClick={() => { setActive('Settings'); setMobileOpen(false) }}><Settings size={17}/><span>Settings</span></button>
      <div className="profile-row"><div className="profile-avatar">AY</div><div className="profile-copy"><strong>Ayush Yadav</strong><span>Free workspace</span></div><MoreHorizontal size={18}/></div>
    </aside>
  </>
}

function ProjectCard({ project, onOpen }) {
  return <article className="project-card">
    <button className="project-image-wrap" onClick={() => onOpen(project)} aria-label={`Open ${project.name}`}>
      <img src={project.image} alt={project.name} className="project-image" loading="lazy"/>
      <span className="image-chip"><span className="live-dot"/> In progress</span>
      <span className="image-open"><ArrowUpRight size={17}/></span>
    </button>
    <div className="project-card-body">
      <div className="project-title-line"><div><h3>{project.name}</h3><p>{project.type}</p></div><button className="icon-button small-icon" onClick={() => onOpen(project)} aria-label={`Open options for ${project.name}`} title="Open project"><MoreHorizontal size={18}/></button></div>
      <div className="project-location"><MapPin size={13}/>{project.location}</div>
      <div className="progress-meta"><span>Project progress</span><strong>{project.progress}%</strong></div>
      <div className="progress-track"><span style={{width: project.progress + '%'}} /></div>
      <div className="project-updated"><Clock3 size={13}/>{project.updated}</div>
    </div>
  </article>
}

function CreateProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [kind, setKind] = useState('Family home')
  const [style, setStyle] = useState('Warm minimal')
  const [size, setSize] = useState('1200')
  const submit = (e) => { e.preventDefault(); if (name.trim()) onCreate({ name: name.trim(), type: kind, style, size }) }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div className="modal-top"><div className="modal-icon"><House size={20}/></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19}/></button></div>
    <p className="eyebrow">A NEW BEGINNING</p><h2 id="modal-title">Let's make room for<br/>your next big idea.</h2><p className="modal-intro">Start with a few details. You can change everything later.</p>
    <form onSubmit={submit}>
      <label className="field-label" htmlFor="project-name">Project name</label><input id="project-name" autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Our forever home" required maxLength={60}/>
      <label className="field-label" htmlFor="home-type">What are we dreaming up?</label><select id="home-type" value={kind} onChange={e => setKind(e.target.value)}><option>Family home</option><option>Apartment</option><option>Weekend retreat</option><option>Renovation</option><option>Studio space</option></select>
      <div className="field-two"><div><label className="field-label" htmlFor="home-size">Plot / home area (sq. ft.)</label><input id="home-size" type="number" min="100" max="100000" value={size} onChange={e => setSize(e.target.value)}/></div><div><label className="field-label" htmlFor="home-style">Design mood</label><select id="home-style" value={style} onChange={e => setStyle(e.target.value)}><option>Warm minimal</option><option>Modern luxury</option><option>Indian contemporary</option><option>Rustic natural</option><option>Scandinavian</option></select></div></div>
      <button className="primary-button modal-submit" type="submit">Create my project <ArrowRight size={16}/></button>
    </form>
    <p className="modal-footnote"><Sparkles size={13}/> Your space. Your pace. Your vision.</p>
  </section></div>
}

function ComingSoon({ title, setActive }) {
  const tool = toolCards.find(t => t.title.toLowerCase().includes(title.toLowerCase().split(' ')[0])) || toolCards[0]
  const Icon = tool.icon
  return <div className="coming-page"><div className={`coming-illustration ${tool.tone}`}><Icon size={36}/><span className="illustration-spark">✳</span></div><span className="coming-pill"><span className="live-dot"/> PART OF THE JOURNEY</span><h1>{title}</h1><p className="coming-description">We're laying the groundwork for a thoughtful design experience. This studio is coming in a future phase of GharVision.</p><div className="coming-preview"><div className="preview-icon"><WandSparkles size={18}/></div><div><strong>Made for your dream home</strong><p>Designed to be simple, visual, and genuinely useful.</p></div></div><button className="primary-button" onClick={() => setActive('Overview')}>Back to overview <ArrowRight size={16}/></button></div>
}

function SettingsPage({ theme, toggleTheme, textSize, setTextSize }) {
  return <div className="settings-page"><div className="page-heading"><div><p className="eyebrow">MAKE YOURSELF AT HOME</p><h1>Settings</h1><p className="heading-subtitle">A few little things to make GharVision yours.</p></div></div><section className="settings-card"><div className="settings-card-heading"><div className="settings-icon"><Sun size={19}/></div><div><h3>Appearance</h3><p>Choose the look that feels right to you.</p></div></div><div className="setting-row"><div><strong>Color theme</strong><p>Switch between light and dark mode.</p></div><button className="theme-switch" onClick={toggleTheme}><span>{theme === 'light' ? <Sun size={15}/> : <Moon size={15}/>}</span>{theme === 'light' ? 'Light mode' : 'Dark mode'}<span className={`switch-track ${theme === 'dark' ? 'switch-on' : ''}`}><i/></span></button></div><div className="setting-row"><div><strong>Text size</strong><p>Adjust interface text for comfortable reading.</p></div><select className="setting-select" aria-label="Text size" value={textSize} onChange={e => setTextSize(e.target.value)}><option value="small">Small</option><option value="normal">Default</option><option value="large">Large</option></select></div><div className="setting-row"><div><strong>Workspace</strong><p>Your personal design space.</p></div><span className="setting-value">My workspace</span></div><div className="setting-row"><div><strong>Plan</strong><p>Explore the core experience as it grows.</p></div><span className="free-plan-badge">Free plan</span></div></section><p className="settings-note"><CircleHelp size={15}/> More account settings will be available in a later phase.</p></div>
}

export default function App() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('gharvision-theme') || 'light' } catch { return 'light' } })
  const [textSize, setTextSize] = useState(() => { try { const value = localStorage.getItem('gharvision-text-size'); return ['small','normal','large'].includes(value) ? value : 'normal' } catch { return 'normal' } })
  const [active, setActive] = useState('Overview')
  const [projects, setProjects] = useState(() => { try { const saved = localStorage.getItem('gharvision-projects'); return saved ? [...JSON.parse(saved), ...initialProjects.filter(p => !JSON.parse(saved).some(s => s.name === p.name))] : initialProjects } catch { return initialProjects } })
  const [modalOpen, setModalOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchInputRef = useRef(null)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('gharvision-theme', theme) } catch { /* Storage may be unavailable in restricted browser contexts. */ } }, [theme])
  useEffect(() => { document.documentElement.dataset.textSize = textSize; try { localStorage.setItem('gharvision-text-size', textSize) } catch { /* Keep the selected size for this session if storage is blocked. */ } }, [textSize])
  useEffect(() => { try { localStorage.setItem('gharvision-projects', JSON.stringify(projects.filter(p => !initialProjects.some(i => i.id === p.id)))) } catch { /* Keep the current session usable when storage is blocked or full. */ } }, [projects])
  useEffect(() => { if (!modalOpen) return; const handler = e => e.key === 'Escape' && setModalOpen(false); window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [modalOpen])
  useEffect(() => { const handler = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchInputRef.current?.focus() } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [])
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const createProject = data => { const p = { ...data, id: Date.now(), location: 'Location not set', updated: 'Created just now', progress: 8, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85' }; setProjects(prev => [p, ...prev]); setModalOpen(false); setActive('My projects'); setToast('Your new project is ready to explore.'); window.setTimeout(() => setToast(''), 3200) }
  const openProject = project => { setSelectedProject(project); setToast(`Opening ${project.name} — detailed design tools arrive in upcoming phases.`); window.setTimeout(() => setToast(''), 3600) }
  const openGeneratedPlan = (rooms, plot) => { try { localStorage.setItem('gharvision-floorplan', JSON.stringify(rooms)); localStorage.setItem('gharvision-generated-plot', JSON.stringify(plot)) } catch { setToast('Browser storage is unavailable. Enable site storage to transfer this layout.'); window.setTimeout(() => setToast(''), 3200); return } setActive('Floor planner'); setToast('Layout opened in Floor Planner. You can now move, resize and rename rooms.'); window.setTimeout(() => setToast(''), 3200) }
  const visibleProjects = projects.filter(p => (p.name + ' ' + p.type + ' ' + p.location).toLowerCase().includes(search.toLowerCase()))
  return <div className="app-shell">
    <Sidebar active={active} setActive={setActive} onCreate={() => setModalOpen(true)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><button className="mobile-menu-button icon-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20}/></button><span>Workspace</span><span className="crumb-slash">/</span><strong>{active}</strong></div><div className="topbar-actions"><label className="top-search"><Search size={16}/><input ref={searchInputRef} aria-label="Search projects" placeholder="Search anything..." value={search} onChange={e => { setSearch(e.target.value); if(e.target.value) setActive('My projects') }}/><kbd>⌘ K</kbd></label><button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>{theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}</button><div className="notification-wrap"><button className={`icon-button notification-button ${notificationOpen ? 'icon-selected' : ''}`} onClick={() => setNotificationOpen(v => !v)} aria-label="Notifications"><Bell size={18}/><i/></button>{notificationOpen && <div className="notification-popover"><div className="notification-head"><strong>You're all caught up</strong><span>Just now</span></div><p>Your GharVision workspace is ready. Your next big idea starts here.</p><button onClick={() => setNotificationOpen(false)}>Got it <Check size={14}/></button></div>}</div><div className="top-avatar">AY</div></div></header>
      {active === 'Overview' && <div className="page-content">
        <section className="welcome-row"><div><p className="eyebrow"><span className="eyebrow-star">✳</span> YOUR SPACE TO IMAGINE</p><h1>Good afternoon, Ayush<span className="wave">✳</span></h1><p className="heading-subtitle">Big dreams start with a little imagination. Let's build yours.</p></div><button className="primary-button welcome-cta" onClick={() => setModalOpen(true)}><Plus size={17}/> New project</button></section>
        <section className="hero-banner"><div className="hero-copy"><div className="hero-overline"><Sparkles size={14}/> A LITTLE INSPIRATION</div><h2>Your dream home<br/>starts <em>with an idea.</em></h2><p>From the first rough sketch to the final finishing touch, create a home that feels unmistakably yours.</p><button className="hero-button" onClick={() => setActive('Explore ideas')}>Find your inspiration <ArrowRight size={15}/></button><div className="hero-note"><span className="hero-note-line"/> Made for the way you live.</div></div><div className="hero-image-side"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1300&q=90" alt="Warm, light-filled contemporary home interior"/><div className="hero-image-caption"><span className="caption-spark">✳</span><div><strong>Quietly beautiful.</strong><span>Warm minimal · Natural light</span></div><Heart size={17}/></div><div className="hero-stamp"><span>YOUR</span><strong>HOME</strong><span>YOUR STORY</span></div></div><div className="hero-decoration deco-a"/><div className="hero-decoration deco-b"/></section>
        <section className="projects-section"><div className="section-heading"><div><div className="section-title-line"><h2>Your projects</h2><span className="count-pill">{projects.length.toString().padStart(2,'0')}</span></div><p>Every dream has a starting point.</p></div><button className="text-link" onClick={() => { setActive('My projects'); setSearch('') }}>View all projects <ArrowRight size={15}/></button></div>
          <div className="projects-grid">{projects.slice(0,3).map(p => <ProjectCard key={p.id} project={p} onOpen={openProject}/>)}<button className="add-project-card" onClick={() => setModalOpen(true)}><span className="add-project-icon"><Plus size={22}/></span><strong>Something new?</strong><span>Start a fresh project</span><span className="add-project-arrow"><ArrowUpRight size={16}/></span></button></div>
        </section>
        <section className="tools-section"><div className="section-heading"><div><h2>Make it yours</h2><p>Tools to turn your ideas into a place to call home.</p></div><span className="phase-label"><Sparkles size={13}/> THE DESIGN STUDIO</span></div><div className="tools-grid">{toolCards.map(tool => { const Icon = tool.icon; return <button key={tool.title} className="tool-card" onClick={() => setActive(tool.title === 'Vendor & quote tracker' ? 'Vendor & quote tracker' : tool.title === 'Floor planner' ? 'Floor planner' : tool.title === 'Interior studio' ? 'Interior design' : tool.title === 'Paint & materials' ? 'Paint & materials' : tool.title === 'Exterior design' ? 'Exterior design' : tool.title === 'Build budget' ? 'Build budget' : tool.title === 'Maintenance planner' ? 'Maintenance planner' : tool.title === 'Renovation tracker' ? 'Renovation tracker' : tool.title === 'Material estimator' ? 'Material estimator' : tool.title === 'Home inventory' ? 'Home inventory' : tool.title === 'Utility tracker' ? 'Utility tracker' : tool.title === 'Sustainability planner' ? 'Sustainability planner' : tool.title === 'Home safety plan' ? 'Home safety plan' : tool.title === 'Cleaning scheduler' ? 'Cleaning scheduler' : tool.title === 'Moving planner' ? 'Moving planner' : tool.title === 'Home project tracker' ? 'Home project tracker' : tool.title === 'Home budget planner' ? 'Home budget planner' : tool.title === 'Handover & snag list' ? 'Handover & snag list' : '3D home view')}><div className={`tool-icon ${tool.tone}`}><Icon size={19}/></div><span className="tool-badge">{tool.badge}</span><h3>{tool.title}</h3><p>{tool.desc}</p><span className="tool-arrow"><ArrowUpRight size={16}/></span></button> })}</div></section>
        <footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 01</span></footer>
      </div>}
      {active === 'My projects' && <div className="page-content"><section className="welcome-row"><div><p className="eyebrow">YOUR IDEAS, ALL IN ONE PLACE</p><h1>My projects<span className="wave">✳</span></h1><p className="heading-subtitle">A little progress is still progress.</p></div><button className="primary-button welcome-cta" onClick={() => setModalOpen(true)}><Plus size={17}/> New project</button></section><div className="projects-toolbar"><label className="project-search"><Search size={16}/><input placeholder="Find a project..." value={search} onChange={e => setSearch(e.target.value)}/></label><button className="filter-button" onClick={() => { setSearch(''); setToast('Showing all projects.'); window.setTimeout(() => setToast(''),2200) }}><SlidersHorizontal size={15}/> Clear filters</button></div>{visibleProjects.length ? <div className="projects-grid projects-all-grid">{visibleProjects.map(p => <ProjectCard key={p.id} project={p} onOpen={openProject}/>)}<button className="add-project-card" onClick={() => setModalOpen(true)}><span className="add-project-icon"><Plus size={22}/></span><strong>Something new?</strong><span>Start a fresh project</span><span className="add-project-arrow"><ArrowUpRight size={16}/></span></button></div> : <div className="empty-state"><Search size={25}/><h3>No projects found</h3><p>Try another search, or start a new project.</p><button className="primary-button" onClick={() => { setSearch(''); setModalOpen(true) }}>Create a project <Plus size={15}/></button></div>}<footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 01</span></footer></div>}
      {active === 'Floor planner' && <div className="page-content"><FloorPlanner/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 02</span></footer></div>}
      {active === 'AI floor plan' && <div className="page-content"><AIPlanGenerator onOpenPlanner={openGeneratedPlan}/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 04</span></footer></div>}
      {active === 'Room makeover' && <div className="page-content"><RoomMakeover/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 05</span></footer></div>}
      {active === 'Paint & materials' && <div className="page-content"><PaintMaterials/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 06</span></footer></div>}
      {active === 'Interior design' && <div className="page-content"><InteriorDesign/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 07</span></footer></div>}
      {active === '3D home view' && <div className="page-content"><HomeView3D onEditPlan={() => setActive('Floor planner')}/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 08</span></footer></div>}
      {active === 'Exterior design' && <div className="page-content"><ExteriorDesign/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 09–10</span></footer></div>}
      {active === 'Build budget' && <div className="page-content"><BuildBudget/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 11</span></footer></div>}
      {active === 'Maintenance planner' && <div className="page-content"><MaintenancePlanner/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 12</span></footer></div>}
      {active === 'Renovation tracker' && <div className="page-content"><RenovationTracker/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 13</span></footer></div>}
      {active === 'Material estimator' && <div className="page-content"><MaterialEstimator/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 14</span></footer></div>}
      {active === 'Home inventory' && <div className="page-content"><HomeInventory/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 15</span></footer></div>}
      {active === 'Utility tracker' && <div className="page-content"><UtilityTracker/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 16</span></footer></div>}
      {active === 'Sustainability planner' && <div className="page-content"><SustainabilityPlanner/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 17</span></footer></div>}
      {active === 'Home safety plan' && <div className="page-content"><HomeSafetyPlan/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 18</span></footer></div>}
      {active === 'Cleaning scheduler' && <div className="page-content"><CleaningScheduler/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 19</span></footer></div>}
      {active === 'Moving planner' && <div className="page-content"><MovePlanner/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 20</span></footer></div>}
      {active === 'Home project tracker' && <div className="page-content"><HomeProjectTracker/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 21</span></footer></div>}
      {active === 'Vendor & quote tracker' && <div className="page-content"><VendorQuoteTracker/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 22</span></footer></div>}
      {active === 'Home care log' && <div className="page-content"><HomeCareLog/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 23</span></footer></div>}
      {active === 'Insurance & renewals' && <div className="page-content"><InsuranceTracker/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 24</span></footer></div>}
      {active === 'Home budget planner' && <div className="page-content"><HomeBudgetPlanner/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 25</span></footer></div>}
      {active === 'Handover & snag list' && <div className="page-content"><HandoverChecklist/><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 26</span></footer></div>}
      {active === 'Settings' && <div className="page-content"><SettingsPage theme={theme} toggleTheme={toggleTheme} textSize={textSize} setTextSize={setTextSize}/></div>}
      {active === 'Explore ideas' && <div className="page-content"><section className="welcome-row"><div><p className="eyebrow">COLLECT THE FEELING</p><h1>Ideas worth coming home to<span className="wave">✳</span></h1><p className="heading-subtitle">A few starting points for the space you want to create.</p></div></section><div className="inspiration-grid"><button className="inspiration-card" onClick={() => setToast('Warm minimal style added to your inspiration list.') }><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85" alt="Warm minimal living room"/><span>01 / LESS, BUT BETTER</span><h3>Warm minimal</h3><p>Soft textures, honest materials, room to breathe.</p></button><button className="inspiration-card" onClick={() => setToast('Natural modern style added to your inspiration list.')}><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85" alt="Natural modern architecture"/><span>02 / ROOTED IN NATURE</span><h3>Natural modern</h3><p>Wood, stone, greenery and light in harmony.</p></button><button className="inspiration-card" onClick={() => setToast('Modern Indian style added to your inspiration list.')}><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85" alt="Modern contemporary home"/><span>03 / OLD SOUL, NEW LINES</span><h3>Modern Indian</h3><p>Contemporary comfort with a sense of place.</p></button></div><footer className="page-footer"><span><Logo/> Thoughtfully made for the home you're dreaming of.</span><span>GHARVISION <span className="footer-dot">·</span> PHASE 01</span></footer></div>}
      {modalOpen && <CreateProjectModal onClose={() => setModalOpen(false)} onCreate={createProject}/>}
      {selectedProject && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setSelectedProject(null)}><section className="project-modal project-detail-modal" role="dialog" aria-modal="true" aria-labelledby="project-detail-title"><div className="modal-top"><div className="modal-icon"><House size={20}/></div><button className="icon-button" onClick={() => setSelectedProject(null)} aria-label="Close project details"><X size={19}/></button></div><p className="eyebrow">PROJECT OVERVIEW</p><h2 id="project-detail-title">{selectedProject.name}</h2><p className="modal-intro">Your project details and current planning status.</p><div className="project-detail-image"><img src={selectedProject.image} alt={'Reference for '+selectedProject.name}/></div><div className="project-detail-grid"><div><span>Project type</span><strong>{selectedProject.type}</strong></div><div><span>Location</span><strong>{selectedProject.location || 'Not set'}</strong></div><div><span>Progress</span><strong>{Number(selectedProject.progress) || 0}%</strong></div><div><span>Plot / home area</span><strong>{selectedProject.size ? Number(selectedProject.size).toLocaleString('en-IN')+' sq. ft.' : 'Not set'}</strong></div><div><span>Design mood</span><strong>{selectedProject.style || 'Not set'}</strong></div><div><span>Last updated</span><strong>{selectedProject.updated || 'Not recorded'}</strong></div></div><div className="project-detail-actions"><button className="filter-button" onClick={() => { setSelectedProject(null); setActive('Floor planner') }}><PanelsTopLeft size={15}/> Open Floor Planner</button><button className="primary-button" onClick={() => setSelectedProject(null)}>Done</button></div></section></div>}{toast && <div className="toast"><span className="toast-check"><Check size={14}/></span>{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={14}/></button></div>}
    </main>
  </div>
}
