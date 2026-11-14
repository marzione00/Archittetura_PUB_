'use strict';
SL.unita634 = (() => {
  const PAG = 4096, VA = 0x1FFC, V1 = 19, BASE = 0x100000;
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  // Stato della pagina 2: 'valida' (voce 41), 'invalida' (voce 40), 'fuori' (la tabella ha soltanto le voci 0 e 1)
  const analisi = (p) => {
    const ultimo = VA + p.n - 1, pagine = [], tratti = [];
    for (let a = VA; a <= ultimo; a++) { const v = Math.floor(a / PAG); if (pagine.indexOf(v) < 0) pagine.push(v); }
    let esito = 'ok';
    for (const v of pagine) {
      const da = Math.max(VA, v * PAG), a = Math.min(ultimo, v * PAG + PAG - 1), byte = a - da + 1;
      if (v === 2 && p.p2 === 'fuori') { tratti.push({ v, da, a, byte, stato: 'limite' }); esito = 'limite'; break; }
      const pte = v === 1 ? V1 : p.p2 === 'valida' ? 41 : 40;
      if (pte % 2 === 0) { tratti.push({ v, da, a, byte, pte, stato: 'invalida' }); esito = 'invalida'; break; }
      const pfn = Math.floor(pte / 2);
      tratti.push({ v, da, a, byte, pte, pfn, pda: pfn * PAG + da % PAG, pa: pfn * PAG + a % PAG, stato: 'ok' });
    }
    return { ultimo, pagine, tratti, esito, voci: p.p2 === 'fuori' ? 2 : 3 };
  };
  // f: 0 richiesta · 1 ultimo indirizzo · 2 pagine toccate · 3 primo tratto · 4 secondo tratto · 5 esito
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], A = analisi(p), wc = (o.w - 7 * 6) / 8, w3 = (o.w - 20) / 3, t1 = A.tratti[0], t2 = A.tratti[1];
    els.push(el.nota(pre + 't', o.x, o.y, 'I BYTE RICHIESTI · indirizzi virtuali, da ' + H(VA), 'mono'));
    for (let k = 0; k < 8; k++) { const a = VA + k, dentro = k < p.n, v = Math.floor(a / PAG), tr = A.tratti.find((x) => x.v === v), vis = dentro && ((v === 1 && f >= 3) || (v === 2 && f >= 4)); els.push(el.cella(pre + 'b' + k, o.x + k * (wc + 6), o.y + 44, wc, 34, dentro ? (f >= 2 ? 'pag. ' + v : 'byte') : '', !dentro ? '' : vis && tr ? (tr.stato === 'ok' ? 'on' : 'err') : (f === 1 && k === p.n - 1) || (f === 2) ? 'att' : 'zero', { so: H(a), gi: vis && tr && tr.stato === 'ok' ? H(tr.pfn * PAG + a % PAG) : '', piccola: true })); }
    const txt = (t) => (!t ? 'non serve' : t.stato === 'ok' ? 'frame ' + t.pfn + ' · ' + t.byte + ' byte' : t.stato === 'invalida' ? 'voce ' + t.pte + ' · invalida' : 'indice 2 · fuori tabella');
    els.push(el.box(pre + 'u', o.x, o.y + 112, w3, 54, 'ultimo indirizzo', f >= 1 ? H(A.ultimo) : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p1', o.x + w3 + 10, o.y + 112, w3, 54, 'pagina 1 · voce 19', f >= 3 ? txt(t1) : '·', f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p2', o.x + 2 * (w3 + 10), o.y + 112, w3, 54, 'pagina 2 · ' + (p.p2 === 'fuori' ? 'nessuna voce' : 'voce ' + (p.p2 === 'valida' ? 41 : 40)), f >= 4 ? txt(t2) : '·', f >= 4 && t2 && t2.stato !== 'ok' ? 'err' : f === 4 ? 'att' : f >= 4 && t2 ? 'on' : '', { cls: 'stretta' }));
    return els;
  };
  return { PAG, VA, H, analisi, quadro };
})();
SL.registra('6.3.4', {
  titolo: 'Valori di errore, limiti e funzioni eseguibili',
  obiettivo: 'Obiettivo: controllare una richiesta di più byte prima di eseguirla: calcolarne l’ultimo indirizzo, trovare le pagine che tocca, e verificare per ciascuna il limite della tabella e la validità della voce.',
  concetti: [['byte', 'Una richiesta è un intervallo'], ['conflitto', 'Il confine di pagina la spezza'], ['scudo', 'Ogni pagina va controllata']],
  filigrana: ['byte', 'scudo', 'tabella'],
  richiami: {
    carte: [
      { sim: 'hex', da: 'Dall’unità 6.3.1', t: 'Il valore di errore', d: 'Sessantaquattro bit a 1: dice a chi ha chiesto la traduzione di rinunciare all’accesso.' },
      { sim: 'bit', da: 'Dall’unità 6.3.2', t: 'La validità', d: 'Una voce pari, nel formato 2 × PFN + valid, non indica alcun frame.' },
      { sim: 'scudo', da: 'Dall’unità 2.7.2', t: 'Il controllo dei limiti', d: 'Prima di usare un indice, si verifica che cada dentro l’array.' }
    ],
    domanda: { d: 'Prima di proseguire: una lettura di 8 byte comincia all’indirizzo 100. Qual è l’indirizzo dell’ultimo byte letto?', o: [
      { t: '107', ok: true, fb: 'Gli otto byte vanno da 100 a 107: primo + numero − 1.' },
      { t: '108', fb: '108 è il primo byte dopo la lettura. Gli otto byte sono 100, 101, fino a 107.' },
      { t: '100', fb: 'Quello è il primo byte. La lettura ne comprende altri sette.' }
    ] }
  },
  idea: {
    titolo: 'Una lettura può stare a cavallo di due pagine',
    termini: ['confine di pagina', 'controllo dei limiti della tabella'],
    testo: [
      'Finora abbiamo tradotto un byte alla volta. I programmi però leggono quasi sempre gruppi di byte: un intero ne occupa quattro, un puntatore otto. Una richiesta di otto byte è un intervallo di otto indirizzi consecutivi, dal primo fino a quello che dista sette posizioni. L’ultimo indirizzo si calcola come primo + numero di byte − 1.',
      'Se l’intervallo sta tutto in una pagina, basta una traduzione. Può però attraversare un [[confine di pagina]], cioè il punto in cui una pagina finisce e comincia la successiva. In questa unità le pagine tornano a 4096 byte. Una lettura di otto byte che comincia a 0x1FFC prende quattro byte dalla pagina 1, che finisce a 0x1FFF, e quattro dalla pagina 2, che comincia a 0x2000.',
      { fig: 'scena', w: 720, h: 176, titolo: 'Otto byte da 0x1FFC: quattro nella pagina 1, quattro nella pagina 2', nota: 'Gli indirizzi virtuali sono consecutivi. Quelli fisici saltano da 0x9FFF a 0x14000, perché le due pagine stanno in frame lontani.', els: SL.unita634.quadro('g', { n: 8, p2: 'valida' }, 5, { x: 10, y: 4, w: 700 }) },
      'Le due pagine si traducono separatamente, e possono stare in frame lontanissimi. Se la voce della pagina 1 vale 19, il frame è il 9, e il primo tratto occupa gli indirizzi fisici da 0x9FFC a 0x9FFF. Se la voce della pagina 2 vale 41, il frame è il 20, e il secondo tratto va da 0x14000 a 0x14003. Per il programma i byte sono consecutivi. Nella RAM stanno in due posti diversi.',
      'Per questo un traduttore scritto come funzione deve controllare l’intera richiesta prima di dichiararla utilizzabile. I controlli sono due per ogni pagina toccata. Il primo è il [[controllo dei limiti della tabella]]: il numero della pagina deve essere minore del numero di voci. In caso contrario leggere «la voce» significherebbe leggere memoria che sta oltre la fine della tabella, con un contenuto qualsiasi. Il secondo è la validità della voce, e si può fare soltanto dopo il primo.',
      'Se anche un solo tratto fallisce, la funzione restituisce il valore di errore per l’intera richiesta, e si ferma al primo problema. Accettare i primi quattro byte e rifiutare gli altri lascerebbe il chiamante con un dato a metà. L’ordine dei controlli è dunque: ultimo indirizzo, pagine toccate, e per ciascuna limite e validità. Soltanto alla fine si compongono gli indirizzi fisici.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiede alcuni byte a partire dall’indirizzo 0x1FFC, quattro byte prima della fine della pagina 1. Sceglierai quanti byte chiede, e in quale stato si trova la pagina 2.',
      'Calcoleremo l’ultimo indirizzo, troveremo le pagine toccate, e controlleremo ogni tratto. Con quattro byte, nota che lo stato della pagina 2 non conta.'
    ],
    vedrai: [
      ['byte', 'I byte richiesti', 'In alto: otto caselle. Sopra ciascuna l’indirizzo virtuale, dentro la pagina, sotto l’indirizzo fisico quando il tratto è accettato.'],
      ['tabella', 'I controlli', 'In basso: l’ultimo indirizzo della richiesta, e l’esito del controllo per ciascuna pagina.']
    ]
  },
  lab: {
    titolo: 'Una richiesta a cavallo del confine',
    scena: { w: 860, h: 176 },
    atti: ['La richiesta', 'Le pagine toccate', 'I controlli', 'L’esito'],
    controlli: [
      { id: 'n', tipo: 'scelta', eti: 'Byte richiesti', opzioni: [[4, '4'], [8, '8']], valore: 8 },
      { id: 'p2', tipo: 'scelta', eti: 'La pagina 2', opzioni: [['valida', 'voce 41 · valida'], ['invalida', 'voce 40 · invalida'], ['fuori', 'assente: la tabella ha due voci']], valore: 'valida' }
    ],
    nota: 'Il numero dei passi dipende dal caso. Le pagine sono da 4096 byte, e le voci valgono 2 × PFN + valid.',
    previsione: {
      domanda: (p) => 'Un programma chiede ' + p.n + ' byte a partire dall’indirizzo 0x1FFC, con pagine da 4096 byte. La voce della pagina 1 vale 19. ' + (p.p2 === 'valida' ? 'La voce della pagina 2 vale 41.' : p.p2 === 'invalida' ? 'La voce della pagina 2 vale 40.' : 'La tabella ha soltanto due voci, con indici 0 e 1.') + ' Come finisce il controllo della richiesta?',
      opzioni: () => [['ok', 'Accettata: ogni byte ha un indirizzo fisico'], ['invalida', 'Rifiutata: una voce è invalida'], ['limite', 'Rifiutata: una pagina è fuori dalla tabella']]
    },
    confronto: (pred, esito, p) => { const N = { ok: 'accettata', invalida: 'rifiutata per una voce invalida', limite: 'rifiutata per una pagina fuori dalla tabella' }; return 'La previsione indicava «' + N[pred] + '». La richiesta è ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'ok' && p.n === 4 ? 'Quattro byte da 0x1FFC finiscono a 0x1FFF, l’ultimo byte della pagina 1. La pagina 2 non viene toccata, e il suo stato non conta.' : esito === 'ok' ? 'Entrambe le voci sono dispari, e quindi valide: 19 indica il frame 9, e 41 il frame 20.' : esito === 'invalida' ? 'La voce 40 è pari. Il secondo tratto non ha un frame, e l’intera richiesta viene rifiutata.' : 'La pagina 2 avrebbe indice 2, e la tabella arriva all’indice 1. La voce manca, e leggerla è vietato.'); },
    costruisci(p) {
      const U = SL.unita634, A = U.analisi(p), passi = [], H = U.H, t1 = A.tratti[0], t2 = A.tratti[1];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Ultimo indirizzo', f >= 1 ? H(A.ultimo) : '·', 'a'], ['Pagine toccate', f >= 2 ? A.pagine.join(' e ') : '·'], ['Esito', f >= 5 ? (A.esito === 'ok' ? 'accettata' : 'rifiutata') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'La richiesta', 'Il programma chiede ' + p.n + ' byte a partire dall’indirizzo virtuale 0x1FFC. La tabella ha ' + A.voci + ' voci, e le pagine sono da 4096 byte.', {});
      P(1, 0, 'L’ultimo indirizzo', 'L’ultimo byte richiesto sta a primo + numero − 1: 0x1FFC + ' + p.n + ' − 1 = ' + H(A.ultimo) + '.', { calc: '0x1FFC + ' + p.n + ' − 1 = ' + H(A.ultimo) });
      P(2, 1, 'Le pagine toccate', 'La pagina 1 va da 0x1000 a 0x1FFF. ' + (A.pagine.length === 1 ? 'L’ultimo indirizzo è 0x1FFF: la richiesta finisce proprio sull’ultimo byte della pagina 1, e resta tutta dentro.' : 'L’ultimo indirizzo, ' + H(A.ultimo) + ', sta oltre: la richiesta attraversa il confine. Quattro byte sono nella pagina 1 e ' + (p.n - 4) + ' nella pagina 2.'), { calc: A.pagine.length === 1 ? 'una pagina: la 1' : 'due pagine: 4 + ' + (p.n - 4) + ' byte', chiedi: { d: 'Quante voci della tabella vanno controllate per questa richiesta?', o: ['Una', 'Due', p.n + ', una per byte'], g: A.pagine.length - 1, no: 'Si controlla una voce per ogni pagina toccata. Qui le pagine toccate sono ' + A.pagine.length + '.' } });
      P(3, 2, 'Il tratto nella pagina 1', 'L’indice 1 è minore del numero di voci, ' + A.voci + ': la voce esiste. Vale 19, dispari: è valida, e indica il frame 9. I ' + t1.byte + ' byte del tratto stanno agli indirizzi fisici da ' + H(t1.pda) + ' a ' + H(t1.pa) + '.', { calc: '19 = 2 × 9 + 1 · ' + H(t1.pda) + ' … ' + H(t1.pa) });
      if (t2) P(4, 2, 'Il tratto nella pagina 2', t2.stato === 'ok' ? 'L’indice 2 è minore di 3: la voce esiste. Vale 41, dispari: è valida, e indica il frame 20. I ' + t2.byte + ' byte del tratto stanno da ' + H(t2.pda) + ' a ' + H(t2.pa) + '. Gli indirizzi virtuali erano consecutivi, e quelli fisici fanno un salto.' : t2.stato === 'invalida' ? 'L’indice 2 è minore di 3: la voce esiste. Vale 40, pari: il bit di validità è 0. La pagina 2 non ha un frame, e il controllo si ferma.' : 'L’indice 2 è uguale al numero di voci, 2, e quindi cade fuori dalla tabella. Leggere a quell’indirizzo vorrebbe dire uscire dalla tabella. Il controllo si ferma senza leggere nulla.', { calc: t2.stato === 'ok' ? '41 = 2 × 20 + 1 · ' + H(t2.pda) + ' … ' + H(t2.pa) : t2.stato === 'invalida' ? '40 = 2 × 20 + 0 · invalida' : 'indice 2 ≥ 2 voci' });
      P(5, 3, 'L’esito', A.esito === 'ok' ? 'Ogni pagina toccata ha superato i due controlli. La richiesta è accettata, con ' + (t2 ? 'due tratti: ' + t1.byte + ' + ' + t2.byte + ' = ' + p.n + ' byte.' : 'un solo tratto di ' + p.n + ' byte.') : 'Il secondo tratto ha fallito. La funzione restituisce il valore di errore per l’intera richiesta: anche i quattro byte della pagina 1, che erano traducibili, non vengono consegnati.', { esito: [A.esito === 'ok' ? 'accettata · ' + p.n + ' byte' : A.esito === 'invalida' ? 'rifiutata · voce invalida' : 'rifiutata · fuori tabella', A.esito === 'ok' ? 'si' : 'no'] });
      return { passi, esito: A.esito };
    }
  },
  bilancio: {
    regola: [
      'Ultimo indirizzo = primo + numero di byte − 1. Le pagine toccate vanno da quella del primo a quella dell’ultimo.',
      'Per ogni pagina toccata: prima il limite della tabella, poi la validità della voce. Un solo fallimento rifiuta l’intera richiesta.'
    ],
    errori: [
      ['Tradurre soltanto il primo byte.', 'Una richiesta di più byte può finire in un’altra pagina, che ha un altro frame oppure nessuno.'],
      ['Leggere una voce senza controllarne l’indice.', 'Oltre la fine della tabella c’è altra memoria, con valori qualsiasi.'],
      ['Supporre che byte consecutivi restino consecutivi nella RAM.', 'Oltre il confine di pagina l’indirizzo fisico riparte dall’inizio di un altro frame.']
    ],
    saFare: ['Calcolare l’ultimo indirizzo di una richiesta.', 'Determinare le pagine toccate e i byte di ogni tratto.', 'Applicare i controlli nell’ordine corretto.'],
    esercizi: [
      { d: 'Con pagine da 4096 byte, una lettura di 8 byte comincia all’indirizzo 0x2FFA. Quanti byte cadono nella pagina successiva?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Da 0x2FFA a 0x2FFF ci sono 6 byte. Ne restano 2, a 0x3000 e 0x3001.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Sei sono i byte nella prima pagina. La domanda riguarda quelli nella successiva.' },
          { se: ['0', 'zero'], msg: 'La pagina finisce a 0x2FFF, e l’ultimo byte richiesto sta a 0x3001.' },
          { se: ['8', 'otto'], msg: 'La lettura comincia sei byte prima del confine.' }
        ],
        altro: 'Il numero è diverso. Conta i byte da 0x2FFA fino alla fine della pagina, 0x2FFF.',
        indizi: ['Ultimo indirizzo: 0x2FFA + 7 = 0x3001.', 'La pagina 2 finisce a 0x2FFF.', 'Oltre il confine: 0x3000 e 0x3001.'],
        svolgimento: ['Byte nella pagina 2: da 0x2FFA a 0x2FFF, 6.', 'Byte nella pagina 3: 2.'] },
      { d: 'Una tabella ha 8 voci. Per quale di questi numeri di pagina il controllo dei limiti fallisce?', guida: 'Si scelga la risposta.', o: [
        { t: 'Per la pagina 8', ok: true, fb: 'Gli indici validi vanno da 0 a 7.' },
        { t: 'Per la pagina 7', fb: 'Sette è l’ultimo indice valido di una tabella con 8 voci.' },
        { t: 'Per la pagina 0', fb: 'Zero è il primo indice della tabella.' }] },
      { d: 'Una richiesta tocca due pagine. La prima voce è valida, la seconda è invalida. Che cosa restituisce la funzione di traduzione?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il valore di errore, per l’intera richiesta', ok: true, fb: 'Un dato consegnato a metà sarebbe peggio di nessun dato.' },
        { t: 'L’indirizzo fisico del primo tratto', fb: 'Il chiamante userebbe otto byte credendoli tutti traducibili.' },
        { t: 'L’indirizzo fisico del primo tratto, ripetuto', fb: 'I byte della seconda pagina non hanno un frame.' }] }
    ],
    sfida: ['cslez6_3_04_page_table_control', 'Controllo della traduzione']
  }
});
