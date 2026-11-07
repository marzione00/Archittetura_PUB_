'use strict';
(() => {
  const {$,esc:E}=SL;
  function readControl(control,value){
    if(value===null||value===undefined)return control.iniziale;
    if(control.opzioni){
      const option=control.opzioni.find(([id])=>String(id)===String(value));
      return option?option[0]:control.iniziale;
    }
    const n=Number(value), range=(n-control.min)/control.step;
    if(String(value).trim()===''||!Number.isFinite(n)||n<control.min||n>control.max||Math.abs(range-Math.round(range))>1e-7)return control.iniziale;
    return n;
  }
  function valueString(v){return String(v??'—');}
  function controlHTML(c,i,p){
    const id='param-'+i,selected=p[c.id];
    const input=c.opzioni?'<select id="'+id+'">'+c.opzioni.map(([v,label])=>'<option value="'+E(v)+'"'+(String(v)===String(selected)?' selected':'')+'>'+E(label)+'</option>').join('')+'</select>':
      '<input type="number" required id="'+id+'" min="'+E(c.min)+'" max="'+E(c.max)+'" step="'+E(c.step)+'" value="'+E(selected)+'">';
    return '<label for="'+id+'">'+E(c.label)+input+'</label>';
  }
  function cells(stage,ref){
    const before=new Map(ref?.valori||[]);
    return '<dl class="state-cells">'+stage.valori.map(([label,value])=>{
      const diff=before.has(label)&&valueString(before.get(label))!==valueString(value);
      return '<div'+(diff?' class="changed"':'')+'><dt>'+E(label)+'</dt><dd>'+E(valueString(value))+'</dd>'+(diff?'<small>Prima: '+E(before.get(label))+'</small>':'')+'</div>';
    }).join('')+'</dl>';
  }
  const previsioniPilota={
    '1.2.3':s=>['Byte all’indirizzo 0x1000 (in esadecimale con 0x)','0x'+Object.fromEntries(s[1].valori)['0x1000']],
    '2.3.3':s=>['Indirizzo del primo byte della cella',Object.fromEntries(s.at(-1).valori).Indirizzo],
    '3.1.3':s=>['Parola di quattro bit in uscita, escluso il riporto',Object.fromEntries(s.at(-1).valori).Somma,'bits'],
    '4.4.4':s=>['Primo ciclo dati di B, contando da zero',Object.fromEntries(s.at(-1).valori)['Primo ciclo dati di B']],
    '5.3.3':s=>['Prima assegnazione del core a B (ms)',Object.fromEntries(s.at(-1).valori)['prima risposta B (ms)']],
    '6.4.3':s=>{const out=Object.fromEntries(s.at(-1).valori).PA;return ['Indirizzo fisico oppure «pagina assente»',out==='—'?'pagina assente':out];}
  };
  function esperimento(id,query,modulo=false){
    const model=modulo?SL.moduliAnimati[id]:SL.unita[id];
    const chapter=modulo?null:SL.unitChapter(id),list=chapter?chapter.units.filter(SL.isLab):[];
    const i=list.findIndex(u=>u.id===id),u=modulo?{title:model.titolo}:list[i];
    const graphic=modulo?model.disegna:SL.sceneLab[id];
    let player,guess;
    const defaults=()=>Object.fromEntries(model.controlli.map(c=>[c.id,c.iniziale]));
    let inputs=Object.fromEntries(model.controlli.map(c=>[c.id,readControl(c,query.get('x_'+c.id))]));
    let stages=model.calcola(inputs),step=0,reference=null;
    const suggested=chapter?(SL.prove[chapter.id]||[]).findIndex(x=>x.unita===id):-1;
    function saveLocation(){
      const q=new URLSearchParams();
      for(const c of model.controlli)if(String(inputs[c.id])!==String(c.iniziale))q.set('x_'+c.id,inputs[c.id]);
      if(step)q.set('passo',step+1);
      const newHash=(modulo?'#modulo/':'#lab/')+id+(q.size?'?'+q:'');
      if(location.hash!==newHash)history.replaceState(null,'',newHash);
      SL.refreshShare();
    }
    // Il numero del passo nel collegamento segue la numerazione visibile, a partire da uno.
    if(query.has('passo'))step=Math.max(0,Math.min(stages.length-1,(parseInt(query.get('passo'),10)||1)-1));
    function draw(forward=false,clearGuess=false){
      const st=stages[step];
      $('passi').innerHTML=stages.map((s,j)=>'<button type="button" class="trace-stop'+(j===step?' active':'')+'" data-step="'+j+'"'+(j===step?' aria-current="step"':'')+'><span>'+String(j+1).padStart(2,'0')+'</span>'+E(s.titolo)+'</button>').join('');
      $('passi').querySelectorAll('[data-step]').forEach(btn=>btn.onclick=()=>go(Number(btn.dataset.step),'step'));
      $('stato').innerHTML='<div class="state-head"><span class="label">Passo '+(step+1)+' di '+stages.length+'</span><h3>'+E(st.titolo)+'</h3></div><p>'+E(st.testo)+'</p>'+cells(st,stages[step-1]);
      $('figura-lab').innerHTML=SL.disegno(graphic(inputs,stages,step),st.titolo+'. '+st.testo);
      SL.anima($('figura-lab'),forward);
      const target=model.previsione?[model.previsione.label,model.previsione.valore(inputs,stages),model.previsione.formato] : (previsioniPilota[id]?.(stages)||stages.at(-1).valori.at(-1));
      guess.set(target,step===stages.length-1,clearGuess);player.sync();
      $('indietro').disabled=step===0;$('avanti').disabled=step===stages.length-1;
      $('confronto').innerHTML='';
      if(reference){
        // La seconda esecuzione dello stesso turno si confronta con la seconda anche
        // quando un ramo precedente ha inserito o eliminato altri passi.
        const occurrence=stages.slice(0,step).filter(s=>s.titolo===st.titolo).length;
        const prev=reference.stages.filter(s=>s.titolo===st.titolo)[occurrence];
        $('confronto').innerHTML='<div class="compare"><h3>Confronto con i dati fissati</h3><p class="small">'+E(reference.summary)+'</p>'+
          (prev?'<div class="compare-values">'+cells(st,prev)+'</div>':'<p>La traccia fissata segue un ramo diverso e salta questo passo.</p>')+'</div>';
      }
      saveLocation();
    }
    function go(n,focus){
      const before=step;step=Math.max(0,Math.min(n,stages.length-1));if(focus)player.stop();draw(step>before);
      if(focus==='step')$('passi').querySelector('[aria-current]').focus({preventScroll:true});
      else if(focus)$(focus).disabled?$(focus==='avanti'?'indietro':'avanti').focus({preventScroll:true}):$(focus).focus({preventScroll:true});
    }
    function form(){ $('parametri').innerHTML=model.controlli.map((c,j)=>controlHTML(c,j,inputs)).join('');}
    SL.after=()=>{
      form();
      player=SL.filmPlayer($('film-lab'),()=>step,()=>stages.length-1,n=>go(n));
      guess=SL.previsione($('guess-lab'));draw();
      $('esperimento-input').onsubmit=e=>{
        e.preventDefault();
        inputs=Object.fromEntries(model.controlli.map((c,j)=>[c.id,readControl(c,$('param-'+j).value)]));
        player.stop();stages=model.calcola(inputs);step=reference?Math.min(step,stages.length-1):0;draw(false,true);
        $('riscontro').textContent='Traccia aggiornata con i parametri scelti.';
      };
      $('fissa').onclick=()=>{
        if(reference){reference=null;$('fissa').textContent='Fissa per confronto';}
        else {
          const summary=model.controlli.map(c=>c.label+' = '+(c.opzioni?.find(([id])=>String(id)===String(inputs[c.id]))?.[1]??inputs[c.id])).join(' · ');
          reference={summary,stages};$('fissa').textContent='Chiudi confronto';
        }
        draw();
      };
      $('ripristina').onclick=()=>{player.stop();inputs=defaults();stages=model.calcola(inputs);step=0;reference=null;$('fissa').textContent='Fissa per confronto';form();draw(false,true);$('riscontro').textContent='Parametri iniziali ripristinati.';};
      $('condividi').onclick=e=>SL.share(e.currentTarget);
      $('indietro').onclick=()=>go(step-1,'indietro');$('avanti').onclick=()=>go(step+1,'avanti');
    };
    const label=modulo?'Modulo '+SL.roman[Number(id)-1]+' · Simulazione d’insieme':'Capitolo '+chapter.id;
    const crumbs=modulo?'<a href="#laboratorio">Laboratorio</a> / '+label:'<a href="#laboratorio">Laboratorio</a> / <a href="#laboratorio/'+chapter.id+'">'+label+'</a> / '+id;
    const sidebar=modulo?SL.modNav(id):SL.chapterNav(chapter,id);
    const theory=modulo
      ?SL.guidaUnita('modulo-'+id,model.istruzione,model.osservazione)
      :SL.guidaUnita(id,u.experiment,u.check);
    const exitLink=modulo?'<a class="btn" href="#laboratorio/parte-'+id+'">Esplora le unità del modulo →</a>':
      '<a class="textlink" href="#esercitazioni/'+chapter.id+(suggested>=0?'/'+(suggested+1):'')+'">'+(suggested>=0?'Esercitati su questo argomento':'Esercitazioni del capitolo')+' →</a>'+
      (list[i+1]?'<a class="btn quiet" href="#lab/'+list[i+1].id+'">Esperimento successivo →</a>':'<a class="btn quiet" href="#laboratorio">Indice del laboratorio →</a>');
    return '<div class="wrap">'+SL.bread(crumbs)+SL.heading(E(u.title))+
      '<div class="layout">'+sidebar+'<div class="body">'+theory+
      '<section class="panel"><h2 id="inizio-attivita" tabindex="-1">'+E(model.domanda)+'</h2><form id="esperimento-input"><div class="fields exp-controls" id="parametri"></div><div class="actions"><button class="btn primary">Applica i parametri</button><button id="ripristina" class="chip" type="button">Ripristina esempio</button></div></form><div class="small" id="riscontro" role="status"></div></section>'+
      '<section class="panel trace-panel"><div class="toolrow"><h2>Traccia di esecuzione</h2><button class="chip" id="condividi">Condividi stato</button></div><div id="guess-lab">'+SL.previsioneForm()+'</div><div id="figura-lab"></div><div id="film-lab">'+SL.filmBar()+'</div><div class="trace-rail" id="passi" aria-label="Passi dell’esperimento"></div><div id="stato" class="stage" aria-live="polite"></div><div class="stepper"><button class="btn quiet" id="indietro">← Precedente</button><button class="btn primary" id="avanti">Passo successivo →</button><button class="chip" id="fissa">Fissa per confronto</button></div><div id="confronto" aria-live="polite"></div></section>'+
      '<div class="toolrow">'+exitLink+'</div></div></div></div>';
  }
  Object.assign(SL,{readControl,esperimento});
})();
