t=open('template.v1.html').read()
def R(a,b,n=1):
    global t
    assert t.count(a)==n,(a,t.count(a)); t=t.replace(a,b)
R('<meta name="application-name" content="BlackNode Launcher">','<meta name="application-name" content="BlackNode Launcher">\n<meta name="blacknode-version" content="2.0.0">')
R("""<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='26' fill='none' stroke='%238b7bff' stroke-width='3'/%3E%3Ccircle cx='32' cy='32' r='6' fill='%238b7bff'/%3E%3C/svg%3E">""",
"""<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2305050a'/%3E%3Cpath d='M22 12v38h22' fill='none' stroke='%238b7bff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">""")
R('@media (min-width:600px){','@media (min-width:600px) and (min-height:600px){')
R('#home{display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top) + 64px) 28px 0}',
  '#home{display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top) + 40px) max(28px,env(safe-area-inset-right)) 0 max(28px,env(safe-area-inset-left))}')
R('#favs{margin-top:auto;','#favs{margin-top:auto;min-height:0;overflow:auto;scrollbar-width:none;')
NEWCSS=r"""
/* ---- v2 ---- */
#wallImg{position:absolute;inset:0;z-index:0;background:center/cover no-repeat;pointer-events:none;display:none}
#wallImg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,5,10,.45),rgba(5,5,10,.75))}
body.wimg #wallImg{display:block}body.wimg #wall{background:transparent}
#topBtns{position:absolute;top:calc(env(safe-area-inset-top) + 12px);right:max(14px,env(safe-area-inset-right));z-index:5;display:flex;gap:8px}
#topBtns button{width:34px;height:34px;border-radius:50%;border:1px solid var(--line);color:var(--dim);display:grid;place-items:center;background:rgba(255,255,255,.03)}
#topBtns button:active{color:var(--acc);border-color:var(--acc)}
#topBtns svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round}
#widgets{margin-top:18px;display:flex;flex-direction:column;gap:12px}
.wl{font-size:10px;letter-spacing:3px;color:var(--dim);margin:0 0 7px 2px}
#wipList{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px}
#wipList::-webkit-scrollbar{display:none}
#wipList .r{flex:none;font-size:12px;padding:6px 12px 6px 6px;border:1px solid hsla(280,80%,75%,.3);border-radius:18px;display:flex;align-items:center;gap:7px;color:var(--fg);background:linear-gradient(90deg,rgba(176,107,255,.12),rgba(255,179,71,.05))}
#wipList .r i{width:18px;height:18px;border-radius:50%;border:1px solid var(--c);font-style:normal;font-size:9px;display:grid;place-items:center;color:var(--c);box-shadow:0 0 8px -2px var(--c)}
#wipList .muted{font-size:11px}
.wcard{border:1px solid var(--line);border-radius:18px;padding:10px 12px;background:var(--card);box-shadow:inset 0 0 calc(24px*var(--glow)) -18px var(--acc)}
#qn{width:100%;background:transparent;border:0;outline:none;resize:none;color:var(--fg);font:300 14px/1.45 var(--font);height:42px;padding:0;-webkit-user-select:text;user-select:text}
#qnS{float:right;font-size:9px;letter-spacing:2px;color:var(--acc);opacity:0;transition:opacity .3s}#qnS.on{opacity:.8}
#gbar .rec{position:absolute;left:84px;font-size:10px;letter-spacing:2px;color:var(--dim)}
#recentsV{z-index:25;background:rgba(5,5,10,.9);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);opacity:0;pointer-events:none;display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top) + 26px) 0 calc(env(safe-area-inset-bottom) + 20px)}
#recentsV.open{opacity:1;pointer-events:auto}
#recHead{display:flex;justify-content:space-between;align-items:center;padding:0 max(26px,env(safe-area-inset-right)) 0 max(26px,env(safe-area-inset-left))}
#recHead h2{margin:0;font-weight:200;font-size:28px}
#recHead button{font-size:11px;letter-spacing:2px;color:var(--dim);border:1px solid var(--line);border-radius:16px;padding:7px 12px}
#recCards{flex:1;display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;padding:26px 15%;align-items:center;scrollbar-width:none}
#recCards::-webkit-scrollbar{display:none}
.rc{flex:none;width:70%;max-width:320px;height:min(64vh,520px);scroll-snap-align:center;border-radius:28px;border:1px solid color-mix(in srgb,var(--c) 45%,transparent);position:relative;cursor:pointer;
 background:radial-gradient(circle at 50% 38%,color-mix(in srgb,var(--c) 22%,transparent),transparent 62%),linear-gradient(180deg,#121222,#07070d);box-shadow:0 0 calc(40px*var(--glow)) -14px var(--c);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;transition:transform .25s,opacity .25s}
.rc.cur{outline:1px solid var(--acc);outline-offset:4px}
.rc .ic{width:84px;height:84px;font-size:34px}.rc .ic svg{width:38px;height:38px}
.rc .t{font-size:22px;font-weight:300}.rc .live{font-size:9.5px;letter-spacing:2.5px;color:var(--dim)}
.rc .x{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);color:var(--dim);font-size:15px}
.rc.gone{transform:translateY(-120%);opacity:0}
#recEmpty{text-align:center;margin:auto;color:var(--dim);font-weight:300}
.rsec{font-size:10px;letter-spacing:3px;color:var(--acc);margin:16px 0 4px 6px}
.act,.nres{display:flex;align-items:center;gap:16px;padding:9px 6px;border-radius:16px;cursor:pointer}
.act:active,.nres:active{background:rgba(255,255,255,.04)}
.act .ic{--c:var(--acc2)}.act .nm,.nres .nm{font-size:18px}
.nres .nm small{display:block;font-size:11px;color:var(--dim);letter-spacing:1px}
.sw{width:30px;height:30px;border-radius:50%;border:2px solid transparent;box-shadow:0 0 12px -2px var(--c);background:var(--c)}
.sw.on{border-color:#fff}
#swatches{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:10px 0 4px}
.ver{display:flex;align-items:center;gap:12px;padding:12px 2px;border-bottom:1px solid var(--line);font-weight:300}
.ver div{flex:1}.ver small{display:block;color:var(--dim);font-size:11px}
.ver button{font-size:11px;letter-spacing:2px;border:1px solid var(--acc);color:var(--acc);border-radius:14px;padding:7px 12px}
.glyphs{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.glyphs button{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);font-size:17px;color:var(--acc)}
@media (hover:none),(max-width:599px),(max-height:599px){#phone{max-width:none}}
@media (orientation:landscape) and (max-height:600px){
 #home{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto auto;column-gap:28px;padding-top:calc(env(safe-area-inset-top) + 18px)}
 #clock{font-size:64px}#clockArea{grid-column:1;grid-row:1}#widgets{grid-column:1;grid-row:2;margin-top:10px;min-height:0;overflow:hidden}
 #favs{grid-column:2;grid-row:1/3;margin:40px 0 8px}#recents{grid-column:1/3;grid-row:3;margin-bottom:6px}#dock{grid-column:1/3;grid-row:4;padding-bottom:calc(env(safe-area-inset-bottom) + 8px)}
 #swipeHint{display:none}#searchHint{margin-top:12px}#rail{top:60px;bottom:70px}#qn{height:30px}
 .rc{height:68vh;width:38%}#recCards{padding:16px 30%}}
"""
R('.muted{color:var(--dim);font-size:12px;line-height:1.5}\n</style>','.muted{color:var(--dim);font-size:12px;line-height:1.5}'+NEWCSS+'</style>')
R('<canvas id="wall"></canvas>','<div id="wallImg"></div><canvas id="wall"></canvas>\n<div id="topBtns"><button id="bFs" aria-label="Toggle full screen" title="Full screen"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button></div>')
R('''Search or calculate</div>
  </div>''','''Search apps, notes, actions</div>
  </div>
  <div id="widgets">
    <div id="buildStrip"><div class="wl">NOW BUILDING</div><div id="wipList"></div></div>
    <div class="wcard" id="quick"><div class="wl">QUICK NOTE <span id="qnS">SAVED</span></div><textarea id="qn" placeholder="Next idea for the build…" rows="2"></textarea></div>
  </div>''')
