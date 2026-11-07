// Drives an Ella Verbs quiz over adb: reads the prompt, answers with Conjuga's engine.
// usage: node ella.js [maxQuestions] [wrongEvery]
const {execSync}=require('child_process');
const E=require('./test/engine.js');
const sh=c=>execSync(c,{encoding:'utf8'});
const sleep=ms=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms);
function dump(){sh('adb shell uiautomator dump /sdcard/ui.xml');return sh('adb shell cat /sdcard/ui.xml')}
const nodes=x=>[...x.matchAll(/<node [^>]*>/g)].map(m=>{const a=m[0],g=k=>(a.match(new RegExp(k+'="([^"]*)"'))||[])[1]||'';
  const b=g('bounds').match(/\d+/g)?.map(Number)||[0,0,0,0];return{text:g('text'),desc:g('content-desc'),cx:(b[0]+b[2])>>1,cy:(b[1]+b[3])>>1}});
const ENT=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const PRON={yo:0,'tú':1,'él':2,ella:2,usted:2,ud:2,nosotros:3,nosotras:3,vosotros:4,vosotras:4,ellos:5,ellas:5,ustedes:5,uds:5};
const TMAP={'el presente':'pres','el pretérito indefinido':'pret','el pretérito imperfecto':'impf','el imperfecto':'impf','el futuro':'fut','el futuro simple':'fut',
 'el condicional':'cond','el condicional simple':'cond','el futuro próximo':'prox','el pretérito perfecto':'perf','el pretérito pluscuamperfecto':'plup',
 'el futuro perfecto':'futp','el condicional perfecto':'condp','el presente de subjuntivo':'subj','el imperfecto de subjuntivo':'isubj',
 'el pretérito perfecto de subjuntivo':'psubj','el pluscuamperfecto de subjuntivo':'plsubj','el imperativo afirmativo':'imp','el imperativo negativo':'neg'};
function solve(prompt,tense){
  const m=prompt.trim().match(/^(.+?)\s*\((.+)\)$/u);if(!m)return null;
  const who=m[1].toLowerCase().split('/')[0].replace('.','').trim(),inf=m[2].toLowerCase(),t=TMAP[tense.toLowerCase()];
  const v=E.verbBy(inf)||(/(ar|er|ir|ír)$/.test(inf)&&{inf,root:inf,en:''});if(!v||!t||!(who in PRON))return{err:`unknown: who=${who} inf=${inf} tense=${tense}`};
  let p=PRON[who];if((t==='imp'||t==='neg')&&who==='usted')p=2;if((t==='imp'||t==='neg')&&who==='ustedes')p=5;
  return{ans:E.conj(v,t)[p]};
}
function type(str,ns){
  for(const run of str.match(/[a-z ]+|[^a-z ]/g)){
    if(/^[a-z ]+$/.test(run)){sh(`adb shell input text "${run.replace(/ /g,'%s')}"`)}
    else{const k=ns.find(n=>n.desc==='Insert special character: '+run);if(!k)throw Error('no key for '+run);sh(`adb shell input tap ${k.cx} ${k.cy}`)}
  }
}
const max=+process.argv[2]||10,wrongEvery=+process.argv[3]||0;let n=0;
while(n<max){
  const ns=nodes(ENT(dump()));
  const q=ns.find(x=>/^Question \d+ of \d+$/.test(x.desc))||(ns.some(x=>/^ \/ \d+$/.test(x.text))&&{desc:'Q'});
  if(!q){console.log('no question on screen:',ns.filter(x=>x.text).map(x=>x.text).slice(0,12).join(' | '));break}
  let tn=ns.find(x=>/tap to learn about this tense/.test(x.desc));
  if(tn)tn={...tn,text:tn.desc.replace(/, tap to learn about this tense/,"")};else tn=ns.find(x=>TMAP[x.text.trim().toLowerCase()]);
  if(!tn){console.log('tense not found:',ns.filter(x=>x.text).map(x=>x.text).join(' | '));break}
  const idx=ns.indexOf(tn),prompt=ns.slice(idx+1).find(x=>/\(.+\)$/.test(x.text));
  if(!prompt){console.log('prompt not found (maybe a different quiz type):',ns.filter(x=>x.text||x.desc).map(x=>x.text||x.desc).join(' | '));break}
  const r=solve(prompt.text,tn.text.trim());n++;
  if(!r||r.err){console.log(q.desc,prompt.text,tn.text,'->',r&&r.err);break}
  const wrong=wrongEvery&&n%wrongEvery===0;
  const field=ns.find(x=>x.desc==='Input your answer here');sh(`adb shell input tap ${field.cx} ${field.cy}`);
  type(wrong?r.ans.replace(/.$/,'x'):r.ans,ns);
  sh('adb shell input keyevent 66');sleep(1200);
  console.log(q.desc,'|',tn.text,'|',prompt.text,'->',wrong?'(wrong on purpose)':r.ans);
  if(wrong){sh('adb shell input keyevent 66');sleep(1200);sh(`adb exec-out screencap -p > shots/wrong-${Date.now()}.png`);
    const nx=nodes(ENT(dump())).find(x=>x.text==='Next question');if(nx){sh(`adb shell input tap ${nx.cx} ${nx.cy}`);sleep(1000)}}
}
