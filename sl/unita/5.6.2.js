'use strict';
SL.unita562 = (() => {
  // Ogni stato: cella piena?, vuoti, pieni, proprietario del mutex, stato di P e di C, dipendenze, riquadri accesi
  const traccia = (p) => {
    const pieno = p.buf === 'pieno', vm = p.ord === 'vm', T = [];
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, dip: 0, acc: '', P: 'pronto', C: 'pronto', mutex: '' }, s, extra ? { extra } : {}));
    S(0, 'La situazione iniziale', 'Il buffer ha una sola cella, ' + (pieno ? 'ed è piena. Il semaforo vuoti vale 0 e il semaforo pieni vale 1.' : 'ed è vuota. Il semaforo vuoti vale 1 e il semaforo pieni vale 0.') + ' Il mutex è libero. Il produttore P deve inserire un dato, e il consumatore C è pronto a prelevare.', { cella: pieno, vuoti: pieno ? 0 : 1, pieni: pieno ? 1 : 0 });
    if (pieno && vm) {
      S(1, 'P · down(vuoti)', 'P richiede anzitutto un posto libero. Il semaforo vuoti vale 0, e P è bloccato. In questo momento P è privo di lock: il mutex resta libero.', { cella: true, vuoti: 0, pieni: 1, P: 'bloccato su vuoti', dip: 1, acc: 'Pv' }, { calc: 'P bloccato · mutex libero', chiedi: { d: 'P è bloccato. Quale entità può compiere l’operazione che lo sblocca?', o: ['Il consumatore C, con up(vuoti)', 'P stesso, con un nuovo tentativo', 'Lo scheduler, allo scadere del time slice'], g: 0, no: 'Il semaforo vuoti può risvegliare P soltanto dopo un prelievo, e i prelievi sono eseguiti da C.' } });
      S(1, 'C · down(pieni)', 'C richiede un dato. Il semaforo pieni vale 1 e scende a 0: C supera la down, e prosegue.', { cella: true, vuoti: 0, pieni: 0, P: 'bloccato su vuoti', C: 'ha superato la down', dip: 1, acc: 'Cp' }, { calc: 'pieni 1 → 0' });
      S(1, 'C · lock, prelievo, unlock', 'C acquisisce il mutex, che è libero, preleva il dato dalla cella e rilascia il mutex. La cella è vuota.', { cella: false, vuoti: 0, pieni: 0, P: 'bloccato su vuoti', C: 'ha prelevato', dip: 1, acc: 'Ckm' }, { calc: 'cella vuota' });
      S(1, 'C · up(vuoti)', 'C restituisce un posto libero. In coda su vuoti è presente P, che è risvegliato e torna pronto. Il prelievo di C ha sbloccato P.', { cella: false, vuoti: 0, pieni: 0, P: 'pronto · ha superato la down', C: 'ha finito', acc: 'Pv' }, { calc: 'P risvegliato · vuoti resta 0' });
      S(1, 'P · lock, scrittura, unlock, up(pieni)', 'P acquisisce il mutex, scrive il dato nella cella, rilascia il mutex e pubblica il dato con up(pieni).', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito', C: 'ha finito', acc: 'Pkp' }, { calc: 'cella piena · pieni 0 → 1' });
      S(2, 'L’esito', 'P ha inserito il proprio dato. Durante l’attesa dello spazio aveva lasciato libero il mutex, e C ha potuto eseguire il prelievo che ha liberato il posto.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito', C: 'ha finito' }, { esito: ['P inserisce il dato', 'si'] });
    } else if (pieno) {
      S(1, 'P · lock(mutex)', 'P acquisisce anzitutto il mutex, che è libero.', { cella: true, vuoti: 0, pieni: 1, P: 'ha il mutex', mutex: 'P', acc: 'Pm' }, { calc: 'mutex di P' });
      S(1, 'P · down(vuoti)', 'P richiede un posto libero. Il semaforo vuoti vale 0, e P è bloccato. Il mutex resta in suo possesso: un thread bloccato conserva i lock che possiede.', { cella: true, vuoti: 0, pieni: 1, P: 'bloccato con il mutex', mutex: 'P', dip: 1, acc: 'Pv' }, { calc: 'P bloccato · mutex di P', chiedi: { d: 'P è bloccato. Quale entità può compiere l’operazione che lo sblocca?', o: ['Il consumatore C, con up(vuoti)', 'P stesso, con un nuovo tentativo', 'Lo scheduler, allo scadere del time slice'], g: 0, no: 'Il semaforo vuoti può risvegliare P soltanto dopo un prelievo, e i prelievi sono eseguiti da C.' } });
      S(1, 'C · down(pieni)', 'C richiede un dato. Il semaforo pieni vale 1 e scende a 0: C supera la down, e prosegue.', { cella: true, vuoti: 0, pieni: 0, P: 'bloccato con il mutex', C: 'ha superato la down', mutex: 'P', dip: 1, acc: 'Cp' }, { calc: 'pieni 1 → 0' });
      S(1, 'C · lock(mutex)', 'Per prelevare, C richiede il mutex. Il mutex appartiene a P, e C è bloccato.', { cella: true, vuoti: 0, pieni: 0, P: 'bloccato con il mutex', C: 'bloccato sul mutex', mutex: 'P', dip: 2, acc: 'Cm' }, { calc: 'C bloccato sul mutex' });
      S(2, 'L’esito', 'P attende un posto che soltanto C può liberare, e C attende un mutex che soltanto P può rilasciare. Nessuno dei due compirà l’operazione attesa dall’altro: si tratta di un deadlock, e la cella resta piena indefinitamente.', { cella: true, vuoti: 0, pieni: 0, P: 'bloccato con il mutex', C: 'bloccato sul mutex', mutex: 'P', dip: 2, acc: 'PC' }, { esito: ['P e C bloccati per sempre', 'no'] });
    } else if (vm) {
      S(1, 'P · down(vuoti)', 'P richiede un posto libero. Il semaforo vuoti vale 1 e scende a 0: P prosegue.', { cella: false, vuoti: 0, pieni: 0, P: 'ha superato la down', acc: 'Pv' }, { calc: 'vuoti 1 → 0', chiedi: { d: 'Il semaforo vuoti valeva 1. Questa down ha bloccato P?', o: ['No, P decrementa il semaforo e prosegue', 'Sì'], g: 0, no: 'Una down blocca soltanto quando il valore del semaforo è zero.' } });
      S(1, 'P · lock, scrittura, unlock', 'P acquisisce il mutex, scrive il dato nella cella e rilascia il mutex.', { cella: true, vuoti: 0, pieni: 0, P: 'ha scritto', acc: 'Pkm' }, { calc: 'cella piena' });
      S(1, 'P · up(pieni)', 'P pubblica il dato: il semaforo pieni sale da 0 a 1.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito', acc: 'Pp' }, { calc: 'pieni 0 → 1' });
      S(2, 'L’esito', 'P ha inserito il proprio dato senza alcuna attesa: lo spazio era disponibile, e nessun altro thread richiedeva il mutex.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito' }, { esito: ['P inserisce il dato', 'si'] });
    } else {
      S(1, 'P · lock(mutex)', 'P acquisisce anzitutto il mutex, che è libero.', { cella: false, vuoti: 1, pieni: 0, P: 'ha il mutex', mutex: 'P', acc: 'Pm' }, { calc: 'mutex di P' });
      S(1, 'P · down(vuoti)', 'P richiede un posto libero. Il semaforo vuoti vale 1 e scende a 0: P prosegue, e conserva il mutex.', { cella: false, vuoti: 0, pieni: 0, P: 'ha il mutex e il posto', mutex: 'P', acc: 'Pv' }, { calc: 'vuoti 1 → 0', chiedi: { d: 'Il semaforo vuoti valeva 1. Questa down ha bloccato P?', o: ['No, P decrementa il semaforo e prosegue', 'Sì'], g: 0, no: 'Una down blocca soltanto quando il valore del semaforo è zero.' } });
      S(1, 'P · scrittura, unlock, up(pieni)', 'P scrive il dato nella cella, rilascia il mutex e pubblica il dato.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito', acc: 'Pkp' }, { calc: 'cella piena · pieni 0 → 1' });
      S(2, 'L’esito', 'P ha inserito il proprio dato. L’ordine rischioso è rimasto in questo caso senza conseguenze: lo spazio era disponibile, e la down(vuoti) ha consentito a P di proseguire. Il difetto resta nel programma, e si manifesterà la prima volta che P troverà il buffer pieno.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito' }, { esito: ['P inserisce il dato', 'si'] });
    }
    return T;
  };
  const esito = (p) => (p.buf === 'pieno' && p.ord === 'mv' ? 'no' : 'si');
  const quadro = (pre, s, o) => {
    const el = SL.el, w3 = (o.w - 20) / 3, a = (c) => s.acc.indexOf(c) >= 0;
    const st = (acceso, bloccato) => (bloccato ? 'err' : acceso ? 'att' : 'on');
    return [
      el.box(pre + 'P', o.x, o.y, w3, 54, 'produttore P', s.P, st(a('P'), s.P.indexOf('bloccato') === 0 && s.dip === 2), { cls: 'stretta' }),
      el.box(pre + 'k', o.x + w3 + 10, o.y, w3, 54, 'cella del buffer', s.cella ? 'dato' : 'vuota', st(a('k'), false), { cls: 'stretta' }),
      el.box(pre + 'C', o.x + 2 * (w3 + 10), o.y, w3, 54, 'consumatore C', s.C, st(a('C'), s.C.indexOf('bloccato') === 0), { cls: 'stretta' }),
      el.box(pre + 'v', o.x, o.y + 64, w3, 54, 'vuoti · semaforo', String(s.vuoti), st(a('v'), false), { cls: 'stretta' }),
      el.box(pre + 'm', o.x + w3 + 10, o.y + 64, w3, 54, 'mutex', s.mutex ? 'di ' + s.mutex : 'libero', st(a('m'), false), { cls: 'stretta' }),
      el.box(pre + 'p', o.x + 2 * (w3 + 10), o.y + 64, w3, 54, 'pieni · semaforo', String(s.pieni), st(a('p'), false), { cls: 'stretta' }),
      el.box(pre + 'd', o.x, o.y + 128, o.w, 54, 'attese in corso', s.dip === 0 ? 'nessuna attesa' : s.dip === 1 ? 'P attende una up di C' : 'P attende una up di C · C attende il mutex di P', s.dip === 2 ? 'err' : s.dip === 1 ? 'zero' : '', { cls: 'stretta' })
    ];
  };
  return { traccia, esito, quadro };
})();
SL.registra('5.6.2', {
  titolo: 'L’ordine di acquisizione nella dimostrazione di correttezza',
  obiettivo: 'Obiettivo: spiegare per quale ragione il produttore esegue prima la down sul semaforo vuoti e in seguito richiede il mutex, e riconoscere il deadlock prodotto dall’ordine inverso.',
  concetti: [['lucchetto', 'Due acquisizioni, e un ordine'], ['stallo', 'Due attese reciproche'], ['semaforo', 'Il thread in attesa lascia libero il mutex']],
  filigrana: ['lucchetto', 'stallo', 'semaforo'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 5.6.1', t: 'vuoti e pieni', d: 'Due semafori: vuoti conta i posti liberi, pieni conta i dati pubblicati.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.5.5', t: 'Il proprietario del lock', d: 'Soltanto il thread che possiede un lock può rilasciarlo.' },
      { sim: 'coda', da: 'Dall’unità 5.5.6', t: 'La up con un thread in coda', d: 'Il primo thread in attesa è risvegliato e torna pronto, e il valore resta invariato.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread possiede un mutex ed è bloccato da una down su un semaforo a zero. Che cosa accade al mutex?', o: [
      { t: 'Resta in suo possesso fino al rilascio', ok: true, fb: 'Il blocco su un semaforo lascia invariati i lock già posseduti.' },
      { t: 'È rilasciato automaticamente', fb: 'Nessuna entità rilascia un mutex in luogo del proprietario.' },
      { t: 'È trasferito al primo thread in coda', fb: 'Un mutex cambia proprietario soltanto dopo un rilascio esplicito.' }
    ] }
  },
  idea: {
    titolo: 'Il thread in attesa non deve ostacolare il thread che può sbloccarlo',
    termini: ['deadlock'],
    testo: [
      'Nell’unità precedente il produttore eseguiva due acquisizioni: un posto libero, con down(vuoti), e il mutex che protegge il buffer. L’ordine era stato adottato senza discussione. L’ordine è tuttavia rilevante, e per mostrarlo è sufficiente il buffer più piccolo possibile: una sola cella, già piena.',
      'Si consideri anzitutto l’ordine adottato finora. Il produttore P esegue down(vuoti). I posti liberi sono zero, e P è sospeso. Il mutex è rimasto libero, poiché P doveva ancora richiederlo. Il consumatore C può quindi acquisirlo, prelevare il dato, rilasciarlo ed eseguire up(vuoti). Tale up risveglia P: il prelievo di C riporta P in esecuzione.',
      'Si invertano ora le due righe del produttore: prima lock(mutex), poi down(vuoti). P ottiene il mutex e immediatamente dopo si blocca su vuoti. Un thread bloccato conserva i lock che possiede, e quindi il mutex resta in possesso di P. C ha superato la down su pieni, e per prelevare gli occorre il mutex: lo richiede, e si blocca a sua volta.',
      { fig: 'scena', w: 720, h: 190, titolo: 'P ha acquisito il mutex prima di richiedere spazio', nota: 'La cella resta piena: l’unico thread in grado di svuotarla attende il mutex del thread che ne attende lo svuotamento.', els: SL.unita562.quadro('g', SL.unita562.traccia({ buf: 'pieno', ord: 'mv' })[4], { x: 10, y: 4, w: 700 }) },
      'In questa condizione P attende un posto libero, che soltanto C può creare, e C attende il mutex, che soltanto P può rilasciare. Ciascuno dei due attende un’azione dell’altro, e nessuno dei due la compirà. Tale situazione prende il nome di [[deadlock]]. Una proprietà la distingue da un rallentamento: un’attesa più lunga è inutile, poiché nessun evento futuro può risolverla.',
      'La regola che ne deriva vale anche al di fuori di questo esempio. Un thread che sta per porsi in attesa di un evento deve lasciare libere tutte le risorse necessarie al thread che produce quell’evento. Nel buffer limitato la regola diviene un ordine preciso: prima il semaforo, su cui il blocco può durare a lungo, e in seguito il mutex, che è conservato per poche istruzioni. Resta un’insidia: con il buffer vuoto l’ordine errato produce il risultato corretto, poiché la down(vuoti) trova il semaforo a 1 e consente a P di proseguire. Il difetto resta nascosto fino al momento in cui il buffer si riempie.'
    ]
  },
  esperimento: {
    faremo: [
      'Si considerino un buffer con una sola cella, un produttore P e un consumatore C. I controlli fissano lo stato iniziale della cella, piena o vuota, e l’ordine in cui P esegue le due acquisizioni.',
      'L’esperimento segue lo stato dei due thread, i due semafori e il proprietario del mutex, e in basso registra le attese fra i thread. Delle quattro combinazioni, una sola conduce al blocco.'
    ],
    vedrai: [
      ['thread', 'I due thread e la cella', 'In alto: lo stato di P, il contenuto della cella e lo stato di C.'],
      ['semaforo', 'Semafori e mutex', 'Al centro: i valori di vuoti e pieni, e il proprietario del mutex.'],
      ['stallo', 'Le attese', 'In basso: le attese fra i thread. Due attese reciproche sono un deadlock.']
    ]
  },
  lab: {
    titolo: 'Una cella, due ordini di acquisizione',
    scena: { w: 860, h: 194 },
    atti: ['L’inizio', 'Le operazioni', 'L’esito'],
    controlli: [
      { id: 'buf', tipo: 'scelta', eti: 'Stato iniziale della cella', opzioni: [['pieno', 'piena'], ['vuoto', 'vuota']], valore: 'pieno' },
      { id: 'ord', tipo: 'scelta', eti: 'Ordine di P', opzioni: [['vm', 'down(vuoti), poi lock(mutex)'], ['mv', 'lock(mutex), poi down(vuoti)']], valore: 'mv' }
    ],
    nota: 'Il numero dei passi dipende dal caso. Quando la cella è piena, C interviene dopo la prima attesa di P.',
    previsione: {
      domanda: (p) => 'Il buffer ha una sola cella, ' + (p.buf === 'pieno' ? 'piena' : 'vuota') + '. Il produttore P esegue ' + (p.ord === 'vm' ? 'down(vuoti) e quindi lock(mutex)' : 'lock(mutex) e quindi down(vuoti)') + '. Il consumatore C è pronto a prelevare. P riesce a inserire il suo dato?',
      opzioni: () => [['si', 'Sì'], ['no', 'No, P e C restano bloccati indefinitamente']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava «' + (pred === 'si' ? 'sì' : 'no') + '». ' + (esito === 'si' ? 'P inserisce il dato. ' : 'P e C restano bloccati. ') + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'no' ? 'P si è bloccato su vuoti in possesso del mutex, e C, l’unico in grado di liberare un posto, si è bloccato su quel mutex.' : p.buf === 'vuoto' ? 'Con la cella vuota la down(vuoti) trova il semaforo a 1, e nessun thread resta in attesa in possesso di un lock.' : 'P si è bloccato su vuoti senza possedere il mutex, e C ha potuto prelevare e sbloccarlo.'),
    costruisci(p) {
      const U = SL.unita562, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Vuoti', String(s.vuoti), 'a'], ['Mutex', s.mutex ? 'di ' + s.mutex : 'libero'], ['Pieni', String(s.pieni), 'c']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Prima il semaforo, poi il mutex: down(vuoti) e dopo lock(mutex) per il produttore, down(pieni) e dopo lock(mutex) per il consumatore.',
      'Un thread che sta per porsi in attesa di un evento lascia libere tutte le risorse necessarie al thread che lo produce.'
    ],
    errori: [
      ['Richiedere il mutex prima della down sul semaforo.', 'Se il semaforo vale zero, il thread si blocca in possesso del mutex, e arresta anche il thread che poteva sbloccarlo.'],
      ['Considerare corretto un programma che ha sempre funzionato.', 'Con il buffer mai pieno l’ordine errato resta senza conseguenze. Il deadlock compare alla prima attesa.'],
      ['Attendere che un deadlock si risolva.', 'Nessun evento futuro può sbloccare due thread che si attendono a vicenda.']
    ],
    saFare: ['Scrivere le acquisizioni di produttore e consumatore nell’ordine corretto.', 'Riconoscere due attese reciproche in una traccia.', 'Spiegare per quale ragione il difetto può restare nascosto.'],
    esercizi: [
      { d: 'Un produttore esegue lock(mutex) e quindi down(vuoti), con il buffer pieno. Per quale ragione il consumatore non riesce a liberare un posto?', guida: 'Si scelga la risposta.', o: [
        { t: 'Per prelevare gli occorre il mutex, posseduto dal produttore', ok: true, fb: 'Il consumatore supera la down su pieni, e si blocca sul mutex.' },
        { t: 'Il semaforo pieni vale zero', fb: 'Il buffer è pieno: il semaforo pieni è maggiore di zero.' },
        { t: 'La up(vuoti) è vietata a buffer pieno', fb: 'La up è sempre ammessa. Il consumatore si blocca in precedenza, sul mutex.' }] },
      { d: 'Un buffer ha 3 posti, tutti pieni. Quattro produttori, che seguono l’ordine corretto, richiedono spazio in successione. Nessun consumatore è ancora intervenuto. Quanti produttori possiedono il mutex durante l’attesa?', segnaposto: 'Un numero', giuste: ['0', 'zero', 'nessuno'],
        ok: 'Nell’ordine corretto un thread bloccato su vuoti deve ancora richiedere il mutex.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro sono i produttori bloccati su vuoti. Nell’ordine corretto la down(vuoti) precede il mutex.' },
          { se: ['1', 'uno'], msg: 'Nessun produttore ha superato la down(vuoti), e il mutex è richiesto in seguito.' },
          { se: ['3', 'tre'], msg: 'Tre sono i posti del buffer. La domanda riguarda il mutex.' }
        ],
        altro: 'Il numero è diverso. Si individui la riga del produttore in cui si trovano i quattro thread.',
        indizi: ['Il buffer è pieno: vuoti vale 0.', 'Tutti e quattro sono bloccati sulla down(vuoti).', 'Il lock(mutex) segue: nessuno lo ha eseguito.'],
        svolgimento: ['Produttori bloccati su vuoti: 4.', 'Produttori giunti al mutex: 0.'] },
      { d: 'Un buffer ha una cella, piena. Due produttori, P1 e P2, eseguono down(vuoti) e si bloccano. Un consumatore completa un prelievo, compresa la sua up(vuoti). Quanti produttori restano bloccati?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'La up risveglia P1, e P2 resta in coda.',
        diagnosi: [
          { se: ['0', 'zero', 'nessuno'], msg: 'Una up risveglia un solo thread, e i produttori in coda sono due.' },
          { se: ['2', 'due'], msg: 'La up risveglia il primo in coda, che torna pronto.' }
        ],
        altro: 'Il numero è diverso. Si contino le up eseguite dal consumatore.',
        indizi: ['In coda su vuoti sono presenti due produttori.', 'Un prelievo si conclude con una up(vuoti), che risveglia un produttore.', '2 − 1 = 1.'],
        svolgimento: ['In coda: P1 e P2.', 'La up risveglia P1.', 'Resta bloccato: P2.'] }
    ],
    sfida: ['cslez5_6_02_classical_sync', 'Sequenza delle operazioni sul buffer']
  }
});
