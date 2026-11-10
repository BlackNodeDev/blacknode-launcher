const puppeteer=require('/workspace/glow-canvas/node_modules/puppeteer-core');
const URL0=process.argv[2]||'http://127.0.0.1:8765/';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--user-data-dir=/tmp/blacknode-v1'+Date.now()]});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,200))});
await p.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:2});
const w=ms=>new Promise(r=>setTimeout(r,ms));const S=n=>p.screenshot({path:'shots/v2-'+n+'.png'});const ev=f=>p.evaluate(f);
await p.goto(URL0);await p.waitForFunction('window.__ready',{timeout:20000}).catch(e=>{console.log(errs);process.exit(1)});await w(1500);
await ev(()=>{localStorage.setItem('blacknode.quick','Add splat LOD streaming\nFix greybox jump buffer');$('#qn').value=localStorage.getItem('blacknode.quick')});
await S('home');
console.log('sw',URL0.startsWith('http')?await p.waitForFunction('window.__sw',{timeout:15000}).then(()=>ev(()=>window.__sw+' ctrl? '+!!navigator.serviceWorker.controller)):'n/a (file)');
console.log('wip strip',await ev(()=>[...document.querySelectorAll('#wipList .r')].map(e=>e.textContent).join('|')));
const hist0=await ev(()=>history.length);
await ev(()=>launch('seed-greybox'));await w(2500);await ev(()=>launch('sys-notes'));await w(1200);
console.log('alive',await ev(()=>[...alive.keys()].join(',')),'current',await ev(()=>current));
await ev(()=>openRecents());await w(700);await S('recents');
console.log('recent cards',await ev(()=>document.querySelectorAll('#recCards .rc').length));
// back gesture closes recents -> back to app
await p.goBack().catch(()=>{});await w(600);console.log('after back: recents open?',await ev(()=>recOpen()),'app',await ev(()=>current));
// switch via card
await ev(()=>openRecents());await w(400);await p.click('#recCards .rc[data-rid="seed-greybox"]');await w(800);console.log('switched to',await ev(()=>current),'greybox iframe alive',await ev(()=>alive.get('seed-greybox').isConnected));
await S('app-open');
await p.goBack().catch(()=>{});await w(700);console.log('back closes app ->home',await ev(()=>current===null&&!$('#appLayer').classList.contains('open')),'still alive',await ev(()=>alive.size));
// close one from recents
await ev(()=>openRecents());await w(400);await p.click('#recCards [data-close="sys-notes"]');await w(500);console.log('after close X alive',await ev(()=>[...alive.keys()].join(',')));
await p.goBack().catch(()=>{});await w(500);console.log('recents closed by back',!await ev(()=>recOpen()));
// long press menu + versions
await ev(()=>appMenu('seed-photo-room'));await w(400);await S('menu');
await ev(async()=>{const a=apps.find(x=>x.id==='seed-photo-room');await snapshot(a,'test snapshot')});
await ev(()=>versionSheet(apps.find(x=>x.id==='seed-photo-room')));await w(500);await S('versions');
console.log('versions',await ev(()=>document.querySelectorAll('.ver').length));
await ev(()=>{const a=apps.find(x=>x.id==='seed-photo-room');renameSheet(a)});await w(300);await p.$eval('#rnI',e=>e.value='Photo Room XL');await p.click('#rnS');await w(500);console.log('renamed',await ev(()=>apps.some(a=>a.name==='Photo Room XL')));
await ev(()=>{const a=apps.find(x=>x.name==='Photo Room XL');a.html='<h1>v2</h1>';});await ev(async()=>{const a=apps.find(x=>x.name==='Photo Room XL');const vs=await vList(a.id);versionSheet(a)});await w(400);
await p.click('.ver [data-vid]');await w(700);console.log('restored html len',await ev(()=>apps.find(x=>x.id==='seed-photo-room').html.length));
// search
await ev(()=>{openSearch();$('#q').value='splat';doSearch()});await w(400);await S('search');
console.log('search sections',await ev(()=>[...document.querySelectorAll('.rsec')].map(e=>e.textContent).join(',')));
await ev(()=>{$('#q').value='update';doSearch()});console.log('action hit',await ev(()=>$('#results .act')?.textContent));await ev(()=>closeOverlays());
await ev(()=>openSettings());await w(500);await S('settings');await ev(()=>closeSheet());
await ev(()=>{S.hue=200;saveS();applyS()});await w(300);
await p.setViewport({width:915,height:412,isMobile:true,hasTouch:true,deviceScaleFactor:2});await w(800);await S('landscape');
await ev(()=>launch('seed-glow-canvas'));await w(2500);await S('landscape-app');await ev(()=>goHome());await w(500);
await ev(()=>{S.hue=250;saveS();applyS()});
if(URL0.startsWith('http')){await ev(()=>checkUpdates());await w(2500);console.log('caches',await ev(async()=>(await caches.keys()).join()+' / '+(await (await caches.open('blacknode-launcher-v2')).keys()).length));
 await p.setOfflineMode(true);await p.reload();await p.waitForFunction('window.__ready',{timeout:30000}).then(()=>console.log('OFFLINE reload OK, apps',)).catch(e=>console.log('offline FAIL',e.message));await p.setOfflineMode(false);}
const E=errs.filter(e=>!/GL error|WebGL|GPU|swiftshader|ERR_INTERNET_DISCONNECTED/i.test(e));console.log('ERRORS',E.length,E.slice(0,15).join('\n'));await b.close()})();
