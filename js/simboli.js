/* Vocabolario vettoriale delle figure. Geometrie entro il riquadro assegnato;
   forma = componente, bordo e facce = stato. Nessuna dipendenza esterna. */
'use strict';
(() => {
  const E=SL.esc;
  const names={input:'Ingresso o indirizzo',cpu:'Processore',register:'Registro',memory:'Memoria a celle',storage:'Archivio persistente',folder:'Directory',file:'File',process:'Processo o thread',gate:'Controllo dei permessi',operation:'Operazione',output:'Uscita'};
  const descriptions={input:'Il cristallo identifica il dato o l’indirizzo da cui parte il passaggio.',cpu:'Il microchip rappresenta l’unità che esegue le istruzioni.',register:'Le celle affiancate rappresentano un registro; l’etichetta ne precisa il nome.',memory:'Il banco di celle rappresenta memoria, cache o una tabella di traduzione.',storage:'I dischi sovrapposti rappresentano un archivio persistente.',folder:'La cartella rappresenta una directory del filesystem.',file:'Il foglio rappresenta un file.',process:'I nuclei collegati rappresentano un contesto di esecuzione.',gate:'La porta rappresenta un controllo di accesso; il testo precisa il suo esito.',operation:'Il nucleo dentato identifica una trasformazione del dato.',output:'Il nucleo circolare identifica l’uscita o il risultato del passaggio.'};
  function kind(label){
    const s=String(label).toLowerCase();
    if(/indirizzo|offset|ingresso|input|sorgente/.test(s))return 'input';
    if(/permess|protezione|privilegio|accesso|dpl|cpl/.test(s))return 'gate';
    if(/directory|cartell|radice/.test(s))return 'folder';
    if(/disco|ssd|archivio|datastore/.test(s))return 'storage';
    if(/\bfile\b|inode/.test(s))return 'file';
    if(/\bpid\b|processo|thread|contesto|gestore|kernel/.test(s))return 'process';
    if(/registro|\b[re](?:ax|bx|cx|dx|si|di|sp|bp|ip)\b|\br\d+\b|\bpc\b|flag/.test(s))return 'register';
    if(/\bcpu\b|processore|\bcore\b|\balu\b/.test(s))return 'cpu';
    if(/memoria|\bram\b|cache|tabella|pagina|frame|buffer|stack/.test(s))return 'memory';
    if(/risultato|uscita|output|destinazione/.test(s))return 'output';
    if(/\b(?:and|or|xor|not|add|lea|mov)\b|operazione|somma|conversione/.test(s))return 'operation';
    return '';
  }
  // Ogni icona occupa 64 × 64. Le facce condividono gli spigoli per restare
  // riconoscibili anche nelle figure piccole e nella versione stampata.
  function glyph(type,x,y,size=40,tone='#f2bd59'){
    const path=(d,fill='none',opacity=1)=>'<path d="'+d+'" fill="'+fill+'" fill-opacity="'+opacity+'" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>';
    const circle=(cx,cy,r,fill='none')=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fill+'" stroke="currentColor" stroke-width="1.3"/>';
    let g='';
    if(type==='input')g=path('M32 3L55 25 43 51 26 61 8 35 18 12Z','#162c2e')+path('M32 3L33 29 55 25M33 29L43 51 26 61 33 29 8 35M18 12L33 29','#8cd4da',.17)+path('M32 3L55 25 33 29Z','#c5fbff',.22)+circle(33,29,3,'#dbffff');
    if(type==='cpu'){
      g=path('M10 22L34 8 55 20 55 43 31 57 10 45Z','#211d14')+path('M10 22L31 35 55 20M31 35V57')+path('M18 23L34 14 48 22 32 31Z','#f2bd59',.25)+path('M25 23L34 18 42 22 32 28Z','#f2bd59',.55);
      for(let i=0;i<4;i++)g+=path('M'+(14+i*6)+' '+(49+i*3)+'v5M'+(38+i*5)+' '+(53-i*3)+'v5M'+(5+i*6)+' '+(18-i*3)+'l5 3');
    }
    if(type==='register'||type==='memory'){
      const rows=type==='memory'?3:1;
      for(let r=0;r<rows;r++){
        const dy=r*13+(rows===1?14:0);
        g+=path('M7 '+(17+dy)+'L24 '+(7+dy)+' 57 '+(20+dy)+' 57 '+(28+dy)+' 40 '+(38+dy)+' 7 '+(25+dy)+'Z','#211d14')+path('M7 '+(17+dy)+'L40 '+(30+dy)+' 57 '+(20+dy)+'M40 '+(30+dy)+'v8');
        for(let c=0;c<3;c++)g+=path('M'+(15+c*10)+' '+(18+dy+c*4)+'l8 -5 7 3 -8 5Z','#f2bd59',.3);
      }
    }
    if(type==='storage'){
      g='<path d="M10 15V47C10 62 54 62 54 47V15" fill="#211d14" stroke="currentColor" stroke-width="1.4"/>';
      for(const y of [15,29,43])g+='<ellipse cx="32" cy="'+y+'" rx="22" ry="9" fill="'+(y===15?'#4a3a1d':'none')+'" stroke="currentColor" stroke-width="1.3"/>';
      g+=path('M16 21V48M21 24V52','none',.4)+circle(45,47,2,'#f2bd59');
    }
    if(type==='folder')g=path('M7 18L19 11 32 16 37 23 57 27 52 52 35 60 7 46Z','#30291a')+path('M7 22L35 33 57 27 52 52 35 60 8 49Z','#f2bd59',.17)+path('M7 22L16 19 35 27 35 33M35 33V60');
    if(type==='file')g=path('M15 5L41 11 53 27 48 59 10 49Z','#342c1c')+path('M41 11L38 25 53 27Z','#f2bd59',.4)+path('M19 28L38 33M18 36L40 42M17 44L34 49');
    if(type==='process')g=circle(32,31,22)+path('M10 31L31 9 54 31 32 53Z','#f2bd59',.09)+circle(32,31,10,'#3c321e')+circle(31,9,4,'#f2bd59')+circle(54,31,4,'#8cd4da')+circle(32,53,4,'#f2bd59')+path('M28 25L38 31 28 37Z','#f2bd59',.7);
    if(type==='gate')g=path('M10 53V14L32 4 54 14V53L43 59V23L32 18 21 23V59Z','#30291a')+path('M10 14L21 20M32 4V18M54 14L43 20')+path('M22 32L42 40M22 40L42 48M22 48L42 56','none',.6)+path('M3 42H17M48 42H62');
    if(type==='operation')g=path('M26 5H38L41 13 49 15 56 24 51 32 56 40 49 49 41 51 38 59H26L23 51 15 49 8 40 13 32 8 24 15 15 23 13Z','#352b18')+circle(32,32,14)+path('M26 24L40 32 26 40Z','#f2bd59',.6);
    if(type==='output')g=circle(32,32,25,'#222519')+'<ellipse cx="32" cy="32" rx="12" ry="25" fill="none" stroke="currentColor"/><ellipse cx="32" cy="32" rx="25" ry="10" fill="none" stroke="currentColor"/>'+circle(32,32,5,'#f2bd59');
    return '<g data-symbol="'+E(type)+'" aria-hidden="true" transform="translate('+x+' '+y+') scale('+(size/64)+')" style="color:'+tone+'">'+g+'</g>';
  }
  function panel(x,y,w,h,fill='#211d14',stroke='#71644a',cls=''){
    if(w<18||h<18)return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" stroke="'+stroke+'" class="'+E(cls)+'"/>';
    const d=Math.min(6,w/8,h/6);
    return '<g class="node-volume"><path class="'+E(cls)+'" d="M'+x+' '+(y+d)+'L'+(x+d)+' '+y+'H'+(x+w)+'V'+(y+h-d)+'L'+(x+w-d)+' '+(y+h)+'H'+x+'Z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.2"/>'+
      '<path d="M'+x+' '+(y+d)+'L'+(x+d)+' '+y+'H'+(x+w)+'L'+(x+w-d)+' '+(y+d)+'Z" fill="#fff1bf" opacity=".13"/>'+
      '<path d="M'+(x+w-d)+' '+(y+d)+'L'+(x+w)+' '+y+'V'+(y+h-d)+'L'+(x+w-d)+' '+(y+h)+'Z" fill="#000" opacity=".36"/>'+
      '<path d="M'+(x+1)+' '+(y+d+1)+'V'+(y+h-1)+'H'+(x+w-d-1)+'" fill="none" stroke="#fff1bf" stroke-opacity=".12"/></g>';
  }
  function node(x,y,w,h,label,value,active=false,role=kind(label)){
    const danger=/danger/.test(String(active)),hot=/hot|focus/.test(String(active)),on=active===true||/active|\bon\b/.test(String(active));
    const tone=danger?'#ff9e8c':hot?'#f2bd59':on?'#8cd4da':'#a99c7f';
    const proposed=Math.min(39,h-14,w*.25);
    const needed=Math.max(String(label).length*6.7,String(value).length*7.3);
    const icon=role&&w>=100&&h>=44&&needed<=w-proposed-24;
    const size=icon?proposed:0,pad=icon?size+10:0,cx=x+pad+(w-pad)/2;
    const fit=(s,max)=>Math.min(max,(w-pad-14)/Math.max(1,String(s).length)/.61);
    function text(str,yy,max,fill){
      const parts=String(str).split(' · ');
      const wrap=max===12&&fit(str,max)<10&&h>=55&&parts.length===2;
      const size=wrap?Math.min(12,...parts.map(p=>(w-pad-14)/Math.max(1,p.length)/.61)):fit(str,max);
      const body=wrap?'<tspan x="'+cx+'">'+E(parts[0]+' · ')+'</tspan><tspan x="'+cx+'" dy="12">'+E(parts[1])+'</tspan>':E(str);
      return '<text x="'+cx+'" y="'+(wrap?yy-3:yy)+'" text-anchor="middle" font-family="ui-monospace,monospace" font-size="'+size+'" style="fill:'+fill+'">'+body+'</text>';
    }
    return panel(x,y,w,h,danger?'#452a25':hot?'#41321b':on?'#193031':'#211d14',tone)+(icon?glyph(role,x+7,y+(h-size)/2,size,tone):'')+text(label,y+18,12,'#cfc5af')+text(value,y+h-11,17,'#f4efdf');
  }
  function legend(graphic){
    const kinds=[...new Set([...graphic.matchAll(/data-symbol="([a-z]+)"/g)].map(m=>m[1]))].filter(k=>names[k]);
    if(!kinds.length)return '';
    return '<details class="symbol-key"><summary>Simboli della figura</summary><div class="symbol-list">'+kinds.map(k=>'<div><svg viewBox="0 0 64 64" aria-hidden="true">'+glyph(k,0,0,64)+'</svg><p><strong>'+names[k]+'</strong><br>'+descriptions[k]+'</p></div>').join('')+'</div><p class="symbol-state">L’etichetta identifica il componente e il valore ne descrive il contenuto. Il bordo evidenziato segue il passo selezionato; gli impulsi sulle connessioni accompagnano il trasferimento mostrato.</p></details>';
  }
  SL.symbols={kind,glyph,panel,node,legend,names};
})();
