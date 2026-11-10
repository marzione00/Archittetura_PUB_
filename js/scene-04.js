'use strict';
(() => {
  const C = {bg:'#241e10', line:'#706752', ink:'#f6f0e3', dim:'#beb7a6', green:'#8cd4da', fill:'#193031', gold:'#ffce82', warm:'#473820', red:'#f5a799'};
  const hx = n => '0x'+Number(n).toString(16).toUpperCase();
  const num = n => String(n).replace('.',',');
  const v = (steps,i) => Object.fromEntries(steps[i].valori);
  const txt = (x,y,value,size=14,anchor='start',color=C.ink) =>
    '<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-family="ui-monospace,monospace" style="fill:'+color+'" font-size="'+size+'">'+SL.pen.e(value)+'</text>';
  const box = (x,y,w,h,fill=C.bg,stroke=C.line,r=4) => SL.symbols.panel(x,y,w,h,fill,stroke,fill===C.warm||fill===C.fill?'reveal':'');
  const wire = (d,color=C.line,width=2) => '<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+width+'" stroke-linejoin="round"/>';
  const disk = (x,y,r,fill=C.bg,stroke=C.line) => '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" stroke="'+stroke+'" fill="'+fill+'"/>';
  const title = x => txt(24,25,x,14,'start',C.green);
  const foot = x => txt(24,235,x,13,'start',C.dim);
  function card(x,y,w,h,caption,value,active=false) {
    if(SL.symbols.kind(caption))return SL.symbols.node(x,y,w,h,caption,value,active);
    return box(x,y,w,h,active?C.warm:C.bg,active?C.gold:C.line)
      +txt(x+w/2,y+20,caption,13,'middle',C.dim)+txt(x+w/2,y+h-12,value,16,'middle',active?C.gold:C.ink);
  }
  function route(d,active=true) {
    return wire(d,active?C.green:C.line)+(active?SL.pen.travel(d):'');
  }
  const scene={};
  function entry(id,draw){scene['4.'+id]=draw;}
  function cells(x,y,width,values,style,fontsize=13) {
    const dx=width/values.length;
    return values.map((value,i)=>{
      const tone=style?style(i):'';
      const fill=tone==='hot'?C.warm:tone==='on'?C.fill:C.bg;
      const edge=tone==='hot'?C.gold:tone==='on'?C.green:C.line;
      return box(x+i*dx,y,Math.max(1,dx-2),34,fill,edge,2)
        +(value!==''?txt(x+(i+.5)*dx,y+22,value,fontsize,'middle',tone==='hot'?C.gold:C.ink):'');
    }).join('');
  }
  function ruler(x,y,width,segments,max) {
    let elapsed=0,drawing=wire('M'+x+' '+(y+33)+'h'+width);
    for(const [name,duration,shade] of segments) {
      const w=width*duration/Math.max(1,max);
      if(w>0){
        drawing+=box(x+elapsed,y,Math.max(0,w-1),30,shade?C.warm:C.fill,shade?C.gold:C.green,1);
        if(w>name.length*8+8)drawing+=txt(x+elapsed+w/2,y+20,name,13,'middle');
        elapsed+=w;
      }
    }
    return drawing;
  }
  function cross(x,y,w,h){return wire('M'+x+' '+y+'l'+w+' '+h+' M'+(x+w)+' '+y+'l-'+w+' '+h,C.red,2);}
  function resume(p,s,k,categories){
    const r=v(s,0),fault=p.evento==='pf',abort=p.evento==='abort',now=String(r.RIP),next=String(r['Istruzione seguente']);
    let art=title(categories?'Causa e indirizzo di ripresa':'Flusso del programma e salvataggio di RIP');
    art+=card(30,55,188,58,'Istruzione corrente',now,k===0)+card(390,55,210,58,'Istruzione seguente',next,k===2&&!fault&&!abort);
    art+=wire('M218 82H390')+txt(302,70,'flusso',12,'middle',C.dim);
    art+=card(200,147,230,57,'Gestore',k===0?'in attesa':v(s,1).Classe,k===1);
    if(k>=1)art+=route('M120 114V174H198',k===1);
    if(k===2&&!abort)art+=route(fault?'M205 147V124H122V114':'M430 174H499V114');
    if(k===2&&abort)art+=cross(465,148,30,34)+txt(504,171,'arresto',14,'start',C.red);
    return art+foot(k===0?'RIP indica la posizione prima dell’evento.':k===1?'Punto registrato: '+v(s,1)['Punto di ripresa']:'Esito: '+v(s,2)['RIP alla ripresa']);
  }
  entry('1.1',(p,s,k)=>resume(p,s,k,false));
  entry('1.2',(p,s,k)=>resume(p,s,k,true));
  entry('1.3',(p,s,k)=>{
    const invalid=p.via==='hw'&&p.v<32, selected=Number(p.v), d=v(s,Math.min(k,2));
    let g=title('Tavola IDT · descrittori da 16 byte')+card(25,49,146,59,p.via==='hw'?'Controller IRQ':'INT da CPL 3','vettore '+p.v,k===0);
    const first=Math.min(253,Math.max(0,selected-1));
    for(let i=0;i<3;i++){
      const n=i+first,y=47+48*i,on=!invalid&&k>=1&&n===selected;
      g+=box(231,y,230,41,on?C.fill:C.bg,on?C.green:C.line)
       +txt(242,y+26,'['+n+']',15)+txt(450,y+26,on?hx(0x4000+n*16):'descrittore',13,'end',C.dim);
      if(on)g+=route('M172 80H204V'+(y+20)+'H229',k===1);
    }
    if(k===2&&!invalid){const ok=d.Esito==='ingresso al gestore';g+=card(473,98,144,65,ok?'Gestore':'Eccezione',ok?v(s,1)['Destinazione nella porta']:'#GP',true);}
    if(invalid&&k>=1)g+=cross(182,65,24,29)+txt(25,205,k===1?'Vettore riservato · lettura IDT assente':'Configurazione respinta dal controller',15,'start',C.red);
    return g+foot(invalid?'Vettori 0–31 riservati nel modello.':k===2?d.Esito+' · DPL '+p.dpl:'Indirizzo voce = 0x4000 + vettore × 16');
  });
  entry('1.4',(p,s,k)=>{
    const retired=k>=1?p.k-1:0;
    let g=title('Ritiro in ordine · sei ADD consecutive');
    for(let i=0;i<6;i++){
      const x=28+98*i,old=i<retired,bad=k===2&&i===p.k-1,flush=k===2&&i>=p.k;
      g+=box(x,60,88,62,old?C.fill:C.bg,bad?C.red:old?C.green:C.line)
        +txt(x+44,84,'ADD '+(i+1),15,'middle')+txt(x+44,107,bad?'fault':old?'ritirata':flush?'scartata':'in volo',12,'middle',bad?C.red:C.dim);
      if(flush)g+=wire('M'+(x+4)+' 117l78 -53',C.red,1);
    }
    g+=card(24,143,190,61,'Registro visibile',k?v(s,1)['Registro visibile']:p.r,k>0);
    if(k)g+=route('M'+(28+98*retired)+' 124V135H119V142',k===1);
    if(k===2)g+=card(244,143,235,61,'RIP del nuovo tentativo',v(s,2)['RIP salvato'],true);
    return g+foot(k?'Effetti pubblicati da '+retired+' istruzioni.':'Ritiro: dalla più vecchia alla più giovane.');
  });
  entry('1.5',(p,s,k)=>{
    const sw=['slot sintetico','registri generali'],err=p.e==='pf',base=v(s,0)['RSP allineato'];
    const rows=k?['SS','RSP','RFLAGS','CS','RIP',...(err?['codice errore']:[])]:[];
    if(k===2)rows.push(...(!err?[sw[0]]:[]),sw[1]+' × '+p.n);
    let g=title('Pila del gestore · gli indirizzi diminuiscono verso il basso')+txt(26,57,'RSP selezionato  '+hx(p.r),15)+txt(26,88,'RSP allineato    '+base,15);
    rows.forEach((s,i)=>{
      const soft=i>=(err?6:5),y=42+i*21;
      g+=box(297,y,258,18,soft?C.warm:C.fill,soft?C.gold:C.green,1)+txt(425,y+14,s,12,'middle');
    });
    g+=wire('M275 40V207l-5 -8m5 8l5 -8');
    if(k)g+=txt(26,132,'CPU   '+v(s,1)['Byte del frame']+' B',16);
    if(k===2)g+=txt(26,161,'Stub  '+v(s,2)['Byte aggiunti dal software']+' B',16)+txt(26,199,'RSP   '+v(s,2)['RSP finale'],17,'start',C.gold);
    if(k>0){const end=42+rows.length*21;g+=route('M565 42V'+Math.min(207,end));}
    return g+foot('Riga dei registri generali raggruppata · ogni slot vale 8 B.');
  });
  entry('1.6',(p,s,k)=>{
    const save=p.salva==='si';
    let g=title('RAX e copia nello stub · RIP è nel frame hardware')
      +card(28,66,150,62,'Programma',p.r,k===0)+card(245,66,153,62,'Gestore',k?'255':'·',k===1)
      +card(455,66,153,62,'Alla ripresa',k===2?v(s,2)['RAX osservato']:'·',k===2)
      +card(246,157,150,52,'Pila dello stub',k?(save?p.r:'vuota'):'·');
    if(k>=1)g+=route('M178 94H242',k===1);
    if(k>=1&&save)g+=route('M100 130V182H242',k===1);
    if(k===2)g+=route(save?'M397 182H533V131':'M399 95H452');
    return g+foot(k===2?'Ripresa del programma a '+v(s,2).RIP:'Il registro temporaneo del gestore è distinto dal RIP salvato.');
  });
  entry('1.7',(p,s,k)=>{
    const nested=p.iflag==='uno'&&p.q>4;
    let g=title('Richiesta pendente e pila dei gestori')+card(26,38,160,58,'In servizio','priorità 4',k===0)
      +card(236,38,155,58,'Nuova IRQ',k?'priorità '+p.q:'·',k===1)
      +card(446,38,160,58,'IF',k?Number(p.iflag==='uno'):0,k===1);
    g+=box(85,158,469,40,C.fill,C.green)+txt(320,184,'programma interrotto',15,'middle');
    if(k<3||nested)g+=box(137,130,365,27,C.bg,C.green)+txt(320,149,'gestore esterno',14,'middle');
    if(k===2&&nested)g+=box(175,104,290,26,C.warm,C.gold)+txt(320,122,'gestore interno',13,'middle');
    if(k===1)g+=route('M314 97V112H439');
    if(k===2&&nested)g+=route('M471 117H550V144');
    if(k===3)g+=route(nested?'M470 117H550V144':'M502 145H554V177');
    if(k===2&&!nested)g+=txt(317,118,'IRQ pendente',13,'middle',C.gold);
    return g+foot(k===3?'Primo contesto ripristinato: '+v(s,3)['Primo contesto ripristinato']:k===2?'Profondità raggiunta: '+v(s,2)['Profondità massima']:'Per annidare: IF = 1 e priorità in arrivo maggiore di 4.');
  });
  entry('2.1',(p,s,k)=>{
    const regs=v(s,0);
    let g=title('SYSCALL · da utente a kernel')+txt(30,57,'UTENTE',13,'start',C.dim)+txt(366,57,'KERNEL',13,'start',C.dim)
      +wire('M313 45V205',C.green)+card(30,70,122,66,'RAX',regs.RAX)+card(165,70,122,66,'RDI',regs.RDI)
      +card(367,70,230,66,'Servizio',k?v(s,1).Servizio:'·',k===1);
    if(k)g+=route('M287 104H364',k===1)+txt(364,163,'RCX = '+v(s,1).RCX,14);
    if(k===2)g+=txt(365,192,v(s,2).Effetto,14,'start',C.gold);
    return g+foot(k===2?(p.s==='exit'?'Stato di uscita: ':'Descrittore: ')+p.a:'Ingresso configurato dal kernel · RIP iniziale 0x4010');
  });
  entry('2.2',(p,s,k)=>{
    const letters=Array.from('COMPUTER'),ok=p.fd==='ok';
    let g=title('write · percorso dei byte')+txt(28,59,'Buffer utente · RDX = '+p.n)+cells(28,72,574,letters,i=>i<p.n?'on':'');
    g+=wire('M27 135H608',C.dim)+txt(36,154,'confine di privilegio',12,'start',C.dim);
    if(k>=1)g+=txt(248,155,ok?'fd → pipe scrivibile':'fd → voce assente',14,'start',ok?C.green:C.red);
    if(k===2&&ok){g+=cells(28,176,574,letters.map((c,i)=>i<p.n?c:''),i=>i<p.n?'hot':'');g+=route('M63 107V174');}
    if(k===2&&!ok)g+=txt(300,199,'EBADF · zero byte consegnati',16,'middle',C.red);
    return g+foot(k===2?'RAX restituito: '+v(s,2).RAX:'Il kernel verifica la destinazione prima del trasferimento.');
  });
  entry('2.3',(p,s,k)=>{
    const n=Number(p.n),m=k?v(s,1)['Byte confermati']:0,dx=570/n;
    let g=title('Scrittura parziale · indirizzo e lunghezza')+txt(28,63,'Buffer '+hx(0x5000)+' · '+n+' byte');
    g+=cells(28,95,570,Array.from({length:n},(_,i)=>n<17?i:''),i=>i<m?'on':'',11);
    if(k)g+=route('M28 145H'+(28+m*dx),m>0)+txt(29,176,'Byte confermati: '+m,15,'start',C.green);
    if(k===2){const d=v(s,2);g+=txt(27,203,'Ripresa: '+d['Primo byte residuo']+'   ·   Residuo: '+d.Residuo+' B',15,'start',C.gold);}
    return g+foot(k&&v(s,1).RAX<0?'EBADF · il puntatore rimane sulla prima cella.':'Ogni cella rappresenta un byte.');
  });
  entry('2.4',(p,s,k)=>{
    const blocking=p.modo==='blocco',width=400,scale=width/(p.t+1),start=181;
    let g=title('Pipe vuota · tempo del thread e del dispositivo')+txt(25,87,'Thread')+txt(25,147,'Pipe')+wire('M181 96H600M181 156H600');
    g+=disk(start,96,5,C.green)+txt(start,122,'0',12,'middle');
    if(k>=1)g+=txt(201,87,blocking?'in attesa di un byte':'read termina: EAGAIN',14,'start',blocking?C.dim:C.gold);
    if(k===2){
      const x=start+p.t*scale;g+=disk(x,156,5,C.gold)+txt(x,178,p.t+' ms',13,'middle')+route('M'+x+' 154V100');
      if(blocking)g+=disk(start+width,96,5,C.green)+txt(595,68,'ripresa a '+(p.t+1)+' ms',14,'end',C.gold);
      else g+=txt(593,201,'Byte nella pipe: 1',15,'end',C.green);
    }
    return g+foot(k===2?'Fine della chiamata: '+v(s,2)['Fine della chiamata (ms)']+' ms':'Una pipe con scrittore aperto conserva i dati in arrivo.');
  });
  entry('2.5',(p,s,k)=>{
    const perm='0'+p.perm,other=p.chi==='other',out=k===2?v(s,2)['Ritorno grezzo']:0;
    let g=title('open in lettura · selezione della classe')+txt(24,64,'Modalità '+perm+'     Identità: '+(other?'altro utente':'proprietario'));
    ['Proprietario','Gruppo','Altri'].forEach((name,i)=>{
      g+=card(24+i*198,86,172,67,name,['rw−',p.perm==='644'?'r−−':'−−−',p.perm==='644'?'r−−':'−−−'][i],k>=1&&i===(other?2:0));
    });
    if(k>=1)g+=route('M'+(other?507:110)+' 154V168H27',k===1);
    if(k>=1)g+=txt(31,186,'Bit r della classe attiva = '+v(s,1)['Bit lettura'],16);
    if(k===2)g+=txt(31,214,out<0?'RAX = −13 · EACCES':'RAX = 3 · descrittore aperto',16,'start',out<0?C.red:C.green);
    return g+foot('Il modello esclude gruppi applicabili, ACL e privilegi speciali.');
  });
  entry('3.1',(p,s,k)=>{
    const clk=k===2?v(s,2)['Ciclo della lettura']:k===1?p.t:0,ready=k===1&&p.t>=4;
    let g=title('Conversione del campione · un passo del driver alla volta')
      +card(25,57,173,60,'COMMAND','START',k===0)+card(233,57,172,60,'READY',ready?1:0,k===1)
      +card(435,57,171,60,'DATA letto',k===2?v(s,2).DATA:'·',k===2);
    g+=wire('M30 170H590');for(let i=0;i<=8;i++){const x=38+i*68;g+=wire('M'+x+' 163v14')+txt(x,197,i,13,'middle');}
    g+=disk(38+68*clk,170,6,C.gold,C.gold)+txt(38+68*clk,151,'driver',13,'middle',C.gold);
    if(k===1)g+=route('M38 170H'+(38+68*clk)+'V158');
    if(k===2)g+=route('M405 86H433');
    return g+foot('Cicli dall’avvio · il campione è disponibile al ciclo 4.');
  });
  entry('3.2',(p,s,k)=>{
    const period=p.p,at=p.t,n=Math.ceil(at/period),end=Math.max(1,n*period,at+2),x=t=>115+480*t/end;
    let g=title('Due modi di osservare lo stesso evento')+txt(25,80,'Evento')+txt(25,130,'Polling')+txt(25,183,'IRQ');
    [75,125,177].forEach(y=>g+=wire('M115 '+y+'H601'));
    g+=disk(x(at),75,6,C.gold,C.gold)+txt(x(at),59,at+' µs',13,'middle',C.gold);
    if(k>=1){
      for(let i=1;i<=n;i++)g+=disk(x(i*period),125,4,i===n?C.gold:C.green);
      g+=route('M115 125H'+x(n*period),k===1);
      g+=txt(603,149,n+' letture · '+v(s,1)['Cicli CPU']+' cicli CPU',13,'end');
    }
    if(k===2){g+=disk(x(at+2),177,5,C.gold)+route('M'+x(at)+' 81V158H'+x(at+2)+'V172')+txt(603,201,'1 consegna · 24 cicli CPU',13,'end');}
    return g+foot('Tempo da sinistra a destra · ogni punto verde è una lettura di stato.');
  });
  entry('3.3',(p,s,k)=>{
    const active=k<2||p.ack==='dopo';
    let g=title('Linea a livello · dispositivo, controller, core')
      +card(24,68,162,67,'Dispositivo',k===0?'causa attiva':active?'IRQ alta':'IRQ bassa',k===2)
      +card(238,68,165,67,'Controller','vettore '+(32+p.q),k===0)
      +card(454,68,160,67,'Core',k===0?'in attesa':'in servizio',k===1);
    g+=route('M186 104H236',k===0)+route('M403 104H451',k===1);
    if(k===2){g+=route('M533 138V171H324V137')+txt(421,194,'EOI',15,'middle',C.gold);}
    return g+foot(k===2?'Possibile nuova consegna: '+v(s,2)['Possibile riconsegna']:'Linea '+p.q+' · IDT a 64 bit, voci da 16 byte.');
  });
  entry('3.4',(p,s,k)=>{
    const groups=Math.ceil(p.n/p.b),display=Math.min(p.n,24);
    let g=title('Coda dei campioni e registro STATUS')+txt(24,59,'Primi '+display+' campioni su '+p.n);
    const dx=570/display;
    for(let i=0;i<display;i++){
      const x=28+i*dx,group=Math.floor(i/p.b)%2;
      g+=box(x,76,dx-2,25,k>=1?(group?C.warm:C.fill):C.bg,k>=1?(group?C.gold:C.green):C.line,2);
    }
    g+=txt(25,131,k===0?'Soglia: '+p.b+' campioni per IRQ':'Gruppi notificati: '+groups+(k>=2?'   ·   CPU: '+v(s,2)['Cicli complessivi']+' cicli':''),15);
    if(k===3){
      const d=v(s,3);g+=cells(25,154,274,['ERROR '+d.ERROR,'READY '+d.READY],i=>(i===0?d.ERROR:d.READY)?'hot':'');
      g+=txt(321,177,'STATUS ← '+d['Maschera scritta'],16)+route('M319 168H302');
    }
    if(k===1)g+=route('M28 112H'+(28+dx*Math.min(display,p.b)));
    return g+foot(k===3?'Scrittura W1C · un bit a 1 riconosce il flag corrispondente.':'Leggi i gruppi dalla testa della coda verso destra.');
  });
  entry('4.1',(p,s,k)=>{
    const d=v(s,0),dest=k?v(s,1).Destinatario:'',y=dest==='RAM'?67:dest==='controller'?130:186;
    let g=title('Decodifica di una transazione sul bus')+card(23,82,149,63,'Iniziatore',p.master,true)+card(211,82,165,63,'Decoder',d.Indirizzo,k===1)
      +card(460,42,150,50,'0x00–0x7F','RAM',k>=1&&dest==='RAM')
      +card(460,103,150,50,'0x80–0x8F','controller',k>=1&&dest==='controller');
    g+=route('M173 111H208',k===0);
    if(k>=1){g+=route('M377 112H411V'+y+'H455',k===1);if(dest==='nessun destinatario')g+=txt(457,191,'fuori mappa',14,'start',C.red);}
    if(k===2&&dest!=='nessun destinatario'){
      const dir=p.cmd==='r'?'M530 157V193H94V149':'M94 149V193H530V157';
      g+=route(dir)+txt(307,184,'dato '+v(s,2)['Byte trasferito'],14,'middle',C.gold);
    }
    return g+foot('Comando: '+d.Comando+' · in attesa: '+d['In attesa']+(k===2?' · '+v(s,2).Risposta:''));
  });
  entry('4.2',(p,s,k)=>{
    const shared=p.t==='bus',beat=p.t==='ddr'?2:1;
    let g=title('Risorse fisiche e banda dei flussi')+txt(25,58,p.w+' linee dati · '+p.f+' MHz · '+beat+' trasferim./ciclo');
    const y1=98,y2=171;
    g+=disk(55,y1,10,C.green)+disk(55,y2,10,C.gold)+disk(583,y1,10,C.green)+disk(583,y2,10,C.gold);
    if(shared){
      g+=route('M65 98H130L176 132H439L485 98H572',k>=1);
      g+=wire('M65 171H130L176 132 M439 132L485 171H572',C.gold)+txt(303,157,'un bus, turni distinti',13,'middle');
    }else{
      g+=route('M65 98H572',k>=1)+route('M65 171H572',k>=2);g+=txt(300,124,'link 1',13,'middle')+txt(300,198,'link 2',13,'middle');
    }
    return g+foot(k===2?'Banda aggregata: '+v(s,2)['Banda aggregata (MB/s)']+' MB/s':k===1?'Una risorsa trasferisce '+v(s,1)['MB/s per risorsa']+' MB/s.':'I due punti a sinistra rappresentano i flussi in ingresso.');
  });
  entry('4.3',(p,s,k)=>{
    const block=p.modo==='burst',symbol=[];
    const repeat=block?1:p.n;
    for(let i=0;i<repeat;i++){symbol.push('I');for(let j=0;j<p.w;j++)symbol.push('A');for(let j=0;j<(block?p.n:1);j++)symbol.push('D');}
    const visible=symbol.slice(0,24);
    const shade=t=>t==='I'?'on':t==='A'&&k>=1?'hot':t==='D'&&k===2?'on':'';
    let g=title('Fasi di bus · cicli dalla prima presentazione')+txt(25,63,p.n+' parole da 4 B · '+(block?'raffica':'transazioni singole'));
    g+=cells(26,86,581,visible.map(a=>(a==='I'||(a==='A'&&k>0)||k===2)?a:'·'),i=>shade(visible[i]),14);
    g+=txt(26,151,'I = indirizzo     A = attesa     D = dato',14);
    if(symbol.length>visible.length)g+=txt(26,176,'La striscia mostra i primi '+visible.length+' cicli.',13,'start',C.dim);
    return g+foot(k===2?'Totale '+v(s,2)['Cicli totali']+' cicli · '+v(s,2)['Byte consegnati']+' B consegnati':k===1?'Cicli di attesa: '+v(s,1)['Cicli di attesa']:'Presentazioni dell’indirizzo: '+v(s,0).Presentazioni);
  });
  entry('4.4',(p,s,k)=>{
    let g=title('Bus condiviso · A, B e C chiedono al ciclo zero')+txt(24,59,(p.p==='rr'?'Round-robin':'Priorità fissa A, B, C')+'   ·   Ultimo servito: '+p.last);
    const names=k?v(s,1).Ordine.split(' → '):[];
    for(let j=0;j<15;j++){
      const x=25+j*39.5,ar=j%5===0,name=names[Math.floor(j/5)],focus=k===2&&name==='B'&&j%5===1;
      g+=box(x,86,36,48,focus?C.warm:k?C.fill:C.bg,focus?C.gold:k?C.green:C.line,3)
        +txt(x+18,115,k?(ar?'AR':name):'·',14,'middle')+txt(x+18,153,j,12,'middle',C.dim);
      if(focus)g+=route('M'+(x+18)+' 187V158');
    }
    if(k===1)g+=route('M43 74H599');
    g+=txt(25,206,'AR = arbitraggio  ·  una casella = un ciclo',14);
    return g+foot(k===2?'B: arbitraggio a '+v(s,2)['Inizio arbitraggio di B']+' · primo dato a '+v(s,2)['Primo ciclo dati di B']+' · fine a '+v(s,2)['Completamento di B']:k===1?'Ordine dei turni: '+names.join(' → '):'I tre richiedenti sono in attesa della prima concessione.');
  });
  entry('4.5',(p,s,k)=>{
    const q=p.q+Number(p.uscite==='stessa'),destination=p.uscite==='distinta';
    let g=title('Ponte store-and-forward · due uscite possibili')+card(27,72,138,57,'Pacchetto',p.b+' B',k===0)+card(213,72,137,57,'Ponte','1 µs',k===1)
      +card(467,53,146,53,'Uscita RAM','8 B/µs',k===2)+card(467,148,146,53,'Altra uscita',destination?'flusso 2':'libera');
    g+=route('M166 101H211',k===0)+route('M351 101H403V79H465',k===2)+wire('M350 104H403V173H466',destination?C.gold:C.line);
    if(k>=1)g+=txt(26,175,'Davanti al pacchetto: '+q,15)+txt(26,201,'Attesa in coda: '+v(s,1)['Coda (µs)']+' µs',15);
    return g+foot(k===2?'Dall’ingresso alla RAM: '+v(s,2)['Latenza totale (µs)']+' µs.':'Il primo link porta 16 B/µs al ponte.');
  });
  entry('5.1',(p,s,k)=>{
    const cx=142,cy=127;
    let g=title('Seek radiale e attesa angolare');
    for(let r=84;r>=12;r-=12)g+=disk(cx,cy,r,C.bg,C.line);
    const theta=k===0?2*Math.PI*p.f/8:0;
    const xx=cx+60*Math.cos(theta),yy=cy+60*Math.sin(theta);
    g+=disk(xx,yy,7,C.gold,C.gold)+wire('M244 98L212 123L202 127',C.green,5)+txt(240,86,'testina',13);
    if(k===1&&p.f>0){
      const ang=2*Math.PI*p.f/8,a=cx+60*Math.cos(ang),b=cy+60*Math.sin(ang);
      g+=route('M'+a+' '+b+' A60 60 0 '+(p.f>4?1:0)+' 0 202 127');
    }
    g+=txt(360,72,p.rpm+' giri/min',16)+txt(360,104,'Seek: '+p.s+' ms',15);
    if(k)g+=txt(360,139,'Rotazione: '+num(v(s,1)['Attesa di questo settore (ms)'])+' ms',14);
    if(k===2)g+=txt(360,174,'Primo byte: '+num(v(s,2)['Latenza al primo byte (ms)'])+' ms',14,'start',C.gold);
    return g+foot('Il punto indica l’inizio del settore; il braccio indica la testina.');
  });
  entry('5.2',(p,s,k)=>{
    const bytes=v(s,0),extent=Math.min(p.n,10),values=Array.from({length:extent},(_,i)=>p.l+i);
    let g=title('LBA, intervallo logico e durata del servizio')+txt(26,59,'Blocchi consecutivi da '+p.b+' B, a partire da LBA '+p.l)+cells(26,76,574,values,i=>i===0?'hot':'on');
    g+=txt(27,137,'Primo byte: '+bytes['Offset iniziale (B)']+'   ·   Ultimo LBA: '+bytes['Ultimo LBA'],14);
    if(k>0){
      const t=v(s,1)['Trasferimento (µs)'],access=k===2?v(s,2)['Accesso (µs)']:0;
      g+=ruler(27,163,575,[['accesso',access,false],['dati',t,true]],access+t)+route('M27 200H602');
    }
    return g+foot(k===2?'Servizio: '+v(s,2)['Tempo totale (µs)']+' µs, coda vuota.':k===1?'Trasferimento: '+v(s,1)['Trasferimento (µs)']+' µs a 128 B/µs.':'La finestra visualizza fino a dieci blocchi.');
  });
  entry('5.3',(p,s,k)=>{
    const points=[p.pos];
    for(let i=1;i<=k;i++)points.push(Number(s[i].titolo.split(' ').at(-1)));
    const x=n=>38+5.55*n,y=i=>67+i*37;
    let g=title('Percorso della testina · '+(p.p==='fcfs'?'FCFS':'SSTF'));
    for(let n=0;n<=100;n+=10){g+=wire('M'+x(n)+' 48V198',C.line,1)+txt(x(n),216,n,11,'middle',C.dim);}
    for(const n of [80,15,55])g+=disk(x(n),49,4,n===80&&p.cache==='hit'?C.gold:C.green);
    points.forEach((n,i)=>{if(i)g+=route('M'+x(points[i-1])+' '+y(i-1)+'L'+x(n)+' '+y(i),i===k);g+=disk(x(n),y(i),6,i===k?C.gold:C.green)+txt(x(n),y(i)-9,n,12,'middle');});
    return g+foot(k?'Cammino cumulativo: '+v(s,k)['Cammino cumulativo']+' cilindri.':'Coda disco: '+v(s,0)['Coda disco']+'.');
  });
  entry('6.1',(p,s,k)=>{
    const fields={'0':['A','B','C','D'],'1':['A','A','A','A'],'5':['A','B','C','P'],'6':['A','B','P','Q'],'10':['A','A','B','B']}[p.r];
    let g=title('RAID '+p.r+' · una stripe su quattro dischi da 2 TB');
    for(let i=0;i<4;i++){
      const x=29+i*150,lost=k>=1&&p.g.includes(String(i));
      g+=box(x,67,126,91,lost?C.bg:C.fill,lost?C.red:C.green,9);
      g+=txt(x+63,92,'Disco '+i,14,'middle')+txt(x+63,130,lost?'×':fields[i],25,'middle',lost?C.red:C.green);
      if(lost)g+=txt(x+63,181,'guasto',13,'middle',C.red);
    }
    if(k===3&&p.g==='0')g+=route('M540 162V193H93V161')+txt(320,213,'P XOR B XOR C = '+v(s,3)['Byte A ricostruito'],14,'middle',C.gold);
    if(k===3&&p.g!=='0')g+=txt(303,206,'Una parità · due incognite',15,'middle',C.red);
    return g+foot(k===3?'A ricostruito: '+v(s,3)['Byte A ricostruito']+'.':k>=2?'Volume: '+v(s,2).Esito+'.':k===1?'Superstiti: '+v(s,1)['Membri superstiti']+'.':'Capacità utile: '+v(s,0)['Capacità utile (TB)']+' TB.');
  });
  entry('6.2',(p,s,k)=>{
    const byte=(x)=>x.toString(2).padStart(8,'0').split('');
    const a=k===0?p.a:p.n,parity=k===0?v(s,0).P:v(s,1)['P nuova'];
    let g=title('Stripe RAID 5 · parità XOR bit per bit');
    for(const [i,id,b] of [[0,'A',a],[1,'B',p.b],[2,'P',Number(parity)]]){
      const y=50+i*49;g+=txt(35,y+22,id,18)+cells(78,y,418,k===2&&i===0?Array(8).fill('×'):byte(b),()=>i===2?'hot':'on')
        +txt(520,y+22,k===2&&i===0?'guasto':hx(b),16);
    }
    if(k===1)g+=route('M587 68H611V165H586');
    if(k===2)g+=route('M587 166H611V70H586');
    if(k===2)g+=txt(81,215,'A ricostruito = B XOR P = '+v(s,2)['B XOR P nuova'],16,'start',C.gold);
    return g+foot(k===0?'Ogni colonna ha la propria parità.':k===1?'Piccola scrittura: leggere A e P vecchi, poi scrivere A e P nuovi.':'Confronta il byte ricostruito con A dopo la scrittura.');
  });
  entry('6.3',(p,s,k)=>{
    const idx=Number(p.l),before=k===0,values=[17,34,k?p.v:'libera'];
    let g=title('FTL · rimappatura fuori posto');
    for(let n=0;n<2;n++)g+=card(39+n*286,48,190,49,'Pagina logica','L'+n,n===idx);
    for(let n=0;n<3;n++){
      const x=27+197*n,invalid=n===idx&&!before;
      g+=card(x,151,177,57,'Pagina fisica P'+n,invalid?'invalida':values[n],!before&&n===2);
    }
    for(let n=0;n<2;n++){const target=k&&n===idx?2:n,a=134+n*286,b=115+197*target;g+=route('M'+a+' 98C'+a+' 127 '+b+' 123 '+b+' 149',k>=1&&n===idx);}
    return g+foot(before?'P2 è una pagina libera già cancellata.':k===1?'L'+idx+' ora punta a P2.':'Lettura di L'+idx+' → P2: byte '+v(s,2)['Byte restituito']+'.');
  });
  entry('6.4',(p,s,k)=>{
    const n=v(s,0)['Pagine da migrare'],gc=p.st==='gc';
    let g=title('Flash · copia delle pagine vive e nuova programmazione');
    g+=txt(28,58,gc?'Blocco vittima · 8 pagine':'Percorso diretto su pagina già libera',14);
    if(gc){g+=cells(27,72,560,Array.from({length:8},(_,i)=>k>=1?'libera':i<n?'viva':'scarto'),i=>k===0&&i<n?'on':'',12);}
    g+=txt(28,132,'Spazio di destinazione',14);
    const count=Math.max(1,n+1);g+=cells(27,147,560,Array.from({length:count},(_,i)=>i<n?(k>=1?'copia':'·'):k===2?'host':'·'),i=>k===2&&i===n?'hot':k>=1&&i<n?'on':'',12);
    if(gc&&n&&k===1)g+=route('M560 109V144');
    return g+foot(k===2?'Programmazioni fisiche: '+v(s,2)['Programmazioni fisiche']+' · latenza: '+v(s,2)['Latenza totale (µs)']+' µs.':k===1?'Migrazioni: '+v(s,1)['Migrazioni (µs)']+' µs · cancellazione: '+v(s,1)['Cancellazione (µs)']+' µs.':'La nuova richiesta host riguarda una sola pagina.');
  });
  entry('7.1',(p,s,k)=>{
    const pio=k?v(s,1)['Cicli CPU']:0,dma=k===2?v(s,2)['Cicli CPU']:0,max=Math.max(1,pio,dma);
    let g=title('Occupazione del core · confronto per la stessa richiesta')+txt(26,57,p.n+' parole da 4 B · '+4*p.n+' B');
    g+=txt(28,100,'PIO',17)+ruler(123,77,459,[['per parola',pio,false]],max);
    g+=txt(28,157,'DMA',17)+ruler(123,134,459,[['setup',k===2?p.s:0,false],['fine',k===2?8:0,true]],max);
    if(k)g+=route('M124 '+(k===2?166:109)+'h'+(459*(k===2?dma:pio)/max));
    if(k)g+=txt(125,126,pio+' cicli CPU',13);
    if(k===2)g+=txt(125,188,dma+' cicli CPU = '+p.s+' di preparazione + 8 di completamento',13);
    return g+foot(k===2?'DMA impiega meno cicli CPU da '+v(s,2)['Prima lunghezza con risparmio (parole)']+' parole.':'Le barre misurano lavoro della CPU.');
  });
  entry('7.2',(p,s,k)=>{
    const width=Number(p.w),n=p.n,ranges=[];
    for(let i=0;i<n;i+=width)ranges.push([i,Math.min(width,n-i)]);
    let g=title('Finestra DMA · base 0x6000')+txt(28,60,n+' byte · massimo '+width+' per transazione');
    g+=wire('M29 142H600',C.green);
    for(const [i,length] of ranges){
      if(k===0)break;
      const x=29+570*i/n,w=570*length/n,last=i+length===n;
      g+=box(x,92,Math.max(1,w-2),44,k===2&&last?C.warm:C.fill,k===2&&last?C.gold:C.green,2);
      if(w>40)g+=txt(x+w/2,120,k===1&&last?'·':length+' B',12,'middle');
    }
    if(k)g+=route('M29 140H598',k===1);
    if(k===2){const last=ranges.at(-1);g+=route('M'+(29+570*last[0]/n)+' 142H599');}
    if(k)g+=txt(28,177,v(s,1)['Operazione in memoria']+' · '+v(s,1).Transazioni+' transazioni',15);
    return g+foot(k===2?'Ultima: da '+v(s,2)['Primo byte finale']+' a '+v(s,2)['Ultimo byte']+' inclusi.':'Le posizioni sul segmento rappresentano byte contigui del buffer.');
  });
  entry('7.3',(p,s,k)=>{
    const n=p.cap,prepared=v(s,0)['Descrittori preparati'],done=k===2?v(s,2).Restituiti:0;
    let g=title('Anello di descrittori · proprietà dello slot')+disk(171,135,77,'none',C.line);
    for(let i=0;i<n;i++){
      const a=2*Math.PI*i/n-Math.PI/2,x=171+77*Math.cos(a),y=135+77*Math.sin(a),device=k>=1&&i>=done&&i<prepared;
      g+=disk(x,y,12,device?C.warm:C.fill,device?C.gold:C.green)+txt(x,y+4,i,11,'middle');
    }
    if(k===1||k===2&&done){
      const count=k===1?prepared:done,angle=count*2*Math.PI/n;
      // Due archi espliciti rendono visibile anche un intero giro.
      const pt=a=>[171+62*Math.sin(a),135-62*Math.cos(a)].join(' ');
      g+=route('M171 73A62 62 0 0 1 '+pt(angle/2)+'A62 62 0 0 1 '+pt(angle));
    }
    g+=txt(171,140,n+' slot',16,'middle')+txt(316,74,'Verde: driver',15,'start',C.green)+txt(316,105,'Ambra: dispositivo',15,'start',C.gold);
    if(k===0)g+=txt(316,149,'Preparati: '+prepared,15);
    else if(k===1)g+=txt(316,149,'Pubblicati: '+v(s,1)['Slot del dispositivo'],15);
    else g+=txt(316,149,'Restituiti: '+done,15)+txt(316,178,'Riutilizzabili: '+v(s,2).Liberi,15);
    return g+foot('Ordine di pubblicazione e completamento: dallo slot 0.');
  });
  entry('7.4',(p,s,k)=>{
    const first=v(s,0),physical=first['Indirizzo fisico'],ram=k?v(s,1)['Contenuto in memoria']:17;
    let g=title('IOMMU · due traduzioni, un byte in RAM');
    g+=card(24,47,166,62,'VA della CPU',first['VA CPU'])+card(237,47,160,62,'Cache CPU','34')+card(452,74,157,74,'RAM · '+physical,ram,k===1&&p.op==='ok');
    g+=card(24,145,166,62,'Dispositivo',k?v(s,1)['Indirizzo programmato']:'·')+card(237,145,160,62,'IOMMU',k===2?v(s,2).Traduzione:'·',k===2);
    g+=wire('M190 76H236')+route('M398 76H431V108H449',k===1&&p.op==='ok');
    if(k>=1)g+=route('M191 176H234',k===2);
    if(k===2&&p.op!=='ptr')g+=route('M397 176H527V151');
    return g+foot(k===2?'Dato letto dal dispositivo: '+v(s,2)['Byte ricevuto']+'.':'Indirizzo DMA assegnato: '+first['Indirizzo DMA assegnato']+'.');
  });
  entry('7.5',(p,s,k)=>{
    const a=v(s,0)['Stato disponibile a (µs)'],irq=k?v(s,1)['Interrupt a (µs)']:0,ready=k?v(s,1)['Thread eseguibile a (µs)']:0,run=k===2?v(s,2)['Ripresa a (µs)']:0;
    const end=Math.max(a,irq,ready,run);
    let g=title('Dal completamento DMA al core')+ruler(30,70,560,[['DMA',a,false],['notifica',k?irq-a:0,true],['driver',k?ready-irq:0,false],['pronto',k===2?run-ready:0,true]],end);
    if(k>0){const before=k===1?a:ready;g+=route('M'+(30+560*before/end)+' 110H590');}
    const rows=[['Ultimo byte',a],...(k?[['Interrupt',irq],['Thread pronto',ready]]:[]),...(k===2?[['Ripresa',run]]:[])];
    rows.forEach(([name,val],i)=>g+=txt(30+(i%2)*300,146+Math.floor(i/2)*40,name+'   '+val+' µs',16,'start',i===rows.length-1?C.gold:C.dim));
    return g+foot(k===2?'Ultimo byte → ripresa: '+v(s,2)['Dall’ultimo byte alla ripresa (µs)']+' µs.':'Le larghezze delle fasce sono proporzionali alle durate.');
  });

  Object.assign(SL.sceneLab,scene);
  const knob=(id,label,min,max,initial)=>({id,label,min,max,step:1,iniziale:initial});
  const stage=(titolo,testo,valori)=>({titolo,testo,valori});
  SL.moduliAnimati[4]={
    titolo:'Dal bus alla ripresa del thread',
    teoria:SL.lezioni['modulo-4'].join(' '),
    domanda:'In quale istante si riceve l’ultimo byte e quanto tempo passa prima che il thread torni sul core?',
    previsione:{label:'Intervallo dall’ultimo byte alla ripresa del thread (µs)',valore:(p,stages)=>String(v(stages,4)['Ultimo byte → ripresa (µs)'])},
    controlli:[knob('coda','Richieste davanti a B (4 parole ciascuna)',0,3,1),knob('parole','Parole DMA della richiesta B',1,8,4),knob('attesa','Attesa da pronto a in esecuzione (µs)',0,12,4)],
    calcola(p){
      const start=5*p.coda, first=start+1, last=first+p.parole, irq=last+2, ready=irq+3, run=ready+p.attesa;
      return [
        stage('Richiesta e sospensione','All’istante zero il driver pubblica il descrittore di B per il buffer DMA e il thread va in attesa. I buffer sono coerenti e gli indirizzi DMA sono già validi.',[['Davanti in coda',p.coda],['Lunghezza (B)',4*p.parole],['Thread','sospeso']]),
        stage('Concessione del bus','Ogni richiesta precedente richiede un ciclo di arbitraggio e quattro cicli dati. B inizia il suo ciclo di arbitraggio dopo '+p.coda+' × 5 µs.',[['Inizio arbitraggio B (µs)',start],['Inizio dati B (µs)',first]]),
        stage('Scrittura DMA in RAM','Il bus consegna quattro byte per ciclo. La fine del trasferimento è il confine subito dopo l’ultimo ciclo dati di B.',[['Byte in RAM',4*p.parole],['Ultimo byte disponibile a (µs)',last],['Thread','sospeso']]),
        stage('Notifica e servizio','Il dispositivo pubblica il completamento e notifica il core. Il driver riacquisisce il buffer al termine del servizio e risveglia il thread.',[['Interrupt (µs)',irq],['Thread pronto a (µs)',ready],['Proprietario buffer','software']]),
        stage('Ritorno sul core','Lo scheduler assegna il core al thread dopo l’attesa selezionata. Il tempo fino alla ripresa include coda, bus, notifica, servizio e scheduling.',[['Ripresa (µs)',run],['Ultimo byte → ripresa (µs)',run-last],['Thread','in esecuzione']])
      ];
    },
    disegna(p,s,k){
      const wait=5*p.coda,segments=[];
      if(k>=1){for(let i=0;i<p.coda;i++)segments.push(['AR',1,true],['dati',4,false]);segments.push(['B: AR',1,true]);}
      if(k>=2)segments.push(['B: DMA',p.parole,false]);
      if(k>=3)segments.push(['IRQ',2,true],['driver',3,false]);
      if(k===4&&p.attesa)segments.push(['pronto',p.attesa,true]);
      // Le durate scelte fissano una scala comune per l’intera sequenza.
      const total=wait+1+p.parole+2+3+p.attesa;
      let g=title('Richiesta B · dal dispositivo al processo')+txt(27,62,'Descrittore: '+p.parole+' parole da 4 B   ·   '+p.coda+' richieste davanti');
      g+=ruler(28,84,578,segments,total);
      const passed=segments.reduce((sum,x)=>sum+x[1],0),x=28+578*passed/total;
      g+=disk(x,119,5,C.gold,C.gold)+txt(Math.max(55,Math.min(581,x)),141,passed+' µs',14,'middle',C.gold);
      const labels=['Sospeso','Pronto','Sul core'];
      const pos=k<3?0:k===3?1:2;
      labels.forEach((l,i)=>g+=card(28+200*i,154,168,54,'Thread',l,i===pos));
      if(k===3||k===4){const start=k===3?196:396;g+=route('M'+start+' 183h29');}
      return g+foot(k===4?'Ultimo byte → ripresa: '+v(s,4)['Ultimo byte → ripresa (µs)']+' µs.':'AR = arbitraggio · l’asse orizzontale misura il tempo in µs.');
    }
  };
})();
