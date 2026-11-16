'use strict';
SL.registra('3.4.2', {
  titolo: 'Il percorso dati a ciclo singolo',
  obiettivo: 'Obiettivo: indicare, per le forme di istruzione del caso di studio, i valori presenti ai due ingressi dell’ALU e la destinazione del risultato valE, e seguire un’istruzione lungo il percorso dati.',
  concetti: [['alu', 'Gli operandi dell’ALU'], ['mux', 'Un multiplexer per ingresso'], ['bus', 'Le destinazioni del risultato']],
  filigrana: ['alu', 'bus', 'mux'],
  richiami: {
    carte: [
      { sim: 'cpu', da: 'Dall’unità 3.4.1', t: 'La CPU a ciclo singolo', d: 'Durante il ciclo i segnali attraversano la logica combinatoria. Al fronte gli elementi di stato catturano i valori nuovi.' },
      { sim: 'mux', da: 'Dall’unità 3.1.2', t: 'Il multiplexer', d: 'Copia sull’uscita uno dei suoi ingressi, selezionato da un segnale di controllo.' },
      { sim: 'tabella', da: 'Dall’unità 3.3.3', t: 'Base più spostamento', d: 'In `mov rA, D(rB)` l’ALU calcola l’indirizzo valE = valB + valC.' }
    ],
    domanda: { d: 'Prima di proseguire: in `mov rax, 8(rbx)`, quali due valori somma l’ALU?', o: [
      { t: 'valB e valC', ok: true, fb: 'La base letta da RBX e lo spostamento scritto nell’istruzione.' },
      { t: 'valA e valB', fb: 'Due registri si sommano in `add`. In questo caso uno degli addendi è la costante dell’istruzione.' },
      { t: 'valC e valP', fb: 'valP è destinato al PC. L’indirizzo si ottiene dalla base e dallo spostamento.' }
    ] }
  },
  idea: {
    titolo: 'Una sola ALU per impieghi diversi',
    termini: ['alu a', 'alu b', 'mem addr'],
    testo: [
      'La CPU a ciclo singolo contiene una sola ALU, che ogni forma di istruzione impiega in modo diverso. `add rA, rB` vi combina due registri. `mov rA, D(rB)` e `mov D(rB), rA` vi calcolano un indirizzo, base più spostamento. Le forme `mov rA, rB` e `mov rB, V` vi fanno transitare un valore, al quale l’ALU somma zero. Per servire tutte queste istruzioni, ciascun ingresso dell’ALU è preceduto da un multiplexer.',
      'Il segnale di controllo [[alu a|ALU A]] seleziona il primo ingresso: valA per le istruzioni aritmetiche e logiche, valC per `mov rB, V` e per gli accessi alla memoria, 0 per `mov rA, rB`. Il segnale [[alu b|ALU B]] seleziona il secondo ingresso: valB, oppure 0 per `mov rB, V`. Un terzo segnale, ALU fun, stabilisce l’operazione: per le istruzioni aritmetiche e logiche è dato da ifun, per tutte le altre l’ALU somma.',
      { fig: 'scena', w: 720, h: 192, titolo: 'Gli ingressi dell’ALU, istruzione per istruzione', nota: 'L’unità di controllo seleziona la riga in base a icode.', els: [
        SL.el.nota('h0', 0, 0, 'ISTRUZIONE', 'mono'), SL.el.nota('h1', 300, 0, 'ALU A', 'mono'), SL.el.nota('h2', 520, 0, 'ALU B', 'mono'),
        SL.el.nota('a1', 0, 36, 'add, sub, and, or', 'mono minuta'), SL.el.box('b1', 300, 24, 200, 34, null, 'valA', 'on', { cls: 'stretta' }), SL.el.box('c1', 520, 24, 200, 34, null, 'valB', 'on', { cls: 'stretta' }),
        SL.el.nota('a2', 0, 76, 'mov rA, rB', 'mono minuta'), SL.el.box('b2', 300, 64, 200, 34, null, '0', 'att', { cls: 'stretta' }), SL.el.box('c2', 520, 64, 200, 34, null, 'valB', 'on', { cls: 'stretta' }),
        SL.el.nota('a3', 0, 116, 'mov rB, V', 'mono minuta'), SL.el.box('b3', 300, 104, 200, 34, null, 'valC', '', { cls: 'stretta' }), SL.el.box('c3', 520, 104, 200, 34, null, '0', 'att', { cls: 'stretta' }),
        SL.el.nota('a4', 0, 156, 'mov rA, D(rB) · mov D(rB), rA', 'mono minuta'), SL.el.box('b4', 300, 144, 200, 34, null, 'valC', '', { cls: 'stretta' }), SL.el.box('c4', 520, 144, 200, 34, null, 'valB', 'on', { cls: 'stretta' })
      ] },
      'Anche l’uscita dell’ALU, valE, ha destinazioni diverse. Per le istruzioni aritmetiche e logiche e per le due forme di `mov` fra registri e con una costante è la porta di scrittura E del banco dei registri. Per gli accessi alla memoria è l’ingresso degli indirizzi della memoria dei dati, il segnale [[mem addr|Mem addr]]. Il filo si dirama, e i segnali di controllo determinano quale destinazione lo acquisisce.',
      'In `mov D(rB), rA` i due valori letti dal banco seguono quindi percorsi diversi. valB, la base, entra nell’ALU insieme allo spostamento valC. valA, il dato da scrivere, raggiunge direttamente l’ingresso Mem data della memoria, senza attraversare l’ALU. In `mov rA, D(rB)` la memoria fornisce invece la parola valM, che raggiunge la porta di scrittura M del banco.'
    ]
  },
  esperimento: {
    faremo: [
      'La CPU esegue una delle quattro istruzioni proposte. I controlli fissano l’istruzione e i valori di RBX e di RAX.',
      'Si seguono i valori letti dal banco fino ai multiplexer e all’ALU, e quindi il risultato valE fino alla sua destinazione. Dopo il caso proposto, è istruttivo confrontare `mov rax, 8(rbx)` con `mov 8(rbx), rax`: l’ALU calcola il medesimo indirizzo, e cambia soltanto la destinazione del dato.'
    ],
    vedrai: [
      ['register', 'Le letture del banco', 'A sinistra: valA e valB, letti dalle porte A e B.'],
      ['alu', 'I multiplexer e l’ALU', 'Al centro: gli ingressi selezionati da ALU A e da ALU B, e il risultato valE.'],
      ['memory', 'Le destinazioni', 'A destra: la memoria dei dati e la porta di scrittura del banco.']
    ]
  },
  lab: {
    titolo: 'Quattro istruzioni sul percorso dati',
    scena: { w: 860, h: 290 },
    atti: ['Prelievo e decodifica', 'Gli ingressi dell’ALU', 'Il risultato valE', 'La destinazione', 'Il fronte'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione', opzioni: [['add', 'add rax, rbx'], ['ir', 'mov rax, 291'], ['mr', 'mov rax, 8(rbx)'], ['rm', 'mov 8(rbx), rax']], valore: 'rm' },
      { id: 'b', tipo: 'scelta', eti: 'RBX', opzioni: [[0x70, '0x70'], [0x200, '0x200']], valore: 0x70 },
      { id: 'v', tipo: 'scelta', eti: 'RAX', opzioni: [[0x2B, '0x2B'], [0x7, '0x7']], valore: 0x2B }
    ],
    nota: 'I passi sono sempre cinque. La memoria dei dati contiene 0x55 nella parola che ha inizio a RBX + 8.',
    previsione: {
      domanda: (p) => { const I = SL.isa; return 'La CPU esegue `' + I.testo(SL.unita342.ist(p.op)) + '` con RBX = ' + I.esa(p.b) + ' e RAX = ' + I.esa(p.v) + '. Quale valore produce l’ALU su valE?'; },
      opzioni: (p) => { const H = SL.isa.esa; return Array.from(new Set([p.v + p.b, p.b + 8, 291, p.v, p.b])).sort((x, y) => x - y).map((v) => [v, H(v)]); }
    },
    confronto: (pred, esito, p) => { const I = SL.isa, H = I.esa, f = SL.unita342.fasi(p); return 'La previsione indicava ' + H(pred) + '. L’ALU produce valE = ' + H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Per `' + I.FORMA[p.op] + '` ALU A seleziona ' + SL.unita342.nomeA(p.op) + ' e ALU B seleziona ' + SL.unita342.nomeB(p.op) + ': ' + H(f.aluA) + ' + ' + H(f.aluB) + ' = ' + H(esito) + '.'); },
    costruisci(p) {
      const el = SL.el, I = SL.isa, H = I.esa, U = SL.unita342, passi = [], i = U.ist(p.op), f = U.fasi(p), mem = f.mem, op = p.op;
      const st = { let: false, mux: false, e: false, dest: false, fronte: false, ck: 'basso' };
      const dest = op === 'rm' ? 'Mem addr, e valA su Mem data' : op === 'mr' ? 'Mem addr, e valM sulla porta M' : 'porta E del banco';
      const quadro = (o) => [
        el.box('ra', 20, 14, 170, 66, 'valA · porta A', !st.let ? '·' : f.srcA ? H(f.valA) : 'non letto', o.letti ? 'att' : !st.let ? '' : f.srcA ? 'on' : 'off', { cls: 'stretta' }),
        el.box('rb', 20, 104, 170, 66, 'valB · porta B', !st.let ? '·' : f.srcB ? H(f.valB) : 'non letto', o.letti ? 'att' : !st.let ? '' : f.srcB ? 'on' : 'off', { cls: 'stretta' }),
        el.box('vc', 20, 206, 170, 66, 'valC', !st.let ? '·' : f.valC == null ? 'assente' : H(f.valC), o.letti ? 'att' : !st.let ? '' : f.valC == null ? 'off' : 'on', { cls: 'stretta' }),
        el.box('ma', 240, 14, 150, 66, 'MUX · ALU A', st.mux ? U.nomeA(op) + ' = ' + H(f.aluA) : '·', o.mux ? 'att' : st.mux ? 'on' : '', { cls: 'stretta' }),
        el.box('mb', 240, 104, 150, 66, 'MUX · ALU B', st.mux ? U.nomeB(op) + ' = ' + H(f.aluB) : '·', o.mux ? 'att' : st.mux ? 'on' : '', { cls: 'stretta' }),
        el.linea('l2', 390, 47, 440, 80, st.e ? 'on' : ''), el.linea('l3', 390, 137, 440, 110, st.e ? 'on' : ''),
        el.box('al', 440, 50, 130, 90, 'ALU · ' + (f.aluFun === 'add' ? 'somma' : f.aluFun), st.e ? H(f.valE) : '·', o.alu ? 'att' : st.e ? 'on' : '', { cls: 'stretta' }),
        el.linea('f0', 570, 95, 600, 95, st.dest ? 'att' : ''), el.linea('f1', 600, 95, 600, 47, st.dest && mem ? 'att' : ''), el.linea('f2', 600, 47, 630, 47, st.dest && mem ? 'att' : ''), el.linea('f3', 600, 95, 600, 239, st.dest && !mem ? 'att' : ''), el.linea('f4', 600, 239, 630, 239, st.dest && !mem ? 'att' : ''),
        el.box('mi', 630, 14, 214, 66, 'memoria · Mem addr', st.dest ? (mem ? H(f.valE) : 'inattiva') : '·', !st.dest ? '' : mem ? (o.dest ? 'att' : 'on') : 'off', { cls: 'stretta' }),
        el.box('md', 630, 104, 214, 66, op === 'mr' ? 'memoria · valM' : 'memoria · Mem data', !st.dest ? '·' : op === 'rm' ? H(f.valA) : op === 'mr' ? H(0x55) : 'inattiva', !st.dest ? '' : mem ? (o.dest ? 'att' : 'on') : 'off', { cls: 'stretta' }),
        el.box('rw', 630, 206, 214, 66, op === 'mr' ? 'banco · porta M' : 'banco · porta E', !st.dest ? '·' : op === 'rm' ? 'nessuna scrittura' : (op === 'mr' ? 'RAX ← ' + H(0x55) : 'RAX ← ' + H(f.valE)), !st.dest ? '' : op === 'rm' ? 'off' : st.fronte ? 'att' : 'on', { cls: 'stretta' }),
        el.box('ck', 240, 196, 150, 50, 'clock', st.ck, o.fronte ? 'att' : '', { cls: 'stretta' })
      ];
      const hud = () => [['Istruzione', I.FORMA[op], 'a'], ['valE', st.e ? H(f.valE) : '·'], ['Destinazione', st.dest ? (mem ? 'memoria' : 'registro') : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      st.let = true;
      P({ letti: true }, 0, 'Prelievo e decodifica', 'Il prelievo riconosce la forma `' + I.FORMA[op] + '` dai byte ' + I.byteIst(i).slice(0, 2).map(I.esa2).join(' ') + (f.valC == null ? ', senza costante.' : ' e ricava valC = ' + H(f.valC) + '.') + ' La decodifica legge ' + (f.srcA && f.srcB ? 'due registri: valA = R[rax] = ' + H(f.valA) + ' e valB = R[rbx] = ' + H(f.valB) + '.' : f.srcB ? 'soltanto la base: valB = R[rbx] = ' + H(f.valB) + '.' : 'nessun registro: la forma `mov rB, V` impiega soltanto la costante.'),
        { calc: f.valC == null ? 'valA = ' + H(f.valA) + ' · valB = ' + H(f.valB) : 'valC = ' + H(f.valC), chiedi: { d: 'Quale valore selezionerà ALU A per questa istruzione?', o: ['valA', 'valC', '0'], g: ['valA', 'valC', '0'].indexOf(U.nomeA(op)), no: 'ALU A seleziona valA per le istruzioni aritmetiche e logiche, valC per le forme di `mov` con una costante, 0 per `mov rA, rB`.' } });
      st.mux = true;
      P({ mux: true }, 1, 'Gli ingressi dell’ALU', 'L’unità di controllo legge icode = ' + I.ICODE[I.classe(op)] + ' e imposta i due multiplexer: ALU A seleziona ' + U.nomeA(op) + ', che vale ' + H(f.aluA) + ', e ALU B seleziona ' + U.nomeB(op) + ', che vale ' + H(f.aluB) + '. ' + (op === 'rm' ? 'valA resta escluso dall’ALU: è il dato da scrivere.' : op === 'ir' ? 'Il secondo ingresso vale 0, poiché la costante deve soltanto transitare nell’ALU.' : op === 'mr' ? 'Il registro di destinazione, RAX, sarà soltanto scritto, e la decodifica lo esclude dalla lettura.' : 'L’ALU riceve i due registri.'), { calc: 'ALU A = ' + U.nomeA(op) + ' · ALU B = ' + U.nomeB(op) });
      st.e = true;
      P({ alu: true }, 2, 'Il risultato valE', 'ALU fun vale «' + (f.aluFun === 'add' ? 'somma' : f.aluFun) + '», e l’ALU calcola valE = ' + H(f.aluA) + ' + ' + H(f.aluB) + ' = ' + H(f.valE) + '. ' + (mem ? 'Il numero è un indirizzo: indica la parola della memoria dei dati sulla quale operare.' : op === 'ir' ? 'È la costante stessa, invariata.' : 'È il risultato dell’operazione.') + (op === 'add' ? ' ZF riceve ' + f.zf + '.' : ' ZF resta invariato, poiché soltanto le istruzioni aritmetiche e logiche lo aggiornano.'),
        { calc: 'valE = ' + H(f.valE), chiedi: { d: 'Verso quale destinazione è diretto valE?', o: ['L’ingresso degli indirizzi della memoria', 'La porta di scrittura E del banco'], g: mem ? 0 : 1, no: mem ? 'Negli accessi alla memoria valE è l’indirizzo, cioè il segnale Mem addr.' : 'Il risultato di questa istruzione è destinato a un registro, attraverso la porta E.' } });
      st.dest = true;
      P({ dest: true }, 3, 'La destinazione', op === 'rm' ? 'valE raggiunge Mem addr, e valA = ' + H(f.valA) + ' raggiunge Mem data. Mem write vale 1: la parola che ha inizio a ' + H(f.valE) + ' riceverà ' + H(f.valA) + '. Nessun registro è scritto, e dstE e dstM valgono F.' : op === 'mr' ? 'valE raggiunge Mem addr, e Mem read vale 1: la memoria fornisce la parola valM = ' + H(0x55) + ', che raggiunge la porta M del banco con dstM uguale al numero di RAX.' : 'valE raggiunge la porta di scrittura E del banco, con dstE uguale al numero di RAX. La memoria dei dati resta inattiva.', { calc: 'destinazione: ' + dest });
      st.fronte = true; st.ck = 'sale ↑';
      P({ fronte: true }, 4, 'Il fronte', 'Al fronte di salita lo stato si aggiorna: ' + (op === 'rm' ? 'la parola all’indirizzo ' + H(f.valE) + ' diviene ' + H(f.valA) + ', e RAX resta ' + H(p.v) + '.' : op === 'mr' ? 'RAX diviene ' + H(0x55) + ', e la memoria resta invariata.' : 'RAX diviene ' + H(f.valE) + (op === 'add' ? ' e ZF diviene ' + f.zf : '') + '.') + ' Il PC riceve valP in ogni caso. Il medesimo percorso dati ha servito l’istruzione con la sola scelta dei segnali di controllo.',
        { calc: op === 'rm' ? 'M8[' + H(f.valE) + '] = ' + H(f.valA) : op === 'mr' ? 'RAX = ' + H(0x55) : 'RAX = ' + H(f.valE), esito: ['valE = ' + H(f.valE), 'si'] });
      return { passi, esito: f.valE };
    }
  },
  bilancio: {
    regola: [
      'Due multiplexer, posti agli ingressi dell’ALU, selezionano gli operandi: ALU A sceglie valA, valC oppure 0, ALU B sceglie valB oppure 0. ALU fun è ifun per le istruzioni aritmetiche e logiche, e la somma per tutte le altre.',
      'Il risultato valE raggiunge la porta E del banco, oppure l’ingresso Mem addr della memoria negli accessi ai dati. In `mov D(rB), rA` il dato valA raggiunge Mem data senza attraversare l’ALU; in `mov rA, D(rB)` la parola letta, valM, raggiunge la porta M.'
    ],
    errori: [
      ['Trasmettere il dato all’ALU.', 'In `mov D(rB), rA` l’ALU calcola soltanto l’indirizzo. Il dato valA è trasmesso direttamente a Mem data.'],
      ['Ritenere che `mov rB, V` non impieghi l’ALU.', 'La costante attraversa l’ALU, che le somma zero, e giunge alla porta E come valE.'],
      ['Leggere il registro di destinazione di un caricamento.', 'In `mov rA, D(rB)` la decodifica legge soltanto la base rB. Il registro rA è soltanto scritto.']
    ],
    saFare: ['Indicare i valori selezionati da ALU A e da ALU B per ogni forma di istruzione.', 'Indicare le destinazioni di valE.', 'Seguire una lettura e una scrittura della memoria lungo il percorso dati.'],
    esercizi: [
      { d: 'Per `mov rax, rbx`, quali valori sono presenti ai due ingressi dell’ALU?', guida: 'Si scelga la risposta.', o: [
        { t: 'ALU A = 0 e ALU B = valB', ok: true, fb: 'Il valore di RBX transita nell’ALU, che gli somma zero, e raggiunge la porta E.' },
        { t: 'ALU A = valA e ALU B = valB', fb: 'Due registri entrano nell’ALU soltanto per le istruzioni aritmetiche e logiche.' },
        { t: 'ALU A = valC e ALU B = 0', fb: 'Questa è la scelta per `mov rB, V`, che contiene una costante. `mov rA, rB` non ne ha.' }] },
      { d: 'La CPU esegue `mov 16(rbx), rax` con RBX = 0x300 e RAX = 0x2B. A quale indirizzo è scritto il valore 0x2B? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x320', giuste: ['0x310', '310', '310h'],
        ok: 'valE = valB + valC = 0x300 + 16 = 0x310.',
        diagnosi: [
          { se: ['0x300', '300', '300h'], msg: 'Questa è la base. Va sommato lo spostamento, 16, cioè 0x10.' },
          { se: ['0x316', '316', '316h'], msg: 'Lo spostamento 16 è decimale, e in esadecimale vale 0x10.' },
          { se: ['0x2b', '2b', '2bh'], msg: 'Questo è il dato. La domanda riguarda l’indirizzo della parola in cui è scritto.' }
        ],
        altro: 'L’indirizzo è diverso. Si sommino la base e lo spostamento, in esadecimale.',
        indizi: ['ALU B = valB = 0x300.', 'ALU A = valC = 16 = 0x10.', '0x300 + 0x10.'],
        svolgimento: ['valB = 0x300, valC = 16 = 0x10.', 'valE = 0x300 + 0x10 = 0x310.', 'M8[0x310] = 0x2B.'] }
    ],
    sfida: ['cslez3_4_01_random_assembly', 'Ingressi dell’ALU e aggiornamento dello stack']
  }
});
SL.unita342 = {
  ist: (op) => ({ add: { n: 'add', a: 'rax', b: 'rbx' }, ir: { n: 'ir', b: 'rax', c: 291 }, mr: { n: 'mr', a: 'rax', b: 'rbx', c: 8 }, rm: { n: 'rm', a: 'rax', b: 'rbx', c: 8 } })[op],
  fasi: (p) => { const s = { R: { rax: p.v, rbx: p.b }, M: {}, zf: 1, pc: 0x40 }; s.M[p.b + 8] = 0x55; return SL.isa.fasi(SL.unita342.ist(p.op), s); },
  nomeA: (op) => (op === 'add' ? 'valA' : op === 'rr' ? '0' : 'valC'),
  nomeB: (op) => (op === 'ir' ? '0' : 'valB')
};
