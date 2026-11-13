'use strict';
SL.unita461 = (() => {
  const LIV = {
    r0: { nome: 'RAID 0', cap: 8, calc: '4 × 2 = 8 TB', dischi: ['blocco A', 'blocco B', 'blocco C', 'blocco D'], ok: () => false, come: 'I blocchi sono distribuiti sui quattro dischi, senza alcuna copia.' },
    r1: { nome: 'RAID 1', cap: 2, calc: '1 × 2 = 2 TB', dischi: ['tutto il volume', 'tutto il volume', 'tutto il volume', 'tutto il volume'], ok: () => true, come: 'Ogni disco contiene una copia completa del volume.' },
    r10: { nome: 'RAID 10', cap: 4, calc: '2 × 2 = 4 TB', dischi: ['copia di A', 'copia di A', 'copia di B', 'copia di B'], ok: (g) => !(g.includes(0) && g.includes(1)) && !(g.includes(2) && g.includes(3)), come: 'I dischi 0 e 1 formano una coppia a specchio, i dischi 2 e 3 un’altra. I blocchi sono distribuiti fra le due coppie.' },
    r5: { nome: 'RAID 5', cap: 6, calc: '(4 − 1) × 2 = 6 TB', dischi: ['blocco A', 'blocco B', 'blocco C', 'parità P'], ok: (g) => g.length <= 1, come: 'Ogni striscia contiene tre blocchi di dati e un blocco di parità, che da una striscia all’altra cambia disco.' },
    r6: { nome: 'RAID 6', cap: 4, calc: '(4 − 2) × 2 = 4 TB', dischi: ['blocco A', 'blocco B', 'parità P', 'parità Q'], ok: (g) => g.length <= 2, come: 'Ogni striscia contiene due blocchi di dati e due blocchi di parità, calcolati con due relazioni indipendenti.' }
  };
  const GUASTI = { g0: [0], g01: [0, 1], g02: [0, 2] };
  // fase: 0 l'organizzazione · 1 la capacità · 2 i guasti · 3 la leggibilità · 4 la ricostruzione (RAID 5)
  const quadro = (pre, p, f, o) => {
    const el = SL.el, L = LIV[p.liv], g = GUASTI[p.g], ok = L.ok(g), els = [], w = (o.w - 3 * o.gap) / 4;
    for (let k = 0; k < 4; k++) { const rotto = f >= 2 && g.includes(k); els.push(el.box(pre + 'd' + k, o.x + k * (w + o.gap), o.y, w, o.h, 'disco ' + k + (p.liv === 'r10' ? ' · coppia ' + (k < 2 ? 1 : 2) : ''), rotto ? (f >= 4 && p.liv === 'r5' && g.length === 1 ? 'A = 0x15 ricostruito' : 'guasto') : L.dischi[k], rotto ? (f >= 4 && p.liv === 'r5' && g.length === 1 ? 'zero' : 'err') : f === 0 ? 'att' : 'on', { cls: 'stretta' })); }
    [['capacità grezza', '8 TB', 1], ['capacità utile', f >= 1 ? L.cap + ' TB' : '·', 1], ['dischi superstiti', f >= 2 ? String(4 - g.length) : '·', 2], ['volume leggibile', f >= 3 ? (ok ? 'sì, per intero' : 'no') : '·', 3]].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (w + o.gap), o.y + o.h + 20, w, o.h, r[0], r[1], f >= 3 && k === 3 ? (ok ? 'att' : 'err') : f === r[2] ? 'att' : f > r[2] ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  // tabella riassuntiva per la figura dell'idea
  const tabella = (pre, x, y) => {
    const el = SL.el, els = [], R = [['r0', 'nessun guasto'], ['r1', 'fino a 3 guasti'], ['r10', '1 guasto per coppia'], ['r5', '1 guasto qualsiasi'], ['r6', '2 guasti qualsiasi']], T = { r0: ['A', 'B', 'C', 'D'], r1: ['A', 'A', 'A', 'A'], r10: ['A', 'A', 'B', 'B'], r5: ['A', 'B', 'C', 'P'], r6: ['A', 'B', 'P', 'Q'] };
    els.push(el.nota(pre + 'h0', x + 100, y, 'disco 0', 'mono'), el.nota(pre + 'h1', x + 174, y, 'disco 1', 'mono'), el.nota(pre + 'h2', x + 248, y, 'disco 2', 'mono'), el.nota(pre + 'h3', x + 322, y, 'disco 3', 'mono'), el.nota(pre + 'h4', x + 408, y, 'utile', 'mono'), el.nota(pre + 'h5', x + 494, y, 'sopporta', 'mono'));
    R.forEach((r, j) => { const yy = y + 24 + j * 38; els.push(el.nota(pre + 'n' + j, x, yy + 8, LIV[r[0]].nome, 'mono'));
      T[r[0]].forEach((t, k) => els.push(el.cella(pre + j + 'c' + k, x + 100 + k * 74, yy, 70, 32, t, t === 'P' || t === 'Q' ? 'zero' : 'on', { piccola: true })));
      els.push(el.cella(pre + j + 'u', x + 408, yy, 74, 32, LIV[r[0]].cap + ' TB', 'att', { piccola: true }), el.nota(pre + j + 's', x + 494, yy + 8, r[1], 'mono')); });
    return els;
  };
  return { LIV, GUASTI, quadro, tabella };
})();
SL.registra('4.6.1', {
  titolo: 'Ridondanza, modelli di guasto e RAID',
  obiettivo: 'Alla fine saprai dire, per i principali livelli RAID, quanta capacità resta utilizzabile e quali guasti il volume può sopportare.',
  concetti: [['raid', 'Più dischi, un solo volume'], ['disco', 'Copie e parità'], ['scudo', 'Sopravvivere a un guasto']],
  filigrana: ['raid', 'disco', 'scudo'],
  richiami: {
    carte: [
      { sim: 'disco', da: 'Dall’unità 4.5.2', t: 'Il blocco logico', d: 'Il disco si presenta come una fila di blocchi numerati.' },
      { sim: 'gate', da: 'Dall’unità 1.5.1', t: 'XOR', d: 'Dà 1 quando i due bit sono diversi, 0 quando sono uguali.' },
      { sim: 'storage', da: 'Dall’unità 0.1', t: 'La memoria di massa', d: 'Conserva i dati a macchina spenta. Un guasto può cancellarli.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale 1 XOR 1?', o: [
      { t: '0', ok: true, fb: 'I due bit sono uguali, e XOR dà 0.' },
      { t: '1', fb: 'XOR dà 1 soltanto quando i due bit sono diversi.' },
      { t: '2', fb: 'XOR lavora su bit, e il risultato è 0 oppure 1.' }
    ] }
  },
  idea: {
    titolo: 'Dati in più, per non perdere i dati',
    termini: ['volume', 'raid', 'specchio', 'striscia di blocchi', 'blocco di parità'],
    testo: [
      'Un disco prima o poi si guasta, e con lui se ne vanno i dati. Il rimedio è la ridondanza: conservare qualcosa in più dello stretto necessario, su dischi diversi. Più dischi possono presentarsi al sistema come un solo [[volume]], cioè una sola fila di blocchi. Le organizzazioni che lo permettono vanno sotto la sigla [[raid|RAID]], e si distinguono per livello. Prendiamo quattro dischi da 2 terabyte, in tutto 8 TB.',
      'RAID 0 distribuisce i blocchi sui quattro dischi senza copie. Tutti gli 8 TB sono utilizzabili, e la ridondanza è nulla: al primo guasto mancano dei blocchi. RAID 1 fa l’opposto. Ogni disco è uno [[specchio]], cioè una copia completa: la capacità utile scende a 2 TB, e il volume resta leggibile finché sopravvive un disco. RAID 10 combina i due: i dischi formano due coppie a specchio e i blocchi si distribuiscono fra le coppie. La capacità utile è 4 TB, e serve che in ogni coppia resti un disco.',
      'RAID 5 ottiene la protezione con meno spazio. I blocchi sono raggruppati in gruppi che attraversano tutti i dischi, e ogni gruppo è una [[striscia di blocchi|striscia]]. In ogni striscia c’è un [[blocco di parità]], che contiene lo XOR, bit per bit, degli altri blocchi. Lo XOR ha una proprietà preziosa: se P = A XOR B XOR C, allora A = P XOR B XOR C. Un blocco mancante si ricava dagli altri. La parità occupa in tutto l’equivalente di un disco, e restano (4 − 1) × 2 = 6 TB. RAID 6 conserva due parità indipendenti per striscia: restano 4 TB, e si possono ricavare due blocchi mancanti.',
      { fig: 'scena', w: 720, h: 222, titolo: 'Quattro dischi da 2 TB: che cosa contiene una striscia', nota: 'A, B, C e D sono blocchi di dati. P e Q sono blocchi di parità.', els: SL.unita461.tabella('g', 20, 0) },
      'Una sola parità è una sola equazione, e determina una sola incognita. Con due dischi guasti, RAID 5 ha due blocchi mancanti per striscia e nessun modo di ricavarli. Lo stesso conto spiega gli altri livelli: quel che conta è quante copie, o quante relazioni indipendenti, restano per ogni blocco perduto.'
    ]
  },
  esperimento: {
    faremo: [
      'Quattro dischi da 2 TB formano un volume. Sceglierai il livello RAID e quali dischi si guastano.',
      'Vedremo come sono disposti i dati, quanta capacità resta utilizzabile e se dopo i guasti il volume è ancora leggibile per intero. Prova RAID 10 con i guasti «0 e 1» e poi «0 e 2»: i dischi persi sono due in entrambi i casi.'
    ],
    vedrai: [
      ['raid', 'I quattro dischi', 'In alto: il contenuto di ciascun disco in una striscia, e i dischi guasti.'],
      ['tabella', 'Il bilancio', 'In basso: capacità grezza e utile, dischi superstiti, leggibilità del volume.']
    ]
  },
  lab: {
    titolo: 'Che cosa sopravvive a un guasto',
    scena: { w: 860, h: 172 },
    atti: ['L’organizzazione', 'I guasti', 'L’esito'],
    controlli: [
      { id: 'liv', tipo: 'scelta', eti: 'Livello', opzioni: [['r0', 'RAID 0'], ['r1', 'RAID 1'], ['r10', 'RAID 10'], ['r5', 'RAID 5'], ['r6', 'RAID 6']], valore: 'r5' },
      { id: 'g', tipo: 'scelta', eti: 'Dischi guasti', opzioni: [['g0', 'solo il disco 0'], ['g01', 'i dischi 0 e 1'], ['g02', 'i dischi 0 e 2']], valore: 'g0' }
    ],
    nota: 'I passi sono quattro, cinque con RAID 5. Il modello suppone integri i blocchi dei dischi superstiti.',
    previsione: {
      domanda: (p) => { const U = SL.unita461; return 'Quattro dischi da 2 TB sono organizzati in ' + U.LIV[p.liv].nome + '. Si ' + (U.GUASTI[p.g].length === 1 ? 'guasta il disco 0' : 'guastano i dischi ' + U.GUASTI[p.g].join(' e ')) + '. Il volume resta leggibile per intero?'; },
      opzioni: () => [['si', 'Sì, per intero'], ['no', 'No: mancano dei blocchi']]
    },
    confronto: (pred, esito, p) => { const U = SL.unita461, L = U.LIV[p.liv]; return 'Avevi previsto che il volume ' + (pred === 'si' ? 'restasse leggibile' : 'perdesse dei blocchi') + '. ' + (esito === 'si' ? 'Il volume resta leggibile per intero. ' : 'Al volume mancano dei blocchi. ') + (pred === esito ? 'La previsione coincide con l’esito.' : p.liv === 'r10' ? 'In RAID 10 conta quali dischi si guastano: serve un superstite in ogni coppia.' : p.liv === 'r5' ? 'RAID 5 ha una sola parità per striscia, e ricava un solo blocco mancante.' : p.liv === 'r6' ? 'RAID 6 ha due parità per striscia, e ricava fino a due blocchi mancanti.' : p.liv === 'r1' ? 'In RAID 1 ogni disco superstite contiene l’intero volume.' : 'RAID 0 conserva ogni blocco in una sola copia.'); },
    costruisci(p) {
      const U = SL.unita461, L = U.LIV[p.liv], g = U.GUASTI[p.g], ok = L.ok(g), passi = [], uno = g.length === 1;
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 6, w: 820, gap: 12, h: 58 });
      const hud = (f) => [['Livello', L.nome, 'a'], ['Capacità utile', f >= 1 ? L.cap + ' TB' : '·'], ['Leggibile', f >= 3 ? (ok ? 'sì' : 'no') : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));
      const PERCHE = {
        r0: 'Il blocco A stava soltanto sul disco 0' + (uno ? '' : ', e lo stesso vale per il blocco del disco ' + g[1]) + '. Nessun altro disco ne conserva una copia o una parità.',
        r1: 'Restano ' + (4 - g.length) + ' dischi, e ciascuno contiene l’intero volume. Ne basterebbe uno.',
        r10: p.g === 'g0' ? 'Nella coppia 1 resta il disco 1, che contiene la stessa copia. La coppia 2 è intatta.' : p.g === 'g01' ? 'La coppia 1 ha perso entrambi i dischi, e con loro tutte le copie dei suoi blocchi. La coppia 2 è intatta, e contiene altri dati.' : 'La coppia 1 conserva il disco 1, la coppia 2 il disco 3. In ogni coppia resta una copia.',
        r5: uno ? 'In ogni striscia manca un solo blocco, e la parità basta a ricavarlo dagli altri tre.' : 'In ogni striscia mancano due blocchi, e la relazione di parità è una sola: le incognite sono troppe.',
        r6: (uno ? 'In ogni striscia manca un solo blocco.' : 'In ogni striscia mancano due blocchi.') + ' Le relazioni di parità sono due, e bastano a ricavare fino a due incognite.'
      };

      P(0, 0, 'Quattro dischi, un volume', L.come + ' La figura mostra che cosa contiene ciascun disco in una striscia.', {});
      P(1, 0, 'La capacità utile', 'I quattro dischi offrono 4 × 2 = 8 TB grezzi. ' + (p.liv === 'r0' ? 'Senza ridondanza sono tutti utilizzabili.' : p.liv === 'r1' ? 'Le copie sono quattro, e il volume ha la capacità di un solo disco.' : p.liv === 'r10' ? 'Ogni coppia vale quanto un disco, e le coppie sono due.' : p.liv === 'r5' ? 'La parità occupa l’equivalente di un disco.' : 'Le due parità occupano l’equivalente di due dischi.') + ' La capacità utile è di ' + L.cap + ' TB.', { calc: L.calc });
      P(2, 1, uno ? 'Un guasto' : 'Due guasti', (uno ? 'Il disco 0 smette di funzionare.' : 'I dischi ' + g.join(' e ') + ' smettono di funzionare.') + ' Tutto ciò che contenevano è irraggiungibile. Restano ' + (4 - g.length) + ' dischi.',
        Object.assign({ calc: 'dischi superstiti: ' + (4 - g.length) }, p.liv === 'r10' ? { chiedi: { d: 'Nella coppia 1, formata dai dischi 0 e 1, è rimasto almeno un disco?', o: ['Sì', 'No'], g: g.includes(1) ? 1 : 0, no: g.includes(1) ? 'Si sono guastati sia il disco 0 sia il disco 1.' : 'Il disco 1 funziona ancora.' } } : p.liv === 'r5' || p.liv === 'r6' ? { chiedi: { d: 'Quanti blocchi mancano in ogni striscia?', o: ['Uno', 'Due', 'Nessuno'], g: uno ? 0 : 1, no: 'Ogni disco guasto toglie un blocco a ogni striscia.' } } : {}));
      P(3, 2, ok ? 'Il volume resta leggibile' : 'Il volume è incompleto', PERCHE[p.liv] + (ok ? ' Il volume continua a funzionare, più lentamente, finché i dischi guasti non vengono sostituiti.' : ' I dati mancanti sono perduti.'), { esito: [ok ? 'leggibile per intero' : 'blocchi mancanti', ok ? 'si' : 'no'] });
      if (p.liv === 'r5') P(4, 2, uno ? 'La ricostruzione di un blocco' : 'Due incognite, una equazione', uno ? 'Nella striscia mostrata il disco 0 conteneva il blocco A. Sui superstiti si leggono, per un byte, B = 0x31, C = 0x42 e P = 0x66. Lo XOR dei tre restituisce il byte mancante: A = 0x15.' : 'La relazione è P = A XOR B XOR C. Con due blocchi sconosciuti, molte coppie di valori la soddisfano tutte, e nessun calcolo può scegliere quella giusta.', { calc: uno ? '0x66 XOR 0x31 XOR 0x42 = 0x15' : '1 equazione, 2 incognite', esito: [ok ? 'leggibile per intero' : 'blocchi mancanti', ok ? 'si' : 'no'] });
      return { passi, esito: ok ? 'si' : 'no' };
    }
  },
  bilancio: {
    regola: [
      'Con n dischi uguali: RAID 0 usa tutta la capacità e non sopporta guasti. RAID 1 ha la capacità di un disco. RAID 5 ne perde uno per la parità, RAID 6 due. RAID 10 ne usa metà.',
      'Un blocco perduto si recupera se ne resta una copia, oppure se restano abbastanza relazioni di parità: una per ogni blocco mancante nella striscia.'
    ],
    errori: [
      ['Contare soltanto il numero dei dischi guasti.', 'In RAID 10 due guasti possono essere innocui oppure fatali, secondo le coppie colpite.'],
      ['Pensare che RAID 5 dedichi un disco alla parità.', 'La parità cambia disco da una striscia all’altra. Occupa l’equivalente di un disco.'],
      ['Considerare RAID 0 una protezione.', 'RAID 0 aumenta la capacità e basta. Un guasto qualsiasi rovina il volume.']
    ],
    saFare: ['Calcolo la capacità utile di un livello RAID.', 'Stabilisco se un insieme di guasti lascia leggibile il volume.', 'Spiego perché una parità ricava un solo blocco.'],
    esercizi: [
      { d: 'Sei dischi da 4 TB sono organizzati in RAID 5. Qual è la capacità utile, in terabyte?', segnaposto: 'Un numero', giuste: ['20', '20tb', 'venti'],
        ok: '(6 − 1) × 4 = 20 TB.',
        diagnosi: [
          { se: ['24', '24tb'], msg: 'Questa è la capacità grezza. La parità occupa l’equivalente di un disco.' },
          { se: ['16', '16tb'], msg: 'Due dischi di parità sono quelli di RAID 6. RAID 5 ne usa uno.' },
          { se: ['12', '12tb'], msg: 'La metà è la capacità di RAID 10. In RAID 5 si perde un solo disco.' }
        ],
        altro: 'Il valore è diverso. Togli un disco al conto e moltiplica per la capacità di ciascuno.',
        indizi: ['La parità occupa l’equivalente di un disco.', 'Restano 5 dischi di dati.', '5 × 4 = 20.'],
        svolgimento: ['Dischi: 6.', 'Equivalente per la parità: 1.', 'Capacità utile: 5 × 4 = 20 TB.'] },
      { d: 'In un RAID 10 i dischi 0 e 1 formano una coppia, i dischi 2 e 3 un’altra. Si guastano i dischi 1 e 2. Il volume è ancora leggibile?', guida: 'Scegli la risposta.', o: [
        { t: 'Sì: in ogni coppia resta una copia', ok: true, fb: 'Restano il disco 0 per la prima coppia e il disco 3 per la seconda.' },
        { t: 'No: due guasti sono troppi', fb: 'Conta dove cadono i guasti. Qui ogni coppia conserva un disco.' },
        { t: 'Soltanto per metà', fb: 'Entrambe le coppie hanno ancora una copia completa.' }] },
      { d: 'In un RAID 5 si guastano due dischi. Perché il volume è perduto?', guida: 'Scegli la risposta.', o: [
        { t: 'Ogni striscia ha due blocchi mancanti e una sola relazione di parità', ok: true, fb: 'Una equazione determina una sola incognita.' },
        { t: 'Uno dei due dischi era quello della parità', fb: 'La parità è distribuita su tutti i dischi, striscia per striscia.' },
        { t: 'La capacità utile scende sotto la metà', fb: 'La capacità è estranea al problema. Mancano i dati per ricavare i blocchi.' }] }
    ],
    sfida: ['cslez4_6_04_raid_ssd_04', 'Parità e capacità in RAID 5 e RAID 10']
  }
});
