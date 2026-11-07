/* ---------- quiz ---------- */
function lev(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
const WHO={0:['yo'],1:['tú'],2:['él','ella','usted'],3:['nosotros','nosotras'],4:['vosotros','vosotras'],5:['ellos','ellas','ustedes']};
function q(v,t,p){return{kind:'conj',v,t,p,who:t==='imp'||t==='neg'?IMPLAB[p].toLowerCase():pick(WHO[p]),ans:conj(v,t)[p]}}
const qm=v=>({kind:'mean',v,ans:v.inf});
const isIrregularForm=(v,t,p)=>bare(v,t)[p]!==bare(plainOf(v),t)[p];
function build(ts,vs,n,o={}){
  const ps=o.pron?persons().filter(p=>o.pron.includes(p)):persons();
  const all=[];for(const v of vs)for(const t of ts)for(const p of ps)if(conj(v,t)[p]&&(!o.irrOnly||isIrregularForm(v,t,p)))all.push([v,t,p]);
  const out=[],seen=new Set();
  for(const [v,t,p] of shuffle(all)){if(out.length>=n)break;if(seen.has(v.inf+t)&&all.length>n*3)continue;seen.add(v.inf+t);out.push(q(v,t,p))}
  return out;
}
function choices(x){ // four options: the answer plus plausible wrong ones
  const set=new Set([x.ans]);
  if(x.kind==='conj'){
    const pool=[bare(plainOf(x.v),x.t)[x.p]&&!x.v.refl?bare(plainOf(x.v),x.t)[x.p]:null,
      ...shuffle(conj(x.v,x.t).filter(Boolean)),...shuffle(TT.map(t=>conj(x.v,t.id)[x.p]).filter(Boolean))];
    for(const f of pool){if(set.size>=4)break;if(f)set.add(f)}
  }else{
    const other=pick(VERBS.filter(v=>v!==x.v&&!v.refl&&v.rank<=300));set.add(other.inf);
    const r=x.v.root,stem=r.slice(0,-2);
    for(const e of shuffle(['ar','er','ir']))if(set.size<4&&stem+e!==r&&!verbBy(stem+e))set.add(stem+e+(x.v.refl?'se':''));
  }
  while(set.size<4)set.add(pick(VERBS).inf);
  return shuffle([...set]);
}
function diagnose(x,got){
  const g=strip(got);
  if(x.kind==='mean'){const v=VERBS.find(v=>strip(v.inf)===g);return v?['Wrong verb.',`${v.inf} means "${v.en}".`]:['Not a real verb.','That spelling does not match any verb in the dictionary.']}
  const hits=[];for(const t of TT)conj(x.v,t.id).forEach((f,i)=>{if(f&&strip(f)===g&&!(t.id===x.t&&i===x.p))hits.push([t.id,i])});
  const L_=(t,i)=>(t==='imp'||t==='neg'?IMPLAB:LAB)[i];
  let h=hits.find(([t,i])=>i===x.p);if(h)return['Right verb, wrong tense.',`That is the ${tn(h[0])}, but this one asks for the ${tn(x.t)}.`];
  h=hits.find(([t])=>t===x.t);if(h)return['Right tense, wrong person.',`That is the ${L_(h[0],h[1])} form. This one asks for ${x.who}.`];
  if(hits[0])return['Right verb, wrong form.',`That is the ${L_(...hits[0])} form of the ${tn(hits[0][0])}.`];
  if(!formIndex)buildIndex();const vs=formIndex.get(g);
  if(vs&&!vs.has(x.v)){const v=[...vs][0];return['Wrong verb.',`That is a form of ${v.inf} (${v.en}).`]}
  if(!x.v.refl&&strip(bare(plainOf(x.v),x.t)[x.p]||'')===g)return['Regular pattern, irregular verb.',`${x.v.inf} breaks the regular pattern in this form.`];
  return null;
}
function showSteps(v,t,i){
  const f=conj(v,t)[i];
  popModal(`<h2 style="font-size:22px">Conjugation steps</h2><div class="card" style="text-align:center"><b>${(t==='imp'||t==='neg'?IMPLAB:LAB)[i]} (${v.inf.toUpperCase()})</b> in ${tn(t)}<div style="font-family:var(--display);font-size:28px;font-weight:800;color:var(--blue)">${f}</div><div class="muted"><i>${english(v,t,+i)}</i></div></div>
  <ol class="ol">${steps(v,t,+i).map(s=>`<li>${s}</li>`).join('')}</ol><button class="btn" id="mc">Close</button>`);
  document.getElementById('mc').onclick=closeModal;
}
function recordAnswer(x,ok){
  if(x.kind==='conj'){const st=S.st[x.t]||(S.st[x.t]={c:0,n:0});st.n++;if(ok)st.c++}
  const vs=S.vs[x.v.inf]||(S.vs[x.v.inf]={c:0,n:0});vs.n++;if(ok)vs.c++;
  if(x.kind!=='conj')return;
  const key=x.v.inf+'|'+x.t+'|'+x.p;
  if(ok){if(S.miss.includes(key)){S.missOk[key]=(S.missOk[key]||0)+1;if(S.missOk[key]>=2){S.miss=S.miss.filter(k=>k!==key);delete S.missOk[key]}}}
  else{if(!S.miss.includes(key))S.miss.push(key);S.missOk[key]=0}
}
function quiz(qs,opt){
  if(!qs.length)return;
  const mode=opt.mode||'type';
  let i=0,total=qs.length,okN=0,badN=0,cur,phase,typoUsed;
  const mistakes=[],covered=[...new Set(qs.map(x=>x.v))];
  const exit=()=>opt.back?opt.back():closeSheet();
  open(`<div class="qtop"><button class="x" aria-label="Quit" id="cx">×</button><div class="prog"><i id="pb" style="width:0"></i></div>
    <span class="small tally"><span class="muted" id="pc"></span> <span class="okc">✓<b id="okn">0</b></span> <span class="badc">✗<b id="badn">0</b></span></span></div>
  <div class="card prompt" id="pr"></div><div id="io" class="stack"></div><div id="fb"></div><div class="spacer"></div><div id="ctl" class="stack"></div>`);
  const $=id=>document.getElementById(id),io=$('io'),fb=$('fb'),ctl=$('ctl');
  $('cx').onclick=exit;
  function tally(){$('okn').textContent=okN;$('badn').textContent=badN;$('pb').style.width=i/total*100+'%';$('pc').textContent=`${Math.min(i+1,total)}/${total}`}
  function next(){
    if(i>=total)return finish();
    cur=qs[i];phase='ask';typoUsed=false;tally();fb.innerHTML='';
    const c=cur.kind==='conj',gloss=c?english(cur.v,cur.t,cur.p):'';
    $('pr').innerHTML=c?`<span class="tchip">${tn(cur.t)}</span>${opt.hideInf?'':`<div class="inf">${cur.v.inf}</div>`}${opt.hideEn?'':`<div class="en">${gloss}</div>`}<div class="who">${SUBJ.has(cur.t)?'que ':''}${cur.who} …</div>`
      :`<span class="tchip">Meaning</span><div class="inf" style="font-size:30px">${cur.v.en}</div>${cur.v.refl?'<div class="en">reflexive</div>':''}`;
    if(mode==='type'){
      io.innerHTML=`<input class="answer" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer" placeholder="${c?'Type the form':'Type the Spanish verb'}">
        <div class="accents">${['á','é','í','ó','ú','ñ','ü'].map(ch=>`<button data-c="${ch}" aria-label="Insert ${ch}">${ch}</button>`).join('')}</div><div class="small" id="hint"></div>`;
      const ans=$('ans');
      io.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const s=ans.selectionStart??ans.value.length,e=ans.selectionEnd??s;ans.value=ans.value.slice(0,s)+b.dataset.c+ans.value.slice(e);ans.focus();ans.setSelectionRange(s+1,s+1)});
      ans.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();phase==='ask'?submit(norm(ans.value),true):next2()}};
      ans.oninput=()=>{$('hint').textContent='';if(S.auto&&norm(ans.value)===cur.ans)submit(cur.ans,true)};
      ctl.innerHTML=`<button class="btn" id="ck">Check</button>`;$('ck').onclick=()=>phase==='ask'?submit(norm(ans.value),true):next2();ans.focus();
    }else if(mode==='mc'){
      io.innerHTML=choices(cur).map(o=>`<button class="opt" data-o="${o}">${o}</button>`).join('');ctl.innerHTML='';
      io.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{if(phase!=='ask')return;submit(b.dataset.o,false);
        io.querySelectorAll('[data-o]').forEach(o=>{o.classList.toggle('right',o.dataset.o===cur.ans);o.classList.toggle('wrong',o===b&&o.dataset.o!==cur.ans)})});
    }else{
      io.innerHTML=`<div class="card prompt muted">Say or think the answer, then reveal it.</div>`;
      ctl.innerHTML=`<button class="btn" id="rv">Reveal answer</button>`;
      $('rv').onclick=()=>{io.innerHTML=`<div class="card prompt"><div class="inf" style="color:var(--blue)">${cur.ans}</div><button class="speak" id="sa">${ICON.speak.replace('<svg','<svg width="22" height="22"')} Hear it</button></div>`;
        $('sa').onclick=()=>speak(cur.ans,true);speak(cur.ans);
        ctl.innerHTML=`<div class="row"><button class="btn ghost" id="no">I was wrong</button><button class="btn" id="yes">I was right</button></div>`;
        $('no').onclick=()=>{record(false,'');next2()};$('yes').onclick=()=>{record(true);next2()}};
    }
  }
  function record(ok,got){recordAnswer(cur,ok);ok?okN++:badN++;if(!ok)mistakes.push({x:cur,got});save();i++;tally()}
  function next2(){next()}
  function submit(got,typed){
    if(!got)return;
    const exact=got===cur.ans,loose=strip(got)===strip(cur.ans),ok=exact||(typed&&loose&&!S.strict);
    if(!ok&&typed&&S.typo&&!typoUsed&&lev(strip(got),strip(cur.ans))<=2&&got.length>2){typoUsed=true;$('hint').innerHTML='<span class="badc">🤔 There might be a typo. Check it, then press Check again.</span>';return}
    phase='fb';record(ok,got);
    const ans=$('ans');if(ans){ans.disabled=true;ans.className='answer '+(ok?'ok':'bad')}
    const c=cur.kind==='conj',say=(c&&SUBJ.has(cur.t)?'que ':'')+(c?cur.who+' ':'')+cur.ans;
    if(ok){
      speak(say);
      if(exact&&S.pause!=='always'){fb.innerHTML=`<div class="fb ok">¡Correcto!</div>`;phase='wait';setTimeout(()=>{if(phase==='wait')next()},mode==='mc'?900:650);return}
      fb.innerHTML=`<div class="fb ok">${exact?'¡Correcto!':'Correct, but mind the accent:'} <span class="c">${exact?'':cur.ans}</span></div>`;
    }else{
      const d=diagnose(cur,got);
      fb.innerHTML=`<div class="fb bad"><div>That's incorrect…</div>
        <div class="cmp"><div>✓ <span class="c">${hl(cur.ans,got)}</span> <button class="speak" id="sa" aria-label="Hear it">${ICON.speak.replace('<svg','<svg width="20" height="20"')}</button></div>
        <div>✗ <span class="c wrongc">${hl(got,cur.ans)}</span></div>${c?`<div class="muted small"><i>${english(cur.v,cur.t,cur.p)}</i></div>`:''}</div>
        ${d?`<p class="diag"><b>${d[0]}</b> ${d[1]}</p>`:''}${c&&d&&/tense/.test(d[0])?`<p class="small muted" style="margin:0">${T[cur.t].use}</p>`:''}</div>`;
      $('sa').onclick=()=>speak(say,true);
    }
    ctl.innerHTML=`<div class="row">${c?'<button class="btn ghost" id="stp">Steps</button>':''}<button class="btn" id="nx">${i>=total?'See results':'Next question'}</button></div>`;
    if(c){const x=cur;$('stp').onclick=()=>showSteps(x.v,x.t,x.p)}
    $('nx').onclick=next;$('nx').focus();
  }
  function finish(){
    const pct=Math.round(okN/total*100),stars=pct>=100?3:pct>=80?2:pct>=60?1:0;
    S.xp+=okN*10;bumpStreak();S.quizzes++;S.scoreSum+=pct;S.days[today()]=(S.days[today()]||0)+1;
    if(opt.level&&stars>(S.lv[opt.level.id]||0))S.lv[opt.level.id]=stars;
    save();header();
    const nextLvl=opt.level&&stars?LEVELS[LEVELS.indexOf(opt.level)+1]:null;
    const msg=pct===100?'You made that look easy!':pct>=80?'So close! Keep practising to get 100%.':pct>=60?'Good effort. Review the mistakes below.':'Keep going. Each mistake is now in your Smart review.';
    body.innerHTML=`<div class="prompt stack" style="align-items:center"><div class="big" style="font-size:64px">${pct}%</div>
      <p class="muted" style="margin:0">${opt.title} – ${okN} of ${total} correct</p><p style="margin:0;font-size:18px">${msg}</p>
      ${opt.level?starHtml(stars):''}<span class="pill gold">🔥 ${S.streak} day streak</span>
      ${opt.level&&!stars?'<p class="muted small" style="margin:0">Score 60% or more to unlock the next level.</p>':''}</div>
      ${mistakes.length?`<section class="stack"><h2 style="font-size:20px">Your mistakes</h2>${mistakes.map((m,k)=>`<div class="card mist"><div class="row"><span class="muted small">${m.x.kind==='conj'?`${m.x.who} (${m.x.v.inf.toUpperCase()}) · ${tn(m.x.t)}`:m.x.v.en}</span>${m.x.kind==='conj'?`<button class="speak" data-ms="${k}" aria-label="Steps">${ICON.steps.replace('<svg','<svg width="20" height="20"')}</button>`:''}</div>
        <div>✓ <b>${hl(m.x.ans,m.got)}</b> ${m.got?`&nbsp; ✗ <span class="wrongc">${hl(m.got,m.x.ans)}</span>`:''}</div></div>`).join('')}
        <p class="muted small" style="margin:0">${mistakes.filter(m=>m.x.kind==='conj').length?'These forms are in your Smart review and come back until you get them right twice.':''}</p></section>`:''}
      <section><div class="row"><h2 style="font-size:20px">Verbs covered</h2><span class="muted small">Star to add to My verbs</span></div>
      <div>${covered.map(v=>`<div class="vrow"><button class="star" data-star="${v.inf}" aria-pressed="${S.fav.includes(v.inf)}" aria-label="Save ${v.inf}">★</button><button class="open" data-v="${v.inf}"><b>${v.inf}</b><span class="m">${v.en}</span></button></div>`).join('')}</div></section>
      <div class="spacer"></div>
      ${nextLvl?'<button class="btn" id="nx">Next level</button>':''}
      ${mistakes.length?`<button class="btn ${nextLvl?'ghost':''}" id="rq">Quiz my mistakes</button>`:''}
      <button class="btn ghost" id="again">${opt.level&&!stars?'Try again':'Done'}</button>`;
    body.querySelectorAll('[data-ms]').forEach(b=>b.onclick=()=>{const m=mistakes[+b.dataset.ms].x;showSteps(m.v,m.t,m.p)});
    body.querySelectorAll('[data-star]').forEach(b=>b.onclick=()=>{toggleFav(b.dataset.star);b.setAttribute('aria-pressed',S.fav.includes(b.dataset.star))});
    body.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>verbSheet(verbBy(b.dataset.v)));
    document.getElementById('again').onclick=()=>opt.level&&!stars?intro(opt.level):exit();
    if(nextLvl)document.getElementById('nx').onclick=()=>intro(nextLvl);
    const rq=document.getElementById('rq');if(rq)rq.onclick=()=>quiz(shuffle(mistakes.map(m=>({...m.x}))),{...opt,level:null,title:'Mistakes'});
  }
  next();
}

show('learn');
