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
  obiettivo: 'Obiettivo: confrontare il lavoro che un trasferimento richiede al processore con l’I/O programmato e con il DMA, e determinare la lunghezza a partire dalla quale il DMA è vantaggioso.',
  concetti: [['cpu', 'Il processore sposta ogni parola'], ['dispositivo', 'La delega al dispositivo'], ['bilancio', 'Un costo fisso da compensare']],
  filigrana: ['dispositivo', 'cpu', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'dispositivo', da: 'Dall’unità 4.3.1', t: 'Il driver', d: 'Il programma del kernel che comanda un dispositivo attraverso i suoi registri.' },
      { sim: 'interrupt', da: 'Dall’unità 4.3.2', t: 'La richiesta di interruzione', d: 'Il segnale con cui un dispositivo avvisa il processore.' },
      { sim: 'bus', da: 'Dall’unità 4.4.1', t: 'L’iniziatore', d: 'Il componente che avvia una transazione sul bus, talvolta un controller.' }
    ],
    domanda: { d: 'Prima di proseguire: un’operazione costa 6 cicli e va ripetuta per 7 parole. Quanti cicli occorrono complessivamente?', o: [
      { t: '42', ok: true, fb: '6 × 7 = 42.' },
      { t: '13', fb: 'I cicli si ripetono per ogni parola: vanno moltiplicati.' },
      { t: '36', fb: 'Trentasei cicli sono sufficienti per sei parole.' }
    ] }
  },
  idea: {
    titolo: 'Il componente che sposta i dati',
    termini: ['i/o programmato', 'dma'],
    testo: [
      'Un dispositivo ha ricevuto alcuni dati, che devono essere trasferiti nella memoria. Nel modo più diretto il trasferimento è compiuto dal processore. Il driver legge una parola dal registro del dispositivo, la scrive nella memoria, e ripete l’operazione per la parola successiva. Questa tecnica prende il nome di [[i/o programmato|I/O programmato]]: ogni parola è trasferita dal processore, e il lavoro cresce con la lunghezza del trasferimento. Nel modello di questa unità una parola vale quattro byte e costa sei cicli.',
      'L’alternativa è la delega. Con l’accesso diretto alla memoria, abbreviato [[dma|DMA]], il driver comunica al dispositivo la posizione del buffer e la quantità di dati da trasferire. Il dispositivo procede quindi in modo autonomo: diviene iniziatore sul bus e scrive le parole nella memoria in successione. Nel frattempo il processore esegue altre istruzioni. Esso interviene di nuovo al termine, quando un interrupt lo avvisa, per verificare l’esito del trasferimento.',
      'Il DMA ha pertanto un costo fisso, indipendente dalla lunghezza: la preparazione della richiesta e il controllo finale. Con 32 cicli di preparazione e 8 di completamento il costo è di 40 cicli, per qualunque numero di parole. Per sei parole l’I/O programmato ne richiede 36, ed è ancora più economico. Per sette ne richiede 42, e da tale lunghezza il DMA è vantaggioso, con un margine che cresce a ogni parola.',
      { fig: 'scena', w: 720, h: 222, titolo: 'Sedici parole, 32 cicli di preparazione', nota: 'L’I/O programmato costa 96 cicli, il DMA 40. Il calcolo riguarda il lavoro del processore, ed esclude il tempo di transito dei dati sul bus.', els: SL.unita471.quadro('g', { n: 16, s: 32 }, 5, { x: 10, y: 0, w: 700, wv: 170 }) },
      'Il confronto misura i cicli sottratti al processore. Il tempo durante il quale il bus trasporta i dati è una grandezza diversa, e con il DMA trascorre mentre il processore è libero. La soglia si determina confrontando 6 × n con il costo fisso: il DMA è vantaggioso dalla prima lunghezza per cui 6 × n lo supera.'
    ]
  },
  esperimento: {
    faremo: [
      'Un dispositivo deve trasferire nella memoria un dato numero di parole. I controlli fissano il numero delle parole e i cicli che la preparazione di una richiesta DMA costa al driver.',
      'L’esperimento conta i cicli del processore nei due modi, e determina la lunghezza a partire dalla quale il DMA comporta un risparmio. È istruttivo esaminare 4 parole con 16 cicli di preparazione, che costituiscono un caso particolare.'
    ],
    vedrai: [
      ['cpu', 'Le due barre', 'In alto: i cicli impiegati dal processore con l’I/O programmato e con il DMA, nella medesima scala.'],
      ['tabella', 'Il bilancio', 'In basso: parole, byte, risparmio e lunghezza dalla quale il DMA è vantaggioso.']
    ]
  },
  lab: {
    titolo: 'La convenienza della delega',
    scena: { w: 860, h: 222 },
    atti: ['La richiesta', 'I due modi', 'Il confronto'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Parole', opzioni: [[4, '4'], [7, '7'], [16, '16'], [64, '64']], valore: 16 },
      { id: 's', tipo: 'scelta', eti: 'Preparazione del DMA', opzioni: [[16, '16 cicli'], [32, '32 cicli'], [64, '64 cicli']], valore: 32 }
    ],
    nota: 'I passi sono sempre sei. L’I/O programmato costa 6 cicli per parola, il completamento del DMA 8 cicli.',
    previsione: {
      domanda: (p) => 'Vanno trasferite ' + p.n + ' parole. L’I/O programmato costa al processore 6 cicli per parola. Il DMA gli costa ' + p.s + ' cicli di preparazione e 8 di completamento. Quale dei due modi impegna meno il processore?',
      opzioni: () => [['pio', 'L’I/O programmato'], ['dma', 'Il DMA'], ['pari', 'Nessuno dei due, poiché i costi sono uguali']]
    },
    confronto: (pred, esito, p) => { const c = SL.unita471.conto(p), N = { pio: 'l’I/O programmato', dma: 'il DMA', pari: 'la parità' }; return 'La previsione indicava: ' + N[pred] + '. I/O programmato ' + c.pio + ' cicli, DMA ' + c.dma + ' cicli: ' + (esito === 'pari' ? 'i costi coincidono. ' : 'impegna meno ' + N[esito] + '. ') + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il costo del DMA è fisso, mentre quello dell’I/O programmato cresce con le parole: la soglia è a ' + c.soglia + ' parole.'); },
    costruisci(p) {
      const U = SL.unita471, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820, wv: 190 });
      const hud = (f) => [['I/O programmato', f >= 1 ? c.pio + ' cicli' : '·', 'a'], ['DMA', f >= 3 ? c.dma + ' cicli' : f === 2 ? p.s + ' cicli' : '·'], ['Risparmio', f >= 4 ? c.risp + ' cicli' : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'La richiesta', 'Un dispositivo ha pronte ' + p.n + ' parole da trasferire nella memoria. Ogni parola vale quattro byte: complessivamente ' + 4 * p.n + ' byte.', {});
      P(1, 1, 'Con l’I/O programmato', 'Il driver legge ogni parola dal registro del dispositivo e la scrive nel buffer. Ogni parola costa 6 cicli, e per l’intera durata il processore è occupato dal trasferimento.', { calc: '6 × ' + p.n + ' = ' + c.pio + ' cicli' });
      P(2, 1, 'Con il DMA: la preparazione', 'Il driver comunica al dispositivo l’indirizzo del buffer e la lunghezza, e ne avvia il trasferimento. Questa preparazione costa ' + p.s + ' cicli. Il dispositivo trasferisce quindi le parole in modo autonomo, e il processore torna ad altri compiti.', { calc: 'preparazione: ' + p.s + ' cicli' });
      P(3, 1, 'Con il DMA: il completamento', 'Al termine del trasferimento un interrupt richiede l’intervento del processore. Il driver verifica l’esito e riprende il buffer: altri 8 cicli. Il costo totale è indipendente dal numero di parole.', { calc: p.s + ' + 8 = ' + c.dma + ' cicli', chiedi: { d: 'Se le parole fossero il doppio, quale dei due costi crescerebbe?', o: ['Quello dell’I/O programmato', 'Quello del DMA', 'Entrambi'], g: 0, no: 'Preparazione e completamento del DMA restano invariati. L’I/O programmato richiede 6 cicli per ogni parola aggiuntiva.' } });
      P(4, 2, 'Il confronto', c.meno === 'dma' ? 'Il DMA consente al processore un risparmio di ' + c.pio + ' − ' + c.dma + ' = ' + c.risp + ' cicli.' : c.meno === 'pio' ? 'Per un trasferimento di questa lunghezza il costo fisso del DMA supera il lavoro evitato: il risparmio è negativo, ' + c.risp + ' cicli. È preferibile l’I/O programmato.' : 'I due modi costano i medesimi ' + c.pio + ' cicli: è il punto di pareggio.', { calc: c.pio + ' − ' + c.dma + ' = ' + c.risp + ' cicli', esito: [c.meno === 'pari' ? 'pareggio' : 'meno lavoro con ' + (c.meno === 'dma' ? 'il DMA' : 'l’I/O programmato'), ''] });
      P(5, 2, 'La soglia', 'Il DMA è vantaggioso quando 6 × n supera ' + c.dma + '. La divisione ' + c.dma + ' ÷ 6 dà ' + (c.dma % 6 === 0 ? 'esattamente ' + c.dma / 6 + ', che è il pareggio' : 'un numero fra ' + Math.floor(c.dma / 6) + ' e ' + (Math.floor(c.dma / 6) + 1)) + ': la prima lunghezza con un risparmio è di ' + c.soglia + ' parole. Il trasferimento scelto ne ha ' + p.n + '.', { calc: '6 × ' + c.soglia + ' = ' + 6 * c.soglia + ' > ' + c.dma, esito: [c.meno === 'pari' ? 'pareggio' : 'meno lavoro con ' + (c.meno === 'dma' ? 'il DMA' : 'l’I/O programmato'), ''] });
      return { passi, esito: c.meno };
    }
  },
  bilancio: {
    regola: [
      'I/O programmato: il lavoro del processore vale cicli per parola × parole. DMA: vale preparazione + completamento, qualunque sia la lunghezza.',
      'Il DMA è vantaggioso dalla prima lunghezza per cui il costo dell’I/O programmato supera il costo fisso.'
    ],
    errori: [
      ['Considerare il DMA sempre più economico.', 'Per trasferimenti brevi il costo fisso supera il lavoro evitato.'],
      ['Contare come soglia il punto di pareggio.', 'Al pareggio i costi sono uguali. Il risparmio ha inizio dalla parola successiva.'],
      ['Confondere il lavoro del processore con la durata del trasferimento.', 'Con il DMA i dati impiegano in ogni caso tempo sul bus, e nel frattempo il processore è libero.']
    ],
    saFare: ['Calcolare i cicli dell’I/O programmato.', 'Calcolare il costo fisso del DMA.', 'Determinare la lunghezza dalla quale il DMA è vantaggioso.'],
    esercizi: [
      { d: 'L’I/O programmato costa 6 cicli per parola. Una richiesta DMA costa 20 cicli di preparazione e 8 di completamento. Per 10 parole, quanti cicli di risparmio consente il DMA al processore?', segnaposto: 'Un numero', giuste: ['32', '32cicli', 'trentadue'],
        ok: 'I/O programmato: 60 cicli. DMA: 28 cicli. Differenza: 32.',
        diagnosi: [
          { se: ['28', '28cicli'], msg: 'Questo è il costo del DMA. Il risparmio è la differenza con i 60 cicli dell’I/O programmato.' },
          { se: ['60', '60cicli'], msg: 'Questo è il costo dell’I/O programmato. Va sottratto il costo del DMA.' },
          { se: ['40', '40cicli'], msg: 'Al DMA vanno attribuiti anche gli 8 cicli del completamento.' }
        ],
        altro: 'Il numero è diverso. Si calcolino i due costi e si sottragga.',
        indizi: ['I/O programmato: 6 × 10.', 'DMA: 20 + 8.', '60 − 28 = 32.'],
        svolgimento: ['I/O programmato: 6 × 10 = 60 cicli.', 'DMA: 20 + 8 = 28 cicli.', 'Risparmio: 32 cicli.'] },
      { d: 'Con i medesimi costi, 6 cicli per parola a fronte di 20 + 8, qual è la prima lunghezza in parole per cui il DMA comporta un risparmio?', segnaposto: 'Un numero', giuste: ['5', 'cinque', '5parole'],
        ok: '4 parole costano 24 cicli, meno di 28. 5 parole ne costano 30, più di 28.',
        diagnosi: [
          { se: ['4', '4parole'], msg: 'Con 4 parole l’I/O programmato costa 24 cicli, ancora meno dei 28 del DMA.' },
          { se: ['6', '6parole'], msg: 'Già con 5 parole l’I/O programmato costa 30 cicli, più dei 28 del DMA.' }
        ],
        altro: 'Il numero è diverso. Si determini la prima lunghezza per cui 6 × n supera 28.',
        indizi: ['Il costo fisso del DMA è 28 cicli.', '6 × 4 = 24, 6 × 5 = 30.', 'Il primo valore che supera 28 è 30, con 5 parole.'],
        svolgimento: ['Costo del DMA: 28 cicli.', '6 × 4 = 24: è preferibile l’I/O programmato.', '6 × 5 = 30: è preferibile il DMA.'] },
      { d: 'Un trasferimento DMA di 64 parole mantiene occupato il bus per centinaia di cicli, e tuttavia il calcolo dell’unità gli attribuisce soltanto preparazione e completamento. Per quale ragione?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il calcolo misura il lavoro del processore, che durante il trasferimento è libero', ok: true, fb: 'Le parole sono trasferite dal dispositivo, mentre il processore esegue altre istruzioni.' },
        { t: 'Con il DMA i dati sono trasferiti senza occupare il bus', fb: 'I dati impiegano in ogni caso il bus. Varia il componente che li trasferisce.' },
        { t: 'Il completamento comprende già tutti i cicli del bus', fb: 'Il completamento è il solo controllo finale, di 8 cicli.' }] }
    ],
    sfida: ['cslez4_7_05_dma_05', 'Confrontare I/O programmato e DMA']
  }
});
