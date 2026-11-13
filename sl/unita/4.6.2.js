'use strict';
SL.unita462 = (() => {
  const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
  const B8 = (v) => v.toString(2).padStart(8, '0');
  const TUTTI = [0, 1, 2, 3, 4, 5, 6, 7];
  // una riga: etichetta, otto bit, valore esadecimale. v nullo: riga vuota. st: stato dell'etichetta
  const riga = (pre, y, eti, v, st, o) => {
    const el = SL.el, els = [el.cella(pre + 'e', o.x, y, o.we, 34, eti, st || 'on', { piccola: true })];
    SL.x86.fila(pre + 'b', v == null ? 0 : v, 8, { x: o.x + o.we + 14, y, passo: o.passo, h: 34, indici: false, vuoto: v == null ? TUTTI : [], st: st === 'att' ? undefined : st === 'err' ? 'err' : st === 'off' ? 'off' : undefined }).forEach((e) => els.push(e));
    els.push(el.cella(pre + 'h', o.x + o.we + 14 + 8 * o.passo + 10, y, 84, 34, v == null ? '·' : H(v), st === 'err' ? 'err' : st === 'off' ? 'off' : st === 'att' ? 'att' : 'on', { piccola: true }));
    return els;
  };
  return { H, B8, riga };
})();
SL.registra('4.6.2', {
  titolo: 'Scritture di parità, modalità degradata e ricostruzione',
  obiettivo: 'Alla fine saprai calcolare la parità di una striscia, aggiornarla quando cambia un dato, e usarla per ricavare un blocco perduto.',
  concetti: [['gate', 'La parità è uno XOR'], ['raid', 'Ogni scrittura la aggiorna'], ['scudo', 'Un blocco perduto si ricalcola']],
  filigrana: ['raid', 'gate', 'bit'],
  richiami: {
    carte: [
      { sim: 'raid', da: 'Dall’unità 4.6.1', t: 'Striscia e parità', d: 'In ogni striscia un blocco contiene lo XOR degli altri.' },
      { sim: 'gate', da: 'Dall’unità 1.5.1', t: 'XOR bit per bit', d: 'Colonna per colonna: 1 se i due bit sono diversi, 0 se sono uguali.' },
      { sim: 'hex', da: 'Dall’unità 1.2.4', t: 'L’esadecimale', d: '0x55 è 0101 0101, e 0x33 è 0011 0011.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale 0101 XOR 0011?', o: [
      { t: '0110', ok: true, fb: 'Le colonne centrali hanno bit diversi, le due esterne bit uguali.' },
      { t: '0111', fb: 'Questo è OR. XOR dà 0 dove entrambi i bit valgono 1.' },
      { t: '0001', fb: 'Questo è AND. XOR segnala le colonne in cui i bit sono diversi.' }
    ] }
  },
  idea: {
    titolo: 'La parità deve seguire i dati',
    termini: ['piccola scrittura', 'modalità degradata', 'ricostruzione del disco'],
    testo: [
      'Riduciamo una striscia RAID 5 al minimo: due blocchi di dati, A e B, su due dischi, e la parità P su un terzo. Seguiremo un solo byte per blocco, perché ogni byte si comporta allo stesso modo. La parità è P = A XOR B. Con A = 0x55 e B = 0x33 si ottiene P = 0x66.',
      { fig: 'scena', w: 720, h: 132, titolo: 'P = A XOR B, colonna per colonna', nota: 'Dove i bit di A e di B sono diversi la parità vale 1, dove sono uguali vale 0.', els: SL.unita462.riga('ga', 4, 'disco 0 · A', 0x55, 'on', { x: 60, we: 150, passo: 44 }).concat(SL.unita462.riga('gb', 44, 'disco 1 · B', 0x33, 'on', { x: 60, we: 150, passo: 44 }), SL.unita462.riga('gp', 84, 'disco 2 · P', 0x66, 'att', { x: 60, we: 150, passo: 44 })) },
      'La parità vale qualcosa soltanto se è aggiornata. Quando il sistema riscrive A, anche P deve cambiare. Ricalcolarla da capo richiederebbe di leggere tutti gli altri blocchi della striscia, che in un RAID vero sono molti. C’è una via più breve: P nuova = P vecchia XOR A vecchio XOR A nuovo. Il primo XOR toglie da P il contributo del vecchio A, perché due XOR con lo stesso valore si annullano, e il secondo aggiunge il contributo del nuovo.',
      'Questa procedura è la [[piccola scrittura]], e ha un costo fisso. Per cambiare un solo blocco si leggono il vecchio A e la vecchia P, e poi si scrivono il nuovo A e la nuova P: due letture e due scritture, al posto della sola scrittura richiesta.',
      'Se il disco di A si guasta, il volume passa in [[modalità degradata]]. Continua a funzionare, e ogni lettura di A viene sostituita dal calcolo B XOR P. Quando arriva un disco nuovo comincia la [[ricostruzione del disco|ricostruzione]]: lo stesso calcolo, striscia per striscia, riscrive tutti i blocchi mancanti. Fino alla fine della ricostruzione il volume non ha margine, e un secondo guasto sarebbe fatale.'
    ]
  },
  esperimento: {
    faremo: [
      'Una striscia contiene A, B e la parità P. Sceglierai il vecchio valore di A, il valore di B e il nuovo valore da scrivere in A.',
      'Calcoleremo la parità iniziale, eseguiremo la piccola scrittura contando letture e scritture, e poi guasteremo il disco di A per vedere se la parità aggiornata restituisce il valore nuovo.'
    ],
    vedrai: [
      ['raid', 'I tre dischi', 'A sinistra: il disco e il blocco che contiene.'],
      ['bit', 'I bit', 'Al centro: gli otto bit del byte, e a destra il valore esadecimale.'],
      ['tabella', 'Le operazioni', 'In alto, nel cruscotto: le letture e le scritture di blocco compiute.']
    ]
  },
  lab: {
    titolo: 'Una piccola scrittura, poi un guasto',
    scena: { w: 860, h: 258 },
    atti: ['La striscia', 'La piccola scrittura', 'Il guasto'],
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'A vecchio', opzioni: [[0x55, '0x55'], [0x0F, '0x0F'], [0xC3, '0xC3']], valore: 0x55 },
      { id: 'b', tipo: 'scelta', eti: 'B', opzioni: [[0x33, '0x33'], [0xF0, '0xF0']], valore: 0x33 },
      { id: 'n', tipo: 'scelta', eti: 'A nuovo', opzioni: [[0xAA, '0xAA'], [0x00, '0x00'], [0x5A, '0x5A']], valore: 0xAA }
    ],
    nota: 'I passi sono sempre sette. Ogni riga mostra un byte del blocco.',
    previsione: {
      domanda: (p) => { const H = SL.unita462.H; return 'La striscia contiene A = ' + H(p.a) + ' e B = ' + H(p.b) + ', con parità P = ' + H(p.a ^ p.b) + '. Il sistema scrive in A il valore ' + H(p.n) + '. Quanto deve valere la parità dopo la scrittura?'; },
      opzioni: (p) => { const H = SL.unita462.H; return [[p.a ^ p.b, H(p.a ^ p.b) + ', come prima'], [p.n ^ p.b, H(p.n ^ p.b)], [p.n, H(p.n) + ', il nuovo dato']]; }
    },
    confronto: (pred, esito, p) => { const H = SL.unita462.H; return 'Avevi previsto ' + H(pred) + '. La parità aggiornata vale ' + H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === (p.a ^ p.b) ? 'Una parità rimasta al vecchio valore restituirebbe, dopo un guasto, il vecchio A.' : 'La parità è lo XOR di tutti i dati della striscia, e B continua a farne parte.'); },
    costruisci(p) {
      const U = SL.unita462, H = U.H, el = SL.el, passi = [], pv = p.a ^ p.b, pn = pv ^ p.a ^ p.n, O = { x: 20, we: 190, passo: 44 };
      // fase: 0 la striscia · 1 la parità · 2 la richiesta · 3 le letture · 4 la nuova parità · 5 le scritture · 6 il guasto
      const quadro = (f) => {
        const els = [el.nota('t0', 20, 0, 'STRISCIA', 'mono'), el.nota('t1', 20, 148, f >= 6 ? 'RICOSTRUZIONE' : 'IN PREPARAZIONE', 'mono')];
        const aOra = f >= 5 ? p.n : p.a, pOra = f >= 5 ? pn : pv;
        U.riga('ra', 24, 'disco 0 · A', f >= 6 ? null : aOra, f >= 6 ? 'err' : f === 3 || f === 5 ? 'att' : 'on', O).forEach((e) => els.push(e));
        U.riga('rb', 64, 'disco 1 · B', p.b, f === 6 ? 'att' : 'on', O).forEach((e) => els.push(e));
        U.riga('rp', 104, 'disco 2 · P', f >= 1 ? pOra : null, f === 1 || f === 3 || f === 5 || f === 6 ? 'att' : 'on', O).forEach((e) => els.push(e));
        if (f >= 6) U.riga('rx', 172, 'B XOR P', p.b ^ pn, 'att', O).forEach((e) => els.push(e));
        else { U.riga('rn', 172, 'A nuovo', f >= 2 && f < 5 ? p.n : null, f === 2 ? 'att' : f >= 5 ? 'off' : 'on', O).forEach((e) => els.push(e)); U.riga('rq', 212, 'P nuova', f === 4 ? pn : null, f === 4 ? 'att' : f >= 5 ? 'off' : 'on', O).forEach((e) => els.push(e)); }
        return els;
      };
      const hud = (f) => [['Parità', f >= 1 ? H(f >= 5 ? pn : pv) : '·', 'a'], ['Letture', String(f >= 3 ? 2 : 0)], ['Scritture', String(f >= 5 ? 2 : 0), 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));
      const col = [7, 6, 5, 4, 3, 2, 1, 0].find((k) => ((p.a >> k) & 1) !== ((p.b >> k) & 1));

      P(0, 0, 'La striscia', 'Il disco 0 contiene A = ' + H(p.a) + ', il disco 1 contiene B = ' + H(p.b) + '. Il disco 2 è riservato, in questa striscia, alla parità.', {});
      P(1, 0, 'La parità', 'La parità è lo XOR di A e B, colonna per colonna: ' + U.B8(p.a) + ' XOR ' + U.B8(p.b) + ' = ' + U.B8(pv) + ', cioè ' + H(pv) + '.', { calc: H(p.a) + ' XOR ' + H(p.b) + ' = ' + H(pv), chiedi: { d: 'Nel bit di peso ' + col + ', A vale ' + ((p.a >> col) & 1) + ' e B vale ' + ((p.b >> col) & 1) + '. Quanto vale la parità in quella colonna?', o: ['0', '1'], g: 1, no: 'I due bit sono diversi, e XOR dà 1.' } });
      P(2, 1, 'La richiesta', 'Il sistema chiede di scrivere in A il valore ' + H(p.n) + '. Scrivere soltanto A lascerebbe la parità ferma al vecchio contenuto, e la striscia diventerebbe incoerente.', {});
      P(3, 1, 'Due letture', 'Per aggiornare la parità servono il vecchio A e la vecchia P. Il controller legge i due blocchi: ' + H(p.a) + ' e ' + H(pv) + '. Il blocco B resta dov’è, senza essere letto.', { calc: '2 letture: A vecchio, P vecchia' });
      P(4, 1, 'La nuova parità', 'Si toglie dalla parità il contributo del vecchio A e si aggiunge quello del nuovo: ' + H(pv) + ' XOR ' + H(p.a) + ' XOR ' + H(p.n) + ' = ' + H(pn) + '. Il risultato coincide con ' + H(p.n) + ' XOR ' + H(p.b) + ', come se la parità fosse stata ricalcolata da capo.', { calc: H(pv) + ' XOR ' + H(p.a) + ' XOR ' + H(p.n) + ' = ' + H(pn) });
      P(5, 1, 'Due scritture', 'Il controller scrive il nuovo A sul disco 0 e la nuova P sul disco 2. Una scrittura di un blocco è costata quattro operazioni: due letture e due scritture.', { calc: '2 letture + 2 scritture', esito: ['P = ' + H(pn), ''] });
      P(6, 2, 'Il disco di A si guasta', 'Il disco 0 smette di funzionare, e il volume passa in modalità degradata. Per leggere A si calcola B XOR P: ' + H(p.b) + ' XOR ' + H(pn) + ' = ' + H(p.b ^ pn) + '. È il valore nuovo di A, perché la parità era stata aggiornata.', { calc: H(p.b) + ' XOR ' + H(pn) + ' = ' + H(p.b ^ pn), esito: ['A = ' + H(p.b ^ pn) + ' ricostruito', 'si'] });
      return { passi, esito: pn };
    }
  },
  bilancio: {
    regola: [
      'Parità = XOR di tutti i blocchi di dati della striscia. Blocco mancante = XOR della parità e dei blocchi rimasti.',
      'Piccola scrittura: P nuova = P vecchia XOR dato vecchio XOR dato nuovo. Costa due letture e due scritture di blocco.'
    ],
    errori: [
      ['Scrivere il dato e lasciare la parità com’era.', 'Dopo un guasto la ricostruzione restituirebbe il dato vecchio.'],
      ['Calcolare la nuova parità con il solo dato nuovo.', 'Prima va tolto il contributo del dato vecchio, con un altro XOR.'],
      ['Usare OR al posto di XOR.', 'OR perde informazione. Soltanto XOR si annulla ripetendolo, e permette di tornare indietro.']
    ],
    saFare: ['Calcolo la parità di due byte.', 'Aggiorno la parità dopo una scrittura.', 'Ricavo un byte perduto dalla parità e dagli altri.'],
    esercizi: [
      { d: 'In una striscia A = 0x3C e B = 0x0F. Quanto vale la parità P = A XOR B? Rispondi in esadecimale.', segnaposto: 'Un byte', giuste: ['33', '0x33', '33h'],
        ok: '0011 1100 XOR 0000 1111 = 0011 0011, cioè 0x33.',
        diagnosi: [
          { se: ['3f', '0x3f'], msg: 'Questo è OR. XOR dà 0 dove entrambi i bit valgono 1.' },
          { se: ['0c', '0x0c', 'c', '0xc'], msg: 'Questo è AND. XOR segnala le colonne in cui i bit sono diversi.' },
          { se: ['4b', '0x4b'], msg: 'Questa è la somma. XOR lavora colonna per colonna, senza riporti.' }
        ],
        altro: 'Il valore è diverso. Scrivi i due byte in binario e confronta le colonne.',
        indizi: ['0x3C è 0011 1100, 0x0F è 0000 1111.', 'Le colonne con bit diversi sono quelle di peso 5, 4, 1 e 0.', '0011 0011 è 0x33.'],
        svolgimento: ['A = 0011 1100.', 'B = 0000 1111.', 'P = 0011 0011 = 0x33.'] },
      { d: 'Una striscia ha parità P = 0x66. Il blocco A, che valeva 0x55, viene riscritto con 0xF0. Quanto vale la nuova parità? Rispondi in esadecimale.', segnaposto: 'Un byte', giuste: ['c3', '0xc3', 'c3h'],
        ok: '0x66 XOR 0x55 = 0x33, e 0x33 XOR 0xF0 = 0xC3.',
        diagnosi: [
          { se: ['96', '0x96'], msg: 'Hai aggiunto il nuovo A senza togliere il vecchio. Serve anche lo XOR con 0x55.' },
          { se: ['a5', '0xa5'], msg: 'Questo è lo XOR fra vecchio e nuovo A. Va applicato alla vecchia parità, 0x66.' },
          { se: ['66', '0x66'], msg: 'La parità deve cambiare ogni volta che cambia un dato della striscia.' }
        ],
        altro: 'Il valore è diverso. Applica alla vecchia parità due XOR: con il vecchio A e con il nuovo A.',
        indizi: ['P nuova = P vecchia XOR A vecchio XOR A nuovo.', '0x66 XOR 0x55 = 0x33.', '0x33 XOR 0xF0 = 0xC3.'],
        svolgimento: ['0x66 XOR 0x55 = 0x33: è il contributo degli altri dati.', '0x33 XOR 0xF0 = 0xC3.'] },
      { d: 'Il disco che conteneva A si è guastato. Sui superstiti si leggono B = 0x33 e P = 0x99. Quanto valeva A? Rispondi in esadecimale.', segnaposto: 'Un byte', giuste: ['aa', '0xaa', 'aah'],
        ok: '0x33 XOR 0x99 = 0xAA.',
        diagnosi: [
          { se: ['bb', '0xbb'], msg: 'Questo è OR. Per ricavare il blocco mancante serve XOR.' },
          { se: ['11', '0x11'], msg: 'Questo è AND. Per ricavare il blocco mancante serve XOR.' },
          { se: ['cc', '0xcc'], msg: 'Questa è la somma. XOR lavora colonna per colonna, senza riporti.' }
        ],
        altro: 'Il valore è diverso. Calcola B XOR P in binario.',
        indizi: ['A = B XOR P.', '0x33 è 0011 0011, 0x99 è 1001 1001.', '1010 1010 è 0xAA.'],
        svolgimento: ['B = 0011 0011.', 'P = 1001 1001.', 'A = 1010 1010 = 0xAA.'] },
      { d: 'Quante operazioni su blocchi richiede una piccola scrittura in RAID 5?', guida: 'Scegli la risposta.', o: [
        { t: 'Due letture e due scritture', ok: true, fb: 'Si leggono il dato vecchio e la parità vecchia, si scrivono il dato nuovo e la parità nuova.' },
        { t: 'Una scrittura', fb: 'Scrivendo soltanto il dato, la parità resterebbe sbagliata.' },
        { t: 'Una lettura e una scrittura', fb: 'Vanno letti due blocchi, dato e parità, e riscritti entrambi.' }] }
    ],
    sfida: ['cslez4_6_03_raid_ssd_03', 'Copie e ricostruzione in RAID 1']
  }
});
