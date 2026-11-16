'use strict';
SL.registra('3.3.1', {
  titolo: 'Dalla logica all’ISA',
  obiettivo: 'Obiettivo: indicare che cosa stabilisce una ISA, elencare lo stato della CPU del caso di studio e prevedere l’effetto di `mov`, `add` e `sub` su registri, ZF e contatore di programma.',
  concetti: [['file', 'Le regole fra programma e hardware'], ['register', 'Lo stato della CPU'], ['flag', 'Stato modificato e stato invariato']],
  filigrana: ['cpu', 'file', 'flag'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 2.1.1', t: 'Lo stato architetturale', d: 'L’insieme di ciò che un programma può leggere o modificare: registri, memoria, puntatore di istruzione e flag.' },
      { sim: 'file', da: 'Dall’unità 2.1.3', t: 'La sintassi Intel', d: 'La destinazione precede la sorgente: `add rbx, rax` somma RAX a RBX e scrive il risultato in RBX.' },
      { sim: 'riproduci', da: 'Dall’unità 3.2.3', t: 'Il banco di registri', d: 'Ogni registro è individuato da un numero. Le porte di lettura forniscono i valori, e la porta di scrittura li aggiorna al fronte.' }
    ],
    domanda: { d: 'Prima di proseguire: nel Modulo II, quale registro contiene l’indirizzo della prossima istruzione da eseguire?', o: [
      { t: 'Il puntatore di istruzione, RIP', ok: true, fb: 'Dopo ogni istruzione RIP avanza della sua lunghezza, salvo i salti.' },
      { t: 'Il puntatore alla pila, RSP', fb: 'RSP contiene l’indirizzo della cima della pila.' },
      { t: 'Il registro RAX', fb: 'RAX è un registro per i dati, e contiene il risultato delle funzioni.' }
    ] }
  },
  idea: {
    titolo: 'Una CPU ridotta, descritta per intero',
    termini: ['isa', 'cpu del caso di studio', 'contatore di programma', 'codice di stato'],
    testo: [
      'Il progetto di una CPU ha inizio dalla definizione delle istruzioni che essa esegue. Per ogni istruzione occorre stabilire la rappresentazione in bit e l’effetto sullo stato visibile al programma. L’insieme di tali regole prende il nome di [[isa|ISA]], dall’inglese instruction set architecture, e il linguaggio assembly del Modulo II ne è una rappresentazione testuale.',
      'La ISA x86-64 è troppo vasta per essere realizzata in poche unità. I capitoli dal 3.3 al 3.6 costruiscono pertanto la [[cpu del caso di studio|CPU del caso di studio]] della dispensa: una variante ridotta di Y86-64, il repertorio didattico di Bryant e O’Hallaron, scritta con gli operandi nell’ordine della sintassi Intel. Le istruzioni sono otto: `mov`, `add`, `sub`, `and`, `or`, `je`, `nop` e `halt`, e `mov` si presenta in quattro forme.',
      'Lo stato della CPU si compone di quindici registri da 64 bit, da RAX a R14, della memoria, del [[contatore di programma]], abbreviato PC, e del flag ZF. Il PC contiene l’indirizzo dell’istruzione da prelevare: è il puntatore di istruzione RIP del Modulo II, con un altro nome. Lo stato comprende infine un [[codice di stato]], che indica se l’esecuzione procede regolarmente.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Lo stato della CPU del caso di studio', nota: 'Ogni istruzione modifica soltanto alcune di queste parti. Le altre restano invariate.', els: [
        SL.el.box('s1', 0, 6, 160, 64, 'registri', '15 da 64 bit', 'on', { cls: 'stretta' }), SL.el.box('s2', 172, 6, 130, 64, 'memoria', 'byte', 'on', { cls: 'stretta' }),
        SL.el.box('s3', 314, 6, 120, 64, 'PC', 'indirizzo', 'att', { cls: 'stretta' }), SL.el.box('s4', 446, 6, 120, 64, 'flag', 'ZF', 'on', { cls: 'stretta' }), SL.el.box('s5', 578, 6, 142, 64, 'codice di stato', 'regolare', '', { cls: 'stretta' })
      ] },
      'Come nel Modulo II, il primo operando è la destinazione. `add rbx, rax` calcola RBX + RAX e scrive la somma in RBX. `sub rbx, rax` calcola RBX − RAX e la scrive in RBX. `mov rbx, rax` copia RAX in RBX. Le quattro istruzioni aritmetiche e logiche pongono ZF a 1 quando il risultato è zero, e a 0 negli altri casi; `mov` lascia ZF invariato.',
      'Le tre istruzioni dell’esempio occupano due byte, e dopo ciascuna il PC avanza di 2. Il resto dello stato resta invariato: RAX, la memoria, gli altri registri. Una descrizione completa di un’istruzione indica quindi anche le parti che essa non modifica.'
    ]
  },
  esperimento: {
    faremo: [
      'Lo stato iniziale è sempre il medesimo: due valori in RAX e in RBX, ZF lasciato a 1 da un’istruzione precedente, il PC a 0x40. I controlli fissano l’istruzione e i due valori.',
      'Si osserva che cosa l’istruzione legge, che cosa scrive e che cosa lascia invariato. Dopo il caso proposto, è istruttivo selezionare `mov` e osservare ZF, quindi selezionare `sub` e verificare l’ordine degli operandi.'
    ],
    vedrai: [
      ['file', 'L’istruzione', 'In alto: il testo dell’istruzione e i suoi due byte.'],
      ['register', 'I registri', 'Al centro: RAX, RBX e il contatore di programma.'],
      ['flag', 'Il flag', 'A destra: ZF, prima e dopo l’istruzione.']
    ]
  },
  lab: {
    titolo: 'Tre istruzioni sul medesimo stato',
    scena: { w: 860, h: 290 },
    atti: ['Lo stato iniziale', 'Che cosa legge', 'Che cosa scrive', 'Il flag ZF', 'Il contatore di programma'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione', opzioni: [['add', 'add rbx, rax'], ['sub', 'sub rbx, rax'], ['rr', 'mov rbx, rax']], valore: 'add' },
      { id: 'a', tipo: 'scelta', eti: 'RAX', opzioni: [[7, '7'], [-3, '−3'], [100, '100']], valore: 7 },
      { id: 'b', tipo: 'scelta', eti: 'RBX', opzioni: [[-7, '−7'], [5, '5'], [100, '100']], valore: -7 }
    ],
    nota: 'I passi sono sempre cinque. All’inizio ZF vale 1 e il PC vale 0x40.',
    previsione: {
      domanda: (p) => 'Lo stato iniziale è RAX = ' + SL.isa.num(p.a) + ' e RBX = ' + SL.isa.num(p.b) + '. La CPU esegue `' + SL.isa.testo({ n: p.op, a: 'rbx', b: 'rax' }) + '`. Quanto vale RBX al termine?',
      opzioni: (p) => Array.from(new Set([p.a, p.b, p.a + p.b, p.b - p.a, p.a - p.b])).sort((x, y) => x - y).map((v) => [v, SL.isa.num(v)])
    },
    confronto: (pred, esito, p) => { const N = SL.isa.num, PA = (v) => (v < 0 ? '(' + N(v) + ')' : N(v)); return 'La previsione indicava ' + N(pred) + '. Al termine RBX vale ' + N(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.op === 'rr' ? '`mov rbx, rax` copia il secondo operando, RAX, nel primo, RBX.' : p.op === 'add' ? '`add rbx, rax` somma RAX a RBX: ' + N(p.b) + ' + ' + PA(p.a) + '.' : '`sub rbx, rax` sottrae il secondo operando dal primo: RBX − RAX, cioè ' + N(p.b) + ' − ' + PA(p.a) + '.'); },
    costruisci(p) {
      const el = SL.el, I = SL.isa, N = I.num, passi = [], ist = { n: p.op, a: 'rbx', b: 'rax' }, byte = I.byteIst(ist).map(I.esa2).join(' ');
      const arit = p.op !== 'rr', s0 = { R: { rax: p.a, rbx: p.b }, M: {}, zf: 1, pc: 0x40 }, f = I.fasi(ist, s0), r = f.valE, PA = (v) => (v < 0 ? '(' + N(v) + ')' : N(v));
      const st = { rbx: p.b, zf: 1, pc: 0x40 };
      const quadro = (o) => [
        el.box('i', 20, 8, 400, 66, 'istruzione all’indirizzo 0x40', I.testo(ist), 'on', { cls: 'stretta' }), el.box('by', 440, 8, 200, 66, 'i suoi byte', byte, o.pc ? 'att' : '', { cls: 'stretta' }),
        el.box('rb', 20, 100, 200, 76, 'RBX · destinazione', N(st.rbx), o.leggiB || o.scrivi ? 'att' : 'on', { cls: 'stretta' }),
        el.box('ra', 240, 100, 200, 76, 'RAX · secondo operando', N(p.a), o.leggiA ? 'att' : 'on', { cls: 'stretta' }),
        el.box('pc', 20, 200, 200, 76, 'PC', I.esa(st.pc), o.pc ? 'att' : 'on', { cls: 'stretta' }),
        el.box('al', 240, 200, 200, 76, arit ? 'ALU' : 'copia', o.calc ? (arit ? N(p.b) + (p.op === 'add' ? ' + ' : ' − ') + PA(p.a) : N(p.a)) : '·', o.calc ? 'att' : '', { cls: 'stretta' }),
        el.box('zf', 480, 100, 160, 76, 'ZF', String(st.zf), o.zf && arit ? 'att' : st.zf ? 'on' : '', { cls: 'stretta' }),
        el.nota('tn', 480, 222, o.fine ? 'invariati: RAX, memoria, altri registri' : '', 'mono minuta')
      ];
      const hud = () => [['PC', I.esa(st.pc), 'a'], ['RBX', N(st.rbx), 'c'], ['ZF', String(st.zf)]];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Lo stato di partenza', 'Il PC vale 0x40, e a quell’indirizzo si trova l’istruzione `' + I.testo(ist) + '`. I registri contengono RAX = ' + N(p.a) + ' e RBX = ' + N(p.b) + '. ZF, lasciato da un’istruzione precedente, vale 1.',
        { chiedi: { d: 'In `' + I.testo(ist) + '`, quale registro riceverà il risultato?', o: ['RAX', 'RBX'], g: 1, no: 'Nella CPU del caso di studio, come nella sintassi Intel, il primo operando è la destinazione.' } });
      P({ leggiA: true, leggiB: arit, calc: true }, 1, arit ? 'Legge due registri' : 'Legge un registro', arit ? 'L’istruzione legge entrambi i registri: RBX, che vale ' + N(p.b) + ', e RAX, che vale ' + N(p.a) + '. L’ALU calcola ' + (p.op === 'add' ? 'RBX + RAX' : 'RBX − RAX') + ' = ' + N(p.b) + (p.op === 'add' ? ' + ' : ' − ') + PA(p.a) + ' = ' + N(r) + '.' : 'L’istruzione legge soltanto il secondo operando, RAX, che vale ' + N(p.a) + '. Il contenuto precedente di RBX è irrilevante.', { calc: arit ? N(p.b) + (p.op === 'add' ? ' + ' : ' − ') + PA(p.a) + ' = ' + N(r) : 'valore da copiare: ' + N(p.a) });
      st.rbx = r;
      P({ scrivi: true, calc: true }, 2, 'Scrive la destinazione', 'Il risultato, ' + N(r) + ', è scritto in RBX, e il valore precedente ' + N(p.b) + ' è perduto. RAX resta ' + N(p.a) + ': il secondo operando è soltanto letto.',
        { calc: 'RBX = ' + N(r), chiedi: { d: arit ? 'Il risultato vale ' + N(r) + '. Quanto varrà ZF?' : '`mov` è una copia. Quale effetto ha su ZF?', o: arit ? ['0', '1'] : ['ZF resta invariato', 'ZF è azzerato'], g: arit ? f.zf : 0, no: arit ? 'ZF vale 1 soltanto quando il risultato è zero.' : 'Soltanto le istruzioni aritmetiche e logiche scrivono ZF.' } });
      st.zf = f.zf;
      P({ zf: true }, 3, arit ? 'L’aggiornamento di ZF' : 'ZF invariato', arit ? 'Il risultato ' + N(r) + (f.zf ? ' è zero, quindi ZF passa a 1.' : ' è diverso da zero, quindi ZF passa a 0.') + ' ZF è il solo flag della CPU del caso di studio, e quindi il solo dato che un salto successivo potrà esaminare.' : '`mov` è una copia, e ZF resta 1. Un `je` eseguito subito dopo esaminerebbe ancora il risultato dell’ultima istruzione aritmetica o logica.',
        { calc: 'ZF = ' + st.zf, chiedi: { d: 'L’istruzione occupa due byte, e il PC vale 0x40. Quanto varrà il PC al termine?', o: ['0x41', '0x42', '0x4A'], g: 1, no: 'Il PC avanza della lunghezza dell’istruzione: 0x40 + 2 = 0x42.' } });
      st.pc = f.pcNuovo;
      P({ pc: true, fine: true }, 4, 'L’avanzamento del PC', 'L’istruzione occupa due byte, ' + byte + ', quindi il PC passa da 0x40 a 0x42, dove ha inizio l’istruzione successiva. ' + (() => { const cambi = [r !== p.b ? 'RBX' : null, st.zf !== 1 ? 'ZF' : null, 'il PC'].filter(Boolean); return 'Lo stato finale differisce da quello iniziale ' + (cambi.length === 1 ? 'soltanto nel PC' : 'in ' + (cambi.length === 2 ? 'due' : 'tre') + ' punti: ' + cambi.slice(0, -1).join(', ') + ' e ' + cambi[cambi.length - 1]) + '.' + (r === p.b ? ' RBX riceve un valore uguale a quello che conteneva.' : '') + (arit && st.zf === 1 ? ' ZF valeva già 1.' : ''); })() + ' Ogni altra parte è rimasta invariata.',
        { calc: 'PC = 0x40 + 2 = 0x42', esito: ['RBX = ' + N(r), 'si'] });
      return { passi, esito: r };
    }
  },
  bilancio: {
    regola: [
      'Una ISA stabilisce, per ogni istruzione, la rappresentazione in bit e l’effetto sullo stato. Lo stato della CPU del caso di studio comprende quindici registri, la memoria, il PC, il flag ZF e un codice di stato.',
      'Il primo operando è la destinazione. `mov` copia il secondo operando nel primo e lascia invariato ZF. `add` e `sub` scrivono il risultato nel primo operando e aggiornano ZF; `sub rbx, rax` calcola RBX − RAX.'
    ],
    errori: [
      ['Leggere gli operandi nell’ordine della sorgente seguita dalla destinazione.', 'In `add rbx, rax` la destinazione è RBX, l’operando di sinistra.'],
      ['Attendersi che ogni istruzione modifichi ZF.', 'Le copie come `mov` lasciano ZF invariato.'],
      ['Trascurare il PC.', 'Anche il PC fa parte dello stato, e ogni istruzione lo modifica: in questo caso avanza di due byte.']
    ],
    saFare: ['Elencare le parti dello stato della CPU del caso di studio.', 'Individuare la destinazione e il secondo operando di un’istruzione.', 'Prevedere registri, ZF e PC dopo `mov`, `add` e `sub`.'],
    esercizi: [
      { d: 'Il registro RAX vale 5 e RBX vale 12. Dopo `sub rbx, rax`, quanto vale RBX?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: '`sub rbx, rax` calcola RBX − RAX: 12 − 5 = 7.',
        diagnosi: [
          { se: ['-7', '−7'], msg: 'È stato calcolato RAX − RBX. La CPU sottrae il secondo operando dal primo: RBX − RAX.' },
          { se: ['17', 'diciassette'], msg: 'Questa è la somma. `sub` calcola una differenza.' },
          { se: ['5', 'cinque'], msg: 'Questo è il valore di RAX, che resta invariato. La domanda riguarda RBX.' }
        ],
        altro: 'Il numero è diverso. La destinazione è l’operando di sinistra, e da essa si sottrae il secondo operando.',
        indizi: ['La destinazione è RBX, il secondo operando è RAX.', '`sub` calcola il primo operando meno il secondo.', '12 − 5.'],
        svolgimento: ['Destinazione: RBX = 12. Secondo operando: RAX = 5.', 'RBX − RAX = 12 − 5 = 7.', 'RBX = 7, e ZF = 0.'] },
      { d: 'Quale di queste istruzioni lascia invariato ZF?', guida: 'Si scelga la risposta.', o: [
        { t: 'mov rbx, rax', ok: true, fb: 'È una copia fra registri, e le copie lasciano invariato ZF.' },
        { t: 'add rbx, rax', fb: 'Le istruzioni aritmetiche aggiornano ZF secondo il risultato.' },
        { t: 'sub rbx, rax', fb: 'Anche la differenza è calcolata dall’ALU, che aggiorna ZF.' }] }
    ],
    sfida: ['cslez3_3_04_random_assembly', 'Operazioni Y86-64 e codici di condizione']
  }
});
