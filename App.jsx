importer { useState, useRef, useEffect } de "react" ;

MODES const = [
  { clé : "code", icône : "⟨/⟩", étiquette : "Code", couleur : "#3b82f6", desc : "Bugs, performance, architecture, sécurité" },
  { clé : "design", icône : "✦", étiquette : "Design", couleur : "#a855f7", desc : "UI/UX, accessibilité, réactif, conversions" },
  { clé : "business",icon: "◈", label: "Business", color: "#f59e0b", desc: "SaaS, pricing, growth, legal, stratégie" },
];

Const MODE_PROMPTS = {
  Code : `Tu es un expert en scanner de code. Analysez tout le code ou la description du projet et détectez-le : bugs, failles de sécurité, mauvaises pratiques, problèmes de performance, architecture défaillante, cette technique. Donne toujours : 1) liste des défauts trouvés avec sévérité (🔴 critique / ��� majeur / 🟡 mineur), 2) correction concrète avec code corrigé. Si sur la demande de créer du code ou un site web, génère du HTML/CSS/JS complet dans un bloc \`\`\`html. Réponds en français. `,
  Conception : `Tu es un expert en scanner UI/UX. Analysez tout le design, l'interface ou la description et détectez : problèmes d'accessibilité, mauvaise hiérarchie visuelle, UX cassée, responsive défaillant, couleurs non contrastées, CTA peu clairs, friction dans les parcours utilisateur. Donne toujours : 1) défauts avec sévérité (🔴 critique / 🟠 majeur / 🟡 mineur), 2) corrections concrètes. Si on te demande de créer une page ou une interface, génère du HTML/CSS complet dans un bloc \`\`\`html. Réponds en français. `,
  entreprise : `Tu es un expert en SaaS d'entreprise scanner. Analyser tout modèle, idée, stratégie ou document business et détecter : failles dans le business model, pricing mal calibré, ICP flou, go-to-market risqué, métriques ignorées, problèmes légaux (RGPD, CGU), erreurs de positionnement. Donne toujours : 1) défauts avec sévérité (🔴 critique / 🟠 majeur / 🟡 mineur), 2) recommandations actionnables. Réponds en français. `,
};

Const QUICK_ACTIONS = {
  Code : [
    { icon: "🔍", label: "Scanner mon code", prompt: "Scanne ce code et liste tous les défauts :" },
    { icon: "🌐", label: "Créer un site web", prompt: "Crée une landing page SaaS moderne, professionnelle et optimisée pour les conversions" },
    {icône : "🔐", étiquette : "Audit sécurité", prompte : "Fais un audit de sécurité complet de ce code et liste toutes les vulnérabilités :" },
    { icône : "⚡", étiquette : "Performance de l'optimiseur", invite : "Analyse et optimise les performances de ce code :" },
    { icon: "🏗️", label: "Revoir l'architecture", prompt: "Analyser l'architecture de ce projet et proposer des améliorations :" },
    { icône : "📄", label : "Créer un tableau de bord", prompt : "Crée un dashboard SaaS complet avec sidebar, métriques et graphiques en HTML/CSS/JS" },
  ],
  Conception : [
    {icône : "🔍", étiquette : "Scanner mon design", invite : "Scanne cette interface et liste tous les défauts UX/UI :" },
    { icône : "🎨", label : "Créer une page de destination", prompt : "Crée une page de destination SaaS avec un design moderne, épuré et optimisé pour les conversions" },
    { icône : "♿", label : "Audit accessibilité", invite : "Fais un audit d'accessibilité complet de cette interface :" },
    { icon: "📱", label: "Vérifier responsive", prompt: "Analyse et corrige les problèmes responsive de cette interface :" },
    { icône : "💰", étiquette : "Prix de la page", invite : "Crée une page prix SaaS moderne avec 3 plans et bascule mensuel/annuel" },
    { icône : "🔐", étiquette : "Page login moderne", invite : "Crée une page login/register épurée et moderne en HTML/CSS" },
  ],
  affaires : [
    { icon: "🔍", label: "Scanner mon SaaS", prompt: "Scanne mon business model SaaS et liste tous les défauts :" },
    { icône : "💡", label : "Valider une idée", prompt : "Analysez cette idée de SaaS et identifiez les risques et opportunités :" },
    { icône : "💰", label : "Audit pricing", prompt : "Analyse ma stratégie de pricing et identifie ce qui doit être corrigé :" },
    { icône : "📈", label : "Audit croissance", prompt : "Analyse ma stratégie de croissance SaaS et liste les défauts :" },
    {icône : "⚖️", label : "Vérifier le légal", prompt : "Quels problèmes légaux (RGPD, CGU, contrats) dois-je corriger pour mon SaaS ?" },
    { icône : "🚀", label : "Stratégie lancement", prompt : "Analyse ma stratégie de lancement SaaS et liste ce qui peut échouer :" },
  ],
};

