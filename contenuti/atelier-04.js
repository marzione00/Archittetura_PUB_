'use strict';

(() => {
  const intervallo = (id, label, min, max, iniziale, step = 1) => ({id, label, min, max, step, iniziale});
  const scelta = (id, label, opzioni, iniziale = opzioni[0][0]) => ({id, label, opzioni, iniziale});
  const fase = (titolo, testo, valori) => ({titolo, testo, valori});
  const hex = n => '0x' + n.toString(16).toUpperCase();
  const dec = n => Number(n.toFixed(4));
  const si = b => b ? 'sì' : 'no';
  function riscontro(indice, campo, label = campo) {
    return {
      label,
      valore: (_parametri, fasi) => Object.fromEntries(fasi.at(indice).valori)[campo]
    };
  }
  function laboratorio(id, domanda, controlli, calcola, previsione) {
    SL.unita['4.' + id] = {teoria: SL.lezioni['4.' + id].join(' '), domanda, controlli, calcola, previsione};
  }

  // Flusso eccezionale, ingresso e ripresa.
  const eventi = {
    irq: ['interrupt del timer', 'interrupt esterno', 'La CPU accetta la richiesta al confine successivo.', 'successiva'],
    pf: ['pagina assente', 'fault', 'La traduzione fallisce durante il caricamento. Il kernel rende presente la pagina.', 'corrente'],
    bp: ['breakpoint INT3', 'trap', 'INT3 termina e il processore consegna il controllo al debugger.', 'successiva'],
    abort: ['guasto grave', 'abort', 'Il modello segnala uno stato dal quale manca una ripresa affidabile.', 'indeterminata']
  };
  const evento = (ids, iniziale) => scelta('evento','Causa',ids.map(k => [k,eventi[k][0]]),iniziale);
  function flusso(p) {
    const [nome, classe, descrizione, ripresa] = eventi[p.evento];
    const lunghezza = p.evento === 'bp' ? 1 : 4;
    const punto = ripresa === 'indeterminata' ? 'ripresa non garantita' : hex(p.pc + (ripresa === 'successiva' ? lunghezza : 0));
    return [
      fase('Istruzione in corso',p.evento==='bp'?'Il breakpoint INT3 occupa un byte; il ritorno salvato indica l’istruzione seguente.':'L’istruzione ordinaria selezionata occupa quattro byte: l’indirizzo successivo si ottiene aggiungendo quattro a RIP.',[['RIP',hex(p.pc)],['Istruzione seguente',hex(p.pc + lunghezza)]]),
      fase(nome,descrizione,[['Classe',classe],['Punto di ripresa',punto]]),
      fase('Uscita dal gestore',p.evento === 'abort' ? 'Il sistema avvia il contenimento del guasto.' : p.evento === 'pf' ? 'La ripresa ritenta il caricamento con la nuova traduzione.' : 'La ripresa prosegue al confine registrato.',[['RIP alla ripresa',punto]])
    ];
  }
  const indirizzo = intervallo('pc','RIP iniziale (byte)',4096,4224,4112,4);
  laboratorio('1.1','Da quale indirizzo riparte il programma dopo ciascuno dei due eventi?', [indirizzo,evento(['irq','pf'],'irq')],flusso);
  laboratorio('1.2','Quale evento conserva il RIP dell’istruzione corrente, quale il RIP successivo e quale lascia indeterminata la ripresa?', [evento(['bp','abort','pf','irq'],'bp'),indirizzo],flusso);

  laboratorio('1.3','A parità di vettore e porta, quali richieste raggiungono il gestore?',[
    intervallo('v','Vettore',0,255,48),scelta('via','Origine',[['int','INT n da CPL 3'],['hw','Richiesta del dispositivo']]),scelta('dpl','DPL della porta',[['0','0'],['3','3']])
  ],p => {
    // Il sistema di esempio riserva i vettori 0–31 alle eccezioni.
    if (p.via === 'hw' && p.v < 32) return [
      fase('Configurazione del controller','Il sistema del laboratorio assegna ai dispositivi i vettori da 32 a 255.',[['Vettore richiesto',p.v],['Primo vettore assegnabile',32]]),
      fase('Verifica della mappa','Il numero richiesto appartiene all’intervallo riservato alle eccezioni. La configurazione viene respinta prima della consegna.',[['Richiesta consegnata','no'],['Lettura della IDT','assente']]),
      fase('Esito','Per raggiungere il gestore da questa sorgente occorre un vettore assegnabile.',[['Esito','configurazione respinta']])
    ];
    const ok = p.via === 'hw' || Number(p.dpl) === 3;
    return [fase('Indicizzazione','IDTR.base vale 0x4000. Il vettore conta descrittori.',[['Vettore',p.v],['Offset',16*p.v]]),
      fase('Lettura della porta','La porta è presente e punta a codice valido del kernel.',[['Indirizzo del descrittore',hex(0x4000+16*p.v)],['Destinazione nella porta',hex(0x8000+32*p.v)]]),
      fase('Controllo di ingresso',p.via === 'hw' ? 'Il DPL della porta riguarda l’invocazione software. Questa richiesta hardware è già ammessa.' : 'INT n da CPL 3 richiede DPL 3.',[['Esito',ok ? 'ingresso al gestore' : 'eccezione #GP'],['DPL',p.dpl]])];
  }, riscontro(-1, 'Esito', 'Esito del controllo di ingresso'));
  laboratorio('1.4','Quale valore trova il gestore nel registro quando il caricamento di un ADD genera un fault?',[
    intervallo('k','Posizione dell’ADD in fault (da 1)',1,6,4),intervallo('r','Registro prima del gruppo',0,40,12)
  ],p => [
    fase('Ingresso del gruppo','Ogni ADD riuscito somma una unità.',[['Registro iniziale',p.r],['Istruzioni',6]]),
    fase('Ritiro in ordine','Le operazioni precedenti il fault pubblicano i loro effetti.',[['ADD ritirati',p.k-1],['Registro visibile',p.r+p.k-1]]),
    fase('Svuotamento','L’ADD in fault sarà ritentato. Le istruzioni più giovani perdono i risultati provvisori.',[['Più giovani scartate',6-p.k],['RIP salvato',hex(0x1000+4*(p.k-1))],['Registro nel gestore',p.r+p.k-1]])
  ]);
  laboratorio('1.5','Quanti byte separano l’RSP iniziale dall’RSP finale dopo allineamento, frame hardware e registri dello stub?',[
    scelta('r','RSP selezionato',[['8192','0x2000'],['8200','0x2008']]),scelta('e','Evento',[['pf','Page fault con codice'],['de','Errore di divisione']]),intervallo('n','Registri da salvare nello stub',1,15,8)
  ],p => {
    const top = Number(p.r), base=top-top%16, errore=p.e==='pf', hw=40+(errore?8:0), sw=(p.n+(errore?0:1))*8;
    return [fase('Selezione della pila','La CPU arrotonda verso il basso il puntatore scelto.',[['RSP iniziale',hex(top)],['RSP allineato',hex(base)]]),
      fase('Frame della CPU','Tutti e cinque i campi di base sono presenti nel modello a 64 bit.',[['Byte del frame',hw],['RSP dopo ingresso',hex(base-hw)]]),
      fase('Stub di ingresso','Questo stub aggiunge uno slot sintetico ai soli eventi privi di codice, poi impila i registri scelti.',[['Byte aggiunti dal software',sw],['RSP finale',hex(base-hw-sw)],['Movimento complessivo (B)',top-(base-hw-sw)]])];
  });
  laboratorio('1.6','Quale valore di RAX ritrova il programma dopo il gestore?',[
    intervallo('r','RAX del programma',1,250,37),scelta('salva','Operazioni dello stub',[['si','Salva e ripristina RAX'],['no','Omette il salvataggio']])
  ],p => [
    fase('Ingresso su IDT','La CPU conserva RIP e gli altri campi del frame. RAX appartiene al contesto generale.',[['RAX',p.r],['RIP di ritorno','0x4010']]),
    fase('Uso temporaneo','Il gestore carica il codice dispositivo 255 in RAX.',[['Copia sulla pila',p.salva==='si' ? p.r : 'assente'],['RAX',255]]),
    fase('Ripresa','Lo stub applica la propria sequenza di ripristino e IRETQ usa il frame di ritorno.',[['RIP','0x4010'],['RAX osservato',p.salva==='si'?p.r:255]])
  ]);
  laboratorio('1.7','La seconda richiesta entra subito nel gestore o resta pendente?',[
    intervallo('q','Priorità in arrivo (maggiore = più urgente)',1,7,5),scelta('iflag','Dopo l’ingresso',[['zero','Mantieni IF = 0'],['uno','Riabilita IF dopo il prologo']])
  ],p => {
    const annida=p.iflag==='uno' && p.q>4;
    return [fase('Primo ingresso','Il gestore in servizio ha priorità 4. La porta interrupt ha azzerato IF.',[['Priorità attiva',4],['IF',0]]),
      fase('Seconda richiesta','Il controller registra una richiesta e confronta le priorità.',[['Richiesta',p.q],['Supera la soglia',si(p.q>4)],['IF corrente',Number(p.iflag==='uno')]]),
      fase('Servizio',annida?'Il secondo gestore precede il ritorno dal primo.':'La richiesta attende il termine del primo servizio e il ripristino di IF = 1.',[['Profondità massima',annida?2:1],['Prima del primo ritorno',annida?'gestita':'pendente']]),
      fase('Ritorno dai gestori',annida?'L’IRETQ del gestore interno riprende il gestore esterno dal frame più recente. Il successivo IRETQ usa il frame originario del programma.':'Il primo IRETQ ripristina IF. Il core può accettare la richiesta pendente al successivo confine di consegna.',[['Primo contesto ripristinato',annida?'gestore esterno':'programma interrotto'],['Frame ancora sulla pila dopo il primo IRETQ',annida?1:0]])];
  });

  // Chiamate Linux su x86-64.
  const servizi = {read:[0,'lettura','dal descrittore verso il buffer'],write:[1,'scrittura','dal buffer verso il descrittore'],exit:[60,'uscita','rilascio del thread chiamante']};
  laboratorio('2.1','Quale numero va in RAX per il servizio scelto e quale ruolo assume RDI?',[
    scelta('s','Servizio',[['read','read'],['write','write'],['exit','exit']]),intervallo('a','Primo argomento',0,15,3)
  ],p => {
    const [nr,nome,direzione]=servizi[p.s];
    return [fase('Chiamante','SYSCALL occupa due byte a partire da 0x4010. Il programma prepara RAX e RDI. Per read e write prepara anche RSI = 0x4000 e RDX = 8.',[['RAX',nr],['RDI',p.a]]),
      fase('Ingresso SYSCALL','Il punto di ritorno è l’indirizzo successivo a SYSCALL. Il kernel interpreta il numero del servizio.',[['RCX','0x4012'],['Servizio',nome]]),
      fase('Selezione del servizio',direzione + '.',[[p.s==='exit'?'Stato di uscita':'Descrittore',p.a],['Effetto',p.s==='exit'?'termine del thread':'richiesta fino a 8 B']])];
  }, riscontro(0, 'RAX', 'Numero del servizio in RAX'));
  laboratorio('2.2','Quali byte della parola COMPUTER riceve la pipe e quale valore restituisce la syscall?',[
    scelta('fd','Destinazione',[['ok','Pipe scrivibile'],['bad','Descrittore chiuso']]),intervallo('n','Lunghezza richiesta (B)',1,8,4)
  ],p => [
    fase('Argomenti','RSI punta alla sequenza ASCII COMPUTER.',[['RAX',1],['RDX',p.n],['Buffer','COMPUTER']]),
    fase('Risoluzione del descrittore','Il kernel cerca la voce del processo e ne verifica la modalità.',[['Stato',p.fd==='ok'?'scrittura consentita':'voce assente']]),
    fase('Esito di write','La convenzione grezza restituisce in RAX il conteggio o un errore negativo.',[['Byte consegnati',p.fd==='ok'?'COMPUTER'.slice(0,p.n):'nessuno'],['RAX',p.fd==='ok'?p.n:-9]])
  ]);
  laboratorio('2.3','Dopo la prima write, a quale indirizzo si trova il primo byte residuo e quanti byte restano?',[
    intervallo('n','Byte richiesti',2,32,12),intervallo('cap','Capacità disponibile (B)',1,16,5),scelta('esito','Destinazione',[['ok','Scrivibile'],['errore','Errore EBADF']])
  ],p => {
    const k=p.esito==='ok'?Math.min(p.n,p.cap):0;
    return [fase('Richiesta','Il buffer inizia all’indirizzo 0x5000.',[['Puntatore','0x5000'],['Lunghezza',p.n]]),
      fase('Risposta del kernel',p.esito==='ok'?'Il ritorno positivo accredita soltanto il prefisso trasferito.':'EBADF segnala un descrittore invalido; il trasferimento confermato è zero.',[['RAX',p.esito==='ok'?k:-9],['Byte confermati',k]]),
      fase('Aggiornamento',p.esito==='errore'?'Il chiamante gestisce EBADF prima di un eventuale nuovo tentativo.':k===p.n?'La richiesta è completa.':'La scrittura riprende dal primo byte ancora da trasferire.',[['Primo byte residuo',k===p.n?'fine buffer':hex(0x5000+k)],['Residuo',p.n-k]])];
  });
  laboratorio('2.4','A quale istante termina la read nelle due modalità?',[
    scelta('modo','Modalità',[['blocco','Bloccante'],['subito','O_NONBLOCK']]),intervallo('t','Arrivo di un byte (ms)',1,20,5)
  ],p => [
    fase('t = 0 ms','Un thread chiede un byte da una pipe vuota con scrittore aperto.',[['Byte presenti',0],['Richiesta',1]]),
    fase('Esame della coda',p.modo==='blocco'?'Il kernel registra il lettore tra i thread in attesa.':'La read termina con il risultato grezzo −EAGAIN.',[['Stato',p.modo==='blocco'?'sospeso':'eseguibile'],['Ritorno immediato',p.modo==='blocco'?'in attesa':-11]]),
    fase('Arrivo del dato',p.modo==='blocco'?'Lo scheduler assegna il core un millisecondo dopo il risveglio e read consegna il byte.':'Il byte resta disponibile per una chiamata successiva.',[['Arrivo (ms)',p.t],['Fine della chiamata (ms)',p.modo==='blocco'?p.t+1:0],['Byte nella pipe alla fine della traccia',p.modo==='blocco'?0:1]])
  ], riscontro(-1, 'Fine della chiamata (ms)'));
  laboratorio('2.5','Quale ritorno osserva chi apre il file con l’identità e i permessi selezionati?',[
    scelta('chi','Identità',[['owner','Proprietario'],['other','Altro utente']]),scelta('perm','Permessi',[['600','0600'],['644','0644']])
  ],p => {
    const ok=p.chi==='owner'||p.perm==='644';
    return [fase('Richiesta','Entrambi gli utenti usano open per sola lettura sullo stesso file.',[['Meccanismo','SYSCALL'],['Modalità del file',p.perm]]),
      fase('Politica','Il modello esclude gruppo, ACL e privilegi speciali.',[['Classe',p.chi==='owner'?'proprietario':'altri'],['Bit lettura',Number(ok)]]),
      fase('Decisione',ok?'Il kernel assegna il primo descrittore libero, qui 3.':'La politica di accesso restituisce EACCES.',[['Ritorno grezzo',ok?3:-13],['Voce fd creata',si(ok)]])];
  }, riscontro(-1, 'Ritorno grezzo', 'Ritorno della syscall open'));

  // Controller, interrupt e interconnessioni.
  laboratorio('3.1','In quale ciclo il driver riesce a leggere il campione?',[
    intervallo('t','Prima interrogazione (ciclo)',1,8,2),intervallo('d','Campione acquisito',0,255,65)
  ],p => [
    fase('Scrittura di comando','Al ciclo zero il driver avvia una conversione.',[['COMMAND','START'],['READY',0]]),
    fase('Prima lettura di stato','Il driver accede a DATA soltanto quando READY vale uno.',[['Ciclo',p.t],['READY',Number(p.t>=4)],['Azione',p.t>=4?'leggi DATA':'attendi il ciclo 4']]),
    fase('Consumo del risultato','Una lettura riuscita libera il registro per il campione successivo.',[['Ciclo della lettura',Math.max(4,p.t)],['DATA',hex(p.d)],['READY finale',0]])
  ], riscontro(-1, 'Ciclo della lettura'));
  laboratorio('3.2','Quanto tempo separa l’evento dal primo controllo di polling utile?',[
    intervallo('t','Arrivo (µs)',1,80,19),intervallo('p','Periodo di polling (µs)',2,20,8)
  ],p => {
    const n=Math.ceil(p.t/p.p);
    return [fase('Evento memorizzato','Il dispositivo mantiene lo stato pronto fino al servizio.',[['Evento (µs)',p.t],['Periodo (µs)',p.p]]),
      fase('Polling','Ciascun controllo costa 4 cicli CPU. Il primo controllo avviene dopo un periodo.',[['Controlli',n],['Ritardo (µs)',n*p.p-p.t],['Cicli CPU',4*n]]),
      fase('Interrupt','Un singolo interrupt richiede 24 cicli CPU e giunge due microsecondi dopo l’evento.',[['Riconoscimento (µs)',p.t+2],['Cicli CPU',24]])];
  }, riscontro(1, 'Ritardo (µs)', 'Ritardo del polling (µs)'));
  laboratorio('3.3','In quale ordine delle operazioni la linea può provocare una seconda consegna?',[
    intervallo('q','Linea IRQ',0,15,1),scelta('ack','Ordine delle operazioni',[['prima','Libera la causa, poi EOI'],['dopo','EOI con causa ancora attiva']])
  ],p => [
    fase('Instradamento','Il controller utilizza vettore = 32 + linea.',[['Linea',p.q],['Vettore',32+p.q]]),
    fase('Ingresso nel core','La CPU individua il descrittore in una IDT a 64 bit.',[['Offset nella IDT (B)',(32+p.q)*16],['Linea','attiva']]),
    fase('Conferma',p.ack==='prima'?'La linea si disattiva prima di EOI.':'Il livello ancora attivo può far accodare una seconda consegna dopo EOI.',[['Causa attiva a EOI',si(p.ack==='dopo')],['Possibile riconsegna',si(p.ack==='dopo')]])
  ]);
  laboratorio('3.4','Come cambia il costo per campione con la soglia del gruppo e quale valore lascia la maschera in STATUS?',[
    intervallo('n','Campioni',1,64,25),intervallo('b','Campioni per interrupt',1,16,4),
    scelta('ack','Scrittura su STATUS dopo la lettura del gruppo',[['1','0x01 · riconosci READY'],['4','0x04 · riscrivi il valore letto dopo aver tolto READY'],['5','0x05 · riconosci entrambi i flag']])
  ],p => {
    const irq=Math.ceil(p.n/p.b), dati=3*p.n;
    return [fase('Accodamento','Ogni campione occupa una voce DATA della coda.',[['Campioni',p.n],['Soglia',p.b]]),
      fase('Notifica al driver','Ogni ingresso costa 40 cicli CPU.',[['Interrupt',irq],['Cicli fissi',40*irq]]),
      fase('Lettura delle voci','Il driver consuma tutti i dati al costo di tre cicli per voce.',[['Cicli per i dati',dati],['Cicli complessivi',40*irq+dati],['Cicli per campione',dec((40*irq+dati)/p.n)]]),
      fase('Riconoscimento dei flag','All’inizio del riconoscimento STATUS vale 0x05. READY occupa il bit 0 ed ERROR il bit 2. Entrambi restano attivi fino alla scrittura. Ogni uno scritto azzera il flag corrispondente.',[['Maschera scritta',hex(Number(p.ack))],['STATUS dopo la scrittura',hex(5 & ~Number(p.ack))],['READY',Number(!(Number(p.ack)&1))],['ERROR',Number(!(Number(p.ack)&4))]])];
  }, riscontro(-1, 'STATUS dopo la scrittura'));

  laboratorio('4.1','Chi fornisce il byte nella transazione selezionata?',[
    intervallo('a','Indirizzo di byte',0,160,132),scelta('cmd','Operazione',[['r','Leggi'],['w','Scrivi 0xA5']]),scelta('master','Concessione dell’arbitro',[['CPU','CPU'],['DMA','DMA']])
  ],p => {
    const ram=p.a<128, ok=p.a<144, dest=ram?'RAM':ok?'controller':'nessun destinatario';
    return [fase('Richiesta','Il richiedente mantiene indirizzo e comando validi.',[['Indirizzo',hex(p.a)],['Comando',p.cmd==='r'?'lettura':'scrittura'],['Iniziatore concesso',p.master],['In attesa',p.master==='CPU'?'DMA':'CPU']]),
      fase('Decodifica','Il decoder calcola la selezione e l’offset locale.',[['Destinatario',dest],['Offset',ok?hex(ram?p.a:p.a-128):'inapplicabile']]),
      fase('Completamento',ok?'Nella mappa il valore iniziale di ogni byte coincide con il suo indirizzo modulo 256.':'L’indirizzo cade fuori dalle regioni riconosciute: il bus segnala un errore e la transazione termina senza trasferire byte.',[['Risposta',ok?'ACK':'errore di indirizzo'],['Byte trasferito',ok?hex(p.cmd==='r'?p.a:165):'assente'],['Sorgente del byte trasferito',ok?(p.cmd==='r'?dest:p.master):'nessun trasferimento']])];
  });
  laboratorio('4.2','Quale banda aggregata consente la topologia scelta per due flussi continui?',[
    scelta('w','Larghezza in bit',[['32','32'],['64','64']]),intervallo('f','Clock (MHz)',50,250,100,25),scelta('t','Topologia',[['bus','Bus condiviso SDR'],['link','Due link SDR'],['ddr','Due link DDR']])
  ],p => {
    const b=Number(p.w)/8, beat=p.t==='ddr'?2:1, link=p.t==='bus'?1:2;
    return [fase('Un trasferimento','Il modello trasferisce una parola intera senza attese.',[['Byte per trasferimento',b],['Trasferimenti per ciclo',beat]]),
      fase('Una risorsa','Usiamo MB decimali. La frequenza in MHz conta milioni di cicli al secondo.',[['MHz',p.f],['MB/s per risorsa',b*beat*p.f]]),
      fase('Due flussi indipendenti','Il bus condiviso serializza entrambi i flussi. Ogni link indipendente serve un destinatario.',[['Risorse simultanee',link],['Banda aggregata (MB/s)',link*b*beat*p.f]])];
  });
  laboratorio('4.3','Quanti cicli occorrono dall’inizio della richiesta al completamento dell’ultima parola?',[
    intervallo('n','Parole contigue',1,16,4),intervallo('w','Cicli di attesa per indirizzo',0,6,2),scelta('modo','Emissione',[['burst','Raffica'],['singole','Transazioni singole']])
  ],p => {
    const inizi=p.modo==='burst'?1:p.n;
    return [fase('Indirizzamento','Ogni transazione presenta un indirizzo di partenza.',[['Presentazioni',inizi],['Cicli di indirizzo',inizi]]),
      fase('Attesa del destinatario','Il dispositivo inserisce le attese specificate dopo ogni presentazione.',[['Cicli di attesa',inizi*p.w],['Cicli dati',p.n]]),
      fase('Ultima conferma','Ciascuna parola occupa un ciclo dati dopo l’attesa iniziale della sua transazione.',[['Cicli totali',inizi*(1+p.w)+p.n],['Byte consegnati',4*p.n]])];
  }, riscontro(-1, 'Cicli totali'));
  laboratorio('4.4','In quale ciclo B trasmette il primo dato con la politica selezionata?',[
    scelta('p','Politica',[['rr','Round-robin'],['fissa','Priorità A, B, C']]),scelta('last','Ultimo servito',[['A','A'],['B','B'],['C','C']],'C')
  ],p => {
    const ids=['A','B','C'], start=p.p==='rr'?(ids.indexOf(p.last)+1)%3:0;
    const ordine=[...ids.slice(start),...ids.slice(0,start)], wait=5*ordine.indexOf('B');
    return [fase('Domande pendenti','Tutti i richiedenti attendono il primo ciclo libero.',[['Richiedenti','A, B, C'],['Ultimo servito',p.last]]),
      fase('Concessioni','Ogni richiesta lascia la coda al termine del suo turno.',[['Ordine',ordine.join(' → ')],['Arbitraggio per turno',1],['Cicli dati per turno',4],['Durata per turno',5]]),
      fase('Attesa di B','Il tempo trascorso prima della concessione esclude il servizio di B.',[['Inizio arbitraggio di B',wait],['Primo ciclo dati di B',wait+1],['Completamento di B',wait+5]])];
  });
  laboratorio('4.5','Quanto tempo passa dall’inizio dell’invio sul primo collegamento alla consegna dell’ultimo byte?',[
    intervallo('b','Pacchetto (B)',16,256,64,16),intervallo('q','Pacchetti già in coda all’uscita scelta',0,6,2),scelta('uscite','Secondo flusso parallelo',[['solo','Assente'],['stessa','Stessa uscita, prima del pacchetto osservato'],['distinta','Uscita indipendente']])
  ],p => {
    const primo=p.b/16, ultimo=p.b/8, coda=(p.q+Number(p.uscite==='stessa'))*ultimo;
    return [fase('Collegamento in ingresso','Il primo link trasporta 16 byte per microsecondo.',[['Byte',p.b],['Tempo (µs)',primo]]),
      fase('Ponte','Il ponte impiega 1 µs. Dopo l’elaborazione trova i pacchetti indicati ancora da trasmettere, tutti della stessa taglia. Un secondo flusso arriva da un ingresso indipendente nello stesso istante e, se chiede la stessa uscita, ha precedenza. Lo switch può servire entrambe le uscite insieme.',[['Elaborazione (µs)',1],['Coda (µs)',coda],['Pacchetti davanti',p.q+Number(p.uscite==='stessa')]]),
      fase('Collegamento in uscita','L’ultimo link trasporta 8 byte per microsecondo. La propagazione è trascurata.',[['Invio (µs)',ultimo],['Latenza totale (µs)',primo+1+coda+ultimo]])];
  });

  // Dischi, ridondanza e memoria flash.
  laboratorio('5.1','Quanto dura l’accesso al primo byte con la frazione di giro scelta?',[
    scelta('rpm','Velocità (giri/min)',[['5400','5400'],['7200','7200']]),intervallo('f','Ottavi di giro ancora da attendere',0,7,4),intervallo('s','Tempo di seek (ms)',0,15,6)
  ],p => {
    const giro=60000/Number(p.rpm), rot=giro*p.f/8;
    return [fase('Posizionamento','Il movimento radiale precede l’attesa del settore.',[['Seek (ms)',p.s],['Periodo di un giro (ms)',dec(giro)]]),
      fase('Rotazione residua','La fase è misurata dopo l’arrivo della testina sulla traccia.',[['Frazione del giro',p.f+'/8'],['Attesa di questo settore (ms)',dec(rot)],['Attesa media su una fase uniforme (ms)',dec(giro/2)]]),
      fase('Primo byte','La somma termina quando la testina raggiunge l’inizio del settore.',[['Latenza al primo byte (ms)',dec(p.s+rot)],['Lettura del settore','da iniziare']])];
  }, riscontro(-1, 'Latenza al primo byte (ms)', 'Latenza al primo byte (ms, fino a quattro decimali)'));
  laboratorio('5.2','Quali sono lo scostamento iniziale in byte e la durata della richiesta sequenziale?',[
    intervallo('l','LBA iniziale',0,256,20),intervallo('n','Blocchi consecutivi',1,64,8),scelta('b','Dimensione del blocco (B)',[['512','512'],['4096','4096']]),intervallo('seek','Seek (ms)',0,12,4),intervallo('rot','Attesa di rotazione (ms)',0,8,2)
  ],p => {
    const b=Number(p.b), bytes=p.n*b, tut=bytes/128;
    return [fase('Spazio logico','L’intervallo include entrambi gli estremi indicati.',[['Primo LBA',p.l],['Ultimo LBA',p.l+p.n-1],['Offset iniziale (B)',p.l*b]]),
      fase('Trasferimento','La velocità effettiva è 128 MB/s, ossia 128 byte per microsecondo.',[['Byte richiesti',bytes],['Trasferimento (µs)',tut]]),
      fase('Servizio','Seek e attesa rotazionale si pagano una sola volta all’inizio della richiesta. Seguono il trasferimento sequenziale e il completamento. Nel modello la coda è vuota.',[['Accesso (µs)',1000*(p.seek+p.rot)],['Tempo totale (µs)',1000*(p.seek+p.rot)+tut]])];
  });
  laboratorio('5.3','Quanti cilindri percorre la testina per esaurire la coda scelta?',[
    intervallo('pos','Cilindro iniziale',0,100,40),scelta('p','Disciplina',[['fcfs','FCFS'],['sstf','SSTF']]),scelta('cache','Contenuto della cache',[['vuota','Vuota'],['hit','Blocco sul cilindro 80']])
  ],p => {
    const queue=[80,15,55].filter(x=>p.cache==='vuota'||x!==80);
    let pos=p.pos,total=0;
    const traccia=[fase('Coda di arrivo','Le richieste arrivano insieme, in ordine 80, 15, 55.',[['Testina',pos],['Servite dalla cache',p.cache==='hit'?1:0],['Coda disco',queue.join(', ')]])];
    while(queue.length) {
      const best=p.p==='fcfs'?0:queue.reduce((i,x,j)=>Math.abs(x-pos)<Math.abs(queue[i]-pos)?j:i,0);
      const [next]=queue.splice(best,1), distanza=Math.abs(next-pos);
      total+=distanza; pos=next;
      traccia.push(fase('Lettura sul cilindro '+pos,'Il modello misura il cammino radiale e trascura la rotazione.',[['Spostamento',distanza],['Cammino cumulativo',total]]));
    }
    return traccia;
  });

  const livelliRaid = {
    '0':  {nome:'RAID 0', capacita:8, leggibile:() => false, regola:'Lo striping assegna blocchi distinti ai quattro membri. Il primo guasto rende incompleto il volume.'},
    '1':  {nome:'RAID 1 a quattro copie', capacita:2, leggibile:() => true, regola:'Ogni membro conserva una copia integrale. Con uno o due guasti restano copie complete.'},
    '5':  {nome:'RAID 5', capacita:6, leggibile:guasti => guasti.length===1, regola:'Una sola equazione di parità consente di ricostruire un blocco mancante per stripe.'},
    '6':  {nome:'RAID 6', capacita:4, leggibile:() => true, regola:'Due informazioni di parità indipendenti consentono di recuperare fino a due membri assenti.'},
    '10': {nome:'RAID 10 con coppie 0–1 e 2–3', capacita:4, leggibile:guasti => guasti!=='01', regola:'Ciascuna coppia deve mantenere almeno una copia dei propri dati.'}
  };
  laboratorio('6.1','Tutti i blocchi del volume restano leggibili con i dischi guasti selezionati?',[
    scelta('r','Quattro dischi da 2 TB',Object.entries(livelliRaid).map(([id,r])=>[id,r.nome]),'5'),scelta('g','Dischi guasti',[['0','Solo 0'],['01','0 e 1'],['02','0 e 2']])
  ],p => {
    const raid=livelliRaid[p.r], ok=raid.leggibile(p.g);
    const trace = [fase('Organizzazione','I quattro membri hanno capacità uguale. Il modello considera blocchi integri sui dischi superstiti.',[['Capacità grezza (TB)',8],['Capacità utile (TB)',raid.capacita]]),
      fase('Guasti','I numeri identificano i membri fisici dell’array.',[['Dischi assenti',p.g.split('').join(', ')],['Membri superstiti',4-p.g.length]]),
      fase('Leggibilità',raid.regola,[['Intero volume leggibile',si(ok)],['Esito',ok?'servizio degradato':'dati del volume incompleti']])];
    if (p.r==='5') {
      const unGuasto=p.g==='0';
      trace.push(fase('Ricostruzione di una stripe',unGuasto?'In questa stripe il membro 0 contiene A. Sui superstiti si leggono B = 0x31, C = 0x42 e P = 0x66. P XOR B XOR C restituisce il byte mancante.':'In questa stripe i membri 0, 1 e 2 contengono A, B e C. La parità sul membro 3 fornisce una sola equazione per i due byte di dati mancanti.',[['Membri di dati mancanti',p.g.length],['Byte A ricostruito',unGuasto?hex(0x31^0x42^0x66):'indeterminato']]));
    }
    return trace;
  }, riscontro(2, 'Intero volume leggibile', 'Intero volume leggibile (sì/no)'));
  laboratorio('6.2','Quale parità permette di ricostruire il nuovo A dopo il guasto del suo disco?',[
    intervallo('a','Vecchio byte A',0,255,85),intervallo('b','Byte B',0,255,51),intervallo('n','Nuovo byte A',0,255,170)
  ],p => {
    const vecchia=p.a^p.b, nuova=vecchia^p.a^p.n;
    return [fase('Stripe iniziale','P = A XOR B.',[['A',hex(p.a)],['B',hex(p.b)],['P',hex(vecchia)]]),
      fase('Aggiornamento','P nuova = P vecchia XOR A vecchio XOR A nuovo. Si scrivono il nuovo A e la nuova P.',[['A nuovo',hex(p.n)],['P nuova',hex(nuova)],['I/O di blocco','2 letture + 2 scritture']]),
      fase('Perdita del membro A','La ricostruzione usa B e la parità aggiornata.',[['B XOR P nuova',hex(p.b^nuova)],['Coincide con A nuovo',si((p.b^nuova)===p.n)]])];
  }, riscontro(1, 'P nuova', 'Parità dopo la scrittura'));
  laboratorio('6.3','Quale pagina fisica diventa invalida quando si aggiorna la pagina logica selezionata?',[
    scelta('l','Pagina logica',[['0','L0'],['1','L1']]),intervallo('v','Nuovo valore del byte',0,255,99)
  ],p => {
    const idx=Number(p.l), vecchio=[17,34][idx];
    return [fase('Mappa iniziale','L0 punta a P0 e L1 a P1. P2 è libera e cancellata.',[['Pagina scelta','L'+idx],['Pagina fisica','P'+idx],['Valore',vecchio]]),
      fase('Programmazione','Il controller programma P2 e aggiorna la mappa dopo il completamento.',[['Nuovo collegamento','L'+idx+' → P2'],['Dato su P2',p.v]]),
      fase('Lettura logica','La pagina fisica precedente resta invalida fino alla raccolta dei blocchi.',[['Pagina letta','P2'],['Byte restituito',p.v],['Pagina invalida','P'+idx]])];
  });
  laboratorio('6.4','Quanto dura la scrittura di una pagina con lo stato di spazio libero scelto?',[
    intervallo('v','Pagine valide nel blocco vittima su 8',0,7,3),scelta('st','Spazio libero',[['gc','Occorre recuperare un blocco'],['free','Pagina libera già disponibile']])
  ],p => {
    const n=p.st==='gc'?p.v:0, erase=p.st==='gc'?2000:0;
    return [fase('Stato iniziale','La migrazione dispone di spazio di riserva. La nuova scrittura host riguarda una pagina.',[['Pagine da migrare',n],['Scritture host',1]]),
      fase('Preparazione dello spazio','Ogni migrazione richiede 50 µs per leggere e 200 µs per programmare. Una cancellazione richiede 2000 µs.',[['Migrazioni (µs)',n*250],['Cancellazione (µs)',erase]]),
      fase('Scrittura dell’host','La programmazione finale aggiunge 200 µs.',[['Programmazioni fisiche',n+1],['Amplificazione',n+1],['Latenza totale (µs)',n*250+erase+200]])];
  });

  // Trasferimenti diretti e completamento.
  laboratorio('7.1','Da quante parole in poi il DMA fa risparmiare almeno un ciclo della CPU?',[
    intervallo('n','Parole da 4 byte',1,128,16),intervallo('s','Preparazione DMA (cicli CPU)',4,80,32,4)
  ],p => [
    fase('Richiesta','Ogni parola occupa quattro byte.',[['Parole',p.n],['Byte',4*p.n]]),
    fase('I/O programmato','Ogni parola richiede sei cicli CPU per il trasferimento.',[['Cicli CPU',6*p.n],['Accessi dati CPU',p.n]]),
    fase('DMA','Il driver spende i cicli di preparazione più otto cicli per il completamento.',[['Cicli CPU',p.s+8],['Prima lunghezza con risparmio (parole)',Math.floor((p.s+8)/6)+1],['Risparmio nel caso scelto (cicli)',6*p.n-p.s-8]])
  ], riscontro(-1, 'Prima lunghezza con risparmio (parole)'));
  laboratorio('7.2','Da quale indirizzo parte l’ultima transazione e quanti byte comprende?',[
    intervallo('n','Lunghezza (B)',1,128,37),scelta('w','Massimo per transazione (B)',[['8','8'],['16','16']]),scelta('d','Direzione',[['rx','Dal dispositivo alla memoria'],['tx','Dalla memoria al dispositivo']])
  ],p => {
    const w=Number(p.w), k=Math.ceil(p.n/w), last=0x6000+(k-1)*w;
    return [fase('Descrittore','Il buffer DMA inizia a 0x6000.',[['Primo indirizzo','0x6000'],['Lunghezza (B)',p.n]]),
      fase('Emissione delle transazioni','Il dispositivo è l’iniziatore delle operazioni sul bus.',[['Operazione in memoria',p.d==='rx'?'scrittura':'lettura'],['Transazioni',k]]),
      fase('Ultima transazione','L’ultimo indirizzo incluso è base + lunghezza − 1.',[['Primo byte finale',hex(last)],['Ultimo byte',hex(0x6000+p.n-1)],['Byte nell’ultima transazione',p.n-(k-1)*w]])];
  });
  laboratorio('7.3','Quanti slot risultano liberi dopo il recupero dei completamenti?',[
    intervallo('cap','Slot nell’anello',2,16,8),intervallo('rich','Richieste da pubblicare',1,20,7),intervallo('fin','Completamenti osservabili al massimo',0,16,3)
  ],p => {
    const pubblicati=Math.min(p.cap,p.rich), ritirati=Math.min(pubblicati,p.fin);
    return [fase('Preparazione','Ogni richiesta usa un descrittore. L’eccedenza rimane in attesa.',[['Descrittori preparati',pubblicati],['Richieste in attesa',p.rich-pubblicati]]),
      fase('Pubblicazione','Dopo la sincronizzazione richiesta dal protocollo il driver trasferisce la proprietà al dispositivo.',[['Slot del dispositivo',pubblicati],['Slot ancora liberi',p.cap-pubblicati]]),
      fase('Recupero','Il driver riacquisisce soltanto gli slot il cui completamento è stato osservato.',[['Restituiti',ritirati],['Ancora attivi',pubblicati-ritirati],['Liberi',p.cap-pubblicati+ritirati]])];
  });
  laboratorio('7.4','Quale byte riceve il dispositivo, oppure in quale passaggio fallisce l’accesso?',[
    intervallo('off','Offset nella pagina (B)',0,128,12,4),scelta('op','Preparazione del driver',[['ok','Indirizzo DMA e sincronizzazione'],['cache','Indirizzo DMA, omette sincronizzazione'],['ptr','Usa il puntatore virtuale CPU']])
  ],p => {
    const ok=p.op!=='ptr', pulita=p.op==='ok';
    return [fase('Scrittura della CPU','Un byte passa da 17 a 34 nella cache CPU. La memoria conserva 17 finché il driver esegue la sincronizzazione.',[['VA CPU',hex(0x9000+p.off)],['Indirizzo fisico',hex(0x3000+p.off)],['Indirizzo DMA assegnato',hex(0x5000+p.off)]]),
      fase('Descrittore e ordinamento','La IOMMU accetta soltanto la pagina DMA 0x5000 di questo dispositivo. La pubblicazione del descrittore è ordinata in tutti i casi.',[['Indirizzo programmato',hex((ok?0x5000:0x9000)+p.off)],['Contenuto in memoria',pulita?34:17]]),
      fase('Lettura del dispositivo',ok?'La IOMMU traduce l’indirizzo DMA. Il dispositivo legge il byte presente in memoria.':'La traduzione IOMMU fallisce prima del trasferimento.',[['Traduzione',ok?hex(0x3000+p.off):'assente'],['Byte ricevuto',ok?(pulita?34:17):'nessuno']])];
  });
  laboratorio('7.5','Quanto tempo separa l’arrivo dell’ultimo byte dalla prima esecuzione del thread risvegliato?',[
    intervallo('t','Trasferimento DMA (µs)',10,100,40,5),intervallo('batch','Ritardo di notifica (µs)',0,30,4),intervallo('sched','Attesa dello scheduler (µs)',0,40,8)
  ],p => [
    fase('Fine del trasferimento','Il modello pone la pubblicazione dello stato all’istante dell’ultimo byte.',[['Stato disponibile a (µs)',p.t],['Thread','sospeso']]),
    fase('Notifica e servizio','L’interrupt arriva dopo il ritardo impostato. Il driver impiega 3 µs per verificare e riacquisire il buffer.',[['Interrupt a (µs)',p.t+p.batch],['Thread eseguibile a (µs)',p.t+p.batch+3]]),
    fase('Ripresa in CPU','Il thread ottiene la CPU al termine dell’attesa di scheduling.',[['Ripresa a (µs)',p.t+p.batch+3+p.sched],['Dall’ultimo byte alla ripresa (µs)',p.batch+3+p.sched]])
  ]);

  // Esercitazioni. Ogni variante esplicita il modello e conserva i passaggi per la verifica.
  const numero = (label, risposta, hint) => ({label, answer:String(risposta), numeric:true, hint});
  const opzione = (label, answer, choices, hint) => ({label, answer, choices, hint});
  const ordina = (label, ordine, hint) => ({label, ordine, numeric:false, answer:ordine.join(' → '), hint});
  const variante = (consegna, campi, svolgimento) => ({consegna, campi, svolgimento});
  const gruppi = ['','exceptions','syscalls','io_interrupts','buses','disks','raid_ssd','dma'];
  function prova(c, n, u, titolo, principio, ...varianti) {
    const capitolo='4.'+c, suffisso=String(n).padStart(2,'0');
    if (!SL.prove[capitolo]) SL.prove[capitolo]=[];
    SL.prove[capitolo].push({titolo,principio,unita:capitolo+'.'+u,attivita:'cslez4_'+c+'_'+suffisso+'_'+gruppi[c]+'_'+suffisso,varianti});
  }

  prova(1,1,3,'Indirizzare una porta della IDT',
    'La IDT è la tabella che associa a ciascun numero di evento, detto vettore, una porta contenente le informazioni per avviare il gestore. Le voci sono numerate da zero. Se ogni porta occupa s byte, il vettore v ha offset v × s dalla base della tabella e indirizzo base + v × s. Per risalire da un byte osservato alla porta, si divide la distanza dalla base per s: il quoziente intero è il vettore e il resto è la posizione del byte dentro la porta. Il prefisso 0x indica numeri in base sedici. La dimensione della porta dipende dalla modalità del processore.',
    variante(
      "La IDT inizia a 0x4000. Ogni descrittore occupa 16 byte (modalità a 64 bit). Trova l’offset e l’indirizzo del descrittore di indice 14.",
      [
        numero("Offset (B)", 224, "L’indice zero corrisponde al primo byte."),
        numero("Indirizzo del descrittore", 16608, "Aggiungi alla base il numero di byte attraversati.")
      ],
      [
        "A ogni incremento del vettore, l’indirizzo della voce cresce di 16 byte.",
        "L’offset del vettore 14 è 14 × 16 = 224 B, ossia 0xE0.",
        "Il descrittore si legge a 0x4000 + 0xE0 = 0x40E0. Il suo contenuto determina l’indirizzo del gestore."
      ]),
    variante(
      "Un analizzatore registra una lettura del byte all’indirizzo 0x8114 mentre la CPU consulta la IDT. In modalità protetta a 32 bit la tabella comincia a 0x8000 e ogni porta occupa 8 B. A quale vettore appartiene quel byte e a quale distanza si trova dall’inizio della sua porta?",
      [
        numero("Vettore", 34, "Conta le porte intere comprese tra la base e il byte osservato."),
        numero("Posizione nella porta (B, da zero)", 4, "Il resto della divisione misura la distanza dal primo byte della porta.")
      ],
      [
        "La distanza dalla base della tabella vale 0x8114 − 0x8000 = 0x114, cioè 276 B.",
        "Dividendo 276 per 8 si ottengono 34 porte intere e un resto di 4 B. La porta di indice 34 inizia quindi a 0x8110.",
        "Il byte osservato è alla posizione 4, contando da zero. Ricomponendo l’indirizzo si ottiene 0x8000 + 34 × 8 + 4 = 0x8114."
      ]));

  prova(1,2,2,'Ricostruire la classe e il punto di ripresa',
    'RIP è il registro che conserva l’indirizzo dell’istruzione da eseguire; il frame è il gruppo di valori salvati all’ingresso del gestore. Un fault preciso, come #PF per un problema nell’accesso a una pagina di memoria, conserva l’indirizzo dell’istruzione da ritentare. INT3 è un’istruzione di un byte che un debugger, il programma di analisi dell’esecuzione, può usare come punto di arresto; produce la trap #BP e salva l’indirizzo successivo. Se il debugger ripristina il byte originale, deve anche predisporre RIP al primo byte dell’istruzione ripristinata. Il prefisso 0x indica la base sedici.',
    variante(
      "Un’istruzione di caricamento lunga 4 byte inizia a 0x4010. Durante il suo accesso ai dati manca la pagina richiesta. Il kernel rende valida la traduzione. Identifica la classe e il RIP salvato.",
      [
        opzione("Classe", "Fault", ["Trap","Interrupt esterno","Fault"], "La stessa operazione deve poter essere ritentata."),
        numero("RIP salvato", 16400, "Individua il primo byte dell’operazione incompleta.")
      ],
      [
        "La traduzione segnala #PF mentre il caricamento deve ancora concludersi.",
        "Il page fault è un fault preciso e conserva l’indirizzo del caricamento.",
        "Il ritorno riporta RIP a 0x4010. Dopo la riuscita del caricamento RIP potrà avanzare a 0x4014."
      ]),
    variante(
      "Un debugger ha sostituito il primo byte di un’istruzione con INT3, che occupa un byte. Quando arriva #BP, il frame contiene RIP = 0x4021. Il debugger conosce e ripristina il byte originale. A quale indirizzo deve riscriverlo e quale RIP deve predisporre affinché il programma esegua per intero l’istruzione originale?",
      [
        numero("Indirizzo del byte da riscrivere", 16416, "Per una trap il RIP salvato segue l’istruzione che l’ha provocata."),
        opzione("Preparazione della ripresa", "RIP al primo byte ripristinato", ["RIP al primo byte ripristinato","RIP invariato a 0x4021","RIP all’istruzione successiva a quella originale"], "Individua il primo byte che la CPU dovrà decodificare.")
      ],
      [
        "Il processore ha completato INT3 prima di salvare 0x4021. Poiché INT3 occupa un byte, il breakpoint si trovava a 0x4021 − 1 = 0x4020.",
        "Il debugger riscrive il byte originale a 0x4020. La memoria ora contiene nuovamente l’inizio dell’istruzione prevista dal programma.",
        "Per eseguire quella istruzione il debugger dispone la ripresa da 0x4020. Ripartire da 0x4021 salterebbe il byte appena ripristinato."
      ]));

  prova(1,3,5,'Misurare il frame di ingresso',
    'La pila conserva gruppi di valori recuperati in ordine inverso agli inserimenti; ESP a 32 bit e RSP a 64 bit ne indicano la cima. Uno slot è il posto di un campo: qui misura quattro byte nella porta a 32 bit oppure otto nell’ingresso a 64 bit. Nel caso a 32 bit con passaggio dal privilegio applicativo CPL 3 al privilegio kernel CPL 0, il frame salva SS ed ESP precedenti, poi EFLAGS, CS ed EIP. Questi campi identificano pila, stato del processore e punto di ripresa. Nell’ingresso ordinario a 64 bit i corrispondenti campi sono SS, RSP, RFLAGS, CS e RIP; il page fault #PF aggiunge il codice di errore. L’allineamento a sedici byte porta prima la cima al multiplo inferiore o uguale di sedici, poi vengono sottratti i byte dei campi.',
    variante('Ingresso IDT in modalità protetta a 32 bit, porta interrupt a 32 bit, da CPL 3 a CPL 0. Arriva un interrupt esterno senza codice di errore. Conta gli slot da quattro byte del frame hardware e i byte complessivi, escludendo il prologo.',
      [numero('Slot',5,'Ai tre campi di ritorno aggiungi la coppia della vecchia pila.'),numero('Byte',20,'Ogni campo occupa uno slot di quattro byte.')],
      ['Il cambio di privilegio salva il precedente SS e il precedente ESP sulla nuova pila.','EFLAGS, CS ed EIP aggiungono altri tre slot. La richiesta esterna del caso è priva di codice di errore.','I 2 + 3 = 5 slot occupano 5 × 4 = 20 B.']),
    variante('Ingresso IDT ordinario per #PF a 64 bit. Il puntatore di pila selezionato vale 0x2008, l’allineamento hardware avviene a 16 byte e il page fault aggiunge un codice di errore. Calcola dimensione del frame e RSP finale.',
      [numero('Byte nei campi del frame',48,'Conta cinque campi di base e il codice di errore.'),numero('RSP finale',0x1fd0,'Prima arrotonda il puntatore verso il basso, poi sottrai il frame.')],
      ['L’allineamento porta 0x2008 a 0x2000 e consuma 8 B.','SS, RSP, RFLAGS, CS e RIP occupano 5 × 8 = 40 B. Il codice di #PF aggiunge 8 B.','Il frame occupa 48 B = 0x30. RSP finale vale 0x2000 − 0x30 = 0x1FD0. Il movimento totale è di 56 B.']));
  prova(1,4,3,'Distinguere privilegio e mascheramento',
    'CPL indica il livello di privilegio corrente, mentre DPL è il limite della porta della IDT per le invocazioni software; il livello 0 concede i privilegi del kernel e il livello 3 è quello delle applicazioni. L’istruzione INT n può invocare la porta soltanto se CPL ≤ DPL, altrimenti genera l’eccezione di protezione #GP. IF è un bit del processore: quando vale uno consente la consegna degli interrupt esterni mascherabili. Una porta interrupt salva il valore precedente dei flag e azzera IF nel gestore. Una NMI, richiesta di interruzione non mascherabile, usa un meccanismo dedicato indipendente da IF e soggetto alle proprie regole di blocco.',
    variante('Da CPL 3 si esegue INT 0x52 verso una porta presente con DPL 0. La destinazione è valida e IF vale 1. Qual è l’esito del controllo di accesso?',
      [opzione('Esito','#GP',['Ingresso al gestore 0x52','#GP','Attesa per IF'],'Per INT n confronta numericamente CPL e DPL.')],
      ['INT n invoca la porta per iniziativa del software.','Serve CPL ≤ DPL. Il confronto 3 ≤ 0 è falso.','La CPU genera #GP. Il valore di IF riguarda la consegna di interrupt mascherabili esterni.']),
    variante('Un interrupt mascherabile viene accettato con IF = 1. La IDT seleziona una porta interrupt valida. Che valore ha IF all’ingresso e quale classe di richiesta può ancora giungere attraverso il meccanismo dedicato?',
      [numero('IF all’ingresso',0,'Una porta interrupt inibisce le richieste mascherabili.'),opzione('Richiesta','NMI',['IRQ mascherabile','NMI','Qualsiasi IRQ della stessa priorità'],'Individua la classe indipendente da IF.')],
      ['La CPU conserva i flag di ritorno nel frame.','La porta interrupt azzera IF nel contesto corrente del gestore.','Una NMI segue un meccanismo dedicato indipendente da IF, soggetto alle proprie regole di blocco.']));
  prova(1,5,7,'Separare descrittore, destinazione e ritorno',
    'La porta della IDT è un descrittore: il suo indirizzo individua dove leggerne i campi, mentre uno dei campi indica l’indirizzo del gestore. Il fetch è il prelievo della prossima istruzione. Il frame conserva il contesto di ritorno e IRETQ è l’istruzione che lo ripristina dopo il lavoro del codice d’ingresso. In una pipeline, che sovrappone le fasi di più istruzioni, il ritiro rende definitivi gli effetti nell’ordine del programma. Un fault preciso conserva gli effetti delle istruzioni precedenti già ritirate, scarta quelli delle istruzioni successive, dette giovani, e salva in RIP l’indirizzo dell’istruzione da ritentare.',
    variante('La porta selezionata contiene la destinazione 0x8040. Il descrittore si trova a 0x4720 e il frame contiene RIP = 0x2048. Quali indirizzi usa la CPU per il primo fetch del gestore e per la ripresa con IRETQ?',
      [numero('Primo fetch del gestore',0x8040,'Leggi la destinazione descritta dalla porta.'),numero('Primo fetch dopo IRETQ',0x2048,'Segui il contesto di ritorno.')],
      ['L’indirizzo 0x4720 serve a leggere il descrittore.','La destinazione contenuta nella porta avvia il gestore a 0x8040.','Dopo il ripristino software IRETQ usa il frame valido e riporta RIP a 0x2048.']),
    variante('Una pipeline ha tre istruzioni giovani in volo quando rileva un fault preciso a 0x3100. Le più vecchie sono già ritirate. Il gestore corregge la causa e lascia integro il frame. Quanti risultati delle tre istruzioni giovani divengono architetturali prima della consegna? Dove si riprende?',
      [numero('Risultati giovani pubblicati',0,'Il ritiro rispetta il confine del fault.'),numero('RIP alla ripresa',0x3100,'Il gestore ha reso possibile ritentare l’operazione.')],
      ['Il confine preciso conserva gli effetti delle sole istruzioni precedenti.','Le tre operazioni giovani vengono scartate e pubblicano zero risultati.','Il RIP di un fault punta all’istruzione da ritentare, dunque vale 0x3100.']));

  prova(2,1,1,'Preparare i registri della chiamata',
    'L’ABI nativa Linux x86-64 è la convenzione che assegna ai registri il numero di servizio e gli argomenti della chiamata. Prima dell’istruzione SYSCALL, RAX seleziona read con zero e write con uno. In queste operazioni RDI contiene il descrittore, il numero dell’oggetto aperto; RSI contiene l’indirizzo del buffer, la regione di memoria dei dati; RDX contiene il limite di byte richiesto. Read legge verso il buffer e write scrive a partire dal buffer. Al ritorno RAX indica i byte effettivamente trasferiti oppure un errore. Il prefisso 0x indica numeri in base sedici.',
    variante(
      "Linux x86-64, ABI nativa. Prepara write(7, 0x4080, 96). Indica RAX, RDI e RDX immediatamente prima di SYSCALL.",
      [
        numero("RAX", 1, "RAX distingue read da write."),
        numero("RDI", 7, "Il descrittore è il primo argomento."),
        numero("RDX", 96, "La lunghezza è il terzo argomento.")
      ],
      [
        "Il servizio write ha numero 1, che va in RAX.",
        "Il primo argomento è il descrittore 7 in RDI. RSI riceve il puntatore 0x4080.",
        "RDX contiene il terzo argomento, 96 B. Al ritorno RAX conterrà il conteggio dei byte trasferiti oppure un codice di errore."
      ]),
    variante(
      "Un programma Linux x86-64 deve eseguire read(4, 0x4080, 32). Al punto di arresto prima di SYSCALL si leggono RAX = 0, RDI = 4, RSI = 32, RDX = 0x4080. Individua la correzione che conserva il servizio e il file richiesti, poi indica il limite di byte che il kernel leggerà dai registri corretti.",
      [
        opzione("Correzione", "Scambiare RSI e RDX", ["Scambiare RSI e RDX","Scambiare RAX e RDI","Scambiare RDI e RSI"], "Associa a ciascun argomento il registro che ne trasporta la posizione nella chiamata."),
        numero("Limite dopo la correzione (B)", 32, "La terza posizione della chiamata contiene il conteggio richiesto.")
      ],
      [
        "Per read il numero di servizio è 0 e il primo argomento è il descrittore 4. RAX e RDI sono già corretti.",
        "Al secondo argomento corrisponde RSI, che deve contenere il puntatore 0x4080. Al terzo corrisponde RDX, che deve contenere 32. Lo scambio dei due registri ricostruisce la richiesta.",
        "Il kernel riceve così un buffer che inizia a 0x4080 e un limite di 32 B. Il ritorno della futura lettura indicherà quanti byte siano stati effettivamente consegnati."
      ]));

  prova(2,2,1,'Seguire l’ingresso SYSCALL',
    'SYSCALL è l’istruzione che entra nel kernel, la parte del sistema operativo che serve la richiesta. Nel percorso nativo x86-64 occupa due byte e salva in RCX l’indirizzo dell’istruzione successiva, mentre R11 conserva i flag utente, cioè i bit di stato del processore. RSP, il puntatore alla cima della pila, mantiene inizialmente il valore del chiamante. Il codice d’ingresso che segue la transizione, detto prologo, preserva il contesto necessario e seleziona la pila del kernel. L’istante osservato determina quindi se si stanno leggendo i soli effetti hardware o anche le modifiche del prologo.',
    variante('Su x86-64 nativo SYSCALL inizia a 0x4000 e occupa due byte. I flag utente valgono 0x202. Individua RCX e R11 immediatamente dopo la transizione hardware.',
      [numero('RCX',0x4002,'Conserva il punto successivo.'),numero('R11',0x202,'Conserva i flag di ritorno.')],
      ['L’istruzione seguente è a 0x4000 + 2 = 0x4002.','La CPU salva questo indirizzo in RCX e i flag utente 0x202 in R11.','Il kernel entra attraverso un indirizzo configurato per SYSCALL e potrà costruire il contesto software.']),
    variante('All’istante precedente SYSCALL il thread ha RSP = 0x7000. Considera il solo meccanismo hardware x86-64, prima del prologo. Quale valore conserva RSP e chi seleziona la pila del kernel?',
      [numero('RSP',0x7000,'Segui le modifiche effettuate dalla singola istruzione.'),opzione('Selezione della pila','Codice di ingresso del kernel',['Porta IDT','Codice di ingresso del kernel','Chiamante utente'],'SYSCALL usa un ingresso dedicato.')],
      ['SYSCALL salva punto di ritorno e flag in RCX e R11.','L’istruzione lascia in RSP il valore utente 0x7000.','Il codice di ingresso del kernel deve preservare il contesto necessario e passare alla pila appropriata.']));
  prova(2,3,2,'Scegliere l’operazione dal banco registri',
    'Nel percorso nativo Linux x86-64 RAX è il registro che seleziona il servizio del kernel: zero richiede read, uno write e sessanta exit. RDI contiene il primo argomento: in read e write è il descrittore dell’oggetto aperto, mentre in exit è lo stato con cui terminare il thread, la sequenza di istruzioni chiamante. Per read e write, RSI indica il buffer, la regione di memoria dei dati, e RDX il limite richiesto in byte. SYSCALL trasferisce il controllo al codice del kernel che interpreta questi registri.',
    variante('Prima di SYSCALL su Linux x86-64 si leggono RAX = 1, RDI = 1, RSI = 0x6000, RDX = 8. Quale operazione viene richiesta e con quale limite di byte?',
      [opzione('Operazione','write',['read','write','exit'],'Il numero di servizio si legge in RAX.'),numero('Limite (B)',8,'Il terzo argomento contiene la lunghezza.')],
      ['RAX = 1 seleziona write nell’ABI indicata.','RDI = 1 è il descrittore, RSI = 0x6000 è l’indirizzo della sorgente.','RDX = 8 limita la richiesta a otto byte. Il conteggio effettivo arriva al ritorno.']),
    variante('Un thread deve terminare con stato 7 tramite la syscall grezza exit di Linux x86-64. Indica numero di servizio e primo argomento.',
      [numero('RAX',60,'Individua il servizio Linux x86-64 che termina il thread corrente.'),numero('RDI',7,'Lo stato di uscita è un argomento, distinto dal selettore.')],
      ['Il servizio exit ha numero 60, quindi si prepara RAX = 60.','Il valore desiderato va nel primo argomento, quindi RDI riceve 7.','SYSCALL consegna la richiesta al kernel. L’esecuzione del thread termina.']));
  prova(2,4,3,'Contabilizzare progresso ed EOF',
    'Read e write trasferiscono dati fra un oggetto aperto e il buffer, la regione di memoria indicata dal chiamante. Un risultato positivo r conferma r byte trasferiti. Per una write che richiede n byte e ne trasferisce r, il tratto ancora pendente comincia all’indirizzo base + r e contiene n − r byte. Per una read su file regolare con richiesta positiva, il risultato zero indica che si è raggiunta la fine del file, detta EOF. In altri tipi di oggetto e nelle richieste di lunghezza zero l’interpretazione va ricavata dal contratto dell’operazione. Il prefisso 0x introduce la base sedici, nella quale C vale dodici.',
    variante('Un programma scrive 30 B a partire da 0x5000. La syscall restituisce 12. Calcola la lunghezza e il puntatore per riprendere dal primo byte ancora pendente.',
      [numero('Byte residui',18,'Sottrai il numero effettivamente consegnato.'),numero('Puntatore seguente',0x500c,'Somma il conteggio positivo alla base.')],
      ['Il kernel ha accettato i primi dodici byte.','Restano 30 − 12 = 18 B.','Il prossimo byte si trova a 0x5000 + 12 = 0x500C. La nuova chiamata usa quel puntatore e lunghezza 18.']),
    variante('Una read su file regolare chiede 16 B e restituisce 7. La read successiva chiede 9 B e restituisce 0. Indica il totale effettivamente letto e il significato dell’ultimo risultato.',
      [numero('Totale letto (B)',7,'Somma i risultati delle chiamate.'),opzione('Ultimo esito','Fine del file',['Buffer pieno','Fine del file','EBADF'],'La seconda richiesta aveva lunghezza positiva.')],
      ['La prima chiamata consegna soltanto sette byte.','La seconda chiamata, con conteggio positivo, trova il file al termine e restituisce zero.','L’applicazione ha ricevuto 7 + 0 = 7 B e conclude il ciclo di lettura.']));
  prova(2,5,5,'Distinguere servizio grezzo e funzione di libreria',
    'La funzione di libreria C, detta wrapper, prepara i registri secondo l’ABI, la convenzione del passaggio fra programma e kernel. Nell’ABI nativa Linux x86-64 il numero in RAX seleziona il servizio; il dispatcher del kernel è il codice che associa quel numero alla sua implementazione, per esempio zero a read. Al ritorno il wrapper interpreta il risultato grezzo. Nel caso dell’errore EBADF, che segnala un descrittore di file inadatto all’operazione, il kernel restituisce −9: la funzione C espone −1 e imposta errno a nove. Il chiamante consulta errno dopo il segnale di errore previsto dalla funzione.',
    variante('La syscall grezza read su Linux x86-64 ha restituito −9 (EBADF). Si osserva invece il risultato della normale funzione libc read sullo stesso errore. Quali valori compaiono come ritorno ed errno?',
      [numero('Ritorno della funzione',-1,'Il wrapper usa un valore sentinella.'),numero('errno',9,'Il codice di errore della libreria è positivo.')],
      ['Il valore grezzo −9 identifica EBADF.','Il wrapper riconosce l’errore e memorizza 9 in errno.','La funzione restituisce −1 al chiamante, che può consultare errno.']),
    variante('Una normale funzione di libreria ha preparato read(3, buf, 4) sull’ABI Linux x86-64. Quale informazione seleziona il servizio dopo SYSCALL, e quale componente interpreta tale selettore?',
      [opzione('Selettore','Numero in RAX',['Nome della funzione C','Numero in RAX','Descrittore in RDI'],'Il kernel riceve lo stato della macchina.'),opzione('Componente','Dispatcher del kernel',['Dispatcher del kernel','Linker statico','Dispositivo di I/O'],'La scelta avviene dopo l’ingresso privilegiato.')],
      ['Il wrapper prepara RAX = 0 per read, oltre a descrittore, buffer e lunghezza.','SYSCALL raggiunge il codice di ingresso comune.','Il dispatcher del kernel controlla il numero e lo associa all’implementazione di read.']));

  prova(3,1,1,'Leggere il registro giusto al momento giusto',
    'Il driver è il programma che controlla la periferica. Scrive un comando nel registro COMMAND, legge lo stato in STATUS e preleva il dato in DATA quando il flag READY segnala disponibilità. I bit di STATUS sono numerati da zero a partire da destra; il bit k ha peso 2 elevato a k. La maschera di READY contiene uno nella sua posizione e zero nelle altre. AND confronta i bit nella stessa posizione e produce uno soltanto quando entrambi valgono uno: STATUS AND maschera è quindi diverso da zero esattamente quando READY è attivo. Il prefisso 0x indica la base sedici.',
    variante('Una periferica espone COMMAND a 0x80, STATUS a 0x84 e DATA a 0x88. Per acquisire un campione il driver scrive START, attende READY e preleva il byte. Indica gli indirizzi del primo e dell’ultimo accesso.',
      [numero('Primo indirizzo',0x80,'Il primo accesso impartisce un ordine.'),numero('Ultimo indirizzo',0x88,'Il campione è il carico utile.')],
      ['START va scritto nel registro COMMAND, a 0x80.','Il driver interroga STATUS a 0x84. Quando READY passa da zero a uno, procede alla lettura del dato.','La lettura conclusiva avviene su DATA a 0x88 e consegna il campione.']),
    variante('Un controller espone READY nel bit 2 di STATUS. Alla prima lettura STATUS = 0x02, alla seconda STATUS = 0x06. Dopo quale lettura è lecito consumare DATA? Indica anche la maschera del bit.',
      [numero('Numero della lettura',2,'Verifica ogni valore usando AND.'),numero('Maschera',4,'Il bit meno significativo ha indice zero.')],
      ['La maschera del bit 2 è 1 spostato a sinistra di 2, ossia 0x04.','0x02 AND 0x04 vale zero e il driver attende.','0x06 AND 0x04 vale 4 e autorizza la lettura di DATA.']));
  prova(3,2,2,'Contare le interrogazioni del controller',
    'I controlli periodici si contano a partire dal primo istante indicato, includendo l’eventuale controllo sull’estremo finale. Ogni interrogazione aggiunge il proprio costo in cicli CPU. Riducendo il periodo si accorcia l’attesa massima di un evento, mentre cresce il numero di controlli nello stesso intervallo.',
    variante(
      "Il driver esegue un controllo a ogni multiplo positivo di 50 µs, fino a 1000 µs incluso. Ogni controllo richiede 8 cicli CPU. Calcola numero di controlli e costo.",
      [
        numero("Controlli", 20, "La prima osservazione avviene dopo un intero periodo."),
        numero("Cicli CPU", 160, "Moltiplica il numero di letture per il costo unitario.")
      ],
      [
        "Gli istanti di osservazione iniziano a 50 µs e comprendono l’estremo finale.",
        "Il conteggio è 1000 / 50 = 20.",
        "Il costo vale 20 × 8 = 160 cicli CPU."
      ]),
    variante(
      "Un controller conserva READY fino al servizio. Puoi scegliere un periodo di polling di 4, 8 o 16 µs. Occorre rilevare ogni nuovo evento entro 10 µs. Nella finestra (0, 96] µs ogni controllo costa 8 cicli e sono disponibili al massimo 100 cicli CPU. Trova il periodo che soddisfa entrambi i vincoli e i cicli che restano del budget.",
      [
        numero("Periodo ammesso (µs)", 8, "Un evento appena successivo al controllo attende quasi un periodo. Per il costo conta i multipli positivi del periodo fino a 96."),
        numero("Cicli CPU disponibili dopo i controlli", 4, "Dai 100 cicli sottrai il numero di controlli moltiplicato per otto.")
      ],
      [
        "Con un periodo di 16 µs un evento giunto appena dopo il controllo può attendere quasi 16 µs. I periodi di 4 e 8 µs rispettano invece il limite di rilevazione.",
        "Con 4 µs cadono nella finestra 96 / 4 = 24 controlli, per 192 cicli. Con 8 µs ne cadono 12, per 12 × 8 = 96 cicli.",
        "Il solo periodo ammissibile è 8 µs. Il budget residuo vale 100 − 96 = 4 cicli."
      ]));

  prova(3,3,3,'Instradare e chiudere una richiesta',
    'IRQ indica una richiesta di interruzione. Il controller associa il numero della linea a un vettore, che seleziona il gestore nella tabella IDT, e a un core, l’unità del processore che lo eseguirà. Nel modello APIC, l’APIC locale è il componente del controller associato al core che consegna il vettore. Per una richiesta a livello, la periferica mantiene la linea attiva, o asserita, finché persiste la causa. EOI è la conferma di fine servizio inviata al controller: libera il suo stato in servizio. La causa nel dispositivo viene rimossa tramite il driver, il programma che conosce il protocollo della periferica; se resta attiva, può provocare una nuova consegna.',
    variante('Il controller associa IRQ q al vettore 64 + q. Arriva IRQ 6 diretta al core 2. Calcola il vettore e indica il componente che la consegna localmente al core nel modello APIC.',
      [numero('Vettore',70,'Somma il numero della linea alla base.'),opzione('Consegna locale','APIC locale',['Controller del disco','APIC locale','Tabella delle pagine'],'Distingui l’instradamento verso il core dal meccanismo locale.')],
      ['Il dispositivo attiva la linea IRQ 6.','L’instradamento associa 64 + 6 = 70 al core 2.','L’APIC locale del core consegna il vettore 70. La CPU usa quel vettore nella IDT.']),
    variante('Un controller accetta EOI per IRQ a livello. Il driver invia EOI mentre la periferica tiene tuttora asserita la linea. Individua il rischio immediato e l’azione che elimina la causa.',
      [opzione('Rischio','Nuova consegna della richiesta',['Perdita automatica del vettore','Nuova consegna della richiesta','Chiusura della periferica'],'EOI chiude lo stato in servizio nel controller.'),opzione('Azione sul dispositivo','Servire e liberare la causa',['Cambiare IDTR','Servire e liberare la causa','Aumentare il clock'],'Segui la sorgente della linea attiva.')],
      ['Una segnalazione a livello mantiene attiva la linea finché persiste la causa.','EOI libera lo stato in servizio e il livello ancora asserito può provocare una nuova consegna.','Il driver deve servire la periferica e liberarne la causa secondo il protocollo del dispositivo.']));
  prova(3,4,3,'Ragionare su fronte, livello e priorità',
    'Una sorgente sensibile al fronte di salita registra una richiesta quando il segnale passa da zero a uno. Una sorgente sensibile al livello mantiene invece attiva la richiesta finché permane il livello riconosciuto. Le richieste pendenti sono quelle registrate e ancora da servire. Una maschera del controller esclude temporaneamente una richiesta dalla selezione; fra le ammesse l’arbitro applica la regola di priorità indicata. IF è il bit del processore che, quando vale uno, consente la consegna degli interrupt esterni mascherabili. Occorre quindi applicare prima i vincoli di ammissione e poi confrontare le priorità.',
    variante('Un ingresso sensibile al fronte di salita campiona i livelli 0, 1, 1, 0, 1. Il controller conserva ogni fronte e il core li serve tutti. Quante richieste vengono registrate?',
      [numero('Richieste',2,'Elenca soltanto le transizioni 0 → 1.')],
      ['Tra il primo e il secondo campione compare un fronte di salita.','Il tratto 1 → 1 mantiene il livello e il tratto 1 → 0 è un fronte di discesa.','L’ultimo 0 → 1 produce il secondo evento. Il conteggio è 2.']),
    variante('Tre richieste mascherabili pendenti A, B, C hanno priorità 2, 5 e 7. Il numero maggiore indica priorità maggiore. C è mascherata presso il controller e IF = 1. Quale richiesta viene servita per prima e con quale priorità?',
      [opzione('Prima richiesta','B',['A','B','C'],'Elimina le linee mascherate prima del confronto.'),numero('Priorità servita',5,'Confronta soltanto A e B.')],
      ['La maschera rende C inammissibile malgrado la sua priorità 7.','Rimangono A con priorità 2 e B con priorità 5.','IF consente la consegna. Il controller seleziona B perché 5 supera 2.']));
  prova(3,5,4,'Seguire un evento di tastiera',
    'Una tastiera può depositare in DATA un codice di scansione, il numero che identifica l’evento del tasto, e annunciarlo con una richiesta di interruzione IRQ. READY vale uno quando il dato è disponibile. Il controller associa IRQ q al vettore secondo la mappa indicata nella consegna; il vettore seleziona il programma gestore, mentre il driver legge DATA per recuperare il codice. Il software interpreta poi quel codice secondo la disposizione della tastiera. Se ogni codice genera una notifica, il costo totale in cicli CPU è numero di eventi × (costo di ingresso e uscita + costo di lettura e accodamento). Il prefisso 0x indica la base sedici.',
    variante('Una tastiera didattica deposita il codice 0x1C in DATA, porta READY a uno e segnala IRQ 1. La base dei vettori è 32. Che vettore entra nel core e quale valore preleva il driver?',
      [numero('Vettore',33,'La mappa è base + IRQ.'),numero('Byte letto da DATA',28,'Il registro contiene un codice di scansione.')],
      ['Il controller conserva il codice di scansione 0x1C e attiva READY.','La mappa trasforma IRQ 1 nel vettore 32 + 1 = 33.','Il gestore legge DATA e preleva 0x1C, ossia 28. Il software associa poi il codice al carattere previsto dalla disposizione della tastiera.']),
    variante('Un controller notifica 12 codici di scansione, un IRQ per codice senza raggruppamento. Ogni IRQ costa 70 cicli di ingresso e uscita più 10 cicli di lettura e accodamento. Calcola costo complessivo e numero di byte letti se ogni codice occupa un byte.',
      [numero('Cicli',960,'Somma i costi per evento prima di moltiplicare.'),numero('Byte letti',12,'Ogni evento consegna un codice.')],
      ['Ogni evento comporta un ingresso e una lettura, con costo 70 + 10 = 80 cicli.','Dodici eventi consumano 12 × 80 = 960 cicli CPU.','Per ogni ingresso il driver preleva un byte, per un totale di 12 B.']));

  prova(4,1,3,'Misurare tempo e banda utile',
    'Il payload è il contenuto utile del pacchetto. La sua durata di trasmissione è quantità di byte divisa per velocità; la durata totale aggiunge il controllo richiesto dal protocollo. La banda utile è payload diviso durata totale. Un megabyte decimale contiene un milione di byte e un secondo un milione di microsecondi, quindi 1 MB/s equivale a 1 B/µs. Per rispettare una banda minima, la durata totale ammessa è al massimo payload diviso banda richiesta; sottraendo la durata dati si ricava il tempo disponibile per il controllo. Quando più pacchetti condividono un unico controllo, i byte si sommano e il suo tempo si conta una sola volta.',
    variante(
      "Un collegamento serializza 800 B di carico utile a 100 MB/s decimali. La transazione aggiunge 2 µs di controllo. Calcola la durata totale in µs e la banda utile in MB/s.",
      [
        numero("Durata (µs)", 10, "Un MB/s decimale equivale a un byte per microsecondo."),
        numero("Banda utile (MB/s)", 80, "Dividi il carico utile per l’intera durata.")
      ],
      [
        "La serializzazione dura 800 / 100 = 8 µs.",
        "Il controllo aggiunge 2 µs, per un totale di 10 µs.",
        "La banda utile vale 800 / 10 = 80 B/µs. Un byte per microsecondo equivale a un megabyte decimale al secondo."
      ]),
    variante(
      "Un collegamento trasporta 200 B/µs e serve pacchetti da 1200 B. L’applicazione richiede almeno 150 MB/s decimali di dati utili. Il controllo occupa oggi 3 µs per transazione. Calcola quanti microsecondi di controllo siano ammessi per un solo pacchetto e scegli una modifica, tra quelle proposte, che rispetti il requisito.",
      [
        numero("Massimo controllo per un pacchetto (µs)", 2, "Ricava dal requisito il tempo totale disponibile per 1200 B, poi sottrai la trasmissione dei dati."),
        opzione("Modifica sufficiente", "Due pacchetti con un solo controllo da 3 µs", ["Due pacchetti con un solo controllo da 3 µs","Due pacchetti con un controllo da 3 µs ciascuno","Un pacchetto con 4 µs di controllo"], "Valuta il rapporto fra i byte utili complessivi e tutto il tempo occupato sul collegamento.")
      ],
      [
        "Per ottenere 150 B/µs da 1200 B, la transazione può durare al massimo 1200 / 150 = 8 µs. Il trasferimento dei dati occupa 1200 / 200 = 6 µs, perciò al controllo restano 2 µs.",
        "Raggruppando due pacchetti in una sola transazione, i 2400 B passano in 12 µs e pagano il controllo di 3 µs una sola volta. La banda sale a 2400 / 15 = 160 MB/s.",
        "Due controlli separati porterebbero la durata a 18 µs, ossia circa 133,33 MB/s. Un solo pacchetto con 4 µs di controllo darebbe 120 MB/s. Solo il raggruppamento con controllo condiviso raggiunge la soglia."
      ]));

  prova(4,2,2,'Dimensionare i trasferimenti sul bus',
    'La larghezza del canale dati indica quanti bit viaggiano in una battuta, cioè in un trasferimento. Poiché un byte contiene otto bit, dividere la larghezza per otto dà i byte per battuta. Il protocollo stabilisce quanti trasferimenti avvengono in ogni ciclo: DDR ne compie due. Per una lunghezza che supera un numero intero di battute complete serve un’altra battuta, occupata anche se trasporta soltanto il residuo. MHz indica milioni di cicli al secondo: byte per battuta × trasferimenti per ciclo × MHz fornisce la banda di picco in MB/s decimali.',
    variante('Un canale dati da 64 bit consente un trasferimento per ciclo. Un carico di 50 B occupa un numero intero di battute con un ultimo trasferimento parziale. Quante battute servono e quanti byte dell’ultima sono utili?',
      [numero('Battute',7,'Arrotonda per eccesso il quoziente tra byte e capacità di una battuta.'),numero('Byte utili finali',2,'Sei battute piene trasportano 48 B.')],
      ['Una battuta trasporta 64 / 8 = 8 B.','Sei battute trasportano 48 B, cui si aggiunge una settima battuta.','Nell’ultima battuta restano 50 − 48 = 2 B utili.']),
    variante('Un canale DDR da 32 bit opera a 125 MHz, con due trasferimenti per ciclo e uso continuo. Calcola byte per ciclo e banda di picco in MB/s decimali.',
      [numero('Byte per ciclo',8,'Applica il fattore DDR alla larghezza in byte.'),numero('MB/s',1000,'Moltiplica i byte per ciclo per i MHz.')],
      ['Ogni trasferimento porta 32 / 8 = 4 B.','Due trasferimenti portano 2 × 4 = 8 B per ciclo.','A 125 milioni di cicli/s la banda di picco è 8 × 125 = 1000 MB/s.']));
  prova(4,3,4,'Misurare l’attesa per una concessione',
    'Il criterio round-robin riparte dopo l’ultimo servito, mentre la priorità fissa assegna il turno in base al rango. La durata dei turni precedenti determina quando può iniziare quello richiesto.',
    variante(
      "A, B, C chiedono il bus al ciclo zero. Con round-robin in ordine circolare A, B, C l’ultimo servito era B. Ogni turno dura 3 cicli. Chi parte per primo e quanti cicli attende B?",
      [
        opzione("Primo", "C", ["A","B","C"], "Riparti dal successore dell’ultimo servito."),
        numero("Attesa di B (cicli)", 6, "Conta i turni che precedono B.")
      ],
      [
        "Il successore di B è C. La sequenza delle concessioni è C, A, B.",
        "C occupa i cicli da 0 a 3 e A quelli da 3 a 6, con estremo finale escluso.",
        "B parte all’istante 6 dopo due turni di attesa."
      ]),
    variante(
      "A, B e C hanno richieste pendenti al ciclo 0. Il bus concede ad A il primo turno, lungo 3 cicli. Prima del ciclo 3, A presenta una seconda richiesta. B e C sono ancora in attesa. Al ciclo 3 l’arbitro sceglie B per altri 3 cicli. Quale politica tra quelle proposte spiega la scelta e quando potrà iniziare C secondo tale politica?",
      [
        opzione("Politica compatibile", "Round-robin in ordine A, B, C", ["Round-robin in ordine A, B, C","Priorità fissa A > B > C"], "Confronta la prima concessione successiva ad A con la presenza di una seconda domanda di A."),
        numero("Primo ciclo di C", 6, "Nel turno circolare C segue B. Il tempo si misura dall’inizio del turno di A.")
      ],
      [
        "Alla fine del primo turno l’arbitro vede A di nuovo pendente, oltre a B e C. Una priorità fissa che privilegi A concederebbe ad A anche il secondo turno.",
        "Il fatto che al ciclo 3 venga servito B è coerente con il round-robin, che riparte dal successore del richiedente appena servito.",
        "B occupa l’intervallo [3, 6). Il successore di B è C, ancora pendente, che può dunque iniziare al ciclo 6."
      ]));

  prova(4,4,3,'Ricostruire il protocollo di una transazione',
    'Una raffica, o burst, raggruppa più parole di dati sotto un unico indirizzamento iniziale; il tempo è costo iniziale + numero di parole × costo per parola. Le transazioni singole ripetono invece il costo iniziale per ogni parola. In un protocollo a richiesta e conferma, REQ è il segnale controllato dal trasmettitore e ACK quello controllato dal ricevitore. Nel protocollo a quattro fasi entrambi partono bassi: il trasmettitore presenta il dato e alza REQ; dopo l’acquisizione il ricevitore alza ACK; il trasmettitore abbassa REQ e infine il ricevitore abbassa ACK, ristabilendo lo stato di riposo.',
    variante('Una raffica sincrona trasferisce sei parole. Il protocollo impiega un ciclo indirizzo, due cicli iniziali di attesa e un ciclo dati per parola. Le transazioni singole ripetono indirizzo e attesa per ogni parola. Calcola entrambi i tempi.',
      [numero('Cicli in raffica',9,'L’overhead iniziale si paga una volta.'),numero('Cicli in transazioni singole',24,'Calcola prima il costo di una singola parola.')],
      ['La raffica condivide il costo iniziale di 1 + 2 = 3 cicli.','Le sei parole aggiungono 6 cicli e la raffica dura 9 cicli.','Una transazione singola costa 1 + 2 + 1 = 4 cicli. Sei transazioni costano 24 cicli.']),
    variante('Un trasmettitore pilota REQ e un ricevitore pilota ACK. Nel protocollo a quattro fasi i due segnali sono inizialmente bassi. Il dato viene presentato stabilmente prima della richiesta, il ricevitore conferma dopo averlo acquisito e il trasmettitore ritira allora la richiesta. Ricostruisci l’ordine delle quattro transizioni fino al ritorno a riposo.',
      [ordina('Transizioni di REQ e ACK',['REQ sale','ACK sale','REQ scende','ACK scende'],'La richiesta deve essere visibile al ricevitore prima della sua conferma. Per ciascuna discesa individua il segnale che la rende possibile.')],
      ['Il trasmettitore presenta il dato e alza REQ per indicare che può essere acquisito.',
       'Quando il ricevitore ha acquisito il dato, alza ACK. La conferma deve essere visibile prima che il trasmettitore ritiri la richiesta.',
       'Il trasmettitore vede ACK alto e abbassa REQ. Vedendo REQ basso, il ricevitore abbassa ACK. Con entrambe le linee basse può iniziare il trasferimento successivo.']));

  prova(4,5,5,'Separare simultaneità, coda e latenza',
    'Full-duplex significa che le due direzioni del collegamento possono trasferire dati contemporaneamente. Per ogni direzione il tempo è byte divisi per velocità; la durata fino a entrambe le consegne è il maggiore dei due tempi, mentre la banda aggregata divide tutti i byte consegnati per tale durata. FIFO significa che una coda serve per primo il pacchetto arrivato per primo. Su una sola uscita, l’attesa somma le durate dei pacchetti precedenti e la latenza aggiunge il tempo della propria trasmissione. Un B/µs equivale a un MB/s decimale.',
    variante('Due estremi full-duplex inviano simultaneamente 1200 B in ciascuna direzione. Ciascuna direzione trasferisce 100 B/µs e le latenze fisse sono trascurabili. Calcola la durata fino a entrambe le consegne e la banda aggregata.',
      [numero('Durata (µs)',12,'I due versi hanno risorse indipendenti.'),numero('Banda aggregata (MB/s)',200,'Somma i byte nelle due direzioni e dividi per il tempo trascorso.')],
      ['Per ciascun verso la durata vale 1200 / 100 = 12 µs.','Le due trasmissioni si sovrappongono, quindi l’ultima termina dopo 12 µs.','I due estremi scambiano 2400 B in 12 µs, pari a 200 MB/s complessivi.']),
    variante('Una richiesta trova tre pacchetti completi di 160 B davanti a sé su un’uscita FIFO da 40 B/µs. La sua lunghezza è 80 B. Trascurando propagazione e overhead, determina attesa e latenza dal suo arrivo al termine dell’invio.',
      [numero('Attesa (µs)',12,'La coda comprende soltanto i tre pacchetti davanti.'),numero('Latenza (µs)',14,'Alla coda aggiungi la serializzazione del proprio pacchetto.')],
      ['Ogni pacchetto precedente occupa 160 / 40 = 4 µs.','I tre pacchetti causano 3 × 4 = 12 µs di attesa.','La richiesta occupa 80 / 40 = 2 µs e termina dopo 12 + 2 = 14 µs.']));

  prova(5,1,1,'Contare settori e capacità nella geometria ideale',
    'Una superficie attiva è una faccia del disco sulla quale si conservano dati. Una traccia è un percorso circolare su tale superficie; un settore è una sua porzione che contiene un numero fissato di byte. Nella geometria ideale, un cilindro raccoglie una traccia per ogni superficie attiva alla medesima posizione radiale. La capacità è superfici × cilindri × settori per traccia × byte per settore. La stessa relazione permette di ricavare un fattore sconosciuto dividendo la capacità per il prodotto degli altri. Se N settori sono numerati da zero, l’ultimo indice è N − 1.',
    variante(
      "Un disco ideale ha 4 superfici attive, 200 cilindri, 32 settori per traccia su ciascuna superficie e 512 B per settore. Calcola i byte per cilindro e la capacità totale in byte.",
      [
        numero("Byte per cilindro", 65536, "Un cilindro comprende una traccia per ogni superficie."),
        numero("Capacità (B)", 13107200, "Moltiplica per il numero dei cilindri.")
      ],
      [
        "Una traccia contiene 32 × 512 = 16384 B.",
        "Un cilindro comprende 4 tracce per 65536 B.",
        "I 200 cilindri forniscono 200 × 65536 = 13107200 byte."
      ]),
    variante(
      "Per un disco ideale il manuale indica 128 cilindri, 16 settori per traccia e 1024 B per settore. L’unità dichiara una capacità di 4 MiB, con 1 MiB = 1 048 576 B. Una scheda tecnica le attribuisce quattro superfici attive. Ricava il numero di superfici compatibile con la capacità dichiarata e l’ultimo indice logico di settore, numerando da zero.",
      [
        numero("Superfici compatibili", 2, "Calcola i byte che una sola superficie rende disponibili sui 128 cilindri."),
        numero("Ultimo indice logico di settore", 4095, "Dividi la capacità del disco per la dimensione del settore e tieni conto dell’indice iniziale.")
      ],
      [
        "Una superficie contiene 128 × 16 = 2048 settori. Con 1024 B per settore fornisce 2 097 152 B, cioè 2 MiB.",
        "La capacità dichiarata di 4 MiB richiede due superfici. L’indicazione di quattro superfici implicherebbe 8 MiB a parità di geometria.",
        "I settori dell’intero disco sono 4 194 304 / 1024 = 4096. Numerandoli da zero si arriva all’indice 4095."
      ]));

  prova(5,2,1,'Stimare la latenza media del disco',
    'Il seek è lo spostamento della testina fino alla traccia; l’attesa rotazionale è il tempo che serve al settore per passarle sotto. Un minuto contiene 60000 millisecondi: con r giri/minuto, il periodo di un giro è 60000 / r ms. Se tutte le posizioni angolari dopo il seek sono equiprobabili, l’attesa media è mezzo periodo. Per una richiesta particolare può invece assumere qualsiasi valore da zero a quasi un periodo. Il tempo di servizio, al netto delle code, somma seek, attesa rotazionale e trasferimento. Sottraendo le altre componenti da una media osservata si ricava l’attesa media e quindi il periodo.',
    variante(
      "Un disco gira a 6000 giri/min. La fase dopo il seek è uniforme su un giro. Il seek medio richiede 4 ms e il trasferimento 1 ms. Calcola attesa rotazionale media e tempo medio di servizio al netto delle code.",
      [
        numero("Attesa rotazionale media (ms)", 5, "Con fase uniforme attendi in media mezzo giro."),
        numero("Tempo medio di servizio (ms)", 10, "Somma seek, attesa angolare e trasferimento.")
      ],
      [
        "Un giro impiega 60 000 / 6000 = 10 ms.",
        "L’attesa media equivale a mezzo giro, dunque 5 ms.",
        "Il servizio completo dura in media 4 + 5 + 1 = 10 ms."
      ]),
    variante(
      "Una serie di letture senza coda impiega in media 10 ms per richiesta. In ogni lettura il seek dura 5 ms e il trasferimento 2 ms. Dopo il seek le posizioni angolari sono distribuite uniformemente su un giro. Deduci la velocità di rotazione; poi giudica se un singolo servizio di 12 ms sia compatibile con questo modello.",
      [
        numero("Velocità (giri/min)", 10000, "Isola l’attesa media dal tempo totale e raddoppiala per ricostruire il periodo."),
        opzione("Singolo servizio di 12 ms", "Compatibile", ["Compatibile","Incompatibile"], "Confronta l’attesa di quel singolo settore con la durata di un giro intero.")
      ],
      [
        "Tolti seek e trasferimento, l’attesa media vale 10 − 5 − 2 = 3 ms. Poiché la fase è uniforme, quei 3 ms equivalgono a mezzo giro.",
        "Un giro richiede dunque 6 ms. In un minuto da 60 000 ms si compiono 60 000 / 6 = 10 000 giri.",
        "Per una singola lettura da 12 ms, l’attesa angolare sarebbe 12 − 5 − 2 = 5 ms. Il settore può trovarsi a quella distanza, perché un giro intero dura 6 ms."
      ]));

  prova(5,3,2,'Passare da offset a blocco logico',
    'L’offset è la distanza in byte dall’inizio dello spazio considerato. Dividendo l’offset per la dimensione del blocco, il quoziente intero individua l’indice del blocco e il resto la posizione interna; gli indici partono da zero. LBA indica il numero di un blocco logico. Per allocare un file si assegnano blocchi interi, arrotondando verso l’alto il rapporto fra lunghezza e dimensione del blocco. La capacità assegnata meno la lunghezza corrente misura quanti byte possono ancora essere aggiunti negli stessi blocchi. Il primo byte che richiede un nuovo blocco ha offset uguale alla capacità già assegnata.',
    variante(
      "I blocchi logici misurano 512 B e iniziano da LBA 0. Il byte richiesto ha offset assoluto 2600. Trova il LBA e lo scostamento interno.",
      [
        numero("LBA", 5, "Usa il quoziente intero."),
        numero("Scostamento (B)", 40, "Calcola il resto della divisione.")
      ],
      [
        "Cinque blocchi completi occupano 5 × 512 = 2560 B.",
        "Il byte 2600 appartiene al sesto blocco, identificato da LBA 5.",
        "Lo scostamento vale 2600 − 2560 = 40 B. La ricomposizione dà 5 × 512 + 40 = 2600."
      ]),
    variante(
      "Un file di 8128 B occupa due blocchi dati da 4096 B. Il volume è pieno e l’unico spazio ancora utilizzabile per questo file è la coda del suo secondo blocco. A partire dalla fine del file, quanti byte si possono aggiungere prima di dover allocare un altro blocco? Quale blocco logico del file, numerato da zero, richiederebbe il byte subito successivo?",
      [
        numero("Byte ancora aggiungibili", 64, "Confronta la capacità già assegnata con la lunghezza del file."),
        numero("Indice del primo blocco ancora da allocare", 2, "Conta da zero i due blocchi già assegnati e individua il loro successore.")
      ],
      [
        "Il file dispone di 2 × 4096 = 8192 B di spazio assegnato. Il suo ultimo byte attuale si trova all’offset 8127.",
        "Gli offset da 8128 a 8191 inclusi sono ancora disponibili nel secondo blocco. Possono quindi accogliere 8192 − 8128 = 64 B.",
        "Il byte successivo avrebbe offset 8192, ossia 2 × 4096 + 0. Richiederebbe il blocco logico 2 del file, dopo i blocchi 0 e 1 già assegnati."
      ]));

  prova(5,4,2,'Calcolare tempo di trasferimento e risposta',
    'La durata della copia è il rapporto tra lunghezza e banda. Il tempo di risposta comprende anche la coda e il posizionamento. Prima di sommare occorre esprimere tutti i termini nella stessa unità.',
    variante(
      "Una richiesta di 1,2 MB decimali viene servita a 150 MB/s. Attende 3 ms in coda e paga 5 ms di posizionamento complessivo. Calcola trasferimento e tempo di risposta in millisecondi.",
      [
        numero("Trasferimento (ms)", 8, "Il quoziente MB diviso MB/s ha unità secondi."),
        numero("Risposta (ms)", 16, "Conta il tempo dall’arrivo in coda al completamento.")
      ],
      [
        "La durata del trasferimento vale 1,2 / 150 = 0,008 s.",
        "Moltiplicando per 1000 si ottengono 8 ms di trasferimento.",
        "La risposta dura 3 + 5 + 8 = 16 ms, includendo la coda."
      ]),
    variante(
      "Una richiesta di 0,9 MB decimali arriva al tempo zero. Resta in coda 7 ms, poi il posizionamento richiede 2 ms e la copia avviene a 75 MB/s. Il servizio deve finire entro 14 ms dall’arrivo. Valuta due interventi alternativi: azzerare la coda mantenendo la banda, oppure raddoppiare la banda mantenendo la coda. Indica l’intervento sufficiente e il tempo totale con la sola banda raddoppiata.",
      [
        opzione("Intervento sufficiente", "Azzerare la coda", ["Azzerare la coda","Raddoppiare la banda","Entrambi separatamente"], "Costruisci una cronologia per ciascun intervento e conserva i tempi delle altre due fasi."),
        numero("Risposta con banda raddoppiata (ms)", 15, "Porta la banda a 150 MB/s, converti il tempo di copia in millisecondi e conserva le altre due fasi.")
      ],
      [
        "Alla velocità iniziale la copia dura 0,9 / 75 s = 12 ms. Con la coda azzerata rimangono 2 + 12 = 14 ms, quindi si rispetta la scadenza.",
        "Con la sola banda raddoppiata la copia scende a 0,9 / 150 s = 6 ms. La richiesta paga ancora 7 ms di coda e 2 ms di posizionamento.",
        "Il secondo intervento porta la risposta a 7 + 2 + 6 = 15 ms. Rispetto alla scadenza manca un millisecondo e soltanto il primo intervento è sufficiente."
      ]));

  prova(5,5,3,'Calcolare gli spostamenti della testina',
    'FCFS conserva l’ordine di arrivo, mentre SSTF sceglie la richiesta più vicina alla posizione attuale della testina. Il cammino totale somma la lunghezza di ogni spostamento.',
    variante('La testina è al cilindro 45. Sono già in coda 75, 15, 60 in questo ordine. Con FCFS e rotazione trascurata calcola cammino totale in cilindri e cilindro finale.',
      [numero('Cammino totale',135,'Somma le distanze assolute fra posizioni consecutive.'),numero('Cilindro finale',60,'FCFS conserva l’ordine di arrivo.')],
      ['Il primo tratto 45 → 75 percorre 30 cilindri.','Il secondo tratto 75 → 15 percorre 60 cilindri e il terzo 15 → 60 ne percorre 45.','Il totale vale 30 + 60 + 45 = 135 cilindri e la testina termina a 60.']),
    variante('La testina è al cilindro 45 e sono già in attesa 75, 15, 60. Con SSTF si sceglie la richiesta più vicina dopo ogni movimento. Indica primo cilindro servito e cammino totale.',
      [numero('Primo cilindro',60,'Confronta le distanze misurate da 45.'),numero('Cammino totale',90,'Dopo ogni spostamento ricalcola le distanze residue.')],
      ['Da 45 le distanze verso 75, 15 e 60 sono 30, 30 e 15 cilindri, quindi si serve 60.','Da 60 si raggiunge 75 in 15 cilindri, poi da 75 si raggiunge 15 in altri 60.','Il cammino è 15 + 15 + 60 = 90 cilindri. La distanza media per richiesta è 30.']));

  prova(6,1,1,'Separare continuità di servizio e disponibilità',
    'L’affidabilità di missione riguarda un intero intervallo senza guasti. La disponibilità si stima come frazione del tempo di servizio oppure, a un dato istante, come frazione dei sistemi in funzione, inclusi quelli riparati.',
    variante('Un servizio ha cicli ripetuti con tempo medio operativo di 990 h e tempo medio di ripristino di 10 h. Quale percentuale di tempo risulta disponibile, e quale indisponibile, nel lungo periodo?',
      [numero('Disponibilità (%)',99,'Dividi le ore operative per la durata media del ciclo.'),numero('Indisponibilità (%)',1,'Usa le ore di ripristino al numeratore.')],
      ['Il ciclo medio dura 990 + 10 = 1000 h.','La frazione disponibile è 990 / 1000 = 0,99, pari al 99%.','La quota restante è 10 / 1000 = 0,01, pari all’1%.']),
    variante('In cento repliche indipendenti di una missione, 96 sistemi portano a termine l’intero intervallo senza guasti. Tre dei quattro restanti vengono riparati prima della fine e il quarto resta fuori servizio. Stima affidabilità di missione e quota disponibile all’istante finale, in percentuale.',
      [numero('Affidabilità empirica (%)',96,'Conta i sistemi rimasti operativi per tutto l’intervallo.'),numero('Disponibilità finale empirica (%)',99,'Conta i sistemi in servizio nell’ultimo istante.')],
      ['Le missioni concluse senza guasti sono 96 su 100 e danno una stima dell’affidabilità pari al 96%.','All’istante finale risultano funzionanti i 96 sistemi integri e i tre riparati.','La disponibilità osservata alla fine è (96 + 3) / 100 = 99%.']));
  prova(6,2,1,'Distribuire i chunk in RAID 0',
    'RAID 0 distribuisce i dati su più dischi attraverso gruppi di blocchi chiamati chunk. Con n dischi e chunk da c blocchi, per il blocco logico LBA l si divide l per c: il quoziente intero q è l’indice del chunk e il resto è lo scostamento interno. Il disco è il resto della divisione q per n; i giri completi sono il quoziente intero della stessa divisione. L’indice locale è giri × c + scostamento. Nel verso inverso, dalla riga locale g e dal disco d si ottiene il primo LBA del chunk come (g × n + d) × c. Il simbolo ⌊x⌋ prende la parte intera inferiore e mod indica il resto della divisione. Tutte le numerazioni partono da zero.',
    variante(
      "RAID 0 su 3 dischi numerati da zero. I chunk consecutivi da 4 blocchi si distribuiscono a turno partendo dal disco 0. Per LBA 19 trova il disco e l’indice del blocco su quel disco.",
      [
        numero("Disco", 1, "Calcola il numero del chunk e il resto modulo il numero di dischi."),
        numero("Indice locale", 7, "Combina i giri completi di striping e l’offset nel chunk.")
      ],
      [
        "Il chunk ha indice ⌊19 / 4⌋ = 4 e lo scostamento interno è 3.",
        "Il numero di disco vale 4 mod 3 = 1.",
        "Dividendo l’indice del chunk per il numero di dischi si ottiene un quoziente intero di 1. L’indice locale è 1 × 4 + 3 = 7. Il volume distribuisce i dati senza ridondanza."
      ]),
    variante(
      "Un volume RAID 0 distribuisce a turno chunk di due blocchi su quattro dischi numerati 0, 1, 2, 3, a partire dal disco 0. Il controllo sul disco 1 localizza un chunk danneggiato ai blocchi locali 6 e 7. Individua il primo e l’ultimo LBA logico di quel chunk, contando da zero anche sul volume.",
      [
        numero("Primo LBA coinvolto", 26, "Dal primo indice locale risali alla riga. Ogni riga del volume comprende un chunk per ciascuno dei quattro dischi."),
        numero("Ultimo LBA coinvolto", 27, "Il chunk copre due blocchi contigui nella numerazione logica.")
      ],
      [
        "Sul disco 1 i blocchi locali 6 e 7 costituiscono il chunk di riga ⌊6 / 2⌋ = 3. Le tre righe precedenti occupano 3 × 4 × 2 = 24 blocchi logici.",
        "Nella riga 3 il disco 0 riceve i primi due blocchi, 24 e 25. I due blocchi assegnati al disco 1 sono pertanto 26 e 27.",
        "La verifica diretta dà ⌊26 / 2⌋ = ⌊27 / 2⌋ = 13 e 13 mod 4 = 1. Gli scostamenti 0 e 1 del chunk ritrovano le posizioni locali 6 e 7."
      ]));

  prova(6,3,1,'Leggere e ricostruire una coppia speculare',
    'In uno specchio RAID 1 ciascun membro conserva una copia completa degli stessi blocchi. La capacità logica è quindi quella di una copia, mentre la capacità grezza somma i membri. Dopo un guasto si può leggere dal superstite; ricostruire la seconda copia richiede di trasferirne i dati al sostituto. Con velocità effettiva costante, il tempo di ricostruzione è quantità da copiare divisa per velocità. Nelle unità decimali 1 GB contiene 1000 MB, quindi le due grandezze vanno espresse con lo stesso multiplo prima della divisione. Al termine riuscito si ritrovano due copie complete.',
    variante('Due dischi da 4 TB formano un RAID 1 a specchio completo. Un disco si guasta. Calcola la capacità logica iniziale e il numero di copie leggibili di ciascun blocco subito dopo il guasto.',
      [numero('Capacità logica (TB)',4,'Entrambi i membri conservano gli stessi blocchi.'),numero('Copie ancora leggibili',1,'Sottrai il membro perso dalle copie iniziali.')],
      ['Ogni blocco logico ha due copie su due membri distinti.','La capacità utile corrisponde a quella di un membro, 4 TB.','Il primo guasto lascia una copia leggibile per blocco. La coppia resta degradata fino alla ricostruzione.']),
    variante('Un RAID 1 deve ricopiare 900 GB decimali dal membro superstite al sostituto. La velocità effettiva della ricostruzione è costante a 100 MB/s. Calcola durata in secondi e numero di copie complete dopo il successo.',
      [numero('Durata (s)',9000,'Converti i GB in MB decimali.'),numero('Copie complete finali',2,'Conta il membro superstite e quello ricostruito.')],
      ['900 GB corrispondono a 900 000 MB.','Il tempo di ricostruzione è 900 000 / 100 = 9000 s, ossia 2,5 h.','Al termine ogni blocco è presente sul superstite e sul nuovo membro, per un totale di due copie.']));
  prova(6,4,2,'Calcolare capacità utile e parità',
    'In RAID 5 la parità distribuita fra le strisce occupa la capacità equivalente a un membro: con n dischi uguali da C si ottiene (n − 1) × C di dati. RAID 10 distribuisce i dati fra coppie a specchio e ogni coppia offre la capacità di un membro. In una striscia, cioè un gruppo di blocchi distribuito fra i dischi, la parità XOR confronta i bit nella medesima posizione: scrive uno quando sono diversi e zero quando coincidono. P = A XOR B permette di aggiornare P sostituendo il contributo vecchio del dato con quello nuovo. Il prefisso 0x indica la base sedici, con cifre A–F pari a dieci–quindici; ogni cifra esadecimale rappresenta quattro bit.',
    variante('Sei dischi identici da 2 TB ciascuno formano a scelta un RAID 5 o un RAID 10 con tre coppie. Calcola le due capacità logiche ignorando metadati e dischi di riserva.',
      [numero('RAID 5 (TB)',10,'L’equivalente di un membro è dedicato alla parità.'),numero('RAID 10 (TB)',6,'Ogni coppia fornisce la capacità di un solo membro.')],
      ['Lo spazio fisico totale è 6 × 2 = 12 TB.','RAID 5 fornisce (6 − 1) × 2 = 10 TB di dati.','RAID 10 fornisce tre coppie da 2 TB utili ciascuna, ossia 6 TB.']),
    variante('Una stripe RAID 5 a tre membri contiene A = 0x5A, B = 0xCC e P = A XOR B. Calcola P. Il driver sostituisce B con 0x0F e completa l’aggiornamento. Calcola la parità aggiornata.',
      [numero('P iniziale',0x96,'Esegui lo XOR bit per bit.'),numero('P finale',0x55,'Puoi usare A XOR B nuovo oppure P vecchia XOR B vecchio XOR B nuovo.')],
      ['Scriviamo i byte in binario: 0x5A = 01011010 e 0xCC = 11001100. XOR produce uno nelle colonne diverse; si ottiene 10010110 = 0x96. In decimale la parità iniziale vale 9 × 16 + 6 = 150.','Il nuovo B è 0x0F = 00001111. Confrontandolo con A = 01011010, la nuova parità è 01010101 = 0x55, pari a 5 × 16 + 5 = 85 in decimale.','Per verificare il risultato si ricostruisce B nuovo: 01011010 XOR 01010101 = 00001111 = 0x0F. La parità aggiornata è quindi coerente con il dato che il driver ha scritto.']));
  prova(6,5,3,'Seguire una riscrittura nella flash',
    'Nella flash NAND i bit sono organizzati in pagine, mentre la cancellazione coinvolge blocchi più grandi che comprendono diverse pagine. Il controller, il circuito che governa il dispositivo, aggiorna un dato programmando una pagina libera e modificando la mappa fra il nome logico e la posizione fisica. La copia precedente diventa invalida. Per cancellare un blocco deve prima trasferire altrove le sue pagine ancora valide, dette vive. L’host è il computer che richiede la nuova scrittura; l’amplificazione è pagine programmate fisicamente, comprese le copie interne, diviso pagine richieste dall’host.',
    variante('La pagina logica L7 è mappata su P12. Il controller la aggiorna programmando P21, poi pubblica la nuova mappa. Da quale pagina fisica legge la prossima richiesta e quale unità dovrà essere cancellata per recuperare P12?',
      [numero('Numero della pagina letta',21,'Segui la mappa logica aggiornata.'),opzione('Unità di cancellazione','Blocco di cancellazione',['Singolo byte','Pagina logica','Blocco di cancellazione'],'L’unità di cancellazione della NAND comprende più pagine.')],
      ['L’aggiornamento fuori posto prepara i dati su P21.','La nuova mappa L7 → P21 porta la lettura successiva a P21 e rende P12 invalida.','Per riutilizzare P12 si migrano le pagine valide del blocco vittima e si cancella l’intero blocco.']),
    variante('Il recupero di un blocco copia cinque pagine valide, quindi un aggiornamento host programma una nuova pagina. Considera solo queste operazioni. Quante pagine vengono programmate fisicamente e a quanto ammonta l’amplificazione di scrittura?',
      [numero('Programmazioni fisiche',6,'Includi la migrazione e la nuova scrittura.'),numero('Amplificazione',6,'Il denominatore conta le pagine scritte dall’host.')],
      ['Il controller compie cinque programmazioni interne per migrare le cinque pagine valide.','La scrittura host aggiunge una sesta programmazione.','Il rapporto fra programmazioni fisiche e scritture host vale (5 + 1) / 1 = 6. L’ulteriore cancellazione incide sull’usura del blocco.']));

  prova(7,1,1,'Riconoscere l’interfaccia del dispositivo',
    'L’interfaccia di un dispositivo specifica le operazioni disponibili al programma. Un dispositivo a caratteri può fornire un flusso di byte consumati nell’ordine di arrivo; nel contratto della porta seriale descritta si legge il prossimo byte disponibile. Un dispositivo a blocchi espone invece blocchi numerati raggiungibili per indice, anche in un ordine scelto dal richiedente. Con numerazione da zero, l’offset, cioè la distanza in byte dall’inizio, vale indice × dimensione del blocco. Il buffer è la regione di memoria che contiene i dati ricevuti o da inviare.',
    variante('Una porta seriale fornisce i byte in ordine di arrivo e consuma ciascun byte alla lettura. L’interfaccia espone soltanto il prossimo byte disponibile. Indica la classe e l’operazione consentita.',
      [opzione('Classe','A caratteri',['A blocchi','A caratteri'],'Osserva il significato di una lettura.'),opzione('Operazione','Leggi il prossimo byte',['Leggi il prossimo byte','Seleziona il settore 18','Rileggi il byte con LBA 99'],'Considera quale posizione identifica l’interfaccia.')],
      ['Il canale presenta un flusso ordinato di byte.','L’assenza di un indice LBA nel contratto del flusso porta a classificarlo come dispositivo a caratteri.','Il driver legge il prossimo byte disponibile e lo consegna al consumatore.']),
    variante('Un dispositivo espone blocchi logici da 4096 B indirizzabili indipendentemente. L’applicazione richiede prima il blocco 80 e poi il blocco 2. Individua la classe e l’offset iniziale del secondo blocco richiesto.',
      [opzione('Classe','A blocchi',['A caratteri','A blocchi'],'L’indirizzo della richiesta specifica il blocco da leggere.'),numero('Offset del blocco 2 (B)',8192,'I numeri di blocco partono da zero.')],
      ['Il dispositivo consente letture per indice in un insieme di blocchi di dimensione fissa.','La classe è a blocchi e l’ordine 80, 2 è ammesso.','L’offset del blocco 2 è 2 × 4096 = 8192 B.']));
  prova(7,2,3,'Assegnare e recuperare una richiesta del driver',
    'Il driver è il programma del sistema operativo che governa il dispositivo. Una richiesta DMA descrive un trasferimento diretto tra periferica e memoria; il suo descrittore contiene indirizzo, lunghezza e informazioni di controllo. L’anello riunisce posti riutilizzabili, detti slot, ciascuno capace di un descrittore. Pubblicare la richiesta significa renderla disponibile al dispositivo e cedergli lo slot. Prima di riutilizzarlo il driver osserva il completamento e ne interpreta lo stato: se il dispositivo segnala un errore, il driver deve propagarne l’esito al richiedente. Il buffer è la regione di memoria dei dati e viene recuperato secondo il protocollo di completamento.',
    variante('Un anello vuoto ha quattro descrittori. Arrivano sei richieste da un descrittore ciascuna. Dopo la pubblicazione del massimo numero possibile di richieste, il dispositivo completa due richieste e il driver ne recupera gli slot. Calcola la coda inizialmente rinviata e il numero di slot liberi prima di una seconda pubblicazione.',
      [numero('Richieste rinviate',2,'Confronta richieste e capacità.'),numero('Slot liberi dopo il recupero',2,'Uno slot pubblicato torna libero al recupero del completamento.')],
      ['Il driver prepara quattro descrittori per le prime quattro richieste.','Le richieste rinviate sono 6 − 4 = 2.','Due completamenti rilasciano due slot, sufficienti a una successiva pubblicazione delle due richieste rimaste.']),
    variante('Un driver riceve una richiesta di lettura a blocchi. Ha preparato indirizzo DMA e lunghezza. Il dispositivo restituisce un completamento con stato di errore. Chi interpreta tale stato e quale esito deve raggiungere il richiedente?',
      [opzione('Responsabile','Driver',['Applicazione sul registro fisico','Driver','Arbitro del bus'],'L’implementazione dell’interfaccia conosce il formato del dispositivo.'),opzione('Esito','Errore di I/O',['Lettura riuscita','Errore di I/O','Trasferimento completo implicito'],'Considera il campo di stato prima di dichiarare i dati disponibili.')],
      ['Il dispositivo scrive il suo stato di completamento.','Il driver recupera il descrittore e interpreta il codice secondo il protocollo.','In questo caso propaga un errore di I/O nella richiesta e gestisce il rilascio del buffer secondo il contratto.']));
  prova(7,3,2,'Configurare indirizzo e direzione DMA',
    'Il buffer è la regione di memoria destinata al trasferimento DMA, l’accesso diretto del dispositivo alla memoria. L’API DMA è l’insieme di funzioni che prepara la mappatura e restituisce un indirizzo valido per quel dispositivo; tale indirizzo va nel descrittore, insieme alla lunghezza. In ricezione la periferica scrive nella memoria principale, la RAM; in trasmissione legge dal buffer. Il bus master è il componente che avvia queste operazioni sul collegamento. Per n byte contigui dalla base b, l’ultimo indirizzo incluso è b + n − 1. Il numero di richieste si trova dividendo la lunghezza per il massimo per transazione e aggiungendo una richiesta se resta un residuo.',
    variante('Una scheda di rete riceve un pacchetto di 96 B. La CPU vede il buffer a 0x9800 e l’API DMA restituisce 0x2800. Indica l’indirizzo da mettere nel descrittore e il tipo di operazione che la scheda emette sulla memoria.',
      [numero('Indirizzo per il dispositivo',0x2800,'Usa il valore restituito dal mapping per quel dispositivo.'),opzione('Operazione in RAM','Scrittura',['Lettura','Scrittura'],'Segui il pacchetto dalla rete verso il buffer.')],
      ['Il buffer è destinazione di un trasferimento dal dispositivo verso la memoria.','Il driver inserisce indirizzo DMA 0x2800 e lunghezza 96 nel descrittore.','La scheda agisce da iniziatore e scrive i byte nel buffer. Il completamento permette al driver di riacquisirlo.']),
    variante('Per trasmettere, un dispositivo legge 48 B da una regione DMA contigua a partire da 0x3020. Il master raggruppa i byte in richieste contigue da 16 B. Indica numero di richieste e ultimo indirizzo di byte letto.',
      [numero('Richieste',3,'Dividi la lunghezza per la capacità per richiesta.'),numero('Ultimo byte letto',0x304f,'Il primo byte occupa già la posizione zero dell’intervallo.')],
      ['Il descrittore specifica la direzione memoria → dispositivo e 48 B di dati.','Il bus master emette 48 / 16 = 3 letture da 16 B.','L’ultimo byte è 0x3020 + 48 − 1 = 0x304F. Il completamento segnala la fine dell’uso del buffer secondo il protocollo.']));
  prova(7,4,1,'Distinguere il tempo della periferica dai cicli CPU',
    'Con il DMA, accesso diretto alla memoria, la CPU prepara il trasferimento e il dispositivo sposta i dati. Il driver è il codice che controlla la periferica e serve la notifica finale. La durata della copia è byte divisi per velocità; il lavoro della CPU comprende preparazione e servizio. Fasi seriali si sommano, mentre un calcolo indipendente può sovrapporsi alla copia. Se il core, l’unità esecutiva della CPU, tiene mascherata la notifica, la richiesta di interruzione resta pendente fino alla riabilitazione: l’attesa è l’istante di riabilitazione meno quello della notifica già arrivata. Per ciascuna attività si ricavano prima inizio e fine sulla stessa scala temporale.',
    variante(
      "Un DMA trasferisce 6400 B a 200 MB/s decimali. L’avvio occupa la CPU per 3 µs e un solo completamento per altri 2 µs. Assumi fasi seriali, senza altre attese. Calcola impegno CPU e tempo totale.",
      [
        numero("CPU occupata (µs)", 5, "Somma avvio e servizio finale."),
        numero("Tempo totale (µs)", 37, "Aggiungi il tempo della copia autonoma.")
      ],
      [
        "Il collegamento trasporta 200 B/µs e la copia dura 6400 / 200 = 32 µs.",
        "La CPU lavora per 3 + 2 = 5 µs.",
        "Il trasferimento termina a 3 + 32 = 35 µs. Il servizio dell’unico completamento termina a 35 + 2 = 37 µs."
      ]),
    variante(
      "Al tempo zero un core inizia la preparazione di un DMA, che richiede 8 µs di CPU. L’hardware trasferisce quindi 128 B a 4 B/µs. All’inizio del trasferimento il core avvia un calcolo indipendente di 40 µs, indivisibile e con la notifica mascherata fino al termine. Il dispositivo segnala il completamento appena consegna l’ultimo byte. Riabilitata la notifica, il driver impiega 4 µs per gestirla. Quanto attende la notifica già pendente e a quale istante finisce il lavoro del driver?",
      [
        numero("Attesa della notifica pendente (µs)", 8, "Confronta l’istante dell’ultimo byte con la fine del calcolo avviato dal core."),
        numero("Fine del servizio del driver (µs)", 52, "Aggiungi il costo del servizio al primo istante in cui il core può accettare la notifica.")
      ],
      [
        "La preparazione occupa il core fino a 8 µs. A quell’istante cominciano sia il DMA sia il calcolo indipendente.",
        "Il DMA richiede 128 / 4 = 32 µs e segnala il completamento a 8 + 32 = 40 µs. Il calcolo del core termina a 8 + 40 = 48 µs. La notifica rimane quindi pendente per 48 − 40 = 8 µs.",
        "Il driver serve la notifica dall’istante 48 all’istante 52 µs. I 32 µs di trasferimento erano già compresi nell’intervallo del calcolo indipendente."
      ]));

  prova(7,5,5,'Confrontare costo fisso e completamento effettivo',
    'Nell’I/O programmato il processore interviene per ogni parola di dati; se il costo è c cicli per parola, n parole richiedono c × n cicli. Il DMA, accesso diretto del dispositivo alla memoria, ha qui un costo CPU fisso F: il pareggio soddisfa c × n = F e il primo risparmio richiede il primo intero n con c × n > F. Nel completamento di una lettura, il driver è il programma che controlla il dispositivo e risveglia il thread, la sequenza di istruzioni in attesa. Il thread diventa pronto; lo scheduler sceglie quando assegnargli un core, l’unità esecutiva del processore. Ultimo byte, notifica, risveglio e ripresa sono perciò istanti distinti.',
    variante('Per una copia l’I/O programmato impiega 8 cicli CPU per parola e il DMA richiede 40 cicli CPU complessivi e nessun costo CPU per parola. Trova la taglia di pareggio e la prima taglia intera in cui il DMA risparmia cicli.',
      [numero('Pareggio (parole)',5,'Risolvi 8 × parole = 40.'),numero('Primo risparmio (parole)',6,'Trova la prima taglia per cui il costo programmato supera il costo fisso.')],
      ['Il costo programmato è 8n cicli e il costo DMA è 40 cicli.','L’uguaglianza 8n = 40 dà n = 5 parole.','A 6 parole il costo programmato sale a 48 cicli, superiore di 8 al DMA.']),
    variante('I registri di una lettura DMA provengono da tre componenti. Lo scheduler assegna il core 6 µs dopo il risveglio del thread. Il dispositivo consegna l’ultimo byte a t = 18 µs. Il driver riceve la notifica a t = 21 µs e impiega 4 µs prima di risvegliare il thread. Ordina gli eventi, poi determina l’istante di risveglio e il tempo trascorso dall’ultimo byte alla ripresa.',
      [ordina('Cronologia',['Ultimo byte','Notifica','Risveglio','Ripresa sul core'],'Distingui il completamento del dispositivo, il servizio del driver e l’assegnazione del processore.'),
       numero('Istante del risveglio (µs)',25,'Aggiungi il costo del driver all’istante di notifica.'),
       numero('Dall’ultimo byte alla ripresa (µs)',13,'Sottrai l’istante del dato completo dall’istante di esecuzione.')],
      ['Il dispositivo termina a 18 µs e il driver riceve la notifica a 21 µs. I due segnali distano 21 − 18 = 3 µs.',
       'Solo dopo il servizio del driver il thread dispone dei dati. Il risveglio avviene a 21 + 4 = 25 µs.',
       'Il thread pronto riottiene il core a 25 + 6 = 31 µs. La sequenza va quindi dall’ultimo byte alla notifica, al risveglio e alla ripresa. Fra il primo e l’ultimo evento trascorrono 31 − 18 = 13 µs.']));
})();
