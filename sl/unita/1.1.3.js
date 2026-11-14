'use strict';
SL.registra('1.1.3', {
  titolo: 'Dal sorgente al file eseguibile',
  obiettivo: 'Obiettivo: elencare le quattro trasformazioni che conducono dal testo di un programma a un file eseguibile, e indicare il prodotto di ciascuna.',
  concetti: [['file', 'Sorgente'], ['operation', 'Compilatore'], ['pila', 'Libreria'], ['riproduci', 'Eseguibile']],
  filigrana: ['operation', 'file', 'pila'],
  richiami: {
    carte: [
      { sim: 'operation', da: 'Dall’unità 0.2', t: 'Le istruzioni', d: 'Il processore esegue istruzioni elementari, una alla volta.' },
      { sim: 'pila', da: 'Dall’unità 1.1.1', t: 'Funzioni e libreria', d: 'Una funzione è un’operazione già realizzata, dotata di un nome. Le funzioni di uso comune, come puts, sono raccolte in una libreria.' }
    ],
    domanda: { d: 'Prima di proseguire: da chi è stata scritta la funzione puts impiegata da hello?', o: [
      { t: 'Dall’autore di hello', fb: 'L’autore di hello si limita a chiamarla. La funzione è stata realizzata da altri, una volta per tutti i programmi.' },
      { t: 'Dagli autori della libreria', ok: true, fb: 'La funzione appartiene alla libreria, ed è a disposizione di ogni programma.' },
      { t: 'Dal processore', fb: 'Il processore esegue le istruzioni di puts, scritte dagli autori della libreria.' }
    ] }
  },
  idea: {
    titolo: 'Dal testo sorgente al codice macchina',
    termini: ['sorgente', 'compilatore', 'linguaggio assembly', 'codice macchina', 'file oggetto', 'linker', 'file eseguibile'],
    testo: [
      'Il programma hello è scritto da una persona, con parole e simboli destinati alla lettura da parte di altre persone. Questo testo prende il nome di [[sorgente]]. Il processore esegue soltanto le proprie istruzioni elementari, che sono numeri, e il sorgente gli è inutilizzabile. Fra il testo e la macchina è necessaria una traduzione.',
      'La traduzione si articola in quattro tappe, ciascuna affidata a un programma apposito. La prima prepara il testo: riunisce le parti che il sorgente chiede di includere, come la descrizione di `puts`, e produce un sorgente completo. La seconda, la più rilevante, è compito del [[compilatore]], che traduce il testo in istruzioni per uno specifico processore, ancora espresse con nomi leggibili. Questa forma intermedia è il [[linguaggio assembly]].',
      'La terza tappa converte ogni istruzione nel numero che il processore è in grado di eseguire. L’insieme di tali numeri costituisce il [[codice macchina]]. Il prodotto della tappa è un [[file oggetto]], che contiene il codice macchina del programma con alcuni riferimenti ancora irrisolti. Nel punto in cui hello chiama `puts` compare soltanto un’annotazione, poiché le istruzioni di `puts` risiedono altrove, nella libreria.',
      'La quarta tappa risolve i riferimenti rimasti aperti. Un programma denominato [[linker]] riunisce il file oggetto e la libreria, collega ogni chiamata alla funzione corrispondente e produce il [[file eseguibile]]. Fra tutti i file della catena è il solo che il sistema operativo può caricare e avviare.',
      { fig: 'scena', w: 720, h: 150, titolo: 'La catena di costruzione di hello', nota: 'Ogni tappa legge il file prodotto dalla precedente e ne scrive uno nuovo.', els: [
        SL.el.box('f0', 10, 20, 120, 60, 'sorgente', 'hello.c', 'on'), SL.el.box('f1', 155, 20, 120, 60, 'completo', 'hello.i', ''), SL.el.box('f2', 300, 20, 120, 60, 'assembly', 'hello.s', ''), SL.el.box('f3', 445, 20, 120, 60, 'oggetto', 'hello.o', ''), SL.el.box('f4', 590, 20, 120, 60, 'eseguibile', 'hello', 'att'),
        SL.el.linea('a', 130, 50, 155, 50), SL.el.linea('b', 275, 50, 300, 50), SL.el.linea('c', 420, 50, 445, 50), SL.el.linea('d', 565, 50, 590, 50),
        SL.el.nota('n1', 96, 96, 'preparazione', 'mono'), SL.el.nota('n2', 238, 116, 'compilatore', 'mono'), SL.el.nota('n3', 380, 96, 'assemblatore', 'mono'), SL.el.nota('n4', 548, 116, 'linker', 'mono')] },
      'Ogni tappa può arrestarsi con un errore, e la natura dell’errore indica la tappa in cui esso ha origine. Una parentesi mancante è rilevata dal compilatore. Una funzione assente da tutte le librerie indicate supera invece le prime tre tappe: l’errore è rilevato soltanto dal linker, quando la ricerca del codice da collegare a quel nome resta senza esito.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento sottopone il sorgente di hello alla catena, una tappa alla volta. Per ogni tappa sono mostrati il file in ingresso, lo strumento impiegato e il file prodotto.',
      'Sono selezionabili tre situazioni: la catena completa, la catena arrestata dopo il compilatore, e la catena priva della libreria che contiene `puts`.'
    ],
    vedrai: [
      ['file', 'I cinque file', 'In alto. Sono evidenziati via via che vengono prodotti.'],
      ['operation', 'I quattro strumenti', 'Al centro. Lo strumento attivo è evidenziato in ambra.'],
      ['pila', 'La libreria', 'In basso a destra. È richiesta soltanto dall’ultima tappa.']
    ]
  },
  lab: {
    titolo: 'La catena di costruzione',
    scena: { w: 860, h: 320 },
    atti: ['Preparazione', 'Dal testo all’assembly', 'Dall’assembly all’eseguibile', 'Bilancio'],
    nota: 'Il numero dei passi dipende dalla situazione selezionata: una catena arrestata in anticipo comprende meno tappe.',
    controlli: [{ id: 'caso', tipo: 'scelta', eti: 'Situazione', opzioni: [['completa', 'Catena completa'], ['fermata', 'Arresto dopo il compilatore'], ['manca', 'Libreria mancante']], valore: 'completa' }],
    previsione: {
      domanda: (p) => ({ completa: 'La catena viene eseguita per intero.', fermata: 'La catena viene arrestata subito dopo il compilatore.', manca: 'La catena viene avviata, e la libreria che contiene puts è indisponibile.' }[p.caso]) + ' Qual è l’ultimo file prodotto?',
      opzioni: () => ['hello.i', 'hello.s', 'hello.o', 'hello']
    },
    confronto: (pred, esito, p) => 'La previsione indicava che l’ultimo file prodotto fosse ' + pred + '. È stato ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : (p.caso === 'manca' ? 'La libreria è richiesta soltanto dal linker: le prime tre tappe ne prescindono, e producono regolarmente i rispettivi file.' : 'Occorre ripercorrere la catena: ogni strumento produce un solo file, nell’ordine hello.i, hello.s, hello.o, hello.')),
    costruisci(p) {
      const el = SL.el, passi = [];
      const FILE = [['hello.c', 'sorgente'], ['hello.i', 'sorgente completo'], ['hello.s', 'assembly'], ['hello.o', 'file oggetto'], ['hello', 'eseguibile']];
      const STR = [['preparazione', 'Riunisce le parti da includere, come la descrizione di puts, e produce un sorgente completo.'],
        ['compilatore', 'Traduce il testo in istruzioni per il processore, ancora espresse con nomi leggibili.'],
        ['assemblatore', 'Converte ogni istruzione nel numero che il processore è in grado di eseguire. La chiamata a puts resta irrisolta.'],
        ['linker', 'Unisce il file oggetto e la libreria, e collega la chiamata a puts al codice corrispondente.']];
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
        testo: 'Il file hello.c contiene il testo del programma. Gli altri quattro file devono ancora essere prodotti.' });
      const tappe = p.caso === 'fermata' ? 2 : 4;
      for (let k = 0; k < tappe; k++) {
        const atto = k < 2 ? 1 : 2;
        passi.push({ atto, titolo: 'Entra ' + FILE[k][0], hud: hud(k), els: quadro({ file: k, str: k, pacco: [104 + k * 168 + 30, 120, FILE[k][0]] }),
          testo: 'Il file ' + FILE[k][0] + ' viene trasmesso allo strumento della tappa ' + (k + 1) + '.',
          chiedi: { d: 'Quale strumento opera in questa tappa?', o: STR.map((s) => s[0]), g: k, no: 'L’ordine degli strumenti è fisso: preparazione, compilatore, assemblatore, linker. Questa è la tappa ' + (k + 1) + '.' } });
        if (k === 3) {
          passi.push({ atto, titolo: 'Il linker cerca puts', hud: hud(k), els: quadro({ str: k, lib: true, err: p.caso === 'manca' }),
            testo: p.caso === 'manca' ? 'Nel file oggetto la chiamata a puts è irrisolta. Il linker cerca il codice di puts nella libreria, che risulta indisponibile.' : 'Nel file oggetto la chiamata a puts è irrisolta. Il linker individua il codice di puts nella libreria.' });
          if (p.caso === 'manca') {
            errore = true;
            passi.push({ atto, titolo: 'Errore: riferimento non definito', calc: 'puts: nessun codice da collegare', esito: ['ERRORE DEL LINKER', 'no'], hud: hud(k), els: quadro({ str: k, lib: true, err: true }),
              testo: 'La ricerca del codice da collegare al nome puts resta senza esito, e il linker si arresta con un errore. Il file eseguibile resta da produrre. Le tre tappe precedenti si erano concluse regolarmente.' });
            break;
          }
        }
        passi.push({ atto, titolo: 'Lavora: ' + STR[k][0], hud: hud(k), els: quadro({ str: k }),
          testo: STR[k][1] });
        fatto[k + 1] = true; ultimo = FILE[k + 1][0];
        passi.push({ atto, titolo: 'Esce ' + FILE[k + 1][0], calc: FILE[k][0] + ' → ' + FILE[k + 1][0], hud: hud(k), els: quadro({ file: k + 1, pacco: [X(k + 1) + 20, 120, FILE[k + 1][0], 'att'] }),
          testo: 'Lo strumento ha prodotto ' + FILE[k + 1][0] + ', ' + ['un sorgente completo, ancora leggibile da una persona.', 'il programma in linguaggio assembly.', 'il file oggetto, scritto in codice macchina.', 'il file eseguibile, pronto per l’avvio.'][k] });
      }
      passi.push({ atto: 3, titolo: errore ? 'La catena si è interrotta' : p.caso === 'fermata' ? 'La catena si è arrestata come richiesto' : 'La catena è completa', calc: 'ultimo file: ' + ultimo, hud: hud(), els: quadro({ file: FILE.findIndex((f) => f[0] === ultimo) }),
        testo: errore ? 'L’ultimo file prodotto è hello.o. Il programma potrà essere avviato soltanto quando il linker avrà collegato tutte le chiamate.' : p.caso === 'fermata' ? 'L’ultimo file prodotto è hello.s. L’arresto a questo punto consente di leggere le istruzioni scelte dal compilatore per il programma.' : 'L’ultimo file prodotto è hello, il file eseguibile. Dei cinque file è il solo che il sistema operativo può caricare e avviare.' });
      return { passi, esito: ultimo };
    }
  },
  bilancio: {
    regola: [
      'Dal sorgente al file eseguibile si succedono quattro tappe: preparazione del testo, compilazione, conversione in codice macchina e collegamento con le librerie.',
      'Ogni tappa legge un file e ne produce uno nuovo. Soltanto l’ultimo, il file eseguibile, può essere avviato.'
    ],
    errori: [
      ['Denominare compilatore l’intera catena.', 'Il compilatore è lo strumento della seconda tappa. Le altre tre sono affidate a strumenti distinti.'],
      ['Ritenere avviabile il file oggetto.', 'Le sue chiamate alle funzioni di libreria sono ancora irrisolte.'],
      ['Cercare nel sorgente la causa di un errore del linker.', 'Un riferimento non definito indica una libreria mancante o un nome che nessuna libreria contiene.']
    ],
    saFare: ['Elencare le quattro tappe e il file prodotto da ciascuna.', 'Riconoscere dal messaggio la tappa in cui ha origine un errore.', 'Spiegare la necessità del linker.'],
    esercizi: [
      { d: 'Durante la costruzione di un programma compare il messaggio «riferimento non definito a calcola». In quale tappa ha origine l’errore?', guida: 'Si scelga la tappa.', o: [
        { t: 'Nel compilatore', fb: 'Il compilatore verifica la forma del testo. Un nome privo di codice corrispondente è rilevato in una tappa successiva.' },
        { t: 'Nell’assemblatore', fb: 'L’assemblatore lascia irrisolte le chiamate a funzioni esterne, senza verificarne l’esistenza.' },
        { t: 'Nel linker', ok: true, fb: 'Il linker collega ogni chiamata al codice corrispondente, ed è pertanto la tappa in cui emerge l’assenza di codice per quel nome.' }] },
      { d: 'Partendo da hello.c, quanti file nuovi produce la catena completa?', segnaposto: 'Un numero', giuste: ['4'],
        ok: 'I file nuovi sono hello.i, hello.s, hello.o e hello.',
        diagnosi: [
          { se: ['5'], msg: 'È stato contato anche hello.c, che esisteva prima della costruzione.' },
          { se: ['1'], msg: 'Uno è il file che interessa al termine, cioè l’eseguibile. Lungo la catena, tuttavia, ogni tappa ne produce uno.' },
          { se: ['3'], msg: 'Ne manca uno. Le tappe sono quattro, e ciascuna produce un file.' }
        ],
        altro: 'Il conto è diverso. Si elenchino le tappe e si scriva accanto a ciascuna il file che produce.',
        indizi: ['Le tappe sono quattro.', 'Ogni tappa produce esattamente un file.', 'Il sorgente esisteva già, e resta escluso dal conto.'],
        svolgimento: ['Preparazione: hello.i. Compilatore: hello.s.', 'Assemblatore: hello.o. Linker: hello.', 'I file nuovi sono quattro.'] }
    ],
    sfida: ['lez01_05_build_pipeline', 'Dal sorgente C al programma eseguibile']
  }
});
