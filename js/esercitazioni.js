'use strict';
(() => {
  const {$,esc:E}=SL;
  const modes={guidata:'Guidata',allenamento:'Allenamento',autonoma:'Prova autonoma'};
  const modeInfo={
    guidata:'Verifica un passaggio per volta. Ogni risposta corretta apre il campo successivo.',
    allenamento:'Completa i campi nell’ordine che preferisci. La correzione indica il primo passaggio da rivedere.',
    autonoma:'Risolvi la traccia e consegna le risposte per accedere allo svolgimento.'
  };
  const drafts=new Map(), progressKey='sistemilab.prove.v2', fallback=new Set();
  function saved(key){
    try{const entries=JSON.parse(localStorage.getItem(key)||'[]');return new Set(Array.isArray(entries)?entries:[]);}
    catch{return new Set();}
  }
  function completed(){return new Set([...saved(progressKey),...fallback]);}
  function mark(key){
    fallback.add(key);
    try{localStorage.setItem(progressKey,JSON.stringify([...completed()]));}catch{/* La traccia resta completata nella scheda. */}
  }
  // Mantiene esatti sia i registri a 64 bit sia i decimali scritti dallo studente.
  // La coppia cifre/esponente si normalizza senza espandere potenze di dieci.
  function numericKey(value){
    const raw=String(value).trim().replaceAll('−','-').replace(',','.');
    if(!raw||raw.length>160)return null;
    const sign=raw.startsWith('-')?'-':'';
    let body=raw.replace(/^[+-]/,'');
    if(/^(?:0x[0-9a-f]+|0b[01]+)$/i.test(body))body=BigInt(body).toString();
    const parts=/^(\d*\.?\d+|\d+\.)(?:e([+-]?\d+))?$/i.exec(body);
    if(!parts)return null;
    const [whole,fraction='']=parts[1].split('.');
    const coefficient=(whole+fraction).replace(/^0+/,'');
    if(!coefficient)return '0';
    const digits=coefficient.replace(/0+$/,'');
    const exponent=BigInt(parts[2]||0)-BigInt(fraction.length)+BigInt(coefficient.length-digits.length);
    return sign+digits+'e'+exponent;
  }
  function correct(field,input){
    const raw=String(input??'').trim();
    if(!raw)return false;
    const answers=[field.answer,...(field.accept||[])];
    if(!field.numeric)return answers.some(a=>String(a).trim()===raw);
    if(/\bdecimale\b/i.test(field.label||'')&&/^[+−-]?0[xb]/i.test(raw))return false;
    const value=numericKey(raw);
    return value!==null&&answers.some(a=>numericKey(a)===value);
  }
  function route(id,n,v=0,m='guidata'){
    return '#esercitazioni/'+id+'/'+n+(v||m!=='guidata'?'?v='+v+'&m='+m:'');
  }
  function legacyExercises(){
    return SL.esercizi.map((x,i)=>({titolo:x.title,principio:x.principio,unita:'6.3.'+[1,3,1,4,3][Math.floor(i/4)],attivita:SL.real.pwn[Math.floor(i/4)].id,
      varianti:[x,{...x,...x.variants[0]}].map(v=>({...v,consegna:v.prompt,campi:v.fields,svolgimento:v.steps,codice:v.code}))}));
  }
  const allExercises=c=>c.id==='6.3'?legacyExercises():SL.prove[c.id]||[];
  function progress(c,j,v){
    return c.id==='6.3'?SL.finished63().has(c.id+'.'+(j+1)+'/'+v):completed().has(c.id+'/'+(j+1)+'/'+v);
  }
  function listing(v){return v.listato?'<div class="provided-code"><h3>Listato da esaminare</h3>'+SL.codeView(v.listato)+'</div>':'';}
  function solution(v){
    return '<ol class="solution">'+v.svolgimento.map(s=>'<li>'+E(s)+'</li>').join('')+'</ol>'+
      (v.codice&&!v.listato?'<h3 class="spaced">Listato di riferimento</h3>'+SL.codeView(v.codice):'');
  }
  function catalogueItem(c,x,j){
    const trained=x.varianti.filter((_,i)=>progress(c,j,i)).length;
    return '<a class="chapterrow" href="'+route(c.id,j+1)+'"><span class="number">'+String(j+1).padStart(2,'0')+'</span><span>'+E(x.titolo)+'</span><span class="after">'+(trained?'✓ '+trained+' / '+x.varianti.length:'Apri →')+'</span></a>';
  }
  function practiceList(c,params){
    SL.after=()=>SL.mountChapter(c,false,params);
    const items=allExercises(c),u=c.units.find(u=>u.kind==='esercizi'&&!/svolt/i.test(u.title));
    return '<div class="wrap">'+SL.bread('<a href="#esercitazioni">Esercitazioni guidate</a> / '+c.id)+SL.heading('Esercitazioni · '+E(c.id+' '+c.title))+SL.guidaUnita(u.id,u.experiment,u.check)+
      '<div class="chapter-actions toolrow"><a class="btn primary" href="'+route(c.id,1)+'">Inizia dal primo esercizio →</a><a class="btn quiet" href="#soluzioni/'+c.id+'">Consulta gli svolgimenti</a><a class="textlink" href="#laboratorio/'+c.id+'">Laboratorio del capitolo →</a></div>'+SL.chapterReplayBox(c,false)+'<section class="panel"><h2>Esercitazioni del capitolo</h2>'+items.map((x,i)=>catalogueItem(c,x,i)).join('')+'</section>'+activityIndex(c,items)+'</div>';
  }
  function activityIndex(c,items){
    if(!c.pwn.length)return '';
    return '<section class="panel"><h2>Raccordo con le attività PWN</h2><p class="sub">Ogni voce associa la competenza richiesta agli esercizi preparatori e alle sigle usate nel corso.</p>'+c.pwn.map(p=>'<details class="unitentry"><summary>'+E(p.title)+'</summary><p>'+E(p.format)+' · <code>'+E(p.id)+'</code></p><p>'+items.map((x,i)=>x.attivita===p.id?'<a class="textlink" href="'+route(c.id,i+1)+'">'+E(x.titolo)+' →</a>':'').filter(Boolean).join('<br>')+'</p><p class="small">'+p.variants.map(E).join(' · ')+'</p></details>').join('')+'</section>';
  }
  function solutions(c,params){
    SL.after=()=>SL.mountChapter(c,true,params);
    const u=c.units.find(u=>u.kind==='soluzioni');
    return '<div class="wrap">'+SL.bread('<a href="#esercitazioni/'+c.id+'">Esercitazioni '+c.id+'</a> / Svolgimenti')+SL.heading('Soluzioni · '+E(c.id+' '+c.title))+SL.guidaUnita(u.id,u.experiment,u.check)+
      SL.chapterReplayBox(c,true)+'<section class="panel">'+allExercises(c).map((x,i)=>'<details class="unitentry"><summary>'+String(i+1).padStart(2,'0')+' · '+E(x.titolo)+'</summary>'+x.varianti.map((v,j)=>'<section class="worked"><h3>Traccia '+(j+1)+'</h3><p class="prompt">'+E(v.consegna)+'</p>'+listing(v)+solution(v)+'<a class="textlink" href="'+route(c.id,i+1,j)+'">Risolvi questa traccia →</a> · <a class="textlink" href="#soluzioni/'+c.id+'?es='+(i+1)+'&v='+j+'">Ripercorri i passaggi →</a></section>').join('')+'</details>').join('')+'</section></div>';
  }
  function practice(c,n,params){
    const arr=allExercises(c),ex=arr[n-1];if(!ex)return '';
    const vi=Number(params.get('v'))===1?1:0,variant=ex.varianti[vi],mode=Object.hasOwn(modes,params.get('m'))?params.get('m'):'guidata';
    const review=ex.ripasso||ex.unita;
    const key=c.id+'/'+n+'/'+vi;
    if(!drafts.has(key))drafts.set(key,{answers:variant.campi.map(()=>''),examSubmitted:false,unlocked:0});
    const d=drafts.get(key);
    let film;
    function mountFilm(locked){
      const slot=$('film-esercizio');slot.hidden=false;
      if(!film)film=SL.replay(slot,variant,SL.sceneProve[c.id+'/'+n],{datiVisibili:true,locked,reviewFields:true,answers:d.submitted||[]});
    }
    function field(f,j){
      const id='risposta-'+j,lock=mode==='guidata'&&j>d.unlocked?' disabled':'';
      const attr=' id="'+id+'" aria-describedby="aiuto-'+j+'"'+lock;
      const input=f.choices?'<select'+attr+'><option value="">Scegli una risposta</option>'+f.choices.map(o=>'<option value="'+E(o)+'"'+(String(o)===d.answers[j]?' selected':'')+'>'+E(o)+'</option>').join('')+'</select>':
        '<input'+attr+' value="'+E(d.answers[j])+'" spellcheck="false" autocomplete="off">';
      return '<div class="checkfield"><label for="'+id+'">'+E(f.label)+'</label>'+input+'<span class="hintline" id="aiuto-'+j+'"></span></div>';
    }
    function status(msg,warn=false){const el=$('risultato');el.className='status'+(warn?' warn':'');el.textContent=msg;}
    SL.after=()=>{
      if(mode!=='autonoma'||d.examSubmitted)mountFilm(!d.submitted);
      variant.campi.forEach((f,j)=>{
        const input=$('risposta-'+j);
        input.oninput=()=>{d.answers[j]=input.value;input.classList.remove('checked','wrong');input.removeAttribute('aria-invalid');$('aiuto-'+j).textContent='';$('risultato').textContent='';$('risultato').className='';};
      });
      $('verifica-prova').onsubmit=e=>{
        e.preventDefault();if(mode==='autonoma')d.examSubmitted=true;$('vedi-sol').disabled=false;
        const last=mode==='guidata'?d.unlocked:variant.campi.length-1;
        d.submitted=variant.campi.map((_,j)=>$('risposta-'+j).value);
        SL.registraTentativo(c.id,n,vi,d.submitted);mountFilm(false);film.unlock(d.submitted);
        let first=-1;
        for(let j=0;j<=last;j++){
          const input=$('risposta-'+j),f=variant.campi[j];d.answers[j]=input.value;
          const ok=correct(f,input.value);
          input.classList.toggle('wrong',!ok);input.classList.toggle('checked',ok);
          input.setAttribute('aria-invalid',String(!ok));
          $('aiuto-'+j).textContent=ok?'Passaggio corretto.':'';
          if(!ok&&first<0)first=j;
        }
        if(first>=0){
          const f=variant.campi[first];$('aiuto-'+first).textContent=mode==='autonoma'?'Da rivedere.':f.hint;
          status('Rivedi il campo «'+f.label+'».',true);$('risposta-'+first).focus();return;
        }
        if(last<variant.campi.length-1){
          d.unlocked=last+1;const input=$('risposta-'+d.unlocked);input.disabled=false;status('Passaggio corretto. Prosegui con «'+variant.campi[d.unlocked].label+'».');input.focus();return;
        }
        mark(key);status('Traccia completata. Tutti i passaggi risultano corretti.');$('esito-locale').textContent='✓ Traccia già completata su questo dispositivo';
      };
      if($('suggerisci'))$('suggerisci').onclick=()=>{
        const first=variant.campi.findIndex((f,j)=>!correct(f,d.answers[j]));
        if(first<0){status('Tutti i campi sono compilati correttamente. Puoi verificare la traccia.');return;}
        $('aiuto-'+first).textContent=variant.campi[first].hint;
      };
      $('vedi-sol').onclick=()=>{
        $('soluzione').hidden=!$('soluzione').hidden;$('vedi-sol').setAttribute('aria-expanded',String(!$('soluzione').hidden));
        $('vedi-sol').textContent=$('soluzione').hidden?'Mostra svolgimento':'Chiudi svolgimento';
      };
      $('ricomincia').onclick=()=>{drafts.delete(key);SL.dimenticaTentativo(c.id,n,vi);SL.render(false);};
    };
    return '<div class="wrap">'+SL.bread('<a href="#esercitazioni">Esercitazioni guidate</a> / <a href="#esercitazioni/'+c.id+'">Capitolo '+c.id+'</a> / Esercizio '+n)+SL.heading(E(ex.titolo))+
      '<div class="layout">'+SL.chapterNav(c,(c.units.find(u=>u.kind==='esercizi'&&!/svolt/i.test(u.title))||{}).id)+'<div class="body"><section class="panel"><div class="toolrow"><span class="label">Esercizio '+n+' di '+arr.length+' · Traccia '+(vi+1)+'</span><a class="textlink" href="'+route(c.id,n,1-vi,mode)+'">Passa alla traccia '+(2-vi)+' ⇄</a></div>'+
      '<div class="tabs" aria-label="Modalità di lavoro">'+Object.entries(modes).map(([id,name])=>'<a class="tab'+(mode===id?' active':'')+'" href="'+route(c.id,n,vi,id)+'">'+name+'</a>').join('')+'</div>'+
      SL.principioProva(ex.principio)+'<p class="quiet-note">'+modeInfo[mode]+'</p><div class="status"><p class="prompt">'+E(variant.consegna)+'</p></div>'+listing(variant)+(variant.campi.some(f=>f.numeric)?'<p class="quiet-note">Nei decimali puoi usare la virgola o il punto. Scrivi le migliaia senza separatori.</p>':'')+'<form id="verifica-prova"><div class="fieldlist">'+variant.campi.map(field).join('')+'</div><div class="actions"><button class="btn warm">'+(mode==='guidata'?'Verifica passaggio':'Verifica risposte')+'</button>'+
      (mode!=='autonoma'?'<button type="button" class="btn quiet" id="suggerisci">Indizio</button>':'')+'<button id="vedi-sol" type="button" class="btn quiet" aria-expanded="false" aria-controls="soluzione"'+(mode==='autonoma'&&!d.examSubmitted?' disabled':'')+'>Mostra svolgimento</button><button id="ricomincia" type="button" class="chip">Ricomincia</button></div></form><div id="risultato" role="status"></div><div class="small" id="esito-locale">'+(completed().has(key)?'✓ Traccia già completata su questo dispositivo':'')+'</div>'+
      '<section id="film-esercizio" hidden><h3 class="spaced">Ricostruzione animata</h3>'+SL.replayMarkup()+'</section><div id="soluzione" hidden class="spaced"><h3>Svolgimento completo</h3>'+solution(variant)+'</div></section><section class="panel"><div class="toolrow"><a class="textlink" href="#lab/'+review+'">Ripassa la teoria e l’esperimento →</a>'+SL.bookTag(review)+'</div>'+
      (ex.attivita?'<p class="quiet-note">Attività PWN di riferimento · <code>'+E(ex.attivita)+'</code></p>':'')+'</section><div class="toolrow"><a class="textlink" href="#esercitazioni/'+c.id+'">← Elenco degli esercizi</a>'+(n<arr.length?'<a class="btn quiet" href="'+route(c.id,n+1,0,mode)+'">Esercizio successivo →</a>':'<a class="btn quiet" href="#soluzioni/'+c.id+'">Svolgimenti del capitolo →</a>')+'</div></div></div></div>';
  }
  Object.assign(SL,{listatoFornito:listing,practiceList,practice,solutions,correct,allExercises});
})();
