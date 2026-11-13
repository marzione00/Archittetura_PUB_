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
  obiettivo: 'Alla fine saprai dire se una seconda richiesta di interrupt sospende il gestore in corso oppure attende, e in quale ordine avvengono i ritorni.',
  concetti: [['interrupt', 'Due richieste, un processore'], ['flag', 'Il flag IF'], ['pila', 'Frame impilati']],
  filigrana: ['interrupt', 'pila', 'flag'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 4.1.5', t: 'Il frame di interruzione', d: 'A ogni ingresso il processore posa sulla pila del kernel i valori che servono per tornare.' },
      { sim: 'gate', da: 'Dall’unità 4.1.6', t: 'IRETQ', d: 'Toglie il frame dalla pila e ripristina RIP, i flag e la pila del codice sospeso.' },
      { sim: 'pila', da: 'Dall’unità 2.6.1', t: 'L’ordine della pila', d: 'L’ultimo dato posato è il primo a essere ripreso.' }
    ],
    domanda: { d: 'Prima di proseguire: sulla pila vengono posati prima il frame X e poi il frame Y. Quale dei due toglie la prima IRETQ?', o: [
      { t: 'Il frame Y', ok: true, fb: 'IRETQ toglie il frame in cima, cioè quello posato per ultimo.' },
      { t: 'Il frame X', fb: 'Il frame X sta sotto il frame Y, e verrà tolto dalla IRETQ successiva.' },
      { t: 'Entrambi', fb: 'Ogni IRETQ toglie un solo frame.' }
    ] }
  },
  idea: {
    titolo: 'Un gestore dentro un altro',
    termini: ['controller degli interrupt', 'richiesta pendente', 'flag di interruzione', 'interrupt mascherabile', 'annidamento'],
    testo: [
      'Mentre un gestore lavora, un’altra periferica può chiedere attenzione. Due circuiti decidono che cosa succede. Il primo è il [[controller degli interrupt]], che raccoglie le richieste delle periferiche e le ordina per priorità: in questo modello un numero più alto indica una urgenza maggiore. Mentre è in corso un servizio, il controller presenta al processore soltanto le richieste di priorità superiore. Le altre restano registrate e attendono. Una richiesta in questa condizione si dice [[richiesta pendente|pendente]].',
      'Il secondo è un bit del registro RFLAGS, il [[flag di interruzione]], abbreviato IF. Con IF a 1 il processore accetta gli interrupt, con IF a 0 li rinvia. Un interrupt che si può rinviare così si dice [[interrupt mascherabile|mascherabile]], e quasi tutti lo sono. All’ingresso in un gestore di interrupt il processore azzera IF da solo, per dare al gestore il tempo di salvare il contesto senza essere disturbato.',
      'Dopo il prologo il gestore può scegliere. Se lascia IF a 0, nessuna richiesta lo sospenderà. Se lo riporta a 1, accetta di essere sospeso da una richiesta più urgente. In quel caso si ha un [[annidamento]]: il secondo gestore si svolge per intero dentro il primo.',
      { fig: 'scena', w: 720, h: 206, titolo: 'Una richiesta di priorità 5 durante un gestore di priorità 4, con IF a 1', nota: 'Sulla pila ci sono due frame. Il più recente riporta al gestore A, il più vecchio al programma.', els: SL.unita417.quadro('g', { q: 5, iflag: 'uno' }, 4, { x: 10, y: 8, w: 222, gap: 17, h: 54 }) },
      'Ogni ingresso posa un frame sulla pila del kernel, sopra i precedenti. Ogni IRETQ toglie quello più recente. I ritorni avvengono quindi in ordine inverso agli ingressi: il secondo gestore torna al primo, e il primo torna al programma. IRETQ ripristina anche RFLAGS, e con lui il valore che IF aveva prima dell’ingresso.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma viene sospeso da un interrupt di priorità 4, servito dal gestore A. Durante il servizio arriva una seconda richiesta. Sceglierai la sua priorità e che cosa fa il gestore A con il flag IF.',
      'Guarderemo se la seconda richiesta entra subito oppure resta pendente, quanti frame ci sono sulla pila e a chi torna ogni IRETQ. Dopo il caso proposto, lascia IF a 0 e ripeti.'
    ],
    vedrai: [
      ['pila', 'La pila del kernel', 'A sinistra: i frame presenti, e a chi riportano.'],
      ['cpu', 'Il processore', 'Al centro: chi è in esecuzione, il valore di IF e lo stato della seconda richiesta.'],
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
    nota: 'I passi sono sempre sette. Il gestore A ha priorità 4, e un numero più alto indica una urgenza maggiore.',
    previsione: {
      domanda: (p) => 'Il gestore A, di priorità 4, ' + (p.iflag === 'uno' ? 'ha riportato IF a 1' : 'ha lasciato IF a 0') + '. Arriva una richiesta di priorità ' + p.q + '. Che cosa accade?',
      opzioni: () => [['subito', 'Viene servita subito, e il gestore A resta sospeso'], ['dopo', 'Resta pendente finché il gestore A ha finito']]
    },
    confronto: (pred, esito, p) => 'Avevi previsto che ' + (pred === 'subito' ? 'fosse servita subito' : 'restasse pendente') + '. La richiesta ' + (esito === 'subito' ? 'viene servita subito' : 'resta pendente') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'subito' ? 'Le due condizioni sono soddisfatte: la priorità ' + p.q + ' supera 4, e IF vale 1.' : p.q <= 4 ? 'Il controller trattiene le richieste di priorità pari o inferiore a quella in servizio.' : 'Con IF a 0 il processore rinvia la richiesta, anche se la priorità è più alta.'),
    costruisci(p) {
      const U = SL.unita417, passi = [], n = U.annida(p), ifa = p.iflag === 'uno', alta = p.q > 4;
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'PILA DEL KERNEL', 'mono'), SL.el.nota('t1', 300, 0, 'PROCESSORE', 'mono'), SL.el.nota('t2', 580, 0, 'CONDIZIONI', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 24, w: 264, gap: 14, h: 58 }));
      const hud = (f) => { const s = U.stato(p, f); return [['In esecuzione', s.chi.split(' · ')[0], 'a'], ['IF', String(s.IF)], ['Frame sulla pila', String(s.frame), 'c']]; };
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il programma', 'Il programma gira nel modo utente, con IF a 1. La pila del kernel è vuota, e nessuna richiesta è in attesa.', {});
      P(1, 0, 'Il primo interrupt', 'Una periferica di priorità 4 chiede attenzione. Il processore posa il primo frame, quello che riporta al programma, ed entra nel gestore A. Nell’entrare azzera IF: per il momento nessun altro interrupt può arrivare.', { calc: 'ingresso: IF = 0 · 1 frame',
        chiedi: { d: 'Finché IF vale 0, il processore accetta un interrupt mascherabile?', o: ['Sì', 'No'], g: 1, no: 'Con IF a 0 gli interrupt mascherabili vengono rinviati, e restano pendenti nel controller.' } });
      P(2, 1, 'Dopo il prologo', ifa ? 'Il gestore A ha salvato il contesto. Ora riporta IF a 1 con l’istruzione `sti`: accetta di essere sospeso, purché da una richiesta più urgente.' : 'Il gestore A ha salvato il contesto, e sceglie di lasciare IF a 0 fino alla fine. Nessuna richiesta potrà sospenderlo.', { calc: 'IF = ' + (ifa ? 1 : 0) });
      P(3, 1, 'La seconda richiesta', 'Una seconda periferica, di priorità ' + p.q + ', chiede attenzione. Il controller confronta le priorità: ' + p.q + ' > 4 è ' + (alta ? 'vero, e la richiesta viene presentata al processore.' : 'falso, e la richiesta resta nel controller.') + ' Il processore, dal canto suo, ha IF a ' + (ifa ? '1 e accetterebbe.' : '0 e rinvierebbe.'), { calc: p.q + ' > 4: ' + (alta ? 'vero' : 'falso') + ' · IF = ' + (ifa ? 1 : 0) });
      P(4, 2, n ? 'Un gestore dentro l’altro' : 'La richiesta attende', n ? 'Le due condizioni sono soddisfatte. Il processore sospende il gestore A, posa un secondo frame che riporta ad A ed entra nel gestore B. IF viene azzerato di nuovo.' : 'Manca ' + (!alta && !ifa ? 'ciascuna delle due condizioni' : !alta ? 'la condizione sulla priorità' : 'la condizione su IF') + '. La richiesta resta pendente, registrata nel controller, e il gestore A prosegue indisturbato.', { calc: n ? '2 frame · gestore B' : 'richiesta pendente', esito: [n ? 'servita subito' : 'resta pendente', n ? 'si' : ''] });
      P(5, 3, 'Il primo IRETQ', n ? 'Il gestore B finisce per primo. La sua IRETQ toglie il frame più recente e riporta al gestore A, che riprende dal punto in cui era stato sospeso. Sulla pila resta un frame.' : 'Il gestore A finisce. La sua IRETQ toglie l’unico frame, riporta al programma e ripristina RFLAGS: IF torna a 1.', { calc: n ? 'IRETQ → gestore A · 1 frame' : 'IRETQ → programma · IF = 1' });
      P(6, 3, n ? 'Il secondo IRETQ' : 'Tocca alla richiesta pendente', n ? 'Anche il gestore A finisce. La sua IRETQ toglie l’ultimo frame e riporta al programma. I ritorni sono avvenuti in ordine inverso agli ingressi: prima B, poi A.' : 'Appena IF torna a 1 e nessun servizio è in corso, il controller presenta la richiesta pendente. Il processore posa un nuovo frame ed entra nel gestore B. I due gestori sono stati eseguiti uno dopo l’altro, e la pila non ha mai contenuto più di un frame.', { calc: n ? 'ordine dei ritorni: B, poi A' : 'ordine dei servizi: A, poi B', esito: [n ? 'servita subito' : 'resta pendente', n ? 'si' : ''] });
      return { passi, esito: n ? 'subito' : 'dopo' };
    }
  },
  bilancio: {
    regola: [
      'Una seconda richiesta sospende il gestore in corso soltanto se la sua priorità è maggiore e se IF vale 1. Altrimenti resta pendente nel controller.',
      'Ogni ingresso posa un frame, ogni IRETQ toglie il più recente. I ritorni avvengono in ordine inverso agli ingressi, e IRETQ ripristina anche il valore di IF.'
    ],
    errori: [
      ['Considerare una sola delle due condizioni.', 'Servono entrambe: la priorità la controlla il controller, IF lo controlla il processore.'],
      ['Pensare che una richiesta rinviata vada perduta.', 'Il controller la conserva come pendente, e la presenta appena possibile.'],
      ['Far tornare il secondo gestore al programma.', 'Il frame più recente riporta al primo gestore, che era stato sospeso per ultimo.']
    ],
    saFare: ['Applico le due condizioni per l’annidamento.', 'Conto i frame presenti sulla pila del kernel.', 'Dico a chi riporta ciascuna IRETQ.'],
    esercizi: [
      { d: 'Un gestore di priorità 2 ha riportato IF a 1. Arrivano, una dopo l’altra, una richiesta di priorità 6 e, durante il suo servizio con IF a 1, una di priorità 9. Quanti frame ci sono sulla pila del kernel mentre gira il terzo gestore?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Tre ingressi senza alcun ritorno: programma, primo gestore, secondo gestore.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Conta anche il primo frame, quello che riporta al programma.' },
          { se: ['1', 'uno'], msg: 'Ogni ingresso posa un frame, e nessun gestore è ancora tornato.' }
        ],
        altro: 'Il numero è diverso. Conta un frame per ogni ingresso non ancora seguito da IRETQ.',
        indizi: ['Il primo ingresso sospende il programma.', 'Il secondo sospende il gestore di priorità 2.', 'Il terzo sospende il gestore di priorità 6.'],
        svolgimento: ['Frame 1: ripresa del programma.', 'Frame 2: ripresa del gestore di priorità 2.', 'Frame 3: ripresa del gestore di priorità 6.'] },
      { d: 'Un gestore di priorità 4 ha lasciato IF a 0. Arriva una richiesta di priorità 7. Che cosa accade?', guida: 'Scegli la risposta.', o: [
        { t: 'Resta pendente fino al ritorno del gestore', ok: true, fb: 'La priorità basterebbe. Con IF a 0, però, il processore rinvia, e la richiesta resta nel controller.' },
        { t: 'Viene servita subito, perché è più urgente', fb: 'La priorità è una delle due condizioni. Con IF a 0 il processore non accetta interrupt mascherabili.' },
        { t: 'Va perduta', fb: 'Il controller registra la richiesta e la presenta appena IF torna a 1.' }] },
      { d: 'Durante un annidamento, quando IF torna al valore che aveva nel programma sospeso?', guida: 'Scegli la risposta.', o: [
        { t: 'Quando l’ultima IRETQ ripristina RFLAGS dal primo frame', ok: true, fb: 'IF fa parte di RFLAGS, e ogni frame conserva il valore che RFLAGS aveva prima di quell’ingresso.' },
        { t: 'Appena il secondo gestore comincia', fb: 'A ogni ingresso il processore azzera IF. Il valore precedente resta conservato nel frame.' },
        { t: 'Mai, finché il kernel non lo imposta a mano', fb: 'IRETQ ripristina RFLAGS dal frame, senza interventi del kernel.' }] }
    ],
    sfida: ['cslez4_1_04_exceptions_04', 'Mascheramento e privilegi']
  }
});
