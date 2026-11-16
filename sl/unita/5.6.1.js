'use strict';
SL.unita561 = (() => {
  // fatti: inserimenti completati · fase dell'inserimento in corso: 0 nessuno, 1 prenotato, 2 scritto
  const stato = (cap, fatti, fase) => ({ vuoti: cap - fatti - (fase > 0 ? 1 : 0), transito: fase > 0 ? 1 : 0, pieni: fatti });
  const quadro = (pre, cap, fatti, fase, acc, o) => {
    const el = SL.el, els = [], s = stato(cap, fatti, fase), w4 = (o.w - 30) / 4;
    els.push(el.nota(pre + 't0', o.x, o.y, 'I POSTI DEL BUFFER', 'mono'));
    for (let k = 0; k < cap; k++) {
      const pub = k < fatti, cur = k === fatti && fase > 0;
      els.push(el.cella(pre + 'p' + k, o.x + k * (o.wc + 6), o.y + 24, o.wc, 34, pub ? 'pubblicato' : cur ? (fase === 1 ? 'prenotato' : 'scritto') : '', pub ? 'on' : cur ? 'att' : '', { gi: 'posto ' + k, piccola: true }));
    }
    [['vuoti · semaforo', String(s.vuoti), 'v'], ['in transito', String(s.transito), 't'], ['pieni · semaforo', String(s.pieni), 'p'], ['somma', s.vuoti + ' + ' + s.transito + ' + ' + s.pieni + ' = ' + cap, 's']].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (w4 + 10), o.y + 86, w4, 54, r[0], r[1], acc.indexOf(r[2]) >= 0 ? 'att' : 'on', { cls: 'stretta' })));
    return els;
  };
  return { stato, quadro };
})();
SL.registra('5.6.1', {
  titolo: 'Derivare il buffer limitato dai suoi invarianti',
  obiettivo: 'Obiettivo: seguire un posto del buffer dalla prenotazione alla pubblicazione, e verificare a ogni passo che la somma dei posti vuoti, pieni e in transito sia pari alla capacità.',
  concetti: [['semaforo', 'Due semafori: vuoti e pieni'], ['bilancio', 'Una somma che resta costante'], ['memory', 'Un dato scritto, e ancora da pubblicare']],
  filigrana: ['semaforo', 'memory', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 5.5.6', t: 'Il semaforo', d: 'Un intero condiviso con una coda: down lo decrementa oppure blocca, up risveglia un thread oppure lo incrementa.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.2.5', t: 'Il mutex', d: 'Un meccanismo che ammette un thread per volta su una struttura condivisa.' },
      { sim: 'memory', da: 'Dall’unità 2.5.3', t: 'Il buffer', d: 'Una zona di memoria impiegata come deposito temporaneo per i dati in trasferimento.' }
    ],
    domanda: { d: 'Prima di proseguire: un semaforo vale 0 e la sua coda è vuota. Un thread esegue down. Che cosa accade?', o: [
      { t: 'Il thread è bloccato e posto in coda', ok: true, fb: 'Con il valore a zero la risorsa non è disponibile, e il thread attende.' },
      { t: 'Il semaforo scende a −1 e il thread prosegue', fb: 'Il valore di un semaforo non scende sotto zero, e il thread si arresta.' },
      { t: 'La down è ignorata', fb: 'Una down ha sempre effetto: decrementa il valore oppure blocca il thread.' }
    ] }
  },
  idea: {
    titolo: 'Due semafori per un deposito di capacità fissa',
    termini: ['produttore e consumatore', 'buffer limitato', 'posto in transito', 'invariante'],
    testo: [
      'Un thread produce dati, un altro li impiega, e i due procedono a velocità diverse. Fra i due si colloca un deposito in cui il primo inserisce e il secondo preleva. Lo schema prende il nome di [[produttore e consumatore]], e il deposito con un numero fisso di posti è denominato [[buffer limitato]]. Lo schema si fonda su due regole: il produttore deve arrestarsi quando i posti sono esauriti, e il consumatore deve arrestarsi quando il deposito è vuoto.',
      'Le due attese sono realizzate con i semafori dell’unità 5.5.6, e ne occorrono due. Il semaforo vuoti conta i posti in cui è ancora possibile scrivere, e inizialmente è pari alla capacità. Il semaforo pieni conta i dati pronti per la lettura, e inizialmente vale zero. Il produttore esegue down(vuoti) prima di inserire e up(pieni) dopo. Il consumatore segue il percorso opposto: down(pieni) prima di prelevare, up(vuoti) dopo.',
      'Fra la down e la up del produttore intercorre un intervallo. Il posto ha già lasciato il conteggio dei vuoti, e manca ancora dal conteggio dei pieni. Un posto in questa condizione è denominato [[posto in transito]]: appartiene al produttore, che vi sta operando. In quell’intervallo il produttore acquisisce un mutex, scrive il dato, aggiorna l’indice che indica la posizione della scrittura successiva, e rilascia il mutex. Il mutex, un semaforo binario inizializzato a 1, è necessario poiché posti e indici sono dati condivisi, ai quali deve accedere un thread per volta.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Quattro posti: uno è scritto, e deve ancora essere pubblicato', nota: 'Il dato è già in memoria. Il semaforo pieni vale ancora 0, e quel posto è in transito.', els: SL.unita561.quadro('g', 4, 0, 2, 't', { x: 10, y: 4, w: 700, wc: 112 }) },
      'L’analisi di uno schema di questo tipo si fonda sulla ricerca di un [[invariante]]: una proprietà vera all’inizio, che resta vera dopo ogni passo ammesso. In questo caso l’invariante è una somma: posti vuoti, posti pieni e posti in transito, sommati, sono sempre pari alla capacità del buffer. Ogni operazione sposta un posto da un gruppo all’altro, e nessuna ne crea o ne distrugge.',
      'L’invariante spiega inoltre un aspetto non evidente. Dopo la scrittura il dato è già nella memoria del buffer, e tuttavia il consumatore deve comportarsi come se fosse assente. Il diritto di leggerlo ha origine con la up(pieni), che è il momento della pubblicazione. La presenza fisica di un dato e la possibilità di impiegarlo sono due fatti distinti, e il secondo segue il primo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un produttore inserisce uno o due elementi in un buffer vuoto. I controlli fissano la capacità del buffer e il numero degli elementi. Il consumatore, in questo esperimento, resta inattivo.',
      'Ogni inserimento comprende tre fasi: la prenotazione del posto, la scrittura sotto mutex, la pubblicazione. A ogni passo l’esperimento ricalcola la somma dei tre gruppi di posti.'
    ],
    vedrai: [
      ['memory', 'I posti del buffer', 'In alto: ogni posto con il suo stato, cioè vuoto, prenotato, scritto, pubblicato.'],
      ['semaforo', 'I tre gruppi di posti', 'In basso: vuoti, in transito e pieni, e accanto la loro somma.']
    ]
  },
  lab: {
    titolo: 'Un posto, dalla prenotazione alla pubblicazione',
    scena: { w: 860, h: 152 },
    atti: ['Il buffer vuoto', 'Gli inserimenti', 'Il bilancio'],
    controlli: [
      { id: 'cap', tipo: 'scelta', eti: 'Capacità del buffer', opzioni: [[2, '2 posti'], [3, '3 posti'], [4, '4 posti']], valore: 4 },
      { id: 'n', tipo: 'scelta', eti: 'Elementi inseriti', opzioni: [[1, '1'], [2, '2']], valore: 1 }
    ],
    nota: 'Il numero dei passi dipende dagli elementi inseriti. Il consumatore resta inattivo per l’intera sequenza.',
    previsione: {
      domanda: (p) => 'Un buffer di ' + p.cap + ' posti è vuoto. Il produttore inserisce ' + (p.n === 1 ? 'un elemento' : 'due elementi, in successione') + '. Si consideri l’istante in cui ' + (p.n === 1 ? 'il dato' : 'il secondo dato') + ' è già scritto in memoria e la sua up(pieni) deve ancora avvenire. Quanto vale il semaforo pieni in quell’istante?',
      opzioni: () => [0, 1, 2].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. In quell’istante pieni vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il semaforo pieni conta i dati pubblicati. Il dato appena scritto è in memoria, e il suo posto è ancora in transito: entrerà nel conteggio con la up(pieni).'),
    costruisci(p) {
      const U = SL.unita561, passi = [];
      const P = (fatti, fase, acc, atto, titolo, testo, extra) => { const s = U.stato(p.cap, fatti, fase); passi.push(Object.assign({ atto, titolo, testo, hud: [['Vuoti', String(s.vuoti), 'a'], ['In transito', String(s.transito)], ['Pieni', String(s.pieni), 'c']], els: U.quadro('b', p.cap, fatti, fase, acc, { x: 20, y: 4, w: 820, wc: 130 }) }, extra)); };
      P(0, 0, 'v', 0, 'Il buffer vuoto', 'Il buffer ha ' + p.cap + ' posti, tutti liberi. Il semaforo vuoti vale ' + p.cap + ', il semaforo pieni vale 0, e nessun posto è in transito. La somma è ' + p.cap + ', pari alla capacità.', { calc: p.cap + ' + 0 + 0 = ' + p.cap });
      for (let j = 0; j < p.n; j++) {
        const nome = p.n === 1 ? '' : j === 0 ? ' · primo elemento' : ' · secondo elemento', v0 = p.cap - j;
        P(j, 1, 'vt', 1, 'down(vuoti)' + nome, 'Il produttore richiede un posto libero. Il semaforo vuoti scende da ' + v0 + ' a ' + (v0 - 1) + ', e il posto ' + j + ' è prenotato. Quel posto appartiene ora al produttore: ha lasciato i vuoti, e deve ancora entrare fra i pieni.', Object.assign({ calc: 'vuoti ' + v0 + ' → ' + (v0 - 1) + ' · in transito 1' }, j === 0 ? { chiedi: { d: 'Il posto 0 è prenotato. A quale gruppo appartiene ora?', o: ['Ai vuoti', 'È in transito', 'Ai pieni'], g: 1, no: 'Il produttore lo ha sottratto ai vuoti con la down, e lo consegnerà ai pieni soltanto con la up.' } } : {}));
        P(j, 2, 't', 1, 'Scrittura sotto mutex' + nome, 'Il produttore acquisisce il mutex, scrive il dato nel posto ' + j + ', fa avanzare l’indice di scrittura e rilascia il mutex. Il dato è nella memoria del buffer. Il semaforo pieni vale ancora ' + j + ': per il consumatore questo dato è ancora assente.', { calc: 'pieni = ' + j + ' · dato scritto, da pubblicare' });
        P(j + 1, 0, 'p', 1, 'up(pieni)' + nome, 'Il produttore pubblica il dato. Il semaforo pieni sale da ' + j + ' a ' + (j + 1) + ', e il posto lascia il transito. Da questo momento un consumatore può prelevare il dato del posto ' + j + '.', { calc: 'pieni ' + j + ' → ' + (j + 1) + ' · in transito 0' });
      }
      const f = U.stato(p.cap, p.n, 0);
      P(p.n, 0, 's', 2, 'Il bilancio', 'Dopo ' + (p.n === 1 ? 'un inserimento' : 'due inserimenti') + ' il buffer ha ' + f.vuoti + (f.vuoti === 1 ? ' posto vuoto' : ' posti vuoti') + ' e ' + f.pieni + (f.pieni === 1 ? ' pieno.' : ' pieni.') + ' A ogni passo la somma dei tre gruppi è rimasta ' + p.cap + '. Nell’istante in cui ' + (p.n === 1 ? 'il dato' : 'il secondo dato') + ' era scritto e ancora da pubblicare, pieni valeva ' + (p.n - 1) + '.', { calc: f.vuoti + ' + 0 + ' + f.pieni + ' = ' + p.cap, esito: ['pieni valeva ' + (p.n - 1), ''] });
      return { passi, esito: p.n - 1 };
    }
  },
  bilancio: {
    regola: [
      'Produttore: down(vuoti), scrittura sotto mutex, up(pieni). Consumatore: down(pieni), prelievo sotto mutex, up(vuoti).',
      'In ogni istante vuoti + pieni + posti in transito = capacità del buffer.'
    ],
    errori: [
      ['Considerare leggibile un dato appena scritto.', 'Il consumatore può prelevarlo soltanto dopo la up(pieni).'],
      ['Attendersi che vuoti + pieni sia sempre pari alla capacità.', 'Durante un inserimento o un prelievo un posto è in transito, e la somma dei due semafori è inferiore.'],
      ['Impiegare un solo semaforo per entrambe le attese.', 'Le attese sono due e diverse: lo spazio per il produttore, i dati per il consumatore.']
    ],
    saFare: ['Seguire un posto da vuoti a pieni.', 'Calcolare i posti in transito da capacità, vuoti e pieni.', 'Distinguere un dato scritto da un dato pubblicato.'],
    esercizi: [
      { d: 'Un buffer ha 8 posti. In un certo istante il semaforo vuoti vale 3 e il semaforo pieni vale 4. Quanti posti sono in transito?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: '8 − 3 − 4 = 1: un thread sta operando su un posto.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Questa è la somma dei due semafori. I posti in transito sono la differenza rispetto a 8.' },
          { se: ['0', 'zero'], msg: 'Tre più quattro dà 7, e i posti sono 8.' }
        ],
        altro: 'Il numero è diverso. Si applichi l’invariante: i tre gruppi, sommati, sono pari alla capacità.',
        indizi: ['La capacità è 8.', 'vuoti + pieni = 3 + 4 = 7.', '8 − 7 = 1.'],
        svolgimento: ['Capacità: 8.', 'Vuoti più pieni: 7.', 'In transito: 1.'] },
      { d: 'Un buffer di 5 posti è vuoto. Il produttore completa 3 inserimenti, e quindi il consumatore completa 1 prelievo. Quanto vale il semaforo vuoti?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '5 − 3 + 1 = 3.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Questo è il valore prima del prelievo. Il consumatore, con up(vuoti), restituisce un posto.' },
          { se: ['4', 'quattro'], msg: 'Gli inserimenti completati sono 3, e ciascuno ha sottratto un posto a vuoti.' },
          { se: ['1', 'uno'], msg: 'Uno è il numero dei prelievi. La domanda riguarda i posti liberi.' }
        ],
        altro: 'Il valore è diverso. Si parta da 5, si sottragga un posto per ogni inserimento e se ne aggiunga uno per ogni prelievo.',
        indizi: ['Inizialmente vuoti vale 5.', 'Tre inserimenti: 5 − 3 = 2.', 'Un prelievo: 2 + 1 = 3.'],
        svolgimento: ['Vuoti iniziali: 5.', 'Dopo 3 inserimenti: 2.', 'Dopo 1 prelievo: 3.'] },
      { d: 'Il produttore ha scritto il dato nel suo posto, e deve ancora eseguire up(pieni). Un consumatore esegue down(pieni), che vale 0. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il consumatore si blocca fino alla pubblicazione', ok: true, fb: 'Il dato è in memoria, e la possibilità di leggerlo ha origine con la up(pieni).' },
        { t: 'Il consumatore legge il dato, che è già in memoria', fb: 'La presenza fisica è insufficiente. Con pieni a zero il consumatore resta in attesa.' },
        { t: 'Il consumatore riceve un errore', fb: 'Una down su un semaforo a zero pone il thread in attesa, senza segnalare errori.' }] }
    ],
    sfida: ['cslez5_6_01_classical_sync', 'Condizioni e risorse nel produttore-consumatore']
  }
});