R('<button class="plus" id="bAdd" aria-label="Add program">+</button>','<button id="bRec">RECENTS</button>\n    <button class="plus" id="bAdd" aria-label="Add program">+</button>')
R('<button class="home" id="bHome">◂ HOME</button>','<button class="home" id="bHome">◂ HOME</button><button class="rec" id="bRecG">▢ RECENTS</button>')
R('<div id="scrim"></div>','<section id="recentsV" class="view"><div id="recHead"><h2>Recents</h2><button id="recClear">CLEAR ALL</button></div><div id="recCards"></div></section>\n<div id="scrim"></div>')
R('<input type="file" id="fileJson"','<input type="file" id="fileImg" accept="image/*" hidden>\n<input type="file" id="fileJson"')
R('<input id="q" placeholder="Search programs or 12*7…"','<input id="q" placeholder="Apps, notes, actions or 12*7…"')
# DB
R("""function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open('blacknode-launcher',1);r.onupgradeneeded=()=>r.result.createObjectStore('programs',{keyPath:'id'});r.onsuccess=()=>res(db=r.result);r.onerror=()=>rej(r.error)})}
const tx=(m,f)=>new Promise((res,rej)=>{const t=db.transaction('programs',m),s=t.objectStore('programs');const r=f(s);t.oncomplete=()=>res(r&&r.result);t.onerror=()=>rej(t.error)});""",
"""function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open('blacknode-launcher',2);r.onupgradeneeded=()=>{const d=r.result;
  if(!d.objectStoreNames.contains('programs'))d.createObjectStore('programs',{keyPath:'id'});
  if(!d.objectStoreNames.contains('versions'))d.createObjectStore('versions',{keyPath:'vid',autoIncrement:true}).createIndex('appId','appId');
  if(!d.objectStoreNames.contains('kv'))d.createObjectStore('kv')};r.onsuccess=()=>res(db=r.result);r.onerror=()=>rej(r.error)})}
const tx=(m,f,st='programs')=>new Promise((res,rej)=>{if(!db)return rej(new Error('no db'));const t=db.transaction(st,m),s=t.objectStore(st);const r=f(s);t.oncomplete=()=>res(r&&r.result);t.onerror=()=>rej(t.error)});
const kvGet=k=>tx('readonly',s=>s.get(k),'kv'),kvSet=(k,v)=>tx('readwrite',s=>s.put(v,k),'kv'),kvDel=k=>tx('readwrite',s=>s.delete(k),'kv');
const vList=id=>tx('readonly',s=>s.index('appId').getAll(id),'versions').then(v=>(v||[]).sort((a,b)=>b.ts-a.ts));
async function snapshot(a,why){if(!a||a.system||(!a.html&&!a.url))return;try{await tx('readwrite',s=>s.add({appId:a.id,ts:Date.now(),why:why||'edit',name:a.name,icon:a.icon,accent:a.accent,type:a.type,html:a.html,url:a.url}),'versions');
  const vs=await vList(a.id);for(const v of vs.slice(12))await tx('readwrite',s=>s.delete(v.vid),'versions')}catch(e){console.warn('snapshot',e)}}""")
