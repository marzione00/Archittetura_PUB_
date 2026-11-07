/* Tracce di esercitazione x86-64. I dati di ingresso sono letti dalla consegna
   della variante. I risultati diventano visibili al passaggio che li calcola. */
(() => {
  'use strict';
  const {box,text,rect,path,arrow,travel}=SL.pen;
  const scenes={};
  const add=(id,render)=>{scenes['2.'+id]=render;};
  const title=t=>text(22,26,t,'label');
  const bottom=t=>text(22,231,t,'small');
  const hex=(v,n=0)=>'0x'+BigInt(v).toString(16).toUpperCase().padStart(n,'0');
  const bits=(v,n=8)=>BigInt.asUintN(n,BigInt(v)).toString(2).padStart(n,'0');
  const form=s=>String(s).replace('.',',');
  const answer=(v,i)=>v.campi[i].answer;
  const group=(v,re)=>v.consegna.match(re).slice(1);
  const nums=(v,re)=>group(v,re).map(Number);
  const hexes=v=>Array.from(v.consegna.matchAll(/0x[0-9a-f]+/gi),m=>Number(m[0]));
  const state=(chosen=false)=>chosen?'cell hot reveal':'cell';
  const on=(d,active)=>path(d,active?'wire live':'wire dim')+(active?travel(d):'');
  function flow(x,y,x2,y2,active){
    return arrow(x,y,x2,y2,active)+(active?travel('M'+x+' '+y+' L'+x2+' '+y2):'');
  }
  function row(y,items,highlight=()=>false,opts={}){
    const x=opts.x??22,span=opts.w??596,h=opts.h??42,w=span/items.length;
    return items.map((v,i)=>rect(x+i*w,y,w-2,h,state(highlight(i)),2)+text(x+(i+.5)*w-1,y+h/2+5,v,items.length>14?'small':'label','middle')).join('');
  }
  function strip(y,num,highlight=()=>false){return row(y,[...bits(num)],i=>highlight(7-i));}
  function reg(x,y,name,val,active=false,width=163){return box(x,y,width,52,name,val,state(active));}
  function stackRow(y,addr,val,active){return rect(32,y,266,38,state(active))+text(43,y+24,addr,'small')+text(284,y+25,val,'label','end');}
  function progress(y,n,shown,caption){
    const w=540/n;
    return text(26,y-9,caption,'small')+
      Array.from({length:n},(_,i)=>rect(26+i*w,y,Math.max(1,w-2),33,i<shown?'cell active':'cell',2)).join('');
  }
  add('1/1',(v,k)=>{
    const [a,b]=nums(v,/EAX vale (\d+) ed EBX vale (\d+)/),op=v.consegna.includes('ADD')?'ADD':'SUB';
    return title('Percorso dati · '+op+' EAX, EBX')
      +reg(22,52,'EAX · ingresso',a)+reg(22,144,'EBX',b)
      +on('M187 79 H222 L267 113',k===2)+on('M187 169 H222 L267 127',k===2)
      +path('M268 85 L315 101 L362 85 V154 L315 166 L268 154 Z','wire live')
      +text(315,134,k?op:'?', 'value','middle')
      +flow(364,125,431,125,k===3)+reg(434,98,'EAX dopo la scrittura',k===3?answer(v,1):'?',k===3,183)
      +bottom(k===0?'I due registri contengono gli operandi.':k===1?'La decodifica seleziona l’operazione dell’ALU.':k===2?'Entrambi gli ingressi sono disponibili all’ALU.':'EBX conserva '+b+'.');
  });
  add('1/2',(v,k)=>{
    const [n,c,f]=nums(v,/esegue (\d+) istruzioni a CPI medio (\d+) su un clock di (\d+)/);
    let g=title(n+' istruzioni · CPI '+c+' · clock '+f+' GHz');
    for(let i=0;i<Math.min(n,4);i++){
      const x=23+142*i;
      g+=text(x,68,'istruzione '+(i+1), 'small');
      g+=row(78,Array(c).fill('c'),()=>k>=2,{x,w:134,h:35});
    }
    g+=text(601,103,'…','value')+text(23,143,k?'Ogni ciclo dura '+form(1/f)+' ns.':'c = un ciclo di clock','label');
    return g+reg(23,161,'cicli complessivi',k>=2?answer(v,0):'?',k===2,198)
      +flow(227,184,364,184,k===3)+reg(371,161,'tempo totale',k===3?answer(v,1)+' ns':'?',k===3,221);
  });
  add('1/3',(v,k)=>{
    const hit=v.consegna.startsWith('La cache dati contiene');
    return title('Percorso seriale · consultazione 4 cicli · rifornimento 80 cicli')
      +reg(21,94,'richiedente','CPU')+reg(231,94,'linea in cache',k>=2?(hit?'hit':'miss'):'?',k===2)
      +reg(444,94,'RAM','DRAM',k===3&&!hit)
      +flow(186,109,228,109,k===1)+flow(398,109,439,109,k===3&&!hit)
      +on('M526 149 V175 H99 V149',k===3&&!hit)+on('M312 149 V161 H99 V149',k===3&&hit)
      +bottom(k===3?'Origine: '+answer(v,0)+' · latenza '+answer(v,1)+' cicli.':k===0?'La CPU richiede il dato all’indirizzo assegnato.':k===1?'È in corso il confronto delle etichette.':hit?'La linea richiesta è valida.':'Il miss richiede il rifornimento.');
  });
  add('1/4',(v,k)=>{
    const [n]=nums(v,/Leggi (\d+) byte/),start=hexes(v)[0],end=start+n-1;
    const first=Math.floor(start/32),last=Math.floor(end/32),base=Math.floor(start/32)*32;
    let g=title('Cache inizialmente vuota · linee da 32 byte');
    for(let line=0;line<2;line++){
      const y=65+line*64,lo=base+32*line;
      g+=text(22,y-9,'intervallo '+hex(lo)+'–'+hex(lo+31)+(k>=1&&line===0?' · linea '+first:k>=2?' · linea '+(first+line):''),'small');
      for(let i=0;i<32;i++){const a=lo+i,selected=k>=1&&a===start||k>=2&&a>=start&&a<=end;g+=rect(22+i*18.6,y,17.4,29,selected?'cell hot reveal':'cell',1);}
    }
    return g+bottom(k===3?'Ogni linea distinta richiede un carico. Totale = '+answer(v,1)+'.':k===2?'Ultimo byte = '+hex(end)+' · linea '+last+'.':k===1?'Primo byte = '+hex(start)+' · linea '+first+'.':'Il primo byte richiesto è a '+hex(start)+'.');
  });
  add('1/5',(v,k)=>{
    const [addr,data,n]=nums(v,/usa (\d+) bit di indirizzo, memoria indirizzata a byte e (\d+) bit di dati per trasferimento\. Un blocco allineato occupa (\d+) byte/);
    const width=data/8;
    let g=title('Bus · campo indirizzo '+addr+' bit, dati '+data+' bit')+progress(68,addr,k>=1?addr:0,'linee di indirizzo')+progress(148,n,k===3?n:k===2?width:0,'blocco di '+n+' byte');
    if(k>=2){for(let j=0;j<(k===3?n/width:1);j++){const x=26+j*width*540/n;g+=path('M'+x+' 185 v5 h'+(width*540/n-3)+' v-5','wire live');}}
    return g+bottom(k===0?'Gli indirizzi identificano singoli byte.':k===1?'Spazio di indirizzamento = '+answer(v,0)+' byte.':k===2?'Una parentesi raccoglie '+width+' byte per trasferimento.':'Trasferimenti complessivi = '+answer(v,1)+'.');
  });

  add('2/1',(v,k)=>{
    const [a,b,c]=nums(v,/valgono (\d+), (\d+), (\d+)/);
    return title('Moltiplicazione e addizione · EDI resta disponibile')
      +reg(23,49,'EDI',a)+reg(236,49,'ESI',b)+reg(449,49,'EDX',c)
      +on('M105 103 V123 H316 V157',k===1)+flow(316,104,316,157,k===2)+on('M531 104 V123 H316 V157',k===3)
      +reg(212,159,'EAX · '+['ingresso','MOV','IMUL','ADD'][k],k===0?'?':k===1?a:answer(v,k-2),k>0,209);
  });
  add('2/2',(v,k)=>{
    const [a,b]=nums(v,/a = (\d+) ed ESI contiene b = (\d+)/);
    return title('Sommatore di indirizzi · due istruzioni LEA')
      +reg(24,48,'a',a)+reg(228,48,'indice a × 2',k?2*a:'?')+reg(432,48,'b',b)
      +on('M104 102 V124 H198 V153',k===1)+on('M309 102 V124 H198 V153',k===1)
      +reg(73,157,'prima LEA',k?answer(v,0):'?',k===1,216)
      +flow(290,183,370,183,k===3)+reg(373,157,'triplo + b + 1',k===3?answer(v,1):'?',k===3,220)
      +bottom(k===2?'La seconda LEA riceve base '+answer(v,0)+', indice '+b+' e spiazzamento 1.':'Gli addendi vengono combinati senza leggere la memoria.');
  });
  add('2/3',(v,k)=>{
    const [a,b,m]=hexes(v),diff=Number(answer(v,0));
    return title('AL = '+hex(a,2)+' · BL = '+hex(b,2)+' · maschera '+hex(m,2))
      +text(22,57,k?'AL dopo SUB':'AL iniziale','small')+strip(63,k?diff:a)
      +text(22,132,k>=2?'Bit che attraversano la maschera':'Maschera della consegna','small')
      +strip(140,k===3?Number(answer(v,1)):m,i=>k>=2&&((m>>i)&1)===1)
      +bottom(k===3?'AL scritto da AND = '+hex(Number(answer(v,1)),2)+'.':k===2?'Le celle in ambra indicano i bit da conservare.':k===1?'AL − BL = '+hex(diff,2)+'.':'La sottrazione precede il filtro.');
  });
  add('2/4',(v,k)=>{
    const [source,cmp]=hexes(v),val=k===0?source:k===1?255-source:Number(answer(v,0));
    return title('AL · complemento, shift logico, confronto')
      +text(22,58,['Input','NOT AL','SHR AL,1','CMP AL,immediato'][k],'label')+strip(69,val,i=>k===2&&i===7)
      +reg(27,145,'valore di confronto',hex(cmp,2))+flow(193,172,330,172,k===3)
      +reg(334,146,'ZF → DL',k===3?answer(v,1):'?',k===3,185)
      +bottom(k===0?'Il confronto riguarda il byte dopo entrambe le trasformazioni.':'AL = '+hex(val,2));
  });
  add('2/5',(v,k)=>{
    const [a,b]=hexes(v),cf=Number(a<b),zf=Number(a===b);
    return title('Minimo unsigned · due candidati e un predicato')
      +reg(20,43,'EDI',hex(a,8))+reg(20,147,'ESI',hex(b,8))
      +on('M185 72 H235 V124 H285',k===1)+on('M185 174 H235 V124 H285',k===3&&!cf&&!zf)
      +reg(289,98,'EAX',k===0?'?':k<3?hex(a,8):hex(+answer(v,1),8),k===1||k===3,196)
      +text(505,84,'CMP','label')+text(505,126,'CF = '+(k>=2?cf:'?'),'label')+text(505,158,'ZF = '+(k>=2?zf:'?'),'label')
      +bottom(k===3?answer(v,0)+' · EAX = '+answer(v,1)+'.':'La selezione deve valere per qualunque coppia di operandi.');
  });

  add('3/1',(v,k)=>{
    const [l,h]=group(v,/i byte ([\dA-F]{2}) ([\dA-F]{2})/i),extendedLo=Number(answer(v,0)),extendedHi=Number(answer(v,1));
    return title('Word little-endian · in memoria da sinistra a destra')
      +reg(25,46,'[RDI]',l)+reg(232,46,'[RDI + 1]',h)
      +flow(398,72,442,72,k===1)+reg(444,46,'word',k?hex(extendedLo,4):'?',k===1)
      +reg(50,147,'EAX · MOVZX',k>=2?hex(extendedLo,8):'?',k===2,236)
      +reg(351,147,'EAX · MOVSX',k===3?hex(extendedHi>>>0,8):'?',k===3,236)
      +bottom(k===3?'Interpretazione con segno a 32 bit = '+extendedHi+'.':'Gli stessi sedici bit alimentano due estensioni diverse.');
  });
  add('3/2',(v,k)=>{
    const [base,word]=hexes(v),[i]=nums(v,/RSI vale (\d+)/),addr=Number(answer(v,0));
    const bytes=[0,1,2,3].map(j=>hex((word>>>(8*j))&255,2).slice(2));
    return title('RDI = '+hex(base)+' · RSI = '+i+' · EDX = '+hex(word,8))
      +reg(24,54,'indice × 4',k?4*i+' B':'?',k===1)
      +flow(190,80,265,80,k===2)+reg(269,54,'RAX · indirizzo',k>=2?hex(addr):'?',k===2,224)
      +row(148,k===3?bytes:Array(4).fill('·'),()=>k===3)
      +bottom(k===3?'Indirizzi crescenti da '+hex(addr)+' a '+hex(addr+3)+'.':'La scrittura di una dword occupa quattro byte consecutivi.');
  });
  add('3/3',(v,k)=>{
    const [base,ptr]=hexes(v),[idx]=nums(v,/voce di indice (\d+)/);
    return title('Tabella di puntatori con base '+hex(base)+' · voce '+idx)
      +reg(23,58,'indirizzo della voce',k?hex(+answer(v,0)):'?',k===1,184)
      +flow(209,84,228,84,k===2)+reg(230,58,'RCX · puntatore',k>=2?hex(ptr):'?',k===2,176)
      +on('M407 84 H493 V145',k===3)+reg(389,149,'indirizzo dei dati',k===3?hex(+answer(v,1)):'?',k===3,212)
      +flow(386,178,276,178,k===3)+reg(79,149,'EAX caricato',k===3?answer(v,2):'?',k===3,190)
      +bottom('Ogni puntatore misura otto byte; il dato finale occupa quattro byte.');
  });
  add('3/4',(v,k)=>{
    const [x,y]=nums(v,/contiene \[(\d+), (\d+)\]/);
    return title('Array di dword · salvataggio prima della riscrittura')
      +reg(94,47,'EAX temporaneo',k?x:'?',k===1,180)+reg(357,47,'ECX temporaneo',k?k===3?y+1:y:'?',k===1||k===3,180)
      +on('M181 153 V103',k===1)+on('M446 153 V103',k===1)
      +on('M183 102 Q304 119 445 152',k===2)+on('M446 101 Q301 118 184 152',k===3)
      +reg(94,155,'[RDI + 0]',k===3?answer(v,0):x,k===3,180)+reg(357,155,'[RDI + 4]',k>=2?x:y,k===2,180);
  });
  add('3/5',(v,k)=>{
    const base=hexes(v)[0],[n,a,b]=nums(v,/lunghezza, (\d+) elementi\. Il primo valore è (\d+) e l’ultimo (\d+)/);
    return title('RDI = '+hex(base)+' · ESI = '+n+' elementi · word da due byte')
      +row(58,Array.from({length:n},(_,i)=>i===0?a:i===n-1?b:'·'),i=>k>=2&&(i===0||i===n-1))
      +text(22,127,'indice 0','small')+text(613,127,k?'indice '+(n-1):'ultimo indice','small','end')
      +reg(22,156,'indirizzo ultimo',k>=2?hex(+answer(v,0)):'?',k===2,228)
      +flow(252,183,356,183,k===3)+reg(360,156,'EAX · primo + ultimo',k===3?answer(v,1):'?',k===3,242);
  });
  add('4/1',(v,k)=>{
    const input=hexes(v)[0],[bit]=nums(v,/il bit (\d+)/),low=Number(answer(v,0));
    const src=k<2?low:k===2?low>>bit:Number(answer(v,1));
    return title('Registro EAX = '+hex(input)+' · selezione del bit '+bit)
      +row(52,[...bits(input,16)],i=>k===1&&i>=8)
      +text(22,125,['Byte basso prima del filtro','Risultato di AND 0xFF','Risultato di SHR','Bit dopo AND 1'][k],'small')
      +strip(138,src,i=>i===(k<2?bit:0)&&k>=1)
      +bottom(k===0?'Le posizioni si contano dal bit di peso uno.':k===1?'Byte basso = '+hex(low,2)+'.':k===2?'Il bit selezionato occupa ora la posizione zero.':'Bit normalizzato = '+answer(v,1)+'.');
  });
  add('4/2',(v,k)=>{
    const [a,b]=hexes(v),[bit]=nums(v,/il bit (\d+)/);const h=k>=1?a&15:a,l=k>=1?b&15:b;
    return title('Assemblaggio dei semibyte · commutazione alla posizione '+bit)
      +text(20,52,'AL','small')+row(58,[...bits(h,8)],i=>k>=1&&i>=4,{x:20,w:276,h:32})
      +text(344,52,'BL','small')+row(58,[...bits(l,8)],i=>k>=1&&i>=4,{x:344,w:276,h:32})
      +on('M182 93 L177 136',k===2)+on('M513 93 L453 136',k===2)
      +row(143,k>=2?[...bits(Number(answer(v,k===3?1:0)),8)]:Array(8).fill('·'),i=>k===3?7-i===bit:k===2&&i<4)
      +bottom(k===3?'XOR commuta il bit evidenziato. Byte finale = '+hex(+answer(v,1),2)+'.':k===2?'Il semibyte di AL occupa la metà alta.':'La maschera 0x0F agisce su ciascuna sorgente.');
  });
  add('4/3',(v,k)=>{
    const [a,m]=hexes(v),r=Number(answer(v,0)),current=[a,r,r^255,Number(answer(v,1))][k];
    return title('AL · XOR, NOT e scorrimento logico')
      +text(22,57,'operando di XOR','small')+strip(63,m,i=>((m>>i)&1)===1)
      +text(22,128,['AL in ingresso','AL dopo XOR','AL dopo NOT','AL dopo SHR di due'][k],'small')
      +strip(136,current,i=>k===1?Boolean((m>>i)&1):k===2||k===3&&i>=6)
      +bottom(k===3?'I due bit alti sono riempiti con zero. AL = '+hex(current,2)+'.':'Valore corrente di AL = '+hex(current,2)+'.');
  });
  add('4/4',(v,k)=>{
    const a=hexes(v)[0],[w,b,val]=nums(v,/i (\d+) bit a partire dalla posizione (\d+) con il valore (\d+)/);
    const mask=Number(answer(v,0)),cur=k<2?a:k===2?a&~mask:Number(answer(v,1));
    return title('Campo di '+w+' bit a partire dalla posizione '+b)
      +text(22,57,'maschera del campo','small')+row(65,k?[...bits(mask)]:Array(8).fill('·'),i=>k>0&&Boolean((mask>>(7-i))&1))
      +text(22,130,['AL di partenza','AL prima della modifica','AL con il campo azzerato','AL con il nuovo campo'][k],'small')
      +strip(137,cur,i=>k>0&&Boolean((mask>>i)&1))
      +bottom(k===3?'Rilettura mediante shift e maschera: DL = '+answer(v,2)+'.':'Valore da inserire: '+val+'.');
  });
  add('4/5',(v,k)=>{
    const a=hexes(v)[0],[align]=nums(v,/multiplo di (\d+)/),mask=align-1,sum=a+mask,result=Number(answer(v,1));
    return title('Allineamento a '+align+' byte · ultimi otto bit mostrati')
      +text(22,58,k>=2?'Dopo ADD':'Puntatore iniziale','small')+strip(65,k>=2?sum&255:a&255,i=>k>=1&&i<Math.log2(align))
      +reg(22,152,'addendo',k?mask:'?',k===1,123)+reg(178,152,'somma',k>=2?hex(sum):'?',k===2,159)
      +flow(340,179,420,179,k===3)+reg(423,152,'dopo AND',k===3?hex(result):'?',k===3,180)
      +bottom(k===3?'I bit bassi selezionati da TEST sono zero: ZF = 1.':'La maschera finale azzera le posizioni inferiori all’allineamento.');
  });

  add('5/1',(v,k)=>{
    const [msg,fd,code]=group(v,/«([^»]+)» senza carattere di fine riga\. Scrivili su fd (\d+) .* codice (\d+)/);
    return title('Buffer msg · byte ASCII consecutivi')
      +row(53,[...msg],()=>k===2,{h:41})
      +reg(22,141,k===3?'EDI · exit':'RDI · write',k===3?code:k?fd:'?',k===1||k===3,172)
      +reg(215,141,k===3?'byte scritti':'RDX · lunghezza',k?msg.length:'?',k===1,191)
      +reg(429,141,'RAX',k===0?'?':k===1?1:k===2?msg.length:60,k>=2,178)
      +bottom(k===3?'SYSCALL exit termina il processo.':k===2?'Il descrittore ha ricevuto tutti i byte del buffer.':k===1?'RSI contiene l’indirizzo di msg.':'Il messaggio deve raggiungere fd '+fd+'.');
  });
  add('5/2',(v,k)=>{
    const [cap,n,i]=nums(v,/buffer scrivibile di (\d+) byte\. read restituisce (\d+).*offset (\d+)/);
    const labels=Array.from({length:cap},(_,j)=>'+'+j);
    return title('Buffer di '+cap+' byte · prima lettura effettiva '+n+' byte')
      +row(64,labels,j=>k===1?j<n:k>=2&&j>=i&&j<n)
      +(k>=2?flow(22+(i+.5)*596/cap,151,22+(i+.5)*596/cap,109,true):'')
      +reg(39,158,'RSI prima di write',k>=2?'buf + '+i:'?',k===2,208)
      +reg(368,158,'RDX per write',k>=2?answer(v,1):'?',k===3,223)
      +bottom(k===3?'Il suffisso evidenziato viene consegnato a fd 1.':k===1?'Le celle evidenziate contengono i byte restituiti da read.':'Gli offset sono relativi alla base buf.');
  });
  add('5/3',(v,k)=>{
    const sp=hexes(v)[0],[cap,read,i]=nums(v,/Riserva (\d+) byte sulla pila, poi usa read per caricarvi (\d+) byte.*indice (\d+)/);
    return title('Buffer sullo stack · capacità '+cap+' byte, richiesta read '+read+' byte')
      +row(66,Array.from({length:cap},(_,j)=>j<10||j===i?j:'·'),j=>k===1?j<read:k===2&&j===i,{h:39})
      +reg(24,153,'RSP',hex(k===0||k===3?sp:sp-cap),k===1||k===3,164)
      +flow(192,180,274,180,k===2)
      +reg(278,153,'RSI del byte selezionato',k>=2?hex(+answer(v,0)):'?',k===2,214)
      +text(504,181,k===3?'RDX = 1':'', 'label')
      +bottom(k===3?'Dopo la scrittura il programma libera '+cap+' byte.':k===2?'Il byte di indice '+i+' appartiene alla parte effettivamente letta.':'Gli indici della striscia sono relativi alla nuova base.');
  });
  add('5/4',(v,k)=>{
    const [n]=nums(v,/read di (\d+) byte/);
    return title('File ordinario · il cursore iniziale è alla fine')
      +row(54,['dati del file','…','ultimo byte'],()=>false,{x:22,w:398})
      +path('M421 43 V110','wire live')+text(433,81,'offset','label')
      +reg(23,147,'conteggio RDX',k?n:'?',k===1)
      +reg(239,147,'ritorno RAX',k>=2?0:'?',k===2)
      +reg(447,147,'aumento offset',k===3?0:'?',k===3)
      +bottom(k>=2?(n?'Richiesta positiva al termine del file.':'RDX = 0 implica un trasferimento di zero byte a qualunque offset.'):'La richiesta indica '+n+' byte.');
  });
  add('5/5',(v,k)=>{
    const [n]=nums(v,/consegnato (\d+) byte/),[a]=hexes(v),[w]=nums(v,/accetta (\d+)/);
    return title('Scrittura breve · buffer a '+hex(a)+', '+n+' byte pronti')
      +row(57,Array.from({length:n},(_,i)=>i),i=>k===1?i<w:k>=2&&i>=w)
      +reg(26,148,'RSI successivo',k>=2?hex(+answer(v,0)):'?',k===2,214)
      +flow(245,175,337,175,k===3)
      +reg(343,148,'RDX successivo',k===3?answer(v,1):'?',k===3,241)
      +bottom(k===0?'La prima write accetta '+w+' byte.':k===1?'Il prefisso evidenziato è stato emesso.':k===2?'Il secondo puntatore oltrepassa quel prefisso.':'La seconda write consegna tutti i byte residui.');
  });

  add('6/1',(v,k)=>{
    const [K]=nums(v,/K come (\d+)/),[x]=nums(v,/valuta f\((\d+)\)/);
    return title('Dalla macro C alla funzione chiamata con x = '+x)
      +reg(22,55,'testo sorgente','K * x')
      +flow(187,81,229,81,k===1)+reg(232,55,'preprocessore',k?K+' * x':'?',k===1)
      +flow(397,81,433,81,k===2)+reg(436,55,'uscita di gcc -c',k>=2?'f.o':'?',k===2)
      +on('M517 108 V133 H317 V153',k===3)+reg(216,155,'EAX · f('+x+')',k===3?answer(v,1):'?',k===3,208)
      +bottom(k===2?'f.o contiene codice rilocabile che il linker può collegare.':'K = '+K+' nel sorgente.');
  });
  add('6/2',(v,k)=>{
    const addr=hexes(v)[0],[a,d]=nums(v,/EDI=(\d+).*RDI\+(\d+)/);
    return title('Singolo passo nel debugger · LEA occupa tre byte')
      +row(64,['LEA · byte 0','byte 1','byte 2','RET'],i=>k<3?i===0:i===3)
      +reg(24,151,k===3?'RIP dopo LEA':'RIP al breakpoint',hex(k===3?addr+3:addr),k===1||k===3,182)
      +reg(236,151,'ingresso EDI',a,false,149)
      +reg(416,151,'EAX scritto',k>=2?answer(v,1):'?',k===2,182)
      +bottom(k===0?'Il simbolo f identifica il primo byte.':k===1?'Il breakpoint ferma l’esecuzione prima di LEA.':k===2?'EAX riceve '+a+' + '+d+'. RIP al passo completo è mostrato di seguito.':'Il cursore punta ora a RET.');
  });
  add('6/3',(v,k)=>{
    const [a,b]=hexes(v),aS=a|0,bS=b|0,d=aS-bS,sf=Number((d|0)<0),of=Number(d>2147483647||d< -2147483648);
    return title('Confronto signed a 32 bit · CMP EDI, ESI')
      +reg(22,46,'EDI',k?aS:hex(a,8),k===1)+reg(229,46,'ESI',k?bS:hex(b,8),k===1)
      +reg(438,46,'SF / OF',k>=2?sf+' / '+of:'? / ?',k===2)
      +on('M522 100 V124 H318 V153',k===3)
      +reg(194,156,'EAX dopo JL',k===3?answer(v,1):'?',k===3,246)
      +bottom(k===3?(sf!==of?'La disuguaglianza dei flag fa prendere il salto.':'I due flag sono uguali: si prosegue in caduta.'):'I bit dei registri sono interpretati in complemento a due.');
  });
  add('6/4',(v,k)=>{
    const [contents,idx]=group(v,/array di int32 \[([^\]]+)\] ed ESI=(\d+)/),a=contents.split(', ').map(Number),i=Number(idx);
    return title('Array int32 e chiamata a doppio(int)')
      +row(50,a,j=>k>=1&&j===i)
      +flow(22+(i+.5)*596/a.length,94,152,139,k===1)
      +reg(32,143,'EDI · argomento intero',k?a[i]:'?',k===1,218)
      +flow(254,169,363,169,k===2)+reg(367,143,'EAX · ritorno',k>=2?answer(v,1):'?',k===2,232)
      +bottom(k===0?'ESI = '+i+' · RSP in ingresso vale 8 modulo 16.':k===1?'Offset dell’elemento = '+answer(v,0)+' byte.':k===2?'SUB RSP,8 allinea il chiamante prima di CALL.':'Il chiamante libera otto byte e restituisce EAX.');
  });
  add('6/5',(v,k)=>{
    const [a,b,mul]=nums(v,/a=(\d+) e b=(\d+).*RSI\*(\d+)/);
    return title('LEA RAX,[RDI+RSI×'+mul+'] · calcolo senza accesso ai dati')
      +reg(24,48,k?'RDI':'a',a,k===1)+reg(24,147,k?'RSI':'b',b,k===1)
      +on('M190 75 H216 V122 H298',k===2)+on('M190 174 H216 V122 H298',k===2)
      +reg(302,95,'base + indice × '+mul,k>=2?answer(v,1):'?',k===2,280)
      +bottom(k===3?'RET consegna RAX al chiamante.':k===2?'RAX riceve '+a+' + '+b+' × '+mul+'.':'La convenzione assegna una sede a ogni argomento.');
  });
  add('7/1',(v,k)=>{
    const sp=hexes(v)[0],[a,b]=nums(v,/RAX=(\d+) e RBX=(\d+)/);
    const after=[sp,sp-8,sp-16,sp-8][k];
    return title('Pila di qword · gli indirizzi diminuiscono verso il basso')
      +stackRow(44,hex(sp),'cima iniziale',k===0)
      +stackRow(91,hex(sp-8),k?a:'·',k===1||k===3)
      +stackRow(138,hex(sp-16),k===2?b:'·',k===2)
      +on('M302 157 H368 V90 H411',k===3)
      +reg(412,64,'RCX',k===3?answer(v,0):'?',k===3)
      +bottom('RAX iniziale = '+a+' · RBX iniziale = '+b+' · RSP corrente = '+hex(after)+'.');
  });
  add('7/2',(v,k)=>{
    const sp=hexes(v)[0],[n,d]=nums(v,/riserva (\d+) byte.*RBP−(\d+)/),bp=sp-8;
    return title('Frame · RBP è il riferimento stabile per la locale')
      +stackRow(45,hex(sp),'ritorno',k===0)+stackRow(91,k?hex(bp):'—',k?'RBP salvato':'·',k===1)
      +stackRow(137,k>=2?hex(bp-n):'—',k>=2?'area locale':'·',k===2)
      +reg(386,44,'spazio da riservare',n+' B')
      +on('M301 110 H345 V158 H383',k===3)+reg(386,132,'dword a RBP − '+d,k===3?hex(+answer(v,1)):'?',k===3,199)
      +bottom(k===2?'RSP dopo la riserva = '+hex(+answer(v,0))+'.':k===3?'La dword inizia all’indirizzo evidenziato.':'Ogni cella salvata dal prologo occupa otto byte.');
  });
  add('7/3',(v,k)=>{
    const [a,b]=nums(v,/EDI=(\d+).*g che restituisce (\d+)/);
    return title('La locale appartiene al frame del chiamante di g')
      +stackRow(43,'0x7FF8','ritorno',k===0||k===3)
      +stackRow(87,'0x7FF0',k?'RBP salvato':'·',k===1)
      +stackRow(131,'0x7FEC',k?a:'·',k===1||k===2)
      +on('M302 151 H344 V109 H388',k===2)
      +reg(391,83,'EAX',k>=2?answer(v,0):'?',k===2,210)
      +bottom(k===0?'EDI = '+a+' · g restituisce '+b+'.':k===1?'Il prologo conserva l’argomento nella locale prima della chiamata.':k===2?'La somma legge '+a+' dalla locale e '+b+' dal ritorno di g.':'Dopo LEAVE e RET, RSP = '+hex(+answer(v,1))+'.');
  });
  add('7/4',(v,k)=>{
    const [a,b]=nums(v,/Inserisci (\d+) e poi (\d+)/),sp=hexes(v)[0];
    return title('Duplicazione della cima · qword da otto byte')
      +stackRow(53,hex(sp-8),k?a:'·',k===3)
      +stackRow(100,hex(sp-16),k===1||k===2?b:'·',k===1)
      +stackRow(147,hex(sp-24),k===2?b:'·',k===2)
      +on('M303 166 H339 V84 H389',k===3)+on('M303 119 H358 V162 H389',k===3)
      +reg(391,60,'RAX dopo POP',k===3?b:'?',k===3,201)+reg(391,139,'RBX dopo POP',k===3?b:'?',k===3,201)
      +bottom(k===3?'RAX + RBX = '+answer(v,0)+' · la cima conserva '+answer(v,1)+'.':k===2?'PUSH [RSP] legge la vecchia cima e ne crea una copia.':k===1?'Il secondo valore inserito si trova in cima.':'RSP iniziale = '+hex(sp)+' · valori da inserire: '+a+', '+b+'.');
  });
  add('7/5',(v,k)=>{
    const base=hexes(v)[0],[bx,n]=nums(v,/RBX=(\d+)\..*riserva (\d+) byte/);
    const beforeCall=base-8-n,addr=[base,beforeCall,beforeCall,base+8][k];
    return title('Due ritorni · salvataggio di RBX secondo System V AMD64')
      +stackRow(41,hex(base),'ritorno esterno',k===0||k===3)
      +stackRow(84,hex(base-8),k?'RBX = '+bx:'·',k===1)
      +stackRow(127,k?hex(beforeCall):'—',k?'base della riserva':'·',k===1)
      +stackRow(170,k>=2?hex(beforeCall-8):'—',k===2?'ritorno interno':'·',k===2)
      +reg(381,51,'RBX in ingresso',bx)+reg(381,134,'RBX recuperato',k===3?answer(v,1):'?',k===3)
      +bottom(k===2?'La CALL interna abbassa RSP di otto byte; il suo RET lo riporta a '+hex(beforeCall)+'.':'RSP '+(k===3?'dopo il ritorno esterno':'corrente')+' = '+hex(addr)+'.');
  });
  Object.assign(SL.sceneProve,scenes);
})();
