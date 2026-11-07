p='conjuga.html';s=open(p).read()
def between(a,b,new):
    global s
    i=s.index(a);j=s.index(b,i);s=s[:i]+new+s[j:]
# 1. quiz module
between('/* ---------- quiz ---------- */','</script>',open('research/quiz-part.js').read()+'\n')
# 2. state
s=s.replace("fav:[],vf:{pop:0,end:'all',refl:'include',irr:[]},favOnly:false,hidePro:false,esNames:true,expand:true});",
"fav:[],vf:{pop:0,end:'all',refl:'include',irr:[]},favOnly:false,hidePro:false,esNames:true,expand:true,\n  typo:true,auto:false,pause:'never',days:{},quizzes:0,scoreSum:0,vs:{},missOk:{},\n  cq:{what:'conj',how:'type',tenses:['pres'],pron:[0,1,2,3,4,5],verbs:'top100',n:10,hideInf:false,hideEn:false,irrOnly:false}});")
s=s.replace("let S;try{S=Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{S=fresh()}",
"let S;try{S=Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{S=fresh()}\nS.cq=Object.assign(fresh().cq,S.cq);")
# 3. practice view
between(' practice(){',' verbs(){',r''' practice(){
  const C=S.cq,tog=(arr,id)=>arr.includes(id)?arr.filter(x=>x!==id):[...arr,id];
  const VOPTS=[['top50','Top 50'],['top100','Top 100'],['top200','Top 200'],['top500','Top 500'],['all','All verbs'],['fav',`★ My verbs (${S.fav.length})`],['ar','Regular -ar'],['erir','Regular -er/-ir'],['stem','Stem-changing'],['spell','Spelling change'],['irr','Irregular'],['refl','Reflexive']];
  const pool=()=>{const k=C.verbs;if(k.startsWith('top'))return VERBS.filter(v=>v.rank<=+k.slice(3));if(k==='all')return VERBS;if(k==='fav')return VERBS.filter(v=>S.fav.includes(v.inf));if(k==='refl')return VERBS.filter(v=>v.refl);return VERBS.filter(v=>!v.refl&&v.g===k)};
  const make=()=>C.what==='conj'?build(C.tenses,pool(),C.n,{pron:C.pron,irrOnly:C.irrOnly}):shuffle(pool()).slice(0,C.n).map(qm);
  const draw=()=>{
   const seg=(key,opts)=>`<div class="seg" role="group">${opts.map(([v,l])=>`<button data-seg="${key}" data-val="${v}" aria-pressed="${C[key]===v}">${l}</button>`).join('')}</div>`;
   const sw=(k,t,d)=>`<label class="switch" for="cq-${k}"><span>${t}<br><span class="muted small">${d}</span></span><input type="checkbox" id="cq-${k}" ${C[k]?'checked':''}></label>`;
   const n=make().length;
   view.innerHTML=`<div class="stack"><h1 style="font-size:26px">Custom quiz</h1>
   <div class="card stack"><h3><span class="stepn">1</span> What to practise</h3>${seg('what',[['conj','Conjugations'],['mean','Meanings']])}
   ${C.what==='conj'?`<div class="lbl">Tenses</div><div class="chips">${TT.map(t=>`<button class="chip" data-t="${t.id}" aria-pressed="${C.tenses.includes(t.id)}">${tn(t.id)}</button>`).join('')}</div>
   <div class="lbl">Pronouns</div><div class="chips">${[0,1,2,3,4,5].filter(i=>S.vos||i!==4).map(i=>`<button class="chip" data-p="${i}" aria-pressed="${C.pron.includes(i)}">${LAB[i]}</button>`).join('')}</div>`:''}
   <div class="lbl">Verbs</div><div class="chips">${VOPTS.map(([k,l])=>`<button class="chip" data-vo="${k}" aria-pressed="${C.verbs===k}">${l}</button>`).join('')}</div></div>
   <div class="card stack"><h3><span class="stepn">2</span> How to practise</h3>${seg('how',[['type','Typing'],['mc','Multiple choice'],['flash','Flash cards']])}
   <div class="row"><span>Questions</span><div class="row"><button class="iconbtn" id="qm" aria-label="5 fewer questions">−</button><b style="min-width:2ch;text-align:center">${C.n}</b><button class="iconbtn" id="qp" aria-label="5 more questions">+</button></div></div></div>
   <div class="card"><h3><span class="stepn">3</span> Make it harder</h3>${C.what==='conj'?sw('hideInf','Hide infinitive',"Don't show the Spanish verb")+sw('hideEn','Hide English',"Don't show the English translation")+sw('irrOnly','Irregular forms only','Skip the regular forms of irregular verbs'):'<p class="muted small">Meaning quizzes show the English and ask for the Spanish infinitive.</p>'}</div>
   <button class="btn" id="go" ${n?'':'disabled'}>${n?`Start ${n} questions`:'Nothing matches these choices'}</button>
   <div class="card stack"><div class="row"><h3>Smart review</h3><span class="pill">${S.miss.length}</span></div>
   <p class="muted small" style="margin:0">Every form you miss lands here and comes back until you get it right twice.</p>
   <button class="btn ghost" id="rev" ${S.miss.length?'':'disabled'}>Review mistakes</button></div></div>`;
   view.querySelectorAll('[data-seg]').forEach(b=>b.onclick=()=>{C[b.dataset.seg]=b.dataset.val;save();draw()});
   view.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{C.tenses=tog(C.tenses,b.dataset.t);save();draw()});
   view.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{C.pron=tog(C.pron,+b.dataset.p);save();draw()});
   view.querySelectorAll('[data-vo]').forEach(b=>b.onclick=()=>{C.verbs=b.dataset.vo;save();draw()});
   for(const k of['hideInf','hideEn','irrOnly']){const el=document.getElementById('cq-'+k);if(el)el.onchange=e=>{C[k]=e.target.checked;save();draw()}}
   document.getElementById('qm').onclick=()=>{C.n=Math.max(5,C.n-5);save();draw()};
   document.getElementById('qp').onclick=()=>{C.n=Math.min(50,C.n+5);save();draw()};
   document.getElementById('go').onclick=()=>quiz(make(),{title:C.what==='conj'?(C.tenses.length===1?tn(C.tenses[0]):'Custom quiz'):'Meanings',mode:C.how,hideInf:C.what==='conj'&&C.hideInf,hideEn:C.what==='conj'&&C.hideEn});
   document.getElementById('rev').onclick=()=>quiz(shuffle(S.miss).slice(0,15).map(k=>{const[inf,t,p]=k.split('|');const v=verbBy(inf);return v&&T[t]&&conj(v,t)[+p]?q(v,t,+p):null}).filter(Boolean),{title:'Smart review'});
  };draw();
 },
''')
# 4. stats view
between(' stats(){','\n};\nfunction toggleFav',r''' stats(){
  const stars=Object.values(S.lv).reduce((a,b)=>a+b,0),avg=S.quizzes?Math.round(S.scoreSum/S.quizzes):0;
  const days=[...Array(7)].map((_,k)=>{const d=new Date(Date.now()-(6-k)*864e5);return{key:d.toISOString().slice(0,10),lab:k===6?'Today':d.toLocaleDateString('en',{weekday:'short'})}});
  const mx=Math.max(1,...days.map(d=>S.days[d.key]||0));
  const mastered=n=>VERBS.filter(v=>v.rank<=n&&S.vs[v.inf]&&S.vs[v.inf].c>=5&&S.vs[v.inf].c/S.vs[v.inf].n>=.9).length;
  view.innerHTML=`<div class="stack"><h1 style="font-size:26px">Progress</h1>
  <div class="kpis"><div class="card"><div class="big">${S.streak}</div><div class="muted small">Day streak</div></div>
  <div class="card"><div class="big">${avg}%</div><div class="muted small">Average score</div></div>
  <div class="card"><div class="big">${S.quizzes}</div><div class="muted small">Quizzes</div></div></div>
  <div class="card stack"><h3>Quizzes completed</h3><div class="bars">${days.map(d=>{const c=S.days[d.key]||0;return `<div class="bcol"><span class="bnum">${c||''}</span><i style="height:${c/mx*100}%"></i><span class="blab">${d.lab}</span></div>`}).join('')}</div></div>
  <div class="card stack"><h3>Top verbs mastered</h3><p class="muted small" style="margin:0">A verb counts as mastered after 5 correct answers at 90% accuracy or better.</p>
   ${[100,200,500].map(n=>{const tot=VERBS.filter(v=>v.rank<=n).length,m=mastered(n);return `<div><div class="row small"><span>Top ${n} verbs</span><span class="muted">${m}/${tot}</span><button class="btn sm ghost" data-top="${n}">Quiz</button></div><div class="meter"><i style="width:${m/tot*100}%"></i></div></div>`}).join('')}</div>
  <div class="card stack"><h3>Accuracy by tense</h3>${TT.filter(t=>S.st[t.id]).map(t=>{const s=S.st[t.id],p=Math.round(s.c/s.n*100);
   return `<div><div class="row small"><span>${tn(t.id)}</span><span class="muted">${p}% of ${s.n}</span></div><div class="meter"><i style="width:${p}%"></i></div></div>`}).join('')||'<p class="muted small" style="margin:0">Finish a level or a quiz to see your accuracy here.</p>'}
   <p class="muted small" style="margin:0">${stars} of ${LEVELS.length*3} level stars earned.</p></div>
  <div class="card">${settingsHtml(true)}</div>
  <button class="btn ghost" id="reset">Reset all progress</button><p class="muted small" id="resetMsg" hidden>Tap again to confirm. This clears levels, XP, saved verbs and mistakes.</p></div>`;
  bindSettings(()=>{});
  view.querySelectorAll('[data-top]').forEach(b=>b.onclick=()=>{const n=+b.dataset.top,vs=VERBS.filter(v=>v.rank<=n&&!(S.vs[v.inf]&&S.vs[v.inf].c>=5&&S.vs[v.inf].c/S.vs[v.inf].n>=.9));
    quiz(build(['pres','pret','impf','fut','subj'],vs,10),{title:`Top ${n} verbs`})});
  const r=document.getElementById('reset');r.onclick=()=>{if(r.dataset.arm){S=fresh();save();show('stats')}else{r.dataset.arm=1;r.textContent='Yes, reset everything';document.getElementById('resetMsg').hidden=false}};
 }''')
