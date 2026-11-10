const fs=require('fs');
// Factory build intentionally contains only the original system programs.
const html=fs.readFileSync('template.html','utf8').replace('<!--SEEDS-->','');
fs.writeFileSync('blacknode-launcher.html',html);
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/index.html',html);
console.log('BlackNode Launcher 1.1.0: '+Buffer.byteLength(html)+' bytes');
