'use strict';
(() => {
  const E=SL.esc;
  const separatore=' → ';
  function mescola(fasi){
    const ordine=fasi.slice();
    for(let i=ordine.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [ordine[i],ordine[j]]=[ordine[j],ordine[i]];
    }
    if(ordine.every((fase,i)=>fase===fasi[i])){
      [ordine[0],ordine[1]]=[ordine[1],ordine[0]];
    }
    return ordine;
  }
  function campoOrdine(campo,attributi,risposta='',bloccato=false,aiuto=''){
    const fasi=campo.ordine;
    const salvate=String(risposta).split(separatore);
    const valide=salvate.length===fasi.length&&new Set(salvate).size===fasi.length&&salvate.every(fase=>fasi.includes(fase));
    const iniziali=valide?salvate:mescola(fasi);
    const righe=iniziali.map((fase,i)=>{
      const su='<button type="button" data-passo="-1" aria-label="'+E('Sposta prima: '+fase)+'"'+(i===0?' disabled':'')+'>↑</button>';
      const giu='<button type="button" data-passo="1" aria-label="'+E('Sposta dopo: '+fase)+'"'+(i===iniziali.length-1?' disabled':'')+'>↓</button>';
      return '<li data-fase="'+E(fase)+'"><span>'+E(fase)+'</span><span class="frecce">'+su+giu+'</span></li>';
    }).join('');
    return '<fieldset class="ordine"'+(aiuto?' aria-describedby="'+E(aiuto)+'"':'')+(bloccato?' disabled':'')+'><legend>'+E(campo.label)+'</legend>'+
      '<p class="quiet-note">Disponi le fasi dalla prima all’ultima usando le frecce.</p><ol>'+righe+'</ol>'+
      '<input type="hidden" data-ordine-valore'+attributi+' value="'+E(valide?risposta:'')+'"><span class="small" aria-live="polite" data-posizione-ordine></span></fieldset>';
  }
  function spostaFase(pulsante){
    const riga=pulsante.closest('[data-fase]');
    const lista=riga.parentElement,passo=Number(pulsante.dataset.passo);
    const accanto=passo<0?riga.previousElementSibling:riga.nextElementSibling;
    if(!accanto||pulsante.matches(':disabled'))return;
    if(passo<0)lista.insertBefore(riga,accanto);
    else lista.insertBefore(accanto,riga);
    const righe=Array.from(lista.children);
    righe.forEach((el,i)=>{
      el.querySelector('[data-passo="-1"]').disabled=i===0;
      el.querySelector('[data-passo="1"]').disabled=i===righe.length-1;
    });
    const gruppo=lista.closest('.ordine'),valore=gruppo.querySelector('[data-ordine-valore]');
    valore.value=righe.map(el=>el.dataset.fase).join(separatore);
    valore.dispatchEvent(new Event('input',{bubbles:true}));
    gruppo.querySelector('[data-posizione-ordine]').textContent=riga.dataset.fase+' · posizione '+(righe.indexOf(riga)+1)+' di '+righe.length;
    (pulsante.disabled?riga.querySelector('button:not(:disabled)'):pulsante).focus();
  }
  function focusRisposta(input){
    const gruppo=input.closest('.ordine');
    if(gruppo)gruppo.querySelector('button:not(:disabled)')?.focus();
    else input.focus();
  }
  Object.assign(SL,{campoOrdine,spostaFase,focusRisposta});
})();
