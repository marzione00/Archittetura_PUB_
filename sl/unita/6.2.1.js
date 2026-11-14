'use strict';
SL.unita621 = (() => {
  const PAG = 4096, VPN = 3, FA = 4;
  const hex = (v) => '0x' + v.toString(16).toUpperCase();
  const ind = (frame, off) => frame * PAG + off;
  // f: 0 solo VA · 1 scomposto · 2 tabella A · 3 PA di A · 4 tabella B · 5 PA di B · 6 confronto
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], w3 = (o.w - 20) / 3, w2 = (o.w - 10) / 2, va = ind(VPN, p.off), paA = ind(FA, p.off), paB = ind(p.fb, p.off), wc = (o.w - 9 * 6) / 10, stesso = p.fb === FA;
    els.push(el.box(pre + 'v', o.x, o.y, w3, 50, 'indirizzo virtuale · A e B', hex(va) + ' = ' + SL.num(va), f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'n', o.x + w3 + 10, o.y, w3, 50, 'pagina virtuale · VPN', f >= 1 ? String(VPN) : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'o', o.x + 2 * (w3 + 10), o.y, w3, 50, 'offset nella pagina', f >= 1 ? p.off + ' = ' + hex(p.off) : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'ta', o.x, o.y + 58, w2, 50, 'tabella di A · riga 3', f >= 2 ? 'frame ' + FA : '·', f === 2 ? 'att' : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'tb', o.x + w2 + 10, o.y + 58, w2, 50, 'tabella di B · riga 3', f >= 4 ? 'frame ' + p.fb : '·', f === 4 ? 'att' : f >= 4 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'pa', o.x, o.y + 116, w2, 50, 'indirizzo fisico di A', f >= 3 ? hex(paA) + ' = ' + SL.num(paA) : '·', f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'pb', o.x + w2 + 10, o.y + 116, w2, 50, 'indirizzo fisico di B', f >= 5 ? hex(paB) + ' = ' + SL.num(paB) : '·', f === 5 ? 'att' : f >= 5 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.nota(pre + 't', o.x, o.y + 178, 'MEMORIA FISICA · frame di 4096 byte', 'mono'));
    for (let k = 0; k < 10; k++) { const a = f >= 3 && k === FA, b = f >= 5 && k === p.fb; els.push(el.cella(pre + 'f' + k, o.x + k * (wc + 6), o.y + 202, wc, 30, a && b ? 'A e B' : a ? 'A' : b ? 'B' : '', a && b ? (f === 6 ? 'err' : 'att') : (a && f === 3) || (b && f === 5) ? 'att' : a || b ? 'on' : '', { gi: 'frame ' + k, piccola: true })); }
    return els;
  };
  return { PAG, VPN, FA, hex, ind, quadro };
})();
SL.registra('6.2.1', {
  titolo: 'Spazi di indirizzamento, pagine e frame',
  obiettivo: 'Obiettivo: tradurre un indirizzo virtuale in un indirizzo fisico usando la tabella delle pagine di un processo, e stabilire se due processi raggiungono lo stesso byte.',
  concetti: [['strati', 'Lo stesso numero, due significati'], ['tabella', 'La pagina sceglie la riga, la riga dà il frame'], ['puntatore', 'L’offset passa immutato']],
  filigrana: ['strati', 'tabella', 'memory'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 5.1.1', t: 'Lo spazio di indirizzamento', d: 'L’insieme degli indirizzi che un processo può usare. Ogni processo ha il proprio.' },
      { sim: 'tabella', da: 'Dall’unità 5.1.1', t: 'La tabella delle pagine', d: 'La tabella, diversa per ogni processo, con cui il processore traduce gli indirizzi virtuali.' },
      { sim: 'memory', da: 'Dall’unità 2.5.4', t: 'La pagina', d: 'Un blocco di memoria di 4096 byte, l’unità con cui il kernel distribuisce la memoria.' }
    ],
    domanda: { d: 'Prima di proseguire: 4096 si scrive 0x1000 in esadecimale. Quanto vale, in decimale, 0x3000?', o: [
      { t: '12 288', ok: true, fb: '0x3000 è tre volte 0x1000: 3 × 4096 = 12 288.' },
      { t: '3 000', fb: 'Le cifre sono esadecimali: ogni posizione vale sedici volte la successiva.' },
      { t: '4 099', fb: 'Il 3 sta nella posizione che vale 4096, e va moltiplicato.' }
    ] }
  },
  idea: {
    titolo: 'Un indirizzo, due tabelle, due risposte',
    termini: ['frame fisico', 'indirizzo fisico', 'vpn', 'offset di pagina', 'pfn'],
    testo: [
      'Nell’unità 5.1.1 abbiamo detto che ogni processo vede uno spazio di indirizzamento tutto suo, e che una tabella traduce i suoi indirizzi virtuali in posizioni reali. Ora apriamo quella tabella. La conseguenza più sorprendente del meccanismo è questa: due processi possono usare lo stesso numero, e trovare due dati diversi.',
      'Lo spazio virtuale è diviso in pagine di 4096 byte. La memoria reale, la RAM, è divisa in porzioni della stessa grandezza, ciascuna chiamata [[frame fisico|frame]]. Il nome è lo stesso del frame di pila dell’unità 2.6.2, e il significato è un altro: qui un frame è un posto della RAM capace di ospitare una pagina. La posizione di un byte nella RAM è il suo [[indirizzo fisico]].',
      'Un indirizzo virtuale si scompone in due parti con una divisione per 4096. Il quoziente è il numero della pagina, che si abbrevia [[vpn|VPN]], da virtual page number. Il resto è la posizione del byte dentro la pagina, l’[[offset di pagina|offset]]. L’indirizzo 12 388 dà quoziente 3 e resto 100: pagina 3, offset 100. In esadecimale la scomposizione si legge a occhio, perché 4096 è 0x1000. L’indirizzo è 0x3064: le ultime tre cifre, 064, sono l’offset, e ciò che sta davanti è il numero della pagina.',
      { fig: 'scena', w: 720, h: 264, titolo: 'Lo stesso indirizzo virtuale, due frame diversi', nota: 'A e B chiedono entrambi 0x3064. La tabella di A porta al frame 4, quella di B al frame 8: due byte distinti.', els: SL.unita621.quadro('g', { off: 100, fb: 8 }, 5, { x: 10, y: 4, w: 700 }) },
      'La tabella delle pagine ha una riga per ogni pagina virtuale. Il VPN sceglie la riga, e nella riga si legge il numero del frame, abbreviato [[pfn|PFN]], da physical frame number. L’indirizzo fisico si ricompone al contrario: PFN × 4096 + offset. L’offset attraversa la traduzione senza cambiare, perché pagina e frame hanno la stessa grandezza. Se la riga 3 della tabella di A contiene il frame 4, il byte cercato da A sta all’indirizzo fisico 4 × 4096 + 100 = 16 484, cioè 0x4064.',
      'Ogni processo ha la propria tabella. Se la riga 3 della tabella di B contiene il frame 8, lo stesso indirizzo virtuale porta B a 0x8064, un altro byte. È questo a tenere separati i processi. Se invece le due righe contengono lo stesso frame, A e B raggiungono lo stesso byte: è il modo in cui il kernel fa condividere a più processi una stessa zona di memoria. Per sapere dove porta un indirizzo virtuale bisogna dunque dire sempre di quale processo si parla.'
    ]
  },
  esperimento: {
    faremo: [
      'Due processi, A e B, chiedono lo stesso indirizzo virtuale, nella pagina 3. La tabella di A associa alla pagina 3 il frame 4. Sceglierai l’offset del byte, e il frame che la tabella di B associa alla pagina 3.',
      'Scomporremo l’indirizzo in pagina e offset, consulteremo le due tabelle, e ricomporremo i due indirizzi fisici. In basso vedrai quali frame della RAM vengono raggiunti.'
    ],
    vedrai: [
      ['puntatore', 'L’indirizzo virtuale', 'In alto: l’indirizzo chiesto dai due processi, e le sue due parti.'],
      ['tabella', 'Le due tabelle', 'Al centro: la riga 3 della tabella di ciascun processo, e l’indirizzo fisico che ne risulta.'],
      ['memory', 'La memoria fisica', 'In basso: dieci frame della RAM. Sono segnati quelli raggiunti da A e da B.']
    ]
  },
  lab: {
    titolo: 'Lo stesso indirizzo in due processi',
    scena: { w: 860, h: 268 },
    atti: ['L’indirizzo virtuale', 'La traduzione di A', 'La traduzione di B', 'Il confronto'],
    controlli: [
      { id: 'off', tipo: 'scelta', eti: 'Offset del byte nella pagina', opzioni: [[100, '100'], [256, '256'], [4095, '4095']], valore: 100 },
      { id: 'fb', tipo: 'scelta', eti: 'Frame della pagina 3 nella tabella di B', opzioni: [[8, 'frame 8'], [4, 'frame 4, come A']], valore: 8 }
    ],
    nota: 'I passi sono sempre sette. Pagine e frame sono di 4096 byte, cioè 0x1000.',
    previsione: {
      domanda: (p) => { const U = SL.unita621; return 'A e B chiedono entrambi l’indirizzo virtuale ' + U.hex(U.ind(3, p.off)) + ', nella pagina 3. La tabella di A associa alla pagina 3 il frame 4. La tabella di B le associa il frame ' + p.fb + '. Quale indirizzo fisico raggiunge B?'; },
      opzioni: (p) => { const U = SL.unita621; return [3, 4, 8].map((f) => [f, U.hex(U.ind(f, p.off))]); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita621, h = (f) => U.hex(U.ind(f, p.off)); return 'La previsione indicava ' + h(pred) + '. B raggiunge ' + h(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 3 ? 'Quello è l’indirizzo virtuale. La traduzione sostituisce il numero della pagina, 3, con il numero del frame scritto nella tabella di B.' : 'Conta la tabella di B, che alla pagina 3 associa il frame ' + p.fb + '. La tabella di A riguarda soltanto A.'); },
    costruisci(p) {
      const U = SL.unita621, va = U.ind(3, p.off), paA = U.ind(4, p.off), paB = U.ind(p.fb, p.off), passi = [], stesso = p.fb === 4, N = SL.num;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Pagina', f >= 1 ? '3' : '·'], ['Offset', f >= 1 ? String(p.off) : '·', 'a'], ['Fisico di B', f >= 5 ? U.hex(paB) : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Lo stesso indirizzo virtuale', 'I processi A e B eseguono entrambi una lettura all’indirizzo virtuale ' + U.hex(va) + ', che in decimale è ' + N(va) + '. Il numero è lo stesso. Dove porti, dipende dalla tabella delle pagine di ciascuno.', {});
      P(1, 0, 'Pagina e offset', 'Dividiamo l’indirizzo per 4096. Il quoziente è 3: la pagina virtuale. Il resto è ' + p.off + ': l’offset. In esadecimale si legge direttamente: le ultime tre cifre di ' + U.hex(va) + ' sono l’offset, e davanti c’è il 3.', { calc: N(va) + ' = 3 × 4096 + ' + p.off });
      P(2, 1, 'La tabella di A', 'Il processore consulta la tabella delle pagine di A. La riga 3 contiene il frame 4: la pagina 3 di A si trova nel frame 4 della RAM.', { calc: 'A: pagina 3 → frame 4' });
      P(3, 1, 'L’indirizzo fisico di A', 'L’indirizzo fisico si ricompone con il frame al posto della pagina: 4 × 4096 + ' + p.off + ' = ' + N(paA) + ', cioè ' + U.hex(paA) + '. L’offset è rimasto ' + p.off + '.', { calc: '4 × 4096 + ' + p.off + ' = ' + N(paA) });
      P(4, 2, 'La tabella di B', 'Per B il processore consulta un’altra tabella, quella di B. La riga 3 contiene il frame ' + p.fb + '.', { calc: 'B: pagina 3 → frame ' + p.fb, chiedi: { d: 'Rispetto alla traduzione di A, che cosa cambia in quella di B?', o: stesso ? ['Nulla: stesso frame e stesso offset', 'L’offset', 'Il numero della pagina'] : ['Soltanto il frame: l’offset resta ' + p.off, 'Soltanto l’offset', 'Sia il frame sia l’offset'], g: 0, no: 'L’offset viene dall’indirizzo virtuale, che è lo stesso. Dalla tabella viene il frame.' } });
      P(5, 2, 'L’indirizzo fisico di B', p.fb + ' × 4096 + ' + p.off + ' = ' + N(paB) + ', cioè ' + U.hex(paB) + '.', { calc: p.fb + ' × 4096 + ' + p.off + ' = ' + N(paB) });
      P(6, 3, 'Il confronto', stesso ? 'Frame e offset coincidono: A e B raggiungono lo stesso byte, ' + U.hex(paA) + '. Le due tabelle indicano lo stesso frame, e i due processi condividono quella pagina. Una scrittura di A sarebbe visibile a B.' : 'A raggiunge ' + U.hex(paA) + ' e B raggiunge ' + U.hex(paB) + '. Lo stesso indirizzo virtuale ha portato a due byte distinti, lontani ' + N(paB - paA) + ' byte. Nessuno dei due processi può toccare il dato dell’altro attraverso quell’indirizzo.', { esito: [stesso ? 'stesso byte · ' + U.hex(paB) : 'B raggiunge ' + U.hex(paB), ''] });
      return { passi, esito: p.fb };
    }
  },
  bilancio: {
    regola: [
      'VPN = quoziente intero fra indirizzo virtuale e 4096. Offset = resto.',
      'Indirizzo fisico = PFN × 4096 + offset, con il PFN letto nella riga VPN della tabella del processo.'
    ],
    errori: [
      ['Confrontare due indirizzi virtuali senza guardare le tabelle.', 'Lo stesso numero, in due processi, può portare a due byte diversi.'],
      ['Tradurre anche l’offset.', 'L’offset passa immutato: la tabella sostituisce soltanto il numero della pagina.'],
      ['Scambiare il numero del frame per un indirizzo.', 'Il PFN conta frame da 4096 byte. L’indirizzo del byte è PFN × 4096 + offset.']
    ],
    saFare: ['Scomporre un indirizzo virtuale in pagina e offset.', 'Ricomporre l’indirizzo fisico dal frame.', 'Stabilire se due processi condividono un byte.'],
    esercizi: [
      { d: 'Le pagine sono di 4096 byte. Qual è il numero di pagina dell’indirizzo virtuale 20 500?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: '20 500 = 5 × 4096 + 20: pagina 5, offset 20.',
        diagnosi: [
          { se: ['20', 'venti'], msg: 'Venti è l’offset, cioè il resto. La pagina è il quoziente.' },
          { se: ['4', 'quattro'], msg: '4 × 4096 fa 16 384, e 5 × 4096 fa 20 480, che è ancora minore di 20 500.' },
          { se: ['6', 'sei'], msg: '6 × 4096 fa 24 576, che supera 20 500.' }
        ],
        altro: 'Il numero è diverso. Si divida l’indirizzo per 4096 e si prenda il quoziente intero.',
        indizi: ['5 × 4096 = 20 480.', '20 500 − 20 480 = 20.', 'Pagina 5, offset 20.'],
        svolgimento: ['20 500 / 4096 = 5, con resto 20.', 'VPN: 5.'] },
      { d: 'La tabella di un processo associa alla pagina 5 il frame 2. Qual è, in decimale, l’indirizzo fisico del byte di indirizzo virtuale 20 500?', segnaposto: 'Un numero', giuste: ['8212', '8 212', '0x2014'],
        ok: '2 × 4096 + 20 = 8 212.',
        diagnosi: [
          { se: ['8192', '8 192'], msg: 'Questo è l’inizio del frame 2. Aggiungi l’offset, 20.' },
          { se: ['20500', '20 500'], msg: 'Questo è l’indirizzo virtuale. Sostituisci la pagina 5 con il frame 2.' },
          { se: ['22', 'ventidue'], msg: 'Il frame va moltiplicato per 4096 prima di aggiungere l’offset.' }
        ],
        altro: 'Il numero è diverso. Si applichi PFN × 4096 + offset.',
        indizi: ['Offset: 20.', 'Frame 2: comincia a 2 × 4096 = 8 192.', '8 192 + 20 = 8 212.'],
        svolgimento: ['VPN 5, offset 20.', 'PFN: 2.', 'Indirizzo fisico: 8 212.'] },
      { d: 'Due processi usano lo stesso indirizzo virtuale. Quando raggiungono lo stesso byte?', guida: 'Si scelga la risposta.', o: [
        { t: 'Quando le loro tabelle associano a quella pagina lo stesso frame', ok: true, fb: 'L’offset è già uguale: se coincide anche il frame, coincide il byte.' },
        { t: 'Sempre: l’indirizzo è lo stesso', fb: 'Ogni processo ha la propria tabella, e le righe possono indicare frame diversi.' },
        { t: 'Mai: i processi sono isolati', fb: 'Il kernel può far indicare a due tabelle lo stesso frame, per condividere una zona di memoria.' }] }
    ],
    sfida: ['cslez6_2_01_address_spaces', 'Spazi di indirizzi']
  }
});
