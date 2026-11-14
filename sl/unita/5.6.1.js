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
  obiettivo: 'Obiettivo: seguire un posto del buffer dalla prenotazione alla pubblicazione, e verificare a ogni passo che permessi vuoti, pieni e in transito diano come somma la capacità.',
  concetti: [['semaforo', 'Due contatori: vuoti e pieni'], ['bilancio', 'Una somma che resta costante'], ['memory', 'Un dato scritto, e ancora da pubblicare']],
  filigrana: ['semaforo', 'memory', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'semaforo', da: 'Dall’unità 5.5.6', t: 'Il semaforo', d: 'Un contatore di permessi con una coda: wait ne prende uno oppure blocca, signal ne restituisce uno.' },
      { sim: 'lucchetto', da: 'Dall’unità 5.2.5', t: 'Il mutex', d: 'Un lucchetto che ammette un thread per volta su una struttura condivisa.' },
      { sim: 'memory', da: 'Dall’unità 2.5.3', t: 'Il buffer', d: 'Una zona di memoria usata come deposito temporaneo per i dati in viaggio.' }
    ],
    domanda: { d: 'Prima di proseguire: un semaforo vale 0 e la sua coda è vuota. Un thread esegue wait. Che cosa accade?', o: [
      { t: 'Il thread viene bloccato e messo in coda', ok: true, fb: 'Con il contatore a zero mancano permessi, e chi ne chiede uno aspetta.' },
      { t: 'Il contatore scende a −1 e il thread prosegue', fb: 'Il contatore dei permessi liberi resta a zero. È il thread a fermarsi.' },
      { t: 'La wait viene ignorata', fb: 'Una wait ha sempre effetto: prende un permesso oppure blocca il thread.' }
    ] }
  },
  idea: {
    titolo: 'Due contatori per un deposito con i posti contati',
    termini: ['produttore e consumatore', 'buffer limitato', 'permesso in transito', 'invariante'],
    testo: [
      'Un thread produce dati, un altro li usa, e i due procedono a velocità diverse. Fra loro si mette un deposito in cui il primo lascia e il secondo ritira. Lo schema si chiama [[produttore e consumatore]]. Quando il deposito ha un numero fisso di posti prende il nome di [[buffer limitato]]. Due regole lo tengono in piedi: il produttore deve fermarsi quando i posti sono finiti, e il consumatore deve fermarsi quando il deposito è vuoto.',
      'Queste due attese sono il mestiere dei semafori dell’unità 5.5.6, e ne servono due. Il semaforo vuoti conta i posti in cui si può ancora scrivere, e all’inizio vale quanto la capacità. Il semaforo pieni conta i dati pronti per essere letti, e all’inizio vale zero. Il produttore esegue wait(vuoti) prima di inserire e signal(pieni) dopo. Il consumatore fa il percorso opposto: wait(pieni) prima di prelevare, signal(vuoti) dopo.',
      'Fra la wait e la signal del produttore c’è un intervallo. Il posto ha già lasciato il conto dei vuoti, e manca ancora dal conto dei pieni. Diciamo che il suo permesso è un [[permesso in transito]]: appartiene al produttore, che ci sta lavorando. In quell’intervallo il produttore acquisisce un mutex, scrive il dato, aggiorna l’indice che dice dove scrivere la prossima volta, e rilascia il mutex. Il mutex serve perché posti e indici sono dati condivisi, da toccare un thread per volta.',
      { fig: 'scena', w: 720, h: 150, titolo: 'Quattro posti: uno è scritto, e deve ancora essere pubblicato', nota: 'Il dato è già in memoria. Il semaforo pieni vale ancora 0, e il permesso di quel posto è in transito.', els: SL.unita561.quadro('g', 4, 0, 2, 't', { x: 10, y: 4, w: 700, wc: 112 }) },
      'Per ragionare su uno schema del genere conviene cercare un [[invariante]]: una proprietà vera all’inizio, che resta vera dopo ogni passo ammesso. Qui l’invariante è una somma. Permessi vuoti, permessi pieni e permessi in transito, sommati, danno sempre la capacità del buffer. Ogni operazione sposta un permesso da un gruppo all’altro, e nessuna ne crea o ne distrugge.',
      'L’invariante spiega anche un dettaglio che a prima vista sorprende. Dopo la scrittura il dato è già nella memoria del buffer, eppure il consumatore deve comportarsi come se mancasse. Il diritto di leggerlo nasce con la signal(pieni), che è il momento della pubblicazione. La presenza fisica di un dato e il permesso di usarlo sono due fatti distinti, e il secondo arriva dopo il primo.'
    ]
  },
  esperimento: {
    faremo: [
      'Un produttore inserisce uno o due elementi in un buffer vuoto. Sceglierai la capacità del buffer e il numero degli elementi. Il consumatore, in questo esperimento, resta fermo.',
      'Ogni inserimento attraversa tre momenti: la prenotazione del posto, la scrittura sotto mutex, la pubblicazione. A ogni passo ricalcoleremo la somma dei tre gruppi di permessi.'
    ],
    vedrai: [
      ['memory', 'I posti del buffer', 'In alto: ogni posto con il suo stato. Vuoto, prenotato, scritto, pubblicato.'],
      ['semaforo', 'I tre gruppi di permessi', 'In basso: vuoti, in transito e pieni, e accanto la loro somma.']
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
    nota: 'Il numero dei passi dipende dagli elementi inseriti. Il consumatore resta fermo per tutta la sequenza.',
    previsione: {
      domanda: (p) => 'Un buffer di ' + p.cap + ' posti è vuoto. Il produttore inserisce ' + (p.n === 1 ? 'un elemento' : 'due elementi, uno dopo l’altro') + '. Fermiamoci nell’istante in cui ' + (p.n === 1 ? 'il dato' : 'il secondo dato') + ' è già scritto in memoria e la sua signal(pieni) deve ancora avvenire. Quanto vale il semaforo pieni in quell’istante?',
      opzioni: () => [0, 1, 2].map((v) => [v, String(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. In quell’istante pieni vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il semaforo pieni conta i dati pubblicati. Il dato appena scritto è in memoria, e il suo permesso è ancora in transito: entrerà nel conto con la signal(pieni).'),
    costruisci(p) {
      const U = SL.unita561, passi = [];
      const P = (fatti, fase, acc, atto, titolo, testo, extra) => { const s = U.stato(p.cap, fatti, fase); passi.push(Object.assign({ atto, titolo, testo, hud: [['Vuoti', String(s.vuoti), 'a'], ['In transito', String(s.transito)], ['Pieni', String(s.pieni), 'c']], els: U.quadro('b', p.cap, fatti, fase, acc, { x: 20, y: 4, w: 820, wc: 130 }) }, extra)); };
      P(0, 0, 'v', 0, 'Il buffer vuoto', 'Il buffer ha ' + p.cap + ' posti, tutti liberi. Il semaforo vuoti vale ' + p.cap + ', il semaforo pieni vale 0, e nessun permesso è in transito. La somma è ' + p.cap + ', quanto la capacità.', { calc: p.cap + ' + 0 + 0 = ' + p.cap });
      for (let j = 0; j < p.n; j++) {
        const nome = p.n === 1 ? '' : j === 0 ? ' · primo elemento' : ' · secondo elemento', v0 = p.cap - j;
        P(j, 1, 'vt', 1, 'wait(vuoti)' + nome, 'Il produttore chiede un permesso di spazio. Il semaforo vuoti scende da ' + v0 + ' a ' + (v0 - 1) + ', e il posto ' + j + ' è prenotato. Quel posto appartiene ora al produttore: ha lasciato i vuoti, e fra i pieni deve ancora arrivare.', Object.assign({ calc: 'vuoti ' + v0 + ' → ' + (v0 - 1) + ' · in transito 1' }, j === 0 ? { chiedi: { d: 'Il posto 0 è prenotato. A quale gruppo appartiene adesso il suo permesso?', o: ['Ai vuoti', 'È in transito', 'Ai pieni'], g: 1, no: 'Il produttore lo ha tolto ai vuoti con la wait, e lo consegnerà ai pieni soltanto con la signal.' } } : {}));
        P(j, 2, 't', 1, 'Scrittura sotto mutex' + nome, 'Il produttore acquisisce il mutex, scrive il dato nel posto ' + j + ', sposta in avanti l’indice di scrittura e rilascia il mutex. Il dato è nella memoria del buffer. Il semaforo pieni vale ancora ' + j + ': per il consumatore questo dato è come se mancasse.', { calc: 'pieni = ' + j + ' · dato scritto, da pubblicare' });
        P(j + 1, 0, 'p', 1, 'signal(pieni)' + nome, 'Il produttore pubblica il dato. Il semaforo pieni sale da ' + j + ' a ' + (j + 1) + ', e il permesso lascia il transito. Da questo momento un consumatore può prelevare il dato del posto ' + j + '.', { calc: 'pieni ' + j + ' → ' + (j + 1) + ' · in transito 0' });
      }
      const f = U.stato(p.cap, p.n, 0);
      P(p.n, 0, 's', 2, 'Il bilancio', 'Dopo ' + (p.n === 1 ? 'un inserimento' : 'due inserimenti') + ' il buffer ha ' + f.vuoti + (f.vuoti === 1 ? ' permesso vuoto' : ' permessi vuoti') + ' e ' + f.pieni + (f.pieni === 1 ? ' pieno.' : ' pieni.') + ' A ogni passo la somma dei tre gruppi è rimasta ' + p.cap + '. Nell’istante in cui ' + (p.n === 1 ? 'il dato' : 'il secondo dato') + ' era scritto e ancora da pubblicare, pieni valeva ' + (p.n - 1) + '.', { calc: f.vuoti + ' + 0 + ' + f.pieni + ' = ' + p.cap, esito: ['pieni valeva ' + (p.n - 1), ''] });
      return { passi, esito: p.n - 1 };
    }
  },
  bilancio: {
    regola: [
      'Produttore: wait(vuoti), scrittura sotto mutex, signal(pieni). Consumatore: wait(pieni), prelievo sotto mutex, signal(vuoti).',
      'In ogni istante vuoti + pieni + permessi in transito = capacità del buffer.'
    ],
    errori: [
      ['Considerare leggibile un dato appena scritto.', 'Il consumatore può prelevarlo soltanto dopo la signal(pieni).'],
      ['Aspettarsi che vuoti + pieni dia sempre la capacità.', 'Durante un inserimento o un prelievo un permesso è in transito, e la somma dei due semafori è più bassa.'],
      ['Usare un solo semaforo per tutto.', 'Le attese sono due e diverse: spazio per chi scrive, dati per chi legge.']
    ],
    saFare: ['Seguire un permesso da vuoti a pieni.', 'Calcolare i permessi in transito da capacità, vuoti e pieni.', 'Distinguere un dato scritto da un dato pubblicato.'],
    esercizi: [
      { d: 'Un buffer ha 8 posti. In un certo istante il semaforo vuoti vale 3 e il semaforo pieni vale 4. Quanti permessi sono in transito?', segnaposto: 'Un numero', giuste: ['1', 'uno'],
        ok: '8 − 3 − 4 = 1: un thread sta lavorando su un posto.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Questa è la somma dei due semafori. I permessi in transito sono ciò che manca per arrivare a 8.' },
          { se: ['0', 'zero'], msg: 'Tre più quattro dà 7, e i posti sono 8.' }
        ],
        altro: 'Il numero è diverso. Usa l’invariante: i tre gruppi, sommati, danno la capacità.',
        indizi: ['La capacità è 8.', 'vuoti + pieni = 3 + 4 = 7.', '8 − 7 = 1.'],
        svolgimento: ['Capacità: 8.', 'Vuoti più pieni: 7.', 'In transito: 1.'] },
      { d: 'Un buffer di 5 posti è vuoto. Il produttore completa 3 inserimenti, e poi il consumatore completa 1 prelievo. Quanto vale il semaforo vuoti?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '5 − 3 + 1 = 3.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Questo è il valore prima del prelievo. Il consumatore, con signal(vuoti), restituisce un posto.' },
          { se: ['4', 'quattro'], msg: 'Gli inserimenti completati sono 3, e ciascuno ha tolto un permesso a vuoti.' },
          { se: ['1', 'uno'], msg: 'Uno è il numero dei prelievi. La domanda riguarda i posti liberi.' }
        ],
        altro: 'Il valore è diverso. Si parta da 5, si tolga un permesso per ogni inserimento e aggiungine uno per ogni prelievo.',
        indizi: ['All’inizio vuoti vale 5.', 'Tre inserimenti: 5 − 3 = 2.', 'Un prelievo: 2 + 1 = 3.'],
        svolgimento: ['Vuoti iniziali: 5.', 'Dopo 3 inserimenti: 2.', 'Dopo 1 prelievo: 3.'] },
      { d: 'Il produttore ha scritto il dato nel suo posto, e deve ancora eseguire signal(pieni). Un consumatore esegue wait(pieni), che vale 0. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il consumatore si blocca fino alla pubblicazione', ok: true, fb: 'Il dato è in memoria, e il permesso di leggerlo nasce con la signal(pieni).' },
        { t: 'Il consumatore legge il dato, che è già in memoria', fb: 'La presenza fisica è insufficiente. Senza un permesso su pieni il consumatore resta in attesa.' },
        { t: 'Il consumatore riceve un errore', fb: 'Una wait su un semaforo a zero mette il thread in attesa, senza segnalare errori.' }] }
    ],
    sfida: ['cslez5_6_01_classical_sync', 'Condizioni e risorse nel produttore-consumatore']
  }
});
