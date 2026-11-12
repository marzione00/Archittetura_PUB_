'use strict';
SL.registra('0.2', {
  titolo: 'Programmi e dati',
  obiettivo: 'Alla fine saprai distinguere un programma dai dati su cui lavora ed eseguire a mano un programma di poche istruzioni.',
  concetti: [['operation', 'Istruzione'], ['richiami', 'Programma'], ['memory', 'Dati']],
  filigrana: ['operation', 'richiami', 'memory'],
  richiami: {
    carte: [
      { sim: 'cpu', da: 'Dall’unità 0.1', t: 'Il processore', d: 'È l’unica parte del calcolatore che esegue operazioni sui dati.' },
      { sim: 'memory', da: 'Dall’unità 0.1', t: 'La memoria', d: 'Un casellario in cui i dati aspettano di essere usati. Ogni casella conserva un valore.' }
    ],
    domanda: { d: 'Prima di proseguire: quale parte del calcolatore esegue le operazioni?', o: [
      { t: 'La memoria', fb: 'La memoria conserva i dati. A eseguire le operazioni è il processore.' },
      { t: 'Il processore', ok: true, fb: 'Il processore legge i dati dalla memoria, li trasforma e vi deposita il risultato.' },
      { t: 'Lo schermo', fb: 'Lo schermo è un dispositivo di uscita. A eseguire le operazioni è il processore.' }
    ] }
  },
  idea: {
    titolo: 'Una ricetta per il processore',
    termini: ['istruzione', 'programma', 'esecuzione'],
    testo: [
      'Il processore sa fare pochissime cose, tutte molto semplici: copiare un dato da una casella all’altra, sommare due numeri, confrontarli. La sua forza sta nel farle in fretta e senza stancarsi. Per ottenere qualcosa di utile bisogna dirgli quali operazioni compiere e in quale ordine.',
      'Ogni singolo ordine si chiama [[istruzione]]. Un elenco ordinato di istruzioni si chiama [[programma]]. Somiglia a una ricetta di cucina: «prendi due uova», «sbattile», «versa in padella». La ricetta resta la stessa ogni volta che la usi, mentre le uova cambiano. Allo stesso modo un programma resta identico e lavora ogni volta su dati diversi.',
      'Il processore esegue le istruzioni una alla volta, dall’alto verso il basso, e tiene il segno della riga a cui è arrivato. Seguire un programma in questo modo si chiama [[esecuzione]]. Durante l’esecuzione il programma resta fermo, mentre i dati nelle caselle della memoria possono ricevere un valore nuovo a ogni istruzione.',
      { fig: 'scena', w: 700, h: 190, titolo: 'Un programma di tre righe e la casella su cui lavora', nota: 'Dopo la terza riga la casella A contiene 11: prima 4, poi 8, poi 11.', els: [
        SL.el.box('r1', 20, 10, 400, 50, 'riga 1', 'metti 4 nella casella A', 'on', { riga: true }),
        SL.el.box('r2', 20, 70, 400, 50, 'riga 2', 'raddoppia A', 'on', { riga: true }),
        SL.el.box('r3', 20, 130, 400, 50, 'riga 3', 'somma 3 ad A', 'att', { riga: true }),
        SL.el.linea('l', 420, 155, 520, 100, 'att'),
        SL.el.cella('a', 520, 60, 150, 80, '11', 'att', { so: 'casella A' })] },
      'Un dettaglio sorprende chi lo incontra per la prima volta: anche il programma sta in memoria, accanto ai dati. Le istruzioni sono conservate in caselle, proprio come i numeri su cui lavorano. A distinguere le une dagli altri è soltanto l’uso che il processore ne fa: le istruzioni le esegue, i dati li trasforma.',
      'Lo stesso programma con dati diversi dà risultati diversi, e gli stessi dati con programmi diversi fanno altrettanto. Nell’esperimento eseguirai due piccole ricette sugli stessi numeri e vedrai che cosa resta fermo e che cosa cambia.'
    ]
  },
  esperimento: {
    faremo: [
      'Eseguiremo a mano un programma di sei righe, una riga per volta, come farebbe il processore. Per ogni riga ci sono due momenti: la lettura dell’istruzione e la sua esecuzione.',
      'Potrai scegliere fra due ricette che contengono le stesse istruzioni in un ordine diverso, e cambiare i due numeri di partenza.'
    ],
    vedrai: [
      ['richiami', 'Il programma', 'A sinistra, le sei righe. Quella accesa in ambra è la riga a cui è arrivato il processore.'],
      ['memory', 'Le caselle A e B', 'A destra, i dati. Cambiano valore quando un’istruzione li modifica.'],
      ['terminale', 'Lo schermo', 'In basso a destra, mostra un valore soltanto quando un’istruzione lo ordina.']
    ]
  },
  lab: {
    titolo: 'Due ricette, gli stessi numeri',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'I dati entrano nelle caselle', 'Le trasformazioni', 'L’uscita'],
    nota: 'Ogni riga del programma richiede due passi: uno per leggerla e uno per eseguirla.',
    controlli: [
      { id: 'ricetta', tipo: 'scelta', eti: 'Ricetta', opzioni: [['sr', 'Somma, poi raddoppia'], ['rs', 'Raddoppia, poi somma']], valore: 'sr' },
      { id: 'x', tipo: 'num', eti: 'Primo numero', min: 1, max: 9, salti: [1], valore: 4 },
      { id: 'y', tipo: 'num', eti: 'Secondo numero', min: 1, max: 9, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => 'I numeri di partenza sono ' + p.x + ' e ' + p.y + ', e la ricetta è «' + (p.ricetta === 'sr' ? 'somma, poi raddoppia' : 'raddoppia, poi somma') + '». Quale numero mostrerà lo schermo alla fine?',
      opzioni: (p) => Array.from(new Set([(p.x + p.y) * 2 - 1, p.x * 2 - 1 + p.y, (p.x + p.y) * 2, p.x + p.y, p.x * 2 + p.y])).sort((a, b) => a - b)
    },
    costruisci(p) {
      const el = SL.el, passi = [];
      const somma = { t: 'somma B ad A', f: (s) => { s.A += s.B; }, c: (a, s) => a + ' + ' + s.B + ' = ' + (a + s.B) };
      const doppio = { t: 'raddoppia A', f: (s) => { s.A *= 2; }, c: (a) => a + ' × 2 = ' + a * 2 };
      const meno = { t: 'togli 1 da A', f: (s) => { s.A -= 1; }, c: (a) => a + ' − 1 = ' + (a - 1) };
      const prog = [
        { t: 'metti ' + p.x + ' nella casella A', f: (s) => { s.A = p.x; }, c: () => 'A = ' + p.x, carica: true },
        { t: 'metti ' + p.y + ' nella casella B', f: (s) => { s.B = p.y; }, c: () => 'B = ' + p.y, carica: true }
      ].concat(p.ricetta === 'sr' ? [somma, doppio, meno] : [doppio, meno, somma]).concat([{ t: 'mostra A sullo schermo', mostra: true, c: (a) => 'schermo = ' + a }]);
      const st = { A: null, B: null, schermo: null };
      const quadro = (riga, fase, tocca) => {
        const els = [el.nota('tp', 20, 0, 'IL PROGRAMMA', 'mono'), el.nota('td', 520, 0, 'I DATI', 'mono')];
        prog.forEach((r, k) => els.push(el.box('r' + k, 20, 28 + k * 49, 430, 43, 'riga ' + (k + 1), r.t, k === riga ? 'att' : k < riga ? 'on' : '', { riga: true })));
        els.push(el.cella('A', 520, 52, 140, 84, st.A === null ? '·' : String(st.A), tocca === 'A' ? 'att' : st.A === null ? '' : 'on', { so: 'casella A' }));
        els.push(el.cella('B', 690, 52, 140, 84, st.B === null ? '·' : String(st.B), tocca === 'B' ? 'att' : st.B === null ? '' : 'on', { so: 'casella B' }));
        els.push(el.box('s', 520, 200, 310, 96, 'uscita', st.schermo === null ? 'schermo vuoto' : 'schermo: ' + st.schermo, tocca === 's' ? 'on' : '', { sim: 'terminale' }));
        if (riga >= 0 && riga < prog.length) els.push(el.pacco('seg', 458, 34 + riga * 49, fase === 'leggi' ? 'leggo' : 'eseguo', fase === 'leggi' ? 'att' : ''));
        return els;
      };
      const hud = (riga) => [['Riga', riga == null ? '·' : riga + 1, 'a'], ['Casella A', st.A === null ? '·' : st.A, 'c'], ['Casella B', st.B === null ? '·' : st.B, 'c']];
      passi.push({ atto: 0, titolo: 'Il programma è pronto', hud: hud(null), els: quadro(-1),
        testo: 'Le sei righe del programma sono in memoria, e le caselle A e B sono ancora vuote. Il processore comincerà dalla prima riga.' });
      prog.forEach((r, k) => {
        const atto = r.carica ? 1 : r.mostra ? 3 : 2;
        passi.push({ atto, titolo: 'Lettura della riga ' + (k + 1), hud: hud(k), els: quadro(k, 'leggi'),
          testo: 'Il processore legge l’istruzione «' + r.t + '». Per ora nessun dato è cambiato.' });
        const prima = st.A;
        if (!r.carica && !r.mostra) {
          const copia = { A: st.A, B: st.B }; r.f(copia);
          const sbagli = Array.from(new Set([prima, copia.A + 1, prima + 2].filter((v) => v !== copia.A))).slice(0, 2);
          const opz = [copia.A].concat(sbagli).sort((a, b) => a - b);
          passi[passi.length - 1].chiedi = { d: 'La casella A contiene ' + prima + '. Quanto conterrà dopo «' + r.t + '»?', o: opz.map(String), g: opz.indexOf(copia.A),
            no: 'Applica l’istruzione al valore attuale di A, che è ' + prima + (r === somma ? ', usando il valore di B, che è ' + st.B + '.' : '.') };
        }
        if (r.mostra) st.schermo = st.A; else r.f(st);
        passi.push({ atto, titolo: 'Esecuzione della riga ' + (k + 1), calc: r.c(prima, { B: st.B }), hud: hud(k), els: quadro(k, 'esegui', r.mostra ? 's' : k === 1 ? 'B' : 'A'),
          testo: r.carica ? 'La casella ' + (k === 0 ? 'A' : 'B') + ' riceve il suo primo valore.' : r.mostra ? 'Lo schermo riceve una copia del contenuto di A. La casella conserva il suo valore.' : 'La casella A riceve il valore nuovo, ' + st.A + '. Il valore precedente, ' + prima + ', è stato sostituito e non esiste più.' });
      });
      passi.push({ atto: 3, titolo: 'Il programma è terminato', calc: 'schermo = ' + st.schermo, hud: hud(null), els: quadro(prog.length, null, 's'),
        testo: 'Tutte le righe sono state eseguite. Il programma è rimasto identico dall’inizio alla fine, mentre la casella A ha cambiato valore più volte. Con l’altra ricetta le stesse istruzioni, in ordine diverso, portano a un altro risultato.' });
      return { passi, esito: st.schermo };
    }
  },
  bilancio: {
    regola: [
      'Un programma è un elenco ordinato di istruzioni. Il processore le esegue una alla volta, dalla prima all’ultima.',
      'Durante l’esecuzione il programma resta fermo e i dati cambiano. Cambiare l’ordine delle istruzioni può cambiare il risultato.'
    ],
    errori: [
      ['Eseguire le righe nell’ordine più comodo.', 'L’ordine fa parte del programma: «somma e poi raddoppia» e «raddoppia e poi somma» sono due programmi diversi.'],
      ['Dimenticare che una casella contiene un solo valore.', 'Quando arriva un valore nuovo, quello vecchio viene sostituito.'],
      ['Confondere programma e dati.', 'Il programma dice che cosa fare; i dati sono ciò su cui lo si fa.']
    ],
    saFare: ['Distinguo un’istruzione da un dato.', 'Eseguo a mano un programma breve, tenendo il conto dei valori nelle caselle.', 'Spiego perché l’ordine delle istruzioni conta.'],
    esercizi: [
      { d: 'Un programma dice: metti 4 in A; raddoppia A; somma 3 ad A; raddoppia A. Quanto vale A alla fine?', segnaposto: 'Un numero', giuste: ['22'],
        ok: 'I valori di A sono, nell’ordine, 4, 8, 11 e 22.',
        diagnosi: [
          { se: ['28'], msg: 'Hai sommato 3 prima del primo raddoppio. Le istruzioni vanno eseguite nell’ordine in cui sono scritte: prima raddoppia, poi somma.' },
          { se: ['19'], msg: 'Hai eseguito i due raddoppi di seguito e sommato 3 alla fine. La somma viene prima del secondo raddoppio.' },
          { se: ['11'], msg: 'Ti sei fermato alla terza istruzione. Ne manca una: l’ultimo raddoppio.' },
          { se: ['14'], msg: 'Hai saltato il primo raddoppio. Dopo «metti 4 in A» la casella va raddoppiata subito.' }
        ],
        altro: 'Il valore è diverso. Scrivi il contenuto di A dopo ogni istruzione, una riga alla volta.',
        indizi: ['Dopo la seconda istruzione A vale 8.', 'Dopo la terza istruzione A vale 11.', 'L’ultima istruzione raddoppia 11.'],
        svolgimento: ['Metti 4 in A: A vale 4.', 'Raddoppia A: A vale 8. Somma 3 ad A: A vale 11.', 'Raddoppia A: A vale 22.'] },
      { d: 'Esegui due volte lo stesso programma, la seconda volta con numeri di partenza diversi. Che cosa cambia fra le due esecuzioni?', guida: 'Scegli che cosa cambia.', o: [
        { t: 'Le istruzioni', fb: 'Il programma è lo stesso, quindi le istruzioni sono identiche e lavorano su numeri diversi.' },
        { t: 'I valori nelle caselle', ok: true, fb: 'Il programma resta identico e lavora su dati diversi, quindi cambiano i valori nelle caselle e il risultato.' },
        { t: 'L’ordine delle righe', fb: 'L’ordine fa parte del programma e resta quello. Cambiano i dati.' }] }
    ]
  }
});
