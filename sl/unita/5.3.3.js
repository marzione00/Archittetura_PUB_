'use strict';
SL.unita533 = (() => {
  // simulazione round-robin: lavori A 5, B 3, C 2; quanto q; costo s fra processi diversi
  const traccia = (p) => {
    const coda = [['A', 5], ['B', 3], ['C', 2]], turni = []; let t = 0, prec = null, cambi = 0;
    while (coda.length) {
      const j = coda.shift();
      if (prec && prec !== j[0] && p.s > 0) { turni.push({ n: '·', da: t, d: p.s, cambio: true }); t += p.s; }
      if (prec && prec !== j[0]) cambi++;
      const d = Math.min(p.q, j[1]); turni.push({ n: j[0], da: t, d, resta: j[1] - d }); t += d; prec = j[0];
      if (j[1] - d > 0) coda.push([j[0], j[1] - d]);
    }
    return { turni, fine: t, cambi, primaB: turni.find((x) => x.n === 'B').da };
  };
  // striscia: mostra i turni fino all'indice «fino» escluso
  const striscia = (pre, T, fino, o) => {
    const el = SL.el, els = [];
    for (let k = 0; k < 15; k++) { const j = T.turni.findIndex((x) => k >= x.da && k < x.da + x.d), vis = j >= 0 && j < fino, x = j >= 0 ? T.turni[j] : null; els.push(el.cella(pre + k, o.x + k * (o.wc + 3), o.y, o.wc, 34, vis ? x.n : '', !vis ? '' : x.cambio ? 'err' : j === fino - 1 && !o.fine ? 'att' : 'on', { gi: String(k), piccola: true })); }
    return els;
  };
  return { traccia, striscia };
})();
SL.registra('5.3.3', {
  titolo: 'Round-robin e costo della prelazione',
  obiettivo: 'Obiettivo: simulare la politica round-robin con un dato quanto, e spiegare perché un quanto breve migliora la prontezza e allunga la durata complessiva.',
  concetti: [['coda', 'Un turno a testa, a rotazione'], ['clock', 'Il quanto decide la prontezza'], ['bilancio', 'Ogni cambio ha un costo']],
  filigrana: ['coda', 'clock', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 4.4.4', t: 'Il round-robin', d: 'Servire a rotazione, ripartendo ogni volta dal successivo. Sul bus ordinava i richiedenti.' },
      { sim: 'clock', da: 'Dall’unità 5.1.2', t: 'Il quanto di tempo', d: 'La durata massima di un turno sul processore.' },
      { sim: 'register', da: 'Dall’unità 5.1.3', t: 'Il cambio di contesto', d: 'Salvare i registri di un processo e caricare quelli di un altro richiede tempo.' }
    ],
    domanda: { d: 'Prima di proseguire: un lavoro ha bisogno di 5 ms e riceve turni da 2 ms. Quanti turni gli servono?', o: [
      { t: '3', ok: true, fb: 'Due turni pieni coprono 4 ms, e il terzo l’ultimo millisecondo.' },
      { t: '2', fb: 'Due turni coprono 4 ms. Ne manca ancora uno.' },
      { t: '5', fb: 'Ogni turno dura fino a 2 ms.' }
    ] }
  },
  idea: {
    titolo: 'Un po’ per uno',
    termini: ['tempo di risposta di un processo', 'tempo di completamento'],
    testo: [
      'Con FCFS e SJF un lavoro, una volta partito, tiene il processore fino alla fine. Chi è in coda dietro a un lavoro lungo non vede succedere nulla per molto tempo. Per un sistema usato da persone questo pesa: conta la prontezza, cioè quanto presto ogni programma dà un primo segno di vita. La misura è il [[tempo di risposta di un processo|tempo di risposta]]: il tempo fra l’arrivo di un lavoro e il suo primo turno sul processore.',
      'Il round-robin applica ai processi la rotazione già vista per il bus. Il primo della coda dei pronti riceve il processore per un quanto al massimo. Se finisce prima, il processore passa subito al successivo. Se alla scadenza ha ancora lavoro, torna in fondo alla coda. Nessuno aspetta più di un giro completo.',
      { fig: 'scena', w: 720, h: 100, titolo: 'A, B e C con burst di 5, 3 e 2 ms, quanto di 2 ms, cambio di 1 ms', nota: 'Le caselle con il puntino sono i cambi di contesto. I turni sono A, B, C, A, B, A: cinque cambi, e tutto finisce a 15 ms.', els: SL.unita533.striscia('g', SL.unita533.traccia({ q: 2, s: 1 }), 99, { x: 10, y: 8, wc: 43, fine: true }) },
      'La rotazione ha un prezzo. Passare da un processo a un altro richiede un cambio di contesto, e durante il cambio il processore non fa lavoro utile. Nell’esempio i burst sommano 10 ms. Con un quanto di 2 ms servono cinque cambi da 1 ms, e l’ultimo lavoro termina a 15 ms. Il momento in cui un lavoro finisce, contato dal suo arrivo, è il suo [[tempo di completamento]].',
      'Con un quanto di 4 ms i turni diventano A, B, C, A. I cambi scendono a tre, e tutto finisce a 13 ms. In compenso B riceve il primo turno a 5 ms anziché a 3. La scelta del quanto è quindi un compromesso. Un quanto breve dà risposte pronte e spreca tempo nei cambi. Un quanto lungo spreca meno, e al limite trasforma il round-robin in FCFS.'
    ]
  },
  esperimento: {
    faremo: [
      'A, B e C sono pronti all’istante 0, in quest’ordine, con burst di 5, 3 e 2 ms. Sceglierai il quanto e il costo di un cambio di contesto.',
      'Costruiremo la riga del tempo un turno alla volta, contando i cambi. Guarda due numeri: l’istante in cui B riceve il primo turno, e l’istante in cui tutto è finito.'
    ],
    vedrai: [
      ['clock', 'La riga del tempo', 'In alto: una casella per millisecondo. Il puntino segna un cambio di contesto.'],
      ['tabella', 'I conteggi', 'In basso: il lavoro rimasto a ciascun processo, i cambi e l’istante raggiunto.']
    ]
  },
  lab: {
    titolo: 'La rotazione, turno per turno',
    scena: { w: 860, h: 156 },
    atti: ['La coda', 'I turni', 'Il bilancio'],
    controlli: [
      { id: 'q', tipo: 'scelta', eti: 'Quanto', opzioni: [[2, '2 ms'], [3, '3 ms'], [4, '4 ms']], valore: 2 },
      { id: 's', tipo: 'scelta', eti: 'Costo di un cambio', opzioni: [[0, 'nullo'], [1, '1 ms']], valore: 1 }
    ],
    nota: 'Il numero dei passi dipende dal quanto. Il cambio si paga soltanto fra due processi diversi.',
    previsione: {
      domanda: (p) => 'A, B e C sono pronti insieme, in quest’ordine. Il quanto è di ' + p.q + ' ms, e un cambio di contesto ' + (p.s === 0 ? 'è istantaneo' : 'costa 1 ms') + '. A ha bisogno di 5 ms. A quale istante B riceve il suo primo turno?',
      opzioni: () => [2, 3, 4, 5].map((v) => [v, v + ' ms'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. B comincia a ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'A usa il suo quanto di ' + p.q + ' ms' + (p.s === 0 ? ', e il cambio è istantaneo.' : ', e poi il cambio di contesto ne costa 1.')),
    costruisci(p) {
      const U = SL.unita533, el = SL.el, T = U.traccia(p), passi = [], veri = T.turni.filter((x) => !x.cambio);
      const quadro = (fino, fine) => {
        const resta = { A: 5, B: 3, C: 2 }; let cambi = 0, ora = 0;
        T.turni.slice(0, fino).forEach((x) => { if (x.cambio) cambi++; else resta[x.n] = x.resta; ora = x.da + x.d; });
        if (p.s === 0) { cambi = 0; let pr = null; T.turni.slice(0, fino).forEach((x) => { if (pr && pr !== x.n) cambi++; pr = x.n; }); }
        const els = [el.nota('t0', 20, 0, 'PROCESSORE', 'mono')].concat(U.striscia('s', T, fino, { x: 20, y: 24, wc: 51, fine }));
        ['A', 'B', 'C'].forEach((n, k) => els.push(el.box('r' + n, 20 + k * 140, 96, 130, 54, n + ' · resta', resta[n] === 0 ? 'finito' : resta[n] + ' ms', resta[n] === 0 ? 'off' : 'on', { cls: 'stretta' })));
        els.push(el.box('cc', 440, 96, 190, 54, 'cambi di contesto', String(cambi), fine ? 'att' : 'on', { cls: 'stretta' }), el.box('tt', 640, 96, 200, 54, 'istante raggiunto', ora + ' ms', fine ? 'att' : 'on', { cls: 'stretta' }));
        return { els, cambi, ora };
      };
      const S = (fino, fine, atto, titolo, testo, extra) => { const Q = quadro(fino, fine); passi.push(Object.assign({ atto, titolo, testo, hud: [['Istante', Q.ora + ' ms', 'a'], ['Cambi', String(Q.cambi)], ['Primo turno di B', Q.ora > T.primaB || fine ? T.primaB + ' ms' : '·', 'c']], els: Q.els }, extra)); };

      S(0, false, 0, 'La coda', 'All’istante 0 la coda dei pronti contiene A, B e C, che hanno bisogno di 5, 3 e 2 ms. Il quanto è di ' + p.q + ' ms.', {});
      let k = 0;
      T.turni.forEach((x, i) => {
        if (x.cambio) return;
        k++; const succ = T.turni[i + 1], fineLav = x.resta === 0;
        S(i + 1 + (succ && succ.cambio ? 1 : 0), false, 1, 'Turno ' + k + ': ' + x.n, x.n + ' esegue da ' + x.da + ' a ' + (x.da + x.d) + ' ms. ' + (fineLav ? 'Ha finito il proprio lavoro, e lascia la coda.' : x.d === p.q ? 'Il quanto è scaduto e ' + (x.resta === 1 ? 'gli resta 1 ms' : 'gli restano ' + x.resta + ' ms') + ': torna in fondo alla coda.' : '') + (succ ? (succ.cambio ? ' Il passaggio al processo successivo costa 1 ms.' : veri[k] && veri[k].n === x.n ? '' : ' Il processore passa al successivo.') : ''),
          Object.assign({ calc: x.n + ': ' + x.da + ' → ' + (x.da + x.d) + ' ms' }, k === 1 ? { chiedi: { d: 'A ha ancora ' + x.resta + ' ms di lavoro. Dove va?', o: ['Resta in esecuzione', 'In fondo alla coda dei pronti', 'Fra i bloccati'], g: 1, no: 'Il quanto è scaduto. A potrebbe proseguire subito, quindi è pronto, e si accoda dietro a B e C.' } } : {}, x.n === 'B' && x.da === T.primaB ? { esito: ['B comincia a ' + T.primaB + ' ms', ''] } : {}));
      });
      S(99, true, 2, 'Il bilancio', 'Tutti i lavori sono finiti all’istante ' + T.fine + ' ms. Il lavoro utile è di 10 ms' + (p.s === 0 ? ', e i ' + T.cambi + ' cambi di contesto non sono costati nulla.' : ': gli altri ' + (T.fine - 10) + ' ms sono stati spesi in ' + T.cambi + ' cambi di contesto.') + ' B ha ricevuto il primo turno a ' + T.primaB + ' ms.', { calc: '10 + ' + T.cambi + ' × ' + p.s + ' = ' + T.fine + ' ms', esito: ['B comincia a ' + T.primaB + ' ms', ''] });
      return { passi, esito: T.primaB };
    }
  },
  bilancio: {
    regola: [
      'Round-robin: il primo della coda esegue per un quanto al massimo. Se non ha finito torna in fondo alla coda.',
      'Durata complessiva = somma dei burst + cambi di contesto × costo di un cambio. Un quanto più breve migliora il tempo di risposta e aumenta i cambi.'
    ],
    errori: [
      ['Far attendere il quanto intero a un lavoro che finisce prima.', 'Se il lavoro termina, il processore passa subito al successivo.'],
      ['Contare un cambio quando il processo resta lo stesso.', 'Se in coda non c’è nessun altro, il processo prosegue senza cambio di contesto.'],
      ['Scegliere il quanto più breve possibile.', 'Il tempo speso nei cambi cresce, e a un certo punto supera il lavoro utile.']
    ],
    saFare: ['Simulare il round-robin con un quanto dato.', 'Calcolare tempo di risposta e durata complessiva.', 'Spiegare il compromesso nella scelta del quanto.'],
    esercizi: [
      { d: 'Due lavori, X e Y, sono pronti insieme in quest’ordine, con burst di 4 e 2 ms. Il quanto è di 2 ms e ogni cambio fra processi diversi costa 1 ms. A quale istante termina X?', segnaposto: 'Un numero', giuste: ['8', '8ms', 'otto'],
        ok: 'X da 0 a 2, cambio, Y da 3 a 5, cambio, X da 6 a 8.',
        diagnosi: [
          { se: ['6', '6ms'], msg: 'Sei millisecondi sono il solo lavoro utile. Vanno aggiunti i due cambi di contesto.' },
          { se: ['4', '4ms'], msg: 'X viene interrotto dopo 2 ms, alla scadenza del quanto, e tocca a Y.' },
          { se: ['7', '7ms'], msg: 'I cambi sono due: da X a Y, e poi da Y a X.' }
        ],
        altro: 'Il valore è diverso. Disegna i turni: X, cambio, Y, cambio, X.',
        indizi: ['X esegue da 0 a 2, poi il cambio fino a 3.', 'Y esegue da 3 a 5 e finisce, poi il cambio fino a 6.', 'X esegue da 6 a 8.'],
        svolgimento: ['X: 0 → 2.', 'Cambio: 2 → 3.', 'Y: 3 → 5.', 'Cambio: 5 → 6.', 'X: 6 → 8.'] },
      { d: 'Nella stessa situazione, a quale istante Y riceve il primo turno? È il suo tempo di risposta.', segnaposto: 'Un numero', giuste: ['3', '3ms', 'tre'],
        ok: 'X usa il quanto di 2 ms, e il cambio ne costa 1.',
        diagnosi: [
          { se: ['2', '2ms'], msg: 'Dopo il quanto di X c’è il cambio di contesto, che costa 1 ms.' },
          { se: ['4', '4ms'], msg: 'X viene interrotto alla scadenza del quanto, dopo 2 ms, anche se non ha finito.' }
        ],
        altro: 'Il valore è diverso. Somma il primo quanto di X e il costo del cambio.',
        indizi: ['X esegue per un quanto: 2 ms.', 'Il cambio costa 1 ms.', '2 + 1 = 3.'],
        svolgimento: ['Primo turno di X: 0 → 2.', 'Cambio: 2 → 3.', 'Y comincia a 3 ms.'] },
      { d: 'Si raddoppia il quanto di un sistema round-robin. Quale effetto ci si attende?', guida: 'Si scelga la risposta.', o: [
        { t: 'Meno cambi di contesto, e tempi di risposta più lunghi', ok: true, fb: 'Ogni processo tiene il processore più a lungo, e chi è in coda aspetta di più il primo turno.' },
        { t: 'Più cambi di contesto, e tempi di risposta più brevi', fb: 'Questo è l’effetto di un quanto più breve.' },
        { t: 'Nessuno: conta soltanto la somma dei burst', fb: 'La somma dei burst fissa il lavoro utile. Cambi e attese dipendono dal quanto.' }] }
    ],
    sfida: ['cslez5_3_04_scheduling', 'Round-robin con quanto di tempo']
  }
});
