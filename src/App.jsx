import { useState, useRef, useEffect } from "react";

// ─── TELEGRAM ────────────────────────────────────────────────
const TG_TOKEN = "8818966168:AAFBJYFYeZUdhjtPBzkjn42Bl7N8_fsMmmI";
const TG_CHAT  = "-5048491327";

// ─── OBJEKTI ─────────────────────────────────────────────────
const OBJEKTI = [
  { nos:'Biedrība "Ģ.Baloža 15"',      adrese:"Ģ.Baloža iela 15-40, Liepāja" },
  { nos:'Biedrība "Ventspils-55"',      adrese:"Ventspils iela 55-10, Liepāja" },
  { nos:'Dzīb "Četri vītoli"',          adrese:"Vītolu iela 4-8, Liepāja" },
  { nos:'SIA "Unihouse"',               adrese:"Lāčplēša iela 38-5, Liepāja" },
  { nos:"Daiga Āreniece",               adrese:"Lāčplēša iela 38-5, Liepāja" },
  { nos:'Biedrība "Klaipēdas 104"',     adrese:"Klaipēdas iela 104-6, Liepāja" },
  { nos:'Biedrība "Zāļu 3a"',           adrese:"Zāļu iela 3a-6, Liepāja" },
  { nos:'Dzīb "Toma 4"',                adrese:"Toma iela 4-2, Liepāja" },
  { nos:'Dzīb "Liepas 89"',             adrese:"Brīvības iela 89-5, Liepāja" },
  { nos:"Dzintarnams DzĪB",             adrese:"Dzintaru iela 3/5-2a, Liepāja" },
  { nos:'Biedrība "Dārza 46"',          adrese:"Dārza iela 46-30, Liepāja" },
  { nos:'Dzīb "Endrupe"',               adrese:"Kapsētas iela 25-15, Liepāja" },
  { nos:'Biedrība "Šķēdes 15"',         adrese:"Šķēdes iela 15-22, Liepāja" },
  { nos:'Biedrība "Aldaru 26/28"',      adrese:"Aldaru iela 26/28-11, Liepāja" },
  { nos:'Biedrība "Krūmu 55"',          adrese:"Krūmu iela 55-36, Liepāja" },
  { nos:'Dzīb "Pastmarka"',             adrese:"Pasta iela 1-5, Liepāja" },
  { nos:'ĪB "Bāriņu 16"',               adrese:"Bāriņu iela 16-8, Liepāja" },
  { nos:'Biedrība "Alejas 43"',         adrese:"Alejas iela 43-7a, Liepāja" },
  { nos:'Dzīb "Jūras 5"',               adrese:"Jūras iela 5-16, Liepāja" },
  { nos:'Biedrība "Avotu-11"',          adrese:"Avotu iela 11-1, Liepāja" },
  { nos:'Biedrība "Koku 3"',            adrese:"Koku iela 3-57, Liepāja" },
  { nos:'ĪB "Šķēdes 11"',               adrese:"Šķēdes iela 11-45, Liepāja" },
  { nos:'Biedrība "DMK Pārvalde - 1"',  adrese:"Lāčplēša iela 38-5, Liepāja" },
  { nos:'Biedrība "2.Brāļi"',           adrese:"1905. gada iela 46-7/8, Liepāja" },
  { nos:'ĪB "STARS 41"',                adrese:"Mežu iela 41-60, Liepāja" },
  { nos:'Biedrība "Ķieģelis"',          adrese:"Siļķu iela 20a-34, Liepāja" },
  { nos:'ĪB "SKRUNDA 20"',              adrese:"Skrundas iela 20-44, Liepāja" },
  { nos:'Biedrība "JŪRMALA 24-28"',     adrese:"Jūrmalas iela 24/28-22, Liepāja" },
  { nos:'Biedrība "Klaipēdas 16a"',     adrese:"Klaipēdas iela 16a-10, Liepāja" },
  { nos:'Biedrība "Kalpaka 62"',        adrese:"O.Kalpaka iela 62-38, Liepāja" },
];

const KATEGORIJAS = [
  { id:"sant",  label:"Santehnika",       icon:"🔧" },
  { id:"elek",  label:"Elektrika",        icon:"⚡" },
  { id:"apk",   label:"Apkure & Ventil.", icon:"🌡️" },
  { id:"buv",   label:"Būvdarbi",         icon:"🏗️" },
  { id:"logi",  label:"Logi & Durvis",    icon:"🪟" },
  { id:"jumts", label:"Jumts & Fasāde",   icon:"🏠" },
  { id:"mur",   label:"Mūrdarbi",         icon:"🧱" },
  { id:"gald",  label:"Galdniecība",      icon:"🪚" },
  { id:"teh",   label:"Tehn. apkope",     icon:"⚙️" },
  { id:"cits",  label:"Citi darbi",       icon:"📦" },
];

