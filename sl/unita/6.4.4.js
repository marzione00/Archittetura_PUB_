'use strict';
SL.unita644 = (() => {
  const TLB = 1, RAM = 50;
  const conto = (p) => { const miss = 100 - p.hit, cHit = TLB + RAM, cMiss = TLB + p.liv * RAM + RAM, tot = p.hit * cHit + miss * cMiss; return { miss, cHit, cMiss, tot, media: tot / 100, letture: p.liv + 1 }; };
  // f: 0 inizio · 1 percorso hit · 2 percorso miss · 3 conteggio · 4 totale · 5 media
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), wc = (o.w - 5 * 6) / 6, w4 = (o.w - 30) / 4, N = SL.num;
    els.push(el.nota(pre + 't0', o.x, o.y, 'PERCORSO DI UN HIT · la traduzione è nella TLB', 'mono', f === 1 ? 'att' : ''));
    [['TLB', '1 ns'], ['dato', '50 ns']].forEach((r, k) => els.push(el.cella(pre + 'h' + k, o.x + k * (wc + 6), o.y + 24, wc, 32, f >= 1 ? r[0] : '', f >= 1 ? (f === 1 ? 'att' : 'on') : '', { gi: f >= 1 ? r[1] : '', piccola: true })));
    els.push(el.nota(pre + 't1', o.x, o.y + 78, 'PERCORSO DI UN MISS · la traduzione va letta nelle tabelle, a ' + p.liv + ' livelli', 'mono', f === 2 ? 'att' : ''));
    const tappe = [['TLB', '1 ns', 'on']]; for (let k = 1; k <= p.liv; k++) tappe.push(['livello ' + k, '50 ns', 'err']); tappe.push(['dato', '50 ns', 'on']);
    tappe.forEach((r, k) => els.push(el.cella(pre + 'm' + k, o.x + k * (wc + 6), o.y + 102, wc, 32, f >= 2 ? r[0] : '', f >= 2 ? (f === 2 ? 'att' : r[2]) : '', { gi: f >= 2 ? r[1] : '', piccola: true })));
    els.push(el.box(pre + 'q0', o.x, o.y + 158, w4, 54, 'costo di un hit', f >= 1 ? c.cHit + ' ns' : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w4 + 10, o.y + 158, w4, 54, 'costo di un miss', f >= 2 ? c.cMiss + ' ns' : '·', f === 2 ? 'att' : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w4 + 10), o.y + 158, w4, 54, 'hit e miss su cento', f >= 3 ? p.hit + ' e ' + c.miss : '·', f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q3', o.x + 3 * (w4 + 10), o.y + 158, w4, 54, 'tempo medio', f >= 5 ? c.media + ' ns' : f >= 4 ? N(c.tot) + ' ns in tutto' : '·', f >= 4 ? 'att' : '', { cls: 'stretta' }));
    return els;
  };
  return { TLB, RAM, conto, quadro };
})();
SL.registra('6.4.4', {
  titolo: 'Costo della traduzione e ipotesi sui tempi',
  obiettivo: 'Obiettivo: calcolare quanto costa un accesso alla memoria quando la traduzione è nella TLB e quando va cercata nelle tabelle, e ricavarne il tempo medio.',
  concetti: [['cache', 'Hit: una sola lettura di memoria'], ['strati', 'Miss: una lettura per livello, e poi il dato'], ['bilancio', 'La media dipende dai miss']],
  filigrana: ['clock', 'strati', 'cache'],
  richiami: {
    carte: [
      { sim: 'clock', da: 'Dall’unità 6.1.3', t: 'Il tempo medio di accesso', d: 'Tempo pagato da tutti, più frazione dei casi rari per il loro costo in più.' },
      { sim: 'cache', da: 'Dall’unità 6.4.1', t: 'La TLB', d: 'Una cache di traduzioni: un hit evita di leggere le tabelle.' },
      { sim: 'strati', da: 'Dall’unità 6.4.3', t: 'Il cammino nelle tabelle', d: 'Con due livelli servono due letture di memoria prima di conoscere il frame.' }
    ],
    domanda: { d: 'Prima di proseguire: con una tabella a quattro livelli, quante letture di memoria servono per conoscere il frame, senza l’aiuto della TLB?', o: [
      { t: 'Quattro: una per livello', ok: true, fb: 'Ogni livello richiede di leggere una voce, che conduce al livello successivo.' },
      { t: 'Una', fb: 'Una lettura basterebbe con una tabella lineare.' },
      { t: 'Cinque', fb: 'La quinta lettura è quella del dato, che avviene dopo avere trovato il frame.' }
    ] }
  },
  idea: {
    titolo: 'Quanto costa sapere dove sta un dato',
    termini: [],
    testo: [
      'Mettiamo insieme le ultime tre unità. Per leggere un dato la MMU deve prima conoscerne il frame. Se la traduzione è nella TLB la ottiene quasi subito. Se manca, deve percorrere le tabelle, leggendo una voce per ogni livello. Vogliamo sapere quanto pesa questa differenza sul tempo di un accesso.',
      'Fissiamo i tempi del modello: 1 ns per consultare la TLB, e 50 ns per ogni lettura della memoria principale. Le letture avvengono una dopo l’altra. Con un hit il percorso è breve: la TLB, e poi il dato. In tutto 1 + 50 = 51 ns.',
      'Con un [[miss della tlb|miss della TLB]] il percorso si allunga. Dopo la consultazione andata a vuoto, la MMU percorre le tabelle. Con due livelli sono due letture: la radice e la figlia. Soltanto la terza lettura prende il dato. In tutto 1 + 2 × 50 + 50 = 151 ns, quasi il triplo di un hit. Con quattro livelli le letture delle tabelle sono quattro, e un miss costa 251 ns.',
      { fig: 'scena', w: 720, h: 220, titolo: 'Due livelli: i percorsi di un hit e di un miss', nota: 'Un miss aggiunge una lettura di memoria per ogni livello della tabella. La lettura del dato c’è in entrambi i casi.', els: SL.unita644.quadro('g', { liv: 2, hit: 90 }, 5, { x: 10, y: 4, w: 700 }) },
      'La media si calcola come nell’unità 6.1.3. Se su cento accessi novanta sono hit, il tempo totale è 90 × 51 + 10 × 151 = 6100 ns, e la media è 61 ns. La stessa cosa in una riga: 51 ns, pagati da tutti, più la frazione di miss per il costo aggiuntivo di un miss, cioè 0,10 × 100. Ogni livello in più allunga soltanto il percorso dei miss: con quattro livelli la media sale a 71 ns.',
      'Due precisazioni evitano confusioni. La prima: un miss della TLB e un page fault sono eventi diversi. In un miss della TLB la pagina è in RAM, e manca soltanto la traduzione nella cache: costa qualche lettura di memoria. In un page fault è la pagina a mancare, e il costo si misura in millisecondi. La seconda: questi numeri valgono con le ipotesi dichiarate, cioè letture in serie, pagine tutte residenti, e tabelle lette dalla memoria principale. Nei processori reali anche le voci delle tabelle possono trovarsi in cache, e i miss costano meno.'
    ]
  },
  esperimento: {
    faremo: [
      'Calcoleremo il costo di un accesso alla memoria nei due casi, hit e miss della TLB, e la media su cento accessi. Sceglierai quanti livelli ha la tabella, e quanti accessi su cento trovano la traduzione nella TLB.',
      'Costruiremo i due percorsi tappa per tappa. Guarda come il numero dei livelli cambia il solo percorso dei miss, e come la frequenza degli hit decide quanto conta.'
    ],
    vedrai: [
      ['cache', 'I due percorsi', 'In alto il percorso di un hit, sotto quello di un miss. Ogni casella è una tappa, con il suo tempo.'],
      ['bilancio', 'Il conto', 'In basso: il costo dei due percorsi, quanti accessi seguono l’uno e l’altro, e il tempo medio.']
    ]
  },
  lab: {
    titolo: 'Hit, miss e tempo medio della traduzione',
    scena: { w: 860, h: 222 },
    atti: ['I tempi', 'I due percorsi', 'La media'],
    controlli: [
      { id: 'liv', tipo: 'scelta', eti: 'Livelli della tabella', opzioni: [[2, '2'], [4, '4']], valore: 2 },
      { id: 'hit', tipo: 'scelta', eti: 'Hit della TLB su cento accessi', opzioni: [[99, '99'], [90, '90'], [50, '50']], valore: 90 }
    ],
    nota: 'I passi sono sempre sei. Tempi di modello: 1 ns per la TLB, 50 ns per ogni lettura di memoria. Tutte le pagine sono residenti.',
    previsione: {
      domanda: (p) => 'La TLB si consulta in 1 ns, e ogni lettura di memoria costa 50 ns. La tabella delle pagine ha ' + p.liv + ' livelli. Su cento accessi, ' + p.hit + ' trovano la traduzione nella TLB. Qual è il tempo medio di un accesso?',
      opzioni: (p) => { const c = SL.unita644.conto(p); return [[c.cHit, c.cHit + ' ns'], [c.media, String(c.media).replace('.', ',') + ' ns'], [c.cMiss, c.cMiss + ' ns']]; }
    },
    confronto: (pred, esito, p) => { const c = SL.unita644.conto(p), V = (v) => String(v).replace('.', ','); return 'La previsione indicava ' + V(pred) + ' ns. Il tempo medio è ' + V(esito) + ' ns. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === c.cHit ? 'Quello è il tempo di un hit. I ' + c.miss + ' miss su cento durano ' + c.cMiss + ' ns ciascuno, e alzano la media.' : 'Quello è il tempo di un miss. La maggior parte degli accessi, ' + p.hit + ' su cento, è un hit da 51 ns.'); },
    costruisci(p) {
      const U = SL.unita644, c = U.conto(p), passi = [], N = SL.num, V = (v) => String(v).replace('.', ',');
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Hit', f >= 1 ? c.cHit + ' ns' : '·', 'c'], ['Miss', f >= 2 ? c.cMiss + ' ns' : '·', 'a'], ['Media', f >= 5 ? V(c.media) + ' ns' : '·']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'I tempi del modello', 'Consultare la TLB costa 1 ns. Ogni lettura della memoria principale costa 50 ns, che si tratti di una voce di tabella oppure del dato. La tabella ha ' + p.liv + ' livelli.', {});
      P(1, 1, 'Il percorso di un hit', 'La MMU consulta la TLB e trova la traduzione: 1 ns. Conosce il frame, e legge il dato: 50 ns. In tutto 51 ns, con una sola lettura di memoria.', { calc: '1 + 50 = 51 ns' });
      P(2, 1, 'Il percorso di un miss', 'La MMU consulta la TLB, e la traduzione manca: 1 ns. Percorre le tabelle, una lettura per livello: ' + p.liv + ' × 50 = ' + p.liv * 50 + ' ns. Poi legge il dato: 50 ns. In tutto ' + c.cMiss + ' ns, con ' + c.letture + ' letture di memoria.', { calc: '1 + ' + p.liv + ' × 50 + 50 = ' + c.cMiss + ' ns', chiedi: { d: 'Di quanto un miss costa più di un hit?', o: [p.liv * 50 + ' ns: le letture delle tabelle', c.cMiss + ' ns: tutto il percorso', '50 ns: la lettura del dato'], g: 0, no: 'TLB e dato si pagano in entrambi i casi. La differenza sono le ' + p.liv + ' letture delle tabelle.' } });
      P(3, 2, 'Quanti hit e quanti miss', 'Su cento accessi, ' + p.hit + ' trovano la traduzione nella TLB, e ' + c.miss + ' no. La frazione di miss è ' + V(c.miss / 100) + '.', { calc: p.hit + ' hit · ' + c.miss + ' miss' });
      P(4, 2, 'Il tempo totale', 'Gli hit costano ' + p.hit + ' × 51 = ' + N(p.hit * c.cHit) + ' ns. I miss costano ' + c.miss + ' × ' + c.cMiss + ' = ' + N(c.miss * c.cMiss) + ' ns. In tutto ' + N(c.tot) + ' ns.', { calc: N(p.hit * c.cHit) + ' + ' + N(c.miss * c.cMiss) + ' = ' + N(c.tot) + ' ns' });
      P(5, 2, 'La media', 'Dividiamo per cento: ' + V(c.media) + ' ns per accesso. Con la formula: 51 + ' + V(c.miss / 100) + ' × ' + p.liv * 50 + ' = ' + V(c.media) + ' ns. ' + (c.miss === 1 ? 'Con il 99 per cento di hit, la traduzione costa quasi quanto un hit.' : c.miss === 50 ? 'Con metà degli accessi in miss, la traduzione pesa più della lettura del dato.' : 'Un decimo degli accessi percorre le tabelle, e sposta la media di ' + p.liv * 5 + ' ns.'), { calc: '51 + ' + V(c.miss / 100) + ' × ' + p.liv * 50 + ' = ' + V(c.media) + ' ns', esito: [V(c.media) + ' ns di media', ''] });
      return { passi, esito: c.media };
    }
  },
  bilancio: {
    regola: [
      'Hit della TLB: consultazione + lettura del dato. Miss: consultazione + una lettura per livello + lettura del dato.',
      'Tempo medio = costo di un hit + frazione di miss × numero di livelli × tempo di una lettura.'
    ],
    errori: [
      ['Dimenticare la lettura del dato nel percorso di un miss.', 'Dopo avere trovato il frame, il dato va ancora letto.'],
      ['Confondere miss della TLB e page fault.', 'Nel primo caso manca la traduzione nella cache, nel secondo manca la pagina dalla RAM.'],
      ['Estendere i numeri a ogni macchina.', 'I tempi valgono con le ipotesi del modello: letture in serie e pagine residenti.']
    ],
    saFare: ['Contare le letture di memoria di un hit e di un miss.', 'Calcolare il costo dei due percorsi.', 'Calcolare il tempo medio di un accesso.'],
    esercizi: [
      { d: 'La TLB si consulta in 1 ns, e una lettura di memoria costa 50 ns. Con una tabella a tre livelli, quanto dura un accesso in caso di miss della TLB?', segnaposto: 'Un numero', giuste: ['201', '201 ns', '201ns'],
        ok: '1 + 3 × 50 + 50 = 201 ns.',
        diagnosi: [
          { se: ['151', '151 ns'], msg: 'Manca la lettura del dato, oppure un livello: le letture di memoria sono quattro.' },
          { se: ['200', '200 ns'], msg: 'Anche in un miss la TLB viene consultata per prima: 1 ns.' },
          { se: ['51', '51 ns'], msg: 'Questo è il tempo di un hit. In un miss vanno lette le tabelle.' }
        ],
        altro: 'Il valore è diverso. Somma la TLB, una lettura per livello e la lettura del dato.',
        indizi: ['TLB: 1 ns.', 'Tabelle: 3 × 50 = 150 ns.', 'Dato: 50 ns. Totale 201 ns.'],
        svolgimento: ['TLB: 1 ns.', 'Tre livelli: 150 ns.', 'Dato: 50 ns.', 'Totale: 201 ns.'] },
      { d: 'Con gli stessi tempi e due livelli, 96 accessi su cento sono hit. Qual è il tempo medio, in nanosecondi?', segnaposto: 'Un numero', giuste: ['55', '55 ns', '55ns'],
        ok: '51 + 0,04 × 100 = 55 ns.',
        diagnosi: [
          { se: ['51', '51 ns'], msg: 'Questo è il tempo di un hit. I 4 miss su cento aggiungono 100 ns ciascuno.' },
          { se: ['151', '151 ns'], msg: 'Questo è il tempo di un miss. I miss sono soltanto 4 su cento.' },
          { se: ['57', '57 ns'], msg: 'Il costo in più di un miss sono le due letture delle tabelle, 100 ns. Il dato si paga anche negli hit.' }
        ],
        altro: 'Il valore è diverso. Si applichi 51 + frazione di miss × livelli × 50.',
        indizi: ['Frazione di miss: 4 / 100 = 0,04.', 'Costo in più di un miss: 2 × 50 = 100 ns.', '51 + 0,04 × 100 = 55 ns.'],
        svolgimento: ['Hit: 96 × 51 = 4 896 ns.', 'Miss: 4 × 151 = 604 ns.', 'Totale: 5 500 ns.', 'Media: 55 ns.'] },
      { d: 'In che cosa un miss della TLB differisce da un page fault?', guida: 'Si scelga la risposta.', o: [
        { t: 'Nel miss la pagina è in RAM, e manca soltanto la traduzione nella TLB', ok: true, fb: 'Si rimedia con qualche lettura di memoria, senza toccare il disco.' },
        { t: 'Sono lo stesso evento, con due nomi', fb: 'Un page fault riguarda una pagina assente dalla RAM, e costa millisecondi.' },
        { t: 'Il miss della TLB termina il programma', fb: 'Un miss della TLB è un evento ordinario, risolto leggendo le tabelle.' }] }
    ],
    sfida: ['cslez6_4_05_translation_cost', 'Costo della traduzione']
  }
});
