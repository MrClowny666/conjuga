// Fails if any level's quiz can ask for a form that its own or earlier lessons have not taught.
// Run: node tools/check-lessons.js   (the same check is checkLessons() in conjuga.html)
const fs=require('fs'),vm=require('vm'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','conjuga.html'),'utf8');
const src=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
const stub=()=>new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':k==='length'?0:stub(),set:()=>true,apply:()=>stub(),construct:()=>stub()});
const ctx={console,document:stub(),window:stub(),navigator:{},localStorage:{getItem:()=>null,setItem(){}},location:{protocol:'file:'},speechSynthesis:stub(),setTimeout};
vm.createContext(ctx);
vm.runInContext(src+`
globalThis.OUT=(()=>{const bad=checkLessons(+(process_runs||30));
  for(const x of CHX){const v=verbBy(x.v);if(!v||conj(v,x.t)[x.p]!==x.a)bad.push('CHX answer does not match the engine: '+x.s)}
  return{bad,levels:LEVELS.length}})();`.replace('process_runs||30','30'),ctx);
const {bad,levels}=ctx.OUT;
console.log(levels+' levels checked');
if(bad.length){console.log(bad.join('\n'));console.log(bad.length+' problems');process.exit(1)}
console.log('OK: every quiz stays inside what the lessons have taught');
