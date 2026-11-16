'use strict';
SL.unita364 = (() => {
  const TESTO = { load: '`mov rax, 0(rbx)`', uso: '`add rcx, rax`', ind: '`mov rdi, rsi`' };
  const NOME = { vicino: 'L · U · I', separa: 'L · I · U' };
  const F5 = ['F', 'D', 'E', 'M', 'W'];
  /* Il programma con le nop necessarie. Nell'ordine L, U, I ogni gruppo richiede tre nop fra L e U;
     nell'ordine L, I, U l'istruzione I ne sostituisce una, e ne bastano due. */
  const traccia = (ordine, g) => {
    const seq = [];
    for (let k = 1; k <= g; k++) {
      const x = g > 1 ? String(k) : '';
      if (ordine === 'vicino') seq.push('L' + x, 'nop', 'nop', 'nop', 'U' + x, 'I' + x);
      else seq.push('L' + x, 'I' + x, 'nop', 'nop', 'U' + x);
    }
    const righe = seq.map((n, j) => ({ n, da: j + 1, s: F5, st: n === 'nop' ? 'off' : '' }));
    const nop = seq.filter((n) => n === 'nop').length;
    return { righe, cicli: seq.length + 4, nop, utili: 3 * g, seq };
  };
  return { TESTO, NOME, traccia };
})();
SL.registra('3.6.4', {
  titolo: 'Traccia e conteggio dei cicli',
  obiettivo: 'Obiettivo: seguire una sequenza con una lettura dalla memoria e il suo uso, inserire le `nop` richieste dalla regola delle tre istruzioni, contare i cicli, e indicare quando una variazione dell’ordine riduce le `nop`.',
  concetti: [['tabella', 'La traccia ciclo per ciclo'], ['stallo', 'Le nop necessarie'], ['bilancio', 'Il medesimo lavoro in un numero minore di cicli']],
  filigrana: ['tabella', 'stallo', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'conflitto', da: 'Dall’unità 3.6.3', t: 'La regola delle tre istruzioni', d: 'Fra un’istruzione e quella che ne impiega il risultato devono trovarsi almeno tre altre istruzioni, eventualmente nop.' },
      { sim: 'tabella', da: 'Dall’unità 3.3.3', t: 'La lettura dalla memoria', d: '`mov rA, D(rB)` scrive in rA la parola letta, nella fase di scrittura.' },
      { sim: 'bilancio', da: 'Dall’unità 3.5.4', t: 'Il conteggio dei cicli', d: 'Un tratto di N istruzioni occupa N + 4 cicli in una pipeline di cinque stadi che parte vuota.' }
    ],
    domanda: { d: 'Prima di proseguire: fra due istruzioni dipendenti se ne trova già una indipendente. Quante `nop` occorre aggiungere?', o: [
      { t: '2', ok: true, fb: 'Ne occorrono tre in tutto, e una è già presente.' },
      { t: '3', fb: 'Tre è il numero complessivo di istruzioni intermedie. Una è già presente.' },
      { t: '1', fb: 'Con una sola nop le istruzioni intermedie sarebbero due.' }
    ] }
  },
  idea: {
    titolo: 'Una nop sostituita da un’istruzione utile',
    termini: ['riordino'],
    testo: [
      'Il numero di `nop` richieste da una dipendenza dei dati dipende dalla distanza fra le due istruzioni. Se l’istruzione che impiega il risultato segue immediatamente quella che lo produce, ne occorrono tre. Ogni istruzione utile interposta ne sostituisce una.',
      'Si considerino tre istruzioni. L legge una parola dalla memoria, `mov rax, 0(rbx)`. U impiega il dato letto, `add rcx, rax`. I è indipendente da entrambe, `mov rdi, rsi`: copia un registro in un altro, opera su registri diversi, non accede alla memoria e lascia invariato ZF.',
      { fig: 'scena', w: 720, h: 220, titolo: 'L’ordine L, U, I: tre nop', nota: 'U è in D al ciclo 6, il ciclo che segue la scrittura di RAX. La sequenza occupa 10 cicli.', els: SL.pipe.diagramma('g', SL.unita364.traccia('vicino', 1).righe, { x: 150, y: 4, passo: 56, cicli: 10, py: 32, h: 26 }) },
      'Nell’ordine L, U, I la sequenza richiede tre `nop` fra L e U, e occupa sei posizioni. Nell’ordine L, I, U una delle tre posizioni è occupata da I, che andava comunque eseguita, e bastano due `nop`. La sequenza occupa cinque posizioni, e termina un ciclo prima.',
      'Lo scambio è un [[riordino]], ed è lecito soltanto perché I è indipendente: opera su registri diversi da quelli di L e di U, è priva di accessi alla memoria e lascia invariato ZF. Il risultato del programma è il medesimo nei due ordini. In un programma reale tutte queste condizioni vanno verificate prima di spostare un’istruzione. I compilatori eseguono abitualmente tale verifica.'
    ]
  },
  esperimento: {
    faremo: [
      'La traccia della pipeline è seguita per le tre istruzioni L, U e I, con le `nop` necessarie. I controlli fissano l’ordine e il numero di ripetizioni del gruppo.',
      'Si individua dove la regola delle tre istruzioni richiede le `nop`, poi si esamina l’intero diagramma e il conteggio finale. Dopo il caso proposto, è istruttivo modificare soltanto l’ordine e confrontare il numero di cicli.'
    ],
    vedrai: [
      ['tabella', 'La traccia', 'In alto: il diagramma di pipeline, con le nop in grigio.'],
      ['conflitto', 'Il ciclo in esame', 'La colonna in evidenza: il ciclo in cui U legge RAX.'],
      ['bilancio', 'Il conteggio', 'In basso: istruzioni utili, nop e cicli.']
    ]
  },
  lab: {
    titolo: 'Tre istruzioni, due ordini',
    scena: { w: 860, h: 400 },
    atti: ['Il programma', 'La regola', 'La traccia intera', 'Il conteggio'],
    controlli: [
      { id: 'ordine', tipo: 'scelta', eti: 'Ordine', opzioni: [['vicino', 'L · U · I'], ['separa', 'L · I · U']], valore: 'vicino' },
      { id: 'g', tipo: 'scelta', eti: 'Ripetizioni del gruppo', opzioni: [[1, '1'], [2, '2']], valore: 1 }
    ],
    nota: 'I passi sono sempre cinque. L è una lettura dalla memoria, U ne impiega il dato, I è indipendente. Le nop sono inserite secondo la regola delle tre istruzioni.',
    previsione: {
      domanda: (p) => 'Le tre istruzioni entrano nell’ordine ' + SL.unita364.NOME[p.ordine].replace(/ · /g, ', ') + (p.g > 1 ? ', e il gruppo si ripete ' + p.g + ' volte' : '') + ', con le `nop` necessarie. La pipeline parte vuota. Quanti cicli trascorrono prima che l’ultima istruzione esca?',
      opzioni: (p) => [3 * p.g + 4, 5 * p.g + 4, 6 * p.g + 4, 3 * p.g].sort((a, b) => a - b).map((v) => [v, v + ' cicli'])
    },
    confronto: (pred, esito, p) => 'La previsione indicava ' + pred + ' cicli. La sequenza ne occupa ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : pred === 3 * p.g ? 'Mancano le nop e i 4 cicli che l’ultima istruzione impiega per raggiungere lo stadio W.' : pred === 3 * p.g + 4 ? 'Tale è il flusso senza nop, che darebbe a U un valore di RAX non aggiornato.' : p.ordine === 'vicino' ? 'In quest’ordine ogni U segue immediatamente il proprio L, e richiede tre nop.' : 'In quest’ordine I occupa una delle tre posizioni richieste, e per ogni gruppo bastano due nop.'),
    costruisci(p) {
      const el = SL.el, U = SL.unita364, passi = [], T = U.traccia(p.ordine, p.g), vicino = p.ordine === 'vicino', altro = U.traccia(vicino ? 'separa' : 'vicino', p.g), s = p.g > 1 ? '1' : '';
      const passo = T.righe.length > 6 ? 40 : 56, nL = vicino ? 3 : 2, posU = T.seq.indexOf('U' + s), dU = posU + 2;
      const yb = 34 + T.righe.length * 24;
      const quadro = (o) => {
        const els = [el.nota('t0', 20, 0, 'CICLO', 'mono')];
        SL.pipe.diagramma('d', T.righe, { x: 110, y: 0, passo, cicli: T.cicli, py: 24, h: 20, fino: o.fino, evid: o.evid }).forEach((e) => els.push(e));
        els.push(el.box('b1', 20, yb, 264, 58, 'istruzioni utili', o.conti ? String(T.utili) : '·', o.conti ? 'on' : '', { cls: 'stretta' }),
          el.box('b2', 298, yb, 264, 58, 'nop', o.fino >= T.cicli ? String(T.nop) : '·', o.conti ? (T.nop ? 'err' : 'on') : o.fino >= T.cicli ? 'on' : '', { cls: 'stretta' }),
          el.box('b3', 576, yb, 264, 58, 'cicli', o.fino >= T.cicli ? String(T.cicli) : '·', o.conti ? 'att' : o.fino >= T.cicli ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = (o) => [['Ordine', U.NOME[p.ordine], 'a'], ['Ciclo in esame', o.evid ? String(o.evid) : '·'], ['nop', o.fino >= T.cicli ? String(T.nop) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(o), els: quadro(o) }, extra));

      P({ fino: 1 }, 0, 'Il programma', 'L' + s + ' è ' + U.TESTO.load + '. U' + s + ' è ' + U.TESTO.uso + ', che impiega il dato letto in RAX. I' + s + ' è ' + U.TESTO.ind + ', indipendente dalle altre due. Entrano nell’ordine ' + U.NOME[p.ordine].replace(/ · /g, ', ') + '.',
        { chiedi: { d: 'L' + s + ' entra nello stadio F al ciclo 1. In quale ciclo RAX diviene leggibile nello stadio D?', o: ['Ciclo 4', 'Ciclo 5', 'Ciclo 6'], g: 2, no: 'L' + s + ' scrive RAX nello stadio W al ciclo 5, e il valore è leggibile in D dal ciclo successivo, il 6.' } });
      P({ fino: dU, evid: dU }, 1, 'La regola delle tre istruzioni', vicino ? 'U' + s + ' segue immediatamente L' + s + ': senza istruzioni intermedie sarebbe in D al ciclo 3, troppo presto. Occorrono tre `nop`, che portano U' + s + ' nello stadio D al ciclo 6.' : 'Fra L' + s + ' e U' + s + ' si trova I' + s + ', che occupa una delle tre posizioni richieste. Bastano due `nop`, e U' + s + ' è nello stadio D al ciclo 6.', { calc: nL + ' nop fra L' + s + ' e U' + s + ' · U' + s + ' in D al ciclo ' + dU });
      P({ fino: T.cicli }, 2, 'La traccia intera', 'La sequenza termina al ciclo ' + T.cicli + '. ' + (p.g > 1 ? (vicino ? 'Nel secondo gruppo la situazione si ripete: U2 segue immediatamente L2, e richiede a sua volta tre nop.' : 'Nel secondo gruppo vale lo stesso: I2 separa L2 da U2, e bastano due nop.') : 'Ogni istruzione, nop comprese, avanza di uno stadio per ciclo: la pipeline non si arresta mai, e le nop occupano le posizioni che altrimenti leggerebbero valori non aggiornati.'), { calc: 'ultimo ciclo: ' + T.cicli });
      P({ fino: T.cicli, conti: true }, 3, 'Il conteggio', 'Le istruzioni utili sono ' + T.utili + ', le `nop` ' + T.nop + '. I cicli sono ' + T.utili + ' + ' + T.nop + ' + 4 = ' + T.cicli + ': una posizione per ogni istruzione, nop comprese, e 4 cicli per il riempimento. Nell’ordine ' + U.NOME[vicino ? 'separa' : 'vicino'].replace(/ · /g, ', ') + ' le medesime istruzioni occuperebbero ' + altro.cicli + ' cicli.', { calc: T.utili + ' + ' + T.nop + ' + 4 = ' + T.cicli + ' cicli' });
      P({ fino: T.cicli, conti: true }, 3, vicino ? 'Il riordino possibile' : 'Il riordino compiuto', vicino ? 'I' + s + ' è indipendente sia da L' + s + ' sia da U' + s + ', e spostata fra le due occuperebbe una delle tre posizioni richieste, e risparmierebbe una nop per gruppo, cioè ' + p.g + (p.g === 1 ? ' ciclo.' : ' cicli.') : 'Lo spostamento di I' + s + ' fra L' + s + ' e U' + s + ' ha sostituito una nop per gruppo con un’istruzione utile: ' + p.g + (p.g === 1 ? ' ciclo risparmiato' : ' cicli risparmiati') + ' rispetto all’ordine L, U, I.',
        { calc: 'differenza: ' + Math.abs(altro.cicli - T.cicli) + (p.g === 1 ? ' ciclo' : ' cicli'), esito: [T.cicli + ' cicli · ' + T.nop + ' nop', vicino ? '' : 'si'] });
      return { passi, esito: T.cicli };
    }
  },
  bilancio: {
    regola: [
      'Una lettura dalla memoria seguita immediatamente dall’uso del dato richiede tre `nop`. Ogni istruzione utile interposta ne sostituisce una. I cicli di una sequenza sono le istruzioni, nop comprese, più 4.',
      'Un riordino di istruzioni indipendenti può occupare con lavoro utile le posizioni altrimenti riempite da `nop`, lasciando invariato il risultato del programma.'
    ],
    errori: [
      ['Ritenere che il riordino elimini lavoro.', 'Le istruzioni utili eseguite sono le medesime. Una nop è sostituita da un’istruzione che andava comunque eseguita.'],
      ['Riordinare senza verificare le dipendenze.', 'Lo scambio è lecito soltanto se l’istruzione spostata è indipendente dalle altre nei registri, nella memoria e in ZF.'],
      ['Escludere le nop dal conteggio dei cicli.', 'Ogni nop attraversa la pipeline come le altre istruzioni, e occupa un ciclo.']
    ],
    saFare: ['Inserire le nop richieste in una sequenza con dipendenze.', 'Contare cicli e nop di una sequenza.', 'Riconoscere quando un riordino è lecito.'],
    esercizi: [
      { d: 'Il gruppo L, U, I è ripetuto tre volte, con tre nop fra ogni L e il suo U, a partire dalla pipeline vuota. Quanti cicli occupa complessivamente?', segnaposto: 'Un numero', giuste: ['22', 'ventidue'],
        ok: 'Nove istruzioni utili, nove nop e 4 cicli di riempimento: 9 + 9 + 4 = 22.',
        diagnosi: [
          { se: ['13', 'tredici'], msg: 'Questo è il flusso senza nop. In quest’ordine ogni U richiede tre nop.' },
          { se: ['19', 'diciannove'], msg: 'Le nop sono tre per gruppo, e i gruppi sono tre.' },
          { se: ['18', 'diciotto'], msg: 'Mancano i 4 cicli di riempimento.' }
        ],
        altro: 'Il numero è diverso. Si sommino le istruzioni utili, le nop e i 4 cicli di riempimento.',
        indizi: ['Le istruzioni utili sono 3 × 3 = 9.', 'Le nop sono 3 × 3 = 9.', '9 + 9 + 4.'],
        svolgimento: ['Istruzioni utili: 9.', 'nop: 9.', 'Totale: 9 + 9 + 4 = 22 cicli.'] },
      { d: 'Il medesimo programma è riordinato in L, I, U, sempre ripetuto tre volte. Quanti cicli occupa?', segnaposto: 'Un numero', giuste: ['19', 'diciannove'],
        ok: 'Due nop per gruppo: 9 + 6 + 4 = 19 cicli.',
        diagnosi: [
          { se: ['22', 'ventidue'], msg: 'Questo è il conteggio dell’ordine L, U, I. Con I fra L e U basta una nop in meno per gruppo.' },
          { se: ['13', 'tredici'], msg: 'Questo è il flusso senza nop. I sostituisce una sola delle tre nop.' },
          { se: ['15', 'quindici'], msg: 'Mancano i 4 cicli di riempimento.' }
        ],
        altro: 'Il numero è diverso. In quest’ordine ogni gruppo richiede due nop.',
        indizi: ['Le istruzioni utili sono ancora 9.', 'Fra ogni L e il suo U è presente I: bastano due nop.', '9 + 6 + 4.'],
        svolgimento: ['Istruzioni utili: 9.', 'nop: 3 × 2 = 6.', 'Totale: 9 + 6 + 4 = 19 cicli.'] },
      { d: 'Un programma contiene, nell’ordine, `mov rax, 0(rbx)`, `add rcx, rax` e `sub rdx, rcx`. La `sub` può essere spostata fra le altre due per ridurre le nop?', guida: 'Si scelga la risposta.', o: [
        { t: 'No, poiché la sub legge RCX, che la add deve ancora scrivere', ok: true, fb: 'Spostata prima della add, la sub leggerebbe il valore precedente di RCX, e il risultato cambierebbe.' },
        { t: 'Sì, poiché la sub è indipendente dalla lettura dalla memoria', fb: 'La sub è indipendente dalla prima istruzione. Essa dipende tuttavia dalla add, poiché legge RCX.' },
        { t: 'Sì, poiché due istruzioni aritmetiche possono sempre essere scambiate', fb: 'Lo scambio è lecito soltanto fra istruzioni indipendenti. In questo caso la seconda legge il risultato della prima.' }] }
    ],
    sfida: ['cslez3_6_04_random_assembly', 'Cronologia degli stadi e completamento']
  }
});
