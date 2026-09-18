import React, {useState, useEffect} from 'react'

import {TopicOverviews} from './summaries/TopicOverviews'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  @keyframes lms-fadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes lms-slideUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lms-slideRight { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes lms-streak     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes lms-progress   { from{width:0} to{width:var(--w)} }
  @keyframes lms-particle   { 0%{transform:translateY(0) translateX(0);opacity:0} 10%{opacity:0.7} 90%{opacity:0.7} 100%{transform:translateY(-100px) translateX(var(--dx,30px));opacity:0} }
  .lms-nav { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;font-size:16px;font-weight:500;cursor:pointer;color:rgba(255,255,255,0.4);transition:all 0.2s cubic-bezier(.4,0,.2,1);border:1px solid transparent;user-select:none; }
  .lms-nav:hover { color:rgba(255,255,255,0.8);background:rgba(255,255,255,0.05); }
  .lms-nav.active { color:#4F7CFF;background:rgba(79,124,255,0.1);border-color:rgba(79,124,255,0.2); }
  .lms-nav.active .lms-ni { filter:drop-shadow(0 0 5px rgba(79,124,255,0.9)); }
  .lms-stat { background:rgba(255,255,255,0.03);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px;position:relative;overflow:hidden;transition:transform 0.28s cubic-bezier(.4,0,.2,1),border-color 0.28s,box-shadow 0.28s; }
  .lms-stat:hover { transform:translateY(-5px);border-color:rgba(255,255,255,0.14);box-shadow:0 24px 60px rgba(0,0,0,0.5); }
  .lms-stat::after { content:'';position:absolute;inset:0;border-radius:16px;background:linear-gradient(135deg,rgba(255,255,255,0.025) 0%,transparent 60%);pointer-events:none; }
  .lms-card { background:rgba(255,255,255,0.03);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;transition:transform 0.3s cubic-bezier(.4,0,.2,1),box-shadow 0.3s,border-color 0.3s; }
  .lms-card:hover { transform:translateY(-10px) scale(1.01);box-shadow:0 36px 80px rgba(0,0,0,0.55); }
  .lms-card:hover .lms-thumb { transform:scale(1.07); }
  .lms-thumb { transition:transform 0.55s cubic-bezier(.4,0,.2,1);display:block;width:100%;height:100%;object-fit:cover; }
  .lms-btn { cursor:pointer;transition:filter 0.2s,transform 0.2s; }
  .lms-btn:hover { filter:brightness(1.1);transform:translateY(-2px); }
  .lms-btn:active { transform:translateY(0); }
  .lms-pbar { height:4px;border-radius:99px;background:rgba(255,255,255,0.07);overflow:hidden; }
  .lms-pfill { height:100%;border-radius:99px;animation:lms-progress 1.4s ease forwards; }
  .lms-tile { overflow:hidden;border-radius:10px; }
  .lms-tile img { transition:transform 0.45s cubic-bezier(.4,0,.2,1);width:100%;height:100%;object-fit:cover;display:block; }
  .lms-tile:hover img { transform:scale(1.09); }
  .lms-chip { transition:filter 0.18s; }
  .lms-chip:hover { filter:brightness(1.2); }
  .lms-close:hover { background:rgba(255,255,255,0.18)!important; }
  .lms-modal-wrap { animation:lms-fadeIn 0.2s ease; }
  .lms-modal-box  { animation:lms-slideUp 0.3s ease; }
  .lms-sl { font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.2);padding:0 14px;margin:18px 0 6px; }
`

function StyleInject() {
  useEffect(() => {
    const id = 'lms-v2-css'
    if (!document.getElementById(id)) {
      const el = document.createElement('style')
      el.id = id; el.textContent = CSS
      document.head.appendChild(el)
    }
    return () => { document.getElementById('lms-v2-css')?.remove() }
  }, [])
  return null
}

interface Lecture {
  id:string; code:string; title:string; subtitle:string; description:string
  thumb:string; accent:string; accentDark:string; glow:string
  tag:string; difficulty:string; duration:string
  topics:string[]; pptUrl:string|null; progress:number
}

const LECTURES: Lecture[] = [
  {
    id:'sap3', code:'SAP-3', title:'Simple As Possible 3',
    subtitle:'Advanced Computer Architecture',
    description:'Deep-dive into SAP-3 — 8-bit data bus, 16-bit address bus, extended ALU with full instruction set, and hardware interrupt handling from the ground up.',
    thumb:'/static/thumb_sap3.jpg', accent:'#00F5D4', accentDark:'#00B3A4', glow:'rgba(0,245,212,0.22)',
    tag:'Computer Architecture', difficulty:'Advanced', duration:'2.5 hrs',
    topics:['Data Bus','ALU Ops','Address Bus','Instruction Set','Interrupts'],
    pptUrl:'https://docs.google.com/presentation/d/1O75SnWQMlWiyCT-ChK3jqL_7gj6q7w5s/embed?start=false&loop=false&delayms=3000',
    progress:0,
  },
  {
    id:'raspi1', code:'RASPI-1', title:'Raspberry Pi 1',
    subtitle:'Introduction to Embedded Systems',
    description:'BCM2835 SoC architecture, 40-pin GPIO header config, Linux OS setup, Python GPIO programming, and real-world sensor interfacing on a breadboard.',
    thumb:'/static/thumb_raspi1.jpg', accent:'#8B5CF6', accentDark:'#6D28D9', glow:'rgba(139,92,246,0.22)',
    tag:'Embedded Systems', difficulty:'Intermediate', duration:'2 hrs',
    topics:['BCM2835 SoC','GPIO Pins','Linux Setup','Hardware I/O','Python GPIO'],
    pptUrl:'https://docs.google.com/presentation/d/1xtiY5icVwHxYthETbRWCYnKxpXhndGNn/embed?start=false&loop=false&delayms=3000',
    progress:0,
  },
]

const STATS = [
  {label:'Total Lectures', value:2,   icon:'📚', color:'#4F7CFF', bg:'rgba(79,124,255,0.12)'},
  {label:'Completed',      value:0,   icon:'✅', color:'#00F5D4', bg:'rgba(0,245,212,0.12)'},
  {label:'In Progress',    value:2,   icon:'⏳', color:'#F59E0B', bg:'rgba(245,158,11,0.12)'},
  {label:'Study Hours',    value:4.5, icon:'⏱', color:'#8B5CF6', bg:'rgba(139,92,246,0.12)'},
  {label:'XP Points',      value:150, icon:'⚡', color:'#FF4C6E', bg:'rgba(255,76,110,0.12)'},
]

const NAV_ITEMS = [
  {id:'dashboard',   label:'Dashboard',   icon:'⊞', section:'MAIN', badge:''},
  {id:'lectures',    label:'Lectures',    icon:'🎓', section:'MAIN', badge:'2'},
  {id:'laboratory',  label:'Laboratory',  icon:'🧪', section:'MAIN', badge:''},
  {id:'assignments', label:'Assignments', icon:'📝', section:'STUDY', badge:''},
  {id:'quizzes',     label:'Quizzes',     icon:'❓', section:'STUDY', badge:''},
  {id:'projects',    label:'Projects',    icon:'🔧', section:'STUDY', badge:''},
  {id:'analytics',   label:'Analytics',   icon:'📊', section:'TOOLS', badge:''},
  {id:'profile',     label:'Profile',     icon:'👤', section:'TOOLS', badge:''},
  {id:'settings',    label:'Settings',    icon:'⚙',  section:'TOOLS', badge:''},
]

const SAP3_IMGS = [
  {src:'/static/img_sap3_alu.jpg', alt:'ALU Circuit'},
  {src:'/static/img_sap3_bus.jpg', alt:'Data/Addr Bus'},
  {src:'/static/img_sap3_cu.jpg',  alt:'Control Unit'},
  {src:'/static/img_sap3_reg.jpg', alt:'CPU Registers'},
  {src:'/static/img_sap3_int.jpg', alt:'Interrupt Circuit'},
  {src:'/static/img_sap3_isa.jpg', alt:'Instruction Set'},
]
const RASPI_IMGS = [
  {src:'/static/thumb_raspi1.jpg',   alt:'Raspberry Pi'},
  {src:'/static/img_raspi_gpio.jpg', alt:'GPIO Pinout'},
  {src:'/static/img_raspi_bb.jpg',   alt:'Breadboard'},
  {src:'/static/img_raspi_term.jpg', alt:'Linux Terminal'},
]

function Counter({target, dec=0}: {target:number; dec?:number}) {
  const [val, setVal] = React.useState(0)
  useEffect(() => {
    let t = 0
    const id = setInterval(() => {
      t = Math.min(t + target/(1400/16), target)
      setVal(parseFloat(t.toFixed(dec)))
      if (t >= target) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [target, dec])
  return <>{dec > 0 ? val.toFixed(dec) : Math.round(val)}</>
}

function Dot({x,y,s,delay,dur}: {x:number;y:number;s:number;delay:number;dur:number}) {
  return (
    <div style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:s,height:s,borderRadius:'50%',background:'rgba(79,124,255,0.7)',boxShadow:'0 0 6px rgba(79,124,255,0.9)',animation:`lms-particle ${dur}s ${delay}s ease-in-out infinite`,'--dx':`${(Math.random()-.5)*70}px`,pointerEvents:'none'} as React.CSSProperties}/>
  )
}

function Ring({pct, size=88, stroke='#4F7CFF'}: {pct:number;size?:number;stroke?:string}) {
  const r=(size-8)/2, circ=2*Math.PI*r, dash=(pct/100)*circ
  return (
    <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stroke} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{transition:'stroke-dasharray 1.4s ease',filter:`drop-shadow(0 0 8px ${stroke})`}}/>
    </svg>
  )
}

function Sidebar({active, onNav}: {active:string;onNav:(id:string)=>void}) {
  return (
    <div style={{width:228,flexShrink:0,height:'100vh',position:'sticky',top:0,background:'#080915',borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',padding:'0 10px 14px',overflowY:'auto',animation:'lms-slideRight 0.4s ease'}}>
      <div style={{padding:'20px 6px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)',marginBottom:4}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',inset:-3,borderRadius:12,background:'linear-gradient(135deg,#4F7CFF,#8B5CF6)',opacity:0.3,filter:'blur(6px)'}}/>
            <div style={{position:'relative',width:38,height:38,borderRadius:11,background:'linear-gradient(135deg,#4F7CFF,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,boxShadow:'0 0 20px rgba(79,124,255,0.5)'}}>🎛</div>
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:900,letterSpacing:-.4,background:'linear-gradient(135deg,#f0f4ff,#7B8CC8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>MicroLMS</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.28)',fontWeight:600,letterSpacing:.5,marginTop:1}}>v2.0 · Sanity Studio</div>
          </div>
        </div>
      </div>
      {['MAIN','STUDY','TOOLS'].map(sec => (
        <div key={sec}>
          <div className="lms-sl">{sec}</div>
          {NAV_ITEMS.filter(n=>n.section===sec).map(item => (
            <div key={item.id} className={`lms-nav${active===item.id?' active':''}`} onClick={()=>onNav(item.id)}>
              <span className="lms-ni" style={{fontSize:14,width:20,textAlign:'center'}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge && <span style={{fontSize:12,fontWeight:800,padding:'2px 6px',borderRadius:6,background:'rgba(79,124,255,0.2)',color:'#4F7CFF'}}>{item.badge}</span>}
            </div>
          ))}
        </div>
      ))}
      <div style={{marginTop:'auto',paddingTop:12,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{display:'flex',alignItems:'center',gap:9,padding:'10px',borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
          <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#4F7CFF,#8B5CF6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0,boxShadow:'0 0 12px rgba(79,124,255,0.4)'}}>👤</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:15,fontWeight:700,color:'#f0f4ff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Lance David</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.3)',marginTop:1}}>Engineering Student</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const now = new Date()
  const h = now.getHours()
  const greeting = h<5?'Good night':h<12?'Good morning':h<17?'Good afternoon':'Good evening'
  const dots = Array.from({length:14},(_,i)=>({x:Math.random()*100,y:Math.random()*100,s:Math.random()*2.5+1,delay:i*0.35,dur:4+Math.random()*3}))
  return (
    <div style={{position:'relative',borderRadius:22,overflow:'hidden',marginBottom:22,background:'linear-gradient(135deg,#0b1030 0%,#080d24 60%,#0c0f2e 100%)',border:'1px solid rgba(79,124,255,0.2)',boxShadow:'0 0 80px rgba(79,124,255,0.07),inset 0 1px 0 rgba(255,255,255,0.04)',padding:'30px 36px',animation:'lms-slideUp 0.45s ease'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(79,124,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,124,255,0.04) 1px,transparent 1px)',backgroundSize:'30px 30px',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(79,124,255,0.14) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:-50,left:'30%',width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
      {dots.map((d,i)=><Dot key={i} x={d.x} y={d.y} s={d.s} delay={d.delay} dur={d.dur}/>)}
      <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',justifyContent:'space-between',gap:24,flexWrap:'wrap'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <div style={{height:1,width:22,background:'rgba(79,124,255,0.6)'}}/>
            <span style={{fontSize:14,fontWeight:700,letterSpacing:2.5,textTransform:'uppercase',color:'rgba(79,124,255,0.9)'}}>Microcontroller LMS</span>
          </div>
          <h1 style={{fontSize:34,fontWeight:900,letterSpacing:-1,lineHeight:1.1,margin:'0 0 8px',background:'linear-gradient(135deg,#f0f4ff 20%,#7B8ECC 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            {greeting}, Lance 👋
          </h1>
          <p style={{fontSize:17,color:'rgba(255,255,255,0.5)',margin:'0 0 18px',lineHeight:1.6}}>
            {now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})} · Keep pushing forward.
          </p>
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <div style={{animation:'lms-streak 2s ease infinite',display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:10,background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',fontSize:16,fontWeight:700,color:'#F59E0B'}}>🔥 1 Day Streak</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:10,background:'rgba(79,124,255,0.1)',border:'1px solid rgba(79,124,255,0.25)',fontSize:16,fontWeight:600,color:'#4F7CFF'}}>⚡ 150 XP</div>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:10,background:'rgba(0,245,212,0.08)',border:'1px solid rgba(0,245,212,0.2)',fontSize:16,fontWeight:600,color:'#00F5D4'}}>🏆 Beginner</div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,flexShrink:0}}>
          <div style={{position:'relative'}}>
            <Ring pct={0} size={92} stroke='#4F7CFF'/>
            <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <div style={{fontSize:20,fontWeight:900,color:'#f0f4ff',lineHeight:1}}>0%</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',fontWeight:600}}>Done</div>
            </div>
          </div>
          <div style={{fontSize:14,color:'rgba(255,255,255,0.45)',fontWeight:600,textTransform:'uppercase',letterSpacing:.8}}>Overall Progress</div>
        </div>
      </div>
    </div>
  )
}

function StatCard({s, delay=0}: {s:typeof STATS[0];delay?:number}) {
  const dec = s.value%1!==0?1:0
  return (
    <div className="lms-stat" style={{animation:`lms-slideUp 0.5s ${delay}s ease both`}}>
      <div style={{position:'absolute',top:-24,right:-24,width:80,height:80,borderRadius:'50%',background:s.bg,filter:'blur(18px)',pointerEvents:'none'}}/>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
        <div style={{width:38,height:38,borderRadius:10,background:s.bg,border:`1px solid ${s.color}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{s.icon}</div>
        <div style={{width:7,height:7,borderRadius:'50%',background:s.color,boxShadow:`0 0 8px ${s.color}`,marginTop:4}}/>
      </div>
      <div style={{fontSize:36,fontWeight:900,color:'#f0f4ff',letterSpacing:-1.5,lineHeight:1,marginBottom:4}}><Counter target={s.value} dec={dec}/></div>
      <div style={{fontSize:16,fontWeight:500,color:'rgba(255,255,255,0.5)'}}>{s.label}</div>
      <div style={{marginTop:10}}>
        <div className="lms-pbar">
          <div className="lms-pfill" style={{width:s.label==='Completed'?'0%':s.label==='XP Points'?'15%':s.label==='Study Hours'?'45%':'100%',background:`linear-gradient(90deg,${s.color}88,${s.color})`,['--w' as any]:s.label==='Completed'?'0%':s.label==='XP Points'?'15%':s.label==='Study Hours'?'45%':'100%'}}/>
        </div>
      </div>
    </div>
  )
}

