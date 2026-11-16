'use strict';
SL.unita613 = (() => {
  const CERCA = 2, N = 100;
  const conto = (p) => ({ cons: N * CERCA, rif: p.m * p.pen, tot: N * CERCA + p.m * p.pen, amat: (N * CERCA + p.m * p.pen) / N });
  const miss = (k, m) => Math.floor((k + 1) * m / N) > Math.floor(k * m / N);   // m miss distribuiti in modo uniforme
  // f: 0 griglia spenta · 1 consultazioni · 2 miss segnati · 3 rifornimenti · 4 totale · 5 media
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), w4 = (o.w - 30) / 4, lato = o.lato, passo = (o.w - lato) / 49;
    els.push(el.nota(pre + 't0', o.x, o.y, 'CENTO LETTURE · una cella per lettura', 'mono'));
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
  obiettivo: 'Obiettivo: calcolare il tempo medio di accesso di una sequenza di letture, separando il tempo dovuto da tutte le letture dalla penalità dovuta dai soli miss.',
  concetti: [['clock', 'Un tempo comune, e un tempo aggiuntivo per i miss'], ['bilancio', 'Totale diviso numero di letture'], ['lente', 'La media descrive la sequenza']],
  filigrana: ['clock', 'bilancio', 'cache'],
  richiami: {
    carte: [
      { sim: 'cache', da: 'Dall’unità 6.1.1', t: 'I due tempi', d: 'Ogni lettura comprende la consultazione. Un miss comprende in aggiunta il rifornimento.' },
      { sim: 'conflitto', da: 'Dall’unità 6.1.2', t: 'L’origine dei miss', d: 'I miss dipendono dal modo in cui il programma impiega la memoria: dati vicini e riutilizzati ne producono pochi.' },
      { sim: 'bilancio', da: 'Dall’unità 5.3.2', t: 'La media di un gruppo', d: 'La somma dei valori, divisa per il loro numero.' }
    ],
    domanda: { d: 'Prima di proseguire: la consultazione costa 2 ns e il rifornimento 50 ns aggiuntivi. Quanto dura una lettura che termina in miss?', o: [
      { t: '52 ns', ok: true, fb: 'La consultazione avviene comunque, e a essa si aggiunge il rifornimento.' },
      { t: '50 ns', fb: 'Prima di rilevare il miss, il processore ha consultato la cache: altri 2 ns.' },
      { t: '2 ns', fb: 'Due nanosecondi sono sufficienti soltanto per un hit.' }
    ] }
  },
  idea: {
    titolo: 'Un solo valore per valutare una cache',
    termini: ['penalità di miss', 'frazione di miss', 'tempo medio di accesso'],
    testo: [
      'Una lettura dura 2 ns oppure 52, secondo la posizione del dato. Per confrontare due cache, o due programmi, occorre un solo valore, che tenga conto della frequenza dei due casi. Tale valore è una media.',
      'Si considerino cento letture eseguite in successione, e si separino due tempi. Il primo è la consultazione della cache: 2 ns, dovuti da tutte e cento. Il secondo è il tempo aggiuntivo di un rifornimento, denominato [[penalità di miss]]: 50 ns, dovuti soltanto dalle letture che falliscono. Se i miss sono dieci, le consultazioni costano 100 × 2 = 200 ns e i rifornimenti 10 × 50 = 500 ns, per un totale di 700 ns.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Cento letture, dieci miss', nota: 'Tutte le celle comprendono la consultazione. Soltanto le dieci contrassegnate comprendono anche la penalità.', els: SL.unita613.quadro('g', { m: 10, pen: 50 }, 5, { x: 10, y: 4, w: 700, lato: 11 }) },
      'La ripartizione dei 700 ns sulle cento letture fornisce il [[tempo medio di accesso]], 7 ns, in inglese average access time. Il medesimo risultato si esprime con una formula. Si denomina [[frazione di miss]] il rapporto fra i miss e le letture, in questo caso 10 su 100, cioè 0,10. Ne segue: tempo medio di accesso = consultazione + frazione di miss × penalità = 2 + 0,10 × 50 = 7 ns.',
      'La formula indica il termine su cui è opportuno intervenire. Il raddoppio dei miss, da dieci a venti, aumenta la media da 7 a 12 ns: il termine della penalità incide molto più della consultazione, poiché un rifornimento equivale a venticinque consultazioni. Per questa ragione i programmi che rispettano la località dell’unità precedente sono più veloci a parità di istruzioni eseguite.',
      'Occorre tuttavia precisare il contenuto informativo della media. Nessuna lettura dura 7 ns: ciascuna ne dura 2 oppure 52, e la media descrive la sequenza nel suo insieme. Il modello si fonda inoltre su tre ipotesi: le letture avvengono una per volta, la consultazione è dovuta anche dai miss, e la penalità è la medesima per ogni rifornimento. Se una di esse cambia, cambia anche il calcolo.'
    ]
  },
  esperimento: {
    faremo: [
      'Si considerino cento letture in sequenza, ciascuna con una consultazione da 2 ns. I controlli fissano il numero delle letture che terminano in miss, e il valore della penalità.',
      'L’esperimento somma prima le consultazioni, quindi le penalità, e divide il totale per cento. È istruttivo raddoppiare i miss e osservare la variazione della media.'
    ],
    vedrai: [
      ['riproduci', 'Le cento letture', 'In alto: una cella per lettura. Quelle contrassegnate sono i miss, distribuiti lungo la sequenza.'],
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
    nota: 'I passi sono sempre sei. La consultazione costa 2 ns per lettura, ed è dovuta anche dai miss.',
    previsione: {
      domanda: (p) => 'Si eseguono cento letture in sequenza. Ogni lettura comprende 2 ns di consultazione. ' + p.m + ' letture terminano in miss, e richiedono ' + p.pen + ' ns aggiuntivi. Qual è il tempo medio di una lettura?',
      opzioni: (p) => { const a = SL.unita613.conto(p).amat; return [[a - 2, (a - 2) + ' ns'], [a, a + ' ns'], [2 + p.pen, (2 + p.pen) + ' ns']]; }
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' ns. Il tempo medio è ' + esito + ' ns. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 2 + p.pen ? 'Quello è il tempo di una singola lettura in miss. I miss sono ' + p.m + ' su cento, e le altre letture durano 2 ns.' : 'Manca la consultazione: ogni lettura, hit o miss, comprende anzitutto 2 ns.'),
    costruisci(p) {
      const U = SL.unita613, c = U.conto(p), passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Totale', f >= 4 ? c.tot + ' ns' : f >= 3 ? c.cons + ' + ' + c.rif : f >= 1 ? c.cons + ' ns' : '·', 'a'], ['Miss', f >= 2 ? p.m + ' su 100' : '·'], ['Media', f >= 5 ? c.amat + ' ns' : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820, lato: 12 }) }, extra));
      P(0, 0, 'Cento letture in sequenza', 'Il programma esegue cento letture, in successione. Ogni cella ne rappresenta una. L’obiettivo è la durata media di una lettura.', {});
      P(1, 1, 'Le consultazioni', 'Ogni lettura ha inizio con la consultazione della cache, che costa 2 ns. Le letture sono cento: 100 × 2 = 200 ns. Tale tempo è dovuto comunque, qualunque sia l’esito.', { calc: '100 × 2 = 200 ns' });
      P(2, 1, 'I miss', 'Delle cento letture, ' + p.m + ' terminano in miss: sono le celle contrassegnate. La frazione di miss è ' + p.m + ' su 100, cioè ' + String(p.m / 100).replace('.', ',') + '.', { calc: 'frazione di miss = ' + String(p.m / 100).replace('.', ',') });
      P(3, 1, 'Le penalità', 'Ogni miss comprende la penalità, ' + p.pen + ' ns, oltre ai 2 ns già contati. I miss sono ' + p.m + ': ' + p.m + ' × ' + p.pen + ' = ' + c.rif + ' ns.', { calc: p.m + ' × ' + p.pen + ' = ' + c.rif + ' ns' });
      P(4, 2, 'Il tempo totale', 'La somma dei due contributi è ' + c.cons + ' + ' + c.rif + ' = ' + c.tot + ' ns per le cento letture.', { calc: c.cons + ' + ' + c.rif + ' = ' + c.tot + ' ns', chiedi: { d: 'Il tempo medio sarà ' + c.amat + ' ns. Esiste una lettura che dura esattamente ' + c.amat + ' ns?', o: ['No, ogni lettura dura 2 ns oppure ' + (2 + p.pen) + ' ns', 'Sì, sono tutte uguali'], g: 0, no: 'Un hit dura 2 ns, un miss ' + (2 + p.pen) + ' ns. La media descrive la sequenza nel suo insieme.' } });
      P(5, 2, 'La media', 'Il totale diviso per il numero di letture dà ' + c.tot + ' / 100 = ' + c.amat + ' ns. La formula fornisce il medesimo valore: 2 + ' + String(p.m / 100).replace('.', ',') + ' × ' + p.pen + ' = ' + c.amat + ' ns.', { calc: 'media = 2 + ' + String(p.m / 100).replace('.', ',') + ' × ' + p.pen + ' = ' + c.amat + ' ns', esito: [c.amat + ' ns di media', ''] });
      return { passi, esito: c.amat };
    }
  },
  bilancio: {
    regola: [
      'Tempo medio di accesso = tempo di consultazione + frazione di miss × penalità di miss.',
      'Tempo totale = numero di letture × consultazione + numero di miss × penalità.'
    ],
    errori: [
      ['Attribuire la consultazione ai soli hit.', 'Anche un miss ha prima consultato la cache.'],
      ['Interpretare la media come durata di ogni lettura.', 'Ogni lettura dura il tempo di un hit oppure quello di un miss.'],
      ['Applicare la formula al di fuori delle sue ipotesi.', 'La formula vale per letture in serie, con penalità costante e consultazione sempre dovuta.']
    ],
    saFare: ['Calcolare la frazione di miss.', 'Calcolare il tempo totale di una sequenza.', 'Calcolare il tempo medio di accesso con la formula.'],
    esercizi: [
      { d: 'La consultazione costa 1 ns, i miss sono 4 su 100, e la penalità è di 100 ns. Quanto vale il tempo medio di accesso, in nanosecondi?', segnaposto: 'Un numero', giuste: ['5', 'cinque', '5 ns', '5ns'],
        ok: '1 + 0,04 × 100 = 5 ns.',
        diagnosi: [
          { se: ['4', 'quattro', '4 ns'], msg: 'Questo è il solo contributo delle penalità. Va aggiunta la consultazione, dovuta da tutte le letture.' },
          { se: ['101', '101 ns'], msg: 'Questo è il tempo di un singolo miss. La penalità incide soltanto per 4 letture su 100.' },
          { se: ['401', '401 ns'], msg: 'La frazione di miss è 4 diviso 100, cioè 0,04.' }
        ],
        altro: 'Il valore è diverso. Si applichi la formula: tempo medio = consultazione + frazione di miss × penalità.',
        indizi: ['Frazione di miss: 4 / 100 = 0,04.', '0,04 × 100 = 4 ns.', '1 + 4 = 5 ns.'],
        svolgimento: ['Frazione di miss: 0,04.', 'Contributo delle penalità: 4 ns.', 'Tempo medio di accesso: 5 ns.'] },
      { d: 'Un programma esegue 200 letture, con 30 miss. La consultazione costa 2 ns e la penalità 40 ns. Quanti nanosecondi occorrono complessivamente?', segnaposto: 'Un numero', giuste: ['1600', '1 600', '1600 ns', '1 600 ns'],
        ok: '200 × 2 + 30 × 40 = 400 + 1 200 = 1 600 ns.',
        diagnosi: [
          { se: ['1200', '1 200'], msg: 'Mancano le consultazioni: 200 letture da 2 ns.' },
          { se: ['1540', '1 540'], msg: 'La consultazione è dovuta da tutte le 200 letture, miss compresi.' },
          { se: ['8', '8 ns'], msg: 'Otto nanosecondi è la media. La domanda riguarda il totale.' }
        ],
        altro: 'Il totale è diverso. Si sommino le consultazioni di tutte le letture e le penalità dei soli miss.',
        indizi: ['Consultazioni: 200 × 2 = 400 ns.', 'Penalità: 30 × 40 = 1 200 ns.', '400 + 1 200 = 1 600 ns.'],
        svolgimento: ['Consultazioni: 400 ns.', 'Penalità: 1 200 ns.', 'Totale: 1 600 ns.'] },
      { d: 'Il tempo medio di accesso di un programma è 7 ns. Che cosa se ne può concludere?', guida: 'Si scelga la risposta.', o: [
        { t: 'Cento letture in sequenza richiedono circa 700 ns', ok: true, fb: 'La media moltiplicata per il numero di letture dà il tempo totale.' },
        { t: 'Ogni lettura dura 7 ns', fb: 'Le letture durano il tempo di un hit oppure quello di un miss.' },
        { t: 'La penalità di miss è 7 ns', fb: 'La penalità è uno dei termini della media, insieme alla consultazione e alla frazione di miss.' }] }
    ],
    sfida: ['cslez6_1_04_cache_performance', 'Prestazioni della cache']
  }
});
