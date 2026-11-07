'use strict';
(() => {
  const e=SL.esc;
  const text=(x,y,value,cls='label',anchor='start')=>'<text x="'+x+'" y="'+y+'" class="'+e(cls)+'" text-anchor="'+e(anchor)+'">'+e(value)+'</text>';
  const rect=(x,y,w,h,cls='cell',r=5)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" class="'+e(cls)+'"/>';
  const line=(x1,y1,x2,y2,cls='wire')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+e(cls)+'"/>';
  const path=(d,cls='wire')=>'<path d="'+e(d)+'" class="'+e(cls)+'"/>';
  const dot=(x,y,r=5,cls='pin')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="'+e(cls)+'"/>';
  function box(x,y,w,h,label,value,cls='cell'){
    return rect(x,y,w,h,cls)+text(x+w/2,y+17,label,'small','middle')+text(x+w/2,y+h-10,value,'value','middle');
  }
  function arrow(x1,y1,x2,y2,active=false){
    const theta=Math.atan2(y2-y1,x2-x1),wing=.48,len=8;
    const arm=sign=>[x2-len*Math.cos(theta+sign*wing),y2-len*Math.sin(theta+sign*wing)].join(' ');
    return path('M'+x1+' '+y1+' L'+x2+' '+y2+' M'+arm(1)+' L'+x2+' '+y2+' L'+arm(-1),active?'wire live':'wire');
  }
  function travel(d){
    return '<circle r="5" class="pulse" visibility="hidden"><animateMotion begin="indefinite" dur="0.55s" fill="freeze" path="'+e(d)+'"/></circle>';
  }
  SL.pen={e,text,rect,line,path,dot,box,arrow,travel,values:(s,k)=>Object.fromEntries(s[k].valori)};
  SL.sceneLab=Object.create(null);SL.moduliAnimati=Object.create(null);
  let zoom=false;
  function drawing(graphic,label){
    return '<div class="scene-frame"><button type="button" class="chip scene-zoom" aria-pressed="'+zoom+'">'+(zoom?'Inquadra tutta la figura':'Ingrandisci figura')+'</button><div class="scene-viewport'+(zoom?' zoom':'')+'" tabindex="0" aria-label="Disegno della simulazione"><svg class="scene-svg" viewBox="0 0 640 250" role="img" aria-label="'+e(label)+'">'+graphic+'</svg></div></div>';
  }
  function move(host,forward){
    if(!forward||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    host.querySelectorAll('animateMotion').forEach(m=>{m.parentElement.setAttribute('visibility','visible');m.beginElement?.();});
    host.querySelectorAll('.reveal').forEach(el=>el.animate?.([{opacity:.35},{opacity:1}],{duration:450}));
  }

  // Ogni cambio di pagina o di scheda interrompe la sola riproduzione attiva.
  let running=null;
  function stopAll(){if(running)running();}
  function playback(toolbar,index,last,seek){
    let timer=null;
    const play=toolbar.querySelector('[data-film-play]'),speed=toolbar.querySelector('[data-film-speed]');
    function stop(){
      if(timer!==null)clearInterval(timer);
      timer=null;if(running===stop)running=null;
      play.textContent='Riproduci';play.setAttribute('aria-pressed','false');
    }
    function start(){
      stopAll();
      if(last()<=0)return;
      if(index()>=last())seek(0,false);
      running=stop;play.textContent='Pausa';play.setAttribute('aria-pressed','true');
      timer=setInterval(()=>{
        if(!toolbar.isConnected||document.hidden||index()>=last()){stop();return;}
        seek(index()+1,true);
        if(index()>=last())stop();
      },Number(speed.value));
    }
    play.onclick=()=>timer===null?start():stop();
    speed.onchange=()=>{if(timer!==null)start();};
    return {stop,sync(){play.disabled=last()<=0;if(timer!==null&&index()>=last())stop();}};
  }
  function bar(){
    return '<div class="film-tools"><button type="button" class="btn quiet" data-film-play aria-pressed="false">Riproduci</button><label>Intervallo <select data-film-speed><option value="1250">1,25 s</option><option value="2600" selected>2,6 s</option><option value="4500">4,5 s</option></select></label></div>';
  }
  function predictForm(){
    return '<div class="scene-prediction"><label><span data-guess-label></span><input data-guess autocomplete="off" maxlength="180" placeholder="Scrivi la tua previsione"></label><span data-guess-result role="status"></span></div>';
  }
  // Confronto numerico esatto attraverso il medesimo correttore degli esercizi;
  // per risposte descrittive si offre un confronto esplicito, senza giudizio semantico.
  function prediction(host){
    const input=host.querySelector('[data-guess]'),label=host.querySelector('[data-guess-label]'),result=host.querySelector('[data-guess-result]');
    let final=false,expected='',format='';
    function update(){
      result.textContent='';
      if(!final)return;
      if(!input.value.trim()){result.textContent='Risultato osservato: '+expected+'.';return;}
      const raw=String(expected).trim(),given=input.value.trim(),numeric=format!=='bits'&&SL.correct({numeric:true,answer:raw},raw);
      const equal=numeric?SL.correct({numeric:true,answer:raw},given):raw.toLocaleLowerCase('it')===given.toLocaleLowerCase('it');
      result.textContent=equal?'Previsione confermata.':(numeric?'Previsione: '+given+' · Risultato: '+raw+'.':'Confronta la tua previsione con l’esito: '+raw+'.');
    }
    input.oninput=update;
    return {set(target,atEnd,clear=false){
      label.textContent=target[0].endsWith('?')?target[0]:'Prevedi il risultato · '+target[0];
      if(clear)input.value='';
      final=atEnd;expected=target[1];format=target[2]||'';update();
    }};
  }
  Object.assign(SL,{disegno:drawing,anima:move,filmBar:bar,filmPlayer:playback,stopFilm:stopAll,previsioneForm:predictForm,previsione:prediction});
  if(typeof document!=='undefined'&&document.addEventListener){
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});
    document.addEventListener('click',event=>{
      if(!event.target.closest('.scene-zoom'))return;
      zoom=!zoom;
      document.querySelectorAll('.scene-frame').forEach(frame=>{
        frame.querySelector('.scene-viewport').classList.toggle('zoom',zoom);
        const btn=frame.querySelector('.scene-zoom');btn.setAttribute('aria-pressed',String(zoom));btn.textContent=zoom?'Inquadra tutta la figura':'Ingrandisci figura';
      });
    });
  }
})();
