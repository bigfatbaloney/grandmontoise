import { useState, useEffect, useCallback } from "react";
import {
  Home, Mail, Calendar, Drama, FolderOpen, Users, BookOpen,
  Plus, Star, Trash2, Menu, X, Lock, LogIn, RefreshCw,
  ExternalLink, AlertCircle
} from "lucide-react";
 
const APP_PASSWORD = "grandmontoise2026";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
].join(" ");
 
const BRAND = {
  teal: "#1a6b82", tealLight: "#2a8ba6", tealDark: "#124f61",
  red: "#d63030", bg: "#0c1015", surface: "#131920", surface2: "#19222b",
  border: "#1e2a33", border2: "#243040", text: "#e8eef2",
  muted: "#6b8090", faint: "#3a4e5c",
};
 
const NAV_ITEMS = [
  { id: "accueil",    label: "Accueil",    Icon: Home },
  { id: "calendrier", label: "Calendrier", Icon: Calendar },
  { id: "evenements", label: "Événements", Icon: Drama },
  { id: "courriels",  label: "Courriels",  Icon: Mail },
  { id: "disque",     label: "Disque",     Icon: FolderOpen },
  { id: "membres",    label: "Membres",    Icon: Users },
  { id: "ressources", label: "Ressources", Icon: BookOpen },
];
 
const CARDS = [
  { id: "calendrier", label: "Calendrier",     desc: "Événements & spectacles", Icon: Calendar,   color: BRAND.teal,  bg: "rgba(26,107,130,0.18)" },
  { id: "evenements", label: "Événements",     desc: "Passés et à venir",       Icon: Drama,      color: BRAND.red,   bg: "rgba(214,48,48,0.14)" },
  { id: "courriels",  label: "Courriels",      desc: "Consultation",            Icon: Mail,       color: "#4a90b8",   bg: "rgba(74,144,184,0.14)" },
  { id: "disque",     label: "Disque partagé", desc: "Documents",               Icon: FolderOpen, color: "#2eb87e",   bg: "rgba(46,184,126,0.12)" },
  { id: "membres",    label: "Membres",        desc: "Coordonnées",             Icon: Users,      color: "#c9873a",   bg: "rgba(201,135,58,0.14)" },
  { id: "ressources", label: "Ressources",     desc: "Documents & outils",      Icon: BookOpen,   color: "#8b6fc9",   bg: "rgba(139,111,201,0.14)" },
];
 
const EVENEMENTS_DATA = [
  { titre: "Ballet Synergie",                date: "2026-09-15", statut: "À venir", type: "Danse" },
  { titre: "Journée Vinyles",                date: "2026-06-21", statut: "À venir", type: "Musique" },
  { titre: "The Clamp",                      date: "2026-05-30", statut: "À venir", type: "Rock / Métal" },
  { titre: "Lou-Adriane Cassidy",            date: "2026-03-14", statut: "Passé",   type: "Chanson" },
  { titre: "Olivier Simard – Classe à part", date: "2026-02-22", statut: "Passé",   type: "Magie" },
];
 
