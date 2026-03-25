import { useState, useEffect } from "react";

const MEMBERS = ["Stéphane", "Marie", "Jean-François", "Lucie", "Pierre"];
const DEFAULT_CHECKLIST = [
  "Contrat signé","Acompte versé","Solde versé","Tech rider reçu",
  "Affiche créée","Promotion réseaux sociaux","Billetterie ouverte","Loge préparée","Bénévoles confirmés",
];
const MOCK_SHOWS = [
  { id:"1",title:"Les Louanges",date:"2026-04-12",time:"20:00",description:"Indie pop québécois – ambiance feutrée et textes poétiques.",
    links:[{label:"Site officiel",url:"https://leslouanges.com"}],documents:["Contrat_Louanges.pdf"],
    tasks:[{id:"t1",text:"Confirmer les besoins techniques",assignee:"Jean-François",done:false}],
    notes:[{id:"n1",author:"Marie",date:"2026-03-10",text:"Le gérant demande un piano accordé sur scène."}],
    checklist:DEFAULT_CHECKLIST.map((item,i)=>({id:`c1-${i}`,label:item,done:i<3})) },
  { id:"2",title:"Klô Pelgag",date:"2026-05-03",time:"20:30",description:"Pop baroque et univers onirique. Spectacle très attendu.",
    links:[{label:"Bandcamp",url:"https://klopelgag.bandcamp.com"}],documents:["Contrat_Klo.pdf","Tech_rider_Klo.pdf"],
    tasks:[{id:"t2",text:"Réserver hébergement musiciens",assignee:"Lucie",done:true},{id:"t3",text:"Envoyer plan de scène",assignee:"Stéphane",done:false}],
    notes:[],checklist:DEFAULT_CHECKLIST.map((item,i)=>({id:`c2-${i}`,label:item,done:i<6})) },
  { id:"3",title:"Safia Nolin",date:"2026-06-20",time:"19:30",description:"Folk alternatif, voix unique et présence scénique captivante.",
    links:[],documents:[],tasks:[{id:"t4",text:"Préparer liste bénévoles",assignee:"Pierre",done:false}],
    notes:[{id:"n2",author:"Stéphane",date:"2026-03-18",text:"Vérifier capacité de la salle."}],
    checklist:DEFAULT_CHECKLIST.map((item,i)=>({id:`c3-${i}`,label:item,done:i<1})) },
];
const MOCK_LINKS = [
  {id:"l1",cat:"Billetterie",label:"Lepointdevente.com",url:"https://lepointdevente.com",icon:"🎟️"},
  {id:"l2",cat:"Promotion",label:"Canva – Affiches",url:"https://canva.com",icon:"🎨"},
  {id:"l3",cat:"Promotion",label:"Facebook Grandmontoise",url:"https://facebook.com",icon:"📘"},
  {id:"l4",cat:"Administration",label:"Google Drive – Comité",url:"https://drive.google.com",icon:"📁"},
  {id:"l5",cat:"Ressources",label:"ROSEQ – Diffuseurs",url:"https://roseq.ca",icon:"🌐"},
  {id:"l6",cat:"Ressources",label:"CALQ – Subventions",url:"https://calq.gouv.qc.ca",icon:"💰"},
];

const fmtDate = d=>{const x=new Date(d+"T12:00:00");return x.toLocaleDateString("fr-CA",{weekday:"long",day:"numeric",month:"long"});};
const daysUntil = d=>Math.ceil((new Date(d+"T00:00:00")-Object.assign(new Date(),{...new Date(),hours:0,minutes:0,seconds:0,milliseconds:0},[new Date().setHours(0,0,0,0)]))/86400000);
const pct = cl=>!cl.length?0:Math.round(cl.filter(c=>c.done).length/cl.length*100);

