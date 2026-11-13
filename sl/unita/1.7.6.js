'use strict';
SL.registra('1.7.6', {
  titolo: 'Dalla sintassi della shell ai byte di un comando',
  obiettivo: 'Alla fine saprai dire, davanti a un comando con il segno <, quale lavoro spetta alla shell e quale al programma, e a chi attribuire ciascun errore.',
  concetti: [['terminale', 'Shell'], ['input', 'Ingresso standard'], ['process', 'Programma']],
  filigrana: ['terminale', 'input', 'file'],
  richiami: {
    carte: [
      { sim: 'terminale', da: 'Dall’unità 1.1.6', t: 'La redirezione dell’uscita', d: 'Con il segno > la shell collega l’uscita standard a un file, prima che il programma parta.' },
      { sim: 'process', da: 'Dall’unità 1.1.5', t: 'Il processo figlio', d: 'Per avviare un programma la shell crea un processo figlio, che poi sostituisce il proprio programma con quello richiesto.' },
      { sim: 'scudo', da: 'Dall’unità 1.7.1', t: 'La firma per prima', d: 'Un lettore TLM1 chiede anzitutto quattro byte e li confronta con i caratteri «TLM1».' }
    ],
    domanda: { d: 'Prima di proseguire: nel comando ./hello > esito, chi crea il file esito quando manca?', o: [
      { t: 'Il programma hello', fb: 'Il programma scrive nella propria uscita standard e ignora la destinazione.' },
      { t: 'La shell', ok: true, fb: 'La shell prepara la redirezione nel processo figlio, prima di caricare hello.' },
      { t: 'Nessuno, e il comando fallisce', fb: 'Con il segno > un file mancante viene creato.' }
    ] }
  },
  idea: {
    titolo: 'Chi apre il file, chi lo legge',
    termini: ['ingresso standard'],
    testo: [
      'Nelle unità precedenti il record TLM1 era una sequenza di byte già arrivata al lettore. Resta da vedere per quale strada arriva. Il lettore è un programma, che chiameremo lettore, e il record sta in un file, che chiameremo misura.bin. Il compito di metterli in contatto spetta alla shell.',
      'Nell’unità 1.1.6 hai visto che un programma scrive nella propria uscita standard senza sapere dove finiranno i byte. Per la lettura vale la regola speculare. Ogni programma dispone di un [[ingresso standard]], cioè di un canale da cui legge i dati senza sapere da dove vengono. Di norma la shell lo collega alla tastiera del terminale.',
      'Il comando `./lettore < misura.bin` chiede un collegamento diverso. Il segno `<` è una [[redirezione]] dell’ingresso. La shell apre il file misura.bin in lettura e lo collega all’ingresso standard del processo figlio, prima che lettore venga caricato. Il programma legge poi dal proprio ingresso standard come farebbe dalla tastiera, e riceve i byte del file.',
      { fig: 'scena', w: 760, h: 112, titolo: 'Il collegamento preparato dalla shell', nota: 'Il programma conosce soltanto il proprio ingresso standard. Il nome del file resta alla shell.', els: [
        SL.el.box('a', 10, 8, 210, 88, 'file', 'misura.bin', 'on', { sim: 'file', riga: true }), SL.el.linea('l1', 220, 52, 270, 52, 'on'),
        SL.el.box('b', 270, 8, 230, 88, 'canale', 'ingresso standard', 'att', { sim: 'input', riga: true, cls: 'stretta' }), SL.el.linea('l2', 500, 52, 550, 52, 'on'),
        SL.el.box('c', 550, 8, 200, 88, 'processo', 'lettore', '', { sim: 'process', riga: true })] },
      'Da questa divisione dei compiti segue una conseguenza pratica: gli errori possono nascere in due momenti, e li segnalano due soggetti diversi.',
      'Il primo momento è l’apertura. Se misura.bin manca, l’apertura fallisce. Il processo figlio, che sta ancora eseguendo il codice della shell, stampa un messaggio di errore e termina con codice di uscita 1. Il programma lettore resta sul disco, e nessuna delle sue istruzioni viene eseguita.',
      'Il secondo momento è la lettura. Se il file esiste l’apertura riesce, qualunque cosa contenga. Il contenuto resta fuori dal controllo della shell, che collega allo stesso modo un file vuoto o un file pieno di tutt’altro. Il programma parte, legge, e spetta a lui accorgersi che i byte mancano o che la firma è sbagliata, con la validazione delle unità precedenti.',
      'Distinguere i due momenti fa risparmiare tempo quando qualcosa va storto. Un messaggio che comincia con il nome della shell parla del comando, cioè del nome del file o dei permessi. Un messaggio scritto dal programma parla dei dati.'
    ]
  },
  esperimento: {
    faremo: [
      'Seguiremo il comando `./lettore < misura.bin` dal momento in cui premi Invio. Deciderai tu in quale stato si trova il file: assente, vuoto, con una firma sbagliata oppure con un record valido.',
      'In scena ci sono la shell, il file, l’ingresso standard e il programma. Tieni d’occhio il momento in cui il programma viene caricato, e chi scrive sul terminale. Dopo il caso proposto, prova gli altri tre.'
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
    atti: ['Il comando', 'Il lavoro della shell', 'Il lavoro del programma', 'Il bilancio'],
    nota: 'Il numero di passi dipende dai dati: se il file manca, il programma non viene mai caricato.',
    controlli: [
      { id: 'caso', tipo: 'scelta', eti: 'Il file misura.bin', opzioni: [['assente', 'non esiste'], ['vuoto', 'esiste ed è vuoto'], ['firma', 'comincia con «XLM1»'], ['valido', 'contiene un record valido']], valore: 'assente' }
    ],
    previsione: {
      domanda: (p) => 'Il comando è ./lettore < misura.bin, e il file misura.bin ' + { assente: 'non esiste', vuoto: 'esiste ed è vuoto', firma: 'comincia con i caratteri «XLM1»', valido: 'contiene un record valido' }[p.caso] + '. Chi scriverà sul terminale?',
      opzioni: () => [['shell', 'La shell, e il programma non parte'], ['programma', 'Il programma, con un messaggio di errore'], ['dati', 'Il programma, con la misura letta']]
    },
    confronto: (pred, esito) => {
      const N = { shell: 'scrive la shell, e il programma non parte', programma: 'scrive il programma, con un messaggio di errore', dati: 'scrive il programma, con la misura letta' };
      return 'Avevi previsto: ' + N[pred] + '. Esito: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'shell' ? 'Il file viene aperto dalla shell prima dell’avvio. Se l’apertura fallisce, il programma resta sul disco.' : esito === 'programma' ? 'Il file esiste, quindi la shell lo collega senza guardarne il contenuto. Il difetto sta nei dati, e lo scopre il programma.' : 'Il file esiste e contiene un record ben formato, quindi nessuno dei due ha errori da segnalare.');
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

      P({ att: 'cmd' }, 0, 'Il comando', 'Hai digitato il comando e premuto Invio. La shell legge l’intera riga prima di fare qualunque altra cosa.');
      s.shell = 'divide la riga';
      P({ att: 'sh' }, 0, 'La shell divide la riga', 'La shell riconosce due parti. La prima, ./lettore, è il programma da avviare. La seconda, < misura.bin, è una richiesta rivolta a lei: collegare quel file all’ingresso standard. Al programma resteranno ignoti sia il segno < sia il nome del file.',
        { calc: './lettore   |   < misura.bin', chiedi: { d: 'Chi aprirà il file misura.bin?', o: ['La shell, prima di avviare il programma', 'Il programma, dopo essere partito'], g: 0, no: 'La redirezione è una richiesta rivolta alla shell, che la esegue nel processo figlio prima di caricare il programma.' } });
      s.shell = 'crea il figlio';
      P({ att: 'sh' }, 1, 'Il processo figlio', 'Come per ogni comando, la shell chiede al sistema operativo un processo figlio. Il figlio per ora esegue ancora il codice della shell, e si occupa di preparare la redirezione.');
      s.shell = 'apre il file';
      if (caso === 'assente') {
        P({ att: 'sh', err: 'fi', l1: 'att' }, 1, 'L’apertura fallisce', 'Il figlio chiede al sistema operativo di aprire misura.bin in lettura. Nella directory corrente quel nome manca, e il sistema operativo risponde con un errore.', { calc: 'apertura di misura.bin', esito: ['fallita', 'no'] });
        s.shell = 'segnala l’errore'; s.uscita = '1'; s.term = 'bash: misura.bin: File o directory non esistente'; s.termSt = 'err';
        P({ att: 'sh', err: 'fi' }, 1, 'La shell segnala l’errore', 'Il figlio stampa sul terminale un messaggio che comincia con il nome della shell, qui bash, e termina con codice di uscita 1. Il programma lettore è rimasto sul disco, e nessuna delle sue istruzioni è stata eseguita.', { calc: 'codice di uscita = 1' });
        s.shell = 'mostra il prompt';
        P({ err: 'fi' }, 3, 'Un errore del comando', 'L’errore riguarda il comando, e i dati restano estranei alla vicenda. Per correggerlo conviene controllare il nome del file e la directory corrente. Cercare il difetto dentro il programma sarebbe tempo perso.', { calc: 'ha scritto: la shell' });
        return { passi, esito: 'shell' };
      }
      P({ att: 'sh', l1: 'att' }, 1, 'L’apertura riesce', 'Il figlio chiede al sistema operativo di aprire misura.bin in lettura. Il file esiste e l’apertura riesce. Il controllo della shell finisce qui: sul contenuto, lunghezza compresa, la shell tace.', { calc: 'apertura di misura.bin', esito: ['riuscita', 'si'] });
      s.shell = 'collega il file'; s.canale = 'misura.bin';
      P({ att: 'ca', l1: 'on', l2: 'att' }, 1, 'Il collegamento', 'Il figlio collega il file aperto al proprio ingresso standard, al posto della tastiera. Da questo momento chi legge dall’ingresso standard riceve i byte di misura.bin.');
      s.shell = 'aspetta'; s.prog = 'in esecuzione';
      P({ att: 'pr', l1: 'on', l2: 'on', l3: 'att' }, 1, 'Il programma viene caricato', 'Il figlio chiede al sistema operativo di sostituire il proprio programma con lettore, come nell’unità 1.1.5. Il collegamento preparato resta al suo posto, e lettore lo trova già pronto.');
      s.letti = FILE.slice(0, 4);
      const L = { l1: 'on', l2: 'on', l3: 'on' };
      if (caso === 'vuoto') {
        P(Object.assign({ att: 'pr', err: 'ca' }, L), 2, 'La prima lettura', 'Il programma chiede al proprio ingresso standard i quattro byte della firma. Il file è vuoto, e la lettura restituisce zero byte.', { calc: 'byte chiesti: 4 · byte ricevuti: 0' });
        s.prog = 'terminato'; s.uscita = '2'; s.term = 'lettore: record incompleto'; s.termSt = 'err';
        P(Object.assign({ err: 'pr' }, L), 2, 'Il programma segnala l’errore', 'Servivano quattro byte e ne sono arrivati zero: il campo della firma è incompleto, come nell’unità 1.7.1. Il programma scrive il proprio messaggio e termina con codice di uscita 2, il valore che i suoi autori hanno scelto per i dati rifiutati.', { calc: '4 ≤ 0 ?', esito: ['no', 'no'] });
        s.shell = 'mostra il prompt';
        P(L, 3, 'Un errore dei dati', 'La shell ha svolto la sua parte senza intoppi: il file esisteva ed è stato collegato. Il difetto sta nei dati, e lo ha scoperto il programma con il proprio controllo.', { calc: 'ha scritto: il programma' });
        return { passi, esito: 'programma' };
      }
      const giusta = caso === 'valido';
      P(Object.assign({ att: 'pr' }, L), 2, 'La prima lettura', 'Il programma chiede al proprio ingresso standard i quattro byte della firma, e li riceve: ' + s.letti.map(T.esa).join(' ') + '.',
        { calc: 'byte chiesti: 4 · byte ricevuti: 4', chiedi: { d: 'I byte ricevuti sono ' + s.letti.map(T.esa).join(' ') + '. La firma attesa è 54 4C 4D 31. Il programma proseguirà con gli altri campi?', o: ['Sì', 'No'], g: giusta ? 0 : 1, no: giusta ? 'I quattro byte coincidono con la firma, uno per uno.' : 'Il primo byte vale 58 e la firma comincia con 54.' } });
      if (!giusta) {
        s.prog = 'terminato'; s.uscita = '2'; s.term = 'lettore: firma non riconosciuta'; s.termSt = 'err';
        P(Object.assign({ err: 'pr', cfr: true }, L), 2, 'Il programma segnala l’errore', 'Il primo byte vale 58, il codice della X, mentre la firma comincia con 54, il codice della T. Il programma scrive il proprio messaggio e termina con codice di uscita 2, il valore che i suoi autori hanno scelto per i dati rifiutati.', { calc: '58 4C 4D 31 ≠ 54 4C 4D 31' });
        s.shell = 'mostra il prompt';
        P(Object.assign({ cfr: true }, L), 3, 'Un errore dei dati', 'La shell ha svolto la sua parte senza intoppi: il file esisteva ed è stato collegato. Il difetto sta nei dati, e lo ha scoperto il programma con il proprio controllo.', { calc: 'ha scritto: il programma' });
        return { passi, esito: 'programma' };
      }
      P(Object.assign({ att: 'pr', cfr: true }, L), 2, 'La firma è quella attesa', 'I quattro byte coincidono con la firma, uno per uno. Il programma ha davanti un record TLM1 e può proseguire.', { calc: '54 4C 4D 31 = 54 4C 4D 31' });
      s.prog = 'terminato'; s.uscita = '0'; s.term = 'Nord   −3,5 °C   1,5 V'; s.termSt = 'on';
      P(Object.assign({ att: 'pr', cfr: true }, L), 2, 'Il resto del record', 'Il programma legge gli altri campi con il metodo delle unità 1.7.1 e 1.7.2: la lunghezza, il nome, la temperatura, la tensione. Scrive la misura sulla propria uscita standard, che la shell ha lasciato collegata al terminale, e termina con codice di uscita 0.', { calc: 'codice di uscita = 0' });
      s.shell = 'mostra il prompt';
      P(Object.assign({ cfr: true }, L), 3, 'Ciascuno la sua parte', 'La shell ha aperto il file e lo ha collegato. Il programma ha letto i byte e li ha interpretati. Nessuno dei due ha dovuto conoscere il lavoro dell’altro.', { calc: 'ha scritto: il programma' });
      return { passi, esito: 'dati' };
    }
  },
  bilancio: {
    regola: [
      'In un comando con il segno <, la shell apre il file e lo collega all’ingresso standard prima di avviare il programma. Il programma legge dal proprio ingresso standard senza conoscere il nome del file.',
      'Gli errori hanno due origini. Se il file manca, il messaggio viene dalla shell e il programma resta sul disco. Se il file esiste e i dati sono sbagliati, il programma parte e li rifiuta con la propria validazione.'
    ],
    errori: [
      ['Cercare nel programma un errore della shell.', 'Un messaggio che comincia con il nome della shell riguarda il comando: il nome del file, la directory corrente, i permessi.'],
      ['Pensare che la shell controlli il contenuto.', 'La shell apre il file e si ferma lì. Un file vuoto o con una firma sbagliata viene collegato come qualunque altro.'],
      ['Credere che il programma conosca il nome del file.', 'Con la redirezione il programma riceve i byte e resta all’oscuro del nome. Il segno < e il nome che lo segue sono rivolti alla shell.']
    ],
    saFare: ['Distinguo, in un comando con redirezione, il lavoro della shell da quello del programma.', 'Attribuisco un messaggio di errore alla shell o al programma.', 'Dico che cosa riceve un programma che legge da un file vuoto.'],
    esercizi: [
      { d: 'Il comando `./lettore < dati.bin` fa comparire sul terminale «lettore: firma non riconosciuta». Che cosa si può affermare con certezza?', guida: 'Scegli la risposta.', o: [
        { t: 'Il file dati.bin non esiste', fb: 'Se il file mancasse, il messaggio verrebbe dalla shell e il programma resterebbe sul disco.' },
        { t: 'Il file esiste e il programma ne ha letto l’inizio', ok: true, fb: 'Il messaggio viene dal programma, che quindi è partito. Per confrontare la firma ha dovuto ricevere i primi byte.' },
        { t: 'Il file dati.bin è vuoto', fb: 'Da un file vuoto il programma riceverebbe zero byte, e segnalerebbe un record incompleto.' }] },
      { d: 'Il file misura.bin contiene 15 byte. Dopo il comando `./lettore < misura.bin` il programma legge dal proprio ingresso standard prima 4 byte, poi 1, poi 4. Quanti byte gli restano da leggere?', segnaposto: 'Un numero di byte', giuste: ['6', 'sei'],
        ok: 'Il programma ha consumato 4 + 1 + 4 = 9 byte. Ne restano 15 − 9 = 6: i due della temperatura e i quattro della tensione.',
        diagnosi: [
          { se: ['9', 'nove'], msg: 'Nove sono i byte già letti. Quelli che restano sono 15 − 9.' },
          { se: ['15', 'quindici'], msg: 'Quindici è la lunghezza del file. Il programma ne ha già consumati nove.' },
          { se: ['11', 'undici'], msg: 'Hai tolto soltanto la prima lettura. Le letture sono tre: 4, 1 e 4 byte.' }
        ],
        altro: 'Il numero è diverso. Ogni lettura consuma i byte che riceve: somma le tre letture e togli il totale da 15.',
        indizi: ['Leggere dall’ingresso standard fa avanzare un cursore, come nell’unità 1.7.1.', 'Le tre letture consumano 4 + 1 + 4 byte.', 'Restano 15 − 9 byte.'],
        svolgimento: ['Prima lettura: 4 byte, la firma.', 'Seconda lettura: 1 byte, la lunghezza del nome.', 'Terza lettura: 4 byte, il nome.', 'Byte consumati: 9. Byte rimasti: 15 − 9 = 6.'] }
    ]
  }
});