R("const old=apps.find(a=>a.id===d.seed);await dbPut(","const old=apps.find(a=>a.id===d.seed);const nh=b64utf8(el.textContent);if(old&&old.html&&old.html!==nh)await snapshot(old,'before bundled restore');await dbPut(")
R("html:b64utf8(el.textContent),bundled:true","html:nh,bundled:true")
# render additions
R("  buildRail();\n}","""  const wip=apps.filter(a=>a.status==='WIP');$('#wipList').innerHTML=wip.length?wip.map(a=>`<button class="r" data-id="${esc(a.id)}" style="--c:${esc(a.accent)}"><i>${esc([...(a.icon||a.name[0])].slice(0,2).join(''))}</i>${esc(a.name)}</button>`).join(''):'<div class="muted">Nothing in WIP — long-press an app to tag it.</div>';
  if(typeof renderRecents==='function'&&$('#recentsV').classList.contains('open'))renderRecents();
  buildRail();
}""")
# search
R("""function doSearch(){const q=$('#q').value.trim(),c=calcEval(q);$('#calc').textContent=c===null?'':'= '+c.toLocaleString('en-AU',{maximumFractionDigits:10});
  const r=q?apps.filter(a=>(a.name+' '+(a.notes||'')+' '+a.status).toLowerCase().includes(q.toLowerCase())):apps;$('#results').innerHTML=r.map(row).join('')||'<div class="muted">No programs match.</div>'}""",
"""const ACTIONS=[
 {n:'Settings',k:'preferences options config',i:'⚙',f:()=>openSettings()},
 {n:'Add program',k:'new install html import app',i:'+',f:()=>editor()},
 {n:'Recents',k:'switcher multitask running open apps',i:'▢',f:()=>openRecents()},
 {n:'Toggle full screen',k:'immersive edge fullscreen',i:'⤢',f:()=>toggleFs()},
 {n:'Check for updates',k:'refresh update download online',i:'↻',f:()=>checkUpdates()},
 {n:'Change accent colour',k:'theme color colour hue accent',i:'◐',f:()=>openSettings()},
 {n:'Upload wallpaper',k:'background image photo wallpaper theme',i:'▣',f:()=>$('#fileImg').click()},
 {n:'Export backup (JSON)',k:'save backup export json',i:'⇣',f:()=>exportAll()},
 {n:'Import backup',k:'restore load json import',i:'⇡',f:()=>$('#fileJson').click()},
 {n:'Quick note',k:'jot write memo note',i:'✎',f:()=>{closeOverlays();setTimeout(()=>$('#qn').focus(),80)}},
 {n:'Switch alphabet side',k:'left right hand lefty',i:'⇆',f:()=>{S.lefty=!S.lefty;saveS();applyS();toast(S.lefty?'Left-hand mode':'Right-hand mode')}}];
function noteSources(){const out=[];const add=(src,txt,open)=>{(txt||'').split(/\\n+/).map(s=>s.trim()).filter(Boolean).forEach(l=>out.push({src,l,open}))};
  try{add('Quick note',localStorage.getItem('blacknode.quick'),'quick');add('Notes app',localStorage.getItem('blacknode.notes'),'sys-notes')}catch(e){}
  apps.forEach(a=>{if(a.notes&&!a.system)out.push({src:a.name+' · notes',l:a.notes,open:a.id})});return out}
let lastNotes=[];
function doSearch(){const q=$('#q').value.trim(),ql=q.toLowerCase(),c=calcEval(q);$('#calc').textContent=c===null?'':'= '+c.toLocaleString('en-AU',{maximumFractionDigits:10});
  const r=q?apps.filter(a=>(a.name+' '+(a.notes||'')+' '+a.status).toLowerCase().includes(ql)):apps;
  const acts=ACTIONS.map((a,i)=>[a,i]).filter(([a])=>!q||(a.n+' '+a.k).toLowerCase().includes(ql)).slice(0,q?6:4);
  lastNotes=q?noteSources().filter(n=>n.l.toLowerCase().includes(ql)).slice(0,8):[];
  let h='';if(r.length)h+='<div class="rsec">PROGRAMS</div>'+r.map(row).join('');
  if(lastNotes.length)h+='<div class="rsec">NOTES</div>'+lastNotes.map((n,i)=>`<div class="nres" data-n="${i}"><div class="ic" style="--c:#9fb4ff">✎</div><div class="nm">${esc(n.l.length>60?n.l.slice(0,60)+'…':n.l)}<small>${esc(n.src.toUpperCase())}</small></div></div>`).join('');
  if(acts.length)h+='<div class="rsec">QUICK ACTIONS</div>'+acts.map(([a,i])=>`<div class="act" data-act="${i}"><div class="ic">${esc(a.i)}</div><div class="nm">${esc(a.n)}</div></div>`).join('');
  $('#results').innerHTML=h||'<div class="muted">Nothing matches.</div>'}
$('#results').addEventListener('click',e=>{const a=e.target.closest('.act'),n=e.target.closest('.nres');
  if(a){$('#search').classList.remove('open');ACTIONS[+a.dataset.act].f()}
  if(n){const x=lastNotes[+n.dataset.n];if(x.open==='quick')ACTIONS[9].f();else launch(x.open)}});""")
