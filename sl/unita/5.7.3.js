'use strict';
SL.unita573 = (() => {
  const PROC = [{ n: 'A', ha: [1, 0], max: [2, 2] }, { n: 'B', ha: [1, 1], max: [2, 1] }, { n: 'C', ha: [1, 0], max: [1, 2] }];
  const bisogno = (q) => [q.max[0] - q.ha[0], q.max[1] - q.ha[1]];
  const c2 = (v) => '(' + v[0] + ',' + v[1] + ')';
  // Prova di sicurezza: a ogni giro completa il primo processo, in ordine alfabetico, il cui bisogno è coperto
  const prova = (a, b) => { let disp = [a, b]; const seq = [], passi = []; let trovato = true; while (trovato && seq.length < PROC.length) { trovato = false; const scartati = []; for (const q of PROC) { if (seq.indexOf(q.n) >= 0) continue; const bs = bisogno(q); if (bs[0] <= disp[0] && bs[1] <= disp[1]) { const dopo = [disp[0] + q.ha[0], disp[1] + q.ha[1]]; passi.push({ chi: q, prima: disp, dopo, scartati }); disp = dopo; seq.push(q.n); trovato = true; break; } scartati.push(q); } if (!trovato) passi.push({ chi: null, prima: disp, dopo: disp, scartati }); } return { seq, passi, sicuro: seq.length === PROC.length, disp }; };
  // fatti: nomi completati · mostra: 0 senza bisogni, 1 con bisogni · acc: processo in esame · fermi: processi esclusi
  const quadro = (pre, s, o) => {
    const el = SL.el, els = [], cw = o.cw, passo = cw + 8, x0 = o.x + 44;
    PROC.forEach((q, r) => {
      const y = o.y + 22 + r * 44, fatto = s.fatti.indexOf(q.n) >= 0, sotto = s.acc === q.n, fermo = s.fermi && s.fermi.indexOf(q.n) >= 0, st = fatto ? '' : sotto ? 'att' : fermo ? 'err' : 'on';
      els.push(el.nota(pre + 'n' + r, o.x + 6, y + 4, q.n, 'forte', sotto ? 'att' : ''));
      els.push(el.cella(pre + 'h' + r, x0, y, cw, 34, c2(q.ha), st, Object.assign({ piccola: true }, r === 0 ? { so: 'possiede' } : {})));
      els.push(el.cella(pre + 'm' + r, x0 + passo, y, cw, 34, c2(q.max), st, Object.assign({ piccola: true }, r === 0 ? { so: 'massimo' } : {})));
      els.push(el.cella(pre + 'b' + r, x0 + 2 * passo, y, cw, 34, s.mostra ? c2(bisogno(q)) : '', s.mostra ? st : '', Object.assign({ piccola: true }, r === 0 ? { so: 'bisogno' } : {})));
      els.push(el.cella(pre + 's' + r, x0 + 3 * passo, y, cw + 20, 34, fatto ? 'completa' : fermo ? 'escluso' : '', fatto ? 'on' : fermo ? 'err' : '', Object.assign({ piccola: true }, r === 0 ? { so: 'esito' } : {})));
    });
    const xr = x0 + 4 * passo + 36, wr = o.x + o.w - xr;
    els.push(el.box(pre + 'd', xr, o.y, wr, 46, 'disponibile (X,Y)', c2(s.disp), s.accD ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'q', xr, o.y + 54, wr, 46, 'sequenza', s.fatti.length ? s.fatti.join(' → ') : '·', s.fatti.length ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'v', xr, o.y + 108, wr, 46, 'confronto', s.conf || '·', s.conf ? (s.confNo ? 'err' : 'att') : '', { cls: 'stretta' }));
    return els;
  };
  return { PROC, bisogno, c2, prova, quadro };
})();
SL.registra('5.7.3', {
  titolo: 'Evitamento e sequenze sicure di completamento',
  obiettivo: 'Obiettivo: calcolare il bisogno residuo di un processo, cercare una sequenza di completamento, e distinguere uno stato sicuro da uno stato privo di garanzie.',
  concetti: [['bilancio', 'Massimo dichiarato meno posseduto'], ['riproduci', 'Una sequenza in cui tutti finiscono'], ['scudo', 'Sicuro, oppure senza garanzia']],
  filigrana: ['bilancio', 'scudo', 'tabella'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 5.7.1', t: 'La riduzione del grafo', d: 'Si fa terminare chi può finire, si liberano le sue risorse, e si ripete.' },
      { sim: 'tabella', da: 'Dall’unità 5.7.1', t: 'Le istanze', d: 'Una risorsa può esistere in più esemplari equivalenti.' },
      { sim: 'scudo', da: 'Dall’unità 5.7.2', t: 'La prevenzione', d: 'Una regola fissa, valida sempre, che rende impossibile una delle quattro condizioni.' }
    ],
    domanda: { d: 'Prima di proseguire: sono libere 2 istanze di una risorsa. Un processo ne possiede 1, e per terminare gliene servono altre 2. Può terminare?', o: [
      { t: 'Sì: riceve le 2 libere, termina, e ne restituisce 3', ok: true, fb: 'Il bisogno, 2, è coperto dalle istanze libere. Alla fine tornano libere anche quelle che possedeva.' },
      { t: 'No: gliene servono 3', fb: 'Tre è il totale. Una la possiede già, e gliene mancano 2.' },
      { t: 'Sì, e alla fine ne restano libere 2', fb: 'Terminando restituisce anche l’istanza che possedeva dall’inizio: 3 in tutto.' }
    ] }
  },
  idea: {
    titolo: 'Concedere soltanto se resta una via d’uscita',
    termini: ['bisogno residuo', 'stato sicuro', 'algoritmo del banchiere'],
    testo: [
      'La prevenzione impone una regola rigida a tutti, sempre. Esiste una strategia più flessibile, che decide caso per caso: prima di concedere una risorsa, il sistema si chiede se dopo la concessione resterà comunque un modo per far terminare tutti. Se la risposta è sì concede, altrimenti fa aspettare il richiedente anche se la risorsa è libera. Questa strategia si chiama evitamento.',
      'Per ragionare così il sistema ha bisogno di un’informazione in più. Ogni processo dichiara in anticipo il massimo di ciascuna risorsa che potrà mai chiedere. Dal massimo e da ciò che il processo possiede si ricava il [[bisogno residuo]]: massimo meno posseduto. È la richiesta più grande che quel processo potrà ancora presentare. Con due tipi di risorsa, X e Y, ogni quantità è una coppia. Un processo che possiede (1,1) e ha dichiarato (2,1) ha un bisogno residuo di (1,0): ancora una X, e nessuna Y.',
      'Il controllo ricalca la riduzione del grafo, applicata al caso peggiore. Si cerca un processo il cui bisogno residuo sia coperto dalle istanze disponibili, componente per componente: un’abbondanza di X lascia scoperta una mancanza di Y. Si immagina che quel processo riceva tutto, termini e restituisca ciò che possedeva. Il disponibile cresce, e si ripete. Se si riesce a mettere in fila tutti i processi, lo stato è uno [[stato sicuro]], e la fila ottenuta è una sequenza di completamento.',
      { fig: 'scena', w: 720, h: 166, titolo: 'Una X e una Y libere: può cominciare B', nota: 'Il bisogno di B, (1,0), è coperto da (1,1). Quando B termina restituisce (1,1), e il disponibile sale a (2,2).', els: SL.unita573.quadro('g', { fatti: [], mostra: 1, acc: 'B', disp: [1, 1], conf: 'B: (1,0) ≤ (1,1)' }, { x: 10, y: 4, w: 700, cw: 84 }) },
      'Il procedimento porta il nome di [[algoritmo del banchiere]]. Il paragone è con una banca che ha promesso a ogni cliente un credito massimo, e che in cassa tiene meno della somma delle promesse. Il banchiere prudente concede un prestito soltanto se, dopo, gli resta abbastanza per accontentare fino in fondo almeno un cliente, che restituendo tutto gli permetterà di accontentare il successivo.',
      'Resta da chiarire che cosa significhi il verdetto opposto. Uno stato in cui la sequenza non si trova è insicuro, e insicuro vuol dire «senza garanzia». Il deadlock non è ancora avvenuto, e potrebbe anche non avvenire, se i processi chiederanno meno del massimo dichiarato. Il sistema però ha perso la certezza di poterne uscire. Per accertare un deadlock già in corso servono le richieste effettive, che vedremo nella prossima unità.'
    ]
  },
  esperimento: {
    faremo: [
      'Tre processi, A, B e C, possiedono alcune istanze di X e di Y e hanno dichiarato i loro massimi. Sceglierai quante X e quante Y sono libere in questo momento.',
      'Calcoleremo i bisogni residui, e cercheremo una sequenza di completamento. A ogni giro esamineremo i processi in ordine alfabetico, confrontando il bisogno con il disponibile.'
    ],
    vedrai: [
      ['tabella', 'La tabella dei processi', 'A sinistra: per ogni processo ciò che possiede, il massimo dichiarato, il bisogno residuo e l’esito. Ogni coppia è (X,Y).'],
      ['bilancio', 'Il disponibile e la sequenza', 'A destra: le istanze libere, la sequenza costruita finora, e il confronto in corso.']
    ]
  },
  lab: {
    titolo: 'La prova di sicurezza',
    scena: { w: 860, h: 168 },
    atti: ['Lo stato', 'I bisogni', 'La sequenza', 'Il verdetto'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Istanze di X libere', opzioni: [[0, '0'], [1, '1']], valore: 1 },
      { id: 'b', tipo: 'scelta', eti: 'Istanze di Y libere', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 1 }
    ],
    nota: 'Il numero dei passi dipende dal disponibile. Possessi e massimi dei tre processi restano fissi.',
    previsione: {
      domanda: (p) => 'A possiede (1,0) con massimo (2,2). B possiede (1,1) con massimo (2,1). C possiede (1,0) con massimo (1,2). Sono libere ' + p.a + ' X e ' + p.b + ' Y. Esiste una sequenza in cui tutti e tre possono completare?',
      opzioni: () => [['si', 'Sì: lo stato è sicuro'], ['no', 'No: lo stato è insicuro']]
    },
    confronto: (pred, esito, p) => { const R = SL.unita573.prova(p.a, p.b); return 'La previsione indicava «' + (pred === 'si' ? 'sicuro' : 'insicuro') + '». Lo stato è ' + (esito === 'si' ? 'sicuro' : 'insicuro') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'si' ? 'La sequenza ' + R.seq.join(', ') + ' fa completare tutti: ogni processo che termina restituisce abbastanza per il successivo.' : R.seq.length ? 'Dopo ' + R.seq.join(', ') + ' il disponibile è ' + SL.unita573.c2(R.disp) + ', e nessuno dei bisogni rimasti è coperto.' : 'Con ' + SL.unita573.c2([p.a, p.b]) + ' nessun bisogno è coperto, e la sequenza non può cominciare.'); },
    costruisci(p) {
      const U = SL.unita573, R = U.prova(p.a, p.b), passi = [], c2 = U.c2;
      const P = (atto, titolo, testo, s, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Disponibile', c2(s.disp), 'a'], ['Sequenza', s.fatti.length ? s.fatti.join(' → ') : '·', 'c'], ['Da collocare', String(3 - s.fatti.length)]], els: U.quadro('b', s, { x: 20, y: 4, w: 820, cw: 100 }) }, extra));
      P(0, 'Lo stato', 'Tre processi possiedono alcune istanze e hanno dichiarato un massimo. Ogni coppia indica (X,Y). In questo momento sono libere ' + p.a + ' X e ' + p.b + ' Y: il disponibile è ' + c2([p.a, p.b]) + '.', { fatti: [], mostra: 0, disp: [p.a, p.b], accD: true }, {});
      P(1, 'I bisogni residui', 'Per ogni processo sottraiamo dal massimo ciò che possiede. A: (2,2) − (1,0) = (1,2). B: (2,1) − (1,1) = (1,0). C: (1,2) − (1,0) = (0,2).', { fatti: [], mostra: 1, disp: [p.a, p.b] }, { calc: 'A (1,2) · B (1,0) · C (0,2)' });
      const fatti = [];
      R.passi.forEach((g, k) => {
        const scarti = g.scartati.map((q) => { const bs = U.bisogno(q), manca = bs[0] > g.prima[0] && bs[1] > g.prima[1] ? 'mancano X e Y' : bs[0] > g.prima[0] ? 'manca X' : 'manca Y'; return q.n + ' ha bisogno di ' + c2(bs) + ': ' + manca + '.'; }).join(' ');
        if (g.chi) {
          const q = g.chi, bs = U.bisogno(q);
          fatti.push(q.n);
          P(2, 'Può completare ' + q.n, 'Il disponibile è ' + c2(g.prima) + '. ' + scarti + (scarti ? ' ' : '') + q.n + ' ha bisogno di ' + c2(bs) + ', che è coperto. ' + q.n + ' riceve ciò che gli manca, completa, e restituisce anche ciò che possedeva: ' + c2(g.prima) + ' + ' + c2(q.ha) + ' = ' + c2(g.dopo) + '.', { fatti: fatti.slice(), mostra: 1, acc: q.n, disp: g.dopo, accD: true, conf: q.n + ': ' + c2(bs) + ' ≤ ' + c2(g.prima) }, Object.assign({ calc: c2(g.prima) + ' + ' + c2(q.ha) + ' = ' + c2(g.dopo) }, k === 0 ? { chiedi: { d: q.n + ' ha completato. Perché il disponibile cresce proprio di ' + c2(q.ha) + '?', o: ['Perché tornano libere le istanze che ' + q.n + ' possedeva', 'Perché tornano libere le istanze del suo massimo', 'Perché si aggiunge il suo bisogno residuo'], g: 0, no: 'Ciò che ' + q.n + ' ha ricevuto in prestito e ciò che restituisce di quel prestito si compensano. Resta, in più, ciò che possedeva.' } } : {}));
        } else {
          const fermi = SL.unita573.PROC.filter((q) => fatti.indexOf(q.n) < 0).map((q) => q.n);
          P(2, 'Nessuno può completare', 'Il disponibile è ' + c2(g.prima) + '. ' + scarti + ' Nessun bisogno rimasto è coperto, e la sequenza si ferma qui.', { fatti: fatti.slice(), mostra: 1, fermi, disp: g.prima, conf: 'nessun bisogno ≤ ' + c2(g.prima), confNo: true }, { calc: 'nessun bisogno coperto da ' + c2(g.prima) });
        }
      });
      const fermi = U.PROC.filter((q) => fatti.indexOf(q.n) < 0).map((q) => q.n);
      P(3, 'Il verdetto', R.sicuro ? 'Tutti e tre i processi sono stati collocati: ' + R.seq.join(', ') + '. Lo stato è sicuro. Anche se ciascuno chiedesse il proprio massimo, in quest’ordine tutti potrebbero terminare.' : 'Restano fuori ' + fermi.join(', ') + '. Lo stato è insicuro: manca una sequenza che garantisca il completamento di tutti. Il deadlock diventerebbe reale soltanto se i processi rimasti chiedessero davvero ciò che il disponibile lascia scoperto.', { fatti: fatti.slice(), mostra: 1, fermi, disp: R.disp }, { esito: [R.sicuro ? 'sicuro · ' + R.seq.join(' → ') : 'insicuro', R.sicuro ? 'si' : 'no'] });
      return { passi, esito: R.sicuro ? 'si' : 'no' };
    }
  },
  bilancio: {
    regola: [
      'Bisogno residuo = massimo dichiarato − posseduto, componente per componente.',
      'Uno stato è sicuro se esiste una sequenza in cui ogni processo trova il proprio bisogno coperto dal disponibile, che cresce a ogni completamento di ciò che il processo possedeva.'
    ],
    errori: [
      ['Confrontare soltanto il totale delle istanze.', 'Il confronto va fatto risorsa per risorsa: tre X in più lasciano scoperta una Y che manca.'],
      ['Leggere «insicuro» come «in deadlock».', 'Insicuro significa privo di garanzia. Il blocco avverrebbe soltanto con certe richieste future.'],
      ['Aggiungere al disponibile il massimo, o il bisogno, di chi termina.', 'Si aggiunge ciò che il processo possedeva prima del prestito.']
    ],
    saFare: ['Calcolare il bisogno residuo di un processo.', 'Aggiornare il disponibile dopo un completamento.', 'Cercare una sequenza e pronuncio il verdetto.'],
    esercizi: [
      { d: 'Un processo possiede (2,1) e ha dichiarato un massimo di (3,4). Quante istanze di Y può ancora chiedere?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Il bisogno residuo è (3,4) − (2,1) = (1,3): ancora 3 istanze di Y.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro è il massimo. Una Y la possiede già.' },
          { se: ['1', 'uno'], msg: 'Uno è il bisogno residuo di X. La domanda riguarda Y, la seconda componente.' },
          { se: ['5', 'cinque'], msg: 'Il bisogno è una differenza: massimo meno posseduto.' }
        ],
        altro: 'Il numero è diverso. Si sottragga dal massimo di Y le Y già possedute.',
        indizi: ['Guarda la seconda componente delle due coppie.', 'Massimo di Y: 4. Possedute: 1.', '4 − 1 = 3.'],
        svolgimento: ['Massimo: (3,4).', 'Posseduto: (2,1).', 'Bisogno residuo: (1,3).'] },
      { d: 'Il disponibile è (1,1). Un processo che possiede (2,1), con bisogno residuo (1,0), riceve ciò che gli manca, completa e restituisce tutto. Quante X sono disponibili dopo?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '(1,1) + (2,1) = (3,2): le X disponibili sono 3.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due sono le X che il processo possedeva. Vanno aggiunte a quella già disponibile.' },
          { se: ['4', 'quattro'], msg: 'La X ricevuta in prestito era già contata nel disponibile: prestito e restituzione si compensano.' },
          { se: ['1', 'uno'], msg: 'Terminando, il processo libera le istanze che possedeva.' }
        ],
        altro: 'Il numero è diverso. Somma al disponibile ciò che il processo possedeva.',
        indizi: ['Disponibile prima: 1 X.', 'Il processo possedeva 2 X.', '1 + 2 = 3.'],
        svolgimento: ['Disponibile: (1,1).', 'Posseduto dal processo: (2,1).', 'Dopo: (3,2).'] },
      { d: 'La prova di sicurezza dichiara insicuro uno stato. Che cosa significa?', guida: 'Si scelga la risposta.', o: [
        { t: 'Manca la garanzia che tutti possano completare', ok: true, fb: 'Con certe richieste future i processi potrebbero bloccarsi, e con altre no.' },
        { t: 'Il sistema è già in deadlock', fb: 'Un deadlock in corso si accerta dalle richieste effettive. Qui si ragiona sui massimi dichiarati.' },
        { t: 'Un processo ha superato il massimo dichiarato', fb: 'La prova confronta bisogni e disponibile. I massimi sono rispettati.' }] }
    ],
    sfida: ['cslez5_7_05_deadlock', 'Stati sicuri, rilevamento e recupero']
  }
});
