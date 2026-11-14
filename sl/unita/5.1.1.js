'use strict';
SL.unita511 = (() => {
  const BL = { A: 5, B: 8 }, PID = { A: 34, B: 35 };
  // fase: 0 l'inizio · 1 entra chi scrive · 2 la traduzione · 3 la scrittura · 4 entra chi legge · 5 la lettura
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], att = f >= 4 ? p.r : f >= 1 ? p.w : '', val = (k) => (f >= 3 && k === p.w ? p.dato : 0), wc = (o.w - 2 * o.gap) / 3;
    ['A', 'B'].forEach((k, j) => {
      const y = o.y + j * (o.h + 14), on = att === k;
      els.push(el.box(pre + 'p' + k, o.x, y, wc, o.h, 'processo ' + k + ' · PID ' + PID[k], on ? 'in esecuzione' : 'in attesa', on ? 'att' : 'on', { cls: 'stretta' }),
        el.box(pre + 't' + k, o.x + wc + o.gap, y, wc, o.h, 'tabella di ' + k + ' · 0x1000', '→ blocco ' + BL[k], on && (f === 2 || f === 5) ? 'att' : on ? 'on' : 'off', { cls: 'stretta' }),
        el.box(pre + 'm' + k, o.x + 2 * (wc + o.gap), y, wc, o.h, 'memoria · blocco ' + BL[k], 'x = ' + val(k), (f === 3 && k === p.w) || (f === 5 && k === p.r) ? 'att' : 'on', { cls: 'stretta' }));
    });
    return els;
  };
  return { BL, PID, quadro };
})();
SL.registra('5.1.1', {
  titolo: 'Il processo come astrazione di esecuzione e protezione',
  obiettivo: 'Obiettivo: indicare che cosa distingue due esecuzioni del medesimo programma, e la ragione per cui i dati che una scrive nella propria memoria restano invisibili all’altra.',
  concetti: [['process', 'Un programma, più esecuzioni'], ['tabella', 'Ogni processo ha la propria mappa'], ['scudo', 'Medesimo indirizzo, celle diverse']],
  filigrana: ['process', 'tabella', 'memory'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 1.1.5', t: 'Il processo', d: 'Un programma in esecuzione, con il proprio numero identificativo, il PID.' },
      { sim: 'privilegi', da: 'Dall’unità 2.5.1', t: 'Il kernel', d: 'La parte del sistema che amministra le risorse comuni.' },
      { sim: 'memory', da: 'Dall’unità 1.1.2', t: 'L’indirizzo', d: 'Il numero che individua una cella di memoria.' }
    ],
    domanda: { d: 'Prima di proseguire: il medesimo programma di scrittura è avviato due volte. Quanti processi sono presenti?', o: [
      { t: 'Due', ok: true, fb: 'Ogni esecuzione è un processo a sé, con il proprio PID.' },
      { t: 'Uno', fb: 'Il programma è uno solo. Le esecuzioni, cioè i processi, sono due.' },
      { t: 'Dipende dal numero di documenti', fb: 'È rilevante il numero di avvii del programma.' }
    ] }
  },
  idea: {
    titolo: 'Il medesimo indirizzo, due celle',
    termini: ['spazio di indirizzamento', 'indirizzo virtuale', 'tabella delle pagine'],
    testo: [
      'Quando il medesimo programma è avviato due volte, ogni finestra conserva un documento diverso. Il file con le istruzioni è uno solo, e le esecuzioni sono due. Ciascuna è un processo, con un proprio PID e in particolare con una propria memoria. Il Modulo V tratta i processi: la loro creazione, la ripartizione del processore, la cooperazione senza interferenze. Il punto di partenza è la proprietà da cui dipendono tutte le altre: l’isolamento.',
      'Ogni processo vede la memoria come se gli appartenesse per intero. L’insieme degli indirizzi che può impiegare è il suo [[spazio di indirizzamento]]. Gli indirizzi che compaiono nel programma sono numeri validi all’interno di tale spazio, e per questa ragione sono detti virtuali. Un [[indirizzo virtuale]] indica una cella della memoria fisica soltanto in modo indiretto. La cella corrispondente è stabilita da una tabella, diversa per ogni processo, che il kernel predispone e che il processore consulta a ogni accesso: la [[tabella delle pagine]].',
      { fig: 'scena', w: 720, h: 138, titolo: 'A ha scritto 7 all’indirizzo 0x1000, e ora B legge il medesimo indirizzo', nota: 'La tabella di B conduce al blocco 8, dove x vale ancora 0. Il 7 è nel blocco 5, che appartiene ad A.', els: SL.unita511.quadro('g', { dato: 7, w: 'A', r: 'B' }, 5, { x: 10, y: 0, w: 700, gap: 12, h: 54 }) },
      'Si considerino due processi, A e B, creati dal medesimo programma. Entrambi hanno una variabile x all’indirizzo virtuale 0x1000. La tabella di A associa tale indirizzo al blocco 5 della memoria fisica, la tabella di B al blocco 8. Quando A scrive 7 in x, è modificato il blocco 5. Quando in seguito è eseguito B, il processore impiega la tabella di B, e il medesimo indirizzo 0x1000 conduce al blocco 8, dove x vale ancora 0.',
      'Per ogni processo, 0x1000 è un nome locale. Nessuno dei due può indicare la cella dell’altro, poiché nessun indirizzo della propria tabella vi conduce. Un errore in A può alterare i dati di A, e i suoi effetti restano confinati a tale processo. I dettagli della traduzione, con pagine e blocchi, sono oggetto del Modulo VI. In questa unità è sufficiente il principio: un PID e una tabella per ciascuna esecuzione.'
    ]
  },
  esperimento: {
    faremo: [
      'Due processi del medesimo programma, A e B, hanno una variabile x all’indirizzo virtuale 0x1000, che all’inizio vale 0. I controlli fissano il processo che scrive, il valore scritto e il processo che legge immediatamente dopo.',
      'L’esperimento segue l’indirizzo attraverso la tabella del processo in esecuzione, fino al blocco di memoria fisica. È istruttivo assegnare la scrittura ad A e la lettura a B, e in seguito scrittura e lettura al medesimo processo.'
    ],
    vedrai: [
      ['process', 'I processi', 'A sinistra: A e B, con il PID. Uno solo è in esecuzione.'],
      ['tabella', 'Le tabelle', 'Al centro: il blocco a cui conduce l’indirizzo 0x1000 per ciascun processo.'],
      ['memory', 'La memoria fisica', 'A destra: i due blocchi, con il valore di x che contengono.']
    ]
  },
  lab: {
    titolo: 'Due processi, un indirizzo',
    scena: { w: 860, h: 140 },
    atti: ['Due esecuzioni', 'La scrittura', 'La lettura'],
    controlli: [
      { id: 'dato', tipo: 'scelta', eti: 'Valore scritto', opzioni: [[7, '7'], [23, '23'], [99, '99']], valore: 7 },
      { id: 'w', tipo: 'scelta', eti: 'Scrive', opzioni: [['A', 'il processo A'], ['B', 'il processo B']], valore: 'A' },
      { id: 'r', tipo: 'scelta', eti: 'Poi legge', opzioni: [['A', 'il processo A'], ['B', 'il processo B']], valore: 'B' }
    ],
    nota: 'I passi sono sempre sei. All’inizio x vale 0 in entrambi i processi.',
    previsione: {
      domanda: (p) => 'Il processo ' + p.w + ' scrive ' + p.dato + ' all’indirizzo virtuale 0x1000. Immediatamente dopo il processo ' + p.r + ' legge l’indirizzo virtuale 0x1000. Quale valore trova?',
      opzioni: (p) => [[0, '0, il valore iniziale'], [p.dato, String(p.dato)]]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il processo ' + p.r + ' legge ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.w === p.r ? 'Il processo che legge è il medesimo che ha scritto, e impiega la medesima tabella.' : 'La tabella di ' + p.r + ' conduce a un blocco diverso da quello in cui ha scritto ' + p.w + '.'),
    costruisci(p) {
      const U = SL.unita511, passi = [], stesso = p.w === p.r, letto = stesso ? p.dato : 0;
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, gap: 14, h: 56 });
      const hud = (f) => [['In esecuzione', f >= 4 ? p.r : f >= 1 ? p.w : '·', 'a'], ['0x1000 →', f >= 4 ? 'blocco ' + U.BL[p.r] : f >= 2 ? 'blocco ' + U.BL[p.w] : '·'], ['Letto', f >= 5 ? String(letto) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Due esecuzioni del medesimo programma', 'A e B eseguono il medesimo programma. Hanno PID diversi, 34 e 35, e ciascuno ha la propria tabella. Entrambi hanno la variabile x all’indirizzo virtuale 0x1000, e in entrambi x vale 0.', {});
      P(1, 1, 'Il turno del processo ' + p.w, 'Il kernel assegna il processore al processo ' + p.w + ', e attiva la sua tabella. Da questo istante ogni indirizzo è tradotto con la tabella di ' + p.w + '.', {});
      P(2, 1, 'La traduzione', 'Il programma deve scrivere in x, all’indirizzo virtuale 0x1000. Il processore consulta la tabella di ' + p.w + ': tale indirizzo corrisponde al blocco ' + U.BL[p.w] + ' della memoria fisica.', { calc: '0x1000 → blocco ' + U.BL[p.w] });
      P(3, 1, 'La scrittura', 'Il valore ' + p.dato + ' è scritto nel blocco ' + U.BL[p.w] + '. Il blocco ' + U.BL[p.w === 'A' ? 'B' : 'A'] + ', quello dell’altro processo, resta invariato.', { calc: 'blocco ' + U.BL[p.w] + ' ← ' + p.dato });
      P(4, 2, stesso ? 'Il processo ' + p.r + ' resta in esecuzione' : 'Il turno del processo ' + p.r, stesso ? 'Il processo ' + p.r + ' continua a impiegare il processore, e la tabella attiva resta la sua.' : 'Il kernel sottrae il processore a ' + p.w + ' e lo assegna a ' + p.r + '. Con il processo cambia la tabella attiva, che ora è quella di ' + p.r + '.', { chiedi: { d: 'Con quale tabella sarà tradotto l’indirizzo successivo?', o: ['Con la tabella di A', 'Con la tabella di B'], g: p.r === 'A' ? 0 : 1, no: 'Il processore impiega sempre la tabella del processo in esecuzione, che ora è ' + p.r + '.' } });
      P(5, 2, 'La lettura', 'Il processo ' + p.r + ' legge x all’indirizzo virtuale 0x1000. La sua tabella conduce al blocco ' + U.BL[p.r] + ', che contiene ' + letto + '.' + (stesso ? ' Si tratta del medesimo blocco in cui aveva scritto.' : ' La scrittura di ' + p.w + ' è avvenuta in un altro blocco, e ' + p.r + ' non può accedervi.'), { calc: '0x1000 → blocco ' + U.BL[p.r] + ' → ' + letto, esito: ['legge ' + letto, ''] });
      return { passi, esito: letto };
    }
  },
  bilancio: {
    regola: [
      'Un processo è una esecuzione di un programma: ha un PID, uno spazio di indirizzamento e una tabella delle pagine propri.',
      'Il medesimo indirizzo virtuale, in due processi, conduce a celle diverse della memoria fisica.'
    ],
    errori: [
      ['Confondere il programma con il processo.', 'Il programma è il file con le istruzioni. Il processo è una sua esecuzione, e le esecuzioni possono essere numerose.'],
      ['Ritenere che due processi con la medesima variabile la condividano.', 'Ciascuno ha la propria copia, raggiunta attraverso la propria tabella.'],
      ['Leggere un indirizzo virtuale come una posizione fisica.', 'La posizione fisica dipende dalla tabella del processo in esecuzione.']
    ],
    saFare: ['Distinguere programma e processo.', 'Seguire un indirizzo virtuale attraverso la tabella corretta.', 'Spiegare per quale ragione un processo non accede ai dati di un altro.'],
    esercizi: [
      { d: 'A e B eseguono il medesimo programma, con una variabile all’indirizzo virtuale 0x1000 che all’inizio vale 0. A vi scrive 15. In seguito B vi scrive 40. Infine A legge l’indirizzo 0x1000. Quale valore trova?', segnaposto: 'Un numero', giuste: ['15', 'quindici'],
        ok: 'A legge attraverso la propria tabella, e ritrova il 15 che aveva scritto.',
        diagnosi: [
          { se: ['40', 'quaranta'], msg: 'Il 40 è stato scritto da B nel proprio blocco. La tabella di A conduce altrove.' },
          { se: ['0', 'zero'], msg: 'A aveva scritto 15 nella propria cella, e nessun altro può modificarla.' },
          { se: ['55'], msg: 'Le due scritture riguardano celle diverse, e i valori restano separati.' }
        ],
        altro: 'Il valore è diverso. Si considerino soltanto le scritture compiute da A.',
        indizi: ['A e B hanno tabelle diverse.', 'La scrittura di B modifica il blocco di B.', 'Il blocco di A contiene ancora 15.'],
        svolgimento: ['A scrive 15 nel proprio blocco.', 'B scrive 40 nel proprio blocco.', 'A legge il proprio blocco: 15.'] },
      { d: 'Due processi del medesimo programma leggono entrambi l’indirizzo virtuale 0x2000. Accedono alla medesima cella della memoria fisica?', guida: 'Si scelga la risposta.', o: [
        { t: 'No, ciascuno traduce l’indirizzo con la propria tabella', ok: true, fb: 'Le due tabelle conducono a blocchi diversi.' },
        { t: 'Sì, l’indirizzo è il medesimo', fb: 'L’indirizzo è virtuale. La cella fisica dipende dalla tabella del processo.' },
        { t: 'Sì, poiché il programma è il medesimo', fb: 'Il programma è comune. La memoria dei dati è separata per ogni esecuzione.' }] },
      { d: 'Che cosa hanno in comune due processi creati dal medesimo programma?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il file con le istruzioni da cui hanno avuto origine', ok: true, fb: 'Tutto il resto, dal PID ai dati, è distinto.' },
        { t: 'Il PID', fb: 'Ogni processo ha un PID diverso.' },
        { t: 'Il contenuto delle variabili', fb: 'Ogni processo ha le proprie variabili, nella propria memoria.' }] }
    ],
    sfida: ['cslez5_1_01_processes', 'Programmi, processi e parallelismo']
  }
});
