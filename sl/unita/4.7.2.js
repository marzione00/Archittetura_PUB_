'use strict';
SL.unita472 = (() => {
  const BASE = 0x6000, H = (v) => '0x' + v.toString(16).toUpperCase();
  const conto = (p) => { const k = Math.ceil(p.n / p.w), piene = Math.floor(p.n / p.w), inizio = BASE + (k - 1) * p.w; return { k, piene, inizio, fine: BASE + p.n - 1, resto: p.n - (k - 1) * p.w }; };
  // fase: 0 il descrittore · 1 chi fa che cosa · 2 le transazioni piene · 3 l'ultima · 4 l'ultimo byte
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], w3 = (o.w - 20) / 3, wc = Math.min(96, (o.w - (c.k - 1) * 4) / c.k);
    [['descrittore · indirizzo', H(BASE)], ['descrittore · lunghezza', p.n + ' byte'], ['descrittore · direzione', p.d === 'rx' ? 'verso la memoria' : 'dalla memoria']].forEach((r, j) => els.push(el.box(pre + 'd' + j, o.x + j * (w3 + 10), o.y, w3, 54, r[0], r[1], f === 0 || (f === 1 && j === 2) ? 'att' : 'on', { cls: 'stretta' })));
    els.push(el.nota(pre + 't', o.x, o.y + 70, 'TRANSAZIONI DEL DISPOSITIVO · al massimo ' + p.w + ' byte ciascuna', 'mono'));
    for (let j = 0; j < c.k; j++) { const ult = j === c.k - 1, vista = f >= 3 || (f === 2 && !ult) || (f === 2 && c.piene === c.k); els.push(el.cella(pre + 'x' + j, o.x + j * (wc + 4), o.y + 112, wc, 34, vista ? String(ult ? c.resto : p.w) : '', !vista ? '' : ult && f >= 3 ? 'att' : 'on', { so: vista ? H(BASE + j * p.w) : '', piccola: true })); }
    [['transazioni', f >= 3 ? String(c.k) : f === 2 ? String(c.piene) + (c.piene === c.k ? '' : ' piene') : '·', 3], ['l’ultima parte da', f >= 3 ? H(c.inizio) : '·', 3], ['ultimo byte', f >= 4 ? H(c.fine) : '·', 4]].forEach((r, j) => els.push(el.box(pre + 'q' + j, o.x + j * (w3 + 10), o.y + 164, w3, 54, r[0], r[1], f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { BASE, H, conto, quadro };
})();
SL.registra('4.7.2', {
  titolo: 'Il DMA come transazione di memoria delegata',
  obiettivo: 'Obiettivo: leggere la richiesta che un driver affida a un dispositivo, e ricavare quante transazioni servono e quali indirizzi toccano.',
  concetti: [['tabella', 'Indirizzo, lunghezza, direzione'], ['bus', 'Il dispositivo diventa iniziatore'], ['memory', 'Il buffer ha due estremi']],
  filigrana: ['bus', 'memory', 'tabella'],
  richiami: {
    carte: [
      { sim: 'dispositivo', da: 'Dall’unità 4.7.1', t: 'Il DMA', d: 'Il dispositivo trasferisce i dati da solo, e il processore prepara e conclude.' },
      { sim: 'memory', da: 'Dall’unità 2.5.3', t: 'Il buffer', d: 'Una zona di memoria destinata a contenere dati in transito.' },
      { sim: 'bus', da: 'Dall’unità 4.4.3', t: 'La transazione', d: 'Una richiesta completa sul bus, con un limite alla quantità di dati che porta.' }
    ],
    domanda: { d: 'Prima di proseguire: un buffer comincia all’indirizzo 0x6000 ed è lungo 16 byte. Qual è l’indirizzo del suo ultimo byte?', o: [
      { t: '0x600F', ok: true, fb: 'Il primo byte è a 0x6000, il sedicesimo quindici posizioni dopo: 0x6000 + 15.' },
      { t: '0x6010', fb: '0x6010 è il primo byte dopo la fine del buffer.' },
      { t: '0x6016', fb: 'Sedici si scrive 0x10 in esadecimale, e l’ultimo byte dista 15 dal primo.' }
    ] }
  },
  idea: {
    titolo: 'Una delega scritta',
    termini: ['descrittore di trasferimento'],
    testo: [
      'Per affidare un trasferimento a un dispositivo, il driver deve dirgli tre cose: dove comincia il buffer, quanti byte trasferire, in quale direzione. Queste informazioni stanno in una piccola struttura, il [[descrittore di trasferimento]]. Da quel momento è il dispositivo a comportarsi da iniziatore sul bus, come farebbe il processore: presenta indirizzi ed emette transazioni di memoria, per conto di chi gliele ha delegate.',
      'La direzione si legge dal punto di vista della memoria. Un dispositivo che ha ricevuto dati dall’esterno li deposita nel buffer, e sul bus emette scritture. Un dispositivo che deve spedire dati già pronti li preleva dal buffer, ed emette letture. Cambia chi produce il dato. Gli estremi del buffer restano quelli fissati da indirizzo e lunghezza.',
      'Una transazione porta un numero limitato di byte, e un buffer lungo richiede più transazioni. Con un buffer di 37 byte e un massimo di 8 per transazione, quattro transazioni piene coprono 32 byte. La quinta parte 32 posizioni dopo l’inizio, e porta i 5 byte rimasti. Se il buffer comincia a 0x6000, l’ultima transazione parte da 0x6020, perché 32 si scrive 0x20.',
      { fig: 'scena', w: 720, h: 226, titolo: 'Un buffer di 37 byte, al massimo 8 byte per transazione', nota: 'Sopra ogni transazione c’è l’indirizzo da cui parte, dentro il numero di byte che porta.', els: SL.unita472.quadro('g', { n: 37, w: 8, d: 'rx' }, 4, { x: 10, y: 0, w: 700 }) },
      'L’ultimo byte toccato è sempre inizio + lunghezza − 1, qui 0x6000 + 36 = 0x6024, in qualunque modo il trasferimento venga suddiviso. Raddoppiando il massimo per transazione le transazioni scendono a tre, e gli estremi restano identici. Il dispositivo deve restare dentro questo intervallo: fuori dal buffer c’è memoria che appartiene ad altri.'
    ]
  },
  esperimento: {
    faremo: [
      'Il driver prepara un descrittore per un buffer che comincia a 0x6000. Sceglierai la lunghezza, il massimo di byte per transazione e la direzione.',
      'Vedremo quante transazioni emette il dispositivo, da dove parte l’ultima e qual è l’ultimo byte toccato. Cambia il massimo da 8 a 16 e controlla quali numeri si muovono.'
    ],
    vedrai: [
      ['tabella', 'Il descrittore', 'In alto: indirizzo, lunghezza e direzione scritti dal driver.'],
      ['bus', 'Le transazioni', 'Al centro: una casella per transazione, con l’indirizzo di partenza e i byte portati.'],
      ['memory', 'Gli estremi', 'In basso: il numero di transazioni, l’inizio dell’ultima e l’ultimo byte del buffer.']
    ]
  },
  lab: {
    titolo: 'Dal descrittore alle transazioni',
    scena: { w: 860, h: 226 },
    atti: ['Il descrittore', 'Le transazioni', 'Gli estremi'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Lunghezza', opzioni: [[20, '20 byte'], [37, '37 byte'], [64, '64 byte']], valore: 37 },
      { id: 'w', tipo: 'scelta', eti: 'Massimo per transazione', opzioni: [[8, '8 byte'], [16, '16 byte']], valore: 8 },
      { id: 'd', tipo: 'scelta', eti: 'Direzione', opzioni: [['rx', 'dal dispositivo alla memoria'], ['tx', 'dalla memoria al dispositivo']], valore: 'rx' }
    ],
    nota: 'I passi sono sempre cinque. Il buffer comincia all’indirizzo 0x6000.',
    previsione: {
      domanda: (p) => 'Il descrittore indica un buffer di ' + p.n + ' byte. Ogni transazione porta al massimo ' + p.w + ' byte. Quante transazioni emette il dispositivo?',
      opzioni: (p) => { const k = SL.unita472.conto(p).k; return [k - 1, k, k + 1].map((v) => [v, String(v)]); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita472.conto(p); return 'La previsione indicava ' + pred + ' transazioni. Il dispositivo ne emette ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : c.resto === p.w ? p.n + ' diviso ' + p.w + ' dà esattamente ' + c.k + ', senza resto.' : 'Le transazioni piene sono ' + c.piene + ', e i ' + c.resto + ' byte rimasti ne richiedono un’altra.'); },
    costruisci(p) {
      const U = SL.unita472, H = U.H, c = U.conto(p), passi = [], rx = p.d === 'rx', pieno = c.resto === p.w;
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, w: 820 });
      const hud = (f) => [['Transazioni', f >= 3 ? String(c.k) : '·', 'a'], ['Operazione', f >= 1 ? (rx ? 'scrittura' : 'lettura') : '·'], ['Ultimo byte', f >= 4 ? H(c.fine) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il descrittore', 'Il driver scrive nel descrittore l’indirizzo del buffer, 0x6000, la lunghezza, ' + p.n + ' byte, e la direzione. Poi dà il via al dispositivo.', {});
      P(1, 0, 'Chi fa che cosa', rx ? 'Il dispositivo ha ricevuto dati dall’esterno e deve depositarli nel buffer. Diventa iniziatore sul bus, ed emette scritture in memoria.' : 'Il dispositivo deve spedire all’esterno dati già pronti nel buffer. Diventa iniziatore sul bus, ed emette letture dalla memoria.', { chiedi: { d: 'Sul bus, le transazioni del dispositivo sono…', o: ['letture dalla memoria', 'scritture in memoria'], g: rx ? 1 : 0, no: rx ? 'I dati vanno dal dispositivo al buffer: per la memoria sono scritture.' : 'I dati vanno dal buffer al dispositivo: per la memoria sono letture.' } });
      P(2, 1, 'Le transazioni piene', 'Ogni transazione porta al massimo ' + p.w + ' byte. In ' + p.n + ' byte ne entrano ' + c.piene + ' complete, che coprono ' + c.piene * p.w + ' byte.' + (pieno ? ' Non avanza nulla.' : ' Ne restano ' + c.resto + '.'), { calc: p.n + ' ÷ ' + p.w + ' = ' + c.piene + (pieno ? '' : ' con resto ' + c.resto) });
      P(3, 1, 'L’ultima transazione', (pieno ? 'L’ultima transazione è piena come le altre.' : 'I ' + c.resto + ' byte rimasti richiedono una transazione in più, più corta.') + ' Le transazioni sono ' + c.k + ', e l’ultima parte ' + (c.k - 1) * p.w + ' byte dopo l’inizio: 0x6000 + ' + H((c.k - 1) * p.w) + ' = ' + H(c.inizio) + '.', { calc: H(U.BASE) + ' + ' + (c.k - 1) + ' × ' + p.w + ' = ' + H(c.inizio), esito: [c.k + ' transazioni', ''] });
      P(4, 2, 'L’ultimo byte', 'L’ultimo byte del buffer dista ' + (p.n - 1) + ' posizioni dal primo: 0x6000 + ' + H(p.n - 1) + ' = ' + H(c.fine) + '. Questo estremo dipende soltanto da indirizzo e lunghezza, e resterebbe lo stesso con un altro massimo per transazione.', { calc: H(U.BASE) + ' + ' + p.n + ' − 1 = ' + H(c.fine), esito: [c.k + ' transazioni', ''] });
      return { passi, esito: c.k };
    }
  },
  bilancio: {
    regola: [
      'Transazioni = lunghezza ÷ massimo per transazione, arrotondando per eccesso. L’ultima parte da inizio + (transazioni − 1) × massimo.',
      'Ultimo byte = inizio + lunghezza − 1, comunque sia suddiviso il trasferimento. La direzione si legge dal punto di vista della memoria.'
    ],
    errori: [
      ['Arrotondare per difetto il numero di transazioni.', 'I byte rimasti hanno bisogno di una transazione in più.'],
      ['Calcolare l’ultimo byte come inizio + lunghezza.', 'Quell’indirizzo è il primo fuori dal buffer. Va sottratto 1.'],
      ['Chiamare lettura un trasferimento verso la memoria.', 'Quando il dispositivo deposita dati nel buffer, per la memoria è una scrittura.']
    ],
    saFare: ['Leggere i tre campi di un descrittore.', 'Calcolare il numero di transazioni.', 'Determinare l’inizio dell’ultima transazione e l’ultimo byte.'],
    esercizi: [
      { d: 'Un buffer comincia a 0x8000 ed è lungo 50 byte. Ogni transazione porta al massimo 16 byte. Quante transazioni servono?', segnaposto: 'Un numero', giuste: ['4', 'quattro'],
        ok: 'Tre transazioni piene coprono 48 byte, e i 2 rimasti ne richiedono una quarta.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Tre transazioni coprono 48 byte. Ne restano 2, che vanno trasferiti.' },
          { se: ['5', 'cinque'], msg: 'Dopo tre transazioni piene restano 2 byte, che stanno in una sola transazione.' }
        ],
        altro: 'Il numero è diverso. Si divida 50 per 16 e si arrotondi per eccesso.',
        indizi: ['16 × 3 = 48.', 'Restano 2 byte.', 'Serve una quarta transazione.'],
        svolgimento: ['Transazioni piene: 3, per 48 byte.', 'Byte rimasti: 2.', 'Transazioni: 4.'] },
      { d: 'Per lo stesso buffer, che comincia a 0x8000 ed è lungo 50 byte, qual è l’indirizzo dell’ultimo byte? Rispondi in esadecimale.', segnaposto: 'Un indirizzo', giuste: ['8031', '0x8031', '8031h'],
        ok: '50 − 1 = 49, che si scrive 0x31. 0x8000 + 0x31 = 0x8031.',
        diagnosi: [
          { se: ['8032', '0x8032'], msg: '0x8032 è il primo indirizzo dopo la fine del buffer. Va sottratto 1.' },
          { se: ['8049', '0x8049'], msg: 'Lo scostamento 49 è in base dieci. In esadecimale si scrive 0x31.' },
          { se: ['8030', '0x8030'], msg: '0x8030 è l’indirizzo da cui parte l’ultima transazione. Il buffer prosegue per un altro byte.' }
        ],
        altro: 'L’indirizzo è un altro. Somma a 0x8000 la lunghezza meno 1, scritta in esadecimale.',
        indizi: ['Lo scostamento dell’ultimo byte è 49.', '49 = 3 × 16 + 1, cioè 0x31.', '0x8000 + 0x31 = 0x8031.'],
        svolgimento: ['Scostamento: 50 − 1 = 49.', '49 = 0x31.', 'Ultimo byte: 0x8031.'] },
      { d: 'Una scheda di rete deve trasmettere all’esterno un pacchetto che il sistema ha già preparato nel buffer. Quali transazioni emette sul bus?', guida: 'Si scelga la risposta.', o: [
        { t: 'Letture dalla memoria', ok: true, fb: 'I dati vanno dal buffer al dispositivo: per la memoria sono letture.' },
        { t: 'Scritture in memoria', fb: 'Scriverebbe in memoria se dovesse depositare nel buffer dati ricevuti.' },
        { t: 'Nessuna: i dati li sposta il processore', fb: 'Con il DMA è il dispositivo a comportarsi da iniziatore.' }] }
    ],
    sfida: ['cslez4_7_03_dma_03', 'Configurazione e completamento del DMA']
  }
});
