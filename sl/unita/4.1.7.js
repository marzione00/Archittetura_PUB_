'use strict';
SL.unita417 = (() => {
  const annida = (p) => p.iflag === 'uno' && p.q > 4;
  /* fase: 0 il programma · 1 il primo interrupt · 2 dopo il prologo · 3 la seconda richiesta · 4 il servizio
     · 5 il primo IRETQ · 6 il seguito */
  const stato = (p, f) => {
    const n = annida(p), ifa = p.iflag === 'uno';
    if (f === 0) return { chi: 'programma', IF: 1, frame: 0, rich: 'nessuna' };
    if (f === 1) return { chi: 'gestore A · priorità 4', IF: 0, frame: 1, rich: 'nessuna' };
    if (f === 2) return { chi: 'gestore A · priorità 4', IF: ifa ? 1 : 0, frame: 1, rich: 'nessuna' };
    if (f === 3) return { chi: 'gestore A · priorità 4', IF: ifa ? 1 : 0, frame: 1, rich: 'priorità ' + p.q + ' · in arrivo' };
    if (f === 4) return n ? { chi: 'gestore B · priorità ' + p.q, IF: 0, frame: 2, rich: 'priorità ' + p.q + ' · in servizio' } : { chi: 'gestore A · priorità 4', IF: ifa ? 1 : 0, frame: 1, rich: 'priorità ' + p.q + ' · pendente' };
    if (f === 5) return n ? { chi: 'gestore A · priorità 4', IF: 1, frame: 1, rich: 'servita' } : { chi: 'programma', IF: 1, frame: 0, rich: 'priorità ' + p.q + ' · pendente' };
    return n ? { chi: 'programma', IF: 1, frame: 0, rich: 'servita' } : { chi: 'gestore B · priorità ' + p.q, IF: 0, frame: 1, rich: 'priorità ' + p.q + ' · in servizio' };
  };
  const quadro = (pre, p, f, o) => {
    const el = SL.el, s = stato(p, f), n = annida(p), els = [], x2 = o.x + o.w + o.gap, x3 = x2 + o.w + o.gap, py = o.h + 14;
    els.push(el.box(pre + 'f1', o.x, o.y, o.w, o.h, 'pila · primo frame', s.frame >= 1 ? (f === 6 && !n ? 'ripresa: programma' : 'ripresa: programma') : '·', s.frame >= 1 ? (f === 1 ? 'att' : 'on') : '', { cls: 'stretta' }),
      el.box(pre + 'f2', o.x, o.y + py, o.w, o.h, 'pila · secondo frame', s.frame >= 2 ? 'ripresa: gestore A' : '·', s.frame >= 2 ? 'att' : '', { cls: 'stretta' }),
      el.box(pre + 'f3', o.x, o.y + 2 * py, o.w, o.h, 'frame sulla pila', String(s.frame), f === 4 && n ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', x2, o.y, o.w, o.h, 'in esecuzione', s.chi, f === 1 || (f === 4 && n) || f === 5 || f === 6 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'i', x2, o.y + py, o.w, o.h, 'flag di interruzione', 'IF = ' + s.IF, f === 2 ? 'att' : s.IF ? 'on' : 'zero', { cls: 'stretta' }),
      el.box(pre + 'r', x2, o.y + 2 * py, o.w, o.h, 'seconda richiesta', s.rich, f === 3 ? 'att' : /pendente/.test(s.rich) ? 'err' : /servizio/.test(s.rich) ? 'att' : s.rich === 'nessuna' ? '' : 'on', { cls: 'stretta' }),
      el.box(pre + 'k', x3, o.y, o.w, o.h, 'priorità: ' + p.q + ' > 4', f >= 3 ? (p.q > 4 ? 'vero' : 'falso') : '·', f === 3 ? 'att' : f > 3 ? (p.q > 4 ? 'on' : 'off') : '', { cls: 'stretta' }),
      el.box(pre + 'm', x3, o.y + py, o.w, o.h, 'IF durante il gestore A', f >= 3 ? (p.iflag === 'uno' ? '1 · interrupt accettati' : '0 · interrupt rinviati') : '·', f === 3 ? 'att' : f > 3 ? (p.iflag === 'uno' ? 'on' : 'off') : '', { cls: 'stretta' }),
      el.box(pre + 'e', x3, o.y + 2 * py, o.w, o.h, 'seconda richiesta', f >= 4 ? (n ? 'servita subito' : 'servita dopo') : '·', f >= 4 ? (n ? 'att' : 'on') : '', { cls: 'stretta' }));
    return els;
  };
  return { annida, stato, quadro };
})();
SL.registra('4.1.7', {
  titolo: 'Ripresa, annidamento e priorità',
  obiettivo: 'Obiettivo: stabilire se una seconda richiesta di interrupt sospende il gestore in corso oppure attende, e in quale ordine avvengono i ritorni.',
  concetti: [['interrupt', 'Due richieste, un processore'], ['flag', 'Il flag IF'], ['pila', 'Frame sovrapposti']],
  filigrana: ['interrupt', 'pila', 'flag'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 4.1.5', t: 'Il frame di interruzione', d: 'A ogni ingresso il processore deposita sulla pila del kernel i valori necessari per il ritorno.' },
      { sim: 'gate', da: 'Dall’unità 4.1.6', t: 'IRETQ', d: 'Rimuove il frame dalla pila e ripristina RIP, i flag e la pila del codice sospeso.' },
      { sim: 'pila', da: 'Dall’unità 2.6.1', t: 'L’ordine della pila', d: 'L’ultimo dato depositato è il primo a essere prelevato.' }
    ],
    domanda: { d: 'Prima di proseguire: sulla pila sono depositati prima il frame X e poi il frame Y. Quale dei due è rimosso dalla prima IRETQ?', o: [
      { t: 'Il frame Y', ok: true, fb: 'IRETQ rimuove il frame in cima, cioè quello depositato per ultimo.' },
      { t: 'Il frame X', fb: 'Il frame X si trova sotto il frame Y, e sarà rimosso dalla IRETQ successiva.' },
      { t: 'Entrambi', fb: 'Ogni IRETQ rimuove un solo frame.' }
    ] }
  },
  idea: {
    titolo: 'Un gestore all’interno di un altro',
    termini: ['controller degli interrupt', 'richiesta pendente', 'flag di interruzione', 'interrupt mascherabile', 'annidamento'],
    testo: [
      'Mentre un gestore è in esecuzione, un’altra periferica può richiedere l’intervento del processore. L’esito dipende da due circuiti. Il primo è il [[controller degli interrupt]], che raccoglie le richieste delle periferiche e le ordina per priorità: in questo modello un numero più alto indica un’urgenza maggiore. Mentre è in corso un servizio, il controller presenta al processore soltanto le richieste di priorità superiore. Le altre restano registrate e attendono. Una richiesta in tale condizione si dice [[richiesta pendente|pendente]].',
      'Il secondo è un bit del registro RFLAGS, il [[flag di interruzione]], abbreviato IF. Con IF a 1 il processore accetta gli interrupt, con IF a 0 li rinvia. Un interrupt che può essere rinviato in questo modo si dice [[interrupt mascherabile|mascherabile]], e quasi tutti lo sono. All’ingresso in un gestore di interrupt il processore azzera autonomamente IF, per consentire al gestore di salvare il contesto senza interruzioni.',
      'Dopo il prologo il gestore dispone di due possibilità. Se lascia IF a 0, nessuna richiesta lo sospenderà. Se lo riporta a 1, accetta di essere sospeso da una richiesta più urgente. In tal caso si ha un [[annidamento]]: il secondo gestore si svolge per intero all’interno del primo.',
      { fig: 'scena', w: 720, h: 206, titolo: 'Una richiesta di priorità 5 durante un gestore di priorità 4, con IF a 1', nota: 'Sulla pila sono presenti due frame. Il più recente riporta al gestore A, il meno recente al programma.', els: SL.unita417.quadro('g', { q: 5, iflag: 'uno' }, 4, { x: 10, y: 8, w: 222, gap: 17, h: 54 }) },
      'Ogni ingresso deposita un frame sulla pila del kernel, sopra i precedenti. Ogni IRETQ rimuove quello più recente. I ritorni avvengono quindi in ordine inverso agli ingressi: il secondo gestore torna al primo, e il primo torna al programma. IRETQ ripristina anche RFLAGS, e con esso il valore che IF aveva prima dell’ingresso.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma è sospeso da un interrupt di priorità 4, servito dal gestore A. Durante il servizio si presenta una seconda richiesta. I controlli ne fissano la priorità e il comportamento del gestore A rispetto al flag IF.',
      'Si osserva se la seconda richiesta entra immediatamente oppure resta pendente, quanti frame sono presenti sulla pila e a quale codice riporta ogni IRETQ. Dopo il caso proposto, è istruttivo ripetere l’esperimento lasciando IF a 0.'
    ],
    vedrai: [
      ['pila', 'La pila del kernel', 'A sinistra: i frame presenti, e il codice al quale riportano.'],
      ['cpu', 'Il processore', 'Al centro: il codice in esecuzione, il valore di IF e lo stato della seconda richiesta.'],
      ['lente', 'Le due condizioni', 'A destra: il confronto delle priorità, il flag IF e l’esito.']
    ]
  },
  lab: {
    titolo: 'Una seconda richiesta',
    scena: { w: 860, h: 246 },
    atti: ['Il primo interrupt', 'La seconda richiesta', 'Il servizio', 'I ritorni'],
    controlli: [
      { id: 'iflag', tipo: 'scelta', eti: 'Il gestore A, dopo il prologo', opzioni: [['uno', 'riporta IF a 1'], ['zero', 'lascia IF a 0']], valore: 'uno' },
      { id: 'q', tipo: 'scelta', eti: 'Priorità della seconda richiesta', opzioni: [[3, '3'], [5, '5'], [7, '7']], valore: 5 }
    ],
    nota: 'I passi sono sempre sette. Il gestore A ha priorità 4, e un numero più alto indica un’urgenza maggiore.',
    previsione: {
      domanda: (p) => 'Il gestore A, di priorità 4, ' + (p.iflag === 'uno' ? 'ha riportato IF a 1' : 'ha lasciato IF a 0') + '. Si presenta una richiesta di priorità ' + p.q + '. Che cosa accade?',
      opzioni: () => [['subito', 'È servita immediatamente, e il gestore A resta sospeso'], ['dopo', 'Resta pendente fino al termine del gestore A']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava che ' + (pred === 'subito' ? 'fosse servita immediatamente' : 'restasse pendente') + '. La richiesta ' + (esito === 'subito' ? 'è servita immediatamente' : 'resta pendente') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'subito' ? 'Le due condizioni sono soddisfatte: la priorità ' + p.q + ' supera 4, e IF vale 1.' : p.q <= 4 ? 'Il controller trattiene le richieste di priorità pari o inferiore a quella in servizio.' : 'Con IF a 0 il processore rinvia la richiesta, anche se la priorità è maggiore.'),
    costruisci(p) {
      const U = SL.unita417, passi = [], n = U.annida(p), ifa = p.iflag === 'uno', alta = p.q > 4;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'PILA DEL KERNEL', 'mono'), SL.el.nota('t1', 300, 0, 'PROCESSORE', 'mono'), SL.el.nota('t2', 580, 0, 'CONDIZIONI', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 264, gap: 14, h: 58 }));
      const hud = (f) => { const s = U.stato(p, f); return [['In esecuzione', s.chi.split(' · ')[0], 'a'], ['IF', String(s.IF)], ['Frame sulla pila', String(s.frame), 'c']]; };
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il programma', 'Il programma è eseguito nel modo utente, con IF a 1. La pila del kernel è vuota, e nessuna richiesta è in attesa.', {});
      P(1, 0, 'Il primo interrupt', 'Una periferica di priorità 4 richiede l’intervento. Il processore deposita il primo frame, quello che riporta al programma, ed entra nel gestore A. All’ingresso azzera IF: per il momento nessun altro interrupt può essere accettato.', { calc: 'ingresso: IF = 0 · 1 frame',
        chiedi: { d: 'Finché IF vale 0, il processore accetta un interrupt mascherabile?', o: ['Sì', 'No'], g: 1, no: 'Con IF a 0 gli interrupt mascherabili sono rinviati, e restano pendenti nel controller.' } });
      P(2, 1, 'Dopo il prologo', ifa ? 'Il gestore A ha salvato il contesto. Riporta quindi IF a 1 con l’istruzione `sti`: accetta di essere sospeso, purché da una richiesta più urgente.' : 'Il gestore A ha salvato il contesto, e lascia IF a 0 fino al termine. Nessuna richiesta potrà sospenderlo.', { calc: 'IF = ' + (ifa ? 1 : 0) });
      P(3, 1, 'La seconda richiesta', 'Una seconda periferica, di priorità ' + p.q + ', richiede l’intervento. Il controller confronta le priorità: ' + p.q + ' > 4 è ' + (alta ? 'vero, e la richiesta è presentata al processore.' : 'falso, e la richiesta resta nel controller.') + ' Il processore, a sua volta, ha IF a ' + (ifa ? '1 e accetterebbe.' : '0 e rinvierebbe.'), { calc: p.q + ' > 4: ' + (alta ? 'vero' : 'falso') + ' · IF = ' + (ifa ? 1 : 0) });
      P(4, 2, n ? 'Un gestore all’interno dell’altro' : 'La richiesta attende', n ? 'Le due condizioni sono soddisfatte. Il processore sospende il gestore A, deposita un secondo frame che riporta ad A ed entra nel gestore B. IF è azzerato di nuovo.' : 'Manca ' + (!alta && !ifa ? 'ciascuna delle due condizioni' : !alta ? 'la condizione sulla priorità' : 'la condizione su IF') + '. La richiesta resta pendente, registrata nel controller, e il gestore A prosegue senza interruzioni.', { calc: n ? '2 frame · gestore B' : 'richiesta pendente', esito: [n ? 'servita subito' : 'resta pendente', n ? 'si' : ''] });
      P(5, 3, 'Il primo IRETQ', n ? 'Il gestore B termina per primo. La sua IRETQ rimuove il frame più recente e riporta al gestore A, che riprende dal punto in cui era stato sospeso. Sulla pila resta un frame.' : 'Il gestore A termina. La sua IRETQ rimuove l’unico frame, riporta al programma e ripristina RFLAGS: IF torna a 1.', { calc: n ? 'IRETQ → gestore A · 1 frame' : 'IRETQ → programma · IF = 1' });
      P(6, 3, n ? 'Il secondo IRETQ' : 'Il servizio della richiesta pendente', n ? 'Anche il gestore A termina. La sua IRETQ rimuove l’ultimo frame e riporta al programma. I ritorni sono avvenuti in ordine inverso agli ingressi: prima B, poi A.' : 'Non appena IF torna a 1 e nessun servizio è in corso, il controller presenta la richiesta pendente. Il processore deposita un nuovo frame ed entra nel gestore B. I due gestori sono stati eseguiti in successione, e la pila ha contenuto al massimo un frame.', { calc: n ? 'ordine dei ritorni: B, poi A' : 'ordine dei servizi: A, poi B', esito: [n ? 'servita subito' : 'resta pendente', n ? 'si' : ''] });
      return { passi, esito: n ? 'subito' : 'dopo' };
    }
  },
  bilancio: {
    regola: [
      'Una seconda richiesta sospende il gestore in corso soltanto se la sua priorità è maggiore e se IF vale 1. In caso contrario resta pendente nel controller.',
      'Ogni ingresso deposita un frame, ogni IRETQ rimuove il più recente. I ritorni avvengono in ordine inverso agli ingressi, e IRETQ ripristina anche il valore di IF.'
    ],
    errori: [
      ['Considerare una sola delle due condizioni.', 'Occorrono entrambe: la priorità è verificata dal controller, IF dal processore.'],
      ['Ritenere che una richiesta rinviata vada perduta.', 'Il controller la conserva come pendente, e la presenta non appena possibile.'],
      ['Far tornare il secondo gestore al programma.', 'Il frame più recente riporta al primo gestore, sospeso per ultimo.']
    ],
    saFare: ['Applicare le due condizioni per l’annidamento.', 'Contare i frame presenti sulla pila del kernel.', 'Indicare il codice al quale riporta ciascuna IRETQ.'],
    esercizi: [
      { d: 'Un gestore di priorità 2 ha riportato IF a 1. Si presentano, in successione, una richiesta di priorità 6 e, durante il suo servizio con IF a 1, una di priorità 9. Quanti frame sono presenti sulla pila del kernel durante l’esecuzione del terzo gestore?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Tre ingressi senza alcun ritorno: programma, primo gestore, secondo gestore.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Va contato anche il primo frame, quello che riporta al programma.' },
          { se: ['1', 'uno'], msg: 'Ogni ingresso deposita un frame, e nessun gestore è ancora tornato.' }
        ],
        altro: 'Il numero è diverso. Si conti un frame per ogni ingresso non ancora seguito da IRETQ.',
        indizi: ['Il primo ingresso sospende il programma.', 'Il secondo sospende il gestore di priorità 2.', 'Il terzo sospende il gestore di priorità 6.'],
        svolgimento: ['Frame 1: ripresa del programma.', 'Frame 2: ripresa del gestore di priorità 2.', 'Frame 3: ripresa del gestore di priorità 6.'] },
      { d: 'Un gestore di priorità 4 ha lasciato IF a 0. Si presenta una richiesta di priorità 7. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'Resta pendente fino al ritorno del gestore', ok: true, fb: 'La priorità sarebbe sufficiente. Con IF a 0, tuttavia, il processore rinvia, e la richiesta resta nel controller.' },
        { t: 'È servita immediatamente, poiché è più urgente', fb: 'La priorità è una delle due condizioni. Con IF a 0 il processore rinvia gli interrupt mascherabili.' },
        { t: 'Va perduta', fb: 'Il controller registra la richiesta e la presenta non appena IF torna a 1.' }] },
      { d: 'Durante un annidamento, quando IF torna al valore che aveva nel programma sospeso?', guida: 'Si scelga la risposta.', o: [
        { t: 'Quando l’ultima IRETQ ripristina RFLAGS dal primo frame', ok: true, fb: 'IF fa parte di RFLAGS, e ogni frame conserva il valore che RFLAGS aveva prima di quell’ingresso.' },
        { t: 'All’inizio del secondo gestore', fb: 'A ogni ingresso il processore azzera IF. Il valore precedente resta conservato nel frame.' },
        { t: 'Mai, finché il kernel non lo imposta esplicitamente', fb: 'IRETQ ripristina RFLAGS dal frame, senza interventi del kernel.' }] }
    ],
    sfida: ['cslez4_1_04_exceptions_04', 'Mascheramento e privilegi']
  }
});