function DiagramMosaic() {
  return (
    <div style={{marginBottom:28,animation:'lms-slideUp 0.5s 0.18s ease both'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <div style={{height:1,width:18,background:'rgba(255,255,255,0.1)'}}/>
        <span style={{fontSize:13,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'rgba(255,255,255,0.35)'}}>📷 Reference Diagrams</span>
        <div style={{height:1,flex:1,background:'rgba(255,255,255,0.05)'}}/>
      </div>
      <div style={{marginBottom:8}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'rgba(0,245,212,0.7)',marginBottom:6}}>SAP-3 — Computer Architecture</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginBottom:5}}>
          {SAP3_IMGS.slice(0,3).map(d=>(<div key={d.src} className="lms-tile" style={{height:84,border:'1px solid rgba(0,245,212,0.12)'}}><img src={d.src} alt={d.alt}/></div>))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:5,marginBottom:5}}>
          {SAP3_IMGS.slice(3,5).map(d=>(<div key={d.src} className="lms-tile" style={{height:76,border:'1px solid rgba(0,245,212,0.12)'}}><img src={d.src} alt={d.alt}/></div>))}
        </div>
        <div className="lms-tile" style={{height:68,border:'1px solid rgba(0,245,212,0.12)'}}><img src={SAP3_IMGS[5].src} alt={SAP3_IMGS[5].alt}/></div>
      </div>
      <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)',margin:'10px 0'}}/>
      <div>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'rgba(139,92,246,0.7)',marginBottom:6}}>RASPI-1 — Embedded Systems</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginBottom:5}}>
          {RASPI_IMGS.slice(0,3).map(d=>(<div key={d.src} className="lms-tile" style={{height:84,border:'1px solid rgba(139,92,246,0.12)'}}><img src={d.src} alt={d.alt}/></div>))}
        </div>
        <div className="lms-tile" style={{height:76,border:'1px solid rgba(139,92,246,0.12)'}}><img src={RASPI_IMGS[3].src} alt={RASPI_IMGS[3].alt}/></div>
      </div>
    </div>
  )
}

