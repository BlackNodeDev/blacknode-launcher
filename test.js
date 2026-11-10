const puppeteer=require('/workspace/glow-canvas/node_modules/puppeteer-core');
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--user-data-dir=/tmp/lumprof'+Date.now()]});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error'||m.text().startsWith('EV'))errs.push('console: '+m.text().slice(0,150))});
await p.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:2});
const cdp=await p.target().createCDPSession();await cdp.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:'/workspace/blacknode-launcher/shots'}).catch(()=>{});
await p.goto('file:///workspace/blacknode-launcher/blacknode-launcher.html');await p.waitForFunction('window.__ready',{timeout:30000});await new Promise(r=>setTimeout(r,800));
const S=n=>p.screenshot({path:'shots/'+n+'.png'});const w=ms=>new Promise(r=>setTimeout(r,ms));
console.log('apps',await p.evaluate(()=>apps.map(a=>a.name+':'+a.status+(a.fav?'*':'')).join(', ')));
await S('home');
// alphabet drag via touch
const r=await p.$eval('#rail',e=>{const b=e.getBoundingClientRect();return{x:b.x+b.width-14,y:b.y,h:b.height}});
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x,y:r.y+r.h*.1}]});
const seen=new Set();for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x,y:r.y+r.h*(.1+i*.035)}]});await w(40);seen.add(await p.evaluate(()=>activeL))}
console.log('letters seen',[...seen].join(''),'allOpen',await p.evaluate(()=>$('#all').classList.contains('open')),'scroll',await p.evaluate(()=>$('#allList').scrollTop));
await w(200);await S('alphabet');
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await w(500);await S('allapps');
await p.evaluate(()=>closeAll());await w(500);
for(const id of ['seed-blacknode-os','seed-greybox','seed-painterly','seed-photo-room','seed-blacknode-splat','seed-glow-canvas','sys-notes']){
 await p.evaluate(id=>launch(id),id);await w(2500);
 const fr=p.frames().filter(f=>f.url().startsWith('blob:')).pop();const ok=fr?await fr.evaluate(()=>'title='+document.title+' nodes='+document.querySelectorAll('*').length).catch(e=>'err '+e.message):'noframe';
 console.log(id,ok);if(id==='seed-glow-canvas')await S('app-open');
 await p.evaluate(()=>goHome());await w(600);
 console.log(' home?',await p.evaluate(()=>!$('#appLayer').classList.contains('open')&&current===null));}
// gesture bar swipe test
await p.evaluate(()=>launch('sys-notes'));await w(800);
await p.evaluate(()=>{const g=$('#gbar');['pointerdown','pointermove','pointerup'].forEach(t=>g.addEventListener(t,e=>console.log('EV '+t+' '+e.clientY)))});const g=await p.$eval('#gbar .pill',e=>{const b=e.getBoundingClientRect();return{x:b.x+60,y:b.y}});
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:g.x,y:g.y}]});for(const d of [20,60,120])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:g.x,y:g.y-d}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await w(600);
console.log('swipe home',await p.evaluate(()=>current===null));
// add via paste
await p.evaluate(()=>editor());await w(400);await p.click('#srcSeg [data-m=code]');
await p.type('#eCode','<!DOCTYPE html><h1 id=x>Hello Josh</h1>');await p.type('#eName','Zest Test');await p.$eval('#eIcon',e=>e.value='Z');await w(300);await S('add');
await p.click('#eSave');await w(800);const id=await p.evaluate(()=>apps.find(a=>a.name==='Zest Test')?.id);console.log('added',id);
await p.evaluate(id=>launch(id),id);await w(800);console.log('added content',await p.frames().filter(f=>f.url().startsWith('blob:')).pop().evaluate(()=>document.getElementById('x')?.textContent));
await p.evaluate(()=>goHome());await w(500);
// long-press menu
await p.evaluate(()=>appMenu('seed-photo-room'));await w(400);await S('menu');await p.evaluate(()=>closeSheet());
// search calc
await p.evaluate(()=>{openSearch();$('#q').value='12*(3+4)';doSearch()});await w(400);console.log('calc',await p.$eval('#calc',e=>e.textContent));await S('search');await p.evaluate(()=>closeOverlays());
await p.evaluate(()=>openSettings());await w(500);await S('settings');
await p.evaluate(()=>exportAll());await w(1500);console.log('export programs',await p.evaluate(()=>window.__lastExport.programs.length+' size '+JSON.stringify(window.__lastExport).length));
const E=errs.filter(e=>!/GL error|WebGL|GPU|swiftshader/i.test(e));console.log('ERRORS',E.length,E.slice(0,15).join('\n'));await b.close()})();
