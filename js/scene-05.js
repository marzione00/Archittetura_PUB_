'use strict';
(() => {
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const color = {ink:'#f1ece0', muted:'#c6bca6', wire:'#8b7e60', active:'#8cd4da', hot:'#f0c381', dark:'#1d180d', soft:'#193031'};
  const tint = mode => ({hot:color.hot, on:color.active, dim:color.wire})[mode] || color.muted;
  const values = (frames,k) => Object.fromEntries(frames[k].valori);
  const sum = numbers => numbers.reduce((a,b)=>a+b,0);
  function text(x,y,value,{size=15,align='start',fill=color.ink,mono=false}={}) {
    return '<text x="'+x+'" y="'+y+'" text-anchor="'+align+'" fill="'+fill+'" font-family="'+(mono?'ui-monospace, monospace':'system-ui, sans-serif')+'" font-size="'+size+'">'+esc(value)+'</text>';
  }
  const heading = title => text(20,24,title,{size:16,fill:color.active});
  const note = (label,y=229) => text(20,y,label,{size:14,fill:color.muted});
  function rect(x,y,w,h,mode='dim',radius=6){
    return SL.symbols.panel(x,y,w,h,mode==='hot'?'#382c1a':mode==='on'?color.soft:color.dark,tint(mode),mode==='hot'?'reveal':'');
  }
  function box(x,y,w,h,title,value,mode='dim'){
    if(SL.symbols.kind(title))return SL.symbols.node(x,y,w,h,title,value,mode);
    return rect(x,y,w,h,mode)+text(x+10,y+18,title,{size:13,fill:tint(mode)})+
      text(x+w/2,y+h-12,value,{size:Math.min(21,Math.max(12,Math.floor((w-14)/Math.max(1,[...String(value)].length)*1.48))),align:'middle',mono:true});
  }
  function chip(x,y,w,value,mode='on'){
    return rect(x,y,w,29,mode,5)+text(x+w/2,y+20,value,{size:Math.min(15,(w-7)/Math.max([...String(value)].length,1)*1.55),align:'middle',mono:true});
  }
  function sheet(x,y,w,h,title){
    return rect(x,y,w,h)+text(x+10,y+19,title,{size:14,fill:color.active});
  }
  function stroke(d,mode='dim',dashed=false){
    return '<path d="'+d+'" fill="none" stroke="'+tint(mode)+'" stroke-width="2"'+(dashed?' stroke-dasharray="5 5"':'')+'/>';
  }
  function arrow(x1,y1,x2,y2,hot=false){
    const a=Math.atan2(y2-y1,x2-x1), c=Math.cos(a),s=Math.sin(a);
    const d='M'+x1+' '+y1+' L'+x2+' '+y2;
    return stroke(d,hot?'hot':'dim')+'<path d="M'+(x2-8*c+4*s)+' '+(y2-8*s-4*c)+' L'+x2+' '+y2+' L'+(x2-8*c-4*s)+' '+(y2-8*s+4*c)+'" fill="none" stroke="'+(hot?color.hot:color.wire)+'" stroke-width="2"/>'+
      (hot?travel(d):'');
  }
  function travel(d){
    return SL.pen.travel(d);
  }
  function dot(x,y,r=6,mode='on'){
    return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+tint(mode)+'"/>';
  }
  function slots(x,y,n,width,paint) {
    if(!n)return '';
    const w=Math.min(56,width/n);
    return Array.from({length:n},(_,i)=>{const [label,mode]=paint(i);return chip(x+i*w,y,w-4,label,mode);}).join('');
  }
  function strip(x,y,w,tokens){
    return tokens.length?slots(x,y,tokens.length,w,i=>[tokens[i],i===0?'hot':'on']):text(x,y+19,'vuota',{size:14,fill:color.muted});
  }
  function intervalChart(segments,y,scale,label='Tempo del core (ms)'){
    const width=572,left=34;
    let out=text(left,y-12,label,{size:13,fill:color.muted})+stroke('M'+left+' '+(y+38)+' H'+(left+width));
    const end=segments.length?segments[segments.length-1].end:0;
    for(const [i,s] of segments.entries()){
      const x=left+width*s.start/scale,w=width*(s.end-s.start)/scale;
      const mode=s.name==='Δ'||s.name==='·'?'dim':i===segments.length-1?'hot':'on';
      out+=rect(x,y,Math.max(w-1,1),34,mode,2)+text(x+w/2,y+23,s.name,{size:15,align:'middle',mono:true});
      if(w>0)out+=text(x,y+53,s.start,{size:12,align:'middle',mono:true,fill:color.muted});
    }
    return out+text(left+width*end/scale,y+53,end,{size:12,align:'middle',mono:true,fill:color.muted});
  }
  function processMemory(p,frames,k){
    let g=heading('Lo stesso indirizzo virtuale in due processi');
    for(const [i,name] of ['A','B'].entries()){
      const y=46+84*i,active=k===1&&i===0||k===2&&i===1;
      g+=box(22,y,127,61,'PID '+(41+i),'processo '+name,active?'hot':'dim');
      g+=arrow(150,y+29,204,y+29,active);
      g+=box(205,y,144,61,'tabella di '+name,'VA 0x1000',active?'on':'dim')+arrow(350,y+29,426,y+29,active);
      g+=box(428,y,184,61,'pagina privata '+name,'x = '+(i===0&&k?p.dato:0),active?'hot':'dim');
    }
    return g+note(k===2?'B legge dalla propria pagina. Il byte modificato appartiene ancora ad A.':'Le due traduzioni raggiungono pagine private distinte.');
  }
  function processStates(p,frames,k){
    const io=p.caso==='io';
    const positions=!k?[['A'],['B'],[]]:io?(k===1?[['B'],[],['A']]:[['B'],['A'],[]]):k===1?[[],['B','A'],[]]:[['B'],['A'],[]];
    let g=heading('Un core, coda dei pronti e attesa del disco');
    ['Core','Pronti · testa a sinistra','Attesa I/O'].forEach((label,i)=>{
      const x=22+i*206;g+=sheet(x,69,179,83,label)+strip(x+11,109,159,positions[i]);
    });
    if(k)g+=io?(k===1?arrow(113,158,520,158,true):arrow(520,158,315,158,true)):(k===1?arrow(113,158,315,158,true):arrow(315,158,113,158,true));
    return g+note(frames[k].titolo+' · '+(io?'lettura su disco':'scadenza del timer'));
  }
  function contextSwitch(p,frames,k){
    const pc='0x'+(0x1000+4*p.n).toString(16).toUpperCase();
    return heading('Cambio di contesto · istruzioni di quattro byte')+box(22,51,178,75,'Contesto di A',k?pc:'in esecuzione',k===1?'hot':'dim')+
      box(234,111,166,68,'PC del core',k===2?pc:k===1?'0x2400':'0x1000','on')+
      box(438,51,179,75,'Contesto di B','0x2400',k===1?'on':'dim')+
      (k===1?arrow(239,140,191,120,true)+arrow(449,123,402,140,true):k===2?arrow(193,121,237,141,true):'')+
      note(k?'Avanzamento di A prima del cambio: '+p.n+' × 4 byte.':'A inizia da 0x1000. Ogni istruzione completata sposta il PC di quattro byte.');
  }
  function kernelRecord(p,frames,k){
    let g=heading('Scheda kernel del processo');
    if(p.caso==='sleep'){
      const states=['in esecuzione','bloccato','pronto'];const sites=['CPU','disco D','pronti'];
      g+=sheet(24,48,223,136,'Processo A · PID 34')+box(41,85,190,72,'stato',states[k],'on');
      for(let i=0;i<3;i++)g+=box(386,41+i*56,210,47,sites[i],i===k?'A':'—',i===k?'hot':'dim');
      return g+arrow(249,119,384,64+k*56,true)+note('Il collegamento alla coda identifica l’evento che può risvegliare A.');
    }
    g+=box(24,53,156,60,'processo A','TA')+box(24,138,156,60,'processo B','TB',k?'hot':'dim');
    g+=box(241,99,160,62,'tabella installata',k?'TB':'—',k?'on':'dim');
    if(k)g+=arrow(181,170,240,137,true);
    if(k===2)g+=arrow(402,133,447,133,true)+box(448,99,155,62,'VPN 2','frame 9','hot');
    return g+note('TA e TB conservano traduzioni appartenenti a spazi di indirizzi distinti.');
  }
  function cow(p,frames,k){
    const rootY=k?55:96;
    let g=heading('fork · copia su scrittura')+box(23,rootY,171,66,'padre · PID 80','x', 'on');
    if(k)g+=box(23,144,171,65,'figlio · PID 81','x',k===2?'hot':'on');
    g+=box(414,rootY,181,66,k===1?'pagina condivisa':'pagina del padre',p.x,'on')+arrow(196,rootY+33,410,rootY+33);
    if(k===1)g+=arrow(195,175,409,95,true);
    if(k===2)g+=arrow(195,175,409,175,true)+box(414,144,181,65,'copia del figlio',values(frames,k)['x figlio'],'hot');
    return g+note(['Il padre inizializza la pagina privata.','Le due traduzioni puntano alla stessa pagina fisica.','La scrittura del figlio separa le destinazioni fisiche.'][k]);
  }
  function stdout(p,frames,k){
    const file=p.caso==='file',redirect=k>0&&file;
    let g=heading('Descrittori di uscita dopo fork');
    g+=box(20,51,180,61,'shell','fd 1')+box(20,135,180,61,k===2?'echo':'figlio','fd 1','on')+
      box(424,51,186,61,'destinazione','terminale',!redirect?'on':'dim')+arrow(203,81,422,81);
    if(file)g+=box(424,135,186,61,'destinazione','esito.txt',redirect?'hot':'dim');
    g+=arrow(203,167,422,redirect?166:88,k>0);
    return g+note(k===2?'Scrittura di «ciao» sul descrittore 1 del comando.':redirect?'dup2 collega fd 1 del figlio al file aperto.':'Padre e figlio iniziano con stdout sul terminale.');
  }
  function execImage(p,frames,k){
    const ok=p.caso==='ok',changed=k>0&&ok;
    let g=heading('execve · identità, immagine e descrittori')+sheet(34,49,567,145,'Processo 71');
    g+=box(52,92,180,69,'immagine',changed?'analisi':'wrapper',k?'hot':'on');
    g+=box(249,92,151,69,'fd 3 · lavoro','aperto','on');
    g+=box(416,92,159,69,'fd 4 · CLOEXEC',changed?'chiuso':'aperto',changed?'dim':'on');
    if(k)g+=arrow(53,179,214,179,true);
    if(k===2)g+=chip(263,176,290,ok?'PC al punto d’ingresso di analisi':'PC nel ramo di errore del wrapper','hot');
    return g+note(k?(ok?'Il PID si conserva e l’immagine installata è analisi.':'ENOENT: la chiamata ritorna al wrapper.'): 'Il kernel tenta il caricamento nello stesso processo.');
  }
  function reap(p,frames,k){
    const y=109;
    return heading('Uscita del figlio e raccolta dello stato')+box(22,y-14,166,69,'figlio · PID 52',k?'terminato':'esegue',!k?'hot':'dim')+
      box(236,y-14,170,69,'record nel kernel',['—','zombie · 52','raccolto'][k],k===1?'hot':'dim')+
      box(460,y-14,153,69,'padre',k===2?'stato '+p.status:'lavora',k===2?'hot':'dim')+
      (k?arrow(189,y+18,230,y+18,k===1):'')+(k===2?arrow(407,y+18,455,y+18,true):'')+
      note(k===2?'waitpid restituisce 52. WEXITSTATUS vale '+p.status+'.':k===1?'Il record conserva PID e codice di uscita fino alla raccolta.':'Il valore destinato a _exit è '+p.status+'.');
  }
  function forkThreads(p,frames,k){
    const fresh=k===2&&p.caso==='exec',exit=k===2&&!fresh;
    let g=heading('fork da T2 · thread e mutex nelle due immagini');
    g+=sheet(23,53,247,127,'Padre')+chip(39,88,66,'T1','on')+chip(112,88,66,'T2','on')+text(40,149,'M appartiene a T1');
    if(k){g+=arrow(272,115,343,115,true)+sheet(345,53,266,127,'Figlio');
      g+=chip(362,88,218,exit?'uscita 127':fresh?'nuovo programma':'solo T2',exit?'dim':'hot');
      g+=text(362,151,exit?'_exit(127)':fresh?'nuova mappatura':'copia di M occupata',{size:14});
    }
    return g+note(frames[k].titolo+' · '+(k===0?'T2 è il chiamante di fork.':fresh?'execve ha sostituito lo spazio di indirizzi.':exit?'Il padre può raccogliere il figlio.':'T1 resta nel padre.'));
  }
  function wakeup(p,frames,k){
    const x=t=>60+t*93, first=p.pol==='rr'?5:p.t;
    let g=heading('Risveglio e prima assegnazione · un solo core')+
      text(35,62,'A usa il core dal tempo 0',{size:15})+stroke('M60 149 H602')+dot(60,149);
    for(let i=0;i<=5;i++)g+=text(x(i),174,i,{align:'middle',size:13,mono:true})+stroke('M'+x(i)+' 146 v8');
    if(k)g+=dot(x(p.t),149,7,'hot')+text(x(p.t),112,'B pronto',{align:'middle',fill:color.hot})+arrow(x(p.t),118,x(p.t),139,true);
    if(k===2){g+=chip(x(first)-27,66,54,'B','hot')+stroke('M'+x(first)+' 95 V148','on');
      if(first>p.t)g+=rect(x(p.t),181,x(first)-x(p.t),13,'hot',1);}
    return g+note(k===2?'Attesa di B dopo il risveglio: '+(first-p.t)+' ms.':'B inizialmente attende l’I/O. Le tacche misurano millisecondi.');
  }
  function jobOrder(p,frames,k){
    const periods=frames.slice(0,Math.min(k+1,3)).map(t=>{const v=Object.fromEntries(t.valori);return {name:t.titolo.slice(-1),start:v['attesa (ms)'],end:v['attesa (ms)']+v['burst (ms)']};});
    let g=heading('Tre arrivi al tempo 0 · '+(p.pol==='sjf'?'burst crescente':'ordine di arrivo'));
    ['A','B','C'].forEach((n,i)=>{g+=box(20+205*i,47,184,59,'burst '+n,([p.burst,3,1][i])+' ms',periods.some(s=>s.name===n)?'on':'dim');});
    g+=intervalChart(periods,139,p.burst+4);
    return g+note(k===3?'Attesa media: '+values(frames,k)['media (ms)']+' ms.':'Per ogni lavoro il tempo d’inizio coincide con l’attesa.');
  }
  function rrChart(p,frames,k){
    const left={A:5,B:3,C:2},q=['A','B','C'],segments=[];let time=0,previous='';
    for(const turn of frames.slice(1,Math.min(k+1,frames.length-1))){
      const n=turn.titolo.slice(-1),after=Object.fromEntries(turn.valori)['residuo (ms)'];
      if(previous&&previous!==n&&p.s){segments.push({name:'Δ',start:time,end:time+p.s});time+=p.s;}
      segments.push({name:n,start:time,end:time+left[n]-after});time+=left[n]-after;q.shift();left[n]=after;
      if(after)q.push(n);previous=n;
    }
    let g=heading('Round-robin · quanto '+p.q+' ms · cambio '+p.s+' ms')+text(23,53,'Pronti dopo il passo',{size:13,fill:color.muted})+strip(23,65,227,q);
    ['A','B','C'].forEach((n,i)=>{g+=box(267+i*119,48,104,58,'residuo '+n,left[n]+' ms',n===previous?'hot':'dim');});
    // La scala usa un limite superiore derivato dagli ingressi; il finale della traccia resta da costruire.
    const slots=[5,3,2].map(n=>Math.ceil(n/p.q)),limit=10+(sum(slots)-1)*p.s;
    if(k&&previous&&k<frames.length-1)g+=arrow(225,77,258,77,true);
    return g+intervalChart(segments,143,limit)+note(k===frames.length-1?'Prima CPU per B: '+values(frames,k)['prima risposta B (ms)']+' ms. Durata: '+time+' ms.':'Δ indica il tempo impiegato per un cambio di contesto, in ms.');
  }
  function priorities(p,frames,k){
    let g=heading('Scelta della CPU con priorità dinamiche');
    if(p.caso==='aging'){
      const apr=[1,3,4][k];g+=text(24,68,'Priorità A')+slots(171,49,4,331,i=>[i+1,i<apr?'hot':'dim']);
      g+=text(24,121,'Flusso pronto')+slots(171,102,4,331,i=>[i+1,i<3?'on':'dim']);
      return g+box(172,156,294,56,'core al tempo '+[0,4,6][k]+' ms',k===2?'A':'flusso a priorità 3','on');
    }
    if(p.caso==='feedback'){
      const high=[['A','B'],[],[]][k],low=[[],['A'],['A']][k];
      g+=sheet(24,44,282,149,'Code dei pronti')+text(38,92,'alta')+strip(103,69,186,high)+text(38,153,'bassa')+strip(105,132,186,low);
      g+=box(398,87,196,67,'core',k?'B':'da assegnare',k?'hot':'dim');if(k)g+=arrow(306,114,395,114,true);
      return g+note(k===2?'Il risveglio di B al livello superiore provoca la prelazione.':'Al livello alto il quanto vale 2 ms.');
    }
    const inh=p.caso==='inherit';
    g+=box(22,71,164,65,'H · priorità alta',k===2?'pronto':'bloccato',k===2?'hot':'dim')+
      box(237,71,165,65,'mutex Mx',k===2?'libero':'L','on')+box(451,71,162,65,'L · priorità',k===1&&inh?'alta':'bassa',k===1&&inh?'hot':'dim');
    if(k<2)g+=arrow(187,102,234,102,true)+arrow(404,102,448,102,k===1&&inh);
    return g+note(k===2?'Attesa di H: '+values(frames,k)['attesa di H']+'.':k===1?'CPU assegnata a '+values(frames,k).core+'.':'L possiede il mutex richiesto da H.');
  }
  function balancing(p,frames,k){
    const nums=k?values(frames,1):values(frames,0);let g=heading('Due core · ciascuna tessera richiede 1 ms');
    for(let i=0;i<2;i++){const y=52+i*69,n=nums['core '+i];g+=text(23,y+21,'core '+i,{fill:color.active})+slots(118,y,n,488,j=>[k===2?'✓':String(j+1),k===2?'hot':'dim']);}
    if(k===1&&p.balance==='move')g+=arrow(304,87,304,118,true);
    return g+note(k===2?'Ultimo completamento a '+values(frames,k)['tempo totale (ms)']+' ms.':k===1?'Lavori trasferiti dal core 0 al core 1: '+(p.n-nums['core 0'])+'.':'I numeri contano i lavori assegnati a ciascuna CPU.');
  }
  function threadHeap(p,frames,k){
    let g=heading('Due stack e registri distinti · heap condiviso')+sheet(22,43,590,151,'Un processo');
    g+=box(38,86,148,72,'registro T1',k?p.x:'—',k===1?'hot':'dim')+
      box(245,86,146,72,'heap · h',k?p.x:0,k?'on':'dim')+box(451,86,145,72,'registro T2',k===2?p.x:3,k===2?'hot':'dim');
    return g+arrow(188,122,241,122,k===1)+arrow(393,122,448,122,k===2)+note('La lettura di T2 avviene dopo la sincronizzazione.');
  }
  function parallelThreads(p,frames,k){
    const cols=Math.ceil(p.n/p.k),w=Math.min(105,499/cols),h=Math.min(38,141/p.k);let g=heading('Assegnazioni · un thread per core e per turno');
    for(let core=0;core<p.k;core++){
      g+=text(22,85+core*h,'core '+core,{size:14});
      for(let t=0;t<(k===2?cols:1);t++){
        const j=t*p.k+core,seen=k===2||k===1&&t===0;
        const x=108+t*w,y=65+core*h;
        g+=rect(x,y,w-5,h-4,j<p.n&&seen?(t===(k===1?0:cols-1)?'hot':'on'):'dim',4);
        if(seen)g+=text(x+(w-5)/2,y+(h-4)/2+5,j<p.n?'T'+(j+1):'—',{align:'middle',size:14,mono:true});
      }
    }
    for(let i=0;i<(k===2?cols:k===1?1:0);i++)g+=text(108+i*w,58,i+' ms',{size:12,fill:color.muted});
    return g+note(k===2?'Durata: '+cols+' ms.':'All’ingresso sono pronti '+p.n+' thread di uguale durata.');
  }
  function userKernel(p,frames,k){
    const workers=Number(p.k);
    let g=heading('Entità utente e worker schedulabili dal kernel')+text(22,67,'Utente')+slots(140,48,4,472,i=>['U'+(i+1),k&&i===0?'hot':'on']);
    g+=text(22,139,'Kernel')+slots(140,119,workers,472,i=>['W'+(i+1),k&&i===0?'hot':'dim']);
    if(k)g+=arrow(166,78,166,116,true)+text(137,177,'W1 attende il dispositivo',{size:14,fill:color.hot});
    return g+note(k===2?'Durante l’attesa, parallelismo massimo degli altri thread: '+values(frames,k)['massimo simultaneo']+'.':'Ogni worker esegue al più un thread utente alla volta.');
  }
  function threadArgs(p,frames,k){
    const shared=p.caso==='loop',failed=p.caso==='error';let g=heading('pthread_create · oggetti argomento e worker effettivi');
    for(let i=0;i<3;i++){
      const x=38+i*199,live=!(failed&&i===2);
      g+=box(x,47,163,60,'worker '+(i+1),live?(k===2?'raccolto':'creato'):'assente',live?'on':'dim');
      if(live)g+=arrow(x+81,108,shared?320:x+81,151,k===1);
      if(!shared)g+=box(x,157,163,56,'a['+i+']',i,'dim');
    }
    if(shared)g+=box(244,157,151,56,'stessa cella i',k?'3':'indice');
    return g+note(k===2?'pthread_join completati: '+values(frames,k)['join completati']+'.':'Ogni freccia identifica l’indirizzo passato al worker.',239);
  }
  function isolation(p,frames,k){
    const one=p.caso==='threads';let g=heading('Domini di isolamento e conseguenze del guasto');
    if(one)g+=sheet(29,70,578,96,'Processo di servizio');
    ['A','B','C'].forEach((n,i)=>{const x=44+i*187;
      if(!one)g+=sheet(x-10,70,168,96,'Processo '+n);
      const lost=k>0&&(one||i===1),name=k===2&&lost?n+' terminato':n+(k===1&&i===1?' · SIGSEGV':'');
      g+=chip(x,112,145,name,lost?'hot':'on');
    });
    return g+note(k===2?'Worker superstiti: '+values(frames,k)['lavoratori superstiti']+'. Il supervisore è esterno.':'Il riquadro esterno identifica lo spazio di indirizzi.');
  }
  function incrementScene(p,frames,k){
    const v=values(frames,k),hasAccess=v.cella!==undefined, title=frames[k].titolo;
    const name=hasAccess?title[0]:null,read=title.endsWith('lettura');
    let g=heading(p.zona?'Regione protetta dal mutex':'Due registri locali e una cella condivisa');
    if(p.zona){
      const x=p.zona==='all'?74:202;
      g+=stroke('M'+x+' 74 V51 H380 V74','hot')+text((x+380)/2,47,'sezione protetta',{size:12,align:'middle',fill:color.hot})+
        text(78,71,'lettura',{size:13})+text(221,71,'calcolo e scrittura',{size:13});
    }
    const y=p.zona?89:76;
    g+=box(22,y,151,72,'ultimo valore letto A',hasAccess?v['lettura A']:'—',name==='A'?'hot':'dim')+
      box(244,y,151,72,'cella condivisa',hasAccess?v.cella:v['cella iniziale'],'on')+
      box(464,y,152,72,'ultimo valore letto B',hasAccess?v['lettura B']:'—',name==='B'?'hot':'dim');
    if(hasAccess){const x=name==='A'?175:461,c=name==='A'?240:398;
      g+=read?arrow(c,y+35,x,y+35,true):arrow(x,y+35,c,y+35,true);}
    return g+note(hasAccess?(read?'La lettura copia la cella nel registro di '+name+'.':name+' scrive il valore della sua lettura più uno.'):v.protocollo);
  }
  function guardedCount(p,frames,k){
    const v=values(frames,k), count=v.contatore??v['totale dopo il rilascio']??v['totale letto'];
    let g=heading('Due lavoratori · un solo contatore protetto')+box(21,55,157,64,'ultimo ingresso',!k||k===frames.length-1?'—':frames[k].titolo.slice(-1),k?'on':'dim')+
      box(236,55,151,64,'mutex al confine','libero')+box(453,55,158,64,'contatore',count,'hot');
    if(k>0&&k<frames.length-1)g+=arrow(179,89,232,89,true)+arrow(389,89,451,89,true);
    g+=text(23,157,'Incrementi completati',{size:13})+slots(23,170,2*p.n,580,i=>[i<count?(i%2?'B':'A'):'·',i<count?'on':'dim']);
    return g+note(k===frames.length-1?'Dopo i join il padre legge '+count+'.':'Un ingresso comprende acquisizione, incremento e rilascio.');
  }
  function publication(p,frames,k){
    const ra=p.caso==='ra';
    let g=heading('Pubblicazione fra due thread · oggetti atomici')+
      text(22,78,'Produttore',{size:14})+chip(152,57,157,'dato ← 42')+chip(406,57,184,'pronto ← 1')+arrow(311,72,401,72)+
      text(22,163,'Consumatore',{size:14});
    if(k){g+=chip(406,140,184,'legge pronto = 1','hot')+arrow(500,91,500,137,ra);
      g+=text(509,118,ra?'acquire':'relaxed',{size:12,fill:color.muted});}
    if(k===2)g+=arrow(403,154,312,154,true)+chip(152,140,157,ra?'dato = 42':'dato ∈ {0, 42}',ra?'on':'hot');
    return g+note(k<2?'La freccia orizzontale segue l’ordine nel singolo thread.':ra?'Il collegamento release/acquire ordina anche la pubblicazione del dato.':'La lettura del flag relaxed consente ancora due valori per dato.');
  }
  function spin(p,frames,k){
    const spin=p.mode==='spin',width=p.d*37;
    let g=heading('Costo CPU e tempo trascorso · due core dedicati');
    g+=text(22,87,'CPU di A')+text(22,142,'CPU di B');
    if(k){
      g+=rect(143,61,width,37,'on',3)+text(149,86,'A',{size:15});
      if(spin)g+=rect(143,117,width,35,'hot',3)+text(149,140,'B',{size:15});
      else g+=stroke('M143 136 h'+width,'dim',true);
      g+=text(143,178,'0 ms',{size:12,mono:true})+text(143+width,178,p.d+' ms',{size:12,mono:true,align:'middle'});
    }
    g+=text(139,202,'Mutex M · proprietario '+(k===2?'B':'A'),{size:15,fill:color.active});
    return g+note(k===0?'B tenta di acquisire M.':spin?'B occupa il proprio core per '+p.d+' ms di spin.':'B consuma 0 core·ms di attesa nel modello a sospensione immediata.');
  }
  function semaphore(p,frames,k){
    const v=values(frames,k), free=v['permessi liberi'],all=v.bloccati==='nessuno'?[]:v.bloccati.split(', ');
    let g=heading('Semaforo contatore · permessi e coda FIFO')+sheet(24,55,250,113,'Permessi disponibili')+sheet(349,55,261,113,'Thread bloccati');
    for(let i=0;i<free;i++)g+=dot(55+i*32,115,11);
    if(!free)g+=text(51,122,'0',{mono:true});
    g+=strip(365,99,226,all);
    const prev=k?values(frames,k-1):{bloccati:'nessuno','permessi liberi':p.s};
    if(k<2&&all.length)g+=arrow(278,112,346,112,true);
    if(k>=2&&prev.bloccati!=='nessuno')g+=arrow(345,180,276,180,true);
    if(free!==prev['permessi liberi'])g+=text(38,155,prev['permessi liberi']+' → '+free,{size:13,mono:true,fill:color.hot});
    return g+note(frames[k].titolo+' · '+frames[k].testo);
  }
  function booking(p,frames,k){
    const cas=p.conf==='cas',v=values(frames,k);
    const permits=k===0?1:k===1?(cas?0:1):0;
    const confirmations=v.conferme??0;
    let g=heading('Due richiedenti e una sola poltrona')+box(22,68,149,68,'richiedente A',k? 'ha verificato':'pronto',k?'on':'dim')+
      box(240,62,159,81,'posti liberi',permits,'hot')+box(460,68,153,68,'richiedente B',k===0?'pronto':k===1?(cas?'atteso = 1':v.B):confirmations===2?'confermato':'respinto',k===2?'hot':'dim');
    if(k)g+=arrow(172,107,235,107,true);
    if(k===2||k===1&&p.conf==='split')g+=arrow(458,107,403,107,true);
    g+=text(23,190,'Conferme inviate',{size:14})+strip(191,168,190,Array.from({length:confirmations},(_,i)=>i?'B':'A'));
    return g+note(cas?'Il compare-exchange verifica e modifica lo stesso oggetto atomico.':p.conf==='split'?'Entrambi possono decidere prima delle scritture protette.':'Il controllo entra nello stesso tratto critico della registrazione.');
  }
  function boundedBuffer(p,frames,k){
    const v=values(frames,k),empty=v.vuoti??(p.cap-1);
    let g=heading('Buffer limitato · '+p.cap+' spazi')+slots(23,61,p.cap,585,i=>[i===0&&k?['','P','x','x'][k]:'·',i===0&&k?(k===3?'on':'hot'):'dim']);
    const nums=[empty,v['in transito'],v.pieni];
    ['vuoti','in transito','pieni'].forEach((label,i)=>{g+=box(24+i*204,122,175,60,label,nums[i],i===1&&nums[i]?'hot':nums[i]?'on':'dim');});
    if(k===1)g+=arrow(200,152,224,152,true);
    if(k===3)g+=arrow(404,152,428,152,true);
    return g+note('Invariante dei permessi: '+nums.join(' + ')+' = '+p.cap+'. P indica un posto prenotato.');
  }
  function fullBuffer(p,frames,k){
    const good=p.caso==='good',filled=!(good&&k>=1);
    let g=heading('Una sola cella · produttore P e consumatore C');
    g+=box(30,55,143,65,'produttore',good?(k===2?'pronto':'in attesa'):k?'attende spazio':'possiede M','on');
    g+=box(245,55,152,65,'buffer',filled?'pieno':'vuoto',filled?'hot':'dim');
    g+=box(467,55,143,65,'consumatore',good?(k?'ha rimosso':'pronto'):k?'attende M':'pronto','on');
    if(good&&k===1)g+=arrow(399,87,464,87,true);
    if(!good&&k){g+=arrow(143,154,500,154,true)+arrow(500,176,143,176,true);}
    if(!good&&k===2)g+=chip(220,185,204,'ciclo P → C → P','hot');
    return g+note(good?(k<2?'Mutex disponibile per la rimozione di C.':'Il permesso vuoto viene consegnato al produttore sospeso.'):'P detiene il mutex; C ne ha bisogno per liberare la cella.');
  }
  function condition(p,frames,k){
    const first=p.caso==='first',v=values(frames,k);let g=heading('Variabile condizione · risveglio e ricontrollo');
    g+=box(23,56,166,70,'elementi in coda',v.elementi??v['elementi finali']??0,'on');
    g+=box(238,56,161,70,'C1',k===0?'cond_wait':k===1?'risveglio':'ricontrollo',k===2?'hot':'dim');
    g+=box(448,56,165,70,'altro consumatore',!first&&k?'C2 ha consumato':'—',!first&&k?'on':'dim');
    if(k===1)g+=arrow(191,91,233,91,true);
    if(k===2)g+=arrow(235,155,191,155,true)+chip(214,167,212,'elementi > 0: '+(first?'vero':'falso'),first?'on':'hot');
    return g+note(k===2?(first?'C1 ha rimosso l’elemento.':'C1 torna ad attendere dopo il controllo.'):'La notifica invita il thread a ricontrollare sotto mutex.');
  }
  function readers(p,frames,k){
    const fair=p.caso==='fair';
    const inside=!k?['L1']:k===1?(fair?['L1']:['L1','L2']):fair?['S']:['L2'];
    const waiting=fair&&k>0?(k===1?['S','L2']:['L2']):['S'];
    let g=heading('Accesso ai dati · lettori e scrittore')+sheet(23,56,252,101,'In attesa · ordine di arrivo')+strip(39,99,213,waiting);
    g+=sheet(362,56,248,101,'Nel tratto di accesso')+strip(378,99,201,inside);
    if(k&&((!fair&&k===1)||(fair&&k===2)))g+=arrow(277,106,359,106,true);
    return g+note(fair?'La coda rispetta l’ordine di arrivo fra gruppi incompatibili.':'I lettori possono affiancarsi mentre S attende accesso esclusivo.');
  }
  function locks(p,frames,k){
    const ordered=p.ordine==='ord',done=ordered&&k===2;
    const owners=done?['libero','libero']:[ 'A',ordered?(k?'A':'libero'):'B' ];
    let g=heading('Due lock · proprietà e attesa')+box(22,53,157,61,'lock X',owners[0],owners[0]==='libero'?'dim':'on')+box(459,53,157,61,'lock Y',owners[1],owners[1]==='libero'?'dim':'on');
    g+=chip(101,160,80,'A')+chip(461,160,80,'B');
    if(!done&&ordered)g+=arrow(460,176,185,176,true);
    if(!ordered&&k)g+=arrow(184,166,457,166,true)+arrow(458,184,185,184,true);
    if(!ordered&&k===2)g+=chip(220,193,203,'deadlock','hot');
    return g+note(done?'Entrambi possono completare seguendo il rango X prima di Y.':'Arco fra processi: chi attende → chi deve rilasciare.');
  }
  function resourceGraph(p,frames,k){
    const multiple=p.caso==='multi',escapes=multiple&&k===2;
    let g=heading('Grafo di assegnazione · una freccia ha una direzione');
    g+=chip(37,103,86,'A',k&&!escapes?'hot':'on')+chip(445,103,84,'B',k&&!escapes?'hot':'on');
    g+=box(211,39,147,54,'risorsa X','1 istanza');
    g+=box(212,155,146,54,'risorsa Y',multiple?'2 istanze':'1 istanza','on');
    if(!escapes){
      g+=arrow(209,74,120,101)+arrow(359,172,443,130);
      if(k)g+=arrow(122,133,211,171,true)+arrow(444,100,361,76,true);
      if(multiple){g+=chip(503,175,80,'C','on')+arrow(360,190,498,190,k===1);}
      if(k===2)g+=chip(377,160,133,'deadlock','hot');
    }else{
      g+=chip(503,175,80,'C','on')+arrow(501,192,361,192,true)+arrow(212,176,126,133,true);
    }
    return g+note(escapes?'C rilascia una Y. A può completare, seguito da B.':'Richiesta: processo → risorsa. Assegnazione: risorsa → processo.');
  }
  function prevention(p,frames,k){
    const set=p.caso==='set',winner=set&&k===2?'B':'A';
    let g=heading('Prevenzione dello stallo · protocollo di acquisizione')+box(26,51,142,58,'X',winner,'on')+box(208,51,142,58,'Y',set||k?winner:'libero',set||k?'on':'dim');
    if(set){g+=stroke('M28 117 v10 H348 v-10','hot')+text(188,147,'un’unica prenotazione',{size:13,align:'middle'});}
    else g+=arrow(170,81,205,81,k>0);
    g+=box(427,51,184,72,'B durante l’attesa',set?'detiene 0 risorse':'aspetta X');
    if(set&&k===1)g+=text(429,146,'Richiesta: {X, Y}',{size:14,fill:color.hot});
    const names=['Esclusione','Possesso in attesa','Assenza di prelazione','Attesa circolare'];
    names.forEach((name,i)=>{const eliminated=k===2&&i===(set?1:3);
      g+=chip(19+155*i,163,146,name,eliminated?'hot':'dim');if(eliminated)g+=text(91+155*i,213,'spezzata',{size:13,align:'middle',fill:color.hot});});
    return g;
  }
  function banker(p,frames,k){
    const held=[[1,0],[1,1],[1,0]],max=[[2,2],[2,1],[1,2]];
    const finishes=frames.slice(0,k+1).filter(s=>s.titolo.startsWith('Completamento ipotetico di '));
    const done=finishes.map(s=>s.titolo.slice(-1)),free=[p.a,p.b];
    done.forEach(n=>held[n.charCodeAt(0)-65].forEach((v,j)=>{free[j]+=v;}));
    let g=heading('Banchiere · verifica separata per X e Y')+text(26,62,'Processo',{size:13})+text(128,62,'detiene',{size:13})+text(246,62,'massimo',{size:13})+text(368,62,'bisogno',{size:13});
    for(let i=0;i<3;i++){
      const y=74+40*i,n='ABC'[i],finished=done.includes(n),need=max[i].map((v,j)=>v-held[i][j]);
      g+=chip(26,y,70,n+(finished?' ✓':''),finished?'on':'dim');
      [held[i],max[i],k?need:null].forEach((pair,j)=>{g+=chip(115+j*120,y,104,pair?'('+pair.join(', ')+')':'?',!finished&&k&&j===2&&need.every((v,x)=>v<=free[x])?'hot':'dim');});
    }
    g+=box(478,89,132,79,'libere (X, Y)','('+free.join(', ')+')','on');
    if(k>1&&k<frames.length-1)g+=arrow(467,129,476,129,true);
    return g+note(k===frames.length-1?'Stato '+values(frames,k).stato+' · sequenza: '+values(frames,k).sequenza+'.':'La spunta segna un completamento ipotetico; le dotazioni in tabella sono iniziali.');
  }
  function recovery(p,frames,k){
    const victim=p.caso.toUpperCase(),other=victim==='A'?'B':'A';
    const ownerX=!k?'A':k===2?'libero':victim==='A'?'libero':'A',ownerY=!k?'B':k===2?'libero':victim==='B'?'libero':'B';
    let g=heading('Rollback di una transazione · grafo delle attese');
    g+=box(29,52,155,63,'proprietario X',ownerX)+box(454,52,155,63,'proprietario Y',ownerY);
    g+=chip(88,153,94,'A',k&&victim==='A'?'hot':'on')+chip(461,153,94,'B',k&&victim==='B'?'hot':'on');
    if(k===0)g+=arrow(184,157,459,157,true)+arrow(459,176,184,176,true);
    if(k===1)g+=box(241,63,157,68,'log di undo','annulla '+victim,'hot');
    return g+note(!k?'A aspetta il rilascio di Y da B. B aspetta X da A.':k===1?'Il rollback di '+victim+' rilascia '+(victim==='A'?'X':'Y')+' e cancella la sua richiesta pendente.':other+' termina per primo; '+victim+' può ritentare.');
  }
  function progressRounds(p,frames,k){
    const counted=Math.min(k,p.n),starve=p.caso==='starve';let g=heading('Una colonna per giro · conta il lavoro completato');
    const col=(j)=>143+j*76;
    for(let i=0;i<counted;i++)g+=text(col(i)+25,68,'g'+(i+1),{size:13,align:'middle',fill:color.muted});
    g+=text(23,103,starve?'Lettori':'Worker A',{size:15})+text(23,160,starve?'Scrittore S':'Worker B',{size:15});
    for(let i=0;i<counted;i++){
      g+=chip(col(i),82,63,starve?'L'+i:'ritenta',starve?(i===counted-1?'hot':'on'):'hot');
      g+=chip(col(i),139,63,starve?'attesa':'ritenta','dim');
    }
    return g+note(k===frames.length-1?'Con ripetizione indefinita: '+values(frames,k).diagnosi+'.':'Operazioni concluse finora: '+(starve?counted:0)+'.');
  }

  const lessons={
    '5.1.1':processMemory,'5.1.2':processStates,'5.1.3':contextSwitch,'5.1.4':kernelRecord,
    '5.2.1':cow,'5.2.2':stdout,'5.2.3':execImage,'5.2.4':reap,'5.2.5':forkThreads,
    '5.3.1':wakeup,'5.3.2':jobOrder,'5.3.3':rrChart,'5.3.4':priorities,'5.3.5':balancing,
    '5.4.1':threadHeap,'5.4.2':parallelThreads,'5.4.3':userKernel,'5.4.4':threadArgs,'5.4.5':isolation,
    '5.5.1':incrementScene,'5.5.2':incrementScene,'5.5.3':guardedCount,'5.5.4':publication,'5.5.5':spin,
    '5.5.6':semaphore,'5.5.7':booking,'5.6.1':boundedBuffer,'5.6.2':fullBuffer,'5.6.3':condition,
    '5.6.4':readers,'5.6.5':locks,'5.7.1':resourceGraph,'5.7.2':prevention,'5.7.3':banker,
    '5.7.4':recovery,'5.7.5':progressRounds
  };
  Object.assign(SL.sceneLab,lessons);

  // A esegue due burst da 2 ms separati dall'I/O. B richiede 5 ms di CPU.
  // Un completamento I/O entra nella FIFO prima del reinserimento per scadenza simultanea.
  function integrated(p){
    let time=0,previous='',running='',wake=null,firstB=null,phaseA=0;
    const left={A:2,B:5},ready=['A','B'],log=[],states=[];
    function append(title,story){
      const queue=ready.slice(), io=wake===null?'—':'A', core=running||'libero';
      const statusA=io==='A'?'bloccato':core==='A'?'in esecuzione':queue.includes('A')?'pronto':phaseA===2?'terminato':'in transizione';
      const statusB=core==='B'?'in esecuzione':queue.includes('B')?'pronto':left.B===0?'terminato':'in transizione';
      states.push({titolo:title,testo:story,valori:[['tempo (ms)',time],['core',core],['pronti',queue.join(', ')||'nessuno'],['attesa I/O',io],['prima CPU di B (ms)',firstB??'—']],
        vista:{time,core,queue,io,firstB,statusA,statusB,left:{...left},segments:log.map(s=>({...s}))}});
    }
    function tick(name,end){
      if(end>time)log.push({name,start:time,end});
      time=end;
    }
    function awaken(){
      wake=null;ready.push('A');append('Risveglio di A','Il disco completa la richiesta al tempo '+time+' ms. A entra in fondo alla coda dei pronti.');
    }
    function advance(name,end,work=false){
      if(wake!==null&&wake<end){
        if(work)left[name]-=wake-time;
        tick(name,wake);awaken();
      }
      if(work)left[name]-=end-time;
      tick(name,end);
    }
    append('Arrivo di A e B','A e B sono pronti al tempo 0, in questo ordine. La prima assegnazione è gratuita.');
    while(ready.length||wake!==null){
      if(!ready.length){
        running='';previous='';
        tick('·',wake);awaken();continue;
      }
      const n=ready.shift(),cost=previous&&n!==previous?p.costo:0;
      if(cost){
        running='Δ';append('Passaggio da '+previous+' a '+n,'Il dispatcher ha scelto '+n+'. Il cambio di contesto occupa '+cost+' ms.');
        advance('Δ',time+cost);
        if(wake===time)awaken();
      }
      running=n;if(n==='B'&&firstB===null)firstB=time;
      const start=time,duration=Math.min(p.quanto,left[n]);
      append('Assegnazione a '+n,n+' prende il core al tempo '+time+' ms. Il burst corrente ha ancora '+left[n]+' ms di lavoro.');
      advance(n,start+duration,true);
      if(wake===time)awaken();
      running='';previous=n;
      if(n==='A'&&left.A===0&&phaseA===0){
        phaseA=1;left.A=2;wake=time+p.io;
        append('Richiesta al disco','A ha completato il primo burst e chiede I/O. Il dispositivo richiede '+p.io+' ms; durante l’attesa A lascia il core.');
      }else if(left[n]===0){
        if(n==='A')phaseA=2;
        append('Fine di '+n,n+' completa il proprio lavoro al tempo '+time+' ms. Il dispatcher può scegliere il prossimo pronto.');
      }else{
        ready.push(n);append('Scadenza del quanto di '+n,'Il turno è durato '+duration+' ms. '+n+' resta pronto con '+left[n]+' ms nel burst corrente e si accoda in fondo.');
      }
    }
    append('Bilancio del core','B ha ricevuto il core per la prima volta a '+firstB+' ms. Il tempo totale è '+time+' ms. Le fasce Δ indicano il costo dei cambi; un punto indica tempo inattivo.');
    return states;
  }
  function integratedView(p,frames,k){
    const s=frames[k].vista;
    let g=heading('Round-robin con I/O · t = '+s.time+' ms');
    g+=sheet(21,42,186,65,'Coda dei pronti')+strip(33,70,164,s.queue)+box(238,42,147,65,'core',s.core,s.core==='libero'?'dim':'hot')+
      box(437,42,175,65,'attesa disco',s.io,s.io==='A'?'hot':'dim');
    if(frames[k].titolo==='Risveglio di A')g+=arrow(432,113,189,113,true);
    if(frames[k].titolo==='Richiesta al disco')g+=arrow(390,75,433,75,true);
    if(frames[k].titolo.startsWith('Assegnazione'))g+=arrow(208,75,234,75,true);
    g+=text(23,135,'A: '+s.statusA+'   ·   B: '+s.statusB,{size:14,fill:color.muted});
    // Un reticolo iniziale indipendente dalla fine futura evita di svelare la durata.
    const scale=Math.max(12,Math.ceil(s.time/6)*6);
    if(k===frames.length-1)g+=text(620,135,'B entra a '+s.firstB+' ms',{size:14,align:'end',fill:color.hot});
    return g+intervalChart(s.segments,167,scale,'Traccia accumulata (ms)')+
      note('A: CPU 2 ms → disco '+p.io+' ms → CPU 2 ms.   B: CPU 5 ms.',243);
  }
  SL.moduliAnimati[5]={
    titolo:'Chi può usare il core?',
    teoria:SL.lezioni['modulo-5'].join(' '),
    domanda:'A quale istante B ottiene per la prima volta il core?',
    controlli:[
      {id:'quanto',label:'Quanto della CPU (ms)',min:1,max:4,step:1,iniziale:2},
      {id:'io',label:'Durata della lettura su disco (ms)',min:2,max:8,step:1,iniziale:4},
      {id:'costo',label:'Costo di un cambio (ms)',min:0,max:2,step:1,iniziale:1}
    ],
    previsione:{label:'Prima assegnazione del core a B (ms)',valore:(p,frames)=>String(values(frames,frames.length-1)['prima CPU di B (ms)'])},
    calcola:integrated,disegna:integratedView
  };
})();
