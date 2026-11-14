'use strict';
SL.unita452 = (() => {
  const N = (v) => (v < 10000 ? String(v) : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
  const conto = (p) => { const byte = p.n * p.b, tras = byte / 128; return { ultimo: p.l + p.n - 1, byte, tras, off: p.l * p.b, acc: 6000, tot: 6000 + tras }; };
  // fase: 0 la richiesta · 1 l'intervallo · 2 lo scostamento · 3 i byte · 4 il posizionamento · 5 il trasferimento · 6 il servizio
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], lista = [p.l - 1, p.l, p.l + 1, null, c.ultimo, c.ultimo + 1].filter((v) => v == null || v >= 0);
    els.push(el.nota(pre + 'ta', o.x, o.y, 'BLOCCHI DEL DISCO · numerati da 0', 'mono'));
    lista.forEach((v, k) => els.push(v == null ? el.cella(pre + 'bp', o.x + k * (o.wb + 4), o.y + 26, o.wb, 34, '· · ·', f >= 1 ? 'on' : '', { piccola: true }) : el.cella(pre + 'b' + v, o.x + k * (o.wb + 4), o.y + 26, o.wb, 34, String(v), v < p.l || v > c.ultimo ? 'off' : f === 1 && (v === p.l || v === c.ultimo) ? 'att' : f >= 5 ? 'on' : f >= 1 ? 'on' : v === p.l ? 'att' : '', { piccola: true })));
    const w4 = (o.w - 3 * 10) / 4, y1 = o.y + 78, y2 = y1 + 66;
    [['primo blocco', String(p.l), 0], ['ultimo blocco', f >= 1 ? String(c.ultimo) : '·', 1], ['comincia al byte', f >= 2 ? N(c.off) : '·', 2], ['byte richiesti', f >= 3 ? N(c.byte) : '·', 3]].forEach((r, k) => els.push(el.box(pre + 'p' + k, o.x + k * (w4 + 10), y1, w4, 54, r[0], r[1], f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    [['seek', f >= 4 ? '4000 µs' : '·', 4], ['rotazione', f >= 4 ? '2000 µs' : '·', 4], ['trasferimento', f >= 5 ? N(c.tras) + ' µs' : '·', 5], ['tempo di servizio', f >= 6 ? N(c.tot) + ' µs' : '·', 6]].forEach((r, k) => els.push(el.box(pre + 't' + k, o.x + k * (w4 + 10), y2, w4, 54, r[0], r[1], f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { N, conto, quadro };
})();
SL.registra('4.5.2', {
  titolo: 'Blocchi logici e prestazioni quantitative',
  obiettivo: 'Obiettivo: tradurre una richiesta espressa in blocchi in un intervallo di byte, e calcolare quanto tempo impiega il disco a servirla.',
  concetti: [['byte', 'Blocchi numerati da zero'], ['disco', 'Il posizionamento si paga una volta'], ['clock', 'Millisecondi e microsecondi']],
  filigrana: ['disco', 'byte', 'clock'],
  richiami: {
    carte: [
      { sim: 'disco', da: 'Dall’unità 4.5.1', t: 'Seek e rotazione', d: 'I due movimenti meccanici che precedono la lettura di un settore.' },
      { sim: 'bus', da: 'Dall’unità 4.4.2', t: 'I megabyte al secondo', d: 'Un milione di byte al secondo equivale a un byte per microsecondo.' },
      { sim: 'memory', da: 'Dall’unità 1.1.2', t: 'L’indirizzo', d: 'Il numero che individua una posizione, contando da zero.' }
    ],
    domanda: { d: 'Prima di proseguire: quanti microsecondi contiene un millisecondo?', o: [
      { t: '1000', ok: true, fb: 'Un millisecondo è un millesimo di secondo, un microsecondo un milionesimo.' },
      { t: '100', fb: 'Fra milli e micro c’è un fattore mille.' },
      { t: '1 000 000', fb: 'Un milione sono i microsecondi in un secondo intero.' }
    ] }
  },
  idea: {
    titolo: 'Il disco visto come una fila di blocchi',
    termini: ['blocco logico', 'lba', 'lettura sequenziale', 'tempo di servizio'],
    testo: [
      'Chi usa un disco non ragiona in cilindri e settori. Il disco si presenta come una lunga fila di blocchi della stessa dimensione, numerati a partire da zero. Ciascuno è un [[blocco logico]], e il suo numero si chiama [[lba|LBA]]. Trovare il punto della superficie in cui un blocco è scritto è compito del disco. Con blocchi da 512 byte, il blocco 0 comincia al byte 0 e il blocco 20 comincia al byte 20 × 512 = 10 240.',
      'Una richiesta indica il primo blocco e quanti leggerne. Otto blocchi a partire dal 20 sono i blocchi dal 20 al 27: l’ultimo ha numero 20 + 8 − 1, perché il primo fa già parte del conto. I byte richiesti sono 8 × 512 = 4096.',
      { fig: 'scena', w: 720, h: 214, titolo: 'Otto blocchi da 512 byte a partire dal blocco 20', nota: 'Seek e rotazione si pagano una volta, poi i blocchi scorrono uno dopo l’altro sotto la testina.', els: SL.unita452.quadro('g', { l: 20, n: 8, b: 512 }, 6, { x: 10, y: 0, wb: 84, w: 700 }) },
      'Il tempo si compone di due parti molto diverse. La prima è il posizionamento, cioè seek e rotazione, che nel modello valgono 4 ms e 2 ms. La seconda è il trasferimento. Il disco del modello fa passare sotto la testina 128 milioni di byte al secondo, cioè 128 byte ogni microsecondo, e 4096 byte richiedono 32 microsecondi. Per sommare le due parti serve la stessa unità: 6 ms sono 6000 µs, e il totale è 6032 µs.',
      'I blocchi sono consecutivi, e dopo il primo gli altri arrivano da soli sotto la testina: è una [[lettura sequenziale]], che paga il posizionamento una volta sola. Il totale, dall’inizio della richiesta all’ultimo byte, è il [[tempo di servizio]]. In una richiesta breve il posizionamento pesa quasi per intero. Leggere otto volte più dati sposta il totale di poco, da 6032 a 6256 µs.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai il primo blocco, il numero di blocchi consecutivi e la dimensione di un blocco. Seek e rotazione sono fissati a 4 ms e 2 ms.',
      'Ricaveremo l’intervallo dei blocchi, il byte di partenza e i byte richiesti, e poi le due parti del tempo. Aumenta i blocchi da 8 a 256 e osserva quanto poco cresce il totale.'
    ],
    vedrai: [
      ['byte', 'I blocchi', 'In alto: un tratto della fila di blocchi, con quelli richiesti accesi.'],
      ['tabella', 'La richiesta in byte', 'Al centro: primo e ultimo blocco, byte di partenza, byte richiesti.'],
      ['clock', 'I tempi', 'In basso: seek, rotazione, trasferimento e tempo di servizio, in microsecondi.']
    ]
  },
  lab: {
    titolo: 'Una lettura sequenziale',
    scena: { w: 860, h: 214 },
    atti: ['La richiesta', 'Blocchi e byte', 'I tempi', 'Il servizio'],
    controlli: [
      { id: 'l', tipo: 'scelta', eti: 'Primo blocco', opzioni: [[0, '0'], [20, '20'], [100, '100']], valore: 20 },
      { id: 'n', tipo: 'scelta', eti: 'Blocchi', opzioni: [[8, '8'], [64, '64'], [256, '256']], valore: 8 },
      { id: 'b', tipo: 'scelta', eti: 'Dimensione', opzioni: [[512, '512 byte'], [4096, '4096 byte']], valore: 512 }
    ],
    nota: 'I passi sono sempre sette. Il disco trasferisce 128 byte per microsecondo.',
    previsione: {
      domanda: (p) => 'Il disco deve leggere ' + p.n + ' blocchi consecutivi da ' + p.b + ' byte. Il seek dura 4 ms, la rotazione 2 ms, e il trasferimento procede a 128 byte per microsecondo. Quanto dura la richiesta?',
      opzioni: (p) => { const U = SL.unita452, c = U.conto(p); return [c.tras, c.tot, p.n * 6000 + c.tras].map((v) => [v, U.N(v) + ' µs']); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita452, c = U.conto(p); return 'La previsione indicava ' + U.N(pred) + ' µs. Il tempo di servizio è ' + U.N(esito) + ' µs. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === c.tras ? 'Al trasferimento vanno sommati seek e rotazione: 6000 µs.' : 'I blocchi sono consecutivi, e il posizionamento si paga una volta sola.'); },
    costruisci(p) {
      const U = SL.unita452, c = U.conto(p), N = U.N, passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wb: 96, w: 820 });
      const hud = (f) => [['Byte', f >= 3 ? N(c.byte) : '·', 'a'], ['Trasferimento', f >= 5 ? N(c.tras) + ' µs' : '·'], ['Servizio', f >= 6 ? N(c.tot) + ' µs' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Il sistema chiede al disco ' + p.n + ' blocchi consecutivi a partire dal blocco ' + p.l + '. Ogni blocco contiene ' + p.b + ' byte.', {});
      P(1, 1, 'L’intervallo dei blocchi', 'Il primo blocco è il ' + p.l + ', e fa parte del conto. L’ultimo è il ' + p.l + ' + ' + p.n + ' − 1 = ' + c.ultimo + '.', { calc: p.l + ' + ' + p.n + ' − 1 = ' + c.ultimo, chiedi: { d: 'Qual è l’ultimo blocco letto?', o: [String(p.l + p.n), String(c.ultimo), String(c.ultimo + 2)], g: 1, no: 'Contando ' + p.n + ' blocchi a partire dal ' + p.l + ' compreso si arriva al ' + c.ultimo + '.' } });
      P(2, 1, 'Il byte di partenza', p.l === 0 ? 'Il blocco 0 è il primo della fila, e comincia al byte 0.' : 'Prima del blocco ' + p.l + ' ci sono ' + p.l + ' blocchi interi. La lettura comincia al byte ' + p.l + ' × ' + p.b + ' = ' + N(c.off) + '.', { calc: p.l + ' × ' + p.b + ' = ' + N(c.off) });
      P(3, 1, 'I byte richiesti', 'I blocchi sono ' + p.n + ', ciascuno di ' + p.b + ' byte: in tutto ' + N(c.byte) + ' byte.', { calc: p.n + ' × ' + p.b + ' = ' + N(c.byte) + ' byte' });
      P(4, 2, 'Il posizionamento', 'Il braccio raggiunge il cilindro in 4 ms, e il primo blocco arriva sotto la testina dopo altri 2 ms. In microsecondi: 6 × 1000 = 6000 µs. Questo costo si paga una volta, all’inizio.', { calc: '(4 + 2) × 1000 = 6000 µs' });
      P(5, 2, 'Il trasferimento', 'I blocchi scorrono sotto la testina uno dopo l’altro. A 128 byte per microsecondo, ' + N(c.byte) + ' byte richiedono ' + N(c.byte) + ' ÷ 128 = ' + N(c.tras) + ' µs.', { calc: N(c.byte) + ' ÷ 128 = ' + N(c.tras) + ' µs' });
      P(6, 3, 'Il tempo di servizio', 'Posizionamento e trasferimento insieme: ' + N(c.tot) + ' µs. ' + (c.tras < 6000 ? 'Il posizionamento pesa più del trasferimento: su ' + N(c.tot) + ' µs, 6000 se ne vanno prima di leggere il primo byte.' : 'Con ' + N(c.byte) + ' byte il trasferimento supera il posizionamento, che resta di 6000 µs.'), { calc: '6000 + ' + N(c.tras) + ' = ' + N(c.tot) + ' µs', esito: [N(c.tot) + ' µs', ''] });
      return { passi, esito: c.tot };
    }
  },
  bilancio: {
    regola: [
      'Ultimo blocco = primo + numero di blocchi − 1. Byte di partenza = primo blocco × dimensione. Byte richiesti = numero di blocchi × dimensione.',
      'Tempo di servizio di una lettura sequenziale = seek + rotazione + byte ÷ velocità di trasferimento, tutto nella stessa unità.'
    ],
    errori: [
      ['Calcolare l’ultimo blocco come primo + numero.', 'Il primo blocco fa già parte del conto: va sottratto 1.'],
      ['Sommare millisecondi e microsecondi.', 'Un millisecondo vale 1000 microsecondi. Prima si converte, poi si somma.'],
      ['Moltiplicare il posizionamento per il numero di blocchi.', 'In una lettura sequenziale seek e rotazione si pagano una volta.']
    ],
    saFare: ['Determinare l’ultimo blocco di una richiesta.', 'Calcolare byte di partenza e byte richiesti.', 'Calcolare il tempo di servizio in microsecondi.'],
    esercizi: [
      { d: 'I blocchi di un disco contengono 4096 byte e sono numerati da 0. A quale byte comincia il blocco 12?', segnaposto: 'Un numero', giuste: ['49152', '49.152', '49152byte'],
        ok: '12 × 4096 = 49 152.',
        diagnosi: [
          { se: ['53248'], msg: 'Il blocco 12 è preceduto da 12 blocchi, dal numero 0 al numero 11.' },
          { se: ['45056'], msg: 'Prima del blocco 12 ci sono 12 blocchi interi: la numerazione parte da 0.' },
          { se: ['6144'], msg: 'In questo disco i blocchi sono da 4096 byte.' }
        ],
        altro: 'Il numero è diverso. Si moltiplichi il numero del blocco per la dimensione.',
        indizi: ['Prima del blocco 12 ci sono 12 blocchi.', 'Ognuno occupa 4096 byte.', '12 × 4096 = 49 152.'],
        svolgimento: ['Blocchi precedenti: 12.', 'Byte: 12 × 4096 = 49 152.'] },
      { d: 'Una lettura comincia al blocco 30 e comprende 16 blocchi consecutivi. Qual è il numero dell’ultimo blocco letto?', segnaposto: 'Un numero', giuste: ['45', 'quarantacinque'],
        ok: '30 + 16 − 1 = 45.',
        diagnosi: [
          { se: ['46'], msg: 'Il blocco 30 fa già parte dei sedici: l’ultimo è 30 + 16 − 1.' },
          { se: ['16'], msg: 'Sedici è il numero dei blocchi. L’ultimo si trova partendo dal 30.' },
          { se: ['44'], msg: 'Dal 30 al 44 i blocchi sono quindici.' }
        ],
        altro: 'Il numero è diverso. Conta sedici blocchi cominciando dal 30 compreso.',
        indizi: ['Il primo blocco è il 30.', 'Ne seguono altri 15.', '30 + 15 = 45.'],
        svolgimento: ['Primo: 30.', 'Ultimo: 30 + 16 − 1 = 45.'] },
      { d: 'Una richiesta paga 5 ms di seek e 3 ms di rotazione, e poi trasferisce 25 600 byte a 128 byte per microsecondo. Qual è il tempo di servizio, in microsecondi?', segnaposto: 'Un numero', giuste: ['8200', '8.200', '8200µs', '8200μs', '8200us'],
        ok: '8 ms sono 8000 µs. Il trasferimento dura 25 600 ÷ 128 = 200 µs. Totale: 8200 µs.',
        diagnosi: [
          { se: ['208', '208µs', '208μs', '208us'], msg: 'Hai sommato millisecondi e microsecondi. Gli 8 ms valgono 8000 µs.' },
          { se: ['200', '200µs', '200μs', '200us'], msg: 'Questo è il solo trasferimento. Mancano seek e rotazione.' },
          { se: ['8000', '8000µs', '8000μs', '8000us'], msg: 'Questo è il solo posizionamento. Manca il trasferimento.' }
        ],
        altro: 'Il valore è diverso. Si converta il posizionamento in microsecondi e si sommi il trasferimento.',
        indizi: ['5 + 3 = 8 ms, cioè 8000 µs.', '25 600 ÷ 128 = 200 µs.', '8000 + 200 = 8200.'],
        svolgimento: ['Posizionamento: 8 ms = 8000 µs.', 'Trasferimento: 25 600 ÷ 128 = 200 µs.', 'Servizio: 8200 µs.'] }
    ],
    sfida: ['cslez4_5_03_disks_03', 'Indirizzamento a blocchi e frammentazione']
  }
});
