'use strict';
(() => {
  const P=SL.pen;
  const t=(x,y,s,style='label',anchor='start')=>P.text(x,y,s,style,anchor);
  const c=(x,y,w,h,caption,value,hot=false)=>P.box(x,y,w,h,caption,value,hot?'cell hot':'cell');
  const motion=(x,y,a,b,active=true)=>P.arrow(x,y,a,b,active)+(active?P.travel('M'+x+' '+y+' L'+a+' '+b):'');
  const hx=n=>'0x'+Number(n).toString(16).toUpperCase();
  const fm=n=>String(n).replace('.',',');
  const A=(v,i)=>v.campi[i].answer;
  const show=(k,at,x)=>k>=at?x:'·';
  function graphic(name,caption,diagram,note){
    return t(25,25,name,'title')+t(26,49,caption,'small muted')+diagram+t(26,229,note,'small accent');
  }
  function tape(x,y,w,labels,active=-1,lit=-1){
    const dx=w/labels.length;
    return labels.map((n,i)=>P.rect(x+dx*i,y,dx-2,39,(i===active?'cell hot':i<=lit?'cell active':'cell')+' reveal',3)
      +t(x+(i+.5)*dx,y+25,n,dx<68?'small':'label','middle')).join('');
  }
  function lineTime(x,y,width,segments,total){
    let pos=x;
    return segments.map(([name,length],i)=>{
      if (length === 0) return '';
      const w=width*length/total,unit=i%2?'cell hot reveal':'cell active reveal';
      const x=pos;
      pos+=w;
      if (name === null) return '';
      return P.rect(x,y,Math.max(1,w-1),32,unit,2)+(w>name.length*7+7?t(x+w/2,y+21,name,'small','middle'):'');
    }).join('')+P.line(x,y+34,x+width,y+34,'wire dim');
  }
  function stack(names){
    return names.map((name,i)=>P.rect(294,60+26*i,251,24,'cell active reveal',1)+t(420,78+26*i,name,'small','middle')).join('');
  }
  function bank(registers){
    const width=580/registers.length;
    return registers.map(([reg,val,hot],i)=>c(27+i*width,86,width-8,75,reg,val,hot)).join('');
  }
  function circuit(labels,k,until=3){
    const dx=592/labels.length;
    return labels.map(([label,val,at],i)=>{
      const x=25+i*dx;
      let g=c(x,91,dx-27,68,label,show(k,at,val),k===at);
      if(i&&k>=at)g+=motion(x-26,125,x-2,125,k===at&&k<=until);
      return g;
    }).join('');
  }
  function bits(x,y,w,n){return tape(x,y,w,Number(n).toString(2).padStart(8,'0').split(''),-1,7);}
  function state(id,render){
    const [ch,index]=id.split('/');
    SL.sceneProve[id]=(v,k)=>{
      const item=SL.prove[ch][Number(index)-1];
      const second=v.consegna===item.varianti[1].consegna;
      return render(v,k,second);
    };
  }

  state('4.1/1',(v,k,b)=>{
    const base=b?0x8000:0x4000,size=b?8:16,ix=b?33:14;
    const d=tape(26,85,575,['['+(ix-1)+']','['+ix+']','['+(ix+1)+']'],k?1:-1)
      +t(121,151,'passo '+size+' B','small','middle')+t(313,180,k>=2?'offset '+hx(A(v,0)):'base '+hx(base),'label','middle')
      +(k===3?motion(315,160,315,130):'');
    return graphic('Una porta nella IDT','Base '+hx(base)+' · vettore '+ix+' · descrittore da '+size+' B',d,['La tabella è indicizzata per vettore.','Passare da una voce alla successiva aggiunge '+size+' B.','Offset = '+ix+' × '+size+' = '+A(v,0)+' B.','Indirizzo della voce = '+hx(A(v,1))+'.'][k]);
  });
  state('4.1/2',(v,k,b)=>{
    const pc=b?0x4020:0x4010,length=b?1:4,ret=Number(A(v,1)),d=c(30,65,191,64,'Istruzione',hx(pc))+c(421,65,191,64,'Seguente',show(k,3,hx(pc+length)))+c(214,150,201,56,'Evento',k>=1?(b?'#BP':'#PF'):'·',k===1);
    return graphic('Punto di ripresa',b?'INT3 lungo 1 B':'Caricamento lungo 4 B · pagina assente',d+(k>=1?motion(130,132,216,167,k===1):'')+(k===3?motion(319,147,b?510:127,132):''),
      ['Prima dell’ingresso nel gestore.',b?'Il breakpoint è completato.':'Il caricamento si arresta durante la traduzione.','Classe: '+A(v,0)+'.','RIP salvato: '+hx(ret)+'.'][k]);
  });
  state('4.1/3',(v,k,b)=>{
    const names=b?(k>=2?['SS','RSP','RFLAGS','CS','RIP','errore #PF']:[]):(k===1?['SS','ESP']:k>=2?['SS','ESP','EFLAGS','CS','EIP']:[]);
    return graphic('Pila di ingresso',b?'#PF a 64 bit · RSP selezionato 0x2008':'Cambio da CPL 3 a CPL 0 · slot da 4 B',
      P.line(279,60,279,207,'wire')+stack(names)+t(27,107,b&&k>=1?'Allineato: 0x2000':b?'RSP: 0x2008':'Nuova pila','label')+t(27,150,k===3?(b?'RSP: '+hx(A(v,1)):'Slot: '+A(v,0)):'↓ indirizzi','label accent'),
      b?['Il codice di errore appartiene al frame.','Si riservano 8 B per l’allineamento.','Cinque campi da 8 B più il codice di errore.','Il frame occupa '+A(v,0)+' B. La pila arretra di 56 B.'][k]:
      ['Porta interrupt a 32 bit.','Il precedente SS:ESP occupa due slot.','Ai due slot si aggiungono EFLAGS, CS ed EIP.','Frame: '+A(v,0)+' × 4 = '+A(v,1)+' B.'][k]);
  });
  state('4.1/4',(v,k,b)=>{
    if(b)return graphic('Interrupt accettato','IF = 1 prima dell’ingresso',bank([['Frame',show(k,1,'flag salvati'),k===1],['IF corrente',show(k,2,A(v,0)),k===2],['Via dedicata',show(k,3,A(v,1)),k===3]]),
      ['È selezionata una porta interrupt valida.','I flag di ritorno sono salvati.','La porta interrupt azzera IF.','La NMI segue regole dedicate.'][k]);
    return graphic('Invocazione software della porta 0x52','CPL = 3 · DPL = 0 · IF = 1',circuit([['Origine','INT n',0],['Accesso','3 ≤ 0 ?',1],['Confronto','falso',2],['Esito',A(v,0),3]],k),
      ['La destinazione della porta è valida.','La chiamata parte dal software.','La disuguaglianza di privilegio fallisce.','La CPU genera un’eccezione #GP.'][k]);
  });
  state('4.1/5',(v,k,b)=>{
    if(b){const status=k>=2?'scartate':'in volo';return graphic('Consegna precisa del fault','RIP = 0x3100 · tre istruzioni più giovani',
      tape(26,82,582,['vecchie','#PF','G1','G2','G3'],k>=1?1:-1,k>=1?0:-1)+t(26,153,'G1, G2, G3: '+status)+t(26,186,k===3?'Nuovo tentativo a '+hx(A(v,1)):'Registro architetturale','label accent'),
      ['Si separano le istruzioni per anzianità.','Restano gli effetti delle istruzioni già ritirate.','Risultati giovani pubblicati: '+A(v,0)+'.','La ripresa ripete l’istruzione in fault.'][k]);}
    return graphic('Tre indirizzi con tre funzioni','Voce IDT a 0x4720 · destinazione 0x8040 · RIP nel frame 0x2048',
      circuit([['Voce IDT','0x4720',1],['Fetch gestore',hx(A(v,0)),2],['IRETQ',hx(A(v,1)),3]],k),['La porta e il frame si trovano in strutture diverse.','Si legge il descrittore.','Il primo fetch usa il contenuto della porta.','IRETQ recupera RIP dal frame.'][k]);
  });
  state('4.2/1',(v,k,b)=>graphic('Banco dei registri Linux x86-64',b?'read(4, 0x4080, 32)':'write(7, 0x4080, 96)',
    bank([['RAX',show(k,1,A(v,0)),k===1],['RDI',show(k,2,A(v,1)),k===2],['RSI',show(k,2,'0x4080'),k===2],['RDX',show(k,3,A(v,2)),k===3]]),
    ['Prima di SYSCALL.', 'RAX seleziona il servizio '+(b?'read.':'write.'),'RDI e RSI contengono i primi due argomenti.','RDX limita i byte richiesti.'][k]));
  state('4.2/2',(v,k,b)=>b?graphic('Passaggio di pila','RSP utente prima di SYSCALL: 0x7000',
    bank([['RCX / R11',show(k,1,'PC / flag'),k===1],['RSP',show(k,2,hx(A(v,0))),k===2],['Pila kernel',show(k,3,'prologo'),k===3]]),
    ['Solo gli effetti hardware nella prima fase.','La CPU salva PC successivo e flag.','RSP contiene ancora il valore utente.','Lo stub seleziona la pila appropriata.'][k]):
    graphic('Registri di transizione','SYSCALL a 0x4000 · due byte · flag 0x202',
      bank([['Istruzione seguente',show(k,1,'0x4002'),k===1],['RCX',show(k,2,hx(A(v,0))),k===2],['R11',show(k,2,hx(A(v,1))),k===2]]),
      ['Prima dell’ingresso.', 'Il confine successivo dista due byte.','Il salvataggio avviene in RCX e R11.','L’esecuzione prosegue nel codice di ingresso configurato.'][k]));
  state('4.2/3',(v,k,b)=>b?graphic('Uscita del thread','Richiesta grezza exit con stato 7',circuit([['RAX',A(v,0),1],['RDI',A(v,1),2],['Kernel','termina',3]],k),
    ['Prepara i dati del chiamante.','Selezione della syscall exit.','Trasporto dello stato di uscita nel primo argomento.','Il kernel termina il thread.'][k]):
    graphic('Decodifica del banco registri','RAX=1 · RDI=1 · RSI=0x6000 · RDX=8',
      bank([['Servizio',show(k,1,A(v,0)),k===1],['fd / buffer',show(k,2,'1 / 0x6000'),k===2],['Massimo',show(k,3,A(v,1)+' B'),k===3]]),
      ['I quattro valori appartengono allo stesso ingresso.','Numero 1: richiesta di scrittura.','Il buffer è la sorgente dei byte.','Il ritorno comunicherà il progresso effettivo.'][k]));
  state('4.2/4',(v,k,b)=>{
    if(b)return graphic('Letture al confine del file','La lettura di 16 B restituisce 7. Quella dei 9 B residui restituisce 0.',
      lineTime(27,92,572,k?[['letti',7],['residui',9]]:[],16)+t(28,162,k>=2?'Seconda lettura: 0 B · EOF':'Prima richiesta: 16 B'),
      ['Il conteggio richiesto è positivo in entrambi i casi.','La prima lettura consegna sette byte.','La seconda incontra la fine del file.','Totale acquisito: '+A(v,0)+' B.'][k]);
    return graphic('Scrittura parziale nel buffer','Base 0x5000 · lunghezza 30 B · ritorno grezzo 12',
      lineTime(27,90,575,k?[['confermati',12],['residuo',18]]:[],30)+t(28,160,k>=2?'Residuo: '+A(v,0)+' B':'Lunghezza della richiesta: 30 B')+(k===3?motion(257,178,257,129):''),
      ['La scrittura inizia dal byte zero.','Solo il prefisso è confermato.','Lunghezza pendente = 30 − 12.','Il puntatore seguente è '+hx(A(v,1))+'.'][k]);
  });
  state('4.2/5',(v,k,b)=>b?graphic('Dalla libreria al dispatcher','read(3, buf, 4)',circuit([['Wrapper','RAX = 0',1],['SYSCALL','ingresso',2],['Dispatcher','read',3]],k),
    ['L’applicazione chiama libc.','Il wrapper prepara gli argomenti e il numero di servizio.','L’hardware trasferisce il controllo.','Il dispatcher interpreta RAX.'][k]):
    graphic('Lo stesso errore a due interfacce','La read grezza restituisce −9, EBADF.',
      circuit([['Kernel','−9',0],['Identità','EBADF',1],['errno',A(v,1),2],['Ritorno libc',A(v,0),3]],k),
      ['Osservazione del risultato al rientro.','Il valore negativo identifica l’errore.','Il wrapper registra il numero di errore.','Il chiamante riceve −1.'][k]));
  state('4.3/1',(v,k,b)=>b?graphic('STATUS e maschera del bit 2','Prima lettura: 0x02 · seconda lettura: 0x06',
    t(26,89,'Maschera')+(k?bits(146,62,376,4):t(146,89,'·'))+t(26,151,'STATUS')+(k>=2?bits(146,124,376,k===2?2:6):t(146,151,'·')),
    ['Confronta il bit selezionato in ciascuna lettura.','1 << 2 = 0x04.','Prima lettura: AND produce zero.','Seconda lettura: il bit 2 consente il consumo di DATA.'][k]):
    graphic('Registri del controller','COMMAND = 0x80 · STATUS = 0x84 · DATA = 0x88',
      circuit([['COMMAND','START',1],['STATUS','READY = 1',2],['DATA','leggi byte',3]],k),
      ['Il driver acquisisce un campione.','Primo accesso a '+hx(A(v,0))+'.','Rileggi STATUS fino a READY = 1.','Ultimo accesso a '+hx(A(v,1))+'.'][k]));
  state('4.3/2',(v,k,b)=>{
    const T=b?720:1000,p=b?24:50,cpu=b?5:8,count=Number(A(v,0));
    let g=P.line(30,137,607,137,'wire');for(let i=1;i<=(k>=2?count:k);i++){const x=30+570*i/count;g+=P.dot(x,137,i===1?5:3,'pin');}
    return graphic('Polling periodico','Periodo '+p+' µs · durata '+T+' µs · costo '+cpu+' cicli per controllo',g+t(30,165,'0')+t(600,165,T+' µs','small','end'),
      ['Il primo controllo cade a un multiplo positivo.', 'Primo istante: '+p+' µs.','Controlli fino all’estremo incluso: '+count+'.','CPU: '+count+' × '+cpu+' = '+A(v,1)+' cicli.'][k]);
  });
  state('4.3/3',(v,k,b)=>b?graphic('Linea IRQ attiva a livello alto','EOI ricevuto mentre la sorgente mantiene la linea alta',
    circuit([['Sorgente','attiva',0],['Linea','alta',1],['EOI','riaccoda?',2],['Driver','libera causa',3]],k),
    ['EOI riguarda il controller.','La causa mantiene attivo il segnale.','Il controller può accodare una nuova consegna.','Il driver serve la sorgente secondo il protocollo.'][k]):
    graphic('Mappa IRQ e consegna al core','Base 64 · IRQ 6 · core 2',circuit([['Dispositivo','IRQ 6',1],['Instradamento','vettore '+A(v,0),2],['Core 2','APIC locale',3]],k),
      ['La base assegna i vettori della sorgente.','La periferica attiva la linea IRQ 6.','64 + 6 individua il vettore 70.','La CPU consulta la voce IDT del vettore consegnato.'][k]));
  state('4.3/4',(v,k,b)=>{
    if(b)return graphic('Ammissione secondo maschera e priorità','A: 2 · B: 5 · C: 7 · C mascherata · IF = 1',
      tape(27,89,571,['A · 2','B · 5',k?'C · bloccata':'C · 7'],k===3?1:-1,k>=2?1:-1),
      ['Tre richieste pendenti.','La maschera esclude C.','A e B restano abilitate.','Vince '+A(v,0)+' con priorità '+A(v,1)+'.'][k]);
    return graphic('Campionamento del fronte di salita','Livelli osservati: 0, 1, 1, 0, 1',
      P.path('M32 151H149V88H369V151H484V88H602','wire live')
      +(k?P.dot(149,91,6,'pin'):'')+(k===3?P.dot(484,91,6,'pulse'):'')+t(30,179,'campione 1')+t(605,179,'campione 5','small','end'),
      ['Segui ciascuna variazione da sinistra a destra.','Primo fronte di salita tra 1° e 2° campione.','Il mantenimento e la discesa lasciano invariato il conto.','Al quinto campione si raggiungono '+A(v,0)+' richieste.'][k]);
  });
  state('4.3/5',(v,k,b)=>b?graphic('Costo di dodici notifiche','Per codice: 70 cicli di ingresso/uscita, 10 di lettura/accodamento.',
    tape(26,82,578,Array.from({length:12},(_,i)=>i+1),k===1?0:-1,k>=2?11:-1)+t(27,159,k===3?'Coda dati: '+A(v,1)+' B':'Un campione occupa un byte.'),
    ['Ogni codice genera un IRQ.','Un evento costa 80 cicli.','Costo complessivo: '+A(v,0)+' cicli.','Il driver ha prelevato 12 byte.'][k]):
    graphic('Tastiera → interrupt → driver','DATA = 0x1C · IRQ 1 · base vettori 32',
      circuit([['Tastiera','READY = 1',1],['Core','vettore '+A(v,0),2],['Driver',hx(A(v,1)),3]],k),
      ['Il codice resta nel registro dati.','L’arrivo attiva READY.','32 + 1 = 33.','Il byte ricevuto è un codice di scansione.'][k]));
  state('4.4/1',(v,k,b)=>{
    const size=b?1200:800,rate=b?200:100,control=b?4:2,transfer=size/rate;
    return graphic('Durata del collegamento','Carico '+size+' B · '+rate+' B/µs · controllo '+control+' µs',
      lineTime(30,95,579,[['dati',k?transfer:0],['controllo',k>=2?control:0]],transfer+control)+t(31,164,k===3?'Banda utile = carico / durata totale':'Intervalli di occupazione del link'),
      ['Risorsa a disposizione di una sola transazione.','La serializzazione dura '+transfer+' µs.','Durata totale: '+A(v,0)+' µs.','Banda utile: '+A(v,1)+' MB/s.'][k]);
  });
  state('4.4/2',(v,k,b)=>{
    if(b)return graphic('Collocare due battute nel ciclo','Canale DDR da 32 bit · clock a 125 MHz',
      t(27,88,'↑ salita')+tape(145,65,385,k?['B0','B1','B2','B3']:['·','·','·','·'],-1,k?3:-1)
      +t(27,154,'↓ discesa')+tape(145,132,385,k>=2?['B4','B5','B6','B7']:['·','·','·','·'],-1,k>=2?3:-1),
      ['Il clock conta cicli interi.','Una battuta trasporta quattro byte.','Due battute trasferiscono '+A(v,0)+' B per ciclo.','Banda = 8 × 125 = '+A(v,1)+' MB/s.'][k]);
    return graphic('Corsie dell’ultima battuta','Canale da 64 bit · carico 50 B · battute intere',
      tape(27,85,574,Array.from({length:8},(_,i)=>k===3?(i<2?'dato':'—'):k?'B'+i:'·'),-1,k===3?1:-1)+t(27,163,k>=2?'48 B nelle prime sei battute.':'Capienza per battuta: '+(k?'8 B':'da determinare')),
      ['Ogni casella corrisponde a una corsia di byte.','Una battuta trasporta otto byte.','La settima battuta completa il carico.','Ultima battuta: '+A(v,1)+' B utili.'][k]);
  });
  state('4.4/3',(v,k,b)=>{
    const name=b?['A','B','C']:['C','A','B'],dur=b?[5,2,4]:[3,3,3],limit=b?k:k>=3?3:k>=2?2:0;
    return graphic('Concessioni a partire dal ciclo zero',b?'Priorità fissa A > B > C · durate 5, 2, 4 cicli':'Round-robin A, B, C · ultimo B · tre cicli per turno',
      lineTime(28,95,577,name.slice(0,limit).map((n,i)=>[n,dur[i]]),dur.reduce((a,b)=>a+b,0))
      +t(28,165,k?(b?'Ordine fisso: A, poi B, poi C.':'Ordine calcolato: C → A → B.'):'Richieste pendenti: A, B e C.'),
      b?['Attesa comune dal ciclo 0.','A finisce a 5.','B finisce a 7.','C inizia a '+A(v,0)+' e finisce a '+A(v,1)+'.'][k]:
      ['Ogni richiedente effettua una sola richiesta.','C segue l’ultimo servito B.','I primi due turni occupano sei cicli.','B attende '+A(v,1)+' cicli.'][k]);
  });
  state('4.4/4',(v,k,b)=>{
    if(b){
      const req=['M105 109h450','M105 109h90v-34h360','M105 109h90v-34h360','M105 109h90v-34h167v34h193'][k];
      const ack=['M105 174h450','M105 174h450','M105 174h174v-34h276','M105 174h174v-34h170v34h106'][k];
      return graphic('Handshake a quattro fasi','Protocollo asincrono · ordine degli eventi da sinistra a destra',
        t(29,102,'REQ')+P.path(req,'wire live')+t(29,167,'ACK')+P.path(ack,'wire live'),
        ['Linee a riposo.','Il trasmettitore stabilizza il dato e alza REQ.','Il ricevitore conferma alzando ACK.','REQ scende per primo, poi scende ACK.'][k]);
    }
    return graphic('Una raffica o sei transazioni singole','Sei parole · indirizzo 1 ciclo · attese iniziali 2 cicli',
      t(27,81,'Raffica')+lineTime(160,60,437,[['I + attesa',k?3:0],['dati',k>=2?6:0]],24)
      +t(27,149,'Singole')+lineTime(160,128,437,k===3?Array.from({length:6},()=>['I/A/D',4]):[],24),
      ['La scala è comune alle due righe.','Il costo iniziale ammonta a 3 cicli.','La raffica dura '+A(v,0)+' cicli.','Le transazioni singole occupano '+A(v,1)+' cicli.'][k]);
  });
  state('4.4/5',(v,k,b)=>{
    if(b)return graphic('Attesa su un’uscita FIFO','Tre pacchetti da 160 B precedono il pacchetto da 80 B · 40 B/µs',
      lineTime(28,90,572,[...Array.from({length:k>=2?3:k},(_,i)=>['P'+(i+1),4]),['proprio',k===3?2:0]],14),
      ['Il nuovo arrivo segue i tre pacchetti.','Ogni pacchetto precedente occupa 4 µs.','Il servizio può iniziare a '+A(v,0)+' µs.','Latenza fino alla fine dell’invio: '+A(v,1)+' µs.'][k]);
    return graphic('Full-duplex · due direzioni indipendenti','1200 B per direzione · 100 B/µs per ciascun verso',
      t(28,86,'A → B')+lineTime(144,65,453,[['1200 B',k?12:0]],12)
      +t(28,149,'B → A')+lineTime(144,128,453,[['1200 B',k>=2?12:0]],12),
      ['I due versi possono cominciare insieme.','Una direzione impiega 12 µs.','Le due durate si sovrappongono.','2400 B trasferiti in '+A(v,0)+' µs: '+A(v,1)+' MB/s.'][k]);
  });
  state('4.5/1',(v,k,b)=>{
    const surfaces=b?2:4,tracks=b?128:200,sectors=b?16:32,bytes=b?1024:512;
    let d='';for(let i=surfaces-1;i>=0;i--){
      d+='<ellipse cx="167" cy="'+(92+i*22)+'" rx="111" ry="30" class="'+(k>=2?'cell active reveal':'cell')+'"/>';
      d+='<ellipse cx="167" cy="'+(92+i*22)+'" rx="70" ry="17" class="wire"/>';
    }
    d+=t(312,101,'Una traccia: '+(k?sectors*bytes+' B':'?'))+t(312,140,'Un cilindro: '+show(k,2,A(v,0)+' B'));
    return graphic('Superfici, tracce, cilindri',surfaces+' superfici · '+tracks+' cilindri · '+sectors+' settori/traccia · '+bytes+' B/settore',d,
      ['Le ellissi indicano le superfici alla stessa traccia radiale.','Capacità di una traccia = settori × byte per settore.','Si sommano le tracce sulle superfici attive.','Capacità totale: '+A(v,1)+' B.'][k]);
  });
  state('4.5/2',(v,k,b)=>{
    const rpm=b?10000:6000,seek=b?5:4,transfer=b?2:1,rot=Number(A(v,0));let d='';
    [70,49,28].forEach(r=>d+=P.dot(130,127,r,'cell'));d+=P.line(130,127,199,127,'wire live');
    if(k>=2)d+=P.path('M199 127 A69 69 0 0 1 61 127','wire live')+P.travel('M199 127 A69 69 0 0 1 61 127');
    d+=t(250,95,'Giro: '+show(k,1,60000/rpm+' ms'))+t(250,131,'Attesa media: '+show(k,2,rot+' ms'))
      +(k===3?lineTime(250,158,349,[['seek',seek],['rot.',rot],['dati',transfer]],Number(A(v,1))):'');
    return graphic('Latenza media del disco',rpm+' giri/min · seek '+seek+' ms · trasferimento '+transfer+' ms',d,
      ['Fase uniforme dopo il seek.','Periodo del giro = 60 000 / RPM.','Mezzo giro è l’attesa media.','Servizio medio: '+A(v,1)+' ms.'][k]);
  });
  state('4.5/3',(v,k,b)=>{
    if(b)return graphic('Allocazione intera dei blocchi','File di 10 000 B · blocchi da 4096 B',
      lineTime(28,85,577,[['blocco 0',k?4096:0],['blocco 1',k?4096:0],['dati',k>=2?1808:0],['liberi',k===3?2288:0]],12288),
      ['La scala è espressa in byte.','Dopo due blocchi restano 1808 B.','Il file richiede il terzo blocco.','Frammentazione interna: '+A(v,1)+' B.'][k]);
    return graphic('Divisione in LBA e resto','Offset 2600 · blocchi da 512 B · LBA iniziale 0',
      tape(27,87,578,Array.from({length:6},(_,i)=>i),k>=2?5:-1,k?4:-1)+t(28,158,k?'I primi cinque blocchi occupano 2560 B.':'Quale blocco contiene il byte?'),
      ['La posizione iniziale del file ha offset zero.','5 × 512 = 2560.','Il sesto blocco ha indice '+A(v,0)+'.','Scostamento interno: '+A(v,1)+' B.'][k]);
  });
  state('4.5/4',(v,k,b)=>{
    const q=b?7:3,seek=b?2:5,trans=Number(A(v,0)),total=Number(A(v,1));
    return graphic('Risposta vista dal richiedente',(b?'0,9 MB a 75 MB/s':'1,2 MB a 150 MB/s')+' · coda '+q+' ms · accesso '+seek+' ms',
      lineTime(27,87,578,[[k===3?'coda':null,q],[k===3?'accesso':null,seek],['dati',k>=2?trans:0]],total)
      +t(29,162,k?('Trasferimento: '+(k===1?fm(trans/1000)+' s':trans+' ms')):'Tempo = dati / velocità.'),
      ['Le unità della divisione sono secondi.','Rapporto fra MB e MB/s.','L’intervallo espresso in millisecondi misura il trasferimento.','Tempo di risposta = '+A(v,1)+' ms.'][k]);
  });
  state('4.5/5',(v,k,b)=>{
    const path=b?[45,60,75,15]:[45,75,15,60],limit=k===0?1:k===1?2:4,x=n=>44+n*6.6,y=i=>70+i*32;
    let d='';[15,45,60,75].forEach(n=>{d+=P.line(x(n),62,x(n),192,'wire dim')+t(x(n),209,n,'small','middle');});
    for(let i=0;i<limit;i++){
      if(i)d+=motion(x(path[i-1]),y(i-1),x(path[i]),y(i),k<=2);
      d+=P.dot(x(path[i]),y(i),5,'pin');
    }
    return graphic('Movimento radiale della testina',(b?'SSTF':'FCFS')+' · partenza a 45 · richieste 75, 15, 60',d,
      ['Ogni ordinata è un istante di servizio.',b?'Il cilindro 60 dista 15 da 45.':'45 → 75 percorre 30 cilindri.',b?'60 → 75 → 15 completa la coda.':'75 → 15 → 60 completa la coda.',b?'Cammino totale: '+A(v,1)+' cilindri.':'Cammino '+A(v,0)+' cilindri, arrivo a '+A(v,1)+'.'][k]);
  });
  state('4.6/1',(v,k,b)=>{
    const full=b?100:1000;
    return graphic(b?'Affidabilità di missione e stato finale':'Frazione del tempo operativo',b?'100 sistemi · 96 missioni concluse senza guasto · tre sistemi riparati':'Tempo operativo 990 h · ripristino 10 h',
      lineTime(29,91,571,b?[['integri',k?96:0],['',k>=2?3:0],['',k===3?1:0]]:[['operativo',k>=1?990:0],['',k>=1?10:0]],full)
      +t(30,162,b?('Sistemi operativi alla fine: '+show(k,2,99)):'Durata del ciclo: '+show(k,1,'1000 h')),
      b?['Confronta intera missione e singolo istante.','Affidabilità empirica 96%.','Tre riparazioni ripristinano il servizio.','Disponibilità finale '+A(v,1)+'%.'][k]:
      ['Usa la durata di un ciclo completo.','990 + 10 = 1000 h.','Tempo disponibile: '+A(v,0)+'%.','Tempo indisponibile: '+A(v,1)+'%.'][k]);
  });
  state('4.6/2',(v,k,b)=>{
    const drives=b?4:3,chunk=b?2:4,lba=b?26:19,idx=Math.floor(lba/chunk),row=Math.floor(idx/drives),unit=Number(A(v,0));
    const dx=565/drives;
    let d='';for(let i=0;i<drives;i++){
      const x=28+i*dx;d+=t(x+dx/2,76,'Disco '+i,'small','middle');
      for(let j=0;j<=row;j++){const highlight=k>=2&&i===unit&&j===row;d+=P.rect(x,85+j*25,dx-4,23,highlight?'cell hot reveal':'cell',2)+t(x+dx/2,103+j*25,k>=2||i+j===0?'chunk '+(j*drives+i):'·','small','middle');}
    }
    return graphic('RAID 0 · mappa dei chunk','LBA '+lba+' · '+drives+' dischi · '+chunk+' blocchi per chunk',d,
      ['Si parte dal disco 0.','Chunk '+idx+' · offset interno '+(lba%chunk)+'.','Il chunk arriva sul disco '+A(v,0)+'.','Indice del blocco sul disco: '+A(v,1)+'.'][k]);
  });
  state('4.6/3',(v,k,b)=>{
    const d=c(28,82,193,74,b?'Superstite':'Disco 0',b?'900 GB':'4 TB')+c(407,82,193,74,b?'Sostituto':'Disco 1',b?show(k,3,'copia completa'):(k===3?'guasto':'4 TB'),k===3);
    return graphic('Due membri a specchio',b?'Ricostruzione a 100 MB/s decimali':'Due membri da 4 TB · una copia per membro',d+((b&&k>=1)||(!b&&k===1)?motion(223,118,406,118,k<3):''),
      b?['Il sostituto deve ricevere l’intera copia.','900 GB = 900 000 MB.','Durata: '+A(v,0)+' s.','Copie complete: '+A(v,1)+'.'][k]:
      ['Osserva le copie di ciascun blocco.','Ogni blocco compare su entrambi i membri.','Capacità logica: '+A(v,0)+' TB.','Rimane una copia leggibile.'][k]);
  });
  state('4.6/4',(v,k,b)=>{
    if(b)return graphic('Parità iniziale e parità aggiornata','A = 0x5A · B = 0xCC · B nuovo = 0x0F',
      t(27,87,'A')+bits(110,65,411,0x5A)+t(27,136,'B')+bits(110,112,411,k>=2?0x0F:0xCC)+t(27,183,'P')+(k?bits(110,160,411,Number(A(v,k>=2?1:0))):t(110,183,'·')),
      ['P è calcolata per colonna.','XOR dei byte iniziali: '+hx(A(v,0))+'.','XOR dopo l’aggiornamento: '+hx(A(v,1))+'.','A XOR P aggiornata restituisce 0x0F.'][k]);
    return graphic('Spazio fisico e capacità logica','Sei membri da 2 TB · RAID 5 oppure tre coppie RAID 10',
      t(26,87,'RAID 5')+tape(134,65,465,k>=2?['D','D','D','D','D','P']:Array(6).fill('2 TB'),k===2?5:-1)
      +t(26,149,'RAID 10')+tape(134,126,465,k>=3?['A','A','B','B','C','C']:Array(6).fill('2 TB'),-1,k>=3?5:-1),
      ['I dischi hanno la stessa taglia.','Spazio fisico totale: 12 TB.','La parità distribuita costa l’equivalente di un membro: '+A(v,0)+' TB utili.','Tre coppie speculari offrono '+A(v,1)+' TB utili.'][k]);
  });
  state('4.6/5',(v,k,b)=>{
    if(b)return graphic('Migrazione e amplificazione','Cinque pagine vive da copiare · una scrittura host',
      tape(30,87,573,['copia','copia','copia','copia','copia','host'],k===2?5:-1,k>=1?4:-1)
      +t(29,160,k>=2?'Programmazioni fisiche: '+A(v,0):'Aggiornamento richiesto dall’host: una pagina.'),
      ['Conta le programmazioni delle pagine.','Il recupero copia cinque pagine vive.','La scrittura host porta il totale a sei.','Amplificazione = '+A(v,1)+'.'][k]);
    return graphic('FTL · passaggio da P12 a P21','L7 punta inizialmente a P12. Il controller scrive il nuovo contenuto in P21.',
      c(32,95,153,63,'Logica','L7')+c(415,65,173,51,'Fisica','P12',k===0)+c(415,143,173,51,'Fisica','P21',k>=1)+motion(186,126,409,k>=2?168:92,k>=2)+(k===1?t(253,197,'nuovi dati','small')+motion(321,177,409,167):''),
      ['P12 fornisce i dati prima della riscrittura.','La programmazione prepara la nuova pagina.','La lettura successiva usa P'+A(v,0)+'.','P12 resta obsoleta fino alla cancellazione del suo blocco.'][k]);
  });
  state('4.7/1',(v,k,b)=>{
    if(b)return graphic('Due indirizzi di blocco','Taglia 4096 B · prima blocco 80, poi blocco 2.',
      c(26,88,166,65,'Prima lettura','LBA 80',k===1)+c(413,88,166,65,'Seconda lettura','LBA 2',k===2)
      +motion(197,121,407,121,k===2)+t(27,189,k===3?'Inizio del secondo blocco richiesto = '+A(v,1)+' B.':'Ciascuna richiesta porta il proprio indice LBA.'),
      ['Il dispositivo permette accessi indipendenti.','Ogni indirizzo sceglie un blocco di taglia fissa.','Interfaccia: '+A(v,0)+'.','Offset = 2 × 4096.'][k]);
    return graphic('Porta seriale · consumo ordinato','L’interfaccia offre il prossimo byte disponibile.',
      tape(35,83,562,k===3?['prelevato','secondo','terzo']:['primo','secondo','terzo'],k===1?0:-1)+t(34,160,k>=2?'Interfaccia a caratteri.':'La testa del flusso è a sinistra.')+(k===3?motion(130,127,130,152):''),
      ['Il flusso conserva l’ordine d’arrivo.','Il primo byte è in testa.','Il driver usa un flusso senza indirizzi LBA.','Una lettura consuma il byte in testa.'][k]);
  });
  state('4.7/2',(v,k,b)=>{
    if(b)return graphic('Completamento con errore','Richiesta di lettura a blocchi · descrittore con indirizzo e lunghezza',
      circuit([['Periferica','errore',1],['Descrittore','stato scritto',1],['Interprete','driver',2],['Richiedente','errore I/O',3]],k),
      ['Il dispositivo restituisce uno stato di errore.','Lo stato viene pubblicato nel completamento.','Il driver interpreta il protocollo della periferica.','Il richiedente osserva l’esito di errore.'][k]);
    return graphic('Anello da quattro descrittori','Sei richieste · un descrittore per richiesta · due completamenti',
      tape(28,89,581,Array.from({length:4},(_,i)=>k===0?'libero':k===1?'preparato':k===3&&i<2?'libero':'device'),k===3?1:-1,k?3:-1)
      +t(28,164,k>=2?'Richieste inizialmente rinviate: '+A(v,0):'Gli slot sono numerati da 0 a 3.'),
      ['Prima della pubblicazione.', 'Le prime quattro richieste hanno uno slot.','Le altre due restano in attesa.','Due completamenti restituiscono '+A(v,1)+' slot liberi.'][k]);
  });
  state('4.7/3',(v,k,b)=>{
    if(b)return graphic('Tre letture dalla regione DMA','Base 0x3020 · 48 B da trasmettere · richieste da 16 B',
      tape(28,84,578,k===3?['0x3020–0x302F','0x3030–0x303F','0x3040–0x304F']:k===2?['da 0x3020','da 0x3030','da 0x3040']:['','',''],k===3?2:-1,k>=2?2:-1)
      +t(28,164,k?'Memoria → dispositivo':'Descrittore da preparare.'),
      ['Il buffer è contiguo nello spazio DMA.','Il dispositivo legge la memoria.','48 / 16 = '+A(v,0)+' richieste.','Ultimo byte: '+hx(A(v,1))+'.'][k]);
    return graphic('Ricezione di un pacchetto','96 B · VA CPU 0x9800 · indirizzo DMA 0x2800',
      circuit([['Scheda','pacchetto',0],['Direzione','verso RAM',1],['Descrittore',hx(A(v,0)),2],['RAM','scrittura',3]],k),
      ['Distingui le due viste del buffer.','Il pacchetto arriva dalla rete.','Il descrittore riceve l’indirizzo DMA.','La scheda emette scritture sulla RAM.'][k]);
  });
  state('4.7/4',(v,k,b)=>{
    if(b)return graphic('Cicli CPU per 128 parole','PIO: 5 cicli per parola · DMA: 72 cicli iniziali e 24 finali',
      t(28,92,'PIO')+lineTime(141,70,464,[['trasferimenti',k?640:0]],640)
      +t(28,159,'DMA')+lineTime(141,137,464,k>=2?[['avvio',72],['fine',24]]:[],640),
      ['Confronta le due lunghezze sulla stessa scala.','PIO costa 128 × 5 = 640 cicli.','Il risparmio assoluto è '+A(v,0)+' cicli.','Risparmio rispetto a PIO: '+A(v,1)+'%.'][k]);
    return graphic('DMA e occupazione della CPU','6400 B a 200 B/µs · avvio 3 µs · fine 2 µs · fasi seriali',
      t(27,89,'Servizio')+lineTime(146,67,455,k ? [[k===3?'':null,3],['DMA',32], [k===3?'':null,2]] : [],37)
      +t(27,153,'Lavoro CPU')+lineTime(146,131,455,k>=2?[['',3],[null,32],['',2]]:[],37),
      ['Si considera una sola notifica di completamento.','Il trasferimento dati dura 32 µs.','La CPU lavora per '+A(v,0)+' µs.','L’ultimo byte arriva a 35 µs. Il servizio termina a '+A(v,1)+' µs.'][k]);
  });
  state('4.7/5',(v,k,b)=>{
    if(b)return graphic('Dall’ultimo byte alla ripresa','Ultimo byte a 18 µs · IRQ a 21 µs · driver 4 µs · scheduler 6 µs',
      lineTime(29,91,569,[['notifica',k?3:0],['driver',k>=2?4:0],['attesa CPU',k===3?6:0]],13)
      +t(28,153,'18 µs','small')+t(595,153,k===3?'31 µs':'','small','end'),
      ['L’origine della striscia è l’arrivo dell’ultimo byte.','Consegna dell’interrupt dopo 3 µs.','Il thread è pronto a '+A(v,0)+' µs.','Dall’ultimo byte alla ripresa: '+A(v,1)+' µs.'][k]);
    let d=P.line(65,189,540,189,'wire')+P.line(65,189,65,67,'wire')+t(552,193,'parole','small')+t(67,62,'cicli CPU','small');
    if(k){d+=P.path('M65 189L435 77','wire live')+P.line(65,109,493,109,'wire live')+t(444,79,'PIO','small')+t(501,114,'DMA','small');}
    if(k>=2)d+=P.dot(329,109,5,'pin')+t(329,208,'5','small','middle');
    if(k===3)d+=P.dot(382,93,5,'pin')+t(382,208,'6','small','middle');
    return graphic('Taglia di pareggio','PIO: 8 cicli/parola · DMA: 40 cicli fissi',d,
      ['Confronta lavoro proporzionale e costo fisso.','PIO cresce con n, DMA resta a 40.','Le rette si incontrano a '+A(v,0)+' parole.','Il primo risparmio si ottiene a '+A(v,1)+' parole.'][k]);
  });
})();