// Logo SVG
function Logo({size=64,light=false}){
  const s=light?"rgba(255,255,255,0.9)":"#312e81";
  const a=light?"rgba(255,255,255,0.25)":"rgba(99,102,241,0.25)";
  return(
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect x="22" y="38" width="36" height="28" rx="1" fill={a} stroke={s} strokeWidth="1.5"/>
      <path d="M18 38 L40 20 L62 38Z" fill={a} stroke={s} strokeWidth="1.5" strokeLinejoin="round"/>
      <rect x="34" y="10" width="12" height="18" rx="1" fill={a} stroke={s} strokeWidth="1.5"/>
      <path d="M33 10 L40 3 L47 10Z" fill={s} opacity="0.7"/>
      <path d="M35 66 L35 55 Q40 51 45 55 L45 66" stroke={s} strokeWidth="1.5"/>
      <ellipse cx="29" cy="48" rx="3" ry="4" stroke={s} strokeWidth="1" fill={a}/>
      <ellipse cx="51" cy="48" rx="3" ry="4" stroke={s} strokeWidth="1" fill={a}/>
      <circle cx="63" cy="22" r="3" fill="#f59e0b"/>
      <line x1="66" y1="22" x2="66" y2="16" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="66" y1="16" x2="70" y2="15" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Badge
function Bdg({children,color="slate"}){
  const m={green:"bg-emerald-900/40 text-emerald-300 border-emerald-700/50",amber:"bg-amber-900/40 text-amber-300 border-amber-700/50",red:"bg-red-900/40 text-red-300 border-red-700/50",slate:"bg-slate-700/40 text-slate-300 border-slate-600/50",indigo:"bg-indigo-900/40 text-indigo-300 border-indigo-700/50"};
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${m[color]}`}>{children}</span>;
}
function CdBadge({d}){const x=daysUntil(d);if(x<0)return<Bdg color="slate">Passé</Bdg>;if(x===0)return<Bdg color="red">Ce soir!</Bdg>;if(x<=14)return<Bdg color="amber">{x}j</Bdg>;return<Bdg color="green">{x}j</Bdg>;}
function PBar({p,sm}){return(<div className={`w-full bg-slate-700/50 rounded-full ${sm?"h-1":"h-1.5"}`}><div className="h-full rounded-full transition-all duration-500" style={{width:`${p}%`,background:p===100?"#34d399":"linear-gradient(90deg,#6366f1,#8b5cf6)"}}/></div>);}

// ── TOP BAR ───────────────────────────────────────────────────────
function TopBar({page,setPage}){
  const nav=[{id:"home",label:"Accueil",icon:"⌂"},{id:"calendrier",label:"Calendrier",icon:"🗓"},{id:"disques",label:"Disques",icon:"💿"},{id:"utilitaires",label:"Utilitaires",icon:"🔧"}];
  return(
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/8 z-50 backdrop-blur-md" style={{background:"rgba(10,8,30,0.92)"}}>
      <button onClick={()=>setPage("home")} className="flex items-center gap-3">
        <Logo size={32} light/>
        <div className="leading-none">
          <span className="block text-sm font-semibold text-white" style={{fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.02em"}}>La Grandmontoise</span>
          <span className="block text-xs text-white/35 mt-0.5">Comité de programmation</span>
        </div>
      </button>
      <nav className="flex items-center gap-1">
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${page===n.id?"bg-amber-500/15 text-amber-300 border border-amber-500/35":"text-white/45 hover:text-white/80 hover:bg-white/6"}`}>
            <span className="text-xs opacity-80">{n.icon}</span><span>{n.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────
function HomePage({shows,setPage}){
  const [vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),60);},[]);
  const upcoming=[...shows].filter(s=>daysUntil(s.date)>=0).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
  const totalTasks=shows.reduce((a,s)=>a+s.tasks.filter(t=>!t.done).length,0);
  const stats=[
    {label:"Spectacles",value:shows.length,icon:"🎭",g:"from-indigo-600/25 to-indigo-900/20 border-indigo-500/25"},
    {label:"À venir (30j)",value:shows.filter(s=>daysUntil(s.date)>=0&&daysUntil(s.date)<=30).length,icon:"📅",g:"from-amber-600/25 to-amber-900/20 border-amber-500/25"},
    {label:"Tâches actives",value:totalTasks,icon:"✅",g:"from-emerald-600/25 to-emerald-900/20 border-emerald-500/25"},
    {label:"Membres",value:MEMBERS.length,icon:"👥",g:"from-purple-600/25 to-purple-900/20 border-purple-500/25"},
  ];
  return(
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{minHeight:340}}>
        <div className="absolute inset-0" style={{background:"radial-gradient(ellipse 90% 70% at 50% -5%,rgba(99,102,241,0.4) 0%,transparent 65%),radial-gradient(ellipse 50% 40% at 85% 60%,rgba(245,158,11,0.12) 0%,transparent 60%),#0a081e"}}/>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
        <div className={`relative z-10 flex flex-col items-center justify-center text-center px-8 py-16 transition-all duration-700 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}>
          <div className="mb-6" style={{filter:"drop-shadow(0 0 40px rgba(99,102,241,0.7))"}}>
            <Logo size={100} light/>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2" style={{fontFamily:"'Cormorant Garamond',serif",letterSpacing:"-0.02em",textShadow:"0 0 60px rgba(99,102,241,0.4)"}}>
            La Grandmontoise
          </h1>
          <p className="text-amber-300/70 text-xs tracking-[0.25em] uppercase font-medium mb-2">Saint-Gédéon · Lac-Saint-Jean</p>
          <p className="text-white/30 text-sm max-w-sm mt-1">Outil interne du comité de programmation</p>
        </div>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-4 gap-4 px-8 -mt-5 relative z-10 transition-all duration-700 delay-150 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-4"}`}>
        {stats.map(s=>(
          <div key={s.label} className={`rounded-xl border bg-gradient-to-br ${s.g} p-4 backdrop-blur-sm`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-3xl font-bold text-white" style={{fontFamily:"'Cormorant Garamond',serif"}}>{s.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Prochains spectacles */}
      <div className={`px-8 mt-8 mb-10 transition-all duration-700 delay-300 ${vis?"opacity-100 translate-y-0":"opacity-0 translate-y-4"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white" style={{fontFamily:"'Cormorant Garamond',serif"}}>Prochains spectacles</h2>
          <button onClick={()=>setPage("calendrier")} className="text-xs text-amber-400/80 hover:text-amber-300 transition-colors">Voir tous →</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {upcoming.map(show=>{
            const p=pct(show.checklist);
            return(
              <div key={show.id} onClick={()=>setPage("calendrier")}
                className="bg-slate-800/35 border border-slate-700/40 rounded-xl p-4 hover:bg-slate-800/60 hover:border-indigo-500/35 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm leading-tight">{show.title}</h3>
                  <CdBadge d={show.date}/>
                </div>
                <p className="text-xs text-slate-400 mb-3 capitalize">{fmtDate(show.date)} · {show.time}</p>
                <PBar p={p} sm/>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-slate-500">{p}% complété</span>
                  {show.tasks.filter(t=>!t.done).length>0&&<span className="text-xs text-amber-400">⚠ {show.tasks.filter(t=>!t.done).length}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── CALENDRIER PAGE ───────────────────────────────────────────────
function TabBtn({label,active,onClick,count}){
  return(
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${active?"bg-indigo-600 text-white":"text-slate-400 hover:text-white hover:bg-slate-700/50"}`}>
      {label}{count!==undefined&&<span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${active?"bg-indigo-400/30":"bg-slate-700"}`}>{count}</span>}
    </button>
  );
}

function ShowDetail({show,onUpdate}){
  const [tab,setTab]=useState("info");
  const [nTask,setNTask]=useState(""); const [nAssign,setNAssign]=useState(MEMBERS[0]);
  const [nNote,setNNote]=useState(""); const [nNoteAuth,setNNoteAuth]=useState(MEMBERS[0]);
  const [nLink,setNLink]=useState({label:"",url:""}); const [showLinkF,setShowLinkF]=useState(false);
  const inp="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500";
  const tCheck=id=>onUpdate({...show,checklist:show.checklist.map(c=>c.id===id?{...c,done:!c.done}:c)});
  const tTask =id=>onUpdate({...show,tasks:show.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)});
  const aTask=()=>{if(!nTask.trim())return;onUpdate({...show,tasks:[...show.tasks,{id:`t${Date.now()}`,text:nTask,assignee:nAssign,done:false}]});setNTask("");};
  const aNote=()=>{if(!nNote.trim())return;onUpdate({...show,notes:[...show.notes,{id:`n${Date.now()}`,author:nNoteAuth,date:new Date().toISOString().split("T")[0],text:nNote}]});setNNote("");};
  const aLink=()=>{if(!nLink.label.trim()||!nLink.url.trim())return;onUpdate({...show,links:[...show.links,nLink]});setNLink({label:"",url:""});setShowLinkF(false);};
  const p=pct(show.checklist);
  return(
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-2xl font-bold text-white" style={{fontFamily:"'Cormorant Garamond',serif"}}>{show.title}</h2>
          <CdBadge d={show.date}/>
        </div>
        <p className="text-slate-400 text-sm capitalize mb-3">{fmtDate(show.date)} à {show.time}</p>
        <div className="flex items-center gap-3"><PBar p={p}/><span className="text-sm font-semibold text-slate-300 whitespace-nowrap">{p}%</span></div>
        <p className="text-xs text-slate-500 mt-1">{show.checklist.filter(c=>c.done).length}/{show.checklist.length} étapes</p>
      </div>
      <div className="flex gap-1 p-3 border-b border-slate-700/50 bg-slate-900/30">
        <TabBtn label="Info"      active={tab==="info"}      onClick={()=>setTab("info")}/>
        <TabBtn label="Checklist" active={tab==="checklist"} onClick={()=>setTab("checklist")} count={show.checklist.filter(c=>!c.done).length||undefined}/>
        <TabBtn label="Tâches"    active={tab==="tasks"}     onClick={()=>setTab("tasks")}     count={show.tasks.filter(t=>!t.done).length||undefined}/>
        <TabBtn label="Notes"     active={tab==="notes"}     onClick={()=>setTab("notes")}     count={show.notes.length||undefined}/>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {tab==="info"&&(
          <div className="space-y-5">
            {show.description&&<div><h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3><p className="text-slate-300 text-sm leading-relaxed">{show.description}</p></div>}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Liens</h3>
                <button onClick={()=>setShowLinkF(!showLinkF)} className="text-xs text-indigo-400 hover:text-indigo-300">+ Ajouter</button>
              </div>
              {showLinkF&&(<div className="bg-slate-800/60 rounded-lg p-3 mb-2 space-y-2">
                <input value={nLink.label} onChange={e=>setNLink({...nLink,label:e.target.value})} placeholder="Étiquette" className={inp}/>
                <input value={nLink.url}   onChange={e=>setNLink({...nLink,url:e.target.value})}   placeholder="URL"       className={inp}/>
                <button onClick={aLink} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-1.5 rounded-lg transition-colors">Ajouter</button>
              </div>)}
              {show.links.length===0&&!showLinkF&&<p className="text-slate-500 text-sm italic">Aucun lien.</p>}
              {show.links.map((l,i)=><a key={i} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">🔗 {l.label}</a>)}
            </div>
            {show.documents.length>0&&(<div><h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Documents</h3>{show.documents.map((d,i)=><div key={i} className="text-sm text-slate-300 flex items-center gap-2">📄 {d}</div>)}</div>)}
          </div>
        )}
        {tab==="checklist"&&(<div className="space-y-2">{show.checklist.map(item=>(
          <label key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors">
            <div onClick={()=>tCheck(item.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${item.done?"bg-emerald-500 border-emerald-500":"border-slate-600 hover:border-slate-400"}`}>{item.done&&<span className="text-white text-xs">✓</span>}</div>
            <span className={`text-sm ${item.done?"text-slate-500 line-through":"text-slate-200"}`}>{item.label}</span>
          </label>
        ))}</div>)}
        {tab==="tasks"&&(
          <div className="space-y-4">
            {show.tasks.length===0&&<p className="text-slate-500 text-sm italic">Aucune tâche.</p>}
            {show.tasks.map(task=>(
              <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${task.done?"bg-slate-800/20 border-slate-700/30 opacity-60":"bg-slate-800/40 border-slate-700/50"}`}>
                <div onClick={()=>tTask(task.id)} className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${task.done?"bg-emerald-500 border-emerald-500":"border-slate-600 hover:border-indigo-400"}`}>{task.done&&<span className="text-white text-xs">✓</span>}</div>
                <div><p className={`text-sm ${task.done?"line-through text-slate-500":"text-slate-200"}`}>{task.text}</p><p className="text-xs text-slate-500 mt-0.5">👤 {task.assignee}</p></div>
              </div>
            ))}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/40 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nouvelle tâche</p>
              <input value={nTask} onChange={e=>setNTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&aTask()} placeholder="Description…" className={inp}/>
              <div className="flex gap-2">
                <select value={nAssign} onChange={e=>setNAssign(e.target.value)} className={`flex-1 ${inp}`}>{MEMBERS.map(m=><option key={m}>{m}</option>)}</select>
                <button onClick={aTask} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">Ajouter</button>
              </div>
            </div>
          </div>
        )}
        {tab==="notes"&&(
          <div className="space-y-4">
            {show.notes.length===0&&<p className="text-slate-500 text-sm italic">Aucune note.</p>}
            {show.notes.map(note=>(
              <div key={note.id} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/40">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-indigo-300">{note.author}</span><span className="text-xs text-slate-500">{note.date}</span></div>
                <p className="text-sm text-slate-300 leading-relaxed">{note.text}</p>
              </div>
            ))}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/40 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nouvelle note</p>
              <select value={nNoteAuth} onChange={e=>setNNoteAuth(e.target.value)} className={inp}>{MEMBERS.map(m=><option key={m}>{m}</option>)}</select>
              <textarea value={nNote} onChange={e=>setNNote(e.target.value)} placeholder="Écrire une note…" rows={3} className={`${inp} resize-none`}/>
              <button onClick={aNote} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm transition-colors">Publier</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddModal({onAdd,onClose}){
  const [f,setF]=useState({title:"",date:"",time:"20:00",description:""});
  const inp="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500";
  const sub=()=>{if(!f.title||!f.date)return;onAdd({id:`s${Date.now()}`,...f,links:[],documents:[],tasks:[],notes:[],checklist:DEFAULT_CHECKLIST.map((item,i)=>({id:`c${Date.now()}-${i}`,label:item,done:false}))});onClose();};
  return(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-4" style={{fontFamily:"'Cormorant Garamond',serif"}}>Nouveau spectacle</h3>
        <div className="space-y-3">
          <input value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="Nom de l'artiste" className={inp}/>
          <div className="flex gap-2">
            <input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})} className={`flex-1 ${inp}`}/>
            <input type="time" value={f.time} onChange={e=>setF({...f,time:e.target.value})} className={`w-28 ${inp}`}/>
          </div>
          <textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} placeholder="Description" rows={3} className={`${inp} resize-none`}/>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg text-sm">Annuler</button>
          <button onClick={sub} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-semibold">Créer</button>
        </div>
      </div>
    </div>
  );
}

