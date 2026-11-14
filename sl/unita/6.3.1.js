'use strict';
SL.unita631 = (() => {
  const TAB = [9, 11, 12, 35, 0, 7, 0, 0], PAG = 1024;
  const H = (v) => '0x' + v.toString(16).toUpperCase();
  const calcola = (p) => { const vpn = Math.floor(p.va / PAG), off = p.va % PAG, ind = p.base + 8 * vpn, pte = TAB[vpn], valida = pte % 2 === 1, pfn = Math.floor(pte / 2); return { vpn, off, ind, pte, valida, pfn, pa: pfn * PAG + off }; };
  // f: 0 solo VA · 1 scomposto · 2 indirizzo della voce · 3 valore letto · 4 decodificato · 5 risultato
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], c = calcola(p), w3 = (o.w - 20) / 3, w4 = (o.w - 30) / 4, wc = (o.w - 7 * 6) / 8;
    els.push(el.box(pre + 'v', o.x, o.y, w3, 50, 'indirizzo virtuale', H(p.va) + ' = ' + p.va, f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'n', o.x + w3 + 10, o.y, w3, 50, 'pagina · VPN', f >= 1 ? String(c.vpn) : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'o', o.x + 2 * (w3 + 10), o.y, w3, 50, 'offset', f >= 1 ? c.off + ' = ' + H(c.off) : '·', f === 1 ? 'att' : f >= 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.nota(pre + 't', o.x, o.y + 62, 'LA TABELLA · otto voci da 8 byte, a partire da ' + H(p.base), 'mono'));
    TAB.forEach((v, k) => els.push(el.cella(pre + 'c' + k, o.x + k * (wc + 6), o.y + 104, wc, 34, String(v), f >= 2 && k === c.vpn ? (f === 2 || f === 3 ? 'att' : 'on') : '', { so: 'voce ' + k, gi: H(p.base + 8 * k), piccola: true })));
    els.push(el.box(pre + 'a', o.x, o.y + 166, w4, 50, 'indirizzo voce', f >= 2 ? H(c.ind) : '·', f === 2 ? 'att' : f >= 2 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'l', o.x + w4 + 10, o.y + 166, w4, 50, 'valore letto', f >= 3 ? String(c.pte) : '·', f === 3 ? 'att' : f >= 3 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'f', o.x + 2 * (w4 + 10), o.y + 166, w4, 50, 'frame', f >= 4 ? (c.valida ? String(c.pfn) : 'voce invalida') : '·', f >= 4 && !c.valida ? 'err' : f === 4 ? 'att' : f >= 4 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'r', o.x + 3 * (w4 + 10), o.y + 166, w4, 50, 'RAX · risultato', f >= 5 ? (c.valida ? H(c.pa) : '0xFFFFFFFFFFFFFFFF') : '·', f >= 5 ? (c.valida ? 'att' : 'err') : '', { cls: 'stretta' }));
    return els;
  };
  return { TAB, PAG, H, calcola, quadro };
})();
SL.registra('6.3.1', {
  titolo: 'Rappresentare una mappatura in un programma',
  obiettivo: 'Obiettivo: seguire una traduzione come la esegue un programma, tenendo distinti tre numeri: l’indice della voce, l’indirizzo a cui la voce si trova, e il valore che contiene.',
  concetti: [['tabella', 'Una tabella è un array in memoria'], ['puntatore', 'Indice, indirizzo, contenuto'], ['hex', 'Dal contenuto al frame']],
  filigrana: ['tabella', 'puntatore', 'hex'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 6.2.1', t: 'Pagina, offset, frame', d: 'Il quoziente sceglie la riga della tabella. Il resto, l’offset, passa immutato.' },
      { sim: 'puntatore', da: 'Dall’unità 2.2.3', t: 'L’indirizzo efficace', d: 'Base + indice × scala: il modo in cui si raggiunge l’elemento di un array.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'L’esadecimale', d: 'Ogni cifra vale sedici volte quella alla sua destra. Una cifra riassume quattro bit.' }
    ],
    domanda: { d: 'Prima di proseguire: un array di elementi da 8 byte comincia all’indirizzo 0x100000. A quale indirizzo comincia l’elemento di indice 3?', o: [
      { t: '0x100018', ok: true, fb: '3 × 8 = 24, che in esadecimale è 0x18.' },
      { t: '0x100003', fb: 'Ogni elemento occupa 8 byte: l’indice va moltiplicato per 8.' },
      { t: '0x100024', fb: 'Ventiquattro è il valore decimale. In esadecimale si scrive 0x18.' }
    ] }
  },
  idea: {
    titolo: 'La tabella delle pagine è un array come gli altri',
    termini: ['kib', 'pte', 'bit di validità', 'valore di errore'],
    testo: [
      'Nel capitolo precedente la tabella delle pagine era un disegno: una riga per pagina, e in ogni riga un frame. In questo capitolo diventa ciò che è davvero dentro la macchina: una zona di memoria piena di numeri, che un programma legge con le istruzioni del Modulo II. Per rendere i conti più leggeri usiamo pagine piccole, da 1024 byte. Questa quantità si scrive 1 [[kib|KiB]], e dieci bit bastano a numerarne i byte.',
      'La tabella è un array. Ogni elemento descrive una pagina e si chiama voce, o [[pte|PTE]], dall’inglese page table entry. Qui una voce occupa 8 byte, e l’array comincia a un indirizzo noto, la base. Il numero della pagina fa da indice: la voce della pagina 3 si trova 3 × 8 = 24 byte dopo la base. Se la base è 0x100000, la voce sta all’indirizzo 0x100018.',
      { fig: 'scena', w: 720, h: 226, titolo: 'L’indirizzo 0xC33: pagina 3, voce a 0x100018, contenuto 35', nota: 'Tre numeri diversi per la stessa pagina: l’indice, 3. L’indirizzo della voce, 0x100018. Il valore che vi è scritto, 35.', els: SL.unita631.quadro('g', { va: 0xC33, base: 0x100000 }, 3, { x: 10, y: 4, w: 700 }) },
      'A questo punto i numeri in gioco sono tre, ed è facile scambiarli. Il primo è l’indice, 3: dice quale voce. Il secondo è l’indirizzo della voce, 0x100018: dice dove leggere. Il terzo è il valore letto a quell’indirizzo, per esempio 35: è l’unico che parla del frame. Nessuno dei tre è ancora l’indirizzo del dato.',
      'Il valore della voce va decodificato. In questo capitolo una voce vale 2 × PFN + valid, dove valid è il [[bit di validità]], che dice se la voce è utilizzabile. Il valore 35 è dispari: la voce è valida, e il frame è (35 − 1) / 2 = 17. Resta da ricomporre l’indirizzo fisico come nell’unità 6.2.1: 17 × 1024 + offset. L’indirizzo virtuale 0xC33 vale 3123, cioè 3 × 1024 + 51. Il dato sta quindi a 17 × 1024 + 51 = 17 459, che in esadecimale è 0x4433.',
      'Resta il caso della voce invalida, in cui un indirizzo fisico non esiste. Il programma deve comunque restituire qualcosa. Serve un valore che nessuna traduzione riuscita possa produrre, un [[valore di errore]]. La scelta comune è riempire il registro del risultato con sessantaquattro bit a 1, cioè 0xFFFFFFFFFFFFFFFF. Chi ha chiesto la traduzione deve controllare il risultato prima di usarlo: se trova quel valore, rinuncia all’accesso.'
    ]
  },
  esperimento: {
    faremo: [
      'Tradurremo un indirizzo virtuale consultando una tabella di otto voci in memoria. Sceglierai l’indirizzo da tradurre, e l’indirizzo a cui comincia la tabella.',
      'Calcoleremo l’indice, l’indirizzo della voce e il valore letto, e da quest’ultimo il frame. Cambia la base della tabella, e guarda quali numeri si spostano e quali restano fermi.'
    ],
    vedrai: [
      ['puntatore', 'L’indirizzo virtuale', 'In alto: l’indirizzo da tradurre, e le sue due parti.'],
      ['tabella', 'La tabella', 'Al centro: le otto voci. Sopra ciascuna l’indice, dentro il valore, sotto l’indirizzo a cui si trova.'],
      ['hex', 'Il percorso', 'In basso: indirizzo della voce, valore letto, frame, e il risultato lasciato in RAX.']
    ]
  },
  lab: {
    titolo: 'Dall’indice al byte, passando per la voce',
    scena: { w: 860, h: 228 },
    atti: ['L’indirizzo', 'La voce', 'Il risultato'],
    controlli: [
      { id: 'va', tipo: 'scelta', eti: 'Indirizzo virtuale', opzioni: [[0xC33, '0xC33'], [0x433, '0x433'], [0x805, '0x805']], valore: 0xC33 },
      { id: 'base', tipo: 'scelta', eti: 'Base della tabella', opzioni: [[0x100000, '0x100000'], [0x200000, '0x200000']], valore: 0x100000 }
    ],
    nota: 'I passi sono sempre sette. Le pagine sono da 1024 byte, le voci da 8 byte, e ogni voce vale 2 × PFN + valid.',
    previsione: {
      domanda: (p) => { const U = SL.unita631; return 'La tabella comincia a ' + U.H(p.base) + ', con voci da 8 byte che valgono 2 × PFN + valid. Le pagine sono da 1024 byte. Il programma traduce l’indirizzo virtuale ' + U.H(p.va) + ', e la voce di quella pagina contiene ' + U.calcola(p).pte + '. Quale valore restituisce in RAX?'; },
      opzioni: (p) => { const U = SL.unita631, c = U.calcola(p); return [['pa', U.H(c.pa)], ['voce', U.H(c.ind)], ['errore', '0xFFFFFFFFFFFFFFFF: la voce è invalida']]; }
    },
    confronto: (pred, esito, p) => { const U = SL.unita631, c = U.calcola(p), N = { pa: U.H(c.pa), voce: U.H(c.ind), errore: 'il valore di errore' }; return 'La previsione indicava ' + N[pred] + '. RAX contiene ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 'voce' ? 'Quello è l’indirizzo a cui si trova la voce. Dice dove leggere la voce. Il dato sta altrove.' : esito === 'errore' ? 'Il valore ' + c.pte + ' è pari: il bit di validità è 0, e la voce non autorizza alcuna traduzione.' : 'Il valore ' + c.pte + ' è dispari: la voce è valida, e indica il frame ' + c.pfn + '.'); },
    costruisci(p) {
      const U = SL.unita631, c = U.calcola(p), passi = [], H = U.H;
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Indice', f >= 1 ? String(c.vpn) : '·'], ['Voce a', f >= 2 ? H(c.ind) : '·', 'a'], ['Valore', f >= 3 ? String(c.pte) : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'L’indirizzo da tradurre', 'Il programma riceve l’indirizzo virtuale ' + H(p.va) + ', che in decimale è ' + p.va + '. Conosce la base della tabella, ' + H(p.base) + ', e la grandezza delle pagine, 1024 byte.', {});
      P(1, 0, 'Pagina e offset', 'Dividiamo per 1024: ' + p.va + ' = ' + c.vpn + ' × 1024 + ' + c.off + '. La pagina è la ' + c.vpn + ', e l’offset è ' + c.off + ', cioè ' + H(c.off) + '.', { calc: p.va + ' = ' + c.vpn + ' × 1024 + ' + c.off });
      P(2, 1, 'Dove sta la voce', 'Ogni voce occupa 8 byte. La voce ' + c.vpn + ' si trova ' + c.vpn + ' × 8 = ' + 8 * c.vpn + ' byte dopo la base: ' + H(p.base) + ' + ' + H(8 * c.vpn) + ' = ' + H(c.ind) + '. Questo è un indirizzo dentro la tabella. Il dato sta altrove.', { calc: H(p.base) + ' + ' + c.vpn + ' × 8 = ' + H(c.ind), chiedi: { d: 'Abbiamo l’indirizzo ' + H(c.ind) + '. Che cosa troveremo leggendo lì?', o: ['Il valore della voce, da cui ricavare il frame', 'Il dato cercato dal programma', 'L’indirizzo virtuale'], g: 0, no: 'A quell’indirizzo sta la voce della pagina ' + c.vpn + '. Il dato si trova in un frame, che dobbiamo ancora scoprire.' } });
      P(3, 1, 'Leggere la voce', 'Il programma legge gli 8 byte all’indirizzo ' + H(c.ind) + '. Il valore è ' + c.pte + '.', { calc: '[' + H(c.ind) + '] = ' + c.pte });
      P(4, 1, 'Decodificare la voce', c.valida ? 'La voce vale 2 × PFN + valid. ' + c.pte + ' è dispari: il bit di validità è 1. Il frame è (' + c.pte + ' − 1) / 2 = ' + c.pfn + '.' : 'La voce vale 2 × PFN + valid. ' + c.pte + ' è pari: il bit di validità è 0. La voce è invalida, e il numero che contiene non va usato come frame.', { calc: c.valida ? c.pte + ' = 2 × ' + c.pfn + ' + 1' : c.pte + ' = 2 × ' + c.pfn + ' + 0 · invalida' });
      P(5, 2, c.valida ? 'L’indirizzo fisico' : 'Il valore di errore', c.valida ? 'Il dato sta nel frame ' + c.pfn + ', all’offset ' + c.off + ': ' + c.pfn + ' × 1024 + ' + c.off + ' = ' + c.pa + ', cioè ' + H(c.pa) + '. Il programma restituisce questo valore in RAX.' : 'Un indirizzo fisico non esiste. Il programma restituisce in RAX il valore di errore: sessantaquattro bit a 1.', { calc: c.valida ? c.pfn + ' × 1024 + ' + c.off + ' = ' + H(c.pa) : 'RAX = 0xFFFFFFFFFFFFFFFF' });
      P(5, 2, 'Il confronto fra i tre numeri', 'L’indice era ' + c.vpn + '. L’indirizzo della voce era ' + H(c.ind) + '. Il valore letto era ' + c.pte + '. ' + (c.valida ? 'Soltanto quest’ultimo ha portato al frame ' + c.pfn + ', e quindi a ' + H(c.pa) + '.' : 'Quest’ultimo ha detto che la traduzione non esiste.') + ' Se la tabella fosse spostata a un’altra base cambierebbe l’indirizzo della voce, e nient’altro.', { esito: [c.valida ? 'RAX = ' + H(c.pa) : 'RAX = valore di errore', c.valida ? 'si' : 'no'] });
      return { passi, esito: c.valida ? 'pa' : 'errore' };
    }
  },
  bilancio: {
    regola: [
      'Indirizzo della voce = base della tabella + 8 × VPN. Valore della voce = 2 × PFN + valid.',
      'Voce valida: indirizzo fisico = PFN × grandezza della pagina + offset. Voce invalida: si restituisce il valore di errore.'
    ],
    errori: [
      ['Restituire l’indirizzo della voce.', 'Quell’indirizzo dice dove sta la voce nella tabella. Il dato sta nel frame che la voce indica.'],
      ['Usare il valore della voce come frame.', 'Il valore contiene anche il bit di validità: il frame è la metà intera.'],
      ['Dimenticare di controllare il risultato.', 'Chi chiede una traduzione deve riconoscere il valore di errore prima di usare l’indirizzo.']
    ],
    saFare: ['Calcolare l’indirizzo di una voce.', 'Decodificare una voce in frame e validità.', 'Comporre l’indirizzo fisico, oppure riconosco l’errore.'],
    esercizi: [
      { d: 'La tabella comincia a 0x100000, con voci da 8 byte. A quale indirizzo si trova la voce della pagina 5? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1000', giuste: ['0x100028', '100028', '100028h', '0X100028'],
        ok: '5 × 8 = 40 = 0x28: la voce sta a 0x100028.',
        diagnosi: [
          { se: ['0x100005', '100005'], msg: 'Ogni voce occupa 8 byte: l’indice va moltiplicato per 8.' },
          { se: ['0x100040', '100040'], msg: 'Quaranta è il valore decimale. In esadecimale si scrive 0x28.' }
        ],
        altro: 'L’indirizzo è diverso. Si moltiplichi l’indice per 8, si converta in esadecimale e si sommi alla base.',
        indizi: ['5 × 8 = 40.', '40 in esadecimale è 0x28.', '0x100000 + 0x28 = 0x100028.'],
        svolgimento: ['Spostamento: 40 byte = 0x28.', 'Indirizzo: 0x100028.'] },
      { d: 'Una voce vale 2 × PFN + valid, e contiene 23. Qual è il numero del frame?', segnaposto: 'Un numero', giuste: ['11', 'undici'],
        ok: '23 è dispari: valida. (23 − 1) / 2 = 11.',
        diagnosi: [
          { se: ['23', 'ventitre', 'ventitré'], msg: 'Il valore contiene anche il bit di validità. Togli 1 e dividi per 2.' },
          { se: ['12', 'dodici'], msg: 'La divisione è intera: 23 = 2 × 11 + 1.' }
        ],
        altro: 'Il numero è diverso. Si scriva 23 nella forma 2 × PFN + valid.',
        indizi: ['23 è dispari: valid vale 1.', '23 − 1 = 22.', '22 / 2 = 11.'],
        svolgimento: ['23 = 2 × 11 + 1.', 'Frame: 11.'] },
      { d: 'Con pagine da 1024 byte, una voce valida indica il frame 11. Qual è, in decimale, l’indirizzo fisico del byte di offset 20?', segnaposto: 'Un numero', giuste: ['11284', '11 284', '0x2c14', '0x2C14'],
        ok: '11 × 1024 + 20 = 11 284.',
        diagnosi: [
          { se: ['11264', '11 264'], msg: 'Questo è l’inizio del frame 11. Aggiungi l’offset, 20.' },
          { se: ['31', 'trentuno'], msg: 'Il frame va moltiplicato per 1024 prima di aggiungere l’offset.' },
          { se: ['45076', '45 076'], msg: 'In questo capitolo le pagine sono da 1024 byte.' }
        ],
        altro: 'Il numero è diverso. Si applichi frame × 1024 + offset.',
        indizi: ['11 × 1024 = 11 264.', 'Offset: 20.', '11 264 + 20 = 11 284.'],
        svolgimento: ['Inizio del frame: 11 264.', 'Indirizzo fisico: 11 284.'] }
    ],
    sfida: ['cslez6_3_01_vpn_offset', 'VPN e offset']
  }
});
