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
    if(b){
      const table=tape(32,85,568,['0x8108','0x8110','0x8118'],k>=2?1:-1);
      const bytes=k>=2?tape(107,154,420,['0','1','2','3','4','5','6','7'],k===3?4:-1):'';
      return graphic('Dalla lettura alla porta','IDT a 0x8000 · voci di 8 B · byte letto a 0x8114',table+bytes,
        ['Gli indirizzi sulla striscia segnano l’inizio di tre porte.','Il byte letto dista 276 B dalla base.','276 = 34 × 8 + 4. La porta inizia a 0x8110.','Nel vettore '+A(v,0)+' è stato letto il byte di posizione '+A(v,1)+'.'][k]);
    }
    const d=tape(26,85,575,['[13]','[14]','[15]'],k?1:-1)
      +t(121,151,'passo 16 B','small','middle')+t(313,180,k>=2?'offset '+hx(A(v,0)):'base 0x4000','label','middle')
      +(k===3?motion(315,160,315,130):'');
    return graphic('Una porta nella IDT','Base 0x4000 · vettore 14 · descrittore da 16 B',d,
      ['La tabella è indicizzata per vettore.','La distanza fra due voci consecutive è di 16 B.','Offset = 14 × 16 = '+A(v,0)+' B.','Indirizzo della voce = '+hx(A(v,1))+'.'][k]);
  });
  state('4.1/2',(v,k,b)=>{
    if(b){
      const b0=c(29,85,173,63,'0x4020',k>=2?'byte originale':'INT3',k===2),b1=c(407,85,173,63,'0x4021','RIP salvato',k===0);
      const tip=t(32,186,k===3?'Primo fetch dopo il debugger a 0x4020':'Memoria del programma','label');
      return graphic('Riprendere l’istruzione originale','Il frame contiene RIP = 0x4021.',b0+b1+tip+(k>=1?motion(401,118,208,118,k===1):''),
        ['L’indirizzo salvato segue INT3.','0x4021 − 1 = 0x4020.','Il debugger riscrive il byte originale.','La ripresa è riferita al byte appena ripristinato.'][k]);
    }
    const pc=0x4010,length=4,ret=Number(A(v,1));
    const d=c(30,65,191,64,'Istruzione',hx(pc))+c(421,65,191,64,'Seguente',show(k,3,hx(pc+length)))+c(214,150,201,56,'Evento',show(k,1,'#PF'),k===1);
    return graphic('Punto di ripresa','Caricamento lungo 4 B · pagina assente',d+(k?motion(130,132,216,167,k===1):'')+(k===3?motion(319,147,127,132):''),
      ['Prima dell’ingresso nel gestore.','Il caricamento si arresta durante la traduzione.','Classe: '+A(v,0)+'.','RIP salvato: '+hx(ret)+'.'][k]);
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
  state('4.2/1',(v,k,b)=>{
    if(b){
      const swapped=k>=2;
      return graphic('Correggere gli argomenti di read','Il programma vuole leggere 32 B nel buffer a 0x4080.',
        bank([['RAX','0',k===1],['RDI','4',k===1],['RSI',swapped?'0x4080':'32',k===2],['RDX',swapped?'32':'0x4080',k===3]]),
        ['Fotografia prima di SYSCALL.','Servizio e descrittore sono corretti.','Lo scambio assegna a RSI l’indirizzo del buffer.','RDX limita la richiesta a '+A(v,1)+' B.'][k]);
    }
    return graphic('Banco dei registri Linux x86-64','write(7, 0x4080, 96)',
      bank([['RAX',show(k,1,A(v,0)),k===1],['RDI',show(k,2,A(v,1)),k===2],['RSI',show(k,2,'0x4080'),k===2],['RDX',show(k,3,A(v,2)),k===3]]),
      ['Prima di SYSCALL.','RAX seleziona write.','RDI e RSI contengono i primi due argomenti.','RDX limita i byte richiesti.'][k]);
  });
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
    if(b){
      const righe=bank([['Periodo 4 µs',show(k,2,'192 cicli'),false],['Periodo 8 µs',show(k,2,'96 cicli'),k===3],['Periodo 16 µs',show(k,1,'troppo lento'),k===1]]);
      return graphic('Vincoli di latenza e di costo','Finestra di 96 µs · limite 10 µs · budget 100 cicli',righe,
        ['Verifica sia il ritardo sia il costo.','A 16 µs un evento può attendere oltre la scadenza.','Fra i periodi rapidi, 4 µs supera il budget.','Con '+A(v,0)+' µs restano '+A(v,1)+' cicli.'][k]);
    }
    const count=Number(A(v,0));let g=P.line(30,137,607,137,'wire');
    for(let i=1;i<=(k>=2?count:k);i++){const x=30+570*i/count;g+=P.dot(x,137,i===1?5:3,'pin');}
    return graphic('Polling periodico','Periodo 50 µs · durata 1000 µs · costo di 8 cicli per controllo',
      g+t(30,165,'0')+t(600,165,'1000 µs','small','end'),['Il primo controllo cade a un multiplo positivo.','Primo istante a 50 µs.','Controlli fino all’estremo incluso: '+count+'.','CPU: '+count+' × 8 = '+A(v,1)+' cicli.'][k]);
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
    if(b){
      const bars=t(27,89,'Limite singolo')+lineTime(152,67,445,[['dati',k?6:0],['controllo',k>=1?2:0]],18)
        +t(27,150,'2 insieme')+lineTime(152,128,445,[['dati',k>=2?12:0],['controllo',k>=2?3:0]],18);
      return graphic('Quanto controllo ammette il requisito?','1200 B per pacchetto · 200 B/µs sul filo · almeno 150 B/µs utili',bars,
        ['Confronta le occupazioni sulla stessa scala temporale.','Un pacchetto ha un limite di 8 µs, dei quali 6 per i dati.','Due pacchetti insieme occupano 15 µs.','Con controllo condiviso i dati utili raggiungono 160 MB/s.'][k]);
    }
    return graphic('Durata del collegamento','Carico 800 B · 100 B/µs · controllo 2 µs',
      lineTime(30,95,579,[['dati',k?8:0],['controllo',k>=2?2:0]],10)+t(31,164,k===3?'Banda utile = carico / durata totale':'Intervalli di occupazione del link'),
      ['Risorsa a disposizione di una sola transazione.','La serializzazione dura 8 µs.','Durata totale: '+A(v,0)+' µs.','Banda utile: '+A(v,1)+' MB/s.'][k]);
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
    if(b){
      const actual=lineTime(125,78,460,[['A',3],['B',k>=2?3:0],['C',k===3?3:0]],9);
      const candidate=lineTime(125,142,460,[['A',3],['ancora A',k>=1?3:0]],9);
      return graphic('Quale arbitro spiega la concessione?','B e C restano in attesa. A torna in coda prima del ciclo 3.',
        t(27,103,'Osservata')+actual+t(27,168,'Fissa')+candidate,
        ['A occupa il primo turno.','La priorità fissa sceglierebbe ancora A.','Il turno osservato di B è compatibile con la rotazione.','C può cominciare al ciclo '+A(v,1)+'.'][k]);
    }
    const ordine=['C','A','B'],fino=k>=3?3:k>=2?2:0;
    return graphic('Concessioni a partire dal ciclo zero','Round-robin A, B, C · ultimo B · tre cicli per turno',
      lineTime(28,95,577,ordine.slice(0,fino).map(n=>[n,3]),9)+t(28,165,k?'Ordine calcolato: C → A → B.':'Richieste pendenti: A, B e C.'),
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
    if(b){
      const g=c(29,83,176,62,'Una superficie',show(k,1,'2 MiB'),k===1)+c(231,83,176,62,'Volume','4 MiB',k===2)+c(432,83,176,62,'Superfici',show(k,2,A(v,0)),k===2);
      return graphic('Verificare la geometria dichiarata','128 cilindri · 16 settori per traccia · 1024 B per settore',g+t(30,181,k===3?'Numerazione dei settori: 0 … 4095':'Si contano le tracce di una superficie.'),
        ['Capacità misurata del volume: 4 MiB.','128 × 16 settori contengono 2 MiB.','Il disco dispone di due superfici attive.','Con 4096 settori, l’ultimo LBA è '+A(v,1)+'.'][k]);
    }
    let d='';for(let i=3;i>=0;i--){
      d+='<ellipse cx="167" cy="'+(92+i*22)+'" rx="111" ry="30" class="'+(k>=2?'cell active reveal':'cell')+'"/>';
      d+='<ellipse cx="167" cy="'+(92+i*22)+'" rx="70" ry="17" class="wire"/>';
    }
    d+=t(312,101,'Una traccia: '+show(k,1,'16384 B'))+t(312,140,'Un cilindro: '+show(k,2,A(v,0)+' B'));
    return graphic('Superfici, tracce, cilindri','4 superfici · 200 cilindri · 32 settori/traccia · 512 B/settore',d,
      ['Le ellissi indicano le superfici alla stessa traccia radiale.','Capacità di una traccia = settori × byte per settore.','Si sommano le tracce sulle superfici attive.','Capacità totale: '+A(v,1)+' B.'][k]);
  });
  state('4.5/2',(v,k,b)=>{
    if(b){
      const avg=t(25,97,'Media')+lineTime(134,75,450,[['seek',5],['rot.',k?3:0],['dati',2]],13);
      const one=t(25,161,'Singola')+lineTime(134,139,450,k===3?[['seek',5],['rot.',5],['dati',2]]:[],13);
      return graphic('Dalla durata media ai giri al minuto','Servizio medio 10 ms · seek 5 ms · copia 2 ms',avg+one,
        ['Gli intervalli si misurano in millisecondi.','Dalla media si ricavano 3 ms di rotazione.','Un giro dura 6 ms, pari a 10 000 giri/min.','La lettura da 12 ms attende 5 ms, meno di un giro.'][k]);
    }
    let d='';[70,49,28].forEach(r=>d+=P.dot(130,127,r,'cell'));d+=P.line(130,127,199,127,'wire live');
    if(k>=2)d+=P.path('M199 127 A69 69 0 0 1 61 127','wire live')+P.travel('M199 127 A69 69 0 0 1 61 127');
    d+=t(250,95,'Giro: '+show(k,1,'10 ms'))+t(250,131,'Attesa media: '+show(k,2,A(v,0)+' ms'))
      +(k===3?lineTime(250,158,349,[['seek',4],['rot.',5],['dati',1]],10):'');
    return graphic('Latenza media del disco','6000 giri/min · seek 4 ms · trasferimento 1 ms',d,
      ['Fase uniforme dopo il seek.','Periodo del giro = 60 000 / RPM.','Mezzo giro è l’attesa media.','Servizio medio: '+A(v,1)+' ms.'][k]);
  });
  state('4.5/3',(v,k,b)=>{
    if(b){
      const blocchi=tape(27,85,576,['blocco 0','blocco 1',k===3?'blocco 2 richiesto':'oltre il file'],k===3?2:k>=1?1:-1);
      return graphic('Fino a dove può crescere il file?','8128 B presenti · 2 blocchi da 4096 B già assegnati',blocchi+t(29,171,k>=2?'Spazio per l’append: offset 8128 … 8191':'L’offset iniziale del file è zero.'),
        ['Il limite di allocazione riguarda interi blocchi.','Il limite dello spazio assegnato è 8192 B.','Si possono aggiungere '+A(v,0)+' byte.','Il byte a offset 8192 richiede il blocco '+A(v,1)+'.'][k]);
    }
    return graphic('Divisione in LBA e resto','Offset 2600 · blocchi da 512 B · LBA iniziale 0',
      tape(27,87,578,Array.from({length:6},(_,i)=>i),k>=2?5:-1,k?4:-1)+t(28,158,k?'I primi cinque blocchi occupano 2560 B.':'Quale blocco contiene il byte?'),
      ['La posizione iniziale del file ha offset zero.','5 × 512 = 2560.','Il sesto blocco ha indice '+A(v,0)+'.','Scostamento interno: '+A(v,1)+' B.'][k]);
  });
  state('4.5/4',(v,k,b)=>{
    if(b){
      const clear=t(26,96,'Senza coda')+lineTime(155,74,430,k?[['accesso',2],['dati',12]]:[],21);
      const fast=t(26,162,'Banda doppia')+lineTime(155,140,430,k>=2?[['coda',7],['accesso',2],['dati',6]]:[],21);
      const x=155+430*14/21;
      return graphic('Una scadenza, due interventi','Scadenza a 14 ms · stessa scala per entrambe le alternative',clear+fast+P.line(x,63,x,183,'wire live')+t(x,204,'14 ms','small','middle'),
        ['Ogni intervento modifica una sola fase.','Senza coda la richiesta termina a 14 ms.','Raddoppiando la banda la sola copia dura 6 ms.','Con la coda invariata la richiesta termina a '+A(v,1)+' ms.'][k]);
    }
    const trans=Number(A(v,0)),total=Number(A(v,1));
    return graphic('Risposta vista dal richiedente','1,2 MB a 150 MB/s · coda 3 ms · accesso 5 ms',
      lineTime(27,87,578,[[k===3?'coda':null,3],[k===3?'accesso':null,5],['dati',k>=2?trans:0]],total)+t(29,162,k?'Trasferimento: '+(k===1?fm(trans/1000)+' s':trans+' ms'):'Tempo = dati / velocità.'),
      ['Le unità della divisione sono secondi.','Rapporto fra MB e MB/s.','L’intervallo in millisecondi misura il trasferimento.','Tempo di risposta = '+A(v,1)+' ms.'][k]);
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
    if(b){
      const dx=140;
      let d='';for(let i=0;i<4;i++){
        const x=36+dx*i;d+=t(x+dx/2,80,'Disco '+i,'small','middle');
        for(let j=0;j<4;j++){
          const active=i===1&&j===3,first=2*(4*j+i);
          d+=P.rect(x,90+j*24,dx-4,22,active?'cell hot':'cell',2)+t(x+dx/2,107+j*24,k>=2?first+'–'+(first+1):active?'locali 6–7':'·','small','middle');
        }
      }
      return graphic('Ricostruire gli indirizzi del volume','Quattro membri · chunk di due blocchi · LBA iniziale 0',d,
        ['Sono marcati i blocchi fisici segnalati dal controllo.','I blocchi locali 6 e 7 si trovano nella riga 3.','La riga inizia a LBA 24. Il disco 1 riceve 26 e 27.','Controllo diretto: chunk 13, disco 1, offset 0 e 1.'][k]);
    }
    const dx=565/3;let d='';
    for(let i=0;i<3;i++){
      const x=28+i*dx;d+=t(x+dx/2,76,'Disco '+i,'small','middle');
      for(let j=0;j<=1;j++){const hot=k>=2&&i===1&&j===1;d+=P.rect(x,85+j*25,dx-4,23,hot?'cell hot reveal':'cell',2)+t(x+dx/2,103+j*25,k>=2||i+j===0?'chunk '+(j*3+i):'·','small','middle');}
    }
    return graphic('RAID 0 · mappa dei chunk','LBA 19 · 3 dischi · 4 blocchi per chunk',d,
      ['Si parte dal disco 0.','Chunk 4, offset interno 3.','Il chunk arriva sul disco '+A(v,0)+'.','Indice del blocco sul disco: '+A(v,1)+'.'][k]);
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
    if(b){
      const cpu=t(28,94,'Core')+lineTime(115,72,480,[['avvio',8],['calcolo',k?40:0],['driver',k===3?4:0]],52);
      const dev=t(28,158,'DMA')+lineTime(115,136,480,[[null,8],['dati',k>=2?32:0],['attesa',k>=2?8:0]],52);
      return graphic('Lavoro del core durante il DMA','Tempi dalla preparazione iniziale · attesa della notifica in basso',cpu+dev,
        ['CPU e dispositivo hanno righe separate.','La CPU calcola da 8 a 48 µs.','Ultimo byte a 40 µs, poi '+A(v,0)+' µs di notifica pendente.','Il servizio del driver termina a '+A(v,1)+' µs.'][k]);
    }
    return graphic('DMA e occupazione della CPU','6400 B a 200 B/µs · avvio 3 µs · fine 2 µs · fasi seriali',
      t(27,89,'Servizio')+lineTime(146,67,455,k ? [[k===3?'':null,3],['DMA',32], [k===3?'':null,2]] : [],37)
      +t(27,153,'Lavoro CPU')+lineTime(146,131,455,k>=2?[['',3],[null,32],['',2]]:[],37),
      ['Si considera una sola notifica di completamento.','Il trasferimento dati dura 32 µs.','La CPU lavora per '+A(v,0)+' µs.','L’ultimo byte arriva a 35 µs. Il servizio termina a '+A(v,1)+' µs.'][k]);
  });
  state('4.7/5',(v,k,b)=>{
    if(b)return graphic('Dall’ultimo byte alla ripresa','Ultimo byte a 18 µs · IRQ a 21 µs · driver 4 µs · scheduler 6 µs',
      lineTime(29,91,569,[['notifica',k?3:0],['driver',k>=2?4:0],['attesa CPU',k===3?6:0]],13)
      +t(28,153,'18 µs','small')+t(595,153,k===3?'31 µs':'','small','end'),
      ['L’origine della striscia è l’arrivo dell’ultimo byte.','Consegna dell’interrupt dopo 3 µs.','Il thread è pronto a '+A(v,1)+' µs.','Dall’ultimo byte alla ripresa: '+A(v,2)+' µs.'][k]);
    let d=P.line(65,189,540,189,'wire')+P.line(65,189,65,67,'wire')+t(552,193,'parole','small')+t(67,62,'cicli CPU','small');
    if(k){d+=P.path('M65 189L435 77','wire live')+P.line(65,109,493,109,'wire live')+t(444,79,'PIO','small')+t(501,114,'DMA','small');}
    if(k>=2)d+=P.dot(329,109,5,'pin')+t(329,208,'5','small','middle');
    if(k===3)d+=P.dot(382,93,5,'pin')+t(382,208,'6','small','middle');
    return graphic('Taglia di pareggio','PIO: 8 cicli/parola · DMA: 40 cicli fissi',d,
      ['Confronta lavoro proporzionale e costo fisso.','PIO cresce con n, DMA resta a 40.','Le rette si incontrano a '+A(v,0)+' parole.','Il primo risparmio si ottiene a '+A(v,1)+' parole.'][k]);
  });
})();
