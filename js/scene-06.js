'use strict';
(() => {
  const {text,rect,box,line,path,dot,arrow,travel,values} = SL.pen;
  const small=(x,y,s,anchor='start')=>text(x,y,s,'small',anchor);
  const center=(x,y,s,cls='label')=>text(x,y,s,cls,'middle');
  const head=s=>text(22,27,s,'title');
  const hx=n=>'0x'+n.toString(16).toUpperCase();
  const mark=(show,html)=>show?'<g class="reveal">'+html+'</g>':html;
  function link(x,y,u,v,on){
    return arrow(x,y,u,v,on)+(on?travel('M'+x+' '+y+' L'+u+' '+v):'');
  }
  function track(x,y,w,h,fraction,style='active'){
    const used=Math.max(0,Math.min(1,fraction))*w;
    return rect(x,y,w,h,'cell',2)+(used?rect(x,y,used,h,'cell '+style,2):'');
  }
  function token(x,y,w,h,name,cls='cell'){
    return rect(x,y,w,h,cls,4)+center(x+w/2,y+h/2+5,name,'label');
  }
  function gridRow(x,y,labels,width,selected=-1){
    return labels.map((val,i)=>token(x+i*width,y,width-4,30,val,i===selected?'cell hot':'cell')).join('');
  }
  function memoryRead(p,s,k){
    const v=values(s,k),addr=k===2?p.a:0;
    const fromRam=k>0&&v.Sorgente==='RAM';
    let img=head('Da dove arriva il byte?')+small(24,53,'RAM · blocchi da 64 B')+small(254,53,'CACHE · due linee')+small(499,53,'CPU');
    for(let i=0;i<2;i++){
      const y=66+i*52,resident=k>0&&(i===0||k===2&&addr>=64);
      img+=token(24,y,160,40,i===0?'byte 0…63':'byte 64…127',fromRam&&v.Blocco===i?'cell hot':'cell');
      img+=token(254,y,152,40,resident?'blocco '+i:'vuota',k>0&&v.Blocco===i?'cell active':'cell');
      if(fromRam&&v.Blocco===i)img+=link(185,y+20,252,y+20,true);
    }
    img+=box(505,77,105,65,'R0',k===0?'—':'M['+addr+']',k?'cell active':'cell');
    if(k)img+=link(407,86+52*v.Blocco,503,109,true);
    return img+text(25,211,k?'Indirizzo del byte: '+addr+'    ·    '+v.Sorgente+'    ·    '+v.Costo+'    ·    totale '+v['Tempo cumulato']:'Prima lettura: indirizzo 0    ·    cache inizialmente vuota','label');
  }
  function cacheScans(p,s,k){
    const stride=4*Number(p.stride),n=Math.min(k,8),current=n?(n-1)%4:-1;
    const slots=[null,null];
    for(let j=1;j<=n;j++){const a=values(s,j);slots[a.Indice]=2*a.Tag+a.Indice;}
    let img=head('Due passate sulle medesime quattro posizioni');
    for(let pass=0;pass<2;pass++){
      img+=small(22,69+pass*45,'Passata '+(pass+1));
      for(let c=0;c<4;c++){
        const t=1+pass*4+c,visited=t<=n,v=visited?values(s,t):{};
        img+=token(103+c*125,45+pass*45,119,34,hx(c*stride)+(visited?' · '+v.Esito:''),t===k?'cell hot':visited?'cell active':'cell');
      }
    }
    img+=small(22,164,'Linee dopo l’accesso');
    slots.forEach((v,i)=>{img+=box(183+i*202,148,181,56,'Indice '+i,v===null?'vuota':'blocco '+v,'cell'+(k>0&&k<=8&&i===values(s,k).Indice?' hot':''));});
    if(k>0&&k<=8){const y=k<=4?80:125;img+=link(162+125*current,y,273+202*values(s,k).Indice,146,true);}
    return img+small(23,233,k===9?'Hit nelle due passate: '+values(s,k)['Hit nella prima scansione']+' e '+values(s,k)['Hit nella seconda scansione']+'.':'Il numero di blocco seleziona la linea tramite il resto della divisione per 2.');
  }
  function cacheAverage(p,s,k){
    let img=head('Cento richieste · un costo comune e una penalità')+small(24,54,'10 righe × 10 richieste');
    for(let n=0;n<100;n++){
      const miss=n>=100-p.m;
      img+=mark(miss&&k===1,rect(25+(n%10)*17,65+Math.floor(n/10)*15,13,11,miss&&k>0?'cell hot':miss?'cell':'cell active',2));
    }
    img+=box(244,61,360,46,'Consultazioni','100 × 2 ns','cell active');
    img+=box(244,115,360,46,'Rifornimenti',k>0?p.m+' × '+p.pen+' ns':'?',k>0?'cell hot':'cell');
    if(k===2)img+=mark(true,box(244,169,360,46,'Tempo totale / 100',values(s,2).AMAT,'cell active'));
    return img+small(25,238,k>0?'In ambra: richieste che aggiungono il rifornimento.':'Ogni casella paga la consultazione della cache.');
  }
  function processPages(p,s,k){
    let img=head('Una VPN, due tabelle di processo')+box(21,87,104,64,'Pagina','VPN 3','cell active');
    const offsets=[4,p.frame];
    for(let i=0;i<2;i++){
      const seen=k>i,y=57+83*i,pfn=offsets[i],dest=seen?values(s,i+1)[i?'PA di B':'PA di A']:'?';
      img+=link(126,119,195,y+27,k===i+1);
      img+=box(198,y,156,53,'Tabella '+(i?'B':'A'),seen?'3 → '+pfn:'3 → ?',seen?'cell active':'cell');
      img+=link(356,y+27,408,y+27,k===i+1);
      img+=box(410,y,194,53,'Frame + offset',dest,seen?'cell hot':'cell');
    }
    return img+small(23,234,'Lo scostamento '+p.offset+' identifica lo stesso indice di byte in ogni frame.');
  }
  function pageFault(p,s,k){
    const ram=p.cond==='ram',file=p.cond==='file',valid=ram||file;
    let img=head('Lo stesso accesso può seguire tre percorsi')+token(20,93,106,46,'lettura')+
      link(128,116,165,116,true)+box(166,82,130,68,'Pagina 2',ram?'P = 1':'P = 0','cell hot');
    const route=ram?0:file?1:2;
    const captions=['frame in RAM','I/O dal file','regione assente'];
    captions.forEach((str,i)=>{
      const y=48+49*i;
      img+=link(298,116,349,y+18,k>=1&&route===i);
      img+=token(350,y,138,36,str,k>=1&&route===i?'cell hot':'cell off');
    });
    img+=box(516,84,111,64,'Esito',k===2?(valid?values(s,k)['PA del dato']:'violazione'):'?',k===2?(valid?'cell active':'cell danger'):'cell');
    if(k===2)img+=link(489,66+49*route,514,116,true);
    return img+small(22,218,k===2&&file?'Il frame 7 è stato riempito: il kernel riavvia l’istruzione.':'Il kernel esamina la regione virtuale se la traduzione richiede il suo intervento.');
  }
  function workingSet(p,s,k){
    const refs=['A','B','A','C','D','A','C'],v=values(s,k),first=Math.max(0,k-p.w+1);
    let img=head('Finestra dei riferimenti e pagine residenti')+gridRow(28,52,refs,69,k);
    img+=path('M'+(29+first*69)+' 88 v8 H'+(92+k*69)+' v-8','wire live');
    img+=small(30,118,'Finestra di '+Math.min(k+1,p.w)+' riferimenti · pagine distinte: '+v['Insieme']);
    const order=v['Residenti, dalla meno recente'].split(' ');
    img+=small(30,146,'Residenti, in ordine dal meno al più recente');
    for(let i=0;i<p.f;i++)img+=token(30+i*85,155,74,40,order[i]||'—',i===order.length-1?'cell hot':'cell');
    img+=link(60+k*69,84,67+85*(order.length-1),152,true);
    img+=box(435,151,166,54,'Fault cumulati',v['Fault cumulati'],'cell active');
    return img+small(30,233,'Pagine distinte '+v['Pagine distinte']+'   /   capacità '+p.f+' frame');
  }
  function faultAverage(p,s,k){
    const cost=100+p.fault*p.ms,supp=p.fault*p.ms,scale=440/cost;
    let img=head('Ripartire i fault su un milione di accessi')+small(28,63,'Un milione di richieste ordinarie')+
      track(28,75,439,22,1)+text(480,94,'100 ns / accesso','small');
    img+=small(28,132,k>=1?p.fault+' fault × '+p.ms+' ms = '+(p.fault*p.ms*1000000).toLocaleString('it-IT')+' ns supplementari':'Quanti nanosecondi aggiungono i fault?');
    if(k===2){
      img+=rect(28,157,100*scale,28,'cell active',1);
      if(supp)img+=mark(true,rect(28+100*scale,157,supp*scale,28,'cell hot',1));
      img+=mark(true,text(478,177,values(s,k)['Tempo medio'],'value'));
      img+=small(28,211,'Media: base 100 ns (verde) + supplemento '+supp+' ns (ambra).');
    }else if(k===1)img+=mark(true,box(28,151,440,54,'Conversione per evento',p.ms+' ms = '+(p.ms*1000000).toLocaleString('it-IT')+' ns','cell hot'));
    return img;
  }
  function tlbLookup(p,s,k){
    const before=k?values(s,k-1)['Chiavi residenti LRU → MRU'].split(', '):[];
    const v=values(s,k),after=v['Chiavi residenti LRU → MRU'].split(', '),who=p.seq[k];
    let img=head('TLB con ASID · confronto della coppia completa')+small(23,58,'Richiesta '+(k+1))+token(22,70,133,43,who+' / VPN 3','cell hot')+
      small(211,58,'Prima della ricerca · LRU → MRU')+small(211,145,'Dopo la ricerca · LRU → MRU');
    for(let i=0;i<p.cap;i++){
      img+=token(212+i*125,67,116,38,before[i]||'libera',before[i]===who+' / 3'?'cell hot':'cell');
      img+=token(212+i*125,155,116,38,after[i]||'libera',after[i]===who+' / 3'?'cell active':'cell');
    }
    img+=link(155,91,208,86,true)+box(486,97,130,57,'Indirizzo fisico',v.PA,'cell active');
    return img+small(23,233,'Esito: '+v.Esito+'   ·   consultazioni delle tabelle: '+v['Consultazioni delle tabelle']);
  }
  function tableFootprint(p,s,k){
    const vpn=values(s,0),off=Number(p.off),rootBits=Math.ceil((p.bits-off)/2);
    let img=head('Tabella lineare e sottotabelle allocate');
    img+=box(24,47,278,53,'VPN',vpn['Bit VPN']+' bit','cell active')+box(313,47,138,53,'Offset',off+' bit','cell')+small(466,78,p.bits+' bit di VA');
    img+=small(26,125,k>=1?'Lineare · '+vpn['Pagine indirizzabili'].toLocaleString('it-IT')+' voci × 8 B':'Il campo VPN conta tutte le pagine virtuali.');
    if(k>=1)img+=mark(k===1,track(26,136,420,16,1)+small(459,150,values(s,1).Byte.toLocaleString('it-IT')+' B'));
    if(k===2){const v=values(s,k);
      img+=token(26,179,102,36,'radice','cell active');
      img+=path('M130 197 H152 V172 H'+(188+(p.used-1)*49),'wire live');
      for(let i=0;i<p.used;i++)img+=path('M'+(186+i*49)+' 173 V180','wire live')+mark(true,token(165+i*49,180,43,33,'F'+i,'cell hot'));
      img+=small(26,239,'Radice: 2^'+rootBits+' voci · '+p.used+' figlie da '+v['Voci per figlia']+' voci · totale '+v['Byte complessivi'].toLocaleString('it-IT')+' B');
    }return img;
  }
  function pageWalk(p,s,k){
    const a=values(s,0),b=k>=1?values(s,1):{},c=k>=2?values(s,2):{},d=k>=3?values(s,3):{};
    let img=head('Cammino a due livelli · 10 + 10 + 12 bit')+
      box(22,44,175,59,'10 bit · indice L1',a['Indice L1'],'cell active')+
      box(230,44,175,59,'10 bit · indice L2',a['Indice L2'],'cell active')+
      box(438,44,175,59,'12 bit · scostamento',a.Offset,'cell active');
    img+=box(22,152,175,58,'Radice → figlia',k>=1?b['Base L2 letta']:'?',k===1?'cell hot':'cell')+
      box(230,152,175,58,'Voce della foglia',k>=2?c['PTE letta']:'?',k===2?'cell hot':'cell')+
      box(438,152,175,58,'Esito',k>=3?(d.PA==='—'?'fault':d.PA):'?',k===3?(d.PA==='—'?'cell danger':'cell hot'):'cell');
    if(k>=1)img+=link(109,104,109,149,k===1);
    if(k>=2)img+=link(198,182,227,182,k===2)+link(317,104,317,149,k===2);
    if(k>=3)img+=link(406,182,435,182,true)+(d.PA!=='—'?link(525,104,525,149,true):'');
    if(k===1)img+=small(22,235,'Accesso alla voce L1 a '+b['Indirizzo voce L1']);
    if(k===2)img+=small(22,235,'Accesso alla voce L2 a '+c['Indirizzo voce L2']+' · present = '+c.Present);
    if(k===3)img+=small(22,235,d.PA==='—'?'Foglia assente: il cammino si arresta.':'Frame '+d.PFN+' × 4096 + '+a.Offset+' = '+d.PA);
    return img;
  }
  function translateCost(p,s,k){
    let img=head('Accessi in serie · una casella RAM vale 50 ns');
    for(let r=0;r<2;r++){const y=55+r*67,enabled=r<=k;
      img+=small(25,y+23,r?'Miss TLB':'Hit TLB')+token(107,y,61,39,'TLB',enabled?'cell active':'cell off');
      if(enabled){
        const levels=r?p.levels:0;
        for(let j=0;j<levels;j++)img+=token(176+j*79,y,71,39,'L'+(j+1),'cell hot');
        img+=token(176+levels*79,y,71,39,'dato','cell active')+small(622,y+23,values(s,r).Costo,'end');
        if(r===k)img+=path('M137 '+(y+47)+' H'+(211+levels*79),'wire live')+travel('M137 '+(y+47)+' H'+(211+levels*79));
      }
    }
    return img+(k===2?mark(true,small(26,207,p.hits+' hit + '+(100-p.hits)+' miss su 100 richieste · media '+values(s,k)['Tempo medio'])):small(26,209,'La TLB richiede 1 ns. Il dato occupa una lettura RAM anche sul cammino di hit.'));
  }
  function hardLinks(p,s,k){
    const v=values(s,k),which=p.name==='appunti'?0:1;
    const rows=['appunti','copia'];
    let img=head('Due nomi, un solo inode')+small(22,57,'Voci della directory');
    for(let i=0;i<2;i++){
      const present=k<2||i!==which,y=70+63*i;
      img+=token(22,y,138,38,rows[i],present?'cell active':'cell off');
      if(present)img+=link(160,y+18,247,122,k===1?which===i:k===2);
      else img+=line(30,y+20,152,y+20,'wire live');
    }
    img+=box(250,92,133,64,'Inode',42,'cell active')+link(385,124,453,124,k>0)+
      box(456,91,159,65,'Primo byte',k===1?v['Letto da copia']:v['Primo byte'],k===1?'cell hot':'cell active');
    return img+small(23,224,'Numero di link: '+(k<2?2:v.Link)+(k===2?'  ·  Nome residuo: '+v['Nome residuo']:''));
  }
  function directoryTree(p,s,k){
    const points={2:[317,61],7:[183,120],11:[460,120],31:[70,184],42:[259,184],55:[464,184]};
    const names={2:'/',7:'corso',11:'casa',31:'testo',42:'dati',55:'testo'};
    const v=values(s,k);const at=v['Inode raggiunto']??v['Inode corrente']??v['Inode finale'];
    let img=head('Percorso '+p.path);
    for(const [a,b] of [[2,7],[2,11],[7,31],[7,42],[11,55]]){
      const [x,y]=points[a],[u,z]=points[b];
      img+=path('M'+x+' '+(y+12)+' L'+u+' '+(z-19),'wire');
    }
    if(v['Inode di partenza']&&typeof at==='number'&&v['Inode di partenza']!==at){
      const [x,y]=points[v['Inode di partenza']],[u,z]=points[at];
      img+=link(x,y,u,z,true);
    }
    Object.entries(points).forEach(([id,[x,y]])=>{img+=token(x-58,y-17,116,34,names[id]+' · '+id,Number(id)===at?'cell hot':'cell');});
    return img+small(22,237,at==='—'?'Ricerca interrotta: il nome richiesto manca nella directory.':'Cursore su inode '+at+' · '+s[k].titolo);
  }
  function fileAllocation(p,s,k){
    const count=values(s,0)['Blocchi dati'],idx=count-1,tail=(p.size-1)%4096+1;
    let img=head('Ultimo byte del file · blocchi da 4096 B');
    for(let i=0;i<count;i++){
      const x=24+i*200,final=i===idx;
      img+=small(x,62,'Blocco logico '+i)+track(x,72,181,30,final?tail/4096:1,final&&k>=1?'hot':'active');
      if(final&&k>=1){const xx=x+Math.min(180,181*(tail-1)/4096);img+=mark(k===1,line(xx,68,xx,107,'wire live')+small(x,127,'offset '+(tail-1)));}
    }
    if(k===0)return img+small(23,213,'File: '+p.size+' B  ·  capienza allocata: '+values(s,k).Capienza);
    if(k===1)return img+small(23,213,'Ultimo indice di byte = '+p.size+' − 1 = '+(p.size-1));
    const ids=p.mode==='cont'?[7,8,9]:[7,14,5];
    img+=small(25,153,p.mode==='chain'?'Catena FAT':p.mode==='cont'?'Disposizione contigua':'Tabella dei blocchi');
    for(let j=0;j<count;j++){
      const x=24+j*156;
      if(j&&p.mode==='chain')img+=link(x-44,181,x-2,181,true);
      img+=mark(j===idx,token(x,162,110,38,'fisico '+ids[j],j===idx?'cell hot':'cell active'));
    }
    return img+small(24,233,'Nel blocco '+values(s,k)['Blocco fisico']+' restano '+values(s,k)['Byte inutilizzati']+' byte inutilizzati.');
  }
  function fatChain(p,s,k){
    const ids=p.file==='a'?[3,9,5,11]:[8,4,12,6];
    const v=values(s,k),visited=k===0?0:k===s.length-1?Math.floor(p.pos/1024):Math.max(0,k-1);
    let img=head('FAT · il numero del blocco indicizza la tabella')+small(23,60,'Catena memorizzata per il file '+p.file.toUpperCase());
    for(let i=0;i<4;i++){
      const x=23+i*150;
      img+=box(x,86,110,55,'FAT['+ids[i]+']',i===3?'fine':ids[i+1],i===visited?'cell hot':i<visited?'cell active':'cell');
      if(i<3)img+=link(x+111,114,x+148,114,k>1&&i===visited-1&&k<s.length-1);
    }
    if(k===0){
      const bits=v['Bitmap (blocchi 2–17)'];
      img+=small(24,159,'Blocchi dati 2–17 · 1 assegnato / 0 libero');
      for(let i=0;i<bits.length;i++){
        const x=24+i*36;
        img+=token(x,167,31,24,bits[i],bits[i]==='1'?'cell active':'cell');
        img+=small(x+15,206,String(i+2),'middle');
      }
      return img+small(24,236,'Blocchi liberi: '+v['Blocchi liberi']+' su 16 · Primo blocco del file '+p.file.toUpperCase()+': '+ids[0]+'.');
    }
    img+=small(24,181,'Byte '+p.pos+' · indice logico '+Math.floor(p.pos/1024)+' · scostamento '+(p.pos%1024));
    if(k===s.length-1)img+=text(24,225,'Lettura del blocco '+v['Blocco dati']+' all’offset '+v.Offset,'label');
    return img;
  }
  function persistentPrefix(p,s,k){
    const done=k===0?'':p.order.slice(0,p.cut);
    const cells=[['i','Inode',done.includes('i')?'→ 9':'—'],['b','Bitmap[9]',done.includes('b')?1:0],['d','Blocco 9',done.includes('d')?'nuovi byte':'vecchi byte']];
    let img=head('Prefisso durevole al momento dell’arresto');
    const op={i:'inode',b:'bitmap',d:'dati'};
    for(let i=0;i<3;i++){
      const c=p.order[i],x=22+i*150;
      img+=token(x,56,130,38,op[c],done.includes(c)?'cell active':'cell off');
    }
    if(k>0){const x=13+p.cut*150;img+=line(x,48,x,103,'wire live')+small(476,81,'arresto: '+p.cut+' scritture');}
    cells.forEach((cell,i)=>{img+=mark(k===1&&done.includes(cell[0]),box(23+i*199,133,179,58,cell[1],cell[2],done.includes(cell[0])?'cell active':'cell'));});
    return img+mark(k===2,small(24,228,k===2?'Byte visibili attraverso il file: '+values(s,k)['Contenuto visibile dal file']+'.':'Le tre colonne distinguono raggiungibilità, allocazione e contenuto.'));
  }
  function bitmapRepair(p,s,k){
    const owner=Number(p.owner),observed=Number(p.bit),bit=k===2?owner:observed;
    let img=head('Ricostruzione della bitmap · blocco 12')+
      box(24,61,149,61,'Scansione inode',owner?'1 riferimento':'0 riferimenti','cell active');
    img+=link(174,91,273,91,Boolean(owner))+token(274,71,143,40,'blocco 12',owner?'cell hot':'cell');
    img+=small(25,154,'Estratto della bitmap · gli altri bit sono omessi');
    ['…','10','11','12','13','14','…'].forEach((n,i)=>{
      const x=27+i*81;img+=token(x,165,74,35,i===3?(k?bit:'?'):'·',i===3?(k===1&&owner!==observed?'cell danger':'cell hot'):'cell off')+small(x+36,219,n,'middle');
    });
    if(k===2&&owner!==observed)img+=link(342,112,306,163,true);
    return img;
  }
  function redo(p,s,k){
    const v=values(s,k),stepSize=136,commit=k>0&&p.stage>=2;
    let img=head('Journal redo · crash e ripresa');
    const titles=['Record A e B','Commit','Copia A','Copia B'];
    titles.forEach((title,i)=>{const x=24+i*stepSize;img+=token(x,53,130,35,title,k>0&&p.stage>=i+1?'cell active':'cell');});
    if(k>0){const x=17+p.stage*stepSize;img+=line(x,45,x,96,'wire live')+small(25,113,'Arresto dopo '+p.stage+' passi durevoli');}
    const a=k===0?2:k===1?v['A su disco']:v['A finale'],b=k===0?4:k===1?v['B su disco']:v['B finale'];
    img+=box(26,143,155,59,'Journal',k===0?'in attesa':commit?'commit':'senza commit',commit?'cell active':'cell')+
      box(250,143,120,59,'Disco · A',a,k===2?'cell hot':'cell')+box(439,143,120,59,'Disco · B',b,k===2?'cell hot':'cell');
    if(k===2&&commit)img+=link(181,172,249,172,true)+path('M181 162 Q317 85 438 162','wire live')+travel('M181 162 Q317 85 438 162');
    return img+small(26,235,k===2?'Immagini che richiedevano un aggiornamento: '+v['Immagini che richiedevano aggiornamento']+'.':'Immagini obiettivo della transazione: A = 7, B = 9.');
  }
  function journalTransfers(p,s,k){
    const full=p.mode==='full',pre=p.data+p.meta,post=full?pre:p.meta;
    const unit=16;
    let img=head('Scritture di blocchi · il commit divide le due fasi');
    const segments=[['Prima del commit',p.data,p.meta],['Checkpoint',full?p.data:0,p.meta]];
    segments.forEach(([name,d,m],row)=>{
      const y=55+row*74,show=row===0||k>=1;
      img+=small(25,y,name)+small(254,y,show?(row===0?(full?'destinazione: journal':'dati: disco · metadati: journal'):'destinazione: posizioni definitive'):'da determinare');
      if(show){for(let j=0;j<d+m;j++){img+=mark(k===row,rect(25+j*unit,y+9,unit-2,23,j<d?'cell active':'cell hot',1));}
        img+=small(305,y+27,d+' dati + '+m+' metadati');}
    });
    return img+mark(k===2,small(25,225,k===2?'Totale = '+pre+' + '+post+' = '+values(s,k)['Scritture totali']+' scritture.':'Verde: dati   ·   ambra: metadati   ·   ogni cella rappresenta una scrittura.'));
  }
  function authorize(p,s,k){
    const known=p.role!=='anonimo',allow=known&&(p.role==='docente'||p.op==='lettura');
    let img=head('Autorizzazione sul fascicolo')+box(23,71,142,64,'Sessione',p.role,'cell active')+
      link(166,103,228,103,known&&k>=1)+box(230,71,170,64,'Politica del ruolo',k<1?'?':known?p.role==='docente'?'L + M':'L':'saltata',k>=1&&known?'cell hot':'cell');
    if(k===2){img+=link(401,103,467,103,allow)+box(469,71,145,64,'Fascicolo',values(s,k).Accesso,allow?'cell active':'cell danger');}
    return img+small(24,183,'Richiesta: '+p.op+'   ·   L = lettura, M = modifica')+
      (k===2?small(24,218,'Modifiche applicate: '+values(s,k)['Modifiche applicate']):small(24,218,'Prima si identifica la sessione, poi si applica la regola del ruolo.'));
  }
  function traverse(p,s,k){
    const ok=p.dir.includes('x'),read=p.file==='1';
    let img=head('Apertura in lettura di /corso/esiti');
    img+=box(22,74,128,65,'Radice /','x','cell active')+link(151,107,210,107,true)+
      box(212,74,168,65,'Directory corso',k>=1?p.dir:'?',k>=1?(ok?'cell active':'cell danger'):'cell')+
      link(381,107,442,107,k>=1&&ok)+box(444,74,166,65,'File esiti',k>=2?(ok?(read?'r':'senza r'):'saltato'):'?',k===2&&ok?(read?'cell active':'cell danger'):'cell');
    return img+small(23,190,'x autorizza l’attraversamento della directory; r autorizza la lettura del file.')+
      (k===2?text(23,227,'Apertura: '+values(s,k).Esito,'label'):'');
  }
  function encryption(p,s,k){
    const raw=p.where==='disk',allow=p.where==='allow';
    let img=head('Cifratura a riposo · punto di osservazione')+small(24,57,'Dispositivo');
    for(let r=0;r<3;r++)img+=rect(24,69+r*17,137,14,'cell active',4);
    img+=small(92,146,'blocchi cifrati','middle');
    img+=link(161,91,224,91,k>=1&&!raw)+box(226,62,150,58,'Volume',raw?'chiuso':'sbloccato',!raw&&k>=1?'cell hot':'cell')+
      link(377,91,429,91,k>=1&&!raw)+box(431,62,174,58,'Interfaccia file',k<1?'?':raw?'fuori percorso':allow?'lettura':'rifiuto',k>=1&&!raw?(allow?'cell active':'cell danger'):'cell');
    const observer=raw?91:518;
    img+=dot(observer,173,5,'pin')+center(observer,198,'osservatore','small')+link(observer,166,observer,151,false);
    return img+(k===2?text(22,231,'Esito osservato: '+values(s,k).Risultato,'label'):'');
  }
  function audit(p,s,k){
    const raw=values(s,0)['Registro · minuto / account / oggetto / operazione / esito'];
    const records=raw.split('\n').map(row=>row.split(' / '));
    const cols=[41,120,233,350,484];
    let img=head('Registro · eventi fino al minuto '+p.time);
    ['Minuto','Account','Oggetto','Operazione','Esito'].forEach((name,i)=>{img+=small(cols[i],55,name);});
    records.forEach(([t,name,obj,op,out],i)=>{
      const x=24,y=64+29*i,within=Number(t)<=p.time,match=within&&name===p.user&&obj===p.obj;
      img+=mark(k===1&&match,rect(x,y,585,25,k===0?(within?'cell active':'cell off'):(match?'cell hot':'cell off'),2));
      [t,name,obj,op,out].forEach((word,col)=>{img+=small(cols[col],y+17,word);});
    });
    return img+mark(k===2,small(23,236,k===0?'Intervallo incluso: da 0 a '+p.time+' minuti.':k===1?'Filtro: '+p.user+' / '+p.obj+' · righe selezionate: '+values(s,k)['Righe selezionate']:'Concesse '+values(s,k)['Richieste concesse']+' · negate '+values(s,k)['Richieste negate']+' · evidenza relativa all’account.'));
  }

  Object.assign(SL.sceneLab,{
    '6.1.1':memoryRead,'6.1.2':cacheScans,'6.1.3':cacheAverage,
    '6.2.1':processPages,'6.2.2':pageFault,'6.2.3':workingSet,'6.2.4':faultAverage,
    '6.4.1':tlbLookup,'6.4.2':tableFootprint,'6.4.3':pageWalk,'6.4.4':translateCost,
    '6.5.1':hardLinks,'6.5.2':directoryTree,'6.5.3':fileAllocation,'6.5.4':fatChain,
    '6.6.1':persistentPrefix,'6.6.2':bitmapRepair,'6.6.3':redo,'6.6.4':journalTransfers,
    '6.7.1':authorize,'6.7.2':traverse,'6.7.3':encryption,'6.7.4':audit
  });

  // Ogni passo conserva lo stato visibile dopo l'evento; il lettore SVG non
  // legge un esito successivo per illustrare una decisione ancora da prendere.
  function accessStages(p){
    const present=p.mapping==='rw'||p.mapping==='ro', region=p.mapping!=='outside';
    const requested=p.op==='r'?'lettura':'scrittura',permitted=p.op==='r'||p.mapping==='rw';
    const pfn=10,va=3*4096+p.offset,pa=pfn*4096+p.offset;
    const key='A / 3',other=p.tlb==='other',hit=p.tlb==='same'&&present;
    const state={tlb:hit?key:other?'B / 3':'vuota',pte:'?',frame:'?',rights:'?',pa:'?',outcome:'in attesa',walks:0,io:0};
    const stages=[];
    function add(titolo,testo,focus,fields){
      stages.push({titolo,testo,valori:fields,scena:{...state,focus}});
    }
    add('Richiesta del processo A','La CPU richiede una '+requested+' alla pagina virtuale 3. La pagina contiene 4096 byte e la richiesta riguarda l’offset '+p.offset+'.','request',[['VA',hx(va)],['VPN',3],['Offset',p.offset],['Operazione',requested]]);
    add('Confronto nella TLB',hit?'La coppia (A, 3) coincide: la MMU trova traduzione e permessi nella TLB.':other?'La voce ha la stessa VPN e ASID B. La traduzione di A richiede il cammino in tabella.':'La TLB è vuota per questa pagina. Una traduzione valida può esservi precaricata soltanto per una pagina residente.','tlb',[['Chiave richiesta',key],['Voce iniziale',state.tlb],['Esito TLB',hit?'hit':'miss']]);
    if(!hit){
      state.walks++;state.pte=present?'P = 1':'P = 0';
      add('Cammino nelle tabelle','La MMU legge la radice e poi la foglia. Il modello conta due letture per questo cammino.','walk',[['Letture PTE',2],['Present',Number(present)]]);
      if(!present){
        state.rights=region?'lettura':'nessuna regione';
        add('Esame del fault','Il kernel cerca la regione virtuale e verifica se ammette la '+requested+'.','handler',[['Regione',region?'mappatura di file':'assente'],['Diritti della regione',state.rights],['I/O effettuati',0]]);
        if(!region||!permitted){
          state.outcome='accesso negato';
          add('Accesso respinto',region?'La regione di file ammette soltanto letture. Il kernel segnala la violazione prima di avviare I/O.':'Nessuna regione copre la VPN. Il kernel segnala la violazione.','denied',[['Esito',state.outcome],['Letture di file',0],['Byte acceduti',0]]);
          return stages;
        }
        state.io++;state.frame=pfn;state.pte='P = 1';
        add('Riempimento del frame','Il file viene letto nel frame 10. Al completamento il kernel installa la voce presente con permesso di lettura.','fill',[['Letture di file',state.io],['Frame installato',pfn],['Present',1]]);
        state.walks++;
        add('Nuovo tentativo','La CPU ripete l’istruzione. La TLB del modello riceve la traduzione soltanto dopo il cammino riuscito.','retry',[['VPN ripetuta',3],['Letture PTE cumulate',2*state.walks],['Istruzioni ritentate',1]]);
      }
    }
    state.frame=pfn;state.rights=p.mapping==='rw'?'R/W':'R';state.tlb=key;
    add('Controllo dei diritti','Il permesso '+state.rights+' proviene '+(hit?'dalla voce TLB':'dalla foglia valida')+'. La MMU lo confronta con la '+requested+' richiesta.','rights',[['Permesso',state.rights],['Operazione',requested],['Consentita',permitted?'sì':'no']]);
    if(!permitted){
      state.outcome='accesso negato';
      add('Violazione di protezione','La scrittura su una pagina di sola lettura genera l’eccezione di protezione. Il contenuto della memoria conserva il vecchio valore.','denied',[['Esito',state.outcome],['Letture di file',state.io],['Byte acceduti',0]]);
    }else{
      state.pa=hx(pa);state.outcome=state.pa;
      add('Accesso al byte','La base del frame vale 10 × 4096. Aggiungendo '+p.offset+' si ottiene '+state.pa+', indirizzo del byte interessato dalla '+requested+'.','memory',[['Esito',state.pa],['Letture PTE cumulate',2*state.walks],['Letture di file',state.io],['Byte acceduti',1]]);
    }
    return stages;
  }
  function accessScene(p,s,k){
    const a=s[k].scena,f=a.focus;
    const addresses=['request','tlb','walk','rights'];
    const top=[['VA',hx(3*4096+p.offset)],['TLB · ASID / VPN',a.tlb],['Foglia',a.pte],['Permessi',a.rights]];
    let img=head('Un accesso del processo A · traduzione e permessi');
    top.forEach(([name,value],i)=>{
      const x=20+i*155;
      img+=box(x,51,133,58,name,value,addresses[i]===f?'cell hot':'cell');
    });
    const points={request:[86,110],tlb:[241,110],walk:[396,111],handler:[93,160],fill:[292,160],rights:[551,110],memory:[507,160],denied:[507,160]};
    const active=f==='retry'?'walk':f,previous=k?s[k-1].scena.focus:'';
    const start=points[previous==='retry'?'walk':previous],end=points[active];
    if(start&&end){
      const d='M'+start.join(' ')+' Q'+Math.round((start[0]+end[0])/2)+' 142 '+end.join(' ');
      img+=path(d,'wire live')+travel(d);
    }
    img+=box(20,161,146,54,'Kernel · regioni',f==='handler'?a.rights:a.io?'ammessa':'—',f==='handler'?'cell hot':'cell')+
      box(200,161,179,54,'I/O e frame',a.io?'file → PFN '+a.frame:a.frame==='?'?'—':'PFN '+a.frame,f==='fill'?'cell hot':'cell')+
      box(410,161,200,54,'Esito sul byte',a.outcome,f==='denied'?'cell danger':f==='memory'?'cell active':'cell');
    return img+small(23,237,'Offset: '+p.offset+'   ·   letture di voci: '+(a.walks*2)+'   ·   letture da file: '+a.io);
  }
  const choice=(id,label,opzioni,iniziale)=>({id,label,opzioni,iniziale});
  SL.moduliAnimati[6]={
    titolo:'Dal byte virtuale all’accesso autorizzato',
    teoria:SL.lezioni['modulo-6'].join(' '),
    istruzione:'Scegli la pagina di file assente e l’operazione di lettura. Segui il caricamento e il nuovo tentativo. Ripeti con una pagina residente di sola lettura, la sua voce precaricata in TLB e una scrittura.',
    osservazione:'Il miss richiede due letture di voci. Un hit permette di saltare quelle letture. I permessi memorizzati nella voce possono comunque far respingere la scrittura.',
    domanda:'Quale indirizzo fisico raggiunge la richiesta autorizzata e quale esito dà la richiesta che viola i permessi?',
    previsione:{label:'Indirizzo fisico (0x…) oppure «accesso negato»',valore:(p,s)=>values(s,s.length-1).Esito},
    controlli:[
      choice('mapping','Mappatura della pagina',[['rw','Residente, lettura e scrittura'],['ro','Residente, sola lettura'],['file','Pagina di file assente, sola lettura'],['outside','Indirizzo fuori dalle regioni']],'rw'),
      choice('tlb','Preparazione della TLB',[['empty','Vuota'],['same','Precarica la pagina di A se residente'],['other','Voce dello spazio B, stessa VPN']],'empty'),
      choice('op','Operazione',[['r','Lettura'],['w','Scrittura']],'r'),
      {id:'offset',label:'Offset nella pagina (byte)',min:0,max:4095,step:1,iniziale:77}
    ],
    calcola:accessStages,disegna:accessScene
  };
})();