function CalendrierPage({shows,setShows}){
  const [sel,setSel]=useState(shows[0]?.id);
  const [modal,setModal]=useState(false);
  const [msg,setMsg]=useState(""); const [load,setLoad]=useState(false);
  const selShow=shows.find(s=>s.id===sel);
  const sorted=[...shows].sort((a,b)=>a.date.localeCompare(b.date));

  const loadCal=async()=>{
    setLoad(true);setMsg("Connexion à Google Calendar…");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"Liste les spectacles dans Google Calendar. Réponds UNIQUEMENT en JSON valide sans backticks: {\"shows\":[{\"id\":\"string\",\"title\":\"string\",\"date\":\"YYYY-MM-DD\",\"time\":\"HH:MM\",\"description\":\"string\"}]}",messages:[{role:"user",content:"Spectacles pour La Grandmontoise dans les 12 prochains mois."}],mcp_servers:[{type:"url",url:"https://gcal.mcp.claude.com/mcp",name:"gcal"}]})});
      const d=await r.json();
      const txt=d.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
      const p=JSON.parse(txt.replace(/```json|```/g,"").trim());
      const nw=(p.shows||[]).filter(cs=>!shows.find(s=>s.title===cs.title&&s.date===cs.date)).map(s=>({...s,links:[],documents:[],tasks:[],notes:[],checklist:DEFAULT_CHECKLIST.map((item,i)=>({id:`c${s.id}-${i}`,label:item,done:false}))}));
      if(nw.length>0){setShows(prev=>[...prev,...nw]);setMsg(`✓ ${nw.length} spectacle(s) importé(s) !`);}
      else setMsg("Aucun nouveau spectacle trouvé.");
    }catch{setMsg("Aucun spectacle trouvé dans le calendrier.");}
    setLoad(false);setTimeout(()=>setMsg(""),3000);
  };

  return(
    <div className="flex flex-1 overflow-hidden">
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-slate-700/50 bg-slate-900/50">
        <div className="p-3 border-b border-slate-700/50 space-y-2">
          <button onClick={()=>setModal(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg font-medium transition-colors">+ Nouveau spectacle</button>
          <button onClick={loadCal} disabled={load} className="w-full bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs py-1.5 rounded-lg transition-colors disabled:opacity-50">{load?"⏳":"📅"} Importer Google Calendar</button>
          {msg&&<p className="text-xs text-center text-emerald-400">{msg}</p>}
        </div>
        <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-700/50">
          <div className="bg-slate-800/40 rounded-lg p-2 text-center"><div className="text-lg font-bold text-white">{shows.length}</div><div className="text-xs text-slate-500">Total</div></div>
          <div className="bg-slate-800/40 rounded-lg p-2 text-center"><div className="text-lg font-bold text-amber-400">{shows.filter(s=>daysUntil(s.date)<=30&&daysUntil(s.date)>=0).length}</div><div className="text-xs text-slate-500">Ce mois</div></div>
          <div className="bg-slate-800/40 rounded-lg p-2 text-center"><div className="text-lg font-bold text-indigo-400">{shows.reduce((a,s)=>a+s.tasks.filter(t=>!t.done).length,0)}</div><div className="text-xs text-slate-500">Tâches</div></div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sorted.map(show=>{const p=pct(show.checklist);return(
            <button key={show.id} onClick={()=>setSel(show.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${sel===show.id?"bg-indigo-950/60 border-indigo-500/60":"bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/70 hover:border-slate-600/60"}`}>
              <div className="flex items-start justify-between gap-2 mb-1"><span className="font-semibold text-white text-sm">{show.title}</span><CdBadge d={show.date}/></div>
              <div className="text-xs text-slate-400 mb-2 capitalize">{fmtDate(show.date)}</div>
              <div className="flex items-center gap-2"><PBar p={p} sm/><span className="text-xs text-slate-500">{p}%</span></div>
              {show.tasks.filter(t=>!t.done).length>0&&<div className="mt-1.5 text-xs text-amber-400/80">⚠ {show.tasks.filter(t=>!t.done).length} tâche(s)</div>}
            </button>
          );})}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {selShow?<ShowDetail show={selShow} onUpdate={u=>setShows(p=>p.map(s=>s.id===u.id?u:s))}/>:<div className="h-full flex items-center justify-center text-slate-500">Sélectionne un spectacle</div>}
      </div>
      {modal&&<AddModal onAdd={s=>{setShows(p=>[...p,s]);setSel(s.id);}} onClose={()=>setModal(false)}/>}
    </div>
  );
}

// ── DISQUES PAGE ──────────────────────────────────────────────────
function DisquesPage(){
  const [files,setFiles]=useState([]);
  const [load,setLoad]=useState(false);
  const [msg,setMsg]=useState("");
  const [searched,setSearched]=useState(false);

  const loadDrive=async()=>{
    setLoad(true);setMsg("Connexion à Google Drive…");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"Liste les fichiers récents dans Google Drive. Réponds UNIQUEMENT en JSON valide sans backticks: {\"files\":[{\"id\":\"string\",\"name\":\"string\",\"type\":\"pdf|doc|sheet|folder|other\",\"modified\":\"string\",\"url\":\"string\"}]}. Max 15 fichiers.",messages:[{role:"user",content:"Mes fichiers récents Google Drive liés à La Grandmontoise."}],mcp_servers:[{type:"url",url:"https://drive.google.com/mcp",name:"gdrive"}]})});
      const d=await r.json();
      const txt=d.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
      const p=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setFiles(p.files||[]);
      setMsg(p.files?.length>0?"✓ Fichiers chargés":"Aucun fichier trouvé.");
    }catch{
      setMsg("Affichage d'exemple (Drive non connecté) :");
      setFiles([
        {id:"f1",name:"Contrat_Les_Louanges_2026.pdf",type:"pdf",modified:"2026-03-10",url:"#"},
        {id:"f2",name:"Programmation_2026.xlsx",type:"sheet",modified:"2026-03-15",url:"#"},
        {id:"f3",name:"Tech_rider_Klo_Pelgag.pdf",type:"pdf",modified:"2026-02-28",url:"#"},
        {id:"f4",name:"Budget_saison_2026.xlsx",type:"sheet",modified:"2026-03-01",url:"#"},
        {id:"f5",name:"Photos_Grandmontoise",type:"folder",modified:"2026-03-20",url:"#"},
        {id:"f6",name:"Compte_rendu_reunion_mars.docx",type:"doc",modified:"2026-03-22",url:"#"},
      ]);
    }
    setLoad(false);setSearched(true);setTimeout(()=>setMsg(""),4000);
  };

  const icons={pdf:"📄",doc:"📝",sheet:"📊",folder:"📁",other:"📎"};
  const types={pdf:"PDF",doc:"Document",sheet:"Tableur",folder:"Dossier",other:"Fichier"};

  return(
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-2xl font-bold text-white" style={{fontFamily:"'Cormorant Garamond',serif"}}>Google Drive</h2><p className="text-slate-400 text-sm mt-0.5">Documents et fichiers du comité</p></div>
          <button onClick={loadDrive} disabled={load} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            {load?"⏳ Chargement…":"📁 Charger depuis Drive"}
          </button>
        </div>
        {msg&&<p className="text-sm text-amber-300/80 mb-4 bg-amber-900/20 border border-amber-700/30 rounded-lg px-4 py-2">{msg}</p>}
        {!searched&&!load&&(
          <div className="text-center py-20 text-slate-500">
            <div className="text-5xl mb-4 opacity-30">📁</div>
            <p className="text-base">Clique sur « Charger depuis Drive » pour accéder à tes fichiers.</p>
          </div>
        )}
        {files.length>0&&(
          <div className="grid gap-3">
            {files.map(f=>(
              <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-slate-800/35 border border-slate-700/40 rounded-xl hover:bg-slate-800/60 hover:border-indigo-500/35 transition-all group">
                <span className="text-2xl">{icons[f.type]||"📎"}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">{f.name}</p><p className="text-xs text-slate-500 mt-0.5">{types[f.type]} · Modifié {f.modified}</p></div>
                <span className="text-slate-600 group-hover:text-indigo-400 transition-colors text-sm">→</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── UTILITAIRES PAGE ──────────────────────────────────────────────
function UtilitairesPage(){
  const [links,setLinks]=useState(MOCK_LINKS);
  const [showF,setShowF]=useState(false);
  const [f,setF]=useState({cat:"",label:"",url:"",icon:"🔗"});
  const cats=[...new Set(links.map(l=>l.cat))];
  const inp="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500";
  const add=()=>{if(!f.label.trim()||!f.url.trim())return;setLinks(p=>[...p,{id:`l${Date.now()}`,...f,cat:f.cat||"Autre"}]);setF({cat:"",label:"",url:"",icon:"🔗"});setShowF(false);};
  return(
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-2xl font-bold text-white" style={{fontFamily:"'Cormorant Garamond',serif"}}>Utilitaires & Liens</h2><p className="text-slate-400 text-sm mt-0.5">Ressources et outils du comité</p></div>
          <button onClick={()=>setShowF(!showF)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">+ Ajouter un lien</button>
        </div>
        {showF&&(
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 mb-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={f.label} onChange={e=>setF({...f,label:e.target.value})} placeholder="Nom du lien"       className={inp}/>
              <input value={f.url}   onChange={e=>setF({...f,url:e.target.value})}   placeholder="URL"               className={inp}/>
              <input value={f.cat}   onChange={e=>setF({...f,cat:e.target.value})}   placeholder="Catégorie"         className={inp}/>
              <input value={f.icon}  onChange={e=>setF({...f,icon:e.target.value})}  placeholder="Émoji (ex: 🎟️)"   className={inp}/>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setShowF(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm">Annuler</button>
              <button onClick={add}                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-semibold">Ajouter</button>
            </div>
          </div>
        )}
        <div className="space-y-6">
          {cats.map(cat=>(
            <div key={cat}>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{cat}</h3>
              <div className="grid grid-cols-2 gap-3">
                {links.filter(l=>l.cat===cat).map(l=>(
                  <a key={l.id} href={l.url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-800/35 border border-slate-700/40 rounded-xl hover:bg-slate-800/60 hover:border-amber-500/35 transition-all group">
                    <span className="text-xl">{l.icon}</span>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors truncate">{l.label}</p><p className="text-xs text-slate-500 truncate">{l.url.replace(/^https?:\/\//,"")}</p></div>
                    <span className="text-slate-600 group-hover:text-amber-400 transition-colors text-sm">↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("home");
  const [shows,setShows]=useState(MOCK_SHOWS);
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;font-family:'DM Sans',sans-serif;}
        body{margin:0;background:#0a081e;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#334155;border-radius:2px;}
      `}</style>
      <div className="flex flex-col h-screen text-white overflow-hidden" style={{background:"linear-gradient(160deg,#0a081e 0%,#0f1117 100%)"}}>
        <TopBar page={page} setPage={setPage}/>
        <div className="flex flex-1 overflow-hidden">
          {page==="home"        &&<HomePage shows={shows} setPage={setPage}/>}
          {page==="calendrier"  &&<CalendrierPage shows={shows} setShows={setShows}/>}
          {page==="disques"     &&<DisquesPage/>}
          {page==="utilitaires" &&<UtilitairesPage/>}
        </div>
      </div>
    </>
  );
}
