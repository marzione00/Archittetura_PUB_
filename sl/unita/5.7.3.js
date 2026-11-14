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
  obiettivo: 'Obiettivo: calcolare il bisogno residuo di un processo, ricercare una sequenza di completamento, e distinguere uno stato sicuro da uno stato privo di garanzie.',
  concetti: [['bilancio', 'Massimo dichiarato meno posseduto'], ['riproduci', 'Una sequenza in cui tutti terminano'], ['scudo', 'Sicuro, oppure senza garanzia']],
  filigrana: ['bilancio', 'scudo', 'tabella'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 5.7.1', t: 'La riduzione del grafo', d: 'Si porta a termine un processo in grado di terminare, si liberano le sue risorse, e si ripete il procedimento.' },
      { sim: 'tabella', da: 'Dall’unità 5.7.1', t: 'Le istanze', d: 'Una risorsa può esistere in più esemplari equivalenti.' },
      { sim: 'scudo', da: 'Dall’unità 5.7.2', t: 'La prevenzione', d: 'Una regola fissa, valida sempre, che rende impossibile una delle quattro condizioni.' }
    ],
    domanda: { d: 'Prima di proseguire: sono libere 2 istanze di una risorsa. Un processo ne possiede 1, e per terminare gliene occorrono altre 2. Può terminare?', o: [
      { t: 'Sì, riceve le 2 libere, termina, e ne restituisce 3', ok: true, fb: 'Il bisogno, 2, è coperto dalle istanze libere. Alla fine tornano libere anche quelle che possedeva.' },
      { t: 'No, gliene occorrono 3', fb: 'Tre è il totale. Ne possiede già una, e gliene mancano 2.' },
      { t: 'Sì, e alla fine ne restano libere 2', fb: 'Al termine restituisce anche l’istanza che possedeva dall’inizio: complessivamente 3.' }
    ] }
  },
  idea: {
    titolo: 'La concessione condizionata a una sequenza di completamento',
    termini: ['bisogno residuo', 'stato sicuro', 'algoritmo del banchiere'],
    testo: [
      'La prevenzione impone una regola rigida a tutti i processi, in ogni caso. Esiste una strategia più flessibile, che decide caso per caso: prima di concedere una risorsa, il sistema verifica se dopo la concessione resterà comunque un modo per portare a termine tutti i processi. In caso affermativo concede, altrimenti impone l’attesa al richiedente anche se la risorsa è libera. Tale strategia prende il nome di evitamento.',
      'Tale verifica richiede un’informazione ulteriore. Ogni processo dichiara in anticipo il massimo di ciascuna risorsa che potrà richiedere. Dal massimo e dalle risorse possedute si ricava il [[bisogno residuo]]: massimo meno posseduto. Si tratta della richiesta più ampia che il processo potrà ancora presentare. Con due tipi di risorsa, X e Y, ogni quantità è una coppia. Un processo che possiede (1,1) e ha dichiarato (2,1) ha un bisogno residuo di (1,0): ancora una X, e nessuna Y.',
      'Il controllo riprende la riduzione del grafo, applicata al caso peggiore. Si individua un processo il cui bisogno residuo sia coperto dalle istanze disponibili, componente per componente: un’eccedenza di X lascia scoperta una mancanza di Y. Si suppone che tale processo riceva l’intero bisogno, termini e restituisca le risorse possedute. Il disponibile cresce, e il procedimento si ripete. Se tutti i processi possono essere ordinati in questo modo, lo stato è uno [[stato sicuro]], e l’ordinamento ottenuto è una sequenza di completamento.',
      { fig: 'scena', w: 720, h: 166, titolo: 'Una X e una Y libere: può avere inizio B', nota: 'Il bisogno di B, (1,0), è coperto da (1,1). Quando B termina restituisce (1,1), e il disponibile sale a (2,2).', els: SL.unita573.quadro('g', { fatti: [], mostra: 1, acc: 'B', disp: [1, 1], conf: 'B: (1,0) ≤ (1,1)' }, { x: 10, y: 4, w: 700, cw: 84 }) },
      'Il procedimento prende il nome di [[algoritmo del banchiere]]. Il nome deriva dal modello di una banca che ha garantito a ogni cliente un credito massimo, e che dispone di una somma inferiore al totale dei crediti garantiti. La banca concede un prestito soltanto se la somma residua consente di soddisfare per intero almeno un cliente, la cui restituzione consentirà di soddisfare il successivo.',
      'Resta da precisare il significato dell’esito opposto. Uno stato privo di una sequenza di completamento è insicuro, e insicuro significa «privo di garanzia». Il deadlock non si è ancora verificato, e potrebbe non verificarsi, se i processi richiederanno meno del massimo dichiarato. Il sistema ha tuttavia perduto la certezza di poterlo evitare. L’accertamento di un deadlock già in corso richiede le richieste effettive, esaminate nell’unità successiva.'
    ]
  },
  esperimento: {
    faremo: [
      'Tre processi, A, B e C, possiedono alcune istanze di X e di Y e hanno dichiarato i propri massimi. I controlli fissano il numero delle X e delle Y libere in questo momento.',
      'L’esperimento calcola i bisogni residui, e ricerca una sequenza di completamento. A ogni iterazione esamina i processi in ordine alfabetico, e confronta il bisogno con il disponibile.'
    ],
    vedrai: [
      ['tabella', 'La tabella dei processi', 'A sinistra: per ogni processo le istanze possedute, il massimo dichiarato, il bisogno residuo e l’esito. Ogni coppia è (X,Y).'],
      ['bilancio', 'Il disponibile e la sequenza', 'A destra: le istanze libere, la sequenza costruita finora, e il confronto in corso.']
    ]
  },
  lab: {
    titolo: 'La prova di sicurezza',
    scena: { w: 860, h: 168 },
    atti: ['Lo stato', 'I bisogni', 'La sequenza', 'L’esito'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Istanze di X libere', opzioni: [[0, '0'], [1, '1']], valore: 1 },
      { id: 'b', tipo: 'scelta', eti: 'Istanze di Y libere', opzioni: [[0, '0'], [1, '1'], [2, '2']], valore: 1 }
    ],
    nota: 'Il numero dei passi dipende dal disponibile. Possessi e massimi dei tre processi restano fissi.',
    previsione: {
      domanda: (p) => 'A possiede (1,0) con massimo (2,2). B possiede (1,1) con massimo (2,1). C possiede (1,0) con massimo (1,2). Sono libere ' + p.a + ' X e ' + p.b + ' Y. Esiste una sequenza in cui tutti e tre possono completare?',
      opzioni: () => [['si', 'Sì, lo stato è sicuro'], ['no', 'No, lo stato è insicuro']]
    },
    confronto: (pred, esito, p) => { const R = SL.unita573.prova(p.a, p.b); return 'La previsione indicava «' + (pred === 'si' ? 'sicuro' : 'insicuro') + '». Lo stato è ' + (esito === 'si' ? 'sicuro' : 'insicuro') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'si' ? 'La sequenza ' + R.seq.join(', ') + ' consente a tutti di completare: ogni processo che termina restituisce istanze sufficienti per il successivo.' : R.seq.length ? 'Dopo ' + R.seq.join(', ') + ' il disponibile è ' + SL.unita573.c2(R.disp) + ', e nessuno dei bisogni residui è coperto.' : 'Con ' + SL.unita573.c2([p.a, p.b]) + ' nessun bisogno è coperto, e la sequenza non può avere inizio.'); },
    costruisci(p) {
      const U = SL.unita573, R = U.prova(p.a, p.b), passi = [], c2 = U.c2;
      const P = (atto, titolo, testo, s, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Disponibile', c2(s.disp), 'a'], ['Sequenza', s.fatti.length ? s.fatti.join(' → ') : '·', 'c'], ['Da collocare', String(3 - s.fatti.length)]], els: U.quadro('b', s, { x: 20, y: 4, w: 820, cw: 100 }) }, extra));
      P(0, 'Lo stato', 'Tre processi possiedono alcune istanze e hanno dichiarato un massimo. Ogni coppia indica (X,Y). In questo momento sono libere ' + p.a + ' X e ' + p.b + ' Y: il disponibile è ' + c2([p.a, p.b]) + '.', { fatti: [], mostra: 0, disp: [p.a, p.b], accD: true }, {});
      P(1, 'I bisogni residui', 'Per ogni processo si sottraggono dal massimo le istanze possedute: per A (2,2) − (1,0) = (1,2), per B (2,1) − (1,1) = (1,0), per C (1,2) − (1,0) = (0,2).', { fatti: [], mostra: 1, disp: [p.a, p.b] }, { calc: 'A (1,2) · B (1,0) · C (0,2)' });
      const fatti = [];
      R.passi.forEach((g, k) => {
        const scarti = g.scartati.map((q) => { const bs = U.bisogno(q), manca = bs[0] > g.prima[0] && bs[1] > g.prima[1] ? 'mancano X e Y' : bs[0] > g.prima[0] ? 'manca X' : 'manca Y'; return q.n + ' richiede ' + c2(bs) + ' e ' + manca; }).join(', ');
        if (g.chi) {
          const q = g.chi, bs = U.bisogno(q);
          fatti.push(q.n);
          P(2, 'Può completare ' + q.n, 'Con il disponibile ' + c2(g.prima) + ', ' + (scarti ? scarti + ', mentre ' : '') + q.n + ' richiede ' + c2(bs) + ', che è coperto. ' + q.n + ' riceve le istanze mancanti, completa, e restituisce anche quelle possedute: ' + c2(g.prima) + ' + ' + c2(q.ha) + ' = ' + c2(g.dopo) + '.', { fatti: fatti.slice(), mostra: 1, acc: q.n, disp: g.dopo, accD: true, conf: q.n + ': ' + c2(bs) + ' ≤ ' + c2(g.prima) }, Object.assign({ calc: c2(g.prima) + ' + ' + c2(q.ha) + ' = ' + c2(g.dopo) }, k === 0 ? { chiedi: { d: q.n + ' ha completato. Per quale ragione il disponibile cresce di ' + c2(q.ha) + '?', o: ['Tornano libere le istanze che ' + q.n + ' possedeva', 'Tornano libere le istanze del suo massimo', 'Si aggiunge il suo bisogno residuo'], g: 0, no: 'Ciò che ' + q.n + ' ha ricevuto in prestito e ciò che restituisce di quel prestito si compensano. Restano, in aggiunta, le istanze possedute.' } } : {}));
        } else {
          const fermi = SL.unita573.PROC.filter((q) => fatti.indexOf(q.n) < 0).map((q) => q.n);
          P(2, 'Nessun processo può completare', 'Con il disponibile ' + c2(g.prima) + ', ' + scarti + '. Nessun bisogno residuo è coperto, e la sequenza si arresta.', { fatti: fatti.slice(), mostra: 1, fermi, disp: g.prima, conf: 'nessun bisogno ≤ ' + c2(g.prima), confNo: true }, { calc: 'nessun bisogno coperto da ' + c2(g.prima) });
        }
      });
      const fermi = U.PROC.filter((q) => fatti.indexOf(q.n) < 0).map((q) => q.n);
      P(3, 'L’esito', R.sicuro ? 'Tutti e tre i processi sono stati collocati: ' + R.seq.join(', ') + '. Lo stato è sicuro. Anche se ciascuno richiedesse il proprio massimo, in quest’ordine tutti potrebbero terminare.' : 'Restano esclusi ' + fermi.join(', ') + '. Lo stato è insicuro: manca una sequenza che garantisca il completamento di tutti. Il deadlock si verificherebbe soltanto se i processi residui richiedessero effettivamente le istanze che il disponibile lascia scoperte.', { fatti: fatti.slice(), mostra: 1, fermi, disp: R.disp }, { esito: [R.sicuro ? 'sicuro · ' + R.seq.join(' → ') : 'insicuro', R.sicuro ? 'si' : 'no'] });
      return { passi, esito: R.sicuro ? 'si' : 'no' };
    }
  },
  bilancio: {
    regola: [
      'Bisogno residuo = massimo dichiarato − posseduto, componente per componente.',
      'Uno stato è sicuro se esiste una sequenza in cui ogni processo trova il proprio bisogno coperto dal disponibile, che cresce a ogni completamento delle istanze possedute dal processo.'
    ],
    errori: [
      ['Confrontare soltanto il totale delle istanze.', 'Il confronto va eseguito risorsa per risorsa: tre X in eccedenza lasciano scoperta una Y mancante.'],
      ['Interpretare «insicuro» come «in deadlock».', 'Insicuro significa privo di garanzia. Il blocco si verificherebbe soltanto con alcune richieste future.'],
      ['Aggiungere al disponibile il massimo, o il bisogno, del processo che termina.', 'Si aggiungono le istanze che il processo possedeva prima del prestito.']
    ],
    saFare: ['Calcolare il bisogno residuo di un processo.', 'Aggiornare il disponibile dopo un completamento.', 'Ricercare una sequenza e stabilire l’esito.'],
    esercizi: [
      { d: 'Un processo possiede (2,1) e ha dichiarato un massimo di (3,4). Quante istanze di Y può ancora richiedere?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Il bisogno residuo è (3,4) − (2,1) = (1,3): ancora 3 istanze di Y.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro è il massimo. Il processo possiede già una Y.' },
          { se: ['1', 'uno'], msg: 'Uno è il bisogno residuo di X. La domanda riguarda Y, la seconda componente.' },
          { se: ['5', 'cinque'], msg: 'Il bisogno è una differenza: massimo meno posseduto.' }
        ],
        altro: 'Il numero è diverso. Si sottraggano dal massimo di Y le Y già possedute.',
        indizi: ['Va considerata la seconda componente delle due coppie.', 'Massimo di Y: 4. Possedute: 1.', '4 − 1 = 3.'],
        svolgimento: ['Massimo: (3,4).', 'Posseduto: (2,1).', 'Bisogno residuo: (1,3).'] },
      { d: 'Il disponibile è (1,1). Un processo che possiede (2,1), con bisogno residuo (1,0), riceve le istanze mancanti, completa e restituisce tutte le istanze. Quante X sono disponibili al termine?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '(1,1) + (2,1) = (3,2): le X disponibili sono 3.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due sono le X che il processo possedeva. Vanno aggiunte a quella già disponibile.' },
          { se: ['4', 'quattro'], msg: 'La X ricevuta in prestito era già contata nel disponibile: prestito e restituzione si compensano.' },
          { se: ['1', 'uno'], msg: 'Al termine, il processo libera le istanze che possedeva.' }
        ],
        altro: 'Il numero è diverso. Si sommino al disponibile le istanze che il processo possedeva.',
        indizi: ['Disponibile prima: 1 X.', 'Il processo possedeva 2 X.', '1 + 2 = 3.'],
        svolgimento: ['Disponibile: (1,1).', 'Posseduto dal processo: (2,1).', 'Dopo: (3,2).'] },
      { d: 'La prova di sicurezza dichiara insicuro uno stato. Che cosa significa?', guida: 'Si scelga la risposta.', o: [
        { t: 'Manca la garanzia che tutti possano completare', ok: true, fb: 'Con alcune richieste future i processi potrebbero bloccarsi, con altre proseguirebbero.' },
        { t: 'Il sistema è già in deadlock', fb: 'Un deadlock in corso si accerta dalle richieste effettive. In questo caso l’analisi riguarda i massimi dichiarati.' },
        { t: 'Un processo ha superato il massimo dichiarato', fb: 'La prova confronta bisogni e disponibile. I massimi sono rispettati.' }] }
    ],
    sfida: ['cslez5_7_05_deadlock', 'Stati sicuri, rilevamento e recupero']
  }
});
