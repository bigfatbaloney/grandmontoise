import { useState } from "react";
import {
  Home, Mail, Calendar, Drama, FolderOpen, Users, BookOpen,
  Plus, Star, Trash2, Menu, X, Lock
} from "lucide-react";

const APP_PASSWORD = "grandmontoise2026";

const BRAND = {
  teal: "#1a6b82",
  tealLight: "#2a8ba6",
  tealDark: "#124f61",
  red: "#d63030",
  bg: "#0c1015",
  surface: "#131920",
  surface2: "#19222b",
  border: "#1e2a33",
  border2: "#243040",
  text: "#e8eef2",
  muted: "#6b8090",
  faint: "#3a4e5c",
};

const NAV_ITEMS = [
  { id: "accueil",    label: "Accueil",     Icon: Home },
  { id: "calendrier", label: "Calendrier",  Icon: Calendar },
  { id: "evenements", label: "Événements",  Icon: Drama },
  { id: "courriels",  label: "Courriels",   Icon: Mail },
  { id: "disque",     label: "Disque",      Icon: FolderOpen },
  { id: "membres",    label: "Membres",     Icon: Users },
  { id: "ressources", label: "Ressources",  Icon: BookOpen },
];

const CARDS = [
  { id: "calendrier", label: "Calendrier",     desc: "Événements & spectacles", Icon: Calendar,   color: BRAND.teal,    bg: "rgba(26,107,130,0.18)" },
  { id: "evenements", label: "Événements",     desc: "Passés et à venir",       Icon: Drama,      color: BRAND.red,     bg: "rgba(214,48,48,0.14)" },
  { id: "courriels",  label: "Courriels",      desc: "Consultation",            Icon: Mail,       color: "#4a90b8",     bg: "rgba(74,144,184,0.14)" },
  { id: "disque",     label: "Disque partagé", desc: "Documents",               Icon: FolderOpen, color: "#2eb87e",     bg: "rgba(46,184,126,0.12)" },
  { id: "membres",    label: "Membres",        desc: "Coordonnées",             Icon: Users,      color: "#c9873a",     bg: "rgba(201,135,58,0.14)" },
  { id: "ressources", label: "Ressources",     desc: "Documents & outils",      Icon: BookOpen,   color: "#8b6fc9",     bg: "rgba(139,111,201,0.14)" },
];

const EVENEMENTS_DATA = [
  { titre: "Ballet Synergie",               date: "2026-09-15", statut: "À venir", type: "Danse" },
  { titre: "Journée Vinyles",               date: "2026-06-21", statut: "À venir", type: "Musique" },
  { titre: "The Clamp",                     date: "2026-05-30", statut: "À venir", type: "Rock / Métal" },
  { titre: "Lou-Adriane Cassidy",           date: "2026-03-14", statut: "Passé",   type: "Chanson" },
  { titre: "Olivier Simard – Classe à part",date: "2026-02-22", statut: "Passé",   type: "Magie" },
];

const MEMBRES = [
  { nom: "Stéphane",      role: "Programmation & promotion", email: "stephane@lagrandmontoise.ca" },
  { nom: "Marie",         role: "Coordination",              email: "marie@lagrandmontoise.ca" },
  { nom: "Jean-François", role: "Technique",                 email: "jf@lagrandmontoise.ca" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${BRAND.bg}; font-family: 'DM Sans', sans-serif; }
  button, input, textarea { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${BRAND.bg}; }
  ::-webkit-scrollbar-thumb { background: ${BRAND.border2}; border-radius: 3px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(-7px)} 50%{transform:translateX(7px)} }

  .fade-up  { animation: fadeUp 0.4s ease both; }
  .shake    { animation: shake 0.38s ease; }

  .nav-btn  { transition: background 0.15s, color 0.15s; }
  .nav-btn:hover { background: rgba(26,107,130,0.1) !important; color: ${BRAND.tealLight} !important; }
  .nav-btn.active{ background: rgba(26,107,130,0.18) !important; color: ${BRAND.tealLight} !important; }

  .card { transition: transform 0.18s, box-shadow 0.18s; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }

  .btn-primary { transition: background 0.15s; }
  .btn-primary:hover { background: ${BRAND.tealLight} !important; }
  .btn-primary:active { opacity: 0.9; }

  .btn-ghost { transition: background 0.15s; }
  .btn-ghost:hover { background: rgba(255,255,255,0.05) !important; }

  input:focus, textarea:focus { outline: none; border-color: ${BRAND.teal} !important; }

  @media (min-width: 640px) { .mobile-only { display: none !important; } }
  @media (max-width: 639px) { .desktop-only { display: none !important; } }
