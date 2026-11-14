'use strict';
SL.registra('1.5.3', {
  titolo: 'Vettori di bit, maschere e operatori del C',
  obiettivo: 'Obiettivo: applicare AND, OR e XOR a un intero byte, e impiegare una maschera per leggere, accendere, spegnere o invertire soltanto i bit di interesse.',
  concetti: [['byte', 'Byte'], ['scudo', 'Maschera'], ['porta', 'Bit a bit']],
  filigrana: ['byte', 'porta', 'scudo'],
  richiami: {
    carte: [
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'AND, OR, XOR', d: 'La AND vale 1 con entrambi gli ingressi a 1, la OR con almeno uno, la XOR quando sono diversi.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'Un byte in esadecimale', d: 'Due cifre esadecimali rappresentano otto bit: 0xA5 è 1010 0101, 0x0F è 0000 1111.' },
      { sim: 'pila', da: 'Dall’unità 1.4.2', t: 'La somma ha i riporti', d: 'Nella somma ogni colonna può trasferire un riporto alla colonna di sinistra.' }
    ],
    domanda: { d: 'Prima di proseguire: come si scrive `0x0F` con otto bit?', o: [
      { t: '11110000', fb: 'La scrittura indicata corrisponde a 0xF0. La cifra F, che vale 1111, in 0x0F si trova a destra.' },
      { t: '00001111', ok: true, fb: 'La cifra 0 dà 0000 e la cifra F dà 1111.' },
      { t: '00010101', fb: 'La scrittura indicata vale 21. La cifra esadecimale F vale quindici, cioè 1111.' }
    ] }
  },
  idea: {
    titolo: 'Otto porte affiancate',
    termini: ['operatore bit a bit', 'maschera'],
    testo: [
      'Finora una porta ha operato su due bit. Un processore ne affianca otto, una per colonna, e applica la medesima funzione a due byte interi. La prima porta riceve i due bit di sinistra, la seconda i due successivi, e così di seguito. Ogni colonna è indipendente dalle altre: nessun riporto passa da una colonna all’altra, e in ciò consiste la differenza sostanziale rispetto alla somma.',
      'Nel linguaggio C queste operazioni si scrivono con un simbolo ciascuna: `&` per la AND, `|` per la OR, `^` per la XOR e `~` per la NOT. Prendono il nome di [[operatore bit a bit|operatori bit a bit]], poiché trattano il byte come otto bit indipendenti.',
      'Il loro impiego più comune richiede un secondo byte scelto opportunamente, la [[maschera]]. I bit a 1 della maschera indicano le posizioni sulle quali agire, i bit a 0 quelle da lasciare invariate. L’effetto dipende dall’operatore.',
      'Con la AND si conservano soltanto i bit selezionati dalla maschera: dove la maschera vale 1 il bit resta invariato, dove vale 0 il risultato è 0. L’operazione serve a leggere una parte di un byte. Con la OR i bit indicati dalla maschera si accendono e gli altri restano invariati. Con la XOR i bit indicati si invertono. Per spegnere alcuni bit si impiega la AND con la maschera invertita, che in C si scrive `x & ~m`.',
      { fig: 'celle', titolo: 'Lettura della metà bassa di 0xA5', nota: 'La maschera 0x0F conserva i quattro bit di destra e azzera gli altri: il risultato è 0x05.', celle: [
        { so: '1 & 0', v: '0' }, { so: '0 & 0', v: '0' }, { so: '1 & 0', v: '0' }, { so: '0 & 0', v: '0' }, { so: '0 & 1', v: '0', st: 'on' }, { so: '1 & 1', v: '1', st: 'on' }, { so: '0 & 1', v: '0', st: 'on' }, { so: '1 & 1', v: '1', st: 'on' }] },
      'La combinazione di due operazioni consente di sostituire una parte di un byte lasciando invariato il resto. Dapprima si spengono i bit della parte con una AND, poi si scrive il nuovo valore con una OR. Per porre 3 nella metà bassa di 0xA5 si calcola prima `0xA5 & 0xF0`, che dà 0xA0, e poi `0xA0 | 0x03`, che dà 0xA3.',
      'I programmi di sistema impiegano costantemente le maschere, poiché molti dati sono compattati: quattro bit per un’informazione e quattro per un’altra, oppure un bit per ciascuna di otto condizioni. L’argomento è ripreso nell’unità 1.5.6.'
    ]
  },
  esperimento: {
    faremo: [
      'Scelti un byte, una maschera e una delle quattro operazioni, il risultato è calcolato una colonna alla volta, da sinistra a destra.',
      'In ogni colonna va considerato per primo il bit della maschera, che stabilisce se il bit del dato resti invariato, si accenda, si spenga o si inverta.'
    ],
    vedrai: [
      ['byte', 'Il dato', 'La prima riga: gli otto bit del byte x.'],
      ['scudo', 'La maschera', 'La seconda riga. Le posizioni a 1 sono accese.'],
      ['porta', 'Il risultato', 'Sotto la linea. Ogni bit deriva dalla colonna soprastante, senza riporti.']
    ]
  },
  lab: {
    titolo: 'Una maschera, quattro operazioni',
    scena: { w: 860, h: 320 },
    atti: ['Dato e maschera', 'Le otto colonne', 'Il risultato'],
    nota: 'Le colonne sono otto. Lo spegnimento aggiunge un passo, poiché inverte dapprima la maschera.',
    controlli: [
      { id: 'x', tipo: 'scelta', eti: 'Byte x', opzioni: [[0xA5, '0xA5'], [0x3C, '0x3C'], [0xF0, '0xF0'], [0x96, '0x96']], valore: 0xA5 },
      { id: 'm', tipo: 'scelta', eti: 'Maschera m', opzioni: [[0x0F, '0x0F'], [0xF0, '0xF0'], [0x81, '0x81']], valore: 0x0F },
      { id: 'op', tipo: 'scelta', eti: 'Operazione', opzioni: [['and', 'lettura · x & m'], ['or', 'accensione · x | m'], ['xor', 'inversione · x ^ m'], ['clr', 'spegnimento · x & ~m']], valore: 'and' }
    ],
    previsione: {
      domanda: (p) => 'Si calcola ' + ({ and: 'x & m', or: 'x | m', xor: 'x ^ m', clr: 'x & ~m' })[p.op] + ' con x = 0x' + p.x.toString(16).toUpperCase() + ' e m = 0x' + p.m.toString(16).toUpperCase().padStart(2, '0') + '. Quale byte si ottiene?',
      opzioni: (p) => { const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0'); const v = [p.x & p.m, p.x | p.m, p.x ^ p.m, p.x & ~p.m & 255, p.x]; return Array.from(new Set(v)).sort((a, b) => a - b).map((n) => [H(n), H(n)]); }
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + '. Il risultato è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Va riesaminata la regola dell’operazione scelta: ' + ({ and: 'con la AND si conservano i bit di x dove la maschera vale 1, e gli altri diventano 0.', or: 'con la OR si accendono i bit dove la maschera vale 1, e gli altri restano invariati.', xor: 'con la XOR si invertono i bit dove la maschera vale 1, e gli altri restano invariati.', clr: 'la maschera viene dapprima invertita, e si spengono quindi i bit dove la maschera vale 1.' })[p.op]),
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
      const hud = (j) => [['Operazione', SCRITTA, 'a'], ['Colonna', j == null ? '·' : 'bit ' + (7 - j)], ['Risultato parziale', ris.map((v) => (v === null ? '·' : v)).join(''), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o.col), els: quadro(o) }, extra));
      const regola = (j) => { const a = X[j], b = M[j];
        if (p.op === 'or') return b ? 'La maschera vale 1, quindi il risultato è 1 qualunque sia il bit di x.' : 'La maschera vale 0, e il bit di x resta quindi invariato: ' + a + '.';
        if (p.op === 'xor') return b ? 'La maschera vale 1, e il bit di x viene quindi invertito: da ' + a + ' a ' + (1 - a) + '.' : 'La maschera vale 0, e il bit di x resta quindi invariato: ' + a + '.';
        return b ? 'La maschera vale 1, e il bit di x resta quindi invariato: ' + a + '.' : 'La maschera vale 0, quindi il risultato è 0 qualunque sia il bit di x.'; };
      const domanda = (j) => ({ d: 'Nella colonna del bit ' + (7 - j) + ' il dato vale ' + X[j] + ' e la maschera vale ' + M[j] + '. Quanto vale ' + X[j] + ' ' + SIM + ' ' + M[j] + '?', o: ['0', '1'], g: F(X[j], M[j]), no: regola(j) });

      P({}, 0, 'Il dato e la maschera', 'Il byte x vale ' + H(p.x) + ' e la maschera m vale ' + H(p.m) + '. L’operazione è ' + SCRITTA + '. Ogni colonna è calcolata indipendentemente, senza riporti.', p.op === 'clr' ? {} : { chiedi: domanda(0) });
      if (p.op === 'clr') {
        M = Mo.map((b) => 1 - b); rovesciata = true;
        P({ masc: true }, 0, 'Inversione della maschera', 'Per spegnere alcuni bit occorre una maschera che valga 0 esattamente su di essi. L’operatore ~ inverte tutti i bit di m: da ' + H(p.m) + ' si ottiene ' + H(~p.m & 255) + '. Si procede quindi con una AND.', { calc: '~' + H(p.m) + ' = ' + H(~p.m & 255), chiedi: domanda(0) });
      }
      for (let j = 0; j < 8; j++) {
        ris[j] = F(X[j], M[j]);
        P({ col: j }, 1, 'La colonna del bit ' + (7 - j), regola(j), Object.assign({ calc: X[j] + ' ' + SIM + ' ' + M[j] + ' = ' + ris[j] }, j === 3 ? { chiedi: domanda(4) } : {}));
      }
      const r = parseInt(ris.join(''), 2);
      P({ fine: true }, 2, 'Il risultato in esadecimale', 'Gli otto bit del risultato sono ' + ris.join('') + ', cioè ' + H(r) + '.', { calc: SCRITTA + ' = ' + H(r) });
      P({ fine: true }, 2, 'Effetto sul byte', ({
        and: 'I bit di x nelle posizioni scelte dalla maschera sono rimasti invariati. Tutti gli altri sono diventati 0. È stata letta una parte del byte.',
        or: 'I bit nelle posizioni scelte dalla maschera valgono ora 1. Tutti gli altri sono rimasti invariati.',
        xor: 'I bit nelle posizioni scelte dalla maschera sono stati invertiti. Tutti gli altri sono rimasti invariati. Ripetendo la stessa operazione si tornerebbe a ' + H(p.x) + '.',
        clr: 'I bit nelle posizioni scelte dalla maschera originale valgono ora 0. Tutti gli altri sono rimasti invariati.' })[p.op], { calc: H(p.x) + ' → ' + H(r) });
      return { passi, esito: H(r) };
    }
  },
  bilancio: {
    regola: [
      'Gli operatori bit a bit applicano una porta a ogni colonna di due byte, senza riporti fra le colonne.',
      'Con una maschera, la AND legge i bit scelti, la OR li accende, la XOR li inverte, e la AND con la maschera invertita li spegne.'
    ],
    errori: [
      ['Attendersi un riporto.', 'Nelle operazioni bit a bit ogni colonna è indipendente. In 1 | 1 il risultato è 1, senza alcun riporto.'],
      ['Usare la AND per accendere.', 'La AND può soltanto conservare o azzerare. Per portare un bit a 1 occorre la OR.'],
      ['Scrivere il nuovo campo senza spegnere il precedente.', 'La OR non cancella gli 1 già presenti. Prima si spegne il campo con una AND, poi si inserisce il valore.']
    ],
    saFare: ['Calcolare AND, OR e XOR fra due byte, colonna per colonna.', 'Scegliere la maschera e l’operatore per leggere, accendere, spegnere o invertire alcuni bit.', 'Sostituire un campo di un byte in due passaggi.'],
    esercizi: [
      { d: 'Quanto vale `0xA5 & 0x0F`? Si scriva il risultato in esadecimale.', segnaposto: 'Due cifre esadecimali', giuste: ['05', '0x05', '5', '0x5'],
        ok: 'La maschera conserva i quattro bit bassi di 0xA5, che sono 0101.',
        diagnosi: [
          { se: ['af', '0xaf'], msg: 'Il valore indicato è il risultato della OR. Con la AND dove la maschera vale 0 il risultato è 0.' },
          { se: ['a0', '0xa0'], msg: 'È stata conservata la metà alta. La maschera 0x0F vale 1 sui quattro bit di destra.' },
          { se: ['aa', '0xaa'], msg: 'Il valore indicato è il risultato della XOR, che inverte i bit scelti. La AND li conserva e azzera gli altri.' }
        ],
        altro: 'Il risultato è diverso. Si scrivano i due byte in binario, uno sotto l’altro, e si applichi la AND a ogni colonna.',
        indizi: ['0xA5 è 1010 0101 e 0x0F è 0000 1111.', 'Nelle quattro colonne di sinistra la maschera vale 0.', 'Nelle quattro colonne di destra si conservano i bit 0101.'],
        svolgimento: ['1010 0101 & 0000 1111.', 'Colonne di sinistra: tutte 0. Colonne di destra: 0101.', 'Il risultato è 0000 0101, cioè 0x05.'] },
      { d: 'Quale espressione accende il bit più a sinistra di x e lascia invariati gli altri sette?', guida: 'Si scelga la risposta.', o: [
        { t: 'x & 0x80', fb: 'La AND azzera i sette bit di destra, e lascia invariato il primo senza accenderlo.' },
        { t: 'x | 0x80', ok: true, fb: 'La maschera 0x80 vale 1 soltanto sul bit di sinistra, e la OR lo porta a 1.' },
        { t: 'x ^ 0x80', fb: 'La XOR inverte tale bit: lo accende se era spento, e lo spegne se era già acceso.' }] }
    ],
    sfida: ['lez05_02_bitwise_on_bytes', 'Operazioni bit a bit su un byte']
  }
});
