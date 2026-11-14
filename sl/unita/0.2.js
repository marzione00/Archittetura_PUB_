'use strict';
SL.registra('0.2', {
  titolo: 'Programmi e dati',
  obiettivo: 'Obiettivo: distinguere un programma dai dati sui quali opera, ed eseguire manualmente un programma di poche istruzioni.',
  concetti: [['operation', 'Istruzione'], ['richiami', 'Programma'], ['memory', 'Dati']],
  filigrana: ['operation', 'richiami', 'memory'],
  richiami: {
    carte: [
      { sim: 'cpu', da: 'Dall’unità 0.1', t: 'Il processore', d: 'È la sola parte del calcolatore che esegue operazioni sui dati.' },
      { sim: 'memory', da: 'Dall’unità 0.1', t: 'La memoria', d: 'Insieme ordinato di caselle nelle quali i dati sono conservati. Ogni casella conserva un valore.' }
    ],
    domanda: { d: 'Prima di proseguire: quale parte del calcolatore esegue le operazioni?', o: [
      { t: 'La memoria', fb: 'La memoria conserva i dati. Le operazioni sono eseguite dal processore.' },
      { t: 'Il processore', ok: true, fb: 'Il processore legge i dati dalla memoria, li elabora e vi deposita il risultato.' },
      { t: 'Lo schermo', fb: 'Lo schermo è un dispositivo di uscita. Le operazioni sono eseguite dal processore.' }
    ] }
  },
  idea: {
    titolo: 'Istruzioni, programma ed esecuzione',
    termini: ['istruzione', 'programma', 'esecuzione'],
    testo: [
      'Il processore dispone di un repertorio ridotto di operazioni elementari: copiare un dato da una casella a un’altra, sommare due numeri, confrontarli. La sua utilità deriva dalla rapidità e dalla regolarità con cui le compie. Per ottenere un risultato occorre pertanto specificare quali operazioni eseguire, e in quale ordine.',
      'Ciascuna operazione richiesta al processore prende il nome di [[istruzione]]. Una sequenza ordinata di istruzioni costituisce un [[programma]]. Il programma è indipendente dai valori sui quali opera: resta identico a ogni utilizzo, mentre i dati possono cambiare da un utilizzo all’altro.',
      'Il processore esegue le istruzioni una alla volta, nell’ordine in cui sono scritte, e tiene traccia della riga raggiunta. Questo procedimento prende il nome di [[esecuzione]]. Durante l’esecuzione il programma resta invariato, mentre i dati contenuti nelle caselle della memoria possono assumere un valore nuovo a ogni istruzione.',
      { fig: 'scena', w: 700, h: 190, titolo: 'Un programma di tre righe e la casella sulla quale opera', nota: 'Al termine della terza riga la casella A contiene 11: prima 4, poi 8, infine 11.', els: [
        SL.el.box('r1', 20, 10, 400, 50, 'riga 1', 'porre 4 nella casella A', 'on', { riga: true }),
        SL.el.box('r2', 20, 70, 400, 50, 'riga 2', 'raddoppiare A', 'on', { riga: true }),
        SL.el.box('r3', 20, 130, 400, 50, 'riga 3', 'sommare 3 ad A', 'att', { riga: true }),
        SL.el.linea('l', 420, 155, 520, 100, 'att'),
        SL.el.cella('a', 520, 60, 150, 80, '11', 'att', { so: 'casella A' })] },
      'Anche il programma è conservato in memoria, accanto ai dati: le istruzioni occupano caselle, al pari dei numeri sui quali operano. La distinzione fra istruzioni e dati dipende esclusivamente dall’uso che ne fa il processore, il quale esegue le prime ed elabora i secondi.',
      'Lo stesso programma applicato a dati diversi produce risultati diversi, e lo stesso vale per programmi diversi applicati agli stessi dati. L’esperimento esegue due programmi sugli stessi numeri, e mette in evidenza ciò che resta invariato e ciò che cambia.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento esegue manualmente un programma di sei righe, una riga alla volta, secondo il procedimento seguito dal processore. Ogni riga comporta due momenti: la lettura dell’istruzione e la sua esecuzione.',
      'Sono disponibili due programmi, composti dalle stesse istruzioni disposte in ordine diverso. I due numeri di partenza sono modificabili.'
    ],
    vedrai: [
      ['richiami', 'Il programma', 'A sinistra, le sei righe. La riga evidenziata in ambra è quella raggiunta dal processore.'],
      ['memory', 'Le caselle A e B', 'A destra, i dati. Il loro valore cambia quando un’istruzione li modifica.'],
      ['terminale', 'Lo schermo', 'In basso a destra. Presenta un valore soltanto quando un’istruzione lo richiede.']
    ]
  },
  lab: {
    titolo: 'Due programmi sugli stessi numeri',
    scena: { w: 860, h: 330 },
    atti: ['Preparazione', 'Caricamento dei dati nelle caselle', 'Elaborazione', 'L’uscita'],
    nota: 'Ogni riga del programma richiede due passi: la lettura e l’esecuzione.',
    controlli: [
      { id: 'ricetta', tipo: 'scelta', eti: 'Programma', opzioni: [['sr', 'Prima la somma, poi il raddoppio'], ['rs', 'Prima il raddoppio, poi la somma']], valore: 'sr' },
      { id: 'x', tipo: 'num', eti: 'Primo numero', min: 1, max: 9, salti: [1], valore: 4 },
      { id: 'y', tipo: 'num', eti: 'Secondo numero', min: 1, max: 9, salti: [1], valore: 3 }
    ],
    previsione: {
      domanda: (p) => 'I numeri di partenza sono ' + p.x + ' e ' + p.y + ', e il programma è «' + (p.ricetta === 'sr' ? 'prima la somma, poi il raddoppio' : 'prima il raddoppio, poi la somma') + '». Quale numero compare sullo schermo al termine?',
      opzioni: (p) => Array.from(new Set([(p.x + p.y) * 2 - 1, p.x * 2 - 1 + p.y, (p.x + p.y) * 2, p.x + p.y, p.x * 2 + p.y])).sort((a, b) => a - b)
    },
    costruisci(p) {
      const el = SL.el, passi = [];
      const somma = { t: 'sommare B ad A', f: (s) => { s.A += s.B; }, c: (a, s) => a + ' + ' + s.B + ' = ' + (a + s.B) };
      const doppio = { t: 'raddoppiare A', f: (s) => { s.A *= 2; }, c: (a) => a + ' × 2 = ' + a * 2 };
      const meno = { t: 'sottrarre 1 da A', f: (s) => { s.A -= 1; }, c: (a) => a + ' − 1 = ' + (a - 1) };
      const prog = [
        { t: 'porre ' + p.x + ' nella casella A', f: (s) => { s.A = p.x; }, c: () => 'A = ' + p.x, carica: true },
        { t: 'porre ' + p.y + ' nella casella B', f: (s) => { s.B = p.y; }, c: () => 'B = ' + p.y, carica: true }
      ].concat(p.ricetta === 'sr' ? [somma, doppio, meno] : [doppio, meno, somma]).concat([{ t: 'mostrare A sullo schermo', mostra: true, c: (a) => 'schermo = ' + a }]);
      const st = { A: null, B: null, schermo: null };
      const quadro = (riga, fase, tocca) => {
        const els = [el.nota('tp', 20, 0, 'IL PROGRAMMA', 'mono'), el.nota('td', 520, 0, 'I DATI', 'mono')];
        prog.forEach((r, k) => els.push(el.box('r' + k, 20, 28 + k * 49, 430, 43, 'riga ' + (k + 1), r.t, k === riga ? 'att' : k < riga ? 'on' : '', { riga: true })));
        els.push(el.cella('A', 520, 52, 140, 84, st.A === null ? '·' : String(st.A), tocca === 'A' ? 'att' : st.A === null ? '' : 'on', { so: 'casella A' }));
        els.push(el.cella('B', 690, 52, 140, 84, st.B === null ? '·' : String(st.B), tocca === 'B' ? 'att' : st.B === null ? '' : 'on', { so: 'casella B' }));
        els.push(el.box('s', 520, 200, 310, 96, 'uscita', st.schermo === null ? 'schermo vuoto' : 'schermo: ' + st.schermo, tocca === 's' ? 'on' : '', { sim: 'terminale' }));
        if (riga >= 0 && riga < prog.length) els.push(el.pacco('seg', 458, 34 + riga * 49, fase === 'leggi' ? 'lettura' : 'esecuzione', fase === 'leggi' ? 'att' : ''));
        return els;
      };
      const hud = (riga) => [['Riga', riga == null ? '·' : riga + 1, 'a'], ['Casella A', st.A === null ? '·' : st.A, 'c'], ['Casella B', st.B === null ? '·' : st.B, 'c']];
      passi.push({ atto: 0, titolo: 'Il programma è pronto', hud: hud(null), els: quadro(-1),
        testo: 'Le sei righe del programma sono in memoria, e le caselle A e B sono vuote. L’esecuzione comincia dalla prima riga.' });
      prog.forEach((r, k) => {
        const atto = r.carica ? 1 : r.mostra ? 3 : 2;
        passi.push({ atto, titolo: 'Lettura della riga ' + (k + 1), hud: hud(k), els: quadro(k, 'leggi'),
          testo: 'Il processore legge l’istruzione «' + r.t + '». Nessun dato è stato ancora modificato.' });
        const prima = st.A;
        if (!r.carica && !r.mostra) {
          const copia = { A: st.A, B: st.B }; r.f(copia);
          const sbagli = Array.from(new Set([prima, copia.A + 1, prima + 2].filter((v) => v !== copia.A))).slice(0, 2);
          const opz = [copia.A].concat(sbagli).sort((a, b) => a - b);
          passi[passi.length - 1].chiedi = { d: 'La casella A contiene ' + prima + '. Quale valore contiene dopo «' + r.t + '»?', o: opz.map(String), g: opz.indexOf(copia.A),
            no: 'L’istruzione va applicata al valore attuale di A, pari a ' + prima + (r === somma ? ', con il valore di B, pari a ' + st.B + '.' : '.') };
        }
        if (r.mostra) st.schermo = st.A; else r.f(st);
        passi.push({ atto, titolo: 'Esecuzione della riga ' + (k + 1), calc: r.c(prima, { B: st.B }), hud: hud(k), els: quadro(k, 'esegui', r.mostra ? 's' : k === 1 ? 'B' : 'A'),
          testo: r.carica ? 'La casella ' + (k === 0 ? 'A' : 'B') + ' riceve il primo valore.' : r.mostra ? 'Lo schermo riceve una copia del contenuto di A. La casella conserva il proprio valore.' : 'La casella A riceve il valore nuovo, ' + st.A + '. Il valore precedente, ' + prima + ', è stato sostituito ed è andato perduto.' });
      });
      passi.push({ atto: 3, titolo: 'Il programma è terminato', calc: 'schermo = ' + st.schermo, hud: hud(null), els: quadro(prog.length, null, 's'),
        testo: 'Tutte le righe sono state eseguite. Il programma è rimasto invariato dall’inizio alla fine, mentre la casella A ha cambiato valore più volte. Con l’altro programma le stesse istruzioni, disposte in ordine diverso, conducono a un risultato differente.' });
      return { passi, esito: st.schermo };
    }
  },
  bilancio: {
    regola: [
      'Un programma è una sequenza ordinata di istruzioni. Il processore le esegue una alla volta, dalla prima all’ultima.',
      'Durante l’esecuzione il programma resta invariato, mentre i dati cambiano. Una diversa disposizione delle istruzioni può modificare il risultato.'
    ],
    errori: [
      ['Eseguire le righe in un ordine diverso da quello scritto.', 'L’ordine è parte del programma: «sommare e poi raddoppiare» e «raddoppiare e poi sommare» sono due programmi distinti.'],
      ['Trascurare che una casella contiene un solo valore.', 'L’arrivo di un valore nuovo sostituisce il valore precedente.'],
      ['Confondere programma e dati.', 'Il programma specifica le operazioni da compiere; i dati sono i valori sui quali esse vengono compiute.']
    ],
    saFare: ['Distinguere un’istruzione da un dato.', 'Eseguire manualmente un programma breve, annotando i valori contenuti nelle caselle.', 'Spiegare perché l’ordine delle istruzioni influisce sul risultato.'],
    esercizi: [
      { d: 'Un programma è composto dalle istruzioni: porre 4 in A; raddoppiare A; sommare 3 ad A; raddoppiare A. Quale valore contiene A al termine?', segnaposto: 'Un numero', giuste: ['22'],
        ok: 'I valori di A sono, nell’ordine, 4, 8, 11 e 22.',
        diagnosi: [
          { se: ['28'], msg: 'Il valore 3 è stato sommato prima del primo raddoppio. Le istruzioni vanno eseguite nell’ordine in cui sono scritte: prima il raddoppio, poi la somma.' },
          { se: ['19'], msg: 'I due raddoppi sono stati eseguiti di seguito, e la somma soltanto alla fine. La somma precede il secondo raddoppio.' },
          { se: ['11'], msg: 'L’esecuzione è stata interrotta alla terza istruzione. Manca l’ultimo raddoppio.' },
          { se: ['14'], msg: 'È stato omesso il primo raddoppio, che segue immediatamente «porre 4 in A».' }
        ],
        altro: 'Il valore è diverso. Si scriva il contenuto di A dopo ogni istruzione, una riga alla volta.',
        indizi: ['Dopo la seconda istruzione A vale 8.', 'Dopo la terza istruzione A vale 11.', 'L’ultima istruzione raddoppia 11.'],
        svolgimento: ['Porre 4 in A: A vale 4.', 'Raddoppiare A: A vale 8. Sommare 3 ad A: A vale 11.', 'Raddoppiare A: A vale 22.'] },
      { d: 'Lo stesso programma viene eseguito due volte, la seconda con numeri di partenza diversi. Che cosa cambia fra le due esecuzioni?', guida: 'Si indichi che cosa cambia.', o: [
        { t: 'Le istruzioni', fb: 'Il programma è lo stesso: le istruzioni sono identiche, e operano su numeri diversi.' },
        { t: 'I valori nelle caselle', ok: true, fb: 'Il programma resta identico e opera su dati diversi: cambiano pertanto i valori nelle caselle e il risultato.' },
        { t: 'L’ordine delle righe', fb: 'L’ordine è parte del programma, e resta invariato. Cambiano i dati.' }] }
    ]
  }
});
