'use strict';
SL.unita362 = (() => {
  const H = SL.isa.esa;
  // Istruzione completata nel ciclo precedente: pIcode, pCnd, pValC, pValP.
  const PREC = {
    op: { testo: 'add rax, rbx', icode: 6, cnd: null, lung: 2, valC: null },
    mr: { testo: 'mov rax, 8(rbx)', icode: 4, cnd: null, lung: 10, valC: 8 },
    je1: { testo: 'je 0x100', icode: 7, cnd: 1, lung: 9, valC: 0x100 },
    je0: { testo: 'je 0x100', icode: 7, cnd: 0, lung: 9, valC: 0x100 }
  };
  const GRUPPI = [0x40, 0x1F0];
  const valori = (k, g) => { const x = PREC[k], pc = GRUPPI[g]; return { pIcode: x.icode, pCnd: x.cnd, pValC: x.valC, pValP: pc + x.lung, pc }; };
  const scelta = (k, g) => { const v = valori(k, g); return v.pIcode === 7 && v.pCnd === 1 ? v.pValC : v.pValP; };
  return { H, PREC, GRUPPI, valori, scelta };
})();
SL.registra('3.6.2', {
  titolo: 'Il calcolo del PC nella pipeline',
  obiettivo: 'Obiettivo: spiegare perché il calcolo del PC è spostato prima del prelievo, e ricavare l’indirizzo del prelievo dai segnali pIcode, pCnd, pValC e pValP dell’istruzione precedente.',
  concetti: [['puntatore', 'Un indirizzo a ogni ciclo'], ['mux', 'La selezione del PC'], ['register', 'I valori del ciclo precedente']],
  filigrana: ['puntatore', 'mux', 'register'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 3.3.5', t: 'L’aggiornamento del PC', d: 'Il PC riceve valP per tutte le istruzioni, salvo `je` con Cnd = 1, per il quale riceve valC.' },
      { sim: 'register', da: 'Dall’unità 3.6.1', t: 'I registri di pipeline', d: 'A ogni fronte ogni registro cattura i dati preparati dallo stadio precedente.' },
      { sim: 'mux', da: 'Dall’unità 3.1.2', t: 'Il multiplexer', d: 'Copia sull’uscita uno dei suoi ingressi, selezionato da un segnale di controllo.' }
    ],
    domanda: { d: 'Prima di proseguire: un `je 0x100` occupa 9 byte e ha inizio all’indirizzo 0x40. ZF vale 0. Quale indirizzo riceve il PC?', o: [
      { t: '0x49', ok: true, fb: 'Con ZF = 0 si ha Cnd = 0, e il PC riceve valP = 0x40 + 9 = 0x49.' },
      { t: '0x100', fb: 'La destinazione è scelta soltanto con Cnd = 1, cioè con ZF = 1.' },
      { t: '0x4A', fb: '`je` è privo del byte dei registri, e occupa 9 byte.' }
    ] }
  },
  idea: {
    titolo: 'Il PC calcolato all’inizio del ciclo',
    termini: ['selezione del pc'],
    testo: [
      'Nella CPU a ciclo singolo l’aggiornamento del PC è l’ultima fase: assegna PC ← valP per tutte le istruzioni, salvo `je`, per il quale sceglie fra la destinazione e valP secondo Cnd. In una pipeline ciò avviene troppo tardi, poiché a ogni ciclo deve essere prelevata un’istruzione nuova, e il suo indirizzo deve essere noto all’inizio del ciclo.',
      'La modifica consiste nello spostare il blocco che calcola il nuovo PC prima della fase di prelievo. Il blocco calcola il PC in base alle informazioni prodotte nel ciclo di clock precedente, conservate in registri dedicati. Per questa ragione i nomi dei suoi segnali hanno il prefisso «p», da previous: `pIcode`, `pCnd`, `pValC` e `pValP`. Il blocco prende il nome di [[selezione del pc|selezione del PC]].',
      { fig: 'scena', w: 720, h: 150, titolo: 'La selezione del PC prima del prelievo', nota: 'Il calcolo è il medesimo della CPU a ciclo singolo, e la sua posizione si sposta dalla fine di un’istruzione all’inizio della successiva.', els: [
        SL.el.box('g1', 0, 6, 150, 56, 'pIcode', 'categoria', 'on', { cls: 'stretta' }), SL.el.box('g2', 0, 76, 150, 56, 'pCnd', 'esito di je', 'on', { cls: 'stretta' }),
        SL.el.box('g3', 170, 6, 150, 56, 'pValC', 'destinazione', 'on', { cls: 'stretta' }), SL.el.box('g4', 170, 76, 150, 56, 'pValP', 'successore', 'on', { cls: 'stretta' }),
        SL.el.linea('gl1', 320, 34, 380, 70, 'on'), SL.el.linea('gl2', 320, 104, 380, 70, 'on'),
        SL.el.box('g5', 380, 36, 160, 68, 'selezione del PC', 'PC', 'att', { cls: 'stretta' }), SL.el.linea('gl3', 540, 70, 580, 70, 'att'),
        SL.el.box('g6', 580, 36, 140, 68, 'stadio F', 'prelievo', 'on', { cls: 'stretta' })
      ] },
      'La regola è quella della fase di aggiornamento del PC, espressa con i nuovi segnali: se pIcode è la categoria di `je` e pCnd vale 1, il PC riceve pValC; in tutti gli altri casi riceve pValP. Dopo questa modifica le fasi divengono cinque: il prelievo, che comprende ora la selezione del PC, la decodifica, l’esecuzione, la memoria e la scrittura.',
      'Nella pipeline vera e propria l’istruzione precedente non è ancora completata quando ha inizio il prelievo della successiva. Per questa ragione il registro F contiene un PC il cui valore è previsto. Il trattamento delle previsioni errate esula da questo capitolo, che considera programmi nei quali l’ordine delle istruzioni è noto.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento osserva la selezione del PC all’inizio di un ciclo. L’istruzione completata nel ciclo precedente ha lasciato i propri valori nei registri dedicati.',
      'I controlli fissano l’istruzione precedente e il suo indirizzo. La selezione esamina pIcode e pCnd, e sceglie fra pValC e pValP. Dopo il caso proposto, è istruttivo confrontare i due casi di `je`, con Cnd uguale a 1 e a 0.'
    ],
    vedrai: [
      ['register', 'I valori precedenti', 'A sinistra: pIcode, pCnd, pValC e pValP.'],
      ['mux', 'La verifica', 'Al centro: la condizione della selezione del PC.'],
      ['memory', 'Il prelievo', 'A destra: l’indirizzo presentato alla memoria delle istruzioni.']
    ]
  },
  lab: {
    titolo: 'La selezione del PC',
    scena: { w: 860, h: 272 },
    atti: ['I valori precedenti', 'La verifica', 'La scelta', 'Il prelievo'],
    controlli: [
      { id: 'k', tipo: 'scelta', eti: 'Istruzione precedente', opzioni: [['op', 'add rax, rbx'], ['mr', 'mov rax, 8(rbx)'], ['je1', 'je 0x100 con Cnd = 1'], ['je0', 'je 0x100 con Cnd = 0']], valore: 'je1' },
      { id: 'g', tipo: 'scelta', eti: 'Indirizzo dell’istruzione precedente', opzioni: [[0, '0x40'], [1, '0x1F0']], valore: 0 }
    ],
    nota: 'I passi sono sempre quattro. I valori p sono quelli dell’istruzione completata nel ciclo precedente.',
    previsione: {
      domanda: (p) => { const U = SL.unita362, x = U.PREC[p.k]; return 'L’istruzione precedente è `' + x.testo + '`, all’indirizzo ' + U.H(U.GRUPPI[p.g]) + (x.cnd == null ? '' : ', con Cnd = ' + x.cnd) + '. Da quale indirizzo preleva lo stadio F?'; },
      opzioni: (p) => { const U = SL.unita362, v = U.valori(p.k, p.g); return Array.from(new Set([v.pValP, 0x100, v.pc])).sort((a, b) => a - b).map((x) => [x, U.H(x)]); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita362, v = U.valori(p.k, p.g); return 'La previsione indicava ' + U.H(pred) + '. Il prelievo usa ' + U.H(esito) + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === v.pc ? 'Questo è l’indirizzo dell’istruzione precedente. Il prelievo riguarda l’istruzione successiva.' : v.pIcode === 7 && v.pCnd === 1 ? 'pIcode è la categoria di `je` e pCnd vale 1: è selezionato pValC.' : 'La condizione per pValC richiede un `je` con pCnd = 1. In questo caso è selezionato pValP, il successore in memoria.'); },
    costruisci(p) {
      const el = SL.el, U = SL.unita362, H = U.H, passi = [], x = U.PREC[p.k], v = U.valori(p.k, p.g), salta = v.pIcode === 7 && v.pCnd === 1, dest = U.scelta(p.k, p.g);
      const quadro = (f) => [
        el.box('a1', 20, 8, 220, 56, 'pIcode', f >= 0 ? String(v.pIcode) + (v.pIcode === 7 ? ' · je' : '') : '·', f === 1 ? 'att' : 'on', { cls: 'stretta' }),
        el.box('a2', 20, 74, 220, 56, 'pCnd', v.pCnd == null ? 'non definito' : String(v.pCnd), v.pCnd == null ? 'off' : f === 1 ? 'att' : 'on', { cls: 'stretta' }),
        el.box('a3', 20, 140, 220, 56, 'pValC', v.pValC == null ? 'assente' : H(v.pValC), v.pValC == null ? 'off' : f >= 2 && salta ? 'att' : f >= 2 ? 'off' : 'on', { cls: 'stretta' }),
        el.box('a4', 20, 206, 220, 56, 'pValP', H(v.pValP), f >= 2 && !salta ? 'att' : f >= 2 ? 'off' : 'on', { cls: 'stretta' }),
        el.linea('l1', 240, 168, 300, 130, f >= 2 && salta ? 'att' : ''), el.linea('l2', 240, 234, 300, 150, f >= 2 && !salta ? 'att' : ''),
        el.box('k', 300, 74, 280, 130, 'pIcode = je e pCnd = 1?', f >= 1 ? (salta ? 'sì · pValC' : 'no · pValP') : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }),
        el.linea('l3', 580, 139, 620, 139, f >= 2 ? 'att' : ''),
        el.box('pc', 620, 74, 224, 60, 'PC selezionato', f >= 2 ? H(dest) : '·', f === 2 ? 'att' : f > 2 ? 'on' : '', { cls: 'stretta' }),
        el.box('mi', 620, 146, 224, 60, 'memoria delle istruzioni', f >= 3 ? 'legge da ' + H(dest) : '·', f >= 3 ? 'att' : '', { cls: 'stretta' })
      ];
      const hud = (f) => [['Precedente', x.testo, 'a'], ['pCnd', v.pCnd == null ? '·' : String(v.pCnd)], ['PC', f >= 2 ? H(dest) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'I valori dell’istruzione precedente', 'Nel ciclo precedente la CPU ha trattato `' + x.testo + '`, all’indirizzo ' + H(v.pc) + '. I registri dedicati ne conservano icode, cioè pIcode = ' + v.pIcode + ', ' + (v.pCnd == null ? 'nessun valore di Cnd, che soltanto `je` calcola, ' : 'pCnd = ' + v.pCnd + ', ') + (v.pValC == null ? 'nessuna costante' : 'pValC = ' + H(v.pValC)) + ' e pValP = ' + H(v.pc) + ' + ' + x.lung + ' = ' + H(v.pValP) + '.',
        { chiedi: { d: 'Quale valore di pIcode identifica `je`?', o: ['6', '7', '3'], g: 1, no: 'La categoria del salto è icode 7.' } });
      P(1, 1, 'La verifica', 'La selezione del PC esamina pIcode e pCnd. ' + (v.pIcode === 7 ? 'pIcode vale 7, la categoria di `je`, e pCnd vale ' + v.pCnd + (salta ? ': la condizione è soddisfatta.' : ': la condizione non è soddisfatta.') : 'pIcode vale ' + v.pIcode + ', e l’istruzione precedente è diversa da un salto, e la condizione risulta falsa.'),
        { calc: 'pIcode = ' + v.pIcode + ' · pCnd = ' + (v.pCnd == null ? '·' : v.pCnd), chiedi: { d: 'Quale candidato riceverà il PC?', o: ['pValC', 'pValP'], g: salta ? 0 : 1, no: salta ? 'Un `je` con pCnd = 1 è eseguito: il PC riceve la destinazione, pValC.' : 'In tutti i casi diversi da un `je` con pCnd = 1 il PC riceve il successore in memoria, pValP.' } });
      P(2, 2, salta ? 'La destinazione del salto' : 'Il successore in memoria', salta ? 'Il PC riceve pValC = ' + H(dest) + ', la destinazione del salto. L’istruzione che segue `je` in memoria, a ' + H(v.pValP) + ', non è prelevata.' : 'Il PC riceve pValP = ' + H(dest) + ', l’indirizzo dell’istruzione che segue `' + x.testo + '` in memoria.' + (v.pIcode === 7 ? ' La destinazione ' + H(v.pValC) + ' resta inutilizzata.' : ''), { calc: 'PC = ' + (salta ? 'pValC' : 'pValP') + ' = ' + H(dest) });
      P(3, 3, 'Il prelievo', 'Lo stadio F presenta ' + H(dest) + ' alla memoria delle istruzioni, già all’inizio del ciclo. Il calcolo è identico a quello della fase di aggiornamento del PC della CPU a ciclo singolo: è cambiata soltanto la sua posizione, dalla fine di un’istruzione all’inizio della successiva.',
        { calc: 'prelievo da ' + H(dest), esito: ['PC = ' + H(dest), 'si'] });
      return { passi, esito: dest };
    }
  },
  bilancio: {
    regola: [
      'Nella pipeline il nuovo PC deve essere disponibile all’inizio di ogni ciclo. Il blocco che lo calcola è quindi spostato prima del prelievo, e impiega i valori dell’istruzione precedente, conservati in registri dedicati: pIcode, pCnd, pValC e pValP.',
      'Se pIcode è la categoria di `je` e pCnd vale 1, il PC riceve pValC; in tutti gli altri casi riceve pValP. Le fasi divengono cinque: F, che comprende la selezione del PC, D, E, M e W.'
    ],
    errori: [
      ['Selezionare pValC per ogni `je`.', 'La destinazione è scelta soltanto con pCnd = 1. Con pCnd = 0 il PC riceve pValP.'],
      ['Ritenere che il calcolo sia nuovo.', 'La regola è quella della fase di aggiornamento del PC. È cambiata soltanto la posizione del blocco.'],
      ['Leggere i valori p come valori dell’istruzione da prelevare.', 'Il prefisso p indica l’istruzione precedente: i suoi valori stabiliscono dove si trova la successiva.']
    ],
    saFare: ['Spiegare perché il calcolo del PC precede il prelievo.', 'Ricavare l’indirizzo del prelievo da pIcode, pCnd, pValC e pValP.', 'Elencare le cinque fasi della CPU con pipeline.'],
    esercizi: [
      { d: 'L’istruzione precedente è `je 0x200`, all’indirizzo 0x30, con pCnd = 0. Da quale indirizzo preleva lo stadio F? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1A0', giuste: ['0x39', '39', '39h'],
        ok: 'Con pCnd = 0 il PC riceve pValP = 0x30 + 9 = 0x39.',
        diagnosi: [
          { se: ['0x200', '200', '200h'], msg: 'Questa è pValC, la destinazione. È scelta soltanto con pCnd = 1.' },
          { se: ['0x30', '30', '30h'], msg: 'Questo è l’indirizzo del salto stesso. Occorre quello dell’istruzione che lo segue.' },
          { se: ['0x3a', '3a', '3ah'], msg: '`je` occupa 9 byte, poiché non ha il byte dei registri.' }
        ],
        altro: 'Il valore è diverso. Si verifichi la condizione della selezione, e quindi si calcoli pValP.',
        indizi: ['pIcode è la categoria di `je`, e pCnd vale 0.', 'La condizione per pValC non è soddisfatta.', 'pValP = 0x30 + 9.'],
        svolgimento: ['pIcode = 7, pCnd = 0: condizione falsa.', 'PC = pValP.', 'pValP = 0x30 + 9 = 0x39.'] },
      { d: 'Perché nella CPU con pipeline il calcolo del PC è spostato prima del prelievo?', guida: 'Si scelga la risposta.', o: [
        { t: 'Perché a ogni ciclo occorre l’indirizzo di un’istruzione nuova, già all’inizio del ciclo', ok: true, fb: 'Alla fine dell’istruzione sarebbe troppo tardi: nel frattempo la pipeline deve avere già prelevato le successive.' },
        { t: 'Perché la regola di selezione del PC cambia nella pipeline', fb: 'La regola è la medesima della CPU a ciclo singolo, e il blocco ha soltanto una posizione diversa.' },
        { t: 'Perché `je` non calcola più Cnd', fb: '`je` calcola ancora Cnd, e il suo valore raggiunge la selezione come pCnd.' }] }
    ],
    sfida: ['cslez3_6_03_random_assembly', 'Priorità nella selezione del PC']
  }
});