styles const = `
@import url('https://fonts.googleapis.com/css2 ? famille=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
*,*::avant,*::après{box-sizing:border-box;margin:0;padding:0}
corps{fond:#07090f;font-family:'DM Sans',sans-serif;couleur:#e8eaf0;min-height:100vh}
:root{--bg:#07090f;--s1:#0d1117;--s2:#111820;--bd:#1a2535;--tx:#e8eaf0;--mu:#5a7090;--da:#ef4444}
.app{display:flex;flex-direction:colonne;hauteur:100vh;max-width:1200px;marge:0 auto}
/* ── EN-TÊTE ── */
.hdr{display:flex;align-items:center;justifier-content:espace-between;padding:13px 22px;border-bottom:1px solid var(--bd);background:var(--bg);flex-shrink:0;position:relative;z-index:20}
.hdr::after{content:'';position:absolue;bottom:-1px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--ac,#00d4aa),transparent);opacité:.7;transition:arrière-plan .4s}
.logo{display:flex;align-items:center;space:10px}
.logo-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justifiy-content:center;font-size:16px;font-weight:700;transition:tous .3s;arrière-plan:linear-gradient(135deg,var(---ac1),var(--ac2));couleur:#07090f;font-family:'Syne',sans-serif}
.nom-du-logo{famille-de-la-police:'Syne',sans-serif ;poids-de-la-police:800;taille-de-la-police:16px;espacement-de-la lettre:-.3px;arrière-plan:linéaire-gradient(90deg,var(--ac,#00d4aa),var(---ac2,#3b82f6));-webkit-arrière-plan-clip-clip:texte ;-webkit-text-rempli-couleur:transparent;arrière-clip-plan:texte}
.logo-sub{font-size:10px;color:var(--mu);letter-spacing:.8px;text-transform: majusculese;font-weight:300}
.hdr-right{display:flex;align-items:center;gap:8px}
.live-badge{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:20px;background:var(--s1);border:1px solid var(--bd);font-size:11px;color:var(--mu)}
.live-dot{width:6px;height:6px;border-radius:50%;background:#00d4aa;box-shadow:0 0 6px #00d4aa99;animation:blink 2s ease-in-out infinite}
@keyframes blink{0%,100%{opacité:1}50%{opacité:.25}}
/* ── SÉLECTEUR DE MODE ── */
.mode-bar{display:flex;gap:6px;padding:12px 22px;border-bottom:1px solid var(--bd);background:var(--bg);flex-shrink:0}
.mode-btn{flex:1;affichage:flex;align-éléments:center;justifier-content:center;lap:8px;padding:9px 14px;border-radius:10px;border:1px solid var(--bd);arrière-plan:transparent;curseur:pointer;transition:tous .2s;font-family:'DM Sans',sans-serif;color:var(--mu);font-size:13px;font-weight:400}
.mode-btn:hover{border-color:#ffffff22;color:var(--tx);arrière-plan:#ffffff06}
.mode-btn.active{couleur:#07090f;poids-de-la police:500;couleur-bordure:transparent}
.mode-icon{font-size:14px;font-family:'Syne',sans-serif;font-weight:700}
.mode-desc{font-size:10px;opacité:.7;affichage:aucun}
@média(min-width:600px){.mode-desc{affichage:bloc}}
/* ── PRINCIPAL ── */
.main{display:flex;flex:1;overflow:hidden}
/* ── CHAT ── */
.chat{display:flex;flex-direction:column;flex:1;min-width:0;border-right:1px solid var(--bd)}
.chat.full{border-right:aucun}
.msgs{flex:1;overflow-y:auto;padding:20px 22px;display:flex;flex-direction:column;gap:16px;scrollbar-width:thin;scrollbar-color:var(--bd) transparent}
.msgs::-webkit-scrollbar{width:3px}
.msgs::-webkit-scrollbar-thumb{arrière-plan:var(--bd);border-radius:2px}
/* ── VIDE ── */
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:28px;animation:fi .4s ease}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.scanner-orb{width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;font-family:'Syne',sans-serif;font-weight:800;border:1px solid;animation:scan 3s ease-in-out infinite}
@keyframes scan{0%,100%{transform:scale(1);box-shadow:0 0 0 0 currentColor}50%{transform:scale(1.04);box-shadow:0 0 30px 4px currentColor}}
.titre-vide{famille-de-polices:'Syne',sans-serif;taille-de-la police:20px;poids-de-la police:700;alignement-de-texte:centre}
.empty-sub{color:var(--mu);font-size:13px;text-align:center;max-width:300px;line-height:1.7;font-weight:300}
.actions-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;width:100%;max-width:420px}
.action-btn{display:flex;align-items:center;gap:9px;padding:11px 13px;background:var(--s1);border:1px solid var(--bd);border-radius:10px;cursor:pointer;transition:all .2s;text-align:left}
.action-btn:hover{border-color:var(--ac,#00d4aa);fond:#ffffff05;transform:translateY(-1px)}
.action-icône{font-size:16px;flex-shrink:0}
.action-label{font-size:12.5px;color:var(--tx);font-weight:400}
/* ── MESSAGES ── */
.msg{display:flex;gap:10px;animation:mi .25s facilité}
@keyframes mi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.msg.user{flex-direction:row-reverse}
.av{width:30px;hauteur:30px;bordure-radius:8px;flex-shrink:0;affichage:flex;align-items:center;justifier-content:center;font-size:13px;font-weight:700;font-family:'Syne',sans-serif}
.av.ai{border:1px solide}
.av.usr{arrière-plan:linéaire-gradient(135deg,#a855f722,#3b82f622);bordure:1px solide #a855f733;taille de la police:12px}
.bub{max-width:82%;rembourrage:11px 15px;bordure-rayon:12px;font-size:13.5px;ligne-height:1.8;font-weight:300}
.bub.ai{arrière-plan:var(--s1);bordure:1px solide var(--bd);bordure-haut-à-la-gauche-rayon:3px}
.bub.usr{arrière-plan:linéaire-gradient(135deg,#3b82f615,#a855f615);bordure:1px solide #3b82f633;bordure-en haut-droite-radius:3px}
.bub p{marge-bas:7px}.bub p:dernier-enfant{marge-bas:0}
.bub code{fond:#1a2535;rembourrage:2px 6px;bordure-radius:4px;taille-font:11.5px;couleur:#7dd3c0;font-family:monospace}
.bub pré{background:#070b12;border:1px solid var(--bd);border-radius:8px;padding:12px;margin:9px 0;overflow-x:auto}
.bub pré code{background:none;padding:0;color:#7dd3c0;font-size:11.5px;display:block}
.bub strong{font-weight:500;couleur:#d0e8e0}
.code-bloc{marge:9px 0}
.code-block pre{margin:0;border-radius:8px 8px 0 0;border-bottom:aucun}
.code-bar{display:flex;align-items:center;justify-content:space-between;padding:6px 11px;background:#0a0f1a;border:1px solid var(--bd);border-radius:0 0 8px 8px}
.code-bar-lang{font-size:10px;color:var(--mu);text-transform:cales majuscules;espacement des lettres:.5px}
.code-bar-btns{affichage:flex;espace:5px}
.cbb{padding:3px 9px;border-radius:5px;border:1px solid var(--bd); background:transparent;color:var(--mu);font-size:11px;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
.cbb:hover{border-color:var(--ac,#00d4aa);couleur:var(--ac,#00d4aa)}
.cbb.hi{border-color:var(--ac,#00d4aa55);couleur:var(--ac,#00d4aa);fond:color-mix(en srgb,var(--ac,#00d4aa) 8%,transparent)}
/* ── TAPER ── */
.typage{affichage:flex;éléments-d'alignement:centre;écar:4px;rembourage:6px 2px}
.typeing span{width:5px;height:5px;border-radius:50%;animation:td 1.4s ease-in-out infinite;opacité:.4}
.typer span:nth-child(2){animation-delay:.2s}.typeing span:nth-child(3){animation-delay:.4s}
@keyframes td{0%,100%{opacité:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}
/* ── ENTRÉE ── */
.inp-area{padding:13px 20px;border-top:1px solide var(--bd);arrière-plan:var(--bg);flex-shrink:0}
.inp-box{arrière-plan:var(--s1);bordure:1px solide var(--bd);bordure-radius:12px;débordure:caché;transition:bordure-couleur .2s}
.inp-box:focus-within{border-color:color-mix(in srgb,var(--ac,#00d4aa) 40%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--ac,#00d4aa) 6%,transparent)}
.inp-row{display:flex;align-items:flex-end;gap:9px;rembourage:10px 12px}
.ti{flex:1;arrière-plan:aucun;bordure:non;cour:non;couleur:var(--tx);taille de la police:13,5px;famille de police:'DM Sans',sans-serif;poids-de-la police:300;redimensionner:aucun;max-hauteur:100px;hauteur de ligne:1.6;largeur-de la barre de déroulement:aucun}
.ti::placeholder{couleur:#2a3a50}
.ti::-webkit-scrollbar{affichage:aucun}
.sb{width:33px;height:33px;border-radius:8px;border:none;cursor:pointer;display:flex;align-items:center;justifier-content:center;flex-shrink:0;transition:tous .2s;font-size:14px;font-weight:700}
.sb:hover{transform:scale(1.06)}
.sb:désablé{opacité:.3;curseur:non autorisé;transformer:aucun}
.hint-row{display:flex;align-items:center;justify-content:space-between;padding:0 12px 9px;gap:8px}
.hint-mode{font-size:11px;color:var(--mu);display:flex;align-items:center;gap:5px}
.hint-mode b{padding:1px 7px;border-radius:5px;font-size:10.5px;font-weight:500}
.indice-kb{taille-de la police:10.5px;couleur:#2a3a50}
/* ── APERÇU ── */
.pv{width:50%;flex-shrink:0;display:flex;flex-direction:column;background:var(--s1);transition:width .3s}
.pv.off{largeur:0;débordement:caché}
.pv-hdr{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-bottom:1px solid var(--bd);background:var(--bg);flex-shrink:0}
.pv-title{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;color:#3b82f6;display:flex;align-items:center;gap:6px}
.pv-btns{affichage:flex;gap:5px}
.pb{padding:4px 10px;bordure-radius:6px;bordure:1px solide var(--bd);arrière-plan:transparent;couleur:var(--mu);taille de la police:11px;curseur:pointeur;transition:tous .2s;famille de polices:'DM Sans',sans-serif}
.pb:hover{border-color:#3b82f6;color:#3b82f6}
.pb.on{border-color:#3b82f6;color:#3b82f6;arrière-plan:#3b82f60a}
.pv-frame{flex:1;bordure:aucun;arrière-plan:blanc}
.pv-src{flex:1;overflow-y:auto;padding:14px;background:#070b12}
.pv-src pre{color:#7dd3c0;font-size:11.5px;font-family:monospace;white-space:pre-wrap;word-break:break-all;line-height:1.6}
.pv-vide{flex:1;affichage:flex;flex-direction:colonne;align-items:center;justifier-content:center;gap:10px;color:var(--mu);font-size:12px;text-align:center;padding:20px}
.pv-vide-icône{font-taille de la police:32px;opacité:.3}
.err{padding:8px 13px;background:#ef444411;border:1px solid #ef444433;border-radius:8px;color:var(--da);font-size:12.5px;margin-bottom:9px}
.toast{position:fixe;bas:22px;left:50%;transform:translateX(-50%);padding:8px 18px;background:#00d4aa;color:#07090f;border-radius:20px;font-size:12.5px;font-weight:500;animation:ti2 .3s ease;z-index:999}
@keyframes ti2{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
`;

