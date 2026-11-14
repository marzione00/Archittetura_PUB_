'use strict';
SL.registra('2.7.4', {
  titolo: 'Riuso del flusso di controllo',
  obiettivo: 'Obiettivo: spiegare come una sequenza di indirizzi sulla pila possa determinare l’ordine di esecuzione di blocchi di codice già presenti, e quali difese contrastino tale meccanismo.',
  concetti: [['puntatore', 'RET e il contenuto della pila'], ['pila', 'Una sequenza di destinazioni'], ['scudo', 'La necessità di altre difese']],
  filigrana: ['pila', 'puntatore', 'scudo'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.6.2', t: 'RET', d: 'L’istruzione preleva gli otto byte in cima alla pila, li scrive in RIP e aggiunge 8 a RSP. L’origine di tali byte è priva di verifica.' },
      { sim: 'scudo', da: 'Dall’unità 2.7.2', t: 'Dato di controllo', d: 'Un dato che determina il punto da cui proseguirà l’esecuzione, come l’indirizzo di ritorno.' },
      { sim: 'privilegi', da: 'Dall’unità 2.7.3', t: 'Memoria non eseguibile', d: 'Il processore rifiuta di eseguire istruzioni lette dalla pila e dalle altre zone di dati.' }
    ],
    domanda: { d: 'Prima di proseguire: quale operazione compie RET sugli otto byte presenti in cima alla pila?', o: [
      { t: 'Li scrive in RIP, qualunque ne sia il contenuto', ok: true, fb: 'RET preleva e salta. Per il processore è indifferente che i byte siano stati depositati da una CALL oppure scritti da una copia.' },
      { t: 'Ne verifica il deposito da parte di una CALL', fb: 'Il processore è privo di ogni registrazione sull’origine della scrittura di una cella. RET impiega il valore che vi trova.' },
      { t: 'Li scarta e prosegue con l’istruzione successiva', fb: 'RET è un salto: il valore prelevato diventa l’indirizzo della prossima istruzione.' }
    ] }
  },
  idea: {
    titolo: 'L’ordine determinato dalla pila',
    termini: ['riuso del codice'],
    testo: [
      'La memoria non eseguibile impedisce l’esecuzione dei byte copiati sulla pila. Resta tuttavia possibile un’altra via. Per RET un indirizzo depositato da CALL e uno scritto da una copia sono equivalenti: preleva e salta. Chi riesce a scrivere la cella dell’indirizzo di ritorno sceglie il punto in cui riprende l’esecuzione, purché la destinazione sia codice già contenuto nel programma.',
      'Le destinazioni possono essere più d’una. Se il codice raggiunto termina a sua volta con RET, tale RET preleva la cella successiva della pila, e in seguito quella ancora successiva. Una sequenza di indirizzi sulla pila si comporta così come un programma: ogni indirizzo indica un blocco di istruzioni esistente, e i RET li collegano l’uno all’altro. Tale tecnica prende il nome di [[riuso del codice]].',
      { fig: 'scena', w: 720, h: 150, titolo: 'Una sequenza di indirizzi, una sequenza di blocchi', nota: 'Ogni RET preleva la cella successiva e porta l’esecuzione al blocco indicato.', els: [
        SL.el.cella('s0', 20, 6, 200, 40, 'indirizzo del blocco A', 'att', { piccola: true, cls: 'minuta' }), SL.el.cella('s1', 20, 54, 200, 40, 'indirizzo del blocco B', 'on', { piccola: true, cls: 'minuta' }), SL.el.cella('s2', 20, 102, 200, 40, 'indirizzo di fine', '', { piccola: true, cls: 'minuta' }),
        SL.el.box('a', 420, 0, 290, 46, 'blocco A', 'somma 3 · ret', 'att', { cls: 'stretta' }), SL.el.box('b', 420, 52, 290, 46, 'blocco B', 'raddoppia · ret', 'on', { cls: 'stretta' }), SL.el.box('f', 420, 104, 290, 42, null, 'fine', '', { cls: 'stretta' }),
        SL.el.linea('l0', 220, 26, 420, 23, 'att'), SL.el.linea('l1', 220, 74, 420, 75, 'on'), SL.el.linea('l2', 220, 122, 420, 125, '')] },
      'Nessuna istruzione nuova è eseguita: ogni blocco apparteneva già al programma o alle sue librerie. Varia l’ordine, e l’ordine è determinato da dati. La pila, concepita per conservare il punto di provenienza, è impiegata per indicare la destinazione.',
      'La conoscenza del meccanismo consente di valutare le difese. La sentinella arresta il traboccamento continuo prima dell’esecuzione di RET. La disposizione casuale degli indirizzi nasconde la posizione dei blocchi. La pila ombra dell’unità 2.7.6 verifica che ogni RET torni al punto stabilito da una CALL. La correzione effettiva resta a monte, nella scrittura esterna ai limiti da cui il difetto ha origine.'
    ]
  },
  esperimento: {
    faremo: [
      'Il modello ha due blocchi di codice già presenti nel programma, ciascuno terminato da RET. Il blocco A somma 3 a RAX, il blocco B lo raddoppia. Sulla pila si trovano tre indirizzi. I controlli fissano gli indirizzi e il valore iniziale di RAX.',
      'I tre RET sono seguiti uno dopo l’altro, con il blocco raggiunto e il valore di RAX. Dopo il caso proposto, è istruttivo scambiare l’ordine dei primi due indirizzi e prevedere il nuovo risultato.'
    ],
    vedrai: [
      ['pila', 'La pila', 'A sinistra: le tre celle con gli indirizzi, e la cima indicata da RSP.'],
      ['operation', 'I blocchi', 'A destra: i due blocchi e il punto di arrivo, con i rispettivi indirizzi.'],
      ['register', 'RAX', 'In basso: il valore di RAX dopo ogni blocco.']
    ]
  },
  lab: {
    titolo: 'Tre indirizzi sulla pila, tre salti',
    scena: { w: 860, h: 348 },
    atti: ['La pila prima di RET', 'Il primo salto', 'Il secondo salto', 'L’arrivo', 'L’origine dell’ordine'],
    controlli: [
      { id: 'o', tipo: 'scelta', eti: 'Indirizzi sulla pila, dalla cima', opzioni: [['AB', 'A, B, fine'], ['BA', 'B, A, fine'], ['AA', 'A, A, fine'], ['BB', 'B, B, fine']], valore: 'AB' },
      { id: 'x', tipo: 'scelta', eti: 'Valore iniziale di RAX', opzioni: [[4, '4'], [5, '5'], [10, '10']], valore: 4 }
    ],
    nota: 'Il modello impiega indirizzi fittizi. I blocchi sono due, entrambi terminati da RET.',
    previsione: {
      domanda: (p) => 'Il blocco A somma 3 a RAX e il blocco B lo raddoppia. Entrambi terminano con RET. RAX vale ' + p.x + ', e la pila contiene, a partire dalla cima, gli indirizzi di ' + p.o[0] + ', di ' + p.o[1] + ' e di fine. Quanto vale RAX quando l’esecuzione giunge a fine?',
      opzioni: (p) => { const U = SL.unita274; return Array.from(new Set([U.calcola(p.o, p.x), U.calcola(p.o[1] + p.o[0], p.x), U.calcola('AB', p.x), U.calcola('BA', p.x), U.calcola(p.o[0], p.x), p.x])).slice(0, 4).sort((a, b) => a - b).map((v) => [v, String(v)]); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita274, m = U.FA[p.o[0]](p.x); return 'La previsione indicava ' + pred + '. RAX vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il primo RET porta al blocco ' + p.o[0] + ', che trasforma ' + p.x + ' in ' + m + '. Il secondo porta al blocco ' + p.o[1] + ', che trasforma ' + m + ' in ' + esito + '.'); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita274, passi = [], IND = { A: 0x401100, B: 0x401200, F: 0x401300 }, HA = (a) => '0x' + a.toString(16).toUpperCase();
      const seq = [p.o[0], p.o[1], 'F'], v1 = U.FA[seq[0]](p.x), v2 = U.FA[seq[1]](v1);
      const st = { rsp: 0x7FD8, rax: p.x, dove: null };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'LA PILA', 'mono'), el.nota('n2', 470, 0, 'CODICE GIÀ PRESENTE NEL PROGRAMMA', 'mono')];
        X.pila('s', seq.map((b, k) => ({ a: 0x7FD8 + 8 * k, txt: HA(IND[b]), nota: b === 'F' ? 'fine' : 'blocco ' + b, st: o.presa === k ? 'att' : 0x7FD8 + 8 * k < st.rsp ? '' : null })).reverse(), { x: 20, y: 28, w: 150, passo: 50, rsp: st.rsp }).forEach((e) => els.push(e));
        els.push(el.box('ba', 470, 28, 370, 60, 'blocco A · 0x401100', 'add rax, 3 · ret', st.dove === 'A' ? 'att' : '', { cls: 'stretta' }),
          el.box('bb', 470, 98, 370, 60, 'blocco B · 0x401200', 'add rax, rax · ret', st.dove === 'B' ? 'att' : '', { cls: 'stretta' }),
          el.box('bf', 470, 168, 370, 50, 'fine · 0x401300', 'prosecuzione del programma', st.dove === 'F' ? 'att' : '', { cls: 'stretta' }),
          el.box('rip', 20, 200, 200, 58, 'RIP', st.dove ? HA(IND[st.dove]) : 'un’istruzione RET', o.salto ? 'att' : 'on', { cls: 'stretta' }),
          el.box('rax', 230, 200, 220, 58, 'RAX', String(st.rax), o.op ? 'att' : 'on', { cls: 'stretta' }),
          el.box('sto', 20, 280, 820, 58, 'i valori successivi di RAX', o.storia || String(p.x), o.op || o.fine ? 'on' : '', { cls: 'stretta' }));
        if (o.salto != null) els.push(el.linea('ls', 396, 50 + (2 - o.salto) * 50, 470, st.dove === 'A' ? 58 : st.dove === 'B' ? 128 : 193, 'att'));
        return els;
      };
      const hud = () => [['RSP', HA(st.rsp), 'a'], ['Blocco in esecuzione', st.dove ? (st.dove === 'F' ? 'fine' : st.dove) : '·'], ['RAX', String(st.rax), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const NOME = { A: 'somma 3', B: 'raddoppia' }, OP = (b, v) => (b === 'A' ? v + ' + 3 = ' + (v + 3) : v + ' × 2 = ' + v * 2);

      P({}, 0, 'Tre indirizzi in attesa', 'Una funzione sta per eseguire RET. Al posto dell’indirizzo di ritorno originale, una scrittura esterna ai limiti ha lasciato sulla pila tre indirizzi: quello del blocco ' + seq[0] + ', quello del blocco ' + seq[1] + ' e quello di fine. RAX vale ' + p.x + '. Tutti e tre gli indirizzi indicano codice già contenuto nel programma.',
        { chiedi: { d: 'RET preleva la cella in cima alla pila. A quale indirizzo salterà?', o: Array.from(new Set(seq.map((b) => HA(IND[b])))).sort(), g: Array.from(new Set(seq.map((b) => HA(IND[b])))).sort().indexOf(HA(IND[seq[0]])), no: 'In cima alla pila, all’indirizzo contenuto in RSP, si trova l’indirizzo del blocco ' + seq[0] + ': ' + HA(IND[seq[0]]) + '.' } });
      st.rsp = 0x7FE0; st.dove = seq[0];
      P({ presa: 0, salto: 0 }, 1, 'Il primo RET', 'RET preleva ' + HA(IND[seq[0]]) + ', lo scrive in RIP e porta RSP a 0x7FE0. L’esecuzione prosegue dal blocco ' + seq[0] + ', presente nel programma per altri scopi.', { calc: 'RIP = ' + HA(IND[seq[0]]) });
      st.rax = v1;
      P({ op: true, storia: OP(seq[0], p.x) }, 1, 'Il blocco ' + seq[0] + ' lavora', 'Il blocco ' + seq[0] + ' ' + NOME[seq[0]] + ' a RAX, che passa da ' + p.x + ' a ' + v1 + '. Subito dopo incontra il proprio RET, che preleverà la prossima cella della pila.',
        { calc: OP(seq[0], p.x), chiedi: { d: 'Il blocco termina con RET, e RSP vale 0x7FE0. Dove proseguirà l’esecuzione?', o: ['Nel blocco A', 'Nel blocco B', 'A fine'], g: seq[1] === 'A' ? 0 : 1, no: 'La cella a 0x7FE0 contiene l’indirizzo del blocco ' + seq[1] + '.' } });
      st.rsp = 0x7FE8; st.dove = seq[1];
      P({ presa: 1, salto: 1, storia: OP(seq[0], p.x) }, 2, 'Il secondo RET', 'Il RET del blocco ' + seq[0] + ' preleva la seconda cella, ' + HA(IND[seq[1]]) + ', e porta RSP a 0x7FE8. L’esecuzione ' + (seq[0] === seq[1] ? 'rientra nel medesimo blocco: il medesimo indirizzo, scritto due volte sulla pila, fa eseguire due volte il medesimo codice.' : 'passa al blocco ' + seq[1] + '.'), { calc: 'RIP = ' + HA(IND[seq[1]]) });
      st.rax = v2;
      P({ op: true, storia: OP(seq[0], p.x) + ' · poi ' + OP(seq[1], v1) }, 2, 'Il blocco ' + seq[1] + ' lavora', 'Il blocco ' + seq[1] + ' ' + NOME[seq[1]] + ' a RAX, che passa da ' + v1 + ' a ' + v2 + '. Il valore di partenza era quello lasciato dal blocco precedente.', { calc: OP(seq[1], v1) });
      st.rsp = 0x7FF0; st.dove = 'F';
      P({ presa: 2, salto: 2, fine: true, storia: OP(seq[0], p.x) + ' · poi ' + OP(seq[1], v1) }, 3, 'L’arrivo', 'Il terzo RET preleva l’indirizzo di fine, e il programma prosegue da tale punto con RAX uguale a ' + v2 + '. La pila è stata consumata una cella alla volta, come un elenco di istruzioni.', { calc: 'RAX = ' + v2 });
      const alt = U.calcola(p.o[1] + p.o[0], p.x);
      P({ fine: true, storia: OP(seq[0], p.x) + ' · poi ' + OP(seq[1], v1) }, 4, 'L’origine dell’ordine', 'I due blocchi esistevano già, e nessuna istruzione è stata aggiunta. La scelta dei blocchi eseguiti, e del loro ordine, è stata determinata dai tre numeri sulla pila. ' + (alt !== v2 ? 'Con i medesimi blocchi nell’ordine inverso RAX varrebbe ' + alt + '.' : 'Con due indirizzi uguali l’ordine è indifferente, ed è rilevante la ripetizione stessa.') + ' Per questa ragione l’indirizzo di ritorno va protetto anche quando la pila è priva del permesso di esecuzione.', { calc: 'RAX = ' + v2, esito: ['RAX = ' + v2, 'si'] });
      return { passi, esito: v2 };
    }
  },
  bilancio: {
    regola: [
      'RET salta all’indirizzo presente in cima alla pila, senza verificarne l’origine. Una sequenza di indirizzi sulla pila fa eseguire, uno dopo l’altro, blocchi di codice già presenti che terminano con RET.',
      'Il riuso del codice è privo di istruzioni nuove, e la memoria non eseguibile lo lascia possibile. Lo contrastano la sentinella, la disposizione casuale degli indirizzi e la pila ombra.'
    ],
    errori: [
      ['Ritenere che senza codice nuovo ogni effetto sia escluso.', 'Blocchi esistenti, eseguiti in un ordine scelto dall’esterno, compiono un calcolo estraneo alle previsioni del programma.'],
      ['Ritenere che RET torni sempre al chiamante.', 'RET torna all’indirizzo contenuto nella cella in cima alla pila. Esso coincide con il chiamante soltanto se tale cella è rimasta invariata.'],
      ['Trascurare l’ordine degli indirizzi.', 'Con RAX uguale a 4, sommare 3 e poi raddoppiare dà 14. Raddoppiare e poi sommare 3 dà 11.']
    ],
    saFare: ['Seguire una sequenza di RET, cella per cella.', 'Calcolare l’effetto di blocchi eseguiti in un ordine dato.', 'Indicare le difese che contrastano il riuso del codice.'],
    esercizi: [
      { d: 'Nel modello di questa unità il blocco A somma 3 a RAX e il blocco B lo raddoppia. RAX vale 6, e la pila contiene, dalla cima, gli indirizzi di B, di A e di fine. Quanto vale RAX all’arrivo a fine?', segnaposto: 'Un numero', giuste: ['15', 'quindici'],
        ok: 'Il primo RET porta al blocco B: 6 × 2 = 12. Il secondo porta al blocco A: 12 + 3 = 15.',
        diagnosi: [
          { se: ['18'], msg: 'Il valore indicato è il risultato con l’ordine inverso, A e poi B. In cima alla pila si trova l’indirizzo di B, eseguito per primo.' },
          { se: ['12'], msg: 'Il valore indicato è quello successivo al primo blocco. Il RET del blocco B porta poi al blocco A.' },
          { se: ['9'], msg: 'In tal modo sarebbe stato eseguito soltanto il blocco A. In cima alla pila si trova l’indirizzo di B.' }
        ],
        altro: 'Il valore è diverso. Si eseguano i blocchi nell’ordine in cui i loro indirizzi sono disposti sulla pila, dalla cima.',
        indizi: ['La cella in cima è prelevata per prima: è l’indirizzo di B.', 'Il blocco B raddoppia: 6 × 2 = 12.', 'Segue il blocco A, che somma 3.'],
        svolgimento: ['Primo RET: blocco B. RAX = 6 × 2 = 12.', 'Secondo RET: blocco A. RAX = 12 + 3 = 15.', 'Terzo RET: fine, con RAX = 15.'] },
      { d: 'Per quale ragione la memoria non eseguibile, da sola, lascia possibile il riuso del codice?', guida: 'Si scelga la risposta.', o: [
        { t: 'Le istruzioni eseguite appartengono già al programma, e si trovano in zone eseguibili', ok: true, fb: 'Sulla pila sono scritti soltanto indirizzi, cioè dati. Il codice eseguito è quello del programma, che deve restare eseguibile.' },
        { t: 'Durante RET la pila diventa per un istante eseguibile', fb: 'I permessi della pila restano invariati. RET legge un indirizzo dalla pila, senza eseguire alcuno dei byte che vi si trovano.' },
        { t: 'RET verifica soltanto una parte dell’indirizzo', fb: 'RET impiega per intero gli otto byte presenti in cima alla pila, senza alcun controllo.' }] }
    ],
    sfida: ['cslez2_7_04_random_assembly_04', 'Ordine e duplicazione dei valori sullo stack']
  }
});
SL.unita274 = (() => {
  const FA = { A: (v) => v + 3, B: (v) => v * 2, F: (v) => v };
  return { FA, calcola: (ordine, x) => ordine.split('').reduce((v, b) => FA[b](v), x) };
})();