const VEIKALI  = ["DEPO","SANISTAL","KSENUKAI","STORENT","AKVEDUKTS","UPTK","KURŠI","Cits"];
const STATUSI  = [
  { value:"pabeigts",   label:"Pabeigts",   icon:"✓", color:"#16a34a", bg:"#f0fdf4", border:"#86efac" },
  { value:"nepabeigts", label:"Nepabeigts", icon:"⏳", color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  { value:"turpinams",  label:"Jāturpina",  icon:"↻", color:"#2563eb", bg:"#eff6ff", border:"#93c5fd" },
];
const DARBINIEKI = ["Aigars","Valdis"];

const NAVY = "#0d2137";
const NAVY2 = "#163352";
const ORNG  = "#e8521a";
const RED   = "#dc2626";

const getToday = () => new Date().toISOString().split("T")[0];
const isNight  = () => { const h = new Date().getHours(); return h >= 21 || h < 7; };
const emptyMat = () => ({ nosaukums:"", veikals:"", cena:"", kopejsCeks:false, objektiSaraksts:"" });
const emptyForm = () => ({
  darbinieki:[], kategorijas:[], selectedObjekts:null, objekts:"",
  datums:getToday(), laiks_no:"", laiks_lidz:"", statuss:"",
  darba_apraksts:"", avarija:false, nakts:false,
  materiali:false, materiali_saraksts:[emptyMat()], pieziimes:"", foto:[],
});

// ─── STORAGE ─────────────────────────────────────────────────
function lsGet(k, f) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; }
  catch { return f; }
}
function lsSet(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

// ─── HELPERS ─────────────────────────────────────────────────
function calcHours(no, lidz) {
  if (!no || !lidz) return null;
  const [h1,m1] = no.split(":").map(Number);
  const [h2,m2] = lidz.split(":").map(Number);
  const d = (h2*60+m2) - (h1*60+m1);
  return d > 0 ? `${Math.floor(d/60)}h${d%60 ? " "+d%60+"min" : ""}` : null;
}

async function resizeImage(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h*MAX/w); w = MAX; }
          else { w = Math.round(w*MAX/h); h = MAX; }
        }
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        res(c.toDataURL("image/jpeg", 0.72));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  });
}

// ─── TELEGRAM SEND ───────────────────────────────────────────
function formatReport(f) {
  const hours = calcHours(f.laiks_no, f.laiks_lidz);
  const st    = STATUSI.find(s => s.value === f.statuss);
  const kats  = (f.kategorijas||[]).map(id => KATEGORIJAS.find(k => k.id===id)).filter(Boolean).map(k => k.icon+" "+k.label).join(", ");
  const mats  = (f.materiali && f.materiali_saraksts || []).filter(m => m.nosaukums);
  const obj   = f.selectedObjekts ? `${f.selectedObjekts.nos}\n📌 ${f.selectedObjekts.adrese}` : f.objekts;

  let t = "";
  if (f.avarija) {
    t += f.nakts ? "🚨🌙 *AVĀRIJAS IZSAUKUMS — NAKTS*\n" : "🚨 *AVĀRIJAS IZSAUKUMS*\n";
    t += "━━━━━━━━━━━━━━━━━━\n";
  } else {
    t += "🏢 *UNIWORKS — DARBA ATSKAITE*\n━━━━━━━━━━━━━━━━━━\n";
  }
  t += `👷 ${f.darbinieki.join(" & ")}\n`;
  t += `📍 ${obj}\n`;
  t += `📅 ${f.datums}`;
  if (f.laiks_no && f.laiks_lidz) t += ` · ${f.laiks_no}–${f.laiks_lidz}`;
  if (hours) t += ` _(${hours})_`;
  t += "\n";
  if (kats) t += `🔧 ${kats}\n`;
  t += `${st ? st.icon+" *"+st.label+"*" : "?"}\n\n`;
  t += `📝 ${f.darba_apraksts}`;
  if (mats.length) {
    t += "\n\n🧱 *Materiāli:*\n";
    mats.forEach(m => {
      t += `• ${m.nosaukums}`;
      if (m.veikals) t += ` — ${m.veikals}`;
      if (m.cena)    t += ` — €${m.cena}`;
      if (m.kopejsCeks && m.objektiSaraksts) t += ` _(kopējs čeks: ${m.objektiSaraksts})_`;
      t += "\n";
    });
  }
  if (f.pieziimes) t += `\n💬 _${f.pieziimes}_`;
  t += "\n━━━━━━━━━━━━━━━━━━";
  return t;
}

async function sendTelegram(report) {
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text: formatReport(report), parse_mode: "Markdown" }),
    });
    for (const b64 of (report.foto || [])) {
      const blob = await (await fetch(b64)).blob();
      const fd = new FormData();
      fd.append("chat_id", TG_CHAT);
      fd.append("photo", blob, "photo.jpg");
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, { method: "POST", body: fd });
    }
    return true;
  } catch { return false; }
}

