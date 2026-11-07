/* Disegni del modulo II. Le celle e i segnali mostrano lo stato del passo selezionato. */
(() => {
  'use strict';
  const ink = '#e7f4e9', dim = '#abc9b3', mint = '#a1e7b0', gold = '#f3c487';
  const colors = {
    quiet: ['#102219', '#3d5a46'], active: ['#1e412c', '#80c693'],
    focus: ['#403521', '#e7b979'], danger: ['#452a25', '#f3a592']
  };
  const {e:escape, values, travel} = SL.pen;
  const hex = (n, digits = 0) => '0x' + BigInt(n).toString(16).toUpperCase().padStart(digits, '0');
  const binary = (n, width) => BigInt.asUintN(width, BigInt(n)).toString(2).padStart(width, '0');
  function text(x, y, value, size = 14, fill = ink, anchor = 'start', maxWidth = 0) {
    const available = maxWidth && String(value).length * size * .61 > maxWidth;
    return '<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" style="fill:'+fill+'" font-family="ui-monospace,monospace" font-size="'+size+'"'+(available?' textLength="'+maxWidth+'" lengthAdjust="spacingAndGlyphs"':'')+'>'+escape(value)+'</text>';
  }
  function tile(x,y,w,h,style='quiet') {
    const [fill,stroke]=colors[style];
    return '<rect'+(style==='focus'||style==='danger'?' class="reveal"':'')+' x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.5"/>';
  }
  function cell(x,y,w,h,caption,value,state='quiet') {
    return tile(x,y,w,h,state) + text(x+w/2,y+16,caption,12,dim,'middle',w-10)
      + text(x+w/2,y+h-11,value,17,state==='focus'?gold:ink,'middle',w-10);
  }
  function wire(d,active=false) {
    const line='<path d="'+d+'" fill="none" stroke="'+(active?gold:'#526c5a')+'" stroke-width="'+(active?2:1.3)+'"/>';
    if(!active)return line;
    return line+travel(d);
  }
  function arrow(x,y,x2,y2,on=true) {
    const a=Math.atan2(y2-y,x2-x),h=6;
    const l=[x2-h*Math.cos(a-.48),y2-h*Math.sin(a-.48)],r=[x2-h*Math.cos(a+.48),y2-h*Math.sin(a+.48)];
    return wire('M'+x+' '+y+' L'+x2+' '+y2,on)+'<path d="M'+l.join(' ')+' L'+x2+' '+y2+' L'+r.join(' ')+'" fill="none" stroke="'+(on?gold:'#526c5a')+'" stroke-width="2"/>';
  }
  const caption=(str,x=22,y=24)=>text(x,y,str,13,dim);
  const note=str=>text(23,231,str,14,mint,'start',594);
  function strip(y,items,styleAt,opts={}) {
    const x=opts.x??22,w=opts.w??596,h=opts.h??36;
    const pitch=w/items.length;
    return items.map((v,i)=>tile(x+pitch*i,y,pitch-2,h,styleAt(i))+text(x+pitch*(i+.5)-1,y+h/2+5,v,Math.min(16,pitch*.7),ink,'middle',Math.max(8,pitch-7))).join('');
  }
  function bits(y,n,width,selected=()=>false,opts={}) {
    return strip(y,[...binary(n,width)],i=>selected(width-i-1)?'focus':'quiet',opts);
  }
  function flags(obj, names, x=330,y=147,w=285) {
    return names.map((n,i)=>cell(x+i*w/names.length,y,w/names.length-4,55,n,obj[n]??'·',obj[n]===undefined?'quiet':Number(obj[n])?'focus':'active')).join('');
  }
  function panelRows(x,y,w,rows,active=-1) {
    return rows.map(([name,val],i)=>tile(x,y+37*i,w,33,i===active?'focus':'quiet')+text(x+10,y+22+37*i,name,13,dim,'start',w*.5)+text(x+w-10,y+22+37*i,val,14,ink,'end',w*.47)).join('');
  }
  const scenes={};
  const draw=(id,render)=>{scenes['2.'+id]=render;};

  draw('1.1',(p,s,k)=>{
    const v=values(s,k);
    return caption('AL · dal bit 7 al bit 0')+bits(46,v.AL,8,()=>k>0)
      +cell(22,139,172,62,'istruzione',k===0?'ingresso':k===1?'MOV':'ADD','active')
      +arrow(194,169,310,169,k===2)+flags(v,['CF','ZF'],320,139,296)
      +note(k===0?'L’immediato da caricare è '+hex(p.a,2)+'.':k===1?'MOV scrive AL. CF e ZF conservano il loro valore.':'ADD scrive il byte basso e aggiorna i flag.');
  });
  draw('1.2',(p,s,k)=>{
    const w=Number(p.dest),dest={8:'AL',16:'AX',32:'EAX'}[w];
    const reg=k===2?values(s,k).RAX:values(s,0).RAX;
    const cells=reg.slice(2).padStart(16,'0').match(/../g);
    const style=i=>k&&i>=8-w/8?'focus':k===2&&w===32?'active':'quiet';
    return caption('RAX · otto byte, dal più significativo al meno significativo')
      +strip(72,cells,style,{h:50})+strip(130,['7','6','5','4','3','2','1','0'],()=> 'quiet',{h:27})
      +(k?wire('M600 54 H'+(621-w/8*74.5),true):'')
      +note(k===0?'Le otto celle contengono inizialmente FF.':(k===1?'Vista selezionata: ':'Scrittura completata: ')+dest+' riceve '+hex(p.b,2)+'. '+(w===32?'La scrittura in EAX azzera i quattro byte superiori.':'I byte esterni alla vista conservano FF.'));
  });
  draw('1.3',(p,s,k)=>{
    let g=caption('Stato del registro dopo ciascuna istruzione');
    for(let j=0;j<4;j++){
      const x=92+j*133,v=j<=k?values(s,j):{};
      g+=text(x+59,55,['MOV','ADD','MOV','ADD'][j],13,j===k?gold:dim,'middle');
      g+=cell(x,66,118,52,'EAX',v.EAX??'·',j===k?'focus':'quiet')+cell(x,147,118,52,'ECX',v.ECX??'·',j===k&&j===2?'focus':'quiet');
      if(j>0&&j<=k)g+=arrow(x-14,93,x-2,93,j===k);
    }
    if(k===2)g+=arrow(348,112,414,145);
    if(k===3)g+=arrow(477,158,548,121);
    return g+note(k===2?'La copia lascia EAX intatto.':'x = '+p.x+' · primo incremento = '+p.d);
  });
  draw('1.4',(p,s,k)=>{
    const two=p.alu==='2',final=values(s,2)['Ultimo ciclo'];
    let g=caption('Una colonna dura un ciclo · ogni corsia rappresenta una ALU');
    for(let c=1;c<=3;c++)g+=text(170+(c-1)*174,56,'ciclo '+c,13,dim,'middle');
    for(let u=0;u<Number(p.alu);u++){
      g+=text(18,92+u*57,'ALU '+(u+1),13,dim);
      for(let c=1;c<=3;c++){
        let v='·';
        if(k>=1&&u===0&&c===1)v='INC R8';
        if(k>=1&&c===(two?1:2)&&u===(two?1:0))v='INC R9';
        if(k===2&&c===final&&u===0)v='ADD R8,R9';
        g+=tile(90+(c-1)*174,67+u*57,155,43,v==='·'?'quiet':'active');
        g+=text(167+(c-1)*174,94+u*57,v,15,ink,'middle');
      }
    }
    if(k===2)g+=arrow(90+(final-2)*174+155,89,90+(final-1)*174,89);
    return g+note(k===0?'Operandi pronti: R8 = '+p.x+', R9 = '+(p.x+5)+'.':s[k].titolo+' · '+s[k].valori.map(([a,b])=>a+' = '+b).join('   '));
  });

  function ranges(p,s,k,subtract){
    const w=Number(p.w),last=k===2?values(s,2):{},signed=values(s,0);
    const ideal=k>0?values(s,1)[subtract?'Differenza con segno':'Somma con segno']:'?';
    const op=subtract?'−':'+';
    let g=caption('Larghezza '+w+' bit · interpretazione con segno')
      +cell(25,38,120,50,'A',signed['A con segno'],'active')+text(158,73,op,20)
      +cell(184,38,120,50,'B',signed['B con segno'],'active')+arrow(309,64,397,64,k>=1)
      +cell(407,38,190,50,'valore matematico',ideal,k===1?'focus':'quiet');
    g+=text(25,120,'bit conservati',13,dim);
    if(k===2)g+=bits(130,last.Risultato,w,i=>i===w-1,{h:31});
    else g+=strip(130,Array(w).fill('·'),()=> 'quiet',{h:31});
    g+=flags(last,subtract?['CF','OF','SF','ZF']:['CF','OF'],82,172,478);
    return g;
  }
  draw('2.1',(p,s,k)=>ranges(p,s,k,false));
  draw('2.6',(p,s,k)=>ranges(p,s,k,true));
  draw('2.2',(p,s,k)=>{
    const v=values(s,k);
    return caption('a × b + c · il terzo addendo resta disponibile in EDX')
      +cell(28,45,168,55,'EDI · a',p.a)+cell(230,45,168,55,'ESI · b',p.b)+cell(433,45,168,55,'EDX · c',p.c)
      +arrow(k===0?112:k===1?314:515,101,305,152,true)
      +cell(177,154,254,63,'EAX · '+['MOV','IMUL','ADD'][k],v.EAX,'focus')
      +text(439,190,k===1?'prodotto salvato':k===2?'risultato':'copia di a',13,dim);
  });
  draw('2.3',(p,s,k)=>{
    const v=values(s,k),fault=k===2&&p.b===0;
    return caption('DIV RCX · divisione senza segno del dividendo RDX:RAX')
      +cell(23,43,170,54,'RDX iniziale',0)+cell(198,43,170,54,'RAX iniziale',p.a)
      +cell(422,43,174,54,'RCX · divisore',k?p.b:'?',k===1?'focus':'quiet')
      +arrow(283,101,239,145,k===2)+arrow(490,101,430,145,k===2)
      +cell(62,148,203,56,'RAX · '+(fault?'conservato':'quoziente'),k===2?v.RAX:'?',fault?'danger':'active')
      +cell(375,148,203,56,'RDX · '+(fault?'conservato':'resto'),k===2?v.RDX:'?',fault?'danger':'active')
      +note(fault?'#DE · divisore zero, scrittura dei risultati interrotta.':k===2?v.RAX+' × '+p.b+' + '+v.RDX+' = '+p.a:'La coppia alta:bassa conserva il dividendo.');
  });
  draw('2.4',(p,s,k)=>{
    const a=values(s,0),v=k?values(s,1):{},r=k===2?values(s,2):{};
    return caption('Contributi al calcolo di 7a + 3b − 4')
      +cell(27,48,154,54,'a × 8',a['8a'],'active')+cell(27,129,154,54,'b',p.b)
      +arrow(184,74,244,74,k>=1)+arrow(184,155,244,155,k>=1)
      +cell(246,48,135,54,'8a − a',v['7a']??'?',k===1?'focus':'quiet')+cell(246,129,135,54,'b + 2b',v['3b']??'?',k===1?'focus':'quiet')
      +wire('M382 74 H417 V116 H462',k===2)+wire('M382 155 H417 V116 H462',k===2)
      +cell(463,91,148,54,'somma − 4',r.RAX??'?',k===2?'focus':'quiet')+note('a = '+p.a+' · b = '+p.b);
  });
  draw('2.5',(p,s,k)=>{
    const v0=values(s,0),v=k?values(s,1):v0,z=k===2?values(s,2).ZF:'?';
    return caption('Due percorsi · valore in EAX e sorgente del flag')
      +cell(20,43,173,56,'EAX iniziale',v0.EAX)+arrow(195,71,246,71,k>=1)
      +cell(248,43,169,56,k?p.op.toUpperCase():'operazione',k?v.EAX:'?',k===1?'focus':'quiet')
      +cell(20,147,173,56,'ZF iniziale',p.z)+(p.op==='lea'?wire('M194 174 H461',k===2):wire('M330 101 V174 H461',k===2))
      +cell(462,147,150,56,'ZF a JZ',z,k===2?'focus':'quiet')+note(k===2?values(s,2).Percorso:'JZ consulta il flag al momento del salto.');
  });
  draw('2.7',(p,s,k)=>{
    const v=values(s,0),cf=k>0?values(s,1).CF:undefined,take=k===2&&cf===1;
    return caption('JB · confronto senza segno con dieci')
      +cell(20,62,164,58,'7a + c',v['7a + c'],'active')
      +cell(220,62,168,58,'CMP b, 10','b = '+p.b,k===1?'focus':'quiet')
      +wire('M389 90 H421 V56 H454',take)+wire('M389 90 H421 V161 H454',k===2&&!take)
      +cell(455,30,160,58,'CF = 1','conserva',take?'focus':'quiet')+cell(455,135,160,58,'CF = 0','cambia segno',k===2&&!take?'focus':'quiet')
      +note(k===2?'Registro di ritorno = '+values(s,2).Risultato:k===1?'CF = '+cf:'Il candidato è disponibile prima del confronto.');
  });

  draw('3.1',(p,s,k)=>{
    const mem=values(s,0).Byte.split(' '),n=Number(p.w);
    return caption('Memoria · byte in ordine di indirizzo crescente')
      +strip(61,mem,j=>k&&j>=p.i&&j<p.i+n?'focus':'quiet',{h:46})
      +strip(115,mem.map((_,j)=>hex(4096+j)),()=> 'quiet',{h:27})
      +arrow(58+74.5*p.i,147,255,176,k===2)
      +cell(235,174,186,51,'EAX',k===2?values(s,k).EAX:'?',k===2?'active':'quiet');
  });
  draw('3.2',(p,s,k)=>{
    const b=Number(p.base),offset=p.i*Number(p.s),min=-16,max=136;
    const pos=x=>80+477*(x-min)/(max-min);
    const origin=pos(0),scaled=pos(offset),end=pos(offset+p.d);
    let g=caption('Indirizzi · scala con passi di 8 byte')+wire('M73 130 H575');
    for(let d=min;d<=max;d+=8)g+=wire('M'+pos(d)+' 126 v9');
    g+=text(origin,158,hex(b),13,dim,'middle')+text(origin,179,'base',12,dim,'middle');
    if(k>=1)g+=arrow(origin,87,scaled,87,true)+text((origin+scaled)/2,70,'indice × scala = '+offset,13,mint,'middle');
    if(k===2)g+=arrow(scaled,108,end,108,true)+wire('M'+end+' 110 v17',true)+text(350,198,'spiazzamento '+p.d+' B → '+values(s,k).Indirizzo,15,gold,'middle');
    return g+note('RDI = '+hex(b)+' · RSI = '+p.i+' · scala = '+p.s+' · spiazzamento = '+p.d+' B');
  });
  function matrix(p,k){
    let g=caption('Matrice 4 × 5 · int32',24)+caption('Memoria · offset da 0x3000',343);
    for(let i=0;i<4;i++)for(let j=0;j<5;j++){
      const x=25+52*j,xx=344+54*j,y=43+39*i,match=i===p.r&&j===p.c;
      g+=tile(x,y,48,33,i===p.r?(k>=1&&match?'focus':'active'):'quiet')+text(x+24,y+22,i+','+j,13,ink,'middle');
      g+=tile(xx,y,49,33,k>=2&&match?'focus':'quiet')+text(xx+24.5,y+22,'+'+4*(i*5+j),13,ink,'middle');
    }
    if(k>=2)g+=wire('M'+(50+52*p.c)+' '+(42+39*p.r)+' Q307 '+Math.max(26,28+39*p.r)+' '+(368+54*p.c)+' '+(42+39*p.r),true);
    return g;
  }
  draw('3.3',(p,s,k)=>matrix(p,k)+note(k===0?'Ogni riga misura 20 byte. Offset della riga '+p.r+' = '+values(s,k)['Offset riga']+' byte.':k===1?'Offset della colonna = '+values(s,k)['Offset colonna']+' byte.':'0x3000 + '+values(s,k)['Offset totale']+' = '+values(s,k).Indirizzo));
  draw('3.4',(p,s,k)=>{
    const ci=p.ordine==='ci',v=values(s,Math.min(k,2));
    const member=ci?['C','·','·','·','I','I','I','I']:['I','I','I','I','C','·','·','·'];
    let g=caption('Struttura System V AMD64 · ogni casella è un byte')
      +strip(58,member.map((x,i)=>k===0&&i>=(ci?1:4)?'·':x),i=>(ci?i===0:i<4)?'active':k>0&&member[i]!=='·'?'focus':'quiet',{h:52})
      +strip(117,member.map((_,i)=>'+'+i),()=> 'quiet',{h:27});
    g+=text(22,172,'C = char   I = int   · = '+(k===0?'da collocare':'riempimento'),13,dim);
    return g+note(k===2?'Struttura ['+p.i+'] a '+v['Inizio struttura']+' · secondo membro a '+v['Secondo membro']+'.':k===1?'Offset del secondo membro = '+v['Offset secondo']+' · padding interno '+v['Padding interno']+' · in coda '+v['Padding in coda']+'.':'I membri sono disposti in ordine di dichiarazione.');
  });
  draw('3.5',(p,s,k)=>{
    const x=i=>38+i*113;
    let g=caption('Array int[4] · il puntatore di fine segue l’ultima cella');
    for(let i=0;i<5;i++){const val=i===4?'limite':k>=1&&p.q===i?99:10*(i+1);
      g+=cell(x(i),91,101,58,hex(0x5000+4*i),val,k===2&&p.p===i?'focus':k===1&&p.q===i?(i===4?'danger':'active'):'quiet');}
    g+=text(x(p.p)+50,50,'p',17,mint,'middle')+arrow(x(p.p)+50,56,x(p.p)+50,88,k===2)
      +text(x(p.q)+50,205,'q',17,gold,'middle')+arrow(x(p.q)+50,188,x(p.q)+50,151,k===1);
    return g+note(k===2?'*p = '+values(s,2)['Valore letto']:k===1?'Scrittura attraverso q: '+values(s,1)['Scrittura eseguita']+'.':'Gli indici p e q individuano indirizzi distanti quattro byte per elemento.');
  });
  draw('3.6',(p,s,k)=>{
    const v=values(s,0),r=k===2?values(s,2):{};
    const fields=[...v['ss (binario)'],...v.index,...v.base];
    return caption('Byte SIB · scala (2 bit), indice (3 bit), base (3 bit)')
      +strip(56,fields,i=>i<2?'focus':i<5?'active':'quiet',{h:44})
      +text(96,132,'ss',14,gold,'middle')+text(279,132,'RCX',14,mint,'middle')+text(510,132,'RBX',14,dim,'middle')
      +cell(22,166,243,56,'opcode · ModR/M · SIB',k?values(s,1)['Byte istruzione']:'8B 04 ··',k===1?'focus':'quiet')
      +arrow(269,191,359,191,k===2)+cell(361,166,242,56,'indirizzo della lettura',r.Indirizzo??'?',k===2?'focus':'quiet');
  });
  draw('4.1',(p,s,k)=>{
    const amount=Number(p.k),v1=k>=1?values(s,1):{},v2=k===2?values(s,2):{};
    function row(y,title,value) {
      let g=text(20,y+25,title,15,ink);
      if(value===undefined)return g+strip(y,Array(8).fill('·'),()=> 'quiet',{x:100,w:408});
      return g+bits(y,value,8,j=>title!=='Input'&&j>=8-amount,{x:100,w:408});
    }
    return caption('Scorrimento di '+amount+' posizioni · celle in ambra = posizioni riempite')
      +row(43,'Input',p.x)+row(102,'SHR',v1.Byte)+row(161,'SAR',v2.Byte)
      +cell(517,95,90,50,'CF',v1.CF??'?',k===1?'focus':'quiet')
      +cell(517,154,90,50,'CF',v2.CF??'?',k===2?'focus':'quiet')
      +note('Bit di segno iniziale = '+((p.x>>7)&1)+' · SHR inserisce 0, SAR replica il bit di segno.');
  });
  draw('4.2',(p,s,k)=>{
    const index=k?Math.floor(p.k/8):0,value=k?values(s,1).RAX:values(s,0).RAX;
    const bytes=value.slice(2).padStart(16,'0').match(/../g);
    let g=caption('RAX · otto byte dal più significativo al meno significativo')
      +strip(54,bytes,j=>7-j===index?'focus':'quiet',{h:41})
      +strip(101,bytes.map((_,j)=>'byte '+(7-j)),()=> 'quiet',{h:26});
    if(k===2){g+=arrow(58+74.5*(7-index),132,322,157,true)
      +bits(166,values(s,2)['Valore del byte'],8,j=>j===p.k%8,{x:144,w:352,h:34});}
    return g+note(k===0?'Il bit iniziale si trova nella posizione 0. CL = '+p.k+'.':k===1?'SHL conserva un unico uno, ora in posizione '+p.k+'.':'Byte '+index+' × 8 + bit '+p.k%8+' = posizione '+p.k+'.');
  });
  draw('4.3',(p,s,k)=>{
    const high=values(s,0).Alto,low=values(s,0).Basso;
    let g=caption('Sorgenti · le quattro posizioni basse attraversano la maschera')
      +bits(51,p.h,8,j=>j<4,{x:20,w:275,h:34})+bits(51,p.l,8,j=>j<4,{x:341,w:275,h:34})
      +text(155,105,'alto = '+high,13,mint,'middle')+text(478,105,'basso = '+low,13,mint,'middle');
    if(k>=1)g+=arrow(155,113,203,152,true)+arrow(478,113,417,152,true);
    const composed=k>=1?[...binary(high,4),...binary(low,4)]:Array(8).fill('·');
    g+=strip(158,composed,j=>k?(j<4?'active':'focus'):'quiet',{x:96,w:448,h:43});
    return g+note(k===2?'OR combina i campi: '+values(s,2).Byte+'.':k===1?'Il primo semibyte pesa sedici volte il valore originario.':'La maschera comune è 0x0F.');
  });
  draw('4.4',(p,s,k)=>{
    let g=caption('Parola a sedici bit · campo da '+p.k+' a '+(p.k+p.w-1))
      +bits(43,p.v,16,j=>k>0&&j>=p.k&&j<p.k+p.w,{h:33});
    const mask=k?values(s,1)['Maschera allineata']:values(s,0).Maschera;
    g+=text(22,107,k?'maschera allineata':'maschera elementare',13,dim)
      +bits(121,mask,16,j=>binary(mask,16)[15-j]==='1',{h:32});
    if(k===2)g+=arrow(315,155,315,176,true)
      +bits(181,values(s,2).Valore,p.w,()=>true,{x:160,w:310,h:33});
    return g+note(k===2?'Campo riportato al bit zero = '+values(s,2).Valore+'.':'Larghezza del campo = '+p.w+' bit.');
  });
  draw('4.5',(p,s,k)=>{
    const counts=[6,5,5,16],fields=[p.op,p.a,p.b,p.imm],names=['opcode','registro A','registro B','immediato'];
    let x=21,g=caption('Formato didattico · campi adiacenti nella parola da 32 bit');
    counts.forEach((w,i)=>{
      const width=w*18.6,value=i===3&&k===0?'·'.repeat(16):binary(fields[i],w);
      g+=cell(x,61,width-2,59,names[i]+' · '+w+' bit',value,i===3&&k===0?'quiet':i%2?'focus':'active');
      if(k===2)g+=text(x+width/2,160,fields[i],16,ink,'middle');
      x+=width;
    });
    return g+note(k?'Parola composta = '+values(s,1).Parola+'.':'Opcode e registri occupano le posizioni superiori.');
  });

  const funregs=['RDI','RSI','RDX','RCX','R8','R9'],sysregs=['RDI','RSI','RDX','R10','R8','R9'];
  function border(){return '<path d="M320 40 V202" fill="none" stroke="'+gold+'" stroke-dasharray="3 5"/>';}
  draw('5.1',(p,s,k)=>{
    const start=values(s,0),v=k>=1?values(s,1):{},end=k===2?values(s,2):{};
    let g=caption('SPAZIO UTENTE',24)+caption('KERNEL',347)+border();
    g+=panelRows(25,45,231,[['RAX',k===2?end.RAX:start.RAX],['RDI',start.RDI],['RSI',start.RSI],['RDX',start.RDX]],k!==1?0:-1)
      +arrow(259,77,355,77,k===1)+cell(358,50,242,55,'servizio',p.req==='pid'?'getpid':'write',k===1?'focus':'quiet')
      +cell(358,124,113,55,'RCX',v.RCX??'?',k===1?'active':'quiet')+cell(478,124,124,55,'R11',v.R11??'?',k===1?'active':'quiet');
    if(k===2)g+=arrow(355,193,269,193,true);
    return g+note(k===2?'RAX restituito = '+end.RAX+' · '+end.Significato+'.':'SYSCALL salva RIP successivo in RCX e i flag in R11.');
  });
  draw('5.2',(p,s,k)=>{
    const i=p.arg-1,cx=70+i*99;
    return caption('ABI di funzione System V · argomenti da 1 a 6')
      +strip(44,funregs,j=>j===i?'focus':'quiet',{h:41})
      +arrow(cx,90,cx,147,k>=1)
      +text(i>3?22:370,126,k===0?'posizione '+p.arg:values(s,1)['Preparazione della posizione'],13,mint)
      +strip(152,sysregs,j=>k&&j===i?'focus':'quiet',{h:41})
      +note(k===2?'Ingresso nel kernel: '+p.v+' in '+sysregs[i]+'.':'ABI delle syscall Linux x86-64 · argomenti da 1 a 6');
  });
  draw('5.3',(p,s,k)=>{
    const n=p.n,read=k>=1?values(s,1)['RAX dopo read']:0,written=k===2?values(s,2)['Byte emessi']:0;
    const qty=Math.max(1,n);
    const blocks=Array.from({length:qty},(_,i)=>i);
    return caption('Buffer da 0x7000 · gli indici crescono verso destra')
      +strip(64,blocks,i=>i<written?'focus':i<read?'active':'quiet',{h:52})
      +text(23,144,'Richiesti '+n+' · disponibili '+p.cap+' · capacità prima write '+p.out,14,dim)
      +(k>=1?text(23,175,'Verde: byte letti ancora da emettere ('+(read-written)+')',14,mint):'')
      +(k===2?text(23,198,'Ambra: byte già emessi ('+written+')',14,gold):'')
      +note(k===2?'Prossimo indirizzo = '+values(s,2)['Puntatore successivo']:k===1?'read ha restituito '+read+' byte.':'Il descrittore di ingresso è fd 3.');
  });
  draw('5.4',(p,s,k)=>{
    const ok=p.file==='ok',v=values(s,k),image=k===2?v.Immagine:'A';
    let g=caption('execve · una stessa identità di processo')
      +tile(28,41,291,148,'active')+text(46,66,'PID '+p.pid,16,mint)
      +cell(47,84,120,65,'immagine',image,k===2?'focus':'quiet')
      +cell(174,84,126,65,'vecchia pagina',k===2&&ok?'rilasciata':'presente',k===2&&ok?'active':'quiet')
      +cell(386,42,204,60,'ricerca eseguibile',k?(ok?'presente':'ENOENT'):'?',k===1?(ok?'focus':'danger'):'quiet');
    if(k>=1)g+=arrow(378,84,325,84,true);
    g+=cell(371,136,230,56,'prossimo RIP',k===2?v.RIP:'?',k===2?'focus':'quiet');
    return g+note(k===2?(ok?'Il kernel trasferisce il controllo al punto di ingresso di B.':'Il chiamante prosegue in A e osserva −ENOENT.'):'Il vincolo esterno identifica il processo, il riquadro interno la sua immagine.');
  });
  draw('5.5',(p,s,k)=>{
    const v=values(s,k),shared=p.mode==='dup';
    const o3=k===2?v['Offset finale fd 3']:v['Offset fd 3'],o4=k===2?v['Offset finale fd 4']:v['Offset fd 4'];
    let g=caption('Tabella dei descrittori',25)+caption('Descrizioni di file aperto',374)
      +cell(29,54,110,51,'indice','fd 3',k===1?'focus':'quiet')+cell(29,140,110,51,'indice','fd 4',k===2?'focus':'quiet');
    if(shared){
      g+=wire('M140 80 H234 L353 118',k===1)+wire('M140 166 H234 L353 118',k===2)
        +cell(355,90,249,57,'offset condiviso',o3,'active');
    }else{
      g+=arrow(141,80,352,80,k===1)+arrow(141,166,352,166,k===2)
        +cell(355,52,249,57,'offset prima open',o3,k===1?'focus':'quiet')
        +cell(355,139,249,57,'offset seconda open',o4,k===2?'focus':'quiet');
    }
    return g+note(k===2?'Prima posizione letta da fd 4 = '+v['Primo byte letto']+'.':'Ogni read avanza il cursore della descrizione a cui punta il descrittore.');
  });
  draw('5.6',(p,s,k)=>{
    let g=caption('Codice richiesto dal figlio in RDI')+bits(40,p.code,16,j=>k>=1&&j<8,{h:31})
      +text(23,92,'parte bassa di RDI · ultimi 16 bit',12,dim)
      +caption('Stato della terminazione normale consegnato a waitpid',23,136);
    if(k===2)g+=bits(150,values(s,2)['Stato wait Linux'],16,j=>j>=8,{h:34});
    else g+=strip(150,Array(16).fill('·'),()=> 'quiet',{h:34});
    if(k===2)g+=wire('M454 77 Q453 117 172 146',true);
    return g+note(k===2?'WEXITSTATUS = '+values(s,2).WEXITSTATUS+'.':k===1?'exit usa il byte basso '+values(s,1)['Otto bit bassi di RDI']+'.':'Il codice richiesto è '+p.code+'.');
  });

  draw('6.1',(p,s,k)=>{
    const j=p.i-1,labels=[...funregs,'pila'];
    let g=caption('Argomenti interi di otto byte · i primi sei passano in registri');
    labels.forEach((r,i)=>{
      const x=23+i*85;
      g+=cell(x,50,80,63,'arg '+(i+1),p.base+i,i===j?'focus':'quiet');
      if(k>=1)g+=arrow(x+40,116,x+40,151,i===j);
      g+=tile(x,157,80,33,i===j&&k===2?'focus':'quiet')+text(x+40,179,k>=1?r:'·',14,ink,'middle');
    });
    return g+note(k===2?'Argomento '+p.i+' in '+values(s,2).Sede+' = '+values(s,2).Valore+'.':k===1?'Alla funzione [RSP] contiene il ritorno; il settimo argomento è a RSP + 8.':'L’argomento scelto occupa la posizione '+p.i+'.');
  });
  draw('6.2',(p,s,k)=>{
    const v=values(s,k),pc=Number(values(s,0).RIP),sp=Number(values(s,0).RSP);
    let g=caption('Flusso di controllo',23)+caption('Cima della pila',384)
      +cell(24,44,193,48,'CALL relativa',hex(pc),k===0?'focus':'quiet')
      +cell(24,105,193,48,'istruzione seguente',hex(pc+5),k===2?'focus':'quiet')
      +cell(24,167,193,48,'funzione chiamata','0x401000',k===1?'focus':'quiet')
      +panelRows(340,59,272,[[hex(sp),'quota iniziale'],[hex(sp-8),k===1?values(s,1)['[RSP]']:'·']],k===1?1:0);
    if(k===1)g+=wire('M218 127 C260 127 283 115 337 115',true);
    if(k===2)g+=wire('M338 115 C275 115 286 127 218 127',true);
    return g+note('RIP = '+v.RIP+' · RSP = '+v.RSP);
  });
  draw('6.3',(p,s,k)=>{
    const v=values(s,0),z=k?values(s,1):{},r=k===2?values(s,2):{};
    return caption('CMP conserva gli operandi · il salto seleziona il minimo')
      +cell(24,43,147,57,'AL',v.AL)+cell(24,135,147,57,'BL',v.BL)
      +wire('M173 71 H196 V119 H233',k===0)+wire('M173 163 H196 V119 H233',k===0)
      +cell(236,89,139,57,'salto',p.t==='s'?'JL':'JB',k===1?'focus':'quiet')
      +flags(z,p.t==='s'?['SF','OF']:['CF'],414,36,195)
      +arrow(378,119,472,148,k===2)
      +cell(430,149,176,59,k===2?'origine '+r.Origine:'byte scelto',r.Byte??'?',k===2?'focus':'quiet')
      +note(k===2?'Come intero '+(p.t==='s'?'con':'senza')+' segno il byte vale '+r.Interpretazione+'.':'Differenza temporanea a otto bit = '+v.Differenza+'.');
  });
  draw('6.4',(p,s,k)=>{
    const final=k===s.length-1,reached=Math.min(p.n,Math.max(0,k-1));
    const visible=final?values(s,k).Risultato:k>=2?values(s,k).EAX:0;
    let g=caption('Ciclo con contatore in ECX e accumulatore in EAX');
    const terms=Array.from({length:p.n},(_,i)=>p.n-i);
    if(terms.length)g+=strip(51,terms,i=>i===reached-1?'focus':i<reached?'active':'quiet',{h:39});
    else g+=text(22,81,'ECX = 0 · nessun termine da sommare',15,ink);
    g+=cell(45,147,194,56,'ECX residuo',p.n-reached)+cell(398,147,192,56,'EAX',visible,k>=2?'focus':'quiet');
    if(reached)g+=wire('M144 144 V120 H494 V144',k>=2);
    return g+note(final?'RET · risultato '+visible+'.':k===0?'La prima istruzione azzera EAX.':reached?'Il termine '+(p.n-reached+1)+' è entrato nell’accumulatore.':values(s,1).Percorso+'.');
  });
  draw('6.5',(p,s,k)=>{
    const pair=p.typ==='pair',v=values(s,Math.min(k,2)),n=pair?2:0;
    let g=caption('Aggregato passato per valore · gruppi di otto byte')
      +strip(49,pair?['double x','double y']:['double x','s[0..7]','s[8..15]','s[16..23]','s[24..31]'],()=> 'active',{h:40});
    const count=n+Number(p.extra==='d');
    if(k>=1){
      g+=arrow(304,95,304,133,true);
      if(pair)g+=strip(139,p.extra==='d'?['XMM0 · x','XMM1 · y','XMM2 · extra']:['XMM0 · x','XMM1 · y'],()=> 'focus',{h:37});
      else g+=cell(22,138,310,56,'area argomenti su stack','40 byte','active')+cell(364,138,243,56,'double successivo',v['Double successivo']??values(s,1)['Double successivo'],'focus');
    }
    return g+note(k===2?'Registri vettoriali impiegati = '+count+' · AL minimo = '+v['AL minimo']+'.':k===0?'Classe ABI = '+v.Classe+'.':'Il puntatore al formato è già in RDI.');
  });
  draw('6.6',(p,s,k)=>{
    const take=p.a<0,v=values(s,k);
    let g=caption('Grafo del controllo · JGE confronta SF e OF')
      +cell(24,89,154,54,'MOV EAX, EDI',values(s,0).EAX)
      +wire('M180 116 H206 V62 H247',k===1&&take)+wire('M180 116 H206 V170 H247',k===1&&!take)
      +cell(248,35,144,54,'EDI < 0','NEG EAX',k>=1&&take?'focus':'quiet')
      +cell(248,142,144,54,'EDI ≥ 0','salto a fine',k>=1&&!take?'focus':'quiet')
      +wire('M393 62 H425 V116 H459',k===2&&take)+wire('M393 170 H425 V116 H459',k===2&&!take)
      +cell(461,89,145,54,'EAX a RET',k===2?v.EAX:'?',k===2?'active':'quiet');
    return g+note(k===1?'SF = '+v.SF+' · OF = '+v.OF+' · '+v['Salto a fine']+'.':'Argomento con segno = '+p.a+'.');
  });
  draw('7.1',(p,s,k)=>{
    const base=0x8ff0,bytes=16*p.slots,sp=Number(values(s,k).RSP??values(s,k).RBP);
    let g=caption('Frame · indirizzi decrescenti verso il basso')
      +cell(111,37,292,46,'0x8FF8 .. 0x8FFF','ritorno 0x401123',k===0?'focus':'active')
      +cell(111,89,292,46,'0x8FF0 .. 0x8FF7',k>=1?'RBP salvato':'·',k===1?'focus':'quiet')
      +cell(111,141,292,53,k===2?hex(base-bytes)+' .. 0x8FEF':'area locale',k===2?bytes+' byte':'·',k===2?'focus':'quiet');
    const y=[61,113,168][k];
    g+=arrow(472,y,409,y,true)+text(484,y+5,'RSP',15,gold);
    if(k>=1)g+=text(88,115,'RBP →',13,mint,'end');
    return g+note('RSP = '+hex(sp)+(k>=1?' · RBP = 0x8FF0':'')+'.');
  });
  draw('7.2',(p,s,k)=>{
    const labels=['buffer','padding','contatore','controllo'],ends=[8,12,16,24];
    let g=caption('Layout sintetico · ciascuna cella occupa un byte');
    const x=i=>24+i*24.5;
    for(let i=0;i<24;i++){
      const color=k&&i<p.n?(i<8?'active':'danger'):'quiet';
      g+=tile(x(i),76,22,47,color)+text(x(i)+11,105,i,12,ink,'middle');
    }
    let left=0;ends.forEach((end,i)=>{
      g+=wire('M'+x(left)+' 136 v5 h'+((end-left)*24.5-2)+' v-5');
      g+=text((x(left)+x(end))/2,163,labels[i],12,dim,'middle');left=end;
    });
    if(k&&p.n)g+=arrow(x(p.n-1)+11,50,x(p.n-1)+11,73,true);
    return g+note(k===2?'Ultima regione raggiunta: '+values(s,2)['Ultima regione']+'.':k===1?'Richiesta '+p.n+' byte · primo offset esterno = '+values(s,1)['Primo offset esterno toccato']+'.':'La capacità del buffer è otto byte.');
  });
  draw('7.3',(p,s,k)=>{
    const state=values(s,k===2?1:k),v=values(s,k),guard=p.where==='guard';
    let g=caption('Confronto del byte di guardia prima del ritorno')
      +cell(28,49,168,58,'locale',state.Locale,k===1&&!guard?'focus':'quiet')
      +cell(226,49,171,58,'sentinella salvata',state['Byte salvato'],k===1&&guard?'focus':'active')
      +cell(443,49,164,58,'valore atteso','0xA6')
      +wire('M311 109 V138 H401 V157',k===2)+wire('M522 109 V138 H401 V157',k===2)
      +cell(289,159,224,54,'valutazione',k===2?v.Percorso:'?',k===2?(v.Uguali==='sì'?'active':'danger'):'quiet');
    return g+note(k===1?'La scrittura raggiunge '+(guard?'la sentinella.':'il locale.'):'Gli altri byte della sentinella sono uguali per ipotesi.');
  });
  draw('7.4',(p,s,k)=>{
    const initial=values(s,0),v=values(s,k);
    const targets=['[0x9000]','[0x9008]','[0x9010]'];
    let g=caption('Pila di destinazioni sintetiche · ogni RET consuma otto byte');
    targets.forEach((key,i)=>{
      const y=45+i*51;
      g+=tile(100,y,205,39,i<k?'active':'quiet')+text(111,y+24,initial[key],15,ink)
        +text(84,y+24,key.slice(1,-1),13,dim,'end');
      if(i===k)g+=arrow(368,y+19,309,y+19)+text(377,y+24,'RSP',12,gold);
    });
    const acc=k===3?values(s,2).Accumulatore:v.Accumulatore;
    g+=cell(438,77,161,60,'accumulatore',acc,k===1||k===2?'focus':'quiet');
    return g+note(k===3?'RSP = '+v.RSP+' · Fine arresta la traccia.':k===0?'Il primo RET leggerà la cella a 0x9000.':'RSP corrente = '+v.RSP+'.');
  });
  draw('7.5',(p,s,k)=>{
    const state=values(s,k),leaf=p.call==='leaf',only=p.call==='reg';
    const sp=0x9ff8;
    let g=caption('Spazio utente System V AMD64 · stack verso indirizzi minori');
    if(only){
      g+=cell(30,55,178,58,'RDI',p.arg)+arrow(210,84,294,84,k===1)
        +cell(296,55,212,58,'RAX',k?state.RAX:'?',k===1?'focus':'quiet')
        +cell(296,139,212,55,'RSP',state.RSP,k===2?'focus':'quiet');
      return g+note(k?'Nessuna riserva locale per il temporaneo.':'L’argomento entra nel registro.');
    }
    const n=Number(p.n),top=62,scale=.93,tempY=top+scale*n;
    g+=tile(119,top,243,119,'quiet')+text(114,top+4,hex(sp),12,dim,'end')
      +text(114,top+122,hex(sp-128),12,dim,'end')
      +text(237,top+106,'128 byte sotto RSP iniziale',12,dim,'middle');
    if(k===1){g+=tile(121,top+1,239,Math.max(6,scale*n),'active')
      +text(380,tempY+16,n+' byte di temporaneo',12,mint);}
    const pointer=k===1&&!leaf?tempY:top;
    g+=arrow(431,pointer,366,pointer,k===1)+text(442,pointer+5,'RSP',15,gold);
    return g+note(k===0?'RSP iniziale = '+hex(sp)+'.':k===1?'Temporaneo a '+values(s,1)['Inizio temporaneo']+' · riserva esplicita '+values(s,1)['Byte sottratti a RSP']+' B.':'Fine dell’uso: RSP = '+state.RSP+'.');
  });
  draw('7.6',(p,s,k)=>{
    const state=values(s,Math.min(k,1)),v=values(s,k),change=p.case==='ret';
    let g=caption('CET · due copie dell’indirizzo di ritorno')
      +cell(28,46,229,62,'pila ordinaria',state.Ordinario,k===1&&change?'focus':'active')
      +cell(382,46,229,62,'pila ombra protetta',state.Ombra,'active')
      +wire('M144 111 V141 H318 V157',k===2)+wire('M495 111 V141 H318 V157',k===2)
      +cell(209,158,224,54,'RET · esito',k===2?v.Esito:'?',k===2?(change?'danger':'active'):'quiet');
    return g+note(k===1?'Dato locale: '+state['Dato locale']+'.':'La verifica confronta le destinazioni al momento di RET.');
  });
  draw('7.7',(p,s,k)=>{
    const slots=Math.max(1,p.cap,p.n+1),pitch=584/slots,ok=p.n<p.cap;
    let g=caption('Buffer destinazione · ogni cella rappresenta un byte');
    for(let i=0;i<slots;i++){
      const x=28+i*pitch,inBuffer=i<p.cap;
      if(inBuffer){
        const write=k===2&&ok&&i<=p.n;
        g+=tile(x,95,pitch-1.2,46,write?(i===p.n?'focus':'active'):'quiet')
          +text(x+pitch/2,123,write?(i===p.n?'0':'d'):'·',13,ink,'middle');
      }else{
        g+='<rect x="'+x+'" y="95" width="'+(pitch-1.2)+'" height="46" fill="none" stroke="'+(i===p.n&&k>=1?'#f3a592':'#45604f')+'" stroke-dasharray="2 3"/>';
      }
    }
    const dest=28+(p.n+.5)*pitch;
    if(k>=1)g+=arrow(dest,62,dest,91,true);
    g+=text(28,170,'capacità '+p.cap+' B · contenuto '+p.n+' B · terminatore 1 B',14,dim);
    return g+note(k===2?values(s,2).Decisione+' · byte scritti = '+values(s,2)['Byte scritti']+'.':k===1?'Il terminatore richiede la cella di indice '+p.n+'.':'Le celle tratteggiate sono esterne al buffer.');
  });

  Object.assign(SL.sceneLab,scenes);

  const demoParam=(id,label,min,max,iniziale)=>({id,label,min,max,step:1,iniziale});
  const demoStage=(titolo,testo,campi)=>({titolo,testo,valori:Object.entries(campi)});
  const matrixValue=(r,c)=>16*r+c+1;
  SL.moduliAnimati[2]={
    titolo:'Dalla cella di matrice al valore in EAX',
    teoria:SL.lezioni['modulo-2'].join(' '),
    domanda:'Quale valore contiene EAX dopo il caricamento della cella e l’addizione?',
    istruzione:'Scegli una cella e segui RDX fino al caricamento. Mantieni poi la stessa riga e colonna, cambia solo la variazione e confronta EAX dopo ADD.',
    osservazione:'Riga e colonna determinano l’indirizzo e i quattro byte letti. A parità di cella, MOV carica sempre lo stesso valore in EAX. Con due addendi diversi i valori di EAX divergono quando ADD scrive il risultato.',
    controlli:[demoParam('r','Riga (da 0)',0,3,2),demoParam('c','Colonna (da 0)',0,4,3),demoParam('delta','Variazione dopo il caricamento',-32,32,4)],
    previsione:{label:'EAX finale in esadecimale',valore:(p,s)=>values(s,s.length-1).EAX},
    calcola(p){
      const linear=5*p.r+p.c,offset=4*linear,addr=0x3000+offset;
      const value=matrixValue(p.r,p.c),sum=BigInt(value)+BigInt(p.delta);
      const result=BigInt.asUintN(32,sum),operand=BigInt.asUintN(32,BigInt(p.delta)),cf=BigInt(value)+operand>0xffffffffn;
      return [
        demoStage('Seleziona la riga','Ogni riga occupa 5 × 4 = 20 byte. RDI contiene la base e il cursore attraversa le righe precedenti.',{RDI:'0x3000','Riga':p.r,'Offset riga (B)':20*p.r}),
        demoStage('Forma l’indice lineare','LEA RCX,[RSI+RSI*4] forma 5r da RSI = r. ADD RCX,RBX somma la colonna c contenuta in RBX.',{RSI:p.r,RBX:p.c,RCX:linear}),
        demoStage('Calcola l’indirizzo efficace','LEA RDX,[RDI+RCX*4] applica la dimensione di un int32 e aggiunge la base.',{'Offset totale (B)':offset,RDX:hex(addr)}),
        demoStage('Leggi i quattro byte','MOV EAX,[RDX] carica i quattro byte a partire dall’indirizzo calcolato. Il primo byte letto ha peso uno.',{'Indirizzo':hex(addr),'Byte a indirizzi crescenti':hex(value,2).slice(2)+' 00 00 00',EAX:hex(value,8)}),
        demoStage('Aggiorna il registro e i flag','ADD EAX,imm somma la variazione. EAX conserva i 32 bit bassi. CF segue il riporto senza segno, ZF indica un registro nullo e SF copia il bit 31.',{'Variazione con segno':p.delta,EAX:hex(result,8),'Valore con segno':Number(BigInt.asIntN(32,result)),CF:Number(cf),ZF:Number(result===0n),SF:Number((result>>31n)&1n),OF:0})
      ];
    },
    disegna(p,s,k){
      if(k<3){
        const v=values(s,k);
        return matrix(p,k)+note(k===0?'Base 0x3000 · offset della riga = '+v['Offset riga (B)']+' B.':k===1?'RCX = 5 × '+p.r+' + '+p.c+' = '+v.RCX+'.':'RDX = '+v.RDX+' · LEA ha prodotto un indirizzo.');
      }
      const loaded=values(s,3),addr=Number(loaded.Indirizzo),bytes=loaded['Byte a indirizzi crescenti'].split(' '),v=values(s,k);
      let g=caption('Lettura della cella ['+p.r+']['+p.c+'] • indirizzi crescenti');
      bytes.forEach((b,i)=>g+=cell(21+151*i,44,145,52,hex(addr+i),b,k===3?'focus':'quiet'));
      g+=wire('M318 99 V126 H151 V146',k===3)
        +cell(29,146,209,56,'EAX · MOV',loaded.EAX,k===3?'focus':'active')
        +arrow(241,175,385,175,k===4)
        +cell(389,146,211,56,'EAX · ADD '+p.delta,k===4?v.EAX:'?',k===4?'focus':'quiet');
      return g+note(k===4?'CF = '+v.CF+'   ZF = '+v.ZF+'   SF = '+v.SF+'   OF = '+v.OF:'Il valore della cella arriva in EAX. RDX conserva l’indirizzo.');
    }
  };
})();