Const MODE_COLORS = {
  code : { ac : "#3b82f6", ac2 : "#60a5fa", orbBg : "#3b82f615", orbBorder : "#3b82f633" },
  conception : { ac : "#a855f7", ac2 : "#c084fc", orbBg : "#a855f715", orbBorder : "#a855f733" },
  affaires : { ac : "#f59e0b", ac2 : "#fbbf24", orbBg : "#f59e0b15", orbBorder : "#f59e0b33" },
};

fonction extractHtml(text) {
  const m = text.match(/```html\n([\s\S]* ?) ```/);
  retour m ? M[1].trim() : nul ;
}

Fonction MsgContent({ contenu, onPreview, ac }) {
  parties const = []; const re = /```(html|css|javascript|js) ? \n([\s\S]* ?) ```/g;
  laisser durer = 0, m ;
  tandis que ((m = re.exec(content)) ! == nul) {
    if (m.index > last) parts.push({ t: "text", c: content.slice(last, m.index) });
    parts.push({ t : "code", lang : m[1] || "code", code : m[2].trim() }) ;
    dernier = m.index + m[0].length ;
  }
  if (last < content.length) parts.push({ t: "text", c: content.slice(last) });
  Retour <>
    {parts.map((p, i) => {
      if (p.t === "text") renvoie p.c.split("\n").map((line, j) =>
        line.trim() ? <p key={`${i}-${j}`} dangereusementSetInnerHTML={{__html :
          ligne.replace(/\*\*(. *?) \*\*/g,"<strong>$1</strong>").remplacer(/\*(. *?) \*/g,"<em>$1</em>").replace(/`([^`]+)`/g,'<code>$1</code>')
        }}/> : nul
      ) ;
      Retour (
        <div key={i} className="code-block">
          <pré><code>{p.code}</code></pré>
          <div className="code-bar">
            <span className="code-bar-lang">{p.lang}</span>
            <div className="code-bar-btns">
              <button className="cbb" onClick={() => navigator.clipboard?.writeText(p.code)}>📋 Copieur</button>
              {p.lang === "html" && <button className="cbb hi" onClick={() => onPreview(p.code)} style={{"--ac":ac}}>👁 Aperçu</button>}
            </div>
          </div>
        </div>
      ) ;
    })}
  </>;
}

fonction par défaut d'exportation App() {
  const [mode, setMode] = useState("code") ;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("") ;
  const [chargement, chargement de mise] = état d'utilisation(faux) ;
  const [erreur, setError] = useState("") ;
  const [preview, setPreview] = useState(null) ;
  const [pvMode, setPvMode] = useState("preview") ;
  const [toast, setToast] = useState(false) ;
  const bottomRef = useRef(null) ;
  const textRef = useRef(null) ;
  const m = MODES.find(x => x.key === mode) ;
  Const c = MODE_COLORS[mode] ;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, chargement]);

  // Injecter des vars CSS pour le mode actuel
  useEffect(() => {
    racine const = document.documentElement ;
    root.style.setProperty("--ac", c.ac) ;
    root.style.setProperty("--ac2", c.ac2) ;
    root.style.setProperty("--ac1", c.ac) ;
  }, [mode]) ;

  const showPreview = (html) => { setPreview(html); setPvMode("preview"); };

  const send = asynchrone (texte) => {
    const msg = texte || input.trim();
    Si (! msg || chargement) retour ;
    setError(""); setInput("") ;
    if (textRef.current) textRef.current.style.height = "auto" ;
    const hist = [...messages, { rôle : "utilisateur", contenu : msg }] ;
    setMessages(hist); setLoading(true);
    Essayer {
      Const res = attendre la récupération("https://api.anthropic.com/v1/messages", {
        Méthode : "POST",
        En-têtes : { "Content-Type" : "application/json" },
        Corps : JSON.stringify({
          modèle : "claude-sonnet-4-20250514",
          Max_tokens : 4096,
          Système : MODE_PROMPTS[mode],
          Messages : hist.map(m => ({ rôle : m.role, contenu : m.content }))
        })
      }) ;
      données const = attendre res.json();
      Si (! res.ok) lancer une nouvelle erreur (données. erreur ?. message || "API d'erreur") ;
      const reply = data.content?.map(b => b.text || "".join("") || "";
      setMessages([...hist, { role: "assistant", content: reply }]);
      const html = extractHtml(répondre) ;
      si (html) showPreview(html) ;
    } catch(e) { setError(e.message) ; }
    Enfin { setLoading(false) ; }
  };

  const onKey = e => { if (e.key === "Entrer" && ! e.shiftKey) { e.preventDefault(); send(); } };
  const onInput = e => { setInput(e.target.value) ; e.target.style.height = "auto" ; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px" ; };

  const espaces réservés = {
    Code : "Colle ton code ou décris ton problème technique...",
    Conception : "Décrivez ton interface ou colle ton HTML/CSS...",
    Business : "Décris ton SaaS, ton idée ou ta stratégie...",
  };

  Retour (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* En-tête */}
        <div className="hdr">
          <div className="logo">
            <div className="logo-icon" style={{background:`linear-gradient(135deg,${c.ac},${c.ac2})`}}>⚡</div>
            <div>
              <div className="logo-name">Scanner SaaSCraft</div>
              <div className="logo-sub">Détecter et corriger · Code · Design · Business</div>
            </div>
          </div>
          <div className="live-badge"><div className="live-dot"/>En ligne</div>
        </div>

        {/* Sélecteur de mode */}
        <div className="mode-bar">
          {MODES.map(x => (
            <touche bouton={x.key}
              className={`mode-btn ${mode === x.key ? "actif" : ""}`}
              style={mode === x.key ? {arrière-plan:`linéaire-gradient(135deg,${MODE_COLORS[x.key].ac},${MODE_COLORS[x.key].ac2})`,color:"#07090f"} : {}}
              onClick={() => { setMode(x.key) ; setMessages([]); setPreview(null) ; }}
            >
              <span className="mode-icon">{x.icon}</span>
              <span>{x.label}</span>
            </bouton>
          ))}
        </div>

        <div className="main">
          {/* Chat */}
          <div className={`chat ${! Aperçu ? "plein" : ""}`}>
            <div className="msgs">
              {messages.length === 0 && ! chargement ? (
                <div className="vide">
                  <div className="scanner-orb"
                    style={{arrière-plan:c.orbBg, borderColor:c.orbBorder, color:c.ac, textShadow:`0 0 20px ${c.ac}`}}>
                    {m.icône}
                  </div>
                  <div>
                    <div className="empty-title">Scanner {m.label}</div>
                    <div className="vide-sub">{m.desc}</div>
                  </div>
                  <div className="actions-grid">
                    {QUICK_ACTIONS[mode].map(a => (
                      <div key={a.label} className="action-btn" style={{"--ac":c.ac}} onClick={() => send(a.prompt)}>
                        <span className="action-icon">{a.icon}</span>
                        <span className="action-label">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`msg ${msg.role === "utilisateur" ? "utilisateur" : ""}`}>
                    <div className={`av ${msg.role === "utilisateur" ? "usr" : "ai"}`}
                      style={msg.rôle ! == "utilisateur" ? {arrière-plan:c.orbBg, borderColor:c.orbBorder, color:c.ac} : {}}>
                      {msg.role === "utilisateur" ? "U" : m.icon}
                    </div>
                    <div className={`bub ${msg.role === "utilisateur" ? "usr" : "ai"}`}>
                      <MsgContent content={msg.content} onPreview={showPreview} ac={c.ac} />
                    </div>
                  </div>
                ))
              )}
              {chargement && (
                <div className="msg">
                  <div className="av ai" style={{arrière-plan:c.orbBg,borderColor:c.orbBorder,color:c.ac}}>{m.icon}</div>
                  <div nom de la classe="bub ai">
                    <div className="typing">
                      {[0,1,2].map(i => <span key={i} style={{background:c.ac}}/>)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Entrée */}
            <div className="inp-area">
              {erreur && <div className="err">⚠ {erreur}</div>}
              <div className="inp-box">
                <div className="inp-row">
                  <textarea ref={textRef} className="ti" rows={1}
                    placeholder={placeholders[mode]}
                    valeur={input} onChange={onInput} onKeyDown={onKey}/>
                  <button className="sb" onClick={() => send()} disabled={loading || ! Entrée.trim()}
                    style={{background:`linear-gradient(135deg,${c.ac},${c.ac2})`,color:"#07090f",boxShadow:loading||! input.trim() ?' aucun':`0 3px 14px ${c.ac}44`}}>
➤
                  </bouton>
                </div>
                <div className="hint-row">
                  <div className="mode-indice">
Mode actif :
                    <b style={{arrière-plan:`${c.ac}18`,couleur:c.ac,bordure:`1px solide ${c.ac}33`}}>{m.icon} {m.label}</b>
                  </div>
                  <span className="hint-kb">Shift+Entrée = saut de ligne</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu */}
          <div className={`pv ${ ! Aperçu ? "off" : ""}`}>
            {aperçu ? <>
              <div className="pv-hdr">
                <div className="pv-title">🌐 Aperçu</div>
                <div className="pv-btns">
                  <button className={`pb ${pvMode==="aperçu" ?" sur":""}`} onClick={() => setPvMode("aperçu")}>👁 Rendu</button>
                  <button className={`pb ${pvMode==="code" ?" on":""}`} onClick={() => setPvMode("code")}>{"</>"} Code</button>
                  <button className="pb" onClick={() => { navigator.clipboard?.writeText(preview); setToast(true); setTimeout(()=>setToast(false),2000); }}>📋</button>
                  <button className="pb" onClick={() => setPreview(null)}>✕</button>
                </div>
              </div>
              {pvMode === "aperçu"
? <iframe className="pv-frame" srcDoc={preview} sandbox="allow-scripts" title="preview"/>
: <div className="pv-src"><pre>{prévisualisation}</pré></div>
              }
            </> : (
              <div nom de la classe="pv-vide">
                <div className="pv-empty-icon">🌐</div>
                <span>L'aperçu apparaît ici</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && <div className="toast">✅ Copié ! </div>}
    </>
  ) ;
}