R("""$('#q').onkeydown=e=>{if(e.key==='Enter'){const f=$('#results .app');if(f)launch(f.dataset.id)}""","""$('#q').onkeydown=e=>{if(e.key==='Enter'){const f=$('#results .app,#results .act,#results .nres');if(f)f.click()}""")
R("function closeOverlays(){$('#search').classList.remove('open');closeAll();closeSheet()}","function closeOverlays(){$('#search').classList.remove('open');closeAll();closeSheet();closeRecents()}")
# launch / history
R("$('#frames').appendChild(f);alive.set(id,f);if(alive.size>4){","$('#frames').appendChild(f);alive.set(id,f);if(alive.size>6){")
R("""current=id;$('#curName').textContent=a.name.toUpperCase();$('#appLayer').classList.add('open');history.pushState({app:id},'');buzz(8);render()}
function goHome(fromPop){if(!current)return;current=null;$('#appLayer').classList.remove('open');closeAll();if(!fromPop&&history.state&&history.state.app)history.back()}
addEventListener('popstate',()=>{if(current)goHome(true);else if($('#sheet').classList.contains('open'))closeSheet();else closeOverlays()});""",
"""current=id;$('#curName').textContent=a.name.toUpperCase();$('#appLayer').classList.add('open');closeRecents(true);pushLayer({layer:'app',app:id});buzz(8);render()}
function pushLayer(st){if(history.state&&history.state.layer)history.replaceState(st,'');else history.pushState(st,'')}
function goHome(fromPop){closeRecents(true);if(!current){if(!fromPop&&history.state&&history.state.layer)history.back();return}current=null;$('#appLayer').classList.remove('open');closeAll();if(!fromPop&&history.state&&history.state.layer)history.back()}
addEventListener('popstate',()=>{
  if($('#sheet').classList.contains('open')){closeSheet();if(current||recOpen())history.pushState({layer:current?'app':'recents',app:current},'');return}
  if(recOpen()){closeRecents(true);if(current)history.pushState({layer:'app',app:current},'');return}
  if(current)goHome(true);else closeOverlays()});
/* ---------- recents switcher ---------- */
const recOpen=()=>$('#recentsV').classList.contains('open');
function renderRecents(){const ids=[...alive.keys()].reverse();const c=$('#recCards');
  c.innerHTML=ids.length?ids.map(id=>{const a=apps.find(x=>x.id===id);if(!a)return'';return `<div class="rc${id===current?' cur':''}" data-rid="${esc(id)}" style="--c:${esc(a.accent||'#8b7bff')}"><button class="x" data-close="${esc(id)}" aria-label="Close ${esc(a.name)}">✕</button>${icon(a)}<div class="t">${esc(a.name)}</div><div class="live">● RUNNING${id===current?' · CURRENT':''}</div></div>`}).join(''):'<div id="recEmpty">No apps running.<br><small>Opened apps stay alive here.</small></div>';
  $('#recClear').style.visibility=ids.length?'visible':'hidden'}
function openRecents(){$('#search').classList.remove('open');closeAll();closeSheet();renderRecents();$('#recentsV').classList.add('open');pushLayer({layer:'recents',app:current});const cc=$('#recCards .rc.cur');if(cc)cc.scrollIntoView({inline:'center',block:'nearest'})}
function closeRecents(silent){const was=recOpen();$('#recentsV').classList.remove('open');if(was&&!silent&&!current&&history.state&&history.state.layer==='recents')history.back()}
function killApp(id){const f=alive.get(id);if(f){f.remove();alive.delete(id)}if(current===id){current=null;$('#appLayer').classList.remove('open');if(recOpen())history.replaceState({layer:'recents'},'')}render()}
$('#recCards').addEventListener('click',e=>{const x=e.target.closest('[data-close]');if(x){e.stopPropagation();const card=x.closest('.rc');card.classList.add('gone');setTimeout(()=>{killApp(x.dataset.close);renderRecents()},220);return}
  const c=e.target.closest('.rc');if(c)launch(c.dataset.rid)});
(()=>{let y0=null,el=null;const rc=$('#recCards');rc.addEventListener('touchstart',e=>{el=e.target.closest('.rc');y0=e.touches[0].clientY},{passive:true});
  rc.addEventListener('touchmove',e=>{if(el&&y0!=null){const d=Math.min(0,e.touches[0].clientY-y0);el.style.transform=`translateY(${d}px)`;el.style.opacity=1+d/400}},{passive:true});
  rc.addEventListener('touchend',e=>{if(!el)return;const d=e.changedTouches[0].clientY-y0;if(d<-120){el.classList.add('gone');const id=el.dataset.rid;setTimeout(()=>{killApp(id);renderRecents()},220)}else{el.style.transform='';el.style.opacity=''}el=null;y0=null})})();
$('#recClear').onclick=()=>{[...alive.keys()].forEach(killApp);renderRecents();toast('All apps closed')};
$('#recentsV').addEventListener('click',e=>{if(e.target.id==='recentsV'||e.target.id==='recCards'){if(current)closeRecents(true),history.replaceState({layer:'app',app:current},'');else closeRecents()}});
$('#bRec').onclick=openRecents;$('#bRecG').onclick=openRecents;""")
# home gesture ignore textarea
R("h.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;","h.addEventListener('touchstart',e=>{if(e.target.closest('textarea,#wipList,#favs')&&e.target.closest('textarea,#wipList')){y0=null;return}y0=e.touches[0].clientY;")
# app menu
R("""<div class="menu"><button class="mi" data-a="open"><span>▸</span>Open</button>""","""<div class="menu"><button class="mi" data-a="open"><span>▸</span>Open</button>${alive.has(id)?'<button class="mi" data-a="kill"><span>■</span>Close running app</button>':''}""")
R("""${a.system?'':`<button class="mi" data-a="edit"><span>✎</span>Edit details</button>${a.type==='html'?'<button class="mi" data-a="export"><span>⇣</span>Export single HTML file</button>':''}""",
"""${a.system?'':`<button class="mi" data-a="rename"><span>Aa</span>Rename</button><button class="mi" data-a="icon"><span>◎</span>Edit icon</button><button class="mi" data-a="edit"><span>✎</span>Edit details &amp; code</button>${a.type==='html'?'<button class="mi" data-a="export"><span>⇣</span>Export app HTML</button>':''}<button class="mi" data-a="ver"><span>⟲</span>Version history</button>""")
R("""   if(act==='edit')editor(a);""","""   if(act==='edit')editor(a);
   if(act==='kill'){killApp(id);closeSheet();toast('Closed '+a.name)}
   if(act==='rename')renameSheet(a);if(act==='icon')iconSheet(a);if(act==='ver')versionSheet(a);""")
