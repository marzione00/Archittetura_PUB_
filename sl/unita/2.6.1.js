'use strict';
SL.registra('2.6.1', {
  titolo: 'La convenzione delle chiamate di funzione',
  obiettivo: 'Obiettivo: indicare dove una funzione trova ciascuno dei propri argomenti: quali nei registri, quali sulla pila e a quale distanza dalla cima.',
  concetti: [['input', 'Sei registri'], ['pila', 'La pila'], ['puntatore', 'L’indirizzo di ritorno']],
  filigrana: ['pila', 'input', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'input', da: 'Dall’unità 2.2.2', t: 'Convenzione di chiamata', d: 'L’accordo che fissa la posizione degli argomenti di una funzione e quella del risultato.' },
      { sim: 'tabella', da: 'Dall’unità 2.5.2', t: 'I registri degli argomenti', d: 'Una funzione riceve i primi sei argomenti interi in RDI, RSI, RDX, RCX, R8 e R9.' },
      { sim: 'memory', da: 'Dall’unità 2.5.4', t: 'L’immagine di un processo', d: 'Fra le mappature di ogni processo è presente una zona di lavoro, la pila, preparata dal kernel all’avvio.' }
    ],
    domanda: { d: 'Prima di proseguire: in quale registro una funzione trova il suo terzo argomento intero?', o: [
      { t: 'RDX', ok: true, fb: 'L’ordine è RDI, RSI, RDX, RCX, R8, R9. Il terzo posto spetta a RDX.' },
      { t: 'RCX', fb: 'RCX contiene il quarto argomento. Il terzo è trasmesso in RDX.' },
      { t: 'R10', fb: 'R10 è impiegato dalle chiamate di sistema, per il quarto argomento. Nelle funzioni il terzo è trasmesso in RDX.' }
    ] }
  },
  idea: {
    titolo: 'Argomenti oltre il sesto',
    termini: ['pila', 'rsp', 'push', 'call', 'indirizzo di ritorno'],
    testo: [
      'Il chiamante di una funzione deve trasmetterle gli argomenti in una posizione concordata. I primi sei argomenti interi sono trasmessi nei registri RDI, RSI, RDX, RCX, R8 e R9, e il risultato è restituito in RAX. Una funzione può tuttavia riceverne un numero maggiore. Per gli argomenti in eccesso occorre la memoria.',
      'La zona di memoria impiegata a tale scopo è la [[pila]]. Il nome descrive la disciplina di accesso: l’ultimo dato depositato è il primo a essere prelevato. Il registro [[rsp|RSP]] contiene l’indirizzo della cima, cioè dell’ultimo dato depositato. Per ragioni storiche la pila cresce verso gli indirizzi bassi: il deposito di un dato fa diminuire RSP.',
      'L’istruzione [[push|PUSH]] deposita un dato di otto byte. Dapprima sottrae 8 a RSP, poi scrive il dato all’indirizzo contenuto in RSP. Gli argomenti dal settimo in poi sono depositati in tal modo, a partire dall’ultimo: il settimo resta così il più vicino alla cima.',
      'Resta il trasferimento del controllo. L’istruzione [[call|CALL]] salta alla prima istruzione della funzione, dopo aver depositato sulla pila l’[[indirizzo di ritorno]]: l’indirizzo dell’istruzione che la segue, da cui il chiamante riprenderà. All’ingresso nella funzione, pertanto, la cima della pila contiene l’indirizzo di ritorno, e gli argomenti depositati dal chiamante si trovano immediatamente sopra.',
      { fig: 'scena', w: 720, h: 150, titolo: 'La pila all’ingresso di una funzione con otto argomenti', nota: 'Gli indirizzi più alti sono in alto. Il settimo argomento si trova otto byte sopra la cima, l’ottavo sedici.', els:
        SL.x86.pila('p', [{ a: 0x7FF8, txt: 'ottavo argomento', nota: '[rsp + 16]' }, { a: 0x7FF0, txt: 'settimo argomento', nota: '[rsp + 8]' }, { a: 0x7FE8, txt: 'indirizzo di ritorno', nota: '[rsp]', st: 'att' }], { x: 60, y: 6, w: 260, rsp: 0x7FE8 }) },
      'La funzione legge gli argomenti in memoria con un operando che parte da RSP. Al suo ingresso `[rsp]` è l’indirizzo di ritorno, `[rsp + 8]` è il settimo argomento, `[rsp + 16]` è l’ottavo. La posizione di un argomento dipende soltanto dal suo numero d’ordine nell’elenco.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma chiama una funzione con otto argomenti interi consecutivi. I controlli fissano il valore del primo e l’argomento da seguire.',
      'Il chiamante deposita due argomenti sulla pila, scrive gli altri nei registri ed esegue CALL. L’argomento scelto è poi cercato come lo cerca la funzione. Dopo il caso proposto, è istruttivo seguire il sesto argomento e confrontare.'
    ],
    vedrai: [
      ['register', 'I sei registri', 'A sinistra: i registri degli argomenti, con i valori scritti dal chiamante.'],
      ['pila', 'La pila', 'A destra: le celle della pila, di otto byte ciascuna, con la cima indicata da RSP.'],
      ['lente', 'La posizione dell’argomento', 'In basso: la posizione in cui la funzione trova l’argomento seguito.']
    ]
  },
  lab: {
    titolo: 'Otto argomenti, sei registri',
    scena: { w: 860, h: 372 },
    atti: ['Otto argomenti', 'Due sulla pila', 'Sei nei registri', 'La chiamata', 'La posizione dell’argomento'],
    controlli: [
      { id: 'i', tipo: 'num', eti: 'Argomento da seguire', min: 1, max: 8, salti: [1], valore: 7 },
      { id: 'b', tipo: 'scelta', eti: 'Valore del primo argomento', opzioni: [[10, '10'], [20, '20'], [100, '100']], valore: 10 }
    ],
    nota: 'Gli otto argomenti sono numeri consecutivi. Prima della chiamata RSP vale 0x8000.',
    previsione: {
      domanda: (p) => 'Una funzione riceve otto argomenti interi. Dove trova, al proprio ingresso, l’argomento numero ' + p.i + '?',
      opzioni: (p) => { const U = SL.unita261; return p.i <= 6 ? Array.from(new Set([U.REG[p.i - 1], U.REG[p.i % 6], 'RAX', '[rsp + 8]'])).sort() : ['R9', '[rsp]', '[rsp + 8]', '[rsp + 16]']; }
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. La funzione lo trova in ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.i <= 6 ? 'I primi sei argomenti sono trasmessi nei registri, nell’ordine RDI, RSI, RDX, RCX, R8, R9.' : 'I registri sono sufficienti per sei argomenti. Dal settimo in poi essi si trovano sulla pila, sopra l’indirizzo di ritorno che occupa la cima.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita261, passi = [], V = (k) => p.b + k - 1, SEDE = U.sede(p.i);
      const st = { rsp: 0x8000, c8: null, c7: null, rit: null, reg: false };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'REGISTRI DEGLI ARGOMENTI', 'mono'), el.nota('n2', 420, 0, 'LA PILA', 'mono')];
        U.REG.forEach((r, k) => els.push(el.box('r' + k, 20 + (k % 2) * 180, 28 + Math.floor(k / 2) * 66, 170, 58, (k + 1) + '° · ' + r, st.reg ? String(V(k + 1)) : '·', o.trova && p.i === k + 1 ? 'att' : o.reg ? 'att' : st.reg ? 'on' : '', { cls: 'stretta' })));
        X.pila('s', [{ a: 0x8000, txt: 'del chiamante', st: '' }, { a: 0x7FF8, txt: st.c8, nota: st.c8 != null ? '8° argomento' : null, st: o.nuova === 0x7FF8 || (o.trova && p.i === 8) ? 'att' : null }, { a: 0x7FF0, txt: st.c7, nota: st.c7 != null ? '7° argomento' : null, st: o.nuova === 0x7FF0 || (o.trova && p.i === 7) ? 'att' : null }, { a: 0x7FE8, txt: st.rit, nota: st.rit != null ? 'ritorno' : null, st: o.nuova === 0x7FE8 ? 'att' : null }], { x: 420, y: 28, w: 160, passo: 52, rsp: st.rsp }).forEach((e) => els.push(e));
        els.push(el.box('ist', 20, 240, 350, 58, 'istruzione del chiamante', o.ist || '·', o.ist ? 'att' : '', { cls: 'stretta' }),
          el.box('rsp', 420, 240, 200, 58, 'RSP', '0x' + st.rsp.toString(16).toUpperCase(), o.nuova ? 'att' : 'on', { cls: 'stretta' }),
          el.box('sed', 20, 310, 820, 54, 'l’argomento numero ' + p.i + ', che vale ' + V(p.i) + ', si trova in', o.trova ? SEDE + (p.i > 6 ? ', cioè all’indirizzo 0x' + (0x7FE8 + (p.i - 6) * 8).toString(16).toUpperCase() : '') : '·', o.trova ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Argomento ' + p.i, String(V(p.i)), 'a'], ['RSP', '0x' + st.rsp.toString(16).toUpperCase()], ['Sede', st.rit != null ? SEDE : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Otto argomenti da trasmettere', 'Il chiamante deve trasmettere alla funzione otto argomenti: i numeri da ' + V(1) + ' a ' + V(8) + '. RSP vale 0x8000 e indica gli ultimi dati depositati dal chiamante.',
        { chiedi: { d: 'I registri degli argomenti sono sei. Dove saranno collocati il settimo e l’ottavo argomento?', o: ['In altri due registri', 'Sulla pila', 'Sono scartati'], g: 1, no: 'La convenzione assegna agli argomenti sei registri. Quelli in eccesso sono depositati sulla pila.' } });
      st.rsp = 0x7FF8; st.c8 = V(8);
      P({ ist: 'push ' + V(8), nuova: 0x7FF8 }, 1, 'L’ottavo argomento', 'PUSH sottrae 8 a RSP, che scende a 0x7FF8, e scrive il valore ' + V(8) + ' nella cella che ora costituisce la cima. Il chiamante comincia dall’ultimo argomento, poiché i dati depositati in seguito risultano più vicini alla cima.', { calc: '0x8000 − 8 = 0x7FF8' });
      st.rsp = 0x7FF0; st.c7 = V(7);
      P({ ist: 'push ' + V(7), nuova: 0x7FF0 }, 1, 'Il settimo argomento', 'Un secondo PUSH porta RSP a 0x7FF0 e vi scrive ' + V(7) + ', il settimo argomento. La pila è cresciuta di sedici byte, verso gli indirizzi bassi.', { calc: '0x7FF8 − 8 = 0x7FF0' });
      st.reg = true;
      P({ ist: 'mov edi, ' + V(1) + ' … mov r9d, ' + V(6), reg: true }, 2, 'I primi sei nei registri', 'Sei istruzioni MOV scrivono i primi sei argomenti nei registri previsti: ' + V(1) + ' in RDI, ' + V(2) + ' in RSI, e così via fino a ' + V(6) + ' in R9. La pila resta invariata.',
        { chiedi: { d: 'Il chiamante esegue ora CALL. Che cosa depositerà CALL sulla pila, prima del salto alla funzione?', o: ['Il primo argomento', 'L’indirizzo di ritorno', 'Nulla'], g: 1, no: 'CALL deposita l’indirizzo dell’istruzione che la segue. Senza di esso la funzione sarebbe priva dell’indirizzo a cui tornare.' } });
      st.rsp = 0x7FE8; st.rit = '0x401234';
      P({ ist: 'call funzione', nuova: 0x7FE8 }, 3, 'La chiamata', 'CALL deposita sulla pila l’indirizzo di ritorno, 0x401234, e porta RSP a 0x7FE8. Salta poi alla prima istruzione della funzione. La cima della pila contiene ora l’indirizzo di ritorno, e i due argomenti si trovano immediatamente sopra.', { calc: '0x7FF0 − 8 = 0x7FE8' });
      P({ trova: true }, 4, 'La ricerca da parte della funzione', (p.i <= 6 ? 'L’argomento numero ' + p.i + ' è fra i primi sei: la funzione lo trova nel registro ' + SEDE + ', che contiene ' + V(p.i) + '. Nessun accesso alla memoria è necessario.' : 'L’argomento numero ' + p.i + ' è oltre il sesto, e si trova sulla pila. La cima è occupata dall’indirizzo di ritorno. Il ' + (p.i === 7 ? 'settimo argomento si trova otto byte sopra, a 0x7FF0, e la funzione lo legge con `[rsp + 8]`.' : 'ottavo argomento si trova sedici byte sopra, a 0x7FF8, e la funzione lo legge con `[rsp + 16]`.')) + ' La posizione dipende dal numero d’ordine nell’elenco, qualunque sia il valore.', { calc: SEDE + ' = ' + V(p.i), esito: [SEDE, 'si'] });
      return { passi, esito: SEDE };
    }
  },
  bilancio: {
    regola: [
      'I primi sei argomenti interi sono trasmessi in RDI, RSI, RDX, RCX, R8 e R9. Gli altri sono depositati sulla pila, a partire dall’ultimo.',
      'CALL deposita l’indirizzo di ritorno e salta alla funzione. Al suo ingresso `[rsp]` è l’indirizzo di ritorno, `[rsp + 8]` il settimo argomento, `[rsp + 16]` l’ottavo.'
    ],
    errori: [
      ['Cercare il settimo argomento in cima alla pila.', 'La cima è occupata dall’indirizzo di ritorno, depositato da CALL per ultimo. Il settimo argomento si trova otto byte sopra.'],
      ['Ritenere che la pila cresca verso gli indirizzi alti.', 'Ogni PUSH sottrae 8 a RSP. I dati depositati più di recente hanno gli indirizzi più bassi.'],
      ['Depositare gli argomenti dal settimo in avanti.', 'Si comincia dall’ultimo. In tal modo il settimo, depositato per ultimo, resta il più vicino alla cima.']
    ],
    saFare: ['Elencare i sei registri degli argomenti, nell’ordine.', 'Calcolare la variazione di RSP dopo PUSH e dopo CALL.', 'Determinare sulla pila gli argomenti oltre il sesto.'],
    esercizi: [
      { d: 'RSP vale 0x7000. Il programma esegue due istruzioni PUSH e poi una CALL. Quanto vale RSP all’ingresso della funzione? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x6FF0', giuste: ['0x6fe8', '6fe8', '6fe8h'],
        ok: 'Ogni PUSH sottrae 8 a RSP, e così anche CALL, che deposita l’indirizzo di ritorno. Il totale è di 24 byte: 0x7000 − 0x18 = 0x6FE8.',
        diagnosi: [
          { se: ['0x6ff0', '6ff0'], msg: 'Il valore indicato è RSP dopo i due PUSH. Anche CALL deposita un dato di otto byte, l’indirizzo di ritorno.' },
          { se: ['0x7018', '7018'], msg: 'La pila cresce verso gli indirizzi bassi: ogni dato depositato fa diminuire RSP.' },
          { se: ['0x6976', '6976', '0x6fd6'], msg: 'I 24 byte vanno scritti in esadecimale prima della sottrazione: 24 = 0x18.' },
          { se: ['0x6ffd', '6ffd'], msg: 'Ogni dato depositato occupa otto byte, e i dati sono tre.' }
        ],
        altro: 'Il valore è diverso. Si contino i dati depositati sulla pila e si sottraggano otto byte per ciascuno.',
        indizi: ['Due PUSH e una CALL depositano tre dati.', 'Tre dati da otto byte occupano 24 byte, cioè 0x18.', '0x7000 − 0x18.'],
        svolgimento: ['Primo PUSH: RSP = 0x6FF8.', 'Secondo PUSH: RSP = 0x6FF0.', 'CALL deposita l’indirizzo di ritorno: RSP = 0x6FE8.'] },
      { d: 'Una funzione ha nove argomenti interi. Con quale operando legge il nono, al proprio ingresso?', guida: 'Si scelga la risposta.', o: [
        { t: '[rsp + 24]', ok: true, fb: 'Sopra l’indirizzo di ritorno si trovano il settimo argomento, a 8 byte dalla cima, l’ottavo a 16 e il nono a 24.' },
        { t: '[rsp + 16]', fb: 'A sedici byte dalla cima si trova l’ottavo argomento. Il nono è nella cella superiore.' },
        { t: '[rsp + 9]', fb: 'Le celle della pila sono larghe otto byte. Le distanze dalla cima sono multipli di 8.' }] }
    ],
    sfida: ['cslez2_6_04_random_assembly_04', 'Espressioni, array e chiamate']
  }
});
SL.unita261 = { REG: ['RDI', 'RSI', 'RDX', 'RCX', 'R8', 'R9'], sede: (i) => (i <= 6 ? ['RDI', 'RSI', 'RDX', 'RCX', 'R8', 'R9'][i - 1] : '[rsp + ' + (i - 6) * 8 + ']') };
