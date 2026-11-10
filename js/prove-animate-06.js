'use strict';
(() => {
  const {rect,text,line,path,box,arrow,travel}=SL.pen;
  const scenes={};
  const head=s=>text(24,27,s,'title');
  const note=(s,y=224)=>text(24,y,s,'label');
  const tiny=(x,y,s,anchor='start')=>text(x,y,s,'small',anchor);
  const hex=n=>'0x'+Number(n).toString(16).toUpperCase();
  const f=(v,i)=>v.campi[i].answer;
  const nums=s=>(s.match(/0x[0-9a-f]+|\d+(?:\.\d+)?/gi)||[]).map(Number);
  const bracket=(s,re)=>s.match(re)[1];
  function flow(x,y,u,z,on){return arrow(x,y,u,z,on)+(on?travel('M'+x+' '+y+' L'+u+' '+z):'');}
  function capsule(x,y,w,label,cls='cell'){
    return rect(x,y,w,31,cls,4)+text(x+w/2,y+21,label,'small','middle');
  }
  function tape(y,items,active=-1){
    const dx=Math.min(120,592/items.length);
    return items.map((x,i)=>capsule(24+i*dx,y,dx-4,x,i===active?'cell hot':'cell')).join('');
  }
  function row(y,entries){
    const dx=592/entries.length;
    return entries.map(([name,value,active],i)=>box(24+dx*i,y,dx-10,56,name,value,active?'cell hot':'cell')).join('');
  }
  function bits(y,value,width,accentBits=0){
    const w=Math.min(29,592/width),word=BigInt(value).toString(2).padStart(width,'0').slice(-width);
    return [...word].map((c,i)=>capsule(24+i*w,y,w-1,c,i>=width-accentBits?'cell hot':'cell')).join('');
  }
  function bar(x,y,w,h,used,n,cls='active'){
    return rect(x,y,w,h,'cell',1)+(used?rect(x,y,w*Math.min(1,used/n),h,'cell '+cls,1):'');
  }
  const stages={
    '6.1/1'(v,k){
      const dram=v.campi.length===2;
      let g=head('Cella di memoria')+note(dram?'Memoria principale · il bit è una carica':'Cache sul chip · il bit è uno stato stabile',58);
      if(dram){
        g+=tiny(48,100,'Tensione')+line(60,178,60,110)+line(60,178,332,178);
        g+=path('M65 121 Q135 134 204 168','wire live');
        if(k>=3)g+=path('M204 168 V121 Q277 139 330 168','wire live')+travel('M204 168 V121');
        g+=tiny(300,196,'tempo');
        if(k>=2)g+=box(385,112,195,62,'Cella',f(v,0),'cell active');
      }else{
        g+=capsule(90,114,103,'Q')+capsule(332,114,103,'Q̅')+flow(196,118,328,118,k>=2)+flow(329,142,195,142,k>=2);
        if(k>=2)g+=tiny(137,177,'Retroazione alimentata: i due nodi mantengono lo stato.');
      }
      return g+note(k===3?(dram?'Il refresh ripristina la carica.':'Il circuito bistabile realizza la cella SRAM.'):(k?'Osserva il meccanismo che mantiene il bit.':'Confronta il requisito di conservazione del bit con il disegno.'));
    },
    '6.1/2'(v,k){
      const [n,size,start,lineSize]=nums(v.consegna),end=start+n*size-1,first=Math.floor(start/lineSize),last=Math.floor(end/lineSize);
      let g=head('Scansione continua degli interi')+row(44,[['Primo byte',start],['Interi × byte',n+' × '+size],['Linea',lineSize+' B']]);
      g+=bar(24,128,574,20,1,1)+tiny(24,173,start)+tiny(596,173,k?end:'ultimo ?','end');
      if(k>=2){for(let b=first+1;b<=last;b++){const xx=24+(b*lineSize-start)*574/(n*size);g+=line(xx,119,xx,155,'wire live');}
        g+=tiny(25,193,'Linea iniziale '+first+' · linea finale '+last);}
      return g+note(k===3?'Linee distinte: '+f(v,0):'L’estremo finale è incluso nel conteggio.');
    },
    '6.1/3'(v,k){
      const ops=Array.from(v.consegna.matchAll(/(scrivi|leggi) (\d+)/g),m=>[m[1],Number(m[2])]),slots=[null,null];
      let hits=0,wb=0;const until=Math.min(k,ops.length);
      for(let i=0;i<until;i++){const [op,addr]=ops[i],block=Math.floor(addr/16),j=block%2,old=slots[j],hit=old?.b===block;
        if(hit)hits++;else if(old?.dirty)wb++;slots[j]={b:block,dirty:op==='scrivi'||Boolean(hit&&old.dirty)};}
      let g=head('Cache diretta · due linee · write-back')+tape(48,ops.map(([op,addr])=>(op==='scrivi'?'S ':'L ')+addr),k-1);
      g+=row(105,slots.map((a,i)=>['Indice '+i,a?'blocco '+a.b:'vuoto',Boolean(a)]));
      slots.forEach((a,i)=>{if(a)g+=tiny(29+i*296,183,a.dirty?'dirty = 1':'dirty = 0');});
      return g+note(k?'Hit '+hits+' · vittime sporche riscritte '+wb:'S = scrittura · L = lettura · linee da 16 byte.');
    },
    '6.1/4'(v,k){
      const [base,miss,pen]=nums(v.consegna);
      let g=head('Costo medio · cento richieste')+tiny(24,58,'Griglia delle richieste');
      for(let i=0;i<100;i++)g+=rect(24+i%10*16,70+Math.floor(i/10)*13,12,9,k>=2&&i>=100-miss?'cell hot':'cell active',1);
      g+=box(237,70,169,54,'Consultazioni',k?100*base+' ns':'100 × '+base,'cell active')+box(417,70,169,54,'Rifornimenti',k>=2?miss*pen+' ns':miss+' × '+pen,k>=2?'cell hot':'cell');
      return g+(k>=3?box(237,143,349,52,'Tempo medio',f(v,0)+' ns','cell active'):'');
    },
    '6.1/5'(v,k){
      const [pen,a,ma,b,mb]=nums(v.consegna),times=[a+pen*ma/100,b+pen*mb/100],limit=Math.max(...times);
      let g=head('Due progetti di cache · media per accesso');
      for(let i=0;i<2;i++){const y=70+i*68,done=k>=i+1;g+=tiny(24,y,'Cache '+(i?'B':'A')+' · '+(i?mb:ma)+'% miss');
        g+=bar(184,y-18,316,24,done?times[i]:0,limit,i?'hot':'active')+tiny(526,y,done?times[i]+' ns':'?');}
      return g+note(k>=3?'Media inferiore: progetto '+f(v,0)+'.':'Ogni barra comprende il costo di hit e la quota dovuta ai miss.');
    },
    '6.2/1'(v,k){
      const [vpn,offset]=nums(v.consegna),[frameA,frameB]=Array.from(v.consegna.matchAll(/al frame (\d+)/g),m=>+m[1]),pa=[f(v,0),f(v,1)];
      let g=head('La tabella appartiene al processo')+box(24,89,126,54,'VPN',vpn,'cell active');
      [frameA,frameB].forEach((fr,i)=>{const y=58+76*i;g+=flow(151,117,236,y+27,k===1)+box(238,y,137,54,'Tabella '+(i?'B':'A'),'PFN '+fr,k?'cell active':'cell')+flow(376,y+27,428,y+27,k>=2)+box(429,y,169,54,'PA · offset '+offset,k>=2?hex(pa[i]):'?',k>=2?'cell hot':'cell');});
      return g+note(k===3?f(v,2):'La pagina è di 4096 byte in entrambi gli spazi.');
    },
    '6.2/2'(v,k){
      const [page,va]=nums(v.consegna);return splitPage(v,k,va,page);
    },
    '6.2/3'(v,k){
      const [page,va,pte]=nums(v.consegna),off=va%page;
      return head('Voce codificata · prova del bit zero')+tape(49,['VA '+hex(va),'PTE '+pte,'pagina '+page])+bits(96,pte,8,k>=2?1:0)+row(150,[['Offset',k?off:'?'],['Present',k>=2?pte%2:'?',k===2],['Esito',k>=3?(pte%2?hex(f(v,1)):'fault'):'?',k===3]]);
    },
    '6.2/4'(v,k){
      const dirty=v.consegna.includes('è sporca');let g=head('Rimpiazzo del frame e recupero')+box(25,77,150,62,'Pagina richiesta','nel file')+box(247,77,141,62,'Frame vittima',dirty?'sporca':'pulita','cell hot')+box(460,77,148,62,'Copia esterna','disco');
      if(k>=2&&dirty)g+=flow(389,110,456,110,true);
      if(k>=3)g+=flow(175,110,244,110,true)+box(239,155,255,48,'Istruzione','ritentata','cell active');
      return g+note(k>=3?'Trasferimenti di pagina: '+f(v,0)+'.':k===2?(dirty?'La vittima deve essere riscritta.':'La copia esterna della vittima è già valida.'):'Prima si verifica che l’accesso sia ammesso.');
    },
    '6.2/5'(v,k){
      const refs=bracket(v.consegna,/Traccia ([A-Z ]+)\./).split(' '),[w,budget]=nums(v.consegna),within=refs.slice(-w),set=[...new Set(within)];
      let g=head('Finestra delle pagine recentemente richieste')+tape(56,refs);
      if(k){const dx=Math.min(120,592/refs.length),x=24+(refs.length-w)*dx;g+=path('M'+x+' 95 v8 H'+(24+refs.length*dx-4)+' v-8','wire live');}
      if(k>=2)g+=tape(132,set);
      return g+note(k>=3?'Budget '+budget+' frame · ulteriori frame richiesti '+f(v,1)+'.':'La finestra include gli ultimi '+w+' riferimenti.');
    }
  };
  function splitPage(v,k,va,page){
    const b=Math.log2(page),vpn=Math.floor(va/page),off=va%page;
    return head('Indirizzo virtuale · quoziente e resto')+row(45,[['VA',hex(va)],['Pagina',page+' B']])+bits(117,va,Math.max(16,va.toString(2).length),k?b:0)+row(171,[['VPN',k>=2?vpn:'?'],['Offset',k>=2?off:'?'],['VA ricostruito',k>=3?va:'?',k===3]]);
  }
  scenes['6.3/1']=scenes['6.3/3']=(v,k)=>{const [va,page]=nums(v.consegna);return splitPage(v,k,va,page);};
  scenes['6.3/2']=(v,k)=>{
    const [vpn,offset,page]=nums(v.consegna);
    return head('Due record di pagina')+row(49,[['VPN',vpn],['Offset',offset],['VA',k?f(v,1):'?']])+row(129,[['Secondo offset',page],['VPN normalizzata',k===3?f(v,3):'?'],['Offset normalizzato',k===3?f(v,4):'?']])+note(k>=2?'L’offset '+page+' occupa esattamente una pagina.':'Offset validi: da 0 a '+(page-1)+'.');
  };
  scenes['6.3/4']=(v,k)=>{
    const [size,start,page]=nums(v.consegna),first=page-start%page;
    let g=head('Accesso a cavallo del confine')+tiny(24,58,'Richiesta di '+size+' byte da '+hex(start));
    for(let i=0;i<size;i++){g+=capsule(24+i*72,77,69,hex(start+i),k?(i<first?'cell active':'cell hot'):'cell');}
    if(k)g+=line(22+first*72,66,22+first*72,119,'wire live');
    g+=row(146,[['Primo tratto',k>=2?f(v,2)+'…'+f(v,3):'?'],['Secondo tratto',k>=3?f(v,4)+'…'+f(v,5):'?']]);
    return g+(k===4?note('Si verifica anche il permesso della seconda pagina.'):'');
  };
  function compose(v,k,n){
    const b=v.bits,va=Number(v.va),base=v.pfn*2**b,mask=2**b-1;
    let g=head('SHL, AND e OR · composizione di RAX')+row(45,[['RDI · VA',v.va],['RSI · PFN',v.pfn],['Pagina',2**b+' B']]);
    g+=row(127,[['PFN << '+b,k>=1?hex(base):'?'],['VA & maschera',k>=2?hex(va%2**b):'?'],['RAX · OR',k>=3?f(v,2):'?']]);
    if(k===3)g+=flow(389,155,413,155,true);
    const extra=n===6?'Estremi: '+f(v,3)+' … '+f(v,4):n===7?(k===4?'OR con tutta la VA → '+f(v,3):'La maschera corretta ha '+b+' bit: '+hex(mask)+'.'):n===8?'Massimo: '+f(v,3)+' · larghezza '+f(v,4)+' bit.':'';
    return g+note(k>3?extra:k===2?'Maschera di offset: '+hex(mask):'La base del frame e l’offset occupano campi disgiunti.');
  }
  function lookup(v,k,n){
    const stride=2**v.bits,vpn=Math.floor(Number(v.va)/stride);
    let g=head('Indirizzo della voce e carico di otto byte')+row(46,[['RDI',v.va],['RSI · base',v.base],['RAX dopo SHR',k>=1?vpn:'?']])+
      box(31,134,211,52,'Indirizzo effettivo',k>=2?f(v,1):'?',k===2?'cell hot':'cell')+flow(244,158,364,158,k===3)+box(368,134,198,52,'MOV → RAX',k>=3?v.pfn:'?',k===3?'cell active':'cell');
    let extra='Scala della tabella: 8 B per voce.';
    if(k>=4)extra=n===10?'LEA produce '+f(v,3)+'. MOV carica '+v.pfn+'.':n===11?'SHR: '+v.bits+' bit · scala di indirizzamento: 8.':k===4?'Confine virtuale '+f(v,3)+' → '+f(v,4):'Voce successiva a '+f(v,5)+'.';
    return g+note(extra);
  }
  for(let i=5;i<=8;i++)scenes['6.3/'+i]=(v,k)=>compose(v,k,i);
  for(let i=9;i<=12;i++)scenes['6.3/'+i]=(v,k)=>lookup(v,k,i);
  scenes['6.3/13']=(v,k)=>{
    const pte=Number(bracket(v.consegna,/contiene la PTE (\d+)/));
    return head('La validità è il bit meno significativo')+note('PTE grezza = '+pte,64)+bits(81,pte,8,k?1:0)+row(137,[['valid',k?f(v,0):'?'],['campo alto',k>=2?f(v,1):'?'],['JZ',k===3?'ramo errore':'?']]);
  };
  scenes['6.3/14']=(v,k)=>{
    const [base,vpn]=nums(v.consegna);
    return head('Una voce in una tabella lineare')+row(47,[['Base',hex(base)],['Indice VPN',vpn],['Voce',8+' B']])+row(130,[['Spostamento',k?f(v,0)+' B':'?'],['Indirizzo della PTE',k>=2?f(v,1):'?']])+note(k===3?'Si legge la PTE. Il dato si trova nel frame indicato dalla voce.':'L’indice conta voci, lo spostamento conta byte.');
  };
  scenes['6.3/15']=(v,k)=>{
    const [ns]=nums(v.consegna);
    return head('Due letture dipendenti in RAM')+note('Una lettura dura '+ns+' ns.',61)+capsule(25,90,266,k?'lettura della PTE':'?',k?'cell active':'cell')+capsule(293,90,266,k>=2?'lettura del dato':'?',k>=2?'cell hot':'cell')+tiny(25,146,0)+tiny(292,146,k?ns+' ns':'?')+tiny(559,146,k>=2?2*ns+' ns':'?','end')+(k===3?row(164,[['Letture',f(v,0)],['Tempo',f(v,1)+' ns']]):'');
  };
  scenes['6.3/16']=(v,k)=>{
    const [vpn,a,b]=nums(v.consegna);
    return head('Cambio di spazio · stessa VPN '+vpn)+row(49,[['P · frame',a],['Q · frame',b],['PTBR',k>=2?'tabella Q':'?']])+row(132,[['TLB precedente','P / '+vpn],['Chiave corretta',k>=3?'Q / '+vpn:'?'],['Frame usato da Q',k>=4?f(v,2):'?']])+note(k>=3?'Una voce del contesto P deve essere distinta o invalidata.':'Il nuovo processo usa la propria radice.');
  };
  function walker(v,k,n){
    const va=Number(v.va),page=2**v.bits,vpn=Math.floor(va/page),off=va%page;
    let g=head('Traduzione · rami della PTE')+row(44,[['VA',v.va],['VPN',k?vpn:'?'],['Offset',k?hex(off):'?']])+
      row(120,[['PTE '+v.pte+' · valida',k>=2?f(v,0):'?'],['PTE '+v.invalidPte+' · invalida',k>=3?'RAX = −1':'?']]);
    let msg=k?'Indice della voce: '+vpn+' · distanza dalla base: '+8*vpn+' B.':'Ogni voce occupa otto byte.';
    if(k===3)msg='Sentinella a 64 bit: 0xFFFFFFFFFFFFFFFF.';
    if(k>3)msg=n===18?'PTE 1 → PFN 0, PA = '+f(v,2)+'.':n===19?'VPN uguale alla lunghezza: il controllo precede il caricamento.':'MOV EAX, −1 → RAX = '+f(v,2)+'.';
    return g+note(msg);
  }
  for(let i=17;i<=20;i++)scenes['6.3/'+i]=(v,k)=>walker(v,k,i);
  Object.assign(scenes,stages,{
    '6.4/1'(v,k){
      const refs=v.consegna.match(/[AB]\/\d+/g),lru=[];
      let hits=0,walks=0,last='';
      for(let i=0;i<Math.min(k,refs.length);i++){
        const key=refs[i],idx=lru.indexOf(key);
        if(idx>=0){lru.splice(idx,1);hits++;last='hit';}else{if(lru.length===2)lru.shift();walks++;last='miss';}lru.push(key);
      }
      return head('Ricerca nella TLB · chiave ASID/VPN')+tape(54,refs,k-1)+row(120,[['LRU',lru[0]||'libera'],['Slot 2',lru[1]||'libera'],['Ultima ricerca',last||'—']])+
        note(k===refs.length+1?'Totale: '+hits+' hit, '+walks+' consultazioni delle tabelle.':'Un hit sposta la voce in fondo all’ordine di recenza.');
    },
    '6.4/2'(v,k){
      const pairs=Array.from(v.consegna.matchAll(/\((\d+),(\d+)\)/g),m=>[+m[1],+m[2]]);
      const key=Number(bracket(v.consegna,/RDI = (\d+)/)),end=pairs.findIndex(([a])=>a===key),probes=end===-1?pairs.length:end+1;
      let g=head('Ricerca lineare nel vettore (VPN, PFN)')+note('RDI = '+key+'   ·   RSI indica il primo record',60);
      pairs.forEach(([vpn,pfn],i)=>{g+=box(24+i*150,82,135,63,k?'offset '+16*i+' B':'record '+i,'('+vpn+', '+pfn+')',k>=2&&i<probes?'cell hot':'cell');});
      if(k>=2)g+=path('M30 160 H'+(24+150*(probes-1)+68),'wire live')+travel('M30 160 H'+(24+150*(probes-1)+68));
      return g+note(k===3?'RAX = '+f(v,0)+'    ·    RCX = '+f(v,1)+' B':k===1?'RCX avanza di 16 byte per record.':'Ogni coppia occupa due parole da otto byte.');
    },
    '6.4/3'(v,k){
      const va=Number(bracket(v.consegna,/bit (0x[\dA-F]+)/i)),widths=bracket(v.consegna,/ripartizione ([\d/]+)/).split('/').map(Number);
      let g=head('Ripartizione di VA '+hex(va)),x=24;const bin=va.toString(2).padStart(32,'0');let n=0;
      widths.forEach((w,i)=>{const width=w*18.3;g+=box(x,67,width-3,62,['Indice L1','Indice L2','Offset'][i],bin.slice(n,n+w),k===i+1?'cell hot':'cell');n+=w;x+=width;});
      return g+row(154,[['Indice superiore',k>=1?f(v,0):'?'],['Indice inferiore',k>=2?f(v,1):'?'],['Offset',k>=3?f(v,2):'?']]);
    },
    '6.4/4'(v,k){
      const [va,base,child]=v.consegna.match(/0x[\da-f]+/gi).map(Number),leaf=Number(bracket(v.consegna,/foglia valida vale (\d+)/));
      return head('Due caricamenti dipendenti nel page walk')+row(45,[['RDI · VA',hex(va)],['RSI · radice',hex(base)],['Base della figlia',hex(child)]])+
        row(128,[['Load L1',k>=1?hex(f(v,0)):'?'],['Load L2',k>=2?hex(f(v,1)):'?'],['RAX · PA',k>=3?hex(f(v,2)):'?']])+note(k>=2?'PTE = '+leaf+' · scostamento '+(va%4096)+' B.':'Entrambe le tabelle hanno voci da 8 byte.');
    },
    '6.4/5'(v,k){
      const [tlb,ram,lv,hits]=nums(v.consegna);
      let g=head('TLB seriale e letture RAM')+tiny(24,57,'HIT')+tape(66,['TLB','dato']);
      if(k)g+=tiny(332,91,tlb+ram+' ns');
      g+=tiny(24,128,'MISS');
      if(k>=2)g+=tape(138,['TLB',...Array.from({length:lv},(_,i)=>'L'+(i+1)),'dato'])+tiny(24,194,'Costo di miss: '+f(v,0)+' ns.');
      return g+note(k===3?hits+'% hit · latenza media '+f(v,1)+' ns.':'Consultazione TLB '+tlb+' ns · RAM '+ram+' ns per lettura.',234);
    },
    '6.5/1'(v,k){
      const rename=v.consegna.includes('rinomina');
      let g=head(rename?'Rinominare un file':'Dove si trovano lunghezza e contenuto?')+
        box(24,80,160,60,'Nome locale',rename?(k>=2?'testo':'tesi'):'nome del file','cell active')+
        flow(185,111,231,111,k>=1)+box(232,80,160,60,'Inode',rename?'stesso oggetto':k>=2?'lunghezza':'?',k>=1?'cell hot':'cell')+
        flow(393,111,437,111,k>=3)+box(438,80,168,60,'Blocchi dati',k>=3?(rename?'stessi blocchi':'byte 0…3'):'—',k>=3?'cell active':'cell');
      return g+note(k===0?'La directory mette in relazione un nome e un identificatore.':k===1?'La ricerca avviene nella directory.':k===2?(rename?'Cambia la voce di directory.':'stat legge il metadato di lunghezza.'):'Il contenuto del file appartiene ai blocchi dati.');
    },
    '6.5/2'(v,k){
      const cwd=bracket(v.consegna,/Da CWD (\/\w+)/),target=bracket(v.consegna,/risolvi (\S+)\. Usa/),components=target.split('/');
      const current0=cwd==='/corso'?7:11;let current=current0;
      const next={'7:..':2,'2:casa':11,'11:testo':55,'11:.':11};
      for(let j=0;j<Math.min(components.length,Math.max(0,k-1));j++)current=next[current+':'+components[j]]??-1;
      return head('Risoluzione dalla directory '+cwd)+tape(53,components,k>=2?k-2:-1)+
        row(131,[['CWD',cwd],['Inode corrente',k===0?'?':current<0?'assente':current],['Esito',k===v.svolgimento.length?(current<0?'errore':'file'):'?']])+note(k?'Percorso: '+target:'La directory di partenza è relativa al processo.');
    },
    '6.5/3'(v,k){
      const open=v.consegna.includes('mantiene un descrittore'),removed=k>=2;
      let g=head('Riferimenti a inode 30');
      for(let i=0;i<2;i++){const y=61+i*44;g+=capsule(24,y,100,i?'nome b':'nome a',removed?'cell off':'cell active');if(!removed)g+=flow(125,y+16,243,109,k===1);}
      if(open){g+=capsule(24,155,133,k===3?'fd → chiusura':'fd aperto','cell active');if(k<3)g+=flow(157,170,244,121,k>=2);}
      g+=box(246,79,150,61,'Inode',30,'cell hot')+box(450,79,154,61,'Link count',k?(removed?0:2):'?',k?'cell active':'cell');
      return g+note(k===3?(open?'Dopo la chiusura finale i blocchi diventano recuperabili.':'Dopo unlink di b i blocchi diventano recuperabili.'):'Si contano separatamente nomi e descrittori aperti.');
    },
    '6.5/4'(v,k){
      const [blocks]=nums(v.consegna),bytes=Number(f(v,0)),extra=Number(f(v,1));
      let g=head('Bitmap · otto blocchi indirizzabili per byte')+row(45,[['Blocchi',blocks],['Bit necessari',k?blocks:'?'],['Byte interi',k>=2?bytes:'?']]);
      g+=tiny(24,128,'Ultimo byte della bitmap');
      for(let i=0;i<8;i++)g+=capsule(24+i*67,143,59,k===3?(i>=8-extra?'extra':'blocco'):'?',k===3?(i>=8-extra?'cell hot':'cell active'):'cell');
      return g+note(k===3?'Bit di riempimento: '+extra+'.':'Gli eventuali bit di riempimento appartengono all’ultimo byte.');
    },
    '6.5/5'(v,k){
      const chain=bracket(v.consegna,/descrive ([\d →]+)→ fine/).split('→').map(n=>+n.trim()),cap=Number(bracket(v.consegna,/blocchi da (\d+) byte/)),pos=Number(bracket(v.consegna,/posizione (\d+)/)),idx=Math.floor(pos/cap);
      let g=head('FAT · dalla directory al byte')+row(45,[['Primo blocco',chain[0]],['Byte del file',pos],['Indice logico',k?idx:'?']]);
      chain.forEach((id,i)=>{const x=25+i*148;g+=capsule(x,134,100,'blocco '+id,k>=2&&i<=idx?'cell active':'cell');if(i<3)g+=flow(x+102,149,x+145,149,k>=2&&i<idx);});
      return g+note(k===3?'Blocco '+f(v,0)+' · offset '+f(v,1)+' B':k===2?idx+' successori dalla directory.':'Ogni blocco contiene '+cap+' byte.');
    },
    '6.6/1'(v,k){
      const b=Number(bracket(v.consegna,/bitmap vale (\d)/)),r=Number(bracket(v.consegna,/trova (\d+) riferiment[oi]/));
      return head('Arresto · confronto delle copie persistenti')+row(58,[['Bitmap[17]',b,k===1],['Riferimenti a 17',r,k===2]])+
        (k>=2&&r?flow(420,115,285,150,true):'')+capsule(166,149,300,k===0?'blocco 17':k===1?(b?'occupato':'libero'):k===2?(r?'raggiunto dagli inode':'irraggiungibile'):f(v,0),k===3?'cell danger':'cell')+note(k===3?f(v,1):'Confronta il bit con i puntatori degli inode sul blocco 17.');
    },
    '6.6/2'(v,k){
      const [owners,bits0]=Array.from(v.consegna.matchAll(/\{([^}]*)\}/g),m=>nums(m[1]));
      const ids=[...new Set([...owners,...bits0])].sort((a,b)=>a-b);let g=head('Riconciliare inode e bitmap');
      ids.forEach((b,i)=>{const x=31+i*78,owner=owners.includes(b),bit=bits0.includes(b);
        g+=tiny(x+24,70,b,'middle')+capsule(x,81,51,owner?'1':'0',owner?'cell active':'cell')+capsule(x,123,51,(k>=1&&owner||k<2&&bit)?'1':'0',k&&owner!==bit?'cell hot':'cell');});
      g+=tiny(530,101,'inode')+tiny(530,143,'bitmap');
      return g+note(k===0?'Le colonne identificano i numeri di blocco.':k===1?'Imposta i bit dei blocchi raggiungibili segnati liberi.':k===2?'Azzera gli eventuali bit privi di riferimento.':'Aggiornamento: '+f(v,0)+' bit a 1, '+f(v,1)+' bit a 0.');
    },
    '6.6/3'(v,k){
      const committed=v.consegna.startsWith('Tutti');
      const labels=['record redo','commit','installazione','checkpoint'];
      const focus=k===0?(committed?1:0):k===1?0:k===2?(committed?2:1):3;
      let g=head('Ordine di persistenza del redo log');
      labels.forEach((l,i)=>{const x=22+i*153;g+=box(x,88,128,58,'Fase '+(i+1),l,i===focus?'cell hot':'cell');if(i<3)g+=flow(x+128,116,x+150,116,k>0&&i===focus-1);});
      return g+note(k===3?'Il checkpoint durevole consente il riuso dello spazio.':k===2?(committed?'La prossima operazione installa le immagini.':'Il commit deve diventare durevole.'):(committed?'Dati iniziali: record e commit durevoli.':'Dati iniziali: record durevoli, commit ancora da scrivere.'));
    },
    '6.6/4'(v,k){
      const committed=!v.consegna.includes('senza un commit');
      return head('Crash · X nel journal e nella posizione definitiva')+row(52,[['Disco · X',k===3?f(v,1):4],['Record redo','X = 11'],['Commit',committed?'durevole':'assente',k===2]])+
        (k===3&&committed?flow(321,114,127,151,true):'')+row(151,[['Decisione',k===3?f(v,0):'?'],['X dopo recupero',k===3?f(v,1):'?']])+
        tiny(24,235,k===1?'L’immagine iniziale è quella conservata su disco.':'La presenza del commit decide se reinstallare il valore del record.');
    },
    '6.6/5'(v,k){
      const committed=bracket(v.consegna,/solo (T[12])/);
      let g=head('Recupero di due transazioni distinte');
      [['T1','A',3,12],['T2','B',6,21]].forEach(([id,letter,old,target],i)=>{
        const y=56+i*71,checked=k>i;
        g+=capsule(24,y+10,71,id,checked?'cell hot':'cell')+box(116,y,138,53,'Immagine redo',letter+' = '+target)+box(270,y,152,53,'Commit',id===committed?'durevole':'assente')+box(458,y,146,53,'Disco',letter+' = '+(checked&&id===committed?target:old),checked?'cell active':'cell');
      });
      return g+note(k===3?'Ripetendo il redo si ottiene ancora ('+f(v,0)+', '+f(v,1)+').':'Al riavvio ciascun commit qualifica la propria transazione.');
    },
    '6.7/1'(v,k){
      const read=v.consegna.includes('copiare');
      return head('Quale proprietà è cambiata?')+row(57,[['Soggetto','account'],['Operazione',read?'copia':'salvataggio',k>=1],['Oggetto',read?'verbale':'voti']])+
        row(137,[['Visibilità',k>=2?(read?'estesa':'invariata'):'?'],['Contenuto',k>=2?(read?'invariato':'modificato'):'?'],['Servizio','accessibile']])+note(k===3?'Proprietà compromessa: '+f(v,0)+'.':'Confronta destinatari, contenuto e disponibilità.');
    },
    '6.7/2'(v,k){
      const member=v.consegna.includes('appartiene');
      return head('ACL additiva · Ada chiede la modifica')+row(53,[['Voce individuale','lettura',k>=1],['Gruppo revisori','modifica',k>=2&&member]])+
        flow(166,111,267,153,k>=1)+(k>=2&&member?flow(474,111,354,153,true):'')+box(159,156,315,50,'Diritti effettivi',k>=2?f(v,0):'?',k>=2?'cell hot':'cell')+
        tiny(24,236,k===3?'Decisione: '+f(v,1)+'.':'Appartenenza ai revisori: '+(member?'sì':'no')+'.');
    },
    '6.7/3'(v,k){
      const perm=bracket(v.consegna,/solo di ([rx])/);
      return head('Permessi sul percorso /archivio/esiti')+row(55,[['Radice /','x',k===1],['Directory archivio',perm,k===2],['File esiti','r',k===3]])+
        row(142,[['Elencare i nomi',k>=2?f(v,0):'?'],['Aprire esiti',k>=3?f(v,1):'?']])+note(k===0?'Il soggetto conosce già il nome esiti.':'Per elencare i nomi occorre r. Per cercarne uno occorre x.');
    },
    '6.7/4'(v,k){
      const key=v.consegna.includes('chiave corretta in chiaro');
      let g=head('Immagine offline del volume')+box(24,81,142,66,'Supporto','blocchi cifrati',k>=1?'cell hot':'cell')+box(231,81,149,66,'Chiave',key?'disponibile':'assente',k>=2?'cell hot':'cell')+box(442,81,164,66,'Osservazione',k===3?(key?'in chiaro':'cifrata'):'?',k===3?'cell active':'cell');
      if(k>=3&&key)g+=flow(380,114,438,114,true);
      return g+note(k===1?'L’immagine del disco conserva la rappresentazione cifrata.':k===2?'Il formato è noto. Per decifrare serve anche la chiave.':'Il punto di osservazione è esterno alla sessione montata.');
    },
    '6.7/5'(v,k){
      const rows=Array.from(v.consegna.matchAll(/(\d+) \/ (\w+) \/ (\w+) \/ (\w+) \/ (\w+)/g),m=>m.slice(1)),last=Number(bracket(v.consegna,/Fino al minuto (\d+)/)),user=bracket(v.consegna,/account (\w+) su tesi/);
      let g=head('Registro di audit · '+user+' / tesi · fino al minuto '+last);
      rows.forEach(([t,u,obj,op,status],i)=>{const selected=Number(t)<=last&&u===user&&obj==='tesi',y=45+i*29;
        g+=rect(24,y,591,24,k>=1&&selected?'cell hot':k?'cell off':'cell',1);
        [t,u,obj,op,status].forEach((z,j)=>g+=tiny([40,87,190,312,463][j],y+17,z));});
      return g+tiny(25,219,k===3?'L’attribuzione riguarda l’account registrato.':k===2?'Righe mantenute '+f(v,0)+' · richieste concesse '+f(v,1)+'.':'Prima il tempo, poi l’account e l’oggetto.');
    }
  });
  // Casi in cui la relazione spaziale o temporale è parte del ragionamento.
  const figureCorrezione={
    pareggio(d,k){
      const ox=65, oy=190, sx=10, sy=24;
      const costo=(i,p)=>d.ricerca[i]+p*d.miss[i]/100;
      const y=(i,p)=>oy-costo(i,p)*sy;
      const pari=(d.ricerca[1]-d.ricerca[0])*100/(d.miss[0]-d.miss[1]);
      let g=head('Due progetti al variare della penalità')+
        line(ox,oy,570,oy)+line(ox,oy,ox,46)+tiny(23,49,'ns')+tiny(578,207,'p (ns)','end');
      [0,10,20,30,40,50].forEach(p=>g+=line(ox+p*sx,oy-3,ox+p*sx,oy+3)+tiny(ox+p*sx,209,p,'middle'));
      if(k>0){
        for(let i=0;i<2;i++){
          g+=line(ox,y(i,0),ox+50*sx,y(i,50),i?'wire':'wire live')+tiny(580,y(i,50)+5,i?'B':'A');
        }
      }
      if(k>=2){
        g+=line(ox+pari*sx,oy,ox+pari*sx,y(0,pari),'wire live')+rect(ox+pari*sx-4,y(0,pari)-4,8,8,'cell hot')+
          tiny(ox+pari*sx+7,y(0,pari)-8,'p = '+pari);
      }
      if(k===3){
        for(let i=0;i<2;i++)g+=rect(ox+d.penalita*sx-4,y(i,d.penalita)-4,8,8,'cell hot');
      }
      return g+tiny(24,239,k===3?'A 40 ns si sceglie la retta più bassa.':'In orizzontale varia la penalità e in verticale si legge il costo medio.');
    },
    finestra(d,k){
      const n=[1,2,3,4][k],inizio=d.pagine.length-n,uniche=new Set(d.pagine.slice(inizio));
      let g=head('Quanto si può allargare la finestra finale?');
      d.pagine.forEach((p,i)=>{
        const x=36+i*113;
        g+=tiny(x+48,93,'lettura '+(i+1),'middle')+capsule(x,109,96,p,i>=inizio?'cell hot':'cell');
      });
      const x=36+inizio*113,dx=(n-1)*113+96;
      g+=path('M'+x+' 150v11h'+dx+'v-11','wire live');
      g+=row(175,[['Riferimenti inclusi',n],['Pagine distinte',[...uniche].join(', ')],['Frame disponibili',d.frame]]);
      return g;
    },
    permesso(d,k){
      const limite=(Math.floor(d.primo/d.pagina)+1)*d.pagina,taglio=limite-d.primo;
      let g=head('Lettura a cavallo di una pagina protetta');
      for(let j=0;j<d.lunghezza;j++){
        const x=32+j*72;
        g+=capsule(x,90,68,hex(d.primo+j),k&&j<taglio?'cell active':k>=2?'cell danger':'cell');
      }
      const x=30+taglio*72;
      g+=line(x,66,x,152,'wire live')+tiny(33,66,'pagina leggibile')+tiny(x+8,151,'seconda pagina');
      if(k>=2)g+=tiny(x+10,66,'lettura vietata');
      return g+tiny(30,196,k===3?'Controllo preventivo sull’intervallo completo: richiesta respinta.':k===2?'L’indirizzo al confine deve superare una propria verifica.':k===1?'La prima parte arriva fino all’ultimo byte della pagina 5.':'Gli otto riquadri rappresentano gli otto byte virtuali richiesti.');
    },
    sentinella(d,k){
      let g=head('RAX dopo la scrittura della sentinella')+tiny(230,71,'bit 63…32','middle')+tiny(451,71,'bit 31…0','middle');
      [['MOV EAX, −1','00000000'],['MOV RAX, −1','FFFFFFFF']].forEach(([ins,hi],i)=>{
        const y=88+i*55;
        g+=tiny(24,y+20,ins)+capsule(142,y,173,k>=2?hi:'?',k>=2?'cell hot':'cell')+
          capsule(324,y,173,k>=1?'FFFFFFFF':'?',k===1?'cell active':'cell');
      });
      return g+tiny(25,219,k===3?'Nel ramo valido il PA 0x1A021 torna invece con la metà alta a zero.':
        k===2?'Le metà superiori distinguono le due scritture.':k===1?'Il controllo limitato a EAX vede gli stessi otto simboli F.':'Il test proposto confronta soltanto la metà destra.');
    },
    spazio(d,k){
      let g=head('La chiave della TLB e il cambio di processo')+
        row(49,[['Spazio corrente','B'],['VPN richiesta',d.pagina],['Voce in TLB','A / '+d.pagina]]);
      g+=box(34,147,218,56,'Vecchia traduzione','frame '+d.vecchio,k===1?'cell danger':'cell')+
        box(377,147,218,56,'Tabella di B',k>=2?'frame '+d.nuovo:'?',k>=2?'cell active':'cell');
      if(k===1)g+=flow(327,110,155,142,true);
      if(k>=2)g+=flow(327,110,484,142,true);
      return g+tiny(24,236,k===3?'ASID e VPN devono identificare insieme la traduzione utilizzata.':k===1?'Il falso hit consegna il frame dello spazio A.':'Segui la richiesta di B, che usa la propria tabella.');
    },
    catena(d,k){
      let g=head('Quando una catena FAT torna su un blocco');
      const xs=[29,178,327,476],y=95;
      d.catena.forEach((v,i)=>g+=capsule(xs[i],y,100,v,i===3&&k<3?'cell off':k?'cell active':'cell'));
      if(k)g+=flow(130,110,173,110,true)+flow(279,110,323,110,true);
      if(k===2)g+=path('M375 130v30H228v-29','wire live')+travel('M375 130v30H228v-29')+tiny(286,185,'ciclo','middle');
      if(k===3)g+=flow(428,110,471,110,true);
      return g+tiny(29,222,k===3?'La sola voce modificata è FAT[2] e il blocco 9 chiude la catena.':k===2?'Il quarto passo raggiunge una seconda volta il blocco 10.':'I numeri nei riquadri identificano blocchi fisici.');
    },
    redoInverso(d,k){
      let g=head('Risali dal disco ai commit delle due transazioni');
      for(let i=0;i<2;i++){
        const y=49+i*76,t=['T1 · A','T2 · B'][i],resta=d.iniziali[i]===d.finali[i];
        g+=box(22,y,121,52,t+' prima',d.iniziali[i])+box(165,y,122,52,'Immagine redo',d.immagini[i])+
          box(312,y,121,52,'Dopo',d.finali[i],k===i+1?'cell hot':'cell')+
          box(465,y,138,52,'Commit',k>=i+1?(resta?'assente':'durevole'):'?',k>=i+1?'cell active':'cell');
      }
      return g+tiny(24,224,k===3?'Una nuova assegnazione di B = 21 conserva la coppia osservata.':'Confronta il valore finale con quello previsto da ciascun record.');
    },
    auditConfronto(d,k){
      let g=head('Un’affermazione alla prova delle righe del registro');
      ['Minuto','Account','Operazione','Esito'].forEach((t,i)=>g+=tiny([35,119,242,443][i],64,t));
      d.righe.forEach((r,j)=>{
        const y=80+39*j,focus=k===1&&j===0||k===2&&j>0||k===3&&j===0;
        g+=rect(24,y,585,30,focus?'cell hot':'cell',2);
        r.forEach((t,i)=>g+=tiny([35,119,242,443][i],y+19,t));
      });
      return g+tiny(25,227,k===3?'Per ada al minuto 2 risulta un tentativo respinto.':k===2?'Le altre righe descrivono un’operazione o un account differente.':'Verifica la frase «ada ha modificato tesi al minuto 2».');
    }
  };

  // Un nuovo fotogramma fa emergere il disegno anche quando il cambiamento
  // consiste in una classificazione, senza trasporto fra due componenti.
  Object.entries(scenes).forEach(([id,draw])=>{
    SL.sceneProve[id]=(v,k)=>{
      const d=v.figuraCorrezione;
      const figura=d?figureCorrezione[d.tipo](d,k):draw(v,k);
      return '<g'+(k?' class="reveal"':'')+'>'+figura+'</g>';
    };
  });
})();