R("async function save(a){","""function renameSheet(a){openSheet(`<h3>Rename</h3><input class="inp" id="rnI" value="${esc(a.name)}" maxlength="60"><button class="btn" id="rnS">Save name</button>`);const i=$('#rnI');setTimeout(()=>{i.focus();i.select()},60);
  const go=async()=>{const n=i.value.trim();if(!n){toast('Name can’t be empty');return}a.name=n;await dbPut(a);await load();render();closeSheet();toast('Renamed to '+n)};$('#rnS').onclick=go;i.onkeydown=e=>{if(e.key==='Enter')go()}}
function iconSheet(a){const G=['✦','◆','▲','●','★','☾','⚡','♪','✿','⌘','◈','⬢','∞','☄','⚔','✎'];
  openSheet(`<h3>Edit icon</h3><div style="display:flex;gap:16px;align-items:center"><div id="icPrev">${icon(a)}</div><input class="inp" id="icI" value="${esc(a.icon||'')}" maxlength="2" placeholder="Glyph or 2 letters"></div>
  <div class="glyphs">${G.map(g=>`<button data-g="${g}">${g}</button>`).join('')}</div><label class="f">Glow colour</label><input type="color" class="inp" id="icC" value="${esc(a.accent||'#8b7bff')}"><button class="btn" id="icS">Save icon</button>`);
  const prev=()=>{$('#icPrev').innerHTML=icon(Object.assign({},a,{icon:$('#icI').value,accent:$('#icC').value}))};$('#icI').oninput=prev;$('#icC').oninput=prev;
  document.querySelector('.glyphs').onclick=e=>{const b=e.target.closest('[data-g]');if(b){$('#icI').value=b.dataset.g;prev()}};
  $('#icS').onclick=async()=>{a.icon=$('#icI').value.trim();a.accent=$('#icC').value;await dbPut(a);await load();render();closeSheet();toast('Icon updated')}}
async function versionSheet(a){let vs=[];try{vs=await vList(a.id)}catch(e){}const sz=v=>v.type==='url'?v.url:((v.html||'').length/1024).toFixed(1)+' KB';
  openSheet(`<h3>Version history</h3><p class="muted">Current: ${esc(sz(a))} · Previous versions are kept on this device (newest 12). Restoring saves the current version first.</p>
  ${vs.length?vs.map(v=>`<div class="ver"><div>${esc(new Date(v.ts).toLocaleString('en-AU',{dateStyle:'medium',timeStyle:'short'}))}<small>${esc(v.name)} · ${esc(sz(v))} · ${esc(v.why||'')}</small></div><button data-vexp="${v.vid}">⇣</button><button data-vid="${v.vid}">RESTORE</button></div>`).join(''):'<p class="muted">No previous versions yet. Editing the code (or restoring bundled apps) saves one automatically.</p>'}
  <button class="btn ghost" id="vSnap">Save a snapshot now</button>`);
  $('#vSnap').onclick=async()=>{await snapshot(a,'manual snapshot');versionSheet(a);toast('Snapshot saved')};
  $('#sheetBody').onclick=async e=>{const r=e.target.closest('[data-vid]'),x=e.target.closest('[data-vexp]');
   if(x){const v=vs.find(v=>v.vid==x.dataset.vexp);download(new Blob([v.type==='url'?v.url:v.html],{type:'text/html'}),a.name.replace(/[^\\w-]+/g,'-').toLowerCase()+'-'+new Date(v.ts).toISOString().slice(0,10)+'.html');return}
   if(!r)return;const v=vs.find(v=>v.vid==r.dataset.vid);if(!v)return;await snapshot(a,'before restore');
   Object.assign(a,{type:v.type,html:v.html,url:v.url});if(v.type!=='url')delete a.url;else delete a.html;await dbPut(a);const f=alive.get(a.id);if(f){f.remove();alive.delete(a.id)}
   await load();render();closeSheet();toast('Restored version from '+new Date(v.ts).toLocaleDateString('en-AU'))}}
async function save(a){""")
# editor snapshot
R("   const f=alive.get(o.id);if(f){f.remove();alive.delete(o.id)}\n   await dbPut(o);","   if(!isNew&&(a.html!==o.html||a.url!==o.url||a.type!==o.type))await snapshot(a,'before edit');\n   const f=alive.get(o.id);if(f){f.remove();alive.delete(o.id)}\n   await dbPut(o);")
# settings
R("""  <div class="set"><div>Accent hue<small>Blue ↔ violet ↔ magenta</small></div><input type="range" id="hueR" min="180" max="330" value="${S.hue}"></div>""",
"""  <label class="f">Accent colour</label><div id="swatches">${[[200,'Cyan'],[222,'Blue'],[250,'Indigo'],[272,'Violet'],[295,'Orchid'],[320,'Magenta']].map(([h,n])=>`<button class="sw${Math.abs(S.hue-h)<4?' on':''}" data-h="${h}" title="${n}" style="--c:hsl(${h} 95% 68%)"></button>`).join('')}<input type="color" id="accC" value="${hsl2hex(S.hue)}" style="width:44px;height:34px;border:0;background:none;padding:0" title="Custom"></div>
  <div class="set"><div>Accent hue<small>Blue ↔ violet ↔ magenta</small></div><input type="range" id="hueR" min="0" max="359" value="${S.hue}"></div>""")
