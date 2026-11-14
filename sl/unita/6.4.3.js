'use strict';
SL.unita643 = (() => {
  const RAD = 0x100000, FIG = 0x306000, I1 = 3, OFF = 77, PAG = 4096;
  const FOGLIE = { 5: 13, 6: 20 };   // indice L2 → frame
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  const conto = (p) => { const va = I1 * 4194304 + p.j * PAG + OFF, a1 = RAD + 8 * I1, a2 = FIG + 8 * p.j, pfn = FOGLIE[p.j], presente = p.pres === 'si', foglia = 2 * pfn + (presente ? 1 : 0); return { va, a1, a2, pfn, presente, foglia, pa: pfn * PAG + OFF }; };
  // f: 0 VA · 1 campi · 2 indirizzo prima voce · 3 prima lettura · 4 indirizzo seconda voce · 5 seconda lettura · 6 risultato
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = conto(p), w4 = (o.w - 30) / 4, wc = (o.w - 7 * 6) / 8;
    els.push(el.box(pre + 'v', o.x, o.y, w4, 50, 'indirizzo virtuale', H(c.va), f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'i', o.x + w4 + 10, o.y, w4, 50, 'indice L1 · 10 bit', f >= 1 ? String(I1) : '·', f === 1 || f === 2 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'j', o.x + 2 * (w4 + 10), o.y, w4, 50, 'indice L2 · 10 bit', f >= 1 ? String(p.j) : '·', f === 1 || f === 4 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'd', o.x + 3 * (w4 + 10), o.y, w4, 50, 'offset · 12 bit', f >= 1 ? OFF + ' = ' + H(OFF) : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.nota(pre + 't1', o.x, o.y + 60, 'LA RADICE · comincia a ' + H(RAD), 'mono'));
    for (let k = 0; k < 8; k++) els.push(el.cella(pre + 'r' + k, o.x + k * (wc + 6), o.y + 102, wc, 32, k === I1 && f >= 3 ? (wc < 90 ? FIG.toString(16).toUpperCase() : H(FIG)) : k === I1 ? '?' : '', k === I1 && f >= 2 ? (f <= 3 ? 'att' : 'on') : '', { so: 'voce ' + k, piccola: true }));
    els.push(el.nota(pre + 't2', o.x, o.y + 142, 'LA FIGLIA · comincia a ' + (f >= 3 ? H(FIG) : 'un indirizzo ancora ignoto'), 'mono', f === 3 ? 'att' : ''));
    for (let k = 0; k < 8; k++) els.push(el.cella(pre + 'c' + k, o.x + k * (wc + 6), o.y + 184, wc, 32, k === p.j && f >= 5 ? String(c.foglia) : k === p.j && f >= 4 ? '?' : '', k === p.j && f >= 4 ? (f >= 5 && !c.presente ? 'err' : f <= 5 ? 'att' : 'on') : '', { so: 'voce ' + k, piccola: true }));
    els.push(el.box(pre + 'a1', o.x, o.y + 228, w4, 50, 'prima lettura', f >= 3 ? '[' + H(c.a1) + ']' : f >= 2 ? H(c.a1) : '·', f === 2 || f === 3 ? 'att' : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'a2', o.x + w4 + 10, o.y + 228, w4, 50, 'seconda lettura', f >= 5 ? '[' + H(c.a2) + ']' : f >= 4 ? H(c.a2) : '·', f === 4 || f === 5 ? 'att' : f >= 4 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'fr', o.x + 2 * (w4 + 10), o.y + 228, w4, 50, 'frame', f >= 6 ? (c.presente ? String(c.pfn) : 'assente') : '·', f >= 6 ? (c.presente ? 'on' : 'err') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'pa', o.x + 3 * (w4 + 10), o.y + 228, w4, 50, 'indirizzo fisico', f >= 6 ? (c.presente ? H(c.pa) : 'eccezione') : '·', f >= 6 ? (c.presente ? 'att' : 'err') : '', { cls: 'stretta' }));
    return els;
  };
  return { RAD, FIG, I1, OFF, H, conto, quadro };
})();
SL.registra('6.4.3', {
  titolo: 'Una traduzione simulata a due livelli',
  obiettivo: 'Obiettivo: eseguire una traduzione a due livelli: dividere l’indirizzo in tre campi, calcolare dove si leggono le due voci, e ricavare dall’ultima il frame.',
  concetti: [['hex', 'Tre campi in un indirizzo'], ['puntatore', 'La prima voce dice dove sta la seconda'], ['bit', 'Soltanto la foglia parla del frame']],
  filigrana: ['strati', 'puntatore', 'hex'],
  richiami: {
    carte: [
      { sim: 'strati', da: 'Dall’unità 6.4.2', t: 'Radice e figlie', d: 'La radice ha una voce per regione. Ogni regione usata ha una tabella figlia.' },
      { sim: 'tabella', da: 'Dall’unità 6.3.1', t: 'L’indirizzo di una voce', d: 'Base della tabella + 8 × indice.' },
      { sim: 'bit', da: 'Dall’unità 6.3.2', t: 'Il formato della voce', d: 'Voce = 2 × PFN + valid: il bit 0 è la validità, il resto è il frame.' }
    ],
    domanda: { d: 'Prima di proseguire: una tabella comincia a 0x306000, con voci da 8 byte. A quale indirizzo sta la voce di indice 5?', o: [
      { t: '0x306028', ok: true, fb: '5 × 8 = 40, cioè 0x28.' },
      { t: '0x306005', fb: 'Ogni voce occupa 8 byte: l’indice va moltiplicato per 8.' },
      { t: '0x306040', fb: 'Quaranta è il valore decimale. In esadecimale si scrive 0x28.' }
    ] }
  },
  idea: {
    titolo: 'Due letture in catena',
    termini: ['cammino nelle tabelle', 'voce foglia'],
    testo: [
      'Con una tabella a due livelli la MMU arriva al frame in due tempi. Compie un [[cammino nelle tabelle]]: una lettura nella radice, che le dice dove sta la tabella figlia, e una lettura nella figlia, che le dice dove sta il dato. La seconda lettura dipende dal risultato della prima.',
      'Si comincia dividendo l’indirizzo virtuale. Con 32 bit e pagine da 4096 byte i campi sono tre: i dieci bit più alti sono l’indice nella radice, che chiamiamo L1. I dieci successivi sono l’indice nella figlia, L2. Gli ultimi dodici sono l’offset. L’indirizzo 0xC0504D, per esempio, ha L1 uguale a 3, L2 uguale a 5 e offset 77. Lo si verifica ricomponendo: 3 × 4 194 304 + 5 × 4096 + 77. Il primo fattore è 2 alla 22, perché a destra di L1 stanno 22 bit.',
      { fig: 'scena', w: 720, h: 286, titolo: 'L’indirizzo 0xC0504D dopo la prima lettura', nota: 'La voce 3 della radice contiene 0x306000: è l’indirizzo a cui comincia la figlia. Il frame è ancora sconosciuto.', els: SL.unita643.quadro('g', { j: 5, pres: 'si' }, 3, { x: 10, y: 4, w: 700 }) },
      'La prima lettura avviene nella radice, che comincia a un indirizzo noto alla MMU, qui 0x100000. La voce 3 sta a 0x100000 + 3 × 8 = 0x100018. Nel nostro modello il suo contenuto è l’indirizzo a cui comincia la tabella figlia di quella regione, 0x306000. Per ora è soltanto la base della lettura successiva: del dato si saprà dopo.',
      'La seconda lettura avviene nella figlia. La voce 5 sta a 0x306000 + 5 × 8 = 0x306028. È l’ultima voce del cammino, e si chiama [[voce foglia]]: soltanto lei ha il formato che conosciamo, 2 × PFN + valid. Se contiene 27 il bit di validità è 1, e il frame è 13. L’indirizzo fisico si compone come sempre: 13 × 4096 + 77 = 53 325, cioè 0xD04D.',
      'Lungo il cammino i numeri si moltiplicano, e conviene tenerli in ordine. Ci sono due indici, 3 e 5. Due indirizzi di voci, 0x100018 e 0x306028. Due contenuti, 0x306000 e 27. E infine un indirizzo fisico, 0xD04D. Se la foglia è invalida, i due indirizzi delle voci restano calcolabili allo stesso modo. È il contenuto dell’ultima lettura a fermare tutto: la MMU solleva un page fault prima di toccare il dato.'
    ]
  },
  esperimento: {
    faremo: [
      'Tradurremo un indirizzo virtuale di 32 bit con una tabella a due livelli. Sceglierai l’indice L2, cioè quale voce della figlia viene usata, e se quella foglia è presente.',
      'Seguiremo le due letture una dopo l’altra. A ogni passo distingui dove si legge da che cosa si è letto.'
    ],
    vedrai: [
      ['hex', 'I tre campi', 'In alto: l’indirizzo virtuale, diviso in indice L1, indice L2 e offset.'],
      ['strati', 'Le due tabelle', 'Al centro: le prime otto voci della radice e della figlia. Il punto interrogativo segna la voce da leggere.'],
      ['puntatore', 'Letture e risultato', 'In basso: gli indirizzi delle due letture, il frame e l’indirizzo fisico.']
    ]
  },
  lab: {
    titolo: 'Un cammino a due livelli',
    scena: { w: 860, h: 288 },
    atti: ['L’indirizzo', 'La radice', 'La figlia', 'Il risultato'],
    controlli: [
      { id: 'j', tipo: 'scelta', eti: 'Indice L2', opzioni: [[5, '5'], [6, '6']], valore: 5 },
      { id: 'pres', tipo: 'scelta', eti: 'La foglia', opzioni: [['si', 'presente'], ['no', 'assente']], valore: 'si' }
    ],
    nota: 'I passi sono sempre sette. La radice comincia a 0x100000, e la sua voce 3 contiene 0x306000. Le foglie valgono 2 × PFN + valid.',
    previsione: {
      domanda: (p) => { const U = SL.unita643, c = U.conto(p); return 'La MMU traduce l’indirizzo ' + U.H(c.va) + ': indice L1 uguale a 3, indice L2 uguale a ' + p.j + ', offset 77. La voce 3 della radice contiene 0x306000. La voce ' + p.j + ' della figlia contiene ' + c.foglia + ', nel formato 2 × PFN + valid. Che cosa ottiene la MMU?'; },
      opzioni: (p) => { const U = SL.unita643, c = U.conto(p); return [['pa', 'L’indirizzo fisico ' + U.H(c.pa)], ['voce', 'L’indirizzo fisico ' + U.H(c.a2)], ['fault', 'Nessun indirizzo: page fault']]; }
    },
    confronto: (pred, esito, p) => { const U = SL.unita643, c = U.conto(p), N = { pa: U.H(c.pa), voce: U.H(c.a2), fault: 'un page fault' }; return 'La previsione indicava ' + N[pred] + '. La MMU ottiene ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 'voce' ? 'Quello è l’indirizzo a cui si legge la foglia. Il dato sta nel frame che la foglia indica.' : esito === 'fault' ? 'La foglia ' + c.foglia + ' è pari: il bit di validità è 0, e il cammino si ferma lì.' : 'La foglia ' + c.foglia + ' è dispari, e quindi valida: indica il frame ' + c.pfn + '.'); },
    costruisci(p) {
      const U = SL.unita643, c = U.conto(p), passi = [], H = U.H;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Letture', f >= 5 ? '2' : f >= 3 ? '1' : '0', 'a'], ['Base della figlia', f >= 3 ? H(U.FIG) : '·'], ['Fisico', f >= 6 ? (c.presente ? H(c.pa) : 'fault') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'L’indirizzo da tradurre', 'La MMU riceve l’indirizzo virtuale ' + H(c.va) + '. Conosce un solo indirizzo di partenza: quello della radice, 0x100000.', {});
      P(1, 0, 'I tre campi', 'I 32 bit si dividono in tre campi. I dieci più alti danno l’indice L1, 3. I dieci successivi l’indice L2, ' + p.j + '. Gli ultimi dodici l’offset, 77.', { calc: H(c.va) + ' = 3 × 4 194 304 + ' + p.j + ' × 4096 + 77' });
      P(2, 1, 'Dove sta la prima voce', 'L’indice L1 sceglie una voce della radice. La voce 3 sta a 0x100000 + 3 × 8 = ' + H(c.a1) + '.', { calc: '0x100000 + 3 × 8 = ' + H(c.a1) });
      P(3, 1, 'La prima lettura', 'La MMU legge la memoria all’indirizzo ' + H(c.a1) + ', e trova 0x306000. È l’indirizzo a cui comincia la tabella figlia di questa regione.', { calc: '[' + H(c.a1) + '] = 0x306000', chiedi: { d: 'La prima lettura ha dato 0x306000. Che cosa rappresenta questo numero?', o: ['La base della tabella figlia', 'L’indirizzo fisico del dato', 'Il numero del frame'], g: 0, no: 'La radice conduce alle figlie. Il frame si legge soltanto nella foglia.' } });
      P(4, 2, 'Dove sta la seconda voce', 'L’indice L2 sceglie una voce della figlia. La voce ' + p.j + ' sta a 0x306000 + ' + p.j + ' × 8 = ' + H(c.a2) + '. Questo indirizzo dipende dal risultato della prima lettura.', { calc: '0x306000 + ' + p.j + ' × 8 = ' + H(c.a2) });
      P(5, 2, 'La seconda lettura', 'La MMU legge la memoria all’indirizzo ' + H(c.a2) + ', e trova ' + c.foglia + '. È la foglia, nel formato 2 × PFN + valid. ' + (c.presente ? c.foglia + ' è dispari: la voce è valida, e il frame è ' + c.pfn + '.' : c.foglia + ' è pari: il bit di validità è 0.'), { calc: '[' + H(c.a2) + '] = ' + c.foglia + ' = 2 × ' + c.pfn + ' + ' + (c.presente ? 1 : 0) });
      P(6, 3, c.presente ? 'L’indirizzo fisico' : 'Il page fault', c.presente ? 'Il dato sta nel frame ' + c.pfn + ', all’offset 77: ' + c.pfn + ' × 4096 + 77 = ' + SL.num(c.pa) + ', cioè ' + H(c.pa) + '. Per arrivarci sono servite due letture di memoria, oltre a quella del dato.' : 'La foglia è invalida: la pagina non ha un frame. La MMU interrompe il cammino e solleva un page fault, senza toccare il dato. Le due letture sono avvenute comunque, agli stessi indirizzi.', { calc: c.presente ? c.pfn + ' × 4096 + 77 = ' + H(c.pa) : 'foglia invalida · page fault', esito: [c.presente ? 'indirizzo fisico ' + H(c.pa) : 'page fault', c.presente ? 'si' : 'no'] });
      return { passi, esito: c.presente ? 'pa' : 'fault' };
    }
  },
  bilancio: {
    regola: [
      'Indirizzo della prima voce = base della radice + 8 × L1. Il suo contenuto è la base della figlia.',
      'Indirizzo della foglia = base della figlia + 8 × L2. Se la foglia è valida, indirizzo fisico = PFN × 4096 + offset.'
    ],
    errori: [
      ['Cercare il frame nella voce della radice.', 'La radice contiene la base della figlia. Il frame sta nella foglia.'],
      ['Usare la base della radice per la seconda lettura.', 'La seconda voce si trova a partire dalla base letta nella prima.'],
      ['Confondere indirizzi delle voci e contenuti.', 'Un indirizzo dice dove leggere. Il contenuto è ciò che si trova leggendo.']
    ],
    saFare: ['Dividere un indirizzo in L1, L2 e offset.', 'Calcolare gli indirizzi delle due voci.', 'Ricavare il frame dalla foglia, oppure riconosco il page fault.'],
    esercizi: [
      { d: 'Un indirizzo di 32 bit ha indice L1 uguale a 2, indice L2 uguale a 1 e offset 16, con campi da 10, 10 e 12 bit. Quanto vale, in decimale?', segnaposto: 'Un numero', giuste: ['8392720', '8 392 720', '0x801010'],
        ok: '2 × 4 194 304 + 1 × 4096 + 16 = 8 392 720.',
        diagnosi: [
          { se: ['12304', '12 304'], msg: 'L’indice L1 ha alla sua destra 22 bit: va moltiplicato per 4 194 304.' },
          { se: ['8388608', '8 388 608'], msg: 'Questo è il solo contributo di L1. Aggiungi quello di L2 e l’offset.' }
        ],
        altro: 'Il numero è diverso. Si moltiplichi L1 per 2 alla 22, L2 per 4096, e si sommi l’offset.',
        indizi: ['2 × 4 194 304 = 8 388 608.', '1 × 4096 = 4 096.', '8 388 608 + 4 096 + 16 = 8 392 720.'],
        svolgimento: ['Contributo di L1: 8 388 608.', 'Contributo di L2: 4 096.', 'Offset: 16.', 'Indirizzo: 8 392 720.'] },
      { d: 'La voce della radice contiene 0x40A000. L’indice L2 vale 4. A quale indirizzo si legge la foglia? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1000', giuste: ['0x40A020', '0x40a020', '40A020', '40a020', '40a020h'],
        ok: '0x40A000 + 4 × 8 = 0x40A020.',
        diagnosi: [
          { se: ['0x40A004', '0x40a004'], msg: 'Ogni voce occupa 8 byte: l’indice va moltiplicato per 8.' },
          { se: ['0x40A032', '0x40a032'], msg: 'Trentadue è il valore decimale. In esadecimale si scrive 0x20.' },
          { se: ['0x100020'], msg: 'La seconda lettura parte dalla base della figlia, 0x40A000.' }
        ],
        altro: 'L’indirizzo è diverso. Somma alla base della figlia 8 volte l’indice L2.',
        indizi: ['4 × 8 = 32.', '32 in esadecimale è 0x20.', '0x40A000 + 0x20 = 0x40A020.'],
        svolgimento: ['Spostamento: 0x20.', 'Indirizzo della foglia: 0x40A020.'] },
      { d: 'In un cammino a due livelli, quante letture di memoria servono prima di poter leggere il dato?', guida: 'Si scelga la risposta.', o: [
        { t: 'Due: una nella radice e una nella figlia', ok: true, fb: 'Poi una terza lettura prende il dato.' },
        { t: 'Una', fb: 'Con un solo livello basterebbe. Qui la radice conduce a una seconda tabella.' },
        { t: 'Nessuna', fb: 'Senza leggere le tabelle, oppure la TLB, la MMU non conosce il frame.' }] }
    ],
    sfida: ['cslez6_4_04_two_level_walk_assembly', 'Percorso nelle tabelle a due livelli in assembly']
  }
});
