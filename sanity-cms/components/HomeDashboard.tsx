import React, {useState, useEffect} from 'react'

/* ══════════════════════════════════════════════
   CSS INJECTION
══════════════════════════════════════════════ */
const INJECTED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  @keyframes hd-fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes hd-slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes hd-pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes hd-scan    { 0%{transform:translateY(-100%)} 100%{transform:translateY(220%)} }
  @keyframes hd-glow    { 0%,100%{box-shadow:0 0 20px var(--g,rgba(108,99,255,.3))} 50%{box-shadow:0 0 44px var(--g,rgba(108,99,255,.3))} }

  .hd-lec-card { transition: transform .28s cubic-bezier(.4,0,.2,1), box-shadow .28s cubic-bezier(.4,0,.2,1), border-color .28s; }
  .hd-lec-card:hover { transform: translateY(-8px) scale(1.012) !important; }
  .hd-lec-card:hover .hd-thumb { transform: scale(1.06); }
  .hd-lec-card:hover .hd-overlay { opacity:1 !important; }
  .hd-lec-card:hover .hd-play   { transform:scale(1) !important; opacity:1 !important; }
  .hd-thumb  { transition: transform .5s cubic-bezier(.4,0,.2,1); }
  .hd-play   { transition: transform .28s cubic-bezier(.4,0,.2,1), opacity .28s; }
  .hd-btn    { transition: filter .2s, transform .2s; }
  .hd-btn:hover { filter:brightness(1.14); transform:translateY(-1px); }
  .hd-close:hover { background: rgba(255,255,255,.25) !important; }