R("""${['plain','stars','gradient'].map(w=>`<button data-w="${w}" class="${S.wall===w?'on':''}">${{plain:'PLAIN DARK',stars:'STARFIELD',gradient:'GRADIENT'}[w]}</button>`).join('')}</div>""",
"""${['plain','stars','gradient','image'].map(w=>`<button data-w="${w}" class="${S.wall===w?'on':''}">${{plain:'PLAIN',stars:'STARS',gradient:'GLOW',image:'PHOTO'}[w]}</button>`).join('')}</div>
  <div class="row"><button class="btn ghost" id="bWall" style="margin-top:0">Upload wallpaper</button>${S.wall==='image'?'<button class="btn ghost" id="bWallX" style="margin-top:0">Remove photo</button>':''}</div>
  <label class="f">Display &amp; updates</label>
  <div class="row"><button class="btn ghost" id="bFs2" style="margin-top:0">${document.fullscreenElement?'Exit full screen':'Full screen'}</button><button class="btn ghost" id="bUpd" style="margin-top:0">Check for updates</button></div>
  ${installEvt?'<button class="btn" id="bInst">Install as app</button>':''}""")
R("""  $('#wallS').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.wall=b.dataset.w;saveS();applyS();openSettings()};""",
"""  $('#wallS').onclick=async e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.w==='image'&&!wallData){$('#fileImg').click();return}S.wall=b.dataset.w;saveS();applyS();openSettings()};
  $('#swatches').onclick=e=>{const b=e.target.closest('[data-h]');if(!b)return;S.hue=+b.dataset.h;saveS();applyS();openSettings()};
  $('#accC').oninput=e=>{S.hue=hex2hue(e.target.value);$('#hueR').value=S.hue;saveS();applyS()};
  $('#bWall').onclick=()=>$('#fileImg').click();if($('#bWallX'))$('#bWallX').onclick=async()=>{wallData=null;try{await kvDel('wallpaper')}catch(e){}S.wall='stars';saveS();applyS();openSettings()};
  $('#bFs2').onclick=()=>{toggleFs();setTimeout(openSettings,400)};$('#bUpd').onclick=checkUpdates;if($('#bInst'))$('#bInst').onclick=async()=>{installEvt.prompt();await installEvt.userChoice;installEvt=null;openSettings()};""")
