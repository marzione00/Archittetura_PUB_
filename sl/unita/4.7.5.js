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
  obiettivo: 'Obiettivo: ricostruire gli eventi compresi fra l’arrivo dell’ultimo byte e l’istante in cui il processo che lo attendeva riprende l’esecuzione.',
  concetti: [['dispositivo', 'L’arrivo dei dati'], ['interrupt', 'La notifica al sistema'], ['process', 'Il ritorno del processo allo stato di pronto']],
  filigrana: ['process', 'interrupt', 'clock'],
  richiami: {
    carte: [
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'La chiamata bloccante', d: 'Il processo che richiede dati non ancora disponibili è sospeso.' },
      { sim: 'process', da: 'Dall’unità 4.2.4', t: 'Lo scheduler', d: 'La parte del kernel che stabilisce quale processo riceve il processore.' },
      { sim: 'interrupt', da: 'Dall’unità 4.3.2', t: 'La richiesta di interruzione', d: 'Il segnale con cui un dispositivo segnala un evento.' }
    ],
    domanda: { d: 'Prima di proseguire: un processo sospeso torna pronto. È già in esecuzione?', o: [
      { t: 'No, attende che lo scheduler gli assegni il processore', ok: true, fb: 'Lo stato di pronto indica un processo in grado di eseguire. Il turno è stabilito dallo scheduler.' },
      { t: 'Sì, dall’istante in cui diviene pronto', fb: 'Fra lo stato di pronto e l’esecuzione intercorre l’attesa del proprio turno.' },
      { t: 'Sì, soltanto in modo kernel', fb: 'Un processo pronto non esegue alcuna istruzione finché non riceve il processore.' }
    ] }
  },
  idea: {
    titolo: 'Dati disponibili e sistema non ancora informato',
    termini: ['interrupt di completamento'],
    testo: [
      'Un processo ha richiesto la lettura di alcuni dati da un dispositivo, ed è stato sospeso in attesa. Il trasferimento avviene con il DMA, e mentre il dispositivo riempie il buffer il processore esegue altre istruzioni. A un dato istante l’ultimo byte giunge nella memoria. I dati sono completi, e il processo che li attende resta sospeso: nessun componente del sistema è ancora informato del termine del trasferimento.',
      'L’avviso proviene dal dispositivo, con un [[interrupt di completamento]]. Esso può essere emesso con un breve ritardo, poiché molti dispositivi raggruppano le segnalazioni. Il gestore del driver verifica l’esito, riacquista la proprietà del buffer e dello slot, e risveglia il processo: lo porta dallo stato sospeso allo stato pronto. Il processo torna fra quelli in attesa del processore, e riprende l’esecuzione quando lo scheduler glielo assegna.',
      { fig: 'scena', w: 720, h: 196, titolo: 'Dall’ultimo byte alla ripresa', nota: 'Fra 40 e 55 µs trascorrono 15 µs: 4 di notifica, 3 di gestore, 8 di attesa del turno.', els: SL.unita475.quadro('g', { t: 40, b: 4, s: 8 }, 5, { x: 10, y: 0, w: 700, h: 54 }) },
      'Si consideri un esempio numerico. L’ultimo byte giunge all’istante 40 µs. L’interrupt è emesso 4 µs dopo, all’istante 44. Il gestore impiega 3 µs, e il processo è pronto all’istante 47. Lo scheduler impone un’attesa di 8 µs, e la ripresa avviene all’istante 55. Dall’arrivo dei dati sono trascorsi 15 µs.',
      'Di tali 15 µs soltanto 8 dipendono dallo scheduler. Anche con un processore immediatamente libero resterebbero i 7 µs di notifica e di gestore. La disponibilità dei dati e l’esecuzione del processo sono due eventi distinti, separati da una sequenza che comprende quasi tutti i meccanismi descritti nel Modulo IV: l’interrupt, il gestore, la proprietà del buffer, lo scheduler.'
    ]
  },
  esperimento: {
    faremo: [
      'Un processo attende dati che un dispositivo trasferisce nella memoria con il DMA. I controlli fissano l’istante di arrivo dell’ultimo byte, il ritardo della notifica e l’attesa imposta dallo scheduler.',
      'L’esperimento individua quattro istanti: ultimo byte, interrupt, processo pronto, ripresa. È istruttivo portare a zero l’attesa dello scheduler e osservare la parte residua dell’intervallo.'
    ],
    vedrai: [
      ['clock', 'Gli istanti', 'In alto: i quattro istanti, in microsecondi.'],
      ['process', 'Le attività dei componenti', 'In basso: lo stato del processo, l’occupazione del processore e il dispositivo.']
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
      domanda: (p) => 'L’ultimo byte giunge nella memoria a ' + p.t + ' µs. L’interrupt è emesso ' + (p.b === 0 ? 'immediatamente' : 'dopo ' + p.b + ' µs') + ', il gestore impiega 3 µs, e lo scheduler impone al processo un’attesa di ' + (p.s === 0 ? '0 µs' : p.s + ' µs') + '. Quanto tempo trascorre fra l’ultimo byte e la ripresa del processo?',
      opzioni: (p) => Array.from(new Set([p.s, p.b + p.s, p.b + 3 + p.s])).sort((a, b) => a - b).map((v) => [v, v + ' µs'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' µs. Fra l’ultimo byte e la ripresa trascorrono ' + esito + ' µs. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === p.s ? 'All’attesa dello scheduler vanno sommati la notifica e il lavoro del gestore.' : 'Vanno contati anche i 3 µs in cui il gestore verifica l’esito e risveglia il processo.'),
    costruisci(p) {
      const U = SL.unita475, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, h: 56 });
      const hud = (f) => [['Ultimo byte', f >= 1 ? p.t + ' µs' : '·', 'a'], ['Pronto', f >= 3 ? c.pronto + ' µs' : '·'], ['Ripresa', f >= 4 ? c.ripresa + ' µs' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'L’attesa', 'Il processo ha richiesto alcuni dati ed è sospeso. Il dispositivo li scrive nel buffer con il DMA. Il processore, libero dal trasferimento, esegue altre istruzioni.', {});
      P(1, 0, 'L’ultimo byte', 'All’istante ' + p.t + ' µs il dispositivo scrive l’ultimo byte, e il buffer è completo. Il processo resta sospeso, poiché il sistema non è ancora informato.', { calc: 'ultimo byte: ' + p.t + ' µs' });
      P(2, 1, 'La notifica', (p.b === 0 ? 'Il dispositivo emette immediatamente l’interrupt di completamento, all’istante ' + c.irq + ' µs.' : 'Il dispositivo emette l’interrupt di completamento con ' + p.b + ' µs di ritardo, all’istante ' + c.irq + ' µs.') + ' Il processore sospende l’attività in corso ed entra nel gestore del driver.', { calc: p.t + ' + ' + p.b + ' = ' + c.irq + ' µs' });
      P(3, 1, 'Il gestore', 'Il gestore verifica l’esito del trasferimento, riprende il buffer e risveglia il processo. L’operazione dura 3 µs: all’istante ' + c.pronto + ' µs il processo è pronto.', { calc: c.irq + ' + 3 = ' + c.pronto + ' µs', chiedi: { d: 'Il processo è pronto. È già in esecuzione?', o: ['Sì', 'No, attende il turno assegnato dallo scheduler'], g: 1, no: 'Lo stato di pronto indica l’attesa del processore. Il turno è stabilito dallo scheduler.' } });
      P(4, 2, 'La ripresa', (p.s === 0 ? 'Il processore è libero, e lo scheduler lo assegna immediatamente al processo.' : 'Altri processi sono in attesa, e lo scheduler impone al processo un’attesa di ' + p.s + ' µs.') + ' La ripresa avviene all’istante ' + c.ripresa + ' µs. La chiamata di lettura ritorna, e il programma trova i dati nel buffer.', { calc: c.pronto + ' + ' + p.s + ' = ' + c.ripresa + ' µs' });
      P(5, 2, 'Il totale', 'Fra l’ultimo byte e la ripresa sono trascorsi ' + c.ripresa + ' − ' + p.t + ' = ' + c.int + ' µs: ' + p.b + ' di notifica, 3 di gestore, ' + p.s + ' di attesa del turno.' + (p.s === 0 ? ' L’attesa dello scheduler è nulla, mentre l’intervallo resta positivo.' : ' Soltanto ' + p.s + ' dipendono dallo scheduler.'), { calc: p.b + ' + 3 + ' + p.s + ' = ' + c.int + ' µs', esito: [c.int + ' µs', ''] });
      return { passi, esito: c.int };
    }
  },
  bilancio: {
    regola: [
      'Ripresa = istante dell’ultimo byte + ritardo della notifica + tempo del gestore + attesa dello scheduler.',
      'I dati disponibili e il processo in esecuzione sono due eventi distinti, separati da interrupt, gestore e scheduler.'
    ],
    errori: [
      ['Collocare la ripresa del processo all’arrivo dell’ultimo byte.', 'Il sistema ne è informato soltanto dall’interrupt di completamento.'],
      ['Considerare in esecuzione il processo appena risvegliato.', 'Il risveglio lo rende pronto, mentre il processore gli è assegnato dallo scheduler.'],
      ['Attribuire l’intero ritardo allo scheduler.', 'Notifica e gestore restano anche quando il processore è libero.']
    ],
    saFare: ['Porre in ordine ultimo byte, interrupt, risveglio e ripresa.', 'Calcolare l’istante della ripresa.', 'Separare la parte di ritardo dovuta allo scheduler.'],
    esercizi: [
      { d: 'L’ultimo byte di un trasferimento DMA giunge all’istante 60 µs. L’interrupt è emesso dopo 5 µs, il gestore impiega 3 µs, e lo scheduler impone al processo un’attesa di 12 µs. A quale istante riprende il processo, in microsecondi?', segnaposto: 'Un numero', giuste: ['80', '80µs', '80μs', '80us'],
        ok: '60 + 5 + 3 + 12 = 80 µs.',
        diagnosi: [
          { se: ['20', '20µs', '20μs', '20us'], msg: 'Questo è l’intervallo dopo l’ultimo byte. L’istante si conta dall’inizio: va sommato 60.' },
          { se: ['77', '77µs', '77μs', '77us'], msg: 'Mancano i 3 µs del gestore.' },
          { se: ['68', '68µs', '68μs', '68us'], msg: 'A 68 µs il processo è pronto, e attende quindi 12 µs il proprio turno.' }
        ],
        altro: 'Il valore è diverso. Si sommino all’istante dell’ultimo byte i tre ritardi.',
        indizi: ['Interrupt: 60 + 5 = 65 µs.', 'Processo pronto: 65 + 3 = 68 µs.', 'Ripresa: 68 + 12 = 80 µs.'],
        svolgimento: ['Interrupt: 65 µs.', 'Processo pronto: 68 µs.', 'Ripresa: 80 µs.'] },
      { d: 'Nella medesima situazione, quanti microsecondi trascorrono fra l’ultimo byte e la ripresa?', segnaposto: 'Un numero', giuste: ['20', '20µs', '20μs', '20us'],
        ok: '5 + 3 + 12 = 20 µs.',
        diagnosi: [
          { se: ['80', '80µs', '80μs', '80us'], msg: 'Questo è l’istante della ripresa. L’intervallo si conta dall’ultimo byte, a 60 µs.' },
          { se: ['17', '17µs', '17μs', '17us'], msg: 'Mancano i 3 µs del gestore.' },
          { se: ['12', '12µs', '12μs', '12us'], msg: 'Questa è la sola attesa dello scheduler, preceduta da notifica e gestore.' }
        ],
        altro: 'Il valore è diverso. Si sommino notifica, gestore e attesa dello scheduler.',
        indizi: ['Notifica: 5 µs.', 'Gestore: 3 µs.', '5 + 3 + 12 = 20.'],
        svolgimento: ['Notifica: 5 µs.', 'Gestore: 3 µs.', 'Scheduler: 12 µs.', 'Intervallo: 20 µs.'] },
      { d: 'Il processore è libero, e lo scheduler assegna immediatamente il turno al processo risvegliato. L’intervallo fra l’ultimo byte e la ripresa si annulla?', guida: 'Si scelga la risposta.', o: [
        { t: 'No, restano il ritardo della notifica e il lavoro del gestore', ok: true, fb: 'Senza interrupt e senza gestore il sistema ignorerebbe l’arrivo dei dati.' },
        { t: 'Sì, il processo riprende all’arrivo dell’ultimo byte', fb: 'All’arrivo dell’ultimo byte il processo è ancora sospeso.' },
        { t: 'Sì, purché il trasferimento impieghi il DMA', fb: 'Il DMA libera il processore durante il trasferimento. Il completamento va in ogni caso notificato.' }] }
    ],
    sfida: ['cslez4_7_04_dma_04', 'Costo temporale e impegno della CPU']
  }
});
