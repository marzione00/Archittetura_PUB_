'use strict';
SL.registra('1.1.3', {
  titolo: 'Dal sorgente al file eseguibile',
  obiettivo: 'Alla fine saprai elencare le quattro trasformazioni che portano dal testo di un programma a un file avviabile, e dire che cosa produce ciascuna.',
  concetti: [['file', 'Sorgente'], ['operation', 'Compilatore'], ['pila', 'Libreria'], ['riproduci', 'Eseguibile']],
  filigrana: ['operation', 'file', 'pila'],
  richiami: {
    carte: [
      { sim: 'operation', da: 'Dall’unità 0.2', t: 'Le istruzioni', d: 'Il processore esegue istruzioni elementari, una alla volta.' },
      { sim: 'pila', da: 'Dall’unità 1.1.1', t: 'Funzioni e libreria', d: 'Una funzione è un’operazione già pronta, dotata di un nome. Le funzioni di uso comune, come puts, sono raccolte in una libreria.' }
    ],
    domanda: { d: 'Prima di proseguire: chi ha scritto la funzione puts usata da hello?', o: [
      { t: 'Chi ha scritto hello', fb: 'Chi ha scritto hello si limita a chiamarla. La funzione è stata scritta una volta per tutte da altri.' },
      { t: 'Gli autori della libreria', ok: true, fb: 'La funzione sta nella libreria, pronta per ogni programma che voglia usarla.' },
      { t: 'Il processore', fb: 'Il processore esegue le istruzioni di puts, che sono state scritte dagli autori della libreria.' }
    ] }
  },
  idea: {
    titolo: 'Dal testo per le persone ai numeri per la macchina',
    termini: ['sorgente', 'compilatore', 'linguaggio assembly', 'codice macchina', 'file oggetto', 'linker', 'file eseguibile'],
    testo: [
      'Il programma hello è stato scritto da una persona, con parole e simboli pensati per essere letti da altre persone. Questo testo si chiama [[sorgente]]. Il processore conosce soltanto le proprie istruzioni elementari, che sono numeri, e del sorgente non saprebbe che cosa fare. Fra il testo e la macchina serve una traduzione.',
      'La traduzione avviene in quattro tappe, ciascuna affidata a un programma specializzato. La prima tappa prepara il testo: raccoglie le parti che il sorgente chiede di includere, come la descrizione di `puts`, e produce un sorgente completo. La seconda tappa è la più importante ed è compito del [[compilatore]]. Il compilatore trasforma il testo in istruzioni per quel particolare processore, ancora scritte con nomi leggibili. Questa forma intermedia si chiama [[linguaggio assembly]].',
      'La terza tappa converte ogni istruzione nel numero che il processore sa eseguire. L’insieme di questi numeri si chiama [[codice macchina]]. Il risultato della tappa è un [[file oggetto]], che contiene il codice macchina del nostro programma con alcuni punti ancora in sospeso. Dove hello chiama `puts` c’è soltanto un promemoria, perché le istruzioni di `puts` si trovano altrove, nella libreria.',
      'La quarta tappa chiude i punti in sospeso. Un programma chiamato [[linker]] mette insieme il file oggetto e la libreria, collega ogni chiamata alla funzione giusta e produce il [[file eseguibile]]. Fra tutti i file della catena è l’unico che il sistema operativo può caricare e avviare.',
      { fig: 'scena', w: 720, h: 150, titolo: 'La catena di costruzione di hello', nota: 'Ogni tappa legge il file prodotto dalla precedente e ne scrive uno nuovo.', els: [
        SL.el.box('f0', 10, 20, 120, 60, 'sorgente', 'hello.c', 'on'), SL.el.box('f1', 155, 20, 120, 60, 'completo', 'hello.i', ''), SL.el.box('f2', 300, 20, 120, 60, 'assembly', 'hello.s', ''), SL.el.box('f3', 445, 20, 120, 60, 'oggetto', 'hello.o', ''), SL.el.box('f4', 590, 20, 120, 60, 'eseguibile', 'hello', 'att'),
        SL.el.linea('a', 130, 50, 155, 50), SL.el.linea('b', 275, 50, 300, 50), SL.el.linea('c', 420, 50, 445, 50), SL.el.linea('d', 565, 50, 590, 50),
        SL.el.nota('n1', 96, 96, 'preparazione', 'mono'), SL.el.nota('n2', 238, 116, 'compilatore', 'mono'), SL.el.nota('n3', 380, 96, 'assemblatore', 'mono'), SL.el.nota('n4', 548, 116, 'linker', 'mono')] },
      'Ogni tappa può fermarsi con un errore, e il tipo di errore dice in quale tappa è nato. Una parentesi dimenticata viene scoperta dal compilatore. Una funzione che nessuna delle librerie indicate contiene supera invece le prime tre tappe. Se ne accorge soltanto il linker, quando cerca qualcosa da collegare a quel nome e non lo trova.'
    ]
  },
  esperimento: {
    faremo: [
      'Faremo passare il sorgente di hello attraverso la catena, una tappa alla volta. Per ogni tappa vedremo il file che entra, lo strumento che lavora e il file che esce.',
      'Potrai scegliere fra tre situazioni: la catena completa, la catena fermata dopo il compilatore, e la catena a cui manca la libreria che contiene `puts`.'
    ],
    vedrai: [
      ['file', 'I cinque file', 'In alto. Si accendono man mano che vengono prodotti.'],
      ['operation', 'I quattro strumenti', 'Al centro. Quello al lavoro è acceso in ambra.'],
      ['pila', 'La libreria', 'In basso a destra. Serve soltanto all’ultima tappa.']
    ]
  },
  lab: {
    titolo: 'La catena di costruzione',
    scena: { w: 860, h: 320 },
    atti: ['Preparazione', 'Dal testo all’assembly', 'Dall’assembly all’eseguibile', 'Bilancio'],
    nota: 'Il numero di passi dipende dalla situazione scelta: una catena che si ferma prima ha meno tappe da mostrare.',
    controlli: [{ id: 'caso', tipo: 'scelta', eti: 'Situazione', opzioni: [['completa', 'Catena completa'], ['fermata', 'Fermata dopo il compilatore'], ['manca', 'Libreria mancante']], valore: 'completa' }],
    previsione: {
      domanda: (p) => ({ completa: 'La catena lavora per intero.', fermata: 'Alla catena viene chiesto di fermarsi subito dopo il compilatore.', manca: 'La catena parte, ma la libreria che contiene puts non è disponibile.' }[p.caso]) + ' Quale sarà l’ultimo file prodotto?',
      opzioni: () => ['hello.i', 'hello.s', 'hello.o', 'hello']
    },
    confronto: (pred, esito, p) => 'Avevi previsto che l’ultimo file prodotto fosse ' + pred + '. È stato ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (p.caso === 'manca' ? 'La libreria serve soltanto al linker: le prime tre tappe non ne hanno bisogno e producono regolarmente i loro file.' : 'Ripercorri la catena: ogni strumento produce un solo file, nell’ordine hello.i, hello.s, hello.o, hello.')),
    costruisci(p) {
      const el = SL.el, passi = [];
      const FILE = [['hello.c', 'sorgente'], ['hello.i', 'sorgente completo'], ['hello.s', 'assembly'], ['hello.o', 'file oggetto'], ['hello', 'eseguibile']];
      const STR = [['preparazione', 'Raccoglie le parti da includere, come la descrizione di puts, e produce un sorgente completo.'],
        ['compilatore', 'Traduce il testo in istruzioni per il processore, scritte ancora con nomi leggibili.'],
        ['assemblatore', 'Converte ogni istruzione nel numero che il processore sa eseguire. La chiamata a puts resta in sospeso.'],
        ['linker', 'Unisce il file oggetto e la libreria, e collega la chiamata a puts al suo codice.']];
      const fatto = [true, false, false, false, false];
      let ultimo = 'hello.c', errore = false;
      const X = (k) => 20 + k * 168;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('tf', 20, 0, 'I FILE', 'mono'), el.nota('ts', 20, 134, 'GLI STRUMENTI', 'mono')];
        FILE.forEach((f, k) => els.push(el.box('f' + k, X(k), 28, 148, 84, f[1], f[0], o.file === k ? 'att' : fatto[k] ? 'on' : 'off', { sim: 'file', simL: 28 })));
        STR.forEach((s, k) => els.push(el.box('s' + k, 104 + k * 168, 160, 148, 68, 'tappa ' + (k + 1), s[0], o.str === k ? (o.err ? 'err' : 'att') : 'off', { sim: 'operation', simL: 26 })));
        els.push(el.box('lib', 600, 246, 164, 68, 'libreria', p.caso === 'manca' ? 'assente' : 'contiene puts', o.lib ? (p.caso === 'manca' ? 'err' : 'att') : (p.caso === 'manca' ? 'off' : ''), { sim: 'pila', simL: 26 }));
        if (o.pacco != null) els.push(el.pacco('pk', o.pacco[0], o.pacco[1], o.pacco[2], o.pacco[3]));
        return els;
      };
      const hud = (k) => [['Tappa', k == null ? '·' : (k + 1) + ' di 4', 'a'], ['Strumento', k == null ? '·' : STR[k][0]], ['Ultimo file', ultimo, 'c']];
      passi.push({ atto: 0, titolo: 'Il sorgente è pronto', hud: hud(), els: quadro({ file: 0 }),
        testo: 'Il file hello.c contiene il testo del programma. Gli altri quattro file non esistono ancora.' });
      const tappe = p.caso === 'fermata' ? 2 : 4;
      for (let k = 0; k < tappe; k++) {
        const atto = k < 2 ? 1 : 2;
        passi.push({ atto, titolo: 'Entra ' + FILE[k][0], hud: hud(k), els: quadro({ file: k, str: k, pacco: [104 + k * 168 + 30, 120, FILE[k][0]] }),
          testo: 'Il file ' + FILE[k][0] + ' viene consegnato allo strumento della tappa ' + (k + 1) + '.',
          chiedi: { d: 'Quale strumento lavora in questa tappa?', o: STR.map((s) => s[0]), g: k, no: 'L’ordine degli strumenti è fisso: preparazione, compilatore, assemblatore, linker. Questa è la tappa ' + (k + 1) + '.' } });
        if (k === 3) {
          passi.push({ atto, titolo: 'Il linker cerca puts', hud: hud(k), els: quadro({ str: k, lib: true, err: p.caso === 'manca' }),
            testo: p.caso === 'manca' ? 'Nel file oggetto la chiamata a puts è in sospeso. Il linker cerca il codice di puts nella libreria, ma la libreria non è disponibile.' : 'Nel file oggetto la chiamata a puts è in sospeso. Il linker trova il codice di puts nella libreria.' });
          if (p.caso === 'manca') {
            errore = true;
            passi.push({ atto, titolo: 'Errore: riferimento non definito', calc: 'puts: nessun codice da collegare', esito: ['ERRORE DEL LINKER', 'no'], hud: hud(k), els: quadro({ str: k, lib: true, err: true }),
              testo: 'Il linker non trova niente da collegare al nome puts e si ferma con un errore. Il file eseguibile non viene prodotto. Le tre tappe precedenti erano andate a buon fine.' });
            break;
          }
        }
        passi.push({ atto, titolo: 'Lavora: ' + STR[k][0], hud: hud(k), els: quadro({ str: k }),
          testo: STR[k][1] });
        fatto[k + 1] = true; ultimo = FILE[k + 1][0];
        passi.push({ atto, titolo: 'Esce ' + FILE[k + 1][0], calc: FILE[k][0] + ' → ' + FILE[k + 1][0], hud: hud(k), els: quadro({ file: k + 1, pacco: [X(k + 1) + 20, 120, FILE[k + 1][0], 'att'] }),
          testo: 'Lo strumento ha prodotto ' + FILE[k + 1][0] + ', ' + ['un sorgente completo, ancora leggibile da una persona.', 'il programma in linguaggio assembly.', 'il file oggetto, scritto in codice macchina.', 'il file eseguibile, pronto per essere avviato.'][k] });
      }
      passi.push({ atto: 3, titolo: errore ? 'La catena si è interrotta' : p.caso === 'fermata' ? 'La catena si è fermata come richiesto' : 'La catena è completa', calc: 'ultimo file: ' + ultimo, hud: hud(), els: quadro({ file: FILE.findIndex((f) => f[0] === ultimo) }),
        testo: errore ? 'L’ultimo file prodotto è hello.o. Il programma non può essere avviato finché il linker non riesce a collegare tutte le chiamate.' : p.caso === 'fermata' ? 'L’ultimo file prodotto è hello.s. Fermarsi qui è utile per leggere le istruzioni che il compilatore ha scelto per il nostro programma.' : 'L’ultimo file prodotto è hello, l’eseguibile. Dei cinque file, è l’unico che il sistema operativo può caricare e avviare.' });
      return { passi, esito: ultimo };
    }
  },
  bilancio: {
    regola: [
      'Dal sorgente all’eseguibile ci sono quattro tappe: preparazione del testo, compilazione, conversione in codice macchina e collegamento con le librerie.',
      'Ogni tappa legge un file e ne produce uno nuovo. Soltanto l’ultimo, il file eseguibile, può essere avviato.'
    ],
    errori: [
      ['Chiamare compilatore tutta la catena.', 'Il compilatore è lo strumento della seconda tappa. Le altre tre sono affidate a strumenti diversi.'],
      ['Pensare che il file oggetto si possa avviare.', 'Le sue chiamate alle funzioni di libreria sono ancora in sospeso.'],
      ['Cercare nel sorgente un errore del linker.', 'Un riferimento non definito indica una libreria mancante o un nome che nessuna libreria contiene.']
    ],
    saFare: ['Elenco le quattro tappe e il file prodotto da ciascuna.', 'Riconosco dal messaggio in quale tappa è nato un errore.', 'Spiego perché serve il linker.'],
    esercizi: [
      { d: 'Durante la costruzione di un programma compare il messaggio «riferimento non definito a calcola». In quale tappa è nato l’errore?', guida: 'Scegli la tappa.', o: [
        { t: 'Nel compilatore', fb: 'Il compilatore controlla la forma del testo. Un nome a cui non corrisponde alcun codice viene scoperto più avanti.' },
        { t: 'Nell’assemblatore', fb: 'L’assemblatore lascia in sospeso le chiamate a funzioni esterne, senza controllare che esistano.' },
        { t: 'Nel linker', ok: true, fb: 'È il linker a collegare ogni chiamata al suo codice, ed è lui ad accorgersi che per quel nome non c’è nulla.' }] },
      { d: 'Partendo da hello.c, quanti file nuovi produce la catena completa?', segnaposto: 'Un numero', giuste: ['4'],
        ok: 'I file nuovi sono hello.i, hello.s, hello.o e hello.',
        diagnosi: [
          { se: ['5'], msg: 'Hai contato anche hello.c, che esisteva già prima della costruzione.' },
          { se: ['1'], msg: 'Uno è il file che alla fine interessa, l’eseguibile. Lungo la catena, però, ogni tappa ne produce uno.' },
          { se: ['3'], msg: 'Ne manca uno. Le tappe sono quattro e ciascuna produce un file.' }
        ],
        altro: 'Il conto è diverso. Elenca le tappe e scrivi accanto a ciascuna il file che produce.',
        indizi: ['Le tappe sono quattro.', 'Ogni tappa produce esattamente un file.', 'Il sorgente esisteva già e non va contato.'],
        svolgimento: ['Preparazione: hello.i. Compilatore: hello.s.', 'Assemblatore: hello.o. Linker: hello.', 'I file nuovi sono quattro.'] }
    ],
    sfida: ['lez01_05_build_pipeline', 'Dal sorgente C al programma eseguibile']
  }
});
