import { useState, useEffect, useRef } from "react";

const T = {
  bg:"#F5F0E8", bg2:"#EDE7DA", card:"#FDFAF5",
  ink:"#1A1612", inkS:"#6B5F52", inkH:"#A8998A", line:"#D8CFBF",
  verde:"#233D16", verdeM:"#3A6225", copper:"#9B4A1E", chef:"#7A5C1E",
};

/* ── IMÁGENES
   picsum.photos funciona en sandbox de Claude para preview.
   En producción, reemplaza P() por U() con los IDs de Unsplash verificados. */
const P = (seed, w=600, h=420) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* Seeds por plato — visualmente representativos */
const IMGS = {
  /* Desayunos */
  d1: P("waffle1"),   d2: P("waffle2"),   d3: P("calentado"),
  d4: P("bistec"),    d5: P("waffle3"),   d6: P("waffle4"),
  d7: P("arepa"),     d8: P("benedict"),  d9: P("avocado"),
  d10:P("sandwich"),  d11:P("guacamole"), d12:P("caprese"),
  d13:P("desmechada"),
  /* Entradas */
  e1: P("carpaccio"), e2: P("camaron"),   e3: P("tocino"),
  e4: P("chunchullo"),e5: P("morcilla"), e6: P("picada1"),
  /* Parrilla */
  p1: P("ribs"),      p2: P("lomo"),      p3: P("anca"),
  p4: P("seafood"),   p5: P("picada2"),
  /* Bebidas */
  b1: P("frappe"),    b2: P("limonada"),  b3: P("agua"),
  b4: P("jugo"),
  /* Hero */
  hero: P("grill",900,600),
};

const FB = {
  Desayunos:"linear-gradient(160deg,#C8A878,#9A7040)",
  Entradas: "linear-gradient(160deg,#8AAA70,#4A7040)",
  Parrilla: "linear-gradient(160deg,#B87050,#7A3020)",
  Bebidas:  "linear-gradient(160deg,#88A8C0,#4878A0)",
};

const MENU = {
  Desayunos:{ items:[
    {id:"d1", p:21200,n:"Wafle de Avena Saludable",    tag:"Saludable",feat:false,d:"Wafle de avena con stevia, huevos revueltos con jamón, yogurt griego con granola y fruta"},
    {id:"d2", p:21200,n:"Wafle de Choclo",             tag:"Veggie",   feat:false,d:"Fruta, wafle de choclo, queso crema, huevos revueltos con champiñones y queso"},
    {id:"d3", p:19200,n:"Calentado Paisa",             tag:"Clásico",  feat:false,d:"Arroz con frijoles, madurito, chicharroncitos, dos huevos fritos y arepitas paisas"},
    {id:"d4", p:21200,n:"Carne en Bistec",             tag:"Parrilla", feat:false,d:"Carne en bistec, huevo frito y arepa extra delgada, con fruta de temporada"},
    {id:"d5", p:21200,n:"Wafle Pan de Yuca & Tocineta",tag:"Favorito", feat:true, d:"Wafle de pan de yuca, huevos revueltos con maicitos y tocineta crujiente, con fruta"},
    {id:"d6", p:21200,n:"Wafle Tradicional con Jamón", tag:"Clásico",  feat:false,d:"Yogurt griego con cereal y fruta, wafle tradicional, huevos fritos con jamón y queso"},
    {id:"d7", p:21200,n:"Arepa Paisa Completa",        tag:"Clásico",  feat:false,d:"Arepa paisa con queso, huevos atomatados, tocineta y fruta de temporada"},
    {id:"d8", p:22000,n:"Eggs Benedict Salvador",      tag:"Chef",     feat:true, d:"Huevos escalfados con salsa holandesa, aguacate laminado, wafle de pan de yuca y tocineta"},
    {id:"d9", p:20000,n:"Tostada Aguacate & Huevo",    tag:"Veggie",   feat:false,d:"Huevos fritos, aguacate laminado, maduro, parmesano, brotes frescos sobre wafle de yuca"},
    {id:"d10",p:21000,n:"Sándwich de Tocineta",        tag:"Popular",  feat:false,d:"Huevo frito, tocineta, mix de hojas verdes, wafle artesanal con miel de maple"},
    {id:"d11",p:21000,n:"Wafle Guacamole & Pollo",     tag:"Fusión",   feat:false,d:"Pollo desmechado con guacamole sobre wafle de pandeyuca, estilo venezolano"},
    {id:"d12",p:21000,n:"Wafle Caprese",               tag:"Chef",     feat:true, d:"Mozzarella de búfala, tomate cherry, puré de aguacate, reducción balsámica y germinados"},
    {id:"d13",p:21000,n:"Wafle Carne Desmechada",      tag:"Popular",  feat:false,d:"Carne desmechada con hogao, huevo cocido, aguacate y sour cream sobre wafle de choclo"},
  ]},
  Entradas:{ items:[
    {id:"e1",p:22500,n:"Carpaccio de Res",   tag:"Refinado", feat:true, d:"Lomo en finas tajadas, aceite de oliva, vinagre balsámico, rúgula, albahaca, parmesano y limón"},
    {id:"e2",p:24000,n:"Camarón al Ajillo",  tag:"Del Mar",  feat:true, d:"Camarón salteado, cebolla ocañera, salsa de la casa, platanitos maduros y tocineta crocante"},
    {id:"e3",p:15400,n:"Tocino Caramelizado",tag:"Popular",  feat:false,d:"200 g de tocino carnudo caramelizado con zumo de naranja y tamarindo, arepitas paisas"},
    {id:"e4",p:14200,n:"Chunchullo Tostado", tag:"Clásico",  feat:false,d:"250 g de chunchullo tostadito en trozos, acompañado de arepitas paisas"},
    {id:"e5",p:14200,n:"Morcillitas ×4",     tag:"Parrilla", feat:false,d:"Porción de 4 morcillitas a la parrilla acompañadas de arepitas paisas"},
    {id:"e6",p:38800,n:"Picada Parrillera",  tag:"Compartir",feat:false,d:"Para compartir: morcillitas, bofe, chinchulines, chorizo, tomate con chimichurri y arepa"},
  ]},
  Parrilla:{ items:[
    {id:"p1",p:48000,n:"Costillas BBQ",        tag:"Estrella", feat:true, d:"Costillas de res a la brasa ancestral con salsa BBQ artesanal de la casa"},
    {id:"p2",p:52000,n:"Lomo Acevichado 380 g",tag:"Chef",     feat:true, d:"Corte de lomo fino con aderezo acevichado, fusión peruano-colombiana"},
    {id:"p3",p:54000,n:"Punta de Anca 400 g",  tag:"Parrilla", feat:false,d:"Punta de anca a la brasa con marinada acevichada y guarnición de la casa"},
    {id:"p4",p:46000,n:"Cazuela de Mariscos",  tag:"Del Mar",  feat:false,d:"Cazuela con variedad de mariscos frescos en salsa de la casa"},
    {id:"p5",p:65000,n:"Picada Grande",        tag:"Compartir",feat:false,d:"Gran surtido de cortes premium y acompañamientos para 2–3 personas"},
  ]},
  Bebidas:{ items:[
    {id:"b1",p:12000,n:"Frappe Salvador & Milagros",tag:"Firma",  feat:true, d:"Espresso, leche, crema chantilly, arequipe y almendras laminadas"},
    {id:"b2",p:9000, n:"Limonada de Coco",          tag:"Fresco", feat:false,d:"Limonada natural con toque de coco, hielo y sal"},
    {id:"b3",p:4000, n:"Agua Mineral 600 ml",       tag:"Básico", feat:false,d:"Agua mineral fría con o sin gas"},
    {id:"b4",p:8000, n:"Jugo Natural",              tag:"Frutal", feat:false,d:"Jugo de fruta de temporada en agua o leche"},
  ]},
};

