/* Disegni del modulo I. Le letture compaiono soltanto dopo il corrispondente
   passo del modello. Gli indirizzi e i pesi restano fermi durante il movimento. */
(() => {
  'use strict';
  const col = {ink:'#e4f3e8', muted:'#adceba', line:'#567a65', live:'#a4efb2', gold:'#f2c784', dark:'#10241a', active:'#234331', amber:'#40341f', stop:'#ffaaa1'};
  const E = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const at = (stages,k) => Object.fromEntries(stages[k].valori);
  const bin = (n,w=8) => n.toString(2).padStart(w,'0');
  const hx = (n,w=2) => n.toString(16).toUpperCase().padStart(w,'0');
  const byteList = raw => raw && raw !== 'vuoto' ? String(raw).split(' ') : [];
  const repeat = (n,fn) => Array.from({length:n},(_,i)=>fn(i)).join('');
  function txt(x,y,value,size=15,anchor='start',color=col.ink) {
    return '<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-family="ui-monospace, monospace" font-size="'+size+'" fill="'+color+'">'+E(value)+'</text>';
  }
  function rect(x,y,w,h,fill=col.dark,stroke=col.line,r=4) {
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.5"/>';
  }
  function line(d,colour=col.line,width=2,dash='') {
    return '<path d="'+d+'" stroke="'+colour+'" stroke-width="'+width+'" fill="none" stroke-linecap="round" stroke-linejoin="round"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
  }
  function dot(x,y,r,fill) {return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';}
  function route(d,active=false) {
    return line(d,active?col.gold:col.line,active?2.6:1.6)+(active?pulse(d):'');
  }
  function pulse(d) {
    return SL.pen.travel(d);
  }
  function box(x,y,w,h,top,value,active=false) {
    return rect(x,y,w,h,active?col.active:col.dark,active?col.live:col.line)+
      txt(x+w/2,y+17,top,12,'middle',col.muted)+txt(x+w/2,y+h-10,value,Math.min(18,(w-10)/Math.max(1,String(value).length)*1.6),'middle',active?col.live:col.ink);
  }
  function axis(x,y,w,left,right) {
    return line('M'+x+' '+(y-5)+'v10m0 -5h'+w+'m0 -5v10')+txt(x,y+21,left,12,'start',col.muted)+txt(x+w,y+21,right,12,'end',col.muted);
  }
  function pointer(x,y,colour=col.gold) {
    return '<path d="M'+(x-5)+' '+(y-9)+'h10l-5 8Z" fill="'+colour+'"/>';
  }
  function heading(s){return txt(22,25,s,14,'start',col.muted);}
  // Nastri a celle. La loro posizione rappresenta un offset o un peso preciso.
  function strip(values,x,y,w,opts={}) {
    if(!values.length)return rect(x,y,w,33)+txt(x+w/2,y+22,'vuoto',14,'middle',col.muted);
    const pitch=w/values.length;
    return values.map((v,i)=>{
      const hot=opts.active?.(i),done=opts.done?.(i);
      return rect(x+i*pitch,y,pitch-3,34,hot?col.amber:done?col.active:col.dark,hot?col.gold:done?col.live:col.line)+
        txt(x+(i+.5)*pitch-1,y+23,v,Math.min(16,(pitch-7)/Math.max(1,String(v).length)*1.55),'middle',hot?col.gold:col.ink)+
        (opts.labels?txt(x+(i+.5)*pitch-1,y+51,opts.labels[i]??'',12,'middle',col.muted):'');
    }).join('');
  }
  function bits(value,x,y,w,opts={}) {return strip(Array.from(value),x,y,w,opts);}
  function cap(x,y,value){return txt(x,y,value,13,'start',col.muted);}
  function bracket(x1,x2,y,label) {
    const half=String(label).length*3.8;
    const middle=Math.max(half+5,Math.min(635-half,(x1+x2)/2));
    return line('M'+x1+' '+(y-5)+'v5h'+(x2-x1)+'v-5',col.gold)+txt(middle,y+18,label,12,'middle',col.gold);
  }
  const scenes={};

  scenes['1.1.1']=(p,s,k)=>{
    const data=k?byteList(at(s,1)['Byte esadecimali']):[];
    let g=heading('Il cammino di stdout')+box(22,45,150,65,'programma C','puts("'+p.parola+'")',k===0)
      +cap(225,54,'flusso di libreria')+rect(220,65,390,49)+
      (k?strip(data,229,72,370,{active:i=>i===data.length-1}):txt(415,94,'buffer in attesa',15,'middle',col.muted))+
      route('M174 80 H216',k===1)+box(244,164,130,59,'kernel','fd 1',k===2)+
      box(441,164,171,59,'destinazione',k===2?p.uscita:'?',k===2);
    return g+route('M315 116 V160',k===2)+route('M378 192 H436',k===2);
  };
  scenes['1.1.2']=(p,s,k)=>{
    const data=k?byteList(at(s,1)['Memoria da 0x1000']):Array(4).fill('··');
    return heading('Lettura di un byte')+box(20,68,146,70,'unità indirizzi','0x1000 + '+p.offset,k===0)+
      route('M169 88 H265 V61 H320',k===1)+cap(202,80,'indirizzo')+
      strip(data,327,44,290,{labels:data.map((_,i)=>'+'+i),active:i=>k>0&&i===p.offset})+
      cap(328,127,'RAM · base 0x1000')+route('M'+(362+72.5*p.offset)+' 102 V174 H162',k===2)+
      box(20,159,140,57,'registro CPU',k===2?at(s,2)['Byte letto']:'··',k===2)+cap(290,198,'dato restituito');
  };
  scenes['1.1.3']=(p,s,k)=>{
    const files=['hello.c','hello.i','hello.s','hello.o','hello'],last=['E','S','c','link'].indexOf(p.modo)+1;
    const names=['sorgente','preprocessore','compilatore','assemblatore','collegatore'],i=Math.min(k,last);
    let g=heading('Catena di traduzione · GCC')+cap(25,63,'Ogni foglio rappresenta la forma disponibile dopo una fase.');
    for(let n=0;n<5;n++){
      const x=27+n*123,top=90;
      g+=line('M'+x+' '+top+' h65 l14 14 v58 h-79 Z M'+(x+65)+' '+top+' v14 h14',n===i?col.gold:n<=i?col.live:col.line);
      g+=txt(x+40,top+43,n<=i?files[n]:'··',14,'middle',n<=i?col.ink:col.muted);
      g+=txt(x+40,186,names[n],12,'middle',col.muted);
      if(n<4)g+=route('M'+(x+84)+' 125 H'+(x+117),k===n+1&&k<=last);
    }
    return g+txt(24,224,k===s.length-1?'File conservato dal comando: '+at(s,k)['File da esaminare']:'Opzione selezionata: '+({E:'−E',S:'−S',c:'−c',link:'costruzione completa'}[p.modo]),15);
  };
  scenes['1.1.4']=(p,s,k)=>{
    const current=k?at(s,k)['Percorso raggiunto']:at(s,0)['Punto di partenza'];
    const components=current.split('/').filter(Boolean),tokens=p.path.split('/').filter(Boolean);
    let g=heading('Attraversamento delle directory')+strip(tokens,22,47,596,{active:i=>k&&i===k-1,done:i=>i<k-1})+
      cap(22,113,'Cammino raggiunto');
    const nodes=['/',...components],pitch=Math.min(100,580/nodes.length);
    nodes.forEach((name,i)=>{
      const x=27+i*pitch;
      g+=rect(x,136,pitch-8,43,i===nodes.length-1?col.active:col.dark)+txt(x+(pitch-8)/2,163,name,14,'middle');
      if(i)g+=route('M'+(x-8)+' 158 H'+(x-1),i===nodes.length-1&&k>0);
    });
    return g+txt(24,222,current,17);
  };
  scenes['1.1.5']=(p,s,k)=>{
    return heading('Una corsia per PID')+cap(22,63,'shell · 700')+cap(22,161,'figlio · '+p.pid)+
      line('M141 57 H595',col.live)+line('M150 57 L212 154 H490',col.line)+
      dot(150,57,5,col.gold)+txt(147,94,'fork',14)+dot(213,154,5,col.live)+
      txt(228,180,k?'immagine hello':'copia della shell',14)+
      (k>=1?route('M222 154 H382',k===1):'')+
      (k===2?route('M490 154 Q550 154 575 57',true)+txt(461,110,'waitpid',13):'')+
      txt(25,224,k===2?'PID raccolto '+p.pid+' · codice '+at(s,k).Codice:'Ritorno nel padre: '+p.pid+'    Ritorno nel figlio: 0',15);
  };
  scenes['1.1.6']=(p,s,k)=>{
    const mem=k===2?byteList(at(s,2)['File esito']):p.modo==='scrivi'?[]:['58','0A'];
    return heading('Scrittura dal descrittore 1')+box(22,53,130,62,'processo','hello',k===1)+
      box(218,53,120,62,'uscita','fd 1',k===0)+route('M156 84 H214',k===1)+
      box(446,48,165,55,'dispositivo','terminale',p.modo==='term')+
      route(p.modo==='term'?'M342 84 L442 76':'M342 84 V135 H495 V157',k===1)+
      cap(23,144,'File esito · indirizzi crescenti')+strip(mem,23,163,590,{})+
      txt(23,228,k===0?(p.modo==='scrivi'?'Apertura con troncamento':p.modo==='appendi'?'Apertura in append':'stdout collegato al terminale'):k===1?'La richiesta contiene 6 byte.':'Contenuto finale: '+mem.length+' byte',14);
  };

  scenes['1.2.1']=(p,s,k)=>{
    const x=n=>35+n/3300*570;
    let g=heading('Caratteristica del ricevitore')+axis(35,159,570,'0 mV','3300 mV');
    if(k){g+=rect(35,106,x(800)-35,42,col.active)+rect(x(800),106,x(2000)-x(800),42,col.dark)+rect(x(2000),106,x(3300)-x(2000),42,col.active)+
      txt((35+x(800))/2,132,'basso',14,'middle')+txt((x(800)+x(2000))/2,132,'indeterminato',14,'middle')+txt((x(2000)+605)/2,132,'alto',14,'middle')+
      txt(x(800),186,'800',12,'middle')+txt(x(2000),186,'2000',12,'middle');}
    return g+pointer(x(p.mv),104)+txt(Math.min(560,Math.max(70,x(p.mv))),77,p.mv+' mV',18,'middle',col.gold)+
      txt(24,226,k===2?'Esito della decodifica: '+at(s,k).Livello:'La freccia indica la tensione applicata.',15);
  };
  scenes['1.2.2']=(p,s,k)=>{
    const labels=Array.from({length:8},(_,i)=>k?2**(7-i):'k = '+(7-i));
    return heading('Posizioni e pesi di un byte')+bits(bin(2**p.k),23,65,598,{labels,active:i=>i===7-p.k})+
      bracket(25,317,137,'cifra esadecimale alta')+bracket(322,616,137,'cifra esadecimale bassa')+
      box(27,176,270,53,'peso della posizione',k?at(s,1).Peso:'?',k===1)+box(338,176,274,53,'scrittura esadecimale',k===2?at(s,2).Esadecimale:'?',k===2);
  };
  scenes['1.2.3']=(p,s,k)=>{
    const a=p.word.match(/../g),le=p.ordine==='little-endian';
    let g=heading('Parola a 32 bit · byte 0 di peso minore')+cap(24,145,'Memoria · indirizzi crescenti');
    for(let j=0;j<4;j++){
      const src=le?3-j:j,from=92+src*151,to=92+j*151;
      if(k){
        const write='M'+from+' 88 C'+from+' 124 '+to+' 111 '+to+' 157';
        const read='M'+to+' 157 C'+to+' 111 '+from+' 124 '+from+' 88';
        g+=route(k===1?write:read,true);
      }
      g+=box(25+j*151,37,134,54,'byte '+(3-j),a[j])+box(25+j*151,156,134,54,'0x100'+j,k?s[1].valori[j][1]:'··',k>0);
    }
    return g+txt(24,235,k===2?'Rilettura: '+at(s,k)['Parola ricostruita']:p.ordine,15);
  };
  scenes['1.2.4']=(p,s,k)=>heading('Una cella, due interpretazioni')+
    bits(bin(p.v),22,46,596,{done:i=>bin(p.v)[i]==='1'})+
    route('M313 82 V105 H161 V138',k===1)+route('M313 82 V104 H477 V138',k===2)+
    box(28,140,264,74,'somma dei pesi',k>=1?at(s,1).Valore:'?',k===1)+box(341,140,269,74,'indice nella tabella ASCII',k===2?at(s,2).Carattere:'?',k===2);
  scenes['1.3.1']=(p,s,k)=>{
    const ten=Array.from('0123456789');
    return heading('Le cifre nella tabella ASCII')+strip(ten,24,60,594,{active:i=>i===p.n,labels:ten.map((_,i)=>'0x'+hx(48+i))})+
      (k===2?bracket(52,52+p.n*59.4,126,p.n+' intervalli'):line('M52 127 H590',col.line))+
      box(26,171,260,59,'codice del carattere',k?at(s,1).Intero:'0x'+hx(48+p.n),k===1)+
      box(337,171,273,59,'valore della cifra',k===2?at(s,2).Risultato:'?',k===2);
  };
  scenes['1.3.2']=(p,s,k)=>{
    const octets=byteList(at(s,0).Ottetti);let g=heading('UTF-8 · prefisso e bit utili');
    octets.forEach((v,i)=>{
      const x=24+i*149,b=bin(parseInt(v,16)),prefix=i?2:octets.length===1?1:octets.length+1;
      g+=txt(x,62,'0x'+v,14)+rect(x,73,prefix*16,39,col.dark,col.line)+rect(x+prefix*16,73,(8-prefix)*16,39,i<k?col.active:col.dark,i<k?col.live:col.line);
      g+=repeat(8,j=>txt(x+8+j*16,99,b[j],15,'middle',j<prefix?col.muted:col.ink));
      if(i===k-1)g+=route('M'+(x+66)+' 116 V137 H322 V157',true);
    });
    const v=at(s,k);return g+box(117,157,407,65,k===s.length-1?'carattere decodificato':'accumulatore',k===s.length-1?v['Punto di codice']+' · '+p.lettera:k?v.Accumulatore:'?',k>0);
  };
  scenes['1.3.3']=(p,s,k)=>{
    const n=+p.bit/8;let g=heading('PCM · una colonna per istante');
    const height=Math.min(22,130/p.canali);
    for(let c=0;c<p.canali;c++){const y=52+c*height;g+=txt(25,y+height*.78,'C'+(c+1),12); for(let i=0;i<6;i++)g+=rect(66+i*52,y,47,height-2,(i===0&&(k>=1||c===0))?col.active:col.dark);}
    g+=box(404,55,207,62,'singolo campione',n+' B',k===0)+box(404,134,207,62,'un istante',k>=1?at(s,1)['Byte per istante']+' B':'?',k===1);
    return g+txt(25,224,k===2?p.hz+' istanti × '+(p.canali*n)+' B = '+at(s,k).Dimensione:'Larghezza del campione: '+p.bit+' bit',15);
  };
  scenes['1.3.4']=(p,s,k)=>{
    const step=59,x=28,vals=[hx(p.n),...Array(8).fill('·')];
    let g=heading('Campo delimitato da una lunghezza')+strip(vals,x,74,step*9,{active:i=>i===0,done:i=>k>0&&i>0&&i<=p.presenti,labels:vals.map((_,i)=>'+'+i)})+
      line('M'+(x+step*(p.presenti+1)-1)+' 61 v76',col.stop,3);
    if(k>=1)g+=bracket(x+step,x+(1+p.n)*step,145,p.n+' byte dichiarati');
    const cur=k===2?at(s,k)['Cursore finale']:1;g+=pointer(x+step*cur,70);
    return g+txt(24,220,k===2?'Cursore = '+cur+' · byte mancanti = '+at(s,k)['Byte mancanti']:'La tacca verticale indica la fine dei byte ricevuti.',14);
  };
  scenes['1.3.5']=(p,s,k)=>{
    const mem=byteList(at(s,0).Memoria),ok=p.pos+2<=mem.length;
    let g=heading('Lettore di parole da due byte')+strip(mem,45,61,548,{labels:mem.map((_,i)=>'offset '+i),active:i=>k>=1&&i>=p.pos&&i<p.pos+2});
    g+=pointer(110+137*p.pos,57);if(k===2&&ok){const hi=p.ord==='big-endian'?p.pos:p.pos+1,lo=p.ord==='big-endian'?p.pos+1:p.pos;
      g+=route('M'+(110+137*hi)+' 119 L173 150',true)+route('M'+(110+137*lo)+' 119 L446 150',true)+
        box(39,153,266,50,'peso 256','0x'+mem[hi])+box(336,153,266,50,'peso 1','0x'+mem[lo]);}
    return g+txt(24,234,k===2?'Intero: '+at(s,k).Intero+' · cursore: '+at(s,k)['Cursore finale']:'Ordine previsto: '+p.ord,15);
  };

  function numberLine(x,y,w,min,max,mark,rangeLabel) {
    let g=axis(x,y,w,min,max);
    if(mark!==null){
      const f=(mark-min)/(max-min),spot=x+w*Math.max(0,Math.min(1,f));
      g+=dot(spot,y,5,col.gold)+txt(Math.max(x+30,Math.min(x+w-30,spot)),y-13,String(mark),15,'middle',col.gold);
    }
    return g+txt(x,y+37,rangeLabel,12,'start',col.muted);
  }
  scenes['1.4.1']=(p,s,k)=>{
    const a=at(s,0),word=a.Parola;
    return heading('Lo stesso byte su due scale')+bits(word,25,45,590,{active:i=>i===0})+
      numberLine(35,160,250,0,255,k>=1?at(s,1).Valore:null,'lettura senza segno')+
      numberLine(359,160,245,-128,127,k>=2?at(s,2).Valore:null,'lettura in complemento a due')+
      (k?route(k===1?'M62 83 Q60 118 154 127':'M62 83 Q230 113 465 126',true):'')+
      txt(26,235,'Bit 7 = '+p.alto+' · sette bit bassi = '+p.bassi,15);
  };
  scenes['1.4.2']=(p,s,k)=>{
    const op=p.op==='somma'?'+':'−',raw=k?at(s,1)['Risultato matematico']:null,sv=k===2?at(s,2)['Risultato matematico']:null;
    let g=heading('Operazione in un registro di otto bit')+txt(26,63,'0x'+hx(p.a)+' '+op+' 0x'+hx(p.b),20)+
      (k?box(301,40,141,53,'CF',at(s,1).CF,!!at(s,1).CF):'')+
      (k===2?box(454,40,141,53,'OF',at(s,2).OF,!!at(s,2).OF):'');
    function interval(y,lo,hi,val,title){
      const from=-256,to=510,x=n=>36+(n-from)/(to-from)*565;
      let row=cap(26,y-17,title)+line('M36 '+y+' H601',col.line)+line('M'+x(lo)+' '+y+' H'+x(hi),col.live,6)+
        txt(x(lo),y+19,lo,12,'middle')+txt(x(hi),y+19,hi,12,'middle');
      if(val!==null)row+=pointer(x(val),y-3)+txt(Math.max(60,Math.min(578,x(val))),y-17,val,14,'middle',col.gold);
      return row;
    }
    return g+interval(125,0,255,raw,'senza segno')+interval(189,-128,127,sv,'con segno')+
      txt(24,234,k===2?'Byte conservato: '+at(s,2)['Byte scritto']:'Il tratto spesso indica l’intervallo rappresentabile.',14);
  };
  scenes['1.4.3']=(p,s,k)=>{
    const st=at(s,k);
    return heading('Conversioni usuali del C · int e unsigned int a 32 bit')+
      box(27,53,198,55,'int',p.a,k===0)+box(27,144,198,55,'unsigned int',p.b+'u',k===0)+
      route('M229 82 H277',k===1)+box(279,53,234,55,'primo operando in unsigned',k?at(s,1)['Primo operando convertito']:'?',k===1)+
      route('M397 110 V143 H522',k===2)+route('M227 171 H524',k===2)+box(526,128,88,65,'test <',k===2?st['Esito C']:'?',k===2)+
      txt(26,234,k===2?'Esito leggendo invece i valori matematici iniziali: '+st['Confronto matematico iniziale']:'Per convertire il primo operando si usa il modulo 2³².',14);
  };
  scenes['1.4.4']=(p,s,k)=>{
    const lim=k?at(s,1)['Massimo primo fattore']:null,x=v=>37+562*v/255;
    return heading('Controllo preliminare · prodotto A × B su un byte')+cap(26,66,'B = '+p.b+'     A = '+p.a)+
      (k?line('M37 111 H'+x(lim),col.live,9):'')+axis(37,111,562,0,255)+pointer(x(p.a),107)+
      (k?txt(27,169,p.b?'A ammesso fino a ⌊255 / '+p.b+'⌋ = '+lim:'Il fattore zero ammette ogni valore di A.',16):'')+
      txt(27,218,k===2?'Prodotto esatto '+at(s,2)['Prodotto esatto']+' · residuo su otto bit '+at(s,2)['Residuo modulo 256']:'Il triangolo rappresenta A sulla scala dei possibili byte.',14);
  };

  function gate(x,y,name,active=false) {
    const c=active?col.gold:col.line;
    const outline=name==='AND'||name==='NAND'?'M0 0 H36 C93 0 93 66 36 66 H0 Z':
      'M0 0 Q45 0 82 33 Q48 66 0 66 Q21 33 0 0 Z';
    const neg=name==='NAND'||name==='NOR';
    return '<g transform="translate('+x+' '+y+')">'+line(outline,c,2.4)+(name==='XOR'?line('M-8 0 Q13 33 -8 66',c):'')+
      (neg?'<circle cx="84" cy="33" r="5" fill="'+col.dark+'" stroke="'+c+'"/>':'')+
      txt(37,38,name,13,'middle',c)+'</g>';
  }
  scenes['1.5.1']=(p,s,k)=>{
    const idx=2*p.a+p.b,ys=k?at(s,1)['Colonna di uscita'].split(' '):[];
    let g=heading('Ingressi, riga e porta '+p.porta)+cap(34,58,'A   B   uscita');
    for(let i=0;i<4;i++){const y=71+36*i;g+=rect(25,y,179,32,i===idx?col.active:col.dark,i===idx?col.live:col.line)+
      txt(39,y+22,(i>>1)+'   '+(i&1)+'     '+(k?ys[i]:'·'),15);}
    return g+txt(263,108,'A = '+p.a,15)+txt(263,171,'B = '+p.b,15)+
      route('M321 103 H356 V113 H395',k===1)+route('M321 167 H357 V145 H395',k===1)+gate(397,95,p.porta,k>0)+
      route('M490 128 H551',k===2)+txt(562,135,k===2?at(s,2).Uscita:'?',23,'start',col.gold);
  };
  scenes['1.5.2']=(p,s,k)=>{
    const ys=[p.r0,p.r1,p.r2,p.r3],terms=['¬A · ¬B','¬A · B','A · ¬B','A · B'];
    let g=heading('Realizzazione come OR di mintermini')+gate(442,94,'OR',k===2);
    ys.forEach((v,i)=>{const y=57+43*i;g+=txt(30,y+17,bin(i,2)+' → '+v,15)+
      rect(134,y-4,155,32,v&&k?col.active:col.dark)+txt(211,y+17,k&&v?terms[i]:'·',15,'middle')+
      (v&&k?route('M292 '+(y+11)+' H340 L445 '+(108+12*i),k===2):'');});
    g+=line('M525 127 H560')+txt(571,133,k===2&&ys.every(v=>!v)?'0':'F',18);
    return g+txt(24,238,k===2?'Righe vere: '+at(s,2)['Righe vere']:'Ogni ramo riconosce una sola combinazione.',14);
  };
  scenes['1.5.3']=(p,s,k)=>{
    let g=heading('AND bit a bit e AND logico')+cap(25,57,'posizioni allineate')+cap(377,57,'verità degli operandi')+
      bits(bin(p.a,4),29,72,260)+bits(bin(p.b,4),29,115,260)+
      box(377,72,100,59,'A ≠ 0',k===2?(p.a?'vero':'falso'):'?',k===2)+box(491,72,120,59,'B valutato',k===2?at(s,2)['B valutato']:'?',k===2);
    return g+line('M26 160 H293')+bits(k?at(s,1)['Bit risultanti']:'····',29,170,260,{done:()=>k>=1})+
      route('M433 137 V164 H508',k===2)+box(381,170,227,53,'A && B',k===2?at(s,2)['A && B']:'?',k===2);
  };
  scenes['1.5.4']=(p,s,k)=>{
    const max=Math.max(p.diretto,p.inverso)+1;
    const last=k===s.length-1,t=last?max:k?Number(s[k].titolo.match(/\d+/)[0]):0;
    const x=n=>133+(n+1)*449/(max+1);
    let g=heading('Cronogramma · modello a ritardi di trasporto');
    [['A',v=>v<0],['diretto',v=>v<p.diretto],['invertito',v=>v>=p.inverso],['uscita OR',v=>v<p.diretto||v>=p.inverso]].forEach(([name,level],r)=>{
      const y=64+r*40;g+=txt(21,y+4,name,14)+line('M133 '+y+' H590',col.line,1,'3 5');
      let d='M133 '+(y-(level(-1)?16:0));
      const events=[...new Set([0,p.diretto,p.inverso,t])].filter(v=>v<=t).sort((a,b)=>a-b);
      for(const v of events)d+=' H'+x(v)+' V'+(y-(level(v)?16:0));g+=line(d,r===3?col.gold:col.live,3);
    });
    return g+line('M'+x(t)+' 36 V199',col.gold,1.3,'3 3')+txt(25,232,last?'Durata bassa: '+at(s,k)['Durata bassa']:'Cursore t = '+t+' ns',16);
  };
  scenes['1.5.5']=(p,s,k)=>{
    const v0=at(s,0),v1=k?at(s,1):{};
    return heading('Sommatore completo · pesi delle due uscite')+
      txt(24,73,'A '+p.a+'     B '+p.b,19)+
      route('M92 78 L192 92',k===0)+route('M91 82 L192 171',k===0)+
      box(194,58,142,60,'P = A XOR B',v0['P = A XOR B'],k===0)+box(194,142,142,60,'G = A AND B',v0['G = A AND B'],k===0)+
      txt(24,159,'Cin '+p.c,18)+route('M341 90 H453',k===1)+route('M341 175 H453',k===1)+
      box(457,58,155,60,'S · peso uno',k?v1.S:'?',k===1)+box(457,142,155,60,'Cout · peso due',k?v1.Cout:'?',k===1)+
      txt(25,237,k===2?'Controllo: '+p.a+' + '+p.b+' + '+p.c+' = '+v1.S+' + 2 × '+v1.Cout:'S combina P e Cin. Cout raccoglie generazione e propagazione.',14);
  };
  scenes['1.5.6']=(p,s,k)=>{
    const v=at(s,k),present=k?at(s,1)['Stato & maschera']:'········';
    let g=heading('Richiesta di tutti i bit della maschera');
    [['stato',bin(p.stato)],['maschera',bin(p.maschera)],['presenti',present],['mancanti',k===2?v['Bit mancanti']:'········']].forEach(([tag,w],r)=>{
      const y=43+45*r;g+=txt(24,y+23,tag,15)+bits(w,144,y,460,{active:i=>w[i]==='1'});});
    return g+txt(24,239,k===2?'Richiesta soddisfatta: '+v['Tutti presenti']:'Il bit 0 si trova all’estrema destra.',14);
  };

  scenes['1.6.1']=(p,s,k)=>{
    const count=Math.min(k,3),digits=Array.from({length:3},(_,i)=>i<count?at(s,i+1).Cifra:'?');
    return heading('Tre posizioni dopo la virgola binaria')+strip(Array.from({length:8},(_,i)=>i<p.n?'●':'·'),24,46,592,{done:i=>i<p.n})+
      cap(24,106,p.n+' ottavi di una unità')+
      digits.map((d,i)=>box(36+i*202,135,160,62,'peso 1/'+(2**(i+1)),d,i<count)).join('')+
      txt(24,235,k===s.length-1?'Somma dei pesi: '+at(s,k).Pesi:'A ogni raddoppio del resto si estrae una cifra.',15);
  };
  scenes['1.6.2']=(p,s,k)=>{
    const v=at(s,0),final=k===2?at(s,k).Risultato:'?';
    const segments=[['segno',bin(v.S,1),1],['esponente',bin(v.E,8),8],['frazione',bin(v.F,23),23]];
    let x=24,g=heading('binary32 · 32 posizioni');
    for(const [tag,value,n] of segments){const width=n*17.5;g+=rect(x,58,width-1,39,tag==='esponente'&&k?col.amber:col.active)+txt(x+(width-1)/2,84,value,15,'middle');
      g+=txt(x,120,tag==='segno'?'S':tag,12);x+=width;}
    return g+box(26,151,245,65,'classe',k?at(s,1).Classe:'?',k===1)+route('M275 184 H323',k===2)+
      box(328,151,283,65,'valore',final,k===2);
  };
  scenes['1.6.3']=(p,s,k)=>{
    const v=at(s,0),n=k?at(s,1):{};
    let g=heading('Due parole binary32 consecutive')+cap(25,61,'Parole positive nell’intervallo che inizia a 2^'+p.e)+
      line('M46 132 H600',col.line,3)+dot(148,132,6,col.live)+txt(148,105,v.Parola,17,'middle');
    if(k)g+=dot(463,132,6,col.live)+txt(463,105,n['Parola successiva'],17,'middle')+route('M157 131 H451',k===1);
    if(k===2)g+=bracket(148,463,155,'ampiezza di una ULP = 2^('+at(s,k)['Esponente del passo']+')');
    return g+txt(26,230,k===2?'Distanza esatta: '+at(s,k).Distanza:'Lente locale sulla retta dei valori rappresentabili.',15);
  };
  scenes['1.6.4']=(p,s,k)=>{
    const x=i=>73+i*20;
    let g=heading('Allineamento di due significande · esponente comune zero')+
      cap(24,57,'Operando')+cap(460,57,'limite di precisione');
    for(const [row,label] of [[0,'A'],[1,'B']]){
      const y=71+row*48;
      g+=txt(25,y+23,label,17);
      for(let i=0;i<=26;i++){
        // Prima dell’allineamento ciascuna significanda vale 1 nel proprio esponente.
        const on=i===(row&&k?p.k:0);
        g+=rect(x(i),y,18,31,i>23?col.amber:col.dark,on?col.live:col.line,2)
          +txt(x(i)+9,y+21,on?'1':'·',13,'middle');
      }
    }
    g+=line('M'+(x(24)-2)+' 62 V159',col.gold,2);
    if(k===1&&p.k){const d='M'+(x(0)+9)+' 157 H'+(x(p.k)+9);g+=route(d,true);}
    const note=k===0?'Prima dell’allineamento A ha esponente 0 e B ha esponente −'+p.k+'.':
      p.k===0?'I due bit di peso 1 sommano a 2. Il risultato si rinormalizza.':
      'Il contributo B si allinea al peso 2^(−'+p.k+').';
    return g+txt(24,188,note,14)+txt(24,228,k===2?'binary32: '+at(s,k).Risultato+' · '+at(s,k).Parola:'La tacca precede i bit oltre le 24 cifre di precisione.',14);
  };

  const recordLabels=['firma','flag','n','nome','°C','volt'];
  function recordTape(data,n,offset,requested,available=data.length) {
    // Il nome ha lunghezza variabile in byte. Conserviamo il posto per i byte
    // persi, così la tacca di troncamento e gli offset restano confrontabili.
    const widths=[4,1,1,n,2,4],expected=12+n,cells=Math.max(expected,data.length),pitch=596/cells;
    let g='',pos=0;
    widths.forEach((len,i)=>{
      const x=22+pitch*pos,w=len*pitch;
      g+=txt(x+w/2,61,recordLabels[i],Math.min(13,w*.27+2),'middle',col.muted);
      g+=line('M'+(x+1)+' 66 h'+Math.max(1,w-3),col.line);
      pos+=len;
    });
    for(let i=0;i<cells;i++){
      const x=22+pitch*i,hot=i>=offset&&i<offset+requested,missing=i>=available;
      g+=rect(x,76,pitch-2,38,hot?col.amber:missing?'none':col.dark,missing?col.stop:hot?col.gold:col.line,3)+
        txt(x+(pitch-2)/2,101,missing?'×':data[i],14,'middle',missing?col.stop:col.ink)+
        txt(x+(pitch-2)/2,133,i,11,'middle',col.muted);
    }
    if(offset>=0){const end=Math.min(offset+requested,cells);g+=bracket(22+pitch*offset,22+pitch*end-2,148,'offset '+offset+' · '+requested+' byte');}
    return g;
  }
  scenes['1.7.1']=(p,s,k)=>{
    const a=byteList(at(s,0).Buffer),v=at(s,k),final=k===s.length-1;
    const prior=final?at(s,k-1):v;
    const start=prior.Offset??prior.Cursore??-1,span=prior.Richiesti??byteList(prior.Byte).length;
    return heading('TLM1 · lettura limitata ai byte ricevuti')+recordTape(a,3,start,span,p.n)+
      txt(24,205,final?v.Esito:k===0?'Disponibili: '+p.n+' byte':s[k].titolo,17)+
      txt(24,231,final?'Cursore finale: '+v['Cursore finale']:v['Cursore successivo']!==undefined?'Cursore successivo: '+v['Cursore successivo']:'La croce indica un byte assente dal buffer.',13,'start',col.muted);
  };
  scenes['1.7.2']=(p,s,k)=>{
    const f=at(s,0),n=f['Lunghezza del nome'],prefix=byteList(f['Firma e prefisso']),name=byteList(f.Nome);
    const a=[...prefix,...name,...(k>=1?byteList(at(s,1).Byte):['··','··']),...(k>=2?byteList(at(s,2).Byte):['··','··','··','··'])];
    const v=at(s,k),start=[6,6+n,8+n][k],length=[n,2,4][k];
    return heading('Il formato del campo decide come leggere i byte')+recordTape(a,n,start,length)+
      txt(24,209,k===0?'Nome UTF-8: '+p.nome+' · '+n+' byte':k===1?'int16 big-endian → '+v.Temperatura:'binary32 little-endian → '+v.Tensione,17)+
      txt(24,232,'I numeri sotto le celle sono offset in byte dall’inizio del record.',13,'start',col.muted);
  };
  scenes['1.7.3']=(p,s,k)=>{
    const px=at(s,0).Pixel.toString(),v=at(s,k);
    let g=heading('Buffer RGBA · dimensioni dichiarate e controlli')+
      rect(45,78,132,99,col.dark,col.live)+repeat(4,i=>line('M'+(52+i*32)+' 81 v90',col.line,1))+
      repeat(3,i=>line('M49 '+(85+i*30)+' h124',col.line,1))+
      txt(111,65,p.w+' px',14,'middle')+txt(111,201,p.h+' px in altezza',13,'middle')+
      route('M181 124 H224',k===1)+box(226,84,160,70,'quattro byte/pixel',k?at(s,1)['Byte esatti']:'?',k===1);
    g+=route('M389 120 L425 79',k===2)+route('M389 120 L426 174',k===2)+
      box(427,45,181,64,'capacità di uint32',k===2?v['Rappresentabile su 32 bit']:'?',k===2)+
      box(427,144,181,64,'budget '+p.mib+' MiB',k===2?(BigInt(v['Budget in byte'])>=BigInt(at(s,1)['Byte esatti'])?'sufficiente':'insufficiente'):'?',k===2);
    return g+txt(22,237,k===2?'Allocazione consentita: '+v['Allocazione consentita']:'Numero di pixel: '+px,14);
  };
  scenes['1.7.4']=(p,s,k)=>{
    const flags=at(s,0),v=at(s,k);let g=heading('Byte di autorizzazione · filtro strutturale e decisione')+
      bits(flags.Bit,24,53,590,{labels:['ris.','ris.','ris.','A','O','—','W','—'],active:i=>i<3&&k===1||[3,4,6].includes(i)&&k===2});
    g+=box(20,137,176,59,'bit riservati a zero',k?at(s,1)['Parola valida']:'?',k===1)+
      route('M201 166 H219',k===2&&!p.r)+box(223,137,177,59,'W AND (O OR A)',k>=2?at(s,2)['W AND (O OR A)']:'?',k===2)+
      route('M405 166 H425',k===3)+box(429,137,184,59,'richiesta',k===3?v.Modifica:'?',k===3);
    return g+txt(24,233,k>=1&&p.r?'Il bit 7 attivo è già sufficiente a rifiutare la parola.':'La decisione richiede validità, ruolo ammesso e scrittura.',14);
  };
  scenes['1.7.5']=(p,s,k)=>{
    const count=Math.min(k,p.n),final=k===s.length-1;
    let first=0;
    for(let i=1;i<=count;i++){
      if(Number.parseFloat(at(s,i)['Totale binary64'])!==i*p.quota/100){first=i;break;}
    }
    const w=565/p.n;let g=heading('Addizioni ripetute · un segmento per quota')+cap(23,62,'quota '+p.quota+' cent');
    for(let i=0;i<p.n;i++)g+=rect(28+i*w,78,w-3,36,i<count?col.active:col.dark,i===count-1?col.gold:col.line);
    if(first)g+=dot(28+(first-.5)*w,121,4,col.gold)+txt(28,137,'Primo scarto fra le due letture in euro: addizione '+first,12,'start',col.gold);
    const v=count?at(s,count):null;
    g+=box(24,143,249,62,'accumulatore intero',v?v['Totale intero']:'0 cent',count>0)+box(288,143,326,62,'accumulatore binary64',v?v['Totale binary64']:'0 €',count>0);
    return g+txt(24,235,final?'Scarto rispetto alla conversione finale: '+at(s,k)['Differenza tra i due binary64']:'Quote accumulate: '+count+' su '+p.n,14);
  };
  scenes['1.7.6']=(p,s,k)=>{
    const missing=p.file==='manca',empty=p.file==='vuoto',v=at(s,k);
    let g=heading('Redirezione in lettura · leggi < file')+box(22,53,163,62,'origine',({valido:'TLM1',errato:'XLM1',vuoto:'file vuoto',manca:'inesistente'})[p.file],k===0)+
      route('M188 86 H242',k===1&&!missing)+box(248,53,128,62,'lettore','fd 0',k===1&&!missing)+
      route('M380 86 H444',k===2&&!missing)+box(452,53,155,62,'read',k===2?(missing?'—':empty?'0 byte':'4 byte'):'?',k===2);
    if(k===2&&!missing&&!empty)g+=strip([p.file==='valido'?'54':'58','4C','4D','31'],59,145,516,{labels:[0,1,2,3],active:i=>i===0});
    return g+txt(24,226,k===2?v.Esito:k===0?'Apertura del file: '+v.Apertura:'Processo lettore avviato: '+v['Programma avviato'],16);
  };
  scenes['1.7.7']=(p,s,k)=>{
    const original=byteList(at(s,0).Originale),copy=k?byteList(at(s,1).Copia):original;
    const n=Number.parseInt(original[5],16),diff=copy.findIndex((v,i)=>v!==original[i]);
    const offset=diff!==-1?diff:copy.length<original.length?copy.length:-1;
    let g=heading(k?'Copia ricevuta · confronto byte per byte':'Record originale · valori da codificare')+recordTape(copy,n,k?offset:-1,k&&offset>=0?1:0);
    if(k===0)g+=txt(24,211,'Nome '+p.nome+' · −1,23 °C · 10 V',16);
    if(k===1)g+=txt(24,211,offset<0?'Le due sequenze di byte coincidono.':'Prima differenza rispetto all’originale: offset '+offset+'.',16);
    if(k===2){const v=at(s,k);g+=txt(24,211,v.Esito?'Decodifica interrotta: '+v.Esito:'Campi recuperati: '+v.Nome+' · '+v.Temperatura+' · '+v.Tensione,16);}
    return g;
  };

  // Il percorso integrato riusa il codec TLM1 verificato in 1.7.7. A ogni
  // arresto valgono solo le informazioni che il lettore ha acquisito fin lì.
  function moduloCalcola(p) {
    const prova=SL.unita['1.7.7'].calcola(p),orig=byteList(at(prova,0).Originale),dati=byteList(at(prova,1).Copia);
    const decoded=at(prova,2),n=parseInt(dati[5],16);
    const step=(titolo,testo,...valori)=>({titolo,testo,valori});
    const t=[
      step('Misura del sensore','Il sensore prepara il nome, la temperatura di −1,23 °C e la tensione di 10 V. Il trasmettitore codifica i campi nel formato TLM1.',['Nome del sensore',p.nome],['Record originale',orig.join(' ')]),
      step('Arrivo al lettore','Il ricevitore dispone dei soli byte effettivamente consegnati. I numeri sotto le celle indicano l’offset nel buffer.',['Byte ricevuti',dati.join(' ')],['Dimensione',dati.length]),
      step('Prefisso e lunghezza','La firma occupa quattro byte. Il byte all’offset 5 dà la lunghezza UTF-8 del nome. La lunghezza richiesta è quindi di 12 + n byte.',['Firma',dati.slice(0,4).join(' ')],['Byte nome',n],['Attesi',12+n],['Ricevuti',dati.length])
    ];
    const close=(esito,offset,span)=>{t.push(step('Decisione del lettore',esito==='accettato'?'I campi riletti rispettano struttura e dominio del formato. La misura è disponibile all’applicazione.':'Il controllo del campo evidenziato impedisce di consegnare una misura all’applicazione.',['Esito',esito],['Offset',offset],['Ampiezza',span]));return t;};
    if(dati.length!==12+n)return close(decoded.Esito,Math.min(dati.length,12+n),Math.abs(dati.length-12-n));
    const flags=parseInt(dati[4],16);
    t.push(step('Controllo dei flag','I bit da 2 a 7 sono riservati. L’intersezione del byte con la maschera 0xFC precede l’interpretazione dei dati.',['Flag','0x'+hx(flags)],['Bit riservati','0x'+hx(flags&0xFC)]));
    if(flags&0xFC)return close(decoded.Esito,4,1);
    t.push(step('Nome UTF-8','Il campo contiene esattamente n byte. Il lettore verifica la sequenza UTF-8 prima di assegnare un nome alla misura.',['Byte nome',dati.slice(6,6+n).join(' ')],['Esito UTF-8',p.guasto==='testo'?'sequenza illecita':p.nome]));
    if(p.guasto==='testo')return close(decoded.Esito,6,n);
    const a=Uint8Array.from(dati,v=>parseInt(v,16)),view=new DataView(a.buffer),temp=view.getInt16(6+n,false),volt=view.getFloat32(8+n,true);
    t.push(step('Temperatura','Il primo byte ha peso 256. I due byte si leggono in complemento a due a 16 bit e poi in centesimi di grado.', ['Offset',6+n],['Centesimi di grado',temp],['Temperatura',(temp/100).toLocaleString('it-IT')+' °C']));
    t.push(step('Tensione','I quattro byte sono ordinati dal meno significativo al più significativo. Dopo la decodifica binary32 il lettore richiede una tensione finita e maggiore o uguale a zero.', ['Offset',8+n],['Byte tensione',dati.slice(8+n).join(' ')],['Tensione',volt+' V']));
    return close(decoded.Esito||'accettato',8+n,4);
  }
  function moduloDisegna(p,s,k){
    const original=byteList(at(s,0)['Record originale']);
    const data=k?byteList(at(s,1)['Byte ricevuti']):original,n=parseInt(original[5],16),tag=s[k].titolo,v=at(s,k);
    const ranges={'Prefisso e lunghezza':[0,6],'Controllo dei flag':[4,1],'Nome UTF-8':[6,n],'Temperatura':[6+n,2],'Tensione':[8+n,4]};
    const [from,span]=ranges[tag]||((tag==='Decisione del lettore')?[v.Offset,v.Ampiezza]:[-1,0]);
    let g=heading(tag)+recordTape(data,n,from,span);
    const result=tag==='Misura del sensore'?'Record trasmesso · '+p.nome+' · −1,23 °C · 10 V':
      tag==='Arrivo al lettore'?'Buffer ricevuto · '+data.length+' byte':
      tag==='Prefisso e lunghezza'?'Lunghezza dichiarata '+(12+n)+' B · lunghezza osservata '+data.length+' B':
      tag==='Controllo dei flag'?v.Flag+' AND 0xFC = '+v['Bit riservati']:
      tag==='Nome UTF-8'?v['Byte nome']+' → '+v['Esito UTF-8']:
      tag==='Temperatura'?v['Centesimi di grado']+' centesimi → '+v.Temperatura:
      tag==='Tensione'?v['Byte tensione']+' → '+v.Tensione:'Esito: '+v.Esito;
    if(from>=0&&from<data.length)g+=route('M'+(22+(from+.5)*(596/Math.max(12+n,data.length)))+' 172 V183 H309',true);
    return g+txt(320,213,result,Math.min(17,850/Math.max(result.length,1)),'middle',col.live);
  }
  SL.moduliAnimati[1]={
    titolo:'Leggere un record di telemetria',
    teoria:SL.lezioni['modulo-1'].join(' '),
    domanda:'Il lettore consegna la misura all’applicazione? In caso di rifiuto, quale controllo lo determina?',
    istruzione:'Scegli un nome e la copia integra. Segui il record dal sensore al lettore. Lascia invariato il nome e ripeti con una sola alterazione, per esempio il byte finale mancante oppure la tensione negativa.',
    osservazione:'La prima regola violata individua il campo che blocca la lettura. Un difetto di lunghezza interrompe la traccia prima delle misure, mentre una tensione negativa viene rilevata dopo la conversione binary32.',
    previsione:{label:'Esito del lettore',valore:(_p,s)=>at(s,s.length-1).Esito},
    controlli:SL.unita['1.7.7'].controlli,
    calcola:moduloCalcola,disegna:moduloDisegna
  };
  // La classe reveal viene attivata dal lettore soltanto durante l’avanzamento.
  for(const [id,draw] of Object.entries(scenes)){
    SL.sceneLab[id]=(p,states,k)=>'<g class="reveal">'+draw(p,states,k)+'</g>';
  }
})();
