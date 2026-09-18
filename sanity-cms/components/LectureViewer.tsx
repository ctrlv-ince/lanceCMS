import React, {useState, useEffect, CSSProperties} from 'react'

/* â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface Lecture {
  id: string
  code: string
  title: string
  subtitle: string
  description: string
  thumb: string
  accent: string
  accentDark: string
  glow: string
  tag: string
  topics: string[]
  pptUrl: string | null
}

/* â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const LECTURES: Lecture[] = [
  {
    id: 'sap3',
    code: 'SAP-3',
    title: 'Simple As Possible 3',
    subtitle: 'Advanced Computer Architecture',
    description:
      'Covers the SAP-3 architecture with 8-bit data bus, 16-bit address bus, extended ALU operations, full instruction set, and interrupt handling.',
    thumb: '/static/thumb_sap3.jpg',
    accent: '#00E5CC',
    accentDark: '#00B3A4',
    glow: 'rgba(0,229,204,0.25)',
    tag: 'Computer Architecture',
    topics: ['Data Bus', 'ALU Operations', 'Address Bus', 'Instruction Set', 'Interrupts'],
    pptUrl: 'https://docs.google.com/presentation/d/1O75SnWQMlWiyCT-ChK3jqL_7gj6q7w5s/embed?start=false&loop=false&delayms=3000',
  },
  {
    id: 'raspi1',
    code: 'RASPI-1',
    title: 'Raspberry Pi 1',
    subtitle: 'Introduction to Embedded Systems',
    description:
      'Introduction to the Raspberry Pi platform â€” BCM2835 SoC architecture, GPIO pin configuration, Linux OS setup, and first hardware projects.',
    thumb: '/static/thumb_raspi1.jpg',
    accent: '#FF4C6E',
    accentDark: '#CC2244',
    glow: 'rgba(255,76,110,0.25)',
    tag: 'Embedded Systems',
    topics: ['BCM2835 SoC', 'GPIO Pins', 'Linux Setup', 'Hardware I/O', 'Python GPIO'],
    pptUrl: 'https://docs.google.com/presentation/d/1xtiY5icVwHxYthETbRWCYnKxpXhndGNn/embed?start=false&loop=false&delayms=3000',
  },
]

/* â”€â”€â”€ Keyframe injection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  @keyframes lv-fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes lv-slideUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lv-slideLeft{ from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes lv-pulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
  @keyframes lv-shimmer  {
    0%   { background-position: -600px 0 }
    100% { background-position:  600px 0 }
  }
  @keyframes lv-glow {
    0%,100% { box-shadow: 0 0 20px var(--g); }
    50%      { box-shadow: 0 0 48px var(--g); }
  }
  @keyframes lv-scan {
    0%   { transform: translateY(-100%) }
    100% { transform: translateY(200%) }
  }

  .lv-card {
    transition: transform 0.28s cubic-bezier(.4,0,.2,1), box-shadow 0.28s cubic-bezier(.4,0,.2,1), border-color 0.28s;
    animation: lv-slideUp 0.5s ease both;
  }
  .lv-card:hover {
    transform: translateY(-10px) scale(1.015) !important;
  }
  .lv-card:hover .lv-thumb-img {
    transform: scale(1.07);
  }
  .lv-card:hover .lv-overlay {
    opacity: 1 !important;
  }
  .lv-card:hover .lv-play-btn {
    transform: scale(1) !important;
    opacity: 1 !important;
  }
  .lv-thumb-img {
    transition: transform 0.55s cubic-bezier(.4,0,.2,1);
  }
  .lv-play-btn {
    transition: transform 0.28s cubic-bezier(.4,0,.2,1), opacity 0.28s;
  }
  .lv-open-btn {
    transition: filter 0.2s, transform 0.2s;
  }
  .lv-open-btn:hover {
    filter: brightness(1.15);
    transform: translateY(-1px);
  }
  .lv-close-btn:hover {
    background: rgba(255,255,255,0.25) !important;
  }
  .lv-topic-chip {
    transition: background 0.18s, color 0.18s;
  }
  .lv-topic-chip:hover {
    filter: brightness(1.12);
  }  .lv-gallery-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }
  .lv-gallery-card:hover .lv-gallery-img {
    transform: scale(1.06);
  }
`

function StyleInjector() {
  useEffect(() => {
    const id = 'lv-styles'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id
      el.textContent = CSS
      document.head.appendChild(el)
    }
    return () => {
      document.getElementById('lv-styles')?.remove()
    }
  }, [])
  return null
}

/* â”€â”€â”€ Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function Modal({lecture, onClose}: {lecture: Lecture; onClose: () => void}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(5,7,12,0.88)',
        backdropFilter: 'blur(12px)',
        animation: 'lv-fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 860,
          borderRadius: 28,
          overflow: 'hidden',
          background: '#0f1117',
          border: `1px solid ${lecture.accent}44`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px ${lecture.accent}22, 0 0 80px ${lecture.glow}`,
          animation: 'lv-slideUp 0.28s ease',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: `linear-gradient(135deg, ${lecture.accent}22, ${lecture.accentDark}11)`,
            borderBottom: `1px solid ${lecture.accent}33`,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${lecture.accent}, ${lecture.accentDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
              boxShadow: `0 0 20px ${lecture.glow}`,
            }}
          >
            📊
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: lecture.accent, marginBottom: 4}}>
              {lecture.code} · Microcontroller LEC
            </div>
            <div style={{fontSize: 20, fontWeight: 800, color: '#f0f2ff', letterSpacing: -0.3}}>
              {lecture.title}
            </div>
          </div>
          <button
            className="lv-close-btn"
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{padding: 28}}>
          {lecture.pptUrl ? (
            <iframe
              src={lecture.pptUrl}
              style={{
                width: '100%',
                height: 480,
                border: 'none',
                borderRadius: 16,
                background: '#000',
              }}
              title={lecture.title}
              allowFullScreen
            />
          ) : (
            /* Empty state */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: '48px 24px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.03)',
                border: '2px dashed rgba(255,255,255,0.08)',
                textAlign: 'center',
              }}
            >
              {/* Animated icon */}
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 24,
                  background: `linear-gradient(135deg, ${lecture.accent}22, ${lecture.accentDark}11)`,
                  border: `2px solid ${lecture.accent}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  boxShadow: `0 0 32px ${lecture.glow}`,
                  animation: 'lv-glow 2.5s ease-in-out infinite',
                  ['--g' as string]: lecture.glow,
                }}
              >
                📂
              </div>
              <div>
                <div style={{fontSize: 22, fontWeight: 800, color: '#f0f2ff', marginBottom: 8}}>
                  No presentation uploaded yet
                </div>
                <div style={{fontSize: 16, color: '#9da7c5', lineHeight: 1.7, maxWidth: 380}}>
                  Upload the <strong style={{color: lecture.accent}}>{lecture.code}.pptx</strong> file
                  via Sanity CMS — it will appear here automatically once added.
                </div>
              </div>

              {/* Upload hint */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 20px',
                  borderRadius: 12,
                  background: `${lecture.accent}18`,
                  border: `1px solid ${lecture.accent}33`,
                  fontSize: 15,
                  fontWeight: 600,
                  color: lecture.accent,
                  letterSpacing: 0.3,
                }}
              >
                <span>🗄️</span>
                Go to Structure → Lectures → Upload {lecture.code}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Card ───────────────────────────────────────────────────────────────── */
function LectureCard({lecture, index, onOpen}: {lecture: Lecture; index: number; onOpen: () => void}) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      className="lv-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(160deg, #14172200, #0f111766)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? lecture.accent + '66' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 24,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: hovered
          ? `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px ${lecture.accent}44, 0 0 60px ${lecture.glow}`
          : '0 4px 24px rgba(0,0,0,0.35)',
        animationDelay: `${index * 0.12}s`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16/9',
          overflow: 'hidden',
          flexShrink: 0,
        }}
        onClick={onOpen}
      >
        <img
          src={lecture.thumb}
          alt={lecture.code}
          className="lv-thumb-img"
          style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
        />

        {/* Scan line effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            opacity: hovered ? 0.4 : 0,
            transition: 'opacity 0.4s',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '30%',
              background: `linear-gradient(180deg, transparent, ${lecture.accent}30, transparent)`,
              animation: hovered ? 'lv-scan 1.8s linear infinite' : 'none',
            }}
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="lv-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.7) 100%)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.28s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            className="lv-play-btn"
            style={{
              padding: '12px 24px',
              borderRadius: 14,
              border: 'none',
              background: `linear-gradient(135deg, ${lecture.accent}, ${lecture.accentDark})`,
              color: '#fff',
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: `0 8px 32px ${lecture.glow}`,
              transform: hovered ? 'scale(1)' : 'scale(0.7)',
              opacity: hovered ? 1 : 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              letterSpacing: 0.3,
            }}
          >
            ▶ View Slides
          </button>
        </div>

        {/* Tag badge */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            padding: '6px 14px',
            borderRadius: 99,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            background: 'rgba(0,0,0,0.65)',
            color: lecture.accent,
            border: `1px solid ${lecture.accent}55`,
            backdropFilter: 'blur(8px)',
          }}
        >
          {lecture.tag}
        </div>

        {/* Status dot */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: '6px 12px',
            borderRadius: 99,
            fontSize: 13,
            fontWeight: 700,
            background: lecture.pptUrl ? 'rgba(34,211,165,0.2)' : 'rgba(245,158,11,0.2)',
            color: lecture.pptUrl ? '#22d3a5' : '#f59e0b',
            border: `1px solid ${lecture.pptUrl ? '#22d3a544' : '#f59e0b44'}`,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <span style={{fontSize: 11, animation: lecture.pptUrl ? 'none' : 'lv-pulse 2s infinite'}}>● </span>
          {lecture.pptUrl ? 'Available' : 'Coming Soon'}
        </div>
      </div>

      {/* Body */}
      <div style={{padding: '22px 24px', display: 'flex', flexDirection: 'column', flex: 1}}>
        {/* Code + title */}
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
          <span
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              background: `${lecture.accent}22`,
              color: lecture.accent,
              border: `1px solid ${lecture.accent}44`,
            }}
          >
            {lecture.code}
          </span>
        </div>

        <div style={{fontSize: 22, fontWeight: 800, color: '#f0f2ff', letterSpacing: -0.4, lineHeight: 1.3, marginBottom: 6}}>
          {lecture.title}
        </div>
        <div style={{fontSize: 15, fontWeight: 600, color: lecture.accent, marginBottom: 10, letterSpacing: 0.3}}>
          {lecture.subtitle}
        </div>
        <p style={{fontSize: 16, color: '#9da7c5', lineHeight: 1.7, flex: 1, marginBottom: 18}}>
          {lecture.description}
        </p>

        {/* Topic chips */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20}}>
          {lecture.topics.map((t) => (
            <span
              key={t}
              className="lv-topic-chip"
              style={{
                padding: '5px 12px',
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 700,
                background: 'rgba(255,255,255,0.05)',
                color: '#9da7c5',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          className="lv-open-btn"
          onClick={onOpen}
          style={{
            width: '100%',
            padding: '13px 20px',
            borderRadius: 14,
            border: 'none',
            background: `linear-gradient(135deg, ${lecture.accent}, ${lecture.accentDark})`,
            color: '#fff',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: `0 4px 24px ${lecture.glow}`,
            letterSpacing: 0.3,
          }}
        >
          Open Lecture <span style={{fontSize: 16}}>â†’</span>
        </button>
      </div>
    </article>
  )
}

/* â”€â”€â”€ Main Tool â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function LectureViewerTool() {
  const [active, setActive] = useState<Lecture | null>(null)

  const root: CSSProperties = {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #080a10 0%, #0d1018 50%, #0a0d14 100%)',
    color: '#f0f2ff',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div style={root}>
      <StyleInjector />

      {/* Ambient glow orbs */}
      <div style={{position:'absolute',top:-200,left:-150,width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,229,204,0.06) 0%,transparent 70%)',pointerEvents:'none'}} />
      <div style={{position:'absolute',bottom:-100,right:-100,width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,76,110,0.06) 0%,transparent 70%)',pointerEvents:'none'}} />
      <div style={{position:'absolute',top:'40%',left:'50%',transform:'translate(-50%,-50%)',width:800,height:400,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(108,99,255,0.04) 0%,transparent 70%)',pointerEvents:'none'}} />

      {/* Grid noise texture */}
      <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none'}} />

      <div style={{position:'relative',zIndex:1,maxWidth:960,margin:'0 auto',padding:'52px 32px'}}>

        {/* Header */}
        <div style={{marginBottom:48,animation:'lv-slideUp 0.5s ease'}}>
          {/* Eyebrow */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
            <div style={{height:1,width:32,background:'rgba(255,255,255,0.15)'}} />
            <span style={{fontSize:14,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.45)'}}>
              Sanity CMS · Microcontroller LEC
            </span>
            <div style={{height:1,flex:1,background:'rgba(255,255,255,0.06)'}} />
          </div>

          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:24,flexWrap:'wrap'}}>
            <div>
              <h1 style={{fontSize:38,fontWeight:900,letterSpacing:-1,lineHeight:1.1,margin:0,background:'linear-gradient(135deg,#f0f2ff 0%,#a0a8cc 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                Lecture Presentations
              </h1>
              <p style={{fontSize:18,color:'#9da7c5',marginTop:10,lineHeight:1.7,maxWidth:520}}>
                Microcontroller LEC reports assigned to the{' '}
                <span style={{color:'#F05A31',fontWeight:700}}>Sanity CMS</span> project.
                Click a card to view the full presentation.
              </p>
            </div>

            {/* Stats pill */}
            <div style={{display:'flex',gap:12,flexShrink:0}}>
              {[
                {label:'Total', value:'2', color:'#6c63ff'},
                {label:'Available', value:'0', color:'#22d3a5'},
                {label:'Pending', value:'2', color:'#f59e0b'},
              ].map((s) => (
                <div key={s.label} style={{textAlign:'center',padding:'12px 18px',borderRadius:14,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{fontSize:22,fontWeight:900,color:s.color,lineHeight:1}}>{s.value}</div>
                  <div style={{fontSize:13,fontWeight:600,color:'#7a84aa',letterSpacing:0.8,marginTop:4,textTransform:'uppercase'}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Divider */}
        <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',marginBottom:32}} />
        {/* ── TOPIC DIAGRAMS MOSAIC ── */}
        <div style={{marginBottom:36,animation:'lv-slideUp 0.5s 0.1s ease both'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{height:1,width:18,background:'rgba(255,255,255,0.1)'}}/>
            <span style={{fontSize:13,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)'}}>📷 Reference Diagrams</span>
            <div style={{height:1,flex:1,background:'rgba(255,255,255,0.05)'}}/>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'rgba(0,229,204,0.7)',marginBottom:6}}>SAP-3 — Computer Architecture</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginBottom:5}}>
              {[{src:'/static/img_sap3_alu.jpg',alt:'ALU'},{src:'/static/img_sap3_bus.jpg',alt:'Bus'},{src:'/static/img_sap3_cu.jpg',alt:'Control Unit'}].map(d => (
                <div key={d.src} style={{height:84,border:'1px solid rgba(0,229,204,0.15)',borderRadius:10,overflow:'hidden'}}><img src={d.src} alt={d.alt} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:5,marginBottom:5}}>
              {[{src:'/static/img_sap3_reg.jpg',alt:'Registers'},{src:'/static/img_sap3_int.jpg',alt:'Interrupt'}].map(d => (
                <div key={d.src} style={{height:76,border:'1px solid rgba(0,229,204,0.15)',borderRadius:10,overflow:'hidden'}}><img src={d.src} alt={d.alt} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div>
              ))}
            </div>
            <div style={{height:68,border:'1px solid rgba(0,229,204,0.15)',borderRadius:10,overflow:'hidden'}}>
              <img src="/static/img_sap3_isa.jpg" alt="Instruction Set" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            </div>
          </div>
          <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)',margin:'10px 0'}}/>
          <div>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'rgba(255,76,110,0.7)',marginBottom:6}}>RASPI-1 — Embedded Systems</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginBottom:5}}>
              {[{src:'/static/thumb_raspi1.jpg',alt:'Raspberry Pi'},{src:'/static/img_raspi_gpio.jpg',alt:'GPIO'},{src:'/static/img_raspi_bb.jpg',alt:'Breadboard'}].map(d => (
                <div key={d.src} style={{height:84,border:'1px solid rgba(255,76,110,0.15)',borderRadius:10,overflow:'hidden'}}><img src={d.src} alt={d.alt} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/></div>
              ))}
            </div>
            <div style={{height:76,border:'1px solid rgba(255,76,110,0.15)',borderRadius:10,overflow:'hidden'}}>
              <img src="/static/img_raspi_term.jpg" alt="Linux Terminal" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            </div>
          </div>
        </div>

        <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)',marginBottom:32}}/>



        {/* Card Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24}}>
          {LECTURES.map((lec, i) => (
            <LectureCard key={lec.id} lecture={lec} index={i} onOpen={() => setActive(lec)} />
          ))}
        </div>

        {/* Footer note */}
        <div style={{marginTop:40,textAlign:'center',animation:'lv-slideUp 0.6s 0.4s ease both'}}>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.4)',letterSpacing:0.5}}>
            💡 Upload PPTX files via <strong style={{color:'rgba(255,255,255,0.6)'}}>Structure → Lectures</strong> in Sanity to activate the viewer
          </p>
        </div>
      </div>

      {/* Modal */}
      {active && <Modal lecture={active} onClose={() => setActive(null)} />}
    </div>
  )
}