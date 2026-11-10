'use strict';
(() => {
  const root=document.getElementById('principale');
  function render(move=true){
    const route=location.hash.slice(1)||'indice',q=route.indexOf('?');
    const path=q<0?route:route.slice(0,q),params=new URLSearchParams(q<0?'':route.slice(q+1));
    let [section,id,num,extra]=path.split('/');
    if(section==='pwn'&&/^6\.3\.(?:[1-9]|1[0-9]|20)$/.test(id||'')){
      section='esercitazioni';num=id.split('.')[2];id='6.3';
    }
    const chapter=SL.chapters.get(id);
    const moduleNumber=Number((id||'').split('.')[0]);
    SL.view={section,module:Number.isInteger(moduleNumber)&&moduleNumber>=1&&moduleNumber<=6?moduleNumber:0};
    SL.stopFilm();SL.after=null;let html='';
    if(!extra){
      if(section==='indice'&&!id)html=SL.home();
      else if(['laboratorio','esercitazioni','mappa'].includes(section)&&(!id||/^parte-[1-6]$/.test(id)||chapter)&&!num)html=SL.directory(section,id,params);
      else if(section==='modulo'&&/^[1-6]$/.test(id||'')&&!num)html=SL.esperimento(id,params,true);
      else if(section==='problema'&&!num&&Object.hasOwn(SL.casiSvolti,id))html=SL.problemaSvolto(id);
      else if(section==='lab'&&!num){
        if(/^6\.3\.[1-4]$/.test(id||''))html=SL.laboratorio(Number(id.split('.')[2]),params);
        else if(Object.hasOwn(SL.unita,id))html=SL.esperimento(id,params);
      }else if(section==='esercitazioni'&&chapter&&/^[1-9]\d*$/.test(num||'')&&Number(num)<=SL.practiceCount(chapter)){
        html=id==='6.3'?SL.esercizi63(Number(num),params):SL.practice(chapter,Number(num),params);
      }else if(section==='soluzioni'&&!num&&(!id||chapter))html=SL.solutions(chapter||SL.real,params);
    }
    if(!html)html='<div class="wrap section"><h1>Percorso sconosciuto</h1><p class="spaced"><a class="btn" href="#mappa">Apri l’indice</a></p></div>';
    root.innerHTML=html;if(SL.after)SL.after();
    const nav=section==='lab'||section==='modulo'?'laboratorio':section==='soluzioni'||section==='problema'?'esercitazioni':section;
    document.querySelectorAll('[data-nav]').forEach(a=>{
      const on=a.dataset.nav===nav;a.classList.toggle('on',on);
      if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    document.title=(root.querySelector('h1')?.textContent||'Indice')+' · SistemiLab';
    if(window.SLbook)document.querySelectorAll('[data-book]').forEach(a=>a.href=window.SLbook+(a.dataset.page?'#page='+a.dataset.page:''));
    if(move){window.scrollTo({top:0,behavior:'instant'});root.focus({preventScroll:true});}
  }
  root.addEventListener('click',event=>{
    const freccia=event.target.closest('.ordine [data-passo]');
    if(freccia){SL.spostaFase(freccia);return;}
    if(!event.target.closest('[data-salta-teoria]'))return;
    const attivita=document.getElementById('inizio-attivita');
    if(attivita){
      attivita.focus({preventScroll:true});
      attivita.scrollIntoView({block:'start'});
    }
  });
  SL.render=render;window.addEventListener('hashchange',()=>render());render(false);
})();
