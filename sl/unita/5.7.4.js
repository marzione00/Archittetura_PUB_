'use strict';
SL.unita574 = (() => {
  // A: X += 5, poi Y += 5. B: Y += 7, poi X += 7. Valori iniziali X 10, Y 20.
  const X0 = 10, Y0 = 20, DA = 5, DB = 7;
  const ripristino = (p) => (p.vittima === 'A' ? X0 : Y0);
  const traccia = (p) => {
    const vA = p.vittima === 'A', V = p.vittima, S_ = vA ? 'B' : 'A', riprova = p.dopo === 'riprova', T = [];
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, X: X0 + DA, Y: Y0 + DB, lx: 'A', ly: 'B', A: 'ha X · aspetta Y', B: 'ha Y · aspetta X', logA: 'X era ' + X0, logB: 'Y era ' + Y0, att: 2, acc: '' }, s, extra ? { extra } : {}));
    S(0, 'Due transazioni al lavoro', 'La transazione A ha acquisito il lock X e ha aggiunto 5 al dato X, che è passato da 10 a 15. La transazione B ha acquisito il lock Y e ha aggiunto 7 al dato Y, da 20 a 27. Ciascuna ha annotato nel proprio log il valore precedente.', { A: 'ha X · al lavoro', B: 'ha Y · al lavoro', att: 0 }, { calc: 'X = 15 · Y = 27' });
    S(0, 'Le richieste incrociate', 'Per finire, A deve aggiungere 5 anche a Y, e chiede il lock Y. B deve aggiungere 7 anche a X, e chiede il lock X. Ciascun lock è in mano all’altra transazione: entrambe si bloccano.', { acc: 'AB' }, { calc: 'A aspetta B · B aspetta A' });
    S(1, 'Il gestore rileva il ciclo', 'Il gestore dei lock esamina periodicamente chi aspetta chi. Trova che A aspetta B e che B aspetta A: un ciclo. Per scioglierlo sceglie una vittima da annullare, e la scelta cade su ' + V + '.', { acc: V }, { calc: 'vittima: ' + V, chiedi: { d: 'Il gestore vuole liberare il lock ' + (vA ? 'X' : 'Y') + ', che è di ' + V + '. Può toglierglielo e basta?', o: ['No: il dato protetto contiene una modifica a metà', 'Sì: il lock è l’unico ostacolo'], g: 0, no: 'La transazione ' + V + ' ha già cambiato il dato, e ha lasciato il lavoro incompleto. Prima di liberare il lock quella modifica va annullata.' } });
    S(2, 'Rollback di ' + V, 'Il gestore annulla il lavoro di ' + V + ' leggendo il suo log. ' + (vA ? 'Il log dice che X valeva 10: X torna da 15 a 10.' : 'Il log dice che Y valeva 20: Y torna da 27 a 20.'), vA ? { X: X0, A: 'annullata', logA: 'usato', acc: 'xA' } : { Y: Y0, B: 'annullata', logB: 'usato', acc: 'yB' }, { calc: vA ? 'X 15 → 10' : 'Y 27 → 20' });
    S(2, 'Rilascio dei lock di ' + V, 'La richiesta pendente di ' + V + ' viene ritirata, e il suo lock viene rilasciato. Il ciclo è sciolto. ' + S_ + ' riceve il lock che aspettava.', vA ? { X: X0, lx: 'B', A: 'annullata', B: 'ha X e Y', logA: 'vuoto', att: 0, acc: 'xB' } : { Y: Y0, ly: 'A', A: 'ha X e Y', B: 'annullata', logB: 'vuoto', att: 0, acc: 'yA' }, { calc: 'attese: nessuna' });
    const x1 = vA ? X0 + DB : X0 + DA, y1 = vA ? Y0 + DB : Y0 + DA;
    S(3, S_ + ' completa', vA ? 'B aggiunge 7 a X, che passa da 10 a 17, conferma il suo lavoro e rilascia i due lock.' : 'A aggiunge 5 a Y, che passa da 20 a 25, conferma il suo lavoro e rilascia i due lock.', Object.assign({ X: x1, Y: y1, lx: '', ly: '', att: 0, acc: vA ? 'xB' : 'yA' }, vA ? { A: 'annullata', B: 'ha completato', logA: 'vuoto', logB: 'chiuso' } : { A: 'ha completato', B: 'annullata', logA: 'chiuso', logB: 'vuoto' }), { calc: 'X = ' + x1 + ' · Y = ' + y1 });
    const xf = riprova ? X0 + DA + DB : x1, yf = riprova ? Y0 + DA + DB : y1;
    if (riprova) S(3, V + ' riparte da capo', 'La transazione ' + V + ' viene ritentata dall’inizio. Trova i lock liberi, ' + (vA ? 'aggiunge 5 a X e a Y' : 'aggiunge 7 a Y e a X') + ', conferma e rilascia. Il risultato è lo stesso che si avrebbe eseguendo le due transazioni una dopo l’altra.', Object.assign({ X: xf, Y: yf, lx: '', ly: '', att: 0, acc: 'xy' + V }, vA ? { A: 'ha completato', B: 'ha completato', logA: 'chiuso', logB: 'chiuso' } : { A: 'ha completato', B: 'ha completato', logA: 'chiuso', logB: 'chiuso' }), { calc: 'X = ' + xf + ' · Y = ' + yf });
    else S(3, V + ' viene abbandonata', 'La transazione ' + V + ' viene lasciata cadere. I suoi aggiornamenti sono spariti, e i dati contengono soltanto il lavoro di ' + S_ + '.', Object.assign({ X: xf, Y: yf, lx: '', ly: '', att: 0, acc: V }, vA ? { A: 'abbandonata', B: 'ha completato', logA: 'vuoto', logB: 'chiuso' } : { A: 'ha completato', B: 'abbandonata', logA: 'chiuso', logB: 'vuoto' }), { calc: 'X = ' + xf + ' · Y = ' + yf });
    const u = T[T.length - 1];
    S(4, 'L’esito', 'Il rollback ha riportato ' + (vA ? 'X a 10' : 'Y a 20') + ', il valore annotato nel log, prima di liberare il lock. ' + S_ + ' ha completato per prima. Alla fine X vale ' + xf + ' e Y vale ' + yf + '.', { X: xf, Y: yf, lx: '', ly: '', A: u.A, B: u.B, logA: u.logA, logB: u.logB, att: 0 }, { esito: [(vA ? 'X' : 'Y') + ' ripristinato a ' + ripristino(p), ''] });
    return T;
  };
  const quadro = (pre, s, o) => {
    const el = SL.el, w2 = (o.w - 10) / 2, w3 = (o.w - 20) / 3, a = (c) => s.acc.indexOf(c) >= 0, st = (c, rosso) => (rosso ? 'err' : a(c) ? 'att' : 'on');
    return [
      el.box(pre + 'x', o.x, o.y, w2, 54, 'dato X · lock ' + (s.lx ? 'di ' + s.lx : 'libero'), String(s.X), st('x', false), { cls: 'stretta' }),
      el.box(pre + 'y', o.x + w2 + 10, o.y, w2, 54, 'dato Y · lock ' + (s.ly ? 'di ' + s.ly : 'libero'), String(s.Y), st('y', false), { cls: 'stretta' }),
      el.box(pre + 'A', o.x, o.y + 64, w2, 54, 'transazione A', s.A, st('A', s.att === 2 && !a('A')), { cls: 'stretta' }),
      el.box(pre + 'B', o.x + w2 + 10, o.y + 64, w2, 54, 'transazione B', s.B, st('B', s.att === 2 && !a('B')), { cls: 'stretta' }),
      el.box(pre + 'la', o.x, o.y + 128, w3, 54, 'log di A', s.logA, s.logA === 'usato' ? 'att' : s.logA.indexOf('era') >= 0 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'lb', o.x + w3 + 10, o.y + 128, w3, 54, 'log di B', s.logB, s.logB === 'usato' ? 'att' : s.logB.indexOf('era') >= 0 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'w', o.x + 2 * (w3 + 10), o.y + 128, w3, 54, 'attese', s.att === 2 ? 'ciclo fra A e B' : 'nessuna', s.att === 2 ? 'err' : '', { cls: 'stretta' })
    ];
  };
  return { ripristino, traccia, quadro };
})();
SL.registra('5.7.4', {
  titolo: 'Rilevamento e recupero',
  obiettivo: 'Obiettivo: descrivere come un sistema scopre un deadlock già avvenuto, e come lo scioglie annullando una transazione senza lasciare dati a metà.',
  concetti: [['lente', 'Cercare un ciclo fra le attese'], ['journal', 'Un log per tornare indietro'], ['riproduci', 'Annullare, liberare, ritentare']],
  filigrana: ['lente', 'journal', 'stallo'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 5.7.1', t: 'Il ciclo', d: 'Con una sola istanza per risorsa, un ciclo di attese è un deadlock.' },
      { sim: 'scudo', da: 'Dall’unità 5.7.2', t: 'Senza prelazione', d: 'Un lock viene rilasciato soltanto dal suo possessore.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.5.2', t: 'La sezione critica', d: 'Finché un thread è a metà di una modifica, i dati protetti possono essere incoerenti.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread possiede un lock e ha modificato metà dei dati protetti. Il sistema gli toglie il lock e lo dà a un altro. Che cosa trova il secondo thread?', o: [
      { t: 'Dati a metà di una modifica, forse incoerenti', ok: true, fb: 'Il lock serviva proprio a nascondere quello stato intermedio.' },
      { t: 'I dati di prima della modifica', fb: 'Nessuno ha annullato la parte di modifica già fatta.' },
      { t: 'I dati a modifica completata', fb: 'Il primo thread è stato interrotto prima di finire.' }
    ] }
  },
  idea: {
    titolo: 'Lasciare che accada, e poi rimediare',
    termini: ['rilevamento del deadlock', 'transazione sui dati', 'rollback'],
    testo: [
      'Prevenzione ed evitamento hanno un costo che si paga sempre, anche quando nessun deadlock si sarebbe formato. Una terza strategia rovescia l’impostazione: si lasciano i thread liberi di chiedere ciò che vogliono, e se un deadlock si forma lo si scopre e lo si scioglie. Conviene quando i deadlock sono rari e rimediare costa poco.',
      'La prima metà è il [[rilevamento del deadlock]]. Il sistema tiene nota di chi aspetta chi, e ogni tanto cerca un ciclo fra queste attese, con lo stesso ragionamento dell’unità 5.7.1 applicato alle richieste effettivamente in corso. Trovato un ciclo, i thread coinvolti sono bloccati per sempre, e bisogna intervenire dall’esterno.',
      'La seconda metà è il recupero, ed è la più delicata. Per rompere il ciclo occorre togliere una risorsa a qualcuno. Un lock però protegge dati che il suo possessore può avere lasciato a metà di una modifica: toglierlo e basta esporrebbe agli altri uno stato incoerente. Occorre prima riportare i dati a uno stato pulito.',
      'I sistemi che gestiscono dati importanti si preparano a questa evenienza. Raggruppano le modifiche in una [[transazione sui dati|transazione]], un gruppo di operazioni che vale come una sola: o avvengono tutte, o nessuna. Il nome coincide con quello delle transazioni sul bus dell’unità 4.4.1, e il significato è diverso. Prima di cambiare un dato, la transazione annota in un log il valore che c’era. Se va annullata, il sistema ripercorre il log e rimette ogni valore al suo posto. Questa operazione si chiama [[rollback]].',
      { fig: 'scena', w: 720, h: 190, titolo: 'Due transazioni in ciclo, con i loro log', nota: 'Ogni log conserva il valore precedente del dato modificato: è ciò che serve per annullare la transazione.', els: SL.unita574.quadro('g', SL.unita574.traccia({ vittima: 'A', dopo: 'riprova' })[1], { x: 10, y: 4, w: 700 }) },
      'Il recupero procede dunque in quattro mosse. Si sceglie una vittima fra le transazioni del ciclo. Se ne esegue il rollback. Si ritira la sua richiesta e si liberano i suoi lock. Le altre transazioni proseguono, e la vittima può essere ritentata da capo. La scelta della vittima guarda al costo: di solito si annulla chi ha fatto meno lavoro. Resta un’attenzione da avere. Se la vittima fosse sempre la stessa, quella transazione resterebbe incompiuta per sempre, in una starvation.'
    ]
  },
  esperimento: {
    faremo: [
      'Due transazioni, A e B, si sono bloccate a vicenda sui lock X e Y, dopo avere già modificato un dato ciascuna. Sceglierai quale annullare, e se dopo ritentarla.',
      'Seguiremo i valori dei due dati, i log e il ciclo delle attese. Fai attenzione all’ordine: prima il ripristino del dato, poi il rilascio del lock.'
    ],
    vedrai: [
      ['memory', 'I dati e i loro lock', 'In alto: il valore di X e di Y, e chi possiede il lock di ciascuno.'],
      ['thread', 'Le transazioni', 'Al centro: lo stato di A e di B.'],
      ['journal', 'I log e le attese', 'In basso: che cosa ha annotato ciascuna transazione, e se le attese formano un ciclo.']
    ]
  },
  lab: {
    titolo: 'Sciogliere un ciclo con un rollback',
    scena: { w: 860, h: 194 },
    atti: ['Lo stallo', 'Il rilevamento', 'Il rollback', 'La ripresa', 'L’esito'],
    controlli: [
      { id: 'vittima', tipo: 'scelta', eti: 'Transazione da annullare', opzioni: [['A', 'A'], ['B', 'B']], valore: 'A' },
      { id: 'dopo', tipo: 'scelta', eti: 'Dopo il rollback la vittima', opzioni: [['riprova', 'viene ritentata da capo'], ['lascia', 'viene abbandonata']], valore: 'riprova' }
    ],
    nota: 'I passi sono sempre otto. A aggiunge 5 a X e poi a Y. B aggiunge 7 a Y e poi a X.',
    previsione: {
      domanda: (p) => 'X valeva 10, e A lo ha portato a 15. Y valeva 20, e B lo ha portato a 27. Poi A e B si sono bloccate a vicenda. Il gestore annulla ' + p.vittima + ' con un rollback. Quanto vale ' + (p.vittima === 'A' ? 'X' : 'Y') + ' subito dopo il rollback?',
      opzioni: (p) => (p.vittima === 'A' ? [10, 15, 0] : [20, 27, 0]).map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Dopo il rollback ' + (p.vittima === 'A' ? 'X' : 'Y') + ' vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 0 ? 'Il rollback rimette il valore che il dato aveva prima della transazione, annotato nel log. Azzerare sarebbe un’altra modifica.' : 'Lasciare il valore modificato esporrebbe all’altra transazione un lavoro mai concluso. Il rollback lo riporta al valore annotato nel log.'),
    costruisci(p) {
      const U = SL.unita574, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Dato X', String(s.X), 'a'], ['Dato Y', String(s.Y), 'c'], ['Attese', s.att === 2 ? 'in ciclo' : 'nessuna']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.ripristino(p) };
    }
  },
  bilancio: {
    regola: [
      'Rilevamento: si annotano le attese in corso e si cerca periodicamente un ciclo.',
      'Recupero: si sceglie una vittima, se ne annullano le modifiche con il log, si ritira la sua richiesta e si liberano i suoi lock. Poi la si può ritentare.'
    ],
    errori: [
      ['Liberare il lock prima di ripristinare i dati.', 'Gli altri vedrebbero una modifica lasciata a metà.'],
      ['Scegliere sempre la stessa vittima.', 'Quella transazione verrebbe annullata a ogni tentativo: una starvation.'],
      ['Pensare che il rollback azzeri i dati.', 'Il rollback rimette i valori precedenti, quelli annotati nel log.']
    ],
    saFare: ['Riconoscere un ciclo fra le attese in corso.', 'Ricostruire i dati dopo un rollback usando il log.', 'Seguire la ripresa delle transazioni rimaste.'],
    esercizi: [
      { d: 'Perché il gestore, per sciogliere un deadlock, non si limita a togliere il lock a una delle due transazioni?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché i dati protetti da quel lock contengono una modifica incompleta', ok: true, fb: 'Prima vanno ripristinati i valori precedenti, e poi il lock può passare ad altri.' },
        { t: 'Perché un lock, una volta acquisito, è indistruttibile', fb: 'Il gestore può liberarlo. Il problema è lo stato dei dati.' },
        { t: 'Perché l’altra transazione rifiuterebbe il lock', fb: 'L’altra transazione lo sta aspettando.' }] },
      { d: 'Una transazione ha modificato tre dati: P da 4 a 9, Q da 7 a 2, R da 1 a 6. Viene scelta come vittima. Quanto vale Q dopo il rollback?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: 'Il rollback rimette in Q il valore annotato nel log: 7.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due è il valore scritto dalla transazione. Il rollback lo annulla.' },
          { se: ['0', 'zero'], msg: 'Il rollback rimette il valore precedente, annotato nel log.' },
          { se: ['4', 'quattro', '1', 'uno'], msg: 'Quello è il valore precedente di un altro dato. Guarda la riga di Q.' }
        ],
        altro: 'Il valore è diverso. Cerca il valore che Q aveva prima della transazione.',
        indizi: ['Il log annota il valore precedente di ogni dato modificato.', 'Per Q il log dice: era 7.', 'Dopo il rollback Q vale 7.'],
        svolgimento: ['Log: P era 4, Q era 7, R era 1.', 'Rollback: ogni dato torna al valore annotato.', 'Q = 7.'] },
      { d: 'Quattro transazioni sono in attesa: T1 aspetta T2, T2 aspetta T3, T3 aspetta T1, e T4 aspetta T1. Qual è il numero minimo di transazioni da annullare perché nessuna resti bloccata per sempre?', segnaposto: 'Un numero', giuste: ['1', 'una', 'uno'],
        ok: 'Il ciclo è uno solo, fra T1, T2 e T3. Annullando una di queste il ciclo si scioglie, e anche T4 finirà per avanzare.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Per rompere un ciclo basta togliere uno dei suoi anelli.' },
          { se: ['2', 'due'], msg: 'T4 è fuori dal ciclo: quando T1 avanza, avanza anche T4.' },
          { se: ['4', 'quattro'], msg: 'Il ciclo è uno solo, e basta romperlo in un punto.' }
        ],
        altro: 'Il numero è diverso. Conta i cicli, e chiediti quanti anelli vanno tolti a ciascuno.',
        indizi: ['Il ciclo è T1, T2, T3.', 'T4 aspetta una transazione del ciclo, senza farne parte.', 'Un ciclo si rompe annullando una sola transazione.'],
        svolgimento: ['Cicli: 1.', 'Vittime necessarie: 1.'] }
    ]
  }
});
