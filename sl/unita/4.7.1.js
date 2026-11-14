'use strict';
SL.unita471 = (() => {
  const conto = (p) => { const pio = 6 * p.n, dma = p.s + 8; return { pio, dma, risp: pio - dma, soglia: Math.floor(dma / 6) + 1, meno: pio < dma ? 'pio' : pio > dma ? 'dma' : 'pari' }; };
  // fase: 0 la richiesta · 1 l'I/O programmato · 2 la preparazione · 3 il completamento · 4 il confronto · 5 la soglia
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], max = Math.max(c.pio, c.dma), wb = o.w - o.wv - 14, parz = f === 2 ? p.s : c.dma;
    els.push(el.nota(pre + 't0', o.x, o.y, 'I/O PROGRAMMATO · il processore sposta ogni parola', 'mono'),
      Object.assign(el.barra(pre + 'b0', o.x, o.y + 24, wb, 30, f >= 1 ? c.pio / max : 0), f >= 4 && c.meno === 'dma' ? { st: 'err' } : null),
      el.box(pre + 'v0', o.x + wb + 14, o.y + 14, o.wv, 50, 'cicli spesi', f >= 1 ? String(c.pio) : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
      el.nota(pre + 't1', o.x, o.y + 76, 'DMA · il processore prepara e conclude', 'mono'),
      Object.assign(el.barra(pre + 'b1', o.x, o.y + 100, wb, 30, f >= 2 ? parz / max : 0), f >= 4 && c.meno === 'pio' ? { st: 'err' } : null),
      el.box(pre + 'v1', o.x + wb + 14, o.y + 90, o.wv, 50, 'cicli spesi', f >= 2 ? String(parz) : '·', f === 2 || f === 3 ? 'att' : f > 3 ? 'on' : '', { cls: 'stretta' }));
    const w4 = (o.w - 30) / 4;
    [['parole', String(p.n), 0], ['byte', String(4 * p.n), 0], ['risparmio del DMA', f >= 4 ? (c.risp > 0 ? '+' : '') + c.risp + ' cicli' : '·', 4], ['conviene da', f >= 5 ? c.soglia + ' parole' : '·', 5]].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (w4 + 10), o.y + 158, w4, 54, r[0], r[1], f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { conto, quadro };
})();
SL.registra('4.7.1', {
  titolo: 'I/O programmato e motivazione del DMA',
  obiettivo: 'Obiettivo: confrontare il lavoro che un trasferimento costa al processore con l’I/O programmato e con il DMA, e trovare la lunghezza da cui il DMA conviene.',
  concetti: [['cpu', 'Il processore sposta ogni parola'], ['dispositivo', 'Oppure delega al dispositivo'], ['bilancio', 'Un costo fisso da ripagare']],
  filigrana: ['dispositivo', 'cpu', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'dispositivo', da: 'Dall’unità 4.3.1', t: 'Il driver', d: 'Il programma del kernel che governa un dispositivo attraverso i suoi registri.' },
      { sim: 'interrupt', da: 'Dall’unità 4.3.2', t: 'La richiesta di interruzione', d: 'Il segnale con cui un dispositivo avvisa il processore.' },
      { sim: 'bus', da: 'Dall’unità 4.4.1', t: 'L’iniziatore', d: 'Chi avvia una transazione sul bus. A volte è un controller.' }
    ],
    domanda: { d: 'Prima di proseguire: un’operazione costa 6 cicli e va ripetuta per 7 parole. Quanti cicli in tutto?', o: [
      { t: '42', ok: true, fb: '6 × 7 = 42.' },
      { t: '13', fb: 'I cicli si ripetono per ogni parola: vanno moltiplicati.' },
      { t: '36', fb: 'Trentasei cicli bastano per sei parole.' }
    ] }
  },
  idea: {
    titolo: 'Chi sposta i dati',
    termini: ['i/o programmato', 'dma'],
    testo: [
      'Un dispositivo ha ricevuto dei dati, e questi devono arrivare nella memoria. Il modo più diretto è che se ne occupi il processore. Il driver legge una parola dal registro del dispositivo, la scrive nella memoria, e ripete per la parola successiva. È l’[[i/o programmato|I/O programmato]]: ogni parola passa per le mani del processore, e il lavoro cresce con la lunghezza del trasferimento. Nel modello di questa unità una parola vale quattro byte e costa sei cicli.',
      'L’alternativa è delegare. Con l’accesso diretto alla memoria, abbreviato [[dma|DMA]], il driver comunica al dispositivo dove si trova il buffer e quanti dati trasferire. Poi il dispositivo fa da sé: diventa iniziatore sul bus e scrive le parole nella memoria una dopo l’altra. Il processore, intanto, esegue altro. Torna in gioco alla fine, quando un interrupt lo avvisa, per controllare che tutto sia andato bene.',
      'Il DMA ha quindi un costo fisso, indipendente dalla lunghezza: la preparazione della richiesta e il controllo finale. Con 32 cicli di preparazione e 8 di completamento sono 40 cicli, per qualunque numero di parole. Per sei parole l’I/O programmato ne chiede 36, ed è ancora più economico. Per sette ne chiede 42, e da lì in avanti il DMA vince, con un vantaggio che cresce a ogni parola.',
      { fig: 'scena', w: 720, h: 222, titolo: 'Sedici parole, 32 cicli di preparazione', nota: 'L’I/O programmato costa 96 cicli, il DMA 40. Il conto riguarda il lavoro del processore, e lascia fuori il tempo che i dati passano sul bus.', els: SL.unita471.quadro('g', { n: 16, s: 32 }, 5, { x: 10, y: 0, w: 700, wv: 170 }) },
      'Il confronto misura i cicli sottratti al processore. Il tempo durante il quale il bus trasporta i dati è un’altra grandezza, e con il DMA scorre mentre il processore è libero. La soglia si trova confrontando 6 × n con il costo fisso: conviene il DMA dalla prima lunghezza per cui 6 × n lo supera.'
    ]
  },
  esperimento: {
    faremo: [
      'Un dispositivo deve trasferire nella memoria un certo numero di parole. Sceglierai quante sono, e quanti cicli costa al driver preparare una richiesta DMA.',
      'Conteremo i cicli del processore nei due modi, e cercheremo la lunghezza da cui il DMA fa risparmiare. Prova 4 parole con 16 cicli di preparazione: è un caso particolare.'
    ],
    vedrai: [
      ['cpu', 'Le due barre', 'In alto: i cicli spesi dal processore con l’I/O programmato e con il DMA, nella stessa scala.'],
      ['tabella', 'Il bilancio', 'In basso: parole, byte, risparmio e lunghezza da cui il DMA conviene.']
    ]
  },
  lab: {
    titolo: 'Quando conviene delegare',
    scena: { w: 860, h: 222 },
    atti: ['La richiesta', 'I due modi', 'Il confronto'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Parole', opzioni: [[4, '4'], [7, '7'], [16, '16'], [64, '64']], valore: 16 },
      { id: 's', tipo: 'scelta', eti: 'Preparazione del DMA', opzioni: [[16, '16 cicli'], [32, '32 cicli'], [64, '64 cicli']], valore: 32 }
    ],
    nota: 'I passi sono sempre sei. L’I/O programmato costa 6 cicli per parola, il completamento del DMA 8 cicli.',
    previsione: {
      domanda: (p) => 'Vanno trasferite ' + p.n + ' parole. L’I/O programmato costa al processore 6 cicli per parola. Il DMA gli costa ' + p.s + ' cicli di preparazione e 8 di completamento. Quale dei due modi impegna meno il processore?',
      opzioni: () => [['pio', 'L’I/O programmato'], ['dma', 'Il DMA'], ['pari', 'Nessuno dei due: i costi sono uguali']]
    },
    confronto: (pred, esito, p) => { const c = SL.unita471.conto(p), N = { pio: 'l’I/O programmato', dma: 'il DMA', pari: 'la parità' }; return 'La previsione indicava: ' + N[pred] + '. I/O programmato ' + c.pio + ' cicli, DMA ' + c.dma + ' cicli: ' + (esito === 'pari' ? 'i costi coincidono. ' : 'impegna meno ' + N[esito] + '. ') + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il costo del DMA è fisso, quello dell’I/O programmato cresce con le parole: la soglia è a ' + c.soglia + ' parole.'); },
    costruisci(p) {
      const U = SL.unita471, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, wv: 190 });
      const hud = (f) => [['I/O programmato', f >= 1 ? c.pio + ' cicli' : '·', 'a'], ['DMA', f >= 3 ? c.dma + ' cicli' : f === 2 ? p.s + ' cicli' : '·'], ['Risparmio', f >= 4 ? c.risp + ' cicli' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Un dispositivo ha pronte ' + p.n + ' parole da portare nella memoria. Ogni parola vale quattro byte: in tutto ' + 4 * p.n + ' byte.', {});
      P(1, 1, 'Con l’I/O programmato', 'Il driver legge ogni parola dal registro del dispositivo e la scrive nel buffer. Ogni parola costa 6 cicli, e per tutta la durata il processore non fa altro.', { calc: '6 × ' + p.n + ' = ' + c.pio + ' cicli' });
      P(2, 1, 'Con il DMA: la preparazione', 'Il driver comunica al dispositivo l’indirizzo del buffer e la lunghezza, e gli dà il via. Questa preparazione costa ' + p.s + ' cicli. Poi il dispositivo trasferisce le parole da solo, e il processore torna ad altri compiti.', { calc: 'preparazione: ' + p.s + ' cicli' });
      P(3, 1, 'Con il DMA: il completamento', 'Alla fine del trasferimento un interrupt richiama il processore. Il driver controlla l’esito e riprende il buffer: altri 8 cicli. Il costo totale non dipende dal numero di parole.', { calc: p.s + ' + 8 = ' + c.dma + ' cicli', chiedi: { d: 'Se le parole fossero il doppio, quale dei due costi crescerebbe?', o: ['Quello dell’I/O programmato', 'Quello del DMA', 'Entrambi'], g: 0, no: 'Preparazione e completamento del DMA restano gli stessi. L’I/O programmato paga 6 cicli per ogni parola in più.' } });
      P(4, 2, 'Il confronto', c.meno === 'dma' ? 'Il DMA fa risparmiare al processore ' + c.pio + ' − ' + c.dma + ' = ' + c.risp + ' cicli.' : c.meno === 'pio' ? 'Per un trasferimento così breve il costo fisso del DMA supera il lavoro evitato: il risparmio è negativo, ' + c.risp + ' cicli. Conviene l’I/O programmato.' : 'I due modi costano gli stessi ' + c.pio + ' cicli: è il punto di pareggio.', { calc: c.pio + ' − ' + c.dma + ' = ' + c.risp + ' cicli', esito: [c.meno === 'pari' ? 'pareggio' : 'meno lavoro con ' + (c.meno === 'dma' ? 'il DMA' : 'l’I/O programmato'), ''] });
      P(5, 2, 'La soglia', 'Il DMA conviene quando 6 × n supera ' + c.dma + '. Dividendo, ' + c.dma + ' ÷ 6 dà ' + (c.dma % 6 === 0 ? 'esattamente ' + c.dma / 6 + ', che è il pareggio' : 'un numero fra ' + Math.floor(c.dma / 6) + ' e ' + (Math.floor(c.dma / 6) + 1)) + ': la prima lunghezza con un risparmio è di ' + c.soglia + ' parole. Il trasferimento scelto ne ha ' + p.n + '.', { calc: '6 × ' + c.soglia + ' = ' + 6 * c.soglia + ' > ' + c.dma, esito: [c.meno === 'pari' ? 'pareggio' : 'meno lavoro con ' + (c.meno === 'dma' ? 'il DMA' : 'l’I/O programmato'), ''] });
      return { passi, esito: c.meno };
    }
  },
  bilancio: {
    regola: [
      'I/O programmato: il lavoro del processore vale cicli per parola × parole. DMA: vale preparazione + completamento, qualunque sia la lunghezza.',
      'Il DMA conviene dalla prima lunghezza per cui il costo dell’I/O programmato supera il costo fisso.'
    ],
    errori: [
      ['Considerare il DMA sempre più economico.', 'Per trasferimenti brevi il costo fisso supera il lavoro evitato.'],
      ['Contare come soglia il punto di pareggio.', 'Al pareggio i costi sono uguali. Il risparmio comincia dalla parola successiva.'],
      ['Confondere il lavoro del processore con la durata del trasferimento.', 'Con il DMA i dati impiegano comunque tempo sul bus, ma il processore intanto è libero.']
    ],
    saFare: ['Calcolare i cicli dell’I/O programmato.', 'Calcolare il costo fisso del DMA.', 'Determinare la lunghezza da cui il DMA conviene.'],
    esercizi: [
      { d: 'L’I/O programmato costa 6 cicli per parola. Una richiesta DMA costa 20 cicli di preparazione e 8 di completamento. Per 10 parole, quanti cicli fa risparmiare il DMA al processore?', segnaposto: 'Un numero', giuste: ['32', '32cicli', 'trentadue'],
        ok: 'I/O programmato: 60 cicli. DMA: 28 cicli. Differenza: 32.',
        diagnosi: [
          { se: ['28', '28cicli'], msg: 'Questo è il costo del DMA. Il risparmio è la differenza con i 60 cicli dell’I/O programmato.' },
          { se: ['60', '60cicli'], msg: 'Questo è il costo dell’I/O programmato. Va sottratto il costo del DMA.' },
          { se: ['40', '40cicli'], msg: 'Al DMA vanno addebitati anche gli 8 cicli del completamento.' }
        ],
        altro: 'Il numero è diverso. Si calcolino i due costi e si sottragga.',
        indizi: ['I/O programmato: 6 × 10.', 'DMA: 20 + 8.', '60 − 28 = 32.'],
        svolgimento: ['I/O programmato: 6 × 10 = 60 cicli.', 'DMA: 20 + 8 = 28 cicli.', 'Risparmio: 32 cicli.'] },
      { d: 'Con gli stessi costi, 6 cicli per parola contro 20 + 8, qual è la prima lunghezza in parole per cui il DMA fa risparmiare?', segnaposto: 'Un numero', giuste: ['5', 'cinque', '5parole'],
        ok: '4 parole costano 24 cicli, meno di 28. 5 parole ne costano 30, più di 28.',
        diagnosi: [
          { se: ['4', '4parole'], msg: 'Con 4 parole l’I/O programmato costa 24 cicli, ancora meno dei 28 del DMA.' },
          { se: ['6', '6parole'], msg: 'Già con 5 parole l’I/O programmato costa 30 cicli, più dei 28 del DMA.' }
        ],
        altro: 'Il numero è diverso. Cerca la prima lunghezza per cui 6 × n supera 28.',
        indizi: ['Il costo fisso del DMA è 28 cicli.', '6 × 4 = 24, 6 × 5 = 30.', 'Il primo valore che supera 28 è 30, con 5 parole.'],
        svolgimento: ['Costo del DMA: 28 cicli.', '6 × 4 = 24: conviene l’I/O programmato.', '6 × 5 = 30: conviene il DMA.'] },
      { d: 'Un trasferimento DMA di 64 parole tiene occupato il bus per centinaia di cicli, eppure il conto dell’unità gli addebita soltanto preparazione e completamento. Perché?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il conto misura il lavoro del processore, che durante il trasferimento è libero', ok: true, fb: 'Le parole le sposta il dispositivo, mentre il processore esegue altro.' },
        { t: 'Con il DMA i dati viaggiano senza occupare il bus', fb: 'I dati passano comunque dal bus. A cambiare è chi li sposta.' },
        { t: 'Il completamento comprende già tutti i cicli del bus', fb: 'Il completamento è il solo controllo finale, di 8 cicli.' }] }
    ],
    sfida: ['cslez4_7_05_dma_05', 'Confrontare I/O programmato e DMA']
  }
});