`;

// ─── LogoMark ─────────────────────────────────────────────────────────────────
function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={BRAND.tealDark} />
      <ellipse cx="20" cy="13" rx="7" ry="7" fill={BRAND.red} />
      <path d="M13 20 Q10 28 16 30 Q22 32 26 26 Q32 18 24 16" stroke={BRAND.tealLight} strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (pwd === APP_PASSWORD) { onLogin(); }
    else {
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:BRAND.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{CSS}</style>
      <div className="fade-up" style={{ width:"100%", maxWidth:380, textAlign:"center" }}>

        <div style={{ marginBottom:28 }}>
          <div style={{ display:"inline-flex", marginBottom:18 }}>
            <LogoMark size={56} />
          </div>
          <h1 style={{ fontSize:22, fontWeight:700, color:BRAND.text, marginBottom:5 }}>La Grandmontoise</h1>
          <p style={{ fontSize:14, color:BRAND.muted }}>Comité de programmation</p>
        </div>

        <div style={{ background:BRAND.surface, borderRadius:18, border:`1px solid ${BRAND.border}`, padding:"26px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:18 }}>
            <Lock size={13} color={BRAND.muted} />
            <span style={{ fontSize:13, color:BRAND.muted, fontWeight:500 }}>Accès restreint</span>
          </div>

          <div className={shake ? "shake" : ""}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(false); }}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                width:"100%", padding:"12px 15px", borderRadius:10,
                border:`1.5px solid ${error ? BRAND.red : BRAND.border2}`,
                background:BRAND.surface2, color:BRAND.text, fontSize:15,
                marginBottom: error ? 8 : 13, transition:"border-color 0.2s",
              }}
            />
            {error && <p style={{ color:BRAND.red, fontSize:13, textAlign:"left", marginBottom:13 }}>Mot de passe incorrect</p>}
          </div>

          <button className="btn-primary" onClick={submit} style={{
            width:"100%", padding:"12px", borderRadius:10, border:"none",
            background:BRAND.teal, color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer",
          }}>
            Connexion
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ active, setActive, menuOpen, setMenuOpen }) {
  return (
    <>
      <div style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        background:"rgba(12,16,21,0.97)", backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${BRAND.border}`,
        height:56, padding:"0 16px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <LogoMark size={30} />
          <span style={{ fontWeight:700, fontSize:15, color:BRAND.text, letterSpacing:"-0.2px" }}>
            La Grandmontoise
          </span>
        </div>

        <div className="desktop-only" style={{ display:"flex", gap:2 }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button key={id}
              className={`nav-btn ${active === id ? "active" : ""}`}
              onClick={() => setActive(id)}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"6px 11px", borderRadius:9, border:"none",
                background:"transparent",
                color: active === id ? BRAND.tealLight : BRAND.muted,
                fontSize:13, fontWeight:500, cursor:"pointer",
              }}>
              <Icon size={13} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>

        <button className="mobile-only" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background:"transparent", border:"none", color:BRAND.text, cursor:"pointer", padding:4, display:"flex" }}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-only" style={{
          position:"fixed", top:56, left:0, right:0, zIndex:99,
          background:BRAND.surface, borderBottom:`1px solid ${BRAND.border}`,
          padding:8, animation:"slideDown 0.2s ease",
        }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button key={id}
              className={`nav-btn ${active === id ? "active" : ""}`}
              onClick={() => { setActive(id); setMenuOpen(false); }}
              style={{
                display:"flex", alignItems:"center", gap:12,
                width:"100%", padding:"12px 16px", borderRadius:10,
                border:"none", background:"transparent",
                color: active === id ? BRAND.tealLight : BRAND.text,
                fontSize:15, fontWeight:500, cursor:"pointer", textAlign:"left",
              }}>
              <Icon size={17} strokeWidth={1.8} /> {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Accueil ──────────────────────────────────────────────────────────────────
function Accueil({ setActive, notes, setNotes }) {
  const [newNote, setNewNote] = useState("");
  const [adding, setAdding] = useState(false);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([...notes, { id: Date.now(), text: newNote, starred: false }]);
    setNewNote(""); setAdding(false);
  };

  return (
    <div>
      <div className="fade-up" style={{ marginBottom:26 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text, marginBottom:5 }}>
          Gestion du comité de programmation
        </h2>
        <p style={{ fontSize:14, color:BRAND.muted }}>
          Espace interne — La Grandmontoise, Saint-Gédéon
        </p>
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(148px, 1fr))",
        gap:11, marginBottom:30,
      }}>
        {CARDS.map(({ id, label, desc, Icon, color, bg }, i) => (
          <button key={id} className="card" onClick={() => setActive(id)} style={{
            background:bg, border:`1px solid ${color}28`,
            borderRadius:14, padding:"17px 15px",
            textAlign:"left", cursor:"pointer",
            animation:`fadeUp 0.4s ease ${i * 0.055}s both`,
          }}>
            <div style={{
              width:38, height:38, borderRadius:10,
              background:`${color}1e`, border:`1px solid ${color}30`,
              display:"flex", alignItems:"center", justifyContent:"center",
              marginBottom:11,
            }}>
              <Icon size={18} color={color} strokeWidth={1.8} />
            </div>
            <div style={{ color:BRAND.text, fontWeight:600, fontSize:14, marginBottom:3 }}>{label}</div>
            <div style={{ color:BRAND.muted, fontSize:12 }}>{desc}</div>
          </button>
        ))}
      </div>

      {/* Notes */}
      <div style={{ background:BRAND.surface, borderRadius:16, border:`1px solid ${BRAND.border}`, padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:BRAND.text }}>Notes</h3>
          <button className="btn-primary" onClick={() => setAdding(true)} style={{
            display:"flex", alignItems:"center", gap:5,
            background:BRAND.teal, border:"none", borderRadius:8,
            color:"#fff", fontSize:13, fontWeight:600, padding:"6px 13px", cursor:"pointer",
          }}>
            <Plus size={13} /> Ajouter
          </button>
        </div>

        {adding && (
          <div style={{ marginBottom:13 }}>
            <textarea autoFocus value={newNote} onChange={e => setNewNote(e.target.value)}
              placeholder="Nouvelle note..." rows={3}
              style={{
                width:"100%", background:BRAND.surface2,
                border:`1.5px solid ${BRAND.border2}`,
                borderRadius:10, color:BRAND.text, fontSize:14,
                padding:12, resize:"vertical", marginBottom:8,
              }}
            />
            <div style={{ display:"flex", gap:8 }}>
              <button className="btn-primary" onClick={addNote} style={{
                background:BRAND.teal, border:"none", borderRadius:8,
                color:"#fff", fontSize:13, fontWeight:600, padding:"7px 15px", cursor:"pointer",
              }}>Sauvegarder</button>
              <button className="btn-ghost" onClick={() => { setAdding(false); setNewNote(""); }} style={{
                background:"transparent", border:`1px solid ${BRAND.border2}`,
                borderRadius:8, color:BRAND.muted, fontSize:13, padding:"7px 15px", cursor:"pointer",
              }}>Annuler</button>
            </div>
          </div>
        )}

        {notes.length === 0 && !adding && (
          <p style={{ color:BRAND.faint, fontSize:14, textAlign:"center", padding:"22px 0" }}>
            Aucune note pour l'instant
          </p>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {notes.map(note => (
            <div key={note.id} style={{
              background:BRAND.surface2, borderRadius:11,
              border:`1px solid ${BRAND.border}`,
              padding:"12px 14px",
              display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10,
            }}>
              <p style={{ color:BRAND.text, fontSize:14, lineHeight:1.55, flex:1 }}>
                {note.starred && <Star size={12} color="#c9873a" fill="#c9873a" style={{ marginRight:5, verticalAlign:"middle" }} />}
                {note.text}
              </p>
              <div style={{ display:"flex", gap:3, flexShrink:0 }}>
                <button onClick={() => setNotes(notes.map(n => n.id === note.id ? {...n, starred:!n.starred} : n))}
                  style={{ background:"transparent", border:"none", cursor:"pointer", padding:4, color:BRAND.muted, display:"flex" }}>
                  <Star size={14} fill={note.starred ? "#c9873a" : "none"} color={note.starred ? "#c9873a" : BRAND.muted} />
                </button>
                <button onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                  style={{ background:"transparent", border:"none", cursor:"pointer", padding:4, color:BRAND.muted, display:"flex" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Événements ───────────────────────────────────────────────────────────────
function Evenements() {
  const [filter, setFilter] = useState("Tous");
  const filters = ["Tous", "À venir", "Passé"];
  const filtered = filter === "Tous" ? EVENEMENTS_DATA : EVENEMENTS_DATA.filter(e => e.statut === filter);

  return (
    <div className="fade-up">
      <h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text, marginBottom:5 }}>Événements</h2>
      <p style={{ fontSize:14, color:BRAND.muted, marginBottom:20 }}>Programmation passée et à venir</p>

      <div style={{ display:"flex", gap:7, marginBottom:18 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"6px 15px", borderRadius:20,
            border:`1px solid ${filter === f ? BRAND.teal : BRAND.border2}`,
            background: filter === f ? `${BRAND.teal}22` : "transparent",
            color: filter === f ? BRAND.tealLight : BRAND.muted,
            fontSize:13, fontWeight:500, cursor:"pointer",
            transition:"all 0.15s",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(ev => (
          <div key={ev.titre} style={{
            background:BRAND.surface, borderRadius:13,
            border:`1px solid ${BRAND.border}`,
            padding:"14px 17px",
            display:"flex", justifyContent:"space-between", alignItems:"center", gap:12,
          }}>
            <div>
              <div style={{ color:BRAND.text, fontWeight:600, fontSize:15, marginBottom:4 }}>{ev.titre}</div>
              <div style={{ color:BRAND.muted, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                <Calendar size={12} strokeWidth={2} />
                {new Date(ev.date).toLocaleDateString("fr-CA", { year:"numeric", month:"long", day:"numeric" })}
                <span style={{ color:BRAND.faint }}>·</span>
                {ev.type}
              </div>
            </div>
            <span style={{
              padding:"4px 11px", borderRadius:20, fontSize:12, fontWeight:600, whiteSpace:"nowrap",
              background: ev.statut === "À venir" ? "rgba(46,184,126,0.14)" : "rgba(100,110,120,0.14)",
              color: ev.statut === "À venir" ? "#2eb87e" : BRAND.muted,
              border:`1px solid ${ev.statut === "À venir" ? "#2eb87e38" : BRAND.border}`,
            }}>{ev.statut}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Membres ──────────────────────────────────────────────────────────────────
function Membres() {
  return (
    <div className="fade-up">
      <h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text, marginBottom:5 }}>Membres</h2>
      <p style={{ fontSize:14, color:BRAND.muted, marginBottom:20 }}>Coordonnées du comité</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {MEMBRES.map(m => (
          <div key={m.nom} style={{
            background:BRAND.surface, borderRadius:13,
            border:`1px solid ${BRAND.border}`,
            padding:"14px 17px",
            display:"flex", alignItems:"center", gap:13,
          }}>
            <div style={{
              width:40, height:40, borderRadius:10, flexShrink:0,
              background:`${BRAND.teal}1a`, border:`1px solid ${BRAND.teal}30`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Users size={17} color={BRAND.teal} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ color:BRAND.text, fontWeight:600, fontSize:15 }}>{m.nom}</div>
              <div style={{ color:BRAND.muted, fontSize:13 }}>{m.role}</div>
              <div style={{ color:BRAND.tealLight, fontSize:13, marginTop:2 }}>{m.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───// ─── Coming Soon ──────────────────────────────────────────────────────────────
function ComingSoon({ titre }) {
  return (
    <div className="fade-up" style={{ textAlign:"center", padding:"60px 20px" }}>
      <div style={{
        width:56, height:56, borderRadius:14,
        background:`${BRAND.teal}1a`, border:`1px solid ${BRAND.teal}30`,
        display:"flex", alignItems:"center", justifyContent:"center",
        margin:"0 auto 18px",
      }}>
        <Star size={22} color={BRAND.teal} strokeWidth={1.8} />
      </div>
      <h2 style={{ fontSize:18, fontWeight:700, color:BRAND.text, marginBottom:8 }}>{titre}</h2>
      <p style={{ fontSize:14, color:BRAND.muted }}>Cette section est en cours de développement.</p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(false);
  const [active, setActive] = useState("accueil");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notes, setNotes] = useState([]);

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  const renderPage = () => {
    switch (active) {
      case "accueil":    return <Accueil setActive={setActive} notes={notes} setNotes={setNotes} />;
      case "evenements": return <Evenements />;
      case "membres":    return <Membres />;
      case "calendrier": return <ComingSoon titre="Calendrier" />;
      case "courriels":  return <ComingSoon titre="Courriels" />;
      case "disque":     return <ComingSoon titre="Disque partagé" />;
      case "ressources": return <ComingSoon titre="Ressources" />;
      default:           return <Accueil setActive={setActive} notes={notes} setNotes={setNotes} />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <Nav active={active} setActive={setActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div style={{ paddingTop:56, minHeight:"100vh", background:BRAND.bg }}>
        <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 16px" }}>
          {renderPage()}
        </div>
      </div>
    </>
  );
} 
