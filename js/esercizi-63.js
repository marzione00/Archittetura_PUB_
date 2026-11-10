'use strict';
(() => {
  const {$,esc:E,hex:H}=SL;
  const drafts=new Map();
  const modes=['guidata','allenamento','autonoma'],modeNames=['Guidata','Allenamento','Prova autonoma'];
  const family={compose:'componi',lookup:'cerca',walker:'walker'};
  const registro=SL.registroProgressi('sistemilab.esercizi.v1',SL.esercizi.flatMap((_,j)=>
    [0,1].map(v=>SL.chiaveTraccia('6.3',j+1,v))));
  const finished=registro.completate,mark=registro.segna;
  function good(f,text){
    if(!String(text||'').trim())return false;
    const answers=[f.answer,...f.accept||[]];
    if(f.numeric){
      const entry=String(text).trim();
      if(/esadecimale/i.test(f.label)&&!/^0x[0-9a-f]+$/i.test(entry))return false;
      if(/(?:^|\s)decimale/i.test(f.label)&&!/^[0-9]+$/.test(entry))return false;
      try{return answers.some(a=>SL.intero(a)===SL.intero(text));}catch{return false;}}
    return answers.includes(text);
  }
  function explain(x){return '<ol class="solution">'+x.steps.map(t=>'<li>'+E(t)+'</li>').join('')+'</ol>'+(x.code?'<h3 class="spaced">Frammento risolto</h3>'+SL.codeView(x.code):'');}
  function esercizi63(n,p){
    const base=SL.esercizi[n-1];if(!base)return '';
    const variant=p.get('v')==='1'?1:0;
    const x=variant?{...base,...base.variants[0]}:base;
    const mode=modes.includes(p.get('m'))?p.get('m'):'guidata';
    const key=SL.chiaveTraccia('6.3',n,variant),group=Math.floor((n-1)/4);
    if(!drafts.has(key))drafts.set(key,{answers:x.fields.map(()=>''),source:x.starter||'',examSubmitted:false,codeOK:false,unlocked:0});
    const d=drafts.get(key);const done=finished();
    const solved={...x,consegna:x.prompt,campi:x.fields,svolgimento:x.steps,codice:x.code};
    let film;
    function mountFilm(locked){
      const slot=$('film-esercizio');slot.hidden=false;
      if(!film)film=SL.replay(slot,solved,SL.sceneProve['6.3/'+n],{datiVisibili:true,locked,reviewFields:true,answers:d.submitted||[],grade:good});
    }
    const params=(val,which=mode)=>'?v='+val+'&m='+which;
    function input(f,i){
      const attr='id="a'+i+'" data-field="'+i+'" aria-describedby="h'+i+'"';
      const lock=mode==='guidata'&&i>d.unlocked?' disabled':'';
      return '<div class="checkfield"><label for="a'+i+'">'+E(f.label)+'</label>'+
       (f.choices?'<select '+attr+lock+'><option value="">Scegli una risposta</option>'+f.choices.map(c=>'<option value="'+E(c)+'"'+(c===d.answers[i]?' selected':'')+'>'+E(c)+'</option>').join('')+'</select>':
        '<input '+attr+lock+' value="'+E(d.answers[i])+'" autocomplete="off" spellcheck="false" placeholder="Risposta">')+
        '<span class="hintline" id="h'+i+'"></span></div>';
    }
    function verdict(msg,warn=false){const b=$('verdetto');b.className='status'+(warn?' warn':'');b.textContent=msg;}
    function unlock(i){d.unlocked=Math.max(i,d.unlocked);x.fields.forEach((_,j)=>{const f=$('a'+j);if(f)f.disabled=mode==='guidata'&&j>d.unlocked;});}
    function checkCode(){
      if(!x.code)return true;
      d.source=$('editor').value;d.codeOK=false;
      if(!d.source.trim()){ $('risultato-codice').innerHTML='<div class="status warn">Scrivi il frammento assembly e avvia i test.</div>';return false;}
      try{
        const result=SL.provaCodice(d.source,family[x.family],x.bits,x);
        $('risultato-codice').innerHTML=result.ok?'<div class="status">Superati '+result.passed+' casi: dimensione di pagina, offset estremi, frame zero e conservazione dei registri di ingresso.</div>':
        '<div class="status warn"><p>'+E(result.why)+'</p><p class="mono">VA '+H(result.va)+' · PFN '+result.frame+(result.base!==undefined&&x.family!=='compose'?' · base '+H(result.base):'')+(x.family==='walker'?' · valido '+result.valid:'')+'</p><p>RAX atteso: <code>'+H(result.expect)+'</code>'+(result.actual!==undefined?' · osservato: <code>'+H(result.actual)+'</code>':'')+'</p></div>';
        d.codeOK=result.ok;return result.ok;
      }catch(e){$('risultato-codice').innerHTML='<div class="status warn">'+E(e.message)+'</div>';return false;}
    }
    function runSample(){
      try{
        const input=SL.ingressoEsercizio(family[x.family],x);
        const res=SL.esegui($('editor').value,input,true);
        $('risultato-codice').innerHTML='<div class="status">Traccia completata in '+res.ticks+' passi. RAX = <code>'+H(res.regs.rax)+'</code>.</div><details class="unitentry"><summary>Registri dopo ogni istruzione</summary><div class="tablewrap"><table><thead><tr><th>Riga</th><th>RAX</th><th>RCX</th><th>ZF</th></tr></thead><tbody>'+res.trace.map(v=>'<tr><td>'+v.line+'</td><td>'+H(v.regs.rax)+'</td><td>'+H(v.regs.rcx)+'</td><td>'+Number(v.zf)+'</td></tr>').join('')+'</tbody></table></div></details>';
      }catch(e){$('risultato-codice').innerHTML='<div class="status warn">'+E(e.message)+'</div>';}
    }
    function after(){
      if(mode!=='autonoma'||d.examSubmitted)mountFilm(!d.submitted);
      for(let i=0;i<x.fields.length;i++){
        const el=$('a'+i);el.addEventListener('input',()=>{d.answers[i]=el.value;el.classList.remove('wrong','checked');$('h'+i).textContent='';$('verdetto').textContent='';$('verdetto').className='';});
      }
      if(x.code){$('editor').addEventListener('input',e=>{d.source=e.target.value;d.codeOK=false;$('risultato-codice').textContent='';});$('test-code').onclick=checkCode;$('trace-code').onclick=runSample;}
      $('verifica').onclick=()=>{
        if(mode==='autonoma')d.examSubmitted=true;const sol=$('apri-soluzione');sol.disabled=false;
        const last=mode==='guidata'?Math.min(d.unlocked,x.fields.length-1):x.fields.length-1;
        d.submitted=x.fields.map((_,i)=>$('a'+i).value);
        SL.registraTentativo('6.3',n,variant,d.submitted);mountFilm(false);film.unlock(d.submitted);
        let first=-1;
        for(let i=0;i<=last;i++){
          const el=$('a'+i),ok=good(x.fields[i],el.value);d.answers[i]=el.value;
          if(!ok&&first<0)first=i;
          el.classList.remove('wrong','checked');el.classList.add(ok?'checked':'wrong');
          $('h'+i).textContent='';
          if(first===i&&mode!=='autonoma')$('h'+i).textContent=x.fields[i].hint;
        }
        if(first!==-1){
          verdict(mode==='autonoma'?'Rivedi il campo «'+x.fields[first].label+'». Puoi ora consultare lo svolgimento completo.':'Primo passaggio da rivedere: '+x.fields[first].label+'.',true);
          $('a'+first).focus();return;
        }
        if(last<x.fields.length-1){
          unlock(last+1);verdict('Passaggio verificato. Prosegui con «'+x.fields[last+1].label+'».');$('a'+(last+1)).focus();return;
        }
        if(x.code&&!checkCode()){verdict('Valori della traccia corretti. Completa la verifica del codice.',true);return;}
        mark(key);verdict('Prova completata. Tutti i passaggi'+(x.code?' e i test assembly':'')+' risultano corretti.');
        $('progresso').textContent=finished().size+' / 40 tracce completate su questo dispositivo';
      };
      if($('indizio'))$('indizio').onclick=()=>{
        let i=x.fields.findIndex((f,j)=>!good(f,d.answers[j]));if(i<0){verdict('I campi numerici e le scelte sono corretti. Puoi verificare la traccia.');return;}
        $('h'+i).textContent=x.fields[i].hint;
      };
      $('apri-soluzione').onclick=()=>{const target=$('solcorrente');target.hidden=!target.hidden;$('apri-soluzione').textContent=target.hidden?'Mostra svolgimento':'Chiudi svolgimento';$('apri-soluzione').setAttribute('aria-expanded',String(!target.hidden));};
      $('azzera').onclick=()=>{drafts.delete(key);SL.dimenticaTentativo('6.3',n,variant);SL.render(false);};
    }
    SL.after=after;
    const provenance=SL.real.pwn[group];
    return '<div class="wrap">'+SL.bread('<a href="#mappa/6.3">Capitolo 6.3</a> / Esercizi')+
      SL.heading(E(x.title))+
      '<div class="layout">'+SL.sidebar(5)+'<div class="body"><details class="panel altri-esercizi"><summary>Altri esercizi sulla traduzione degli indirizzi</summary><div class="grouplist">'+SL.famNames.map((t,i)=>'<a class="'+(group===i?'on':'')+'" href="#esercitazioni/6.3/'+(i*4+1)+params(0)+'">'+E(t)+'<small>6.3.'+(i*4+1)+' – 6.3.'+(i*4+4)+'</small></a>').join('')+'</div>'+
      '<div class="toolrow spaced">'+SL.linksFamily(group,n,params(0))+'<small class="small" id="progresso">'+done.size+' / 40 tracce completate su questo dispositivo</small></div></details>'+
      '<section class="panel"><div class="toolrow"><span class="label obiettivo-traccia">Esercizio '+x.id+' · '+E(SL.titoloTraccia('6.3',n,variant))+'</span><a class="textlink" href="#esercitazioni/6.3/'+x.id.split('.').pop()+params(1-variant)+'">'+E(SL.titoloTraccia('6.3',n,1-variant))+' ⇄</a></div>'+SL.principioProva(x.principio)+
      '<div class="tabs" aria-label="Modalità">'+modes.map((v,i)=>'<a class="tab '+(mode===v?'active':'')+'" href="#esercitazioni/6.3/'+x.id.split('.').pop()+params(variant,v)+'">'+modeNames[i]+'</a>').join('')+'</div>'+
      '<p class="quiet-note">'+({guidata:'Verifica un passaggio per volta per aprire il successivo.',allenamento:'Completa i campi in qualsiasi ordine. La correzione individua il primo passaggio da rivedere.',autonoma:(x.code?'Consegna le risposte e il frammento assembly.':'Consegna le risposte.')+' Dopo il tentativo puoi consultare lo svolgimento.'}[mode])+'</p>'+
      '<div class="status"><p class="prompt">'+E(x.prompt)+'</p></div><p class="quiet-note">Usa il prefisso 0x nei campi esadecimali. Nei campi decimali scrivi le cifre senza separatori.</p><div class="fieldlist">'+x.fields.map(input).join('')+'</div>'+
      (x.code?'<section class="box"><h3>'+(x.starter?'Listato di partenza':'Frammento assembly')+'</h3><label for="editor">Sintassi Intel · x86-64</label><textarea class="editor" id="editor" spellcheck="false" autocomplete="off" placeholder="Scrivi qui le istruzioni">'+E(d.source)+'</textarea><div class="actions"><button class="btn" id="trace-code">Esegui la traccia</button><button class="btn" id="test-code">Prova i casi limite</button></div><div id="risultato-codice" aria-live="polite"></div><details class="unitentry"><summary>Istruzioni e registri disponibili</summary><p>Registri: RAX, RCX, RDI, RSI e le rispettive parti a 32 bit. Istruzioni: MOV, LEA, SHL, SHR, AND, OR, XOR, ADD, SUB, TEST, CMP, JMP, JE/JZ, JNE/JNZ, JB, JAE, NOP, RET. Le letture usano MOV a 64 bit su voci da otto byte. Gli shift accettano conteggi immediati. RET chiude il frammento e restituisce RAX al banco di prova. I test eseguono il modello didattico locale.</p></details></section>':'')+
      '<div class="actions"><button class="btn warm" id="verifica">'+(mode==='guidata'?'Verifica passaggio':'Verifica risposte')+'</button>'+
      (mode!=='autonoma'?'<button class="btn quiet" id="indizio">Indizio</button>':'')+'<button class="btn quiet" id="apri-soluzione" aria-controls="solcorrente" aria-expanded="false" '+(mode==='autonoma'&&!d.examSubmitted?'disabled':'')+'>Mostra svolgimento</button><button class="chip" id="azzera">Ricomincia</button></div><div id="verdetto" aria-live="polite"></div>'+
      '<section id="film-esercizio" hidden><h3 class="spaced">Ricostruzione animata</h3>'+SL.replayMarkup()+'</section><div id="solcorrente" class="spaced" hidden><h3 class="soltitle">Svolgimento completo</h3>'+explain(x)+'</div></section>'+
      '<section class="panel"><details><summary>Raccordo con la challenge del corso</summary><p class="spaced">'+E(provenance.title)+' · '+E(provenance.format)+'</p><p class="mono">'+E(provenance.id)+'</p><p class="quiet-note">Le due tracce si correggono nel browser. La consegna ufficiale avviene nell’ambiente PWN del corso.</p></details></section>'+
      '<div class="toolrow"><a class="textlink" href="#lab/6.3.'+[1,3,1,4,3][group]+'">← Ripassa in laboratorio</a>'+(n<20?'<a class="btn" href="#esercitazioni/6.3/'+(n+1)+params(0)+'">Esercizio successivo →</a>':'<a class="btn" href="#soluzioni/6.3">Rivedi gli svolgimenti →</a>')+'</div></div></div></div>';
  }
  Object.assign(SL,{esercizi63,good,finished63:finished});
})();
