'use strict';
SL.unita574 = (() => {
  // A: X += 5, poi Y += 5. B: Y += 7, poi X += 7. Valori iniziali X 10, Y 20.
  const X0 = 10, Y0 = 20, DA = 5, DB = 7;
  const ripristino = (p) => (p.vittima === 'A' ? X0 : Y0);
  const traccia = (p) => {
    const vA = p.vittima === 'A', V = p.vittima, S_ = vA ? 'B' : 'A', riprova = p.dopo === 'riprova', T = [];
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, X: X0 + DA, Y: Y0 + DB, lx: 'A', ly: 'B', A: 'ha X · attende Y', B: 'ha Y · attende X', logA: 'X era ' + X0, logB: 'Y era ' + Y0, att: 2, acc: '' }, s, extra ? { extra } : {}));
    S(0, 'Due transazioni in esecuzione', 'La transazione A ha acquisito il lock X e ha aggiunto 5 al dato X, che è passato da 10 a 15. La transazione B ha acquisito il lock Y e ha aggiunto 7 al dato Y, da 20 a 27. Ciascuna ha annotato nel proprio log il valore precedente.', { A: 'ha X · attiva', B: 'ha Y · attiva', att: 0 }, { calc: 'X = 15 · Y = 27' });
    S(0, 'Le richieste reciproche', 'Per completare, A deve aggiungere 5 anche a Y, e richiede il lock Y. B deve aggiungere 7 anche a X, e richiede il lock X. Ciascun lock appartiene all’altra transazione: entrambe si bloccano.', { acc: 'AB' }, { calc: 'A attende B · B attende A' });
    S(1, 'Il gestore rileva il ciclo', 'Il gestore dei lock esamina periodicamente le attese fra le transazioni, e rileva che A attende B e che B attende A: un ciclo. Per risolverlo seleziona una vittima da annullare, in questo caso ' + V + '.', { acc: V }, { calc: 'vittima: ' + V, chiedi: { d: 'Il gestore deve liberare il lock ' + (vA ? 'X' : 'Y') + ', che appartiene a ' + V + '. È sufficiente sottrarglielo?', o: ['No, il dato protetto contiene una modifica incompleta', 'Sì, il lock è l’unico ostacolo'], g: 0, no: 'La transazione ' + V + ' ha già modificato il dato, e ha lasciato il lavoro incompleto. Prima di liberare il lock quella modifica va annullata.' } });
    S(2, 'Rollback di ' + V, 'Il gestore annulla il lavoro di ' + V + ' mediante la lettura del suo log. ' + (vA ? 'Il log indica che X valeva 10: X torna da 15 a 10.' : 'Il log indica che Y valeva 20: Y torna da 27 a 20.'), vA ? { X: X0, A: 'annullata', logA: 'applicato', acc: 'xA' } : { Y: Y0, B: 'annullata', logB: 'applicato', acc: 'yB' }, { calc: vA ? 'X 15 → 10' : 'Y 27 → 20' });
    S(2, 'Rilascio dei lock di ' + V, 'La richiesta pendente di ' + V + ' è ritirata, e il suo lock è rilasciato. Il ciclo è risolto. ' + S_ + ' riceve il lock che attendeva.', vA ? { X: X0, lx: 'B', A: 'annullata', B: 'ha X e Y', logA: 'vuoto', att: 0, acc: 'xB' } : { Y: Y0, ly: 'A', A: 'ha X e Y', B: 'annullata', logB: 'vuoto', att: 0, acc: 'yA' }, { calc: 'attese: nessuna' });
    const x1 = vA ? X0 + DB : X0 + DA, y1 = vA ? Y0 + DB : Y0 + DA;
    S(3, S_ + ' completa', vA ? 'B aggiunge 7 a X, che passa da 10 a 17, conferma il proprio lavoro e rilascia i due lock.' : 'A aggiunge 5 a Y, che passa da 20 a 25, conferma il proprio lavoro e rilascia i due lock.', Object.assign({ X: x1, Y: y1, lx: '', ly: '', att: 0, acc: vA ? 'xB' : 'yA' }, vA ? { A: 'annullata', B: 'ha completato', logA: 'vuoto', logB: 'chiuso' } : { A: 'ha completato', B: 'annullata', logA: 'chiuso', logB: 'vuoto' }), { calc: 'X = ' + x1 + ' · Y = ' + y1 });
    const xf = riprova ? X0 + DA + DB : x1, yf = riprova ? Y0 + DA + DB : y1;
    if (riprova) S(3, V + ' riprende dall’inizio', 'La transazione ' + V + ' è ritentata dall’inizio, trova i lock liberi, ' + (vA ? 'aggiunge 5 a X e a Y' : 'aggiunge 7 a Y e a X') + ', conferma e rilascia. Il risultato è il medesimo dell’esecuzione delle due transazioni in successione.', Object.assign({ X: xf, Y: yf, lx: '', ly: '', att: 0, acc: 'xy' + V }, vA ? { A: 'ha completato', B: 'ha completato', logA: 'chiuso', logB: 'chiuso' } : { A: 'ha completato', B: 'ha completato', logA: 'chiuso', logB: 'chiuso' }), { calc: 'X = ' + xf + ' · Y = ' + yf });
    else S(3, V + ' è abbandonata', 'La transazione ' + V + ' è abbandonata. I suoi aggiornamenti sono stati annullati, e i dati contengono soltanto il lavoro di ' + S_ + '.', Object.assign({ X: xf, Y: yf, lx: '', ly: '', att: 0, acc: V }, vA ? { A: 'abbandonata', B: 'ha completato', logA: 'vuoto', logB: 'chiuso' } : { A: 'ha completato', B: 'abbandonata', logA: 'chiuso', logB: 'vuoto' }), { calc: 'X = ' + xf + ' · Y = ' + yf });
    const u = T[T.length - 1];
    S(4, 'L’esito', 'Il rollback ha riportato ' + (vA ? 'X a 10' : 'Y a 20') + ', il valore annotato nel log, prima di liberare il lock. ' + S_ + ' ha completato per prima. Al termine X vale ' + xf + ' e Y vale ' + yf + '.', { X: xf, Y: yf, lx: '', ly: '', A: u.A, B: u.B, logA: u.logA, logB: u.logB, att: 0 }, { esito: [(vA ? 'X' : 'Y') + ' ripristinato a ' + ripristino(p), ''] });
    return T;
  };
  const quadro = (pre, s, o) => {
    const el = SL.el, w2 = (o.w - 10) / 2, w3 = (o.w - 20) / 3, a = (c) => s.acc.indexOf(c) >= 0, st = (c, rosso) => (rosso ? 'err' : a(c) ? 'att' : 'on');
    return [
      el.box(pre + 'x', o.x, o.y, w2, 54, 'dato X · lock ' + (s.lx ? 'di ' + s.lx : 'libero'), String(s.X), st('x', false), { cls: 'stretta' }),
      el.box(pre + 'y', o.x + w2 + 10, o.y, w2, 54, 'dato Y · lock ' + (s.ly ? 'di ' + s.ly : 'libero'), String(s.Y), st('y', false), { cls: 'stretta' }),
      el.box(pre + 'A', o.x, o.y + 64, w2, 54, 'transazione A', s.A, st('A', s.att === 2 && !a('A')), { cls: 'stretta' }),
      el.box(pre + 'B', o.x + w2 + 10, o.y + 64, w2, 54, 'transazione B', s.B, st('B', s.att === 2 && !a('B')), { cls: 'stretta' }),
      el.box(pre + 'la', o.x, o.y + 128, w3, 54, 'log di A', s.logA, s.logA === 'applicato' ? 'att' : s.logA.indexOf('era') >= 0 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'lb', o.x + w3 + 10, o.y + 128, w3, 54, 'log di B', s.logB, s.logB === 'applicato' ? 'att' : s.logB.indexOf('era') >= 0 ? 'on' : '', { cls: 'stretta' }),
      el.box(pre + 'w', o.x + 2 * (w3 + 10), o.y + 128, w3, 54, 'attese', s.att === 2 ? 'ciclo fra A e B' : 'nessuna', s.att === 2 ? 'err' : '', { cls: 'stretta' })
    ];
  };
  return { ripristino, traccia, quadro };
})();
SL.registra('5.7.4', {
  titolo: 'Rilevamento e recupero',
  obiettivo: 'Obiettivo: descrivere il modo in cui un sistema rileva un deadlock già avvenuto, e lo risolve con l’annullamento di una transazione senza lasciare dati incompleti.',
  concetti: [['lente', 'La ricerca di un ciclo fra le attese'], ['journal', 'Un log per il ripristino'], ['riproduci', 'Annullamento, rilascio, nuovo tentativo']],
  filigrana: ['lente', 'journal', 'stallo'],
  richiami: {
    carte: [
      { sim: 'stallo', da: 'Dall’unità 5.7.1', t: 'Il ciclo', d: 'Con una sola istanza per risorsa, un ciclo di attese è un deadlock.' },
      { sim: 'scudo', da: 'Dall’unità 5.7.2', t: 'Senza prelazione', d: 'Un lock è rilasciato soltanto dal suo possessore.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.5.2', t: 'La sezione critica', d: 'Durante una modifica in corso, i dati protetti possono essere incoerenti.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread possiede un lock e ha modificato metà dei dati protetti. Il sistema gli sottrae il lock e lo assegna a un altro thread. Che cosa trova il secondo thread?', o: [
      { t: 'Dati con una modifica incompleta, eventualmente incoerenti', ok: true, fb: 'Il lock aveva la funzione di nascondere quello stato intermedio.' },
      { t: 'I dati precedenti alla modifica', fb: 'Nessuna operazione ha annullato la parte di modifica già eseguita.' },
      { t: 'I dati a modifica completata', fb: 'Il primo thread è stato interrotto prima del termine.' }
    ] }
  },
  idea: {
    titolo: 'Il rimedio successivo al deadlock',
    termini: ['rilevamento del deadlock', 'transazione sui dati', 'rollback'],
    testo: [
      'Prevenzione ed evitamento hanno un costo sostenuto in ogni caso, anche quando nessun deadlock si sarebbe formato. Una terza strategia inverte l’impostazione: i thread sono liberi di richiedere qualunque risorsa, e se un deadlock si forma il sistema lo rileva e lo risolve. La strategia è preferibile quando i deadlock sono rari e il rimedio ha un costo ridotto.',
      'La prima parte è il [[rilevamento del deadlock]]. Il sistema registra le attese fra i thread, e periodicamente ricerca un ciclo fra tali attese, con il medesimo procedimento dell’unità 5.7.1 applicato alle richieste effettivamente in corso. Se esiste un ciclo, i thread coinvolti sono bloccati indefinitamente, e occorre un intervento esterno.',
      'La seconda parte è il recupero, che richiede maggiore cautela. Per interrompere il ciclo occorre sottrarre una risorsa a un thread. Un lock protegge tuttavia dati che il suo possessore può avere lasciato con una modifica incompleta: la sola sottrazione esporrebbe agli altri thread uno stato incoerente. Occorre anzitutto riportare i dati a uno stato coerente.',
      'I sistemi che gestiscono dati rilevanti prevedono questa evenienza. Raggruppano le modifiche in una [[transazione sui dati|transazione]], un gruppo di operazioni che vale come una sola: avvengono tutte, oppure nessuna. Il nome coincide con quello delle transazioni sul bus dell’unità 4.4.1, e il significato è diverso. Prima di modificare un dato, la transazione annota in un log il valore precedente. Se va annullata, il sistema ripercorre il log e ripristina ogni valore. Tale operazione prende il nome di [[rollback]].',
      { fig: 'scena', w: 720, h: 190, titolo: 'Due transazioni in ciclo, con i loro log', nota: 'Ogni log conserva il valore precedente del dato modificato, necessario per annullare la transazione.', els: SL.unita574.quadro('g', SL.unita574.traccia({ vittima: 'A', dopo: 'riprova' })[1], { x: 10, y: 4, w: 700 }) },
      'Il recupero procede dunque in quattro operazioni: si seleziona una vittima fra le transazioni del ciclo, se ne esegue il rollback, si ritira la sua richiesta e si liberano i suoi lock. Le altre transazioni proseguono, e la vittima può essere ritentata dall’inizio. La selezione della vittima considera il costo: di norma è annullata la transazione che ha svolto meno lavoro. Resta un’avvertenza: se la vittima fosse sempre la medesima, quella transazione resterebbe incompiuta indefinitamente, in una starvation.'
    ]
  },
  esperimento: {
    faremo: [
      'Due transazioni, A e B, si sono bloccate a vicenda sui lock X e Y, dopo avere già modificato un dato ciascuna. I controlli fissano la transazione da annullare, e l’eventuale nuovo tentativo dopo il rollback.',
      'L’esperimento segue i valori dei due dati, i log e il ciclo delle attese. Va osservato l’ordine: prima il ripristino del dato, poi il rilascio del lock.'
    ],
    vedrai: [
      ['memory', 'I dati e i loro lock', 'In alto: il valore di X e di Y, e il possessore del lock di ciascuno.'],
      ['thread', 'Le transazioni', 'Al centro: lo stato di A e di B.'],
      ['journal', 'I log e le attese', 'In basso: i valori annotati da ciascuna transazione, e l’eventuale ciclo delle attese.']
    ]
  },
  lab: {
    titolo: 'La risoluzione di un ciclo con un rollback',
    scena: { w: 860, h: 194 },
    atti: ['Lo stallo', 'Il rilevamento', 'Il rollback', 'La ripresa', 'L’esito'],
    controlli: [
      { id: 'vittima', tipo: 'scelta', eti: 'Transazione da annullare', opzioni: [['A', 'A'], ['B', 'B']], valore: 'A' },
      { id: 'dopo', tipo: 'scelta', eti: 'Dopo il rollback la vittima', opzioni: [['riprova', 'è ritentata dall’inizio'], ['lascia', 'è abbandonata']], valore: 'riprova' }
    ],
    nota: 'I passi sono sempre otto. A aggiunge 5 a X e quindi a Y. B aggiunge 7 a Y e quindi a X.',
    previsione: {
      domanda: (p) => 'X valeva 10, e A lo ha portato a 15. Y valeva 20, e B lo ha portato a 27. In seguito A e B si sono bloccate a vicenda. Il gestore annulla ' + p.vittima + ' con un rollback. Quanto vale ' + (p.vittima === 'A' ? 'X' : 'Y') + ' immediatamente dopo il rollback?',
      opzioni: (p) => (p.vittima === 'A' ? [10, 15, 0] : [20, 27, 0]).map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Dopo il rollback ' + (p.vittima === 'A' ? 'X' : 'Y') + ' vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 0 ? 'Il rollback ripristina il valore che il dato aveva prima della transazione, annotato nel log. L’azzeramento sarebbe un’ulteriore modifica.' : 'Il mantenimento del valore modificato esporrebbe all’altra transazione un lavoro mai concluso. Il rollback lo riporta al valore annotato nel log.'),
    costruisci(p) {
      const U = SL.unita574, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Dato X', String(s.X), 'a'], ['Dato Y', String(s.Y), 'c'], ['Attese', s.att === 2 ? 'in ciclo' : 'nessuna']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.ripristino(p) };
    }
  },
  bilancio: {
    regola: [
      'Rilevamento: si annotano le attese in corso e si ricerca periodicamente un ciclo.',
      'Recupero: si seleziona una vittima, se ne annullano le modifiche con il log, si ritira la sua richiesta e si liberano i suoi lock. In seguito la vittima può essere ritentata.'
    ],
    errori: [
      ['Liberare il lock prima di ripristinare i dati.', 'Gli altri thread osserverebbero una modifica incompleta.'],
      ['Selezionare sempre la medesima vittima.', 'Quella transazione sarebbe annullata a ogni tentativo: una starvation.'],
      ['Ritenere che il rollback azzeri i dati.', 'Il rollback ripristina i valori precedenti, annotati nel log.']
    ],
    saFare: ['Riconoscere un ciclo fra le attese in corso.', 'Ricostruire i dati dopo un rollback per mezzo del log.', 'Seguire la ripresa delle transazioni residue.'],
    esercizi: [
      { d: 'Per quale ragione, nella risoluzione di un deadlock, è insufficiente sottrarre il lock a una delle due transazioni?', guida: 'Si scelga la risposta.', o: [
        { t: 'I dati protetti da quel lock contengono una modifica incompleta', ok: true, fb: 'Vanno anzitutto ripristinati i valori precedenti, e in seguito il lock può passare ad altri.' },
        { t: 'Un lock acquisito è impossibile da sottrarre', fb: 'Il gestore può liberarlo. Il problema è lo stato dei dati.' },
        { t: 'L’altra transazione rifiuterebbe il lock', fb: 'L’altra transazione lo attende.' }] },
      { d: 'Una transazione ha modificato tre dati: P da 4 a 9, Q da 7 a 2, R da 1 a 6. È selezionata come vittima. Quanto vale Q dopo il rollback?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: 'Il rollback ripristina in Q il valore annotato nel log: 7.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due è il valore scritto dalla transazione. Il rollback lo annulla.' },
          { se: ['0', 'zero'], msg: 'Il rollback ripristina il valore precedente, annotato nel log.' },
          { se: ['4', 'quattro', '1', 'uno'], msg: 'Quello è il valore precedente di un altro dato. Va considerata la riga di Q.' }
        ],
        altro: 'Il valore è diverso. Si individui il valore che Q aveva prima della transazione.',
        indizi: ['Il log annota il valore precedente di ogni dato modificato.', 'Per Q il log indica il valore 7.', 'Dopo il rollback Q vale 7.'],
        svolgimento: ['Log: P era 4, Q era 7, R era 1.', 'Rollback: ogni dato torna al valore annotato.', 'Q = 7.'] },
      { d: 'Quattro transazioni sono in attesa: T1 attende T2, T2 attende T3, T3 attende T1, e T4 attende T1. Qual è il numero minimo di transazioni da annullare affinché nessuna resti bloccata indefinitamente?', segnaposto: 'Un numero', giuste: ['1', 'una', 'uno'],
        ok: 'Il ciclo è uno solo, fra T1, T2 e T3. Con l’annullamento di una di esse il ciclo è risolto, e anche T4 potrà avanzare.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Per interrompere un ciclo è sufficiente rimuovere uno dei suoi elementi.' },
          { se: ['2', 'due'], msg: 'T4 è esterna al ciclo: quando T1 avanza, avanza anche T4.' },
          { se: ['4', 'quattro'], msg: 'Il ciclo è uno solo, ed è sufficiente interromperlo in un punto.' }
        ],
        altro: 'Il numero è diverso. Si contino i cicli, e si determini quanti elementi vanno rimossi da ciascuno.',
        indizi: ['Il ciclo è T1, T2, T3.', 'T4 attende una transazione del ciclo, senza farne parte.', 'Un ciclo si interrompe con l’annullamento di una sola transazione.'],
        svolgimento: ['Cicli: 1.', 'Vittime necessarie: 1.'] }
    ]
  }
});
