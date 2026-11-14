'use strict';
SL.unita624 = (() => {
  const BASE = 100, MILIONE = 1000000;
  const conto = (p) => ({ penNs: p.ms * MILIONE, totFault: p.fault * p.ms * MILIONE, quota: p.fault * p.ms, media: BASE + p.fault * p.ms, volte: (BASE + p.fault * p.ms) / BASE });
  // f: 0 inizio · 1 servizio ordinario · 2 conversione · 3 tempo dei fault · 4 quota · 5 media
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), w4 = (o.w - 30) / 4, N = SL.num, lung = o.w - 190, parte = BASE / c.media;
    return [
      el.box(pre + 'q0', o.x, o.y, w4, 54, 'fault su un milione', N(p.fault), f === 0 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'q1', o.x + w4 + 10, o.y, w4, 54, 'penalità', f >= 2 ? N(c.penNs) + ' ns' : p.ms + ' ms', f === 2 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'q2', o.x + 2 * (w4 + 10), o.y, w4, 54, 'quota per richiesta', f >= 4 ? N(c.quota) + ' ns' : '·', f === 4 ? 'att' : f >= 4 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'q3', o.x + 3 * (w4 + 10), o.y, w4, 54, 'tempo medio', f >= 5 ? N(c.media) + ' ns' : '·', f >= 5 ? 'att' : '', { cls: 'stretta' }),
      el.nota(pre + 'n0', o.x, o.y + 72, 'servizio ordinario', 'mono', f === 1 ? 'att' : ''),
      el.barra(pre + 'b0', o.x + 190, o.y + 74, lung, 14, f >= 1 ? (f >= 5 ? parte : 1) : 0),
      el.nota(pre + 'n1', o.x, o.y + 100, 'quota dei page fault', 'mono', f === 4 ? 'att' : ''),
      Object.assign(el.barra(pre + 'b1', o.x + 190, o.y + 102, lung, 14, f >= 5 ? 1 - parte : f >= 4 ? Math.min(1, c.quota / BASE) : 0), { st: 'err' })
    ];
  };
  return { BASE, MILIONE, conto, quadro };
})();
SL.registra('6.2.4', {
  titolo: 'Valutare il costo dei page fault',
  obiettivo: 'Obiettivo: calcolare il tempo medio di una richiesta di memoria in presenza di page fault, convertendo la penalità da millisecondi a nanosecondi.',
  concetti: [['clock', 'Un evento raro, e lunghissimo'], ['bilancio', 'Distribuire il costo su tutte le richieste'], ['disco', 'Milioni di volte più lento della RAM']],
  filigrana: ['clock', 'disco', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 6.1.3', t: 'Il tempo medio di accesso', d: 'Tempo pagato da tutti, più frazione degli eventi rari per la loro penalità.' },
      { sim: 'disco', da: 'Dall’unità 4.5.1', t: 'Il tempo di un disco', d: 'Un accesso a un disco magnetico si misura in millisecondi.' },
      { sim: 'memory', da: 'Dall’unità 6.2.3', t: 'Il rimpiazzo', d: 'Con pochi frame, le pagine che servono vengono scacciate e ricaricate di continuo.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti nanosecondi ci sono in un millisecondo?', o: [
      { t: 'Un milione', ok: true, fb: 'Un millisecondo è un millesimo di secondo, un nanosecondo un miliardesimo: il rapporto è un milione.' },
      { t: 'Mille', fb: 'Mille nanosecondi fanno un microsecondo. Per un millisecondo serve un altro fattore mille.' },
      { t: 'Un miliardo', fb: 'Un miliardo di nanosecondi fa un secondo intero.' }
    ] }
  },
  idea: {
    titolo: 'Pochi page fault bastano a rallentare tutto',
    termini: ['frequenza di page fault', 'thrashing'],
    testo: [
      'Nel capitolo 6.1 un miss della cache costava 50 ns, venticinque volte una consultazione. Un page fault appartiene a un’altra scala. La pagina mancante va presa da un disco, e un disco risponde in millisecondi. Fra una richiesta servita dalla RAM e una che aspetta il disco passa un fattore di decine di migliaia, o di milioni.',
      'Usiamo lo stesso metodo dell’unità 6.1.3, con un milione di richieste al posto di cento. Ogni richiesta riceve un servizio ordinario di 100 ns. Alcune, in più, subiscono un page fault e aspettano la penalità. Il numero di page fault per milione di richieste è la [[frequenza di page fault]]. Per sommare tempi così diversi bisogna portarli alla stessa unità: un millisecondo vale un milione di nanosecondi.',
      'Con mille page fault da 1 ms, le attese durano in tutto 1000 × 1 000 000 ns, cioè un miliardo di nanosecondi. Distribuito su un milione di richieste, quel miliardo pesa 1000 ns su ciascuna. Il tempo medio diventa 100 + 1000 = 1100 ns. Una richiesta su mille ha subito un page fault, e tutte, in media, vanno undici volte più piano.',
      { fig: 'scena', w: 720, h: 130, titolo: 'Mille page fault su un milione di richieste', nota: 'Della media di 1100 ns, il servizio ordinario è la parte piccola. Il resto è l’attesa dei page fault, distribuita su tutte le richieste.', els: SL.unita624.quadro('g', { fault: 1000, ms: 1 }, 5, { x: 10, y: 4, w: 700 }) },
      'C’è una scorciatoia utile. Poiché le richieste sono un milione e un millisecondo vale un milione di nanosecondi, i due milioni si semplificano: la quota media in nanosecondi è il numero di page fault per milione moltiplicato per la penalità in millisecondi. Dieci page fault da 1 ms aggiungono 10 ns, e la media scende a 110 ns. Il singolo page fault costa sempre 1 ms: è cambiata la frequenza con cui lo si paga.',
      'Questo conto spiega un fenomeno temuto. Quando i frame sono meno dell’insieme di lavoro, come nell’unità precedente, i page fault diventano frequentissimi. Il sistema passa quasi tutto il tempo a caricare e scaricare pagine, e quasi nessuno a eseguire i programmi. La situazione si chiama [[thrashing]], e si riconosce da un disco sempre al lavoro e da un processore quasi fermo. Il rimedio è dare più frame al programma, oppure farne girare meno insieme.'
    ]
  },
  esperimento: {
    faremo: [
      'Un milione di richieste di memoria, ciascuna con 100 ns di servizio ordinario. Sceglierai quanti page fault avvengono, e quanto dura la penalità di ciascuno.',
      'Convertiremo la penalità in nanosecondi, sommeremo le attese, e le distribuiremo su tutte le richieste. Guarda come cambia la media passando da mille page fault a dieci.'
    ],
    vedrai: [
      ['bilancio', 'Il conto', 'In alto: i page fault, la penalità, la quota per richiesta e il tempo medio.'],
      ['clock', 'Le due parti della media', 'In basso: quanta parte del tempo medio viene dal servizio ordinario, e quanta dai page fault.']
    ]
  },
  lab: {
    titolo: 'Il peso dei page fault su un milione di richieste',
    scena: { w: 860, h: 132 },
    atti: ['Il milione di richieste', 'Il costo dei page fault', 'La media'],
    controlli: [
      { id: 'fault', tipo: 'scelta', eti: 'Page fault su un milione di richieste', opzioni: [[10, '10'], [100, '100'], [1000, '1000']], valore: 1000 },
      { id: 'ms', tipo: 'scelta', eti: 'Penalità di un page fault', opzioni: [[1, '1 ms'], [5, '5 ms']], valore: 1 }
    ],
    nota: 'I passi sono sempre sei. Le richieste sono servite una per volta, e il servizio ordinario costa 100 ns.',
    previsione: {
      domanda: (p) => 'Un milione di richieste, ciascuna con 100 ns di servizio ordinario. ' + SL.num(p.fault) + ' richieste subiscono un page fault, che aggiunge ' + p.ms + ' ms. Qual è il tempo medio di una richiesta?',
      opzioni: (p) => { const c = SL.unita624.conto(p), N = SL.num; return [[100, '100 ns: i page fault sono troppo pochi per contare'], [c.media, N(c.media) + ' ns'], [c.penNs, N(c.penNs) + ' ns: quanto un page fault']]; }
    },
    confronto: (pred, esito, p) => { const N = SL.num; return 'La previsione indicava ' + N(pred) + ' ns. Il tempo medio è ' + N(esito) + ' ns. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 100 ? 'I page fault sono rari, e ciascuno dura quanto ' + N(p.ms * 10000) + ' richieste ordinarie: sulla media lasciano il segno.' : 'Quello è il tempo di un singolo page fault. Lo subisce una richiesta su ' + N(1000000 / p.fault) + ', e le altre durano 100 ns.'); },
    costruisci(p) {
      const U = SL.unita624, c = U.conto(p), passi = [], N = SL.num;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Page fault', N(p.fault), 'a'], ['Quota', f >= 4 ? N(c.quota) + ' ns' : '·'], ['Media', f >= 5 ? N(c.media) + ' ns' : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Un milione di richieste', 'Un programma compie un milione di richieste di memoria. Di queste, ' + N(p.fault) + ' trovano la pagina assente: una ogni ' + N(1000000 / p.fault) + '.', {});
      P(1, 0, 'Il servizio ordinario', 'Ogni richiesta, con o senza page fault, riceve 100 ns di servizio ordinario. Se non ci fossero page fault, la media sarebbe 100 ns.', { calc: 'servizio ordinario: 100 ns' });
      P(2, 1, 'La conversione', 'La penalità di un page fault è ' + p.ms + ' ms. Per sommarla ai nanosecondi la convertiamo: ' + p.ms + ' × 1 000 000 = ' + N(c.penNs) + ' ns.', { calc: p.ms + ' ms = ' + N(c.penNs) + ' ns', chiedi: { d: 'Un page fault dura ' + N(c.penNs) + ' ns. A quante richieste ordinarie da 100 ns equivale?', o: [N(c.penNs / 100), N(c.penNs / 100000), '100'], g: 0, no: N(c.penNs) + ' diviso 100 fa ' + N(c.penNs / 100) + '.' } });
      P(3, 1, 'Il tempo di tutti i page fault', 'I page fault sono ' + N(p.fault) + ', e ciascuno aggiunge ' + N(c.penNs) + ' ns: in tutto ' + N(p.fault) + ' × ' + N(c.penNs) + ' = ' + N(c.totFault) + ' ns.', { calc: N(p.fault) + ' × ' + N(c.penNs) + ' = ' + N(c.totFault) + ' ns' });
      P(4, 1, 'La quota per richiesta', 'Distribuiamo queste attese su tutte le richieste: ' + N(c.totFault) + ' diviso un milione fa ' + N(c.quota) + ' ns a testa. È lo stesso numero che si ottiene moltiplicando i page fault per milione per i millisecondi: ' + N(p.fault) + ' × ' + p.ms + '.', { calc: N(c.totFault) + ' / 1 000 000 = ' + N(c.quota) + ' ns' });
      P(5, 2, 'La media', 'Il tempo medio è 100 + ' + N(c.quota) + ' = ' + N(c.media) + ' ns. ' + (c.volte >= 2 ? 'Rispetto a un programma senza page fault, ogni richiesta dura in media ' + String(c.volte).replace('.', ',') + ' volte tanto.' : 'I page fault allungano la media del ' + Math.round((c.volte - 1) * 100) + ' per cento.') + ' Un singolo page fault dura sempre ' + p.ms + ' ms: la media dipende da quanto spesso capita.', { calc: '100 + ' + N(c.quota) + ' = ' + N(c.media) + ' ns', esito: [N(c.media) + ' ns di media', ''] });
      return { passi, esito: c.media };
    }
  },
  bilancio: {
    regola: [
      'Tempo medio = servizio ordinario + frazione di page fault × penalità, con tutti i tempi nella stessa unità.',
      'Con le richieste contate a milioni e la penalità in millisecondi: quota in ns = page fault per milione × millisecondi.'
    ],
    errori: [
      ['Sommare millisecondi e nanosecondi senza convertire.', 'Un millisecondo vale un milione di nanosecondi.'],
      ['Trascurare un evento perché è raro.', 'Un page fault ogni mille richieste può moltiplicare per undici il tempo medio.'],
      ['Attribuire la media a ogni richiesta.', 'Quasi tutte le richieste durano 100 ns, e poche durano millisecondi.']
    ],
    saFare: ['Convertire millisecondi in nanosecondi.', 'Calcolare la quota media dei page fault.', 'Riconoscere quando i page fault dominano il tempo.'],
    esercizi: [
      { d: 'Su un milione di richieste da 100 ns avvengono 200 page fault, ciascuno con una penalità di 2 ms. Qual è il tempo medio di una richiesta, in nanosecondi?', segnaposto: 'Un numero', giuste: ['500', '500 ns', '500ns'],
        ok: 'Quota: 200 × 2 = 400 ns. Media: 100 + 400 = 500 ns.',
        diagnosi: [
          { se: ['400', '400 ns'], msg: 'Questa è la quota dei page fault. Aggiungi i 100 ns del servizio ordinario.' },
          { se: ['300', '300 ns'], msg: 'La penalità è di 2 ms per page fault: 200 × 2 = 400 ns di quota.' },
          { se: ['2000100', '2 000 100'], msg: 'Questo è il tempo di una singola richiesta con page fault. La media lo distribuisce su un milione di richieste.' }
        ],
        altro: 'Il valore è diverso. Si moltiplichino i page fault per milione per i millisecondi, e si aggiunga 100.',
        indizi: ['2 ms = 2 000 000 ns.', 'Quota: 200 × 2 000 000 / 1 000 000 = 400 ns.', '100 + 400 = 500 ns.'],
        svolgimento: ['Attese totali: 400 000 000 ns.', 'Quota per richiesta: 400 ns.', 'Media: 500 ns.'] },
      { d: 'Il servizio ordinario dura 100 ns, e un page fault aggiunge 1 ms. Quanti page fault per milione di richieste portano il tempo medio a 150 ns?', segnaposto: 'Un numero', giuste: ['50', 'cinquanta'],
        ok: 'La quota deve essere 50 ns, e con 1 ms ogni page fault per milione vale 1 ns: servono 50 page fault.',
        diagnosi: [
          { se: ['150'], msg: 'La media comprende i 100 ns ordinari. Ai page fault spettano i 50 ns restanti.' },
          { se: ['5', 'cinque'], msg: 'Con una penalità di 1 ms, ogni page fault per milione aggiunge 1 ns alla media.' }
        ],
        altro: 'Il numero è diverso. Si calcoli la quota che manca per arrivare a 150 ns.',
        indizi: ['150 − 100 = 50 ns di quota.', 'Quota = page fault per milione × millisecondi.', '50 / 1 = 50.'],
        svolgimento: ['Quota richiesta: 50 ns.', 'Penalità: 1 ms.', 'Page fault per milione: 50.'] },
      { d: 'Un sistema ha il disco sempre al lavoro e il processore quasi fermo, e ogni programma avanza lentissimo. Qual è la spiegazione più plausibile?', guida: 'Si scelga la risposta.', o: [
        { t: 'Thrashing: i frame sono meno delle pagine che servono', ok: true, fb: 'Il sistema passa il tempo a caricare e scaricare pagine.' },
        { t: 'La cache del processore è troppo piccola', fb: 'I miss della cache non coinvolgono il disco.' },
        { t: 'I programmi sono in deadlock', fb: 'In un deadlock i thread sono fermi, e il disco resterebbe inattivo.' }] }
    ]
  }
});
