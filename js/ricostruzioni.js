'use strict';
(() => {
  const {$,esc:E}=SL;
  SL.sceneProve=Object.create(null);
  const attempts=new Map();
  function attemptKey(cid,n,v){return cid+'/'+n+'/'+v;}
  function record(cid,n,v,answers){attempts.set(attemptKey(cid,n,v),answers.map(String));}
  function forget(cid,n,v){attempts.delete(attemptKey(cid,n,v));}
  function replayMarkup(){
    return '<div class="replay" data-replay><div class="toolrow"><span class="label" data-position></span><button type="button" class="chip" data-difference hidden>Primo campo da rivedere →</button></div><h3 data-phase></h3><div data-picture></div><p class="replay-text" data-explanation aria-live="polite"></p><div data-comparison></div><div class="film-navigation"><button type="button" class="btn quiet" data-prev>← Precedente</button><button type="button" class="btn primary" data-next>Passo successivo →</button>'+SL.filmBar()+'<button type="button" class="chip" data-rewind>Ricomincia il percorso</button></div><p class="small" data-gate></p></div>';
  }
  // Per una traccia già consegnata, le previsioni si confrontano campo per campo.
  // L'indice della riga di svolgimento e quello del campo sono indipendenti.
  function replay(host,v,graphic,options={}){
    const q=s=>host.querySelector(s),fields=v.campi||[],steps=v.svolgimento;
    const finish=steps.length,fieldStart=finish+1,total=finish+(options.reviewFields?fields.length:0);
    let k=0,locked=!!options.locked,answers=options.answers||[],player;
    const test=options.grade||SL.correct;
    function draw(f=false){
      const field=k>=fieldStart?fields[k-fieldStart]:null;
      const heading=k===0?'Dati del caso':field?'Verifica · '+field.label:(options.titles?.[k-1]||'Passaggio '+k);
      const phrase=k===0?v.consegna:field?(field.hint||'Confronta il valore richiesto con il risultato.'):steps[k-1];
      q('[data-position]').textContent='Fotogramma '+(k+1)+' di '+(total+1);
      q('[data-phase]').textContent=heading;
      const explanation=q('[data-explanation]');
      explanation.textContent=k===0&&options.datiVisibili?'':phrase;
      explanation.hidden=!explanation.textContent;
      const picture=q('[data-picture]');
      picture.innerHTML=SL.disegno(graphic(v,Math.min(k,finish)),heading+'. '+phrase);SL.anima(picture,f);
      const response=field?answers[k-fieldStart]:null;
      q('[data-comparison]').innerHTML=field?'<div class="status'+(response&&!test(field,response)?' warn':'')+'">'+(response?'Tua previsione: <b>'+E(response)+'</b> · ':'')+'Valore atteso: <b>'+E(field.answer)+'</b></div>':'';
      const first=answers.some(x=>String(x).trim())?fields.findIndex((f,j)=>String(answers[j]??'').trim()!==''&&!test(f,answers[j])):-1;
      const jump=q('[data-difference]');jump.hidden=locked||first<0||!options.reviewFields;
      jump.onclick=()=>{player.stop();k=fieldStart+first;draw();};
      q('[data-prev]').disabled=k===0;q('[data-next]').disabled=locked||k===total;
      q('[data-gate]').textContent=locked?'Registra un tentativo per avviare la ricostruzione.':'';
      player.sync();
    }
    player=SL.filmPlayer(host,()=>k,()=>locked?0:total,(n,f)=>{k=n;draw(f);});
    function go(n,forward){player.stop();k=Math.max(0,Math.min(locked?0:total,n));draw(forward);}
    q('[data-prev]').onclick=()=>go(k-1,false);q('[data-next]').onclick=()=>go(k+1,true);q('[data-rewind]').onclick=()=>go(0,false);
    draw();
    return {unlock(a){locked=false;answers=a.slice();draw();},stop:player.stop};
  }
  function chapterReplayBox(c,sol){
    return '<section class="panel chapter-film"><h2 id="inizio-attivita" tabindex="-1">'+(sol?'Ripercorri uno svolgimento':'Prova una previsione')+'</h2><div class="fields exp-controls"><label>Esercizio<select data-which-ex>'+SL.allExercises(c).map((x,i)=>'<option value="'+i+'">'+(i+1)+' · '+E(x.titolo)+'</option>').join('')+'</select></label><label>Traccia<select data-which-v><option value="0">Traccia 1</option><option value="1">Traccia 2</option></select></label></div><div data-task></div></section>';
  }
  function mountChapter(c,sol,params){
    const host=document.querySelector('.chapter-film'),items=SL.allExercises(c);
    const which=host.querySelector('[data-which-ex]'),vi=host.querySelector('[data-which-v]'),body=host.querySelector('[data-task]');
    const first=Number(params?.get('es')||1)-1;
    which.value=String(Number.isInteger(first)&&first>=0&&first<items.length?first:0);
    vi.value=params?.get('v')==='1'?'1':'0';
    let film;
    function show(){
      film?.stop();const n=Number(which.value)+1,j=Number(vi.value),item=items[n-1],v=item.varianti[j],field=v.campi[0];
      const go='#esercitazioni/'+c.id+'/'+n+'?v='+j+'&m=guidata';
      body.innerHTML='<p class="prompt spaced">'+E(v.consegna)+'</p>'+SL.listatoFornito(v)+(!sol?'<div class="scene-prediction"><label>'+E(field.label)+(field.choices?'<select data-short-answer><option value="">Scegli una risposta</option>'+field.choices.map(x=>'<option>'+E(x)+'</option>').join('')+'</select>':'<input data-short-answer autocomplete="off">')+'</label><button type="button" class="btn" data-check-short>Registra la previsione</button><small role="status" data-short-status></small></div>':'')+
        replayMarkup()+'<a class="textlink" href="'+go+'">Apri la prova completa →</a>';
      const grade=c.id==='6.3'?SL.good:SL.correct;
      film=replay(body.querySelector('[data-replay]'),v,SL.sceneProve[c.id+'/'+n],{datiVisibili:true,locked:!sol,reviewFields:true,answers:sol?attempts.get(attemptKey(c.id,n,j)):[],grade});
      if(!sol){
        body.querySelector('[data-check-short]').onclick=()=>{
          const answer=body.querySelector('[data-short-answer]').value.trim(),msg=body.querySelector('[data-short-status]');
          if(!answer){msg.textContent='Inserisci una previsione per questo campo.';return;}
          msg.textContent=grade(field,answer)?'Previsione confermata.':'Segui i passaggi per confrontare la tua previsione.';
          film.unlock([answer]);
        };
      }
      const hash='#'+(sol?'soluzioni/':'esercitazioni/')+c.id+(n===1&&!j?'':'?es='+n+'&v='+j);
      if(location.hash!==hash)history.replaceState(null,'',hash);
    }
    which.onchange=show;vi.onchange=show;show();
  }

  function problemaSvolto(id){
    const ex=SL.casiSvolti[id],c=SL.unitChapter(id),u=c.units.find(u=>u.id===id);
    const v={consegna:ex.dati,svolgimento:ex.passi.map(x=>x.testo),campi:[]};
    SL.after=()=>{
      const host=$('esempio-animato');const guess=SL.previsione($('previsione-esempio'));guess.set([ex.domanda,ex.risposta,ex.formato],false);
      replay(host,v,(_,k)=>{guess.set([ex.domanda,ex.risposta,ex.formato],k===ex.passi.length);return SL.disegnaCaso(id,k);},{datiVisibili:true,titles:ex.passi.map(x=>x.titolo)});
    };
    return '<div class="wrap">'+SL.bread('<a href="#mappa/'+c.id+'">Capitolo '+c.id+'</a> / '+id)+SL.heading(E(ex.titolo),'Problema svolto · '+id)+'<div class="layout">'+SL.chapterNav(c,id)+'<div class="body">'+SL.guidaUnita(id,u.experiment,u.check)+'<section class="panel"><h2 id="inizio-attivita" tabindex="-1">Dati iniziali</h2><p class="prompt">'+E(ex.dati)+'</p><div id="previsione-esempio">'+SL.previsioneForm()+'</div><div id="esempio-animato">'+replayMarkup()+'</div></section><a class="btn" href="#esercitazioni/'+c.id+'">Esercitazioni del capitolo →</a></div></div></div>';

  }
  Object.assign(SL,{replayMarkup,replay,chapterReplayBox,mountChapter,problemaSvolto,registraTentativo:record,dimenticaTentativo:forget});
})();
