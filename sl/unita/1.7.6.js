'use strict';
SL.registra('1.7.6', {
  titolo: 'Dalla sintassi della shell ai byte di un comando',
  obiettivo: 'Obiettivo: stabilire, per un comando con il segno <, quali operazioni spettino alla shell e quali al programma, e a chi attribuire ciascun errore.',
  concetti: [['terminale', 'Shell'], ['input', 'Ingresso standard'], ['process', 'Programma']],
  filigrana: ['terminale', 'input', 'file'],
  richiami: {
    carte: [
      { sim: 'terminale', da: 'Dall’unità 1.1.6', t: 'La redirezione dell’uscita', d: 'Con il segno > la shell collega l’uscita standard a un file, prima dell’avvio del programma.' },
      { sim: 'process', da: 'Dall’unità 1.1.5', t: 'Il processo figlio', d: 'Per avviare un programma la shell crea un processo figlio, che poi sostituisce il proprio programma con quello richiesto.' },
      { sim: 'scudo', da: 'Dall’unità 1.7.1', t: 'La firma per prima', d: 'Un lettore TLM1 richiede anzitutto quattro byte e li confronta con i caratteri «TLM1».' }
    ],
    domanda: { d: 'Prima di proseguire: nel comando ./hello > esito, chi crea il file esito quando manca?', o: [
      { t: 'Il programma hello', fb: 'Il programma scrive nella propria uscita standard e ignora la destinazione.' },
      { t: 'La shell', ok: true, fb: 'La shell prepara la redirezione nel processo figlio, prima di caricare hello.' },
      { t: 'Nessuno, e il comando fallisce', fb: 'Con il segno > un file mancante viene creato.' }
    ] }
  },
  idea: {
    titolo: 'Apertura e lettura del file',
    termini: ['ingresso standard'],
    testo: [
      'Nelle unità precedenti il record TLM1 era una sequenza di byte già ricevuta dal lettore. Resta da esaminare il tragitto con cui essa gli giunge. Il lettore è un programma, denominato lettore, e il record si trova in un file, denominato misura.bin. Il loro collegamento spetta alla shell.',
      'L’unità 1.1.6 ha mostrato che un programma scrive nella propria uscita standard senza conoscerne la destinazione. Per la lettura vale la regola simmetrica. Ogni programma dispone di un [[ingresso standard]], cioè di un canale dal quale legge i dati senza conoscerne la provenienza. Di norma la shell lo collega alla tastiera del terminale.',
      'Il comando `./lettore < misura.bin` richiede un collegamento diverso. Il segno `<` è una [[redirezione]] dell’ingresso. La shell apre il file misura.bin in lettura e lo collega all’ingresso standard del processo figlio, prima che lettore venga caricato. Il programma legge poi dal proprio ingresso standard come farebbe dalla tastiera, e riceve i byte del file.',
      { fig: 'scena', w: 760, h: 112, titolo: 'Il collegamento preparato dalla shell', nota: 'Il programma conosce soltanto il proprio ingresso standard. Il nome del file è noto soltanto alla shell.', els: [
        SL.el.box('a', 10, 8, 210, 88, 'file', 'misura.bin', 'on', { sim: 'file', riga: true }), SL.el.linea('l1', 220, 52, 270, 52, 'on'),
        SL.el.box('b', 270, 8, 230, 88, 'canale', 'ingresso standard', 'att', { sim: 'input', riga: true, cls: 'stretta' }), SL.el.linea('l2', 500, 52, 550, 52, 'on'),
        SL.el.box('c', 550, 8, 200, 88, 'processo', 'lettore', '', { sim: 'process', riga: true })] },
      'Da questa ripartizione dei compiti discende una conseguenza pratica: gli errori possono verificarsi in due momenti, e sono segnalati da due soggetti diversi.',
      'Il primo momento è l’apertura. Se misura.bin manca, l’apertura fallisce. Il processo figlio, che sta ancora eseguendo il codice della shell, stampa un messaggio di errore e termina con codice di uscita 1. Il programma lettore resta sul disco, e nessuna delle sue istruzioni viene eseguita.',
      'Il secondo momento è la lettura. Se il file esiste l’apertura riesce, qualunque ne sia il contenuto. Il contenuto è estraneo al controllo della shell, che collega allo stesso modo un file vuoto o un file di contenuto arbitrario. Il programma viene avviato ed esegue la lettura: a esso spetta rilevare la mancanza di byte o una firma errata, con la validazione delle unità precedenti.',
      'La distinzione fra i due momenti abbrevia la ricerca delle cause di un errore. Un messaggio che comincia con il nome della shell riguarda il comando, cioè il nome del file o i permessi. Un messaggio scritto dal programma riguarda i dati.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento segue il comando `./lettore < misura.bin` dalla pressione del tasto Invio. Un controllo fissa lo stato del file: assente, vuoto, con una firma errata oppure con un record valido.',
      'La scena comprende la shell, il file, l’ingresso standard e il programma. Vanno osservati il momento in cui il programma viene caricato e il soggetto che scrive sul terminale. Dopo il caso proposto, sono istruttivi gli altri tre.'
    ],
    vedrai: [
      ['terminale', 'La shell', 'A sinistra: la shell, che legge il comando e prepara il collegamento.'],
      ['input', 'L’ingresso standard', 'Al centro: il file e il canale a cui viene collegato.'],
      ['process', 'Il programma', 'A destra: lettore, con lo stato in cui si trova. Sotto, i byte che riceve.']
    ]
  },
  lab: {
    titolo: 'Un comando con il segno <',
    scena: { w: 860, h: 372 },
    atti: ['Il comando', 'Le operazioni della shell', 'Le operazioni del programma', 'Il bilancio'],
    nota: 'Il numero di passi dipende dai dati: se il file manca, il programma non viene mai caricato.',
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Il file misura.bin', opzioni: [['assente', 'non esiste'], ['vuoto', 'esiste ed è vuoto'], ['firma', 'comincia con «XLM1»'], ['valido', 'contiene un record valido']], valore: 'assente' }
    ],
    previsione: {
      domanda: (p) => 'Il comando è ./lettore < misura.bin, e il file misura.bin ' + { assente: 'non esiste', vuoto: 'esiste ed è vuoto', firma: 'comincia con i caratteri «XLM1»', valido: 'contiene un record valido' }[p.caso] + '. Chi scriverà sul terminale?',
      opzioni: () => [['shell', 'La shell, e il programma non viene avviato'], ['programma', 'Il programma, con un messaggio di errore'], ['dati', 'Il programma, con la misura letta']]
    },
    confronto: (pred, esito) => {
      const N = { shell: 'scrive la shell, e il programma non viene avviato', programma: 'scrive il programma, con un messaggio di errore', dati: 'scrive il programma, con la misura letta' };
      return 'La previsione indicava: ' + N[pred] + '. Esito: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'shell' ? 'Il file viene aperto dalla shell prima dell’avvio. Se l’apertura fallisce, il programma resta sul disco.' : esito === 'programma' ? 'Il file esiste, e la shell lo collega quindi senza esaminarne il contenuto. Il difetto risiede nei dati, ed è rilevato dal programma.' : 'Il file esiste e contiene un record ben formato, e nessuno dei due ha quindi errori da segnalare.');
    },
    costruisci(p) {
      const el = SL.el, T = SL.tlm, passi = [];
      const caso = p.caso, B = T.codifica('Nord', -35, 1.5);
      const FILE = caso === 'firma' ? [0x58].concat(B.slice(1)) : caso === 'valido' ? B : [];
      const s = { shell: 'legge il comando', file: { assente: 'non esiste', vuoto: '0 byte', firma: '15 byte', valido: '15 byte' }[caso], canale: 'tastiera', prog: 'sul disco', letti: null, uscita: '·', term: '·', termSt: '' };
      const quadro = (o) => {
        o = o || {};
        const st = (k) => (o.err === k ? 'err' : o.att === k ? 'att' : '');
        const els = [
          el.box('cmd', 40, 0, 790, 60, 'riga digitata', '$ ./lettore < misura.bin', o.att === 'cmd' ? 'att' : '', { sim: 'terminale', riga: true }),
          el.box('sh', 40, 78, 170, 100, 'shell', s.shell, st('sh'), { sim: 'terminale', cls: 'stretta' }),
          el.linea('l1', 210, 128, 250, 128, o.l1 || 'off', true),
          el.box('fi', 250, 78, 170, 100, 'misura.bin', s.file, st('fi') || (caso === 'assente' ? 'off' : ''), { sim: 'file', cls: 'stretta' }),
          el.linea('l2', 420, 128, 460, 128, o.l2 || 'off'),
          el.box('ca', 460, 78, 180, 100, 'ingresso standard', s.canale, st('ca'), { sim: 'input', cls: 'stretta' }),
          el.linea('l3', 640, 128, 680, 128, o.l3 || 'off'),
          el.box('pr', 680, 78, 150, 100, 'lettore', s.prog, st('pr') || (s.prog === 'sul disco' ? 'off' : ''), { sim: 'process', cls: 'stretta' }),
          el.nota('t2', 40, 196, 'BYTE RICEVUTI DAL PROGRAMMA', 'mono'),
          el.nota('t3', 330, 196, 'FIRMA ATTESA', 'mono')
        ];
        for (let k = 0; k < 4; k++) {
          els.push(el.cella('r' + k, 40 + k * 58, 222, 52, 42, s.letti && s.letti[k] != null ? T.esa(s.letti[k]) : '·', !s.letti || s.letti[k] == null ? 'off' : o.cfr ? (s.letti[k] === B[k] ? 'on' : 'err') : 'att', { cls: 'minuta' }));
          els.push(el.cella('f' + k, 330 + k * 58, 222, 52, 42, T.esa(B[k]), o.cfr ? 'on' : '', { cls: 'minuta' }));
        }
        els.push(el.box('us', 620, 204, 210, 62, 'codice di uscita', s.uscita, s.uscita === '·' ? '' : s.uscita === '0' ? 'on' : 'err'));
        els.push(el.box('te', 40, 290, 790, 64, 'sul terminale compare', s.term, s.termSt, { sim: 'output', riga: true, cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Programma', s.prog, 'a'], ['Byte letti', s.letti ? s.letti.length : 0], ['Codice di uscita', s.uscita, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ att: 'cmd' }, 0, 'Il comando', 'Il comando è stato digitato ed è stato premuto Invio. La shell legge l’intera riga prima di ogni altra operazione.');
      s.shell = 'divide la riga';
      P({ att: 'sh' }, 0, 'La shell divide la riga', 'La shell riconosce due parti. La prima, ./lettore, è il programma da avviare. La seconda, < misura.bin, è una richiesta rivolta alla shell stessa: collegare il file all’ingresso standard. Al programma resteranno ignoti sia il segno < sia il nome del file.',
        { calc: './lettore   |   < misura.bin', chiedi: { d: 'Chi aprirà il file misura.bin?', o: ['La shell, prima di avviare il programma', 'Il programma, dopo l’avvio'], g: 0, no: 'La redirezione è una richiesta rivolta alla shell, che la esegue nel processo figlio prima di caricare il programma.' } });
      s.shell = 'crea il figlio';
      P({ att: 'sh' }, 1, 'Il processo figlio', 'Come per ogni comando, la shell richiede al sistema operativo un processo figlio. Il figlio esegue per il momento il codice della shell, e prepara la redirezione.');
      s.shell = 'apre il file';
      if (caso === 'assente') {
        P({ att: 'sh', err: 'fi', l1: 'att' }, 1, 'L’apertura fallisce', 'Il figlio richiede al sistema operativo l’apertura di misura.bin in lettura. Nella directory corrente tale nome è assente, e il sistema operativo risponde con un errore.', { calc: 'apertura di misura.bin', esito: ['fallita', 'no'] });
        s.shell = 'segnala l’errore'; s.uscita = '1'; s.term = 'bash: misura.bin: File o directory non esistente'; s.termSt = 'err';
        P({ att: 'sh', err: 'fi' }, 1, 'La shell segnala l’errore', 'Il figlio stampa sul terminale un messaggio che comincia con il nome della shell, qui bash, e termina con codice di uscita 1. Il programma lettore è rimasto sul disco, e nessuna delle sue istruzioni è stata eseguita.', { calc: 'codice di uscita = 1' });
        s.shell = 'mostra il prompt';
        P({ err: 'fi' }, 3, 'Un errore del comando', 'L’errore riguarda il comando, e i dati ne sono estranei. La correzione richiede di verificare il nome del file e la directory corrente. La ricerca del difetto all’interno del programma sarebbe infruttuosa.', { calc: 'ha scritto: la shell' });
        return { passi, esito: 'shell' };
      }
      P({ att: 'sh', l1: 'att' }, 1, 'L’apertura riesce', 'Il figlio richiede al sistema operativo l’apertura di misura.bin in lettura. Il file esiste e l’apertura riesce. Il controllo della shell termina a questo punto: il contenuto, lunghezza compresa, le resta estraneo.', { calc: 'apertura di misura.bin', esito: ['riuscita', 'si'] });
      s.shell = 'collega il file'; s.canale = 'misura.bin';
      P({ att: 'ca', l1: 'on', l2: 'att' }, 1, 'Il collegamento', 'Il figlio collega il file aperto al proprio ingresso standard, in luogo della tastiera. Da questo momento ogni lettura dall’ingresso standard riceve i byte di misura.bin.');
      s.shell = 'aspetta'; s.prog = 'in esecuzione';
      P({ att: 'pr', l1: 'on', l2: 'on', l3: 'att' }, 1, 'Il programma viene caricato', 'Il figlio richiede al sistema operativo la sostituzione del proprio programma con lettore, come nell’unità 1.1.5. Il collegamento predisposto resta in essere, e lettore lo trova già attivo.');
      s.letti = FILE.slice(0, 4);
      const L = { l1: 'on', l2: 'on', l3: 'on' };
      if (caso === 'vuoto') {
        P(Object.assign({ att: 'pr', err: 'ca' }, L), 2, 'La prima lettura', 'Il programma richiede al proprio ingresso standard i quattro byte della firma. Il file è vuoto, e la lettura restituisce zero byte.', { calc: 'byte richiesti: 4 · byte ricevuti: 0' });
        s.prog = 'terminato'; s.uscita = '2'; s.term = 'lettore: record incompleto'; s.termSt = 'err';
        P(Object.assign({ err: 'pr' }, L), 2, 'Il programma segnala l’errore', 'Occorrevano quattro byte e ne sono stati ricevuti zero: il campo della firma è incompleto, come nell’unità 1.7.1. Il programma scrive il proprio messaggio e termina con codice di uscita 2, il valore scelto dai suoi autori per i dati rifiutati.', { calc: '4 ≤ 0 ?', esito: ['no', 'no'] });
        s.shell = 'mostra il prompt';
        P(L, 3, 'Un errore dei dati', 'La shell ha eseguito correttamente le proprie operazioni: il file esisteva ed è stato collegato. Il difetto risiede nei dati, ed è stato rilevato dal programma con il proprio controllo.', { calc: 'ha scritto: il programma' });
        return { passi, esito: 'programma' };
      }
      const giusta = caso === 'valido';
      P(Object.assign({ att: 'pr' }, L), 2, 'La prima lettura', 'Il programma richiede al proprio ingresso standard i quattro byte della firma, e li riceve: ' + s.letti.map(T.esa).join(' ') + '.',
        { calc: 'byte richiesti: 4 · byte ricevuti: 4', chiedi: { d: 'I byte ricevuti sono ' + s.letti.map(T.esa).join(' ') + '. La firma attesa è 54 4C 4D 31. Il programma proseguirà con gli altri campi?', o: ['Sì', 'No'], g: giusta ? 0 : 1, no: giusta ? 'I quattro byte coincidono con la firma, uno per uno.' : 'Il primo byte vale 58 e la firma comincia con 54.' } });
      if (!giusta) {
        s.prog = 'terminato'; s.uscita = '2'; s.term = 'lettore: firma non riconosciuta'; s.termSt = 'err';
        P(Object.assign({ err: 'pr', cfr: true }, L), 2, 'Il programma segnala l’errore', 'Il primo byte vale 58, il codice della X, mentre la firma comincia con 54, il codice della T. Il programma scrive il proprio messaggio e termina con codice di uscita 2, il valore scelto dai suoi autori per i dati rifiutati.', { calc: '58 4C 4D 31 ≠ 54 4C 4D 31' });
        s.shell = 'mostra il prompt';
        P(Object.assign({ cfr: true }, L), 3, 'Un errore dei dati', 'La shell ha eseguito correttamente le proprie operazioni: il file esisteva ed è stato collegato. Il difetto risiede nei dati, ed è stato rilevato dal programma con il proprio controllo.', { calc: 'ha scritto: il programma' });
        return { passi, esito: 'programma' };
      }
      P(Object.assign({ att: 'pr', cfr: true }, L), 2, 'La firma è quella attesa', 'I quattro byte coincidono con la firma, uno per uno. Il programma dispone di un record TLM1 e può proseguire.', { calc: '54 4C 4D 31 = 54 4C 4D 31' });
      s.prog = 'terminato'; s.uscita = '0'; s.term = 'Nord   −3,5 °C   1,5 V'; s.termSt = 'on';
      P(Object.assign({ att: 'pr', cfr: true }, L), 2, 'Il resto del record', 'Il programma legge gli altri campi con il metodo delle unità 1.7.1 e 1.7.2: la lunghezza, il nome, la temperatura, la tensione. Scrive la misura sulla propria uscita standard, che la shell ha lasciato collegata al terminale, e termina con codice di uscita 0.', { calc: 'codice di uscita = 0' });
      s.shell = 'mostra il prompt';
      P(Object.assign({ cfr: true }, L), 3, 'Compiti distinti', 'La shell ha aperto il file e lo ha collegato. Il programma ha letto i byte e li ha interpretati. Nessuno dei due ha dovuto conoscere le operazioni dell’altro.', { calc: 'ha scritto: il programma' });
      return { passi, esito: 'dati' };
    }
  },
  bilancio: {
    regola: [
      'In un comando con il segno <, la shell apre il file e lo collega all’ingresso standard prima di avviare il programma. Il programma legge dal proprio ingresso standard senza conoscere il nome del file.',
      'Gli errori hanno due origini. Se il file manca, il messaggio proviene dalla shell e il programma resta sul disco. Se il file esiste e i dati sono errati, il programma viene avviato e li rifiuta con la propria validazione.'
    ],
    errori: [
      ['Cercare nel programma un errore della shell.', 'Un messaggio che comincia con il nome della shell riguarda il comando: il nome del file, la directory corrente, i permessi.'],
      ['Ritenere che la shell controlli il contenuto.', 'La shell si limita ad aprire il file. Un file vuoto o con una firma errata viene collegato come qualunque altro.'],
      ['Ritenere che il programma conosca il nome del file.', 'Con la redirezione il programma riceve i byte e ne ignora il nome. Il segno < e il nome che lo segue sono rivolti alla shell.']
    ],
    saFare: ['Distinguere, in un comando con redirezione, le operazioni della shell da quelle del programma.', 'Attribuire un messaggio di errore alla shell o al programma.', 'Indicare che cosa riceve un programma che legge da un file vuoto.'],
    esercizi: [
      { d: 'Il comando `./lettore < dati.bin` fa comparire sul terminale «lettore: firma non riconosciuta». Che cosa si può affermare con certezza?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il file dati.bin non esiste', fb: 'Se il file mancasse, il messaggio proverrebbe dalla shell e il programma resterebbe sul disco.' },
        { t: 'Il file esiste e il programma ne ha letto l’inizio', ok: true, fb: 'Il messaggio proviene dal programma, che è stato quindi avviato. Per confrontare la firma ha dovuto ricevere i primi byte.' },
        { t: 'Il file dati.bin è vuoto', fb: 'Da un file vuoto il programma riceverebbe zero byte, e segnalerebbe un record incompleto.' }] },
      { d: 'Il file misura.bin contiene 15 byte. Dopo il comando `./lettore < misura.bin` il programma legge dal proprio ingresso standard prima 4 byte, poi 1, poi 4. Quanti byte gli restano da leggere?', segnaposto: 'Un numero di byte', giuste: ['6', 'sei'],
        ok: 'Il programma ha consumato 4 + 1 + 4 = 9 byte. Ne restano 15 − 9 = 6: i due della temperatura e i quattro della tensione.',
        diagnosi: [
          { se: ['9', 'nove'], msg: 'Nove sono i byte già letti. Quelli che restano sono 15 − 9.' },
          { se: ['15', 'quindici'], msg: 'Quindici è la lunghezza del file. Il programma ne ha già consumati nove.' },
          { se: ['11', 'undici'], msg: 'È stata sottratta soltanto la prima lettura. Le letture sono tre: 4, 1 e 4 byte.' }
        ],
        altro: 'Il numero è diverso. Ogni lettura consuma i byte che riceve: si sommino le tre letture e si sottragga il totale da 15.',
        indizi: ['La lettura dall’ingresso standard fa avanzare un cursore, come nell’unità 1.7.1.', 'Le tre letture consumano 4 + 1 + 4 byte.', 'Restano 15 − 9 byte.'],
        svolgimento: ['Prima lettura: 4 byte, la firma.', 'Seconda lettura: 1 byte, la lunghezza del nome.', 'Terza lettura: 4 byte, il nome.', 'Byte consumati: 9. Byte rimasti: 15 − 9 = 6.'] }
    ]
  }
});
