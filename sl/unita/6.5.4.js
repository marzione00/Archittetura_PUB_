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
    els.push(el.nota(pre + 't', o.x, o.y, 'IL VOLUME · dentro ogni blocco il bit della bitmap, sotto il successore nella FAT', 'mono'));
    for (let k = 0; k < N; k++) { const b = PRIMO + k, usato = occ.indexOf(b) >= 0, mio = CATENE[p.file].indexOf(b) >= 0, s = succ(b); els.push(el.cella(pre + 'b' + b, o.x + k * (wc + 4), o.y + 44, wc, 32, usato ? '1' : '0', b === qui ? (f === 3 ? 'on' : 'att') : vis > 0 && c.cammino.slice(0, vis).indexOf(b) >= 0 ? 'on' : mio ? 'zero' : usato ? 'off' : '', { so: String(b), gi: s == null ? '' : s === 'fine' ? 'fine' : '→' + s, piccola: true, cls: 'minuta' })); }
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
  obiettivo: 'Obiettivo: leggere insieme le due strutture di un volume, la bitmap dei blocchi e la FAT, e raggiungere un byte di un file seguendo la sua catena.',
  concetti: [['bit', 'Un bit per blocco: libero oppure occupato'], ['tabella', 'Una catena per file'], ['bilancio', 'I due conti devono tornare']],
  filigrana: ['storage', 'bit', 'tabella'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 6.5.3', t: 'La FAT', d: 'Una tabella che per ogni blocco dice quale lo segue nello stesso file.' },
      { sim: 'byte', da: 'Dall’unità 6.5.3', t: 'Blocco logico e offset', d: 'Quoziente e resto fra la posizione del byte e la grandezza del blocco.' },
      { sim: 'storage', da: 'Dall’unità 4.6.1', t: 'Il volume', d: 'Lo spazio di archiviazione che il sistema vede come un’unica fila di blocchi.' }
    ],
    domanda: { d: 'Prima di proseguire: i blocchi sono da 1024 byte. In quale blocco logico di un file cade il byte di posizione 2400?', o: [
      { t: 'Nel blocco logico 2', ok: true, fb: '2400 = 2 × 1024 + 352: blocco logico 2, offset 352.' },
      { t: 'Nel blocco logico 3', fb: 'I blocchi logici si contano da 0: il terzo ha numero 2.' },
      { t: 'Nel blocco logico 352', fb: '352 è l’offset, cioè il resto della divisione.' }
    ] }
  },
  idea: {
    titolo: 'Due registri per gli stessi blocchi',
    termini: ['bitmap dei blocchi', 'contabilità dei blocchi'],
    testo: [
      'Un file system deve rispondere in ogni momento a due domande diverse. La prima: quali blocchi sono liberi, per poterli assegnare a un file che cresce. La seconda: quali blocchi formano un certo file, e in quale ordine. Per ciascuna domanda tiene una struttura apposita.',
      'Alla prima domanda risponde la [[bitmap dei blocchi]]: una fila di bit, uno per ogni blocco del volume. Il bit vale 1 se il blocco è assegnato a un file, 0 se è libero. Per trovare un blocco libero basta cercare uno 0, e per sapere quanto spazio resta basta contare gli zeri. La bitmap non dice a quale file appartiene un blocco occupato, e nemmeno in quale ordine i blocchi vanno letti.',
      'Alla seconda domanda risponde, in questo modello, la FAT dell’unità precedente. La directory fornisce il primo blocco di ogni file, e la FAT, voce dopo voce, il successore di ciascun blocco, fino a un segno di fine. I blocchi di un file possono essere sparsi per il volume, in un ordine che nulla ha a che vedere con la loro posizione.',
      { fig: 'scena', w: 720, h: 170, titolo: 'Sedici blocchi, due file da quattro blocchi', nota: 'Il file A comincia nel blocco 3: la catena è 3, 9, 5, 11. Il byte 2400 sta nel blocco logico 2, cioè nel blocco 5.', els: SL.unita654.quadro('g', { file: 'a', pos: 2400 }, 3, 3, { x: 10, y: 4, w: 700 }) },
      'Cerchiamo il byte 2400 del file A, con blocchi da 1024 byte. La posizione dà blocco logico 2 e offset 352. La directory dice che A comincia nel blocco 3. Servono due passi nella FAT: dopo il 3 viene il 9, dopo il 9 viene il 5. Il byte sta nel blocco 5, all’offset 352. Per il file B, che comincia nel blocco 8, la stessa posizione porta altrove: 8, poi 4, poi 12.',
      'Le due strutture descrivono gli stessi blocchi da due punti di vista, e quindi devono andare d’accordo. Ogni blocco che compare in una catena deve avere il bit a 1, e ogni blocco con il bit a 1 deve comparire in una catena, una sola. Questo controllo incrociato è la [[contabilità dei blocchi]]. Qui la bitmap segna otto blocchi occupati, e le due catene ne contano quattro ciascuna: i conti tornano. Quando non tornano, il volume è danneggiato, e nel prossimo capitolo vedremo come ci si accorge del guasto e come lo si ripara.'
    ]
  },
  esperimento: {
    faremo: [
      'Un volume di sedici blocchi, numerati da 2 a 17, contiene due file di quattro blocchi. Sceglierai il file, e la posizione del byte da raggiungere.',
      'Calcoleremo blocco logico e offset, e seguiremo la catena del file nella FAT. Con la stessa posizione, cambia file e guarda dove porta la catena.'
    ],
    vedrai: [
      ['storage', 'Il volume', 'In alto: i sedici blocchi. Sopra il numero, dentro il bit della bitmap, sotto il successore nella FAT.'],
      ['bilancio', 'La ricerca', 'In basso: il byte cercato, blocco logico e offset, il cammino nella FAT e i blocchi liberi.']
    ]
  },
  lab: {
    titolo: 'Seguire una catena fino al byte',
    scena: { w: 860, h: 170 },
    atti: ['Il volume', 'La posizione logica', 'La catena', 'Il byte'],
    controlli: [
      { id: 'file', tipo: 'scelta', eti: 'File', opzioni: [['a', 'A · comincia nel blocco 3'], ['b', 'B · comincia nel blocco 8']], valore: 'a' },
      { id: 'pos', tipo: 'scelta', eti: 'Posizione del byte', opzioni: [[100, '100'], [2400, '2400'], [3500, '3500']], valore: 2400 }
    ],
    nota: 'Il numero dei passi dipende dalla posizione. I blocchi sono da 1024 byte, e i blocchi dati del volume sono numerati da 2 a 17.',
    previsione: {
      domanda: (p) => { const U = SL.unita654, c = U.CATENE[p.file]; return 'I blocchi sono da 1024 byte. Il file ' + p.file.toUpperCase() + ' comincia nel blocco ' + c[0] + ', e la FAT dice: dopo il ' + c[0] + ' viene il ' + c[1] + ', dopo il ' + c[1] + ' il ' + c[2] + ', dopo il ' + c[2] + ' il ' + c[3] + '. In quale blocco del volume si trova il byte di posizione ' + p.pos + '?'; },
      opzioni: (p) => SL.unita654.CATENE[p.file].map((b) => [b, 'Nel blocco ' + b])
    },
    confronto: (pred, esito, p) => { const c = SL.unita654.conto(p); return 'La previsione indicava il blocco ' + pred + '. Il byte sta nel blocco ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'La posizione ' + p.pos + ' cade nel blocco logico ' + c.ind + '. Partendo dal primo blocco si seguono ' + (c.ind === 0 ? 'zero anelli' : c.ind === 1 ? 'un anello' : c.ind + ' anelli') + ' della catena: ' + c.cammino.join(', ') + '.'); },
    costruisci(p) {
      const U = SL.unita654, c = U.conto(p), passi = [], F = p.file.toUpperCase(), cat = U.CATENE[p.file];
      const P = (f, vis, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Blocco logico', f >= 1 ? String(c.ind) : '·', 'a'], ['Offset', f >= 1 ? String(c.off) : '·'], ['Blocco del volume', vis > 0 ? String(c.cammino[vis - 1]) : '·', 'c']], els: U.quadro('b', p, f, vis, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 0, 'Il volume', 'Il volume ha sedici blocchi dati. La bitmap ne segna otto come occupati, con il bit a 1, e otto come liberi. Sotto ogni blocco occupato la FAT indica il successore.', { calc: 'occupati 8 · liberi ' + U.liberi() });
      P(1, 0, 1, 'Blocco logico e offset', 'Cerchiamo il byte ' + p.pos + ' del file ' + F + '. Dividiamo per 1024: ' + p.pos + ' = ' + c.ind + ' × 1024 + ' + c.off + '. Blocco logico ' + c.ind + ', offset ' + c.off + '.', { calc: p.pos + ' = ' + c.ind + ' × 1024 + ' + c.off, chiedi: { d: 'Il byte sta nel blocco logico ' + c.ind + '. Quanti anelli della catena vanno seguiti, partendo dal primo blocco?', o: [String(c.ind), String(c.ind + 1), String(c.ind + 2)], g: 0, no: 'Il primo blocco è già il blocco logico 0. Per arrivare al blocco logico ' + c.ind + ' si seguono ' + c.ind + ' anelli.' } });
      P(2, 1, 2, 'Il primo blocco', 'La directory dice che il file ' + F + ' comincia nel blocco ' + cat[0] + ': è il blocco logico 0.' + (c.ind === 0 ? ' È già quello che cerchiamo.' : ''), { calc: 'blocco logico 0 → blocco ' + cat[0] });
      for (let k = 1; k <= c.ind; k++) P(2, k + 1, 2, 'Anello ' + k, 'La voce della FAT per il blocco ' + cat[k - 1] + ' contiene ' + cat[k] + ': dopo il ' + cat[k - 1] + ' viene il ' + cat[k] + ', che è il blocco logico ' + k + '.', { calc: cat[k - 1] + ' → ' + cat[k] });
      P(3, c.ind + 1, 3, 'Il byte', 'Il byte ' + p.pos + ' del file ' + F + ' sta nel blocco ' + c.blocco + ' del volume, all’offset ' + c.off + '. La bitmap è rimasta la stessa: leggere un file non cambia l’occupazione del volume. Gli otto blocchi con il bit a 1 sono i quattro di A e i quattro di B.', { calc: 'blocco ' + c.blocco + ' · offset ' + c.off, esito: ['blocco ' + c.blocco + ' · offset ' + c.off, ''] });
      return { passi, esito: c.blocco };
    }
  },
  bilancio: {
    regola: [
      'Bitmap: un bit per blocco, 1 se occupato e 0 se libero. Blocchi liberi = numero degli zeri.',
      'Per raggiungere un byte: blocco logico = posizione divisa per la grandezza del blocco. Dal primo blocco del file si seguono nella FAT tanti anelli quanti dice il blocco logico.'
    ],
    errori: [
      ['Leggere l’ordine dei blocchi dalla bitmap.', 'La bitmap dice soltanto se un blocco è occupato. L’ordine sta nella catena.'],
      ['Contare un anello in più.', 'Il primo blocco del file è il blocco logico 0: per il blocco logico 2 gli anelli sono due.'],
      ['Fidarsi di una sola struttura.', 'Bitmap e catene devono descrivere gli stessi blocchi occupati. Se discordano, il volume è danneggiato.']
    ],
    saFare: ['Contare i blocchi liberi da una bitmap.', 'Seguire una catena fino a un blocco logico.', 'Verificare che bitmap e catene vadano d’accordo.'],
    esercizi: [
      { d: 'La bitmap di un volume di 12 blocchi è 1 0 1 1 0 0 1 0 1 1 0 1. Quanti blocchi sono liberi?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Gli zeri sono cinque.',
        diagnosi: [
          { se: ['7', 'sette'], msg: 'Sette sono i bit a 1, cioè i blocchi occupati. I liberi sono gli zeri.' },
          { se: ['12', 'dodici'], msg: 'Dodici sono i blocchi in tutto.' }
        ],
        altro: 'Il numero è diverso. Conta i bit a 0.',
        indizi: ['Un bit a 0 indica un blocco libero.', 'I bit a 1 sono 7.', '12 − 7 = 5.'],
        svolgimento: ['Occupati: 7.', 'Liberi: 5.'] },
      { d: 'I blocchi sono da 1024 byte. Un file comincia nel blocco 6, e la FAT dice: dopo il 6 viene il 2, dopo il 2 il 15, dopo il 15 il 10. In quale blocco del volume si trova il byte di posizione 3000?', segnaposto: 'Un numero', giuste: ['15', 'quindici'],
        ok: '3000 = 2 × 1024 + 952: blocco logico 2. Catena: 6, 2, 15.',
        diagnosi: [
          { se: ['2', 'due'], msg: 'Due è il numero del blocco logico. Il blocco del volume si trova seguendo la catena per due anelli.' },
          { se: ['10', 'dieci'], msg: 'Dieci è il blocco logico 3. Gli anelli da seguire sono due.' },
          { se: ['8', 'otto'], msg: 'I blocchi del file sono sparsi: vanno letti nella FAT.' }
        ],
        altro: 'Il numero è diverso. Si calcoli il blocco logico, poi si segua la catena dal blocco 6.',
        indizi: ['3000 / 1024 = 2, con resto 952.', 'Blocco logico 0: il 6. Blocco logico 1: il 2.', 'Blocco logico 2: il 15.'],
        svolgimento: ['Blocco logico: 2.', 'Catena: 6 → 2 → 15.', 'Blocco del volume: 15.'] },
      { d: 'La bitmap segna 9 blocchi occupati. Le catene dei file, sommate, contano 8 blocchi. Che cosa si può concludere?', guida: 'Si scelga la risposta.', o: [
        { t: 'Un blocco risulta occupato senza appartenere ad alcun file: le strutture discordano', ok: true, fb: 'Quel blocco è spazio perso, finché un controllo del volume lo rimette fra i liberi.' },
        { t: 'Tutto in ordine: la bitmap arrotonda per eccesso', fb: 'La bitmap ha un bit esatto per ogni blocco.' },
        { t: 'Un file ha un blocco in più del dovuto', fb: 'Le catene contano meno blocchi della bitmap. È la bitmap a segnarne uno di troppo.' }] }
    ],
    sfida: ['cslez6_5_05_inode_fat', 'Inode e FAT']
  }
});
