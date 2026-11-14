'use strict';
SL.registra('3.5.2', {
  titolo: 'Leggere i diagrammi temporali della pipeline',
  obiettivo: 'Obiettivo: leggere un diagramma di pipeline nei due sensi: lungo una riga, per seguire un’istruzione, e lungo una colonna, per sapere che cosa contiene ogni stadio in un dato ciclo.',
  concetti: [['pipeline', 'Cinque stadi con un nome'], ['tabella', 'Righe e colonne'], ['lente', 'La fotografia di un ciclo']],
  filigrana: ['pipeline', 'tabella', 'lente'],
  richiami: {
    carte: [
      { sim: 'pipeline', da: 'Dall’unità 3.5.1', t: 'Istruzioni che si sovrappongono', d: 'In ogni ciclo ogni stadio ospita un’istruzione diversa, e ciascuna avanza di uno stadio per ciclo.' },
      { sim: 'strati', da: 'Dall’unità 3.3.3', t: 'Le sei fasi', d: 'Prelievo, decodifica, esecuzione, memoria, scrittura e aggiornamento del PC.' },
      { sim: 'bilancio', da: 'Dall’unità 3.5.1', t: 'I cicli di un flusso', d: 'N istruzioni in una pipeline vuota di k stadi terminano in k + N − 1 cicli.' }
    ],
    domanda: { d: 'Prima di proseguire: in una pipeline di 5 stadi un’istruzione entra nel primo stadio al ciclo 1. Quale stadio occupa al ciclo 4?', o: [
      { t: 'Il quarto', ok: true, fb: 'Avanza di uno stadio per ciclo: primo stadio al ciclo 1, quarto al ciclo 4.' },
      { t: 'Il terzo', fb: 'Al ciclo 1 occupa già il primo stadio, quindi al ciclo 4 ne ha raggiunti quattro.' },
      { t: 'Il quinto', fb: 'Il quinto stadio viene raggiunto al ciclo 5.' }
    ] }
  },
  idea: {
    titolo: 'Leggere per righe, leggere per colonne',
    termini: ['diagramma di pipeline', 'svuotamento'],
    testo: [
      'Le fasi del capitolo 3.3 diventano i cinque stadi della pipeline di Y86-64. Ciascuno ha una lettera, presa dal nome inglese: F per il prelievo, D per la decodifica, E per l’esecuzione, M per la memoria, W per la scrittura nei registri. L’aggiornamento del PC resta senza uno stadio proprio, perché la scelta del prossimo indirizzo avviene all’inizio di F.',
      'Il [[diagramma di pipeline]] ha una riga per istruzione e una colonna per ciclo. Letto lungo una riga racconta il viaggio di un’istruzione: F, D, E, M, W, una lettera per ciclo. Letto lungo una colonna è una fotografia, che dice quale istruzione occupa ciascuno stadio in quel ciclo.',
      { fig: 'scena', w: 720, h: 222, titolo: 'Cinque istruzioni indipendenti', nota: 'La colonna in evidenza è la fotografia del ciclo 5: tutti gli stadi sono occupati.', els:
        SL.pipe.diagramma('g', [1, 2, 3, 4, 5].map((i) => ({ n: 'I' + i, da: i, s: ['F', 'D', 'E', 'M', 'W'] })), { x: 100, y: 4, passo: 66, cicli: 9, py: 38, h: 30, evid: 5 }) },
      'In un flusso ideale il conto è semplice. L’istruzione numero i entra in F al ciclo i. Al ciclo c ha percorso c − i stadi oltre F: con 0 si trova in F, con 1 in D, con 2 in E, con 3 in M, con 4 in W. Con valori negativi l’istruzione deve ancora entrare, e con valori oltre 4 è già uscita.',
      'La fotografia mostra anche l’inizio e la fine di un flusso. Nei primi cicli gli stadi di destra sono vuoti, ed è il riempimento. Dopo l’ultimo prelievo restano vuoti gli stadi di sinistra, mentre le ultime istruzioni proseguono fino a W. Questa coda si chiama [[svuotamento]], e fa parte anch’essa del tempo totale.'
    ]
  },
  esperimento: {
    faremo: [
      'Alcune istruzioni indipendenti entrano una per ciclo nella pipeline F, D, E, M, W. Sceglierai quante sono e quale ciclo fotografare.',
      'Guarderemo il ciclo precedente, quello scelto e quello successivo, seguendo le stesse istruzioni da una fotografia all’altra. Dopo il caso proposto scegli il ciclo 8, quando la pipeline si sta svuotando.'
    ],
    vedrai: [
      ['tabella', 'Il diagramma', 'In alto: una riga per istruzione, una colonna per ciclo.'],
      ['lente', 'La colonna', 'In evidenza: il ciclo che si sta osservando.'],
      ['pipeline', 'La fotografia', 'In basso: i cinque stadi, con l’istruzione che ciascuno ospita in quel ciclo.']
    ]
  },
  lab: {
    titolo: 'La fotografia di un ciclo',
    scena: { w: 860, h: 320 },
    atti: ['Il ciclo precedente', 'Il ciclo scelto', 'La fotografia', 'Il ciclo successivo', 'L’intero flusso'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Istruzioni', opzioni: [[3, '3'], [5, '5']], valore: 5 },
      { id: 'c', tipo: 'scelta', eti: 'Ciclo da fotografare', opzioni: [[2, '2'], [4, '4'], [5, '5'], [6, '6'], [8, '8']], valore: 4 }
    ],
    nota: 'I passi sono sempre cinque. Le istruzioni sono indipendenti e avanzano di uno stadio per ciclo.',
    previsione: {
      domanda: (p) => p.n + ' istruzioni indipendenti, da I1 a I' + p.n + ', entrano una per ciclo nella pipeline F, D, E, M, W. Al ciclo ' + p.c + ', quale istruzione occupa lo stadio E?',
      opzioni: (p) => Array.from(new Set([p.c - 1, p.c - 2, p.c - 3, p.c, p.n, 1].filter((i) => i >= 1 && i <= p.n))).sort((a, b) => a - b).map((i) => [i, 'I' + i]).concat([[0, 'Nessuna istruzione']])
    },
    confronto: (pred, esito, p) => { const T = (v) => (v ? 'I' + v : 'nessuna istruzione'); return 'La previsione indicava ' + T(pred) + '. Lo stadio E ospita ' + T(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Lo stadio E sta due passi dopo F, quindi al ciclo ' + p.c + ' vi si trova l’istruzione entrata al ciclo ' + (p.c - 2) + (esito ? ', cioè I' + esito + '.' : p.c - 2 < 1 ? ', cioè prima dell’inizio del flusso. La pipeline si sta ancora riempiendo.' : ', e il flusso ha soltanto ' + p.n + ' istruzioni: quello stadio si è già svuotato.')); },
    costruisci(p) {
      const el = SL.el, passi = [], n = p.n, c0 = p.c, ST = ['F', 'D', 'E', 'M', 'W'], righe = Array.from({ length: n }, (_, i) => ({ n: 'I' + (i + 1), da: i + 1, s: ST })), tot = n + 4;
      const inStadio = (c, j) => { const i = c - j; return i >= 1 && i <= n ? i : 0; };
      const quadro = (o) => {
        const c = o.c, els = [el.nota('t0', 20, 0, 'CICLO', 'mono')];
        SL.pipe.diagramma('d', righe, { x: 130, y: 0, passo: 66, cicli: 9, py: 32, h: 26, fino: o.tutto ? 9 : c, evid: c }).forEach((e) => els.push(e));
        els.push(el.nota('tf', 20, 206, o.foto ? 'FOTOGRAFIA DEL CICLO ' + c : 'STADI NEL CICLO ' + c, 'mono', o.foto ? 'att' : ''));
        ST.forEach((s, j) => { const i = inStadio(c, j); els.push(el.box('s' + j, 20 + j * 166, 232, 158, 74, 'stadio ' + s, i ? 'I' + i : 'vuoto', o.foto && (o.stadio == null || o.stadio === j) ? (i ? 'att' : 'off') : i ? 'on' : 'off', { cls: 'stretta' })); });
        return els;
      };
      const hud = (c) => [['Ciclo', String(c), 'a'], ['Stadi occupati', String(ST.filter((_, j) => inStadio(c, j)).length)], ['In E', inStadio(c, 2) ? 'I' + inStadio(c, 2) : 'nessuna', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.c), els: quadro(o) }, extra));
      const elenco = (c) => { const v = ST.map((s, j) => (inStadio(c, j) ? 'I' + inStadio(c, j) + ' in ' + s : null)).filter(Boolean); return v.length ? v.join(', ') : 'nessuna istruzione'; };
      const stadioDi = (i, c) => { const j = c - i; return j < 0 ? 'Deve ancora entrare' : j > 4 ? 'È già uscita' : 'Stadio ' + ST[j]; };

      P({ c: c0 - 1 }, 0, 'Il ciclo ' + (c0 - 1), 'Cominciamo dal ciclo che precede quello scelto. Al ciclo ' + (c0 - 1) + ' la pipeline contiene: ' + elenco(c0 - 1) + '. Al prossimo fronte ogni istruzione passerà allo stadio successivo.',
        { chiedi: { d: 'I1 è entrata in F al ciclo 1. Dove si troverà al ciclo ' + c0 + '?', o: Array.from(new Set([stadioDi(1, c0 - 1), stadioDi(1, c0), stadioDi(1, c0 + 1)])), g: Array.from(new Set([stadioDi(1, c0 - 1), stadioDi(1, c0), stadioDi(1, c0 + 1)])).indexOf(stadioDi(1, c0)), no: 'Al ciclo ' + c0 + ' I1 ha percorso ' + (c0 - 1) + (c0 - 1 === 1 ? ' stadio' : ' stadi') + ' oltre F.' } });
      P({ c: c0 }, 1, 'Il ciclo ' + c0, 'Tutte le istruzioni sono avanzate di uno stadio. ' + (c0 <= n ? 'In F è entrata I' + c0 + '.' : 'In F non è entrato nulla, perché le ' + n + ' istruzioni del flusso sono già state tutte prelevate.') + (c0 - 5 >= 1 && c0 - 5 <= n ? ' I' + (c0 - 5) + ' ha lasciato W ed è completa.' : '') + ' Ora la pipeline contiene: ' + elenco(c0) + '.', { calc: 'ciclo ' + c0 + ': ' + ST.map((s, j) => (inStadio(c0, j) ? 'I' + inStadio(c0, j) : '·')).join(' ') });
      const e = inStadio(c0, 2);
      P({ c: c0, foto: true, stadio: 2 }, 2, 'Lo stadio E al ciclo ' + c0, 'Leggiamo la colonna del ciclo ' + c0 + ' dall’alto in basso, cercando la lettera E. ' + (e ? 'La troviamo nella riga di I' + e + '. Il conto conferma: lo stadio E sta due passi dopo F, quindi ospita l’istruzione entrata al ciclo ' + c0 + ' − 2 = ' + (c0 - 2) + '.' : c0 - 2 < 1 ? 'In questa colonna la lettera E manca: nessuna istruzione è ancora arrivata così avanti. La pipeline si sta riempiendo.' : 'In questa colonna la lettera E manca: l’ultima istruzione l’ha già superata. La pipeline si sta svuotando.'),
        { calc: e ? 'E al ciclo ' + c0 + ': I' + e : 'E al ciclo ' + c0 + ': vuoto', chiedi: { d: 'Al ciclo successivo, il ' + (c0 + 1) + ', quale istruzione occuperà lo stadio E?', o: Array.from(new Set([inStadio(c0 + 1, 1), inStadio(c0 + 1, 2), inStadio(c0 + 1, 3)])).map((i) => (i ? 'I' + i : 'Nessuna')), g: Array.from(new Set([inStadio(c0 + 1, 1), inStadio(c0 + 1, 2), inStadio(c0 + 1, 3)])).indexOf(inStadio(c0 + 1, 2)), no: 'In E arriva l’istruzione che ora si trova in D' + (inStadio(c0, 1) ? ', cioè I' + inStadio(c0, 1) + '.' : ', che è vuoto.') } });
      P({ c: c0 + 1, foto: true }, 3, 'Il ciclo ' + (c0 + 1), 'Un altro fronte, e la fotografia scorre di un posto verso destra. Al ciclo ' + (c0 + 1) + ' la pipeline contiene: ' + elenco(c0 + 1) + '. Ogni istruzione occupa lo stadio che nella fotografia precedente apparteneva a quella entrata prima di lei.', { calc: 'ciclo ' + (c0 + 1) + ': ' + ST.map((s, j) => (inStadio(c0 + 1, j) ? 'I' + inStadio(c0 + 1, j) : '·')).join(' ') });
      P({ c: c0, tutto: true }, 4, 'Il flusso intero', 'Il diagramma completo occupa ' + tot + ' cicli: ' + n + ' istruzioni più i 4 cicli che servono all’ultima per arrivare da F a W. Nei primi 4 cicli lo stadio W è vuoto, e la pipeline si riempie. Negli ultimi 4 è vuoto lo stadio F, e la pipeline si svuota.' + (n < 5 ? ' Con ' + n + ' istruzioni gli stadi non sono mai tutti occupati.' : ' Soltanto al ciclo 5 tutti gli stadi sono occupati.'),
        { calc: n + ' + 4 = ' + tot + ' cicli', esito: [e ? 'in E al ciclo ' + c0 + ': I' + e : 'E vuoto al ciclo ' + c0, 'si'] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'Lungo una riga il diagramma mostra il viaggio di un’istruzione. Lungo una colonna mostra il contenuto dei cinque stadi in un ciclo.',
      'In un flusso ideale l’istruzione i entra in F al ciclo i, e al ciclo c si trova c − i stadi oltre F. N istruzioni terminano al ciclo N + 4.'
    ],
    errori: [
      ['Confondere il numero del ciclo con lo stadio.', 'Al ciclo 4 soltanto I1 si trova nel quarto stadio. Le altre sono più indietro, ciascuna di un posto.'],
      ['Dimenticare lo svuotamento.', 'Dopo l’ultimo prelievo servono ancora 4 cicli perché l’ultima istruzione arrivi in W.'],
      ['Mettere due istruzioni nello stesso stadio.', 'In una colonna ogni lettera compare al massimo una volta: uno stadio ospita una sola istruzione per ciclo.']
    ],
    saFare: ['Seguire un’istruzione lungo la sua riga.', 'Leggere in una colonna il contenuto dei cinque stadi.', 'Riconoscere i cicli di riempimento e quelli di svuotamento.'],
    esercizi: [
      { d: 'In un flusso ideale, quale istruzione occupa lo stadio M al ciclo 7? Rispondi con il numero dell’istruzione.', segnaposto: 'Un numero', giuste: ['4', 'i4', 'quattro'],
        ok: 'Lo stadio M sta tre passi dopo F, quindi al ciclo 7 ospita l’istruzione entrata al ciclo 4.',
        diagnosi: [
          { se: ['7', 'i7'], msg: 'I7 entra in F al ciclo 7. Lo stadio M ospita un’istruzione entrata tre cicli prima.' },
          { se: ['3', 'i3'], msg: 'I3 al ciclo 7 ha percorso quattro stadi oltre F, e si trova in W.' },
          { se: ['5', 'i5'], msg: 'I5 al ciclo 7 ha percorso due stadi oltre F, e si trova in E.' }
        ],
        altro: 'Il numero è diverso. Conta di quanti passi lo stadio M segue F, e sottraili dal ciclo.',
        indizi: ['Gli stadi, nell’ordine, sono F, D, E, M, W.', 'M sta tre passi dopo F.', '7 − 3.'],
        svolgimento: ['M è il quarto stadio: tre passi dopo F.', 'L’istruzione in M è entrata al ciclo 7 − 3 = 4.', 'È I4.'] },
      { d: 'Sei istruzioni indipendenti entrano una per ciclo in una pipeline vuota di cinque stadi. In quale ciclo l’ultima occupa lo stadio W?', segnaposto: 'Un numero', giuste: ['10', 'dieci'],
        ok: 'I6 entra in F al ciclo 6 e raggiunge W quattro cicli dopo: 6 + 4 = 10.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Al ciclo 6 l’ultima istruzione entra in F. Le servono altri 4 cicli per arrivare in W.' },
          { se: ['11', 'undici'], msg: 'Da F a W i passi sono 4, perché F stesso occupa il primo ciclo.' },
          { se: ['30', 'trenta'], msg: 'Le istruzioni si sovrappongono: non serve attendere che ciascuna finisca prima di cominciare la successiva.' }
        ],
        altro: 'Il numero è diverso. L’ultima istruzione entra in F al ciclo 6, poi avanza di uno stadio per ciclo.',
        indizi: ['I6 entra in F al ciclo 6.', 'W sta quattro passi dopo F.', '6 + 4.'],
        svolgimento: ['Ingresso di I6: ciclo 6.', 'Da F a W: 4 passi.', 'I6 in W: ciclo 10.'] }
    ],
    sfida: ['cslez3_5_01_random_assembly', 'Riempimento, svuotamento e cicli di pipeline']
  }
});