R("<p class=\"muted\" style=\"margin-top:18px\">BlackNode Launcher · ${apps.length} programs","<p class=\"muted\" style=\"margin-top:18px\">BlackNode Launcher v${VERSION} · ${apps.length} programs")
# applyS: image wallpaper
R("document.querySelector('meta[name=theme-color]').content='#05050a';startWall();layoutRail()}",
"document.querySelector('meta[name=theme-color]').content='#05050a';const wi=S.wall==='image'&&wallData;document.body.classList.toggle('wimg',!!wi);$('#wallImg').style.backgroundImage=wi?`url(\"${wallData}\")`:'';startWall();layoutRail()}")
R("   if(S.wall!=='plain'){","   if(S.wall==='image'){wallRAF=0;return}\n   if(S.wall!=='plain'){")
# boot
R("""catch(e){console.error(e);apps=[...SYS];toast('Storage unavailable — running in memory')}render();applyS();window.__ready=true})();""",
"""catch(e){console.error(e);apps=[...SYS];toast('Storage unavailable — running in memory')}
 try{wallData=await kvGet('wallpaper')||null}catch(e){}render();applyS();initPWA();window.__ready=true})();""")
V2JS=r"""
/* ---------- v2: PWA, full screen, theming, widgets, updates ---------- */
const VERSION=document.querySelector('meta[name=blacknode-version)')?.content||'2.0.0';
const HOSTED='https://blacknodedev.github.io/blacknode-launcher/';
const CACHE='blacknode-launcher-v2';const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
const isHttp=/^https?:$/.test(location.protocol);let wallData=null,installEvt=null,swReg=null;
function hsl2hex(h){const f=n=>{const k=(n+h/30)%12,a=.95*Math.min(.68,1-.68);const c=.68-a*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*c).toString(16).padStart(2,'0')};return '#'+f(0)+f(8)+f(4)}
function hex2hue(x){const r=parseInt(x.slice(1,3),16)/255,g=parseInt(x.slice(3,5),16)/255,b=parseInt(x.slice(5,7),16)/255,M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;if(!d)return S.hue;
  let h=M===r?((g-b)/d)%6:M===g?(b-r)/d+2:(r-g)/d+4;return Math.round((h*60+360)%360)}
function fsEl(){return document.fullscreenElement||document.webkitFullscreenElement}
async function toggleFs(){try{if(fsEl()){await (document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{const el=document.documentElement;await (el.requestFullscreen||el.webkitRequestFullscreen).call(el,{navigationUI:'hide'})}}catch(e){toast('Full screen not available here')}}
$('#bFs').onclick=toggleFs;
document.addEventListener('fullscreenchange',()=>{$('#bFs').innerHTML=fsEl()?'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>':'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'});
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e});
function initPWA(){if(!isHttp)return;if(!document.querySelector('link[rel=manifest]')){const l=document.createElement('link');l.rel='manifest';l.href='manifest.json';document.head.appendChild(l)}
  const ai=document.createElement('link');ai.rel='apple-touch-icon';ai.href='icon-192.png';document.head.appendChild(ai);
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js',{scope:'./'}).then(r=>{swReg=r;window.__sw='registered'}).catch(e=>{console.warn('SW',e);window.__sw='failed'})}
async function checkUpdates(){if(!navigator.onLine){toast('Offline — try again when connected');return}toast('Checking for updates…');
  try{if(isHttp){if(swReg)await swReg.update().catch(()=>{});
    const old=await caches.match('./index.html');const oldT=old?await old.text():null;const c=await caches.open(CACHE);let changed=false;
    for(const u of ASSETS){const r=await fetch(u,{cache:'reload'});if(!r.ok)continue;if(u==='./index.html'){const t=await r.clone().text();changed=oldT!==null&&t!==oldT}await c.put(u,r)}
    if(changed){toast('Update downloaded — reloading');setTimeout(()=>location.reload(),900)}else toast('Up to date · v'+VERSION)}
   else{const r=await fetch(HOSTED+'index.html',{cache:'no-store'});const t=await r.text();const v=(t.match(/name="blacknode-version" content="([^"]+)"/)||[])[1];
    if(v&&v!==VERSION){toast('v'+v+' is online — opening it');setTimeout(()=>open(HOSTED,'_blank'),900)}else toast('Up to date · v'+VERSION)}}
  catch(e){toast('Couldn’t reach the update server')}}
$('#fileImg').onchange=e=>{const f=e.target.files[0];if(!f)return;const img=new Image(),u=URL.createObjectURL(f);img.onload=async()=>{const M=1800,s=Math.min(1,M/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);wallData=c.toDataURL('image/jpeg',.86);try{await kvSet('wallpaper',wallData)}catch(err){toast('Saved for this session only')}S.wall='image';saveS();applyS();if($('#sheet').classList.contains('open'))openSettings();toast('Wallpaper set')};
  img.onerror=()=>toast('Couldn’t read that image');img.src=u;e.target.value=''};
(()=>{const q=$('#qn');try{q.value=localStorage.getItem('blacknode.quick')||''}catch(e){}let t;q.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(()=>{try{localStorage.setItem('blacknode.quick',q.value);const s=$('#qnS');s.classList.add('on');setTimeout(()=>s.classList.remove('on'),1200)}catch(e){}},300)});
  q.addEventListener('focus',()=>{q.style.height='96px'});q.addEventListener('blur',()=>{q.style.height=''})})();
"""
R("/* ---------- boot ---------- */",V2JS+"/* ---------- boot ---------- */")
# backup: versions too? include wallpaper flag only
R("const data={app:'BlackNode Launcher',version:1,","const data={app:'BlackNode Launcher',version:2,quick:localStorage.getItem('blacknode.quick')||'',")
R("if(d.sysfav)localStorage.setItem('blacknode.sysfav',JSON.stringify(d.sysfav));","if(d.sysfav)localStorage.setItem('blacknode.sysfav',JSON.stringify(d.sysfav));if(typeof d.quick==='string'&&d.quick){localStorage.setItem('blacknode.quick',d.quick);$('#qn').value=d.quick}")
open('template.html','w').write(t)
