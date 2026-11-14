'use strict';
SL.unita562 = (() => {
  // Ogni stato: cella piena?, vuoti, pieni, proprietario del mutex, stato di P e di C, dipendenze, riquadri accesi
  const traccia = (p) => {
    const pieno = p.buf === 'pieno', vm = p.ord === 'vm', T = [];
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, dip: 0, acc: '', P: 'pronto', C: 'pronto', mutex: '' }, s, extra ? { extra } : {}));
    S(0, 'La situazione iniziale', 'Il buffer ha una sola cella, ' + (pieno ? 'ed è piena. Il semaforo vuoti vale 0 e il semaforo pieni vale 1.' : 'ed è vuota. Il semaforo vuoti vale 1 e il semaforo pieni vale 0.') + ' Il mutex è libero. Il produttore P vuole inserire un dato, e il consumatore C è pronto a prelevare.', { cella: pieno, vuoti: pieno ? 0 : 1, pieni: pieno ? 1 : 0 });
    if (pieno && vm) {
      S(1, 'P · wait(vuoti)', 'P chiede per prima cosa un permesso di spazio. Il semaforo vuoti vale 0, e P viene bloccato. In questo momento P è privo di lock: il mutex resta libero.', { cella: true, vuoti: 0, pieni: 1, P: 'bloccato su vuoti', dip: 1, acc: 'Pv' }, { calc: 'P bloccato · mutex libero', chiedi: { d: 'P è bloccato. Chi può compiere l’operazione che lo sblocca?', o: ['Il consumatore C, con signal(vuoti)', 'P stesso, riprovando', 'Lo scheduler, allo scadere del quanto'], g: 0, no: 'Un permesso su vuoti nasce soltanto da un prelievo, e i prelievi li fa C.' } });
      S(1, 'C · wait(pieni)', 'C chiede un dato. Il semaforo pieni vale 1 e scende a 0: C ha il suo permesso, e prosegue.', { cella: true, vuoti: 0, pieni: 0, P: 'bloccato su vuoti', C: 'ha un permesso', dip: 1, acc: 'Cp' }, { calc: 'pieni 1 → 0' });
      S(1, 'C · lock, prelievo, unlock', 'C acquisisce il mutex, che è libero, toglie il dato dalla cella e rilascia il mutex. La cella è vuota.', { cella: false, vuoti: 0, pieni: 0, P: 'bloccato su vuoti', C: 'ha prelevato', dip: 1, acc: 'Ckm' }, { calc: 'cella vuota' });
      S(1, 'C · signal(vuoti)', 'C restituisce un permesso di spazio. In coda su vuoti c’è P, che lo riceve direttamente e torna pronto. È il lavoro di C ad avere sbloccato P.', { cella: false, vuoti: 0, pieni: 0, P: 'pronto · ha un permesso', C: 'ha finito', acc: 'Pv' }, { calc: 'il permesso passa a P' });
      S(1, 'P · lock, scrittura, unlock, signal(pieni)', 'P acquisisce il mutex, scrive il dato nella cella, rilascia il mutex e pubblica il dato con signal(pieni).', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito', C: 'ha finito', acc: 'Pkp' }, { calc: 'cella piena · pieni 0 → 1' });
      S(2, 'L’esito', 'P ha inserito il suo dato. Mentre aspettava spazio aveva lasciato libero il mutex, e C ha potuto fare il prelievo che gli ha liberato il posto.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito', C: 'ha finito' }, { esito: ['P inserisce il dato', 'si'] });
    } else if (pieno) {
      S(1, 'P · lock(mutex)', 'P acquisisce per prima cosa il mutex, che è libero.', { cella: true, vuoti: 0, pieni: 1, P: 'ha il mutex', mutex: 'P', acc: 'Pm' }, { calc: 'mutex di P' });
      S(1, 'P · wait(vuoti)', 'P chiede un permesso di spazio. Il semaforo vuoti vale 0, e P viene bloccato. Il mutex resta suo: un thread bloccato conserva i lock che possiede.', { cella: true, vuoti: 0, pieni: 1, P: 'bloccato con il mutex', mutex: 'P', dip: 1, acc: 'Pv' }, { calc: 'P bloccato · mutex di P', chiedi: { d: 'P è bloccato. Chi può compiere l’operazione che lo sblocca?', o: ['Il consumatore C, con signal(vuoti)', 'P stesso, riprovando', 'Lo scheduler, allo scadere del quanto'], g: 0, no: 'Un permesso su vuoti nasce soltanto da un prelievo, e i prelievi li fa C.' } });
      S(1, 'C · wait(pieni)', 'C chiede un dato. Il semaforo pieni vale 1 e scende a 0: C ha il suo permesso, e prosegue.', { cella: true, vuoti: 0, pieni: 0, P: 'bloccato con il mutex', C: 'ha un permesso', mutex: 'P', dip: 1, acc: 'Cp' }, { calc: 'pieni 1 → 0' });
      S(1, 'C · lock(mutex)', 'Per prelevare, C chiede il mutex. Il mutex appartiene a P, e C viene bloccato.', { cella: true, vuoti: 0, pieni: 0, P: 'bloccato con il mutex', C: 'bloccato sul mutex', mutex: 'P', dip: 2, acc: 'Cm' }, { calc: 'C bloccato sul mutex' });
      S(2, 'L’esito', 'P aspetta un posto che soltanto C può liberare. C aspetta un mutex che soltanto P può rilasciare. Nessuno dei due compirà l’operazione attesa dall’altro: è un deadlock, e la cella resta piena per sempre.', { cella: true, vuoti: 0, pieni: 0, P: 'bloccato con il mutex', C: 'bloccato sul mutex', mutex: 'P', dip: 2, acc: 'PC' }, { esito: ['P e C bloccati per sempre', 'no'] });
    } else if (vm) {
      S(1, 'P · wait(vuoti)', 'P chiede un permesso di spazio. Il semaforo vuoti vale 1 e scende a 0: P prosegue.', { cella: false, vuoti: 0, pieni: 0, P: 'ha un permesso', acc: 'Pv' }, { calc: 'vuoti 1 → 0', chiedi: { d: 'Il semaforo vuoti valeva 1. Questa wait ha bloccato P?', o: ['No: P ha preso il permesso e prosegue', 'Sì'], g: 0, no: 'Una wait blocca soltanto quando il contatore è a zero.' } });
      S(1, 'P · lock, scrittura, unlock', 'P acquisisce il mutex, scrive il dato nella cella e rilascia il mutex.', { cella: true, vuoti: 0, pieni: 0, P: 'ha scritto', acc: 'Pkm' }, { calc: 'cella piena' });
      S(1, 'P · signal(pieni)', 'P pubblica il dato: il semaforo pieni sale da 0 a 1.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito', acc: 'Pp' }, { calc: 'pieni 0 → 1' });
      S(2, 'L’esito', 'P ha inserito il suo dato senza alcuna attesa: c’era spazio, e nessun altro thread chiedeva il mutex.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito' }, { esito: ['P inserisce il dato', 'si'] });
    } else {
      S(1, 'P · lock(mutex)', 'P acquisisce per prima cosa il mutex, che è libero.', { cella: false, vuoti: 1, pieni: 0, P: 'ha il mutex', mutex: 'P', acc: 'Pm' }, { calc: 'mutex di P' });
      S(1, 'P · wait(vuoti)', 'P chiede un permesso di spazio. Il semaforo vuoti vale 1 e scende a 0: P prosegue, e continua a tenere il mutex.', { cella: false, vuoti: 0, pieni: 0, P: 'ha mutex e permesso', mutex: 'P', acc: 'Pv' }, { calc: 'vuoti 1 → 0', chiedi: { d: 'Il semaforo vuoti valeva 1. Questa wait ha bloccato P?', o: ['No: P ha preso il permesso e prosegue', 'Sì'], g: 0, no: 'Una wait blocca soltanto quando il contatore è a zero.' } });
      S(1, 'P · scrittura, unlock, signal(pieni)', 'P scrive il dato nella cella, rilascia il mutex e pubblica il dato.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito', acc: 'Pkp' }, { calc: 'cella piena · pieni 0 → 1' });
      S(2, 'L’esito', 'P ha inserito il suo dato. L’ordine rischioso questa volta è passato inosservato: c’era spazio, e la wait(vuoti) ha lasciato proseguire P. Il difetto resta nel programma, e si manifesterà la prima volta che P troverà il buffer pieno.', { cella: true, vuoti: 0, pieni: 1, P: 'ha inserito' }, { esito: ['P inserisce il dato', 'si'] });
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
      el.box(pre + 'd', o.x, o.y + 128, o.w, 54, 'chi aspetta chi', s.dip === 0 ? 'nessuna attesa' : s.dip === 1 ? 'P aspetta una signal di C' : 'P aspetta una signal di C · C aspetta il mutex di P', s.dip === 2 ? 'err' : s.dip === 1 ? 'zero' : '', { cls: 'stretta' })
    ];
  };
  return { traccia, esito, quadro };
})();
SL.registra('5.6.2', {
  titolo: 'L’ordine di acquisizione nella dimostrazione di correttezza',
  obiettivo: 'Obiettivo: spiegare perché il produttore chiede prima il permesso di spazio e dopo il mutex, e riconoscere il deadlock che nasce dall’ordine inverso.',
  concetti: [['lucchetto', 'Due acquisizioni, e un ordine'], ['stallo', 'Due attese che si chiudono a cerchio'], ['semaforo', 'Chi aspetta lascia libero il mutex']],
  filigrana: ['lucchetto', 'stallo', 'semaforo'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 5.6.1', t: 'vuoti e pieni', d: 'Due semafori: vuoti conta i posti liberi, pieni conta i dati pubblicati.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.5.5', t: 'Il proprietario del lock', d: 'Soltanto il thread che possiede un lock può rilasciarlo.' },
      { sim: 'coda', da: 'Dall’unità 5.5.6', t: 'La signal con qualcuno in coda', d: 'Il permesso passa direttamente al primo thread in attesa, che torna pronto.' }
    ],
    domanda: { d: 'Prima di proseguire: un thread possiede un mutex e viene bloccato da una wait su un semaforo a zero. Che cosa accade al mutex?', o: [
      { t: 'Resta suo fino a quando lo rilascerà', ok: true, fb: 'Bloccarsi su un semaforo lascia intatti i lock già posseduti.' },
      { t: 'Viene rilasciato automaticamente', fb: 'Nessuno rilascia un mutex al posto del proprietario.' },
      { t: 'Passa al primo thread in coda', fb: 'Un mutex cambia proprietario soltanto dopo un rilascio esplicito.' }
    ] }
  },
  idea: {
    titolo: 'Chi aspetta deve lasciare la strada a chi può sbloccarlo',
    termini: ['deadlock'],
    testo: [
      'Nell’unità precedente il produttore eseguiva due acquisizioni: un permesso di spazio, con wait(vuoti), e il mutex che protegge il buffer. Le abbiamo messe in quest’ordine senza discuterlo. L’ordine però conta, e per vederlo basta il buffer più piccolo possibile: una sola cella, già piena.',
      'Cominciamo dall’ordine usato finora. Il produttore P esegue wait(vuoti). I posti liberi sono zero, e P viene sospeso. Il mutex è rimasto libero, perché P doveva ancora chiederlo. Il consumatore C può quindi acquisirlo, togliere il dato, rilasciarlo ed eseguire signal(vuoti). Quella signal consegna a P il permesso che gli mancava. È il lavoro di C a rimettere in moto P.',
      'Invertiamo ora le due righe del produttore: prima lock(mutex), poi wait(vuoti). P ottiene il mutex e subito dopo si blocca su vuoti. Un thread bloccato conserva i lock che possiede, e quindi il mutex resta di P. C ha il suo permesso su pieni, e per prelevare gli serve il mutex. Lo chiede, e si blocca a sua volta.',
      { fig: 'scena', w: 720, h: 190, titolo: 'P ha preso il mutex prima di chiedere spazio', nota: 'La cella resta piena: l’unico thread capace di svuotarla aspetta il mutex di chi ne attende lo svuotamento.', els: SL.unita562.quadro('g', SL.unita562.traccia({ buf: 'pieno', ord: 'mv' })[4], { x: 10, y: 4, w: 700 }) },
      'A questo punto P aspetta un posto libero, che soltanto C può creare. C aspetta il mutex, che soltanto P può rilasciare. Ciascuno dei due attende un’azione dell’altro, e nessuno dei due la compirà. Questa situazione si chiama [[deadlock]]. Ha una proprietà che la distingue da un rallentamento: aspettare più a lungo è inutile, perché nessun evento futuro può scioglierla.',
      'La regola che se ne ricava vale anche fuori da questo esempio. Quando un thread sta per mettersi in attesa di un evento, deve lasciare libero tutto ciò che serve a chi quell’evento lo produce. Nel buffer limitato la regola diventa un ordine preciso: prima il semaforo, su cui si può restare bloccati a lungo, e dopo il mutex, che si tiene per poche istruzioni. C’è poi un’insidia. Con il buffer vuoto l’ordine sbagliato funziona, perché la wait(vuoti) trova un permesso e lascia proseguire P. Il difetto resta nascosto fino al giorno in cui il buffer si riempie.'
    ]
  },
  esperimento: {
    faremo: [
      'Un buffer con una sola cella, un produttore P e un consumatore C. Sceglierai se la cella parte piena o vuota, e in quale ordine P esegue le sue due acquisizioni.',
      'Seguiremo lo stato dei due thread, i due semafori e il proprietario del mutex. In basso terremo il conto di chi aspetta chi. Prova tutte e quattro le combinazioni: una sola si blocca.'
    ],
    vedrai: [
      ['thread', 'I due thread e la cella', 'In alto: lo stato di P, il contenuto della cella e lo stato di C.'],
      ['semaforo', 'Semafori e mutex', 'Al centro: i permessi di vuoti e pieni, e il proprietario del mutex.'],
      ['stallo', 'Le attese', 'In basso: chi aspetta un’azione di chi. Due attese incrociate sono un deadlock.']
    ]
  },
  lab: {
    titolo: 'Una cella, due ordini di acquisizione',
    scena: { w: 860, h: 194 },
    atti: ['L’inizio', 'Le operazioni', 'L’esito'],
    controlli: [
      { id: 'buf', tipo: 'scelta', eti: 'La cella all’inizio', opzioni: [['pieno', 'piena'], ['vuoto', 'vuota']], valore: 'pieno' },
      { id: 'ord', tipo: 'scelta', eti: 'Ordine di P', opzioni: [['vm', 'wait(vuoti), poi lock(mutex)'], ['mv', 'lock(mutex), poi wait(vuoti)']], valore: 'mv' }
    ],
    nota: 'Il numero dei passi dipende dal caso. Quando la cella è piena, C interviene dopo la prima attesa di P.',
    previsione: {
      domanda: (p) => 'Il buffer ha una sola cella, ' + (p.buf === 'pieno' ? 'piena' : 'vuota') + '. Il produttore P esegue ' + (p.ord === 'vm' ? 'wait(vuoti) e poi lock(mutex)' : 'lock(mutex) e poi wait(vuoti)') + '. Il consumatore C è pronto a prelevare. P riesce a inserire il suo dato?',
      opzioni: () => [['si', 'Sì'], ['no', 'No: P e C restano bloccati per sempre']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava «' + (pred === 'si' ? 'sì' : 'no') + '». ' + (esito === 'si' ? 'P inserisce il dato. ' : 'P e C restano bloccati. ') + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'no' ? 'P si è bloccato su vuoti tenendo il mutex, e C, l’unico che poteva liberare un posto, si è fermato davanti a quel mutex.' : p.buf === 'vuoto' ? 'Con la cella vuota la wait(vuoti) trova un permesso, e nessuno resta in attesa tenendo un lock.' : 'P si è bloccato su vuoti senza possedere il mutex, e C ha potuto prelevare e sbloccarlo.'),
    costruisci(p) {
      const U = SL.unita562, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Vuoti', String(s.vuoti), 'a'], ['Mutex', s.mutex ? 'di ' + s.mutex : 'libero'], ['Pieni', String(s.pieni), 'c']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Prima il semaforo, poi il mutex: wait(vuoti) e dopo lock(mutex) per il produttore, wait(pieni) e dopo lock(mutex) per il consumatore.',
      'Chi sta per mettersi in attesa di un evento lascia libero tutto ciò che serve a chi quell’evento lo produce.'
    ],
    errori: [
      ['Chiedere il mutex prima del permesso.', 'Se il permesso manca, il thread si blocca tenendo il mutex, e ferma anche chi poteva sbloccarlo.'],
      ['Fidarsi di un programma che ha sempre funzionato.', 'Con il buffer mai pieno l’ordine sbagliato passa inosservato. Il deadlock compare alla prima attesa.'],
      ['Aspettare che un deadlock si risolva.', 'Nessun evento futuro può sbloccare due thread che si aspettano a vicenda.']
    ],
    saFare: ['Scrivere le acquisizioni di produttore e consumatore nell’ordine corretto.', 'Riconoscere due attese incrociate in una traccia.', 'Spiegare perché il difetto può restare nascosto.'],
    esercizi: [
      { d: 'Un produttore esegue lock(mutex) e poi wait(vuoti), con il buffer pieno. Perché il consumatore non riesce a liberare un posto?', guida: 'Si scelga la risposta.', o: [
        { t: 'Per prelevare gli serve il mutex, che è del produttore', ok: true, fb: 'Il consumatore ha il permesso su pieni, e si ferma davanti al mutex.' },
        { t: 'Gli manca un permesso su pieni', fb: 'Il buffer è pieno: i permessi su pieni ci sono.' },
        { t: 'La signal(vuoti) è vietata a buffer pieno', fb: 'La signal è sempre ammessa. Il consumatore si ferma prima, davanti al mutex.' }] },
      { d: 'Un buffer ha 3 posti, tutti pieni. Quattro produttori, che seguono l’ordine corretto, chiedono spazio uno dopo l’altro. Nessun consumatore è ancora intervenuto. Quanti produttori possiedono il mutex mentre aspettano?', segnaposto: 'Un numero', giuste: ['0', 'zero', 'nessuno'],
        ok: 'Nell’ordine corretto chi è bloccato su vuoti deve ancora chiedere il mutex.',
        diagnosi: [
          { se: ['4', 'quattro'], msg: 'Quattro sono i produttori bloccati su vuoti. Nell’ordine corretto la wait(vuoti) viene prima del mutex.' },
          { se: ['1', 'uno'], msg: 'Nessun produttore ha superato la wait(vuoti), e il mutex si chiede dopo.' },
          { se: ['3', 'tre'], msg: 'Tre sono i posti del buffer. La domanda riguarda il mutex.' }
        ],
        altro: 'Il numero è diverso. Guarda a quale riga del produttore si trovano i quattro thread.',
        indizi: ['Il buffer è pieno: vuoti vale 0.', 'Tutti e quattro sono fermi sulla wait(vuoti).', 'Il lock(mutex) viene dopo: nessuno lo ha eseguito.'],
        svolgimento: ['Produttori bloccati su vuoti: 4.', 'Produttori arrivati al mutex: 0.'] },
      { d: 'Un buffer ha una cella, piena. Due produttori, P1 e P2, eseguono wait(vuoti) e si bloccano. Un consumatore completa un prelievo, compresa la sua signal(vuoti). Quanti produttori restano bloccati?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: 'La signal consegna un permesso a P1, e P2 resta in coda.',
        diagnosi: [
          { se: ['0', 'zero', 'nessuno'], msg: 'Una signal consegna un solo permesso, e i produttori in coda sono due.' },
          { se: ['2', 'due'], msg: 'La signal consegna il permesso al primo in coda, che torna pronto.' }
        ],
        altro: 'Il numero è diverso. Conta i permessi restituiti dal consumatore.',
        indizi: ['In coda su vuoti ci sono due produttori.', 'Un prelievo restituisce un permesso.', '2 − 1 = 1.'],
        svolgimento: ['In coda: P1 e P2.', 'La signal risveglia P1.', 'Resta bloccato: P2.'] }
    ],
    sfida: ['cslez5_6_02_classical_sync', 'Sequenza delle operazioni sul buffer']
  }
});
