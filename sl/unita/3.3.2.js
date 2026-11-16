'use strict';
SL.registra('3.3.2', {
  titolo: 'Codifica e confini delle istruzioni',
  obiettivo: 'Obiettivo: leggere il primo byte di un’istruzione della CPU del caso di studio, indicare quali campi lo seguono e calcolare l’indirizzo dell’istruzione successiva.',
  concetti: [['hex', 'Classe e variante in un byte'], ['byte', 'Campi presenti e campi assenti'], ['puntatore', 'L’inizio dell’istruzione successiva']],
  filigrana: ['hex', 'byte', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 1.2.3', t: 'Little-endian', d: 'Un numero di più byte si scrive in memoria partendo dal byte meno significativo, all’indirizzo più basso.' },
      { sim: 'operation', da: 'Dall’unità 2.4.4', t: 'Campi in un byte', d: 'Uno scorrimento e una maschera isolano un campo di pochi bit all’interno di un byte.' },
      { sim: 'puntatore', da: 'Dall’unità 3.3.1', t: 'Il contatore di programma', d: 'Il PC contiene l’indirizzo dell’istruzione da prelevare, e avanza della sua lunghezza.' }
    ],
    domanda: { d: 'Prima di proseguire: i byte 23 01 00 00 00 00 00 00 sono un numero di 64 bit scritto in little-endian. Quanto vale, in esadecimale?', o: [
      { t: '0x123', ok: true, fb: 'Il primo byte, 23, è il meno significativo, e il secondo, 01, pesa 256.' },
      { t: '0x2301', fb: 'I byte vanno letti a partire dall’ultimo: quello più a sinistra in memoria è il meno significativo.' },
      { t: '0x23', fb: 'Anche il secondo byte, 01, contribuisce al numero con peso 256.' }
    ] }
  },
  idea: {
    titolo: 'Il primo byte determina la lettura dei successivi',
    termini: ['icode', 'ifun', 'valc', 'valp'],
    testo: [
      'In memoria un programma è una sequenza di byte priva di separatori. La CPU deve individuare la fine di un’istruzione e l’inizio della successiva, e le istruzioni del caso di studio hanno lunghezze diverse, da 1 a 10 byte.',
      'L’informazione risiede nel primo byte, le cui due cifre esadecimali sono due campi di quattro bit. La cifra alta è la categoria dell’istruzione, detta [[icode]]. La cifra bassa è l’operazione all’interno della categoria, detta [[ifun]]. Il byte 60 ha icode 6 e ifun 0: categoria delle istruzioni aritmetiche e logiche, operazione `add`. Con ifun 1, 2 e 3 la medesima categoria dà `sub`, `and` e `or`.',
      'Dalla categoria discende il resto. Alcune categorie sono seguite da un byte dei registri, con due numeri di quattro bit: rA nella cifra alta e rB nella cifra bassa. I registri sono numerati da 0 a E, a partire da RAX, RCX, RDX e RBX, e la cifra F indica che nessun registro è coinvolto. Alcune categorie sono seguite da una costante di otto byte in little-endian, detta [[valc|valC]].',
      { fig: 'scena', w: 720, h: 210, titolo: 'Le quattro lunghezze del caso di studio', nota: 'Ogni casella è un campo. La costante occupa sempre otto byte.', els: [
        SL.el.nota('r1', 0, 16, '1 byte', 'mono'), SL.el.box('a1', 110, 2, 110, 40, null, 'codice', 'att', { cls: 'stretta' }), SL.el.nota('n1', 236, 16, 'halt, nop', 'mono minuta'),
        SL.el.nota('r2', 0, 66, '2 byte', 'mono'), SL.el.box('a2', 110, 52, 110, 40, null, 'codice', 'att', { cls: 'stretta' }), SL.el.box('b2', 226, 52, 110, 40, null, 'rA rB', 'on', { cls: 'stretta' }), SL.el.nota('n2', 352, 66, 'mov rA, rB · add, sub, and, or', 'mono minuta'),
        SL.el.nota('r3', 0, 116, '9 byte', 'mono'), SL.el.box('a3', 110, 102, 110, 40, null, 'codice', 'att', { cls: 'stretta' }), SL.el.box('c3', 226, 102, 250, 40, null, 'valC, 8 byte', '', { cls: 'stretta' }), SL.el.nota('n3', 492, 116, 'je', 'mono minuta'),
        SL.el.nota('r4', 0, 166, '10 byte', 'mono'), SL.el.box('a4', 110, 152, 110, 40, null, 'codice', 'att', { cls: 'stretta' }), SL.el.box('b4', 226, 152, 110, 40, null, 'rA rB', 'on', { cls: 'stretta' }), SL.el.box('c4', 342, 152, 250, 40, null, 'valC, 8 byte', '', { cls: 'stretta' }), SL.el.nota('n4', 604, 166, 'mov con costante', 'mono minuta')
      ] },
      'Le istruzioni da dieci byte sono le tre forme di `mov` che contengono una costante. `mov rB, V` scrive la costante V nel registro rB, e il suo campo rA vale F. `mov rA, D(rB)` legge la memoria e `mov D(rB), rA` la scrive: in entrambe la costante D è lo spostamento da sommare al registro di base rB, come nell’indirizzo base più spostamento del Modulo II. `je` non ha il byte dei registri, e la sua costante, la destinazione, occupa i byte da 1 a 8.',
      'Una volta nota la lunghezza, la CPU calcola l’indirizzo dell’istruzione che segue in memoria: PC più lunghezza. Tale valore prende il nome di [[valp|valP]]. Un `je` con condizione vera potrà scegliere un’altra destinazione, e valP è calcolato in ogni caso.'
    ]
  },
  esperimento: {
    faremo: [
      'A partire dal PC la memoria contiene dieci byte. I controlli fissano l’istruzione codificata e il suo indirizzo iniziale.',
      'I byte sono letti nell’ordine seguito dalla CPU: il codice, il byte dei registri, la costante. Al termine sono note la lunghezza e valP. Dopo il caso proposto, è istruttivo esaminare `nop`, che occupa un solo byte, e `je`, che non ha il byte dei registri.'
    ],
    vedrai: [
      ['byte', 'I byte in memoria', 'In alto: dieci celle a partire dal PC, con i rispettivi indirizzi.'],
      ['hex', 'I campi', 'Al centro: icode, ifun, i due registri e la costante.'],
      ['puntatore', 'Il confine', 'In basso: la lunghezza dell’istruzione e valP.']
    ]
  },
  lab: {
    titolo: 'La fine dell’istruzione',
    scena: { w: 860, h: 300 },
    atti: ['Il primo byte', 'Categoria e operazione', 'Il byte dei registri', 'La costante', 'La lunghezza e valP'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione codificata', opzioni: [['ir', 'mov rbx, 291'], ['or', 'or rax, rbx'], ['je', 'je 0x123'], ['mr', 'mov rax, 8(rbx)'], ['nop', 'nop']], valore: 'ir' },
      { id: 'pc', tipo: 'scelta', eti: 'Indirizzo iniziale', opzioni: [[0x40, '0x40'], [0x1F8, '0x1F8']], valore: 0x40 }
    ],
    nota: 'I passi sono sempre cinque. Quando un campo manca, il passo lo dichiara assente.',
    previsione: {
      domanda: (p) => { const U = SL.unita332, b = U.celle(p); return 'A partire dall’indirizzo ' + SL.isa.esa(p.pc) + ' la memoria contiene i byte ' + b.slice(0, 10).join(' ') + '. A quale indirizzo ha inizio l’istruzione successiva?'; },
      opzioni: (p) => [1, 2, 9, 10].map((n) => SL.isa.esa(p.pc + n))
    },
    confronto: (pred, esito, p) => { const I = SL.isa, i = SL.unita332.IST[p.op], n = I.lung(i.n); return 'La previsione indicava ' + pred + '. L’istruzione successiva ha inizio a ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il primo byte indica la categoria ' + I.ICODE[I.classe(i.n)] + ', che occupa ' + n + (n === 1 ? ' byte: il solo codice.' : ' byte: un byte di codice' + (I.conRegistri(i.n) ? ', uno per i registri' : '') + (I.conCostante(i.n) ? ', otto per la costante' : '') + '.')); },
    costruisci(p) {
      const el = SL.el, I = SL.isa, U = SL.unita332, passi = [], i = U.IST[p.op], B = U.celle(p), n = I.lung(i.n), cl = I.classe(i.n), cReg = I.conRegistri(i.n), cCost = I.conCostante(i.n);
      const ic = String(I.ICODE[cl]), fn = B[0][1], valP = p.pc + n, X0 = 30, PS = 80, iniC = cReg ? 2 : 1;
      const st = { cod: false, reg: false, cost: false, fine: false };
      const quadro = (o) => {
        const els = [el.nota('t', 30, 0, 'MEMORIA A PARTIRE DAL PC', 'mono')];
        B.slice(0, 10).forEach((b, k) => {
          const dentro = k < n, campo = k === 0 ? 'cod' : cReg && k === 1 ? 'reg' : 'cost';
          els.push(el.cella('m' + k, X0 + k * PS, 46, PS - 6, 46, b, o.campo === campo && dentro ? 'att' : !dentro ? (st.fine ? 'off' : '') : (st[campo] ? 'on' : ''), { piccola: true, cls: 'minuta', so: I.esa(p.pc + k) }));
        });
        if (st.fine) els.push(el.cursore('cur', X0 + n * PS - 6, 98, 6 + (n < 10 ? PS - 6 : 0)), el.nota('nv', n < 10 ? X0 + n * PS : X0 + 7 * PS + 20, 108, n < 10 ? 'valP' : 'valP, oltre l’ultima cella', 'mono minuta', 'att'));
        els.push(el.box('b1', 30, 140, 150, 70, 'icode', st.cod ? ic : '·', o.campo === 'cod' && st.cod ? 'att' : st.cod ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 190, 140, 150, 70, 'ifun', st.cod ? fn : '·', o.campo === 'cod' && st.cod ? 'att' : st.cod ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 350, 140, 220, 70, 'registri rA e rB', !st.reg ? '·' : cReg ? U.nomeReg(cl === 'ir' ? null : i.a) + ' · ' + U.nomeReg(i.b) : 'assenti', o.campo === 'reg' ? 'att' : !st.reg ? '' : cReg ? 'on' : 'off', { cls: 'stretta' }),
          el.box('b4', 580, 140, 250, 70, 'costante valC', !st.cost ? '·' : cCost ? I.esa(i.c) + ' = ' + i.c : 'assente', o.campo === 'cost' ? 'att' : !st.cost ? '' : cCost ? 'on' : 'off', { cls: 'stretta' }),
          el.box('b5', 30, 222, 310, 68, 'istruzione', st.cod ? (st.reg && st.cost ? I.testo(i) : I.FORMA[i.n]) : '·', st.fine ? 'att' : st.cod ? 'on' : '', { cls: 'stretta' }),
          el.box('b6', 350, 222, 220, 68, 'lunghezza', st.fine ? n + ' byte' : '·', st.fine ? 'att' : '', { cls: 'stretta' }),
          el.box('b7', 580, 222, 250, 68, 'valP', st.fine ? I.esa(valP) : '·', st.fine ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['PC', I.esa(p.pc), 'a'], ['Lunghezza', st.fine ? n + ' byte' : '·'], ['valP', st.fine ? I.esa(valP) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const NOMI = { ir: 'mov con una costante in un registro', op: 'istruzioni aritmetiche e logiche', je: 'salto condizionato', mr: 'mov con lettura dalla memoria', nop: 'nessuna operazione' };

      P({ campo: 'cod' }, 0, 'Il byte all’indirizzo del PC', 'Il PC vale ' + I.esa(p.pc) + '. La CPU ignora ancora di quale istruzione si tratti e quale sia la sua lunghezza. Essa legge il primo byte, che vale ' + B[0] + '.',
        { chiedi: { d: 'Il primo byte vale ' + B[0] + '. Quali sono icode e ifun?', o: ['icode ' + B[0][0] + ', ifun ' + B[0][1], 'icode ' + B[0][1] + ', ifun ' + B[0][0]].filter((x, k, a) => a.indexOf(x) === k).concat(B[0][0] === B[0][1] ? ['icode ' + B[0] + ', senza ifun'] : []), g: 0, no: 'La cifra alta è icode, la cifra bassa è ifun.' } });
      st.cod = true;
      P({ campo: 'cod' }, 1, 'Categoria ' + ic + ', operazione ' + fn, 'La cifra alta, ' + ic + ', è icode: la categoria «' + NOMI[cl] + '». La cifra bassa, ' + fn + ', è ifun' + (cl === 'op' ? ': fra le istruzioni aritmetiche e logiche, la funzione 3 è `or`.' : cl === 'je' ? ': per il salto è il codice della condizione «uguale», l’unica del caso di studio.' : ': questa categoria ha una sola operazione, e ifun vale 0.') + ' A questo punto la CPU sa che l’istruzione ha la forma `' + I.FORMA[i.n] + '`, e dalla categoria ricava quali campi seguono.',
        { calc: 'icode = ' + ic + ' · ifun = ' + fn, chiedi: { d: 'Un’istruzione della forma `' + I.FORMA[i.n] + '` richiede l’indicazione di registri?', o: ['Sì', 'No'], g: cReg ? 0 : 1, no: cReg ? 'La forma nomina dei registri, e il byte che segue il codice li indica.' : cl === 'je' ? 'Un salto richiede soltanto la destinazione.' : '`nop` non opera su alcun registro.' } });
      st.reg = true;
      P({ campo: 'reg' }, 2, cReg ? 'Il byte dei registri' : 'Nessun byte dei registri', cReg ? 'Il secondo byte vale ' + B[1] + '. La cifra alta, ' + B[1][0] + ', è rA: ' + (cl === 'ir' ? 'F indica che nessun registro è coinvolto.' : 'il registro numero ' + B[1][0] + ', ' + i.a.toUpperCase() + '.') + ' La cifra bassa, ' + B[1][1] + ', è rB: il registro numero ' + B[1][1] + ', ' + i.b.toUpperCase() + '.' + (cl === 'ir' ? ' In `mov rB, V` il registro di destinazione è rB, e il campo rA, inutilizzato, occupa comunque la propria posizione.' : '') : 'Questa categoria è priva del byte dei registri. Il byte che segue il codice appartiene ' + (cCost ? 'già alla costante.' : 'a un’altra istruzione.'),
        { calc: cReg ? 'rA = ' + B[1][0] + ' · rB = ' + B[1][1] : 'byte dei registri assente' });
      st.cost = true;
      P({ campo: 'cost' }, 3, cCost ? 'La costante di otto byte' : 'Nessuna costante', cCost ? 'Seguono otto byte: ' + B.slice(iniC, iniC + 8).join(' ') + '. Essi costituiscono la costante valC in little-endian, e letti dal meno significativo danno ' + I.esa(i.c) + ', cioè ' + i.c + '. ' + (cl === 'ir' ? 'È il valore da scrivere nel registro: l’istruzione è `' + I.testo(i) + '`.' : cl === 'je' ? 'È l’indirizzo di destinazione del salto: l’istruzione è `' + I.testo(i) + '`.' : 'È lo spostamento da sommare al registro di base: l’istruzione è `' + I.testo(i) + '`.') : 'Questa categoria è priva di costanti. L’istruzione, `' + I.testo(i) + '`, termina dopo ' + n + ' byte.',
        { calc: cCost ? 'valC = ' + I.esa(i.c) : 'costante assente', chiedi: { d: 'L’istruzione occupa ' + n + ' byte a partire da ' + I.esa(p.pc) + '. A quale indirizzo ha inizio la successiva?', o: [1, 2, 9, 10].map((k) => I.esa(p.pc + k)), g: [1, 2, 9, 10].indexOf(n), no: 'valP = PC + lunghezza = ' + I.esa(p.pc) + ' + ' + n + ' = ' + I.esa(valP) + '.' } });
      st.fine = true;
      P({}, 4, 'Il confine', 'La lunghezza è ' + [1, cReg ? 1 : 0, cCost ? 8 : 0].filter(Boolean).join(' + ') + (n > 1 ? ' = ' + n : '') + ' byte. Il successore in memoria si trova a valP = ' + I.esa(p.pc) + ' + ' + n + ' = ' + I.esa(valP) + '.' + (cl === 'je' ? ' Se ZF varrà 1, il PC riceverà valC al posto di valP.' : ' A tale indirizzo punterà il PC dopo questa istruzione.'),
        { calc: 'valP = ' + I.esa(p.pc) + ' + ' + n + ' = ' + I.esa(valP), esito: ['valP = ' + I.esa(valP), 'si'] });
      return { passi, esito: I.esa(valP) };
    }
  },
  bilancio: {
    regola: [
      'Il primo byte di un’istruzione contiene icode nella cifra alta e ifun nella cifra bassa. La categoria stabilisce se seguono il byte dei registri, rA:rB, e la costante valC di otto byte.',
      'La lunghezza vale 1, più 1 se è presente il byte dei registri, più 8 se è presente la costante: 1 byte per `halt` e `nop`, 2 per `mov rA, rB` e per le istruzioni aritmetiche e logiche, 9 per `je`, 10 per le forme di `mov` con una costante. valP = PC + lunghezza è l’indirizzo dell’istruzione successiva in memoria.'
    ],
    errori: [
      ['Leggere la costante dal byte più a sinistra.', 'valC è in little-endian: i byte 23 01 00 … valgono 0x123.'],
      ['Omettere il byte dei registri quando un registro manca.', 'In `mov rB, V` il campo rA vale F, e il byte occupa comunque una posizione.'],
      ['Confondere valP con la destinazione di un salto.', 'valP è il successore in memoria. La destinazione del salto è la costante valC.']
    ],
    saFare: ['Separare icode e ifun nel primo byte.', 'Indicare quali campi seguono, data la categoria.', 'Calcolare la lunghezza di un’istruzione e il valore di valP.'],
    esercizi: [
      { d: 'Un’istruzione ha inizio all’indirizzo 0x200 con il byte 40, il codice di `mov rA, D(rB)`. Quanti byte occupa?', segnaposto: 'Un numero', giuste: ['10', 'dieci'],
        ok: 'Un byte di codice, uno per i registri e otto per lo spostamento: 1 + 1 + 8 = 10.',
        diagnosi: [
          { se: ['2', 'due'], msg: '`mov rA, D(rB)` contiene anche lo spostamento, una costante di otto byte.' },
          { se: ['9', 'nove'], msg: '`mov rA, D(rB)` nomina due registri, e il byte dei registri va contato.' },
          { se: ['8', 'otto'], msg: 'Otto byte sono la sola costante. Vanno aggiunti il codice e il byte dei registri.' }
        ],
        altro: 'Il numero è diverso. Si contino il codice, il byte dei registri e la costante.',
        indizi: ['Il codice occupa 1 byte.', '`mov rA, D(rB)` nomina un registro di destinazione e uno di base.', 'Lo spostamento è una costante di 8 byte.'],
        svolgimento: ['Codice: 1 byte.', 'Registri: 1 byte. Spostamento: 8 byte.', 'Lunghezza: 1 + 1 + 8 = 10 byte.'] },
      { d: 'I byte 73 56 00 00 00 00 00 00 00 hanno inizio all’indirizzo 0x30 e codificano un `je`. Quanto vale valP? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x40', giuste: ['0x39', '39', '39h'],
        ok: 'Un `je` occupa 9 byte: valP = 0x30 + 9 = 0x39.',
        diagnosi: [
          { se: ['0x56', '56', '56h'], msg: 'Questa è la destinazione del salto, cioè valC. valP è l’indirizzo dell’istruzione che segue in memoria.' },
          { se: ['0x3a', '3a', '3ah'], msg: '`je` è privo del byte dei registri, e occupa 9 byte.' },
          { se: ['0x32', '32', '32h'], msg: 'Al codice segue la destinazione, una costante di otto byte.' }
        ],
        altro: 'Il valore è diverso. Si sommi al PC la lunghezza del salto, in esadecimale.',
        indizi: ['Il primo byte, 73, ha icode 7: è il salto `je`.', '`je` occupa 1 + 8 = 9 byte.', '0x30 + 9.'],
        svolgimento: ['icode 7: `je`.', 'Lunghezza: 9 byte.', 'valP = 0x30 + 9 = 0x39.'] }
    ],
    sfida: ['cslez3_3_02_random_assembly', 'Lunghezza e campi di un’istruzione']
  }
});
SL.unita332 = {
  IST: { ir: { n: 'ir', b: 'rbx', c: 291 }, or: { n: 'or', a: 'rax', b: 'rbx' }, je: { n: 'je', c: 291 }, mr: { n: 'mr', a: 'rax', b: 'rbx', c: 8 }, nop: { n: 'nop' } },
  // I byte dell'istruzione, seguiti da quelli di istruzioni successive per riempire dieci celle.
  celle: (p) => { const I = SL.isa; return I.byteIst(SL.unita332.IST[p.op]).concat([0x60, 0x12, 0x20, 0x31, 0x10, 0x61, 0x23, 0x10, 0x10, 0x00]).map(I.esa2); },
  nomeReg: (r) => (r == null ? 'nessuno' : r.toUpperCase())
};
