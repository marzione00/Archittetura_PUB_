'use strict';
(() => {
  const {rect,arrow}=SL.pen;
  // In uno stesso esercizio una variante può richiedere una figura differente.
  // Ciascun quadro descrive i dati già disponibili al corrispondente passo.
  function righe(testo,capienza){
    const parole=String(testo).trim().split(/\s+/);
    const righe=[];
    let riga='';
    for(const parola of parole){
      if(riga && riga.length+1+parola.length>capienza){
        righe.push(riga);
        riga='';
      }
      riga=riga?riga+' '+parola:parola;
    }
    if(riga)righe.push(riga);
    return righe;
  }
  function testoCentrato(testo,x,y,larghezza,altezza,dimensione,classe){
    if(!testo)return '';
    let righeTesto;
    let passo;
    do{
      // Il carattere monospazio rende prevedibile la misura anche senza font esterni.
      righeTesto=righe(testo,Math.max(4,Math.floor(larghezza/(dimensione*.62))));
      passo=dimensione*1.2;
      if(righeTesto.length*passo<=altezza && righeTesto.every(s=>s.length*dimensione*.62<=larghezza))break;
      dimensione--;
    }while(dimensione>=9);
    const prima=y-(righeTesto.length-1)*passo/2;
    return righeTesto.map((s,i)=>'<text x="'+x+'" y="'+(prima+i*passo)+'" text-anchor="middle" dominant-baseline="central" class="'+classe+'" style="font:'+dimensione+'px ui-monospace, monospace">'+SL.esc(s)+'</text>').join('');
  }
  function disegna(frame){
    const celle=frame.celle;
    const colonnaSingola=celle.length===1;
    const sequenza=frame.tipo==='sequenza';
    const colonne=sequenza?celle.length:Math.min(celle.length,2);
    const righeCelle=Math.ceil(celle.length/colonne);
    const distanza=sequenza?23:14;
    const larghezza=(592-distanza*(colonne-1))/colonne;
    const altezza=righeCelle===2?64:98;
    const inizio=righeCelle===2?45:68;
    let svg=testoCentrato(frame.titolo,320,22,597,37,18,'title');
    celle.forEach(([etichetta,valore],i)=>{
      const riga=Math.floor(i/colonne),col=i%colonne;
      const x=24+col*(larghezza+distanza),y=inizio+riga*(altezza+9);
      const stile=frame.tipo==='confronto'&&col===1?'cell hot':colonnaSingola||sequenza&&i===celle.length-1?'cell active':'cell';
      svg+=rect(x,y,larghezza,altezza,stile);
      svg+=testoCentrato(etichetta,x+larghezza/2,y+altezza*.27,larghezza-14,altezza*.43,13,'small');
      svg+=testoCentrato(String(valore),x+larghezza/2,y+altezza*.70,larghezza-14,altezza*.50,18,'value');
      if(sequenza&&i<celle.length-1)svg+=arrow(x+larghezza+2,y+altezza/2,x+larghezza+distanza-3,y+altezza/2,true);
    });
    svg+=testoCentrato(frame.nota,320,213,590,58,14,'label');
    return '<g class="reveal">'+svg+'</g>';
  }
  for(const [id,nativo] of Object.entries(SL.sceneProve)){
    SL.sceneProve[id]=(variante,passo)=>variante.quadro?disegna(variante.quadro[passo]):nativo(variante,passo);
  }
})();