const MEMBRES = [
  { nom: "Stéphane",      role: "Programmation & promotion", email: "stephane@lagrandmontoise.ca" },
  { nom: "Marie",         role: "Coordination",              email: "marie@lagrandmontoise.ca" },
  { nom: "Jean-François", role: "Technique",                 email: "jf@lagrandmontoise.ca" },
];
 
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${BRAND.bg}; font-family: 'DM Sans', sans-serif; color: ${BRAND.text}; }
  button, input, textarea { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${BRAND.bg}; }
  ::-webkit-scrollbar-thumb { background: ${BRAND.border2}; border-radius: 3px; }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake     { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(-7px)} 50%{transform:translateX(7px)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .fade-up   { animation: fadeUp 0.4s ease both; }
  .shake     { animation: shake 0.38s ease; }
  .spinning  { animation: spin 1s linear infinite; }
  .nav-btn   { transition: background 0.15s, color 0.15s; }
  .nav-btn:hover  { background: rgba(26,107,130,0.1) !important; color: ${BRAND.tealLight} !important; }
  .nav-btn.active { background: rgba(26,107,130,0.18) !important; color: ${BRAND.tealLight} !important; }
  .card { transition: transform 0.18s, box-shadow 0.18s; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
  .btn-primary { transition: background 0.15s; }
  .btn-primary:hover { background: ${BRAND.tealLight} !important; }
  .btn-ghost { transition: background 0.15s; }
  .btn-ghost:hover { background: rgba(255,255,255,0.05) !important; }
  input:focus, textarea:focus { outline: none; border-color: ${BRAND.teal} !important; }
  a:hover > div { border-color: ${BRAND.teal}60 !important; }
  @media (min-width: 640px) { .mobile-only { display: none !important; } }
  @media (max-width: 639px) { .desktop-only { display: none !important; } }
`;
 
// ─── Google Auth ──────────────────────────────────────────────────────────────
function useGoogleAuth() {
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem("gm_gtoken") || null);
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    const check = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        setGoogleReady(true);
        clearInterval(check);
      }
    }, 200);
    return () => clearInterval(check);
  }, []);

  const signIn = useCallback(() => {
    if (!window.google?.accounts?.oauth2) return;
    setLoading(true);
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        setLoading(false);
        if (response.access_token) {
          setAccessToken(response.access_token);
          sessionStorage.setItem("gm_gtoken", response.access_token);
        }
      },
    });
    client.requestAccessToken();
  }, []);

  const signOut = useCallback(() => {
    setAccessToken(null);
    sessionStorage.removeItem("gm_gtoken");
  }, []);

  return { accessToken, signIn, signOut, loading, googleReady };
}

async function gFetch(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}
 
async function gFetch(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}
 
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
 
// ─── ConnectBanner ────────────────────────────────────────────────────────────
function ConnectBanner({ onSignIn, loading }) {
  return (
    <div style={{ background:`${BRAND.teal}12`, border:`1px solid ${BRAND.teal}30`, borderRadius:14, padding:20, textAlign:"center", marginBottom:20 }}>
      <AlertCircle size={22} color={BRAND.teal} style={{ marginBottom:10 }} />
      <p style={{ color:BRAND.text, fontSize:14, fontWeight:600, marginBottom:5 }}>Connexion Google requise</p>
      <p style={{ color:BRAND.muted, fontSize:13, marginBottom:16, lineHeight:1.5 }}>
        Connecte le compte <strong style={{ color:BRAND.text }}>prog.grandmontoise@gmail.com</strong> pour accéder à cette section.
      </p>
      <button onClick={onSignIn} className="btn-primary" style={{
        background:BRAND.teal, border:"none", borderRadius:10, color:"#fff",
        fontSize:14, fontWeight:600, padding:"10px 22px", cursor:"pointer",
        display:"inline-flex", alignItems:"center", gap:8,
      }}>
        {loading ? <RefreshCw size={14} className="spinning" /> : <LogIn size={14} />}
        Connecter Google
      </button>
    </div>
  );
}
 
// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const submit = () => {
    if (pwd === APP_PASSWORD) { onLogin(); }
    else { setError(true); setShake(true); setTimeout(() => setShake(false), 400); }
  };
  return (
    <div style={{ minHeight:"100vh", background:BRAND.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{CSS}</style>
      <div className="fade-up" style={{ width:"100%", maxWidth:380, textAlign:"center" }}>
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"inline-flex", marginBottom:18 }}><LogoMark size={56} /></div>
          <h1 style={{ fontSize:22, fontWeight:700, color:BRAND.text, marginBottom:5 }}>La Grandmontoise</h1>
          <p style={{ fontSize:14, color:BRAND.muted }}>Comité de programmation</p>
        </div>
        <div style={{ background:BRAND.surface, borderRadius:18, border:`1px solid ${BRAND.border}`, padding:"26px 22px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:18 }}>
            <Lock size={13} color={BRAND.muted} />
            <span style={{ fontSize:13, color:BRAND.muted, fontWeight:500 }}>Accès restreint</span>
          </div>
          <div className={shake ? "shake" : ""}>
            <input type="password" placeholder="Mot de passe" value={pwd}
              onChange={e => { setPwd(e.target.value); setError(false); }}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ width:"100%", padding:"12px 15px", borderRadius:10, border:`1.5px solid ${error ? BRAND.red : BRAND.border2}`, background:BRAND.surface2, color:BRAND.text, fontSize:15, marginBottom:error?8:13, transition:"border-color 0.2s" }}
            />
            {error && <p style={{ color:BRAND.red, fontSize:13, textAlign:"left", marginBottom:13 }}>Mot de passe incorrect</p>}
          </div>
          <button className="btn-primary" onClick={submit} style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", background:BRAND.teal, color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer" }}>
            Connexion
          </button>
        </div>
      </div>
    </div>
  );
}
 
// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ active, setActive, menuOpen, setMenuOpen, accessToken, onGoogleSignIn, onGoogleSignOut, googleLoading }) {
  return (
    <>
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(12,16,21,0.97)", backdropFilter:"blur(14px)", borderBottom:`1px solid ${BRAND.border}`, height:56, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, flexShrink:0 }}>
          <LogoMark size={30} />
          <span style={{ fontWeight:700, fontSize:15, color:BRAND.text }}>La Grandmontoise</span>
        </div>
        <div className="desktop-only" style={{ display:"flex", gap:2 }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button key={id} className={`nav-btn ${active===id?"active":""}`} onClick={() => setActive(id)}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 11px", borderRadius:9, border:"none", background:"transparent", color:active===id?BRAND.tealLight:BRAND.muted, fontSize:13, fontWeight:500, cursor:"pointer" }}>
              <Icon size={13} strokeWidth={2} />{label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          {accessToken ? (
            <button onClick={onGoogleSignOut} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(46,184,126,0.15)", border:"1px solid #2eb87e40", borderRadius:8, color:"#2eb87e", fontSize:12, fontWeight:600, padding:"5px 10px", cursor:"pointer" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#2eb87e" }} /> Google
            </button>
          ) : (
            <button onClick={onGoogleSignIn} style={{ display:"flex", alignItems:"center", gap:6, background:`${BRAND.teal}22`, border:`1px solid ${BRAND.teal}40`, borderRadius:8, color:BRAND.tealLight, fontSize:12, fontWeight:600, padding:"5px 10px", cursor:"pointer" }}>
              {googleLoading ? <RefreshCw size={12} className="spinning" /> : <LogIn size={12} />} Google
            </button>
          )}
          <button className="mobile-only" onClick={() => setMenuOpen(!menuOpen)} style={{ background:"transparent", border:"none", color:BRAND.text, cursor:"pointer", padding:4, display:"flex" }}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-only" style={{ position:"fixed", top:56, left:0, right:0, zIndex:99, background:BRAND.surface, borderBottom:`1px solid ${BRAND.border}`, padding:8, animation:"slideDown 0.2s ease" }}>
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button key={id} className={`nav-btn ${active===id?"active":""}`} onClick={() => { setActive(id); setMenuOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"12px 16px", borderRadius:10, border:"none", background:"transparent", color:active===id?BRAND.tealLight:BRAND.text, fontSize:15, fontWeight:500, cursor:"pointer", textAlign:"left" }}>
              <Icon size={17} strokeWidth={1.8} />{label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
 
// ─── Courriels ────────────────────────────────────────────────────────────────
function Courriels({ accessToken, onSignIn, googleLoading }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
 
  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true); setError(null);
    try {
      const list = await gFetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20&labelIds=INBOX", accessToken);
      const details = await Promise.all((list.messages||[]).map(m =>
        gFetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, accessToken)
      ));
      setEmails(details.map(m => {
        const h = m.payload?.headers || [];
        const g = n => h.find(x => x.name===n)?.value || "";
        return { id:m.id, subject:g("Subject")||"(Sans objet)", from:g("From"), date:g("Date"), snippet:m.snippet };
      }));
    } catch { setError("Impossible de charger les courriels. Le token est peut-être expiré."); }
    setLoading(false);
  }, [accessToken]);
 
  useEffect(() => { load(); }, [load]);
 
  if (!accessToken) return <div className="fade-up"><h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text, marginBottom:20 }}>Courriels</h2><ConnectBanner onSignIn={onSignIn} loading={googleLoading} /></div>;
 
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text }}>Courriels</h2>
        <button onClick={load} style={{ background:"transparent", border:"none", cursor:"pointer", color:BRAND.muted, display:"flex" }}>
          <RefreshCw size={16} className={loading?"spinning":""} />
        </button>
      </div>
      {error && <p style={{ color:BRAND.red, fontSize:13, marginBottom:16, background:"rgba(214,48,48,0.1)", padding:"10px 14px", borderRadius:10 }}>{error}</p>}
      {loading && !emails.length && <div style={{ textAlign:"center", padding:"40px 0", color:BRAND.muted }}><RefreshCw size={24} className="spinning" style={{ margin:"0 auto 12px" }} /><p style={{ fontSize:14 }}>Chargement...</p></div>}
      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} className="btn-ghost" style={{ background:"transparent", border:`1px solid ${BRAND.border2}`, borderRadius:8, color:BRAND.muted, fontSize:13, padding:"6px 14px", cursor:"pointer", marginBottom:16 }}>← Retour</button>
          <div style={{ background:BRAND.surface, borderRadius:14, border:`1px solid ${BRAND.border}`, padding:20 }}>
            <h3 style={{ color:BRAND.text, fontSize:16, fontWeight:700, marginBottom:8 }}>{selected.subject}</h3>
            <p style={{ color:BRAND.muted, fontSize:13, marginBottom:4 }}>De : {selected.from}</p>
            <p style={{ color:BRAND.muted, fontSize:13, marginBottom:16 }}>{selected.date}</p>
            <p style={{ color:BRAND.text, fontSize:14, lineHeight:1.7 }}>{selected.snippet}</p>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {emails.map(e => (
            <button key={e.id} onClick={() => setSelected(e)} style={{ background:BRAND.surface, borderRadius:13, border:`1px solid ${BRAND.border}`, padding:"14px 17px", textAlign:"left", cursor:"pointer", width:"100%", transition:"border-color 0.15s" }}>
              <div style={{ color:BRAND.text, fontWeight:600, fontSize:14, marginBottom:3 }}>{e.subject}</div>
              <div style={{ color:BRAND.muted, fontSize:12, marginBottom:5 }}>{e.from}</div>
              <div style={{ color:BRAND.faint, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.snippet}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
 
// ─── Calendrier ───────────────────────────────────────────────────────────────
function Calendrier({ accessToken, onSignIn, googleLoading }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true); setError(null);
    try {
      const now = new Date().toISOString();
      const data = await gFetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=20&singleEvents=true&orderBy=startTime`, accessToken);
      setEvents(data.items || []);
    } catch { setError("Impossible de charger le calendrier."); }
    setLoading(false);
  }, [accessToken]);
 
  useEffect(() => { load(); }, [load]);
 
  if (!accessToken) return <div className="fade-up"><h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text, marginBottom:20 }}>Calendrier</h2><ConnectBanner onSignIn={onSignIn} loading={googleLoading} /></div>;
 
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text }}>Calendrier</h2>
        <button onClick={load} style={{ background:"transparent", border:"none", cursor:"pointer", color:BRAND.muted, display:"flex" }}>
          <RefreshCw size={16} className={loading?"spinning":""} />
        </button>
      </div>
      {error && <p style={{ color:BRAND.red, fontSize:13, marginBottom:16, background:"rgba(214,48,48,0.1)", padding:"10px 14px", borderRadius:10 }}>{error}</p>}
      {loading && !events.length && <div style={{ textAlign:"center", padding:"40px 0", color:BRAND.muted }}><RefreshCw size={24} className="spinning" style={{ margin:"0 auto 12px" }} /><p style={{ fontSize:14 }}>Chargement...</p></div>}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {events.map(ev => {
          const start = ev.start?.dateTime || ev.start?.date;
          const date = start ? new Date(start).toLocaleDateString("fr-CA", { weekday:"long", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit" }) : "";
          return (
            <div key={ev.id} style={{ background:BRAND.surface, borderRadius:13, border:`1px solid ${BRAND.border}`, padding:"14px 17px" }}>
              <div style={{ color:BRAND.text, fontWeight:600, fontSize:15, marginBottom:4 }}>{ev.summary || "(Sans titre)"}</div>
              <div style={{ color:BRAND.muted, fontSize:13, display:"flex", alignItems:"center", gap:6 }}><Calendar size={12} />{date}</div>
              {ev.location && <div style={{ color:BRAND.faint, fontSize:12, marginTop:4 }}>📍 {ev.location}</div>}
              {ev.description && <div style={{ color:BRAND.muted, fontSize:12, marginTop:6, lineHeight:1.5 }}>{ev.description.substring(0,120)}{ev.description.length>120?"…":""}</div>}
            </div>
          );
        })}
        {!loading && events.length === 0 && <p style={{ color:BRAND.faint, fontSize:14, textAlign:"center", padding:"40px 0" }}>Aucun événement à venir</p>}
      </div>
    </div>
  );
}
 
