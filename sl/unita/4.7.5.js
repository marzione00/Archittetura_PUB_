'use strict';
SL.unita475 = (() => {
  const conto = (p) => { const irq = p.t + p.b, pronto = irq + 3, ripresa = pronto + p.s; return { irq, pronto, ripresa, int: p.b + 3 + p.s }; };
  // fase: 0 l'attesa · 1 l'ultimo byte · 2 la notifica · 3 il gestore · 4 la ripresa · 5 il conto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], w4 = (o.w - 30) / 4, w3 = (o.w - 20) / 3;
    els.push(el.nota(pre + 't0', o.x, o.y, 'GLI ISTANTI · in microsecondi', 'mono'));
    [['ultimo byte', p.t, 1], ['interrupt', c.irq, 2], ['processo pronto', c.pronto, 3], ['ripresa', c.ripresa, 4]].forEach((r, k) => els.push(el.box(pre + 'i' + k, o.x + k * (w4 + 10), o.y + 24, w4, o.h, r[0], f >= r[2] ? r[1] + ' µs' : '·', f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    els.push(el.nota(pre + 't1', o.x, o.y + 24 + o.h + 16, 'CHI FA CHE COSA', 'mono'));
    const y2 = o.y + 24 + o.h + 40;
    els.push(el.box(pre + 'a', o.x, y2, w3, o.h, 'il processo', f <= 2 ? 'sospeso' : f === 3 ? 'pronto' : 'in esecuzione', f === 3 ? 'zero' : f >= 4 ? 'att' : 'off', { cls: 'stretta' }),
      el.box(pre + 'b', o.x + w3 + 10, y2, w3, o.h, 'processore', f <= 1 ? 'altro lavoro' : f === 2 ? 'gestore dell’interrupt' : f === 3 ? (p.s === 0 ? 'libero' : 'altro lavoro') : 'il processo', f === 2 ? 'att' : 'on', { cls: 'stretta' }),
      el.box(pre + 'c', o.x + 2 * (w3 + 10), y2, w3, o.h, 'dispositivo', f === 0 ? 'trasferisce' : f === 1 ? 'ha finito' : 'segnalato', f === 1 ? 'att' : f === 0 ? 'on' : 'off', { cls: 'stretta' }));
    return els;
  };
  return { conto, quadro };
})();
SL.registra('4.7.5', {
  titolo: 'Completamento e ritorno allo scheduling',
  obiettivo: 'Obiettivo: ricostruire che cosa accade fra l’arrivo dell’ultimo byte e il momento in cui il processo che lo aspettava torna a eseguire.',
  concetti: [['dispositivo', 'I dati sono arrivati'], ['interrupt', 'Il sistema viene avvisato'], ['process', 'Il processo torna in fila']],
  filigrana: ['process', 'interrupt', 'clock'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'La chiamata bloccante', d: 'Il processo che chiede dati non ancora disponibili viene sospeso.' },
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'Lo scheduler', d: 'La parte del kernel che decide quale processo usa il processore.' },
      { sim: 'interrupt', da: 'Dall’unità 4.3.2', t: 'La richiesta di interruzione', d: 'Il segnale con cui un dispositivo annuncia un evento.' }
    ],
    domanda: { d: 'Prima di proseguire: un processo sospeso torna pronto. Sta già eseguendo?', o: [
      { t: 'No: aspetta che lo scheduler gli assegni il processore', ok: true, fb: 'Pronto significa in grado di eseguire. Il turno lo decide lo scheduler.' },
      { t: 'Sì, dall’istante in cui diventa pronto', fb: 'Fra pronto e in esecuzione c’è l’attesa del proprio turno.' },
      { t: 'Sì, ma soltanto in modo kernel', fb: 'Un processo pronto non esegue affatto, finché non riceve il processore.' }
    ] }
  },
  idea: {
    titolo: 'I dati ci sono, e nessuno lo sa',
    termini: ['interrupt di completamento'],
    testo: [
      'Un processo ha chiesto di leggere dei dati da un dispositivo, ed è stato sospeso in attesa. Il trasferimento avviene con il DMA, e mentre il dispositivo riempie il buffer il processore si occupa di altro. A un certo istante l’ultimo byte arriva nella memoria. I dati sono completi, e il processo che li aspetta continua a dormire: nessuno, nel sistema, sa ancora che il lavoro è finito.',
      'Ad avvisare è il dispositivo, con un [[interrupt di completamento]]. Può partire con un piccolo ritardo, perché molti dispositivi raggruppano le segnalazioni. Il gestore del driver controlla l’esito, riprende possesso del buffer e dello slot, e risveglia il processo: lo porta dallo stato sospeso allo stato pronto. Il processo torna in fila, e riprende a eseguire quando lo scheduler gli assegna il processore.',
      { fig: 'scena', w: 720, h: 196, titolo: 'Dall’ultimo byte alla ripresa', nota: 'Fra 40 e 55 µs passano 15 µs: 4 di notifica, 3 di gestore, 8 di attesa del turno.', els: SL.unita475.quadro('g', { t: 40, b: 4, s: 8 }, 5, { x: 10, y: 0, w: 700, h: 54 }) },
      'Mettiamo dei numeri. L’ultimo byte arriva all’istante 40 µs. L’interrupt parte 4 µs dopo, all’istante 44. Il gestore impiega 3 µs, e il processo è pronto all’istante 47. Lo scheduler lo fa attendere 8 µs, e la ripresa avviene all’istante 55. Dall’arrivo dei dati sono passati 15 µs.',
      'Di quei 15 µs soltanto 8 dipendono dallo scheduler. Anche con un processore subito libero resterebbero i 7 µs di notifica e di gestore. «I dati sono disponibili» e «il processo sta eseguendo» sono due eventi distinti, e in mezzo c’è un tratto di strada che attraversa quasi tutto ciò che il Modulo IV ha descritto: l’interrupt, il gestore, la proprietà del buffer, lo scheduler.'
    ]
  },
  esperimento: {
    faremo: [
      'Un processo aspetta dati che un dispositivo sta portando nella memoria con il DMA. Sceglierai quando arriva l’ultimo byte, il ritardo della notifica e l’attesa imposta dallo scheduler.',
      'Segneremo quattro istanti: ultimo byte, interrupt, processo pronto, ripresa. Porta a zero l’attesa dello scheduler e guarda che cosa resta dell’intervallo.'
    ],
    vedrai: [
      ['clock', 'Gli istanti', 'In alto: i quattro momenti, in microsecondi.'],
      ['process', 'Chi fa che cosa', 'In basso: lo stato del processo, l’occupazione del processore e il dispositivo.']
    ]
  },
  lab: {
    titolo: 'Dall’ultimo byte alla ripresa',
    scena: { w: 860, h: 200 },
    atti: ['L’attesa', 'La notifica', 'La ripresa'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Ultimo byte', opzioni: [[20, 'a 20 µs'], [40, 'a 40 µs']], valore: 40 },
      { id: 'b', tipo: 'scelta', eti: 'Ritardo della notifica', opzioni: [[0, '0 µs'], [4, '4 µs'], [12, '12 µs']], valore: 4 },
      { id: 's', tipo: 'scelta', eti: 'Attesa dello scheduler', opzioni: [[0, '0 µs'], [8, '8 µs'], [20, '20 µs']], valore: 8 }
    ],
    nota: 'I passi sono sempre sei. Il gestore del driver impiega 3 µs.',
    previsione: {
      domanda: (p) => 'L’ultimo byte arriva nella memoria a ' + p.t + ' µs. L’interrupt parte ' + (p.b === 0 ? 'subito' : 'dopo ' + p.b + ' µs') + ', il gestore lavora per 3 µs, e lo scheduler fa attendere il processo ' + (p.s === 0 ? '0 µs' : p.s + ' µs') + '. Quanto tempo passa fra l’ultimo byte e la ripresa del processo?',
      opzioni: (p) => Array.from(new Set([p.s, p.b + p.s, p.b + 3 + p.s])).sort((a, b) => a - b).map((v) => [v, v + ' µs'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' µs. Fra l’ultimo byte e la ripresa passano ' + esito + ' µs. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.s ? 'All’attesa dello scheduler vanno sommati la notifica e il lavoro del gestore.' : 'Vanno contati anche i 3 µs in cui il gestore controlla l’esito e risveglia il processo.'),
    costruisci(p) {
      const U = SL.unita475, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 56 });
      const hud = (f) => [['Ultimo byte', f >= 1 ? p.t + ' µs' : '·', 'a'], ['Pronto', f >= 3 ? c.pronto + ' µs' : '·'], ['Ripresa', f >= 4 ? c.ripresa + ' µs' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'L’attesa', 'Il processo ha chiesto dei dati ed è sospeso. Il dispositivo li sta scrivendo nel buffer con il DMA. Il processore, libero dal trasferimento, esegue altro.', {});
      P(1, 0, 'L’ultimo byte', 'All’istante ' + p.t + ' µs il dispositivo scrive l’ultimo byte. Il buffer è completo. Il processo resta sospeso, perché nessuno nel sistema lo sa ancora.', { calc: 'ultimo byte: ' + p.t + ' µs' });
      P(2, 1, 'La notifica', (p.b === 0 ? 'Il dispositivo manda subito l’interrupt di completamento, all’istante ' + c.irq + ' µs.' : 'Il dispositivo manda l’interrupt di completamento con ' + p.b + ' µs di ritardo, all’istante ' + c.irq + ' µs.') + ' Il processore sospende ciò che stava facendo ed entra nel gestore del driver.', { calc: p.t + ' + ' + p.b + ' = ' + c.irq + ' µs' });
      P(3, 1, 'Il gestore', 'Il gestore controlla l’esito del trasferimento, riprende il buffer e risveglia il processo. Il lavoro dura 3 µs: all’istante ' + c.pronto + ' µs il processo è pronto.', { calc: c.irq + ' + 3 = ' + c.pronto + ' µs', chiedi: { d: 'Il processo è pronto. Sta già eseguendo?', o: ['Sì', 'No: attende il turno assegnato dallo scheduler'], g: 1, no: 'Pronto vuol dire in fila per il processore. A decidere il turno è lo scheduler.' } });
      P(4, 2, 'La ripresa', (p.s === 0 ? 'Il processore è libero, e lo scheduler lo assegna subito al processo.' : 'Altri processi sono in fila, e lo scheduler fa attendere il processo ' + p.s + ' µs.') + ' La ripresa avviene all’istante ' + c.ripresa + ' µs. La chiamata di lettura ritorna, e il programma trova i dati nel buffer.', { calc: c.pronto + ' + ' + p.s + ' = ' + c.ripresa + ' µs' });
      P(5, 2, 'Il conto', 'Fra l’ultimo byte e la ripresa sono passati ' + c.ripresa + ' − ' + p.t + ' = ' + c.int + ' µs: ' + p.b + ' di notifica, 3 di gestore, ' + p.s + ' di attesa del turno.' + (p.s === 0 ? ' L’attesa dello scheduler è nulla, e l’intervallo non lo è.' : ' Soltanto ' + p.s + ' dipendono dallo scheduler.'), { calc: p.b + ' + 3 + ' + p.s + ' = ' + c.int + ' µs', esito: [c.int + ' µs', ''] });
      return { passi, esito: c.int };
    }
  },
  bilancio: {
    regola: [
      'Ripresa = istante dell’ultimo byte + ritardo della notifica + tempo del gestore + attesa dello scheduler.',
      'I dati disponibili e il processo in esecuzione sono due eventi distinti, separati da interrupt, gestore e scheduler.'
    ],
    errori: [
      ['Far ripartire il processo all’arrivo dell’ultimo byte.', 'Il sistema viene a saperlo soltanto con l’interrupt di completamento.'],
      ['Far eseguire il processo appena risvegliato.', 'Il risveglio lo rende pronto. Il processore glielo assegna lo scheduler.'],
      ['Attribuire tutto il ritardo allo scheduler.', 'Notifica e gestore restano anche quando il processore è libero.']
    ],
    saFare: ['Porre in ordine ultimo byte, interrupt, risveglio e ripresa.', 'Calcolare l’istante della ripresa.', 'Separare la parte di ritardo dovuta allo scheduler.'],
    esercizi: [
      { d: 'L’ultimo byte di un trasferimento DMA arriva all’istante 60 µs. L’interrupt parte dopo 5 µs, il gestore impiega 3 µs, e lo scheduler fa attendere il processo 12 µs. A quale istante riprende il processo, in microsecondi?', segnaposto: 'Un numero', giuste: ['80', '80µs', '80μs', '80us'],
        ok: '60 + 5 + 3 + 12 = 80 µs.',
        diagnosi: [
          { se: ['20', '20µs', '20μs', '20us'], msg: 'Questo è l’intervallo dopo l’ultimo byte. L’istante si conta dall’inizio: va sommato 60.' },
          { se: ['77', '77µs', '77μs', '77us'], msg: 'Mancano i 3 µs del gestore.' },
          { se: ['68', '68µs', '68μs', '68us'], msg: 'A 68 µs il processo è pronto. Poi attende 12 µs il proprio turno.' }
        ],
        altro: 'Il valore è diverso. Somma all’istante dell’ultimo byte i tre ritardi.',
        indizi: ['Interrupt: 60 + 5 = 65 µs.', 'Processo pronto: 65 + 3 = 68 µs.', 'Ripresa: 68 + 12 = 80 µs.'],
        svolgimento: ['Interrupt: 65 µs.', 'Processo pronto: 68 µs.', 'Ripresa: 80 µs.'] },
      { d: 'Nella stessa situazione, quanti microsecondi passano fra l’ultimo byte e la ripresa?', segnaposto: 'Un numero', giuste: ['20', '20µs', '20μs', '20us'],
        ok: '5 + 3 + 12 = 20 µs.',
        diagnosi: [
          { se: ['80', '80µs', '80μs', '80us'], msg: 'Questo è l’istante della ripresa. L’intervallo si conta dall’ultimo byte, a 60 µs.' },
          { se: ['17', '17µs', '17μs', '17us'], msg: 'Mancano i 3 µs del gestore.' },
          { se: ['12', '12µs', '12μs', '12us'], msg: 'Questa è la sola attesa dello scheduler. Prima ci sono notifica e gestore.' }
        ],
        altro: 'Il valore è diverso. Somma notifica, gestore e attesa dello scheduler.',
        indizi: ['Notifica: 5 µs.', 'Gestore: 3 µs.', '5 + 3 + 12 = 20.'],
        svolgimento: ['Notifica: 5 µs.', 'Gestore: 3 µs.', 'Scheduler: 12 µs.', 'Intervallo: 20 µs.'] },
      { d: 'Il processore è libero, e lo scheduler assegna subito il turno al processo risvegliato. L’intervallo fra l’ultimo byte e la ripresa si annulla?', guida: 'Si scelga la risposta.', o: [
        { t: 'No: restano il ritardo della notifica e il lavoro del gestore', ok: true, fb: 'Senza interrupt e senza gestore il sistema non saprebbe che i dati sono arrivati.' },
        { t: 'Sì: il processo riparte all’arrivo dell’ultimo byte', fb: 'All’arrivo dell’ultimo byte il processo è ancora sospeso.' },
        { t: 'Sì, purché il trasferimento usi il DMA', fb: 'Il DMA libera il processore durante il trasferimento. Il completamento va comunque notificato.' }] }
    ],
    sfida: ['cslez4_7_04_dma_04', 'Costo temporale e impegno della CPU']
  }
});
