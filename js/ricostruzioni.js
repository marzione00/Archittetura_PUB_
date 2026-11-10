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
    const u=c.units.find(u=>sol?u.kind==='soluzioni':u.kind==='esercizi'&&!/svolt/i.test(u.title));
    const iniziale=u.provaIniziale||1,variante=(u.tracciaIniziale||1)-1,items=SL.allExercises(c);
    return '<section class="panel chapter-film"><h2 id="inizio-attivita" tabindex="-1">'+(sol?'Ripercorri uno svolgimento':'Prova una previsione')+'</h2>'+SL.introduzioneUnita(u.id)+'<p class="esempio-riferimento">La guida di questa unità sviluppa l’esercizio '+iniziale+' · '+E(items[iniziale-1].titolo)+', '+E(SL.titoloTraccia(c.id,iniziale,variante))+'. Puoi ripristinarlo con il pulsante sottostante oppure scegliere un’altra traccia per esercitarti.</p><div class="fields exp-controls"><label>Esercizio<select data-which-ex>'+items.map((x,i)=>'<option value="'+i+'">'+(i+1)+' · '+E(x.titolo)+'</option>').join('')+'</select></label><label>Traccia<select data-which-v><option value="0">Traccia 1</option><option value="1">Traccia 2</option></select></label></div><button type="button" class="chip" data-esempio-guida>Carica l’esempio guidato</button>'+SL.letturaUnita(u.id)+'<div data-task></div></section>';
  }
  function mountChapter(c,sol,params){
    const host=document.querySelector('.chapter-film'),items=SL.allExercises(c);
    const which=host.querySelector('[data-which-ex]'),vi=host.querySelector('[data-which-v]'),body=host.querySelector('[data-task]');
    const unita=c.units.find(u=>sol?u.kind==='soluzioni':u.kind==='esercizi'&&!/svolt/i.test(u.title));
    const iniziale=unita.provaIniziale||1;
    const varianteIniziale=(unita.tracciaIniziale||1)-1;
    const richiesta=Number(params?.get('es')||iniziale);
    which.value=String((Number.isInteger(richiesta)&&richiesta>=1&&richiesta<=items.length?richiesta:iniziale)-1);
    vi.value=params?.has('es')||params?.has('v')?(params.get('v')==='1'?'1':'0'):String(varianteIniziale);
    const guida=document.querySelector('.guida-unita');
    const riferimento=document.createElement('details'),titoloRiferimento=document.createElement('summary');
    riferimento.className='teoria-riferimento';riferimento.dataset.teoriaRiferimento='';
    titoloRiferimento.textContent='Teoria dell’esempio guidato · '+items[iniziale-1].titolo;
    guida.before(riferimento);riferimento.append(titoloRiferimento,guida);
    let film;
    function show(){
      film?.stop();const n=Number(which.value)+1,j=Number(vi.value),item=items[n-1],v=item.varianti[j],field=v.campi[0];
      const esempio=n===iniziale&&j===varianteIniziale;
      riferimento.open=esempio;titoloRiferimento.hidden=esempio;
      guida.querySelector('.procedura-guida').hidden=!esempio;
      host.querySelector('.lettura-figura').hidden=!esempio;
      host.querySelector('[data-introduzione]').hidden=!esempio;
      const esito=document.querySelector('[data-guida-esito]');if(esito)esito.hidden=!esempio;
      for(const option of vi.options)option.textContent=SL.titoloTraccia(c.id,n,Number(option.value));
      const go='#esercitazioni/'+c.id+'/'+n+'?v='+j+'&m=guidata';
      const principio=n!==iniziale||j!==varianteIniziale?SL.principioProva(v.principio||item.principio):'';
      let previsione='';
      if(!sol){
        const controllo=field.ordine?SL.campoOrdine(field,' data-short-answer'):'<label>'+E(field.label)+(field.choices?'<select data-short-answer><option value="">Scegli una risposta</option>'+field.choices.map(x=>'<option>'+E(x)+'</option>').join('')+'</select>':'<input data-short-answer autocomplete="off">')+'</label>';
        previsione='<div class="scene-prediction">'+controllo+'<button type="button" class="btn" data-check-short>Registra la previsione</button><small role="status" data-short-status></small></div>';
      }
      const procedura=esempio?'':'<div class="procedura-attiva" data-procedura-attiva><h3>Procedura della traccia scelta</h3><ol><li>Leggi la consegna e applica il principio riportato sopra ai dati del caso.</li><li>'+E(sol?'Premi «Passo successivo» per seguire lo svolgimento.':'Formula la previsione richiesta nel campo «'+field.label+'», poi premi «Registra la previsione».')+'</li><li>Avanza un fotogramma alla volta: confronta i valori disegnati con la spiegazione del passaggio e ricostruisci il calcolo. Nelle fasi finali controlla i risultati dei campi richiesti.</li></ol><p data-lettura-attiva>La figura iniziale rappresenta i dati della consegna. Nei fotogrammi successivi, il titolo e la spiegazione sotto il disegno indicano il passaggio svolto e la variazione dei valori. Usa «Precedente» per confrontare due fasi consecutive.</p></div>';
      body.innerHTML=principio+procedura+'<p class="prompt spaced">'+E(v.consegna)+'</p>'+SL.listatoFornito(v)+previsione+
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
      const hash='#'+(sol?'soluzioni/':'esercitazioni/')+c.id+(n===iniziale&&j===varianteIniziale?'':'?es='+n+'&v='+j);
      if(location.hash!==hash)history.replaceState(null,'',hash);
    }
    which.onchange=show;vi.onchange=show;host.querySelector('[data-esempio-guida]').onclick=()=>{which.value=String(iniziale-1);vi.value=String(varianteIniziale);show();};show();
  }

  function problemaSvolto(id){
    if(!Object.hasOwn(SL.casiSvolti,id))return '';
    const ex=SL.casiSvolti[id],c=SL.unitChapter(id),u=c.units.find(u=>u.id===id);
    const v={consegna:ex.dati,svolgimento:ex.passi.map(x=>x.testo),campi:[]};
    SL.after=()=>{
      const host=$('esempio-animato');const guess=SL.previsione($('previsione-esempio'));guess.set([ex.domanda,ex.risposta,ex.formato],false);
      replay(host,v,(_,k)=>{guess.set([ex.domanda,ex.risposta,ex.formato],k===ex.passi.length);return SL.disegnaCaso(id,k);},{datiVisibili:true,titles:ex.passi.map(x=>x.titolo)});
    };
    return '<div class="wrap">'+SL.bread('<a href="#mappa/'+c.id+'">Capitolo '+c.id+'</a> / '+id)+SL.heading(E(ex.titolo),'Problema svolto · '+id)+'<div class="layout">'+SL.chapterNav(c,id)+'<div class="body">'+SL.guidaUnita(id)+'<section class="panel"><h2 id="inizio-attivita" tabindex="-1">Dati iniziali</h2>'+SL.introduzioneUnita(id)+'<p class="prompt">'+E(ex.dati)+'</p><div id="previsione-esempio">'+SL.previsioneForm()+'</div>'+SL.letturaUnita(id)+'<div id="esempio-animato">'+replayMarkup()+'</div></section>'+SL.esitoUnita(id)+'<a class="btn" href="#esercitazioni/'+c.id+'">Esercitazioni del capitolo →</a></div></div></div>';

  }
  Object.assign(SL,{replayMarkup,replay,chapterReplayBox,mountChapter,problemaSvolto,registraTentativo:record,dimenticaTentativo:forget});
})();