`

function StyleInject() {
  useEffect(() => {
    const id = 'hd-global-css'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = INJECTED_CSS
      document.head.appendChild(el)
    }
    return () => { document.getElementById('hd-global-css')?.remove() }
  }, [])
  return null
}

/* ══════════════════════════════════════════════
   LECTURE DATA
══════════════════════════════════════════════ */
interface Lecture {
  id: string; code: string; title: string; subtitle: string
  description: string; thumb: string; accent: string
  accentDark: string; glow: string; tag: string
  topics: string[]; pptUrl: string | null
}

const LECTURES: Lecture[] = [
  {
    id: 'sap3', code: 'SAP-3', title: 'Simple As Possible 3',
    subtitle: 'Advanced Computer Architecture',
    description: 'Covers the SAP-3 architecture with 8-bit data bus, 16-bit address bus, extended ALU operations, full instruction set, and interrupt handling.',
    thumb: '/static/thumb_sap3.jpg',
    accent: '#00E5CC', accentDark: '#00B3A4', glow: 'rgba(0,229,204,0.25)',
    tag: 'Computer Architecture',
    topics: ['Data Bus', 'ALU Ops', 'Address Bus', 'Instruction Set', 'Interrupts'],
    pptUrl: 'https://docs.google.com/presentation/d/1O75SnWQMlWiyCT-ChK3jqL_7gj6q7w5s/embed?start=false&loop=false&delayms=3000',
  },
  {
    id: 'raspi1', code: 'RASPI-1', title: 'Raspberry Pi 1',
    subtitle: 'Introduction to Embedded Systems',
    description: 'Introduction to the Raspberry Pi platform — BCM2835 SoC architecture, GPIO pin configuration, Linux OS setup, and first hardware projects.',
    thumb: '/static/thumb_raspi1.jpg',
    accent: '#FF4C6E', accentDark: '#CC2244', glow: 'rgba(255,76,110,0.25)',
    tag: 'Embedded Systems',
    topics: ['BCM2835 SoC', 'GPIO Pins', 'Linux Setup', 'Hardware I/O', 'Python GPIO'],
    pptUrl: 'https://docs.google.com/presentation/d/1xtiY5icVwHxYthETbRWCYnKxpXhndGNn/embed?start=false&loop=false&delayms=3000',
  },
]

/* ══════════════════════════════════════════════
   LECTURE MODAL
══════════════════════════════════════════════ */
function LecModal({lec, onClose}: {lec: Lecture; onClose: () => void}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px 24px',background:'rgba(5,7,12,0.92)',backdropFilter:'blur(16px)',animation:'hd-fadeIn .2s ease'}}>
      <div onClick={e => e.stopPropagation()} style={{width:'100%',maxWidth:1100,height:'92vh',display:'flex',flexDirection:'column',borderRadius:24,overflow:'hidden',background:'#0c0e16',border:`1px solid ${lec.accent}55`,boxShadow:`0 40px 120px rgba(0,0,0,0.9),0 0 100px ${lec.glow},inset 0 1px 0 rgba(255,255,255,0.06)`,animation:'hd-slideUp .28s ease'}}>
        {/* Modal header */}
        <div style={{padding:'18px 24px',display:'flex',alignItems:'center',gap:12,background:`linear-gradient(135deg,${lec.accent}20,${lec.accentDark}10)`,borderBottom:`1px solid ${lec.accent}33`}}>
          <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${lec.accent},${lec.accentDark})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,boxShadow:`0 0 18px ${lec.glow}`,flexShrink:0}}>📊</div>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:lec.accent,marginBottom:2}}>{lec.code} · Microcontroller LEC</div>
            <div style={{fontSize:15,fontWeight:800,color:'#f0f2ff'}}>{lec.title}</div>
          </div>
          <button className="hd-close" onClick={onClose} style={{width:32,height:32,borderRadius:'50%',border:'none',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .2s'}}>✕</button>
        </div>
        {/* Modal body */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',padding:'0 0 0 0'}}>
          {lec.pptUrl
            ? <iframe src={lec.pptUrl} style={{flex:1,width:'100%',height:'100%',border:'none',display:'block',background:'#000'}} title={lec.title} allowFullScreen />
            : (
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,padding:'44px 24px',borderRadius:18,background:'rgba(255,255,255,.03)',border:'2px dashed rgba(255,255,255,.08)',textAlign:'center'}}>
                <div style={{width:80,height:80,borderRadius:20,background:`${lec.accent}22`,border:`2px solid ${lec.accent}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,boxShadow:`0 0 28px ${lec.glow}`,animation:'hd-glow 2.5s ease-in-out infinite',['--g' as string]:lec.glow}}>📂</div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:'#f0f2ff',marginBottom:6}}>No presentation uploaded yet</div>
                  <div style={{fontSize:12,color:'#8b92b0',lineHeight:1.6,maxWidth:320}}>Upload <strong style={{color:lec.accent}}>{lec.code}.pptx</strong> via Sanity CMS — it will appear here automatically.</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:10,background:`${lec.accent}18`,border:`1px solid ${lec.accent}33`,fontSize:11,fontWeight:700,color:lec.accent,letterSpacing:.3}}>
                  🗄️ Go to Structure → Lectures → Upload {lec.code}
                </div>
              </div>
            )
          }
        </div>
        {/* Bottom accent bar */}
        <div style={{height:3,background:`linear-gradient(90deg,transparent,${lec.accent},${lec.accentDark},transparent)`,flexShrink:0}} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   LECTURE CARD
