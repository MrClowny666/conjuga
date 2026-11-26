// Fails if any level's quiz can ask for a form that its own or earlier lessons have not taught.
// Run: node tools/check-lessons.js   (the same check is checkLessons() in conjuga.html)
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','conjuga.html'),'utf8');
const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
const stub=()=>new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='length'?0:stub(),set:()=>true,apply:()=>stub(),construct:()=>stub()});
const ctx={addEventListener(){},history:stub(),requestAnimationFrame(){},matchMedia:()=>({matches:false,addEventListener(){}}),getComputedStyle:()=>stub(),console,document:stub(),window:stub(),navigator:{},localStorage:{getItem:()=>null,setItem(){}},location:{protocol:'file:'},speechSynthesis:stub(),setTimeout};
vm.createContext(ctx);
vm.runInContext(src+`
globalThis.OUT=(()=>{const bad=checkLessons(+(process_runs||30));
  // English to Spanish: an ambiguous prompt must accept every right form
  const acc=(inf,t,g)=>prodAcc(verbBy(inf),t,g).map(([u,t,p])=>conj(u,t)[p]);
  for(const[inf,t,g,want]of[['ser','pret',0,'fui,era,estuve,estaba'],['comer','pres',1,'comes,come,coméis,comen,comés'],['comer','pres',4,'coméis,comen'],
    ['comer','imp',1,'come,coma,comed,coman'],['poner','pres',0,'pongo,puse,ponía'],['ir','fut',3,'iremos,vamos a ir'],['hablar','prog',2,'está hablando,habla']]){
    const got=acc(inf,t,g);for(const f of want.split(','))if(!got.includes(f))bad.push('English to Spanish: '+inf+' '+t+' '+g+' does not accept '+f)}
  if(acc('tener','pres',0).includes('he'))bad.push('English to Spanish: "I have" accepts the auxiliary he');
  for(const x of CHX){const v=verbBy(x.v);if(!v||conj(v,x.t)[x.p]!==x.a)bad.push('CHX answer does not match the engine: '+x.s)}
  return{bad,levels:LEVELS.length}})();`.replace('process_runs||30','30'),ctx);
const {bad,levels}=ctx.OUT;
console.log(levels+' levels checked');
if(bad.length){console.log(bad.join('\n'));console.log(bad.length+' problems');process.exit(1)}
console.log('OK: every quiz stays inside what the lessons have taught');
