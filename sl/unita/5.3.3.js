'use strict';
SL.unita533 = (() => {
  // simulazione round-robin: processi A 5, B 3, C 2; time slice q; costo s fra processi diversi
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
  obiettivo: 'Obiettivo: simulare la politica round-robin con un dato time slice, e spiegare per quale ragione un time slice breve migliora la prontezza e aumenta la durata complessiva.',
  concetti: [['coda', 'Un turno per ciascuno, a rotazione'], ['clock', 'Il time slice determina la prontezza'], ['bilancio', 'Ogni cambio ha un costo']],
  filigrana: ['coda', 'clock', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 4.4.4', t: 'Il round-robin', d: 'Il servizio a rotazione, che riprende ogni volta dal successivo. Sul bus ordinava i richiedenti.' },
      { sim: 'clock', da: 'Dall’unità 5.1.2', t: 'Il time slice', d: 'La durata massima di un turno sul processore.' },
      { sim: 'register', da: 'Dall’unità 5.1.3', t: 'Il cambio di contesto', d: 'Il salvataggio dei registri di un processo e il caricamento di quelli di un altro richiedono tempo.' }
    ],
    domanda: { d: 'Prima di proseguire: un processo richiede 5 ms e riceve turni da 2 ms. Quanti turni gli occorrono?', o: [
      { t: '3', ok: true, fb: 'Due turni interi coprono 4 ms, e il terzo l’ultimo millisecondo.' },
      { t: '2', fb: 'Due turni coprono 4 ms. Resta ancora un millisecondo.' },
      { t: '5', fb: 'Ogni turno dura al massimo 2 ms.' }
    ] }
  },
  idea: {
    titolo: 'La rotazione dei turni',
    termini: ['tempo di risposta di un processo', 'tempo di completamento'],
    testo: [
      'Con FCFS e SJF un processo, una volta avviato, conserva il processore fino al termine. Un processo in coda dopo uno lungo resta a lungo senza alcun avanzamento. In un sistema interattivo tale ritardo è rilevante, poiché conta la prontezza, cioè la rapidità con cui ogni programma ottiene un primo turno. La misura è il [[tempo di risposta di un processo|tempo di risposta]]: il tempo fra l’arrivo di un processo e il suo primo turno sul processore.',
      'Il round-robin applica ai processi la rotazione già esaminata per il bus. Il primo processo della coda dei pronti riceve il processore per un time slice al massimo. Se termina prima, il processore passa immediatamente al successivo, mentre se alla scadenza ha ancora calcolo da svolgere è ricollocato all’ultima posizione della coda. Nessun processo attende più di un giro completo.',
      { fig: 'scena', w: 720, h: 100, titolo: 'A, B e C con burst di 5, 3 e 2 ms, time slice di 2 ms, cambio di 1 ms', nota: 'Le celle con il puntino sono i cambi di contesto. I turni sono A, B, C, A, B, A: cinque cambi, e l’ultimo processo termina a 15 ms.', els: SL.unita533.striscia('g', SL.unita533.traccia({ q: 2, s: 1 }), 99, { x: 10, y: 8, wc: 43, fine: true }) },
      'La rotazione ha un costo: il passaggio da un processo a un altro richiede un cambio di contesto, durante il quale il processore non svolge lavoro utile. Nell’esempio la somma dei burst è 10 ms. Con un time slice di 2 ms occorrono cinque cambi da 1 ms, e l’ultimo processo termina a 15 ms. L’istante in cui un processo termina, contato dal suo arrivo, è il suo [[tempo di completamento]].',
      'Con un time slice di 4 ms i turni divengono A, B, C, A. I cambi si riducono a tre, e l’ultimo processo termina a 13 ms. Per contro B riceve il primo turno a 5 ms anziché a 3. La scelta del time slice è pertanto un compromesso: un time slice breve fornisce risposte pronte e consuma tempo nei cambi, mentre un time slice lungo ne consuma meno e, al limite, riduce il round-robin a FCFS.'
    ]
  },
  esperimento: {
    faremo: [
      'A, B e C sono pronti all’istante 0, in quest’ordine, con burst di 5, 3 e 2 ms. I controlli fissano il time slice e il costo di un cambio di contesto.',
      'L’esperimento costruisce la riga del tempo un turno alla volta e conta i cambi. Le grandezze da osservare sono due: l’istante in cui B riceve il primo turno, e l’istante in cui termina l’ultimo processo.'
    ],
    vedrai: [
      ['clock', 'La riga del tempo', 'In alto: una cella per millisecondo. Il puntino indica un cambio di contesto.'],
      ['tabella', 'I conteggi', 'In basso: il calcolo residuo di ciascun processo, i cambi e l’istante raggiunto.']
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
    nota: 'Il numero dei passi dipende dal time slice. Il cambio ha un costo soltanto fra due processi diversi.',
    previsione: {
      domanda: (p) => 'A, B e C sono pronti insieme, in quest’ordine. Il time slice è di ' + p.q + ' ms, e un cambio di contesto ' + (p.s === 0 ? 'è istantaneo' : 'costa 1 ms') + '. A richiede 5 ms. A quale istante B riceve il suo primo turno?',
      opzioni: () => [2, 3, 4, 5].map((v) => [v, v + ' ms'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ms. B ha inizio a ' + esito + ' ms. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'A impiega il proprio time slice di ' + p.q + ' ms' + (p.s === 0 ? ', e il cambio è istantaneo.' : ', e quindi il cambio di contesto ne costa 1.')),
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

      S(0, false, 0, 'La coda', 'All’istante 0 la coda dei pronti contiene A, B e C, che richiedono 5, 3 e 2 ms. Il time slice è di ' + p.q + ' ms.', {});
      let k = 0;
      T.turni.forEach((x, i) => {
        if (x.cambio) return;
        k++; const succ = T.turni[i + 1], fineLav = x.resta === 0;
        S(i + 1 + (succ && succ.cambio ? 1 : 0), false, 1, 'Turno ' + k + ': ' + x.n, x.n + ' esegue da ' + x.da + ' a ' + (x.da + x.d) + ' ms. ' + (fineLav ? 'Ha terminato il proprio calcolo, e lascia la coda.' : x.d === p.q ? 'Il time slice è scaduto e ' + (x.resta === 1 ? 'gli resta 1 ms' : 'gli restano ' + x.resta + ' ms') + ': torna all’ultima posizione della coda.' : '') + (succ ? (succ.cambio ? ' Il passaggio al processo successivo costa 1 ms.' : veri[k] && veri[k].n === x.n ? '' : ' Il processore passa al successivo.') : ''),
          Object.assign({ calc: x.n + ': ' + x.da + ' → ' + (x.da + x.d) + ' ms' }, k === 1 ? { chiedi: { d: 'A ha ancora ' + x.resta + ' ms di calcolo. Dove è collocato?', o: ['Resta in esecuzione', 'All’ultima posizione della coda dei pronti', 'Fra i bloccati'], g: 1, no: 'Il time slice è scaduto. A potrebbe proseguire immediatamente, quindi è pronto, e si accoda dopo B e C.' } } : {}, x.n === 'B' && x.da === T.primaB ? { esito: ['B ha inizio a ' + T.primaB + ' ms', ''] } : {}));
      });
      S(99, true, 2, 'Il bilancio', 'Tutti i processi sono terminati all’istante ' + T.fine + ' ms. Il lavoro utile è di 10 ms' + (p.s === 0 ? ', e i ' + T.cambi + ' cambi di contesto non hanno avuto alcun costo.' : ': gli altri ' + (T.fine - 10) + ' ms sono stati impiegati in ' + T.cambi + ' cambi di contesto.') + ' B ha ricevuto il primo turno a ' + T.primaB + ' ms.', { calc: '10 + ' + T.cambi + ' × ' + p.s + ' = ' + T.fine + ' ms', esito: ['B ha inizio a ' + T.primaB + ' ms', ''] });
      return { passi, esito: T.primaB };
    }
  },
  bilancio: {
    regola: [
      'Round-robin: il primo processo della coda esegue per un time slice al massimo. Se non ha terminato, torna all’ultima posizione della coda.',
      'Durata complessiva = somma dei burst + cambi di contesto × costo di un cambio. Un time slice più breve migliora il tempo di risposta e aumenta i cambi.'
    ],
    errori: [
      ['Attribuire il time slice intero a un processo che termina prima.', 'Se il processo termina, il processore passa immediatamente al successivo.'],
      ['Contare un cambio quando il processo resta il medesimo.', 'Se la coda non contiene altri processi, il processo prosegue senza cambio di contesto.'],
      ['Adottare il time slice più breve possibile.', 'Il tempo impiegato nei cambi cresce, fino a superare il lavoro utile.']
    ],
    saFare: ['Simulare il round-robin con un time slice dato.', 'Calcolare tempo di risposta e durata complessiva.', 'Spiegare il compromesso nella scelta del time slice.'],
    esercizi: [
      { d: 'Due processi, X e Y, sono pronti insieme in quest’ordine, con burst di 4 e 2 ms. Il time slice è di 2 ms e ogni cambio fra processi diversi costa 1 ms. A quale istante termina X?', segnaposto: 'Un numero', giuste: ['8', '8ms', 'otto'],
        ok: 'X da 0 a 2, cambio, Y da 3 a 5, cambio, X da 6 a 8.',
        diagnosi: [
          { se: ['6', '6ms'], msg: 'Sei millisecondi sono il solo lavoro utile. Vanno aggiunti i due cambi di contesto.' },
          { se: ['4', '4ms'], msg: 'X è interrotto dopo 2 ms, alla scadenza del time slice, e il turno passa a Y.' },
          { se: ['7', '7ms'], msg: 'I cambi sono due: da X a Y, e poi da Y a X.' }
        ],
        altro: 'Il valore è diverso. Si traccino i turni: X, cambio, Y, cambio, X.',
        indizi: ['X esegue da 0 a 2, poi il cambio fino a 3.', 'Y esegue da 3 a 5 e termina, poi il cambio fino a 6.', 'X esegue da 6 a 8.'],
        svolgimento: ['X: 0 → 2.', 'Cambio: 2 → 3.', 'Y: 3 → 5.', 'Cambio: 5 → 6.', 'X: 6 → 8.'] },
      { d: 'Nella medesima situazione, a quale istante Y riceve il primo turno? Si tratta del suo tempo di risposta.', segnaposto: 'Un numero', giuste: ['3', '3ms', 'tre'],
        ok: 'X impiega il time slice di 2 ms, e il cambio ne costa 1.',
        diagnosi: [
          { se: ['2', '2ms'], msg: 'Al time slice di X segue il cambio di contesto, che costa 1 ms.' },
          { se: ['4', '4ms'], msg: 'X è interrotto alla scadenza del time slice, dopo 2 ms, anche se non ha terminato.' }
        ],
        altro: 'Il valore è diverso. Si sommino il primo time slice di X e il costo del cambio.',
        indizi: ['X esegue per un time slice: 2 ms.', 'Il cambio costa 1 ms.', '2 + 1 = 3.'],
        svolgimento: ['Primo turno di X: 0 → 2.', 'Cambio: 2 → 3.', 'Y ha inizio a 3 ms.'] },
      { d: 'Si raddoppia il time slice di un sistema round-robin. Quale effetto ci si attende?', guida: 'Si scelga la risposta.', o: [
        { t: 'Meno cambi di contesto, e tempi di risposta più lunghi', ok: true, fb: 'Ogni processo conserva il processore più a lungo, e i processi in coda attendono più a lungo il primo turno.' },
        { t: 'Più cambi di contesto, e tempi di risposta più brevi', fb: 'Questo è l’effetto di un time slice più breve.' },
        { t: 'Nessuno, poiché conta soltanto la somma dei burst', fb: 'La somma dei burst fissa il lavoro utile. Cambi e attese dipendono dal time slice.' }] }
    ],
    sfida: ['cslez5_3_04_scheduling', 'Round-robin con quanto di tempo']
  }
});
