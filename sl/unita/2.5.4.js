'use strict';
SL.registra('2.5.4', {
  titolo: 'Mappature e sostituzione dell’immagine di processo',
  obiettivo: 'Obiettivo: indicare ciò che cambia e ciò che resta quando un processo chiama execve, sia nel caso di esito positivo sia in caso di errore.',
  concetti: [['memory', 'Mappature e pagine'], ['process', 'L’immagine di un processo'], ['fork', 'Lo stesso processo, un altro programma']],
  filigrana: ['process', 'memory', 'fork'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 1.1.5', t: 'Processo e PID', d: 'Un processo è un programma in esecuzione. Il PID lo identifica per tutta la sua esistenza. La shell avvia ogni comando in un processo figlio.' },
      { sim: 'file', da: 'Dall’unità 1.1.3', t: 'File eseguibile', d: 'Il file che contiene il codice macchina completo di un programma, pronto per il caricamento in memoria.' },
      { sim: 'scudo', da: 'Dall’unità 2.5.2', t: 'Gli errori del kernel', d: 'Un valore restituito fra −4095 e −1 indica un errore. Il valore assoluto è il codice: 2 indica un file inesistente.' }
    ],
    domanda: { d: 'Prima di proseguire: che cosa identifica un processo per tutta la sua esistenza?', o: [
      { t: 'Il PID', ok: true, fb: 'Il kernel assegna il PID alla creazione del processo e lo conserva finché il processo esiste.' },
      { t: 'Il nome del programma che esegue', fb: 'Del medesimo programma possono esistere più processi contemporaneamente. Il nome è il medesimo, i PID sono diversi.' },
      { t: 'L’indirizzo a cui si trova il suo codice', fb: 'Processi diversi impiegano spesso i medesimi indirizzi, ciascuno nella propria memoria. Li distingue il PID.' }
    ] }
  },
  idea: {
    titolo: 'Un nuovo programma nel medesimo processo',
    termini: ['mappatura', 'pagina', 'immagine di processo', 'execve'],
    testo: [
      'Un processo possiede un insieme di zone di memoria: una con il codice, una con i dati, una di lavoro denominata pila, altre richieste durante l’esecuzione. Ciascuna zona è una [[mappatura]]: un intervallo di indirizzi al quale il kernel ha associato memoria, con i relativi permessi di impiego. L’insieme delle mappature, con il contenuto dei registri, forma l’[[immagine di processo|immagine]] del processo.',
      'Il kernel assegna la memoria a blocchi di 4096 byte, e ogni blocco prende il nome di [[pagina]]. Un programma richiede nuove mappature con il servizio numero 9, il medesimo dell’unità 2.5.2. Una zona ottenuta in tal modo, senza un file che ne fornisca il contenuto, è inizialmente piena di zeri e si dice anonima.',
      'Il servizio [[execve]], numero 59, compie l’operazione più radicale: sostituisce l’intera immagine con quella di un altro programma, letto da un file eseguibile. Il kernel elimina tutte le mappature precedenti, comprese quelle richieste durante l’esecuzione. Ne crea di nuove, vi carica il codice e i dati del nuovo programma, prepara una nuova pila e fa ripartire il processore dalla prima istruzione del nuovo programma.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Il processo 417 prima e dopo una execve riuscita', nota: 'Cambiano le mappature e il programma. Restano il PID e i descrittori aperti.', els: [
        SL.el.zona('z1', 0, 0, 340, 144, 'prima · PID 417', 'on'), SL.el.zona('z2', 380, 0, 340, 144, 'dopo · PID 417', 'att'),
        SL.el.box('a1', 16, 34, 150, 46, 'codice', 'programma A', 'on', { cls: 'stretta' }), SL.el.box('a2', 174, 34, 150, 46, 'dati e pila', 'di A', 'on', { cls: 'stretta' }), SL.el.box('a3', 16, 88, 308, 46, 'descrittori aperti', '0, 1, 2', '', { cls: 'stretta' }),
        SL.el.box('b1', 396, 34, 150, 46, 'codice', 'programma B', 'att', { cls: 'stretta' }), SL.el.box('b2', 554, 34, 150, 46, 'dati e pila', 'di B', 'att', { cls: 'stretta' }), SL.el.box('b3', 396, 88, 308, 46, 'descrittori aperti', '0, 1, 2', '', { cls: 'stretta' }),
        SL.el.linea('l', 340, 72, 380, 72, 'att')] },
      'Il processo resta il medesimo: conserva il PID e i descrittori aperti. La shell dell’unità 1.1.5 avvia i comandi in questo modo. Crea un processo figlio, e il figlio chiama execve per diventare il programma richiesto. I descrittori conservati spiegano anche la redirezione dell’unità 1.1.6: la shell collega l’uscita standard a un file prima di execve, e il nuovo programma la trova già collegata.',
      'Una execve riuscita non ritorna mai, poiché il codice che l’aveva chiamata è stato eliminato. Una execve fallita, per esempio per un file inesistente, lascia invariata l’immagine: restituisce un numero negativo, e il programma precedente prosegue dall’istruzione successiva.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processo 417 esegue il programma A e chiama execve per diventare il programma B, contenuto nel file /bin/B. I controlli fissano lo stato di tale file, e l’eventuale richiesta precedente, da parte di A, di una zona di memoria anonima.',
      'Sono seguiti la ricerca del file e l’esito di ogni mappatura. Dopo il caso proposto, è istruttivo scegliere il file assente e rilevare ciò che resta dell’immagine.'
    ],
    vedrai: [
      ['process', 'Il processo', 'A sinistra: le mappature del processo 417 e i suoi descrittori aperti.'],
      ['privilegi', 'Il kernel', 'A destra: il servizio richiesto, la ricerca del file e il valore restituito.'],
      ['register', 'RIP', 'In basso: l’indirizzo da cui il processo prosegue.']
    ]
  },
  lab: {
    titolo: 'Il processo 417 chiama execve',
    scena: { w: 860, h: 372 },
    atti: ['L’immagine del processo', 'La richiesta', 'La ricerca del file', 'L’immagine dopo la chiamata', 'La prosecuzione'],
    controlli: [
      { id: 'f', tipo: 'scelta', eti: 'Il file /bin/B', opzioni: [['ok', 'presente ed eseguibile'], ['no', 'assente'], ['perm', 'presente, senza permesso']], valore: 'ok' },
      { id: 'mm', tipo: 'scelta', eti: 'Zona anonima richiesta da A', opzioni: [['si', 'una pagina'], ['no', 'nessuna']], valore: 'si' }
    ],
    nota: 'Il numero di passi dipende dai dati scelti.',
    previsione: {
      domanda: (p) => 'Il processo 417 esegue il programma A e chiama execve per il file /bin/B, che è ' + ({ ok: 'presente ed eseguibile', no: 'assente', perm: 'presente e privo del permesso di esecuzione' })[p.f] + '. Quale programma eseguirà il processo dopo la chiamata, e con quale PID?',
      opzioni: () => ['A, con il PID 417', 'B, con il PID 417', 'B, con un PID nuovo']
    },
    confronto: (pred, esito, p) => 'La previsione indicava: ' + pred + '. Esito: ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.f === 'ok' ? 'Il servizio execve cambia il programma e lascia il processo: il PID resta 417.' : 'La chiamata è fallita prima di modificare l’immagine: il processo continua a eseguire A, con il medesimo PID.'),
    costruisci(p) {
      const el = SL.el, passi = [], OK = p.f === 'ok', MM = p.mm === 'si', COD = p.f === 'no' ? 2 : 13, esito = OK ? 'B, con il PID 417' : 'A, con il PID 417';
      // imm: 'A' immagine iniziale, 'vuota' mappature eliminate, 'B' nuova immagine.
      const quadro = (o) => {
        const B = o.imm === 'B', V = o.imm === 'vuota', sM = V ? 'off' : B ? 'att' : 'on';
        const els = [el.zona('zp', 20, 0, 480, 304, 'il processo · PID 417', o.kernel ? '' : 'on'), el.zona('zk', 520, 0, 320, 304, 'il kernel', o.kernel ? 'att' : ''),
          el.box('m1', 36, 34, 448, 44, 'codice · da ' + (B ? '0x501000' : '0x401000'), V ? 'eliminata' : B ? 'programma B' : 'programma A', sM, { cls: 'stretta' }),
          el.box('m2', 36, 86, 448, 44, 'dati · da ' + (B ? '0x504000' : '0x404000'), V ? 'eliminata' : B ? 'variabili di B' : 'variabili di A', sM, { cls: 'stretta' }),
          el.box('m3', 36, 138, 448, 44, 'zona anonima · da 0x700000', !MM || !o.mm ? 'nessuna' : V || B ? 'eliminata' : 'una pagina, 4096 byte', !MM || !o.mm ? '' : V || B ? 'off' : o.nuovaMm ? 'att' : 'on', { cls: 'stretta' }),
          el.box('m4', 36, 190, 448, 44, 'pila', V ? 'eliminata' : B ? 'nuova, con gli argomenti di B' : 'dati di lavoro di A', sM, { cls: 'stretta' }),
          el.box('m5', 36, 248, 448, 44, 'descrittori aperti', '0, 1, 2', o.restano ? 'att' : 'on', { cls: 'stretta' }),
          el.box('k1', 536, 34, 288, 54, 'servizio richiesto', o.fase >= 1 ? 'numero 59: execve' : '·', o.fase === 1 ? 'att' : o.fase > 1 ? 'on' : '', { cls: 'stretta' }),
          el.box('k2', 536, 100, 288, 54, 'il file /bin/B', o.fase >= 2 ? ({ ok: 'trovato, eseguibile', no: 'assente', perm: 'trovato, senza permesso' })[p.f] : '·', o.fase === 2 ? (OK ? 'att' : 'err') : o.fase > 2 ? 'on' : '', { cls: 'stretta' }),
          el.box('k3', 536, 166, 288, 54, 'valore restituito in RAX', o.fase >= 3 ? (OK ? 'nessuno: ritorno assente' : '−' + COD) : '·', o.fase >= 3 ? (OK ? 'on' : 'err') : '', { cls: 'stretta' }),
          el.box('k4', 536, 232, 288, 54, 'PID', '417', o.restano ? 'att' : 'on', { cls: 'stretta' }),
          el.box('rip', 20, 316, 400, 50, 'il processo prosegue da', o.rip || '·', o.rip ? 'att' : '', { cls: 'stretta' }),
          el.box('prg', 440, 316, 400, 50, 'programma in esecuzione', B ? 'B' : V ? 'nessuno, per un istante' : 'A', o.fine ? 'att' : '', { cls: 'stretta' })];
        return els;
      };
      const hud = (o) => [['PID', '417', 'a'], ['Programma', o.imm === 'B' ? 'B' : o.imm === 'vuota' ? '·' : 'A'], ['RAX', o.fase >= 3 && !OK ? '−' + COD : o.fase >= 1 && o.fase < 3 ? '59' : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ fase: 0, imm: 'A' }, 0, 'Il processo e la sua immagine', 'Il processo 417 esegue il programma A. La sua immagine è composta da mappature: una per il codice, a partire da 0x401000, una per i dati, una per la pila. Possiede inoltre tre descrittori aperti, lo 0, l’1 e il 2.');
      if (MM) P({ fase: 0, imm: 'A', mm: true, nuovaMm: true }, 0, 'Una mappatura in più', 'Durante l’esecuzione A ha richiesto al kernel una zona di memoria con il servizio numero 9. Il kernel ha aggiunto all’immagine una pagina anonima di 4096 byte, a partire da 0x700000. Anche tale zona appartiene ora al processo.', { calc: '1 pagina = 4096 byte' });
      P({ fase: 1, imm: 'A', mm: true, kernel: true }, 1, 'La richiesta', 'Il programma A scrive 59 in RAX, il numero di execve, e in RDI l’indirizzo del nome del file, /bin/B. Esegue poi SYSCALL. La richiesta rivolta al kernel è la sostituzione del programma stesso con un altro.',
        { calc: 'RAX = 59 · RDI → «/bin/B»', chiedi: { d: 'Si supponga che la sostituzione riesca. Quale PID avrà il processo durante l’esecuzione di B?', o: ['417', 'Un numero nuovo'], g: 0, no: 'Il servizio execve cambia il programma eseguito. Il processo è lo stesso, e conserva il PID 417.' } });
      P({ fase: 2, imm: 'A', mm: true, kernel: true }, 2, OK ? 'Il file c’è' : p.f === 'no' ? 'File inesistente' : 'Permesso negato', 'Il kernel cerca il file /bin/B. ' + (OK ? 'Lo trova, verifica che il processo abbia il permesso di eseguirlo e che il contenuto sia un programma valido. Soltanto a questo punto comincia a modificare l’immagine.' : p.f === 'no' ? 'Nella directory /bin nessun file ha tale nome. La ricerca si arresta a questo punto, prima di ogni modifica dell’immagine.' : 'Lo trova, e tuttavia il processo è privo del permesso di eseguirlo. La chiamata si arresta a questo punto, prima di ogni modifica dell’immagine.'),
        { chiedi: { d: OK ? 'Il kernel sta per installare il programma B. Che cosa accade alle mappature di A?' : 'La chiamata è fallita. Che cosa accade alle mappature di A?', o: ['Sono eliminate', 'Restano invariate'], g: OK ? 0 : 1, no: OK ? 'La nuova immagine sostituisce la precedente per intero. Nessuna mappatura di A è conservata.' : 'Il kernel elimina l’immagine precedente soltanto quando è certo di poter installare la nuova. In questo caso si è arrestato prima.' } });
      if (OK) {
        P({ fase: 3, imm: 'vuota', mm: true, kernel: true }, 3, 'L’eliminazione dell’immagine precedente', 'Il kernel elimina tutte le mappature del programma A: codice, dati e pila' + (MM ? ', compresa la pagina anonima a 0x700000.' : '.') + ' Tutto il contenuto della memoria di A è perduto. Da questo punto l’operazione è irreversibile.', { calc: 'mappature di A: eliminate' });
        P({ fase: 3, imm: 'B', mm: true, kernel: true, restano: true }, 3, 'La nuova immagine', 'Il kernel crea le mappature del programma B: il codice a partire da 0x501000, i dati, una nuova pila sulla quale depone gli argomenti del programma. Due elementi sono rimasti invariati: il PID, 417, e i descrittori aperti.', { calc: 'PID 417 · descrittori 0, 1, 2' });
        P({ fase: 4, imm: 'B', mm: true, rip: '0x501000, la prima istruzione di B', fine: true }, 4, 'Nessun ritorno', 'Il processore riparte dalla prima istruzione del programma B, a 0x501000, con i registri preparati dal kernel. L’istruzione che in A seguiva SYSCALL non esiste più, e nessun valore è restituito. Il processo 417 esegue ora B.', { calc: 'RIP = 0x501000', esito: [esito, 'si'] });
      } else {
        P({ fase: 3, imm: 'A', mm: true, kernel: true }, 3, 'Un’immagine invariata', 'Il kernel restituisce −' + COD + ' in RAX. Il codice ' + COD + (p.f === 'no' ? ' indica un file inesistente.' : ' indica un permesso negato.') + ' Nessuna mappatura è stata modificata: codice, dati' + (MM ? ', pagina anonima' : '') + ' e pila del programma A sono ancora presenti.', { calc: 'RAX = −' + COD });
        P({ fase: 4, imm: 'A', mm: true, rip: '0x401082, l’istruzione dopo SYSCALL', fine: true }, 4, 'Il ritorno con un errore', 'Il programma A riprende dall’istruzione che segue SYSCALL, a 0x401082, e trova l’errore in RAX. Il codice che in un programma segue una chiamata a execve è eseguito soltanto in questo caso: è il punto in cui si tratta l’errore.', { calc: 'RIP = 0x401082', esito: [esito, 'si'] });
      }
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'L’immagine di un processo è l’insieme delle sue mappature. Il servizio execve la sostituisce per intero con quella di un altro programma. Il PID e i descrittori aperti restano i medesimi.',
      'Una execve riuscita non ritorna. Una execve fallita restituisce un numero negativo e lascia invariata l’immagine.'
    ],
    errori: [
      ['Ritenere che execve crei un nuovo processo.', 'Il PID resta il medesimo. Il cambiamento riguarda il programma eseguito dal processo.'],
      ['Fare affidamento sulla memoria richiesta prima di execve.', 'Tutte le mappature dell’immagine precedente sono eliminate, comprese le zone anonime.'],
      ['Attendersi che il codice successivo a execve sia sempre eseguito.', 'È eseguito soltanto se la chiamata fallisce. Dopo un esito positivo tale codice è stato eliminato.']
    ],
    saFare: ['Elencare le parti dell’immagine di un processo.', 'Indicare ciò che un processo conserva e ciò che perde dopo execve.', 'Distinguere il caso riuscito da quello fallito in base al valore restituito.'],
    esercizi: [
      { d: 'Una mappatura anonima comincia all’indirizzo 0x700000 e occupa 3 pagine da 4096 byte. Qual è il primo indirizzo dopo la sua fine? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x701000', giuste: ['0x703000', '703000', '703000h'],
        ok: 'Una pagina di 4096 byte è 0x1000 in esadecimale. Tre pagine occupano 0x3000 byte, e la mappatura termina a 0x703000.',
        diagnosi: [
          { se: ['0x700003', '700003'], msg: 'In tal modo le pagine sono contate come byte. Ogni pagina ne occupa 4096.' },
          { se: ['0x712288', '712288'], msg: 'La dimensione, 12 288 byte, è corretta. Prima della somma con la base va scritta in esadecimale: 4096 è 0x1000.' },
          { se: ['0x702000', '702000'], msg: 'Il valore indicato è l’indirizzo a cui comincia la terza pagina. La mappatura termina una pagina più avanti.' },
          { se: ['0x702fff', '702fff'], msg: 'Il valore indicato è l’ultimo byte della mappatura. È richiesto il primo indirizzo successivo.' }
        ],
        altro: 'L’indirizzo è diverso. Si scriva la dimensione di una pagina in esadecimale e la si moltiplichi per 3.',
        indizi: ['4096 è 16 × 16 × 16, cioè 0x1000.', 'Tre pagine occupano 3 × 0x1000 = 0x3000 byte.', '0x700000 + 0x3000.'],
        svolgimento: ['Una pagina: 4096 byte = 0x1000.', 'Tre pagine: 0x3000 byte.', 'Fine della mappatura: 0x700000 + 0x3000 = 0x703000.'] },
      { d: 'Un processo con PID 512 ha il descrittore 1 collegato al file esito.txt e chiama execve con esito positivo. Quale condizione vale per il nuovo programma?', guida: 'Si scelga la risposta.', o: [
        { t: 'PID 512, descrittore 1 collegato a esito.txt', ok: true, fb: 'Il processo resta il medesimo e conserva i descrittori aperti. È il meccanismo con cui la shell realizza la redirezione.' },
        { t: 'PID 512, descrittore 1 riportato al terminale', fb: 'I descrittori aperti restano invariati dopo execve. Il nuovo programma trova l’uscita già collegata al file.' },
        { t: 'PID nuovo, descrittore 1 collegato a esito.txt', fb: 'Il servizio execve cambia il programma, e il processo conserva il proprio PID.' }] }
    ]
  }
});