function LecModal({lec, onClose}: {lec:Lecture;onClose:()=>void}) {
  useEffect(()=>{
    const fn=(e:KeyboardEvent)=>e.key==='Escape'&&onClose()
    window.addEventListener('keydown',fn)
    return ()=>window.removeEventListener('keydown',fn)
  },[onClose])
  return (
    <div className="lms-modal-wrap" onClick={onClose} style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(3,4,18,0.94)',backdropFilter:'blur(24px)'}}>
      <div className="lms-modal-box" onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:1080,height:'90vh',display:'flex',flexDirection:'column',borderRadius:24,overflow:'hidden',background:'#07080f',border:`1px solid ${lec.accent}40`,boxShadow:`0 50px 120px rgba(0,0,0,0.9),0 0 80px ${lec.glow}`}}>
        <div style={{padding:'15px 22px',display:'flex',alignItems:'center',gap:12,background:`linear-gradient(135deg,${lec.accent}14,${lec.accentDark}08)`,borderBottom:`1px solid ${lec.accent}22`}}>
          <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${lec.accent},${lec.accentDark})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>🖥</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:lec.accent,marginBottom:2}}>{lec.code} · Microcontroller LEC</div>
            <div style={{fontSize:20,fontWeight:800,color:'#f0f4ff'}}>{lec.title}</div>
          </div>
          <button className="lms-close" onClick={onClose} style={{width:30,height:30,borderRadius:'50%',border:'none',background:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.5)',fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'background 0.2s'}}>✕</button>
        </div>
        {lec.pptUrl
          ? <iframe src={lec.pptUrl} style={{flex:1,border:'none',background:'#050816'}} allowFullScreen title={lec.title}/>
          : <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
              <div style={{fontSize:32}}>📋</div>
              <div style={{fontSize:22,fontWeight:700,color:'rgba(255,255,255,0.7)'}}>Presentation Coming Soon</div>
              <div style={{fontSize:17,color:'rgba(255,255,255,0.45)'}}>Upload via Structure → Lectures in Sanity Studio</div>
            </div>
        }
      </div>
    </div>
  )
}