// ─── Disque ───────────────────────────────────────────────────────────────────
function Disque({ accessToken, onSignIn, googleLoading }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true); setError(null);
    try {
      const data = await gFetch("https://www.googleapis.com/drive/v3/files?pageSize=30&fields=files(id,name,mimeType,modifiedTime,webViewLink)&orderBy=modifiedTime desc", accessToken);
      setFiles(data.files || []);
    } catch { setError("Impossible de charger le disque."); }
    setLoading(false);
  }, [accessToken]);
 
  useEffect(() => { load(); }, [load]);
 
  const icon = (mime) => {
    if (mime?.includes("folder")) return "📁";
    if (mime?.includes("document")||mime?.includes("word")) return "📄";
    if (mime?.includes("spreadsheet")||mime?.includes("excel")) return "📊";
    if (mime?.includes("presentation")||mime?.includes("powerpoint")) return "📽️";
    if (mime?.includes("pdf")) return "📕";
    if (mime?.includes("image")) return "🖼️";
    return "📎";
  };
 
  if (!accessToken) return <div className="fade-up"><h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text, marginBottom:20 }}>Disque partagé</h2><ConnectBanner onSignIn={onSignIn} loading={googleLoading} /></div>;
 
  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text }}>Disque partagé</h2>
        <button onClick={load} style={{ background:"transparent", border:"none", cursor:"pointer", color:BRAND.muted, display:"flex" }}>
          <RefreshCw size={16} className={loading?"spinning":""} />
        </button>
      </div>
      {error && <p style={{ color:BRAND.red, fontSize:13, marginBottom:16, background:"rgba(214,48,48,0.1)", padding:"10px 14px", borderRadius:10 }}>{error}</p>}
      {loading && !files.length && <div style={{ textAlign:"center", padding:"40px 0", color:BRAND.muted }}><RefreshCw size={24} className="spinning" style={{ margin:"0 auto 12px" }} /><p style={{ fontSize:14 }}>Chargement...</p></div>}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {files.map(f => (
          <a key={f.id} href={f.webViewLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
            <div style={{ background:BRAND.surface, borderRadius:13, border:`1px solid ${BRAND.border}`, padding:"13px 17px", display:"flex", alignItems:"center", gap:12, transition:"border-color 0.15s" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>{icon(f.mimeType)}</span>
              <div style={{ flex:1, overflow:"hidden" }}>
                <div style={{ color:BRAND.text, fontWeight:500, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                <div style={{ color:BRAND.muted, fontSize:12, marginTop:2 }}>{f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString("fr-CA") : ""}</div>
              </div>
              <ExternalLink size={14} color={BRAND.faint} style={{ flexShrink:0 }} />
            </div>
          </a>
        ))}
        {!loading && files.length === 0 && <p style={{ color:BRAND.faint, fontSize:14, textAlign:"center", padding:"40px 0" }}>Aucun fichier trouvé</p>}
      </div>
    </div>
  );
}
 
// ─── Accueil ──────────────────────────────────────────────────────────────────
function Accueil({ setActive, notes, setNotes }) {
  const [newNote, setNewNote] = useState("");
  const [adding, setAdding] = useState(false);
  const addNote = () => { if (!newNote.trim()) return; setNotes([...notes, { id:Date.now(), text:newNote, starred:false }]); setNewNote(""); setAdding(false); };
 
  return (
    <div>
      <div className="fade-up" style={{ marginBottom:26 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text, marginBottom:5 }}>Gestion du comité de programmation</h2>
        <p style={{ fontSize:14, color:BRAND.muted }}>Espace interne — La Grandmontoise, Saint-Gédéon</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(148px, 1fr))", gap:11, marginBottom:30 }}>
        {CARDS.map(({ id, label, desc, Icon, color, bg }, i) => (
          <button key={id} className="card" onClick={() => setActive(id)} style={{ background:bg, border:`1px solid ${color}28`, borderRadius:14, padding:"17px 15px", textAlign:"left", cursor:"pointer", animation:`fadeUp 0.4s ease ${i*0.055}s both` }}>
            <div style={{ width:38, height:38, borderRadius:10, background:`${color}1e`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:11 }}>
              <Icon size={18} color={color} strokeWidth={1.8} />
            </div>
            <div style={{ color:BRAND.text, fontWeight:600, fontSize:14, marginBottom:3 }}>{label}</div>
            <div style={{ color:BRAND.muted, fontSize:12 }}>{desc}</div>
          </button>
        ))}
      </div>
      <div style={{ background:BRAND.surface, borderRadius:16, border:`1px solid ${BRAND.border}`, padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:BRAND.text }}>Notes</h3>
          <button className="btn-primary" onClick={() => setAdding(true)} style={{ display:"flex", alignItems:"center", gap:5, background:BRAND.teal, border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:600, padding:"6px 13px", cursor:"pointer" }}>
            <Plus size={13} /> Ajouter
          </button>
        </div>
        {adding && (
          <div style={{ marginBottom:13 }}>
            <textarea autoFocus value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Nouvelle note..." rows={3}
              style={{ width:"100%", background:BRAND.surface2, border:`1.5px solid ${BRAND.border2}`, borderRadius:10, color:BRAND.text, fontSize:14, padding:12, resize:"vertical", marginBottom:8 }} />
            <div style={{ display:"flex", gap:8 }}>
              <button className="btn-primary" onClick={addNote} style={{ background:BRAND.teal, border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:600, padding:"7px 15px", cursor:"pointer" }}>Sauvegarder</button>
              <button className="btn-ghost" onClick={() => { setAdding(false); setNewNote(""); }} style={{ background:"transparent", border:`1px solid ${BRAND.border2}`, borderRadius:8, color:BRAND.muted, fontSize:13, padding:"7px 15px", cursor:"pointer" }}>Annuler</button>
            </div>
          </div>
        )}
        {notes.length===0 && !adding && <p style={{ color:BRAND.faint, fontSize:14, textAlign:"center", padding:"22px 0" }}>Aucune note pour l'instant</p>}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {notes.map(note => (
            <div key={note.id} style={{ background:BRAND.surface2, borderRadius:11, border:`1px solid ${BRAND.border}`, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
              <p style={{ color:BRAND.text, fontSize:14, lineHeight:1.55, flex:1 }}>
                {note.starred && <Star size={12} color="#c9873a" fill="#c9873a" style={{ marginRight:5, verticalAlign:"middle" }} />}{note.text}
              </p>
              <div style={{ display:"flex", gap:3, flexShrink:0 }}>
                <button onClick={() => setNotes(notes.map(n => n.id===note.id?{...n,starred:!n.starred}:n))} style={{ background:"transparent", border:"none", cursor:"pointer", padding:4, display:"flex" }}>
                  <Star size={14} fill={note.starred?"#c9873a":"none"} color={note.starred?"#c9873a":BRAND.muted} />
                </button>
                <button onClick={() => setNotes(notes.filter(n => n.id!==note.id))} style={{ background:"transparent", border:"none", cursor:"pointer", padding:4, display:"flex", color:BRAND.muted }}>
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
  const filtered = filter==="Tous" ? EVENEMENTS_DATA : EVENEMENTS_DATA.filter(e => e.statut===filter);
  return (
    <div className="fade-up">
      <h2 style={{ fontSize:20, fontWeight:700, color:BRAND.text, marginBottom:5 }}>Événements</h2>
      <p style={{ fontSize:14, color:BRAND.muted, marginBottom:20 }}>Programmation passée et à venir</p>
      <div style={{ display:"flex", gap:7, marginBottom:18 }}>
        {filters.map(f => <button key={f} onClick={() => setFilter(f)} style={{ padding:"6px 15px", borderRadius:20, border:`1px solid ${filter===f?BRAND.teal:BRAND.border2}`, background:filter===f?`${BRAND.teal}22`:"transparent", color:filter===f?BRAND.tealLight:BRAND.muted, fontSize:13, fontWeight:500, cursor:"pointer", transition:"all 0.15s" }}>{f}</button>)}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(ev => (
          <div key={ev.titre} style={{ background:BRAND.surface, borderRadius:13, border:`1px solid ${BRAND.border}`, padding:"14px 17px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
            <div>
              <div style={{ color:BRAND.text, fontWeight:600, fontSize:15, marginBottom:4 }}>{ev.titre}</div>
              <div style={{ color:BRAND.muted, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                <Calendar size={12} />{new Date(ev.date).toLocaleDateString("fr-CA", { year:"numeric", month:"long", day:"numeric" })}<span style={{ color:BRAND.faint }}>·</span>{ev.type}
              </div>
            </div>
            <span style={{ padding:"4px 11px", borderRadius:20, fontSize:12, fontWeight:600, whiteSpace:"nowrap", background:ev.statut==="À venir"?"rgba(46,184,126,0.14)":"rgba(100,110,120,0.14)", color:ev.statut==="À venir"?"#2eb87e":BRAND.muted, border:`1px solid ${ev.statut==="À venir"?"#2eb87e38":BRAND.border}` }}>{ev.statut}</span>
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
          <div key={m.nom} style={{ background:BRAND.surface, borderRadius:13, border:`1px solid ${BRAND.border}`, padding:"14px 17px", display:"flex", alignItems:"center", gap:13 }}>
            <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, background:`${BRAND.teal}1a`, border:`1px solid ${BRAND.teal}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
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
 
// ─── Ressources ───────────────────────────────────────────────────────────────
function Ressources() {
  return (
    <div className="fade-up" style={{ textAlign:"center", padding:"68px 20px" }}>
      <div style={{ width:60, height:60, borderRadius:17, margin:"0 auto 18px", background:`${BRAND.teal}16`, border:`1px solid ${BRAND.teal}30`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <BookOpen size={26} color={BRAND.teal} strokeWidth={1.6} />
      </div>
      <h2 style={{ fontSize:19, fontWeight:700, color:BRAND.text, marginBottom:8 }}>Ressources</h2>
      <p style={{ fontSize:14, color:BRAND.muted, maxWidth:300, margin:"0 auto 20px", lineHeight:1.6 }}>Documents et outils pour le comité de programmation.</p>
      <span style={{ display:"inline-block", background:`${BRAND.teal}16`, border:`1px solid ${BRAND.teal}38`, color:BRAND.tealLight, borderRadius:20, padding:"5px 17px", fontSize:13, fontWeight:500 }}>En construction</span>
    </div>
  );
}
 
// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => { try { return sessionStorage.getItem("gm_auth")==="1"; } catch { return false; } });
  const [active, setActive] = useState("accueil");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notes, setNotes] = useState([{ id:1, text:"Items à acquérir : Bouilloire, Pichets", starred:true }]);
  const { accessToken, signIn, signOut, loading: googleLoading } = useGoogleAuth();
 
  useEffect(() => {
    if (document.getElementById("gsi-script")) return;
    const s = document.createElement("script");
    s.id = "gsi-script";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    document.head.appendChild(s);
  }, []);
 
  const handleLogin = () => { try { sessionStorage.setItem("gm_auth","1"); } catch {} setLoggedIn(true); };
 
  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;
 
  const gProps = { accessToken, onSignIn: signIn, googleLoading };
 
  const renderPage = () => {
    switch(active) {
      case "accueil":    return <Accueil setActive={setActive} notes={notes} setNotes={setNotes} />;
      case "evenements": return <Evenements />;
      case "membres":    return <Membres />;
      case "calendrier": return <Calendrier {...gProps} />;
      case "courriels":  return <Courriels {...gProps} />;
      case "disque":     return <Disque {...gProps} />;
      case "ressources": return <Ressources />;
      default: return null;
    }
  };
 
  return (
    <div style={{ minHeight:"100vh", background:BRAND.bg }}>
      <style>{CSS}</style>
      <Nav active={active} setActive={setActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        accessToken={accessToken} onGoogleSignIn={signIn} onGoogleSignOut={signOut} googleLoading={googleLoading} />
      <main style={{ maxWidth:860, margin:"0 auto", padding:"76px 16px 48px" }}>
        {renderPage()}
      </main>
    </div>
  );
}
