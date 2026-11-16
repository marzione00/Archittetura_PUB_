'use strict';
SL.unita363 = (() => {
  // Programma della dispensa: mov rdx, 10; mov rax, 3; k nop; add rax, rdx; halt. Registri inizialmente a zero.
  const F5 = ['F', 'D', 'E', 'M', 'W'];
  const traccia = (k) => {
    const d = 4 + k, okRdx = d >= 6, okRax = d >= 7, rdx = okRdx ? 10 : 0, rax = okRax ? 3 : 0;
    const righe = [{ n: 'mov rdx, 10', da: 1, s: F5 }, { n: 'mov rax, 3', da: 2, s: F5 }];
    for (let j = 0; j < k; j++) righe.push({ n: 'nop', da: 3 + j, s: F5, st: 'off' });
    righe.push({ n: 'add rax, rdx', da: 3 + k, s: F5 }, { n: 'halt', da: 4 + k, s: F5 });
    return { d, okRdx, okRax, rdx, rax, ris: rax + rdx, righe, cicli: 8 + k };
  };
  return { traccia };
})();
SL.registra('3.6.3', {
  titolo: 'Dipendenze dei dati e istruzioni nop',
  obiettivo: 'Obiettivo: stabilire in quale ciclo un’istruzione legge i propri operandi nella CPU con pipeline, verificare se li trova aggiornati, e calcolare il numero minimo di `nop` che rende corretto il risultato.',
  concetti: [['conflitto', 'Lettura prima della scrittura'], ['bus', 'Il ciclo dopo la scrittura'], ['pipeline', 'Tre istruzioni di distanza']],
  filigrana: ['conflitto', 'bus', 'pipeline'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 3.5.3', t: 'La dipendenza dei dati', d: 'Un’istruzione che impiega il risultato di una precedente leggerebbe il registro prima che sia stato scritto.' },
      { sim: 'register', da: 'Dall’unità 3.2.3', t: 'La scrittura al fronte', d: 'La porta di scrittura del banco aggiorna il registro al fronte che chiude il ciclo.' },
      { sim: 'tabella', da: 'Dall’unità 3.5.2', t: 'Il diagramma', d: 'Un’istruzione prelevata al ciclo c occupa D al ciclo c + 1 e W al ciclo c + 4.' }
    ],
    domanda: { d: 'Prima di proseguire: un’istruzione è prelevata al ciclo 2. In quale ciclo si trova nello stadio W?', o: [
      { t: 'Ciclo 6', ok: true, fb: 'F al ciclo 2, D al 3, E al 4, M al 5, W al 6.' },
      { t: 'Ciclo 5', fb: 'Gli stadi sono cinque: da F a W trascorrono quattro cicli, quindi 2 + 4 = 6.' },
      { t: 'Ciclo 7', fb: 'Lo stadio W è il quinto: 2 + 4 = 6.' }
    ] }
  },
  idea: {
    titolo: 'Il ciclo in cui un valore diviene leggibile',
    termini: ['regola delle tre istruzioni'],
    testo: [
      'Nella CPU con pipeline un’istruzione legge i propri operandi dal banco dei registri nello stadio D, e scrive il proprio risultato nello stadio W, quattro cicli dopo il prelievo. La scrittura avviene al fronte che chiude il ciclo di W. Un valore scritto in un registro è quindi leggibile nello stadio D soltanto dal ciclo successivo.',
      'Si consideri il programma `mov rdx, 10`, `mov rax, 3`, `add rax, rdx`, `halt`, con i registri inizialmente a zero. `mov rax, 3` è in W al ciclo 4 + 2 = 6, e RAX riceve 3 alla fine di tale ciclo. `add` è prelevata al ciclo 3 ed è in D al ciclo 4: in quel ciclo nessuno dei due registri è stato ancora scritto, e `add` legge RAX = 0 e RDX = 0. Il risultato è 0 in luogo di 13, benché ogni singola istruzione sia stata eseguita secondo le proprie regole.',
      { fig: 'scena', w: 720, h: 252, titolo: 'Tre nop fra mov rax, 3 e add', nota: 'add è in D al ciclo 7, il ciclo che segue la scrittura di RAX: legge RAX = 3 e RDX = 10.', els:
        SL.pipe.diagramma('g', SL.unita363.traccia(3).righe, { x: 150, y: 4, passo: 50, cicli: 11, py: 32, h: 26 }) },
      'Ne deriva la [[regola delle tre istruzioni]]. Un’istruzione che impiega il risultato di un’altra deve entrare nella pipeline almeno quattro cicli dopo di essa: fra le due devono trovarsi almeno tre altre istruzioni. Quando il programma non ne fornisce, le si sostituisce con istruzioni `nop`, che non compiono alcuna operazione. Con tre `nop` fra `mov rax, 3` e `add`, l’istruzione `add` è in D al ciclo 7, e legge RAX = 3 e RDX = 10.',
      'Ogni `nop` è un ciclo in cui la CPU non compie lavoro utile, e le dipendenze riducono quindi il guadagno della pipeline. I processori reali limitano tale perdita con circuiti aggiuntivi, che rilevano le dipendenze e forniscono i valori in tempo: sono tecniche che esulano da questo capitolo.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento esegue il programma della dispensa con un numero variabile di `nop` fra `mov rax, 3` e `add rax, rdx`. I registri valgono inizialmente zero.',
      'Si individua il ciclo in cui `add` è nello stadio D, e lo si confronta con i cicli in cui RDX e RAX ricevono i nuovi valori. Dopo il caso proposto, è istruttivo ridurre le `nop` una alla volta e osservare quale dei due registri viene letto per primo con il valore precedente.'
    ],
    vedrai: [
      ['tabella', 'Il diagramma', 'In alto: le istruzioni del programma, con le nop in grigio.'],
      ['bus', 'Le letture', 'In basso: i valori che add legge per RDX e per RAX.'],
      ['bilancio', 'Il risultato', 'In basso a destra: il valore che add scrive in RAX.']
    ]
  },
  lab: {
    titolo: 'Quante nop servono',
    scena: { w: 860, h: 330 },
    atti: ['Il programma', 'La lettura di RDX', 'La lettura di RAX', 'Il risultato', 'La regola'],
    controlli: [
      { id: 'k', tipo: 'scelta', eti: 'Istruzioni nop', opzioni: [[0, 'nessuna'], [1, '1'], [2, '2'], [3, '3']], valore: 2 }
    ],
    nota: 'I passi sono sempre cinque. I registri valgono inizialmente zero. Un valore scritto in W è leggibile in D dal ciclo successivo.',
    previsione: {
      domanda: (p) => 'Il programma è `mov rdx, 10`, `mov rax, 3`, ' + (p.k ? p.k + (p.k === 1 ? ' `nop`' : ' istruzioni `nop`') + ', ' : '') + '`add rax, rdx`, `halt`, con i registri inizialmente a zero. Quale valore scrive `add` in RAX?',
      opzioni: () => [[0, '0'], [3, '3'], [10, '10'], [13, '13']]
    },
    confronto: (pred, esito, p) => { const T = SL.unita363.traccia(p.k); return 'La previsione indicava ' + pred + '. `add` scrive ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : '`add` è in D al ciclo ' + T.d + '. RDX è leggibile dal ciclo 6 e RAX dal ciclo 7: ' + (T.okRax ? 'entrambi sono aggiornati, e 3 + 10 = 13.' : T.okRdx ? 'RDX vale già 10, mentre RAX vale ancora 0, e 0 + 10 = 10.' : 'nessuno dei due è aggiornato, e 0 + 0 = 0.')); },
    costruisci(p) {
      const el = SL.el, U = SL.unita363, passi = [], k = p.k, T = U.traccia(k), na = 2 + k;
      const quadro = (o) => {
        const els = [el.nota('t0', 20, 0, 'CICLO', 'mono')];
        const righe = T.righe.map((r, j) => (j === na ? Object.assign({}, r, { err: (o.fase >= 1 && !T.okRdx) || (o.fase >= 2 && !T.okRax) ? [T.d] : [] }) : r));
        SL.pipe.diagramma('d', righe, { x: 150, y: 0, passo: 52, cicli: 11, py: 30, h: 24, evid: o.evid }).forEach((e) => els.push(e));
        const yb = 34 + T.righe.length * 30;
        els.push(el.box('b1', 20, yb, 264, 62, 'add legge RDX', o.fase >= 1 ? String(T.rdx) + (T.okRdx ? ' · aggiornato' : ' · valore precedente') : '·', o.fase === 1 ? (T.okRdx ? 'att' : 'err') : o.fase > 1 ? (T.okRdx ? 'on' : 'err') : '', { cls: 'stretta' }),
          el.box('b2', 298, yb, 264, 62, 'add legge RAX', o.fase >= 2 ? String(T.rax) + (T.okRax ? ' · aggiornato' : ' · valore precedente') : '·', o.fase === 2 ? (T.okRax ? 'att' : 'err') : o.fase > 2 ? (T.okRax ? 'on' : 'err') : '', { cls: 'stretta' }),
          el.box('b3', 576, yb, 264, 62, 'add scrive in RAX', o.fase >= 3 ? String(T.ris) : '·', o.fase >= 3 ? (T.ris === 13 ? 'att' : 'err') : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Istruzioni nop', String(k), 'a'], ['add in D', o.fase >= 1 ? 'ciclo ' + T.d : '·'], ['Risultato', o.fase >= 3 ? String(T.ris) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ fase: 0 }, 0, 'Il programma', 'Il programma comprende ' + (4 + k) + ' istruzioni: `mov rdx, 10`, `mov rax, 3`, ' + (k ? k + (k === 1 ? ' `nop`' : ' `nop`') + ', ' : '') + '`add rax, rdx` e `halt`. Entrano nella pipeline una per ciclo, e `add` è prelevata al ciclo ' + (3 + k) + '.',
        { chiedi: { d: '`add` è prelevata al ciclo ' + (3 + k) + '. In quale ciclo legge i propri operandi nello stadio D?', o: [3 + k, 4 + k, 7 + k].map((c) => 'Ciclo ' + c), g: 1, no: 'Lo stadio D segue il prelievo di un ciclo: ' + (3 + k) + ' + 1 = ' + (4 + k) + '.' } });
      P({ fase: 1, evid: T.d }, 1, 'La lettura di RDX', '`mov rdx, 10` è in W al ciclo 5, e RDX riceve 10 alla fine di quel ciclo: il valore è leggibile in D dal ciclo 6. `add` è in D al ciclo ' + T.d + (T.okRdx ? ', e legge RDX = 10.' : ', troppo presto, e legge il valore precedente, RDX = 0.'),
        { calc: 'D di add: ciclo ' + T.d + ' · RDX leggibile dal ciclo 6', chiedi: { d: 'RAX riceve 3 alla fine del ciclo 6. Dal quale ciclo è leggibile in D?', o: ['Ciclo 6', 'Ciclo 7', 'Ciclo 10'], g: 1, no: 'Un valore scritto in W è leggibile in D dal ciclo successivo: 6 + 1 = 7.' } });
      P({ fase: 2, evid: T.d }, 2, 'La lettura di RAX', '`mov rax, 3` è in W al ciclo 6, e RAX è leggibile in D dal ciclo 7. `add` è in D al ciclo ' + T.d + (T.okRax ? ', e legge RAX = 3.' : ', e legge il valore precedente, RAX = 0.') + (k < 3 ? ' Mancano ' + (3 - k) + (3 - k === 1 ? ' ciclo' : ' cicli') + ' al ciclo 7.' : ''), { calc: 'RAX leggibile dal ciclo 7 · letto: ' + T.rax });
      P({ fase: 3 }, 3, T.ris === 13 ? 'Il risultato è corretto' : 'Il risultato è errato', '`add` calcola ' + T.rax + ' + ' + T.rdx + ' = ' + T.ris + ' e lo scrive in RAX al ciclo ' + (7 + k) + '. ' + (T.ris === 13 ? 'È il risultato atteso, 3 + 10.' : 'Il risultato atteso era 13: il programma è errato, benché ogni istruzione sia stata eseguita come prescritto.') + ' `halt` raggiunge W al ciclo ' + T.cicli + '.', { calc: 'RAX = ' + T.rax + ' + ' + T.rdx + ' = ' + T.ris });
      P({ fase: 3 }, 4, 'La regola delle tre istruzioni', 'Fra `mov rax, 3` e `add` devono trovarsi almeno tre istruzioni, affinché `add` sia in D dopo la scrittura di RAX. ' + (k === 3 ? 'Le tre `nop` soddisfano la regola, e il programma termina al ciclo ' + T.cicli + '.' : 'Con ' + (k === 0 ? 'nessuna `nop`' : k === 1 ? 'una sola `nop`' : k + ' `nop`') + ' la regola non è soddisfatta' + (T.okRdx ? ' per RAX, mentre lo è per RDX, scritto un ciclo prima.' : ' né per RAX né per RDX.') + (3 - k === 1 ? ' Occorre una `nop` in più.' : ' Occorrono ' + (3 - k) + ' `nop` in più.')),
        { calc: 'nop presenti: ' + k + ' · minimo: 3', esito: ['risultato ' + T.ris, T.ris === 13 ? 'si' : 'no'] });
      return { passi, esito: T.ris };
    }
  },
  bilancio: {
    regola: [
      'Nella CPU con pipeline un valore scritto in un registro nello stadio W è leggibile nello stadio D soltanto dal ciclo successivo. Un’istruzione che impiega il risultato di un’altra deve quindi entrare nella pipeline almeno quattro cicli dopo di essa.',
      'Fra le due devono trovarsi almeno tre altre istruzioni. Quando il programma non le fornisce, le si sostituisce con istruzioni `nop`, ciascuna delle quali costa un ciclo.'
    ],
    errori: [
      ['Ritenere sufficiente che la scrittura avvenga nello stesso ciclo della lettura.', 'Il registro riceve il valore alla fine del ciclo di W. Nel medesimo ciclo D legge ancora il valore precedente.'],
      ['Contare le nop a partire dalla prima istruzione del programma.', 'La distanza si misura dall’istruzione che scrive il registro: in questo programma, da `mov rax, 3`.'],
      ['Ritenere che una dipendenza produca un errore della CPU.', 'Ogni istruzione è eseguita correttamente. Il programma calcola un risultato errato perché legge un valore non aggiornato.']
    ],
    saFare: ['Stabilire il ciclo in cui un’istruzione legge i propri operandi.', 'Verificare se un registro è già aggiornato in quel ciclo.', 'Calcolare il numero minimo di nop fra due istruzioni dipendenti.'],
    esercizi: [
      { d: 'Fra `mov rbx, 7` e `add rcx, rbx` si trova un’istruzione indipendente. Quante `nop` occorre aggiungere fra le due affinché `add` legga RBX = 7?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: 'Occorrono tre istruzioni fra le due: una è già presente, e ne mancano due.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Le istruzioni richieste fra le due sono tre, e una è già presente.' },
          { se: ['1', 'uno', 'una'], msg: 'Con una sola nop le istruzioni intermedie sono due. Ne occorrono tre.' },
          { se: ['0', 'zero', 'nessuna'], msg: 'Un’istruzione intermedia è insufficiente, poiché `add` sarebbe in D due cicli prima della lettura possibile.' }
        ],
        altro: 'Il numero è diverso. Fra le due istruzioni dipendenti devono trovarsi tre istruzioni.',
        indizi: ['La regola richiede tre istruzioni fra quella che scrive e quella che legge.', 'Un’istruzione indipendente è già presente.', '3 − 1.'],
        svolgimento: ['Istruzioni richieste fra le due: 3.', 'Già presenti: 1.', 'nop da aggiungere: 3 − 1 = 2.'] },
      { d: 'Nel programma `mov rdx, 10`, `mov rax, 3`, `nop`, `add rax, rdx`, `halt`, con i registri a zero, quale valore scrive `add` in RAX?', guida: 'Si scelga la risposta.', o: [
        { t: '0', ok: true, fb: '`add` è in D al ciclo 5. RDX è leggibile dal ciclo 6 e RAX dal ciclo 7: entrambi valgono ancora 0.' },
        { t: '10', fb: 'Con due nop `add` leggerebbe RDX aggiornato. Con una sola è in D al ciclo 5, prima che RDX sia leggibile.' },
        { t: '13', fb: 'Il risultato corretto richiede tre nop. Con una sola entrambi i registri sono letti prima dell’aggiornamento.' }] }
    ],
    sfida: ['cslez3_6_02_random_assembly', 'Abilitazione e controllo dei registri di pipeline']
  }
});
