'use strict';
SL.registra('2.4.2', {
  titolo: 'Un solo bit a uno in posizione k',
  obiettivo: 'Obiettivo: costruire la maschera di un bit e impiegarla per accenderlo, spegnerlo, invertirlo oppure leggerlo.',
  concetti: [['bit', 'La maschera di un bit'], ['porta', 'OR, AND, XOR'], ['flag', 'Leggere con TEST']],
  filigrana: ['bit', 'porta', 'flag'],
  richiami: {
    carte: [
      { sim: 'scudo', da: 'Dall’unità 1.5.3', t: 'Maschera', d: 'Una parola che indica, con i suoi bit a 1, le posizioni su cui un’operazione bit a bit deve agire.' },
      { sim: 'operation', da: 'Dall’unità 2.4.1', t: 'SHL', d: 'L’istruzione sposta i bit verso sinistra e fa entrare zeri da destra. Ogni posizione raddoppia il valore.' },
      { sim: 'flag', da: 'Dall’unità 2.2.5', t: 'ZF e JZ', d: 'ZF vale 1 quando il risultato di un’istruzione è zero. JZ salta quando ZF vale 1.' }
    ],
    domanda: { d: 'Prima di proseguire: AL contiene 1. Quanto vale dopo `shl al, 3`?', o: [
      { t: '8', ok: true, fb: 'Il solo bit acceso passa dalla posizione 0 alla posizione 3, che ha peso 2 × 2 × 2 = 8.' },
      { t: '3', fb: 'Tre è il numero di posizioni. Ogni posizione raddoppia: 1, 2, 4, 8.' },
      { t: '4', fb: 'Quattro si ottiene con due posizioni. La terza raddoppia ancora.' }
    ] }
  },
  idea: {
    titolo: 'Una maschera con un solo 1',
    termini: ['istruzione test'],
    testo: [
      'Molti dati sono composti da singoli bit, ciascuno con un significato proprio: un permesso concesso, un indicatore attivo, un’opzione abilitata. Per agire su uno solo di essi occorre una maschera con un solo 1, nella posizione del bit. Le posizioni sono contate da destra a partire da zero, e il bit nella posizione k ha peso 2 elevato a k. La maschera del bit k è quindi il numero 2 elevato a k.',
      'La sua costruzione è affidata a SHL. Si parte dal numero 1, che ha acceso il solo bit 0, e lo si fa scorrere a sinistra di k posizioni: `mov edx, 1` seguita da `shl edx, cl`, con k nel registro CL.',
      { fig: 'celle', titolo: 'La maschera del bit 5', nota: 'Il numero 1 è scorso a sinistra di cinque posizioni. La maschera vale 2 elevato a 5, cioè 32, in esadecimale 0x20.', celle: [
        { so: 'bit 7', v: '0', st: '' }, { so: 'bit 6', v: '0', st: '' }, { so: 'bit 5', v: '1', st: 'amb' }, { so: 'bit 4', v: '0', st: '' }, { so: 'bit 3', v: '0', st: '' }, { so: 'bit 2', v: '0', st: '' }, { so: 'bit 1', v: '0', st: '' }, { so: 'bit 0', v: '0', st: '' }] },
      'Con la maschera disponibile, ogni operazione bit a bit produce un effetto determinato. OR accende il bit: nella colonna in cui la maschera vale 1 il risultato è 1, nelle altre passa il bit di partenza. XOR lo inverte, e lascia passare gli altri allo stesso modo. Lo spegnimento richiede la maschera invertita, con tutti i bit a 1 e uno 0 nella posizione k: essa è prodotta da NOT, e AND completa l’operazione.',
      'La lettura del bit senza alcuna modifica è affidata all’istruzione [[istruzione test|TEST]]. Essa calcola il medesimo AND dell’istruzione AND, scrive i flag e scarta il risultato, come CMP con la sottrazione. Dopo `test al, dl` il flag ZF vale 1 se il bit letto è 0, e un salto condizionale può decidere di conseguenza.',
      'In un registro di 64 bit le posizioni vanno da 0 a 63. Nella divisione della posizione per 8, il quoziente indica il byte in cui cade il bit e il resto la posizione all’interno del byte. La posizione 8 è il bit 0 del byte 1: il primo bit oltre il confine del byte più basso.'
    ]
  },
  esperimento: {
    faremo: [
      'AL contiene un byte e CL una posizione k. I controlli fissano il byte, la posizione e l’operazione sul bit: accensione, spegnimento, inversione oppure lettura.',
      'La maschera è costruita in DL a partire dal numero 1, e l’operazione è poi applicata colonna per colonna. Dopo il caso proposto, è istruttivo mantenere la posizione e cambiare l’operazione.'
    ],
    vedrai: [
      ['bit', 'Tre file di bit', 'Al centro: il byte in AL, la maschera in DL e l’esito dell’operazione, allineati per colonna.'],
      ['operation', 'Le istruzioni', 'A destra: le istruzioni, una per passo.'],
      ['porta', 'La regola', 'In basso: l’effetto dell’operazione nella colonna scelta e nelle altre.']
    ]
  },
  lab: {
    titolo: 'Accendere, spegnere, invertire e leggere il bit k',
    scena: { w: 860, h: 338 },
    atti: ['Il byte e il bit', 'La maschera', 'Colonna per colonna', 'L’esito'],
    controlli: [
      { id: 'x', tipo: 'scelta', eti: 'Byte in AL', opzioni: [[0x5A, '0x5A'], [0xC3, '0xC3'], [0x0F, '0x0F'], [0x80, '0x80']], valore: 0x5A },
      { id: 'k', tipo: 'num', eti: 'Posizione k, in CL', min: 0, max: 7, salti: [1], valore: 2 },
      { id: 'op', tipo: 'scelta', eti: 'Operazione sul bit', opzioni: [['or', 'accensione'], ['and', 'spegnimento'], ['xor', 'inversione'], ['test', 'lettura']], valore: 'or' }
    ],
    nota: 'Il numero di passi dipende dall’operazione: per spegnere un bit la maschera va prima invertita.',
    previsione: {
      domanda: (p) => { const U = SL.unita242; return 'AL contiene ' + U.H(p.x) + ', in binario ' + SL.x86.bin8(p.x) + ', e la maschera ha un solo 1 nella posizione ' + p.k + '. ' + (p.op === 'test' ? 'Quanto varrà ZF dopo `test al, dl`?' : 'Quale byte conterrà AL dopo ' + U.FRASE[p.op] + '?'); },
      opzioni: (p) => { const U = SL.unita242, m = 1 << p.k; return p.op === 'test' ? ['ZF = 0', 'ZF = 1'] : Array.from(new Set([parseInt(U.esito(p), 16), p.x | m, p.x & ~m & 255, p.x ^ m, m, p.x & m])).slice(0, 4).sort((a, b) => a - b).map(U.H); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita242, b = (p.x >> p.k) & 1; return 'La previsione indicava ' + pred + '. L’esito è ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il bit ' + p.k + ' di AL valeva ' + b + '. ' + U.REGOLA[p.op]); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita242, passi = [], k = p.k, m = 1 << k, b = (p.x >> k) & 1, AND = p.op === 'and', TEST = p.op === 'test';
      const usata = AND ? (~m) & 255 : m, r = p.op === 'or' ? p.x | m : AND ? p.x & usata : p.op === 'xor' ? p.x ^ m : p.x & m, zf = r === 0 ? 1 : 0;
      const LIS = [['valore iniziale', 'mov edx, 1'], ['posizione ' + k, 'shl edx, cl']].concat(AND ? [['invertita', 'not edx']] : []).concat([[TEST ? 'lettura' : 'operazione', U.IST[p.op]]]);
      const st = { dl: null, vis: false };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 52, 'AL', 'mono'), el.nota('n2', 20, 132, 'DL', 'mono'), el.nota('n3', 20, 212, TEST ? 'AND' : 'esito', 'mono')];
        X.bit('a', p.x, { x: 110, y: 36, passo: 60, att: o.col ? [k] : [] }).forEach((e) => els.push(e));
        if (st.dl == null) for (let j = 0; j < 8; j++) els.push(el.cella('d' + j, 110 + j * 60, 116, 54, 50, '·', 'off', { piccola: true }));
        else X.bit('d', st.dl, { x: 110, y: 116, passo: 60, indici: false, att: o.maschera ? (AND && o.rov ? [0, 1, 2, 3, 4, 5, 6, 7].filter((i) => i !== k) : [k]) : o.col ? [k] : [] }).forEach((e) => els.push(e));
        if (!st.vis) for (let j = 0; j < 8; j++) els.push(el.cella('r' + j, 110 + j * 60, 196, 54, 50, '·', 'off', { piccola: true }));
        else X.bit('r', r, { x: 110, y: 196, passo: 60, indici: false, att: [k] }).forEach((e) => els.push(e));
        if (o.col) els.push(el.linea('c1', 110 + (7 - k) * 60 + 27, 86, 110 + (7 - k) * 60 + 27, 116, 'att'), el.linea('c2', 110 + (7 - k) * 60 + 27, 166, 110 + (7 - k) * 60 + 27, 196, 'att'));
        X.listato('li', LIS, o.riga, { x: 610, y: 0, w: 230, passo: 58 }).forEach((e) => els.push(e));
        els.push(el.box('reg', 20, 270, 570, 58, 'la regola dell’operazione', o.regola ? U.BREVE[p.op] : '·', o.regola ? 'on' : '', { cls: 'stretta' }),
          el.box('zf', 610, 270, 230, 58, TEST ? 'ZF' : 'AL dopo', st.vis ? (TEST ? String(zf) : U.H(r)) : '·', o.fine ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Maschera in DL', st.dl == null ? '·' : U.H(st.dl), 'a'], ['Bit ' + k + ' di AL', String(b)], [TEST ? 'ZF' : 'AL', st.vis ? (TEST ? String(zf) : U.H(r)) : TEST ? '·' : U.H(p.x), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      const o0 = Array.from(new Set([m, k, 2 * k])).sort((x, y) => x - y);
      P({ col: true }, 0, 'Il byte e il bit scelto', 'AL contiene ' + U.H(p.x) + ', in binario ' + X.bin8(p.x) + '. Il bit nella posizione ' + k + ' vale ' + b + '. L’obiettivo è ' + U.SCOPO[p.op] + ', lasciando invariati gli altri sette.',
        { chiedi: { d: 'La maschera deve avere un solo 1, nella posizione ' + k + '. Quanto vale, in decimale?', o: o0.map(String), g: o0.indexOf(m), no: 'Il bit nella posizione ' + k + ' pesa 2 elevato a ' + k + ', cioè ' + m + '.' } });
      st.dl = 1;
      P({ riga: 0, maschera: false }, 1, 'Il seme', 'La costruzione parte dal numero 1, che ha acceso il solo bit 0. L’istruzione lo scrive in EDX, di cui DL è il byte più basso.', { calc: 'DL = 0000 0001' });
      st.dl = m;
      P({ riga: 1, maschera: true }, 1, 'Il bit nella posizione k', (k === 0 ? 'CL contiene 0, e lo scorrimento lascia il bit nella posizione iniziale: la maschera del bit 0 è il numero 1.' : 'SHL fa scorrere il bit acceso di ' + (k === 1 ? 'una posizione' : k + ' posizioni') + ' verso sinistra, quante ne indica CL. Il bit raggiunge la posizione ' + k + ', e la maschera vale ' + m + ', in esadecimale ' + U.H(m) + '.'),
        Object.assign({ calc: '1 × 2 alla ' + k + ' = ' + m }, AND ? {} : { chiedi: U.domandaBit(p, b) }));
      if (AND) {
        st.dl = usata;
        P({ riga: 2, maschera: true, rov: true }, 1, 'La maschera invertita', 'Lo spegnimento richiede la configurazione opposta: tutti i bit a 1 e uno 0 nella posizione ' + k + '. NOT inverte ogni bit della maschera, che diventa ' + X.bin8(usata) + '.', { calc: 'NOT ' + X.bin8(m) + ' = ' + X.bin8(usata), chiedi: U.domandaBit(p, b) });
      }
      st.vis = true;
      P({ riga: LIS.length - 1, col: true, regola: true }, 2, 'Colonna per colonna', U.COLONNE[p.op].replace(/#k/g, String(k)) + ' ' + (TEST ? 'L’AND vale ' + X.bin8(r) + '.' : 'Il risultato è ' + X.bin8(r) + '.'), { calc: X.bin8(p.x) + ' ' + U.SEGNO[p.op] + ' ' + X.bin8(usata) + ' = ' + X.bin8(r) });
      P({ riga: LIS.length - 1, regola: true, fine: true }, 3, TEST ? 'Il flag ZF' : 'Il byte dopo l’operazione', (TEST ? 'TEST scarta il risultato dell’AND e conserva i flag. ' + (zf ? 'Il risultato è zero, e ZF vale quindi 1: il bit ' + k + ' di AL è 0.' : 'Il risultato è diverso da zero, e ZF vale quindi 0: il bit ' + k + ' di AL è 1.') + ' AL contiene ancora ' + U.H(p.x) + '. Un salto come JZ può ora scegliere il percorso.'
        : 'AL contiene ' + U.H(r) + '. ' + (r === p.x ? 'Il bit ' + k + ' valeva già ' + b + ', e il byte è rimasto invariato: l’operazione garantisce lo stato finale del bit, qualunque fosse quello iniziale.' : 'Il bit ' + k + ' è passato da ' + b + ' a ' + ((r >> k) & 1) + ', e gli altri sette sono rimasti invariati.')),
        { calc: TEST ? 'ZF = ' + zf : 'AL = ' + U.H(r), esito: [TEST ? 'ZF = ' + zf : 'AL = ' + U.H(r), 'si'] });
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'La maschera del bit k è il numero 1 scorso a sinistra di k posizioni, cioè 2 elevato a k.',
      'OR con la maschera accende il bit, XOR lo inverte, AND con la maschera invertita lo spegne. TEST lo legge senza alcuna modifica: ZF vale 1 se il bit è 0.'
    ],
    errori: [
      ['Spegnere un bit con AND e la maschera diretta.', 'AND con 0000 1000 spegne tutti i bit tranne il 3. Lo spegnimento del solo bit 3 richiede la maschera invertita, 1111 0111.'],
      ['Contare le posizioni da sinistra, o da uno.', 'Il bit 0 è quello più a destra e ha peso 1. Il bit 3 è il quarto da destra e ha peso 8.'],
      ['Interpretare ZF in senso opposto dopo TEST.', 'ZF descrive il risultato dell’AND: vale 1 quando è zero, cioè quando il bit letto vale 0.']
    ],
    saFare: ['Costruire la maschera di un bit con MOV e SHL.', 'Scegliere l’operazione che accende, spegne o inverte un bit.', 'Leggere un bit con TEST e interpretare ZF.'],
    esercizi: [
      { d: 'AL contiene 0x5B, in binario 0101 1011. Quale byte contiene dopo `xor al, 0x08`? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x4C', giuste: ['0x53', '53', '53h'],
        ok: 'La maschera 0x08 ha il solo bit 3 acceso. In AL tale bit vale 1, e XOR lo inverte: 0101 0011.',
        diagnosi: [
          { se: ['0x5b', '5b'], msg: 'In tal modo il bit 3 resta acceso, come con OR. XOR inverte il bit: da 1 passa a 0.' },
          { se: ['0x08', '08', '8'], msg: 'Il valore indicato è il risultato di AND, che conserva soltanto il bit della maschera. XOR lascia passare gli altri bit e inverte quello scelto.' },
          { se: ['0x63', '63'], msg: 'Il bit invertito è un altro. La maschera 0x08 è 0000 1000: riguarda il bit 3.' }
        ],
        altro: 'Il byte è diverso. Si scrivano i due byte in binario, uno sopra l’altro, e si applichi XOR colonna per colonna.',
        indizi: ['0x08 in binario è 0000 1000: la maschera del bit 3.', 'Il bit 3 di 0101 1011 vale 1.', 'XOR lo inverte e lascia gli altri: 0101 0011.'],
        svolgimento: ['AL: 0101 1011. Maschera: 0000 1000.', 'Nelle colonne in cui la maschera vale 0 passa il bit di AL.', 'Nella colonna 3 il bit è invertito: da 1 a 0.', 'Risultato: 0101 0011 = 0x53.'] },
      { d: 'Quale coppia di istruzioni salta all’etichetta `pari` quando il numero contenuto in EAX è pari?', guida: 'Si scelga la risposta.', o: [
        { t: 'test eax, 1 · jz pari', ok: true, fb: 'Un numero è pari quando il suo bit 0 vale 0. TEST lo legge con la maschera 1, e ZF vale 1 esattamente in tale caso.' },
        { t: 'test eax, 2 · jz pari', fb: 'La maschera 2 legge il bit 1. La parità dipende dal bit 0, quello di peso 1.' },
        { t: 'or eax, 1 · jz pari', fb: 'OR accende il bit 0 e modifica EAX. Il risultato è sempre diverso da zero, e il salto è escluso.' }] }
    ],
    sfida: ['cslez2_4_01_random_assembly_01', 'Maschere per byte e singoli bit']
  }
});
SL.unita242 = (() => {
  const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
  const esito = (p) => { const m = 1 << p.k; return p.op === 'test' ? 'ZF = ' + ((p.x & m) === 0 ? 1 : 0) : H(p.op === 'or' ? p.x | m : p.op === 'and' ? p.x & ~m & 255 : p.x ^ m); };
  const domandaBit = (p, b) => (p.op === 'test'
    ? { d: 'TEST calcolerà l’AND fra AL e la maschera. Il bit ' + p.k + ' di AL vale ' + b + '. Il risultato sarà zero?', o: ['Sì', 'No'], g: b ? 1 : 0, no: b ? 'Nella colonna ' + p.k + ' entrambi i bit valgono 1, e l’AND dà 1: il risultato è diverso da zero.' : 'Nella colonna ' + p.k + ' il bit di AL vale 0, e nelle altre vale 0 la maschera: l’AND è zero ovunque.' }
    : { d: 'Il bit ' + p.k + ' di AL vale ' + b + '. Quanto varrà dopo l’operazione?', o: ['0', '1'], g: p.op === 'or' ? 1 : p.op === 'and' ? 0 : 1 - b, no: p.op === 'or' ? 'OR con un 1 dà sempre 1.' : p.op === 'and' ? 'AND con uno 0 dà sempre 0.' : 'XOR con un 1 inverte il bit: da ' + b + ' a ' + (1 - b) + '.' });
  return { H, esito, domandaBit,
    IST: { or: 'or al, dl', and: 'and al, dl', xor: 'xor al, dl', test: 'test al, dl' },
    SEGNO: { or: 'OR', and: 'AND', xor: 'XOR', test: 'AND' },
    FRASE: { or: '`or al, dl`', and: '`not edx` e `and al, dl`', xor: '`xor al, dl`' },
    SCOPO: { or: 'accenderlo', and: 'spegnerlo', xor: 'invertirlo', test: 'leggerlo' },
    BREVE: { or: 'OR: con 1 accende, con 0 lascia passare', and: 'AND: con 0 spegne, con 1 lascia passare', xor: 'XOR: con 1 inverte, con 0 lascia passare', test: 'TEST: calcola l’AND e conserva soltanto i flag' },
    REGOLA: { or: 'OR con un 1 dà 1 e con uno 0 lascia passare il bit di partenza.', and: 'AND con uno 0 dà 0 e con un 1 lascia passare il bit di partenza. La maschera impiegata è quella invertita.', xor: 'XOR con un 1 inverte il bit e con uno 0 lo lascia passare.', test: 'TEST calcola l’AND con la maschera. Il risultato è zero, e ZF vale 1, soltanto se il bit letto è 0.' },
    COLONNE: { or: 'Nelle sette colonne in cui la maschera vale 0, OR lascia passare il bit di AL. Nella colonna #k la maschera vale 1, e il risultato è 1 qualunque fosse il bit.', and: 'Nelle sette colonne in cui la maschera vale 1, AND lascia passare il bit di AL. Nella colonna #k la maschera vale 0, e il risultato è 0 qualunque fosse il bit.', xor: 'Nelle sette colonne in cui la maschera vale 0, XOR lascia passare il bit di AL. Nella colonna #k la maschera vale 1, e il bit è invertito.', test: 'Nelle sette colonne in cui la maschera vale 0, l’AND dà 0. Nella colonna #k la maschera vale 1, e passa il bit di AL.' } };
})();
