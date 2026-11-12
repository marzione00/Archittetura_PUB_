'use strict';
SL.registra('1.5.3', {
  titolo: 'Vettori di bit, maschere e operatori del C',
  obiettivo: 'Alla fine saprai applicare AND, OR e XOR a un intero byte, e usare una maschera per leggere, accendere, spegnere o rovesciare soltanto i bit che ti interessano.',
  concetti: [['byte', 'Byte'], ['scudo', 'Maschera'], ['porta', 'Bit a bit']],
  filigrana: ['byte', 'porta', 'scudo'],
  richiami: {
    carte: [
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'AND, OR, XOR', d: 'La AND vale 1 con entrambi gli ingressi a 1, la OR con almeno uno, la XOR quando sono diversi.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'Un byte in esadecimale', d: 'Due cifre esadecimali riassumono otto bit: 0xA5 è 1010 0101, 0x0F è 0000 1111.' },
      { sim: 'pila', da: 'Dall’unità 1.4.2', t: 'La somma ha i riporti', d: 'Nella somma ogni colonna può passare un riporto alla colonna di sinistra.' }
    ],
    domanda: { d: 'Prima di proseguire: come si scrive `0x0F` con otto bit?', o: [
      { t: '11110000', fb: 'Quello è 0xF0. La cifra F, che vale 1111, in 0x0F è a destra.' },
      { t: '00001111', ok: true, fb: 'La cifra 0 dà 0000 e la cifra F dà 1111.' },
      { t: '00010101', fb: 'Quella scrittura vale 21. La cifra esadecimale F vale quindici, cioè 1111.' }
    ] }
  },
  idea: {
    titolo: 'Otto porte affiancate',
    termini: ['operatore bit a bit', 'maschera'],
    testo: [
      'Finora una porta ha lavorato su due bit. Un processore ne mette otto in fila, una per colonna, e applica la stessa funzione a due byte interi. La prima porta riceve i due bit di sinistra, la seconda i due successivi, e così via. Ogni colonna decide per conto suo: fra una colonna e l’altra non passa nessun riporto, ed è la grande differenza rispetto alla somma.',
      'Nel linguaggio C queste operazioni si scrivono con un simbolo ciascuna: `&` per la AND, `|` per la OR, `^` per la XOR e `~` per la NOT. Si chiamano [[operatore bit a bit|operatori bit a bit]], perché trattano il byte come otto bit indipendenti, ciascuno per conto suo.',
      'Il loro uso più comune richiede un secondo byte scelto apposta, la [[maschera]]. I bit a 1 della maschera indicano le posizioni su cui si vuole agire, i bit a 0 quelle da lasciare stare. L’effetto dipende dall’operatore.',
      'Con la AND passano soltanto i bit che la maschera lascia passare: dove la maschera vale 1 il bit resta com’è, dove vale 0 il risultato è 0. Serve a leggere un pezzo di un byte. Con la OR i bit indicati dalla maschera si accendono e gli altri restano com’erano. Con la XOR i bit indicati si rovesciano. Per spegnere dei bit si usa la AND con la maschera rovesciata, che in C si scrive `x & ~m`.',
      { fig: 'celle', titolo: 'Leggere la metà bassa di 0xA5', nota: 'La maschera 0x0F lascia passare i quattro bit di destra e azzera gli altri: il risultato è 0x05.', celle: [
        { so: '1 & 0', v: '0' }, { so: '0 & 0', v: '0' }, { so: '1 & 0', v: '0' }, { so: '0 & 0', v: '0' }, { so: '0 & 1', v: '0', st: 'on' }, { so: '1 & 1', v: '1', st: 'on' }, { so: '0 & 1', v: '0', st: 'on' }, { so: '1 & 1', v: '1', st: 'on' }] },
      'Combinando due operazioni si sostituisce un pezzo di un byte senza toccare il resto. Prima si spengono i bit del pezzo con una AND, poi si scrive il valore nuovo con una OR. Per mettere 3 nella metà bassa di 0xA5 si calcola prima `0xA5 & 0xF0`, che dà 0xA0, e poi `0xA0 | 0x03`, che dà 0xA3.',
      'I programmi di sistema usano le maschere di continuo, perché molti dati sono impacchettati: quattro bit per una cosa e quattro per un’altra, oppure un bit per ciascuna di otto condizioni. Lo vedremo nell’unità 1.5.6.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai un byte, una maschera e una delle quattro operazioni. Calcoleremo il risultato una colonna alla volta, da sinistra a destra.',
      'Per ogni colonna guarda prima il bit della maschera: è lui a decidere se il bit del dato passa, si accende, si spegne o si rovescia.'
    ],
    vedrai: [
      ['byte', 'Il dato', 'La prima riga: gli otto bit del byte x.'],
      ['scudo', 'La maschera', 'La seconda riga. Le posizioni a 1 sono accese.'],
      ['porta', 'Il risultato', 'Sotto la linea. Ogni bit nasce dalla colonna sopra di lui, senza riporti.']
    ]
  },
  lab: {
    titolo: 'Una maschera, quattro operazioni',
    scena: { w: 860, h: 320 },
    atti: ['Dato e maschera', 'Le otto colonne', 'Il risultato'],
    nota: 'Le colonne sono otto. L’operazione «spegni» aggiunge un passo, perché prima rovescia la maschera.',
    controlli: [
      { id: 'x', tipo: 'scelta', eti: 'Byte x', opzioni: [[0xA5, '0xA5'], [0x3C, '0x3C'], [0xF0, '0xF0'], [0x96, '0x96']], valore: 0xA5 },
      { id: 'm', tipo: 'scelta', eti: 'Maschera m', opzioni: [[0x0F, '0x0F'], [0xF0, '0xF0'], [0x81, '0x81']], valore: 0x0F },
      { id: 'op', tipo: 'scelta', eti: 'Operazione', opzioni: [['and', 'leggi · x & m'], ['or', 'accendi · x | m'], ['xor', 'rovescia · x ^ m'], ['clr', 'spegni · x & ~m']], valore: 'and' }
    ],
    previsione: {
      domanda: (p) => 'Calcoliamo ' + ({ and: 'x & m', or: 'x | m', xor: 'x ^ m', clr: 'x & ~m' })[p.op] + ' con x = 0x' + p.x.toString(16).toUpperCase() + ' e m = 0x' + p.m.toString(16).toUpperCase().padStart(2, '0') + '. Quale byte otteniamo?',
      opzioni: (p) => { const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0'); const v = [p.x & p.m, p.x | p.m, p.x ^ p.m, p.x & ~p.m & 255, p.x]; return Array.from(new Set(v)).sort((a, b) => a - b).map((n) => [H(n), H(n)]); }
    },
    confronto: (pred, esito, p) => 'Avevi previsto ' + pred + '. Il risultato è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Riguarda la regola dell’operazione scelta: ' + ({ and: 'con la AND passano i bit di x dove la maschera vale 1, e gli altri diventano 0.', or: 'con la OR si accendono i bit dove la maschera vale 1, e gli altri restano com’erano.', xor: 'con la XOR si rovesciano i bit dove la maschera vale 1, e gli altri restano com’erano.', clr: 'la maschera viene prima rovesciata, quindi si spengono i bit dove la maschera vale 1.' })[p.op]),
    costruisci(p) {
      const el = SL.el, passi = [];
      const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
      const B8 = (v) => v.toString(2).padStart(8, '0').split('').map(Number);
      const X = B8(p.x), Mo = B8(p.m);
      const SIM = { and: '&', or: '|', xor: '^', clr: '&' }[p.op], SCRITTA = { and: 'x & m', or: 'x | m', xor: 'x ^ m', clr: 'x & ~m' }[p.op];
      let M = Mo.slice(), rovesciata = false;
      const F = (a, b) => (p.op === 'or' ? a | b : p.op === 'xor' ? a ^ b : a & b);
      const ris = Array(8).fill(null);
      const col = (j) => 190 + j * 68;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('n1', 40, 54, 'x = ' + H(p.x), 'mono'), el.nota('n2', 40, 122, rovesciata ? '~m = ' + H(~p.m & 255) : 'm = ' + H(p.m), 'mono', o.masc ? 'att' : ''), el.nota('n3', 40, 206, SCRITTA, 'mono', 'att'), el.linea('li', 190, 176, 726, 176, 'att')];
        for (let j = 0; j < 8; j++) {
          els.push(el.cella('x' + j, col(j), 36, 58, 52, String(X[j]), o.col === j ? 'att' : X[j] ? 'on' : 'zero', { piccola: true, so: 'bit ' + (7 - j) }));
          els.push(el.cella('m' + j, col(j), 104, 58, 52, String(M[j]), o.col === j || o.masc ? 'att' : M[j] ? 'on' : 'zero', { piccola: true }));
          els.push(el.cella('r' + j, col(j), 190, 58, 56, ris[j] === null ? '·' : String(ris[j]), o.col === j ? 'att' : ris[j] === null ? 'off' : ris[j] ? 'on' : 'zero', { piccola: true }));
        }
        els.push(el.box('rs', 190, 262, 300, 50, null, ris.includes(null) ? 'risultato: ·' : 'risultato: ' + H(parseInt(ris.join(''), 2)), o.fine ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (j) => [['Operazione', SCRITTA, 'a'], ['Colonna', j == null ? '·' : 'bit ' + (7 - j)], ['Risultato finora', ris.map((v) => (v === null ? '·' : v)).join(''), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.col), els: quadro(o) }, extra));
      const regola = (j) => { const a = X[j], b = M[j];
        if (p.op === 'or') return b ? 'La maschera vale 1, quindi il risultato è 1 qualunque sia il bit di x.' : 'La maschera vale 0, quindi il bit di x passa così com’è: ' + a + '.';
        if (p.op === 'xor') return b ? 'La maschera vale 1, quindi il bit di x viene rovesciato: da ' + a + ' a ' + (1 - a) + '.' : 'La maschera vale 0, quindi il bit di x passa così com’è: ' + a + '.';
        return b ? 'La maschera vale 1, quindi il bit di x passa così com’è: ' + a + '.' : 'La maschera vale 0, quindi il risultato è 0 qualunque sia il bit di x.'; };
      const domanda = (j) => ({ d: 'Nella colonna del bit ' + (7 - j) + ' il dato vale ' + X[j] + ' e la maschera vale ' + M[j] + '. Quanto vale ' + X[j] + ' ' + SIM + ' ' + M[j] + '?', o: ['0', '1'], g: F(X[j], M[j]), no: regola(j) });

      P({}, 0, 'Il dato e la maschera', 'Il byte x vale ' + H(p.x) + ' e la maschera m vale ' + H(p.m) + '. L’operazione è ' + SCRITTA + '. Ogni colonna verrà calcolata per conto suo, senza riporti.', p.op === 'clr' ? {} : { chiedi: domanda(0) });
      if (p.op === 'clr') {
        M = Mo.map((b) => 1 - b); rovesciata = true;
        P({ masc: true }, 0, 'La maschera viene rovesciata', 'Per spegnere dei bit serve una maschera che valga 0 proprio su quelli. L’operatore ~ rovescia tutti i bit di m: da ' + H(p.m) + ' si ottiene ' + H(~p.m & 255) + '. Poi si procede con una AND.', { calc: '~' + H(p.m) + ' = ' + H(~p.m & 255), chiedi: domanda(0) });
      }
      for (let j = 0; j < 8; j++) {
        ris[j] = F(X[j], M[j]);
        P({ col: j }, 1, 'La colonna del bit ' + (7 - j), regola(j), Object.assign({ calc: X[j] + ' ' + SIM + ' ' + M[j] + ' = ' + ris[j] }, j === 3 ? { chiedi: domanda(4) } : {}));
      }
      const r = parseInt(ris.join(''), 2);
      P({ fine: true }, 2, 'Il risultato in esadecimale', 'Gli otto bit del risultato sono ' + ris.join('') + ', cioè ' + H(r) + '.', { calc: SCRITTA + ' = ' + H(r) });
      P({ fine: true }, 2, 'Che cosa è successo al byte', ({
        and: 'I bit di x nelle posizioni scelte dalla maschera sono passati intatti. Tutti gli altri sono diventati 0. Abbiamo letto un pezzo del byte.',
        or: 'I bit nelle posizioni scelte dalla maschera valgono ora 1. Tutti gli altri sono rimasti com’erano.',
        xor: 'I bit nelle posizioni scelte dalla maschera sono stati rovesciati. Tutti gli altri sono rimasti com’erano. Ripetendo la stessa operazione si tornerebbe a ' + H(p.x) + '.',
        clr: 'I bit nelle posizioni scelte dalla maschera originale valgono ora 0. Tutti gli altri sono rimasti com’erano.' })[p.op], { calc: H(p.x) + ' → ' + H(r) });
      return { passi, esito: H(r) };
    }
  },
  bilancio: {
    regola: [
      'Gli operatori bit a bit applicano una porta a ogni colonna di due byte, senza riporti fra le colonne.',
      'Con una maschera, la AND legge i bit scelti, la OR li accende, la XOR li rovescia, e la AND con la maschera rovesciata li spegne.'
    ],
    errori: [
      ['Aspettarsi un riporto.', 'Nelle operazioni bit a bit ogni colonna è indipendente. In 1 | 1 il risultato è 1, senza nulla da riportare.'],
      ['Usare la AND per accendere.', 'La AND può soltanto lasciar passare o azzerare. Per portare un bit a 1 serve la OR.'],
      ['Scrivere il campo nuovo senza spegnere quello vecchio.', 'La OR non cancella gli 1 già presenti. Prima si spegne il campo con una AND, poi si inserisce il valore.']
    ],
    saFare: ['Calcolo AND, OR e XOR fra due byte, colonna per colonna.', 'Scelgo la maschera e l’operatore per leggere, accendere, spegnere o rovesciare dei bit.', 'Sostituisco un campo di un byte in due mosse.'],
    esercizi: [
      { d: 'Quanto vale `0xA5 & 0x0F`? Scrivi il risultato in esadecimale.', segnaposto: 'Due cifre esadecimali', giuste: ['05', '0x05', '5', '0x5'],
        ok: 'La maschera lascia passare i quattro bit bassi di 0xA5, che sono 0101.',
        diagnosi: [
          { se: ['af', '0xaf'], msg: 'Quello è il risultato della OR. Con la AND dove la maschera vale 0 il risultato è 0.' },
          { se: ['a0', '0xa0'], msg: 'Hai tenuto la metà alta. La maschera 0x0F vale 1 sui quattro bit di destra.' },
          { se: ['aa', '0xaa'], msg: 'Quello è il risultato della XOR, che rovescia i bit scelti. La AND li lascia passare e azzera gli altri.' }
        ],
        altro: 'Il risultato è diverso. Scrivi i due byte in binario, uno sotto l’altro, e applica la AND a ogni colonna.',
        indizi: ['0xA5 è 1010 0101 e 0x0F è 0000 1111.', 'Nelle quattro colonne di sinistra la maschera vale 0.', 'Nelle quattro colonne di destra passano i bit 0101.'],
        svolgimento: ['1010 0101 & 0000 1111.', 'Colonne di sinistra: tutte 0. Colonne di destra: 0101.', 'Il risultato è 0000 0101, cioè 0x05.'] },
      { d: 'Quale espressione accende il bit più a sinistra di x e lascia gli altri sette com’erano?', guida: 'Scegli la risposta.', o: [
        { t: 'x & 0x80', fb: 'La AND azzera i sette bit di destra, e lascia il primo com’era senza accenderlo.' },
        { t: 'x | 0x80', ok: true, fb: 'La maschera 0x80 vale 1 soltanto sul bit di sinistra, e la OR lo porta a 1.' },
        { t: 'x ^ 0x80', fb: 'La XOR rovescia quel bit: lo accende se era spento, e lo spegne se era già acceso.' }] }
    ],
    sfida: ['lez05_02_bitwise_on_bytes', 'Operazioni bit a bit su un byte']
  }
});