══════════════════════════════════════════════ */
function LecCard({lec, onOpen}: {lec: Lecture; onOpen: () => void}) {
  const [hovered, setHov] = useState(false)
  return (
    <article className="hd-lec-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{background:'rgba(20,23,34,0.7)',backdropFilter:'blur(16px)',border:`1px solid ${hovered ? lec.accent+'66' : 'rgba(255,255,255,0.07)'}`,borderRadius:20,overflow:'hidden',cursor:'pointer',boxShadow:hovered ? `0 20px 56px rgba(0,0,0,0.5),0 0 48px ${lec.glow}` : '0 4px 20px rgba(0,0,0,0.3)',display:'flex',flexDirection:'column'}}>
      {/* Thumb */}
      <div style={{position:'relative',aspectRatio:'16/9',overflow:'hidden',flexShrink:0}} onClick={onOpen}>
        <img src={lec.thumb} alt={lec.code} className="hd-thumb" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
        {/* Scan line */}
        {hovered && <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',opacity:.35}}>
          <div style={{position:'absolute',left:0,right:0,height:'28%',background:`linear-gradient(180deg,transparent,${lec.accent}35,transparent)`,animation:'hd-scan 1.8s linear infinite'}} />
        </div>}
        {/* Overlay */}
        <div className="hd-overlay" style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 20%,rgba(0,0,0,.68))',opacity:hovered?1:0,transition:'opacity .28s',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <button className="hd-play" onClick={onOpen} style={{padding:'10px 22px',borderRadius:12,border:'none',background:`linear-gradient(135deg,${lec.accent},${lec.accentDark})`,color:'#fff',fontSize:13,fontWeight:800,cursor:'pointer',boxShadow:`0 8px 28px ${lec.glow}`,transform:hovered?'scale(1)':'scale(0.72)',opacity:hovered?1:0,display:'flex',alignItems:'center',gap:7}}>▶ View Slides</button>
        </div>
        {/* Badges */}
        <div style={{position:'absolute',top:10,left:10,padding:'4px 10px',borderRadius:99,fontSize:9,fontWeight:800,letterSpacing:1.2,textTransform:'uppercase',background:'rgba(0,0,0,.65)',color:lec.accent,border:`1px solid ${lec.accent}55`,backdropFilter:'blur(8px)'}}>{lec.tag}</div>
        <div style={{position:'absolute',top:10,right:10,padding:'4px 10px',borderRadius:99,fontSize:9,fontWeight:700,background:lec.pptUrl?'rgba(34,211,165,.18)':'rgba(245,158,11,.18)',color:lec.pptUrl?'#22d3a5':'#f59e0b',border:`1px solid ${lec.pptUrl?'#22d3a544':'#f59e0b44'}`,backdropFilter:'blur(8px)',display:'flex',alignItems:'center',gap:4}}>
          <span style={{fontSize:6,animation:lec.pptUrl?'none':'hd-pulse 2s infinite'}}>●</span>{lec.pptUrl?'Available':'Coming Soon'}
        </div>
      </div>
      {/* Body */}
      <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',flex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <span style={{padding:'3px 9px',borderRadius:7,fontSize:10,fontWeight:900,letterSpacing:1.5,textTransform:'uppercase',background:`${lec.accent}22`,color:lec.accent,border:`1px solid ${lec.accent}44`}}>{lec.code}</span>
        </div>
        <div style={{fontSize:16,fontWeight:800,color:'#f0f2ff',letterSpacing:-.3,lineHeight:1.3,marginBottom:4}}>{lec.title}</div>
        <div style={{fontSize:11,fontWeight:600,color:lec.accent,marginBottom:8,letterSpacing:.3}}>{lec.subtitle}</div>
        <p style={{fontSize:12,color:'#8b92b0',lineHeight:1.6,flex:1,marginBottom:14}}>{lec.description}</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:16}}>
          {lec.topics.map(t => <span key={t} style={{padding:'3px 9px',borderRadius:99,fontSize:10,fontWeight:700,background:'rgba(255,255,255,.05)',color:'#8b92b0',border:'1px solid rgba(255,255,255,.07)'}}>{t}</span>)}
        </div>
        <button className="hd-btn" onClick={onOpen} style={{width:'100%',padding:'11px',borderRadius:12,border:'none',background:`linear-gradient(135deg,${lec.accent},${lec.accentDark})`,color:'#fff',fontSize:13,fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7,boxShadow:`0 4px 20px ${lec.glow}`,letterSpacing:.3}}>
          Open Lecture <span>→</span>
        </button>
      </div>
    </article>
  )
}

/* ══════════════════════════════════════════════
   HOME DASHBOARD (merged)
══════════════════════════════════════════════ */