const CATS     = Object.keys(MENU);
const ALL      = CATS.flatMap(c=>MENU[c].items);
const FEATURED = ALL.filter(i=>i.feat);
const STEPS    = [
  {key:"recibido",   label:"Recibido",   color:T.copper},
  {key:"en_proceso", label:"En proceso", color:T.chef},
  {key:"despachado", label:"Despachado", color:T.verdeM},
];
const PIN  = "1234";
const fmt  = n=>"$"+n.toLocaleString("es-CO");
const icat = id=>CATS.find(c=>MENU[c].items.some(i=>i.id===id))||CATS[0];

async function ai(msgs,sys,max=650){
  const r=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:max,system:sys,messages:msgs}),
  });
  return (await r.json()).content?.[0]?.text||"";
}

export default function App(){
  const [pg,setPg]             = useState("menu");
  const [cat,setCat]           = useState(CATS[0]);
  const [cart,setCart]         = useState({});
  const [sheet,setSheet]       = useState(false);
  const [orders,setOrders]     = useState([]);
  const [form,setForm]         = useState({wa:"",addr:"",notes:""});
  const [placed,setPlaced]     = useState(null);
  const [trkWa,setTrkWa]       = useState("");
  const [found,setFound]       = useState(null);
  const [chatH,setChatH]       = useState([]);
  const [chatIn,setChatIn]     = useState("");
  const [busy,setBusy]         = useState(false);
  const [pin,setPin]           = useState("");
  const [pinErr,setPinErr]     = useState(false);
  const [unlocked,setUnlocked] = useState(false);
  const [revOpen,setRevOpen]   = useState(false);
  const [revTxt,setRevTxt]     = useState("");
  const [revBusy,setRevBusy]   = useState(false);
  const catRefs = useRef({});
  const chatEnd = useRef(null);

  const qty   = Object.values(cart).reduce((a,b)=>a+b,0);
  const total = Object.entries(cart).reduce((s,[id,q])=>s+(ALL.find(i=>i.id===id)?.p||0)*q,0);
  const items = Object.entries(cart).map(([id,q])=>({...ALL.find(i=>i.id===id),qty:q}));

  useEffect(()=>{load();},[]);
  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[chatH,busy]);

  async function load(){
    try{const r=localStorage.getItem("sm11");if(r)setOrders(JSON.parse(r));}catch{}
  }
  function save(o){localStorage.setItem("sm11",JSON.stringify(o));setOrders(o);}

  const add = id=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const dec = id=>setCart(c=>{const n={...c};n[id]>1?n[id]--:delete n[id];return n;});

  function scrollTo(c){
    setCat(c);
    setTimeout(()=>catRefs.current[c]?.scrollIntoView({behavior:"smooth",block:"start"}),30);
  }

  async function place(){
    if(!form.wa||!form.addr)return;
    const o={id:Math.floor(1000+Math.random()*9000),...form,items,total,status:"recibido",at:new Date().toISOString()};
    await save([...orders,o]);
    setPlaced(o);setCart({});setForm({wa:"",addr:"",notes:""});setPg("done");
  }

  function doTrack(){setFound(orders.filter(o=>o.wa.replace(/\D/g,"").includes(trkWa.replace(/\D/g,""))));}

  function tryPin(){
    if(pin===PIN){setUnlocked(true);setPg("admin");load();}
    else{setPinErr(true);setPin("");}
  }

  async function sendChat(txt){
    if(!txt.trim()||busy)return;
    setChatIn("");
    const msgs=[...chatH,{role:"user",content:txt}];setChatH(msgs);setBusy(true);
    const sys=`Eres Milagros, asistente de Salvador & Milagros (parrilla ancestral, Ibagué). Español colombiano, cálido, breve (máx 3 frases). Pedidos: ${orders.map(o=>`#${o.id} ${o.status}`).join(",")||"ninguno"}. Menú: ${CATS.map(c=>MENU[c].items.map(i=>`${i.n} ${fmt(i.p)}`).join(", ")).join(" | ")}.`;
    const r=await ai(msgs,sys).catch(()=>"Sin conexión. Intenta de nuevo.");
    setChatH([...msgs,{role:"assistant",content:r}]);setBusy(false);
  }

  async function runReview(){
    setRevBusy(true);setRevTxt("");setRevOpen(true);
    const r=await ai([{role:"user",content:`Revisa sistema domicilios Salvador & Milagros. Mobile-first: menú con fotos, featured, nav inferior, carrito bottom sheet, checkout, tracking, chat IA, admin kanban. Pedidos activos: ${orders.length}. Analiza UX mobile. Máx 250 palabras.`}],
      "Experto UX apps restaurantes latinoamericanos. Directo y útil.",700
    ).catch(()=>"Error.");
    setRevTxt(r);setRevBusy(false);
  }

  async function advance(id,si){
    if(si>=STEPS.length-1)return;
    await save(orders.map(o=>o.id===id?{...o,status:STEPS[si+1].key}:o));
  }

  const isMenu=pg==="menu",isCheckout=pg==="checkout",isDone=pg==="done",
        isTrack=pg==="track",isChat=pg==="chat",isLock=pg==="lock",isAdmin=pg==="admin";

  return(
    <div style={{background:T.bg,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:T.ink,
      paddingBottom:isAdmin||isChat?0:64}}>
      <CSS/>

      {/* ══ MENÚ ══════════════════════════════════════════════════ */}
      {isMenu&&(
        <div>
          {/* Top bar */}
          <div className="topbar">
            <div>
              <div className="brand">Salvador & Milagros</div>
              <div className="brand-sub">Parrilla Ancestral · Ibagué</div>
            </div>
            <button className="cart-top-btn" onClick={()=>setSheet(true)}>
              <IcoCart/>{qty>0&&<span className="cbadge">{qty}</span>}
            </button>
          </div>

          {/* HERO con foto real */}
          <div className="hero">
            <Img src={IMGS.hero} alt="Parrilla Salvador y Milagros"
              style={{width:"100%",height:"100%",objectFit:"cover"}} noSkeleton/>
            <div className="hero-vignette"/>
            <div className="hero-content">
              <p className="hero-eyebrow">Domicilios en Ibagué · Av. 60</p>
              <h1 className="hero-h1">Parrilla<br/>Ancestral</h1>
              <p className="hero-desc">WhatsApp · Hasta las 9 PM</p>
              <div className="hero-chips">
                {["4.7 Google","Ambiente Natural","Música en Vivo"].map(b=>(
                  <span key={b} className="hchip">{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* FEATURED */}
          <div className="sect-hdr">
            <span className="rule"/><span className="sect-lbl">Más pedidos</span><span className="rule"/>
          </div>
          <div className="feat-scroll">
            {FEATURED.map(item=>{
              const q=cart[item.id]||0;
              return(
                <div key={item.id} className="fcard">
                  <div className="fcard-img">
                    <Img src={IMGS[item.id]} alt={item.n}
                      style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .5s"}}
                      fb={FB[icat(item.id)]} zoom/>
                    <div className="fcard-fade"/>
                    <span className={pill(item.tag)}>{item.tag}</span>
                  </div>
                  <div className="fcard-body">
                    <p className="fcard-name">{item.n}</p>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:5}}>
                      <span className="price-s">{fmt(item.p)}</span>
                      {q===0
                        ?<button className="add-circle" onClick={()=>add(item.id)}>+</button>
                        :<QRow id={item.id} q={q} add={add} dec={dec} sm/>
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABS sticky */}
          <div className="tabs-wrap">
            <div className="tabs">
              {CATS.map(c=>(
                <button key={c} className={`tab${cat===c?" tab-on":""}`} onClick={()=>scrollTo(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* SECCIONES */}
          <div>
            {CATS.map(ck=>(
              <section key={ck} ref={el=>catRefs.current[ck]=el} className="cat-sec">
                <h2 className="cat-title">{ck}</h2>
                <div className="grid">
                  {MENU[ck].items.map(item=>{
                    const q=cart[item.id]||0;
                    return(
                      <article key={item.id} className={`card${q>0?" card-sel":""}`}>
                        <div className="card-img">
                          <Img src={IMGS[item.id]} alt={item.n}
                            style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .5s"}}
                            fb={FB[ck]} zoom/>
                          <span className={pill(item.tag)}>{item.tag}</span>
                          {q>0&&<span className="card-qdot">{q}</span>}
                        </div>
                        <div className="card-body">
                          <h3 className="card-name">{item.n}</h3>
                          <p className="card-desc">{item.d}</p>
                          <div className="card-foot">
                            <span className="price">{fmt(item.p)}</span>
                            {q===0
                              ?<button className="add-btn" onClick={()=>add(item.id)}>Agregar</button>
                              :<QRow id={item.id} q={q} add={add} dec={dec}/>
                            }
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
            <div style={{height:16}}/>
          </div>
        </div>
      )}

      {/* ══ CHECKOUT ══════════════════════════════════════════════ */}
      {isCheckout&&(
        <div className="subpage">
          <div className="subpage-hdr">
            <BackBtn onClick={()=>setPg("menu")}/>
            <span className="subpage-title">Tu pedido</span>
            <span style={{width:36}}/>
          </div>
          <div className="subpage-body">
            <div className="receipt">
              {items.map(it=>(
                <div key={it.id} className="rrow">
                  <Thumb id={it.id} ck={icat(it.id)} s={48}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p className="rname">{it.qty}× {it.n}</p>
                    <p className="rname-sub">{fmt(it.p)} c/u</p>
                  </div>
                  <span className="rprice">{fmt(it.p*it.qty)}</span>
                </div>
              ))}
              <div className="rtotal"><span>Total domicilio</span><span className="rtotal-n">{fmt(total)}</span></div>
            </div>
            <div className="fstack">
              <Field label="WhatsApp *"             v={form.wa}    set={v=>setForm(f=>({...f,wa:v}))}    ph="310 456 7890"/>
              <Field label="Dirección de entrega *" v={form.addr}  set={v=>setForm(f=>({...f,addr:v}))}  ph="Calle, barrio, referencia..."/>
              <Field label="Notas (opcional)"        v={form.notes} set={v=>setForm(f=>({...f,notes:v}))} ph="Término, sin cebolla..."/>
            </div>
          </div>
          <div className="subpage-footer">
            <button className={`cta${!form.wa||!form.addr?" cta-off":""}`}
              disabled={!form.wa||!form.addr} onClick={place}>
              Confirmar pedido · {fmt(total)}
            </button>
          </div>
        </div>
      )}

      {/* ══ DONE ══════════════════════════════════════════════════ */}
      {isDone&&placed&&(
        <div className="subpage">
          <div className="subpage-hdr">
            <span style={{width:36}}/>
            <span className="subpage-title">Confirmado</span>
            <span style={{width:36}}/>
          </div>
          <div className="subpage-body" style={{alignItems:"center",textAlign:"center"}}>
            <div className="done-ring" style={{marginTop:24}}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="28" stroke={T.verdeM} strokeWidth="1.5"/>
                <path d="M18 30l9 9 15-15" stroke={T.verdeM} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="done-num" style={{marginTop:12}}>#{placed.id}</h2>
            <p style={{color:T.inkS,fontSize:14,lineHeight:1.8,marginBottom:20,maxWidth:300}}>
              Confirmamos por WhatsApp al <strong style={{color:T.ink}}>{placed.wa}</strong><br/>{placed.addr}
            </p>
            <div className="receipt" style={{width:"100%",textAlign:"left"}}>
              {placed.items.map(i=>(
                <div key={i.id} className="rrow">
                  <Thumb id={i.id} ck={icat(i.id)} s={44}/>
                  <div style={{flex:1,minWidth:0}}><p className="rname">{i.qty}× {i.n}</p></div>
                  <span className="rprice">{fmt(i.p*i.qty)}</span>
                </div>
              ))}
              <div className="rtotal"><span>Total</span><span className="rtotal-n">{fmt(placed.total)}</span></div>
            </div>
          </div>
          <div className="subpage-footer">
            <button className="cta" onClick={()=>{setTrkWa(placed.wa);setPg("track");setTimeout(doTrack,80);}}>
              Ver estado del pedido
            </button>
            <button className="ghost" onClick={()=>setPg("menu")}>Volver al menú</button>
          </div>
        </div>
      )}

      {/* ══ TRACKING ══════════════════════════════════════════════ */}
      {isTrack&&(
        <div className="subpage">
          <div className="subpage-hdr">
            <BackBtn onClick={()=>setPg("menu")}/>
            <span className="subpage-title">Tu pedido</span>
            <span style={{width:36}}/>
          </div>
          <div className="subpage-body">
            <p style={{color:T.inkS,fontSize:13,marginBottom:12}}>Ingresa el WhatsApp con el que pediste</p>
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              <input className="finput" style={{flex:1}} value={trkWa}
                onChange={e=>setTrkWa(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&doTrack()}
                placeholder="310 456 7890"/>
              <button className="cta-sm" onClick={doTrack}>Buscar</button>
            </div>
            {found!==null&&(found.length===0
              ?<p style={{color:T.inkS,textAlign:"center",padding:"32px 0"}}>No encontramos pedidos con ese número.</p>
              :found.map(ord=>{
                const si=STEPS.findIndex(s=>s.key===ord.status);
                return(
                  <div key={ord.id} className="tcard">
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                      <span className="tcard-num">#{ord.id}</span>
                      <span style={{color:T.inkH,fontSize:11}}>{new Date(ord.at).toLocaleDateString("es-CO",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                    <div className="stepper">
                      {STEPS.map((st,i)=>(
                        <div key={st.key} className="step">
                          {i<STEPS.length-1&&<div className="sline" style={i<si?{background:STEPS[i+1].color,opacity:1}:{}}/>}
                          <div className="sdot" style={i<=si?{background:st.color,borderColor:st.color,color:"#fff"}:{}}>{i<=si?"✓":i+1}</div>
                          <span className="slbl" style={i<=si?{color:st.color}:{}}>{st.label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                      {ord.items?.map((it,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:T.bg2,
                          padding:"6px 10px 6px 6px",borderRadius:4,border:`1px solid ${T.line}`}}>
                          <Thumb id={it.id} ck={icat(it.id)} s={32}/>
                          <span style={{color:T.inkS,fontSize:12}}>{it.qty}× {it.n}</span>
                        </div>
                      ))}
                    </div>
                    <span className="price-lg">{fmt(ord.total)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ══ CHAT ══════════════════════════════════════════════════ */}
      {isChat&&(
        <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",
            borderBottom:`1px solid ${T.line}`,background:T.card,flexShrink:0}}>
            <BackBtn onClick={()=>setPg("menu")}/>
            <div style={{width:38,height:38,borderRadius:"50%",background:T.verde,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:"#fff",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700}}>M</span>
            </div>
            <div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:T.ink,lineHeight:1.2}}>Milagros</p>
              <p style={{color:T.verdeM,fontSize:11}}>En línea</p>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10,background:T.bg}}>
            {chatH.length===0&&(
              <div style={{textAlign:"center",padding:"32px 16px"}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:T.verde,
                  display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                  <span style={{color:"#fff",fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700}}>M</span>
                </div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:T.ink,fontWeight:700,marginBottom:8}}>Hola, soy Milagros</p>
                <p style={{color:T.inkS,fontSize:13,lineHeight:1.8,marginBottom:20}}>Pregúntame sobre el menú, ingredientes o el estado de tu pedido.</p>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {["¿Qué lleva el Carpaccio?","¿Cuál parrilla recomiendas?","¿Tienen opciones vegetarianas?","¿Dónde está mi pedido?"].map(t=>(
                    <button key={t} className="chip" onClick={()=>sendChat(t)}>{t}</button>
                  ))}
                </div>
              </div>
            )}
            {chatH.map((m,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-end",gap:8,flexDirection:m.role==="user"?"row-reverse":"row"}}>
                {m.role==="assistant"&&(
                  <div style={{width:28,height:28,borderRadius:"50%",background:T.verde,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#fff",fontFamily:"'Cormorant Garamond',serif",fontSize:11,fontWeight:700}}>M</span>
                  </div>
                )}
                <div style={{maxWidth:"78%",padding:"11px 14px",fontSize:14,lineHeight:1.65,
                  borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",
                  ...(m.role==="user"?{background:T.verde,color:"#fff"}:{background:T.card,color:T.ink,border:`1px solid ${T.line}`})}}>
                  {m.content}
                </div>
              </div>
            ))}
            {busy&&(
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:T.verde,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{color:"#fff",fontFamily:"'Cormorant Garamond',serif",fontSize:11,fontWeight:700}}>M</span>
                </div>
                <div style={{background:T.card,border:`1px solid ${T.line}`,borderRadius:"12px 12px 12px 2px",padding:"12px 16px",display:"flex",gap:5}}>
                  <span className="dot"/><span className="dot"/><span className="dot"/>
                </div>
              </div>
            )}
            <div ref={chatEnd}/>
          </div>
          <div style={{display:"flex",gap:8,padding:"10px 14px",borderTop:`1px solid ${T.line}`,background:T.card,flexShrink:0}}>
            <input className="finput" style={{flex:1}} value={chatIn}
              onChange={e=>setChatIn(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&sendChat(chatIn)}
              placeholder="Escribe tu pregunta..." disabled={busy}/>
            <button className="send-btn" onClick={()=>sendChat(chatIn)} disabled={!chatIn.trim()||busy}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8l12-6-6 12v-5H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ══ LOCK ══════════════════════════════════════════════════ */}
      {isLock&&(
        <div className="subpage">
          <div className="subpage-hdr">
            <BackBtn onClick={()=>setPg("menu")}/>
            <span className="subpage-title">Admin</span>
            <span style={{width:36}}/>
          </div>
          <div className="subpage-body" style={{alignItems:"center",justifyContent:"center"}}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{marginBottom:20}}>
              <rect x="8" y="20" width="28" height="18" rx="3" stroke={T.inkS} strokeWidth="1.5"/>
              <path d="M14 20v-5a8 8 0 0116 0v5" stroke={T.inkS} strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="22" cy="29" r="2.5" fill={T.inkS}/>
            </svg>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:T.ink,marginBottom:6}}>Panel Admin</p>
            <p style={{color:T.inkH,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:24}}>Pin demo: 1234</p>
            <input type="password" maxLength={6} className="finput"
              style={{textAlign:"center",fontSize:28,letterSpacing:16,width:"100%",maxWidth:220}}
              value={pin} onChange={e=>{setPin(e.target.value);setPinErr(false);}}
              onKeyDown={e=>e.key==="Enter"&&tryPin()} placeholder="·  ·  ·  ·" autoFocus/>
            {pinErr&&<p style={{color:T.copper,fontSize:12,marginTop:8}}>PIN incorrecto</p>}
            <button className="cta" style={{marginTop:14,maxWidth:220,width:"100%"}} onClick={tryPin}>Entrar</button>
          </div>
        </div>
      )}

      {/* ══ ADMIN KANBAN ══════════════════════════════════════════ */}
      {isAdmin&&unlocked&&(
        <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"12px 16px",background:T.card,borderBottom:`1px solid ${T.line}`,flexShrink:0}}>
            <div>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:T.ink}}>Pedidos</span>
              <span style={{color:T.inkH,fontSize:12,marginLeft:8}}>{orders.length} total</span>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button className="abtn abtn-green" onClick={runReview}>Revisor UX</button>
              <button className="abtn" onClick={load}>Actualizar</button>
              <button className="abtn" onClick={()=>{setPg("menu");setUnlocked(false);setPin("");}}>Salir</button>
            </div>
          </div>
          <div style={{display:"flex",gap:10,padding:12,flex:1,overflowX:"auto",overflowY:"hidden",alignItems:"flex-start"}}>
            {STEPS.map((st,si)=>{
              const col=orders.filter(o=>o.status===st.key);
              return(
                <div key={st.key} style={{flex:"0 0 258px",background:T.card,borderRadius:6,overflow:"hidden",
                  maxHeight:"100%",display:"flex",flexDirection:"column",
                  border:`1px solid ${T.line}`,borderTop:`2px solid ${st.color}`}}>
                  <div style={{padding:"10px 14px",background:T.bg2,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
                    <span style={{fontSize:13,fontWeight:600,color:T.ink}}>{st.label}</span>
                    <span style={{background:st.color,color:"#fff",borderRadius:12,padding:"2px 8px",fontSize:11,fontWeight:700}}>{col.length}</span>
                  </div>
                  <div style={{flex:1,overflowY:"auto",padding:8,display:"flex",flexDirection:"column",gap:8}}>
                    {col.length===0&&<p style={{color:T.line,textAlign:"center",padding:"20px 0",fontSize:12,fontStyle:"italic"}}>Sin pedidos</p>}
                    {col.map(ord=>{
                      const nxt=STEPS[si+1];
                      return(
                        <div key={ord.id} style={{background:T.bg,borderRadius:4,padding:10,border:`1px solid ${T.line}`}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:T.verde}}>#{ord.id}</span>
                            <span style={{color:T.inkH,fontSize:10}}>{new Date(ord.at).toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"})}</span>
                          </div>
                          <p style={{color:T.ink,fontSize:12,marginBottom:2}}>{ord.wa}</p>
                          <p style={{color:T.inkS,fontSize:11,marginBottom:6,lineHeight:1.4}}>{ord.addr}</p>
                          {ord.notes&&<p style={{color:T.inkH,fontSize:11,fontStyle:"italic",marginBottom:6}}>{ord.notes}</p>}
                          <div style={{height:1,background:T.line,marginBottom:6}}/>
                          {ord.items?.map((it,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                              <Thumb id={it.id} ck={icat(it.id)} s={26}/>
                              <span style={{color:T.verdeM,fontWeight:700,fontSize:11}}>{it.qty}×</span>
                              <span style={{color:T.inkS,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.n}</span>
                            </div>
                          ))}
                          <p style={{color:T.copper,fontWeight:700,fontSize:14,margin:"6px 0",fontFamily:"'Cormorant Garamond',serif"}}>{fmt(ord.total)}</p>
                          {nxt
                            ?<button className="adv-btn" style={{background:nxt.color}} onClick={()=>advance(ord.id,si)}>Mover a {nxt.label}</button>
                            :<p style={{color:T.verdeM,fontSize:11,textAlign:"center",fontStyle:"italic"}}>Completado</p>
                          }
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ CART BOTTOM SHEET ══════════════════════════════════════ */}
      {sheet&&(
        <div className="overlay" onClick={()=>setSheet(false)}>
          <div className="bottom-sheet" onClick={e=>e.stopPropagation()}>
            <div className="bs-handle"/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"14px 18px 10px",borderBottom:`1px solid ${T.line}`,flexShrink:0}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:T.ink}}>Tu carrito</span>
              <button style={{background:"none",border:"none",color:T.inkS,fontSize:22,cursor:"pointer",
                width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}
                onClick={()=>setSheet(false)}>×</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"4px 18px"}}>
              {items.length===0
                ?<p style={{textAlign:"center",color:T.inkH,padding:"44px 0",fontSize:14}}>El carrito está vacío</p>
                :items.map(it=>(
                  <div key={it.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:`1px solid ${T.bg2}`}}>
                    <div style={{width:56,height:56,borderRadius:4,overflow:"hidden",flexShrink:0}}>
                      <Img src={IMGS[it.id]} alt={it.n} fb={FB[icat(it.id)]}
                        style={{width:56,height:56,objectFit:"cover"}}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:600,color:T.ink,marginBottom:2,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.n}</p>
                      <p style={{fontSize:11,color:T.inkS}}>{fmt(it.p)} c/u</p>
                    </div>
                    <QRow id={it.id} q={it.qty} add={add} dec={dec} sm/>
                    <p style={{color:T.copper,fontWeight:700,fontSize:14,minWidth:64,
                      textAlign:"right",fontFamily:"'Cormorant Garamond',serif"}}>{fmt(it.p*it.qty)}</p>
                  </div>
                ))
              }
            </div>
            {items.length>0&&(
              <div style={{padding:"14px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10,color:T.inkS,fontSize:14}}>
                  <span>Total</span>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:T.copper}}>{fmt(total)}</span>
                </div>
                <button className="cta" onClick={()=>{setSheet(false);setPg("checkout");}}>Hacer pedido</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ NAV INFERIOR ══════════════════════════════════════════ */}
      {!isAdmin&&!isChat&&(
        <nav className="bottom-nav">
          <button className={`bn${isMenu?" bn-on":""}`} onClick={()=>setPg("menu")}>
            <IcoMenu active={isMenu}/><span>Menú</span>
          </button>
          <button className={`bn${isTrack||isDone?" bn-on":""}`} onClick={()=>setPg("track")}>
            <IcoPkg active={isTrack||isDone}/><span>Pedido</span>
          </button>
          <button className="bn-cart" onClick={()=>{setSheet(true);setPg("menu");}}>
            <div className="bn-cart-bubble">
              <IcoCart/>{qty>0&&<span className="cbadge-bottom">{qty}</span>}
            </div>
          </button>
          <button className={`bn${isChat?" bn-on":""}`} onClick={()=>setPg("chat")}>
            <IcoChat active={isChat}/><span>Milagros</span>
          </button>
          <button className={`bn${isLock||isAdmin?" bn-on":""}`} onClick={()=>setPg(unlocked?"admin":"lock")}>
            <IcoAdmin active={isLock||isAdmin}/><span>Admin</span>
          </button>
        </nav>
      )}

      {/* ══ REVISOR UX ════════════════════════════════════════════ */}
      {revOpen&&(
        <div className="overlay" onClick={()=>setRevOpen(false)}>
          <div className="bottom-sheet" style={{maxHeight:"72vh"}} onClick={e=>e.stopPropagation()}>
            <div className="bs-handle"/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
              padding:"14px 18px",borderBottom:`1px solid ${T.line}`,flexShrink:0}}>
              <div>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:T.ink}}>Revisor UX — Agente 3</p>
                <p style={{color:T.inkH,fontSize:12}}>Análisis del flujo · Salvador & Milagros</p>
              </div>
              <button style={{background:"none",border:"none",color:T.inkS,fontSize:22,cursor:"pointer"}} onClick={()=>setRevOpen(false)}>×</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
              {revBusy
                ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 0",gap:14}}>
                  <div className="rev-spin"/>
                  <p style={{color:T.inkS,fontSize:13}}>Analizando el flujo...</p>
                </div>
                :<p style={{color:T.ink,fontSize:14,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{revTxt}</p>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════ HELPERS ══════════════ */

function pill(tag){
  if(tag==="Chef")    return "pill pill-chef";
  if(tag==="Favorito"||tag==="Estrella") return "pill pill-hot";
  return "pill";
}

function Img({src,alt,style,fb,zoom,noSkeleton}){
  const [err,setErr]     = useState(false);
  const [loaded,setLoaded] = useState(false);
  const fallback = fb||"linear-gradient(160deg,#C8A878,#9A7040)";
  const h = style?.height||220;
  const w = style?.width||"100%";
  if(err) return <div style={{...style,background:fallback,width:w,height:h}}/>;
  return(
    <div style={{position:"relative",width:w,height:h,overflow:"hidden",flexShrink:0}}>
      {!loaded&&!noSkeleton&&(
        <div style={{position:"absolute",inset:0,background:"#EDE7DA",animation:"sk 1.4s ease-in-out infinite"}}/>
      )}
      <img src={src} alt={alt} loading="lazy"
        style={{...style,width:"100%",height:"100%",opacity:loaded?1:0,transition:"opacity .35s ease"}}
        className={zoom?"zoom-target":""}
        onLoad={()=>setLoaded(true)}
        onError={()=>setErr(true)}/>
    </div>
  );
}

function Thumb({id,ck,s=44}){
  return(
    <div style={{width:s,height:s,borderRadius:4,overflow:"hidden",flexShrink:0}}>
      <Img src={IMGS[id]} alt="" style={{width:s,height:s,objectFit:"cover"}} fb={FB[ck]}/>
    </div>
  );
}

function QRow({id,q,add,dec,sm}){
  const sz=sm?32:36;
  return(
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <button className="qb" style={{width:sz,height:sz}} onClick={()=>dec(id)}>−</button>
      <span style={{fontWeight:700,minWidth:20,textAlign:"center",color:T.verde,fontSize:sm?13:15}}>{q}</span>
      <button className="qb" style={{width:sz,height:sz}} onClick={()=>add(id)}>+</button>
    </div>
  );
}

function Field({label,v,set,ph}){
  return(
    <label style={{display:"flex",flexDirection:"column",gap:5,
      color:T.inkS,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".8px"}}>
      {label}
      <input className="finput" value={v} onChange={e=>set(e.target.value)} placeholder={ph}/>
    </label>
  );
}

function BackBtn({onClick}){
  return(
    <button onClick={onClick} style={{background:"none",border:"none",color:T.inkS,cursor:"pointer",
      padding:0,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function IcoMenu({active}){return(<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke={active?T.verde:T.inkH} strokeWidth="1.5" strokeLinecap="round"/></svg>);}
function IcoPkg({active}){return(<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 7l7-4 7 4v9l-7 4-7-4V7z" stroke={active?T.verde:T.inkH} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 3v13M3 7l7 4 7-4" stroke={active?T.verde:T.inkH} strokeWidth="1.5" strokeLinejoin="round"/></svg>);}
function IcoChat({active}){return(<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-4 3V5a1 1 0 011-1z" stroke={active?T.verde:T.inkH} strokeWidth="1.5" strokeLinejoin="round"/></svg>);}
function IcoAdmin({active}){return(<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="10" width="14" height="8" rx="2" stroke={active?T.verde:T.inkH} strokeWidth="1.5"/><path d="M7 10V7a3 3 0 016 0v3" stroke={active?T.verde:T.inkH} strokeWidth="1.5" strokeLinecap="round"/></svg>);}
function IcoCart(){return(<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 2h2.5l1.9 9h10l2-7H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="18" r="1.5" fill="currentColor"/><circle cx="16" cy="18" r="1.5" fill="currentColor"/></svg>);}

/* ══════════════════════════════════════════ CSS ══════════════════ */
function CSS(){return <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{background:#F5F0E8;overscroll-behavior:none}
input,button{font-family:'DM Sans',sans-serif}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:#D8CFBF;border-radius:2px}
@keyframes sk{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes pop{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes blink{0%,80%,100%{opacity:.18}40%{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}

.topbar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#FDFAF5;border-bottom:1px solid #D8CFBF;position:sticky;top:0;z-index:90}
.brand{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:#1A1612;line-height:1.2}
.brand-sub{font-size:10px;color:#A8998A;letter-spacing:.5px}
.cart-top-btn{position:relative;background:none;border:1px solid #D8CFBF;border-radius:4px;padding:8px;color:#6B5F52;cursor:pointer;display:flex;align-items:center;justify-content:center;min-width:40px;min-height:40px}
.cbadge{position:absolute;top:-7px;right:-7px;background:#9B4A1E;color:#fff;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;border:2px solid #FDFAF5}

.hero{position:relative;width:100%;height:56vw;min-height:200px;max-height:340px;overflow:hidden;background:#EDE7DA}
.hero-vignette{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(26,22,18,.05) 0%,rgba(26,22,18,.72) 100%)}
.hero-content{position:absolute;bottom:0;left:0;right:0;padding:18px 16px}
.hero-eyebrow{font-size:10px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px}
.hero-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,9vw,56px);font-weight:700;color:#fff;line-height:.92;margin-bottom:6px;letter-spacing:-.5px}
.hero-desc{font-size:11px;color:rgba(255,255,255,.7);margin-bottom:10px}
.hero-chips{display:flex;gap:6px;flex-wrap:wrap}
.hchip{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:rgba(255,255,255,.9);padding:3px 10px;border-radius:2px;font-size:10.5px;letter-spacing:.3px}

.sect-hdr{display:flex;align-items:center;gap:10px;padding:16px 16px 10px}
.rule{flex:1;height:1px;background:#D8CFBF}
.sect-lbl{font-size:10px;font-weight:600;color:#A8998A;text-transform:uppercase;letter-spacing:1.8px;white-space:nowrap}

.feat-scroll{display:flex;gap:10px;padding:0 16px 2px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.feat-scroll::-webkit-scrollbar{display:none}
.fcard{flex-shrink:0;width:152px;background:#FDFAF5;border:1px solid #D8CFBF;border-radius:4px;overflow:hidden}
.fcard:hover .zoom-target{transform:scale(1.05)!important}
.fcard-img{position:relative;height:112px;overflow:hidden;background:#EDE7DA}
.fcard-fade{position:absolute;bottom:0;left:0;right:0;height:36px;background:linear-gradient(transparent,rgba(26,22,18,.35))}
.fcard-body{padding:8px 10px 10px}
.fcard-name{font-family:'Cormorant Garamond',serif;font-size:13.5px;font-weight:600;color:#1A1612;line-height:1.25;margin-bottom:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}

.tabs-wrap{position:sticky;top:57px;z-index:80;background:#FDFAF5;border-bottom:1px solid #D8CFBF}
.tabs{display:flex;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.tabs::-webkit-scrollbar{display:none}
.tab{flex-shrink:0;padding:11px 16px;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;color:#6B5F52;cursor:pointer;font-size:13px;font-weight:500;white-space:nowrap;min-height:44px;transition:color .18s,border-color .18s}
.tab:active{background:#EDE7DA}
.tab-on{color:#233D16!important;border-bottom-color:#233D16!important}

.cat-sec{padding:20px 14px 0}
.cat-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:#233D16;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #D8CFBF;letter-spacing:-.1px}
.grid{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:540px){.grid{grid-template-columns:1fr 1fr}}
@media(min-width:900px){.grid{grid-template-columns:1fr 1fr 1fr}}

/* Card horizontal en mobile, vertical en tablet+ */
.card{background:#FDFAF5;border:1px solid #D8CFBF;border-radius:4px;overflow:hidden;display:flex;flex-direction:row;transition:box-shadow .2s}
.card:active{opacity:.96}
@media(min-width:540px){.card{flex-direction:column}.card-img{height:200px!important;width:100%!important}}
.card:hover{box-shadow:0 4px 16px rgba(26,22,18,.09)}
.card:hover .zoom-target{transform:scale(1.04)!important}
.card-sel{border-color:#233D16!important;box-shadow:0 0 0 1px #233D16!important}
.card-img{position:relative;width:42%;flex-shrink:0;overflow:hidden;background:#EDE7DA}
.card-qdot{position:absolute;top:6px;right:6px;background:#233D16;color:#fff;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}
.card-body{padding:12px;display:flex;flex-direction:column;flex:1;min-width:0}
.card-name{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:#1A1612;margin-bottom:4px;line-height:1.25;letter-spacing:-.1px}
.card-desc{color:#6B5F52;font-size:11.5px;line-height:1.6;margin-bottom:10px;flex:1;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}
.card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:auto}

.pill{position:absolute;top:8px;left:8px;padding:3px 8px;border-radius:2px;font-size:10px;font-weight:600;letter-spacing:.3px;background:rgba(253,250,245,.9);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);color:#6B5F52}
.pill-chef{background:rgba(122,92,30,.92)!important;color:#fff!important}
.pill-hot{background:rgba(155,74,30,.92)!important;color:#fff!important}

.price{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:#9B4A1E;letter-spacing:-.1px}
.price-s{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:700;color:#9B4A1E}
.price-lg{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#9B4A1E;letter-spacing:-.2px}

.add-btn{background:#233D16;color:#fff;border:none;padding:9px 14px;border-radius:3px;cursor:pointer;font-size:12px;font-weight:600;letter-spacing:.3px;min-height:36px;white-space:nowrap;transition:background .15s}
.add-btn:active{background:#1A2E10}
.add-circle{width:32px;height:32px;border-radius:50%;background:#233D16;border:none;color:#fff;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.add-circle:active{background:#1A2E10}
.qb{border-radius:50%;border:1.5px solid #D8CFBF;background:#FDFAF5;color:#233D16;cursor:pointer;font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}
.qb:active{background:#EDE7DA}

.subpage{display:flex;flex-direction:column;height:calc(100vh - 64px);overflow:hidden}
.subpage-hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:#FDFAF5;border-bottom:1px solid #D8CFBF;flex-shrink:0;min-height:52px}
.subpage-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:#1A1612}
.subpage-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;-webkit-overflow-scrolling:touch}
.subpage-footer{padding:12px 16px;border-top:1px solid #D8CFBF;background:#FDFAF5;flex-shrink:0}

.receipt{background:#FDFAF5;border:1px solid #D8CFBF;border-radius:4px;padding:14px;margin-bottom:18px}
.rrow{display:flex;gap:10px;margin-bottom:10px;align-items:center}
.rname{font-size:13px;font-weight:600;color:#1A1612;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rname-sub{font-size:11px;color:#6B5F52;margin-top:1px}
.rprice{color:#6B5F52;font-size:12px;white-space:nowrap;margin-left:auto}
.rtotal{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid #D8CFBF;padding-top:12px;margin-top:8px;font-size:13px;color:#6B5F52}
.rtotal-n{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#9B4A1E}

.fstack{display:flex;flex-direction:column;gap:14px;margin-bottom:8px;width:100%}
.finput{background:#FDFAF5;border:1px solid #D8CFBF;border-radius:3px;padding:13px 14px;color:#1A1612;font-size:16px;width:100%;outline:none;-webkit-appearance:none;transition:border-color .2s}
.finput:focus{border-color:#233D16}
.cta{display:block;width:100%;background:#233D16;border:none;color:#fff;padding:15px;border-radius:3px;cursor:pointer;font-size:15px;font-weight:600;text-align:center;letter-spacing:.3px;min-height:52px;transition:background .15s}
.cta:active:not(:disabled){background:#1A2E10}
.cta-off{background:#D8CFBF!important;color:#A8998A!important;cursor:not-allowed!important}
.cta-sm{background:#233D16;border:none;color:#fff;padding:13px 16px;border-radius:3px;cursor:pointer;font-size:13px;font-weight:600;white-space:nowrap;flex-shrink:0;min-height:48px}
.ghost{display:block;width:100%;background:transparent;border:1px solid #D8CFBF;color:#6B5F52;padding:13px;border-radius:3px;cursor:pointer;font-size:13px;margin-top:8px;text-align:center;min-height:48px}
.ghost:active{border-color:#6B5F52}

.done-ring{display:flex;align-items:center;justify-content:center;animation:pop .4s cubic-bezier(.34,1.56,.64,1)}
.done-num{font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:700;color:#233D16;letter-spacing:-2px;line-height:1}

.tcard{background:#FDFAF5;border:1px solid #D8CFBF;border-radius:4px;padding:14px;margin-bottom:12px;animation:pop .25s ease}
.tcard-num{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:#233D16}
.stepper{display:flex;align-items:flex-start;margin-bottom:18px}
.step{display:flex;flex-direction:column;align-items:center;flex:1;position:relative}
.step:last-child{flex:none}
.sdot{width:34px;height:34px;border-radius:50%;border:1.5px solid #D8CFBF;background:#FDFAF5;display:flex;align-items:center;justify-content:center;color:#6B5F52;font-size:12px;font-weight:700;transition:all .35s;z-index:1}
.slbl{font-size:10px;color:#A8998A;margin-top:5px;text-align:center;white-space:nowrap;font-weight:600;letter-spacing:.3px;text-transform:uppercase}
.sline{position:absolute;top:16px;left:calc(50% + 17px);right:calc(-50% + 17px);height:1.5px;background:#D8CFBF;z-index:0;opacity:.5;transition:background .4s}

.chip{background:#FDFAF5;border:1px solid #D8CFBF;color:#1A1612;padding:12px 16px;border-radius:3px;cursor:pointer;font-size:13px;text-align:left;min-height:44px;transition:border-color .15s,background .15s;-webkit-tap-highlight-color:transparent}
.chip:active{border-color:#233D16;background:#EDE7DA}
.dot{width:6px;height:6px;border-radius:50%;background:#6B5F52;display:inline-block;animation:blink 1.3s infinite}
.dot:nth-child(2){animation-delay:.22s}.dot:nth-child(3){animation-delay:.44s}
.send-btn{width:48px;height:48px;border-radius:3px;background:#233D16;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .15s}
.send-btn:disabled{background:#D8CFBF;color:#A8998A;cursor:default}

.abtn{background:#FDFAF5;border:1px solid #D8CFBF;color:#6B5F52;padding:7px 12px;border-radius:3px;cursor:pointer;font-size:12px;min-height:36px;transition:all .15s}
.abtn:active{border-color:#1A1612}
.abtn-green{border-color:#233D16!important;color:#233D16!important}
.adv-btn{width:100%;border:none;color:#fff;padding:9px;border-radius:3px;cursor:pointer;font-size:11px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;min-height:36px}
.adv-btn:active{opacity:.8}

.overlay{position:fixed;inset:0;background:rgba(26,22,18,.5);z-index:200;animation:fi .18s ease;display:flex;flex-direction:column;justify-content:flex-end}
.bottom-sheet{background:#FDFAF5;border-radius:14px 14px 0 0;max-height:92vh;display:flex;flex-direction:column;animation:su .28s cubic-bezier(.34,1.05,.64,1)}
.bs-handle{width:36px;height:4px;background:#D8CFBF;border-radius:2px;margin:10px auto 2px;flex-shrink:0}

.bottom-nav{position:fixed;bottom:0;left:0;right:0;background:#FDFAF5;border-top:1px solid #D8CFBF;display:flex;align-items:center;justify-content:space-around;height:64px;z-index:100}
.bn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:none;border:none;color:#A8998A;cursor:pointer;padding:0;font-size:10px;font-weight:500;min-height:44px;transition:color .15s;-webkit-tap-highlight-color:transparent;letter-spacing:.3px}
.bn:active{color:#233D16}
.bn-on{color:#233D16!important}
.bn-cart{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}
.bn-cart-bubble{width:52px;height:52px;border-radius:50%;background:#233D16;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(35,61,22,.28);position:relative;margin-top:-18px;transition:transform .15s}
.bn-cart:active .bn-cart-bubble{transform:scale(.93)}
.cbadge-bottom{position:absolute;top:-4px;right:-4px;background:#9B4A1E;color:#fff;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;border:2px solid #FDFAF5}

.zoom-target{transform:scale(1)}
.rev-spin{width:32px;height:32px;border:2px solid #D8CFBF;border-top-color:#233D16;border-radius:50%;animation:spin .8s linear infinite}
`}</style>;}