// ─── ANIMATED BUILDING ───────────────────────────────────────
function BuildingBg() {
  const [lit, setLit] = useState(() => Array.from({length:40}, () => Math.random() > 0.45));
  useEffect(() => {
    const id = setInterval(() => {
      setLit(p => { const n=[...p]; const i=Math.floor(Math.random()*n.length); n[i]=!n[i]; return n; });
    }, 800);
    return () => clearInterval(id);
  }, []);
  const cols=8, rows=5, W=44, H=28, GX=6, GY=6;
  const tw = cols*W+(cols-1)*GX, th = rows*H+(rows-1)*GY;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${tw+40} ${th+60}`}
      preserveAspectRatio="xMidYMid slice"
      style={{position:"absolute",inset:0,opacity:0.18,pointerEvents:"none"}}>
      {Array.from({length:rows}, (_,row) => Array.from({length:cols}, (_,col) => {
        const idx=row*cols+col, x=20+col*(W+GX), y=10+row*(H+GY), on=lit[idx];
        return (
          <g key={idx}>
            <rect x={x} y={y} width={W} height={H} rx="3"
              fill={on?"#fbbf24":"white"} opacity={on?0.85:0.08}
              style={{transition:"all 0.9s ease"}}/>
            {on && <>
              <rect x={x+W/2-0.5} y={y} width="1" height={H} fill="rgba(0,0,0,0.15)"/>
              <rect x={x} y={y+H/2-0.5} width={W} height="1" fill="rgba(0,0,0,0.12)"/>
            </>}
          </g>
        );
      }))}
      <rect x="60" y="2" width="4" height="12" rx="2" fill="white" opacity="0.15"/>
      <circle cx="62" cy="2" r="2" fill="#ef4444" opacity="0.6"/>
    </svg>
  );
}

// ─── SHARED UI ───────────────────────────────────────────────
const Logo = () => (
  <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill={ORNG}/>
    <path d="M7 11L7 23L12 27L18 23L24 27L29 23L29 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M12 17L12 27" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M24 17L24 27" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M15 21L21 21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Toggle = ({ on, onClick, color=ORNG }) => (
  <button onClick={onClick} style={{width:46,height:26,borderRadius:13,background:on?color:"#cbd5e1",border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
    <div style={{position:"absolute",top:3,left:on?22:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
  </button>
);

const NavBar = ({ title, sub, back, red }) => (
  <div style={{background:red?`linear-gradient(135deg,${RED},#991b1b)`:`linear-gradient(135deg,${NAVY},${NAVY2})`,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:20,boxShadow:"0 2px 12px rgba(13,33,55,0.2)"}}>
    {back && <button onClick={back} style={{background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",width:36,height:36,borderRadius:10,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>←</button>}
    <Logo/>
    <div style={{flex:1}}>
      <div style={{color:"#fff",fontSize:15,fontWeight:700,lineHeight:1.3}}>{title}</div>
      {sub && <div style={{color:"rgba(255,255,255,0.45)",fontSize:12}}>{sub}</div>}
    </div>
  </div>
);

const card = {background:"#fff",borderRadius:16,border:"1px solid #eaecf0",padding:"18px 20px",marginBottom:12,boxShadow:"0 1px 4px rgba(13,33,55,0.05)"};
const inp  = {width:"100%",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,padding:"12px 14px",color:NAVY,fontSize:15,boxSizing:"border-box",outline:"none",fontFamily:"inherit",marginBottom:12};
const lbl  = {fontSize:13,color:"#64748b",marginBottom:6,display:"block",fontWeight:500};
const sLbl = {fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14,display:"block"};

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [view,setView]           = useState("menu");
  const [reports,setReports]     = useState(() => lsGet("uw_v3", []));
  const [done,setDone]           = useState(false);
  const [sending,setSending]     = useState(false);
  const [tgOk,setTgOk]           = useState(null);
  const [form,setForm]           = useState(emptyForm());
  const [showModal,setShowModal] = useState(false);
  const [q,setQ]                 = useState("");
  const [lightbox,setLightbox]   = useState(null);
  const [uploading,setUploading] = useState(false);
  const fileRef = useRef();

  function saveReports(list) { lsSet("uw_v3", list); setReports(list); }
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const toggleWorker = name => {
    const c = form.darbinieki;
    set("darbinieki", c.includes(name) ? c.filter(d=>d!==name) : [...c,name]);
  };
  const toggleKat = id => {
    const c = form.kategorijas;
    set("kategorijas", c.includes(id) ? c.filter(k=>k!==id) : [...c,id]);
  };
  const updateMat = (i,k,v) => {
    const a = [...form.materiali_saraksts]; a[i]={...a[i],[k]:v};
    set("materiali_saraksts", a);
  };

  function selectObj(o) {
    setForm(f => ({...f, selectedObjekts:o, objekts:o?o.adrese:""}));
    setShowModal(false); setQ("");
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploading(true);
    const r = await Promise.all(files.map(resizeImage));
    set("foto", [...form.foto, ...r]);
    setUploading(false); e.target.value = "";
  }

  async function submit() {
    setSending(true);
    const r = {...form, id:Date.now(), iesniegts:new Date().toISOString()};
    saveReports([r, ...reports]);
    const ok = await sendTelegram(r);
    setTgOk(ok); setSending(false); setDone(true);
  }

  function newForm(av=false) {
    setForm({...emptyForm(), avarija:av, nakts:av?isNight():false});
    setDone(false); setTgOk(null); setView("form");
  }

  const canSubmit = form.darbinieki.length>0 && (form.selectedObjekts||form.objekts) && form.statuss && form.darba_apraksts;
  const hours = calcHours(form.laiks_no, form.laiks_lidz);
  const filtered = OBJEKTI.filter(o =>
    o.nos.toLowerCase().includes(q.toLowerCase()) ||
    o.adrese.toLowerCase().includes(q.toLowerCase())
  );

  const PhotoGrid = ({photos, onRemove}) => (
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
      {photos.map((src,i) => (
        <div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",border:"1.5px solid #e2e8f0"}}>
          <img src={src} alt="" onClick={()=>setLightbox(src)} style={{width:"100%",height:"100%",objectFit:"cover",cursor:"pointer",display:"block"}}/>
          {onRemove && <button onClick={()=>onRemove(i)} style={{position:"absolute",top:5,right:5,width:24,height:24,borderRadius:"50%",background:"rgba(13,33,55,0.7)",border:"none",color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
        </div>
      ))}
    </div>
  );

  // LIGHTBOX
  if (lightbox) return (
    <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <img src={lightbox} alt="" style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}}/>
      <button onClick={()=>setLightbox(null)} style={{position:"absolute",top:20,right:20,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:"50%",width:40,height:40,fontSize:20,cursor:"pointer"}}>✕</button>
    </div>
  );

  // OBJEKTS MODAL
  if (showModal) return (
    <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",flexDirection:"column",background:"#f1f5f9",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <NavBar title="Izvēlēties objektu" sub={`${OBJEKTI.length} objekti`} back={()=>{setShowModal(false);setQ("");}}/>
      <div style={{padding:"12px 16px",background:"#fff",borderBottom:"1px solid #e2e8f0",flexShrink:0}}>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
          placeholder="🔍 Meklēt pēc nosaukuma vai adreses..."
          style={{...inp,marginBottom:0}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 16px 32px"}}>
        {filtered.map((o,i) => (
          <div key={i} onClick={()=>selectObj(o)} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"14px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${ORNG}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏗️</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:14,color:NAVY,lineHeight:1.3,marginBottom:2}}>{o.nos}</div>
              <div style={{fontSize:12,color:"#64748b",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.adrese}</div>
            </div>
            <div style={{color:"#cbd5e1",fontSize:20,flexShrink:0}}>›</div>
          </div>
        ))}
        <div onClick={()=>selectObj(null)} style={{background:"#f8fafc",border:"1.5px dashed #e2e8f0",borderRadius:14,padding:"14px 16px",marginTop:4,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:12,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>✏️</div>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:"#475569",marginBottom:2}}>Cits objekts</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>Ievadīt manuāli</div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── MENU ─────────────────────────────────────────────────
  if (view==="menu") return (
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <div style={{position:"relative",background:`linear-gradient(160deg,${NAVY} 0%,${NAVY2} 100%)`,overflow:"hidden",paddingBottom:32}}>
        <BuildingBg/>
        <div style={{position:"relative",padding:"16px 20px 0",display:"flex",alignItems:"center",gap:12}}>
          <Logo/>
          <div>
            <div style={{color:"#fff",fontSize:20,fontWeight:800,letterSpacing:"-0.03em",lineHeight:1.1}}>UniWorks</div>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:10.5,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:1}}>Ēku apsaimniekošana · Avārijas dienests</div>
          </div>
          <div style={{marginLeft:"auto",background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"4px 10px",border:"1px solid rgba(255,255,255,0.12)"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Šodien</div>
            <div style={{fontSize:13,color:"#fff",fontWeight:700,marginTop:1}}>{reports.filter(r=>r.datums===getToday()).length} atskaites</div>
          </div>
        </div>
        <div style={{position:"relative",padding:"20px 20px 0"}}>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{new Date().toLocaleDateString("lv-LV",{weekday:"long"})}</div>
          <div style={{color:"#fff",fontSize:26,fontWeight:800,letterSpacing:"-0.03em"}}>{new Date().toLocaleDateString("lv-LV",{day:"numeric",month:"long"})}</div>
        </div>
      </div>

      <div style={{padding:"0 16px 40px",marginTop:-16}}>
        <div onClick={()=>newForm(false)} style={{background:`linear-gradient(135deg,${ORNG},#ff6b35)`,borderRadius:20,padding:"20px 22px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:16,boxShadow:`0 10px 30px rgba(232,82,26,0.4)`}}>
          <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>📋</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:18,color:"#fff",letterSpacing:"-0.02em",marginBottom:2}}>Jauna atskaite</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Standarta darba pārskats</div>
          </div>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:24}}>›</div>
        </div>

        <div onClick={()=>newForm(true)} style={{background:"#fff",border:"2px solid #fca5a5",borderRadius:20,padding:"18px 22px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:16,boxShadow:"0 4px 16px rgba(220,38,38,0.10)"}}>
          <div style={{width:52,height:52,borderRadius:16,background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>🚨</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:17,color:RED,letterSpacing:"-0.02em",marginBottom:2}}>Avārijas izsaukums</div>
            <div style={{fontSize:13,color:"#ef4444",opacity:0.7}}>{isNight()?"🌙 Nakts izsaukums aktīvs":"Ārkārtas situācija objektā"}</div>
          </div>
          <div style={{color:"#fca5a5",fontSize:24}}>›</div>
        </div>

        <div onClick={()=>setView("reports")} style={{background:"#fff",border:"1px solid #eaecf0",borderRadius:20,padding:"18px 22px",marginBottom:12,cursor:"pointer",display:"flex",alignItems:"center",gap:16,boxShadow:"0 1px 4px rgba(13,33,55,0.05)"}}>
          <div style={{width:52,height:52,borderRadius:16,background:"#eff6ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>📊</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:16,color:NAVY,marginBottom:2}}>Atskaišu vēsture</div>
            <div style={{fontSize:13,color:"#94a3b8"}}>{reports.length} ieraksti kopā</div>
          </div>
          <div style={{color:"#cbd5e1",fontSize:24}}>›</div>
        </div>

        <div style={{background:"#fff",border:"1px solid #eaecf0",borderRadius:14,padding:"12px 16px",display:"flex",gap:8,alignItems:"center"}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",flexShrink:0,boxShadow:"0 0 0 3px #dcfce7"}}/>
          <span style={{fontSize:13,color:"#475569",fontWeight:500}}>Telegram aktīvs</span>
          <span style={{color:"#e2e8f0",margin:"0 2px"}}>·</span>
          <span style={{fontSize:13,color:"#94a3b8"}}>{OBJEKTI.length} objekti saglabāti</span>
        </div>
      </div>
    </div>
  );

  // ── SUCCESS ───────────────────────────────────────────────
  if (done) return (
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",flexDirection:"column"}}>
      <NavBar title={form.avarija?"🚨 Avārija reģistrēta":"Atskaite iesniegta"} red={form.avarija}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{textAlign:"center",maxWidth:340,width:"100%"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:form.avarija?"#fef2f2":"#f0fdf4",border:`3px solid ${form.avarija?"#fca5a5":"#86efac"}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:36}}>
            {form.avarija?"🚨":"✓"}
          </div>
          <div style={{fontSize:22,fontWeight:800,color:NAVY,marginBottom:6,letterSpacing:"-0.02em"}}>
            {form.avarija ? "Avārija reģistrēta!" : `Paldies, ${form.darbinieki[0]}!`}
          </div>
          {form.selectedObjekts ? (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:15,fontWeight:600,color:NAVY}}>{form.selectedObjekts.nos}</div>
              <div style={{fontSize:13,color:"#64748b"}}>{form.selectedObjekts.adrese}</div>
            </div>
          ) : (
            <div style={{fontSize:15,color:"#64748b",marginBottom:16}}>{form.objekts}</div>
          )}
          {tgOk===true && <div style={{fontSize:13,color:"#16a34a",marginBottom:12,background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><span>✈️</span><span>Nosūtīts uz Telegram ✓</span></div>}
          {tgOk===false && <div style={{fontSize:13,color:"#d97706",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",marginBottom:12}}>⚠️ Telegram kļūda — pārbaudi savienojumu</div>}
          {form.foto.length>0 && <div style={{marginBottom:16}}><PhotoGrid photos={form.foto}/></div>}
          <button onClick={()=>newForm(false)} style={{width:"100%",background:`linear-gradient(135deg,${ORNG},#ff6b35)`,border:"none",borderRadius:14,padding:17,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:10,boxShadow:`0 6px 20px rgba(232,82,26,0.35)`}}>+ Jauna atskaite</button>
          <button onClick={()=>setView("menu")} style={{width:"100%",background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:14,padding:16,color:"#64748b",fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>← Sākums</button>
        </div>
      </div>
    </div>
  );

  // ── REPORTS ───────────────────────────────────────────────
  if (view==="reports") return (
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui,-apple-system,sans-serif",color:NAVY}}>
      <NavBar title="Atskaišu vēsture" sub={`${reports.length} ieraksti`} back={()=>setView("menu")}/>
      <div style={{padding:16,maxWidth:480,margin:"0 auto",paddingBottom:40}}>
        {reports.length===0 && (
          <div style={{textAlign:"center",color:"#94a3b8",padding:"80px 20px"}}>
            <div style={{fontSize:48,marginBottom:16}}>📭</div>
            <div style={{fontSize:16,fontWeight:600}}>Vēl nav atskaišu</div>
          </div>
        )}
        {reports.map(r => {
          const st   = STATUSI.find(s=>s.value===r.statuss)||STATUSI[1];
          const h    = calcHours(r.laiks_no, r.laiks_lidz);
          const mats = (r.materiali_saraksts||[]).filter(m=>m.nosaukums);
          const kats = (r.kategorijas||[]).map(id=>KATEGORIJAS.find(k=>k.id===id)).filter(Boolean);
          return (
            <div key={r.id} style={{...card,border:r.avarija?"1.5px solid #fca5a5":"1px solid #eaecf0"}}>
              {r.avarija && <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:10,background:"#fef2f2",borderRadius:8,padding:"6px 10px"}}><span style={{fontSize:16}}>🚨</span><span style={{fontSize:12,fontWeight:700,color:RED,textTransform:"uppercase",letterSpacing:"0.05em"}}>Avārija{r.nakts?" · Nakts":""}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1,marginRight:10}}>
                  <div style={{fontWeight:700,fontSize:15,color:NAVY,lineHeight:1.3,marginBottom:2}}>{r.selectedObjekts?r.selectedObjekts.nos:r.objekts}</div>
                  {r.selectedObjekts && <div style={{fontSize:12,color:"#94a3b8"}}>{r.selectedObjekts.adrese}</div>}
                </div>
                <span style={{background:st.bg,color:st.color,border:`1.5px solid ${st.border}`,borderRadius:20,padding:"4px 11px",fontSize:12,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>{st.icon} {st.label}</span>
              </div>
              <div style={{fontSize:13,color:"#64748b",marginBottom:8,display:"flex",flexWrap:"wrap",gap:"4px 10px"}}>
                <span>👷 {(r.darbinieki||[]).join(" & ")}</span>
                <span>📅 {r.datums}</span>
                {h && <span>⏱ {h}</span>}
              </div>
              {kats.length>0 && <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>{kats.map(k=><span key={k.id} style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:6,padding:"3px 9px",fontSize:12,color:"#475569"}}>{k.icon} {k.label}</span>)}</div>}
              <div style={{fontSize:14,color:"#334155",lineHeight:1.5,marginBottom:mats.length?10:0}}>{r.darba_apraksts}</div>
              {mats.length>0 && <div style={{borderTop:"1px solid #f1f5f9",paddingTop:10}}>{mats.map((m,i)=><div key={i} style={{fontSize:13,color:"#475569",marginBottom:4,display:"flex",gap:6,alignItems:"flex-start"}}><span style={{color:ORNG,fontSize:10,marginTop:4}}>●</span><span>{m.nosaukums}{m.veikals?" · "+m.veikals:""}{m.cena&&<strong style={{color:NAVY}}> · €{m.cena}</strong>}</span></div>)}</div>}
              {r.foto?.length>0 && <div style={{marginTop:10}}><div style={{fontSize:12,color:"#94a3b8",marginBottom:6,fontWeight:500}}>📷 {r.foto.length} foto</div><PhotoGrid photos={r.foto}/></div>}
              {r.pieziimes && <div style={{fontSize:13,color:"#94a3b8",marginTop:10,paddingTop:10,borderTop:"1px solid #f1f5f9",fontStyle:"italic"}}>{r.pieziimes}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── FORM ─────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:form.avarija?"#fff5f5":"#f1f5f9",fontFamily:"system-ui,-apple-system,sans-serif",color:NAVY}}>
      <NavBar title={form.avarija?"🚨 Avārijas izsaukums":"Jauna atskaite"} sub={new Date().toLocaleDateString("lv-LV",{day:"numeric",month:"long"})} back={()=>setView("menu")} red={form.avarija}/>
      <div style={{padding:16,maxWidth:480,margin:"0 auto",paddingBottom:40}}>

        {/* AVĀRIJA */}
        <div style={{...card,border:form.avarija?`1.5px solid #fca5a5`:"1px solid #eaecf0",background:form.avarija?"#fef2f2":"#fff"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:form.avarija?14:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>🚨</span>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:form.avarija?RED:NAVY}}>Avārijas izsaukums</div>
                <div style={{fontSize:12,color:"#94a3b8",marginTop:1}}>Ārkārtas situācija</div>
              </div>
            </div>
            <Toggle on={form.avarija} onClick={()=>set("avarija",!form.avarija)} color={RED}/>
          </div>
          {form.avarija && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:10,padding:"12px 14px",border:"1.5px solid #fca5a5"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>🌙</span>
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:form.nakts?RED:NAVY}}>Nakts izsaukums</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>21:00 – 07:00</div>
                </div>
              </div>
              <Toggle on={form.nakts} onClick={()=>set("nakts",!form.nakts)} color={RED}/>
            </div>
          )}
        </div>

        {/* DARBINIEKS */}
        <div style={card}>
          <span style={sLbl}>Darbinieks</span>
          <div style={{display:"flex",gap:8}}>
            {DARBINIEKI.map(d => {
              const a = form.darbinieki.includes(d);
              return (<button key={d} onClick={()=>toggleWorker(d)} style={{flex:1,padding:"14px 8px",borderRadius:12,border:a?`2px solid ${ORNG}`:"1.5px solid #e2e8f0",background:a?`${ORNG}0a`:"#f8fafc",color:a?ORNG:NAVY,fontWeight:a?700:400,fontSize:16,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{d}</button>);
            })}
          </div>
          {form.darbinieki.length===2 && <div style={{marginTop:10,fontSize:13,color:ORNG,fontWeight:600,textAlign:"center",background:`${ORNG}08`,borderRadius:8,padding:8}}>Strādājat kopā ✓</div>}
        </div>

        {/* OBJEKTS */}
        <div style={card}>
          <span style={sLbl}>Objekts</span>
          {form.selectedObjekts ? (
            <div style={{background:`${ORNG}08`,border:`1.5px solid ${ORNG}`,borderRadius:12,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,borderRadius:10,background:`${ORNG}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏗️</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:14,color:NAVY,lineHeight:1.3,marginBottom:2}}>{form.selectedObjekts.nos}</div>
                <div style={{fontSize:12,color:"#64748b"}}>{form.selectedObjekts.adrese}</div>
              </div>
              <button onClick={()=>setShowModal(true)} style={{background:"rgba(0,0,0,0.04)",border:"none",color:"#94a3b8",fontSize:12,cursor:"pointer",fontFamily:"inherit",padding:"4px 10px",borderRadius:6}}>Mainīt</button>
            </div>
          ) : (
            <button onClick={()=>setShowModal(true)} style={{width:"100%",background:"#f8fafc",border:"1.5px dashed #e2e8f0",borderRadius:12,padding:"16px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:"inherit"}}>
              <div style={{width:38,height:38,borderRadius:10,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏗️</div>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontWeight:600,fontSize:14,color:NAVY,marginBottom:1}}>Izvēlēties no saraksta</div>
                <div style={{fontSize:12,color:"#94a3b8"}}>{OBJEKTI.length} objekti pieejami</div>
              </div>
              <div style={{color:"#cbd5e1",fontSize:20}}>›</div>
            </button>
          )}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{flex:1,height:1,background:"#f1f5f9"}}/>
            <span style={{fontSize:11,color:"#94a3b8",fontWeight:500}}>vai ievadīt manuāli</span>
            <div style={{flex:1,height:1,background:"#f1f5f9"}}/>
          </div>
          <input style={{...inp,marginBottom:0,background:form.selectedObjekts?"#f0fdf4":"#f8fafc",borderColor:form.selectedObjekts?"#86efac":"#e2e8f0"}}
            placeholder="Adrese vai apraksts..."
            value={form.objekts}
            onChange={e=>{set("objekts",e.target.value); if(form.selectedObjekts) set("selectedObjekts",null);}}/>
        </div>

        {/* LAIKS */}
        <div style={card}>
          <span style={sLbl}>Laiks</span>
          <label style={lbl}>Datums</label>
          <input style={inp} type="date" value={form.datums} onChange={e=>set("datums",e.target.value)}/>
          <label style={lbl}>Darba laiks</label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input style={{...inp,flex:1,marginBottom:0}} type="time" value={form.laiks_no} onChange={e=>set("laiks_no",e.target.value)}/>
            <span style={{color:"#cbd5e1",padding:"0 2px",fontSize:18}}>—</span>
            <input style={{...inp,flex:1,marginBottom:0}} type="time" value={form.laiks_lidz} onChange={e=>set("laiks_lidz",e.target.value)}/>
          </div>
          {hours && <div style={{marginTop:10,fontSize:14,color:ORNG,fontWeight:700,background:`${ORNG}08`,borderRadius:8,padding:"8px 12px",textAlign:"center"}}>⏱ Kopā: {hours}</div>}
        </div>

        {/* DARBU VEIDS */}
        <div style={card}>
          <span style={sLbl}>Darbu veids</span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {KATEGORIJAS.map(k => {
              const a = form.kategorijas.includes(k.id);
              return (<button key={k.id} onClick={()=>toggleKat(k.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 12px",borderRadius:10,border:a?`2px solid ${ORNG}`:"1.5px solid #e2e8f0",background:a?`${ORNG}08`:"#f8fafc",color:a?ORNG:NAVY,fontWeight:a?600:400,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",textAlign:"left"}}><span style={{fontSize:17}}>{k.icon}</span>{k.label}</button>);
            })}
          </div>
        </div>

        {/* STATUSS */}
        <div style={card}>
          <span style={sLbl}>Darba statuss</span>
          <div style={{display:"flex",gap:8}}>
            {STATUSI.map(st => {
              const a = form.statuss===st.value;
              return (<button key={st.value} onClick={()=>set("statuss",st.value)} style={{flex:1,padding:"13px 6px",borderRadius:12,cursor:"pointer",textAlign:"center",border:a?`2px solid ${st.border}`:"1.5px solid #e2e8f0",background:a?st.bg:"#f8fafc",color:a?st.color:"#94a3b8",fontWeight:a?700:400,fontSize:12,fontFamily:"inherit",transition:"all 0.15s"}}><div style={{fontSize:20,marginBottom:4}}>{st.icon}</div>{st.label}</button>);
            })}
          </div>
        </div>

        {/* DARBA APRAKSTS */}
        <div style={card}>
          <span style={sLbl}>Veiktie darbi</span>
          <textarea style={{...inp,minHeight:90,resize:"vertical",marginBottom:0}}
            placeholder="Apraksti detalizēti, kādi darbi tika veikti..."
            value={form.darba_apraksts} onChange={e=>set("darba_apraksts",e.target.value)}/>
        </div>

        {/* FOTO */}
        <div style={card}>
          <span style={sLbl}>Foto no objekta</span>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{display:"none"}}/>
          <div style={{display:"flex",gap:8,marginBottom:form.foto.length?14:0}}>
            <button onClick={()=>{fileRef.current.removeAttribute("capture");fileRef.current.click();}} style={{flex:1,background:"#f8fafc",border:"2px dashed #e2e8f0",borderRadius:12,padding:"16px 8px",color:"#64748b",fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>📁<br/><span style={{fontSize:12}}>Galerija</span></button>
            <button onClick={()=>{fileRef.current.setAttribute("capture","environment");fileRef.current.click();}} style={{flex:1,background:`${ORNG}08`,border:`2px dashed ${ORNG}`,borderRadius:12,padding:"16px 8px",color:ORNG,fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"center",fontWeight:600}}>📷<br/><span style={{fontSize:12}}>Kamera</span></button>
          </div>
          {uploading && <div style={{fontSize:13,color:"#94a3b8",textAlign:"center",padding:"8px 0"}}>Apstrādā attēlus...</div>}
          {form.foto.length>0 && <>
            <div style={{fontSize:13,color:"#64748b",marginBottom:10,fontWeight:500}}>{form.foto.length} foto pievienoti</div>
            <PhotoGrid photos={form.foto} onRemove={i=>set("foto",form.foto.filter((_,j)=>j!==i))}/>
          </>}
        </div>

        {/* MATERIĀLI */}
        <div style={card}>
          <span style={sLbl}>Materiāli</span>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:form.materiali?16:0}}>
            <span style={{fontSize:14,color:"#334155",fontWeight:500}}>Vai tika izmantoti materiāli?</span>
            <Toggle on={form.materiali} onClick={()=>set("materiali",!form.materiali)}/>
          </div>
          {form.materiali && <div>
            {form.materiali_saraksts.map((m,i) => (
              <div key={i} style={{background:"#f8fafc",borderRadius:12,padding:14,marginBottom:10,border:"1.5px solid #e2e8f0"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{fontSize:11,fontWeight:700,color:ORNG,textTransform:"uppercase",letterSpacing:"0.06em"}}>Materiāls {i+1}</span>
                  {form.materiali_saraksts.length>1 && <button onClick={()=>set("materiali_saraksts",form.materiali_saraksts.filter((_,j)=>j!==i))} style={{background:"#fef2f2",border:"none",color:RED,fontSize:12,cursor:"pointer",fontFamily:"inherit",borderRadius:6,padding:"4px 10px",fontWeight:600}}>✕ Noņemt</button>}
                </div>
                <label style={lbl}>Nosaukums</label>
                <input style={inp} placeholder="Ko nopirka?" value={m.nosaukums} onChange={e=>updateMat(i,"nosaukums",e.target.value)}/>
                <label style={lbl}>Veikals</label>
                <select style={inp} value={m.veikals} onChange={e=>updateMat(i,"veikals",e.target.value)}>
                  <option value="">— Izvēlēties veikalu —</option>
                  {VEIKALI.map(v=><option key={v}>{v}</option>)}
                </select>
                <label style={lbl}>Summa (€)</label>
                <input style={inp} type="number" placeholder="0.00" value={m.cena} onChange={e=>updateMat(i,"cena",e.target.value)}/>
                <label onClick={()=>updateMat(i,"kopejsCeks",!m.kopejsCeks)} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",userSelect:"none"}}>
                  <div style={{width:20,height:20,borderRadius:6,border:m.kopejsCeks?`2px solid ${ORNG}`:"1.5px solid #cbd5e1",background:m.kopejsCeks?ORNG:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                    {m.kopejsCeks && <span style={{color:"#fff",fontSize:13,lineHeight:1}}>✓</span>}
                  </div>
                  <span style={{fontSize:13,color:"#475569"}}>Šis čeks segts vairākiem objektiem</span>
                </label>
                {m.kopejsCeks && <div style={{background:"#eff6ff",border:"1.5px solid #bfdbfe",borderRadius:10,padding:12,marginTop:12}}>
                  <label style={{...lbl,color:"#2563eb"}}>Kuri citi objekti?</label>
                  <input style={{...inp,background:"#fff",marginBottom:0}} placeholder="Brīvības 45, Dzirnavu 12..." value={m.objektiSaraksts||""} onChange={e=>updateMat(i,"objektiSaraksts",e.target.value)}/>
                </div>}
              </div>
            ))}
            <button onClick={()=>set("materiali_saraksts",[...form.materiali_saraksts,emptyMat()])} style={{width:"100%",background:"#fff",border:"2px dashed #e2e8f0",borderRadius:12,padding:13,color:"#64748b",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>+ Pievienot materiālu</button>
          </div>}
        </div>

        {/* PIEZĪMES */}
        <div style={card}>
          <span style={sLbl}>Papildu piezīmes</span>
          <textarea style={{...inp,minHeight:72,resize:"vertical",marginBottom:0}}
            placeholder="Jebkas cits, ko vēlies piebilst..."
            value={form.pieziimes} onChange={e=>set("pieziimes",e.target.value)}/>
        </div>

        {!canSubmit && <div style={{fontSize:13,color:"#d97706",textAlign:"center",marginBottom:10,background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:10,padding:"12px 16px"}}>Aizpildi: darbinieks, objekts, statuss un darba apraksts</div>}

        <button onClick={canSubmit&&!sending?submit:undefined} style={{
          width:"100%",
          background: !canSubmit||sending ? "#e2e8f0" : form.avarija ? `linear-gradient(135deg,${RED},#b91c1c)` : `linear-gradient(135deg,${ORNG},#ff6b35)`,
          border:"none", borderRadius:14, padding:18,
          color: canSubmit&&!sending ? "#fff" : "#94a3b8",
          fontSize:17, fontWeight:800,
          cursor: canSubmit&&!sending ? "pointer" : "not-allowed",
          fontFamily:"inherit", letterSpacing:"-0.01em",
          boxShadow: canSubmit&&!sending ? (form.avarija?"0 8px 24px rgba(220,38,38,0.4)":"0 8px 24px rgba(232,82,26,0.35)") : "none",
          transition:"all 0.2s",
        }}>
          {sending ? "Nosūta..." : form.avarija ? "🚨 Reģistrēt avāriju" : "Iesniegt atskaiti"}
        </button>
      </div>
    </div>
  );
}
