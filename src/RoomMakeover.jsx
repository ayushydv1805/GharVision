import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, Check, Download, ImagePlus, Lightbulb, Palette, RotateCcw, Sofa, Sparkles, Trash2 } from 'lucide-react'

const ideas = {
  'Living room': {
    'Warm minimal': ['Move the sofa 15–25 cm away from the wall to create visual breathing room.', 'Use one larger rug so the front legs of the sofa and chairs sit on it.', 'Add a warm floor lamp beside the seating area and layer it with indirect light.', 'Keep everyday objects in one closed-storage zone; style the coffee table with only 2–3 pieces.'],
    Modern: ['Create one focal point behind the sofa with art or a textured accent wall.', 'Align the main seating toward the focal point and keep a clear walking route.', 'Use two or three coordinated materials instead of many competing finishes.', 'Add dimmable ambient lighting plus a task lamp near reading seats.'],
    Natural: ['Bring in one medium or large plant near natural light, away from the main walkway.', 'Mix wood, linen and woven textures for warmth without visual clutter.', 'Use sheer curtains to soften daylight while preserving privacy.', 'Group cushions in a tight palette of earthy greens, creams and terracotta.'],
  },
  Bedroom: {
    'Warm minimal': ['Place the bed so both sides are reachable where the room allows.', 'Use matching bedside lights to create a calm, balanced focal point.', 'Choose bedding in two neutrals and one restrained accent colour.', 'Move laundry and charging cables into a dedicated storage spot.'],
    Modern: ['Keep the headboard wall as the main visual feature.', 'Use wall-mounted or compact bedside tables to free up floor space.', 'Layer ceiling lighting with warm bedside lights rather than relying on one bright source.', 'Repeat one finish across handles, lamps and frames for a cohesive look.'],
    Natural: ['Use breathable cotton or linen bedding in soft, natural tones.', 'Add a small plant only if light and care conditions are suitable.', 'Choose a timber or cane accent and keep other surfaces simple.', 'Use curtains that reach close to the floor to make the room feel taller.'],
  },
  Kitchen: {
    'Warm minimal': ['Keep the most-used cooking tools close to the prep area and clear the counters.', 'Use under-cabinet task lighting for safer, clearer work surfaces.', 'Group small appliances together rather than spreading them across the counter.', 'Repeat one accent material in handles, stools or a small display.'],
    Modern: ['Create distinct prep, cooking and cleaning zones with clear working space.', 'Use under-cabinet lighting to reduce shadows on the countertop.', 'Keep frequently used items accessible and store rarely used appliances away.', 'Coordinate hardware and tap finishes for a more intentional look.'],
    Natural: ['Introduce a timber board or natural-texture accessories as a small accent.', 'Keep the prep surface mostly clear for a calmer, more usable kitchen.', 'Use warm task lighting and neutral textiles.', 'Place herbs near a suitable light source only if they can be maintained.'],
  },
  'Home office': {
    'Warm minimal': ['Place the desk near daylight but avoid strong glare on the screen.', 'Keep the chair path and desk surface clear of storage clutter.', 'Add a focused desk lamp with a warm-neutral colour temperature.', 'Use one cable tray or organiser to keep wires off the floor.'],
    Modern: ['Position the monitor at a comfortable eye level and keep the keyboard close.', 'Separate work equipment from decorative items with simple storage.', 'Add task lighting that does not reflect directly into the screen.', 'Use a consistent finish for desk accessories and shelving.'],
    Natural: ['Use a plant only where it will not crowd the work surface.', 'Combine a timber accent with neutral desk accessories.', 'Place the desk to make the best use of indirect daylight.', 'Use fabric storage baskets to soften open shelving.'],
  },
}
const styles = ['Warm minimal', 'Modern', 'Natural']
const roomTypes = Object.keys(ideas)

