/* Ricostruzioni delle prove di rappresentazione dei dati. Il passo zero
   espone il dato ricevuto; le trasformazioni seguono lo svolgimento della variante. */
(() => {
  'use strict';
  const P=SL.pen, scenes={};
  const answer=(v,n)=>String(v.campi[n].answer);
  const bits=(n,w)=>n.toString(2).padStart(w,'0');
  const hex=(n,w=2)=>n.toString(16).toUpperCase().padStart(w,'0');
  const allHex=s=>[...s.matchAll(/0x[0-9A-F]+/g)].map(m=>Number(m[0]));
  const parseBytes=s=>s.trim().split(/\s+/);
  const heading=t=>P.text(23,28,t,'label muted');
  const note=t=>P.text(24,232,t,'label');
  const label=(x,y,t)=>P.text(x,y,t,'small muted');
  const put=(x,y,w,h,name,val,hot=false)=>P.box(x,y,w,h,name,val,hot?'cell hot':'cell');
  function route(x1,y1,x2,y2,on){
    const d='M'+x1+' '+y1+' L'+x2+' '+y2;
    return P.arrow(x1,y1,x2,y2,on)+(on?P.travel(d):'');
  }
  function strip(values,x,y,width,{labels=[],highlight=()=>false,pending=()=>false}={}){
    const a=Array.from(values),pitch=width/Math.max(1,a.length);
    return a.map((val,i)=>P.rect(x+i*pitch,y,pitch-2,31,highlight(i)?'cell hot':pending(i)?'cell off':'cell')+
      P.text(x+(i+.5)*pitch-1,y+21,val,pitch<37?'small':'label','middle')+
      (labels[i]!==undefined?P.text(x+(i+.5)*pitch-1,y+46,labels[i],'small muted','middle'):'')).join('');
  }
  function bitrow(tag,word,y,select=()=>false){
    return label(24,y+21,tag)+strip(word,164,y,451,{highlight:select});
  }
  function bracket(x1,x2,y,t){
    return P.path('M'+x1+' '+(y-6)+'v6H'+x2+'v-6','wire live')+P.text((x1+x2)/2,y+20,t,'small','middle');
  }
  function dec(n){return Number(n).toLocaleString('it-IT',{useGrouping:false,maximumFractionDigits:16});}
  function gate(x,y,name){
    const d=name==='AND'||name==='NAND'?'M0 0H34C82 0 82 58 34 58H0Z':'M0 0Q43 0 76 29Q45 58 0 58Q20 29 0 0Z';
    const neg=name==='NAND'||name==='NOR';
    return '<g transform="translate('+x+' '+y+')">'+P.path(d,'wire live')+
      (name==='XOR'?P.path('M-7 0 Q12 29 -7 58','wire'):'')+(neg?'<circle cx="72" cy="29" r="5" class="cell"/>':'')+P.text(34,34,name,'small','middle')+'</g>';
  }
  scenes['1.1/1']=(v,k)=>{
    const output=v.consegna.includes('puts'),lib=output?'puts':'fread';
    let g=heading(output?'Dal programma al terminale':'Dal file al buffer del programma')+
      put(25,63,152,62,'chiamata C',lib,k===0)+put(246,63,146,62,'flusso',k>=1?'libreria C':'?',k===1)+
      put(464,63,150,62,'servizio',k>=2?'kernel':'?',k===2)+route(180,93,240,93,k===1)+route(395,93,459,93,k===2);
    if(output)g+=strip(k>=2?['4F','4B','0A']:['O','K'],135,154,370,{labels:k>=2?['O','K','LF']:[]});
    else g+=P.path('M540 130V171H319V131','wire')+(k===3?P.travel('M540 130V171H319V131'):'')+label(354,195,'dati nella cache del kernel');
    return g+note(k===3?(output?'stdout → fd '+answer(v,1)+' → terminale':'Il buffer del chiamante riceve i byte controllati dal kernel.'):'');
  };
  scenes['1.1/2']=(v,k)=>{
    const [,base,off,raw]=v.consegna.match(/base (0x[0-9A-F]+) più (\d+).*?contengono ([0-9A-F ]+) in esadecimale/);
    const a=parseBytes(raw),idx=+off;
    return heading('Una richiesta di memoria · un byte')+put(23,49,158,62,'indirizzo in CPU',k?'0x'+hex(+base+idx,4):base+' + '+off,k===1)+
      route(186,81,250,81,k===1)+strip(a,261,62,350,{labels:a.map((_,i)=>'+'+i),highlight:i=>k>=2&&i===idx})+
      P.path('M'+(261+(idx+.5)*350/a.length)+' 115 V171 H195','wire')+(k===2?P.travel('M'+(261+(idx+.5)*350/a.length)+' 115 V171 H195'):'')+
      put(23,145,170,65,'registro',k===3?answer(v,1):k===2?'0x'+a[idx]:'?',k===3)+note(k===3?a[idx][0]+' × 16 + '+parseInt(a[idx][1],16)+' = '+answer(v,1):'Indirizzi crescenti da sinistra a destra.');
  };
  scenes['1.1/3']=(v,k)=>{
    const [,cwd,path]=v.consegna.match(/corrente è ([^.]+)\. Considera (\S+)/),tokens=path.split('/');
    let stack=cwd.split('/').filter(Boolean);
    if(k>=2)for(const c of tokens.slice(0,k===2?-1:undefined)){if(c==='..')stack.pop();else if(c!=='.')stack.push(c);}
    return heading('Risoluzione a partire dalla directory corrente')+strip(tokens,25,55,589,{highlight:i=>k>=2&&(k===3?i===tokens.length-1:i<tokens.length-1)})+
      label(25,129,'cammino nella directory')+strip(['/',...stack],25,145,588,{highlight:i=>k>0&&i===stack.length})+
      note(k?'/'+stack.join('/'):'Directory di partenza: '+cwd);
  };
  scenes['1.1/4']=(v,k)=>{
    const append=v.consegna.includes('>>'),before=k===0?['A','LF']:['41','0A'];
    const file=k===3?parseBytes(answer(v,1)):k>=2&&!append?[]:before;
    return heading('Scrittura del comando printf')+put(25,50,200,57,'operatore della shell',append?'>>':' >',k===2)+
      label(280,51,'uscita prodotta')+strip(k>=2?['42','0A']:['B','LF'],282,65,256)+
      route(414,102,414,150,k===3)+label(25,153,'file dati')+
      (file.length?strip(file,26,165,576,{highlight:i=>k===3&&i>=file.length-2}):put(26,161,576,48,'dopo il troncamento','file vuoto',true))+
      note(k===3?'Lunghezza finale: '+answer(v,0)+' byte':'');
  };
  scenes['1.1/5']=(v,k)=>{
    const stop=v.consegna.includes('gcc -S'),products=stop?['hello.c','testo espanso','hello.s','hello.o']:['hello.c','dichiarazione','hello.o','definizione?'];
    let g=heading(stop?'Quale fase produce il listato?':'Ricerca di un simbolo esterno');
    products.forEach((name,i)=>{const x=25+i*152;
      g+=P.path('M'+x+' 69h78l19 19v70h-97Z M'+(x+78)+' 69v19h19','wire')+
        P.text(x+49,123,i<=k?name:'··',i===1?'small':'label','middle')+(i?route(x-51,108,x-6,108,i===k):'');});
    return g+note(stop?(k===2?'gcc -S conserva hello.s.':k===3?'L’assemblatore può generare hello.o.':'Il comando parte dal sorgente hello.c.'):
      k===3?'Il collegatore cerca l’oggetto che definisce il simbolo esterno.':'La dichiarazione descrive la funzione chiamata.');
  };

  scenes['1.2/1']=(v,k)=>{
    const mv=v.consegna.match(/misuri ([0-9, ]+) mV/)[1].split(',').map(Number),w=590/mv.length;
    let g=heading('Livelli logici · tensioni in ordine dal bit più significativo');mv.forEach((n,i)=>{
      const x=25+i*w,yy=a=>174-a/3000*116;
      g+=P.rect(x+18,48,34,127,'cell')+P.rect(x+25,yy(n),20,174-yy(n),'cell active')+
        P.line(x+11,yy(800),x+60,yy(800),'wire live')+P.line(x+11,yy(2000),x+60,yy(2000),'wire live')+
        P.text(x+70,78,n+' mV','small')+P.text(x+70,125,k?(n>=2000?1:0):'?','value')+
        (k>=2?P.text(x+11,200,'peso '+2**(mv.length-i-1),'small'):'');});
    return g+note(k===3?'Valore '+answer(v,0)+' · '+mv.length+' linee → '+answer(v,1)+' configurazioni':'Tacche di soglia a 800 e 2000 mV.');
  };
  scenes['1.2/2']=(v,k)=>{
    const n=+v.consegna.match(/Converti (\d+)/)[1],word=n.toString(2),positions=Array.from(word,(_,i)=>word.length-i-1);
    return heading('Valore di partenza · '+n)+label(24,64,'pesi delle posizioni')+
      strip(positions.map(i=>k?2**i:'?'),25,82,590,{highlight:i=>k===1?i===0:k>=2&&word[i]==='1'})+
      (k>=2?bracket(26,613,135,[...word].flatMap((x,i)=>x==='1'?[2**positions[i]]:[]).join(' + ')+' = '+n):'')+
      bitrow('parola',k===3?word:'·'.repeat(word.length),175,i=>k===3&&word[i]==='1')+note(k===3?'Bit a uno: '+answer(v,1):'');
  };
  scenes['1.2/3']=(v,k)=>{
    const word=v.consegna.match(/binaria ([01]+)/)[1],pad=word.padStart(4*Math.ceil(word.length/4),'0'),nibbles=pad.match(/.{4}/g);
    let g=heading('Raggruppamento a partire da destra')+bitrow('ingresso',word,46);
    if(k)nibbles.forEach((b,i)=>{const w=560/nibbles.length,x=40+i*w;
      g+=strip(b,x,99,w-10,{highlight:j=>i===0&&j<pad.length-word.length})+bracket(x,x+w-12,148,k>=2?parseInt(b,2):'4 bit');
      if(k===3)g+=P.text(x+w/2,208,parseInt(b,2).toString(16).toUpperCase(),'value','middle');});
    return g+note(k===3?'Parola esadecimale: 0x'+answer(v,1):'');
  };
  scenes['1.2/4']=(v,k)=>{
    const [a,b]=allHex(v.consegna),x1=78,x2=551;
    return heading('Distanza fra due indirizzi di byte')+P.line(33,110,605,110,'wire')+P.dot(x1,110)+P.dot(x2,110)+
      P.text(x1,81,'0x'+hex(a),'value','middle')+P.text(x2,81,'0x'+hex(b),'value','middle')+
      P.text(x1,141,k?String(a):'?','label','middle')+P.text(x2,141,k>=2?String(b):'?','label','middle')+
      (k===3?bracket(x1,x2,165,answer(v,1)+' byte')+P.travel('M78 110H551'):'')+note(k===3?a+' + '+answer(v,1)+' = '+b:'Le posizioni marcano l’inizio del buffer e la cella richiesta.');
  };
  scenes['1.2/5']=(v,k)=>{
    const str=v.consegna.match(/«([^»]+)»/)[1],chars=Array.from(str),octets=Array.from(new TextEncoder().encode(str),n=>hex(n));
    return heading('Dai caratteri alle celle di una stringa C')+strip(chars,39,56,550,{highlight:i=>k===1&&i===0})+
      route(313,95,313,140,k===2)+label(25,132,'buffer UTF-8')+
      (k>=2?strip(k===3?[...octets,'00']:octets,26,151,584,{highlight:i=>k===3&&i===octets.length}):P.rect(26,151,584,31,'cell off'))+
      note(k===3?octets.length+' byte di testo + 1 terminatore = '+answer(v,1)+' byte':'');
  };
  scenes['1.3/1']=(v,k)=>{
    const n=allHex(v.consegna)[0],w=bits(n,8);
    return heading('Un byte letto in tre modi')+put(22,51,151,59,'byte','0x'+hex(n))+route(176,82,253,82,k===1)+
      put(257,51,145,59,'intero',k?answer(v,0):'?',k===1)+route(406,82,465,82,k===2)+
      put(471,51,138,59,'cifra ASCII',k>=2?answer(v,1):'?',k===2)+bitrow('posizioni',k===3?w:'········',153,i=>k===3&&w[i]==='1')+
      note(k===3?'Numero di bit attivi: '+answer(v,2):'Una cifra ASCII si interpreta rispetto al codice di «0».');
  };
  scenes['1.3/2']=(v,k)=>{
    const raw=v.consegna.match(/contiene ([0-9A-F ]+) \(/)[1],a=parseBytes(raw),zero=a.indexOf('00');
    return heading('Il terminatore NUL delimita il testo')+strip(a,24,67,592,{labels:a.map((_,i)=>i),highlight:i=>k===1?i===zero:k>=2&&i<zero})+
      (k>=2?bracket(24,24+592*zero/a.length-2,135,String.fromCharCode(...a.slice(0,zero).map(s=>parseInt(s,16)))):'')+
      put(24,171,265,53,'lunghezza della stringa',k===3?answer(v,0):'?',k===3)+put(334,171,277,53,'ultimo carattere',k===3?answer(v,1):'?',k===3);
  };
  scenes['1.3/3']=(v,k)=>{
    const a=parseBytes(v.consegna.match(/valida ([0-9A-F ]+) rappresenta/)[1]),payload=a.map((n,i)=>parseInt(n,16)&(i?63:a.length===2?31:15));
    let g=heading('UTF-8 · contributi al punto di codice');
    a.forEach((n,i)=>{const x=30+i*595/a.length;g+=put(x,55,560/a.length,58,'ottetto '+i,'0x'+n,k===1&&i===0);
      if(k>=2)g+=route(x+75,116,x+75,143,k===2)+put(x,146,560/a.length,52,'bit utili',payload[i],k===2);});
    return g+note(k===3?payload.map((n,i)=>n+' × '+64**(payload.length-i-1)).join(' + ')+' = '+answer(v,1):k===1?'Numero di continuazioni: '+answer(v,0):'');
  };
  scenes['1.3/4']=(v,k)=>{
    const [,ws,hs]=v.consegna.match(/misura (\d+) × (\d+)/),w=+ws,h=+hs;
    const [,channel,xs,ys]=v.consegna.match(/byte ([RGB]) del pixel \((\d+), (\d+)\)/),x=+xs,y=+ys,size=Math.min(38,147/h),idx=y*w+x;
    let g=heading('Pixel contigui · ciascun pixel contiene R G B');
    for(let r=0;r<h;r++)for(let c=0;c<w;c++)g+=P.rect(26+c*size,55+r*size,size-2,size-2,r===y&&c===x&&k>=2?'cell hot':r===0&&k===1?'cell active':'cell',2);
    g+=label(330,64,'coordinate ('+x+', '+y+')')+label(330,90,k?'riga = '+3*w+' B':'coordinate da zero')+
      (k>=2?label(330,117,'indice lineare = '+idx):'')+strip(['R','G','B'],330,140,277,{highlight:i=>k===3&&'RGB'[i]===channel,labels:k===3?[idx*3,idx*3+1,idx*3+2]:[]});
    return g+note(k===3?'Offset di '+channel+' = '+answer(v,1)+' byte':k>=1?'L’intera immagine occupa '+answer(v,0)+' byte.':'');
  };
  scenes['1.3/5']=(v,k)=>{
    const a=parseBytes(v.consegna.match(/Leggi ([0-9A-F ]+) come/)[1]);
    let g=heading('Due celle fisse, tre letture')+strip(a,65,48,508,{labels:['indirizzo B','indirizzo B + 1']});
    const ab=[['ASCII',k?answer(v,0):'?'],['big-endian',k>=2?answer(v,1):'?'],['little-endian',k===3?answer(v,2):'?']];
    ab.forEach(([name,value],i)=>{const x=23+i*202;g+=route(317,105,x+91,143,k===i+1)+put(x,147,184,61,name,value,k===i+1);});
    return g;
  };

  scenes['1.4/1']=(v,k)=>{
    const n=+v.consegna.match(/Rappresenta −(\d+)/)[1];
    return heading('Codifica di −'+n+' · otto posizioni')+bitrow('modulo',k?bits(n,8):'········',51)+
      bitrow('inversione',k>=2?bits(+answer(v,0),8):'········',100)+bitrow('più uno',k===3?bits(+answer(v,1),8):'········',149)+
      note(k===3?answer(v,1)+' − 256 = −'+n:k===2?'Dopo l’inversione: '+answer(v,0):'');
  };
  scenes['1.4/2']=(v,k)=>{
    const [,width,word]=v.consegna.match(/di (\d+) bit (0x[0-9A-F]+)/),n=Number(word);
    let g=heading(word+' · stessa parola, intervalli diversi')+strip(bits(n,+width),23,49,592,{highlight:i=>k>=2&&i===0});
    const row=(y,start,end,value,read)=>{const pos=45+544*(value-start)/(end-start);return P.line(45,y,589,y,'wire')+
      P.text(45,y+21,start,'small','middle')+P.text(589,y+21,end,'small','middle')+(read?P.dot(pos,y,5,'pulse')+P.text(Math.max(77,Math.min(560,pos)),y-9,value,'label','middle'):'');};
    return g+row(124,0,2**width-1,n,k>=1)+row(204,-(2**(width-1)),2**(width-1)-1,+answer(v,1),k===3);
  };
  scenes['1.4/3']=(v,k)=>{
    const w=+v.consegna.match(/di (\d+) bit/)[1];
    return heading('Intervallo rappresentabile con '+w+' bit')+
      bitrow('minimo',k?'1'+'0'.repeat(w-1):'·'.repeat(w),56,i=>i===0&&k>0)+
      bitrow('massimo',k>=2?'0'+'1'.repeat(w-1):'·'.repeat(w),110,i=>i>0&&k>=2)+
      P.line(92,183,549,183,'wire')+P.text(85,209,k?answer(v,0):'?','label','middle')+
      P.text(551,209,k>=2?answer(v,1):'?','label','middle')+(k===3?P.text(317,173,answer(v,2)+' valori','value','middle'):'');
  };
  scenes['1.4/4']=(v,k)=>{
    const [a,b]=allHex(v.consegna),subtract=v.consegna.includes(' − '),op=subtract?'−':'+';
    return heading('Operazione a otto bit · 0x'+hex(a)+' '+op+' 0x'+hex(b))+
      bitrow('A',bits(a,8),45)+bitrow('B',bits(b,8),85)+bitrow('residuo',k?bits(+answer(v,0),8):'········',125)+
      put(19,178,183,54,'risultato con ampiezza 8',k?answer(v,0):'?',k===1)+
      put(226,178,162,54,subtract?'prestito · CF':'riporto · CF',k>=2?answer(v,1):'?',k===2)+
      put(420,178,188,54,'overflow con segno · OF',k===3?answer(v,2):'?',k===3);
  };
  scenes['1.4/5']=(v,k)=>{
    const [,as,bs]=v.consegna.match(/positivi (\d+) e (\d+)/),a=+as,b=+bs,x=n=>32+548*n/140;
    return heading('Margine di una somma con segno a otto bit')+P.line(32,120,599,120,'wire')+P.dot(x(a),120)+
      P.text(x(a)-7,95,a,'label','end')+(k?P.line(x(127),86,x(127),156,'wire live')+P.text(x(127)+4,75,'127','label','end'):'')+
      (k>=2?bracket(x(a),x(127),148,answer(v,0)+' disponibili'):'')+
      (k===3?route(x(a),111,x(a+b),111,true)+P.text(x(a+b),187,a+b,'value','middle'):'')+
      note(k===3?'Scrittura: '+answer(v,1):'Secondo addendo richiesto: '+b);
  };
  scenes['1.5/1']=(v,k)=>{
    const [,a,b]=v.consegna.match(/A=(\d) e B=(\d)/),c=+v.consegna.match(/C vale (\d)/)[1];
    return heading('Due porte in cascata')+P.text(25,72,'A='+a,'value')+P.text(25,130,'B='+b,'value')+
      route(79,69,137,89,false)+route(79,126,137,119,false)+gate(140,76,'NAND')+
      route(219,105,335,105,k===2)+P.text(270,90,k>=2?answer(v,0):'?','value','middle')+
      P.text(244,179,'C='+c,'value')+route(292,173,345,134,k===3)+gate(346,91,'XOR')+route(424,120,515,120,k===3)+
      put(517,90,96,62,'uscita',k===3?answer(v,1):'?',k===3)+note(k===1?'Stadio AND prima dell’inversione: '+(+a&+b):'');
  };
  scenes['1.5/2']=(v,k)=>{
    const [a,b]=allHex(v.consegna),r=a&b;
    return heading('0x'+hex(a)+' AND 0x'+hex(b)+' · confronto per colonna')+
      bitrow('A',k?bits(a,8):'········',55)+bitrow('maschera',k?bits(b,8):'········',102)+
      bitrow('intersezione',k>=2?bits(r,8):'········',149,i=>k===3&&bits(r,8)[i]==='1')+
      note(k===3?'Bit sopravvissuti: '+answer(v,1):k===2?'Byte = 0x'+hex(r):'Gli otto pesi sono allineati verticalmente.');
  };
  scenes['1.5/3']=(v,k)=>{
    const ys=v.consegna.match(/produce ([01 ]+) sulle/)[1].trim().split(/\s+/);
    let g=heading('Dalla colonna dei risultati alla porta')+label(24,56,'ingressi')+label(133,56,'uscita');
    ys.forEach((val,i)=>{g+=strip([k?bits(i,2):'·',val],21,65+i*36,205,{highlight:j=>k>=1&&j===1&&val==='1'});});
    if(k>=2)g+=gate(354,89,answer(v,0))+route(234,125,350,125,k===2);
    return g+note(k===3?'Righe in cui l’uscita vale uno: '+answer(v,1):'');
  };
  scenes['1.5/4']=(v,k)=>{
    const a=allHex(v.consegna)[0],idx=+v.consegna.match(/posizione (\d+)/)[1],field=+v.consegna.match(/valore (\d+) al campo/)[1];
    const mask=3<<idx,clean=a&~mask;
    return heading('Sostituzione del campo · due bit a partire da '+idx)+
      bitrow('byte iniziale',bits(a,8),42,i=>i===7-idx||i===6-idx)+
      bitrow('maschera',k?bits(mask,8):'········',84)+bitrow('pulizia',k>=2?bits(clean,8):'········',126)+
      bitrow('risultato',k===3?bits(+answer(v,1),8):'········',168,i=>k===3&&(i===7-idx||i===6-idx))+
      note(k===3?'Rilettura del campo: '+field+' · byte = 0x'+hex(+answer(v,1)):'Valore da inserire: '+field);
  };
  scenes['1.5/5']=(v,k)=>{
    const w=v.consegna.match(/tupla ([01]+)/)[1],n=w.length,size=2**n,pitch=584/size,idx=parseInt(w,2);
    let g=heading('Righe in ordine binario crescente')+strip(w,24,49,592,{labels:k?Array.from(w,(_,i)=>2**(n-1-i)):[]})+label(24,138,'indice della riga');
    if(k>=2)g+=P.line(37,164,617,164,'wire')+P.dot(36+idx*pitch,164,5,'pulse')+P.text(36+idx*pitch,193,answer(v,0),'label','middle');
    if(k===3)for(let i=0;i<size;i++)g+=P.line(36+i*pitch,160,36+i*pitch,169,'wire');
    return g+note(k===3?'Ultimo indice '+(size-1)+' · numero di righe '+answer(v,1):'');
  };
  scenes['1.6/1']=(v,k)=>{
    const w=v.consegna.match(/è 0,([01]+)/)[1],den=2**w.length,num=parseInt(w,2);
    return heading('Frazione binaria 0,'+w)+strip(w,23,48,591,{labels:k?Array.from(w,(_,i)=>'1/'+2**(i+1)):[],highlight:i=>k&&w[i]==='1'})+
      (k>=2?strip(Array.from({length:den},(_,i)=>i<num?'●':'·'),25,141,584,{highlight:i=>i<num}):P.rect(25,141,584,31,'cell off'))+
      note(k===3?num+'/'+den+' = '+dec(answer(v,1)):k===2?'Numeratore comune: '+answer(v,0):'Ogni posizione aggiunge un peso frazionario.');
  };
  scenes['1.6/2']=(v,k)=>{
    const [,ns,ds]=v.consegna.match(/Riduci (\d+)\/(\d+)/),n=+ns,d=+ds,reduced=+answer(v,0),gcd=d/reduced;
    let r=reduced;const prime=[];for(let f=2;r>1;f++){while(r%f===0){prime.push(f);r/=f;}}
    return heading('Verifica di terminazione in base due')+put(21,51,142,62,'frazione iniziale',n+'/'+d)+route(166,81,243,81,k===1)+
      put(247,51,150,62,'minimi termini',k?(n/gcd)+'/'+reduced:'?',k===1)+label(25,143,'fattori del denominatore ridotto')+
      (k>=2?strip(prime,26,155,410,{highlight:i=>prime[i]!==2}):P.rect(26,155,410,31,'cell off'))+
      note(k===3?'Espansione: '+answer(v,1)+(reduced===4?' · 0,01₂':''):k===1?'Divisore comune: '+gcd:'');
  };
  scenes['1.6/3']=(v,k)=>{
    const w=v.consegna.match(/Normalizza ([01,]+)/)[1],digits=w.replace(',','').replace(/^0+/,''),exp=+answer(v,0);
    return heading('Spostamento della virgola e bias')+put(25,51,176,63,'numero iniziale',w)+
      route(205,83,278,83,k===1)+put(282,51,186,63,'significanda',k?'1,'+digits.slice(1):'?',k===1)+
      put(27,147,169,54,'esponente e',k>=2?exp:'?',k===2)+route(201,172,275,172,k===3)+
      put(278,147,322,54,'campo codificato · 8 bit',k===3?bits(+answer(v,1),8):'?',k===3)+
      note(k===3?exp+' + 127 = '+answer(v,1):'');
  };
  scenes['1.6/4']=(v,k)=>{
    const word=allHex(v.consegna)[0],w=bits(word,32),E=+answer(v,0),frac=Number('0b'+w.slice(9))/2**23;
    return heading('binary32 · parola 0x'+hex(word,8))+
      put(20,61,70,62,'S',k?w[0]:'?',k===1)+put(99,61,156,62,'E · 8 bit',k?w.slice(1,9):'?',k===1)+
      put(264,61,351,62,'F · 23 bit',k>=2?w.slice(9):'?',k===2)+
      label(22,163,k?'Esponente effettivo = '+E+' − 127':'I tre campi hanno pesi e significati distinti.')+
      label(22,191,k>=2?'Significanda = 1 + '+dec(frac)+' = '+dec(1+frac):'')+note(k===3?'Valore esatto = '+dec(answer(v,1)):'');
  };
  scenes['1.6/5']=(v,k)=>{
    const [,deltaS,baseS]=v.consegna.match(/sommato (\d+) a (\d+)/),x=+baseS,delta=+deltaS,exact=x+delta,rounded=+answer(v,1);
    const pos=n=>55+(n-x)*123;
    let g=heading('Arrotondamento al più vicino · pareggio verso il pari')+label(24,72,x+' + '+delta)+P.line(45,133,587,133,'wire');
    if(k)for(let i=0;i<=4;i+=2)g+=P.dot(pos(x+i),133,5,'pin')+P.text(pos(x+i),165,x+i,'small','middle');
    if(k>=2)g+=P.dot(pos(exact),133,5,'pulse')+P.text(pos(exact),108,exact,'label','middle');
    if(k===3)g+=route(pos(exact),184,pos(rounded),184,true);
    return g+note(k===3?'Memorizzato: '+rounded:k===1?'Le tacche rappresentabili distano 2.':'');
  };

  scenes['1.7/1']=(v,k)=>{
    const raw=v.consegna.match(/contiene ([\dA-F ]+)\./)[1],a=parseBytes(raw),n=parseInt(a[5],16),start=[-1,6,6+n,8+n][k],width=[0,n,2,4][k];
    const x=25,w=592/a.length;
    return heading('Record TLM1 · ordine degli ottetti in memoria')+strip(a,x,68,592,{labels:a.map((_,i)=>i),highlight:i=>i>=start&&i<start+width})+
      (k?bracket(x+start*w,x+(start+width)*w-2,135,['','nome UTF-8','int16 big-endian','binary32 little-endian'][k]):'')+
      note(k===3?'Tensione = '+dec(answer(v,2))+' V':k===2?'Temperatura = '+dec(answer(v,1))+' °C':k===1?'Nome: '+n+' byte':'Un campo viene interpretato soltanto dopo averlo delimitato.');
  };
  scenes['1.7/2']=(v,k)=>{
    const [,ws,hs,bs]=v.consegna.match(/Larghezza (\d+), altezza (\d+), budget (\d+) MiB/),w=BigInt(ws),h=BigInt(hs),b=BigInt(bs)*1048576n;
    let g=heading('Spazio RGBA · confronto a precisione intera')+P.rect(32,70,192,108,'cell')+
      P.text(125,57,ws+' px','small','middle')+P.text(128,198,hs+' px in altezza','small','middle');
    for(let i=1;i<5;i++)g+=P.line(32+i*38,72,32+i*38,176,'wire dim');
    for(let i=1;i<3;i++)g+=P.line(34,70+i*36,222,70+i*36,'wire dim');
    g+=put(271,49,332,55,'pixel totali',k?String(w*h):'?',k===1)+put(271,121,332,59,'quattro byte per pixel',k>=2?answer(v,0)+' B':'?',k===2);
    return g+note(k===3?'Budget '+b+' B · decisione: '+answer(v,1):'La griglia rappresenta l’immagine fuori scala.');
  };
  scenes['1.7/3']=(v,k)=>{
    const raw=v.consegna.match(/Analizza ([\dA-F ]+)\./)[1],a=parseBytes(raw),n=parseInt(a[5],16),len=k>=2?Math.max(a.length,n+12):a.length;
    const cells=[...a,...Array(len-a.length).fill('×')];
    return heading('Ispezione del record ricevuto')+strip(cells,25,78,590,{labels:cells.map((_,i)=>i),highlight:i=>k===1?i<4:k===2?i===5:k===3&&(a.length<n+12?i>=a.length:i===4)})+
      (k===1?bracket(25,25+4*590/len-2,151,'firma TLM1'):k>=2?bracket(25,613,151,'attesi '+(12+n)+' byte · presenti '+a.length):'')+
      note(k===3?'Diagnosi: '+answer(v,1):'');
  };
  scenes['1.7/4']=(v,k)=>{
    const [,w,o,a]=v.consegna.match(/W=(\d), O=(\d), A=(\d)/);
    return heading('Autorizzazione di un byte valido')+P.text(30,73,'O = '+o,'value')+P.text(30,134,'A = '+a,'value')+
      route(88,69,149,86,k===1)+route(88,129,149,109,k===1)+gate(151,68,'OR')+
      route(231,97,344,97,k===2)+P.text(282,77,k>=2?answer(v,0):'?','value','middle')+
      P.text(222,173,'W = '+w,'value')+route(287,169,344,124,k===3)+gate(348,80,'AND')+route(425,109,483,109,k===3)+
      put(486,78,125,64,'decisione',k===3?answer(v,1):'?',k===3)+note('I bit riservati della parola fornita sono a zero.');
  };
  for(const [id,draw] of Object.entries(scenes)){
    SL.sceneProve[id]=(variant,k)=>'<g class="reveal">'+draw(variant,k)+'</g>';
  }
})();
