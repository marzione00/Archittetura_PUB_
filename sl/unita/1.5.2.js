'use strict';
SL.registra('1.5.2', {
  titolo: 'Dalla tabella di verità al circuito',
  obiettivo: 'Obiettivo: costruire, per qualunque tabella di verità, un circuito di porte AND, OR e NOT che la realizzi, mediante un procedimento di validità generale.',
  concetti: [['tabella', 'Tabella'], ['porta', 'Mintermine'], ['mux', 'Somma']],
  filigrana: ['tabella', 'porta', 'mux'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 1.5.1', t: 'La tabella di verità', d: 'Riporta l’uscita di una funzione per ogni combinazione degli ingressi. Con due ingressi ha quattro righe.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'AND, OR, NOT', d: 'La AND vale 1 quando tutti gli ingressi valgono 1, la OR quando almeno uno vale 1. La NOT inverte il proprio ingresso.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'Le porte in cascata', d: 'L’uscita di una porta può costituire l’ingresso di un’altra. Il circuito si risolve seguendo il verso del segnale.' }
    ],
    domanda: { d: 'Prima di proseguire: una porta AND riceve A e l’uscita di una NOT applicata a B. Con quali ingressi dà 1?', o: [
      { t: 'A = 1, B = 1', fb: 'La NOT trasforma B = 1 in 0, e una AND con un ingresso a 0 dà 0.' },
      { t: 'A = 1, B = 0', ok: true, fb: 'La NOT trasforma B = 0 in 1. La AND riceve 1 e 1.' },
      { t: 'A = 0, B = 0', fb: 'Con A = 0 la AND dà 0, qualunque valore giunga dall’altro ingresso.' }
    ] }
  },
  idea: {
    titolo: 'Una porta AND per ogni riga vera',
    termini: ['mintermine', 'somma di mintermini'],
    testo: [
      'L’unità 1.5.1 ha ricavato la tabella a partire da una porta. Il progetto di un circuito pone il problema inverso: è nota la funzione da ottenere, cioè la tabella, e occorre determinare le porte. Esiste un procedimento che fornisce sempre una soluzione, per qualunque tabella.',
      'Si considera dapprima una riga in cui l’uscita deve valere 1, per esempio quella con A = 1 e B = 0. Si costruisce un circuito elementare che riconosce tale riga e nessun’altra. È sufficiente una AND, alla quale A giunge direttamente e B attraverso una NOT. La AND dà 1 quando A vale 1 e B vale 0, e dà 0 in tutte le altre righe. Un riconoscitore di questo tipo prende il nome di [[mintermine]].',
      'La regola di costruzione è meccanica. Gli ingressi che nella riga valgono 1 entrano nella AND senza modifiche; quelli che valgono 0 attraversano prima una NOT.',
      'Si ripete l’operazione per ogni riga in cui l’uscita deve valere 1, e si collegano tutti i riconoscitori a una OR finale. L’uscita vale 1 quando si attiva almeno un riconoscitore, cioè esattamente nelle righe richieste. Il circuito ottenuto prende il nome di [[somma di mintermini]].',
      { fig: 'scena', w: 700, h: 150, titolo: 'La XOR come somma di due mintermini', nota: 'Il primo riconoscitore si attiva nella riga 01, il secondo nella riga 10. La OR li unisce.', els: [
        SL.el.box('m1', 10, 8, 330, 58, 'riconosce A = 0, B = 1', 'NOT A AND B', 'on', { cls: 'stretta' }),
        SL.el.box('m2', 10, 84, 330, 58, 'riconosce A = 1, B = 0', 'A AND NOT B', 'on', { cls: 'stretta' }),
        SL.el.linea('l1', 340, 37, 460, 75, 'on'), SL.el.linea('l2', 340, 113, 460, 75, 'on'),
        SL.el.box('or', 460, 44, 230, 62, 'porta OR', 'Y', 'att', { sim: 'porta', riga: true })] },
      'Il procedimento ha una portata generale. Esso dimostra che con AND, OR e NOT è possibile costruire qualunque funzione booleana, con qualsiasi numero di ingressi. Ogni calcolo eseguito da un processore si riduce, in ultima analisi, a queste tre funzioni.',
      'Il circuito ottenuto è corretto, e solo di rado è il minimo possibile. La riduzione del numero di porte è un problema distinto, trattato nel Modulo III.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento considera una funzione di due ingressi descritta a parole. Si esaminano le quattro righe della relativa tabella e, per ogni riga che deve dare 1, si costruisce il riconoscitore.',
      'Al termine i riconoscitori sono uniti da una OR e il circuito è verificato su tutte le quattro combinazioni.'
    ],
    vedrai: [
      ['tabella', 'La tabella richiesta', 'A sinistra: per ogni combinazione di A e B, l’uscita che il circuito deve fornire.'],
      ['porta', 'I riconoscitori', 'Al centro: una AND per ogni riga vera, con le NOT necessarie.'],
      ['mux', 'La OR finale', 'A destra: raccoglie i riconoscitori e produce l’uscita Y.']
    ]
  },
  lab: {
    titolo: 'Costruzione di un circuito da una tabella',
    scena: { w: 860, h: 300 },
    atti: ['La tabella richiesta', 'I riconoscitori', 'La OR finale', 'La prova'],
    nota: 'Il numero di passi dipende dalla funzione: ogni riga vera richiede due passi, ogni riga falsa uno.',
    controlli: [{ id: 'f', tipo: 'scelta', eti: 'L’uscita vale 1 quando', opzioni: [['diversi', 'A e B sono diversi'], ['almeno', 'almeno uno vale 1'], ['uguali', 'A e B sono uguali'], ['soloA', 'vale 1 soltanto A'], ['mai', 'non valgono 1 entrambi']], valore: 'diversi' }],
    previsione: {
      domanda: (p) => 'Si costruisce il circuito per la funzione che vale 1 quando ' + ({ diversi: 'A e B sono diversi', almeno: 'almeno uno dei due vale 1', uguali: 'A e B sono uguali', soloA: 'vale 1 soltanto A', mai: 'A e B non valgono 1 entrambi' })[p.f] + '. Quante porte NOT occorreranno complessivamente?',
      opzioni: () => [0, 1, 2, 3, 4]
    },
    confronto: (pred, esito) => 'La previsione indicava ' + pred + ' porte NOT. Ne occorrono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Vanno contati gli zeri che compaiono fra gli ingressi delle righe vere: ogni zero richiede una NOT nel relativo riconoscitore.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const Y = { diversi: [0, 1, 1, 0], almeno: [0, 1, 1, 1], uguali: [1, 0, 0, 1], soloA: [0, 0, 1, 0], mai: [1, 1, 1, 0] }[p.f];
      const termine = (r) => ((r >> 1) & 1 ? 'A' : 'NOT A') + ' AND ' + (r & 1 ? 'B' : 'NOT B');
      const nNot = (r) => 2 - ((r >> 1) & 1) - (r & 1);
      const vere = [0, 1, 2, 3].filter((r) => Y[r]);
      const fatti = [];           // righe per cui il riconoscitore è già costruito
      let conNot = 0, orPronta = false;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'LA TABELLA VOLUTA', 'mono'), el.nota('t2', 270, 0, 'I RICONOSCITORI', 'mono')];
        for (let r = 0; r < 4; r++) {
          const v = [(r >> 1) & 1, r & 1, Y[r]];
          v.forEach((x, c) => els.push(el.cella('t' + r + c, 40 + c * 56, 50 + r * 50, 48, 40, String(x), o.riga === r ? 'att' : c === 2 && x ? 'on' : 'zero', { piccola: true, so: r === 0 ? ['A', 'B', 'Y'][c] : null })));
        }
        fatti.forEach((r, k) => {
          const scatta = o.prova != null && o.prova === r;
          els.push(el.box('m' + r, 270, 30 + k * 82, 300, 66, 'riconosce A = ' + ((r >> 1) & 1) + ', B = ' + (r & 1), o.bozza === r ? '· AND ·' : termine(r), o.nuovo === r ? 'att' : scatta ? 'on' : o.prova != null ? 'off' : '', { cls: 'stretta' }));
          if (orPronta) els.push(el.linea('l' + r, 570, 63 + k * 82, 650, vere.length > 1 ? 145 : 63, scatta ? 'on' : ''));
        });
        if (orPronta) els.push(el.box('or', 650, vere.length > 1 ? 112 : 30, 180, 66, vere.length > 1 ? 'porta OR' : 'uscita diretta', o.prova != null ? 'Y = ' + (o.y) : 'Y', o.or ? 'att' : o.prova != null ? (o.y ? 'on' : 'zero') : '', { sim: 'porta', riga: true }));
        return els;
      };
      const hud = () => [['Righe vere', vere.length, 'a'], ['Porte AND', fatti.length], ['Porte NOT', conNot, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const domanda = (r) => ({ d: 'La riga A = ' + ((r >> 1) & 1) + ', B = ' + (r & 1) + ' deve dare 1. Quale ingresso deve attraversare una NOT affinché la AND riconosca esattamente questa riga?', o: ['A', 'B', 'Nessuno', 'Entrambi'], g: [3, 0, 1, 2][r], no: 'Attraversano la NOT gli ingressi che nella riga valgono 0. In tal modo tutti gli ingressi della AND valgono 1 in questa riga, e in nessun’altra.' });

      P({}, 0, 'La funzione da realizzare', 'La colonna Y della tabella specifica il comportamento richiesto al circuito. Le righe in cui Y vale 1 sono ' + vere.length + (vere.length === 1 ? ': occorrerà un solo riconoscitore.' : ': occorrerà un riconoscitore per ciascuna.'));
      for (let r = 0; r < 4; r++) {
        const a = (r >> 1) & 1, b = r & 1;
        if (!Y[r]) { P({ riga: r }, 1, 'Riga ' + a + b + ': uscita 0', 'In questa riga il circuito deve dare 0. Nessun riconoscitore è necessario: è sufficiente che nessuno degli altri si attivi.', { calc: 'riga ' + a + b + ' → nessuna porta' }); continue; }
        fatti.push(r);
        P({ riga: r, nuovo: r, bozza: r }, 1, 'Riga ' + a + b + ': occorre un riconoscitore', 'In questa riga il circuito deve dare 1. Si predispone una porta AND a due ingressi, che dovrà attivarsi soltanto con A = ' + a + ' e B = ' + b + '.', { chiedi: domanda(r) });
        conNot += nNot(r);
        P({ riga: r, nuovo: r }, 1, 'Il riconoscitore ' + termine(r), (nNot(r) === 0 ? 'Entrambi gli ingressi valgono 1 in questa riga, ed entrano quindi nella AND senza modifiche.' : nNot(r) === 2 ? 'Entrambi gli ingressi valgono 0 in questa riga, e attraversano quindi entrambi una NOT.' : 'L’ingresso ' + (a ? 'B' : 'A') + ' vale 0 in questa riga e attraversa una NOT. L’ingresso ' + (a ? 'A' : 'B') + ' vale 1 ed entra direttamente.') + ' La porta si attiva in questa riga e in nessun’altra.', { calc: termine(r) + ' · NOT impiegate finora: ' + conNot });
      }
      orPronta = true;
      P({ or: true }, 2, vere.length > 1 ? 'La OR unisce i riconoscitori' : 'Un solo riconoscitore', vere.length > 1
        ? 'Le uscite dei ' + vere.length + ' riconoscitori entrano in una porta OR. L’uscita Y vale 1 quando se ne attiva almeno uno. Il circuito è completo: ' + vere.map(termine).map((t) => '(' + t + ')').join(' OR ') + '.'
        : 'La tabella ha una sola riga vera, e il riconoscitore costituisce quindi l’intero circuito: la sua uscita è Y, senza necessità di una OR.', { calc: 'Y = ' + vere.map(termine).map((t) => (vere.length > 1 ? '(' + t + ')' : t)).join(' OR ') });
      for (let r = 0; r < 4; r++) {
        const a = (r >> 1) & 1, b = r & 1;
        P({ riga: r, prova: Y[r] ? r : -1, y: Y[r] }, 3, 'Collaudo con A = ' + a + ', B = ' + b, Y[r] ? 'Si attiva il riconoscitore ' + termine(r) + ', e Y vale 1. La tabella richiedeva 1.' : 'Nessun riconoscitore si attiva, e Y vale 0. La tabella richiedeva 0.', { calc: 'A = ' + a + ', B = ' + b + ' → Y = ' + Y[r], esito: ['come la tabella', 'si'] });
      }
      return { passi, esito: conNot };
    }
  },
  bilancio: {
    regola: [
      'Per ogni riga in cui l’uscita deve valere 1 si costruisce un mintermine: una AND in cui gli ingressi che valgono 0 attraversano una NOT.',
      'I mintermini si uniscono con una OR. Il circuito realizza la tabella esattamente, e il procedimento vale per qualunque numero di ingressi.'
    ],
    errori: [
      ['Costruire riconoscitori per le righe false.', 'Le righe con uscita 0 non richiedono porte. È sufficiente che in tali righe nessun riconoscitore si attivi.'],
      ['Porre la NOT sugli ingressi a 1.', 'Attraversano la NOT gli ingressi che nella riga valgono 0, poiché la AND richiede tutti gli ingressi a 1.'],
      ['Unire i riconoscitori con una AND.', 'Due riconoscitori di righe diverse non si attivano mai contemporaneamente. Per unirli occorre la OR.']
    ],
    saFare: ['Scrivere il mintermine di una riga della tabella.', 'Costruire la somma di mintermini di una funzione.', 'Verificare il circuito su tutte le combinazioni.'],
    esercizi: [
      { d: 'Una funzione ha tre ingressi, A, B e C. Qual è il mintermine che riconosce la riga A = 0, B = 1, C = 1?', guida: 'Si scelga la risposta.', o: [
        { t: 'A AND NOT B AND NOT C', fb: 'Le NOT sono collocate in modo errato. Vanno poste sugli ingressi che nella riga valgono 0, e in questo caso l’unico è A.' },
        { t: 'NOT A AND B AND C', ok: true, fb: 'A vale 0 e attraversa la NOT. B e C valgono 1 ed entrano direttamente.' },
        { t: 'NOT A OR B OR C', fb: 'Una OR si attiverebbe in molte righe. Un riconoscitore deve attivarsi in una sola, e impiega per questo la AND.' }] },
      { d: 'La tabella di una funzione di tre ingressi ha uscita 1 in cinque righe. Quante porte AND contiene la sua somma di mintermini?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Un mintermine, cioè una AND, per ogni riga vera.',
        diagnosi: [
          { se: ['8', 'otto'], msg: 'Otto sono tutte le righe della tabella. I riconoscitori occorrono soltanto per le righe con uscita 1.' },
          { se: ['3', 'tre'], msg: 'Tre è il numero degli ingressi. Le AND sono tante quante le righe vere.' }
        ],
        altro: 'Il numero è diverso. Ogni riga con uscita 1 riceve un riconoscitore, e ogni riconoscitore è una AND.',
        indizi: ['Le righe con uscita 0 non richiedono porte.', 'Ogni riga con uscita 1 ha il proprio mintermine.', 'Le righe vere sono cinque.'],
        svolgimento: ['Righe vere: 5.', 'Un mintermine per riga vera.', 'Porte AND: 5, unite da una OR.'] }
    ],
    sfida: ['lez05_05_truth_table_rows', 'Costruire una tabella di verità']
  }
});