export default function RoomMakeover() {
  const [photo, setPhoto] = useState('')
  const [fileName, setFileName] = useState('')
  const [room, setRoom] = useState('Living room')
  const [style, setStyle] = useState('Warm minimal')
  const [budget, setBudget] = useState('Budget-friendly')
  const [checked, setChecked] = useState([])
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo) }, [photo])
  const suggestions = useMemo(() => ideas[room]?.[style] || [], [room, style])

  const chooseFile = event => {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Please choose a JPG, PNG or WEBP image.'); event.target.value = ''; return }
    if (file.size > 8 * 1024 * 1024) { setError('That image is larger than 8 MB. Choose a smaller photo.'); event.target.value = ''; return }
    const nextUrl = URL.createObjectURL(file)
    setPhoto(previous => { if (previous) URL.revokeObjectURL(previous); return nextUrl })
    setFileName(file.name)
    setChecked([])
  }
  const reset = () => { if (photo) URL.revokeObjectURL(photo); setPhoto(''); setFileName(''); setChecked([]); setError(''); if (inputRef.current) inputRef.current.value = '' }
  const exportIdeas = () => {
    const text = [
      'GHARVISION — ROOM MAKEOVER NOTES',
      'Room: ' + room,
      'Style: ' + style,
      'Budget preference: ' + budget,
      'Photo: ' + (fileName || 'No photo uploaded'),
      '',
      'IDEAS TO TRY',
      ...suggestions.map((idea, index) => (checked.includes(index) ? '[x] ' : '[ ] ') + idea),
      '',
      'These are general design suggestions, not automated photo analysis or professional architectural advice.',
    ].join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'gharvision-room-makeover.txt'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return <div className="makeover-page">
    <div className="makeover-heading">
      <div><p className="eyebrow"><Sparkles size={13}/> DESIGN STUDIO · PHASE 05</p><h1>Room makeover<span className="wave">✳</span></h1><p className="heading-subtitle">Start with your own room photo. Explore practical changes before buying anything new.</p></div>
      <button className="filter-button" onClick={reset}><RotateCcw size={15}/> Start over</button>
    </div>
    <div className="makeover-intro"><div className="makeover-intro-icon"><Lightbulb size={20}/></div><div><strong>A more thoughtful room, one small change at a time.</strong><p>Upload a photo for your own reference, choose the room and mood, then build a checklist of design ideas.</p></div></div>
    <div className="makeover-layout">
      <section className="makeover-photo-panel">
        <div className="makeover-panel-heading"><div><span className="eyebrow">YOUR SPACE</span><h2>Room photo</h2></div><span className="makeover-step">01</span></div>
        {photo ? <div className="makeover-preview"><img src={photo} alt="Your uploaded room" /><button className="makeover-remove" onClick={reset} aria-label="Remove photo"><Trash2 size={15}/> Remove photo</button></div> : <button className="makeover-upload" onClick={() => inputRef.current?.click()}><span className="makeover-upload-icon"><ImagePlus size={25}/></span><strong>Choose a room photo</strong><span>JPG, PNG or WEBP · up to 8 MB</span><span className="makeover-upload-cta"><Camera size={15}/> Browse files</span></button>}
        <input ref={inputRef} className="makeover-file-input" type="file" accept="image/*" onChange={chooseFile} aria-label="Upload room photo"/>
        {error && <p className="makeover-error" role="alert">{error}</p>}
        <div className="makeover-private-note"><Check size={15}/><span>Your photo stays in this browser session; it is not uploaded to a server by this demo.</span></div>
        <div className="makeover-settings">
          <div><label htmlFor="makeover-room">Room type</label><select id="makeover-room" value={room} onChange={e => { setRoom(e.target.value); setChecked([]) }}>{roomTypes.map(item => <option key={item}>{item}</option>)}</select></div>
          <div><label htmlFor="makeover-style">Design mood</label><select id="makeover-style" value={style} onChange={e => { setStyle(e.target.value); setChecked([]) }}>{styles.map(item => <option key={item}>{item}</option>)}</select></div>
          <div><label htmlFor="makeover-budget">Budget preference</label><select id="makeover-budget" value={budget} onChange={e => setBudget(e.target.value)}><option>Budget-friendly</option><option>Mid-range</option><option>Invest in quality</option></select></div>
        </div>
      </section>
      <section className="makeover-ideas-panel">
        <div className="makeover-panel-heading"><div><span className="eyebrow">YOUR DESIGN CHECKLIST</span><h2>Ideas to try</h2></div><span className="makeover-step">02</span></div>
        <div className="makeover-result-summary"><span className="makeover-result-icon"><Palette size={17}/></span><div><strong>{style} {room.toLowerCase()}</strong><p>{budget} · {checked.length} of {suggestions.length} completed</p></div></div>
        <div className="makeover-checklist">{suggestions.map((idea, index) => <label key={idea} className={checked.includes(index) ? 'makeover-check-item is-checked' : 'makeover-check-item'}><input type="checkbox" checked={checked.includes(index)} onChange={e => setChecked(current => e.target.checked ? [...current, index] : current.filter(n => n !== index))}/><span className="makeover-checkmark"><Check size={13}/></span><span><small>IDEA {String(index + 1).padStart(2, '0')}</small>{idea}</span></label>)}</div>
        <button className="primary-button makeover-export" onClick={exportIdeas}><Download size={16}/> Export my checklist</button>
        <p className="makeover-disclaimer"><Sofa size={14}/> Suggestions are rule-based examples, not AI image analysis. No furniture is automatically moved in your photo. Check measurements, safety and your actual room conditions before making changes.</p>
      </section>
    </div>
  </div>
}
