'use strict';
SL.unita414 = (() => {
  const H = SL.kern.H, BASE = 0x1000, N = 6;
  // fase: 0 il gruppo in lavorazione · 1 il fault · 2 il ritiro delle più vecchie · 3 lo scarto delle più giovani · 4 il gestore
  const quadro = (pre, k, r, f, o) => {
    const el = SL.el, els = [];
    for (let j = 1; j <= N; j++) {
      const st = j < k ? (f >= 2 ? 'on' : 'zero') : j === k ? (f >= 1 ? 'err' : 'zero') : f >= 3 ? 'off' : 'zero';
      const txt = j < k ? (f >= 2 ? 'ritirata' : 'in corso') : j === k ? (f >= 1 ? 'fault' : 'in corso') : f >= 3 ? 'scartata' : 'in corso';
      els.push(el.box(pre + 'i' + j, o.x + (j - 1) * (o.w + o.gap), o.y, o.w, o.h, H(BASE + 4 * (j - 1)), txt, st, { cls: 'stretta' }));
    }
    const y2 = o.y + o.h + 24, w3 = (N * o.w + (N - 1) * o.gap - 2 * o.gap) / 3;
    els.push(el.box(pre + 'a', o.x, y2, w3, o.h, 'RAX visibile al programma', f >= 2 ? r + ' + ' + (k - 1) + ' = ' + (r + k - 1) : String(r), f === 2 || f === 4 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + w3 + o.gap, y2, w3, o.h, 'istruzioni scartate', f >= 3 ? String(N - k) : '·', f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + 2 * (w3 + o.gap), y2, w3, o.h, 'RIP salvato', f >= 4 ? H(BASE + 4 * (k - 1)) : '·', f >= 4 ? 'att' : '', { cls: 'stretta' }));
    return els;
  };
  return { H, BASE, N, quadro };
})();
SL.registra('4.1.4', {
  titolo: 'Ingresso preciso in una macchina con pipeline',
  obiettivo: 'Alla fine saprai dire quale stato trova il gestore quando un fault colpisce una istruzione in una pipeline: quali effetti sono definitivi, quali vengono scartati e da dove si riparte.',
  concetti: [['pipeline', 'Più istruzioni in lavorazione'], ['scudo', 'Il confine del ritiro'], ['puntatore', 'Da dove si riparte']],
  filigrana: ['pipeline', 'scudo', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 4.1.2', t: 'Il fault', d: 'L’istruzione resta incompiuta, e l’indirizzo salvato è il suo.' },
      { sim: 'scudo', da: 'Dall’unità 3.6.5', t: 'Lo stato preciso', d: 'Dopo un errore sono visibili tutti gli effetti delle istruzioni precedenti, e nessun effetto delle successive.' },
      { sim: 'pipeline', da: 'Dall’unità 3.5.1', t: 'La pipeline', d: 'Più istruzioni avanzano insieme, una per stadio.' }
    ],
    domanda: { d: 'Prima di proseguire: sei istruzioni di 4 byte cominciano a 0x1000. A quale indirizzo comincia la quarta?', o: [
      { t: '0x100C', ok: true, fb: 'Prima della quarta ci sono tre istruzioni: 3 × 4 = 12, che in esadecimale si scrive 0xC.' },
      { t: '0x1010', fb: 'A 0x1010 comincia la quinta. Prima della quarta le istruzioni sono tre.' },
      { t: '0x1004', fb: 'A 0x1004 comincia la seconda.' }
    ] }
  },
  idea: {
    titolo: 'Un confine netto fra il fatto e il provvisorio',
    termini: ['ritiro', 'eccezione precisa'],
    testo: [
      'Un processore con la pipeline lavora su più istruzioni insieme. Quando una istruzione scopre un fault, quelle che la seguono sono già entrate: qualcuna ha letto i propri operandi, qualcuna ha perfino calcolato un risultato. Il gestore, però, deve trovare il programma fermo in un punto esatto, come se le istruzioni fossero state eseguite una alla volta.',
      'Per ottenerlo il processore tiene separati due momenti. Una istruzione calcola il proprio risultato appena può, e lo conserva in forma provvisoria. Il risultato diventa definitivo soltanto al [[ritiro]], che avviene nell’ordine del programma: una istruzione viene ritirata quando tutte quelle che la precedono lo sono già state. Soltanto gli effetti ritirati fanno parte dello stato che il programma e il gestore possono vedere.',
      { fig: 'scena', w: 720, h: 172, titolo: 'Sei istruzioni, un fault alla quarta', nota: 'Le prime tre sono ritirate, e RAX le riflette. La quinta e la sesta perdono il lavoro provvisorio.', els: SL.unita414.quadro('g', 4, 12, 4, { x: 10, y: 8, w: 106, gap: 12, h: 58 }) },
      'Quando una istruzione arriva al ritiro con un fault, il processore si ferma lì. Le istruzioni più vecchie sono già state ritirate, e i loro effetti restano. L’istruzione con il fault e tutte le più giovani vengono scartate, insieme ai loro risultati provvisori. Questa è una [[eccezione precisa]]: lo stato visibile è quello che si avrebbe eseguendo le istruzioni in fila fino a quella sbagliata, esclusa.',
      'L’indirizzo salvato è quello dell’istruzione con il fault. Dopo il gestore il programma riparte da lì, e le istruzioni scartate vengono eseguite di nuovo. Il lavoro perduto è il prezzo della precisione, ed è piccolo, perché i fault sono rari rispetto alle istruzioni eseguite.'
    ]
  },
  esperimento: {
    faremo: [
      'Sei istruzioni consecutive, tutte in lavorazione nella pipeline, sommano ciascuna il valore 1 al registro RAX, leggendolo dalla memoria. Una di loro troverà una pagina assente: sceglierai quale, e il valore di partenza di RAX.',
      'Guarderemo quali istruzioni vengono ritirate, quali scartate, e che cosa trova il gestore. Dopo il caso proposto, sposta il fault sulla seconda istruzione.'
    ],
    vedrai: [
      ['pipeline', 'Le sei istruzioni', 'In alto: ciascuna con il suo indirizzo e il suo stato.'],
      ['register', 'Il registro', 'In basso a sinistra: il valore di RAX che il programma può vedere.'],
      ['puntatore', 'La ripresa', 'In basso a destra: le istruzioni scartate e l’indirizzo salvato.']
    ]
  },
  lab: {
    titolo: 'Un fault in mezzo a sei istruzioni',
    scena: { w: 860, h: 196 },
    atti: ['Il gruppo', 'Il fault', 'Ritiro e scarto', 'Il gestore'],
    controlli: [
      { id: 'k', tipo: 'scelta', eti: 'Istruzione con il fault', opzioni: [[2, 'la seconda'], [4, 'la quarta'], [6, 'la sesta']], valore: 4 },
      { id: 'r', tipo: 'scelta', eti: 'RAX prima del gruppo', opzioni: [[12, '12'], [30, '30']], valore: 12 }
    ],
    nota: 'I passi sono sempre sei. Ogni istruzione occupa 4 byte e somma 1 a RAX.',
    previsione: {
      domanda: (p) => 'RAX vale ' + p.r + '. Sei istruzioni sommano ciascuna 1 a RAX, e sono tutte in lavorazione nella pipeline. La ' + ['', '', 'seconda', '', 'quarta', '', 'sesta'][p.k] + ' trova una pagina assente. Quale valore di RAX trova il gestore?',
      opzioni: (p) => Array.from(new Set([p.r, p.r + p.k - 1, p.r + p.k, p.r + 6])).sort((a, b) => a - b)
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + '. Il gestore trova ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.r ? 'Le istruzioni che precedono il fault sono state ritirate, e i loro effetti restano.' : pred === p.r + p.k ? 'L’istruzione con il fault è rimasta incompiuta, e il suo incremento manca.' : 'Le istruzioni più giovani vengono scartate, anche se avevano già calcolato un risultato.'),
    costruisci(p) {
      const U = SL.unita414, H = U.H, passi = [], k = p.k, r = p.r, v = r + k - 1, a = U.BASE + 4 * (k - 1), ORD = ['', 'prima', 'seconda', 'terza', 'quarta', 'quinta', 'sesta'];
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'ISTRUZIONI NELLA PIPELINE, IN ORDINE DI PROGRAMMA', 'mono')].concat(U.quadro('q', k, r, f, { x: 20, y: 24, w: 126, gap: 12, h: 62 }));
      const hud = (f) => [['Fault', 'alla ' + ORD[k], 'a'], ['RAX visibile', String(f >= 2 ? v : r)], ['RIP salvato', f >= 4 ? H(a) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Sei istruzioni in lavorazione', 'Le sei istruzioni cominciano a ' + H(U.BASE) + ' e occupano 4 byte ciascuna. Sono tutte dentro la pipeline, a stadi diversi. Ognuna legge il valore 1 dalla memoria e lo somma a RAX, che per ora vale ' + r + '. I risultati calcolati finora sono provvisori.',
        { chiedi: { d: 'A quale indirizzo comincia la ' + ORD[k] + ' istruzione?', o: [H(U.BASE + 4 * k), H(a), H(U.BASE + k)], g: 1, no: 'Prima della ' + ORD[k] + ' ci sono ' + (k - 1) + (k - 1 === 1 ? ' istruzione' : ' istruzioni') + ' da 4 byte: ' + H(U.BASE) + ' + ' + (4 * (k - 1)) + ' = ' + H(a) + '.' } });
      P(1, 1, 'Il fault', 'La ' + ORD[k] + ' istruzione, a ' + H(a) + ', chiede alla memoria un dato che si trova in una pagina assente. La lettura fallisce. Le altre istruzioni, intanto, sono ancora in lavorazione.', { calc: 'fault a ' + H(a) });
      P(2, 2, 'Il ritiro delle più vecchie', k === 2 ? 'L’istruzione che precede il fault viene ritirata, e il suo incremento diventa definitivo. RAX visibile passa da ' + r + ' a ' + v + '.' : 'Le ' + (k - 1) + ' istruzioni che precedono il fault vengono ritirate, nell’ordine del programma. I loro incrementi diventano definitivi, e RAX visibile passa da ' + r + ' a ' + v + '.', { calc: r + ' + ' + (k - 1) + ' = ' + v });
      P(3, 2, 'Lo scarto delle più giovani', k === 6 ? 'Dopo la sesta istruzione il gruppo è finito, e nessuna istruzione più giovane è in lavorazione. Viene scartato soltanto il lavoro dell’istruzione con il fault.' : 'Le ' + (6 - k) + ' istruzioni che seguono il fault erano già entrate nella pipeline, e qualcuna aveva calcolato la propria somma. Il processore le scarta tutte: i loro risultati provvisori scompaiono senza toccare RAX.', { calc: 'scartate: ' + (6 - k), chiedi: { d: 'Dopo il gestore, da quale istruzione ripartirà il programma?', o: ['Dalla prima, a ' + H(U.BASE), 'Dalla ' + ORD[k] + ', a ' + H(a), 'Da quella dopo il fault, a ' + H(a + 4)], g: 1, no: 'Un fault lascia l’istruzione incompiuta, e l’indirizzo salvato è il suo.' } });
      P(4, 3, 'Che cosa trova il gestore', 'Il gestore trova RAX = ' + v + ' e l’indirizzo salvato ' + H(a) + '. È lo stato che si avrebbe eseguendo le istruzioni una alla volta fino alla ' + ORD[k] + ', esclusa. La pipeline è invisibile.', { calc: 'RAX = ' + v + ' · RIP salvato = ' + H(a), esito: ['RAX = ' + v, 'si'] });
      P(4, 3, 'La ripresa', 'Il gestore prepara la pagina. Il programma riparte da ' + H(a) + ': la ' + ORD[k] + ' istruzione viene ripetuta' + (k === 6 ? '.' : ', e dopo di lei le ' + (6 - k) + ' scartate.') + ' Alla fine del gruppo RAX varrà ' + (r + 6) + ', come se il fault non fosse mai avvenuto.', { calc: 'alla fine del gruppo: RAX = ' + (r + 6), esito: ['RAX = ' + v, 'si'] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'In una pipeline i risultati restano provvisori fino al ritiro, che avviene nell’ordine del programma. Lo stato visibile contiene soltanto gli effetti ritirati.',
      'Quando una istruzione incontra un fault, le più vecchie vengono ritirate, lei e le più giovani vengono scartate. L’indirizzo salvato è quello dell’istruzione con il fault, da cui il programma riparte.'
    ],
    errori: [
      ['Contare gli effetti delle istruzioni più giovani.', 'Il risultato che avevano forse calcolato era soltanto provvisorio, e lo scarto lo cancella.'],
      ['Contare l’effetto dell’istruzione con il fault.', 'L’istruzione è incompiuta, e verrà ripetuta dopo il gestore.'],
      ['Ripartire dall’inizio del gruppo.', 'Le istruzioni ritirate hanno effetti definitivi. Ripeterle li sommerebbe due volte.']
    ],
    saFare: ['Distinguo un risultato provvisorio da uno ritirato.', 'Dico quale stato trova il gestore dopo un fault.', 'Calcolo l’indirizzo da cui il programma riparte.'],
    esercizi: [
      { d: 'Otto istruzioni consecutive sommano ciascuna 1 a un registro che vale 20. Sono tutte nella pipeline quando la sesta incontra un fault. Quale valore del registro trova il gestore?', segnaposto: 'Un numero', giuste: ['25', 'venticinque'],
        ok: 'Le cinque istruzioni che precedono il fault sono ritirate: 20 + 5 = 25.',
        diagnosi: [
          { se: ['26', 'ventisei'], msg: 'L’istruzione con il fault è incompiuta, e il suo incremento manca.' },
          { se: ['28', 'ventotto'], msg: 'Le istruzioni più giovani vengono scartate insieme ai loro risultati provvisori.' },
          { se: ['20', 'venti'], msg: 'Le istruzioni che precedono il fault sono state ritirate, e i loro effetti restano.' }
        ],
        altro: 'Il numero è diverso. Conta soltanto le istruzioni che precedono quella con il fault.',
        indizi: ['Il fault colpisce la sesta.', 'Le istruzioni ritirate sono le prime cinque.', '20 + 5.'],
        svolgimento: ['Istruzioni ritirate: 5.', 'Istruzione con il fault e più giovani: scartate.', 'Registro: 20 + 5 = 25.'] },
      { d: 'Le stesse otto istruzioni occupano 4 byte ciascuna e cominciano a 0x2000. Quale indirizzo viene salvato quando la sesta incontra il fault? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['2014', '0x2014', '2014h'],
        ok: 'Prima della sesta ci sono cinque istruzioni: 5 × 4 = 20 byte, cioè 0x14.',
        diagnosi: [
          { se: ['2018', '0x2018', '2018h'], msg: 'Questo è l’indirizzo della settima. Dopo un fault si riparte dall’istruzione che ha fallito.' },
          { se: ['2020', '0x2020', '2020h'], msg: 'Venti byte in esadecimale si scrivono 0x14.' },
          { se: ['2000', '0x2000', '2000h'], msg: 'Le prime cinque istruzioni sono ritirate, e ripeterle ne raddoppierebbe gli effetti.' }
        ],
        altro: 'Il valore è diverso. Serve l’indirizzo della sesta istruzione.',
        indizi: ['Prima della sesta ci sono cinque istruzioni.', '5 × 4 = 20 byte, cioè 0x14.', '0x2000 + 0x14.'],
        svolgimento: ['Istruzioni che precedono la sesta: 5.', 'Distanza: 5 × 4 = 20 = 0x14.', 'Indirizzo salvato: 0x2014.'] },
      { d: 'Perché il processore scarta le istruzioni più giovani di quella con il fault, anche se avevano già calcolato un risultato?', guida: 'Scegli la risposta.', o: [
        { t: 'Perché il gestore deve vedere lo stato che si avrebbe eseguendo le istruzioni una alla volta', ok: true, fb: 'Eseguite in fila, le istruzioni dopo il fault non sarebbero nemmeno cominciate.' },
        { t: 'Perché i loro risultati sono sbagliati', fb: 'I risultati potrebbero essere giusti. Vengono scartati perché nel programma quelle istruzioni vengono dopo il fault.' },
        { t: 'Perché la pipeline deve essere svuotata a ogni interrupt', fb: 'Lo scarto serve a rendere preciso lo stato. Le istruzioni scartate vengono poi eseguite di nuovo.' }] }
    ]
  }
});
