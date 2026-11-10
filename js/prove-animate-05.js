'use strict';
(() => {
  const {text,rect,box,arrow,travel,line,path,dot}=SL.pen;
  const scenes={};
  const title=s=>text(20,25,s,'title');
  const foot=s=>text(20,231,s,'label');
  const ele=(n,prefix='P')=>Array.from({length:n},(_,i)=>prefix+(i+1));
  const fmt=n=>'0x'+n.toString(16).toUpperCase();
  // I valori numerici sono quelli dichiarati nella consegna della variante attiva.
  const operands=v=>(v.consegna.match(/0x[\da-f]+|\d+/gi)||[]).map(Number);
  const caption=(x,y,txt)=>text(x,y,txt,'small');
  function token(x,y,w,s,active=true){
    return rect(x,y,w,30,active?'cell hot reveal':'cell',4)+text(x+w/2,y+20,s,'label','middle');
  }
  function rack(x,y,w,items,hot=-1){
    if(!items.length)return text(x+3,y+20,'—','muted');
    const dx=Math.min(w/items.length,79);
    return items.map((s,j)=>token(x+j*dx,y,dx-4,s,j===hot)).join('');
  }
  function flow(x1,y1,x2,y2,on){
    return arrow(x1,y1,x2,y2,on)+(on?travel('M'+x1+' '+y1+' L'+x2+' '+y2):'');
  }
  function labelRow(y,name,items,hot=-1){
    return text(23,y+20,name,'label')+rack(193,y,413,items,hot);
  }
  function block(x,y,w,top,value,on=false){
    return box(x,y,w,61,top,value,on?'cell hot reveal':'cell');
  }
  function lane(y,name,segments,end,ticks=true){
    const left=101,w=508,scale=Math.max(1,end);
    let g=text(20,y+25,name,'label')+line(left,y+36,left+w,y+36,'wire dim');
    let t=0;
    for(const [j,[job,length,hot=false]] of segments.entries()){
      if(length<=0)continue;
      const x=left+w*t/scale,sw=w*length/scale;
      g+=rect(x,y,Math.max(1,sw-1),35,hot?'cell hot reveal':'cell active',2)+text(x+sw/2,y+24,job,'label','middle');
      if(ticks)g+=text(x,y+52,t,'small','middle');t+=length;
    }
    return g+(ticks?text(left+w*t/scale,y+52,t,'small','middle'):'');
  }
  function tiles(y,n,states){
    return rack(28,y,575,Array.from({length:n},(_,i)=>states(i)));
  }
  function progress(k,strings){return foot(strings[k]);}

  scenes['5.1/1']=(v,k)=>{
    const [n,c]=operands(v),jobs=ele(n);
    let g=title('Istanze del programma e posti sui core');
    g+=labelRow(50,'Istanze avviate',jobs)+labelRow(104,'Core',ele(c,'C'));
    if(k>=2)g+=labelRow(158,'In esecuzione',jobs.slice(0,c),c-1);
    return g+progress(k,['Tutte le istanze sono pronte e monothread.','Ogni tessera corrisponde a un PID distinto: '+n+'.','Sono occupati '+c+' core.','Pronti in attesa: '+(n-c)+'.']);
  };
  scenes['5.1/2']=(v,k)=>{
    const io=v.consegna.includes('disco');
    const rows=io?[[['A'],['B'],[]],[[],['B'],['A']],[['B'],[],['A']],[['B'],['A'],[]]]:
      [[['A'],['B'],[]],[[],['B','A'],[]],[['B'],['A'],[]],[['A'],[],[]]];
    return title('Transizioni al confine degli eventi')+['Core','Pronti · FIFO','Attesa I/O'].map((n,j)=>labelRow(52+53*j,n,rows[k][j],0)).join('')+
      progress(k,io?['A richiede i dati.','A entra nell’attesa del disco.','Il dispatcher seleziona B.','A torna nei pronti; B conserva il core.']:['Il quanto di A sta per scadere.','A si accoda dietro B.','B usa il core.','B termina e A riparte.']);
  };
  scenes['5.1/3']=(v,k)=>{
    const [n,w,base]=operands(v),pc=base+n*w;
    let g=title('PC e pagine private dopo il timer')+block(22,52,155,'Base del codice',fmt(base));
    if(k>=1)g+=rack(211,65,388,ele(n,'I'),n-1)+text(211,119,n+' istruzioni × '+w+' byte','label');
    g+=block(23,140,177,'PC salvato',k>=2?fmt(pc):'?',k===2);
    if(k>=2)g+=flow(245,122,169,141,k===2);
    if(k===3)g+=block(403,139,192,'spazio privato A','pagine heap',true);
    return g+progress(k,['Il timer arriva fra due istruzioni.',n*w+' byte completati.','Il prossimo prelievo è a '+fmt(pc)+'.','Il contesto ripristina i registri. L’heap rimane nelle pagine di A.']);
  };
  scenes['5.1/4']=(v,k)=>{
    const [,q,s]=operands(v);let g=title('Prima risposta di D · tre lavori lo precedono')+labelRow(46,'Coda iniziale',['A','B','C','D']);
    const pieces=[];if(k)for(const name of ['A','B','C']){pieces.push([name,q]);if(k>=2)pieces.push(['Δ',s,true]);}
    g+=lane(113,'Core',pieces,3*(q+s),k>=2);
    return g+progress(k,['Quanto '+q+' ms. Cambio '+s+' ms. Prima assegnazione gratuita.','Lavoro utile dei primi tre turni: '+(3*q)+' ms.','Tre intervalli Δ aggiungono '+(3*s)+' ms.','D inizia a '+(3*(q+s))+' ms, a fronte di un arrivo a 0 ms.']);
  };
  scenes['5.1/5']=(v,k)=>{
    const [cores,n,blocked]=operands(v),jobs=ele(n),ready=jobs.slice(0,n-blocked);
    const slots=k>=2?ready.slice(0,cores):ele(cores,'C');
    let g=title('Assegnazione dei processi monothread');
    g+=labelRow(47,'Core',slots,k>=2?0:-1)+labelRow(102,k?'Pronti':'Processi',k>=2?ready.slice(cores):k?ready:jobs);
    g+=labelRow(157,'Rete',jobs.slice(n-blocked),k===3?0:-1);
    return g+progress(k,['Gli identificatori sono illustrativi; ogni tessera è un processo.',n+' − '+blocked+' = '+ready.length+' candidati.',cores+' in esecuzione e '+(ready.length-cores)+' pronti in coda.','Rete: '+blocked+' bloccati. Il totale rimane '+n+'.']);
  };
  scenes['5.2/1']=(v,k)=>{
    const [parent,child]=operands(v),ok=child!==undefined;
    let g=title('Ritorno della stessa fork nei rami creati')+block(30,90,151,'chiamante','PID '+parent);
    if(k){g+=flow(182,119,299,77,k===1)+block(303,45,233,'padre',k>=2?'r = '+(ok?child:-1):'PID '+parent,k===2);
      if(ok)g+=flow(182,121,300,177,k===1)+block(303,148,233,'figlio · PID '+child,k===3?'r = 0':'creato',k===3);
      else g+=text(326,183,'Limite di processi raggiunto','label');}
    return g+progress(k,[ok?'Dato del caso: il kernel assegna al figlio il PID '+child+'.':'Dato del caso: il limite dei processi è raggiunto.',ok?'Il figlio riceve una copia del contesto.':'La creazione si arresta.',ok?'Il padre riceve il PID del figlio.':'Il padre riceve −1.',ok?'Una chiamata riuscita ha creato un figlio.':'Esiste soltanto il chiamante.']);
  };
  scenes['5.2/2']=(v,k)=>{
    const [,x,b]=operands(v);let g=title('fork · memoria privata e descrizione aperta condivisa');
    g+=block(21,51,178,'pagina del padre','x = '+x);
    if(k)g+=block(21,139,178,'pagina del figlio','x = '+(k>=2?x+1:x),k===2);
    g+=block(391,94,217,'descrizione aperta','offset '+(k===3?b:0),k===3)+flow(202,83,389,117,false);
    if(k)g+=flow(202,170,389,134,k===1||k===3);
    return g+progress(k,['Il padre apre il file prima di fork.','Due descrittori rimandano allo stesso stato aperto.','Il figlio modifica soltanto la propria copia di x.','Dopo wait il padre osserva x = '+x+' e offset '+b+'.']);
  };
  scenes['5.2/3']=(v,k)=>{
    const [pid,fd,close]=operands(v);
    let g=title('execve · il contenitore di risorse del processo')+rect(30,47,580,139,'cell')+text(49,70,'Processo '+pid,'label');
    g+=block(46,98,170,'immagine',k?'nuovo codice':'codice iniziale',k===1)+block(234,98,155,'fd '+fd,'aperto')+
      block(409,98,179,'fd '+close+' · CLOEXEC',k===0?'aperto':k===3?'chiuso':'da verificare',k===3);
    return g+progress(k,['I due descrittori sono inizialmente aperti.','Codice, dati e stack vengono sostituiti.','Il nuovo punto d’ingresso viene eseguito con PID '+pid+'.','Il file sul descrittore '+fd+' resta accessibile.']);
  };
  scenes['5.2/4']=(v,k)=>{
    const [pid,code]=operands(v);
    let g=title('Terminazione e raccolta · traccia di waitpid')+block(22,86,144,'figlio',pid)+block(236,86,171,'record nel kernel',k===0?'—':k===3?'raccolto':'zombie',k===1)+block(482,86,132,'padre',k>=2?'PID '+pid:'lavora',k>=2);
    if(k)g+=flow(168,117,232,117,k===1);if(k>=2)g+=flow(409,117,478,117,k===2);
    return g+progress(k,['_exit('+code+') precede di un secondo la raccolta.','Il kernel conserva PID e stato di uscita.','waitpid consegna al padre il PID e lo stato.','Uscita normale: WEXITSTATUS = '+code+'.']);
  };
  scenes['5.2/5']=(v,k)=>{
    const both=v.consegna.includes('>=');let g=title('Albero dei rami che raggiungono fine()')+token(25,101,89,'origine');
    if(k){g+=flow(118,116,223,74,k===1)+flow(118,116,223,162,k===1)+token(226,59,125,'padre · r>0')+token(226,147,125,'figlio · r=0');}
    if(k>=2){g+=flow(355,73,451,52,k===2)+flow(355,75,451,91,k===2)+token(453,37,111,'padre')+token(453,78,111,'nuovo');
      if(both)g+=flow(355,160,451,141,k===2)+flow(355,163,451,183,k===2)+token(453,127,111,'figlio')+token(453,169,111,'nuovo');
      else g+=flow(355,160,451,160,false)+token(453,146,111,'figlio');}
    return g+progress(k,[both?'Condizione sul ritorno: r ≥ 0.':'Condizione sul ritorno: r > 0.','La prima fork produce due rami.',both?'Padre e figlio eseguono la seconda fork.':'Il padre esegue la seconda fork.','Chiamate effettive: '+(both?3:2)+'. Processi finali: '+(both?4:3)+'.']);
  };
  scenes['5.3/1']=(v,k)=>{
    const [a,b,c,d,e]=operands(v),parts=[['attesa',b-a,k===1],['P',c-b],['attesa',d-c,k===2],['P',e-d]];
    let g=title('Stato di P lungo il tempo')+caption(104,65,'Origine della scala: arrivo di P al tempo '+a+' ms');
    g+=lane(89,'P',parts,e-a,false);
    const w=508/(e-a);for(const t of [a,b,c,d,e])g+=text(101+(t-a)*w,143,t,'small','middle');
    return g+progress(k,['Le due fasce P sono gli intervalli di esecuzione forniti.', 'Risposta: '+b+' − '+a+' = '+(b-a)+' ms.','Attesa totale: '+(b-a)+' + '+(d-c)+' = '+(b-a+d-c)+' ms.','Turnaround: '+e+' − '+a+' = '+(e-a)+' ms.']);
  };
  scenes['5.3/2']=(v,k)=>{
    const [,a,b,c]=operands(v),all=[['A',a],['B',b],['C',c]],total=a+b+c;
    let g=title('FCFS · lavori pronti al tempo zero')+labelRow(45,'Ordine di arrivo',all.map(([n,t])=>n+' '+t));
    g+=lane(110,'CPU',k?all.slice(0,k===1?2:3):[],total);
    return g+progress(k,['La larghezza di ogni turno sarà proporzionale al burst.','A termina a '+a+' e B a '+(a+b)+' ms.','C termina a '+total+' ms. Le attese sono 0, '+a+' e '+(a+b)+'.','Attesa media: (0 + '+a+' + '+(a+b)+') / 3 = '+((2*a+b)/3)+' ms.']);
  };
  scenes['5.3/3']=(v,k)=>{
    const [,a,t,b]=operands(v),jr=k===1?[['A',t]]:k>=2?[['A',a],['B',b]]:[],short=k===1||k===2?[['A',t]]:k===3?[['A',t],['B',b,true],['A',a-t]]:[];
    return title('Stessi arrivi · SJF senza prelazione e SRTF')+lane(55,'SJF',jr,a+b)+lane(128,'SRTF',short,a+b)+
      progress(k,['A richiede '+a+' ms; B arriva a '+t+' ms e richiede '+b+' ms.', 'Quando B arriva, A ha '+(a-t)+' ms residui.','Con SJF B completa a '+(a+b)+' ms.','Con SRTF B completa a '+(t+b)+' ms, poi A riprende.']);
  };
  scenes['5.3/4']=(v,k)=>{
    const [a,b,c,q]=operands(v),all=[a,b,c],queue=all.map((t,j)=>({n:'ABC'[j],t})),trace=[];
    while(queue.length){const j=queue.shift(),d=Math.min(q,j.t);trace.push([j.n,d]);j.t-=d;if(j.t)queue.push(j);}
    return title('Round-robin · quanto '+q+' ms')+labelRow(47,'Coda iniziale',all.map((t,i)=>'ABC'[i]+' '+t))+
      lane(115,'CPU',k===0?[]:k===1?trace.slice(0,2):trace,a+b+c)+
      progress(k,['Tempi di cambio nulli.', 'C riceve il core a '+(trace[0][1]+trace[1][1])+' ms.','Ogni confine tra due caselle chiude un turno.','Turni complessivi: '+trace.length+'. Lavoro utile: '+(a+b+c)+' ms.']);
  };
  scenes['5.3/5']=(v,k)=>{
    const [l,,m]=operands(v);
    return title('H attende il mutex di L · un solo core')+lane(54,'Fisse',k?[['M',m],['L',l,k===2]]:[],l+m,k>=2)+
      lane(129,'Eredità',k===3?[['L',l,true]]:[],l+m,k===3)+progress(k,['L deve ancora eseguire '+l+' ms sotto lock; M richiede '+m+' ms.','M ha precedenza su L.', 'H viene sbloccato a '+(l+m)+' ms.','Con la donazione L precede M e libera il mutex a '+l+' ms.']);
  };
  scenes['5.4/1']=(v,k)=>{
    const [h,r,newval]=operands(v),heap=v.consegna.includes('in h.');
    let g=title('Due contesti privati e una cella comune')+block(19,76,158,'r di A',k>=2&&!heap?newval:'—',k===2&&!heap)+block(241,76,155,'heap · h',k>=2&&heap?newval:h,k===2&&heap)+block(459,76,158,'r di B',r,k===3);
    if(k===2&&heap)g+=flow(178,107,237,107,true);
    if(k===3)g+=flow(398,150,509,150,true)+caption(406,174,'B osserva h dopo la barriera');
    return g+progress(k,[heap?'Scrittura richiesta ad A: '+newval+' nella cella h.':'Scrittura richiesta ad A: '+newval+' nel proprio registro.','Prima della scrittura h = '+h+' e r di B = '+r+'.',heap?'La scrittura raggiunge la cella h.':'La scrittura raggiunge soltanto r di A.', 'B osserva h = '+(heap?newval:h)+' e il proprio r = '+r+'.']);
  };
  scenes['5.4/2']=(v,k)=>{
    const [n,,duration,ncore]=operands(v),turns=Math.ceil(n/ncore);let g=title('Thread indipendenti · gruppi da '+duration+' ms');
    for(let core=0;core<ncore;core++){
      const y=58+68*core,slots=[];
      const limit=k===0?0:k===1?1:turns;
      for(let t=0;t<limit;t++){const task=t*ncore+core;slots.push([task<n?'T'+(task+1):'·',duration,k>=2&&t===turns-1]);}
      g+=lane(y,'Core '+core,slots,turns*duration,k===3);
    }
    return g+progress(k,[n+' thread arrivano al tempo 0 su '+ncore+' core.','Thread simultanei nel primo gruppo: '+Math.min(n,ncore)+'.','Si formano '+turns+' gruppi.', 'L’ultimo gruppo completa a '+(turns*duration)+' ms.']);
  };
  scenes['5.4/3']=(v,k)=>{
    const [n,w]=operands(v);
    let g=title('Thread utente, worker kernel e core')+labelRow(49,'Thread utente',ele(n,'U'))+labelRow(108,'Worker',ele(w,'W').map((name,i)=>k&&i===0?'I/O':name),k?0:-1);
    if(k>=2)g+=labelRow(162,'Altri pronti',ele(n,'U').slice(1));
    return g+progress(k,['Il runtime dispone di '+w+' worker.','Dopo il blocco i worker utilizzabili sono '+(w-1)+'.','Gli altri '+(n-1)+' thread utente sono pronti.','Al massimo '+Math.min(n-1,w-1)+' ulteriori thread avanzano contemporaneamente.']);
  };
  scenes['5.4/4']=(v,k)=>{
    const separate=/passa &a\[i\]/i.test(v.consegna);let g=title('Indirizzi degli argomenti dei quattro worker');
    const src=separate?['a[0]','a[1]','a[2]','a[3]']:['i'],wx=i=>55+i*149,tx=i=>separate?wx(i):294;
    for(let i=0;i<4;i++){g+=token(wx(i)-20,49,85,'T'+i);if(k)g+=flow(wx(i)+20,85,tx(i)+20,140,k===1);}
    for(let j=0;j<src.length;j++)g+=token(tx(j)-32,145,120,src[j]+(k>=2?' = '+(separate?j:4):''),k===2);
    return g+progress(k,[separate?'I quattro argomenti usano gli indirizzi &a[i].':'I quattro argomenti usano l’indirizzo &i.',separate?'Ogni freccia arriva a una cella distinta.':'Tutti i puntatori identificano la stessa cella.',separate?'Dopo la barriera le letture sono 0, 1, 2, 3.':'Dopo la barriera i vale 4 per tutti.','Somma delle letture: '+(separate?'0 + 1 + 2 + 3 = 6.':'4 × 4 = 16.')]);
  };
  scenes['5.4/5']=(v,k)=>{
    const [n,t]=operands(v),w=585/n;let g=title('Spazi di indirizzi e stack utente');
    for(let i=0;i<n;i++){const x=25+i*w;g+=rect(x,57,w-12,130,k?'cell active':'cell')+caption(x+12,81,'P'+(i+1));
      if(k>=2)for(let j=0;j<t;j++){const y=92+j*26;g+=rect(x+13,y,w-39,21,'cell',2)+caption(x+20,y+15,'stack T'+(j+1));}}
    return g+progress(k,[n+' processi con '+t+' thread ciascuno.','Ogni riquadro racchiude uno spazio di indirizzi.','Ogni processo contiene '+t+' stack, uno per thread.',n+' × '+t+' = '+(n*t)+' stack complessivi.']);
  };
  scenes['5.5/1']=(v,k)=>{
    const [x]=operands(v),inter=v.consegna.includes('A legge, B legge');
    const cell=k===3?(inter?x+1:x+2):k===2&&!inter?x+1:x;
    let g=title('Letture e scritture elementari sul contatore')+block(20,80,151,'lettura di A',k?x:'—',k===1)+block(243,80,149,'cella atomica x',cell,k===3)+block(465,80,151,'lettura di B',k>=2?(inter?x:x+1):'—',k===2);
    if(k===1)g+=flow(241,109,174,109,true);
    if(k===2){if(!inter)g+=flow(173,104,240,104,true);g+=flow(395,113,463,113,true);}
    if(k===3)g+=flow(463,113,395,113,true);
    return g+progress(k,['Valore iniziale della cella: '+x+'.','A prepara '+(x+1)+' nel proprio contesto.',inter?'B legge la stessa versione letta da A.':'A ha già scritto il proprio risultato quando B legge.','Valore finale '+cell+' a fronte di due incrementi richiesti.']);
  };
  scenes['5.5/2']=(v,k)=>{
    const rigid=v.consegna.includes('alterna rigidamente');
    let g=title('Contesa sulla sezione critica')+block(20,64,142,'richiesta','A',k===1)+block(233,64,174,'sezione critica',rigid?'libera':k>=2?'altri · uno a turno':'un solo posto',k===2)+block(470,64,146,rigid?'token detenuto':'competizione',rigid?'B':'altri thread');
    if(k)g+=flow(164,95,230,95,k===1);
    if(rigid&&k>=2)g+=path('M546 131 V164 H320 V130','wire live')+caption(354,185,'decisione vincolata al token di B');
    if(!rigid&&k>=2)g+=rack(194,157,294,['T1','T2','…'],2);
    return g+progress(k,[rigid?'B rimane nel calcolo esterno.':'A chiede ripetutamente di entrare.',rigid?'Un token unico mantiene l’esclusione.':'La richiesta di A è pendente.',rigid?'A è l’unico interessato; il token resta presso B.':'Altri ingressi completano mentre A attende.',rigid?'Proprietà violata: progresso.':'Proprietà violata: attesa limitata.']);
  };
  scenes['5.5/3']=(v,k)=>{
    const [n]=operands(v),jobs=['A','B','C'],queue=k===2?jobs.slice(n):k===3?jobs.slice(n+1):[];
    let g=title('Semaforo FIFO · passaggio diretto del permesso')+labelRow(46,'Arrivi',jobs);
    const free=k?0:n;g+=text(23,128,'Permessi liberi','label');for(let i=0;i<free;i++)g+=dot(200+i*32,121,10,'pin');
    if(!free)g+=text(195,128,'0','value');
    if(k>=2)g+=labelRow(160,'Sospesi',queue,0);
    return g+progress(k,['Una signal segue le tre wait.','Le prime '+n+' wait consumano i permessi.',queue.length+' sospesi dopo le tre richieste.','Il permesso passa a '+jobs[n]+'. Restano '+queue.length+' sospesi.']);
  };
  scenes['5.5/4']=(v,k)=>{
    const early=v.consegna.includes('prima che C arrivi');const permit=k===1&&early?1:0;
    let g=title('Semaforo evento · ordine di wait e signal')+block(24,81,145,'P · produttore',k===0?'prepara':early||k>=2?'preparato':'prepara')+
      block(243,81,146,'permessi in E',permit,k===1||k===2)+block(456,81,153,'C · consumatore',k===0?'in arrivo':k===1?(early?'in arrivo':'bloccato'):(early?'prosegue':'pronto'),k===3);
    if(k===1&&early||k===2&&!early)g+=flow(173,111,239,111,true);
    if(k===2)g+=flow(391,111,450,111,true);
    return g+progress(k,[early?'E = 0. La signal del produttore precede la wait.':'E = 0. La wait del consumatore precede la signal.',early?'P deposita un permesso.':'C si sospende in attesa del segnale.',early?'La wait di C consuma il permesso.':'La signal passa il permesso direttamente a C.','Entrambe le operazioni sono concluse. Permessi liberi: 0.']);
  };
  scenes['5.5/5']=(v,k)=>{
    const [,n]=operands(v);let g=title('Una prenotazione e più decisioni locali');
    const dx=585/n;for(let i=0;i<n;i++){const x=25+i*dx;g+=token(x,53,dx-12,'W'+(i+1)+(k?' · letto 1':''),k===1);if(k>=2)g+=flow(x+(dx-12)/2,88,319,132,k===2);}
    g+=block(242,138,153,'posti liberi',k>=2?0:1,k===2);
    return g+progress(k,[n+' worker concorrono per un posto.','Ogni decisione usa una lettura precedente alla prima scrittura.',n+' conferme per la stessa poltrona.','Conferme in eccesso: '+n+' − 1 = '+(n-1)+'.']);
  };
  scenes['5.6/1']=(v,k)=>{
    const [cap,ins,out]=operands(v),removed=k===3?out:0,inserted=k>=2?ins:0;
    let g=title('Buffer FIFO · ogni tessera rappresenta uno slot')+tiles(83,cap,i=>i>=removed&&i<inserted?'x'+(i+1):'·');
    if(k)g+=text(25,165,'pieni = '+(inserted-removed)+'          vuoti = '+(cap-inserted+removed),'value');
    return g+progress(k,['Capacità '+cap+'. Il buffer parte vuoto.','Tutti i permessi sono disponibili ai produttori.',ins+' elementi sono stati pubblicati.',out+' rimozioni restituiscono altrettanti permessi vuoti.']);
  };
  scenes['5.6/2']=(v,k)=>{
    const prod=v.consegna.includes('Un produttore'),first=prod?'vuoti':'pieni',last=prod?'pieni':'vuoti';
    let g=title('Permesso, accesso protetto e pubblicazione');
    g+=block(21,82,152,'prima wait',k?'wait('+first+')':'?',k===1)+block(236,82,171,'sotto mutex M',k>=2?(prod?'scrivi il dato':'leggi il dato'):'?',k===2)+block(465,82,153,'ultimo signal',k===3?'signal('+last+')':'?',k===3);
    if(k>=2)g+=flow(175,111,233,111,k===2);
    if(k===3)g+=flow(409,111,461,111,true);
    return g+progress(k,[prod?'Operazione da eseguire: inserimento.':'Operazione da eseguire: estrazione.', 'Il permesso precede il mutex.', 'Rilasciato il mutex, l’indice del buffer è aggiornato.', 'La signal rende utilizzabile '+(prod?'l’elemento.':'lo spazio.')]);
  };
  scenes['5.6/3']=(v,k)=>{
    const [cap,full,reserve]=operands(v);const r=k>=2?reserve:0;
    let g=title('Posti pubblicati, riservati e liberi');
    g+=tiles(77,cap,i=>i<full?'pieno':i<full+r?'P':'·');
    if(k)g+=text(24,151,'pieni '+full+'     vuoti '+(cap-full-r)+(k>=2?'     in transito '+r:''),'value');
    return g+progress(k,[cap+' slot, '+full+' elementi pubblicati.','Prima delle wait ogni slot senza elemento è libero.','P indica un posto prenotato, ancora da pubblicare.', 'Vuoti + pieni = '+(cap-r)+'. Con '+r+' prenotazioni si torna a '+cap+'.']);
  };
  scenes['5.6/4']=(v,k)=>{
    const fifo=v.consegna.includes('FIFO');
    const inside=k<2?['L1']:k===2?(fifo?['L1']:['L1','L2']):(fifo?['S']:['L2']);
    const queue=k===0?[]:k===1?['S']:k===2?(fifo?['S','L2']:['S']):fifo?['L2']:['S'];
    return title('Accesso condiviso dei lettori o esclusivo dello scrittore')+
      labelRow(54,'Presso la risorsa',inside,0)+labelRow(120,'Coda di accesso',queue,0)+
      progress(k,[fifo?'L1 legge. Prima arriva S e poi L2, con coda FIFO.':'L1 legge. La politica favorisce i nuovi lettori.', 'S aspetta l’uscita del gruppo.',fifo?'L2 attende dietro S.':'L2 si affianca a L1.','Dopo l’uscita di L1: '+(fifo?'S entra in esclusiva.':'L2 continua a leggere.')]);
  };
  scenes['5.6/5']=(v,k)=>{
    const [n]=operands(v);const remaining=k<=1?ele(n,'L'):k===2?['L'+n]:[];
    let g=title('Lettori che escono e semaforo della risorsa')+labelRow(53,'Lettori attivi',remaining)+block(28,119,183,'scrittore S',k===3?'pronto':'sospeso',k===3);
    g+=block(394,119,209,'risorsa',k===3?'segnalata':'ai lettori',k===3);if(k===3)g+=flow(392,148,216,148,true);
    return g+progress(k,['Ogni uscita decrementa il contatore sotto mutex.','Il gruppo iniziale comprende '+n+' lettori.','Dopo '+(n-1)+' uscite rimane L'+n+'.','Una signal al passaggio da uno a zero abilita S.']);
  };
  scenes['5.7/1']=(v,k)=>{
    const live=v.consegna.includes('riprovano insieme');let g=title('Quali richieste completano in un periodo?');
    g+=labelRow(49,live?'Tentativi A':'Lettore uscente',k?live?['prende','cede']:['legge','termina']:live?['A']:['L0']);
    g+=labelRow(105,live?'Tentativi B':'Scrittore S',k?live?['prende','cede']:['in coda']:live?['B']:['S']);
    if(k>=2)g+=text(24,188,live?'Fine del giro: 0 completamenti':'Lettori completati: almeno uno per giro','value');
    return g+progress(k,['La traccia si ripete indefinitamente.',live?'Entrambi i worker eseguono ancora azioni.':'I lettori terminano le richieste.',live?'Entrambi ricominciano dallo stesso stato.':'Al passaggio di consegne rimane almeno un lettore.',live?'Diagnosi: livelock.':'Diagnosi: starvation dello scrittore.']);
  };
  scenes['5.7/2']=(v,k)=>{
    const set=v.consegna.includes('in blocco');let g=title('Regola di acquisizione e condizione di Coffman');
    if(set){
      g+=block(24,71,170,'richiesta','{X, Y}')+block(247,71,149,'assegnazione',!k?'?':'tutto',k===1)+block(456,71,158,'se sospesa',k>=2?'0 istanze':'?',k===2);
      if(k)g+=flow(195,101,243,101,k===1);if(k>=2)g+=flow(397,101,453,101,k===2);
    }else{
      g+=labelRow(65,'Ranghi detenuti',k?['r₁','r₂ > r₁','r₃ > r₂']:['r₁']);
      if(k>=2)g+=path('M364 106 V152 H220 V106','wire live')+caption(243,174,'chiusura verso il rango iniziale');
    }
    return g+progress(k,[set?'Le risorse vengono richieste come insieme.':'Il protocollo impone ranghi crescenti.',set?'Il successo consegna tutto l’insieme.':'Ogni passo aumenta strettamente il rango.',set?'Chi attende resta a mani vuote.':'Chiudere il ciclo richiederebbe un ritorno al rango iniziale.',set?'Condizione esclusa: possesso durante l’attesa.':'Condizione esclusa: attesa circolare.']);
  };
  scenes['5.7/3']=(v,k)=>{
    const multi=v.consegna.includes('seconda istanza');let g=title('Grafo bipartito · processi e tipi di risorsa');
    g+=token(40,90,79,'A')+token(448,90,79,'B')+block(207,42,151,'risorsa X','1 istanza')+block(207,141,151,'risorsa Y',multi?'2 istanze':'1 istanza');
    if(multi)g+=token(497,166,84,'C',k===3);
    if(k){g+=flow(206,78,120,98,k===1)+flow(359,158,446,113,k===1);
      if(multi)g+=flow(359,178,493,178,k===1);}
    if(k>=1){g+=flow(120,112,204,157,k===2)+flow(446,97,359,79,k===2);}
    if(k===3&&multi)g+=flow(493,196,364,196,true);
    return g+progress(k,[multi?'Una seconda Y è assegnata a C.':'X e Y hanno una sola istanza.', 'Processo → risorsa: richiesta. Risorsa → processo: assegnazione.', 'Il ciclo A → Y → B → X → A contiene quattro archi.',multi?'Il rilascio di C permette ad A e poi a B di completare.':'I due possessori restano in deadlock.']);
  };
  scenes['5.7/4']=(v,k)=>{
    const [a,b,target]=operands(v),max=Math.max(a,b),ok=target>max;let g=title('Verifica del rango · ascissa crescente');
    const px=r=>48+70*r;
    g+=line(46,152,609,152,'wire');for(let i=1;i<=7;i++)g+=line(px(i),147,px(i),160,'wire')+text(px(i),181,i,'small','middle');
    [a,b].forEach(r=>{g+=dot(px(r),149,6,r===max&&k?'pin reveal':'pin')+text(px(r),131,'tenuta','small','middle');});
    g+=token(px(target)-38,56,76,'chiede '+target,k===2);
    if(k>=2)g+=flow(px(target),89,px(target),116,k===2);
    return g+progress(k,['Confrontare il rango richiesto con tutti quelli già detenuti.','Massimo detenuto: '+max+'.',target+' > '+max+' è '+(ok?'vero.':'falso.'),ok?'Il rango permette la richiesta.':'Il rango impedisce questa acquisizione.']);
  };
  scenes['5.7/5']=(v,k)=>{
    const [ha,ma,hb,mb,hc,mc,free]=operands(v),names=['A','B','C'],held=[ha,hb,hc],need=[ma-ha,mb-hb,mc-hc];
    let g=title('Test di sicurezza rispetto ai massimi dichiarati');
    names.forEach((n,i)=>{
      const x=21+i*205;g+=block(x,53,184,'Processo '+n,'detiene '+held[i]+ ' / max '+[ma,mb,mc][i],k===2&&free>=need[i]);
      if(k)g+=text(x+13,141,'bisogno '+need[i],'label');
    });
    g+=text(24,190,'Istanze libere: '+(k<2||!free?free:k===2?free+hb:free+hb+ha+hc),'value');
    return g+progress(k,['Un tipo di risorsa e tre processi.', 'Bisogno = massimo dichiarato − istanze possedute.',free?'B può terminare e restituire le sue '+hb+' istanze.':'Nessun bisogno rientra nel disponibile.',free?'Sequenza sicura B → A → C.':'Stato insicuro rispetto ai massimi.']);
  };
  function disegnaTempi(tempi,k){
    const fotogramma=tempi.fotogrammi[k];
    let g=title(fotogramma.titolo);
    if(fotogramma.righe.length){
      for(const [i,[nome,segmenti]] of fotogramma.righe.entries()){
        g+=lane(58+82*i,nome,segmenti,tempi.limite);
      }
    }else{
      g+=block(23,67,175,'Burst di A','8 ms')+block(229,67,175,'Burst di B','2 ms')+block(435,67,175,'Burst di C','5 ms');
    }
    return g+foot(fotogramma.nota);
  }
  for(const [id,scena] of Object.entries(scenes)){
    SL.sceneProve[id]=(v,k)=>v.tempi?disegnaTempi(v.tempi,k):scena(v,k);
  }
})();
