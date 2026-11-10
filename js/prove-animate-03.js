'use strict';
(() => {
  const {text,rect,box,path,travel}=SL.pen;
  const blank='·';
  const bits=(v,w)=>Number(v).toString(2).padStart(w,'0');
  const hex=(v,w=2)=>'0x'+v.toString(16).toUpperCase().padStart(w,'0');
  const title=s=>text(22,26,s,'label accent');
  const caption=s=>text(22,232,s,'small');
  function cell(x,y,w,h,value,state=''){
    return rect(x,y,w,h,'cell '+state,3)+text(x+w/2,y+h/2+5,value,'label','middle');
  }
  function node(x,y,w,label,value,state=''){
    return box(x,y,w,55,label,value,'cell '+state);
  }
  function wire(d,live=false){
    return path(d,live?'wire live':'wire dim')+(live?travel(d):'');
  }
  function tape(x,y,cells,w,h=30){
    return cells.map(([v,mode],i)=>cell(x+i*w,y,w-2,h,v,mode)).join('');
  }
  function wordRow(y,name,value,w=8,marked=-1){
    const arr=typeof value==='string'?value:bits(value,w);
    return text(22,y+20,name,'small')+tape(140,y,[...arr].map((v,i)=>[v,v===blank?'':i===marked?'hot':'active']),Math.min(48,Math.floor(440/w)));
  }
  function waves(rows,marks=['prima','primo','secondo']){
    let g='';const x=142,dx=426/marks.length;
    rows.forEach(([name,levels],j)=>{
      const center=rows.length>3?61+j*34:71+j*42;g+=text(26,center+4,name,'label')+path('M'+x+' '+(center+10)+'h426','wire dim');
      let d='';
      for(let i=0;i<levels.length;i++){
        if(levels[i]===null)continue;
        const y=center+(levels[i]?-11:10);
        d+=(i&&levels[i-1]!==null?' V':' M'+(x+i*dx)+' ')+y+' H'+(x+(i+1)*dx);
        g+=text(x+dx*(i+.5),center+(levels[i]?-15:5),levels[i],'small','middle');
      }
      if(d)g+=path(d,'wire live');
    });
    marks.forEach((m,i)=>{g+=text(x+dx*(i+.5),199,m,'small','middle');});return g;
  }
  function pipeGrid(rows,cycles){
    const labels=Math.max(...rows.map(([label])=>label.length));
    const x=Math.max(98,Math.min(166,31+8*labels));
    const w=Math.min(70,Math.floor((612-x)/cycles));
    let g='';Array.from({length:cycles},(_,i)=>{g+=text(x+(i+.5)*w,55,i+1,'small','middle');});
    rows.forEach(([name,data],j)=>{const y=65+j*39;g+=text(24,y+21,name,'label')+tape(x,y,
      Array.from({length:cycles},(_,i)=>{const v=data[i];return [v??blank,v==='D*'||v==='W'?'hot':v?'active':''];}),w);});
    return g;
  }
  const pipeline=['F','D','E','M','W'];

  function majority([a,b,c],k){
    const products=[a&b,a&c,b&c],names=['AB','AC','BC'],regs=['EAX','ECX','ESI'];
    let g=title('MAGGIORANZA · A='+a+'   B='+b+'   C='+c);
    products.forEach((v,i)=>{const y=49+i*49;
      g+=cell(25,y,92,34,names[i]+' · AND')+wire('M117 '+(y+17)+'H161',k===1)+
        cell(161,y,84,34,k>=1?v:blank,k===1?'hot':'')+wire('M245 '+(y+17)+'H282',k===2)+
        cell(282,y,96,34,k>=2?regs[i]:blank,k===2?'hot':'')+wire('M378 '+(y+17)+'H'+(389+i*14)+'L469 116',k===3&&!!v);
    });
    return g+node(469,91,124,'OR · EAX',k===3?Number(products.some(Boolean)):blank,k===3?'hot':'')+
      caption(k===3?'Coppie attive = '+products.reduce((x,y)=>x+y,0)+'.':'Ogni ramo corrisponde a una coppia dei tre segnali.');
  }
  function nibbles([v,s],k){
    const arr=[3,2,1,0];let g=title('QUATTRO INGRESSI IN EDI · '+hex(v,4)+'  /  ESI = '+s);
    arr.forEach((b,j)=>{const x=24+j*148;g+=node(x,59,125,'I'+b,bits((v>>(4*b))&15,4),k>=1&&b===s?'hot':'');});
    g+=node(32,148,175,'Conteggio in CL',k>=2?s*4:blank,k===2?'hot':'')+
      wire('M208 176H339',k===3)+node(339,148,225,'EAX dopo AND 0x0F',k===3?hex((v>>(4*s))&15):blank,k===3?'hot':'');
    return g+caption('I0 occupa i quattro bit meno significativi, a destra.');
  }
  function carryBorrow([a,b,add],k){
    const z=add?a+b:a-b,r=z&255,cf=add?Number(z>255):Number(z<0);
    return title((add?'ADD':'SUB')+' AL, CL · AL = '+a+'   CL = '+b)+
      wordRow(48,'AL iniziale',a)+wordRow(85,'CL',b)+wordRow(132,'AL finale',k>=2?r:blank.repeat(8))+
      text(25,202,'Intero: '+(k>=1?z:blank)+'     CF = '+(k>=3?cf:blank),'label')+
      caption(add?'La colonna di peso 256 permette di leggere il riporto.':'Una sottrazione senza segno richiede prestito quando AL iniziale è minore di CL.');
  }
  function flags([a,b],k){
    const sum=(a+b)&255,sg=x=>x<128?x:x-256,o=Number(sg(a)+sg(b)>127||sg(a)+sg(b)<-128);
    let g=title('ADD SU OTTO BIT · '+hex(a)+' + '+hex(b))+wordRow(62,'parola risultante',k>=1?sum:blank.repeat(8),8,k>=2?0:-1);
    const signals=[['ZF · zero',+!sum],['SF · bit 7',sum>>7],['OF · con segno',o]];
    signals.forEach(([label,v],i)=>{const phase=i===2?3:2;g+=node(24+i*199,134,169,label,k>=phase?v:blank,k===phase?'hot':'');});
    return g+caption(k===3?'Somma matematica con segno: '+(sg(a)+sg(b))+'; intervallo rappresentabile: [−128, 127].':'ZF, SF e OF descrivono zero, segno e overflow.');
  }
  function srSequence([q,s,r,u,v],k){
    const first=s?1:r?0:q,final=u?1:v?0:first;
    return title('LATCH SR · DUE COMANDI SEPARATI DALL’ASSESTAMENTO')+
      waves([['S',[null,s,u]],['R',[null,r,v]],['Q',[q,k>=1?first:null,k>=3?final:null]]])+
      caption(k>=2?'Il valore di Q al termine del primo intervallo è lo stato iniziale del secondo.':'Le porte NOR ricevono il primo comando a partire dal Q indicato.');
  }
  function srCharacteristic([q,s,r],k){
    const a=q|s,b=1-r,y=a&b;
    return title('RETE CARATTERISTICA DEL LATCH SR')+
      node(25,48,147,'Q OR S',q+' OR '+s)+node(25,130,147,'1 XOR R','1 XOR '+r)+
      wire('M172 75 H218',k===1)+wire('M172 159 H218',k===1)+
      cell(218,61,60,30,k>=1?a:blank)+cell(218,142,60,30,k>=1?b:blank)+
      wire('M278 76 H307 L359 105',k===2)+wire('M278 157 H307 L359 117',k===2)+
      node(359,85,123,'AND · Q',k>=2?y:blank,k===2?'hot':'')+
      wire('M482 113 H511',k===3)+node(511,85,105,'Q̄',k===3?1-y:blank,k===3?'hot':'')+
      caption('La rete combina Q, S e R per formare lo stato successivo.');
  }
  function transparent([q,d1,d2,g2],k){
    return title('LATCH D · DUE INTERVALLI A INGRESSI STABILI')+
      waves([['G',[1,g2]],['D',[d1,d2]],['Q',[k>=1?d1:null,k>=3?(g2?d2:d1):null]]],['primo intervallo','secondo intervallo'])+
      caption(k>=2?'Nel secondo intervallo il selettore sceglie '+(g2?'il nuovo D.':'la retroazione di Q.'):'Q iniziale = '+q+'. G alto apre il percorso dal dato D.');
  }
  function edge([q,old,now,d],k){
    const rise=Number(!old&&now);
    return title('CAMPIONAMENTO SUL FRONTE DI SALITA · Q INIZIALE = '+q)+
      waves([['clock',[old,now]],['D',[d,d]],['Q',[q,k===3?(rise?d:q):null]]],['prima del fronte','dopo il fronte'])+
      caption(k===0?'Il fronte è definito dai due livelli consecutivi del clock.':k===1?'Complemento del clock precedente = '+(1-old)+'.':'Impulso di acquisizione = '+rise+'.');
  }
  function countOrLoad([q,ld],k){
    return title('REGISTRO A QUATTRO BIT · Q INIZIALE = '+bits(q,4))+
      node(30,51,184,'incrementatore',k>=1?bits((q+1)&15,4):blank,k===1?'hot':'')+
      node(30,140,184,'ingresso D',bits(5,4))+
      wire('M214 77L322 110',k>=2&&!ld)+wire('M214 165L322 121',k>=2&&!!ld)+
      node(322,88,113,'MUX',ld,k===2?'hot':'')+wire('M435 115H483',k===3)+
      node(483,88,128,'Q al fronte',k===3?bits(ld?5:(q+1)&15,4):blank,k===3?'hot':'')+
      caption('ESI = '+ld+' seleziona l’ingresso del registro.');
  }
  function simultaneous([a,b,reset],k){
    let g=title('FRONTE COMUNE · RESET = '+reset);
    g+=node(27,45,160,'A iniziale',bits(a,4))+node(27,134,160,'B iniziale',bits(b,4));
    g+=wire('M187 72 L259 158',k===1)+wire('M187 159 L259 72',k===1);
    [b,(a+1)&15].forEach((v,i)=>{const y=45+i*89;g+=node(259,y,157,'candidato '+(i?'B':'A'),k>=1?bits(v,4):blank,k===1?'hot':'')+
      wire('M416 '+(y+27)+' H455',k===3)+node(455,y,149,(i?'B':'A')+' acquisito',k===3?bits(reset?0:v,4):blank,k===3?'hot':'');});
    return g+caption(k===2?'Il reset seleziona '+(reset?'la coppia di zeri.':'i candidati normali.'):'Le due destinazioni acquisiscono dati derivati dallo stesso stato iniziale.');
  }
  function codeFields([byte,name],k){
    let g=title('PRIMO BYTE '+hex(byte)+' · CAMPI DEL CODICE Y86-64')+
      wordRow(55,'codifica',k>=1?byte:blank.repeat(8));
    g+=path('M140 94v8h188v-8 M332 94v8h188v-8','wire live')+
      node(141,121,182,'icode',k>=2?byte>>4:blank,k===2?'hot':'')+
      node(335,121,183,'ifun',k>=2?byte&15:blank,k===2?'hot':'');
    return g+caption(k===3?'I due campi selezionano l’istruzione '+name+'.':'Il nibble alto identifica la classe e quello basso la funzione.');
  }
  function boundaries([pc,r,c,name],k){
    const n=1+r+8*c;
    let content=[[k>=1?'op':blank,k===1?'hot':'']];
    if(k>=1&&r)content.push(['rA:rB','active']);
    if(k>=2&&c)for(let j=0;j<8;j++)content.push(['C'+j,'active']);
    return title('ISTRUZIONE '+name+' · PC = '+hex(pc))+
      text(24,57,'ESI (registri) = '+r+'     EDX (costante) = '+c,'label')+
      tape(24,85,content,58,43)+text(24,153,'primo byte @ '+hex(pc),'small')+
      text(27,196,'Lunghezza = '+(k>=2?n:blank)+' byte     valP = '+(k===3?hex(pc+n):blank),'value')+
      caption('C0 è il byte meno significativo della costante a otto byte.');
  }
  function registerByte([byte],k){
    const a=byte>>4,b=byte&15,rs=['%rax','%rcx','%rdx','%rbx'];
    return title('OPq · BYTE DEI REGISTRI = '+hex(byte))+
      wordRow(54,'rA:rB',byte)+node(35,131,163,'sorgente A',k>=2?rs[a]:k>=1?'rA = '+a:blank,k===2?'hot':'')+
      node(237,131,164,'sorgente B',k>=2?rs[b]:k>=1?'rB = '+b:blank,k===2?'hot':'')+
      wire('M401 160H451',k===3)+node(451,131,152,'destinazione E',k===3?rs[b]:blank,k===3?'hot':'')+
      caption('Le porte leggono entrambi gli operandi. Il risultato torna in rB.');
  }
  function subtract([a,b],k){
    return title('subq %rax, %rbx · IL SECONDO REGISTRO È DESTINAZIONE')+
      node(23,52,156,'%rax · valA',a)+node(23,132,156,'%rbx · valB',b)+
      wire('M179 79L263 106',k===1)+wire('M179 157L263 118',k===1)+
      node(263,84,150,'valB − valA',k>=2?b-a:blank,k===2?'hot':'')+
      wire('M413 112H454',k===3)+node(454,84,152,'ZF / SF',k===3?(+(b===a))+' / '+(+(b<a)):blank,k===3?'hot':'')+
      caption('La differenza va in %rbx. ZF e SF ne indicano zero e segno.');
  }
  function memoryWord([b,d,m,pc],k){
    const address=b+d;let g=title('mrmovq · BASE '+hex(b)+' E SPOSTAMENTO '+d)+
      text(26,60,'valE = '+(k?hex(address):blank)+'      PC iniziale = '+hex(pc),'label');
    g+=tape(26,83,Array.from({length:8},(_,i)=>[k>=2?hex(i===0?m:0):blank,k===2?'hot':'']),70);
    for(let i=0;i<8;i++)g+=text(59+70*i,135,k?hex(address+i):'+'+i,'small','middle');
    return g+node(29,151,246,'dato a 64 bit · %rax',k>=2?hex(m,16):blank,k===2?'hot':'')+
      node(342,151,236,'PC sequenziale',k===3?hex(pc+10):blank,k===3?'hot':'')+
      caption('Le celle sono in ordine di indirizzo. Il carico legge gli otto byte.');
  }
  function stack([sp,push],k){
    const delta=push?-8:8,after=sp+delta,memAddress=push?after:sp;
    return title((push?'PUSHQ':'POPQ')+' · PAROLE DI OTTO BYTE')+
      node(29,51,172,'vecchio %rsp',hex(sp))+node(29,139,172,'aluA',k?delta:blank,k===1?'hot':'')+
      wire('M201 78L281 107',k===2)+wire('M201 166L281 122',k===2)+
      node(281,88,129,'valE',k>=2?hex(after):blank,k===2?'hot':'')+
      wire(push?'M410 116H455':'M201 77H437V115H455',k===3)+
      node(455,88,154,'mem_addr',k===3?hex(memAddress):blank,k===3?'hot':'')+
      caption(push?'La pila cresce verso indirizzi minori.':'La lettura visita la vecchia cima prima del rilascio della parola.');
  }
  function bounds([base,d,size],k){
    const start=base+d,end=start+7;let g=title('FINESTRA DI LETTURA · '+size+' BYTE DISPONIBILI')+
      text(24,62,'base '+base+'   +   spostamento '+d+'   =   '+(k?start:blank),'label');
    // Ingrandimento attorno all’estremo alto. Tutte le caselle hanno la stessa scala.
    const first=size-12;
    for(let j=0;j<17;j++){const addr=first+j,read=k>=2&&addr>=start&&addr<=end;
      const x=26+j*34;g+=rect(x,96,32,37,'cell '+(read?(addr>=size?'danger':'hot'):addr<size?'':'off'),2);
      g+=text(x+16,161,addr,'small','middle');
      if(read)g+=text(x+16,121,'•','value','middle');
    }
    return g+text(26,195,'ultimo byte = '+(k>=2?end:blank)+'     valido = '+(k===3?Number(end<size):blank),'value')+
      caption('Le ultime caselle oltre il limite rappresentano indirizzi esterni alla memoria.');
  }
  function seqControl([byte,rd,wr,cc],k){
    const vec=4*rd+2*wr+cc;
    return title('CONTROLLO SEQ · DECODIFICA DELLA CLASSE')+
      node(26,50,168,'primo byte',hex(byte))+wire('M194 77H239',k===1)+node(239,50,153,'icode',k?byte>>4:blank,k===1?'hot':'')+
      [['mem_read',rd],['mem_write',wr],['set_cc',cc]].map(([n,v],i)=>node(24+i*202,137,171,n+' · peso '+(1<<(2-i)),k>=2?v:blank,k===2?'hot':'')).join('')+
      caption(k===3?'La parola '+bits(vec,3)+' ha valore '+vec+' in EAX.':'I segnali occupano le posizioni da due a zero.');
  }
  function critical([a,b,c,g],k){
    const scale=410/(Math.max(a+b,c)+g);
    function segment(x,y,t,label,mode){const w=scale*t;return rect(x,y,w,34,'cell '+mode,1)+text(x+w/2,y+22,label,'small','middle');}
    let out=title('PERCORSI FRA REGISTRI · TEMPI IN ps')+text(23,85,'ramo serie','small')+text(23,144,'ramo diretto','small')+
      segment(138,62,a,a,'active')+segment(138+a*scale,62,b,b,k===1?'hot':'active')+segment(138,122,c,c,k===2?'hot':'active');
    if(k>=2){const x=138+Math.max(a+b,c)*scale;out+=path('M'+x+' 50V176','wire live')+text(x,194,'massimo '+Math.max(a+b,c),'small','middle');}
    if(k===3)out+=segment(138+Math.max(a+b,c)*scale,87,g,'+'+g,'hot');
    return out+caption(k===3?'Periodo minimo = '+(Math.max(a+b,c)+g)+' ps.':'I rami ricevono gli ingressi allo stesso istante.');
  }
  function choosePC([pc,t,z],k){
    const next=pc+9;
    return title('JNE · PC INIZIALE = '+hex(pc)+'   /   ZF = '+z)+
      node(25,49,173,'sequenziale · valP',k?hex(next):blank,k===1?'hot':'')+
      node(25,139,173,'destinazione · valC',hex(t))+
      wire('M198 77L310 112',k===3&&!!z)+wire('M198 165L310 122',k===3&&!z)+
      node(310,91,115,'Cnd',k>=2?1-z:blank,k===2?'hot':'')+
      wire('M425 120H469',k===3)+node(469,91,138,'nuovo PC',k===3?hex(z?next:t):blank,k===3?'hot':'')+
      caption('Il predicato di jne legge il vecchio ZF.');
  }
  function pipelineWork([m,n],k){
    const total=m+n-1,dx=44,dy=Math.min(29,Math.floor(144/n));let g=title('PIPELINE VUOTA · '+m+' STADI E '+n+' ISTRUZIONI');
    for(let c=0;c<(k>=2?total:k===1?m:1);c++)g+=text(65+c*dx,52,c+1,'small','middle');
    for(let i=0;i<n;i++){
      const y=61+i*dy;g+=text(22,y+dy*.7,'I'+(i+1),'small');
      for(let h=0;h<m;h++){
        const show=k>=2||i===0&&k>=1||i===0&&h===0;
        if(show){const x=44+(i+h)*dx;g+=rect(x,y,dx-2,dy-1,'cell '+(h===m-1?'hot':'active'),2)+text(x+(dx-2)/2,y+dy*.74,'S'+(h+1),'small','middle');}
      }
    }
    return g+caption(k===3?'Completamenti da ciclo '+m+' a ciclo '+total+'.':k===2?(n===1?'Il primo completamento esaurisce il programma.':'Dopo il riempimento si completa una istruzione a ogni ciclo.'):'Ciascuna riga segue una singola istruzione nel tempo.');
  }
  function speedup([m,n,t],k){
    const latency=m*t,serial=n*latency,piped=(n+m-1)*t,scale=425/serial;
    let g=title('LATENZA INDIVIDUALE E TEMPO PER '+n+' ISTRUZIONI')+
      text(22,72,'una istruzione','small')+text(22,121,'in serie','small')+text(22,167,'in pipeline','small');
    const bar=(y,len,txt,mode)=>rect(142,y,scale*len,29,'cell '+mode,1)+text(149+scale*len,y+18,txt,'small');
    for(const y of [82,131,177])g+=path('M142 '+y+'h425','wire dim');
    if(k===0)g+=bar(52,t,t+' ps / stadio','');
    if(k>=1)g+=bar(52,latency,latency+' ps','active');
    if(k>=2)g+=bar(101,serial,serial+' ps','active')+bar(147,piped,piped+' ps','hot');
    return g+caption(k===3?'Accelerazione = '+serial+' / '+piped+' = '+(serial/piped).toLocaleString('it-IT')+'.':'Ogni stadio impiega '+t+' ps. Tutte le barre condividono la scala temporale.');
  }
  function raw([dst,a,b,en],k){
    const eqA=Number(dst===a),eqB=Number(dst===b),valid=Number(dst!==15&&en&&(eqA||eqB));
    return title('CONFRONTO DEI NOMI DI REGISTRO · 15 = RNONE')+
      node(24,90,120,'dst',dst)+wire('M144 117L197 73',k===1)+wire('M144 117L197 164',k===1)+
      node(197,47,134,'srcA = '+a,k>=1?eqA:blank,k===1?'hot':'')+
      node(197,137,134,'srcB = '+b,k>=1?eqB:blank,k===1?'hot':'')+
      node(365,89,131,'scrivi / valido',k>=2?en+' / '+Number(dst!==15):blank,k===2?'hot':'')+
      wire('M496 117H532',k===3)+node(532,89,88,'RAW',k===3?valid:blank,k===3?'hot':'')+
      caption('Dipendenza: destinazione valida, sorgente coincidente e scrittura abilitata.');
  }
  function lostCycles([a,b],k){
    const bitRow=(y,label,mask,show)=>text(20,y+19,label,'small')+tape(159,y,Array.from({length:6},(_,i)=>{
      const bit=(mask>>i)&1;return [show?bit:blank,show&&bit?'hot':''];}),72,29);
    let g=title('MASCHERE SU SEI CICLI · BIT 0 A SINISTRA');
    for(let i=0;i<6;i++)g+=text(195+i*72,55,'c'+(i+1),'small','middle');
    g+=bitRow(62,'dati',a,true)+bitRow(97,'risorsa',b,true)+bitRow(132,'entrambe',a&b,k>=1)+bitRow(167,'almeno una',a|b,k>=2);
    return g+caption(k>=3?'Fermi effettivi = '+bits(a|b,6).replaceAll('0','').length+' cicli distinti.':'AND individua le cause simultanee. OR riunisce i cicli persi.');
  }
  function distance([gap],k){
    const read=3+gap,stalls=Math.max(0,5-read),producer=k>=1?pipeline:['F'],consumer=Array(5);
    if(k>=2)consumer[read-1]='D';
    if(k>=3)for(let c=read;c<=5;c++)consumer[c-1]=c<5?'D*':'D';
    return title('SENZA FORWARDING · '+gap+' ISTRUZIONI INTERPOSTE')+
      pipeGrid([['produttore',producer],['consumatore',consumer]],5)+
      text(22,187,k>=3?'Attesa in D = '+stalls+' cicli.':'W scrive nel primo semiciclo. D legge nel secondo.','label')+
      caption('D* indica un ciclo di permanenza in attesa della parola.');
  }
  function occupancy([cycle,s,n],k){
    const i=cycle-s+1;
    let g=title('CICLO '+cycle+' · STADIO OSSERVATO '+pipeline[s-1]);
    pipeline.forEach((name,j)=>{const val=cycle-j,known=k===3||k>=2&&j===s-1;
      g+=node(25+j*121,86,102,name,known?(val>=1&&val<=n?'I'+val:'—'):blank,j===s-1?'hot':'');});
    g+=text(27,183,k?('Trasferimenti da F a '+pipeline[s-1]+' = '+(s-1)):('Istruzioni emesse: I1 … I'+n),'label');
    return g+caption(k>=2?'Indice candidato = '+cycle+' − '+s+' + 1 = '+i+'.':'La prima istruzione entra in F al ciclo 1.');
  }
  function pipeControl([load,ret],k){
    const signals=[['F_stall',load||ret,1],['D_stall',load,2],['D_bubble',Number(!load&&ret),2],['E_bubble',load,3]];
    return title('INTERBLOCCO · PREVISIONI DI SALTO CORRETTE')+
      node(34,45,238,'load_use',load)+node(341,45,238,'ret_in_DEM',ret)+
      signals.map(([name,val,at],i)=>node(21+i*153,140,135,name,k>=at?val:blank,k===at?'hot':'')).join('')+
      caption(k===3?(load?'D trattiene il consumatore ed E riceve una bolla.':'D riceve una bolla mentre E acquisisce il ritorno.'):'Le priorità decidono se D conserva l’istruzione oppure acquisisce una bolla.');
  }
  function fetch([j,r,p,m,w],k){
    return title('SELETTORE DI FETCH · CORREZIONE M = '+j+'  /  RET IN W = '+r)+
      node(22,43,135,'F_predPC',hex(p),k===1?'hot':'')+node(22,131,135,'W_valM',hex(w))+
      wire('M157 71L220 102',k===2&&!r)+wire('M157 159L220 115',k===2&&!!r)+
      node(220,80,154,'dopo ret',k>=2?hex(r?w:p):blank,k===2?'hot':'')+
      node(270,151,148,'M_valA',hex(m))+
      wire('M374 106L465 97',k===3&&!j)+wire('M418 177L465 109',k===3&&!!j)+
      node(465,75,146,'PC di fetch',k===3?hex(j?m:r?w:p):blank,k===3?'hot':'')+
      caption('La correzione in M ha priorità sul candidato intermedio.');
  }
  function loadUse([gap],k){
    const d=3+gap,w=d+3+Number(!gap),u=Array(7),l=['F'];
    if(k>=1)l.splice(1,0,'D','E','M');
    if(k>=2){u[d-2]='F';u[d-1]=gap?'D':'D*';if(!gap)u[d]='D';}
    if(k===3){l.push('W');u[w-3]='E';u[w-2]='M';u[w-1]='W';}
    return title('CARICO L E CONSUMATORE U · '+gap+' COPIE INTERPOSTE')+
      pipeGrid([['L · carico',l],['U · uso',u]],7)+
      text(25,181,k>=2?'U appare per la prima volta in D al ciclo '+d+'.':'L deve raggiungere M per leggere il dato.','label')+
      caption(k===3?'U completa W al ciclo '+w+'. D* segnala il primo ciclo di una permanenza estesa.':'Il dato viene inoltrato dopo il passaggio del carico in M.');
  }
  function transfer([d,e,m,err],k){
    const before=[d,e,m],after=[err?0:d,e,m];
    let g=title('FRONTE DI CLOCK · ERRORE DI PREVISIONE = '+err);
    ['D','E','M','W'].forEach((n,i)=>{const x=25+i*151;g+=node(x,50,119,'prima · '+n,i<3?'I'+before[i]:'…');
      if(i>0){const known=k>=i;g+=node(x,147,119,'dopo · '+n,known?(after[i-1]?'I'+after[i-1]:'bolla'):blank,k===i?'hot':'');
        if(known&&i===1&&err){
          g+=path('M'+(x-91)+' 106l53 15','wire dim')+text(x-26,129,'×','value danger','middle');
        }else if(known)g+=wire('M'+(x-91)+' 106L'+(x+60)+' 147',k===i);}
    });
    return g+caption('Le tre scritture avvengono insieme. I passi isolano una destinazione alla volta.');
  }

  function verificaGrafica(figura,k){
    let g=title(figura.titolo);
    if(figura.tipo==='bit'){
      figura.righe.forEach((parola,i)=>{
        const visibile=k>=figura.mostra[i];
        g+=wordRow(42+i*43,figura.etichette[i],visibile?parola:blank.repeat(parola.length),parola.length);
      });
    }else{
      const onde=figura.tipo==='onde';
      const righe=figura.righe.map((valori,riga)=>[
        figura.etichette[riga],
        valori.map((valore,i)=>k>=figura.mostra[riga][i]?valore:(onde?null:''))
      ]);
      g+=onde?waves(righe,figura.tempi):pipeGrid(righe,figura.righe[0].length);
    }
    return g+caption(figura.note[k]);
  }

  const diagrams=[
    [majority,nibbles,carryBorrow,flags,srSequence],
    [srCharacteristic,transparent,edge,countOrLoad,simultaneous],
    [codeFields,boundaries,registerByte,subtract,memoryWord],
    [stack,bounds,seqControl,critical,choosePC],
    [pipelineWork,speedup,raw,lostCycles,distance],
    [occupancy,pipeControl,fetch,loadUse,transfer]
  ];
  diagrams.forEach((row,c)=>row.forEach((render,i)=>{
    SL.sceneProve['3.'+(c+1)+'/'+(i+1)]=(variant,k)=>variant.figuraIII?verificaGrafica(variant.figuraIII,k):render(variant.ingressiGrafico,k);
  }));
})();
