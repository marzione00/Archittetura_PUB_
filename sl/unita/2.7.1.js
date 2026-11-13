'use strict';
SL.registra('2.7.1', {
  titolo: 'I frame dello stack come convenzioni',
  obiettivo: 'Alla fine saprai seguire il prologo e l’epilogo di una funzione che usa RBP, e trovare l’indirizzo di una variabile locale a partire dal suo spiazzamento.',
  concetti: [['puntatore', 'Un riferimento fermo'], ['pila', 'Prologo ed epilogo'], ['tabella', 'Un accordo fra compilatori']],
  filigrana: ['pila', 'puntatore', 'tabella'],
  richiami: {
    carte: [
      { sim: 'pila', da: 'Dall’unità 2.6.2', t: 'Frame', d: 'La porzione di pila di una chiamata: indirizzo di ritorno, registri salvati, spazio locale.' },
      { sim: 'pila', da: 'Dalle unità 2.6.1 e 2.6.2', t: 'PUSH e POP', d: 'PUSH toglie 8 a RSP e scrive un dato in cima. POP legge il dato in cima e aggiunge 8 a RSP.' },
      { sim: 'puntatore', da: 'Dall’unità 2.3.2', t: 'Spiazzamento', d: 'La costante sommata nel calcolo di un indirizzo. Può essere negativa, e allora porta verso indirizzi più bassi.' }
    ],
    domanda: { d: 'Prima di proseguire: RSP vale 0x8FF8 e il programma esegue `push rbp`. A quale indirizzo viene scritto il contenuto di RBP?', o: [
      { t: '0x8FF0', ok: true, fb: 'PUSH prima toglie 8 a RSP, poi scrive nella nuova cima: 0x8FF8 − 8 = 0x8FF0.' },
      { t: '0x8FF8', fb: 'A questo indirizzo sta il dato che era in cima prima del PUSH. Il nuovo dato va otto byte più in basso.' },
      { t: '0x9000', fb: 'La pila cresce verso gli indirizzi bassi: un PUSH fa diminuire RSP.' }
    ] }
  },
  idea: {
    titolo: 'Un punto fermo dentro il frame',
    termini: ['rbp', 'prologo', 'epilogo'],
    testo: [
      'Nell’unità 2.6.2 il frame di una funzione era descritto a partire da RSP. RSP però si muove a ogni PUSH e a ogni POP, e la distanza di una variabile dalla cima cambia di continuo. Molte funzioni preferiscono un riferimento che resti fermo per tutta la chiamata, e lo tengono nel registro [[rbp|RBP]].',
      'Il riferimento viene fissato dalle prime istruzioni della funzione, che formano il [[prologo]]. La prima, `push rbp`, mette in salvo il riferimento del chiamante. La seconda, `mov rbp, rsp`, copia in RBP la cima attuale della pila. La terza, `sub rsp, N`, riserva lo spazio locale. Da questo momento RSP può muoversi liberamente, e RBP resta dov’è.',
      { fig: 'scena', w: 720, h: 196, titolo: 'Il frame visto da RBP', nota: 'Sopra RBP, ciò che è stato posato prima del prologo. Sotto, lo spazio locale.', els:
        SL.x86.pila('p', [{ a: 0x8FF8, txt: 'indirizzo di ritorno', nota: '[rbp + 8]' }, { a: 0x8FF0, txt: 'RBP del chiamante', nota: '[rbp]', st: 'att' }, { a: 0x8FE8, txt: 'variabili locali', nota: '[rbp - 8]' }, { a: 0x8FE0, txt: 'variabili locali', nota: '[rbp - 16]' }], { x: 60, y: 6, w: 260, rsp: 0x8FE0, rbp: 0x8FF0 }) },
      'Ogni cella del frame ha così uno spiazzamento fisso rispetto a RBP. La cella `[rbp]` contiene il RBP del chiamante, e `[rbp + 8]` l’indirizzo di ritorno. Le variabili locali stanno sotto, a spiazzamenti negativi: `[rbp - 4]`, `[rbp - 8]`, e così via.',
      'Le ultime istruzioni smontano il frame e formano l’[[epilogo]]. L’istruzione `leave` ne compie due in una: copia RBP in RSP, restituendo in un colpo tutto lo spazio locale, e poi preleva dalla cima il RBP del chiamante. Resta in cima l’indirizzo di ritorno, pronto per RET.',
      'Tutto questo è una convenzione. Il processore ignora che cosa sia un frame: esegue PUSH, POP, CALL e RET, e nient’altro. La disposizione delle celle è una scelta dei compilatori, rispettata per accordo, e nessun meccanismo impedisce a un’istruzione di scrivere nella cella sbagliata. Le prossime unità partono da qui.'
    ]
  },
  esperimento: {
    faremo: [
      'Una funzione usa RBP come riferimento, riserva dello spazio locale e scrive il numero 7 in una variabile. Sceglierai quanto spazio riservare e lo spiazzamento della variabile.',
      'Seguiremo il prologo, la scrittura e l’epilogo, guardando RSP e RBP a ogni passo. Dopo il caso proposto, aumenta lo spazio locale e controlla che l’indirizzo della variabile resti lo stesso.'
    ],
    vedrai: [
      ['operation', 'Il listato', 'A sinistra: le sei istruzioni della funzione.'],
      ['pila', 'La pila', 'Al centro: le celle del frame, con le frecce che indicano RSP e RBP.'],
      ['register', 'I due registri', 'In basso: RSP, RBP e la loro distanza.']
    ]
  },
  lab: {
    titolo: 'Prologo, variabile locale, epilogo',
    scena: { w: 860, h: 392 },
    atti: ['All’ingresso', 'Il prologo', 'Lo spazio locale', 'Una variabile locale', 'L’epilogo'],
    controlli: [
      { id: 's', tipo: 'scelta', eti: 'Spazio locale', opzioni: [[16, '16 byte'], [32, '32 byte'], [48, '48 byte']], valore: 16 },
      { id: 'k', tipo: 'scelta', eti: 'Variabile', opzioni: [[4, '[rbp - 4]'], [8, '[rbp - 8]'], [16, '[rbp - 16]']], valore: 8 }
    ],
    nota: 'I passi sono sempre sette. All’ingresso RSP vale 0x8FF8 e RBP, che appartiene al chiamante, vale 0x9020.',
    previsione: {
      domanda: (p) => 'All’ingresso di una funzione RSP vale 0x8FF8. La funzione esegue `push rbp`, `mov rbp, rsp`, `sub rsp, ' + p.s + '` e poi `mov dword ptr [rbp - ' + p.k + '], 7`. A quale indirizzo viene scritto il numero 7?',
      opzioni: (p) => Array.from(new Set([0x8FF0 - p.k, 0x8FF8 - p.k, 0x8FF0 - p.s - p.k, 0x8FF0 + p.k])).sort((a, b) => a - b).map(SL.unita271.HA)
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + '. La scrittura avviene a ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Dopo `push rbp` la cima è a 0x8FF0, e `mov rbp, rsp` fissa lì RBP. La variabile sta ' + p.k + ' byte sotto: 0x8FF0 − ' + p.k + '. Lo spazio riservato sposta RSP, e lascia fermo RBP.'),
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita271, HA = U.HA, passi = [], S = p.s, K = p.k, AV = 0x8FF0 - K;
      const LIS = [['salva il riferimento', 'push rbp'], ['fissa il nuovo', 'mov rbp, rsp'], ['spazio locale', 'sub rsp, ' + S], ['una variabile', 'mov dword ptr [rbp - ' + K + '], 7'], ['smonta il frame', 'leave'], ['ritorno', 'ret']];
      const st = { rsp: 0x8FF8, rbp: 0x9020, salv: null, loc: false, v: false };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'LA FUNZIONE', 'mono'), el.nota('n2', 290, 0, 'LA PILA', 'mono')];
        X.listato('li', LIS, o.riga, { x: 20, y: 24, w: 250, passo: 48 }).forEach((e) => els.push(e));
        const righe = [{ a: 0x8FF8, txt: '0x401234', nota: 'indirizzo di ritorno' }, { a: 0x8FF0, txt: st.salv, nota: st.salv ? 'RBP del chiamante' : null, st: o.cella === 'salv' ? 'att' : null }];
        for (let j = 1; j <= 6; j++) { const a = 0x8FF0 - 8 * j, dentro = st.loc && j <= S / 8, qui = st.v && AV >= a && AV < a + 8; righe.push({ a, txt: qui ? '7' : dentro ? 'locale' : null, nota: qui ? '[rbp - ' + K + ']' : null, st: qui && o.cella === 'var' ? 'att' : dentro && o.cella === 'loc' ? 'att' : null }); }
        X.pila('s', righe, { x: 290, y: 24, w: 170, passo: 38, rsp: st.rsp, rbp: st.rbp >= 0x8FC0 && st.rbp <= 0x8FF8 ? st.rbp : null }).forEach((e) => els.push(e));
        els.push(el.box('rsp', 290, 334, 176, 52, 'RSP', HA(st.rsp), o.reg === 'rsp' || o.reg === 'due' ? 'att' : 'on', { cls: 'stretta' }),
          el.box('rbp', 476, 334, 176, 52, 'RBP', HA(st.rbp), o.reg === 'rbp' || o.reg === 'due' ? 'att' : 'on', { cls: 'stretta' }),
          el.box('dis', 662, 334, 178, 52, 'RBP − RSP', st.rbp === 0x8FF0 ? (st.rbp - st.rsp) + ' byte' : '·', o.cella === 'loc' ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['RSP', HA(st.rsp), 'a'], ['RBP', HA(st.rbp)], ['Variabile', st.v ? HA(AV) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'All’ingresso', 'La funzione è appena stata chiamata. RSP vale 0x8FF8 e indica l’indirizzo di ritorno, posato da CALL. RBP contiene 0x9020: è il riferimento del chiamante, che la funzione dovrà restituire intatto.');
      st.rsp = 0x8FF0; st.salv = '0x9020';
      P({ riga: 0, cella: 'salv', reg: 'rsp' }, 1, 'Il riferimento del chiamante in salvo', 'La prima istruzione del prologo posa RBP sulla pila. RSP scende a 0x8FF0, e la cella riceve 0x9020. Il registro RBP è ora libero di cambiare.', { calc: 'RSP = 0x8FF8 − 8 = 0x8FF0' });
      st.rbp = 0x8FF0;
      const o2 = Array.from(new Set([0x8FF0 - S, 0x8FF8 - S, 0x8FF0 + S])).sort((a, b) => a - b);
      P({ riga: 1, reg: 'rbp' }, 1, 'Il nuovo riferimento', 'La seconda istruzione copia RSP in RBP. I due registri contengono entrambi 0x8FF0, l’indirizzo della cella in cui è stato salvato il vecchio RBP. Da qui in avanti RBP resta fermo.',
        { calc: 'RBP = RSP = 0x8FF0', chiedi: { d: 'La terza istruzione è `sub rsp, ' + S + '`. Quanto varrà RSP?', o: o2.map(HA), g: o2.indexOf(0x8FF0 - S), no: 'RSP parte da 0x8FF0 e scende di ' + S + ' byte, cioè 0x' + S.toString(16).toUpperCase() + ': arriva a ' + HA(0x8FF0 - S) + '.' } });
      st.rsp = 0x8FF0 - S; st.loc = true;
      const o3 = Array.from(new Set([AV, 0x8FF0 + K, st.rsp + K, st.rsp - K])).slice(0, 3).sort((a, b) => a - b);
      P({ riga: 2, cella: 'loc', reg: 'rsp' }, 2, 'Lo spazio locale', 'La terza istruzione toglie ' + S + ' a RSP, che scende a ' + HA(st.rsp) + '. Le ' + (S / 8) + ' celle fra RSP e RBP appartengono ora alla funzione. La distanza fra i due registri misura lo spazio locale: ' + S + ' byte.',
        { calc: '0x8FF0 − ' + S + ' = ' + HA(st.rsp), chiedi: { d: 'La funzione scriverà in `[rbp - ' + K + ']`. RBP vale 0x8FF0. Qual è l’indirizzo della variabile?', o: o3.map(HA), g: o3.indexOf(AV), no: 'Lo spiazzamento negativo porta verso gli indirizzi bassi: 0x8FF0 − ' + K + ' = ' + HA(AV) + '.' } });
      st.v = true;
      P({ riga: 3, cella: 'var' }, 3, 'Una variabile locale', 'L’istruzione scrive il numero 7 nei quattro byte che cominciano a ' + HA(AV) + ', cioè ' + K + ' byte sotto RBP. L’indirizzo dipende soltanto da RBP e dallo spiazzamento. Con uno spazio locale più grande RSP sarebbe più in basso, e la variabile resterebbe allo stesso posto.', { calc: '0x8FF0 − ' + K + ' = ' + HA(AV) });
      st.rsp = 0x8FF8; st.rbp = 0x9020; st.loc = false; st.v = false; st.salv = null;
      P({ riga: 4, reg: 'due' }, 4, 'LEAVE smonta il frame', 'LEAVE compie due mosse. Copia RBP in RSP, e la cima torna a 0x8FF0 restituendo in un colpo tutto lo spazio locale. Poi preleva il dato in cima, 0x9020, e lo rimette in RBP: il chiamante ritrova il proprio riferimento. RSP vale di nuovo 0x8FF8.', { calc: 'RSP = 0x8FF8 · RBP = 0x9020' });
      st.rsp = 0x9000;
      P({ riga: 5, reg: 'rsp' }, 4, 'Il ritorno', 'In cima alla pila è rimasto l’indirizzo di ritorno. RET lo preleva, lo mette in RIP e porta RSP a 0x9000. Il frame è scomparso, e il programma riprende nel chiamante.', { calc: 'RIP = 0x401234', esito: ['variabile a ' + HA(AV), 'si'] });
      return { passi, esito: HA(AV) };
    }
  },
  bilancio: {
    regola: [
      'Il prologo `push rbp`, `mov rbp, rsp`, `sub rsp, N` fissa in RBP un riferimento fermo. Sopra stanno il RBP del chiamante, in `[rbp]`, e l’indirizzo di ritorno, in `[rbp + 8]`. Sotto stanno le variabili locali.',
      'L’epilogo `leave`, `ret` restituisce lo spazio locale, ripristina RBP e torna al chiamante. La disposizione del frame è una convenzione dei compilatori: il processore non la verifica.'
    ],
    errori: [
      ['Calcolare l’indirizzo di una variabile a partire da RSP.', 'Con questo prologo le variabili si individuano da RBP, che resta fermo. RSP cambia con la quantità di spazio riservato.'],
      ['Sommare lo spiazzamento invece di sottrarlo.', 'Le variabili locali stanno sotto RBP. La cella `[rbp - 8]` ha un indirizzo più basso di RBP.'],
      ['Credere che il processore protegga le celle del frame.', 'Ogni cella della pila è memoria come le altre. Un’istruzione può scrivere ovunque arrivi il suo indirizzo.']
    ],
    saFare: ['Seguo RSP e RBP attraverso prologo ed epilogo.', 'Calcolo l’indirizzo di una variabile locale dal suo spiazzamento.', 'Dico che cosa contengono `[rbp]` e `[rbp + 8]`.'],
    esercizi: [
      { d: 'Dopo il prologo `push rbp`, `mov rbp, rsp`, `sub rsp, 32`, il registro RBP vale 0x7FE0. Quanto vale RSP? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x7FD0', giuste: ['0x7fc0', '7fc0', '7fc0h'],
        ok: 'RSP parte dallo stesso valore di RBP e scende di 32 byte, cioè 0x20: 0x7FE0 − 0x20 = 0x7FC0.',
        diagnosi: [
          { se: ['0x7fae', '7fae'], msg: 'I 32 byte vanno scritti in esadecimale prima di sottrarli: 32 = 0x20.' },
          { se: ['0x8000', '8000'], msg: 'La pila cresce verso gli indirizzi bassi: riservare spazio fa diminuire RSP.' },
          { se: ['0x7fe0', '7fe0'], msg: 'Questo è RBP, che resta fermo. RSP è sceso di 32 byte per lo spazio locale.' },
          { se: ['0x7fb8', '7fb8'], msg: 'Il PUSH è già compreso: RBP è stato fissato dopo di esso. Da RBP si tolgono soltanto i 32 byte.' }
        ],
        altro: 'Il valore è diverso. RSP e RBP coincidono dopo `mov rbp, rsp`: poi RSP scende di 32 byte.',
        indizi: ['Dopo `mov rbp, rsp` i due registri contengono lo stesso valore.', '`sub rsp, 32` toglie 32 byte, cioè 0x20.', '0x7FE0 − 0x20.'],
        svolgimento: ['Dopo `mov rbp, rsp`: RSP = RBP = 0x7FE0.', '32 = 0x20.', 'RSP = 0x7FE0 − 0x20 = 0x7FC0.'] },
      { d: 'In una funzione che comincia con `push rbp` e `mov rbp, rsp`, che cosa contiene la cella `[rbp + 8]`?', guida: 'Scegli la risposta.', o: [
        { t: 'L’indirizzo di ritorno', ok: true, fb: 'CALL lo ha posato per ultimo prima del prologo. Il PUSH del prologo lo ha lasciato una cella sopra la nuova cima, dove RBP è stato fissato.' },
        { t: 'Il RBP del chiamante', fb: 'Il RBP del chiamante sta nella cella indicata da RBP stesso, cioè in `[rbp]`.' },
        { t: 'La prima variabile locale', fb: 'Le variabili locali stanno sotto RBP, a spiazzamenti negativi.' }] }
    ],
    sfida: ['cslez2_7_02_random_assembly_02', 'Spazio locale e prologo di funzione']
  }
});
SL.unita271 = { HA: (a) => '0x' + a.toString(16).toUpperCase() };
