'use strict';

(() => {
  const colors = {line:'#6d634e', dim:'#c7c0b0', text:'#f2eee6', ink:'#241e10',
    on:'#8cd4da', live:'#f4c782', paint:'#193031', amber:'#41351e'};
  const esc = SL.pen.e;
  const hex = n => '0x'+n.toString(16).toUpperCase().padStart(2,'0');
  const binary = (v,n) => Number(v).toString(2).padStart(n,'0');
  const vals = (s,k) => Object.fromEntries(s[k].valori);
  const pipeStages = ['F','D','E','M','W'];
  const unknown = '·';
  const text = (x,y,msg,size=14,anchor='start',color=colors.text) =>
    '<text x="'+x+'" y="'+y+'" font-family="ui-monospace,monospace" font-size="'+size+'" fill="'+color+'" text-anchor="'+anchor+'">'+esc(msg)+'</text>';
  const rect = (x,y,w,h,mode='',radius=4) => SL.symbols.panel(x,y,w,h,mode==='hot'?colors.amber:mode==='on'?colors.paint:colors.ink,mode==='hot'?colors.live:mode==='on'?colors.on:colors.line,mode==='hot'?'reveal':'');
  function stroke(d,active=false){
    return '<path d="'+d+'" fill="none" stroke="'+(active?colors.on:colors.line)+'" stroke-width="'+(active?2.5:1.3)+'" stroke-linejoin="round"/>';
  }
  function wire(d,active=false){
    return stroke(d,active)+(active?pulse(d):'');
  }
  const pulse=SL.pen.travel;
  function title(t){return text(22,24,t,14,'start',colors.on);}
  function card(x,y,w,h,label,value,mode=''){
    if(SL.symbols.kind(label))return SL.symbols.node(x,y,w,h,label,value,mode);
    const size = Math.max(10,Math.min(17,Math.floor((w-12)/(0.62*Math.max(1,String(value).length)))));
    return rect(x,y,w,h,mode)+text(x+w/2,y+18,label,12,'middle',colors.dim)+text(x+w/2,y+h-10,value,size,'middle');
  }
  function tile(x,y,w,h,value,mode=''){
    return rect(x,y,w,h,mode,3)+text(x+w/2,y+h/2+5,value,14,'middle',mode==='hot'?colors.live:colors.text);
  }
  function dot(x,y,r,value,active=false){
    return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(active?colors.amber:colors.ink)+'" stroke="'+(active?colors.live:colors.line)+'" stroke-width="2"/>'+text(x,y+5,value,17,'middle');
  }
  function busBytes(x,y,bytes,labels={},selected=-1){
    const gap=3, width=Math.min(59,Math.floor((610-x)/bytes.length)-gap);
    return bytes.map((b,i)=>tile(x+i*(width+gap),y,width,34,b,i===selected?'hot':b===unknown?'':'on')+
      text(x+i*(width+gap)+width/2,y+53,labels[i]??i,11,'middle',colors.dim)).join('');
  }
  function footer(msg){return text(22,232,msg,Math.min(13,Math.floor(960/Math.max(1,msg.length))),'start',colors.dim);}
  function timingBar(y,name,items,scale,max){
    const x0=161,w=420;let before=0;
    let g=text(18,y+19,name,13)+stroke('M'+x0+' '+(y+26)+'h'+w);
    for(const [duration,label,mode] of items){
      const x=x0+w*before/scale, width=w*duration/scale;
      if(duration>0){g+=rect(x,y,width,25,mode,1);if(width>label.length*7+6)g+=text(x+width/2,y+17,label,11,'middle');}
      before+=duration;
    }
    if(max!==undefined)g+=text(x0+w*before/scale,y+43,max,12,'middle',colors.live);
    return g;
  }
  function majority(p,s,k){
    let g=title('MAJ(A,B,C) = AB ∨ AC ∨ BC');
    const branches=[['A · B',p.a,p.b],['A · C',p.a,p.c],['B · C',p.b,p.c]];
    for(let j=0;j<3;j++){
      const y=59+j*56,[name,l,r]=branches[j],v=l&r;
      g+=text(25,y+15,name+'  '+l+', '+r)+wire('M120 '+(y+10)+'H165',k===1);
      g+=card(165,y-13,108,46,'AND',k>=1?v:unknown,k===1&&v?'hot':'');
      g+=wire('M273 '+(y+10)+'H'+(317+j*18)+'V125H407',k===2&&!!v);
    }
    g+=card(407,95,108,58,'OR',k===2?vals(s,k).Uscita:unknown,k===2?'hot':'')+
      wire('M515 125 H575',k===2)+dot(594,125,15,k===2?vals(s,k).Uscita:unknown,k===2);
    return g+footer('Una coppia con due ingressi a 1 attiva il ramo verso OR.');
  }
  function mux(p,s,k){
    const sel=p.s&1, pair=p.s>>1;
    let g=title('MULTIPLEXER 4 → 1 · S1 S0 = '+binary(p.s,2));
    for(let j=0;j<4;j++){
      const y=50+j*44,cy=75+Math.floor(j/2)*93;
      g+=tile(24,y,95,30,'I'+j+' = '+p['x'+j],j===p.s&&k===2?'hot':'');
      g+=wire('M119 '+(y+15)+'H152L194 '+cy,k>=1&&j%2===sel);
    }
    for(let j=0;j<2;j++){
      const y=52+j*93;g+=card(194,y,116,55,'S0 = '+sel,k>=1?p['x'+(2*j+sel)]:unknown,k===1?'hot':'');
      g+=wire('M310 '+(y+24)+'H352L404 124',k===2&&j===pair);
    }
    return g+card(404,98,123,54,'S1 = '+pair,k===2?vals(s,k).Uscita:unknown,k===2?'hot':'')+footer('Ogni selettore di primo livello sceglie una parola della propria coppia.');
  }
  function ripple(p,s,k){
    let g=title('PAROLE A QUATTRO BIT · SOMMA DALLA COLONNA DI PESO 1');
    for(let i=0;i<4;i++){
      const x=24+(3-i)*155,done=k>=i+1,here=k===i+1;
      const a=(p.a>>i)&1,b=(p.b>>i)&1,cin=i? (k>=i?vals(s,i)['C'+i]:unknown):p.c;
      g+=card(x,55,126,66,'peso '+(1<<i),a+' + '+b+' + '+cin,here?'hot':done?'on':'');
      g+=stroke('M'+(x+63)+' 121V150',done)+tile(x+28,150,70,42,'S'+i+'='+ (done?vals(s,i+1)['S'+i]:unknown),done?'on':'');
      if(i<3)g+=wire('M'+x+' 90 h-29',here);
      if(done)g+=text(x+63,139,'C'+(i+1)+' = '+vals(s,i+1)['C'+(i+1)],12,'middle',colors.live);
    }
    return g+footer(k===5?'Parola: '+vals(s,5).Somma+'    C4: '+vals(s,5).C4+'    Totale senza segno: '+vals(s,5).Totale:'Ogni cella produce un bit di somma e passa il riporto alla cella alla sua sinistra.');
  }
  function decodeALU(p,s,k){
    const sel=['add','sub','and','xor'].indexOf(p.f),signal=['B + A','B − A','B AND A','B XOR A'];
    let g=title('ALU A 8 BIT · DECODIFICA '+binary(sel,2));
    g+=card(22,85,115,54,'B / A',hex(p.b)+' / '+hex(p.a));
    for(let i=0;i<4;i++){
      const y=42+i*43;g+=stroke('M137 112H152V'+(y+14)+'H174',k>=1)+
      tile(174,y,97,30,signal[i],k>0?'on':'')+text(288,y+20,k? s[1].valori[i][1]:unknown,14)+
      wire('M345 '+(y+14)+'H'+(359+i*12)+'L437 120',k===2&&i===sel);
    }
    g+=card(437,90,165,64,'uscita del selettore',k===2?vals(s,2).Risultato:unknown,k===2?'hot':'');
    return g+footer(k===2?'Rilevatore di zero: ZF = '+vals(s,2).ZF:'Il selettore riceve quattro parole della stessa larghezza.');
  }
  function propagation(p,s,k){
    const meet=Math.max(p.and,p.xor),scale=meet+p.or;
    let g=title('DUE ARRIVI ALLA PORTA OR · TEMPI MASSIMI IN ps');
    g+=timingBar(42,'A,B → AND',k>=1?[[p.and,'AND','on']]:[],scale,k>=1?p.and:undefined);
    g+=timingBar(99,'C,D → XOR',k>=1?[[p.xor,'XOR','on']]:[],scale,k>=1?p.xor:undefined);
    if(k===2){const x=161+420*meet/scale;g+=stroke('M'+x+' 122V168',true)+wire('M'+x+' 168H581',true)+text(580,191,scale+' ps',15,'end',colors.live);}
    return g+footer(k===2?'Il cammino '+vals(s,2)['Cammino critico']+' fissa il limite di '+scale+' ps.':'Il tempo zero coincide con la variazione degli ingressi.');
  }
  function carriesAndFlags(p,s,k){
    let g=title('OTTO BIT · RIPORTO DI GRUPPO E LETTURA CON SEGNO');
    const rows=[['A',binary(p.a,8)],['B',binary(p.b,8)],['S',k>=1?binary((p.a+p.b)&255,8):unknown.repeat(8)]];
    rows.forEach(([name,bits],j)=>{g+=text(30,76+42*j,name);for(let i=0;i<8;i++)g+=tile(58+i*41+(i>=4?12:0),53+j*42,37,30,bits[i],j===2&&k>=1?'on':'');});
    g+=card(430,48,182,46,'CF · senza segno',k>=1?vals(s,1).CF:unknown,k===1?'hot':'')+
      card(430,111,182,46,'OF · con segno',k===3?vals(s,3).OF:unknown,k===3?'hot':'');
    if(k>=2)g+=text(60,191,'C4 = '+vals(s,2)['Riporto dei quattro bit bassi C4']+'   G = '+vals(s,2)['G alto']+'   P = '+vals(s,2)['P alto'],15,'start',colors.live);
    return g+footer(k===3?'Lettura con segno: somma matematica '+vals(s,3)['Somma matematica']+', parola letta '+vals(s,3)['Lettura del risultato']+'.':'I due semibyte formano i gruppi di propagazione e generazione.');
  }
  function enabledRegister(p,s,k){
    let g=title('DUE REGISTRI CON ABILITAZIONE COMUNE');
    g+=card(23,92,116,51,'dato D',binary(p.d,4))+
      text(210,45,'carica = '+p.en,15,'start',colors.live);
    for(let j=0;j<2;j++){
      const y=71+j*86,old=j?p.b:p.a,name='Q'+(j+1);
      g+=wire('M139 118H161V'+(y+20)+'H205',k===1&&!!p.en);
      g+=tile(205,y,82,37,'MUX',k===1?'hot':'')+
        wire('M287 '+(y+19)+'H372',k===2)+
        card(372,y-11,172,59,name,k===2?vals(s,2)[name]:binary(old,4),k===2?'hot':'');
      const loop='M544 '+(y+17)+'H572V'+(y+55)+'H242V'+(y+38);
      g+=wire(loop,k===1&&!p.en);
    }
    return g+footer('L’abilitazione sceglie fra il bus D e la retroazione della singola uscita.');
  }
  function waveforms(p,s,k){
    let g=title('STATO DOPO OGNI EVENTO · ASSE TEMPORALE SCHEMATICO');
    const x0=128,dx=79;
    ['Clock','D','Q latch','Q flip-flop'].forEach((name,j)=>{
      const y=65+38*j;g+=text(21,y+4,name,14)+stroke('M'+x0+' '+(y+9)+'H605');
      let d='';
      for(let i=0;i<=k;i++){const level=vals(s,i)[name],pos=y+(level?-11:9);d+=(i?' V':'M'+x0+' ')+pos+' H'+(x0+(i+1)*dx);}
      g+=stroke(d,true)+dot(x0+(k+1)*dx,y+(vals(s,k)[name]?-11:9),5,'',true);
    });
    for(let i=0;i<s.length;i++)g+=text(x0+(i+0.5)*dx,207,'t'+i,12,'middle',i===k?colors.live:colors.dim);
    return g+footer(s[k].titolo+' · clock '+vals(s,k).Clock+'  /  D '+vals(s,k).D);
  }
  function registerBank(p,s,k){
    let g=title('BANCO A DUE PORTE DI LETTURA E UNA DI SCRITTURA');
    const words=[2,5,11,13];if(k===2&&p.en)words[p.w]=p.v;
    words.forEach((v,i)=>{
      const y=44+i*42;g+=tile(223,y,112,32,'R'+i+' = '+v,i===p.w&&k>0&&p.en?'hot':'');
      if(i===p.a||i===p.b){
        if(i===p.a)g+=wire('M335 '+(y+16)+'H365V74H453',k!==1);
        if(i===p.b)g+=wire('M335 '+(y+16)+'H386V161H453',k!==1);
      }
    });
    g+=card(16,84,131,60,'bus di scrittura',p.v,k===1?'hot':'')+wire('M147 115H182V'+(60+42*p.w)+'H223',k===1&&!!p.en);
    const outputs=k===2?vals(s,2):vals(s,0);
    return g+card(453,47,149,52,'A seleziona R'+p.a,outputs['Porta A'],'on')+
      card(453,133,149,52,'B seleziona R'+p.b,outputs['Porta B'],'on')+footer('Il fronte aggiorna la parola selezionata soltanto con scrittura abilitata.');
  }
  function clockMargins(p,s,k){
    const latest=30+p.max, earliest=12+p.min, scale=Math.max(250,p.t,latest+15),x=t=>104+470*t/scale;
    let g=title('STABILITÀ DEL DATO · REGISTRO RICEVENTE');
    g+=text(18,89,'setup',14)+text(18,160,'hold',14);
    for(const y of [82,151])g+=stroke('M104 '+y+'H590');
    g+=rect(x(p.t-15),68,x(15)-x(0),28,'on',0)+rect(x(0),137,x(18)-x(0),28,'on',0);
    g+=text(x(p.t),50,'fronte a '+p.t+' ps',12,'middle')+stroke('M'+x(p.t)+' 55V108')+text(103,195,'0 ps',12);
    if(k>=1)g+=dot(x(latest),82,5,'',true)+text(105,119,'Arrivo lento: '+latest+' ps · margine '+vals(s,1)['Margine setup (ps)']+' ps',13);
    if(k===2)g+=dot(x(earliest),151,5,'',true)+text(105,183,'Arrivo veloce: '+earliest+' ps · margine '+vals(s,2)['Margine hold (ps)']+' ps',13);
    return g+footer('Finestre richieste: 15 ps prima del fronte successivo e 18 ps dopo quello corrente.');
  }
  function vending(p,s,k){
    const q=vals(s,k),b=q['Credito prima'],a=q['Credito dopo'];
    let g=title('DISTRIBUTORE · PREZZO 3 UNITÀ');
    [0,1,2].forEach((v,i)=>{g+=dot(122+181*i,105,29,v,v===b);});
    const from=122+b*181,to=122+a*181,d=from===to?'M'+(from-20)+' 82 C'+(from-60)+' 34 '+(from+60)+' 34 '+(from+20)+' 82':'M'+from+' 135 Q'+((from+to)/2)+' 179 '+to+' 135';
    g+=wire(d,true)+text(309,64,'Moneta '+(k+1)+' = '+q.Moneta,14,'middle',colors.live);
    return g+text(25,201,'credito '+b+' → '+a+'     '+(q.Eroga?'prodotto erogato':q.Restituisce?'moneta restituita':'credito memorizzato'),16)+footer('I tre nodi rappresentano i valori di credito che la macchina conserva.');
  }
  function archISA(p,s,k){
    const initial=vals(s,0),curr=k===2?vals(s,2):initial;
    let g=title(p.op+' %rax, %rbx');
    g+=card(23,46,176,59,'%rax',curr['%rax'])+card(23,125,176,59,'%rbx',curr['%rbx'],k===2?'hot':'')+
      wire('M199 74H219V99H249',k===1)+(p.op==='addq'?wire('M199 154H231V111H249',k===1):'')+
      card(249,76,152,59,p.op==='addq'?'ALU · somma':'porta di copia',k>=1?vals(s,1).Risultato:unknown,k===1?'hot':'')+
      wire('M400 110H417V154H199',k===2)+card(458,47,150,55,'PC',curr.PC,k===2?'on':'');
    return g+text(248,193,curr.CC??curr['CC iniziali'],15,'start',colors.on)+footer('La scrittura in %rbx e l’avanzamento del PC appartengono allo stato successivo.');
  }
  function instructionFormat(p,s,k){
    const a=vals(s,0),seq=vals(s,1).Sequenza.split(' '),hasReg=vals(s,1)['Byte rA:rB']!=='Assente';
    const shown=k?seq:[seq[0],...seq.slice(1).map(()=>unknown)];
    let g=title('FORMATO Y86-64 · '+p.op)+busBytes(26,65,shown,Object.fromEntries(shown.map((_,i)=>[i,'+'+i])),0);
    g+=text(26,151,'byte iniziale = icode '+a.icode+' | ifun '+a.ifun);
    if(k>=1)g+=text(26,180,(hasReg?'rA:rB = '+seq[1]+'   ':'')+'valC = '+vals(s,1).valC);
    return g+footer(k===2?'PC '+vals(s,2).PC+' + '+seq.length+' byte → valP '+vals(s,2).valP:'Ogni colonna rappresenta un byte a indirizzo crescente.');
  }
  function loadWord(p,s,k){
    const address=p.b+p.d,cells=k?vals(s,1)['Byte in ordine di indirizzo'].split(' '):Array(8).fill(unknown);
    let g=title('mrmovq D(%rbx), %rax · MEMORIA LITTLE-ENDIAN');
    g+=text(26,64,'valB '+p.b+'   +   valC '+p.d+'   →   valE '+(k?hex(address):unknown),17)+
      busBytes(29,88,cells,Object.fromEntries(cells.map((_,i)=>[i,k?hex(address+i):unknown])));
    const d='M80 147 V168 H198';g+=wire(d,k===2)+card(198,155,360,49,'%rax · 64 bit',k===2?vals(s,2)['%rax = valM']:unknown,k===2?'hot':'');
    return g+footer('Il byte a indirizzo minore occupa gli otto bit di peso minore in %rax.');
  }
  function isaStatus(p,s,k){
    const load=p.op==='ld',start=30,dx=7.7;
    let g=title('VALIDAZIONE DEL PRELIEVO E DELLA PAROLA DATI')+card(23,43,192,55,'primo byte',vals(s,0)['Primo byte'])+
      wire('M215 71H259',k===1)+card(259,43,152,55,'decodifica',k>0?({ld:'mrmovq',halt:'halt',bad:'riservata'})[p.op]:unknown,k===1?'hot':'')+
      wire('M411 71H459',k===2)+card(459,43,142,55,'Stat',k===2?vals(s,2).Stat:unknown,k===2?'hot':'');
    g+=text(26,131,'Memoria dati: indirizzi da 0 a 63',13)+rect(start,153,64*dx,30,'on')+text(start,205,'0',12)+text(start+64*dx,205,'63 | 64',12,'middle');
    if(k>=1&&load){const x=start+p.addr*dx;g+=rect(x,148,8*dx,40,'hot')+text(x+4*dx,176,'8 B',12,'middle');}
    return g+footer(k>=1&&load?'Ultimo byte richiesto = '+(p.addr+7)+'.':'Solo un caricamento richiede la verifica della finestra di otto byte.');
  }
  function callRet(p,s,k){
    const v=vals(s,k),saved=vals(s,0).valP;
    let g=title('CALL E RET · LA PAROLA SALVATA SULLA PILA');
    g+=card(25,46,175,59,'PC',v.PC,k===2?'hot':'')+card(25,130,175,56,'%rsp',k===0?hex(p.sp):v['%rsp'],k>0?'on':'')+
      text(364,44,'PAROLA DI PILA',14,'middle',colors.on)+card(294,76,260,73,'M8['+hex(p.sp-8)+']',k?saved:unknown,k===1?'hot':'')+
      text(295,177,k===2?'parola liberata':'indirizzo della cima',13,'start',colors.dim);
    g+=k===1?wire('M202 74H255V96H292',true):k===2?wire('M294 125H240V75H201',true):'';
    return g+footer(k===0?'valP = '+saved+'; la destinazione della call è '+hex(p.t)+'.':k===1?'Il nuovo PC è l’indirizzo della subroutine.':'Il PC riprende dall’indirizzo letto sulla vecchia cima.');
  }
  function assembly(p,s,k){
    const n=p.n, block=[['irmovq',10],['jmp',9],['nop × '+n,n],['halt',1]];
    let g=title('DUE PASSATE · DALL’ETICHETTA AI BYTE');
    let pos=26;const unit=560/(20+n);
    for(const [name,len] of block){if(len){const w=len*unit;g+=rect(pos,55,w,31,name==='halt'&&k===1?'hot':'on',1)+text(pos+w/2,76,w>name.length*8?name:name==='halt'?'H':'N',11,'middle');}pos+=len*unit;}
    g+=text(26,106,'origine '+hex(p.pc),13)+text(589,106,k>=1?'fine = '+vals(s,1).fine:'fine',13,'end',colors.live);
    if(k===2)g+=busBytes(28,134,vals(s,2)['Byte del jmp'].split(' '));
    return g+footer(k===2?'70 è il codice di jmp. Le otto celle seguenti contengono l’indirizzo assoluto.':'La lunghezza dei segmenti è proporzionale ai byte occupati.');
  }
  function seqSubtract(p,s,k){
    let g=title('SEQ · subq %rax, %rbx · UN SOLO PERIODO');
    const nodes=[['F','61 03'],['D',k>=1?p.a+' ; '+p.b:unknown],['E',k>=2?vals(s,2).valE:unknown],['M',k>=3?'inattiva':unknown]];
    nodes.forEach(([n,nval],i)=>{const x=24+i*116;g+=card(x,62,94,57,n,nval,i===k?'hot':i<k?'on':'');if(i<3)g+=wire('M'+(x+94)+' 92 h22',i+1===k);});
    g+=stroke('M482 40V194',true)+text(482,37,'fronte',12,'middle',colors.dim);
    g+=card(501,63,118,59,'%rbx',k===4?vals(s,4)['%rbx']:p.b,k===4?'hot':'')+
      card(501,142,118,50,'PC',k===4?vals(s,4).PC:hex(p.pc),k===4?'hot':'');
    g+=wire('M299 121V145H494V94H501',k===4);
    if(k>=2)g+=text(24,179,vals(s,2)['Nuovi CC'],14);
    return g+footer('Le fasi F, D, E e M descrivono propagazione interna fra due fronti.');
  }
  function pushPaths(p,s,k){
    const end=p.sp-8;
    let g=title('PUSHQ · UN DATO E DUE DESTINAZIONI DI valE');
    g+=card(22,51,135,51,'valA · %rax',p.v)+card(22,133,135,51,'valB · %rsp',p.sp)+
      card(237,133,136,51,'ALU · −8',k>=1?end:unknown,k===1?'hot':'')+wire('M157 158H237',k===1);
    g+=card(458,49,155,53,'dato alla memoria',k===2?p.v:unknown,k===2?'on':'')+
      card(458,119,155,50,'indirizzo in RAM',k===2?hex(end):unknown,k===2?'hot':'')+
      text(458,203,'RSP ← '+(k===2?hex(end):unknown),15);
    g+=wire('M157 76H458',k===2)+wire('M373 158H412V143H458',k===2)+wire('M410 158V198H450',k===2);
    return g+footer('La sottrazione di otto prepara la nuova cima. valA resta il dato da salvare.');
  }
  function seqPaths(p,s,k){
    const common=p.fetch+75,maximum=common+Math.max(p.mem,p.mux)+15;
    const segs=[[p.fetch,'fetch','on'],[30,'reg',''],[45,'ALU','on']];
    let g=title('DUE PERCORSI FISICI · TEMPI IN ps');
    g+=timingBar(53,'Aritmetica',[...segs,...(k>=1?[[p.mux,'mux','hot']]:[])],maximum,k>=1?common+p.mux:common);
    g+=timingBar(122,'Carico',[...segs,...(k>=1?[[p.mem,'memoria','hot']]:[])],maximum,k>=1?common+p.mem:common);
    if(k===2){const x=161+420*(maximum-15)/maximum;g+=wire('M'+x+' 188H581',true)+text(588,194,'T',13);}
    return g+footer(k===2?'Ai '+(maximum-15)+' ps del percorso più lungo si aggiungono 15 ps per i registri.':'I due percorsi condividono prelievo, lettura registri e ALU.');
  }
  function stackMux(p,s,k){
    const push=p.op==='pushq',v=k?vals(s,1):{},phys=k===2?vals(s,2):{};
    let g=title(p.op+' %rax · PORTA INDIRIZZI, MEMORIA E REGISTRI');
    g+=card(22,48,132,50,'vecchia cima',p.sp)+card(22,121,132,50,'nuova cima',k>=1?v.valE:unknown)+
      wire('M154 74 H189 L227 103',k>=1&&!push)+wire('M154 148 H189 L227 109',k>=1&&push)+
      card(227,78,144,57,'mem_addr',k>=1?v.mem_addr:unknown,k===1?'hot':'')+
      wire('M371 107 H430',k>=1)+card(430,76,177,58,push?'scrittura RAM':'lettura RAM',k===2?phys['Valore trasferito']:unknown,k===2?'hot':'');
    g+=text(24,199,'RSP = '+(k===2?phys['%rsp']:p.sp)+'      RAX = '+(k===2?phys['%rax']:p.v),16);
    return g+footer('La classe decide se indirizzare la memoria con la vecchia o la nuova cima.');
  }
  function seqVsMulti(p,s,k){
    const seq=vals(s,0)['Tempo SEQ (ps)'],multi=vals(s,2)['Tempo multiciclo (ps)'];
    const scale=Math.max(seq,multi);let g=title('TEMPO ASSOLUTO · '+p.a+' ARITMETICHE + '+p.l+' CARICHI');
    g+=timingBar(55,'SEQ · ps',[[p.a*240,'aritmetiche','on'],[p.l*240,'carichi','hot']],scale,seq);
    if(k>=1)g+=timingBar(127,'Multiciclo · ps',[[3*p.a*p.t,'aritmetiche','on'],[5*p.l*p.t,'carichi','hot']],scale,k===2?multi:undefined);
    return g+footer(k===2?'SEQ − multiciclo = '+vals(s,2)['SEQ − multiciclo (ps)']+' ps.':k===1?'Il periodo della macchina multiciclo è di '+p.t+' ps: 3 cicli per operazione e 5 per carico.':'SEQ completa ogni istruzione in 240 ps.');
  }
  function idealGrid(p,s,k){
    const total=p.k+p.n-1;
    const x0=77,y0=48,w=543/total,h=Math.min(24,149/p.n);
    let g=title('OCCUPAZIONE IDEALE · '+p.k+' STADI · '+p.n+' ISTRUZIONI');
    for(let r=0;r<p.n;r++){
      g+=text(x0-8,y0+(r+.75)*h,'I'+(r+1),Math.min(13,h),'end',colors.dim);
      for(let j=0;j<p.k;j++){
        const known=k===2||j===0||(k>=1&&r===0);
        if(!known)continue;
        const x=x0+(r+j)*w,y=y0+r*h;g+=rect(x,y,w-1,h-1,j===p.k-1?'hot':'on',1);
        if(w>=22&&h>=14)g+=text(x+w/2,y+h*.73,'S'+(j+1),10,'middle');
      }
    }
    g+=text(x0,y0+h*p.n+17,'ciclo 1',12);
    if(k===2)g+=text(620,y0+h*p.n+17,'ciclo '+total,12,'end');
    return g+footer(k===2?'Fino all’ultimo completamento: '+total+' cicli, '+total*p.t+' ps.':'La cella in diagonale indica l’ingresso di una nuova istruzione.');
  }
  function stageHistory(p,s,k){
    let g=title('CICLO E STADIO · STORIA DELLE ISTRUZIONI');
    for(let i=0;i<5;i++)g+=text(175+i*93,54,pipeStages[i],15,'middle',colors.on);
    for(let row=0;row<=k;row++){
      g+=text(19,86+44*row,s[row].titolo,14);
      for(let i=0;i<5;i++)g+=tile(136+i*93,64+44*row,79,32,vals(s,row)[pipeStages[i]],row===k?'hot':'');
    }
    if(k>0){
      const old=vals(s,k-1),current=vals(s,k);
      const dst=pipeStages.findIndex((name,i)=>i>0&&current[name]!=='—'&&current[name]===old[pipeStages[i-1]]);
      if(dst>0)g+=wire('M'+(175+(dst-1)*93)+' '+(96+44*(k-1))+' L'+(175+dst*93)+' '+(64+44*k),true);
    }
    return g+footer('Ogni riga mostra tutti gli stadi nello stesso ciclo. Ogni colonna segue uno stadio.');
  }
  function hazards(p,s,k){
    const bad=p.esito==='1';
    if(p.h==='raw'){
      let g=title('DIPENDENZA LOAD/USE · REGISTRO RICHIESTO');
      g+=card(26,53,168,60,'D · consumatore',k>=1?(bad?'usa %rax':'usa %rcx'):unknown,k===1?'hot':'')+
        card(238,53,168,60,'E · carico','dest. %rax','on')+card(450,53,154,60,'M · prossima lettura','memoria')+
        wire('M450 113V144H110V115',k===2&&bad);
      g+=text(28,189,'E al fronte seguente: '+(k===2?vals(s,2)['E al prossimo ciclo']:unknown),17);
      return g+footer('Il dato del carico sarà disponibile dopo la lettura in M.');
    }
    if(p.h==='bus'){
      return title('CONFLITTO STRUTTURALE · UNA PORTA DI MEMORIA')+
        card(28,60,145,52,'F','prelievo')+card(28,138,145,52,'M','lettura dati')+
        wire('M173 85L327 125',k===1&&bad)+wire('M173 165L327 125',k>=1)+
        dot(344,125,17,'1',k===1)+wire('M361 125H438',k===2)+card(438,96,167,57,'porta assegnata',k>=1?'dati':unknown,'on')+
        footer(k===2?'Prelievi bloccati: '+vals(s,2)['Prelievi bloccati']+'.':'La porta può accettare un solo accesso per ciclo.');
    }
    return title('CONFLITTO DI CONTROLLO · PREVISIONE PRESO')+
      card(26,82,154,64,'E · salto',k>=1?(bad?'falso':'vero'):unknown)+
      wire('M180 115H219L270 74',k===2&&!bad)+wire('M180 115H219L270 158',k===2&&bad)+
      card(270,45,273,52,'destinazione predetta','F e D sul ramo preso',k===2&&!bad?'hot':'')+
      card(270,135,273,52,'indirizzo sequenziale','primo byte dopo il salto',k===2&&bad?'hot':'')+
      footer(k===2?'Operazioni più giovani scartate: '+vals(s,2)['Operazioni scartate']+'.':'La direzione effettiva è risolta in E.');
  }
  function cpi(p,s,k){
    const pieces=[[4,'riempimento',''],[p.n,'istruzioni','on']];
    if(k>=1)pieces.push([p.d,'dati','hot'],[p.b,'salti','hot']);
    let g=title('CICLI TOTALI E ISTRUZIONI COMPLETATE')+
      timingBar(62,'Cicli',pieces,p.n+4+p.d+p.b,k>=1?vals(s,1)['Cicli complessivi']:p.n+4)+
      text(26,151,'4 di riempimento    '+p.n+' istruzioni'+(k>=1?'    '+p.d+' per dati    '+p.b+' per salti':''),14);
    if(k===2)g+=text(26,198,'CPI = '+vals(s,1)['Cicli complessivi']+' / '+p.n+' = '+vals(s,2).CPI,18,'start',colors.live);
    return g+footer('Le penalità di dato e di controllo in questa traccia cadono in cicli distinti.');
  }
  function pipelineEdge(p,s,k){
    let g=title('REGISTRI DI PIPELINE · FRONTE FRA I CICLI '+p.c+' E '+(p.c+1));
    for(let i=0;i<5;i++){
      const x=29+119*i;g+=text(x+48,49,pipeStages[i],14,'middle',colors.on)+tile(x,64,95,37,vals(s,0)[pipeStages[i]],'on');
      if(i<4)g+=wire('M'+(x+47)+' 103 l119 46',k===1);
      g+=tile(x,151,95,37,k===2?vals(s,2)[pipeStages[i]]:i&&k===1?vals(s,1)['Ingresso '+pipeStages[i]]:unknown,k===2?'hot':'');
    }
    return g+footer(k===1?'Riga inferiore: ingressi preparati, prima del fronte.':k===2?'Dopo il fronte, la riga inferiore mostra lo stato acquisito nel ciclo '+(p.c+1)+'.':'La riga alta mostra il ciclo '+p.c+'; quella bassa lo stato da acquisire.');
  }
  function selectCandidate(header,items,winner,k,label,answer,caption){
    let g=title(header);const n=items.length,gap=n===4?40:49;
    items.forEach(([source,value],i)=>{const y=42+i*gap;g+=tile(23,y,124,32,source,k===2&&source===winner?'hot':'')+
      text(155,y+22,value,14)+wire('M275 '+(y+16)+'H'+(302+i*21)+'L437 113',k===2&&winner===source);});
    return g+card(437,84,169,58,label,k===2?answer:unknown,k===2?'hot':'')+footer(caption);
  }
  function fetchMux(p,s,k){
    const v=vals(s,0),fin=vals(s,2);
    return selectCandidate('PROSSIMO PC · PRIORITÀ DALL’ALTO VERSO IL BASSO',
      [['M_valA',v.M_valA],['W_valM',v.W_valM],['F_predPC',v.F_predPC]],fin.Sorgente,k,'indirizzo di fetch',fin.f_pc,
      k>=1?'Salto falso in M = '+p.j+'   ·   ret in W = '+p.r:'La predizione fornisce l’indirizzo ordinario.');
  }
  function bypassMux(p,s,k){
    const d=vals(s,1),z=vals(s,2);
    return selectCandidate('FORWARDING · D RICHIEDE %rax',
      [['e_valE',k>=1?d['Destinazione E']+'  '+p.v:unknown],['m_valM',k>=1&&p.m==='load'?'%rax  93':'·'],
       ['M_valE',k>=1&&p.m==='op'?'%rax  74':'·'],['W_valE','%rax  31']],
      z.Sorgente,k,'d_valA',z.d_valA,'Il registro contiene inizialmente 12. La precedenza spetta al produttore valido più giovane.');
  }
  function mispredict(p,s,k){
    let g=title('CORREZIONE DEL SALTO · DUE ISTRUZIONI PIÙ GIOVANI');
    const stages=['F','D','E','M'],before=['P1','P0','jXX','—'],after=['@'+vals(s,2).f_pc,vals(s,2).D,vals(s,2).E,'jXX'];
    for(let i=0;i<4;i++){const x=34+151*i;
      g+=card(x,51,121,52,stages[i],before[i],i===2&&k===1?'hot':'');
      if(i<3)g+=wire('M'+(x+61)+' 104 l151 35',k===2&&(i===2||!!p.t));
      g+=card(x,139,121,51,stages[i]+' successivo',k===2?after[i]:unknown,k===2&&after[i]==='Bolla'?'hot':k===2?'on':'');
    }
    return g+footer(k===1?'e_Cnd = '+p.t+' · D_bubble = E_bubble = '+(1-p.t):'P0 è la prima nop a '+hex(p.target)+'; P1 occupa il byte seguente.');
  }
  function youngerSignals(p,s,k){
    const v=vals(s,0),control=vals(s,1),end=vals(s,2),signal=[
      ['F',control.F_stall?'fermo':'avanza'],['D',control.D_stall?'fermo':control.D_bubble?'bolla':'carica'],
      ['E',control.E_bubble?'bolla':'carica'],['M',end.M_bubble?'bolla':'carica'],['W',end['W_stat al fronte']]];
    let g=title('INTERBLOCCHI E STATO PRECISO · COMANDI AL FRONTE')+
      text(24,64,'load/use = '+v['load/use']+'     ret in D = '+v['ret in D']+'     m_stat = '+v.m_stat,16);
    signal.forEach(([n,action],i)=>{const known=i<3?k>=1:k===2;
      g+=card(23+i*122,90,104,66,n,known?action:unknown,known&&['bolla','fermo','ADR'].includes(action)?'hot':known?'on':'');});
    return g+footer(k===2?'Abilitazione alla scrittura dei codici di condizione = '+end['Scrittura CC']+'.':'Il fermo di D mantiene l’istruzione che deve ancora ricevere il dato.');
  }
  function fullTrace(p,s,k){
    const last=s.length-2,at=Math.min(k,last),first=Math.max(0,at-7);
    let g=title('ISTRUZIONI NEI CINQUE STADI · ULTIMI OTTO CICLI');
    for(let c=first;c<=at;c++)g+=text(124+(c-first)*63,54,c+1,13,'middle',c===at?colors.live:colors.dim);
    pipeStages.forEach((stage,j)=>{
      g+=text(39,81+j*28,stage,14);
      for(let c=first;c<=at;c++){
        const v=vals(s,c)[stage],old=c>0?vals(s,c-1):{};
        const injected=stage==='E'&&v==='—'&&/^L/.test(old.E)&&/^U/.test(old.D);
        g+=tile(97+(c-first)*63,62+j*28,54,24,injected?'○':v,c===at&&(v!=='—'||injected)?'hot':v==='—'?'':'on');
      }
    });
    if(k>0&&k<=last){
      const old=vals(s,k-1),now=vals(s,k);
      const j=pipeStages.findIndex((tag,i)=>i>0&&/^U/.test(now[tag])&&now[tag]===old[pipeStages[i-1]]);
      if(j>0)g+=wire('M'+(125+(at-first-1)*63)+' '+(86+(j-1)*28)+'l63 4',true);
    }
    return g+footer(k===s.length-1?'Bilancio: '+(last+1)+' cicli e '+(Number(vals(s,k)['Attese load/use'])===1?'un’attesa load/use':vals(s,k)['Attese load/use']+' attese load/use')+'.':
      'L = carico · U = uso · I = copia · ○ = bolla inserita in E · — = stadio vuoto.');
  }
  function reordered(p,s,k){
    const a=vals(s,0),b=vals(s,1),na=a.Cicli,nb=b.Cicli;
    let g=title('STESSI RISULTATI, DUE ORDINI DI EMISSIONE');
    g+=timingBar(53,'L → U → I',[[4,'avvio',''],[3*p.g,'lavoro','on'],[na-4-3*p.g,'attese','hot']],na,na+' cicli');
    if(k>=1)g+=timingBar(117,'L → I → U',[[4,'avvio',''],[3*p.g,'lavoro','on'],[nb-4-3*p.g,'attese','hot']],na,nb+' cicli');
    return g+footer(k===2?'Differenza: '+(na-nb)+' cicli × '+p.t+' ps = '+vals(s,2)['Tempo risparmiato (ps)']+' ps.':'Costo aggregato. In entrambi i casi il periodo è '+p.t+' ps.');
  }

  Object.assign(SL.sceneLab,{
    '3.1.1':majority,'3.1.2':mux,'3.1.3':ripple,'3.1.4':decodeALU,'3.1.5':propagation,'3.1.6':carriesAndFlags,
    '3.2.1':enabledRegister,'3.2.2':waveforms,'3.2.3':registerBank,'3.2.4':clockMargins,'3.2.5':vending,
    '3.3.1':archISA,'3.3.2':instructionFormat,'3.3.3':loadWord,'3.3.4':isaStatus,'3.3.5':callRet,'3.3.6':assembly,
    '3.4.1':seqSubtract,'3.4.2':pushPaths,'3.4.3':seqPaths,'3.4.4':stackMux,'3.4.5':seqVsMulti,
    '3.5.1':idealGrid,'3.5.2':stageHistory,'3.5.3':hazards,'3.5.4':cpi,
    '3.6.1':pipelineEdge,'3.6.2':fetchMux,'3.6.3':bypassMux,'3.6.4':mispredict,'3.6.5':youngerSignals,'3.6.6':fullTrace,'3.6.7':reordered
  });

  // Pipeline didattica con ALU a quattro bit, lettura in D, scrittura in W.
  // Il sommatore interno riutilizza il modello del laboratorio 3.1.3.
  function moduleTrace(p){
    const sumTrace=SL.unita['3.1.3'].calcola({a:p.a,b:p.b,c:0}),sum=vals(sumTrace,5).Somma;
    const value=parseInt(sum,2),next=(value+1)%16,forward=p.bypass==='si';
    const end=forward?6:8;
    const states=[];
    function append(titolo,testo,ciclo,fasi,fields,bitIndex=-1){
      states.push({titolo,testo,valori:[['Ciclo',ciclo],...fields],ciclo,fasi,bitIndex});
    }
    append('Prelievo del produttore','P somma A e B modulo 16 e scrive R. Il consumatore U deve leggere R e aggiungere uno modulo 16.',1,
      ['P','—','—','—','—'],[['A',binary(p.a,4)],['B',binary(p.b,4)],['R iniziale','0000']]);
    append('U entra nel processore','Mentre P legge i due operandi in D, F preleva U. Il registro R contiene ancora il valore iniziale.',2,
      ['U','P','—','—','—'],[['Produttore in D','P'],['Risultato richiesto da U','R']]);
    for(let i=0;i<4;i++){
      const v=vals(sumTrace,i+1);
      append('ALU · colonna '+i,'Nel ciclo 3, P attraversa E e U si trova in D. '+sumTrace[i+1].testo,3,
        ['—','U','P','—','—'],[['Bit prodotto S'+i,v['S'+i]],['Riporto C'+(i+1),v['C'+(i+1)]]],i);
    }
    append(forward?'Inoltro del risultato':'Prima attesa di U',
      forward?'Alla fine del ciclo 3, D ha ricevuto il risultato dall’ALU di P. Nel ciclo 4 U entra in E e può incrementarlo.':
      'Il risultato è disponibile all’uscita dell’ALU di P. In questa configurazione D legge il banco dei registri, che contiene ancora il vecchio R. U resta in D e una bolla entra in E.',4,
      forward?['—','—','U','P','—']:['—','U','—','P','—'],
      [['Somma prodotta',sum],['Fonte per U',forward?'ALU → D':'in attesa di W'],['R nel banco','0000']]);
    append('Scrittura di P nel banco',
      forward?'W scrive la somma di P in R. U ha già usato il dato inoltrato e porta il suo risultato attraverso M.':
      'W scrive R nel primo semiciclo. Nel secondo semiciclo U può leggere la nuova parola in D.',5,
      forward?['—','—','—','U','P']:['—','U','—','—','P'],
      [['R nel banco',sum],['U',forward?'risultato in M':'lettura di R in D']]);
    if(!forward){
      append('Incremento del consumatore','In E l’ALU del consumatore somma uno alla parola letta da R.',6,
        ['—','—','U','—','—'],[['Risultato interno di U',binary(next,4)]]);
      append('Transito attraverso M','U conserva il risultato dell’ALU per la scrittura nel ciclo seguente.',7,
        ['—','—','—','U','—'],[['Parola in transito',binary(next,4)]]);
    }
    append('Completamento di U','W scrive la parola finale di U. L’incremento di U ha usato la somma prodotta da P.',end,
      ['—','—','—','—','U'],[['Somma di P',sum],['Parola finale di U',binary(next,4)],['Ciclo di scrittura di U',end]]);
    return states;
  }
  function moduleDrawing(p,s,k){
    const now=s[k],previous=s.slice(0,k+1),cells=now.fasi;
    let g=title('PRODUTTORE P, CONSUMATORE U · CICLO '+now.ciclo);
    pipeStages.forEach((st,i)=>{const x=22+i*122;g+=card(x,39,105,51,st,cells[i],cells[i]==='U'?'hot':cells[i]==='P'?'on':'');});
    if(now.bitIndex>=0){
      for(let b=0;b<4;b++){const x=27+(3-b)*151,v=previous.find(row=>row.bitIndex===b),entry=v?Object.fromEntries(v.valori):{};
        g+=card(x,119,122,60,'ALU · peso '+(1<<b),v?'S='+entry['Bit prodotto S'+b]+' C='+entry['Riporto C'+(b+1)]:unknown,b===now.bitIndex?'hot':v?'on':'');
        if(b<3)g+=wire('M'+x+' 146h-29',b===now.bitIndex);
      }
      return g+footer('Le quattro colonne della somma appartengono allo stesso ciclo di E.');
    }
    const v=vals(s,k),sum=previous.map(r=>Object.fromEntries(r.valori)).find(x=>x['Somma prodotta'])?.['Somma prodotta'];
    g+=card(24,124,168,61,'risultato ALU di P',sum??unknown,now.ciclo===4?'hot':'')+
      card(238,124,160,61,'R nel banco',now.ciclo<5?'0000':sum,now.ciclo===5?'hot':'')+
      card(454,124,159,61,'U scrive in W',v['Parola finale di U']??unknown,k===s.length-1?'hot':'');
    if(now.ciclo===4&&p.bypass==='si')g+=wire('M111 123V106H196V93',true);
    if(now.ciclo===5)g+=wire('M559 92V105H314V123',true);
    if(k===s.length-1)g+=wire('M559 91V123',true);
    return g+footer(p.bypass==='si'?'Forwarding abilitato dal risultato di E alla lettura di D.':'Lettura da banco in D dopo la scrittura di W nel primo semiciclo.');
  }
  SL.moduliAnimati[3]={
    titolo:'Dal riporto al consumatore in pipeline',
    teoria:SL.lezioni['modulo-3'].join(' '),
    domanda:'In quale ciclo il consumatore U scrive il risultato?',
    controlli:[
      {id:'a',label:'Parola A · intero senza segno',min:0,max:15,step:1,iniziale:7},
      {id:'b',label:'Parola B · intero senza segno',min:0,max:15,step:1,iniziale:1},
      {id:'bypass',label:'Percorso degli operandi',opzioni:[['si','Forwarding E → D'],['no','Solo banco dei registri']],iniziale:'si'}
    ],
    calcola:moduleTrace,disegna:moduleDrawing,
    previsione:{label:'Ciclo di scrittura di U',valore:(p,s)=>String(vals(s,s.length-1)['Ciclo di scrittura di U'])}
  };
})();