export function HomeDashboard() {
  const [activeLec, setActiveLec] = useState<Lecture | null>(null)
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",minHeight:'100vh',background:'linear-gradient(135deg,#080a10 0%,#0d1018 50%,#0a0d14 100%)',color:'#f0f2ff',position:'relative',overflow:'hidden'}}>
      <StyleInject />

      {/* Ambient orbs */}
      <div style={{position:'absolute',top:-180,left:-120,width:560,height:560,borderRadius:'50%',background:'radial-gradient(circle,rgba(108,99,255,0.09) 0%,transparent 70%)',pointerEvents:'none'}} />
      <div style={{position:'absolute',bottom:-100,right:-80,width:480,height:480,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,229,204,0.07) 0%,transparent 70%)',pointerEvents:'none'}} />
      <div style={{position:'absolute',top:'35%',right:'10%',width:360,height:360,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,76,110,0.05) 0%,transparent 70%)',pointerEvents:'none'}} />

      {/* Dot grid */}
      <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,0.022) 1px,transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none'}} />

      <div style={{position:'relative',zIndex:1,maxWidth:960,margin:'0 auto',padding:'48px 32px'}}>

        {/* ── TOP HEADER ── */}
        <div style={{marginBottom:36,animation:'hd-slideUp .45s ease'}}>
          {/* Decorative top accent */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <div style={{height:1,width:28,background:'rgba(255,255,255,0.12)'}} />
            <span style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>Microcontroller · Sanity CMS</span>
            <div style={{height:1,flex:1,background:'rgba(255,255,255,0.05)'}} />
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              {/* Logo with glow ring */}
              <div style={{position:'relative'}}>
                <div style={{position:'absolute',inset:-4,borderRadius:18,background:'linear-gradient(135deg,#6c63ff,#a78bfa)',opacity:.25,filter:'blur(8px)'}} />
                <div style={{position:'relative',width:54,height:54,borderRadius:16,background:'linear-gradient(135deg,#6c63ff,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,boxShadow:'0 0 28px rgba(108,99,255,0.5)',flexShrink:0}}>🗄️</div>
              </div>
              <div>
                <div style={{fontSize:22,fontWeight:900,letterSpacing:-.5,background:'linear-gradient(135deg,#f0f2ff,#a0a8cc)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>sanity<span style={{background:'linear-gradient(135deg,#a78bfa,#6c63ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>CMS</span></div>
                <div style={{fontSize:11,color:'#8b92b0',fontWeight:500,marginTop:2,letterSpacing:.3}}>Studio Dashboard</div>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:15,fontWeight:700,color:'#f0f2ff'}}>{greeting}, Lance 👋</div>
              <div style={{fontSize:11,color:'#8b92b0',marginTop:3}}>{now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
            </div>
          </div>
        </div>
        {/* ── DIVIDER ── */}
        <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)',marginBottom:32}} />

        {/* ── LECTURES SECTION ── */}
        <div style={{animation:'hd-slideUp .5s .15s ease both'}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:'uppercase',color:'#4a5070',marginBottom:6}}>📚 LEC Reports</div>
              <div style={{fontSize:20,fontWeight:900,letterSpacing:-.5,color:'#f0f2ff'}}>Lecture Presentations</div>
              <div style={{fontSize:13,color:'#8b92b0',marginTop:4}}>
                Assigned to <span style={{color:'#F05A31',fontWeight:700}}>Sanity CMS</span> · Click a card to view the slides
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              {[{label:'Total',v:'2',c:'#6c63ff'},{label:'Ready',v:'0',c:'#22d3a5'},{label:'Pending',v:'2',c:'#f59e0b'}].map(s =>
                <div key={s.label} style={{textAlign:'center',padding:'10px 14px',borderRadius:12,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{fontSize:18,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:9,fontWeight:600,color:'#4a5070',letterSpacing:.8,marginTop:3,textTransform:'uppercase'}}>{s.label}</div>
                </div>
              )}
            </div>
          </div>

          {/* Cards */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20}}>
            {LECTURES.map(lec => <LecCard key={lec.id} lec={lec} onOpen={() => setActiveLec(lec)} />)}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{marginTop:32,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.05)',textAlign:'center',fontSize:11,color:'rgba(255,255,255,.18)'}}>
          Built with ❤️ using Sanity Studio &nbsp;·&nbsp;
          <a href="https://www.sanity.io/docs" target="_blank" rel="noreferrer" style={{color:'#6c63ff',textDecoration:'none',fontWeight:600}}>Docs →</a>
        </div>
      </div>

      {/* Modal */}
      {activeLec && <LecModal lec={activeLec} onClose={() => setActiveLec(null)} />}
    </div>
  )
}
