'use strict';
SL.unita653 = (() => {
  const BL = 4096, FISICI = { cont: [7, 8, 9], fat: [7, 14, 3], idx: [7, 14, 3] };
  const conto = (p) => { const blocchi = Math.ceil(p.s / BL), ultimo = p.s - 1, ind = Math.floor(ultimo / BL), off = ultimo % BL; return { blocchi, ultimo, ind, off, fisico: FISICI[p.modo][ind], spreco: blocchi * BL - p.s, lista: FISICI[p.modo].slice(0, blocchi) }; };
  // f: 0 inizio · 1 blocchi necessari · 2 ultimo byte · 3 indice e offset · 4 blocco fisico · 5 spazio inutilizzato
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), N = SL.num, wc = (o.w - 15 * 4) / 16;
    els.push(el.nota(pre + 't', o.x, o.y, 'IL DISPOSITIVO · dentro ogni blocco del file, il suo blocco logico', 'mono'));
    for (let k = 0; k < 16; k++) { const j = f >= 1 ? c.lista.indexOf(k) : -1; els.push(el.cella(pre + 'd' + k, o.x + k * (wc + 4), o.y + 44, wc, 32, j >= 0 ? String(j) : '', j >= 0 ? (f >= 4 && j === c.ind ? 'att' : 'on') : '', { so: String(k), gi: f >= 4 && p.modo === 'fat' && j >= 0 && j < c.blocchi - 1 ? '→' + c.lista[j + 1] : f >= 4 && p.modo === 'fat' && j === c.blocchi - 1 ? 'fine' : '', piccola: true, cls: 'minuta' })); }
    const w5 = (o.w - 40) / 5;
    [['blocchi', f >= 1 ? String(c.blocchi) : '·', f === 1, f >= 1], ['blocco logico', f >= 3 ? String(c.ind) : '·', f === 3, f >= 3], ['offset', f >= 3 ? String(c.off) : '·', f === 3, f >= 3], ['blocco fisico', f >= 4 ? String(c.fisico) : '·', f === 4, f >= 4], ['inutilizzati', f >= 5 ? N(c.spreco) + ' byte' : '·', f === 5, f >= 5]].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (w5 + 10), o.y + 106, w5, 54, r[0], r[1], r[2] ? (k === 4 && c.spreco ? 'err' : 'att') : r[3] ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { BL, FISICI, conto, quadro };
})();
SL.registra('6.5.3', {
  titolo: 'Allocare i blocchi',
  obiettivo: 'Obiettivo: calcolare quanti blocchi occupa un file, in quale blocco logico cade un suo byte, e come tre metodi di allocazione portano da quel blocco logico a un blocco del dispositivo.',
  concetti: [['byte', 'Lo spazio si assegna a blocchi interi'], ['tabella', 'Dal blocco logico al blocco fisico'], ['bilancio', 'L’ultimo blocco resta in parte vuoto']],
  filigrana: ['storage', 'tabella', 'byte'],
  richiami: {
    carte: [
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'L’inode', d: 'Contiene i metadati del file, fra cui l’elenco dei blocchi che ne conservano i dati.' },
      { sim: 'byte', da: 'Dall’unità 4.5.2', t: 'Il blocco logico del disco', d: 'Il disco si presenta come una fila di blocchi di uguale dimensione, numerati da zero.' },
      { sim: 'operation', da: 'Dall’unità 1.4.4', t: 'La divisione intera', d: 'Quoziente e resto: quante volte il divisore sta nel dividendo, e ciò che avanza.' }
    ],
    domanda: { d: 'Prima di proseguire: i byte di un file sono numerati da 0. Qual è la posizione dell’ultimo byte di un file lungo 4096 byte?', o: [
      { t: '4095', ok: true, fb: 'Partendo da 0, l’ultimo dei 4096 byte ha posizione 4095.' },
      { t: '4096', fb: 'La posizione 4096 sarebbe quella di un quattromilanovantasettesimo byte.' },
      { t: '4097', fb: 'La numerazione parte da 0, e quindi l’ultima posizione è la lunghezza meno 1.' }
    ] }
  },
  idea: {
    titolo: 'Un file è una fila di blocchi, sparsi sul dispositivo',
    termini: ['frammentazione interna', 'allocazione contigua', 'fat', 'allocazione indicizzata'],
    testo: [
      'Per chi lo usa, un file è una fila ininterrotta di byte, dalla posizione 0 all’ultima. Il dispositivo però assegna lo spazio a blocchi interi, qui da 4096 byte. Un file lungo 4096 byte riempie esattamente un blocco. Aggiungendogli un solo byte ne servono due, e del secondo si usa soltanto la prima posizione. I blocchi necessari sono la lunghezza divisa per 4096, arrotondata all’intero superiore.',
      'L’ultimo blocco resta quasi sempre in parte vuoto. Quello spazio è riservato al file e nessun altro può usarlo: si chiama [[frammentazione interna]]. Un file di 4097 byte riserva 8192 byte, e ne lascia inutilizzati 4095. Con blocchi grandi si spreca di più in coda a ogni file. Con blocchi piccoli si spreca meno, e servono più blocchi, e quindi più informazioni per ritrovarli.',
      'Dentro il file, i blocchi hanno un ordine: il blocco logico 0 contiene i primi 4096 byte, il blocco logico 1 i successivi, e così via. Per trovare un byte si divide la sua posizione per 4096: il quoziente è il blocco logico, il resto è l’offset. Resta da stabilire a quale blocco del dispositivo corrisponde ciascun blocco logico. La risposta dipende dal metodo di allocazione, e i metodi classici sono tre.',
      { fig: 'scena', w: 720, h: 170, titolo: 'Un file di 9000 byte, con allocazione a catena', nota: 'I tre blocchi logici 0, 1 e 2 stanno nei blocchi 7, 14 e 3 del dispositivo. Ogni blocco indica il successivo.', els: SL.unita653.quadro('g', { s: 9000, modo: 'fat' }, 5, { x: 10, y: 4, w: 700 }) },
      'Con l’[[allocazione contigua]] il file occupa blocchi consecutivi: se comincia nel blocco 7, il blocco logico 1 è l’8, e il 2 è il 9. Trovare un blocco è immediato, basta una somma. Far crescere un file è difficile, perché il blocco successivo può essere già di un altro. Il secondo metodo collega i blocchi in una catena: una tabella, la [[fat|FAT]], da file allocation table, dice per ogni blocco quale lo segue. I blocchi possono stare ovunque, e per arrivare al blocco logico 2 bisogna seguire due anelli della catena.',
      'Il terzo metodo è l’[[allocazione indicizzata]]: l’inode contiene un elenco, l’indice, con i numeri dei blocchi nell’ordine. Il blocco logico 2 si legge direttamente alla terza voce dell’indice, senza percorrere nulla. È il metodo degli inode dell’unità 6.5.1. In tutti e tre i casi la posizione logica del byte, blocco e offset, resta la stessa. Cambia soltanto il cammino che conduce al blocco fisico.'
    ]
  },
  esperimento: {
    faremo: [
      'Un file comincia nel blocco 7 di un dispositivo con blocchi da 4096 byte. Sceglierai la lunghezza del file, e il metodo che collega i blocchi logici a quelli fisici.',
      'Calcoleremo i blocchi necessari, la posizione dell’ultimo byte, e il blocco fisico in cui si trova. Passa da 4096 a 4097 byte e guarda che cosa provoca quel byte in più.'
    ],
    vedrai: [
      ['storage', 'Il dispositivo', 'In alto: sedici blocchi, numerati sopra. Dentro i blocchi del file c’è il numero del blocco logico. Con la catena, sotto ogni blocco c’è il successivo.'],
      ['bilancio', 'Il conto', 'In basso: i blocchi necessari, il blocco logico e l’offset dell’ultimo byte, il blocco fisico, e i byte inutilizzati.']
    ]
  },
  lab: {
    titolo: 'Dall’ultimo byte al suo blocco',
    scena: { w: 860, h: 170 },
    atti: ['Il file', 'La posizione logica', 'Il blocco fisico', 'Lo spazio'],
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Lunghezza del file', opzioni: [[4096, '4096 byte'], [4097, '4097 byte'], [9000, '9000 byte']], valore: 4097 },
      { id: 'modo', tipo: 'scelta', eti: 'Allocazione', opzioni: [['cont', 'contigua, dal blocco 7'], ['fat', 'a catena: 7, poi 14, poi 3'], ['idx', 'indicizzata: indice 7, 14, 3']], valore: 'cont' }
    ],
    nota: 'I passi sono sempre sei. I blocchi sono da 4096 byte, e il primo blocco del file è sempre il 7.',
    previsione: {
      domanda: (p) => 'Un file di ' + SL.num(p.s) + ' byte occupa blocchi da 4096 byte. ' + (p.modo === 'cont' ? 'L’allocazione è contigua, a partire dal blocco 7.' : p.modo === 'fat' ? 'L’allocazione è a catena: il primo blocco è il 7, la FAT dice che dopo il 7 viene il 14, e dopo il 14 il 3.' : 'L’allocazione è indicizzata: l’indice elenca, nell’ordine, i blocchi 7, 14 e 3.') + ' In quale blocco del dispositivo si trova l’ultimo byte del file?',
      opzioni: (p) => (p.s === 9000 ? [9, 3, 14] : [7, 8, 14]).map((v) => [v, 'Nel blocco ' + v])
    },
    confronto: (pred, esito, p) => { const c = SL.unita653.conto(p); return 'La previsione indicava il blocco ' + pred + '. L’ultimo byte sta nel blocco ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : c.ind === 0 ? 'Con 4096 byte l’ultimo byte ha posizione 4095, ancora dentro il primo blocco, il 7.' : p.modo === 'cont' ? 'L’ultimo byte cade nel blocco logico ' + c.ind + '. Con l’allocazione contigua è il blocco 7 + ' + c.ind + ' = ' + c.fisico + '.' : 'L’ultimo byte cade nel blocco logico ' + c.ind + ', che in questo file è il blocco ' + c.fisico + ' del dispositivo: lo dice ' + (p.modo === 'fat' ? 'la catena.' : 'l’indice.')); },
    costruisci(p) {
      const U = SL.unita653, c = U.conto(p), passi = [], N = SL.num;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Blocchi', f >= 1 ? String(c.blocchi) : '·', 'a'], ['Blocco logico', f >= 3 ? String(c.ind) : '·'], ['Blocco fisico', f >= 4 ? String(c.fisico) : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Il file', 'Il file è lungo ' + N(p.s) + ' byte. Il dispositivo assegna lo spazio a blocchi da 4096 byte, e il primo blocco del file è il 7.', {});
      P(1, 0, 'I blocchi necessari', N(p.s) + ' diviso 4096 fa ' + String(Math.round(p.s / 4096 * 1000) / 1000).replace('.', ',') + '. Arrotondando all’intero superiore, i blocchi necessari sono ' + c.blocchi + '.' + (p.s === 4097 ? ' Un solo byte oltre i 4096 obbliga a prendere un secondo blocco.' : ''), { calc: N(p.s) + ' / 4096 → ' + c.blocchi + (c.blocchi === 1 ? ' blocco' : ' blocchi') });
      P(2, 1, 'La posizione dell’ultimo byte', 'I byte sono numerati da 0, e quindi l’ultimo ha posizione ' + N(p.s) + ' − 1 = ' + N(c.ultimo) + '.', { calc: 'ultimo byte: posizione ' + N(c.ultimo) });
      P(3, 1, 'Blocco logico e offset', 'Dividiamo la posizione per 4096: ' + N(c.ultimo) + ' = ' + c.ind + ' × 4096 + ' + c.off + '. L’ultimo byte sta nel blocco logico ' + c.ind + ', all’offset ' + c.off + '.', { calc: N(c.ultimo) + ' = ' + c.ind + ' × 4096 + ' + c.off, chiedi: { d: 'Il blocco logico ' + c.ind + ' dice in quale blocco del dispositivo si trova il byte?', o: ['Ancora no: dipende dal metodo di allocazione', 'Sì: è il blocco ' + c.ind + ' del dispositivo'], g: 0, no: 'Il blocco logico è la posizione dentro il file. Il blocco del dispositivo si trova con la regola di allocazione.' } });
      P(4, 2, 'Il blocco fisico', p.modo === 'cont' ? 'L’allocazione è contigua: i blocchi del file sono consecutivi a partire dal 7. Il blocco logico ' + c.ind + ' è il blocco 7 + ' + c.ind + ' = ' + c.fisico + '.' : p.modo === 'fat' ? (c.ind === 0 ? 'L’allocazione è a catena. Il blocco logico 0 è il primo della catena, il 7: nessun anello da seguire.' : 'L’allocazione è a catena. Si parte dal blocco 7 e si seguono ' + c.ind + (c.ind === 1 ? ' anello' : ' anelli') + ' nella FAT: ' + U.FISICI.fat.slice(0, c.ind + 1).join(' → ') + '. Il blocco logico ' + c.ind + ' è il ' + c.fisico + '.') : 'L’allocazione è indicizzata. L’indice elenca i blocchi nell’ordine, e alla voce ' + c.ind + ' si legge direttamente ' + c.fisico + '.', { calc: 'blocco logico ' + c.ind + ' → blocco ' + c.fisico });
      P(5, 3, 'Lo spazio inutilizzato', 'Il file riserva ' + c.blocchi + ' × 4096 = ' + N(c.blocchi * 4096) + ' byte, e ne usa ' + N(p.s) + '. ' + (c.spreco ? 'Restano inutilizzati ' + N(c.spreco) + ' byte nell’ultimo blocco: è la frammentazione interna.' : 'L’ultimo blocco è pieno fino all’ultimo byte: lo spazio inutilizzato è zero.'), { calc: N(c.blocchi * 4096) + ' − ' + N(p.s) + ' = ' + N(c.spreco) + ' byte', esito: ['ultimo byte nel blocco ' + c.fisico, ''] });
      return { passi, esito: c.fisico };
    }
  },
  bilancio: {
    regola: [
      'Blocchi necessari = lunghezza divisa per la grandezza del blocco, arrotondata all’intero superiore. Blocco logico e offset di un byte = quoziente e resto della sua posizione.',
      'Contigua: primo blocco + blocco logico. A catena: si seguono tanti anelli quanti dice il blocco logico. Indicizzata: si legge la voce dell’indice.'
    ],
    errori: [
      ['Confondere lunghezza e ultima posizione.', 'Le posizioni partono da 0: l’ultimo byte di un file di S byte ha posizione S − 1.'],
      ['Usare il blocco logico come blocco del dispositivo.', 'Il blocco logico è la posizione nel file. Il blocco fisico dipende dall’allocazione.'],
      ['Dimenticare lo spazio riservato e non usato.', 'L’ultimo blocco è assegnato per intero, anche se il file ne usa un solo byte.']
    ],
    saFare: ['Calcolare i blocchi necessari e lo spazio inutilizzato.', 'Determinare blocco logico e offset di un byte.', 'Raggiungere il blocco fisico con i tre metodi.'],
    esercizi: [
      { d: 'I blocchi sono da 4096 byte. Quanti blocchi occupa un file di 10 000 byte?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: '10 000 / 4096 fa circa 2,44: servono 3 blocchi.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due blocchi contengono 8192 byte, meno di 10 000. La divisione va arrotondata all’intero superiore.' },
          { se: ['4', 'quattro'], msg: 'Tre blocchi contengono 12 288 byte, che bastano.' }
        ],
        altro: 'Il numero è diverso. Si divida per 4096 e si arrotondi all’intero superiore.',
        indizi: ['2 × 4096 = 8192: non basta.', '3 × 4096 = 12 288: basta.', 'Tre blocchi.'],
        svolgimento: ['10 000 / 4096 ≈ 2,44.', 'Blocchi: 3.'] },
      { d: 'Lo stesso file di 10 000 byte occupa 3 blocchi da 4096 byte. Quanti byte restano inutilizzati nell’ultimo blocco?', segnaposto: 'Un numero', giuste: ['2288', '2 288'],
        ok: '3 × 4096 − 10 000 = 12 288 − 10 000 = 2 288.',
        diagnosi: [
          { se: ['1808', '1 808'], msg: 'Questi sono i byte usati nell’ultimo blocco. La domanda riguarda quelli rimasti vuoti.' },
          { se: ['4096', '4 096'], msg: 'L’ultimo blocco contiene 1808 byte del file: non è vuoto.' }
        ],
        altro: 'Il numero è diverso. Si sottragga la lunghezza del file dallo spazio riservato.',
        indizi: ['Spazio riservato: 3 × 4096 = 12 288.', 'Lunghezza: 10 000.', '12 288 − 10 000 = 2 288.'],
        svolgimento: ['Riservati: 12 288 byte.', 'Usati: 10 000 byte.', 'Inutilizzati: 2 288 byte.'] },
      { d: 'Un file è allocato a catena, e la FAT dice: dopo il blocco 5 viene il 12, dopo il 12 il 2, dopo il 2 il 9. Il file comincia nel blocco 5. Quale blocco del dispositivo contiene il blocco logico 2?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Blocco logico 0: 5. Blocco logico 1: 12. Blocco logico 2: 2.',
        diagnosi: [
          { se: ['12', 'dodici'], msg: 'Dodici è il blocco logico 1. Per il 2 va seguito un altro anello.' },
          { se: ['9', 'nove'], msg: 'Nove è il blocco logico 3. I blocchi logici si contano da 0.' },
          { se: ['7', 'sette'], msg: 'Sarebbe vero con l’allocazione contigua. Qui i blocchi sono collegati dalla FAT.' }
        ],
        altro: 'Il numero è diverso. Si parta dal blocco 5 e si seguano due anelli della catena.',
        indizi: ['Blocco logico 0: il 5.', 'Primo anello: 5 → 12.', 'Secondo anello: 12 → 2.'],
        svolgimento: ['5 → 12 → 2.', 'Blocco logico 2: il blocco 2 del dispositivo.'] }
    ],
    sfida: ['cslez6_5_04_space_allocation', 'Allocazione dello spazio']
  }
});
