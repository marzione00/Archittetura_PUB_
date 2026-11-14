'use strict';
SL.unita553 = (() => {
  const letto = (p) => (p.leggi === 'due' ? 2 * p.n : 2 * p.n - 1);
  // rilasci alternati A, B, A, B…; «fatti» rilasci avvenuti
  const quadro = (pre, p, fatti, f, o) => {
    const el = SL.el, els = [], tot = 2 * p.n, w4 = (o.w - 30) / 4, a = Math.ceil(fatti / 2), b = Math.floor(fatti / 2);
    els.push(el.nota(pre + 't0', o.x, o.y, 'RILASCI DEL MUTEX · il valore lasciato nel contatore', 'mono'));
    for (let k = 0; k < tot; k++) els.push(el.cella(pre + 'r' + k, o.x + k * (o.wc + 4), o.y + 42, o.wc, 34, k < fatti ? String(k + 1) : '', k < fatti ? (k === fatti - 1 && f === 1 ? 'att' : 'on') : '', { so: k < fatti ? (k % 2 === 0 ? 'A' : 'B') : '', piccola: true }));
    [['lavoratore A', a === p.n ? (f >= 2 ? 'atteso' : 'terminato') : a + ' di ' + p.n, f === 2], ['lavoratore B', b === p.n ? (f >= 3 && p.leggi === 'due' ? 'atteso' : 'terminato') : b + ' di ' + p.n, f === 3 && p.leggi === 'due'], ['contatore', String(fatti), f === 1], ['il creatore legge', f >= 4 ? String(fatti) : '·', f >= 4]].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (w4 + 10), o.y + 96, w4, 54, r[0], r[1], r[2] ? 'att' : 'on', { cls: 'stretta' })));
    return els;
  };
  return { letto, quadro };
})();
SL.registra('5.5.3', {
  titolo: 'Un contatore completo protetto da mutex',
  obiettivo: 'Obiettivo: mettere insieme le due garanzie che servono a un conteggio corretto: nessun incremento perso, e un totale letto soltanto a lavori finiti.',
  concetti: [['lucchetto', 'Il mutex conserva ogni incremento'], ['thread', 'Il join dice quando hanno finito'], ['bilancio', 'Due garanzie distinte']],
  filigrana: ['lucchetto', 'thread', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'lucchetto', da: 'Dall’unità 5.5.2', t: 'La sezione critica', d: 'Lettura, calcolo e scrittura sotto lo stesso mutex.' },
      { sim: 'thread', da: 'Dall’unità 5.4.4', t: 'pthread_join', d: 'Attende che un thread creato abbia terminato.' },
      { sim: 'conflitto', da: 'Dall’unità 5.5.1', t: 'La corsa critica', d: 'Un risultato che dipende da chi arriva prima.' }
    ],
    domanda: { d: 'Prima di proseguire: due lavoratori devono fare 3 incrementi ciascuno su un contatore che parte da 0. Se nessun incremento va perso, quanto vale alla fine?', o: [
      { t: '6', ok: true, fb: '2 × 3 = 6.' },
      { t: '3', fb: 'I lavoratori sono due, e ciascuno fa 3 incrementi.' },
      { t: '5', fb: 'Senza incrementi persi il totale è 2 × 3.' }
    ] }
  },
  idea: {
    titolo: 'Contare bene, e leggere al momento giusto',
    termini: ['contesa del lock'],
    testo: [
      'Mettiamo insieme i pezzi in un programma completo. Un thread creatore avvia due lavoratori, A e B. Ciascuno deve aggiungere 1 a un contatore comune per un certo numero di volte, e alla fine il creatore vuole leggere il totale. I problemi da risolvere sono due, e sono indipendenti.',
      'Il primo è quello delle unità precedenti: nessun incremento deve andare perso. Lo risolve un mutex, che chiamiamo M. Ogni lavoratore, a ogni giro, acquisisce M, legge il contatore, somma 1, scrive, e rilascia M. Quando entrambi vogliono M nello stesso momento c’è [[contesa del lock|contesa]], e uno dei due aspetta. A ogni rilascio il contatore è cresciuto di 1. L’ordine in cui A e B si alternano è indifferente: se partono da 0 e fanno 3 giri ciascuno, i sei rilasci lasciano nella cella i valori 1, 2, 3, 4, 5 e 6.',
      { fig: 'scena', w: 720, h: 156, titolo: 'Tre incrementi a testa, tutti protetti', nota: 'Ogni casella è un rilascio del mutex, con il valore lasciato e il lavoratore che lo ha scritto.', els: SL.unita553.quadro('g', { n: 3, leggi: 'due' }, 6, 4, { x: 10, y: 0, w: 700, wc: 66 }) },
      'Il secondo problema riguarda il momento della lettura. Se il creatore leggesse il contatore mentre i lavoratori sono ancora all’opera, troverebbe un totale parziale. Il valore sarebbe coerente, perché il mutex lo protegge, e tuttavia non definitivo. Per sapere che i lavoratori hanno finito, il creatore chiama pthread_join per ciascuno dei due. Soltanto dopo entrambe le attese il numero letto è il totale.',
      'Le due garanzie non si sostituiscono. Il mutex senza i join dà un numero corretto in ogni istante, letto forse troppo presto. I join senza il mutex danno un numero letto al momento giusto, con forse qualche incremento perduto. Un programma concorrente corretto nasce spesso così: una garanzia per ogni proprietà, e nessuna lasciata al caso.'
    ]
  },
  esperimento: {
    faremo: [
      'Due lavoratori incrementano un contatore che parte da 0, ogni volta sotto mutex. Sceglierai quanti incrementi fa ciascuno, e quando il creatore legge il totale: dopo avere atteso entrambi, oppure dopo avere atteso soltanto A.',
      'Vedremo i rilasci del mutex uno dopo l’altro, con A e B che si alternano. Poi la lettura del creatore.'
    ],
    vedrai: [
      ['lucchetto', 'I rilasci', 'In alto: una casella per ogni rilascio del mutex, con il valore del contatore e chi lo ha scritto.'],
      ['thread', 'Lavoratori e creatore', 'In basso: gli incrementi fatti da ciascuno, il contatore, e il valore letto dal creatore.']
    ]
  },
  lab: {
    titolo: 'Dal primo incremento al totale',
    scena: { w: 860, h: 156 },
    atti: ['L’avvio', 'Gli incrementi', 'I join', 'La lettura'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Incrementi a testa', opzioni: [[2, '2'], [3, '3'], [5, '5']], valore: 3 },
      { id: 'leggi', tipo: 'scelta', eti: 'Il creatore legge', opzioni: [['due', 'dopo il join di A e di B'], ['uno', 'dopo il solo join di A']], valore: 'due' }
    ],
    nota: 'Il numero dei passi dipende dagli incrementi. A e B si alternano, cominciando da A: è una delle sequenze possibili.',
    previsione: {
      domanda: (p) => 'A e B fanno ' + p.n + ' incrementi ciascuno su un contatore che parte da 0, sempre sotto mutex, alternandosi a partire da A. Il creatore legge il contatore ' + (p.leggi === 'due' ? 'dopo avere atteso entrambi con pthread_join' : 'subito dopo il join di A, quando a B manca ancora un incremento') + '. Quale valore legge?',
      opzioni: (p) => [[p.n, String(p.n)], [2 * p.n - 1, String(2 * p.n - 1)], [2 * p.n, String(2 * p.n)]]
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il creatore legge ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.leggi === 'due' ? 'Dopo i due join tutti i ' + 2 * p.n + ' incrementi sono avvenuti, e il mutex non ne ha perso nessuno.' : 'A ha finito i suoi ' + p.n + ', B ne ha fatti ' + (p.n - 1) + ': il contatore vale ' + (2 * p.n - 1) + ', un totale ancora parziale.'),
    costruisci(p) {
      const U = SL.unita553, passi = [], tot = 2 * p.n, due = p.leggi === 'due', v = U.letto(p);
      const P = (fatti, f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Contatore', String(fatti), 'a'], ['Rilasci', fatti + ' di ' + tot], ['Letto', f >= 4 ? String(fatti) : '·', 'c']], els: U.quadro('q', p, fatti, f, { x: 20, y: 0, w: 820, wc: Math.min(78, Math.floor(820 / tot) - 4) }) }, extra));

      P(0, 0, 0, 'Il creatore avvia i lavoratori', 'Il contatore vale 0. Il creatore crea due thread, A e B, e assegna a ciascuno ' + p.n + ' incrementi. Il mutex M è libero.', {});
      const fino = due ? tot : tot - 1;
      for (let k = 1; k <= fino; k++) { const chi = k % 2 === 1 ? 'A' : 'B'; P(k, 1, 1, 'Rilascio ' + k + ' · ' + chi, chi + ' acquisisce M, legge ' + (k - 1) + ', scrive ' + k + ' e rilascia M.' + (k === 1 ? ' Se B avesse chiesto M in questo intervallo, avrebbe atteso.' : ''), Object.assign({ calc: chi + ': ' + (k - 1) + ' → ' + k }, k === 2 ? { chiedi: { d: 'B ha letto 1 e non 0. Che cosa lo garantisce?', o: ['Il caso', 'Il mutex: B ha potuto leggere soltanto dopo il rilascio di A'], g: 1, no: 'La lettura di B sta dentro la sezione critica, e A era uscito dopo avere scritto 1.' } } : {})); }
      P(fino, 2, 2, 'Il join di A', 'Il creatore chiama pthread_join per A, che ha completato i suoi ' + p.n + ' incrementi. L’attesa termina.', { calc: 'A: ' + p.n + ' di ' + p.n });
      if (due) {
        P(tot, 3, 2, 'Il join di B', 'Il creatore chiama pthread_join anche per B, che ha completato i suoi ' + p.n + '. Ora nessun lavoratore può più modificare il contatore.', { calc: 'B: ' + p.n + ' di ' + p.n });
        P(tot, 4, 3, 'La lettura', 'Il creatore legge ' + tot + ', che è il totale definitivo: ' + tot + ' incrementi richiesti, ' + tot + ' registrati. Il mutex ha garantito il conteggio, i join il momento della lettura.', { calc: '2 × ' + p.n + ' = ' + tot, esito: ['letto ' + tot, 'si'] });
      } else P(tot - 1, 4, 3, 'Una lettura affrettata', 'Il creatore legge subito, senza attendere B, e trova ' + (tot - 1) + '. Il valore è coerente, perché il mutex lo protegge, ma B deve ancora fare l’ultimo incremento. Il totale vero sarà ' + tot + '.', { calc: p.n + ' + ' + (p.n - 1) + ' = ' + (tot - 1), esito: ['letto ' + (tot - 1) + ' · parziale', 'no'] });
      return { passi, esito: v };
    }
  },
  bilancio: {
    regola: [
      'Con l’intero incremento sotto mutex, dopo k rilasci il contatore è cresciuto di k, qualunque sia l’ordine dei lavoratori.',
      'Il totale è definitivo soltanto dopo il join di tutti i lavoratori.'
    ],
    errori: [
      ['Leggere il totale senza attendere i lavoratori.', 'Il valore è coerente e ancora parziale.'],
      ['Contare sull’alternanza regolare dei thread.', 'L’ordine dipende dallo scheduler. La correttezza non deve dipenderne.'],
      ['Distruggere il mutex prima dei join.', 'Un lavoratore ancora attivo proverebbe a usare un mutex che non esiste più.']
    ],
    saFare: ['Calcolare il totale atteso da un gruppo di lavoratori.', 'Distinguere ciò che garantisce il mutex da ciò che garantiscono i join.', 'Riconoscere una lettura prematura.'],
    esercizi: [
      { d: 'Quattro lavoratori fanno 25 incrementi ciascuno su un contatore che parte da 0, tutti sotto lo stesso mutex. Il creatore attende i quattro lavoratori e poi legge. Quale valore trova?', segnaposto: 'Un numero', giuste: ['100', 'cento'],
        ok: '4 × 25 = 100, senza incrementi persi.',
        diagnosi: [
          { se: ['25', 'venticinque'], msg: 'Venticinque sono gli incrementi di un solo lavoratore.' },
          { se: ['99'], msg: 'Dopo i quattro join tutti gli incrementi sono avvenuti.' }
        ],
        altro: 'Il valore è diverso. Si moltiplichino i lavoratori per gli incrementi di ciascuno.',
        indizi: ['Il mutex non lascia perdere incrementi.', 'I join garantiscono che siano tutti avvenuti.', '4 × 25 = 100.'],
        svolgimento: ['Incrementi totali: 4 × 25 = 100.', 'Persi: 0.', 'Valore letto: 100.'] },
      { d: 'Due lavoratori fanno 10 incrementi ciascuno, sotto mutex, su un contatore che parte da 0. Il creatore legge quando il primo ha finito e al secondo mancano 4 incrementi. Quale valore trova?', segnaposto: 'Un numero', giuste: ['16', 'sedici'],
        ok: 'Il primo ne ha fatti 10, il secondo 10 − 4 = 6: in tutto 16.',
        diagnosi: [
          { se: ['20', 'venti'], msg: 'Venti sarà il totale definitivo. Al momento della lettura mancano ancora 4 incrementi.' },
          { se: ['10', 'dieci'], msg: 'Anche il secondo lavoratore ha già fatto una parte dei suoi incrementi: 6.' },
          { se: ['14'], msg: 'Al secondo mancano 4 incrementi su 10: ne ha fatti 6.' }
        ],
        altro: 'Il valore è diverso. Somma gli incrementi già fatti da ciascuno.',
        indizi: ['Primo lavoratore: 10 fatti.', 'Secondo lavoratore: 10 − 4 = 6 fatti.', '10 + 6 = 16.'],
        svolgimento: ['Primo: 10.', 'Secondo: 6.', 'Contatore: 16.'] },
      { d: 'Un programma protegge ogni incremento con un mutex, e il creatore legge il totale senza chiamare pthread_join. Quale difetto ha?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il totale letto può essere parziale', ok: true, fb: 'Il mutex protegge ogni incremento. Nulla assicura che siano già avvenuti tutti.' },
        { t: 'Alcuni incrementi vanno persi', fb: 'Gli incrementi sono protetti dal mutex, e nessuno va perso.' },
        { t: 'Nessuno: il mutex basta', fb: 'Il mutex garantisce il conteggio. Il momento della lettura dipende dai join.' }] }
    ]
  }
});
