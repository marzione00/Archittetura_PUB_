'use strict';
SL.unita443 = (() => {
  // sequenza dei cicli: I indirizzo, A attesa, D dato
  const cicli = (n, w, modo) => { const s = []; if (modo === 'raffica') { s.push('I'); for (let k = 0; k < w; k++) s.push('A'); for (let k = 0; k < n; k++) s.push('D'); } else for (let j = 0; j < n; j++) { s.push('I'); for (let k = 0; k < w; k++) s.push('A'); s.push('D'); } return s; };
  const ST = { I: 'att', A: 'zero', D: 'on' };
  // striscia dei primi «fino» cicli; o: { x, y, w, h, spenta }
  const striscia = (pre, seq, fino, o) => seq.slice(0, fino).map((c, k) => SL.el.cella(pre + k, o.x + k * (o.w + 2), o.y, o.w, o.h, c, o.spenta ? (c === 'D' ? 'on' : 'off') : ST[c], { gi: String(k + 1), piccola: true }));
  const NOMI = { raffica: 'raffica', singole: 'transazioni singole' };
  return { cicli, striscia, NOMI };
})();
SL.registra('4.4.3', {
  titolo: 'Transazioni e semantica del protocollo',
  obiettivo: 'Alla fine saprai contare i cicli di una transazione, e spiegare perché una raffica trasferisce le stesse parole in meno tempo.',
  concetti: [['clock', 'Ogni ciclo ha un compito'], ['coda', 'Parole una dopo l’altra'], ['bus', 'Il protocollo costa cicli']],
  filigrana: ['clock', 'bus', 'coda'],
  richiami: {
    carte: [
      { sim: 'bus', da: 'Dall’unità 4.4.1', t: 'La transazione', d: 'Una richiesta completa sul bus: indirizzo, comando, risposta.' },
      { sim: 'clock', da: 'Dall’unità 2.1.4', t: 'Il ciclo di clock', d: 'L’unità di tempo dei circuiti.' },
      { sim: 'tabella', da: 'Dall’unità 4.4.2', t: 'La banda', d: 'Il tetto di byte al secondo di un collegamento che non si ferma mai.' }
    ],
    domanda: { d: 'Prima di proseguire: una transazione occupa un ciclo per l’indirizzo, due cicli di attesa e un ciclo per il dato. Quanto dura?', o: [
      { t: '4 cicli', ok: true, fb: '1 + 2 + 1 = 4.' },
      { t: '3 cicli', fb: 'Va contato anche il ciclo in cui viaggia il dato.' },
      { t: '2 cicli', fb: 'Oltre a indirizzo e dato ci sono i due cicli di attesa.' }
    ] }
  },
  idea: {
    titolo: 'Che cosa accade in ogni ciclo',
    termini: ['protocollo del bus', 'ciclo di attesa del bus', 'raffica'],
    testo: [
      'Una transazione dura più cicli di clock, e in ciascuno accade una cosa precisa. Le regole che lo stabiliscono formano il [[protocollo del bus]]. Nel modello di questa unità il protocollo prevede un ciclo in cui l’iniziatore presenta l’indirizzo. Poi il destinatario, se ha bisogno di tempo per prepararsi, inserisce uno o più cicli vuoti, durante i quali il bus resta impegnato senza trasportare dati. Ciascuno è un [[ciclo di attesa del bus|ciclo di attesa]]. Infine viaggiano i dati, una parola per ciclo. Una parola vale qui quattro byte.',
      'Supponiamo di dover trasferire quattro parole che occupano posizioni consecutive della memoria. La via più diretta è ripetere quattro transazioni, una per parola. Ognuna paga il proprio ciclo di indirizzo e le proprie attese: con due cicli di attesa una transazione dura 1 + 2 + 1 = 4 cicli, e quattro transazioni ne durano 16.',
      'Il protocollo offre un’alternativa, la [[raffica]]. L’iniziatore presenta soltanto l’indirizzo della prima parola e dichiara quante ne seguono. Indirizzo e attesa si pagano una volta, e poi le parole escono una per ciclo, perché entrambe le parti sanno che la posizione successiva è quella accanto. La durata scende a 1 + 2 + 4 = 7 cicli.',
      { fig: 'scena', w: 720, h: 190, titolo: 'Quattro parole, due cicli di attesa', nota: 'I è il ciclo di indirizzo, A un ciclo di attesa, D un ciclo che porta una parola. I cicli D sono quattro in entrambe le strisce.', els: [SL.el.nota('ga', 10, 0, 'RAFFICA · 7 CICLI', 'mono')].concat(SL.unita443.striscia('gr', SL.unita443.cicli(4, 2, 'raffica'), 24, { x: 10, y: 22, w: 40, h: 36 }), [SL.el.nota('gb', 10, 92, 'TRANSAZIONI SINGOLE · 16 CICLI', 'mono')], SL.unita443.striscia('gs', SL.unita443.cicli(4, 2, 'singole'), 24, { x: 10, y: 114, w: 40, h: 36 })) },
      'I byte consegnati sono sedici in entrambi i casi, e i cicli che portano dati sono quattro. Cambia tutto ciò che sta in mezzo. La banda calcolata nell’unità precedente supponeva un collegamento sempre occupato dai dati. Un protocollo reale spende una parte dei cicli per accordarsi, e la raffica è il modo per spenderne pochi.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai quante parole consecutive trasferire, quanti cicli di attesa chiede il destinatario, e se usare una raffica oppure transazioni singole.',
      'Costruiremo la cronologia ciclo per ciclo. Alla fine la confronteremo con quella dell’altro modo. Prova a portare le attese a zero: la differenza fra i due modi si riduce, senza annullarsi.'
    ],
    vedrai: [
      ['coda', 'Le parole', 'In alto: le parole da trasferire, con il loro indirizzo.'],
      ['clock', 'La cronologia', 'Al centro: una casella per ciclo, con I, A oppure D.'],
      ['bilancio', 'Il confronto', 'In basso, all’ultimo passo: la cronologia dell’altro modo.']
    ]
  },
  lab: {
    titolo: 'Raffica o transazioni singole',
    scena: { w: 860, h: 282 },
    atti: ['Le parole', 'La cronologia', 'Il conto'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Parole', opzioni: [[2, '2'], [4, '4'], [6, '6']], valore: 4 },
      { id: 'w', tipo: 'scelta', eti: 'Cicli di attesa', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 2 },
      { id: 'modo', tipo: 'scelta', eti: 'Modo', opzioni: [['raffica', 'raffica'], ['singole', 'transazioni singole']], valore: 'raffica' }
    ],
    nota: 'Il numero dei passi dipende dal modo e dalle attese. Ogni parola vale quattro byte.',
    previsione: {
      domanda: (p) => 'Vanno trasferite ' + p.n + ' parole consecutive con ' + (p.modo === 'raffica' ? 'una raffica' : 'transazioni singole') + '. Ogni presentazione di indirizzo costa un ciclo ed è seguita da ' + (p.w === 0 ? 'nessun ciclo' : p.w === 1 ? 'un ciclo' : p.w + ' cicli') + ' di attesa. Quanti cicli servono in tutto?',
      opzioni: (p) => [p.n, 1 + p.w + p.n, p.n * (2 + p.w)].map((v) => [v, v + ' cicli'])
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + ' cicli. La cronologia ne conta ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.n ? 'Ai ' + p.n + ' cicli dei dati vanno aggiunti quelli di indirizzo e di attesa.' : p.modo === 'raffica' ? 'La raffica paga indirizzo e attesa una volta sola.' : 'Ogni transazione singola ripete indirizzo e attesa.'),
    costruisci(p) {
      const U = SL.unita443, el = SL.el, passi = [], raff = p.modo === 'raffica', seq = U.cicli(p.n, p.w, p.modo), altroModo = raff ? 'singole' : 'raffica', seq2 = U.cicli(p.n, p.w, altroModo), una = 2 + p.w, inizi = raff ? 1 : p.n;
      const H2 = (v) => '0x' + v.toString(16).toUpperCase();
      const quadro = (fino, arrivate, fine) => {
        const els = [el.nota('t0', 20, 0, 'PAROLE DA TRASFERIRE', 'mono'), el.nota('lg', 560, 0, 'I indirizzo · A attesa · D dato', 'mono')];
        for (let k = 0; k < p.n; k++) els.push(el.cella('w' + k, 20 + k * 110, 46, 104, 34, 'parola ' + k, k < arrivate ? 'on' : '', { so: H2(64 + 4 * k), piccola: true }));
        els.push(el.nota('t1', 20, 98, 'CRONOLOGIA · ' + U.NOMI[p.modo].toUpperCase(), 'mono'));
        U.striscia('c', seq, fino, { x: 20, y: 120, w: 32, h: 34 }).forEach((e) => els.push(e));
        if (fine) { els.push(el.nota('t2', 20, 190, 'PER CONFRONTO · ' + U.NOMI[altroModo].toUpperCase() + ' · ' + seq2.length + ' CICLI', 'mono')); U.striscia('k', seq2, 24, { x: 20, y: 212, w: 32, h: 34, spenta: true }).forEach((e) => els.push(e)); }
        return els;
      };
      const hud = (fino) => { const d = seq.slice(0, fino).filter((c) => c === 'D').length; return [['Cicli', String(fino), 'a'], ['Parole arrivate', d + ' di ' + p.n], ['Byte', String(4 * d), 'c']]; };
      const P = (fino, atto, titolo, testo, extra) => { const d = seq.slice(0, fino).filter((c) => c === 'D').length; passi.push(Object.assign({ atto, titolo, testo, hud: hud(fino), els: quadro(fino, d, extra && extra.fine) }, extra)); };

      P(0, 0, 'Le parole', 'Vanno trasferite ' + p.n + ' parole che occupano posizioni consecutive, a partire dall’indirizzo 0x40. Ogni parola vale quattro byte, e gli indirizzi avanzano di quattro in quattro.', {});
      P(1, 1, 'Il ciclo di indirizzo', 'Nel primo ciclo l’iniziatore presenta l’indirizzo 0x40' + (raff ? ' e dichiara una raffica di ' + p.n + ' parole.' : ', quello della sola parola 0.') + ' In questo ciclo nessun dato viaggia.', { calc: 'ciclo 1: indirizzo 0x40' });
      if (p.w > 0) P(1 + p.w, 1, p.w === 1 ? 'Il ciclo di attesa' : 'I cicli di attesa', 'Il destinatario ha bisogno di tempo per preparare la risposta, e inserisce ' + (p.w === 1 ? 'un ciclo' : p.w + ' cicli') + ' di attesa. Il bus resta impegnato, e nessun altro può usarlo.', { calc: 'cicli da 2 a ' + (1 + p.w) + ': attesa' });
      if (raff) {
        P(2 + p.w, 1, 'La prima parola', 'Al ciclo ' + (2 + p.w) + ' arriva la parola 0.', { calc: 'ciclo ' + (2 + p.w) + ': parola 0', chiedi: { d: 'Che cosa occupa il ciclo successivo?', o: ['Un nuovo ciclo di indirizzo', 'La parola 1', 'Un ciclo di attesa'], g: 1, no: 'Nella raffica l’indirizzo è stato presentato una volta sola, e le parole si susseguono.' } });
        P(seq.length, 1, 'Le altre parole', 'Le parole seguenti escono una per ciclo, senza altri indirizzi: entrambe le parti sanno che dopo 0x40 viene 0x44, e così via. L’ultima parola arriva al ciclo ' + seq.length + '.', { calc: 'cicli da ' + (3 + p.w) + ' a ' + seq.length + ': ' + (p.n - 1 === 1 ? 'una parola' : (p.n - 1) + ' parole') });
      } else {
        P(una, 1, 'La prima parola', 'Al ciclo ' + una + ' arriva la parola 0, e la transazione si chiude. Per la parola 1 serve una transazione nuova.', { calc: 'prima transazione: 1 + ' + p.w + ' + 1 = ' + una + ' cicli', chiedi: { d: 'Che cosa occupa il ciclo successivo?', o: ['La parola 1', 'Un nuovo ciclo di indirizzo', 'Nulla: il bus riposa'], g: 1, no: 'Ogni transazione singola comincia presentando il proprio indirizzo, qui 0x44.' } });
        P(2 * una, 1, 'La seconda transazione', 'La sequenza si ripete identica per l’indirizzo 0x44: un ciclo di indirizzo, ' + (p.w === 0 ? 'nessuna attesa' : p.w === 1 ? 'un ciclo di attesa' : p.w + ' cicli di attesa') + ', un ciclo di dato.', { calc: 'seconda transazione: altri ' + una + ' cicli' });
        if (p.n > 2) P(seq.length, 1, 'Le transazioni restanti', 'Le altre ' + (p.n - 2) + ' transazioni ripetono lo stesso schema. L’ultima parola arriva al ciclo ' + seq.length + '.', { calc: p.n + ' × ' + una + ' = ' + seq.length + ' cicli' });
      }
      P(seq.length, 2, 'Il conto', (raff ? 'Un ciclo di indirizzo, ' + p.w + ' di attesa e ' + p.n + ' di dati: ' + seq.length + ' cicli per ' + 4 * p.n + ' byte.' : p.n + ' cicli di indirizzo, ' + p.n * p.w + ' di attesa e ' + p.n + ' di dati: ' + seq.length + ' cicli per ' + 4 * p.n + ' byte.') + ' Con ' + (raff ? 'transazioni singole' : 'una raffica') + ' gli stessi byte avrebbero richiesto ' + seq2.length + ' cicli. I cicli che portano dati sono ' + p.n + ' in entrambe le cronologie.', { fine: true, calc: inizi + ' × (1 + ' + p.w + ') + ' + p.n + ' = ' + seq.length + ' cicli', esito: [seq.length + ' cicli', ''] });
      return { passi, esito: seq.length };
    }
  },
  bilancio: {
    regola: [
      'Cicli totali = presentazioni di indirizzo × (1 + cicli di attesa) + parole. La raffica presenta un solo indirizzo, le transazioni singole uno per parola.',
      'I byte consegnati sono gli stessi nei due modi. Cambia il numero di cicli spesi dal protocollo.'
    ],
    errori: [
      ['Contare soltanto i cicli che portano dati.', 'Anche i cicli di indirizzo e di attesa tengono occupato il bus.'],
      ['Ripetere l’attesa per ogni parola di una raffica.', 'Nel modello l’attesa segue la presentazione dell’indirizzo, che nella raffica avviene una volta.'],
      ['Concludere che la raffica trasferisce più byte.', 'I byte sono identici. Diminuisce il tempo necessario.']
    ],
    saFare: ['Conto i cicli di una raffica.', 'Conto i cicli di una serie di transazioni singole.', 'Distinguo i cicli di dati da quelli di protocollo.'],
    esercizi: [
      { d: 'Il protocollo prevede un ciclo di indirizzo e tre cicli di attesa. Quanti cicli richiede una raffica di otto parole?', segnaposto: 'Un numero', giuste: ['12', 'dodici', '12cicli'],
        ok: '1 + 3 + 8 = 12 cicli.',
        diagnosi: [
          { se: ['40', '40cicli'], msg: 'Questa è la durata di otto transazioni singole. La raffica paga indirizzo e attesa una volta.' },
          { se: ['11', '11cicli'], msg: 'Manca il ciclo di indirizzo.' },
          { se: ['9', '9cicli'], msg: 'Mancano i tre cicli di attesa.' },
          { se: ['8', '8cicli'], msg: 'Otto sono i soli cicli di dati.' }
        ],
        altro: 'Il numero è diverso. Somma un ciclo di indirizzo, le attese e un ciclo per parola.',
        indizi: ['Nella raffica l’indirizzo si presenta una volta.', 'Indirizzo e attesa: 1 + 3 = 4 cicli.', '4 + 8 = 12.'],
        svolgimento: ['Indirizzo: 1 ciclo.', 'Attesa: 3 cicli.', 'Dati: 8 cicli.', 'Totale: 12 cicli.'] },
      { d: 'Con lo stesso protocollo, un ciclo di indirizzo e tre di attesa, quanti cicli richiedono otto transazioni singole, una per parola?', segnaposto: 'Un numero', giuste: ['40', 'quaranta', '40cicli'],
        ok: 'Ogni transazione dura 1 + 3 + 1 = 5 cicli, e 8 × 5 = 40.',
        diagnosi: [
          { se: ['12', '12cicli'], msg: 'Questa è la durata della raffica. Qui ogni parola ripete indirizzo e attesa.' },
          { se: ['32', '32cicli'], msg: 'A ogni transazione va aggiunto il ciclo in cui viaggia il dato: 5 cicli, e 8 × 5 = 40.' },
          { se: ['5', '5cicli'], msg: 'Questa è la durata di una transazione. Le transazioni sono otto.' }
        ],
        altro: 'Il numero è diverso. Calcola la durata di una transazione e moltiplicala per otto.',
        indizi: ['Una transazione: indirizzo, attese, dato.', '1 + 3 + 1 = 5 cicli.', '8 × 5 = 40.'],
        svolgimento: ['Una transazione: 1 + 3 + 1 = 5 cicli.', 'Otto transazioni: 40 cicli.'] },
      { d: 'Si passa dalle transazioni singole a una raffica, con le stesse parole. Quale quantità resta uguale?', guida: 'Scegli la risposta.', o: [
        { t: 'Il numero di cicli che portano dati', ok: true, fb: 'Ogni parola occupa comunque un ciclo di dati.' },
        { t: 'Il numero di cicli di indirizzo', fb: 'La raffica presenta un solo indirizzo.' },
        { t: 'La durata complessiva', fb: 'La raffica dura meno, perché risparmia indirizzi e attese.' }] }
    ],
    sfida: ['cslez4_4_04_buses_04', 'Trasferimenti sincroni, asincroni e a raffica']
  }
});
