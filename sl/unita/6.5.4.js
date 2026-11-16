'use strict';
SL.unita654 = (() => {
  const BL = 1024, CATENE = { a: [3, 9, 5, 11], b: [8, 4, 12, 6] }, PRIMO = 2, N = 16;
  const occupati = () => CATENE.a.concat(CATENE.b);
  const liberi = () => N - occupati().length;
  const succ = (k) => { for (const f of ['a', 'b']) { const i = CATENE[f].indexOf(k); if (i >= 0) return i < CATENE[f].length - 1 ? CATENE[f][i + 1] : 'fine'; } return null; };
  const conto = (p) => { const ind = Math.floor(p.pos / BL), off = p.pos % BL; return { ind, off, blocco: CATENE[p.file][ind], cammino: CATENE[p.file].slice(0, ind + 1) }; };
  // vis: quanti blocchi del cammino sono già stati raggiunti (0 = nessuno) · f: 0 volume, 1 conto, 2 cammino, 3 fine
  const quadro = (pre, p, f, vis, o) => {
    const el = SL.el, els = [], c = conto(p), wc = (o.w - 15 * 4) / 16, w4 = (o.w - 30) / 4, occ = occupati(), qui = vis > 0 ? c.cammino[vis - 1] : null;
    els.push(el.nota(pre + 't', o.x, o.y, 'IL VOLUME · in ogni blocco il bit della bit map, sotto il successore nella FAT', 'mono'));
    for (let k = 0; k < N; k++) { const b = PRIMO + k, usato = occ.indexOf(b) >= 0, mio = CATENE[p.file].indexOf(b) >= 0, s = succ(b); els.push(el.cella(pre + 'b' + b, o.x + k * (wc + 4), o.y + 44, wc, 32, usato ? '0' : '1', b === qui ? (f === 3 ? 'on' : 'att') : vis > 0 && c.cammino.slice(0, vis).indexOf(b) >= 0 ? 'on' : mio ? 'zero' : usato ? 'off' : '', { so: String(b), gi: s == null ? '' : s === 'fine' ? 'fine' : '→' + s, piccola: true, cls: 'minuta' })); }
    els.push(el.box(pre + 'q0', o.x, o.y + 106, w4, 54, 'file ' + p.file.toUpperCase() + ' · byte', 'posizione ' + p.pos, 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'q1', o.x + w4 + 10, o.y + 106, w4, 54, 'logico · offset', f >= 1 ? c.ind + ' · ' + c.off : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q2', o.x + 2 * (w4 + 10), o.y + 106, w4, 54, 'cammino nella FAT', vis > 0 ? c.cammino.slice(0, vis).join(' → ') : '·', f === 2 ? 'att' : vis > 0 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'q3', o.x + 3 * (w4 + 10), o.y + 106, w4, 54, 'blocchi liberi', String(liberi()), f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    return els;
  };
  return { BL, CATENE, liberi, conto, quadro };
})();
SL.registra('6.5.4', {
  titolo: 'Spazio libero e contabilità dell’allocazione',
  obiettivo: 'Obiettivo: leggere congiuntamente le due strutture di un volume, la bit map dei blocchi liberi e la FAT, e raggiungere un byte di un file seguendo la sua catena.',
  concetti: [['bit', 'Un bit per blocco: libero oppure occupato'], ['tabella', 'Una catena per file'], ['bilancio', 'I due conteggi devono coincidere']],
  filigrana: ['storage', 'bit', 'tabella'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 6.5.3', t: 'La FAT', d: 'Una tabella che per ogni blocco indica quello che lo segue nel medesimo file.' },
      { sim: 'byte', da: 'Dall’unità 6.5.3', t: 'Blocco logico e offset', d: 'Quoziente e resto fra la posizione del byte e la dimensione del blocco.' },
      { sim: 'storage', da: 'Dall’unità 4.6.1', t: 'Il volume', d: 'Lo spazio di archiviazione che il sistema tratta come un’unica sequenza di blocchi.' }
    ],
    domanda: { d: 'Prima di proseguire: i blocchi sono da 1024 byte. In quale blocco logico di un file ricade il byte di posizione 2400?', o: [
      { t: 'Nel blocco logico 2', ok: true, fb: '2400 = 2 × 1024 + 352: blocco logico 2, offset 352.' },
      { t: 'Nel blocco logico 3', fb: 'I blocchi logici si contano da 0: il terzo ha numero 2.' },
      { t: 'Nel blocco logico 352', fb: '352 è l’offset, cioè il resto della divisione.' }
    ] }
  },
  idea: {
    titolo: 'Due strutture per i medesimi blocchi',
    termini: ['bit map', 'contabilità dei blocchi'],
    testo: [
      'Un file system deve rispondere in ogni momento a due domande distinte. La prima riguarda i blocchi liberi, da assegnare a un file che cresce. La seconda riguarda i blocchi che formano un dato file, e il loro ordine. Per ciascuna domanda il file system conserva una struttura apposita.',
      'Alla prima domanda risponde, in questo modello, la [[bit map]] dei blocchi liberi: una sequenza di bit, uno per ogni blocco del volume. Il bit vale 1 se il blocco è libero, 0 se è assegnato a un file. La convenzione opposta è altrettanto diffusa, e va pertanto sempre dichiarata. Per individuare un blocco libero è sufficiente cercare un 1, e per determinare lo spazio residuo è sufficiente contare gli uni. Un volume di n blocchi richiede una bit map di n bit. Un’alternativa è la lista concatenata dei blocchi liberi, in cui alcuni blocchi liberi contengono i numeri degli altri. La bit map non indica a quale file appartiene un blocco occupato, né in quale ordine i blocchi vanno letti.',
      'Alla seconda domanda risponde, in questo modello, la FAT dell’unità precedente. La directory fornisce il primo blocco di ogni file, e la FAT, voce dopo voce, il successore di ciascun blocco, fino a un indicatore di fine. I blocchi di un file possono essere distribuiti nel volume, in un ordine indipendente dalla loro posizione.',
      { fig: 'scena', w: 720, h: 170, titolo: 'Sedici blocchi, due file da quattro blocchi', nota: 'Il file A ha inizio nel blocco 3: la catena è 3, 9, 5, 11. Il byte 2400 si trova nel blocco logico 2, cioè nel blocco 5.', els: SL.unita654.quadro('g', { file: 'a', pos: 2400 }, 3, 3, { x: 10, y: 4, w: 700 }) },
      'Si consideri il byte 2400 del file A, con blocchi da 1024 byte. La posizione fornisce blocco logico 2 e offset 352. Secondo la directory, A ha inizio nel blocco 3. Occorrono due passi nella FAT: al 3 segue il 9, e al 9 segue il 5. Il byte si trova nel blocco 5, all’offset 352. Per il file B, che ha inizio nel blocco 8, la medesima posizione conduce a un blocco diverso: 8, quindi 4, quindi 12.',
      'Le due strutture descrivono i medesimi blocchi da due punti di vista, e pertanto devono essere coerenti. Ogni blocco che compare in una catena deve avere il bit a 0, e ogni blocco con il bit a 0 deve comparire in una catena, e in una soltanto. Tale controllo incrociato è la [[contabilità dei blocchi]]. In questo caso la bit map segna otto blocchi occupati, e le due catene ne contano quattro ciascuna: i due conteggi coincidono. Quando discordano il volume è danneggiato, e il capitolo successivo esamina il modo in cui il guasto è rilevato e riparato.'
    ]
  },
  esperimento: {
    faremo: [
      'Un volume di sedici blocchi, numerati da 2 a 17, contiene due file di quattro blocchi. I controlli fissano il file, e la posizione del byte da raggiungere.',
      'L’esperimento calcola blocco logico e offset, e segue la catena del file nella FAT. È istruttivo variare il file a parità di posizione, e osservare il blocco a cui conduce la catena.'
    ],
    vedrai: [
      ['storage', 'Il volume', 'In alto: i sedici blocchi. Sopra il numero, all’interno il bit della bit map, sotto il successore nella FAT.'],
      ['bilancio', 'La ricerca', 'In basso: il byte richiesto, blocco logico e offset, il cammino nella FAT e i blocchi liberi.']
    ]
  },
  lab: {
    titolo: 'Seguire una catena fino al byte',
    scena: { w: 860, h: 170 },
    atti: ['Il volume', 'La posizione logica', 'La catena', 'Il byte'],
    controlli: [
      { id: 'file', tipo: 'scelta', eti: 'File', opzioni: [['a', 'A · ha inizio nel blocco 3'], ['b', 'B · ha inizio nel blocco 8']], valore: 'a' },
      { id: 'pos', tipo: 'scelta', eti: 'Posizione del byte', opzioni: [[100, '100'], [2400, '2400'], [3500, '3500']], valore: 2400 }
    ],
    nota: 'Il numero dei passi dipende dalla posizione. I blocchi sono da 1024 byte, e i blocchi dati del volume sono numerati da 2 a 17.',
    previsione: {
      domanda: (p) => { const U = SL.unita654, c = U.CATENE[p.file]; return 'I blocchi sono da 1024 byte. Il file ' + p.file.toUpperCase() + ' ha inizio nel blocco ' + c[0] + ', e la FAT indica i successori ' + c[0] + ' → ' + c[1] + ', ' + c[1] + ' → ' + c[2] + ', ' + c[2] + ' → ' + c[3] + '. In quale blocco del volume si trova il byte di posizione ' + p.pos + '?'; },
      opzioni: (p) => SL.unita654.CATENE[p.file].map((b) => [b, 'Nel blocco ' + b])
    },
    confronto: (pred, esito, p) => { const c = SL.unita654.conto(p); return 'La previsione indicava il blocco ' + pred + '. Il byte si trova nel blocco ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'La posizione ' + p.pos + ' ricade nel blocco logico ' + c.ind + '. A partire dal primo blocco si seguono ' + (c.ind === 0 ? 'zero anelli' : c.ind === 1 ? 'un anello' : c.ind + ' anelli') + ' della catena: ' + c.cammino.join(', ') + '.'); },
    costruisci(p) {
      const U = SL.unita654, c = U.conto(p), passi = [], F = p.file.toUpperCase(), cat = U.CATENE[p.file];
      const P = (f, vis, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Blocco logico', f >= 1 ? String(c.ind) : '·', 'a'], ['Offset', f >= 1 ? String(c.off) : '·'], ['Blocco del volume', vis > 0 ? String(c.cammino[vis - 1]) : '·', 'c']], els: U.quadro('b', p, f, vis, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 0, 'Il volume', 'Il volume ha sedici blocchi dati. La bit map ne segna otto come occupati, con il bit a 0, e otto come liberi, con il bit a 1. Sotto ogni blocco occupato la FAT indica il successore.', { calc: 'occupati 8 · liberi ' + U.liberi() });
      P(1, 0, 1, 'Blocco logico e offset', 'Il byte richiesto è il ' + p.pos + ' del file ' + F + '. La divisione per 1024 fornisce ' + p.pos + ' = ' + c.ind + ' × 1024 + ' + c.off + '. Blocco logico ' + c.ind + ', offset ' + c.off + '.', { calc: p.pos + ' = ' + c.ind + ' × 1024 + ' + c.off, chiedi: { d: 'Il byte si trova nel blocco logico ' + c.ind + '. Quanti anelli della catena vanno seguiti, a partire dal primo blocco?', o: [String(c.ind), String(c.ind + 1), String(c.ind + 2)], g: 0, no: 'Il primo blocco è già il blocco logico 0. Per raggiungere il blocco logico ' + c.ind + ' si seguono ' + c.ind + ' anelli.' } });
      P(2, 1, 2, 'Il primo blocco', 'Secondo la directory, il file ' + F + ' ha inizio nel blocco ' + cat[0] + ': è il blocco logico 0.' + (c.ind === 0 ? ' È già il blocco richiesto.' : ''), { calc: 'blocco logico 0 → blocco ' + cat[0] });
      for (let k = 1; k <= c.ind; k++) P(2, k + 1, 2, 'Anello ' + k, 'La voce della FAT per il blocco ' + cat[k - 1] + ' contiene ' + cat[k] + ': il successore del blocco ' + cat[k - 1] + ' è il blocco ' + cat[k] + ', cioè il blocco logico ' + k + '.', { calc: cat[k - 1] + ' → ' + cat[k] });
      P(3, c.ind + 1, 3, 'Il byte', 'Il byte ' + p.pos + ' del file ' + F + ' si trova nel blocco ' + c.blocco + ' del volume, all’offset ' + c.off + '. La bit map è invariata: la lettura di un file non modifica l’occupazione del volume. Gli otto blocchi con il bit a 0 sono i quattro di A e i quattro di B.', { calc: 'blocco ' + c.blocco + ' · offset ' + c.off, esito: ['blocco ' + c.blocco + ' · offset ' + c.off, ''] });
      return { passi, esito: c.blocco };
    }
  },
  bilancio: {
    regola: [
      'Bit map: un bit per blocco, 1 se libero e 0 se occupato. Blocchi liberi = numero degli uni.',
      'Per raggiungere un byte: blocco logico = posizione divisa per la dimensione del blocco. Dal primo blocco del file si seguono nella FAT tanti anelli quanti ne indica il blocco logico.'
    ],
    errori: [
      ['Leggere l’ordine dei blocchi dalla bit map.', 'La bit map indica soltanto se un blocco è occupato. L’ordine è contenuto nella catena.'],
      ['Contare un anello aggiuntivo.', 'Il primo blocco del file è il blocco logico 0: per il blocco logico 2 gli anelli sono due.'],
      ['Affidarsi a una sola struttura.', 'Bit map e catene devono descrivere i medesimi blocchi occupati. Se discordano, il volume è danneggiato.']
    ],
    saFare: ['Contare i blocchi liberi da una bit map.', 'Seguire una catena fino a un blocco logico.', 'Verificare la coerenza fra bit map e catene.'],
    esercizi: [
      { d: 'La bit map di un volume di 12 blocchi, con 1 per i blocchi liberi, è 1 0 1 1 0 0 1 0 1 1 0 1. Quanti blocchi sono liberi?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: 'Gli uni sono sette.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Cinque sono i bit a 0, cioè i blocchi occupati. I liberi sono gli uni.' },
          { se: ['12', 'dodici'], msg: 'Dodici sono i blocchi complessivi.' }
        ],
        altro: 'Il numero è diverso. Si contino i bit a 1.',
        indizi: ['Un bit a 1 indica un blocco libero.', 'I bit a 0 sono 5.', '12 − 5 = 7.'],
        svolgimento: ['Occupati: 5.', 'Liberi: 7.'] },
      { d: 'I blocchi sono da 1024 byte. Un file ha inizio nel blocco 6, e la FAT indica i successori 6 → 2, 2 → 15, 15 → 10. In quale blocco del volume si trova il byte di posizione 3000?', segnaposto: 'Un numero', giuste: ['15', 'quindici'],
        ok: '3000 = 2 × 1024 + 952: blocco logico 2. Catena: 6, 2, 15.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due è il numero del blocco logico. Il blocco del volume si determina seguendo la catena per due anelli.' },
          { se: ['10', 'dieci'], msg: 'Dieci è il blocco logico 3. Gli anelli da seguire sono due.' },
          { se: ['8', 'otto'], msg: 'I blocchi del file sono distribuiti nel volume: vanno letti nella FAT.' }
        ],
        altro: 'Il numero è diverso. Si calcoli il blocco logico, e quindi si segua la catena dal blocco 6.',
        indizi: ['3000 / 1024 = 2, con resto 952.', 'Blocco logico 0: il 6. Blocco logico 1: il 2.', 'Blocco logico 2: il 15.'],
        svolgimento: ['Blocco logico: 2.', 'Catena: 6 → 2 → 15.', 'Blocco del volume: 15.'] },
      { d: 'La bit map segna 9 blocchi occupati, mentre le catene dei file contano complessivamente 8 blocchi. Che cosa se ne conclude?', guida: 'Si scelga la risposta.', o: [
        { t: 'Un blocco risulta occupato senza appartenere ad alcun file: le strutture discordano', ok: true, fb: 'Tale blocco è spazio perduto, fino a quando un controllo del volume lo restituisce ai blocchi liberi.' },
        { t: 'Nessuna anomalia, poiché la bit map arrotonda per eccesso', fb: 'La bit map ha un bit esatto per ogni blocco.' },
        { t: 'Un file ha un blocco oltre quelli dovuti', fb: 'Le catene contano meno blocchi della bit map, ed è la bit map a segnarne uno in eccesso.' }] }
    ],
    sfida: ['cslez6_5_05_inode_fat', 'Inode e FAT']
  }
});
