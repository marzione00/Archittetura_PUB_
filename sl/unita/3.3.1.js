'use strict';
SL.registra('3.3.1', {
  titolo: 'Dalla logica al contratto dell’ISA',
  obiettivo: 'Obiettivo: indicare che cosa stabilisce una ISA, elencare lo stato visibile della macchina Y86-64 e prevedere l’effetto di `rrmovq`, `addq` e `subq` su registri, codici di condizione e contatore di programma.',
  concetti: [['file', 'Un contratto fra programma e hardware'], ['register', 'Lo stato visibile'], ['flag', 'Stato modificato e stato invariato']],
  filigrana: ['cpu', 'file', 'flag'],
  richiami: {
    carte: [
      { sim: 'register', da: 'Dall’unità 2.1.1', t: 'Lo stato architetturale', d: 'L’insieme di ciò che un programma può leggere o modificare: registri, memoria, puntatore di istruzione e flag.' },
      { sim: 'cpu', da: 'Dall’unità 2.1.4', t: 'Architettura e implementazione', d: 'Le istruzioni stabiliscono i risultati. I circuiti che le realizzano determinano soltanto i tempi.' },
      { sim: 'riproduci', da: 'Dall’unità 3.2.5', t: 'Il processore come macchina a stati', d: 'A ogni ciclo una rete combinatoria calcola lo stato successivo, e i registri lo catturano al fronte.' }
    ],
    domanda: { d: 'Prima di proseguire: nel Modulo II, quale registro contiene l’indirizzo della prossima istruzione da eseguire?', o: [
      { t: 'Il puntatore di istruzione, RIP', ok: true, fb: 'Dopo ogni istruzione RIP avanza della sua lunghezza, salvo i salti.' },
      { t: 'Il puntatore alla pila, RSP', fb: 'RSP contiene l’indirizzo della cima della pila.' },
      { t: 'Il registro RAX', fb: 'RAX è un registro per i dati, e contiene il risultato delle funzioni.' }
    ] }
  },
  idea: {
    titolo: 'Una macchina ridotta, descritta per intero',
    termini: ['isa', 'y86-64', 'contatore di programma', 'codici di condizione', 'codice di stato'],
    testo: [
      'I Moduli I e II hanno descritto il processore dal punto di vista del programmatore: registri, memoria, istruzioni, flag. L’insieme delle regole che stabiliscono l’effetto di ogni istruzione sullo stato visibile al programma prende il nome di [[isa|ISA]], dall’inglese Instruction Set Architecture. Essa ha la natura di un contratto: il programmatore conosce il comportamento atteso, e il progettista dell’hardware conosce ciò che deve garantire.',
      'I capitoli successivi costruiscono un circuito che rispetta un contratto di questo tipo. La ISA x86-64 è troppo vasta per essere trattata in poche unità, e si impiega pertanto una versione ridotta, concepita per la didattica: [[y86-64|Y86-64]]. I registri hanno i medesimi nomi, e le istruzioni sono poche e regolari.',
      'Lo stato visibile di Y86-64 si compone di cinque parti. La prima è costituita da quindici registri da 64 bit, da %rax a %r14. La seconda è la memoria. La terza è il [[contatore di programma]], abbreviato PC, che contiene l’indirizzo dell’istruzione da prelevare: è il puntatore di istruzione del Modulo II, con un altro nome. La quarta è costituita da tre flag, ZF, SF e OF, detti [[codici di condizione]]. La quinta è un [[codice di stato]], che indica se il programma procede regolarmente.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Lo stato visibile di Y86-64', nota: 'Ogni istruzione dichiara quali di queste parti modifica. Le altre restano invariate.', els: [
        SL.el.box('s1', 0, 6, 150, 64, 'registri', '15 da 64 bit', 'on', { cls: 'stretta' }), SL.el.box('s2', 160, 6, 120, 64, 'memoria', 'byte', 'on', { cls: 'stretta' }),
        SL.el.box('s3', 290, 6, 110, 64, 'PC', 'indirizzo', 'att', { cls: 'stretta' }), SL.el.box('s4', 410, 6, 170, 64, 'codici di condizione', 'ZF SF OF', 'on', { cls: 'stretta' }), SL.el.box('s5', 590, 6, 130, 64, 'codice di stato', 'Stat', '', { cls: 'stretta' })
      ] },
      'Le istruzioni di Y86-64 si scrivono con una convenzione diversa da quella del Modulo II. I nomi dei registri sono preceduti dal segno %, e l’ordine degli operandi è invertito: prima la sorgente, poi la destinazione. `addq %rax, %rbx` somma %rax a %rbx e scrive il risultato in %rbx. Nella sintassi Intel la medesima operazione si scriveva `add rbx, rax`.',
      'Ogni istruzione dichiara tutto ciò che modifica. `rrmovq %rax, %rbx` copia %rax in %rbx e lascia invariati i codici di condizione. `addq %rax, %rbx` scrive la somma in %rbx e aggiorna ZF, SF e OF. `subq %rax, %rbx` opera allo stesso modo con la differenza %rbx − %rax. Tutte e tre occupano due byte, quindi dopo ciascuna il PC avanza di 2. Il resto dello stato resta invariato, e anche tale invarianza fa parte del contratto.'
    ]
  },
  esperimento: {
    faremo: [
      'Lo stato iniziale è sempre il medesimo: due valori in %rax e in %rbx, i codici di condizione lasciati da un’istruzione precedente, il PC a 0x40. I controlli fissano l’istruzione e i due valori.',
      'Si osserva che cosa l’istruzione legge, che cosa scrive e che cosa lascia invariato. Dopo il caso proposto, è istruttivo selezionare `rrmovq` e osservare i codici di condizione, poi selezionare `subq` e verificare l’ordine degli operandi.'
    ],
    vedrai: [
      ['file', 'L’istruzione', 'In alto: il testo dell’istruzione e i suoi due byte.'],
      ['register', 'I registri', 'Al centro: %rax, %rbx e il contatore di programma.'],
      ['flag', 'I codici di condizione', 'A destra: ZF, SF e OF.']
    ]
  },
  lab: {
    titolo: 'Tre istruzioni sul medesimo stato',
    scena: { w: 860, h: 290 },
    atti: ['Lo stato iniziale', 'Che cosa legge', 'Che cosa scrive', 'I codici di condizione', 'Il contatore di programma'],
    controlli: [
      { id: 'op', tipo: 'scelta', eti: 'Istruzione', opzioni: [['addq', 'addq %rax, %rbx'], ['subq', 'subq %rax, %rbx'], ['rrmovq', 'rrmovq %rax, %rbx']], valore: 'addq' },
      { id: 'a', tipo: 'scelta', eti: '%rax', opzioni: [[7, '7'], [-3, '−3'], [100, '100']], valore: 7 },
      { id: 'b', tipo: 'scelta', eti: '%rbx', opzioni: [[-7, '−7'], [5, '5'], [100, '100']], valore: -7 }
    ],
    nota: 'I passi sono sempre cinque. All’inizio ZF = 0, SF = 1 e OF = 0, e il PC vale 0x40.',
    previsione: {
      domanda: (p) => 'Lo stato iniziale è %rax = ' + SL.x86.num(p.a) + ' e %rbx = ' + SL.x86.num(p.b) + '. La macchina esegue `' + p.op + ' %rax, %rbx`. Quanto vale %rbx al termine?',
      opzioni: (p) => Array.from(new Set([p.a, p.b, p.a + p.b, p.b - p.a, p.a - p.b])).sort((x, y) => x - y).map((v) => [v, SL.x86.num(v)])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + SL.x86.num(pred) + '. Al termine %rbx vale ' + SL.x86.num(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.op === 'rrmovq' ? '`rrmovq` copia la sorgente, %rax, nella destinazione, %rbx.' : p.op === 'addq' ? '`addq` somma la sorgente alla destinazione: ' + SL.x86.num(p.b) + ' + ' + (p.a < 0 ? '(' + SL.x86.num(p.a) + ')' : p.a) + '.' : '`subq %rax, %rbx` sottrae la sorgente dalla destinazione: %rbx − %rax, cioè ' + SL.x86.num(p.b) + ' − ' + (p.a < 0 ? '(' + SL.x86.num(p.a) + ')' : p.a) + '.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, Y = SL.y86, N = X.num, passi = [], ist = { n: p.op, a: 'rax', b: 'rbx' }, byte = Y.byteIst(ist).map(Y.esa2).join(' ');
      const r = p.op === 'rrmovq' ? p.a : p.op === 'addq' ? p.b + p.a : p.b - p.a, arit = p.op !== 'rrmovq', PA = (v) => (v < 0 ? '(' + N(v) + ')' : N(v));
      const st = { rbx: p.b, cc: { ZF: 0, SF: 1, OF: 0 }, pc: 0x40 };
      const quadro = (o) => {
        const els = [el.box('i', 20, 8, 400, 66, 'istruzione all’indirizzo 0x40', Y.testo(ist), 'on', { cls: 'stretta' }), el.box('by', 440, 8, 200, 66, 'i suoi byte', byte, o.pc ? 'att' : '', { cls: 'stretta' }),
          el.box('ra', 20, 100, 200, 76, '%rax · sorgente', N(p.a), o.leggiA ? 'att' : 'on', { cls: 'stretta' }),
          el.box('rb', 240, 100, 200, 76, '%rbx · destinazione', N(st.rbx), o.leggiB || o.scrivi ? 'att' : 'on', { cls: 'stretta' }),
          el.box('pc', 20, 200, 200, 76, 'PC', Y.esa(st.pc), o.pc ? 'att' : 'on', { cls: 'stretta' }),
          el.box('al', 240, 200, 200, 76, arit ? 'ALU' : 'copia', o.calc ? (arit ? N(p.b) + (p.op === 'addq' ? ' + ' : ' − ') + PA(p.a) : N(p.a)) : '·', o.calc ? 'att' : '', { cls: 'stretta' }),
          el.nota('tc', 480, 100, 'CODICI DI CONDIZIONE', 'mono', o.cc ? 'att' : '')];
        X.flag('f', st.cc, { x: 480, y: 126, passo: 122, h: 76, att: o.cc && arit ? ['ZF', 'SF', 'OF'] : [] }).forEach((e) => els.push(e));
        els.push(el.nota('tn', 480, 222, o.fine ? 'invariati: %rax, memoria, altri registri' : '', 'mono minuta'));
        return els;
      };
      const hud = () => [['PC', Y.esa(st.pc), 'a'], ['%rbx', N(st.rbx), 'c'], ['ZF SF OF', st.cc.ZF + ' ' + st.cc.SF + ' ' + st.cc.OF]];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Lo stato di partenza', 'Il PC vale 0x40, e a quell’indirizzo si trova l’istruzione `' + Y.testo(ist) + '`. I registri contengono %rax = ' + N(p.a) + ' e %rbx = ' + N(p.b) + '. I codici di condizione, lasciati da un’istruzione precedente, valgono ZF = 0, SF = 1 e OF = 0.',
        { chiedi: { d: 'In `' + Y.testo(ist) + '`, quale registro riceverà il risultato?', o: ['%rax', '%rbx'], g: 1, no: 'In Y86-64 la sorgente si scrive per prima e la destinazione per seconda.' } });
      P({ leggiA: true, leggiB: arit, calc: true }, 1, arit ? 'Legge due registri' : 'Legge un registro', arit ? 'L’istruzione legge entrambi i registri: la sorgente %rax, che vale ' + N(p.a) + ', e la destinazione %rbx, che vale ' + N(p.b) + '. L’ALU calcola ' + (p.op === 'addq' ? '%rbx + %rax' : '%rbx − %rax') + ' = ' + N(p.b) + (p.op === 'addq' ? ' + ' : ' − ') + PA(p.a) + ' = ' + N(r) + '.' : 'L’istruzione legge soltanto la sorgente %rax, che vale ' + N(p.a) + '. Il contenuto precedente di %rbx è irrilevante per l’istruzione.', { calc: arit ? N(p.b) + (p.op === 'addq' ? ' + ' : ' − ') + PA(p.a) + ' = ' + N(r) : 'valore da copiare: ' + N(p.a) });
      st.rbx = r;
      const zf = r === 0 ? 1 : 0, sf = r < 0 ? 1 : 0;
      P({ scrivi: true, calc: true }, 2, 'Scrive la destinazione', 'Il risultato, ' + N(r) + ', è scritto in %rbx. Il valore precedente ' + N(p.b) + ' è perduto. %rax resta ' + N(p.a) + ': la sorgente è soltanto letta.',
        { calc: '%rbx = ' + N(r), chiedi: { d: arit ? 'Il risultato vale ' + N(r) + '. Quanto varrà ZF?' : '`rrmovq` è una copia. Quale effetto ha sui codici di condizione?', o: arit ? ['0', '1'] : ['Restano invariati', 'Sono azzerati'], g: arit ? zf : 0, no: arit ? 'ZF vale 1 soltanto quando il risultato è zero.' : 'Soltanto le istruzioni aritmetiche e logiche scrivono i codici di condizione.' } });
      if (arit) st.cc = { ZF: zf, SF: sf, OF: 0 };
      P({ cc: true }, 3, arit ? 'Aggiornamento dei codici di condizione' : 'Codici di condizione invariati', arit ? 'Il risultato ' + N(r) + (zf ? ' è zero, quindi ZF = 1.' : ' è diverso da zero, quindi ZF = 0.') + (sf ? ' È negativo, quindi SF = 1.' : ' Il suo bit di segno vale 0, quindi SF = 0.') + ' Con valori di questa entità il risultato è rappresentabile in 64 bit, e OF = 0.' : '`rrmovq` è una copia e i codici di condizione restano invariati: ZF = 0, SF = 1, OF = 0. Un salto condizionato eseguito immediatamente dopo considererebbe ancora il risultato dell’istruzione precedente.',
        { calc: 'ZF = ' + st.cc.ZF + ' · SF = ' + st.cc.SF + ' · OF = ' + st.cc.OF, chiedi: { d: 'L’istruzione occupa due byte, e il PC vale 0x40. Quanto varrà il PC al termine?', o: ['0x41', '0x42', '0x48'], g: 1, no: 'Il PC avanza della lunghezza dell’istruzione: 0x40 + 2 = 0x42.' } });
      st.pc = 0x42;
      P({ pc: true, fine: true }, 4, 'L’avanzamento del PC', 'L’istruzione occupa due byte, ' + byte + ', quindi il PC passa da 0x40 a 0x42, dove ha inizio l’istruzione successiva. Lo stato finale differisce da quello iniziale in ' + (arit ? 'tre punti: %rbx, i codici di condizione e il PC.' : 'due punti: %rbx e il PC.') + ' Ogni altra parte è rimasta invariata.',
        { calc: 'PC = 0x40 + 2 = 0x42', esito: ['%rbx = ' + N(r), 'si'] });
      return { passi, esito: r };
    }
  },
  bilancio: {
    regola: [
      'Una ISA stabilisce, per ogni istruzione, quali parti dello stato visibile cambiano e come. Lo stato di Y86-64 comprende quindici registri, la memoria, il PC, i codici di condizione ZF, SF e OF, e un codice di stato.',
      'In Y86-64 la sorgente precede la destinazione. `rrmovq` copia e lascia invariati i codici di condizione. `addq` e `subq` scrivono il risultato nella destinazione e li aggiornano, e `subq %rax, %rbx` calcola %rbx − %rax.'
    ],
    errori: [
      ['Leggere gli operandi nell’ordine del Modulo II.', 'In `addq %rax, %rbx` la destinazione è %rbx, l’operando di destra.'],
      ['Attendersi che ogni istruzione modifichi i flag.', 'Le copie come `rrmovq` lasciano invariati i codici di condizione.'],
      ['Trascurare il PC.', 'Anche il PC fa parte dello stato, e ogni istruzione lo modifica: in questo caso avanza di due byte.']
    ],
    saFare: ['Elencare le parti dello stato visibile di Y86-64.', 'Leggere un’istruzione Y86-64 individuando sorgente e destinazione.', 'Prevedere registri, codici di condizione e PC dopo `rrmovq`, `addq` e `subq`.'],
    esercizi: [
      { d: 'Il registro %rax vale 5 e %rbx vale 12. Dopo `subq %rax, %rbx`, quanto vale %rbx?', segnaposto: 'Un numero', giuste: ['7', 'sette'],
        ok: '`subq %rax, %rbx` calcola %rbx − %rax: 12 − 5 = 7.',
        diagnosi: [
          { se: ['-7', '−7'], msg: 'È stato calcolato %rax − %rbx. In Y86-64 la sorgente è sottratta dalla destinazione: %rbx − %rax.' },
          { se: ['17', 'diciassette'], msg: 'Questa è la somma. `subq` calcola una differenza.' },
          { se: ['5', 'cinque'], msg: 'Questo è il valore di %rax, che resta invariato. La domanda riguarda %rbx.' }
        ],
        altro: 'Il numero è diverso. La destinazione è l’operando di destra, e da essa si sottrae la sorgente.',
        indizi: ['La sorgente è %rax, la destinazione è %rbx.', '`subq` calcola destinazione meno sorgente.', '12 − 5.'],
        svolgimento: ['Sorgente: %rax = 5. Destinazione: %rbx = 12.', '%rbx − %rax = 12 − 5 = 7.', '%rbx = 7, e ZF = 0, SF = 0.'] },
      { d: 'Quale di queste istruzioni lascia invariati i codici di condizione?', guida: 'Si scelga la risposta.', o: [
        { t: 'rrmovq %rax, %rbx', ok: true, fb: 'È una copia fra registri, e le copie lasciano invariati ZF, SF e OF.' },
        { t: 'addq %rax, %rbx', fb: 'Le istruzioni aritmetiche aggiornano i tre codici di condizione secondo il risultato.' },
        { t: 'subq %rax, %rbx', fb: 'Anche la differenza è calcolata dall’ALU, che aggiorna i codici di condizione.' }] }
    ],
    sfida: ['cslez3_3_04_random_assembly', 'Operazioni Y86-64 e codici di condizione']
  }
});