# 5. settings additions
s=s.replace("""   (all?sw('strict','Strict accents','Count "hablo" for "habló" as wrong')+sw('tts','Read quiz answers aloud'):'');""",
"""   (all?sw('strict','Check accents','Count "hablo" for "habló" as wrong')+sw('typo','Check for typos','Warn about a likely typo before marking an answer wrong')+
    sw('auto','Auto-check answers','Submit as soon as you have typed the right answer')+sw('pauseAlways','Pause on correct answers','Show the review after right answers too')+sw('tts','Read quiz answers aloud'):'');""")
s=s.replace("function bindSettings(after){for(const k of['vos','hidePro','esNames','expand','strict','tts']){const el=document.getElementById('s-'+k);if(el)el.onchange=e=>{S[k]=e.target.checked;save();after()}}}",
"function bindSettings(after){for(const k of['vos','hidePro','esNames','expand','strict','tts','typo','auto']){const el=document.getElementById('s-'+k);if(el)el.onchange=e=>{S[k]=e.target.checked;save();after()}}\n  const pa=document.getElementById('s-pauseAlways');if(pa)pa.onchange=e=>{S.pause=e.target.checked?'always':'never';save();after()}}")
s=s.replace("const sw=(k,t,d)=>`<label class=\"switch\" for=\"s-${k}\"><span>${t}${d?`<br><span class=\"muted small\">${d}</span>`:''}</span><input type=\"checkbox\" id=\"s-${k}\" ${S[k]?'checked':''}></label>`;",
"const sw=(k,t,d)=>`<label class=\"switch\" for=\"s-${k}\"><span>${t}${d?`<br><span class=\"muted small\">${d}</span>`:''}</span><input type=\"checkbox\" id=\"s-${k}\" ${(k==='pauseAlways'?S.pause==='always':S[k])?'checked':''}></label>`;")
# 6. steps modal reuse in verb page
i=s.index("    body.querySelectorAll('[data-steps]').forEach(b=>b.onclick=()=>{");j=s.index("document.getElementById('mc').onclick=closeModal});",i)+len("document.getElementById('mc').onclick=closeModal});")
s=s[:i]+"    body.querySelectorAll('[data-steps]').forEach(b=>b.onclick=()=>{const[t,i]=b.dataset.steps.split('|');showSteps(v,t,+i)});"+s[j:]
# 7. level intro with Usage + Formation lessons
between('function intro(l){','function verbSheet(v){',r'''function endingsTable(t){
  const P=persons(),lab=i=>LAB[i];
  if(AUX[t])return `<table><tr><td>Pronoun</td><td><b>haber</b></td><td><b>+ participle</b></td></tr>${P.map(i=>`<tr><td>${lab(i)}</td><td>${AUX[t][i]}</td><td>-ado / -ido</td></tr>`).join('')}</table>`;
  const cols={pres:[END.pres.ar,END.pres.er,END.pres.ir],pret:[END.pret.ar,END.pret.er,END.pret.er],impf:[END.impf.ar,END.impf.er,END.impf.er],subj:[END.subj.ar,END.subj.er,END.subj.er],fut:[FUT,FUT,FUT],cond:[COND,COND,COND]}[t];
  if(!cols)return '';
  return `<table><tr><td>Pronoun</td><td><b>-ar</b></td><td><b>-er</b></td><td><b>-ir</b></td></tr>${P.map(i=>`<tr><td>${lab(i)}</td>${cols.map(c=>`<td>-${c[i]}</td>`).join('')}</tr>`).join('')}</table>`;
}
const FORM_NOTE={pres:'Remove -ar, -er or -ir and add the present ending.',pret:'Remove the infinitive ending and add the preterite ending. -er and -ir verbs share endings.',
  impf:'Remove the infinitive ending and add the imperfect ending. -er and -ir verbs share endings.',fut:'Keep the whole infinitive and add the ending. All three groups share endings.',
  cond:'Keep the whole infinitive and add the ending. All three groups share endings.',perf:'Conjugate haber in the present, then add the past participle.',
  subj:'Take the yo present form, drop the -o, and add the "opposite" ending: -ar verbs take e, -er and -ir verbs take a.'};
function intro(l){
  const sample=groupVerbs(l.g.id).slice(0,2),t=T[l.t.id];
  open(`<div class="qtop"><button class="x" aria-label="Close" id="cx">×</button><span class="muted small">Level ${LEVELS.indexOf(l)+1}</span></div>
  <div><span class="tag">${l.t.name}</span><h1 style="font-size:30px;margin-top:8px">${l.g.name}</h1><p class="muted" style="margin-bottom:0">${l.t.ex}. Read the two short lessons, then conjugate 10 forms. Score 6 or more to unlock the next level.</p></div>
  <section class="card stack"><h2 style="font-size:20px">Usage</h2><p style="margin:0">${t.use}</p>
   <table>${t.ex.map(([es,en])=>`<tr><td style="color:var(--ink);width:50%">${es}</td><td class="muted">${en}</td></tr>`).join('')}</table></section>
  <section class="card stack"><h2 style="font-size:20px">Formation</h2><p style="margin:0">${FORM_NOTE[l.t.id]}</p><div style="overflow-x:auto">${endingsTable(l.t.id)}</div></section>
  <div class="grid2">${sample.map(v=>`<div class="card"><h3>${v.inf} <span class="muted small">${v.en}</span></h3>${table(v,l.t.id)}</div>`).join('')}</div>
  <div class="spacer"></div><div class="row"><button class="btn ghost" id="fl">Flash cards: meanings</button><button class="btn" id="st">Start level</button></div>`);
  document.getElementById('cx').onclick=closeSheet;
  document.getElementById('fl').onclick=()=>quiz(groupVerbs(l.g.id).slice(0,10).map(qm),{title:'Meanings',mode:'flash',back:()=>intro(l)});
  document.getElementById('st').onclick=()=>quiz(build([l.t.id],groupVerbs(l.g.id),10),{title:l.g.name,level:l});
}
''')
# 8. css
s=s.replace('.speak{background:none;border:0;color:var(--blue);font-weight:700;padding:4px}',r'''.speak{background:none;border:0;color:var(--blue);font-weight:700;padding:4px;vertical-align:middle}
.tally{display:flex;gap:8px;font-variant-numeric:tabular-nums}
.okc{color:var(--ok)} .badc{color:var(--bad)}
.wrongc mark,.wrongc{color:var(--bad)}
.cmp{display:flex;flex-direction:column;gap:4px;margin:8px 0;color:var(--ink);font-weight:400}
.diag{margin:6px 0 0;color:var(--ink);font-weight:400}
.opt{border:2px solid var(--line);background:var(--surface);border-radius:12px;padding:14px;font-size:19px;font-weight:700;width:100%}
.opt.right{border-color:var(--ok);background:var(--ok-soft)} .opt.wrong{border-color:var(--bad);background:var(--bad-soft)}
.stepn{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--blue-soft);color:var(--blue);font-size:14px;margin-right:6px}
.lbl{font-weight:700;font-size:14px;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}
.mist{padding:12px;display:flex;flex-direction:column;gap:4px}
.bars{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;height:140px;align-items:end}
.bcol{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px}
.bcol i{display:block;width:70%;background:var(--blue);border-radius:6px 6px 0 0;min-height:2px}
.bnum{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.blab{font-size:12px;color:var(--muted)}''')
open(p,'w').write(s)
print('ok')
