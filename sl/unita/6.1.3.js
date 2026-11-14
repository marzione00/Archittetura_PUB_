'use strict';
SL.unita613 = (() => {
  const CERCA = 2, N = 100;
  const conto = (p) => ({ cons: N * CERCA, rif: p.m * p.pen, tot: N * CERCA + p.m * p.pen, amat: (N * CERCA + p.m * p.pen) / N });
  const miss = (k, m) => Math.floor((k + 1) * m / N) > Math.floor(k * m / N);   // m miss distribuiti in modo uniforme
  // f: 0 griglia spenta · 1 consultazioni · 2 miss segnati · 3 rifornimenti · 4 totale · 5 media
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), w4 = (o.w - 30) / 4, lato = o.lato, passo = (o.w - lato) / 49;
    els.push(el.nota(pre + 't0', o.x, o.y, 'CENTO LETTURE · una casella per lettura', 'mono'));
    for (let k = 0; k < N; k++) els.push(el.cella(pre + 'c' + k, o.x + (k % 50) * passo, o.y + 24 + Math.floor(k / 50) * (lato + 4), lato, lato, '', f === 0 ? '' : f >= 2 && miss(k, p.m) ? 'err' : 'on', { piccola: true }));
    const y = o.y + 34 + 2 * (lato + 4);
    els.push(el.box(pre + 'q0', o.x, y, w4, 54, 'consultazioni', f >= 1 ? N + ' × ' + CERCA + ' = ' + c.cons + ' ns' : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w4 + 10, y, w4, 54, 'rifornimenti', f >= 3 ? p.m + ' × ' + p.pen + ' = ' + c.rif + ' ns' : f === 2 ? p.m + ' miss' : '·', f === 2 || f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w4 + 10), y, w4, 54, 'tempo totale', f >= 4 ? c.tot + ' ns' : '·', f === 4 ? 'att' : f >= 4 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q3', o.x + 3 * (w4 + 10), y, w4, 54, 'tempo medio', f >= 5 ? c.amat + ' ns' : '·', f >= 5 ? 'att' : '', { cls: 'stretta' }));
    return els;
  };
  return { CERCA, N, conto, miss, quadro };
})();
SL.registra('6.1.3', {
  titolo: 'Tempo medio di accesso e ipotesi del modello',
  obiettivo: 'Obiettivo: calcolare il tempo medio di accesso di una sequenza di letture, separando il tempo pagato da tutte dalla penalità pagata dai soli miss.',
  concetti: [['clock', 'Un tempo per tutti, un sovrapprezzo per alcuni'], ['bilancio', 'Totale diviso numero di letture'], ['lente', 'La media descrive la sequenza']],
  filigrana: ['clock', 'bilancio', 'cache'],
  richiami: {
    carte: [
      { sim: 'cache', da: 'Dall’unità 6.1.1', t: 'I due tempi', d: 'Ogni lettura paga la consultazione. Un miss paga in più il rifornimento.' },
      { sim: 'conflitto', da: 'Dall’unità 6.1.2', t: 'Da che cosa dipendono i miss', d: 'Dal modo in cui il programma usa la memoria: dati vicini e riusati ne producono pochi.' },
      { sim: 'bilancio', da: 'Dall’unità 5.3.2', t: 'La media di un gruppo', d: 'La somma dei valori, divisa per il loro numero.' }
    ],
    domanda: { d: 'Prima di proseguire: la consultazione costa 2 ns e il rifornimento 50 ns in più. Quanto dura una lettura che finisce in miss?', o: [
      { t: '52 ns', ok: true, fb: 'La consultazione avviene comunque, e poi si aggiunge il rifornimento.' },
      { t: '50 ns', fb: 'Prima di scoprire il miss, il processore ha consultato la cache: altri 2 ns.' },
      { t: '2 ns', fb: 'Due nanosecondi bastano soltanto per un hit.' }
    ] }
  },
  idea: {
    titolo: 'Un solo numero per giudicare una cache',
    termini: ['penalità di miss', 'frazione di miss', 'amat'],
    testo: [
      'Una lettura dura 2 ns oppure 52, secondo dove si trova il dato. Per confrontare due cache, o due programmi, serve un numero solo, che tenga conto di quanto spesso capita l’uno e quanto spesso l’altro caso. Quel numero è una media.',
      'Cronometriamo cento letture eseguite una dopo l’altra, e separiamo due tempi. Il primo è la consultazione della cache: 2 ns, pagati da tutte e cento. Il secondo è il tempo in più di un rifornimento, che chiamiamo [[penalità di miss]]: 50 ns, pagati soltanto dalle letture che falliscono. Se i miss sono dieci, le consultazioni costano 100 × 2 = 200 ns e i rifornimenti 10 × 50 = 500 ns. In tutto 700 ns.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Cento letture, dieci miss', nota: 'Tutte le caselle pagano la consultazione. Soltanto le dieci segnate pagano anche la penalità.', els: SL.unita613.quadro('g', { m: 10, pen: 50 }, 5, { x: 10, y: 4, w: 700, lato: 11 }) },
      'Distribuendo i 700 ns sulle cento letture si ottiene il tempo medio di accesso, 7 ns. In inglese è average memory access time, e la sigla [[amat|AMAT]] è il nome con cui lo si incontra ovunque. Lo stesso risultato si scrive in una riga. Chiamiamo [[frazione di miss]] il rapporto fra i miss e le letture, qui 10 su 100, cioè 0,10. Allora AMAT = consultazione + frazione di miss × penalità = 2 + 0,10 × 50 = 7 ns.',
      'La formula mostra dove conviene intervenire. Raddoppiare i miss, da dieci a venti, porta la media da 7 a 12 ns: il termine della penalità pesa molto più della consultazione, perché un rifornimento vale venticinque consultazioni. Per questo i programmi attenti alla località dell’unità precedente corrono più veloci a parità di istruzioni eseguite.',
      'Bisogna però tenere presente che cosa la media dice e che cosa tace. Nessuna lettura dura 7 ns: ciascuna ne dura 2 oppure 52, e la media descrive la sequenza nel suo insieme. Il modello inoltre poggia su tre ipotesi: le letture avvengono una per volta, la consultazione è pagata anche dai miss, e la penalità è la stessa per ogni rifornimento. Se una di queste cambia, cambia anche il conto.'
    ]
  },
  esperimento: {
    faremo: [
      'Cento letture in sequenza, ciascuna con una consultazione da 2 ns. Sceglierai quante finiscono in miss, e quanto vale la penalità.',
      'Sommeremo prima le consultazioni, poi le penalità, e divideremo il totale per cento. Raddoppia i miss e guarda di quanto si sposta la media.'
    ],
    vedrai: [
      ['riproduci', 'Le cento letture', 'In alto: una casella per lettura. Quelle segnate sono i miss, distribuiti lungo la sequenza.'],
      ['bilancio', 'Il conto', 'In basso: consultazioni, rifornimenti, tempo totale e tempo medio.']
    ]
  },
  lab: {
    titolo: 'Il tempo medio di cento letture',
    scena: { w: 860, h: 150 },
    atti: ['Le cento letture', 'I due tempi', 'La media'],
    controlli: [
      { id: 'm', tipo: 'scelta', eti: 'Miss su cento letture', opzioni: [[10, '10'], [20, '20'], [50, '50']], valore: 10 },
      { id: 'pen', tipo: 'scelta', eti: 'Penalità di miss', opzioni: [[50, '50 ns'], [100, '100 ns']], valore: 50 }
    ],
    nota: 'I passi sono sempre sei. La consultazione costa 2 ns per lettura, ed è pagata anche dai miss.',
    previsione: {
      domanda: (p) => 'Cento letture in sequenza. Ogni lettura paga 2 ns di consultazione. ' + p.m + ' letture finiscono in miss, e pagano ' + p.pen + ' ns in più. Qual è il tempo medio di una lettura?',
      opzioni: (p) => { const a = SL.unita613.conto(p).amat; return [[a - 2, (a - 2) + ' ns'], [a, a + ' ns'], [2 + p.pen, (2 + p.pen) + ' ns']]; }
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ns. Il tempo medio è ' + esito + ' ns. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 2 + p.pen ? 'Quello è il tempo di una singola lettura in miss. I miss sono ' + p.m + ' su cento, e le altre letture durano 2 ns.' : 'Manca la consultazione: ogni lettura, hit o miss, paga 2 ns prima di tutto.'),
    costruisci(p) {
      const U = SL.unita613, c = U.conto(p), passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Totale', f >= 4 ? c.tot + ' ns' : f >= 3 ? c.cons + ' + ' + c.rif : f >= 1 ? c.cons + ' ns' : '·', 'a'], ['Miss', f >= 2 ? p.m + ' su 100' : '·'], ['Media', f >= 5 ? c.amat + ' ns' : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820, lato: 12 }) }, extra));
      P(0, 0, 'Cento letture in fila', 'Il programma esegue cento letture, una dopo l’altra. Ogni casella ne rappresenta una. Vogliamo sapere quanto dura, in media, una lettura.', {});
      P(1, 1, 'Le consultazioni', 'Ogni lettura comincia consultando la cache, e la consultazione costa 2 ns. Le letture sono cento: 100 × 2 = 200 ns. Questo tempo si paga comunque, qualunque sia l’esito.', { calc: '100 × 2 = 200 ns' });
      P(2, 1, 'I miss', 'Delle cento letture, ' + p.m + ' finiscono in miss: sono le caselle segnate. La frazione di miss è ' + p.m + ' su 100, cioè ' + String(p.m / 100).replace('.', ',') + '.', { calc: 'frazione di miss = ' + String(p.m / 100).replace('.', ',') });
      P(3, 1, 'Le penalità', 'Ogni miss paga la penalità, ' + p.pen + ' ns, oltre ai 2 ns già contati. I miss sono ' + p.m + ': ' + p.m + ' × ' + p.pen + ' = ' + c.rif + ' ns.', { calc: p.m + ' × ' + p.pen + ' = ' + c.rif + ' ns' });
      P(4, 2, 'Il tempo totale', 'Sommiamo i due contributi: ' + c.cons + ' + ' + c.rif + ' = ' + c.tot + ' ns per le cento letture.', { calc: c.cons + ' + ' + c.rif + ' = ' + c.tot + ' ns', chiedi: { d: 'Il tempo medio sarà ' + c.amat + ' ns. Esiste una lettura che dura proprio ' + c.amat + ' ns?', o: ['No: ogni lettura dura 2 ns oppure ' + (2 + p.pen) + ' ns', 'Sì: sono tutte uguali'], g: 0, no: 'Un hit dura 2 ns, un miss ' + (2 + p.pen) + ' ns. La media descrive la sequenza nel suo insieme.' } });
      P(5, 2, 'La media', 'Dividiamo il totale per il numero di letture: ' + c.tot + ' / 100 = ' + c.amat + ' ns. La formula dà lo stesso valore: 2 + ' + String(p.m / 100).replace('.', ',') + ' × ' + p.pen + ' = ' + c.amat + ' ns.', { calc: 'AMAT = 2 + ' + String(p.m / 100).replace('.', ',') + ' × ' + p.pen + ' = ' + c.amat + ' ns', esito: [c.amat + ' ns di media', ''] });
      return { passi, esito: c.amat };
    }
  },
  bilancio: {
    regola: [
      'AMAT = tempo di consultazione + frazione di miss × penalità di miss.',
      'Tempo totale = numero di letture × consultazione + numero di miss × penalità.'
    ],
    errori: [
      ['Far pagare la consultazione ai soli hit.', 'Anche un miss ha prima consultato la cache.'],
      ['Leggere la media come durata di ogni lettura.', 'Ogni lettura dura il tempo di un hit oppure quello di un miss.'],
      ['Usare la formula fuori dalle sue ipotesi.', 'Vale per letture in serie, con penalità costante e consultazione pagata sempre.']
    ],
    saFare: ['Calcolare la frazione di miss.', 'Calcolare il tempo totale di una sequenza.', 'Calcolare il tempo medio di accesso con la formula.'],
    esercizi: [
      { d: 'La consultazione costa 1 ns, i miss sono 4 su 100, e la penalità è di 100 ns. Quanto vale il tempo medio di accesso, in nanosecondi?', segnaposto: 'Un numero', giuste: ['5', 'cinque', '5 ns', '5ns'],
        ok: '1 + 0,04 × 100 = 5 ns.',
        diagnosi: [
          { se: ['4', 'quattro', '4 ns'], msg: 'Questo è il solo contributo delle penalità. Aggiungi la consultazione, pagata da tutte le letture.' },
          { se: ['101', '101 ns'], msg: 'Questo è il tempo di un singolo miss. La penalità pesa soltanto per 4 letture su 100.' },
          { se: ['401', '401 ns'], msg: 'La frazione di miss è 4 diviso 100, cioè 0,04.' }
        ],
        altro: 'Il valore è diverso. Si applichi AMAT = consultazione + frazione di miss × penalità.',
        indizi: ['Frazione di miss: 4 / 100 = 0,04.', '0,04 × 100 = 4 ns.', '1 + 4 = 5 ns.'],
        svolgimento: ['Frazione di miss: 0,04.', 'Contributo delle penalità: 4 ns.', 'AMAT: 5 ns.'] },
      { d: 'Un programma esegue 200 letture, con 30 miss. La consultazione costa 2 ns e la penalità 40 ns. Quanti nanosecondi servono in tutto?', segnaposto: 'Un numero', giuste: ['1600', '1 600', '1600 ns', '1 600 ns'],
        ok: '200 × 2 + 30 × 40 = 400 + 1 200 = 1 600 ns.',
        diagnosi: [
          { se: ['1200', '1 200'], msg: 'Mancano le consultazioni: 200 letture da 2 ns.' },
          { se: ['1540', '1 540'], msg: 'La consultazione è pagata da tutte le 200 letture, miss compresi.' },
          { se: ['8', '8 ns'], msg: 'Otto nanosecondi è la media. La domanda riguarda il totale.' }
        ],
        altro: 'Il totale è diverso. Somma le consultazioni di tutte le letture e le penalità dei soli miss.',
        indizi: ['Consultazioni: 200 × 2 = 400 ns.', 'Penalità: 30 × 40 = 1 200 ns.', '400 + 1 200 = 1 600 ns.'],
        svolgimento: ['Consultazioni: 400 ns.', 'Penalità: 1 200 ns.', 'Totale: 1 600 ns.'] },
      { d: 'Il tempo medio di accesso di un programma è 7 ns. Che cosa se ne può concludere?', guida: 'Si scelga la risposta.', o: [
        { t: 'Che cento letture in sequenza richiedono circa 700 ns', ok: true, fb: 'La media moltiplicata per il numero di letture dà il tempo totale.' },
        { t: 'Che ogni lettura dura 7 ns', fb: 'Le letture durano il tempo di un hit oppure quello di un miss.' },
        { t: 'Che la penalità di miss è 7 ns', fb: 'La penalità è uno degli ingredienti della media, insieme alla consultazione e alla frazione di miss.' }] }
    ],
    sfida: ['cslez6_1_04_cache_performance', 'Prestazioni della cache']
  }
});