function CourseCard({lec, onOpen, delay=0}: {lec:Lecture;onOpen:()=>void;delay?:number}) {
  const dc = lec.difficulty==='Advanced'?'#FF4C6E':lec.difficulty==='Intermediate'?'#F59E0B':'#00F5D4'
  return (
    <article className="lms-card" style={{animation:`lms-slideUp 0.5s ${delay}s ease both`,border:`1px solid ${lec.accent}18`,boxShadow:`0 8px 40px rgba(0,0,0,0.25)`}}>
      <div style={{position:'relative',height:210,overflow:'hidden'}}>
        <img src={lec.thumb} alt={lec.title} className="lms-thumb"/>
        <div style={{position:'absolute',inset:0,background:`linear-gradient(to bottom,rgba(5,8,22,0.1) 0%,rgba(5,8,22,0.95) 100%)`}}/>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${lec.accent},transparent)`,boxShadow:`0 0 14px ${lec.accent}`}}/>
        <div style={{position:'absolute',top:14,left:14,display:'flex',gap:6}}>
          <span style={{padding:'5px 12px',borderRadius:8,fontSize:13,fontWeight:800,letterSpacing:1,textTransform:'uppercase',background:`${lec.accent}20`,color:lec.accent,border:`1px solid ${lec.accent}40`,backdropFilter:'blur(12px)'}}>{lec.code}</span>
          <span style={{padding:'5px 12px',borderRadius:8,fontSize:13,fontWeight:800,letterSpacing:1,textTransform:'uppercase',background:`${dc}18`,color:dc,border:`1px solid ${dc}40`,backdropFilter:'blur(12px)'}}>{lec.difficulty}</span>
        </div>
        <div style={{position:'absolute',top:14,right:14,padding:'5px 12px',borderRadius:8,fontSize:13,fontWeight:700,background:lec.pptUrl?'rgba(0,245,212,0.18)':'rgba(245,158,11,0.18)',color:lec.pptUrl?'#00F5D4':'#F59E0B',border:`1px solid ${lec.pptUrl?'rgba(0,245,212,0.35)':'rgba(245,158,11,0.35)'}`,backdropFilter:'blur(12px)'}}>
          {lec.pptUrl?'● Available':'◌ Coming Soon'}
        </div>
        <div style={{position:'absolute',bottom:14,left:14,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:14,color:'rgba(255,255,255,0.6)',fontWeight:600}}>⏱ {lec.duration}</span>
          <span style={{width:3,height:3,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'inline-block'}}/>
          <span style={{fontSize:14,color:'rgba(255,255,255,0.6)',fontWeight:600}}>{lec.tag}</span>
        </div>
      </div>
      <div style={{padding:'20px 22px 22px'}}>
        <div style={{fontSize:24,fontWeight:900,color:'#f0f4ff',letterSpacing:-.5,lineHeight:1.2,marginBottom:4}}>{lec.title}</div>
        <div style={{fontSize:15,fontWeight:600,color:lec.accent,marginBottom:10,letterSpacing:.3}}>{lec.subtitle}</div>
        <p style={{fontSize:16,color:'rgba(255,255,255,0.5)',lineHeight:1.7,marginBottom:16}}>{lec.description}</p>
        <div style={{marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <span style={{fontSize:14,fontWeight:600,color:'rgba(255,255,255,0.45)'}}>Course Progress</span>
            <span style={{fontSize:14,fontWeight:800,color:lec.accent}}>{lec.progress}%</span>
          </div>
          <div className="lms-pbar">
            <div className="lms-pfill" style={{width:`${lec.progress||0}%`,background:`linear-gradient(90deg,${lec.accentDark},${lec.accent})`,['--w' as any]:`${lec.progress||0}%`}}/>
          </div>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:18}}>
          {lec.topics.map(t=>(<span key={t} className="lms-chip" style={{padding:'4px 12px',borderRadius:99,fontSize:13,fontWeight:700,background:`${lec.accent}0e`,color:`${lec.accent}cc`,border:`1px solid ${lec.accent}22`}}>{t}</span>))}
        </div>
        <button className="lms-btn" onClick={onOpen} style={{width:'100%',padding:'14px 20px',borderRadius:13,border:'none',background:`linear-gradient(135deg,${lec.accent},${lec.accentDark})`,color:'#fff',fontSize:17,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:`0 4px 24px ${lec.glow}`,letterSpacing:.3}}>
          Open Lecture <span style={{fontSize:18}}>→</span>
        </button>
      </div>
    </article>
  )
}

export function HomeDashboard({initialLectureId}: {initialLectureId?: string} = {}) {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [activeLec, setActiveLec] = useState<Lecture|null>(() => LECTURES.find(lecture => lecture.id === initialLectureId) || null)
  return (
    <div style={{fontFamily:"'Inter',system-ui,-apple-system,sans-serif",minHeight:'100vh',background:'#050816',color:'#f0f4ff',display:'flex',overflow:'hidden'}}>
      <StyleInject/>
      <Sidebar active={activeNav} onNav={setActiveNav}/>
      <div style={{flex:1,overflowY:'auto',height:'100vh',padding:'30px 38px',position:'relative',background:'#050816'}}>
        <div style={{position:'fixed',top:-120,right:-100,width:520,height:520,borderRadius:'50%',background:'radial-gradient(circle,rgba(79,124,255,0.06) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'fixed',bottom:-80,left:'25%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'fixed',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,0.016) 1px,transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'relative',zIndex:1,maxWidth:1060,margin:'0 auto'}}>
          <Hero/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:11,marginBottom:26}}>
            {STATS.map((s,i)=><StatCard key={s.label} s={s} delay={i*0.06}/>)}
          </div>
          <DiagramMosaic/>
          <div style={{height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)',marginBottom:26}}/>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:22,animation:'lms-slideUp 0.5s 0.26s ease both'}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:5}}>🎓 Course Content</div>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:-.6,color:'#f0f4ff'}}>Lecture Presentations</div>
              <div style={{fontSize:17,color:'rgba(255,255,255,0.5)',marginTop:4}}>Assigned to <span style={{color:'#FF4C6E',fontWeight:700}}>Sanity CMS</span> · Click a card to view slides</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              {[{l:'Total',v:'2',c:'#4F7CFF'},{l:'Ready',v:'2',c:'#00F5D4'},{l:'Pending',v:'0',c:'#F59E0B'}].map(s=>(
                <div key={s.l} style={{textAlign:'center',padding:'10px 16px',borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{fontSize:22,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.45)',letterSpacing:.8,marginTop:3,textTransform:'uppercase'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:22,marginBottom:40}}>
            {LECTURES.map((lec,i)=><CourseCard key={lec.id} lec={lec} onOpen={()=>setActiveLec(lec)} delay={0.3+i*0.08}/>)}
          </div>
          <TopicOverviews/>
          <div style={{paddingTop:18,borderTop:'1px solid rgba(255,255,255,0.05)',textAlign:'center',fontSize:15,color:'rgba(255,255,255,0.35)'}}>
            Built with 🤍 using <span style={{color:'#4F7CFF',fontWeight:600}}>Sanity Studio</span> · MicroLMS v2.0
          </div>
        </div>
      </div>
      {activeLec&&<LecModal lec={activeLec} onClose={()=>setActiveLec(null)}/>}
    </div>
  )
}

export {Sidebar as DashboardSidebar, StyleInject as DashboardStyles}
