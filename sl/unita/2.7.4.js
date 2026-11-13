'use strict';
SL.registra('2.7.4', {
  titolo: 'Riuso del flusso di controllo',
  obiettivo: 'Alla fine saprai spiegare come una fila di indirizzi sulla pila può decidere l’ordine in cui vengono eseguiti blocchi di codice già presenti, e quali difese contrastano questo meccanismo.',
  concetti: [['puntatore', 'RET si fida della pila'], ['pila', 'Una fila di destinazioni'], ['scudo', 'Perché servono altre difese']],
  filigrana: ['pila', 'puntatore', 'scudo'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 2.6.2', t: 'RET', d: 'Preleva gli otto byte in cima alla pila, li mette in RIP e aggiunge 8 a RSP. Non controlla chi li abbia scritti.' },
      { sim: 'scudo', da: 'Dall’unità 2.7.2', t: 'Dato di controllo', d: 'Un dato che decide da dove proseguirà l’esecuzione, come l’indirizzo di ritorno.' },
      { sim: 'privilegi', da: 'Dall’unità 2.7.3', t: 'Memoria non eseguibile', d: 'Il processore rifiuta di eseguire istruzioni prese dalla pila e dalle altre zone di dati.' }
    ],
    domanda: { d: 'Prima di proseguire: che cosa fa RET con gli otto byte che trova in cima alla pila?', o: [
      { t: 'Li mette in RIP, qualunque cosa siano', ok: true, fb: 'RET preleva e salta. Che i byte siano stati posati da una CALL oppure scritti da una copia, per il processore è lo stesso.' },
      { t: 'Controlla che siano stati posati da una CALL', fb: 'Il processore non tiene traccia di chi ha scritto una cella. RET usa ciò che trova.' },
      { t: 'Li scarta e prosegue con l’istruzione successiva', fb: 'RET è un salto: il valore prelevato diventa l’indirizzo della prossima istruzione.' }
    ] }
  },
  idea: {
    titolo: 'Quando la pila detta l’ordine',
    termini: ['riuso del codice'],
    testo: [
      'La memoria non eseguibile impedisce di eseguire i byte copiati sulla pila. Lascia però aperta un’altra strada. Per RET un indirizzo posato da CALL e uno scritto da una copia sono la stessa cosa: preleva e salta. Chi riesce a scrivere la cella dell’indirizzo di ritorno sceglie dove riprende l’esecuzione, purché la destinazione sia codice che il programma contiene già.',
      'Le destinazioni possono essere più d’una. Se il codice raggiunto termina a sua volta con RET, quel RET preleva la cella successiva della pila, e poi la successiva ancora. Una fila di indirizzi sulla pila si comporta così come un programma: ogni indirizzo indica un blocco di istruzioni esistente, e i RET li collegano l’uno all’altro. Questa tecnica si chiama [[riuso del codice]].',
      { fig: 'scena', w: 720, h: 150, titolo: 'Una fila di indirizzi, una fila di blocchi', nota: 'Ogni RET preleva la cella successiva e porta l’esecuzione al blocco che essa indica.', els: [
        SL.el.cella('s0', 20, 6, 200, 40, 'indirizzo del blocco A', 'att', { piccola: true, cls: 'minuta' }), SL.el.cella('s1', 20, 54, 200, 40, 'indirizzo del blocco B', 'on', { piccola: true, cls: 'minuta' }), SL.el.cella('s2', 20, 102, 200, 40, 'indirizzo di fine', '', { piccola: true, cls: 'minuta' }),
        SL.el.box('a', 420, 0, 290, 46, 'blocco A', 'somma 3 · ret', 'att', { cls: 'stretta' }), SL.el.box('b', 420, 52, 290, 46, 'blocco B', 'raddoppia · ret', 'on', { cls: 'stretta' }), SL.el.box('f', 420, 104, 290, 42, null, 'fine', '', { cls: 'stretta' }),
        SL.el.linea('l0', 220, 26, 420, 23, 'att'), SL.el.linea('l1', 220, 74, 420, 75, 'on'), SL.el.linea('l2', 220, 122, 420, 125, '')] },
      'Nessuna istruzione nuova viene eseguita: ogni blocco apparteneva già al programma o alle sue librerie. A cambiare è l’ordine, e l’ordine è deciso da dati. La pila, costruita per ricordare da dove si è arrivati, viene usata per dire dove andare.',
      'Conoscere il meccanismo serve a valutare le difese. La sentinella ferma il traboccamento continuo prima che RET venga eseguita. La disposizione casuale degli indirizzi nasconde dove si trovano i blocchi. La pila ombra dell’unità 2.7.6 verifica che ogni RET torni dove una CALL aveva stabilito. E la correzione vera resta a monte, nella scrittura fuori limite da cui tutto ha origine.'
    ]
  },
  esperimento: {
    faremo: [
      'Il modello ha due blocchi di codice già presenti nel programma, ciascuno terminato da RET. Il blocco A somma 3 a RAX, il blocco B lo raddoppia. Sulla pila stanno tre indirizzi. Sceglierai quali, e il valore iniziale di RAX.',
      'Seguiremo i tre RET uno dopo l’altro, guardando quale blocco viene raggiunto e che cosa accade a RAX. Dopo il caso proposto, scambia l’ordine dei primi due indirizzi e prevedi il nuovo risultato.'
    ],
    vedrai: [
      ['pila', 'La pila', 'A sinistra: le tre celle con gli indirizzi, e la cima indicata da RSP.'],
      ['operation', 'I blocchi', 'A destra: i due blocchi e il punto di arrivo, con i loro indirizzi.'],
      ['register', 'RAX', 'In basso: il valore di RAX dopo ogni blocco.']
    ]
  },
  lab: {
    titolo: 'Tre indirizzi sulla pila, tre salti',
    scena: { w: 860, h: 348 },
    atti: ['La pila prima di RET', 'Il primo salto', 'Il secondo salto', 'L’arrivo', 'Chi ha deciso l’ordine'],
    controlli: [
      { id: 'o', tipo: 'scelta', eti: 'Indirizzi sulla pila, dalla cima', opzioni: [['AB', 'A, B, fine'], ['BA', 'B, A, fine'], ['AA', 'A, A, fine'], ['BB', 'B, B, fine']], valore: 'AB' },
      { id: 'x', tipo: 'scelta', eti: 'RAX all’inizio', opzioni: [[4, '4'], [5, '5'], [10, '10']], valore: 4 }
    ],
    nota: 'Il modello usa indirizzi di fantasia. I blocchi sono due, entrambi terminati da RET.',
    previsione: {
      domanda: (p) => 'Il blocco A somma 3 a RAX e il blocco B lo raddoppia. Entrambi terminano con RET. RAX vale ' + p.x + ', e la pila contiene, a partire dalla cima, gli indirizzi di ' + p.o[0] + ', di ' + p.o[1] + ' e di fine. Quanto vale RAX quando l’esecuzione arriva a fine?',
      opzioni: (p) => { const U = SL.unita274; return Array.from(new Set([U.calcola(p.o, p.x), U.calcola(p.o[1] + p.o[0], p.x), U.calcola('AB', p.x), U.calcola('BA', p.x), U.calcola(p.o[0], p.x), p.x])).slice(0, 4).sort((a, b) => a - b).map((v) => [v, String(v)]); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita274, m = U.FA[p.o[0]](p.x); return 'Avevi previsto ' + pred + '. RAX vale ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il primo RET porta al blocco ' + p.o[0] + ', che trasforma ' + p.x + ' in ' + m + '. Il secondo porta al blocco ' + p.o[1] + ', che trasforma ' + m + ' in ' + esito + '.'); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita274, passi = [], IND = { A: 0x401100, B: 0x401200, F: 0x401300 }, HA = (a) => '0x' + a.toString(16).toUpperCase();
      const seq = [p.o[0], p.o[1], 'F'], v1 = U.FA[seq[0]](p.x), v2 = U.FA[seq[1]](v1);
      const st = { rsp: 0x7FD8, rax: p.x, dove: null };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'LA PILA', 'mono'), el.nota('n2', 470, 0, 'CODICE GIÀ PRESENTE NEL PROGRAMMA', 'mono')];
        X.pila('s', seq.map((b, k) => ({ a: 0x7FD8 + 8 * k, txt: HA(IND[b]), nota: b === 'F' ? 'fine' : 'blocco ' + b, st: o.presa === k ? 'att' : 0x7FD8 + 8 * k < st.rsp ? '' : null })).reverse(), { x: 20, y: 28, w: 150, passo: 50, rsp: st.rsp }).forEach((e) => els.push(e));
        els.push(el.box('ba', 470, 28, 370, 60, 'blocco A · 0x401100', 'add rax, 3 · ret', st.dove === 'A' ? 'att' : '', { cls: 'stretta' }),
          el.box('bb', 470, 98, 370, 60, 'blocco B · 0x401200', 'add rax, rax · ret', st.dove === 'B' ? 'att' : '', { cls: 'stretta' }),
          el.box('bf', 470, 168, 370, 50, 'fine · 0x401300', 'il programma prosegue da qui', st.dove === 'F' ? 'att' : '', { cls: 'stretta' }),
          el.box('rip', 20, 200, 200, 58, 'RIP', st.dove ? HA(IND[st.dove]) : 'un’istruzione RET', o.salto ? 'att' : 'on', { cls: 'stretta' }),
          el.box('rax', 230, 200, 220, 58, 'RAX', String(st.rax), o.op ? 'att' : 'on', { cls: 'stretta' }),
          el.box('sto', 20, 280, 820, 58, 'la storia di RAX', o.storia || String(p.x), o.op || o.fine ? 'on' : '', { cls: 'stretta' }));
        if (o.salto != null) els.push(el.linea('ls', 396, 50 + (2 - o.salto) * 50, 470, st.dove === 'A' ? 58 : st.dove === 'B' ? 128 : 193, 'att'));
        return els;
      };
      const hud = () => [['RSP', HA(st.rsp), 'a'], ['Blocco in esecuzione', st.dove ? (st.dove === 'F' ? 'fine' : st.dove) : '·'], ['RAX', String(st.rax), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const NOME = { A: 'somma 3', B: 'raddoppia' }, OP = (b, v) => (b === 'A' ? v + ' + 3 = ' + (v + 3) : v + ' × 2 = ' + v * 2);

      P({}, 0, 'Tre indirizzi in attesa', 'Una funzione sta per eseguire RET. Al posto dell’indirizzo di ritorno originale, una scrittura fuori limite ha lasciato sulla pila tre indirizzi: quello del blocco ' + seq[0] + ', quello del blocco ' + seq[1] + ' e quello di fine. RAX vale ' + p.x + '. Tutti e tre gli indirizzi indicano codice che il programma contiene già.',
        { chiedi: { d: 'RET preleva la cella in cima alla pila. A quale indirizzo salterà?', o: Array.from(new Set(seq.map((b) => HA(IND[b])))).sort(), g: Array.from(new Set(seq.map((b) => HA(IND[b])))).sort().indexOf(HA(IND[seq[0]])), no: 'In cima alla pila, dove punta RSP, sta l’indirizzo del blocco ' + seq[0] + ': ' + HA(IND[seq[0]]) + '.' } });
      st.rsp = 0x7FE0; st.dove = seq[0];
      P({ presa: 0, salto: 0 }, 1, 'Il primo RET', 'RET preleva ' + HA(IND[seq[0]]) + ', lo mette in RIP e porta RSP a 0x7FE0. L’esecuzione prosegue dal blocco ' + seq[0] + ', che il programma conteneva per altri scopi.', { calc: 'RIP = ' + HA(IND[seq[0]]) });
      st.rax = v1;
      P({ op: true, storia: OP(seq[0], p.x) }, 1, 'Il blocco ' + seq[0] + ' lavora', 'Il blocco ' + seq[0] + ' ' + NOME[seq[0]] + ' a RAX, che passa da ' + p.x + ' a ' + v1 + '. Subito dopo incontra il proprio RET, che preleverà la prossima cella della pila.',
        { calc: OP(seq[0], p.x), chiedi: { d: 'Il blocco termina con RET, e RSP vale 0x7FE0. Dove proseguirà l’esecuzione?', o: ['Nel blocco A', 'Nel blocco B', 'A fine'], g: seq[1] === 'A' ? 0 : 1, no: 'La cella a 0x7FE0 contiene l’indirizzo del blocco ' + seq[1] + '.' } });
      st.rsp = 0x7FE8; st.dove = seq[1];
      P({ presa: 1, salto: 1, storia: OP(seq[0], p.x) }, 2, 'Il secondo RET', 'Il RET del blocco ' + seq[0] + ' preleva la seconda cella, ' + HA(IND[seq[1]]) + ', e porta RSP a 0x7FE8. L’esecuzione ' + (seq[0] === seq[1] ? 'rientra nello stesso blocco: lo stesso indirizzo, scritto due volte sulla pila, fa eseguire due volte lo stesso codice.' : 'passa al blocco ' + seq[1] + '.'), { calc: 'RIP = ' + HA(IND[seq[1]]) });
      st.rax = v2;
      P({ op: true, storia: OP(seq[0], p.x) + ' · poi ' + OP(seq[1], v1) }, 2, 'Il blocco ' + seq[1] + ' lavora', 'Il blocco ' + seq[1] + ' ' + NOME[seq[1]] + ' a RAX, che passa da ' + v1 + ' a ' + v2 + '. Il valore di partenza era quello lasciato dal blocco precedente.', { calc: OP(seq[1], v1) });
      st.rsp = 0x7FF0; st.dove = 'F';
      P({ presa: 2, salto: 2, fine: true, storia: OP(seq[0], p.x) + ' · poi ' + OP(seq[1], v1) }, 3, 'L’arrivo', 'Il terzo RET preleva l’indirizzo di fine, e il programma prosegue da lì con RAX uguale a ' + v2 + '. La pila è stata consumata una cella alla volta, come un elenco di istruzioni.', { calc: 'RAX = ' + v2 });
      const alt = U.calcola(p.o[1] + p.o[0], p.x);
      P({ fine: true, storia: OP(seq[0], p.x) + ' · poi ' + OP(seq[1], v1) }, 4, 'Chi ha deciso l’ordine', 'I due blocchi esistevano già, e nessuna istruzione è stata aggiunta. A stabilire quali eseguire, e in quale ordine, sono stati i tre numeri sulla pila. ' + (alt !== v2 ? 'Con gli stessi blocchi nell’ordine inverso RAX varrebbe ' + alt + '.' : 'Con due indirizzi uguali l’ordine è indifferente, e conta il fatto stesso della ripetizione.') + ' Per questo l’indirizzo di ritorno va protetto anche quando la pila non è eseguibile.', { calc: 'RAX = ' + v2, esito: ['RAX = ' + v2, 'si'] });
      return { passi, esito: v2 };
    }
  },
  bilancio: {
    regola: [
      'RET salta all’indirizzo che trova in cima alla pila, senza verificarne l’origine. Una fila di indirizzi sulla pila fa eseguire, uno dopo l’altro, blocchi di codice già presenti che terminano con RET.',
      'Il riuso del codice non introduce istruzioni nuove, e la memoria non eseguibile non lo ferma. Lo contrastano la sentinella, la disposizione casuale degli indirizzi e la pila ombra.'
    ],
    errori: [
      ['Credere che senza codice nuovo non possa accadere nulla.', 'Blocchi esistenti, eseguiti in un ordine scelto da altri, compiono un calcolo che il programma non prevedeva.'],
      ['Pensare che RET torni sempre al chiamante.', 'RET torna dove dice la cella in cima alla pila. Coincide con il chiamante soltanto se quella cella è rimasta intatta.'],
      ['Trascurare l’ordine degli indirizzi.', 'Con RAX uguale a 4, sommare 3 e poi raddoppiare dà 14. Raddoppiare e poi sommare 3 dà 11.']
    ],
    saFare: ['Seguo una fila di RET, cella per cella.', 'Calcolo l’effetto di blocchi eseguiti in un ordine dato.', 'Dico quali difese contrastano il riuso del codice.'],
    esercizi: [
      { d: 'Nel modello di questa unità il blocco A somma 3 a RAX e il blocco B lo raddoppia. RAX vale 6, e la pila contiene, dalla cima, gli indirizzi di B, di A e di fine. Quanto vale RAX all’arrivo a fine?', segnaposto: 'Un numero', giuste: ['15', 'quindici'],
        ok: 'Il primo RET porta al blocco B: 6 × 2 = 12. Il secondo porta al blocco A: 12 + 3 = 15.',
        diagnosi: [
          { se: ['18'], msg: 'Questo è il risultato con l’ordine inverso, A e poi B. In cima alla pila sta l’indirizzo di B, che viene eseguito per primo.' },
          { se: ['12'], msg: 'Questo è il valore dopo il primo blocco. Il RET del blocco B porta poi al blocco A.' },
          { se: ['9'], msg: 'Così sarebbe stato eseguito soltanto il blocco A. In cima alla pila sta l’indirizzo di B.' }
        ],
        altro: 'Il valore è diverso. Esegui i blocchi nell’ordine in cui i loro indirizzi stanno sulla pila, dalla cima.',
        indizi: ['La cella in cima viene prelevata per prima: è l’indirizzo di B.', 'Il blocco B raddoppia: 6 × 2 = 12.', 'Poi il blocco A somma 3.'],
        svolgimento: ['Primo RET: blocco B. RAX = 6 × 2 = 12.', 'Secondo RET: blocco A. RAX = 12 + 3 = 15.', 'Terzo RET: fine, con RAX = 15.'] },
      { d: 'Per quale ragione la memoria non eseguibile, da sola, lascia possibile il riuso del codice?', guida: 'Scegli la risposta.', o: [
        { t: 'Le istruzioni eseguite appartengono già al programma, e stanno in zone eseguibili', ok: true, fb: 'Sulla pila finiscono soltanto indirizzi, cioè dati. Il codice eseguito è quello del programma, che deve restare eseguibile.' },
        { t: 'Durante RET la pila diventa per un istante eseguibile', fb: 'I permessi della pila non cambiano. RET legge un indirizzo dalla pila, e non esegue nulla di ciò che vi si trova.' },
        { t: 'RET controlla soltanto una parte dell’indirizzo', fb: 'RET usa per intero gli otto byte che trova in cima alla pila, senza alcun controllo.' }] }
    ],
    sfida: ['cslez2_7_04_random_assembly_04', 'Ordine e duplicazione dei valori sullo stack']
  }
});
SL.unita274 = (() => {
  const FA = { A: (v) => v + 3, B: (v) => v * 2, F: (v) => v };
  return { FA, calcola: (ordine, x) => ordine.split('').reduce((v, b) => FA[b](v), x) };
})();
